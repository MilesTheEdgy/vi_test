import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { connect, useDispatch } from 'react-redux';
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
  CModalBody,
  CModalFooter,
  CModalTitle
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import "./login.css"

const LoginErrModal = () => {
  const [showModal, closeModal] = useState(true)
  const dispatch = useDispatch()
  return (
    <div className = "loginerrmodal-body">
      <CModal
        show={showModal} 
        centered= {true}
        color= "danger"
        borderColor = "danger"
        onClosed = {() => {
          dispatch({type: "LOGIN-ERROR-CLOSE"})
          closeModal(false)
        }}
      >
        <div className = "loginerrmodal-header">
          <CModalTitle className = "loginerrmodal-title">HATALI GİRİŞ</CModalTitle>
        </div>
        <CModalBody>
          Lütfen bilgilerinizi kontrol ederek tekrar deneyin
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="secondary" 
            // onClick={() => closeModal(false)}
          >Kapat
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

class Login extends React.Component {

  constructor() {
    super()
    this.state = {
      username: "",
      password: ""
    }
  };

  onUsernameChange = (e) => {
    this.setState({username: e.target.value});
  };

  onPasswordChange = (e) => {
    this.setState({password: e.target.value});
  };


  onSubmit = async () => {
    // document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    this.props.logoutUser()
    let res = await fetch("http://localhost:8080/login", {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization' :'Bearer '
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      }) 
    })
    if (res.status === 200) {
      let data = await res.json()
      // console.log("token from login: ", data.token)
      document.cookie = `vitoken=${data.token}`
      console.log("cookie is: ", document.cookie)
      let userData = {
        username: data.username,
        userRole: data.userRole
      }
      this.props.userLoggingin()
      this.props.fillUserInfo(userData)
      // this.props.history.push("/anasayfa")

    } else {
      this.props.userLoggininErr()
    }
    // if (res.status === 200) {
    //   this.props.userLoggininErr()
    // }

  }

  render() {
    return (
      <div className="c-app c-default-layout flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
          {
            this.props.loginErr ?
            <LoginErrModal/>
            :
            <> </>
          }
            <CCol md="8">
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm>
                      <h1>Kullanıcı girişi</h1>
                      <p className="text-muted">Hesabınıza giriş yapın</p>
                      <CInputGroup className="mb-3">
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name="cil-user" />
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="text" placeholder="Kullanıcı adı" autoComplete="username" onChange = {this.onUsernameChange} />
                      </CInputGroup>
                      <CInputGroup className="mb-4">
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name="cil-lock-locked" />
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="password" placeholder="Şifre" autoComplete="current-password" onChange = {this.onPasswordChange} />
                      </CInputGroup>
                      <CRow>
                        <CCol xs="6">
                          <CButton color="primary" className="px-4" onClick = {this.onSubmit}>Giriş</CButton>
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
                      <h2>HESAP OLUŞTURUN</h2>
                      <p>Sayfamıza ilk defa giriş yapıyorsanız buradan hesabınızı oluşturabilirsiniz</p>
                      <Link to="/register">
                        <CButton color="primary" className="mt-3" active tabIndex={-1}>Şimdi Oluşturun!</CButton>
                      </Link>
                    </div>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    )  
  }
}

const mapStateToProps = (state) => {
  return {
    loginErr: state.reducer.loginErr
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    userLoggingin : () => {
          dispatch({type: "LOGIN", payload: "hello"})
      },
    userLoggininErr: () => {
          dispatch({type: "LOGIN-ERROR"})
    },
    logoutUser : () => {
      dispatch({type: "LOGOUT"})
    },
    fillUserInfo: (data) => {
      dispatch({type: "FILL_USER_INFO", payload: data})
    }
  }
}   

export default connect(mapStateToProps, mapDispatchToProps)(Login);
