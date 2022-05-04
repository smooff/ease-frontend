import React, {Component} from 'react';
import {withOktaAuth} from '@okta/okta-react';
import {isAuthApiError, OktaAuth} from '@okta/okta-auth-js';
import {Button, Grid, TextField} from '@material-ui/core';
import {withRouter} from 'react-router-dom';
import {withStyles,useMediaQuery} from '@material-ui/styles';
import {Alert} from "@material-ui/lab";


const styles = theme => ({
    title: {
        marginTop: "15%"
    },
    loginButton: {
        width: "100%",
        align: "center",
        paddingTop: "2%",
        marginLeft: "33%"
    },
    box: {
        width: "500px",
        margin : "auto",
        padding: "16px"
    },
    text: {
        padding: "1%",
        marginBottom: "1%",
        float:"center",
        fontstyle: "bold"

    },
    between: {
        marginBottom: "1%"
    },
    fields: {
        width: "100%"
    },
    loginText: {
        color: "grey",
        align: "center",
        fontstyle: "bold",
        marginLeft: "33%"
    },
    mainDiv: {
        backgroundImage: "url(/easeBackground.jpg)",
        height: "100vh",
        overflow: "hidden",
        backgroundSize: "cover"
    },
    alertmsg :{
        width: "450px",
        margin : "auto",
        paddingLeft:"6px"
    }

});

class OktaSignInWidget extends Component {

    constructor(props) {
        super(props);

        this.state = {
            sessionToken: null,
            email: '',
            password: '',
            hasError: false,
            errorMessage: ''
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
        }).catch(error => {
            this.setState({ errorMessage: "Nesprávne prihlasovacie údaje." });
            console.error( error);
        });

        if (transaction.status === 'SUCCESS') {
            this.props.oktaAuth.signInWithRedirect({sessionToken: transaction.sessionToken});
            const {history} = this.props;
            this.state.hasError = false;
            history.push('/ease');
        }else{
            this.state.hasError = true;
            console.log(this.state.hasError)
        }
    }

    render() {
        const {classes} = this.props;
        return (
            <Grid className={classes.mainDiv}>

            <Grid className={classes.box} item xs={12}>

                <form onSubmit={this.signIn}>


                    <Grid className={classes.loginText} is>
                        <h2>Prihlásenie</h2>
                    </Grid>
                    { this.state.errorMessage &&
                    <Alert className={classes.alertmsg} severity="error" > { this.state.errorMessage } </Alert>
                    }
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
