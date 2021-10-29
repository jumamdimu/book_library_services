// create express app
const express = require("express")
const app = express()

const cors = require('cors')

const { port } = require('./config');

// import routes
const booksRoute = require('./routes/books');
const weatherRoute = require('./routes/weather');

// middleware
app.use(cors())
app.use(express.json()); //Used to parse JSON bodies
app.use('/books', booksRoute)
app.use('/weather', weatherRoute)

// Route to Homepage
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// create a local server to receive data from
app.listen(port, () => console.log(`Server is running at http://localhost:${port}`))