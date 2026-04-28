(() => {
  
  
  const carousels = document.querySelectorAll(".auto-carousel");

  
  carousels.forEach((carousel) => {
    
    const track = carousel.querySelector(".carousel-track");
    if (!track) return; 

    
    const baseSlides = Array.from(track.children);
    if (baseSlides.length === 0) return; 
    
    
    
    baseSlides.forEach((slide) => {
      track.appendChild(slide.cloneNode(true));
    });

    
    
    const speed = Number(carousel.dataset.speed || 0.35); 
    const gap = 24; 
    let targetSpeed = speed; 
    let currentSpeed = speed; 
    const easing = 0.08; 

    
    function step() {
      
      currentSpeed += (targetSpeed - currentSpeed) * easing;
      
      
      if (Math.abs(currentSpeed) > 0.01) {
        track.scrollLeft += currentSpeed; 

        
        
        const half = track.scrollWidth / 2;
        if (track.scrollLeft >= half) {
          track.scrollLeft -= half; 
        }
      }

      
      window.requestAnimationFrame(step);
    }

    
    track.scrollLeft = 0; 
    window.requestAnimationFrame(step); 

    
    
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (canHover) {
      
      carousel.addEventListener("mouseenter", () => {
        targetSpeed = 0; 
      });

      
      carousel.addEventListener("mouseleave", () => {
        targetSpeed = speed; 
      });
    }

    
    const prevBut = carousel.querySelector(".carousel-but.prev");
    const nextBut = carousel.querySelector(".carousel-but.next");

    
    function getJumpAmount() {
      const firstSlide = track.firstElementChild;
      if (!firstSlide) return 900; 
      return firstSlide.getBoundingClientRect().width + gap; 
    }

    
    prevBut?.addEventListener("click", () => {
      track.scrollBy({ left: -getJumpAmount(), behavior: "smooth" });
    });

    
    nextBut?.addEventListener("click", () => {
      track.scrollBy({ left: getJumpAmount(), behavior: "smooth" });
    });
  });

  
  
  // YOUTUBE PLAYER 
  let youtubePlayer = null;
  let youtubeApiLoaded = false;

  function loadYouTubeAPI() {
    if (youtubeApiLoaded) return;
    youtubeApiLoaded = true;
    
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  window.onYouTubeIframeAPIReady = function() {
    const iframe = document.getElementById('youtube-player');
    if (iframe) {
      youtubePlayer = new YT.Player('youtube-player', {
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
    }
  };

  function onPlayerReady(event) {
    const wrap = event.target.getIframe().closest('.video-shell');
    const playBut = wrap?.querySelector('.video-play-but');
    
    playBut?.addEventListener('click', () => {
      event.target.playVideo();
    });

    // Hide default cursor
    const iframe = event.target.getIframe();
    iframe.style.cursor = 'none';
    
    // Use pointer-events-none on iframe
    const cursorOverlay = wrap?.querySelector('.video-cursor-overlay');
    if (cursorOverlay) {
      cursorOverlay.style.pointerEvents = 'auto';
      cursorOverlay.addEventListener('click', () => {
        if (event.target.getPlayerState() === YT.PlayerState.PLAYING) {
          event.target.pauseVideo();
        } else {
          event.target.playVideo();
        }
      });
    }
  }

  function onPlayerStateChange(event) {
    const wrap = event.target.getIframe().closest('.video-shell');
    const playBut = wrap?.querySelector('.video-play-but');
    
    if (playBut) {
      if (event.data === YT.PlayerState.PLAYING) {
        playBut.style.opacity = '0';
        playBut.style.pointerEvents = 'none';
      } else {
        playBut.style.opacity = '1';
        playBut.style.pointerEvents = 'auto';
      }
    }
  }

  // Check YouTube exists
  const youtubeIframe = document.querySelector('iframe.diamond-video[data-click-play]');
  if (youtubeIframe) {
    loadYouTubeAPI();
  }

  // ORIGINAL VIDEO CODE
  document.querySelectorAll("video[data-click-play]").forEach((video) => {
    
    const wrap = video.closest(".video-shell");
    
    const playBut = wrap?.querySelector(".video-play-but");

    
    
    function hideCursorOnControls() {
      
      video.style.cursor = 'none';

      
      const allChildren = video.querySelectorAll('*');
      allChildren.forEach(el => {
        el.style.cursor = 'none';
      });

      
      document.body.style.cursor = 'none';
    }

    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { 
            node.style.cursor = 'none';
            
            const children = node.querySelectorAll('*');
            children.forEach(child => {
              child.style.cursor = 'none';
            });
          }
        });
      });
    });

    
    observer.observe(video, {
      childList: true,
      subtree: true
    });

    
    video.addEventListener('loadedmetadata', hideCursorOnControls);
    
    setInterval(hideCursorOnControls, 500);

    
    video.addEventListener('mousemove', (e) => {
      e.target.style.cursor = 'none';
      if (e.target !== video) {
        const allChildren = video.querySelectorAll('*');
        allChildren.forEach(el => {
          el.style.cursor = 'none';
        });
      }
    });

    
    video.addEventListener('mouseenter', () => {
      document.body.style.cursor = 'none';
      hideCursorOnControls();
    });

    
    hideCursorOnControls();

    
    
    function syncPlayButton() {
      if (!playBut) return; 
      
      playBut.style.opacity = video.paused ? "1" : "0";
      
      playBut.style.pointerEvents = video.paused ? "auto" : "none";
    }

    
    playBut?.addEventListener("click", () => {
      video.play(); 
    });

    
    video.addEventListener("click", () => {
      if (video.paused) {
        video.play(); 
      } else {
        video.pause(); 
      }
    });

    
    
    video.addEventListener("play", syncPlayButton);
    
    video.addEventListener("pause", syncPlayButton);
    
    video.addEventListener("ended", syncPlayButton);

    
    syncPlayButton();
  });

  
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
})(); 


const savedMusicTime = localStorage.getItem('bgMusicTime');
const savedMusicPlaying = localStorage.getItem('bgMusicPlaying');

if (savedMusicPlaying === 'true' && savedMusicTime) {
  const bgMusic = new Audio('sound/bgmusic.wav');
  bgMusic.loop = true;
  bgMusic.volume = 0.5;
  bgMusic.preload = 'auto';
  bgMusic.currentTime = parseFloat(savedMusicTime);
  bgMusic.play().then(() => {
    console.log("Music resumed from localStorage in diamond.html");
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