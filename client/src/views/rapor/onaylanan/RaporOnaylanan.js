import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CPagination,
  CModal,
  CModalTitle,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CButton,
  CFormGroup,
  CLabel,
  CInput,
  CTextarea
} from '@coreui/react'

const getBadge = (status)=>{
  switch (status) {
     case 'Onaylandı': return 'success'
     case 'İşleniyor': return 'warning'
     case 'İptal': return 'danger'
     case 'Gönderildi': return 'secondary'
     default: return 'primary'
  }
}


function Modal(props) {
  const { userDetails } = props
  const renderTextArea = (details) => {
    if (details?.submitProcessNum === 2) {
      return (
          <CFormGroup row>
            <CCol>
              <CLabel>Bayi Açıklama</CLabel>
              <CTextarea 
                rows="8"
                placeholder={userDetails?.Açıklama}
                readOnly
              />
            </CCol>
            <CCol>
              <CLabel>Satış Desteğin Notları</CLabel>
              <CTextarea
                rows="8"
                placeholder={userDetails?.salesRepDetails}
                readOnly
              />
            </CCol>
          </CFormGroup>
      )
    }
    else if (details?.submitProcessNum === 3) {
      return (
        <CFormGroup>
        <CLabel>Sizin Notlarınız</CLabel>
        <CTextarea 
          rows="4"
          placeholder={userDetails?.Açıklama}
          readOnly
        />
      </CFormGroup>
      )
    } else {
      return (
        <CFormGroup>
          <CLabel>Sizin Notlarınız</CLabel>
          <CTextarea 
            rows="4"
            placeholder={userDetails?.Açıklama}
            readOnly
          />
        </CFormGroup>
      )
    }
  }
  return (
        <CModal 
        size = "lg"
        show={props.show}
        onClose={() => props.onClose(!props.show)}
        centered
        >
            <CModalHeader closeButton>
                <CModalTitle> Başvuru Detayı </CModalTitle>
            </CModalHeader>
            <CModalBody>
            <CRow className = "justify-content-center align-items-center">
              <CCol xs="12" sm="11">
                <CFormGroup row className="my-0">
                  <CCol xs="2">
                    <CFormGroup>
                      <CLabel>ID</CLabel>
                      <CInput placeholder= {userDetails?.ID} readOnly />
                    </CFormGroup>
                  </CCol>
                  <CCol xs="10">
                    <CFormGroup>
                      <CLabel>İsim</CLabel>
                      <CInput placeholder={userDetails?.İsim} readOnly />
                    </CFormGroup>
                  </CCol>
                </CFormGroup>
                <CFormGroup row className="my-0">
                  <CCol xs="3">
                    <CFormGroup>
                      <CLabel>Tarih</CLabel>
                      <CInput placeholder= {userDetails?.Tarih} readOnly />
                    </CFormGroup>
                  </CCol>
                  <CCol xs="2"> 
                    <CFormGroup>
                      <CLabel>Hizmet</CLabel>
                      <CInput placeholder={userDetails?.Tip} readOnly />
                    </CFormGroup>
                  </CCol>
                  <CCol xs="7">
                    <CFormGroup>
                      <CLabel>Kampanya</CLabel>
                      <CInput placeholder={userDetails?.Kampanya} readOnly />
                    </CFormGroup>
                  </CCol>
                </CFormGroup>
                {renderTextArea(userDetails)}
                <CFormGroup>
                  <CLabel>Satış Desteğin Son Notları</CLabel>
                    <CTextarea 
                      rows="6"
                      placeholder={userDetails?.finalSalesRepDetails}
                      readOnly
                    />
                </CFormGroup>
              </CCol>
            </CRow>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => props.onClose(!props.show)}>Kapat</CButton>
            </CModalFooter>
        </CModal>
    )
}

const RaporOnaylanan = () => {
  const history = useHistory()
  const queryPage = useLocation().search.match(/sayfa=([0-9]+)/, '')
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
  const [page, setPage] = useState(currentPage)
  const [usersData, setUsersData] = useState(undefined)
  const [modal, setModal] = useState(false)
  const [modalData, setModalData] = useState({})

  const pageChange = newPage => {
    currentPage !== newPage && history.push(`/basvuru/takip?sayfa=${newPage}`)
  }

  useEffect(() => {
    currentPage !== page && setPage(currentPage)
    const getData = async () => {
      const res = await fetch("http://localhost:8080/bayi/rapor/onaylanan", {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'authorization' :`Bearer ${document.cookie.slice(8)} `
        }
      })
      if (res.status === 200) {
        const fetchData = await res.json()
        console.log(fetchData)
        const resData = fetchData.map(obj => {
          const { finalSalesRepDetails, lastChangeDate, salesRepDetails, statusChangeDate } = obj
          let submitProcessNum = 0
          if (obj.status === "Onaylandı" || obj.status === "İptal")
            submitProcessNum = 3
          else if (obj.status === "İşleniyor")
            submitProcessNum = 2
          else
            submitProcessNum = 1
          return {
              ID: obj.id,
              İsim: obj.name,
              Tarih: obj.date,
              Tip: obj.service,
              Kampanya: obj.offer,
              Açıklama: obj.description,
              Statü: obj.status,
              finalSalesRepDetails,
              lastChangeDate,
              salesRepDetails,
              statusChangeDate,
              submitProcessNum
            }
        })
        setUsersData(resData)
      }
    };
    getData();
  }, [currentPage, page])

  return (
    <CRow className = "d-flex justify-content-center">
      <Modal show = {modal} userDetails = {modalData} onClose = {setModal} />
      <CCol xl={10}>
      {
        usersData ? 
        <CCard>
          <CCardHeader>
            Raporunuz
            <small className="text-muted"> onaylanan işlemler</small>
          </CCardHeader>
          <CCardBody>
            <CDataTable
                sorter
                items={usersData}
                fields={[
                { key: 'İsim', _classes: 'font-weight-bold' },
                'Tarih', 'Tip', 'Statü'
                ]}
                tableFilter
                hover
                striped
                itemsPerPage={30}
                activePage={page}
                clickableRows
                onRowClick={(item) => { setModal(true); setModalData(item)}}
                scopedSlots = {{
                'Statü':
                    (item)=>(
                    <td>
                        <CBadge color={getBadge(item.Statü)}> 
                        {item.Statü}
                        </CBadge>
                    </td>
                    )
                }}
            />
            <CPagination
                activePage={page}
                onActivePageChange={pageChange}
                pages={15}
                doubleArrows={false} 
                align="center"
            />
          </CCardBody>
        </CCard>
        :
        <h1>loading</h1>
      }

      </CCol>
    </CRow>
  )
}

export default RaporOnaylanan;
