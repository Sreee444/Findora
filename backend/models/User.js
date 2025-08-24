import mongoose from "mongoose";



const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, minlength: 3 },
  username: { type: String, required: false, minlength: 3 },
  password: { type: String, required: true, minlength: 6 }
});

export default mongoose.model("User", userSchema);