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
  CTextarea,
  CSelect
} from '@coreui/react'
import { useEffect, useState } from 'react'

import Toaster from "../../components/toaster/Toaster2"
import HocLoader from '../hocloader/HocLoader'

const successObj = {
  color: "success",
  body: "Değişikleriniz başarıyla tamamlanmıştır!"
}

const errorObj = {
  color: "danger",
  body: "Bir hata oldu, lütfen daha sonra tekrar deneyin"
}

export function mapYears() {
    let dateArr = []
    for (let i = new Date().getFullYear(); i >= 2000; i--) {
      dateArr.push(i)
    }
    return dateArr
  }
  
export function mapMonths() {
    const firstMonth = 1
    let dateArr = []
    for (let i = 12; i >= firstMonth; i--) {
      if(i < 10){
        i = '0' + i;
      }
      dateArr.push(i)
    }
    return dateArr
  }



export function currentYear() {
    return new Date().getFullYear()
}

export function currentMonth() {
  const crntMonth = new Date().getMonth()+1
  if (crntMonth < 10)
    return '0' + crntMonth
  return crntMonth
}

export function mapGoalsData(data) {
  return data.map(obj => {
    return {
      hizmet: obj.service,
      yapılan: obj.done,
      hedef: obj.goal,
      for_date: obj.for_date,
      for_user_id: obj.for_user_id,
      goal_id: obj.goal_id,
      submit_date: obj.submit_date,
      success: obj.success
    }
  })
}

export const fields = [
  { key: 'hizmet', _style: { width: '80%'} },
  { key: 'yapılan', _style: { width: '10%'} },
  { key: 'hedef', _style: { width: '10%'} }
  // {
  //   key: 'show_details',
  //   label: '',
  //   _style: { width: '1%' },
  //   sorter: false,
  //   filter: false
  // }
]


// I 

export const AddGoal = ({ modalOn, setModal, toasters, triggerToaster, refetch, offers, serviceID }) => {
  const months = mapMonths()
  const years = mapYears()

  const [loading, setLoading] = useState(false)
  const [newOfferName, setNewOfferName] = useState("")
  const [newOfferDescription, setNewOfferDescription] = useState("")
  const [newOfferValue, setNewOfferValue] = useState(0)
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [nameFieldInvalid, setNameFieldInvalid] = useState(undefined)

  function verifyNameDoesntExist() {
      if (offers.find(obj => obj.kampanya_ismi === newOfferName)) {
          setNameFieldInvalid(true)
          return false
      }
      setNameFieldInvalid(false)
      return true
  }

  function verifyInputFields() {
      let changesArr = [false, false, false]
      if (newOfferName.trim() !== "" && verifyNameDoesntExist() !== false )
          changesArr[0] = true
      else
          changesArr[0] = false
  
      if (newOfferDescription.trim() !== "")
          changesArr[1] = true
      else
          changesArr[1] = false
      
      if (Number(newOfferValue) >= 1)
          changesArr[2] = true
      else
          changesArr[2] = false

      return changesArr
  }

  function resetInput() {
      setNewOfferName("")
      setNewOfferDescription("")
      setButtonDisabled(true)
      setNameFieldInvalid(undefined)
  }

  async function handleSubmit() {
      setLoading(true) 
      const res = await fetch(`/offer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${document.cookie.slice(8)} `
          },
          body: JSON.stringify({
            newOfferName,
            newOfferDescription,
            newOfferValue,
            forServiceID: serviceID
          })
      })
      if (res.status === 200) {
          triggerToaster([...toasters, {element: Toaster, textObj: successObj}])
          resetInput()
          setModal(false)
      } else {
          triggerToaster([...toasters, {element: Toaster, textObj: errorObj}])
      }
      setLoading(false)
      refetch()
  }

  useEffect(() => {
      const verifyFields = verifyInputFields()
      for (let i = 0; i < verifyFields.length; i++) {
          if (verifyFields[i] === false)
              return setButtonDisabled(true)
      }
      return setButtonDisabled(false)
      //eslint-disable-next-line
  }, [newOfferName, newOfferDescription, newOfferValue])
  return (
      <CModal
      size = "lg"
      show={modalOn}
      onClose={() => setModal(!modalOn)}
      color="success"
      centered
      >
          <HocLoader relative isLoading = {loading} >
              <CRow>
                  <CCol xs = "12" >
                      <CModalHeader closeButton>
                          <CModalTitle>Hedef ekle</CModalTitle>
                      </CModalHeader>
                      <CModalBody>
                          <CFormGroup row>
                              <CCol xs = "12" lg="2">
                                  <CLabel>Bayi</CLabel>
                              </CCol>
                              <CCol xs = "12" lg="5">
                                  <CSelect>
                                    <option>name here</option>
                                  </CSelect>
                              </CCol>
                              <CCol xs = "12" lg="3">
                                  <CLabel>Hedef</CLabel>
                              </CCol>
                              <CCol xs = "12" lg="">
                                  <CInput type = "number" value = {newOfferValue} onChange = {e => setNewOfferValue(e.target.value)} />
                              </CCol>
                          </CFormGroup>
                          <CFormGroup row>
                              <CCol xs = "12" lg="2">
                                  <CLabel>Kampanya açıklaması</CLabel>
                              </CCol>
                              <CCol xs = "12" lg="10">
                                <div id = "date-fields-div">
                                    <CSelect onChange = {e => setMonth(e.target.value)} >
                                        {months.map(month => <option value={month} key={month}>{month}</option>)}
                                    </CSelect>
                                    <p id = "month-year-seperator-slash" >-</p>
                                    <CSelect onChange = {e => setYear(e.target.value)} >
                                        {years.map(year => <option value={year} key={year}>{year}</option>)}
                                    </CSelect>
                                </div>
                              </CCol>
                          </CFormGroup>
                      </CModalBody>
                      <CModalFooter>
                          <CButton disabled = {buttonDisabled} color="success" onClick={handleSubmit}>Kampanya ekle</CButton>
                          <CButton color="secondary" onClick={() =>{ setModal(!modalOn); resetInput()}}>Kapat</CButton>
                      </CModalFooter>
                  </CCol>
              </CRow>
          </HocLoader>
      </CModal>
  )
}
