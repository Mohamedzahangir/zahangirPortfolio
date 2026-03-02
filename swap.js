const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
let svg = fs.readFileSync('assets/svg_signature.svg', 'utf8');
let start = html.indexOf('<svg class="loader-logo"');
let end = html.indexOf('</svg>', start) + 6;

if (start !== -1 && end !== -1) {
    let replacedSvg = svg.replace('<svg ', '<svg class="loader-logo" id="signatureSvg" ');
    html = html.substring(0, start) + replacedSvg + html.substring(end);
    fs.writeFileSync('index.html', html);
    console.log('Replaced');
} else {
    console.log('NOT FOUND', start, end);
}
