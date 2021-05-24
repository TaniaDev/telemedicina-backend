const express = require('express');
const server = express();

server.get('/user', (req, res) => {
    res.send('usuário logado')

});

server.listen(3000, () => {
    console.log('API Online');
});
