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
  }
  iniciarPartida() {}
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
const $botones = document.querySelector(".hero");
const $jugadores = document.querySelector(".jugadores");
const $partida = document.querySelector(".partida");

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
        player.classList.add("select");
        agregarJugador(player);
        console.log(partida.players);
      }
      debugger;
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

fetch("assets/server.json")
  .then((datos) => datos.json())
  .then((datos) => {
    datos.jugadores.forEach((jugador) => {
      console.log(jugador);
      jugadores.push(new Player(jugador));
    });
  });

function mostrarHTML(valor, jugador) {
  valor.innerHTML += jugador.mostrar();
}

function agregarJugador(element) {
  let nombre = element.dataset.price;
  console.log(nombre);
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
  `;
  $start.classList.remove("is-active");
  partida.players = [];
  if (partida.start == true) {
    $partida.classList.add("none");
    partida.start = false;
  }
}
function startMatch() {
  if (partida.players.length == 4) {
    removerAdder($partida, $jugadores);
    partida.start = true;
  } else {
    alert("Solo se aceptan 4 Jugadores por partida");
  }
}
