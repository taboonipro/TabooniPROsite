/* =========================================================
   طابوني برو — التعديل المباشر على الموقع (للأدمن فقط)
   الدخول: taboonipro.com/?edit
   كمبيوتر: Ctrl (أو ⌘ بالماك) + كبسة على أي نص أو صورة
   تلفون: زر «تعديل باللمس» وبعدها كبسة على أي اشي
   الحماية الحقيقية: Supabase RLS — بدون حساب أدمن ما بينحفظ اشي.
   ========================================================= */
(function(){
'use strict';
const C=window.TABOONI_CONFIG||{};
const BUCKET='site-images';
let sb=null, RAW=null, tap=false, act=null, busyOn=false;

/* ---------------- CSS ---------------- */
const css=`
.ie-ui{font-family:Cairo,system-ui,Arial,sans-serif;direction:rtl}
.ie-dock{position:fixed;z-index:90;left:12px;top:calc(76px + env(safe-area-inset-top,0px));display:flex;flex-direction:column;gap:6px;align-items:flex-start}
.ie-pill{display:flex;align-items:center;gap:8px;background:#1b1611f2;border:1px solid #8a6a3a;color:#f8f5ef;border-radius:14px;padding:6px 8px 6px 12px;box-shadow:0 10px 30px #000a;font-size:13px;font-weight:800;backdrop-filter:blur(10px)}
.ie-pill .dot{width:9px;height:9px;border-radius:50%;background:#3fdc79;box-shadow:0 0 0 4px #3fdc7933}
.ie-b{border:1px solid #5a432c;background:#2a2119;color:#f8f5ef;border-radius:10px;padding:7px 11px;font-weight:800;font-size:12.5px;cursor:pointer;font-family:inherit}
.ie-b.on{background:#e4af55;color:#1b1209;border-color:#e4af55}
.ie-b.gold{background:linear-gradient(135deg,#f4cb7d,#d89e45);color:#211508;border:0}
.ie-b.red{background:#3a1714;border-color:#7a2b24;color:#ffb3aa}
.ie-b.big{padding:11px 16px;font-size:14.5px;border-radius:12px}
.ie-menu{display:none;flex-direction:column;gap:6px}
.ie-dock.open .ie-menu{display:flex}
.ie-tip{background:#1b1611f2;border:1px solid #4a3c2b;color:#d8cbb9;border-radius:12px;padding:8px 10px;font-size:12px;line-height:1.7;max-width:250px}
body.ie-hint [data-edit],body.ie-tap [data-edit]{outline:2px dashed #e4af55b0!important;outline-offset:2px;cursor:text!important}
body.ie-hint [data-edit-img],body.ie-tap [data-edit-img]{outline:2px dashed #5aa9ffb0!important;outline-offset:-3px;cursor:copy!important}
body.ie-hint :is(h1,h2,h3,h4,p,span,b,small,a,button,label,summary,i,em,strong,li):hover,body.ie-tap :is(h1,h2,h3,h4,p,span,b,small,a,button,label,summary,em,strong,li):hover{outline:1px solid #ffffff70;outline-offset:1px}
body.ie-hint *,body.ie-tap *{cursor:pointer}
.ie-editing{outline:2px solid #3fdc79!important;outline-offset:3px;background:#0c0b09cc!important;border-radius:6px;min-width:40px;caret-color:#3fdc79;-webkit-line-clamp:unset!important;display:block;overflow:visible!important;white-space:pre-wrap}
.ie-bar{position:fixed;z-index:95;left:50%;transform:translateX(-50%);bottom:calc(84px + env(safe-area-inset-bottom,0px));display:flex;gap:8px;align-items:center;background:#14110ef5;border:1px solid #3e6b45;border-radius:16px;padding:8px;box-shadow:0 14px 40px #000c;max-width:calc(100vw - 20px);flex-wrap:wrap;justify-content:center}
.ie-bar small{color:#a99d8e;font-size:11.5px;padding:0 4px}
.ie-scrim{position:fixed;inset:0;z-index:96;background:#000b;display:flex;align-items:flex-end;justify-content:center}
.ie-sheet{background:#1a1611;border:1px solid #4d3a26;border-radius:22px 22px 0 0;width:min(620px,100%);max-height:88vh;overflow:auto;padding:16px 16px calc(16px + env(safe-area-inset-bottom,0px));color:#f8f5ef}
.ie-sheet h3{margin:0 0 10px;font-size:17px}
.ie-sheet p{color:#a99d8e;font-size:12.5px;line-height:1.8;margin:6px 0}
.ie-sheet input,.ie-sheet textarea{width:100%;border:1px solid #4a3c2b;background:#110f0c;color:#f8f5ef;border-radius:12px;padding:11px 12px;font-size:16px;font-family:inherit;outline:none;box-sizing:border-box}
.ie-sheet textarea{min-height:110px;line-height:1.8;resize:vertical}
.ie-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
.ie-row .ie-b{flex:1}
.ie-prev{border-radius:14px;overflow:hidden;border:1px solid #4a3c2b;background:#0f0d0b;aspect-ratio:4/3;max-height:42vh;margin:0 auto 6px}
.ie-prev img{width:100%;height:100%;object-fit:contain}
.ie-tb{display:flex;flex-wrap:wrap;gap:6px;padding:8px;border:1px solid #4a3c2b;border-bottom:0;border-radius:12px 12px 0 0;background:#1a1612}
.ie-tb button{min-width:38px;height:36px;border-radius:9px;background:#261f18;border:1px solid #3d3124;color:#f8f5ef;font-weight:900;font-family:inherit;cursor:pointer;padding:0 9px}
.ie-rte{min-height:170px;max-height:50vh;overflow:auto;border:1px solid #4a3c2b;border-radius:0 0 12px 12px;background:#110f0c;padding:12px 14px;line-height:1.95;font-size:15.5px;outline:none}
.ie-rte p{margin:0 0 8px}.ie-rte ul,.ie-rte ol{padding-inline-start:22px}
.ie-toast{position:fixed;z-index:99;top:calc(14px + env(safe-area-inset-top,0px));left:50%;transform:translateX(-50%);background:#1f2a1f;border:1px solid #3e6b45;color:#d6f5dc;padding:10px 16px;border-radius:13px;font-weight:800;font-size:13.5px;box-shadow:0 10px 30px #000a;max-width:92vw;text-align:center}
.ie-toast.bad{background:#2a1513;border-color:#6b2a24;color:#ffc1ba}
.ie-busy{position:fixed;inset:0;z-index:99;background:#0008;display:grid;place-items:center;color:#fff;font-weight:800}
.ie-list{display:grid;gap:8px;margin-top:8px}
.ie-list div{display:flex;gap:8px;align-items:center;background:#110f0c;border:1px solid #3a2e20;border-radius:12px;padding:8px 10px;font-size:13.5px}
.ie-list div span{flex:1}
@media(max-width:760px){.ie-dock{top:auto;bottom:calc(84px + env(safe-area-inset-bottom,0px));left:10px}.ie-bar{bottom:calc(150px + env(safe-area-inset-bottom,0px))}}
`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

/* ---------------- helpers ---------------- */
const h=(html)=>{const t=document.createElement('template');t.innerHTML=html.trim();return t.content.firstElementChild};
const E=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let tT;function msg(t,bad){let el=document.querySelector('.ie-toast');if(!el){el=h('<div class="ie-toast ie-ui" role="status"></div>');document.body.appendChild(el)}
  el.textContent=t;el.classList.toggle('bad',!!bad);el.style.display='';clearTimeout(tT);tT=setTimeout(()=>el.style.display='none',bad?4500:2200)}
function busy(on,t){let el=document.querySelector('.ie-busy');if(on){if(!el){el=h('<div class="ie-busy ie-ui"></div>');document.body.appendChild(el)}el.textContent=t||'لحظة...';busyOn=true}else{el&&el.remove();busyOn=false}}
function err(e){const m=(e&&(e.message||e.error_description))||String(e);
  if(/row-level security|permission denied/i.test(m))return 'ما في صلاحية — الحساب مش أدمن';
  if(/Failed to fetch|NetworkError/i.test(m))return 'ما في اتصال بالإنترنت';return m}
function sheet(inner){closeSheet();const s=h(`<div class="ie-scrim ie-ui"><div class="ie-sheet">${inner}</div></div>`);
  s.addEventListener('click',e=>{if(e.target===s)closeSheet()});document.body.appendChild(s);return s.firstElementChild}
function closeSheet(){document.querySelectorAll('.ie-scrim').forEach(x=>x.remove())}
const num=v=>{const n=parseFloat(String(v).replace(/[^\d.]/g,''));return isNaN(n)?null:n};

/* ---------------- boot ---------------- */
if(!C.supabaseUrl||!C.supabaseAnonKey){document.addEventListener('DOMContentLoaded',()=>{});msg('وضع التعديل: الربط مع Supabase مش جاهز (config.js)',true);return}
const sc=document.createElement('script');
sc.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js';
sc.onload=boot;sc.onerror=()=>msg('ما قدرت أحمّل أداة التعديل — افحص الإنترنت',true);
document.head.appendChild(sc);

async function boot(){
  sb=window.supabase.createClient(C.supabaseUrl,C.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true}});
  const {data:{session}}=await sb.auth.getSession();
  if(!session) return loginSheet();
  await verify();
}
function loginSheet(m){
  const s=sheet(`<h3>✎ دخول لوضع التعديل</h3><p>نفس حساب لوحة الإدارة.</p>
    <input id="ieU" placeholder="اسم المستخدم" dir="ltr" autocapitalize="none" value="ayman" autocomplete="username">
    <input id="ieP" type="password" placeholder="كلمة السر" dir="ltr" style="margin-top:8px" autocomplete="current-password">
    <p id="ieE" style="color:#ffb3aa">${E(m||'')}</p>
    <div class="ie-row"><button class="ie-b gold big" id="ieGo">دخول</button><button class="ie-b big" id="ieX">إلغاء</button></div>`);
  s.querySelector('#ieX').onclick=()=>{exitEdit()};
  const go=async()=>{const u=s.querySelector('#ieU').value.trim(),p=s.querySelector('#ieP').value;if(!u||!p)return;
    busy(true,'دخول...');const {error}=await sb.auth.signInWithPassword({email:u.includes('@')?u:u+(C.loginDomain||''),password:p});busy(false);
    if(error){s.querySelector('#ieE').textContent=/invalid/i.test(error.message)?'اسم المستخدم أو كلمة السر غلط':err(error);return}
    closeSheet();verify()};
  s.querySelector('#ieGo').onclick=go;s.querySelector('#ieP').onkeydown=e=>{if(e.key==='Enter')go()};
  setTimeout(()=>s.querySelector('#ieP').focus(),50);
}
async function verify(){
  busy(true,'تحميل...');
  const {data:ok,error}=await sb.rpc('is_site_admin');
  if(error||!ok){busy(false);await sb.auth.signOut();return loginSheet(error?'قاعدة البيانات مش جاهزة (setup.sql)':'هذا الحساب مش أدمن')}
  try{await loadRaw()}catch(e){busy(false);return msg(err(e),true)}
  busy(false);dock();bind();publish();
  msg('✓ وضع التعديل شغّال — Ctrl + كبسة على أي اشي');
}
async function loadRaw(){
  const [p,f,s]=await Promise.all([sb.from('site_products').select('*').order('sort'),sb.from('site_faqs').select('*').order('sort'),sb.from('site_settings').select('data').eq('id',1).maybeSingle()]);
  for(const r of [p,f,s]) if(r.error) throw r.error;
  if(!p.data.length) throw new Error('قاعدة البيانات فاضية — شغّل setup.sql');
  RAW={products:p.data,faqs:f.data,settings:{...((window.TABOONI_DEFAULTS||{}).settings||{}),...((s.data&&s.data.data)||{})}};
  RAW.settings.ui=RAW.settings.ui&&typeof RAW.settings.ui==='object'?RAW.settings.ui:{};
}
function publish(){
  const d={products:RAW.products,faqs:RAW.faqs,settings:RAW.settings};
  try{store.set('tabooni-data',{products:RAW.products.filter(p=>p.status!=='draft'),faqs:RAW.faqs.filter(f=>f.visible!==false),settings:RAW.settings})}catch(e){}
  const sh=document.querySelector('#sheet');const openId=sh&&sh.classList.contains('on')&&sh.dataset.id;
  applyData(d);
  if(openId){if(byId(openId))openProduct(openId,true);else closeSheet&&window.closeSheet&&window.closeSheet()}
  updDock();
}
function exitEdit(){try{sessionStorage.removeItem('tabooni-edit')}catch(e){}location.href=location.pathname+location.hash}

