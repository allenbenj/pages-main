// Orbital Carousel Navigation - Shared Script
(function() {
    const items = document.querySelectorAll('.orbital-item');
    if (!items.length) return; // Exit if no carousel on page
    
    const totalItems = items.length;
    const indicatorsContainer = document.getElementById('indicators');
    const hoverLeft = document.getElementById('hoverLeft');
    const hoverRight = document.getElementById('hoverRight');
    const navWrapper = document.querySelector('.carousel-nav-wrapper');
    
    // Detect current page and mark it
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    items.forEach(item => {
        const href = item.getAttribute('data-href');
        if (href === currentPage) {
            item.classList.add('current-page');
        }
    });
    
    // Ellipse parameters
    const radiusX = 580;
    const radiusY = 280;
    const centerX = 0;
    const centerY = 30;
    
    let currentRotation = 0;
    let targetRotation = 0;
    let animationFrame;
    let hoverDirection = 0;
    let hoverRotateInterval;
    
    // Create indicators
    if (indicatorsContainer) {
        for (let i = 0; i < totalItems; i++) {
            const dot = document.createElement('div');
            dot.className = 'carousel-indicator' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => goToItem(i));
            indicatorsContainer.appendChild(dot);
        }
    }
    
    function updatePositions() {
        const angleStep = (2 * Math.PI) / totalItems;
        
        items.forEach((item, i) => {
            const angle = angleStep * i + currentRotation;
            const x = centerX + radiusX * Math.sin(angle);
            const y = centerY - radiusY * Math.cos(angle);
            
            const depth = Math.cos(angle);
            const scale = 0.55 + (depth + 1) * 0.275;
            const opacity = 0.35 + (depth + 1) * 0.325;
            const zIndex = Math.round((depth + 1) * 50);
            
            item.style.setProperty('--x', `calc(50% + ${x}px)`);
            item.style.setProperty('--y', `calc(50% + ${y}px)`);
            item.style.setProperty('--scale', scale.toFixed(3));
            item.style.setProperty('--opacity', opacity.toFixed(3));
            item.style.setProperty('--z', zIndex);
            item.style.zIndex = zIndex;
            
            // Only track adjacent for subtle border enhancement
            const isAdjacent = depth > 0.7;
            item.classList.toggle('adjacent', isAdjacent);
        });
        
        updateIndicators();
    }
    
    function updateIndicators() {
        const angleStep = (2 * Math.PI) / totalItems;
        let activeIndex = 0;
        let maxDepth = -Infinity;
        
        items.forEach((item, i) => {
            const angle = angleStep * i + currentRotation;
            const depth = Math.cos(angle);
            if (depth > maxDepth) {
                maxDepth = depth;
                activeIndex = i;
            }
        });
        
        document.querySelectorAll('.carousel-indicator').forEach((dot, i) => {
            dot.classList.toggle('active', i === activeIndex);
        });
    }
    
    function animate() {
        const diff = targetRotation - currentRotation;
        if (Math.abs(diff) > 0.0001) {
            currentRotation += diff * 0.08;
            updatePositions();
        }
        animationFrame = requestAnimationFrame(animate);
    }
    
    function rotateToNext() {
        targetRotation -= (2 * Math.PI) / totalItems;
    }
    
    function rotateToPrev() {
        targetRotation += (2 * Math.PI) / totalItems;
    }
    
    function goToItem(index) {
        const angleStep = (2 * Math.PI) / totalItems;
        const targetAngle = -angleStep * index;
        
        let diff = targetAngle - (currentRotation % (2 * Math.PI));
        if (diff > Math.PI) diff -= 2 * Math.PI;
        if (diff < -Math.PI) diff += 2 * Math.PI;
        
        targetRotation = currentRotation + diff;
    }
    
    // Continuous rotation while hovering
    function startHoverRotation(direction) {
        if (hoverDirection === direction && hoverRotateInterval) return;
        hoverDirection = direction;
        clearInterval(hoverRotateInterval);
        
        hoverRotateInterval = setInterval(() => {
            if (direction === 1) {
                targetRotation -= 0.025;
            } else {
                targetRotation += 0.025;
            }
        }, 50);
    }
    
    function stopHoverRotation() {
        hoverDirection = 0;
        clearInterval(hoverRotateInterval);
    }
    
    // Hover zone events
    if (hoverLeft && hoverRight) {
        hoverLeft.addEventListener('mouseenter', () => startHoverRotation(-1));
        hoverLeft.addEventListener('mouseleave', stopHoverRotation);
        hoverRight.addEventListener('mouseenter', () => startHoverRotation(1));
        hoverRight.addEventListener('mouseleave', stopHoverRotation);

        // Tap to step on mobile
        hoverLeft.addEventListener('click', rotateToPrev);
        hoverRight.addEventListener('click', rotateToNext);
    }

    // Also rotate when hovering across the carousel itself.
    // Left half rotates one way, right half the other.
    if (navWrapper) {
        const updateDirectionFromPointer = (event) => {
            const rect = navWrapper.getBoundingClientRect();
            const pointerX = event.clientX - rect.left;
            const centerX = rect.width / 2;
            const deadZone = rect.width * 0.08;
            const offset = pointerX - centerX;

            if (Math.abs(offset) < deadZone) {
                stopHoverRotation();
                return;
            }

            startHoverRotation(offset > 0 ? 1 : -1);
        };

        navWrapper.addEventListener('mouseenter', updateDirectionFromPointer);
        navWrapper.addEventListener('mousemove', updateDirectionFromPointer);
        navWrapper.addEventListener('mouseleave', stopHoverRotation);

        // Touch swipe support
        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartTime = 0;

        navWrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
        }, { passive: true });

        navWrapper.addEventListener('touchmove', (e) => {
            // Allow the page to scroll vertically; only intercept horizontal swipes
            const dx = e.touches[0].clientX - touchStartX;
            const dy = e.touches[0].clientY - touchStartY;
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
                e.preventDefault();
            }
        }, { passive: false });

        navWrapper.addEventListener('touchend', (e) => {
            const dx = e.changedTouches[0].clientX - touchStartX;
            const dy = e.changedTouches[0].clientY - touchStartY;
            const elapsed = Date.now() - touchStartTime;

            // Treat as swipe: mostly horizontal, at least 40px, under 400ms
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40 && elapsed < 400) {
                if (dx < 0) {
                    rotateToNext();
                } else {
                    rotateToPrev();
                }
            }
        }, { passive: true });
    }
    
    // Initialize - static until user hovers
    updatePositions();
    animate();
})();
