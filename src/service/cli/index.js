'use strict';

const filldb = require(`./filldb`);
const generate = require(`./generate`);
const help = require(`./help`);
const version = require(`./version`);
const server = require(`./server`);

const Cli = {
  [filldb.name]: filldb,
  [generate.name]: generate,
  [help.name]: help,
  [version.name]: version,
  [server.name]: server,
};

module.exports = {
  Cli,
};
