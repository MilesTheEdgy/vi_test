import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CHeader,
  CToggler,
  CHeaderNav,
  CHeaderNavItem,
  CHeaderNavLink,
  CButton,
} from '@coreui/react'
// import CIcon from '@coreui/icons-react'

import TheHeaderDropdown from "./TheHeaderDropdown"

// import VarolLogoText from "../assets/icons/VarolLogoText.png"

import "./theheader.css"
import TheHeaderDropdownNotif from './TheHeaderDropdownNotif'
// import TheHeaderDropdownTasks from './TheHeaderDropdownTasks'
import TheHeaderDropdownMssg from './TheHeaderDropdownMssg'


const TheHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector(state => state.sidebarState.sidebarShow)
  const username = useSelector(state => state.reducer.loggedInUserInfo.loggedInUserName)

  const toggleSidebar = () => {
    const val = [true, 'responsive'].includes(sidebarShow) ? false : 'responsive'
    dispatch({type: 'set', sidebarShow: val})
  }

  const toggleSidebarMobile = () => {
    const val = [false, 'responsive'].includes(sidebarShow) ? true : 'responsive'
    dispatch({type: 'set', sidebarShow: val})
  }

  return (
    <CHeader withSubheader>
      <CToggler
        inHeader
        className="ml-md-3 d-lg-none"
        onClick={toggleSidebarMobile}
      />
      <CToggler
        inHeader
        className="ml-3 d-md-down-none"
        onClick={toggleSidebar}
      />
      {/* <CHeaderBrand className="mx-auto d-lg-none" to="/">
        <CIcon src = {VarolLogoText} height="100" alt="Logo"/>
      </CHeaderBrand> */}

      <CHeaderNav className="d-md-down-none mr-auto">
        <CHeaderNavItem className="px-3" >
          <CHeaderNavLink to="/anasayfa">Ana Sayfa</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem  className="px-3">
          <CHeaderNavLink to="/users">Users</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem className="px-3">
          <CButton block variant="outline" color="primary">Yeni Başvuru</CButton>
        </CHeaderNavItem>
      </CHeaderNav>

      <CHeaderNav className="px-3">
      <div className="headerNavLinkFontFlex">
        <p className = "headerNavLinkFontWelcome">Hoş Geldiniz</p>
        <h6 className = "headerNavLinkFontUser">{username}</h6>
      </div>
        <TheHeaderDropdownNotif/>
        {/* <TheHeaderDropdownTasks/> */}
        <TheHeaderDropdownMssg/>
        <TheHeaderDropdown/>
      </CHeaderNav>

      {/* <CSubheader className="px-3 justify-content-between">
        <CBreadcrumbRouter 
          className="border-0 c-subheader-nav m-0 px-0 px-md-3" 
        />
          <div className="d-md-down-none mfe-2 c-subheader-nav">
            <CLink className="c-subheader-nav-link"href="#">
              <CIcon name="cil-speech" alt="Settings" />
            </CLink>
            <CLink 
              className="c-subheader-nav-link" 
              aria-current="page" 
              to="/dashboard"
            >
              <CIcon name="cil-graph" alt="Dashboard" />&nbsp;Dashboard
            </CLink>
            <CLink className="c-subheader-nav-link" href="#">
              <CIcon name="cil-settings" alt="Settings" />&nbsp;Settings
            </CLink>
          </div>
      </CSubheader> */}
    </CHeader>
  )
}

export default TheHeader;