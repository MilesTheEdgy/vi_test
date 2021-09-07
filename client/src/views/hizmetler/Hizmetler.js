import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormGroup,
  CLabel,
  CSelect,
  CRow,
  CDataTable,
  CButton
} from '@coreui/react';
import Modal from "../../components/modals/Modal"
import HocLoader from "../hocloader/HocLoader"
import { EditingModal } from '.';

function mapOffersData(offers) {
    return offers.map(obj => {
        return {
            kampanya_ismi: obj.name,
            kampanya_açıklaması: obj.description,
            değeri: `${obj.value}` ,
            aktif: obj.active === true ? "Evet" : "Hayır"
        }
    })
} 

const fields = [
    { key: 'kampanya_ismi', _style: { width: '20%'} },
    { key: 'kampanya_açıklaması', _style: { width: '20%'} },
    { key: 'aktif', _style: { width: '20%'} },
    { key: "değeri", _style: {width: '15%'}},
    {
      key: 'show_details',
      label: '',
      _style: { width: '1%' },
      sorter: false,
      filter: false
    }
  ]

const Hizmetler = () => {
    const toasters = []
    const [servicesLoading, setServicesLoading] = useState(false)
    const [servicesData, setServicesData] = useState([])
    const [selectedService, setSelectedService] = useState(0)

    const [offersLoading, setOffersLoading] = useState(false)
    const [offersData, setOffersData] = useState([])
    const [selectedOffer, setSelectedOffer] = useState({})

    const [editingModalOn, setEditingModalOn] = useState(false)

    useEffect(() => {
        const fetchServices = async () => {
            setServicesLoading(true)
            const res = await fetch("/services", {
                headers: {
                  'content-type': 'application/json',
                  'authorization' :`Bearer ${document.cookie.slice(8)} `
                }
            })
            if (res.status === 200) {
                const data = await res.json()
                console.log('data ', data)
                setServicesData(data)
            }
            setServicesLoading(false)
        }
        fetchServices()
    }, [])

    useEffect(() => {
        const fetchOffers = async () => {
            setOffersLoading(true)
            const res = await fetch(`/service/${selectedService}`, {
                headers: {
                  'content-type': 'application/json',
                  'authorization' :`Bearer ${document.cookie.slice(8)} `
                }
            })
            if (res.status === 200) {
                const data = await res.json()
                console.log(data)
                const mappedData = mapOffersData(data)
                setOffersData(mappedData)
            }
            setOffersLoading(false)
        }
        fetchOffers()
    }, [selectedService])

    return (
        <CRow className="d-flex justify-content-center">
        {/* I'm mapping the toasters from toasters array, each element is an object, object has: element, textObj, and 
            for every element in the array I'm calling the element's "element", which is a function that returns a react
            element, and giving it "textObj" as props, and passing index as second argument. */}
        {toasters && toasters.map((toaster, i) => ( toaster.element(toaster.textObj, i)))}
        {editingModalOn && <EditingModal show = {editingModalOn} onClose = {setEditingModalOn} offer = {selectedOffer} />}
            <CCol xs="12" md="12">
                <CCard>
                    <CCardHeader className="basvuruFormHeader">
                        Hizmetler
                    </CCardHeader>
                    <CCardBody>
                            <CFormGroup row >
                                <CCol xs = "12" md = "1" >
                                    <CLabel>Hizmet seçiniz:</CLabel>
                                </CCol>
                                <CCol xs = "12" md = "2">
                                    <HocLoader isLoading = {servicesLoading} relative>
                                        <CSelect onChange = {(e) => setSelectedService(e.target.value)} >
                                            <option></option>
                                            {servicesData && servicesData.map((service) => (
                                                <option key = {service.service_id} value = {service.service_id}>{service.name}</option>))}
                                        </CSelect>
                                    </HocLoader>
                                </CCol>
                            </CFormGroup>
                        <CDataTable
                            items={offersData}
                            fields={fields}
                            loading = {offersLoading}
                            hover
                            // clickableRows
                            // onRowClick={(item) => { setModal(true); setModalData(item)}}
                            scopedSlots = {{
                            'değeri':
                                (item)=>(
                                <td>
                                    <p style = {{color: "green"}} >{item.değeri} TL</p>
                                </td>
                                ),
                                'show_details':
                                (item, index)=>{
                                    return (
                                    <td className="py-2">
                                        <CButton
                                            color="primary"
                                            variant="outline"
                                            shape="square"
                                            size="sm"
                                            onClick={() => {setSelectedOffer(item); setEditingModalOn(true)}}
                                        >
                                            Değiştir
                                        </CButton>
                                    </td>
                                    )
                                }
                            }}
                        />
                    </CCardBody>
                    {/* <CCardFooter>
                        <CButton type="submit" size="sm" color="primary" onClick={onSubmit} disabled = {inputFieldsNotEmpty} ><CIcon name="cil-scrubber" /> Gönder</CButton>
                        <CButton type="reset" size="sm" color="danger" onClick={resetInput}  ><CIcon name="cil-ban" /> Resetle</CButton>
                    </CCardFooter> */}
                </CCard>
            </CCol>
        </CRow>
    )
}


export default React.memo(Hizmetler)