(this.webpackJsonptest=this.webpackJsonptest||[]).push([[16],{638:function(e,t,a){"use strict";a(642);var c=a(7);t.a=function(e){return e.absolute?Object(c.jsxs)("div",{children:[Object(c.jsx)("div",{className:e.isLoading?"loader loader-absolute":"",children:Object(c.jsx)("div",{className:e.isLoading?"spinner-border":"",role:"status"})}),e.children]}):e.relative?Object(c.jsxs)("div",{className:"relativePosition",children:[Object(c.jsx)("div",{className:e.isLoading?"loader loader-relative":"",children:Object(c.jsx)("div",{className:e.isLoading?"spinner-border":"",role:"status"})}),e.children]}):void 0}},641:function(e,t,a){"use strict";a(1);var c=a(636),n=a(7);t.a=function(e){return e.dispatch?Object(n.jsxs)(c.J,{show:e.on,onClose:function(){return e.dispatch({type:"MODAL_DISPLAY",payload:{type:"CLOSE"}})},color:e.color,centered:!0,children:[Object(n.jsx)(c.M,{closeButton:!0,children:Object(n.jsxs)(c.N,{children:[" ",e.header," "]})}),Object(n.jsx)(c.K,{children:Object(n.jsx)("h5",{children:e.body})}),Object(n.jsx)(c.L,{children:Object(n.jsx)(c.d,{color:"secondary",onClick:function(){return e.dispatch({type:"MODAL_DISPLAY",payload:{type:"CLOSE"}})},children:"Kapat"})})]}):Object(n.jsxs)(c.J,{show:e.modalOn,onClose:function(){return e.setModal(!e.modalOn)},color:e.color,centered:!0,children:[Object(n.jsx)(c.M,{closeButton:!0,children:Object(n.jsxs)(c.N,{children:[" ",e.header," "]})}),Object(n.jsx)(c.K,{children:Object(n.jsx)("h5",{style:{textAlign:"center"},children:e.body})}),Object(n.jsx)(c.L,{children:Object(n.jsx)(c.d,{color:"secondary",onClick:function(){return e.setModal(!e.modalOn)},children:"Kapat"})})]})}},642:function(e,t,a){},644:function(e,t,a){"use strict";a.d(t,"a",(function(){return r}));var c=a(640);var n=a(639);function r(e){return function(e){if(Array.isArray(e))return Object(c.a)(e)}(e)||function(e){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||Object(n.a)(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}},647:function(e,t,a){"use strict";var c=a(636),n=a(7);t.a=function(e,t){var a=e.color,r=e.body;return Object(n.jsx)(c.db,{position:"top-right",children:Object(n.jsx)(c.bb,{show:!0,autohide:3e3,fade:!0,color:a,className:"applicationToaster",children:Object(n.jsx)(c.cb,{children:r})})},t)}},741:function(e,t,a){"use strict";a.r(t);var c=a(50),n=a.n(c),r=a(69),i=a(637),s=a(1),o=a.n(s),l=a(636),d=a(645),j=a(641),u=a(638),b=a(644),p=a(6),O=a(647),m={color:"success",header:"Ba\u015far\u0131l\u0131",body:"Ba\u015fvurunuz g\xf6nderilmi\u015ftir"},h={color:"danger",header:"HATA",body:"Bir hata olmu\u015ftur, l\xfctfen daha sonra tekrar deneyin"},x={selectedService:0,selectedOffer:0,clientDescription:"",clientName:"",applicationImages:[],applicationImagesObjUrls:[],isServiceSelected:!1,isOfferSelected:!1,isDescriptionInputted:!1,isClientNameInputted:!1,areImagesInputted:!1,areImagesNot3:!1,areImagesDifferentFormat:!1,modalTextObj:{color:"",header:"",body:""},toasters:[]},f=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:x,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"SET_SERVICE":var a=Number(t.payload),c=!1;return c=0!==a,Object(p.a)(Object(p.a)({},e),{},{selectedService:a,isServiceSelected:c});case"SET_OFFER":var n=Number(t.payload),r=!1;return r=!!n,Object(p.a)(Object(p.a)({},e),{},{selectedOffer:n,isOfferSelected:r});case"SET_CLIENT_NAME":var i=t.payload,s=!1;return s=""!==i.trim(),Object(p.a)(Object(p.a)({},e),{},{clientName:i,isClientNameInputted:s});case"SET_CLIENT_DESCRIPTION":var o=t.payload,l=!1;return l=""!==o.trim(),Object(p.a)(Object(p.a)({},e),{},{clientDescription:o,isDescriptionInputted:l});case"LOAD_IMAGES":var d=t.payload;if(d){if(3!==d.length){console.log("images are not 3");var j={color:"warning",body:"L\xfctfen 3 adet resim se\xe7iniz"};return Object(p.a)(Object(p.a)({},e),{},{areImagesNot3:!0,applicationImages:[],applicationImagesObjUrls:[],areImagesInputted:!1,toasters:[].concat(Object(b.a)(e.toasters),[{element:O.a,textObj:j}])})}for(var u=[],f=0;f<d.length;f++){if(0!==d[f].type.indexOf("image")){console.log("images are a different format");var v={color:"warning",body:"L\xfctfen se\xe7ece\u011finiz dosyalar\u0131 resim oldu\u011fundan emin olun"};return Object(p.a)(Object(p.a)({},e),{},{areImagesDifferentFormat:!0,applicationImages:[],applicationImagesObjUrls:[],areImagesInputted:!1,toasters:[].concat(Object(b.a)(e.toasters),[{element:O.a,textObj:v}])})}var y=URL.createObjectURL(d[f]);u.push(y)}return Object(p.a)(Object(p.a)({},e),{},{applicationImages:d,applicationImagesObjUrls:u,areImagesNot3:!1,areImagesDifferentFormat:!1,areImagesInputted:!0})}break;case"SET_MODAL_TEXT_SUCCESS":return Object(p.a)(Object(p.a)({},e),{},{modalTextObj:m});case"SET_MODAL_TEXT_FAILURE":return Object(p.a)(Object(p.a)({},e),{},{modalTextObj:h});case"RESET_INPUT":return x;default:return e}},v=a(7),y=function(e){var t=e.dispatch,a=e.applicationImages;return Object(v.jsxs)(v.Fragment,{children:[Object(v.jsxs)(l.v,{row:!0,children:[Object(v.jsx)(l.j,{md:"3",children:Object(v.jsx)(l.H,{children:"Ba\u015fvuru dosyalar\u0131"})}),Object(v.jsxs)(l.j,{xs:"12",md:"9",children:[Object(v.jsx)(l.C,{id:"file-multiple-input",name:"file-multiple-input",multiple:!0,custom:!0,onChange:function(e){return t({type:"LOAD_IMAGES",payload:e.target.files})}}),Object(v.jsx)(l.H,{htmlFor:"file-multiple-input",variant:"custom-file",children:"Dosyalar\u0131n\u0131 se\xe7"})]})]}),0!==a.length?Object(v.jsxs)(l.v,{row:!0,children:[Object(v.jsx)(l.j,{md:"4",children:Object(v.jsx)("img",{alt:"",style:{maxWidth:"200px",maxHeight:"200px"},src:a[0]})}),Object(v.jsx)(l.j,{md:"4",children:Object(v.jsx)("img",{alt:"",style:{maxWidth:"200px",maxHeight:"200px"},src:a[1]})}),Object(v.jsx)(l.j,{md:"4",children:Object(v.jsx)("img",{alt:"",style:{maxWidth:"200px",maxHeight:"200px"},src:a[2]})})]}):Object(v.jsxs)(l.v,{row:!0,children:[Object(v.jsx)(l.j,{md:"4",children:Object(v.jsx)("img",{alt:"",style:{maxWidth:"200px",maxHeight:"200px"},src:"https://res.cloudinary.com/papyum/image/upload/v1629721581/iys/placeholder_fb7gch.png"})}),Object(v.jsx)(l.j,{md:"4",children:Object(v.jsx)("img",{alt:"",style:{maxWidth:"200px",maxHeight:"200px"},src:"https://res.cloudinary.com/papyum/image/upload/v1629721581/iys/placeholder_fb7gch.png"})}),Object(v.jsx)(l.j,{md:"4",children:Object(v.jsx)("img",{alt:"",style:{maxWidth:"200px",maxHeight:"200px"},src:"https://res.cloudinary.com/papyum/image/upload/v1629721581/iys/placeholder_fb7gch.png"})})]})]})},g=function(e){var t=e.selectedService,a=e.dispatch,c=Object(s.useState)([]),o=Object(i.a)(c,2),d=o[0],j=o[1],u=function(){var e=Object(r.a)(n.a.mark((function e(){var t,a;return n.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("/services",{headers:{"Content-Type":"application/json",authorization:"Bearer ".concat(document.cookie.slice(8)," ")}});case 2:if(200!==(t=e.sent).status){e.next=8;break}return e.next=6,t.json();case 6:a=e.sent,j(a);case 8:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(s.useEffect)((function(){u()}),[]),Object(v.jsxs)(l.v,{row:!0,children:[Object(v.jsx)(l.j,{md:"3",children:Object(v.jsx)(l.H,{htmlFor:"select",children:"Verilen Hizmet"})}),Object(v.jsxs)(l.j,{xs:"12",md:"9",children:[Object(v.jsxs)(l.R,{value:t,custom:!0,name:"select",id:"select",onChange:function(e){return a({type:"SET_SERVICE",payload:e.target.value})},children:[Object(v.jsx)("option",{value:0}),d&&d.map((function(e){return Object(v.jsx)("option",{value:e.service_id,children:e.name},e.service_id)}))]}),Object(v.jsx)(l.w,{children:"Sa\u011flamak istedi\u011finiz hizmet"})]})]})},S=function(e){var t=e.dispatch,a=e.isServiceSelected,c=e.selectedServiceID,o=e.selectedOffer,d=Object(s.useState)([]),j=Object(i.a)(d,2),u=j[0],b=j[1],p=Object(s.useState)(!0),O=Object(i.a)(p,2),m=O[0],h=O[1],x=function(){var e=Object(r.a)(n.a.mark((function e(){var t,a;return n.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return h(!0),e.next=3,fetch("/service/".concat(c),{headers:{"Content-Type":"application/json",authorization:"Bearer ".concat(document.cookie.slice(8)," ")}});case 3:if(200!==(t=e.sent).status){e.next=11;break}return e.next=7,t.json();case 7:a=e.sent,b(a),e.next=12;break;case 11:406===t.status&&b([]);case 12:h(!1);case 13:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(s.useEffect)((function(){a?x():b([])}),[a,c]),Object(v.jsxs)(l.v,{row:!0,children:[Object(v.jsx)(l.j,{md:"3",children:Object(v.jsx)(l.H,{htmlFor:"select",children:"Kampanya Se\xe7imi"})}),Object(v.jsxs)(l.j,{xs:"12",md:"9",children:[Object(v.jsxs)(l.R,{disabled:!1===a&&!1===m||!0===m,value:o,onChange:function(e){return t({type:"SET_OFFER",payload:e.target.value})},children:[!0===a&&0===u.length?Object(v.jsx)("option",{value:0,children:"Bu hizmete kampanya bulunmuyor"}):Object(v.jsx)("option",{children:" "}),u&&u.map((function(e){return Object(v.jsx)("option",{value:e.offer_id,children:e.name},e.offer_id)}))]}),Object(v.jsx)(l.w,{children:"Se\xe7mek istedi\u011finiz kampanya"})]})]})},I=function(){var e=Object(s.useState)(""),t=Object(i.a)(e,2),a=t[0],c=t[1],o=function(){var e=Object(r.a)(n.a.mark((function e(){var t,a;return n.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("/activator",{headers:{"Content-Type":"application/json",authorization:"Bearer ".concat(document.cookie.slice(8)," ")}});case 2:if(200!==(t=e.sent).status){e.next=8;break}return e.next=6,t.json();case 6:a=e.sent,c(a.name);case 8:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(s.useEffect)((function(){o()}),[]),Object(v.jsxs)(l.v,{row:!0,children:[Object(v.jsx)(l.j,{md:"3",children:Object(v.jsx)(l.H,{htmlFor:"disabled-input",children:"Aktivasyon"})}),Object(v.jsxs)(l.j,{xs:"12",md:"9",children:[Object(v.jsx)(l.B,{id:"disabled-input",name:"disabled-input",placeholder:a,disabled:!0}),Object(v.jsx)(l.w,{children:"Sorumlu aktivasyon ki\u015fi"})]})]})},E=function(){var e=Object(s.useReducer)(f,x),t=Object(i.a)(e,2),a=t[0],c=t[1],o=a.selectedService,b=a.selectedOffer,p=a.clientDescription,O=a.clientName,m=a.applicationImages,h=a.isServiceSelected,E=a.isOfferSelected,T=a.isDescriptionInputted,_=a.isClientNameInputted,w=a.applicationImagesObjUrls,k=a.areImagesInputted,C=a.toasters,N=a.modalTextObj,L=Object(s.useState)(!0),D=Object(i.a)(L,2),A=D[0],F=D[1],z=Object(s.useState)(!1),H=Object(i.a)(z,2),M=H[0],R=H[1],B=Object(s.useState)(!1),U=Object(i.a)(B,2),P=U[0],W=U[1],K=function(){c({type:"RESET_INPUT"})},J=function(){var e=Object(r.a)(n.a.mark((function e(){var t,a;return n.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:for(W(!0),(t=new FormData).append("selectedService",o),t.append("selectedOffer",b),t.append("clientDescription",p),t.append("clientName",O),a=0;a<m.length;a++)t.append("image",m[a]);return e.next=9,fetch("/applications",{method:"POST",headers:{authorization:"Bearer ".concat(document.cookie.slice(8)," ")},body:t});case 9:200===e.sent.status?(R(!0),K(),c({type:"SET_MODAL_TEXT_SUCCESS"})):(c({type:"SET_MODAL_TEXT_FAILURE"}),R(!0)),W(!1);case 12:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(s.useEffect)((function(){F(function(){for(var e=[h,E,T,_,k],t=0;t<e.length;t++)if(!1===e[t])return!0;return!1}())}),[h,E,T,_,k]),Object(v.jsxs)(l.Q,{className:"d-flex justify-content-center",children:[C&&C.map((function(e,t){return e.element(e.textObj,t)})),Object(v.jsx)(j.a,{modalOn:M,setModal:R,color:N.color,header:N.header,body:N.body}),Object(v.jsx)(l.j,{xs:"12",md:"8",children:Object(v.jsx)(u.a,{relative:!0,isLoading:P,children:Object(v.jsxs)(l.e,{children:[Object(v.jsx)(l.i,{className:"basvuruFormHeader",children:"Yeni Ba\u015fvuru Sayfas\u0131"}),Object(v.jsxs)(l.f,{children:[Object(v.jsx)(I,{}),Object(v.jsx)(g,{dispatch:c,selectedService:o}),Object(v.jsx)(S,{dispatch:c,isServiceSelected:h,selectedServiceID:o}),Object(v.jsxs)(l.v,{row:!0,children:[Object(v.jsx)(l.j,{md:"3",children:Object(v.jsx)(l.H,{htmlFor:"textarea-input",children:"A\xe7\u0131klama"})}),Object(v.jsxs)(l.j,{xs:"12",md:"9",children:[Object(v.jsx)(l.ab,{name:"textarea-input",id:"textarea-input",rows:"9",placeholder:"\u0130\u015flemle alakal\u0131 ekstra detaylar\u0131n\u0131z\u0131 buraya yaz\u0131n",value:p,onChange:function(e){return c({type:"SET_CLIENT_DESCRIPTION",payload:e.target.value})}}),Object(v.jsx)(l.w,{children:"\u0130\u015flemle alakal\u0131 a\xe7\u0131klaman\u0131z"})]})]}),Object(v.jsxs)(l.v,{row:!0,children:[Object(v.jsx)(l.j,{md:"3",children:Object(v.jsx)(l.H,{htmlFor:"text-input",children:"M\xfc\u015fteri"})}),Object(v.jsxs)(l.j,{xs:"12",md:"9",children:[Object(v.jsx)(l.B,{value:O,id:"text-input",name:"text-input",placeholder:"",onChange:function(e){return c({type:"SET_CLIENT_NAME",payload:e.target.value})}}),Object(v.jsx)(l.w,{children:"m\xfc\u015fterinin isim soyisimi"})]})]}),Object(v.jsx)(y,{dispatch:c,applicationImages:w})]}),Object(v.jsxs)(l.g,{children:[Object(v.jsxs)(l.d,{type:"submit",size:"sm",color:"primary",onClick:J,disabled:A,children:[Object(v.jsx)(d.a,{name:"cil-scrubber"})," G\xf6nder"]}),Object(v.jsxs)(l.d,{type:"reset",size:"sm",color:"danger",onClick:K,children:[Object(v.jsx)(d.a,{name:"cil-ban"})," Resetle"]})]})]})})})]})};t.default=o.a.memo(E)}}]);
//# sourceMappingURL=16.72ce20fe.chunk.js.map