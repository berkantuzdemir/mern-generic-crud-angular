import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { isExpired, Login } from '../methods/Account'

const DynamicLoginPage = () => {
    const [isLoading, setLoading] = useState(false)
    const navigate = useNavigate()
    useEffect(() => {
        isExpired().then((res) => {
            if (!res) {
                navigate('/dynamic/form-list')
            }
        })
    }, [navigate])

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Username is required'),
            password: Yup.string().required('Password is required'),
        }),
        onSubmit: (values) => {
            setLoading(true)
            Login(values.username, values.password)
                .then((res) => {
                    if (res.data.token) {
                        localStorage.setItem('jwt', res.data.token)
                        navigate('/dynamic/form-list')
                    }
                })
                .catch((err) => {
                    setLoading(false)
                    toast.error('Login failed! Wrong username or password.', { autoClose: 2000 })
                    console.log(err)
                })
        },
    })

    return (
        <div className="container">
            <div className="form-body">
                <div className="row">
                    <div className="form-holder">
                        <div className="form-content">
                            <div className="form-items login">
                                <div className="row">
                                    <div className="form-group col-md-9">
                                        <h3>LOG IN</h3>
                                        <p>ACCESSING PANEL</p>
                                    </div>
                                    <div
                                        style={{ textAlign: 'right' }}
                                        className="form-group col-md-3"
                                    >
                                        <Link
                                            to="/"
                                            style={{ background: '#495056' }}
                                            class="btn btn-primary"
                                        >
                                            Back
                                        </Link>
                                    </div>
                                </div>
                                <form onSubmit={formik.handleSubmit} encType="">
                                    <div className="row mt-4">
                                        <div className="form-group col-md-12">
                                            <label htmlFor="name">Username</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="name"
                                                onChange={formik.handleChange}
                                                value={formik.username}
                                                name="username"
                                            />
                                            {formik.errors.username && formik.errors.username ? (
                                                <p className="formikValidate">
                                                    {formik.errors.username}
                                                </p>
                                            ) : null}
                                        </div>
                                        <div className="form-group mt-4 col-md-12">
                                            <label htmlFor="Surname">Password</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="surname"
                                                onChange={formik.handleChange}
                                                value={formik.password}
                                                name="password"
                                            />
                                            {formik.touched.password && formik.errors.password ? (
                                                <p className="formikValidate">
                                                    {formik.errors.password}
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div
                                        style={{ textAlign: 'center' }}
                                        className="form-button mt-3"
                                    >
                                        {!isLoading ? (
                                            <button
                                                style={{ background: 'coral ' }}
                                                id="submit"
                                                type="submit"
                                                className="btn btn-primary"
                                            >
                                                Login
                                            </button>
                                        ) : (
                                            <button
                                                style={{ background: 'coral ' }}
                                                id="submit"
                                                type="submit"
                                                className="btn btn-primary"
                                            >
                                                <span
                                                    className="spinner-border spinner-border-sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                />
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DynamicLoginPage
