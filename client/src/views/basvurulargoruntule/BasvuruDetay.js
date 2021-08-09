import React, { useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CFormGroup, CLabel, CInput, CTextarea, CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import "./basvurudetay.css"
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

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
  const yarakOnay = async () => {
    const res = await fetch("http://localhost:8080/sd/basvurular/goruntule/degistir", {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        //slice the work 'vitoken' from document.cookie
        'authorization' :`Bearer ${document.cookie.slice(8)}`
      },
      body: JSON.stringify({
            sdDetay: sdDetay,
            durum: true
            })
    })
  }
  const yarakIptal = async () => {
    const res = await fetch("http://localhost:8080/sd/basvurular/goruntule/degistir", {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        //slice the work 'vitoken' from document.cookie
        'authorization' :`Bearer ${document.cookie.slice(8)}`
      },
      body: JSON.stringify({
            sdDetay: sdDetay,
            durum: false
            })
    })
  }
  const data = useSelector(state => state.reducer.appsData)
  const user = data.find( user => user.ID.toString() === match.params.id)
  const [sdDetay, setSdDetay] = useState("")
  const history = useHistory()
   
  const userDetails = user ? user : 
    [['ID', (<span><CIcon className="text-muted" name="cui-icon-ban" /> Başvuru bulunmadı</span>)]]
  return (
    <CRow className = "justify-content-center align-items-center">
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
              <CCol sm = "2">
                <CButton onClick = {() => yarakIptal()} type="reset" size="md" color="danger"><CIcon name="cil-ban" /> İPTAL</CButton>
              </CCol>
              <CCol sm = "2">
                <CButton onClick = {()=> yarakOnay()} type="submit" size="md" color="primary" className = "basvuru-detay-submit-buttons-submit" ><CIcon name="cil-scrubber" /> İŞLE</CButton>
              </CCol>
            </CFormGroup>
          </CCardBody>
        </CCard>
      </CCol>
  </CRow>
  )
}

export default BasvuruDetay