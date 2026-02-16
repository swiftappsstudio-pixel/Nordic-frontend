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
      schemas: {
        User: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },

        Service: {
          type: "object",
          required: [
            "title",
            "description",
            "actualPrice",
            "discountPrice",
            "category",
            "keyBenefits",
            "keyIngredients",
            "disclaimer",
            "images",
          ],
          properties: {
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
          },
        },


          Category: {
          type: "object",
          required: ["name", "description"],
          properties: {
            name: { type: "string", example: "Category Name" },
            description: { type: "string", example: "Category Description" },
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
