const { app } = require('@azure/functions');
const { CosmosClient } = require('@azure/cosmos');

const client = new CosmosClient(process.env.COSMOS_DB_CONNECTION_STRING);
const database = client.database("cleaningcrm");
const container = database.container("customers");

app.http('customer', {
    methods: ['GET', 'PUT', 'DELETE'],
    authLevel: 'anonymous',
    route: 'customer/{id}',
    handler: async (request, context) => {
        const { id } = request.params;
        try {
            if (request.method === 'GET') {
                const { resource: customer } = await container.item(id, id).read();
                if (!customer) {
                    return { jsonBody: { error: 'Customer not found' }, status: 404 };
                }
                return { jsonBody: customer };
            } else if (request.method === 'PUT') {
                const updates = await request.json();
                updates.updatedAt = new Date().toISOString();
                const { resource: updatedItem } = await container.item(id, id).replace(updates);
                return { jsonBody: updatedItem };
            } else if (request.method === 'DELETE') {
                await container.item(id, id).delete();
                return { status: 204 };
            }
        } catch (error) {
            context.log.error('Error:', error);
            return { jsonBody: { error: error.message }, status: 500 };
        }
    }
});