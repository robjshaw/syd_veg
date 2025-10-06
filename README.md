# Sydney Vegetarian & Vegan Restaurants Explorer

An interactive map-based web application showcasing vegetarian and vegan restaurants in Sydney, based on two years of recommendations from [r/foodies_sydney](https://www.reddit.com/r/foodies_sydney/).

## Features

- Interactive Google Maps integration
- Filter restaurants by cuisine type
- Click markers or list items for detailed restaurant information
- No ads or tracking - built as a community thank you

## Files

- `index.html` - Main web application
- `syd-veg.json` - Original restaurant data
- `syd-veg-geocoded.json` - Geocoded restaurant data with coordinates
- `geocode.js` - Node.js script to geocode restaurant addresses

## Usage

Simply open `index.html` in a web browser to explore the restaurants.

## Running the Geocoder

If you need to re-geocode the restaurant data:

```bash
node geocode.js
```

Note: Requires a Google Maps API key (set in `geocode.js`).

## Data Structure

Each restaurant includes:
- Title and location
- Cuisine types and specialties
- Community votes and comments
- Geographic coordinates

## Credits

Built by [robjshaw](https://github.com/robjshaw/) on a Sunday afternoon.
