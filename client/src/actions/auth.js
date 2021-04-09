import { AUTH } from '../constants/actionTypes';

import * as api from '../api/index.js';

export const signin = (formData, history, setRightCredential) => async (dispatch) => {
    try {
        // log in the user...
        const { data } = await api.signIn(formData);
        dispatch({ type : AUTH, data});
        history.push('/');
    } catch (error) {
        console.log(error.message);
        setRightCredential(false);
    }
}

export const signup = (formData, history,setRightCredential) => async (dispatch) => {
    try {
        const { data } = await api.signUp(formData);
        dispatch({ type : AUTH, data});
        history.push('/');
    } catch (error) {
        console.log(error);
        setRightCredential(false);
    }
}