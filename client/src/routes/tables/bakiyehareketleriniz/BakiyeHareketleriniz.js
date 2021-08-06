import React, { useState } from "react";
import { CDataTable, CBadge, CButton, CCollapse, CCardBody, CCol, CCard, CCardHeader, CFormGroup, CLabel, CRow } from "@coreui/react";
import { useSelector } from "react-redux";
import { useQuery, gql } from "@apollo/client" 

function BakiyeHareketleriTable({item, eczaneName}) {
  return (
    <CCardBody>
      <CCol xs="12" sm="12">
        <CCard>
          <CCardHeader>
          <b>TEKLIF ID: <CBadge color = "info" >{item.application_id}</CBadge></b>
          </CCardHeader>
          <CCardBody>
            <CFormGroup row>
              <CCol xs="12" md="12">
                <table className="table">
                  <thead style = {{backgroundColor: "	rgb(46, 184, 92, 0.75)"}}>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Alıcı Eczane</th>
                      <th scope="col">Adet</th>
                      <th scope="col">Toplam</th>
                      <th scope="col">Bakiye</th>
                    </tr>
                  </thead>
                  <tbody>
                          <tr>
                            <th scope="row">1</th>
                            <td>{item.eczane === eczaneName ? <b>{item.eczane}</b> : <p>{item.eczane}</p>}</td>
                            <td>{item.pledge}/<b>{item.hedef}</b></td>
                            <td style = {{color: "green"}}>+{item.total.toFixed(2)}</td>
                            <td>{item.bakiye.toFixed(2)}</td>
                          </tr>
                  </tbody>
                  <thead style = {{backgroundColor: "rgb(229, 83, 83, 0.75)"}}>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Katılan Eczaneler</th>
                      <th scope="col">Adet</th>
                      <th scope="col">Toplam</th>
                      <th scope="col">Bakiye</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      item.joiners.map((obj, i) => {
                        if (obj.name === eczaneName)
                          return (
                              <tr key = {i} >
                                <th scope="row">{i+1}</th>
                                <td><b>{obj.name}</b></td>
                                <td>{obj.amount}/<b>{item.hedef}</b></td>
                                <td style = {{color: "red"}}>-{obj.total}</td>
                                <td>{obj.balanceAfter}</td>
                              </tr>
                          )
                        return (
                          <tr key = {i}>
                              <th scope="row">{i+1}</th>
                              <td>{obj.name}</td>
                              <td>{obj.amount}/<b>{item.hedef}</b></td>
                              <td style = {{color: "red"}}>-{obj.total}</td>
                              <td>{obj.balanceAfter}</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </CCol>
            </CFormGroup>
          </CCardBody>
        </CCard>
      </CCol>
    </CCardBody>
  )
}

const BakiyeHareketleriniz = () => {
    const eczaneName = useSelector(state => state.user.userSettings.eczaneName)
    const [details, setDetails] = useState([])
    const [data, setData] = useState([])
  
    const toggleDetails = (index) => {
      const position = details.indexOf(index)
      let newDetails = details.slice()
      if (position !== -1) {
        newDetails.splice(position, 1)
      } else {
        newDetails = [...details, index]
      }
      setDetails(newDetails)
    }
  
  
    const fields = [
      { key: 'ID', _style: { width: '10%'} },
      { key: 'İlaç', _style: { width: '35%'} },
      { key: 'tür'},
      'tarih',
      'toplam',
      {
        key: 'show_details',
        label: '',
        _style: { width: '1%' },
        sorter: false,
        filter: false
      }
    ]
  
    const bakiyeBadge = (status)=>{
      switch (status) {
        case 'Satış': return 'success'
        case 'Alış': return 'danger'
        default: return 'primary'
      }
    }

    const plusOrMinus = (status) => {
      switch (status) {
        case 'Satış': return '+'
        case 'Alış': return '-'
        default: return 'bir sorun olmuştur'
      }
    }

    const turCustomizing = (tur)=>{
      switch (tur) {
        case 'Satış': return 'green'
        case 'Alış': return 'red'
        default: return ''
      }
    }

    const GET_BAKIYE_HAREKETLER = gql`
      query ($userTransactions: String) {
        transaction(userTransactions: $userTransactions) {
          application_id
          transaction_id
          product {
            Product_name
            Barcode
          }
          unit_price
          goal
          seller {
            name
            amount
            sellerPledge
            total
            balanceAfter
          }
          buyers {
            name
            amount
            total
            balanceAfter
          }
          date
        }
      }
    `

    const { loading } = useQuery(GET_BAKIYE_HAREKETLER, {
      fetchPolicy: "no-cache",
      variables: {userTransactions: eczaneName},
      onError: (err) => console.log(err),
      onCompleted: (data) => {
        const mappedData = data.transaction.map(obj => {
          return {
            ID: obj.transaction_id,
            application_id: obj.application_id,
            İlaç: obj.product.Product_name,
            eczane: obj.seller.name,
            tür: obj.seller.name === eczaneName ? "Satış" : "Alış",
            hedef: obj.goal,
            pledge: obj.seller.sellerPledge,
            tarih: obj.date,
            total: parseFloat(obj.seller.total, 10),
            bakiye: parseFloat(obj.seller.balanceAfter, 10),
            joiners: obj.buyers
          }
        })
        setData(mappedData)
      }
    })
  
    return (
    <>
    <CRow>
      <CCol>
        <CLabel className = "tableLabel bakiyehareketlerinizGradient" >Bakiye Hareketleriniz</CLabel>
      </CCol>
    </CRow>
    <CRow>
          <CCol>
          <div style = {{border: "solid 1px rgb(249, 177, 21, 0.35)"}} >
            <CDataTable
              loading = {loading}
              header
              items={data}
              fields={fields}
              columnFilter
              footer
              itemsPerPage={50}
              hover
              sorter
              pagination
              border
              scopedSlots = {{
                'İlaç':
                (item)=>(
                  <td>
                    <b>{item.İlaç}</b>
                  </td>
                  ),
                'tür':
                (item)=>(
                  <td>
                    <b style = {{color: turCustomizing(item.tür)}}>{item.tür}</b>
                  </td>
                  ),
                'tarih':
                (item)=>(
                  <td>
                    <p>{item.tarih}</p>
                  </td>
                  ),
                'toplam':
                (item)=>(
                  <td>
                    <CBadge style = {{minWidth: "50px", fontSize: "15px"}} color={bakiyeBadge(item.tür)}>
                      {plusOrMinus(item.tür)}{item.total.toFixed(2)} TL
                    </CBadge>
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
                          onClick={()=>{toggleDetails(index)}}
                        >
                          {details.includes(index) ? 'Sakla' : 'Göster'}
                        </CButton>
                      </td>
                      )
                  },
                'details':
                    (item, index)=>{
                      return (
                        <CCollapse show={details.includes(index)}>
                          <BakiyeHareketleriTable item = {item} eczaneName = {eczaneName} />
                        </CCollapse>
                    )
                  }
              }}
            />
          </div>
        </CCol>
    </CRow>
    </>
    )
}

export default BakiyeHareketleriniz;