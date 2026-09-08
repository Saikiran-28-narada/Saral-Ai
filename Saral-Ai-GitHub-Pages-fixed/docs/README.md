# Saral AI — Offline-First AI Tutor for Regional Language Students

> iQOO Hackathon 2026 | Smart Education Track | City Battle

## The Problem
Many students in India face a combination of language, internet, distance, and cost barriers when they need help after school.

## The Solution
Saral AI is an **offline-first learning prototype** for Classes 6–12. Core study interactions are designed to keep working without a network, while features such as peer matching, teacher connection, and parent messaging are network-dependent in a production system.

## Features
- Scan a textbook question — prototype camera/scan flow
- Voice input — browser Web Speech API when supported
- Socratic-style AI chat — local demo responses
- Reels — study clips and a prototype upload flow
- Quiz — local question bank with hints and XP
- Doubt Buddy — prototype peer discussion flow
- Exam Countdown — study planning UI
- Teach Back — browser microphone recording when supported
- Teacher Connect — prototype local-volunteer flow
- Parent Report — prototype Tamil/English SMS flow
- Night Mode — auto-enables 7PM–6AM

## Tech Stack
- HTML5, CSS3, Vanilla JavaScript (zero dependencies)
- PWA (Service Worker + Manifest)
- MediaDevices API (camera/microphone)
- Web Speech API (voice input)
- LocalStorage persistence

## Run locally
For normal browser testing, serve the project over HTTP:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## GitHub Pages
The project is intentionally **flat at the repository root**. `index.html` must stay beside `css/`, `js/`, `manifest.json`, and `sw.js`.

For a project repository named `Saral-Ai`, GitHub Pages will publish the app at:

`https://<username>.github.io/Saral-Ai/`

## Production roadmap
The prototype can later connect to:
- On-device OCR and a compact LLM for real question solving
- Whisper.cpp or another speech-to-text model
- Optional cloud sync
- Real teacher/peer matching
- A real SMS gateway

## Team
Saral AI project team
