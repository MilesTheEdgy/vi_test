import React from "react";
import { CModal, CModalHeader, CModalTitle, CModalFooter, CModalBody, CButton } from "@coreui/react"

function Modal(props) {
    if (props.dispatch) {
        return (
            <CModal 
            show={props.on} 
            onClose={() => props.dispatch({type : "MODAL_DISPLAY", payload: {type: "CLOSE"}})}
            color={props.color}
            centered
            >
                <CModalHeader closeButton>
                    <CModalTitle> {props.header} </CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <h5>{props.body}</h5>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => props.dispatch({type : "MODAL_DISPLAY", payload: {type: "CLOSE"}})}>Kapat</CButton>
                </CModalFooter>
            </CModal>
        )
    } else {
        return (
            <CModal 
            show={props.modalclose}
            onClose={() => props.modalclose}
            color={props.color}
            centered
            >
                <CModalHeader closeButton>
                    <CModalTitle> {props.header} </CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <h5>{props.body}</h5>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => props.modalclose}>Kapat</CButton>
                </CModalFooter>
            </CModal>
        )
    }
}

export default Modal