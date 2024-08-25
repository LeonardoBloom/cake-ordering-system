const express = require('express');
const db = require('../db');
const router = express.Router();


// place a new order
router.post('/new', (req, res) => {
    const { user_id, items } = req.body;

    let total_price = 0;

    //fetch cake details(price) foe each item from the database
    const sqlCakes = 'SELECT id, price FROM cakes WHERE id IN (?)';
    const cakeIds = items.map(item => item.cake_id);

    db.query(sqlCakes, [cakeIds], (err, cakeResults) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // calculate the total price on the quanity and price of each cake
        items.forEach(item => {
            const cake = cakeResults.find(cake => cake.id === item.cake_id);
            if (cake) {
                total_price += cake.price * item.quantity;
            }
        });
    

        // insert the new order into the orders table
        const sqlOrder = 'INSERT INTO orders (user_id, total_price) VALUES (?, ?)';
        db.query(sqlOrder, [user_id, total_price], (err, orderResult) => {
            if(err) {
                return res.status(500).json({ error: err.message });
            }

            const order_id = orderResult.insertId;

            // insert the order items into order_items table
            const sqlOrderItems = 'INSERT INTO order_items (order_id, cake_id, quantity) VALUES ?';
            const orderItems = items.map(item => [order_id, item.cake_id, item.quantity]);

            db.query(sqlOrderItems, [orderItems], (err, orderItemsResult) => {
                if(err) {
                    return res.status(500).json({ error: err.message});
                }
                res.status(201).json({ message: 'Order placed successfully!', order_id, total_price});
            });
        });
    });
});



// get all the orders for a specific user
router.get('/user/:user_id', (req, res) => {
    const { user_id } = req.params;

    const sql = `
        SELECT order_id, orders.total_price, orders.status, orders.order_date, order_items.quantity, cakes.name, cakes.flavor, cakes.price
        
        FROM orders
        
        JOIN order_items ON orders.id = order_items.order_id
        
        JOIN cakes ON order_items.cake_id = cakes.id
        WHERE orders.user_id = ?
    `;

    db.query(sql, [user_id], (err, results) => {
        if(err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(results);
    });
    console.log("made 'GET all orders from user request'");
});

// update order status (as ADMIN)
router.put('/:order_id/status', (req, res) => {
    const {order_id} = req.params;
    const { status } = req.body;

    const sql = 'UPDATE orders SET status = ? WHERE id = ?';
    db.query(sql, [status, order_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json({ message: `Order #${order_id} status updated Successfully!`});
    });
});

module.exports = router