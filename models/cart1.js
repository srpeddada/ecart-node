const mongoose = require("mongoose");
const UserSchema1 = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
});
const cart1 = mongoose.model("cart1s", UserSchema1);
module.exports = cart1;
