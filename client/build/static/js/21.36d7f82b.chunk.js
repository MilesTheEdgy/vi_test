(this.webpackJsonptest=this.webpackJsonptest||[]).push([[21],{637:function(e,t,n){"use strict";n.d(t,"a",(function(){return r}));var c=n(639);function r(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(e)){var n=[],c=!0,r=!1,o=void 0;try{for(var s,a=e[Symbol.iterator]();!(c=(s=a.next()).done)&&(n.push(s.value),!t||n.length!==t);c=!0);}catch(l){r=!0,o=l}finally{try{c||null==a.return||a.return()}finally{if(r)throw o}}return n}}(e,t)||Object(c.a)(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}},639:function(e,t,n){"use strict";n.d(t,"a",(function(){return r}));var c=n(640);function r(e,t){if(e){if("string"===typeof e)return Object(c.a)(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?Object(c.a)(e,t):void 0}}},640:function(e,t,n){"use strict";function c(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,c=new Array(t);n<t;n++)c[n]=e[n];return c}n.d(t,"a",(function(){return c}))},641:function(e,t,n){"use strict";n(1);var c=n(636),r=n(7);t.a=function(e){return e.dispatch?Object(r.jsxs)(c.J,{show:e.on,onClose:function(){return e.dispatch({type:"MODAL_DISPLAY",payload:{type:"CLOSE"}})},color:e.color,centered:!0,children:[Object(r.jsx)(c.M,{closeButton:!0,children:Object(r.jsxs)(c.N,{children:[" ",e.header," "]})}),Object(r.jsx)(c.K,{children:Object(r.jsx)("h5",{children:e.body})}),Object(r.jsx)(c.L,{children:Object(r.jsx)(c.d,{color:"secondary",onClick:function(){return e.dispatch({type:"MODAL_DISPLAY",payload:{type:"CLOSE"}})},children:"Kapat"})})]}):Object(r.jsxs)(c.J,{show:e.modalOn,onClose:function(){return e.setModal(!e.modalOn)},color:e.color,centered:!0,children:[Object(r.jsx)(c.M,{closeButton:!0,children:Object(r.jsxs)(c.N,{children:[" ",e.header," "]})}),Object(r.jsx)(c.K,{children:Object(r.jsx)("h5",{style:{textAlign:"center"},children:e.body})}),Object(r.jsx)(c.L,{children:Object(r.jsx)(c.d,{color:"secondary",onClick:function(){return e.setModal(!e.modalOn)},children:"Kapat"})})]})}},646:function(e,t,n){"use strict";var c=n(636),r=n(7);t.a=function(e){var t=e.color,n=e.body,o=e.show;return Object(r.jsx)(c.db,{position:"top-right",children:Object(r.jsx)(c.bb,{show:o,autohide:3e3,fade:!0,color:t,style:{textAlign:"center"},children:Object(r.jsx)(c.cb,{children:n})})})}},725:function(e,t,n){"use strict";n.r(t);var c=n(637),r=n(63),o=n.n(r),s=n(88),a=n(1),l=n(636),i=n(114),j=n(645),u=n(641),d=n(646),b=n(7);t.default=function(){var e=function(){var e=Object(s.a)(o.a.mark((function e(){var t,n,c;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return(t=new FormData).append("myFile",g),console.log("img",g),console.log("form data",t),e.prev=4,console.log("fetching"),e.next=8,fetch("/upload",{method:"POST",body:t});case 8:return n=e.sent,e.next=11,n.json();case 11:c=e.sent,console.log("data from fetch",c),e.next=18;break;case 15:e.prev=15,e.t0=e.catch(4),console.log(e.t0);case 18:case"end":return e.stop()}}),e,null,[[4,15]])})));return function(){return e.apply(this,arguments)}}(),t=Object(a.useState)(""),n=Object(c.a)(t,2),r=n[0],h=n[1],O=Object(a.useState)(""),f=Object(c.a)(O,2),x=f[0],p=f[1],m=Object(a.useState)(null),y=Object(c.a)(m,2),g=y[0],v=y[1],w=Object(a.useState)({header:"",body:"",color:""}),S=Object(c.a)(w,2),C=S[0],k=S[1],A=Object(a.useState)(!1),N=Object(c.a)(A,2),D=N[0],L=N[1],M=Object(a.useState)([]),K=Object(c.a)(M,2),E=K[0],I=K[1];return r&&console.log((function(){k({}),I()})),Object(b.jsx)("div",{className:"c-app c-default-layout flex-row align-items-center",children:Object(b.jsxs)(l.l,{children:[E.map((function(e,t){return Object(b.jsx)(d.a,{body:e.body,show:!0,color:"danger"},t)})),Object(b.jsx)(u.a,{header:C.header,body:C.body,color:C.color,modalOn:D,setModal:L}),Object(b.jsx)(l.Q,{className:"justify-content-center",children:Object(b.jsx)(l.j,{md:"9",lg:"7",xl:"6",children:Object(b.jsx)(l.e,{className:"mx-4",children:Object(b.jsx)(l.f,{className:"p-4",children:Object(b.jsxs)(l.u,{children:[Object(b.jsx)("div",{className:"container",children:Object(b.jsxs)("div",{className:"row",children:[Object(b.jsxs)("div",{className:"col",children:[Object(b.jsx)("h1",{children:"Kay\u0131t olun"}),Object(b.jsx)("p",{className:"text-muted",children:"Hesab\u0131n\u0131z\u0131 olu\u015fturun"})]}),Object(b.jsx)("div",{children:Object(b.jsx)(i.b,{to:"/login",children:Object(b.jsx)("p",{children:"Giri\u015f sayfas\u0131na git"})})})]})}),Object(b.jsxs)(l.D,{className:"mb-3",children:[Object(b.jsx)(l.E,{children:Object(b.jsx)(l.F,{children:Object(b.jsx)(j.a,{name:"cil-user"})})}),Object(b.jsx)(l.B,{type:"text",placeholder:"Kullan\u0131c\u0131 isminiz",autoComplete:"username",value:r,onChange:function(e){return h(e.target.value)}})]}),Object(b.jsxs)(l.D,{className:"mb-3",children:[Object(b.jsx)(l.E,{children:Object(b.jsx)(l.F,{children:Object(b.jsx)(j.a,{name:"cil-lock-locked"})})}),Object(b.jsx)(l.B,{type:"password",placeholder:"\u015eifreniz",autoComplete:"new-password",value:x,onChange:function(e){return p(e.target.value)}})]}),Object(b.jsx)(l.D,{children:Object(b.jsx)("input",{type:"file",onChange:function(e){return function(e){if(e.target.files&&e.target.files[0]){console.log("event.target.files",e.target.files);var t=e.target.files[0];console.log("img before using createobjecturl",t),v(t)}}(e)}})}),Object(b.jsx)(l.d,{color:"success",block:!0,onClick:function(){return console.log(g)},children:"test value"}),Object(b.jsx)(l.d,{color:"success",block:!0,onClick:function(){return e()},children:"Submit"})]})})})})})]})})}}}]);
//# sourceMappingURL=21.36d7f82b.chunk.js.map