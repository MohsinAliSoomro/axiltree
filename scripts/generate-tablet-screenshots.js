const fs = require('fs');
const path = require('path');

const outDir = path.join(process.cwd(), 'public/playstore/screenshots/7-inch-tablet');
fs.mkdirSync(outDir, { recursive: true });

const slides = [
  {
    name: 'tablet-01-overview',
    title: 'One Bio Link for Everything',
    subtitle: 'Share all your important links from one beautiful AxilTree page.',
    points: ['Creators', 'Brands', 'Freelancers'],
    cta: 'Start Free in Minutes',
  },
  {
    name: 'tablet-02-customization',
    title: 'Customize Your Profile Style',
    subtitle: 'Themes, fonts, and colors that match your personal brand.',
    points: ['20+ Themes', 'Custom Fonts', 'Mobile Friendly'],
    cta: 'Make It Yours',
  },
  {
    name: 'tablet-03-links',
    title: 'Manage Links in Seconds',
    subtitle: 'Add, edit, reorder and publish links with drag and drop.',
    points: ['Fast Editing', 'Drag & Drop', 'Instant Updates'],
    cta: 'Control Link Priority',
  },
  {
    name: 'tablet-04-analytics',
    title: 'Track Clicks, Grow Smarter',
    subtitle: 'Understand what your audience taps most and optimize faster.',
    points: ['Click Tracking', 'Top Link Insights', 'Realtime'],
    cta: 'Optimize Performance',
  },
  {
    name: 'tablet-05-sharing',
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
<svg width="1920" height="1080" viewBox="0 0 1920 1080" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg${idx}" x1="0" y1="0" x2="1920" y2="1080" gradientUnits="userSpaceOnUse">
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
      <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#000000" flood-opacity="0.16"/>
    </filter>
  </defs>

  <rect width="1920" height="1080" fill="url(#bg${idx})"/>
  <circle cx="170" cy="120" r="120" fill="#E4405F" fill-opacity="0.10"/>
  <circle cx="1780" cy="960" r="170" fill="#C13584" fill-opacity="0.10"/>

  <rect x="90" y="70" width="50" height="50" rx="14" fill="url(#brand${idx})"/>
  <path d="M104 95L115 81L126 95L115 109L104 95Z" fill="#FFFFFF"/>
  <text x="156" y="106" fill="#1A1A1A" font-size="46" font-family="Inter, Arial, sans-serif" font-weight="800">Axil</text>
  <text x="240" y="106" fill="url(#brand${idx})" font-size="46" font-family="Inter, Arial, sans-serif" font-weight="800">Tree</text>

  <text x="90" y="235" fill="#1A1A1A" font-size="78" font-family="Inter, Arial, sans-serif" font-weight="900">${esc(slide.title)}</text>
  <text x="90" y="300" fill="#5F6368" font-size="36" font-family="Inter, Arial, sans-serif" font-weight="500">${esc(slide.subtitle)}</text>

  <g filter="url(#shadow${idx})">
    <rect x="90" y="350" width="980" height="520" rx="36" fill="#FFFFFF"/>
  </g>

  <rect x="140" y="420" width="880" height="300" rx="30" fill="url(#device${idx})"/>
  <rect x="185" y="455" width="790" height="230" rx="24" fill="#FBFAFF"/>
  <rect x="508" y="438" width="150" height="10" rx="5" fill="#1A1A1A"/>
  <circle cx="580" cy="530" r="40" fill="#E4405F" fill-opacity="0.2"/>
  <text x="580" y="595" text-anchor="middle" fill="#1A1A1A" font-size="28" font-family="Inter, Arial, sans-serif" font-weight="700">@yourname</text>
  <rect x="360" y="620" width="440" height="48" rx="24" fill="url(#brand${idx})"/>
  <text x="580" y="652" text-anchor="middle" fill="#FFFFFF" font-size="22" font-family="Inter, Arial, sans-serif" font-weight="700">Main Link</text>

  <g filter="url(#shadow${idx})">
    <rect x="1120" y="350" width="710" height="520" rx="36" fill="#FFFFFF"/>
  </g>

  <rect x="1170" y="430" width="190" height="56" rx="28" fill="#FDF1F6"/>
  <text x="1265" y="466" text-anchor="middle" fill="#3C4043" font-size="24" font-family="Inter, Arial, sans-serif" font-weight="700">${esc(slide.points[0])}</text>

  <rect x="1380" y="430" width="190" height="56" rx="28" fill="#F6EEFB"/>
  <text x="1475" y="466" text-anchor="middle" fill="#3C4043" font-size="24" font-family="Inter, Arial, sans-serif" font-weight="700">${esc(slide.points[1])}</text>

  <rect x="1590" y="430" width="190" height="56" rx="28" fill="#F8F9FA" stroke="#E5E7EB"/>
  <text x="1685" y="466" text-anchor="middle" fill="#3C4043" font-size="24" font-family="Inter, Arial, sans-serif" font-weight="700">${esc(slide.points[2])}</text>

  <text x="1170" y="565" fill="#1A1A1A" font-size="42" font-family="Inter, Arial, sans-serif" font-weight="800">Built for creators</text>
  <text x="1170" y="620" fill="#5F6368" font-size="30" font-family="Inter, Arial, sans-serif" font-weight="500">Modern design, fast setup, and easy sharing.</text>

  <rect x="1170" y="690" width="610" height="86" rx="43" fill="url(#brand${idx})"/>
  <text x="1475" y="746" text-anchor="middle" fill="#FFFFFF" font-size="33" font-family="Inter, Arial, sans-serif" font-weight="800">${esc(slide.cta)}</text>

  <text x="960" y="1024" text-anchor="middle" fill="#6F7277" font-size="26" font-family="Inter, Arial, sans-serif" font-weight="600">axiltree.in</text>
</svg>`;

  fs.writeFileSync(path.join(outDir, `${slide.name}.svg`), svg, 'utf8');
});

console.log(`Created ${slides.length} SVG files in ${outDir}`);
