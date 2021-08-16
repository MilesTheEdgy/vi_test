import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CPagination
} from '@coreui/react'
import "./style.css"

const SdcKullanicilar = () => {
  const history = useHistory()
  const queryPage = useLocation().search.match(/sayfa=([0-9]+)/, '')
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
  const [page, setPage] = useState(currentPage)
  const [usersData, setUsersData] = useState(undefined)

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
        const mappedData = fetchData.map(obj => {
          let rawDate = new Date(obj.register_date)
          let date = rawDate.toISOString().slice(0, 10)
          let role = ""
          switch (obj.role) {
            case "admin":
              role = "Admin"
              break;
            case "dealer":
              role = "Bayi"
              break
            case "sales_assistant":
              role = "Satış Destek"
              break
            case "sales_assistant_chef":
              role = "Satış Destek Şefi"
              break
            default:
              break;
          }
          return {
              ID: obj.id,
              Kullanıcı: obj.username,
              Röl: role,
              Kayıt_tarihi: date,
              actif: obj.active ? "Evet" : "Hayır"
            }
        })
        setUsersData(mappedData)
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
                itemsPerPage={30}
                activePage={page}
                clickableRows
                onRowClick={(user) => history.push(`/sdc/kullanici/${user.ID}`)}
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
