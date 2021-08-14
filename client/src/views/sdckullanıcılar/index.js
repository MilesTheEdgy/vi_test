

export const filterAndMapAppData = (allData) => {
    let digerIslemApproved = 0
    let digerIslemDenied = 0
    const allDataFiltered = allData.filter(obj => {
      switch (obj.service) {
        case "İptal":
          digerIslemApproved = digerIslemApproved + Number(obj.approvedCount)
          digerIslemDenied = digerIslemDenied + Number(obj.deniedCount)
          break;
        case "Devir":
          digerIslemApproved = digerIslemApproved + Number(obj.approvedCount)
          digerIslemDenied = digerIslemDenied + Number(obj.deniedCount)
          break;
        case "Nakil":
          digerIslemApproved = digerIslemApproved + Number(obj.approvedCount)
          digerIslemDenied = digerIslemDenied + Number(obj.deniedCount)
          break;
        default:
          return obj
          break;
      }
    })
    allDataFiltered.push({service: "Diğer", routeName: "diğer", approvedCount: digerIslemApproved, deniedCount: digerIslemDenied})
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