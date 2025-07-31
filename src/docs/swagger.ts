import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        version: "v0.0.1",
        title: "Dokumentasi API Acara",
        description: "Dokumentasi API Acara"
    },
    servers: [
        {
            url: "http://localhost:3000/api",
            description: "Local server"
        },
        {
            url: "https://wpu-backend-acara.vercel.app/api",
            description: "Deploy server"
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer"
            },
        },
        schemas: {
            LoginRequest: {
                identifier: "Yuzuha",
                password: "spookShack123",
            }, 
            RequestBody: {
                fullName: "Ukinami Yuzuha",
                username: "yuzuha",
                email: "yuzuha16@yopmail.com",
                password: "12345SpookShack",
                confirmPassword: "12345SpookShack"
            },
            ActivationRequest: {
                code: "12345abcdef"
            }
        }
    },
    paths: {
        '/auth/activation': {
            post: {
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ActivationRequest'
                            }
                        }
                    }
                }
            }
        }
    }
}

const outputFile = "./swagger_output.json";
const endpointsFiles= ["../routes/api.ts"];

swaggerAutogen({openapi: "3.0.0"})(outputFile, endpointsFiles, doc);