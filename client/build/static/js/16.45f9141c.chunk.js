(this.webpackJsonptest=this.webpackJsonptest||[]).push([[16],{639:function(e,t,n){"use strict";n(1);var c=n(635),a=n(6);t.a=function(e){return e.dispatch?Object(a.jsxs)(c.J,{show:e.on,onClose:function(){return e.dispatch({type:"MODAL_DISPLAY",payload:{type:"CLOSE"}})},color:e.color,centered:!0,children:[Object(a.jsx)(c.M,{closeButton:!0,children:Object(a.jsxs)(c.N,{children:[" ",e.header," "]})}),Object(a.jsx)(c.K,{children:Object(a.jsx)("h5",{children:e.body})}),Object(a.jsx)(c.L,{children:Object(a.jsx)(c.d,{color:"secondary",onClick:function(){return e.dispatch({type:"MODAL_DISPLAY",payload:{type:"CLOSE"}})},children:"Kapat"})})]}):Object(a.jsxs)(c.J,{show:e.modalOn,onClose:function(){return e.setModal(!e.modalOn)},color:e.color,centered:!0,children:[Object(a.jsx)(c.M,{closeButton:!0,children:Object(a.jsxs)(c.N,{children:[" ",e.header," "]})}),Object(a.jsx)(c.K,{children:Object(a.jsx)("h5",{style:{textAlign:"center"},children:e.body})}),Object(a.jsx)(c.L,{children:Object(a.jsx)(c.d,{color:"secondary",onClick:function(){return e.setModal(!e.modalOn)},children:"Kapat"})})]})}},640:function(e,t,n){"use strict";n.d(t,"a",(function(){return r}));var c=n(643);var a=n(642);function r(e){return function(e){if(Array.isArray(e))return Object(c.a)(e)}(e)||function(e){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||Object(a.a)(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}},641:function(e,t,n){"use strict";var c=n(635),a=n(6);t.a=function(e){var t=e.color,n=e.body,r=e.show;return Object(a.jsx)(c.cb,{position:"top-right",children:Object(a.jsx)(c.ab,{show:r,autohide:3e3,fade:!0,color:t,style:{textAlign:"center"},children:Object(a.jsx)(c.bb,{children:n})})})}},696:function(e,t,n){"use strict";n.r(t);var c=n(63),a=n.n(c),r=n(88),s=n(640),o=n(636),l=n(1),i=n(635),j=n(639),d=n(641),b=n(6);t.default=function(){var e={header:"HATA",body:"Bilgileriniz kaydedilmedi, l\xfctfen daha sonra tekrar deneyin",color:"danger"},t={header:"HATA",body:"Bu kullan\u0131c\u0131 mevcuttur. L\xfctfen \u015fifrenizi yenileyin veya yeni hesap olu\u015fturun",color:"warning"},n={header:"BA\u015eARILI",body:"Talebiniz ba\u015far\u0131yla i\u015flenmi\u015ftir! L\xfctfen mail hesab\u0131n\u0131za gelen onaylama mesaj\u0131n\u0131 kontrol ediniz",color:"success"},c=Object(l.useState)(""),u=Object(o.a)(c,2),h=u[0],O=u[1],x=Object(l.useState)(""),m=Object(o.a)(x,2),f=m[0],p=m[1],y=Object(l.useState)(""),v=Object(o.a)(y,2),g=v[0],N=v[1],w=Object(l.useState)(""),C=Object(o.a)(w,2),k=C[0],z=C[1],A=Object(l.useState)(""),S=Object(o.a)(A,2),L=S[0],B=S[1],D=Object(l.useState)({header:"",body:"",color:""}),E=Object(o.a)(D,2),M=E[0],I=E[1],K=Object(l.useState)(!1),T=Object(o.a)(K,2),F=T[0],J=T[1],H=Object(l.useState)([]),P=Object(o.a)(H,2),R=P[0],Y=P[1],Z=function(){var c=Object(r.a)(a.a.mark((function c(){var r;return a.a.wrap((function(c){for(;;)switch(c.prev=c.next){case 0:if(!(""!==h&&""!==k&&""!==L&&""!==g&&""!==f||(Y([].concat(Object(s.a)(R),[{body:"L\xfctfen t\xfcm alanlar\u0131 doldurunuz"}])),0))||!1===/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(f)&&(Y([].concat(Object(s.a)(R),[{body:"L\xfctfen girilen E-Mail adresini kontrol edin"}])),1)||k!==L&&(Y([].concat(Object(s.a)(R),[{body:"\u015eifreniz uyu\u015fmuyor, l\xfctfen \u015fifrelerinizi kontrol edin"}])),1)){c.next=6;break}return c.next=3,fetch("/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:h,password:k,email:f,dealerName:g})});case 3:r=c.sent,J(!0),200===r.status?(J(!0),I(n)):406===r.status?(J(!0),I(t)):(J(!0),I(e));case 6:case"end":return c.stop()}}),c)})));return function(){return c.apply(this,arguments)}}();return Object(b.jsx)("div",{className:"c-app c-default-layout flex-row align-items-center",children:Object(b.jsxs)(i.l,{children:[R.map((function(e,t){return Object(b.jsx)(d.a,{body:e.body,show:!0,color:"danger"},t)})),Object(b.jsx)(j.a,{header:M.header,body:M.body,color:M.color,modalOn:F,setModal:J}),Object(b.jsx)(i.P,{className:"justify-content-center",children:Object(b.jsx)(i.j,{md:"9",lg:"7",xl:"6",children:Object(b.jsx)(i.e,{className:"mx-4",children:Object(b.jsx)(i.f,{className:"p-4",children:Object(b.jsxs)(i.u,{children:[Object(b.jsx)("div",{className:"container",children:Object(b.jsx)("div",{className:"row align-items-center justify-content-between",children:Object(b.jsxs)("div",{className:"col",children:[Object(b.jsx)("h1",{children:"Kay\u0131t olun"}),Object(b.jsx)("p",{className:"text-muted",children:"Hesab\u0131n\u0131z\u0131 olu\u015fturun"})]})})}),Object(b.jsxs)(i.D,{className:"mb-3",children:[Object(b.jsx)(i.E,{children:Object(b.jsx)(i.F,{children:Object(b.jsx)("i",{className:"far fa-user"})})}),Object(b.jsx)(i.B,{type:"text",placeholder:"Kullan\u0131c\u0131 isminiz",autoComplete:"username",value:h,onChange:function(e){return O(e.target.value)}})]}),Object(b.jsxs)(i.D,{className:"mb-3",children:[Object(b.jsx)(i.E,{children:Object(b.jsx)(i.F,{children:Object(b.jsx)("i",{className:"far fa-envelope"})})}),Object(b.jsx)(i.B,{type:"text",placeholder:"e-mail adresiniz",autoComplete:"email",value:f,onChange:function(e){return p(e.target.value)}})]}),Object(b.jsxs)(i.D,{className:"mb-3",children:[Object(b.jsx)(i.E,{children:Object(b.jsx)(i.F,{children:Object(b.jsx)("i",{className:"fas fa-store-alt"})})}),Object(b.jsx)(i.B,{type:"text",placeholder:"Bayi ismi \xd6RN: \u0130stanbul \u0130leti\u015fim",autoComplete:"dealer-name",value:g,onChange:function(e){N(e.target.value)}})]}),Object(b.jsxs)(i.D,{className:"mb-3",children:[Object(b.jsx)(i.E,{children:Object(b.jsx)(i.F,{children:Object(b.jsx)("i",{className:"fas fa-lock"})})}),Object(b.jsx)(i.B,{type:"password",placeholder:"\u015eifreniz",autoComplete:"new-password",value:k,onChange:function(e){return z(e.target.value)}})]}),Object(b.jsxs)(i.D,{className:"mb-4",children:[Object(b.jsx)(i.E,{children:Object(b.jsx)(i.F,{children:Object(b.jsx)("i",{className:"fas fa-lock"})})}),Object(b.jsx)(i.B,{type:"password",placeholder:"\u015eifrenizi tekrar giriniz",autoComplete:"new-password",value:L,onChange:function(e){return B(e.target.value)}})]}),Object(b.jsx)(i.d,{color:"success",block:!0,onClick:function(){return Z()},children:"Hesab\u0131n\u0131z\u0131 olu\u015fturun"})]})})})})})]})})}}}]);
//# sourceMappingURL=16.45f9141c.chunk.js.map