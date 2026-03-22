import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

const app = express();

// Use absolute path to YAML to avoid path issues
const swaggerDocument = YAML.load(path.join(__dirname, 'openapi.yaml'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(3000, () => {
  console.log('Swagger docs running at http://localhost:3000/api-docs');
});