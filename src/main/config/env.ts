import { config } from 'dotenv';
config();
export const env = {
  mongoUrl: process.env.MONGO_URL || 'mongodb://root:example@127.0.0.1:27017/clean-node-api',
  port: process.env.port || 5050,
  jwtSecret: process.env.JWT_SECRET || '57a7b454baf24e6d-8f2c433ec6265a30',
};
