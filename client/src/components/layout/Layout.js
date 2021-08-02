import React from 'react'
import Sidebar from "../sidebar/Sidebar"
import Header from "../header/Header.jsx"
import Footer from '../footer/Footer'
const Layout = () => {

  return (
    <div className="c-app c-default-layout">
      <Sidebar/>
      <div className="c-wrapper">
        <Header/>
        <div className="c-body">
          {/* <TheContent/> */}
          {null}
        </div>
        <Footer/>
      </div>
    </div>
  )
}

export default Layout
