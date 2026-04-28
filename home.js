(function () {
  
  // INTRO SCREEN ANIMATION
  const slide1Content = document.querySelector('.slide-1-content');

  if (slide1Content) {
    
    const introPlayed = localStorage.getItem('introAnimationPlayed');

    
    localStorage.removeItem('introAnimationPlayed');

    if (introPlayed === 'true') {
      
      slide1Content.classList.add('loaded', 'letters-animated', 'subtitle-visible', 'cats-bounce', 'cats-wiggle');
    } else {
      
      window.addEventListener('load', () => {
        setTimeout(() => {
          slide1Content.classList.add('loaded');

          
          setTimeout(() => {
            slide1Content.classList.add('letters-animated');

            
            setTimeout(() => {
              slide1Content.classList.add('subtitle-visible');

              
              setTimeout(() => {
                slide1Content.classList.add('cats-bounce');

                
                setTimeout(() => {
                  slide1Content.classList.add('cats-wiggle');

                  
                  localStorage.setItem('introAnimationPlayed', 'true');
                }, 800);
              }, 800);
            }, 3050);
          }, 1200);
        }, 100);
      });
    }
  }

  
  // PAWN CURSOR
  const customCursor = document.getElementById('custom-cursor');
  if (customCursor) {
    
    document.addEventListener('mousemove', (e) => {
      customCursor.style.left = e.clientX + 'px';
      customCursor.style.top = e.clientY + 'px';
    });

    
    const draggableElements = document.querySelectorAll('a, button, .skill-app, .sticker, [draggable="true"]');
    draggableElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        customCursor.classList.add('scaled');
      });
      el.addEventListener('mouseleave', () => {
        customCursor.classList.remove('scaled');
      });
    });
  }

  
  // BG MUSIC & SOUND
  document.addEventListener('DOMContentLoaded', () => {
    const carotCats = document.querySelectorAll('#carot-cat, #carot-cat-mobile, #carot-cat-mobile-2');
    console.log("Found carot cats:", carotCats.length);
    
    
    const bgMusic = new Audio('sound/bgmusic.wav');
    bgMusic.loop = true;
    bgMusic.volume = 0.5;
    bgMusic.preload = 'auto';
    
    let isMusicPlaying = false;

    
    const savedMusicTime = localStorage.getItem('bgMusicTime');
    const savedMusicPlaying = localStorage.getItem('bgMusicPlaying');
    
    if (savedMusicPlaying === 'true' && savedMusicTime) {
      bgMusic.currentTime = parseFloat(savedMusicTime);
      bgMusic.play().then(() => {
        isMusicPlaying = true;
        console.log("Music resumed from localStorage");
      }).catch(e => {
        console.log("Failed to resume music:", e);
      });
    }

    
    setInterval(() => {
      if (isMusicPlaying) {
        localStorage.setItem('bgMusicTime', bgMusic.currentTime.toString());
        localStorage.setItem('bgMusicPlaying', 'true');
      } else {
        localStorage.setItem('bgMusicPlaying', 'false');
      }
    }, 1000);

    carotCats.forEach(carotCat => {
      if (carotCat) {
        
        const satSound = new Audio('sound/sat.wav');
        satSound.volume = 0.5;
        satSound.preload = 'auto';
        
        carotCat.addEventListener('mouseenter', () => {
          console.log("Hover on carot cat");
          satSound.currentTime = 0;
          satSound.play().catch(e => console.log("Sat sound play failed:", e));
        });

        
        carotCat.addEventListener('click', (e) => {
          e.preventDefault();
          console.log("Click on carot cat - playing bgmusic");
          
          if (isMusicPlaying) {
            bgMusic.pause();
            isMusicPlaying = false;
            localStorage.setItem('bgMusicPlaying', 'false');
            console.log("Music paused");
          } else {
            
            bgMusic.play().then(() => {
              isMusicPlaying = true;
              localStorage.setItem('bgMusicPlaying', 'true');
              console.log("Music playing and looping");
            }).catch(e => {
              console.log("Bg music play failed:", e);
              alert("Không thể phát nhạc. Vui lòng kiểm tra file bgmusic.wav trong thư mục sound/");
            });
          }
        });
      }
    });
  });

  
  
  // SLIDE 3: DRAGGABLE STICKERS AND NAV BOXES
  const slide = document.querySelector(".slide-3");
  if (!slide) return;

  const stickers = Array.from(slide.querySelectorAll(".sticker"));
  const navBoxes = Array.from(slide.querySelectorAll(".nav-box"));

  
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  
  
  // RANDOM STICKER POSITIONING
  function placeStickerRandom(sticker) {
    const maxX = Math.max(0, slide.clientWidth - sticker.offsetWidth - 20);
    const maxY = Math.max(0, slide.clientHeight - sticker.offsetHeight - 20);
    const randomX = Math.floor(Math.random() * (maxX + 1));
    const randomY = Math.floor(Math.random() * (maxY + 1));
    sticker.style.left = randomX + "px";
    sticker.style.top = randomY + "px";
  }

  function randomizeAllStickers() {
    stickers.forEach(placeStickerRandom);
  }

  
  
  // DRAGGABLE FUNCTION WITH ROTATION EFFECT
  function makeDraggable(element, onDropCallback) {
    element.style.position = "absolute";
    element.style.touchAction = "none";
    element.draggable = false;

    let offsetX = 0;
    let offsetY = 0;
    let dragging = false;
    let rotation = 0;
    let rotationVelocity = 0;
    let isSticker = element.classList.contains("sticker");
    let originalRotation = isSticker ? getComputedStyle(element).getPropertyValue("--rotation") || "0deg" : "0deg";

    element.addEventListener("pointerdown", (event) => {
      dragging = true;
      element.classList.add("dragging");
      element.setPointerCapture(event.pointerId);

      const rect = element.getBoundingClientRect();
      offsetX = event.clientX - rect.left;
      offsetY = event.clientY - rect.top;
    });

    element.addEventListener("pointermove", (event) => {
      if (!dragging) return;

      const nextX = clamp(
        event.clientX - slide.getBoundingClientRect().left - offsetX,
        0,
        slide.clientWidth - element.offsetWidth
      );

      const nextY = clamp(
        event.clientY - slide.getBoundingClientRect().top - offsetY,
        0,
        slide.clientHeight - element.offsetHeight
      );

      element.style.left = nextX + "px";
      element.style.top = nextY + "px";

      
      if (isSticker) {
        rotationVelocity += (Math.random() - 0.5) * 3;
        rotation += rotationVelocity;
        element.style.transform = `rotate(${rotation}deg)`;
      }

      
      if (element.classList.contains("nav-box")) {
        rotationVelocity += (Math.random() - 0.5) * 2;
        rotation += rotationVelocity;
        element.style.transform = element.classList.contains("contact-box") 
          ? `translateX(50%) rotate(${rotation}deg)`
          : `translateX(-50%) rotate(${rotation}deg)`;
      }
    });

    function stopDragging() {
      dragging = false;
      element.classList.remove("dragging");
      
      if (isSticker) {
        
        element.classList.add("rotating");
        let damping = 0.98;
        
        function continueRotation() {
          if (Math.abs(rotationVelocity) > 0.1) {
            rotation += rotationVelocity;
            rotationVelocity *= damping;
            element.style.transform = `rotate(${rotation}deg)`;
            requestAnimationFrame(continueRotation);
          } else {
            element.classList.remove("rotating");
            rotation = 0;
            rotationVelocity = 0;
            element.style.transform = `translateX(0) rotate(${originalRotation})`;
          }
        }
        continueRotation();
      }
      
      if (element.classList.contains("nav-box")) {
        element.classList.add("rotating");
        setTimeout(() => {
          element.classList.remove("rotating");
          rotation = 0;
          rotationVelocity = 0;
          element.style.transform = element.classList.contains("contact-box")
            ? "translateX(50%)"
            : "translateX(-50%)";
        }, 3000);
      }

      if (onDropCallback) {
        onDropCallback(element);
      }
    }

    element.addEventListener("pointerup", stopDragging);
    element.addEventListener("pointercancel", stopDragging);
  }

  
  stickers.forEach((sticker) => {
    makeDraggable(sticker);
  });

  
  // NAV BOXES
  navBoxes.forEach((box) => {
    makeDraggable(box, (element) => {
      
    });
    
    
    
    box.addEventListener("dblclick", (event) => {
      
      if (box.classList.contains("contact-box")) {
        const popupOverlay = document.getElementById('contact-popup-overlay');
        
        if (popupOverlay) {
          popupOverlay.classList.add('active');
          
          
          if (typeof window.resetContactTitles === 'function') {
            window.resetContactTitles();
          }
          
          setTimeout(() => {
            if (typeof window.animateContactTitles === 'function') {
              window.animateContactTitles();
            }
          }, 300);
        }
      } else {
        
        const target = box.getAttribute("data-target");
        if (target) {
          window.location.href = target;
        }
      }
    });
  });

  window.addEventListener("load", randomizeAllStickers);
  window.addEventListener("resize", randomizeAllStickers);

  
  
  // SLIDE 2: DRAG & DROP TO FEED MEONGU
  const slide2 = document.querySelector(".slide-2");
  if (slide2) {
    const skillApps = Array.from(slide2.querySelectorAll(".skill-app"));
    const meongu = slide2.querySelector(".meongu");
    const meocan = slide2.querySelector(".meocan");
    const skillGrid = slide2.querySelector(".skill-grid");
    const skillHeading = slide2.querySelector("#skill-heading");

    
    if (meocan) {
      meocan.style.display = "block";
      meocan.classList.remove("active");
    }
    if (meongu) {
      meongu.style.display = "block";
    }

    
    const darkmeoSound = new Audio("sound/darkmeo.wav");
    darkmeoSound.preload = "auto"; 

    
    let isDragging = false;

    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }

    
    // DRAG & DROP LOGIC
    skillApps.forEach((app) => {
      app.style.touchAction = "none";
      app.draggable = false;

      let offsetX = 0;
      let offsetY = 0;
      let dragging = false;
      let originalParent = app.parentElement;
      let originalStyle = {
        position: app.style.position,
        left: app.style.left,
        top: app.style.top,
        transform: app.style.transform,
        zIndex: app.style.zIndex
      };

      app.addEventListener("pointerdown", (event) => {
        dragging = true;
        isDragging = true;
        app.classList.add("dragging");
        app.setPointerCapture(event.pointerId);
        skillGrid.classList.add("drag-active");

        const rect = app.getBoundingClientRect();
        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;

        
        const originalWidth = rect.width;
        const originalHeight = rect.height;

        
        if (meocan) {
          meocan.classList.add("active");
          darkmeoSound.currentTime = 0;
          darkmeoSound.play().catch(e => console.log("Audio play failed:", e));
        }
        
        if (skillHeading) {
          skillHeading.style.display = "none";
        }

        
        document.body.appendChild(app);
        app.style.position = "fixed";
        app.style.zIndex = "1000";
        app.style.width = originalWidth + "px";
        app.style.height = originalHeight + "px";
        app.style.transform = "none";
        app.style.left = (event.clientX - offsetX) + "px";
        app.style.top = (event.clientY - offsetY) + "px";
      });

      app.addEventListener("pointermove", (event) => {
        if (!dragging) return;

        app.style.left = (event.clientX - offsetX) + "px";
        app.style.top = (event.clientY - offsetY) + "px";
      });

      function stopDragging() {
        dragging = false;
        isDragging = false;
        app.classList.remove("dragging");
        skillGrid.classList.remove("drag-active");

        
        const meocanRect = meocan ? meocan.getBoundingClientRect() : null;
        const appRect = app.getBoundingClientRect();
        
        if (meocanRect && meocan.classList.contains("active") &&
            appRect.left < meocanRect.right &&
            appRect.right > meocanRect.left &&
            appRect.top < meocanRect.bottom &&
            appRect.bottom > meocanRect.top) {
          
          
          app.style.display = "none";
          
          
          if (meocan) {
            meocan.classList.remove("active");
          }
          if (meongu) {
            meongu.style.display = "block";
          }
          
          if (skillHeading) {
            skillHeading.style.display = "block";
          }
        } else {
          
          originalParent.appendChild(app);
          Object.assign(app.style, originalStyle);
          
          
          if (!isDragging && meocan) {
            meocan.classList.remove("active");
          }
          
          if (skillHeading) {
            skillHeading.style.display = "block";
          }
        }
      }

      app.addEventListener("pointerup", stopDragging);
      app.addEventListener("pointercancel", stopDragging);
    });
  }
})();
