const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orderNo: { type: String, required: true },
    batch: { type: String, required: true },
    material: { type: String, required: true },
    qty: { type: String, required: true },
    items: [
      {
        name: String,
        supplier: String,
        price: String,
        qty: Number,
        category: String,
        status: String,
        statusType: String,
        batch: String,
      },
    ],
    amount: { type: String, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Dispatched', 'In Transit', 'Delivered'],
      default: 'Pending',
    },
    statusType: { type: String, default: 'amber' },
    delivery: {
      name: String,
      phone: String,
      address: String,
      county: String,
      date: String,
      notes: String,
    },
    date: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
