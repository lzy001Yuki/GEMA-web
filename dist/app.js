const means=[['MemoryVLA',27.8],['Long-DP',28.9],['DreamZero',20.3],['GMP',44.2],['GEMA-DreamZero',52.7]];
document.querySelector('#mean-chart').innerHTML=means.map(([name,value])=>`<div class="bar-row ${name==='GEMA-DreamZero'?'best':name==='GMP'?'gmp':''}"><span>${name}</span><div class="bar-track"><div class="bar" style="width:${value}%"></div></div><span class="bar-value">${value.toFixed(1)}%</span></div>`).join('');
const rows=[['Transform','21 ± 4.3',46,'65 ± 5.1',12,'88 ± 1.3'],['Resume','27 ± 2.1',39,'56 ± 3.2',25,'63 ± 5.5'],['FindImposter₃, shape',26,28,35,27,44],['FindImposter₃, color',29,26,41,33,50],['FindImposter₉, shape',20,12,27,10,32],['FindImposter₉, color',22,12,33,18,25],['ChainOfColors₃',18,24,37,5,54],['ChainOfColors₇',12,10,22,0,33],['GatherAndRecall',75,63,82,53,85],['Mean',27.8,28.9,44.2,20.3,52.7]];
document.querySelector('#task-rows').innerHTML=rows.map(row=>'<tr>'+row.map((v,i)=>i===0?`<th scope="row">${v}</th>`:`<td>${v}</td>`).join('')+'</tr>').join('');
const tabs=[...document.querySelectorAll('[role=tab]')];
function selectTab(tab){tabs.forEach(t=>{const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!active;});}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectTab(tab));tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=tabs[(i+1)%tabs.length];if(e.key==='ArrowLeft')next=tabs[(i+tabs.length-1)%tabs.length];if(e.key==='Home')next=tabs[0];if(e.key==='End')next=tabs.at(-1);if(next){e.preventDefault();selectTab(next);next.focus();}});});
const dialog=document.querySelector('#image-dialog'),expanded=document.querySelector('#expanded-image');let opener;
document.querySelectorAll('[data-zoom]').forEach(button=>button.addEventListener('click',()=>{opener=button;expanded.src=button.dataset.zoom;expanded.alt=button.querySelector('img')?.alt||'GEMA architecture from the paper';dialog.showModal();}));
document.querySelector('#close-dialog').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});dialog.addEventListener('close',()=>opener?.focus());

// The animation explains the reference interface; it does not simulate policy execution.
const pipeline=document.querySelector('.pipeline-animation');
if(pipeline){
 const stepButtons=[...pipeline.querySelectorAll('[data-step]')],play=pipeline.querySelector('#pipeline-play');
 let phase=0,paused=matchMedia('(prefers-reduced-motion: reduce)').matches,visible=false,timer;
 function render(){
  pipeline.dataset.phase=String(phase);
  pipeline.querySelectorAll('[data-phase]').forEach(el=>el.classList.toggle('is-active',el.dataset.phase.split(' ').includes(String(phase))));
  stepButtons.forEach((el,i)=>el.setAttribute('aria-pressed',String(i===phase)));
  pipeline.querySelector('.transfer-one').classList.toggle('is-active',phase===0||phase===1);
  pipeline.querySelector('.transfer-two').classList.toggle('is-active',phase===1||phase===2);
  pipeline.querySelector('.feedback-track').classList.toggle('is-active',phase===4);
  pipeline.classList.toggle('is-paused',paused);
  play.textContent=paused?'Play ▷':'Pause Ⅱ';play.setAttribute('aria-pressed',String(paused));
 }
 function schedule(){clearInterval(timer);if(!paused&&visible&&!document.hidden)timer=setInterval(()=>{phase=(phase+1)%5;render()},2700)}
 play.addEventListener('click',()=>{paused=!paused;render();schedule()});
 stepButtons.forEach((button,i)=>button.addEventListener('click',()=>{phase=i;paused=true;render();schedule()}));
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule()},{threshold:.15}).observe(pipeline);
 document.addEventListener('visibilitychange',schedule);render();
}

