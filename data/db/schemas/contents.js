const Mongoose = require("mongoose");

const Contents = Mongoose.model("contents", {
    contentId: Number,
    contentCategory: String,
    url: String,
    behavior: {
        private: Boolean,
        published: Boolean,
    },
    data: {
        title: String,
        meta: {
            encoding: String,
            descriptions: String,
            keywords: String,
        },
        contentType: String,
        contentDisposition: String,
        main: {}
    }
});

module.exports = Contents;
