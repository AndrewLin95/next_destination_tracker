import mongoose from "mongoose";

const authUserSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  userPassword: {
    type: String,
    required: true,
  },
  joinDate: {
    type: Date,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
}, { versionKey: false })

const AuthUserSchema = mongoose.model('AuthUserSchema', authUserSchema);

module.exports = AuthUserSchema;
