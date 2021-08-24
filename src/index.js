const express = require('express');
const routes = require('./routes/routes');
const port = process.env.PORT || 3333

const app = express()

app.use(express.json());
app.use(routes);

// Not Found
app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

// Catch All
app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({ error: error.message })
})

app.listen(port, () => console.log('API Online'));
