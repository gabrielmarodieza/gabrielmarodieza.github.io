(async function build(){
const fs=await import('node:fs/promises');
const path=await import('node:path');
const root=process.argv[2];
const content=JSON.parse(await fs.readFile(path.join(root,'portfolio-content.json'),'utf8'));
const results=JSON.parse(await fs.readFile(path.join(root,'source/sample-results.json'),'utf8'));
const e=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const money=n=>new Intl.NumberFormat('en-PH',{minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
const p=content.person;
const proofPanels=[
{key:'controls',number:'01',label:'Invoice controls',company:'SM Appliance Center',date:'May 2022 – Present',metric:'5,000<span>+</span>',unit:'vendor invoices reviewed personally each month',text:'Reviewing the details before payment processing.',items:['Accuracy and contractual requirements','Purchase orders and authorization','Rental, utility and freight billings'],foot:'Current role: Accounting Assistant'},
{key:'payments',number:'02',label:'Payments & payroll',company:'SNDT EXPRES CORPORATION',date:'January 2021 – May 2022',metric:'AP<span> + payroll</span>',unit:'vendor payments and employee payroll processing',text:'A broader scope across day-to-day finance operations.',items:['Payment requests and cash / check vouchers','Payroll deductions and payment timelines','Accounts payable and disbursement monitoring'],foot:'Historical role: Accounting Assistant'},
{key:'cash',number:'03',label:'Cash reconciliation',company:'Clargis Food Ventures, Inc.',date:'July 2015 – March 2020',metric:'Cash<span> & records</span>',unit:'branch cash monitoring and sales reconciliation',text:'A foundation in transaction records and supporting evidence.',items:['Cash reports compared with theoretical sales','Deposit slips and daily bank statements','QuickBooks Desktop transaction entry'],foot:'Historical role: Accounting Assistant'}
];
const panels=proofPanels.map((v,i)=>`<section id="proof-${v.key}" class="proof-panel ${i===0?'is-first':''}" aria-labelledby="proof-title-${v.key}" data-proof-panel="${v.key}">
<div class="proof-meta"><span>Professional experience</span><span>${v.number} / 03</span></div>
<p class="proof-company">${e(v.company)}</p><p class="proof-date">${e(v.date)}</p>
<h2 class="proof-metric ${i?'word-metric':''}" id="proof-title-${v.key}">${v.metric}</h2>
<p class="proof-unit">${e(v.unit)}</p><p class="proof-text">${e(v.text)}</p>
<ul class="proof-checks">${v.items.map(t=>`<li><span aria-hidden="true">↳</span>${e(t)}</li>`).join('')}</ul>
<p class="proof-foot">${e(v.foot)}</p></section>`).join('');
const timeline=content.experience.map((v,i)=>`<article class="chapter" id="${v.id}" data-section="career">
<div class="chapter-year"><span class="mono">0${i+1}</span><p>${v.year}<span>+</span></p><small>${e(v.date)}</small></div>
<div class="chapter-main"><p class="company">${e(v.company)} <span>${e(v.context)}</span></p><h3>${e(v.heading)}</h3><p class="chapter-intro">${e(v.narrative)}</p>
<div class="chapter-evidence"><div><h4>Scope of work</h4><p>${e(v.scope)}</p></div><div><h4>Controls &amp; documentation</h4><p>${e(v.control)}</p></div></div>
<div class="chapter-bottom"><p class="role-label">Historical title <strong>${e(v.title)}</strong></p><ul class="terms">${v.keywords.map(k=>`<li>${e(k)}</li>`).join('')}</ul></div></div></article>`).join('');
const rows=results.rows.map(r=>`<tr data-decision="${e(r.decision)}"><td>${e(r.record)}</td><td>${e(r.supplier)}<small>${e(r.key.split('|')[1])}</small></td><td class="number">${money(r.open)}</td><td><span class="status ${r.decision.startsWith('Review')?'review':r.decision==='Ready'?'ready':'other'}">${e(r.decision)}</span></td></tr>`).join('');
const cashRows=results.cash.map(r=>`<tr><td>${e(r.branch)}</td><td class="number">${money(r.expected)}</td><td class="number">${money(r.bank)}</td><td class="number">${money(r.transit)}</td><td class="number ${r.unresolved?'variance':''}">${money(r.unresolved)}</td></tr>`).join('');
const road=content.roadmap.map(v=>`<li><span class="mono">${e(v.order)}</span><div><h4>${e(v.title)}</h4><p>${e(v.goal)}</p></div><span class="planned">Planned</span></li>`).join('');
const completed=content.credentials.filter(c=>c.status==='completed'&&c.name&&c.issuer&&c.date&&/^https:\/\//.test(c.url));
const credentials=completed.length?`<div class="credentials"><h3>Completed credentials</h3>${completed.map(c=>`<article><h4>${e(c.name)}</h4><p>${e(c.issuer)} · ${e(c.date)}</p><a href="${e(c.url)}" target="_blank" rel="noopener noreferrer">Verify credential ↗</a></article>`).join('')}</div>`:'';
const structured={
'@context':'https://schema.org','@type':'Person',name:p.name,jobTitle:p.historicalTitle,
description:'Accounting professional with 10+ years of experience in accounts payable, vendor invoice review, payments, payroll and cash reconciliation.',
worksFor:{'@type':'Organization',name:'SM Appliance Center'},
homeLocation:{'@type':'Place',name:p.location},sameAs:[p.linkedin],
knowsAbout:['Accounts payable','Vendor invoice review','Vendor payments','Cash reconciliation','Payroll processing','Purchase-order verification','Cash disbursement','Financial documentation','Microsoft Excel','PivotTables','VLOOKUP','COUNTIF','QuickBooks Desktop (prior experience, 2015–2020)']};
const html=`<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Rodieza Gabriel | Accounts Payable, Reconciliation &amp; Finance Operations</title>
<meta name="description" content="Rodieza Gabriel brings 10+ years in accounting operations: 5,000+ monthly vendor invoice reviews, payments, payroll and cash reconciliation. Explore experience, Excel skills and an Accounting Lab.">
<meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#eef1f3">
<link rel="icon" href="favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="styles.css">
<script type="application/ld+json">${JSON.stringify(structured).replaceAll('<','\\u003c')}</script>
<script src="script.js" defer></script></head>
<body><a class="skip-link" href="#main">Skip to content</a>
<header class="site-header wrap"><a href="#main" class="brand" aria-label="Rodieza Gabriel home"><span class="brand-mark" aria-hidden="true">rg</span><span>Rodieza Gabriel<small>Accounting portfolio</small></span></a>
<nav aria-label="Main navigation"><a href="#experience">Experience</a><a href="#skills">Skills</a><a href="#lab">Accounting Lab</a><a class="nav-resume" href="${p.resume}" download>Resume <span aria-hidden="true">↗</span></a></nav></header>
<main id="main">
<section class="hero-stage wrap" aria-labelledby="hero-title">
<div class="hero-intro">
<p class="eyebrow"><span class="location-dot" aria-hidden="true"></span>${e(p.location)}</p>
<p class="hero-name">Ma. Rodieza Gabriel</p>
<h1 id="hero-title">Accounts payable.<br><span>Finance operations.</span></h1>
<p class="hero-summary"><strong>10+ years of hands-on accounting experience.</strong> Personally reviewing 5,000+ vendor invoices monthly, with experience across payments, payroll and cash reconciliation.</p>
<div class="hero-actions"><a class="button primary" href="${p.resume}" download>Download resume <span aria-hidden="true">↗</span></a><a class="button quiet" href="#experience">Explore experience <span aria-hidden="true">↓</span></a></div>
<div class="hero-baseline"><span class="mono">EXPERIENCE, AT A GLANCE</span><p>Invoice controls <i aria-hidden="true">/</i> Vendor payments<br>Payroll <i aria-hidden="true">/</i> Cash reconciliation</p></div>
</div>
<div class="proof-area"><div class="paper-shadow shadow-back" aria-hidden="true"></div><div class="paper-shadow shadow-mid" aria-hidden="true"></div><div class="proof-stack">${panels}</div>
<div class="proof-controls" aria-label="Explore professional evidence" hidden>${proofPanels.map((v,i)=>`<button type="button" data-proof="${v.key}" aria-controls="proof-${v.key}" aria-pressed="${i===0}"><span class="mono">${v.number}</span>${e(v.label)}</button>`).join('')}</div></div>
<div class="hero-bottom"><p>Accounting Assistant · SM Appliance Center · May 2022–Present</p><a href="#lab">View the guided Excel sample <span aria-hidden="true">↘</span></a></div>
</section>
<div class="section-index wrap" aria-label="Portfolio sections"><a href="#experience"><span class="mono">01</span> Professional experience</a><a href="#skills"><span class="mono">02</span> Verified skills</a><a href="#lab"><span class="mono">03</span> Accounting Lab</a></div>
<section id="experience" class="experience-section wrap section" aria-labelledby="experience-title">
<div class="section-heading"><p class="eyebrow"><span class="section-no">01</span> Professional experience</p><div><h2 id="experience-title">From branch records<br><span>to high-volume controls.</span></h2><p class="section-intro">A progression from daily cash records to payment and payroll responsibilities, then higher-volume invoice review and financial controls.</p></div></div>
${timeline}
<div class="experience-close"><p><span class="mono">RELEVANCE TO THE NEXT ROLE</span> A practical foundation for Accounts Payable Specialist, Senior Accounting Assistant and Finance Operations opportunities.</p><a class="text-link" href="${p.resume}" download>See the full employment record <span aria-hidden="true">↗</span></a></div>
</section>
<section class="skills-section" id="skills" aria-labelledby="skills-title"><div class="wrap section">
<div class="section-heading"><p class="eyebrow"><span class="section-no">02</span> Verified skills</p><div><h2 id="skills-title">Tools, with context.</h2><p class="section-intro">Supported by the resume and candidate-provided details. These are experience and capability statements, not certification claims.</p></div></div>
${content.skills.map(s=>`<div class="skill-row"><div class="tool-id small" aria-hidden="true">${e(s.mark || s.name.slice(0,2))}</div><div><h3>${e(s.name)}</h3><p class="skill-scope">${e(s.scope)}</p></div><div class="skill-evidence"><p>${e(s.evidence)}</p></div></div>`).join('')}
<p class="education"><strong>University of Rizal System</strong><span>Business Administration – Financial Management · 2011–2015</span></p>
${credentials}
</div></section>
<section id="lab" class="lab-section wrap section" aria-labelledby="lab-title">
<div class="section-heading"><p class="eyebrow"><span class="section-no">03</span> Accounting Lab</p><div><h2 id="lab-title">Accounting practice.<br><span>The workings included.</span></h2><p class="section-intro">Practice projects are separate from professional experience. The current workbook is a guided draft using fictional data, not a record of employer results.</p></div></div>
<article class="lab-feature" aria-labelledby="sample-title">
<div class="lab-cover" aria-hidden="true"><div class="ledger-top"><span>ACCOUNTING LAB / 001</span><span>EXCEL</span></div><div class="ledger-title">Invoice review<br>&amp; reconciliation.</div><div class="ledger-grid"><span>Record</span><span>Decision</span><span class="number">Open PHP</span><span>R01</span><span>Ready</span><span class="number">12,000.00</span><span>R08</span><span class="ledger-flag">Review duplicate</span><span class="number">23,000.00</span><span>R14</span><span class="ledger-flag">Review supplier</span><span class="number">3,000.00</span></div><div class="ledger-bottom"><strong>21</strong><span>fictional invoice records<br>6 branch deposit batches</span><span class="ledger-arrow">↗</span></div></div>
<div class="lab-copy"><p class="lab-state"><span class="draft-dot" aria-hidden="true"></span> Guided draft · candidate review pending</p><h3 id="sample-title">${e(content.lab.title)}</h3><p>Follow supplier lookups, duplicate checks and payment-review decisions. Then compare branch collections with bank deposits and documented timing differences.</p><dl class="project-meta"><div><dt>Methods</dt><dd>VLOOKUP · COUNTIF · reconciliation formulas</dd></div><div><dt>Includes</dt><dd>Invoice register, exception checks, summary and a PivotTable exercise</dd></div><div><dt>Authorship</dt><dd>AI-assisted practice pack; independent completion not yet demonstrated</dd></div></dl><a class="button primary" href="${p.workbook}" download>Download Excel workbook <span aria-hidden="true">↓</span></a><p class="download-note">XLSX · fictional data · editable formulas</p></div>
</article>
<details class="sample-details"><summary><span>Inspect the sample &amp; its limitations</span><span class="disclosure-icon" aria-hidden="true">+</span></summary><div class="sample-content">
<div class="sample-content-head"><div><h3>Invoice review results</h3><p>Snapshot: 20 September 2026 · all amounts in PHP</p></div><p class="eligible-total">Due and eligible under sample rules<strong>PHP ${money(results.eligible)}</strong></p></div>
<div class="filter-bar" role="group" aria-label="Filter fictional invoice records" hidden><button type="button" data-filter="all" aria-pressed="true">All records <span>21</span></button><button type="button" data-filter="ready" aria-pressed="false">Ready <span>7</span></button><button type="button" data-filter="review" aria-pressed="false">Needs review <span>7</span></button><p id="result-count" aria-live="polite">21 records shown</p></div>
<div class="table-scroll invoice-scroll" tabindex="0" role="region" aria-label="Fictional invoice results; scroll for all rows"><table class="invoice-table"><caption class="sr-only">Fictional invoice review results</caption><thead><tr><th scope="col">Record</th><th scope="col">Supplier / invoice</th><th scope="col" class="number">Open balance</th><th scope="col">Decision</th></tr></thead><tbody>${rows}</tbody></table></div>
<p class="table-note">Both records in a duplicate group are held for review. “Ready” is a sample classification, not authorization to pay. Intake balances include unresolved items and are not a verified AP liability. This website snapshot does not update when the downloaded workbook changes.</p>
<div class="method-notes"><div><h4>What the formula checks show</h4><p>VLOOKUP identifies the supplier. COUNTIF checks a supplier-and-invoice key, so identical invoice numbers from different suppliers are not automatically treated as duplicates.</p></div><div><h4>What Rodieza still needs to complete</h4><p>Review and reproduce the formulas, explain the exceptions and build the native PivotTable exercise in Excel. The existing Summary sheet uses formulas; it is not a completed PivotTable.</p></div></div>
<h3 class="cash-title">Collections-to-deposit reconciliation</h3><div class="table-scroll" tabindex="0" role="region" aria-label="Fictional branch deposit results"><table><caption class="sr-only">Fictional cash reconciliation, PHP</caption><thead><tr><th scope="col">Branch</th><th scope="col" class="number">Expected</th><th scope="col" class="number">Deposited</th><th scope="col" class="number">In transit</th><th scope="col" class="number">Unresolved</th></tr></thead><tbody>${cashRows}</tbody></table></div>
<p class="table-note">Investigate the PHP 5,000 short deposit and PHP 250 excess separately. This is a collections-to-deposit exercise, not a complete bank-to-general-ledger reconciliation.</p>
</div></details>
<details class="roadmap"><summary><div><p class="eyebrow">Future practice priorities</p><h3>What comes next in the lab.</h3></div><span class="roadmap-summary">6 planned studies <span class="disclosure-icon" aria-hidden="true">+</span></span></summary><div class="roadmap-content"><p class="roadmap-note">Planned exercises, not completed projects or current skill claims. Each will be added as evidence only after it is completed and reviewed.</p><ol>${road}</ol><p class="roadmap-note">QuickBooks Online, Xero and advanced Excel credentials can be added after completion. No certification is currently claimed.</p></div></details>
</section>
<section class="contact-section" id="contact" aria-labelledby="contact-title"><div class="wrap section"><div class="contact-top"><p class="eyebrow">For the next chapter</p><a href="#main" class="back-top">Back to top <span aria-hidden="true">↑</span></a></div><div class="contact-grid"><div><h2 id="contact-title">Accounting experience.<br><span>Ready for a conversation.</span></h2><p>Discuss accounts payable, reconciliation, payroll support and finance operations roles. Based in the Philippines, with an interest in opportunities across local companies, shared services and remote accounting teams.</p></div><div class="contact-actions"><a class="button light" href="mailto:${p.email}">Email Rodieza <span aria-hidden="true">↗</span></a><a class="contact-resume" href="${p.resume}" download>Download the one-page resume <span aria-hidden="true">↓</span></a><a class="linkedin-link" href="${p.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span><span class="sr-only"> opens in a new tab</span></a></div></div><footer><p>${e(p.name)}</p><p>Portfolio preview · September 2026 · Lab uses fictional data</p></footer></div></section>
</main></body></html>`;
await fs.writeFile(path.join(root,'index.html'),html);
await fs.writeFile(path.join(root,'favicon.svg'),'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#2e54a8"/><text x="11" y="43" fill="white" font-size="32" font-family="Arial">rg</text></svg>');
console.log(JSON.stringify({output:'index.html',chapters:content.experience.length,credentials:completed.length,invoiceRows:results.rows.length}));
})().catch(error=>{console.error(error);process.exitCode=1;});