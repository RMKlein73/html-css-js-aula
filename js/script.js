window.alert("Bem-Vindo!")
window.confirm("Você tem certeza que deseja entrar nesse site?")
function mudar_texto(){
window.document.getElementById("titulo_form").innerText= "FAZER CADASTRO"
}
function mudar_cor() {
    window.document.getElementById("titulo_form").style.color="rgba(0, 242, 254, 0.6)";
}
function restaurar_cor() {
    window.document.getElementById("titulo_form").style.color="white";
}
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
    
    try {

        await fetch('/api/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        window.location.href = '/pages/resultado.html';
    } catch (erro) {
        console.error("Erro ao enviar dados para a API:", erro);
        alert("Erro ao conectar com o servidor. O usuário não foi cadastrado.");
    }
}

function calcularIdade(dataNascimento) {
    const anoHoje = new Date().getFullYear();
    const anoNascimento = new Date(dataNascimento).getFullYear();
    const idade = anoHoje - anoNascimento;
    
    return idade;
}

async function mostrarResultado(){
    const resultadoDiv = document.getElementById('resultado');
    if (!resultadoDiv) return;

    try {
        const resposta = await fetch('/api/usuarios');
        const usuarios = await resposta.json();

        if (!usuarios || usuarios.length === 0) {
            resultadoDiv.innerHTML = '<h1 id="titulo_form" style="margin-bottom: 20px;">Torcedores no Banco</h1><p class="sem-dados" style="text-align:center; color:#94a3b8;">Nenhum usuário cadastrado ainda.</p>';
            return;
        }

        let html = '<h1 id="titulo_form" style="margin-bottom: 20px;">Torcedores no Banco</h1>';
        
        html += '<div class="table-wrapper"><table>';
        html += '<thead><tr><th>ID</th><th>Nome</th><th>Email</th><th>Senha</th><th>País</th><th>Data de Nascimento</th><th>Jogador Favorito</th><th>Idade</th></tr></thead>';
        html += '<tbody>';

        for (const usuario of usuarios) {
            const idade = calcularIdade(usuario.data_nascimento);
            const idTorcedor = usuario.id || usuario.ID || '---';
            const nomeTorcedor = usuario.nome || '---';
            const emailTorcedor = usuario.email || '---';
            const senhaTorcedor = usuario.senha || '---';
            const paisTorcedor = usuario.pais || '---';
            const dataTorcedor = usuario.data_nascimento || '---';
            const jogadorTorcedor = usuario.jogador_favorito || '---';
            html += `<tr>
                <td><strong>#${idTorcedor}</strong></td>
                <td>${nomeTorcedor}</td>
                <td>${emailTorcedor}</td>
                <td><code>${senhaTorcedor}</code></td>
                <td>${paisTorcedor}</td>
                <td>${dataTorcedor}</td>
                <td>${jogadorTorcedor}</td>
                <td><span style="background: rgba(99, 102, 241, 0.15); color: #818cf8; padding: 4px 10px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; border: 1px solid rgba(99, 102, 241, 0.3);">${idade} anos</span></td>
            </tr>`;
        }
        
        html += '</tbody></table></div>';
        html += '<br><input type="button" value="Cadastrar Novo Torcedor" onclick="window.location.href=\'../index.html\'" style="max-width: 250px; display: block; margin: 20px auto 0 auto;">';
        resultadoDiv.innerHTML = html;
    } catch (erro) {
        console.error('Erro ao carregar resultados:', erro);
        resultadoDiv.innerHTML = '<h1 id="titulo_form" style="margin-bottom: 20px;">Torcedores no Banco</h1><p class="erro-dados" style="text-align:center; color:#f43f5e;">Erro ao conectar com o banco de dados.</p>';
    }
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

function getInputs(){
    return {
        nome: document.getElementById('nome'),
        email: document.getElementById('email'),
        senha: document.getElementById('senha'),
        pais: document.getElementById('pais'),
        data_nascimento: document.getElementById('data_nascimento'),
        jogador_favorito: document.getElementById('jogador_favorito') // <-- Novo
    };
}

function getValores({nome, email, senha, pais, data_nascimento, jogador_favorito}){
    return {
        nome: nome.value.trim(),
        email: email.value.trim(),
        senha: senha.value.trim(),
        pais: pais.value.trim(),
        data_nascimento: data_nascimento.value.trim(),
        jogador_favorito: jogador_favorito.value.trim() // <-- Novo
    };
}