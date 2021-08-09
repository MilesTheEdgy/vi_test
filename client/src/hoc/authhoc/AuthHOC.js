import React from "react";
import { withRouter, Route } from "react-router";
import { connect } from "react-redux";
import { gql } from "@apollo/client";
import { client } from "../../index"
import SafeHOC from "../safehoc/SafeHOC";

class AuthHOC extends React.Component {

    componentDidMount() {
      this.unlisten = this.props.history.listen( async (location, action) => {
        const GET_LOGIN = gql`
            query{
                currentUser {
                    username
                    pharmacy_name
                    balance
                }
            }
        `;
        try {
          const res = await client.query({
            query: GET_LOGIN,
            fetchPolicy: "no-cache"
          })
          if (res.data.currentUser) {
            this.props.dispatch({type: 'LOG_IN'})
            this.props.dispatch({type: 'FILL_USER_SETTINGS', eczaneName: res.data.currentUser.pharmacy_name, username: res.data.currentUser.username})
            this.props.dispatch({type: 'FILL_USER_INFO', bakiye: res.data.currentUser.balance})
          }
        } catch (error) {
          console.log( "Error in AuthHoc: ", error)
          this.props.dispatch({type: 'LOG_OUT'})
        }
      });
    }
    componentWillUnmount() {
        this.unlisten();
    }
    render() {
      if (this.props.isLogged) {
        return <Route {...this.props} />
      }
      else return <SafeHOC />
}
  }

  const mapStateToProps = (state) => {
    return {
      isLogged: state.user.session.isLogged
    }
  }

  export default connect(mapStateToProps)(withRouter(AuthHOC));