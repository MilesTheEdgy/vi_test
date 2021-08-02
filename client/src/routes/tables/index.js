import CollapseMine from "./CollapseMine"
import CollapseJoin from "./CollapseJoin"

export const initialState = {
  rows: [],
  totalPledges: 0,
  hedefeKalanMine: 0,
  hedefeKalanJoin: 0,
  userDynamicInput: {
    input: 0,
    total: 0,
    balanceAfterPurchase: 0
  },
  hedefeKalanIs0: false,
  pickedRows: [],
  isCollapsed: false,
  isOnHold: false,
  isloading: false,
  modal: {
    on: false,
    header: "",
    body: "",
    color: ""
  },
  isNotPending: false
}

export function reducer (state, action) {
  switch(action.type) {
    
    case "TOGGLE_ECZANE":
      const index = state.rows.findIndex(row => row.name ===action.payload)
      const newArray = [...state.rows]
      newArray[index].clicked = !state.rows[index].clicked

      if (newArray[index].clicked === true) {
        return {
          ...state,
          rows: newArray,
          pickedRows: [
            ...state.pickedRows,
            newArray[index]
          ]
        }
      } else {
        const pickedRowsCopy = state.pickedRows
        const idxToRemove = pickedRowsCopy.findIndex(row => row.name ===action.payload)
        pickedRowsCopy.splice(idxToRemove, 1)
        return {
          ...state,
          rows: newArray,
          pickedRows: pickedRowsCopy
        }
      }
    case "TOGGLE_ECZANE_JOIN":
      const index_join = state.rows.findIndex(row => row.name ===action.payload)
      console.log("index: ", index_join);
      const newArray_join = [...state.rows]
      console.log("newArray: ", newArray_join);
      newArray[index].clicked = !state.rows[index].clicked

      if (newArray[index].clicked === true) {
        return {
          ...state,
          rows: newArray,
          pickedRows: [
            ...state.pickedRows,
            newArray[index]
          ]
        }
      } else {
        const pickedRowsCopy = state.pickedRows
        const idxToRemove = pickedRowsCopy.findIndex(row => row.name ===action.payload)
        pickedRowsCopy.splice(idxToRemove, 1)
        return {
          ...state,
          rows: newArray,
          pickedRows: pickedRowsCopy
        }
      }

    case "ADD_ROW":
      return {
        ...state,
        rows: [
          ...state.rows,
          action.payload
        ]
      }
    
    case "HEDEF_HESAPLA_COLLAPSED_MINE":
      const posterPledgeMine = action.payload
      const hedefMine = action.hedef
      const toplamHedefMine = state.pickedRows.reduce((accumulator, current) => accumulator + current.pledge, posterPledgeMine);
      const hedefeKalanMine = hedefMine - toplamHedefMine
      if (hedefeKalanMine === 0) {
        return {
          ...state,
          totalPledges: toplamHedefMine,
          hedefeKalanMine: hedefeKalanMine,
          hedefeKalanIs0: true
        }
      } else {
        return {
          ...state,
          totalPledges: toplamHedefMine,
          hedefeKalanMine: hedefeKalanMine,
          hedefeKalanIs0: false
        }
      }

    case "HEDEF_HESAPLA_COLLAPSED_JOIN":
      // console.log('accounting...')
      const posterPledgeJoin = action.payload
      // console.log("posterPledgeJoin is: ", action.payload);
      const hedefJoin = action.hedef
      // console.log("hedefJoin is: ", action.hedef);
      const toplamHedefJoin = state.rows.reduce((accumulator, current) => accumulator + current.pledge, posterPledgeJoin);
      const hedefeKalanJoin = hedefJoin - toplamHedefJoin
      if (hedefeKalanJoin === 0) {
        return {
          ...state,
          totalPledges: toplamHedefJoin,
          hedefeKalanJoin: hedefeKalanJoin,
          hedefeKalanIs0: true
        }
      } else {
        return {
          ...state,
          totalPledges: toplamHedefJoin,
          hedefeKalanJoin: hedefeKalanJoin,
          hedefeKalanIs0: false
        }
      }

    // case "HEDEFE_EKLE_INPUT_COLLAPSED_JOIN":
    //   const input = action.payload;
    //   if (typeof input === "string") {
    //     if (input === "") {
    //       return {
    //         ...state,
    //         userDynamicInput: {
    //           input: 0,
    //           total: 0,
    //           balanceAfterPurchase: 0
    //         }
    //       }
    //     }
    //     let parsedInput = parseInt(input)
    //     return {
    //       ...state,
    //       userDynamicInput: {
    //         input: parsedInput,
    //         total: 0,
    //         balanceAfterPurchase: 0
    //       }
    //     }
    //   } else {
    //     return {
    //       ...state,
    //       userDynamicInput: {
    //         input: input,
    //         total: 0,
    //         balanceAfterPurchase: 0
    //       }
    //     }
    //   }

    case "SET_STATUS":
      switch (action.payload) {
        case "APPROVED":
          return {
            ...state,
            isOnHold: false,
            isNotPending: true
          }
        case "ON_HOLD":
          return {
            ...state,
            isOnHold: true
          }
        default:
          return state

      }

    case "APPROVE_BID":
      switch (action.payload.type) {
        case "LOADING_ON":
          return {
            ...state,
            isloading: true
          }
        case "LOADING_OFF":
          return {
            ...state,
            isloading: false
          }
        default:
          return
      }

    case "MODAL_DISPLAY":
      switch (action.payload.type) {
        case "SUCCESS":
          return {
            ...state,
            modal: {
              ...state.modal,
              on: true,
              header: "BAŞARILI",
              body: "Değişikleriniz Başarıyla Tamamlanmıştır",
              color: "success"
            }
          }
        case "FAILURE":
          return {
            ...state,
            modal: {
              ...state.modal,
              on: true,
              header: "HATA",
              body: "Bir Hata Olmuştur, lütfen daha sonra tekrar deneyin",
              color: "danger"
            }
          }
        case "CLOSE":
          return {
            ...state,
            modal: {
              ...state.modal,
              on: false,
              header: "",
              body: "",
              color: ""
            }
          }
      
        default:
          return;
      }
  
    default:
      return state
  }
}

