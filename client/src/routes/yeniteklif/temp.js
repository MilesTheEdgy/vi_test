import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
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
  CCardBody
} from '@coreui/react'
import "./yeniteklif.css"

// const dateHandeler = (e, setState, validateState) => {
//   setState(e.target.value)
//   const inputDate = new Date(e.target.value)
//   const today = new Date()
//   if (inputDate.setHours(0, 0, 0, 0) <= today.setHours(0, 0, 0, 0)) {
//     validateState({invalid: true})
//   } else {
//     validateState({valid: true})
//   }
  
// }

// const aciklamaHandler = (e, setState, validateState) => {
//   const value = e.target.value;
//   setState(value)
//   if (value !== "") {
//     validateState({valid: true})
//   } else {
//     validateState({invalid: true})
//   }
// }

// const toplamAlimSartInput = async (e, setToplamVal, adetValue, validateInputs) => {
//   const value = e.target.value;
//   await setToplamVal(value);
//   if (value > 0 && adetValue > 0) {
//     validateInputs({valid: true})
//   } else {
//     validateInputs({invalid: true})
//   }
// }

// const adetAlımSartInput = async (e, setAdetVal, toplamValue, validateInputs) => {
//   const value = e.target.value;
//   await setAdetVal(value);
//   if (value > 0 && toplamValue > 0) {
//     validateInputs({valid: true})
//   } else {
//     validateInputs({invalid: true})
//   }
// }

// const alimSartRadio = (e, validateInput, displaySartState) => {
//   const value = e.target.value
//   if (value === "yes") {
//     displaySartState(true)
//     validateInput({valid: true})
//   } else if (value === "no") {
//     displaySartState(false)
//     validateInput({valid: true})
//   } else {
//     validateInput({invalid: true})
//   }
// }

// const toplamFiyatFunc = (e, hedef, setToplamState, setAdetState) => {
//   const value = e.target.value;
//   setToplamState(value);
//   if (hedef) {
//     let res = value / hedef
//     setAdetState(res.toFixed(2))
//   }
// }

// const adetFiyatFunc = async (e, hedef, setAdetState, setToplamState) => {
//   const value = e.target.value;
//   await setAdetState(value)
//   await setToplamState(hedef * value)
// }

// const validateUrunAdi = (e, valState, setState, data) => {
//   const input = e.target.value.toLowerCase()
//   setState(input)
//   for (let i = 0; i < data.length; i++) {
//     if(input === data[i].İlaç.toLowerCase()) {
//       return valState({valid: true})
//     }
//   }
//   valState({invalid: true})
// }

