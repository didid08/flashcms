const Mongoose = require("mongoose");

const Settings = Mongoose.model("settings", {
	dataId: String,
    general: {
    	language: String,
    	timezone: String
    },
    site: {
    	title: String,
    	description: String,
    	keywords: String,
    	encoding: String
    }
});

module.exports = Settings;