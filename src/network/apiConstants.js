import { getCookie } from '../utils/utils'

export const baseURL = 'http://localhost:8000'
export const headers = (multipart = false) => {
    if (multipart) {
        return {
            'Accept': 'application/json',
            'X-XSRF-TOKEN': getcsrfToken()
        }
    }
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-XSRF-TOKEN': getcsrfToken()
    }
}

export const fetchCSRF = async () => {
    await fetch(`${baseURL}/sanctum/csrf-cookie`, {credentials: "include"})
}

const getcsrfToken = () => {
    return decodeURIComponent(getCookie('XSRF-TOKEN'))
}

async function fetchAPI(url, options = {method: "GET"}, multipart = false) {
    const requestOptions = {
        ...options,
        credentials: "include",
        headers: headers(multipart),
    }
    const response = await fetch(baseURL + url, requestOptions)
    if (response.status === 401) {
        localStorage.removeItem('loggedIn')
        localStorage.removeItem('user')
        window.location.href = '/'
    }   
    return await response.json()
}


export default fetchAPI


