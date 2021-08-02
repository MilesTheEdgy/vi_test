<CCol sm="6" lg="3">
<CWidgetDropdown
  color="gradient-primary"
  // header="9.823"
  text="Sizin Teklifleriniz"
  footerSlot={
    <ChartLineSimple
      pointed
      className="c-chart-wrapper mt-3 mx-3"
      style={{height: '80px'}}
      pointHoverBackgroundColor="primary"
    />
  }
>
  <CDropdown>
        <i className="fas fa-hand-pointer"></i>
    {/* <CDropdownToggle color="transparent">
      <CIcon name="cil-hand-point-up"/>
    </CDropdownToggle>
    <CDropdownMenu className="pt-0" placement="bottom-end">
      <CDropdownItem onClick = {() => dispatch({type: "SET_DASHBOARD_TABLE", dashboardTable: SIZIN_TEKLIFLERINIZ})}>Görüntüle</CDropdownItem>
    </CDropdownMenu> */}
  </CDropdown>
</CWidgetDropdown>
</CCol>


<CCol sm="6" lg="3">
<CWidgetDropdown
  color="gradient-info"
  // header="9.823"
  text="Bekleyen Teklifler"
  footerSlot={
    <ChartLineSimple
      pointed
      className="mt-3 mx-3"
      style={{height: '70px'}}
      dataPoints={[1, 18, 9, 17, 34, 22, 11]}
      pointHoverBackgroundColor="info"
      options={{ elements: { line: { tension: 0.00001 }}}}
      label="Members"
      labels="months"
    />
  }
>
  <CDropdown>
    <CDropdownToggle caret={false} color="transparent">
      <CIcon name="cil-location-pin"/>
    </CDropdownToggle>
    <CDropdownMenu className="pt-0" placement="bottom-end">
      <CDropdownItem onClick = {() => dispatch({type: "SET_DASHBOARD_TABLE", dashboardTable: BEKELEYEN_TEKLIFLER})} >Görüntüle</CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</CWidgetDropdown>
</CCol>

<CCol sm="6" lg="3">
<CWidgetDropdown
  color="gradient-warning"
  // header="9.823"
  text="Bakiye Hareketleriniz"
  footerSlot={
    <ChartLineSimple
      className="mt-3"
      style={{height: '70px'}}
      backgroundColor="rgba(255,255,255,.2)"
      dataPoints={[78, 81, 80, 45, 34, 12, 40]}
      options={{ elements: { line: { borderWidth: 2.5 }}}}
      pointHoverBackgroundColor="warning"
      label="Members"
      labels="months"
    />
  }
>
  <CDropdown>
    <CDropdownToggle color="transparent">
      <CIcon name="cil-settings"/>
    </CDropdownToggle>
    <CDropdownMenu className="pt-0" placement="bottom-end">
      <CDropdownItem onClick = {() => dispatch({type: "SET_DASHBOARD_TABLE", dashboardTable: BAKIYE_HAREKETLERI})} >Görüntüle</CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</CWidgetDropdown>
</CCol>

<CCol sm="6" lg="3">
<CWidgetDropdown
  color="gradient-danger"
  // header="9.823"
  text="Tüm Teklifler"
  footerSlot={
    <ChartBarSimple
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
      <CIcon name="cil-settings"/>
    </CDropdownToggle>
    <CDropdownMenu className="pt-0" placement="bottom-end">
      <CDropdownItem onClick = {() => dispatch({type: "SET_DASHBOARD_TABLE", dashboardTable: TUM_TEKLIFLER})} >Görüntüle</CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</CWidgetDropdown>
</CCol>