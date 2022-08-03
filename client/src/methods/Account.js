const axios = require('axios')

const HTTP = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
})

export const Login = (username, password) => {
    return new Promise((resolve, reject) => {
        HTTP.post('/api/account/login', { username, password })
            .then((res) => resolve(res))
            .catch((err) => reject(err))
    })
}

export const RegisterAsAdmin = (data) => {
    return new Promise((resolve, reject) => {
        HTTP.post('/api/account/register-as-admin', data, {
            headers: { 'x-access-token': localStorage.getItem('jwt') },
        })
            .then((res) => resolve(res))
            .catch((err) => reject(err))
    })
}

export const isExpired = () => {
    return new Promise((resolve, reject) => {
        HTTP.post('/api/account/is-expired', { token: localStorage.getItem('jwt') })
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                console.log(err)
                reject(err)
            })
    })
}

export const getRole = () => {
    return new Promise((resolve, reject) => {
        HTTP.post('/api/account/get-role', { token: localStorage.getItem('jwt') })
            .then((res) => resolve(res.data))
            .catch((err) => {
                console.log(err)
                reject(err)
            })
    })
}
