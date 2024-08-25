const express = require('express');
const db = require('../db');
const router = express.Router();

// get ALL CAKES
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM cakes';
    db.query(sql, (err, results) => {
        if(err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
    console.log("made 'GET all cakes request'")
});

// https://preppykitchen.com/best-red-velvet-cake/

// update cake details
router.put('/', (req, res) => {
    const { id, name, flavor, price, size, description, image_url } = req.body;

    // Create an array of column names and their corresponding values for the SQL query
    let columnsToUpdate = [];
    let values = [];

    // Add columns and values if they are provided
    if (name) {
        columnsToUpdate.push('name = ?');
        values.push(name);
    }
    if (flavor) {
        columnsToUpdate.push('flavor = ?');
        values.push(flavor);
    }
    if (price) {
        columnsToUpdate.push('price = ?');
        values.push(price);
    }
    if (size) {
        columnsToUpdate.push('size = ?');
        values.push(size);
    }
    if (description) {
        columnsToUpdate.push('description = ?');
        values.push(description);
    }
    if (image_url) {
        columnsToUpdate.push('image_url = ?');
        values.push(image_url);
    }

    // Add the id to the values array (to be used in the WHERE clause)
    values.push(id);

    // Construct the SQL query
    let sql = `UPDATE cakes SET ${columnsToUpdate.join(', ')} WHERE id = ?`;

    // Execute the query
    db.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: `Cake details: ${values.join(', ')} updated successfully` });
    });
})

// add new cake (as ADMIN)
router.post('/', (req, res) => {

    const { name, flavor, price, size, description, image_url } = req.body;

    const sql = 'INSERT INTO cakes (name, flavor, price, size, description, image_url) VALUES (?, ?, ?, ?, ?, ?)';

    db.query(sql, [name, flavor, price, size, description, image_url], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message});
        }
        res.status(201).json({ message: `Cake: "${name}" added SUCCESSFULLY!`});
    });
});

module.exports = router;