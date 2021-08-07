import React from 'react'
import {
  CCreateElement,
  CSidebar,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
  CSidebarBrand
} from '@coreui/react'
import PapyrumLogo from "../../assests/icons/PapyrumLogo.png"

import CIcon from '@coreui/icons-react'

import { useSelector, useDispatch } from 'react-redux'

// sidebar nav config
import navigation from './_nav'

const Sidebar = () => {
  const dispatch = useDispatch()
  const show = useSelector(state => state.sidebarShow)
  return (
    <CSidebar
      show={show}
      onShowChange={(val) => dispatch({type: 'set', sidebarShow: val })}
    >
      <CSidebarBrand className="d-md-down-none" to="/">
        <CIcon
          className="c-sidebar-brand-full"
          src = {PapyrumLogo}
          height={100}
        />
      </CSidebarBrand>
      <CSidebarNav>

        <CCreateElement
          items={navigation}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle
          }}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none"/>
    </CSidebar>
  )
}

export default React.memo(Sidebar)
