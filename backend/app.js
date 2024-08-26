const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
app.use(bodyParser.json());

// PostgreSQL connection using Vercel's DATABASE_URL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Allows secure connection
    }
});

// Helper function to run queries
const queryDatabase = (query, params, res) => {
    pool.query(query, params)
        .then(results => res.status(200).json(results.rows))
        .catch(error => res.status(500).json({ error: error.message }));
};

// Clients CRUD endpoints
app.get('/clients', (req, res) => queryDatabase('SELECT * FROM clients', [], res));
app.post('/clients', (req, res) => {
    const { name, description, image, designation } = req.body;
    queryDatabase('INSERT INTO clients (name, description, image, designation) VALUES ($1, $2, $3, $4) RETURNING *', [name, description, image, designation], res);
});
app.put('/clients/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, image, designation } = req.body;
    queryDatabase('UPDATE clients SET name = $1, description = $2, image = $3, designation = $4 WHERE id = $5 RETURNING *', [name, description, image, designation, id], res);
});
app.delete('/clients/:id', (req, res) => queryDatabase('DELETE FROM clients WHERE id = $1', [req.params.id], res));

// Projects CRUD endpoints
app.get('/projects', (req, res) => queryDatabase('SELECT * FROM projects', [], res));
app.post('/projects', (req, res) => {
    const { name, description, image } = req.body;
    queryDatabase('INSERT INTO projects (name, description, image) VALUES ($1, $2, $3) RETURNING *', [name, description, image], res);
});
app.put('/projects/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, image } = req.body;
    queryDatabase('UPDATE projects SET name = $1, description = $2, image = $3 WHERE id = $4 RETURNING *', [name, description, image, id], res);
});
app.delete('/projects/:id', (req, res) => queryDatabase('DELETE FROM projects WHERE id = $1', [req.params.id], res));

// Newsletter CRUD endpoints
app.get('/newsletter', (req, res) => queryDatabase('SELECT * FROM newsletter', [], res));
app.post('/newsletter', (req, res) => {
    const { name, email } = req.body;
    queryDatabase('INSERT INTO newsletter (name, email) VALUES ($1, $2) RETURNING *', [name, email], res);
});
app.put('/newsletter/:id', (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    queryDatabase('UPDATE newsletter SET name = $1, email = $2 WHERE id = $3 RETURNING *', [name, email, id], res);
});
app.delete('/newsletter/:id', (req, res) => queryDatabase('DELETE FROM newsletter WHERE id = $1', [req.params.id], res));

// Contacts CRUD endpoints
app.get('/contacts', (req, res) => queryDatabase('SELECT * FROM contacts', [], res));
app.post('/contacts', (req, res) => {
    const { name, email, mobile_no, location } = req.body;
    queryDatabase('INSERT INTO contacts (name, email, mobile_no, location) VALUES ($1, $2, $3, $4) RETURNING *', [name, email, mobile_no, location], res);
});
app.put('/contacts/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, mobile_no, location } = req.body;
    queryDatabase('UPDATE contacts SET name = $1, email = $2, mobile_no = $3, location = $4 WHERE id = $5 RETURNING *', [name, email, mobile_no, location, id], res);
});
app.delete('/contacts/:id', (req, res) => queryDatabase('DELETE FROM contacts WHERE id = $1', [req.params.id], res));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
