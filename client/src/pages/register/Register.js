import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import { Link } from "react-router-dom"
import CIcon from '@coreui/icons-react'
import { gql, useMutation } from "@apollo/client"
import Modal from '../../components/modals/Modal'
import Toaster from '../../components/toaster/Toaster'
import Loader from "../../hoc/loader/Loader"

const Register = () => {
  const missingInfo = "Lütfen tüm alanları doldurunuz"
  const unmatchedPassword = "Şifreniz uyuşmuyor, lütfen şifrelerinizi kontrol edin"
  const userAlreadyExists = "Bu kullanıcı adı alınmıştır. Lütfen farklı bir kullanıcı adı seçiniz"
  const modalErrorObj = {
    header: "HATA",
    body: "Bilgileriniz kaydedilmedi, lütfen daha sonra tekrar deneyin",
    color: "danger"
  }
  const modalSuccessObj = {
    header: "BAŞARILI",
    body: "Talebiniz başarıyla işlenmiştir! giriş yapabilirsiniz.",
    color: "success"
  }
  const [username, setUsername] = useState("")
  const [pharmacyName, setPharmacyName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [modal, setModal] = useState({
    header: "",
    body: "",
    color: ""
  })
  const [modalOn, setModalOn] = useState(false)
  const [toasters, addToaster] = useState([])
  const reset = () => {
    setUsername("")
    setPharmacyName("")
    setPassword("")
    setConfirmPassword("")
  }
  const REGISTER_USER = gql`
    mutation($username: String!, $password: String!, $pharmacy_name:String!) {
      register(username: $username, password: $password, pharmacy_name: $pharmacy_name) {
        username
        password
        pharmacy_name
      }
    }
  `;
  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    fetchPolicy: "no-cache",
    variables: {username, password, pharmacy_name: pharmacyName},
    onError: (err) => {
      console.log()
      if (err.graphQLErrors[0]?.code === 451) {
        addToaster([
          ...toasters,
          {body: userAlreadyExists}
        ])
      } else {
        setModal(modalErrorObj)
        setModalOn(true)
        reset()
      }
    },
    onCompleted: (data) => {
      setModal(modalSuccessObj)
      setModalOn(true)
      reset()
    }
  })
  const verifyInput = () => {
    if (username === "" || password === "" || confirmPassword === "" || pharmacyName === "") {
      addToaster([
        ...toasters,
        {body: missingInfo}
      ])
      return false
    }
    return true
  }
  const verifyPassword = () => {
    if (password !== confirmPassword) {
      addToaster([
        ...toasters,
        {body: unmatchedPassword}
      ])
      return false
    }
    return true
  }
  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <Loader isLoading = {loading} >
        <CContainer>
        {
          toasters.map((element, i) => {
            return <Toaster key = {i} body = {element.body} show = {true} color = {"danger"} />
          })
        }
        <Modal header = {modal.header} body = {modal.body} color = {modal.color} modalOn = {modalOn} setModal = {setModalOn}/>
          <CRow className="justify-content-center">
            <CCol md="9" lg="7" xl="6">
              <CCard className="mx-4">
                <CCardBody className="p-4">
                  <CForm>
                    <div className = "container">
                      <div className = "row">
                        <div className = "col">
                          <h1>Kayıt olun</h1>
                          <p className="text-muted">Hesabınızı oluşturun</p>
                        </div>
                        <div>
                          <Link to = "/login" ><p>Giriş sayfasına git</p></Link>
                        </div>
                      </div>
                    </div>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" placeholder="Kullanıcı isminiz" autoComplete="username" value = {username}
                      onChange = {(e) => setUsername(e.target.value)} />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" placeholder="Eczanenizin ismi ÖRN: Hayat Eczanesi" autoComplete="pharmacy-name" value = {pharmacyName}
                      onChange = {(e) => {
                        setPharmacyName(e.target.value)
                        }} />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="password" placeholder="Şifreniz" autoComplete="new-password" value = {password}
                      onChange = {(e) => setPassword(e.target.value)} />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="password" placeholder="Şifrenizi tekrar giriniz" autoComplete="new-password" value = {confirmPassword}
                      onChange = {(e) => setConfirmPassword(e.target.value)} />
                    </CInputGroup>
                    <CButton color="success" block onClick = {() => {
                      if (verifyInput() === false || verifyPassword() === false)
                        return
                      else registerUser()
                    }}>Hesabınızı oluşturun</CButton>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </Loader>
    </div>
  )
}

export default Register
