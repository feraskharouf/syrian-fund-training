import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const DOMAINS = ["القيادة الإدارية","الموارد البشرية","المالية والميزانية","الشؤون القانونية","الكفاءة التقنية","التحول الرقمي","المهارات الناعمة","العلاقات والبروتوكول","اللغة الإنجليزية","الإعلام والتواصل","السلامة وإدارة المخاطر","دعم العمليات"];
const PROGRAMS = {"اللغة الإنجليزية":{days:20,start:"22/03/2026",color:"#1B3A6B"},"القيادة الإدارية":{days:10,start:"05/04/2026",color:"#2E6DA4"},"المالية والميزانية":{days:8,start:"03/05/2026",color:"#C8973A"},"المهارات الناعمة":{days:5,start:"01/06/2026",color:"#217346"},"الشؤون القانونية":{days:6,start:"06/07/2026",color:"#C65911"},"التحول الرقمي":{days:6,start:"03/08/2026",color:"#7030A0"},"العلاقات والبروتوكول":{days:4,start:"07/09/2026",color:"#2E6DA4"},"الإعلام والتواصل":{days:4,start:"05/10/2026",color:"#C8973A"},"الكفاءة التقنية":{days:4,start:"02/11/2026",color:"#1B3A6B"},"الموارد البشرية":{days:4,start:"07/12/2026",color:"#217346"},"دعم العمليات":{days:3,start:"12/01/2027",color:"#C65911"},"السلامة وإدارة المخاطر":{days:3,start:"02/02/2027",color:"#9C0006"}};
const DEPT_LIST = ["الشؤون المالية","الموارد البشرية","الشؤون القانونية","تقنية المعلومات","العلاقات العامة","الشؤون الإدارية","التدقيق الداخلي","المشاريع والتطوير","الاستثمار","إدارة المخاطر","الأمانة العامة"];
const RATE_DEFAULT = 35;
const gc = g => g >= 1.5 ? "#ef4444" : g >= 0.75 ? "#f59e0b" : "#22c55e";
const pc = p => p==="عالٍ"?{bg:"#450a0a",fg:"#fca5a5"}:p==="متوسط"?{bg:"#451a03",fg:"#fcd34d"}:{bg:"#052e16",fg:"#86efac"};

