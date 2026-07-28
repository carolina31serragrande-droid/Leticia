/* ==========================================================================
   LETÍCIA — FOTOGRAFIA & VÍDEO
   Script principal: menu mobile, header ao rolar, filtro do portfólio,
   lightbox em tela cheia e formulário de contato via WhatsApp.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Inicializa animações de scroll (AOS) ---------- */
  if (window.AOS) {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
    });
  }

  /* ---------- Ano atual no rodapé ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header muda de aparência ao rolar ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Menu mobile (hambúrguer) ---------- */
  const burger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');

  burger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(isOpen));
    burger.classList.toggle('is-active', isOpen);
  });

  // Fecha o menu ao clicar em um link (mobile)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ==========================================================================
     PORTFÓLIO — filtro por categoria
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.filter');
  const portfolioItems = document.querySelectorAll('.portfolio__grid .item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const category = btn.dataset.filter;

      portfolioItems.forEach(item => {
        const match = category === 'todos' || item.dataset.category === category;
        item.classList.toggle('is-hidden', !match);
      });
    });
  });

  /* ==========================================================================
     LIGHTBOX — visualização em tela cheia
     ========================================================================== */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  // Lista sempre atualizada dos itens visíveis (respeita o filtro ativo)
  let currentIndex = 0;

  function getVisibleItems() {
    return Array.from(portfolioItems).filter(item => !item.classList.contains('is-hidden'));
  }

  function openLightbox(index) {
    const visibleItems = getVisibleItems();
    if (!visibleItems.length) return;

    currentIndex = (index + visibleItems.length) % visibleItems.length;
    const item = visibleItems[currentIndex];
    const img = item.querySelector('img');
    const caption = item.querySelector('figcaption');

    lightboxImg.src = img.src.replace(/\/\d+\/\d+$/, '/1600/1200'); // versão maior da imagem
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = caption ? caption.textContent : '';

    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function showRelative(offset) {
    const visibleItems = getVisibleItems();
    if (!visibleItems.length) return;
    openLightbox(
      (visibleItems.findIndex(i => i === visibleItems[currentIndex]) + offset)
    );
  }

  portfolioItems.forEach((item) => {
    item.addEventListener('click', () => {
      const visibleItems = getVisibleItems();
      const idx = visibleItems.indexOf(item);
      openLightbox(idx);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => showRelative(-1));
  lightboxNext.addEventListener('click', () => showRelative(1));

  // Fecha clicando fora da imagem
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Navegação por teclado
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showRelative(-1);
    if (e.key === 'ArrowRight') showRelative(1);
  });

  /* ==========================================================================
     FORMULÁRIO DE CONTATO — envia via WhatsApp
     ========================================================================== */
  const form = document.getElementById('contatoForm');
  const WHATSAPP_NUMBER = '5521993967944'; // (21) 99396-7944 em formato internacional

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();

    if (!nome || !email || !mensagem) return;

    const texto = `Olá, Letícia! Meu nome é ${nome} (${email}).\n\n${mensagem}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;

    window.open(url, '_blank', 'noopener');
    form.reset();
  });

});