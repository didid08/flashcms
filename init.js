'use strict';

const Config = require('./config.js');

const Hapi = require("@hapi/hapi");
const Basic = require("@hapi/basic");

const Mongoose = require("mongoose");
const Bcrypt = require("bcrypt");

const DBSchemas = {
    settings: require("./data/db/schemas/settings.js"),
    contents: require("./data/db/schemas/contents.js"),
    accounts: require("./data/db/schemas/accounts.js")
};

Mongoose.connect("mongodb://"+
    Config.database.url.address+":"+
    Config.database.url.port+"/"+
    Config.database.name,
{ useNewUrlParser: true });

const main = async () => {
    const server = new Hapi.Server({ "host": Config.server.host, "port": Config.server.port });

/*******************************/
/** Database REST API Section **/
/*******************************/

/* Settings's Data Manager */

    // Fetch Data
    server.route({
        method: "GET",
        path: "/settings/{dataId}",
        handler: async (request, h) => {
            try {
                var settings = await DBSchemas.settings.findOne({"dataId": request.params.dataId}).exec();
                return h.response(settings);
            } catch (error) {
                return h.response(error).code(500);
            }
        }
    });

    // Insert Data
    server.route({
        method: "POST",
        path: "/settings",
        handler: async (request, h) => {
            try {
                var settings = new DBSchemas.settings(request.payload);
                var result = await settings.save();
                return h.response(result);
            } catch (error) {
                return h.response(error).code(500);
            }
        }
    });

    // Update Data
    server.route({
        method: "PUT",
        path: "/settings/{dataId}",
        handler: async (request, h) => {
            try {
                var result = await DBSchemas.settings.findOneAndUpdate({"dataId": request.params.dataId}, request.payload, { new: true });
                return h.response(result);
            } catch (error) {
                return h.response(error).code(500);
            }
        }
    });

    // Delete Data
    server.route({
        method: "DELETE",
        path: "/settings/{dataId}",
        handler: async (request, h) => {
            try {
                var result = await DBSchemas.settings.findOneAndDelete({"dataId": request.params.dataId});
                return h.response(result);
            } catch (error) {
                return h.response(error).code(500);
            }
        }
    });

/* Accounts's Data Manager */

    // Fetch Data
    server.route({
        method: "GET",
        path: "/account/{username}",
        handler: async (request, h) => {
            try {
                var account = await DBSchemas.accounts.findOne({"auth.username": request.params.username}).exec();
                return h.response(account);
            } catch (error) {
                return h.response(error).code(500);
            }
        }
    });

    // Fetch All Data
    server.route({
        method: "GET",
        path: "/accounts",
        handler: async (request, h) => {
            try {
                var accounts = await DBSchemas.accounts.find().exec();
                return h.response(accounts);
            } catch (error) {
                return h.response(error).code(500);
            }
        }
    });

    // Insert Data
    server.route({
        method: "POST",
        path: "/accounts",
        handler: async (request, h) => {
            try {
                var account = new DBSchemas.accounts(request.payload);
                var result = await account.save();
                return h.response(result);
            } catch (error) {
                return h.response(error).code(500);
            }
        }
    });

    // Update Data
    server.route({
        method: "PUT",
        path: "/account/{username}",
        handler: async (request, h) => {
            try {
                var result = await DBSchemas.accounts.findOneAndUpdate({"auth.username": request.params.username}, request.payload, { new: true });
                return h.response(result);
            } catch (error) {
                return h.response(error).code(500);
            }
        }
    });

    // Delete Data
    server.route({
        method: "DELETE",
        path: "/account/{username}",
        handler: async (request, h) => {
            try {
                var result = await DBSchemas.accounts.findOneAndDelete({"auth.username": request.params.username});
                return h.response(result);
            } catch (error) {
                return h.response(error).code(500);
            }
        }
    });    

/**************************************/
/** End of Database REST API Section **/
/**************************************/
    
    await server.start();
    return server;
}

main()
.then((server) => console.log(`Server listening on ${server.info.uri}`))
.catch((err) => {
    console.error(err);
    process.exit(1);
});