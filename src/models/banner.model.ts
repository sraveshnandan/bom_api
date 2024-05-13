import { Document, Schema, model, models } from "mongoose";

export interface IBanner extends Document {
  name: string;
  image: {
    public_id: string;
    url: string;
  };
  creator?: string;
}
const BanerSchema = new Schema<IBanner>(
  {
    name: {
      type: String,
      required: [true, "Banner name is required."],
    },
    image: {
      public_id: String,
      url: String,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Banner = model("Banner", BanerSchema);
