import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux"
import {
  CWidgetDropdown,
  CRow,
  CCol
} from '@coreui/react'
// import ChartLineSimple from '../charts/ChartLineSimple'
// import ChartBarSimple from '../charts/ChartBarSimple'

const WidgetsDropdown = () => {
  const userInfo = useSelector(state => state.reducer.loggedInUserInfo)
  const [todaySales, setTodaySales] = useState("0");
  const [problematicSales, setProblematicSales] = useState("0");
  const [thisMonthSales, setThisMonthSales] = useState("0");
  const [thisYearSales, setThisYearSales] = useState("0");

  useEffect(() => {
    let urlStringRole = ""
    if (userInfo.loggedInRole === "sales_assistant_chef")
      urlStringRole = "sdc"
    else
      urlStringRole = "dealer"
    const urlString = `http://localhost:8080/${urlStringRole}/applications/count`
    console.log("urlString", urlString)
    const fetchAppsCountData = async (urlString, setState) => {
      console.log('fetchin')
      const res = await fetch(urlString, {
        headers: {
          'content-type': 'application/json',
          'authorization' :`Bearer ${document.cookie.slice(8)} `
        }
      });
      if (res.status === 200) {
        const data = await res.json();
        console.log("success", data)
        setState(data.count)
      } else {
        const data = await res.json();
        console.log(res.status, data)
      }
    };
    fetchAppsCountData(urlString + "?status=approved&interval=today", setTodaySales);
    fetchAppsCountData(urlString + "?status=rejected&interval=today", setProblematicSales);
    fetchAppsCountData(urlString + "?status=ALL&interval=month", setThisMonthSales);
    fetchAppsCountData(urlString + "?status=ALL&interval=year", setThisYearSales);
  }, [])
  return (
    <CRow>
      <CCol sm="6" lg="3">
        <CWidgetDropdown
          style = {{height: "130px"}}
          color="gradient-primary"
          header= {todaySales}
          text="Bugünkü Onaylanan Satışlarınız"
        >
        </CWidgetDropdown>
      </CCol>

      <CCol sm="6" lg="3">
        <CWidgetDropdown
          style = {{height: "130px"}}
          color="gradient-info"
          header={problematicSales}
          text="Bugünku Sıkıntılı Satışlarınız"
        >
        </CWidgetDropdown>
      </CCol>

      <CCol sm="6" lg="3">
        <CWidgetDropdown
            style = {{height: "130px"}}
            color="gradient-warning"
            header={thisMonthSales}
            text="Bu Ayki Genel Satışlar"
          >
        </CWidgetDropdown>
      </CCol>

      <CCol sm="6" lg="3">
        <CWidgetDropdown
          style = {{height: "130px"}}
          color="gradient-danger"
          header={thisYearSales}
          text="Bu Yılki Genel Satışlar"
        >
        </CWidgetDropdown>
      </CCol>


    </CRow>
  )
}

export default WidgetsDropdown;