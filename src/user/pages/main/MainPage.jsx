import React, {useEffect, useState} from 'react';
import {useOktaAuth} from "@okta/okta-react";
import {Grid, makeStyles} from "@material-ui/core";
import Navbar from "../../components/navbar/Navbar";
import SearchBar from "../../../search/components/searchBar/SearchBar";
import {useWindowDimensions} from "../../../responsiveDesign/components/responsiveUtility/ResponsiveUtility";
import HistoryDrawer from "../../components/historyDrawer/HistoryDrawer";

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
            height: "100vh",
            overflow: "hidden",
            backgroundSize: "cover"
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
            </Grid>
        </Grid>

        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{minHeight: '100%'}}
        >
            <Grid item>
                {/*{boxVisible ? <SearchResultBox searchedValue={searchedValue} windowHeight={height} windowWidht={width}/> : null}*/}
            </Grid>
        </Grid>

    </div>);
}

export default MainPage;
