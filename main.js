// === Inicializa o mapa ===
var map = L.map('map').setView([-8.89, -36.49], 8);

// === Camadas base ===
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

var cartoLight = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OSM &copy; CARTO',
  subdomains: 'abcd',
  maxZoom: 20
});

var cartoDark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OSM &copy; CARTO',
  subdomains: 'abcd',
  maxZoom: 20
});

var baseMaps = {
  "🌍 Padrão OSM": osm,
  "☀️ Carto Light": cartoLight,
  "🌙 Carto Dark": cartoDark
};

L.control.layers(baseMaps).addTo(map);

// === Ícone personalizado com logo do IBN ===
var ibnIcon = L.icon({
  iconUrl: 'logo/ibn-logo.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -35]
});

// === Função para popup ===
function criarPopup(cidade, alunos) {
  let conteudo = `<div class="popup-card"><h4>${cidade}</h4>`;
  alunos.forEach(a => {
    conteudo += `
      <div class="popup-aluno">
        <img src="alunos/${a.foto}" alt="${a.nome}">
        <div>
          <b>${a.nome}</b><br>
          ⛪ ${a.igreja}
        </div>
      </div>
    `;
  });
  conteudo += `</div>`;
  return conteudo;
}

// === Organizar cidades por estado ===
var listaCidades = document.getElementById("lista-cidades");

var grupos = { "Pernambuco": [], "Alagoas": [], "Paraíba": [] };

campos.forEach(c => {
  if (c.cidade.includes("PE")) grupos["Pernambuco"].push(c);
  else if (c.cidade.includes("AL")) grupos["Alagoas"].push(c);
  else if (c.cidade.includes("PB")) grupos["Paraíba"].push(c);
});

// === Criar grupos no sidebar ===
Object.keys(grupos).forEach(estado => {
  let bloco = document.createElement("div");
  bloco.className = "estado";
  bloco.innerHTML = `<h3>📍 ${estado}</h3>`;
  grupos[estado].forEach(c => {
    let marker = L.marker(c.coords, { icon: ibnIcon }).addTo(map)
      .bindPopup(criarPopup(c.cidade, c.alunos));

    let item = document.createElement("div");
    item.className = "cidade";
    item.innerText = c.cidade;

    item.onclick = () => {
      document.querySelectorAll(".cidade").forEach(ci => ci.classList.remove("ativa"));
      item.classList.add("ativa");
      map.setView(c.coords, 10);
      marker.openPopup();
    };

    bloco.appendChild(item);
  });
  listaCidades.appendChild(bloco);
});

// === Botão de abrir/fechar sidebar no mobile ===
document.getElementById("menu-btn").onclick = () => {
  document.getElementById("sidebar").classList.toggle("open");
};
