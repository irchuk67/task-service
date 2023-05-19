const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./src/routes/api/tasks.js']

swaggerAutogen(outputFile, endpointsFiles)