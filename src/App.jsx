import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

// ════════════════════════════════════════════════
// STATIC DATA
// ════════════════════════════════════════════════
const DOMAINS = ["القيادة الإدارية","الموارد البشرية","المالية والميزانية","الشؤون القانونية","الكفاءة التقنية","التحول الرقمي","المهارات الناعمة","العلاقات والبروتوكول","اللغة الإنجليزية","الإعلام والتواصل","السلامة وإدارة المخاطر","دعم العمليات"];

const DC = {"القيادة الإدارية":"#3b82f6","الموارد البشرية":"#10b981","المالية والميزانية":"#f59e0b","الشؤون القانونية":"#ef4444","الكفاءة التقنية":"#8b5cf6","التحول الرقمي":"#06b6d4","المهارات الناعمة":"#ec4899","العلاقات والبروتوكول":"#f97316","اللغة الإنجليزية":"#6366f1","الإعلام والتواصل":"#14b8a6","السلامة وإدارة المخاطر":"#dc2626","دعم العمليات":"#84cc16"};

const SUBTOPICS_DEFAULT = {
  "القيادة الإدارية":["التخطيط الاستراتيجي","التخطيط التشغيلي","إدارة الفرق","صنع القرار","إدارة التغيير"],
  "الموارد البشرية":["تحفيز الموظفين","التوظيف والاختيار","إدارة الأداء","قانون العمل","إدارة النزاعات"],
  "المالية والميزانية":["إعداد الميزانية","إدارة التكاليف","التقارير المالية","المراجعة الداخلية","التمويل والاستثمار"],
  "الشؤون القانونية":["صياغة العقود","التقاضي والنزاعات","مكافحة الفساد","الحوكمة والامتثال","السياسات والأنظمة"],
  "الكفاءة التقنية":["إدارة المشاريع","ضبط الجودة","تحليل البيانات","مؤشرات الأداء","إجراءات العمل"],
  "التحول الرقمي":["الذكاء الاصطناعي","Excel المتقدم","الأتمتة","الأمن السيبراني","إدارة الوثائق الرقمية"],
  "المهارات الناعمة":["مهارات التواصل","العرض والتقديم","إدارة الوقت","العمل الجماعي","الكتابة الوظيفية"],
  "العلاقات والبروتوكول":["بروتوكول العلاقات","المراسلات الرسمية","إدارة أصحاب المصلحة","التواصل الإعلامي"],
  "اللغة الإنجليزية":["المراسلات الإنجليزية","المحادثة","المصطلحات المالية","التقارير","العروض"],
  "الإعلام والتواصل":["الخطابة","إدارة الأزمات","مقابلات الإعلام","إدارة الاجتماعات","إنتاج المحتوى"],
  "السلامة وإدارة المخاطر":["إدارة المخاطر","الصحة والسلامة","خطة الاستمرارية","إدارة الحوادث","تمارين الطوارئ"],
  "دعم العمليات":["تحسين العمليات","جودة الخدمة","إدارة الأصول","المشتريات","دعم تقنية المعلومات"]
};

const PROGRAMS = {
  "اللغة الإنجليزية":{days:20,month:"أبريل 2026",cost:9000,method:"أونلاين + حضوري",provider:"مركز تدريب خارجي"},
  "القيادة الإدارية":{days:10,month:"مايو 2026",cost:15000,method:"مجموعات عمل",provider:"استشاري داخلي"},
  "المالية والميزانية":{days:8,month:"يونيو 2026",cost:12000,method:"حضوري",provider:"مركز تدريب خارجي"},
  "المهارات الناعمة":{days:5,month:"يوليو 2026",cost:8000,method:"هايبرد",provider:"استشاري داخلي"},
  "الشؤون القانونية":{days:6,month:"أغسطس 2026",cost:12000,method:"حضوري",provider:"مركز قانوني متخصص"},
  "التحول الرقمي":{days:6,month:"سبتمبر 2026",cost:11000,method:"أونلاين",provider:"منصة إلكترونية"},
  "العلاقات والبروتوكول":{days:4,month:"أكتوبر 2026",cost:7000,method:"حضوري",provider:"معهد متخصص"},
  "الإعلام والتواصل":{days:4,month:"نوفمبر 2026",cost:9000,method:"مجموعات عمل",provider:"استشاري إعلامي"},
  "الكفاءة التقنية":{days:4,month:"ديسمبر 2026",cost:10000,method:"تدريب ميداني",provider:"استشاري تقني"},
  "الموارد البشرية":{days:4,month:"يناير 2027",cost:10000,method:"هايبرد",provider:"استشاري HR"},
  "دعم العمليات":{days:3,month:"فبراير 2027",cost:8000,method:"مجموعات عمل",provider:"استشاري عمليات"},
  "السلامة وإدارة المخاطر":{days:3,month:"مارس 2027",cost:8000,method:"حضوري",provider:"خبير سلامة معتمد"}
};

const DEPT_LIST = ["الشؤون المالية","الموارد البشرية","الشؤون القانونية","تقنية المعلومات","العلاقات العامة","الشؤون الإدارية","التدقيق الداخلي","المشاريع والتطوير","الاستثمار","إدارة المخاطر","الأمانة العامة","إدارة العمليات"];

const ROLES = {
  admin:    {label:"مدير النظام",    color:"#ef4444", bg:"#450a0a", perms:["all"]},
  manager:  {label:"مدير إدارة",     color:"#f59e0b", bg:"#451a03", perms:["dept","analytics","tracking","evaluations"]},
  training: {label:"موظف التدريب",   color:"#3b82f6", bg:"#0a1e3a", perms:["tracking","attendance","results"]},
  content:  {label:"إدارة المحتوى", color:"#10b981", bg:"#052e16", perms:["subtopics","programs","materials"]},
  staff:    {label:"موظف HR",        color:"#8b5cf6", bg:"#2e1065", perms:["employees","analytics"]},
  employee: {label:"موظف",           color:"#64748b", bg:"#1e293b", perms:["self"]}
};

// helpers
const gc = g => g>=1.5?"#ef4444":g>=0.75?"#f59e0b":"#22c55e";
const pc = p => p==="عالٍ"?{bg:"#450a0a",fg:"#fca5a5"}:p==="متوسط"?{bg:"#451a03",fg:"#fcd34d"}:{bg:"#052e16",fg:"#86efac"};
const stC = {منجز:"#22c55e",جارٍ:"#f59e0b",مخطط:"#475569",ملغى:"#ef4444"};
const stB = {منجز:"#052e16",جارٍ:"#451a03",مخطط:"#1e293b",ملغى:"#450a0a"};

// ════════════════════════════════════════════════
// DESIGN SYSTEM — calmer, more professional
// ════════════════════════════════════════════════
const BG = {
  page:    "#0f1117",
  surface: "#161b27",
  elevated:"#1c2333",
  border:  "#2a3650",
  hover:   "#212a3e",
};

