import React, { useEffect, useState } from "react"
import {
    CCard,
    CCardBody,
    CFormGroup,
    CSelect,
    CCol,
    CLabel,
    CDataTable,
    CButton
} from "@coreui/react"
import "./hedefler.css"
import { mapMonths, mapYears, currentYear, currentMonth, mapGoalsData, fields, AddGoal } from "."

const Dealers = ({setDealer}) => {
    const [dealers, setDealers] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`/users`, {
                headers: {
                  'content-type': 'application/json',
                  'authorization' :`Bearer ${document.cookie.slice(8)} `
                }
            })
            if (res.status === 200) {
                const fetchData = await res.json()
                const filteredData = fetchData.filter(obj => obj.role === "dealer")
                console.log('data: ', filteredData)
                setDealers(filteredData)
            }
        }
        fetchData()
    }, [])
    return (
        <CSelect onChange = {(e) => setDealer(e.target.value)} >
            <option value = {"0"}></option>
            {
                dealers && dealers.map(dealer => <option key={dealer.user_id} value={dealer.user_id}>{dealer.name}</option>)
            }
        </CSelect>
    )
}

const Date = ({setMonth, setYear}) => {
    const months = mapMonths()
    const years = mapYears()
    return (
        <div id = "date-fields-div">
            <CSelect onChange = {e => setMonth(e.target.value)} >
                {months.map(month => <option value={month} key={month}>{month}</option>)}
            </CSelect>
            <p id = "month-year-seperator-slash" >-</p>
            <CSelect onChange = {e => setYear(e.target.value)} >
                {years.map(year => <option value={year} key={year}>{year}</option>)}
            </CSelect>
        </div>
    )
}

const Hedefler = () => {
    const [dealerID, setDealerID] = useState("")
    const [month, setMonth] = useState(currentMonth())
    const [year, setYear] = useState(currentYear())
    const [goals, setGoals] = useState([])
    const [loading, setLoading] = useState(false)
    const [addGoalModal, setAddGoalModal] = useState(false)
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const res = await fetch(`/goal?userID=${dealerID}&month=${month}&year=${year}` , {
                headers: {
                  'content-type': 'application/json',
                  'authorization' :`Bearer ${document.cookie.slice(8)} `
                }
            })
            if (res.status === 200) {
                const data = await res.json()
                const mappedData = mapGoalsData(data)
                console.log(mappedData)
                setGoals(mappedData)
            }
            setLoading(false)
        } 
        if (dealerID !== "")
            fetchData()
    }, [dealerID, month, year])
    return (
        <CCard>
            <CCardBody>
                <CFormGroup row>
                    <CCol xs = "12" lg = "1">
                        <CLabel>Bayi</CLabel>
                    </CCol>
                    <CCol xs = "12" lg = "3" >
                        <Dealers setDealer = {setDealerID} />
                    </CCol>
                    <CCol xs = "12" lg = "4" ></CCol>

                    <CCol xs = "12" lg = "1">
                        <CLabel>Tarih</CLabel>
                    </CCol>
                    <CCol xs = "12" lg = "2" >
                        <Date setYear = {setYear} setMonth = {setMonth} />
                    </CCol>
                </CFormGroup>
                <div id = "add-goal-div-row" >
                    <CButton color = "info" id = "add-goal-div-row-button" 
                        onClick = {() => setAddGoalModal(true)}
                    >Hedef ekle</CButton>
                </div>
                <CDataTable
                    items={goals}
                    fields={fields}
                    tableFilter
                    loading = {loading}
                    hover
                    // clickableRows
                    // onRowClick={(item) => { setModal(true); setModalData(item)}}
                    // scopedSlots = {{
                    // 'değeri':
                    //     (item)=>(
                    //     <td>
                    //         <p style = {{color: "green"}} >{item.değeri} TL</p>
                    //     </td>
                    //     ),
                    // 'show_details':
                    //     (item, index)=>{
                    //     return (
                    //     <td className="py-2">
                    //         <CButton
                    //             color="primary"
                    //             variant="outline"
                    //             shape="square"
                    //             size="sm"
                    //             onClick={() => {setSelectedOffer(item); setModifyOffer(true)}}
                    //         >
                    //             Değiştir
                    //         </CButton>
                    //     </td>
                    //     )
                    // }
                    // }}
                />
            </CCardBody>
        </CCard>
    )
}

export default React.memo(Hedefler)