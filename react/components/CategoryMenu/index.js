import PropTypes from 'prop-types'
import React, { Fragment, useState } from 'react'
import { graphql } from 'react-apollo'
import { injectIntl, intlShape } from 'react-intl'
import { IconMenu } from 'vtex.store-icons'
import { useRuntime } from 'vtex.render-runtime'
import { compose, path } from 'ramda'
import classNames from 'classnames'
import { Container } from 'vtex.store-components'

import CategoryItem from './components/CategoryItem'
import SideBar from './components/SideBar'
import { categoryPropType } from './propTypes'
import getCategories from './queries/categoriesQuery.gql'

import styles from './categoryMenu.css'
import categoryMenuPosition, {getMenuPositionNames, getMenuPositionValues} from './utils/categoryMenuPosition'
import sortCategoriesItems, {getSortCategoriesNames, getSortCategoriesValues} from './utils/sortCategoriesItems'

const DEFAULT_SUBCATEGORIES_LEVELS = 1

/**
 * Component that represents the menu containing the categories of the store
 */
const CategoryMenu = ({
  mobileMode = false,
  showAllDepartments = true,
  showCategories = true,
  showSubCategories = true,
  menuPosition = categoryMenuPosition.DISPLAY_CENTER.value,
  sortCategories = sortCategoriesItems.SORT_DEFAULT.value,
  departments = [],
  data: { categories = [] },
  intl,
}) => {
  const runtime = useRuntime()
  const [sideBarVisible, setSidebarVisible] = useState(false)
  const [isHover, setHover] = useState(false)

  const handleCloseMenu = () => {
    setHover(false)
  }

  const handleSidebarToggle = () => {
    setSidebarVisible(prevVisible => !prevVisible)
  }

  const allDepartments = departments
  const departmentsImage = departments
  const departmentsIds = departments.map(dept => dept.id)
  const departmentsSelected = categories.filter(category =>
    departmentsIds.includes(category.id)
  )


  const departmentsSelectedOrder = departmentsSelected.length && allDepartments.map((i) => { if(i.id !== undefined){ return departmentsSelected.find((j) => j.id === i.id) } }).filter(function(e){return e});
  const departmentsSelectedName = departmentsSelected.length && departmentsSelected.sort((a, b) => { return a.name > b.name ? 1 : -1 })
  const visibleDepartments = (departmentsSelected.length && ( (sortCategories === sortCategoriesItems.SORT_NAME.value) ? departmentsSelectedName : departmentsSelectedOrder) ) || categories

  if (mobileMode) {
    return (
      <div className={`${styles.sidebarContainer}`}>
        <SideBar
          visible={sideBarVisible}
          title={"Departamentos"}
          departments={visibleDepartments}
          categories={categories}
          onClose={handleSidebarToggle}
          showSubCategories={showSubCategories}
          showAllDepartments={showAllDepartments}
        />

        <div className={`${styles['sidebarIconMenu']} flex pa4 pointer`} onClick={handleSidebarToggle}>
          <IconMenu size={20} />
        </div>
      </div>
    )
  }

  const pathName = path(['route', 'params', 'department'], runtime)
  const department = pathName ? pathName : ''
  const desktopClasses = classNames(
    `${styles.container} w-100 dn flex-m`,
    {
      'justify-start': menuPosition === categoryMenuPosition.DISPLAY_LEFT.value,
      'justify-end': menuPosition === categoryMenuPosition.DISPLAY_RIGHT.value,
      'justify-center':
        menuPosition === categoryMenuPosition.DISPLAY_CENTER.value,
    }
  )

  return (
    <nav className={desktopClasses}>
      <Container
        className={`${styles['section--department']} justify-center flex`}
      >
        <ul
          className={`${styles.departmentList} pa0 list ma0 flex flex-wrap flex-row t-action overflow-hidden`}
        >
          {showAllDepartments && (
            <CategoryItem
              noRedirect
              menuPosition={menuPosition}
              isHover={isHover}
              setHover={setHover}
              subcategoryLevels={
                DEFAULT_SUBCATEGORIES_LEVELS + showSubCategories
              }
              sortCategories={sortCategories}
              handleCloseMenu={handleCloseMenu}
              category={{
                children: categories,
                name: "Departamentos",
              }}
            />
          )}

          {showCategories &&
            visibleDepartments.map(category => (
            <Fragment key={category.id}>
              <CategoryItem
                menuPosition={menuPosition}
                category={category}
                categoryId={category.id}
                isHover={isHover}
                setHover={setHover}
                images={departmentsImage}
                handleCloseMenu={handleCloseMenu}
                subcategoryLevels={
                  DEFAULT_SUBCATEGORIES_LEVELS + showSubCategories
                }
                isCategorySelected={department === category.slug}
              />
            </Fragment>
          ))}

        </ul>
      </Container>
      <div className={` ${styles.menuOverlay} ${isHover ? styles.menuOverlayVisible : ``}`} style={{'visibility': 'hidden'}}></div>
    </nav>
  )
}

CategoryMenu.propTypes = {
  /** Categories query data */
  data: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    categories: PropTypes.arrayOf(categoryPropType),
  }),
  /** Set mobile mode */
  mobileMode: PropTypes.bool,
  /** Whether to show the departments category or not */
  showAllDepartments: PropTypes.bool,
  /** Whether to show categories or not */
  showCategories: PropTypes.bool,
  /** Whether to show subcategories or not */
  showSubCategories: PropTypes.bool,
  /** Defines the position of the category menu */
  menuPosition: PropTypes.oneOf(getMenuPositionValues()),
  /** Intl */
  intl: intlShape,
  /** Departments to be shown in the desktop mode. */
  departments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      image: PropTypes.string
    })
  ),
  sortCategories: PropTypes.oneOf(getSortCategoriesValues())
}

CategoryMenu.schema = {
  title: 'Menu de categorias',
  description: 'Um menu mostrando uma lista de categorias disponíveis na loja',
  type: 'object',
  properties: {
    showAllDepartments: {
      type: 'boolean',
      title: "Mostrar a opção de 'Todos os Departamentos'",
      default: true,
    },
    menuPosition: {
      title: 'Posição do menu',
      type: 'string',
      enum: getMenuPositionValues(),
      enumNames: getMenuPositionNames(),
      default: categoryMenuPosition.DISPLAY_CENTER.value,
      isLayout: true,
    },
    showCategories: {
      type: 'boolean',
      title: 'Mostrar categorias',
      default: true,
    },
    showSubCategories: {
      type: 'boolean',
      title: 'Mostrar subcategorias',
      default: true,
    },
    sortCategories: {
      title: 'Ordenar categorias',
      type: 'string',
      enum: getSortCategoriesValues(),
      enumNames: getSortCategoriesNames(),
      default: sortCategoriesItems.SORT_DEFAULT.value,
    },
    departments: {
      title: "Departamentos",
      type: 'array',
      minItems: 0,
      items: {
        title: 'Departamento',
        type: 'object',
        properties: {
          id: {
            title: 'Id do Departamento',
            type: 'number'
          },
          image: {
            type: 'string',
            title: 'Imagem',
            default: '',
            widget: {
              'ui:widget': 'image-uploader'
            }
          }
        },
      },
    },
  },
}


export default compose(
  graphql(getCategories),
  injectIntl
)(CategoryMenu)
