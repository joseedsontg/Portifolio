// ===== 1. MENU RESPONSIVO =====
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function () {
        navMenu.classList.toggle('ativo');
        const icone = menuToggle.querySelector('i');
        if (navMenu.classList.contains('ativo')) {
            icone.classList.remove('fa-terminal');
            icone.classList.add('fa-times');
        } else {
            icone.classList.remove('fa-times');
            icone.classList.add('fa-terminal');
        }
    });

    navMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            navMenu.classList.remove('ativo');
            const icone = menuToggle.querySelector('i');
            icone.classList.remove('fa-times');
            icone.classList.add('fa-terminal');
        });
    });
}

// ===== 2. BOTÃO "MOSTRAR MAIS" =====
const btnMostrarMais = document.getElementById('btnMostrarMais');
const maisTexto = document.getElementById('maisTexto');

if (btnMostrarMais && maisTexto) {
    btnMostrarMais.addEventListener('click', function () {
        maisTexto.classList.toggle('visivel');
        if (maisTexto.classList.contains('visivel')) {
            btnMostrarMais.textContent = '$ mostrar_menos';
        } else {
            btnMostrarMais.textContent = '$ mostrar_mais';
        }
    });
}

// ===== 3. VALIDAÇÃO DO FORMULÁRIO =====
const formContato = document.getElementById('formContato');

if (formContato) {
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const mensagemInput = document.getElementById('mensagem');
    const erroNome = document.getElementById('erroNome');
    const erroEmail = document.getElementById('erroEmail');
    const erroMensagem = document.getElementById('erroMensagem');
    const formSucesso = document.getElementById('formSucesso');

    formContato.addEventListener('submit', function (e) {
        e.preventDefault();
        let valido = true;

        if (nomeInput.value.trim() === '') {
            erroNome.textContent = '→ erro: nome é obrigatório';
            nomeInput.classList.add('erro');
            valido = false;
        } else if (nomeInput.value.trim().length < 3) {
            erroNome.textContent = '→ erro: mínimo 3 caracteres';
            nomeInput.classList.add('erro');
            valido = false;
        } else {
            erroNome.textContent = '';
            nomeInput.classList.remove('erro');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput.value.trim() === '') {
            erroEmail.textContent = '→ erro: email é obrigatório';
            emailInput.classList.add('erro');
            valido = false;
        } else if (!emailRegex.test(emailInput.value.trim())) {
            erroEmail.textContent = '→ erro: email inválido';
            emailInput.classList.add('erro');
            valido = false;
        } else {
            erroEmail.textContent = '';
            emailInput.classList.remove('erro');
        }

        if (mensagemInput.value.trim() === '') {
            erroMensagem.textContent = '→ erro: mensagem é obrigatória';
            mensagemInput.classList.add('erro');
            valido = false;
        } else if (mensagemInput.value.trim().length < 10) {
            erroMensagem.textContent = '→ erro: mínimo 10 caracteres';
            mensagemInput.classList.add('erro');
            valido = false;
        } else {
            erroMensagem.textContent = '';
            mensagemInput.classList.remove('erro');
        }

        if (valido) {
            var formData = new FormData(formContato);
            var btnEnviar = formContato.querySelector('.btn-enviar');
            btnEnviar.disabled = true;
            btnEnviar.textContent = '$ enviando...';

            fetch(formContato.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).then(function (response) {
                if (response.ok) {
                    formSucesso.classList.remove('oculto');
                    formContato.reset();
                    setTimeout(function () {
                        formSucesso.classList.add('oculto');
                    }, 4000);
                } else {
                    alert('Erro ao enviar mensagem. Tente novamente.');
                }
            }).catch(function () {
                alert('Erro de conexão. Verifique sua internet.');
            }).finally(function () {
                btnEnviar.disabled = false;
                btnEnviar.textContent = '$ enviar_mensagem';
            });
        }
    });
}

// ===== 4. ANO ATUAL NO FOOTER =====
const anoAtual = document.getElementById('anoAtual');
if (anoAtual) {
    anoAtual.textContent = new Date().getFullYear();
}

// ===== 5. EFEITO DE DIGITAÇÃO SEQUENCIAL =====
function digitarTexto(elemento, texto, velocidade, callback) {
    let i = 0;
    elemento.textContent = '';
    elemento.style.visibility = 'visible';

    function digitar() {
        if (i < texto.length) {
            elemento.textContent += texto.charAt(i);
            i++;
            setTimeout(digitar, velocidade);
        } else if (callback) {
            callback();
        }
    }
    digitar();
}

function digitarHTML(elemento, textoOriginal, velocidade, callback) {
    elemento.innerHTML = '';
    elemento.style.visibility = 'visible';
    let i = 0;
    let dentroDaTag = false;
    let buffer = '';

    function digitar() {
        if (i < textoOriginal.length) {
            var char = textoOriginal.charAt(i);

            if (char === '<') {
                dentroDaTag = true;
                buffer += char;
                i++;
                digitar();
                return;
            }

            if (dentroDaTag) {
                buffer += char;
                if (char === '>') {
                    dentroDaTag = false;
                    elemento.innerHTML += buffer;
                    buffer = '';
                }
                i++;
                digitar();
                return;
            }

            elemento.innerHTML += char;
            i++;
            setTimeout(digitar, velocidade);
        } else if (callback) {
            callback();
        }
    }
    digitar();
}

// Iniciar sequência de digitação no hero
var linhasTyping = document.querySelectorAll('.typing-line');

if (linhasTyping.length > 0) {
    var linhasArray = Array.prototype.slice.call(linhasTyping);

    // Esconder todas as linhas inicialmente
    linhasArray.forEach(function (linha) {
        linha.style.visibility = 'hidden';
    });

    function digitarLinha(index) {
        if (index >= linhasArray.length) return;

        var linha = linhasArray[index];
        var htmlOriginal = linha.getAttribute('data-text');

        if (htmlOriginal) {
            digitarHTML(linha, htmlOriginal, 30, function () {
                setTimeout(function () {
                    digitarLinha(index + 1);
                }, 200);
            });
        } else {
            linha.style.visibility = 'visible';
            setTimeout(function () {
                digitarLinha(index + 1);
            }, 100);
        }
    }

    setTimeout(function () {
        digitarLinha(0);
    }, 300);
}

// Digitação nos títulos de seção das outras páginas
var tituloTyping = document.querySelector('.section-titulo.typing-titulo');

if (tituloTyping) {
    var textoTitulo = tituloTyping.getAttribute('data-text');
    tituloTyping.textContent = '';

    setTimeout(function () {
        digitarTexto(tituloTyping, textoTitulo, 40, function () {
            // Mostrar conteúdo da página com fade após digitar título
            var conteudoFade = document.querySelectorAll('.fade-in');
            conteudoFade.forEach(function (el, i) {
                setTimeout(function () {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, i * 80);
            });
        });
    }, 300);
}
