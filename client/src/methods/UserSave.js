import axios from 'axios'

const HTTP = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
})

const UserSave = async (body) => {
    await HTTP.post('/api/user', body)
        .then((response) => console.log(response))
        .catch((error) => console.log(error))
}
export default UserSave
