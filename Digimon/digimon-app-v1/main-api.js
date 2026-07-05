let URLDigimon = "https://digimon-api.vercel.app/api/digimon";
let digimonArray = [];
const listaDigimon = document.querySelector("#listado-digimon");
const digiBtn = document.querySelectorAll(".digi-btn");
const btnFilter = document.querySelector('.digi-icon-filter')
const filtrosNiveles = document.querySelectorAll(".digimon-filtro-tipos input[type=checkbox]");
const buscador = document.querySelector("#digi-search-id");
const closeFilter = document.querySelector(".digimon-filtro-close");

fetch(URLDigimon)
    .then((response) => response.json())
    .then(data => {
        digimonArray = data;
        mostrarDigimon(digimonArray, 0, 50)
    });

function mostrarDigimon(digimon, inicio, final){
    listaDigimon.innerHTML = "";
    const cantidadMax = digimon.slice(inicio, final)
    cantidadMax.forEach(digimon => {
        const div = document.createElement("div");
        div.classList.add("digimon-card");
        div.id = digimon.name;
        div.onclick = (event) => {
            digiCrearModal(event.currentTarget.id);
        };
        div.innerHTML = `
            <div class="digimon-imagen">
                <img src="${digimon.img}" alt="${digimon.name}">
            </div>
            <div class="digimon-info">
                <div class="digimon-nombre">
                    <p>${digimon.name}</p>
                    <p class="digimon-nivel ${digimon.level}">${digimon.level}</p>
                </div>
            </div>`;
        listaDigimon.append(div);
    });
}

function digiCrearModal(digiNameModal) {
    let newDigi = "https://digi-api.com/api/v1/digimon/" + digiNameModal;
    let actDigi = "https://digimon-api.vercel.app/api/digimon/name/" + digiNameModal;

    fetch(newDigi)
        .then((response) => {
            if (!response.ok) throw new Error("Error en la petición");
            return response.json();
        })
        .then(digimon => {
            if (!digimon || !digimon.images || !digimon.types) {
                return fetch(actDigi)
                    .then(res => res.json())
                    .then(digimon2 => {
                        const digi = digimon2[0];
                        mostrarModalSimple(digi.name, digi.img, digi.level);
                    });
            }

            mostrarModalCompleto(digimon);
        })
        .catch(() => {
            fetch(actDigi)
                .then(res => res.json())
                .then(digimon2 => {
                    const digi = digimon2[0];
                    mostrarModalSimple(digi.name, digi.img, digi.level);
                });
        });
}

function mostrarModalCompleto(digimon) {
    const overlay = document.createElement("div");
    overlay.classList.add("modal-overlay");

    const modal = document.createElement("div");
    modal.classList.add("modal");

    let tipos = (digimon.types || []).map(t => `<p>${t.type}</p>`).join('');
    let atr = (digimon.attributes || []).map(a => `<p>${a.attribute}</p>`).join('');
    let fields = (digimon.fields || []).map(f => `<img src="${f.image}" alt="${f.field}">`).join('');

    modal.innerHTML = `
        <span class="modal-close">&times;</span>
        <div class="digimon-imagen">
            <img src="${digimon.images[0].href}" alt="${digimon.name}">
        </div>
        <div class="digimon-info">
            <p>${digimon.name}</p>
            <h3>Atributos</h3><div>${atr}</div>
            <h3>Tipo</h3><div>${tipos}</div>
            <h3>Fields</h3><div>${fields}</div>
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    overlay.querySelector(".modal-close").onclick = () => overlay.remove();
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
}

function mostrarModalSimple(name, img, level) {
    const overlay = document.createElement("div");
    overlay.classList.add("modal-overlay");

    const modal = document.createElement("div");
    modal.classList.add("modal");

    modal.innerHTML = `
        <span class="modal-close">&times;</span>
        <div class="digimon-imagen">
            <img src="${img}" alt="${name}">
        </div>
        <div class="digimon-info">
            <p>${name}</p>
            <p class="digimon-nivel ${level}">${level}</p>
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    overlay.querySelector(".modal-close").onclick = () => overlay.remove();
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
}

closeFilter.addEventListener('click', () => {
    const containerFilter = document.querySelector('.digimon-filtros')
    containerFilter.classList.toggle('active')
})

btnFilter.addEventListener('click', () => {
    const containerFilter = document.querySelector('.digimon-filtros')
    containerFilter.classList.toggle('active')
})

window.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('.container');
    const form2 = document.getElementById('.digimon-filtros');
    if (form) form.reset();
    if (form2) form.reset();
});

window.addEventListener('pageshow', (ev) => {
    if (ev.persisted) {
        const form = document.getElementById('.container');
        const form2 = document.getElementById('.digimon-filtros');
        if (form) form.reset();
        if (form2) form.reset();
    }
});

function desmarcarTodos() {
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
}

window.addEventListener('DOMContentLoaded', desmarcarTodos);
window.addEventListener('pageshow', (ev) => {
    if (ev.persisted) desmarcarTodos();
});

buscador.addEventListener("input", (event) => {
    const texto = event.target.value.toLowerCase();
    listaDigimon.innerHTML = "";
    const filtrados = digimonArray.filter(digi =>
        digi.name.toLowerCase().includes(texto)
    );
    mostrarDigimon(filtrados, 0, filtrados.length);
});

function aplicarFiltros() {
    const texto = buscador.value.toLowerCase();
    const nivelesSeleccionados = Array.from(filtrosNiveles)
        .filter(chk => chk.checked)
        .map(chk => chk.value);

    let filtrados = digimonArray.filter(digi => {
        const coincideTexto = digi.name.toLowerCase().includes(texto);
        const coincideNivel = nivelesSeleccionados.length === 0 || nivelesSeleccionados.includes(digi.level);
        return coincideTexto && coincideNivel;
    });

    mostrarDigimon(filtrados, 0, filtrados.length);
}

buscador.addEventListener("input", aplicarFiltros);
filtrosNiveles.forEach(chk => chk.addEventListener("change", aplicarFiltros));