/* ---------------- dock ---------------- */
let D;
function dock(){
  D=h(`<div class="ie-dock ie-ui">
    <div class="ie-pill"><span class="dot"></span>وضع التعديل<button class="ie-b" id="ieMore">☰</button></div>
    <button class="ie-b" id="ieTap">تعديل باللمس: لا</button>
    <div class="ie-menu">
      <div class="ie-tip"><b>كمبيوتر:</b> اضغط Ctrl (⌘ بالماك) وكبسة على أي نص أو صورة.<br><b>تلفون:</b> شغّل «تعديل باللمس»، كبسة على الاشي، وبعدين طفّيه لتتنقّل.</div>
      <button class="ie-b" id="ieHid">النصوص المخفية</button>
      <a class="ie-b" href="admin.html" target="_blank" rel="noopener" style="text-decoration:none">لوحة الإدارة الكاملة</a>
      <button class="ie-b" id="ieOut">إنهاء وضع التعديل</button>
      <button class="ie-b red" id="ieLogout">خروج من الحساب</button>
    </div></div>`);
  document.body.appendChild(D);
  D.querySelector('#ieMore').onclick=()=>D.classList.toggle('open');
  D.querySelector('#ieTap').onclick=()=>{tap=!tap;document.body.classList.toggle('ie-tap',tap);updDock();msg(tap?'كبسة على أي اشي لتعديله — طفّيه لتتنقّل بالموقع':'تعديل باللمس مطفي')};
  D.querySelector('#ieHid').onclick=hiddenSheet;
  D.querySelector('#ieOut').onclick=exitEdit;
  D.querySelector('#ieLogout').onclick=async()=>{await sb.auth.signOut();exitEdit()};
  updDock();
}
function updDock(){if(!D)return;const b=D.querySelector('#ieTap');b.textContent='تعديل باللمس: '+(tap?'نعم':'لا');b.classList.toggle('on',tap);
  const n=Object.values(RAW.settings.ui||{}).filter(v=>v==='').length;D.querySelector('#ieHid').textContent='النصوص المخفية ('+n+')'}
