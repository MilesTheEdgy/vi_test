import React, { lazy } from "react";
import { useSelector } from "react-redux";
import { TUM_TEKLIFLER, BEKELEYEN_TEKLIFLER, BAKIYE_HAREKETLERI, SIZIN_TEKLIFLERINIZ } from "src/store";
import "./anasayfatable.css"

const TumTeklifler = lazy(() => import('./tables/tumteklifler/TumTeklifler'));
const BekleyenTeklifler = lazy(() => import('./tables/bekleyenteklifler/BekleyenTeklifler'));
const BakiyeHareketleriniz = lazy(() => import('./tables/bakiyehareketleriniz/BakiyeHareketleriniz'));
const SizinTeklifleriniz = lazy(() => import('./tables/sizinteklifleriniz/SizinTeklifleriniz'));

const AnasayfaTable = () => {
  const dashboardTable = useSelector(state => state.dashboardTable)

  const renderAuthButton = () => {
    switch (dashboardTable) {
      case TUM_TEKLIFLER:
        return <TumTeklifler />

      case BEKELEYEN_TEKLIFLER:
        return <BekleyenTeklifler />

      case BAKIYE_HAREKETLERI:
        return <BakiyeHareketleriniz />

      case SIZIN_TEKLIFLERINIZ:
        return <SizinTeklifleriniz />
          
      default:
        break;
    }
  }
  
  return (
    <>
      {renderAuthButton()}
    </>
  )

}

export default AnasayfaTable