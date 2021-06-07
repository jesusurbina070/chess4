class Player {
  constructor({ nombre, victorias, derrotas, puntos }) {
    this.nombre = nombre;
    this.victorias = victorias;
    this.derrotas = derrotas;
    this.puntos = puntos;
  }
  mostrar() {
    return `
    <div class="jugador" data-price="${this.nombre}">
      <p>${this.nombre}</p>
      <p>${this.victorias}</p>
      <p>${this.derrotas}</p>
    </div>`;
  }
}
class Partida {
  constructor() {
    this.players = [];
    this.movidas = 0;
    this.start = false;
    this.turno = 0;
  }
  Partida() {}
  mostrarPuntos() {
    $puntos.forEach((e, p) => {
      this.players.forEach((elemento, index) => {
        if (p == index) {
          e.textContent = elemento.nombre;
          elegirColores(index, e);
          if (elemento.puntos > 0) {
            e.textContent = `${elemento.puntos} pts`;
          }
        }
      });
    });
  }
  aumentarPuntos($elemento) {
    let puntos = parseInt($elemento.dataset.price);
    this.players[this.turno].puntos += puntos;
  }
}

const reglas = {
  paso: 0,
  peon: 1,
  caballo: 3,
  arfil: 5,
  torre: 5,
  dama: 9,
  rey: 20,
  jaqueDoble: 5,
  jaqueTriple: 20,
};
const colores = {
  rojo: "#bf3b43",
  azul: "#4185bf",
  amarillo: "#c09526",
  verde: "#4e9161",
};
const $botones = document.querySelector(".hero");
const $jugadores = document.querySelector(".jugadores");
const $partida = document.querySelector(".partida");
const $puntos = document.querySelectorAll(".puntos");
const $piezas = document.querySelectorAll("#pieza");

const $botonPartida = document.getElementById("partida");
const $botonJugadores = document.getElementById("jugadores");
const $botonCrear = document.getElementById("crear");
const $back = document.getElementById("back");
const $start = document.querySelector(".start");

const $lista = document.querySelector(".list");

let partida;
const jugadores = [];

$botonJugadores.addEventListener("click", () => {
  $back.classList.remove("none");
  removerAdder($jugadores, $botones);
  jugadores.forEach((jugador) => {
    mostrarHTML($lista, jugador);
  });
});

$botonPartida.addEventListener("click", () => {
  removerAdder($jugadores, $botones);
  $back.classList.remove("none");
  partida = new Partida();
  jugadores.forEach((jugador) => {
    mostrarHTML($lista, jugador);
  });
  const players = document.querySelectorAll(".jugador");
  players.forEach((player) => {
    player.addEventListener("click", () => {
      if (player.classList.contains("select")) {
        player.classList.remove("select");
        if (partida.players.length == 1) {
          partida.players.pop();
        } else {
          let newPlayers = partida.players.filter(
            (p) => p.nombre != player.dataset.price
          );
          partida.players = newPlayers;
        }
      } else {
        if (partida.players.length < 4) {
          player.classList.add("select");
          agregarJugador(player);
        }
      }
      if (partida.players.length == 4) {
        $start.classList.add("is-active");
      }
      if (partida.players.length < 4) {
        if ($start.classList.contains("is-active")) {
          $start.classList.remove("is-active");
        }
      }
    });
  });
});

$back.addEventListener("click", getBack);
$start.addEventListener("click", startMatch);
$piezas.forEach(($pieza) => {
  $pieza.addEventListener("click", () => {
    partida.aumentarPuntos($pieza);
    partida.mostrarPuntos();
    cambiarTurno();
  });
});

fetch("assets/server.json")
  .then((datos) => datos.json())
  .then((datos) => {
    datos.jugadores.forEach((jugador) => {
      jugadores.push(new Player(jugador));
    });
  });

function mostrarHTML(valor, jugador) {
  valor.innerHTML += jugador.mostrar();
}

function agregarJugador(element) {
  let nombre = element.dataset.price;
  jugadores.forEach((p) => {
    if (nombre == p.nombre) {
      partida.players.push(p);
    }
  });
}
function removerAdder(addElement, removeElement) {
  addElement.classList.remove("none");
  removeElement.classList.add("none");
}

function getBack() {
  removerAdder($botones, $jugadores);
  $back.classList.add("none");
  $lista.innerHTML = `
  <div class="titulo-player">
    <h3>Selecciona</h3>
  </div>
          <div class="titulos">
          <p>Jugadores</p>
          <p>Victorias</p>
          <p>Derrotas</p>
  </div>
  `;
  $start.classList.remove("is-active");
  partida.players = [];
  if (partida.start == true) {
    $partida.classList.add("none");
    $partida.turno = 0;
    partida.start = false;
    reiniciarPuntos();
  }
}
function startMatch() {
  debugger;
  removerAdder($partida, $jugadores);
  partida.start = true;
  ramdomArray(partida.players);
  partida.mostrarPuntos();
  $piezas.forEach(($pieza) => {
    elegirColores(partida.turno, $pieza);
  });
}

function ramdomArray(arreglo) {
  arreglo.sort(() => Math.random() - 0.5);
}

function elegirColores(posicion, elemento) {
  let color;
  if (posicion == 0) {
    color = colores.rojo;
  }
  if (posicion == 1) {
    color = colores.azul;
  }
  if (posicion == 2) {
    color = colores.amarillo;
  }
  if (posicion == 3) {
    color = colores.verde;
  }
  elemento.style.backgroundColor = color;
}

function cambiarTurno() {
  partida.turno++;
  if (partida.turno == 4) {
    partida.turno = 0;
  }
  $piezas.forEach(($pieza) => {
    elegirColores(partida.turno, $pieza);
  });
}
function reiniciarPuntos() {
  jugadores.forEach((player) => (player.puntos = 0));
}
