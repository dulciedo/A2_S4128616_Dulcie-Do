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
    console.log("Music resumed from localStorage in work.html");
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
