import React from 'react';
import { useDispatch } from 'react-redux';
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

const TheHeaderDropdown = () => {
  const dispatch = useDispatch()
  return (
    <CDropdown
      inNav
      className="c-header-nav-items mx-0"
      direction="down"
    >
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div className="c-avatar">
          <CIcon name="cil-user" className="mfe-2" />
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem onClick = {() => {
            document.cookie = 'vitoken=eggkdjsewad67hgzshr6r0987rah68r0z76rh0z5075df7zh';
            dispatch({type: "LOGOUT"})
          }}>
          <CIcon name="cil-lock-locked" className="mfe-2" />
          Çıkış Yap
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  ) 
}

export default TheHeaderDropdown
