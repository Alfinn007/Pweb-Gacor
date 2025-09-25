// const NavbarNav = document.querySelector ('.navbar-navigation')

// document.querySelector ('#hamburger-menu').onclick = () => {
//   NavbarNav.classList.toggle('active')
// };

document.addEventListener('DOMContentLoaded', function() {
  const slider = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');
  const keyboardHint = document.querySelector('.keyboard-hint');
  
  let currentSlide = 0;
  let slideWidth = slides[0].clientWidth;
  let isTransitioning = false;
  let startX = 0;
  let currentX = 0;
  let isDragging = false;
  let autoSlideInterval;
  
  function initSlider() {
    slideWidth = slides[0].clientWidth;
    slider.style.transform = `translateX(0px)`;
    
    startAutoSlide();
    
    window.addEventListener('resize', handleResize);
    prevBtn.addEventListener('click', goToPrevSlide);
    nextBtn.addEventListener('click', goToNextSlide);
    document.addEventListener('keydown', handleKeydown);
    slider.addEventListener('touchstart', handleTouchStart, { passive: false });
    slider.addEventListener('touchmove', handleTouchMove, { passive: false });
    slider.addEventListener('touchend', handleTouchEnd);
    slider.addEventListener('mousedown', handleMouseDown);
    slider.addEventListener('mousemove', handleMouseMove);
    slider.addEventListener('mouseup', handleMouseUp);
    slider.addEventListener('mouseleave', handleMouseUp);

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => goToSlide(index));
    });
  }
  
  function handleResize() {
    slideWidth = slides[0].clientWidth;
    slider.style.transition = 'none';
    slider.style.transform = `translateX(${-currentSlide * slideWidth}px)`;
    void slider.offsetWidth;
    slider.style.transition = 'transform 0.5s ease-in-out';
  }
  
  function goToSlide(index) {
    if (isTransitioning) return;
    isTransitioning = true;
    currentSlide = index;
    slider.style.transform = `translateX(${-currentSlide * slideWidth}px)`;
    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentSlide].classList.add('active');
    resetAutoSlide();
    setTimeout(() => {
      isTransitioning = false;
    }, 500);
  }

  function goToNextSlide() {
    if (isTransitioning) return;
    if (currentSlide >= slides.length - 1) {
      goToSlide(0);
    } else {
      goToSlide(currentSlide + 1);
    }
  }

  function goToPrevSlide() {
    if (isTransitioning) return;
    if (currentSlide <= 0) {
      goToSlide(slides.length - 1);
    } else {
      goToSlide(currentSlide - 1);
    }
  }

  function handleKeydown(e) {
    keyboardHint.style.display = 'block';
    setTimeout(() => {
      keyboardHint.style.display = 'none';
    }, 2000);
    
    if (e.key === 'ArrowRight') {
      goToNextSlide();
    } else if (e.key === 'ArrowLeft') {
      goToPrevSlide();
    }
  }

  function handleTouchStart(e) {
    startX = e.touches[0].clientX;
    isDragging = true;
    slider.style.transition = 'none';
    resetAutoSlide();
  }
  
  function handleTouchMove(e) {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
    const diff = startX - currentX;
    if (Math.abs(diff) > 10) {
      e.preventDefault();
    }
    
    slider.style.transform = `translateX(${-currentSlide * slideWidth - diff}px)`;
  }
  
  function handleTouchEnd() {
    if (!isDragging) return;
    isDragging = false;
    slider.style.transition = 'transform 0.5s ease-in-out';
    const diff = startX - currentX;
    if (Math.abs(diff) > slideWidth / 4) {
      if (diff > 0) {
        goToNextSlide();
      } else {
        goToPrevSlide();
      }
    } else {
      slider.style.transform = `translateX(${-currentSlide * slideWidth}px)`;
    }
    startAutoSlide();
  }
  
  function handleMouseDown(e) {
    startX = e.clientX;
    isDragging = true;
    slider.style.transition = 'none';
    resetAutoSlide();
    slider.style.cursor = 'grabbing';
  }
  
  function handleMouseMove(e) {
    if (!isDragging) return;
    currentX = e.clientX;
    const diff = startX - currentX;
    slider.style.transform = `translateX(${-currentSlide * slideWidth - diff}px)`;
  }
  
  function handleMouseUp() {
    if (!isDragging) return;
    isDragging = false;
    slider.style.transition = 'transform 0.5s ease-in-out';
    slider.style.cursor = 'grab';
    const diff = startX - currentX;
    if (Math.abs(diff) > slideWidth / 4) {
      if (diff > 0) {
        goToNextSlide();
      } else {
        goToPrevSlide();
      }
    } else {
      slider.style.transform = `translateX(${-currentSlide * slideWidth}px)`;
    }
    startAutoSlide();
  }
  function startAutoSlide() {
    autoSlideInterval = setInterval(goToNextSlide, 10000); 
  }
  
  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
  }
  
  slider.addEventListener('mouseenter', resetAutoSlide);
  slider.addEventListener('mouseleave', startAutoSlide);
  slider.addEventListener('touchstart', resetAutoSlide);
  slider.addEventListener('touchend', startAutoSlide);
  initSlider();
});
