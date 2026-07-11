// ---- Configuracion general ----
const canvas = document.getElementById("track");
const ctx = canvas.getContext("2d");
const META_X = 700; // linea de meta (equivalente a los 300px de avance en la version Java)
const START_X = 30;

// ---- Modelo de tortugas (equivalente a las tortugas en Java/Python) ----
function crearTortugas() {
    return [
        { name: "Benito",   body: "#2e7d32", shell: "#fdd835", y: 40,  x: START_X, distancia: 0 },
        { name: "Carlitos", body: "#c62828", shell: "#212121", y: 90,  x: START_X, distancia: 0 },
        { name: "Pablito",  body: "#1565c0", shell: "#8e24aa", y: 140, x: START_X, distancia: 0 },
        { name: "Juanito",  body: "#f9a825", shell: "#ef6c00", y: 190, x: START_X, distancia: 0 },
        { name: "Pedrito",  body: "#ef6c00", shell: "#c62828", y: 240, x: START_X, distancia: 0 },
        { name: "Tito",     body: "#ec407a", shell: "#d500f9", y: 290, x: START_X, distancia: 0 },
    ];
}

let turtles = crearTortugas();
let raceInterval = null;

// ---- Dibujar la pista (lineas y numeros de carril) ----
function drawTrack() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#333";
    ctx.fillStyle = "#333";
    ctx.font = "12px Arial";
    ctx.lineWidth = 1;

    for (let i = 0; i < turtles.length; i++) {
        const y = 15 + i * 50;
        ctx.beginPath();
        ctx.moveTo(START_X - 10, y + 25);
        ctx.lineTo(canvas.width - 20, y + 25);
        ctx.stroke();
        ctx.fillText(String(i), 5, y + 4);
    }

    // Linea de meta
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(META_X + START_X, 10);
    ctx.lineTo(META_X + START_X, canvas.height - 10);
    ctx.stroke();
}

// ---- Dibujar una tortuga con forma real (cabeza, caparazon, patas y cola) ----
function drawTurtleShape(t) {
    const sx = t.x;
    const sy = t.y;

    // Patas
    ctx.fillStyle = shadeColor(t.body, -20);
    ctx.beginPath(); ctx.ellipse(sx - 8, sy - 12, 4, 3.5, 0, 0, Math.PI * 2); ctx.fill(); // trasera arriba
    ctx.beginPath(); ctx.ellipse(sx - 8, sy + 12, 4, 3.5, 0, 0, Math.PI * 2); ctx.fill(); // trasera abajo
    ctx.beginPath(); ctx.ellipse(sx + 8, sy - 12, 4, 3.5, 0, 0, Math.PI * 2); ctx.fill(); // delantera arriba
    ctx.beginPath(); ctx.ellipse(sx + 8, sy + 12, 4, 3.5, 0, 0, Math.PI * 2); ctx.fill(); // delantera abajo

    // Cola
    ctx.fillStyle = t.body;
    ctx.beginPath();
    ctx.moveTo(sx - 14, sy - 3);
    ctx.lineTo(sx - 22, sy);
    ctx.lineTo(sx - 14, sy + 3);
    ctx.closePath();
    ctx.fill();

    // Cabeza
    ctx.fillStyle = t.body;
    ctx.beginPath();
    ctx.ellipse(sx + 17, sy, 5, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ojo
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.ellipse(sx + 19, sy - 1, 1, 1, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cuerpo
    ctx.fillStyle = t.body;
    ctx.beginPath();
    ctx.ellipse(sx, sy, 12, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // Caparazon con patron simple
    ctx.fillStyle = t.shell;
    ctx.beginPath();
    ctx.ellipse(sx, sy, 9, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = shadeColor(t.body, -20);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(sx - 9, sy); ctx.lineTo(sx + 9, sy);
    ctx.moveTo(sx, sy - 7); ctx.lineTo(sx, sy + 7);
    ctx.stroke();

    // Nombre
    ctx.fillStyle = "black";
    ctx.font = "11px Arial";
    ctx.fillText(t.name, sx - 12, sy - 15);
}

// Oscurece/aclara un color hex (usado para las patas y lineas del caparazon)
function shadeColor(hex, percent) {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + percent));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + percent));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + percent));
    return `rgb(${r},${g},${b})`;
}

function drawFrame() {
    drawTrack();
    for (const t of turtles) {
        drawTurtleShape(t);
    }
}

// ---- Logica de la carrera ----
function startRace() {
    const name1 = document.getElementById("name1").value || "Jugador 1";
    const turtle1 = document.getElementById("turtle1").value;
    const bet1 = parseInt(document.getElementById("bet1").value, 10) || 0;

    const name2 = document.getElementById("name2").value || "Jugador 2";
    const turtle2 = document.getElementById("turtle2").value;
    const bet2 = parseInt(document.getElementById("bet2").value, 10) || 0;

    document.getElementById("results").textContent = "";
    document.getElementById("startBtn").disabled = true;

    turtles = crearTortugas();
    drawFrame();

    raceInterval = setInterval(() => {
        let ganador = "";

        for (const t of turtles) {
            let paso = Math.floor(Math.random() * 5) + 1; // 1 a 5, igual para todas

            t.x += paso;
            t.distancia += paso;
        }

        drawFrame();

        for (const t of turtles) {
            if (t.distancia >= META_X - START_X) {
                ganador = t.name;
                break;
            }
        }

        if (ganador) {
            clearInterval(raceInterval);
            mostrarResultados(ganador, name1, turtle1, bet1, name2, turtle2, bet2);
            document.getElementById("startBtn").disabled = false;
        }
    }, 80);
}

function mostrarResultados(ganador, name1, turtle1, bet1, name2, turtle2, bet2) {
    let texto = `${ganador} GANÓ LA CARRERA!\n\n`;
    texto += (turtle1 === ganador)
        ? `${name1} ganó! +$${bet1}`
        : `${name1} perdió! -$${bet1}`;
    texto += "   |   ";
    texto += (turtle2 === ganador)
        ? `${name2} ganó! +$${bet2}`
        : `${name2} perdió! -$${bet2}`;

    document.getElementById("results").innerText = texto;
}

document.getElementById("startBtn").addEventListener("click", startRace);

// Dibujar la pista vacia al cargar la pagina
drawFrame();