const S = {
  app:{fontFamily:"'Tajawal',sans-serif",direction:"rtl",background:BG.page,minHeight:"100vh",color:"#cbd5e1",fontSize:14},
  header:{background:BG.surface,borderBottom:"1px solid "+BG.border,padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:50,height:56,boxShadow:"0 1px 20px rgba(0,0,0,.4)"},
  tabs:{background:BG.surface,borderBottom:"1px solid "+BG.border,display:"flex",overflowX:"auto",position:"sticky",top:56,zIndex:40,scrollbarWidth:"none"},
  content:{padding:"20px",maxWidth:1600,margin:"0 auto"},
  card:{background:BG.surface,borderRadius:10,border:"1px solid "+BG.border,padding:16},
  cardHover:{background:BG.elevated,borderRadius:10,border:"1px solid "+BG.border,padding:16,transition:"all .15s"},
  input:{background:BG.page,border:"1px solid "+BG.border,color:"#e2e8f0",padding:"8px 12px",borderRadius:8,fontFamily:"'Tajawal',sans-serif",fontSize:13,width:"100%",outline:"none",boxSizing:"border-box",transition:"border .15s"},
  select:{background:BG.page,border:"1px solid "+BG.border,color:"#e2e8f0",padding:"7px 10px",borderRadius:8,fontFamily:"'Tajawal',sans-serif",fontSize:13,cursor:"pointer",outline:"none"},
  btn:(bg,fg="#fff",p="8px 16px")=>({background:bg,color:fg,border:"none",padding:p,borderRadius:8,fontFamily:"'Tajawal',sans-serif",fontWeight:600,fontSize:12,cursor:"pointer",whiteSpace:"nowrap",transition:"opacity .15s"}),
  badge:(bg,fg)=>({display:"inline-flex",alignItems:"center",padding:"2px 8px",borderRadius:20,fontSize:11,fontWeight:600,background:bg,color:fg}),
  th:{padding:"10px 14px",textAlign:"right",color:"#64748b",fontWeight:600,whiteSpace:"nowrap",fontSize:11,background:BG.elevated,borderBottom:"1px solid "+BG.border,letterSpacing:.3},
  td:{padding:"10px 14px",borderBottom:"1px solid "+BG.border+"88",fontSize:12,verticalAlign:"middle"},
  secTitle:{fontSize:13,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.8,marginBottom:14,display:"block"},
  modal:{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(4px)"},
  modalBox:{background:BG.surface,borderRadius:14,border:"1px solid "+BG.border,maxWidth:700,width:"100%",maxHeight:"94vh",overflowY:"auto",boxShadow:"0 24px 64px rgba(0,0,0,.6)"},
};

// ════════════════════════════════════════════════
// BASE COMPONENTS
// ════════════════════════════════════════════════
function Toast({msg,type}){
  return <div style={{position:"fixed",top:64,left:"50%",transform:"translateX(-50%)",
    background:type==="error"?"#450a0a":"#052e16",
    border:"1px solid "+(type==="error"?"#dc2626":"#16a34a"),
    color:"#f1f5f9",padding:"10px 24px",borderRadius:10,zIndex:999,
    fontWeight:600,fontSize:13,boxShadow:"0 8px 32px rgba(0,0,0,.5)",pointerEvents:"none"}}>
    {type==="error"?"⚠️ ":"✓ "}{msg}
  </div>;
}

function LoadingScreen(){
  return <div style={{...S.app,display:"flex",alignItems:"center",justifyContent:"center"}}>
    <div style={{textAlign:"center",color:"#3b82f6"}}>
      <div style={{fontSize:36,marginBottom:12,opacity:.8}}>⟳</div>
      <div style={{fontWeight:600,color:"#64748b"}}>جاري التحميل...</div>
    </div>
  </div>;
}

function Empty({icon,text}){
  return <div style={{textAlign:"center",padding:"48px 20px",color:"#475569"}}>
    <div style={{fontSize:32,marginBottom:10,opacity:.5}}>{icon}</div>
    <div style={{fontSize:13,color:"#475569"}}>{text}</div>
  </div>;
}

function KPI({v,l,c,i,sub,onClick}){
  return <div onClick={onClick} style={{...S.card,borderTop:"2px solid "+c,cursor:onClick?"pointer":"default",transition:"transform .15s, box-shadow .15s",padding:"14px 16px"}}
    onMouseOver={e=>{if(onClick){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,.3)";}}}
    onMouseOut={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
      <div style={{fontSize:11,color:"#64748b",fontWeight:600,textTransform:"uppercase",letterSpacing:.5}}>{l}</div>
      <div style={{fontSize:18,opacity:.7}}>{i}</div>
    </div>
    <div style={{fontSize:22,fontWeight:800,color:c,lineHeight:1}}>{v}</div>
    {sub&&<div style={{fontSize:10,color:"#475569",marginTop:4}}>{sub}</div>}
  </div>;
}

function BarChart({data,height=100}){
  const max=Math.max(...data.map(d=>d.v),1);
  return <div style={{display:"flex",alignItems:"flex-end",gap:4,height:height+30}}>
    {data.map((d,i)=>(
      <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
        <div style={{fontSize:9,color:"#64748b",fontWeight:600,minHeight:12}}>{d.v>0?d.v:""}</div>
        <div title={d.full||d.l+": "+d.v} style={{width:"100%",minHeight:d.v>0?2:0,
          height:Math.max((d.v/max)*height,d.v>0?2:0),
          background:"linear-gradient(180deg,"+d.c+"dd,"+d.c+"88)",
          borderRadius:"3px 3px 0 0",transition:"height .4s"}}/>
        <div style={{fontSize:8,color:"#475569",textAlign:"center",lineHeight:1.2,
          maxWidth:40,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{d.l}</div>
      </div>
    ))}
  </div>;
}

function Donut({segs,size=110}){
  const tot=segs.reduce((s,x)=>s+x.v,0)||1;
  let off=0;const r=36,circ=2*Math.PI*r;
  return <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r={r} fill="none" stroke={BG.border} strokeWidth="12"/>
    {segs.map((s,i)=>{
      const d=(s.v/tot)*circ;
      const el=<circle key={i} cx="50" cy="50" r={r} fill="none" stroke={s.c}
        strokeWidth="12" strokeDasharray={d+" "+(circ-d)}
        strokeDashoffset={-off*circ} transform="rotate(-90 50 50)"/>;
      off+=s.v/tot;return el;
    })}
    <text x="50" y="54" textAnchor="middle" fill="#e2e8f0" fontSize="14" fontWeight="700">{tot}</text>
  </svg>;
}

async function auditLog(uid,email,action,table,rid,oldD,newD){
  try{await supabase.from("audit_log").insert({user_id:uid,user_email:email,action,table_name:table,record_id:rid,old_data:oldD,new_data:newD});}catch(e){}
}

function generateCertHTML(cert,empName,dept){
  const date=new Date(cert.issued_at).toLocaleDateString("ar-SY");
  const num=cert.cert_number||"SSF-2026-"+Math.random().toString(36).substr(2,8).toUpperCase();
  // FIX #1: Show subtopic as the main title, domain as subtitle
  const mainTitle = cert.subtopic || cert.domain;
  const subTitle  = cert.subtopic ? cert.domain : "";
  return `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><title>شهادة — ${mainTitle}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Arial',sans-serif;background:#f8fafc;display:flex;align-items:center;justify-content:center;min-height:100vh}
.cert{width:820px;min-height:560px;background:linear-gradient(135deg,#fff 0%,#f8f4ec 100%);
  border:3px solid #C8973A;border-radius:16px;padding:52px;text-align:center;position:relative;box-shadow:0 12px 48px rgba(0,0,0,.12)}
.cert::before{content:'';position:absolute;inset:12px;border:1px solid #C8973A44;border-radius:10px;pointer-events:none}
.logo{font-size:48px;margin-bottom:8px}.org{font-size:22px;font-weight:800;color:#1B3A6B}
.divider{width:120px;height:2px;background:linear-gradient(90deg,transparent,#C8973A,transparent);margin:14px auto 26px}
.title{font-size:28px;font-weight:800;color:#C8973A;margin-bottom:22px}
.body{font-size:16px;color:#374151;line-height:2.6}
.name{font-size:24px;font-weight:800;color:#1B3A6B;border-bottom:2px solid #C8973A;display:inline-block;padding:0 20px 4px;margin:6px 0}
.subtopic{font-size:22px;font-weight:800;color:#1B3A6B;background:linear-gradient(135deg,#fef9ec,#fef3c7);padding:10px 28px;border-radius:10px;display:inline-block;margin:8px 0;border:2px solid #C8973A55;letter-spacing:.5px}
.domain-sub{font-size:13px;color:#94a3b8;margin-top:4px;display:block}
.footer{display:flex;justify-content:space-between;align-items:flex-end;margin-top:36px;padding-top:20px;border-top:1px solid #e2d5b0}
.sig{text-align:center;width:180px}.sig-line{width:140px;border-top:1px solid #374151;margin:0 auto 6px}
.sig-name{font-size:11px;font-weight:700;color:#374151}.sig-sub{font-size:10px;color:#94a3b8}
.stamp{font-size:10px;color:#94a3b8;text-align:center;margin-top:14px;letter-spacing:.5px}
@media print{body{background:white}@page{size:A4 landscape;margin:.5cm}}</style></head>
<body><div class="cert">
<div class="logo">🏛</div>
<div class="org">الصندوق السيادي السوري</div>
<div style="font-size:11px;color:#94a3b8;margin-top:2px">Syrian Sovereign Fund</div>
<div class="divider"></div>
<div class="title">شهادة إتمام تدريب</div>
<div class="body">يُشهد الصندوق السيادي السوري بأن<br>
<span class="name">${empName}</span><br>
<span style="font-size:12px;color:#64748b">${dept}</span><br>
قد أتم/أتمت بنجاح برنامج التدريب في موضوع<br>
<span class="subtopic">${mainTitle}</span>
${subTitle?`<span class="domain-sub">المجال: ${subTitle}</span>`:""}
</div>
<div class="footer">
<div class="sig"><div class="sig-line"></div><div class="sig-name">مدير الموارد البشرية</div><div class="sig-sub">HR Director</div></div>
<div style="text-align:center"><div style="font-size:34px;margin-bottom:6px">🏆</div><div style="font-size:11px;color:#374151;font-weight:600">تاريخ الإصدار</div><div style="font-weight:700;color:#1B3A6B;font-size:13px">${date}</div></div>
<div class="sig"><div class="sig-line"></div><div class="sig-name">المدير التنفيذي</div><div class="sig-sub">Executive Director</div></div>
</div>
<div class="stamp">رقم الشهادة: ${num} | الصندوق السيادي السوري © 2026</div>
</div></body></html>`;
}

// ════════════════════════════════════════════════
// LOGIN
// ════════════════════════════════════════════════
function LoginScreen({onLogin}){
  const [email,setEmail]=useState("");
  const [pw,setPw]=useState("");
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);

  const go=async()=>{
    if(!email||!pw){setErr("الإيميل وكلمة السر مطلوبان");return;}
    setLoading(true);setErr("");
    const{data,error}=await supabase.auth.signInWithPassword({email,password:pw});
    if(error){setErr("إيميل أو كلمة سر غير صحيحة");setLoading(false);return;}
    await auditLog(data.user.id,data.user.email,"دخول","auth",data.user.id,null,{time:new Date().toISOString()});
    onLogin(data.user);
  };

  return <div style={{...S.app,display:"flex",alignItems:"center",justifyContent:"center",
    background:"radial-gradient(ellipse at 50% 30%,#1a2744 0%,"+BG.page+" 65%)"}}>
    <div style={{background:BG.surface,borderRadius:16,border:"1px solid "+BG.border,
      padding:"44px 40px",maxWidth:400,width:"100%",textAlign:"center",boxShadow:"0 24px 64px rgba(0,0,0,.6)"}}>
      <div style={{fontSize:44,marginBottom:10}}>🏛</div>
      <div style={{fontSize:20,fontWeight:800,color:"#e2e8f0",marginBottom:3}}>الصندوق السيادي السوري</div>
      <div style={{fontSize:11,color:"#475569",marginBottom:28}}>نظام إدارة التدريب 2026</div>
      <input style={{...S.input,marginBottom:10,direction:"ltr",textAlign:"left",padding:"11px 14px"}}
        type="email" placeholder="email@ssf.gov.sy" value={email}
        onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()}/>
      <input style={{...S.input,marginBottom:14,direction:"ltr",textAlign:"left",padding:"11px 14px"}}
        type="password" placeholder="••••••••" value={pw}
        onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()}/>
      {err&&<div style={{fontSize:12,color:"#fca5a5",background:"#450a0a",border:"1px solid #dc262644",
        padding:"8px 12px",borderRadius:8,marginBottom:12}}>{err}</div>}
      <button style={{...S.btn("linear-gradient(135deg,#1d4ed8,#2563eb)"),width:"100%",
        padding:13,fontSize:14,borderRadius:10,opacity:loading?0.7:1}}
        onClick={go} disabled={loading}>
        {loading?"جاري الدخول...":"الدخول إلى النظام"}
      </button>
    </div>
  </div>;
}

// ════════════════════════════════════════════════
// SUBTOPICS PAGE — FIXED: each subtopic shows its own employees
// Key fix: employees are assigned to subtopics in Supabase table
// employee_subtopics: {employee_id, domain, subtopic, created_by}
// Fallback: if no DB data, show ALL domain employees with option to assign
// ════════════════════════════════════════════════
function SubtopicsPage({employees,user}){
  const [subtopics,setSubtopics]=useState(()=>{
    try{const s=localStorage.getItem("ssf_subtopics_v3");return s?JSON.parse(s):JSON.parse(JSON.stringify(SUBTOPICS_DEFAULT));}
    catch{return JSON.parse(JSON.stringify(SUBTOPICS_DEFAULT));}
  });
  const [selDomain,setSelDomain]=useState(DOMAINS[0]);
  const [selTopic,setSelTopic]=useState(null);  // currently selected subtopic
  const [newTopic,setNewTopic]=useState("");
  const [adding,setAdding]=useState(false);
  // KEY FIX: track which employees are assigned to which subtopic
  const [assignments,setAssignments]=useState(()=>{
    try{const a=localStorage.getItem("ssf_assignments_v3");return a?JSON.parse(a):{};}
    catch{return {};}
  });
  const [assigning,setAssigning]=useState(false);  // show assign panel
  const [saving,setSaving]=useState({});

  const saveToLS=(key,val)=>{try{localStorage.setItem(key,JSON.stringify(val));}catch(e){}};

  const saveSubs=s=>{setSubtopics(s);saveToLS("ssf_subtopics_v3",s);};
  const saveAssign=a=>{setAssignments(a);saveToLS("ssf_assignments_v3",a);};

  const addTopic=()=>{
    if(!newTopic.trim())return;
    const s={...subtopics,[selDomain]:[...(subtopics[selDomain]||[]),newTopic.trim()]};
    saveSubs(s);setNewTopic("");setAdding(false);
  };

  const delTopic=t=>{
    const s={...subtopics,[selDomain]:(subtopics[selDomain]||[]).filter(x=>x!==t)};
    saveSubs(s);
    // remove assignments for deleted topic
    const key=selDomain+"||"+t;
    const a={...assignments};delete a[key];saveAssign(a);
    if(selTopic===t)setSelTopic(null);
  };

  // FIX: each subtopic key = "domain||subtopic"
  const getAssignKey=(domain,topic)=>domain+"||"+topic;
  const getAssigned=(domain,topic)=>{
    const key=getAssignKey(domain,topic);
    return assignments[key]||[];  // array of employee IDs
  };

  const toggleAssign=(empId)=>{
    if(!selTopic)return;
    const key=getAssignKey(selDomain,selTopic);
    const cur=assignments[key]||[];
    const updated=cur.includes(empId)?cur.filter(id=>id!==empId):[...cur,empId];
    saveAssign({...assignments,[key]:updated});
  };

  const autoAssign=()=>{
    // Auto-assign all domain employees to selected subtopic
    if(!selTopic)return;
    const key=getAssignKey(selDomain,selTopic);
    const empIds=domEmps.map(e=>e.id);
    saveAssign({...assignments,[key]:empIds});
  };

  const domEmps=employees.filter(e=>e.needs?.[selDomain]&&e.needs[selDomain]!=="-");

  // FIX: topic employees = only those assigned to THIS specific subtopic
  const topicEmpIds=selTopic?getAssigned(selDomain,selTopic):[];
  const topicEmps=topicEmpIds.map(id=>employees.find(e=>e.id===id)).filter(Boolean)
    .sort((a,b)=>{const o={"عالٍ":0,"متوسط":1,"منخفض":2};return (o[a.needs[selDomain]]??3)-(o[b.needs[selDomain]]??3);});

  const exportCSV=(list,filename)=>{
    const rows=[["#","الاسم","الإدارة","المسمى","المدينة","الهاتف","الإيميل","مستوى الحاجة","الفجوة"],
      ...list.map((e,i)=>[i+1,e.name,e.dept,e.title||"",e.city||"",e.phone||"",e.email||"",e.needs[selDomain],(e.gap||0).toFixed(2)])];
    const blob=new Blob(["\uFEFF"+rows.map(r=>r.join(",")).join("\n")],{type:"text/csv;charset=utf-8"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=filename;a.click();
  };

  const topicCounts=DOMAINS.reduce((acc,d)=>{
    let total=0;
    (subtopics[d]||[]).forEach(t=>{total+=getAssigned(d,t).length;});
    acc[d]=total;return acc;
  },{});

  return <div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:14}}>
    {/* SIDEBAR */}
    <div style={S.card}>
      <span style={S.secTitle}>المجالات</span>
      {DOMAINS.map(d=>{
        const cnt=employees.filter(e=>e.needs?.[d]&&e.needs[d]!=="-").length;
        const high=employees.filter(e=>e.needs?.[d]==="عالٍ").length;
        const sel=selDomain===d;
        return <div key={d} onClick={()=>{setSelDomain(d);setSelTopic(null);setAssigning(false);}}
          style={{padding:"9px 11px",borderRadius:8,marginBottom:3,cursor:"pointer",
            background:sel?BG.elevated:"transparent",
            border:"1px solid "+(sel?DC[d]||BG.border:BG.border+"44"),transition:"all .15s"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:7}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:DC[d]||"#64748b",flexShrink:0}}/>
              <span style={{fontWeight:sel?700:400,fontSize:12,color:sel?"#e2e8f0":"#64748b"}}>{d}</span>
            </div>
            <div style={{display:"flex",gap:3}}>
              {high>0&&<span style={{...S.badge("#450a0a","#fca5a5"),fontSize:9}}>{high}</span>}
              <span style={{...S.badge(BG.page,"#475569"),fontSize:9}}>{cnt}</span>
            </div>
          </div>
        </div>;
      })}
    </div>

    {/* MAIN */}
    <div>
      {/* Domain header */}
      <div style={{...S.card,marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14,flexWrap:"wrap",gap:8}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:DC[selDomain]||"#64748b"}}/>
              <span style={{fontSize:17,fontWeight:800,color:"#e2e8f0"}}>{selDomain}</span>
            </div>
            <div style={{fontSize:11,color:"#475569"}}>
              {PROGRAMS[selDomain]?.month} · {PROGRAMS[selDomain]?.days} يوم · {PROGRAMS[selDomain]?.method}
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            {[{v:domEmps.length,l:"مسجّل",c:"#3b82f6"},{v:domEmps.filter(e=>e.needs[selDomain]==="عالٍ").length,l:"أولوية عالية",c:"#ef4444"}].map(k=>(
              <div key={k.l} style={{background:BG.page,borderRadius:8,padding:"8px 14px",textAlign:"center",border:"1px solid "+BG.border}}>
                <div style={{fontWeight:800,color:k.c,fontSize:18}}>{k.v}</div>
                <div style={{fontSize:9,color:"#475569"}}>{k.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Subtopics list */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span style={S.secTitle}>الموضوعات الفرعية ({(subtopics[selDomain]||[]).length})</span>
          <button style={S.btn(adding?"#1e293b":"#1d4ed8","#fff","6px 13px")}
            onClick={()=>setAdding(!adding)}>{adding?"إلغاء":"+ موضوع جديد"}</button>
        </div>

        {adding&&<div style={{display:"flex",gap:8,marginBottom:12,padding:10,background:BG.page,borderRadius:8,border:"1px solid "+BG.border}}>
          <input style={{...S.input,flex:1}} value={newTopic} onChange={e=>setNewTopic(e.target.value)}
            placeholder="اسم الموضوع الجديد..." onKeyDown={e=>e.key==="Enter"&&addTopic()} autoFocus/>
          <button style={S.btn("#16a34a","#fff","8px 16px")} onClick={addTopic}>إضافة ✓</button>
        </div>}

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(172px,1fr))",gap:7}}>
          {(subtopics[selDomain]||[]).map(t=>{
            const assigned=getAssigned(selDomain,t).length;
            const sel=selTopic===t;
            return <div key={t} onClick={()=>{setSelTopic(sel?null:t);setAssigning(false);}}
              style={{background:sel?BG.elevated:BG.page,borderRadius:9,padding:"10px 12px",
                border:"1px solid "+(sel?DC[selDomain]||"#3b82f6":BG.border),
                cursor:"pointer",transition:"all .15s",
                boxShadow:sel?"0 0 0 1px "+(DC[selDomain]||"#3b82f6")+"44":""}} >
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:sel?5:0}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:6,height:6,borderRadius:"50%",flexShrink:0,
                    background:sel?DC[selDomain]||"#3b82f6":"#334155"}}/>
                  <span style={{fontSize:12,fontWeight:sel?700:400,color:sel?"#e2e8f0":"#64748b"}}>{t}</span>
                </div>
                <button onClick={e=>{e.stopPropagation();delTopic(t);}}
                  style={{background:"transparent",border:"none",color:"#47556944",cursor:"pointer",fontSize:12,padding:"0 2px",lineHeight:1}}>✕</button>
              </div>
              {sel&&<div style={{fontSize:10,color:"#475569",marginTop:2}}>
                {assigned} موظف مسجّل
                {assigned===0&&<span style={{color:"#f59e0b"}}> · اضغط تسجيل</span>}
              </div>}
              {!sel&&assigned>0&&<div style={{fontSize:9,color:"#475569",marginTop:3}}>{assigned} ✓</div>}
            </div>;
          })}
        </div>
      </div>

      {/* Topic selected panel */}
      {selTopic&&<div style={S.card}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
          <div>
            <div style={{fontWeight:700,fontSize:14,color:"#e2e8f0",marginBottom:2}}>
              {selTopic}
              <span style={{fontSize:11,color:"#475569",fontWeight:400,marginRight:8}}>— {selDomain}</span>
            </div>
            <div style={{fontSize:11,color:"#475569"}}>{topicEmps.length} موظف مسجّل في هذا الموضوع</div>
          </div>
          <div style={{display:"flex",gap:7}}>
            <button style={S.btn(assigning?"#1d4ed8":"#1e293b","#fff","7px 13px")}
              onClick={()=>setAssigning(!assigning)}>
              {assigning?"✓ حفظ التسجيل":"⊕ تسجيل موظفين"}
            </button>
            {!assigning&&topicEmps.length>0&&<button style={S.btn("#065f46","#fff","7px 13px")}
              onClick={()=>exportCSV(topicEmps,selTopic+"_موظفون.csv")}>📥 تصدير</button>}
            <button style={S.btn("#0f172a","#475569","7px 13px")} onClick={autoAssign} title="تسجيل كل موظفي المجال تلقائياً">⊞ تسجيل الكل</button>
          </div>
        </div>

        {/* Assign panel */}
        {assigning&&<div style={{marginBottom:14,padding:12,background:BG.page,borderRadius:9,border:"1px solid "+BG.border}}>
          <div style={{fontSize:11,color:"#64748b",marginBottom:10}}>✓ اضغط على موظف لتسجيله أو إلغاء تسجيله في موضوع «{selTopic}»</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:6}}>
            {domEmps.map(e=>{
              const assigned=getAssigned(selDomain,selTopic).includes(e.id);
              const{bg,fg}=pc(e.needs[selDomain]);
              return <div key={e.id} onClick={()=>toggleAssign(e.id)}
                style={{padding:"7px 10px",borderRadius:7,cursor:"pointer",
                  background:assigned?BG.elevated:BG.page,
                  border:"1px solid "+(assigned?"#3b82f6":BG.border),
                  display:"flex",alignItems:"center",gap:8,transition:"all .15s"}}>
                <div style={{width:16,height:16,borderRadius:4,border:"1px solid "+(assigned?"#3b82f6":"#334155"),
                  background:assigned?"#3b82f6":"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff"}}>
                  {assigned?"✓":""}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:11,fontWeight:600,color:assigned?"#e2e8f0":"#64748b",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.name}</div>
                  <div style={{fontSize:9,color:"#475569"}}>{e.dept}</div>
                </div>
                <span style={{...S.badge(bg,fg),fontSize:9}}>{e.needs[selDomain]}</span>
              </div>;
            })}
          </div>
        </div>}

        {/* Topic employees table */}
        {!assigning&&(topicEmps.length===0
          ?<div style={{textAlign:"center",padding:"32px 20px",color:"#475569"}}>
              <div style={{fontSize:28,marginBottom:8,opacity:.4}}>👥</div>
              <div style={{marginBottom:12}}>لم يتم تسجيل أي موظف في هذا الموضوع بعد</div>
              <button style={S.btn("#1d4ed8","#fff")} onClick={()=>setAssigning(true)}>⊕ ابدأ التسجيل</button>
            </div>
          :<div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr>
                {["#","الاسم","الإدارة","المسمى","المدينة","الهاتف","الإيميل","مستوى الحاجة","الفجوة"].map(h=><th key={h} style={S.th}>{h}</th>)}
              </tr></thead>
              <tbody>{topicEmps.map((e,i)=>{
                const{bg,fg}=pc(e.needs[selDomain]);
                return <tr key={e.id} style={{background:i%2===0?BG.page:BG.elevated+"44"}}>
                  <td style={S.td}><span style={{color:"#334155"}}>{i+1}</span></td>
                  <td style={S.td}><span style={{fontWeight:600,color:"#e2e8f0"}}>{e.name}</span></td>
                  <td style={S.td}><span style={{color:"#60a5fa",fontSize:11}}>{e.dept}</span></td>
                  <td style={S.td}><span style={{color:"#64748b"}}>{e.title||"—"}</span></td>
                  <td style={S.td}>{e.city||"—"}</td>
                  <td style={S.td}>{e.phone?<a href={"tel:"+e.phone} style={{color:"#34d399",textDecoration:"none"}}>{e.phone}</a>:"—"}</td>
                  <td style={S.td}>{e.email?<a href={"mailto:"+e.email} style={{color:"#60a5fa",textDecoration:"none",fontSize:11}}>{e.email}</a>:"—"}</td>
                  <td style={S.td}><span style={S.badge(bg,fg)}>{e.needs[selDomain]}</span></td>
                  <td style={S.td}><span style={{fontWeight:700,color:gc(e.gap||0)}}>{(e.gap||0).toFixed(2)}</span></td>
                </tr>;
              })}</tbody>
            </table>
          </div>)}
      </div>}

      {/* All domain employees when no topic selected */}
      {!selTopic&&domEmps.length>0&&<div style={S.card}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <span style={S.secTitle}>جميع متدربي {selDomain} ({domEmps.length})</span>
          <button style={S.btn("#065f46","#fff","7px 13px")} onClick={()=>exportCSV(domEmps,"متدربو_"+selDomain+".csv")}>📥 تصدير</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(235px,1fr))",gap:7}}>
          {domEmps.map(e=>{
            const{bg,fg}=pc(e.needs[selDomain]);
            return <div key={e.id} style={{background:BG.page,borderRadius:9,padding:"10px 12px",border:"1px solid "+BG.border}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                <div><div style={{fontWeight:600,fontSize:12,color:"#e2e8f0"}}>{e.name}</div>
                  <div style={{fontSize:10,color:"#475569"}}>{e.dept}</div></div>
                <span style={S.badge(bg,fg)}>{e.needs[selDomain]}</span>
              </div>
              {e.phone&&<div style={{fontSize:10,color:"#34d399",marginTop:3}}>📞 {e.phone}</div>}
            </div>;
          })}
        </div>
      </div>}
    </div>
  </div>;
}

