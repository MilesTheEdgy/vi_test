import React, { useEffect } from "react";
import { Redirect, Route, useHistory } from "react-router";
import { useSelector, useDispatch } from "react-redux";

const AuthHOC = (props) => {
  const dispatch = useDispatch();
  const isUserLoggedIn = useSelector(state => state.reducer.isUserLoggedIn)
  const history = useHistory();
  useEffect(() => {
    return history.listen(async (location) => { 
        // if (!isUserLoggedIn) {
        //   document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        //   localStorage.removeItem('token')
        //   sessionStorage.removeItem('token')
        // }
        // console.log(`Bearer ${document.cookie.slice(8)} `);
        const res = await fetch("http://localhost:8080/", {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              'authorization' :`Bearer ${document.cookie.slice(8)} `
            }
          })
        if (res.status < 405 && res.status > 400) {
            dispatch({type: "LOGOUT"})
            // return <Redirect to="/login" />
        } else if (res.status === 200) {
            let payload = await res.json()
            dispatch({type: "LOGIN", })
            dispatch({type: "FILL_USER_INFO", payload: payload})
            // return <Route {...props} />;
        }
      }
    ) 
 },[history, dispatch, isUserLoggedIn, props])

  if (isUserLoggedIn) return <Route {...props} />;
  else return <Redirect to="/login" />;
}


export default AuthHOC;