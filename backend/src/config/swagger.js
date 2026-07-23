const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Book Store API',
      version: '1.0.0',
      description: 'API documentation for the Book Store E-commerce application',
    },
    servers: [
      {
        url: process.env.SERVER_URL,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Admin JWT Token',
        },
        firebaseAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Customer Firebase ID Token',
        }
      },
    },
  },
  // Paths to files containing OpenAPI definitions
  apis: ['./src/**/*.route.js', './src/**/*.router.js'],
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
