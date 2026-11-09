(()=>{const K=window.__krypta;K._ev("qTexInit()");
 const h=document.querySelector(".logo");if(h)h.innerHTML="Pixel<br>Krypta";
 // dotted leaders + roman numerals like a table of contents
 const L={mHero:'I',mForge:'II',mChest:'III',mQuest:'IV',mSky:'V'};for(const [id,n] of Object.entries(L)){const b=document.getElementById(id);if(b&&!b.querySelector('.rn')){const i=document.createElement('i');i.className='rn';i.textContent=n;b.appendChild(i);}}
})();