function hiddenSheet(){
  const hid=Object.entries(RAW.settings.ui||{}).filter(([k,v])=>v==='');
  const ch=Object.entries(RAW.settings.ui||{}).filter(([k,v])=>v!=='');
  const s=sheet(`<h3>النصوص المخفية والمعدّلة</h3>
    <p>هون النصوص الثابتة اللي أخفيتها أو غيّرتها. «رجّع» بترجّع النص الأصلي.</p>
    <div class="ie-list">${hid.length?hid.map(([k])=>`<div><span>🚫 ${E(k)}</span><button class="ie-b" data-k="${E(k)}">رجّع</button></div>`).join(''):'<p>ما في نصوص مخفية.</p>'}</div>
    ${ch.length?`<p style="margin-top:14px">معدّلة:</p><div class="ie-list">${ch.map(([k,v])=>`<div><span>${E(k)} ← <b>${E(v)}</b></span><button class="ie-b" data-k="${E(k)}">رجّع</button></div>`).join('')}</div>`:''}
    <div class="ie-row"><button class="ie-b big" id="ieC">إغلاق</button></div>`);
  s.querySelector('#ieC').onclick=closeSheet;
  s.querySelectorAll('[data-k]').forEach(b=>b.onclick=async()=>{const ui={...RAW.settings.ui};delete ui[b.dataset.k];await saveSettings({ui});hiddenSheet()});
}

