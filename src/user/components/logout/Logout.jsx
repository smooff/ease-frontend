import React from 'react';
import {Button} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import {useOktaAuth} from "@okta/okta-react";

const Logout = (props) => {

    const history = useHistory();
    const {authState, oktaAuth} = useOktaAuth();

    const logout = async () => {
        const basename = window.location.origin + history.createHref({pathname: '/'});
        try {
            await oktaAuth.signOut({postLogoutRedirectUri: basename});
        } catch (err) {
            console.log(err);
        }
    };
    return (<>
        {authState.isAuthenticated && (
            <Button variant="contained" onClick={logout}>Log out</Button>
        )}
    </>);
}

export default Logout;
