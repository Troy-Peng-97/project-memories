import React, { useState } from 'react';
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import Input from './Input';
import { GoogleLogin } from 'react-google-login';
import useStyles from './styles';
import Icon from './icon';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useDispatch } from 'react-redux';
import { useHistory, Redirect }from 'react-router-dom';
import { signup, signin } from '../../actions/auth';
const Auth = () => {
    const initialState = { firstName: ' ', lastName: ' ', email: ' ', password: ' ', confirmPassword: ' '};
    const dispatch = useDispatch();
    const history = useHistory();
    const classes = useStyles();
    const [showPassword, setShowPassword] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState(initialState);
    const [rightCredential, setRightCredential] = useState(true);
    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);
    const handleChange = (e) => {
        setFormData( { ...formData, [e.target.name]: e.target.value });
        if (!isSignup){
            setRightCredential(true);
        }
        else {
            if (e.target.name === "email"){
                setRightCredential(true);
            }
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSignup){
            dispatch(signup(formData, history, setRightCredential));
        }
        else {
            dispatch(signin(formData, history, setRightCredential));
        }
    }

    const googleSuccess = async (res) => {
        const result = res?.profileObj;
        const token = res?.tokenId;
        try {
            dispatch({ type : 'AUTH', data: { result, token }})
            history.push('/');
        } catch (error) {
            console.log(error.message);
        }
    }

    const googleFailure = () => {
        console.log("Google Sign In was unsuccessful. Try Again Later");
    }

    const switchMode = () => {
        setIsSignup((prevIsSignUp) => !prevIsSignUp);
        setShowPassword(false);
        setRightCredential(true);
    }
    const redirect = () => {
        history.push('/');
    }
    if (localStorage.getItem('profile')){
       return ( <Redirect to='/' /> )
    }
  
    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography variant="h5">{isSignup ? 'Sign Up' : 'Sign In' }</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        { isSignup && (
                        <>
                            <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half/>
                            <Input name="lastName" label="Last Name" handleChange={handleChange} half/>
                        </>
                        )}
                        <Input name="email" label="Email Address" handleChange={handleChange} type="email"/>
                        <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
                        { isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password"/>}
                        { isSignup && formData.password !== formData.confirmPassword &&
                            <Grid container justify="flex-end">
                                <Grid item >
                                    <i className={classes.invalidCredential}>
                                        Passwords do not match!
                                    </i>
                                </Grid>
                            </Grid>
                        }
                        { !rightCredential && <Grid container justify="flex-end">
                            <Grid item >
                                <i className={classes.invalidCredential}>
                                    {!isSignup ? 
                                    "Invalid Credentials!" : "User already exist!"
                                    }
                                </i>
                            </Grid>
                        </Grid>}
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} disabled={(isSignup && formData.password !== formData.confirmPassword)}>{isSignup ? 'Sign up' : 'Sign In'}</Button>
                    <GoogleLogin 
                        clientId="777136393433-8lfhqrba34cman0vrm6r6jqupcqrfg30.apps.googleusercontent.com"
                        render={(renderProps) => (
                            <Button className={classes.googleButton} color='primary' fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant="contained"> 
                                Google Sign In 
                            </Button>
                        )}
                        onSuccess={googleSuccess}
                        OnFailure={googleFailure}
                        cookiePolicy="single_host_origin"
                    />
                    <Button className={classes.guest} variant="contained" fullWidth onClick={redirect}>
                        Continue without Sign In
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Button onClick={switchMode}>
                                { isSignup ? 
                                    "Aready have an account? Sign In"
                                    : "Don't have an account? Sign Up"
                                }   
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

        </Container>
    )
}

export default Auth;