/* ---------------- events ---------------- */
function bind(){
  const hint=on=>document.body.classList.toggle('ie-hint',on);
  addEventListener('keydown',e=>{if(e.key==='Control'||e.key==='Meta')hint(true)});
  addEventListener('keyup',e=>{if(e.key==='Control'||e.key==='Meta')hint(false)});
  addEventListener('blur',()=>hint(false));
  const trap=e=>{
    if(busyOn)return;
    const t=e.target;if(!(t instanceof Element))return;
    if(t.closest('.ie-ui'))return;
    if(act&&act.el.contains(t))return;               // جوّا النص اللي عم نعدّله
    if(act&&t.contains(act.el)){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();return} // زر/بطاقة فيها النص (مثلاً مسافة جوّا زر)
    if(!(e.ctrlKey||e.metaKey||tap)){ if(act&&e.type==='click'){finish(true)} return }
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    if(e.type!=='click')return;
    hint(false);
    pick(t);
  };
  addEventListener('click',trap,true);
  addEventListener('mousedown',e=>{const t=e.target;if((e.ctrlKey||e.metaKey)&&t instanceof Element&&!t.closest('.ie-ui')&&!(act&&act.el.contains(t)))e.preventDefault()},true);
  addEventListener('contextmenu',e=>{if(tap&&!(act&&act.el.contains(e.target)))e.preventDefault()},true);
}
function pick(t){
  if(act)finish(true);
  const txt=t.closest('[data-edit]'), img=t.closest('[data-edit-img]');
  if(t.tagName==='IMG'&&img&&(!txt||txt.contains(img)))return imageSheet(img.dataset.editImg);
  if(txt&&(!img||img.contains(txt)))return editData(txt);
  if(img&&(t===img||t.classList.contains('hero2-bg')||!textNodeOf(t)))return imageSheet(img.dataset.editImg);
  return editGeneric(t);
}

