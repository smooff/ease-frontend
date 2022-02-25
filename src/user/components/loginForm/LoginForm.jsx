import React, { Component } from 'react';
import {Button, Grid, makeStyles, Typography} from "@material-ui/core";
import {Link} from "react-router-dom";
import { withOktaAuth } from '@okta/okta-react';
import { OktaAuth } from '@okta/okta-auth-js';


const LoginForm = (props) => {
    //styles
    const useStyles = makeStyles(() => ({
        form: {
            textAlign: "center",
            marginTop: "15%"
        },
        logo:{
            width:"516px",
            height:"215px",
        }
    }));
    const classes = useStyles();

    return (
        <Grid container className={classes.form}>
            <Grid item xs={12}>
                <Link to="/login">
                    <Button variant="contained">Prihlásiť sa</Button>
                </Link>
            </Grid>
        </Grid>
    );
}

export default LoginForm;
