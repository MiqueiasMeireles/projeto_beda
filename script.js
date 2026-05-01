// FUNÇÃO LOADING INICIAL
window.onload = () => {
  setTimeout(() => {
    document.getElementById("loading").style.display = "none";
  }, 950);
};

// FUNÇÃO LOADING BOTÕES
function setLoading(button, text = "Carregando...") {
  button.dataset.original = button.textContent;
  button.textContent = text;
  button.disabled = true;
}

//// CONTROLE DAS ESTRELAS
let notaSelecionada = 0;

document.querySelectorAll(".stars span").forEach(star => {
  star.addEventListener("click", () => {
    notaSelecionada = star.dataset.star;

    document.querySelectorAll(".stars span").forEach(s => {
      s.classList.remove("active");
    });

    for (let i = 0; i < notaSelecionada; i++) {
      document.querySelectorAll(".stars span")[i].classList.add("active");
    }
  });
});
function enviarAvaliacao() {
  const comentario = document.getElementById("comentario").value;

  if (notaSelecionada === 0) {
    showToast("Selecione uma nota");
    return;
  }

  const avaliacao = {
    nota: notaSelecionada,
    comentario: comentario,
    data: new Date().toISOString()
  };

  let avaliacoes = JSON.parse(localStorage.getItem("avaliacoes")) || [];
  avaliacoes.push(avaliacao);

  localStorage.setItem("avaliacoes", JSON.stringify(avaliacoes));
  localStorage.setItem("avaliou", "true");

  if ("vibrate" in navigator) {
    navigator.vibrate([20, 40, 20]);
  }
  document.body.onclick = () => {
    if ("vibrate" in navigator) {
      navigator.vibrate(100);
    }
  };

  fecharModalAvaliacao();
  showToast("Obrigado pelo feedback!");
}
function abrirModalAvaliacao() {
  if (localStorage.getItem("avaliou")) return;

  const modal = document.getElementById("avaliacao-modal");

  modal.classList.remove("hidden");

  requestAnimationFrame(() => {
    modal.classList.add("active");
  });
}

function fecharModalAvaliacao() {
  const modal = document.getElementById("avaliacao-modal");

  modal.classList.remove("active");

  setTimeout(() => {
    modal.classList.add("hidden");
  }, 250);
}

function resetButton(button, text = null) {
  button.textContent = text || button.dataset.original;
  button.disabled = false;
}

// NAVEGAÇÃO ENTRE TELAS
function navigate(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });

  document.getElementById(screenId).classList.add('active');

  // ATUALIZAR NAVBAR
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });

  const activeItem = document.querySelector(`.nav-item[onclick*="${screenId}"]`);
  if (activeItem) activeItem.classList.add('active');

  if (screenId === "consultas") {
    carregarConsultas();
  }

  if (screenId === "perfil") {
  carregarPerfil();
  }

  if (screenId === "resultados") {
    carregarResultados();
  }
  const fab = document.getElementById("fab");
  const hideFabScreens = ["agendamento","consultas"];

  if (hideFabScreens.includes(screenId)) {
    fab.style.display = "none";
  } else {
    fab.style.display = "flex";
  }

}

// DADOS DO PERFIL (simulação)
let perfil = {
  nome: "João da Silva",
  cpf: "123.456.789-00",
  nascimento: "01/01/1990",
  telefone: "(22) 99999-9999",
  convenio: "Ases",
  numero: "000123456",
  status: "Ativo"
};

function carregarPerfil() {
  document.getElementById("perfilNome").textContent = perfil.nome;
  document.getElementById("perfilCpf").textContent = perfil.cpf;
  document.getElementById("perfilNascimento").textContent = perfil.nascimento;
  document.getElementById("perfilTelefone").textContent = perfil.telefone;
  document.getElementById("perfilConvenio").textContent = perfil.convenio;
  document.getElementById("perfilNumero").textContent = perfil.numero;

  document.querySelector(".convenio").textContent = perfil.convenio;
  document.querySelector(".status").textContent = perfil.status;

  qrAtivo = false;
  document.getElementById("qrcode").innerHTML = "";
}

