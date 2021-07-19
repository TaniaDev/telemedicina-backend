const express = require('express');
const port = process.env.PORT || 3000
const userRouter = require('./usuario')

const server = express();
server.use(userRouter)

server.listen(port, () => {
    console.log('API Online');
});
