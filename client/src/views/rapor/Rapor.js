import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import qs from "qs"
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
import { getBadge, mapDataToTurkish } from '../../components'
import { switchRaporHeader } from "."

const RaporOnaylanan = ({match, location}) => {
  const history = useHistory()
  const queryPage = useLocation().search.match(/sayfa=([0-9]+)/, '')
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
  const [page, setPage] = useState(currentPage)
  const [usersData, setUsersData] = useState(undefined)
  const qsQuery = qs.parse(location.search)

  const pageChange = newPage => {
    currentPage !== newPage && history.push(`/basvuru/takip?sayfa=${newPage}`)
  }

  useEffect(() => {
    currentPage !== page && setPage(currentPage)
    const fetchData = async () => {
      const res = await fetch(`http://localhost:8080/bayi/applications?status=${qsQuery["?status"]}`, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'authorization' :`Bearer ${document.cookie.slice(8)} `
        }
      })
      if (res.status === 200) {
        const fetchData = await res.json()
        const mappedData = mapDataToTurkish(fetchData)
        setUsersData(mappedData)
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, [qsQuery["?status"]])

  return (
    <CRow className = "d-flex justify-content-center">
      <CCol xl={10}>
      {
        usersData ? 
        <CCard>
          <CCardHeader>
            Raporunuz
            <small className="text-muted"> {switchRaporHeader(qsQuery["?status"])} işlemler</small>
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
                onRowClick={(item) => history.push(`/islem/${item.ID}`)}
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
