(this.webpackJsonptest=this.webpackJsonptest||[]).push([[24],{641:function(e,t,s){"use strict";s(1);var c=s(636),r=s(7);t.a=function(e){return e.dispatch?Object(r.jsxs)(c.J,{show:e.on,onClose:function(){return e.dispatch({type:"MODAL_DISPLAY",payload:{type:"CLOSE"}})},color:e.color,centered:!0,children:[Object(r.jsx)(c.M,{closeButton:!0,children:Object(r.jsxs)(c.N,{children:[" ",e.header," "]})}),Object(r.jsx)(c.K,{children:Object(r.jsx)("h5",{children:e.body})}),Object(r.jsx)(c.L,{children:Object(r.jsx)(c.d,{color:"secondary",onClick:function(){return e.dispatch({type:"MODAL_DISPLAY",payload:{type:"CLOSE"}})},children:"Kapat"})})]}):Object(r.jsxs)(c.J,{show:e.modalOn,onClose:function(){return e.setModal(!e.modalOn)},color:e.color,centered:!0,children:[Object(r.jsx)(c.M,{closeButton:!0,children:Object(r.jsxs)(c.N,{children:[" ",e.header," "]})}),Object(r.jsx)(c.K,{children:Object(r.jsx)("h5",{style:{textAlign:"center"},children:e.body})}),Object(r.jsx)(c.L,{children:Object(r.jsx)(c.d,{color:"secondary",onClick:function(){return e.setModal(!e.modalOn)},children:"Kapat"})})]})}},643:function(e,t,s){"use strict";s.d(t,"b",(function(){return c})),s.d(t,"a",(function(){return r})),s.d(t,"c",(function(){return a}));var c=function(e){return e.map((function(e){var t=new Date(e.submit_time),s=new Date(e.status_change_date),c=new Date(e.last_change_date),r=0,a="";return"approved"===e.status?(r=3,a="Onayland\u0131"):"rejected"===e.status?(r=3,a="\u0130ptal"):"processing"===e.status?(r=2,a="\u0130\u015fleniyor"):"sent"===e.status&&(a="G\xf6nderildi",r=1),{ID:e.id,"\u0130sim":e.client_name,Tarih:t.toISOString().slice(0,10),Hizmet:e.service_name,Kampanya:e.offer_name,"A\xe7\u0131klama":e.description,"Stat\xfc":a,salesRepDetails:e.sales_rep_details?e.sales_rep_details:"",statusChangeDate:s?s.toISOString().slice(0,10):null,finalSalesRepDetails:e.final_sales_rep_details?e.final_sales_rep_details:"",lastChangeDate:c?c.toISOString().slice(0,10):null,submitProcessNum:r,imageURLS:e.image_urls?e.image_urls:null}}))},r=function(e){switch(e){case"Onayland\u0131":return"success";case"\u0130\u015fleniyor":return"warning";case"\u0130ptal":return"danger";case"G\xf6nderildi":return"secondary";default:return"primary"}},a=function(e){switch(e){case"dealer":return"Bayi";case"sales_assistant":return"Sat\u0131\u015f Destek";case"sales_assistant_chef":return"Sat\u0131\u015f Destek \u015eefi";case"admin":return"Admin";default:return""}}},693:function(e,t,s){},732:function(e,t,s){"use strict";s.r(t);var c=s(637),r=s(50),a=s.n(r),n=s(69),l=s(1),i=s(636),o=(s(693),s(13)),j=s(641),d=s(643),u=s(7);t.default=function(e){var t,s=e.match,r=s.params.id,b=function(){var e=Object(n.a)(a.a.mark((function e(t){var s,c,n;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("/applications/".concat(r),{method:"GET",headers:{"content-type":"application/json",authorization:"Bearer ".concat(document.cookie.slice(8)," ")}});case 2:if(200!==(s=e.sent).status){e.next=9;break}return e.next=6,s.json();case 6:c=e.sent,n=Object(d.b)(c),t(n[0]);case 9:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),h=function(){var e=Object(n.a)(a.a.mark((function e(t){var c,r,n=arguments;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return c=n.length>1&&void 0!==n[1]&&n[1],r=c?"/basvurular/".concat(s.params.id,"/sp"):"/basvurular/".concat(s.params.id),e.next=4,fetch(r,{method:"PUT",headers:{"content-type":"application/json",authorization:"Bearer ".concat(document.cookie.slice(8))},body:JSON.stringify({salesRepDetails:m,statusChange:t})});case 4:if(200!==e.sent.status){e.next=12;break}return e.next=8,b(H);case 8:D(f),w(!0),e.next=14;break;case 12:D(y),w(!0);case 14:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),O=Object(l.useState)(""),x=Object(c.a)(O,2),m=x[0],p=x[1],f={header:"BA\u015eARILI",body:"Ba\u015fvurunuz ba\u015far\u0131yla g\xfcncellenmi\u015ftir",color:"success"},y={header:"HATA",body:"Bir hata olmu\u015ftur, l\xfctfen sayfay\u0131 yenileyerek tekrar deneyin",color:"danger"},v=Object(l.useState)(!1),g=Object(c.a)(v,2),k=g[0],w=g[1],S=Object(l.useState)({}),N=Object(c.a)(S,2),_=N[0],D=N[1],B=Object(l.useState)({}),A=Object(c.a)(B,2),C=A[0],H=A[1],L=Object(o.g)();return Object(l.useEffect)((function(){b(H)}),[]),Object(u.jsxs)(i.Q,{className:"justify-content-center align-items-center",children:[Object(u.jsx)(j.a,{modalOn:k,setModal:w,color:_.color,header:_.header,body:_.body}),Object(u.jsx)(i.j,{xs:"12",sm:"8",children:Object(u.jsxs)(i.e,{children:[Object(u.jsxs)(i.i,{className:"basvuru-detay-header",style:{backgroundColor:function(e){switch(e.Stat\u00fc){case"\u0130\u015fleniyor":return"rgb(214, 160, 11)";case"\u0130ptal":return"rgb(212, 69, 13)";case"Onayland\u0131":return"rgb(55, 150, 55)";default:return"rgb(120, 138, 151)"}}(C)},children:[Object(u.jsx)("h4",{children:"Ba\u015fvuru Detay"}),Object(u.jsx)(i.j,{sm:"2",className:"basvuru-detay-header-buttonCol",children:Object(u.jsx)(i.d,{active:!0,block:!0,color:"secondary","aria-pressed":"true",onClick:function(){L.push("/basvurular/goruntule")},children:"Geri"})})]}),Object(u.jsxs)(i.f,{className:"basvuru-detay",children:[Object(u.jsxs)(i.v,{row:!0,className:"my-0",children:[Object(u.jsx)(i.j,{xs:"12",lg:"2",children:Object(u.jsxs)(i.v,{children:[Object(u.jsx)(i.H,{children:"ID"}),Object(u.jsx)(i.B,{placeholder:C.ID,readOnly:!0})]})}),Object(u.jsx)(i.j,{xs:"12",lg:"10",children:Object(u.jsxs)(i.v,{children:[Object(u.jsx)(i.H,{children:"\u0130sim"}),Object(u.jsx)(i.B,{placeholder:C.\u0130sim,readOnly:!0})]})})]}),Object(u.jsxs)(i.v,{row:!0,className:"my-0",children:[Object(u.jsx)(i.j,{xs:"12",lg:"2",children:Object(u.jsxs)(i.v,{children:[Object(u.jsx)(i.H,{children:"Stat\xfc"}),Object(u.jsx)(i.B,{placeholder:C.Stat\u00fc,readOnly:!0})]})}),Object(u.jsx)(i.j,{xs:"12",lg:"2",children:Object(u.jsxs)(i.v,{children:[Object(u.jsx)(i.H,{children:"Tarih"}),Object(u.jsx)(i.B,{placeholder:C.Tarih,readOnly:!0})]})}),Object(u.jsx)(i.j,{xs:"12",lg:"2",children:Object(u.jsxs)(i.v,{children:[Object(u.jsx)(i.H,{children:"Hizmet"}),Object(u.jsx)(i.B,{placeholder:C.Tip,readOnly:!0})]})}),Object(u.jsx)(i.j,{xs:"12",lg:"6",children:Object(u.jsxs)(i.v,{children:[Object(u.jsx)(i.H,{children:"Kampanya"}),Object(u.jsx)(i.B,{placeholder:C.Kampanya,readOnly:!0})]})})]}),(t=C,2===t.submitProcessNum?Object(u.jsxs)(i.v,{row:!0,children:[Object(u.jsxs)(i.j,{children:[Object(u.jsx)(i.H,{children:"Bayi A\xe7\u0131klamas\u0131"}),Object(u.jsx)(i.ab,{rows:"8",placeholder:C.A\u00e7\u0131klama,readOnly:!0})]}),Object(u.jsxs)(i.j,{children:[Object(u.jsx)(i.H,{children:"\xd6nceki Notlar\u0131n\u0131z"}),Object(u.jsx)(i.ab,{rows:"8",placeholder:C.salesRepDetails,readOnly:!0})]})]}):(t.submitProcessNum,Object(u.jsxs)(i.v,{children:[Object(u.jsx)(i.H,{children:"Bayi A\xe7\u0131klamas\u0131"}),Object(u.jsx)(i.ab,{rows:"4",placeholder:C.A\u00e7\u0131klama,readOnly:!0})]}))),3===C.submitProcessNum?Object(u.jsxs)(i.v,{children:[Object(u.jsx)(i.H,{children:"Son notlar\u0131n\u0131z"}),Object(u.jsx)(i.ab,{rows:"6",placeholder:C.finalSalesRepDetails,readOnly:!0})]}):Object(u.jsxs)(i.v,{children:[Object(u.jsx)(i.H,{children:"Notlar\u0131n\u0131z"}),Object(u.jsx)(i.ab,{rows:"6",placeholder:"i\u015flemle alakal\u0131 notlar\u0131n\u0131z...",onChange:function(e){return p(e.target.value)}})]}),Object(u.jsxs)(i.v,{row:!0,className:"justify-content-center",children:[Object(u.jsx)(i.H,{children:"Ba\u015fvuru resimler: "}),C.imageURLS&&C.imageURLS.map((function(e,t){return Object(u.jsx)(i.j,{md:"3",children:Object(u.jsx)("a",{href:e,target:"_blank",rel:"noreferrer",children:Object(u.jsx)("img",{alt:"",style:{maxWidth:"200px",maxHeight:"200px",cursor:"pointer"},src:e})})},t)}))]}),Object(u.jsx)(i.v,{row:!0,className:"basvuru-detay-submit-buttons my-0",children:Object(u.jsx)(i.j,{lg:"4",children:function(e){return 2===e.submitProcessNum?Object(u.jsxs)("div",{id:"basvuruDetay-footerButtons",children:[Object(u.jsxs)(i.d,{onClick:function(){return h("rejected",!0)},size:"md",color:"danger",children:[Object(u.jsx)("i",{className:"fas fa-ban"})," \u0130PTAL"]}),Object(u.jsxs)(i.d,{onClick:function(){return h("approved",!0)},size:"md",color:"success",className:"",children:[Object(u.jsx)("i",{className:"fas fa-check-circle"})," ONAYLA"]})]}):3===e.submitProcessNum?null:Object(u.jsxs)("div",{id:"basvuruDetay-footerButtons",children:[Object(u.jsxs)(i.d,{onClick:function(){return h("rejected")},size:"md",color:"danger",children:[Object(u.jsx)("i",{className:"fas fa-ban"})," \u0130PTAL"]}),Object(u.jsxs)(i.d,{onClick:function(){return h("processing")},size:"md",color:"warning",className:"basvuru-detay-submit-buttons-submit",children:[Object(u.jsx)("i",{className:"fas fa-arrow-circle-up"})," \u0130\u015eLE"]})]})}(C)})})]})]})})]})}}}]);
//# sourceMappingURL=24.5d026b95.chunk.js.map