const { app } = require('@azure/functions');
const { CosmosClient } = require('@azure/cosmos');
const { v4: uuidv4 } = require('uuid');

const client = new CosmosClient(process.env.COSMOS_DB_CONNECTION_STRING);
const database = client.database("cleaningcrm");
const container = database.container("customers");

app.http('customers', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            if (request.method === 'GET') {
                const { resources: customers } = await container.items.readAll().fetchAll();
                return { jsonBody: customers };
            } else if (request.method === 'POST') {
                const customer = await request.json();
                customer.id = uuidv4();
                customer.createdAt = new Date().toISOString();
                customer.updatedAt = new Date().toISOString();
                const { resource: createdItem } = await container.items.create(customer);
                return { jsonBody: createdItem, status: 201 };
            }
        } catch (error) {
            context.log.error('Error:', error);
            return { jsonBody: { error: error.message }, status: 500 };
        }
    }
});