import express from 'express';

const app = express();

app.listen(5050, () =>
  // eslint-disable-next-line no-console
  console.log(`Server runing at http://localhost:${5050}`),
);
