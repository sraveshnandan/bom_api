import { Document, Schema, model, models } from "mongoose";

export interface IUser extends Document {
  full_name?: string;
  email?: string;
  phone_no?: string;
  avatar: {
    public_id: string;
    url: string;
  };
  isAdmin: boolean;
  isShopOwner: boolean;
  referCode: string;
  referCount?: any[];
  orders: [string];
  cart: [string];
  wishlist: [
    {
      type: Schema.Types.ObjectId;
      ref: "Product";
    }
  ];
  subscription: {
    paymentId: string;
    expiryDate: Date;
  };
  wallet: {
    currentBallence: number;
    transations?: string[];
  };
  otp?: {
    expiry: Date;
    value: string;
  };
  address: [
    {
      appartment_building_no: number;
      village_locality: string;
      landmark: string;
      city: string;
      district: string;
      state: string;
      pin_code: number;
      contact_no: number;
    }
  ];
}
const UserSchema = new Schema<IUser>(
  {
    full_name: {
      type: String,
      requried: [true, "Full name is required."],
    },
    email: {
      type: String,
      requried: [true, "Email address is required."],
      unique: [true, "Email address should be unique."],
    },
    phone_no: {
      type: String,
      required: [true, "Phone number must be provided."],
      unique: [true, "Phone number already exists."],
    },
    avatar: {
      public_id: String,
      url: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isShopOwner: {
      type: Boolean,
      default: false,
    },
    referCode: {
      type: String,
    },
    referCount: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Orders",
      },
    ],
    cart: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    subscription: {
      paymentId: String,
      expiryDate: Date,
    },
    wallet: {
      currentBallence: {
        type: Number,
        default: 0,
      },
      transations: [
        {
          type: Schema.Types.ObjectId,
          ref: "Transaction",
        },
      ],
    },
    otp: {
      expiry: {
        type: Date,
        default: Date.now,
      },
      value: {
        type: String,
      },
    },
    address: [
      {
        appartment_building_no: {
          type: String,
        },
        village_locality: {
          type: String,
        },
        landmark: {
          type: String,
        },
        city: {
          type: String,
        },
        district: {
          type: String,
        },
        state: {
          type: String,
        },
        pin_code: {
          type: Number,
        },
        contact_no: {
          type: Number,
        },
      },
    ],
  },
  { timestamps: true }
);

export const User = model("User", UserSchema);
