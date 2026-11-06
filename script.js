// CONFIGURAÇÃO FIXA DO ALUNO
const CONFIG_ALUNO = {
  turma: "9B",
  numeroChamada: 21,
  apiUrl: "https://boletim-api.profbt.com.br"
};

// Variável em memória para manter o PIN durante a sessão ativa
let pinSessao = "";

// DADOS FICTÍCIOS PADRONIZADOS — 9º ANO (FALLBACK LOCAL)
const dadosDisciplinasPadrao = [
  { disciplina: "Língua Portuguesa", tri1: 78, tri2: "8,2", tri3: 8.6, faltas: [2, 2, 1] },
  { disciplina: "Matemática", tri1: 55, tri2: "5,4", tri3: null, faltas: [3, 2, 2] },
  { disciplina: "Ciências", tri1: 84, tri2: 7.9, tri3: "8,3", faltas: [1, 1, 1] },
  { disciplina: "História", tri1: "7,1", tri2: 82, tri3: null, faltas: [1, 2, 1] },
  { disciplina: "Geografia", tri1: 69, tri2: "7,5", tri3: 7.8, faltas: [0, 1, 1] },
  { disciplina: "Língua Inglesa", tri1: 88, tri2: 8.4, tri3: null, faltas: [1, 0, 1] },
  { disciplina: "Arte", tri1: "9,2", tri2: 87, tri3: 9.0, faltas: [1, 1, 0] },
  { disciplina: "Educação Física", tri1: 96, tri2: "9,3", tri3: null, faltas: [0, 1, 0] },
  { disciplina: "Educação Digital", tri1: 91, tri2: 8.9, tri3: "9,4", faltas: [1, 1, 0] },
  { disciplina: "Educação Financeira", tri1: 76, tri2: "7,2", tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Rec. Aprend. Matemática", tri1: 58, tri2: "5,9", tri3: 6.2, faltas: [2, 2, 1] },
  { disciplina: "Leitura Rec. Aprend. Lingua Portuguesa", tri1: 72, tri2: "7,6", tri3: null, faltas: [2, 1, 1] },
  { disciplina: "Pensamento Lógico", tri1: 49, tri2: 5.5, tri3: "5,8", faltas: [2, 2, 2] },
  { disciplina: "Literatura Arte e Movimento", tri1: "8,0", tri2: 84, tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Práticas Experimentais", tri1: 64, tri2: "6,6", tri3: 7.0, faltas: [1, 1, 1] }
];

// Estado atual dos dados exibidos na página
let dadosDisciplinasAtuais = [];

// Função que normaliza qualquer tipo de entrada para a escala de 0 a 10 (Dados antigos/iniciais)
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  if (typeof valor === "string") {
    valor = valor.replace(",", ".");
  }

  let numero = Number(valor);

  if (isNaN(numero)) {
    return null;
  }

  if (numero > 10 && numero <= 100) {
    numero = numero / 10;
  }

  if (numero >= 0 && numero <= 10) {
    return numero;
  }

  return null;
}

// Validação estrita para edição manual de notas (0 a 10 ou vazio)
function validarNotaEditada(valor) {
  if (valor === null || valor === undefined) return { valido: true, valor: null };
  const str = String(valor).trim();
  if (str === "") return { valido: true, valor: null };

  const strNormalizada = str.replace(",", ".");
  const numero = Number(strNormalizada);

  if (isNaN(numero) || numero < 0 || numero > 10) {
    return { valido: false, valor: null };
  }

  return { valido: true, valor: numero };
}

// Validação estrita para edição manual de faltas (inteiro >= 0)
function validarFaltaEditada(valor) {
  if (valor === null || valor === undefined) return { valido: false, valor: null };
  const str = String(valor).trim();
  if (str === "") return { valido: false, valor: null };

  if (!/^\d+$/.test(str)) {
    return { valido: false, valor: null };
  }

  const numero = Number(str);
  if (isNaN(numero) || numero < 0) {
    return { valido: false, valor: null };
  }

  return { valido: true, valor: numero };
}

// Função principal para montar a tabela e calcular os resumos
function renderizarBoletim() {
  const tabelaCorpo = document.getElementById("tabela-corpo");
  tabelaCorpo.innerHTML = "";

  let somaMediasGerais = 0;
  let qtdDisciplinasComMedia = 0;
  let totalFaltasGeral = 0;
  let qtdBomDesempenho = 0;
  let qtdAtencao = 0;

  dadosDisciplinasAtuais.forEach((item) => {
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    const notasValidas = [n1, n2, n3].filter((n) => n !== null);

    let media = null;
    let situacaoTexto = "Nota ainda não disponível";
    let situacaoClasse = "situacao-indisponivel";

    if (notasValidas.length > 0) {
      const soma = notasValidas.reduce((acc, curr) => acc + curr, 0);
      media = soma / notasValidas.length;

      somaMediasGerais += media;
      qtdDisciplinasComMedia++;

      if (media >= 6.0) {
        situacaoTexto = "Bom desempenho";
        situacaoClasse = "situacao-bom";
        qtdBomDesempenho++;
      } else {
        situacaoTexto = "Atenção";
        situacaoClasse = "situacao-atencao";
        qtdAtencao++;
      }
    }

    let arrFaltas = Array.isArray(item.faltas) ? item.faltas : [0, 0, 0];
    const totalFaltasDisc = arrFaltas.reduce((acc, curr) => acc + Number(curr || 0), 0);
    totalFaltasGeral += totalFaltasDisc;

    const exibeN1 = n1 !== null ? n1.toFixed(1).replace(".", ",") : "—";
    const exibeN2 = n2 !== null ? n2.toFixed(1).replace(".", ",") : "—";
    const exibeN3 = n3 !== null ? n3.toFixed(1).replace(".", ",") : "—";
    const exibeMedia = media !== null ? media.toFixed(1).replace(".", ",") : "—";

    const tr = document.createElement("tr");

    const tdNome = document.createElement("td");
    const strongNome = document.createElement("strong");
    strongNome.textContent = item.disciplina;
    tdNome.appendChild(strongNome);
    tr.appendChild(tdNome);

    const tdN1 = document.createElement("td");
    tdN1.textContent = exibeN1;
    tr.appendChild(tdN1);

    const tdN2 = document.createElement("td");
    tdN2.textContent = exibeN2;
    tr.appendChild(tdN2);

    const tdN3 = document.createElement("td");
    tdN3.textContent = exibeN3;
    tr.appendChild(tdN3);

    const tdMedia = document.createElement("td");
    const strongMedia = document.createElement("strong");
    strongMedia.textContent = exibeMedia;
    tdMedia.appendChild(strongMedia);
    tr.appendChild(tdMedia);

    const tdFaltas = document.createElement("td");
    tdFaltas.textContent = totalFaltasDisc;
    tr.appendChild(tdFaltas);

    const tdSit = document.createElement("td");
    const spanSit = document.createElement("span");
    spanSit.className = `situacao-tag ${situacaoClasse}`;
    spanSit.textContent = situacaoTexto;
    tdSit.appendChild(spanSit);
    tr.appendChild(tdSit);

    tabelaCorpo.appendChild(tr);
  });

  const mediaGeralCalculada = qtdDisciplinasComMedia > 0 
    ? (somaMediasGerais / qtdDisciplinasComMedia).toFixed(1).replace(".", ",") 
    : "—";

  document.getElementById("media-geral").textContent = mediaGeralCalculada;
  document.getElementById("total-faltas").textContent = totalFaltasGeral;
  document.getElementById("qtd-bom-desempenho").textContent = qtdBomDesempenho;
  document.getElementById("qtd-atencao").textContent = qtdAtencao;

  document.getElementById("frequencia").textContent = "92%";
  document.getElementById("frequencia-status").textContent = "Frequência adequada";
}

// Renderiza a tabela do painel de edição
function renderizarTabelaEdicao() {
  const corpo = document.getElementById("tabela-edicao-corpo");
  corpo.innerHTML = "";

  dadosDisciplinasAtuais.forEach((item, index) => {
    const tr = document.createElement("tr");

    const tdNome = document.createElement("td");
    const strong = document.createElement("strong");
    strong.textContent = item.disciplina;
    tdNome.appendChild(strong);
    tr.appendChild(tdNome);

    const n1Val = item.tri1 !== null && item.tri1 !== undefined ? String(item.tri1).replace(".", ",") : "";
    const n2Val = item.tri2 !== null && item.tri2 !== undefined ? String(item.tri2).replace(".", ",") : "";
    const n3Val = item.tri3 !== null && item.tri3 !== undefined ? String(item.tri3).replace(".", ",") : "";

    const arrFaltas = Array.isArray(item.faltas) ? item.faltas : [0, 0, 0];
    const f1Val = arrFaltas[0] !== undefined ? arrFaltas[0] : 0;
    const f2Val = arrFaltas[1] !== undefined ? arrFaltas[1] : 0;
    const f3Val = arrFaltas[2] !== undefined ? arrFaltas[2] : 0;

    tr.innerHTML += `
      <td><input type="text" class="input-edicao" data-index="${index}" data-campo="tri1" value="${n1Val}"></td>
      <td><input type="text" class="input-edicao" data-index="${index}" data-campo="tri2" value="${n2Val}"></td>
      <td><input type="text" class="input-edicao" data-index="${index}" data-campo="tri3" value="${n3Val}"></td>
      <td><input type="text" class="input-edicao" data-index="${index}" data-campo="f1" value="${f1Val}"></td>
      <td><input type="text" class="input-edicao" data-index="${index}" data-campo="f2" value="${f2Val}"></td>
      <td><input type="text" class="input-edicao" data-index="${index}" data-campo="f3" value="${f3Val}"></td>
    `;

    corpo.appendChild(tr);
  });
}

// Evento de Login / Acesso via PIN
document.getElementById("form-login").addEventListener("submit", async (e) => {
  e.preventDefault();
  const inputPin = document.getElementById("pin-input");
  const msgLogin = document.getElementById("login-mensagem");
  const btnEntrar = document.getElementById("btn-entrar");

  const pinDigitado = inputPin.value.trim();
  if (!pinDigitado) return;

  msgLogin.className = "mensagem-status";
  msgLogin.textContent = "Conectando...";
  btnEntrar.disabled = true;

  try {
    const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/abrir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinDigitado
      })
    });

    if (resposta.status === 401) {
      msgLogin.className = "mensagem-status erro";
      msgLogin.textContent = "Turma, chamada ou PIN inválidos.";
      btnEntrar.disabled = false;
      return;
    }

    if (resposta.status === 429) {
      msgLogin.className = "mensagem-status erro";
      msgLogin.textContent = "Muitas tentativas. Aguarde um minuto e tente novamente.";
      btnEntrar.disabled = false;
      return;
    }

    if (!resposta.ok) {
      throw new Error("Erro de rede/servidor");
    }

    const resultado = await resposta.json();

    // PIN mantido somente em memória
    pinSessao = pinDigitado;
    inputPin.value = "";

    // Aplicação das regras de carregamento de dados
    if (resultado && resultado.dados && Array.isArray(resultado.dados.disciplinas) && resultado.dados.disciplinas.length > 0) {
      dadosDisciplinasAtuais = resultado.dados.disciplinas;
    } else {
      dadosDisciplinasAtuais = JSON.parse(JSON.stringify(dadosDisciplinasPadrao));
    }

    document.getElementById("area-login").style.display = "none";
    document.getElementById("conteudo-boletim").style.display = "block";

    renderizarBoletim();

  } catch (erro) {
    msgLogin.className = "mensagem-status erro";
    msgLogin.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
    btnEntrar.disabled = false;
  }
});

