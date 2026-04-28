// BRUSH EFFECT
const mePhoto = document.getElementById('me-photo');
      const brushCursor = document.getElementById('brush-cursor');
      const colors = ['#ff69b4', '#ffd700', '#1e90ff', '#32cd32', '#f5f5dc']; 
      let colorIndex = 0; 
      let isHovering = false; 
      let currentColor = colors[0]; 
      const trailElements = []; 

      
      mePhoto.addEventListener('mouseenter', () => {
        isHovering = true; 
        currentColor = colors[colorIndex]; 
        brushCursor.style.backgroundColor = currentColor; 
        brushCursor.style.display = 'block'; 
        colorIndex = (colorIndex + 1) % colors.length; 
      });

      
      mePhoto.addEventListener('mousemove', (e) => {
        if (!isHovering) return; 
        const rect = mePhoto.getBoundingClientRect(); 
        const x = e.clientX - rect.left; 
        const y = e.clientY - rect.top; 
        
        
        brushCursor.style.left = x + 'px';
        brushCursor.style.top = y + 'px';
        
        
        const trail = document.createElement('div');
        trail.className = 'brush-trail';
        trail.style.left = x + 'px';
        trail.style.top = y + 'px';
        trail.style.backgroundColor = currentColor; 
        trail.style.width = '30px'; 
        trail.style.height = '30px'; 
        trail.style.position = 'absolute';
        trail.style.borderRadius = '50% 50% 50% 50% / 60% 60% 40% 40%'; 
        trail.style.pointerEvents = 'none'; 
        trail.style.opacity = '0.6'; 
        trail.style.transform = 'translate(-50%, -50%)'; 
        trail.style.transition = 'opacity 0.8s ease, transform 0.8s ease'; 
        trail.style.zIndex = '25'; 
        
        mePhoto.parentElement.appendChild(trail); 
        trailElements.push(trail); 
      });

      
      mePhoto.addEventListener('mouseleave', () => {
        isHovering = false; 
        brushCursor.style.display = 'none'; 
        
        
        trailElements.forEach(trail => {
          trail.style.opacity = '0'; 
          trail.style.transform = 'translate(-50%, -50%) scale(0)'; 
          setTimeout(() => {
            if (trail.parentElement) {
              trail.parentElement.removeChild(trail); 
            }
          }, 800); 
        });
        trailElements.length = 0; 
      });

      
      
      // ANGRYCAT SCROLL ANIMATION
      const angrycat = document.querySelector('.angrycat-top');
      const catpostWrap = document.querySelector('.catpost-wrap');
      const profileGrid = document.querySelector('.profile-grid');

      if (angrycat && catpostWrap && profileGrid) {
        window.addEventListener('scroll', () => {
          const gridRect = profileGrid.getBoundingClientRect(); 
          const windowHeight = window.innerHeight; 

          
          const sectionTop = gridRect.top;
          const sectionHeight = gridRect.height;

          
          if (sectionTop < windowHeight && sectionTop + sectionHeight > 0) {
            
            let progress = (windowHeight - sectionTop) / (windowHeight + sectionHeight);
            progress = Math.max(0, Math.min(1, progress)); 

            
            const catpostHeight = catpostWrap.offsetHeight;
            const angrycatHeight = angrycat.offsetHeight;
            const maxTop = catpostHeight + (angrycatHeight * 0.5); 

            angrycat.style.top = ((progress * maxTop) - (angrycatHeight * 0.2)) + 'px'; 
          }
        });
      }

      
      // SOUND EFFECTS
      const doimeoSound = new Audio("sound/doimeo.wav");
      const angrymeoSound = new Audio("sound/angrymeo.wav");
      doimeoSound.preload = "auto";
      angrymeoSound.preload = "auto";

      
      const aboutAngrycat = document.getElementById('about-angrycat');
      if (aboutAngrycat) {
        aboutAngrycat.addEventListener('mouseenter', () => {
          doimeoSound.currentTime = 0;
          doimeoSound.play().catch(e => console.log("Audio play failed:", e));
        });
      }

      
      const aboutMaincat = document.getElementById('about-maincat');
      if (aboutMaincat) {
        aboutMaincat.addEventListener('mouseenter', () => {
          angrymeoSound.currentTime = 0;
          angrymeoSound.play().catch(e => console.log("Audio play failed:", e));
        });
      }

      
      // PAWN CURSOR
      const customCursor = document.getElementById('custom-cursor');
      if (customCursor) {
        
        document.addEventListener('mousemove', (e) => {
          customCursor.style.left = e.clientX + 'px';
          customCursor.style.top = e.clientY + 'px';
        });

        
        const draggableElements = document.querySelectorAll('a, button, [draggable="true"], .about-photo');
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
          console.log("Music resumed from localStorage in about.html");
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