import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CFormGroup, CLabel, CInput, CTextarea, CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
// import "./basvurudetay.css"
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Modal from "../../components/modals/Modal"
// import { fetchData } from './BasvurularGoruntule'

const SdcIslem = ({match}) => {
  // RENDER FOOTER BUTTONS CONDITONALLY
//   const renderBasvuruDetayFooter = (details) => {
//     // if the application is on Hold (first status change)
//     if (details.submitProcessNum === 2) {
//       return (
//         <div id = "basvuruDetay-footerButtons">
//           {/* Here "true" in updateApp refers to sp optional parameter, if true it modifies the urlString in fetch */}
//           <CButton onClick = {() => updateApp("İptal", true)} size="md" color="danger"><i className="fas fa-ban"></i> İPTAL</CButton>
//           <CButton onClick = {()=> updateApp("Onaylandı", true)} size="md" color="success" className = "">
//           <i className="fas fa-check-circle"></i> ONAYLA</CButton>
//         </div>
//       )
//     }
//     // if the applications has been approved or denied (second status change)
//     else if (details.submitProcessNum === 3) {
//       return null
//     // else return first process submission
//     } else {
//       return (
//         <div id = "basvuruDetay-footerButtons">
//           <CButton onClick = {() => updateApp("İptal")} size="md" color="danger"><i className="fas fa-ban"></i> İPTAL</CButton>
//           <CButton onClick = {()=> updateApp("İşleniyor")} size="md" color="warning" className = "basvuru-detay-submit-buttons-submit" >
//           <i className="fas fa-arrow-circle-up"></i> İŞLE</CButton>
//         </div>
//       )
//     }
//   }
  const renderTextArea = (details) => {
    if (details.submitProcessNum === 2) {
      return (
          <CFormGroup row>
            <CCol>
              <CLabel>Bayi Açıklama</CLabel>
              <CTextarea 
                rows="8"
                placeholder={userDetails.Açıklama}
                readOnly
              />
            </CCol>
            <CCol>
              <CLabel>Önceki Notlarınız</CLabel>
              <CTextarea
                rows="8"
                placeholder={userDetails.salesRepDetails}
                readOnly
              />
            </CCol>
          </CFormGroup>
      )
    }
    else if (details.submitProcessNum === 3) {
      return (
        <CFormGroup>
        <CLabel>Önceki Notlarınız</CLabel>
        <CTextarea 
          rows="4"
          placeholder={userDetails.Açıklama}
          readOnly
        />
      </CFormGroup>
      )
    } else {
      return (
        <CFormGroup>
          <CLabel>Bayi Açıklama</CLabel>
          <CTextarea 
            rows="4"
            placeholder={userDetails.Açıklama}
            readOnly
          />
        </CFormGroup>
      )
    }
  }

  const setHeaderColor = (details) => {
    switch (details.Statü) {
      case "İşleniyor":
        return "rgb(214, 160, 11)"
      case "İptal":
        return "rgb(212, 69, 13)"
      case "Onaylandı":
        return "rgb(55, 150, 55)"
      default:
        return "rgb(120, 138, 151)"
    }
  }

  const [sdDetay, setSdDetay] = useState("")
  const [modal, setModal] = useState(false)
  const [modalDetails, setModalDetails] = useState({})
  const [data, setData] = useState({})
  const history = useHistory()
  const dispatch = useDispatch()
  const userDetails = {}
  useEffect(() => {
      const fetchData = async () => {
        const res = await fetch("http://localhost:8080/applications/:id",{
            method: 'GET',
            headers: {
              'content-type': 'application/json',
              'authorization' :`Bearer ${document.cookie.slice(8)} `
            }
      })
      if (res.status === 200) {
        const fetchData = await res.json()
        setData(fetchData)
      }
  if (userDetails.ID)
  return (
    <CRow className = "justify-content-center align-items-center">
      <Modal modalOn= {modal} setModal = {setModal} color = {modalDetails.color} header = {modalDetails.header} body = {modalDetails.body} />
      <CCol xs="12" sm="8">
        <CCard>
          <CCardHeader className = "basvuru-detay-header" style = {{backgroundColor: setHeaderColor(userDetails)}}>
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
            {renderTextArea(userDetails)}
            {
              userDetails.submitProcessNum === 3 ?
              <CFormGroup>
                <CLabel>Son notlarınız</CLabel>
                  <CTextarea 
                    rows="6"
                    placeholder={userDetails.finalSalesRepDetails}
                    readOnly
                  />
              </CFormGroup>
              :
              <CFormGroup>
                <CLabel>Notlarınız</CLabel>
                  <CTextarea 
                    rows="6"
                    placeholder="işlemle alakalı notlarınız..."
                    onChange = {(e) => setSdDetay(e.target.value)}
                  />
              </CFormGroup>
            }
            {/* <CFormGroup row className = "basvuru-detay-submit-buttons my-0" >
              <CCol sm = "4">
                {renderBasvuruDetayFooter(userDetails)}
              </CCol>
            </CFormGroup> */}
          </CCardBody>
        </CCard>
      </CCol>
  </CRow>
  )
  else return null
}

export default SdcIslem