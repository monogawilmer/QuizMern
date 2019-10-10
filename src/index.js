import 'dotenv/config';
import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';

import models, { connectDb } from './models';
import routes from './routes';

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  req.context = {
    models,
    me: await models.User.findByLogin('usuario'),
  };
  next();
});



app.use('/session', routes.session);
app.use('/users', routes.user);
app.use('/messages', routes.message);


const eraseDatabaseOnSync = true;

connectDb().then(async () => {
  if (eraseDatabaseOnSync) {
    await Promise.all([
      models.User.deleteMany({}),
      models.Message.deleteMany({}),
    ]);

    createUsersWithMessages();
  }

  app.listen(process.env.PORT, () =>
    console.log(`App Escuchando en ${process.env.PORT}!`),
  );
});

const createUsersWithMessages = async () => {
  const user1 = new models.User({
    username: 'usuario',
  });

  const user2 = new models.User({
    username: 'pepito',
  });

  const message1 = new models.Message({
    text: 'Mensaje1',
    user: user1.id,
  });

  const message2 = new models.Message({
    text: 'Mensaje2',
    user: user2.id,
  });

  const message3 = new models.Message({
    text: 'Mensaje3',
    user: user2.id,
  });

  await message1.save();
  await message2.save();
  await message3.save();

  await user1.save();
  await user2.save();
};