// Render original piecewise-linear Con-Q values with a policy selector.
const conqContainer=document.querySelector('#conq-charts');
if(conqContainer){
 const families={agent:{label:'Astra',color:'#3477B7'},pi05:{label:'Pi05',color:'#24998A'},dreamzero:{label:'DreamZero',color:'#DF8535'}};
 const policyButtons=[...document.querySelectorAll('[data-policy]')];
 let selectedPolicy='all',curveCharts=[];
 const ns='http://www.w3.org/2000/svg';
 function svgElement(tag,attributes={},content){const el=document.createElementNS(ns,tag);for(const [key,value] of Object.entries(attributes))el.setAttribute(key,String(value));if(content!==undefined)el.textContent=content;return el}
 function drawChart(chart){
  const card=document.createElement('div');card.className='survival-chart';
  const heading=document.createElement('h4');heading.textContent=chart.memory_form[0].toUpperCase()+chart.memory_form.slice(1);card.append(heading);
  const width=350,height=278,left=42,right=12,top=27,bottom=34,last=chart.queries.at(-1),plotWidth=width-left-right,plotHeight=height-top-bottom;
  const x=n=>left+(n-1)/(last-1)*plotWidth,y=value=>top+(100-value)/100*plotHeight;
  const activeSeries=chart.series.filter(s=>selectedPolicy==='all'||s.downstream_family===selectedPolicy);
  const svg=svgElement('svg',{viewBox:`0 0 ${width} ${height}`,role:'img',tabindex:0,'aria-label':`${heading.textContent} query survival, ${selectedPolicy==='all'?'all policies':families[selectedPolicy].label}. Use left and right arrow keys to inspect queries.`});
  svg.append(svgElement('title',{},`${heading.textContent}: with and without memory`));
  svg.append(svgElement('desc',{},activeSeries.map(s=>`${families[s.downstream_family].label}, ${s.memory_condition==='none'?'without':'with'} memory: `+chart.queries.map((q,i)=>`N=${q}: ${s.survival_percent[i]}%`).join('; ')).join('. ')));
  for(const value of [0,25,50,75,100]){svg.append(svgElement('line',{x1:left,x2:width-right,y1:y(value),y2:y(value),stroke:'#dbe4de','stroke-width':.8}));svg.append(svgElement('text',{x:left-9,y:y(value)+3.5,'text-anchor':'end',fill:'#637780','font-size':10,'font-family':'Lato, Arial'},value))}
  svg.append(svgElement('text',{x:left,y:13,fill:'#637780','font-size':10,'font-family':'Lato, Arial'},'Query survival (%)'));
  const ticks={sequential:[1,5,10,15,20],spatial:[1,4,8,12,16],semantic:[1,5,10,15,20,25]}[chart.memory_form];
  ticks.forEach(n=>svg.append(svgElement('text',{x:x(n),y:height-13,'text-anchor':'middle',fill:'#637780','font-size':10,'font-family':'Lato, Arial'},n)));
  svg.append(svgElement('line',{x1:left,x2:width-right,y1:y(0),y2:y(0),stroke:'#a7bcb1','stroke-width':1}));
  const sorted=[...activeSeries].sort((a,b)=>Number(a.memory_condition!=='none')-Number(b.memory_condition!=='none'));
  sorted.forEach(series=>{
   const info=families[series.downstream_family],enabled=series.memory_condition!=='none';
   const points=chart.queries.map((q,i)=>`${x(q)},${y(series.survival_percent[i])}`).join(' ');
   svg.append(svgElement('polyline',{points,fill:'none',stroke:info.color,'stroke-width':enabled?2.2:1.8,'stroke-dasharray':enabled?'none':'5 4','stroke-linecap':'round','stroke-linejoin':'round',opacity:enabled?1:.72}));
   chart.queries.forEach((q,i)=>{if(i%3===0||i===chart.queries.length-1)svg.append(svgElement('circle',{cx:x(q),cy:y(series.survival_percent[i]),r:enabled?2.4:2,fill:enabled?info.color:'var(--paper)',stroke:info.color,'stroke-width':1}))});
  });
  const guide=svgElement('g',{class:'chart-hover-guide',visibility:'hidden'});svg.append(guide);
  card.append(svg);const axis=document.createElement('div');axis.className='chart-axis-label';axis.textContent='Number of completed queries (N)';card.append(axis);
  const inspection=document.createElement('p');inspection.className='curve-inspection';inspection.textContent='Hover or focus the chart to inspect values.';card.append(inspection);
  let currentIndex=0;
  function inspect(index){currentIndex=Math.max(0,Math.min(chart.queries.length-1,index));const n=chart.queries[currentIndex];guide.replaceChildren(svgElement('line',{x1:x(n),x2:x(n),y1:top,y2:height-bottom,stroke:'#718b7e','stroke-width':1,'stroke-dasharray':'3 3'}));activeSeries.forEach(s=>guide.append(svgElement('circle',{cx:x(n),cy:y(s.survival_percent[currentIndex]),r:4,fill:families[s.downstream_family].color,stroke:'var(--paper)','stroke-width':1.5})));guide.setAttribute('visibility','visible');inspection.replaceChildren();const label=document.createElement('strong');label.textContent=`N = ${n}  `;inspection.append(label);activeSeries.forEach(s=>{const value=document.createElement('span');value.style.color=families[s.downstream_family].color;value.textContent=`${families[s.downstream_family].label} ${s.memory_condition==='none'?'without':'with'}: ${s.survival_percent[currentIndex]}%`;inspection.append(value)});}
  svg.addEventListener('pointermove',event=>{const box=svg.getBoundingClientRect(),svgX=(event.clientX-box.left)/box.width*width;inspect(Math.round((svgX-left)/plotWidth*(last-1)))});
  svg.addEventListener('focus',()=>inspect(currentIndex));svg.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();inspect(currentIndex+(event.key==='ArrowRight'?1:-1))}});
  return card;
 }
 function renderCurves(){conqContainer.replaceChildren(...curveCharts.map(drawChart));document.querySelector('#policy-legend').innerHTML=Object.entries(families).filter(([family])=>selectedPolicy==='all'||family===selectedPolicy).map(([,info])=>`<span><i style="border-color:${info.color}"></i>${info.label}</span>`).join('');policyButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.policy===selectedPolicy)));conqContainer.setAttribute('aria-busy','false')}
 policyButtons.forEach(button=>button.addEventListener('click',()=>{selectedPolicy=button.dataset.policy;if(curveCharts.length)renderCurves()}));
 fetch('assets/conq-data.json').then(response=>{if(!response.ok)throw Error('Curve data unavailable');return response.json()}).then(data=>{curveCharts=data.charts;renderCurves()}).catch(()=>{conqContainer.textContent='Curve data could not be loaded. Reload the page to try again.';conqContainer.setAttribute('aria-busy','false')});
}
