import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CCollapse,
  CFormGroup,
  CTextarea,
  CInput,
  CLabel,
  CAlert,
  CDataTable
} from '@coreui/react'

import "./urunekle.css"
import { useSelector, useDispatch } from 'react-redux'

const UrunEkle = () => {
    const dispatch = useDispatch()
    // const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [details, setDetails] = useState([])
    const [form, showForm] = useState(false)
    const [newProduct, setNewProduct] = useState("")
    const [newDescription, setNewDescription] = useState("")
    // const eczName = useSelector(state => state.user.userSettings.eczaneName)
    const medicineList = useSelector(state => state.medicineList)

    const submitProduct = async () => {
        const res = await fetch(`/api/data/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${document.cookie.slice(11)} `
            },
            body: JSON.stringify({
                product: newProduct,
                // added_by: eczName,
                description: newDescription
            })
        })
        if (res.status === 200) {
            const fetchData = await res.json()
            // console.log(fetchData);
        }

    }
  
    const toggleDetails = (index) => {
      const position = details.indexOf(index)
      let newDetails = details.slice()
      if (position !== -1) {
        newDetails.splice(position, 1)
      } else {
        newDetails = [...details, index]
      }
      setDetails(newDetails)
    }

    const fields = [
        'İlaç',
        'barKod',
        'ATC_Kodu',
        'reçeteTürü'
     ]
    
    useEffect(() => {
        const fetchData = async () => {
            dispatch({type: "TOGGLE_LOADING_TRUE"})
            const res = await fetch(`/api/data/products`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'authorization': `Bearer ${document.cookie.slice(11)} `
                }
              })
            if (res.status === 200) {
                const resData = await res.json()
                // console.log('URUN EKLE resData is: ', resData)
                const arr = resData.map(obj => {
                    return { İlaç: obj.medicine, barKod: obj.barcode, ATC_Kodu: obj.ATC_code , reçeteTürü: obj.prescription_type }
                })
                // setData(arr)
                dispatch({type: "FILL_MEDICINE_LIST", medicineList: arr})
            }
            dispatch({type: "TOGGLE_LOADING_FALSE"})
        }
        fetchData()
    }, [dispatch])

  return (
    <>
        <CCard>
            <CCardHeader>
                Ürün
                <small> ekle</small>
            </CCardHeader>
            <CCardBody>
            {/* <CAlert color="danger">
                Lütfen yeni bir ürün eklemeden, önce ÜRÜN SORGULAMA yaparak ürünün eklenmiş durumunu öğrenin.
            </CAlert> */}
            <CLabel>ÜRÜN SORGULAMA</CLabel>
            <CDataTable
                tableFilter
                items={medicineList}
                fields={fields}
                itemsPerPage={15}
                pagination
                scopedSlots = {{
                    'show_details':
                        (item, index)=>{
                        return (
                            <td className="py-2">
                            <CButton
                                color="primary"
                                variant="outline"
                                shape="square"
                                size="sm"
                                onClick={()=>{toggleDetails(index)}}
                            >
                                {details.includes(index) ? 'Sakla' : 'Açıklama'}
                            </CButton>
                            </td>
                            )
                        },
                    'details':
                        (item, index)=>{
                            return (
                            <CCollapse show={details.includes(index)}>
                                <CCardBody>
                                    <b>{item.description}</b>
                                </CCardBody>
                            </CCollapse>
                            )
                        }
                    }}
            />
            {/* <CButton color = "warning" onClick = {() => showForm(true)} >Ürününz bulunmadı mı?</CButton> */}

            <div className = {`${form ? "" : "hidden"}`}>
                <div className = "split-margin"></div>
                <CFormGroup row>
                    <CCol md = "6">
                        <CLabel htmlFor="company">Ürün</CLabel>
                        <CInput id="company" placeholder="Eklemek istediğiniz ürünü yazın" onChange = {(e) => setNewProduct(e.target.value)}/>
                    </CCol>
                    <CCol md = "6">
                        <CLabel htmlFor="vat">Açıklama</CLabel>
                        <CTextarea 
                            name="textarea-input" 
                            id="textarea-input" 
                            rows="6"
                            placeholder="Eklemek istediğiniz ürünün hakkında kısa bir açıklama yazın..." 
                            onChange = {(e) => setNewDescription(e.target.value)}
                        />
                    </CCol>
                </CFormGroup>
                <CFormGroup row>
                    <CCol md = "1" className = "ml-auto justify-content-end" >
                        <CButton color = "success" onClick = {() => submitProduct()} >Onayla</CButton>
                    </CCol>
                </CFormGroup>
            </div>
            </CCardBody>
        </CCard>
    </>
  )
}

export default UrunEkle
