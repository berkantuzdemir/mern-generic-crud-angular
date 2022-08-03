const Logout = (navigate) => {
    localStorage.removeItem('jwt')
    navigate('/dynamic')
}
export default Logout
