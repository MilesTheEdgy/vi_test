import { createStore } from 'redux'

//Actions
export const SIZIN_TEKLIFLERINIZ = "SIZIN_TEKLIFLERINIZ";
export const BEKELEYEN_TEKLIFLER = "BEKELEYEN_TEKLIFLER";
export const BAKIYE_HAREKETLERI = "BAKIYE_HAREKETLERI";
export const TUM_TEKLIFLER = "TUM_TEKLIFLER";
//

const initialState = {
  sidebarShow: 'responsive',
  isLoading: false,
  dashboardTable: BEKELEYEN_TEKLIFLER,
  user: {
    session: {
      isLogged: true
    },
    userSettings: {
      eczaneName: "",
      username: ""
    },
    userInfo: {
      bakiye: 0
    }
  },
  medicineList: []
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return {...state, ...rest }
    case 'LOG_IN':
      return {
        ...state,
        user: {
          ...state.user,
          session: {
            ...state.user.session,
            isLogged: true
          }
        }
      }
    case 'FILL_USER_SETTINGS':
      return {
        ...state,
        user: {
          ...state.user,
          userSettings: {
            ...state.user.userSettings,
            ...rest
          }
        }
      }
    case 'FILL_USER_INFO':
      return {
        ...state,
        user: {
          ...state.user,
          userInfo: {
            ...state.user.userInfo,
            ...rest
          }
        }
      }
    case 'LOG_OUT':
      return initialState

    case "TOGGLE_LOADING_TRUE":
      return {
        ...state,
        isLoading: true
      }

    case "TOGGLE_LOADING_FALSE":
      return {
        ...state,
        isLoading: false
      }

    case 'SET_DASHBOARD_TABLE':
      return {
        ...state,
        ...rest
      }
    case 'FILL_MEDICINE_LIST':
      return {
        ...state,
        ...rest
      }
    
    default:
      return state
  }
}

const store = createStore(changeState)
export default store