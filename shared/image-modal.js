// Shared image/video modal for all pages.
function openImageModal(mediaSrc) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalVideo = document.getElementById('modalVideo');
    if (!modal || !modalImg || !modalVideo || !mediaSrc) return;

    const src = encodeURI(mediaSrc);
    const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(mediaSrc);
    modal.classList.remove('is-zoomed');
    modalImg.setAttribute('aria-pressed', 'false');
    modal.scrollTop = 0;
    modal.scrollLeft = 0;

    if (isVideo) {
        modalImg.style.display = 'none';
        modalVideo.style.display = 'block';
        modalVideo.src = new URL(src, document.baseURI).href;
        modalVideo.load();
        // Some clips render a black first frame; jump slightly forward on open.
        const startPlayback = async () => {
            try {
                if (modalVideo.currentTime < 0.25) modalVideo.currentTime = 0.25;
            } catch (_) {}
            try {
                await modalVideo.play();
            } catch (_) {}
        };
        modalVideo.onloadedmetadata = startPlayback;
        modalVideo.oncanplay = startPlayback;
        startPlayback();
    } else {
        modalVideo.pause();
        modalVideo.removeAttribute('src');
        modalVideo.load();
        modalVideo.onloadedmetadata = null;
        modalVideo.oncanplay = null;
        modalVideo.style.display = 'none';
        modalImg.style.display = 'block';
        modalImg.src = new URL(src, document.baseURI).href;
    }

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    const modalVideo = document.getElementById('modalVideo');
    if (!modal) return;

    modal.style.display = 'none';
    modal.classList.remove('is-zoomed');
    document.body.style.overflow = 'auto';

    if (modalVideo) {
        modalVideo.pause();
        modalVideo.removeAttribute('src');
        modalVideo.load();
        modalVideo.onloadedmetadata = null;
        modalVideo.oncanplay = null;
    }
}

function openModalFromElement(el) {
    if (!el) return;
    const src = el.getAttribute('data-modal-image') || el.getAttribute('data-modalImage') || el.href;
    if (src) openImageModal(src);
}

function initImageModal() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    // Ensure modal is a direct body child so position: fixed isn't trapped by transformed/filtered ancestors.
    if (modal && modal.parentElement !== document.body) {
        document.body.appendChild(modal);
    }

    document.querySelectorAll('[data-modal-image]').forEach((el) => {
        el.addEventListener('click', function (e) {
            e.preventDefault();
            openModalFromElement(this);
        });
    });

    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeImageModal();
        });
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function (e) {
                e.preventDefault();
                closeImageModal();
            });
        }
    }

    if (modal && modalImg) {
        const toggleZoom = (event) => {
            event.preventDefault();
            event.stopPropagation();
            modal.classList.toggle('is-zoomed');
            modalImg.setAttribute('aria-pressed', String(modal.classList.contains('is-zoomed')));
            if (!modal.classList.contains('is-zoomed')) {
                modal.scrollTop = 0;
                modal.scrollLeft = 0;
            }
        };
        modalImg.setAttribute('role', 'button');
        modalImg.setAttribute('tabindex', '0');
        modalImg.setAttribute('aria-label', 'Toggle full-resolution image zoom');
        modalImg.setAttribute('aria-pressed', 'false');
        modalImg.addEventListener('click', toggleZoom);
        modalImg.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') toggleZoom(event);
        });
    }

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') closeImageModal();
    });
}

if (typeof window !== 'undefined') {
    window.openImageModal = openImageModal;
    window.closeImageModal = closeImageModal;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initImageModal);
} else {
    initImageModal();
}
