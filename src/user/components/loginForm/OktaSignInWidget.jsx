import React, {Component} from 'react';
import {withOktaAuth} from '@okta/okta-react';
import {OktaAuth} from '@okta/okta-auth-js';
import {Button, Grid, TextField} from '@material-ui/core';
import {withRouter} from 'react-router-dom';

import {withStyles,useMediaQuery} from '@material-ui/styles';

const styles = theme => ({
    title: {
        marginTop: "15%"
    },
    loginButton: {
        width: "100%",
        align: "center"
    },
    box: {
        padding: "1%",
        width: "60%",
        float: "right"
    },
    text: {
        padding: "1%",
        marginBottom: "1%",
        float:"center"
    },
    between: {
        marginBottom: "1%"
    },
    fields: {
        width: "30%"
    },
    loginText: {
        color: "grey"
    },
    mainDiv: {
        backgroundImage: "url(/easeBackground.jpg)",
        height: "100vh",
        overflow: "hidden",
        backgroundSize: "cover"
    }

});

class OktaSignInWidget extends Component {

    constructor(props) {
        super(props);

        this.state = {
            sessionToken: null,
            email: '',
            password: ''
        };

        this.oktaAuth = new OktaAuth({
            issuer: props.baseUrl,
            clientId: process.env.REACT_APP_CLIENT_ID,
            pkce: true,
        });

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.signIn = this.signIn.bind(this);
    }

    handleEmailChange(event) {
        this.setState({email: event.target.value});
    }

    handlePasswordChange(event) {
        this.setState({password: event.target.value});
    }

    async signIn(event) {
        event.preventDefault();
        console.log(this.state.email);
        const transaction = await this.oktaAuth.signIn({
            username: this.state.email,
            password: this.state.password
        });

        if (transaction.status === 'SUCCESS') {
            this.props.oktaAuth.signInWithRedirect({sessionToken: transaction.sessionToken});
            const {history} = this.props;
            history.push('/ease');
        }else {

            throw new Error('Could not sign in: ' + transaction.status);
        }
    }

    render() {
        const {classes} = this.props;
        return (
            <Grid className={classes.mainDiv}>
            <Grid className={classes.box} item xs={12}>

                <form onSubmit={this.signIn}>
                    <Grid className={classes.loginText}>
                        <h2>Prihlásenie</h2>
                    </Grid>

                    <Grid className={classes.between}>
                        <Grid className={classes.text}> Email </Grid>
                        <TextField className={classes.fields} variant="outlined" type="text" placeholder="Email"
                                   value={this.state.email} onChange={this.handleEmailChange} required/>
                    </Grid>

                    <Grid className={classes.between}>
                        <Grid className={classes.text}>Heslo </Grid>
                        <TextField className={classes.fields} variant="outlined" type="password" placeholder="Heslo"
                                   value={this.state.password}
                                   onChange={this.handlePasswordChange} required autoComplete="off"/>
                    </Grid>

                    <Grid className={classes.loginButton}>
                        <Button className="button" variant="contained" type="submit">Prihlásiť sa</Button>
                    </Grid>
                </form>
            </Grid>
            </Grid>
        );
    }
}
OktaSignInWidget = withStyles(styles, {name: 'Okta'})(OktaSignInWidget);
export default withRouter(withOktaAuth(OktaSignInWidget));
