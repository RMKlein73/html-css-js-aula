function getInputs(){
    return {
        nome: document.getElementById('nome'),
        email: document.getElementById('email'),
        senha: document.getElementById('senha'),
        pais: document.getElementById('pais'),
        data_nascimento: document.getElementById('data_nascimento')
    };
}

function getValores({nome, email, senha, pais, data_nascimento}){
    return {
        nome: nome.value.trim(),
        email: email.value.trim(),
        senha: senha.value.trim(),
        pais: pais.value.trim(),
        data_nascimento: data_nascimento.value.trim()
    };
}

async function cadastrar(){
    const inputs = getInputs();
    const dados = getValores(inputs);
    

    await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });

    window.location.href = './../pages/resultado.html';
}

function calcularIdade(dataNascimento) {
    const anoHoje = new Date().getFullYear();
    const anoNascimento = new Date(dataNascimento).getFullYear();
    const idade = anoHoje - anoNascimento;
    
    return idade;
}

async function mostrarResultado(){
    const resultadoDiv = document.getElementById('resultado');
    const resposta = await fetch('/api/usuarios');
    const usuarios = await resposta.json();

    if (usuarios.length === 0) {
        resultadoDiv.innerHTML = '<p>Nenhum usuário cadastrado ainda.</p>';
        return;
    }

    let html = '<table><thead><tr><th>ID</th><th>Nome</th><th>Email</th><th>Senha</th><th>País</th><th>Data de Nascimento</th><th>Idade</th></tr></thead><tbody>';
    for (const usuario of usuarios) {
        const idade = calcularIdade(usuario.data_nascimento);
        html += `<tr><td>${usuario.id}</td><td>${usuario.nome}</td><td>${usuario.email}</td><td>${usuario.senha}</td><td>${usuario.pais}</td><td>${usuario.data_nascimento}</td><td>${idade}</td></tr>`;
    }
    html += '</tbody></table>';

    resultadoDiv.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', function() {
    const btnEnviar = document.getElementById('btnEnviar');
    if (btnEnviar) {
        btnEnviar.addEventListener('click', function(event) {
            event.preventDefault();
            cadastrar();
        });
    }

    if (document.getElementById('resultado')) {
        mostrarResultado();
    }
});