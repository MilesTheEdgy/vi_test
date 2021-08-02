import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CModalFooter
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useDispatch } from 'react-redux'
import Loader from '../../hoc/loader/Loader'

const Login = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [username, setUsername] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [modal, setModal] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const modalObj = {
    header: "HATA",
    body: "LÜTFEN BİLGİLERİNİZİ KONTROL EDİN"
  }
  const submitHandeler = async () => {
    setLoading(true)
    const response = await fetch(`/api/login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        username: username,
        password: password
      })
    })

    if (response.status === 200) {
      const data = await response.json()
      document.cookie = `pyecztoken=${data.token}`
      setLoading(false)
      dispatch({type: 'LOG_IN'})
      dispatch({type: 'FILL_USER_SETTINGS', eczaneName: data.eczaneName, username: data.username})
      dispatch({type: 'FILL_USER_INFO', bakiye: data.bakiye})
      history.push('/dashboard')
    }
     else if (response.status === 401) {
      setLoading(false)
      setModal(true)
    }
  }

  return (
    <Loader isLoading = {loading}>
      <div className="c-app c-default-layout flex-row align-items-center">
        <CModal 
        show={modal} 
        onClose={() => setModal(false)}
        color='warning'
        centered
        >
            <CModalHeader closeButton>
                <CModalTitle> {modalObj.header} </CModalTitle>
            </CModalHeader>
            <CModalBody>
                <h5>{modalObj.body}</h5>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setModal(false)}>Kapat</CButton>
            </CModalFooter>
        </CModal>
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Giriş</h1>
                    <p className="text-muted">Hesabınıza giriş yapın</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" placeholder="kullanıcı isminiz" autoComplete="username" onChange = {(e) => setUsername(e.target.value)} />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="password" placeholder="şifreniz" autoComplete="current-password" onChange = {(e) => setPassword(e.target.value)} />
                    </CInputGroup>
                    <CRow>
                      <CCol xs="6">
                        <CButton color="primary" className="px-4" onClick = {submitHandeler}>Giriş yap</CButton>
                      </CCol>
                      <CCol xs="6" className="text-right">
                        <CButton color="link" className="px-0">Şifrenizi unuttunuz mu?</CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Hesap oluşturun</h2>
                    {/* <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                      labore et dolore magna aliqua.</p> */}
                    {/* <Link to="/register"> */}
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>Kayıt olun!</CButton>
                    {/* </Link> */}
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
    </Loader>
   
  )
}

export default Login
