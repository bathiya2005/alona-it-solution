/**
 * Alona Digital Solution - Main JavaScript Core Script
 * Fully Vanilla JS - No libraries or frameworks.
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. STICKY NAVBAR CONTROL ---
  const navbar = document.querySelector('.navbar');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger on load once


  // --- 2. MOBILE HAMBURGER MENU ---
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }


  // --- 3. ACTIVE MENU ITEM HIGHLIGHTER ---
  const currentPath = window.location.pathname;
  const pageName = currentPath.split("/").pop() || "index.html";
  
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === pageName || (pageName === "index.html" && href === "/")) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });


  // --- 4. REVEAL ELECT ON SCROLL ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve once revealed to keep animations clean
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // --- 5. STATS ANIMATED COUNTERS ---
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const speed = 120; // Lower is faster
    const increment = target / speed;
    let count = 0;

    const updateCount = () => {
      count += increment;
      if (count < target) {
        el.innerHTML = `<span>${Math.ceil(count)}</span>${suffix}`;
        setTimeout(updateCount, 10);
      } else {
        el.innerHTML = `<span>${target}</span>${suffix}`;
      }
    };
    updateCount();
  };

  const statsSection = document.querySelector('.stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statNumbers.forEach(num => animateCounter(num));
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.3
    });
    statsObserver.observe(statsSection);
  }


  // --- 6. PORTFOLIO JS CATEGORY FILTER ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (filterBtns.length > 0 && portfolioItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Toggle active button class
        filterBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');

        const filterValue = e.currentTarget.getAttribute('data-filter');

        portfolioItems.forEach(item => {
          const itemCategories = item.getAttribute('data-category').split(' ');
          
          if (filterValue === 'all' || itemCategories.includes(filterValue)) {
            item.classList.remove('hidden');
            // Adding small visual entry fade trigger
            item.style.opacity = '0';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 50);
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }


  // --- 7. VANILLA TESTIMONIAL SLIDER ---
  const track = document.querySelector('.testimonials-track');
  const slides = Array.from(document.querySelectorAll('.testimonial-slide'));
  const prevBtn = document.querySelector('.ctrl-prev');
  const nextBtn = document.querySelector('.ctrl-next');
  const dotsContainer = document.querySelector('.slider-dots');

  if (track && slides.length > 0) {
    let currentIndex = 0;
    let slideInterval;

    // Build dots dynamically based on number of slides
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('slider-dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        goToSlide(index);
        resetAutoplay();
      });
      if (dotsContainer) dotsContainer.appendChild(dot);
    });

    const dots = Array.from(document.querySelectorAll('.slider-dot'));

    const updateDots = (index) => {
      dots.forEach((dot, idx) => {
        if (idx === index) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    };

    const goToSlide = (index) => {
      if (index < 0) {
        currentIndex = slides.length - 1;
      } else if (index >= slides.length) {
        currentIndex = 0;
      } else {
        currentIndex = index;
      }
      
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots(currentIndex);
    };

    const nextSlide = () => goToSlide(currentIndex + 1);
    const prevSlide = () => goToSlide(currentIndex - 1);

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoplay();
      });
    }

    const startAutoplay = () => {
      slideInterval = setInterval(nextSlide, 6000);
    };

    const resetAutoplay = () => {
      clearInterval(slideInterval);
      startAutoplay();
    };

    startAutoplay();
  }


  // --- 8. BACK TO TOP BUTTON CONTROL ---
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('active');
      } else {
        backToTopBtn.classList.remove('active');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  // --- 9. INTERACTIVE CONTACT FORM SUBMISSION GLITCH-FREE ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Select input components
      const nameVal = contactForm.querySelector('input[type="text"]').value;
      const emailVal = contactForm.querySelector('input[type="email"]').value;
      
      // UI Success Alert simulation (visually matching the professional dark neon style)
      const formCard = document.querySelector('.contact-form-card');
      const originalHTML = formCard.innerHTML;
      
      formCard.style.opacity = '0';
      formCard.style.transform = 'translateY(10px)';
      
      setTimeout(() => {
        formCard.innerHTML = `
          <div style="text-align: center; padding: 2rem 0;">
            <div style="width: 80px; height: 80px; border-radius: 50%; background: rgba(0, 240, 255, 0.1); border: 2px solid var(--color-primary); display: flex; justify-content: center; align-items: center; margin: 0 auto 2rem; color: var(--color-primary);">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <h3 style="font-family: var(--font-display); font-size: 2rem; margin-bottom: 1rem; color: #ffffff;">Message Sent Successfully!</h3>
            <p style="color: var(--color-text-muted); font-size: 1.1rem; max-width: 450px; margin: 0 auto 2rem; line-height: 1.6;">
              Thank you, <strong>${nameVal}</strong>. Our digital enablement architects will review your project specification and get back to you at <strong>${emailVal}</strong> within 12 hours.
            </p>
            <button id="resetFormBtn" class="btn btn-secondary" style="margin: 0 auto;">Send Another Message</button>
          </div>
        `;
        formCard.style.opacity = '1';
        formCard.style.transform = 'translateY(0)';
        
        // Setup reset action
        document.getElementById('resetFormBtn').addEventListener('click', () => {
          formCard.style.opacity = '0';
          setTimeout(() => {
            formCard.innerHTML = originalHTML;
            formCard.style.opacity = '1';
            // Recursively bind form validation again
            contactForm.addEventListener('submit', (ev) => ev.preventDefault());
          }, 300);
        });
      }, 400);
    });
  }

});
