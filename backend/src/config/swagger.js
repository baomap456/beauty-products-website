const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

function setupSwagger(app) {
    const options = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Beauty Products API',
                version: '1.0.0',
                description: 'API documentation for Beauty Products website',
            },
            servers: [
                {
                    url: 'http://localhost:3000/api',
                    description: 'Development server',
                },
            ],
        },
        apis: ['./src/routers/*.js'], // nơi chứa các route có swagger annotation
    };

    const specs = swaggerJsdoc(options);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}

module.exports = { setupSwagger };
