import {Axios} from "axios";

const BACKEND_URL = '';

export const axios = new Axios({
    baseURL: BACKEND_URL
});

export const api = {
    users: {},
    courses: {},
};