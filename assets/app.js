if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("sw.js")
    .then((registration) => {
      console.log("SW Registered!");
      console.log(registration);
    })
    .catch((error) => {
      console.log("SW registration Faild!");
      console.log(error);
    });
}

class Player {
  constructor({ nombre, victorias, derrotas, puntos }) {
    this.nombre = nombre;
    this.victorias = victorias;
    this.movimientos = 0;
    this.derrotas = derrotas;
    this.puntos = puntos;
    this.isAlive = true;
  }
  mostrar() {
    return `
    <div class="jugador" data-price="${this.nombre}">
      <p>${this.nombre}</p>
      <p>${this.victorias}</p>
      <p>${this.derrotas}</p>
    </div>`;
  }
  showName() {
    return `<i class="name">${this.nombre}</i>`;
  }
}
class Partida {
  constructor() {
    this.players = [];
    this.start = false;
    this.turno = 0;
    this.acumulador = 0;
    this.mates = [];
  }
  Partida() {}
  mostrarPuntos() {
    $puntos.forEach((e, p) => {
      this.players.forEach((elemento, index) => {
        if (p == index) {
          e.textContent = elemento.nombre;
          if (elemento.isAlive) {
            elegirColores(index, e);
            if (elemento.puntos > 0) {
              e.textContent = `${elemento.puntos} pts`;
            }
          } else {
            if (elemento.puntos > 0) {
              e.textContent = `${elemento.puntos} pts`;
            }
            e.style.backgroundColor = colores.default;
          }
        }
      });
    });
  }
  aumentarPuntos($elemento) {
    let puntos = parseInt($elemento.dataset.price);
    this.players[this.turno].puntos += puntos;
  }
  deadKing() {
    $overlay.classList.add("is-active");
    const $container = $overlay.children[1];
    this.players.forEach(($player, posicion) => {
      if (posicion != this.turno) {
        if ($player.isAlive) {
          $container.innerHTML += $player.showName();
        }
      }
    });
    jaqueMate();
  }
}

class registroPartida {
  constructor(jugador, puntos, kill = null) {
    (this.jugador = jugador), (this.puntos = puntos), (this.kill = kill);
  }
  retroceder() {
    partida.players[this.jugador].puntos -= this.puntos;
    partida.turno = this.jugador;
    if (this.kill != null) {
      partida.players[this.kill].isAlive = true;
    }
    partida.mostrarPuntos();
    $piezas.forEach(($pieza) => {
      elegirColores(this.jugador, $pieza);
    });
  }
  avanzar() {
    partida.players[this.jugador].puntos += this.puntos;
    partida.turno = this.jugador + 1;
    if (this.kill != null) {
      partida.players[this.kill].isAlive = false;
    }
    partida.mostrarPuntos();
    $piezas.forEach(($pieza) => {
      elegirColores(this.jugador + 1, $pieza);
    });
  }
}
const colores = {
  rojo: "#bf3b43",
  azul: "#4185bf",
  amarillo: "#c09526",
  verde: "#4e9161",
  default: "#272522",
};
const $botones = document.querySelector(".hero");
const $menu = document.querySelector(".menu");
const $jugadores = document.querySelector(".jugadores");
const $partida = document.querySelector(".partida");
const $puntos = document.querySelectorAll(".puntos");
const $piezas = document.querySelectorAll("#pieza");
const $overlay = document.querySelector(".overlay");
let $jaqueMate;
let $king = document.querySelector(".fa-chess-king");

const $back = document.getElementById("back");
const $back2 = document.querySelector(".back-king");
const $moveContainer = document.querySelector(".move");
const $move = document.querySelectorAll(".arrow");
const $plus = document.querySelector(".fa-plus-circle");

const $botonPartida = document.getElementById("partida");
const $botonJugadores = document.getElementById("jugadores");
const $botonCrear = document.getElementById("crear");

const $start = document.querySelectorAll(".start");
const $startContainer = document.querySelector(".start-buttons");

const $lista = document.querySelector(".list");

let partida;
let registro = [];
let i;
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
  $menu.classList.remove("none");
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
        $startContainer.classList.add("is-active");
      }
      if (partida.players.length < 4) {
        if ($startContainer.classList.contains("is-active")) {
          $startContainer.classList.remove("is-active");
        }
      }
    });
  });
});

$back.addEventListener("click", getBack);
$back2.addEventListener("click", hideName);
$start.forEach(($button) => {
  $button.addEventListener("click", startMatch);
});
$piezas.forEach(($pieza) => {
  $pieza.addEventListener("click", activar);
});

