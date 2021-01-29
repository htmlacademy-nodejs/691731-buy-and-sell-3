'use strict';

const express = require(`express`);
const path = require(`path`);
const chalk = require(`chalk`);

const mainRoutes = require(`./routes/main-routes`);
const myRoutes = require(`./routes/my-routes`);
const offersRoutes = require(`./routes/offers-routes`);

const {HttpCode} = require(`../constants`);

const app = express();
const PORT = 8000;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;

app.set(`views`, path.resolve(__dirname, `./templates`));
app.set(`view engine`, `pug`);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/offers`, offersRoutes);

app.use((req, res, next) => {
  res
    .status(HttpCode.BAD_REQUEST)
    .render(`errors/404`);

  next();
});

app.use((_err, _req, res, _next) => {
  res
    .status(HttpCode.INTERNAL_SERVER_ERROR)
    .render(`errors/500`);
});

app.listen(PORT, () => {
  console.info(chalk.green(`The server is running on port ${PORT}`));
});
