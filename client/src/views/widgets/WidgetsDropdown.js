import React from 'react'
import {
  CWidgetDropdown,
  CRow,
  CCol
} from '@coreui/react'
// import ChartLineSimple from '../charts/ChartLineSimple'
// import ChartBarSimple from '../charts/ChartBarSimple'

const WidgetsDropdown = () => {
  // const [unsoldDevices, setUnsoldDevices] = useState(0);
  // const [urgentPaperwork, setUrgentPaperwork] = useState(0);
  // const [thisMonthSales, setThisMonthSales] = useState(0);
  // const [thisYearSales, setThisYearSales] = useState(0);
  const unsoldDevices = 60
  const urgentPaperwork = 0
  const thisMonthSales = 0
  const thisYearSales = 0

  // useEffect(() => {
  //   const getData = async () => {
  //     const res = await fetch("http://localhost:8080/bayi/anasayfa", {
  //       headers: {
  //         'content-type': 'application/json',
  //         'authorization' :`Bearer ${document.cookie.slice(8)} `
  //       }
  //     });
  //     if (res.status === 200) {
  //       const data = await res.json();
  //       setUnsoldDevices(data.unsold_devices)
  //       setUrgentPaperwork(data.urgent_paperwork)
  //       setThisMonthSales(data.this_month_sales)
  //       setThisYearSales(data.this_year_sales)
  //     }
  //   };
  //   getData();
  // }, [unsoldDevices, urgentPaperwork, thisMonthSales, thisYearSales])
  return (
    <CRow>
      <CCol sm="6" lg="3">
        <CWidgetDropdown
                  style = {{height: "130px"}}
          color="gradient-primary"
          header= {`${unsoldDevices}`}
          text="Bugünkü Satışlarınız"
        >
        </CWidgetDropdown>
      </CCol>



      <CCol sm="6" lg="3">
        <CWidgetDropdown
          style = {{height: "130px"}}
          color="gradient-info"
          header={`${urgentPaperwork}`}
          text="Sıkıntılı Satışlarınız"
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