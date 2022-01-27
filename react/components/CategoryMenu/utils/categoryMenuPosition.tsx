import { values, pluck } from 'ramda'

const categoryMenuPosition = {
  DISPLAY_CENTER: {
    name: 'Centro',
    value: 'center',
  },
  DISPLAY_LEFT: {
    name: 'Esquerda',
    value: 'left',
  },
  DISPLAY_RIGHT: {
    name: 'Direita',
    value: 'right',
  },
}

export function getMenuPositionNames() {
  return pluck('name', values(categoryMenuPosition))
}

export function getMenuPositionValues() {
  return pluck('value', values(categoryMenuPosition))
}

export default categoryMenuPosition
