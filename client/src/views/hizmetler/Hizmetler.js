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
import HocLoader from "../hocloader/HocLoader"
import { EditingModal, ConfirmDeleteModal } from '.';

function mapOffersData(offers) {
    return offers.map(obj => {
        return {
            kampanya_ismi: obj.name,
            kampanya_açıklaması: obj.description,
            değeri: `${obj.value}` ,
            aktif: obj.active === true ? "Evet" : "Hayır",
            offer_id: obj.offer_id,
            service_id: obj.service_id
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
    const [servicesLoading, setServicesLoading] = useState(false)
    const [servicesData, setServicesData] = useState([])
    const [selectedService, setSelectedService] = useState("0")
    const [offersLoading, setOffersLoading] = useState(false)
    const [offersData, setOffersData] = useState([])
    const [selectedOffer, setSelectedOffer] = useState({})

    const [toasters, addToaster] = useState([])

    const [confirmDeleteServiceModal, setConfirmDeleteServiceModal] = useState(false)
    const [editingModalOn, setEditingModalOn] = useState(false)

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
            setServicesData(data)
        }
        setServicesLoading(false)
    }
    useEffect(() => {
        fetchServices()
        //eslint-disable-next-line
    }, [])

    const fetchOffers = async () => {
        setOffersLoading(true)
        const res = await fetch(`/service/${selectedService}`, {
            headers: {
              'content-type': 'application/json',
              'authorization' :`Bearer ${document.cookie.slice(8)} `
            }
        })
        let data
        if (res.status === 200) {
            const fetchedData = await res.json()
            const mappedData = mapOffersData(fetchedData)
            setOffersData(mappedData)
            data = mappedData
        } else if (res.status === 406) {
            setOffersData([])
        }
        setOffersLoading(false)
        return data
    }
    useEffect(() => {
        fetchOffers()
        //eslint-disable-next-line
    }, [selectedService])

    const fetchAll = () => {
        fetchServices()
        fetchOffers()
    }

    return (
        <CRow className="d-flex justify-content-center">
        {toasters && toasters.map((toaster, i) => ( toaster.element(toaster.textObj, i)))}
        {   // EditingModal is responsible for updating an offer's details, such as name, description, value and active
            editingModalOn && 
            <EditingModal show = {editingModalOn} onClose = {setEditingModalOn} 
            offer = {selectedOffer} toasters = {toasters} triggerToaster = {addToaster} refetch = {fetchOffers} />
        }
        {
            selectedService !== "0" ?
            <ConfirmDeleteModal 
            modalOn = {confirmDeleteServiceModal} setModal = {setConfirmDeleteServiceModal} toasters = {toasters}  
            refetch = {fetchAll} serviceID = {selectedService} triggerToaster = {addToaster} />
            :
            null
        }
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
                                        <CSelect onChange = {(e) => setSelectedService( e.target.value)} >
                                            <option value = {0} ></option>
                                            {servicesData && servicesData.map((service) => (
                                                <option key = {service.service_id} value = {service.service_id}>{service.name}</option>))}
                                        </CSelect>
                                    </HocLoader>
                                </CCol>
                                <CCol>
                                    <CButton disabled = {selectedService === "0" ? true : false} color = "danger" shape = "ghost" onClick = {()=> setConfirmDeleteServiceModal(true)} >SİL</CButton>
                                </CCol>
                            </CFormGroup>
                            {/* if a service is selected, render the offers table */}
                            {
                                selectedService !== "0" ?
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
                                    : null
                            }
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