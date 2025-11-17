const swaggerAutogen = require("swagger-autogen")(); 

const doc = { 
    info: { 
        title: "Users Service API", 
        description: "Swagger documentation for Users Microservice", 
    }, 
    host: "localhost:3000", 
    schemes: ["http"], 
    tags: [ // the sections that will be presented in swagger page 
        { name: "Users", description: "Endpoints related to users" }, 
    ], 
    definitions: { // the objects used in the request and response bodies 
        GetUser: { // GET response bodies come with id 
            id: 123, 
            name: "Example Name", 
            email: "example@mail.com" 
        }, 

        CreateUser: { // POST/PUT request bodies are sent without id 
            name: "Example Name", 
            email: "example@mail.com" 
        },

    } 
}; 
 
const outputFile = "./swagger-output.json"; 
const endpointsFiles = ["./app.js"]; 
 
swaggerAutogen(outputFile, endpointsFiles, doc);