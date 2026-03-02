const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

const dynamicLengthLogic = `
window.addEventListener('DOMContentLoaded', () => {
    const signatureSvg = document.getElementById('signatureSvg');
    if(signatureSvg) {
        const paths = signatureSvg.querySelectorAll('path');
        let totalLength = 0;
        
        // Loop over every small path and measure it
        paths.forEach(p => {
            const l = p.getTotalLength();
            totalLength += l;
            // For a simultaneous draw, we set each path's stroke-dasharray and offset to its own length
            p.style.strokeDasharray = l;
            p.style.strokeDashoffset = l;
            // We use a CSS animation to draw it over 3 seconds
            p.style.animation = 'drawRealSignature 3s cubic-bezier(0.5, 0, 0.2, 1) forwards';
        });
    }
});
`;

app = dynamicLengthLogic + "\n" + app;
fs.writeFileSync('app.js', app);
console.log('App updated');
