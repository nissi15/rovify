document.addEventListener('DOMContentLoaded', () => {

    // 0. Custom Cursor Logic
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (cursorDot) {
            cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        }
    });

    const animateCursor = () => {
        if (cursorOutline) {
            // Smooth trailing interpolation
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;
        }
        requestAnimationFrame(animateCursor);
    };
    animateCursor();

    const addHoverToElements = document.querySelectorAll('a, button, .bento-card, .magnetic-btn');
    addHoverToElements.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    // 0.5. Scroll Reveal Observer
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-slide-left, .reveal-slide-right');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    revealElements.forEach(el => revealObserver.observe(el));

    // 1. Text Scramble Effect for Hero (Matrix Style)
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }
        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }
        update() {
            let output = '';
            let complete = 0;
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += `<span class="muted">${char}</span>`;
                } else {
                    output += from;
                }
            }
            this.el.innerHTML = output;
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }

    const scrambleElements = document.querySelectorAll('.scramble-text');
    scrambleElements.forEach(el => {
        const text = el.innerText;
        el.innerText = '';
        const fx = new TextScramble(el);
        setTimeout(() => fx.setText(text), 200);
    });

    // 2. Parallax Tilt Card Effect (3D tracking)
    const tiltContainers = document.querySelectorAll('.parallax-tilt');
    tiltContainers.forEach(container => {
        const inner = container.querySelector('.glass-panel') || container;

        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const multiplier = 20;
            const xRotate = multiplier * ((y - rect.height / 2) / rect.height);
            const yRotate = -multiplier * ((x - rect.width / 2) / rect.width);

            inner.style.transform = `perspective(1000px) rotateX(${xRotate}deg) rotateY(${yRotate}deg)`;
        });

        container.addEventListener('mouseleave', () => {
            inner.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // 3. Spotlight Border Cards
    document.getElementById("cards_container");
    document.body.onmousemove = e => {
        for (const card of document.getElementsByClassName("spotlight-card")) {
            const rect = card.getBoundingClientRect(),
                x = e.clientX - rect.left,
                y = e.clientY - rect.top;
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        }
    };

    // 4. Live Chart perpetual randomizer
    const chartBars = document.querySelectorAll('.live-chart .bar');
    if (chartBars.length > 0) {
        setInterval(() => {
            chartBars.forEach(bar => {
                const h = Math.floor(Math.random() * 80) + 10;
                bar.style.height = `${h}%`;
            });
        }, 800);
    }

    // 5. Magnetic Buttons
    const magnetically = document.querySelectorAll('.magnetic-btn');
    magnetically.forEach(btn => {
        btn.addEventListener('mousemove', function (e) {
            const position = btn.getBoundingClientRect();
            const x = e.pageX - position.left - position.width / 2;
            const y = e.pageY - position.top - position.height / 2;

            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
        });

        btn.addEventListener('mouseout', function () {
            btn.style.transform = `translate(0px, 0px)`;
        });
    });

    // 6. Manifesto Scroll Effect
    const massiveTexts = document.querySelectorAll('.massive-text');
    const manifestoSec = document.querySelector('.manifesto');
    if (manifestoSec && massiveTexts.length >= 3) {
        window.addEventListener('scroll', () => {
            const rect = manifestoSec.getBoundingClientRect();
            const scrollPos = window.innerHeight - rect.top;

            if (rect.top <= window.innerHeight && rect.bottom >= 0) {
                const multiplier = 0.15;
                massiveTexts[0].style.transform = `translateX(${scrollPos * multiplier}px)`;
                massiveTexts[1].style.transform = `translateX(${-scrollPos * multiplier}px)`;
                massiveTexts[2].style.transform = `translateX(${scrollPos * multiplier}px)`;

                const photo = document.querySelector('.scrolling-photo');
                if (photo) {
                    photo.style.transform = `translate(-50%, -50%) scale(${1 + scrollPos * 0.0003})`;
                }
            }
        });
    }
    // 7. Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.classList.toggle('light-theme');
            if (document.body.classList.contains('light-theme')) {
                themeToggle.innerText = 'DARK MODE';
            } else {
                themeToggle.innerText = 'LIGHT MODE';
            }
        });
    }

});
