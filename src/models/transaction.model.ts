import { Schema, model } from "mongoose";

export interface ITransaction extends Document {}
const TranstactionSchema = new Schema<ITransaction>({}, { timestamps: true });
const Tansaction = model("Transaction", TranstactionSchema);
export { Tansaction };
