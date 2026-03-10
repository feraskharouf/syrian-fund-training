import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

// ═══════════════════════════════════════════
// STATIC DATA
// ═══════════════════════════════════════════
const DOMAINS = ["القيادة الإدارية","الموارد البشرية","المالية والميزانية","الشؤون القانونية","الكفاءة التقنية","التحول الرقمي","المهارات الناعمة","العلاقات والبروتوكول","اللغة الإنجليزية","الإعلام والتواصل","السلامة وإدارة المخاطر","دعم العمليات"];

const DC = {
  "القيادة الإدارية":"#2E6DA4","الموارد البشرية":"#217346","المالية والميزانية":"#C8973A",
  "الشؤون القانونية":"#C65911","الكفاءة التقنية":"#1B3A6B","التحول الرقمي":"#7030A0",
  "المهارات الناعمة":"#00B0F0","العلاقات والبروتوكول":"#FF6B6B","اللغة الإنجليزية":"#3b82f6",
  "الإعلام والتواصل":"#f59e0b","السلامة وإدارة المخاطر":"#9C0006","دعم العمليات":"#e11d48"
};

const SUBTOPICS_DEFAULT = {
  "اللغة الإنجليزية":["المراسلات الإنجليزية","الإنجليزية المحادثة","المصطلحات المالية","التقارير بالإنجليزية","العروض بالإنجليزية"],
  "القيادة الإدارية":["التخطيط الاستراتيجي","التخطيط التشغيلي","إدارة الفرق","صنع القرار","إدارة التغيير"],
  "المالية والميزانية":["إدارة التكاليف","إعداد الميزانية","المراجعة الداخلية","التقارير المالية","المشتريات","التدقيق المالي","المحاسبة","التمويل والاستثمار"],
  "المهارات الناعمة":["مهارات التواصل","مهارات العرض والتقديم","العمل الجماعي","إدارة الوقت","الكتابة الوظيفية"],
  "الشؤون القانونية":["صياغة العقود","التقاضي والنزاعات","السياسات والأنظمة","مكافحة الفساد","الحوكمة والامتثال"],
  "التحول الرقمي":["الذكاء الاصطناعي","Excel المتقدم","الأتمتة","إدارة الوثائق الرقمية","الأمن السيبراني"],
  "الإعلام والتواصل":["بروتوكول التواصل","إدارة الأزمات الإعلامية","الخطابة والتحدث العام","مقابلات الإعلام","إدارة الاجتماعات","الحضور الإعلامي","إنتاج المحتوى"],
  "العلاقات والبروتوكول":["بروتوكول العلاقات","التواصل الإعلامي","المراسلات الرسمية","إدارة أصحاب المصلحة"],
  "الكفاءة التقنية":["ضبط الجودة","إجراءات العمل","إدارة المشاريع","تحليل البيانات","مؤشرات الأداء"],
  "دعم العمليات":["تحسين العمليات","جودة الخدمة","إدارة الأصول","دعم تقنية المعلومات","المشتريات"],
  "السلامة وإدارة المخاطر":["إدارة الحوادث","الصحة والسلامة المهنية","تمارين الطوارئ","خطة الاستمرارية","إدارة المخاطر"],
  "الموارد البشرية":["تحفيز الموظفين","التوظيف والاختيار","إدارة الأداء","قانون العمل","إدارة الموظفين","إدارة النزاعات"]
};

const PROGRAMS = {
  "اللغة الإنجليزية":{days:20,month:"أبريل 2026",color:"#3b82f6",cost:9000,method:"أونلاين + حضوري",provider:"مركز تدريب خارجي"},
  "القيادة الإدارية":{days:10,month:"مايو 2026",color:"#2E6DA4",cost:15000,method:"مجموعات عمل",provider:"استشاري داخلي"},
  "المالية والميزانية":{days:8,month:"يونيو 2026",color:"#C8973A",cost:12000,method:"حضوري",provider:"مركز تدريب خارجي"},
  "المهارات الناعمة":{days:5,month:"يوليو 2026",color:"#217346",cost:8000,method:"هايبرد",provider:"استشاري داخلي"},
  "الشؤون القانونية":{days:6,month:"أغسطس 2026",color:"#C65911",cost:12000,method:"حضوري",provider:"مركز قانوني متخصص"},
  "التحول الرقمي":{days:6,month:"سبتمبر 2026",color:"#7030A0",cost:11000,method:"أونلاين",provider:"منصة إلكترونية"},
  "العلاقات والبروتوكول":{days:4,month:"أكتوبر 2026",color:"#FF6B6B",cost:7000,method:"حضوري",provider:"معهد متخصص"},
  "الإعلام والتواصل":{days:4,month:"نوفمبر 2026",color:"#f59e0b",cost:9000,method:"مجموعات عمل",provider:"استشاري إعلامي"},
  "الكفاءة التقنية":{days:4,month:"ديسمبر 2026",color:"#1B3A6B",cost:10000,method:"تدريب ميداني",provider:"استشاري تقني"},
  "الموارد البشرية":{days:4,month:"يناير 2027",color:"#217346",cost:10000,method:"هايبرد",provider:"استشاري HR"},
  "دعم العمليات":{days:3,month:"فبراير 2027",color:"#e11d48",cost:8000,method:"مجموعات عمل",provider:"استشاري عمليات"},
  "السلامة وإدارة المخاطر":{days:3,month:"مارس 2027",color:"#9C0006",cost:8000,method:"حضوري",provider:"خبير سلامة معتمد"}
};

const DEPT_LIST = ["الشؤون المالية","الموارد البشرية","الشؤون القانونية","تقنية المعلومات","العلاقات العامة","الشؤون الإدارية","التدقيق الداخلي","المشاريع والتطوير","الاستثمار","إدارة المخاطر","الأمانة العامة","إدارة العمليات"];

const gc = g => g>=1.5?"#ef4444":g>=0.75?"#f59e0b":"#22c55e";
const pc = p => p==="عالٍ"?{bg:"#450a0a",fg:"#fca5a5"}:p==="متوسط"?{bg:"#451a03",fg:"#fcd34d"}:{bg:"#052e16",fg:"#86efac"};
const sc = s => ({منجز:"#22c55e",جارٍ:"#f59e0b",مخطط:"#64748b",ملغى:"#ef4444",حرج:"#ef4444",عالٍ:"#f59e0b",متوسط:"#3b82f6",منخفض:"#22c55e"}[s]||"#64748b");

