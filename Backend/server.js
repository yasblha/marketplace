const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

// Utiliser les méthodes intégrées d'Express au lieu de bodyParser
app.use(express.json());  // pour parser les corps de requêtes JSON
app.use(express.urlencoded({ extended: true }));  // pour parser les corps de requêtes URL-encoded

const subscriptionRoutes = require('./src/routes/subscriptionRoutes');
app.use('/api', subscriptionRoutes);

// Gérer les requêtes API
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from the server!' });
});

app.use(express.static(path.join(__dirname, '../FrontEnd/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../FrontEnd/dist', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
