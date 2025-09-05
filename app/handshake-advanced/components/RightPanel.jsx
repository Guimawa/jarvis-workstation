import React, {useState} from 'react'
const Tab = ({id,active,setActive,children}) => (
  <button onClick={()=>setActive(id)} className="btn" style={{background: active===id?'rgba(96,165,250,.2)':'rgba(255,255,255,.06)'}}>{children}</button>
)
export default function RightPanel(){
  const [tab,setTab] = useState('influencers')
  const common = Array.from({length:8},(_,i)=>({name:'Item '+(i+1), val: Math.round(Math.random()*100), dot:'#60a5fa'}))
  const influencers = common
  const topics = common.map((x,i)=>({...x,name:'Topic '+(i+1), dot:'#22c55e'}))
  const events = common.map((x,i)=>({...x,name:'Event '+(i+1), dot:'#fbbf24'}))
  const list = tab==='influencers'?influencers : tab==='topics'?topics : events
  return (
    <aside style={{width:360,display:'flex',flexDirection:'column',gap:10}}>
      <div className="panel" style={{padding:12}}>
        <div className="row" style={{justifyContent:'space-between'}}>
          <strong>Network Ranking</strong>
          <span className="small">Overall</span>
        </div>
        <div className="row" style={{gap:8,margin:'8px 0 10px 0'}}>
          <Tab id="influencers" active={tab} setActive={setTab}>Influencers</Tab>
          <Tab id="topics" active={tab} setActive={setTab}>Topics</Tab>
          <Tab id="events" active={tab} setActive={setTab}>Events</Tab>
        </div>
        <div className="grid">
          {list.map((it,i)=>(
            <div className="item" key={i}>
              <div className="left">
                <span className="dot" style={{background: it.dot}}></span>
                <span style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{i+1}. {it.name}</span>
              </div>
              <div className="right">{it.val}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="panel" style={{padding:12}}>
        <div className="row" style={{justifyContent:'space-between'}}>
          <strong>Influencer Stats</strong><span className="small">Today</span>
        </div>
        <div className="grid" style={{gridTemplateColumns:'1fr 1fr',marginTop:8}}>
          <div className="panel" style={{padding:10}}><div className="small">Mentions</div><div style={{fontSize:24}}>1,284</div></div>
          <div className="panel" style={{padding:10}}><div className="small">Engagement</div><div style={{fontSize:24}}>8,931</div></div>
        </div>
        <hr className="sep"/>
        <div className="row" style={{justifyContent:'space-between'}}>
          <div className="row"><span className="small">Sorting</span><div className="toggle"><input type="checkbox" id="t1"/><div className="knob"/></div></div>
          <div className="row"><span className="small">Time Range</span><div className="toggle"><input type="checkbox" id="t2"/><div className="knob"/></div></div>
          <div className="row"><span className="small">Analyze</span><div className="toggle"><input type="checkbox" id="t3"/><div className="knob"/></div></div>
        </div>
        <div style={{marginTop:10}}>
          <div className="row" style={{justifyContent:'space-between'}}><span className="small">Score</span><input className="slider" type="range" min="0" max="100" defaultValue="60"/></div>
          <div className="row" style={{justifyContent:'space-between'}}><span className="small">Actors</span><input className="slider" type="range" min="0" max="100" defaultValue="40"/></div>
          <div className="row" style={{justifyContent:'space-between'}}><span className="small">Geography</span><input className="slider" type="range" min="0" max="100" defaultValue="70"/></div>
        </div>
      </div>
    </aside>
  )
}