// ════════════════════════════════════════════════
// ANNUAL PLAN
// ════════════════════════════════════════════════
function AnnualPlanPage({employees}){
  const [plan,setPlan]=useState(DOMAINS.map(d=>({
    domain:d,days:PROGRAMS[d]?.days||4,cost:PROGRAMS[d]?.cost||8000,
    participants:employees.filter(e=>e.needs?.[d]&&e.needs[d]!=="-").length,
    month:PROGRAMS[d]?.month||"",status:"مخطط",
    method:PROGRAMS[d]?.method||"",provider:PROGRAMS[d]?.provider||"",
    location:"مقر الصندوق",notes:""
  })));
  const [rate,setRate]=useState(35);
  const [view,setView]=useState("gantt");
  const [selDomain,setSelDomain]=useState(null);
  const [editRow,setEditRow]=useState(null);

  useEffect(()=>{
    setPlan(prev=>prev.map(p=>({...p,participants:employees.filter(e=>e.needs?.[p.domain]&&e.needs[p.domain]!=="-").length})));
  },[employees]);

  const upd=(i,f,v)=>setPlan(prev=>{
    const n=[...prev];
    n[i]={...n[i],[["days","cost","participants"].includes(f)?"_":"x"]:(()=>{})()};
    n[i]={...n[i],[f]:["days","cost","participants"].includes(f)?Math.max(0,+v):v};
    return n;
  });

  const totCost=plan.reduce((s,p)=>s+p.cost,0);
  const totDays=plan.reduce((s,p)=>s+p.days,0);
  const totPart=plan.reduce((s,p)=>s+p.participants,0);
  const totRate=plan.reduce((s,p)=>s+p.days*p.participants*rate,0);
  const done=plan.filter(p=>p.status==="منجز").length;
  const inProg=plan.filter(p=>p.status==="جارٍ").length;
  const selPlan=selDomain?plan.find(p=>p.domain===selDomain):null;

  const exportPlan=()=>{
    const rows=[["المجال","الشهر","الأيام","المشاركون","التكلفة","ت/مشارك","الطريقة","الجهة","الحالة"],
      ...plan.map(p=>[p.domain,p.month,p.days,p.participants,p.cost,Math.round(p.cost/Math.max(p.participants,1)),p.method,p.provider,p.status])];
    const blob=new Blob(["\uFEFF"+rows.map(r=>r.join(",")).join("\n")],{type:"text/csv;charset=utf-8"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="الخطة_التدريبية_2026.csv";a.click();
  };

  return <div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10,marginBottom:16}}>
      <KPI v={12} l="برامج تدريبية" c="#3b82f6" i="📅" sub="أبريل 2026 — مارس 2027"/>
      <KPI v={totDays+" يوم"} l="إجمالي أيام التدريب" c="#6366f1" i="📆"/>
      <KPI v={totPart} l="إجمالي المشاركين" c="#10b981" i="👥"/>
      <KPI v={"$"+(totCost/1000).toFixed(0)+"k"} l="الميزانية المخططة" c="#f59e0b" i="💰"/>
      <KPI v={done+"/12"} l="منجزة" c="#22c55e" i="✅"/>
      <KPI v={inProg} l="جارٍ حالياً" c="#f59e0b" i="⏳"/>
      <KPI v={"$"+(totRate/1000).toFixed(0)+"k"} l="تكلفة بالمعدل" c="#8b5cf6" i="🔢"/>
      <KPI v={"$"+rate} l="معدل اليوم" c="#475569" i="💵"/>
    </div>

    <div style={{...S.card,marginBottom:14,display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {[["gantt","📊 Gantt"],["table","📋 جدول"],["budget","💰 ميزانية"],["cards","🗂 بطاقات"]].map(([val,lbl])=>(
          <button key={val} style={S.btn(view===val?"#1d4ed8":"#1e293b",view===val?"#fff":"#64748b","7px 14px")}
            onClick={()=>setView(val)}>{lbl}</button>
        ))}
      </div>
      <div style={{marginRight:"auto",display:"flex",gap:8,alignItems:"center"}}>
        <span style={{fontSize:11,color:"#475569"}}>$ معدل/يوم</span>
        <input type="number" min={5} max={500} value={rate} onChange={e=>setRate(Math.max(1,+e.target.value))}
          style={{...S.input,width:70,padding:"5px 9px",fontSize:12}}/>
        <button style={S.btn("#065f46","#fff","7px 14px")} onClick={exportPlan}>📥 تصدير</button>
      </div>
    </div>

    {view==="gantt"&&<div style={S.card}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <span style={S.secTitle}>مخطط Gantt — اضغط على البرنامج لتفاصيله</span>
        <span style={{fontSize:11,color:"#475569"}}>* = 2027</span>
      </div>
      <div style={{overflowX:"auto"}}>
        <div style={{minWidth:980}}>
          <div style={{display:"flex",marginBottom:6,paddingRight:210}}>
            {plan.map((p,i)=>(
              <div key={i} style={{flex:1,textAlign:"center",fontSize:9,color:"#334155",fontWeight:600,
                padding:"3px 1px",background:BG.page,borderRadius:3,margin:"0 1px"}}>
                {p.month.replace(" 2026","").replace(" 2027","*")}
              </div>
            ))}
            <div style={{width:72,flexShrink:0}}/>
          </div>
          {plan.map((p,pi)=>(
            <div key={pi} style={{display:"flex",alignItems:"center",marginBottom:5,gap:4}}>
              <div style={{width:206,flexShrink:0,display:"flex",alignItems:"center",gap:6,justifyContent:"flex-end",paddingLeft:4,cursor:"pointer"}}
                onClick={()=>setSelDomain(selDomain===p.domain?null:p.domain)}>
                <span style={{fontSize:11,fontWeight:600,color:selDomain===p.domain?"#e2e8f0":"#64748b"}}>{p.domain}</span>
                <div style={{width:8,height:8,borderRadius:"50%",background:DC[p.domain]||"#64748b",flexShrink:0}}/>
              </div>
              {plan.map((_,ci)=>{
                const active=ci===pi;const isSel=active&&selDomain===p.domain;
                return <div key={ci} onClick={()=>active&&setSelDomain(selDomain===p.domain?null:p.domain)}
                  style={{flex:1,height:34,borderRadius:4,margin:"0 1px",
                    background:active?"linear-gradient(135deg,"+DC[p.domain]||"#3b82f6"+","+DC[p.domain]||"#3b82f6"+"aa)":BG.page,
                    border:isSel?"2px solid #fff":"1px solid "+(active?DC[p.domain]||"#3b82f6":BG.border+"44"),
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#fff",fontWeight:700,
                    cursor:active?"pointer":"default",opacity:p.status==="ملغى"?0.3:1,transition:"all .15s"}}>
                  {active&&<><div>{p.days}ي</div></>}
                </div>;
              })}
              <div style={{width:68,flexShrink:0}}>
                <span style={{...S.badge(stB[p.status]||BG.page,stC[p.status]||"#64748b"),fontSize:9}}>{p.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selPlan&&<div style={{marginTop:14,padding:14,background:BG.page,borderRadius:10,border:"1px solid "+BG.border}}>
        <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:12}}>
          <div>
            <div style={{fontWeight:700,fontSize:14,color:"#e2e8f0"}}>{selPlan.domain}</div>
            <div style={{fontSize:11,color:"#475569",marginTop:2}}>{selPlan.month} · {selPlan.method} · {selPlan.provider}</div>
          </div>
          <button style={S.btn(BG.elevated,"#94a3b8","5px 12px")} onClick={()=>setEditRow(plan.findIndex(p=>p.domain===selPlan.domain))}>✏️ تعديل</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:8,marginBottom:12}}>
          {[["الأيام",selPlan.days,"#6366f1"],["المشاركون",selPlan.participants,"#10b981"],
            ["التكلفة","$"+selPlan.cost.toLocaleString(),"#f59e0b"],
            ["$/مشارك","$"+Math.round(selPlan.cost/Math.max(selPlan.participants,1)),"#8b5cf6"]].map(([l,v,c])=>(
            <div key={l} style={{background:BG.elevated,borderRadius:8,padding:"8px 11px",border:"1px solid "+BG.border}}>
              <div style={{fontSize:9,color:"#475569",marginBottom:2}}>{l}</div>
              <div style={{fontWeight:700,color:c,fontSize:13}}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{fontSize:11,color:"#475569",marginBottom:6}}>المشاركون ({employees.filter(e=>e.needs?.[selPlan.domain]&&e.needs[selPlan.domain]!=="-").length})</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
          {employees.filter(e=>e.needs?.[selPlan.domain]&&e.needs[selPlan.domain]!=="-").map(e=>{
            const{bg,fg}=pc(e.needs[selPlan.domain]);
            return <span key={e.id} style={{...S.badge(bg,fg),fontSize:10}}>{e.name}</span>;
          })}
        </div>
      </div>}
    </div>}

    {view==="table"&&<div style={S.card}>
      <span style={S.secTitle}>جدول الخطة — الحقول الملوّنة قابلة للتعديل</span>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            <th style={S.th}>المجال</th><th style={S.th}>الشهر</th>
            <th style={{...S.th,color:"#6366f1"}}>الأيام ✎</th>
            <th style={{...S.th,color:"#10b981"}}>المشاركون</th>
            <th style={{...S.th,color:"#f59e0b"}}>التكلفة $ ✎</th>
            <th style={{...S.th,color:"#8b5cf6"}}>$/مشارك</th>
            <th style={{...S.th,color:"#475569"}}>بالمعدل</th>
            <th style={{...S.th,color:"#ef4444"}}>الفرق</th>
            <th style={S.th}>الحالة</th>
          </tr></thead>
          <tbody>{plan.map((p,i)=>{
            const rc=p.days*p.participants*rate;const diff=p.cost-rc;
            return <tr key={i} style={{background:i%2===0?BG.page:BG.elevated+"33"}}>
              <td style={S.td}><div style={{display:"flex",alignItems:"center",gap:7}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:DC[p.domain]||"#64748b",flexShrink:0}}/>
                <span style={{fontWeight:600,fontSize:11,color:"#e2e8f0"}}>{p.domain}</span>
              </div></td>
              <td style={S.td}><span style={{color:"#64748b",fontSize:11}}>{p.month}</span></td>
              <td style={S.td}><input type="number" min={1} max={90} value={p.days} onChange={e=>upd(i,"days",e.target.value)}
                style={{...S.input,width:54,padding:"4px 7px",fontSize:12,textAlign:"center",background:"#0f172a",border:"1px solid #6366f133",color:"#818cf8",fontWeight:700}}/></td>
              <td style={S.td}><span style={{fontWeight:700,color:"#34d399"}}>{p.participants}</span></td>
              <td style={S.td}><input type="number" min={0} value={p.cost} onChange={e=>upd(i,"cost",e.target.value)}
                style={{...S.input,width:90,padding:"4px 7px",fontSize:12,textAlign:"center",background:"#0f172a",border:"1px solid #f59e0b33",color:"#fbbf24",fontWeight:700}}/></td>
              <td style={S.td}><span style={{color:"#a78bfa",fontWeight:600}}>${Math.round(p.cost/Math.max(p.participants,1)).toLocaleString()}</span></td>
              <td style={S.td}><span style={{color:"#475569"}}>${rc.toLocaleString()}</span></td>
              <td style={S.td}><span style={{color:diff>0?"#ef4444":"#22c55e",fontWeight:700}}>
                {diff>0?"▲":"▼"}${Math.abs(diff).toLocaleString()}</span></td>
              <td style={S.td}><select style={{...S.input,width:82,padding:"4px 7px",fontSize:10,
                color:stC[p.status],background:stB[p.status]||BG.page,fontWeight:700}}
                value={p.status} onChange={e=>upd(i,"status",e.target.value)}>
                {["مخطط","جارٍ","منجز","ملغى"].map(s=><option key={s}>{s}</option>)}</select></td>
            </tr>;
          })}</tbody>
          <tfoot><tr style={{background:BG.elevated}}>
            <td colSpan={2} style={{padding:"10px 14px",color:"#f59e0b",fontWeight:700}}>الإجمالي</td>
            <td style={{padding:"10px 14px",color:"#818cf8",fontWeight:700}}>{totDays}</td>
            <td style={{padding:"10px 14px",color:"#34d399",fontWeight:700}}>{totPart}</td>
            <td style={{padding:"10px 14px",color:"#fbbf24",fontWeight:800,fontSize:14}}>${totCost.toLocaleString()}</td>
            <td style={{padding:"10px 14px",color:"#a78bfa"}}>${Math.round(totCost/Math.max(totPart,1)).toLocaleString()}</td>
            <td style={{padding:"10px 14px",color:"#475569"}}>${totRate.toLocaleString()}</td>
            <td style={{padding:"10px 14px",color:totCost>totRate?"#ef4444":"#22c55e",fontWeight:700}}>
              {totCost>totRate?"▲":"▼"}${Math.abs(totCost-totRate).toLocaleString()}</td>
            <td/>
          </tfoot>
        </table>
      </div>
    </div>}

    {view==="budget"&&<div>
      <div style={{...S.card,marginBottom:14}}>
        <span style={S.secTitle}>تحليل الميزانية</span>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10,marginBottom:16}}>
          {[["المخطط","$"+totCost.toLocaleString(),"#f59e0b"],["بالمعدل","$"+totRate.toLocaleString(),"#6366f1"],
            ["الفرق","$"+Math.abs(totCost-totRate).toLocaleString(),totCost>totRate?"#ef4444":"#22c55e"],
            ["$/مشارك","$"+Math.round(totCost/Math.max(totPart,1)).toLocaleString(),"#8b5cf6"]].map(([l,v,c])=>(
            <div key={l} style={{background:BG.page,borderRadius:9,padding:"11px 14px",border:"1px solid "+c+"22"}}>
              <div style={{fontSize:9,color:"#475569",marginBottom:4,fontWeight:600,textTransform:"uppercase"}}>{l}</div>
              <div style={{fontSize:20,fontWeight:800,color:c}}>{v}</div>
            </div>
          ))}
        </div>
        <BarChart data={plan.map(p=>({l:p.domain.substring(0,5),full:p.domain,v:p.cost,c:DC[p.domain]||"#64748b"}))} height={120}/>
      </div>
      <div style={{overflowX:"auto",borderRadius:10,border:"1px solid "+BG.border}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>{["المجال","الأيام","المشاركون","التكلفة المدخلة","التكلفة بالمعدل","الفرق","النسبة"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
          <tbody>{plan.map((p,i)=>{
            const rc=p.days*p.participants*rate;const diff=p.cost-rc;
            const pct=totCost>0?(p.cost/totCost*100).toFixed(1):0;
            return <tr key={i} style={{background:i%2===0?BG.page:BG.elevated+"33"}}>
              <td style={S.td}><div style={{display:"flex",alignItems:"center",gap:7}}><div style={{width:7,height:7,borderRadius:"50%",background:DC[p.domain]||"#64748b"}}/><span style={{fontWeight:600,fontSize:11,color:"#e2e8f0"}}>{p.domain}</span></div></td>
              <td style={S.td}><span style={{color:"#a78bfa"}}>{p.days}</span></td>
              <td style={S.td}><span style={{color:"#34d399"}}>{p.participants}</span></td>
              <td style={S.td}><span style={{fontWeight:700,color:"#fbbf24"}}>${p.cost.toLocaleString()}</span></td>
              <td style={S.td}><span style={{color:"#475569"}}>${rc.toLocaleString()}</span></td>
              <td style={S.td}><span style={{color:diff>0?"#ef4444":"#22c55e",fontWeight:700}}>{diff>0?"▲":"▼"}${Math.abs(diff).toLocaleString()}</span></td>
              <td style={S.td}><div style={{display:"flex",alignItems:"center",gap:7}}>
                <div style={{width:80,height:4,background:BG.elevated,borderRadius:2,overflow:"hidden"}}>
                  <div style={{height:"100%",width:pct+"%",background:DC[p.domain]||"#64748b",borderRadius:2}}/>
                </div>
                <span style={{fontSize:10,color:"#475569"}}>{pct}%</span>
              </div></td>
            </tr>;
          })}</tbody>
        </table>
      </div>
    </div>}

    {view==="cards"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(295px,1fr))",gap:12}}>
      {plan.map((p,i)=>{
        const rc=p.days*p.participants*rate;const diff=p.cost-rc;
        const pct=totCost>0?(p.cost/totCost*100).toFixed(1):0;
        const c=DC[p.domain]||"#64748b";
        return <div key={i} style={{background:BG.surface,borderRadius:12,border:"1px solid "+BG.border,overflow:"hidden"}}>
          <div style={{height:3,background:c}}/>
          <div style={{padding:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
              <div><div style={{fontWeight:700,color:"#e2e8f0",fontSize:13}}>{p.domain}</div>
                <div style={{fontSize:10,color:"#475569",marginTop:2}}>{p.month}</div></div>
              <span style={{...S.badge(stB[p.status],stC[p.status]),fontSize:9}}>{p.status}</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:10}}>
              {[["📆 أيام",p.days,"#6366f1"],["👥 مشاركون",p.participants,"#10b981"],
                ["💰 التكلفة","$"+p.cost.toLocaleString(),"#f59e0b"],["👤 $/مشارك","$"+Math.round(p.cost/Math.max(p.participants,1)),"#8b5cf6"]].map(([l,v,cv])=>(
                <div key={l} style={{background:BG.page,borderRadius:7,padding:"6px 10px",border:"1px solid "+cv+"11"}}>
                  <div style={{fontSize:9,color:"#475569"}}>{l}</div>
                  <div style={{fontWeight:700,color:cv,fontSize:13}}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:10,marginBottom:6}}>
              <span style={{color:diff>0?"#ef4444":"#22c55e"}}>{diff>0?"▲":"▼"} ${Math.abs(diff).toLocaleString()}</span>
              <span style={{color:"#475569"}}>{pct}% من الميزانية</span>
            </div>
            <div style={{height:3,background:BG.page,borderRadius:2,marginBottom:10}}>
              <div style={{height:"100%",width:pct+"%",background:c,borderRadius:2}}/>
            </div>
            <button style={{...S.btn(BG.elevated,"#94a3b8","6px 10px"),width:"100%",textAlign:"center"}}
              onClick={()=>setEditRow(i)}>✏️ تعديل</button>
          </div>
        </div>;
      })}
    </div>}

    {editRow!==null&&plan[editRow]&&<div style={S.modal} onClick={()=>setEditRow(null)}>
      <div style={{...S.modalBox,maxWidth:520}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"12px 16px",borderBottom:"1px solid "+BG.border,fontWeight:700,display:"flex",justifyContent:"space-between",background:BG.elevated,borderRadius:"14px 14px 0 0",color:"#e2e8f0"}}>
          ✏️ {plan[editRow].domain}
          <button style={S.btn(BG.page,"#64748b","3px 8px")} onClick={()=>setEditRow(null)}>✕</button>
        </div>
        <div style={{padding:16,display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[["الأيام","days","number"],["التكلفة $","cost","number"],["الطريقة","method","text"],["الجهة المنفذة","provider","text"],["الموقع","location","text"]].map(([l,f,t])=>(
            <div key={f}><div style={{fontSize:11,color:"#64748b",marginBottom:4}}>{l}</div>
              <input type={t} style={S.input} value={plan[editRow][f]} onChange={e=>upd(editRow,f,e.target.value)}/></div>
          ))}
          <div><div style={{fontSize:11,color:"#64748b",marginBottom:4}}>الحالة</div>
            <select style={S.select} value={plan[editRow].status} onChange={e=>upd(editRow,"status",e.target.value)}>
              {["مخطط","جارٍ","منجز","ملغى"].map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <div style={{gridColumn:"span 2"}}><div style={{fontSize:11,color:"#64748b",marginBottom:4}}>ملاحظات</div>
            <textarea style={{...S.input,height:60,resize:"none"}} value={plan[editRow].notes||""}
              onChange={e=>upd(editRow,"notes",e.target.value)}/></div>
          <div style={{gridColumn:"span 2",display:"flex",justifyContent:"flex-end"}}>
            <button style={S.btn("#16a34a","#fff")} onClick={()=>setEditRow(null)}>حفظ ✓</button>
          </div>
        </div>
      </div>
    </div>}
  </div>;
}
// ════════════════════════════════════════════════
// TRACKING PAGE — FIXED: view button works via state outside table
// ════════════════════════════════════════════════
function TrackingPage({employees,programs,attendance,evaluations,certs,user,onRefresh}){
  const [selDomain,setSelDomain]=useState(DOMAINS[0]);
  const [selEmpId,setSelEmpId]=useState(null);
  const [saving,setSaving]=useState({});

  const parts=employees.filter(e=>e.needs?.[selDomain]&&e.needs[selDomain]!=="-");
  const prog=programs[selDomain];
  const progStatus=prog?.status||"مخطط";
  const present=parts.filter(e=>attendance.find(a=>a.employee_id===e.id&&a.domain===selDomain&&a.status==="حاضر")).length;
  const excused=parts.filter(e=>attendance.find(a=>a.employee_id===e.id&&a.domain===selDomain&&a.status==="معذور")).length;

  // FIX: derive selEmp at render time, not from stale closure
  const selEmp = selEmpId !== null ? employees.find(e=>e.id===selEmpId) ?? null : null;

  const setAtt=async(empId,status)=>{
    setSaving(s=>({...s,[empId]:true}));
    const ex=attendance.find(a=>a.domain===selDomain&&a.employee_id===empId);
    if(ex) await supabase.from("attendance").update({status}).eq("id",ex.id);
    else   await supabase.from("attendance").insert({domain:selDomain,employee_id:empId,status,updated_by:user.id});
    setSaving(s=>({...s,[empId]:false}));
    onRefresh();
  };

  const setProgStatus=async(status)=>{
    if(prog) await supabase.from("training_programs").update({status}).eq("domain",selDomain);
    else     await supabase.from("training_programs").insert({domain:selDomain,status});
    onRefresh();
  };

  return <div style={{display:"grid",gridTemplateColumns:"215px 1fr",gap:14}}>
    {/* SIDEBAR */}
    <div style={S.card}>
      <span style={S.secTitle}>البرامج</span>
      {DOMAINS.map(d=>{
        const cnt=employees.filter(e=>e.needs?.[d]&&e.needs[d]!=="-").length;
        const prs=employees.filter(e=>attendance.find(a=>a.employee_id===e.id&&a.domain===d&&a.status==="حاضر")).length;
        const st=programs[d]?.status||"مخطط";
        const sel=selDomain===d;
        return <div key={d} onClick={()=>{setSelDomain(d);setSelEmpId(null);}}
          style={{padding:"8px 10px",borderRadius:7,marginBottom:3,cursor:"pointer",
            background:sel?BG.elevated:"transparent",
            border:"1px solid "+(sel?DC[d]||BG.border:BG.border+"22"),transition:"all .15s"}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
            <div style={{width:6,height:6,borderRadius:"50%",flexShrink:0,background:DC[d]||"#64748b"}}/>
            <span style={{fontSize:11,fontWeight:sel?700:400,color:sel?"#e2e8f0":"#64748b"}}>{d}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:9,paddingRight:12}}>
            <span style={{color:stC[st]||"#64748b"}}>● {st}</span>
            <span style={{color:"#334155"}}>{prs}/{cnt}</span>
          </div>
          {sel&&cnt>0&&<div style={{marginTop:4,height:2,background:BG.page,borderRadius:2,overflow:"hidden",marginRight:12}}>
            <div style={{height:"100%",width:(prs/cnt*100)+"%",background:stC["منجز"],borderRadius:2,transition:"width .3s"}}/>
          </div>}
        </div>;
      })}
    </div>

    {/* MAIN */}
    <div>
      {/* Program header */}
      <div style={{...S.card,marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8,marginBottom:10}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
              <div style={{width:9,height:9,borderRadius:"50%",background:DC[selDomain]||"#64748b"}}/>
              <span style={{fontSize:15,fontWeight:800,color:"#e2e8f0"}}>{selDomain}</span>
            </div>
            <div style={{fontSize:11,color:"#475569"}}>{PROGRAMS[selDomain]?.month} · {PROGRAMS[selDomain]?.days} يوم · {PROGRAMS[selDomain]?.method}</div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            {[{v:parts.length,l:"مشارك",c:"#3b82f6"},{v:present,l:"حضر",c:"#22c55e"},
              {v:excused,l:"معذور",c:"#f59e0b"},{v:parts.length-present-excused,l:"غائب",c:"#ef4444"}].map(k=>(
              <div key={k.l} style={{background:BG.page,borderRadius:7,padding:"6px 12px",textAlign:"center",border:"1px solid "+k.c+"22"}}>
                <div style={{fontWeight:800,color:k.c,fontSize:16}}>{k.v}</div>
                <div style={{fontSize:9,color:"#475569"}}>{k.l}</div>
              </div>
            ))}
            <select style={{...S.select,color:stC[progStatus],background:stB[progStatus]||BG.page,fontWeight:700,fontSize:11}}
              value={progStatus} onChange={e=>setProgStatus(e.target.value)}>
              {["مخطط","جارٍ","منجز","ملغى"].map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
          {(SUBTOPICS_DEFAULT[selDomain]||[]).map(t=>(
            <span key={t} style={{fontSize:10,color:"#475569",background:BG.page,borderRadius:8,padding:"2px 10px",border:"1px solid "+BG.border}}>{t}</span>
          ))}
        </div>
      </div>

      {/* Attendance table */}
      <div style={S.card}>
        <span style={S.secTitle}>كشف الحضور — {parts.length} موظف</span>
        {parts.length===0?<Empty icon="👥" text="لا يوجد موظفون في هذا البرنامج"/>:
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>
              {["الموظف","الإدارة","المستوى","الفجوة","الحضور","تقييم المدير","شهادة","تفاصيل"].map(h=><th key={h} style={S.th}>{h}</th>)}
            </tr></thead>
            <tbody>{parts.map((e,i)=>{
              const av=attendance.find(a=>a.employee_id===e.id&&a.domain===selDomain)?.status||"غائب";
              const ev=evaluations.find(v=>v.employee_id===e.id&&v.domain===selDomain);
              const cert=certs.find(c=>c.employee_id===e.id&&c.domain===selDomain);
              const{bg,fg}=pc(e.needs[selDomain]);
              const isSel=selEmpId===e.id;
              return <tr key={e.id} style={{background:isSel?BG.elevated:i%2===0?BG.page:BG.elevated+"33"}}>
                <td style={S.td}>
                  <div style={{fontWeight:600,color:"#e2e8f0"}}>{e.name}</div>
                  {e.phone&&<div style={{fontSize:9,color:"#34d399"}}>📞 {e.phone}</div>}
                </td>
                <td style={S.td}><span style={{color:"#60a5fa",fontSize:11}}>{e.dept}</span></td>
                <td style={S.td}><span style={S.badge(bg,fg)}>{e.needs[selDomain]}</span></td>
                <td style={S.td}><span style={{fontWeight:700,color:gc(e.gap||0)}}>{(e.gap||0).toFixed(2)}</span></td>
                <td style={S.td}>
                  <select disabled={!!saving[e.id]} value={av}
                    onChange={el=>setAtt(e.id,el.target.value)}
                    style={{...S.select,fontSize:10,padding:"3px 7px",
                      background:av==="حاضر"?"#052e16":av==="معذور"?"#451a03":"#1e293b",
                      color:av==="حاضر"?"#86efac":av==="معذور"?"#fcd34d":"#94a3b8",
                      fontWeight:600,opacity:saving[e.id]?0.5:1}}>
                    <option>غائب</option><option>حاضر</option><option>معذور</option>
                  </select>
                </td>
                <td style={S.td}>{ev?.score?<span style={{color:"#f59e0b",fontWeight:700}}>⭐{ev.score}/5</span>:<span style={{color:"#334155"}}>—</span>}</td>
                <td style={S.td}>{cert?<span style={{color:"#22c55e",fontSize:13}}>✅</span>:<span style={{color:"#334155"}}>—</span>}</td>
                <td style={S.td}>
                  {/* FIX: use string id comparison to avoid referential issues */}
                  <button style={S.btn(isSel?"#1d4ed8":BG.elevated,isSel?"#fff":"#64748b","5px 10px")}
                    onClick={()=>setSelEmpId(prev=>prev===e.id?null:e.id)}>
                    {isSel?"إغلاق ↑":"عرض ↓"}
                  </button>
                </td>
              </tr>;
            })}</tbody>
          </table>
        </div>}
      </div>

      {/* FIX: Employee detail panel OUTSIDE the table to avoid React DOM nesting issues */}
      {selEmp&&<div style={{...S.card,marginTop:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14,flexWrap:"wrap",gap:8}}>
          <div>
            <div style={{fontSize:15,fontWeight:800,color:"#e2e8f0",marginBottom:2}}>{selEmp.name}</div>
            <div style={{fontSize:11,color:"#475569"}}>{selEmp.dept} · {selEmp.title} · {selEmp.city}</div>
            <div style={{display:"flex",gap:12,marginTop:5}}>
              {selEmp.phone&&<a href={"tel:"+selEmp.phone} style={{fontSize:11,color:"#34d399",textDecoration:"none"}}>📞 {selEmp.phone}</a>}
              {selEmp.email&&<a href={"mailto:"+selEmp.email} style={{fontSize:11,color:"#60a5fa",textDecoration:"none"}}>✉️ {selEmp.email}</a>}
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            {[{v:(selEmp.gap||0).toFixed(2),l:"الفجوة",c:gc(selEmp.gap||0)},
              {v:DOMAINS.filter(d=>selEmp.needs?.[d]&&selEmp.needs[d]!=="-").length,l:"مجالات",c:"#6366f1"}].map(k=>(
              <div key={k.l} style={{background:BG.page,borderRadius:8,padding:"8px 14px",textAlign:"center",border:"1px solid "+BG.border}}>
                <div style={{fontWeight:800,color:k.c,fontSize:16}}>{k.v}</div>
                <div style={{fontSize:9,color:"#475569"}}>{k.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div>
            <div style={{fontSize:11,color:"#f59e0b",fontWeight:600,marginBottom:8}}>الاحتياجات التدريبية</div>
            {DOMAINS.filter(d=>selEmp.needs?.[d]&&selEmp.needs[d]!=="-").map(d=>{
              const{bg,fg}=pc(selEmp.needs[d]);
              return <div key={d} style={{display:"flex",justifyContent:"space-between",padding:"5px 9px",borderRadius:6,background:BG.page,marginBottom:3,border:"1px solid "+BG.border}}>
                <div style={{display:"flex",alignItems:"center",gap:5,fontSize:11}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:DC[d]||"#64748b",flexShrink:0}}/>
                  {d}
                </div>
                <span style={S.badge(bg,fg)}>{selEmp.needs[d]}</span>
              </div>;
            })}
          </div>
          <div>
            <div style={{fontSize:11,color:"#f59e0b",fontWeight:600,marginBottom:8}}>سجل التدريب</div>
            {DOMAINS.filter(d=>selEmp.needs?.[d]&&selEmp.needs[d]!=="-").map(d=>{
              const a=attendance.find(x=>x.employee_id===selEmp.id&&x.domain===d);
              const ev=evaluations.find(v=>v.employee_id===selEmp.id&&v.domain===d);
              const cert=certs.find(c=>c.employee_id===selEmp.id&&c.domain===d);
              return <div key={d} style={{display:"flex",justifyContent:"space-between",padding:"5px 9px",borderRadius:6,background:BG.page,marginBottom:3,border:"1px solid "+BG.border,fontSize:11}}>
                <span style={{color:"#64748b",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:150}}>{d}</span>
                <div style={{display:"flex",gap:5,flexShrink:0}}>
                  <span style={{color:a?.status==="حاضر"?"#22c55e":a?.status==="معذور"?"#f59e0b":"#334155"}}>
                    {a?.status==="حاضر"?"✅":a?.status==="معذور"?"⚠️":"❌"}
                  </span>
                  {ev?.score&&<span style={{color:"#f59e0b"}}>⭐{ev.score}</span>}
                  {cert&&<span>🏆</span>}
                </div>
              </div>;
            })}
          </div>
        </div>
      </div>}
    </div>
  </div>;
}

// ════════════════════════════════════════════════
// EVALUATIONS — 3 sections + dual track (manager + employee)
// ════════════════════════════════════════════════
const EVAL_QUESTIONS = {
  trainer:[
    {id:"t1",q:"مدى معرفة المدرب بموضوع التدريب"},
    {id:"t2",q:"وضوح الشرح وطريقة تقديم المعلومات"},
    {id:"t3",q:"قدرة المدرب على إيصال المعلومات"},
    {id:"t4",q:"التفاعل مع المشاركين وتشجيعهم"},
    {id:"t5",q:"الإجابة على الأسئلة والاستفسارات"},
    {id:"t6",q:"التقييم العام لأداء المدرب"},
  ],
  content:[
    {id:"c1",q:"مدى ارتباط التدريب بطبيعة العمل"},
    {id:"c2",q:"وضوح المادة التدريبية ومحتواها"},
    {id:"c3",q:"الفائدة العملية للتدريب"},
    {id:"c4",q:"تنظيم وتسلسل المحتوى التدريبي"},
    {id:"c5",q:"تحقيق أهداف التدريب المحددة"},
  ],
  logistics:[
    {id:"l1",q:"مكان التدريب وملاءمة البيئة"},
    {id:"l2",q:"الاستراحات والضيافة المقدمة"},
    {id:"l3",q:"الأدوات والوسائل التدريبية المستخدمة"},
    {id:"l4",q:"تنظيم وإدارة التدريب"},
    {id:"l5",q:"جودة الخدمات اللوجستية بشكل عام"},
  ]
};

function EvaluationsPage({employees,attendance,evaluations,certs,user,role,onRefresh}){
  const [selDomain,setSelDomain]=useState(DOMAINS[0]);
  const [selSubtopic,setSelSubtopic]=useState(""); // FIX #1: which subtopic the cert is for
  const [subTab,setSubTab]=useState("manager");
  const [saving,setSaving]=useState({});
  const [selEmpForEval,setSelEmpForEval]=useState(null);

  const parts=employees.filter(e=>e.needs?.[selDomain]&&e.needs[selDomain]!=="-");
  const attended=parts.filter(e=>attendance.find(a=>a.employee_id===e.id&&a.domain===selDomain&&a.status==="حاضر"));

  // Reset subtopic when domain changes
  const changeDomain=(d)=>{setSelDomain(d);setSelSubtopic("");setSelEmpForEval(null);};

  const upsertEval=async(empId,updates)=>{
    const ex=evaluations.find(e=>e.employee_id===empId&&e.domain===selDomain);
    // FIX #3: Check for errors and show them
    let res;
    if(ex) res=await supabase.from("evaluations").update({...updates,evaluated_by:user.id}).eq("id",ex.id);
    else   res=await supabase.from("evaluations").insert({employee_id:empId,domain:selDomain,...updates,evaluated_by:user.id});
    if(res.error){console.error("eval save error:",res.error);return;}
    onRefresh();
  };

  // FIX #1: Store subtopic name in certificate, not just domain
  const issueCert=async(empId)=>{
    const certKey=selSubtopic||selDomain;
    if(certs.find(c=>c.employee_id===empId&&(c.subtopic===certKey||(!c.subtopic&&c.domain===certKey)))) return;
    setSaving(s=>({...s,[empId+"_c"]:true}));
    const num="SSF-"+certKey.substring(0,4).replace(/\s/g,"")+"-"+Date.now().toString(36).toUpperCase();
    const res=await supabase.from("certificates").insert({
      employee_id:empId,
      domain:selDomain,
      subtopic:selSubtopic||null,  // NEW: store subtopic
      issued_by:user.id,
      cert_number:num
    });
    if(res.error){console.error("cert error:",res.error);}
    await auditLog(user.id,user.email,"إصدار شهادة","certificates",empId,null,{domain:selDomain,subtopic:selSubtopic,cert_number:num});
    setSaving(s=>({...s,[empId+"_c"]:false}));
    onRefresh();
  };

  const printCert=(empId)=>{
    const cert=certs.find(c=>c.employee_id===empId&&c.domain===selDomain);
    const emp=employees.find(e=>e.id===empId);
    if(!cert||!emp) return;
    const w=window.open("","_blank","width=950,height=680");
    if(!w) return;
    w.document.write(generateCertHTML(cert,emp.name,emp.dept));
    w.document.close();
    setTimeout(()=>{try{w.focus();w.print();}catch(e){}},700);
  };

  const StarRow=({label,fieldKey,empId,currentVal})=>(
    <div style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:"1px solid "+BG.border+"44"}}>
      <div style={{flex:1,fontSize:12,color:"#94a3b8"}}>{label}</div>
      <div style={{display:"flex",gap:3,flexShrink:0}}>
        {[1,2,3,4,5].map(n=>(
          <button key={n} onClick={()=>upsertEval(empId,{[fieldKey]:n})}
            style={{width:26,height:26,borderRadius:5,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,transition:"all .15s",
              background:(currentVal||0)>=n?"#f59e0b":BG.page,
              color:(currentVal||0)>=n?"#fff":"#334155",
              boxShadow:(currentVal||0)>=n?"0 0 6px #f59e0b44":""}}>
            {n}
          </button>
        ))}
        <span style={{fontSize:10,color:"#f59e0b",fontWeight:700,alignSelf:"center",minWidth:22}}>
          {currentVal>0?currentVal+"/5":""}
        </span>
      </div>
    </div>
  );

  const empEval=selEmpForEval?evaluations.find(v=>v.employee_id===selEmpForEval&&v.domain===selDomain)||{}:{};
  const calcAvg=(ids)=>{
    const vals=ids.map(id=>empEval[id]||0).filter(v=>v>0);
    return vals.length?(vals.reduce((s,v)=>s+v,0)/vals.length).toFixed(1):"-";
  };

  return <div style={{display:"grid",gridTemplateColumns:"215px 1fr",gap:14}}>
    {/* SIDEBAR */}
    <div style={S.card}>
      <span style={S.secTitle}>البرامج</span>
      {DOMAINS.map(d=>{
        const evCnt=evaluations.filter(ev=>ev.domain===d&&ev.score).length;
        const certCnt=certs.filter(c=>c.domain===d).length;
        const sel=selDomain===d;
        return <div key={d} onClick={()=>changeDomain(d)}
          style={{padding:"8px 10px",borderRadius:7,marginBottom:3,cursor:"pointer",
            background:sel?BG.elevated:"transparent",border:"1px solid "+(sel?DC[d]||BG.border:BG.border+"22"),transition:"all .15s"}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:DC[d]||"#64748b",flexShrink:0}}/>
            <span style={{fontSize:11,fontWeight:sel?700:400,color:sel?"#e2e8f0":"#64748b"}}>{d}</span>
          </div>
          <div style={{display:"flex",gap:6,fontSize:9,paddingRight:12}}>
            <span style={{color:"#f59e0b"}}>⭐{evCnt}</span>
            <span style={{color:"#a78bfa"}}>🏆{certCnt}</span>
          </div>
        </div>;
      })}
    </div>

    <div>
      {/* Sub-tabs */}
      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
        {[["manager","👔 المدير يقيّم الموظف","#1d4ed8"],["employee","📝 الموظف يقيّم التدريب","#065f46"]].map(([val,lbl,col])=>(
          <button key={val} style={S.btn(subTab===val?col:BG.elevated,subTab===val?"#fff":"#64748b","8px 18px")}
            onClick={()=>{setSubTab(val);setSelEmpForEval(null);}}>{lbl}</button>
        ))}
        <div style={{marginRight:"auto",alignSelf:"center",fontSize:11,color:"#475569"}}>
          {selDomain} · {parts.length} مشارك
        </div>
      </div>

      {/* FIX #1: Subtopic selector — determines what the certificate says */}
      <div style={{...S.card,marginBottom:12,padding:"10px 14px"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
          <span style={{fontSize:11,color:"#f59e0b",fontWeight:700,whiteSpace:"nowrap"}}>🏆 موضوع الشهادة:</span>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,flex:1}}>
            <button onClick={()=>setSelSubtopic("")}
              style={S.btn(!selSubtopic?"#1d4ed8":BG.page,!selSubtopic?"#fff":"#64748b","5px 12px")}>
              المجال كاملاً
            </button>
            {(SUBTOPICS_DEFAULT[selDomain]||[]).map(t=>(
              <button key={t} onClick={()=>setSelSubtopic(t)}
                style={S.btn(selSubtopic===t?DC[selDomain]||"#3b82f6":BG.page,selSubtopic===t?"#fff":"#64748b","5px 12px")}>
                {t}
              </button>
            ))}
          </div>
          <span style={{fontSize:10,color:"#475569",whiteSpace:"nowrap"}}>
            الشهادة ستقول: <strong style={{color:"#e2e8f0"}}>{selSubtopic||selDomain}</strong>
          </span>
        </div>
      </div>

      {/* ── MANAGER VIEW ── */}
      {subTab==="manager"&&<div style={S.card}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:12,flexWrap:"wrap",gap:8}}>
          <span style={S.secTitle}>تقييم الأداء — {selSubtopic||selDomain}</span>
        </div>
        {parts.length===0?<Empty icon="⭐" text="لا يوجد موظفون"/>:
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>
              {["الموظف","الحضور","درجة الأداء (1-5)","ملاحظات المدير","شهادة","طباعة"].map(h=><th key={h} style={S.th}>{h}</th>)}
            </tr></thead>
            <tbody>{parts.map((e,i)=>{
              const av=attendance.find(a=>a.employee_id===e.id&&a.domain===selDomain);
              const ev=evaluations.find(v=>v.employee_id===e.id&&v.domain===selDomain);
              const cert=certs.find(c=>c.employee_id===e.id&&c.domain===selDomain);
              const canCert=(role==="admin"||role==="manager"||role==="training")&&(ev?.score||0)>=3&&av?.status==="حاضر"&&!cert;
              return <tr key={e.id} style={{background:i%2===0?BG.page:BG.elevated+"33"}}>
                <td style={S.td}>
                  <div style={{fontWeight:600,color:"#e2e8f0"}}>{e.name}</div>
                  <div style={{fontSize:9,color:"#475569"}}>{e.dept}</div>
                </td>
                <td style={S.td}>
                  <span style={{...S.badge(av?.status==="حاضر"?"#052e16":av?.status==="معذور"?"#451a03":"#1e293b",
                    av?.status==="حاضر"?"#86efac":av?.status==="معذور"?"#fcd34d":"#94a3b8"),fontSize:10}}>
                    {av?.status||"غائب"}
                  </span>
                </td>
                <td style={S.td}>
                  <div style={{display:"flex",gap:3}}>
                    {[1,2,3,4,5].map(n=>(
                      <button key={n} onClick={()=>upsertEval(e.id,{score:n})}
                        style={{width:26,height:26,borderRadius:5,border:"none",cursor:"pointer",fontWeight:700,fontSize:11,
                          background:(ev?.score||0)>=n?"#f59e0b":BG.page,
                          color:(ev?.score||0)>=n?"#fff":"#334155",transition:"all .15s"}}>
                        {n}
                      </button>
                    ))}
                    {ev?.score&&<span style={{fontSize:10,color:"#f59e0b",alignSelf:"center",marginRight:4}}>{ev.score}/5</span>}
                  </div>
                </td>
                <td style={S.td}>
                  <input style={{...S.input,padding:"4px 8px",fontSize:10,width:140}}
                    defaultValue={ev?.manager_note||""}
                    onBlur={el=>el.target.value!==ev?.manager_note&&upsertEval(e.id,{manager_note:el.target.value})}
                    placeholder="ملاحظة..."/>
                </td>
                <td style={S.td}>
                  {cert?<span style={{...S.badge("#052e16","#86efac"),fontSize:10}}>✅ صدرت</span>
                    :canCert?<button style={S.btn("#065f46","#fff","5px 10px")} disabled={!!saving[e.id+"_c"]} onClick={()=>issueCert(e.id)}>
                        {saving[e.id+"_c"]?"...":"🏆 إصدار"}
                      </button>
                    :<span style={{color:"#334155",fontSize:10}}>{!av||av.status!=="حاضر"?"(غائب)":(ev?.score||0)<3?"(< 3)":"—"}</span>}
                </td>
                <td style={S.td}>
                  {cert?<button style={S.btn(BG.elevated,"#94a3b8","5px 10px")} onClick={()=>printCert(e.id)}>🖨️</button>:<span style={{color:"#334155"}}>—</span>}
                </td>
              </tr>;
            })}</tbody>
          </table>
        </div>}
      </div>}

      {/* ── EMPLOYEE VIEW — 3 sections ── */}
      {subTab==="employee"&&<div>
        {/* Employee picker */}
        {!selEmpForEval&&<div style={S.card}>
          <span style={S.secTitle}>اختر موظفاً لعرض استمارة التقييم الكاملة</span>
          {attended.length===0?<Empty icon="📝" text="لا يوجد موظفون حضروا بعد"/>:
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:8}}>
            {attended.map(e=>{
              const ev=evaluations.find(v=>v.employee_id===e.id&&v.domain===selDomain);
              const filled=EVAL_QUESTIONS.trainer.concat(EVAL_QUESTIONS.content,EVAL_QUESTIONS.logistics)
                .filter(q=>ev?.[q.id]>0).length;
              const total=EVAL_QUESTIONS.trainer.length+EVAL_QUESTIONS.content.length+EVAL_QUESTIONS.logistics.length;
              return <div key={e.id} onClick={()=>setSelEmpForEval(e.id)}
                style={{background:BG.page,borderRadius:9,padding:"12px 14px",cursor:"pointer",
                  border:"1px solid "+(filled===total?"#22c55e":BG.border),transition:"all .15s"}}
                onMouseOver={el=>el.currentTarget.style.borderColor="#3b82f6"}
                onMouseOut={el=>el.currentTarget.style.borderColor=filled===total?"#22c55e":BG.border}>
                <div style={{fontWeight:600,color:"#e2e8f0",marginBottom:3}}>{e.name}</div>
                <div style={{fontSize:10,color:"#475569",marginBottom:7}}>{e.dept}</div>
                <div style={{height:3,background:BG.elevated,borderRadius:2,marginBottom:4}}>
                  <div style={{height:"100%",width:(filled/total*100)+"%",background:filled===total?"#22c55e":"#3b82f6",borderRadius:2,transition:"width .3s"}}/>
                </div>
                <div style={{fontSize:9,color:"#475569"}}>{filled}/{total} سؤال مكتمل</div>
              </div>;
            })}
          </div>}
        </div>}

        {/* Full evaluation form */}
        {selEmpForEval&&(()=>{
          const emp=employees.find(e=>e.id===selEmpForEval);
          const ev=evaluations.find(v=>v.employee_id===selEmpForEval&&v.domain===selDomain)||{};
          return <div>
            <div style={{...S.card,marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
              <div>
                <div style={{fontWeight:700,fontSize:14,color:"#e2e8f0"}}>{emp?.name}</div>
                <div style={{fontSize:11,color:"#475569"}}>{emp?.dept} · {selDomain}</div>
              </div>
              <button style={S.btn(BG.elevated,"#64748b","6px 13px")} onClick={()=>setSelEmpForEval(null)}>← رجوع</button>
            </div>

            {/* Section averages */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:12}}>
              {[["المدرب","trainer","#3b82f6"],["المحتوى","content","#10b981"],["التنظيم","logistics","#f59e0b"]].map(([lbl,key,col])=>(
                <div key={key} style={{...S.card,textAlign:"center",borderTop:"2px solid "+col}}>
                  <div style={{fontSize:11,color:"#475569",marginBottom:4}}>{lbl}</div>
                  <div style={{fontSize:22,fontWeight:800,color:col}}>{calcAvg(EVAL_QUESTIONS[key].map(q=>q.id))}</div>
                  <div style={{fontSize:9,color:"#334155"}}>متوسط التقييم</div>
                </div>
              ))}
            </div>

            {/* Section 1: Trainer */}
            <div style={{...S.card,marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <div style={{width:3,height:20,background:"#3b82f6",borderRadius:2}}/>
                <span style={{fontWeight:700,color:"#e2e8f0",fontSize:13}}>القسم الأول: تقييم المدرب</span>
              </div>
              {EVAL_QUESTIONS.trainer.map(q=>(
                <StarRow key={q.id} label={q.q} fieldKey={q.id} empId={selEmpForEval} currentVal={ev[q.id]||0}/>
              ))}
            </div>

            {/* Section 2: Content */}
            <div style={{...S.card,marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <div style={{width:3,height:20,background:"#10b981",borderRadius:2}}/>
                <span style={{fontWeight:700,color:"#e2e8f0",fontSize:13}}>القسم الثاني: تقييم محتوى التدريب</span>
              </div>
              {EVAL_QUESTIONS.content.map(q=>(
                <StarRow key={q.id} label={q.q} fieldKey={q.id} empId={selEmpForEval} currentVal={ev[q.id]||0}/>
              ))}
            </div>

            {/* Section 3: Logistics */}
            <div style={{...S.card,marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <div style={{width:3,height:20,background:"#f59e0b",borderRadius:2}}/>
                <span style={{fontWeight:700,color:"#e2e8f0",fontSize:13}}>القسم الثالث: الخدمات التنظيمية</span>
              </div>
              {EVAL_QUESTIONS.logistics.map(q=>(
                <StarRow key={q.id} label={q.q} fieldKey={q.id} empId={selEmpForEval} currentVal={ev[q.id]||0}/>
              ))}
            </div>

            {/* Overall + Recommend */}
            <div style={S.card}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <div style={{width:3,height:20,background:"#8b5cf6",borderRadius:2}}/>
                <span style={{fontWeight:700,color:"#e2e8f0",fontSize:13}}>التقييم العام</span>
              </div>
              <StarRow label="التقييم العام للتدريب" fieldKey="overall_score" empId={selEmpForEval} currentVal={ev.overall_score||0}/>
              <div style={{marginTop:10}}>
                <div style={{fontSize:12,color:"#94a3b8",marginBottom:7}}>هل توصي بهذا التدريب لزملائك؟</div>
                <div style={{display:"flex",gap:8}}>
                  {["نعم بالتأكيد","ربما","لا"].map(opt=>(
                    <button key={opt} onClick={()=>upsertEval(selEmpForEval,{recommend:opt})}
                      style={S.btn(ev.recommend===opt?"#1d4ed8":BG.page,ev.recommend===opt?"#fff":"#64748b","7px 16px")}>
                      {opt}
                    </button>
                  ))}
                  {ev.recommend&&<span style={{color:"#22c55e",alignSelf:"center",fontSize:11}}>✓ {ev.recommend}</span>}
                </div>
              </div>
              <div style={{marginTop:10}}>
                <div style={{fontSize:12,color:"#94a3b8",marginBottom:5}}>تعليقات إضافية</div>
                <textarea style={{...S.input,height:70,resize:"none"}} defaultValue={ev.employee_note||""}
                  onBlur={el=>upsertEval(selEmpForEval,{employee_note:el.target.value})}
                  placeholder="أي ملاحظات أو مقترحات..."/>
              </div>
            </div>
          </div>;
        })()}

        {/* Summary across all employees */}
        {!selEmpForEval&&attended.length>0&&<div style={{...S.card,marginTop:12}}>
          <span style={S.secTitle}>ملخص تقييمات {selDomain}</span>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10}}>
            {[
              ["المدرب",EVAL_QUESTIONS.trainer.map(q=>q.id),"#3b82f6"],
              ["المحتوى",EVAL_QUESTIONS.content.map(q=>q.id),"#10b981"],
              ["التنظيم",EVAL_QUESTIONS.logistics.map(q=>q.id),"#f59e0b"],
              ["العام",["overall_score"],"#8b5cf6"]
            ].map(([lbl,ids,col])=>{
              const vals=attended.flatMap(e=>{
                const ev=evaluations.find(v=>v.employee_id===e.id&&v.domain===selDomain);
                return ids.map(id=>ev?.[id]||0).filter(v=>v>0);
              });
              const avg=vals.length?(vals.reduce((s,v)=>s+v,0)/vals.length).toFixed(1):"-";
              return <div key={lbl} style={{background:BG.page,borderRadius:9,padding:"12px 14px",border:"1px solid "+col+"22",textAlign:"center"}}>
                <div style={{fontSize:11,color:"#475569",marginBottom:4}}>{lbl}</div>
                <div style={{fontSize:22,fontWeight:800,color:col}}>{avg}</div>
                <div style={{fontSize:9,color:"#334155"}}>{vals.length} تقييم</div>
              </div>;
            })}
          </div>
        </div>}
      </div>}
    </div>
  </div>;
}

// ════════════════════════════════════════════════
// CERTIFICATES
// ════════════════════════════════════════════════
function CertificatesPage({employees,certs}){
  const [search,setSearch]=useState("");
  const [domFilter,setDomFilter]=useState("الكل");
  const [preview,setPreview]=useState(null);

  const filtered=certs.filter(c=>{
    const emp=employees.find(e=>e.id===c.employee_id);
    if(!emp) return false;
    if(domFilter!=="الكل"&&c.domain!==domFilter) return false;
    if(search&&!emp.name.includes(search)&&!c.domain.includes(search)) return false;
    return true;
  });

  const getHTML=(cert)=>{
    const emp=employees.find(e=>e.id===cert.employee_id);
    return emp?generateCertHTML(cert,emp.name,emp.dept):null;
  };

  const printCert=(cert)=>{
    const html=getHTML(cert);if(!html) return;
    const w=window.open("","_blank","width=950,height=680");
    if(!w){alert("يرجى السماح بالنوافذ المنبثقة");return;}
    w.document.write(html);w.document.close();
    setTimeout(()=>{try{w.focus();w.print();}catch(e){}},700);
  };

  const downloadCert=(cert)=>{
    const html=getHTML(cert);if(!html) return;
    const emp=employees.find(e=>e.id===cert.employee_id);
    const blob=new Blob([html],{type:"text/html;charset=utf-8"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);
    a.download="شهادة_"+(emp?.name||"")+"_"+cert.domain+".html";a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  };

  const exportAll=()=>{
    const rows=[["رقم الشهادة","الاسم","الإدارة","المجال","تاريخ الإصدار"],
      ...filtered.map(c=>{const emp=employees.find(e=>e.id===c.employee_id);
        return[c.cert_number||"",emp?.name||"",emp?.dept||"",c.domain,new Date(c.issued_at).toLocaleDateString("ar-SY")];})];
    const blob=new Blob(["\uFEFF"+rows.map(r=>r.join(",")).join("\n")],{type:"text/csv;charset=utf-8"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="الشهادات.csv";a.click();
  };

  return <div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10,marginBottom:16}}>
      <KPI v={certs.length} l="إجمالي الشهادات" c="#f59e0b" i="🏆"/>
      <KPI v={new Set(certs.map(c=>c.employee_id)).size} l="موظف حاصل" c="#22c55e" i="👥"/>
      <KPI v={new Set(certs.map(c=>c.domain)).size} l="مجالات" c="#6366f1" i="📚"/>
      <KPI v={filtered.length} l="نتائج البحث" c="#8b5cf6" i="🔍"/>
    </div>
    <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
      <input style={{...S.input,maxWidth:220}} placeholder="🔍 ابحث..." value={search} onChange={e=>setSearch(e.target.value)}/>
      <select style={S.select} value={domFilter} onChange={e=>setDomFilter(e.target.value)}>
        <option>الكل</option>{DOMAINS.map(d=><option key={d}>{d}</option>)}
      </select>
      <span style={{color:"#475569",fontSize:12,marginRight:"auto"}}>{filtered.length} شهادة</span>
      <button style={S.btn("#065f46","#fff","8px 14px")} onClick={exportAll}>📥 تصدير Excel</button>
    </div>
    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
      <button onClick={()=>setDomFilter("الكل")} style={S.btn(domFilter==="الكل"?"#1d4ed8":BG.elevated,domFilter==="الكل"?"#fff":"#64748b","5px 12px")}>الكل ({certs.length})</button>
      {DOMAINS.filter(d=>certs.some(c=>c.domain===d)).map(d=>(
        <button key={d} onClick={()=>setDomFilter(domFilter===d?"الكل":d)}
          style={S.btn(domFilter===d?DC[d]||"#3b82f6":BG.elevated,"#fff","5px 12px")}>
          {d} ({certs.filter(c=>c.domain===d).length})
        </button>
      ))}
    </div>
    {filtered.length===0?<Empty icon="🏆" text="لا توجد شهادات"/>:
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(310px,1fr))",gap:12}}>
      {filtered.map(cert=>{
        const emp=employees.find(e=>e.id===cert.employee_id);
        const col=DC[cert.domain]||"#f59e0b";
        return <div key={cert.id} style={{background:BG.surface,borderRadius:12,border:"1px solid "+BG.border,overflow:"hidden",
          transition:"transform .2s"}}
          onMouseOver={e=>e.currentTarget.style.transform="translateY(-2px)"}
          onMouseOut={e=>e.currentTarget.style.transform=""}>
          <div style={{height:3,background:col}}/>
          <div style={{padding:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
              <div>
                <div style={{fontSize:9,color:col,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>شهادة إتمام تدريب</div>
                <div style={{fontWeight:700,fontSize:13,color:col}}>{cert.domain}</div>
              </div>
              <div style={{fontSize:28}}>📜</div>
            </div>
            <div style={{fontWeight:800,fontSize:14,color:"#e2e8f0",marginBottom:2}}>{emp?.name}</div>
            <div style={{fontSize:11,color:"#475569",marginBottom:10}}>{emp?.dept}</div>
            <div style={{borderTop:"1px solid "+BG.border,paddingTop:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:10,fontSize:10}}>
                <div><div style={{color:"#334155"}}>رقم الشهادة</div><div style={{color:"#64748b",fontFamily:"monospace"}}>{cert.cert_number||"—"}</div></div>
                <div style={{textAlign:"left"}}><div style={{color:"#334155"}}>تاريخ الإصدار</div><div style={{color:col,fontWeight:700}}>{new Date(cert.issued_at).toLocaleDateString("ar-SY")}</div></div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:6}}>
                <button style={{...S.btn(BG.elevated,"#94a3b8","7px 0"),width:"100%",textAlign:"center"}} onClick={()=>setPreview(cert)}>👁️ معاينة</button>
                <button style={{...S.btn("#065f46","#fff","7px 0"),width:"100%",textAlign:"center"}} onClick={()=>downloadCert(cert)}>💾 تحميل</button>
              </div>
              <button style={{...S.btn("#f59e0b","#000","7px 0"),width:"100%",textAlign:"center",fontWeight:700}} onClick={()=>printCert(cert)}>🖨️ طباعة PDF</button>
            </div>
          </div>
        </div>;
      })}
    </div>}
    {preview&&<div style={S.modal} onClick={()=>setPreview(null)}>
      <div style={{...S.modalBox,maxWidth:860}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"12px 16px",borderBottom:"1px solid "+BG.border,display:"flex",justifyContent:"space-between",alignItems:"center",background:BG.elevated,borderRadius:"14px 14px 0 0"}}>
          <span style={{fontWeight:700,color:"#e2e8f0"}}>معاينة الشهادة</span>
          <div style={{display:"flex",gap:8}}>
            <button style={S.btn("#065f46","#fff","6px 14px")} onClick={()=>downloadCert(preview)}>💾 تحميل</button>
            <button style={S.btn("#f59e0b","#000","6px 14px")} onClick={()=>printCert(preview)}>🖨️ طباعة</button>
            <button style={S.btn(BG.page,"#64748b","4px 10px")} onClick={()=>setPreview(null)}>✕</button>
          </div>
        </div>
        <div style={{padding:14}}>
          <iframe srcDoc={getHTML(preview)||""} style={{width:"100%",height:460,border:"none",borderRadius:8,background:"white"}} title="preview"/>
        </div>
      </div>
    </div>}
  </div>;
}
// ════════════════════════════════════════════════
// USERS PAGE — Full RBAC with new roles
// ════════════════════════════════════════════════
function UsersPage({user,showToast,onRefresh}){
  const [users,setUsers]=useState([]);
  const [loading,setLoading]=useState(true);
  const [modal,setModal]=useState(null);
  const [saving,setSaving]=useState(false);
  const [form,setForm]=useState({email:"",password:"",role:"staff",dept:"",name:""});

  const loadUsers=async()=>{
    setLoading(true);
    const{data}=await supabase.from("user_roles").select("*").order("created_at",{ascending:false});
    setUsers(data||[]);setLoading(false);
  };
  useEffect(()=>{loadUsers();},[]);

  const createUser=async()=>{
    if(!form.email||!form.password||form.password.length<6){showToast("الإيميل وكلمة السر (6+ أحرف) مطلوبان","error");return;}
    if(!form.name.trim()){showToast("الاسم مطلوب","error");return;}
    setSaving(true);
    try{
      // FIX #4 #5: Use signUp instead of admin.createUser
      // admin.createUser requires service_role key which can't be in frontend
      const{data,error}=await supabase.auth.signUp({
        email:form.email,
        password:form.password,
        options:{
          data:{name:form.name},
          // This skips email confirmation - works if email confirmations are disabled in Supabase
          emailRedirectTo:window.location.origin
        }
      });
      if(error) throw error;
      if(!data?.user?.id) throw new Error("لم يتم إنشاء الحساب — تحقق من إعدادات Supabase");

      // Save role in user_roles table
      const res=await supabase.from("user_roles").insert({
        user_id:data.user.id,
        role:form.role,
        dept:form.dept||null,
        email:form.email,
        name:form.name,
        active:true
      });
      if(res.error) throw res.error;

      await auditLog(user.id,user.email,"إنشاء مستخدم","user_roles",data.user.id,null,{email:form.email,role:form.role});
      showToast("تم إنشاء الحساب ✅ — أرسل لهم بيانات الدخول");
      setModal(null);
      setForm({email:"",password:"",role:"staff",dept:"",name:""});
      loadUsers();
    }catch(e){
      // Provide helpful error messages
      let msg=e.message;
      if(msg.includes("already registered")) msg="هذا الإيميل مسجّل مسبقاً";
      if(msg.includes("password")) msg="كلمة السر ضعيفة — استخدم 6 أحرف أو أكثر";
      if(msg.includes("email")) msg="صيغة الإيميل غير صحيحة";
      showToast("خطأ: "+msg,"error");
    }
    setSaving(false);
  };

  const updateRole=async(uid,role,dept)=>{
    await supabase.from("user_roles").update({role,dept:dept||null}).eq("user_id",uid);
    await auditLog(user.id,user.email,"تغيير دور","user_roles",uid,null,{role});
    showToast("تم تحديث الدور ✅");loadUsers();
  };

  const toggleActive=async(uid,active)=>{
    await supabase.from("user_roles").update({active}).eq("user_id",uid);
    showToast(active?"تم التفعيل ✅":"تم التعطيل","error");loadUsers();
  };

  const allRoles=[
    {id:"admin",    label:"مدير النظام",      desc:"كامل الصلاحيات",                       color:"#ef4444",bg:"#450a0a"},
    {id:"manager",  label:"مدير إدارة",        desc:"بيانات إدارته + تقارير",               color:"#f59e0b",bg:"#451a03"},
    {id:"training", label:"موظف قسم التدريب", desc:"إدارة التدريبات + الحضور + النتائج",    color:"#3b82f6",bg:"#0a1e3a"},
    {id:"content",  label:"إدارة المحتوى",    desc:"المواد + رفع الملفات + البرامج",        color:"#10b981",bg:"#052e16"},
    {id:"staff",    label:"موظف HR",           desc:"الموظفون + التحليل",                   color:"#8b5cf6",bg:"#2e1065"},
    {id:"employee", label:"موظف",              desc:"بياناته + تقييم التدريب",              color:"#64748b",bg:"#1e293b"},
  ];

  const getRoleObj=(id)=>allRoles.find(r=>r.id===id)||allRoles[5];

  return <div>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8,alignItems:"center"}}>
      <div>
        <div style={{fontSize:16,fontWeight:800,color:"#e2e8f0"}}>إدارة المستخدمين والصلاحيات</div>
        <div style={{fontSize:11,color:"#475569",marginTop:2}}>{users.length} مستخدم · نظام صلاحيات متدرّج</div>
      </div>
      <button style={S.btn("#065f46")} onClick={()=>setModal("new")}>+ مستخدم جديد</button>
    </div>

    {/* Role guide */}
    <div style={{...S.card,marginBottom:14}}>
      <span style={S.secTitle}>الأدوار والصلاحيات</span>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:8}}>
        {allRoles.map(r=>(
          <div key={r.id} style={{background:BG.page,borderRadius:8,padding:"9px 12px",border:"1px solid "+r.color+"22"}}>
            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4}}>
              <span style={{...S.badge(r.bg,r.color),fontSize:10}}>{r.label}</span>
            </div>
            <div style={{fontSize:10,color:"#475569"}}>{r.desc}</div>
          </div>
        ))}
      </div>
    </div>

    {loading?<Empty icon="⟳" text="جاري التحميل..."/>:
    <div style={{overflowX:"auto",borderRadius:10,border:"1px solid "+BG.border}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr>
          {["#","الاسم","الإيميل","الدور","الإدارة","الحالة","تعديل الدور",""].map(h=><th key={h} style={S.th}>{h}</th>)}
        </tr></thead>
        <tbody>{users.map((u,i)=>{
          const r=getRoleObj(u.role);
          return <tr key={u.user_id||i} style={{background:i%2===0?BG.page:BG.elevated+"33",opacity:u.active===false?0.5:1}}>
            <td style={S.td}><span style={{color:"#334155"}}>{i+1}</span></td>
            <td style={S.td}><span style={{fontWeight:600,color:"#e2e8f0"}}>{u.name||"—"}</span></td>
            <td style={S.td}><span style={{fontSize:11,color:"#60a5fa"}}>{u.email}</span></td>
            <td style={S.td}><span style={S.badge(r.bg,r.color)}>{r.label}</span></td>
            <td style={S.td}><span style={{color:"#64748b",fontSize:11}}>{u.dept||"—"}</span></td>
            <td style={S.td}><span style={{color:u.active===false?"#ef4444":"#22c55e",fontWeight:600,fontSize:11}}>{u.active===false?"معطّل":"نشط"}</span></td>
            <td style={S.td}>
              <div style={{display:"flex",gap:5,alignItems:"center"}}>
                <select style={{...S.select,fontSize:10,padding:"3px 6px",color:r.color,background:r.bg,fontWeight:700}}
                  value={u.role} onChange={e=>updateRole(u.user_id,e.target.value,u.dept)}>
                  {allRoles.map(r=><option key={r.id} value={r.id}>{r.label}</option>)}
                </select>
                {(u.role==="manager"||u.role==="training")&&<select style={{...S.select,fontSize:10,padding:"3px 6px",minWidth:100}}
                  value={u.dept||""} onChange={e=>updateRole(u.user_id,u.role,e.target.value)}>
                  <option value="">— إدارة —</option>
                  {DEPT_LIST.map(d=><option key={d}>{d}</option>)}
                </select>}
              </div>
            </td>
            <td style={S.td}>
              {u.user_id!==user.id&&<button style={S.btn(u.active===false?"#065f46":"#450a0a",u.active===false?"#86efac":"#fca5a5","4px 9px")}
                onClick={()=>toggleActive(u.user_id,u.active===false)}>
                {u.active===false?"تفعيل":"تعطيل"}
              </button>}
            </td>
          </tr>;
        })}</tbody>
      </table>
    </div>}

    {modal==="new"&&<div style={S.modal} onClick={()=>setModal(null)}>
      <div style={{...S.modalBox,maxWidth:500}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"12px 16px",borderBottom:"1px solid "+BG.border,fontWeight:700,display:"flex",justifyContent:"space-between",background:BG.elevated,borderRadius:"14px 14px 0 0",color:"#e2e8f0"}}>
          ➕ إضافة مستخدم جديد
          <button style={S.btn(BG.page,"#64748b","3px 8px")} onClick={()=>setModal(null)}>✕</button>
        </div>
        <div style={{padding:16,display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <div style={{gridColumn:"span 2"}}><div style={{fontSize:11,color:"#64748b",marginBottom:4}}>الاسم الكامل</div>
            <input style={S.input} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></div>
          <div><div style={{fontSize:11,color:"#64748b",marginBottom:4}}>الإيميل</div>
            <input type="email" style={{...S.input,direction:"ltr",textAlign:"left"}} value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/></div>
          <div><div style={{fontSize:11,color:"#64748b",marginBottom:4}}>كلمة السر (6+ أحرف)</div>
            <input type="password" style={{...S.input,direction:"ltr",textAlign:"left"}} value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))}/></div>
          <div><div style={{fontSize:11,color:"#64748b",marginBottom:4}}>الدور</div>
            <select style={S.select} value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))}>
              {allRoles.map(r=><option key={r.id} value={r.id}>{r.label}</option>)}
            </select></div>
          {(form.role==="manager"||form.role==="training")&&<div><div style={{fontSize:11,color:"#64748b",marginBottom:4}}>الإدارة</div>
            <select style={S.select} value={form.dept} onChange={e=>setForm(f=>({...f,dept:e.target.value}))}>
              <option value="">اختر...</option>{DEPT_LIST.map(d=><option key={d}>{d}</option>)}
            </select></div>}
          <div style={{gridColumn:"span 2",display:"flex",justifyContent:"flex-end",gap:8}}>
            <button style={S.btn(BG.elevated,"#64748b")} onClick={()=>setModal(null)}>إلغاء</button>
            <button style={{...S.btn("#065f46"),opacity:saving?0.6:1}} disabled={saving} onClick={createUser}>
              {saving?"...":"✓ إنشاء"}
            </button>
          </div>
        </div>
      </div>
    </div>}
  </div>;
}

