import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    color: {
      type: String,
      required: true
    },
    size: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const Variant = mongoose.model('Variant', variantSchema);
export default Variant;