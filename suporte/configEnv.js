require('dotenv').config();

module.exports={
    URLS: {
        ENDPOINT_USERS: process.env.URL_USERS
    },

    HEADERS:{
        API_TOKEN: {"token": "awekrjqhwelrkjqwher"},
        CONTENT_TYPE: {"accept": "application/json"}
    }
}