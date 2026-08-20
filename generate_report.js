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

let passed = 0, failed = 0, skipped = 0;
const rows = [];

for (const feature of scenarios) {
  for (const el of feature.elements || []) {
    if (el.type !== 'scenario') continue;
    const steps = el.steps || [];
    let scenarioFailed = false;
    let scenarioSkipped = false;
    let duration = 0;
    let error = '';

    for (const step of steps) {
      const result = step.result || {};
      if (result.status === 'passed') duration += result.duration || 0;
      else if (result.status === 'failed') { scenarioFailed = true; error = result.error_message || ''; duration += result.duration || 0; }
      else if (result.status === 'skipped') scenarioSkipped = true;
    }

    if (scenarioFailed) failed++;
    else if (scenarioSkipped) skipped++;
    else passed++;

    const status = scenarioFailed ? 'FAILED' : scenarioSkipped ? 'SKIPPED' : 'PASSED';
    const badgeClass = scenarioFailed ? 'badge-failed' : scenarioSkipped ? 'badge-skipped' : 'badge-passed';
    const durationMs = Math.round(duration / 1000000);
    rows.push(`<tr><td>${feature.name || 'Feature'}</td><td>${el.name || 'Scenario'}</td><td><span class="badge ${badgeClass}">${status}</span></td><td>${durationMs}ms</td>${error ? `<td class="trace"><pre>${error.substring(0, 500)}</pre></td>` : '<td></td>'}</tr>`);
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
.badge{padding:4px 12px;border-radius:16px;font-size:12px;font-weight:600;display:inline-block}
.badge-passed{background:#238636;color:#fff}
.badge-failed{background:#da3633;color:#fff}
.badge-skipped{background:#9e6a03;color:#fff}
.trace{max-width:400px;overflow:hidden}
.trace pre{font-size:11px;color:#f85149;white-space:pre-wrap;word-break:break-all}
footer{padding:24px 32px;text-align:center;color:#484f58;font-size:12px;border-top:1px solid #30363d}
</style></head>
<body>
<div class="header"><h1>API Testing Report - Rest Assured</h1><p>JSONPlaceholder API | Cucumber + REST Assured | ${new Date().toISOString()}</p></div>
<div class="stats">
<div class="stat total"><div class="num">${total}</div><div class="label">Total</div></div>
<div class="stat passed"><div class="num">${passed}</div><div class="label">Passed</div></div>
<div class="stat failed"><div class="num">${failed}</div><div class="label">Failed</div></div>
<div class="stat skipped"><div class="num">${skipped}</div><div class="label">Skipped</div></div>
</div>
<div class="content">
<table><thead><tr><th>Feature</th><th>Scenario</th><th>Status</th><th>Duration</th><th>Error</th></tr></thead>
<tbody>${rows.join('\n')}</tbody></table>
</div>
<footer>QA Portfolio - Karen Paola Estupinan Micolta</footer>
</body></html>`;

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), html);
console.log(`Report generated: ${total} scenarios (${passed} passed, ${failed} failed, ${skipped} skipped)`);
