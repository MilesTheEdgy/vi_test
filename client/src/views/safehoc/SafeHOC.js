import React from "react";
import { Switch, Route, Redirect } from "react-router";

const Login = React.lazy(() => import('../../pages/login/Login'));
const Register = React.lazy(() => import('../../pages/register/Register'));

function SafeHOC() {
    return (
        <>
            <Redirect to = "/login" />
            <Switch>
                <Route exact path="/login" name="Login Page" render={props => <Login {...props}/>} />
                <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>} />
            </Switch>
        </>
    )
}

export default SafeHOC