const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerPath = '/api-docs';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Beauty Products API',
            version: '1.0.0',
            description: 'API documentation for Beauty Products website'
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [{ bearerAuth: [] }],
    },

    // quét tất cả file trong routers và các thư mục con
    apis: [path.join(__dirname, '..', 'routers', '**', '*.js')]
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
    app.use(swaggerPath, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = { setupSwagger, swaggerPath };
