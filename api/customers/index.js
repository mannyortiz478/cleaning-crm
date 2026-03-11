const { CosmosClient } = require('@azure/cosmos');
const { v4: uuidv4 } = require('uuid');

const client = new CosmosClient(process.env.COSMOS_DB_CONNECTION_STRING);
const database = client.database("cleaningcrm");
const container = database.container("customers");

module.exports = async function (context, req) {
    context.log('customers function called with method:', req.method);
    try {
        if (req.method === 'GET') {
            context.log('Fetching all customers...');
            const { resources: customers } = await container.items.readAll().fetchAll();
            context.log('Fetched customers:', customers.length);
            context.res = {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(customers)
            };
        } else if (req.method === 'POST') {
            context.log('Creating customer...');
            const customer = req.body;
            customer.id = uuidv4();
            customer.createdAt = new Date().toISOString();
            customer.updatedAt = new Date().toISOString();
            const { resource: createdItem } = await container.items.create(customer);
            context.log('Customer created:', createdItem.id);
            context.res = {
                status: 201,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(createdItem)
            };
        }
    } catch (error) {
        context.log.error('Error:', error.message);
        context.res = {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: error.message })
        };
    }
};