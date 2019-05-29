const Mongoose = require("mongoose");

const Accounts = Mongoose.model("accounts", {
    auth: {
        username: String,
        password: String,
        email: String
    },
    data: {
        fullname: String,
        nickname: String,
        gender: String,
        birthday: String,
    },
    permissions: Array
});

/* 
 * Permissions List :
 * F_ALL = Allow to Modify All System
 * F_ADMIN = Allow to Modify All Data And Settings except User Info
 * F_USER = Allow to Add and Edit Content
 * F_CUSTOMIZE = Allow to Modify Layout and Style
 * F_MOD = Allow to Modify Addons
 * F_BASIC = Basic Permissions
 */

module.exports = Accounts;