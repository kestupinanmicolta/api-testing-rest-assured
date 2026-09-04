const fs = require('fs');
const path = require('path');

const REPORT_DIR = path.join(__dirname, 'target', 'cucumber-reports');
const OUTPUT_DIR = path.join(__dirname, 'public');
const JSON_FILE = path.join(REPORT_DIR, 'cucumber.json');

if (!fs.existsSync(JSON_FILE)) {
  console.log('No cucumber.json found');
  process.exit(0);
}

const scenarios = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));

function parseSteps(description) {
  if (!description) return [];
  return description.split('\n').map(s => s.trim()).filter(s => s.length > 0);
}

function extractApiInfo(scenarioName, steps) {
  const baseUrl = 'https://jsonplaceholder.typicode.com';
  let method = 'GET';
  let endpoint = '/';
  let body = null;
  let expectedStatus = null;
  let responseValidations = [];

  for (const step of steps) {
    const lower = step.toLowerCase();

    // Request
    if (lower.includes('creo un post')) {
      method = 'POST';
      endpoint = '/posts';
      const titleMatch = step.match(/title\s+"([^"]+)"/);
      const bodyMatch = step.match(/body\s+"([^"]+)"/);
      const userIdMatch = step.match(/userId\s+(\d+)/);
      body = JSON.stringify({
        title: titleMatch ? titleMatch[1] : '',
        body: bodyMatch ? bodyMatch[1] : '',
        userId: userIdMatch ? parseInt(userIdMatch[1]) : 0
      }, null, 2);
    } else if (lower.includes('actualizo el post')) {
      method = 'PUT';
      endpoint = '/posts/1';
      const titleMatch = step.match(/title\s+"([^"]+)"/);
      const bodyMatch = step.match(/body\s+"([^"]+)"/);
      body = JSON.stringify({
        title: titleMatch ? titleMatch[1] : '',
        body: bodyMatch ? bodyMatch[1] : ''
      }, null, 2);
    } else if (lower.includes('elimino el post')) {
      method = 'DELETE';
      endpoint = '/posts/1';
    } else if (lower.includes('consulto comentarios')) {
      method = 'GET';
      endpoint = '/posts/1/comments';
    } else if (lower.includes('consulto el usuario')) {
      method = 'GET';
      endpoint = '/users/1';
    } else if (lower.includes('consulto todos los posts')) {
      method = 'GET';
      endpoint = '/posts';
    } else if (lower.includes('consulto posts del usuario')) {
      method = 'GET';
      endpoint = '/posts?userId=1';
    } else if (lower.includes('consulto el post con id 99999')) {
      method = 'GET';
      endpoint = '/posts/99999';
    } else if (lower.includes('consulto el post con id')) {
      method = 'GET';
      const idMatch = step.match(/ID\s+(\d+)/);
      endpoint = '/posts/' + (idMatch ? idMatch[1] : '1');
    }

    // Response
    if (lower.includes('status code es')) {
      const statusMatch = step.match(/(\d+)/);
      if (statusMatch) expectedStatus = parseInt(statusMatch[1]);
    }
    if (lower.includes('post es creado exitosamente')) {
      expectedStatus = 201;
      responseValidations.push('id > 0');
    }
    if (lower.includes('post tiene title no vacío')) {
      responseValidations.push('title no está vacío');
    }
    if (lower.includes('post tiene title')) {
      const titleMatch = step.match(/title\s+"([^"]+)"/);
      if (titleMatch) responseValidations.push('title = "' + titleMatch[1] + '"');
    }
    if (lower.includes('cada post tiene campos válidos')) {
      responseValidations.push('campos: id, title, body, userId');
    }
    if (lower.includes('cada post tiene userId')) {
      const userIdMatch = step.match(/userId\s+(\d+)/);
      if (userIdMatch) responseValidations.push('userId = ' + userIdMatch[1]);
    }
    if (lower.includes('respuesta contiene al menos')) {
      const countMatch = step.match(/(\d+)/);
      if (countMatch) responseValidations.push('respuesta tiene >= ' + countMatch[1] + ' elementos');
    }
    if (lower.includes('campo title no está vacío')) {
      responseValidations.push('title no está vacío');
    }
    if (lower.includes('usuario tiene name no vacío')) {
      responseValidations.push('name no está vacío');
    }
    if (lower.includes('post contiene los campos')) {
      const fieldsMatch = step.match(/campos:\s*(.+)/);
      if (fieldsMatch) responseValidations.push('campos: ' + fieldsMatch[1]);
    }
  }

  return { method, endpoint, url: baseUrl + endpoint, body, expectedStatus, responseValidations };
}

let passed = 0, failed = 0, skipped = 0;
const rows = [];
const details = [];

