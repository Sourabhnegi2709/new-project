const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const joi = require('joi');

module.exports.listingSchema = joi.object({
    listing : joi.object({
        title : joi.string().required(),
        description : joi.string().required(),
        price : joi.number().required().min(0),
        image : joi.string().allow("",null),
        location : joi.string().required(),
        category: joi.string().valid("Trending", "Windmills", "Cabins", "Mountain", "Warehouse", "Castles", "Beach", "Snowpoint", "City").required(),
        country : joi.string().required(),
    }).required(),
});

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        comment: joi.string().required(),
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User", // Replace "User" with your user model name
        },
    }).required(),
});