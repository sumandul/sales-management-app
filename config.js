import dotenv from "dotenv";
dotenv.config();

const config = {
  mongoUrl: process.env.MONGO_URL,
  port: process.env.PORT,
  token: process.env.ACCESS_TOKEN,
  email: process.env.user,
  password: process.env.pass,
  trackingUrl: process.env.TRACKING_URL,
  emailSender: process.env.EMAIL_SENDER,
  branch: process.env.BRANCH,
  jwtSecretKey: process.env.JWT_SECRET,
  refreshSecretKey: process.env.JWT_REFRESH_SECRET,
  jwtExpiresIn: process.env.JWT_ACCESS_EXPIRY,
  refreshTokenExpiresIn: process.env.JWT_REFRESH_EXPIRY,
};

export default config;
