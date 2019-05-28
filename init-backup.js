'use strict';

const Hapi = require("@hapi/hapi");
const Basic = require("@hapi/basic");
const Joi = require("@hapi/joi");
const Mongoose = require("mongoose");
const Bcrypt = require("bcrypt");

Mongoose.connect("mongodb://localhost:27017/flashcms", { useNewUrlParser: true });

const PersonModel = Mongoose.model("person", {
    firstname: String,
    lastname: String
});

const users = {
    didid: {
        username: 'didid',
        password: '$2a$10$A9d0fA8Qpvt1FJ16g3gwcOfC3J.sLLnaSotmRNnuxQurHngeiwE6m',
        name: 'Didid',
        id: '1'
    }
};

const validate = async (request, username, password, h) => {

    if (username === 'help') {
        return { response: h.redirect('https://hapijs.com/help') };     // custom response
    }

    const user = users[username];
    if (!user) {
        return { credentials: null, isValid: false };
    }

    const isValid = await Bcrypt.compare(password, user.password);
    const credentials = { id: user.id, name: user.name };

    return { isValid, credentials };
};

const main = async () => {
    const server = new Hapi.Server({ "host": "localhost", "port": 3000 });
    await server.register(require('@hapi/basic'));

    server.auth.strategy('simple', 'basic', { validate });
    server.auth.default('simple');

    server.route({
        method: "POST",
        path: "/person",
        handler: (request, h) => {
            try {
                var person = new PersonModel(request.payload);
                var result = person.save();
                return h.response(result);
            } catch (error) {
                return h.response(error).code(500);
            }
        }
    });

    server.route({
        method: "GET",
        path: "/person/{id}",
        handler: (request, h) => {
            try {
                var person = PersonModel.findById(request.params.id).exec();
                return h.response(person);
            } catch (error) {
                return h.response(error).code(500);
            }
        }
    });

    server.route({
        method: "GET",
        path: "/people",
        handler: async (request, h) => {
            try {
                var person = await PersonModel.find().exec();
                return h.response(person);
            } catch (error) {
                return h.response(error).code(500);
            }
        }
    });

    server.route({
        method: "PUT",
        path: "/person/{id}",
        handler: (request, h) => {
            try {
                var result = PersonModel.findByIdAndUpdate(request.params.id, request.payload, { new: true });
                return h.response(result);
            } catch (error) {
                return h.response(error).code(500);
            }
        }
    });

    server.route({
        method: "DELETE",
        path: "/person/{id}",
        handler: async (request, h) => {
            try {
                var result = await PersonModel.findByIdAndDelete(request.params.id);
                return h.response(result);
            } catch (error) {
                return h.response(error).code(500);
            }
        }
    });

    await server.start();
    return server;
}

main()
.then((server) => console.log(`Server listening on ${server.info.uri}`))
.catch((err) => {
    console.error(err);
    process.exit(1);
});