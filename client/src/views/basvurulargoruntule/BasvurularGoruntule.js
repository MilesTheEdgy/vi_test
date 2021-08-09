import React, { useEffect, useState } from "react";
import { CDataTable, CBadge, CButton, CCollapse, CCardBody } from "@coreui/react";
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import XLSX from "xlsx";


// const duyuruData = [
//        {id: 0, İsim: '13.02.2020', Tarih: 'Güncel ÖKC POS Faturasız Paket ve Kategori Listesi', Tip: '13.02.2020', Statü: 'Pending'},
//        {id: 1, İsim: '12.12.2019', Tarih: 'Selfy Faturasız Fırsat 15 Paketi', Tip: '13.02.2020', Statü: 'Active'},
//        {id: 2, İsim: '30.10.2019', Tarih: 'Satış Sonrası Süreçlerin Suistimali Hakkında Bilgilendirme', Tip: '13.02.2020', Statü: 'Banned'},
//        {id: 3, İsim: '26.10.2019', Tarih: 'Sil Süpür Faturalı Müşteri Katılım Koşullarında Güncelleme', Tip: '13.02.2020', Statü: 'Inactive'},
//        {id: 4, İsim: '30.10.2019', Tarih: 'Abonelik İşlemlerinde Dikkat Edilmesi Gereken Konular', Tip: '13.02.2020', Statü: 'Pending'},
//        {id: 5, İsim: '15.10.2018', Tarih: 'Kurumsal Sabit İnternette İlk 3 Ay Bedava Kampanyası-Kurumsal Süreç- Genişbant.', Tip: '13.02.2020', Statü: 'Active'},
//        {id: 6, İsim: '30.10.2019', Tarih: 'Selfy’nin Faturasız Dijital X Large Paketi', Tip: '13.02.2020', Statü: 'Active'},
//        {id: 7, İsim: '13.02.2020', Tarih: 'General Mobile GM 8 2019 Edition Kampanyası', Tip: '13.02.2020', Statü: 'Banned'},
//        {id: 8, İsim: '15.10.2018', Tarih: 'GPO Tarife Değişikliği İşlemleri', Tip: '13.02.2020', Statü: 'Inactive'},
//        {id: 9, İsim: '15.10.2018', Tarih: 'Bireysel Eksik Evrak Deaktivasyon Süreci Infodealer Eksik Evrak Tanımlama Alanı Kullanımı', Tip: '13.02.2020', Statü: 'Pending'},
//        {id: 10, İsim: '30.10.2019', Tarih: 'Cihaz Kampanya Taahhütnameleri ile İlgili Önemli Hatırlatma', Tip: '13.02.2020', Statü: 'Active'},
//        {id: 11, İsim: 'Carwyn Fachtna', Tarih: '2018/01/01', Tip: 'Member', Statü: 'Active'},
//        {id: 12, İsim: 'Nehemiah Tatius', Tarih: '2018/02/01', Tip: 'Staff', Statü: 'Banned'},
//        {id: 13, İsim: 'Ebbe Gemariah', Tarih: '2018/02/01', Tip: 'Admin', Statü: 'Inactive'},
//        {id: 14, İsim: 'Eustorgios Amulius', Tarih: '2018/03/01', Tip: 'Member', Statü: 'Pending'},
//        {id: 15, İsim: 'Leopold Gáspár', Tarih: '2018/01/21', Tip: 'Staff', Statü: 'Active'},
//        {id: 16, İsim: 'Pompeius René', Tarih: '2018/01/01', Tip: 'Member', Statü: 'Active'},
//        {id: 17, İsim: 'Paĉjo Jadon', Tarih: '2018/02/01', Tip: 'Staff', Statü: 'Banned'},
//        {id: 18, İsim: 'Micheal Mercurius', Tarih: '2018/02/01', Tip: 'Admin', Statü: 'Inactive'},
//        {id: 19, İsim: 'Ganesha Dubhghall', Tarih: '2018/03/01', Tip: 'Member', Statü: 'Pending'},
//        {id: 20, İsim: 'Hiroto Šimun', Tarih: '2018/01/21', Tip: 'Staff', Statü: 'Active'},
//        {id: 21, İsim: 'Vishnu Serghei', Tarih: '2018/01/01', Tip: 'Member', Statü: 'Active'},
//        {id: 22, İsim: 'Zbyněk Phoibos', Tarih: '2018/02/01', Tip: 'Staff', Statü: 'Banned'},
//        {id: 23, İsim: 'Aulus Agmundr', Tarih: '2018/01/01', Tip: 'Member', Statü: 'Pending'},
//        {id: 42, İsim: 'Ford Prefect', Tarih: '2001/05/25', Tip: 'Alien', Statü: 'Don\'t panic!'}
//    ]

// const data = [
//     {
//       id: 1,
//       'İsim': 'furkan önder',
//       Tarih: '2021-06-20',
//       Tip: 'DSL',
//       Statü: 'Gönderildi'
//     },
//     {
//       id: 2,
//       'İsim': 'muhammet nazom',
//       Tarih: '2021-06-20',
//       Tip: 'DSL',
//       Statü: 'Gönderildi'
//     },
//     {
//       id: 3,
//       'İsim': 'ezgy ezbelen',
//       Tarih: '2021-06-20',
//       Tip: 'DSL',
//       Statü: 'Gönderildi'
//     },
//     {
//       id: 4,
//       'İsim': 'ali aldulaimi',
//       Tarih: '2021-06-20',
//       Tip: 'DSL',
//       Statü: 'Gönderildi'
//     },
//     {
//       id: 5,
//       'İsim': 'ali deviroğlu',
//       Tarih: '2021-06-20',
//       Tip: 'Devir',
//       Statü: 'Gönderildi'
//     },
//     {
//       id: 6,
//       'İsim': 'wadadada awdadawdasda',
//       Tarih: '2021-06-20',
//       Tip: 'Taahüt',
//       Statü: 'Gönderildi'
//     }
//   ]


const BasvurularGoruntule = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const [details, setDetails] = useState([])
  const data = useSelector(state => state.reducer.appsData)

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
    const resData = fetchData.map(obj => {
      return { ID: obj.id, İsim: obj.name, Tarih: obj.date, Tip: obj.service, Kampanya: obj.offer, Açıklama: obj.description, Statü: obj.status }
    })
    dispatch({type: 'FILL_APPS_DATA', payload: resData})
   }
   fetchData();
 }, [dispatch])

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
      case 'Tamamlandı': return 'success'
      case 'Beklemede': return 'warning'
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
     onRowClick={(item) => history.push(`/basvurular/detay/${item.ID}`)}
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
                 onClick={()=>{toggleDetails(index)}}
               >
                 {details.includes(index) ? 'Sakla' : 'Detailar'}
               </CButton>
             </td>
             )
         },
       'details':
           (item, index)=>{
             return (
             <CCollapse show={details.includes(index)}>
               <CCardBody>
                 <h4>
                   {item.username}
                 </h4>
                 <CButton size="sm" color="info">
                   Detaiları
                 </CButton>
               </CCardBody>
             </CCollapse>
           )
         }
     }}
    excelButton = {() => {
      console.log("hasdadai")
      exportFile()
      }}
   />
</>
 )
}

export default BasvurularGoruntule;