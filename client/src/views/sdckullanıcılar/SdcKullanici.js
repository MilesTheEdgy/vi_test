import React, { useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CFormGroup, CLabel, CInput, CTextarea, CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import "./style.css"

const operationTypes = [
  ["Faturasız", "faturasiz"],
  ["Faturalı", "faturali"],
  ["DSL", "dsl"],
  ["PSTN", "pstn"],
  ["Taahüt", "taahut"],
  ["Tivibu", "tivibu"],
  ["Diğer işlem", "digerislem"]
]

const SdcKullanici = ({match}) => {
  const history = useHistory()
  const data = useSelector(state => state.reducer.sdc.users)
  console.log("DATA IS: ", data)
  const user = data.find( user => user.ID.toString() === match.params.id)
  if (user !== undefined)
  return (
    <CRow className = "justify-content-center align-items-center">
      <CCol xs="12" sm="8">
        <CCard>
          <CCardHeader>
            <CRow>
              <CCol>
                <h5>Kullanıcı Detay</h5>
              </CCol>
              <CCol sm = "2">
                <CButton active block color="secondary" aria-pressed="true" id = "sdcKullanici-backButton" onClick = {() => {
                  history.push("/sdc/kullanicilar")
                }}>Geri</CButton>
              </CCol>
            </CRow> 
          </CCardHeader>
          <CCardBody className = "basvuru-detay" >
            <CFormGroup row className="my-0">
              <CCol lg="12" xl = "2" >
                <CFormGroup>
                  <CLabel>ID</CLabel>
                  <CInput placeholder= {user.ID} readOnly />
                </CFormGroup>
              </CCol>
              <CCol lg="12" xl = "4">
                <CFormGroup>
                  <CLabel>İsim</CLabel>
                  <CInput placeholder={user.Kullanıcı} readOnly />
                </CFormGroup>
              </CCol>
              <CCol lg="12" xl = "3">
                <CFormGroup>
                  <CLabel>Röl</CLabel>
                  <CInput placeholder={user.Röl} readOnly />
                </CFormGroup>
              </CCol>
              <CCol lg="12" xl = "3">
                <CFormGroup>
                  <CLabel>Kayıt tarihi</CLabel>
                  <CInput placeholder="2021.02.06" readOnly />
                </CFormGroup>
              </CCol>
            </CFormGroup>
            <CFormGroup className="my-0 p-2">
              <h5>işlemler</h5>
            </CFormGroup>
            {
              operationTypes.map(operationName => {
                return (
                  <CFormGroup row className="my-0 p-2 justify-content-center">              
                    <CCol xs="3">
                      <CFormGroup>
                        <CLabel> {operationName[0]} sayısı</CLabel>
                        <CInput placeholder= {user.Röl} readOnly />
                      </CFormGroup>
                    </CCol>
                    <CCol xs="3">
                      <CFormGroup>
                        <CLabel>Onaylanan</CLabel>
                        <CInput placeholder={user.Tip} readOnly />
                      </CFormGroup>
                    </CCol>
                    <CCol xs="3">
                      <CFormGroup>
                        <CLabel>Iptal edilen</CLabel>
                        <CInput placeholder={user.Kampanya} readOnly />
                      </CFormGroup>
                    </CCol>
                    <CCol xs="2" >
                      <CFormGroup>
                        <CLabel>&#8205; &#8205; &#8205; &#8205; &#8205; &#8205; &#8205; &#8205; &#8205; &#8205; &#8205; &#8205; &#8205; &#8205; &#8205; &#8205; </CLabel>
                        <CButton onClick = {() => history.push(`/sdc/islemler?query=yoyobaby`)} color = "success" ><i className="fas fa-arrow-right"></i></CButton>
                      </CFormGroup>
                    </CCol>
                  </CFormGroup>
                )
              })
            }
          </CCardBody>
        </CCard>
      </CCol>
  </CRow>
  ) 
    else 
    return(
    <CRow className = "justify-content-center align-items-center">
      <CCol xs="12" sm="8">
        <CCard>
          <CCardHeader>
            <CRow>
              <CCol>
                <h4>HATA</h4>
              </CCol>
              <CCol sm = "2" className = "basvuru-detay-header-buttonCol">
                <CButton active block color="secondary" aria-pressed="true" onClick = {() => {
                  history.push("/sdc/kullanicilar")
                }}>Geri</CButton>
              </CCol>
            </CRow> 
          </CCardHeader>
          <CCardBody style = {{textAlign: "center"}} >
            <h1>Böyle bir kullanıcı yok</h1>
          </CCardBody>
        </CCard>
      </CCol>
  </CRow>
  )
}

export default SdcKullanici