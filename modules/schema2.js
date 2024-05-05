import mongoose from "mongoose";
const schema2 = new mongoose.Schema({
  day: {
    type: String,
    required: true,
  },
  task: {
    type: String,
    required: true,
  },
});
const Card = mongoose.model("Card", schema2);
export default Card;
