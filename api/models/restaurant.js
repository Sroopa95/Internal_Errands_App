const mongoose = require('mongoose');
const restaurantSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    restaurant_name: {type:String,required:true},
    location: {type:String,required:true},
    restaurant_logo: {type:String,required:true},
    opening_hours:{type:String,required:true},
    phone:{type:Number,required:true},
    email: {
        type: String, 
        required:true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    site_url:{type:String,required:true}
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
