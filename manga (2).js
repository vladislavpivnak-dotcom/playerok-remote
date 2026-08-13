(function(){
  const mangaData = {
    start: 'page1',
    nodes: {
      page1: {
        bg:'images/manga-page-1.jpg', label:'Страница 1',
        gnomeText:'Погнали! Выбирай, как поступишь 👀',
        choices:[
          { text:'Пожалуй откажусь...,', next: 'ending1' },
          { text:'Расскажи мне!', next: 'page2' }
        ]
      },
      page2: {
        bg:'images/manga-page-2.jpg', label:'Страница 2',
        gnomeText:'О, отличный выбор! Погнали дальше',
        choices:[
          { text:'Чет как-то не хочу)', next:'ending2' },
          { text:'А дальше?', next:'page3' }
        ]
      },
      page3: {
        bg:'images/manga-page-3.jpg', label:'Страница 3',
        gnomeText:'Не сдавайся, дальше — интереснее!',
        choices:[
          { text:'Да ну... Уныло это всё', next:'ending3' },
          { text:'Агась, думаю я понял', next:'page4' }
        ]
      },
      page4: {
        bg:'images/manga-page-4.jpg', label:'Страница 4',
        gnomeText:'Красавчик, ты дошёл до конца! 🎉',
        final:true, finalBtnText:'Пока-пока!'
      },
      ending1: {
        bg:'images/manga-ending-1.jpg', label:'Концовка 1',
        gnomeText:'Жаль, что не рискнул... в другой раз?',
        final:true
      },
      ending2: {
        bg:'images/manga-ending-2.jpg', label:'Концовка 2',
        gnomeText:'Эх, а ведь дальше было интересно...',
        final:true
      },
      ending3: {
        bg:'images/manga-ending-3.jpg', label:'Концовка 3',
        gnomeText:'Ну и ладно, не всем это заходит)',
        final:true
      }
    }
  };

  const modal = document.getElementById('mangaModal');
  const stage = document.getElementById('mangaStage');
  const closeBtn = document.getElementById('mangaClose');
  const openSlide = document.getElementById('mangaOpenSlide');
  const gnomeBubble = document.getElementById('mangaGnomeBubble');

  function renderNode(id){
    const node = mangaData.nodes[id];
    stage.style.backgroundImage = `url('${node.bg}')`;
    stage.innerHTML = `<div class="manga-page-label">${node.label}</div><div class="manga-choices" id="mangaChoices"></div>`;
    const choicesBox = document.getElementById('mangaChoices');

    if(node.gnomeText){
      gnomeBubble.textContent = node.gnomeText;
      gnomeBubble.classList.add('show');
    } else {
      gnomeBubble.classList.remove('show');
    }

    if(node.final){
      const btn = document.createElement('button');
      btn.className = 'manga-final-btn';
      btn.textContent = node.finalBtnText || 'Завершить чтение';
      btn.addEventListener('click', closeModal);
      choicesBox.appendChild(btn);
    } else {
      node.choices.forEach(choice=>{
        const btn = document.createElement('button');
        btn.className = 'manga-choice-btn';
        btn.textContent = choice.text;
        btn.addEventListener('click', ()=>{
          choicesBox.querySelectorAll('.manga-choice-btn').forEach(b=>{ b.disabled = true; });
          gnomeBubble.textContent = choice.text;
          gnomeBubble.classList.add('show');
          setTimeout(()=>renderNode(choice.next), 1400);
        });
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
