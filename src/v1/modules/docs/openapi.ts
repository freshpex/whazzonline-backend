export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Whazzonline API',
    version: '1.0.0',
    description: 'REST API for Whazzonline authentication, product browsing, and product management.'
  },
  servers: [
    {
      url: '/api/v1'
    }
  ],
  tags: [
    { name: 'Health' },
    { name: 'Auth' },
    { name: 'Products' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      ApiError: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Please log in to continue.' }
        }
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string', nullable: true, example: 'customer@whazzonline.com' },
          phone: { type: 'string', nullable: true, example: '+2348000000003' },
          role: { type: 'string', enum: ['customer', 'vendor', 'admin'] },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      AuthResponse: {
        type: 'object',
        properties: {
          user: { $ref: '#/components/schemas/User' },
          token: { type: 'string' }
        }
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string', example: 'Wireless Noise Cancelling Headphones' },
          price: { type: 'number', example: 74500 },
          description: { type: 'string' },
          imageUrl: { type: 'string', format: 'uri' },
          category: { type: 'string', example: 'Electronics' },
          stock: { type: 'integer', example: 18 }
        }
      },
      ProductInput: {
        type: 'object',
        required: ['name', 'price', 'description', 'imageUrl', 'category', 'stock'],
        properties: {
          name: { type: 'string' },
          price: { type: 'number', minimum: 1 },
          description: { type: 'string' },
          imageUrl: { type: 'string', format: 'uri' },
          category: { type: 'string' },
          stock: { type: 'integer', minimum: 0 }
        }
      }
    }
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Check API health',
        responses: {
          '200': {
            description: 'Service is healthy'
          }
        }
      }
    },
    '/auth/signup': {
      post: {
        tags: ['Auth'],
        summary: 'Create a customer or vendor account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  phone: { type: 'string' },
                  password: { type: 'string', minLength: 8 },
                  role: { type: 'string', enum: ['customer', 'vendor'], default: 'customer' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Account created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/AuthResponse' }
                  }
                }
              }
            }
          },
          '400': { description: 'Invalid signup details' },
          '409': { description: 'Email or phone already exists' }
        }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Log in with email or phone',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  phone: { type: 'string' },
                  password: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Logged in successfully' },
          '401': { description: 'Invalid credentials' }
        }
      }
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Return current authenticated user',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Current user' },
          '401': { description: 'Authentication required' }
        }
      }
    },
    '/auth/users': {
      post: {
        tags: ['Auth'],
        summary: 'Create a user as an admin',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['password', 'role'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  phone: { type: 'string' },
                  password: { type: 'string', minLength: 8 },
                  role: { type: 'string', enum: ['customer', 'vendor', 'admin'], default: 'vendor' }
                }
              }
            }
          }
        },
        responses: {
          '201': { description: 'User created' },
          '403': { description: 'Admin access required' }
        }
      }
    },
    '/products': {
      get: {
        tags: ['Products'],
        summary: 'List products',
        parameters: [
          { name: 'q', in: 'query', schema: { type: 'string' }, description: 'Search name and description' },
          { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Filter by category' }
        ],
        responses: {
          '200': { description: 'Products returned' }
        }
      },
      post: {
        tags: ['Products'],
        summary: 'Create a product as an admin or vendor',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProductInput' }
            }
          }
        },
        responses: {
          '201': { description: 'Product created' },
          '403': { description: 'Admin or vendor access required' }
        }
      }
    },
    '/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Get a product by id',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          '200': { description: 'Product returned' },
          '404': { description: 'Product not found' }
        }
      }
    }
  }
};
