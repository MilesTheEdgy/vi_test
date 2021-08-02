import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from "react-redux"
import Loader from './hoc/loader/Loader';
import './scss/style.scss';
import Layout from './components/layout/Layout';
import AuthHOC from './hoc/authhoc/AuthHOC';

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

class App extends Component {

  componentDidMount() {
    //runs once to check if user is already logged in, so user doesn't attempt to re-login
    const isUserCookieValid = async () => {
      const response = await fetch(`/api`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${document.cookie.slice(11)} `
        }
      })

      if (response.status === 200) {
        const data = await response.json()
        console.log('still authorized, routing to dashboard...')
        this.props.dispatch({type: 'FILL_USER_SETTINGS', eczaneName: data.eczaneName, username: data.username})
        this.props.dispatch({type: 'FILL_USER_INFO', bakiye: data.bakiye})
        this.props.dispatch({type: 'LOG_IN'})
        this.props.history.push('/dashboard')
        // fetchMedicineData()
      }
    }
  isUserCookieValid()
  }

  render() {
    return (
        <React.Suspense fallback={loading}>
          <Loader isLoading = {this.props.isLoading}>
            <Switch>
              <AuthHOC>  {/* AuthHOC: if user is accessed: render layout, if not, render Login and Register pages */}
                <Route path="/" name="Home" render={props => <Layout {...props}/>} />
              </AuthHOC>
            </Switch>
          </Loader>
        </React.Suspense>
    );
  }
}

// getting the loading boolean value from REDUX STORE to use in LOADER component
function mapStateToProps (state) {
  return {
    isLoading: state.isLoading
  }
}

//binding redux STATE, redux DISPATCH and withRouter to APP component
export default connect(mapStateToProps)(withRouter(App));
