# Architecture

```text
┌────────────────────────────────────────────┐
│                 Client (PWA)               │
│  index.html + css + js (vanilla, no build) │
│  ├─ Service Worker → offline cache         │
│  ├─ LocalStorage → profile, mode, progress │
│  └─ Camera / Mic / Web Speech APIs         │
└───────────────────┬────────────────────────┘
                    │
          optional network features
                    ▼
┌────────────────────────────────────────────┐
│          Production integrations           │
│  Sync backend → users, doubts, reels       │
│  AI service   → advanced Socratic answers  │
│  SMS gateway  → parent reports             │
│  Matching     → peers and local teachers   │
└────────────────────────────────────────────┘
```

## Current prototype
The repository is a zero-build static web app. Demo flows are intentionally self-contained so the project can run on GitHub Pages without a backend.

## Production roadmap
- Camera → OCR → on-device/remote question solving
- Voice → speech-to-text → Socratic tutor
- Optional cloud sync for progress and content
- Real peer/teacher matching
- Real parent SMS delivery
