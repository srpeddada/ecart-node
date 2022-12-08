const mongoose = require("mongoose");
const UserSchema2 = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
});
const cart2 = mongoose.model("cart2s", UserSchema2);
module.exports = cart2;
