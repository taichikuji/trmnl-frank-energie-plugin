# trmnl-frank-energie-plugin

Frank Energie pricing data + TRMNL templates. This README is focused on development and running the Netlify API locally.

## Requirements

- Docker (for the TRMNL template server)
- Netlify CLI (for the local API)

## Local development

### TRMNL templates

Run the local template server (watches files under TRMNL/src):

```shell
make serve
```

This starts a local server at http://localhost:4567.

### Netlify API (Node.js)

The API is a Netlify function defined in functions/api.mjs and exposed at /api.

Install dependencies and start the dev server:

```shell
npm install
npm run dev
```

This starts Netlify Dev and serves the function at http://localhost:8888/api.

## How the API works

- The function queries the Frank GraphQL endpoint for today in UTC.
- It computes total_price per entry and returns electricity and gas arrays.
- The TRMNL plugin polls the deployed endpoint configured in TRMNL/src/settings.yml.

## Deployment

Use the Netlify CLI to deploy:

```shell
npm run deploy
```

For production:

```shell
npm run deploy:prod
```

## References

- [Marktprijzen API](https://reversed.notion.site/Marktprijzen-API-89ce600a88ac4abe8c2ad89d3167a83e)
- [Home Assistant Frank Energie const.py](https://raw.githubusercontent.com/bajansen/home-assistant-frank_energie/412c1c61eebeaa89e2b067b0d93042e446b55a01/custom_components/frank_energie/const.py)
- [Home Assistant Frank Energie repo](https://github.com/bajansen/home-assistant-frank_energie/)
- [TRMNLP repo](https://github.com/usetrmnl/trmnlp)
- [TRMNL Private Plugins Templates Documentation](https://docs.usetrmnl.com/go/private-plugins/templates)

