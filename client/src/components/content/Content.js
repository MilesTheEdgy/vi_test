import React, { Suspense } from 'react'
import {
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import { CContainer, CFade } from '@coreui/react'

import UrunEkle from '../../routes/urunekle/UrunEkle'
import Dashboard from '../../routes/Dashboard'
import YeniTeklif from "../../routes/yeniteklif/YeniTeklif"
  
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

const TheContent = () => {
  return (
    <main className="c-main">
      <CContainer fluid>
        <Suspense fallback={loading}>
          <Switch>
            <Route path= "/" exact= {true} name= "Home" />
            <Route path= "/dashboard" name= "Dashboard" render = {props => <CFade> <Dashboard {...props}/> </CFade>} />
            <Route path= "/urunekle" name= "Ürün Ekle" render = {props => <CFade> <UrunEkle {...props}/> </CFade>} />
            <Route path= "/yeniteklif" name= "Yeni Teklif" render = {props => <CFade> <YeniTeklif {...props}/> </CFade>} />
            <Redirect from="/" to="/dashboard" />
          </Switch>
        </Suspense>
      </CContainer>
    </main>
  )
}

export default React.memo(TheContent)
