import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import '../UserCreate.css'
import { GetFormDetails, submitFormDocument } from '../methods/DynamicForms'
import camelcase from 'camelcase'
import Swal from 'sweetalert2'
import useStore from '../store'

const FormView = () => {
    const { id } = useParams()
    const [formInfo, setFormInfo] = useState([])
    const [formLabels, setFormLabels] = useState([])
    const [values, setValues] = useState({})
    const store = useStore()
    const { toggleUpdate } = store

    useEffect(() => {
        GetFormDetails(id).then((res) => {
            setFormLabels(res.formDetails)
            setFormInfo(res)
            document.title = res.formName
            document.getElementById('favicon').href = `${process.env.REACT_APP_API_URL}${res.icon}`
        })
    }, [])

    const handleInputChange = (event) => {
        const updatedValues = values
        updatedValues[event.target.name] = event.target.value
        setValues(updatedValues)
    }

    const submitForm = () => {
        values.form_id = id
        submitFormDocument(values)
            .then((res) => {
                Swal.fire({
                    icon: 'success',
                    title: 'Başarılı!',
                    text: 'Kaydedildi.',
                })
                toggleUpdate()
            })
            .catch((err) =>
                Swal.fire({
                    icon: 'error',
                    title: 'Bir hata oluştu.',
                    text: 'Lütfen girdiğiniz bilgileri gözden geçirin.',
                })
            )
    }

    return (
        <div className="container">
            <div className="form-body">
                <div className="row">
                    <div className="form-holder">
                        <div className="form-content">
                            <div className="form-items" style={{ padding: '0' }}>
                                <div
                                    className="card-header dynamic-form-title"
                                    style={{ background: formInfo.primaryColor }}
                                >
                                    <div className="row">
                                        <div className="form-group col-md-12">
                                            <h3 style={{ color: 'white' }}>{formInfo.formName}</h3>
                                            <p
                                                style={{
                                                    textTransform: 'uppercase',
                                                    color: 'white',
                                                }}
                                            >
                                                {formInfo.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="card-body dynamic-form-body"
                                    onChange={(e) => handleInputChange(e)}
                                >
                                    <form encType="multipart/form-data">
                                        <div className="row">
                                            {Object.entries(formLabels).map(([label, index]) => {
                                                return (
                                                    <div className="form-group col-md-6 col-sm-12 col-12 mt-4">
                                                        <label htmlFor="fullname">{label}</label>
                                                        <input
                                                            type={index.type}
                                                            className="form-control mt-2"
                                                            id={label}
                                                            name={label}
                                                            placeholder={index.placeholder}
                                                        />
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <div
                                            style={{
                                                textAlign: 'center',
                                                color: formInfo.primaryColor,
                                            }}
                                            className="form-button mt-4"
                                        >
                                            <button
                                                id="submit"
                                                type="submit"
                                                className="btn mt-4"
                                                style={{ backgroundColor: formInfo.primaryColor }}
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    submitForm()
                                                }}
                                            >
                                                Kaydet
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FormView
