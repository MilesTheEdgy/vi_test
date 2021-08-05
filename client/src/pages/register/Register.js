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
import CIcon from '@coreui/icons-react'
import { gql, useMutation } from "@apollo/client"

const Register = () => {
  const [username, setUsername] = useState("")
  const [pharmacyName, setPharmacyName] = useState("")
  const [addPharmacyToName, setAddPharmacyToName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
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
      console.log(err)
    },
    onCompleted: (data) => {
      console.log(data)
    }
  })
  const verifyInput = () => {
    if (username === "" || password === "" || confirmPassword === "" || pharmacyName === "")
      return false
  }
  const verifyPassowrd = () => {
    if (password !== confirmPassword)
      return false
  }
  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="9" lg="7" xl="6">
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <h1>Kayıt olun</h1>
                  <p className="text-muted">Hesabınızı oluşturun</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-user" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="text" placeholder="Kullanıcı isminiz" autoComplete="username"
                     onChange = {(e) => setUsername(e.target.value)} />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-user" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="text" placeholder="Eczanenizin ismi ÖRN: Hayat Eczanesi" autoComplete="pharmacy-name"
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
                    <CInput type="password" placeholder="Şifreniz" autoComplete="new-password"
                     onChange = {(e) => setPassword(e.target.value)} />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-lock-locked" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="password" placeholder="Şifrenizi tekrar giriniz" autoComplete="new-password"
                    onChange = {(e) => setConfirmPassword(e.target.value)} />
                  </CInputGroup>
                  <CButton color="success" block onClick = {() => {
                    if (verifyInput() === false || verifyPassowrd === false)
                      console.log("your input was missing")
                    else return console.log("SUCCESS")
                  }}>Hesabınızı oluşturun</CButton>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
