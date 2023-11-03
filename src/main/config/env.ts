import { config } from 'dotenv';
config();
export const env = {
  mongoUrl: process.env.MONGO_URL || 'mongodb://root:example@127.0.0.1:27017/clean-node-api',
  port: process.env.port || 5050,
  jwtSecret: process.env.JWT_SECRET || '2932ede208b3469e828b95dd7a198bfe',
};
