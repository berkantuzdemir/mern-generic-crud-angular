import React from 'react' //, { useState, useEffect }
import '../UserCreate.css'
import { useState } from 'react'
import { UpdateUser } from '../methods/GetUsers'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify' //, ToastContainer
import 'react-toastify/dist/ReactToastify.css'
import useStore from '../store'

const UserEdit = (props) => {
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

    const store = useStore()
    const toggleUpdate = store.toggleUpdate
    const [isLoading, setLoading] = useState(false)

    const urlToObject = async (image) => {
        const response = await fetch(process.env.REACT_APP_API_URL + image)
        const blob = await response.blob()
        const file = new File([blob], 'image.jpg', { type: blob.type })
        return file
    }
    //const FILE_SIZE = 1024 * 1024;
    /*const SUPPORTED_FORMATS = [
    "image/jpg",
    "image/jpeg",
    "image/png"
  ]; */

    const formik = useFormik({
        initialValues: {
            fullname: props.data.fullname,
            email: props.data.email,
            file: '',
            firstJobDay: props.data.firstJobDay ? props.data.firstJobDay.substring(0, 10) : null,
            totalWorkTime: props.data.totalWorkTime ? props.data.totalWorkTime : null,
            university: props.data.university,
            department: props.data.department,
            graduationTime: props.data.graduationTime
                ? props.data.graduationTime.substring(0, 10)
                : null,
            previousJob: props.data.previousJob ? props.data.previousJob : null,
            skills: props.data.skills,
            description: props.data.description,
            previousWorkTitle: props.data.previousWorkTitle ? props.data.previousWorkTitle : null,
            workTitle: props.data.workTitle,
        },
        validationSchema: Yup.object({
            fullname: Yup.string().required('Name and surname is a required field'),
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is a required field'),
            firstJobDay: Yup.date().required('Orion start day is a required field'),
            // file: Yup.mixed()
            //         .NoRequired("Image is a required field")
            //         .test(
            //             "fileSize",
            //             "Image too large. (max: 1024 x 1024)",
            //             value => value && value.size <= FILE_SIZE
            //         )
            //         .test(
            //             "fileFormat",
            //             "Unsupported Format. (sup: .jpg .png)",
            //             value => value && SUPPORTED_FORMATS.includes(value.type)
            //         ),
            university: Yup.string().required('University is a required field'),
            department: Yup.string().required('Orion department is a required field'),
            graduationTime: Yup.date().required('Graduation is a required field'),
            skills: Yup.string()
                .min(20, 'Skills must be at least 20 characters')
                .required('Technical skills is a required field'),
            description: Yup.string()
                .min(150, 'About must be at least 150 characters')
                .required('About is a required field'),
        }),

        onSubmit: async (values) => {
            setLoading(true)

            var form_data = new FormData()
            for (var key in values) {
                form_data.append(key, values[key])
            }
            if (formik.values.file === '') {
                form_data.append('file', await urlToObject(props.data.image))
            }
            form_data.append('_id', props.data._id)

            UpdateUser(form_data)
                .then(() => {
                    toast.success('Update Succesful!')
                    toggleUpdate()
                })
                .catch(() => {
                    toast.error('Error! Please try again!')
                })
                .finally(() => {
                    setLoading(false)
                })
        },
    })
    console.log(formik.values)
    return (
        <div className="container p-5" style={{ backgroundColor: '#f2f8fc' }}>
            <div className="row">
                <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
                    <div className="row mt-4">
                        <div className="form-group col-md-6 col-sm-12">
                            <label for="Surname">Full Name</label>
                            <input
                                type="text"
                                className="form-control mt-2"
                                id="fullname"
                                onBlur={formik.handleBlur}
                                placeholder="name surname"
                                name="fullname"
                                onChange={formik.handleChange}
                                value={formik.values.fullname}
                            />
                            {formik.touched.fullname && formik.errors.fullname ? (
                                <p className="formikValidate">{formik.errors.fullname}</p>
                            ) : null}
                        </div>
                        <div className="form-group col-md-6 col-sm-12">
                            <label for="email">Email</label>
                            <input
                                type="email"
                                className="form-control mt-2"
                                id="email"
                                onBlur={formik.handleBlur}
                                name="email"
                                placeholder="name@example.com"
                                onChange={formik.handleChange}
                                value={formik.values.email}
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <p className="formikValidate">{formik.errors.email}</p>
                            ) : null}
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="form-group col-md-4 col-sm-12">
                            <label className="mb-2" for="FirstJobDay">
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
                                {formik.touched.firstJobDay && formik.errors.firstJobDay ? (
                                    <p className="formikValidate">{formik.errors.firstJobDay}</p>
                                ) : null}
                            </div>
                        </div>
                        <div className="form-group col-md-4 col-sm-12">
                            <label for="FirstJobDay">Position</label>
                            <select
                                onChange={formik.handleChange}
                                name="workTitle"
                                class="form-select mt-2"
                                value={formik.values.workTitle}
                            >
                                {titles.map((item, index) => {
                                    return (
                                        <option
                                            {...(props.data.workTitle == item ? 'selected' : null)}
                                            value={item}
                                        >
                                            {item}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="form-group col-md-4 col-sm-12">
                            <div className="form-group">
                                <label for="university">Department</label>
                                <input
                                    type="text"
                                    className="form-control mt-2"
                                    onBlur={formik.handleBlur}
                                    id="department"
                                    placeholder="ex: NRD 2208"
                                    name="department"
                                    onChange={formik.handleChange}
                                    value={formik.values.department}
                                />
                                {formik.touched.department && formik.errors.department ? (
                                    <p className="formikValidate">{formik.errors.department}</p>
                                ) : null}
                            </div>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="form-group mt-2 col-md-2">
                            <div className="form-group">
                                <label className="mb-3" for="file">
                                    Current Photo
                                </label>
                                <div className="currentPhoto">
                                    <img
                                        className="currentPhotoImg"
                                        src={`${process.env.REACT_APP_API_URL}${props.data.image}`}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-group mt-5 col-md-10">
                            <div className="form-group">
                                <label className="mb-3" for="file">
                                    Click to update photo
                                </label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="file"
                                    name="file"
                                    onChange={(e) => {
                                        formik.setFieldValue('file', e.target.files[0])
                                    }}
                                />
                                {/* {formik.errors.file ? <p className="formikValidate">{formik.errors.file}</p> : null} */}
                            </div>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="form-group mt-1 col-md-9 col-sm-12">
                            <div className="form-group">
                                <label for="university">University</label>
                                <input
                                    type="text"
                                    className="form-control mt-2"
                                    onBlur={formik.handleBlur}
                                    id="university"
                                    placeholder="Corban University"
                                    name="university"
                                    onChange={formik.handleChange}
                                    value={formik.values.university}
                                />
                                {formik.touched.university && formik.errors.university ? (
                                    <p className="formikValidate">{formik.errors.university}</p>
                                ) : null}
                            </div>
                        </div>
                        <div className="form-group mt-1 col-md-3 col-sm-12">
                            <label className="mb-2" for="GraduationTime">
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
                                {formik.touched.graduationTime && formik.errors.graduationTime ? (
                                    <p className="formikValidate">{formik.errors.graduationTime}</p>
                                ) : null}
                            </div>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="form-group mt-1 col-md-4 col-sm-12">
                            <label for="PreviousJob">Previous Job</label>
                            <input
                                type="text"
                                className="form-control mt-2"
                                id="PreviousJob"
                                onBlur={formik.handleBlur}
                                name="previousJob"
                                placeholder="Corporate consulting"
                                onChange={formik.handleChange}
                                value={formik.values.previousJob}
                            />
                            {formik.touched.previousJob && formik.errors.previousJob ? (
                                <p className="formikValidate">{formik.errors.previousJob}</p>
                            ) : null}
                        </div>
                        <div className="form-group mt-1 col-md-4 col-sm-12">
                            <label for="PreviousJob">Previous Position</label>
                            <input
                                type="text"
                                className="form-control mt-2"
                                id="PreviousJob"
                                name="previousJob"
                                placeholder="ex: Backend Developer"
                                onChange={formik.handleChange}
                                value={formik.values.previousJob}
                            />
                        </div>
                        <div className="form-group mt-1 col-md-4 col-sm-12">
                            <div className="form-group">
                                <label for="TotalWorkTime">Total Experience</label>
                                <input
                                    type="text"
                                    className="form-control mt-2"
                                    id="TotalWorkTime"
                                    onBlur={formik.handleBlur}
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
                            <label for="Skills">Technical Skills</label>
                            <textarea
                                className="form-control mt-2"
                                id="Skills"
                                name="skills"
                                placeholder=" ex: PHP, Vue.js, AWS.."
                                onBlur={formik.handleBlur}
                                rows="3"
                                onChange={formik.handleChange}
                                value={formik.values.skills}
                            ></textarea>
                            {formik.touched.skills && formik.errors.skills ? (
                                <p className="formikValidate">{formik.errors.skills}</p>
                            ) : null}
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="form-group mt-1 col-md-12 col-sm-12">
                            <label for="Description">About</label>
                            <textarea
                                className="form-control mt-2"
                                name="description"
                                onBlur={formik.handleBlur}
                                id="description"
                                rows="3"
                                onChange={formik.handleChange}
                                value={formik.values.description}
                            ></textarea>
                            {formik.touched.description && formik.errors.description ? (
                                <p className="formikValidate">{formik.errors.description}</p>
                            ) : null}
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }} class="form-button mt-4">
                        {!isLoading ? (
                            <button id="submit" type="submit" class="btn btn-primary">
                                Update
                            </button>
                        ) : (
                            <button id="submit" type="submit" class="btn btn-primary">
                                <span
                                    class="spinner-border spinner-border-sm"
                                    role="status"
                                    aria-hidden="true"
                                ></span>
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserEdit
