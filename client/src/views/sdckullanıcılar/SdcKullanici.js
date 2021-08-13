import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CFormGroup, CLabel, CInput, CTextarea, CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import HocLoader from '../hocloader/HocLoader'
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

const fetchUserLoginDate = async (id) => {
  const res = await fetch(`http://localhost:8080/sdc/user/${id}`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'authorization' :`Bearer ${document.cookie.slice(8)} `
    }
  })
  if (res.status === 200) {
    const data = await res.json()
    console.log("data from fetchuserlogin", data)
    return data
  }
}

const SdcKullanici = ({match}) => {
  const history = useHistory()
  const [userLoginData, setUserLoginData] = useState({id: 0, username:"", role:""})
  useEffect(() => {
    fetchUserLoginDate(match.params.id)
      .then(data => {
        setUserLoginData(data)
      })

  }, [])
  const data = useSelector(state => state.reducer.sdc.users)
  const user = data.find( user => user.ID.toString() === match.params.id)
  if (user !== undefined)
  return (
    <CRow className = "justify-content-center align-items-center">
        <CCol xs="12" sm="8">
    <HocLoader isLoading = {true}>
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
                    <CInput placeholder= {userLoginData.id} readOnly />
                  </CFormGroup>
                </CCol>
                <CCol lg="12" xl = "4">
                  <CFormGroup>
                    <CLabel>İsim</CLabel>
                    <CInput placeholder={userLoginData.username} readOnly />
                  </CFormGroup>
                </CCol>
                <CCol lg="12" xl = "3">
                  <CFormGroup>
                    <CLabel>Röl</CLabel>
                    <CInput placeholder={userLoginData.role} readOnly />
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
                operationTypes.map((operationName, i) => {
                  return (
                    <CFormGroup row className="my-0 p-2 justify-content-center" key = {i} >              
                      <CCol sm = "6" lg="3">
                        <CFormGroup>
                          <CLabel> {operationName[0]} sayısı</CLabel>
                          <CInput placeholder= {user.Röl} readOnly />
                        </CFormGroup>
                      </CCol>
                      <CCol sm = "6" lg="3">
                        <CFormGroup>
                          <CLabel>Onaylanan</CLabel>
                          <CInput placeholder={user.Tip} readOnly />
                        </CFormGroup>
                      </CCol>
                      <CCol sm = "6" lg="3">
                        <CFormGroup>
                          <CLabel>Iptal edilen</CLabel>
                          <CInput placeholder={user.Kampanya} readOnly />
                        </CFormGroup>
                      </CCol>
                      <CCol sm = "6" lg="2" >
                        <CFormGroup>
                          <CLabel col></CLabel>
                          <CButton onClick = {() => history.push(`/sdc/islemler?islem=${operationName[1]}&id=${user.ID}`)} color = "success" ><i className="fas fa-arrow-right"></i></CButton>
                        </CFormGroup>
                      </CCol>
                      <div className = "sdcKullainici-divider"></div>
                      
                    </CFormGroup>
                  )
                })
              }
            </CCardBody>
          </CCard>
    </HocLoader>
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