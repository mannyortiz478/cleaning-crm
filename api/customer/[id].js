const { CosmosClient } = require('@azure/cosmos');

const client = new CosmosClient(process.env.COSMOS_DB_CONNECTION_STRING);
const database = client.database("cleaningcrm");
const container = database.container("customers");

module.exports = async function (context, req) {
    const { id } = context.bindingData;
    context.log('customer function called with method:', req.method, 'id:', id);
    try {
        if (req.method === 'GET') {
            context.log('Fetching customer:', id);
            const { resource: customer } = await container.item(id, id).read();
            if (!customer) {
                context.res = {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'Customer not found' })
                };
            } else {
                context.res = {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(customer)
                };
            }
        } else if (req.method === 'PUT') {
            context.log('Updating customer:', id);
            const updates = req.body;
            updates.id = id;
            updates.updatedAt = new Date().toISOString();
            const { resource: updatedItem } = await container.item(id, id).replace(updates);
            context.res = {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedItem)
            };
        } else if (req.method === 'DELETE') {
            context.log('Deleting customer:', id);
            await container.item(id, id).delete();
            context.res = { status: 204 };
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