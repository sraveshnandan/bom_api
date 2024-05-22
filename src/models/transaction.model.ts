import { Schema, model } from "mongoose";

export interface ITransaction extends Document {
  payment_id: string;
  amount: number;
  payer: String;
  other: Object;
}
const TranstactionSchema = new Schema<ITransaction>(
  {
    payment_id: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    payer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    other: Object,
  },
  { timestamps: true }
);
const Tansaction = model("Transaction", TranstactionSchema);
export { Tansaction };
