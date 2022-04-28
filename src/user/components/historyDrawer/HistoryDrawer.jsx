import React, {useEffect, useState} from 'react';
import Drawer from '@mui/material/Drawer';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {styled, useTheme} from '@mui/material/styles';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {ArrowRight} from "@material-ui/icons";
import {TablePagination} from "@mui/material";
import {ArrowCircleLeftTwoTone} from "@mui/icons-material";
import axios from "axios";
import {useOktaAuth} from "@okta/okta-react";
import {makeStyles} from "@material-ui/core";
import {useRecoilState} from "recoil";
import {SearchHistoryString} from "../../../search/state/searchHistoryString/SearchHistoryString";

const drawerWidth = 435;

const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const HistoryDrawer = (props) => {

    const useStyles = makeStyles({
        toolbar: {
            "& > p:nth-of-type(2)": {
                fontSize: "0.875rem",
                fontWeight: 600
            }
        }
    });
    const classes = useStyles();

    const theme = useTheme();

    const {authState, oktaAuth} = useOktaAuth();

    const handleDrawerClose = () => {
        props.closeDrawer(false)
    }

    //sluzi na prenos stringu z history drawera do search fieldu
    const [historyWordString, setHistoryWordString] = useRecoilState(SearchHistoryString);
    const handleClickHistoryString = (event, text) => {
        setHistoryWordString(text);
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
        makeRequestHistory(rowsPerPage, count);
    };
    //pri zmene poctu zaznamov sa nastavuje strana na prvu (0)
    const handleChangeRowsPerPage = (event) => {
        const rowsPerPage = parseInt(event.target.value, 10);
        const count = 0;
        setRowsPerPage(rowsPerPage);
        setPageCount(count);
        makeRequestHistory(rowsPerPage, count);
    };

    const makeRequestHistory = (pageSize, page) => {
        return axios.get(
            'https://tp2-ai.fei.stuba.sk:8080/user/searchHistory', {
                headers: {Authorization: `Bearer ${authState.accessToken.accessToken}`},
                params: {
                    pageSize,
                    page
                }
            }
        ).then((res) => {
            setHistoryData(res.data);
        }).catch(console.log);
    }

    const [historyData, setHistoryData] = useState(0);

    const dateConverter = (date) => {
        const formatedDate = new Date(date);
        var formatedHour = formatedDate.getHours();
        formatedHour = ("0"+formatedHour).slice(-2);
        var formatedMinutes = formatedDate.getMinutes();
        formatedMinutes = ("0"+formatedMinutes).slice(-2);
        return (formatedDate.getDate() + "." + (formatedDate.getMonth() + 1) + "." + formatedDate.getFullYear() + " " + formatedHour + ":" + formatedMinutes);
    }

    //fetch dat po otvoreni history drawera
    useEffect(async () => {
        const result = await axios.get(
            'https://tp2-ai.fei.stuba.sk:8080/user/searchHistory', {
                headers: {Authorization: `Bearer ${authState.accessToken.accessToken}`}
            }
        ).then((res) => {
            setHistoryData(res.data);
        }).catch(console.log);

    }, []);

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="persistent"
            anchor="left"
            open={props.drawerState}
        >
            <DrawerHeader>

                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'ltr' ? <ArrowCircleLeftTwoTone/> : <ChevronRightIcon/>}
                </IconButton>
            </DrawerHeader>
            <Divider/>
            {historyData.results !== undefined ?
                <List>
                    {historyData.results.map(text => {

                        return (
                            <ListItem button key={text.id}
                                      onClick={(e) => handleClickHistoryString(e, text.searchedExpression)}>
                                <ListItemIcon>
                                    <ArrowRight/>
                                </ListItemIcon>
                                <ListItemText primary={text.searchedExpression} secondary={dateConverter(text.time)}/>
                            </ListItem>
                        )
                    })}
                    <ListItem>
                        {historyData.results !== undefined ? <TablePagination
                            classes={{
                                toolbar: classes.toolbar
                            }}
                            component="div"
                            count={historyData.numAllResults}
                            page={pageCount}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            labelRowsPerPage={"Počet záznamov"}
                        /> : ""}
                    </ListItem>
                </List>
                : ""}


        </Drawer>);
}

export default HistoryDrawer;
