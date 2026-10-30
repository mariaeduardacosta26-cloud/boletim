// DADOS FICTÍCIOS PADRONIZADOS — 9º ANO
const dadosDisciplinas = [
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

// Função que normaliza qualquer tipo de entrada para a escala de 0 a 10
function normalizarNota(valor) {
  // Trata valores ausentes
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  // Converte vírgula decimal em ponto, se for texto
  if (typeof valor === "string") {
    valor = valor.replace(",", ".");
  }

  let numero = Number(valor);

  // Se não for um número válido, descarta
  if (isNaN(numero)) {
    return null;
  }

  // Converte escala de 0 a 100 para 0 a 10
  if (numero > 10 && numero <= 100) {
    numero = numero / 10;
  }

  // Verifica se está dentro do limite de 0 a 10
  if (numero >= 0 && numero <= 10) {
    return numero;
  }

  return null; // Caso esteja fora de 0 a 10
}

// Função principal para montar a tabela e calcular os resumos
function renderizarBoletim() {
  const tabelaCorpo = document.getElementById("tabela-corpo");
  tabelaCorpo.innerHTML = ""; // Limpa a tabela

  let somaMediasGerais = 0;
  let qtdDisciplinasComMedia = 0;
  let totalFaltasGeral = 0;
  let qtdBomDesempenho = 0;
  let qtdAtencao = 0;

  // Passa por cada disciplina do nosso array
  dadosDisciplinas.forEach((item) => {
    // Normaliza as notas dos três trimestres
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    // Junta as notas válidas para calcular a média
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

    // Soma as faltas dos trimestres
    const totalFaltasDisc = item.faltas.reduce((acc, curr) => acc + curr, 0);
    totalFaltasGeral += totalFaltasDisc;

    // Formatação de exibição das notas
    const exibeN1 = n1 !== null ? n1.toFixed(1).replace(".", ",") : "—";
    const exibeN2 = n2 !== null ? n2.toFixed(1).replace(".", ",") : "—";
    const exibeN3 = n3 !== null ? n3.toFixed(1).replace(".", ",") : "—";
    const exibeMedia = media !== null ? media.toFixed(1).replace(".", ",") : "—";

    // Cria a linha da tabela em HTML
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${item.disciplina}</strong></td>
      <td>${exibeN1}</td>
      <td>${exibeN2}</td>
      <td>${exibeN3}</td>
      <td><strong>${exibeMedia}</strong></td>
      <td>${totalFaltasDisc}</td>
      <td><span class="situacao-tag ${situacaoClasse}">${situacaoTexto}</span></td>
    `;

    tabelaCorpo.appendChild(tr);
  });

  // Atualiza os Cards de Resumo no topo do site
  const mediaGeralCalculada = qtdDisciplinasComMedia > 0 
    ? (somaMediasGerais / qtdDisciplinasComMedia).toFixed(1).replace(".", ",") 
    : "—";

  document.getElementById("media-geral").textContent = mediaGeralCalculada;
  document.getElementById("total-faltas").textContent = totalFaltasGeral;
  document.getElementById("qtd-bom-desempenho").textContent = qtdBomDesempenho;
  document.getElementById("qtd-atencao").textContent = qtdAtencao;

  // NOTA: O percentual de frequência abaixo é apenas demonstrativo/fictício nesta versão.
  document.getElementById("frequencia").textContent = "92%";
  document.getElementById("frequencia-status").textContent = "Frequência adequada";
}

// Executa a função assim que a página carregar
document.addEventListener("DOMContentLoaded", renderizarBoletim);