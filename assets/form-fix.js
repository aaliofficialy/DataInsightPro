(()=>{
  const fix=()=>document.querySelectorAll('a[href*="entries.html"]').forEach(a=>{a.href=a.href.replace(/entries\.html/g,'entries-v4.html')});
  fix();
  new MutationObserver(fix).observe(document.body,{childList:true,subtree:true});
})();