const mongoose = require('mongoose');
const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    products: [{
        product: {type: mongoose.Schema.Types.ObjectId, ref:'Product'},
        annotations: String
    }],
    deliveryAt: {type: String, required:true},
    annotations: String,
    deliveryTime: {type: Date, required:true},
    optionalReceiver: String,
});

module.exports = mongoose.model('Order', orderSchema);
