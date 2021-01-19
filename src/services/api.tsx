import axios from 'axios';
import { URL_BACK_END } from '@env';
console.log('URL_BACK_END: ',URL_BACK_END)
const api = axios.create({
    baseURL: URL_BACK_END,
    timeout: 5000
    
});
//lt --port 3001 --subdomain happy
export default api;