import React, { useEffect } from "react";
import { Route, useHistory, withRouter } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { gql, useQuery } from "@apollo/client";
import SafeHOC from "../safehoc/SafeHOC";

// const AuthHOC = (props) => {
//         // this AuthHOC takes care of verifiyng token and filling user info on each route change
//         const GET_LOGIN = gql`
//             query{
//                 currentUser {
//                     username
//                     pharmacy_name
//                     balance
//                 }
//             }
//         `;
//         const { loading }= useQuery(GET_LOGIN, {
//             fetchPolicy: "network-only",
//             onError: () => dispatch({type: 'LOG_OUT'}),
//             onCompleted: (data) => {
//               console.log(data)
//               const { token } = data.login
//               dispatch({type: 'LOG_IN'})
//               dispatch({type: 'FILL_USER_SETTINGS', eczaneName: token.pharmacy_name, username: token.username})
              
//               dispatch({type: 'FILL_USER_SETTINGS', eczaneName: data.eczaneName, username: data.username})
//               dispatch({type: 'FILL_USER_INFO', bakiye: data.bakiye})
//             }
//           });
//         const history = useHistory();
//         const dispatch = useDispatch();
//         const isLogged = useSelector(state => state.user.session.isLogged)
//         useEffect(() => {
//             return history.listen(async (location) => {
//                 console.log('sending validation request to server')
//                 const res = await fetch("/api", {
//                     method: 'POST',
//                     headers: {
//                     'content-type': 'application/json',
//                     'authorization' :`Bearer ${document.cookie.slice(11)} `
//                     }
//                 })
//                 if (res.status < 405 && res.status > 400) {
//                     console.log('error happened at AUTHHOC: token likely to have expired ', res.status)
//                     dispatch({type: 'LOG_OUT'})
//                 } else if (res.status === 200) {
//                     const data = await res.json()
//                     dispatch({type: 'FILL_USER_SETTINGS', eczaneName: data.eczaneName, username: data.username})
//                     dispatch({type: 'FILL_USER_INFO', bakiye: data.bakiye})
//                 }
//             }
//         )
//     },[history, dispatch, isLogged, props])

//         if (isLogged) {
//             return <Route {...props} />
//         }
//         else {
//             return <SafeHOC />
//         }
//     }


// export default AuthHOC;


class AuthHOC extends React.Component {
  
    componentWillMount() {
      this.unlisten = this.props.history.listen((location, action) => {
        console.log("on route change");
      });
    }
    componentWillUnmount() {
        this.unlisten();
    }
    render() {
       return (
           <div>{this.props.children}</div>
        );
    }
  }
  export default withRouter(AuthHOC);