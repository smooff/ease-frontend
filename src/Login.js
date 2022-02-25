import React from 'react';
import {Link, Redirect} from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import OktaSignInWidget from './OktaSignInWidget';

function Login() {
    const { oktaAuth, authState } = useOktaAuth();

    const onSuccess = function(res) {
        if (res.status === 'SUCCESS') {
            return oktaAuth.signInWithRedirect({
                sessionToken: res.session.token
            });

        }
    }

    const onError = function(err) {
        console.log('error logging in', err);
    }

    return authState.isAuthenticated ?
        <Link to={{ pathname: '/ease' }}/> :
        <OktaSignInWidget
            baseUrl='https://dev-05820212.okta.com/'
            onSuccess={onSuccess}
            onError={onError}/>;
}

export default Login;