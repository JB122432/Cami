
const welcome = document.getElementById("welcome");
const gardenScene = document.getElementById("gardenScene");
const letterScene = document.getElementById("letterScene");

const startButton = document.getElementById("startButton");
const letterButton = document.getElementById("letterButton");
const replayButton = document.getElementById("replayButton");
const backButton = document.getElementById("backButton");

const garden = document.getElementById("garden");
const flowersContainer = document.getElementById("flowers");
const starsContainer = document.getElementById("stars");
const gardenCaption = document.getElementById("gardenCaption");
const letterText = document.getElementById("letterText");

// Personaliza aquí el mensaje de tu novia.
const mensaje = `Hoy quería darte algo diferente 
¿Para que darte flores noche tras noche si puedo entregarte un jardín? 

Sé que la distancia hace este proceso más difícil, pero a la vez, sé que, así como esta, 
encontrare mil formas para hacerte sentir especial, tu confía. 


Que descanses, sueña bonito y mañana hablamos.

Descansa hermosa ♡, TQM.
`;

// Colores de las flores.
const colores = [
    "#e9a8ba",
    "#f1c0cb",
    "#d7b7df",
    "#f5d7a1",
    "#e6a4b5"
];

// Posición, tamaño y color de cada flor.

const configuracionFlores = [
    { x: 5,  size: 0.55, color: "#e9a8ba", tipo: "margarita" },
    { x: 12, size: 0.75, color: "#d7b7df", tipo: "margarita" },
    { x: 19, size: 0.62, color: "#f5d7a1", tipo: "rosa" },
    { x: 25, size: 0.88, color: "#f1b2c3", tipo: "tulipan" },
    { x: 32, size: 0.65, color: "#b8a7d9", tipo: "lavanda" },
    { x: 38, size: 0.80, color: "#f6c8d4", tipo: "margarita" },
    { x: 44, size: 0.62, color: "#f3c5a1", tipo: "rosa" },
    { x: 50, size: 1.12, color: "#e9a8ba", tipo: "tulipan" },
    { x: 56, size: 0.68, color: "#b8a7d9", tipo: "margarita" },
    { x: 62, size: 0.88, color: "#f4b6c7", tipo: "rosa" },
    { x: 68, size: 0.60, color: "#f5d7a1", tipo: "lavanda" },
    { x: 74, size: 0.95, color: "#e9a8ba", tipo: "tulipan" },
    { x: 81, size: 0.72, color: "#d7b7df", tipo: "margarita" },
    { x: 88, size: 0.78, color: "#f3c5a1", tipo: "rosa" },
    { x: 95, size: 0.56, color: "#f1b2c3", tipo: "margarita" }
];


let temporizadores = [];
let particulasActivas = false;

// Dibuja una flor mediante SVG.