// ═══════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════
const S = {
  app:{fontFamily:"'Tajawal',sans-serif",direction:"rtl",background:"#070d1a",minHeight:"100vh",color:"#e2e8f0",fontSize:14},
  header:{background:"linear-gradient(135deg,#070d1a,#0f2040,#1a3a6b)",borderBottom:"2px solid #C8973A",padding:"13px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:50,boxShadow:"0 4px 30px rgba(0,0,0,.7)"},
  tabs:{background:"#070d1a",borderBottom:"1px solid #1e293b",display:"flex",overflowX:"auto",position:"sticky",top:61,zIndex:40,scrollbarWidth:"none"},
  content:{padding:"18px",maxWidth:1600,margin:"0 auto"},
  card:{background:"linear-gradient(135deg,#0d1829,#111f35)",borderRadius:12,border:"1px solid #1e3558",padding:16,boxShadow:"0 4px 20px rgba(0,0,0,.4)"},
  input:{background:"#070d1a",border:"1px solid #1e3558",color:"#e2e8f0",padding:"8px 12px",borderRadius:8,fontFamily:"'Tajawal',sans-serif",fontSize:13,width:"100%",outline:"none",boxSizing:"border-box"},
  select:{background:"#070d1a",border:"1px solid #1e3558",color:"#e2e8f0",padding:"7px 10px",borderRadius:8,fontFamily:"'Tajawal',sans-serif",fontSize:13,cursor:"pointer",outline:"none"},
  btn:(bg,fg="#fff",p="8px 16px")=>({background:bg,color:fg,border:"none",padding:p,borderRadius:8,fontFamily:"'Tajawal',sans-serif",fontWeight:700,fontSize:12,cursor:"pointer",whiteSpace:"nowrap",transition:"opacity .15s"}),
  badge:(bg,fg)=>({display:"inline-block",padding:"2px 8px",borderRadius:20,fontSize:11,fontWeight:700,background:bg,color:fg}),
  th:{padding:"9px 12px",textAlign:"right",color:"#93c5fd",fontWeight:700,whiteSpace:"nowrap",fontSize:12,background:"#0a1628",borderBottom:"1px solid #1e3558"},
  td:{padding:"8px 12px",borderBottom:"1px solid #0d1829",fontSize:12,verticalAlign:"middle"},
  secTitle:{fontSize:14,fontWeight:900,color:"#C8973A",borderRight:"3px solid #C8973A",paddingRight:9,marginBottom:14,display:"block"},
  modal:{position:"fixed",inset:0,background:"rgba(0,0,0,.93)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:12},
  modalBox:{background:"#0d1829",borderRadius:14,border:"1px solid #1e3558",maxWidth:700,width:"100%",maxHeight:"94vh",overflowY:"auto"},
};

// ═══════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════
function Toast({msg,type}){
  return <div style={{position:"fixed",top:68,left:"50%",transform:"translateX(-50%)",background:type==="error"?"#7f1d1d":"#14532d",border:`1px solid ${type==="error"?"#ef4444":"#22c55e"}`,color:"#fff",padding:"9px 24px",borderRadius:9,zIndex:999,fontWeight:700,fontSize:13,boxShadow:"0 8px 32px rgba(0,0,0,.7)",pointerEvents:"none"}}>
    {msg}
  </div>;
}

function LoadingScreen(){
  return <div style={{...S.app,display:"flex",alignItems:"center",justifyContent:"center"}}>
    <div style={{textAlign:"center",color:"#C8973A"}}>
      <div style={{fontSize:40,marginBottom:8,display:"inline-block",animation:"spin 1s linear infinite"}}>⟳</div>
      <div style={{fontWeight:700,fontSize:15}}>جاري التحميل...</div>
    </div>
  </div>;
}

function Empty({icon,text}){
  return <div style={{textAlign:"center",padding:50,color:"#475569"}}>
    <div style={{fontSize:36,marginBottom:8}}>{icon}</div>
    <div style={{fontSize:13}}>{text}</div>
  </div>;
}

function KPI({v,l,c,i,sub,onClick}){
  return <div onClick={onClick} style={{...S.card,borderTop:`3px solid ${c}`,textAlign:"center",padding:14,cursor:onClick?"pointer":"default"}}
    onMouseOver={e=>{if(onClick)e.currentTarget.style.transform="translateY(-2px)";}}
    onMouseOut={e=>e.currentTarget.style.transform=""}>
    <div style={{fontSize:20}}>{i}</div>
    <div style={{fontSize:22,fontWeight:900,color:c,lineHeight:1.1,marginTop:3}}>{v}</div>
    <div style={{fontSize:10,color:"#64748b",marginTop:3,lineHeight:1.3}}>{l}</div>
    {sub&&<div style={{fontSize:10,color:c,marginTop:2,fontWeight:700}}>{sub}</div>}
  </div>;
}

// ═══════════════════════════════════════════
// CHARTS
// ═══════════════════════════════════════════
function BarChart({data,height=100}){
  const max=Math.max(...data.map(d=>d.v),1);
  return <div style={{display:"flex",alignItems:"flex-end",gap:3,height:height+28}}>
    {data.map((d,i)=>(
      <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
        <div style={{fontSize:9,color:"#93c5fd",fontWeight:700,minHeight:11}}>{d.v>0?d.v:""}</div>
        <div style={{width:"100%",height:Math.max((d.v/max)*height,d.v>0?2:0),background:d.c||"#C8973A",borderRadius:"3px 3px 0 0",boxShadow:`0 0 6px ${d.c||"#C8973A"}44`,transition:"height .3s"}} title={`${d.l}: ${d.v}`}/>
        <div style={{fontSize:8,color:"#64748b",textAlign:"center",lineHeight:1.2,maxWidth:38,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{d.l}</div>
      </div>
    ))}
  </div>;
}

function Donut({segs,size=100}){
  const tot=segs.reduce((s,x)=>s+x.v,0)||1;
  let off=0;
  const r=34,c=2*Math.PI*r;
  return <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r={r} fill="none" stroke="#1e293b" strokeWidth="13"/>
    {segs.map((s,i)=>{
      const d=(s.v/tot)*c;
      const el=<circle key={i} cx="50" cy="50" r={r} fill="none" stroke={s.c} strokeWidth="13"
        strokeDasharray={`${d} ${c-d}`} strokeDashoffset={-off*c} transform="rotate(-90 50 50)"
        style={{filter:`drop-shadow(0 0 3px ${s.c}66)`}}/>;
      off+=s.v/tot;
      return el;
    })}
    <text x="50" y="55" textAnchor="middle" fill="#e2e8f0" fontSize="14" fontWeight="bold">{tot}</text>
  </svg>;
}

// ═══════════════════════════════════════════
// AUDIT LOG HELPER
// ═══════════════════════════════════════════
async function auditLog(uid,email,action,table,rid,oldData,newData){
  try{
    await supabase.from("audit_log").insert({
      user_id:uid,user_email:email,action,
      table_name:table,record_id:rid,
      old_data:oldData,new_data:newData
    });
  }catch(e){}
}

// ═══════════════════════════════════════════
// CERT HTML GENERATOR
// ═══════════════════════════════════════════
function generateCertHTML(cert,empName,dept){
  const date=new Date(cert.issued_at).toLocaleDateString("ar-SY");
  const num=cert.cert_number||"SSF-2026-"+Math.random().toString(36).substr(2,8).toUpperCase();
  return `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8">
<title>شهادة - ${empName}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Arial,sans-serif;background:#f5f0e8;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px}
.cert{width:800px;min-height:560px;background:linear-gradient(135deg,#fefefe 0%,#f8f4ec 100%);border:3px solid #C8973A;border-radius:16px;padding:48px;text-align:center;position:relative;box-shadow:0 10px 40px rgba(0,0,0,.15)}
.cert::before{content:'';position:absolute;inset:10px;border:1px solid #C8973A55;border-radius:10px;pointer-events:none}
.logo{font-size:52px;margin-bottom:6px}
.org{font-size:22px;font-weight:900;color:#1B3A6B}
.org-en{font-size:12px;color:#94a3b8;margin-bottom:4px}
.divider{width:120px;height:3px;background:linear-gradient(90deg,transparent,#C8973A,transparent);margin:12px auto 24px}
.title{font-size:30px;font-weight:900;color:#C8973A;margin-bottom:20px;text-shadow:0 2px 4px rgba(200,151,58,.2)}
.body-text{font-size:16px;color:#374151;line-height:2.2;margin-bottom:20px}
.name{font-size:26px;font-weight:900;color:#1B3A6B;border-bottom:2px solid #C8973A;display:inline-block;padding:0 24px 4px;margin:6px 0}
.dept-text{font-size:13px;color:#64748b;margin-top:2px}
.domain{font-size:20px;font-weight:700;color:#C8973A;margin:10px 0;background:#fef9ec;padding:8px 24px;border-radius:8px;display:inline-block;border:1px solid #C8973A44}
.footer{display:flex;justify-content:space-between;align-items:flex-end;margin-top:32px;padding-top:20px;border-top:1px solid #e2d5b0}
.sig{text-align:center;width:180px}
.sig-line{width:140px;border-top:1px solid #374151;margin:0 auto 6px}
.sig-name{font-size:11px;color:#374151;font-weight:700}
.sig-title{font-size:10px;color:#94a3b8}
.stamp{font-size:10px;color:#94a3b8;text-align:center;margin-top:14px}
@media print{body{background:white;padding:0}@page{size:A4 landscape;margin:.5cm}}
</style></head><body><div class="cert">
<div class="logo">🏛</div>
<div class="org">الصندوق السيادي السوري</div>
<div class="org-en">Syrian Sovereign Fund</div>
<div class="divider"></div>
<div class="title">شهادة إتمام تدريب</div>
<div class="body-text">
  يشهد الصندوق السيادي السوري بأن<br>
  <span class="name">${empName}</span><br>
  <div class="dept-text">${dept}</div>
  قد أتم/أتمت بنجاح برنامج التدريب في مجال<br>
  <span class="domain">${cert.domain}</span>
</div>
<div class="footer">
  <div class="sig"><div class="sig-line"></div><div class="sig-name">مدير الموارد البشرية</div><div class="sig-title">Human Resources Director</div></div>
  <div style="text-align:center"><div style="font-size:38px;margin-bottom:6px">🏆</div><div style="font-size:12px;color:#374151;font-weight:700">تاريخ الإصدار</div><div style="font-size:14px;font-weight:900;color:#1B3A6B">${date}</div></div>
  <div class="sig"><div class="sig-line"></div><div class="sig-name">المدير التنفيذي</div><div class="sig-title">Executive Director</div></div>
</div>
<div class="stamp">رقم الشهادة: ${num} | الصندوق السيادي السوري © 2026</div>
</div></body></html>`;
}

// ═══════════════════════════════════════════
// LOGIN
// ═══════════════════════════════════════════
function LoginScreen({onLogin}){
  const [email,setEmail]=useState("");
  const [pw,setPw]=useState("");
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);

  const go=async()=>{
    if(!email||!pw){setErr("أدخل الإيميل وكلمة السر");return;}
    setLoading(true);setErr("");
    const{data,error}=await supabase.auth.signInWithPassword({email,password:pw});
    if(error){setErr("إيميل أو كلمة سر غير صحيحة");setLoading(false);return;}
    await auditLog(data.user.id,data.user.email,"دخول","auth",data.user.id,null,{time:new Date().toISOString()});
    onLogin(data.user);
  };

  return <div style={{...S.app,display:"flex",alignItems:"center",justifyContent:"center",background:"radial-gradient(ellipse at 50% 40%,#0f2040 0%,#070d1a 70%)"}}>
    <div style={{background:"linear-gradient(135deg,#0d1829,#111f35)",borderRadius:24,border:"1px solid #1e3558",padding:48,maxWidth:420,width:"100%",textAlign:"center",boxShadow:"0 30px 80px rgba(0,0,0,.8)"}}>
      <div style={{fontSize:56,marginBottom:8}}>🏛</div>
      <div style={{fontSize:22,fontWeight:900,color:"#C8973A",marginBottom:4}}>الصندوق السيادي السوري</div>
      <div style={{fontSize:11,color:"#475569",marginBottom:8}}>Syrian Sovereign Fund</div>
      <div style={{fontSize:11,color:"#1e3558",marginBottom:34,padding:"5px 14px",background:"#0a1628",borderRadius:20,display:"inline-block",border:"1px solid #1e3558"}}>نظام إدارة الاحتياجات التدريبية 2026</div>
      <input style={{...S.input,marginBottom:10,direction:"ltr",textAlign:"left",padding:"11px 14px"}} type="email" placeholder="email@ssf.gov.sy" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()}/>
      <input style={{...S.input,marginBottom:14,direction:"ltr",textAlign:"left",padding:"11px 14px"}} type="password" placeholder="••••••••" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()}/>
      {err&&<div style={{color:"#fca5a5",fontSize:12,marginBottom:12,background:"#7f1d1d33",padding:"8px 12px",borderRadius:7,border:"1px solid #7f1d1d44"}}>{err}</div>}
      <button style={{...S.btn("linear-gradient(135deg,#C8973A,#a07830)"),width:"100%",padding:13,fontSize:15,borderRadius:10,boxShadow:"0 4px 20px rgba(200,151,58,.35)",opacity:loading?0.7:1}} onClick={go} disabled={loading}>
        {loading?"جاري الدخول...":"دخول →"}
      </button>
    </div>
  </div>;
}

// ═══════════════════════════════════════════
// SUBTOPICS PAGE
// ═══════════════════════════════════════════
function SubtopicsPage({employees,user}){
  const [subtopics,setSubtopics]=useState(()=>{
    try{const s=localStorage.getItem("ssf_subtopics");return s?JSON.parse(s):JSON.parse(JSON.stringify(SUBTOPICS_DEFAULT));}
    catch{return JSON.parse(JSON.stringify(SUBTOPICS_DEFAULT));}
  });
  const [selDomain,setSelDomain]=useState(DOMAINS[0]);
  const [selTopic,setSelTopic]=useState(null);
  const [newTopic,setNewTopic]=useState("");
  const [adding,setAdding]=useState(false);

  const saveSubs=s=>{setSubtopics(s);try{localStorage.setItem("ssf_subtopics",JSON.stringify(s));}catch(e){}};

  const addTopic=()=>{
    if(!newTopic.trim())return;
    const s={...subtopics,[selDomain]:[...(subtopics[selDomain]||[]),newTopic.trim()]};
    saveSubs(s);setNewTopic("");setAdding(false);
  };

  const delTopic=t=>{
    const s={...subtopics,[selDomain]:(subtopics[selDomain]||[]).filter(x=>x!==t)};
    saveSubs(s);if(selTopic===t)setSelTopic(null);
  };

  const domEmps=employees.filter(e=>e.needs?.[selDomain]&&e.needs[selDomain]!=="-");
  const topicEmps=selTopic?domEmps:[];

  const exportTopicCSV=()=>{
    if(!selTopic&&!domEmps.length)return;
    const list=selTopic?topicEmps:domEmps;
    const rows=[
      ["الاسم","الإدارة","المسمى","المدينة","الهاتف","الإيميل","مستوى الحاجة","الفجوة","الأولوية"],
      ...list.map(e=>[e.name,e.dept,e.title||"",e.city||"",e.phone||"",e.email||"",e.needs[selDomain],(e.gap||0).toFixed(2),e.priority])
    ];
    const blob=new Blob(["\uFEFF"+rows.map(r=>r.join(",")).join("\n")],{type:"text/csv;charset=utf-8"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);
    a.download=`${selTopic||selDomain}_موظفون.csv`;a.click();
  };

  return <div style={{display:"grid",gridTemplateColumns:"230px 1fr",gap:14}}>

    {/* === DOMAIN LIST === */}
    <div style={S.card}>
      <span style={S.secTitle}>المجالات التدريبية</span>
      {DOMAINS.map(d=>{
        const cnt=employees.filter(e=>e.needs?.[d]&&e.needs[d]!=="-").length;
        const high=employees.filter(e=>e.needs?.[d]==="عالٍ").length;
        const sel=selDomain===d;
        return <div key={d} onClick={()=>{setSelDomain(d);setSelTopic(null);}}
          style={{padding:"9px 11px",borderRadius:8,marginBottom:4,cursor:"pointer",
            background:sel?"#1e3558":"transparent",
            border:`1px solid ${sel?DC[d]||"#C8973A":"transparent"}`,
            boxShadow:sel?`0 0 10px ${DC[d]||"#C8973A"}22`:"",transition:"all .15s"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontWeight:sel?900:500,fontSize:12,color:sel?"#e2e8f0":"#94a3b8"}}>{d}</span>
            <div style={{display:"flex",gap:4}}>
              {high>0&&<span style={{...S.badge("#450a0a","#fca5a5"),fontSize:9}}>🔴{high}</span>}
              <span style={{...S.badge("#0a1628","#3b82f6"),fontSize:9}}>{cnt}</span>
            </div>
          </div>
          {sel&&<div style={{fontSize:9,color:"#64748b",marginTop:3}}>{(subtopics[d]||[]).length} موضوع فرعي</div>}
        </div>;
      })}
    </div>

    {/* === DOMAIN DETAIL === */}
    <div>
      <div style={{...S.card,marginBottom:12,borderRight:`4px solid ${DC[selDomain]||"#C8973A"}`}}>

        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14,flexWrap:"wrap",gap:8}}>
          <div>
            <div style={{fontSize:17,fontWeight:900,color:DC[selDomain]||"#C8973A"}}>{selDomain}</div>
            <div style={{fontSize:11,color:"#64748b",marginTop:2}}>
              {PROGRAMS[selDomain]?.month} · {PROGRAMS[selDomain]?.days} يوم · {PROGRAMS[selDomain]?.method} · {PROGRAMS[selDomain]?.provider}
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <div style={{background:"#070d1a",borderRadius:8,padding:"8px 14px",textAlign:"center",border:"1px solid #1e3558"}}>
              <div style={{fontWeight:900,color:"#3b82f6",fontSize:18}}>{domEmps.length}</div>
              <div style={{fontSize:9,color:"#64748b"}}>موظف مسجل</div>
            </div>
            <div style={{background:"#070d1a",borderRadius:8,padding:"8px 14px",textAlign:"center",border:"1px solid #1e3558"}}>
              <div style={{fontWeight:900,color:"#C8973A",fontSize:18}}>${(PROGRAMS[selDomain]?.cost||0).toLocaleString()}</div>
              <div style={{fontSize:9,color:"#64748b"}}>تكلفة مخططة</div>
            </div>
            <div style={{background:"#070d1a",borderRadius:8,padding:"8px 14px",textAlign:"center",border:"1px solid #1e3558"}}>
              <div style={{fontWeight:900,color:"#a78bfa",fontSize:18}}>{PROGRAMS[selDomain]?.days}</div>
              <div style={{fontSize:9,color:"#64748b"}}>يوم تدريبي</div>
            </div>
          </div>
        </div>

        {/* Subtopics header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span style={S.secTitle}>الموضوعات الفرعية ({(subtopics[selDomain]||[]).length})</span>
          <button style={S.btn("#C8973A","#fff","6px 13px")} onClick={()=>setAdding(!adding)}>
            {adding?"إلغاء":"+ إضافة موضوع"}
          </button>
        </div>

        {/* Add topic input */}
        {adding&&<div style={{display:"flex",gap:8,marginBottom:12,background:"#070d1a",padding:10,borderRadius:9,border:"1px solid #1e3558"}}>
          <input style={{...S.input,flex:1}} value={newTopic}
            onChange={e=>setNewTopic(e.target.value)}
            placeholder="أدخل اسم الموضوع الجديد..."
            onKeyDown={e=>e.key==="Enter"&&addTopic()}
            autoFocus/>
          <button style={S.btn("#217346","#fff","8px 16px")} onClick={addTopic}>إضافة ✓</button>
        </div>}

        {/* Topics grid */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))",gap:7,marginBottom:4}}>
          {(subtopics[selDomain]||[]).map(t=>{
            const sel=selTopic===t;
            return <div key={t} onClick={()=>setSelTopic(sel?null:t)}
              style={{background:sel?"#1e3558":"#070d1a",borderRadius:9,padding:"9px 12px",
                border:`1px solid ${sel?DC[selDomain]||"#C8973A":"#1e3558"}`,
                cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",
                boxShadow:sel?`0 0 12px ${DC[selDomain]||"#C8973A"}33`:"",transition:"all .15s"}}>
              <div style={{display:"flex",alignItems:"center",gap:7}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:sel?DC[selDomain]||"#C8973A":"#475569",flexShrink:0,boxShadow:sel?`0 0 6px ${DC[selDomain]||"#C8973A"}`:"",transition:"all .15s"}}/>
                <span style={{fontSize:12,fontWeight:sel?700:500,color:sel?"#e2e8f0":"#94a3b8"}}>{t}</span>
              </div>
              <button onClick={e=>{e.stopPropagation();delTopic(t);}}
                style={{background:"transparent",border:"none",color:"#ef444466",cursor:"pointer",fontSize:13,padding:"0 2px",lineHeight:1}}
                title="حذف الموضوع">✕</button>
            </div>;
          })}
        </div>
      </div>

      {/* === TOPIC EMPLOYEES === */}
      {selTopic&&<div style={S.card}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
          <span style={S.secTitle}>موظفو «{selTopic}» — {selDomain} ({topicEmps.length})</span>
          <div style={{display:"flex",gap:8}}>
            <button style={S.btn("#217346","#fff","7px 13px")} onClick={exportTopicCSV}>📥 تصدير Excel</button>
          </div>
        </div>
        {topicEmps.length===0
          ?<Empty icon="👥" text="لا يوجد موظفون مسجلون في هذا المجال"/>
          :<div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr>
                {["#","الاسم","الإدارة","المسمى","المدينة","الهاتف","الإيميل","المستوى","الفجوة","الأولوية"].map(h=><th key={h} style={S.th}>{h}</th>)}
              </tr></thead>
              <tbody>{topicEmps.map((e,i)=>{
                const{bg,fg}=pc(e.needs[selDomain]);
                return <tr key={e.id} style={{background:i%2===0?"#070d1a":"#0d1829"}}>
                  <td style={S.td}><span style={{color:"#475569"}}>{i+1}</span></td>
                  <td style={S.td}><span style={{fontWeight:700}}>{e.name}</span></td>
                  <td style={S.td}><span style={{color:"#93c5fd"}}>{e.dept}</span></td>
                  <td style={S.td}><span style={{color:"#94a3b8"}}>{e.title||"—"}</span></td>
                  <td style={S.td}>{e.city||"—"}</td>
                  <td style={S.td}>{e.phone
                    ?<a href={`tel:${e.phone}`} style={{color:"#22c55e",textDecoration:"none"}}>{e.phone}</a>
                    :"—"}</td>
                  <td style={S.td}>{e.email
                    ?<a href={`mailto:${e.email}`} style={{color:"#3b82f6",textDecoration:"none",fontSize:11}}>{e.email}</a>
                    :"—"}</td>
                  <td style={S.td}><span style={S.badge(bg,fg)}>{e.needs[selDomain]}</span></td>
                  <td style={S.td}><span style={{fontWeight:900,color:gc(e.gap||0)}}>{(e.gap||0).toFixed(2)}</span></td>
                  <td style={S.td}><span style={{color:sc(e.priority),fontWeight:700}}>{e.priority}</span></td>
                </tr>;
              })}</tbody>
            </table>
          </div>}
      </div>}

      {/* === ALL DOMAIN EMPLOYEES (no topic selected) === */}
      {!selTopic&&domEmps.length>0&&<div style={S.card}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <span style={S.secTitle}>جميع موظفي {selDomain} ({domEmps.length})</span>
          <button style={S.btn("#217346","#fff","7px 13px")} onClick={exportTopicCSV}>📥 تصدير</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:7}}>
          {domEmps.map(e=>{
            const{bg,fg}=pc(e.needs[selDomain]);
            return <div key={e.id} style={{background:"#070d1a",borderRadius:9,padding:"9px 12px",border:"1px solid #1e3558"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                <div>
                  <div style={{fontWeight:700,fontSize:12}}>{e.name}</div>
                  <div style={{fontSize:10,color:"#64748b"}}>{e.dept}</div>
                </div>
                <span style={S.badge(bg,fg)}>{e.needs[selDomain]}</span>
              </div>
              {e.phone&&<div style={{fontSize:10,color:"#22c55e",marginTop:3}}>📞 {e.phone}</div>}
              {e.email&&<div style={{fontSize:10,color:"#3b82f6",marginTop:1}}>✉️ {e.email}</div>}
            </div>;
          })}
        </div>
      </div>}
    </div>
  </div>;
}

