const fs = require('fs');
const file = 'd:/xampp/htdocs/keperawatan/frontend/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace fetch(`/...`) with fetch(`${API_URL}/...`)
content = content.replace(/fetch\(`\//g, 'fetch(`${API_URL}/');

// Replace fetch('/...') with fetch(API_URL + '/...')
content = content.replace(/fetch\('\//g, "fetch(API_URL + '/");

fs.writeFileSync(file, content);
console.log('Replaced successfully');
