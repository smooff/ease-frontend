import React from 'react';
import {Button, Grid, makeStyles, Typography} from "@material-ui/core";
import {Link} from "react-router-dom";

const WelcomeBox = (props) => {

    //styles
    const useStyles = makeStyles(() => ({
        title: {
            textAlign: "center",
            marginTop: "15%",
        },
        logo:{
            width:"516px",
            height:"215px",
        },
        mainDiv: {
            backgroundImage: "url(/easeBackground.jpg)",
            height: "100vh",
            overflow: "hidden",
            backgroundSize: "cover"
        }
    }));
    const classes = useStyles();

    return (
        <Grid className={classes.mainDiv}>
        <Grid container className={classes.title}>
            <Grid item xs={12}>
               <img src="logo-nobackground.png" className={classes.logo}/>
            </Grid>

            <Grid item xs={12}>
                <Link to="/login">
                    <Button variant="contained">Prihlásenie</Button>
                </Link>
            </Grid>
        </Grid>
        </Grid>
    );
}

export default WelcomeBox;
