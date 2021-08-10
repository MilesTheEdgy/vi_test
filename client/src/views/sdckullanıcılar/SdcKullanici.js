import React, { useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CFormGroup, CLabel, CInput, CTextarea, CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

const SdcKullanici = ({match}) => {
  console.log(match.params.id)
  const history = useHistory()
  const data = useSelector(state => state.reducer.appsData)
  const user = data.find( user => user.ID.toString() === match.params.id)
  const userDetails = user ? user : 
    [['ID', (<span><CIcon className="text-muted" name="cui-icon-ban" /> Başvuru bulunmadı</span>)]]
  if (userDetails.ID)
  return (
    <CRow className = "justify-content-center align-items-center">
      <CCol xs="12" sm="8">
        <CCard>
          <CCardHeader>
            <h4>Başvuru Detay</h4>
            <CCol sm = "2" className = "basvuru-detay-header-buttonCol">
              <CButton active block color="secondary" aria-pressed="true" onClick = {() => {
                history.push("/basvurular/goruntule")
              }}>Geri</CButton>
            </CCol>
          </CCardHeader>
          <CCardBody className = "basvuru-detay" >
            <CFormGroup row className="my-0">
              <CCol xs="2">
                <CFormGroup>
                  <CLabel>ID</CLabel>
                  <CInput placeholder= {userDetails.ID} readOnly />
                </CFormGroup>
              </CCol>
              <CCol xs="10">
                <CFormGroup>
                  <CLabel>İsim</CLabel>
                  <CInput placeholder={userDetails.İsim} readOnly />
                </CFormGroup>
              </CCol>
            </CFormGroup>
            <CFormGroup row className="my-0">
              <CCol xs="2">
                <CFormGroup>
                  <CLabel>Tarih</CLabel>
                  <CInput placeholder= {userDetails.Tarih} readOnly />
                </CFormGroup>
              </CCol>
              <CCol xs="3">
                <CFormGroup>
                  <CLabel>Hizmet</CLabel>
                  <CInput placeholder={userDetails.Tip} readOnly />
                </CFormGroup>
              </CCol>
              <CCol xs="7">
                <CFormGroup>
                  <CLabel>Kampanya</CLabel>
                  <CInput placeholder={userDetails.Kampanya} readOnly />
                </CFormGroup>
              </CCol>
            </CFormGroup>
          </CCardBody>
        </CCard>
      </CCol>
  </CRow>
  )
}

export default SdcKullanici