if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,t)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(s[r])return;let o={};const l=e=>i(e,r),u={module:{uri:r},exports:o,require:l};s[r]=Promise.all(n.map((e=>u[e]||l(e)))).then((e=>(t(...e),o)))}}define(["./workbox-7369c0e1"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/app-d19432ca.js",revision:null},{url:"assets/bootstrap.esm-191b8220.js",revision:null},{url:"assets/index-92f4da10.js",revision:null},{url:"assets/index-db76e852.css",revision:null},{url:"index.html",revision:"fde16b4305d5057349fedec89165e677"},{url:"manifest.webmanifest",revision:"ebe65c6d9459f56c03f3490121f31ec7"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
