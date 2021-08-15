import React, { useEffect, useState } from "react";
import { CDataTable, CBadge, CButton } from "@coreui/react";
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import XLSX from "xlsx";
import qs from "qs"

const fetchData = async(service, id) => {
  const res = await fetch(`http://localhost:8080/sdc/user/${id}/details?service=${service}`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'authorization' :`Bearer ${document.cookie.slice(8)} `
    }
  })
  const fetchData = await res.json()
  const resData = fetchData.map(obj => {
    const { finalSalesRepDetails, lastChangeDate, salesRepDetails, statusChangeDate } = obj
    let submitProcessNum = 0
    if (obj.status === "Onaylandı" || obj.status === "İptal")
      submitProcessNum = 3
    else if (obj.status === "İşleniyor")
      submitProcessNum = 2
    else
      submitProcessNum = 1
    return {
        ID: obj.id,
        İsim: obj.client_name,
        Tarih: obj.submit_time,
        Tip: obj.selected_service,
        Kampanya: obj.offer,
        Açıklama: obj.description,
        Statü: obj.status,
        finalSalesRepDetails,
        lastChangeDate,
        salesRepDetails,
        statusChangeDate,
        submitProcessNum
      }
  })
  return resData
 }

const SdcIslemler = ({match, location}) => {
  // console.log("match", match)
  // console.log("location", location)
  const history = useHistory()
  const temp = qs.parse(location.search)
  const [data, setData] = useState([])
  // const data = useSelector(state => state.reducer.appsData)

  // const exportFile = () => {
  //   let cols = ["ID", "İsim", "Tarih", "Hizmet", "Kampanya", "Açıklama", "Statü"]
  //   let arrOfArrs = []
  //   for (let i = 0; i < data.length; i++) {
  //       arrOfArrs[i] = Object.values(data[i])
  //     }
  //   arrOfArrs.unshift(cols)
  //   console.log('arr of arrays is ', arrOfArrs)
  //   const ws = XLSX.utils.aoa_to_sheet(arrOfArrs);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Başvurular");
  //   XLSX.writeFile(wb, "başvurular.xlsx")
  // };

 useEffect(() => {
   const fetchAllData = async () => {
     const res = await fetchData(temp["?islem"], temp.id);
     setData(res)
   }
   fetchAllData()
 }, [])

 const fields = [
   { key: 'İsim', _style: { width: '25%'} },
   { key: 'Tarih', _style: { width: '25%'} },
   { key: 'Tip', _style: { width: '25%'} },
   { key: 'Statü', _style: { width:'25%'}},
   {
     key: 'show_details',
     label: '',
     _style: { width: '1%' },
     sorter: false,
     filter: false
   }
 ]

 const getBadge = (status)=>{
   switch (status) {
      case 'Onaylandı': return 'success'
      case 'İşleniyor': return 'warning'
      case 'İptal': return 'danger'
      case 'Gönderildi': return 'secondary'
      default: return 'primary'
   }
 }

     return (
<>
   <CDataTable
     items={data}
     fields={fields}
     columnFilter
     tableFilter
     footer
     itemsPerPageSelect
     itemsPerPage={20}
     hover
     sorter
     pagination
     scopedSlots = {{
       'Statü':
         (item)=>(
           <td>
             <CBadge color={getBadge(item.Statü)}>
               {item.Statü}
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
                 onClick={() => history.push(`/sd/islem/${item.ID}`)}
               >
                 Detailar
               </CButton>
             </td>
             )
         }
     }}
   />
</>
 )
}

export default SdcIslemler;