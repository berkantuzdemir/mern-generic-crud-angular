import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import {
    DeleteFormDocuments,
    GetForm,
    GetFormDetails,
    UpdateSelectedDocument,
} from '../methods/DynamicForms'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '@mui/material'
import { Delete } from '@material-ui/icons'
import { ArrowBack, EditOff, Edit } from '@mui/icons-material/'
import Swal from 'sweetalert2'
import useStore from '../store'
import { isExpired } from '../methods/Account'
import Tooltip from '@mui/material/Tooltip'
import { toast } from 'react-toastify'
import { GetUserDetails } from '../methods/GetUsers'

const FormTable = () => {
    const { id } = useParams()
    const [documents, setDocuments] = useState([])
    const [formDetails, setFormDetails] = useState([])
    const [columns, setColumns] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [selectionModel, setSelectionModel] = useState([])
    const [isEditEnabled, setEditEnabled] = useState(false)
    const [userDetail, setUserDetail] = useState()
    const store = useStore()
    const { toggleUpdate } = store
    const { isUpdated } = store
    const navigate = useNavigate()

    const Toolbar = (props) => {
        const handleClick = () => {
            Swal.fire({
                title: 'Emin misin?',
                text: 'Seçilen formlar silinecektir!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sil',
                cancelButtonText: 'Vazgeç',
            }).then((result) => {
                if (result.isConfirmed) {
                    DeleteFormDocuments(selectionModel, id)
                        .then((response) => {
                            if (response.deletedCount > 0) {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Başarılı!',
                                    text: response.deletedCount + ' adet form başarıyla silindi.',
                                })
                                toggleUpdate()
                            }
                        })
                        .catch(() => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Silme işlemi geçersiz.',
                            })
                        })
                }
            })
        }
        const isAllowed = () => {
            if (
                userDetail.role === 'root' ||
                userDetail.allowedForms.find((e) => e.formId === id).permissionType === 'write'
            ) {
                return true
            }
            return false
        }
        return (
            <GridToolbarContainer
                className="d-flex justify-content-between"
                sx={{ backgroundColor: formDetails.primaryColor }}
            >
                <div className="row mt-3 mb-2 ms-1">
                    <h3 className="form-header text-white">{formDetails.formName} Verileri</h3>
                </div>
                <div>
                    <Tooltip title="Bu ayarı açtığınızda istediğiniz alana çift tıklayarak güncelleyebilirsiniz">
                        <button
                            disabled={!isAllowed()}
                            style={{
                                marginLeft: '0.4rem',
                            }}
                            type="button"
                            onClick={() => setEditEnabled(!isEditEnabled)}
                            id="sil"
                            className="btn bg-white btn-sm"
                        >
                            {isEditEnabled ? (
                                <EditOff htmlColor="orange" />
                            ) : (
                                <Edit htmlColor="orange" />
                            )}
                        </button>
                    </Tooltip>
                    <Tooltip title="Seçili satırları sil">
                        <button
                            disabled={!isAllowed()}
                            style={{
                                marginLeft: '0.4rem',
                            }}
                            type="button"
                            onClick={handleClick}
                            id="sil"
                            className="btn bg-white btn-sm"
                        >
                            <Delete htmlColor="red" />
                        </button>
                    </Tooltip>
                    <Tooltip title="Geri Dön">
                        <Link
                            style={{
                                marginLeft: '0.4rem',
                            }}
                            to={'/dynamic/form-list'}
                            id="backButton"
                            aria-pressed="true"
                            className="btn bg-white btn-sm me-2"
                        >
                            <ArrowBack />
                        </Link>
                    </Tooltip>
                </div>
            </GridToolbarContainer>
        )
    }
    useEffect(() => {
        isExpired()
            .then((res) => {
                if (res) {
                    navigate('/dynamic')
                }
            })
            .catch((error) => console.log(error))
    }, [])
    useEffect(() => {
        GetFormDetails(id)
            .then((res) => {
                setFormDetails(res)
                document.title = res.formName + ' Table'
                document.getElementById(
                    'favicon'
                ).href = `${process.env.REACT_APP_API_URL}${res.icon}`
                return res.formDetails
            })
            .then((details) => {
                Object.keys(details).map((item) => {
                    if (isLoading) {
                        columns.push({
                            field: item,
                            headerName: details[item].htmlLabel,
                            type: details[item].type.toLowerCase(),
                            width: 200,
                            editable: true,
                        })
                    }
                })
                GetUserDetails()
                    .then((response) => {
                        setUserDetail(response)
                        console.log(response)
                    })
                    .then(() => {
                        setLoading(false)
                    })
            })
            .catch((err) => console.log(err))
    }, [])
    useEffect(() => {
        GetForm(id)
            .then((res) => {
                setDocuments(res)
            })
            .catch((err) => console.log(err))
    }, [isUpdated])

    useEffect(() => {}, [])

    return (
        <div>
            {!isLoading ? (
                <div
                    className="container"
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        display: 'flex',
                        height: '100vh',
                    }}
                >
                    <DataGrid
                        className="bg-white"
                        getRowId={(row) => row._id}
                        rows={documents}
                        autoHeight
                        columns={columns}
                        checkboxSelection
                        aria-label="collapsible table"
                        hideFooterPagination
                        editMode="row"
                        isCellEditable={() => isEditEnabled}
                        onRowEditStop={(params) => {
                            UpdateSelectedDocument(params.row, id)
                                .then(() => {
                                    toggleUpdate()
                                    toast.success('Satır güncellendi.', {
                                        position: 'bottom-center',
                                    })
                                })
                                .catch(() => {
                                    toggleUpdate()
                                    toast.error('Güncellenemedi.', {
                                        position: 'bottom-center',
                                    })
                                })
                        }}
                        components={{
                            Toolbar: Toolbar,
                        }}
                        onSelectionModelChange={(newSelectionModel) => {
                            setSelectionModel(newSelectionModel)
                        }}
                        selectionModel={selectionModel}
                    />
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    )
}

export default FormTable
