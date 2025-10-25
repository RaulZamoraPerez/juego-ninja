const express = require('express');
const path = require('path');
const app = express();
const PORT = 4000;

// Servir archivos estáticos
app.use(express.static(__dirname));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🎮 Ninja Game ejecutándose en http://localhost:${PORT}`);
    console.log(`📁 Sirviendo archivos desde: ${__dirname}`);
});