// use Express.js
const express = require('express');
// use MySQL
const mysql = require('mysql2');
const cors = require('cors');

// ROUTE COLLECTIONS
const userRoutes = require('./routes/users');
const cakeRoutes = require('./routes/cakes');
const orderRoutes = require ('./routes/orders');


// create EXPRESS APP
const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/users', userRoutes);
app.use('/api/cakes', cakeRoutes);
app.use('/api/orders', orderRoutes);


// create the MySQL connection
// const db = mysql.createConnection({
//     host: 'localhost',
//     port: 3306,
//     user: 'root',
//     password: 'password',
//     database: 'cake_ordering'
// });


// // check connection to MySQL
// db.connect((err) => {
//     if(err) throw err;
//     console.log("SUCCESSFULLY Connected to the MySQL Database");
// });


// TEST ROUTE
app.get('/', (req, res) => {
    res.send('Cake Ordering System Backed is running with MySQL');
});




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});