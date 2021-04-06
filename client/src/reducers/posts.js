// a reducer is a function

import Posts from "../components/Posts/Posts";

export default (posts = [], action) => {
    switch (action.type){
        case 'FETCH_ALL':
            return action.payload;
        case 'CREATE':
            return Posts;
        default:
            return Posts;
    }
}