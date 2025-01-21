const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true 
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: { type: Date, default: Date.now }
});

// Add passport-local-mongoose plugin to handle username and password
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
