# AxilTree Future Features Roadmap

This file tracks high-impact features to improve AxilTree as a Linktree-style platform.

## Priority 1 (Next 2-4 weeks)

- [ ] **Custom Domains**
  - Let users connect their own domain (e.g. `links.yourbrand.com`).
  - Add DNS verification flow and fallback subdomain.

- [ ] **Advanced Analytics**
  - Track clicks by date, country, device, and referrer.
  - ✅ Added chart filters (`1d`, `7d`, `30d`, `90d`, `custom`) on 2026-02-28.
  - ✅ Added CSV report export for current filtered analytics on 2026-02-28.

- [x] **SEO + Social Sharing Metadata**
  - Per-profile title, description, and OG image.
  - Better previews for WhatsApp, X, Facebook, and iMessage.
  - Completed on 2026-02-28.

- [x] **Profile Completion Score**
  - Show checklist (avatar, bio, links, theme, username).
  - Encourage activation and better onboarding.
  - Completed on 2026-02-28.

- [ ] **Draft / Publish Mode**
  - Allow users to prepare link changes and publish when ready.

## Priority 2 (Next 1-2 months)

- [ ] **Monetization Blocks**
  - Tip jar, one-time payment links, and product/booking blocks.

- [x] **Content Blocks Beyond Links**
  - Add support for text, video embed, music embed, and image gallery blocks.
  - Completed on 2026-03-01.

- [ ] **A/B Testing for Link Order**
  - Test different link arrangements and compare conversion rates.

- [x] **Smart Link Scheduling**
  - Schedule links by date/time, auto-expire campaigns.
  - Completed on 2026-03-01.

- [ ] **Team / Creator Workspace**
  - Multi-user access with role permissions (owner, editor, viewer).

## Priority 3 (Long-term)

- [ ] **Template Marketplace**
  - Community templates and premium designs.
  - ✅ Added 20 starter templates for testing on 2026-02-28.

- [ ] **AI Assistant for Bio Optimization**
  - Suggest better bios, link labels, and layout ordering.

- [ ] **Native Mobile App**
  - Quick edit, instant analytics snapshots, push alerts for spikes.

- [ ] **Public API + Webhooks**
  - Programmatic link management and external integrations.

## Platform / Engineering Improvements

- [ ] Add automated tests (unit + integration + basic E2E).
- [ ] Add rate limiting on public click endpoints.
- [ ] Add abuse protection (spam links, phishing detection).
- [ ] Add observability (error tracking + performance monitoring).
- [ ] Improve docs: split setup, architecture, and deployment guides.

## Suggested Success Metrics

- Activation rate: `% users publishing first profile`
- Link CTR: `clicks / profile views`
- 7-day retention
- Average links per active profile
- Time-to-first-publish
