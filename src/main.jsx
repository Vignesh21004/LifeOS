import React, {useMemo, useState} from "react";
import {createRoot} from "react-dom/client";
import {
  LayoutDashboard, CheckSquare, CalendarDays, WalletCards, Files,
  BellRing, BarChart3, Sparkles, Search, Plus, ArrowUpRight,
  ArrowDownRight, MoreHorizontal, Clock3, CircleCheck, Circle,
  ChevronRight, Command, Zap, Target, ReceiptText, ShieldCheck,
  Moon, Sun, X, Send, TrendingUp, Menu, Trash2
} from "lucide-react";
import "./styles.css";

const initialTasks=[
 {id:1,title:"Finish DBMS assignment",tag:"University",priority:"High",time:"Today · 7:30 PM",done:false},
 {id:2,title:"Apply for frontend internship",tag:"Career",priority:"High",time:"Today · 9:00 PM",done:false},
 {id:3,title:"30 min workout",tag:"Health",priority:"Medium",time:"Today · 6:00 PM",done:true},
 {id:4,title:"Review LifeOS database schema",tag:"Project",priority:"Medium",time:"Tomorrow · 10:00 AM",done:false}
];
const expenses=[
 {name:"Food & dining",amount:7240,icon:"🍜"},
 {name:"Shopping",amount:6450,icon:"🛍️"},
 {name:"Bills",amount:4820,icon:"⚡"},
 {name:"Transport",amount:3120,icon:"🚕"}
];

function App(){
 const [page,setPage]=useState("Overview");
 const [tasks,setTasks]=useState(initialTasks);
 const [dark,setDark]=useState(true);
 const [showAdd,setShowAdd]=useState(false);
 const [query,setQuery]=useState("");
 const [newTask,setNewTask]=useState("");
 const [toast,setToast]=useState("");
 const [aiOpen,setAiOpen]=useState(false);
 const [aiText,setAiText]=useState("");
 const [messages,setMessages]=useState([{role:"ai",text:"Hey Sai 👋 I’m your LifeOS copilot. Ask me about tasks, spending, deadlines or your week."}]);

 const completed=tasks.filter(t=>t.done).length;
 const filtered=tasks.filter(t=>t.title.toLowerCase().includes(query.toLowerCase()));
 const notify=(m)=>{setToast(m);setTimeout(()=>setToast(""),2200)};
 const addTask=()=>{
   if(!newTask.trim()) return;
   setTasks([{id:Date.now(),title:newTask,tag:"Personal",priority:"Medium",time:"Today · Flexible",done:false},...tasks]);
   setNewTask("");setShowAdd(false);notify("Task added to your day ✨");
 };
 const toggle=(id)=>setTasks(tasks.map(t=>t.id===id?{...t,done:!t.done}:t));

 const nav=["Overview","Tasks","Calendar","Finance","Vault","Reminders","Analytics"];
 return <div className={dark?"app":"app light"}>
   <aside className="sidebar">
     <div className="brand"><div className="logo"><Sparkles size={19}/></div><span>Life<span>OS</span></span></div>
     <div className="profile-mini"><div className="avatar">SV</div><div><b>Sai Vignesh</b><small>Personal workspace</small></div></div>
     <div className="nav">
       {nav.map((n,i)=><button className={page===n?"active":""} onClick={()=>setPage(n)} key={n}>
        {(() => {
  const Icon = [LayoutDashboard, CheckSquare, CalendarDays, WalletCards, Files, BellRing, BarChart3][i];
  return <Icon size={18} />;
})()}<span>{n}</span>{n==="Reminders"&&<em>3</em>}
       </button>)}
     </div>
     <div className="sidebar-bottom">
       <button className="ai-nav" onClick={()=>setAiOpen(true)}><Sparkles size={18}/><span>Ask LifeOS AI</span><kbd>⌘ K</kbd></button>
       <button className="theme" onClick={()=>setDark(!dark)}>{dark?<Sun size={17}/>:<Moon size={17}/>} {dark?"Light mode":"Dark mode"}</button>
     </div>
   </aside>

   <main className="main">
     <header className="topbar">
       <div className="mobile-brand"><Menu size={20}/><b>LifeOS</b></div>
       <div className="search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search your life..." /><kbd>⌘ K</kbd></div>
       <div className="top-actions"><button onClick={()=>notify("You're all caught up!")} className="icon-btn"><BellRing size={18}/><i/></button><div className="avatar">SV</div></div>
     </header>

     <section className="content">
       {page==="Overview" && <Overview tasks={filtered} completed={completed} onToggle={toggle} onAdd={()=>setShowAdd(true)} notify={notify} onAI={()=>setAiOpen(true)}/>}
       {page==="Tasks" && <Tasks tasks={filtered} onToggle={toggle} onAdd={()=>setShowAdd(true)} />}
       {page==="Calendar" && <Calendar notify={notify}/>}
       {page==="Finance" && <Finance notify={notify}/>}
       {page==="Vault" && <Vault notify={notify}/>}
       {page==="Reminders" && <Reminders notify={notify}/>}
       {page==="Analytics" && <Analytics completed={completed}/>}
     </section>
   </main>

   {showAdd && <div className="modal-wrap"><div className="modal">
     <button className="close" onClick={()=>setShowAdd(false)}><X size={18}/></button>
     <div className="eyebrow">QUICK CAPTURE</div><h2>Add a task</h2><p>Get it out of your head and into LifeOS.</p>
     <input autoFocus value={newTask} onChange={e=>setNewTask(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTask()} placeholder="What needs to get done?" />
     <button className="primary wide" onClick={addTask}><Plus size={17}/> Add to today</button>
   </div></div>}

   {aiOpen && <div className="ai-panel">
     <div className="ai-head"><div><Sparkles size={18}/><b>LifeOS AI</b></div><button onClick={()=>setAiOpen(false)}><X size={18}/></button></div>
     <div className="messages">{messages.map((m,i)=><div key={i} className={m.role==="ai"?"bubble ai":"bubble user"}>{m.text}</div>)}</div>
     <div className="ai-input"><input value={aiText} onChange={e=>setAiText(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&aiText.trim()){setMessages([...messages,{role:"user",text:aiText},{role:"ai",text:"I’d prioritize your two high-priority tasks first, then protect a 30-minute focus block. You’re at "+completed+"/"+tasks.length+" tasks complete today. 🚀"}]);setAiText("")}}} placeholder="Ask anything..." /><button onClick={()=>{if(aiText.trim()){setMessages([...messages,{role:"user",text:aiText},{role:"ai",text:"I’d prioritize your two high-priority tasks first, then protect a 30-minute focus block. You’re at "+completed+"/"+tasks.length+" tasks complete today. 🚀"}]);setAiText("")}}}><Send size={17}/></button></div>
   </div>}
   {toast&&<div className="toast"><CircleCheck size={17}/>{toast}</div>}
 </div>
}

