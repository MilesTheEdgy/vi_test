

export const filterAndMapAppData = (allData) => {
    let digerIslemApproved = 0
    let digerIslemSent = 0
    let digerIslemProcessing = 0
    let digerIslemRejected = 0
    // eslint-disable-next-line
    const allDataFiltered = allData.filter(obj => {
      switch (obj.service) {
        case "İptal":
          digerIslemApproved = digerIslemApproved + Number(obj.approvedCount)
          digerIslemSent = digerIslemSent + Number(obj.sentCount)
          digerIslemProcessing = digerIslemProcessing + Number(obj.processingCount)
          digerIslemRejected = digerIslemRejected + Number(obj.rejectedCount)
          break;
        case "Devir":
          digerIslemApproved = digerIslemApproved + Number(obj.approvedCount)
          digerIslemSent = digerIslemSent + Number(obj.sentCount)
          digerIslemProcessing = digerIslemProcessing + Number(obj.processingCount)
          digerIslemRejected = digerIslemRejected + Number(obj.rejectedCount)
          break;
        case "Nakil":
          digerIslemApproved = digerIslemApproved + Number(obj.approvedCount)
          digerIslemSent = digerIslemSent + Number(obj.sentCount)
          digerIslemProcessing = digerIslemProcessing + Number(obj.processingCount)
          digerIslemRejected = digerIslemRejected + Number(obj.rejectedCount)
          break;
        default:
          return obj
      }
    })
    allDataFiltered.push({
      service: "Diğer", 
      routeName: "diger", 
      approvedCount: digerIslemApproved, 
      sentCount: digerIslemSent,
      processingCount: digerIslemProcessing,
      rejectedCount: digerIslemRejected
    })
    const allDataMapped = allDataFiltered.map(obj => {
      switch (obj.service) {
        case "Faturasız":
          return {
            ...obj,
            routeName: "faturasiz"
          }
        case "Faturalı":
          return {
            ...obj,
            routeName: "faturali"
          }
        case "DSL":
          return {
            ...obj,
            routeName: "DSL"
          }
        case "PSTN":
          return {
            ...obj,
            routeName: "pstn"
          }
        case "Taahüt":
          return {
            ...obj,
            routeName: "taahut"
          }
        case "Tivibu":
          return {
            ...obj,
            routeName: "tivibu"
          }
        default:
          return obj
      }
    })
    return allDataMapped
}