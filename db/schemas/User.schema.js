const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: false,
    },
    photoURL: {
        type: String,
        default: "https://p7.hiclipart.com/preview/419/473/131/computer-icons-user-profile-login-user.jpg"
    },
    googleID: {
        type: String,
        required: false
    },  
    phoneNumber: {
        type: String,
        required: false
    },
    country: {
        type: String,
    },
    state: {
        type: String,
    },
    address: {
        type: String
    },
    completedProfile: {
        type: Boolean,
        default: false
    },
    verifiedEmail: {
        type: Boolean,
        default: false
    }

})

module.exports = userSchema;