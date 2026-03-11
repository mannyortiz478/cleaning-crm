const { CosmosClient } = require('@azure/cosmos');

const client = new CosmosClient(process.env.COSMOS_DB_CONNECTION_STRING);
const database = client.database("cleaningcrm");
const container = database.container("customers");

module.exports = async function (context, req) {
    const { id } = context.bindingData;
    try {
        if (req.method === 'GET') {
            const { resource: customer } = await container.item(id, id).read();
            if (!customer) {
                context.res = { jsonBody: { error: 'Customer not found' }, status: 404 };
            } else {
                context.res = { jsonBody: customer };
            }
        } else if (req.method === 'PUT') {
            const updates = req.body;
            updates.id = id;
            updates.updatedAt = new Date().toISOString();
            const { resource: updatedItem } = await container.item(id, id).replace(updates);
            context.res = { jsonBody: updatedItem };
        } else if (req.method === 'DELETE') {
            await container.item(id, id).delete();
            context.res = { status: 204 };
        }
    } catch (error) {
        context.log.error('Error:', error);
        context.res = { jsonBody: { error: error.message }, status: 500 };
    }
};