import React, { useState, useEffect } from 'react'
import {
  CWidgetDropdown,
  CRow,
  CCol
} from '@coreui/react'

const WidgetsDropdown = () => {
  const [todaySales, setTodaySales] = useState("0");
  const [problematicSales, setProblematicSales] = useState("0");
  const [thisMonthSales, setThisMonthSales] = useState("0");
  const [thisYearSales, setThisYearSales] = useState("0");

  useEffect(() => {
    const urlString = `/applications/count`
    const fetchAppsCountData = async (urlString, setState) => {
      const res = await fetch(urlString, {
        headers: {
          'content-type': 'application/json',
          'authorization' :`Bearer ${document.cookie.slice(8)} `
        }
      });
      if (res.status === 200) {
        const data = await res.json();
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