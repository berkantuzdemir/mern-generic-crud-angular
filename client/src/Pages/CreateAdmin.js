import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import AddCircleSharpIcon from '@material-ui/icons/AddCircleSharp'
import { getRole, isExpired } from '../methods/Account'
import { CreateAdminAccount, GetAvailableForms } from '../methods/DynamicForms'
import 'react-confirm-alert/src/react-confirm-alert.css'
import useStore from '../store'
import { v4 as uuid } from 'uuid'
import { ArrowBack } from '@mui/icons-material'
import { Tooltip } from '@material-ui/core'

const CreateAdmin = () => {
    const navigate = useNavigate()
    const [forms, setForms] = useState([])
    const [isLoading, toggleLoading] = useState(true)
    const [formPermission, setFormPermission] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const store = useStore()
    const { toggleUpdate } = store
    const [show, setShow] = useState(false)
    const [inputType, setInputType] = useState()
    const [selectedForm, setSelectedForm] = useState()

    const removePermission = (index) => {
        setFormPermission(formPermission.filter((item) => formPermission.indexOf(item) !== index))
    }

    const handleAddFields = () => {
        setFormPermission([...formPermission, { id: uuid(), show: false }])
    }

    const handlePermissionValueParent = (index, event) => {
        if (
            event.target.name === 'formId' &&
            formPermission.find((e) => e.formId === event.target.value)
        ) {
            Swal.fire({
                icon: 'error',
                title: 'Bu izini daha önce gerçekleştirdiniz.',
            })
        } else {
            const updatedPermissions = [...formPermission]
            updatedPermissions[index][event.target.name] =
                event.target.name === 'show' ? event.target.checked : event.target.value
            setFormPermission(updatedPermissions)
        }
    }

    const handleSubmit = (e) => {
        const body = {}
        body.username = username
        body.password = password
        const allowedForms = []
        formPermission.map((item) => {
            const form = {}
            Object.keys(item).forEach((key) => {
                if (key !== 'id' || key !== 'show') {
                    form[key] = item[key]
                }
            })
            allowedForms.push(form)
        })
        body.allowedForms = allowedForms

        if (body.username !== '' && body.password !== '') {
            if (body.allowedForms.length > 0) {
                CreateAdminAccount(body)
                    .then((res) => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Başarılı!',
                            text: 'Hesap başarıyla oluşturuldu.',
                        })
                        toggleUpdate()
                        console.log(res)
                    })
                    .catch((error) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Hesap oluşturma işlemi gerçekleştirilemedi.',
                        })
                        console.log(error)
                    })
                e.preventDefault()
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oluşturulan hesaba, en az 1 form yetkisi verilmesi gerektir.',
                })
                e.preventDefault()
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Kullanıcı adı ve şifre olmadan hesap oluşturulamaz.',
            })
            e.preventDefault()
        }
    }

    useEffect(() => {
        document.title = 'Admin Create'
        isExpired()
            .then((res) => {
                if (res) {
                    navigate('/dynamic')
                }
                getRole().then((roleResponse) => {
                    if (roleResponse.role !== 'root') navigate('/dynamic')
                })
            })
            .catch((error) => {
                console.error(error)
            })

        GetAvailableForms()
            .then((res) => {
                setForms(res)
                toggleLoading(false)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    if (!isLoading) {
        return (
            <div className="container">
                <div className="form-body">
                    <div className="row">
                        <div className="form-holder">
                            <div className="form-content">
                                <div className="form-items">
                                    <div className="row">
                                        <div className="form-group col-md-6">
                                            <h3>Hesap Oluşturma ve Yetkilendirme</h3>
                                            <p>ADMİN HESABI VE İZİNLERİ</p>
                                        </div>
                                        <div
                                            style={{ textAlign: 'right' }}
                                            className="form-group col-md-6"
                                        >
                                            <Tooltip title="Geri Dön">
                                                <Link
                                                    style={{
                                                        marginLeft: '0.4rem',
                                                        backgroundColor:"#4d4c4c"
                                                    }}
                                                    to={'/dynamic/form-list'}
                                                    id="backButton"
                                                    aria-pressed="true"
                                                    className="btn btn-sm me-2"
                                                >
                                                    <ArrowBack htmlColor='white'/>
                                                </Link>
                                            </Tooltip>
                                        </div>
                                    </div>
                                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                                        <div className="row mt-2">
                                            <div className="form-group col-md-6 col-sm-12">
                                                <label htmlFor="fullname">
                                                    Kullanıcı Adı Atama
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="username"
                                                    name="username"
                                                    placeholder="Kullanıcı Adı"
                                                    onChange={(e) => {
                                                        setUsername(e.target.value)
                                                    }}
                                                />
                                            </div>
                                            <div className="form-group col-md-6 col-sm-12">
                                                <label htmlFor="fullname">Şifre Atama</label>
                                                <input
                                                    type="password"
                                                    id="password"
                                                    name="password"
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        setPassword(e.target.value)
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="row mt-4 justify-content-center">
                                            <div className="form-group col-auto">
                                                <button
                                                    id="addForm"
                                                    type="button"
                                                    style={{ background: '#495056' }}
                                                    onClick={() => handleAddFields()}
                                                    className="btn btn-sm text-white"
                                                >
                                                    <small>Form ve Yetkilerini Belirle</small>
                                                    <AddCircleSharpIcon
                                                        htmlColor="white"
                                                        fontSize="small"
                                                        style={{ marginLeft: '5px' }}
                                                    />
                                                </button>
                                            </div>
                                            <div className="col-auto">
                                                <p className="mt-2" style={{ fontSize: '12px' }}>
                                                    (Oluşturuduğunuz hesabı; birden çok form ile
                                                    ilişkilendirebilir, aynı zamanda form içinde
                                                    yetkilendirme işlemi gerçekleştirebilirsiniz.
                                                    Seçim yapmadığınız takdirde tüm formlara erişimi
                                                    olan bir hesap oluşturursunuz. Aynı zamanda
                                                    seçilen bir form içinde de yetkilendirme işlemi
                                                    gerçekleştirebilirsiniz.)
                                                </p>
                                            </div>
                                        </div>
                                        {formPermission.map((item, index) => {
                                            return (
                                                <form
                                                    key={item.id}
                                                    className="row mt-4 p-5"
                                                    style={{ border: 'solid 1px coral' }}
                                                    onChange={(e) =>
                                                        handlePermissionValueParent(index, e)
                                                    }
                                                >
                                                    <div className="form-group col-12 col-md-4 col-sm-4">
                                                        <label htmlFor="fullname">Form Atama</label>
                                                        <select
                                                            name="formId"
                                                            id="allowedForms"
                                                            className="form-select"
                                                            onChange={(e) => {
                                                                setSelectedForm(e.target.value)
                                                            }}
                                                        >
                                                            <option selected disabled>
                                                                Form Seç
                                                            </option>
                                                            {forms.map((form, index) => {
                                                                return (
                                                                    <option
                                                                        key={form.formName}
                                                                        value={form._id}
                                                                    >
                                                                        {form.formName}
                                                                    </option>
                                                                )
                                                            })}
                                                        </select>
                                                    </div>
                                                    <div className="form-group col-12 col-md-5 col-sm-5">
                                                        <label htmlFor="fullname">
                                                            Yetkilendirme
                                                        </label>
                                                        <select
                                                            id="permission"
                                                            className="form-select"
                                                            name="permissionType"
                                                        >
                                                            <option selected disabled>
                                                                Yetki seç
                                                            </option>
                                                            <option value="read">
                                                                Görebilir. (Listeleme)
                                                            </option>
                                                            <option value="write">
                                                                İşlem yapabilir.
                                                                (Listeleme/Güncelleme/Silme)
                                                            </option>
                                                        </select>
                                                    </div>
                                                    <div className="form-check col-12 col-md-2 col-sm-2">
                                                        <div
                                                            style={{ float: 'right' }}
                                                            className="form-group mt-4"
                                                        >
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="show"
                                                                id="flexCheckDefault"
                                                            />
                                                            <label>Yetkiyi Özelleştir</label>
                                                        </div>
                                                    </div>
                                                    {item.show ? (
                                                        <div className="row">
                                                            {forms.find(
                                                                (e) => e._id === item.formId
                                                            ) ? (
                                                                <div className="row">
                                                                    <div className="form-group col-12 col-md-6 col-sm-6 mt-4">
                                                                        <label htmlFor="fullname">
                                                                            Form İçinde Yetkilendir
                                                                        </label>
                                                                        <select
                                                                            name="allowedField"
                                                                            id="allowedField"
                                                                            className="form-select"
                                                                            onChange={(e) => {
                                                                                setInputType(
                                                                                    forms.find(
                                                                                        (e) =>
                                                                                            e._id ===
                                                                                            selectedForm
                                                                                    ).formDetails[
                                                                                        e.target
                                                                                            .value
                                                                                    ].type
                                                                                )
                                                                            }}
                                                                        >
                                                                            <option
                                                                                selected
                                                                                disabled
                                                                            >
                                                                                Forma ait bir alan
                                                                                seçiniz.
                                                                            </option>
                                                                            {Object.entries(
                                                                                forms.find(
                                                                                    (e) =>
                                                                                        e._id ===
                                                                                        selectedForm
                                                                                ).formDetails
                                                                            ).map(
                                                                                ([
                                                                                    detail,
                                                                                    value,
                                                                                ]) => {
                                                                                    return (
                                                                                        <option
                                                                                            key={
                                                                                                value.type
                                                                                            }
                                                                                            value={
                                                                                                detail
                                                                                            }
                                                                                        >
                                                                                            {detail}{' '}
                                                                                            /{' '}
                                                                                            {
                                                                                                value.type
                                                                                            }
                                                                                        </option>
                                                                                    )
                                                                                }
                                                                            )}
                                                                        </select>
                                                                    </div>
                                                                    <div className="form-group col-12 col-md-6 col-sm-6 mt-4">
                                                                        <label htmlFor="fullname">
                                                                            Yetkili Alana Değer
                                                                            Atama
                                                                        </label>
                                                                        <input
                                                                            name="allowedValue"
                                                                            id="allowedValue"
                                                                            type={inputType}
                                                                            className="form-control mt-1"
                                                                        />
                                                                    </div>{' '}
                                                                </div>
                                                            ) : (
                                                                <div className="row">
                                                                    {' '}
                                                                    <p className="formikValidate">
                                                                        Form seçimi yapmadan yetki
                                                                        özelleştirilemez.
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        ''
                                                    )}
                                                    <div className="row">
                                                        <div className="form-group col-12 col-md-12 col-sm-12">
                                                            <div
                                                                style={{ textAlign: 'center' }}
                                                                className="form-group mt-4"
                                                            >
                                                                <button
                                                                    type="button"
                                                                    id="removeForm"
                                                                    className="btn btn-danger btn-sm"
                                                                    style={{ marginLeft: '5px' }}
                                                                    onClick={() =>
                                                                        removePermission(index)
                                                                    }
                                                                >
                                                                    Sil
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            )
                                        })}
                                        <div
                                            style={{ textAlign: 'center' }}
                                            className="form-button mt-4"
                                        >
                                            <button
                                                style={{ background: 'coral ' }}
                                                id="submit"
                                                type="submit"
                                                className="btn btn-primary mt-4"
                                                onClick={handleSubmit}
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
        )
    }
    return <div>Loading</div>
}

export default CreateAdmin
