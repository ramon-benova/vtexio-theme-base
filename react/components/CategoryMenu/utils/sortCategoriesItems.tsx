import { values, pluck } from 'ramda'

const sortCategoriesItems = {
  SORT_DEFAULT: {
    name: 'Padrão',
    value: '',
  },
  SORT_NAME: {
    name: 'Nome',
    value: 'name',
  },
}

export function getSortCategoriesNames() {
  return pluck('name', values(sortCategoriesItems))
}

export function getSortCategoriesValues() {
  return pluck('value', values(sortCategoriesItems))
}

export default sortCategoriesItems
