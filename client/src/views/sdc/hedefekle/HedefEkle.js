import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormGroup,
  CInput,
  CLabel,
  CSelect,
  CRow,
  CForm,
  CButton,
  CDataTable
} from '@coreui/react'

const dummyData = [
    {
        hizmet: "DSL",
        onaylanan_işlem: 20,
        hedef: 50,
        tarih: "2021.06"
    }
]

const fields = [
    { key: 'hizmet', _style: { width: '25%'} },
    { key: 'onaylanan_işlem', _style: { width: '25%'} },
    { key: 'hedef', _style: { width: '25%'} },
    { key: 'tarih', _style: { width:'25%'}}
  ]

const HedefEkle = () => {

    const [usersData, setUsersData] = useState([])
    const [servicesData, setServicesData] = useState([])
    const [displayedUser, setDisplayedUser] = useState("")
    const [tableData, setTableData] = useState([])

    useEffect(() => {
        const fetchData = async (link, setState) => {
            const res = await fetch(link, {
                method: 'GET',
                headers: {
                  'content-type': 'application/json',
                  'authorization' :`Bearer ${document.cookie.slice(8)} `
                }
              })
              if (res.status === 200) {
                const fetchData = await res.json()
                console.log(fetchData)
                setState(fetchData)
              }
        }
        fetchData("http://localhost:8080/sdc/users", setUsersData)
        fetchData("http://localhost:8080/services?profitable=true", setServicesData)
        if (displayedUser) {
            const id = displayedUser
            // const res = await fetch(`http://localhost:8080/sdc/user/${id}/count/?service=${"ALL"}&status=${"ALL"}`, {
            //     method: 'GET',
            //     headers: {
            //       'content-type': 'application/json',
            //       'authorization' :`Bearer ${document.cookie.slice(8)} `
            //     }
            //   })
            //   if (res.status === 200) {
            //     const fetchData = await res.json()
            //     console.log(fetchData)
                // const mappedData = fetchData.map(obj => {
                //     return {
                //         hizmet
                //         onaylanan_işlem
                //         hedef
                //         tarih
                //     }
                // })
                // setState(fetchData)
              }
        }, [displayedUser])

    return (
        <CCard>
            <CCardHeader>
                Hedef
                <small> ekle</small>
            </CCardHeader>
            <CCardBody>
                <CForm>
                    <CRow>
                        <CCol xs = "12" xl="8">
                            <CRow>
                                <CCol xl = "6">
                                    <CFormGroup>
                                        <CLabel htmlFor="user">Kullanıcı</CLabel>
                                        <CSelect custom name="user" id="user" onChange = {(e) => {console.log(e.target.value);setDisplayedUser(e.target.value)}} >
                                        {
                                            usersData && usersData.map((obj, i) => {
                                                return <option key = {i} value = {obj.user_id} >{obj.username}</option>
                                            })
                                        }
                                        </CSelect>
                                    </CFormGroup>
                                </CCol>
                                <CCol xl = "3">
                                    <CFormGroup>
                                        <CLabel htmlFor="service">Hizmet</CLabel>
                                        <CSelect custom name="service" id="service">
                                        {
                                            servicesData && servicesData.map(obj => {
                                                return <option key = {obj.service_id} value = {obj.service_id}>{obj.name}</option>
                                            })    
                                        }
                                        </CSelect>
                                    </CFormGroup>
                                </CCol>
                                <CCol xl = "3">
                                    <CFormGroup>
                                        <CLabel htmlFor="goal">Hedef</CLabel>
                                        <CInput id="goal" placeholder="60" required />
                                    </CFormGroup>
                                </CCol>
                            </CRow>
                            <CRow className = "justify-content-center align-items-center" >
                                <CCol>
                                    <CFormGroup>
                                        <CLabel htmlFor="ccyear">Sene</CLabel>
                                        <CInput placeholder = {new Date().getFullYear()} readOnly />
                                    </CFormGroup>
                                </CCol>
                                <CCol>
                                    <CFormGroup>
                                        <CLabel htmlFor="ccmonth">Ay</CLabel>
                                        <CSelect custom name="ccmonth" id="ccmonth">
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                            <option value="7">7</option>
                                            <option value="8">8</option>
                                            <option value="9">9</option>
                                            <option value="10">10</option>
                                            <option value="11">11</option>
                                            <option value="12">12</option>
                                        </CSelect>
                                    </CFormGroup>
                                </CCol>
                                <CCol>

                                </CCol>
                                <CCol>
                                    <CFormGroup >
                                        <CButton id = "hedefekle" color = "success" >Hedef Ekle</CButton>
                                    </CFormGroup>
                                </CCol>
                            </CRow>
                        </CCol>
                        <CCol xs = "12" xl = "4">
                        <table className="table">
                            <thead>
                                <tr>
                                <th scope="col">#</th>
                                <th scope="col">Hizmet</th>
                                <th scope="col">Hedef</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <th scope="row">1</th>
                                <td>Mark</td>
                                <td>Otto</td>
                                </tr>
                                <tr>
                                <th scope="row">2</th>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                </tr>
                                <tr>
                                <th scope="row">3</th>
                                <td>Larry</td>
                                <td>the Bird</td>
                                </tr>
                            </tbody>
                        </table>
                        <CFormGroup>
                            <CButton color = "warning" >Onayla</CButton>
                        </CFormGroup>
                        </CCol>
                    </CRow>
                </CForm>
                <CDataTable
                    items={tableData}
                    fields={fields}
                    tableFilter
                    footer
                    itemsPerPageSelect
                    itemsPerPage={20}
                    hover
                    sorter
                    pagination
                />
            </CCardBody>
        </CCard>
    )
}

export default HedefEkle