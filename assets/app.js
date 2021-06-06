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
  }
}
const $botones = document.querySelector(".hero");
const $jugadores = document.querySelector(".jugadores");

const $botonPartida = document.getElementById("partida");
const $botonJugadores = document.getElementById("jugadores");
const $botonCrear = document.getElementById("crear");

const $lista = document.querySelector(".list");

let partida;
const jugadores = [];

$botonJugadores.addEventListener("click", () => {
  jugadores.forEach((jugador) => {
    mostrarHTML($lista, jugador);
    removerAdder($jugadores, $botones);
  });
});

$botonPartida.addEventListener("click", () => {
  removerAdder($jugadores, $botones);
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
        console.log(partida.players);
      } else {
        player.classList.add("select");
        agregarJugador(player);
        console.log(partida.players);
      }
    });
  });
});

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
