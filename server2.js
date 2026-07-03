const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const PORTA = 3000;

const db = new DatabaseSync(path.join(__dirname, 'meubanco.db'));
db.exec(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    email TEXT,
    senha TEXT,
    pais TEXT,
    data_nascimento TEXT
)`);

const servidor = http.createServer(async (req, res) => {

    if (req.url === '/api/usuarios' && req.method === 'GET') {
        const usuarios = db.prepare('SELECT * FROM usuarios ORDER BY id DESC').all();
        res.end(JSON.stringify(usuarios));
        return;
    }

    if (req.url === '/api/usuarios' && req.method === 'POST') {
        let corpo = '';
        for await (const pedaco of req) corpo += pedaco;  
        const dados = JSON.parse(corpo);
        db.prepare('INSERT INTO usuarios (nome, email, senha, pais, data_nascimento) VALUES (?, ?, ?, ?, ?)')
          .run(dados.nome, dados.email, dados.senha, dados.pais, dados.data_nascimento);
        res.end('ok');
        return;
    }

    const nomeArquivo = req.url === '/' ? 'index.html' : req.url;

    if (nomeArquivo.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
    }

    fs.readFile(path.join(__dirname, nomeArquivo), (erro, conteudo) => {
        res.end(erro ? 'Arquivo não encontrado' : conteudo);
    });
});

servidor.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