function crearFlor(config, indice) {
    const flor = document.createElement("div");
    flor.className = "flower";

    flor.style.left = `${config.x}%`;
    flor.style.width = `${35 * config.size}%`;
    flor.style.height = `${86 * config.size}%`;
    flor.style.marginLeft = `${-17.5 * config.size}%`;
    flor.style.zIndex = String(Math.round(config.size * 10));
    flor.style.animationDelay = `${indice * -0.4}s`;

    const tipo = config.tipo || "margarita";
    const color = config.color || "#e9a8ba";

    let petalos = "";

    if (tipo === "tulipan") {
        // Pétalos alargados que forman una copa.
        petalos = `
            <path class="petal tulip-back"
                d="M50 91 C22 79 24 49 30 37
                   C43 42 49 57 50 70
                   C51 52 61 38 73 36
                   C83 55 77 81 50 91 Z"
                style="--petal:${color}; --delay:1.3s"/>

            <path class="petal"
                d="M50 89 C34 76 36 53 43 43
                   C49 53 50 63 50 72
                   C54 56 63 48 67 45
                   C75 67 66 82 50 89 Z"
                style="--petal:${color}; --delay:1.6s"/>

            <path class="petal"
                d="M31 43 Q47 56 50 85 Q25 77 31 43Z"
                style="--petal:${color}; --delay:1.8s"/>

            <path class="petal"
                d="M69 42 Q56 59 50 85 Q76 77 69 42Z"
                style="--petal:${color}; --delay:1.9s"/>
        `;
    } else {
        // Pétalos ovalados, con centro floral más detallado.
        const cantidad = tipo === "lavanda" ? 5 : 12;

        if (tipo === "lavanda") {
            for (let i = 0; i < cantidad; i++) {
                petalos += `
                    <ellipse class="petal"
                        cx="${50 + Math.sin(i * 1.4) * 9}"
                        cy="${84 - i * 8}"
                        rx="7" ry="11"
                        transform="rotate(${i % 2 ? 30 : -30}
                        ${50 + Math.sin(i * 1.4) * 9}
                        ${84 - i * 8})"
                        style="--petal:${color};
                               --delay:${1.1 + i * 0.13}s"/>
                `;
            }
        } else {
            for (let i = 0; i < cantidad; i++) {
                const angulo = i * (360 / cantidad);

                petalos += `
                    <ellipse class="petal"
                        cx="50" cy="68"
                        rx="${tipo === "rosa" ? 8 : 6.5}"
                        ry="${tipo === "rosa" ? 20 : 18}"
                        transform="rotate(${angulo} 50 87)"
                        style="--petal:${color};
                               --delay:${1.1 + i * 0.055}s"/>
                `;
            }

            // Segunda capa de pétalos para dar volumen.
            if (tipo !== "rosa") {
                for (let i = 0; i < 8; i++) {
                    const angulo = i * 45 + 22.5;

                    petalos += `
                        <ellipse class="petal inner-petal"
                            cx="50" cy="74"
                            rx="5.5" ry="12"
                            transform="rotate(${angulo} 50 87)"
                            style="--petal:${color};
                                   --delay:${1.8 + i * 0.06}s"/>
                    `;
                }
            }
        }
    }

    const centro = tipo === "lavanda"
        ? ""
        : `
            <circle class="flower-center" cx="50" cy="87" r="9"/>
            <circle class="center-detail" cx="50" cy="87" r="5"/>
            ${Array.from({ length: 8 }, (_, i) => {
                const a = i * Math.PI / 4;
                return `<circle class="pollen"
                    cx="${50 + Math.cos(a) * 6}"
                    cy="${87 + Math.sin(a) * 6}"
                    r="1.2"/>`;
            }).join("")}
        `;

    flor.innerHTML = `
        <svg viewBox="0 0 100 260"
             xmlns="http://www.w3.org/2000/svg"
             aria-hidden="true">

            <defs>
                <linearGradient id="stem-${indice}"
                    x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="#71876b"/>
                    <stop offset="50%" stop-color="#a8b99a"/>
                    <stop offset="100%" stop-color="#617b5b"/>
                </linearGradient>
                <linearGradient id="petal-${indice}"
                    x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#fff0f3"
                          stop-opacity=".8"/>
                    <stop offset="45%" stop-color="${color}"/>
                    <stop offset="100%" stop-color="${color}"
                          stop-opacity=".8"/>
                </linearGradient>
            </defs>

            <path class="stem"
                d="M50 250 C46 205 55 145 50 88"
                style="stroke:url(#stem-${indice})"/>

            <path class="leaf"
                d="M48 201 C19 195 13 169 17 159
                   C39 162 54 180 48 201Z"
                style="fill:#91ad83;stroke:#71876b"/>

            <path class="leaf"
                d="M51 171 C74 163 83 141 80 132
                   C59 138 47 152 51 171Z"
                style="fill:#a8bd91;stroke:#71876b"/>

            <path class="leaf-vein"
                d="M48 197 L25 168 M51 167 L75 140"/>

            ${petalos}

            ${centro}
        </svg>
    `;

    return flor;
}


