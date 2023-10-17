import app from './config/app';

app.listen(5050, () =>
  // eslint-disable-next-line no-console
  console.log(`Server runing at http://localhost:${5050}`),
);
