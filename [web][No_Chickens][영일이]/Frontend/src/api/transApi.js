import axios from "axios"

export const getReceipt = (file, fType, country) => {
    var csrftoken = getCookie('csrftoken');
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('imgBase64', fType);
        formData.append('country', country);
        return axios.post(
            'http://10.83.32.154:3000/accounts/v1/receipt/',
            formData,
            {
                headers: {
                    'X-CSRFTOKEN': csrftoken,
                },
            },
        );
    } catch (error) {
        console.error(error);
    }
};