
/* 数据：作品库（评分四维：Design/Usability/Creativity/Content） */
const PROJECTS=[
 {id:"neon-district",title:"霓虹街区 Neon District",cat:"交互",award:"SOTD",tech:"WebGL",year:"2026",
  desc:"赛博朋克风格的空间化导航原型，滚动即漫游。",
  scores:{design:9.2,usability:8.4,creativity:9.6,content:8.8}},
 {id:"type-lab",title:"字体实验室 Type Lab",cat:"视觉",award:"HM",tech:"CSS",year:"2026",
  desc:"可变字体与排版节奏的可视化练习。",
  scores:{design:9.0,usability:8.8,creativity:8.2,content:9.1}},
 {id:"pulse-audio",title:"脉搏音频 Pulse Audio",cat:"交互",award:"SOTD",tech:"GSAP",year:"2025",
  desc:"声音可视化卡片墙，强调即时状态反馈。",
  scores:{design:8.6,usability:9.3,creativity:8.8,content:8.4}},
 {id:"paper-grid",title:"纸面网格 Paper Grid",cat:"品牌",award:"提名",tech:"CSS",year:"2025",
  desc:"以留白与栅格为核心的品牌官网改版。",
  scores:{design:8.2,usability:9.0,creativity:7.9,content:8.6}},
 {id:"orbit-3d",title:"轨道三维 Orbit 3D",cat:"三维",award:"HM",tech:"WebGL",year:"2026",
  desc:"WebGL 粒子环与光标物理反馈实验。",
  scores:{design:9.4,usability:7.8,creativity:9.8,content:8.2}},
 {id:"flow-notes",title:"流注 Flow Notes",cat:"视觉",award:"提名",tech:"GSAP",year:"2024",
  desc:"瀑布流笔记与 micro-motion 动效集。",
  scores:{design:8.8,usability:8.6,creativity:8.4,content:9.0}},
];

/* 导航：滚动收缩 + 主题切换 + 移动菜单 */
const nav=document.querySelector(".nav");
addEventListener("scroll",()=>nav&&nav.classList.toggle("shrink",scrollY>40),{passive:true});
const themeBtn=document.getElementById("themeBtn");
const apply=t=>{document.body.classList.toggle("dark",t==="dark");localStorage.setItem("site-theme",t);
  themeBtn&&(themeBtn.textContent=t==="dark"?"☀️ 浅色":"🌙 深色");};
apply(localStorage.getItem("site-theme")||"light");
themeBtn&&themeBtn.addEventListener("click",()=>apply(document.body.classList.contains("dark")?"light":"dark"));
document.getElementById("burger")?.addEventListener("click",()=>alert("移动端菜单：可展开为抽屉式导航（预留）"));

/* 首页：渲染 + 多维交叉筛选 + 平滑重排 */
const grid=document.getElementById("grid");
function cardHTML(p){
  const s=p.scores, bar=(k,v)=>`<div class="score"><div class="lb"><span>${k}</span><span>${v.toFixed(1)}</span></div>
    <div class="bar"><i style="--w:${v*10}%"></i></div></div>`;
  const avg=((s.design+s.usability+s.creativity+s.content)/4).toFixed(1);
  return `<a class="card" href="detail.html?id=${p.id}">
    <span class="thumb"><span class="view">查看案例 →</span></span>
    <div class="body">
      <h3 class="title">${p.title}</h3>
      <div class="meta">
        <span class="tag ${p.award==='SOTD'?'sotd':''}">${p.award}</span>
        <span class="tag">${p.cat}</span><span class="tag">${p.tech}</span><span class="tag">${p.year}</span>
        <span class="tag">均分 ${avg}</span>
      </div>
      <div class="scores">${bar("Design",s.design)}${bar("Usability",s.usability)}${bar("Creativity",s.creativity)}${bar("Content",s.content)}</div>
    </div></a>`;
}
function render(list){
  grid.innerHTML=list.map(cardHTML).join("");
  requestAnimationFrame(()=>document.querySelectorAll(".card").forEach((c,i)=>setTimeout(()=>c.classList.add("show"),i*70)));
  const c=document.getElementById("count"); c&&(c.textContent=`${list.length} 个作品`);
}
const state={award:"全部",cat:"全部",tech:"全部"};
function applyFilter(){
  render(PROJECTS.filter(p=>(state.award==="全部"||p.award===state.award)
    &&(state.cat==="全部"||p.cat===state.cat)&&(state.tech==="全部"||p.tech===state.tech)));
}
document.querySelectorAll(".fgroup").forEach(g=>{
  const key=g.dataset.key;
  g.addEventListener("click",e=>{
    const b=e.target.closest(".chip"); if(!b) return;
    g.querySelectorAll(".chip").forEach(x=>x.classList.remove("on")); b.classList.add("on");
    state[key]=b.dataset.v; applyFilter();
  });
});
if(grid){render(PROJECTS);}

/* 详情页：按 ?id= 渲染 */
const d=document.getElementById("detail");
if(d){
  const id=new URLSearchParams(location.search).get("id");
  const p=PROJECTS.find(x=>x.id===id)||PROJECTS[0];
  document.getElementById("dtitle").textContent=p.title;
  document.getElementById("ddesc").textContent=p.desc;
  document.getElementById("davg").textContent=((p.scores.design+p.scores.usability+p.scores.creativity+p.scores.content)/4).toFixed(1);
  const kv=document.getElementById("dkv");
  kv.innerHTML=`<dt>奖项</dt><dd>${p.award}</dd><dt>类别</dt><dd>${p.cat}</dd>
    <dt>技术栈</dt><dd>${p.tech}</dd><dt>年份</dt><dd>${p.year}</dd>`;
  document.getElementById("dlink").href=`board.html?ref=${p.id}`;
}

/* 留言板：本地预留（localStorage），并标注后端 API 接入点 */
const form=document.getElementById("msgForm");
const listEl=document.getElementById("msgList");
const KEY="board-messages-v1";
const load=()=>JSON.parse(localStorage.getItem(KEY)||"[]");
function paint(){
  const arr=load();
  listEl.innerHTML=arr.length?arr.map(m=>`<div class="msg">
    <div class="who"><b>${m.name}</b><span>${m.time}</span></div><div>${m.text}</div></div>`).join("")
    :`<div class="empty">暂无留言。来抢沙发～（当前为本地预留，接入后端后将同步保存）</div>`;
}
form&&paint();
form?.addEventListener("submit",e=>{
  e.preventDefault();
  const name=document.getElementById("mname").value.trim();
  const text=document.getElementById("mtext").value.trim();
  const err=document.getElementById("merr");
  if(!name||!text){err.textContent="请填写昵称与留言内容。";return}
  if(text.length>200){err.textContent="留言请控制在 200 字内。";return}
  err.textContent="";
  const arr=load();
  arr.unshift({name,text,time:new Date().toLocaleString("zh-CN")});
  localStorage.setItem(KEY,JSON.stringify(arr.slice(0,50))); // 预留：接入后端后改为 POST /api/messages
  form.reset(); paint();
  document.getElementById("charCount").textContent="0/200";
});
document.getElementById("mtext")?.addEventListener("input",e=>{
  document.getElementById("charCount").textContent=e.target.value.length+"/200";
});
document.getElementById("clearMsg")?.addEventListener("click",()=>{
  localStorage.removeItem(KEY); paint();
});
