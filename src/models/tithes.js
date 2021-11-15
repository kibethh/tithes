const mongoose = require('mongoose');
const validator = require('validator');
const tithesSchema = new mongoose.Schema(
  {
    tither: {
      type: String,
      required: true,
      uppercase: true,
    },
    phone: {
      type: Number,
      trim: true,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },

    month: {
      type: Number,
      default: new Date().getMonth(),
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      //showing relationship with user model
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);
const Tithes = mongoose.model('Tithes', tithesSchema);
module.exports = Tithes;
