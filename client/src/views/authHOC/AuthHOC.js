import React, { useEffect } from "react";
import { Redirect, Route, useHistory } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import SafeHOC from "../safehoc/SafeHOC";

const AuthHOC = (props) => {
  const dispatch = useDispatch();
  const isUserLoggedIn = useSelector(state => state.reducer.isUserLoggedIn)
  const history = useHistory();
  useEffect(() => {
    return history.listen(async (location) => { 
        console.log("detected route change...")
        console.log("Document.cookie", document.cookie)
        console.log("Sliced", document.cookie.slice(8))
        const res = await fetch("http://localhost:8080/", {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              'authorization' :`Bearer ${document.cookie.slice(8)} `
            }
          })
        if (res.status < 405 && res.status > 400) {
            console.log("RES unsuccessful")
            dispatch({type: "LOGOUT"})
            // return <Redirect to="/login" />
        } else if (res.status === 200) {
            console.log("RES SUCCESSFUL")
            let payload = await res.json()
            dispatch({type: "LOGIN", })
            dispatch({type: "FILL_USER_INFO", payload: payload})
            // return <Route {...props} />;
        }
      }
    ) 
 },[history, dispatch, isUserLoggedIn, props])

  if (isUserLoggedIn) {
    console.log("user is LOGGED returning ROUTE")
    return (
      <Route {...props} />
    ) 
  }
  else {
    console.log("user is NOT LOGGED returning LOGIN")
    return (
      <SafeHOC/>
    )
  }
}


export default AuthHOC;