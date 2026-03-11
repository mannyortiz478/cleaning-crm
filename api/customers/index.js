const { CosmosClient } = require('@azure/cosmos');
const { v4: uuidv4 } = require('uuid');

const client = new CosmosClient(process.env.COSMOS_DB_CONNECTION_STRING);
const database = client.database("cleaningcrm");
const container = database.container("customers");

module.exports = async function (context, req) {
    try {
        if (req.method === 'GET') {
            const { resources: customers } = await container.items.readAll().fetchAll();
            context.res = { jsonBody: customers };
        } else if (req.method === 'POST') {
            const customer = req.body;
            customer.id = uuidv4();
            customer.createdAt = new Date().toISOString();
            customer.updatedAt = new Date().toISOString();
            const { resource: createdItem } = await container.items.create(customer);
            context.res = { jsonBody: createdItem, status: 201 };
        }
    } catch (error) {
        context.log.error('Error:', error);
        context.res = { jsonBody: { error: error.message }, status: 500 };
    }
};