function editarPerfil() {
  const nome = prompt("Nome:", perfil.nome);
  const telefone = prompt("Telefone:", perfil.telefone);
  const convenio = prompt("Convenio:", perfil.convenio);

  if (nome) perfil.nome = nome;
  if (telefone) perfil.telefone = telefone;
  if (convenio) perfil.convenio = convenio;

  carregarPerfil();
  showToast("Perfil atualizado");
}

// QR CODE
let qrAtivo = false;

// ⚠️ AJUSTAR gerarQR()
function gerarQR(button) {
  const container = document.getElementById("qrcode");

  if (qrAtivo) {
    showToast("QR já gerado");
    return;
  }

  setLoading(button, "Gerando...");

  setTimeout(() => {
    container.innerHTML = "";

    const dados = `${perfil.numero}|${Date.now()}`;

    new QRCode(container, {
      text: dados,
      width: 180,
      height: 180
    });

    qrAtivo = true;

    resetButton(button, "QR pronto");
    showToast("QR pronto para uso");
  }, 600);
}

// DADOS MOCKADOS (simulação)
const exames = [
  {
    nome: "Hemograma",
    preparo: "Jejum de 8 horas",
    detalhes: "Coleta de sangue para análise completa, incluindo glóbulos vermelhos, brancos e plaquetas. Importante para diagnóstico de anemia, infecções e outras condições hematológicas.",
    data: "10/04/2026",
    status: "disponivel",
    resultado: "resultados/hemograma.pdf"
  },
  {
    nome: "Raio-X",
    preparo: "Sem preparo necessário",
    detalhes: "Imagem para avaliação óssea, pulmonar e outras estruturas. Útil para diagnóstico de fraturas, infecções e outras condições.",
    data: "12/04/2026",
    status: "analise",
    resultado: null
  },
  {
    nome: "Ultrassonografia",
    preparo: "Beber água antes",
    detalhes: "Avaliação por imagem em tempo real, útil para órgãos abdominais e pélvicos. Pode ser necessário jejum ou bexiga cheia dependendo da área a ser examinada."
  },
  {
    nome: "Eletrocardiograma",
    preparo: "Sem preparo necessário",
    detalhes: "Registro da atividade elétrica do coração, útil para diagnóstico de arritmias e outras condições cardíacas. Recomenda-se evitar cafeína e exercícios antes do exame."
  },
  {
    nome: "Teste de glicemia",
    preparo: "Jejum de 8 horas",
    detalhes: "Medida do nível de açúcar no sangue, importante para diagnóstico e monitoramento de diabetes. Requer jejum para resultados precisos, evitando alimentos e bebidas que possam alterar os níveis de glicose." 
  },
  {
    nome: "Exame de urina",
    preparo: "Coletar primeira urina da manhã",
    detalhes: "Análise da urina para detectar infecções, doenças renais e outras condições. A coleta deve ser feita com a primeira urina do dia para garantir maior concentração de substâncias a serem analisadas."
  }
];

const resultados = [
  {
    nome: "Hemograma",
    data: "2026-04-10",
    status: "Disponível"
  },
  {
    nome: "Raio-X",
    data: "2026-04-12",
    status: "Em análise"
  }
];

// CARREGAR EXAMES
function carregarExames() {
  const container = document.getElementById("listaExames");
  container.innerHTML = "";

  exames.forEach((exame, index) => {
    const div = document.createElement("div");
    div.classList.add("card");

    div.innerHTML = `
      <h3>${exame.nome}</h3>
      <p>${exame.preparo}</p>
      <div id="detalhe-${index}" class="detalhe hidden">
        <p>${exame.detalhes}</p>
      </div>
    <button onclick="event.stopPropagation(); toggleDetalhe(${index})">
      Ver mais
    </button>
    `;

    container.appendChild(div);
  });
}

