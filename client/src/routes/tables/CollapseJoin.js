import React, {useReducer, useEffect} from "react";
import { CFormGroup, CCol, CTextarea, CLabel, CButton, CInput, CBadge, CCardBody } from "@coreui/react";
import { gql, useMutation } from "@apollo/client"
import Loader from "../../hoc/loader/Loader";
import { isBelow0, initialState, reducer } from ".";
import "./style.css"
import "./collapsed.css"
import Modal from "../../components/modals/Modal";

function CollapseJoinTables ({item, state, dispatch}) {
    switch (item.durum) {
        case "APPROVED":
            return (
                <table className = "table table-striped collapsedMine-table">
                    <tbody>
                        {
                        item.katılanlar && item.katılanlar.map((element, i) => {
                    return <tr key = {i} style = {{backgroundColor: state.rows[i]?.clicked? "rgba(18, 54, 216, 0.514)" : "", color: "black"}} >
                                { state.isNotPending && element.isCurrentUser ?
                                    <td>
                                        <input type="checkbox" id='joiner1' name={element.name}
                                        onChange = {(e) => {
                                            console.log("TOGGLE ECZANE DISPATCH", e.target.name)
                                            dispatch({type: "TOGGLE_ECZANE", payload: e.target.name})
                                        }} />
                                    </td>
                                    :
                                    <td>
                                        <input type="checkbox" id='joiner1' name={element.name} disabled />
                                    </td>
                                }
                                <td><label htmlFor = "joiner1"><b>{element.name}</b></label></td>
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
                                { state.isNotPending && element.isCurrentUser ?
                                    <td>
                                        <input type="checkbox" id='joiner1' name={element.name}
                                        onChange = {(e) => {
                                            dispatch({type: "TOGGLE_ECZANE", payload: e.target.name})
                                        }} />
                                    </td>
                                    :
                                    <td>
                                        <input type="checkbox" id='joiner1' name={element.name} disabled />
                                    </td>
                                }
                                <td><label htmlFor = "joiner1"><b>{element.name}</b></label></td>
                                <td><h5>{element.pledge} / {item.hedef}</h5></td>
                            </tr>
                            })
                        }
                    </tbody>
                </table>
            )    
    }
}

