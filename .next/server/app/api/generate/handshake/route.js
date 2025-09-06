"use strict";(()=>{var e={};e.id=9566,e.ids=[9566],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},7702:e=>{e.exports=require("events")},629:e=>{e.exports=require("fs/promises")},5315:e=>{e.exports=require("path")},8292:(e,t,a)=>{a.r(t),a.d(t,{originalPathname:()=>x,patchFetch:()=>u,requestAsyncStorage:()=>l,routeModule:()=>c,serverHooks:()=>m,staticGenerationAsyncStorage:()=>p});var r={};a.r(r),a.d(r,{POST:()=>d});var s=a(9303),o=a(8716),i=a(670),n=a(2537);async function d(e){try{let{prompt:t,config:a={}}=await e.json(),r=a.name||"handshake-custom",s=a.type||"dashboard",o={name:r,type:s,description:`Projet g\xe9n\xe9r\xe9 par Jarvis bas\xe9 sur handshake-react-pure: ${t}`,tech:["React 19.1.1","TypeScript","Tailwind CSS 4.1.12","Recharts","Lucide React"],files:{"package.json":`{
  "name": "${r}",
  "version": "1.0.0",
  "description": "Dashboard g\xe9n\xe9r\xe9 par Jarvis bas\xe9 sur handshake-react-pure",
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
}`,"tailwind.config.js":`module.exports = {
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
}`,"src/App.tsx":`import React from 'react';
import Dashboard from './components/Dashboard';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <Dashboard />
    </div>
  );
}

export default App;`,"src/components/Dashboard.tsx":`import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, Filter, TrendingUp, Users, Activity, Zap } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Donn\xe9es g\xe9n\xe9r\xe9es selon le prompt: ${t}
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
          <h1 className="text-2xl font-bold text-accent-1">Dashboard G\xe9n\xe9r\xe9 par Jarvis</h1>
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

export default Dashboard;`,"src/index.css":`@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

@layer components {
  .shadow-glow {
    box-shadow: 0 0 12px rgba(124, 198, 255, 0.25);
  }
  
  .shadow-glow-accent {
    box-shadow: 0 0 20px rgba(121, 255, 225, 0.3);
  }
}`},preview:`/projects/${r}/preview`,source:`/projects/${r}/source`};return(0,n.Hb)({prompt:t,code:JSON.stringify(o,null,2),title:`Projet Handshake g\xe9n\xe9r\xe9 - ${r}`,type:"project"}),Response.json({success:!0,project:o,message:`Projet ${r} g\xe9n\xe9r\xe9 avec succ\xe8s bas\xe9 sur handshake-react-pure`})}catch(e){return console.error("[API Error]",e),new Response(JSON.stringify({error:"Erreur g\xe9n\xe9ration projet handshake",details:e.message}),{status:500})}}let c=new s.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/generate/handshake/route",pathname:"/api/generate/handshake",filename:"route",bundlePath:"app/api/generate/handshake/route"},resolvedPagePath:"C:\\Users\\guima\\Desktop\\Dashboard IA Project\\jarvis-workstation\\app\\api\\generate\\handshake\\route.js",nextConfigOutput:"",userland:r}),{requestAsyncStorage:l,staticGenerationAsyncStorage:p,serverHooks:m}=c,x="/api/generate/handshake/route";function u(){return(0,i.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:p})}},9303:(e,t,a)=>{e.exports=a(517)},2537:(e,t,a)=>{a.d(t,{Lz:()=>o,Hb:()=>s}),a(629),a(5315),a(7702);let r=[];function s({prompt:e,code:t,title:a}){let s=new Date().toISOString();r.unshift({prompt:e,code:t,title:a,date:s})}function o(){return r}}};var t=require("../../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),r=t.X(0,[8948],()=>a(8292));module.exports=r})();