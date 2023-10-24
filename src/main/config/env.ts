export const env = {
  mongoUrl:
    process.env.MONGO_URL ||
    'mongodb://root:example@127.0.0.1:27017/clean-node-api',
  port: process.env.port || 5050,
};
