"use strict";(globalThis.webpackChunksmart_fund_manager=globalThis.webpackChunksmart_fund_manager||[]).push([[5270],{78185(e,t,a){a.d(t,{A:()=>S});var r=a(98587),n=a(58168),i=a(65043),o=a(58387),s=a(83290),l=a(98610);function d(e){return String(e).match(/[\d.\-+]*\s*(.*)/)[1]||""}function c(e){return parseFloat(e)}var h=a(90310),p=a(34535),g=a(98206),u=a(92532),m=a(72372);function v(e){return(0,m.Ay)("MuiSkeleton",e)}(0,u.A)("MuiSkeleton",["root","text","rectangular","rounded","circular","pulse","wave","withChildren","fitContent","heightAuto"]);var f=a(70579);const y=["animation","className","component","height","style","variant","width"];let b,A,w,x,C=e=>e;const k=(0,s.i7)(b||(b=C`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
`)),$=(0,s.i7)(A||(A=C`
  0% {
    transform: translateX(-100%);
  }

  50% {
    /* +0.5s of delay between each loop */
    transform: translateX(100%);
  }

  100% {
    transform: translateX(100%);
  }
`)),R=(0,p.Ay)("span",{name:"MuiSkeleton",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:a}=e;return[t.root,t[a.variant],!1!==a.animation&&t[a.animation],a.hasChildren&&t.withChildren,a.hasChildren&&!a.width&&t.fitContent,a.hasChildren&&!a.height&&t.heightAuto]}})(e=>{let{theme:t,ownerState:a}=e;const r=d(t.shape.borderRadius)||"px",i=c(t.shape.borderRadius);return(0,n.A)({display:"block",backgroundColor:t.vars?t.vars.palette.Skeleton.bg:(0,h.X4)(t.palette.text.primary,"light"===t.palette.mode?.11:.13),height:"1.2em"},"text"===a.variant&&{marginTop:0,marginBottom:0,height:"auto",transformOrigin:"0 55%",transform:"scale(1, 0.60)",borderRadius:`${i}${r}/${Math.round(i/.6*10)/10}${r}`,"&:empty:before":{content:'"\\00a0"'}},"circular"===a.variant&&{borderRadius:"50%"},"rounded"===a.variant&&{borderRadius:(t.vars||t).shape.borderRadius},a.hasChildren&&{"& > *":{visibility:"hidden"}},a.hasChildren&&!a.width&&{maxWidth:"fit-content"},a.hasChildren&&!a.height&&{height:"auto"})},e=>{let{ownerState:t}=e;return"pulse"===t.animation&&(0,s.AH)(w||(w=C`
      animation: ${0} 2s ease-in-out 0.5s infinite;
    `),k)},e=>{let{ownerState:t,theme:a}=e;return"wave"===t.animation&&(0,s.AH)(x||(x=C`
      position: relative;
      overflow: hidden;

      /* Fix bug in Safari https://bugs.webkit.org/show_bug.cgi?id=68196 */
      -webkit-mask-image: -webkit-radial-gradient(white, black);

      &::after {
        animation: ${0} 2s linear 0.5s infinite;
        background: linear-gradient(
          90deg,
          transparent,
          ${0},
          transparent
        );
        content: '';
        position: absolute;
        transform: translateX(-100%); /* Avoid flash during server-side hydration */
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
      }
    `),$,(a.vars||a).palette.action.hover)}),S=i.forwardRef(function(e,t){const a=(0,g.b)({props:e,name:"MuiSkeleton"}),{animation:i="pulse",className:s,component:d="span",height:c,style:h,variant:p="text",width:u}=a,m=(0,r.A)(a,y),b=(0,n.A)({},a,{animation:i,component:d,variant:p,hasChildren:Boolean(m.children)}),A=(e=>{const{classes:t,variant:a,animation:r,hasChildren:n,width:i,height:o}=e,s={root:["root",a,r,n&&"withChildren",n&&!i&&"fitContent",n&&!o&&"heightAuto"]};return(0,l.A)(s,v,t)})(b);return(0,f.jsx)(R,(0,n.A)({as:d,ref:t,className:(0,o.A)(A.root,s),ownerState:b},m,{style:(0,n.A)({width:u,height:c},h)}))})},41009(e,t,a){a.d(t,{A:()=>r});const r=a(65043).createContext()},21573(e,t,a){a.d(t,{A:()=>r});const r=a(65043).createContext()},10039(e,t,a){a.d(t,{A:()=>w});var r=a(98587),n=a(58168),i=a(65043),o=a(58387),s=a(98610),l=a(67266),d=a(6803),c=a(41009),h=a(21573),p=a(98206),g=a(34535),u=a(92532),m=a(72372);function v(e){return(0,m.Ay)("MuiTableCell",e)}const f=(0,u.A)("MuiTableCell",["root","head","body","footer","sizeSmall","sizeMedium","paddingCheckbox","paddingNone","alignLeft","alignCenter","alignRight","alignJustify","stickyHeader"]);var y=a(70579);const b=["align","className","component","padding","scope","size","sortDirection","variant"],A=(0,g.Ay)("td",{name:"MuiTableCell",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:a}=e;return[t.root,t[a.variant],t[`size${(0,d.A)(a.size)}`],"normal"!==a.padding&&t[`padding${(0,d.A)(a.padding)}`],"inherit"!==a.align&&t[`align${(0,d.A)(a.align)}`],a.stickyHeader&&t.stickyHeader]}})(e=>{let{theme:t,ownerState:a}=e;return(0,n.A)({},t.typography.body2,{display:"table-cell",verticalAlign:"inherit",borderBottom:t.vars?`1px solid ${t.vars.palette.TableCell.border}`:`1px solid\n    ${"light"===t.palette.mode?(0,l.a)((0,l.X4)(t.palette.divider,1),.88):(0,l.e$)((0,l.X4)(t.palette.divider,1),.68)}`,textAlign:"left",padding:16},"head"===a.variant&&{color:(t.vars||t).palette.text.primary,lineHeight:t.typography.pxToRem(24),fontWeight:t.typography.fontWeightMedium},"body"===a.variant&&{color:(t.vars||t).palette.text.primary},"footer"===a.variant&&{color:(t.vars||t).palette.text.secondary,lineHeight:t.typography.pxToRem(21),fontSize:t.typography.pxToRem(12)},"small"===a.size&&{padding:"6px 16px",[`&.${f.paddingCheckbox}`]:{width:24,padding:"0 12px 0 16px","& > *":{padding:0}}},"checkbox"===a.padding&&{width:48,padding:"0 0 0 4px"},"none"===a.padding&&{padding:0},"left"===a.align&&{textAlign:"left"},"center"===a.align&&{textAlign:"center"},"right"===a.align&&{textAlign:"right",flexDirection:"row-reverse"},"justify"===a.align&&{textAlign:"justify"},a.stickyHeader&&{position:"sticky",top:0,zIndex:2,backgroundColor:(t.vars||t).palette.background.default})}),w=i.forwardRef(function(e,t){const a=(0,p.b)({props:e,name:"MuiTableCell"}),{align:l="inherit",className:g,component:u,padding:m,scope:f,size:w,sortDirection:x,variant:C}=a,k=(0,r.A)(a,b),$=i.useContext(c.A),R=i.useContext(h.A),S=R&&"head"===R.variant;let M;M=u||(S?"th":"td");let T=f;"td"===M?T=void 0:!T&&S&&(T="col");const z=C||R&&R.variant,H=(0,n.A)({},a,{align:l,component:M,padding:m||($&&$.padding?$.padding:"normal"),size:w||($&&$.size?$.size:"medium"),sortDirection:x,stickyHeader:"head"===z&&$&&$.stickyHeader,variant:z}),N=(e=>{const{classes:t,variant:a,align:r,padding:n,size:i,stickyHeader:o}=e,l={root:["root",a,o&&"stickyHeader","inherit"!==r&&`align${(0,d.A)(r)}`,"normal"!==n&&`padding${(0,d.A)(n)}`,`size${(0,d.A)(i)}`]};return(0,s.A)(l,v,t)})(H);let X=null;return x&&(X="asc"===x?"ascending":"descending"),(0,y.jsx)(A,(0,n.A)({as:M,ref:t,className:(0,o.A)(N.root,g),"aria-sort":X,scope:T,ownerState:H},k))})},28076(e,t,a){a.d(t,{A:()=>A});var r=a(58168),n=a(98587),i=a(65043),o=a(58387),s=a(98610),l=a(67266),d=a(21573),c=a(98206),h=a(34535),p=a(92532),g=a(72372);function u(e){return(0,g.Ay)("MuiTableRow",e)}const m=(0,p.A)("MuiTableRow",["root","selected","hover","head","footer"]);var v=a(70579);const f=["className","component","hover","selected"],y=(0,h.Ay)("tr",{name:"MuiTableRow",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:a}=e;return[t.root,a.head&&t.head,a.footer&&t.footer]}})(e=>{let{theme:t}=e;return{color:"inherit",display:"table-row",verticalAlign:"middle",outline:0,[`&.${m.hover}:hover`]:{backgroundColor:(t.vars||t).palette.action.hover},[`&.${m.selected}`]:{backgroundColor:t.vars?`rgba(${t.vars.palette.primary.mainChannel} / ${t.vars.palette.action.selectedOpacity})`:(0,l.X4)(t.palette.primary.main,t.palette.action.selectedOpacity),"&:hover":{backgroundColor:t.vars?`rgba(${t.vars.palette.primary.mainChannel} / calc(${t.vars.palette.action.selectedOpacity} + ${t.vars.palette.action.hoverOpacity}))`:(0,l.X4)(t.palette.primary.main,t.palette.action.selectedOpacity+t.palette.action.hoverOpacity)}}}}),b="tr",A=i.forwardRef(function(e,t){const a=(0,c.b)({props:e,name:"MuiTableRow"}),{className:l,component:h=b,hover:p=!1,selected:g=!1}=a,m=(0,n.A)(a,f),A=i.useContext(d.A),w=(0,r.A)({},a,{component:h,hover:p,selected:g,head:A&&"head"===A.variant,footer:A&&"footer"===A.variant}),x=(e=>{const{classes:t,selected:a,hover:r,head:n,footer:i}=e,o={root:["root",a&&"selected",r&&"hover",n&&"head",i&&"footer"]};return(0,s.A)(o,u,t)})(w);return(0,v.jsx)(y,(0,r.A)({as:h,ref:t,className:(0,o.A)(x.root,l),role:h===b?null:"row",ownerState:w},m))})}}]);
//# sourceMappingURL=5270.1bfff58f.chunk.js.map