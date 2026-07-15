// card-mapper.js: Assign card-type classes based on the card-label text.
(function() {
    const mapping = {
        'conflict': 'card-conflict',
        'contradiction': 'card-contradict',
        'witness': 'card-witness',
        'timeline': 'card-timeline',
        'forensics': 'card-forensics',
        'forensic': 'card-forensics',
        'forensics (dna)': 'card-forensics',
        'procedure': 'card-investigative',
        'bias': 'card-investigative',
        'inquiry': 'card-investigative',
        'injury': 'card-success',
        'relationship': 'card-investigative',
        'authentication': 'card-forensics',
        'evidence': 'card-contradict',
        'the bruises that never existed': 'card-contradict',
        'logic': 'card-investigative'
    };

    function slug(s) {
        return (s || '').toLowerCase().replace(/[\n\r]/g, ' ').replace(/\s+/g, ' ').trim();
    }

    function applyMapping() {
        document.querySelectorAll('.card, .evidence-card, .apple-card, .action-card, .stat-card').forEach(card => {
            const labelEl = card.querySelector('.card-label, .evidence-title, .apple-title');
            if (!labelEl) return;
            const key = slug(labelEl.textContent || '');
            let assigned = null;
            Object.keys(mapping).some(k => {
                if (key.indexOf(k) >= 0) { assigned = mapping[k]; return true; }
                return false;
            });
            if (assigned) {
                card.classList.add(assigned);
            }
        });
    }

    // Run on DOMContentLoaded if document isn't ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyMapping);
    } else {
        applyMapping();
    }
})();
