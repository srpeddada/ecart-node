import mongoose  from "mongoose";
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

export default cart1;