/* ---------------- data paths ---------------- */
// product:ID:field[:i[:sub]] | faq:ID:field | settings:key[:i[:sub]]
function parse(key){const a=key.split(':');if(a[0]==='settings')return {kind:'settings',path:a.slice(1)};return {kind:a[0],id:a[1],path:a.slice(2)}}
function rowOf(k){return k.kind==='product'?RAW.products.find(p=>String(p.id)===String(k.id)):k.kind==='faq'?RAW.faqs.find(f=>String(f.id)===String(k.id)):RAW.settings}
function getP(o,path){return path.reduce((x,p)=>x==null?x:x[p],o)}
function setP(o,path,v){let x=o;for(let i=0;i<path.length-1;i++){x=x[path[i]]}x[path[path.length-1]]=v}
const clone=o=>JSON.parse(JSON.stringify(o));

async function saveRow(k,patchFn){
  const row=rowOf(k);if(!row)return msg('ما لقيت العنصر — حدّث الصفحة',true);
  const copy=clone(row);patchFn(copy);
  busy(true,'حفظ...');
  try{
    if(k.kind==='settings'){const {error}=await sb.from('site_settings').upsert({id:1,data:copy,updated_at:new Date().toISOString()});if(error)throw error;RAW.settings=copy}
    else{
      const tbl=k.kind==='product'?'site_products':'site_faqs';
      const top=k.path[0];const patch={[top]:copy[top],updated_at:new Date().toISOString()};
      if(k.kind==='product'&&top==='status')patch.status=copy.status;
      const {data,error}=await sb.from(tbl).update(patch).eq('id',row.id).select().single();if(error)throw error;
      Object.assign(row,data);
    }
    busy(false);publish();msg('✓ انحفظ');return true;
  }catch(e){busy(false);msg('ما انحفظ: '+err(e),true);return false}
}
async function saveSettings(patch){return saveRow({kind:'settings',path:[]},s=>Object.assign(s,patch))}

