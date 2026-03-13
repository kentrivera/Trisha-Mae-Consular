document.addEventListener('DOMContentLoaded', () => {
    setupRevealOnScroll();

    document.querySelectorAll('[data-action]').forEach((button) => {
        button.addEventListener('click', async () => {
            const action = button.getAttribute('data-action');
            if (action === 'share') {
                await sharePage();
                return;
            }
            if (action === 'certificate') {
                scrollToCertificate();
                return;
            }
            if (action === 'message') {
                openMessage();
            }
        });
    });
});

function setupRevealOnScroll() {
    const revealItems = Array.from(document.querySelectorAll('.reveal'));
    if (revealItems.length === 0) return;

    // Small stagger for a more premium feel.
    revealItems.forEach((el, index) => {
        const delayMs = Math.min(index * 70, 280);
        el.style.transitionDelay = `${delayMs}ms`;
    });

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        revealItems.forEach((el) => el.classList.add('reveal-in'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('reveal-in');
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.12 }
    );

    revealItems.forEach((el) => observer.observe(el));
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.setAttribute('role', 'status');
    toast.className = [
        'fixed',
        'left-1/2',
        'top-6',
        '-translate-x-1/2',
        'z-50',
        'rounded-2xl',
        'bg-white/90',
        'backdrop-blur',
        'px-4',
        'py-3',
        'text-sm',
        'font-medium',
        'text-slate-700',
        'shadow-lg',
        'shadow-black/5',
        'ring-1',
        'ring-black/5',
        'transition',
        'duration-200',
        'opacity-0'
    ].join(' ');
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.remove('opacity-0'));
    window.setTimeout(() => {
        toast.classList.add('opacity-0');
        window.setTimeout(() => toast.remove(), 220);
    }, 1800);
}

async function sharePage() {
    const title = 'Congratulations, Trisha Mae Consular — Practice Teaching Completion';
    const text = 'Celebrating Trisha Mae Consular’s Practice Teaching completion — so proud of you!';
    const url = window.location.href;

    try {
        if (navigator.share) {
            await navigator.share({ title, text, url });
            return;
        }
    } catch {
        // User cancelled or share failed; fall back below.
    }

    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(url);
            showToast('Link copied ✨');
            return;
        }
    } catch {
        // ignore
    }

    showToast('Sharing not supported here');
}

function scrollToCertificate() {
    const certificate = document.getElementById('certificate');
    if (!certificate) return;

    certificate.scrollIntoView({ behavior: 'smooth', block: 'start' });

    window.setTimeout(() => {
        certificate.classList.add('shadow-lg', 'shadow-blush-200/70');
        window.setTimeout(() => {
            certificate.classList.remove('shadow-lg', 'shadow-blush-200/70');
        }, 900);
    }, 450);
}

function openMessage() {
    const subject = encodeURIComponent('Congrats on your Practice Teaching!');
    const body = encodeURIComponent(
        'Congratulations, Trisha! I’m proud of you for completing your Practice Teaching program. Keep going — you’re meant to inspire.\n\n— Your Man'
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}
