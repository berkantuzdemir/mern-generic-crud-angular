import axios from 'axios'

const HTTP = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
})

/**
 * Method to create new Form
 *
 * @param {FormData} formData
 * @returns Promise
 */
export const CreateForm = (formData) => {
    return new Promise((resolve, reject) => {
        HTTP.post('/api/dynamic/create-form', formData, {
            headers: { 'x-access-token': localStorage.getItem('jwt') },
        })
            .then((res) => resolve(res.data))
            .catch((error) => reject(error))
    })
}

export const UpdateForm = (formData) => {
    return new Promise((resolve, reject) => {
        HTTP.put('/api/dynamic/update-form', formData, {
            headers: { 'x-access-token': localStorage.getItem('jwt') },
        })
            .then((res) => resolve(res.data))
            .catch((error) => reject(error))
    })
}

export const GetAvailableForms = () => {
    return new Promise((resolve, reject) => {
        HTTP.get('api/dynamic/get-forms', {
            headers: { 'x-access-token': localStorage.getItem('jwt') },
        })
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err)
            })
    })
}
export const DeleteFormsByIds = (ids) => {
    const payload = {
        form_ids: ids,
        token: localStorage.getItem('jwt'),
    }
    return new Promise((resolve, reject) => {
        HTTP.delete('/api/dynamic/delete-forms', { data: payload })
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
export const CreateAdminAccount = (body) => {
    return new Promise((resolve, reject) => {
        HTTP.post('/api/account/register-as-admin', body, {
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
export const submitFormDocument = (body) => {
    return new Promise((resolve, reject) => {
        HTTP.post('/api/dynamic', body)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
/**
 * Method to get forms by form id
 * @param {String} formId
 * @returns Promise
 */
export const GetForm = (formId) => {
    return new Promise((resolve, reject) => {
        HTTP.post(
            '/api/dynamic/get-form',
            { formId },
            {
                headers: { 'x-access-token': localStorage.getItem('jwt') },
            }
        )
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

export const GetFormDetails = (formId) => {
    return new Promise((resolve, reject) => {
        HTTP.post(
            '/api/dynamic/get-form-details',
            {
                formId,
            },
            {
                headers: { 'x-access-token': localStorage.getItem('jwt') },
            }
        )
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
/**
 * Method to delete form documents by document ids
 *
 * @param {Array} documentIds
 * @param {String} formId
 *
 */
export const DeleteFormDocuments = (documentIds, formId) => {
    const payload = {
        document_ids: documentIds,
        form_id: formId,
        token: localStorage.getItem('jwt'),
    }
    return new Promise((resolve, reject) => {
        HTTP.delete('/api/dynamic/', { data: payload })
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

export const UpdateSelectedDocument = (document, formId) => {
    return new Promise((resolve, reject) => {
        HTTP.put(
            '/api/dynamic/',
            {
                ...document,
                document_id: document._id,
                form_id: formId,
            },
            {
                headers: { 'x-access-token': localStorage.getItem('jwt') },
            }
        )
            .then((res) => resolve(res.data))
            .catch((err) => reject(err))
    })
}
