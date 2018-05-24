/**
 * Created by karina on 02/05/17.
 */
"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    text: {type: String},
    author: String,
    upvotes: {type: Number, default:0},
    // user: {type: Schema.Types.ObjectId, ref:'user'}

});

let Review = mongoose.model('review', reviewSchema);
//Be carefull how u required this models in the server
module.exports = Review;

