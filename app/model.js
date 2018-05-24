// Pulls Mongoose dependency for creating schemas
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var plm = require('passport-local-mongoose');

var availabilitySchema = new Schema({
    text: String

});

var FoodSchema = new Schema({
    dish: { type: String },
    description: { type: String },
    price: { type: Number },
    type: { type: String },
    img: { type: String },
    options: { type: String },
    availability: { type: String }
});




// Creates a User Schema. This will be the basis of how user data is stored in the db
var UserSchema = new Schema({

    email: { type: String },
    fullname: { type: String },
    username: { type: String },
    password: { type: String },
    cook: Boolean,
    foods: [FoodSchema],
    location: [Number],
    place: { type: String },
    //favlang: {type: String, required: true},
    latitude: { type: Number },
    longitude: { type: Number }, // [Long, Lat]
    htmlverified: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    socialId: { type: String },
    rating: { type: Number },
    provider: { type: String },
    loginCount: { type: Number },
    cookPic: { type: String },
    descrip: { type: String },
    phoneNumber: { type: Number },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'review' }], //population from the reviews schema
    upvotes: {type: Number, default:0 },
    downvotes: {type: Number, default:0 },

});

// Sets the created_at parameter equal to the current time
UserSchema.pre('save', function(next) {
    now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now
    }
    next();
});

// Indexes this schema in 2dsphere format (critical for running proximity searches)
UserSchema.index({ location: '2dsphere' });
UserSchema.plugin(plm);
// Exports the UserSchema for use elsewhere. Sets the MongoDB collection to be used as: "user"
module.exports = mongoose.model('user', UserSchema);