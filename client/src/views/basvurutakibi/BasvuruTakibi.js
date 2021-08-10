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
  CPagination
} from '@coreui/react'

const getBadge = status => {
  switch (status) {
    case 'Tamamlandı': return 'success'
    case 'Beklemede': return 'warning'
    case 'İptal': return 'danger'
    case 'Gönderildi': return 'secondary'
    default: return 'primary'
  }
}

const BasvuruTakibi = () => {
  const history = useHistory()
  const queryPage = useLocation().search.match(/page=([0-9]+)/, '')
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
  const [page, setPage] = useState(currentPage)
  const [usersData, setUsersData] = useState(undefined)

  const pageChange = newPage => {
    currentPage !== newPage && history.push(`/basvurular/takip?sayfa=${newPage}`)
  }

  useEffect(() => {
    const getData = async () => {
        const res = await fetch("http://localhost:8080/bayi/basvuru/takip", {
            headers: {
            'content-type': 'application/json',
            'authorization' :`Bearer ${document.cookie.slice(8)} `
            }
        });
        if (res.status === 200) {
            const data = await res.json();
            console.log(data);
            setUsersData(data)
        }
    };
    getData();
    currentPage !== page && setPage(currentPage)
  }, [currentPage, page])

  return (
    <CRow className = "d-flex justify-content-center">
      <CCol xl={10}>
      {
        usersData ? 
        <CCard>
          <CCardHeader>
            Users
            <small className="text-muted"> example</small>
          </CCardHeader>
          <CCardBody>
            <CDataTable
                items={usersData}
                fields={[
                { key: 'İsim', _classes: 'font-weight-bold' },
                'Tarih', 'Tip', 'Statü'
                ]}
                hover
                striped
                itemsPerPage={30}
                activePage={page}
                clickableRows
                // onRowClick={(item) => history.push(`/users/${item.id}`)}
                onRowClick={() => console.log(usersData) }

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

export default BasvuruTakibi;
