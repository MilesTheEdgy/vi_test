import {
    CCol,
    CRow,
    CModal,
    CModalTitle,
    CModalHeader,
    CModalBody,
    CModalFooter,
    CButton,
    CFormGroup,
    CLabel,
    CInput,
    CTextarea
  } from '@coreui/react'

export const mapDataToTurkish = (fetchData) => {
    return fetchData.map(obj => {
        let submitDate = new Date(obj.submit_time)
        let statusChangeDate = new Date(obj.status_change_date)
        let lastChangeDate = new Date(obj.last_change_date)
        let submitProcessNum = 0
        let status = ""
        if (obj.status === "approved") {
          submitProcessNum = 3
          status = "Onaylandı"
        }
        else if (obj.status === "rejected") {
          submitProcessNum = 3
          status = "İptal"
        }
        else if (obj.status === "processing") {
          submitProcessNum = 2
          status = "İşleniyor"
        }
        else if (obj.status === "sent") {
          status = "Gönderildi"
          submitProcessNum = 1
        }
        return {
            ID: obj.id,
            İsim: obj.client_name,
            Tarih: submitDate.toISOString().slice(0, 10),
            Tip: obj.selected_service,
            Kampanya: obj.selected_offer,
            Açıklama: obj.description,
            Statü: status,
            salesRepDetails: obj.sales_rep_details,
            statusChangeDate: statusChangeDate ? statusChangeDate.toISOString().slice(0, 10) : null,
            finalSalesRepDetails: obj.final_sales_rep_details,
            lastChangeDate: lastChangeDate ? lastChangeDate.toISOString().slice(0, 10) : null,
            submitProcessNum
          }
      })
}

export const getBadge = (status)=>{
    switch (status) {
       case 'Onaylandı': return 'success'
       case 'İşleniyor': return 'warning'
       case 'İptal': return 'danger'
       case 'Gönderildi': return 'secondary'
       default: return 'primary'
    }
  }

export default function ApplicationViewModal(props) {
    const { userDetails } = props
    const renderTextArea = (details) => {
      if (details?.submitProcessNum === 2) {
        return (
            <CFormGroup row>
              <CCol>
                <CLabel>Bayi Açıklama</CLabel>
                <CTextarea 
                  rows="8"
                  placeholder={userDetails?.Açıklama}
                  readOnly
                />
              </CCol>
              <CCol>
                <CLabel>Satış Desteğin Notları</CLabel>
                <CTextarea
                  rows="8"
                  placeholder={userDetails?.salesRepDetails}
                  readOnly
                />
              </CCol>
            </CFormGroup>
        )
      }
      else if (details?.submitProcessNum === 3) {
        return (
          <CFormGroup>
          <CLabel>Sizin Notlarınız</CLabel>
          <CTextarea 
            rows="4"
            placeholder={userDetails?.Açıklama}
            readOnly
          />
        </CFormGroup>
        )
      } else {
        return (
          <CFormGroup>
            <CLabel>Sizin Notlarınız</CLabel>
            <CTextarea 
              rows="4"
              placeholder={userDetails?.Açıklama}
              readOnly
            />
          </CFormGroup>
        )
      }
    }
    return (
          <CModal 
          size = "lg"
          show={props.show}
          onClose={() => props.onClose(!props.show)}
          centered
          >
              <CModalHeader closeButton>
                  <CModalTitle> Başvuru Detayı </CModalTitle>
              </CModalHeader>
              <CModalBody>
              <CRow className = "justify-content-center align-items-center">
                <CCol xs="12" sm="11">
                  <CFormGroup row className="my-0">
                    <CCol xs="2">
                      <CFormGroup>
                        <CLabel>ID</CLabel>
                        <CInput placeholder= {userDetails?.ID} readOnly />
                      </CFormGroup>
                    </CCol>
                    <CCol xs="10">
                      <CFormGroup>
                        <CLabel>İsim</CLabel>
                        <CInput placeholder={userDetails?.İsim} readOnly />
                      </CFormGroup>
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row className="my-0">
                    <CCol xs="3">
                      <CFormGroup>
                        <CLabel>Tarih</CLabel>
                        <CInput placeholder= {userDetails?.Tarih} readOnly />
                      </CFormGroup>
                    </CCol>
                    <CCol xs="2"> 
                      <CFormGroup>
                        <CLabel>Hizmet</CLabel>
                        <CInput placeholder={userDetails?.Tip} readOnly />
                      </CFormGroup>
                    </CCol>
                    <CCol xs="7">
                      <CFormGroup>
                        <CLabel>Kampanya</CLabel>
                        <CInput placeholder={userDetails?.Kampanya} readOnly />
                      </CFormGroup>
                    </CCol>
                  </CFormGroup>
                  {renderTextArea(userDetails)}
                  <CFormGroup>
                    <CLabel>Satış Desteğin Son Notları</CLabel>
                      <CTextarea 
                        rows="6"
                        placeholder={userDetails?.finalSalesRepDetails}
                        readOnly
                      />
                  </CFormGroup>
                </CCol>
              </CRow>
              </CModalBody>
              <CModalFooter>
                  <CButton color="secondary" onClick={() => props.onClose(!props.show)}>Kapat</CButton>
              </CModalFooter>
          </CModal>
      )
  }