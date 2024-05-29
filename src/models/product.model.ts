import { Schema, model } from "mongoose";

export interface IProduct extends Document {
  name?: string;
  description?: string;
  originalPrice?: number;
  discountPrice?: number;
  banners?: [
    {
      id?: string;
      url?: string;
    }
  ];
  categories?: string[];
  property: Object;
  quantity?: number;
  ratings?: number;
  reviews?: [
    {
      id: string;
      email: string;
      message: string;
      star: number;
    }
  ];
  owner?: string;
}
const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    originalPrice: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      required: true,
    },
    banners: [
      {
        public_id: String,
        url: String,
      },
    ],
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    property: [
      {
        name: String,
        value: String,
      },
    ],

    quantity: {
      type: Number,
      default: 10,
    },
    ratings: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        email: String,
        message: String,
        star: Number,
        createdAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
  },
  { timestamps: true }
);
const Product = model("Product", ProductSchema);
export { Product };
