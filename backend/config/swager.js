import swaggerJsdoc from "swagger-jsdoc";
import dotenv from "dotenv";

dotenv.config();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Nordic Home Healthcare API Documentation",
      version: "1.0.0",
      description:
        "A Node.js + Express.js project with MongoDB for building robust web applications",
      contact: {
        name: "API Support",
        email: "qasimyousaf0786@gmail.com",
      },
      license: {
        name: "ISC",
        url: "https://opensource.org/licenses/ISC",
      },
    },

    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? "https://api.nordic.com"
            : `http://localhost:${process.env.PORT || 3100}`,
        description:
          process.env.NODE_ENV === "production"
            ? "Production server"
            : "Development server",
      },
    ],

    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          required: ["name", "email", "phone", "password"],
          properties: {
            _id: { type: "string" },
            name: { type: "string", example: "John Doe" },
            email: { type: "string", format: "email", example: "john@example.com" },
            phone: { type: "string", example: "1234567890" },
            password: { type: "string", example: "Pass@123" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },

        Service: {
          type: "object",
          required: ["title"],
          properties: {
            _id: { type: "string" },
            title: { type: "string", example: "Service Title" },
            description: { type: "string", example: "Service Description" },
            actualPrice: { type: "number", example: 100 },
            discountPrice: { type: "number", example: 80 },
            category: { type: "string", example: "Category Name" },
            keyBenefits: {
              type: "array",
              items: { type: "string" },
            },
            keyIngredients: {
              type: "array",
              items: { type: "string" },
            },
            disclaimer: { type: "string" },
            images: {
              type: "array",
              items: { type: "string" },
              description: "Array of image URLs (maximum 3 images)",
            },
            subServices: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Sub Service" },
                  price: { type: "number", example: 50 },
                  discountPercent: { type: "number", example: 10 },
                },
              },
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },

        Category: {
          type: "object",
          required: ["name"],
          properties: {
            _id: { type: "string" },
            name: { type: "string", example: "Category Name" },
            description: { type: "string", example: "Category Description" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },

        Order: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string", nullable: true, description: "User ID if logged in, null for guests" },
            customerName: { type: "string", example: "John Doe" },
            serviceName: { type: "string", example: "Home Care" },
            price: { type: "number", example: 100 },
            address: { type: "string", example: "123 Main St" },
            phoneNumber: { type: "string", example: "1234567890" },
            date: { type: "string", example: "2026-03-01" },
            time: { type: "string", example: "10:00" },
            paymentMethod: { type: "string", example: "cash" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
    },

    security: [],
  },

  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);
export default specs;
