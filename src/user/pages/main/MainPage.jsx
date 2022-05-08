import React, {useEffect, useState} from 'react';
import {useOktaAuth} from "@okta/okta-react";
import {Grid, makeStyles} from "@material-ui/core";
import Navbar from "../../components/navbar/Navbar";
import SearchBar from "../../../search/components/searchBar/SearchBar";
import {useWindowDimensions} from "../../../responsiveDesign/components/responsiveUtility/ResponsiveUtility";
import HistoryDrawer from "../../components/historyDrawer/HistoryDrawer";
import FileUpload from "../../../fileUpload/components/FileUpload";
import axios from "axios";
import {useRecoilState} from "recoil";
import {GraphColorsState} from "../../../graphs/state/graphColorsState/GraphColorsState";

const MainPage = (props) => {

    const [openHistoryDrawer, setOpenHistoryDrawer] = React.useState(false);
    const handleHistoryDrawerOpen = (x) => {
        setOpenHistoryDrawer(x);
    };
    const handleHistoryDrawerClose = (x) => {
        setOpenHistoryDrawer(x);
    };

    //result box visibility
    const [boxVisible, setBoxVisible] = useState(false);
    const changeBoxVisible = (text) => {
        setBoxVisible(text);
    };
    //searched value
    const [searchedValue, setSearchedValue] = useState();
    const changeSearchedValue = (text) => {
        setSearchedValue(text);
    };

    //window dimensions for responsive design
    const {height, width} = useWindowDimensions();

    const [searchBarMarginTop, setSearchBarMarginTop] = useState('14rem');

    useEffect(() => {
        if (boxVisible) {
            setSearchBarMarginTop('2rem');
        } else {
            setSearchBarMarginTop('14rem');
        }
    }, [boxVisible]);

    //styles
    const useStyles = makeStyles(() => ({
        searchBar: {
            marginTop: searchBarMarginTop
        },
        logo: {
            width: "388px",
            height: "161px",
        },
        //styly, pre 100% height, kvoli pozadiu
        mainDiv: {
            backgroundImage: "url(/easeBackground.jpg)",
            backgroundSize: "100% 100%",
            height: "100%",
            minHeight: "100vh",
        }
    }));
    const classes = useStyles();

    //auth
    const {authState, oktaAuth} = useOktaAuth();
    const [userInfo, setUserInfo] = useState(null);
    useEffect(() => {
        if (!authState || !authState.isAuthenticated) {
            // When user isn't authenticated, forget any user info
            setUserInfo(null);
        } else {
            oktaAuth.getUser().then((info) => {
                setUserInfo(info);
            }).catch((err) => {
                console.error(err);
            });
        }
    }, [authState, oktaAuth]); // Update if authState changes

    //pociatocne fetchovanie farieb pre hrany v grafoch
    const [fetchColors, setFetchColors] = useState(false);
    const [colorsState, setColorsState] = useRecoilState(GraphColorsState);
    if (fetchColors === false) {
        setFetchColors(true);

        const colors = axios.get(
            'https://tp2-ai.fei.stuba.sk:8080/graph/relation/filterContents', {
                headers: {Authorization: `Bearer ${authState.accessToken.accessToken}`},
            }
        ).then((res) => {
            setColorsState(res.data)
        }).catch(console.log);
    }

    return (<div className={classes.mainDiv}>
        <Navbar userName={userInfo?.name} historyDrawerState={handleHistoryDrawerOpen}/>

        <HistoryDrawer drawerState={openHistoryDrawer} closeDrawer={handleHistoryDrawerClose}/>
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            className={classes.searchBar}
        >
            <Grid item>
                <img src="logo-nobackground.png" className={classes.logo}/>
            </Grid>
            <Grid item>
                <SearchBar changeBoxVisibility={changeBoxVisible} changeSearchValue={changeSearchedValue}
                           windowWidth={width}/>
                <FileUpload/>
            </Grid>

        </Grid>
    </div>);
}

export default MainPage;
