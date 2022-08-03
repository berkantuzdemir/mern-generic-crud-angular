import React, { useEffect, useState } from 'react'
import '../UserCreate.css'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import UserSave from '../methods/UserSave'

const UserCreate = () => {
    const [isLoading, setLoading] = useState(false)
    const FILE_SIZE = 1024 * 1024
    const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png']

    const titles = [
        'Software Engineer',
        'DevOps Engineer',
        'IT System Admin Engineer',
        'Test Automation Engineer',
        'Product Support Engineer',
        'Backend Developer',
        'Frontend Developer',
        'Software Developer',
        'Fullstack Developer',
        'Intern',
        'Other',
    ]

    useEffect(() => {
        document.title = 'Welcome Onboard'
    }, [])

    const formik = useFormik({
        initialValues: {
            fullname: '',
            email: '',
            file: '',
            firstJobDay: '',
            totalWorkTime: '',
            department: '',
            workTitle: '',
            university: '',
            graduationTime: '',
            previousJob: '',
            previousWorkTitle: '',
            skills: '',
            description: '',
        },
        validationSchema: Yup.object({
            fullname: Yup.string().required('Name and surname is a required field'),
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is a required field'),
            firstJobDay: Yup.date().required('Orion start day is a required field'),
            file: Yup.mixed()
                .required('Image is a required field')
                .test(
                    'fileSize',
                    'Image too large. (max: 1024 x 1024)',
                    (value) => value && value.size <= FILE_SIZE
                )
                .test(
                    'fileFormat',
                    'Unsupported Format. (sup: .jpg .png)',
                    (value) => value && SUPPORTED_FORMATS.includes(value.type)
                ),
            university: Yup.string().required('University is a required field'),
            workTitle: Yup.string().required('Position is a required field'),
            department: Yup.string().required('Orion department is a required field'),
            graduationTime: Yup.date().required('Graduation is a required field'),
            skills: Yup.string()
                .min(20, 'Skills must be at least 20 characters')
                .required('Technical skills is a required field'),
            description: Yup.string()
                .min(150, 'About must be at least 150 characters')
                .required('About is a required field'),
        }),
        onSubmit: (values, { resetForm }) => {
            setLoading(true)
            const formData = new FormData()
            Object.keys(values).forEach((key) => {
                formData.append(key, values[key])
            })
            UserSave(formData)
                .then(() => {
                    toast.success('User Submitted!')
                    setLoading(false)
                    setTimeout(() => {
                        resetForm()
                    }, 2000)
                })
                .catch((error) => {
                    toast.error('Submit Failed!')
                    console.log(error)
                })
        },
    })

    return (
        <div className="container">
            <div className="form-body">
                <div className="row">
                    <div className="form-holder">
                        <div className="form-content">
                            <div className="form-items">
                                <div className="row">
                                    <div className="form-group col-md-3">
                                        <h3>Welcome</h3>
                                        <p>TELL US ABOUT YOURSELF</p>
                                    </div>
                                    <div
                                        style={{ textAlign: 'right' }}
                                        className="form-group col-md-9"
                                    >
                                        <Link to="/users" className="btn btn-primary">
                                            Admin Panel
                                        </Link>
                                    </div>
                                </div>
                                <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
                                    <div className="row mt-4">
                                        <div className="form-group col-md-4 col-sm-12">
                                            <label htmlFor="fullname">Full Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="fullname"
                                                onBlur={formik.handleBlur}
                                                placeholder="Name Surname"
                                                name="fullname"
                                                onChange={formik.handleChange}
                                                value={formik.values.fullname}
                                            />
                                            {formik.touched.fullname && formik.errors.fullname ? (
                                                <p className="formikValidate">
                                                    {formik.errors.fullname}
                                                </p>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-4 col-sm-12">
                                            <label htmlFor="email">Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="email"
                                                onBlur={formik.handleBlur}
                                                name="email"
                                                placeholder="name@example.com"
                                                onChange={formik.handleChange}
                                                value={formik.values.email}
                                            />
                                            {formik.touched.email && formik.errors.email ? (
                                                <p className="formikValidate">
                                                    {formik.errors.email}
                                                </p>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-4 col-sm-12">
                                            <div className="form-group">
                                                <label className="mb-1" htmlFor="file">
                                                    Photo
                                                </label>
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    id="file"
                                                    name="file"
                                                    onChange={(e) => {
                                                        formik.setFieldValue(
                                                            'file',
                                                            e.target.files[0]
                                                        )
                                                    }}
                                                />
                                                {formik.touched.file && formik.errors.file ? (
                                                    <p className="formikValidate">
                                                        {formik.errors.file}
                                                    </p>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mt-4">
                                        <div className="form-group mt-1 col-md-4 col-sm-12">
                                            <label className="mb-2" htmlFor="FirstJobDay">
                                                Orion Start Day
                                            </label>
                                            <div className="form-group">
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    id="FirstJobDay"
                                                    onBlur={formik.handleBlur}
                                                    name="firstJobDay"
                                                    onChange={formik.handleChange}
                                                    value={formik.values.firstJobDay}
                                                />
                                                {formik.touched.firstJobDay &&
                                                formik.errors.firstJobDay ? (
                                                    <p className="formikValidate">
                                                        {formik.errors.firstJobDay}
                                                    </p>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-group mt-1 col-md-4 col-sm-12">
                                            <label htmlFor="FirstJobDay">Position</label>
                                            <select
                                                onChange={formik.handleChange}
                                                name="workTitle"
                                                id="FirstJobDay"
                                                className="form-select"
                                            >
                                                <option value={formik.values.workTitle}>
                                                    Open this select menu
                                                </option>
                                                {titles.map((item) => {
                                                    return (
                                                        <option key={item} value={item}>
                                                            {item}
                                                        </option>
                                                    )
                                                })}
                                            </select>
                                            {formik.touched.workTitle && formik.errors.workTitle ? (
                                                <p className="formikValidate">
                                                    {formik.errors.workTitle}
                                                </p>
                                            ) : null}
                                        </div>
                                        <div className="form-group mt-1 col-md-4 col-sm-12">
                                            <div className="form-group">
                                                <label htmlFor="department">Department</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    onBlur={formik.handleBlur}
                                                    id="department"
                                                    placeholder="ex: NRD2208"
                                                    name="department"
                                                    onChange={formik.handleChange}
                                                    value={formik.values.department}
                                                />
                                                {formik.touched.department &&
                                                formik.errors.department ? (
                                                    <p className="formikValidate">
                                                        {formik.errors.department}
                                                    </p>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mt-4">
                                        <div className="form-group mt-1 col-md-8 col-sm-12">
                                            <div className="form-group">
                                                <label htmlFor="university">University</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    onBlur={formik.handleBlur}
                                                    id="university"
                                                    placeholder="ex: Corban University"
                                                    name="university"
                                                    onChange={formik.handleChange}
                                                    value={formik.values.university}
                                                />
                                                {formik.touched.university &&
                                                formik.errors.university ? (
                                                    <p className="formikValidate">
                                                        {formik.errors.university}
                                                    </p>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-group mt-1 col-md-4 col-sm-12">
                                            <label className="mb-2" htmlFor="GraduationTime">
                                                Graduation
                                            </label>
                                            <div className="form-group">
                                                <input
                                                    type="month"
                                                    className="form-control"
                                                    id="GraduationTime"
                                                    onBlur={formik.handleBlur}
                                                    name="graduationTime"
                                                    onChange={formik.handleChange}
                                                    value={formik.values.graduationTime}
                                                />
                                                {formik.touched.graduationTime &&
                                                formik.errors.graduationTime ? (
                                                    <p className="formikValidate">
                                                        {formik.errors.graduationTime}
                                                    </p>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mt-4">
                                        <div className="form-group mt-1 col-md-4 col-sm-12">
                                            <label htmlFor="PreviousJob">Previous Job</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="PreviousJob"
                                                name="previousJob"
                                                placeholder="ex: Corporate consulting"
                                                onChange={formik.handleChange}
                                                value={formik.values.previousJob}
                                            />
                                        </div>
                                        <div className="form-group mt-1 col-md-4 col-sm-12">
                                            <label htmlFor="previousWorkTitle">
                                                Previous Position
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="previousWorkTitle"
                                                name="previousWorkTitle"
                                                placeholder="ex: Backend Developer"
                                                onChange={formik.handleChange}
                                                value={formik.values.previousJobTitle}
                                            />
                                        </div>
                                        <div className="form-group mt-1 col-md-4 col-sm-12">
                                            <div className="form-group">
                                                <label htmlFor="TotalWorkTime">
                                                    Total Experience
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="TotalWorkTime"
                                                    name="totalWorkTime"
                                                    placeholder="ex: 2 years "
                                                    onChange={formik.handleChange}
                                                    value={formik.values.totalWorkTime}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mt-4">
                                        <div className="form-group mt-1 col-md-12 col-sm-12">
                                            <label htmlFor="Skills">Technical Skills</label>
                                            <textarea
                                                className="form-control mt-2"
                                                id="Skills"
                                                name="skills"
                                                placeholder=" ex: PHP, Vue.js, AWS.."
                                                onBlur={formik.handleBlur}
                                                rows="3"
                                                onChange={formik.handleChange}
                                                value={formik.values.skills}
                                            />
                                            {formik.touched.skills && formik.errors.skills ? (
                                                <p className="formikValidate">
                                                    {formik.errors.skills}
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="row mt-4">
                                        <div className="form-group mt-1 col-md-12 col-sm-12">
                                            <label htmlFor="Description">About</label>
                                            <textarea
                                                className="form-control mt-2"
                                                name="description"
                                                onBlur={formik.handleBlur}
                                                id="description"
                                                rows="3"
                                                onChange={formik.handleChange}
                                                value={formik.values.description}
                                            />
                                            {formik.touched.description &&
                                            formik.errors.description ? (
                                                <p className="formikValidate">
                                                    {formik.errors.description}
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div
                                        style={{ textAlign: 'center' }}
                                        className="form-button mt-4"
                                    >
                                        {!isLoading ? (
                                            <button
                                                id="submit"
                                                type="submit"
                                                className="btn btn-primary"
                                            >
                                                Submit
                                            </button>
                                        ) : (
                                            <button
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

export default UserCreate
