require('dotenv').config()
require('express-async-errors') // handles async errors

const express = require('express');
const app = express();

const connectDB = require("./db/connect");

const productRouter = require("./routes/products")

const notFoundMiddleware = require('./middleware/not-found')
const errorMiddleware = require('./middleware/error-handler')

// middleware
app.use(express.json()); 
  

// routes

app.get('/', (req, res) => { 
    res.send('<h1>Store Api!</h1> <a href="/api/v1/products"> Product route </a>')
})

// product route
app.use('/api/v1/products', productRouter);


app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 3000;
 
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, console.log(`Server listening at port ${port}...`))
    } catch (error) {
        console.log(error);
    }
}

start();

