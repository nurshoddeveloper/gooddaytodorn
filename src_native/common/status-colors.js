
export function getColorById(colorId) {
  return colors[colorId] || colors[1];
}

const colors = {
  1: '#71c8e4',
  2: '#42bce4',
  3: '#4b9fed',
  4: '#4f7ee8',
  5: '#53c23d',
  6: '#6cd957',

  7: '#f3526a',
  8: '#f45aa6',
  9: '#fbb02d',

  10: '#a654dc',
  11: '#78909c',
  12: '#b0bec5',
};