import React, { useState, useRef } from 'react'
import { Link } from 'vtex.render-runtime'
import PropTypes from 'prop-types'
import { categoryItemShape } from '../propTypes'

import ItemContainer from './ItemContainer'
import classNames from 'classnames'
import styles from '../categoryMenu.css'
import categoryMenuPosition, {getMenuPositionValues} from '../utils/categoryMenuPosition'

/**
 * Component that represents a single category displayed in the menu, also displays
 * the subcategories, if the provided category has them
 */
const CategoryItem = ({
  category,
  categoryId,
  subcategoryLevels,
  menuPosition,
  images,
  isHover,
  setHover,
  handleCloseMenu,
  category: { name, slug },
  noRedirect,
  isCategorySelected
}) => {

  const itemRef = useRef(null)

  const categoryClasses = classNames(
    styles.departmentLink,
    'w-100 pv5 no-underline t-small outline-0 db tc link truncate bb bw1 c-muted-1',
    {
      'b--transparent': !isHover && !isCategorySelected,
      'b--action-primary pointer': isHover || isCategorySelected,
      mr8: menuPosition === categoryMenuPosition.DISPLAY_LEFT.value,
      ml8: menuPosition === categoryMenuPosition.DISPLAY_RIGHT.value,
      mh6: menuPosition === categoryMenuPosition.DISPLAY_CENTER.value,
    }
  )

  const containerStyle = {
    top:
      itemRef.current &&
      itemRef.current.offsetTop + itemRef.current.clientHeight,
    display: isHover ? 'flex' : 'none',
  }

  return (
    <li className={`${styles.itemContainer} ${styles['itemContainer--department']} ${noRedirect ? `${styles['alldepartment']}` : ``} flex items-center db list`} ref={itemRef} onMouseEnter={() => setHover(true)} onMouseLeave={handleCloseMenu}>
      {noRedirect ? (
        <span className={`${categoryClasses} ${styles['alldepartment--title']}`}>{name}</span>
      ) : (
        <Link
          onClick={handleCloseMenu}
          page="store.search#department"
          params={{ department: slug }}
          className={categoryClasses}
        >
          {name}
        </Link>
      )}

      {subcategoryLevels > 0 && category.children.length > 0 && (
        <ItemContainer
          menuPosition={menuPosition}
          containerStyle={containerStyle}
          categories={category.children}
          categoryId={categoryId}
          images={images}
          parentSlug={category.slug}
          onCloseMenu={handleCloseMenu}
          isHover={isHover}
          showSecondLevel={subcategoryLevels === 2}
        />
      )}
    </li>
  )
}

CategoryItem.propTypes = {
  /** Category to be displayed */
  category: categoryItemShape.isRequired,
  /** Set use of Link component */
  noRedirect: PropTypes.bool,
  /** Number of subcategory levels */
  subcategoryLevels: PropTypes.oneOf([0, 1, 2]),
  /** Defines the position of the category menu */
  menuPosition: PropTypes.oneOf(getMenuPositionValues()),
  /** Menu category selection */
  isCategorySelected: PropTypes.bool
}

export default CategoryItem
