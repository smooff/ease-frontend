import React, { Component } from 'react';
import { withOktaAuth } from '@okta/okta-react';
import { OktaAuth } from '@okta/okta-auth-js';
import {Link} from "react-router-dom";
import {Button, TextField} from "@material-ui/core";

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
            clientId: '{ClientId}',
            pkce: true
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
        const transaction = await this.oktaAuth.signIn({
            username: this.state.email,
            password: this.state.password
        });

        if (transaction.status === 'SUCCESS') {
            this.props.oktaAuth.signInWithRedirect({sessionToken: transaction.sessionToken})
        } else {
            throw new Error('Could not sign in: ' + transaction.status);
        }
    }

    render() {
        return (
            <form onSubmit={this.signIn} className="login-form">
                <h2>Prihlásenie</h2>
                <p>Prosím prihláste sa pre pokračovanie</p>
                <label className="full-width-input">
                    Email
                    <TextField type="text" placeholder="Email" value={this.state.email} onChange={this.handleEmailChange} required />
                </label>
                <label className="full-width-input">
                    Heslo
                    <TextField type="password" placeholder="Heslo" value={this.state.password} onChange={this.handlePasswordChange} required autoComplete="off" />

                    {/*<input type="password" placeholder="Heslo" value={this.state.password} onChange={this.handlePasswordChange} required autoComplete="off" />*/}
                </label>
                <Button className="button" variant="contained" >Prihlásiť sa</Button>

            </form>
        );
    }
};

export default withOktaAuth(OktaSignInWidget);