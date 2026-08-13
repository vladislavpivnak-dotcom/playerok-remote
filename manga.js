(function(){
  const mangaData = {
    start: 'page1',
    nodes: {
      page1: { bg:'images/manga-page-1.jpg', label:'Страница 1', choices:[
        { text:'Вариант 1', next:'ending1' },
        { text:'Вариант 2', next:'page2' }
      ]},
      page2: { bg:'images/manga-page-2.jpg', label:'Страница 2', choices:[
        { text:'Вариант 1', next:'ending2' },
        { text:'Вариант 2', next:'page3' }
      ]},
      page3: { bg:'images/manga-page-3.jpg', label:'Страница 3', choices:[
        { text:'Вариант 1', next:'ending3' },
        { text:'Вариант 2', next:'page4' }
      ]},
      page4: { bg:'images/manga-page-4.jpg', label:'Страница 4', final:true },
      ending1: { bg:'images/manga-ending-1.jpg', label:'Концовка 1', final:true },
      ending2: { bg:'images/manga-ending-2.jpg', label:'Концовка 2', final:true },
      ending3: { bg:'images/manga-ending-3.jpg', label:'Концовка 3', final:true }
    }
  };

  const modal = document.getElementById('mangaModal');
  const stage = document.getElementById('mangaStage');
  const closeBtn = document.getElementById('mangaClose');
  const openSlide = document.getElementById('mangaOpenSlide');

  function renderNode(id){
    const node = mangaData.nodes[id];
    stage.style.backgroundImage = `url('${node.bg}')`;
    stage.innerHTML = `<div class="manga-page-label">${node.label}</div><div class="manga-choices" id="mangaChoices"></div>`;
    const choicesBox = document.getElementById('mangaChoices');
    if(node.final){
      const btn = document.createElement('button');
      btn.className = 'manga-final-btn';
      btn.textContent = 'Завершить чтение';
      btn.addEventListener('click', closeModal);
      choicesBox.appendChild(btn);
    } else {
      node.choices.forEach(choice=>{
        const btn = document.createElement('button');
        btn.className = 'manga-choice-btn';
        btn.textContent = choice.text;
        btn.addEventListener('click', ()=>renderNode(choice.next));
        choicesBox.appendChild(btn);
      });
    }
  }

  function openModal(){
    modal.classList.add('open');
    renderNode(mangaData.start);
    document.body.style.overflow = 'hidden';
  }

  function closeModal(){
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openSlide.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e=>{ if(e.target === modal) closeModal(); });
  document.addEventListener('keydown', e=>{ if(e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

  const wrap = document.getElementById('mangaTrackWrap');
  const track = document.getElementById('mangaTrack');
  const prevBtn = document.getElementById('mangaPrev');
  const nextBtn = document.getElementById('mangaNext');
  const dotsBox = document.getElementById('mangaDots');
  const slides = Array.from(track.children);

  slides.forEach((_, i)=>{
    const dot = document.createElement('button');
    dot.className = 'manga-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', ()=>scrollToSlide(i));
    dotsBox.appendChild(dot);
  });
  const dots = Array.from(dotsBox.children);

  function slideStep(){
    return slides[0].getBoundingClientRect().width + 16;
  }

  function scrollToSlide(i){
    wrap.scrollTo({ left: i * slideStep(), behavior:'smooth' });
  }

  function currentIndex(){
    return Math.round(wrap.scrollLeft / slideStep());
  }

  function updateDots(){
    const idx = Math.max(0, Math.min(slides.length - 1, currentIndex()));
    dots.forEach((d, i)=>d.classList.toggle('active', i === idx));
  }

  prevBtn.addEventListener('click', ()=>scrollToSlide(Math.max(0, currentIndex() - 1)));
  nextBtn.addEventListener('click', ()=>scrollToSlide(Math.min(slides.length - 1, currentIndex() + 1)));

  let scrollTimer = null;
  wrap.addEventListener('scroll', ()=>{
    if(scrollTimer) window.cancelAnimationFrame(scrollTimer);
    scrollTimer = window.requestAnimationFrame(updateDots);
  });

  updateDots();
})();
