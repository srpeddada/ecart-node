import mongoose  from "mongoose";
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    type: String,
    default: null,
  },
});
const User = mongoose.model("User", UserSchema);

export default User;
