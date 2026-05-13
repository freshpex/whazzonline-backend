import { Router } from 'express';
import { openApiDocument } from '../openapi.js';

export const docsRouter = Router();

docsRouter.get('/openapi.json', (_req, res) => {
  res.json(openApiDocument);
});

docsRouter.get('/', (_req, res) => {
  res.type('html').send(`
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Whazzonline API Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.ui = SwaggerUIBundle({
        url: '/api/v1/docs/openapi.json',
        dom_id: '#swagger-ui'
      });
    </script>
  </body>
</html>
`);
});
