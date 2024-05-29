import { Document, Schema, model, models } from "mongoose";
import { IProduct } from "./product.model";
import { IUser } from "./user.model";
import { IShop } from "./shop.model";

export interface IOrder extends Document {
  products: [
    {
      quantity: number;
      product: IProduct;
    }
  ];
  totalPrice: number;
  user: IUser;
  address: {
    appartment_building_no: number;
    village_locality: string;
    landmark: string;
    city: string;
    district: string;
    state: string;
    pin_code: number;
    contact_no: number;
  };
  status: string;
  completed: boolean;
  shop: IShop;
}
const OrderSchema = new Schema<IOrder>(
  {
    products: [
      {
        quantity: {
          type: Number,
          default: 1,
        },
        product: { type: Schema.Types.ObjectId, ref: "Product" },
      },
    ],
    totalPrice: Number,
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    address: {
      appartment_building_no: Number,
      village_locality: String,
      landmark: String,
      city: String,
      district: String,
      state: String,
      pin_code: Number,
      contact_no: Number,
    },
    status: {
      type: String,
      default: "Order Placed",
    },
    shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Order = model("Order", OrderSchema);
