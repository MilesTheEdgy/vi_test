import React, {useReducer, useEffect} from "react";
import { CFormGroup, CCol, CTextarea, CLabel, CButton, CBadge, CCardBody } from "@coreui/react";
import { initialState, reducer } from ".";
import "./style.css"
import "./collapsed.css"
import Modal from "../../components/modals/Modal";
import { useDispatch } from "react-redux";
import { gql, useMutation } from "@apollo/client";

function CollapseMineTable({item, state, dispatch}) {
    switch (item.durum) {
        case "APPROVED":
            return (
                <table className = "table table-striped collapsedMine-table">
                    <tbody>
                        {
                        item.katılanlar && item.katılanlar.map((element, i) => {
                    return <tr key = {i} style = {{backgroundColor: state.rows[i]?.clicked? "rgba(18, 54, 216, 0.514)" : "", color: "black"}} >
                                <td>
                                    <input type="checkbox" id='joiner1' name={element.name} disabled = {state.isNotPending}
                                    onChange = {(e) => {
                                        dispatch({type: "TOGGLE_ECZANE", payload: e.target.name})
                                        dispatch({type: "HEDEF_HESAPLA_COLLAPSED_MINE", payload: item.pledge, hedef: item.hedef})
                                    }} />
                                </td>
                                <td><label><b>{element.name}</b></label></td>
                                <td><h5>{element.pledge} / {item.hedef}</h5></td>
                            </tr>
                            })
                        }
                    </tbody>
                </table>
                )
        default:
            return (
                <table className = "table table-striped collapsedMine-table">
                    <tbody>
                        {
                        item.katılanlar && item.katılanlar.map((element, i) => {
                    return <tr key = {i} style = {{backgroundColor: state.rows[i]?.clicked? "rgba(18, 54, 216, 0.514)" : "", color: "black"}} >
                                <td>
                                    <input type="checkbox" id='joiner1' name={element.name} disabled = {state.isNotPending}
                                    onChange = {(e) => {
                                        dispatch({type: "TOGGLE_ECZANE", payload: e.target.name})
                                        dispatch({type: "HEDEF_HESAPLA_COLLAPSED_MINE", payload: item.pledge, hedef: item.hedef})
                                    }} />
                                </td>
                                <td><label><b>{element.name}</b></label></td>
                                <td><h5>{element.pledge} / {item.hedef}</h5></td>
                            </tr>
                            })
                        }
                    </tbody>
                </table>
                )
        }
}

function CollapseMine ({item, refetch}) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const mainDispatch = useDispatch()
    const { modal } = state
    const REMOVE_BID = gql`
    mutation ($applicationID: ID) {
        deleteApplication(applicationID: $applicationID) {
            application_id
        }
    }
    `;
    const [removeBid] = useMutation(REMOVE_BID, {
        fetchPolicy: "no-cache",
        variables: {applicationID: item.ID},
        onError: (error) => {
            mainDispatch({type: "TOGGLE_LOADING_FALSE"})
            dispatch({type: "MODAL_DISPLAY", payload : {type: "FAILURE"}})
            console.log(error)
        },
        onCompleted: (data) => {
            console.log(data)
            refetch()
            mainDispatch({type: "TOGGLE_LOADING_FALSE"})
            dispatch({type: "MODAL_DISPLAY", payload : {type: "SUCCESS"}})
        }
    })

    const APPROVE_APPLICATION = gql`
        mutation($applicationID: ID!, $chosenJoiners: [JoinerArg]!) {
            approveApplication(applicationID: $applicationID, chosenJoiners: $chosenJoiners) {
                application_id
                specialField
            }
        }
    `;
    const [approveApplication] = useMutation(APPROVE_APPLICATION, {
        fetchPolicy: "no-cache",
        variables: {applicationID: item.ID},
        onError: (error) => {
            mainDispatch({type: "TOGGLE_LOADING_FALSE"})
            dispatch({type: "MODAL_DISPLAY", payload : {type: "FAILURE"}})
            console.log(error)
        },
        onCompleted: (data) => {
            mainDispatch({type: "TOGGLE_LOADING_FALSE"})
            mainDispatch({type: "FILL_USER_INFO", bakiye: Number(data.approveApplication.specialField)})
            dispatch({type: "MODAL_DISPLAY", payload : {type: "SUCCESS"}})
            refetch()
        }
    })

    useEffect(() => {
        if (item.katılanlar) {
            const { katılanlar } = item
            for (let i = 0 ; i < item.katılanlar.length; i++) {
                dispatch({type: "ADD_ROW", payload: {...katılanlar[i], clicked: false}})
            }
        }
        // console.log('dispatch args are: ', item.pledge, item.hedef)
        dispatch({type: "HEDEF_HESAPLA_COLLAPSED_MINE", payload: item.pledge, hedef: item.hedef})
        dispatch({type: "SET_STATUS", payload: item.durum})
        //eslint-disable-next-line
    }, [])

    return (
        <>
            <Modal on = {modal.on} header = {modal.header} body = {modal.body} color = {modal.color} dispatch = {dispatch} />
            <CCardBody style = {{backgroundColor: "rgb(69, 70, 79, 0.02)", borderTop: "1px solid grey"}} >
                <CFormGroup row>
                    <CCol xs="12" md="6">
                        <CLabel htmlFor="textarea-input">Açıklamanız:</CLabel>
                        <CTextarea 
                            name="textarea-input" 
                            id="textarea-input" 
                            rows="7"
                            value = {item.description}
                            readOnly
                        />
                        {
                            state.isOnHold &&
                            <div style = {{display: "flex", justifyContent: "space-around"}} >
                                <h5 className = ""> <CBadge color = "secondary" style = {{fontSize : "15px"}} > Hedefe kalan adet:</CBadge></h5>
                                <h4 className = {`collapsedMine-hedefeKalanH4 ${state.hedefeKalanIs0 ? "hedefeKalanIs0" : ""}`}>{state.hedefeKalanMine}</h4>
                            </div>
                        }
                    </CCol>
                    <CCol xs="12" md="6">
                        <CLabel>Katılanlar:</CLabel>
                        <CollapseMineTable item = {item} state = {state} dispatch = {dispatch}  />
                    </CCol>
                </CFormGroup>
            </CCardBody>
            {
            state.isOnHold && 
            <CFormGroup row className = "collapsedMine-footerControlButtons" id = "collapsedMine-footer">
                <CButton color = "danger" onClick = {() => {
                    mainDispatch({type: "TOGGLE_LOADING_TRUE"})
                    removeBid()
                    }} >Teklifi sil</CButton>
                <CButton disabled = {!state.hedefeKalanIs0} color = "success" onClick = {() => {
                    let selectedUsers = []
                    for (let i = 0; i < state.rows.length; i++) {
                        if (state.rows[i].clicked === true) {
                            selectedUsers.push({name: state.rows[i].name, pledge: state.rows[i].pledge})
                        }
                    }
                    approveApplication({variables: {chosenJoiners: selectedUsers}})
                    }} >Onayla</CButton>
            </CFormGroup>
            }
        </>
    )
}

export default CollapseMine