(this.webpackJsonptest=this.webpackJsonptest||[]).push([[10],{637:function(e,t,s){"use strict";s.d(t,"b",(function(){return a})),s.d(t,"a",(function(){return r}));var a=function(e){return e.map((function(e){var t=new Date(e.submit_time),s=new Date(e.status_change_date),a=new Date(e.last_change_date),r=0,n="";return"approved"===e.status?(r=3,n="Onayland\u0131"):"rejected"===e.status?(r=3,n="\u0130ptal"):"processing"===e.status?(r=2,n="\u0130\u015fleniyor"):"sent"===e.status&&(n="G\xf6nderildi",r=1),{ID:e.id,"\u0130sim":e.client_name,Tarih:t.toISOString().slice(0,10),Tip:e.selected_service,Kampanya:e.selected_offer,"A\xe7\u0131klama":e.description,"Stat\xfc":n,salesRepDetails:e.sales_rep_details?e.sales_rep_details:"",statusChangeDate:s?s.toISOString().slice(0,10):null,finalSalesRepDetails:e.final_sales_rep_details?e.final_sales_rep_details:"",lastChangeDate:a?a.toISOString().slice(0,10):null,submitProcessNum:r,imageURLS:e.image_urls?e.image_urls:null}}))},r=function(e){switch(e){case"Onayland\u0131":return"success";case"\u0130\u015fleniyor":return"warning";case"\u0130ptal":return"danger";case"G\xf6nderildi":return"secondary";default:return"primary"}}},658:function(e,t,s){},659:function(e,t,s){"use strict";var a=s(635),r=s(6),n=function(e,t){return 2===e.submitProcessNum?Object(r.jsxs)(a.v,{row:!0,children:[Object(r.jsxs)(a.j,{children:[Object(r.jsx)(a.H,{children:"Bayi A\xe7\u0131klamas\u0131"}),Object(r.jsx)(a.Z,{rows:"8",placeholder:e.A\u00e7\u0131klama,readOnly:!0})]}),"sales_assistant"===t?Object(r.jsxs)(a.j,{children:[Object(r.jsx)(a.H,{children:"\xd6nceki Notlar\u0131n\u0131z"}),Object(r.jsx)(a.Z,{rows:"8",placeholder:e.salesRepDetails,readOnly:!0})]}):Object(r.jsxs)(a.j,{children:[Object(r.jsx)(a.H,{children:"Sat\u0131\u015f Destek Notlar\u0131"}),Object(r.jsx)(a.Z,{rows:"8",placeholder:e.salesRepDetails,readOnly:!0})]})]}):(e.submitProcessNum,Object(r.jsxs)(a.v,{children:[Object(r.jsx)(a.H,{children:"Bayi A\xe7\u0131klamas\u0131"}),Object(r.jsx)(a.Z,{rows:"4",placeholder:e.A\u00e7\u0131klama,readOnly:!0})]}))},c=function(e,t,s,n){return 3===s.submitProcessNum?Object(r.jsxs)(a.v,{children:[Object(r.jsx)(a.H,{children:n.field3}),Object(r.jsx)(a.Z,{rows:"6",placeholder:s.finalSalesRepDetails,readOnly:!0})]}):"sales_assistant"===t?Object(r.jsxs)(a.v,{children:[Object(r.jsx)(a.H,{children:"Notlar\u0131n\u0131z"}),Object(r.jsx)(a.Z,{rows:"6",placeholder:"i\u015flemle alakal\u0131 notlar\u0131n\u0131z...",onChange:function(t){return e(t.target.value)}})]}):Object(r.jsxs)(a.v,{children:[Object(r.jsx)(a.H,{children:"Sat\u0131\u015f Destek Son Notlar\u0131"}),Object(r.jsx)(a.Z,{rows:"6",placeholder:s.finalSalesRepDetails,readOnly:!0})]})},l=function(e){switch(e.Stat\u00fc){case"\u0130\u015fleniyor":return"rgb(214, 160, 11)";case"\u0130ptal":return"rgb(212, 69, 13)";case"Onayland\u0131":return"rgb(55, 150, 55)";default:return"rgb(120, 138, 151)"}},i=s(53),j=(s(658),s(13));s(1),t.a=function(e){e.isEditable;var t=e.userDetails,s=e.setSdDetay,d=Object(i.d)((function(e){return e.reducer.loggedInUserInfo.loggedInRole})),o=function(e){switch(e){case"dealer":return{field3:"Sat\u0131\u015f Destek Son Notlar\u0131"};case"sales_assistant":return{field3:"Son notlar\u0131n\u0131z"};case"sales_assistant_chef":return{field3:"Sat\u0131\u015f Destek Son Notlar\u0131"}}}(d),u=Object(j.g)();return Object(r.jsx)(a.P,{className:"justify-content-center align-items-center",children:Object(r.jsx)(a.j,{xs:"12",sm:"8",children:Object(r.jsxs)(a.e,{children:[Object(r.jsxs)(a.i,{className:"basvuru-detay-header",style:{backgroundColor:l(t)},children:[Object(r.jsx)("h4",{children:"Ba\u015fvuru Detay"}),Object(r.jsx)(a.j,{sm:"2",className:"basvuru-detay-header-buttonCol",children:Object(r.jsx)(a.d,{active:!0,block:!0,color:"secondary","aria-pressed":"true",onClick:function(){return u.goBack()},children:"Geri"})})]}),Object(r.jsxs)(a.f,{className:"basvuru-detay",children:[Object(r.jsxs)(a.v,{row:!0,className:"my-0",children:[Object(r.jsx)(a.j,{xs:"2",children:Object(r.jsxs)(a.v,{children:[Object(r.jsx)(a.H,{children:"ID"}),Object(r.jsx)(a.B,{placeholder:t.ID,readOnly:!0})]})}),Object(r.jsx)(a.j,{xs:"10",children:Object(r.jsxs)(a.v,{children:[Object(r.jsx)(a.H,{children:"\u0130sim"}),Object(r.jsx)(a.B,{placeholder:t.\u0130sim,readOnly:!0})]})})]}),Object(r.jsxs)(a.v,{row:!0,className:"my-0",children:[Object(r.jsx)(a.j,{xs:"2",children:Object(r.jsxs)(a.v,{children:[Object(r.jsx)(a.H,{children:"Tarih"}),Object(r.jsx)(a.B,{placeholder:t.Tarih,readOnly:!0})]})}),Object(r.jsx)(a.j,{xs:"3",children:Object(r.jsxs)(a.v,{children:[Object(r.jsx)(a.H,{children:"Hizmet"}),Object(r.jsx)(a.B,{placeholder:t.Tip,readOnly:!0})]})}),Object(r.jsx)(a.j,{xs:"7",children:Object(r.jsxs)(a.v,{children:[Object(r.jsx)(a.H,{children:"Kampanya"}),Object(r.jsx)(a.B,{placeholder:t.Kampanya,readOnly:!0})]})})]}),n(t),c(s,d,t,o),Object(r.jsx)(a.v,{row:!0,children:t.imageURLS&&t.imageURLS.map((function(e,t){return Object(r.jsx)(a.j,{md:"4",children:Object(r.jsx)("a",{href:e,target:"_blank",rel:"noreferrer",children:Object(r.jsx)("img",{alt:"",style:{maxWidth:"200px",maxHeight:"200px",cursor:"pointer"},src:e})})},t)}))})]})]})})})}},709:function(e,t,s){"use strict";s.r(t);var a=s(63),r=s.n(a),n=s(88),c=s(636),l=s(1),i=s(659),j=s(637),d=s(6);t.default=function(e){var t=e.match.params.id,s=Object(l.useState)({}),a=Object(c.a)(s,2),o=a[0],u=a[1];return Object(l.useEffect)((function(){(function(){var e=Object(n.a)(r.a.mark((function e(){var s,a,n;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("/applications/".concat(t),{method:"GET",headers:{"content-type":"application/json",authorization:"Bearer ".concat(document.cookie.slice(8)," ")}});case 2:if(200!==(s=e.sent).status){e.next=9;break}return e.next=6,s.json();case 6:a=e.sent,n=Object(j.b)(a),u(n[0]);case 9:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}})()()}),[t]),Object(d.jsx)(i.a,{userDetails:o})}}}]);
//# sourceMappingURL=10.131af49a.chunk.js.map