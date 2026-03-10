import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

// ═══════════════════════════════════════════
// STATIC DATA
// ═══════════════════════════════════════════
const DOMAINS = ["القيادة الإدارية","الموارد البشرية","المالية والميزانية","الشؤون القانونية","الكفاءة التقنية","التحول الرقمي","المهارات الناعمة","العلاقات والبروتوكول","اللغة الإنجليزية","الإعلام والتواصل","السلامة وإدارة المخاطر","دعم العمليات"];
const DOMAIN_COLORS = {"القيادة الإدارية":"#2E6DA4","الموارد البشرية":"#217346","المالية والميزانية":"#C8973A","الشؤون القانونية":"#C65911","الكفاءة التقنية":"#1B3A6B","التحول الرقمي":"#7030A0","المهارات الناعمة":"#00B0F0","العلاقات والبروتوكول":"#FF6B6B","اللغة الإنجليزية":"#1B3A6B","الإعلام والتواصل":"#C8973A","السلامة وإدارة المخاطر":"#9C0006","دعم العمليات":"#C65911"};
const SUBTOPICS = {"اللغة الإنجليزية":["المراسلات الإنجليزية","الإنجليزية المحادثة","المصطلحات المالية","التقارير بالإنجليزية","العروض بالإنجليزية"],"القيادة الإدارية":["التخطيط الاستراتيجي","التخطيط التشغيلي","إدارة الفرق","صنع القرار","إدارة التغيير"],"المالية والميزانية":["إدارة التكاليف","إعداد الميزانية","المراجعة الداخلية","التقارير المالية","المشتريات","التدقيق المالي","المحاسبة","التمويل والاستثمار"],"المهارات الناعمة":["مهارات التواصل","مهارات العرض والتقديم","العمل الجماعي","إدارة الوقت","الكتابة الوظيفية"],"الشؤون القانونية":["صياغة العقود","التقاضي والنزاعات","السياسات والأنظمة","مكافحة الفساد","الحوكمة والامتثال"],"التحول الرقمي":["الذكاء الاصطناعي","Excel المتقدم","الأتمتة","إدارة الوثائق الرقمية","الأمن السيبراني"],"الإعلام والتواصل":["بروتوكول التواصل","إدارة الأزمات الإعلامية","الخطابة والتحدث العام","مقابلات الإعلام","إدارة الاجتماعات","الحضور الإعلامي","إنتاج المحتوى"],"العلاقات والبروتوكول":["بروتوكول العلاقات","التواصل الإعلامي","المراسلات الرسمية","إدارة أصحاب المصلحة"],"الكفاءة التقنية":["ضبط الجودة","إجراءات العمل","إدارة المشاريع","تحليل البيانات","مؤشرات الأداء"],"دعم العمليات":["تحسين العمليات","جودة الخدمة","إدارة الأصول","دعم تقنية المعلومات","المشتريات"],"السلامة وإدارة المخاطر":["إدارة الحوادث","الصحة والسلامة المهنية","تمارين الطوارئ","خطة الاستمرارية","إدارة المخاطر"],"الموارد البشرية":["تحفيز الموظفين","التوظيف والاختيار","إدارة الأداء","قانون العمل","إدارة الموظفين","إدارة النزاعات"]};
const PROGRAMS = {"اللغة الإنجليزية":{days:20,start:"2026-04-01",month:"أبريل",color:"#1B3A6B",cost:9000,method:"أونلاين + حضوري",provider:"مركز تدريب خارجي"},"القيادة الإدارية":{days:10,start:"2026-05-01",month:"مايو",color:"#2E6DA4",cost:15000,method:"مجموعات عمل",provider:"استشاري داخلي"},"المالية والميزانية":{days:8,start:"2026-06-01",month:"يونيو",color:"#C8973A",cost:12000,method:"حضوري",provider:"مركز تدريب خارجي"},"المهارات الناعمة":{days:5,start:"2026-07-01",month:"يوليو",color:"#217346",cost:8000,method:"هايبرد",provider:"استشاري داخلي"},"الشؤون القانونية":{days:6,start:"2026-08-01",month:"أغسطس",color:"#C65911",cost:12000,method:"حضوري",provider:"مركز قانوني متخصص"},"التحول الرقمي":{days:6,start:"2026-09-01",month:"سبتمبر",color:"#7030A0",cost:11000,method:"أونلاين",provider:"منصة إلكترونية"},"العلاقات والبروتوكول":{days:4,start:"2026-10-01",month:"أكتوبر",color:"#2E6DA4",cost:7000,method:"حضوري",provider:"معهد متخصص"},"الإعلام والتواصل":{days:4,start:"2026-11-01",month:"نوفمبر",color:"#C8973A",cost:9000,method:"مجموعات عمل",provider:"استشاري إعلامي"},"الكفاءة التقنية":{days:4,start:"2026-12-01",month:"ديسمبر",color:"#1B3A6B",cost:10000,method:"تدريب ميداني",provider:"استشاري تقني"},"الموارد البشرية":{days:4,start:"2027-01-01",month:"يناير 2027",color:"#217346",cost:10000,method:"هايبرد",provider:"استشاري HR"},"دعم العمليات":{days:3,start:"2027-02-01",month:"فبراير 2027",color:"#C65911",cost:8000,method:"مجموعات عمل",provider:"استشاري عمليات"},"السلامة وإدارة المخاطر":{days:3,start:"2027-03-01",month:"مارس 2027",color:"#9C0006",cost:8000,method:"حضوري",provider:"خبير سلامة معتمد"}};
const ANNUAL_PLAN = [
  {month:"أبريل",quarter:"Q2",domain:"اللغة الإنجليزية",priority:"حرج",participants:40,cost:9000,depts:"الشؤون القانونية | الشؤون المالية",status:"مخطط"},
  {month:"مايو",quarter:"Q2",domain:"القيادة الإدارية",priority:"حرج",participants:38,cost:15000,depts:"جميع الإدارات",status:"مخطط"},
  {month:"يونيو",quarter:"Q2",domain:"المالية والميزانية",priority:"حرج",participants:31,cost:12000,depts:"الشؤون المالية | الشؤون القانونية",status:"مخطط"},
  {month:"يوليو",quarter:"Q3",domain:"المهارات الناعمة",priority:"عالٍ",participants:28,cost:8000,depts:"جميع الإدارات",status:"مخطط"},
  {month:"أغسطس",quarter:"Q3",domain:"الشؤون القانونية",priority:"عالٍ",participants:20,cost:12000,depts:"الشؤون القانونية | الأمانة العامة",status:"مخطط"},
  {month:"سبتمبر",quarter:"Q3",domain:"التحول الرقمي",priority:"عالٍ",participants:18,cost:11000,depts:"تقنية المعلومات | الشؤون الإدارية",status:"مخطط"},
  {month:"أكتوبر",quarter:"Q4",domain:"العلاقات والبروتوكول",priority:"متوسط",participants:13,cost:7000,depts:"الأمانة العامة | الإعلام",status:"مخطط"},
  {month:"نوفمبر",quarter:"Q4",domain:"الإعلام والتواصل",priority:"متوسط",participants:16,cost:9000,depts:"الإعلام | الأمانة العامة",status:"مخطط"},
  {month:"ديسمبر",quarter:"Q4",domain:"الكفاءة التقنية",priority:"متوسط",participants:13,cost:10000,depts:"إدارة العمليات | تقنية المعلومات",status:"مخطط"},
  {month:"يناير 2027",quarter:"Q1",domain:"الموارد البشرية",priority:"منخفض",participants:9,cost:10000,depts:"الموارد البشرية | الشؤون الإدارية",status:"مخطط"},
  {month:"فبراير 2027",quarter:"Q1",domain:"دعم العمليات",priority:"منخفض",participants:10,cost:8000,depts:"إدارة العمليات | سلسلة التوريد",status:"مخطط"},
  {month:"مارس 2027",quarter:"Q1",domain:"السلامة وإدارة المخاطر",priority:"منخفض",participants:7,cost:8000,depts:"جميع الإدارات",status:"مخطط"},
];
const DEPT_LIST = ["الشؤون المالية","الموارد البشرية","الشؤون القانونية","تقنية المعلومات","العلاقات العامة","الشؤون الإدارية","التدقيق الداخلي","المشاريع والتطوير","الاستثمار","إدارة المخاطر","الأمانة العامة","إدارة العمليات"];
const RATE_DEFAULT = 35;
const gc = g => g>=1.5?"#ef4444":g>=0.75?"#f59e0b":"#22c55e";
const pc = p => p==="عالٍ"?{bg:"#450a0a",fg:"#fca5a5"}:p==="متوسط"?{bg:"#451a03",fg:"#fcd34d"}:{bg:"#052e16",fg:"#86efac"};
const stc = s => ({منجز:"#22c55e",جارٍ:"#f59e0b",ملغى:"#ef4444",مخطط:"#64748b",حرج:"#ef4444",عالٍ:"#f59e0b",متوسط:"#3b82f6",منخفض:"#22c55e"}[s]||"#64748b");

