import express from 'express';
import { setRoutes } from './routes/index';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import fs from 'fs';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Load OpenAPI specification
const swaggerDocument = YAML.parse(fs.readFileSync(path.join(__dirname, 'openapi', 'openapi.yaml'), 'utf8'));

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Set up routes
setRoutes(app);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});