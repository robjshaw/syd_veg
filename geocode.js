const fs = require('fs');
const https = require('https');

const API_KEY = 'AIzaSyDsxxQuFb9kA9fK1SsS6n2s3w_1-qUvJj0';
const INPUT_FILE = 'syd-veg.json';
const OUTPUT_FILE = 'syd-veg-geocoded.json';

// Read the input JSON file
const restaurants = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));

// Function to geocode an address using Google Maps Geocoding API
function geocodeAddress(address) {
    return new Promise((resolve, reject) => {
        const encodedAddress = encodeURIComponent(address);
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${API_KEY}`;

        https.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    if (result.status === 'OK' && result.results[0]) {
                        resolve({
                            lat: result.results[0].geometry.location.lat,
                            lng: result.results[0].geometry.location.lng,
                            formatted_address: result.results[0].formatted_address
                        });
                    } else {
                        console.warn(`Geocoding failed for ${address}: ${result.status}`);
                        resolve(null);
                    }
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}

// Function to add delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Main function to geocode all restaurants
async function geocodeRestaurants() {
    console.log(`Geocoding ${restaurants.length} restaurants...`);
    const geocodedRestaurants = [];

    for (let i = 0; i < restaurants.length; i++) {
        const restaurant = restaurants[i];
        const address = `${restaurant.title}, ${restaurant.location}, Sydney, Australia`;

        try {
            console.log(`[${i + 1}/${restaurants.length}] Geocoding: ${restaurant.title}`);
            const coordinates = await geocodeAddress(address);

            if (coordinates) {
                restaurant.coordinates = coordinates;
                geocodedRestaurants.push(restaurant);
                console.log(`  ✓ ${coordinates.formatted_address}`);
            } else {
                console.log(`  ✗ Failed to geocode`);
            }

            // Add delay to avoid rate limits (100ms between requests)
            await delay(100);
        } catch (error) {
            console.error(`Error geocoding ${restaurant.title}:`, error.message);
        }
    }

    // Write to output file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(geocodedRestaurants, null, 2));
    console.log(`\nGeocoded data saved to ${OUTPUT_FILE}`);
    console.log(`Successfully geocoded ${geocodedRestaurants.length} out of ${restaurants.length} restaurants`);
}

// Run the geocoding
geocodeRestaurants().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
