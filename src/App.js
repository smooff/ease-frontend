import {LoginCallback, SecureRoute, Security} from "@okta/okta-react";
import {OktaAuth, toRelativeUrl} from "@okta/okta-auth-js";
import {Route, useHistory} from "react-router-dom";
import MainPage from "./user/pages/main/MainPage";
import WelcomePage from "./user/pages/welcome/WelcomePage";
import {RecoilRoot} from "recoil";
import LoginPage from "./user/pages/loginPage/LoginPage";

function App() {

    //login
    const onAuthRequired = () => {
        history.push('/login');
    };
    const history = useHistory(); // example from react-router
    const oktaAuth = new OktaAuth({
        issuer: process.env.REACT_APP_ISSUER,
        clientId: process.env.REACT_APP_CLIENT_ID,
        redirectUri: window.location.origin + '/login/callback',
        onAuthRequired: onAuthRequired,
        pkce: true
    });
    const restoreOriginalUri = async (_oktaAuth, originalUri) => {
        history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
    };

    return (
        <Security
            oktaAuth={oktaAuth}
            restoreOriginalUri={restoreOriginalUri}
        >
            <RecoilRoot>
                <Route path="/" exact={true} component={WelcomePage}/>
                <Route path="/login" exact={true} component={LoginPage}/>
                {/*//SecureRoute obaluje security componenty*/}
                <SecureRoute path="/ease" exact={true} component={MainPage}/>
                <Route path="/login/callback" component={LoginCallback}/>
            </RecoilRoot>
        </Security>
    );
}

export default App;

