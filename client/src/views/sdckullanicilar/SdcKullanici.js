import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CFormGroup, CLabel, CInput, CButton } from '@coreui/react'
import { useHistory } from 'react-router-dom'
import HocLoader from '../hocloader/HocLoader'
import "./style.css"
import { filterAndMapAppData, mapUsersData } from '.'

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
    // console.log("data from fetchuserlogin", data)
    return data
  }
}

const fetchSalesData = async (id, service, status) => {
  try {
    const res = await fetch(`http://localhost:8080/sdc/user/${id}/count/?service=${service}&status=${status}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'authorization' :`Bearer ${document.cookie.slice(8)} `
      }
    })
    if (res.status === 200) {
      const data = await res.json()
      return data
    }
  } catch (error) {
    console.log(error)
  }
}

const onImageChange =  async (event) => {
  if (event.target.files && event.target.files[0]) {
    console.log("event.target.files", event.target.files)

    let img = event.target.files[0];
    console.log("img before using createobjecturl", img)
    console.log("img before using createobjecturl", URL.createObjectURL(img))

    const formData = new FormData()
    formData.append("myFile", img, img.name)
    const plainFormData = Object.fromEntries(formData.entries());
    const formDataJsonString = JSON.stringify(plainFormData);
    const res = await fetch("http://localhost:8080/upload", {
      method: "POST",
      headers: {
        'authorization' :`Bearer ${document.cookie.slice(8)} `
        },
      body: formDataJsonString
    })
    if (res.status === 200) {
      const data = await res.json()
      console.log("data from fetch", data)
    } else {
      console.log("err")
    }
  }
};

const SdcKullanici = ({match}) => {
  const { id } = match.params
  const history = useHistory()
  const [userLoginDataLoading, setUserLoginDataLoading] = useState(true)
  const [userLoginData, setUserLoginData] = useState({id: 0, username:"", role:""})
  const [salesdata, setSalesData] = useState([])
  useEffect(() => {
    const fetchAllData = async () => {
      const userDataFetch = await fetchUserLoginDate(id)
      const mappedUserData = mapUsersData([userDataFetch])
      setUserLoginData(mappedUserData[0])
      setUserLoginDataLoading(false)
      const allData = await fetchSalesData(id, "ALL", "ALL")
      const filteredData = filterAndMapAppData(allData)
      setSalesData(filteredData)
    }
    fetchAllData()
  }, [id])
  if (userLoginData !== undefined)
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
                <HocLoader isLoading = {userLoginDataLoading} absolute = {true}>
                  <CFormGroup row className="my-0">
                    <CCol lg="12" xl = "3" >
                      <CFormGroup>
                        <CLabel>ID</CLabel>
                        <CInput placeholder= {userLoginData.ID} readOnly />
                      </CFormGroup>
                    </CCol>
                    <CCol lg="12" xl = "3">
                      <CFormGroup>
                        <CLabel>İsim</CLabel>
                        <CInput placeholder={userLoginData.Kullanıcı} readOnly />
                      </CFormGroup>
                    </CCol>
                    <CCol lg="12" xl = "3">
                      <CFormGroup>
                        <CLabel>Röl</CLabel>
                        <CInput placeholder={userLoginData.Röl} readOnly />
                      </CFormGroup>
                    </CCol>
                    <CCol lg="12" xl = "3">
                      <CFormGroup>
                        <CLabel>Kayıt tarihi</CLabel>
                        <CInput placeholder={userLoginData.Kayıt_tarihi} readOnly />
                      </CFormGroup>
                    </CCol>
                  </CFormGroup>
                </HocLoader>
                <CFormGroup className="my-0 p-2">
                  <h5>İşlem Raporu</h5>
                </CFormGroup>

                {
                  salesdata.map((obj, i) => {
                    return (
                      <div key = {i+10}>
                      <CFormGroup row>
                        <CCol>
                          <CLabel><strong>{obj.service}</strong></CLabel>
                        </CCol>
                      </CFormGroup>
                      <CFormGroup row className="justify-content-center"> 
                        <CCol sm = "6" lg="2">
                          <CFormGroup>
                            <CLabel> Toplam</CLabel>
                            <CInput placeholder= {Number(obj.approvedCount) + Number(obj.rejectedCount)} readOnly />
                          </CFormGroup>
                        </CCol>
                        <CCol sm = "6" lg="2">
                          <CFormGroup>
                            <CLabel>Onaylanan</CLabel>
                            <CInput placeholder={obj.approvedCount} readOnly />
                          </CFormGroup>
                        </CCol>
                        <CCol sm = "6" lg="2">
                          <CFormGroup>
                            <CLabel>Gönderilen</CLabel>
                            <CInput placeholder={obj.sentCount} readOnly />
                          </CFormGroup>
                        </CCol>
                        <CCol sm = "6" lg="2">
                          <CFormGroup>
                            <CLabel>İşlenen</CLabel>
                            <CInput placeholder={obj.processingCount} readOnly />
                          </CFormGroup>
                        </CCol>
                        <CCol sm = "6" lg="2">
                          <CFormGroup>
                            <CLabel>İptal edilen</CLabel>
                            <CInput placeholder={obj.rejectedCount} readOnly />
                          </CFormGroup>
                        </CCol>
                        <CCol sm = "6" lg="2" >
                          <CFormGroup>
                            <CLabel col></CLabel>
                            <CButton onClick = {() => history.push(`/sdc/islemler?islem=${obj.routeName}&id=${userLoginData.ID}`)} color = "success" ><i className="fas fa-arrow-right"></i></CButton>
                          </CFormGroup>
                        </CCol>
                        <div className = "sdcKullainici-divider"></div>
                        
                      </CFormGroup>
                      </div>
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