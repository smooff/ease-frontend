import React, {useEffect, useRef, useState} from 'react';
import {Box} from "@material-ui/core";
import TextField from '@mui/material/TextField';
import {Grid, makeStyles} from "@material-ui/core";
import axios from "axios";
import {useOktaAuth} from "@okta/okta-react";
import {Button, TablePagination} from "@mui/material";
import DataTreeView from "../dataTreeView/DataTreeView";

const SearchBar = (props) => {

    const searchBarWidth = props.windowWidth;

    const useStyles = makeStyles(() => ({
        searchButton: {
            marginTop: "10px",
            marginBottom:"10px",
        },
        dataTreeStyles:{
            paddingBottom:"100px",
        }
    }));
    const classes = useStyles();

    const [responseData, setResponseData] = useState();

    //PAGING
    //page, na ktorej je defaultne - cize na prvej
    const [pageCount, setPageCount] = React.useState(0);
    //pocet poloziek na page
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const handleChangePage = (event, newPage) => {
        setPageCount(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPageCount(0);
    };

    //auth
    const {authState, oktaAuth} = useOktaAuth();

    //request
    const config = {
        headers: {Authorization: `Bearer ${authState.accessToken.accessToken}`}
    };
    const bodyParameters = {
        name: "",
        pagingFilter: {
            pageSize: rowsPerPage,
            page: pageCount
        }
    };
    const makeRequest = () => {
        return axios.put(
            'https://tp2-ai.fei.stuba.sk:8080/core/search/general',
            bodyParameters,
            config
        ).then((res) => {
            setResponseData("");
            setResponseData(res.data);
        }).catch(console.log);
    }

    //handle enter key for submitting searched value
    const nameForm = useRef(null);

    const handleSearch = () => {
        const form = nameForm.current;
        var changeableSearchedValue = `${form['searchvalue'].value}`;
        if (changeableSearchedValue === "") {
            setResponseData("");
            return false;
        }
        props.changeSearchValue(changeableSearchedValue);
        props.changeBoxVisibility(true);
        bodyParameters.name = changeableSearchedValue;
        makeRequest();
        return true;
    }

    const handleKeyPress = (e) => {
        if (e.keyCode == 13) {
            if (!handleSearch()) {
                props.changeSearchValue("");
                props.changeBoxVisibility(false);
            }
        }
    }

    //handle click button for submitting searched value
    const handleClickEvent = () => {
        if (!handleSearch()) {
            props.changeSearchValue("");
            props.changeBoxVisibility(false);
        }
    }

    //submit prevention
    const onSubmit = (event) => {
        event.preventDefault();
    };

    return (
        <Box
            sx={{
                maxWidth: '100%',
                width: searchBarWidth * 0.45
            }}
        >
            <Grid>
                <form ref={nameForm} onSubmit={onSubmit}>
                    <TextField fullWidth label="Vyhľadaj" id="Vyhľadaj" color="secondary" name={'searchvalue'}
                               onKeyDown={handleKeyPress}
                    />
                </form>
            </Grid>
            <Grid className={classes.searchButton}>
                <Button onClick={handleClickEvent} variant="contained"
                        className={classes.searchButton}>Vyhľadaj</Button>
            </Grid>
            {responseData ?<> <DataTreeView treeItems={responseData} className={classes.dataTreeStyles}/>
                <TablePagination
                component="div"
                count={responseData.numAllResults}
                page={pageCount}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage={"Strana"}
                />

            </>: ""}
        </Box>
    );
}

export default SearchBar;
