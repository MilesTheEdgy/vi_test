(this.webpackJsonptest=this.webpackJsonptest||[]).push([[19],{638:function(e,t,n){"use strict";n(642);var r=n(7);t.a=function(e){return e.absolute?Object(r.jsxs)("div",{children:[Object(r.jsx)("div",{className:e.isLoading?"loader loader-absolute":"",children:Object(r.jsx)("div",{className:e.isLoading?"spinner-border":"",role:"status"})}),e.children]}):e.relative?Object(r.jsxs)("div",{className:"relativePosition",children:[Object(r.jsx)("div",{className:e.isLoading?"loader loader-relative":"",children:Object(r.jsx)("div",{className:e.isLoading?"spinner-border":"",role:"status"})}),e.children]}):void 0}},641:function(e,t,n){"use strict";n(1);var r=n(636),a=n(7);t.a=function(e){return e.dispatch?Object(a.jsxs)(r.J,{show:e.on,onClose:function(){return e.dispatch({type:"MODAL_DISPLAY",payload:{type:"CLOSE"}})},color:e.color,centered:!0,children:[Object(a.jsx)(r.M,{closeButton:!0,children:Object(a.jsxs)(r.N,{children:[" ",e.header," "]})}),Object(a.jsx)(r.K,{children:Object(a.jsx)("h5",{children:e.body})}),Object(a.jsx)(r.L,{children:Object(a.jsx)(r.d,{color:"secondary",onClick:function(){return e.dispatch({type:"MODAL_DISPLAY",payload:{type:"CLOSE"}})},children:"Kapat"})})]}):Object(a.jsxs)(r.J,{show:e.modalOn,onClose:function(){return e.setModal(!e.modalOn)},color:e.color,centered:!0,children:[Object(a.jsx)(r.M,{closeButton:!0,children:Object(a.jsxs)(r.N,{children:[" ",e.header," "]})}),Object(a.jsx)(r.K,{children:Object(a.jsx)("h5",{style:{textAlign:"center"},children:e.body})}),Object(a.jsx)(r.L,{children:Object(a.jsx)(r.d,{color:"secondary",onClick:function(){return e.setModal(!e.modalOn)},children:"Kapat"})})]})}},642:function(e,t,n){},643:function(e,t,n){"use strict";n.d(t,"b",(function(){return r})),n.d(t,"a",(function(){return a})),n.d(t,"c",(function(){return s}));var r=function(e){return e.map((function(e){var t=new Date(e.submit_time),n=new Date(e.status_change_date),r=new Date(e.last_change_date),a=0,s="";return"approved"===e.status?(a=3,s="Onayland\u0131"):"rejected"===e.status?(a=3,s="\u0130ptal"):"processing"===e.status?(a=2,s="\u0130\u015fleniyor"):"sent"===e.status&&(s="G\xf6nderildi",a=1),{ID:e.id,"\u0130sim":e.client_name,Tarih:t.toISOString().slice(0,10),Hizmet:e.service_name,Kampanya:e.offer_name,"A\xe7\u0131klama":e.description,"Stat\xfc":s,salesRepDetails:e.sales_rep_details?e.sales_rep_details:"",statusChangeDate:n?n.toISOString().slice(0,10):null,finalSalesRepDetails:e.final_sales_rep_details?e.final_sales_rep_details:"",lastChangeDate:r?r.toISOString().slice(0,10):null,submitProcessNum:a,imageURLS:e.image_urls?e.image_urls:null}}))},a=function(e){switch(e){case"Onayland\u0131":return"success";case"\u0130\u015fleniyor":return"warning";case"\u0130ptal":return"danger";case"G\xf6nderildi":return"secondary";default:return"primary"}},s=function(e){switch(e){case"dealer":return"Bayi";case"sales_assistant":return"Sat\u0131\u015f Destek";case"sales_assistant_chef":return"Sat\u0131\u015f Destek \u015eefi";case"admin":return"Admin";default:return""}}},736:function(e,t,n){"use strict";n.r(t);var r=n(637),a=n(63),s=n.n(a),c=n(88),i=n(1),o=n(636),l=n(645),d=n(641),u=n(643),j=n(638),b=n(53),h=n(7),O=function(){var e=Object(c.a)(s.a.mark((function e(t){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("/user/password",{method:"PATCH",headers:{"Content-Type":"application/json",authorization:"Bearer ".concat(document.cookie.slice(8)," ")},body:JSON.stringify({password:t})});case 2:if(200!==e.sent.status){e.next=7;break}return e.abrupt("return",!0);case 7:return e.abrupt("return",!1);case 8:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),p=function(){var e=Object(c.a)(s.a.mark((function e(t){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("/user/name",{method:"PATCH",headers:{"Content-Type":"application/json",authorization:"Bearer ".concat(document.cookie.slice(8)," ")},body:JSON.stringify({name:t})});case 2:if(200!==e.sent.status){e.next=7;break}return e.abrupt("return",!0);case 7:return e.abrupt("return",!1);case 8:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),x=function(e){var t=new Date(e);return"".concat(t.getFullYear(),"-").concat(t.getMonth()+1,"-").concat(t.getDate())},m={color:"success",header:"Ba\u015far\u0131l\u0131",body:"Bilgileriniz ba\u015far\u0131yla de\u011fi\u015ftirilmi\u015ftir"},f={color:"danger",header:"Hata",body:"Bir sorun oldu, l\xfctfen daha sonra tekrar deneyin"};t.default=function(){var e=Object(b.c)(),t=Object(i.useState)({name:"",role:"",balance:"",registerDate:"",email:""}),n=Object(r.a)(t,2),a=n[0],y=n[1],v=Object(i.useState)(""),g=Object(r.a)(v,2),S=g[0],w=g[1],_=Object(i.useState)("password"),k=Object(r.a)(_,2),z=k[0],D=k[1],B=Object(i.useState)("confirmpassword"),C=Object(r.a)(B,2),L=C[0],N=C[1],H=Object(i.useState)(!0),A=Object(r.a)(H,2),M=A[0],E=A[1],T=Object(i.useState)(!1),R=Object(r.a)(T,2),I=R[0],P=R[1],F=Object(i.useState)(!1),K=Object(r.a)(F,2),Y=K[0],J=K[1],U=Object(i.useState)({}),G=Object(r.a)(U,2),W=G[0],Q=G[1],V=function(){var t=Object(c.a)(s.a.mark((function t(){var n,r;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch("/user",{method:"GET",headers:{"Content-Type":"application/json",authorization:"Bearer ".concat(document.cookie.slice(8)," ")}});case 2:return n=t.sent,t.next=5,n.json();case 5:r=t.sent,y(r[0]),w(r[0].name),e({type:"FILL_USER_INFO",payload:r[0]});case 9:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),q=function(){var e=Object(c.a)(s.a.mark((function e(){var t,n,r;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:s=S,c=a.name,i=z,o=L,t=s!==c&&""!==i&&i===o?"BOTH":s!==c?"USERNAME":i===o?"PASSWORD":void 0,P(!0),e.t0=t,e.next="PASSWORD"===e.t0?5:"USERNAME"===e.t0?10:"BOTH"===e.t0?15:23;break;case 5:return e.next=7,O(z);case 7:return e.sent?(J(!0),Q(m)):(J(!0),Q(f)),e.abrupt("break",24);case 10:return e.next=12,p(S);case 12:return e.sent?(J(!0),Q(m)):(J(!0),Q(f)),e.abrupt("break",24);case 15:return e.next=17,O(z);case 17:return r=e.sent,e.next=20,p(S);case 20:return n=e.sent,r&&n?(J(!0),Q(m)):(J(!0),Q(f)),e.abrupt("break",24);case 23:return e.abrupt("break",24);case 24:return e.next=26,V();case 26:P(!1);case 27:case"end":return e.stop()}var s,c,i,o}),e)})));return function(){return e.apply(this,arguments)}}();return Object(i.useEffect)((function(){V()}),[]),Object(i.useEffect)((function(){""===z||""===L?S!==a.name?E(!1):E(!0):z===L||S!==a.name?E(!1):E(!0)}),[S,z,L,a]),Object(h.jsxs)(o.Q,{className:"d-flex justify-content-center",children:[Object(h.jsx)(d.a,{modalOn:Y,setModal:J,header:W.header,body:W.body,color:W.color}),Object(h.jsx)(o.j,{xs:"12",md:"8",children:Object(h.jsx)(j.a,{relative:!0,isLoading:I,children:Object(h.jsxs)(o.e,{children:[Object(h.jsx)(o.i,{className:"basvuruFormHeader",children:"Hesap bilgileriniz"}),Object(h.jsx)(o.f,{children:Object(h.jsxs)(o.u,{className:"form-horizontal",children:[Object(h.jsxs)(o.v,{row:!0,children:[Object(h.jsx)(o.j,{md:"3",children:Object(h.jsx)(o.H,{children:"\u0130sminiz"})}),Object(h.jsx)(o.j,{xs:"12",md:"9",children:Object(h.jsx)(o.B,{defaultValue:a.name,onChange:function(e){return w(e.target.value)}})})]}),Object(h.jsxs)(o.v,{row:!0,children:[Object(h.jsx)(o.j,{md:"3",children:Object(h.jsx)(o.H,{htmlFor:"disabled-input",children:"Mail hesab\u0131n\u0131z"})}),Object(h.jsx)(o.j,{xs:"12",md:"9",children:Object(h.jsx)(o.B,{value:a.email,readOnly:!0})})]}),Object(h.jsxs)(o.v,{row:!0,children:[Object(h.jsx)(o.j,{md:"3",children:Object(h.jsx)(o.H,{htmlFor:"disabled-input",children:"R\xf6l\xfcn\xfcz"})}),Object(h.jsx)(o.j,{xs:"12",md:"9",children:Object(h.jsx)(o.B,{value:Object(u.c)(a.role),readOnly:!0})})]}),Object(h.jsxs)(o.v,{row:!0,children:[Object(h.jsx)(o.j,{md:"3",children:Object(h.jsx)(o.H,{htmlFor:"disabled-input",children:"Kay\u0131t tarihi"})}),Object(h.jsx)(o.j,{xs:"12",md:"9",children:Object(h.jsx)(o.B,{value:x(a.register_date),readOnly:!0})})]}),Object(h.jsx)("h5",{style:{marginTop:"50px",marginBottom:"20px"},children:" \u015eifreinizi de\u011fi\u015ftirmek istiyorsan\u0131z alttaki alanlar\u0131 doldurunuz"}),Object(h.jsxs)(o.v,{row:!0,children:[Object(h.jsx)(o.j,{md:"3",children:Object(h.jsx)(o.H,{children:"Yeni \u015fifreniz"})}),Object(h.jsx)(o.j,{xs:"12",md:"9",children:Object(h.jsx)(o.B,{type:"password",placeholder:"Yeni \u015fifrenizi giriniz",onChange:function(e){return D(e.target.value)}})})]}),Object(h.jsxs)(o.v,{row:!0,children:[Object(h.jsx)(o.j,{md:"3",children:Object(h.jsx)(o.H,{children:"Yeni \u015fifreniz"})}),Object(h.jsx)(o.j,{xs:"12",md:"9",children:Object(h.jsx)(o.B,{type:"password",placeholder:"Yeni \u015fifrenizi bir kez daha giriniz ",onChange:function(e){return N(e.target.value)}})})]})]})}),Object(h.jsx)(o.g,{children:Object(h.jsxs)(o.d,{type:"submit",size:"sm",color:"primary",disabled:M,onClick:q,children:[Object(h.jsx)(l.a,{name:"cil-scrubber"})," Kaydet"]})})]})})})]})}}}]);
//# sourceMappingURL=19.7d8f9156.chunk.js.map