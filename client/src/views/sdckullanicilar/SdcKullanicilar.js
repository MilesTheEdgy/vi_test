import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CPagination,
  CButton
} from '@coreui/react'
import "./style.css"
import ToggleSwitch from '../../components/toggleswitch/ToggleSwitch'
import HocLoader from '../hocloader/HocLoader'
import { compare, mapUsersData } from '.'

const fields = [
  { key: 'ID', _style: { width: '20%'} },
  { key: 'Kullanıcı', _style: { width: '20%'} },
  { key: 'Röl', _style: { width: '20%'} },
  { key: "Kayıt_tarihi", _style: {width: '20%'}},
  { key: 'Aktif', _style: { width:'20%'}},
  {
    key: 'show_details',
    label: '',
    _style: { width: '1%' },
    sorter: false,
    filter: false
  }
]

const SdcKullanicilar = () => {
  const history = useHistory()
  const queryPage = useLocation().search.match(/sayfa=([0-9]+)/, '')
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
  const [page, setPage] = useState(currentPage)
  const [usersData, setUsersData] = useState([])
  const [loading, setLoading] = useState(true)

  const pageChange = newPage => {
    currentPage !== newPage && history.push(`/sdc/kullanicilar?sayfa=${newPage}`)
  }

  const toggleUserActive = (setState, itemID, state) => {
    // console.log("original state", state)
    const stateCopy = [...state]
    // console.log("copied state ", stateCopy)
    const i = stateCopy.findIndex(obj => obj.ID === itemID)
    // console.log("itemID ", itemID, " state", stateCopy )
    // console.log("found index is: ", i)
    stateCopy[i].Aktif = !stateCopy[i].Aktif
    // console.log("new 'state' ", stateCopy)
    setState(stateCopy)
  }

  const fetchData = async () => {
    const res = await fetch("http://localhost:8080/sdc/users", {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'authorization' :`Bearer ${document.cookie.slice(8)} `
      }
    })
    if (res.status === 200) {
      const fetchData = await res.json()
      const mappedData = mapUsersData(fetchData)
      // *** I had to sort the data here because I couldn't figure out how to default sort it in the coreUI table component below
      const sortedData = mappedData.sort(compare);
      setUsersData(sortedData)
      setLoading(false)
    }
  };

  const updateUserActiveState = async (userID) => {
    setLoading(true)
    const res = await fetch(`http://localhost:8080/sdc/user/${userID}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        'authorization' :`Bearer ${document.cookie.slice(8)} `
      }
    })
    if (res.status === 200) {
      fetchData()
    }
  }

  useEffect(() => {
    currentPage !== page && setPage(currentPage)

    fetchData();
  }, [currentPage, page])

  return (
    <HocLoader isLoading = {false} absolute = {true}>
      <CRow className = "d-flex justify-content-center">
        <CCol xl={10}>
          <CCard>
            <CCardHeader>
              Kullanıcılar
            </CCardHeader>
            <CCardBody>
              <CDataTable
                  columnFilter
                  fields = {fields}
                  loading = {loading}
                  responsive
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
                              toggleUserActive(setUsersData, item.ID, usersData)
                              updateUserActiveState(item.ID)
                              }}
                          />
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
                                onClick={() => history.push(`/sdc/kullanici/${item.ID}`)}
                              >
                                Detailar
                              </CButton>
                            </td>
                            )
                        }
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
    </HocLoader>
  )
}

export default SdcKullanicilar;
