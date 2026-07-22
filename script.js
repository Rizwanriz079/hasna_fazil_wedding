document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Global Elements & State
       ========================================================================= */
    const bgAudio = document.getElementById('bg-audio');
    const envelopeWrapper = document.getElementById('envelope-wrapper');
    const waxSeal = document.getElementById('wax-seal');
    const mainContent = document.getElementById('main-content');
    const musicBtn = document.getElementById('music-btn');
    const musicIconSvg = document.getElementById('music-icon-svg');

    let isPlaying = false;

    /* ==========================================================================
       2. Custom Cursor
       ========================================================================= */
    const cursor = document.getElementById('custom-cursor');
    const trail = document.getElementById('cursor-trail');

    let trailX = 0, trailY = 0;

    document.addEventListener('mousemove', (e) => {
        // Instantly move primary cursor
        cursor.style.left = e.clientX + 'px';
        cursor.style.top  = e.clientY + 'px';
        // Trail follows with slight CSS delay via transition
        trailX = e.clientX;
        trailY = e.clientY;
        trail.style.left = trailX + 'px';
        trail.style.top  = trailY + 'px';
    });

    document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
    document.addEventListener('mouseup',   () => cursor.classList.remove('clicking'));

    /* ==========================================================================
       3. Music Icon Button — play / pause toggle
       ========================================================================= */
    const PLAY_ICON = `<path d="M9 18V5l12-2v13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="1.5"/>
        <circle cx="18" cy="16" r="3" stroke="currentColor" stroke-width="1.5"/>`;

    const PAUSE_ICON = `<line x1="10" y1="15" x2="10" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <line x1="18" y1="15" x2="18" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M9 18V5l12-2v13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.3"/>
        <circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
        <circle cx="18" cy="16" r="3" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>`;

    function setMusicBtnState(playing) {
        if (playing) {
            musicBtn.classList.add('playing');
            musicIconSvg.innerHTML = PLAY_ICON;
        } else {
            musicBtn.classList.remove('playing');
            musicIconSvg.innerHTML = PAUSE_ICON;
        }
    }

    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgAudio.pause();
            isPlaying = false;
        } else {
            bgAudio.play().catch(e => console.log('Play error:', e));
            isPlaying = true;
        }
        setMusicBtnState(isPlaying);
    });

    /* ==========================================================================
       4. Interactive Envelope & Audio Activation (Autoplay Unlock)
       ========================================================================= */
    function playAudio() {
        if (!isPlaying) {
            bgAudio.play().then(() => {
                isPlaying = true;
                setMusicBtnState(true);
            }).catch(err => {
                console.log('Audio autoplay blocked, retrying on interaction:', err);
            });
        }
    }

    // Open envelope flaps, play audio, and reveal site on wax seal click
    waxSeal.addEventListener('click', () => {
        // Unlock and play audio
        playAudio();

        // Trigger flap open animation
        envelopeWrapper.classList.add('opened');

        // Reveal main website behind the opening doors early
        setTimeout(() => {
            mainContent.classList.remove('hidden');
            mainContent.classList.add('reveal-hero');
        }, 200);

        // Transit directly to main website as folds fly open
        setTimeout(() => {
            envelopeWrapper.classList.add('fade-out');

            // Show floating music button
            setTimeout(() => {
                musicBtn.classList.add('show');
            }, 200);

            // Start romantic particle flowers
            startPetals();
        }, 700);
    });

    /* ==========================================================================
       5. Countdown Timer Logic
       ========================================================================= */
    const targetDate = new Date('August 9, 2026 11:30:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        const dEl = document.getElementById('days');
        const hEl = document.getElementById('hours');
        const mEl = document.getElementById('minutes');
        const sEl = document.getElementById('seconds');

        if (!dEl || !hEl || !mEl || !sEl) return;

        if (difference <= 0) {
            dEl.innerText = '00';
            hEl.innerText = '00';
            mEl.innerText = '00';
            sEl.innerText = '00';
            return;
        }

        const days    = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours   = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        dEl.innerText = String(days).padStart(2, '0');
        hEl.innerText = String(hours).padStart(2, '0');
        mEl.innerText = String(minutes).padStart(2, '0');
        sEl.innerText = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    /* ==========================================================================
       6. Floating Ambient Particles (Gold / Rose Petals)
       ========================================================================= */
    const particleContainer = document.getElementById('particle-container');
    const maxPetals = 25;
    let petalCount = 0;

    function createPetal() {
        if (!particleContainer || petalCount >= maxPetals) return;

        const petal = document.createElement('div');
        petal.classList.add('gold-petal');
        petalCount++;

        const size     = Math.random() * 15 + 8;
        const left     = Math.random() * 100;
        const duration = Math.random() * 10 + 10;
        const opacity  = Math.random() * 0.4 + 0.2;
        const delay    = Math.random() * 2;

        petal.style.width           = `${size}px`;
        petal.style.height          = `${size}px`;
        petal.style.left            = `${left}%`;
        petal.style.opacity         = opacity;
        petal.style.animationDuration = `${duration}s`;
        petal.style.animationDelay    = `${delay}s`;
        petal.style.borderRadius    = Math.random() > 0.5 ? '50% 0 50% 50%' : '50% 50% 0 50%';

        particleContainer.appendChild(petal);

        setTimeout(() => {
            petal.remove();
            petalCount--;
        }, (duration + delay) * 1000);
    }

    function startPetals() {
        setInterval(createPetal, 700);
    }

    /* ==========================================================================
       7. Scroll Reveal Animation (IntersectionObserver)
       ========================================================================= */
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

});
