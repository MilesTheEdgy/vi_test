import { lazy } from 'react'

const WidgetsDropdown = lazy(() => import('./WidgetsDropdown'))
const AnasayfaTable = lazy(() => import('./AnasayfaTable'));


const Dashboard = () => {
  return (
    <>
      <WidgetsDropdown />
      <AnasayfaTable />
    </>
  )
}

export default Dashboard
