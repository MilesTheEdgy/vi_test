(this.webpackJsonptest=this.webpackJsonptest||[]).push([[20],{643:function(e,t,a){"use strict";a.d(t,"b",(function(){return n})),a.d(t,"a",(function(){return s})),a.d(t,"c",(function(){return r}));var n=function(e){return e.map((function(e){var t=new Date(e.submit_time),a=new Date(e.status_change_date),n=new Date(e.last_change_date),s=0,r="";return"approved"===e.status?(s=3,r="Onayland\u0131"):"rejected"===e.status?(s=3,r="\u0130ptal"):"processing"===e.status?(s=2,r="\u0130\u015fleniyor"):"sent"===e.status&&(r="G\xf6nderildi",s=1),{ID:e.id,"\u0130sim":e.client_name,Tarih:t.toISOString().slice(0,10),Hizmet:e.service_name,Kampanya:e.offer_name,"A\xe7\u0131klama":e.description,"Stat\xfc":r,salesRepDetails:e.sales_rep_details?e.sales_rep_details:"",statusChangeDate:a?a.toISOString().slice(0,10):null,finalSalesRepDetails:e.final_sales_rep_details?e.final_sales_rep_details:"",lastChangeDate:n?n.toISOString().slice(0,10):null,submitProcessNum:s,imageURLS:e.image_urls?e.image_urls:null}}))},s=function(e){switch(e){case"Onayland\u0131":return"success";case"\u0130\u015fleniyor":return"warning";case"\u0130ptal":return"danger";case"G\xf6nderildi":return"secondary";default:return"primary"}},r=function(e){switch(e){case"dealer":return"Bayi";case"sales_assistant":return"Sat\u0131\u015f Destek";case"sales_assistant_chef":return"Sat\u0131\u015f Destek \u015eefi";case"admin":return"Admin";default:return""}}},654:function(e,t){},664:function(e,t){},665:function(e,t){},667:function(e,t){},742:function(e,t,a){"use strict";a.r(t);var n=a(50),s=a.n(n),r=a(69),c=a(637),i=a(1),l=a(13),u=a(666),o=a.n(u),d=a(636),f=a(662),h=a.n(f),m=a(643),p=function(e){switch(e){case"approved":return"onaylanan";case"rejected":return"iptal edilen";case"processing":return"beklemede olan"}},b=a(7);t.default=function(e){e.match;var t=e.location,a=Object(l.g)(),n=Object(l.h)().search.match(/sayfa=([0-9]+)/,""),u=Number(n&&n[1]?n[1]:1),f=Object(i.useState)(u),j=Object(c.a)(f,2),O=j[0],S=j[1],_=Object(i.useState)(!0),g=Object(c.a)(_,2),v=g[0],k=g[1],x=Object(i.useState)(void 0),y=Object(c.a)(x,2),w=y[0],D=y[1],A=o.a.parse(t.search),N=function(e){var t="";for(var a in e)"sayfa"!==a&&"?sayfa"!==a&&"q"!==a&&"?q"!==a&&(t=t+a+"="+e[a]+"&");var n=t.slice(0,-1);return"?"===n.charAt(0)?n.substr(1):n}(A);return Object(i.useEffect)((function(){u!==O&&S(u),function(){var e=Object(r.a)(s.a.mark((function e(){var t,a,n,r;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return k(!0),t="/applications/details/?".concat(N),e.next=4,fetch(t,{method:"GET",headers:{"content-type":"application/json",authorization:"Bearer ".concat(document.cookie.slice(8)," ")}});case 4:if(200!==(a=e.sent).status){e.next=11;break}return e.next=8,a.json();case 8:n=e.sent,r=Object(m.b)(n),D(r);case 11:k(!1);case 12:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()()}),[A["?status"],u]),Object(b.jsx)(d.Q,{className:"d-flex justify-content-center",children:Object(b.jsx)(d.j,{xl:10,children:Object(b.jsxs)(d.e,{children:[Object(b.jsxs)(d.i,{children:["Raporunuz",Object(b.jsxs)("small",{className:"text-muted",children:[" ",p(A["?status"])," i\u015flemler"]})]}),Object(b.jsxs)(d.f,{children:[Object(b.jsx)(d.n,{overTableSlot:Object(b.jsx)(d.d,{color:"primary",onClick:function(){return function(){var e=JSON.parse(JSON.stringify(w));e.forEach((function(e){return delete e.submitProcessNum}));for(var t=[],a=0;a<e.length;a++)t[a]=Object.values(e[a]);t.unshift(["ID","\u0130sim","Tarih","Hizmet","Kampanya","A\xe7\u0131klama","Stat\xfc","S-D A\xe7\u0131klamas\u0131","S-D A\xe7\u0131klama Tarihi","S-D Son A\xe7\u0131klamas\u0131","S-D Son A\xe7\u0131klama Tarihi"]);var n=h.a.utils.aoa_to_sheet(t),s=h.a.utils.book_new();h.a.utils.book_append_sheet(s,n,"Ba\u015fvurular"),h.a.writeFile(s,"ba\u015fvurular.xlsx")}()},children:"Excele aktar"}),loading:v,sorter:!0,items:w,fields:[{key:"\u0130sim",_classes:"font-weight-bold"},"Tarih","Hizmet","Stat\xfc"],tableFilter:!0,hover:!0,striped:!0,itemsPerPage:15,activePage:O,clickableRows:!0,onRowClick:function(e){return a.push("/islem/".concat(e.ID))},scopedSlots:{"Stat\xfc":function(e){return Object(b.jsx)("td",{children:Object(b.jsx)(d.a,{color:Object(m.a)(e.Stat\u00fc),children:e.Stat\u00fc})})}}}),Object(b.jsx)(d.O,{activePage:O,onActivePageChange:function(e){u!==e&&a.push("/bayi/islemler/rapor?sayfa=".concat(e,"&").concat(N))},pages:15,doubleArrows:!1,align:"center"})]})]})})})}}}]);
//# sourceMappingURL=20.27317e0c.chunk.js.map