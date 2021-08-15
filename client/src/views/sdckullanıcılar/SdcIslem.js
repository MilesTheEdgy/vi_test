import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import AppDataForm from '../../components/appdataform/AppDataForm'

const SdcIslem = ({match}) => {
  const applicationID = match.params.id
  const [sdDetay, setSdDetay] = useState("")
  const [modal, setModal] = useState(false)
  const [modalDetails, setModalDetails] = useState({})
  const [data, setData] = useState({})
  const history = useHistory()
  const dispatch = useDispatch()
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`http://localhost:8080/applications/${applicationID}`,{
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            'authorization' :`Bearer ${document.cookie.slice(8)} `
          }
      })
      if (res.status === 200) {
        const fetchData = await res.json()
        console.log(fetchData)
        setData(fetchData)
      }
    }
    fetchData()
  }, [])
  if (data.ID)
  return (
    <AppDataForm userDetails = {data} />
  )
  else return null
}

export default SdcIslem