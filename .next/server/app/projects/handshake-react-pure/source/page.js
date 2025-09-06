(()=>{var e={};e.id=415,e.ids=[415],e.modules={2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},950:(e,t,a)=>{"use strict";a.r(t),a.d(t,{GlobalError:()=>o.a,__next_app__:()=>m,originalPathname:()=>x,pages:()=>l,routeModule:()=>p,tree:()=>d}),a(2673),a(1506),a(5866);var r=a(3191),s=a(8716),n=a(7922),o=a.n(n),i=a(5231),c={};for(let e in i)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(c[e]=()=>i[e]);a.d(t,c);let d=["",{children:["projects",{children:["handshake-react-pure",{children:["source",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(a.bind(a,2673)),"C:\\Users\\guima\\Desktop\\Dashboard IA Project\\jarvis-workstation\\app\\projects\\handshake-react-pure\\source\\page.tsx"]}]},{}]},{}]},{}]},{layout:[()=>Promise.resolve().then(a.t.bind(a,1506,23)),"C:\\Users\\guima\\Desktop\\Dashboard IA Project\\jarvis-workstation\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(a.t.bind(a,5866,23)),"next/dist/client/components/not-found-error"]}],l=["C:\\Users\\guima\\Desktop\\Dashboard IA Project\\jarvis-workstation\\app\\projects\\handshake-react-pure\\source\\page.tsx"],x="/projects/handshake-react-pure/source/page",m={require:a,loadChunk:()=>Promise.resolve()},p=new r.AppPageRouteModule({definition:{kind:s.x.APP_PAGE,page:"/projects/handshake-react-pure/source/page",pathname:"/projects/handshake-react-pure/source",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},1434:(e,t,a)=>{Promise.resolve().then(a.bind(a,4966))},5530:(e,t,a)=>{Promise.resolve().then(a.t.bind(a,2994,23)),Promise.resolve().then(a.t.bind(a,6114,23)),Promise.resolve().then(a.t.bind(a,9727,23)),Promise.resolve().then(a.t.bind(a,9671,23)),Promise.resolve().then(a.t.bind(a,1868,23)),Promise.resolve().then(a.t.bind(a,4759,23))},5303:()=>{},4966:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>l});var r=a(326),s=a(7577),n=a(4296),o=a(8648),i=a(9914),c=a(8351),d=a(434);function l(){let[e,t]=(0,s.useState)("package.json"),[a,l]=(0,s.useState)(""),x={"package.json":{content:`{
  "name": "handshake-react-pure",
  "version": "1.0.0",
  "description": "React Dashboard UI full frontend",
  "main": "index.tsx",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "recharts": "^2.8.0",
    "react-force-graph": "^1.25.0",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "typescript": "^5.0.2",
    "vite": "^4.4.5",
    "tailwindcss": "^4.1.12",
    "@tailwindcss/postcss": "^4.1.12"
  }
}`,language:"json"},"tailwind.config.js":{content:`module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#e8eaf6',
        bg: '#0b1020',
        panel: '#0f152b',
        accent: {
          1: '#79ffe1', // vert fluo
          2: '#ffd166', // jaune
          3: '#5cb3ff', // bleu
          4: '#f78fb3'  // rose
        }
      },
      boxShadow: {
        glow: '0 0 12px rgba(124, 198, 255, 0.25)'
      },
      borderRadius: {
        '2xl': '1.25rem'
      }
    }
  },
  plugins: []
}`,language:"javascript"},"src/App.tsx":{content:`import React from 'react';
import HandshakeDashboardTemplate from './components/HandshakeDashboardTemplate';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <HandshakeDashboardTemplate />
    </div>
  );
}

export default App;`,language:"tsx"},"src/components/HandshakeDashboardTemplate.tsx":{content:`import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, Filter, TrendingUp, Users, Activity, Zap } from 'lucide-react';

