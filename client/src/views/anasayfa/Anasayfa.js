import React, { lazy } from 'react'
import {
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CCallout
} from '@coreui/react'

import MainChartExample from '../charts/MainChartExample'

const WidgetsDropdown = lazy(() => import('../widgets/WidgetsDropdown.js'))

const Anasayfa = () => {

  return (
    <>
      {/* The 4 data widgets */}
      <WidgetsDropdown />


      <CCard>
        <CCardBody>
          <CRow>

            <CCol sm="5">
              <h4 className="card-title mb-0">Satış Grafiği</h4>
              <div className="small text-muted">2021</div>
            </CCol>

          </CRow>

          
          <MainChartExample style={{height: '300px', marginTop: '40px'}}/>


        </CCardBody>


        
        <CCardFooter>
          <CRow className="text-center">

            <CCol md sm="12" className="mb-sm-2 mb-0">
              <div className="text-muted">Faturasız</div>
              <strong>45 (40%)</strong>
              <CProgress
                className="progress-xs mt-2"
                precision={1}
                color="success"
                value={40}
              />
            </CCol>

            <CCol md sm="12" className="mb-sm-2 mb-0 d-md-down-none">
              <div className="text-muted">Faturalı</div>
              <strong>13 (20%)</strong>
              <CProgress
                className="progress-xs mt-2"
                precision={1}
                color="info"
                value={40}
              />
            </CCol>

            <CCol md sm="12" className="mb-sm-2 mb-0">
              <div className="text-muted">DSL</div>
              <strong>26 (60%)</strong>
              <CProgress
                className="progress-xs mt-2"
                precision={1}
                color="warning"
                value={40}
              />
            </CCol>

            <CCol md sm="12" className="mb-sm-2 mb-0">
              <div className="text-muted">Cihaz</div>
              <strong>2 (80%)</strong>
              <CProgress
                className="progress-xs mt-2"
                precision={1}
                color="danger"
                value={40}
              />
            </CCol>

            <CCol md sm="12" className="mb-sm-2 mb-0 d-md-down-none">
              <div className="text-muted">Tivibu</div>
              <strong>3 (40.15%)</strong>
              <CProgress
                className="progress-xs mt-2"
                precision={1}
                value={40}
              />
            </CCol>
          </CRow>


        </CCardFooter>



      </CCard>



      {/* <WidgetsBrand withCharts/> */}

      <CRow>
        <CCol>
          <CCard>
            <CCardHeader className="card-title mb-0" style = {{fontSize : "18px"}} >
              <h4 className="card-title mb-0">Dünkü Satışlar</h4>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol md sm="12" className="mb-sm-2 mb-0">
                  <CCallout color="success">
                    <small className="text-muted">Faturasız</small>
                    <br />
                    <strong className="h4">9,123</strong>
                  </CCallout>
                </CCol>

                <CCol md sm="12" className="mb-sm-2 mb-0 d-md-down-none">
                  <CCallout color="info">
                    <small className="text-muted">Faturalı</small>
                    <br />
                    <strong className="h4">22,643</strong>
                  </CCallout>
                </CCol>

                <CCol md sm="12" className="mb-sm-2 mb-0">
                  <CCallout color="warning">
                    <small className="text-muted">DSL</small>
                    <br />
                    <strong className="h4">78,623</strong>
                  </CCallout>
                </CCol>

                <CCol md sm="12" className="mb-sm-2 mb-0">
                  <CCallout color="danger">
                    <small className="text-muted">Cihaz</small>
                    <br />
                    <strong className="h4">49,123</strong>
                  </CCallout>
                </CCol>

                <CCol md sm="12" className="mb-sm-2 mb-0 d-md-down-none">
                  <CCallout color = "primary">
                    <small className="text-muted">Tivibu</small>
                    <br />
                    <strong className="h4">49,123</strong>
                  </CCallout>
                </CCol>
              </CRow>
            </CCardBody> 
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Anasayfa