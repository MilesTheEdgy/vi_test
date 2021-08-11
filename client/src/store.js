import { createStore, combineReducers } from 'redux'
import { devToolsEnhancer } from 'redux-devtools-extension';


const initialState = {
  sidebarShow: 'responsive',
  isUserLoggedIn: false,
  loggedInUserInfo: {
    loggedInUserName: "",
    loggedInRole: "",
  },
  loginErr: false,
  ///////////////////////

  appsData: [],
  sdc: {
    users: []
  }
}

const defaultUserInfo = {
  loggedInUserName: "",
  loggedInRole: "",
  loggedInUserFullName: ""
}

// const BAYI = "BAYI";
// const SATIS_DESTEK = "SATIS_DESTEK";
// const SATIS_DESTEK_SEF = "SATIS_DESTEK_SEF";
// const MUDUR = "MUDUR";
// const SATIS_TEMSILCI = "SATIS_TEMSILCI";
// const MUHASEBE = "MUHASEBE";
// const AKSESUARCI = "AKSESUARCI";

const sidebarState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return {...state, ...rest }
    default:
      return state
  }
}

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case "LOGIN":
      // console.log(action.payload)
      return {...state,
        isUserLoggedIn: true,
        loginErr: false
      };

    case "LOGIN-ERROR":
      console.log(state.loginErr);
      return {
        ...state,
        loginErr: true
      };

    case "LOGIN-ERROR-CLOSE":
      return {
        ...state,
        loginErr: false
      };

    case "FILL_USER_INFO":
      const { username, userRole } = action.payload;
      // console.log("in the reducer, payload are: ", username, userRole, userFullName)
      return {
        ...state,
        loggedInUserInfo: {
          ...state.loggedInUserInfo,
          loggedInUserName: username,
          loggedInRole: userRole,
        }
      }
    
    case "LOGOUT":
      return {...state,
        isUserLoggedIn: false,
        loggedInUserInfo: {
          ...state.loggedInUserInfo,
          ...defaultUserInfo
        }
      };
    ///////////////////////////////////////////////
    /* IN HERE LIES MY WEIRD FUNCTIONS */
    case "FILL_APPS_DATA":
      return {
        ...state,
        appsData: action.payload
      }
    case "FILL_SDC_USERS_DATA":
    return {
      ...state,
      sdc: {
        ...state.sdc,
        users: action.payload
      }
    }
    default:
      return state;
  }
}

const combinedReducer = combineReducers({sidebarState, reducer})

const store = createStore(combinedReducer, devToolsEnhancer({
  trace: true
}));

export default store