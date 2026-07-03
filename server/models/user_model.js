const mongoose = require("mongoose");
const { ref } = require("node:process");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'Country' ,
      required: true,
    },
  },
  {
    timestamps: true, // creates createdAt and updatedAt
  }
);

// Use email as the username for login
userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
});

module.exports = mongoose.model("User", userSchema);