$move.forEach(($boton) => {
  if ($boton.classList.contains("fa-backward")) {
    $boton.addEventListener("click", () => {
      regresar();
      if (!$boton.classList.contains("select")) {
        $piezas.forEach(($pieza) => {
          $pieza.removeEventListener("click", activar);
        });
        $move[1].addEventListener("click", handlePlay);
        $boton.classList.add("select");
      }
      if ($plus.classList.contains("select")) $plus.classList.remove("select");
      if ($king.classList.contains("is-active")) {
        $king.classList.remove("is-active");
      }
      partida.acumulador = 0;
    });
  }
  if ($boton.classList.contains("fa-play")) {
    $boton.addEventListener("click", () => {
      if ($plus.classList.contains("select")) {
        if (partida.acumulador) {
          $piezas.forEach(($pieza) => {
            $pieza.removeEventListener("click", sumar);
            $pieza.addEventListener("click", activar);
          });
          if ($king.classList.contains("is-active")) {
            let last = partida.mates.length - 1;
            crearRegistro(
              partida.turno,
              partida.acumulador,
              partida.mates[last]
            );
            i = registro.length;
            $king.classList.remove("is-active");
          } else {
            crearRegistro(partida.turno, partida.acumulador);
            i = registro.length;
          }
          partida.players[partida.turno].puntos += partida.acumulador;
          partida.acumulador = 0;
          $piezas.forEach(($pieza) => {
            if ($pieza.classList.contains("select")) {
              $pieza.classList.remove("select");
            }
          });
          $plus.classList.remove("select");
          partida.mostrarPuntos();
          cambiarTurno();
        }
      }
    });
  }
  if ($boton.classList.contains("fa-forward")) {
    $boton.addEventListener("click", avanzar);
  }
});

$plus.addEventListener("click", () => {
  $piezas.forEach(($pieza) => {
    $pieza.removeEventListener("click", activar);
    $pieza.addEventListener("click", sumar);
  });
  $plus.classList.add("select");
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
  $menu.classList.add("none");
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
  $startContainer.classList.remove("is-active");
  partida.players = [];
  if (partida.start == true) {
    $moveContainer.classList.add("none");
    $plus.classList.add("none");
    $partida.classList.add("none");
    $partida.turno = 0;
    registro = [];
    partida.start = false;
    reiniciarPuntos();
  }
}
function startMatch(event) {
  $moveContainer.classList.remove("none");
  $plus.classList.remove("none");
  removerAdder($partida, $jugadores);
  partida.start = true;
  if (event.target.textContent == "aleatorio") {
    ramdomArray(partida.players);
  }
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
  let nextPlayer = partida.players[partida.turno];
  if (partida.turno >= 4) {
    partida.turno = 0;
    nextPlayer = partida.players[partida.turno];
  }
  $piezas.forEach(($pieza) => {
    elegirColores(partida.turno, $pieza);
  });
  if (!nextPlayer.isAlive) {
    cambiarTurno();
  }
}
function reiniciarPuntos() {
  jugadores.forEach((player) => {
    player.puntos = 0;
    player.isAlive = true;
  });
}

function jaqueMate() {
  $jaqueMate = document.querySelectorAll(".name");
  $jaqueMate.forEach(($jaqueMate, posicion) => {
    let nombre = $jaqueMate.textContent;
    $jaqueMate.addEventListener("click", () => {
      partida.players.forEach((e, p) => {
        if (nombre == e.nombre) {
          e.isAlive = false;
          partida.mates.push(p);
          $overlay.classList.remove("is-active");
          hideName();
          if (!$plus.classList.contains("select")) {
            crearRegistro(partida.turno, parseInt($king.dataset.price), p);
            i = registro.length;
            nextOne($king);
          } else {
            partida.acumulador += parseInt($king.dataset.price);
            $king.classList.add("is-active");
            $king.classList.add("select");
            $king.style.backgroundColor = colores.default;
          }
        }
      });
    });
  });
}

function crearRegistro(posicion, puntos, dead = null) {
  registro.push(new registroPartida(posicion, puntos, dead));
}

function hideName() {
  $overlay.classList.remove("is-active");
  let container = $overlay.children[1];
  container.innerHTML = "";
}
function nextOne(element) {
  partida.aumentarPuntos(element);
  partida.mostrarPuntos();
  cambiarTurno();
}

function activar(event) {
  if (event.target.classList.contains("fa-chess-king")) {
    partida.deadKing();
  } else {
    crearRegistro(partida.turno, parseInt(event.target.dataset.price));
    i = registro.length;
    nextOne(event.target);
  }
}

function regresar() {
  if (i <= registro.length) {
    if (!(i <= 0)) {
      registro[i - 1].retroceder();
      i = i - 1;
    }
  }
}
function avanzar() {
  if (i < registro.length) {
    i = i + 1;
    registro[i - 1].avanzar();
  }
}

function handlePlay() {
  $move[0].classList.remove("select");
  play();
  $piezas.forEach(($pieza) => {
    $pieza.addEventListener("click", activar);
  });
  $move[1].removeEventListener("click", handlePlay);
}
function play() {
  if (!(i == registro.length)) {
    let newArray = registro.slice(0, i);
    registro = newArray;
    i = registro.length;
  }
}

function sumar(event) {
  if (event.target.classList.contains("fa-chess-king")) {
    if ($king.classList.contains("select")) {
      partida.acumulador -= parseInt($king.dataset.price);
      $king.classList.remove("select");
      elegirColores(partida.turno, $king);
      let lastLoser = partida.mates.length - 1;
      partida.players[partida.mates[lastLoser]].isAlive = true;
      partida.mates.pop();
    } else {
      partida.deadKing();
    }
  } else {
    if (!event.target.classList.contains("select")) {
      let puntos = parseInt(event.target.dataset.price);
      partida.acumulador += puntos;
      event.target.style.backgroundColor = colores.default;
      event.target.classList.add("select");
    } else {
      let puntos = parseInt(event.target.dataset.price);
      partida.acumulador -= puntos;
      elegirColores(partida.turno, event.target);
      event.target.classList.remove("select");
    }
  }
}
