import React, { useRef, useReducer } from 'react'
import {
  CButton,
  CCol,
  CFormGroup,
  CLabel,
  CInput,
  CForm,
  CFormText,
  CTextarea,
  CInputRadio,
  CCard,
  CCardHeader,
  CCardBody,
  CInputGroup,
  CInputGroupPrepend,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import Loader from '../../hoc/loader/Loader'
import "./yeniteklif.css"
import { initialState, yeniTeklifReducer } from '.'
import { useLazyQuery, useMutation, gql } from '@apollo/client'

const UrunEkle = () => {

  const [state, dispatch] = useReducer(yeniTeklifReducer, initialState);
  const { medicineSearch, goal, pledge, unit, total, condition, conditionGoal, description, date, verifyModal } = state;

  const useFocus = () => {
    const htmlElRef = useRef(null)
    const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}
    
    return [ htmlElRef, setFocus ] 
  }

  const submitForm = async () => {
    dispatch({type: "FORM_SUBMIT_LOADING"})
    let math1 = total.input / goal.input
    let math2 = unit.input * goal.input;
    const res = await fetch('/api/bid/new', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${document.cookie.slice(11)} `
          },
          body: JSON.stringify({
            productName: medicineSearch.input,
            goal: Number(goal.input),
            pledge: Number(pledge.input),
            unitPrice: Number(math1.toFixed(2)),
            totalPrice: Number(math2.toFixed(2)),
            conditionBonus: condition.isCondition,
            conditionOnTotal: Number(conditionGoal.input1),
            conditionGiveTotal: Number(conditionGoal.input2),
            description: description.input,
            finalDate: date.input
        })
    })
    dispatch({type: "FORM_SUBMIT_LOADING"})
    if (res.status === 200) {
      dispatch({type: "SUBMIT_SUCCESS"})
      const data = await res.json()
      // console.log(data);
    } else {
      // console.log('failed')
      dispatch({type: "SUBMIT_FAIL"})
    }
  }

  const [inputRef, setInputFocus] = useFocus()
  const GET_SEARCH_LIST = gql`
    query($inputField: String!) {
      product(searchCriteria: $inputField) {
        Product_name
        Barcode
      }
    }
  `
  const [getSearchList, { loading }] = useLazyQuery(GET_SEARCH_LIST,{
    fetchPolicy: "network-only",
    onError: (err) => console.log(err),
    onCompleted: (data) => {
      console.log(data)
    }
  })
  
  const searchList = async () => {
    dispatch({type: "ISLOADING_TRUE"})
    const res = await fetch('/api/data/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${document.cookie.slice(11)} `
      },
      body: JSON.stringify({input: medicineSearch.input})
    })
    // console.log(res.status)

    if (res.status === 200) {
      const fetchData = await res.json()
      // console.log( "before splicing...", fetchData);
      if (fetchData.length > 50) {
        fetchData.splice(50)
      }
      // console.log( "...after splicing", fetchData);
      setInputFocus()
      dispatch({type: "SET_DATA", payload: fetchData})
      dispatch({type: "ISLOADING_FALSE"})
    }
     else if (res.status === 404) {
      dispatch({type: "MEDICINE_NOT_FOUND"})
      dispatch({type: "SET_MEDICINE_INPUT", payload: "ÜRÜNÜNÜZ BULUNMADI"})
    }
  }

  return (
    <>
    {
      verifyModal.isLoading ?
      <Loader />
      :
      null
    }
    <CModal 
    show={verifyModal.isInfoMissing} 
    onClose={() => dispatch({type : "VERIFY_MODAL_TOGGLE"})}
    color="danger"
    centered
    >
      <CModalHeader closeButton>
        <CModalTitle>EKSIK BİLGİ</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <h5>Lütfen eksik bilgileriniz tamamlayınız!</h5>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => dispatch({type : "VERIFY_MODAL_TOGGLE"})}>Kapat</CButton>
      </CModalFooter>
    </CModal>

    <CModal 
    show={verifyModal.isSubmitSuccess} 
    onClose={() => dispatch({type : "SUBMIT_SUCCESS"})}
    color="success"
    centered
    >
      <CModalHeader closeButton>
      </CModalHeader>
      <CModalBody>
        <h5>Talebiniz başarıyla gönderilmiştir!</h5>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => dispatch({type : "SUBMIT_SUCCESS"})}>Kapat</CButton>
      </CModalFooter>
    </CModal>

    <CModal 
    show={verifyModal.isSubmitFail} 
    onClose={() => dispatch({type : "SUBMIT_FAIL"})}
    color="danger"
    centered
    >
      <CModalHeader closeButton>
      </CModalHeader>
      <CModalBody>
        <h5>Bir hata olmuştur, lütfen daha sonra tekrar deneyin</h5>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => dispatch({type : "SUBMIT_FAIL"})}>Kapat</CButton>
      </CModalFooter>
    </CModal>

    <CCard>
        <CCardHeader>
            Talep
            <small> oluştur</small>
        </CCardHeader>
        <CCardBody>
        <CForm className="form-horizontal">
            <CFormGroup row className = "justify-content-center align-items-start" style = {{marginTop: "20px"}} > 
              <CCol md="2">
                <CLabel htmlFor="text-input" ><b> Ürün Adı</b></CLabel>
              </CCol>
              <CCol xs="12" md="6">
                <CInputGroup>
                  <CInputGroupPrepend>
                    {
                      medicineSearch.isLoading ?
                      <CButton type="button" color="primary" onClick= {getSearchList({variables: {inputField: medicineSearch.input}})} >
                        <div className="spinner-border text-danger" style = {{height : "20px", width: "20px"}} role="status">
                          <span className="sr-only">Loading...</span>
                        </div>  Ara
                     </CButton>
                      :
                      <CButton type="button" color="primary" onClick= {getSearchList({variables: {inputField: medicineSearch.input}})}><CIcon name="cil-magnifying-glass" /> Ara</CButton>
                    }
                  </CInputGroupPrepend>
                  <CInput innerRef={inputRef} value = {medicineSearch.input} placeholder= "ilaç adı verya barkodunu giriniz"
                   list = "medicine-list" invalid = {medicineSearch.invalid} valid = {medicineSearch.valid}
                   onChange = {(e) => dispatch({type: "SET_MEDICINE_INPUT", payload: e.target.value}) }/>
                </CInputGroup>
                <datalist id = "medicine-list">
                  {
                    medicineSearch.data.map((obj, i) => {
                      return <option key = {i} >{obj.medicine}--{obj.barcode} </option>
                    })
                  }
                </datalist>
                <CFormText>Almak istediğiniz ürün</CFormText>
              </CCol>
              <CCol md="2">
                <CLabel htmlFor="text-input"><b> Hedef</b></CLabel>
              </CCol>
              <CCol md="2">
                <CInput type = "number" placeholder = "60" valid = {goal.valid} invalid = {goal.invalid}
                 onChange = {(e) => dispatch({type: "SET_GOAL_INPUT", payload: e.target.value})} value = {goal.input} />
                <CFormText>Ulaşmak istediğiniz alım hedefi</CFormText>
              </CCol>
            </CFormGroup>
            <CFormGroup row className = "justify-content-end align-items-start" style = {{marginTop: "20px"}} > 
              <CCol md="2">
                <CLabel htmlFor="text-input"><b> Alımınız</b></CLabel>
              </CCol>
              <CCol md="2">
                <CInput type = "number" placeholder = "60" valid = {pledge.valid} invalid = {pledge.invalid}
                 onChange = {(e) => dispatch({type: "SET_PLEDGE_INPUT", payload: e.target.value})} value = {pledge.input} />
                <CFormText>Ulaşmak istediğiniz hedefinden yapacağınız alım</CFormText>
              </CCol>
            </CFormGroup>

            <div className = "splitterBorder"></div>

            <CFormGroup row className = "justify-content-start align-items-start" >
              <CCol md="2">
                <CLabel><b> Depo fiyatı</b></CLabel>
              </CCol>
              <CCol md="4">
                <div className = "row">
                  <div className = "col-md-6">
                    <CLabel htmlFor="text-input">Her adet</CLabel>
                  </div>
                  <div className = "col-md-6">
                    <CInput type = "number" valid = {unit.valid} invalid = {unit.invalid} value = {unit.input}
                     onChange = {(e) => dispatch({type: "SET_UNIT_PRICE_INPUT", payload: e.target.value})} />
                    <CFormText>Birim fiyatını giriniz</CFormText>
                  </div>
                </div>
                <div className = "row">
                  <div className = "col-md-6">
                    <CLabel htmlFor="text-input" >Toplam</CLabel>
                  </div>
                  <div className = "col-md-6">
                    <CInput type = "number" valid = {total.valid} invalid = {total.invalid} value = {total.input}
                     onChange = {(e) => dispatch({type: "SET_TOTAL_PRICE_INPUT", payload: e.target.value})} />
                    <CFormText>Toplam fiyatını giriniz</CFormText>
                  </div>
                </div> 
              </CCol>
              <CCol md = "1">
              </CCol>

              <CCol md="5">
                <div className = "row">
                  <div className = "col-md-6">
                    <CLabel><b> Alım şartı</b></CLabel>
                  </div>
                  <div className = "col-md-6">
                    <CFormGroup variant="custom-radio" inline>
                      <CInputRadio custom id="inline-radio1" name="inline-radios" value="yes" valid = {condition.valid} invalid = {condition.invalid}
                       onChange = {e => dispatch({type: "IS_CONDITION", payload: e.target.value})} />
                      <CLabel variant="custom-checkbox" htmlFor="inline-radio1">Var</CLabel>
                    </CFormGroup>
                    <CFormGroup variant="custom-radio" inline>
                      <CInputRadio custom id="inline-radio2" name="inline-radios" value="no" valid = {condition.valid} invalid = {condition.invalid}
                       onChange = {e => dispatch({type: "IS_CONDITION", payload: e.target.value})} />
                      <CLabel variant="custom-checkbox" htmlFor="inline-radio2">Yok</CLabel>
                    </CFormGroup>
                  </div>
                </div>
                <div className = {`${condition.isCondition ? "" : "hidden"} row align-items-center `} >
                  <div className = "col-md-4">
                    <CLabel htmlFor="text-input"><b> Şartı</b></CLabel>
                  </div>
                  <div className = "col-md-8">
                    <div className = "conditionGoalDiv" >
                      <CInput className = "form-control conditionGoalInput" value = {conditionGoal.input1}  placeholder = "70" type = "number" valid = {conditionGoal.valid} invalid = {conditionGoal.invalid} 
                      onChange = {(e) => dispatch({type: "SET_CONDITION_GOAL_INPUT1", payload: e.target.value})} />
                      <p className = "conditionGoalPlus" >+</p>
                      <CInput className = "form-control conditionGoalInput" value = {conditionGoal.input2} placeholder = "8" type = "number" valid = {conditionGoal.valid} invalid = {conditionGoal.invalid}
                      onChange = {(e) => dispatch({type: "SET_CONDITION_GOAL_INPUT2", payload: e.target.value})} />
                    </div>
                  </div>
                </div>
              </CCol>
            </CFormGroup>
            
            <div className = "splitterBorder"></div>

            <CFormGroup row>
              <CCol md="2">
                <CLabel htmlFor="textarea-input"><b>Açıklama</b></CLabel>
              </CCol>
              <CCol xs="12" md="6">
                <CTextarea
                  name="textarea-input" 
                  id="textarea-input" 
                  rows="9"
                  placeholder="Açıklamanızı giriniz..."
                  value = {description.input}
                  onChange = {e => dispatch({type: "SET_DESCRIPTION_VALUE", payload: e.target.value})}
                  valid = {description.valid}
                  invalid = {description.invalid}
                />
              </CCol>
              <CCol xs="12" md="1">
              </CCol>
              <CCol md="3">
                <CLabel htmlFor="date-input"><b>Bitiş tarih</b></CLabel>
                <CInput type="date" id="date-input" name="date-input" valid = {date.valid} invalid = {date.invalid} value = {date.input}
                 onChange = {e => dispatch({type: "SET_DATE_INPUT", payload: e.target.value})} />
              </CCol>
            </CFormGroup>
          </CForm>
        </CCardBody>
        <CButton color="primary" onClick = {() => dispatch({type : "VERIFY_MODAL_TOGGLE"}) } >Teklif oluştur</CButton>
        

        {/* My app is receiving NaN for certain values in this modal, that's why I'm rendering it
        conditinally after user inputs all the required fields */}
        {
          verifyModal.on ? 
        <CModal 
        show={verifyModal.on} 
        onClose={() => dispatch({type : "VERIFY_MODAL_TOGGLE"})}
        color="warning"
        centered
        >
          <CModalHeader closeButton>
            <CModalTitle>Talep Özeti</CModalTitle>
          </CModalHeader>
          <CModalBody>
          <table className="table align-middle">
            <tbody>
              <tr>
                <th scope="row">Ürün Adı</th>
                <td>{medicineSearch.input}</td>
              </tr>
              <tr>
                <th scope="row">Hedef</th>
                <td>{goal.input}</td>
              </tr>
              <tr>
                <th scope="row">Alımınız</th>
                <td>{pledge.input}</td>
              </tr>
              <tr>
                <th scope="row">Depo Birim Fiyat</th>
                <td>{total.input / goal.input} TL </td>
              </tr>
              <tr>
                <th scope="row">Depo Toplam Fiyat</th>
                <td>{unit.input * goal.input} TL </td>
              </tr>
              <tr>
                <th scope="row">Alım Şart</th>
                <td>{condition.isCondition ? "VAR" : "YOK"}</td>
              </tr>
              {
                condition.isCondition ?
                <tr>
                  <th scope="row">Şart Hedefi</th>
                  <td>{conditionGoal.input1} + {conditionGoal.input2} </td>
                </tr>
                : null
              }
              <tr>
                <th scope="row">Açıklama</th>
                <td>{description.input}</td>
              </tr>
              <tr>
                <th scope="row">Bitiş Tarih</th>
                <td>{date.input}</td>
              </tr>
            </tbody>
          </table>
          </CModalBody>
          <CModalFooter>
            <CButton color="primary" onClick={() => submitForm()}>Onayla</CButton>
            <CButton color="warning" onClick={() => dispatch({type : "VERIFY_MODAL_TOGGLE"})}>İptal et</CButton>{' '}
          </CModalFooter>
        </CModal>
        :
        null
        }
    </CCard>
    </>
  )
}

export default UrunEkle
