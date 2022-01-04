import React from 'react';
import {Grid, makeStyles, Typography} from "@material-ui/core";

const SearchResultBox = (props) => {

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

    return (
        <Grid className={classes.resultBox}>
            <Typography className={classes.resultText}> Hľadáš výraz: {props.searchedValue}</Typography>
        </Grid>
    );
}

export default SearchResultBox;
