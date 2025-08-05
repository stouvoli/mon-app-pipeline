const express = require('express');
// !!! VULNÉRABILITÉ INTENTIONNELLE POUR LE TEST SAST !!!
const dbPassword = "SuperSecretPassword123!";
// On ajoute une fausse clé API directement dans le code pour le test
const FAKE_API_KEY = "sqp_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0"; // VULNERABILITY
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Félicitations ! Mon application est prête pour le pipeline !');
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});