// ═══════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════
const S = {
  app:{fontFamily:"'Tajawal',sans-serif",direction:"rtl",background:"#080f1e",minHeight:"100vh",color:"#e2e8f0",fontSize:14},
  header:{background:"linear-gradient(135deg,#080f1e 0%,#0f2040 50%,#1B3A6B 100%)",borderBottom:"2px solid #C8973A",padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:50,boxShadow:"0 4px 30px rgba(0,0,0,.6)"},
  tabs:{background:"#080f1e",borderBottom:"1px solid #1e293b",display:"flex",overflowX:"auto",position:"sticky",top:61,zIndex:40},
  content:{padding:"22px",maxWidth:1600,margin:"0 auto"},
  card:{background:"linear-gradient(135deg,#0f172a,#1a2744)",borderRadius:14,border:"1px solid #1e3a5f",padding:18,boxShadow:"0 4px 20px rgba(0,0,0,.3)"},
  cardGold:{background:"linear-gradient(135deg,#1a1200,#2a1f00)",border:"1px solid #C8973A"},
  input:{background:"#080f1e",border:"1px solid #1e3a5f",color:"#e2e8f0",padding:"9px 13px",borderRadius:8,fontFamily:"inherit",fontSize:13,width:"100%",outline:"none"},
  select:{background:"#080f1e",border:"1px solid #1e3a5f",color:"#e2e8f0",padding:"8px 11px",borderRadius:8,fontFamily:"inherit",fontSize:13,cursor:"pointer",outline:"none"},
  btn:(bg,fg="#fff",p="9px 18px")=>({background:bg,color:fg,border:"none",padding:p,borderRadius:8,fontFamily:"inherit",fontWeight:700,fontSize:13,cursor:"pointer",whiteSpace:"nowrap",transition:"opacity .15s"}),
  badge:(bg,fg)=>({display:"inline-block",padding:"2px 9px",borderRadius:20,fontSize:11,fontWeight:700,background:bg,color:fg}),
  th:{padding:"10px 14px",textAlign:"right",color:"#93c5fd",fontWeight:700,whiteSpace:"nowrap",fontSize:12,background:"#0f2040"},
  td:{padding:"9px 14px",borderBottom:"1px solid #1e293b",fontSize:12},
  secTitle:{fontSize:15,fontWeight:900,color:"#C8973A",borderRight:"4px solid #C8973A",paddingRight:10,marginBottom:16},
  modal:{position:"fixed",inset:0,background:"rgba(0,0,0,.9)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16},
  modalBox:{background:"#0f172a",borderRadius:16,border:"1px solid #1e3a5f",maxWidth:640,width:"100%",maxHeight:"92vh",overflowY:"auto"},
};

async function logAction(uid,email,action,table,rid,old,nw){
  await supabase.from("audit_log").insert({user_id:uid,user_email:email,action,table_name:table,record_id:rid,old_data:old,new_data:nw});
}

// ═══════════════════════════════════════════
// CHART COMPONENTS
// ═══════════════════════════════════════════
function BarChart({data,height=110,showVal=true}){
  const max=Math.max(...data.map(d=>d.value),1);
  return(
    <div style={{display:"flex",alignItems:"flex-end",gap:3,height:height+30}}>
      {data.map((d,i)=>{
        const h=Math.max((d.value/max)*height,d.value>0?3:0);
        return(
          <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
            {showVal&&<div style={{fontSize:9,color:"#93c5fd",fontWeight:700,minHeight:11}}>{d.value>0?d.value:""}</div>}
            <div style={{width:"100%",height:h,background:d.color||"#C8973A",borderRadius:"3px 3px 0 0",minHeight:1,boxShadow:`0 0 8px ${d.color||"#C8973A"}44`}} title={`${d.label}: ${d.value}`}/>
            <div style={{fontSize:8,color:"#64748b",textAlign:"center",lineHeight:1.2,maxWidth:40,overflow:"hidden"}}>{d.label}</div>
          </div>
        );
      })}
    </div>
  );
}

function DonutChart({segments,size=110}){
  const total=segments.reduce((s,x)=>s+x.value,0)||1;
  let off=0;const r=36,circ=2*Math.PI*r;
  return(
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#1e293b" strokeWidth="14"/>
      {segments.map((seg,i)=>{
        const dash=(seg.value/total)*circ;
        const el=<circle key={i} cx="50" cy="50" r={r} fill="none" stroke={seg.color} strokeWidth="14" strokeDasharray={`${dash} ${circ-dash}`} strokeDashoffset={-off*circ} transform="rotate(-90 50 50)" style={{filter:`drop-shadow(0 0 4px ${seg.color}88)`}}/>;
        off+=seg.value/total;return el;
      })}
      <text x="50" y="54" textAnchor="middle" fill="#e2e8f0" fontSize="14" fontWeight="bold">{total}</text>
    </svg>
  );
}

// ═══════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════
function Toast({msg,type}){
  return <div style={{position:"fixed",top:72,left:"50%",transform:"translateX(-50%)",background:type==="error"?"#7f1d1d":"#14532d",border:`1px solid ${type==="error"?"#ef4444":"#22c55e"}`,color:"#fff",padding:"10px 24px",borderRadius:10,zIndex:999,fontWeight:700,fontSize:13,whiteSpace:"nowrap",boxShadow:"0 8px 32px rgba(0,0,0,.6)"}}>
    {msg}
  </div>;
}
function LoadingScreen(){
  return <div style={{...S.app,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{textAlign:"center",color:"#C8973A"}}><div style={{fontSize:48,marginBottom:12,animation:"spin 1s linear infinite"}}>⟳</div><div style={{fontWeight:900,fontSize:16}}>جاري التحميل...</div></div></div>;
}
function EmptyState({icon,text}){
  return <div style={{textAlign:"center",padding:60,color:"#64748b"}}><div style={{fontSize:40,marginBottom:12}}>{icon}</div><div style={{fontSize:14}}>{text}</div></div>;
}
function KPI({value,label,color,icon,sub}){
  return(
    <div style={{...S.card,borderTop:`3px solid ${color}`,textAlign:"center",padding:16,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:8,right:12,fontSize:22,opacity:.15}}>{icon}</div>
      <div style={{fontSize:20}}>{icon}</div>
      <div style={{fontSize:26,fontWeight:900,color,lineHeight:1.1,marginTop:4}}>{value}</div>
      <div style={{fontSize:10,color:"#64748b",marginTop:4,lineHeight:1.3}}>{label}</div>
      {sub&&<div style={{fontSize:10,color:color,marginTop:2,fontWeight:700}}>{sub}</div>}
    </div>
  );
}

// ═══════════════════════════════════════════
// LOGIN
// ═══════════════════════════════════════════
function LoginScreen({onLogin}){
  const [email,setEmail]=useState("");
  const [pw,setPw]=useState("");
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  const doLogin=async()=>{
    if(!email||!pw){setErr("أدخل الإيميل وكلمة السر");return;}
    setLoading(true);setErr("");
    const{data,error}=await supabase.auth.signInWithPassword({email,password:pw});
    if(error){setErr("إيميل أو كلمة سر غير صحيحة");setLoading(false);return;}
    onLogin(data.user);setLoading(false);
  };
  return(
    <div style={{...S.app,display:"flex",alignItems:"center",justifyContent:"center",background:"radial-gradient(ellipse at center,#0f2040 0%,#080f1e 70%)"}}>
      <div style={{background:"linear-gradient(135deg,#0f172a,#1a2744)",borderRadius:24,border:"1px solid #1e3a5f",padding:48,maxWidth:440,width:"100%",textAlign:"center",boxShadow:"0 30px 80px rgba(0,0,0,.7)"}}>
        <div style={{fontSize:60,marginBottom:10}}>🏛</div>
        <div style={{fontSize:24,fontWeight:900,color:"#C8973A",marginBottom:4}}>الصندوق السيادي السوري</div>
        <div style={{fontSize:12,color:"#64748b",marginBottom:4}}>Syrian Sovereign Fund</div>
        <div style={{fontSize:11,color:"#1e3a5f",marginBottom:36,padding:"6px 16px",background:"#0f172a",borderRadius:20,display:"inline-block",border:"1px solid #1e3a5f"}}>نظام إدارة الاحتياجات التدريبية 2026</div>
        <input style={{...S.input,marginBottom:12,direction:"ltr",textAlign:"left",padding:"11px 14px"}} type="email" placeholder="email@ssf.gov.sy" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()}/>
        <input style={{...S.input,marginBottom:16,direction:"ltr",textAlign:"left",padding:"11px 14px"}} type="password" placeholder="••••••••" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()}/>
        {err&&<div style={{color:"#fca5a5",fontSize:12,marginBottom:12,background:"#7f1d1d33",padding:"9px 14px",borderRadius:8,border:"1px solid #7f1d1d"}}>{err}</div>}
        <button style={{...S.btn("linear-gradient(135deg,#C8973A,#a07830)"),width:"100%",padding:14,fontSize:15,borderRadius:12,boxShadow:"0 4px 20px rgba(200,151,58,.4)"}} onClick={doLogin} disabled={loading}>
          {loading?"جاري الدخول...":"دخول →"}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// ANNUAL PLAN PAGE
// ═══════════════════════════════════════════
function AnnualPlanPage({employees,programs,attendance}){
  const [plan,setPlan]=useState(ANNUAL_PLAN.map(p=>({...p,days:PROGRAMS[p.domain]?.days||5})));
  const [rate,setRate]=useState(RATE_DEFAULT);
  const [view,setView]=useState("gantt");

  const totalCost=plan.reduce((s,p)=>s+p.cost,0);
  const totalDays=plan.reduce((s,p)=>s+p.days,0);
  const totalParticipants=plan.reduce((s,p)=>s+p.participants,0);
  const done=plan.filter(p=>p.status==="منجز").length;

  const updatePlan=(i,field,val)=>{
    setPlan(prev=>{const n=[...prev];n[i]={...n[i],[field]:field==="days"||field==="cost"||field==="participants"?+val:val};return n;});
  };

  const exportPlanCSV=()=>{
    const rows=[["الشهر","الربع","المجال التدريبي","الأولوية","الأيام","المشاركون","التكلفة","طريقة التدريب","الجهة المنفذة","الإدارات المستهدفة","الحالة"],...plan.map(p=>[p.month,p.quarter,p.domain,p.priority,p.days,p.participants,p.cost,PROGRAMS[p.domain]?.method||"",PROGRAMS[p.domain]?.provider||"",p.depts,p.status])];
    const blob=new Blob(["\uFEFF"+rows.map(r=>r.join(",")).join("\n")],{type:"text/csv;charset=utf-8"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="الخطة_السنوية_2026.csv";a.click();
  };

  const qColors={"Q2":"#C8973A","Q3":"#3b82f6","Q4":"#a78bfa","Q1":"#22c55e"};

  return(
    <div>
      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12,marginBottom:20}}>
        <KPI value={12} label="برنامج تدريبي" color="#C8973A" icon="📅" sub="أبريل 2026 — مارس 2027"/>
        <KPI value={totalDays} label="إجمالي أيام التدريب" color="#3b82f6" icon="📆"/>
        <KPI value={totalParticipants} label="إجمالي المشاركين" color="#22c55e" icon="👥"/>
        <KPI value={`$${(totalCost/1000).toFixed(0)}k`} label="إجمالي الميزانية" color="#C8973A" icon="💰"/>
        <KPI value={`${done}/12`} label="برامج منجزة" color="#22c55e" icon="✅"/>
        <KPI value={`$${rate}`} label="معدل اليوم" color="#a78bfa" icon="💵"/>
      </div>

      {/* Controls */}
      <div style={{...S.card,marginBottom:16,display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
        <div style={{display:"flex",gap:6}}>
          {["gantt","table","budget"].map(v=>(
            <button key={v} style={S.btn(view===v?"#C8973A":"#1e3a5f",view===v?"#fff":"#94a3b8","8px 14px")} onClick={()=>setView(v)}>
              {v==="gantt"?"📊 Gantt":v==="table"?"📋 جدول تفصيلي":"💰 ميزانية تفاعلية"}
            </button>
          ))}
        </div>
        <div style={{marginRight:"auto",display:"flex",gap:8,alignItems:"center"}}>
          <span style={{fontSize:11,color:"#64748b"}}>معدل اليوم $</span>
          <input type="number" min={10} max={200} value={rate} onChange={e=>setRate(+e.target.value)} style={{...S.input,width:70,padding:"5px 8px",fontSize:12}}/>
          <button style={S.btn("#217346","#fff","8px 14px")} onClick={exportPlanCSV}>📥 تصدير</button>
        </div>
      </div>

      {/* GANTT VIEW */}
      {view==="gantt"&&(
        <div style={S.card}>
          <div style={S.secTitle}>مخطط Gantt — الخطة التدريبية السنوية 2026-2027</div>
          <div style={{overflowX:"auto"}}>
            <div style={{minWidth:900}}>
              {/* Month headers */}
              <div style={{display:"flex",marginBottom:8,paddingRight:200}}>
                {plan.map((p,i)=>(
                  <div key={i} style={{flex:1,textAlign:"center",fontSize:10,color:"#93c5fd",fontWeight:700,padding:"4px 2px",background:qColors[p.quarter]+"22",borderRadius:4,margin:"0 1px"}}>
                    {p.month.replace(" 2027","*")}
                  </div>
                ))}
              </div>
              {/* Domain rows */}
              {plan.map((p,i)=>{
                const prog=PROGRAMS[p.domain];
                const sc=stc(p.status);
                return(
                  <div key={i} style={{display:"flex",alignItems:"center",marginBottom:6,gap:8}}>
                    <div style={{width:196,flexShrink:0,fontSize:11,fontWeight:700,color:"#e2e8f0",textAlign:"right",paddingLeft:8}}>{p.domain}</div>
                    {plan.map((_,j)=>(
                      <div key={j} style={{flex:1,height:32,borderRadius:4,margin:"0 1px",background:j===i?(prog?.color||"#C8973A")+"dd":"#1e293b",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:j===i?"#fff":"transparent",fontWeight:700,boxShadow:j===i?`0 0 10px ${prog?.color||"#C8973A"}66`:"none",border:j===i?"1px solid transparent":"1px solid #1e3a5f",cursor:j===i?"pointer":"default",position:"relative"}} title={j===i?`${p.domain} - ${p.days} أيام - ${p.participants} مشارك`:""}>
                        {j===i&&<><span style={{fontSize:9}}>{p.days}ي</span></>}
                      </div>
                    ))}
                    <div style={{width:80,flexShrink:0,fontSize:10,color:sc,fontWeight:700,paddingRight:8}}>{p.status}</div>
                  </div>
                );
              })}
              {/* Quarter summary */}
              <div style={{display:"flex",marginTop:12,paddingRight:200,borderTop:"1px solid #1e3a5f",paddingTop:8}}>
                {["Q2","Q3","Q4","Q1"].map(q=>{
                  const qPlan=plan.filter(p=>p.quarter===q);
                  const qCost=qPlan.reduce((s,p)=>s+p.cost,0);
                  return(
                    <div key={q} style={{flex:3,textAlign:"center",fontSize:10,background:qColors[q]+"22",borderRadius:6,margin:"0 2px",padding:"6px 4px",border:`1px solid ${qColors[q]}44`}}>
                      <div style={{fontWeight:900,color:qColors[q]}}>{q}</div>
                      <div style={{color:"#94a3b8"}}>{qPlan.length} برامج</div>
                      <div style={{color:"#C8973A",fontWeight:700}}>${qCost.toLocaleString()}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TABLE VIEW */}
      {view==="table"&&(
        <div style={S.card}>
          <div style={S.secTitle}>الجدول التفصيلي — قابل للتعديل</div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{background:"#0f2040"}}>
                {["الشهر","الربع","المجال","الأيام","المشاركون","التكلفة $","الطريقة","الجهة","الأولوية","الحالة"].map(h=><th key={h} style={S.th}>{h}</th>)}
              </tr></thead>
              <tbody>
                {plan.map((p,i)=>{
                  const prog=PROGRAMS[p.domain];
                  return(
                    <tr key={i} style={{background:i%2===0?"#080f1e":"#0f172a"}}>
                      <td style={S.td}><span style={{fontWeight:700,color:"#93c5fd"}}>{p.month}</span></td>
                      <td style={S.td}><span style={{...S.badge(qColors[p.quarter]+"33",qColors[p.quarter])}}>{p.quarter}</span></td>
                      <td style={S.td}><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:8,height:8,borderRadius:"50%",background:DOMAIN_COLORS[p.domain]||"#C8973A",flexShrink:0}}/><span style={{fontWeight:700}}>{p.domain}</span></div></td>
                      <td style={S.td}><input type="number" min={1} max={30} value={p.days} onChange={e=>updatePlan(i,"days",e.target.value)} style={{...S.input,width:55,padding:"4px 7px",fontSize:11,textAlign:"center"}}/></td>
                      <td style={S.td}><input type="number" min={1} value={p.participants} onChange={e=>updatePlan(i,"participants",e.target.value)} style={{...S.input,width:60,padding:"4px 7px",fontSize:11,textAlign:"center"}}/></td>
                      <td style={S.td}><input type="number" min={0} value={p.cost} onChange={e=>updatePlan(i,"cost",e.target.value)} style={{...S.input,width:80,padding:"4px 7px",fontSize:11,textAlign:"center"}}/></td>
                      <td style={S.td}><span style={{color:"#94a3b8",fontSize:11}}>{prog?.method}</span></td>
                      <td style={S.td}><span style={{color:"#64748b",fontSize:10}}>{prog?.provider}</span></td>
                      <td style={S.td}><span style={{color:stc(p.priority),fontWeight:700}}>{p.priority}</span></td>
                      <td style={S.td}>
                        <select style={{...S.select,fontSize:10,padding:"3px 6px",color:stc(p.status),border:`1px solid ${stc(p.status)}`,background:"transparent"}} value={p.status} onChange={e=>updatePlan(i,"status",e.target.value)}>
                          {["مخطط","جارٍ","منجز","ملغى"].map(s=><option key={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot><tr style={{background:"#0f2040",fontWeight:900}}>
                <td colSpan={3} style={{padding:"10px 14px",color:"#C8973A"}}>الإجمالي</td>
                <td style={{padding:"10px 14px",color:"#3b82f6"}}>{totalDays} يوم</td>
                <td style={{padding:"10px 14px",color:"#22c55e"}}>{totalParticipants}</td>
                <td style={{padding:"10px 14px",color:"#C8973A",fontSize:14}}>${totalCost.toLocaleString()}</td>
                <td colSpan={4}></td>
              </tr></tfoot>
            </table>
          </div>
        </div>
      )}

      {/* BUDGET VIEW */}
      {view==="budget"&&(
        <div>
          <div style={{...S.card,marginBottom:16}}>
            <div style={S.secTitle}>تحليل الميزانية التفاعلي</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:10,marginBottom:16}}>
              {[{l:"إجمالي التكلفة المباشرة",v:`$${totalCost.toLocaleString()}`,c:"#C8973A"},{l:"تكلفة لكل مشارك",v:`$${Math.round(totalCost/Math.max(totalParticipants,1)).toLocaleString()}`,c:"#3b82f6"},{l:"تكلفة اليوم الواحد",v:`$${rate}`,c:"#a78bfa"},{l:"إجمالي أيام التدريب",v:totalDays,c:"#22c55e"}].map((k,i)=>(
                <div key={i} style={{background:"#080f1e",borderRadius:10,padding:"12px 16px",border:`1px solid ${k.c}44`}}>
                  <div style={{fontSize:10,color:"#64748b",marginBottom:4}}>{k.l}</div>
                  <div style={{fontSize:20,fontWeight:900,color:k.c}}>{k.v}</div>
                </div>
              ))}
            </div>
            <BarChart data={plan.map(p=>({label:p.domain.substring(0,5),value:p.cost,color:DOMAIN_COLORS[p.domain]||"#C8973A"}))} height={130}/>
          </div>
          <div style={{overflowX:"auto",borderRadius:14,border:"1px solid #1e3a5f"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{background:"#0f2040"}}>{["المجال","الشهر","الأيام","المشاركون","التكلفة المباشرة","التكلفة بالمعدل","الفرق","النسبة"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
              <tbody>
                {plan.map((p,i)=>{
                  const rateCalc=p.days*p.participants*rate;
                  const diff=p.cost-rateCalc;
                  const pct=totalCost>0?(p.cost/totalCost*100).toFixed(1):0;
                  return(
                    <tr key={i} style={{background:i%2===0?"#080f1e":"#0f172a"}}>
                      <td style={S.td}><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:8,height:8,borderRadius:"50%",background:DOMAIN_COLORS[p.domain]||"#C8973A",flexShrink:0}}/><span style={{fontWeight:700}}>{p.domain}</span></div></td>
                      <td style={S.td}><span style={{color:"#93c5fd"}}>{p.month}</span></td>
                      <td style={S.td}><span style={{color:"#a78bfa"}}>{p.days}</span></td>
                      <td style={S.td}><span style={{color:"#3b82f6"}}>{p.participants}</span></td>
                      <td style={S.td}><span style={{fontWeight:900,color:"#C8973A"}}>${p.cost.toLocaleString()}</span></td>
                      <td style={S.td}><span style={{color:"#94a3b8"}}>${rateCalc.toLocaleString()}</span></td>
                      <td style={S.td}><span style={{color:diff>0?"#ef4444":"#22c55e",fontWeight:700}}>{diff>0?"+":""}{diff.toLocaleString()}</span></td>
                      <td style={S.td}>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <div style={{width:60,height:5,background:"#1e293b",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:"#C8973A",borderRadius:3}}/></div>
                          <span style={{fontSize:10,color:"#64748b"}}>{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// SUBTOPICS PAGE
// ═══════════════════════════════════════════
function SubtopicsPage({employees}){
  const [selDomain,setSelDomain]=useState(DOMAINS[0]);

  const domainEmployees=employees.filter(e=>e.needs?.[selDomain]&&e.needs[selDomain]!=="-");
  const topics=SUBTOPICS[selDomain]||[];
  const prog=PROGRAMS[selDomain];

  // Calc cross-domain
  const crossDomain=DOMAINS.map(d=>({
    domain:d,
    count:employees.filter(e=>e.needs?.[d]&&e.needs[d]!=="-").length,
    high:employees.filter(e=>e.needs?.[d]==="عالٍ").length,
    color:DOMAIN_COLORS[d]||"#C8973A"
  })).sort((a,b)=>b.count-a.count);

  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"260px 1fr",gap:16}}>
        {/* Domain list */}
        <div style={S.card}>
          <div style={S.secTitle}>المجالات التدريبية</div>
          {DOMAINS.map(d=>{
            const cnt=employees.filter(e=>e.needs?.[d]&&e.needs[d]!=="-").length;
            const high=employees.filter(e=>e.needs?.[d]==="عالٍ").length;
            const sel=selDomain===d;
            return(
              <div key={d} onClick={()=>setSelDomain(d)} style={{padding:"10px 12px",borderRadius:9,marginBottom:5,cursor:"pointer",background:sel?"#1e3a5f":"#080f1e",border:`1px solid ${sel?DOMAIN_COLORS[d]||"#C8973A":"#1e3a5f"}`,transition:"all .2s",boxShadow:sel?`0 0 12px ${DOMAIN_COLORS[d]||"#C8973A"}33`:"none"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{fontWeight:sel?900:600,fontSize:12,color:sel?"#e2e8f0":"#94a3b8"}}>{d}</div>
                  <div style={{display:"flex",gap:5}}>
                    <span style={{...S.badge("#1e3a5f","#3b82f6"),fontSize:9}}>{cnt}</span>
                    {high>0&&<span style={{...S.badge("#450a0a","#fca5a5"),fontSize:9}}>🔴{high}</span>}
                  </div>
                </div>
                {sel&&<div style={{fontSize:9,color:"#64748b",marginTop:3}}>{(SUBTOPICS[d]||[]).length} موضوع فرعي</div>}
              </div>
            );
          })}
        </div>

        {/* Domain detail */}
        <div>
          <div style={{...S.card,marginBottom:14,borderRight:`4px solid ${DOMAIN_COLORS[selDomain]||"#C8973A"}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14,flexWrap:"wrap",gap:10}}>
              <div>
                <div style={{fontSize:18,fontWeight:900,color:DOMAIN_COLORS[selDomain]||"#C8973A"}}>{selDomain}</div>
                <div style={{fontSize:11,color:"#64748b",marginTop:3}}>يبدأ {prog?.month} · {prog?.days} يوم · {prog?.method}</div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <div style={{background:"#1e3a5f",borderRadius:8,padding:"8px 14px",textAlign:"center"}}>
                  <div style={{fontWeight:900,color:"#3b82f6",fontSize:18}}>{domainEmployees.length}</div>
                  <div style={{fontSize:9,color:"#64748b"}}>موظف مسجل</div>
                </div>
                <div style={{background:"#1e3a5f",borderRadius:8,padding:"8px 14px",textAlign:"center"}}>
                  <div style={{fontWeight:900,color:"#C8973A",fontSize:18}}>${(prog?.cost||0).toLocaleString()}</div>
                  <div style={{fontSize:9,color:"#64748b"}}>تكلفة مخططة</div>
                </div>
              </div>
            </div>

            {/* Subtopics */}
            <div style={S.secTitle}>الموضوعات الفرعية ({topics.length})</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:8,marginBottom:14}}>
              {topics.map((t,i)=>(
                <div key={i} style={{background:"#080f1e",borderRadius:9,padding:"10px 14px",border:`1px solid ${DOMAIN_COLORS[selDomain]||"#C8973A"}33`,display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:DOMAIN_COLORS[selDomain]||"#C8973A",flexShrink:0,boxShadow:`0 0 6px ${DOMAIN_COLORS[selDomain]||"#C8973A"}`}}/>
                  <span style={{fontSize:12,fontWeight:600}}>{t}</span>
                </div>
              ))}
            </div>

            {/* Employees needing this domain */}
            <div style={S.secTitle}>الموظفون المسجلون ({domainEmployees.length})</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:7}}>
              {domainEmployees.map(e=>{
                const{bg,fg}=pc(e.needs[selDomain]);
                return(
                  <div key={e.id} style={{background:"#080f1e",borderRadius:8,padding:"8px 12px",border:"1px solid #1e3a5f",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontWeight:700,fontSize:12}}>{e.name}</div>
                      <div style={{fontSize:10,color:"#64748b"}}>{e.dept}</div>
                    </div>
                    <span style={S.badge(bg,fg)}>{e.needs[selDomain]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Cross domain overview */}
      <div style={{...S.card,marginTop:16}}>
        <div style={S.secTitle}>المقارنة الشاملة — جميع المجالات</div>
        <BarChart data={crossDomain.map(d=>({label:d.domain.substring(0,5),value:d.count,color:d.color}))} height={120}/>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// COMPREHENSIVE ANALYTICS
// ═══════════════════════════════════════════
function ComprehensiveAnalytics({employees,programs,attendance,certs,rate}){
  const [selDept,setSelDept]=useState("الكل");
  const [compare,setCompare]=useState(false);

  const depts=["الكل",...Array.from(new Set(employees.map(e=>e.dept))).sort()];
  const emps=selDept==="الكل"?employees:employees.filter(e=>e.dept===selDept);

  const stats=(es)=>{
    const total=es.length,high=es.filter(e=>e.priority==="عالٍ").length,mid=es.filter(e=>e.priority==="متوسط").length,low=es.filter(e=>e.priority==="منخفض").length;
    const avgGap=total?(es.reduce((s,e)=>s+(e.gap||0),0)/total):0;
    const needs=es.reduce((s,e)=>s+DOMAINS.filter(d=>e.needs?.[d]&&e.needs[d]!=="-").length,0);
    const budget=DOMAINS.reduce((s,d)=>s+es.filter(e=>e.needs?.[d]&&e.needs[d]!=="-").length*(PROGRAMS[d]?.days||0)*rate,0);
    const att=attendance.filter(a=>es.find(e=>e.id===a.employee_id)&&a.status==="حاضر").length;
    const cert=certs.filter(c=>es.find(e=>e.id===c.employee_id)).length;
    return{total,high,mid,low,avgGap,needs,budget,att,cert};
  };

  const st=stats(emps);
  const domData=DOMAINS.map(d=>({label:d.substring(0,5),fullLabel:d,value:emps.filter(e=>e.needs?.[d]&&e.needs[d]!=="-").length,high:emps.filter(e=>e.needs?.[d]==="عالٍ").length,color:DOMAIN_COLORS[d]||"#C8973A"})).sort((a,b)=>b.value-a.value);
  const allDepts=Array.from(new Set(employees.map(e=>e.dept))).sort();
  const deptCmp=allDepts.map(dept=>{const es=employees.filter(e=>e.dept===dept);return{dept,...stats(es)};}).sort((a,b)=>b.avgGap-a.avgGap);

  // Common needs across depts
  const commonNeeds=DOMAINS.map(d=>{
    const deptsWithNeed=allDepts.filter(dept=>employees.filter(e=>e.dept===dept&&e.needs?.[d]&&e.needs[d]!=="-").length>0);
    return{domain:d,depts:deptsWithNeed.length,employees:employees.filter(e=>e.needs?.[d]&&e.needs[d]!=="-").length,color:DOMAIN_COLORS[d]||"#C8973A"};
  }).sort((a,b)=>b.depts-a.depts);

  const exportCSV=()=>{
    const rows=[["الاسم","الإدارة","المسمى","الفجوة","الأولوية","الميزانية",...DOMAINS],...emps.map(e=>[e.name,e.dept,e.title,(e.gap||0).toFixed(2),e.priority,DOMAINS.reduce((s,d)=>s+(e.needs?.[d]&&e.needs[d]!=="-"?(PROGRAMS[d]?.days||0)*rate:0),0),...DOMAINS.map(d=>e.needs?.[d]||"-")])];
    const blob=new Blob(["\uFEFF"+rows.map(r=>r.join(",")).join("\n")],{type:"text/csv;charset=utf-8"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`تحليل_${selDept}.csv`;a.click();
  };

  const exportHTML=()=>{
    const html=`<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><title>تقرير ${selDept}</title><style>body{font-family:Arial,sans-serif;padding:30px;color:#1e293b;background:#f8fafc}h1{color:#1B3A6B;border-bottom:3px solid #C8973A;padding-bottom:10px}table{width:100%;border-collapse:collapse;margin:20px 0;font-size:12px}th{background:#1B3A6B;color:#fff;padding:9px;text-align:right}td{padding:8px;border-bottom:1px solid #e2e8f0}tr:nth-child(even){background:#f1f5f9}.kpi{display:inline-block;margin:8px;padding:14px 22px;border-radius:10px;border:2px solid #e2e8f0;text-align:center;min-width:120px}.kv{font-size:26px;font-weight:900;color:#1B3A6B}.kl{font-size:11px;color:#64748b}</style></head><body>
<h1>🏛 تقرير تحليلي — ${selDept}</h1><p style="color:#64748b">التاريخ: ${new Date().toLocaleDateString("ar-SY")} · إجمالي الموظفين: ${st.total}</p>
<div><div class="kpi"><div class="kv">${st.total}</div><div class="kl">الموظفون</div></div><div class="kpi"><div class="kv">${st.avgGap.toFixed(2)}</div><div class="kl">متوسط الفجوة</div></div><div class="kpi"><div class="kv">${st.high}</div><div class="kl">أولوية عالية</div></div><div class="kpi"><div class="kv">$${st.budget.toLocaleString()}</div><div class="kl">الميزانية</div></div></div>
<h2>الموظفون</h2><table><tr><th>#</th><th>الاسم</th><th>الإدارة</th><th>المسمى</th><th>الفجوة</th><th>الأولوية</th><th>المجالات</th><th>الميزانية</th></tr>
${emps.map((e,i)=>`<tr><td>${i+1}</td><td>${e.name}</td><td>${e.dept}</td><td>${e.title}</td><td>${(e.gap||0).toFixed(2)}</td><td>${e.priority}</td><td>${DOMAINS.filter(d=>e.needs?.[d]&&e.needs[d]!=="-").length}</td><td>$${DOMAINS.reduce((s,d)=>s+(e.needs?.[d]&&e.needs[d]!=="-"?(PROGRAMS[d]?.days||0)*rate:0),0).toLocaleString()}</td></tr>`).join("")}
</table></body></html>`;
    const blob=new Blob([html],{type:"text/html;charset=utf-8"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`تقرير_${selDept}.html`;a.click();
  };

  return(
    <div>
      {/* Controls */}
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
        <select style={{...S.select,minWidth:190}} value={selDept} onChange={e=>setSelDept(e.target.value)}>
          {depts.map(d=><option key={d}>{d}</option>)}
        </select>
        <button style={S.btn(compare?"#C8973A":"#1e3a5f","#e2e8f0","8px 14px")} onClick={()=>setCompare(!compare)}>
          {compare?"📊 تفاصيل الإدارة":"⚖️ مقارنة الإدارات"}
        </button>
        <button style={S.btn("#1e3a5f","#94a3b8","8px 14px")} onClick={()=>setSelDept("الكل")}>
          🌐 تحليل شامل
        </button>
        <div style={{marginRight:"auto",display:"flex",gap:8}}>
          <button style={S.btn("#217346","#fff","8px 14px")} onClick={exportCSV}>📥 Excel</button>
          <button style={S.btn("#1B3A6B","#fff","8px 14px")} onClick={exportHTML}>📄 تقرير</button>
        </div>
      </div>

      {!compare?(
        <div>
          {/* KPIs */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:11,marginBottom:16}}>
            <KPI value={st.total} label="الموظفون" color="#3b82f6" icon="👥"/>
            <KPI value={st.avgGap.toFixed(2)} label="متوسط الفجوة" color={gc(st.avgGap)} icon="📊"/>
            <KPI value={st.high} label="أولوية عالية" color="#ef4444" icon="🔴"/>
            <KPI value={st.mid} label="متوسطة" color="#f59e0b" icon="🟡"/>
            <KPI value={st.needs} label="إجمالي الاحتياجات" color="#a78bfa" icon="🎯"/>
            <KPI value={`$${(st.budget/1000).toFixed(1)}k`} label="الميزانية" color="#C8973A" icon="💰"/>
            <KPI value={st.att} label="حضر تدريباً" color="#22c55e" icon="✅"/>
            <KPI value={st.cert} label="شهادات" color="#f472b6" icon="🏆"/>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14,marginBottom:14}}>
            <div style={S.card}>
              <div style={S.secTitle}>الاحتياجات حسب المجال</div>
              <BarChart data={domData} height={110}/>
              <div style={{marginTop:10,display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
                {domData.filter(d=>d.value>0).slice(0,8).map(d=>(
                  <div key={d.fullLabel} style={{display:"flex",justifyContent:"space-between",background:"#080f1e",borderRadius:6,padding:"5px 9px",fontSize:11,border:`1px solid ${d.color}22`}}>
                    <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:6,height:6,borderRadius:"50%",background:d.color,flexShrink:0}}/><span style={{fontWeight:600}}>{d.fullLabel}</span></div>
                    <div style={{display:"flex",gap:5}}>
                      <span style={{color:"#3b82f6",fontWeight:700}}>{d.value}</span>
                      {d.high>0&&<span style={{color:"#ef4444"}}>🔴{d.high}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{...S.card,marginBottom:12}}>
                <div style={S.secTitle}>توزيع الأولويات</div>
                <div style={{display:"flex",justifyContent:"center",marginBottom:10}}><DonutChart segments={[{value:st.high,color:"#ef4444"},{value:st.mid,color:"#f59e0b"},{value:st.low,color:"#22c55e"}]}/></div>
                {[["عالٍ",st.high,"#ef4444"],["متوسط",st.mid,"#f59e0b"],["منخفض",st.low,"#22c55e"]].map(([l,v,c])=>(
                  <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #1e293b",fontSize:12}}>
                    <span style={{color:c,fontWeight:700}}>● {l}</span>
                    <span>{v} ({st.total>0?(v/st.total*100).toFixed(0):0}%)</span>
                  </div>
                ))}
              </div>
              {selDept==="الكل"&&(
                <div style={S.card}>
                  <div style={S.secTitle}>مشترك بين الإدارات</div>
                  {commonNeeds.slice(0,5).map(d=>(
                    <div key={d.domain} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #1e293b",fontSize:11}}>
                      <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:6,height:6,borderRadius:"50%",background:d.color,flexShrink:0}}/><span style={{fontWeight:600}}>{d.domain}</span></div>
                      <span style={{color:"#C8973A",fontWeight:700}}>{d.depts} إدارة</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Employee table */}
          <div style={S.card}>
            <div style={S.secTitle}>قائمة الموظفين ({emps.length})</div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr>{["#","الاسم","الإدارة","المسمى","الفجوة","الأولوية","المجالات","الميزانية","الحضور","الشهادات"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {emps.map((e,i)=>{
                    const n=DOMAINS.filter(d=>e.needs?.[d]&&e.needs[d]!=="-").length;
                    const b=DOMAINS.reduce((s,d)=>s+(e.needs?.[d]&&e.needs[d]!=="-"?(PROGRAMS[d]?.days||0)*rate:0),0);
                    const ac=attendance.filter(a=>a.employee_id===e.id&&a.status==="حاضر").length;
                    const cc=certs.filter(c=>c.employee_id===e.id).length;
                    const{bg,fg}=pc(e.priority);
                    return(
                      <tr key={e.id} style={{background:i%2===0?"#080f1e":"#0f172a"}}>
                        <td style={S.td}><span style={{color:"#64748b"}}>{i+1}</span></td>
                        <td style={S.td}><span style={{fontWeight:700}}>{e.name}</span></td>
                        <td style={S.td}><span style={{color:"#93c5fd"}}>{e.dept}</span></td>
                        <td style={S.td}>{e.title}</td>
                        <td style={S.td}><span style={{fontWeight:900,color:gc(e.gap||0)}}>{(e.gap||0).toFixed(2)}</span></td>
                        <td style={S.td}><span style={S.badge(bg,fg)}>{e.priority}</span></td>
                        <td style={S.td}><span style={{fontWeight:700,color:"#3b82f6"}}>{n}</span></td>
                        <td style={S.td}><span style={{fontWeight:700,color:"#22c55e"}}>${b.toLocaleString()}</span></td>
                        <td style={S.td}><span style={{color:"#C8973A"}}>{ac}</span></td>
                        <td style={S.td}><span style={{color:"#f472b6"}}>{cc}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ):(
        // COMPARE
        <div>
          <div style={{...S.card,marginBottom:14}}>
            <div style={S.secTitle}>مقارنة جميع الإدارات — اضغط لعرض تفاصيل</div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr>{["الإدارة","الموظفون","متوسط الفجوة","عالٍ","متوسط","منخفض","الاحتياجات","الميزانية","الشهادات"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {deptCmp.map((d,i)=>(
                    <tr key={d.dept} style={{background:i%2===0?"#080f1e":"#0f172a",cursor:"pointer"}} onClick={()=>{setSelDept(d.dept);setCompare(false);}}>
                      <td style={S.td}><span style={{fontWeight:700,color:"#C8973A"}}>{d.dept}</span></td>
                      <td style={S.td}><span style={{fontWeight:700,color:"#3b82f6"}}>{d.total}</span></td>
                      <td style={S.td}><span style={{fontWeight:900,color:gc(d.avgGap)}}>{d.avgGap.toFixed(2)}</span></td>
                      <td style={S.td}><span style={{color:"#ef4444",fontWeight:700}}>{d.high}</span></td>
                      <td style={S.td}><span style={{color:"#f59e0b",fontWeight:700}}>{d.mid}</span></td>
                      <td style={S.td}><span style={{color:"#22c55e",fontWeight:700}}>{d.low}</span></td>
                      <td style={S.td}><span style={{color:"#a78bfa"}}>{d.needs}</span></td>
                      <td style={S.td}><span style={{fontWeight:700,color:"#22c55e"}}>${d.budget.toLocaleString()}</span></td>
                      <td style={S.td}><span style={{color:"#f472b6"}}>{d.cert}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div style={S.card}><div style={S.secTitle}>متوسط الفجوة</div><BarChart data={deptCmp.map(d=>({label:d.dept.substring(0,5),value:parseFloat(d.avgGap.toFixed(2)),color:gc(d.avgGap)}))} height={110}/></div>
            <div style={S.card}><div style={S.secTitle}>الميزانية (ألف $)</div><BarChart data={deptCmp.map(d=>({label:d.dept.substring(0,5),value:Math.round(d.budget/1000),color:"#C8973A"}))} height={110}/></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════
function Dashboard({employees,programs,attendance,evaluations,certs,onNavigate}){
  const high=employees.filter(e=>e.priority==="عالٍ").length;
  const mid=employees.filter(e=>e.priority==="متوسط").length;
  const avgGap=employees.length?(employees.reduce((s,e)=>s+(e.gap||0),0)/employees.length).toFixed(2):0;
  const totalBudget=DOMAINS.reduce((s,d)=>s+employees.filter(e=>e.needs?.[d]&&e.needs[d]!=="-").length*(PROGRAMS[d]?.days||0)*RATE_DEFAULT,0);
  const topDomains=[...DOMAINS].sort((a,b)=>employees.filter(e=>e.needs?.[b]&&e.needs[b]!=="-").length-employees.filter(e=>e.needs?.[a]&&e.needs[a]!=="-").length);
  const doneCount=Object.values(programs).filter(p=>p.status==="منجز").length;
  const nextProgram=ANNUAL_PLAN[doneCount]||ANNUAL_PLAN[0];

  return(
    <div>
      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:13,marginBottom:20}}>
        <KPI value={employees.length} label="إجمالي الموظفين" color="#3b82f6" icon="👥" sub={`${high} أولوية عالية`}/>
        <KPI value={avgGap} label="متوسط الفجوة التدريبية" color={gc(parseFloat(avgGap))} icon="📊"/>
        <KPI value={high} label="أولوية عالية" color="#ef4444" icon="🔴" sub={`${(high/employees.length*100||0).toFixed(0)}% من المجموع`}/>
        <KPI value={12} label="برنامج تدريبي" color="#C8973A" icon="📅" sub="أبريل 2026 - مارس 2027"/>
        <KPI value={`${doneCount}/12`} label="برامج منجزة" color="#22c55e" icon="✅"/>
        <KPI value={certs.length} label="شهادات صادرة" color="#f472b6" icon="🏆"/>
        <KPI value={`$${(totalBudget/1000).toFixed(0)}k`} label="الميزانية المطلوبة" color="#C8973A" icon="💰"/>
        <KPI value={evaluations.length} label="تقييمات مكتملة" color="#a78bfa" icon="⭐"/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:16,marginBottom:16}}>
        {/* Main chart */}
        <div style={S.card}>
          <div style={S.secTitle}>أعلى الاحتياجات التدريبية</div>
          <BarChart data={topDomains.map(d=>({label:d.substring(0,5),value:employees.filter(e=>e.needs?.[d]&&e.needs[d]!=="-").length,color:DOMAIN_COLORS[d]||"#C8973A"}))} height={120}/>
          <div style={{marginTop:12,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:5}}>
            {topDomains.slice(0,6).map(d=>{
              const cnt=employees.filter(e=>e.needs?.[d]&&e.needs[d]!=="-").length;
              const high=employees.filter(e=>e.needs?.[d]==="عالٍ").length;
              return(
                <div key={d} style={{background:"#080f1e",borderRadius:7,padding:"6px 10px",fontSize:11,border:`1px solid ${DOMAIN_COLORS[d]||"#C8973A"}22`,cursor:"pointer"}} onClick={()=>onNavigate("subtopics")}>
                  <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}><div style={{width:6,height:6,borderRadius:"50%",background:DOMAIN_COLORS[d]||"#C8973A",flexShrink:0}}/><span style={{fontWeight:700,fontSize:10}}>{d}</span></div>
                  <div style={{display:"flex",gap:6}}><span style={{color:"#3b82f6",fontWeight:700}}>{cnt}</span>{high>0&&<span style={{color:"#ef4444",fontSize:10}}>🔴{high}</span>}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          {/* Priority donut */}
          <div style={{...S.card,marginBottom:12}}>
            <div style={S.secTitle}>الأولويات</div>
            <div style={{display:"flex",justifyContent:"center",marginBottom:10}}><DonutChart segments={[{value:high,color:"#ef4444"},{value:mid,color:"#f59e0b"},{value:employees.filter(e=>e.priority==="منخفض").length,color:"#22c55e"}]}/></div>
            {[["عالٍ",high,"#ef4444"],["متوسط",mid,"#f59e0b"],["منخفض",employees.filter(e=>e.priority==="منخفض").length,"#22c55e"]].map(([l,v,c])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #1e293b",fontSize:12}}>
                <span style={{color:c,fontWeight:700}}>● {l}</span>
                <span style={{color:"#94a3b8"}}>{v} ({employees.length>0?(v/employees.length*100).toFixed(0):0}%)</span>
              </div>
            ))}
          </div>

          {/* Next program */}
          <div style={{...S.card,...S.cardGold}}>
            <div style={{fontSize:11,color:"#C8973A",fontWeight:700,marginBottom:6}}>⏭ البرنامج القادم</div>
            <div style={{fontWeight:900,fontSize:14,marginBottom:4}}>{nextProgram?.domain}</div>
            <div style={{fontSize:11,color:"#94a3b8",marginBottom:8}}>{nextProgram?.month} · {PROGRAMS[nextProgram?.domain]?.days} أيام</div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11}}>
              <span style={{color:"#3b82f6"}}>{nextProgram?.participants} مشارك</span>
              <span style={{color:"#C8973A",fontWeight:700}}>${nextProgram?.cost?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12}}>
        {[
          {t:"تحليل الإدارات",d:"مقارنة تفصيلية + تصدير",i:"📊",tab:"analytics",c:"#1e3a5f"},
          {t:"الموضوعات الفرعية",d:"65 موضوع مفصّل",i:"🎯",tab:"subtopics",c:"#1e3a5f"},
          {t:"الخطة السنوية",d:"Gantt + جدول + ميزانية",i:"📅",tab:"annual",c:"#1e3a5f"},
          {t:"متابعة التدريب",d:"الحضور والتقييمات",i:"📋",tab:"tracking",c:"#1e3a5f"},
        ].map((a,i)=>(
          <div key={i} style={{...S.card,background:a.c,cursor:"pointer",transition:"all .2s",border:"1px solid #1e3a5f"}} onClick={()=>onNavigate(a.tab)}>
            <div style={{fontSize:24,marginBottom:6}}>{a.i}</div>
            <div style={{fontWeight:900,fontSize:13,marginBottom:3}}>{a.t}</div>
            <div style={{fontSize:11,color:"#64748b"}}>{a.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// MAIN ADMIN DASHBOARD
// ═══════════════════════════════════════════
function AdminDashboard({user,role,onLogout}){
  const [tab,setTab]=useState("dashboard");
  const [employees,setEmployees]=useState([]);
  const [programs,setPrograms]=useState({});
  const [attendance,setAttendance]=useState([]);
  const [evaluations,setEvaluations]=useState([]);
  const [certs,setCerts]=useState([]);
  const [auditLog,setAuditLog]=useState([]);
  const [loading,setLoading]=useState(true);
  const [rate,setRate]=useState(RATE_DEFAULT);
  const [empSearch,setEmpSearch]=useState("");
  const [empDept,setEmpDept]=useState("الكل");
  const [modalEmp,setModalEmp]=useState(null);
  const [modalMode,setModalMode]=useState("view");
  const [deleteConfirm,setDeleteConfirm]=useState(null);
  const [trackDomain,setTrackDomain]=useState(null);
  const [evalDomain,setEvalDomain]=useState(null);
  const [userModal,setUserModal]=useState(false);
  const [toast,setToast]=useState(null);

  useEffect(()=>{loadAll();},[]);
  const showToast=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};

  const loadAll=async()=>{
    setLoading(true);
    const[{data:e},{data:p},{data:a},{data:v},{data:c},{data:l}]=await Promise.all([
      supabase.from("employees").select("*").order("name"),
      supabase.from("training_programs").select("*"),
      supabase.from("attendance").select("*"),
      supabase.from("evaluations").select("*"),
      supabase.from("certificates").select("*"),
      role==="admin"?supabase.from("audit_log").select("*").order("created_at",{ascending:false}).limit(100):{data:[]},
    ]);
    setEmployees(e||[]);const pm={};(p||[]).forEach(x=>pm[x.domain]=x);setPrograms(pm);
    setAttendance(a||[]);setEvaluations(v||[]);setCerts(c||[]);setAuditLog(l||[]);setLoading(false);
  };

  const saveEmployee=async(emp)=>{
    if(emp.id){await supabase.from("employees").update(emp).eq("id",emp.id);await logAction(user.id,user.email,"تعديل موظف","employees",emp.id,null,emp);showToast("تم ✅");}
    else{const{data}=await supabase.from("employees").insert(emp).select().single();await logAction(user.id,user.email,"إضافة موظف","employees",data?.id,null,emp);showToast("أُضيف ✅");}
    setModalEmp(null);loadAll();
  };
  const deleteEmployee=async(id)=>{await supabase.from("employees").delete().eq("id",id);await logAction(user.id,user.email,"حذف موظف","employees",id,null,null);setDeleteConfirm(null);showToast("حُذف","error");loadAll();};
  const setStatus=async(domain,status)=>{const ex=programs[domain];if(ex)await supabase.from("training_programs").update({status,updated_by:user.id}).eq("domain",domain);else await supabase.from("training_programs").insert({domain,status,updated_by:user.id});loadAll();};
  const setAttVal=async(domain,empId,status)=>{const ex=attendance.find(a=>a.domain===domain&&a.employee_id===empId);if(ex)await supabase.from("attendance").update({status,updated_by:user.id}).eq("id",ex.id);else await supabase.from("attendance").insert({domain,employee_id:empId,status,updated_by:user.id});loadAll();};
  const setEvalVal=async(empId,domain,field,val)=>{const ex=evaluations.find(e=>e.employee_id===empId&&e.domain===domain);if(ex)await supabase.from("evaluations").update({[field]:val,evaluated_by:user.id}).eq("id",ex.id);else await supabase.from("evaluations").insert({employee_id:empId,domain,[field]:val,evaluated_by:user.id});loadAll();};
  const issueCert=async(empId,domain)=>{if(!certs.find(c=>c.employee_id===empId&&c.domain===domain)){await supabase.from("certificates").insert({employee_id:empId,domain,issued_by:user.id});showToast("شهادة 🏆");loadAll();}};

  const totalBudget=DOMAINS.reduce((s,d)=>s+employees.filter(e=>e.needs?.[d]&&e.needs[d]!=="-").length*(PROGRAMS[d]?.days||0)*rate,0);
  const depts=["الكل",...Array.from(new Set(employees.map(e=>e.dept))).sort()];
  const filtered=employees.filter(e=>(!empSearch||e.name.includes(empSearch)||e.dept.includes(empSearch))&&(empDept==="الكل"||e.dept===empDept));
  const sortedDoms=[...DOMAINS].sort((a,b)=>employees.filter(e=>e.needs?.[b]&&e.needs[b]!=="-").length-employees.filter(e=>e.needs?.[a]&&e.needs[a]!=="-").length);

  const TABS=[
    {id:"dashboard",l:"لوحة التحكم",i:"⊞"},
    {id:"analytics",l:"التحليل الشامل",i:"📊"},
    {id:"subtopics",l:"الموضوعات الفرعية",i:"🎯"},
    {id:"annual",l:"الخطة السنوية",i:"📅"},
    {id:"employees",l:"الموظفون",i:"👤"},
    {id:"tracking",l:"متابعة التدريب",i:"📋"},
    {id:"evaluations",l:"التقييمات",i:"⭐"},
    {id:"certificates",l:"الشهادات",i:"🏆"},
    ...(role==="admin"?[{id:"audit",l:"السجل",i:"📝"},{id:"users",l:"المستخدمون",i:"👥"}]:[]),
  ];

  if(loading)return<LoadingScreen/>;

  return(
    <div style={S.app}>
      {toast&&<Toast {...toast}/>}
      <div style={S.header}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{fontSize:32}}>🏛</div>
          <div>
            <div style={{fontSize:17,fontWeight:900,color:"#C8973A",letterSpacing:0.5}}>الصندوق السيادي السوري</div>
            <div style={{fontSize:10,color:"#64748b"}}>نظام إدارة التدريب 2026 · {role==="admin"?"مدير النظام":"موظف القسم"}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{...S.badge("#1e3a5f","#93c5fd"),border:"1px solid #1e3a5f",fontSize:11}}>{employees.length} موظف</span>
          <span style={{...S.badge("#1a1200","#C8973A"),border:"1px solid #C8973A44",fontSize:11}}>${(totalBudget/1000).toFixed(0)}k</span>
          <span style={{fontSize:10,color:"#64748b"}}>{user.email}</span>
          <button style={S.btn("#1e3a5f","#94a3b8","7px 13px")} onClick={onLogout}>خروج</button>
        </div>
      </div>
      <div style={S.tabs}>{TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"11px 16px",background:"transparent",border:"none",borderBottom:tab===t.id?"3px solid #C8973A":"3px solid transparent",color:tab===t.id?"#C8973A":"#64748b",fontFamily:"inherit",fontWeight:700,fontSize:12,cursor:"pointer",whiteSpace:"nowrap"}}>{t.i} {t.l}</button>)}</div>

      <div style={S.content}>
        {tab==="dashboard"&&<Dashboard employees={employees} programs={programs} attendance={attendance} evaluations={evaluations} certs={certs} onNavigate={setTab}/>}
        {tab==="analytics"&&<ComprehensiveAnalytics employees={employees} programs={programs} attendance={attendance} certs={certs} rate={rate}/>}
        {tab==="subtopics"&&<SubtopicsPage employees={employees}/>}
        {tab==="annual"&&<AnnualPlanPage employees={employees} programs={programs} attendance={attendance}/>}

        {tab==="employees"&&(
          <div>
            <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
              <input style={{...S.input,maxWidth:210}} placeholder="🔍 ابحث..." value={empSearch} onChange={e=>setEmpSearch(e.target.value)}/>
              <select style={S.select} value={empDept} onChange={e=>setEmpDept(e.target.value)}>{depts.map(d=><option key={d}>{d}</option>)}</select>
              <span style={{color:"#64748b",fontSize:12,marginRight:"auto"}}>{filtered.length} موظف</span>
              <button style={S.btn("#217346")} onClick={()=>{setModalEmp({name:"",title:"موظف",dept:DEPT_LIST[0],city:"دمشق",gap:0,priority:"منخفض",needs:Object.fromEntries(DOMAINS.map(d=>[d,"-"]))});setModalMode("new");}}>+ إضافة</button>
            </div>
            <div style={{overflowX:"auto",borderRadius:14,border:"1px solid #1e3a5f"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr>{["#","الاسم","الإدارة","المسمى","الفجوة","الأولوية","المجالات",""].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {filtered.map((e,i)=>{
                    const n=DOMAINS.filter(d=>e.needs?.[d]&&e.needs[d]!=="-").length;const{bg,fg}=pc(e.priority);
                    return(
                      <tr key={e.id} style={{background:i%2===0?"#080f1e":"#0f172a"}}>
                        <td style={S.td}><span style={{color:"#64748b"}}>{i+1}</span></td>
                        <td style={S.td}><span style={{fontWeight:700}}>{e.name}</span></td>
                        <td style={S.td}><span style={{color:"#93c5fd"}}>{e.dept}</span></td>
                        <td style={S.td}>{e.title}</td>
                        <td style={S.td}><span style={{fontWeight:900,color:gc(e.gap||0)}}>{(e.gap||0).toFixed(2)}</span></td>
                        <td style={S.td}><span style={S.badge(bg,fg)}>{e.priority}</span></td>
                        <td style={S.td}><span style={{fontWeight:700,color:"#3b82f6"}}>{n}</span></td>
                        <td style={S.td}><div style={{display:"flex",gap:4}}>
                          <button style={S.btn("#1e3a5f","#93c5fd","4px 9px")} onClick={()=>{setModalEmp(e);setModalMode("view");}}>عرض</button>
                          <button style={S.btn("#C8973A","#fff","4px 9px")} onClick={()=>{setModalEmp({...e});setModalMode("edit");}}>تعديل</button>
                          {role==="admin"&&<button style={S.btn("#7f1d1d","#fca5a5","4px 9px")} onClick={()=>setDeleteConfirm(e.id)}>حذف</button>}
                        </div></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab==="tracking"&&(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(265px,1fr))",gap:12}}>
            {sortedDoms.map(dom=>{
              const p=PROGRAMS[dom],st=programs[dom]?.status||"مخطط";
              const parts=employees.filter(e=>e.needs?.[dom]&&e.needs[dom]!=="-");
              const present=parts.filter(e=>attendance.find(a=>a.employee_id===e.id&&a.domain===dom&&a.status==="حاضر")).length;
              const isOpen=trackDomain===dom;
              const sc=stc(st);
              return(
                <div key={dom} style={{...S.card,borderRight:`4px solid ${p?.color||"#C8973A"}`,cursor:"pointer",boxShadow:isOpen?`0 0 20px ${p?.color||"#C8973A"}33`:"none"}} onClick={()=>setTrackDomain(isOpen?null:dom)}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                    <div><div style={{fontWeight:800,fontSize:13}}>{dom}</div><div style={{fontSize:10,color:"#64748b",marginTop:2}}>يبدأ {p?.month}</div></div>
                    <select style={{...S.select,fontSize:10,padding:"3px 6px",color:sc,border:`1px solid ${sc}`,background:"transparent"}} value={st} onChange={e=>{e.stopPropagation();setStatus(dom,e.target.value);}} onClick={e=>e.stopPropagation()}>
                      {["مخطط","جارٍ","منجز","ملغى"].map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div style={{display:"flex",gap:6,marginBottom:7}}>
                    {[{l:"مشارك",v:parts.length,c:"#3b82f6"},{l:"حضر",v:present,c:"#22c55e"},{l:"يوم",v:p?.days||0,c:"#a78bfa"}].map(s=>(
                      <div key={s.l} style={{flex:1,background:"#080f1e",borderRadius:6,padding:5,textAlign:"center"}}><div style={{fontWeight:900,color:s.c,fontSize:13}}>{s.v}</div><div style={{fontSize:9,color:"#64748b"}}>{s.l}</div></div>
                    ))}
                  </div>
                  <div style={{height:4,background:"#1e293b",borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${parts.length>0?present/parts.length*100:0}%`,background:"#22c55e",borderRadius:2,boxShadow:"0 0 6px #22c55e66"}}/></div>
                  {isOpen&&parts.length>0&&(
                    <div style={{marginTop:10,borderTop:"1px solid #1e3a5f",paddingTop:8}} onClick={e=>e.stopPropagation()}>
                      <div style={{fontSize:10,fontWeight:700,color:"#C8973A",marginBottom:6}}>كشف الحضور</div>
                      <div style={{maxHeight:200,overflowY:"auto"}}>
                        {parts.map(e=>{
                          const av=attendance.find(a=>a.employee_id===e.id&&a.domain===dom)?.status||"غائب";
                          return(
                            <div key={e.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0",borderBottom:"1px solid #080f1e",fontSize:11}}>
                              <span style={{fontWeight:600}}>{e.name}</span>
                              <select style={{...S.select,fontSize:10,padding:"2px 5px",background:av==="حاضر"?"#052e16":av==="غائب"?"#450a0a":"#451a03",color:av==="حاضر"?"#86efac":av==="غائب"?"#fca5a5":"#fcd34d"}} value={av} onChange={ev=>setAttVal(dom,e.id,ev.target.value)}>
                                <option>غائب</option><option>حاضر</option><option>معذور</option>
                              </select>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {tab==="evaluations"&&(
          <div>
            <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
              {sortedDoms.map(d=><button key={d} onClick={()=>setEvalDomain(d===evalDomain?null:d)} style={{...S.btn(evalDomain===d?"#C8973A":"#1e3a5f",evalDomain===d?"#fff":"#64748b","6px 12px"),border:evalDomain===d?"none":`1px solid #1e3a5f`}}>{d}</button>)}
            </div>
            {evalDomain&&(
              <div style={{overflowX:"auto",borderRadius:14,border:"1px solid #1e3a5f"}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead><tr>{["الموظف","الإدارة","الحضور","التقييم","ملاحظات","شهادة"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {employees.filter(e=>e.needs?.[evalDomain]&&e.needs[evalDomain]!=="-").map((e,i)=>{
                      const ev=evaluations.find(v=>v.employee_id===e.id&&v.domain===evalDomain);
                      const av=attendance.find(a=>a.employee_id===e.id&&a.domain===evalDomain);
                      const cert=certs.find(c=>c.employee_id===e.id&&c.domain===evalDomain);
                      return(
                        <tr key={e.id} style={{background:i%2===0?"#080f1e":"#0f172a"}}>
                          <td style={S.td}><span style={{fontWeight:700}}>{e.name}</span></td>
                          <td style={S.td}><span style={{color:"#93c5fd"}}>{e.dept}</span></td>
                          <td style={S.td}><span style={{color:av?.status==="حاضر"?"#22c55e":av?.status==="معذور"?"#f59e0b":"#ef4444",fontWeight:700}}>{av?.status||"غائب"}</span></td>
                          <td style={S.td}><div style={{display:"flex",gap:3}}>{[1,2,3,4,5].map(n=><button key={n} onClick={()=>setEvalVal(e.id,evalDomain,"score",n)} style={{width:24,height:24,borderRadius:5,border:"none",cursor:"pointer",fontWeight:700,fontSize:11,background:(ev?.score||0)>=n?"#C8973A":"#1e3a5f",color:(ev?.score||0)>=n?"#fff":"#64748b"}}>{n}</button>)}</div></td>
                          <td style={S.td}><input style={{...S.input,padding:"3px 8px",fontSize:10,width:120}} value={ev?.note||""} onChange={ev2=>setEvalVal(e.id,evalDomain,"note",ev2.target.value)} placeholder="ملاحظة..."/></td>
                          <td style={S.td}>
                            {cert?<span style={{...S.badge("#1a1200","#C8973A"),border:"1px solid #C8973A",fontSize:10}}>✅ صدرت</span>
                            :role==="admin"&&ev?.score>=3&&av?.status==="حاضر"?<button style={S.btn("#217346","#fff","4px 9px")} onClick={()=>issueCert(e.id,evalDomain)}>إصدار</button>
                            :<span style={{fontSize:10,color:"#64748b"}}>—</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            {!evalDomain&&<EmptyState icon="⭐" text="اختر مجالاً من الأزرار أعلاه"/>}
          </div>
        )}

        {tab==="certificates"&&(
          <div>
            <div style={{...S.card,marginBottom:14}}><div style={S.secTitle}>الشهادات الصادرة — {certs.length}</div></div>
            {certs.length===0?<EmptyState icon="🏆" text="لا توجد شهادات بعد"/>:(
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:12}}>
                {certs.map(cert=>{const emp=employees.find(e=>e.id===cert.employee_id);return(
                  <div key={cert.id} style={{background:"linear-gradient(135deg,#1a1200,#0f172a)",borderRadius:14,border:"1px solid #C8973A",padding:18,boxShadow:"0 4px 20px rgba(200,151,58,.2)"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div><div style={{fontSize:10,color:"#C8973A",marginBottom:3,fontWeight:700}}>شهادة إتمام تدريب</div><div style={{fontWeight:900,fontSize:14,color:"#e2e8f0"}}>{cert.domain}</div><div style={{fontWeight:700,marginTop:4,fontSize:13}}>{emp?.name}</div><div style={{fontSize:10,color:"#94a3b8"}}>{emp?.dept}</div></div>
                      <div style={{fontSize:36,filter:"drop-shadow(0 0 8px #C8973A44)"}}>📜</div>
                    </div>
                    <div style={{marginTop:10,borderTop:"1px solid #C8973A44",paddingTop:8,display:"flex",justifyContent:"space-between",fontSize:10,color:"#64748b"}}>
                      <span>{cert.cert_number}</span><span>{new Date(cert.issued_at).toLocaleDateString("ar-SY")}</span>
                    </div>
                  </div>
                );})}
              </div>
            )}
          </div>
        )}

        {tab==="audit"&&role==="admin"&&(
          <div>
            <div style={{...S.card,marginBottom:12}}><div style={S.secTitle}>سجل التغييرات — {auditLog.length}</div></div>
            <div style={{overflowX:"auto",borderRadius:14,border:"1px solid #1e3a5f"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr>{["التاريخ","المستخدم","العملية","الجدول","التفاصيل"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {auditLog.map((log,i)=>{
                    const ac=log.action.includes("حذف")?"#ef4444":log.action.includes("إضافة")?"#22c55e":"#C8973A";
                    return(
                      <tr key={log.id} style={{background:i%2===0?"#080f1e":"#0f172a"}}>
                        <td style={S.td}><span style={{fontSize:10,color:"#64748b"}}>{new Date(log.created_at).toLocaleString("ar-SY")}</span></td>
                        <td style={S.td}><span style={{fontSize:11,color:"#93c5fd"}}>{log.user_email}</span></td>
                        <td style={S.td}><span style={{color:ac,fontWeight:700}}>{log.action}</span></td>
                        <td style={S.td}><span style={{color:"#64748b"}}>{log.table_name}</span></td>
                        <td style={S.td}><span style={{fontSize:10,color:"#64748b"}}>{log.new_data?JSON.stringify(log.new_data).substring(0,60)+"...":"—"}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab==="users"&&role==="admin"&&(
          <div>
            <div style={{...S.card,marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={S.secTitle}>إدارة المستخدمين</div>
              <button style={S.btn("#217346")} onClick={()=>setUserModal(true)}>+ إضافة</button>
            </div>
            <div style={S.card}>
              {[["admin","مدير النظام","كل الصلاحيات","#ef4444"],["manager","مدير إدارة","إدارته فقط","#f59e0b"],["staff","موظف القسم","إضافة وتعديل","#3b82f6"],["employee","موظف","بياناته الشخصية","#22c55e"]].map(([r,n,d,c])=>(
                <div key={r} style={{display:"flex",gap:10,padding:"9px 0",borderBottom:"1px solid #1e293b",alignItems:"center"}}>
                  <span style={S.badge(c+"22",c)}>{r}</span>
                  <div><div style={{fontWeight:700,fontSize:12}}>{n}</div><div style={{fontSize:11,color:"#64748b"}}>{d}</div></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* EMP MODAL */}
      {modalEmp&&(
        <div style={S.modal} onClick={()=>setModalEmp(null)}>
          <div style={S.modalBox} onClick={e=>e.stopPropagation()}>
            <div style={{padding:"14px 18px",borderBottom:"1px solid #1e3a5f",fontWeight:900,display:"flex",justifyContent:"space-between",position:"sticky",top:0,background:"#0f172a",borderRadius:"16px 16px 0 0"}}>
              {modalMode==="new"?"➕ إضافة موظف":modalMode==="edit"?`✏️ ${modalEmp.name}`:`👤 ${modalEmp.name}`}
              <button style={S.btn("#1e3a5f","#94a3b8","3px 9px")} onClick={()=>setModalEmp(null)}>✕</button>
            </div>
            <div style={{padding:18}}>
              {modalMode==="view"?<EmpViewPanel emp={modalEmp} rate={rate}/>:<EmpFormPanel emp={modalEmp} onChange={setModalEmp} onSave={saveEmployee} onCancel={()=>setModalEmp(null)}/>}
            </div>
          </div>
        </div>
      )}
      {deleteConfirm&&(
        <div style={S.modal} onClick={()=>setDeleteConfirm(null)}>
          <div style={{...S.modalBox,maxWidth:320,textAlign:"center",padding:36}} onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:40,marginBottom:10}}>⚠️</div>
            <div style={{fontWeight:800,fontSize:15,marginBottom:6}}>حذف الموظف نهائياً؟</div>
            <div style={{color:"#94a3b8",fontSize:12,marginBottom:22}}>لا يمكن التراجع</div>
            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              <button style={S.btn("#1e3a5f","#94a3b8")} onClick={()=>setDeleteConfirm(null)}>إلغاء</button>
              <button style={S.btn("#7f1d1d","#fca5a5")} onClick={()=>deleteEmployee(deleteConfirm)}>حذف</button>
            </div>
          </div>
        </div>
      )}
      {userModal&&(
        <div style={S.modal} onClick={()=>setUserModal(false)}>
          <div style={S.modalBox} onClick={e=>e.stopPropagation()}>
            <div style={{padding:"14px 18px",borderBottom:"1px solid #1e3a5f",fontWeight:900,display:"flex",justifyContent:"space-between"}}>
              ➕ إضافة مستخدم<button style={S.btn("#1e3a5f","#94a3b8","3px 9px")} onClick={()=>setUserModal(false)}>✕</button>
            </div>
            <div style={{padding:18}}><AddUserForm employees={employees} user={user} onDone={()=>{setUserModal(false);showToast("تم ✅");}}/></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// EMP PANELS
// ═══════════════════════════════════════════
function EmpViewPanel({emp,rate}){
  const needs=DOMAINS.filter(d=>emp.needs?.[d]&&emp.needs[d]!=="-");
  const cost=needs.reduce((s,d)=>s+(PROGRAMS[d]?.days||0)*rate,0);
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
        {[["الإدارة",emp.dept],["المسمى",emp.title],["المدينة",emp.city],["الأولوية",emp.priority]].map(([l,v])=>(
          <div key={l} style={{background:"#080f1e",borderRadius:8,padding:"8px 12px"}}><div style={{fontSize:10,color:"#64748b",marginBottom:2}}>{l}</div><div style={{fontWeight:700}}>{v}</div></div>
        ))}
      </div>
      <div style={{fontWeight:700,color:"#C8973A",fontSize:12,marginBottom:8}}>الاحتياجات التدريبية ({needs.length})</div>
      {needs.map(d=>(
        <div key={d} style={{marginBottom:6}}>
          <div style={{display:"flex",justifyContent:"space-between",padding:"6px 10px",borderRadius:8,background:"#080f1e",fontSize:11,border:`1px solid ${DOMAIN_COLORS[d]||"#C8973A"}33`}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:6,height:6,borderRadius:"50%",background:DOMAIN_COLORS[d]||"#C8973A",flexShrink:0}}/><span style={{fontWeight:700}}>{d}</span></div>
            <div style={{display:"flex",gap:8}}>
              <span style={{color:"#64748b"}}>{PROGRAMS[d]?.days}ي</span>
              <span style={{fontWeight:700,color:"#C8973A"}}>${(PROGRAMS[d]?.days||0)*rate}</span>
              <span style={{color:emp.needs[d]==="عالٍ"?"#ef4444":emp.needs[d]==="متوسط"?"#f59e0b":"#22c55e",fontWeight:700}}>{emp.needs[d]}</span>
            </div>
          </div>
          <div style={{display:"flex",gap:4,padding:"4px 10px",flexWrap:"wrap"}}>
            {(SUBTOPICS[d]||[]).map(t=><span key={t} style={{fontSize:9,color:"#64748b",background:"#1e3a5f",borderRadius:10,padding:"2px 7px"}}>{t}</span>)}
          </div>
        </div>
      ))}
      <div style={{marginTop:10,background:"#080f1e",borderRadius:10,padding:"10px 14px",display:"flex",gap:18,border:"1px solid #1e3a5f"}}>
        <div><div style={{fontSize:10,color:"#64748b"}}>الفجوة</div><div style={{fontWeight:900,fontSize:18,color:gc(emp.gap||0)}}>{(emp.gap||0).toFixed(2)}</div></div>
        <div><div style={{fontSize:10,color:"#64748b"}}>التكلفة</div><div style={{fontWeight:900,fontSize:18,color:"#C8973A"}}>${cost.toLocaleString()}</div></div>
        <div><div style={{fontSize:10,color:"#64748b"}}>المجالات</div><div style={{fontWeight:900,fontSize:18,color:"#3b82f6"}}>{needs.length}</div></div>
      </div>
    </div>
  );
}

function EmpFormPanel({emp,onChange,onSave,onCancel,lockDept}){
  const upd=(k,v)=>onChange(e=>({...e,[k]:v}));
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
        <div><div style={{fontSize:11,color:"#94a3b8",marginBottom:3}}>الاسم</div><input style={S.input} value={emp.name||""} onChange={e=>upd("name",e.target.value)}/></div>
        <div><div style={{fontSize:11,color:"#94a3b8",marginBottom:3}}>الإدارة</div>
          {lockDept?<input style={{...S.input,opacity:0.6}} value={lockDept} readOnly/>:
          <select style={S.select} value={emp.dept||""} onChange={e=>upd("dept",e.target.value)}>{DEPT_LIST.map(d=><option key={d}>{d}</option>)}</select>}
        </div>
        <div><div style={{fontSize:11,color:"#94a3b8",marginBottom:3}}>المدينة</div><input style={S.input} value={emp.city||""} onChange={e=>upd("city",e.target.value)}/></div>
        <div><div style={{fontSize:11,color:"#94a3b8",marginBottom:3}}>المسمى</div>
          <select style={S.select} value={emp.title||"موظف"} onChange={e=>upd("title",e.target.value)}>
            <option>موظف</option><option>رئيس قسم</option><option>مدير</option>
          </select>
        </div>
        <div><div style={{fontSize:11,color:"#94a3b8",marginBottom:3}}>الفجوة (0–2)</div>
          <input style={S.input} type="number" min={0} max={2} step={0.1} value={emp.gap||0} onChange={e=>{const g=+e.target.value;upd("gap",g);upd("priority",g>=1.5?"عالٍ":g>=0.75?"متوسط":"منخفض");}}/>
        </div>
        <div><div style={{fontSize:11,color:"#94a3b8",marginBottom:3}}>الأولوية</div>
          <input style={{...S.input,color:gc(emp.gap||0),fontWeight:700}} value={emp.priority||"منخفض"} readOnly/>
        </div>
      </div>
      <div style={{fontSize:11,fontWeight:700,color:"#C8973A",marginBottom:8}}>الاحتياجات التدريبية</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,marginBottom:14}}>
        {DOMAINS.map(d=>(
          <div key={d} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#080f1e",borderRadius:7,padding:"5px 10px",border:`1px solid ${DOMAIN_COLORS[d]||"#1e3a5f"}33`}}>
            <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:5,height:5,borderRadius:"50%",background:DOMAIN_COLORS[d]||"#C8973A",flexShrink:0}}/><span style={{fontSize:11,fontWeight:600}}>{d}</span></div>
            <select style={{...S.select,fontSize:10,padding:"2px 5px",width:80}} value={emp.needs?.[d]||"-"} onChange={e=>upd("needs",{...emp.needs,[d]:e.target.value})}>
              <option>-</option><option>منخفض</option><option>متوسط</option><option>عالٍ</option>
            </select>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:9,justifyContent:"flex-end"}}>
        <button style={S.btn("#1e3a5f","#94a3b8")} onClick={onCancel}>إلغاء</button>
        <button style={S.btn("#217346")} onClick={()=>onSave(emp)}>💾 حفظ</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// ADD USER FORM
// ═══════════════════════════════════════════
function AddUserForm({employees,user,onDone}){
  const [email,setEmail]=useState("");const[pw,setPw]=useState("");const[role,setRole]=useState("employee");const[empId,setEmpId]=useState("");const[dept,setDept]=useState(DEPT_LIST[0]);const[loading,setLoading]=useState(false);const[err,setErr]=useState("");
  const handleAdd=async()=>{
    if(!email||!pw){setErr("أدخل الإيميل وكلمة السر");return;}
    setLoading(true);setErr("");
    const{data,error}=await supabase.auth.admin.createUser({email,password:pw,email_confirm:true});
    if(error){setErr("خطأ: "+error.message);setLoading(false);return;}
    const nid=data.user.id;
    await supabase.from("user_roles").insert({user_id:nid,role});
    if(role==="manager") await supabase.from("manager_depts").insert({user_id:nid,dept});
    if(empId) await supabase.from("employees").update({user_id:nid}).eq("id",empId);
    setLoading(false);onDone();
  };
  return(
    <div>
      <div style={{marginBottom:9}}><div style={{fontSize:11,color:"#94a3b8",marginBottom:3}}>الإيميل</div><input style={{...S.input,direction:"ltr",textAlign:"left"}} type="email" value={email} onChange={e=>setEmail(e.target.value)}/></div>
      <div style={{marginBottom:9}}><div style={{fontSize:11,color:"#94a3b8",marginBottom:3}}>كلمة السر</div><input style={{...S.input,direction:"ltr",textAlign:"left"}} type="password" value={pw} onChange={e=>setPw(e.target.value)}/></div>
      <div style={{marginBottom:9}}><div style={{fontSize:11,color:"#94a3b8",marginBottom:3}}>الدور</div><select style={S.select} value={role} onChange={e=>setRole(e.target.value)}><option value="employee">موظف</option><option value="manager">مدير إدارة</option><option value="staff">موظف قسم</option><option value="admin">مدير النظام</option></select></div>
      {role==="manager"&&<div style={{marginBottom:9}}><div style={{fontSize:11,color:"#94a3b8",marginBottom:3}}>الإدارة</div><select style={S.select} value={dept} onChange={e=>setDept(e.target.value)}>{DEPT_LIST.map(d=><option key={d}>{d}</option>)}</select></div>}
      {role==="employee"&&<div style={{marginBottom:9}}><div style={{fontSize:11,color:"#94a3b8",marginBottom:3}}>ربط بموظف</div><select style={S.select} value={empId} onChange={e=>setEmpId(e.target.value)}><option value="">— اختر —</option>{employees.map(e=><option key={e.id} value={e.id}>{e.name} — {e.dept}</option>)}</select></div>}
      {err&&<div style={{color:"#fca5a5",fontSize:12,marginBottom:8,padding:"6px 10px",background:"#7f1d1d22",borderRadius:6}}>{err}</div>}
      <div style={{display:"flex",justifyContent:"flex-end",marginTop:14}}><button style={{...S.btn("#217346"),opacity:loading?0.7:1}} disabled={loading} onClick={handleAdd}>{loading?"جاري...":"إضافة ✅"}</button></div>
    </div>
  );
}

// ═══════════════════════════════════════════
// EMPLOYEE PORTAL (simplified)
// ═══════════════════════════════════════════
function EmployeePortal({user,onLogout}){
  const [emp,setEmp]=useState(null);const[att,setAtt]=useState([]);const[evs,setEvs]=useState([]);const[ces,setCes]=useState([]);const[tab,setTab]=useState("home");const[loading,setLoading]=useState(true);
  useEffect(()=>{loadData();},[]);
  const loadData=async()=>{
    setLoading(true);
    const{data:e}=await supabase.from("employees").select("*").eq("user_id",user.id).single();
    if(e){setEmp(e);const[{data:a},{data:v},{data:c}]=await Promise.all([supabase.from("attendance").select("*").eq("employee_id",e.id),supabase.from("evaluations").select("*").eq("employee_id",e.id),supabase.from("certificates").select("*").eq("employee_id",e.id)]);setAtt(a||[]);setEvs(v||[]);setCes(c||[]);}
    setLoading(false);
  };
  if(loading)return<LoadingScreen/>;
  if(!emp)return<div style={{...S.app,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{...S.card,textAlign:"center",padding:40,maxWidth:320}}><div style={{fontSize:36,marginBottom:10}}>⚠️</div><div style={{fontWeight:800,marginBottom:6}}>الحساب غير مرتبط بملف موظف</div><div style={{fontSize:12,color:"#64748b",marginBottom:18}}>تواصل مع مدير النظام</div><button style={S.btn("#1e3a5f","#94a3b8")} onClick={onLogout}>خروج</button></div></div>;
  const myDoms=DOMAINS.filter(d=>emp.needs?.[d]&&emp.needs[d]!=="-");
  return(
    <div style={S.app}>
      <div style={S.header}>
        <div><div style={{fontSize:16,fontWeight:900,color:"#C8973A"}}>🏛 مرحباً، {emp.name}</div><div style={{fontSize:11,color:"#64748b"}}>{emp.dept} · {emp.title}</div></div>
        <button style={S.btn("#1e3a5f","#94a3b8","7px 14px")} onClick={onLogout}>خروج</button>
      </div>
      <div style={S.tabs}>{[{id:"home",l:"الرئيسية",i:"🏠"},{id:"training",l:"تدريباتي",i:"📚"},{id:"certs",l:"شهاداتي",i:"🏆"}].map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"11px 16px",background:"transparent",border:"none",borderBottom:tab===t.id?"3px solid #C8973A":"3px solid transparent",color:tab===t.id?"#C8973A":"#64748b",fontFamily:"inherit",fontWeight:700,fontSize:12,cursor:"pointer",whiteSpace:"nowrap"}}>{t.i} {t.l}</button>)}</div>
      <div style={S.content}>
        {tab==="home"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:11,marginBottom:16}}>
              <KPI value={myDoms.length} label="مجالات مطلوبة" color="#3b82f6" icon="📊"/>
              <KPI value={att.filter(a=>a.status==="حاضر").length} label="حضرت" color="#22c55e" icon="✅"/>
              <KPI value={evs.length} label="تقييمات" color="#C8973A" icon="⭐"/>
              <KPI value={ces.length} label="شهادات" color="#f472b6" icon="🏆"/>
            </div>
            <div style={S.card}>
              <div style={S.secTitle}>احتياجاتي التدريبية</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:7}}>
                {DOMAINS.map(d=>{const v=emp.needs?.[d]||"-";const{bg,fg}=v==="-"?{bg:"#1e3a5f",fg:"#64748b"}:pc(v);return(
                  <div key={d} style={{background:"#080f1e",borderRadius:8,padding:"8px 12px",border:`1px solid ${v==="-"?"#1e3a5f":DOMAIN_COLORS[d]||"#C8973A"}33`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div><div style={{fontSize:11,fontWeight:600,color:v==="-"?"#64748b":"#e2e8f0"}}>{d}</div>{v!=="-"&&<div style={{fontSize:9,color:"#64748b",marginTop:2}}>{(SUBTOPICS[d]||[]).join(" · ").substring(0,40)}</div>}</div>
                    <span style={S.badge(bg,fg)}>{v}</span>
                  </div>
                );})}
              </div>
            </div>
          </div>
        )}
        {tab==="training"&&(
          <div>
            {myDoms.map(domain=>{
              const a=att.find(a=>a.domain===domain),ev=evs.find(e=>e.domain===domain),p=PROGRAMS[domain];
              return(
                <div key={domain} style={{...S.card,marginBottom:10,borderRight:`4px solid ${p?.color||"#C8973A"}`,boxShadow:`0 0 12px ${p?.color||"#C8973A"}22`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:7}}>
                    <div><div style={{fontWeight:800,fontSize:13}}>{domain}</div><div style={{fontSize:10,color:"#64748b",marginTop:2}}>{p?.month} · {p?.days} يوم · {p?.method}</div></div>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}><span style={S.badge(a?.status==="حاضر"?"#052e16":"#450a0a",a?.status==="حاضر"?"#86efac":"#fca5a5")}>{a?.status||"غائب"}</span>{ev&&<span style={{...S.badge("#1a1200","#C8973A"),border:"1px solid #C8973A"}}>⭐{ev.score}/5</span>}</div>
                  </div>
                  <div style={{marginTop:8,display:"flex",gap:4,flexWrap:"wrap"}}>
                    {(SUBTOPICS[domain]||[]).map(t=><span key={t} style={{fontSize:9,color:"#64748b",background:"#1e3a5f",borderRadius:10,padding:"2px 8px"}}>{t}</span>)}
                  </div>
                </div>
              );
            })}
            {myDoms.length===0&&<EmptyState icon="📚" text="لا توجد تدريبات مخصصة لك"/>}
          </div>
        )}
        {tab==="certs"&&(ces.length===0?<EmptyState icon="🏆" text="لا توجد شهادات بعد"/>:ces.map(cert=>(
          <div key={cert.id} style={{background:"linear-gradient(135deg,#1a1200,#0f172a)",borderRadius:14,border:"1px solid #C8973A",padding:18,marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{fontWeight:900,fontSize:13,color:"#C8973A"}}>{cert.domain}</div><div style={{fontSize:10,color:"#64748b",marginTop:2}}>{cert.cert_number} · {new Date(cert.issued_at).toLocaleDateString("ar-SY")}</div></div><div style={{fontSize:32}}>📜</div></div>
          </div>
        )))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════
export default function App(){
  const [user,setUser]=useState(null);const[role,setRole]=useState(null);const[managerDept,setManagerDept]=useState(null);const[loading,setLoading]=useState(true);
  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{if(session?.user)loadRole(session.user);else setLoading(false);});
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>{if(session?.user)loadRole(session.user);else{setUser(null);setRole(null);setManagerDept(null);setLoading(false);}});
    return()=>subscription.unsubscribe();
  },[]);
  const loadRole=async(u)=>{
    const[{data:rd},{data:dd}]=await Promise.all([supabase.from("user_roles").select("role").eq("user_id",u.id).single(),supabase.from("manager_depts").select("dept").eq("user_id",u.id).single()]);
    setUser(u);setRole(rd?.role||"employee");setManagerDept(dd?.dept||null);setLoading(false);
  };
  const handleLogout=async()=>{await supabase.auth.signOut();setUser(null);setRole(null);setManagerDept(null);};
  if(loading)return<LoadingScreen/>;
  if(!user)return<LoginScreen onLogin={loadRole}/>;
  if(role==="employee")return<EmployeePortal user={user} onLogout={handleLogout}/>;
  return<AdminDashboard user={user} role={role} onLogout={handleLogout}/>;
}
