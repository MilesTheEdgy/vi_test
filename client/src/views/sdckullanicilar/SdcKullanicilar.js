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
import ToggleSwitch from '../../components/toggleswitch/ToggleSwitch'

const SdcKullanicilar = () => {
  const history = useHistory()
  const queryPage = useLocation().search.match(/sayfa=([0-9]+)/, '')
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
  const [page, setPage] = useState(currentPage)
  const [usersData, setUsersData] = useState(undefined)
  const [userActive, setUserActive] = useState([]);

  const pageChange = newPage => {
    currentPage !== newPage && history.push(`/sdc/kullanicilar?sayfa=${newPage}`)
  }

  const toggleUserActive = (setState, itemID, state) => {
    console.log("original state", state)
    const stateCopy = [...state]
    console.log("copied state ", stateCopy)
    const i = stateCopy.findIndex(obj => obj.ID === itemID)
    console.log("itemID ", itemID, " state", stateCopy )
    console.log("found index is: ", i)
    stateCopy[i].active = !stateCopy[i].active
    console.log("new 'state' ", stateCopy)
    setState(stateCopy)
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
        let usersActiveArr = []
        const mappedData = fetchData.map(obj => {
          usersActiveArr.push({active: obj.active, userID: obj.id})
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
              Aktif: obj.active
            }
        })
        setUsersData(mappedData)
        console.log(usersActiveArr)
        setUserActive(usersActiveArr)
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
          <button onClick = {() => console.log(usersData)}>dummy</button>
          <CCardBody>
            <CDataTable
                items={usersData}
                hover
                itemsPerPage={30}
                activePage={page}
                clickableRows
                // onRowClick={(user) => history.push(`/sdc/kullanici/${user.ID}`)}
                scopedSlots = {{
                  "Aktif":
                    (item, index) => (
                      <td>
                        <ToggleSwitch
                          id={`userActive${item.ID}`}
                          checked={item.Aktif}
                          onChange={() => {
                            console.log(userActive)
                            toggleUserActive(setUsersData, item.ID, usersData)
                            }}
                        />
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
      </CCol>
    </CRow>
  )
}

export default SdcKullanicilar;
