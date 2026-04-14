// ============================================
// CONFIGURAÇÃO DO BANCO DE DADOS
// ============================================
// ⚠️ COLE SUAS CHAVES DO SUPABASE AQUI:
const supabaseUrl = "https://sqgfmtfbckodkawfcntm.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxZ2ZtdGZiY2tvZGthd2ZjbnRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNzI2MTcsImV4cCI6MjA4OTg0ODYxN30.PmPlOu2zQTnv0Yco_vzxKRDXBxZ4jxSNLelWIL-cEnY";

const banco = window.supabase.createClient(supabaseUrl, supabaseKey);

// ============================================
// VERIFICAR SE JÁ ESTÁ LOGADO (Desafio 2)
// ============================================
async function verificarSeJaLogado() {
  const {
    data: { user },
  } = await banco.auth.getUser();
  if (user) {
    // Se já está logado, redireciona direto para o admin
    window.location.href = "admin.html";
  }
}
verificarSeJaLogado();

// ============================================
// MOSTRAR/OCULTAR SENHA
// ============================================
function mostrarSenha() {
  let inputSenha = document.getElementById("password");
  let btnOlho = document.getElementById("btn-olho");

  if (inputSenha.type === "password") {
    inputSenha.type = "text";
    btnOlho.innerText = "🙈";
  } else {
    inputSenha.type = "password";
    btnOlho.innerText = "👁️";
  }
}

// ============================================
// FUNÇÃO DE LOGIN
// ============================================
async function fazerLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const msg = document.getElementById("mensagem");
  const btn = document.getElementById("btn-entrar");
  const btnTexto = document.getElementById("btn-entrar-texto");

  // Validação
  if (email === "" || password === "") {
    msg.innerText = "⚠️ Preencha todos os campos!";
    msg.style.color = "#e63946";
    return;
  }

  // Efeito de carregamento
  btnTexto.innerText = "Verificando...";
  btn.disabled = true;

  // Comando que tenta logar no Supabase
  const { data, error } = await banco.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    msg.innerText = "❌ Acesso Negado: E-mail ou senha incorretos.";
    msg.style.color = "#e63946";
    btnTexto.innerText = "Entrar no Painel";
    btn.disabled = false;
  } else {
    msg.innerText = "✅ Acesso concedido! Carregando painel...";
    msg.style.color = "#2ecc71";
    setTimeout(() => {
      window.location.href = "admin.html";
    }, 1000);
  }
}

// ============================================
// EVENT LISTENER - ENTER NO CAMPO SENHA (Desafio 1)
// ============================================
document
  .getElementById("password")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      fazerLogin();
    }
  });

// Também no campo de e-mail
document.getElementById("email").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    fazerLogin();
  }
});
