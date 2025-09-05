import React from 'react'
export default function TopBar({onSearch}){
  return (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 14px',borderBottom:'1px solid rgba(255,255,255,.08)',background:'rgba(255,255,255,.04)',backdropFilter:'blur(6px)'}}>
      <div className="row">
        <span className="small">Status</span>
        <select className="input"><option>ALL</option><option>WAITLIST</option><option>WHITELIST</option></select>
        <span className="small">Tool</span>
        <select className="input"><option>ALL</option><option>Research</option><option>Video</option></select>
        <span className="small">Geography</span>
        <select className="input"><option>Global</option><option>EU</option><option>US</option></select>
      </div>
      <div className="row">
        <input className="input" placeholder="Search projects…" onChange={e=>onSearch?.(e.target.value)} />
        <button className="btn">New Project</button>
      </div>
    </div>
  )
}