// const validateHedefInput = (e, valState, setState, setAdetState, toplamState) => {
//     const input = e.target.value
//     setState(input)
//     if (toplamState > 0) {
//       let res = input / toplamState
//       setAdetState(res.toFixed(2))
//     }
//     if (input > 0) {
//       return valState({valid: true})
//     } else {
//       return valState({invalid: true})     
//     }
//   }
const UrunEkle = () => {

  const medicineList = useSelector(state => state.medicineList)
  const [filteredState, setFilteredState] = useState([])

    const medicineDataListHandeler = (input) => {
      const listCopy = [...medicineList]
      console.log('our list copy is: ', listCopy)
      if (listCopy.length > 30) {
        console.log('list copy is greater than 10, splicing...')
        listCopy.splice(30)
        const input = input
          console.log('spliced list copy is: ', listCopy)
        }
      setFilteredState(listCopy)
    }
        
        // console.log('mapping list copy...')
      //}
    
      // const submitHandeler = () => {
      //   const formValid = sartRadio?
      //   [urunAdiValid, hedefValid, adetFiyatValid, toplamFiyatValid, alimSartValid, sartValid, aciklamaValid, dateValid]
      //   :
      //   [urunAdiValid, hedefValid, adetFiyatValid, toplamFiyatValid, alimSartValid, aciklamaValid, dateValid]
      //   let formValidArr = []
      //   for (let i = 0; i < formValid.length; i++) {
      //     formValidArr[i] = Object.keys(formValid[i])
      //   }
      //   for (let i = 0; i < formValidArr.length; i++) {
      //     if (formValidArr[i].indexOf('invalid') >= 0) {
      //       return alert('found missing info: ', formValidArr[i])
      //     }
      //   }
      //   alert('all good!: ')
      // }
    
      // const [sartRadio, setSartRadio] = useState(false)
      // const [urunAdiValid, setUrunAdiValid] = useState({invalid: true})
      // const [urunAdi, setUrunAdi] = useState("")
      // const [hedefValid, setHedefValid] = useState({invalid: true})
      // const [hedef, setHedef] = useState(0)
      // const [adetFiyat, setAdetFiyat] = useState(0)
      // const [adetFiyatValid, setAdetFiyatValid] = useState({invalid: true})
      // const [toplamFiyat, setToplamFiyat] = useState(0)
      // const [toplamFiyatValid, setToplamFiyatValid] = useState({invalid: true})
      // const [alimSartValid, setAlimSartValid] = useState({invalid: true})
      // const [sartToplam, setSartToplam] = useState(0)
      // const [sartAdet, setSartAdet] = useState(0)
      // const [sartValid, setSartValid] = useState({invalid: true})
      // const [aciklama, setAciklama] = useState("")
      // const [aciklamaValid, setAciklamaValid] = useState({invalid: true})
      // const [date, setDate] = useState("")
      // const [dateValid, setDateValid] = useState({invalid: true})
      
      
      // const dispatch = useDispatch()
    
      // useEffect(() => {
      //   if (adetFiyat > 0 && toplamFiyat > 0) {
      //     setAdetFiyatValid({valid: true})
      //     setToplamFiyatValid({valid: true})
      //   }
      // }, [adetFiyat, toplamFiyat])

      const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
      ]
 
  return (
    <>
    <CCard>
        <CCardHeader>
            Ürün
            <small> ekle</small>
        </CCardHeader>
        <CCardBody>
        <CForm className="form-horizontal">
            <CFormGroup row className = "justify-content-center align-items-start" style = {{marginTop: "20px"}} > 
              <CCol md="2">
                <CLabel htmlFor="text-input" ><b> Ürün Adı</b></CLabel>
              </CCol>
              <CCol xs="12" md="6">
                <CInput list = "medicine-list" placeholder="İlaç ismini giriniz" onChange = {(e) => medicineDataListHandeler(e)} />
                <datalist id = "medicine-list">
                  {
                    filteredState.map((obj, i) => {
                      return <option key = {i}>{obj.İlaç}</option>
                    })
                  }
                </datalist>
                <CFormText>Almak istediğiniz ürün</CFormText>
              </CCol>
              <CCol md="2">
                <CLabel htmlFor="text-input"><b> Hedef</b></CLabel>
              </CCol>
              <CCol md="2">
                <CInput type = "number"/>
                <CFormText>Ulaşmak istediğiniz alım hedefi</CFormText>
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
                    <CInput />
                    <CFormText>Birim fiyatını giriniz</CFormText>
                  </div>
                </div>
                <div className = "row">
                  <div className = "col-md-6">
                    <CLabel htmlFor="text-input" >Toplam</CLabel>
                  </div>
                  <div className = "col-md-6">
                    <CInput />
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
                      <CInputRadio custom id="inline-radio1" name="inline-radios" value="yes" />
                      <CLabel variant="custom-checkbox" htmlFor="inline-radio1">Var</CLabel>
                    </CFormGroup>
                    <CFormGroup variant="custom-radio" inline>
                      <CInputRadio custom id="inline-radio2" name="inline-radios" value="no" />
                      <CLabel variant="custom-checkbox" htmlFor="inline-radio2">Yok</CLabel>
                    </CFormGroup>
                  </div>
                </div>
                <div className = "row align-items-center">
                  <div className = "col-md-4">
                    <CLabel htmlFor="text-input"><b> Şartı</b></CLabel>
                  </div>
                  <div className = "col-md-8">
                    <div style = {{display: "flex", alignItems: "center"}} >
                      <CInput style = {{maxWidth : "100px ", maxHeight: "35px"}} className = "form-control" placeholder = "70" type = "number" />
                      <p style = {{fontSize : "25px", marginTop: "15px"}} >+</p>
                      <CInput style = {{maxWidth : "100px", maxHeight: "35px"}} className = "form-control" placeholder = "8" type = "number" />
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
                />
              </CCol>
              <CCol xs="12" md="1">
              </CCol>
              <CCol md="3">
                <CLabel htmlFor="date-input"><b>Bitiş tarih</b></CLabel>
                <CInput type="date" id="date-input" name="date-input" />
              </CCol>
            </CFormGroup>
          </CForm>
        </CCardBody>
        <CButton color="primary">Teklif oluştur</CButton>
    </CCard>
    </>
  )
}

export default UrunEkle