// CARREGAR RESULTADOS
function carregarResultados() {
  const container = document.getElementById("listaResultados");
  container.innerHTML = "";

  exames
    .filter(exame => exame.status === "disponivel" || exame.status === "analise")
    .forEach(exame => {

      const div = document.createElement("div");
      div.classList.add("card");

      const disponivel = exame.status === "disponivel";

      div.innerHTML = `
        <h3>${exame.nome}</h3>
        <p>${exame.data || ""}</p>
        <p>Status: ${disponivel ? "Disponível" : "Em análise"}</p>

        <button 
          onclick="abrirResultado('${exame.resultado}')"
          ${!disponivel ? "disabled" : ""}
        >
          ${disponivel ? "Visualizar" : "Indisponível"}
        </button>
      `;

      container.appendChild(div);
    });
}
function abrirResultado(url) {
  if (!url) {
    showToast("Resultado indisponível");
    return;
  }

  showToast("Abrindo resultado...");

  setTimeout(() => {
    window.open(url, "_blank");
  }, 400);
}

// DETALHE
function toggleDetalhe(index) {
  const detalhe = document.getElementById(`detalhe-${index}`);
  const button = detalhe.nextElementSibling;

  const isHidden = detalhe.classList.contains("hidden");

  detalhe.classList.toggle("hidden");

  button.textContent = isHidden ? "Ver menos" : "Ver mais";
}

// MENSAGEM DE AGENDAMENTO
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// FUNÇÂO HORÁRIO
let horarioSelecionado = null;

function gerarHorarios() {
  const container = document.getElementById("horarios");
  container.innerHTML = "";
  
  horarioSelecionado = null;
  
  const especialidade = document.getElementById("especialidade").value;
  const data = document.getElementById("data").value;

  if (!data) return;

  const regras = agenda[especialidade];
  const diaSemana = new Date(data).getDay();

  if (!regras.dias.includes(diaSemana)) {
    container.innerHTML = "<p>Sem horários disponíveis</p>";
    return;
  }

  regras.horarios.forEach(h => {
    const btn = document.createElement("button");
    btn.textContent = h;
    btn.classList.add("horario-btn");

    if (estaOcupado(data, h)) {
      btn.disabled = true;
      btn.style.opacity = "0.4";
      btn.style.cursor = "not-allowed";
    }

    btn.onclick = () => {
      if (btn.disabled) return;

      horarioSelecionado = h;

      document.querySelectorAll(".horario-btn").forEach(b => {
        b.classList.remove("selected");
      });

      btn.classList.add("selected");
    };

    container.appendChild(btn);
  });

  const botoes = container.querySelectorAll(".horario-btn");
  
  if (botoes.length === 0 || [...botoes].every(btn => btn.disabled)) {
    container.innerHTML = "<p>Sem horários disponíveis</p>";
  }
}

// DADOS MOCKADOS (simulação agendamento)
const agenda = {
  "Clínico Geral": {
    dias: [1, 2, 3, 4, 5], // segunda a sexta
    horarios: ["09:00", "10:00", "14:00", "15:00"]
  },
  "Cardiologia": {
    dias: [2, 4], // terça e quinta
    horarios: ["10:00", "11:00"]
  },
  "Ortopedia": {
    dias: [1, 3, 5],
    horarios: ["09:00", "11:00", "16:00"]
  },
  "Dermatologia": {
    dias: [1, 4],
    horarios: ["10:00", "14:00"]
  },
  "Neurologia": {
    dias: [3, 5],
    horarios: ["09:00", "15:00"]
  },
  "Endocrinologia": {
    dias: [2, 4],
    horarios: ["10:00", "14:00"]
  },
};

function estaOcupado(data, hora) {
  let consultas = JSON.parse(localStorage.getItem("consultas")) || [];

  return consultas.some(c => c.data === data && c.hora === hora);
}

// AGENDAMENTO
function agendar(button) {

  const especialidade = document.getElementById("especialidade").value;
  const data = document.getElementById("data").value;
  const hora = horarioSelecionado;

  if (!data) {
    showToast("Selecione uma data");
    return;
  }

  if (!hora) {
    showToast("Selecione um horário disponível");
    return;
  }

  setLoading(button, "Processando...");

  setTimeout(() => {
    const consulta = {
      especialidade,
      data,
      hora,
      confirmada: false,
      criadaEm: Date.now()
    };

    let consultas = JSON.parse(localStorage.getItem("consultas")) || [];
    consultas.push(consulta);
    localStorage.setItem("consultas", JSON.stringify(consultas));

    resetButton(button, "Confirmado");
    showToast("Agendamento confirmado!");

    navigate("consultas");

    if (consultas.length === 2 && !localStorage.getItem("avaliou")) {
      setTimeout(() => {
        abrirModalAvaliacao();
      }, 3000);
    }

  }, 1000);
}

