(this.webpackJsonptest=this.webpackJsonptest||[]).push([[17],{639:function(e,t,c){"use strict";c(1);var n=c(635),r=c(6);t.a=function(e){return e.dispatch?Object(r.jsxs)(n.J,{show:e.on,onClose:function(){return e.dispatch({type:"MODAL_DISPLAY",payload:{type:"CLOSE"}})},color:e.color,centered:!0,children:[Object(r.jsx)(n.M,{closeButton:!0,children:Object(r.jsxs)(n.N,{children:[" ",e.header," "]})}),Object(r.jsx)(n.K,{children:Object(r.jsx)("h5",{children:e.body})}),Object(r.jsx)(n.L,{children:Object(r.jsx)(n.d,{color:"secondary",onClick:function(){return e.dispatch({type:"MODAL_DISPLAY",payload:{type:"CLOSE"}})},children:"Kapat"})})]}):Object(r.jsxs)(n.J,{show:e.modalOn,onClose:function(){return e.setModal(!e.modalOn)},color:e.color,centered:!0,children:[Object(r.jsx)(n.M,{closeButton:!0,children:Object(r.jsxs)(n.N,{children:[" ",e.header," "]})}),Object(r.jsx)(n.K,{children:Object(r.jsx)("h5",{style:{textAlign:"center"},children:e.body})}),Object(r.jsx)(n.L,{children:Object(r.jsx)(n.d,{color:"secondary",onClick:function(){return e.setModal(!e.modalOn)},children:"Kapat"})})]})}},640:function(e,t,c){"use strict";c.d(t,"a",(function(){return a}));var n=c(643);var r=c(642);function a(e){return function(e){if(Array.isArray(e))return Object(n.a)(e)}(e)||function(e){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||Object(r.a)(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}},641:function(e,t,c){"use strict";var n=c(635),r=c(6);t.a=function(e){var t=e.color,c=e.body,a=e.show;return Object(r.jsx)(n.cb,{position:"top-right",children:Object(r.jsx)(n.ab,{show:a,autohide:3e3,fade:!0,color:t,style:{textAlign:"center"},children:Object(r.jsx)(n.bb,{children:c})})})}},699:function(e,t,c){"use strict";c.r(t);var n=c(63),r=c.n(n),a=c(88),i=c(640),s=c(636),o=c(1),l=c(635),d=c(639),j=c(641),b=c(6);t.default=function(){var e={header:"HATA",body:"Bilgileriniz kaydedilmedi, l\xfctfen daha sonra tekrar deneyin",color:"danger"},t={header:"BA\u015eARILI",body:"Talebiniz ba\u015far\u0131yla i\u015flenmi\u015ftir! giri\u015f yapabilirsiniz.",color:"success"},c=Object(o.useState)(""),n=Object(s.a)(c,2),u=n[0],h=n[1],O=Object(o.useState)(""),x=Object(s.a)(O,2),f=x[0],p=x[1],y=Object(o.useState)({}),m=Object(s.a)(y,2),v=m[0],g=m[1],w=Object(o.useState)(!1),N=Object(s.a)(w,2),A=N[0],S=N[1],k=Object(o.useState)([]),C=Object(s.a)(k,2),z=C[0],L=C[1],M=function(){var c=Object(a.a)(r.a.mark((function c(){var n;return r.a.wrap((function(c){for(;;)switch(c.prev=c.next){case 0:if(u!==f&&(L([].concat(Object(i.a)(z),[{body:"\u015eifreniz uyu\u015fmuyor, l\xfctfen \u015fifrelerinizi kontrol edin"}])),1)){c.next=6;break}return c.next=3,fetch("/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:u})});case 3:n=c.sent,S(!0),200===n.status?g(t):S(e);case 6:case"end":return c.stop()}}),c)})));return function(){return c.apply(this,arguments)}}();return Object(b.jsx)("div",{className:"c-app c-default-layout flex-row align-items-center",children:Object(b.jsxs)(l.l,{children:[z.map((function(e,t){return Object(b.jsx)(j.a,{body:e.body,show:!0,color:"danger"},t)})),Object(b.jsx)(l.P,{className:"justify-content-center",children:Object(b.jsx)(l.j,{md:"9",lg:"7",xl:"6",children:Object(b.jsx)(l.e,{className:"mx-4",children:Object(b.jsx)(l.f,{className:"p-4",children:Object(b.jsxs)(l.u,{children:[Object(b.jsx)("div",{className:"container",children:Object(b.jsx)("div",{className:"row align-items-center justify-content-between",children:Object(b.jsxs)("div",{className:"col",children:[Object(b.jsx)("h1",{children:"Yeni \u015fifrenizi giriniz"}),Object(b.jsx)("p",{className:"text-muted",children:"A\u015fa\u011f\u0131daki alanlara \u015fifrenizi giriniz"})]})})}),Object(b.jsxs)(l.D,{className:"mb-3",children:[Object(b.jsx)(l.E,{children:Object(b.jsx)(l.F,{children:Object(b.jsx)("i",{className:"far fa-envelope"})})}),Object(b.jsx)(l.B,{type:"text",placeholder:"e-mail adresiniz",autoComplete:"email",value:u,onChange:function(e){return h(e.target.value)}})]}),Object(b.jsxs)(l.D,{className:"mb-3",children:[Object(b.jsx)(l.E,{children:Object(b.jsx)(l.F,{children:Object(b.jsx)("i",{className:"fas fa-lock"})})}),Object(b.jsx)(l.B,{type:"text",placeholder:"e-mail adresiniz",autoComplete:"email",value:f,onChange:function(e){return p(e.target.value)}})]}),Object(b.jsx)(l.d,{color:"success",block:!0,onClick:function(){return M()},children:"Resetle"})]})})})})}),Object(b.jsx)(d.a,{header:v.header,body:v.body,color:v.color,modalOn:A,setModal:S})]})})}}}]);
//# sourceMappingURL=17.9d541036.chunk.js.map