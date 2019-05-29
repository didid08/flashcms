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

    //Fetch Single Document
    server.route({
        method: "GET",
        path: "/data/db/{collection}/{criteria}",
        handler: async (request, h) => {
            try {
                var collection;
                switch(request.params.collection){
                    case "settings":
                        collection = await DBSchemas.settings.findOne({"dataId": request.params.criteria}).exec();
                    break;
                    case "accounts":
                        collection = await DBSchemas.accounts.findOne({"auth.username": request.params.criteria}).exec();
                    break;
                    case "contents":
                        collection = await DBSchemas.contents.findOne({"contentId": request.params.criteria}).exec();
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
                        collection = await DBSchemas.settings.find().exec();
                    break;
                    case "accounts":
                        collection = await DBSchemas.accounts.find().exec();
                    break;
                    case "contents":
                        collection = await DBSchemas.contents.find().exec();
                    break;
                }
                return h.response(collection);
            } catch (error) {
                return h.response(error).code(500);
            }
        }
    });

    // Insert Data
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
                    break;
                }
                var result = await collection.save();
                return h.response(result);
            } catch (error) {
                return h.response(error).code(500);
            }
        }
    });

    //Edit Data
    server.route({
        method: "PUT",
        path: "/data/db/{collection}/{criteria}",
        handler: async (request, h) => {
            try {
                var result;
                switch(request.params.collection){
                    case "settings":
                        result = await DBSchemas.settings.findOneAndUpdate({"dataId": request.params.criteria}, request.payload, { new: true });
                    break;
                    case "accounts":
                        result = await DBSchemas.accounts.findOneAndUpdate({"auth.username": request.params.criteria}, request.payload, { new: true });
                    break;
                    case "contents":
                        result = await DBSchemas.contents.findOneAndUpdate({"contentId": request.params.criteria}, request.payload, { new: true });
                    break;
                }
                return h.response(result);
            } catch (error) {
                return h.response(error).code(500);
            }
        }
    });

    //Delete Data
    server.route({
        method: "DELETE",
        path: "/data/db/{collection}/{criteria}",
        handler: async (request, h) => {
            try {
                var result;
                switch(request.params.collection){
                    case "settings":
                        result = await DBSchemas.settings.findOneAndDelete({"dataId": request.params.criteria});
                    break;
                    case "accounts":
                        result = await DBSchemas.accounts.findOneAndDelete({"auth.username": request.params.criteria});
                    break;
                    case "contents":
                        result = await DBSchemas.contents.findOneAndDelete({"contentId": request.params.criteria});
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