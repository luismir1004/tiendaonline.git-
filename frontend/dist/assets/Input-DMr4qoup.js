import{j as e}from"./state-vendor-C7RdAvCM.js";import{r as u}from"./react-vendor-2QdgEHnk.js";import{a2 as b,a3 as h,A as j,m as y}from"./ui-vendor-utBlUGSj.js";const N=u.forwardRef(({label:a,id:o,name:i,type:l="text",placeholder:c,value:r,onChange:d,onBlur:m,error:s,touched:t,icon:n,className:x="",...f},g)=>{const p=()=>s&&t?"border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50":!s&&t&&r?"border-green-500 focus:border-green-500 focus:ring-green-500 bg-green-50":"border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 bg-white";return e.jsxs("div",{className:`w-full space-y-1 ${x}`,children:[a&&e.jsx("label",{htmlFor:o||i,className:"block text-sm font-medium text-slate-700",children:a}),e.jsxs("div",{className:"relative rounded-md shadow-sm",children:[n&&e.jsx("div",{className:"absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400",children:e.jsx(n,{size:18})}),e.jsx("input",{ref:g,id:o||i,name:i,type:l,value:r,onChange:d,onBlur:m,placeholder:c,className:`
            block w-full rounded-lg border-2 py-3
            transition-all duration-200 outline-none
            focus:ring-2 focus:ring-offset-1
            sm:text-sm
            ${n?"pl-10":"pl-4"} 
            pr-10
            ${p()}
          `,...f}),e.jsxs("div",{className:"absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none",children:[t&&s&&e.jsx(b,{className:"text-red-500",size:18}),t&&!s&&r&&e.jsx(h,{className:"text-green-500",size:18})]})]}),e.jsx(j,{children:t&&s&&e.jsx(y.p,{initial:{opacity:0,height:0,y:-5},animate:{opacity:1,height:"auto",y:0},exit:{opacity:0,height:0},className:"text-xs text-red-600 mt-1 ml-1 font-medium",children:s})})]})});N.displayName="Input";export{N as I};