// ═══════════════════════════════════════════
// ANNUAL PLAN PAGE
// ═══════════════════════════════════════════
function AnnualPlanPage({employees}){
  const [plan,setPlan]=useState(
    DOMAINS.map(d=>({
      domain:d,
      days:PROGRAMS[d]?.days||4,
      cost:PROGRAMS[d]?.cost||8000,
      participants:employees.filter(e=>e.needs?.[d]&&e.needs[d]!=="-").length,
      month:PROGRAMS[d]?.month||"",
      status:"مخطط",
      method:PROGRAMS[d]?.method||"",
      provider:PROGRAMS[d]?.provider||""
    }))
  );
  const [rate,setRate]=useState(35);
  const [view,setView]=useState("gantt");
  const [selDomain,setSelDomain]=useState(null);

  // sync participants when employees change
  useEffect(()=>{
    setPlan(prev=>prev.map(p=>({
      ...p,
      participants:employees.filter(e=>e.needs?.[p.domain]&&e.needs[p.domain]!=="-").length
    })));
  },[employees]);

  const upd=(i,f,v)=>setPlan(prev=>{
    const n=[...prev];
    n[i]={...n[i],[f]:["days","cost","participants"].includes(f)?Math.max(0,+v):v};
    return n;
  });

  const totCost=plan.reduce((s,p)=>s+p.cost,0);
  const totDays=plan.reduce((s,p)=>s+p.days,0);
  const totPart=plan.reduce((s,p)=>s+p.participants,0);
  const done=plan.filter(p=>p.status==="منجز").length;
  const statusColor={منجز:"#22c55e",جارٍ:"#f59e0b",مخطط:"#64748b",ملغى:"#ef4444"};

  const exportPlan=()=>{
    const rows=[
      ["المجال","الشهر","الأيام","المشاركون","التكلفة","تكلفة/مشارك","الطريقة","الجهة المنفذة","الحالة"],
      ...plan.map(p=>[p.domain,p.month,p.days,p.participants,p.cost,
        Math.round(p.cost/Math.max(p.participants,1)),p.method,p.provider,p.status])
    ];
    const blob=new Blob(["\uFEFF"+rows.map(r=>r.join(",")).join("\n")],{type:"text/csv;charset=utf-8"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="الخطة_السنوية_2026.csv";a.click();
  };

  const selPlan=selDomain?plan.find(p=>p.domain===selDomain):null;

  return <div>
    {/* KPIs */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10,marginBottom:16}}>
      <KPI v={12} l="برنامج تدريبي" c="#C8973A" i="📅" sub="أبريل 2026 — مارس 2027"/>
      <KPI v={totDays} l="إجمالي الأيام" c="#3b82f6" i="📆"/>
      <KPI v={totPart} l="إجمالي المشاركين" c="#22c55e" i="👥"/>
      <KPI v={`$${(totCost/1000).toFixed(0)}k`} l="إجمالي الميزانية" c="#C8973A" i="💰"/>
      <KPI v={`${done}/12`} l="برامج منجزة" c="#22c55e" i="✅"/>
      <KPI v={`$${rate}/يوم`} l="معدل اليوم التدريبي" c="#a78bfa" i="💵"/>
    </div>

    {/* Controls */}
    <div style={{...S.card,marginBottom:14,display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
      <div style={{display:"flex",gap:6}}>
        {[["gantt","📊 Gantt"],["table","📋 جدول"],["budget","💰 ميزانية"]].map(([val,label])=>(
          <button key={val} style={S.btn(view===val?"#C8973A":"#1e3558",view===val?"#fff":"#94a3b8","7px 14px")}
            onClick={()=>setView(val)}>{label}</button>
        ))}
      </div>
      <div style={{marginRight:"auto",display:"flex",gap:8,alignItems:"center"}}>
        <span style={{fontSize:11,color:"#64748b"}}>معدل اليوم $</span>
        <input type="number" min={5} max={500} value={rate}
          onChange={e=>setRate(Math.max(1,+e.target.value))}
          style={{...S.input,width:70,padding:"5px 9px",fontSize:12}}/>
        <button style={S.btn("#217346","#fff","7px 14px")} onClick={exportPlan}>📥 تصدير</button>
      </div>
    </div>

    {/* ── GANTT ── */}
    {view==="gantt"&&<div style={S.card}>
      <span style={S.secTitle}>مخطط Gantt — اضغط على أي برنامج لعرض تفاصيله</span>
      <div style={{overflowX:"auto"}}>
        <div style={{minWidth:940}}>
          {/* Month headers */}
          <div style={{display:"flex",marginBottom:6,paddingRight:196}}>
            {plan.map((p,i)=>(
              <div key={i} style={{flex:1,textAlign:"center",fontSize:9,color:"#475569",fontWeight:700,
                padding:"3px 1px",background:"#0a1628",borderRadius:3,margin:"0 1px"}}>
                {p.month.replace(" 2026","").replace(" 2027","*")}
              </div>
            ))}
          </div>
          {/* Rows */}
          {plan.map((p,pi)=>(
            <div key={pi} style={{display:"flex",alignItems:"center",marginBottom:5,gap:5}}>
              <div style={{width:192,flexShrink:0,fontSize:11,fontWeight:700,
                textAlign:"right",paddingLeft:6,color:DC[p.domain]||"#C8973A",
                cursor:"pointer",userSelect:"none"}}
                onClick={()=>setSelDomain(selDomain===p.domain?null:p.domain)}>
                {p.domain}
              </div>
              {plan.map((_,ci)=>{
                const active=ci===pi;
                const isSelected=active&&selDomain===p.domain;
                return <div key={ci} onClick={()=>active&&setSelDomain(selDomain===p.domain?null:p.domain)}
                  style={{flex:1,height:34,borderRadius:4,margin:"0 1px",
                    background:active?DC[p.domain]||"#C8973A":"#1e3558",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:9,color:"#fff",fontWeight:700,
                    boxShadow:active?`0 0 10px ${DC[p.domain]||"#C8973A"}55`:"",
                    border:isSelected?"2px solid #fff":"1px solid transparent",
                    cursor:active?"pointer":"default",transition:"all .15s",opacity:p.status==="ملغى"?0.4:1}}>
                  {active&&`${p.days}ي`}
                </div>;
              })}
              <div style={{width:56,flexShrink:0,fontSize:10,color:statusColor[p.status],fontWeight:700}}>{p.status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected domain detail */}
      {selPlan&&<div style={{marginTop:16,padding:14,background:"#070d1a",borderRadius:10,
        border:`2px solid ${DC[selPlan.domain]||"#C8973A"}`,animation:"fadeIn .2s"}}>
        <div style={{fontWeight:900,color:DC[selPlan.domain]||"#C8973A",fontSize:14,marginBottom:12}}>
          📋 {selPlan.domain} — {selPlan.month}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:8,marginBottom:12}}>
          {[["الأيام",selPlan.days,"#3b82f6"],["المشاركون",selPlan.participants,"#22c55e"],
            ["التكلفة الكلية",`$${selPlan.cost.toLocaleString()}`,"#C8973A"],
            ["تكلفة/مشارك",`$${Math.round(selPlan.cost/Math.max(selPlan.participants,1))}`,"#a78bfa"],
            ["الطريقة",selPlan.method,"#f59e0b"],["الجهة المنفذة",selPlan.provider,"#94a3b8"]
          ].map(([l,v,c])=>(
            <div key={l} style={{background:"#0d1829",borderRadius:8,padding:"8px 11px",border:"1px solid #1e3558"}}>
              <div style={{fontSize:9,color:"#64748b",marginBottom:2}}>{l}</div>
              <div style={{fontWeight:700,color:c,fontSize:12}}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{fontSize:11,color:"#64748b",marginBottom:6}}>
          المشاركون المتوقعون ({employees.filter(e=>e.needs?.[selPlan.domain]&&e.needs[selPlan.domain]!=="-").length})
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
          {employees.filter(e=>e.needs?.[selPlan.domain]&&e.needs[selPlan.domain]!=="-").map(e=>{
            const{bg,fg}=pc(e.needs[selPlan.domain]);
            return <span key={e.id} style={{...S.badge(bg,fg),fontSize:10}}>{e.name}</span>;
          })}
        </div>
      </div>}
    </div>}

    {/* ── TABLE ── */}
    {view==="table"&&<div style={S.card}>
      <span style={S.secTitle}>الجدول التفصيلي — جميع الحقول قابلة للتعديل</span>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            {["المجال","الشهر","الأيام","المشاركون","التكلفة $","تكلفة/مشارك","تكلفة بالمعدل","الطريقة","الحالة"].map(h=>
              <th key={h} style={S.th}>{h}</th>)}
          </tr></thead>
          <tbody>
            {plan.map((p,i)=>(
              <tr key={i} style={{background:i%2===0?"#070d1a":"#0d1829"}}>
                <td style={S.td}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:DC[p.domain]||"#C8973A",flexShrink:0}}/>
                    <span style={{fontWeight:700,fontSize:11}}>{p.domain}</span>
                  </div>
                </td>
                <td style={S.td}><span style={{color:"#93c5fd",fontSize:11}}>{p.month}</span></td>
                <td style={S.td}>
                  <input type="number" min={1} max={90} value={p.days}
                    onChange={e=>upd(i,"days",e.target.value)}
                    style={{...S.input,width:54,padding:"4px 6px",fontSize:11,textAlign:"center"}}/>
                </td>
                <td style={S.td}>
                  <input type="number" min={0} value={p.participants}
                    onChange={e=>upd(i,"participants",e.target.value)}
                    style={{...S.input,width:58,padding:"4px 6px",fontSize:11,textAlign:"center"}}/>
                </td>
                <td style={S.td}>
                  <input type="number" min={0} value={p.cost}
                    onChange={e=>upd(i,"cost",e.target.value)}
                    style={{...S.input,width:85,padding:"4px 6px",fontSize:11,textAlign:"center"}}/>
                </td>
                <td style={S.td}><span style={{color:"#a78bfa",fontWeight:700}}>${Math.round(p.cost/Math.max(p.participants,1)).toLocaleString()}</span></td>
                <td style={S.td}><span style={{color:"#64748b"}}>${(p.days*p.participants*rate).toLocaleString()}</span></td>
                <td style={S.td}><span style={{color:"#94a3b8",fontSize:11}}>{p.method}</span></td>
                <td style={S.td}>
                  <select style={{...S.input,width:82,padding:"4px 6px",fontSize:11,color:statusColor[p.status]}}
                    value={p.status} onChange={e=>upd(i,"status",e.target.value)}>
                    {["مخطط","جارٍ","منجز","ملغى"].map(s=><option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{background:"#0a1628",fontWeight:900}}>
              <td colSpan={2} style={{padding:"10px 12px",color:"#C8973A"}}>الإجمالي</td>
              <td style={{padding:"10px 12px",color:"#3b82f6"}}>{totDays} يوم</td>
              <td style={{padding:"10px 12px",color:"#22c55e"}}>{totPart}</td>
              <td style={{padding:"10px 12px",color:"#C8973A",fontSize:14}}>${totCost.toLocaleString()}</td>
              <td style={{padding:"10px 12px",color:"#a78bfa"}}>${Math.round(totCost/Math.max(totPart,1)).toLocaleString()}</td>
              <td style={{padding:"10px 12px",color:"#64748b"}}>${plan.reduce((s,p)=>s+p.days*p.participants*rate,0).toLocaleString()}</td>
              <td colSpan={2}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>}

    {/* ── BUDGET ── */}
    {view==="budget"&&<div>
      <div style={{...S.card,marginBottom:14}}>
        <span style={S.secTitle}>تحليل الميزانية التفاعلي — يتحدث تلقائياً عند تعديل الأرقام</span>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:16}}>
          {[
            ["الإجمالي المدخل",`$${totCost.toLocaleString()}`,"#C8973A"],
            ["بحسب المعدل اليومي",`$${plan.reduce((s,p)=>s+p.days*p.participants*rate,0).toLocaleString()}`,"#3b82f6"],
            ["تكلفة / مشارك",`$${Math.round(totCost/Math.max(totPart,1)).toLocaleString()}`,"#22c55e"],
            ["إجمالي الأيام",totDays,"#a78bfa"],
          ].map(([l,v,c])=>(
            <div key={l} style={{background:"#070d1a",borderRadius:9,padding:"11px 16px",border:`1px solid ${c}33`,flex:1,minWidth:120}}>
              <div style={{fontSize:10,color:"#64748b",marginBottom:3}}>{l}</div>
              <div style={{fontSize:20,fontWeight:900,color:c}}>{v}</div>
            </div>
          ))}
        </div>
        <BarChart data={plan.map(p=>({l:p.domain.substring(0,5),v:p.cost,c:DC[p.domain]||"#C8973A"}))} height={120}/>
      </div>

      <div style={{overflowX:"auto",borderRadius:12,border:"1px solid #1e3558"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            {["المجال","الأيام","المشاركون","التكلفة المدخلة","التكلفة بالمعدل","الفرق","النسبة من الكل"].map(h=>
              <th key={h} style={S.th}>{h}</th>)}
          </tr></thead>
          <tbody>
            {plan.map((p,i)=>{
              const rc=p.days*p.participants*rate;
              const diff=p.cost-rc;
              const pct=totCost>0?(p.cost/totCost*100).toFixed(1):0;
              return <tr key={i} style={{background:i%2===0?"#070d1a":"#0d1829"}}>
                <td style={S.td}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <div style={{width:7,height:7,borderRadius:"50%",background:DC[p.domain]||"#C8973A"}}/>
                    <span style={{fontWeight:700,fontSize:11}}>{p.domain}</span>
                  </div>
                </td>
                <td style={S.td}><span style={{color:"#a78bfa"}}>{p.days}</span></td>
                <td style={S.td}><span style={{color:"#3b82f6"}}>{p.participants}</span></td>
                <td style={S.td}><span style={{fontWeight:900,color:"#C8973A"}}>${p.cost.toLocaleString()}</span></td>
                <td style={S.td}><span style={{color:"#94a3b8"}}>${rc.toLocaleString()}</span></td>
                <td style={S.td}>
                  <span style={{color:diff>0?"#ef4444":"#22c55e",fontWeight:700}}>
                    {diff>0?"+":""}{diff.toLocaleString()}
                  </span>
                </td>
                <td style={S.td}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <div style={{width:70,height:5,background:"#1e293b",borderRadius:3,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${pct}%`,background:DC[p.domain]||"#C8973A",borderRadius:3,transition:"width .3s"}}/>
                    </div>
                    <span style={{fontSize:10,color:"#64748b"}}>{pct}%</span>
                  </div>
                </td>
              </tr>;
            })}
          </tbody>
        </table>
      </div>
    </div>}
  </div>;
}
// ═══════════════════════════════════════════
// TRACKING PAGE
// ═══════════════════════════════════════════
function TrackingPage({employees,programs,attendance,evaluations,certs,user,onRefresh}){
  const [selDomain,setSelDomain]=useState(DOMAINS[0]);
  const [selEmpId,setSelEmpId]=useState(null);
  const [saving,setSaving]=useState({});
  const statusColor={منجز:"#22c55e",جارٍ:"#f59e0b",مخطط:"#64748b",ملغى:"#ef4444"};

  const parts=employees.filter(e=>e.needs?.[selDomain]&&e.needs[selDomain]!=="-");
  const prog=programs[selDomain];
  const progStatus=prog?.status||"مخطط";
  const present=parts.filter(e=>attendance.find(a=>a.employee_id===e.id&&a.domain===selDomain&&a.status==="حاضر")).length;
  const excused=parts.filter(e=>attendance.find(a=>a.employee_id===e.id&&a.domain===selDomain&&a.status==="معذور")).length;

  const setAtt=async(empId,status)=>{
    setSaving(s=>({...s,[empId]:true}));
    const ex=attendance.find(a=>a.domain===selDomain&&a.employee_id===empId);
    if(ex) await supabase.from("attendance").update({status,updated_by:user.id}).eq("id",ex.id);
    else   await supabase.from("attendance").insert({domain:selDomain,employee_id:empId,status,updated_by:user.id});
    await auditLog(user.id,user.email,"تغيير حضور: "+status,"attendance",empId,null,{domain:selDomain,status});
    setSaving(s=>({...s,[empId]:false}));
    onRefresh();
  };

  const setProgStatus=async(status)=>{
    const ex=programs[selDomain];
    if(ex) await supabase.from("training_programs").update({status,updated_by:user.id}).eq("domain",selDomain);
    else   await supabase.from("training_programs").insert({domain:selDomain,status,updated_by:user.id});
    await auditLog(user.id,user.email,"تغيير حالة برنامج: "+status,"training_programs",selDomain,{status:ex?.status},{status});
    onRefresh();
  };

  const selEmp=selEmpId?employees.find(e=>e.id===selEmpId):null;

  return <div style={{display:"grid",gridTemplateColumns:"215px 1fr",gap:14}}>
    {/* SIDEBAR */}
    <div style={S.card}>
      <span style={S.secTitle}>البرامج التدريبية</span>
      {DOMAINS.map(d=>{
        const cnt=employees.filter(e=>e.needs?.[d]&&e.needs[d]!=="-").length;
        const prs=employees.filter(e=>attendance.find(a=>a.employee_id===e.id&&a.domain===d&&a.status==="حاضر")).length;
        const st=programs[d]?.status||"مخطط";
        const sel=selDomain===d;
        return <div key={d} onClick={()=>{setSelDomain(d);setSelEmpId(null);}}
          style={{padding:"8px 10px",borderRadius:8,marginBottom:4,cursor:"pointer",
            background:sel?"#1e3558":"transparent",
            border:"1px solid "+(sel?DC[d]||"#C8973A":"transparent"),transition:"all .15s"}}>
          <div style={{fontWeight:sel?900:500,fontSize:11,color:sel?"#e2e8f0":"#94a3b8",marginBottom:3}}>{d}</div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:9}}>
            <span style={{color:statusColor[st]}}>● {st}</span>
            <span style={{color:"#64748b"}}>{prs}/{cnt} حضر</span>
          </div>
          {sel&&cnt>0&&<div style={{marginTop:4,height:3,background:"#1e293b",borderRadius:2,overflow:"hidden"}}>
            <div style={{height:"100%",width:(prs/cnt*100)+"%",background:"#22c55e",borderRadius:2}}/>
          </div>}
        </div>;
      })}
    </div>

    {/* MAIN */}
    <div>
      {/* Header */}
      <div style={{...S.card,marginBottom:12,borderRight:"4px solid "+(DC[selDomain]||"#C8973A")}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8,marginBottom:10}}>
          <div>
            <div style={{fontSize:16,fontWeight:900,color:DC[selDomain]||"#C8973A"}}>{selDomain}</div>
            <div style={{fontSize:11,color:"#64748b",marginTop:2}}>{PROGRAMS[selDomain]?.month} · {PROGRAMS[selDomain]?.days} يوم · {PROGRAMS[selDomain]?.method}</div>
          </div>
          <div style={{display:"flex",gap:7,alignItems:"center",flexWrap:"wrap"}}>
            {[{v:parts.length,l:"مشارك",c:"#3b82f6"},{v:present,l:"حضر",c:"#22c55e"},{v:excused,l:"معذور",c:"#f59e0b"},{v:parts.length-present-excused,l:"غائب",c:"#ef4444"}].map(k=>(
              <div key={k.l} style={{background:"#070d1a",borderRadius:8,padding:"6px 11px",textAlign:"center",border:"1px solid "+k.c+"33"}}>
                <div style={{fontWeight:900,color:k.c,fontSize:16}}>{k.v}</div>
                <div style={{fontSize:9,color:"#64748b"}}>{k.l}</div>
              </div>
            ))}
            <select style={{...S.select,fontSize:11,color:statusColor[progStatus],border:"1px solid "+statusColor[progStatus]}}
              value={progStatus} onChange={e=>setProgStatus(e.target.value)}>
              {["مخطط","جارٍ","منجز","ملغى"].map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={{fontSize:10,color:"#64748b",marginBottom:5}}>الموضوعات الفرعية:</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
          {(SUBTOPICS_DEFAULT[selDomain]||[]).map(t=>(
            <span key={t} style={{fontSize:10,color:"#94a3b8",background:"#1e3558",borderRadius:10,padding:"2px 9px"}}>{t}</span>
          ))}
        </div>
      </div>

      {/* Attendance table */}
      <div style={{...S.card,marginBottom:selEmp?12:0}}>
        <span style={S.secTitle}>كشف الحضور التفصيلي ({parts.length} موظف)</span>
        {parts.length===0?<Empty icon="👥" text="لا يوجد موظفون في هذا البرنامج"/>:
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>
              {["الموظف","الإدارة","المستوى","الفجوة","الحضور","التقييم","شهادة","تفاصيل"].map(h=><th key={h} style={S.th}>{h}</th>)}
            </tr></thead>
            <tbody>{parts.map((e,i)=>{
              const av=attendance.find(a=>a.employee_id===e.id&&a.domain===selDomain)?.status||"غائب";
              const ev=evaluations.find(v=>v.employee_id===e.id&&v.domain===selDomain);
              const cert=certs.find(c=>c.employee_id===e.id&&c.domain===selDomain);
              const{bg,fg}=pc(e.needs[selDomain]);
              const isSel=selEmpId===e.id;
              return <tr key={e.id} style={{background:isSel?"#1e3558":i%2===0?"#070d1a":"#0d1829",transition:"background .15s"}}>
                <td style={S.td}>
                  <div style={{fontWeight:700}}>{e.name}</div>
                  <div style={{fontSize:9,color:"#64748b"}}>{e.city||""}</div>
                  {e.phone&&<div style={{fontSize:9,color:"#22c55e"}}>📞 {e.phone}</div>}
                </td>
                <td style={S.td}><span style={{color:"#93c5fd",fontSize:11}}>{e.dept}</span></td>
                <td style={S.td}><span style={S.badge(bg,fg)}>{e.needs[selDomain]}</span></td>
                <td style={S.td}><span style={{fontWeight:900,color:gc(e.gap||0)}}>{(e.gap||0).toFixed(2)}</span></td>
                <td style={S.td}>
                  <select style={{...S.select,fontSize:10,padding:"3px 6px",
                    background:av==="حاضر"?"#052e16":av==="معذور"?"#451a03":"#450a0a",
                    color:av==="حاضر"?"#86efac":av==="معذور"?"#fcd34d":"#fca5a5",
                    opacity:saving[e.id]?0.5:1}}
                    value={av} onChange={el=>setAtt(e.id,el.target.value)} disabled={!!saving[e.id]}>
                    <option>غائب</option><option>حاضر</option><option>معذور</option>
                  </select>
                </td>
                <td style={S.td}>{ev?<span style={{color:"#C8973A",fontWeight:700}}>⭐{ev.score}/5</span>:<span style={{color:"#475569"}}>—</span>}</td>
                <td style={S.td}>{cert?<span style={{color:"#22c55e",fontSize:12}}>✅</span>:<span style={{color:"#475569"}}>—</span>}</td>
                <td style={S.td}>
                  <button style={S.btn(isSel?"#C8973A":"#1e3558",isSel?"#fff":"#93c5fd","4px 9px")}
                    onClick={()=>setSelEmpId(isSel?null:e.id)}>
                    {isSel?"إخفاء":"عرض"}
                  </button>
                </td>
              </tr>;
            })}</tbody>
          </table>
        </div>}
      </div>

      {/* Employee detail panel */}
      {selEmp&&<div style={{...S.card,borderTop:"3px solid "+(DC[selDomain]||"#C8973A")}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12,flexWrap:"wrap",gap:8}}>
          <div>
            <div style={{fontSize:15,fontWeight:900}}>{selEmp.name}</div>
            <div style={{fontSize:11,color:"#64748b"}}>{selEmp.dept} · {selEmp.title} · {selEmp.city}</div>
            {selEmp.phone&&<div style={{fontSize:11,color:"#22c55e",marginTop:3}}>📞 {selEmp.phone}</div>}
            {selEmp.email&&<div style={{fontSize:11,color:"#3b82f6",marginTop:1}}>✉️ {selEmp.email}</div>}
          </div>
          <div style={{display:"flex",gap:7}}>
            <div style={{background:"#070d1a",borderRadius:8,padding:"7px 12px",textAlign:"center",border:"1px solid "+gc(selEmp.gap||0)+"44"}}>
              <div style={{fontWeight:900,color:gc(selEmp.gap||0),fontSize:16}}>{(selEmp.gap||0).toFixed(2)}</div>
              <div style={{fontSize:9,color:"#64748b"}}>الفجوة</div>
            </div>
            <div style={{background:"#070d1a",borderRadius:8,padding:"7px 12px",textAlign:"center",border:"1px solid #1e3558"}}>
              <div style={{fontWeight:900,color:"#3b82f6",fontSize:16}}>{DOMAINS.filter(d=>selEmp.needs?.[d]&&selEmp.needs[d]!=="-").length}</div>
              <div style={{fontSize:9,color:"#64748b"}}>مجالات</div>
            </div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <div>
            <div style={{fontSize:11,color:"#C8973A",fontWeight:700,marginBottom:6}}>جميع الاحتياجات</div>
            {DOMAINS.filter(d=>selEmp.needs?.[d]&&selEmp.needs[d]!=="-").map(d=>{
              const{bg,fg}=pc(selEmp.needs[d]);
              return <div key={d} style={{display:"flex",justifyContent:"space-between",padding:"5px 8px",borderRadius:6,background:"#070d1a",marginBottom:3,fontSize:11,border:"1px solid "+(DC[d]||"#1e3558")+"22"}}>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:DC[d]||"#C8973A"}}/>
                  {d}
                </div>
                <span style={S.badge(bg,fg)}>{selEmp.needs[d]}</span>
              </div>;
            })}
          </div>
          <div>
            <div style={{fontSize:11,color:"#C8973A",fontWeight:700,marginBottom:6}}>سجل التدريب الكامل</div>
            {DOMAINS.filter(d=>selEmp.needs?.[d]&&selEmp.needs[d]!=="-").map(d=>{
              const a=attendance.find(a=>a.employee_id===selEmp.id&&a.domain===d);
              const ev=evaluations.find(v=>v.employee_id===selEmp.id&&v.domain===d);
              const cert=certs.find(c=>c.employee_id===selEmp.id&&c.domain===d);
              return <div key={d} style={{display:"flex",justifyContent:"space-between",padding:"5px 8px",borderRadius:6,background:"#070d1a",marginBottom:3,fontSize:11}}>
                <span style={{color:"#94a3b8",maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d}</span>
                <div style={{display:"flex",gap:6}}>
                  <span style={{color:a?.status==="حاضر"?"#22c55e":a?.status==="معذور"?"#f59e0b":"#475569"}}>
                    {a?.status==="حاضر"?"✅":a?.status==="معذور"?"⚠️":"❌"}
                  </span>
                  {ev&&<span style={{color:"#C8973A"}}>⭐{ev.score}</span>}
                  {cert&&<span style={{color:"#f472b6"}}>🏆</span>}
                </div>
              </div>;
            })}
          </div>
        </div>
      </div>}
    </div>
  </div>;
}

// ═══════════════════════════════════════════
// EVALUATIONS PAGE
// ═══════════════════════════════════════════
function EvaluationsPage({employees,attendance,evaluations,certs,user,role,onRefresh}){
  const [selDomain,setSelDomain]=useState(DOMAINS[0]);
  const [saving,setSaving]=useState({});

  const parts=employees.filter(e=>e.needs?.[selDomain]&&e.needs[selDomain]!=="-");

  const setScore=async(empId,score)=>{
    setSaving(s=>({...s,[empId+"_s"]:true}));
    const ex=evaluations.find(e=>e.employee_id===empId&&e.domain===selDomain);
    if(ex) await supabase.from("evaluations").update({score,evaluated_by:user.id}).eq("id",ex.id);
    else   await supabase.from("evaluations").insert({employee_id:empId,domain:selDomain,score,evaluated_by:user.id});
    setSaving(s=>({...s,[empId+"_s"]:false}));
    onRefresh();
  };

  const setNote=async(empId,note)=>{
    const ex=evaluations.find(e=>e.employee_id===empId&&e.domain===selDomain);
    if(ex) await supabase.from("evaluations").update({note,evaluated_by:user.id}).eq("id",ex.id);
    else   await supabase.from("evaluations").insert({employee_id:empId,domain:selDomain,note,evaluated_by:user.id});
    onRefresh();
  };

  const issueCert=async(empId)=>{
    if(certs.find(c=>c.employee_id===empId&&c.domain===selDomain)) return;
    setSaving(s=>({...s,[empId+"_c"]:true}));
    await supabase.from("certificates").insert({employee_id:empId,domain:selDomain,issued_by:user.id});
    await auditLog(user.id,user.email,"إصدار شهادة","certificates",empId,null,{domain:selDomain});
    setSaving(s=>({...s,[empId+"_c"]:false}));
    onRefresh();
  };

  const printCert=(empId)=>{
    const cert=certs.find(c=>c.employee_id===empId&&c.domain===selDomain);
    const emp=employees.find(e=>e.id===empId);
    if(!cert||!emp) return;
    const w=window.open("","_blank");
    w.document.write(generateCertHTML(cert,emp.name,emp.dept));
    w.document.close();
    setTimeout(()=>w.print(),600);
  };

  return <div style={{display:"grid",gridTemplateColumns:"215px 1fr",gap:14}}>
    {/* SIDEBAR */}
    <div style={S.card}>
      <span style={S.secTitle}>البرامج</span>
      {DOMAINS.map(d=>{
        const cnt=employees.filter(e=>e.needs?.[d]&&e.needs[d]!=="-").length;
        const evCnt=evaluations.filter(ev=>ev.domain===d).length;
        const certCnt=certs.filter(c=>employees.find(e=>e.id===c.employee_id&&e.needs?.[d]&&e.needs[d]!=="-")).length;
        const sel=selDomain===d;
        return <div key={d} onClick={()=>setSelDomain(d)}
          style={{padding:"8px 10px",borderRadius:8,marginBottom:4,cursor:"pointer",
            background:sel?"#1e3558":"transparent",
            border:"1px solid "+(sel?DC[d]||"#C8973A":"transparent"),transition:"all .15s"}}>
          <div style={{fontWeight:sel?900:500,fontSize:11,color:sel?"#e2e8f0":"#94a3b8",marginBottom:3}}>{d}</div>
          <div style={{display:"flex",gap:8,fontSize:9}}>
            <span style={{color:"#64748b"}}>{cnt} مشارك</span>
            <span style={{color:"#C8973A"}}>⭐{evCnt}</span>
            <span style={{color:"#f472b6"}}>🏆{certCnt}</span>
          </div>
        </div>;
      })}
    </div>

    {/* MAIN */}
    <div style={S.card}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,flexWrap:"wrap",gap:8}}>
        <span style={S.secTitle}>تقييمات: {selDomain} ({parts.length} موظف)</span>
        <div style={{fontSize:10,color:"#64748b"}}>الموضوعات: {(SUBTOPICS_DEFAULT[selDomain]||[]).join(" · ")}</div>
      </div>
      {parts.length===0?<Empty icon="⭐" text="لا يوجد موظفون في هذا البرنامج"/>:
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            {["الموظف","الإدارة","الحضور","التقييم (1-5)","ملاحظات","شهادة","طباعة"].map(h=><th key={h} style={S.th}>{h}</th>)}
          </tr></thead>
          <tbody>{parts.map((e,i)=>{
            const av=attendance.find(a=>a.employee_id===e.id&&a.domain===selDomain);
            const ev=evaluations.find(v=>v.employee_id===e.id&&v.domain===selDomain);
            const cert=certs.find(c=>c.employee_id===e.id&&c.domain===selDomain);
            const canCert=role==="admin"&&(ev?.score||0)>=3&&av?.status==="حاضر";
            return <tr key={e.id} style={{background:i%2===0?"#070d1a":"#0d1829"}}>
              <td style={S.td}>
                <div style={{fontWeight:700}}>{e.name}</div>
                <div style={{fontSize:9,color:"#64748b"}}>{e.dept}</div>
                {e.phone&&<div style={{fontSize:9,color:"#22c55e"}}>📞 {e.phone}</div>}
              </td>
              <td style={S.td}><span style={{color:"#93c5fd",fontSize:11}}>{e.dept}</span></td>
              <td style={S.td}>
                <span style={{color:av?.status==="حاضر"?"#22c55e":av?.status==="معذور"?"#f59e0b":"#ef4444",fontWeight:700}}>
                  {av?.status||"غائب"}
                </span>
              </td>
              <td style={S.td}>
                <div style={{display:"flex",gap:3}}>
                  {[1,2,3,4,5].map(n=>(
                    <button key={n} onClick={()=>setScore(e.id,n)}
                      style={{width:27,height:27,borderRadius:6,border:"none",cursor:"pointer",fontWeight:700,fontSize:11,
                        background:(ev?.score||0)>=n?"#C8973A":"#1e3558",
                        color:(ev?.score||0)>=n?"#fff":"#64748b",
                        opacity:saving[e.id+"_s"]?0.5:1,transition:"all .15s"}}
                      disabled={!!saving[e.id+"_s"]}>{n}</button>
                  ))}
                </div>
              </td>
              <td style={S.td}>
                <input style={{...S.input,padding:"3px 8px",fontSize:10,width:130}}
                  defaultValue={ev?.note||""}
                  onBlur={el=>setNote(e.id,el.target.value)}
                  placeholder="ملاحظة..."/>
              </td>
              <td style={S.td}>
                {cert
                  ?<span style={{...S.badge("#052e16","#86efac"),fontSize:10}}>✅ صدرت</span>
                  :canCert
                    ?<button style={S.btn("#217346","#fff","4px 9px")}
                        onClick={()=>issueCert(e.id)} disabled={!!saving[e.id+"_c"]}>
                        {saving[e.id+"_c"]?"...":"إصدار"}
                      </button>
                    :<span style={{color:"#475569",fontSize:10}}>—</span>}
              </td>
              <td style={S.td}>
                {cert
                  ?<button style={S.btn("#1B3A6B","#fff","4px 9px")} onClick={()=>printCert(e.id)}>🖨️ طباعة</button>
                  :<span style={{color:"#475569",fontSize:10}}>—</span>}
              </td>
            </tr>;
          })}</tbody>
        </table>
      </div>}
    </div>
  </div>;
}

// ═══════════════════════════════════════════
// CERTIFICATES PAGE
// ═══════════════════════════════════════════
function CertificatesPage({employees,certs,onRefresh}){
  const [search,setSearch]=useState("");
  const [domFilter,setDomFilter]=useState("الكل");

  const filtered=certs.filter(c=>{
    const emp=employees.find(e=>e.id===c.employee_id);
    if(!emp) return false;
    if(domFilter!=="الكل"&&c.domain!==domFilter) return false;
    if(search&&!emp.name.includes(search)&&!c.domain.includes(search)&&!(emp.dept||"").includes(search)) return false;
    return true;
  });

  const printCert=(cert)=>{
    const emp=employees.find(e=>e.id===cert.employee_id);
    if(!emp) return;
    const w=window.open("","_blank");
    w.document.write(generateCertHTML(cert,emp.name,emp.dept));
    w.document.close();
    setTimeout(()=>w.print(),600);
  };

  const exportAll=()=>{
    const rows=[
      ["رقم الشهادة","اسم الموظف","الإدارة","المجال","تاريخ الإصدار"],
      ...filtered.map(c=>{
        const emp=employees.find(e=>e.id===c.employee_id);
        return [c.cert_number||"",emp?.name||"",emp?.dept||"",c.domain,new Date(c.issued_at).toLocaleDateString("ar-SY")];
      })
    ];
    const blob=new Blob(["\uFEFF"+rows.map(r=>r.join(",")).join("\n")],{type:"text/csv;charset=utf-8"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="الشهادات_الكل.csv";a.click();
  };

  const byDomain=DOMAINS.map(d=>({d,cnt:certs.filter(c=>c.domain===d).length})).filter(x=>x.cnt>0);

  return <div>
    {/* Stats */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10,marginBottom:16}}>
      <KPI v={certs.length} l="إجمالي الشهادات" c="#C8973A" i="🏆"/>
      <KPI v={new Set(certs.map(c=>c.employee_id)).size} l="موظف حاصل" c="#22c55e" i="👥"/>
      <KPI v={new Set(certs.map(c=>c.domain)).size} l="مجال مشمول" c="#3b82f6" i="📚"/>
      <KPI v={filtered.length} l="النتائج الحالية" c="#a78bfa" i="🔍"/>
    </div>

    {/* Controls */}
    <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
      <input style={{...S.input,maxWidth:210}} placeholder="🔍 اسم / إدارة / مجال..." value={search} onChange={e=>setSearch(e.target.value)}/>
      <select style={S.select} value={domFilter} onChange={e=>setDomFilter(e.target.value)}>
        <option>الكل</option>
        {DOMAINS.map(d=><option key={d}>{d}</option>)}
      </select>
      <span style={{color:"#64748b",fontSize:12,marginRight:"auto"}}>{filtered.length} شهادة</span>
      <button style={S.btn("#217346","#fff","8px 14px")} onClick={exportAll}>📥 تصدير الكل</button>
    </div>

    {/* Domain summary */}
    {byDomain.length>0&&<div style={{...S.card,marginBottom:14}}>
      <span style={S.secTitle}>توزيع الشهادات حسب المجال</span>
      <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
        {byDomain.map(x=>(
          <div key={x.d} onClick={()=>setDomFilter(domFilter===x.d?"الكل":x.d)}
            style={{background:domFilter===x.d?"#1e3558":"#070d1a",borderRadius:8,padding:"7px 13px",
              border:"1px solid "+(DC[x.d]||"#C8973A")+(domFilter===x.d?"":"33"),cursor:"pointer",
              display:"flex",gap:8,alignItems:"center",transition:"all .15s"}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:DC[x.d]||"#C8973A"}}/>
            <span style={{fontSize:11,fontWeight:700}}>{x.d}</span>
            <span style={{...S.badge("#1a1000","#C8973A"),fontSize:10}}>{x.cnt}</span>
          </div>
        ))}
      </div>
    </div>}

    {/* Cert cards */}
    {filtered.length===0?<Empty icon="🏆" text="لا توجد شهادات"/>:
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:12}}>
      {filtered.map(cert=>{
        const emp=employees.find(e=>e.id===cert.employee_id);
        return <div key={cert.id}
          style={{background:"linear-gradient(135deg,#1a1000,#0d1829)",borderRadius:14,
            border:"1px solid #C8973A88",padding:18,
            boxShadow:"0 4px 20px rgba(200,151,58,.12)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
            <div>
              <div style={{fontSize:10,color:"#C8973A",fontWeight:700,marginBottom:3}}>شهادة إتمام تدريب</div>
              <div style={{fontWeight:900,fontSize:13,color:DC[cert.domain]||"#C8973A"}}>{cert.domain}</div>
              <div style={{fontWeight:700,marginTop:5,color:"#e2e8f0"}}>{emp?.name}</div>
              <div style={{fontSize:10,color:"#64748b"}}>{emp?.dept}</div>
              {emp?.phone&&<div style={{fontSize:10,color:"#22c55e",marginTop:3}}>📞 {emp.phone}</div>}
            </div>
            <div style={{fontSize:34,filter:"drop-shadow(0 0 8px #C8973A44)"}}>📜</div>
          </div>
          <div style={{borderTop:"1px solid #C8973A44",paddingTop:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:9,color:"#475569"}}>{cert.cert_number||"—"}</div>
              <div style={{fontSize:10,color:"#94a3b8"}}>{new Date(cert.issued_at).toLocaleDateString("ar-SY")}</div>
            </div>
            <button style={S.btn("#1B3A6B","#fff","7px 14px")} onClick={()=>printCert(cert)}>🖨️ طباعة / PDF</button>
          </div>
        </div>;
      })}
    </div>}
  </div>;
}
// ═══════════════════════════════════════════
// ANALYTICS PAGE
// ═══════════════════════════════════════════
function AnalyticsPage({employees,attendance,certs,rate,setRate}){
  const [dept,setDept]=useState("الكل");
  const [compare,setCompare]=useState(false);
  const [search,setSearch]=useState("");

  const depts=["الكل",...Array.from(new Set(employees.map(e=>e.dept))).sort()];
  const emps=employees.filter(e=>(dept==="الكل"||e.dept===dept)&&(!search||e.name.includes(search)||e.dept.includes(search)));

  const stats=es=>{
    const n=es.length;
    const h=es.filter(e=>e.priority==="عالٍ").length;
    const m=es.filter(e=>e.priority==="متوسط").length;
    const l=es.filter(e=>e.priority==="منخفض").length;
    const ag=n?(es.reduce((s,e)=>s+(e.gap||0),0)/n):0;
    const needs=es.reduce((s,e)=>s+DOMAINS.filter(d=>e.needs?.[d]&&e.needs[d]!=="-").length,0);
    const budget=DOMAINS.reduce((s,d)=>s+es.filter(e=>e.needs?.[d]&&e.needs[d]!=="-").length*(PROGRAMS[d]?.days||0)*rate,0);
    const att=attendance.filter(a=>es.find(e=>e.id===a.employee_id)&&a.status==="حاضر").length;
    const cert=certs.filter(c=>es.find(e=>e.id===c.employee_id)).length;
    return{n,h,m,l,ag,needs,budget,att,cert};
  };

  const st=stats(emps);
  const allDepts=Array.from(new Set(employees.map(e=>e.dept))).sort();
  const deptCmp=allDepts.map(d=>{const es=employees.filter(e=>e.dept===d);return{dept:d,...stats(es)};}).sort((a,b)=>b.ag-a.ag);
  const domData=DOMAINS.map(d=>({
    l:d.substring(0,5),full:d,
    v:emps.filter(e=>e.needs?.[d]&&e.needs[d]!=="-").length,
    high:emps.filter(e=>e.needs?.[d]==="عالٍ").length,
    c:DC[d]||"#C8973A"
  })).sort((a,b)=>b.v-a.v);

  const exportCSV=()=>{
    const rows=[
      ["الاسم","الإدارة","المسمى","الهاتف","الإيميل","الفجوة","الأولوية","الميزانية",...DOMAINS],
      ...emps.map(e=>[
        e.name,e.dept,e.title||"",e.phone||"",e.email||"",
        (e.gap||0).toFixed(2),e.priority,
        DOMAINS.reduce((s,d)=>s+(e.needs?.[d]&&e.needs[d]!=="-"?(PROGRAMS[d]?.days||0)*rate:0),0),
        ...DOMAINS.map(d=>e.needs?.[d]||"-")
      ])
    ];
    const blob=new Blob(["\uFEFF"+rows.map(r=>r.join(",")).join("\n")],{type:"text/csv;charset=utf-8"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="تحليل_"+dept+".csv";a.click();
  };

  const exportHTML=()=>{
    const html=`<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><title>تقرير ${dept}</title>
<style>body{font-family:Arial;padding:30px;color:#1e293b;background:#f8fafc}h1{color:#1B3A6B;border-bottom:3px solid #C8973A;padding-bottom:8px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:12px}th{background:#1B3A6B;color:#fff;padding:8px;text-align:right}
td{padding:7px;border-bottom:1px solid #e2e8f0}tr:nth-child(even){background:#f1f5f9}
.kpi{display:inline-block;margin:6px;padding:12px 20px;border-radius:8px;border:2px solid #e2e8f0;text-align:center;min-width:110px}
.kv{font-size:24px;font-weight:900;color:#1B3A6B}.kl{font-size:11px;color:#64748b}</style></head><body>
<h1>🏛 تقرير تحليلي — ${dept}</h1>
<p style="color:#64748b">التاريخ: ${new Date().toLocaleDateString("ar-SY")} · الموظفون: ${st.n}</p>
<div>
  <div class="kpi"><div class="kv">${st.n}</div><div class="kl">موظف</div></div>
  <div class="kpi"><div class="kv">${st.ag.toFixed(2)}</div><div class="kl">متوسط الفجوة</div></div>
  <div class="kpi"><div class="kv">${st.h}</div><div class="kl">أولوية عالية</div></div>
  <div class="kpi"><div class="kv">$${st.budget.toLocaleString()}</div><div class="kl">الميزانية</div></div>
</div>
<h2>قائمة الموظفين</h2>
<table><tr><th>#</th><th>الاسم</th><th>الإدارة</th><th>الهاتف</th><th>الإيميل</th><th>الفجوة</th><th>الأولوية</th><th>المجالات</th><th>الميزانية</th></tr>
${emps.map((e,i)=>`<tr><td>${i+1}</td><td>${e.name}</td><td>${e.dept}</td><td>${e.phone||"—"}</td><td>${e.email||"—"}</td>
<td>${(e.gap||0).toFixed(2)}</td><td>${e.priority}</td>
<td>${DOMAINS.filter(d=>e.needs?.[d]&&e.needs[d]!=="-").length}</td>
<td>$${DOMAINS.reduce((s,d)=>s+(e.needs?.[d]&&e.needs[d]!=="-"?(PROGRAMS[d]?.days||0)*rate:0),0).toLocaleString()}</td></tr>`).join("")}
</table></body></html>`;
    const blob=new Blob([html],{type:"text/html;charset=utf-8"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="تقرير_"+dept+".html";a.click();
  };

  return <div>
    {/* Controls */}
    <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
      <input style={{...S.input,maxWidth:190}} placeholder="🔍 ابحث..." value={search} onChange={e=>setSearch(e.target.value)}/>
      <select style={{...S.select,minWidth:175}} value={dept} onChange={e=>setDept(e.target.value)}>
        {depts.map(d=><option key={d}>{d}</option>)}
      </select>
      <button style={S.btn(compare?"#C8973A":"#1e3558",compare?"#fff":"#94a3b8","7px 13px")}
        onClick={()=>setCompare(!compare)}>
        {compare?"📊 تفاصيل":"⚖️ مقارنة الإدارات"}
      </button>
      <div style={{marginRight:"auto",display:"flex",gap:8,alignItems:"center"}}>
        <span style={{fontSize:11,color:"#64748b"}}>$ معدل/يوم</span>
        <input type="number" min={5} max={500} value={rate}
          onChange={e=>setRate(Math.max(1,+e.target.value))}
          style={{...S.input,width:68,padding:"5px 8px",fontSize:12}}/>
        <button style={S.btn("#217346","#fff","7px 13px")} onClick={exportCSV}>📥 Excel</button>
        <button style={S.btn("#1B3A6B","#fff","7px 13px")} onClick={exportHTML}>📄 تقرير</button>
      </div>
    </div>

    {!compare?<div>
      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(112px,1fr))",gap:10,marginBottom:14}}>
        <KPI v={st.n} l="موظفون" c="#3b82f6" i="👥"/>
        <KPI v={st.ag.toFixed(2)} l="متوسط الفجوة" c={gc(st.ag)} i="📊"/>
        <KPI v={st.h} l="أولوية عالية" c="#ef4444" i="🔴" sub={(st.n>0?(st.h/st.n*100).toFixed(0):0)+"%"}/>
        <KPI v={st.m} l="أولوية متوسطة" c="#f59e0b" i="🟡"/>
        <KPI v={st.needs} l="الاحتياجات" c="#a78bfa" i="🎯"/>
        <KPI v={"$"+(st.budget/1000).toFixed(1)+"k"} l="الميزانية" c="#C8973A" i="💰"/>
        <KPI v={st.att} l="حضر تدريباً" c="#22c55e" i="✅"/>
        <KPI v={st.cert} l="شهادات" c="#f472b6" i="🏆"/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:12,marginBottom:12}}>
        <div style={S.card}>
          <span style={S.secTitle}>الاحتياجات حسب المجال</span>
          <BarChart data={domData} height={110}/>
          <div style={{marginTop:10,display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
            {domData.filter(d=>d.v>0).slice(0,8).map(d=>(
              <div key={d.full} style={{display:"flex",justifyContent:"space-between",background:"#070d1a",
                borderRadius:6,padding:"5px 9px",fontSize:11,border:"1px solid "+d.c+"22"}}>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:d.c,flexShrink:0}}/>
                  <span style={{fontWeight:600}}>{d.full}</span>
                </div>
                <div style={{display:"flex",gap:5}}>
                  <span style={{color:"#3b82f6",fontWeight:700}}>{d.v}</span>
                  {d.high>0&&<span style={{color:"#ef4444"}}>🔴{d.high}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={S.card}>
          <span style={S.secTitle}>توزيع الأولويات</span>
          <div style={{display:"flex",justifyContent:"center",marginBottom:10}}>
            <Donut segs={[{v:st.h,c:"#ef4444"},{v:st.m,c:"#f59e0b"},{v:st.l,c:"#22c55e"}]}/>
          </div>
          {[["عالٍ",st.h,"#ef4444"],["متوسط",st.m,"#f59e0b"],["منخفض",st.l,"#22c55e"]].map(([l,v,c])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #1e293b",fontSize:12}}>
              <span style={{color:c,fontWeight:700}}>● {l}</span>
              <span style={{color:"#94a3b8"}}>{v} ({st.n>0?(v/st.n*100).toFixed(0):0}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Employees table */}
      <div style={S.card}>
        <span style={S.secTitle}>قائمة الموظفين ({emps.length})</span>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>
              {["#","الاسم","الإدارة","الهاتف","الإيميل","الفجوة","الأولوية","المجالات","الميزانية"].map(h=><th key={h} style={S.th}>{h}</th>)}
            </tr></thead>
            <tbody>{emps.map((e,i)=>{
              const n=DOMAINS.filter(d=>e.needs?.[d]&&e.needs[d]!=="-").length;
              const b=DOMAINS.reduce((s,d)=>s+(e.needs?.[d]&&e.needs[d]!=="-"?(PROGRAMS[d]?.days||0)*rate:0),0);
              const{bg,fg}=pc(e.priority);
              return <tr key={e.id} style={{background:i%2===0?"#070d1a":"#0d1829"}}>
                <td style={S.td}><span style={{color:"#475569"}}>{i+1}</span></td>
                <td style={S.td}><div style={{fontWeight:700}}>{e.name}</div></td>
                <td style={S.td}><span style={{color:"#93c5fd"}}>{e.dept}</span></td>
                <td style={S.td}>{e.phone?<a href={"tel:"+e.phone} style={{color:"#22c55e",textDecoration:"none",fontSize:11}}>{e.phone}</a>:"—"}</td>
                <td style={S.td}>{e.email?<a href={"mailto:"+e.email} style={{color:"#3b82f6",textDecoration:"none",fontSize:11}}>{e.email}</a>:"—"}</td>
                <td style={S.td}><span style={{fontWeight:900,color:gc(e.gap||0)}}>{(e.gap||0).toFixed(2)}</span></td>
                <td style={S.td}><span style={S.badge(bg,fg)}>{e.priority}</span></td>
                <td style={S.td}><span style={{fontWeight:700,color:"#3b82f6"}}>{n}</span></td>
                <td style={S.td}><span style={{fontWeight:700,color:"#22c55e"}}>${b.toLocaleString()}</span></td>
              </tr>;
            })}</tbody>
          </table>
        </div>
      </div>
    </div>:

    /* COMPARE MODE */
    <div>
      <div style={S.card}>
        <span style={S.secTitle}>مقارنة جميع الإدارات — اضغط على أي إدارة للتفاصيل</span>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>
              {["الإدارة","موظفون","متوسط الفجوة","عالٍ","متوسط","منخفض","الاحتياجات","الميزانية","شهادات"].map(h=><th key={h} style={S.th}>{h}</th>)}
            </tr></thead>
            <tbody>{deptCmp.map((d,i)=>(
              <tr key={d.dept} style={{background:i%2===0?"#070d1a":"#0d1829",cursor:"pointer"}}
                onClick={()=>{setDept(d.dept);setCompare(false);}}>
                <td style={S.td}><span style={{fontWeight:700,color:"#C8973A"}}>{d.dept}</span></td>
                <td style={S.td}><span style={{fontWeight:700,color:"#3b82f6"}}>{d.n}</span></td>
                <td style={S.td}><span style={{fontWeight:900,color:gc(d.ag)}}>{d.ag.toFixed(2)}</span></td>
                <td style={S.td}><span style={{color:"#ef4444",fontWeight:700}}>{d.h}</span></td>
                <td style={S.td}><span style={{color:"#f59e0b",fontWeight:700}}>{d.m}</span></td>
                <td style={S.td}><span style={{color:"#22c55e",fontWeight:700}}>{d.l}</span></td>
                <td style={S.td}><span style={{color:"#a78bfa"}}>{d.needs}</span></td>
                <td style={S.td}><span style={{fontWeight:700,color:"#22c55e"}}>${d.budget.toLocaleString()}</span></td>
                <td style={S.td}><span style={{color:"#f472b6"}}>{d.cert}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:12}}>
        <div style={S.card}>
          <span style={S.secTitle}>متوسط الفجوة</span>
          <BarChart data={deptCmp.map(d=>({l:d.dept.substring(0,5),v:parseFloat(d.ag.toFixed(2)),c:gc(d.ag)}))} height={110}/>
        </div>
        <div style={S.card}>
          <span style={S.secTitle}>الميزانية (ألف $)</span>
          <BarChart data={deptCmp.map(d=>({l:d.dept.substring(0,5),v:Math.round(d.budget/1000),c:"#C8973A"}))} height={110}/>
        </div>
      </div>
    </div>}
  </div>;
}

// ═══════════════════════════════════════════
// EMPLOYEES PAGE
// ═══════════════════════════════════════════
function EmployeesPage({employees,user,role,onRefresh,showToast}){
  const [search,setSearch]=useState("");
  const [deptF,setDeptF]=useState("الكل");
  const [modal,setModal]=useState(null);
  const [mode,setMode]=useState("view");
  const [delConfirm,setDelConfirm]=useState(null);
  const [saving,setSaving]=useState(false);

  const depts=["الكل",...Array.from(new Set(employees.map(e=>e.dept))).sort()];
  const filtered=employees.filter(e=>
    (deptF==="الكل"||e.dept===deptF)&&
    (!search||e.name.includes(search)||e.dept.includes(search)||
     (e.phone||"").includes(search)||(e.email||"").includes(search))
  );

  const saveEmp=async(emp)=>{
    setSaving(true);
    if(emp.id){
      await supabase.from("employees").update(emp).eq("id",emp.id);
      await auditLog(user.id,user.email,"تعديل موظف","employees",emp.id,null,{name:emp.name,dept:emp.dept});
      showToast("تم التعديل ✅");
    } else {
      const{data}=await supabase.from("employees").insert(emp).select().single();
      await auditLog(user.id,user.email,"إضافة موظف","employees",data?.id,null,{name:emp.name,dept:emp.dept});
      showToast("تمت الإضافة ✅");
    }
    setSaving(false);setModal(null);onRefresh();
  };

  const delEmp=async(id)=>{
    await supabase.from("employees").delete().eq("id",id);
    await auditLog(user.id,user.email,"حذف موظف","employees",id,null,null);
    setDelConfirm(null);showToast("تم الحذف","error");onRefresh();
  };

  return <div>
    <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
      <input style={{...S.input,maxWidth:220}} placeholder="🔍 اسم / إدارة / هاتف / إيميل..." value={search} onChange={e=>setSearch(e.target.value)}/>
      <select style={S.select} value={deptF} onChange={e=>setDeptF(e.target.value)}>
        {depts.map(d=><option key={d}>{d}</option>)}
      </select>
      <span style={{color:"#64748b",fontSize:12,marginRight:"auto"}}>{filtered.length} موظف</span>
      <button style={S.btn("#217346")} onClick={()=>{
        setModal({name:"",title:"موظف",dept:DEPT_LIST[0],city:"دمشق",gap:0,priority:"منخفض",phone:"",email:"",needs:Object.fromEntries(DOMAINS.map(d=>[d,"-"]))});
        setMode("new");
      }}>+ إضافة موظف</button>
    </div>

    <div style={{overflowX:"auto",borderRadius:12,border:"1px solid #1e3558"}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr>
          {["#","الاسم","الإدارة","المسمى","الهاتف","الإيميل","الفجوة","الأولوية","مجالات",""].map(h=><th key={h} style={S.th}>{h}</th>)}
        </tr></thead>
        <tbody>{filtered.map((e,i)=>{
          const n=DOMAINS.filter(d=>e.needs?.[d]&&e.needs[d]!=="-").length;
          const{bg,fg}=pc(e.priority);
          return <tr key={e.id} style={{background:i%2===0?"#070d1a":"#0d1829"}}>
            <td style={S.td}><span style={{color:"#475569"}}>{i+1}</span></td>
            <td style={S.td}><div style={{fontWeight:700}}>{e.name}</div></td>
            <td style={S.td}><span style={{color:"#93c5fd"}}>{e.dept}</span></td>
            <td style={S.td}><span style={{color:"#94a3b8"}}>{e.title}</span></td>
            <td style={S.td}>{e.phone?<a href={"tel:"+e.phone} style={{color:"#22c55e",textDecoration:"none"}}>{e.phone}</a>:"—"}</td>
            <td style={S.td}>{e.email?<a href={"mailto:"+e.email} style={{color:"#3b82f6",textDecoration:"none",fontSize:11}}>{e.email}</a>:"—"}</td>
            <td style={S.td}><span style={{fontWeight:900,color:gc(e.gap||0)}}>{(e.gap||0).toFixed(2)}</span></td>
            <td style={S.td}><span style={S.badge(bg,fg)}>{e.priority}</span></td>
            <td style={S.td}><span style={{fontWeight:700,color:"#3b82f6"}}>{n}</span></td>
            <td style={S.td}>
              <div style={{display:"flex",gap:4}}>
                <button style={S.btn("#1e3558","#93c5fd","4px 8px")} onClick={()=>{setModal(e);setMode("view");}}>عرض</button>
                <button style={S.btn("#C8973A","#fff","4px 8px")} onClick={()=>{setModal({...e});setMode("edit");}}>تعديل</button>
                {role==="admin"&&<button style={S.btn("#7f1d1d","#fca5a5","4px 8px")} onClick={()=>setDelConfirm(e.id)}>حذف</button>}
              </div>
            </td>
          </tr>;
        })}</tbody>
      </table>
    </div>

    {modal&&<div style={S.modal} onClick={()=>setModal(null)}>
      <div style={S.modalBox} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"12px 16px",borderBottom:"1px solid #1e3558",fontWeight:900,
          display:"flex",justifyContent:"space-between",position:"sticky",top:0,
          background:"#0d1829",borderRadius:"14px 14px 0 0",zIndex:1}}>
          {mode==="new"?"➕ إضافة موظف جديد":mode==="edit"?"✏️ تعديل: "+modal.name:"👤 "+modal.name}
          <button style={S.btn("#1e3558","#94a3b8","3px 8px")} onClick={()=>setModal(null)}>✕</button>
        </div>
        <div style={{padding:16}}>
          {mode==="view"?<EmpView emp={modal}/>:<EmpForm emp={modal} onChange={setModal} onSave={saveEmp} onCancel={()=>setModal(null)} saving={saving}/>}
        </div>
      </div>
    </div>}

    {delConfirm&&<div style={S.modal} onClick={()=>setDelConfirm(null)}>
      <div style={{...S.modalBox,maxWidth:300,textAlign:"center",padding:32}} onClick={e=>e.stopPropagation()}>
        <div style={{fontSize:36,marginBottom:8}}>⚠️</div>
        <div style={{fontWeight:800,fontSize:14,marginBottom:6}}>حذف الموظف نهائياً؟</div>
        <div style={{color:"#64748b",fontSize:12,marginBottom:20}}>لا يمكن التراجع عن هذا الإجراء</div>
        <div style={{display:"flex",gap:8,justifyContent:"center"}}>
          <button style={S.btn("#1e3558","#94a3b8")} onClick={()=>setDelConfirm(null)}>إلغاء</button>
          <button style={S.btn("#7f1d1d","#fca5a5")} onClick={()=>delEmp(delConfirm)}>حذف</button>
        </div>
      </div>
    </div>}
  </div>;
}

function EmpView({emp}){
  const needs=DOMAINS.filter(d=>emp.needs?.[d]&&emp.needs[d]!=="-");
  return <div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
      {[["الإدارة",emp.dept],["المسمى",emp.title||"—"],["المدينة",emp.city||"—"],["الأولوية",emp.priority],
        ["الهاتف",emp.phone||"—"],["الإيميل",emp.email||"—"]].map(([l,v])=>(
        <div key={l} style={{background:"#070d1a",borderRadius:8,padding:"8px 11px",border:"1px solid #1e3558"}}>
          <div style={{fontSize:9,color:"#64748b",marginBottom:2}}>{l}</div>
          <div style={{fontWeight:700,fontSize:12}}>{v}</div>
        </div>
      ))}
    </div>
    <span style={S.secTitle}>الاحتياجات التدريبية ({needs.length})</span>
    {needs.map(d=>{
      const{bg,fg}=pc(emp.needs[d]);
      return <div key={d} style={{marginBottom:6}}>
        <div style={{display:"flex",justifyContent:"space-between",padding:"6px 10px",borderRadius:7,
          background:"#070d1a",fontSize:11,border:"1px solid "+(DC[d]||"#1e3558")+"33"}}>
          <div style={{display:"flex",alignItems:"center",gap:5}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:DC[d]||"#C8973A"}}/>
            {d}
          </div>
          <span style={S.badge(bg,fg)}>{emp.needs[d]}</span>
        </div>
        <div style={{display:"flex",gap:4,padding:"3px 10px",flexWrap:"wrap"}}>
          {(SUBTOPICS_DEFAULT[d]||[]).map(t=>(
            <span key={t} style={{fontSize:9,color:"#64748b",background:"#1e3558",borderRadius:8,padding:"1px 7px"}}>{t}</span>
          ))}
        </div>
      </div>;
    })}
  </div>;
}

function EmpForm({emp,onChange,onSave,onCancel,saving,lockDept}){
  const upd=(k,v)=>onChange(e=>({...e,[k]:v}));
  return <div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
      <div><div style={{fontSize:11,color:"#94a3b8",marginBottom:3}}>الاسم الكامل</div>
        <input style={S.input} value={emp.name||""} onChange={e=>upd("name",e.target.value)}/></div>
      <div><div style={{fontSize:11,color:"#94a3b8",marginBottom:3}}>الإدارة</div>
        {lockDept?<input style={{...S.input,opacity:.6}} value={lockDept} readOnly/>:
        <select style={S.select} value={emp.dept||""} onChange={e=>upd("dept",e.target.value)}>
          {DEPT_LIST.map(d=><option key={d}>{d}</option>)}
        </select>}
      </div>
      <div><div style={{fontSize:11,color:"#94a3b8",marginBottom:3}}>المدينة</div>
        <input style={S.input} value={emp.city||""} onChange={e=>upd("city",e.target.value)}/></div>
      <div><div style={{fontSize:11,color:"#94a3b8",marginBottom:3}}>المسمى الوظيفي</div>
        <select style={S.select} value={emp.title||"موظف"} onChange={e=>upd("title",e.target.value)}>
          <option>موظف</option><option>رئيس قسم</option><option>مدير</option>
        </select>
      </div>
      <div><div style={{fontSize:11,color:"#94a3b8",marginBottom:3}}>الهاتف</div>
        <input style={{...S.input,direction:"ltr",textAlign:"left"}} value={emp.phone||""} onChange={e=>upd("phone",e.target.value)} placeholder="+963..."/></div>
      <div><div style={{fontSize:11,color:"#94a3b8",marginBottom:3}}>الإيميل</div>
        <input style={{...S.input,direction:"ltr",textAlign:"left"}} type="email" value={emp.email||""} onChange={e=>upd("email",e.target.value)} placeholder="name@ssf.gov.sy"/></div>
      <div><div style={{fontSize:11,color:"#94a3b8",marginBottom:3}}>الفجوة التدريبية (0 – 2)</div>
        <input style={S.input} type="number" min={0} max={2} step={0.1} value={emp.gap||0}
          onChange={e=>{const g=+e.target.value;upd("gap",g);upd("priority",g>=1.5?"عالٍ":g>=0.75?"متوسط":"منخفض");}}/></div>
      <div><div style={{fontSize:11,color:"#94a3b8",marginBottom:3}}>الأولوية (تلقائية)</div>
        <input style={{...S.input,color:gc(emp.gap||0),fontWeight:700}} value={emp.priority||"منخفض"} readOnly/></div>
    </div>
    <div style={{fontSize:11,fontWeight:700,color:"#C8973A",marginBottom:8}}>الاحتياجات التدريبية</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,marginBottom:14}}>
      {DOMAINS.map(d=>(
        <div key={d} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
          background:"#070d1a",borderRadius:7,padding:"5px 9px",border:"1px solid "+(DC[d]||"#1e3558")+"22"}}>
          <div style={{display:"flex",alignItems:"center",gap:5}}>
            <div style={{width:5,height:5,borderRadius:"50%",background:DC[d]||"#C8973A",flexShrink:0}}/>
            <span style={{fontSize:11}}>{d}</span>
          </div>
          <select style={{...S.select,fontSize:10,padding:"2px 5px",width:80}}
            value={emp.needs?.[d]||"-"} onChange={e=>upd("needs",{...emp.needs,[d]:e.target.value})}>
            <option>-</option><option>منخفض</option><option>متوسط</option><option>عالٍ</option>
          </select>
        </div>
      ))}
    </div>
    <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
      <button style={S.btn("#1e3558","#94a3b8")} onClick={onCancel}>إلغاء</button>
      <button style={{...S.btn("#217346"),opacity:saving?0.6:1}} disabled={saving} onClick={()=>onSave(emp)}>
        {saving?"جاري الحفظ...":"💾 حفظ"}
      </button>
    </div>
  </div>;
}

// ═══════════════════════════════════════════
// AUDIT PAGE
// ═══════════════════════════════════════════
function AuditPage({auditLog}){
  const [filter,setFilter]=useState("الكل");
  const types=["الكل","موظف","حضور","شهادة","برنامج","دخول"];
  const filtered=filter==="الكل"?auditLog:auditLog.filter(l=>(l.action||"").includes(filter==="موظف"?"موظف":filter==="حضور"?"حضور":filter==="شهادة"?"شهادة":filter==="برنامج"?"برنامج":"دخول"));
  const ac=a=>a?.includes("حذف")?"#ef4444":a?.includes("إضافة")?"#22c55e":a?.includes("شهادة")?"#f472b6":a?.includes("حضور")?"#3b82f6":"#C8973A";

  return <div>
    <div style={{...S.card,marginBottom:12,display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
      <span style={{...S.secTitle,marginBottom:0}}>سجل التغييرات الكامل ({filtered.length})</span>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginRight:"auto"}}>
        {types.map(t=>(
          <button key={t} style={S.btn(filter===t?"#C8973A":"#1e3558",filter===t?"#fff":"#94a3b8","5px 11px")}
            onClick={()=>setFilter(t)}>{t}</button>
        ))}
      </div>
    </div>
    {filtered.length===0?<Empty icon="📋" text="لا توجد سجلات"/>:
    <div style={{overflowX:"auto",borderRadius:12,border:"1px solid #1e3558"}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr>
          {["التاريخ","الوقت","المستخدم","العملية","الجدول","التفاصيل"].map(h=><th key={h} style={S.th}>{h}</th>)}
        </tr></thead>
        <tbody>{filtered.map((l,i)=>(
          <tr key={l.id||i} style={{background:i%2===0?"#070d1a":"#0d1829"}}>
            <td style={S.td}><span style={{fontSize:10,color:"#64748b"}}>{new Date(l.created_at).toLocaleDateString("ar-SY")}</span></td>
            <td style={S.td}><span style={{fontSize:10,color:"#475569"}}>{new Date(l.created_at).toLocaleTimeString("ar-SY")}</span></td>
            <td style={S.td}><span style={{fontSize:11,color:"#93c5fd"}}>{l.user_email}</span></td>
            <td style={S.td}><span style={{color:ac(l.action),fontWeight:700,fontSize:12}}>{l.action}</span></td>
            <td style={S.td}><span style={{color:"#475569",fontSize:11}}>{l.table_name}</span></td>
            <td style={S.td}><span style={{fontSize:10,color:"#64748b",fontFamily:"monospace"}}>
              {l.new_data?JSON.stringify(l.new_data).substring(0,70)+"...":"—"}
            </span></td>
          </tr>
        ))}</tbody>
      </table>
    </div>}
  </div>;
}

// ═══════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════
function Dashboard({employees,programs,attendance,evaluations,certs,onNav}){
  const h=employees.filter(e=>e.priority==="عالٍ").length;
  const m=employees.filter(e=>e.priority==="متوسط").length;
  const l=employees.filter(e=>e.priority==="منخفض").length;
  const ag=employees.length?(employees.reduce((s,e)=>s+(e.gap||0),0)/employees.length).toFixed(2):0;
  const budget=DOMAINS.reduce((s,d)=>s+employees.filter(e=>e.needs?.[d]&&e.needs[d]!=="-").length*(PROGRAMS[d]?.days||0)*35,0);
  const done=Object.values(programs).filter(p=>p.status==="منجز").length;
  const inProgress=Object.values(programs).filter(p=>p.status==="جارٍ").length;
  const topDoms=[...DOMAINS].sort((a,b)=>employees.filter(e=>e.needs?.[b]&&e.needs[b]!=="-").length-employees.filter(e=>e.needs?.[a]&&e.needs[a]!=="-").length);

  return <div>
    {/* KPIs */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:11,marginBottom:18}}>
      <KPI v={employees.length} l="إجمالي الموظفين" c="#3b82f6" i="👥" sub={h+" عالي الأولوية"} onClick={()=>onNav("employees")}/>
      <KPI v={ag} l="متوسط الفجوة" c={gc(parseFloat(ag))} i="📊" onClick={()=>onNav("analytics")}/>
      <KPI v={h} l="أولوية عالية" c="#ef4444" i="🔴" sub={(employees.length>0?(h/employees.length*100).toFixed(0):0)+"%"} onClick={()=>onNav("analytics")}/>
      <KPI v={12} l="برنامج تدريبي" c="#C8973A" i="📅" sub="أبريل 26 — مارس 27" onClick={()=>onNav("annual")}/>
      <KPI v={done+"/12"} l="برامج منجزة" c="#22c55e" i="✅" onClick={()=>onNav("tracking")}/>
      <KPI v={inProgress} l="جارٍ الآن" c="#f59e0b" i="⏳" onClick={()=>onNav("tracking")}/>
      <KPI v={"$"+(budget/1000).toFixed(0)+"k"} l="الميزانية الكلية" c="#C8973A" i="💰" onClick={()=>onNav("annual")}/>
      <KPI v={certs.length} l="شهادات صادرة" c="#f472b6" i="🏆" onClick={()=>onNav("certificates")}/>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14,marginBottom:14}}>
      <div style={S.card}>
        <span style={S.secTitle}>أعلى الاحتياجات — اضغط للتفاصيل</span>
        <BarChart data={topDoms.map(d=>({l:d.substring(0,5),v:employees.filter(e=>e.needs?.[d]&&e.needs[d]!=="-").length,c:DC[d]||"#C8973A"}))} height={110}/>
        <div style={{marginTop:10,display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:5}}>
          {topDoms.slice(0,6).map(d=>{
            const cnt=employees.filter(e=>e.needs?.[d]&&e.needs[d]!=="-").length;
            const high=employees.filter(e=>e.needs?.[d]==="عالٍ").length;
            return <div key={d} onClick={()=>onNav("subtopics")} style={{background:"#070d1a",borderRadius:7,padding:"6px 9px",cursor:"pointer",border:"1px solid "+(DC[d]||"#1e3558")+"33"}}>
              <div style={{fontSize:10,fontWeight:700,color:DC[d]||"#C8973A",marginBottom:2}}>{d}</div>
              <div style={{display:"flex",gap:5,fontSize:11}}>
                <span style={{color:"#3b82f6",fontWeight:700}}>{cnt}</span>
                {high>0&&<span style={{color:"#ef4444"}}>🔴{high}</span>}
              </div>
            </div>;
          })}
        </div>
      </div>
      <div>
        <div style={{...S.card,marginBottom:12}}>
          <span style={S.secTitle}>توزيع الأولويات</span>
          <div style={{display:"flex",justifyContent:"center",marginBottom:8}}>
            <Donut segs={[{v:h,c:"#ef4444"},{v:m,c:"#f59e0b"},{v:l,c:"#22c55e"}]}/>
          </div>
          {[["عالٍ",h,"#ef4444"],["متوسط",m,"#f59e0b"],["منخفض",l,"#22c55e"]].map(([label,val,c])=>(
            <div key={label} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #1e293b",fontSize:12}}>
              <span style={{color:c,fontWeight:700}}>● {label}</span>
              <span style={{color:"#94a3b8"}}>{val} ({employees.length>0?(val/employees.length*100).toFixed(0):0}%)</span>
            </div>
          ))}
        </div>
        <div style={{...S.card,background:"linear-gradient(135deg,#1a1000,#0d1829)",border:"1px solid #C8973A44"}}>
          <span style={{...S.secTitle,color:"#C8973A",borderColor:"#C8973A"}}>⏭ وصول سريع</span>
          {[["📊","التحليل الشامل","analytics"],["🎯","الموضوعات الفرعية","subtopics"],["📅","الخطة السنوية","annual"],["📋","متابعة التدريب","tracking"]].map(([icon,label,tab])=>(
            <div key={tab} onClick={()=>onNav(tab)} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:7,cursor:"pointer",marginBottom:4,background:"#070d1a",border:"1px solid #1e3558"}}>
              <span>{icon}</span><span style={{fontSize:12,fontWeight:600}}>{label}</span>
              <span style={{marginRight:"auto",color:"#475569",fontSize:12}}>←</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>;
}

// ═══════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════
export default function App(){
  const [user,setUser]=useState(null);
  const [role,setRole]=useState(null);
  const [loading,setLoading]=useState(true);
  const [tab,setTab]=useState("dashboard");
  const [employees,setEmployees]=useState([]);
  const [programs,setPrograms]=useState({});
  const [attendance,setAttendance]=useState([]);
  const [evaluations,setEvaluations]=useState([]);
  const [certs,setCerts]=useState([]);
  const [auditLogs,setAuditLogs]=useState([]);
  const [dataLoading,setDataLoading]=useState(false);
  const [toast,setToast]=useState(null);
  const [rate,setRate]=useState(35);

  const showToast=(msg,type="success")=>{
    setToast({msg,type});
    setTimeout(()=>setToast(null),3000);
  };

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      if(session?.user) loadRole(session.user);
      else setLoading(false);
    });
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>{
      if(session?.user) loadRole(session.user);
      else{setUser(null);setRole(null);setLoading(false);}
    });
    return()=>subscription.unsubscribe();
  },[]);

  const loadRole=async(u)=>{
    const{data:rd}=await supabase.from("user_roles").select("role").eq("user_id",u.id).single();
    setUser(u);setRole(rd?.role||"employee");
    setLoading(false);
  };

  const loadData=useCallback(async()=>{
    if(!user) return;
    setDataLoading(true);
    const[{data:e},{data:p},{data:a},{data:v},{data:c},{data:l}]=await Promise.all([
      supabase.from("employees").select("*").order("name"),
      supabase.from("training_programs").select("*"),
      supabase.from("attendance").select("*"),
      supabase.from("evaluations").select("*"),
      supabase.from("certificates").select("*"),
      role==="admin"
        ?supabase.from("audit_log").select("*").order("created_at",{ascending:false}).limit(200)
        :{data:[]},
    ]);
    setEmployees(e||[]);
    const pm={};(p||[]).forEach(x=>pm[x.domain]=x);setPrograms(pm);
    setAttendance(a||[]);setEvaluations(v||[]);setCerts(c||[]);setAuditLogs(l||[]);
    setDataLoading(false);
  },[user,role]);

  useEffect(()=>{if(user&&role)loadData();},[user,role]);

  const handleLogout=async()=>{
    await auditLog(user.id,user.email,"خروج","auth",user.id,null,{time:new Date().toISOString()});
    await supabase.auth.signOut();
    setUser(null);setRole(null);
  };

  if(loading) return <LoadingScreen/>;
  if(!user)   return <LoginScreen onLogin={loadRole}/>;

  const TABS=[
    {id:"dashboard",l:"لوحة التحكم",i:"⊞"},
    {id:"analytics",l:"التحليل الشامل",i:"📊"},
    {id:"subtopics",l:"الموضوعات الفرعية",i:"🎯"},
    {id:"annual",l:"الخطة السنوية",i:"📅"},
    {id:"employees",l:"الموظفون",i:"👤"},
    {id:"tracking",l:"متابعة التدريب",i:"📋"},
    {id:"evaluations",l:"التقييمات",i:"⭐"},
    {id:"certificates",l:"الشهادات",i:"🏆"},
    ...(role==="admin"?[{id:"audit",l:"سجل التغييرات",i:"📝"}]:[]),
  ];

  const totBudget=DOMAINS.reduce((s,d)=>s+employees.filter(e=>e.needs?.[d]&&e.needs[d]!=="-").length*(PROGRAMS[d]?.days||0)*rate,0);

  return <div style={S.app}>
    {toast&&<Toast {...toast}/>}

    {/* HEADER */}
    <div style={S.header}>
      <div style={{display:"flex",alignItems:"center",gap:14}}>
        <div style={{fontSize:30}}>🏛</div>
        <div>
          <div style={{fontSize:16,fontWeight:900,color:"#C8973A",letterSpacing:.3}}>الصندوق السيادي السوري</div>
          <div style={{fontSize:9,color:"#475569"}}>نظام إدارة التدريب 2026 · {role==="admin"?"مدير النظام":role==="manager"?"مدير إدارة":"موظف"}</div>
        </div>
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
        {dataLoading&&<span style={{fontSize:10,color:"#f59e0b"}}>⟳ تحديث...</span>}
        <span style={{...S.badge("#0a1628","#93c5fd"),border:"1px solid #1e3558",fontSize:10}}>{employees.length} موظف</span>
        <span style={{...S.badge("#1a1000","#C8973A"),border:"1px solid #C8973A44",fontSize:10}}>${(totBudget/1000).toFixed(0)}k</span>
        <span style={{fontSize:10,color:"#475569",maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.email}</span>
        <button style={S.btn("#1e3558","#94a3b8","6px 12px")} onClick={handleLogout}>خروج</button>
      </div>
    </div>

    {/* TABS */}
    <div style={S.tabs}>
      {TABS.map(t=>(
        <button key={t.id} onClick={()=>setTab(t.id)}
          style={{padding:"10px 15px",background:"transparent",border:"none",
            borderBottom:tab===t.id?"3px solid #C8973A":"3px solid transparent",
            color:tab===t.id?"#C8973A":"#64748b",
            fontFamily:"'Tajawal',sans-serif",fontWeight:700,fontSize:12,
            cursor:"pointer",whiteSpace:"nowrap",transition:"color .15s"}}>
          {t.i} {t.l}
        </button>
      ))}
    </div>

    {/* CONTENT */}
    <div style={S.content}>
      {tab==="dashboard"   &&<Dashboard employees={employees} programs={programs} attendance={attendance} evaluations={evaluations} certs={certs} onNav={setTab}/>}
      {tab==="analytics"   &&<AnalyticsPage employees={employees} attendance={attendance} certs={certs} rate={rate} setRate={setRate}/>}
      {tab==="subtopics"   &&<SubtopicsPage employees={employees} user={user}/>}
      {tab==="annual"      &&<AnnualPlanPage employees={employees}/>}
      {tab==="employees"   &&<EmployeesPage employees={employees} user={user} role={role} onRefresh={loadData} showToast={showToast}/>}
      {tab==="tracking"    &&<TrackingPage employees={employees} programs={programs} attendance={attendance} evaluations={evaluations} certs={certs} user={user} onRefresh={loadData}/>}
      {tab==="evaluations" &&<EvaluationsPage employees={employees} attendance={attendance} evaluations={evaluations} certs={certs} user={user} role={role} onRefresh={loadData}/>}
      {tab==="certificates"&&<CertificatesPage employees={employees} certs={certs} onRefresh={loadData}/>}
      {tab==="audit"&&role==="admin"&&<AuditPage auditLog={auditLogs}/>}
    </div>
  </div>;
}
