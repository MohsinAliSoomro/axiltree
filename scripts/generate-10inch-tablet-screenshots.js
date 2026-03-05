const fs = require('fs');
const path = require('path');

const outDir = path.join(process.cwd(), 'public/playstore/screenshots/10-inch-tablet');
fs.mkdirSync(outDir, { recursive: true });

const slides = [
  {
    name: 'tablet10-01-overview',
    title: 'One Bio Link for Everything',
    subtitle: 'Share all your important links from one beautiful AxilTree page.',
    points: ['Creators', 'Brands', 'Freelancers'],
    cta: 'Start Free in Minutes',
  },
  {
    name: 'tablet10-02-customization',
    title: 'Customize Your Profile Style',
    subtitle: 'Themes, fonts, and colors that match your personal brand.',
    points: ['20+ Themes', 'Custom Fonts', 'Mobile Friendly'],
    cta: 'Make It Yours',
  },
  {
    name: 'tablet10-03-links',
    title: 'Manage Links in Seconds',
    subtitle: 'Add, edit, reorder and publish links with drag and drop.',
    points: ['Fast Editing', 'Drag & Drop', 'Instant Updates'],
    cta: 'Control Link Priority',
  },
  {
    name: 'tablet10-04-analytics',
    title: 'Track Clicks, Grow Smarter',
    subtitle: 'Understand what your audience taps most and optimize faster.',
    points: ['Click Tracking', 'Top Link Insights', 'Realtime'],
    cta: 'Optimize Performance',
  },
  {
    name: 'tablet10-05-sharing',
    title: 'Share Anywhere, Grow Faster',
    subtitle: 'Use one AxilTree link on Instagram, TikTok, X, YouTube and more.',
    points: ['Instagram', 'TikTok', 'YouTube'],
    cta: 'Share Once, Reach Everywhere',
  },
];

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

slides.forEach((slide, idx) => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="2560" height="1440" viewBox="0 0 2560 1440" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg${idx}" x1="0" y1="0" x2="2560" y2="1440" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#F8F9FA"/>
      <stop offset="0.5" stop-color="#FFFFFF"/>
      <stop offset="1" stop-color="#F4ECF8"/>
    </linearGradient>
    <linearGradient id="brand${idx}" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#E4405F"/>
      <stop offset="1" stop-color="#C13584"/>
    </linearGradient>
    <linearGradient id="device${idx}" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#667EEA"/>
      <stop offset="1" stop-color="#764BA2"/>
    </linearGradient>
    <filter id="shadow${idx}" x="0" y="0" width="200%" height="200%" filterUnits="objectBoundingBox">
      <feDropShadow dx="0" dy="24" stdDeviation="24" flood-color="#000000" flood-opacity="0.16"/>
    </filter>
  </defs>

  <rect width="2560" height="1440" fill="url(#bg${idx})"/>
  <circle cx="240" cy="170" r="170" fill="#E4405F" fill-opacity="0.10"/>
  <circle cx="2360" cy="1260" r="220" fill="#C13584" fill-opacity="0.10"/>

  <rect x="120" y="90" width="70" height="70" rx="18" fill="url(#brand${idx})"/>
  <path d="M141 125L155 107L169 125L155 143L141 125Z" fill="#FFFFFF"/>
  <text x="214" y="142" fill="#1A1A1A" font-size="62" font-family="Inter, Arial, sans-serif" font-weight="800">Axil</text>
  <text x="328" y="142" fill="url(#brand${idx})" font-size="62" font-family="Inter, Arial, sans-serif" font-weight="800">Tree</text>

  <text x="120" y="320" fill="#1A1A1A" font-size="104" font-family="Inter, Arial, sans-serif" font-weight="900">${esc(slide.title)}</text>
  <text x="120" y="405" fill="#5F6368" font-size="48" font-family="Inter, Arial, sans-serif" font-weight="500">${esc(slide.subtitle)}</text>

  <g filter="url(#shadow${idx})">
    <rect x="120" y="485" width="1320" height="700" rx="46" fill="#FFFFFF"/>
  </g>

  <rect x="190" y="580" width="1180" height="390" rx="38" fill="url(#device${idx})"/>
  <rect x="250" y="625" width="1060" height="300" rx="30" fill="#FBFAFF"/>
  <rect x="730" y="605" width="170" height="12" rx="6" fill="#1A1A1A"/>
  <circle cx="780" cy="735" r="52" fill="#E4405F" fill-opacity="0.2"/>
  <text x="780" y="820" text-anchor="middle" fill="#1A1A1A" font-size="36" font-family="Inter, Arial, sans-serif" font-weight="700">@yourname</text>
  <rect x="540" y="850" width="480" height="62" rx="31" fill="url(#brand${idx})"/>
  <text x="780" y="891" text-anchor="middle" fill="#FFFFFF" font-size="30" font-family="Inter, Arial, sans-serif" font-weight="700">Main Link</text>

  <g filter="url(#shadow${idx})">
    <rect x="1490" y="485" width="950" height="700" rx="46" fill="#FFFFFF"/>
  </g>

  <rect x="1560" y="600" width="260" height="76" rx="38" fill="#FDF1F6"/>
  <text x="1690" y="648" text-anchor="middle" fill="#3C4043" font-size="34" font-family="Inter, Arial, sans-serif" font-weight="700">${esc(slide.points[0])}</text>

  <rect x="1840" y="600" width="260" height="76" rx="38" fill="#F6EEFB"/>
  <text x="1970" y="648" text-anchor="middle" fill="#3C4043" font-size="34" font-family="Inter, Arial, sans-serif" font-weight="700">${esc(slide.points[1])}</text>

  <rect x="2120" y="600" width="260" height="76" rx="38" fill="#F8F9FA" stroke="#E5E7EB"/>
  <text x="2250" y="648" text-anchor="middle" fill="#3C4043" font-size="34" font-family="Inter, Arial, sans-serif" font-weight="700">${esc(slide.points[2])}</text>

  <text x="1560" y="790" fill="#1A1A1A" font-size="58" font-family="Inter, Arial, sans-serif" font-weight="800">Built for creators</text>
  <text x="1560" y="860" fill="#5F6368" font-size="40" font-family="Inter, Arial, sans-serif" font-weight="500">Modern design, fast setup, and easy sharing.</text>

  <rect x="1560" y="950" width="820" height="110" rx="55" fill="url(#brand${idx})"/>
  <text x="1970" y="1020" text-anchor="middle" fill="#FFFFFF" font-size="46" font-family="Inter, Arial, sans-serif" font-weight="800">${esc(slide.cta)}</text>

  <text x="1280" y="1364" text-anchor="middle" fill="#6F7277" font-size="34" font-family="Inter, Arial, sans-serif" font-weight="600">axiltree.in</text>
</svg>`;

  fs.writeFileSync(path.join(outDir, `${slide.name}.svg`), svg, 'utf8');
});

console.log(`Created ${slides.length} SVG files in ${outDir}`);
