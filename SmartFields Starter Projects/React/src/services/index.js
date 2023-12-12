import axios from 'axios';

export function executePayment(payment) {
    let axiosConfig = {
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: false
    };
    return axios.post(`http://localhost:9000/automation/TAM-Verification-Tool/test2.php`, payment, axiosConfig);
}