function Header({eyebrow,title,sub,action}){return <div className="page-head"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{sub}</p></div>{action}</div>}

function Overview({tasks,completed,onToggle,onAdd,notify,onAI}){
 return <>
  <Header eyebrow="FRIDAY · 11 SEPTEMBER 2026" title="Good evening, Sai 👋" sub="Here’s your command center. Let’s make today count." action={<button className="primary" onClick={onAdd}><Plus size={17}/> Quick add</button>}/>
  <div className="hero-grid">
   <div className="focus-card"><div className="focus-top"><div><span className="pill purple"><Zap size={13}/> DAILY FOCUS</span><h2>Make progress, not pressure.</h2><p>You have <b>{tasks.filter(t=>!t.done).length} tasks</b> left. Protect your focus.</p></div><div className="ring"><strong>{Math.round(completed/Math.max(tasks.length,1)*100)}%</strong><small>done</small></div></div><div className="progress"><span style={{width:`${completed/Math.max(tasks.length,1)*100}%`}}/></div><div className="focus-bottom"><span><Clock3 size={15}/> 3h 20m planned</span><button onClick={onAI}>Plan my day <ArrowUpRight size={15}/></button></div></div>
   <div className="quote-card"><Sparkles size={20}/><div><b>Small wins compound.</b><p>“You don't need more time. You need more intention.”</p></div></div>
  </div>
  <div className="stats">
   <Stat icon={<CheckSquare/>} label="Open tasks" value={tasks.filter(t=>!t.done).length} delta="2 high priority" />
   <Stat icon={<WalletCards/>} label="Balance" value="₹33,580" delta="+8.4% this month" up/>
   <Stat icon={<CalendarDays/>} label="Upcoming" value="3" delta="Next: Project review" />
   <Stat icon={<Target/>} label="Focus streak" value="7 days" delta="Best: 12 days" up/>
  </div>
  <div className="two-col">
   <div className="panel"><div className="panel-head"><div><h3>Today's focus</h3><span>{completed} of {tasks.length} completed</span></div><button onClick={onAdd} className="ghost">+ Add</button></div>
    <div className="task-list">{tasks.slice(0,4).map(t=><TaskRow key={t.id} t={t} onToggle={onToggle}/>)}</div>
   </div>
   <div className="panel"><div className="panel-head"><div><h3>Spending snapshot</h3><span>September 2026</span></div><button className="ghost" onClick={()=>notify("Finance view opened")}>View all</button></div>
    <div className="money-total"><b>₹21,630</b><span><ArrowDownRight size={14}/> 12.6% vs last month</span></div>
    <div className="bars">{[42,62,38,74,51,84,58,66,48,76,63,72].map((h,i)=><span key={i} style={{height:h+"%"}}/>)}</div>
    <div className="legend"><span><i/> Daily average ₹721</span><span>Budget ₹30,000</span></div>
   </div>
  </div>
  <div className="panel upcoming"><div className="panel-head"><div><h3>Coming up</h3><span>Your next important moments</span></div><button className="ghost" onClick={onAI}>Ask AI</button></div>
   <div className="upcoming-grid"><Event date="12" month="SEP" title="Project review" meta="Tomorrow · 10:00 AM" color="purple"/><Event date="14" month="SEP" title="Subscription renewal" meta="Netflix · ₹649" color="orange"/><Event date="18" month="SEP" title="DBMS submission" meta="Deadline · 11:59 PM" color="red"/></div>
  </div>
 </>
}

