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

import Loader from '../loader/Loader'

// const usersData = [
//     {id: 0, İsim: 'John Doe', Tarih: '2018/01/01', Tip: 'Guest', Statü: 'Beklemede'},
//     {id: 1, İsim: 'Samppa Nori', Tarih: '2018/01/01', Tip: 'Member', Statü: 'Tamamlandı'},
//     {id: 2, İsim: 'Estavan Lykos', Tarih: '2018/02/01', Tip: 'Staff', Statü: 'Banned'},
//     {id: 3, İsim: 'Chetan Mohamed', Tarih: '2018/02/01', Tip: 'Admin', Statü: 'Tamamlandı'},
//     {id: 4, İsim: 'Derick Maximinus', Tarih: '2018/03/01', Tip: 'Member', Statü: 'Beklemede'},
//     {id: 5, İsim: 'Friderik Dávid', Tarih: '2018/01/21', Tip: 'Staff', Statü: 'Tamamlandı'},
//     {id: 6, İsim: 'Yiorgos Avraamu', Tarih: '2018/01/01', Tip: 'Member', Statü: 'Tamamlandı'},
//     {id: 7, İsim: 'Avram Tarasios', Tarih: '2018/02/01', Tip: 'Staff', Statü: 'Banned'},
//     {id: 8, İsim: 'Quintin Ed', Tarih: '2018/02/01', Tip: 'Admin', Statü: 'Tamamlandı'},
//     {id: 9, İsim: 'Enéas Kwadwo', Tarih: '2018/03/01', Tip: 'Member', Statü: 'Beklemede'},
//     {id: 10, İsim: 'Agapetus Tadeáš', Tarih: '2018/01/21', Tip: 'Staff', Statü: 'Tamamlandı'},
//     {id: 11, İsim: 'Carwyn Fachtna', Tarih: '2018/01/01', Tip: 'Member', Statü: 'Tamamlandı'},
//     {id: 12, İsim: 'Nehemiah Tatius', Tarih: '2018/02/01', Tip: 'Staff', Statü: 'Banned'},
//     {id: 13, İsim: 'Ebbe Gemariah', Tarih: '2018/02/01', Tip: 'Admin', Statü: 'Tamamlandı'},
//     {id: 14, İsim: 'Eustorgios Amulius', Tarih: '2018/03/01', Tip: 'Member', Statü: 'Beklemede'},
//     {id: 15, İsim: 'Leopold Gáspár', Tarih: '2018/01/21', Tip: 'Staff', Statü: 'Tamamlandı'},
//     {id: 16, İsim: 'Pompeius René', Tarih: '2018/01/01', Tip: 'Member', Statü: 'Tamamlandı'},
//     {id: 17, İsim: 'Paĉjo Jadon', Tarih: '2018/02/01', Tip: 'Staff', Statü: 'Banned'},
//     {id: 18, İsim: 'Micheal Mercurius', Tarih: '2018/02/01', Tip: 'Admin', Statü: 'Tamamlandı'},
//     {id: 19, İsim: 'Ganesha Dubhghall', Tarih: '2018/03/01', Tip: 'Member', Statü: 'Beklemede'},
//     {id: 20, İsim: 'Hiroto Šimun', Tarih: '2018/01/21', Tip: 'Staff', Statü: 'Tamamlandı'},
//     {id: 21, İsim: 'Vishnu Serghei', Tarih: '2018/01/01', Tip: 'Member', Statü: 'Tamamlandı'},
//     {id: 22, İsim: 'Zbyněk Phoibos', Tarih: '2018/02/01', Tip: 'Staff', Statü: 'Banned'},
//     {id: 23, İsim: 'Aulus Agmundr', Tarih: '2018/01/01', Tip: 'Member', Statü: 'Beklemede'},
//     {id: 42, İsim: 'Ford Prefect', Tarih: '2001/05/25', Tip: 'Alien', Statü: 'Don\'t panic!'}
//   ]

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
    currentPage !== newPage && history.push(`/basvurular/goruntule?sayfa=${newPage}`)
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
        <Loader/>
      }

      </CCol>
    </CRow>
  )
}

export default BasvuruTakibi;
