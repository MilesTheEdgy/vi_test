import React, { useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CFormGroup, CLabel, CInput, CTextarea, CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import "./basvurudetay.css"
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Modal from "../../components/modals/Modal"

// const BasvuruDetay = ({match}) => {
//     const data = useSelector(state => state.reducer.appsData)
//     const user = data.find( user => user.ID.toString() === match.params.id)
//     console.log("user obj: ", user);
//     const userDetails = user ? Object.entries(user) : 
//       [['ID', (<span><CIcon className="text-muted" name="cui-icon-ban" /> Başvuru bulunmadı</span>)]]
//     console.log(userDetails);
//     return (
//       <CRow>
//         <CCol lg={6}>
//           <CCard>
//             <CCardHeader>
//               User ID: {match.params.ID}
//             </CCardHeader>
//             <CCardBody>
//                 <table className="table table-striped table-hover">
//                   <tbody>
//                     {
//                       userDetails.map(([key, value], index) => {
//                         {/* console.log("key is : ", key, "value is : ", value) */}
//                         return (
//                           <tr key={index.toString()}>
//                             <td>{`${key}:`}</td>
//                             <td><strong>{value}</strong></td>
//                           </tr>
//                         )
//                       })
//                     }
//                   </tbody>
//                 </table>
//             </CCardBody>
//           </CCard>
//         </CCol>
//       </CRow>
//     )
// }

const BasvuruDetay = ({match}) => {
  const [isAppOnHold, setIsAppOnHold] = useState(false)
  const updateApp = async (statusChange) => {
    const res = await fetch(`http://localhost:8080/basvurular/${match.params.id}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        'authorization' :`Bearer ${document.cookie.slice(8)}`
      },
      body: JSON.stringify({
            salesRepDetails: sdDetay,
            statusChange: statusChange
            })
    })
    if (res.status === 200) {
      setModalDetails(modalSuccess)
      setModal(true)
    } else {
      setModalDetails(modalFailure)
      setModal(true)
    }
  }
  const data = useSelector(state => state.reducer.appsData)
  const user = data.find( user => user.ID.toString() === match.params.id)
  const [sdDetay, setSdDetay] = useState("")
  const modalSuccess = {
    header: "BAŞARILI",
    body: "Başvurunuz başarıyla güncellenmiştir",
    color: "success"
  }
  const modalFailure = {
    header: "HATA",
    body: "Bir hata olmuştur, lütfen sayfayı yenileyerek tekrar deneyin",
    color: "danger"
  }
  const [modal, setModal] = useState(false)
  const [modalDetails, setModalDetails] = useState({})
  const history = useHistory()
   
  const userDetails = user ? user : 
    [['ID', (<span><CIcon className="text-muted" name="cui-icon-ban" /> Başvuru bulunmadı</span>)]]
  if (userDetails.ID)
  return (
    <CRow className = "justify-content-center align-items-center">
      <Modal modalOn= {modal} setModal = {setModal} color = {modalDetails.color} header = {modalDetails.header} body = {modalDetails.body} />
      <CCol xs="12" sm="8">
        <CCard>
          <CCardHeader className = "basvuru-detay-header">
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
            <CFormGroup>
              <CLabel>Bayi Açıklama</CLabel>
              <CTextarea 
                rows="4"
                placeholder={userDetails.Açıklama}
                readOnly
              />
            </CFormGroup>
            <CFormGroup>
              <CLabel>Notlarınız</CLabel>
              <CTextarea 
                rows="6"
                placeholder="işlemle alakalı notlarınız..."
                onChange = {(e) => setSdDetay(e.target.value)}
              />
            </CFormGroup>
            <CFormGroup row className = "basvuru-detay-submit-buttons my-0" >
              <CCol sm = "3">
                <div id = "basvuruDetay-footerButtons">
                  <CButton onClick = {() => updateApp("İptal edildi")} size="md" color="danger"><i className="fas fa-ban"></i> İPTAL</CButton>
                  <CButton onClick = {()=> updateApp("İşleniyor")} size="md" color="success" className = "basvuru-detay-submit-buttons-submit" ><i className="fas fa-check"></i> İŞLE</CButton>
                </div>
              </CCol>
            </CFormGroup>
          </CCardBody>
        </CCard>
      </CCol>
  </CRow>
  )
}

export default BasvuruDetay