import React, { useState, useEffect } from 'react'
import {
  CWidgetDropdown,
  CRow,
  CCol
} from '@coreui/react'
// import ChartLineSimple from '../charts/ChartLineSimple'
// import ChartBarSimple from '../charts/ChartBarSimple'

const WidgetsDropdown = () => {
  const [todaySales, setTodaySales] = useState(0);
  const [problematicSales, setProblematicSales] = useState(0);
  const [thisMonthSales, setThisMonthSales] = useState(0);
  const [thisYearSales, setThisYearSales] = useState(0);
  // const problematicSales = 0
  // const thisMonthSales = 0
  // const thisYearSales = 0

  useEffect(() => {
    const fetchAppsCountData = async (urlString, setState) => {
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
      }
    };
    fetchAppsCountData("http://localhost:8080/dealer/applications/count?status=approved&interval=today", setTodaySales);
    fetchAppsCountData("http://localhost:8080/dealer/applications/count?status=rejected&interval=today", setProblematicSales);
    fetchAppsCountData("http://localhost:8080/dealer/applications/count?status=ALL&interval=month", setThisMonthSales);
    fetchAppsCountData("http://localhost:8080/dealer/applications/count?status=ALL&interval=year", setThisYearSales);
  }, [])
  return (
    <CRow>
      <CCol sm="6" lg="3">
        <CWidgetDropdown
                  style = {{height: "130px"}}
          color="gradient-primary"
          header= {`${todaySales}`}
          text="Bugünkü Onaylanan Satışlarınız"
        >
        </CWidgetDropdown>
      </CCol>



      <CCol sm="6" lg="3">
        <CWidgetDropdown
          style = {{height: "130px"}}
          color="gradient-info"
          header={`${problematicSales}`}
          text="Bugünku Sıkıntılı Satışlarınız"
        >
        </CWidgetDropdown>
      </CCol>



      <CCol sm="6" lg="3">
        <CWidgetDropdown
                  style = {{height: "130px"}}
            color="gradient-warning"
            header={`${thisMonthSales}`}
            text="Bu Ayki Genel Satışlar"
          >
        </CWidgetDropdown>
      </CCol>



      <CCol sm="6" lg="3">
        <CWidgetDropdown
                  style = {{height: "130px"}}
          color="gradient-danger"
          header={`${thisYearSales}`}
          text="Bu Yılki Genel Satışlar"
        >
        </CWidgetDropdown>
      </CCol>


    </CRow>
  )
}

export default WidgetsDropdown;