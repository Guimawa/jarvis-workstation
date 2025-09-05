import React from 'react'
export default function BottomTimeline(){
  const days = Array.from({length:16}, (_,i)=>({h: Math.round(Math.random()*48)+6}))
  return (
    <div className="panel" style={{padding:'10px',marginTop:'8px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
        <div className="row">
          <strong>Trends by Topics</strong>
          <span className="badge"><span style={{width:8,height:8,borderRadius:999,background:'#60a5fa'}}></span>Mentions</span>
          <span className="badge"><span style={{width:8,height:8,borderRadius:999,background:'#22c55e'}}></span>Influencer Activity</span>
          <span className="badge"><span style={{width:8,height:8,borderRadius:999,background:'#fbbf24'}}></span>Engagement</span>
        </div>
        <div className="row"><span className="small">Sep 14</span><span style={{opacity:.5}}>—</span><span className="small">Today</span></div>
      </div>
      <div className="timeline">
        {days.map((d,i)=>(<div key={i} className={'bar '+(d.h>40?'active':'')} style={{height:d.h}} />))}
      </div>
    </div>
  )
}
