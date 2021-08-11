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
import { useDispatch } from 'react-redux'

const getBadge = (status)=>{
  switch (status) {
     case 'Onaylandı': return 'success'
     case 'İşleniyor': return 'warning'
     case 'İptal': return 'danger'
     case 'Gönderildi': return 'secondary'
     default: return 'primary'
  }
}

const SdcKullanicilar = () => {
  const history = useHistory()
  const queryPage = useLocation().search.match(/sayfa=([0-9]+)/, '')
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
  const [page, setPage] = useState(currentPage)
  const [usersData, setUsersData] = useState(undefined)
  const dispatch = useDispatch()

  const pageChange = newPage => {
    currentPage !== newPage && history.push(`/sdc/kullanicilar?sayfa=${newPage}`)
  }

  useEffect(() => {
    currentPage !== page && setPage(currentPage)
    const getData = async () => {
      const res = await fetch("http://localhost:8080/sdc/users", {
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
          let role = ""
          switch (obj.role) {
            case "admin":
              role = "Admin"
              break;
            case "bayi":
              role = "Bayi"
              break
            case "sales_assistant":
              role = "Satış Destek"
            case "sales_assistant_chef":
              role = "Satış Destek Şefi"
            default:
              break;
          }
          return {
              ID: obj.id,
              Kullanıcı: obj.username,
              Röl: role
            }
        })
        setUsersData(resData)
        dispatch({type: "FILL_SDC_USERS_DATA", payload: resData})
      }
    };
    getData();
  }, [currentPage, page])

  return (
    <CRow className = "d-flex justify-content-center">
      <CCol xl={10}>
        <CCard>
          <CCardHeader>
            Başvurularınız
          </CCardHeader>
          <CCardBody>
            <CDataTable
                items={usersData}
                hover
                striped
                itemsPerPage={30}
                activePage={page}
                clickableRows
                onRowClick={(item) => history.push(`/sdc/kullanici/${item.ID}`)}
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
      </CCol>
    </CRow>
  )
}

export default SdcKullanicilar;
