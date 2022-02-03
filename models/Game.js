const { Schema, model } = require("mongoose");

const gameSchema = new Schema(
  {
    name: String,
  },
  {
    versionKey: false,
  }
);

module.exports = model("Game", gameSchema);