/* ---------------- text editing (inline) ---------------- */
function editData(el){
  const key=el.dataset.edit,type=el.dataset.type||'',k=parse(key),row=rowOf(k);
  if(!row)return msg('ما لقيت العنصر',true);
  const cur=getP(row,k.path);
  if(type==='rich')return richSheet(k,cur);
  startInline(el,{k,type,cur:cur??'',
    save:async v=>{
      if(type==='num'){const n=num(v);if(n===null&&!(k.path[0]==='compare_at'&&String(v).trim()===''))return msg('اكتب رقم',true);
        return saveRow(k,r=>setP(r,k.path,k.path[0]==='compare_at'&&String(v).trim()===''?null:n))}
      v=String(v).replace(/ /g,' ').trim();
      if(!v&&(k.kind==='faq'||(k.kind==='product'&&k.path[0]==='title')))return msg('ما بصير يكون فاضي — استعمل 🗑',true);
      return saveRow(k,r=>setP(r,k.path,v));
    },
    del:delFor(k)});
}
function delFor(k){
  if(k.kind==='product'){
    if(k.path[0]==='variants')return {label:'🗑 حذف هالحجم',fn:()=>confirm('حذف هالحجم من المنتج؟')&&saveRow(k,r=>r.variants.splice(+k.path[1],1))};
    if(k.path[0]==='compare_at')return {label:'🗑 شيل الخصم',fn:()=>saveRow(k,r=>r.compare_at=null)};
    return {label:'🙈 إخفاء المنتج',fn:()=>confirm('إخفاء المنتج من الموقع؟ (بترجّعه من لوحة الإدارة)')&&saveRow({...k,path:['status']},r=>r.status='draft')};
  }
  if(k.kind==='faq')return {label:'🗑 حذف السؤال',fn:async()=>{if(!confirm('حذف هالسؤال؟'))return;busy(true);const {error}=await sb.from('site_faqs').delete().eq('id',k.id);busy(false);if(error)return msg(err(error),true);RAW.faqs=RAW.faqs.filter(f=>String(f.id)!==String(k.id));publish();msg('✓ انحذف')}};
  if(k.kind==='settings'&&(k.path[0]==='pills'||k.path[0]==='reviews'))return {label:'🗑 حذف',fn:()=>confirm('حذف هالعنصر؟')&&saveRow(k,r=>r[k.path[0]].splice(+k.path[1],1))};
  return {label:'🙈 إخفاء',fn:()=>saveRow(k,r=>setP(r,k.path,''))};
}
function startInline(el,o){
  const multi=o.type==='multi';
  act={el,o,html:el.innerHTML,multi};
  el.classList.add('ie-editing');
  el.textContent=o.type==='num'?(o.cur===null?'':String(o.cur)):String(o.cur);
  try{el.contentEditable='plaintext-only'}catch(e){el.contentEditable='true'}
  if(el.contentEditable!=='plaintext-only')el.contentEditable='true';
  el.spellcheck=false;el.focus();
  const r=document.createRange();r.selectNodeContents(el);const s=getSelection();s.removeAllRanges();s.addRange(r);
  el.onkeydown=e=>{e.stopPropagation();if(e.key==='Escape'){e.preventDefault();finish(false)}else if(e.key==='Enter'&&(!multi||e.ctrlKey||e.metaKey)){e.preventDefault();finish(true)}};
  el.onpaste=e=>{e.preventDefault();document.execCommand('insertText',false,(e.clipboardData||window.clipboardData).getData('text/plain'))};
  const bar=h(`<div class="ie-bar ie-ui"><button class="ie-b gold big" data-a="ok">✓ حفظ</button><button class="ie-b big" data-a="no">✕ إلغاء</button>${o.del?`<button class="ie-b red big" data-a="del">${o.del.label}</button>`:''}<small>${multi?'Ctrl+Enter للحفظ':'Enter للحفظ'} · Esc للإلغاء</small></div>`);
  bar.addEventListener('mousedown',e=>e.preventDefault());
  bar.querySelector('[data-a=ok]').onclick=()=>finish(true);
  bar.querySelector('[data-a=no]').onclick=()=>finish(false);
  if(o.del)bar.querySelector('[data-a=del]').onclick=async()=>{const a=act;finish(false);await a.o.del.fn()};
  document.body.appendChild(bar);act.bar=bar;
}
async function finish(save){
  if(!act)return;const a=act;act=null;
  const v=a.el.innerText;
  a.el.contentEditable='false';a.el.removeAttribute('contenteditable');a.el.classList.remove('ie-editing');a.el.onkeydown=a.el.onpaste=null;a.bar&&a.bar.remove();
  const changed=String(v).trim()!==String(a.o.cur??'').trim();
  if(!save||!changed){a.el.innerHTML=a.html;return}
  const ok=await a.o.save(v);if(!ok&&document.contains(a.el))a.el.innerHTML=a.html;
}

