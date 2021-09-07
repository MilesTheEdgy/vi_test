import { createStore, combineReducers } from 'redux'
import { devToolsEnhancer } from 'redux-devtools-extension';


const initialState = {
  sidebarShow: 'responsive',
  isUserLoggedIn: false,
  loggedInUserInfo: {
    loggedInName: "",
    loggedInRole: "",
    loggedInEmail: "",
    loggedInBalance: ""
  },

  appsData: [],
  sdc: {
    users: []
  }
}

const defaultUserInfo = {
  loggedInName: "",
  loggedInRole: "",
  loggedInUserFullName: ""
}

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

    case "FILL_USER_INFO":
      const { name, role, email, balance } = action.payload;
      return {
        ...state,
        loggedInUserInfo: {
          ...state.loggedInUserInfo,
          loggedInName: name,
          loggedInRole: role,
          loggedInEmail: email,
          loggedInBalance: balance
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