(function(){
  'use strict';
  const root=document.documentElement;
  const english=document.body.dataset.language==='en';
  const toggle=document.getElementById('theme-toggle');
  const symbol=document.getElementById('theme-symbol');
  const system=window.matchMedia('(prefers-color-scheme: dark)');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const settleTransition=transition=>{if(transition){transition.ready.catch(()=>{});transition.finished.catch(()=>{});transition.updateCallbackDone.catch(()=>{});}};
  window.addEventListener('pagereveal',event=>settleTransition(event.viewTransition));
  window.addEventListener('pageswap',event=>settleTransition(event.viewTransition));
  function theme(){return root.dataset.theme || (system.matches?'dark':'light');}
  function updateThemeLabel(){const dark=theme()==='dark';toggle.setAttribute('aria-label',english?(dark?'Switch to light mode':'Switch to dark mode'):(dark?'切换浅色模式':'切换深色模式'));toggle.title=toggle.getAttribute('aria-label');symbol.textContent=dark?'◑':'◐';}
  try{const saved=localStorage.getItem('noah-theme');if(saved==='light'||saved==='dark')root.dataset.theme=saved;}catch(error){}
  updateThemeLabel();
  toggle.addEventListener('click',()=>{
    const change=()=>{root.dataset.theme=theme()==='dark'?'light':'dark';try{localStorage.setItem('noah-theme',root.dataset.theme);}catch(error){}updateThemeLabel();};
    if(document.startViewTransition&&!reduced.matches){settleTransition(document.startViewTransition(change));}else{change();}
  });
  system.addEventListener('change',updateThemeLabel);
  const languageLink=document.querySelector('.language-switch');
  languageLink.addEventListener('click',event=>{
    if(reduced.matches||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
    event.preventDefault();
    document.body.classList.add('language-leaving');
    window.setTimeout(()=>window.location.assign(languageLink.href),180);
  });
  if('IntersectionObserver' in window&&!reduced.matches){
    root.classList.add('js-reveal');
    const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}});},{threshold:.08});
    document.querySelectorAll('.reveal').forEach(element=>observer.observe(element));
  }
  const copy=document.getElementById('copy-email');
  const status=document.getElementById('copy-status');
  let timer;
  copy.addEventListener('click',async()=>{
    copy.disabled=true;copy.textContent=english?'Copying…':'正在复制…';
    try{
      if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText('noahxie83@gmail.com');}
      else{const field=document.createElement('textarea');field.value='noahxie83@gmail.com';field.style.position='fixed';field.style.opacity='0';document.body.append(field);field.select();const ok=document.execCommand('copy');field.remove();if(!ok)throw new Error('Clipboard unavailable');}
      status.textContent=english?'Email copied':'邮箱已复制';
    }catch(error){status.textContent=english?'Select the email address above to copy it.':'请直接选中上方邮箱复制。';}
    finally{copy.disabled=false;copy.textContent=english?'Copy email':'复制邮箱';clearTimeout(timer);timer=setTimeout(()=>{status.textContent='';},5000);}
  });
})();
