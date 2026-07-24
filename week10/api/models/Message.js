const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, trim: true },
    sender: { type: String, enum: ['client', 'admin'], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
