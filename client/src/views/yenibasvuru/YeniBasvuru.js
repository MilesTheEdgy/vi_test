import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CForm,
  CFormGroup,
  CFormText,
  CTextarea,
  CInput,
  CInputRadio,
  CLabel,
  CSelect,
  CRow,
  CToaster,
  CToast,
  CToastBody,
  CModal,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CInputFile
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import "./yenibasvuru.css";
import Loader from "../../components/loader/Loader"

const MissingInfoModal = ({reset}) => {
    const [modalShow, setModalShow] = useState(true)
    return (
        <div className = "loginerrmodal-body">
            <CModal
                show={modalShow} 
                centered= {true}
                color= "danger"
                borderColor = "danger"
                onClosed = {() => {
                    setModalShow(false)
                    reset()
                    }}
            >
                <div className = "loginerrmodal-header">
                    <CModalTitle className = "loginerrmodal-title">HATALI GİRİŞ</CModalTitle>
                </div>
                <CModalBody>
                Başvurunuzda eksik bilgi bulunyor, Lütfen Bilgilerinizi tamamlayınız
                </CModalBody>
                <CModalFooter>
                <CButton 
                    color="secondary" 
                    onClick={() => {
                        setModalShow(false)
                        reset()
                        }}
                >Kapat
                </CButton>
                </CModalFooter>
            </CModal>
        </div>
    )
}

const SubmitApplicationResultText = ({isSuccess}) => {
    return (
        <CToaster position="top-right">
            <CToast show={true} autohide={3000} fade={true} color={isSuccess ? "success" : "danger"} className = "applicationToaster">
                <CToastBody>{isSuccess ? "Talebiniz başarıyla gönderilmiştir!": "Bir sorun oldu, lütfen daha sonra tekrar deneyin"}</CToastBody>
            </CToast>
        </CToaster>
    )
} 

const YeniBaşvuruExtraCheckboxes = ({setClientWantsRouter}) => {
    return (
        <CFormGroup row>
            <CCol md="3">
                <CLabel>Modem istiyor mu?</CLabel>
            </CCol>
            <CCol md="9" onChange = {setClientWantsRouter} >
                <CFormGroup variant="checkbox">
                    <CInputRadio className="form-check-input" id="radio1" name="radios" value="option1" />
                    <CLabel variant="checkbox" htmlFor="radio1">Modem istiyor</CLabel>
                </CFormGroup>
                <CFormGroup variant="checkbox">
                    <CInputRadio className="form-check-input" id="radio2" name="radios" value="option2" />
                    <CLabel variant="checkbox" htmlFor="radio2">Modem istemiyor</CLabel>
                </CFormGroup>
            </CCol>
        </CFormGroup>
    )
}

const SelectedOfferComp = ({selectedService, offers, setOfferValueDSL}) => {
    const [selectedOfferEmpty, setSelectedOffer] = useState(false)
     
    useEffect(() => {
        if (selectedService.match(/^(|Devir|İptal|Nakil)$/))
            setSelectedOffer(true)
        // if (selectedService === ""
        //  || selectedService === "Devir" 
        //  || selectedService === "İptal" 
        //  || selectedService === "Nakil") 

        else setSelectedOffer(false)

        return () => {
            setSelectedOffer(false)
        }
    }, [selectedService])

    return (
        <CSelect custom name="select" id="select" disabled = {selectedOfferEmpty ? true : false} onChange = {setOfferValueDSL} >
        {
            offers.map((offer, index) => {
                return <option key = {`${index+1}`} >{offer}</option>
            })
        }
        </CSelect>
    )
}

class YeniBasvuru extends React.Component {

    constructor() {
        super();
        this.state = {
            selectedService : "",
            selectedOffer: "",
            clientWantsRouter: 0,
            clientDescription: "",
            clientName: "",
            clientAppFiles: null,

            offers : [],
            dslOffers : [
                "", "Ahlan", "3 Ay Bedava", "Fiber Hız Sever", "4 Mevsim"
            ],
            taahütOffers: [
                "", "İnternette Fırsat Kampanyası", "Efsane Taahüt Yenileme Kampanyası", "En Güzel Taahüt Yenileme Kampanyası"
            ],
            tivibuOffers: [
                "", "3 Ay Bedava Tivibu", "Sinema Paketi", "Super Paket", "Giriş Paket"
            ],
            PSTNOffers: [
                "", "Sınırsız Konuş", "250DK konuşma Paketi"
            ],
            isOfferValueDSL: false,
            isApplicationSubmitting: false,
            isSubmitSuccess: undefined,
            didApplicationFinishSubmit: false,

            areAppFieldsMissing: false
        }
    }

    setClientWantsRouter = (e) => {
        let value = e.target.value
        if (value === "option1") this.setState({clientWantsRouter: 1})
        else this.setState({clientWantsRouter: 0})
    }

