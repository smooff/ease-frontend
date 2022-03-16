import React from 'react';
import {AppBar, Box, IconButton, makeStyles, Menu, MenuItem, Toolbar, Typography} from "@material-ui/core";
import {AccountCircle, History} from "@material-ui/icons";
import {useHistory} from "react-router-dom";
import {useOktaAuth} from "@okta/okta-react";

const Navbar = (props) => {

    //styly
    const useStyles = makeStyles(() => ({
        toolbarButtons: {
            marginLeft: 'auto',
        },
        toolbarColor: {
            background: "grey"
        },
        username: {
            marginLeft: "10px"
        }
    }));
    const classes = useStyles();

    const history = useHistory();
    const {authState, oktaAuth} = useOktaAuth();

    const handleLogout = async () => {
        const basename = window.location.origin + history.createHref({pathname: '/'});
        try {
            await oktaAuth.signOut({postLogoutRedirectUri: basename});
        } catch (err) {
            console.log(err);
        }
    };

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDrawerOpen = () => {
        props.historyDrawerState(true);
    }
    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static" className={classes.toolbarColor}>
                <Toolbar variant="dense">
                    <IconButton onClick={handleDrawerOpen} edge="start" color="inherit" aria-label="menu" sx={{mr: 2}}>
                        <History/>
                        <Typography variant="h6" component="div" sx={{flexGrow: 1}} className={classes.username}>
                            História
                        </Typography>
                    </IconButton>

                    <div className={classes.toolbarButtons}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircle/>
                            <Typography variant="h6" component="div" sx={{flexGrow: 1}} className={classes.username}>
                                {props.userName}
                            </Typography>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleClose}>My account</MenuItem>
                            {authState.isAuthenticated && (
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            )}
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Navbar;
