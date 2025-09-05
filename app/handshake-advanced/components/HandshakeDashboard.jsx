import React, {useState} from 'react'
import TopBar from './TopBar'
import RightPanel from './RightPanel'
import NetworkGraph from './NetworkGraph'
import BottomTimeline from './BottomTimeline'

export default function HandshakeDashboard(){
  const [query,setQuery]=useState('')
  const [selection,setSelection]=useState(null)

  return (
    <div style={{height:'100vh',display:'grid',gridTemplateColumns:'280px 1fr 360px',gridTemplateRows:'auto 1fr auto'}}>
      {/* Sidebar (static placeholders) */}
      <aside style={{borderRight:'1px solid rgba(255,255,255,.08)',background:'rgba(255,255,255,.04)'}}>
        <div style={{padding:14}}>
          <div style={{fontWeight:600}}>Dashboard</div>
          <div className="grid" style={{marginTop:12}}>
            <button className="btn">Overview</button>
            <button className="btn">Keys Vault</button>
            <button className="btn">AI Roundtable</button>
            <button className="btn">Performance</button>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div style={{display:'grid',gridTemplateRows:'auto 1fr auto',gap:8}}>
        <TopBar onSearch={setQuery}/>
        <div style={{position:'relative'}}>
          <NetworkGraph onSelect={setSelection} />
        </div>
        <BottomTimeline />
      </div>

      {/* Right */}
      <RightPanel />
    </div>
  )
}
