import { CCol, CFormGroup, CLabel, CTextarea, CButton } from '@coreui/react'

export const renderBasvuruDetayFooter = (details, updateApp) => {
    // if the application is on Hold (first status change)
    if (details.submitProcessNum === 2) {
        return (
        <div id = "basvuruDetay-footerButtons">
            {/* Here "true" in updateApp refers to sp optional parameter, if true it modifies the urlString in fetch */}
            <CButton onClick = {() => updateApp("İptal", true)} size="md" color="danger"><i className="fas fa-ban"></i> İPTAL</CButton>
            <CButton onClick = {()=> updateApp("Onaylandı", true)} size="md" color="success" className = "">
            <i className="fas fa-check-circle"></i> ONAYLA</CButton>
        </div>
        )
    }
    // if the applications has been approved or denied (second status change)
    else if (details.submitProcessNum === 3) {
        return null
    // else return first process submission
    } else {
        return (
        <div id = "basvuruDetay-footerButtons">
            <CButton onClick = {() => updateApp("İptal")} size="md" color="danger"><i className="fas fa-ban"></i> İPTAL</CButton>
            <CButton onClick = {()=> updateApp("İşleniyor")} size="md" color="warning" className = "basvuru-detay-submit-buttons-submit" >
            <i className="fas fa-arrow-circle-up"></i> İŞLE</CButton>
        </div>
        )
    }
}

export const renderTextArea = (details, userDetails) => {
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

export const setHeaderColor = (details) => {
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