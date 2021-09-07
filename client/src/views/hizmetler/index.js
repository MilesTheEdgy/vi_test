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

export const EditingModal = ({offer, show, onClose}) => {
    const [newName, setNewName] = useState("")
    const [newValue, setNewValue] = useState(0)
    const [newDescription, setNewDescription] = useState("")
    const [buttonDisabled, setButtonDisabled] = useState(true)
    function verifyInputFields() {
        if (newName !== offer.kampanya_ismi)
            console.log('true')
        else if (newDescription !== offer.kampanya_açıklaması)
            console.log('true')
        else if (newValue !== offer.değeri)
            console.log('true')
        else
            console.log('false')
    }
    useEffect(() => {
        setButtonDisabled(verifyInputFields())
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
                                <CInput defaultValue= {offer?.değeri} onChange = {(e) => setNewValue(Number(e.target.value))} />
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
                <CButton color = "success" disabled = {buttonDisabled} >Değiştir</CButton>
                <CButton color="secondary" onClick={() => onClose(!show)}>Kapat</CButton>
            </CModalFooter>
        </CModal>
    )
}