const S = {
  app:{fontFamily:"'Tajawal',sans-serif",direction:"rtl",background:"#0f172a",minHeight:"100vh",color:"#e2e8f0",fontSize:14},
  header:{background:"linear-gradient(135deg,#0f172a,#1B3A6B)",borderBottom:"2px solid #C8973A",padding:"14px 22px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:50,boxShadow:"0 4px 20px rgba(0,0,0,.4)"},
  tabs:{background:"#0f172a",borderBottom:"1px solid #1e293b",display:"flex",overflowX:"auto",position:"sticky",top:61,zIndex:40},
  content:{padding:"20px",maxWidth:1500,margin:"0 auto"},
  card:{background:"#1e293b",borderRadius:12,border:"1px solid #334155",padding:18},
  input:{background:"#0f172a",border:"1px solid #334155",color:"#e2e8f0",padding:"9px 13px",borderRadius:8,fontFamily:"inherit",fontSize:13,width:"100%",outline:"none"},
  select:{background:"#0f172a",border:"1px solid #334155",color:"#e2e8f0",padding:"8px 11px",borderRadius:8,fontFamily:"inherit",fontSize:13,cursor:"pointer",outline:"none"},
  btn:(bg,fg="#fff",p="9px 18px")=>({background:bg,color:fg,border:"none",padding:p,borderRadius:8,fontFamily:"inherit",fontWeight:700,fontSize:13,cursor:"pointer",whiteSpace:"nowrap"}),
  badge:(bg,fg)=>({display:"inline-block",padding:"2px 8px",borderRadius:20,fontSize:11,fontWeight:700,background:bg,color:fg}),
  th:{padding:"10px 12px",textAlign:"right",color:"#cbd5e1",fontWeight:700,whiteSpace:"nowrap",fontSize:12},
  td:{padding:"8px 12px",borderBottom:"1px solid #1e293b",fontSize:12},
  secTitle:{fontSize:14,fontWeight:900,color:"#C8973A",borderRight:"4px solid #C8973A",paddingRight:10,marginBottom:14},
  modal:{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16},
  modalBox:{background:"#1e293b",borderRadius:14,border:"1px solid #334155",maxWidth:600,width:"100%",maxHeight:"92vh",overflowY:"auto"},
};

async function logAction(uid,email,action,table,rid,old,nw){
  await supabase.from("audit_log").insert({user_id:uid,user_email:email,action,table_name:table,record_id:rid,old_data:old,new_data:nw});
}

// ─── MINI CHARTS ───────────────────────────
function BarChart({data,height=110}){
  const max=Math.max(...data.map(d=>d.value),1);
  return(
    <div style={{display:"flex",alignItems:"flex-end",gap:3,height:height+28,padding:"0 2px"}}>
      {data.map((d,i)=>{
        const h=Math.max((d.value/max)*height,d.value>0?3:0);
        return(
          <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
            <div style={{fontSize:9,color:"#94a3b8",fontWeight:700,minHeight:12}}>{d.value>0?d.value:""}</div>
            <div style={{width:"100%",height:h,background:d.color||"#C8973A",borderRadius:"3px 3px 0 0",minHeight:1}} title={`${d.label}: ${d.value}`}/>
            <div style={{fontSize:8,color:"#64748b",textAlign:"center",lineHeight:1.2,maxWidth:36,overflow:"hidden"}}>{d.label}</div>
          </div>
        );
      })}
    </div>
  );
}

function DonutChart({segments,size=100}){
  const total=segments.reduce((s,x)=>s+x.value,0)||1;
  let off=0;const r=35,circ=2*Math.PI*r;
  return(
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#334155" strokeWidth="14"/>
      {segments.map((seg,i)=>{
        const dash=(seg.value/total)*circ;
        const el=<circle key={i} cx="50" cy="50" r={r} fill="none" stroke={seg.color} strokeWidth="14" strokeDasharray={`${dash} ${circ-dash}`} strokeDashoffset={-off*circ} transform="rotate(-90 50 50)"/>;
        off+=seg.value/total;return el;
      })}
      <text x="50" y="55" textAnchor="middle" fill="#e2e8f0" fontSize="14" fontWeight="bold">{total}</text>
    </svg>
  );
}

// ─── HELPERS ───────────────────────────────
function Toast({msg,type}){
  return <div style={{position:"fixed",top:68,left:"50%",transform:"translateX(-50%)",background:type==="error"?"#7f1d1d":"#14532d",border:`1px solid ${type==="error"?"#ef4444":"#22c55e"}`,color:"#fff",padding:"9px 22px",borderRadius:9,zIndex:999,fontWeight:700,fontSize:13,whiteSpace:"nowrap",boxShadow:"0 4px 20px rgba(0,0,0,.5)"}}>
    {msg}
  </div>;
}
function LoadingScreen(){
  return <div style={{...S.app,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{textAlign:"center",color:"#C8973A"}}><div style={{fontSize:40,marginBottom:10}}>⟳</div><div style={{fontWeight:700}}>جاري التحميل...</div></div></div>;
}
function EmptyState({icon,text}){
  return <div style={{textAlign:"center",padding:50,color:"#64748b"}}><div style={{fontSize:36,marginBottom:10}}>{icon}</div><div>{text}</div></div>;
}

// ─── EVAL MODAL ────────────────────────────
function EvalModal({domain,existing,onSave,onClose}){
  const [score,setScore]=useState(existing?.score||0);
  const [note,setNote]=useState(existing?.note||"");
  return(
    <div style={S.modal} onClick={onClose}>
      <div style={{...S.modalBox,maxWidth:420}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"14px 18px",borderBottom:"1px solid #334155",fontWeight:900}}>⭐ تقييم: {domain}</div>
        <div style={{padding:18}}>
          <div style={{fontSize:12,color:"#94a3b8",marginBottom:10}}>التقييم (1-5)</div>
          <div style={{display:"flex",gap:8,marginBottom:16}}>
            {[1,2,3,4,5].map(n=><button key={n} onClick={()=>setScore(n)} style={{flex:1,height:44,borderRadius:9,border:"none",cursor:"pointer",fontWeight:900,fontSize:16,background:score>=n?"#C8973A":"#334155",color:score>=n?"#fff":"#64748b"}}>{n}</button>)}
          </div>
          <textarea style={{...S.input,height:80,resize:"vertical",marginBottom:14}} placeholder="ملاحظاتك..." value={note} onChange={e=>setNote(e.target.value)}/>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <button style={S.btn("#334155","#94a3b8")} onClick={onClose}>إلغاء</button>
            <button style={{...S.btn("#C8973A"),opacity:score===0?0.5:1}} disabled={score===0} onClick={()=>onSave(domain,score,note)}>حفظ</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── EMP VIEW ──────────────────────────────
function EmpViewPanel({emp,rate}){
  const needs=DOMAINS.filter(d=>emp.needs?.[d]&&emp.needs[d]!=="-");
  const cost=needs.reduce((s,d)=>s+(PROGRAMS[d]?.days||0)*rate,0);
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
        {[["الإدارة",emp.dept],["المسمى",emp.title],["المدينة",emp.city],["الأولوية",emp.priority]].map(([l,v])=>(
          <div key={l} style={{background:"#0f172a",borderRadius:7,padding:"8px 11px"}}>
            <div style={{fontSize:10,color:"#64748b",marginBottom:2}}>{l}</div>
            <div style={{fontWeight:700}}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{fontWeight:700,color:"#C8973A",fontSize:12,marginBottom:7}}>الاحتياجات ({needs.length})</div>
      {needs.map(d=>(
        <div key={d} style={{display:"flex",justifyContent:"space-between",padding:"5px 9px",borderRadius:6,background:"#0f172a",marginBottom:4,fontSize:11}}>
          <span style={{fontWeight:600}}>{d}</span>
          <div style={{display:"flex",gap:8}}>
            <span style={{color:"#64748b"}}>{PROGRAMS[d]?.days}ي</span>
            <span style={{fontWeight:700,color:"#C8973A"}}>${(PROGRAMS[d]?.days||0)*rate}</span>
            <span style={{color:emp.needs[d]==="عالٍ"?"#ef4444":emp.needs[d]==="متوسط"?"#f59e0b":"#22c55e",fontWeight:700}}>{emp.needs[d]}</span>
          </div>
        </div>
      ))}
      <div style={{marginTop:10,background:"#0f172a",borderRadius:9,padding:"10px 14px",display:"flex",gap:18}}>
        <div><div style={{fontSize:10,color:"#64748b"}}>الفجوة</div><div style={{fontWeight:900,fontSize:18,color:gc(emp.gap||0)}}>{(emp.gap||0).toFixed(2)}</div></div>
        <div><div style={{fontSize:10,color:"#64748b"}}>التكلفة</div><div style={{fontWeight:900,fontSize:18,color:"#C8973A"}}>${cost.toLocaleString()}</div></div>
        <div><div style={{fontSize:10,color:"#64748b"}}>المجالات</div><div style={{fontWeight:900,fontSize:18,color:"#3b82f6"}}>{needs.length}</div></div>
      </div>
    </div>
  );
}

// ─── EMP FORM ──────────────────────────────
function EmpFormPanel({emp,onChange,onSave,onCancel,lockDept}){
  const upd=(k,v)=>onChange(e=>({...e,[k]:v}));
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
        <div><div style={{fontSize:11,color:"#94a3b8",marginBottom:3}}>الاسم</div><input style={S.input} value={emp.name||""} onChange={e=>upd("name",e.target.value)}/></div>
        <div><div style={{fontSize:11,color:"#94a3b8",marginBottom:3}}>الإدارة</div>
          {lockDept
            ?<input style={{...S.input,opacity:0.6}} value={lockDept} readOnly/>
            :<select style={S.select} value={emp.dept||""} onChange={e=>upd("dept",e.target.value)}>{DEPT_LIST.map(d=><option key={d}>{d}</option>)}</select>}
        </div>
        <div><div style={{fontSize:11,color:"#94a3b8",marginBottom:3}}>المدينة</div><input style={S.input} value={emp.city||""} onChange={e=>upd("city",e.target.value)}/></div>
        <div><div style={{fontSize:11,color:"#94a3b8",marginBottom:3}}>المسمى</div>
          <select style={S.select} value={emp.title||"موظف"} onChange={e=>upd("title",e.target.value)}>
            <option>موظف</option><option>رئيس قسم</option><option>مدير</option>
          </select>
        </div>
        <div><div style={{fontSize:11,color:"#94a3b8",marginBottom:3}}>الفجوة (0–2)</div>
          <input style={S.input} type="number" min={0} max={2} step={0.1} value={emp.gap||0}
            onChange={e=>{const g=+e.target.value;upd("gap",g);upd("priority",g>=1.5?"عالٍ":g>=0.75?"متوسط":"منخفض");}}/>
        </div>
        <div><div style={{fontSize:11,color:"#94a3b8",marginBottom:3}}>الأولوية</div>
          <input style={{...S.input,color:gc(emp.gap||0),fontWeight:700}} value={emp.priority||"منخفض"} readOnly/>
        </div>
      </div>
      <div style={{fontSize:11,fontWeight:700,color:"#C8973A",marginBottom:7}}>الاحتياجات التدريبية</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,marginBottom:14}}>
        {DOMAINS.map(d=>(
          <div key={d} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#0f172a",borderRadius:6,padding:"5px 9px"}}>
            <span style={{fontSize:11,fontWeight:600}}>{d}</span>
            <select style={{...S.select,fontSize:10,padding:"2px 5px",width:80}} value={emp.needs?.[d]||"-"} onChange={e=>upd("needs",{...emp.needs,[d]:e.target.value})}>
              <option>-</option><option>منخفض</option><option>متوسط</option><option>عالٍ</option>
            </select>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:9,justifyContent:"flex-end"}}>
        <button style={S.btn("#334155","#94a3b8")} onClick={onCancel}>إلغاء</button>
        <button style={S.btn("#217346")} onClick={()=>onSave(emp)}>💾 حفظ</button>
      </div>
    </div>
  );
}

// ─── ADD USER FORM ─────────────────────────
function AddUserForm({employees,user,onDone}){
  const [email,setEmail]=useState("");
  const [pw,setPw]=useState("");
  const [role,setRole]=useState("employee");
  const [empId,setEmpId]=useState("");
  const [dept,setDept]=useState(DEPT_LIST[0]);
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");

  const handleAdd=async()=>{
    if(!email||!pw){setErr("أدخل الإيميل وكلمة السر");return;}
    setLoading(true);setErr("");
    const{data,error}=await supabase.auth.admin.createUser({email,password:pw,email_confirm:true});
    if(error){setErr("خطأ: "+error.message);setLoading(false);return;}
    const nid=data.user.id;
    await supabase.from("user_roles").insert({user_id:nid,role});
    if(role==="manager") await supabase.from("manager_depts").insert({user_id:nid,dept});
    if(empId) await supabase.from("employees").update({user_id:nid}).eq("id",empId);
    await logAction(user.id,user.email,"إضافة مستخدم","auth.users",nid,null,{email,role});
    setLoading(false);onDone();
  };

  return(
    <div>
      <div style={{marginBottom:9}}><div style={{fontSize:11,color:"#94a3b8",marginBottom:3}}>الإيميل</div><input style={{...S.input,direction:"ltr",textAlign:"left"}} type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email@ssf.gov.sy"/></div>
      <div style={{marginBottom:9}}><div style={{fontSize:11,color:"#94a3b8",marginBottom:3}}>كلمة السر</div><input style={{...S.input,direction:"ltr",textAlign:"left"}} type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="8+ أحرف"/></div>
      <div style={{marginBottom:9}}><div style={{fontSize:11,color:"#94a3b8",marginBottom:3}}>الدور</div>
        <select style={S.select} value={role} onChange={e=>setRole(e.target.value)}>
          <option value="employee">موظف</option>
          <option value="manager">مدير إدارة</option>
          <option value="staff">موظف قسم</option>
          <option value="admin">مدير النظام</option>
        </select>
      </div>
      {role==="manager"&&<div style={{marginBottom:9}}><div style={{fontSize:11,color:"#94a3b8",marginBottom:3}}>الإدارة</div><select style={S.select} value={dept} onChange={e=>setDept(e.target.value)}>{DEPT_LIST.map(d=><option key={d}>{d}</option>)}</select></div>}
      {role==="employee"&&<div style={{marginBottom:9}}><div style={{fontSize:11,color:"#94a3b8",marginBottom:3}}>ربط بموظف</div><select style={S.select} value={empId} onChange={e=>setEmpId(e.target.value)}><option value="">— اختر —</option>{employees.map(e=><option key={e.id} value={e.id}>{e.name} — {e.dept}</option>)}</select></div>}
      {err&&<div style={{color:"#ef4444",fontSize:12,marginBottom:8,padding:"6px 10px",background:"#7f1d1d22",borderRadius:6}}>{err}</div>}
      <div style={{display:"flex",justifyContent:"flex-end",marginTop:14}}>
        <button style={{...S.btn("#217346"),opacity:loading?0.7:1}} disabled={loading} onClick={handleAdd}>{loading?"جاري...":"إضافة ✅"}</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// DEPT ANALYTICS — shared by admin & manager
// ═══════════════════════════════════════════
function DeptAnalytics({employees,programs,attendance,evaluations,certs,filterDept,rate=RATE_DEFAULT}){
  const [selDept,setSelDept]=useState(filterDept||"الكل");
  const [compare,setCompare]=useState(false);

  const depts=filterDept?[filterDept]:["الكل",...Array.from(new Set(employees.map(e=>e.dept))).sort()];
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
  const domData=DOMAINS.map(d=>({label:d.substring(0,5),fullLabel:d,value:emps.filter(e=>e.needs?.[d]&&e.needs[d]!=="-").length,high:emps.filter(e=>e.needs?.[d]==="عالٍ").length,color:PROGRAMS[d]?.color||"#334155"})).sort((a,b)=>b.value-a.value);
  const allDepts=Array.from(new Set(employees.map(e=>e.dept))).sort();
  const deptCmp=allDepts.map(dept=>{const es=employees.filter(e=>e.dept===dept);return{dept,...stats(es)};}).sort((a,b)=>b.avgGap-a.avgGap);

  const exportCSV=()=>{
    const rows=[["الاسم","الإدارة","المسمى","الفجوة","الأولوية","الميزانية",...DOMAINS],...emps.map(e=>[e.name,e.dept,e.title,(e.gap||0).toFixed(2),e.priority,DOMAINS.reduce((s,d)=>s+(e.needs?.[d]&&e.needs[d]!=="-"?(PROGRAMS[d]?.days||0)*rate:0),0),...DOMAINS.map(d=>e.needs?.[d]||"-")])];
    const blob=new Blob(["\uFEFF"+rows.map(r=>r.join(",")).join("\n")],{type:"text/csv;charset=utf-8"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`تحليل_${selDept}.csv`;a.click();
  };

  const exportHTML=()=>{
    const html=`<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><title>تقرير ${selDept}</title>
<style>body{font-family:Arial,sans-serif;padding:30px;color:#1e293b}h1{color:#1B3A6B;border-bottom:3px solid #C8973A;padding-bottom:10px}table{width:100%;border-collapse:collapse;margin:20px 0;font-size:12px}th{background:#1B3A6B;color:#fff;padding:9px;text-align:right}td{padding:8px;border-bottom:1px solid #e2e8f0}tr:nth-child(even){background:#f8fafc}.kpi{display:inline-block;margin:8px;padding:14px 22px;border-radius:10px;border:1px solid #e2e8f0;text-align:center}.kpi-v{font-size:26px;font-weight:900;color:#1B3A6B}.kpi-l{font-size:11px;color:#64748b}</style></head><body>
<h1>🏛 تقرير — ${selDept}</h1><p style="color:#64748b">التاريخ: ${new Date().toLocaleDateString("ar-SY")} · معدل اليوم: $${rate}</p>
<div><div class="kpi"><div class="kpi-v">${st.total}</div><div class="kpi-l">الموظفون</div></div><div class="kpi"><div class="kpi-v">${st.avgGap.toFixed(2)}</div><div class="kpi-l">متوسط الفجوة</div></div><div class="kpi"><div class="kpi-v">${st.high}</div><div class="kpi-l">أولوية عالية</div></div><div class="kpi"><div class="kpi-v">$${st.budget.toLocaleString()}</div><div class="kpi-l">الميزانية</div></div><div class="kpi"><div class="kpi-v">${st.cert}</div><div class="kpi-l">شهادات</div></div></div>
<h2>الموظفون</h2><table><tr><th>#</th><th>الاسم</th><th>المسمى</th><th>الفجوة</th><th>الأولوية</th><th>المجالات</th><th>الميزانية</th></tr>
${emps.map((e,i)=>`<tr><td>${i+1}</td><td>${e.name}</td><td>${e.title}</td><td>${(e.gap||0).toFixed(2)}</td><td>${e.priority}</td><td>${DOMAINS.filter(d=>e.needs?.[d]&&e.needs[d]!=="-").length}</td><td>$${DOMAINS.reduce((s,d)=>s+(e.needs?.[d]&&e.needs[d]!=="-"?(PROGRAMS[d]?.days||0)*rate:0),0).toLocaleString()}</td></tr>`).join("")}
</table><h2>الاحتياجات</h2><table><tr><th>المجال</th><th>العدد</th><th>عالي</th><th>الأيام</th><th>الميزانية</th></tr>
${domData.filter(d=>d.value>0).map(d=>`<tr><td>${d.fullLabel}</td><td>${d.value}</td><td>${d.high}</td><td>${PROGRAMS[d.fullLabel]?.days||0}</td><td>$${(d.value*(PROGRAMS[d.fullLabel]?.days||0)*rate).toLocaleString()}</td></tr>`).join("")}
</table></body></html>`;
    const blob=new Blob([html],{type:"text/html;charset=utf-8"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`تقرير_${selDept}.html`;a.click();
  };

  return(
    <div>
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
        {!filterDept&&<select style={{...S.select,minWidth:180}} value={selDept} onChange={e=>setSelDept(e.target.value)}>{depts.map(d=><option key={d}>{d}</option>)}</select>}
        <button style={S.btn(compare?"#C8973A":"#1e293b","#e2e8f0","8px 14px")} onClick={()=>setCompare(!compare)}>
          {compare?"📊 تفاصيل":"⚖️ مقارنة الإدارات"}
        </button>
        <div style={{marginRight:"auto",display:"flex",gap:8}}>
          <button style={S.btn("#217346","#fff","8px 14px")} onClick={exportCSV}>📥 Excel</button>
          <button style={S.btn("#1B3A6B","#fff","8px 14px")} onClick={exportHTML}>📄 تقرير HTML</button>
        </div>
      </div>

      {!compare?(
        <div>
          {/* KPIs */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(115px,1fr))",gap:11,marginBottom:16}}>
            {[{v:st.total,l:"الموظفون",c:"#3b82f6",i:"👥"},{v:st.avgGap.toFixed(2),l:"متوسط الفجوة",c:gc(st.avgGap),i:"📊"},{v:st.high,l:"أولوية عالية",c:"#ef4444",i:"🔴"},{v:st.mid,l:"متوسطة",c:"#f59e0b",i:"🟡"},{v:st.needs,l:"الاحتياجات",c:"#a78bfa",i:"🎯"},{v:`$${(st.budget/1000).toFixed(1)}k`,l:"الميزانية",c:"#C8973A",i:"💰"},{v:st.att,l:"حضر",c:"#22c55e",i:"✅"},{v:st.cert,l:"شهادات",c:"#f472b6",i:"🏆"}].map((k,i)=>(
              <div key={i} style={{...S.card,borderTop:`3px solid ${k.c}`,textAlign:"center",padding:13}}>
                <div style={{fontSize:16}}>{k.i}</div>
                <div style={{fontSize:20,fontWeight:900,color:k.c,lineHeight:1.2}}>{k.v}</div>
                <div style={{fontSize:10,color:"#64748b",marginTop:2}}>{k.l}</div>
              </div>
            ))}
          </div>

          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14,marginBottom:14}}>
            <div style={S.card}>
              <div style={S.secTitle}>الاحتياجات حسب المجال</div>
              <BarChart data={domData} height={100}/>
              <div style={{marginTop:10,display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
                {domData.filter(d=>d.value>0).slice(0,6).map(d=>(
                  <div key={d.fullLabel} style={{display:"flex",justifyContent:"space-between",background:"#0f172a",borderRadius:6,padding:"4px 8px",fontSize:11}}>
                    <span style={{fontWeight:600}}>{d.fullLabel}</span>
                    <div style={{display:"flex",gap:5}}>
                      <span style={{color:"#3b82f6",fontWeight:700}}>{d.value}</span>
                      {d.high>0&&<span style={{color:"#ef4444"}}>🔴{d.high}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={S.card}>
              <div style={S.secTitle}>توزيع الأولويات</div>
              <div style={{display:"flex",justifyContent:"center",marginBottom:10}}>
                <DonutChart segments={[{value:st.high,color:"#ef4444"},{value:st.mid,color:"#f59e0b"},{value:st.low,color:"#22c55e"}]} size={110}/>
              </div>
              {[["عالٍ",st.high,"#ef4444"],["متوسط",st.mid,"#f59e0b"],["منخفض",st.low,"#22c55e"]].map(([l,v,c])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #1e293b",fontSize:12}}>
                  <span style={{color:c,fontWeight:700}}>● {l}</span>
                  <span style={{color:"#94a3b8"}}>{v} ({st.total>0?(v/st.total*100).toFixed(0):0}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Employee table */}
          <div style={S.card}>
            <div style={S.secTitle}>قائمة الموظفين ({emps.length})</div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr style={{background:"#1B3A6B"}}>{["#","الاسم","المسمى","الفجوة","الأولوية","المجالات","الميزانية","الحضور","الشهادات"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {emps.map((e,i)=>{
                    const n=DOMAINS.filter(d=>e.needs?.[d]&&e.needs[d]!=="-").length;
                    const b=DOMAINS.reduce((s,d)=>s+(e.needs?.[d]&&e.needs[d]!=="-"?(PROGRAMS[d]?.days||0)*rate:0),0);
                    const ac=attendance.filter(a=>a.employee_id===e.id&&a.status==="حاضر").length;
                    const cc=certs.filter(c=>c.employee_id===e.id).length;
                    const{bg,fg}=pc(e.priority);
                    return(
                      <tr key={e.id} style={{background:i%2===0?"#0f172a":"#1e293b"}}>
                        <td style={S.td}><span style={{color:"#64748b"}}>{i+1}</span></td>
                        <td style={S.td}><span style={{fontWeight:700}}>{e.name}</span></td>
                        <td style={S.td}>{e.title}</td>
                        <td style={S.td}><span style={{fontWeight:900,color:gc(e.gap||0)}}>{(e.gap||0).toFixed(2)}</span></td>
                        <td style={S.td}><span style={S.badge(bg,fg)}>{e.priority}</span></td>
                        <td style={S.td}><span style={{fontWeight:700,color:"#3b82f6"}}>{n}</span></td>
                        <td style={S.td}><span style={{fontWeight:700,color:"#22c55e"}}>${b.toLocaleString()}</span></td>
                        <td style={S.td}><span style={{color:"#C8973A"}}>{ac}</span></td>
                        <td style={S.td}><span style={{color:"#a78bfa"}}>{cc}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ):(
        // ── COMPARE MODE ──
        <div>
          <div style={{...S.card,marginBottom:14}}>
            <div style={S.secTitle}>مقارنة الإدارات — اضغط على إدارة للتفاصيل</div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr style={{background:"#1B3A6B"}}>{["الإدارة","الموظفون","متوسط الفجوة","عالٍ","متوسط","منخفض","الاحتياجات","الميزانية","الشهادات"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {deptCmp.map((d,i)=>(
                    <tr key={d.dept} style={{background:i%2===0?"#0f172a":"#1e293b",cursor:"pointer"}} onClick={()=>{setSelDept(d.dept);setCompare(false);}}>
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
            <div style={S.card}>
              <div style={S.secTitle}>متوسط الفجوة بالإدارة</div>
              <BarChart data={deptCmp.map(d=>({label:d.dept.substring(0,5),value:parseFloat(d.avgGap.toFixed(2)),color:gc(d.avgGap)}))} height={110}/>
            </div>
            <div style={S.card}>
              <div style={S.secTitle}>الميزانية (ألف $)</div>
              <BarChart data={deptCmp.map(d=>({label:d.dept.substring(0,5),value:Math.round(d.budget/1000),color:"#C8973A"}))} height={110}/>
            </div>
          </div>
        </div>
      )}
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
    <div style={{...S.app,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:"#1e293b",borderRadius:20,border:"1px solid #334155",padding:44,maxWidth:420,width:"100%",textAlign:"center",boxShadow:"0 20px 60px rgba(0,0,0,.5)"}}>
        <div style={{fontSize:56,marginBottom:10}}>🏛</div>
        <div style={{fontSize:22,fontWeight:900,color:"#C8973A",marginBottom:4}}>الصندوق السيادي السوري</div>
        <div style={{fontSize:12,color:"#64748b",marginBottom:32}}>نظام إدارة الاحتياجات التدريبية 2026</div>
        <input style={{...S.input,marginBottom:10,direction:"ltr",textAlign:"left"}} type="email" placeholder="email@ssf.gov.sy" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()}/>
        <input style={{...S.input,marginBottom:14,direction:"ltr",textAlign:"left"}} type="password" placeholder="••••••••" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()}/>
        {err&&<div style={{color:"#ef4444",fontSize:12,marginBottom:10,background:"#7f1d1d22",padding:"8px 12px",borderRadius:7}}>{err}</div>}
        <button style={{...S.btn("linear-gradient(135deg,#C8973A,#b07d2e)"),width:"100%",padding:13,fontSize:15,borderRadius:10}} onClick={doLogin} disabled={loading}>
          {loading?"جاري الدخول...":"دخول →"}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// EMPLOYEE PORTAL
// ═══════════════════════════════════════════
function EmployeePortal({user,onLogout}){
  const [emp,setEmp]=useState(null);
  const [att,setAtt]=useState([]);
  const [evs,setEvs]=useState([]);
  const [ces,setCes]=useState([]);
  const [tab,setTab]=useState("home");
  const [evalModal,setEvalModal]=useState(null);
  const [needsModal,setNeedsModal]=useState(false);
  const [myNeeds,setMyNeeds]=useState({});
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);

  useEffect(()=>{loadData();},[]);
  const loadData=async()=>{
    setLoading(true);
    const{data:e}=await supabase.from("employees").select("*").eq("user_id",user.id).single();
    if(e){setEmp(e);setMyNeeds(e.needs||{});
      const[{data:a},{data:v},{data:c}]=await Promise.all([supabase.from("attendance").select("*").eq("employee_id",e.id),supabase.from("evaluations").select("*").eq("employee_id",e.id),supabase.from("certificates").select("*").eq("employee_id",e.id)]);
      setAtt(a||[]);setEvs(v||[]);setCes(c||[]);
    }
    setLoading(false);
  };
  const saveNeeds=async()=>{setSaving(true);await supabase.from("employees").update({needs:myNeeds}).eq("id",emp.id);await logAction(user.id,user.email,"تحديث احتياجات","employees",emp.id,emp.needs,myNeeds);setSaving(false);setNeedsModal(false);loadData();};
  const submitEval=async(domain,score,note)=>{const ex=evs.find(e=>e.domain===domain);if(ex)await supabase.from("evaluations").update({score,note,evaluated_by:user.id}).eq("id",ex.id);else await supabase.from("evaluations").insert({employee_id:emp.id,domain,score,note,evaluated_by:user.id});loadData();setEvalModal(null);};

  if(loading)return<LoadingScreen/>;
  if(!emp)return<div style={{...S.app,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{...S.card,textAlign:"center",padding:40,maxWidth:320}}><div style={{fontSize:36,marginBottom:10}}>⚠️</div><div style={{fontWeight:800,marginBottom:6}}>الحساب غير مرتبط بملف موظف</div><div style={{fontSize:12,color:"#64748b",marginBottom:18}}>تواصل مع مدير النظام</div><button style={S.btn("#334155","#94a3b8")} onClick={onLogout}>خروج</button></div></div>;

  const myDoms=DOMAINS.filter(d=>emp.needs?.[d]&&emp.needs[d]!=="-");
  const TABS=[{id:"home",l:"الرئيسية",i:"🏠"},{id:"training",l:"تدريباتي",i:"📚"},{id:"needs",l:"احتياجاتي",i:"🎯"},{id:"certs",l:"شهاداتي",i:"🏆"}];

  return(
    <div style={S.app}>
      <div style={S.header}>
        <div><div style={{fontSize:16,fontWeight:900,color:"#C8973A"}}>🏛 مرحباً، {emp.name}</div><div style={{fontSize:11,color:"#64748b"}}>{emp.dept} · {emp.title}</div></div>
        <button style={S.btn("#334155","#94a3b8","7px 14px")} onClick={onLogout}>خروج</button>
      </div>
      <div style={S.tabs}>{TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"11px 16px",background:"transparent",border:"none",borderBottom:tab===t.id?"3px solid #C8973A":"3px solid transparent",color:tab===t.id?"#C8973A":"#64748b",fontFamily:"inherit",fontWeight:700,fontSize:12,cursor:"pointer",whiteSpace:"nowrap"}}>{t.i} {t.l}</button>)}</div>
      <div style={S.content}>
        {tab==="home"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:11,marginBottom:16}}>
              {[{v:myDoms.length,l:"مجالات",c:"#3b82f6",i:"📊"},{v:att.filter(a=>a.status==="حاضر").length,l:"حضرت",c:"#22c55e",i:"✅"},{v:evs.length,l:"تقييمات",c:"#C8973A",i:"⭐"},{v:ces.length,l:"شهادات",c:"#a78bfa",i:"🏆"}].map((k,i)=>(
                <div key={i} style={{...S.card,borderTop:`3px solid ${k.c}`,textAlign:"center",padding:14}}>
                  <div style={{fontSize:18}}>{k.i}</div><div style={{fontSize:24,fontWeight:900,color:k.c}}>{k.v}</div><div style={{fontSize:10,color:"#64748b",marginTop:2}}>{k.l}</div>
                </div>
              ))}
            </div>
            <div style={S.card}>
              <div style={S.secTitle}>بياناتي</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[["الإدارة",emp.dept],["المسمى",emp.title],["المدينة",emp.city],["الأولوية",emp.priority]].map(([l,v])=>(
                  <div key={l} style={{background:"#0f172a",borderRadius:7,padding:"8px 11px"}}><div style={{fontSize:10,color:"#64748b",marginBottom:2}}>{l}</div><div style={{fontWeight:700}}>{v}</div></div>
                ))}
              </div>
            </div>
          </div>
        )}
        {tab==="training"&&(
          <div>
            <div style={{...S.card,marginBottom:10,fontSize:12,color:"#94a3b8"}}>📝 يمكنك تقييم التدريبات التي حضرتها</div>
            {myDoms.map(domain=>{
              const a=att.find(a=>a.domain===domain),ev=evs.find(e=>e.domain===domain),p=PROGRAMS[domain],did=a?.status==="حاضر";
              return(
                <div key={domain} style={{...S.card,marginBottom:9,borderRight:`4px solid ${p?.color||"#334155"}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:7}}>
                    <div><div style={{fontWeight:800,fontSize:13}}>{domain}</div><div style={{fontSize:10,color:"#64748b",marginTop:2}}>يبدأ {p?.start} · {p?.days} يوم</div></div>
                    <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
                      <span style={S.badge(did?"#052e16":"#450a0a",did?"#86efac":"#fca5a5")}>{a?.status||"غائب"}</span>
                      {ev&&<span style={{...S.badge("#1e293b","#C8973A"),border:"1px solid #C8973A"}}>⭐{ev.score}/5</span>}
                      {did&&<button style={S.btn(ev?"#1B3A6B":"#C8973A","#fff","5px 12px")} onClick={()=>setEvalModal(domain)}>{ev?"تعديل":"قيّم"}</button>}
                    </div>
                  </div>
                  {ev?.note&&<div style={{marginTop:7,fontSize:11,color:"#94a3b8",background:"#0f172a",borderRadius:6,padding:"5px 9px"}}>💬 {ev.note}</div>}
                </div>
              );
            })}
            {myDoms.length===0&&<EmptyState icon="📚" text="لا توجد تدريبات مخصصة لك"/>}
          </div>
        )}
        {tab==="needs"&&(
          <div>
            <div style={{...S.card,marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={S.secTitle}>احتياجاتي التدريبية</div>
                <button style={S.btn("#C8973A")} onClick={()=>setNeedsModal(true)}>✏️ تعديل</button>
              </div>
              <div style={{fontSize:12,color:"#64748b",marginBottom:12}}>المجالات التي تحتاج تدريباً فيها — تُرفع للمدير للمراجعة</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:7}}>
                {DOMAINS.map(d=>{const v=emp.needs?.[d]||"-";const{bg,fg}=v==="-"?{bg:"#1e293b",fg:"#64748b"}:pc(v);return(
                  <div key={d} style={{background:bg,borderRadius:8,padding:"7px 11px",border:"1px solid #334155",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:11,fontWeight:600,color:v==="-"?"#64748b":"#e2e8f0"}}>{d}</span>
                    <span style={S.badge(v==="-"?"#334155":"transparent",fg)}>{v}</span>
                  </div>
                );})}
              </div>
            </div>
          </div>
        )}
        {tab==="certs"&&(ces.length===0?<EmptyState icon="🏆" text="لا توجد شهادات بعد"/>:ces.map(cert=>(
          <div key={cert.id} style={{...S.card,marginBottom:9,background:"linear-gradient(135deg,#1e293b,#0f172a)",borderColor:"#C8973A"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontSize:10,color:"#64748b",marginBottom:3}}>شهادة إتمام</div><div style={{fontWeight:900,fontSize:13,color:"#C8973A"}}>{cert.domain}</div><div style={{fontSize:10,color:"#64748b",marginTop:2}}>رقم: {cert.cert_number} · {new Date(cert.issued_at).toLocaleDateString("ar-SY")}</div></div>
              <div style={{fontSize:32}}>📜</div>
            </div>
          </div>
        )))}
      </div>
      {needsModal&&(
        <div style={S.modal} onClick={()=>setNeedsModal(false)}>
          <div style={S.modalBox} onClick={e=>e.stopPropagation()}>
            <div style={{padding:"14px 18px",borderBottom:"1px solid #334155",fontWeight:900,display:"flex",justifyContent:"space-between"}}>🎯 تحديث احتياجاتي<button style={S.btn("#334155","#94a3b8","3px 9px")} onClick={()=>setNeedsModal(false)}>✕</button></div>
            <div style={{padding:18}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:14}}>
                {DOMAINS.map(d=>(
                  <div key={d} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#0f172a",borderRadius:6,padding:"5px 9px"}}>
                    <span style={{fontSize:11,fontWeight:600}}>{d}</span>
                    <select style={{...S.select,fontSize:10,padding:"2px 5px",width:80}} value={myNeeds[d]||"-"} onChange={e=>setMyNeeds(n=>({...n,[d]:e.target.value}))}>
                      <option>-</option><option>منخفض</option><option>متوسط</option><option>عالٍ</option>
                    </select>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",gap:9,justifyContent:"flex-end"}}>
                <button style={S.btn("#334155","#94a3b8")} onClick={()=>setNeedsModal(false)}>إلغاء</button>
                <button style={{...S.btn("#217346"),opacity:saving?0.7:1}} disabled={saving} onClick={saveNeeds}>{saving?"حفظ...":"💾 حفظ"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {evalModal&&<EvalModal domain={evalModal} existing={evs.find(e=>e.domain===evalModal)} onSave={submitEval} onClose={()=>setEvalModal(null)}/>}
    </div>
  );
}

// ═══════════════════════════════════════════
// MANAGER PORTAL
// ═══════════════════════════════════════════
function ManagerPortal({user,managerDept,onLogout}){
  const [employees,setEmployees]=useState([]);
  const [programs,setPrograms]=useState({});
  const [attendance,setAttendance]=useState([]);
  const [evaluations,setEvaluations]=useState([]);
  const [certs,setCerts]=useState([]);
  const [tab,setTab]=useState("analytics");
  const [loading,setLoading]=useState(true);
  const [modalEmp,setModalEmp]=useState(null);
  const [modalMode,setModalMode]=useState("view");
  const [toast,setToast]=useState(null);

  useEffect(()=>{loadData();},[]);
  const showToast=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};
  const loadData=async()=>{
    setLoading(true);
    const[{data:e},{data:p},{data:a},{data:v},{data:c}]=await Promise.all([supabase.from("employees").select("*").eq("dept",managerDept).order("name"),supabase.from("training_programs").select("*"),supabase.from("attendance").select("*"),supabase.from("evaluations").select("*"),supabase.from("certificates").select("*")]);
    setEmployees(e||[]);const pm={};(p||[]).forEach(x=>pm[x.domain]=x);setPrograms(pm);setAttendance(a||[]);setEvaluations(v||[]);setCerts(c||[]);setLoading(false);
  };
  const saveEmployee=async(emp)=>{
    if(emp.id){await supabase.from("employees").update({...emp,dept:managerDept}).eq("id",emp.id);await logAction(user.id,user.email,"تعديل موظف (مدير)","employees",emp.id,null,emp);showToast("تم ✅");}
    else{const{data}=await supabase.from("employees").insert({...emp,dept:managerDept}).select().single();await logAction(user.id,user.email,"إضافة موظف (مدير)","employees",data?.id,null,emp);showToast("تم ✅");}
    setModalEmp(null);loadData();
  };

  if(loading)return<LoadingScreen/>;
  const TABS=[{id:"analytics",l:"تحليل إدارتي",i:"📊"},{id:"employees",l:"الموظفون",i:"👥"},{id:"tracking",l:"متابعة التدريب",i:"📋"}];

  return(
    <div style={S.app}>
      {toast&&<Toast {...toast}/>}
      <div style={S.header}>
        <div><div style={{fontSize:16,fontWeight:900,color:"#C8973A"}}>🏛 {managerDept}</div><div style={{fontSize:11,color:"#64748b"}}>مدير الإدارة · {user.email}</div></div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <span style={{...S.badge("#1e293b","#4ade80"),border:"1px solid #334155",fontSize:11}}>{employees.length} موظف</span>
          <button style={S.btn("#334155","#94a3b8","7px 12px")} onClick={onLogout}>خروج</button>
        </div>
      </div>
      <div style={S.tabs}>{TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"11px 16px",background:"transparent",border:"none",borderBottom:tab===t.id?"3px solid #C8973A":"3px solid transparent",color:tab===t.id?"#C8973A":"#64748b",fontFamily:"inherit",fontWeight:700,fontSize:12,cursor:"pointer",whiteSpace:"nowrap"}}>{t.i} {t.l}</button>)}</div>
      <div style={S.content}>
        {tab==="analytics"&&<DeptAnalytics employees={employees} programs={programs} attendance={attendance} evaluations={evaluations} certs={certs} filterDept={managerDept}/>}
        {tab==="employees"&&(
          <div>
            <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}>
              <button style={S.btn("#217346")} onClick={()=>{setModalEmp({name:"",title:"موظف",dept:managerDept,city:"دمشق",gap:0,priority:"منخفض",needs:Object.fromEntries(DOMAINS.map(d=>[d,"-"]))});setModalMode("new");}}>+ إضافة موظف</button>
            </div>
            <div style={{overflowX:"auto",borderRadius:12,border:"1px solid #334155"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr style={{background:"#1B3A6B"}}>{["#","الاسم","المسمى","الفجوة","الأولوية","المجالات",""].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {employees.map((e,i)=>{
                    const n=DOMAINS.filter(d=>e.needs?.[d]&&e.needs[d]!=="-").length;const{bg,fg}=pc(e.priority);
                    return(
                      <tr key={e.id} style={{background:i%2===0?"#0f172a":"#1e293b"}}>
                        <td style={S.td}><span style={{color:"#64748b"}}>{i+1}</span></td>
                        <td style={S.td}><span style={{fontWeight:700}}>{e.name}</span></td>
                        <td style={S.td}><span style={S.badge(bg,fg)}>{e.title}</span></td>
                        <td style={S.td}><span style={{fontWeight:900,color:gc(e.gap||0)}}>{(e.gap||0).toFixed(2)}</span></td>
                        <td style={S.td}><span style={S.badge(bg,fg)}>{e.priority}</span></td>
                        <td style={S.td}><span style={{fontWeight:700,color:"#3b82f6"}}>{n}</span></td>
                        <td style={S.td}><div style={{display:"flex",gap:5}}>
                          <button style={S.btn("#1B3A6B","#fff","4px 9px")} onClick={()=>{setModalEmp(e);setModalMode("view");}}>عرض</button>
                          <button style={S.btn("#C8973A","#fff","4px 9px")} onClick={()=>{setModalEmp({...e});setModalMode("edit");}}>تعديل</button>
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
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:11}}>
            {DOMAINS.map(dom=>{
              const p=PROGRAMS[dom],st=programs[dom]?.status||"مخطط",stc={مخطط:"#64748b",جارٍ:"#f59e0b",منجز:"#22c55e",ملغى:"#ef4444"}[st];
              const parts=employees.filter(e=>e.needs?.[dom]&&e.needs[dom]!=="-");
              const present=parts.filter(e=>attendance.find(a=>a.employee_id===e.id&&a.domain===dom&&a.status==="حاضر")).length;
              return(
                <div key={dom} style={{...S.card,borderRight:`4px solid ${p?.color||"#334155"}`}}>
                  <div style={{fontWeight:800,fontSize:13,marginBottom:3}}>{dom}</div>
                  <div style={{fontSize:10,color:"#64748b",marginBottom:7}}>يبدأ {p?.start}</div>
                  <div style={{display:"flex",gap:6,marginBottom:6}}>
                    {[{l:"مشارك",v:parts.length,c:"#3b82f6"},{l:"حضر",v:present,c:"#22c55e"},{l:"يوم",v:p?.days||0,c:"#a78bfa"}].map(s=>(
                      <div key={s.l} style={{flex:1,background:"#0f172a",borderRadius:5,padding:5,textAlign:"center"}}><div style={{fontWeight:900,color:s.c,fontSize:13}}>{s.v}</div><div style={{fontSize:9,color:"#64748b"}}>{s.l}</div></div>
                    ))}
                  </div>
                  <span style={{color:stc,fontWeight:700,fontSize:11}}>● {st}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {modalEmp&&(
        <div style={S.modal} onClick={()=>setModalEmp(null)}>
          <div style={S.modalBox} onClick={e=>e.stopPropagation()}>
            <div style={{padding:"14px 18px",borderBottom:"1px solid #334155",fontWeight:900,display:"flex",justifyContent:"space-between",position:"sticky",top:0,background:"#1e293b",borderRadius:"14px 14px 0 0"}}>
              {modalMode==="new"?"➕ إضافة موظف":`${modalMode==="edit"?"✏️":"👤"} ${modalEmp.name}`}
              <button style={S.btn("#334155","#94a3b8","3px 9px")} onClick={()=>setModalEmp(null)}>✕</button>
            </div>
            <div style={{padding:18}}>{modalMode==="view"?<EmpViewPanel emp={modalEmp} rate={RATE_DEFAULT}/>:<EmpFormPanel emp={modalEmp} onChange={setModalEmp} onSave={saveEmployee} onCancel={()=>setModalEmp(null)} lockDept={managerDept}/>}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// ADMIN / STAFF DASHBOARD
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
      role==="admin"?supabase.from("audit_log").select("*").order("created_at",{ascending:false}).limit(150):{data:[]},
    ]);
    setEmployees(e||[]);const pm={};(p||[]).forEach(x=>pm[x.domain]=x);setPrograms(pm);
    setAttendance(a||[]);setEvaluations(v||[]);setCerts(c||[]);setAuditLog(l||[]);setLoading(false);
  };

  const saveEmployee=async(emp)=>{
    if(emp.id){const old=employees.find(e=>e.id===emp.id);await supabase.from("employees").update(emp).eq("id",emp.id);await logAction(user.id,user.email,"تعديل موظف","employees",emp.id,old,emp);showToast("تم ✅");}
    else{const{data}=await supabase.from("employees").insert(emp).select().single();await logAction(user.id,user.email,"إضافة موظف","employees",data?.id,null,emp);showToast("أُضيف ✅");}
    setModalEmp(null);loadAll();
  };
  const deleteEmployee=async(id)=>{await supabase.from("employees").delete().eq("id",id);await logAction(user.id,user.email,"حذف موظف","employees",id,null,null);setDeleteConfirm(null);showToast("حُذف","error");loadAll();};
  const setStatus=async(domain,status)=>{const ex=programs[domain];if(ex)await supabase.from("training_programs").update({status,updated_by:user.id}).eq("domain",domain);else await supabase.from("training_programs").insert({domain,status,updated_by:user.id});await logAction(user.id,user.email,"تغيير حالة","training_programs",domain,{status:ex?.status},{status});loadAll();};
  const setAttVal=async(domain,empId,status)=>{const ex=attendance.find(a=>a.domain===domain&&a.employee_id===empId);if(ex)await supabase.from("attendance").update({status,updated_by:user.id}).eq("id",ex.id);else await supabase.from("attendance").insert({domain,employee_id:empId,status,updated_by:user.id});loadAll();};
  const setEvalVal=async(empId,domain,field,val)=>{const ex=evaluations.find(e=>e.employee_id===empId&&e.domain===domain);if(ex)await supabase.from("evaluations").update({[field]:val,evaluated_by:user.id}).eq("id",ex.id);else await supabase.from("evaluations").insert({employee_id:empId,domain,[field]:val,evaluated_by:user.id});loadAll();};
  const issueCert=async(empId,domain)=>{if(!certs.find(c=>c.employee_id===empId&&c.domain===domain)){await supabase.from("certificates").insert({employee_id:empId,domain,issued_by:user.id});await supabase.from("evaluations").update({cert_issued:true}).match({employee_id:empId,domain});await logAction(user.id,user.email,"إصدار شهادة","certificates",empId,null,{domain});showToast("شهادة 🏆");loadAll();}};

  const high=employees.filter(e=>e.priority==="عالٍ").length;
  const doneCount=Object.values(programs).filter(p=>p.status==="منجز").length;
  const avgGap=employees.length?(employees.reduce((s,e)=>s+(e.gap||0),0)/employees.length).toFixed(2):0;
  const totalBudget=DOMAINS.reduce((s,d)=>s+employees.filter(e=>e.needs?.[d]&&e.needs[d]!=="-").length*(PROGRAMS[d]?.days||0)*rate,0);
  const depts=["الكل",...Array.from(new Set(employees.map(e=>e.dept))).sort()];
  const filtered=employees.filter(e=>(!empSearch||e.name.includes(empSearch)||e.dept.includes(empSearch))&&(empDept==="الكل"||e.dept===empDept));
  const sortedDoms=[...DOMAINS].sort((a,b)=>employees.filter(e=>e.needs?.[b]&&e.needs[b]!=="-").length-employees.filter(e=>e.needs?.[a]&&e.needs[a]!=="-").length);

  const TABS=[
    {id:"dashboard",l:"لوحة التحكم",i:"⊞"},
    {id:"analytics",l:"تحليل الإدارات",i:"📊"},
    {id:"employees",l:"الموظفون",i:"👤"},
    {id:"tracking",l:"متابعة التدريب",i:"📋"},
    {id:"evaluations",l:"التقييمات",i:"⭐"},
    {id:"certificates",l:"الشهادات",i:"🏆"},
    {id:"budget",l:"الميزانية",i:"💰"},
    ...(role==="admin"?[{id:"audit",l:"سجل التغييرات",i:"📝"},{id:"users",l:"المستخدمون",i:"👥"}]:[]),
  ];

  if(loading)return<LoadingScreen/>;

  return(
    <div style={S.app}>
      {toast&&<Toast {...toast}/>}
      <div style={S.header}>
        <div><div style={{fontSize:16,fontWeight:900,color:"#C8973A"}}>🏛 الصندوق السيادي السوري</div><div style={{fontSize:11,color:"#64748b"}}>نظام التدريب 2026 · {role==="admin"?"مدير النظام":"موظف القسم"}</div></div>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{...S.badge("#1e293b","#4ade80"),border:"1px solid #334155",fontSize:11}}>{employees.length} موظف</span>
          <span style={{...S.badge("#1e293b","#C8973A"),border:"1px solid #334155",fontSize:11}}>${totalBudget.toLocaleString()}</span>
          <span style={{fontSize:10,color:"#64748b"}}>{user.email}</span>
          <button style={S.btn("#334155","#94a3b8","7px 12px")} onClick={onLogout}>خروج</button>
        </div>
      </div>
      <div style={S.tabs}>{TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"11px 15px",background:"transparent",border:"none",borderBottom:tab===t.id?"3px solid #C8973A":"3px solid transparent",color:tab===t.id?"#C8973A":"#64748b",fontFamily:"inherit",fontWeight:700,fontSize:12,cursor:"pointer",whiteSpace:"nowrap"}}>{t.i} {t.l}</button>)}</div>

      <div style={S.content}>

        {tab==="dashboard"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(115px,1fr))",gap:11,marginBottom:16}}>
              {[{v:employees.length,l:"الموظفون",c:"#3b82f6",i:"👥"},{v:high,l:"أولوية عالية",c:"#ef4444",i:"🔴"},{v:avgGap,l:"متوسط الفجوة",c:"#a78bfa",i:"📊"},{v:`${doneCount}/12`,l:"برامج منجزة",c:"#22c55e",i:"✅"},{v:certs.length,l:"شهادات",c:"#C8973A",i:"🏆"},{v:evaluations.length,l:"تقييمات",c:"#f472b6",i:"⭐"}].map((k,i)=>(
                <div key={i} style={{...S.card,borderTop:`3px solid ${k.c}`,textAlign:"center",padding:14}}>
                  <div style={{fontSize:18}}>{k.i}</div><div style={{fontSize:22,fontWeight:900,color:k.c,lineHeight:1.2}}>{k.v}</div><div style={{fontSize:10,color:"#64748b",marginTop:2}}>{k.l}</div>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14}}>
              <div style={S.card}><div style={S.secTitle}>أعلى المجالات</div><BarChart data={sortedDoms.slice(0,12).map(d=>({label:d.substring(0,5),value:employees.filter(e=>e.needs?.[d]&&e.needs[d]!=="-").length,color:PROGRAMS[d]?.color||"#334155"}))} height={100}/></div>
              <div style={S.card}>
                <div style={S.secTitle}>الأولويات</div>
                <div style={{display:"flex",justifyContent:"center",marginBottom:8}}><DonutChart segments={[{value:high,color:"#ef4444"},{value:employees.filter(e=>e.priority==="متوسط").length,color:"#f59e0b"},{value:employees.filter(e=>e.priority==="منخفض").length,color:"#22c55e"}]} size={110}/></div>
                {[["عالٍ",high,"#ef4444"],["متوسط",employees.filter(e=>e.priority==="متوسط").length,"#f59e0b"],["منخفض",employees.filter(e=>e.priority==="منخفض").length,"#22c55e"]].map(([l,v,c])=>(
                  <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #1e293b",fontSize:12}}><span style={{color:c,fontWeight:700}}>● {l}</span><span style={{color:"#94a3b8"}}>{v}</span></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab==="analytics"&&<DeptAnalytics employees={employees} programs={programs} attendance={attendance} evaluations={evaluations} certs={certs} rate={rate}/>}

        {tab==="employees"&&(
          <div>
            <div style={{display:"flex",gap:8,marginBottom:13,flexWrap:"wrap",alignItems:"center"}}>
              <input style={{...S.input,maxWidth:200}} placeholder="🔍 ابحث..." value={empSearch} onChange={e=>setEmpSearch(e.target.value)}/>
              <select style={S.select} value={empDept} onChange={e=>setEmpDept(e.target.value)}>{depts.map(d=><option key={d}>{d}</option>)}</select>
              <span style={{color:"#64748b",fontSize:12,marginRight:"auto"}}>{filtered.length} موظف</span>
              <button style={S.btn("#217346")} onClick={()=>{setModalEmp({name:"",title:"موظف",dept:DEPT_LIST[0],city:"دمشق",gap:0,priority:"منخفض",needs:Object.fromEntries(DOMAINS.map(d=>[d,"-"]))});setModalMode("new");}}>+ إضافة</button>
            </div>
            <div style={{overflowX:"auto",borderRadius:12,border:"1px solid #334155"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr style={{background:"#1B3A6B"}}>{["#","الاسم","الإدارة","المسمى","الفجوة","الأولوية","المجالات",""].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {filtered.map((e,i)=>{
                    const n=DOMAINS.filter(d=>e.needs?.[d]&&e.needs[d]!=="-").length;const{bg,fg}=pc(e.priority);
                    return(
                      <tr key={e.id} style={{background:i%2===0?"#0f172a":"#1e293b"}}>
                        <td style={S.td}><span style={{color:"#64748b"}}>{i+1}</span></td>
                        <td style={S.td}><span style={{fontWeight:700}}>{e.name}</span></td>
                        <td style={S.td}><span style={{color:"#94a3b8"}}>{e.dept}</span></td>
                        <td style={S.td}><span style={S.badge(bg,fg)}>{e.title}</span></td>
                        <td style={S.td}><span style={{fontWeight:900,color:gc(e.gap||0)}}>{(e.gap||0).toFixed(2)}</span></td>
                        <td style={S.td}><span style={S.badge(bg,fg)}>{e.priority}</span></td>
                        <td style={S.td}><span style={{fontWeight:700,color:"#3b82f6"}}>{n}</span></td>
                        <td style={S.td}><div style={{display:"flex",gap:4}}>
                          <button style={S.btn("#1B3A6B","#fff","4px 8px")} onClick={()=>{setModalEmp(e);setModalMode("view");}}>عرض</button>
                          <button style={S.btn("#C8973A","#fff","4px 8px")} onClick={()=>{setModalEmp({...e});setModalMode("edit");}}>تعديل</button>
                          {role==="admin"&&<button style={S.btn("#7f1d1d","#fca5a5","4px 8px")} onClick={()=>setDeleteConfirm(e.id)}>حذف</button>}
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
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(265px,1fr))",gap:11}}>
            {sortedDoms.map(dom=>{
              const p=PROGRAMS[dom],st=programs[dom]?.status||"مخطط",stc={مخطط:"#64748b",جارٍ:"#f59e0b",منجز:"#22c55e",ملغى:"#ef4444"}[st];
              const parts=employees.filter(e=>e.needs?.[dom]&&e.needs[dom]!=="-");
              const present=parts.filter(e=>attendance.find(a=>a.employee_id===e.id&&a.domain===dom&&a.status==="حاضر")).length;
              const isOpen=trackDomain===dom;
              return(
                <div key={dom} style={{...S.card,borderRight:`4px solid ${p?.color||"#334155"}`,cursor:"pointer"}} onClick={()=>setTrackDomain(isOpen?null:dom)}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:7}}>
                    <div><div style={{fontWeight:800,fontSize:13}}>{dom}</div><div style={{fontSize:10,color:"#64748b",marginTop:2}}>يبدأ {p?.start}</div></div>
                    <select style={{...S.select,fontSize:10,padding:"3px 6px",color:stc,border:`1px solid ${stc}`,background:"transparent"}} value={st} onChange={e=>{e.stopPropagation();setStatus(dom,e.target.value);}} onClick={e=>e.stopPropagation()}>
                      {["مخطط","جارٍ","منجز","ملغى"].map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div style={{display:"flex",gap:6,marginBottom:6}}>
                    {[{l:"مشارك",v:parts.length,c:"#3b82f6"},{l:"حضر",v:present,c:"#22c55e"},{l:"يوم",v:p?.days||0,c:"#a78bfa"}].map(s=>(
                      <div key={s.l} style={{flex:1,background:"#0f172a",borderRadius:5,padding:5,textAlign:"center"}}><div style={{fontWeight:900,color:s.c,fontSize:13}}>{s.v}</div><div style={{fontSize:9,color:"#64748b"}}>{s.l}</div></div>
                    ))}
                  </div>
                  <div style={{height:4,background:"#334155",borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${parts.length>0?present/parts.length*100:0}%`,background:"#22c55e",borderRadius:2}}/></div>
                  {isOpen&&parts.length>0&&(
                    <div style={{marginTop:9,borderTop:"1px solid #334155",paddingTop:8}} onClick={e=>e.stopPropagation()}>
                      <div style={{fontSize:10,fontWeight:700,color:"#C8973A",marginBottom:5}}>كشف الحضور</div>
                      <div style={{maxHeight:180,overflowY:"auto"}}>
                        {parts.map(e=>{
                          const av=attendance.find(a=>a.employee_id===e.id&&a.domain===dom)?.status||"غائب";
                          return(
                            <div key={e.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0",borderBottom:"1px solid #0f172a",fontSize:11}}>
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
            <div style={{display:"flex",gap:6,marginBottom:13,flexWrap:"wrap"}}>
              {sortedDoms.map(d=><button key={d} onClick={()=>setEvalDomain(d===evalDomain?null:d)} style={S.btn(evalDomain===d?"#C8973A":"#1e293b",evalDomain===d?"#fff":"#64748b","6px 11px")}>{d}</button>)}
            </div>
            {evalDomain&&(
              <div style={{overflowX:"auto",borderRadius:12,border:"1px solid #334155"}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead><tr style={{background:"#1B3A6B"}}>{["الموظف","الإدارة","الحضور","التقييم","ملاحظات","شهادة"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {employees.filter(e=>e.needs?.[evalDomain]&&e.needs[evalDomain]!=="-").map((e,i)=>{
                      const ev=evaluations.find(v=>v.employee_id===e.id&&v.domain===evalDomain);
                      const av=attendance.find(a=>a.employee_id===e.id&&a.domain===evalDomain);
                      const cert=certs.find(c=>c.employee_id===e.id&&c.domain===evalDomain);
                      return(
                        <tr key={e.id} style={{background:i%2===0?"#0f172a":"#1e293b"}}>
                          <td style={S.td}><span style={{fontWeight:700}}>{e.name}</span></td>
                          <td style={S.td}><span style={{color:"#94a3b8"}}>{e.dept}</span></td>
                          <td style={S.td}><span style={{color:av?.status==="حاضر"?"#22c55e":av?.status==="معذور"?"#f59e0b":"#ef4444",fontWeight:700}}>{av?.status||"غائب"}</span></td>
                          <td style={S.td}><div style={{display:"flex",gap:3}}>{[1,2,3,4,5].map(n=><button key={n} onClick={()=>setEvalVal(e.id,evalDomain,"score",n)} style={{width:22,height:22,borderRadius:4,border:"none",cursor:"pointer",fontWeight:700,fontSize:10,background:(ev?.score||0)>=n?"#C8973A":"#334155",color:(ev?.score||0)>=n?"#fff":"#64748b"}}>{n}</button>)}</div></td>
                          <td style={S.td}><input style={{...S.input,padding:"3px 7px",fontSize:10,width:110}} value={ev?.note||""} onChange={ev2=>setEvalVal(e.id,evalDomain,"note",ev2.target.value)} placeholder="ملاحظة..."/></td>
                          <td style={S.td}>
                            {cert?<span style={{...S.badge("#1e293b","#C8973A"),border:"1px solid #C8973A",fontSize:10}}>✅ صدرت</span>
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
            {!evalDomain&&<EmptyState icon="⭐" text="اختر برنامجاً"/>}
          </div>
        )}

        {tab==="certificates"&&(
          <div>
            <div style={{...S.card,marginBottom:12}}><div style={S.secTitle}>الشهادات — {certs.length}</div></div>
            {certs.length===0?<EmptyState icon="🏆" text="لا توجد شهادات بعد"/>:(
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(275px,1fr))",gap:11}}>
                {certs.map(cert=>{const emp=employees.find(e=>e.id===cert.employee_id);return(
                  <div key={cert.id} style={{...S.card,background:"linear-gradient(135deg,#1e293b,#0f172a)",borderColor:"#C8973A"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div><div style={{fontSize:10,color:"#64748b",marginBottom:3}}>شهادة إتمام</div><div style={{fontWeight:900,fontSize:13,color:"#C8973A"}}>{cert.domain}</div><div style={{fontWeight:700,marginTop:2}}>{emp?.name}</div><div style={{fontSize:10,color:"#94a3b8"}}>{emp?.dept}</div></div>
                      <div style={{fontSize:30}}>📜</div>
                    </div>
                    <div style={{marginTop:9,borderTop:"1px solid #334155",paddingTop:8,display:"flex",justifyContent:"space-between",fontSize:10,color:"#64748b"}}>
                      <span>{cert.cert_number}</span><span>{new Date(cert.issued_at).toLocaleDateString("ar-SY")}</span>
                    </div>
                  </div>
                );})}
              </div>
            )}
          </div>
        )}

        {tab==="budget"&&(
          <div>
            <div style={{...S.card,marginBottom:12,display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
              <div><div style={{fontSize:10,color:"#64748b",marginBottom:2}}>معدل اليوم ($)</div><div style={{fontSize:22,fontWeight:900,color:"#C8973A"}}>${rate}</div></div>
              <input type="range" min={10} max={150} value={rate} onChange={e=>setRate(+e.target.value)} style={{flex:1,minWidth:150,accentColor:"#C8973A",cursor:"pointer"}}/>
              <div style={{background:"linear-gradient(135deg,#1B3A6B,#0f172a)",padding:"10px 18px",borderRadius:9,fontWeight:900,color:"#C8973A"}}>المجموع: ${totalBudget.toLocaleString()}</div>
            </div>
            <div style={{overflowX:"auto",borderRadius:12,border:"1px solid #334155"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr style={{background:"#1B3A6B"}}>{["البرنامج","تاريخ البداية","المشاركون","الأيام","الميزانية","الحالة","%"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {sortedDoms.map((dom,i)=>{
                    const c=employees.filter(e=>e.needs?.[dom]&&e.needs[dom]!=="-").length,p=PROGRAMS[dom],b=c*(p?.days||0)*rate;
                    const pct=totalBudget>0?(b/totalBudget*100).toFixed(1):0;
                    const st=programs[dom]?.status||"مخطط",stc={منجز:"#22c55e",جارٍ:"#f59e0b",ملغى:"#ef4444",مخطط:"#64748b"}[st];
                    return(
                      <tr key={dom} style={{background:i%2===0?"#0f172a":"#1e293b"}}>
                        <td style={S.td}><span style={{fontWeight:700}}>{dom}</span></td>
                        <td style={S.td}><span style={{color:"#94a3b8"}}>{p?.start}</span></td>
                        <td style={S.td}><span style={{fontWeight:900,color:"#3b82f6"}}>{c}</span></td>
                        <td style={S.td}><span style={{color:"#a78bfa"}}>{p?.days}</span></td>
                        <td style={S.td}><span style={{fontWeight:900,color:"#22c55e"}}>${b.toLocaleString()}</span></td>
                        <td style={S.td}><span style={{color:stc,fontWeight:700}}>{st}</span></td>
                        <td style={S.td}><div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:44,height:4,background:"#334155",borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:"#C8973A",borderRadius:2}}/></div><span style={{fontSize:10,color:"#64748b"}}>{pct}%</span></div></td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot><tr style={{background:"#1B3A6B",fontWeight:900}}>
                  <td colSpan={2} style={{padding:"10px 12px",color:"#C8973A"}}>الإجمالي</td>
                  <td style={{padding:"10px 12px",color:"#3b82f6"}}>{sortedDoms.reduce((s,d)=>s+employees.filter(e=>e.needs?.[d]&&e.needs[d]!=="-").length,0)}</td>
                  <td style={{padding:"10px 12px",color:"#a78bfa"}}>{sortedDoms.reduce((s,d)=>s+(PROGRAMS[d]?.days||0),0)}</td>
                  <td style={{padding:"10px 12px",color:"#22c55e",fontSize:14}}>${totalBudget.toLocaleString()}</td>
                  <td colSpan={2}></td>
                </tr></tfoot>
              </table>
            </div>
          </div>
        )}

        {tab==="audit"&&role==="admin"&&(
          <div>
            <div style={{...S.card,marginBottom:12}}><div style={S.secTitle}>سجل التغييرات — {auditLog.length}</div></div>
            <div style={{overflowX:"auto",borderRadius:12,border:"1px solid #334155"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr style={{background:"#1B3A6B"}}>{["التاريخ","المستخدم","العملية","الجدول","التفاصيل"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {auditLog.map((log,i)=>{
                    const ac=log.action.includes("حذف")?"#ef4444":log.action.includes("إضافة")?"#22c55e":"#C8973A";
                    return(
                      <tr key={log.id} style={{background:i%2===0?"#0f172a":"#1e293b"}}>
                        <td style={S.td}><span style={{fontSize:10,color:"#64748b"}}>{new Date(log.created_at).toLocaleString("ar-SY")}</span></td>
                        <td style={S.td}><span style={{fontSize:11,color:"#94a3b8"}}>{log.user_email}</span></td>
                        <td style={S.td}><span style={{color:ac,fontWeight:700}}>{log.action}</span></td>
                        <td style={S.td}><span style={{color:"#64748b"}}>{log.table_name}</span></td>
                        <td style={S.td}><span style={{fontSize:10,color:"#64748b"}}>{log.new_data?JSON.stringify(log.new_data).substring(0,50)+"...":"—"}</span></td>
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
              <button style={S.btn("#217346")} onClick={()=>setUserModal(true)}>+ إضافة مستخدم</button>
            </div>
            <div style={S.card}>
              <div style={{fontWeight:700,color:"#C8973A",marginBottom:10}}>الأدوار والصلاحيات</div>
              {[["admin","مدير النظام","كل الصلاحيات + سجل التغييرات + إصدار شهادات","#ef4444"],["manager","مدير إدارة","يرى ويعدل إدارته فقط + تحليل + تصدير تقارير","#f59e0b"],["staff","موظف القسم","إضافة وتعديل جميع الموظفين","#3b82f6"],["employee","موظف","يرى بياناته + يقيّم + يعدل احتياجاته","#22c55e"]].map(([r,n,d,c])=>(
                <div key={r} style={{display:"flex",gap:10,padding:"9px 0",borderBottom:"1px solid #1e293b",alignItems:"center"}}>
                  <span style={S.badge(c+"22",c)}>{r}</span>
                  <div><div style={{fontWeight:700,fontSize:12}}>{n}</div><div style={{fontSize:11,color:"#64748b"}}>{d}</div></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {modalEmp&&(
        <div style={S.modal} onClick={()=>setModalEmp(null)}>
          <div style={S.modalBox} onClick={e=>e.stopPropagation()}>
            <div style={{padding:"14px 18px",borderBottom:"1px solid #334155",fontWeight:900,display:"flex",justifyContent:"space-between",position:"sticky",top:0,background:"#1e293b",borderRadius:"14px 14px 0 0"}}>
              {modalMode==="new"?"➕ إضافة موظف":modalMode==="edit"?`✏️ ${modalEmp.name}`:`👤 ${modalEmp.name}`}
              <button style={S.btn("#334155","#94a3b8","3px 9px")} onClick={()=>setModalEmp(null)}>✕</button>
            </div>
            <div style={{padding:18}}>{modalMode==="view"?<EmpViewPanel emp={modalEmp} rate={rate}/>:<EmpFormPanel emp={modalEmp} onChange={setModalEmp} onSave={saveEmployee} onCancel={()=>setModalEmp(null)}/>}</div>
          </div>
        </div>
      )}
      {deleteConfirm&&(
        <div style={S.modal} onClick={()=>setDeleteConfirm(null)}>
          <div style={{...S.modalBox,maxWidth:320,textAlign:"center",padding:32}} onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:36,marginBottom:10}}>⚠️</div>
            <div style={{fontWeight:800,marginBottom:6}}>حذف الموظف نهائياً؟</div>
            <div style={{color:"#94a3b8",fontSize:12,marginBottom:20}}>لا يمكن التراجع</div>
            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              <button style={S.btn("#334155","#94a3b8")} onClick={()=>setDeleteConfirm(null)}>إلغاء</button>
              <button style={S.btn("#7f1d1d","#fca5a5")} onClick={()=>deleteEmployee(deleteConfirm)}>حذف</button>
            </div>
          </div>
        </div>
      )}
      {userModal&&(
        <div style={S.modal} onClick={()=>setUserModal(false)}>
          <div style={S.modalBox} onClick={e=>e.stopPropagation()}>
            <div style={{padding:"14px 18px",borderBottom:"1px solid #334155",fontWeight:900,display:"flex",justifyContent:"space-between"}}>
              ➕ إضافة مستخدم <button style={S.btn("#334155","#94a3b8","3px 9px")} onClick={()=>setUserModal(false)}>✕</button>
            </div>
            <div style={{padding:18}}><AddUserForm employees={employees} user={user} onDone={()=>{setUserModal(false);showToast("تم ✅");}}/></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════
export default function App(){
  const [user,setUser]=useState(null);
  const [role,setRole]=useState(null);
  const [managerDept,setManagerDept]=useState(null);
  const [loading,setLoading]=useState(true);

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
  if(role==="manager")return<ManagerPortal user={user} managerDept={managerDept} onLogout={handleLogout}/>;
  return<AdminDashboard user={user} role={role} onLogout={handleLogout}/>;
}