/* ---------------- generic static text ---------------- */
function textNodeOf(el){for(let e=el,d=0;e&&d<4;e=e.parentElement,d++){
  if(e.closest('[data-edit],.ie-ui'))return null;
  const n=[...e.childNodes].find(c=>c.nodeType===3&&c.nodeValue.trim());if(n)return {el:e,node:n}}return null}
function editGeneric(t){
  const f=textNodeOf(t);
  if(!f)return msg('هذا العنصر ما في فيه نص للتعديل',true);
  const cur=f.node.nodeValue.trim();
  if(/₪|\d{2,}/.test(cur)&&!(RAW.settings.ui&&(UIORIG.get(f.node) in RAW.settings.ui)))return msg('هذا رقم محسوب تلقائيًا — عدّل السعر من المنتج نفسه',true);
  const orig=UIORIG.has(f.node)?UIORIG.get(f.node):cur;
  const save=v=>{v=String(v).replace(/ /g,' ').trim();if(!v)return msg('للإخفاء استعمل 🙈',true);const ui={...RAW.settings.ui};if(v===orig)delete ui[orig];else ui[orig]=v;return saveSettings({ui})};
  const del={label:'🙈 إخفاء',fn:()=>{const ui={...RAW.settings.ui,[orig]:''};return saveSettings({ui})}};
  const onlyText=[...f.el.childNodes].every(c=>c.nodeType===3);
  if(onlyText)return startInline(f.el,{type:'',cur,save,del});
  const s=sheet(`<h3>تعديل نص</h3><p>النص الأصلي: «${E(orig)}»</p><input id="ieV" value="${E(cur)}">
    <div class="ie-row"><button class="ie-b gold big" id="ieS">✓ حفظ</button><button class="ie-b red big" id="ieD">🙈 إخفاء</button><button class="ie-b big" id="ieX">إلغاء</button></div>`);
  const i=s.querySelector('#ieV');setTimeout(()=>{i.focus();i.select()},30);
  s.querySelector('#ieS').onclick=async()=>{if(await save(i.value)!==undefined)closeSheet()};
  i.onkeydown=e=>{if(e.key==='Enter')s.querySelector('#ieS').click()};
  s.querySelector('#ieD').onclick=async()=>{closeSheet();await del.fn()};
  s.querySelector('#ieX').onclick=closeSheet;
}

/* ---------------- rich description ---------------- */
function richSheet(k,cur){
  const s=sheet(`<h3>وصف المنتج</h3>
    <div class="ie-tb"><button data-c="bold"><b>B</b></button><button data-c="italic"><i>I</i></button><button data-c="underline"><u>U</u></button>
      <button data-c="insertUnorderedList">• قائمة</button><button data-c="insertOrderedList">1. قائمة</button><button data-c="formatBlock" data-a="H3">عنوان</button><button data-c="formatBlock" data-a="P">نص</button><button data-c="removeFormat">⌫ تنسيق</button></div>
    <div class="ie-rte" contenteditable="true" dir="rtl">${cleanHTML(cur||'')}</div>
    <div class="ie-row"><button class="ie-b gold big" id="ieS">✓ حفظ</button><button class="ie-b big" id="ieX">إلغاء</button></div>`);
  const r=s.querySelector('.ie-rte');
  s.querySelectorAll('.ie-tb button').forEach(b=>{b.onmousedown=e=>e.preventDefault();b.onclick=()=>{r.focus();document.execCommand(b.dataset.c,false,b.dataset.a||null)}});
  r.addEventListener('paste',e=>{e.preventDefault();const d=e.clipboardData,x=d.getData('text/html');if(x)document.execCommand('insertHTML',false,cleanHTML(x));else document.execCommand('insertText',false,d.getData('text/plain'))});
  s.querySelector('#ieX').onclick=closeSheet;
  s.querySelector('#ieS').onclick=async()=>{const v=cleanHTML(r.innerHTML).replace(/<p>(\s|<br>)*<\/p>/g,'');if(await saveRow(k,row=>row.description=v))closeSheet()};
  setTimeout(()=>r.focus(),30);
}

