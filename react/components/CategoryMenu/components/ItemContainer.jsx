import React, { useState } from 'react'
import { Link } from 'vtex.render-runtime'
import { categoryPropType } from '../propTypes'
import classNames from 'classnames'
import { Container } from 'vtex.store-components'

import PropTypes from 'prop-types'
import styles from '../categoryMenu.css'
import categoryMenuPosition, {getMenuPositionValues} from '../utils/categoryMenuPosition'

import { Image } from 'vtex.store-components'

const getLinkParams = (parentSlug, item) => {
  const params = {
    department: parentSlug || item.slug,
  }

  if (parentSlug) params.category = item.slug

  return params
}

/**
 * Component responsible dor rendering an array of categories and its respective subcategories
 */
const ItemContainer = ({
  containerStyle,
  categories,
  parentSlug,
  categoryId,
  images,
  menuPosition,
  onCloseMenu,
  showSecondLevel
}) => {
  const shouldRenderSecondLevel = category => {
    const { children } = category
    return children && children.length > 0 && showSecondLevel
  }

  const containerClasses = classNames(
    styles.submenuList,
    'w-100 flex flex-wrap pa0 list mw9',
    {
      'justify-start': menuPosition === categoryMenuPosition.DISPLAY_LEFT.value,
      'justify-end': menuPosition === categoryMenuPosition.DISPLAY_RIGHT.value,
      'justify-center':
        menuPosition === categoryMenuPosition.DISPLAY_CENTER.value,
    }
  )

  const columnItemClasses = classNames(styles.firstLevelList, {
    'pl0 pr7': menuPosition === categoryMenuPosition.DISPLAY_LEFT.value,
    'pr0 pl7': menuPosition === categoryMenuPosition.DISPLAY_RIGHT.value,
  })

  const firstLevelLinkClasses = classNames(
    styles.firstLevelLink,
    'db pv4 link no-underline outline-0 tl t-small truncate c-on-base underline-hover',
    {
      pr4: menuPosition === categoryMenuPosition.DISPLAY_LEFT.value,
      pl4: menuPosition === categoryMenuPosition.DISPLAY_RIGHT.value,
      ph4: menuPosition === categoryMenuPosition.DISPLAY_CENTER.value,
    }
  )

  const secondLevelLinkClasses = classNames(
    styles.secondLevelLink,
    'db pv3 no-underline outline-0 tl link t-small truncate c-muted-1 underline-hover',
    {
      pr5: menuPosition === categoryMenuPosition.DISPLAY_LEFT.value,
      pl5: menuPosition === categoryMenuPosition.DISPLAY_RIGHT.value,
      ph5: menuPosition === categoryMenuPosition.DISPLAY_CENTER.value,
    }
  )

  //Pega a imagem correspondente a cada departamento
  var imageCurrentObj = "";
  var imageCurrent = "";
  if( categoryId !== null ){
    if( categoryId !== undefined ){
      imageCurrentObj = images.filter(category => category.id == categoryId )
      if( imageCurrentObj.length > 0 ){
        imageCurrent = imageCurrentObj[0].image;
      }
    }
  }

  return (
    <>
      <div className={`${styles.itemContainer} ${styles['itemContainer--category']} absolute w-100`} style={containerStyle}
      >
        <Container
          className={`${styles['section--category']} justify-center w-100 flex`}
        >
          <ul className={containerClasses}>
            {categories
              .sort((a, b) => {
                return a.name > b.name ? 1 : -1
              })
              .map(category => (
                <li
                  key={category.id}
                  className={styles.submenuItem}
                >
                  <ul className={columnItemClasses}>
                    <li className={`${styles.firstLevelLinkContainer} list pa0`}>
                      <Link
                        onClick={onCloseMenu}
                        page={
                          parentSlug
                            ? 'store.search#category'
                            : 'store.search#department'
                        }
                        className={`${firstLevelLinkClasses} ${category.hasChildren ? `${styles.firstLevelLinkHasChildren}`:``} `}
                        params={getLinkParams(parentSlug, category)}
                      >
                        {category.name}
                      </Link>
                    </li>

                    <div className={styles.submenuItemContent}>
                      <ul className={`${styles['itemContainer--secondLevelCategory']} `}>
                        {shouldRenderSecondLevel(category) &&
                          category.children
                            .sort((a, b) => {
                              return a.name > b.name ? 1 : -1
                            })
                            .slice(0,4)
                            .map(subCategory => {
                              const params = {
                                department: parentSlug || category.slug,
                                category: parentSlug
                                  ? category.slug
                                  : subCategory.slug,
                              }
                              if (parentSlug) params.subcategory = subCategory.slug

                              return (
                                <li
                                  key={subCategory.id}
                                  className={`${styles.secondLevelLinkContainer} list pa0`}
                                >
                                  <Link
                                    onClick={onCloseMenu}
                                    page={
                                      parentSlug
                                        ? 'store.search#subcategory'
                                        : 'store.search#category'
                                    }
                                    className={secondLevelLinkClasses}
                                    params={params}
                                  >
                                    {subCategory.name}
                                  </Link>
                                </li>
                              )
                          })}
                          { (category.children.length > 8) &&
                            <li className={`${styles.secondLevelLinkContainer} list pa0`}>
                              <Link
                                  to={category.href}
                                  className={` ${secondLevelLinkClasses} ${styles.secondLevelLinkSeeMore}`}
                                >Ver mais
                              </Link>
                            </li>
                          }
                      </ul>

                      { (imageCurrent !== "") &&
                        <div className={styles.departamentImage}>
                          <Image src={imageCurrent} />
                        </div>
                      }
                    </div>
                  </ul>
                </li>
              ))}
          </ul>
        </Container>
      </div>
    </>
  )
}

ItemContainer.propTypes = {
  /** Category to be displayed */
  categories: PropTypes.arrayOf(categoryPropType),
  /** Department slug */
  parentSlug: PropTypes.string,
  /** Close menu callback */
  onCloseMenu: PropTypes.func.isRequired,
  /** Whether to show second level links or not */
  showSecondLevel: PropTypes.bool,
  /** Defines the position of the category menu */
  menuPosition: PropTypes.oneOf(getMenuPositionValues()),
  /** Custom styles to item container */
  containerStyle: PropTypes.object
}

export default ItemContainer
