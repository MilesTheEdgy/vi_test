import { CCard, CCardBody, CCardHeader, CCol, CRow, CFormGroup, CLabel, CInput, CTextarea, CButton } from '@coreui/react'
import { setHeaderColor, renderTextArea, renderBasvuruDetayFooter } from '.'
import { useHistory } from 'react-router'

const AppDataForm = ({isEditable, userDetails, setSdDetay}) => {
    const history = useHistory()
    return(
    <CRow className = "justify-content-center align-items-center">
        <CCol xs="12" sm="8">
          <CCard>
            <CCardHeader className = "basvuru-detay-header" style = {{backgroundColor: setHeaderColor(userDetails)}}>
              <h4>Başvuru Detay</h4>
              <CCol sm = "2" className = "basvuru-detay-header-buttonCol">
                <CButton active block color="secondary" aria-pressed="true" onClick = {() => history.push("/basvurular/goruntule")}>
                    Geri
                 </CButton>
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
}

export default AppDataForm