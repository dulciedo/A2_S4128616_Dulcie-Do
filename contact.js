// POPUP ANIMATION
document.addEventListener('DOMContentLoaded', function() {
  
  const contactTrigger = document.querySelector('.contact-trigger');
  const popupOverlay = document.getElementById('contact-popup-overlay');
  const popupClose = document.getElementById('popup-close');
  const popupTitles = document.querySelectorAll('.popup-title');

  
  
  popupTitles.forEach(title => {
    const text = title.textContent;
    title.innerHTML = '';
    text.split('').forEach((char, index) => {
      const span = document.createElement('span');
      span.className = 'letter';
      span.textContent = char;
      span.style.transitionDelay = `${index * 0.05}s`;
      title.appendChild(span);
    });
  });

  
  // GLOBAL FUNCTIONS FOR TITLE ANIMATION
  window.animateContactTitles = function() {
    const letters = document.querySelectorAll('.popup-title .letter');
    letters.forEach(letter => {
      letter.classList.add('animate');
    });
  };

  window.resetContactTitles = function() {
    const letters = document.querySelectorAll('.popup-title .letter');
    letters.forEach(letter => {
      letter.classList.remove('animate');
    });
  };

  function animateTitles() {
    const letters = document.querySelectorAll('.popup-title .letter');
    letters.forEach(letter => {
      letter.classList.add('animate');
    });
  }

  function resetTitles() {
    const letters = document.querySelectorAll('.popup-title .letter');
    letters.forEach(letter => {
      letter.classList.remove('animate');
    });
  }

  
  // OPEN/CLOSE
  if (contactTrigger) {
    contactTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      popupOverlay.classList.add('active');
      setTimeout(animateTitles, 300);
    });
  }

  
  if (popupClose) {
    popupClose.addEventListener('click', () => {
      resetTitles();
      popupOverlay.classList.remove('active');
    });
  }

  
  if (popupOverlay) {
    popupOverlay.addEventListener('click', (e) => {
      if (e.target === popupOverlay) {
        resetTitles();
        popupOverlay.classList.remove('active');
      }
    });
  }

  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popupOverlay && popupOverlay.classList.contains('active')) {
      resetTitles();
      popupOverlay.classList.remove('active');
    }
  });

  
  // MOBILE MENU TOGGLE
  const logoBox = document.getElementById('logo-box');
  const mobileMenu = document.getElementById('mobile-menu');

  if (logoBox && mobileMenu) {
    logoBox.addEventListener('click', (e) => {
      
      if (window.innerWidth <= 767) {
        e.preventDefault(); 
        mobileMenu.classList.toggle('active'); 
      }
      
    });

    
    mobileMenu.querySelectorAll('a:not(.contact-trigger)').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active'); 
      });
    });

    
    const mobileContactTrigger = mobileMenu.querySelector('.contact-trigger');
    if (mobileContactTrigger && popupOverlay) {
      mobileContactTrigger.addEventListener('click', (e) => {
        e.preventDefault(); 
        mobileMenu.classList.remove('active'); 
        setTimeout(() => {
          popupOverlay.classList.add('active'); 
          animateTitles(); 
        }, 300); 
      });
    }

    
    document.addEventListener('click', (e) => {
      if (!logoBox.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('active'); 
      }
    });
  }

  
  // PAWN CURSOR
  const customCursor = document.getElementById('custom-cursor');
  if (customCursor) {
    
    document.addEventListener('mousemove', (e) => {
      customCursor.style.left = e.clientX + 'px';
      customCursor.style.top = e.clientY + 'px';
    });

    
    const draggableElements = document.querySelectorAll('a, button, [draggable="true"]');
    draggableElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        customCursor.classList.add('scaled');
      });
      el.addEventListener('mouseleave', () => {
        customCursor.classList.remove('scaled');
      });
    });
  }

  
  // BACKGROUND MUSIC
  const savedMusicTime = localStorage.getItem('bgMusicTime');
  const savedMusicPlaying = localStorage.getItem('bgMusicPlaying');
  
  if (savedMusicPlaying === 'true' && savedMusicTime) {
    const bgMusic = new Audio('sound/bgmusic.wav');
    bgMusic.loop = true;
    bgMusic.volume = 0.5;
    bgMusic.preload = 'auto';
    bgMusic.currentTime = parseFloat(savedMusicTime);
    bgMusic.play().then(() => {
      console.log("Music resumed from localStorage");
    }).catch(e => {
      console.log("Failed to resume music:", e);
    });
    
    
    setInterval(() => {
      if (!bgMusic.paused) {
        localStorage.setItem('bgMusicTime', bgMusic.currentTime.toString());
        localStorage.setItem('bgMusicPlaying', 'true');
      } else {
        localStorage.setItem('bgMusicPlaying', 'false');
      }
    }, 1000);
  }

  
  // AUTO-OPEN POPUP
  if (window.location.pathname.endsWith('contact.html') && popupOverlay) {
    popupOverlay.classList.add('active');
    setTimeout(animateTitles, 300);
  }
});