// Abertura do Painel de Edição
document.getElementById("btn-alterar-dados").addEventListener("click", () => {
  renderizarTabelaEdicao();
  document.getElementById("edicao-mensagem").textContent = "";
  document.getElementById("painel-edicao").style.display = "block";
});

// Cancelar Edição
document.getElementById("btn-cancelar-edicao").addEventListener("click", () => {
  document.getElementById("painel-edicao").style.display = "none";
});

// Salvar Alterações na API
document.getElementById("btn-salvar-dados").addEventListener("click", async () => {
  const msgEdicao = document.getElementById("edicao-mensagem");
  const inputs = document.querySelectorAll("#tabela-edicao-corpo .input-edicao");
  let possuiErro = false;

  inputs.forEach((input) => input.classList.remove("invalido"));
  msgEdicao.className = "mensagem-status";
  msgEdicao.textContent = "";

  // Estrutura temporária para validação
  const novosDados = JSON.parse(JSON.stringify(dadosDisciplinasAtuais));

  inputs.forEach((input) => {
    const index = input.getAttribute("data-index");
    const campo = input.getAttribute("data-campo");
    const val = input.value;

    if (campo.startsWith("tri")) {
      const res = validarNotaEditada(val);
      if (!res.valido) {
        input.classList.add("invalido");
        possuiErro = true;
      } else {
        novosDados[index][campo] = res.valor;
      }
    } else if (campo.startsWith("f")) {
      const res = validarFaltaEditada(val);
      if (!res.valido) {
        input.classList.add("invalido");
        possuiErro = true;
      } else {
        const numTri = parseInt(campo.replace("f", ""), 10) - 1;
        if (!Array.isArray(novosDados[index].faltas)) {
          novosDados[index].faltas = [0, 0, 0];
        }
        novosDados[index].faltas[numTri] = res.valor;
      }
    }
  });

  if (possuiErro) {
    msgEdicao.className = "mensagem-status erro";
    msgEdicao.textContent = "Existem campos com valores inválidos. Corrija-os para continuar.";
    return;
  }

  msgEdicao.textContent = "Salvando...";

  try {
    const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/salvar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinSessao,
        dados: {
          disciplinas: novosDados
        }
      })
    });

    if (!resposta.ok) {
      throw new Error("Erro ao salvar");
    }

    dadosDisciplinasAtuais = novosDados;
    renderizarBoletim();

    msgEdicao.className = "mensagem-status sucesso";
    msgEdicao.textContent = "Dados salvos com sucesso.";

    setTimeout(() => {
      document.getElementById("painel-edicao").style.display = "none";
    }, 1200);

  } catch (erro) {
    msgEdicao.className = "mensagem-status erro";
    msgEdicao.textContent = "Não foi possível salvar os dados. Tente novamente.";
  }
});