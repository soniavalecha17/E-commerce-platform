import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      // Added "admin" to the allowed roles
      enum: ["customer", "artisan", "admin"], 
      default: "customer",
      lowercase: true
    },
    refreshToken: {
        type: String
    },
    // Inside your userSchema
isVerified: {
    type: Boolean,
    default: false
},
idProof: {
        type: String, // URL of the uploaded document
        default: "",
        required: function() { return this.role === 'artisan'; }
    }
  },
  { timestamps: true }
);


// 🔐 HASH PASSWORD BEFORE SAVING
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return ;

  this.password = await bcrypt.hash(this.password, 10);
});


// 🔑 CHECK PASSWORD VALIDITY
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};


// 🔐 GENERATE ACCESS TOKEN
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      role: this.role // CRITICAL: This allows the frontend to read the role from the token
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  );
};


// 🔄 GENERATE REFRESH TOKEN
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  );
};


export const User = mongoose.model("User", userSchema);