/* ---------------- images ---------------- */
async function compress(file,max=1400,q=.82){
  const url=URL.createObjectURL(file);
  try{const img=await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=()=>rej(new Error('الملف مش صورة مدعومة'));i.src=url});
    const r=Math.min(1,max/Math.max(img.naturalWidth,img.naturalHeight)),c=document.createElement('canvas');
    c.width=Math.round(img.naturalWidth*r);c.height=Math.round(img.naturalHeight*r);
    const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(img,0,0,c.width,c.height);
    return await new Promise((res,rej)=>c.toBlob(b=>b?res(b):rej(new Error('فشل ضغط الصورة')),'image/jpeg',q))}
  finally{URL.revokeObjectURL(url)}
}
async function upload(file){
  const blob=await compress(file),path=`products/${Date.now()}-${Math.random().toString(36).slice(2,8)}.jpg`;
  const {error}=await sb.storage.from(BUCKET).upload(path,blob,{contentType:'image/jpeg',cacheControl:'31536000',upsert:false});
  if(error)throw error;return sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
function chooseFile(){return new Promise(res=>{const i=document.createElement('input');i.type='file';i.accept='image/*';i.onchange=()=>res(i.files&&i.files[0]);i.click()})}
function imageSheet(key){
  const k=parse(key),row=rowOf(k);if(!row)return msg('ما لقيت العنصر',true);
  const isP=k.kind==='product',idx=isP?(+k.path[1]||0):0;
  const imgs=isP?(row.images||[]):null;
  const src=isP?(imgs[idx]&&imgs[idx].src):getP(row,k.path);
  const s=sheet(`<h3>${isP?E(row.title)+' — صورة '+(imgs.length?idx+1+' من '+imgs.length:''):'صورة'}</h3>
    <div class="ie-prev">${src?`<img src="${E(src)}" alt="">`:'<p style="padding:30px;text-align:center">ما في صورة</p>'}</div>
    <div class="ie-row">
      <button class="ie-b gold big" id="ieR">⬆ ${src?'رفع صورة بدلها':'رفع صورة'}</button>
      ${isP?`<button class="ie-b big" id="ieA">➕ إضافة صورة</button>`:''}
      ${isP&&idx>0?`<button class="ie-b big" id="ieM">★ اجعلها رئيسية</button>`:''}
      ${src?`<button class="ie-b red big" id="ieD">🗑 حذف الصورة</button>`:''}
      <button class="ie-b big" id="ieX">إلغاء</button></div>
    <p>الصورة بتنضغط تلقائيًا قبل الرفع، وبتبيّن كاملة بدون قص.</p>`);
  s.querySelector('#ieX').onclick=closeSheet;
  const up=async(fn)=>{const f=await chooseFile();if(!f)return;busy(true,'رفع الصورة...');let u;try{u=await upload(f)}catch(e){busy(false);return msg('فشل الرفع: '+err(e),true)}busy(false);closeSheet();await fn(u)};
  s.querySelector('#ieR').onclick=()=>up(u=>isP?saveRow({...k,path:['images']},r=>{r.images=r.images||[];if(r.images[idx])r.images[idx]={src:u};else r.images.push({src:u})}):saveRow(k,r=>setP(r,k.path,u)));
  if(isP)s.querySelector('#ieA').onclick=()=>up(u=>saveRow({...k,path:['images']},r=>{r.images=r.images||[];r.images.push({src:u})}));
  const m=s.querySelector('#ieM');if(m)m.onclick=async()=>{closeSheet();await saveRow({...k,path:['images']},r=>r.images.unshift(...r.images.splice(idx,1)))};
  const d=s.querySelector('#ieD');if(d)d.onclick=async()=>{if(!confirm('حذف هالصورة؟'))return;closeSheet();
    await (isP?saveRow({...k,path:['images']},r=>r.images.splice(idx,1)):saveRow(k,r=>setP(r,k.path,'')))};
}
})();
