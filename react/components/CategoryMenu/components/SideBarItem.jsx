import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { useRuntime } from 'vtex.render-runtime'
import { IconCaret } from 'vtex.store-icons'

import styles from '../categoryMenu.css'

const SideBarItem = ({
  treeLevel = 1,
  item: { children },
  showSubCategories,
  titleCurrent,
  onClose,
  linkValues,
  item,
}) => {
  const runtime = useRuntime()
  const [open, setOpen] = useState(false)

  const subCategoriesVisible =
    showSubCategories && children && children.length > 0

  const navigateToPage = () => {
    const [department, category, subcategory] = linkValues
    const params = { department }

    if (category) params.category = category
    if (subcategory) params.subcategory = subcategory

    const page = category
      ? subcategory
        ? 'store.search#subcategory'
        : 'store.search#category'
      : 'store.search#department'

    runtime.navigate({
      page,
      params,
      fallbackToWindowLocation: false,
    })
    onClose()
  }

  const handleItemClick = () => {
    if (subCategoriesVisible) {
      setOpen(prevOpen => !prevOpen)
    } else {
      navigateToPage()
    }
  }

  const handleBackMenu = () => {
    if (subCategoriesVisible) {
      setOpen(prevOpen => !prevOpen)
    } else {
      navigateToPage()
    }
  }

  const sideBarListContainerClasses = classNames({
    [`${styles['sidebar--departamentListContainer']}`]: treeLevel === 1,
    [`${styles['sidebar--categoryListContainer']}`]: treeLevel === 2,
    [`${styles['sidebar--grandChildrenListContainer']}`] : treeLevel > 2
  })

  const sideBarListClasses = classNames(
    `${styles.sidebarItem} pa0`, {
    [`${styles['sidebar--departamentList']}`]: treeLevel === 1,
    [`${styles['sidebar--categoryList']}`]: treeLevel === 2,
    [`${styles['sidebar--grandChildrenList']}`] : treeLevel > 2
  })

  const sideBarCurrentClasses = classNames(
    `${styles.sidebarItem} pa0`, {
    [`${styles['sidebar--departament']}`]: treeLevel === 1,
    [`${styles['sidebar--category']}`]: treeLevel === 2,
    [`${styles['sidebar--grandChildren']}`] : treeLevel > 2
  })

  const sideBarItemClasses = classNames(
    `${styles.sidebarItem} pa0`, {
    [`${styles['sidebar--departamentItem']} c-on-base`]: treeLevel === 1,
    [`${styles['sidebar--categoryItem']} c-muted-2 t-body`]: treeLevel === 2,
    [`${styles['sidebar--grandChildrenItem']} c-muted-2 t-body`] : treeLevel > 2
  })

  const sideBarLinkClasses = classNames(
    styles.sidebarItemContainer,
    'flex justify-between items-center pa5 ma0', {
      [`${styles['sidebar--departamentLink']}`]: treeLevel === 1,
      [`${styles['sidebar--categoryLink']}`]: treeLevel === 2,
      [`${styles['sidebar--grandChildrenLink']}`] : treeLevel > 2
    }
  )

  const sideBarTitleClasses = classNames({
      [`${styles['sidebar--departamentTitle']}`]: treeLevel === 1,
      [`${styles['sidebar--categoryTitle']}`]: treeLevel === 2,
      [`${styles['sidebar--grandChildrenTitle']}`] : treeLevel > 2
  })

  return (
    <ul className={`${sideBarItemClasses}`}>
      <li className={`${sideBarLinkClasses}`} onClick={handleItemClick}>
        <span className={`${sideBarTitleClasses}`}>{item.name}</span>

        {subCategoriesVisible && (
          <span className={`${styles['sidebarIcon']} ${open ? styles['sidebarOpen'] : ""}  `}></span>
        )}
      </li>
      {subCategoriesVisible && (
        <div className={`${styles['sidebar--collapse']} ${sideBarListContainerClasses} ${open ? styles['sidebar--collapseOpened'] : styles['sidebar--collapseHidden']}`}>
          <div className={`${styles['sidebar--back']}`} onClick={handleBackMenu}>Menu</div>
          <ul className={`${sideBarListClasses}`}>
            <li
              className={`${styles['sidebar--seeAll']} cursor list`}
              onClick={navigateToPage}
            >
              <span className={`${styles['sidebar--seeAllTitle']}`}>Ir para {titleCurrent}</span>

            </li>
            {children.map(child => (
              <li key={child.id} className={`${sideBarCurrentClasses} cursor list ma0 pa0`}>
                <SideBarItem
                  showSubCategories={showSubCategories}
                  item={child}
                  titleCurrent={child.name}
                  linkValues={[...linkValues, child.slug]}
                  onClose={onClose}
                  treeLevel={treeLevel + 1}
                  runtime={runtime}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </ul>
  )
}

SideBarItem.propTypes = {
  /** Sidebar's item. */
  item: PropTypes.object.isRequired,
  /** Link values to create the redirect. */
  linkValues: PropTypes.arrayOf(PropTypes.string).isRequired,
  /** Closes sidebar. */
  onClose: PropTypes.func.isRequired,
  /** Runtime context. */
  runtime: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  /** Tree level. */
  treeLevel: PropTypes.number,
  /** Whether to show subcategories or not */
  showSubCategories: PropTypes.bool,
}

export default SideBarItem
