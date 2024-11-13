function getRandomMilliseconds() {
  // Genera un número aleatorio entre 0 y 3 (inclusive)
  const randomInt = Math.floor(Math.random() * 4);
  // Convierte este número en un valor entre 5000 y 8000 milisegundos
  return (randomInt + 5) * 1000;
}

module.exports = getRandomMilliseconds