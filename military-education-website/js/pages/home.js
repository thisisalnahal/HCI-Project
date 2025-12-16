document.addEventListener('DOMContentLoaded', function() {
    // === Services Slider ===
    const track = document.getElementById('servicesTrack');
    const slides = document.querySelectorAll('.services-slide');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    const dots = document.querySelectorAll('.slider-dots .dot');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoSlideInterval;
    let isAnimating = false;
    
    // === Update Slider Position ===
    function updateSlider(animate = true) {
        if (isAnimating && animate) return;
        
        isAnimating = true;
        
        // Update track position - RTL so we use positive translateX
        if (track) {
            track.style.transition = animate ? 'transform 0.5s ease-in-out' : 'none';
            track.style.transform = `translateX(${currentSlide * 100}%)`;
        }
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
        
        setTimeout(() => {
            isAnimating = false;
        }, animate ? 500 : 0);
    }
    
    // === Go to Next Slide ===
    function nextSlide() {
        if (isAnimating) return;
        
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
        } else {
            currentSlide = 0;
        }
        updateSlider();
    }
    
    // === Go to Previous Slide ===
    function prevSlide() {
        if (isAnimating) return;
        
        if (currentSlide > 0) {
            currentSlide--;
        } else {
            currentSlide = totalSlides - 1;
        }
        updateSlider();
    }
    
    // === Go to Specific Slide ===
    function goToSlide(index) {
        if (isAnimating) return;
        
        if (index >= 0 && index < totalSlides && index !== currentSlide) {
            currentSlide = index;
            updateSlider();
        }
    }
    
    // === Auto Slide ===
    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }
    
    // === Event Listeners ===
    nextBtn?.addEventListener('click', function() {
        nextSlide();
        startAutoSlide();
    });
    
    prevBtn?.addEventListener('click', function() {
        prevSlide();
        startAutoSlide();
    });
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            goToSlide(index);
            startAutoSlide();
        });
    });
    
    // Pause on hover
    const servicesSection = document.querySelector('.services-slider');
    servicesSection?.addEventListener('mouseenter', stopAutoSlide);
    servicesSection?.addEventListener('mouseleave', startAutoSlide);
    
    // === Touch/Swipe Support ===
    let touchStartX = 0;
    let touchEndX = 0;
    const wrapper = document.querySelector('.services-wrapper');
    
    wrapper?.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoSlide();
    }, { passive: true });
    
    wrapper?.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                prevSlide(); // RTL
            } else {
                nextSlide(); // RTL
            }
        }
        startAutoSlide();
    }, { passive: true });
    
    // === Initialize ===
    updateSlider(false);
    startAutoSlide();
    
    // Pause when tab is hidden
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            stopAutoSlide();
        } else {
            startAutoSlide();
        }
    });
});