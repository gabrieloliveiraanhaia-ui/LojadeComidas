// ============================================
// CONFIGURAÇÃO DO BANCO DE DADOS
// ============================================
// ⚠️ COLE SUAS CHAVES DO SUPABASE AQUI:
const supabaseUrl = "https://sqgfmtfbckodkawfcntm.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxZ2ZtdGZiY2tvZGthd2ZjbnRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNzI2MTcsImV4cCI6MjA4OTg0ODYxN30.PmPlOu2zQTnv0Yco_vzxKRDXBxZ4jxSNLelWIL-cEnY";

const banco = window.supabase.createClient(supabaseUrl, supabaseKey);

// ============================================
// VERIFICAR ACESSO (PROTEÇÃO DA PÁGINA)
// ============================================
async function verificarAcesso() {
  const {
    data: { user },
  } = await banco.auth.getUser();

  if (!user) {
    alert("⛔ Área restrita! Faça login primeiro.");
    window.location.href = "login.html";
  } else {
    document.getElementById("nome-usuario").innerText = user.email;
    carregarProdutosAdmin();
  }
}
verificarAcesso();

// ============================================
// FUNÇÃO DE CADASTRO
// ============================================
async function cadastrarProduto() {
  let nomeProduto = document.getElementById("input-nome").value.trim();
  let precoProduto = document.getElementById("input-preco").value;
  let imagemProduto = document.getElementById("input-imagem").value.trim();
  let categoriaProduto = document.getElementById("input-categoria").value;
  let aviso = document.getElementById("mensagem-aviso");
  let btn = document.getElementById("btn-cadastrar");

  // Validação
  if (nomeProduto === "" || precoProduto === "" || categoriaProduto === "") {
    aviso.innerText = "⚠️ Preencha todos os campos obrigatórios!";
    aviso.style.color = "#e63946";
    return;
  }

  aviso.innerText = "☁️ Salvando na nuvem...";
  aviso.style.color = "#3498db";
  btn.disabled = true;

  // Envia o INSERT para o Supabase
  let { error } = await banco.from("produtos").insert([
    {
      nome: nomeProduto,
      preco: precoProduto,
      imagem_url:
        imagemProduto ||
        "https://via.placeholder.com/300x200/1a1a1a/e63946?text=Sem+Imagem",
      categoria: categoriaProduto,
    },
  ]);

  btn.disabled = false;

  if (error) {
    aviso.innerText = "❌ Erro ao salvar: " + error.message;
    aviso.style.color = "#e63946";
  } else {
    aviso.innerText = "✅ Produto cadastrado com sucesso!";
    aviso.style.color = "#2ecc71";

    // Limpa os campos
    document.getElementById("input-nome").value = "";
    document.getElementById("input-preco").value = "";
    document.getElementById("input-imagem").value = "";
    document.getElementById("input-categoria").value = "";

    // Atualiza a lista
    carregarProdutosAdmin();

    // Limpa a mensagem após 3 segundos
    setTimeout(() => {
      aviso.innerText = "";
    }, 3000);
  }
}

// ============================================
// CARREGAR LISTA DE PRODUTOS NO ADMIN
// ============================================
async function carregarProdutosAdmin() {
  let lista = document.getElementById("lista-produtos-admin");
  let total = document.getElementById("total-produtos");

  lista.innerHTML =
    '<div class="loading"><div class="spinner"></div><p>Carregando...</p></div>';

  let { data: produtos, error } = await banco
    .from("produtos")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    lista.innerHTML =
      '<p style="text-align:center; color:#e63946; padding:20px;">Erro ao carregar produtos.</p>';
    return;
  }

  total.innerText = produtos ? produtos.length : 0;

  if (!produtos || produtos.length === 0) {
    lista.innerHTML =
      '<p style="text-align:center; color:#8a8a8a; padding:40px;">Nenhum produto cadastrado ainda.</p>';
    return;
  }

  lista.innerHTML = "";

  produtos.forEach((item) => {
    let precoFormatado = Number(item.preco).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    let div = document.createElement("div");
    div.className = "admin-produto-item";
    div.innerHTML = `
            <img src="${item.imagem_url}" alt="${
      item.nome
    }" onerror="this.src='https://via.placeholder.com/50x50/1a1a1a/e63946?text=?'">
            <div class="admin-produto-info">
                <h4>${item.nome}</h4>
                <span>🏷️ ${item.categoria || "Sem categoria"}</span>
            </div>
            <span class="admin-produto-preco">${precoFormatado}</span>
            <button class="admin-produto-delete" onclick="deletarProduto(${
              item.id
            })">🗑️</button>
        `;
    lista.appendChild(div);
  });
}

// ============================================
// DELETAR PRODUTO
// ============================================
async function deletarProduto(id) {
  if (!confirm("Tem certeza que deseja excluir este produto?")) return;

  let { error } = await banco.from("produtos").delete().eq("id", id);

  if (error) {
    alert("Erro ao deletar: " + error.message);
  } else {
    carregarProdutosAdmin();
  }
}

// ============================================
// LOGOUT
// ============================================
async function sairDoSistema() {
  await banco.auth.signOut();
  window.location.href = "index.html";
}
