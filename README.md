# Lekha Website

This folder contains the standalone public marketing website for Lekha.

## What it is

- Separate from the billing web app in `/frontend`
- Pure static HTML, CSS, and JavaScript
- Submits demo requests to the backend endpoint at `/api/demo-requests`

## Files

- `index.html`: page structure
- `styles.css`: visual design
- `content.js`: editable pricing, features, and contact data
- `script.js`: rendering and form submission logic

## Demo request API

By default the website posts demo requests to:

```txt
http://localhost:5002/api/demo-requests
```

Change `apiBaseUrl` in `content.js` for production.
