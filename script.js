// FUNÇÃO LOADING
window.onload = () => {
  setTimeout(() => {
    document.getElementById("loading").style.display = "none";
  }, 950);
};

// NAVEGAÇÃO ENTRE TELAS
function navigate(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });

  document.getElementById(screenId).classList.add('active');

  // 🔥 ATUALIZA NAVBAR
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });

  const activeItem = document.querySelector(`.nav-item[onclick*="${screenId}"]`);
  if (activeItem) activeItem.classList.add('active');

  if (screenId === "consultas") {
    carregarConsultas();
  }
}

// DADOS MOCKADOS (simulação)
const exames = [
  {
    nome: "Hemograma",
    preparo: "Jejum de 8 horas",
    detalhes: "Coleta de sangue para análise completa"
  },
  {
    nome: "Raio-X",
    preparo: "Sem preparo necessário",
    detalhes: "Imagem para avaliação óssea"
  },
  {
    nome: "Ultrassonografia",
    preparo: "Beber água antes",
    detalhes: "Avaliação por imagem em tempo real"
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
      <button onclick="toggleDetalhe(${index})">
        Ver mais
      </button>
    `;

    container.appendChild(div);
  });
}

// DETALHE
function toggleDetalhe(index) {
  const detalhe = document.getElementById(`detalhe-${index}`);
  detalhe.classList.toggle("hidden");
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

  const horarios = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

  horarios.forEach(h => {
    const btn = document.createElement("button");
    btn.textContent = h;
    btn.classList.add("horario-btn");

    btn.onclick = () => {
      horarioSelecionado = h;

      document.querySelectorAll(".horario-btn").forEach(b => {
        b.classList.remove("selected");
      });

      btn.classList.add("selected");
    };

    container.appendChild(btn);
  });
}

// AGENDAMENTO
function agendar() {
  const especialidade = document.getElementById("especialidade").value;
  const data = document.getElementById("data").value;
  const hora = horarioSelecionado;

  if (!data || !hora) {
    showToast("Selecione data e horário");
    return;
  }

  showToast("Processando...");

  setTimeout(() => {
    const consulta = { especialidade, data, hora };

    let consultas = JSON.parse(localStorage.getItem("consultas")) || [];
    consultas.push(consulta);
    localStorage.setItem("consultas", JSON.stringify(consultas));

    showToast("Agendamento confirmado!");

    navigate("consultas");
  }, 1000);
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
      </div>
    `;
    return;
  }

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

//SERVICE WORKER
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js")
    .then(() => console.log("Service Worker registrado"));
}