function Stat({icon,label,value,delta,up}){return <div className="stat"><div className="stat-icon">{icon}</div><div><span>{label}</span><b>{value}</b><small className={up?"positive":""}>{up&&<TrendingUp size={12}/>} {delta}</small></div></div>}
function TaskRow({t,onToggle}){return <div className={"task-row "+(t.done?"done":"")}><button className="check" onClick={()=>onToggle(t.id)}>{t.done?<CircleCheck size={21}/>:<Circle size={21}/>}</button><div className="task-main"><b>{t.title}</b><span>{t.tag} · {t.time}</span></div><span className={"priority "+t.priority.toLowerCase()}>{t.priority}</span><button className="more"><MoreHorizontal size={17}/></button></div>}
function Event({date,month,title,meta,color}){return <div className="event"><div className={"date "+color}><b>{date}</b><small>{month}</small></div><div><b>{title}</b><span>{meta}</span></div><ChevronRight size={16}/></div>}

function Tasks({tasks,onToggle,onAdd}){return <><Header eyebrow="PRODUCTIVITY" title="Tasks" sub="Everything you need to move forward." action={<button className="primary" onClick={onAdd}><Plus size={17}/> New task</button>}/><div className="task-board panel"><div className="filters"><button className="selected">All</button><button>Today</button><button>Upcoming</button><button>Completed</button></div>{tasks.map(t=><TaskRow key={t.id} t={t} onToggle={onToggle}/>)}</div></>}
function Calendar({notify}){return <><Header eyebrow="PLANNING" title="Calendar" sub="See your commitments before they see you." action={<button className="primary" onClick={()=>notify("Event creator coming next")}> <Plus size={17}/> New event</button>}/><div className="calendar panel"><div className="week">{["MON","TUE","WED","THU","FRI","SAT","SUN"].map((d,i)=><div key={d} className={i===4?"today":""}><small>{d}</small><b>{7+i}</b></div>)}</div><div className="calendar-body"><div className="timecol">{["9 AM","10 AM","11 AM","12 PM","1 PM","2 PM","3 PM","4 PM"].map(x=><span key={x}>{x}</span>)}</div><div className="daygrid">{[0,1,2,3,4,5,6].map(d=><div className="daycol" key={d}>{d===4&&<><div className="cal-event purple" style={{top:70}}>Project review<br/><small>10:00 AM</small></div><div className="cal-event orange" style={{top:270}}>React practice<br/><small>2:00 PM</small></div></>}</div>)}</div></div></div></>}
function Finance({notify}){return <><Header eyebrow="MONEY" title="Finance" sub="Know where your money is going — without the spreadsheet headache." action={<button className="primary" onClick={()=>notify("Expense added")}> <Plus size={17}/> Add expense</button>}/><div className="finance-grid"><div className="balance-card"><span>AVAILABLE BALANCE</span><h2>₹33,580</h2><div><small>Monthly income</small><b>₹65,000</b></div><div><small>Spent this month</small><b>₹21,630</b></div></div><div className="panel"><div className="panel-head"><div><h3>Category breakdown</h3><span>₹21,630 spent</span></div><ReceiptText size={20}/></div>{expenses.map(e=><div className="expense" key={e.name}><span className="expense-icon">{e.icon}</span><div><b>{e.name}</b><small>{Math.round(e.amount/21630*100)}% of spending</small></div><strong>₹{e.amount.toLocaleString("en-IN")}</strong></div>)}</div></div></>}
function Vault({notify}){return <><Header eyebrow="SECURE VAULT" title="Documents" sub="Your important files, receipts and warranties — organized." action={<button className="primary" onClick={()=>notify("Upload dialog ready")}> <Plus size={17}/> Upload</button>}/><div className="vault-grid"><div className="vault-card"><ShieldCheck size={28}/><h3>Everything protected.</h3><p>Keep IDs, invoices and warranties organized with expiry dates and smart reminders.</p><button className="secondary" onClick={()=>notify("Vault is encrypted at rest")}>Security details</button></div>{["Passport.pdf","Laptop Invoice.pdf","Vehicle Insurance.pdf","College ID.png"].map((x,i)=><div className="doc panel" key={x}><div className="doc-icon"><Files size={21}/></div><b>{x}</b><span>{["PDF · 2.4 MB","PDF · 842 KB","PDF · 1.2 MB","PNG · 620 KB"][i]}</span><button onClick={()=>notify("Document preview opened")}><ArrowUpRight size={16}/></button></div>)}</div></>}
function Reminders({notify}){return <><Header eyebrow="ATTENTION" title="Reminders" sub="The things you should not have to remember."/><div className="reminder-list panel">{[["🔴","DBMS submission","18 Sep · 11:59 PM","2 days left"],["🟠","Netflix renewal","14 Sep · ₹649","3 days left"],["🟡","Laptop warranty","21 Oct · 1 year coverage","40 days left"],["🟢","Vehicle service","28 Sep · Routine service","17 days left"]].map(r=><div className="reminder" key={r[1]}><span className="dot">{r[0]}</span><div><b>{r[1]}</b><small>{r[2]}</small></div><span className="remaining">{r[3]}</span><button onClick={()=>notify("Reminder snoozed")}><Clock3 size={16}/></button></div>)}</div></>}
function Analytics({completed}){return <><Header eyebrow="INSIGHTS" title="Analytics" sub="Turn your everyday activity into useful patterns."/><div className="analytics-grid"><div className="panel big-chart"><div className="panel-head"><div><h3>Productivity pulse</h3><span>Last 7 days</span></div><span className="positive">+18.4%</span></div><div className="linechart"><svg viewBox="0 0 700 230" preserveAspectRatio="none"><polyline fill="none" stroke="currentColor" strokeWidth="4" points="0,180 100,150 200,168 300,105 400,130 500,75 600,92 700,35"/></svg><div className="chart-labels">{["Sat","Sun","Mon","Tue","Wed","Thu","Fri"].map(x=><span key={x}>{x}</span>)}</div></div></div><div className="panel insight"><Sparkles size={21}/><h3>Your best pattern</h3><p>You complete <b>42% more tasks</b> when you plan the night before.</p><button className="secondary">Build evening routine</button></div></div><div className="stats"><Stat icon={<CircleCheck/>} label="Tasks completed" value={completed+18} delta="+12% this week" up/><Stat icon={<Clock3/>} label="Focus time" value="14h 20m" delta="+2h 10m" up/><Stat icon={<WalletCards/>} label="Saved" value="₹4,280" delta="This month" up/></div></>}
const root=createRoot(document.getElementById("root"));root.render(<App/>);