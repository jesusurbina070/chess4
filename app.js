class Player {
  constructor({ nombre, victorias, derrotas, puntos }) {
    this.nombre = nombre;
    this.victorias = victorias;
    this.derrotas = derrotas;
    this.puntos = puntos;
  }
}
class Partida {
  constructor() {
    this.players = [];
    this.movidas = 0;
  }
  static crearPartida() {
    return new Partida();
  }
}

fetch("server.json")
  .then((datos) => datos.json())
  .then((datos) => {
    datos.jugadores.forEach((jugador) => {
      console.log(jugador);
      jugadores.push(new Player(jugador));
    });
  });
