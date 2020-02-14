import axios from 'axios';

axios.defaults.baseURL = "http://0.0.0.0:5000/"

export default {
    getVideo: (params) => {
        return axios.get('download',{params})
    },

    editVtt: (params) => {
        return axios.get('/vtt/edit',{params})
    }, 

    downloadVtt: (params) => {
        return axios.get('/vtt/final',{params})
    }


}