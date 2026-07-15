// Automatically apply colored borders to cards and style pill tags based on their content
(function() {
    const colorMap = {
        // Red - Conflicts, violations, contradictions, constitutional, prosecutorial
        red: ['conflict', 'contradiction', 'constitutional', 'prosecutorial', 'prosecutor', 'accuser', 'brady', 'violation', 'witness coaching', 'evidence fabrication', 'coaching', 'fabrication', 'napue', 'franks'],
        // Orange - Investigation, bias, procedure
        orange: ['investigat', 'bias', 'procedure', 'initial officer', 'suppression', 'suppressed', 'witness suppression', 'evidence suppression', 'bad faith', 'investigative failure'],
        // Blue - Forensics, authentication, technical
        blue: ['forensic', 'authentication', 'injury', 'medical', 'biomechanic', 'impossibility', 'dna'],
        // Amber - Witnesses, evidence, relationships, timeline, logic
        amber: ['witness', 'evidence', 'relationship', 'timeline', 'logic', 'key witness', 'third party', 'antagonist', 'missing', 'innocent', 'extortion', 'exculpatory', 'video', 'manipulation', 'misrepresentation', 'coercion', 'plea', '4th amendment', 'vindictiveness', 'aggravator', 'false'],
        // Green - Defendant, defense, remedy, solutions
        green: ['defendant', 'defense', 'remedy', 'accountability', 'oversight', 'core issue', 'judicial']
    };

    const colors = {
        red: '#b32424',
        orange: '#ed6c02',
        blue: '#60a5fa',
        amber: '#f59e0b',
        green: '#2e7d32'
    };

    // Find all cards with labels and apply border colors
    document.querySelectorAll('.card').forEach(card => {
        const label = card.querySelector('.card-label');
        if (!label) return;

        const labelText = label.textContent.toLowerCase().trim();
        
        // Check which color category matches
        for (const [colorName, keywords] of Object.entries(colorMap)) {
            if (keywords.some(keyword => labelText.includes(keyword))) {
                card.style.borderLeft = `6px solid ${colors[colorName]}`;
                break;
            }
        }
    });

    // Apply semantic colors to pill tags (both inline styles and .pill class)
    const pillSelectors = [
        'span[style*="border-radius: 20px"]',  // Inline styled pills
        '.pill',                                // Class-based pills
        'span.pill'                             // Explicit class pills
    ];
    
    pillSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(pill => {
            const pillText = pill.textContent.toLowerCase().trim();
            
            // Determine color based on content
            for (const [colorName, keywords] of Object.entries(colorMap)) {
                if (keywords.some(keyword => pillText.includes(keyword))) {
                    pill.style.background = colors[colorName];
                    pill.style.backgroundColor = colors[colorName];
                    return; // Stop after first match
                }
            }
        });
    });
})();
