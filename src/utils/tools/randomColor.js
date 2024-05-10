function getRandomColor() {
  const availableColors = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const randomIndex = Math.floor(Math.random() * availableColors.length);
  return availableColors[randomIndex];
}

module.exports = getRandomColor