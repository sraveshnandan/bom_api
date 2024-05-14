import { Schema, model, models } from "mongoose";

export interface IShop extends Document {
  name: string;
  description: string;
  address: string;
  banners: [
    {
      public_id: string;
      url: string;
    }
  ];
  geolocation: {
    lat: number;
    long: number;
  };
  category?: [string];
  products?: [string];
  owner?: string;
  subscription?: {
    currentPlan: string;
    expiryDate: Date;
    transactions: [string];
  };
  stats: Object;
}

const ShopSchema = new Schema<IShop>(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    banners: [
      {
        public_id: String,
        url: String,
      },
    ],
    geolocation: {
      lat: String,
      long: String,
    },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    products: { type: Schema.Types.ObjectId, ref: "Product" },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    subscription: {
      currentPlan: String,
      expiryDate: {
        type: Date,
        default: Date.now(),
      },
      transactions: { type: Schema.Types.ObjectId, ref: "Transaction" },
    },
    stats: {
      view: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

const Shop = models.Shop || model("Shop", ShopSchema);
export { Shop };
