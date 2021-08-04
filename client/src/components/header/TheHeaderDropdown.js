import React from 'react'
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useSelector, useDispatch } from 'react-redux'

const TheHeaderDropdown = () => {
  const userSettings = useSelector(state => state.user.userSettings)
  const dispatch = useDispatch();
  return (
    <CDropdown
      inNav
      className="c-header-nav-items mx-2"
      direction="down"
    >
      <CDropdownToggle className="c-header-nav-link" caret={true}>
        <strong> {userSettings.eczaneName} </strong>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem
          header
          tag="div"
          color="light"
          className="text-center"
        >
          <strong>Hesap</strong>
        </CDropdownItem>
        <CDropdownItem>
          <CIcon name="cil-user" className="mfe-2" />Profil
        </CDropdownItem>
        <CDropdownItem>
          <CIcon name="cil-settings" className="mfe-2" />
          Ayarlar
        </CDropdownItem>
        <CDropdownItem divider />
        <CDropdownItem onClick = { () => {
          dispatch({type: "LOG_OUT"})
          }} >
          <CIcon name="cil-lock-locked" className="mfe-2" />
          Çıkış yap
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default TheHeaderDropdown
