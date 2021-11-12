import React, {useEffect, useState} from 'react';
import {useOktaAuth} from "@okta/okta-react";
import Logout from "../../components/logout/Logout";
import {Grid, makeStyles, Typography} from "@material-ui/core";

const Login = (props) => {

    //styly
    const useStyles = makeStyles(() => ({
        loggedInInfo: {
            textAlign: "center",
            marginTop: "20%"
        }
    }));
    const classes = useStyles();

    const {authState, oktaAuth} = useOktaAuth();
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        if (!authState || !authState.isAuthenticated) {
            // When user isn't authenticated, forget any user info
            setUserInfo(null);
        } else {
            oktaAuth.getUser().then((info) => {
                setUserInfo(info);
            }).catch((err) => {
                console.error(err);
            });
        }
    }, [authState, oktaAuth]); // Update if authState changes

    return (<>
        <Grid container className={classes.loggedInInfo}>
            <Grid item xs={12}>
                <Typography variant="h4" component="h4">
                    Vitaj {userInfo?.name}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Logout/>
            </Grid>
        </Grid>


    </>);
}

export default Login;
