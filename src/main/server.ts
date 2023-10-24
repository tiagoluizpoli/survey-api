import { MongoHelper } from '../infrastructure';
import { env } from './config';

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    const app = (await import('./config/app')).default;
    app.listen(env.port, () =>
      // eslint-disable-next-line no-console
      console.log(`Server runing at http://localhost:${env.port}`),
    );
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.log(err);
  });