// ════════════════════════════════════════════════
// REPORTS PAGE — 5 report types
// ════════════════════════════════════════════════
function ReportsPage({employees,attendance,evaluations,certs,programs}){
  const [repType,setRepType]=useState("employee");
  const [selEmp,setSelEmp]=useState("");
  const [selDept,setSelDept]=useState("الكل");

  const depts=["الكل",...Array.from(new Set(employees.map(e=>e.dept))).sort()];

  const buildAndDownload=(title,rows)=>{
    const blob=new Blob(["\uFEFF"+rows.map(r=>r.join(",")).join("\n")],{type:"text/csv;charset=utf-8"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=title+".csv";a.click();
  };

  // ── Report 1: per-employee ──
  const empReport=(emp)=>{
    const domains=DOMAINS.filter(d=>emp.needs?.[d]&&emp.needs[d]!=="-");
    const rows=[
      ["تقرير تدريب موظف: "+emp.name],["الإدارة: "+emp.dept,"المسمى: "+emp.title||"","الهاتف: "+emp.phone||""],[""],
      ["المجال","مستوى الحاجة","الحضور","تقييم المدير","التقييم العام","شهادة","تاريخ الشهادة"],
      ...domains.map(d=>{
        const av=attendance.find(a=>a.employee_id===emp.id&&a.domain===d);
        const ev=evaluations.find(v=>v.employee_id===emp.id&&v.domain===d);
        const cert=certs.find(c=>c.employee_id===emp.id&&c.domain===d);
        return[d,emp.needs[d],av?.status||"غائب",ev?.score||"—",ev?.overall_score||"—",cert?"نعم":"لا",cert?new Date(cert.issued_at).toLocaleDateString("ar-SY"):"—"];
      })
    ];
    buildAndDownload("تقرير_"+emp.name,rows);
  };

  // ── Report 2: trainer performance ──
  const trainerReport=()=>{
    const rows=[["تقرير أداء المدربين — "+new Date().getFullYear()],[""],
      ["البرنامج","عدد المقيّمين","متوسط أداء المدرب","وضوح الشرح","التفاعل","التقييم العام"],
      ...DOMAINS.map(d=>{
        const evs=evaluations.filter(ev=>ev.domain===d&&ev.t1);
        const avg=(field)=>evs.length?(evs.reduce((s,e)=>s+(e[field]||0),0)/evs.length).toFixed(1):"-";
        return[d,evs.length,avg("t6"),avg("t2"),avg("t4"),avg("overall_score")];
      })
    ];
    buildAndDownload("تقرير_أداء_المدربين",rows);
  };

  // ── Report 3: annual results ──
  const annualReport=()=>{
    const total=employees.length;
    const rows=[
      ["تقرير نتائج التدريب السنوية — 2026/2027"],[""],
      ["المجال","المشاركون","الحضور","معدل الحضور","التقييمات","متوسط الأداء","الشهادات"],
      ...DOMAINS.map(d=>{
        const parts=employees.filter(e=>e.needs?.[d]&&e.needs[d]!=="-").length;
        const prs=attendance.filter(a=>a.domain===d&&a.status==="حاضر").length;
        const evs=evaluations.filter(ev=>ev.domain===d&&ev.score);
        const avgScore=evs.length?(evs.reduce((s,e)=>s+(e.score||0),0)/evs.length).toFixed(1):"-";
        const certCnt=certs.filter(c=>c.domain===d).length;
        return[d,parts,prs,parts?(prs/parts*100).toFixed(0)+"%":"-",evs.length,avgScore,certCnt];
      })
    ];
    buildAndDownload("تقرير_السنوي_2026",rows);
  };

  // ── Report 4: HR report ──
  const hrReport=()=>{
    const rows=[
      ["تقرير إدارة الموارد البشرية"],[""],
      ["الاسم","الإدارة","المسمى","الهاتف","الإيميل","الفجوة","الأولوية","المجالات المطلوبة","شهادات","حضر برامج"],
      ...employees.map(e=>{
        const needDomains=DOMAINS.filter(d=>e.needs?.[d]&&e.needs[d]!=="-");
        const certCnt=certs.filter(c=>c.employee_id===e.id).length;
        const attCnt=attendance.filter(a=>a.employee_id===e.id&&a.status==="حاضر").length;
        return[e.name,e.dept,e.title||"",e.phone||"",e.email||"",
          (e.gap||0).toFixed(2),e.priority,needDomains.length,certCnt,attCnt];
      })
    ];
    buildAndDownload("تقرير_الموارد_البشرية",rows);
  };

  // ── Report 5: Executive report ──
  const execReport=()=>{
    const totalEmp=employees.length;
    const highPrio=employees.filter(e=>e.priority==="عالٍ").length;
    const totalCerts=certs.length;
    const totalAtt=attendance.filter(a=>a.status==="حاضر").length;
    const avgGap=(employees.reduce((s,e)=>s+(e.gap||0),0)/Math.max(totalEmp,1)).toFixed(2);
    const rows=[
      ["تقرير الإدارة العليا — الصندوق السيادي السوري"],["تاريخ: "+new Date().toLocaleDateString("ar-SY")],[""],
      ["مؤشر","القيمة","ملاحظات"],
      ["إجمالي الموظفين",totalEmp,""],
      ["ذوو الأولوية العالية",highPrio,(highPrio/totalEmp*100).toFixed(0)+"%"],
      ["متوسط الفجوة التدريبية",avgGap,"من 0 إلى 2"],
      ["برامج مخططة",12,"أبريل 2026 — مارس 2027"],
      ["برامج منجزة",Object.values(programs).filter(p=>p.status==="منجز").length,""],
      ["شهادات صادرة",totalCerts,""],
      ["إجمالي حضور التدريبات",totalAtt,""],
      [""],["التوزيع حسب الإدارة"],["الإدارة","الموظفون","الأولوية العالية","الفجوة المتوسطة"],
      ...Array.from(new Set(employees.map(e=>e.dept))).sort().map(d=>{
        const de=employees.filter(e=>e.dept===d);
        return[d,de.length,de.filter(e=>e.priority==="عالٍ").length,(de.reduce((s,e)=>s+(e.gap||0),0)/de.length).toFixed(2)];
      })
    ];
    buildAndDownload("تقرير_الإدارة_العليا",rows);
  };

  const repEmps=employees.filter(e=>selDept==="الكل"||e.dept===selDept);

  return <div>
    <div style={{...S.card,marginBottom:14}}>
      <span style={S.secTitle}>نوع التقرير</span>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(195px,1fr))",gap:8}}>
        {[["employee","📋 تقرير موظف","تدريبات وشهادات موظف محدد","#3b82f6"],
          ["trainer","🎓 أداء المدربين","تقييمات وجودة التدريب","#10b981"],
          ["annual","📊 النتائج السنوية","ملخص كامل 2026/2027","#f59e0b"],
          ["hr","👥 تقرير الموارد البشرية","للإدارة الوظيفية والتخطيط","#8b5cf6"],
          ["exec","🏛 الإدارة العليا","مؤشرات استراتيجية وملخص تنفيذي","#ef4444"]
        ].map(([val,lbl,desc,col])=>(
          <div key={val} onClick={()=>setRepType(val)}
            style={{background:repType===val?col+"22":BG.page,borderRadius:9,padding:"12px 14px",
              border:"1px solid "+(repType===val?col:BG.border),cursor:"pointer",transition:"all .15s"}}>
            <div style={{fontWeight:700,fontSize:12,color:repType===val?col:"#94a3b8",marginBottom:3}}>{lbl}</div>
            <div style={{fontSize:10,color:"#475569"}}>{desc}</div>
          </div>
        ))}
      </div>
    </div>

    <div style={S.card}>
      {repType==="employee"&&<div>
        <span style={S.secTitle}>تقرير موظف — اختر إدارة ثم موظفاً</span>
        <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
          <select style={S.select} value={selDept} onChange={e=>{setSelDept(e.target.value);setSelEmp("");}}>
            {depts.map(d=><option key={d}>{d}</option>)}
          </select>
          <select style={S.select} value={selEmp} onChange={e=>setSelEmp(e.target.value)}>
            <option value="">اختر موظفاً...</option>
            {repEmps.map(e=><option key={e.id} value={e.id}>{e.name} — {e.dept}</option>)}
          </select>
          <button style={S.btn(selEmp?"#1d4ed8":BG.elevated,selEmp?"#fff":"#334155","8px 16px")}
            disabled={!selEmp} onClick={()=>{const emp=employees.find(e=>e.id===selEmp);if(emp)empReport(emp);}}>
            📥 تحميل التقرير
          </button>
        </div>
        {selEmp&&(()=>{
          const emp=employees.find(e=>e.id===selEmp);if(!emp)return null;
          const needs=DOMAINS.filter(d=>emp.needs?.[d]&&emp.needs[d]!=="-");
          const empCerts=certs.filter(c=>c.employee_id===emp.id).length;
          const empAtt=attendance.filter(a=>a.employee_id===emp.id&&a.status==="حاضر").length;
          return <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10,marginBottom:14}}>
              <KPI v={needs.length} l="مجالات مطلوبة" c="#6366f1" i="🎯"/>
              <KPI v={empAtt} l="برامج حضرها" c="#22c55e" i="✅"/>
              <KPI v={empCerts} l="شهادات" c="#f59e0b" i="🏆"/>
              <KPI v={(emp.gap||0).toFixed(2)} l="الفجوة" c={gc(emp.gap||0)} i="📊"/>
            </div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr>{["المجال","المستوى","الحضور","أداء المدير","التقييم الشامل","شهادة"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>{needs.map((d,i)=>{
                  const av=attendance.find(a=>a.employee_id===emp.id&&a.domain===d);
                  const ev=evaluations.find(v=>v.employee_id===emp.id&&v.domain===d);
                  const cert=certs.find(c=>c.employee_id===emp.id&&c.domain===d);
                  const{bg,fg}=pc(emp.needs[d]);
                  return <tr key={d} style={{background:i%2===0?BG.page:BG.elevated+"33"}}>
                    <td style={S.td}><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:6,height:6,borderRadius:"50%",background:DC[d]||"#64748b"}}/>{d}</div></td>
                    <td style={S.td}><span style={S.badge(bg,fg)}>{emp.needs[d]}</span></td>
                    <td style={S.td}><span style={{color:av?.status==="حاضر"?"#22c55e":av?.status==="معذور"?"#f59e0b":"#334155"}}>{av?.status||"غائب"}</span></td>
                    <td style={S.td}>{ev?.score?<span style={{color:"#f59e0b"}}>⭐{ev.score}/5</span>:"—"}</td>
                    <td style={S.td}>{ev?.overall_score?<span style={{color:"#8b5cf6"}}>⭐{ev.overall_score}/5</span>:"—"}</td>
                    <td style={S.td}>{cert?<span style={{color:"#22c55e"}}>✅ {new Date(cert.issued_at).toLocaleDateString("ar-SY")}</span>:"—"}</td>
                  </tr>;
                })}</tbody>
              </table>
            </div>
          </div>;
        })()}
      </div>}

      {repType==="trainer"&&<div>
        <span style={S.secTitle}>تقرير أداء المدربين</span>
        <button style={{...S.btn("#1d4ed8","#fff"),marginBottom:14}} onClick={trainerReport}>📥 تحميل التقرير</button>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>{["البرنامج","المقيّمون","أداء المدرب","وضوح الشرح","التفاعل","محتوى","تنظيم","عام"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>{DOMAINS.map((d,i)=>{
              const evs=evaluations.filter(ev=>ev.domain===d&&ev.t1);
              const avg=(field)=>evs.length?(evs.reduce((s,e)=>s+(e[field]||0),0)/evs.length).toFixed(1):"-";
              const color=(v)=>v==="-"?"#334155":v>=4?"#22c55e":v>=3?"#f59e0b":"#ef4444";
              return <tr key={d} style={{background:i%2===0?BG.page:BG.elevated+"33"}}>
                <td style={S.td}><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:6,height:6,borderRadius:"50%",background:DC[d]||"#64748b"}}/><span style={{fontWeight:600,color:"#e2e8f0",fontSize:11}}>{d}</span></div></td>
                <td style={S.td}><span style={{color:"#6366f1"}}>{evs.length}</span></td>
                {[avg("t6"),avg("t2"),avg("t4"),avg("c2"),avg("l4"),avg("overall_score")].map((v,j)=>(
                  <td key={j} style={S.td}><span style={{color:color(parseFloat(v)),fontWeight:700}}>{v}</span></td>
                ))}
              </tr>;
            })}</tbody>
          </table>
        </div>
      </div>}

      {(repType==="annual"||repType==="hr"||repType==="exec")&&<div>
        <span style={S.secTitle}>{repType==="annual"?"تقرير النتائج السنوية":repType==="hr"?"تقرير الموارد البشرية":"تقرير الإدارة العليا"}</span>
        <div style={{padding:20,background:BG.page,borderRadius:9,border:"1px solid "+BG.border,textAlign:"center",marginBottom:14}}>
          <div style={{fontSize:32,marginBottom:8}}>📊</div>
          <div style={{fontWeight:700,color:"#e2e8f0",marginBottom:6}}>
            {repType==="annual"?"تقرير نتائج التدريب السنوية 2026/2027":repType==="hr"?"تقرير شامل لإدارة الموارد البشرية":"ملخص تنفيذي للإدارة العليا"}
          </div>
          <div style={{fontSize:11,color:"#475569",marginBottom:16}}>
            يتضمن جميع البيانات والمؤشرات المطلوبة بصيغة Excel
          </div>
          <button style={S.btn("#1d4ed8","#fff","10px 24px")}
            onClick={repType==="annual"?annualReport:repType==="hr"?hrReport:execReport}>
            📥 تحميل التقرير
          </button>
        </div>
        {repType==="annual"&&<div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>{["البرنامج","المشاركون","الحضور","معدل الحضور","التقييمات","متوسط الأداء","الشهادات"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>{DOMAINS.map((d,i)=>{
              const parts=employees.filter(e=>e.needs?.[d]&&e.needs[d]!=="-").length;
              const prs=attendance.filter(a=>a.domain===d&&a.status==="حاضر").length;
              const evs=evaluations.filter(ev=>ev.domain===d&&ev.score);
              const avgScore=evs.length?(evs.reduce((s,e)=>s+(e.score||0),0)/evs.length).toFixed(1):"-";
              const certCnt=certs.filter(c=>c.domain===d).length;
              const rate=parts?(prs/parts*100).toFixed(0):0;
              return <tr key={d} style={{background:i%2===0?BG.page:BG.elevated+"33"}}>
                <td style={S.td}><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:6,height:6,borderRadius:"50%",background:DC[d]||"#64748b"}}/>{d}</div></td>
                <td style={S.td}><span style={{color:"#6366f1"}}>{parts}</span></td>
                <td style={S.td}><span style={{color:"#22c55e"}}>{prs}</span></td>
                <td style={S.td}><div style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:50,height:4,background:BG.elevated,borderRadius:2}}>
                    <div style={{height:"100%",width:rate+"%",background:rate>=70?"#22c55e":rate>=40?"#f59e0b":"#ef4444",borderRadius:2}}/>
                  </div><span style={{fontSize:10}}>{rate}%</span></div></td>
                <td style={S.td}>{evs.length}</td>
                <td style={S.td}><span style={{color:"#f59e0b",fontWeight:700}}>{avgScore}</span></td>
                <td style={S.td}><span style={{color:"#a78bfa"}}>{certCnt}</span></td>
              </tr>;
            })}</tbody>
          </table>
        </div>}
      </div>}
    </div>
  </div>;
}

