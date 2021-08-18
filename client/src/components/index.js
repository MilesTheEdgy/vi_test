export const mapDataToTurkish = (fetchData) => {
    return fetchData.map(obj => {
        let submitDate = new Date(obj.submit_time)
        let statusChangeDate = new Date(obj.status_change_date)
        let lastChangeDate = new Date(obj.last_change_date)
        let submitProcessNum = 0
        let status = ""
        if (obj.status === "approved") {
          submitProcessNum = 3
          status = "Onaylandı"
        }
        else if (obj.status === "rejected") {
          submitProcessNum = 3
          status = "İptal"
        }
        else if (obj.status === "processing") {
          submitProcessNum = 2
          status = "İşleniyor"
        }
        else if (obj.status === "sent") {
          status = "Gönderildi"
          submitProcessNum = 1
        }
        return {
            ID: obj.id,
            İsim: obj.client_name,
            Tarih: submitDate.toISOString().slice(0, 10),
            Tip: obj.selected_service,
            Kampanya: obj.selected_offer,
            Açıklama: obj.description,
            Statü: status,
            salesRepDetails: obj.sales_rep_details ? obj.sales_rep_details : "",
            statusChangeDate: statusChangeDate ? statusChangeDate.toISOString().slice(0, 10) : null,
            finalSalesRepDetails: obj.final_sales_rep_details ? obj.final_sales_rep_details : "",
            lastChangeDate: lastChangeDate ? lastChangeDate.toISOString().slice(0, 10) : null,
            submitProcessNum
          }
      })
}

export const getBadge = (status)=>{
    switch (status) {
       case 'Onaylandı': return 'success'
       case 'İşleniyor': return 'warning'
       case 'İptal': return 'danger'
       case 'Gönderildi': return 'secondary'
       default: return 'primary'
    }
  }