    setOfferValueDSL = (e) => {
        let value = e.target.value
        this.setState({selectedOffer: value})
        if (this.state.selectedService === "DSL" && value !== "")
        this.setState({isOfferValueDSL: true})
        else this.setState({isOfferValueDSL: false})
    }

    selectedServiceHandler = (e) => {
        let value = e.target.value
        const { dslOffers, taahütOffers, tivibuOffers, PSTNOffers } = this.state;
        this.setState({selectedService: value})   
        switch (value) {
            case "DSL":
                this.setState({offers: dslOffers, isOfferValueDSL: false})           
                break;
            case "Taahüt":
                this.setState({offers: taahütOffers, isOfferValueDSL: false})                   
                break;

            case "Tivibu":
                this.setState({offers: tivibuOffers, isOfferValueDSL: false})                   
                break;

            case "PSTN":
                this.setState({offers: PSTNOffers, isOfferValueDSL: false})                   
                break;

            default:
                this.setState({offers: [], isOfferValueDSL: false})
                break;
        };
    }

    onDescriptionChange = (e) => {
        this.setState({clientDescription: e.target.value});
    }

    onCustomernameChange = (e) => {
        this.setState({clientName: e.target.value});

    }

    onSubmitApplication = async() => {
        const { selectedService, selectedOffer, 
            clientWantsRouter, clientDescription,
             clientName} = this.state;

        if (!selectedService || !clientDescription || !clientDescription || !clientName)  {
            this.setState({areAppFieldsMissing: true})
            console.log(this.state.areAppFieldsMissing)
            return
        }
        this.setState({isApplicationSubmitting: true})

        let res = await fetch("http://localhost:8080/bayi/basvuru/yeni", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization' :`Bearer ${document.cookie.slice(8)} `
            },
        body: JSON.stringify({
            selectedService: selectedService,
            selectedOffer: selectedOffer,
            clientWantsRouter: clientWantsRouter,
            clientDescription: clientDescription,
            clientName: clientName
            }) 
        });
        if (res.status === 200 ) {
            this.setState({isSubmitSuccess: true})
        } else {
            this.setState({isSubmitSuccess: false})
        }

        this.setState({isApplicationSubmitting: false, didApplicationFinishSubmit: true})
        this.resetInput();
        setTimeout(() => this.resetAppStats(), 4300)

    }

    resetInput = () => {
        this.setState({
            selectedService : "",
            selectedOffer: "",
            clientWantsRouter: 0,
            clientDescription: "",
            clientName: "",
            offers : [],
            isOfferValueDSL: false,
            areAppFieldsMissing: false
        })
    }

    resetAppStats = () => {
        this.setState({
            isApplicationSubmitting: false,
            isSubmitSuccess: undefined,
            didApplicationFinishSubmit: false
        })
    }

    loadImage = (event) => {
        if (event.target.files && event.target.files[0]) {
            console.log("event.target.files", event.target.files)
            let img = event.target.files;
            // console.log("img before using createobjecturl", URL.createObjectURL(img))
            this.setState({clientAppFiles: img})
        }
    }

    onImageUpload = async () => {
        const { selectedService, selectedOffer, 
            clientWantsRouter, clientDescription,
             clientName} = this.state;
        const image = this.state.clientAppFiles
        const formData = new FormData()
        formData.append("selectedService", "selectedService")
        formData.append("selectedOffer", "selectedOffer")
        formData.append("clientWantsRouter", "clientWantsRouter")
        formData.append("clientDescription", "clientDescription")
        formData.append("clientName", "clientName")
        for (let i = 0; i < image.length; i++) {
            formData.append("image", image[i])            
        }
        try {
          console.log("fetching")
          const res = await fetch("http://localhost:8080/bayi/basvuru/yeni", {
            method: "POST",
            headers: {
            'authorization' :`Bearer ${document.cookie.slice(8)} `
            },
            body: formData
          })
          const data = await res.json()
          console.log("data from fetch", data)
        } catch (error) {
          console.log(error)
        }
      }
 
    render() {
        const {selectedService, offers, isOfferValueDSL, isApplicationSubmitting, isSubmitSuccess, didApplicationFinishSubmit, clientDescription, clientName, areAppFieldsMissing } = this.state;
        return (
            <CRow className = "d-flex justify-content-center">
                <CCol xs="12" md="8">
                {
                    isApplicationSubmitting && <Loader/>
                }
                {
                    didApplicationFinishSubmit && <SubmitApplicationResultText isSuccess = {isSubmitSuccess} />
                }
                {
                    areAppFieldsMissing ? <MissingInfoModal reset = {this.resetInput} /> : null
                }
                <CCard>
                    <CCardHeader className = "basvuruFormHeader">
                    Yeni Başvuru Sayfası
                    </CCardHeader>
                    <CCardBody>
                    <CForm action="" method="post" encType="multipart/form-data" className="form-horizontal">
                        <CFormGroup row>
                            <CCol md="3">
                                <CLabel htmlFor="disabled-input">Aktivasyon</CLabel>
                            </CCol>
                            <CCol xs="12" md="9">
                                <CInput id="disabled-input" name="disabled-input" placeholder="Abdullah Kara" disabled />
                            </CCol>
                        </CFormGroup>
                        <CFormGroup row>
                            <CCol md="3">
                                <CLabel htmlFor="disabled-input">Satış Sorumlusu</CLabel>
                            </CCol>
                            <CCol xs="12" md="9">
                                <CInput id="disabled-input" name="disabled-input" placeholder="Erdem Mutlu" disabled />
                            </CCol>
                        </CFormGroup>
                        <CFormGroup row>
                            <CCol md="3">
                                <CLabel htmlFor="disabled-input">Bayi</CLabel>
                            </CCol>
                            <CCol xs="12" md="9">
                                <CInput id="disabled-input" name="disabled-input" placeholder="EGE İLETİŞİM" disabled />
                            </CCol>
                        </CFormGroup>
                        <CFormGroup row>
                        <CCol md="3">
                            <CLabel htmlFor="select">Verilen Hizmet</CLabel>
                        </CCol>
                        <CCol xs="12" md="9">
                            <CSelect value = {selectedService} custom name="select" id="select" onChange = {this.selectedServiceHandler} >
                                <option></option>
                                <option>DSL</option>
                                <option>Taahüt</option>
                                <option>Tivibu</option>
                                <option>PSTN</option>
                                <option>İptal</option>
                                <option>Nakil</option>
                                <option>Devir</option>
                            </CSelect>
                        </CCol>
                        </CFormGroup>
                        <CFormGroup row>
                        <CCol md="3">
                            <CLabel htmlFor="select" >Kampanya Seçimi</CLabel>
                        </CCol>
                        <CCol xs="12" md="9">
                            <SelectedOfferComp selectedService = {selectedService} offers = {offers} setOfferValueDSL = {this.setOfferValueDSL} />
                        </CCol>
                        </CFormGroup>
                        {
                            isOfferValueDSL ?
                                <YeniBaşvuruExtraCheckboxes setClientWantsRouter = {this.setClientWantsRouter}/>
                            :
                                null
                        }
                        <CFormGroup row>
                        <CCol md="3">
                            <CLabel htmlFor="textarea-input">Açıklama</CLabel>
                        </CCol>
                        <CCol xs="12" md="9">
                            <CTextarea 
                            name="textarea-input" 
                            id="textarea-input" 
                            rows="9"
                            placeholder="İşlemle alakalı ekstra detaylarınız"
                            value = {clientDescription}
                            onChange = {this.onDescriptionChange}
                            />
                        </CCol>
                        </CFormGroup>
                        <CFormGroup row>
                        <CCol md="3">
                            <CLabel htmlFor="text-input">Müşteri</CLabel>
                        </CCol>
                        <CCol xs="12" md="9">
                            <CInput value = {clientName} id="text-input" name="text-input" placeholder="" onChange = {this.onCustomernameChange}/>
                            <CFormText>müşterinin isim soyisimi</CFormText>
                        </CCol>
                        </CFormGroup>
                        <CFormGroup row>
                            <CCol md="3">
                                <CLabel>Başvuru dosyaları</CLabel>
                            </CCol>
                            <CCol xs="12" md="9">
                                <CInputFile 
                                id="file-multiple-input" 
                                name="file-multiple-input"
                                multiple
                                custom
                                onChange = {this.loadImage}
                                />
                                <CLabel htmlFor="file-multiple-input" variant="custom-file">
                                Dosyalarını seç
                                </CLabel>
                            </CCol>
                        </CFormGroup>
                        <CFormGroup row>
                            <CLabel col md={3}>Dosyanı seç</CLabel>
                            <CCol xs="12" md="9">
                                <CInputFile custom id="custom-file-input" onChange = {this.loadImage} />
                                <CLabel htmlFor="custom-file-input" variant="custom-file">
                                Testing
                                </CLabel>

                                <CInputFile 
                                    id="file-multiple-input" 
                                    name="file-multiple-input" 
                                    multiple
                                    custom
                                    onChange = {this.loadImage}
                                />
                                <CLabel htmlFor="file-multiple-input" variant="custom-file">
                                Choose Files...
                                </CLabel>
                            </CCol>
                            <CCol>
                                <CButton color = "primary" onClick = {this.onImageUpload} >submitimage</CButton>
                            </CCol>
                        </CFormGroup>
                    </CForm>
                    </CCardBody>
                    <CCardFooter>
                    <CButton type="submit" size="sm" color="primary" onClick = {this.onSubmitApplication} ><CIcon name="cil-scrubber"/> Gönder</CButton>
                    <CButton type="reset" size="sm" color="danger" onClick = {this.resetInput}  ><CIcon name="cil-ban"/> Resetle</CButton>
                    </CCardFooter>
                </CCard>
                
                </CCol>
            </CRow>
        )
    }

}

export default YeniBasvuru
