import { imagekit } from "../lib";
import { UploadResult } from "../types";

// for generating unique refer code
const generateReferCode = (): string => {
  const prefix: string = "BOM";
  const randomNumber: string = Math.floor(Math.random() * 90000) + 10000 + "";
  return prefix + randomNumber;
};

// for generating unique otp
const generateOTP = (): string => {
  const otpLength: number = 6;
  let otp: string = "";
  for (let i = 0; i < otpLength; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};

// for adding days in current Date
const AddDays = (date: Date, days: number): Date => {
  let result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
// for adding months in current Date
const AddMonths = (date: Date, months: number): Date => {
  let result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

// for adding Year in current year

const addYear = (date: Date, years: number) => {
  let result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
};

// Function to upload a file buffer to ImageKit
const uploadToImageKit = (file: Express.Multer.File): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    imagekit.upload(
      {
        file: file.buffer, // the file buffer
        fileName: file.originalname, // original file name
        folder: "/products", // optional: folder to store the files in
      },
      (error, result) => {
        if (error) {
          reject(error);
        }

        if (result) {
          resolve({
            public_id: result.fileId,
            url: result.url,
          });
        }
      }
    );
  });
};
// exporting all function
export {
  generateReferCode,
  generateOTP,
  addYear,
  AddDays,
  AddMonths,
  uploadToImageKit,
};
