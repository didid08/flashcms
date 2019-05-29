'use strict';

const Config = require('./config.js');

const Hapi = require("@hapi/hapi");
const Basic = require("@hapi/basic");

const Mongoose = require("mongoose");
const Bcrypt = require("bcrypt");
const Qs = require('qs');

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

    const server = new Hapi.Server({
        host: Config.server.host,
        port: Config.server.port,
        query: {
            parser: (query) => Qs.parse(query)
        }
    });

/*******************************/
/** Database REST API Section **/
/*******************************/

    //Fetch Single Document
    server.route({
        method: "GET",
        path: "/data/db/single/{collection}",
        handler: async (request, h) => {
            try {
                var collection;
                switch(request.params.collection){
                    case "settings":
                        collection = await DBSchemas.settings.findOne(request.query).exec();
                    break;
                    case "accounts":
                        collection = await DBSchemas.accounts.findOne(request.query).exec();
                    break;
                    case "contents":
                        collection = await DBSchemas.contents.findOne(request.query).exec();
                    break;
                }
                return h.response(collection);
            } catch (error) {
                return h.response(error).code(500);
            }
        }
    });

    //Fetch All Documents
    server.route({
        method: "GET",
        path: "/data/db/{collection}",
        handler: async (request, h) => {
            try {
                var collection;
                switch(request.params.collection){
                    case "settings":
                        collection = await DBSchemas.settings.find(request.query).exec();
                    break;
                    case "accounts":
                        collection = await DBSchemas.accounts.find(request.query).exec();
                    break;
                    case "contents":
                        collection = await DBSchemas.contents.find(request.query).exec();
                    break;
                }
                return h.response(collection);
            } catch (error) {
                return h.response(error).code(500);
            }
        }
    });



    // Insert Single Data
    server.route({
        method: "POST",
        path: "/data/db/{collection}",
        handler: async (request, h) => {
            try {
                var collection;
                switch(request.params.collection){
                    case "settings":
                        collection = new DBSchemas.settings(request.payload);
                    break;
                    case "accounts":
                        collection = new DBSchemas.accounts(request.payload);
                    break;
                    case "contents":
                        collection = new DBSchemas.contents(request.payload);
                        collection.markModified("data.main");
                    break;
                }
                var result = await collection.save();
                return h.response(result);
            } catch (error) {
                return h.response(error).code(500);
            }
        }
    });

    //Edit Single Data
    server.route({
        method: "PUT",
        path: "/data/db/single/{collection}",
        handler: async (request, h) => {
            try {
                var result;
                switch(request.params.collection){
                    case "settings":
                        result = await DBSchemas.settings.findOneAndUpdate(request.query, request.payload, { new: true });
                    break;
                    case "accounts":
                        result = await DBSchemas.accounts.findOneAndUpdate(request.query, request.payload, { new: true });
                    break;
                    case "contents":
                        result = await DBSchemas.contents.findOneAndUpdate(request.query, request.payload, { new: true });
                        result.markModified("data.main");
                    break;
                }
                return h.response(result);
            } catch (error) {
                return h.response(error).code(500);
            }
        }
    });

    //Delete Single Data
    server.route({
        method: "DELETE",
        path: "/data/db/single/{collection}",
        handler: async (request, h) => {
            try {
                var result;
                switch(request.params.collection){
                    case "settings":
                        result = await DBSchemas.settings.findOneAndDelete(request.query);
                    break;
                    case "accounts":
                        result = await DBSchemas.accounts.findOneAndDelete(request.query);
                    break;
                    case "contents":
                        result = await DBSchemas.contents.findOneAndDelete(request.query);
                    break;
                }
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
.then((server) => console.log(`# Flashcms Development Server\nListening on ${server.info.uri}`))
.catch((err) => {
    console.error(err);
    process.exit(1);
});