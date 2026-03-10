const { CosmosClient } = require("@azure/cosmos");

const client = new CosmosClient(process.env.COSMOS_DB_CONNECTION_STRING);
const database = client.database("cleaningcrm");
const customersContainer = database.container("customers");

module.exports = { customersContainer };
