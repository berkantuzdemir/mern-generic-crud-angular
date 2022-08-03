import React, { useEffect, useState } from 'react'
import '../UserCreate.css'
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded'
import PreviewIcon from '@material-ui/icons/RemoveRedEyeSharp'
import DynamicFeedRoundedIcon from '@material-ui/icons/DynamicFeedRounded'
import AddCircleSharpIcon from '@material-ui/icons/AddCircleSharp'
import LogoutIcon from '@material-ui/icons/ExitToApp'
import Tooltip from '@material-ui/core/Tooltip'
import { Edit } from '@mui/icons-material/'
import { Delete } from '@material-ui/icons'

import Swal from 'sweetalert2'
import { GetAvailableForms, DeleteFormsByIds } from '../methods/DynamicForms'
import 'react-confirm-alert/src/react-confirm-alert.css'
import useStore from '../store'
import { isExpired } from '../methods/Account'
import { GetUserDetails } from '../methods/GetUsers'
import logout from '../methods/Logout'
import { useNavigate, Link } from 'react-router-dom'

const AdminPanel = () => {
    const [data, setData] = useState([])
    const [userDetail, setUserDetail] = useState('')
    const [search, setSearch] = useState('')
    const store = useStore()
    const { toggleUpdate } = store
    const { isUpdated } = store
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)

    const CrudTools = (permission, id) => {
        if (permission === 'write') {
            return (
                <div>
                    <Tooltip title="Formu Gör">
                        <Link
                            to={`/dynamic/form/${id}`}
                            style={{
                                color: 'white',
                            }}
                            type="button"
                            id="update"
                            className="btn btn-sm bg-white"
                        >
                            <PreviewIcon htmlColor="green" fontSize="medium" marginRight={1} />
                        </Link>
                    </Tooltip>
                    <Tooltip title="Forma Kayıtlı Verileri Gör">
                        <Link
                            to={`/dynamic/form-table/${id}`}
                            style={{
                                color: 'white',
                                marginLeft: '0.3rem',
                            }}
                            type="button"
                            id="update"
                            className="btn btn-sm bg-white"
                        >
                            <DynamicFeedRoundedIcon
                                htmlColor="#007AFF"
                                fontSize="medium"
                                marginRight={1}
                            />
                        </Link>
                    </Tooltip>
                    <Tooltip title="Formu Güncelle">
                        <Link
                            to={`/dynamic/form-edit/${id}`}
                            style={{
                                marginLeft: '0.3rem',
                                color: 'white',
                            }}
                            type="button"
                            className="btn bg-white btn-sm"
                        >
                            {' '}
                            <Edit htmlColor="orange" fontSize="medium" marginRight={1} />
                        </Link>
                    </Tooltip>
                    <Tooltip title="Formu Sil">
                        <button
                            style={{
                                marginLeft: '0.4rem',
                            }}
                            type="button"
                            onClick={() => {
                                DeleteForms([id])
                            }}
                            id="sil"
                            className="btn bg-white btn-sm"
                        >
                            <Delete htmlColor="red" fontSize="medium" marginRight={1} />
                        </button>
                    </Tooltip>{' '}
                </div>
            )
        } else if (permission === 'read') {
            return (
                <div>
                    <Tooltip title="Formu Gör">
                        <Link
                            to={`/dynamic/form/${id}`}
                            style={{
                                color: 'green',
                            }}
                            type="button"
                            id="update"
                            className="btn btn-sm bg-white"
                        >
                            <PreviewIcon htmlColor="#007AFF" fontSize="medium" marginRight={1} />
                        </Link>
                    </Tooltip>{' '}
                    <Tooltip title="Forma Kayıtlı Verileri Gör">
                        <Link
                            to={`/dynamic/form-table/${id}`}
                            style={{
                                color: 'white',
                            }}
                            type="button"
                            id="update"
                            className="btn btn-sm bg-white"
                        >
                            <DynamicFeedRoundedIcon
                                htmlColor="#007AFF"
                                fontSize="medium"
                                marginRight={1}
                            />
                        </Link>
                    </Tooltip>{' '}
                </div>
            )
        }
    }

    useEffect(() => {
        document.title = 'Form List'
        isExpired()
            .then((res) => {
                if (res) {
                    navigate('/dynamic')
                }
            })
            .catch((error) => console.log(error))
    }, [])

    useEffect(() => {
        GetAvailableForms().then((response) => {
            setData(response)
        })
    }, [isUpdated])

    useEffect(() => {
        GetUserDetails().then((response) => {
            setUserDetail(response)
            setIsLoading(false)
        })
    }, [])

    const DeleteForms = (id) => {
        Swal.fire({
            title: 'Emin misin?',
            text: 'Seçilen form tüm içeriğiyle birlikte silinecektir!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sil',
            cancelButtonText: 'Vazgeç',
        }).then((result) => {
            if (result.isConfirmed) {
                DeleteFormsByIds(id)
                    .then((response) => {
                        if (response.deletedCount > 0) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Başarılı!',
                                text: ' Form başarıyla silindi.',
                            })
                            toggleUpdate()
                        }
                    })
                    .catch((error) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Silme işlemi geçersiz.',
                        })
                    })
            }
        })
    }
    return (
        <div className="container">
            {!isLoading ? (
                <div className="form-body">
                    <div className="row">
                        <div className="form-holder">
                            <div className="form-content">
                                <div className="form-items">
                                    <div className="row">
                                        <div className="form-group col-md-4">
                                            <h3>Form Yönetimi</h3>
                                            <p style={{ textTransform: 'uppercase' }}>
                                                HOŞGELDİN {userDetail.username}
                                            </p>
                                        </div>
                                        <div
                                            style={{ textAlign: 'center' }}
                                            className="form-group col-md-4"
                                        >
                                            <input
                                                className="form-control border-end-0 border rounded-pill"
                                                type="text"
                                                placeholder="Arama..."
                                                id="example-search-input"
                                                onChange={(e) => {
                                                    setSearch(e.target.value)
                                                }}
                                            />
                                        </div>
                                        <div
                                            style={{ textAlign: 'right' }}
                                            className="form-group col-md-4 mt-2"
                                        >
                                            {userDetail.role === 'root' ? (
                                                <Tooltip title="Yeni Form Oluştur">
                                                    <Link
                                                        to={`/dynamic/form-create`}
                                                        type="button"
                                                        id="add"
                                                        className="btn btn-success btn-sm"
                                                    >
                                                        <AddCircleSharpIcon
                                                            htmlColor="white"
                                                            fontSize="small"
                                                            marginRight={1}
                                                        />
                                                        <small> Yeni Form </small>
                                                    </Link>
                                                </Tooltip>
                                            ) : (
                                                ''
                                            )}
                                            {userDetail.role === 'root' ? (
                                                <Tooltip title="Admin Hesaplarına Erişim">
                                                    <Link
                                                        to={`/dynamic/create-admin`}
                                                        type="button"
                                                        style={{
                                                            background: 'coral',
                                                            marginLeft: '0.4rem',
                                                        }}
                                                        className="btn btn-sm text-white"
                                                    >
                                                        <small> Hesap Yönetimi </small>
                                                    </Link>
                                                </Tooltip>
                                            ) : (
                                                ''
                                            )}
                                            <Tooltip title="Çıkış Yap">
                                                <button
                                                    style={{
                                                        background: '#495056',
                                                        marginLeft: '0.4rem',
                                                    }}
                                                    className="btn btn-sm text-white"
                                                    onClick={() => logout(navigate)}
                                                >
                                                    <LogoutIcon
                                                        htmlColor="white"
                                                        fontSize="small"
                                                        marginRight={1}
                                                    />
                                                </button>
                                            </Tooltip>
                                        </div>
                                    </div>

                                    <div className="row">
                                        {data
                                            .filter((form) => {
                                                if (search === '') {
                                                    return form
                                                } else if (
                                                    form.formName
                                                        .toLowerCase()
                                                        .includes(search.toLowerCase())
                                                ) {
                                                    return form
                                                }
                                            })
                                            .map((form) => (
                                                <div className="form-group col-xl-6 col-md-6 col-sm-12 mt-5">
                                                    <div className="card">
                                                        <div
                                                            className="card-header"
                                                            style={{
                                                                backgroundColor: form.primaryColor,
                                                            }}
                                                        >
                                                            <div className="row align-items-center">
                                                                <div
                                                                    className="col-xl-6 col-md-6 col-sm-12"
                                                                    style={{ color: '#fff' }}
                                                                >
                                                                    {form.formName}
                                                                </div>
                                                                <div
                                                                    className="col-xl-6 col-md-6 col-sm-12"
                                                                    style={{ textAlign: 'right' }}
                                                                >
                                                                    {userDetail.role !== 'root'
                                                                        ? userDetail.allowedForms.map(
                                                                              (item) => {
                                                                                  if (
                                                                                      item.formId ===
                                                                                          form._id &&
                                                                                      item.permissionType ===
                                                                                          'write'
                                                                                  ) {
                                                                                      return CrudTools(
                                                                                          'write',
                                                                                          form._id
                                                                                      )
                                                                                  } else if (
                                                                                      item.formId ===
                                                                                          form._id &&
                                                                                      item.permissionType ===
                                                                                          'read'
                                                                                  ) {
                                                                                      return CrudTools(
                                                                                          'read',
                                                                                          form._id
                                                                                      )
                                                                                  }
                                                                              }
                                                                          )
                                                                        : CrudTools(
                                                                              'write',
                                                                              form._id
                                                                          )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="card-body">
                                                            <div className="form-group col-md-12 col-sm-12">
                                                                <p className="card-text">
                                                                    {form.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div> Yükleniyor... </div>
            )}
        </div>
    )
}

export default AdminPanel
