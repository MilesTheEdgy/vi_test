(this.webpackJsonptest=this.webpackJsonptest||[]).push([[6],{707:function(t,e,n){"use strict";n.d(e,"a",(function(){return o})),n.d(e,"b",(function(){return a})),n.d(e,"c",(function(){return c}));var o,r=n(7);!function(t){t[t.Query=0]="Query",t[t.Mutation=1]="Mutation",t[t.Subscription=2]="Subscription"}(o||(o={}));var i=new Map;function a(t){var e;switch(t){case o.Query:e="Query";break;case o.Mutation:e="Mutation";break;case o.Subscription:e="Subscription"}return e}function c(t){var e,n,a=i.get(t);if(a)return a;__DEV__?Object(r.b)(!!t&&!!t.kind,"Argument of "+t+" passed to parser was not a valid GraphQL DocumentNode. You may need to use 'graphql-tag' or another method to convert your operation into a document"):Object(r.b)(!!t&&!!t.kind,38);var c=t.definitions.filter((function(t){return"FragmentDefinition"===t.kind})),s=t.definitions.filter((function(t){return"OperationDefinition"===t.kind&&"query"===t.operation})),u=t.definitions.filter((function(t){return"OperationDefinition"===t.kind&&"mutation"===t.operation})),l=t.definitions.filter((function(t){return"OperationDefinition"===t.kind&&"subscription"===t.operation}));__DEV__?Object(r.b)(!c.length||s.length||u.length||l.length,"Passing only a fragment to 'graphql' is not yet supported. You must include a query, subscription or mutation as well"):Object(r.b)(!c.length||s.length||u.length||l.length,39),__DEV__?Object(r.b)(s.length+u.length+l.length<=1,"react-apollo only supports a query, subscription, or a mutation per HOC. "+t+" had "+s.length+" queries, "+l.length+" subscriptions and "+u.length+" mutations. You can use 'compose' to join multiple operation types to a component"):Object(r.b)(s.length+u.length+l.length<=1,40),n=s.length?o.Query:o.Mutation,s.length||u.length||(n=o.Subscription);var d=s.length?s:u.length?u:l;__DEV__?Object(r.b)(1===d.length,"react-apollo only supports one definition per HOC. "+t+" had "+d.length+" definitions. You can use 'compose' to join multiple operation types to a component"):Object(r.b)(1===d.length,41);var h=d[0];e=h.variableDefinitions||[];var p={name:h.name&&"Name"===h.name.kind?h.name.value:"data",type:n,variables:e};return i.set(t,p),p}},708:function(t,e,n){"use strict";function o(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,o=new Array(e);n<e;n++)o[n]=t[n];return o}n.d(e,"a",(function(){return o}))},709:function(t,e,n){"use strict";n.d(e,"a",(function(){return r}));var o=n(708);function r(t,e){if(t){if("string"===typeof t)return Object(o.a)(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?Object(o.a)(t,e):void 0}}},710:function(t,e,n){"use strict";n.d(e,"a",(function(){return r}));var o=n(709);function r(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(t)){var n=[],o=!0,r=!1,i=void 0;try{for(var a,c=t[Symbol.iterator]();!(o=(a=c.next()).done)&&(n.push(a.value),!e||n.length!==e);o=!0);}catch(s){r=!0,i=s}finally{try{o||null==c.return||c.return()}finally{if(r)throw i}}return n}}(t,e)||Object(o.a)(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}},711:function(t,e,n){"use strict";n.d(e,"a",(function(){return a}));var o=n(33),r=n(7),i=n(707),a=function(){function t(t,e){this.isMounted=!1,this.previousOptions={},this.context={},this.options={},this.options=t||{},this.context=e||{}}return t.prototype.getOptions=function(){return this.options},t.prototype.setOptions=function(t,e){void 0===e&&(e=!1),e&&!Object(o.a)(this.options,t)&&(this.previousOptions=this.options),this.options=t},t.prototype.unmount=function(){this.isMounted=!1},t.prototype.refreshClient=function(){var t=this.options&&this.options.client||this.context&&this.context.client;__DEV__?Object(r.b)(!!t,'Could not find "client" in the context or passed in as an option. Wrap the root component in an <ApolloProvider>, or pass an ApolloClient instance in via options.'):Object(r.b)(!!t,32);var e=!1;return t!==this.client&&(e=!0,this.client=t,this.cleanup()),{client:this.client,isNew:e}},t.prototype.verifyDocumentType=function(t,e){var n=Object(i.c)(t),o=Object(i.b)(e),a=Object(i.b)(n.type);__DEV__?Object(r.b)(n.type===e,"Running a "+o+" requires a graphql "+o+", but a "+a+" was used instead."):Object(r.b)(n.type===e,33)},t}()},716:function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));var o=n(708);var r=n(709);function i(t){return function(t){if(Array.isArray(t))return Object(o.a)(t)}(t)||function(t){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||Object(r.a)(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}},718:function(t,e,n){"use strict";n(1);var o=n(21),r=n(8);e.a=function(t){return t.dispatch?Object(r.jsxs)(o.H,{show:t.on,onClose:function(){return t.dispatch({type:"MODAL_DISPLAY",payload:{type:"CLOSE"}})},color:t.color,centered:!0,children:[Object(r.jsx)(o.K,{closeButton:!0,children:Object(r.jsxs)(o.L,{children:[" ",t.header," "]})}),Object(r.jsx)(o.I,{children:Object(r.jsx)("h5",{children:t.body})}),Object(r.jsx)(o.J,{children:Object(r.jsx)(o.d,{color:"secondary",onClick:function(){return t.dispatch({type:"MODAL_DISPLAY",payload:{type:"CLOSE"}})},children:"Kapat"})})]}):Object(r.jsxs)(o.H,{show:t.modalOn,onClose:function(){return t.setModal(!t.modalOn)},color:t.color,centered:!0,children:[Object(r.jsx)(o.K,{closeButton:!0,children:Object(r.jsxs)(o.L,{children:[" ",t.header," "]})}),Object(r.jsx)(o.I,{children:Object(r.jsx)("h5",{style:{textAlign:"center"},children:t.body})}),Object(r.jsx)(o.J,{children:Object(r.jsx)(o.d,{color:"secondary",onClick:function(){return t.setModal(!t.modalOn)},children:"Kapat"})})]})}},722:function(t,e,n){"use strict";n.d(e,"a",(function(){return h}));var o=n(6),r=n(1),i=n(33),a=n(707),c=n(66),s=n(711),u=n(703),l=function(t){function e(e){var n=e.options,o=e.context,r=e.result,i=e.setResult,c=t.call(this,n,o)||this;return c.runMutation=function(t){void 0===t&&(t={}),c.onMutationStart();var e=c.generateNewMutationId();return c.mutate(t).then((function(t){return c.onMutationCompleted(t,e),t})).catch((function(t){var n=c.getOptions().onError;if(c.onMutationError(t,e),n)return n(t),{data:void 0,errors:t};throw t}))},c.verifyDocumentType(n.mutation,a.a.Mutation),c.result=r,c.setResult=i,c.mostRecentMutationId=0,c}return Object(o.c)(e,t),e.prototype.execute=function(t){return this.isMounted=!0,this.verifyDocumentType(this.getOptions().mutation,a.a.Mutation),[this.runMutation,Object(o.a)(Object(o.a)({},t),{client:this.refreshClient().client})]},e.prototype.afterExecute=function(){return this.isMounted=!0,this.unmount.bind(this)},e.prototype.cleanup=function(){},e.prototype.mutate=function(t){return this.refreshClient().client.mutate(Object(u.b)(this.getOptions(),t))},e.prototype.onMutationStart=function(){this.result.loading||this.getOptions().ignoreResults||this.updateResult({loading:!0,error:void 0,data:void 0,called:!0})},e.prototype.onMutationCompleted=function(t,e){var n=this.getOptions(),o=n.onCompleted,r=n.ignoreResults,i=t.data,a=t.errors,s=a&&a.length>0?new c.a({graphQLErrors:a}):void 0;this.isMostRecentMutation(e)&&!r&&this.updateResult({called:!0,loading:!1,data:i,error:s}),o&&o(i)},e.prototype.onMutationError=function(t,e){this.isMostRecentMutation(e)&&this.updateResult({loading:!1,error:t,data:void 0,called:!0})},e.prototype.generateNewMutationId=function(){return++this.mostRecentMutationId},e.prototype.isMostRecentMutation=function(t){return this.mostRecentMutationId===t},e.prototype.updateResult=function(t){if(this.isMounted&&(!this.previousResult||!Object(i.a)(this.previousResult,t)))return this.setResult(t),this.previousResult=t,t},e}(s.a),d=n(255);function h(t,e){var n=Object(r.useContext)(Object(d.a)()),i=Object(r.useState)({called:!1,loading:!1}),a=i[0],c=i[1],s=e?Object(o.a)(Object(o.a)({},e),{mutation:t}):{mutation:t},u=Object(r.useRef)();var h=(u.current||(u.current=new l({options:s,context:n,result:a,setResult:c})),u.current);return h.setOptions(s),h.context=n,Object(r.useEffect)((function(){return h.afterExecute()})),h.execute(a)}},739:function(t,e,n){"use strict";n.r(e);var o,r=n(716),i=n(118),a=n(710),c=n(1),s=n(21),u=n(67),l=n(42),d=n(705),h=n(722),p=n(718),b=n(8),j=function(t){var e=t.color,n=t.body,o=t.show;return Object(b.jsx)(s.Y,{position:"top-right",children:Object(b.jsx)(s.W,{show:o,autohide:3e3,fade:!0,color:e,style:{textAlign:"center"},children:Object(b.jsx)(s.X,{children:n})})})},f=n(194);e.default=function(){var t={header:"HATA",body:"Bilgileriniz kaydedilmedi, l\xfctfen daha sonra tekrar deneyin",color:"danger"},e={header:"BA\u015eARILI",body:"Talebiniz ba\u015far\u0131yla i\u015flenmi\u015ftir! giri\u015f yapabilirsiniz.",color:"success"},n=Object(c.useState)(""),O=Object(a.a)(n,2),m=O[0],y=O[1],g=Object(c.useState)(""),x=Object(a.a)(g,2),v=x[0],M=x[1],w=Object(c.useState)(""),C=Object(a.a)(w,2),S=C[0],_=C[1],k=Object(c.useState)(""),A=Object(a.a)(k,2),D=A[0],R=A[1],E=Object(c.useState)({header:"",body:"",color:""}),N=Object(a.a)(E,2),z=N[0],I=N[1],L=Object(c.useState)(!1),B=Object(a.a)(L,2),q=B[0],H=B[1],Q=Object(c.useState)([]),T=Object(a.a)(Q,2),Y=T[0],$=T[1],K=function(){y(""),M(""),_(""),R("")},V=Object(d.a)(o||(o=Object(i.a)(["\n    mutation($username: String!, $password: String!, $pharmacy_name:String!) {\n      register(username: $username, password: $password, pharmacy_name: $pharmacy_name) {\n        username\n        password\n        pharmacy_name\n      }\n    }\n  "]))),P=Object(h.a)(V,{fetchPolicy:"no-cache",variables:{username:m,password:S,pharmacy_name:v},onError:function(e){var n;console.log(),451===(null===(n=e.graphQLErrors[0])||void 0===n?void 0:n.code)?$([].concat(Object(r.a)(Y),[{body:"Bu kullan\u0131c\u0131 ad\u0131 al\u0131nm\u0131\u015ft\u0131r. L\xfctfen farkl\u0131 bir kullan\u0131c\u0131 ad\u0131 se\xe7iniz"}])):(I(t),H(!0),K())},onCompleted:function(t){I(e),H(!0),K()}}),J=Object(a.a)(P,2),G=J[0],W=J[1].loading;return Object(b.jsx)("div",{className:"c-app c-default-layout flex-row align-items-center",children:Object(b.jsx)(f.a,{isLoading:W,children:Object(b.jsxs)(s.k,{children:[Y.map((function(t,e){return Object(b.jsx)(j,{body:t.body,show:!0,color:"danger"},e)})),Object(b.jsx)(p.a,{header:z.header,body:z.body,color:z.color,modalOn:q,setModal:H}),Object(b.jsx)(s.M,{className:"justify-content-center",children:Object(b.jsx)(s.i,{md:"9",lg:"7",xl:"6",children:Object(b.jsx)(s.e,{className:"mx-4",children:Object(b.jsx)(s.f,{className:"p-4",children:Object(b.jsxs)(s.t,{children:[Object(b.jsx)("div",{className:"container",children:Object(b.jsxs)("div",{className:"row",children:[Object(b.jsxs)("div",{className:"col",children:[Object(b.jsx)("h1",{children:"Kay\u0131t olun"}),Object(b.jsx)("p",{className:"text-muted",children:"Hesab\u0131n\u0131z\u0131 olu\u015fturun"})]}),Object(b.jsx)("div",{children:Object(b.jsx)(u.b,{to:"/login",children:Object(b.jsx)("p",{children:"Giri\u015f sayfas\u0131na git"})})})]})}),Object(b.jsxs)(s.B,{className:"mb-3",children:[Object(b.jsx)(s.C,{children:Object(b.jsx)(s.D,{children:Object(b.jsx)(l.a,{name:"cil-user"})})}),Object(b.jsx)(s.A,{type:"text",placeholder:"Kullan\u0131c\u0131 isminiz",autoComplete:"username",value:m,onChange:function(t){return y(t.target.value)}})]}),Object(b.jsxs)(s.B,{className:"mb-3",children:[Object(b.jsx)(s.C,{children:Object(b.jsx)(s.D,{children:Object(b.jsx)(l.a,{name:"cil-user"})})}),Object(b.jsx)(s.A,{type:"text",placeholder:"Eczanenizin ismi \xd6RN: Hayat Eczanesi",autoComplete:"pharmacy-name",value:v,onChange:function(t){M(t.target.value)}})]}),Object(b.jsxs)(s.B,{className:"mb-3",children:[Object(b.jsx)(s.C,{children:Object(b.jsx)(s.D,{children:Object(b.jsx)(l.a,{name:"cil-lock-locked"})})}),Object(b.jsx)(s.A,{type:"password",placeholder:"\u015eifreniz",autoComplete:"new-password",value:S,onChange:function(t){return _(t.target.value)}})]}),Object(b.jsxs)(s.B,{className:"mb-4",children:[Object(b.jsx)(s.C,{children:Object(b.jsx)(s.D,{children:Object(b.jsx)(l.a,{name:"cil-lock-locked"})})}),Object(b.jsx)(s.A,{type:"password",placeholder:"\u015eifrenizi tekrar giriniz",autoComplete:"new-password",value:D,onChange:function(t){return R(t.target.value)}})]}),Object(b.jsx)(s.d,{color:"success",block:!0,onClick:function(){!1!==(""!==m&&""!==S&&""!==D&&""!==v||($([].concat(Object(r.a)(Y),[{body:"L\xfctfen t\xfcm alanlar\u0131 doldurunuz"}])),!1))&&!1!==(S===D||($([].concat(Object(r.a)(Y),[{body:"\u015eifreniz uyu\u015fmuyor, l\xfctfen \u015fifrelerinizi kontrol edin"}])),!1))&&G()},children:"Hesab\u0131n\u0131z\u0131 olu\u015fturun"})]})})})})})]})})})}}}]);
//# sourceMappingURL=6.a1fe951f.chunk.js.map