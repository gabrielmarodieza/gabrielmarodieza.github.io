'use strict';
document.documentElement.classList.add('enhanced');
const motionQuery=window.matchMedia('(prefers-reduced-motion: reduce)');
const proofButtons=[...document.querySelectorAll('[data-proof]')];
const proofPanels=[...document.querySelectorAll('[data-proof-panel]')];
const controls=document.querySelector('.proof-controls');
function showProof(key){
  proofButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.proof===key)));
  proofPanels.forEach(panel=>{
    const selected=panel.dataset.proofPanel===key;
    panel.hidden=!selected;
    panel.classList.remove('is-entering');
    if(selected&&!motionQuery.matches)panel.classList.add('is-entering');
  });
}
if(controls&&proofButtons.length&&proofPanels.length){
  showProof(proofButtons[0].dataset.proof);
  controls.hidden=false;
  proofButtons.forEach((button,index)=>{
    button.addEventListener('click',()=>showProof(button.dataset.proof));
    button.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
      event.preventDefault();
      const next=event.key==='Home'?0:event.key==='End'?proofButtons.length-1:
        (index+(event.key==='ArrowRight'?1:-1)+proofButtons.length)%proofButtons.length;
      proofButtons[next].focus();
      showProof(proofButtons[next].dataset.proof);
    });
  });
}
const filterBar=document.querySelector('.filter-bar');
const filterButtons=[...document.querySelectorAll('[data-filter]')];
const rows=[...document.querySelectorAll('.invoice-table tbody tr')];
const count=document.getElementById('result-count');
if(filterBar&&count&&rows.length){
  filterBar.hidden=false;
  filterButtons.forEach(button=>button.addEventListener('click',()=>{
    const filter=button.dataset.filter;
    let visible=0;
    rows.forEach(row=>{
      const decision=row.dataset.decision;
      const show=filter==='all'||filter==='ready'&&decision==='Ready'||filter==='review'&&decision.startsWith('Review');
      row.hidden=!show;
      if(show)visible++;
    });
    filterButtons.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    count.textContent=visible+(visible===1?' record shown':' records shown');
  }));
}
if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>entry.target.classList.toggle('is-current',entry.isIntersecting));
  },{rootMargin:'-15% 0px -25% 0px',threshold:0.1});
  document.querySelectorAll('.chapter').forEach(chapter=>observer.observe(chapter));
}

const storyDuration=6000;
let storyTimer=null;
let storyPaused=false;
function armStoryTimer(){
  if(storyTimer)window.clearTimeout(storyTimer);
  if(storyPaused)return;
  storyTimer=window.setTimeout(()=>{
    if(storyPaused)return;
    const current=proofButtons.findIndex(button=>button.getAttribute('aria-pressed')==='true');
    const next=proofButtons[(current+1)%proofButtons.length];
    if(next)next.click();
    armStoryTimer();
  },storyDuration);
}
if(controls&&proofButtons.length>1){
  const pauseStories=()=>{storyPaused=true;if(storyTimer)window.clearTimeout(storyTimer);};
  const resumeStories=()=>{storyPaused=false;armStoryTimer();};
  controls.addEventListener('mouseenter',pauseStories);
  controls.addEventListener('mouseleave',resumeStories);
  controls.addEventListener('focusin',pauseStories);
  controls.addEventListener('focusout',event=>{if(!controls.contains(event.relatedTarget))resumeStories();});
  proofButtons.forEach(button=>button.addEventListener('click',()=>{armStoryTimer();}));
  armStoryTimer();
}