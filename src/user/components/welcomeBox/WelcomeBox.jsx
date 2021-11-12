import React from 'react';
import {Button, Grid, makeStyles, Typography} from "@material-ui/core";
import {Link} from "react-router-dom";

const WelcomeBox = (props) => {

    //styly
    const useStyles = makeStyles(() => ({
        title: {
            textAlign: "center",
            marginTop: "20%"
        }
    }));
    const classes = useStyles();

    return (
        <Grid container className={classes.title}>
            <Grid item xs={12}>
                <Typography variant="h2" component="h2">
                    EASE Projekt
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Link to="/signin">
                    <Button variant="contained">Sign in</Button>
                </Link>
            </Grid>
        </Grid>
    );
}

export default WelcomeBox;
