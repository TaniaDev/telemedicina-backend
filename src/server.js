const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')

const {sendNotification} = require('./controllers/ScheduledController')
const {lateAppointments} = require('./controllers/ConsultaController')



const nodeCron = require("node-cron");
const job = nodeCron.schedule("0 * * * * *", async function jobYouNeedToExecute() {
    sendNotification()
    lateAppointments()
  });


const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3333

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(express.json())
app.use(routes)

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

app.listen(port, () => console.log(`API Online on port ${port}`))
