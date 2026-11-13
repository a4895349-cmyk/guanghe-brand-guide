(function(){
  var $=function(id){return document.getElementById(id)};
  var ROOT=document.body.getAttribute('data-root')||'./';
  var view=document.querySelector('.view');
  if(view){
    [].slice.call(view.querySelectorAll('.stat,.tile,.card,.steps li,.tablebox tr,.body>h2,.body>div,details,.next')).forEach(function(el,i){el.style.setProperty('--i',Math.min(i,14))});
    view.classList.add('enter');
    if(view.getAttribute('data-view')==='home'){
      var OLD={works:'works',team:'team',process:'brand',guide:'guide',spec:'spec',tools:'cost',contact:'contact'},h=location.hash.slice(1);
      if(OLD[h])location.replace(ROOT+OLD[h]+'/');
    }
  }
  function toContact(type,ask){
    try{sessionStorage.setItem('prefill',JSON.stringify({type:type,ask:ask}))}catch(e){}
    location.href=ROOT+'contact/';
  }
  var ICONS={"運動背心": "tank", "排汗短袖、長袖": "long", "橄欖球衣": "jersey", "啦啦隊服": "cheer", "防水透氣外套": "hood", "Bra top、Leggings": "bra", "POLO 衫": "polo", "制服襯衫": "shirt", "工裝襯衫": "workshirt", "西裝褲、工作褲": "pants", "圍裙": "apron", "夾克、禦寒外套": "jacket", "志工背心": "vest", "短袖 T 恤": "tee", "大學 T": "sweat", "帽子": "cap", "頭巾": "bandana", "昇華披肩布條": "sash", "帆布提袋": "tote", "針織提袋": "knit", "書包": "backpack", "野餐墊": "mat", "吊牌": "tag", "洗水標": "label", "包裝袋": "bag", "網版印刷": "screen", "熱轉印": "press", "膠印": "print", "電腦刺繡": "embroid", "昇華": "sublim", "特調色染布": "drop", "織標與吊牌": "woven"};
  [].slice.call(document.querySelectorAll('[data-view="works"] .chips:not(.who) li')).forEach(function(li){
    var name=li.textContent.trim();
    var b=document.createElement('button'); b.type='button'; b.className='chip-btn';
    b.setAttribute('aria-label',name+'，聯繫看樣品');
    var ic=ICONS[name];
    if(ic){var io=document.createElement('span'); io.className='chip-ico'; io.innerHTML='<svg viewBox="0 0 64 64" aria-hidden="true"><use href="#i-'+ic+'"/></svg>'; b.appendChild(io);}
    var t=document.createElement('span'); t.textContent=name;
    var sp=document.createElement('span'); sp.className='see'; sp.textContent='聯繫看樣品';
    b.appendChild(t); b.appendChild(sp);
    b.addEventListener('click',function(){toContact(name,'想看「'+name+'」的樣品照片。')});
    li.textContent=''; li.className='has-btn'; li.appendChild(b);
  });
  if($('team-ask'))$('team-ask').addEventListener('click',function(){toContact('團體服','想問團體服報價。數量：　件；款式：　；圖案：　；希望到貨日：　。')});

  if($('c-unit')){
    var fmt=function(n){return 'NT$ '+Math.round(n).toLocaleString('zh-TW')};
    var num=function(id){var v=parseFloat($(id).value);return isFinite(v)&&v>0?v:0};
    var calc=function(){
      var unit=num('c-unit'),qty=Math.max(1,num('c-qty')),tool=num('c-tool'),sample=num('c-sample'),pack=num('c-pack'),ship=num('c-ship'),mult=Math.max(1,num('c-mult'));
      var total=unit*qty+tool+sample+pack*qty+ship, per=total/qty;
      $('r-total').textContent=fmt(total);
      $('r-per').textContent=fmt(per);
      $('r-gap').textContent=unit>0?Math.round((per/unit-1)*100)+'%':'—';
      $('r-price').textContent=fmt(per*mult);
    };
    ['c-unit','c-qty','c-tool','c-sample','c-pack','c-ship','c-mult'].forEach(function(id){$(id).addEventListener('input',calc)});
    calc();
  }
  if($('checks')){
    var boxes=[].slice.call(document.querySelectorAll('#checks input'));
    var score=function(){
      var n=boxes.filter(function(b){return b.checked}).length;
      $('k-score').textContent=n+' / '+boxes.length;
      $('k-msg').textContent=n===boxes.length?'準備得很完整，可以進入報價或下單。':n>=5?'大方向有了，沒勾的那幾項建議下單前補齊。':'現在下單風險偏高，沒勾的項目正是最容易撞牆的地方，可以先來聊。';
      try{localStorage.setItem('checks2',JSON.stringify(boxes.map(function(b){return b.checked})))}catch(e){}
    };
    try{var s=JSON.parse(localStorage.getItem('checks2')||'[]');boxes.forEach(function(b,i){b.checked=!!s[i]})}catch(e){}
    boxes.forEach(function(b){b.addEventListener('change',score)});
    score();
  }
  if($('m-out')){
    try{var p=JSON.parse(sessionStorage.getItem('prefill')||'null');if(p){$('m-type').value=p.type||'';$('m-ask').value=p.ask||'';sessionStorage.removeItem('prefill')}}catch(e){}
    var msg=function(){
      var v=function(id){return $(id).value.trim()||'（未填）'};
      $('m-out').textContent='你好，我想諮詢品牌產品製造。\n稱呼：'+v('m-name')+'\n想做的產品：'+v('m-type')+'\n目前階段：'+v('m-stage')+'\n預計首批數量：'+v('m-qty')+'\n預算範圍：'+v('m-budget')+'\n最想問的事：'+v('m-ask');
      $('m-status').textContent='';
    };
    ['m-name','m-type','m-stage','m-qty','m-budget','m-ask'].forEach(function(id){$(id).addEventListener('input',msg)});
    msg();
    $('m-copy').addEventListener('click',function(){
      var text=$('m-out').textContent;
      var fallback=function(){var r=document.createRange();r.selectNodeContents($('m-out'));var sel=getSelection();sel.removeAllRanges();sel.addRange(r);$('m-status').textContent='已選取文字，請按複製。'};
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(function(){$('m-status').textContent='已複製，點下面的 LINE 或 IG 連結貼上傳給我。'},fallback)}else{fallback()}
    });
  }
})();
