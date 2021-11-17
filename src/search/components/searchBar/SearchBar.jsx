import React from 'react';
import {Box} from "@material-ui/core";
import TextField from '@mui/material/TextField';
import {makeStyles} from "@material-ui/core/styles";

const SearchBar = (props) => {

    const searchBarWidth = props.windowWidth;

    const useStyles = makeStyles(() => ({
        root: {},
    }));
    const classes = useStyles();

    var changeableSearchedValue;

    const keyPress = (e) => {
        if (e.keyCode == 13) {
            if (e.target.value === "") {
                props.changeSearchValue("");
                props.changeBoxVisibility(false);
            } else {
                props.changeSearchValue(e.target.value);
                props.changeBoxVisibility(true);
            }
        }
    }
    return (
        <Box
            sx={{
                maxWidth: '100%',
                width: searchBarWidth * 0.45
            }}
        >
            <TextField fullWidth label="Vyhľadaj" id="Vyhľadaj" color="secondary" value={changeableSearchedValue}
                       onKeyDown={keyPress}/>
            {/*<Button>Hladaj</Button>*/}
        </Box>
    );
}

export default SearchBar;
