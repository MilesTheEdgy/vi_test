import { lazy } from 'react'

const WidgetsDropdown = lazy(() => import('../widgets/WidgetsDropdown'))
const AnasayfaTable = lazy(() => import('../../../src/comps/anasayfatable/AnasayfaTable'));


const Dashboard = () => {
  return (
    <>
      <WidgetsDropdown />
      <AnasayfaTable />
    </>
  )
}

export default Dashboard
