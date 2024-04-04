const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Servir les fichiers statiques (HTML, CSS, JS) depuis le dossier 'dist'
app.use(express.static(path.join(__dirname, 'dist')));

// Gérer les requêtes API
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from the server!' });
});

// Rediriger toutes les autres routes vers le fichier index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});