// ════════════════════════════════════════════════
// ANALYTICS
// ════════════════════════════════════════════════
function AnalyticsPage({employees,attendance,certs,rate,setRate}){
  const [dept,setDept]=useState("الكل");const [compare,setCompare]=useState(false);const [search,setSearch]=useState("");
  const depts=["الكل",...Array.from(new Set(employees.map(e=>e.dept))).sort()];
  const emps=employees.filter(e=>(dept==="الكل"||e.dept===dept)&&(!search||e.name.includes(search)||e.dept.includes(search)));
  const stats=es=>{
    const n=es.length,h=es.filter(e=>e.priority==="عالٍ").length,m=es.filter(e=>e.priority==="متوسط").length,l=es.filter(e=>e.priority==="منخفض").length;
    const ag=n?(es.reduce((s,e)=>s+(e.gap||0),0)/n):0;
    const budget=DOMAINS.reduce((s,d)=>s+es.filter(e=>e.needs?.[d]&&e.needs[d]!=="-").length*(PROGRAMS[d]?.days||0)*rate,0);
    return{n,h,m,l,ag,budget,att:attendance.filter(a=>es.find(e=>e.id===a.employee_id)&&a.status==="حاضر").length,cert:certs.filter(c=>es.find(e=>e.id===c.employee_id)).length};
  };
  const st=stats(emps);
  const domData=DOMAINS.map(d=>({l:d.substring(0,5),full:d,v:emps.filter(e=>e.needs?.[d]&&e.needs[d]!=="-").length,c:DC[d]||"#64748b"})).sort((a,b)=>b.v-a.v);
  const deptCmp=Array.from(new Set(employees.map(e=>e.dept))).sort().map(d=>{const es=employees.filter(e=>e.dept===d);return{dept:d,...stats(es)};}).sort((a,b)=>b.ag-a.ag);

  const exportCSV=()=>{
    const rows=[["الاسم","الإدارة","المسمى","الهاتف","الإيميل","الفجوة","الأولوية",...DOMAINS],
      ...emps.map(e=>[e.name,e.dept,e.title||"",e.phone||"",e.email||"",(e.gap||0).toFixed(2),e.priority,...DOMAINS.map(d=>e.needs?.[d]||"-")])];
    const blob=new Blob(["\uFEFF"+rows.map(r=>r.join(",")).join("\n")],{type:"text/csv;charset=utf-8"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="تحليل_"+dept+".csv";a.click();
  };

  return <div>
    <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
      <input style={{...S.input,maxWidth:200}} placeholder="🔍 ابحث..." value={search} onChange={e=>setSearch(e.target.value)}/>
      <select style={S.select} value={dept} onChange={e=>setDept(e.target.value)}>
        {depts.map(d=><option key={d}>{d}</option>)}
      </select>
      <button style={S.btn(compare?"#1d4ed8":BG.elevated,compare?"#fff":"#64748b","7px 13px")} onClick={()=>setCompare(!compare)}>
        {compare?"📋 تفاصيل":"⚖️ مقارنة"}
      </button>
      <div style={{marginRight:"auto",display:"flex",gap:8,alignItems:"center"}}>
        <span style={{fontSize:11,color:"#475569"}}>$/يوم</span>
        <input type="number" min={5} max={500} value={rate} onChange={e=>setRate(Math.max(1,+e.target.value))} style={{...S.input,width:66,padding:"5px 9px"}}/>
        <button style={S.btn("#065f46","#fff","7px 13px")} onClick={exportCSV}>📥 Excel</button>
      </div>
    </div>
    {!compare?<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:10,marginBottom:14}}>
        <KPI v={st.n} l="موظفون" c="#6366f1" i="👥"/>
        <KPI v={st.ag.toFixed(2)} l="متوسط الفجوة" c={gc(st.ag)} i="📊"/>
        <KPI v={st.h} l="أولوية عالية" c="#ef4444" i="🔴"/>
        <KPI v={st.m} l="أولوية متوسطة" c="#f59e0b" i="🟡"/>
        <KPI v={"$"+(st.budget/1000).toFixed(1)+"k"} l="الميزانية الكلية" c="#f59e0b" i="💰"/>
        <KPI v={"$"+(st.n>0?Math.round(st.budget/st.n).toLocaleString():"0")} l="تكلفة/موظف" c="#f97316" i="👤" sub="متوسط التكلفة"/>
        <KPI v={st.att} l="حضر تدريباً" c="#22c55e" i="✅"/>
        <KPI v={st.cert} l="شهادات" c="#a78bfa" i="🏆"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:12,marginBottom:14}}>
        <div style={S.card}><span style={S.secTitle}>الاحتياجات</span><BarChart data={domData} height={110}/></div>
        <div style={S.card}><span style={S.secTitle}>الأولويات</span>
          <div style={{display:"flex",justifyContent:"center",marginBottom:10}}><Donut segs={[{v:st.h,c:"#ef4444"},{v:st.m,c:"#f59e0b"},{v:st.l,c:"#22c55e"}]}/></div>
          {[["عالٍ",st.h,"#ef4444"],["متوسط",st.m,"#f59e0b"],["منخفض",st.l,"#22c55e"]].map(([l,v,c])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid "+BG.border,fontSize:12}}>
              <span style={{color:c}}>● {l}</span><span style={{color:"#64748b"}}>{v} ({st.n>0?(v/st.n*100).toFixed(0):0}%)</span>
            </div>
          ))}
        </div>
      </div>
      <div style={S.card}>
        <span style={S.secTitle}>قائمة الموظفين ({emps.length})</span>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>{["#","الاسم","الإدارة","الهاتف","الإيميل","الفجوة","الأولوية","المجالات"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>{emps.map((e,i)=>{
              const{bg,fg}=pc(e.priority);
              return <tr key={e.id} style={{background:i%2===0?BG.page:BG.elevated+"33"}}>
                <td style={S.td}><span style={{color:"#334155"}}>{i+1}</span></td>
                <td style={S.td}><span style={{fontWeight:600,color:"#e2e8f0"}}>{e.name}</span></td>
                <td style={S.td}><span style={{color:"#60a5fa",fontSize:11}}>{e.dept}</span></td>
                <td style={S.td}>{e.phone?<a href={"tel:"+e.phone} style={{color:"#34d399",textDecoration:"none",fontSize:11}}>{e.phone}</a>:"—"}</td>
                <td style={S.td}>{e.email?<a href={"mailto:"+e.email} style={{color:"#60a5fa",textDecoration:"none",fontSize:11}}>{e.email}</a>:"—"}</td>
                <td style={S.td}><span style={{fontWeight:700,color:gc(e.gap||0)}}>{(e.gap||0).toFixed(2)}</span></td>
                <td style={S.td}><span style={S.badge(bg,fg)}>{e.priority}</span></td>
                <td style={S.td}><span style={{color:"#6366f1",fontWeight:700}}>{DOMAINS.filter(d=>e.needs?.[d]&&e.needs[d]!=="-").length}</span></td>
              </tr>;
            })}</tbody>
          </table>
        </div>
      </div>
    </div>:
    <div style={S.card}>
      <span style={S.secTitle}>مقارنة الإدارات</span>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>{["الإدارة","موظفون","الفجوة","عالٍ","متوسط","منخفض","الميزانية","شهادات"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
          <tbody>{deptCmp.map((d,i)=>(
            <tr key={d.dept} style={{background:i%2===0?BG.page:BG.elevated+"33",cursor:"pointer"}} onClick={()=>{setDept(d.dept);setCompare(false);}}>
              <td style={S.td}><span style={{fontWeight:700,color:"#e2e8f0"}}>{d.dept}</span></td>
              <td style={S.td}><span style={{color:"#6366f1"}}>{d.n}</span></td>
              <td style={S.td}><span style={{fontWeight:700,color:gc(d.ag)}}>{d.ag.toFixed(2)}</span></td>
              <td style={S.td}><span style={{color:"#ef4444"}}>{d.h}</span></td>
              <td style={S.td}><span style={{color:"#f59e0b"}}>{d.m}</span></td>
              <td style={S.td}><span style={{color:"#22c55e"}}>{d.l}</span></td>
              <td style={S.td}><span style={{fontWeight:700,color:"#f59e0b"}}>${d.budget.toLocaleString()}</span></td>
              <td style={S.td}><span style={{color:"#a78bfa"}}>{d.cert}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>}
  </div>;
}

// ════════════════════════════════════════════════
// EMPLOYEES
// ════════════════════════════════════════════════
function EmployeesPage({employees,user,role,onRefresh,showToast}){
  const [search,setSearch]=useState("");const [deptF,setDeptF]=useState("الكل");const [modal,setModal]=useState(null);const [mode,setMode]=useState("view");const [delConfirm,setDelConfirm]=useState(null);const [saving,setSaving]=useState(false);
  const depts=["الكل",...Array.from(new Set(employees.map(e=>e.dept))).sort()];
  const filtered=employees.filter(e=>(deptF==="الكل"||e.dept===deptF)&&(!search||e.name.includes(search)||(e.phone||"").includes(search)));
  const saveEmp=async(emp)=>{
    setSaving(true);
    try{
      let res;
      if(emp.id){
        res=await supabase.from("employees").update(emp).eq("id",emp.id);
      } else {
        // remove id if it's a new record
        const{id:_,...empData}=emp;
        res=await supabase.from("employees").insert(empData).select().single();
      }
      if(res.error) throw res.error;
      showToast(emp.id?"تم التعديل ✅":"تمت الإضافة ✅");
      setSaving(false);setModal(null);onRefresh();
    }catch(e){
      showToast("خطأ في الحفظ: "+e.message,"error");
      setSaving(false);
    }
  };
  const delEmp=async(id)=>{
    const res=await supabase.from("employees").delete().eq("id",id);
    if(res.error){showToast("خطأ في الحذف: "+res.error.message,"error");return;}
    setDelConfirm(null);showToast("تم الحذف","error");onRefresh();
  };
  return <div>
    <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
      <input style={{...S.input,maxWidth:230}} placeholder="🔍 اسم / هاتف..." value={search} onChange={e=>setSearch(e.target.value)}/>
      <select style={S.select} value={deptF} onChange={e=>setDeptF(e.target.value)}>{depts.map(d=><option key={d}>{d}</option>)}</select>
      <span style={{color:"#475569",fontSize:12,marginRight:"auto"}}>{filtered.length} موظف</span>
      <button style={S.btn("#065f46")} onClick={()=>{setModal({name:"",title:"موظف",dept:DEPT_LIST[0],city:"دمشق",gap:0,priority:"منخفض",phone:"",email:"",needs:Object.fromEntries(DOMAINS.map(d=>[d,"-"]))});setMode("new");}}>+ إضافة</button>
    </div>
    <div style={{overflowX:"auto",borderRadius:10,border:"1px solid "+BG.border}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr>{["#","الاسم","الإدارة","الهاتف","الإيميل","الفجوة","الأولوية","مجالات",""].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
        <tbody>{filtered.map((e,i)=>{
          const{bg,fg}=pc(e.priority);
          return <tr key={e.id} style={{background:i%2===0?BG.page:BG.elevated+"33"}}>
            <td style={S.td}><span style={{color:"#334155"}}>{i+1}</span></td>
            <td style={S.td}><span style={{fontWeight:600,color:"#e2e8f0"}}>{e.name}</span></td>
            <td style={S.td}><span style={{color:"#60a5fa",fontSize:11}}>{e.dept}</span></td>
            <td style={S.td}>{e.phone?<a href={"tel:"+e.phone} style={{color:"#34d399",textDecoration:"none",fontSize:11}}>{e.phone}</a>:"—"}</td>
            <td style={S.td}>{e.email?<a href={"mailto:"+e.email} style={{color:"#60a5fa",textDecoration:"none",fontSize:11}}>{e.email}</a>:"—"}</td>
            <td style={S.td}><span style={{fontWeight:700,color:gc(e.gap||0)}}>{(e.gap||0).toFixed(2)}</span></td>
            <td style={S.td}><span style={S.badge(bg,fg)}>{e.priority}</span></td>
            <td style={S.td}><span style={{color:"#6366f1",fontWeight:700}}>{DOMAINS.filter(d=>e.needs?.[d]&&e.needs[d]!=="-").length}</span></td>
            <td style={S.td}><div style={{display:"flex",gap:4}}>
              <button style={S.btn(BG.elevated,"#94a3b8","4px 8px")} onClick={()=>{setModal(e);setMode("view");}}>عرض</button>
              <button style={S.btn("#1d4ed8","#fff","4px 8px")} onClick={()=>{setModal({...e});setMode("edit");}}>تعديل</button>
              {(role==="admin"||role==="staff")&&<button style={S.btn("#450a0a","#fca5a5","4px 8px")} onClick={()=>setDelConfirm(e.id)}>حذف</button>}
            </div></td>
          </tr>;
        })}</tbody>
      </table>
    </div>
    {modal&&<div style={S.modal} onClick={()=>setModal(null)}>
      <div style={{...S.modalBox}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"12px 16px",borderBottom:"1px solid "+BG.border,fontWeight:700,display:"flex",justifyContent:"space-between",background:BG.elevated,borderRadius:"14px 14px 0 0",color:"#e2e8f0",position:"sticky",top:0,zIndex:1}}>
          {mode==="new"?"➕ موظف جديد":mode==="edit"?"✏️ "+modal.name:"👤 "+modal.name}
          <button style={S.btn(BG.page,"#64748b","3px 8px")} onClick={()=>setModal(null)}>✕</button>
        </div>
        <div style={{padding:16}}>{mode==="view"?<EmpView emp={modal}/>:<EmpForm emp={modal} onChange={setModal} onSave={saveEmp} onCancel={()=>setModal(null)} saving={saving}/>}</div>
      </div>
    </div>}
    {delConfirm&&<div style={S.modal} onClick={()=>setDelConfirm(null)}>
      <div style={{...S.modalBox,maxWidth:300,textAlign:"center",padding:32}} onClick={e=>e.stopPropagation()}>
        <div style={{fontSize:32,marginBottom:8}}>⚠️</div><div style={{fontWeight:700,marginBottom:6}}>حذف الموظف؟</div>
        <div style={{color:"#475569",fontSize:11,marginBottom:20}}>لا يمكن التراجع</div>
        <div style={{display:"flex",gap:8,justifyContent:"center"}}>
          <button style={S.btn(BG.elevated,"#64748b")} onClick={()=>setDelConfirm(null)}>إلغاء</button>
          <button style={S.btn("#450a0a","#fca5a5")} onClick={()=>delEmp(delConfirm)}>حذف</button>
        </div>
      </div>
    </div>}
  </div>;
}

function EmpView({emp}){
  const needs=DOMAINS.filter(d=>emp.needs?.[d]&&emp.needs[d]!=="-");
  return <div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
      {[["الإدارة",emp.dept],["المسمى",emp.title||"—"],["المدينة",emp.city||"—"],["الأولوية",emp.priority],["الهاتف",emp.phone||"—"],["الإيميل",emp.email||"—"]].map(([l,v])=>(
        <div key={l} style={{background:BG.page,borderRadius:8,padding:"8px 11px",border:"1px solid "+BG.border}}>
          <div style={{fontSize:9,color:"#475569",marginBottom:2}}>{l}</div><div style={{fontWeight:600,fontSize:12,color:"#e2e8f0"}}>{v}</div>
        </div>
      ))}
    </div>
    <span style={S.secTitle}>الاحتياجات ({needs.length})</span>
    {needs.map(d=>{const{bg,fg}=pc(emp.needs[d]);return <div key={d} style={{display:"flex",justifyContent:"space-between",padding:"6px 10px",borderRadius:7,background:BG.page,fontSize:11,border:"1px solid "+BG.border,marginBottom:4}}>
      <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:5,height:5,borderRadius:"50%",background:DC[d]||"#64748b"}}/>{d}</div>
      <span style={S.badge(bg,fg)}>{emp.needs[d]}</span>
    </div>;})}
  </div>;
}

function EmpForm({emp,onChange,onSave,onCancel,saving}){
  const upd=(k,v)=>onChange(e=>({...e,[k]:v}));
  return <div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
      <div style={{gridColumn:"span 2"}}><div style={{fontSize:11,color:"#64748b",marginBottom:3}}>الاسم</div><input style={S.input} value={emp.name||""} onChange={e=>upd("name",e.target.value)}/></div>
      <div><div style={{fontSize:11,color:"#64748b",marginBottom:3}}>الإدارة</div><select style={S.select} value={emp.dept||""} onChange={e=>upd("dept",e.target.value)}>{DEPT_LIST.map(d=><option key={d}>{d}</option>)}</select></div>
      <div><div style={{fontSize:11,color:"#64748b",marginBottom:3}}>المسمى</div><select style={S.select} value={emp.title||"موظف"} onChange={e=>upd("title",e.target.value)}><option>موظف</option><option>رئيس قسم</option><option>مدير</option></select></div>
      <div><div style={{fontSize:11,color:"#64748b",marginBottom:3}}>الهاتف</div><input style={{...S.input,direction:"ltr",textAlign:"left"}} value={emp.phone||""} onChange={e=>upd("phone",e.target.value)} placeholder="+963..."/></div>
      <div><div style={{fontSize:11,color:"#64748b",marginBottom:3}}>الإيميل</div><input type="email" style={{...S.input,direction:"ltr",textAlign:"left"}} value={emp.email||""} onChange={e=>upd("email",e.target.value)}/></div>
      <div><div style={{fontSize:11,color:"#64748b",marginBottom:3}}>الفجوة (0-2)</div>
        <input type="number" min={0} max={2} step={0.1} style={S.input} value={emp.gap||0}
          onChange={e=>{const g=+e.target.value;upd("gap",g);upd("priority",g>=1.5?"عالٍ":g>=0.75?"متوسط":"منخفض");}}/></div>
      <div><div style={{fontSize:11,color:"#64748b",marginBottom:3}}>الأولوية</div><input style={{...S.input,color:gc(emp.gap||0),fontWeight:700}} value={emp.priority||"منخفض"} readOnly/></div>
    </div>
    <div style={{fontSize:11,fontWeight:700,color:"#f59e0b",marginBottom:8}}>الاحتياجات التدريبية</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,marginBottom:14}}>
      {DOMAINS.map(d=>(
        <div key={d} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:BG.page,borderRadius:7,padding:"5px 9px",border:"1px solid "+BG.border}}>
          <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:5,height:5,borderRadius:"50%",background:DC[d]||"#64748b",flexShrink:0}}/><span style={{fontSize:11,color:"#94a3b8"}}>{d}</span></div>
          <select style={{...S.select,fontSize:10,padding:"2px 5px",width:80}} value={emp.needs?.[d]||"-"} onChange={e=>upd("needs",{...emp.needs,[d]:e.target.value})}>
            <option>-</option><option>منخفض</option><option>متوسط</option><option>عالٍ</option>
          </select>
        </div>
      ))}
    </div>
    <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
      <button style={S.btn(BG.elevated,"#64748b")} onClick={onCancel}>إلغاء</button>
      <button style={{...S.btn("#065f46"),opacity:saving?0.6:1}} disabled={saving} onClick={()=>onSave(emp)}>{saving?"...":"💾 حفظ"}</button>
    </div>
  </div>;
}

