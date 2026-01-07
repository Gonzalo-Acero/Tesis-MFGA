const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'frontend', 'webV2', 'env.js');
const baseUrl = (process.env.API_BASE_URL || 'http://localhost:4000/api').replace(
  /\/+$/,
  ''
);

const content = `(() => {
  const candidate = "${baseUrl}";
  window.__API_BASE_URL__ = (candidate || "").replace(/\\/+$/, "");
})();
`;

fs.mkdirSync(path.dirname(targetPath), { recursive: true });
fs.writeFileSync(targetPath, content, 'utf8');
console.log(`env.js generated at ${targetPath} with API_BASE_URL=${baseUrl}`);
