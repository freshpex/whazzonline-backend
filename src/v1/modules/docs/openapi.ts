export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Whazzonline API',
    version: '1.1.0',
    description: 'REST API for authentication, catalog, reviews, admin operations, and checkout simulation.'
  },
  servers: [{ url: '/api/v1' }],
  tags: [{ name: 'Health' }, { name: 'Auth' }, { name: 'Products' }, { name: 'Orders' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          price: { type: 'number' },
          description: { type: 'string' },
          imageUrl: { type: 'string', format: 'uri' },
          category: { type: 'string' },
          stock: { type: 'integer' }
        }
      },
      PaginatedProducts: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/Product' }
          },
          page: { type: 'integer' },
          limit: { type: 'integer' },
          total: { type: 'integer' },
          totalPages: { type: 'integer' }
        }
      },
      Review: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          productId: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid' },
          rating: { type: 'integer', minimum: 1, maximum: 5 },
          comment: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          reviewer: { type: 'string' }
        }
      },
      CheckoutResult: {
        type: 'object',
        properties: {
          orderId: { type: 'string', format: 'uuid' },
          totalAmount: { type: 'number' },
          paymentMethod: {
            type: 'string',
            enum: ['card', 'bank_transfer', 'ussd', 'wallet', 'cash_on_delivery']
          },
          status: { type: 'string', enum: ['paid'] },
          reference: { type: 'string' }
        }
      }
    }
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Check API health',
        responses: { '200': { description: 'Service is healthy' } }
      }
    },
    '/products': {
      get: {
        tags: ['Products'],
        summary: 'List products with search/filter/pagination',
        parameters: [
          { name: 'q', in: 'query', schema: { type: 'string' } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 9 } }
        ],
        responses: {
          '200': {
            description: 'Paginated product list',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/PaginatedProducts' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/products/categories': {
      get: {
        tags: ['Products'],
        summary: 'List unique product categories',
        responses: { '200': { description: 'Categories list' } }
      }
    },
    '/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Get product by id',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'Product found' }, '404': { description: 'Product not found' } }
      }
    },
    '/products/{id}/reviews': {
      get: {
        tags: ['Products'],
        summary: 'List product reviews',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'Reviews returned' } }
      },
      post: {
        tags: ['Products'],
        summary: 'Create or update product review',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['rating'],
                properties: {
                  rating: { type: 'integer', minimum: 1, maximum: 5 },
                  comment: { type: 'string', maxLength: 500 }
                }
              }
            }
          }
        },
        responses: { '201': { description: 'Review saved' }, '401': { description: 'Authentication required' } }
      }
    },
    '/orders/checkout': {
      post: {
        tags: ['Orders'],
        summary: 'Simulate checkout and create paid order',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['paymentMethod', 'items'],
                properties: {
                  paymentMethod: {
                    type: 'string',
                    enum: ['card', 'bank_transfer', 'ussd', 'wallet', 'cash_on_delivery']
                  },
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['productId', 'quantity'],
                      properties: {
                        productId: { type: 'string', format: 'uuid' },
                        quantity: { type: 'integer', minimum: 1 }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Checkout completed',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/CheckoutResult' }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
