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
import { useEffect, useState } from 'react'

const handleNameUpdate = async (newName, offerID, serviceID ) => {
    const res = await fetch(`/offer/name?offerID=${offerID}&forServiceID=${serviceID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${document.cookie.slice(8)} `
          },
          body: JSON.stringify({
            newOfferName: newName
          })
    })
}
const handleDescriptionUpdate = async (newDescription, offerID, serviceID) => {
    const res = await fetch(`/offer/description?offerID=${offerID}&forServiceID=${serviceID}`, {
        method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${document.cookie.slice(8)} `
          },
          body: JSON.stringify({
            newOfferDescription: newDescription
          })
    })
}
const handleValueUpdate = async (newValue, offerID, serviceID) => {
    const res = await fetch(`/offer/value?offerID=${offerID}&forServiceID=${serviceID}`, {
        method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${document.cookie.slice(8)} `
          },
          body: JSON.stringify({
            newOfferValue: newValue
          })
    })
}

export const EditingModal = ({offer, show, onClose, offerChange}) => {
    const [newName, setNewName] = useState(offer.kampanya_ismi)
    const [newValue, setNewValue] = useState(offer.değeri)
    const [newDescription, setNewDescription] = useState(offer.kampanya_açıklaması)
    const [buttonDisabled, setButtonDisabled] = useState(true)
    
    const successObj = {
        color: "success",
        body: "Değişikleriniz başarıyla tamamlanmıştır!"
    }

    const errorObj = {
        color: "danger",
        body: "Bir hata oldu, lütfen daha sonra tekrar deneyin"
    }

    async function handleSubmit() {

    }

    function verifyInputFields() {
        console.log(newName, offer.kampanya_ismi)
        console.log(newDescription, offer.kampanya_açıklaması)
        console.log(newValue, Number(offer.değeri));
        let changesArr = [false, false, false]
        if (newName !== offer.kampanya_ismi)
            changesArr[0] = true
        else
            changesArr[0] = false

        if (newDescription !== offer.kampanya_açıklaması)
            changesArr[1] = true
        else
            changesArr[1] = false

        if (newValue !== Number(offer.değeri))
            changesArr[2] = true
        else
            changesArr[2] = false

        console.log("changesArr ", changesArr)
        return changesArr
    }
    useEffect(() => {
        // setButtonDisabled(verifyInputFields())
        verifyInputFields()
        //eslint-disable-next-line
    }, [newName, newValue, newDescription])
    return (
        <CModal 
        size = "lg"
        show={show}
        onClose={() => onClose(!show)}
        centered
        >
            <CModalHeader closeButton>
                <CModalTitle> Kampanya detayı </CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CRow className = "justify-content-center align-items-center">
                <CCol xs="12" sm="11">
                    <CFormGroup row className="my-0">
                        <CCol xs="10">
                            <CFormGroup>
                                <CLabel>Kampanya ismi</CLabel>
                                <CInput defaultValue={offer?.kampanya_ismi} onChange = {(e) => setNewName(e.target.value)} />
                            </CFormGroup>
                        </CCol>
                        <CCol xs="2">
                            <CFormGroup>
                                <CLabel>Değeri</CLabel>
                                <CInput defaultValue= {offer?.değeri} onChange = {(e) => setNewValue(Number(e.target.value))} type = "number" />
                            </CFormGroup>
                        </CCol>
                    </CFormGroup>
                    <CFormGroup>
                        <CLabel>Kampanya Açıklaması</CLabel>
                        <CTextarea
                        onChange = {(e) => setNewDescription(e.target.value)}
                        rows="6"
                        defaultValue = {offer?.kampanya_açıklaması}
                        />
                    </CFormGroup>
                </CCol>
                </CRow>
            </CModalBody>
            <CModalFooter>
                <CButton color = "success" disabled = {buttonDisabled} onClick = {handleSubmit} >Değiştir</CButton>
                <CButton color="secondary" onClick={() => onClose(!show)}>Kapat</CButton>
            </CModalFooter>
        </CModal>
    )
}