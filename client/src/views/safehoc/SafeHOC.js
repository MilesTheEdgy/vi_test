import React from "react";
import { Switch, Route, Redirect } from "react-router";

const Login = React.lazy(() => import('../../pages/login/Login'));
const Register = React.lazy(() => import('../../pages/register/Register'));
const Test = React.lazy(() => import('../../pages/test/Test'));

function SafeHOC() {
    return (
        <>
            <Redirect to = "/login" />
            <Switch>
                <Route exact path="/login" name="Login Page" render={props => <Login {...props}/>} />
                <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>} />
                <Route exact path = "/test" name ="testing page" render = {props => <Test {...props} />} />
            </Switch>
        </>
    )
}

export default SafeHOC