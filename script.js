// ============================================
// CONFIGURAÇÃO DO BANCO DE DADOS
// ============================================
// ⚠️ COLE SUAS CHAVES DO SUPABASE AQUI:
const supabaseUrl = "https://sqgfmtfbckodkawfcntm.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxZ2ZtdGZiY2tvZGthd2ZjbnRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNzI2MTcsImV4cCI6MjA4OTg0ODYxN30.PmPlOu2zQTnv0Yco_vzxKRDXBxZ4jxSNLelWIL-cEnY";

// Inicia a conexão com o Supabase
const banco = window.supabase.createClient(supabaseUrl, supabaseKey);

// Variável global para guardar todos os produtos
let todosProdutos = [];

// ============================================
// FUNÇÃO PARA CARREGAR O CATÁLOGO
// ============================================
async function carregarCatalogo() {
  let loading = document.getElementById("loading");
  let vitrine = document.getElementById("vitrine");
  let semProdutos = document.getElementById("sem-produtos");

  loading.style.display = "flex";
  vitrine.innerHTML = "";
  semProdutos.style.display = "none";

  // Faz um SELECT * FROM produtos na nuvem
  let { data: produtos, error } = await banco.from("produtos").select("*");

  loading.style.display = "none";

  if (error) {
    console.error("Erro ao buscar dados:", error);
    vitrine.innerHTML =
      '<p style="text-align:center; color:#e63946; padding:40px;">❌ Erro ao carregar produtos. Verifique suas chaves do Supabase.</p>';
    return;
  }

  if (!produtos || produtos.length === 0) {
    semProdutos.style.display = "block";
    return;
  }

  todosProdutos = produtos;
  desenharProdutos(produtos);
}

// ============================================
// FUNÇÃO PARA DESENHAR OS PRODUTOS NA TELA
// ============================================
function desenharProdutos(produtos) {
  let vitrine = document.getElementById("vitrine");
  let semProdutos = document.getElementById("sem-produtos");

  vitrine.innerHTML = "";

  if (produtos.length === 0) {
    semProdutos.style.display = "block";
    return;
  }

  semProdutos.style.display = "none";

  produtos.forEach((item, index) => {
    // Máscara de moeda brasileira
    let precoFormatado = Number(item.preco).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    // Emoji da categoria
    let emojiCat = "🛒";
    if (item.categoria === "Bebidas") emojiCat = "🥤";
    else if (item.categoria === "Salgadinhos") emojiCat = "🍿";
    else if (item.categoria === "Doces") emojiCat = "🍫";
    else if (item.categoria === "Biscoitos") emojiCat = "🍪";
    else if (item.categoria === "Variedades") emojiCat = "✨";

    let div = document.createElement("div");
    div.className = "card-produto";
    div.style.animationDelay = `${index * 0.05}s`;

    div.innerHTML = `
            <div class="card-img-container">
                <img src="${item.imagem_url}" alt="${
      item.nome
    }" onerror="this.src='https://via.placeholder.com/300x200/1a1a1a/e63946?text=Sem+Imagem'">
                <span class="card-categoria-badge">${emojiCat} ${
      item.categoria || "Geral"
    }</span>
            </div>
            <div class="card-body">
                <h3>${item.nome}</h3>
                <span class="card-cat-texto">${
                  item.categoria || "Sem categoria"
                }</span>
                <p class="preco-destaque">${precoFormatado}</p>
            </div>
        `;

    vitrine.appendChild(div);
  });
}

// ============================================
// FILTRO POR CATEGORIA
// ============================================
function filtrar(categoria, botao) {
  // Atualiza botão ativo
  document
    .querySelectorAll(".cat-btn")
    .forEach((btn) => btn.classList.remove("ativo"));
  botao.classList.add("ativo");

  if (categoria === "todos") {
    desenharProdutos(todosProdutos);
  } else {
    let filtrados = todosProdutos.filter((p) => p.categoria === categoria);
    desenharProdutos(filtrados);
  }
}

// ============================================
// MENU MOBILE
// ============================================
function toggleMenu() {
  let navMobile = document.getElementById("nav-mobile");
  navMobile.classList.toggle("aberto");
}

// ============================================
// INICIALIZAÇÃO
// ============================================
carregarCatalogo();
