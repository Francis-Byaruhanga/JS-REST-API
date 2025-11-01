const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const redoc = require('redoc-express');

// Build an absolute path to the routes file so swagger-jsdoc can find JSDoc
const routesPath = path.join(__dirname, '..', 'routes', 'productRoutes.js');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Product API Documentation',
            version: '1.0.0',
            description: 'API for managing products in a catalog'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server'
            }
        ]
    },
    apis: [routesPath]
};

// Generate OpenAPI spec from JSDoc comments
const specs = swaggerJsdoc(options);

module.exports = (app) => {
    // Serve the OpenAPI spec as JSON
    app.use('/docs/spec', (_req, res) => {
        res.json(specs);
    });

    // Serve Redoc UI at /docs
    app.use('/docs', redoc({
        title: 'Product API Documentation',
        specUrl: '/docs/spec',
        redocOptions: {
            theme: {
                colors: {
                    primary: {
                        main: '#0099ff'
                    }
                }
            }
        }
    }));
};