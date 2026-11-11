
(function(){
  'use strict';
  var WA='https://wa.me/375257775177';
  var burger=document.getElementById('burger'), drawer=document.getElementById('drawer'),
      closeBtn=document.getElementById('drawerClose'), lastFocus=null;
  function openDrawer(){ if(!drawer) return; lastFocus=document.activeElement; drawer.hidden=false;
    document.body.classList.add('is-locked'); if(burger) burger.setAttribute('aria-expanded','true'); if(closeBtn) closeBtn.focus(); }
  function closeDrawer(){ if(!drawer||drawer.hidden) return; drawer.hidden=true;
    document.body.classList.remove('is-locked'); if(burger) burger.setAttribute('aria-expanded','false'); if(lastFocus) lastFocus.focus(); }
  if(burger) burger.addEventListener('click',openDrawer);
  if(closeBtn) closeBtn.addEventListener('click',closeDrawer);
  if(drawer) drawer.addEventListener('click',function(e){ if(e.target===drawer) closeDrawer(); });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape') closeDrawer();
    if(e.key==='Tab' && drawer && !drawer.hidden){
      var f=drawer.querySelectorAll('a,button'); if(!f.length) return;
      var first=f[0], last=f[f.length-1];
      if(e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); }
    }
  });
  window.addEventListener('resize',function(){ if(window.innerWidth>1049) closeDrawer(); });

  var sez=document.getElementById('season');
  if(sez){
    var data=[];
    try{ data=JSON.parse(document.getElementById('seasonData').textContent); }catch(e){}
    var cur=0;
    var sT=document.getElementById('s-title'), sX=document.getElementById('s-text'),
        sA=document.getElementById('s-adv'), sL=document.getElementById('s-load');
    var words=['спокойно','с оживлением','рост','пик'];
    function paintSeason(){
      var s=data[cur]; if(!s) return;
      sT.textContent=s[0]+': '+words[s[1]];
      sX.textContent=s[2];
      sA.textContent=s[3];
      sL.innerHTML=[0,1,2,3].map(function(i){ return '<i class="'+(i<=s[1]?'on':'')+'"></i>'; }).join('');
      sez.querySelectorAll('.season button').forEach(function(b){
        b.setAttribute('aria-pressed', +b.getAttribute('data-m')===cur?'true':'false');
      });
    }
    sez.querySelectorAll('.season button').forEach(function(b){
      b.addEventListener('click',function(){ cur=+b.getAttribute('data-m'); paintSeason(); });
    });
    paintSeason();
  }

  var bk=document.getElementById('book');
  if(bk){
    var day='Пн', time='Утро, до 12';
    var sSum=document.getElementById('b-sum'), cta=document.getElementById('b-cta');
    function paintBook(){
      var job=document.getElementById('b-job').value, car=document.getElementById('b-car').value.trim();
      sSum.textContent=job+' · '+day+', '+time;
      var txt='Здравствуйте! Хочу приехать на шиномонтаж.\nУслуга: '+job+'\nДень: '+day+'\nВремя: '+time+'\nАвтомобиль и шины: '+(car||'уточню')+'\nПодскажите, есть ли свободное время?';
      cta.href=WA+'?text='+encodeURIComponent(txt);
    }
    bk.querySelectorAll('#b-days button').forEach(function(b){
      b.addEventListener('click',function(){ day=b.getAttribute('data-d');
        bk.querySelectorAll('#b-days button').forEach(function(x){ x.setAttribute('aria-pressed', x===b?'true':'false'); });
        paintBook(); });
    });
    bk.querySelectorAll('#b-times button').forEach(function(b){
      b.addEventListener('click',function(){ time=b.textContent;
        bk.querySelectorAll('#b-times button').forEach(function(x){ x.setAttribute('aria-pressed', x===b?'true':'false'); });
        paintBook(); });
    });
    ['b-job','b-car'].forEach(function(id){ var el=document.getElementById(id); if(el){ el.addEventListener('input',paintBook); el.addEventListener('change',paintBook); } });
    paintBook();
  }

  var form=document.getElementById('leadForm'), msg=document.getElementById('formMsg');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var d=new FormData(form), name=(d.get('name')||'').toString().trim(), phone=(d.get('phone')||'').toString().trim();
      if(name.length<2||phone.length<6){ msg.textContent='Нужны имя и телефон, иначе не перезвонить.'; return; }
      var lines=['Заявка с сайта: '+document.title,'Имя: '+name,'Телефон: '+phone,
                 'Авто и шины: '+((d.get('car')||'').toString().trim()||'уточню'),
                 'Что нужно: '+((d.get('job')||'').toString())];
      var m=(d.get('msg')||'').toString().trim(); if(m) lines.push('Комментарий: '+m);
      msg.textContent='Открываю WhatsApp с готовым сообщением.';
      window.open(WA+'?text='+encodeURIComponent(lines.join('\n')),'_blank');
    });
  }
})();
