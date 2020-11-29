'use strict';

const express = require(`express`);
const chalk = require(`chalk`);

const mainRoutes = require(`./routes/main-routes`);
const myRoutes = require(`./routes/my-routes`);
const offersRoutes = require(`./routes/offers-routes`);

const app = express();
const PORT = 8000;

app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/offers`, offersRoutes);


app.listen(PORT, () => {
  console.info(chalk.green(`The server is running on port ${PORT}`));
});