function CollapseJoin ({ reduxUser, item, order, setOrder, total, bakiyeSonra, refetch}) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { modal, isLoading } = state;
    const DELETE_JOIN = gql`
        mutation($applicationID: ID) {
            deleteJoin(applicationID: $applicationID) {
                application_id
            }
        }
    `;
    const [deleteJoin] = useMutation(DELETE_JOIN, {
        fetchPolicy: "no-cache",
        variables: {applicationID: item.ID},
        onError: (err) => {
            console.log(err)
            dispatch({type: "MODAL_DISPLAY", payload: {type: "FAILURE"}})
            dispatch({type: "APPROVE_BID", payload : {type: "LOADING_OFF"}})
        },
        onCompleted: (data) => {
            console.log(data)
            dispatch({type: "MODAL_DISPLAY", payload: {type: "SUCCESS"}})
            dispatch({type: "APPROVE_BID", payload : {type: "LOADING_OFF"}})
            refetch()
        }
    })
    const JOIN_APPLICATON = gql`
        mutation($applicationID: ID!, $pledge: Int!) {
            joinApplication(applicationID: $applicationID, pledge: $pledge) {
                application_id
            }
        }
    `;
    const [joinApplication] = useMutation(JOIN_APPLICATON, {
        fetchPolicy: "no-cache",
        variables: {
            applicationID: item.ID,
            pledge: Number(order)
        },
        onError: (err) => {
            console.log(err)
            dispatch({type: "MODAL_DISPLAY", payload: {type: "FAILURE"}})
            dispatch({type: "APPROVE_BID", payload : {type: "LOADING_OFF"}})
        },
        onCompleted: (data) => {
            console.log(data)
            refetch()
            dispatch({type: "MODAL_DISPLAY", payload: {type: "SUCCESS"}})
            dispatch({type: "APPROVE_BID", payload : {type: "LOADING_OFF"}})
        }
    })

    useEffect(() => {
        if (item.katılanlar) {
            const itemCopy = JSON.parse(JSON.stringify(item));
            for (let i = 0; i < itemCopy.katılanlar.length; i++) {
                if (itemCopy.katılanlar[i].name === reduxUser) {
                    Object.assign(itemCopy.katılanlar[i], {isCurrentUser: true})
                }
                dispatch({type: "ADD_ROW", payload: {...itemCopy.katılanlar[i], clicked: false}})
            }
        }
        dispatch({type: "HEDEF_HESAPLA_COLLAPSED_JOIN", payload: item.pledge, hedef: item.hedef, ID: item.ID})
        dispatch({type: "SET_STATUS", payload: item.durum})
        //eslint-disable-next-line
    }, [item])

    return (
        <Loader isLoading = {isLoading} >
            <CCardBody id = "collapsedJoin-bodyMain">
                <Modal on = {modal.on} header = {modal.header} body = {modal.body} color = {modal.color} dispatch = {dispatch} />
                <CFormGroup row>
                    <CCol xs="12" md="6">
                        <CLabel htmlFor="textarea-input">Açıklama:</CLabel>
                        <CTextarea 
                            name="textarea-input" 
                            id="textarea-input" 
                            rows="7"
                            value = {item.description}
                            readOnly
                        />
                        {
                            state.isOnHold &&
                            <div id = "collapsedJoin-remainingGoal">
                                <h5>
                                    <CBadge color = "secondary" style = {{fontSize : "15px"}} > Hedefe kalan adet: </CBadge>
                                </h5>
                                <h4 className = {`collapsedMine-hedefeKalanH4 ${state.hedefeKalanIs0 ? "hedefeKalanIs0" : ""}`}>{state.hedefeKalanJoin}</h4>
                            </div>
                        }
                    </CCol>
                    <CCol xs="12" md="6">
                        <CLabel>Katılanlar:</CLabel>
                        <CollapseJoinTables item = {item} state = {state} dispatch = {dispatch} />
                        {
                            state.isOnHold &&
                            <div id = "collapsedJoin-inputDiv">
                                <h5 style = {{marginLeft: "15px"}} >Siz</h5>
                                <CInput id = "collapsedJoin-inputField" type="number" placeholder="örnek: 15" 
                                onChange = {e => {
                                    setOrder(e.target.value)
                                }} />
                            </div>
                        }
                    </CCol>
                </CFormGroup>
            </CCardBody>
            {
            state.isOnHold &&
            <CFormGroup row id = "collapsedJoin-footer" className = "justify-content-between" >
                <CCol md = "4">
                    <span className = "collapsedJoiner-footerInfo">
                        <CLabel>Toplam:</CLabel>
                        <p style = {{marginLeft: "10px"}}> <b> {total.toFixed(2)} TL</b></p>
                    </span>
                    <span className = "collapsedJoiner-footerInfo">
                        <CLabel>Sipraişten Sonra Bakiyeniz:</CLabel>
                        <p style = {{marginLeft: "10px", color: isBelow0(bakiyeSonra) }}>{bakiyeSonra.toFixed(2)} TL</p>
                    </span>
                </CCol>
                <CCol md = "3">
                    <CButton color = "danger" className = "btn-ghost-danger" onClick = {() => {
                        dispatch({type: "APPROVE_BID", payload : {type: "LOADING_ON"}})
                        deleteJoin()
                        }} >SIL</CButton>
                    <CButton color = "success" onClick = {() => {
                            dispatch({type: "APPROVE_BID", payload : {type: "LOADING_ON"}})
                            joinApplication()
                        }} >ONAYLA</CButton>
                </CCol>
            </CFormGroup>
            }
        </Loader>
    )
}

export default CollapseJoin