// Crea estrellas en el cielo.
function crearEstrellas() {
    starsContainer.innerHTML = "";

    for (let i = 0; i < 24; i++) {
        const estrella = document.createElement("span");
        estrella.className = "star";
        estrella.textContent = i % 4 === 0 ? "✧" : "·";

        estrella.style.left = `${Math.random() * 94 + 3}%`;
        estrella.style.top = `${Math.random() * 68 + 4}%`;
        estrella.style.fontSize = `${8 + Math.random() * 12}px`;
        estrella.style.animationDelay = `${Math.random() * 3}s`;

        starsContainer.appendChild(estrella);
    }
}

// Crea pequeñas luces que flotan por el jardín.
function crearParticulas() {
    garden.querySelectorAll(".particle").forEach(p => p.remove());

    for (let i = 0; i < 18; i++) {
        const particula = document.createElement("span");
        particula.className = "particle";

        particula.style.left = `${Math.random() * 94 + 3}%`;
        particula.style.top = `${25 + Math.random() * 65}%`;
        particula.style.setProperty(
            "--duration",
            `${3 + Math.random() * 4}s`
        );
        particula.style.setProperty(
            "--delay",
            `${Math.random() * -6}s`
        );

        garden.appendChild(particula);
    }

    particulasActivas = true;
}


function crearAbejitas() {
    garden.querySelectorAll(".bee").forEach(bee => bee.remove());

    for (let i = 0; i < 3; i++) {
        const bee = document.createElement("span");
        bee.className = "bee";
        bee.textContent = "🐝";

        bee.style.top = `${25 + i * 15}%`;
        bee.style.setProperty("--bee-delay", `${i * -3}s`);
        bee.style.setProperty("--bee-duration", `${9 + i * 3}s`);

        garden.appendChild(bee);
    }
}


// Detiene las acciones pendientes de una animación anterior.
function limpiarTemporizadores() {
    temporizadores.forEach(id => clearTimeout(id));
    temporizadores = [];
}

// Inicia el crecimiento del jardín.
function iniciarJardin() {
    limpiarTemporizadores();

    welcome.hidden = true;
    letterScene.hidden = true;
    gardenScene.hidden = false;

    flowersContainer.innerHTML = "";
    letterButton.hidden = true;
    replayButton.hidden = true;

    gardenCaption.textContent =
        "Las cosas bonitas también crecen despacito...";

    crearEstrellas();
    crearParticulas();
    crearAbejitas();

    configuracionFlores.forEach((config, indice) => {
        const flor = crearFlor(config, indice);

        flowersContainer.appendChild(flor);

        const temporizador = setTimeout(() => {
            flor.classList.add("grow");
        }, indice * 350);

        temporizadores.push(temporizador);
    });

    // Cuando las flores hayan crecido, aparece la invitación.
    const finalizacion = setTimeout(() => {
        gardenCaption.textContent =
            "¿CREIAS QUE ESO ERA TODO?";

        letterButton.hidden = false;
        replayButton.hidden = false;
    }, 6200);

    temporizadores.push(finalizacion);
}

// Abre la carta y escribe el mensaje progresivamente.
function abrirCarta() {
    limpiarTemporizadores();

    gardenScene.hidden = true;
    letterScene.hidden = false;

    letterText.textContent = "";

    let indice = 0;

    function escribirSiguiente() {
        if (indice >= mensaje.length) return;

        letterText.textContent += mensaje[indice];
        indice++;

        const id = setTimeout(escribirSiguiente, 32);
        temporizadores.push(id);
    }

    escribirSiguiente();
}

// Eventos de los botones.
startButton.addEventListener("click", iniciarJardin);
replayButton.addEventListener("click", iniciarJardin);
letterButton.addEventListener("click", abrirCarta);

backButton.addEventListener("click", () => {
    limpiarTemporizadores();
    letterScene.hidden = true;
    iniciarJardin();
});
