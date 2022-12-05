import axios from "axios";
// axios.defaults.baseURL ='https://testserver.virtuelsolutions.com/api/';
// axios.defaults.baseURL = "http://localhost:4000/api/v1";
axios.defaults.baseURL = "http://192.168.1.2:4000/api/v1";
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";
