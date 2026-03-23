/* ============================================================
   AGENDA LLENA — Landing Page Scripts
   Features: Navbar scroll, intersection observer animations,
   form validation, WhatsApp redirect, sticky CTA visibility
============================================================ */

(function () {
  'use strict';

  // ── NAVBAR SCROLL ─────────────────────────────────────
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load

  // ── STICKY MOBILE CTA VISIBILITY (ALWAYS VISIBLE ON MOBILE) ──
  // Per user request, the Sticky CTA is handled by CSS media queries to remain always visible.

  // ── SCROLL-TRIGGERED REVEAL ANIMATIONS ────────────────
  const revealEls = document.querySelectorAll(
    '.reality-card, .mstep, .plan-card, .roi-card, .testi-card, .bonus-item, .filter-col, .cost-calculator, .roi-math, .truth-box, .roi-conclusion'
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  // Add base reveal style via JS (not CSS file to avoid FOUC)
  const style = document.createElement('style');
  style.textContent = `
    .reality-card, .mstep, .plan-card, .roi-card, .testi-card,
    .bonus-item, .filter-col, .cost-calculator, .roi-math,
    .truth-box, .roi-conclusion {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.55s ease, transform 0.55s ease;
    }
    .revealed {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
    /* Stagger for grid children */
    .reality-grid .reality-card:nth-child(2) { transition-delay: 0.1s; }
    .reality-grid .reality-card:nth-child(3) { transition-delay: 0.2s; }
    .pricing-grid .plan-card:nth-child(2) { transition-delay: 0.1s; }
    .pricing-grid .plan-card:nth-child(3) { transition-delay: 0.2s; }
    .testimonials-grid .testi-card:nth-child(2) { transition-delay: 0.12s; }
    .testimonials-grid .testi-card:nth-child(3) { transition-delay: 0.24s; }
    .roi-grid .roi-card:nth-child(2) { transition-delay: 0.1s; }
    .roi-grid .roi-card:nth-child(3) { transition-delay: 0.2s; }
    .bonus-grid .bonus-item:nth-child(2) { transition-delay: 0.1s; }
    .bonus-grid .bonus-item:nth-child(3) { transition-delay: 0.2s; }
  `;
  document.head.appendChild(style);

  revealEls.forEach((el) => revealObserver.observe(el));

  // ── MECHANISM STEPS STAGGER ────────────────────────────
  document.querySelectorAll('.mstep').forEach((el, i) => {
    el.style.transitionDelay = i * 0.12 + 's';
  });

  // ── SMOOTH SCROLL FOR ANCHOR LINKS ────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── FORM VALIDATION & SUBMISSION (REMOVED: Form replaced by AI Chatbot demo CTA) ──
  // Per user request, the form at the end of the page has been replaced by a direct call to the demo chatbot.


  // ── LOGO STRIP DUPLICATION (infinite scroll) ──────────
  const logosTrack = document.querySelector('.logos-track');
  if (logosTrack) {
    const items = logosTrack.innerHTML;
    logosTrack.innerHTML = items + items; // duplicate for seamless loop
  }

  // ── CTA BUTTON CLICK TRACKING (basic) ─────────────────
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', function () {
      // Placeholder for future analytics tracking
      // e.g., gtag('event', 'click_cta', { label: this.textContent.trim() });
    });
  });

  // ── COUNTER ANIMATION (REMOVED: Old metrics removed from HTML) ───────

  // ── ACTIVE NAV SECTION HIGHLIGHT ─────────────────────
  const sections = document.querySelectorAll('section[id]');
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // future: could update URL hash or nav active state
        }
      });
    },
    { rootMargin: '-30% 0px -60% 0px' }
  );
  sections.forEach((s) => sectionObserver.observe(s));

  // ── PREVENT DOUBLE FORM SUBMIT ────────────────────────
  document.querySelectorAll('form').forEach((f) => {
    let submitted = false;
    f.addEventListener('submit', () => {
      if (submitted) return false;
      submitted = true;
    });
  });

  // ── CHATBOT AI LOGIC (n8n Integration) ─────────────
  
  const chatbotContainer = document.getElementById('chatbot-container');
  const chatbotWindow = document.getElementById('chatbot-window');
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbotClose = document.getElementById('chatbot-close');
  const chatbotMessages = document.getElementById('chatbot-messages');
  const chatbotInput = document.getElementById('chatbot-input');
  const chatbotSend = document.getElementById('chatbot-send');

  // n8n Webhook URL
  const N8N_WEBHOOK_URL = 'https://modo-sinaptico-n8n-c83585-46-225-98-56.traefik.me/webhook/webbot';

  function toggleChatbot() {
    chatbotWindow.classList.toggle('closed');
    chatbotContainer.classList.toggle('active');
    if (!chatbotWindow.classList.contains('closed')) {
      chatbotInput.focus();
    }
  }

  function appendMessage(text, isBot = false) {
    const msg = document.createElement('div');
    msg.className = `message ${isBot ? 'bot-message' : 'user-message'}`;
    msg.textContent = text;
    chatbotMessages.appendChild(msg);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    return msg;
  }

  function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    chatbotMessages.appendChild(indicator);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    return indicator;
  }

  async function handleSendMessage() {
    const text = chatbotInput.value.trim();
    if (!text) return;

    chatbotInput.value = '';
    appendMessage(text, false);

    const typing = showTypingIndicator();

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          source: 'landing_page',
          timestamp: new Date().toISOString()
        })
      });

      typing.remove();

      if (response.ok) {
        let botText = "¡Gracias! Tu mensaje ha sido recibido.";
        try {
          const data = await response.json();
          // Extract bot response correctly (common n8n agent keys: output, message, text, action)
          botText = data.output || data.message || data.text || data.chatInput || botText;
        } catch (e) {
          console.log('No JSON response from n8n, using fallback');
        }
        appendMessage(botText, true);
      } else {
        appendMessage("Lo siento, hubo un problema conectando con el agente. ¿Podrías intentar de nuevo?", true);
      }
    } catch (error) {
      typing.remove();
      console.error('Chatbot error:', error);
      appendMessage("Parece que hay un problema de conexión. Por favor, asegúrate de que el webhook de n8n esté activo.", true);
    }
  }

  chatbotToggle.addEventListener('click', toggleChatbot);
  chatbotClose.addEventListener('click', toggleChatbot);
  
  chatbotSend.addEventListener('click', handleSendMessage);
  chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSendMessage();
  });

  // ── CONNECT ALL CTAs TO CHATBOT ────────────────────────
  
  // We target all buttons to trigger the chatbot as per user request.
  document.querySelectorAll('.btn').forEach((cta) => {
    cta.addEventListener('click', function (e) {
      const text = this.textContent.toLowerCase();
      const href = this.getAttribute('href');

      // Intercept internal links to trigger chatbot
      if (href && href.startsWith('#')) {
        e.preventDefault();
        
        // Open the chatbot
        if (chatbotWindow.classList.contains('closed')) {
          toggleChatbot();
        }
        
        // Custom greeting based on which CTA was clicked
        if (text.includes('demo') || text.includes('paso') || text.includes('crear')) {
          appendMessage("¡Excelente! Este es el primer paso para preparar tu demo real. ¿Cuál es el nombre de tu clínica?", true);
        } else if (text.includes('pro') || text.includes('base') || text.includes('premium')) {
          appendMessage(`Has seleccionado información sobre el ${this.textContent.trim()}. ¡Gran elección! ¿En qué ciudad se encuentra tu clínica para empezar con el demo?`, true);
        } else {
          appendMessage(`Hola! Me contacto para mi Demo.\n\n¿Cuál es el nombre de tu clínica?`, true);
        }
      }
    });
  });

})();
