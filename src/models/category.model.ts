import { Document, Schema, model, models } from "mongoose";

export interface ICategory extends Document {
  name: string;
  image: {
    public_id: string;
    url: string;
  };
  creator?: string;
}
const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required."],
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

export const Category = model("Category", CategorySchema);
