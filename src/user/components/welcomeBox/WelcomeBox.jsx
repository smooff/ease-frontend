import React from 'react';
import {Button, Grid, makeStyles, Typography} from "@material-ui/core";
import {Link} from "react-router-dom";

const WelcomeBox = (props) => {

    //styles
    const useStyles = makeStyles(() => ({
        title: {
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
        <Grid container className={classes.title}>
            <Grid item xs={12}>
               <img src="logo-nobackground.png" className={classes.logo}/>
            </Grid>
            <Grid item xs={12}>
                <Link to="/ease">
                    <Button variant="contained">Prihlásiť sa</Button>
                </Link>
            </Grid>
        </Grid>
    );
}

export default WelcomeBox;