// checks if number is below 0, returns a string, I used it for color styling
export function isBelow0 (number) {
  if (number < 0) {
    return "red"
  } else {
    return "green"
  }
}

export const fields = [
  {key: 'ID',  _style: { width: '5%'} },
  { key: 'eczane', _style: { width: '10%'} },
  { key: 'İlaç', _style: { width: '30%'} },
  'hedef',
  'birimFiyat',
  'kampanya',
  'sonTarih',
  'durum',
  {
    key: 'show_details',
    label: '',
    _style: { width: '1%' },
    sorter: false,
    filter: false
  }
]

export function getBadge (status) {
  switch (status) {
    case 'APPROVED': return 'success'
    case 'Inactive': return 'secondary'
    case 'ON_HOLD': return 'warning'
    case 'Banned': return 'danger'
    default: return 'primary'
  }
}

export function getStatus (status) {
  switch (status) {
    case 'ON_HOLD': return 'Beklemede'
    case 'APPROVED': return 'Tamamlandı'
    default: return status
  }
}

export function getCondition (status) {
  switch (status) {
    case 'NONE': return <p>Yok</p>
    default: return <p style = {{color: "	#321fdb"}}> {status} </p>
  }
}

export function toggleDetails(index, details, setDetails, setOrder, setTotal, setBakiyeSonra) {
    const position = details.indexOf(index)
    let newDetails = details.slice()
    if (position !== -1) {
        newDetails.splice(position, 1)
    } else {
        setOrder(0);
        setTotal(0);
        setBakiyeSonra(0);
        newDetails = [index]
    }
    setDetails(newDetails)
    }

export function whichCollapsedToRender (reduxUser, dataUser, item, index, order, setOrder, total, bakiyeSonra, fetchData, tableAPIstring) {
  if (reduxUser === dataUser) {
    return <CollapseMine item = {item} fetchData = {fetchData} tableAPIstring = {tableAPIstring} />
  } else {
    return <CollapseJoin reduxUser = {reduxUser} item = {item} order = {order} setOrder = {setOrder} total = {total} bakiyeSonra = {bakiyeSonra} fetchData = {fetchData} tableAPIstring = {tableAPIstring} />
  }
}