const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const db = new DatabaseSync(path.join(__dirname, 'meubanco.db'));

db.exec(`CREATE TABLE if NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    email TEXT,
    senha TEXT,
    pais TEXT,
    data_nascimento TEXT,
    jogador_favorito TEXT
)`);

const servidor = http.createServer(async (req, res) => {
    const paginaInicial = req.url === '/' ? 'index.html' : req.url;

    if (req.url === '/api/usuarios' && req.method === 'GET') {
        const usuarios = db.prepare('SELECT * FROM usuarios ORDER BY id DESC').all();
        res.end(JSON.stringify(usuarios));
        return;
    }

    if (req.url === '/api/usuarios' && req.method === 'POST') {
        let corpo = "";
        for await (const pedaco of req) corpo += pedaco;
        const dados = JSON.parse(corpo);

        console.log("Dados recebidos do formulário:", dados);
        
        db.prepare('INSERT INTO usuarios (nome, email, senha, pais, data_nascimento, jogador_favorito) VALUES (?, ?, ?, ?, ?, ?)')
          .run(dados.nome, dados.email, dados.senha, dados.pais, dados.data_nascimento, dados.jogador_favorito);

        res.end('ok');
        return;
    }

    if (paginaInicial.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
    }
    fs.readFile(path.join(__dirname, paginaInicial), (erro, conteudo) => {
        res.end(erro ? 'arquivo não encontrado' : conteudo);
    });
});

servidor.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});