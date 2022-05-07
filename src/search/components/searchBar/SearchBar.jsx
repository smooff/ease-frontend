import React, {useEffect, useRef, useState} from 'react';
import {Box} from "@material-ui/core";
import TextField from '@mui/material/TextField';
import {Grid, makeStyles} from "@material-ui/core";
import axios from "axios";
import {useOktaAuth} from "@okta/okta-react";
import {Button, Dialog, DialogTitle, TablePagination} from "@mui/material";
import DataTreeView from "../dataTreeView/DataTreeView";
import SearchFilter from "../searchFilter/SearchFilter";
import {useRecoilState} from "recoil";
import {SearchHistoryString} from "../../state/searchHistoryString/SearchHistoryString";
import BasicGraphModal from "../../../graphs/components/basicGraphModal/BasicGraphModal";
import GraphUniversalModal from "../../../graphs/components/basicGraphModal/GraphUniversalModal";

const SearchBar = (props) => {

    const searchBarWidth = props.windowWidth;

    const useStyles = makeStyles(() => ({
        searchButton: {
            marginTop: "10px",
            marginBottom: "10px",
        },
        dataTreeStyles: {
            paddingBottom: "100px",
        },
        toolbar: {
            "& > p:nth-of-type(2)": {
                fontSize: "0.875rem",
                fontWeight: 600
            }
        },
        textFieldBackground:{
            backgroundColor:"rgba(0, 0, 0, .1)"
        }
    }));
    const classes = useStyles();

    const [responseData, setResponseData] = useState();

    //typ entity z dropdownu
    const [dropDownEntityType, setDropDownEntityType] = useState(null);
    const changeDropDownEntityType = (text) => {
        setDropDownEntityType(text);
    };

    //diagramDetailedTypes z dropdownu
    const [dropDownDiagramDetailedTypes, setDropDownDiagramDetailedTypes] = useState(null);
    const changeDropDownDiagramDetailedTypes = (text) => {
        setDropDownDiagramDetailedTypes(text);
    };

    //objectDetailedTypes z dropdownu
    const [dropDownObjectDetailedTypes, setDropDownObjectDetailedTypes] = useState(null);
    const changeDropDownObjectDetailedTypes = (text) => {
        setDropDownObjectDetailedTypes(text);
    };

    //string, podla ktoreho sa bude zoradovat
    const [orderKeySort, setOrderKeySort] = React.useState(null);
    const changeOrderKeySort = (text) => {
        setOrderKeySort(text);
    };
    //zoradenie
    const [descendingSort, setDescendingSort] = React.useState(null);
    const changeDescendingSort = (text) => {
        setDescendingSort(text);
        if (text === null) {
            changeOrderKeySort(null);
        } else {
            changeOrderKeySort("name");
        }
    };

    //PAGING
    //page, na ktorej je defaultne - cize na prvej
    const [pageCount, setPageCount] = React.useState(0);
    //pocet poloziek na page
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    //pri zmene stran vyhladanych vysledkov sa nastavuje pocet zaznamov zo statu
    const handleChangePage = (event, newPage) => {
        const count = newPage;
        setPageCount(count);
        handleSearch(rowsPerPage, count);
    };
    //pri zmene poctu zaznamov sa nastavuje strana na prvu (0)
    const handleChangeRowsPerPage = (event) => {
        const rows = parseInt(event.target.value, 10);
        const count = 0;
        setRowsPerPage(rows);
        setPageCount(count);
        handleSearch(rows, count);
    };

    //auth
    const {authState, oktaAuth} = useOktaAuth();

    //config pre request
    const config = {
        headers: {Authorization: `Bearer ${authState.accessToken.accessToken}`}
    };

    const makeRequest = (changeableSearchedValue, rows, count) => {
        return axios.put(
            'https://tp2-ai.fei.stuba.sk:8080/core/search/general',
            {
                name: changeableSearchedValue,
                entityTypeFilter: dropDownEntityType,
                objectDetailedTypeFilter: dropDownObjectDetailedTypes,
                diagramDetailedTypes: dropDownDiagramDetailedTypes,
                pagingFilter: {
                    pageSize: rows,
                    page: count,
                    descending: descendingSort,
                    orderKey: orderKeySort
                }
            },
            config
        ).then((res) => {
            setResponseData("");
            setResponseData(res.data);
            makeRequestUserSearchHistory(changeableSearchedValue);
        }).catch(console.log);
    }

    //request na zaznamenie historie vyhladavania
    const makeRequestUserSearchHistory = (query) => {
        return axios.post(
            'https://tp2-ai.fei.stuba.sk:8080/user/searchHistory', null, {
                headers: {Authorization: `Bearer ${authState.accessToken.accessToken}`},
                params: {
                    query,
                }
            }
        ).then(response => response.status).catch(console.log);
    }

    //handle enter key for submitting searched value
    const nameForm = useRef(null);

    const handleSearch = (rows, count) => {
        const form = nameForm.current;
        var changeableSearchedValue = `${form['searchvalue'].value}`;
        if (changeableSearchedValue === "") {
            setResponseData("");
            return false;
        }
        props.changeSearchValue(changeableSearchedValue);
        props.changeBoxVisibility(true);
        if (rows) {
            makeRequest(changeableSearchedValue, rows, count);
        } else {
            makeRequest(changeableSearchedValue, rowsPerPage, pageCount);
        }

        return true;
    }

    //vyhladanie po stlaceni Enteru, nastavi 10 zaznamov na stranu + nastavi prvu (0) stranu
    const handleKeyPress = (e) => {
        setRowsPerPage(10);
        setPageCount(0);
        if (e.keyCode == 13) {
            if (!handleSearch(10, 0)) {
                props.changeSearchValue("");
                props.changeBoxVisibility(false);
            }
        }
    }

    //vyhladanie po kliknuti na tlacidlo, nastavi 10 zaznamov na stranu + nastavi prvu (0) stranu
    const handleClickEventSearch = () => {
        setRowsPerPage(10);
        setPageCount(0);
        if (!handleSearch(10, 0)) {
            props.changeSearchValue("");
            props.changeBoxVisibility(false);
        }
    }

    //submit prevention
    const onSubmit = (event) => {
        event.preventDefault();
    };
    const [historyString, setHistoryString] = useRecoilState(SearchHistoryString);


    //GENERAL GRAF
    const [openModalGraph, setOpenModalGraph] = React.useState(false);
    const handleClickOpenModalGraph = () => {
        setOpenModalGraph(true);
    };
    const handleCloseModalGraph = () => {
        setOpenModalGraph(false);
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
                               onKeyDown={handleKeyPress} onChange={e => setHistoryString(e.target.value)}
                               value={historyString} className={classes.textFieldBackground}
                    />
                </form>
            </Grid>
            <Grid className={classes.searchButton}>
                <Button onClick={handleClickEventSearch} variant="contained"
                        className={classes.searchButton}>Vyhľadaj</Button>

                <Button onClick={handleClickOpenModalGraph} variant="contained"
                        className={classes.searchButton}>Všeobecný graf</Button>

                <SearchFilter changeDropDownEntity={changeDropDownEntityType}
                              changeDropDownDiagram={changeDropDownDiagramDetailedTypes}
                              changeDropDownObject={changeDropDownObjectDetailedTypes}
                              changeDescending={changeDescendingSort}
                ></SearchFilter>
            </Grid>
            {responseData ? <> <DataTreeView treeItems={responseData} className={classes.dataTreeStyles}/>
                <TablePagination
                    classes={{
                        toolbar: classes.toolbar
                    }}
                    component="div"
                    count={responseData.numAllResults}
                    page={pageCount}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage={"Počet záznamov"}
                />

            </> : ""}
            <Dialog fullWidth={true} maxWidth={"xl"} scroll={"paper"} onClose={handleCloseModalGraph}
                    open={openModalGraph}>
                <DialogTitle onClose={handleCloseModalGraph}>
                    <GraphUniversalModal graphType={"generalGraph"}/>
                </DialogTitle>
            </Dialog>
        </Box>
    );
}

export default SearchBar;
