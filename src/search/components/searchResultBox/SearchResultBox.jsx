import React, {useEffect, useState} from 'react';
import {Grid, makeStyles, Typography} from "@material-ui/core";
import axios from "axios";
import {useOktaAuth} from "@okta/okta-react";

const SearchResultBox = (props) => {

    //auth
    const {authState, oktaAuth} = useOktaAuth();

    //styles
    const useStyles = makeStyles(() => ({
        resultBox: {
            height: props.windowHeight * 0.65,
            width: props.windowWidht * 0.85,
            border: "1px solid black",
            marginTop: "5px",
        },
        resultText: {
            marginTop: (props.windowHeight * 0.65) * 0.5,
            textAlign: "center",
        }
    }));
    const classes = useStyles();

    const config = {
        headers: { Authorization: `Bearer ${authState.accessToken.accessToken}` }
    };
    const bodyParameters = {
        name: "credit"
    };
    axios.put(
        'http://tp2-ai.fei.stuba.sk:8080/core/search/general',
        bodyParameters,
        config
    ).then((res) => console.log(res.data)).catch(console.log);

    return (
        <Grid className={classes.resultBox}>
            <Typography className={classes.resultText}> Hľadáš výraz: {props.searchedValue}</Typography>
        </Grid>
    );
}

export default SearchResultBox;
