import './App.css'
import {
    BrowserRouter,
    Routes,
    Route,
    // Link
} from 'react-router-dom'
import React from 'react'
import { ToastContainer } from 'react-toastify'
import UserCreate from './components/UserCreate'
import LoginPage from './components/LoginPage'
import UserTable from './components/UserTable'
import FormList from './Pages/FormList'
import DynamicLoginPage from './Pages/DynamicLoginPage'
import CreateAdmin from './Pages/CreateAdmin'
import FormCreate from './Pages/FormCreate'
import FormTable from './Pages/FormTable'
import FormEdit from './Pages/FormEdit'
import FormView from './Pages/FormView'

const App = () => {
    return (
        <BrowserRouter>
            <ToastContainer
                position="top-right"
                autoClose={500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <Routes>
                <Route path="/">
                    <Route index element={<UserCreate />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="users" element={<UserTable />} />
                </Route>
                <Route path="/dynamic">
                    <Route index element={<DynamicLoginPage />} />
                    <Route path="create-admin" element={<CreateAdmin />} />
                    <Route path="form-create" element={<FormCreate />} />
                    <Route path="form-list" element={<FormList />} />
                    <Route path="form-table/:id" element={<FormTable />} />
                    <Route path="form-edit/:id" element={<FormEdit />} />
                    <Route path="form/:id" element={<FormView />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
