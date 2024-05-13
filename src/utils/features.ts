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

// exporting all function
export { generateReferCode, generateOTP };
