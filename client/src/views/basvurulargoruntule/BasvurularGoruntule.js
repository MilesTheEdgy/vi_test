import React, { useEffect, useState } from "react";
import { CDataTable, CBadge, CButton } from "@coreui/react";
import { useHistory } from 'react-router-dom'
import XLSX from "xlsx";
import { mapDataToTurkish, getBadge } from '../../components/index'

const BasvurularGoruntule = () => {
  const history = useHistory()
  const [data, setData] = useState([])

  const exportFile = () => {
    let cols = ["ID", "İsim", "Tarih", "Hizmet", "Kampanya", "Açıklama", "Statü"]
    let arrOfArrs = []
    for (let i = 0; i < data.length; i++) {
        arrOfArrs[i] = Object.values(data[i])
      }
    arrOfArrs.unshift(cols)
    console.log('arr of arrays is ', arrOfArrs)
    const ws = XLSX.utils.aoa_to_sheet(arrOfArrs);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Başvurular");
    XLSX.writeFile(wb, "başvurular.xlsx")
  };

 useEffect(() => {
  const fetchData = async() => {
    const res = await fetch("http://localhost:8080/sd/basvurular/goruntule", {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'authorization' :`Bearer ${document.cookie.slice(8)} `
      }
    })
    const fetchData = await res.json()
    const resData = mapDataToTurkish(fetchData)
    setData(resData)
   }
   fetchData();
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
                 onClick={() => history.push(`/basvurular/detay/${item.ID}`)}
               >
                 Detailar
               </CButton>
             </td>
             )
         }
     }}
    excelButton = {() => {
      exportFile()
      }}
   />
</>
 )
}

export default BasvurularGoruntule;