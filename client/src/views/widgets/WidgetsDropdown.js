import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import {
  CWidgetDropdown,
  CRow,
  CCol
} from '@coreui/react'

const WidgetsDropdown = () => {
  const history = useHistory()

  const [todaySales, setTodaySales] = useState("0");
  const [problematicSales, setProblematicSales] = useState("0");
  const [thisMonthSales, setThisMonthSales] = useState("0");
  const [transactionReports, setTransactionReports] = useState("0")
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
    }
  };
  useEffect(() => {
    fetchAppsCountData("/applications/count?status=approved&interval=today", setTodaySales);
    fetchAppsCountData("/applications/count?status=rejected&interval=today", setProblematicSales);
    fetchAppsCountData("/applications/count?status=approved&interval=month", setThisMonthSales);
    fetchAppsCountData("/report/transactions/count", setTransactionReports)
  }, [])
  return (
    <CRow>
      <CCol sm="6" lg="3">
        <CWidgetDropdown
          onClick = {() => history.push("/bayi/islemler/rapor?q=&interval=today&status=approved")}
          style = {{height: "130px", cursor: "pointer"}}
          color="gradient-primary"
          header= {todaySales}
          text="Bugünkü Onaylanan Satışlarınız"
        >
        </CWidgetDropdown>
      </CCol>

      <CCol sm="6" lg="3">
        <CWidgetDropdown
          onClick = {() => history.push("/bayi/islemler/rapor?q=&interval=today&status=rejected")}
          style = {{height: "130px", cursor: "pointer"}}
          color="gradient-info"
          header={problematicSales}
          text="Bugünku Sıkıntılı Satışlarınız"
        >
        </CWidgetDropdown>
      </CCol>

      <CCol sm="6" lg="3">
        <CWidgetDropdown
            onClick = {() => history.push("/bayi/islemler/rapor?q=&interval=month&status=approved")}
            style = {{height: "130px", cursor: "pointer"}}
            color="gradient-warning"
            header={thisMonthSales}
            text="Bu Ayki Genel Satışlar"
          >
        </CWidgetDropdown>
      </CCol>

      <CCol sm="6" lg="3">
        <CWidgetDropdown
          onClick = {() => history.push("/bayi/rapor/kazanc")}
          style = {{height: "130px", cursor: "pointer"}}
          color="gradient-danger"
          header={transactionReports}
          text="Aylık kazanç raporlarınız"
        >
        </CWidgetDropdown>
      </CCol>
    </CRow>
  )
}

export default WidgetsDropdown;