const express = require('express');
const postsRouter = require('./Posts/posts-router.js');
const usersRouter = require('./Users/users-router.js');

const server = express();

server.use('/api/users', usersRouter);
server.use('/api/posts', postsRouter);

server.get('/', (req, res) => {
  res.send(
    `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>Node + Express API</title>
      </head>
      <body>
        <h1>Welcome to my Node + Express API</h1>
      </body>
    </html>
    `)
});

module.exports = server;
