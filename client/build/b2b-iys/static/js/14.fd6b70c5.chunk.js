(this.webpackJsonptest=this.webpackJsonptest||[]).push([[14],{637:function(e,t,n){"use strict";n.d(t,"a",(function(){return c}));var r=n(639);function c(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(e)){var n=[],r=!0,c=!1,a=void 0;try{for(var i,o=e[Symbol.iterator]();!(r=(i=o.next()).done)&&(n.push(i.value),!t||n.length!==t);r=!0);}catch(s){c=!0,a=s}finally{try{r||null==o.return||o.return()}finally{if(c)throw a}}return n}}(e,t)||Object(r.a)(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}},639:function(e,t,n){"use strict";n.d(t,"a",(function(){return c}));var r=n(640);function c(e,t){if(e){if("string"===typeof e)return Object(r.a)(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?Object(r.a)(e,t):void 0}}},640:function(e,t,n){"use strict";function r(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}n.d(t,"a",(function(){return r}))},641:function(e,t,n){"use strict";n(1);var r=n(636),c=n(7);t.a=function(e){return e.dispatch?Object(c.jsxs)(r.J,{show:e.on,onClose:function(){return e.dispatch({type:"MODAL_DISPLAY",payload:{type:"CLOSE"}})},color:e.color,centered:!0,children:[Object(c.jsx)(r.M,{closeButton:!0,children:Object(c.jsxs)(r.N,{children:[" ",e.header," "]})}),Object(c.jsx)(r.K,{children:Object(c.jsx)("h5",{children:e.body})}),Object(c.jsx)(r.L,{children:Object(c.jsx)(r.d,{color:"secondary",onClick:function(){return e.dispatch({type:"MODAL_DISPLAY",payload:{type:"CLOSE"}})},children:"Kapat"})})]}):Object(c.jsxs)(r.J,{show:e.modalOn,onClose:function(){return e.setModal(!e.modalOn)},color:e.color,centered:!0,children:[Object(c.jsx)(r.M,{closeButton:!0,children:Object(c.jsxs)(r.N,{children:[" ",e.header," "]})}),Object(c.jsx)(r.K,{children:Object(c.jsx)("h5",{style:{textAlign:"center"},children:e.body})}),Object(c.jsx)(r.L,{children:Object(c.jsx)(r.d,{color:"secondary",onClick:function(){return e.setModal(!e.modalOn)},children:"Kapat"})})]})}},644:function(e,t,n){"use strict";n.d(t,"a",(function(){return a}));var r=n(640);var c=n(639);function a(e){return function(e){if(Array.isArray(e))return Object(r.a)(e)}(e)||function(e){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||Object(c.a)(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}},646:function(e,t,n){"use strict";var r=n(636),c=n(7);t.a=function(e){var t=e.color,n=e.body,a=e.show;return Object(c.jsx)(r.db,{position:"top-right",children:Object(c.jsx)(r.bb,{show:a,autohide:3e3,fade:!0,color:t,style:{textAlign:"center"},children:Object(c.jsx)(r.cb,{children:n})})})}},727:function(e,t,n){"use strict";n.r(t);var r=n(50),c=n.n(r),a=n(69),i=n(644),o=n(637),s=n(1),l=n(636),d=n(641),u=n(646),j=n(7);t.default=function(){var e={header:"HATA",body:"Bilgileriniz kaydedilmedi, l\xfctfen daha sonra tekrar deneyin",color:"danger"},t={header:"BA\u015eARILI",body:"Talebiniz ba\u015far\u0131yla i\u015flenmi\u015ftir! giri\u015f yapabilirsiniz.",color:"success"},n=Object(s.useState)(""),r=Object(o.a)(n,2),b=r[0],h=r[1],f=Object(s.useState)(""),O=Object(o.a)(f,2),y=O[0],x=O[1],m=Object(s.useState)({}),p=Object(o.a)(m,2),v=p[0],g=p[1],A=Object(s.useState)(!1),S=Object(o.a)(A,2),w=S[0],N=S[1],k=Object(s.useState)([]),C=Object(o.a)(k,2),z=C[0],I=C[1],L=function(){var n=Object(a.a)(c.a.mark((function n(){var r;return c.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(b!==y&&(I([].concat(Object(i.a)(z),[{body:"\u015eifreniz uyu\u015fmuyor, l\xfctfen \u015fifrelerinizi kontrol edin"}])),1)){n.next=6;break}return n.next=3,fetch("/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:b})});case 3:r=n.sent,N(!0),200===r.status?g(t):N(e);case 6:case"end":return n.stop()}}),n)})));return function(){return n.apply(this,arguments)}}();return Object(j.jsx)("div",{className:"c-app c-default-layout flex-row align-items-center",children:Object(j.jsxs)(l.l,{children:[z.map((function(e,t){return Object(j.jsx)(u.a,{body:e.body,show:!0,color:"danger"},t)})),Object(j.jsx)(l.Q,{className:"justify-content-center",children:Object(j.jsx)(l.j,{md:"9",lg:"7",xl:"6",children:Object(j.jsx)(l.e,{className:"mx-4",children:Object(j.jsx)(l.f,{className:"p-4",children:Object(j.jsxs)(l.u,{children:[Object(j.jsx)("div",{className:"container",children:Object(j.jsx)("div",{className:"row align-items-center justify-content-between",children:Object(j.jsxs)("div",{className:"col",children:[Object(j.jsx)("h1",{children:"Yeni \u015fifrenizi giriniz"}),Object(j.jsx)("p",{className:"text-muted",children:"A\u015fa\u011f\u0131daki alanlara \u015fifrenizi giriniz"})]})})}),Object(j.jsxs)(l.D,{className:"mb-3",children:[Object(j.jsx)(l.E,{children:Object(j.jsx)(l.F,{children:Object(j.jsx)("i",{className:"far fa-envelope"})})}),Object(j.jsx)(l.B,{type:"text",placeholder:"e-mail adresiniz",autoComplete:"email",value:b,onChange:function(e){return h(e.target.value)}})]}),Object(j.jsxs)(l.D,{className:"mb-3",children:[Object(j.jsx)(l.E,{children:Object(j.jsx)(l.F,{children:Object(j.jsx)("i",{className:"fas fa-lock"})})}),Object(j.jsx)(l.B,{type:"text",placeholder:"e-mail adresiniz",autoComplete:"email",value:y,onChange:function(e){return x(e.target.value)}})]}),Object(j.jsx)(l.d,{color:"success",block:!0,onClick:function(){return L()},children:"Resetle"})]})})})})}),Object(j.jsx)(d.a,{header:v.header,body:v.body,color:v.color,modalOn:w,setModal:N})]})})}}}]);
//# sourceMappingURL=14.fd6b70c5.chunk.js.map