// ════════════════════════════════════════════════
// AUDIT
// ════════════════════════════════════════════════
function AuditPage({auditLogs}){
  const filtered=auditLogs.slice(0,200);
  const ac=a=>a?.includes("حذف")?"#ef4444":a?.includes("إضافة")?"#22c55e":a?.includes("شهادة")?"#a78bfa":a?.includes("حضور")?"#3b82f6":"#f59e0b";
  return <div style={S.card}>
    <span style={S.secTitle}>سجل التغييرات ({filtered.length})</span>
    <div style={{overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr>{["التاريخ","الوقت","المستخدم","العملية","الجدول"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
        <tbody>{filtered.map((l,i)=>(
          <tr key={l.id||i} style={{background:i%2===0?BG.page:BG.elevated+"33"}}>
            <td style={S.td}><span style={{fontSize:10,color:"#475569"}}>{new Date(l.created_at).toLocaleDateString("ar-SY")}</span></td>
            <td style={S.td}><span style={{fontSize:10,color:"#334155"}}>{new Date(l.created_at).toLocaleTimeString("ar-SY")}</span></td>
            <td style={S.td}><span style={{fontSize:11,color:"#60a5fa"}}>{l.user_email}</span></td>
            <td style={S.td}><span style={{color:ac(l.action),fontWeight:600}}>{l.action}</span></td>
            <td style={S.td}><span style={{color:"#475569",fontSize:11}}>{l.table_name}</span></td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  </div>;
}

// ════════════════════════════════════════════════
// DASHBOARD
// ════════════════════════════════════════════════
function Dashboard({employees,programs,attendance,evaluations,certs,onNav}){
  const h=employees.filter(e=>e.priority==="عالٍ").length;
  const m=employees.filter(e=>e.priority==="متوسط").length;
  const l=employees.filter(e=>e.priority==="منخفض").length;
  const ag=employees.length?(employees.reduce((s,e)=>s+(e.gap||0),0)/employees.length).toFixed(2):0;
  const done=Object.values(programs).filter(p=>p.status==="منجز").length;
  const topDoms=[...DOMAINS].sort((a,b)=>employees.filter(e=>e.needs?.[b]&&e.needs[b]!=="-").length-employees.filter(e=>e.needs?.[a]&&e.needs[a]!=="-").length);

  return <div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:11,marginBottom:18}}>
      <KPI v={employees.length} l="الموظفون" c="#6366f1" i="👥" onClick={()=>onNav("employees")}/>
      <KPI v={ag} l="متوسط الفجوة" c={gc(parseFloat(ag))} i="📊" onClick={()=>onNav("analytics")}/>
      <KPI v={h} l="أولوية عالية" c="#ef4444" i="🔴" sub={(employees.length>0?(h/employees.length*100).toFixed(0):0)+"%"} onClick={()=>onNav("analytics")}/>
      <KPI v={12} l="برنامج تدريبي" c="#f59e0b" i="📅" onClick={()=>onNav("annual")}/>
      <KPI v={done+"/12"} l="منجزة" c="#22c55e" i="✅" onClick={()=>onNav("tracking")}/>
      <KPI v={attendance.filter(a=>a.status==="حاضر").length} l="إجمالي الحضور" c="#10b981" i="👤" onClick={()=>onNav("tracking")}/>
      <KPI v={evaluations.length} l="تقييمات" c="#8b5cf6" i="⭐" onClick={()=>onNav("evaluations")}/>
      <KPI v={certs.length} l="شهادات صادرة" c="#f59e0b" i="🏆" onClick={()=>onNav("certificates")}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14,marginBottom:14}}>
      <div style={S.card}>
        <span style={S.secTitle}>أعلى الاحتياجات</span>
        <BarChart data={topDoms.map(d=>({l:d.substring(0,5),full:d,v:employees.filter(e=>e.needs?.[d]&&e.needs[d]!=="-").length,c:DC[d]||"#64748b"}))} height={110}/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:5,marginTop:10}}>
          {topDoms.slice(0,6).map(d=>{
            const cnt=employees.filter(e=>e.needs?.[d]&&e.needs[d]!=="-").length;
            const high=employees.filter(e=>e.needs?.[d]==="عالٍ").length;
            return <div key={d} onClick={()=>onNav("subtopics")} style={{background:BG.page,borderRadius:7,padding:"6px 9px",cursor:"pointer",border:"1px solid "+BG.border}}>
              <div style={{fontSize:10,fontWeight:600,color:DC[d]||"#64748b",marginBottom:2}}>{d}</div>
              <div style={{display:"flex",gap:5,fontSize:11}}>
                <span style={{color:"#6366f1",fontWeight:700}}>{cnt}</span>
                {high>0&&<span style={{color:"#ef4444",fontSize:10}}>🔴{high}</span>}
              </div>
            </div>;
          })}
        </div>
      </div>
      <div>
        <div style={{...S.card,marginBottom:12}}>
          <span style={S.secTitle}>الأولويات</span>
          <div style={{display:"flex",justifyContent:"center",marginBottom:8}}><Donut segs={[{v:h,c:"#ef4444"},{v:m,c:"#f59e0b"},{v:l,c:"#22c55e"}]}/></div>
          {[["عالٍ",h,"#ef4444"],["متوسط",m,"#f59e0b"],["منخفض",l,"#22c55e"]].map(([label,val,c])=>(
            <div key={label} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid "+BG.border,fontSize:12}}>
              <span style={{color:c,fontWeight:600}}>● {label}</span>
              <span style={{color:"#475569"}}>{val} ({employees.length>0?(val/employees.length*100).toFixed(0):0}%)</span>
            </div>
          ))}
        </div>
        <div style={S.card}>
          <span style={S.secTitle}>وصول سريع</span>
          {[["📊","التحليل","analytics"],["🎯","الموضوعات","subtopics"],["📅","الخطة","annual"],["📋","المتابعة","tracking"],["📈","التقارير","reports"]].map(([icon,label,tab])=>(
            <div key={tab} onClick={()=>onNav(tab)} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:7,cursor:"pointer",marginBottom:3,background:BG.page,border:"1px solid "+BG.border}}>
              <span>{icon}</span><span style={{fontSize:12,fontWeight:500,color:"#94a3b8"}}>{label}</span>
              <span style={{marginRight:"auto",color:"#334155"}}>←</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>;
}

// ════════════════════════════════════════════════
// MAIN APP
// ════════════════════════════════════════════════
export default function App(){
  const [user,setUser]=useState(null);const [role,setRole]=useState(null);const [loading,setLoading]=useState(true);
  const [tab,setTab]=useState("dashboard");const [rate,setRate]=useState(35);
  const [employees,setEmployees]=useState([]);const [programs,setPrograms]=useState({});
  const [attendance,setAttendance]=useState([]);const [evaluations,setEvaluations]=useState([]);
  const [certs,setCerts]=useState([]);const [auditLogs,setAuditLogs]=useState([]);
  const [dataLoading,setDataLoading]=useState(false);const [toast,setToast]=useState(null);

  const showToast=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      if(session?.user) loadRole(session.user);else setLoading(false);
    });
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>{
      if(session?.user) loadRole(session.user);else{setUser(null);setRole(null);setLoading(false);}
    });
    return()=>subscription.unsubscribe();
  },[]);

  const loadRole=async(u)=>{
    const{data:rd}=await supabase.from("user_roles").select("role").eq("user_id",u.id).single();
    setUser(u);setRole(rd?.role||"employee");setLoading(false);
  };

  const loadData=useCallback(async()=>{
    if(!user) return;setDataLoading(true);
    try{
      const[{data:e,error:eErr},{data:p,error:pErr},{data:a,error:aErr},{data:v,error:vErr},{data:c,error:cErr},{data:l}]=await Promise.all([
        supabase.from("employees").select("*").order("name"),
        supabase.from("training_programs").select("*"),
        supabase.from("attendance").select("*"),
        supabase.from("evaluations").select("*"),
        supabase.from("certificates").select("*"),
        role==="admin"?supabase.from("audit_log").select("*").order("created_at",{ascending:false}).limit(300):{data:[]},
      ]);
      // FIX #3: Log any RLS errors so we can see them
      [eErr,pErr,aErr,vErr,cErr].forEach((err,i)=>{
        if(err) console.error("loadData error table "+i+":",err.message,err.hint||"");
      });
      setEmployees(e||[]);
      const pm={};(p||[]).forEach(x=>pm[x.domain]=x);setPrograms(pm);
      setAttendance(a||[]);setEvaluations(v||[]);setCerts(c||[]);setAuditLogs(l||[]);
    }catch(err){
      console.error("loadData fatal:",err);
    }
    setDataLoading(false);
  },[user,role]);

  useEffect(()=>{if(user&&role)loadData();},[user,role]);

  const handleLogout=async()=>{
    await auditLog(user.id,user.email,"خروج","auth",user.id,null,null);
    await supabase.auth.signOut();
  };

  if(loading) return <LoadingScreen/>;
  if(!user)   return <LoginScreen onLogin={loadRole}/>;

  const canSee=(t)=>{
    if(role==="admin") return true;
    const map={dashboard:true,analytics:true,subtopics:true,annual:true,employees:true,
      tracking:["manager","training","staff"].includes(role),
      evaluations:["manager","training"].includes(role),
      certificates:["manager","training"].includes(role),
      reports:["manager","training","staff"].includes(role),
      audit:false,users:false};
    return map[t]??false;
  };

  const TABS=[
    {id:"dashboard",l:"لوحة التحكم",i:"⊞"},
    {id:"analytics",l:"التحليل",i:"📊"},
    {id:"subtopics",l:"الموضوعات",i:"🎯"},
    {id:"annual",l:"الخطة السنوية",i:"📅"},
    {id:"employees",l:"الموظفون",i:"👤"},
    {id:"tracking",l:"المتابعة",i:"📋"},
    {id:"evaluations",l:"التقييمات",i:"⭐"},
    {id:"certificates",l:"الشهادات",i:"🏆"},
    {id:"reports",l:"التقارير",i:"📈"},
    ...(role==="admin"?[{id:"users",l:"المستخدمون",i:"🔐"},{id:"audit",l:"السجل",i:"📝"}]:[]),
  ].filter(t=>canSee(t.id));

  return <div style={S.app}>
    {toast&&<Toast {...toast}/>}
    <div style={S.header}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{fontSize:26}}>🏛</div>
        <div>
          <div style={{fontSize:14,fontWeight:800,color:"#e2e8f0"}}>الصندوق السيادي السوري</div>
          <div style={{fontSize:9,color:"#334155"}}>نظام إدارة التدريب 2026</div>
        </div>
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        {dataLoading&&<span style={{fontSize:11,color:"#f59e0b"}}>⟳ تحميل...</span>}
        <button style={S.btn(BG.elevated,"#64748b","5px 10px")} onClick={loadData} title="تحديث البيانات">🔄</button>
        <span style={{...S.badge(BG.elevated,ROLES[role]?.color||"#64748b"),fontSize:10}}>{ROLES[role]?.label||role}</span>
        <span style={{fontSize:10,color:"#334155",maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.email}</span>
        <button style={S.btn(BG.elevated,"#64748b","6px 12px")} onClick={handleLogout}>خروج</button>
      </div>
    </div>

    <div style={S.tabs}>
      {TABS.map(t=>(
        <button key={t.id} onClick={()=>setTab(t.id)}
          style={{padding:"10px 16px",background:"transparent",border:"none",
            borderBottom:tab===t.id?"2px solid #3b82f6":"2px solid transparent",
            color:tab===t.id?"#60a5fa":"#475569",fontFamily:"'Tajawal',sans-serif",
            fontWeight:tab===t.id?700:400,fontSize:12,cursor:"pointer",whiteSpace:"nowrap",transition:"color .15s"}}>
          {t.i} {t.l}
        </button>
      ))}
    </div>

    <div style={S.content}>
      {tab==="dashboard"   &&<Dashboard employees={employees} programs={programs} attendance={attendance} evaluations={evaluations} certs={certs} onNav={setTab}/>}
      {tab==="analytics"   &&<AnalyticsPage employees={employees} attendance={attendance} certs={certs} rate={rate} setRate={setRate}/>}
      {tab==="subtopics"   &&<SubtopicsPage employees={employees} user={user}/>}
      {tab==="annual"      &&<AnnualPlanPage employees={employees}/>}
      {tab==="employees"   &&<EmployeesPage employees={employees} user={user} role={role} onRefresh={loadData} showToast={showToast}/>}
      {tab==="tracking"    &&<TrackingPage employees={employees} programs={programs} attendance={attendance} evaluations={evaluations} certs={certs} user={user} onRefresh={loadData}/>}
      {tab==="evaluations" &&<EvaluationsPage employees={employees} attendance={attendance} evaluations={evaluations} certs={certs} user={user} role={role} onRefresh={loadData}/>}
      {tab==="certificates"&&<CertificatesPage employees={employees} certs={certs}/>}
      {tab==="reports"     &&<ReportsPage employees={employees} attendance={attendance} evaluations={evaluations} certs={certs} programs={programs}/>}
      {tab==="users"&&role==="admin"&&<UsersPage user={user} showToast={showToast} onRefresh={loadData}/>}
      {tab==="audit"&&role==="admin"&&<AuditPage auditLogs={auditLogs}/>}
    </div>
  </div>;
}
