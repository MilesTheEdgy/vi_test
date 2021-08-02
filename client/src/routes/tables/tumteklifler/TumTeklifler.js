import React, { useEffect, useState } from "react";
import { CDataTable, CBadge, CButton, CCollapse, CCol, CLabel, CRow } from "@coreui/react";
import Loader from "src/comps/loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { fields, getBadge, getStatus, getCondition, toggleDetails, whichCollapsedToRender } from "../";
import "../style.css"

const TumTeklifler = () => {
    const [data, setData] = useState([])
    const [details, setDetails] = useState([])
    const [clickedItemIndex, setClickedItemIndex] = useState(0)
    const [order, setOrder] = useState(0)
    const [total, setTotal] = useState(0)
    const [bakiyeSonra, setBakiyeSonra] = useState(0)
    const mainDispatch = useDispatch()
    const tumTekliflerID = "/api/data/table/tum"
    
    const eczaneName = useSelector(state => state.user.userSettings.eczaneName)
    const bakiye = useSelector(state => state.user.userInfo.bakiye)

    const fetchData = async (tableAPIstring) => {
      mainDispatch({type: "TOGGLE_LOADING_TRUE"})
      const res = await fetch(tableAPIstring, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${document.cookie.slice(11)} `
        }
      })

      if (res.status === 200) {
        const data = await res.json()
        const dataArr = data.map((obj, i) => {
          let bgColor = ""
          switch (obj.status) {
            case "APPROVED":
              bgColor = "rgb(55, 229, 148, 0.25)";
              break;
            case "DELETED":
              bgColor = "red";
              break
            default:
              break;
          }
          return {
            birimFiyat: obj.price,
            durum: obj.status,
            eczane: obj.submitter,
            hedef: obj.goal,
            ID: obj.id,
            kampanya: obj.condition,
            pledge: obj.poster_pledge,
            sonTarih: obj.final_date,
            İlaç: obj.product_name,
            description: obj.description,
            katılanlar: obj.joiners,
            bgColor: bgColor
          }
        })
        setData(dataArr)
      } else if (res.status === 401 ||res.status === 403) {
        mainDispatch({type: "LOG_OUT"})
      }
      mainDispatch({type: "TOGGLE_LOADING_FALSE"})
    }

    useEffect(() => {
      fetchData("/api/data/table/tum")

    }, [])

    useEffect(() => {
      if (order >= 0) {
        setTotal(order * data[clickedItemIndex]?.birimFiyat)
        setBakiyeSonra(bakiye - total)
      }
    }, [order, total, clickedItemIndex, bakiye, data])
  
    return (
      <>
      <CRow>
        <CCol>
          <CLabel className = "tableLabel tumtekliflerGradient" >Tüm Teklifler </CLabel>
        </CCol>
      </CRow>
      <CRow>
          <CCol>
            <div style = {{border: "solid 1px rgb(229, 83, 83, 0.35)"}} >
              <CDataTable
                header
                items={data}
                fields={fields}
                columnFilter
                footer
                itemsPerPage={50}
                sorter
                pagination
                border
                scopedSlots = {{
                  'eczane':
                    (item)=>(
                      <td style = {{fontSize: "12px"}} >
                          {item.eczane}
                      </td>
                    ),
                  'İlaç':
                  (item)=>(
                    <td>
                      <b>{item.İlaç}</b>
                    </td>
                    ),
                  'hedef':
                    (item)=>(
                      <td>
                        <CBadge color={"secondary"}>
                        {item.pledge}/{item.hedef}
                        </CBadge>
                      </td>
                    ),
                    'birimFiyat':
                  (item)=>(
                    <td style = {{color: "green"}} >
                      {item.birimFiyat} TL
                    </td>
                  ),
                  'kampanya':
                  (item)=>(
                    <td>
                      {
                        getCondition(item.kampanya)
                      }
                    </td>
                  ),
                  'durum':
                    (item)=>(
                      <td>
                        <CBadge color={getBadge(item.durum)}>
                          {getStatus(item.durum)}
                        </CBadge>
                      </td>
                    ),
                  'show_details':
                    (item, index)=>{
                      return (
                        <td className="py-2">
                          <CButton
                            color="primary"
                            variant="outline"
                            shape="square"
                            size="sm"
                            onClick={()=>{
                              toggleDetails(index, details, setDetails, setOrder, setTotal, setBakiyeSonra)
                              setClickedItemIndex(index)
                              }}
                          >
                            {details.includes(index) ? 'Sakla' : 'Göster'}
                          </CButton>
                        </td>
                        )
                    },
                  'details':
                      (item, index)=>{
                        return (
                        <CCollapse show={details.includes(index)}>
                            <CCol sm = "12">
                              {whichCollapsedToRender(eczaneName, item.eczane, item, index, order, setOrder, total, bakiyeSonra, fetchData, tumTekliflerID)}
                            </CCol>
                        </CCollapse>
                      )
                    }
                }}
              />
            </div>
          </CCol>
      </CRow>
      </>
      )
}

export default TumTeklifler;