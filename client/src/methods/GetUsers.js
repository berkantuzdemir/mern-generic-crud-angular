import axios from 'axios'

const HTTP = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
})

export const GetUsers = async () => {
    return new Promise((resolve, reject) => {
        HTTP.get('/api/user', { headers: { 'x-access-token': localStorage.getItem('jwt') } })
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => reject(error))
    })
}

export const GetUserDetails = async () => {
    return new Promise((resolve, reject) => {
        HTTP.get('/api/account/get-admin-details', {
            headers: { 'x-access-token': localStorage.getItem('jwt') },
        })
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => reject(error))
    })
}

export const GetUserById = async (id) => {
    return new Promise((resolve, reject) => {
        HTTP.get('/api/user/get-user-by-id', {
            params: { id },
            headers: { 'x-access-token': localStorage.getItem('jwt') },
        })
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

export const UpdateUser = async (body) => {
    await HTTP.put('/api/user', body, {
        headers: { 'x-access-token': localStorage.getItem('jwt') },
    })

        .then((response) => console.log(response))
        .catch((error) => console.log(error))
}

export const DeleteUsersByIds = async (ids) => {
    const payload = {
        ids,
        token: localStorage.getItem('jwt'),
    }
    return new Promise((resolve, reject) => {
        HTTP.delete('/api/user/delete-multiple', { data: payload })
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
