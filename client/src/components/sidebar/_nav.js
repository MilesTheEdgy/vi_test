import React from 'react'
import CIcon from '@coreui/icons-react'

const _nav =  [
  {
    _tag: 'CSidebarNavItem',
    name: 'Ana Sayfa',
    to: '/dashboard',
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon"/>,
    badge: {
      color: 'info',
      text: 'YENI',
    }
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Ürün Arama',
    to: '/urunekle',
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon"/>,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Yeni Teklif',
    to: '/yeniteklif',
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon"/>,
  }
]

export default _nav
