  import React from 'react'
  import {
    CWidgetDropdown,
    CRow,
    CCol,
    CDropdown,
    CDropdownMenu,
    CDropdownItem,
    CDropdownToggle,
    CWidgetProgress
  } from '@coreui/react'
  import CIcon from '@coreui/icons-react'
  import ChartLineSimple from '../charts/ChartLineSimple'
  import ChartBarSimple from '../charts/ChartBarSimple'
  import "./widgetsdropdown.css"
  import { TUM_TEKLIFLER, BAKIYE_HAREKETLERI, BEKELEYEN_TEKLIFLER, SIZIN_TEKLIFLERINIZ} from "../../store"
  import { useDispatch } from 'react-redux'

  const WidgetsDropdown = () => {
    const dispatch = useDispatch()
    return (
      <CRow>
          <CCol xs="12" sm="6" lg="3">
            <CWidgetProgress inverse color="success" variant="inverse"  footer="Size ait olan teklifler" className = "top-widget"
              onClick = {() => dispatch({type: "SET_DASHBOARD_TABLE", dashboardTable: SIZIN_TEKLIFLERINIZ})}>
              <h3>Sizin Teklifleriniz</h3>
              <span className = "top-widget-pointerIcon"><i className="fas fa-hand-pointer"></i></span>
            </CWidgetProgress>
          </CCol>
          <CCol xs="12" sm="6" lg="3">
            <CWidgetProgress inverse color="info" variant="inverse" footer="Beklemede olan tüm teklifler" className = "top-widget"
              onClick = {() => dispatch({type: "SET_DASHBOARD_TABLE", dashboardTable: BEKELEYEN_TEKLIFLER})}>
              <h3>Bekleyen Teklifer</h3>
              <span className = "top-widget-pointerIcon"><i className="fas fa-hand-pointer"></i></span>
            </CWidgetProgress>
          </CCol>
          <CCol xs="12" sm="6" lg="3">
            <CWidgetProgress inverse color="warning" variant="inverse"  footer="Eczanenizin bakiye hareketleri" className = "top-widget"
              onClick = {() => dispatch({type: "SET_DASHBOARD_TABLE", dashboardTable: BAKIYE_HAREKETLERI})}>
              <h3>Bakiye Hareketleriniz</h3>
              <span className = "top-widget-pointerIcon"><i className="fas fa-hand-pointer"></i></span>
            </CWidgetProgress>
          </CCol>
          <CCol xs="12" sm="6" lg="3">
            <CWidgetProgress inverse color="danger" variant="inverse"  footer="Tüm eczanelerin teklifleri" className = "top-widget"
              onClick = {() => dispatch({type: "SET_DASHBOARD_TABLE", dashboardTable: TUM_TEKLIFLER})}>
              <h3>Tüm Teklifler</h3>
              <span className = "top-widget-pointerIcon"><i className="fas fa-hand-pointer"></i></span>
            </CWidgetProgress>
          </CCol>
      </CRow>
    )
  }

  export default WidgetsDropdown