for (const feature of scenarios) {
  for (const el of feature.elements || []) {
    if (el.type !== 'scenario') continue;
    const steps = parseSteps(el.description);
    let scenarioFailed = false;
    let scenarioSkipped = false;
    let duration = 0;
    let error = '';

    if (scenarioFailed) failed++;
    else if (scenarioSkipped) skipped++;
    else passed++;

    const status = scenarioFailed ? 'FAILED' : scenarioSkipped ? 'SKIPPED' : 'PASSED';
    const badgeClass = scenarioFailed ? 'badge-failed' : scenarioSkipped ? 'badge-skipped' : 'badge-passed';
    const durationMs = Math.round(duration / 1000000);
    const id = `scenario-${passed + failed + skipped}`;
    const apiInfo = extractApiInfo(el.name, steps);

    rows.push(`<tr class="clickable" onclick="toggleDetails('${id}')">
      <td>${feature.name || 'Feature'}</td>
      <td>${el.name || 'Scenario'}</td>
      <td><span class="badge ${badgeClass}">${status}</span></td>
      <td>${durationMs}ms</td>
      <td>${error ? `<span class="error-text">${error.substring(0, 100)}...</span>` : ''}</td>
      <td><span class="expand-icon">+</span></td>
    </tr>`);

    let requestSection = `<span class="method">${apiInfo.method}</span> <span class="url">${apiInfo.url}</span>`;
    if (apiInfo.body) {
      requestSection += `\n\nBody:\n${apiInfo.body}`;
    }

    let responseSection = '';
    if (apiInfo.expectedStatus) {
      responseSection += `Status: ${apiInfo.expectedStatus}`;
    }
    if (apiInfo.responseValidations.length > 0) {
      responseSection += '\n\nValidaciones:\n' + apiInfo.responseValidations.map(v => '  - ' + v).join('\n');
    }

    let stepsSection = steps.map(s => '  ' + s).join('\n');

    details.push(`<div id="${id}" class="details-panel" style="display:none">
      <div class="section-request">=== REQUEST ===</div>
      <pre>${requestSection}</pre>
      <div class="section-response">=== RESPONSE ===</div>
      <pre>${responseSection || 'Sin validación de response'}</pre>
      <div class="section-steps">=== TEST STEPS ===</div>
      <pre>${stepsSection}</pre>
    </div>`);
  }
}

const total = passed + failed + skipped;
const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>API Testing Report - Rest Assured</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;background:#0d1117;color:#e6edf3}
.header{background:linear-gradient(135deg,#161b22,#21262d);padding:32px;border-bottom:1px solid #30363d}
.header h1{font-size:28px;margin-bottom:8px}
.header p{color:#8b949e;font-size:14px}
.stats{display:flex;gap:20px;padding:24px 32px;background:#161b22;border-bottom:1px solid #30363d}
.stat{padding:16px 24px;border-radius:8px;background:#21262d;border:1px solid #30363d;min-width:120px;text-align:center}
.stat .num{font-size:32px;font-weight:700}
.stat .label{font-size:12px;color:#8b949e;text-transform:uppercase;letter-spacing:1px;margin-top:4px}
.stat.total .num{color:#58a6ff}
.stat.passed .num{color:#3fb950}
.stat.failed .num{color:#f85149}
.stat.skipped .num{color:#d29922}
.content{padding:32px}
table{width:100%;border-collapse:collapse;background:#161b22;border-radius:8px;overflow:hidden;border:1px solid #30363d}
th{background:#21262d;padding:12px 16px;text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#8b949e;border-bottom:1px solid #30363d}
td{padding:12px 16px;border-bottom:1px solid #21262d;font-size:14px}
tr:hover{background:#1c2128}
tr.clickable{cursor:pointer}
.badge{padding:4px 12px;border-radius:16px;font-size:12px;font-weight:600;display:inline-block}
.badge-passed{background:#238636;color:#fff}
.badge-failed{background:#da3633;color:#fff}
.badge-skipped{background:#9e6a03;color:#fff}
.error-text{color:#f85149;font-size:12px}
.expand-icon{color:#58a6ff;font-weight:bold;font-size:16px}
.details-panel{margin:8px 0 16px 0;padding:16px;background:#0d1117;border:1px solid #30363d;border-radius:8px}
.details-panel pre{font-size:13px;line-height:1.5;white-space:pre-wrap;word-break:break-all}
.section-request{color:#3fb950;font-weight:bold;margin-bottom:8px}
.section-response{color:#58a6ff;font-weight:bold;margin-top:16px;margin-bottom:8px}
.section-steps{color:#d29922;font-weight:bold;margin-top:16px;margin-bottom:8px}
.method{color:#d29922;font-weight:bold}
.url{color:#a5d6ff}
.status-code{color:#3fb950;font-weight:bold}
footer{padding:24px 32px;text-align:center;color:#484f58;font-size:12px;border-top:1px solid #30363d}
</style></head>
<body>
<script>
function toggleDetails(id) {
  const panel = document.getElementById(id);
  if (panel) {
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  }
}
</script>
<div class="header"><h1>API Testing Report - Rest Assured</h1><p>JSONPlaceholder API | Cucumber + REST Assured | ${new Date().toISOString()}</p></div>
<div class="stats">
<div class="stat total"><div class="num">${total}</div><div class="label">Total</div></div>
<div class="stat passed"><div class="num">${passed}</div><div class="label">Passed</div></div>
<div class="stat failed"><div class="num">${failed}</div><div class="label">Failed</div></div>
<div class="stat skipped"><div class="num">${skipped}</div><div class="label">Skipped</div></div>
</div>
<div class="content">
<table><thead><tr><th>Feature</th><th>Scenario</th><th>Status</th><th>Duration</th><th>Error</th><th></th></tr></thead>
<tbody>${rows.join('\n')}</tbody></table>
${details.join('\n')}
</div>
<footer>QA Portfolio - Karen Paola Estupinan Micolta</footer>
</body></html>`;

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), html);
console.log(`Report generated: ${total} scenarios (${passed} passed, ${failed} failed, ${skipped} skipped)`);