let consultaNotificadaIndex = null;

// NOTIFICAÇÃO DAS CONSULTAS 
function verificarConsultasProximas() {
  let consultas = JSON.parse(localStorage.getItem("consultas")) || [];

  const agora = Date.now();

  consultas.forEach((c, index) => {
    const diff = (agora - c.criadaEm) / 1000;

    if (diff > 60 && !c.confirmada && !c.notificada) {
      notificarConsulta(index, c);

      consultas[index].notificada = true;
    }
  });

  localStorage.setItem("consultas", JSON.stringify(consultas));
}

function notificarConsulta(index, consulta) {
  consultaNotificadaIndex = index;

  const box = document.getElementById("notificacao");
  const text = document.getElementById("notif-text");

  text.textContent = `Consulta de ${consulta.especialidade} às ${consulta.hora}`;

  box.classList.remove("hidden");
  setTimeout(() => box.classList.add("show"), 10);
}

function confirmarConsulta(index) {
  let consultas = JSON.parse(localStorage.getItem("consultas")) || [];

  consultas[index].confirmada = true;

  localStorage.setItem("consultas", JSON.stringify(consultas));

  consultaNotificadaIndex = null;

  showToast("Consulta confirmada");
}

function confirmarConsultaAtual() {
  if (consultaNotificadaIndex === null) return;

  confirmarConsulta(consultaNotificadaIndex);
  fecharNotificacao();
}

function fecharNotificacao() {
  const box = document.getElementById("notificacao");

  box.classList.remove("show");

  setTimeout(() => {
    box.classList.add("hidden");
  }, 300);

  consultaNotificadaIndex = null;
}

// FORMATAR DATA
function formatarData(data) {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

// LISTAR CONSULTAS
function carregarConsultas() {
  const container = document.getElementById("listaConsultas");
  container.innerHTML = "";

  let consultas = JSON.parse(localStorage.getItem("consultas")) || [];

  if (consultas.length === 0) {
    container.innerHTML = `
      <div class="empty">
        <p>Você ainda não tem consultas</p>
        <button onclick="navigate('agendamento')">
          Agendar agora
        </button>
      </div>
    `;
    return;
  }

  const btn = document.createElement("button");
  btn.textContent = "Agendar nova consulta";
  btn.classList.add("btn-agendar");
  btn.onclick = () => navigate("agendamento");

  container.appendChild(btn);

  consultas.forEach((c, index) => {
    const div = document.createElement("div");
    div.classList.add("card");

    div.innerHTML = `
      <h3>${c.especialidade}</h3>
      <p>${formatarData(c.data)} às ${c.hora}</p>
      <button onclick="removerConsulta(${index})" class="btn-delete">
        Cancelar
      </button>
    `;

    container.appendChild(div);
  });
}

// REMOVER CONSULTAS
function removerConsulta(index) {
  let consultas = JSON.parse(localStorage.getItem("consultas")) || [];

  consultas.splice(index, 1);

  localStorage.setItem("consultas", JSON.stringify(consultas));

  showToast("Consulta cancelada");

  carregarConsultas();
}

// INICIALIZAÇÃO
carregarExames();
carregarConsultas();
gerarHorarios();

// ÍCONES NAVBAR
lucide.createIcons();
setTimeout(() => lucide.createIcons(), 0);

//VERIFICAÇÃO AUTOMÁTICA DE CONSULTAS PRÓXIMAS
setInterval(verificarConsultasProximas, 2000); // a cada 2 segundos

// ATUALIZAÇÃO DE HORÁRIOS AUTOMÁTICA 
document.getElementById("data").addEventListener("change", gerarHorarios);
document.getElementById("especialidade").addEventListener("change", gerarHorarios);