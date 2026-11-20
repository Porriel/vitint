(() => {
  const $ = (s, scope = document) => scope.querySelector(s);
  const $$ = (s, scope = document) => [...scope.querySelectorAll(s)];
  let paused = false;
  const reveals = $$('.reveal');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), {threshold:0.08});
  reveals.forEach(el => { el.classList.add('will-reveal'); observer.observe(el); });
  document.addEventListener('keydown', e => {
    if(e.key !== 'Tab' || mobileNav.hidden) return;
    const links=$$('a',mobileNav), last=links.at(-1);
    if(e.shiftKey && document.activeElement===menu){e.preventDefault();last.focus();}
    else if(!e.shiftKey && document.activeElement===last){e.preventDefault();menu.focus();}
  });
  $('.motion-control').addEventListener('click', e => {
    paused = !paused; document.body.classList.toggle('motion-paused', paused);
    e.currentTarget.setAttribute('aria-pressed', String(paused));
    $('.motion-label').textContent = paused ? 'Resume motion' : 'Pause motion';
    $('.pause-icon').textContent = paused ? '▷' : 'Ⅱ';

  });
  const menu = $('.menu-toggle'), mobileNav = $('#mobile-nav');
  function closeMenu() { mobileNav.hidden = true; menu.setAttribute('aria-expanded','false'); menu.setAttribute('aria-label','Open navigation'); document.body.classList.remove('menu-open'); }
  menu.addEventListener('click', () => { const opened = menu.getAttribute('aria-expanded') !== 'true'; mobileNav.hidden = !opened; menu.setAttribute('aria-expanded',String(opened)); menu.setAttribute('aria-label',opened?'Close navigation':'Open navigation'); document.body.classList.toggle('menu-open',opened); });
  $$('a',mobileNav).forEach(a=>a.addEventListener('click',()=>{closeMenu();const section=$(a.getAttribute('href'));section.setAttribute('tabindex','-1');section.focus({preventScroll:true});}));
  document.addEventListener('keydown', e=>{if(e.key==='Escape' && !mobileNav.hidden){closeMenu();menu.focus();}});
  matchMedia('(min-width:801px)').addEventListener('change',e=>{if(e.matches)closeMenu();});
  const shades = { clear:['Clear','Natural Foundation — a clear starting point for personalized lens design.'], mist:['Mist Blue','A delicate blue iris pattern, softened by light.'], deep:['Deep Blue','A deeper blue, expressed through fine iris detail.'], rose:['Rose Brown','A muted rose-brown iris pattern with a warm undertone.'] };
  let shadeVersion = 0;
  $$('input[name="shade"]').forEach(input=>input.addEventListener('change', async()=>{
    const version = ++shadeVersion, value = input.value, target = $(`[data-shade-image="${value}"]`);
    try { await target.decode(); } catch { return; }
    if(version !== shadeVersion) return;
    $$('[data-shade-image]').forEach(img=>img.classList.toggle('is-active',img===target));
    $('#shade-name').textContent=shades[value][0]; $('#shade-description').textContent=shades[value][1];
    $('.studio-art').setAttribute('aria-label',`${shades[value][0]} VITINT lens concept preview`);
  }));
  const dialog=$('#concept-dialog');
  $('.about-button').addEventListener('click',()=>dialog.showModal());
  $('.dialog-close').addEventListener('click',()=>dialog.close());$('.dialog-done').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
})();