const HandshakeDashboardTemplate: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const data = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 700 }
  ];

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-panel border-b border-gray-800 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-accent-1">Handshake Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:border-accent-1 focus:outline-none"
              />
            </div>
            <button className="bg-accent-1 text-bg px-4 py-2 rounded-lg hover:shadow-glow-accent transition-all">
              <Filter size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-panel p-6 rounded-2xl border border-gray-800 shadow-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-accent-1">1,234</p>
              </div>
              <Users className="text-accent-1" size={24} />
            </div>
          </div>
          
          <div className="bg-panel p-6 rounded-2xl border border-gray-800 shadow-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Sessions</p>
                <p className="text-2xl font-bold text-accent-2">567</p>
              </div>
              <Activity className="text-accent-2" size={24} />
            </div>
          </div>
          
          <div className="bg-panel p-6 rounded-2xl border border-gray-800 shadow-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Projects</p>
                <p className="text-2xl font-bold text-accent-3">89</p>
              </div>
              <TrendingUp className="text-accent-3" size={24} />
            </div>
          </div>
          
          <div className="bg-panel p-6 rounded-2xl border border-gray-800 shadow-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Alerts</p>
                <p className="text-2xl font-bold text-accent-4">12</p>
              </div>
              <Zap className="text-accent-4" size={24} />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-panel p-6 rounded-2xl border border-gray-800 shadow-glow">
            <h3 className="text-lg font-semibold mb-4 text-white">Activity Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#79ffe1" 
                  strokeWidth={2}
                  dot={{ fill: '#79ffe1', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-panel p-6 rounded-2xl border border-gray-800 shadow-glow">
            <h3 className="text-lg font-semibold mb-4 text-white">Network Connections</h3>
            <div className="h-[300px] bg-gradient-to-br from-accent-2/10 to-accent-4/10 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">🕸️</div>
                <p className="text-gray-400">React Force Graph</p>
                <p className="text-sm text-gray-500">Connexions interactives</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HandshakeDashboardTemplate;`,language:"tsx"}},m=(e,t)=>{navigator.clipboard.writeText(e),l(t),setTimeout(()=>l(""),2e3)};return(0,r.jsxs)("div",{className:"space-y-6",children:[(0,r.jsxs)("div",{className:"flex items-center justify-between",children:[(0,r.jsxs)("div",{className:"flex items-center gap-4",children:[r.jsx(d.default,{href:"/projects",children:(0,r.jsxs)("button",{className:"flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors",children:[r.jsx(n.Z,{size:20}),"Retour aux projets"]})}),(0,r.jsxs)("div",{children:[r.jsx("h1",{className:"text-2xl font-bold",children:"Code Source - Handshake Dashboard"}),r.jsx("p",{className:"text-gray-600 dark:text-gray-400",children:"React 19.1.1 + TypeScript + Tailwind CSS 4.1.12"})]})]}),(0,r.jsxs)("div",{className:"flex gap-2",children:[r.jsx(d.default,{href:"/projects/handshake-react-pure/preview",children:(0,r.jsxs)("button",{className:"flex items-center gap-2 bg-accent-3 text-white px-4 py-2 rounded-lg hover:shadow-glow transition-all",children:[r.jsx(o.Z,{size:16}),"Preview"]})}),(0,r.jsxs)("button",{className:"flex items-center gap-2 bg-accent-1 text-bg px-4 py-2 rounded-lg hover:shadow-glow-accent transition-all",children:[r.jsx(i.Z,{size:16}),"T\xe9l\xe9charger ZIP"]})]})]}),r.jsx("div",{className:"flex gap-2 border-b border-gray-200 dark:border-gray-700",children:Object.keys(x).map(a=>r.jsx("button",{onClick:()=>t(a),className:`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${e===a?"border-accent-1 text-accent-1":"border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"}`,children:a},a))}),(0,r.jsxs)("div",{className:"bg-gray-900 rounded-2xl overflow-hidden shadow-glow",children:[(0,r.jsxs)("div",{className:"flex items-center justify-between bg-gray-800 px-4 py-2",children:[r.jsx("span",{className:"text-sm text-gray-400",children:e}),(0,r.jsxs)("button",{onClick:()=>m(x[e].content,e),className:"flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors",children:[r.jsx(c.Z,{size:16}),a===e?"Copi\xe9!":"Copier"]})]}),r.jsx("div",{className:"p-4",children:r.jsx("pre",{className:"text-sm text-gray-300 overflow-x-auto",children:r.jsx("code",{className:`language-${x[e].language}`,children:x[e].content})})})]}),(0,r.jsxs)("div",{className:"flex justify-center gap-4",children:[(0,r.jsxs)("button",{className:"flex items-center gap-2 bg-accent-1 text-bg px-6 py-3 rounded-lg hover:shadow-glow-accent transition-all",children:[r.jsx(i.Z,{size:16}),"G\xe9n\xe9rer avec Jarvis"]}),(0,r.jsxs)("button",{className:"flex items-center gap-2 bg-accent-2 text-bg px-6 py-3 rounded-lg hover:shadow-glow-warning transition-all",children:[r.jsx(c.Z,{size:16}),"Copier tout le projet"]})]})]})}},1506:()=>{throw Error("Module build failed (from ./node_modules/next/dist/build/webpack/loaders/next-swc-loader.js):\nError: \n  \x1b[38;2;255;30;30m\xd7\x1b[0m Merge conflict marker encountered.\n    ╭─[\x1b[38;2;92;157;255;1;4mC:\\Users\\guima\\Desktop\\Dashboard IA Project\\jarvis-workstation\\app\\layout.tsx\x1b[0m:9:1]\n \x1b[2m 9\x1b[0m │   description: \"Dashboard IA complet avec interface Handshake Advanced - Version Electron\",\n \x1b[2m10\x1b[0m │ };\n \x1b[2m11\x1b[0m │ \n \x1b[2m12\x1b[0m │ <<<<<<< Current (Your changes)\n    \xb7 \x1b[38;2;246;87;248m───────\x1b[0m\n \x1b[2m13\x1b[0m │ export default function RootLayout({ children }: { children: React.ReactNode }) {\n \x1b[2m14\x1b[0m │ =======\n \x1b[2m15\x1b[0m │ export default function RootLayout({ \n    ╰────\n\n  \x1b[38;2;255;30;30m\xd7\x1b[0m Merge conflict marker encountered.\n    ╭─[\x1b[38;2;92;157;255;1;4mC:\\Users\\guima\\Desktop\\Dashboard IA Project\\jarvis-workstation\\app\\layout.tsx\x1b[0m:11:1]\n \x1b[2m11\x1b[0m │ \n \x1b[2m12\x1b[0m │ <<<<<<< Current (Your changes)\n \x1b[2m13\x1b[0m │ export default function RootLayout({ children }: { children: React.ReactNode }) {\n \x1b[2m14\x1b[0m │ =======\n    \xb7 \x1b[38;2;246;87;248m───────\x1b[0m\n \x1b[2m15\x1b[0m │ export default function RootLayout({ \n \x1b[2m16\x1b[0m │   children \n \x1b[2m17\x1b[0m │ }: { \n    ╰────\n\n  \x1b[38;2;255;30;30m\xd7\x1b[0m 'import', and 'export' cannot be used outside of module code\n    ╭─[\x1b[38;2;92;157;255;1;4mC:\\Users\\guima\\Desktop\\Dashboard IA Project\\jarvis-workstation\\app\\layout.tsx\x1b[0m:11:1]\n \x1b[2m11\x1b[0m │     \n \x1b[2m12\x1b[0m │     <<<<<<< Current (Your changes)\n \x1b[2m13\x1b[0m │     export default function RootLayout({ children }: { children: React.ReactNode }) {\n \x1b[2m14\x1b[0m │ \x1b[38;2;246;87;248m╭\x1b[0m\x1b[38;2;246;87;248m─\x1b[0m\x1b[38;2;246;87;248m▶\x1b[0m =======\n \x1b[2m15\x1b[0m │ \x1b[38;2;246;87;248m╰\x1b[0m\x1b[38;2;246;87;248m─\x1b[0m\x1b[38;2;246;87;248m▶\x1b[0m export default function RootLayout({ \n \x1b[2m16\x1b[0m │       children \n \x1b[2m17\x1b[0m │     }: { \n \x1b[2m18\x1b[0m │       children: React.ReactNode;\n    ╰────\n\n\nCaused by:\n    Syntax Error")},2673:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>r});let r=(0,a(8570).createProxy)(String.raw`C:\Users\guima\Desktop\Dashboard IA Project\jarvis-workstation\app\projects\handshake-react-pure\source\page.tsx#default`)},4296:(e,t,a)=>{"use strict";a.d(t,{Z:()=>r});let r=(0,a(7926).Z)("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]])},8351:(e,t,a)=>{"use strict";a.d(t,{Z:()=>r});let r=(0,a(7926).Z)("Copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]])},8648:(e,t,a)=>{"use strict";a.d(t,{Z:()=>r});let r=(0,a(7926).Z)("Eye",[["path",{d:"M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z",key:"rwhkz3"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]])}};var t=require("../../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),r=t.X(0,[8948,4471,3713],()=>a(950));module.exports=r})();