import React from 'react'
import {
  CWidgetDropdown,
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle
} from '@coreui/react'
import ChartLineSimple from '../charts/ChartLineSimple'
import ChartBarSimple from '../charts/ChartBarSimple'

const WidgetsDropdown = () => {
  // const [unsoldDevices, setUnsoldDevices] = useState(0);
  // const [urgentPaperwork, setUrgentPaperwork] = useState(0);
  // const [thisMonthSales, setThisMonthSales] = useState(0);
  // const [thisYearSales, setThisYearSales] = useState(0);
  const unsoldDevices = 0
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
          color="gradient-primary"
          header= {`${unsoldDevices}`}
          text="Satılmamış Cihaz Sayısı"
          footerSlot={
            <ChartLineSimple
              pointed
              className="c-chart-wrapper mt-3 mx-3"
              style={{height: '70px'}}
              dataPoints={[0, 0, 0, 0, 0, 0, 0]}
              pointHoverBackgroundColor="primary"
              label="Satılan"
              labels="months"
            />
          }
        >
          <CDropdown>
            <CDropdownToggle color="transparent">
              <i className="fas fa-mobile"></i>
            </CDropdownToggle>
            <CDropdownMenu className="pt-0" placement="bottom-end">
              <CDropdownItem>Sizdeki cihazları görüntüle</CDropdownItem>
              {/* <CDropdownItem disabled>Disabled action</CDropdownItem> */}
            </CDropdownMenu>
          </CDropdown>
        </CWidgetDropdown>
      </CCol>



      <CCol sm="6" lg="3">
        <CWidgetDropdown
          color="gradient-info"
          header={`${urgentPaperwork}`}
          text="Acil Gönderilmesi Gereken Evrak Sayısı"
          footerSlot={
            <ChartLineSimple
              className="mt-3 mx-3"
              style={{height: '70px'}}
              dataPoints={[1, 18, 9, 17, 34, 22, 11]}
              pointHoverBackgroundColor="info"
              options={{ elements: { line: { borderWidth: 2.5 }}}}
              label="Members"
              labels="months"
            />
          }
        >
          <CDropdown>
            <CDropdownToggle color="transparent">
              <i className="fas fa-file-import"></i>
            </CDropdownToggle>
            <CDropdownMenu className="pt-0" placement="bottom-end">
              <CDropdownItem>Acil gönderilmesi gereken evraklarını görüntüle</CDropdownItem>
              {/* <CDropdownItem disabled>Disabled action</CDropdownItem> */}
            </CDropdownMenu>
          </CDropdown>
        </CWidgetDropdown>
      </CCol>



      <CCol sm="6" lg="3">
        <CWidgetDropdown
            color="gradient-warning"
            header={`${thisMonthSales}`}
            text="Bu Ayki Genel Satışlar"
            footerSlot={
              <ChartLineSimple
                pointed
                className="mt-3 mx-3"
                style={{height: '70px'}}
                dataPoints={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]}
                pointHoverBackgroundColor="warning"
                options={{ elements: { line: { tension: 0.00001 }}}}
                label="Satış"
                labels="day"
              />
            }
          >
          <CDropdown>
            <CDropdownToggle color="transparent">
              <i className="fas fa-chart-line"></i>
            </CDropdownToggle>
            <CDropdownMenu className="pt-0" placement="bottom-end">
              <CDropdownItem>Bu ayki satışlarınızı görüntüle</CDropdownItem>
              {/* <CDropdownItem disabled>Disabled action</CDropdownItem> */}
            </CDropdownMenu>
          </CDropdown>
        </CWidgetDropdown>
      </CCol>



      <CCol sm="6" lg="3">
        <CWidgetDropdown
          color="gradient-danger"
          header={`${thisYearSales}`}
          text="Bu Yılki Genel Satışlar"
          footerSlot={
            <ChartBarSimple
              dataPoints={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
              className="mt-3 mx-3"
              style={{height: '70px'}}
              backgroundColor="rgb(250, 152, 152)"
              label="Members"
              labels="months"
            />
          }
        >
          <CDropdown>
            <CDropdownToggle caret className="text-white" color="transparent">
              <i className="fas fa-chart-bar"></i>
            </CDropdownToggle>
            <CDropdownMenu className="pt-0" placement="bottom-end">
              <CDropdownItem>Bu yılki satışlarınızı görüntüle</CDropdownItem>
              {/* <CDropdownItem disabled>Disabled action</CDropdownItem> */}
            </CDropdownMenu>
          </CDropdown>
        </CWidgetDropdown>
      </CCol>


    </CRow>
  )
}

export default WidgetsDropdown;