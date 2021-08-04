import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCollapse,
  CLabel,
  CDataTable
} from '@coreui/react'

import { gql, useQuery } from '@apollo/client'

import "./urunekle.css"
import { useSelector, useDispatch } from 'react-redux'

const UrunEkle = () => {
    const dispatch = useDispatch()
    const [details, setDetails] = useState([])
    const [input, setInput] = useState("mo")
    const medicineList = useSelector(state => state.medicineList)

    const GET_SEARCH_LIST = gql`
        query($inputField: String!) {
        product(searchCriteria: $inputField) {
            Product_name
            Barcode
            ATC_code
            type
            }
        }
    `
    const { loading } = useQuery(GET_SEARCH_LIST,{
        fetchPolicy: "network-only",
        variables: {
            inputField: input
        },
        pollInterval: 1500,
        onError: (err) => {
            console.log(err)
        },
        onCompleted: (data) => {
            console.log(data)
            const dataCopy = JSON.parse(JSON.stringify(data))
            const arr = dataCopy.product.map(obj => {
                return { İlaç: obj.Product_name, barKod: obj.Barcode, ATC_Kodu: obj.ATC_code , reçeteTürü: obj.type }
            })
            dispatch({type: "FILL_MEDICINE_LIST", medicineList: arr})
        }
    })
  
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

  return (
    <>
        <CCard>
            <CCardHeader>
                Ürün
                <small> ekle</small>
            </CCardHeader>
            <CCardBody>
            <CLabel>ÜRÜN SORGULAMA</CLabel>
            <CDataTable
                onTableFilterChange = {(e) => {
                    if (e === undefined || e === "") return
                    setInput(e)
                }}
                loading = {loading}
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
            </CCardBody>
        </CCard>
    </>
  )
}

export default UrunEkle
