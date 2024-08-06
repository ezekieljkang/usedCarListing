const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CarSchema = new Schema({
  manufacturer_name: { type: String, required: true },
  model_name: { type: String, required: true },
  year_produced: { type: Number, required: true },
  odometer_value: { type: Number, required: true },
  price_usd: { type: Number, required: true },
  engine_capacity: { type: Number, required: true},
  duration_listed: { type: Number, required: true},
  color: {type: String, required: true},
}, { collection: 'inventory' });

CarSchema.virtual("url").get(function () {
  return `/catalog/${this._id.toString()}`;
});

module.exports = mongoose.model('Car', CarSchema);
