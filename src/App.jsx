import { useState, useEffect, useRef, useCallback } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

  :root {
    --bg: #09090f;
    --bg2: #0f0f1a;
    --bg3: #141427;
    --card: rgba(255,255,255,0.04);
    --card-border: rgba(255,255,255,0.08);
    --primary: #7c6af7;
    --primary-glow: rgba(124,106,247,0.35);
    --accent: #f97066;
    --accent2: #fbbf24;
    --green: #34d399;
    --blue: #60a5fa;
    --pink: #f472b6;
    --text: #f0effe;
    --muted: rgba(240,239,254,0.45);
    --radius: 20px;
    --radius-sm: 12px;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    overflow-x: hidden;
  }

  .app-shell {
    max-width: 430px;
    margin: 0 auto;
    min-height: 100vh;
    position: relative;
    background: var(--bg);
    overflow: hidden;
  }

  /* ─── SPLASH ─── */
  .splash {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 32px 24px;
  }

  .splash-bg {
    position: absolute; inset: 0; z-index: 0;
    background: radial-gradient(ellipse 80% 60% at 50% 20%, rgba(124,106,247,0.28) 0%, transparent 70%),
                radial-gradient(ellipse 60% 40% at 80% 80%, rgba(249,112,102,0.2) 0%, transparent 60%),
                var(--bg);
  }

  .orb-container {
    position: relative; width: 180px; height: 180px; margin-bottom: 32px;
  }

  .orb {
    width: 180px; height: 180px; border-radius: 50%;
    background: conic-gradient(from 0deg, #7c6af7, #f97066, #fbbf24, #34d399, #7c6af7);
    animation: orbSpin 4s linear infinite;
    filter: blur(2px);
    opacity: 0.9;
  }

  .orb-inner {
    position: absolute; inset: 8px; border-radius: 50%;
    background: var(--bg);
    display: flex; align-items: center; justify-content: center;
    font-size: 56px;
  }

  @keyframes orbSpin { to { transform: rotate(360deg); } }

  .splash-title {
    font-family: 'Syne', sans-serif;
    font-size: 36px; font-weight: 800;
    text-align: center; z-index: 1; line-height: 1.1;
    background: linear-gradient(135deg, #fff 0%, #c4b5fd 50%, #f97066 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    margin-bottom: 12px;
  }

  .splash-sub {
    text-align: center; color: var(--muted); font-size: 15px; z-index: 1;
    max-width: 280px; line-height: 1.6; margin-bottom: 40px;
  }

  /* ─── BUTTONS ─── */
  .btn-primary {
    width: 100%; padding: 17px 24px; border-radius: var(--radius);
    background: linear-gradient(135deg, #7c6af7, #a78bfa);
    border: none; color: #fff; font-size: 16px; font-weight: 600;
    cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
    letter-spacing: 0.3px;
    box-shadow: 0 8px 32px rgba(124,106,247,0.4);
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(124,106,247,0.5); }
  .btn-primary:active { transform: translateY(0); }

  .btn-secondary {
    width: 100%; padding: 15px 24px; border-radius: var(--radius);
    background: var(--card); border: 1.5px solid var(--card-border);
    color: var(--text); font-size: 15px; font-weight: 500; cursor: pointer;
    transition: all 0.2s; font-family: 'DM Sans', sans-serif;
  }
  .btn-secondary:hover { border-color: var(--primary); background: rgba(124,106,247,0.08); }

  .btn-icon {
    width: 44px; height: 44px; border-radius: 50%;
    background: var(--card); border: 1.5px solid var(--card-border);
    color: var(--text); font-size: 18px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
  }
  .btn-icon:hover { border-color: var(--primary); background: var(--primary-glow); }

  /* ─── LANGUAGE SELECT ─── */
  .lang-screen {
    min-height: 100vh; padding: 60px 24px 32px;
    display: flex; flex-direction: column; gap: 24px;
  }

  .lang-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 12px; flex: 1;
  }

  .lang-card {
    padding: 16px; border-radius: var(--radius-sm);
    background: var(--card); border: 1.5px solid var(--card-border);
    cursor: pointer; transition: all 0.22s;
    display: flex; align-items: center; gap: 10px;
  }
  .lang-card:hover { border-color: var(--primary); background: rgba(124,106,247,0.1); transform: scale(1.02); }
  .lang-card.selected { border-color: var(--primary); background: rgba(124,106,247,0.18); }

  .lang-flag { font-size: 26px; }
  .lang-name { font-size: 14px; font-weight: 600; line-height: 1.2; }
  .lang-native { font-size: 11px; color: var(--muted); }

  .section-label {
    font-size: 11px; font-weight: 700; letter-spacing: 1.5px;
    text-transform: uppercase; color: var(--primary); margin-bottom: 4px;
  }

  /* ─── HOME DASHBOARD ─── */
  .home {
    padding: 0 0 100px;
    min-height: 100vh;
  }

  .home-header {
    padding: 56px 24px 24px;
    background: linear-gradient(180deg, rgba(124,106,247,0.12) 0%, transparent 100%);
    position: relative;
  }

  .greeting { font-size: 13px; color: var(--muted); margin-bottom: 4px; }

  .user-name {
    font-family: 'Syne', sans-serif;
    font-size: 26px; font-weight: 800;
  }

  .streak-bar {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 20px; padding: 14px 18px;
    background: var(--card); border: 1px solid var(--card-border);
    border-radius: var(--radius); gap: 8px;
  }

  .stat-pill {
    display: flex; align-items: center; gap: 6px;
    font-size: 13px; font-weight: 600;
  }

  .stat-icon { font-size: 18px; }

  .xp-bar-wrap {
    margin: 20px 24px 0; padding: 14px 18px;
    background: var(--card); border: 1px solid var(--card-border);
    border-radius: var(--radius);
  }

  .xp-label { font-size: 12px; color: var(--muted); margin-bottom: 8px; display: flex; justify-content: space-between; }

  .xp-track {
    height: 8px; background: rgba(255,255,255,0.08); border-radius: 99px; overflow: hidden;
  }

  .xp-fill {
    height: 100%; border-radius: 99px;
    background: linear-gradient(90deg, #7c6af7, #f97066);
    transition: width 1s cubic-bezier(0.34,1.56,0.64,1);
  }

  .section-title {
    font-family: 'Syne', sans-serif;
    font-size: 18px; font-weight: 700;
    padding: 24px 24px 12px;
  }

  /* Daily Challenge */
  .daily-card {
    margin: 0 24px; padding: 20px;
    background: linear-gradient(135deg, rgba(124,106,247,0.25), rgba(249,112,102,0.15));
    border: 1px solid rgba(124,106,247,0.3); border-radius: var(--radius);
    position: relative; overflow: hidden; cursor: pointer;
    transition: transform 0.2s;
  }
  .daily-card:hover { transform: scale(1.01); }
  .daily-badge {
    display: inline-block; padding: 3px 10px; border-radius: 99px;
    background: rgba(249,112,102,0.25); border: 1px solid rgba(249,112,102,0.4);
    color: #f97066; font-size: 11px; font-weight: 700; letter-spacing: 0.5px;
    margin-bottom: 8px;
  }
  .daily-title { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
  .daily-sub { font-size: 13px; color: var(--muted); }
  .daily-cta {
    margin-top: 16px; padding: 10px 20px; border-radius: 99px;
    background: linear-gradient(135deg, #7c6af7, #a78bfa);
    display: inline-block; font-size: 13px; font-weight: 600;
    border: none; color: #fff; cursor: pointer; font-family: 'DM Sans', sans-serif;
  }

  /* Modules */
  .modules-scroll {
    display: flex; gap: 14px;
    padding: 0 24px; overflow-x: auto;
    scrollbar-width: none;
  }
  .modules-scroll::-webkit-scrollbar { display: none; }

  .module-card {
    min-width: 140px; padding: 18px 16px;
    background: var(--card); border: 1.5px solid var(--card-border);
    border-radius: var(--radius); cursor: pointer; transition: all 0.2s;
    display: flex; flex-direction: column; gap: 10px;
  }
  .module-card:hover { border-color: var(--primary); transform: translateY(-3px); }
  .module-card.locked { opacity: 0.5; cursor: not-allowed; }

  .module-icon { font-size: 32px; }
  .module-name { font-size: 13px; font-weight: 600; line-height: 1.3; }
  .module-progress { font-size: 11px; color: var(--muted); }

  .module-bar {
    height: 4px; background: rgba(255,255,255,0.08); border-radius: 99px; overflow: hidden;
  }
  .module-fill { height: 100%; border-radius: 99px; }

  /* Lesson list */
  .lesson-item {
    margin: 0 24px 10px; padding: 16px 18px;
    background: var(--card); border: 1.5px solid var(--card-border);
    border-radius: var(--radius); cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center; gap: 14px;
  }
  .lesson-item:hover { border-color: var(--primary); background: rgba(124,106,247,0.08); }
  .lesson-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
  .lesson-info { flex: 1; }
  .lesson-name { font-size: 14px; font-weight: 600; margin-bottom: 2px; }
  .lesson-meta { font-size: 12px; color: var(--muted); }
  .lesson-xp { font-size: 12px; color: var(--accent2); font-weight: 600; }

  /* ─── BOTTOM NAV ─── */
  .bottom-nav {
    position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
    width: 100%; max-width: 430px;
    background: rgba(9,9,15,0.95); backdrop-filter: blur(20px);
    border-top: 1px solid var(--card-border);
    padding: 12px 0 20px;
    display: flex; justify-content: space-around; z-index: 100;
  }

  .nav-item {
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    cursor: pointer; padding: 6px 16px; border-radius: 12px;
    transition: all 0.2s; border: none; background: none; color: var(--muted);
    font-family: 'DM Sans', sans-serif;
  }
  .nav-item.active { color: var(--primary); }
  .nav-item:hover { color: var(--text); }
  .nav-icon { font-size: 22px; }
  .nav-label { font-size: 10px; font-weight: 600; letter-spacing: 0.5px; }

  /* ─── AI TUTOR ─── */
  .tutor-screen {
    min-height: 100vh; display: flex; flex-direction: column;
    padding-bottom: 100px;
  }

  .tutor-header {
    padding: 56px 24px 20px;
    background: linear-gradient(180deg, rgba(124,106,247,0.15) 0%, transparent 100%);
    display: flex; align-items: center; gap: 14px;
  }

  .tutor-avatar {
    width: 52px; height: 52px; border-radius: 50%; position: relative;
    background: conic-gradient(from 0deg, #7c6af7, #f97066, #fbbf24, #7c6af7);
    animation: orbSpin 3s linear infinite;
    flex-shrink: 0;
  }
  .tutor-avatar-inner {
    position: absolute; inset: 3px; border-radius: 50%;
    background: var(--bg2); display: flex; align-items: center; justify-content: center;
    font-size: 22px;
  }

  .tutor-info { flex: 1; }
  .tutor-name { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; }
  .tutor-status { font-size: 12px; color: var(--green); display: flex; align-items: center; gap: 4px; }
  .status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }

  .mode-tabs {
    display: flex; gap: 8px; padding: 0 24px 16px; overflow-x: auto; scrollbar-width: none;
  }
  .mode-tabs::-webkit-scrollbar { display: none; }

  .mode-tab {
    padding: 8px 16px; border-radius: 99px; white-space: nowrap;
    font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s;
    border: 1.5px solid var(--card-border); background: var(--card); color: var(--muted);
    font-family: 'DM Sans', sans-serif;
  }
  .mode-tab.active { background: var(--primary); border-color: var(--primary); color: #fff; }

  .chat-area {
    flex: 1; overflow-y: auto; padding: 0 24px 16px;
    display: flex; flex-direction: column; gap: 14px;
    scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent;
  }

  .msg { display: flex; gap: 10px; align-items: flex-end; max-width: 85%; }
  .msg.user { flex-direction: row-reverse; align-self: flex-end; }
  .msg.ai { align-self: flex-start; }

  .msg-bubble {
    padding: 12px 16px; border-radius: 18px;
    font-size: 14px; line-height: 1.6;
  }
  .msg.ai .msg-bubble {
    background: var(--card); border: 1px solid var(--card-border);
    border-bottom-left-radius: 4px;
  }
  .msg.user .msg-bubble {
    background: linear-gradient(135deg, #7c6af7, #a78bfa);
    border-bottom-right-radius: 4px;
  }

  .correction-box {
    margin-top: 8px; padding: 10px 14px; border-radius: 12px;
    background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.2);
    font-size: 13px; color: var(--green);
  }
  .correction-label { font-size: 11px; font-weight: 700; letter-spacing: 1px; color: var(--green); opacity: 0.7; margin-bottom: 4px; }

  .translation-box {
    margin-top: 6px; padding: 8px 14px; border-radius: 10px;
    background: rgba(251,191,36,0.08); border: 1px solid rgba(251,191,36,0.15);
    font-size: 12px; color: var(--accent2);
  }

  .chat-input-area {
    padding: 12px 24px; border-top: 1px solid var(--card-border);
    background: rgba(9,9,15,0.95); backdrop-filter: blur(20px);
  }

  .chat-row {
    display: flex; gap: 10px; align-items: flex-end;
  }

  .chat-input {
    flex: 1; padding: 13px 16px; border-radius: var(--radius-sm);
    background: var(--card); border: 1.5px solid var(--card-border);
    color: var(--text); font-size: 14px; resize: none; max-height: 100px;
    font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.2s;
  }
  .chat-input:focus { border-color: var(--primary); }
  .chat-input::placeholder { color: var(--muted); }

  .mic-btn {
    width: 50px; height: 50px; border-radius: 50%;
    background: linear-gradient(135deg, #f97066, #fb923c);
    border: none; font-size: 20px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 20px rgba(249,112,102,0.4);
    transition: all 0.2s; flex-shrink: 0;
  }
  .mic-btn:hover { transform: scale(1.08); }
  .mic-btn.listening {
    animation: micPulse 1.2s ease-in-out infinite;
    background: linear-gradient(135deg, #f97066, #ef4444);
  }
  @keyframes micPulse {
    0%,100% { box-shadow: 0 4px 20px rgba(249,112,102,0.4), 0 0 0 0px rgba(249,112,102,0.3); }
    50% { box-shadow: 0 4px 20px rgba(249,112,102,0.6), 0 0 0 14px rgba(249,112,102,0); }
  }

  .send-btn {
    width: 50px; height: 50px; border-radius: 50%;
    background: linear-gradient(135deg, #7c6af7, #a78bfa);
    border: none; font-size: 18px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 20px rgba(124,106,247,0.4); transition: all 0.2s;
    flex-shrink: 0;
  }
  .send-btn:hover { transform: scale(1.08); }

  /* ─── LESSON PLAYER ─── */
  .lesson-screen {
    min-height: 100vh; background: var(--bg); padding-bottom: 100px;
  }

  .lesson-hero {
    padding: 56px 24px 28px;
    background: linear-gradient(160deg, rgba(124,106,247,0.2), rgba(249,112,102,0.12));
    position: relative; overflow: hidden;
  }

  .lesson-hero-bg {
    position: absolute; top: -40px; right: -40px;
    width: 200px; height: 200px; border-radius: 50%;
    background: radial-gradient(circle, rgba(124,106,247,0.3) 0%, transparent 70%);
  }

  .back-btn {
    display: flex; align-items: center; gap: 8px;
    background: none; border: none; color: var(--muted);
    cursor: pointer; font-size: 14px; font-family: 'DM Sans', sans-serif;
    margin-bottom: 20px;
  }

  .lesson-hero-title {
    font-family: 'Syne', sans-serif;
    font-size: 28px; font-weight: 800; line-height: 1.2;
    margin-bottom: 8px;
  }

  .lesson-progress-bar {
    height: 6px; background: rgba(255,255,255,0.1);
    border-radius: 99px; overflow: hidden; margin-top: 20px;
  }
  .lesson-progress-fill {
    height: 100%; border-radius: 99px;
    background: linear-gradient(90deg, #7c6af7, #f97066);
    transition: width 0.6s cubic-bezier(0.34,1.56,0.64,1);
  }

  .lesson-step {
    padding: 24px;
  }

  .step-card {
    padding: 24px; border-radius: var(--radius);
    background: var(--card); border: 1.5px solid var(--card-border);
    margin-bottom: 16px; transition: all 0.3s;
  }

  .step-label {
    font-size: 11px; font-weight: 700; letter-spacing: 1.5px;
    text-transform: uppercase; margin-bottom: 12px;
  }

  .phrase-display {
    font-family: 'Syne', sans-serif;
    font-size: 22px; font-weight: 700;
    color: var(--text); line-height: 1.4; margin-bottom: 8px;
  }

  .phrase-translation {
    font-size: 14px; color: var(--muted); margin-bottom: 16px;
  }

  .play-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 20px; border-radius: 99px;
    background: rgba(124,106,247,0.15); border: 1px solid rgba(124,106,247,0.3);
    color: var(--primary); font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.2s; border: none; font-family: 'DM Sans', sans-serif;
  }
  .play-btn:hover { background: rgba(124,106,247,0.25); }

  .options-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 10px; margin-top: 4px;
  }

  .option-btn {
    padding: 14px 12px; border-radius: var(--radius-sm);
    background: var(--card); border: 1.5px solid var(--card-border);
    color: var(--text); font-size: 14px; cursor: pointer;
    transition: all 0.2s; font-family: 'DM Sans', sans-serif; font-weight: 500;
    text-align: left;
  }
  .option-btn:hover { border-color: var(--primary); background: rgba(124,106,247,0.1); }
  .option-btn.correct { border-color: var(--green); background: rgba(52,211,153,0.12); color: var(--green); }
  .option-btn.wrong { border-color: var(--accent); background: rgba(249,112,102,0.12); color: var(--accent); }

  .speak-area {
    padding: 24px; text-align: center;
  }

  .speak-orb {
    width: 100px; height: 100px; border-radius: 50%; margin: 0 auto 16px;
    background: conic-gradient(from 0deg, #7c6af7, #f97066, #fbbf24, #34d399, #7c6af7);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.2s; position: relative;
  }
  .speak-orb.idle { animation: orbSpin 3s linear infinite; }
  .speak-orb.listening { animation: orbSpin 0.8s linear infinite; transform: scale(1.1); }
  .speak-orb-inner {
    position: absolute; inset: 6px; border-radius: 50%;
    background: var(--bg); display: flex; align-items: center; justify-content: center;
    font-size: 32px;
  }

  .score-bar-wrap {
    padding: 16px; background: rgba(52,211,153,0.08);
    border-radius: var(--radius-sm); border: 1px solid rgba(52,211,153,0.15);
    margin-top: 16px;
  }
  .score-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; font-size: 13px; }
  .score-value { font-weight: 700; color: var(--green); }

  /* ─── PROGRESS SCREEN ─── */
  .progress-screen {
    padding: 56px 24px 100px;
    min-height: 100vh;
  }

  .progress-title {
    font-family: 'Syne', sans-serif;
    font-size: 26px; font-weight: 800; margin-bottom: 24px;
  }

  .stats-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 12px; margin-bottom: 24px;
  }

  .stat-card {
    padding: 20px; border-radius: var(--radius);
    background: var(--card); border: 1.5px solid var(--card-border);
  }

  .stat-card-label { font-size: 12px; color: var(--muted); margin-bottom: 8px; }
  .stat-card-value { font-family: 'Syne', sans-serif; font-size: 30px; font-weight: 800; }
  .stat-card-unit { font-size: 12px; color: var(--muted); margin-left: 4px; }

  .chart-card {
    padding: 20px; border-radius: var(--radius);
    background: var(--card); border: 1.5px solid var(--card-border);
    margin-bottom: 16px;
  }
  .chart-label { font-size: 14px; font-weight: 600; margin-bottom: 16px; }

  .bar-chart { display: flex; align-items: flex-end; gap: 8px; height: 80px; }
  .bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .bar { border-radius: 4px 4px 0 0; width: 100%; transition: height 1s cubic-bezier(0.34,1.56,0.64,1); }
  .bar-day { font-size: 10px; color: var(--muted); }

  .badge-grid { display: flex; gap: 12px; flex-wrap: wrap; }
  .badge {
    padding: 8px 14px; border-radius: 99px; font-size: 12px; font-weight: 600;
    display: flex; align-items: center; gap: 6px;
  }
  .badge.earned { background: rgba(124,106,247,0.15); border: 1px solid rgba(124,106,247,0.3); color: var(--primary); }
  .badge.locked { background: var(--card); border: 1px solid var(--card-border); color: var(--muted); }

  /* ─── LOADING ─── */
  .loading-dots { display: flex; gap: 6px; align-items: center; padding: 4px 0; }
  .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--primary); }
  .dot:nth-child(1) { animation: dotBounce 1.2s 0s infinite; }
  .dot:nth-child(2) { animation: dotBounce 1.2s 0.2s infinite; }
  .dot:nth-child(3) { animation: dotBounce 1.2s 0.4s infinite; }
  @keyframes dotBounce { 0%,80%,100% { transform:scale(1); opacity:0.5; } 40% { transform:scale(1.4); opacity:1; } }

  /* ─── CELEBRATION ─── */
  .celebration-overlay {
    position: fixed; inset: 0; z-index: 1000;
    display: flex; align-items: center; justify-content: center;
    background: rgba(9,9,15,0.85); backdrop-filter: blur(6px);
    animation: fadeIn 0.3s ease;
  }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }

  .celebration-card {
    background: var(--bg3); border: 1.5px solid var(--card-border);
    border-radius: 24px; padding: 40px 32px; text-align: center;
    animation: popIn 0.4s cubic-bezier(0.34,1.56,0.64,1);
    max-width: 320px; width: 90%;
  }
  @keyframes popIn { from { transform:scale(0.5); opacity:0; } to { transform:scale(1); opacity:1; } }

  .celebrate-emoji { font-size: 64px; margin-bottom: 16px; animation: wobble 1s infinite; }
  @keyframes wobble { 0%,100% { transform:rotate(-5deg); } 50% { transform:rotate(5deg); } }
  .celebrate-title { font-family:'Syne',sans-serif; font-size:26px; font-weight:800; margin-bottom:8px; }
  .celebrate-sub { font-size:14px; color:var(--muted); margin-bottom:24px; }
  .xp-gained { font-size:22px; font-weight:700; color:var(--accent2); margin-bottom:20px; }

  /* Screen transitions */
  .screen-enter { animation: slideUp 0.35s cubic-bezier(0.34,1.2,0.64,1); }
  @keyframes slideUp { from { transform:translateY(30px); opacity:0; } to { transform:translateY(0); opacity:1; } }

  /* ─── VOCAB SCREEN ─── */
  .vocab-screen { padding: 56px 24px 100px; min-height: 100vh; }
  .vocab-search {
    width: 100%; padding: 13px 18px; border-radius: var(--radius-sm);
    background: var(--card); border: 1.5px solid var(--card-border);
    color: var(--text); font-size: 14px; outline: none; font-family: 'DM Sans', sans-serif;
    transition: border-color 0.2s; margin-bottom: 20px;
  }
  .vocab-search:focus { border-color: var(--primary); }

  .word-card {
    padding: 18px; border-radius: var(--radius);
    background: var(--card); border: 1.5px solid var(--card-border);
    margin-bottom: 12px; cursor: pointer; transition: all 0.2s;
  }
  .word-card:hover { border-color: var(--primary); }
  .word-main { font-size: 18px; font-weight: 700; margin-bottom: 2px; }
  .word-phonetic { font-size: 13px; color: var(--primary); margin-bottom: 6px; }
  .word-meaning { font-size: 13px; color: var(--muted); }
  .word-tags { display: flex; gap: 6px; margin-top: 10px; }
  .word-tag {
    padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 600;
    background: rgba(124,106,247,0.1); border: 1px solid rgba(124,106,247,0.2); color: var(--primary);
  }
  .word-ex { font-size: 13px; color: var(--text); font-style: italic; margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--card-border); }

  /* Toast */
  .toast {
    position: fixed; top: 24px; left: 50%; transform: translateX(-50%);
    padding: 12px 24px; border-radius: 99px;
    background: var(--green); color: #fff; font-weight: 600; font-size: 14px;
    z-index: 999; animation: toastIn 0.3s, toastOut 0.3s 2.5s forwards;
    white-space: nowrap; box-shadow: 0 8px 30px rgba(52,211,153,0.4);
  }
  @keyframes toastIn { from { top:-20px;opacity:0; } to { top:24px;opacity:1; } }
  @keyframes toastOut { to { top:-20px;opacity:0; } }
`;

// ─── DATA ────────────────────────────────────────────────────────────────────
const LANGUAGES = {
  indian: [
    { code: "te", name: "Telugu", native: "తెలుగు", flag: "🇮🇳" },
    { code: "hi", name: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
    { code: "ta", name: "Tamil", native: "தமிழ்", flag: "🇮🇳" },
    { code: "kn", name: "Kannada", native: "ಕನ್ನಡ", flag: "🇮🇳" },
    { code: "ml", name: "Malayalam", native: "മലയാളം", flag: "🇮🇳" },
    { code: "mr", name: "Marathi", native: "मराठी", flag: "🇮🇳" },
    { code: "bn", name: "Bengali", native: "বাংলা", flag: "🇮🇳" },
    { code: "gu", name: "Gujarati", native: "ગુજરાતી", flag: "🇮🇳" },
    { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
    { code: "ur", name: "Urdu", native: "اردو", flag: "🇵🇰" },
  ],
  international: [
    { code: "es", name: "Spanish", native: "Español", flag: "🇪🇸" },
    { code: "fr", name: "French", native: "Français", flag: "🇫🇷" },
    { code: "ar", name: "Arabic", native: "العربية", flag: "🇸🇦" },
    { code: "zh", name: "Chinese", native: "中文", flag: "🇨🇳" },
    { code: "ja", name: "Japanese", native: "日本語", flag: "🇯🇵" },
    { code: "ko", name: "Korean", native: "한국어", flag: "🇰🇷" },
  ],
};

const MODULES = [
  { id: 1, name: "Daily Conversations", icon: "💬", color: "#7c6af7", progress: 65, lessons: 24 },
  { id: 2, name: "Pronunciation", icon: "🎯", color: "#f97066", progress: 40, lessons: 18 },
  { id: 3, name: "Job Interview", icon: "💼", color: "#fbbf24", progress: 20, lessons: 15 },
  { id: 4, name: "Travel English", icon: "✈️", color: "#34d399", progress: 80, lessons: 20 },
  { id: 5, name: "Business English", icon: "📊", color: "#60a5fa", progress: 0, lessons: 22, locked: true },
  { id: 6, name: "Kids Zone", icon: "🎪", color: "#f472b6", progress: 0, lessons: 30, locked: true },
];

const LESSONS = [
  { id: 1, name: "Greetings & Introductions", icon: "👋", type: "Conversation", xp: 20, duration: "5 min", level: "Beginner" },
  { id: 2, name: "At the Restaurant", icon: "🍽️", type: "Roleplay", xp: 25, duration: "8 min", level: "Basic" },
  { id: 3, name: "Asking for Directions", icon: "🗺️", type: "Speaking", xp: 30, duration: "10 min", level: "Basic" },
  { id: 4, name: "Job Interview Basics", icon: "💼", type: "Practice", xp: 40, duration: "12 min", level: "Intermediate" },
  { id: 5, name: "Telephonic Conversation", icon: "📞", type: "Roleplay", xp: 35, duration: "10 min", level: "Intermediate" },
];

const VOCAB_WORDS = [
  { word: "Confident", phonetic: "/ˈkɒn.fɪ.dənt/", meaning: "Feeling sure about yourself and your abilities", example: "She was confident in her English speaking skills.", tags: ["Adjective", "Important"] },
  { word: "Fluent", phonetic: "/ˈfluː.ənt/", meaning: "Able to speak a language easily and accurately", example: "He became fluent in English after just one year.", tags: ["Adjective", "Goal"] },
  { word: "Articulate", phonetic: "/ɑːˈtɪk.jʊ.lət/", meaning: "Able to express thoughts clearly", example: "She was articulate in her presentation.", tags: ["Adjective", "Advanced"] },
  { word: "Perseverance", phonetic: "/ˌpɜː.sɪˈvɪər.əns/", meaning: "Continued effort despite difficulty", example: "His perseverance helped him learn English fluently.", tags: ["Noun", "Motivational"] },
  { word: "Accomplish", phonetic: "/əˈkʌm.plɪʃ/", meaning: "To succeed in doing something difficult", example: "You can accomplish anything with practice.", tags: ["Verb", "Common"] },
];

const CHAT_MODES = ["Free Chat", "Interview", "Travel", "Business", "IELTS", "Debate"];

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("splash");
  const [selectedLang, setSelectedLang] = useState(null);
  const [navTab, setNavTab] = useState("home");
  const [toast, setToast] = useState(null);
  const [xp, setXp] = useState(340);
  const [streak, setStreak] = useState(7);
  const [coins, setCoins] = useState(280);
  const [celebration, setCelebration] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = styles;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const celebrate = (data) => {
    setCelebration(data);
    setXp(prev => prev + (data.xp || 20));
    setCoins(prev => prev + (data.coins || 10));
    setTimeout(() => setCelebration(null), 3000);
  };

  const currentScreen = () => {
    if (screen === "splash") return <SplashScreen onStart={() => setScreen("language")} />;
    if (screen === "language") return <LanguageScreen onSelect={(l) => { setSelectedLang(l); setScreen("home"); }} />;
    if (screen === "lesson") return <LessonScreen lesson={activeLesson} onBack={() => setScreen("home")} celebrate={celebrate} showToast={showToast} lang={selectedLang} />;
    return (
      <>
        {navTab === "home" && <HomeScreen streak={streak} xp={xp} coins={coins} lang={selectedLang} onLesson={(l) => { setActiveLesson(l); setScreen("lesson"); }} />}
        {navTab === "tutor" && <TutorScreen lang={selectedLang} celebrate={celebrate} showToast={showToast} />}
        {navTab === "vocab" && <VocabScreen />}
        {navTab === "progress" && <ProgressScreen xp={xp} streak={streak} />}
        <BottomNav active={navTab} onChange={setNavTab} />
      </>
    );
  };

  return (
    <div className="app-shell">
      <div className="screen-enter" key={screen + navTab}>{currentScreen()}</div>
      {toast && <div className="toast">✨ {toast}</div>}
      {celebration && (
        <div className="celebration-overlay" onClick={() => setCelebration(null)}>
          <div className="celebration-card" onClick={e => e.stopPropagation()}>
            <div className="celebrate-emoji">{celebration.emoji || "🎉"}</div>
            <div className="celebrate-title">{celebration.title || "Amazing!"}</div>
            <div className="celebrate-sub">{celebration.sub || "Keep it up!"}</div>
            <div className="xp-gained">+{celebration.xp || 20} XP · +{celebration.coins || 10} 🪙</div>
            <button className="btn-primary" onClick={() => setCelebration(null)}>Continue →</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SPLASH ───────────────────────────────────────────────────────────────────
function SplashScreen({ onStart }) {
  return (
    <div className="splash">
      <div className="splash-bg" />
      <div className="orb-container" style={{ zIndex: 1 }}>
        <div className="orb" />
        <div className="orb-inner">🗣️</div>
      </div>
      <h1 className="splash-title">SpeakAI<br />English</h1>
      <p className="splash-sub">Your personal AI English coach. Learn to speak confidently in any language. 🌏</p>
      <div style={{ width: "100%", zIndex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
        <button className="btn-primary" onClick={onStart}>Start Learning Free 🚀</button>
        <button className="btn-secondary">I already have an account</button>
      </div>
      <p style={{ marginTop: 20, fontSize: 12, color: "rgba(255,255,255,0.25)", zIndex: 1 }}>
        🔒 No credit card · 500,000+ learners worldwide
      </p>
    </div>
  );
}

// ─── LANGUAGE SELECT ──────────────────────────────────────────────────────────
function LanguageScreen({ onSelect }) {
  const [sel, setSel] = useState(null);
  return (
    <div className="lang-screen">
      <div>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, marginBottom: 6 }}>
          What's your language? 🌍
        </h2>
        <p style={{ fontSize: 14, color: "var(--muted)" }}>We'll explain everything in your language</p>
      </div>

      <div>
        <div className="section-label">🇮🇳 Indian Languages</div>
        <div className="lang-grid">
          {LANGUAGES.indian.map(l => (
            <div key={l.code} className={`lang-card ${sel?.code === l.code ? "selected" : ""}`} onClick={() => setSel(l)}>
              <span className="lang-flag">{l.flag}</span>
              <div><div className="lang-name">{l.name}</div><div className="lang-native">{l.native}</div></div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="section-label">🌐 International</div>
        <div className="lang-grid">
          {LANGUAGES.international.map(l => (
            <div key={l.code} className={`lang-card ${sel?.code === l.code ? "selected" : ""}`} onClick={() => setSel(l)}>
              <span className="lang-flag">{l.flag}</span>
              <div><div className="lang-name">{l.name}</div><div className="lang-native">{l.native}</div></div>
            </div>
          ))}
        </div>
      </div>

      <button className="btn-primary" style={{ opacity: sel ? 1 : 0.4 }} disabled={!sel} onClick={() => sel && onSelect(sel)}>
        Continue with {sel?.name || "your language"} →
      </button>
    </div>
  );
}

// ─── HOME DASHBOARD ───────────────────────────────────────────────────────────
function HomeScreen({ streak, xp, coins, lang, onLesson }) {
  const level = xp < 200 ? "Beginner" : xp < 500 ? "Basic" : xp < 1000 ? "Intermediate" : "Advanced";
  const nextLevelXp = xp < 200 ? 200 : xp < 500 ? 500 : xp < 1000 ? 1000 : 2000;
  const progress = Math.min((xp / nextLevelXp) * 100, 100);

  return (
    <div className="home">
      <div className="home-header">
        <div className="greeting">Good morning 👋</div>
        <div className="user-name">Rahul Kumar</div>

        <div className="streak-bar">
          <div className="stat-pill"><span className="stat-icon">🔥</span>{streak} Day Streak</div>
          <div className="stat-pill"><span className="stat-icon">⭐</span>{xp} XP</div>
          <div className="stat-pill"><span className="stat-icon">🪙</span>{coins}</div>
          <div className="stat-pill"><span style={{ fontSize: 11, background: "var(--primary-glow)", padding: "3px 10px", borderRadius: 99, color: "var(--primary)", fontWeight: 700 }}>{level}</span></div>
        </div>
      </div>

      <div className="xp-bar-wrap">
        <div className="xp-label">
          <span>{level} → Next Level</span>
          <span>{xp} / {nextLevelXp} XP</span>
        </div>
        <div className="xp-track">
          <div className="xp-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Daily Challenge */}
      <div className="section-title">Today's Challenge 🎯</div>
      <div className="daily-card" onClick={() => onLesson(LESSONS[0])}>
        <div className="daily-bg" />
        <div className="daily-badge">🔥 DAILY MISSION</div>
        <div className="daily-title">Speak for 2 Minutes</div>
        <div className="daily-sub">Practice ordering food at a restaurant with your AI tutor</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16 }}>
          <button className="daily-cta">Start Now →</button>
          <span style={{ fontSize: 13, color: "var(--accent2)", fontWeight: 600 }}>+50 XP · +25 🪙</span>
        </div>
      </div>

      {/* Modules */}
      <div className="section-title">Learning Paths 📚</div>
      <div className="modules-scroll">
        {MODULES.map(m => (
          <div key={m.id} className={`module-card ${m.locked ? "locked" : ""}`}>
            <div className="module-icon">{m.icon}</div>
            <div className="module-name">{m.name}</div>
            <div className="module-progress">{m.locked ? "🔒 Locked" : `${m.progress}% · ${m.lessons} lessons`}</div>
            {!m.locked && (
              <div className="module-bar">
                <div className="module-fill" style={{ width: `${m.progress}%`, background: m.color, height: "100%" }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lessons */}
      <div className="section-title">Continue Learning ▶️</div>
      {LESSONS.map(l => (
        <div key={l.id} className="lesson-item" onClick={() => onLesson(l)}>
          <div className="lesson-icon" style={{ background: "rgba(124,106,247,0.12)" }}>{l.icon}</div>
          <div className="lesson-info">
            <div className="lesson-name">{l.name}</div>
            <div className="lesson-meta">{l.type} · {l.duration} · {l.level}</div>
          </div>
          <div className="lesson-xp">+{l.xp} XP</div>
        </div>
      ))}

      {/* Native language tip */}
      {lang && (
        <div style={{ margin: "16px 24px", padding: "16px 18px", borderRadius: "var(--radius)", background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.15)" }}>
          <div style={{ fontSize: 12, color: "var(--accent2)", fontWeight: 700, marginBottom: 4 }}>
            🌟 Learning in {lang.name}
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>
            All explanations are available in {lang.name} ({lang.native})
          </div>
        </div>
      )}
    </div>
  );
}

// ─── AI TUTOR SCREEN ──────────────────────────────────────────────────────────
function TutorScreen({ lang, celebrate, showToast }) {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: `Hi! I'm ARIA, your AI English coach 🎓 I'm here to help you speak confidently! ${lang ? `I can explain things in ${lang.name} too!` : ""} What would you like to practice today?`,
      correction: null,
      translation: null,
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [mode, setMode] = useState("Free Chat");
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    const userText = text.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userText }]);
    setLoading(true);

    try {
      const systemPrompt = `You are ARIA, a friendly, encouraging AI English speaking coach for learners from India and around the world. 
The user's native language is: ${lang?.name || "unknown"}.
Current practice mode: ${mode}.
Your job:
1. Respond naturally and conversationally in English (2-4 sentences)
2. Gently correct any grammar/vocabulary mistakes by showing the better version
3. Give a brief translation/explanation in ${lang?.name || "their native language"} if helpful
4. Be encouraging and motivating
5. Give pronunciation tips when relevant

Respond in this JSON format:
{
  "response": "your conversational response here",
  "correction": "If they made a mistake: 'Instead of X, say Y' — or null if no mistakes",
  "translation": "A brief helpful translation or tip in ${lang?.name || "their language"} — or null if not needed",
  "encouragement": "a short encouraging emoji + phrase"
}`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [
            ...messages.filter(m => m.role !== "ai" || messages.indexOf(m) === 0).map(m => ({
              role: m.role === "ai" ? "assistant" : "user",
              content: m.text
            })),
            { role: "user", content: userText }
          ]
        })
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text || "{}";
      let parsed;
      try {
        const clean = raw.replace(/```json|```/g, "").trim();
        parsed = JSON.parse(clean);
      } catch { parsed = { response: raw, correction: null, translation: null }; }

      setMessages(prev => [...prev, {
        role: "ai",
        text: parsed.response || "Great! Keep practicing!",
        correction: parsed.correction || null,
        translation: parsed.translation || null,
        encouragement: parsed.encouragement || null,
      }]);

      // Random celebration on good responses
      if (Math.random() > 0.7) {
        celebrate({ emoji: "🎯", title: "Great Speaking!", sub: "Your fluency is improving!", xp: 15, coins: 8 });
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "ai", text: "Sorry, I had a connection issue. Please try again!", correction: null }]);
    }
    setLoading(false);
  };

  const toggleMic = () => {
    setListening(l => {
      if (!l) {
        showToast("Listening... speak now!");
        setTimeout(() => {
          setListening(false);
          sendMessage("I am going to market to buy some vegetable");
        }, 2500);
      }
      return !l;
    });
  };

  return (
    <div className="tutor-screen">
      <div className="tutor-header">
        <div className="tutor-avatar">
          <div className="tutor-avatar-inner">🤖</div>
        </div>
        <div className="tutor-info">
          <div className="tutor-name">ARIA — AI Coach</div>
          <div className="tutor-status"><span className="status-dot" />Online · Ready to help</div>
        </div>
        <button className="btn-icon" title="Settings">⚙️</button>
      </div>

      <div className="mode-tabs">
        {CHAT_MODES.map(m => (
          <button key={m} className={`mode-tab ${mode === m ? "active" : ""}`} onClick={() => setMode(m)}>{m}</button>
        ))}
      </div>

      <div className="chat-area" ref={chatRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`msg ${msg.role}`}>
            <div>
              <div className="msg-bubble">{msg.text}</div>
              {msg.correction && (
                <div className="correction-box">
                  <div className="correction-label">✏️ CORRECTION</div>
                  {msg.correction}
                </div>
              )}
              {msg.translation && (
                <div className="translation-box">
                  💡 {msg.translation}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="msg ai">
            <div className="msg-bubble">
              <div className="loading-dots">
                <div className="dot" /><div className="dot" /><div className="dot" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="chat-input-area">
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8, textAlign: "center" }}>
          🎙️ Tap mic to speak · ⌨️ Type to practice
        </div>
        <div className="chat-row">
          <button className={`mic-btn ${listening ? "listening" : ""}`} onClick={toggleMic}>
            {listening ? "⏹" : "🎙️"}
          </button>
          <textarea
            className="chat-input"
            placeholder={`Practice your English here... (${mode} mode)`}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
            rows={1}
          />
          <button className="send-btn" onClick={() => sendMessage(input)}>➤</button>
        </div>
      </div>
    </div>
  );
}

// ─── LESSON PLAYER ────────────────────────────────────────────────────────────
function LessonScreen({ lesson, onBack, celebrate, showToast, lang }) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const [score, setScore] = useState(null);
  const [aiHint, setAiHint] = useState("");
  const [hintLoading, setHintLoading] = useState(false);

  const steps = [
    { type: "intro", phrase: "How can I help you?", translation: lang ? `${lang.name}: మీకు ఎలా సహాయం చేయగలను?` : null },
    { type: "quiz", question: "Which is correct?", options: ["I goes to school", "I go to school", "Me go school", "Going school I"] },
    { type: "speak", phrase: "I would like to order a coffee, please." },
    { type: "complete" },
  ];

  const current = steps[step];
  const progress = ((step) / (steps.length - 1)) * 100;

  const handleOption = (opt, idx) => {
    setSelected(idx);
    const correct = idx === 1;
    setTimeout(() => {
      if (correct) {
        showToast("Correct! Well done! ✅");
        setTimeout(() => { setSelected(null); setStep(s => s + 1); }, 800);
      } else {
        setTimeout(() => { setSelected(null); }, 1000);
      }
    }, 400);
  };

  const handleSpeak = () => {
    setSpeaking(true);
    setTimeout(() => {
      setSpeaking(false);
      setScore({ pronunciation: 82, fluency: 76, confidence: 88, overall: 82 });
      setTimeout(() => { setStep(s => s + 1); }, 2000);
    }, 3000);
  };

  const getAIHint = async (phrase) => {
    setHintLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Give a very short, friendly tip (2 sentences max) to help an English learner pronounce and use this phrase naturally: "${phrase}". ${lang ? `Include a helpful note in ${lang.name}.` : ""}`
          }]
        })
      });
      const data = await res.json();
      setAiHint(data.content?.[0]?.text || "");
    } catch { setAiHint("Focus on speaking slowly and clearly!"); }
    setHintLoading(false);
  };

  if (current?.type === "complete") {
    setTimeout(() => {
      celebrate({ emoji: "🏆", title: "Lesson Complete!", sub: `You finished: ${lesson?.name}`, xp: lesson?.xp || 25, coins: 15 });
      onBack();
    }, 300);
    return null;
  }

  return (
    <div className="lesson-screen">
      <div className="lesson-hero">
        <div className="lesson-hero-bg" />
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>{lesson?.type} · {lesson?.level}</div>
        <div className="lesson-hero-title">{lesson?.name}</div>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <span style={{ fontSize: 12, color: "var(--accent2)" }}>+{lesson?.xp} XP on completion</span>
        </div>
        <div className="lesson-progress-bar">
          <div className="lesson-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>Step {step + 1} of {steps.length}</div>
      </div>

      <div className="lesson-step">
        {/* INTRO STEP */}
        {current?.type === "intro" && (
          <div>
            <div className="step-card">
              <div className="step-label" style={{ color: "var(--primary)" }}>📖 LISTEN & LEARN</div>
              <div className="phrase-display">"{current.phrase}"</div>
              {current.translation && (
                <div className="phrase-translation">💡 {current.translation}</div>
              )}
              <button className="play-btn" onClick={() => showToast("Playing audio...")}>
                🔊 Play Audio
              </button>
              <button className="play-btn" style={{ marginLeft: 8 }} onClick={() => getAIHint(current.phrase)}>
                {hintLoading ? "..." : "💡 AI Tip"}
              </button>
            </div>
            {aiHint && (
              <div style={{ padding: "14px 16px", background: "rgba(124,106,247,0.08)", border: "1px solid rgba(124,106,247,0.2)", borderRadius: "var(--radius-sm)", fontSize: 13, lineHeight: 1.6 }}>
                🤖 {aiHint}
              </div>
            )}
            <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => setStep(s => s + 1)}>
              Got it! Next →
            </button>
          </div>
        )}

        {/* QUIZ STEP */}
        {current?.type === "quiz" && (
          <div>
            <div className="step-card">
              <div className="step-label" style={{ color: "var(--accent2)" }}>❓ CHOOSE THE CORRECT ANSWER</div>
              <div className="phrase-display" style={{ fontSize: 18 }}>{current.question}</div>
            </div>
            <div className="options-grid">
              {current.options.map((opt, i) => (
                <button
                  key={i}
                  className={`option-btn ${selected === i ? (i === 1 ? "correct" : "wrong") : ""}`}
                  onClick={() => selected === null && handleOption(opt, i)}
                >
                  {selected === i && (i === 1 ? "✅ " : "❌ ")}{opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SPEAK STEP */}
        {current?.type === "speak" && (
          <div>
            <div className="step-card">
              <div className="step-label" style={{ color: "var(--accent)" }}>🎙️ SPEAK ALOUD</div>
              <div className="phrase-display">"{current.phrase}"</div>
              <button className="play-btn" onClick={() => showToast("Playing model pronunciation...")}>
                🔊 Hear it first
              </button>
            </div>

            <div className="speak-area">
              <div className={`speak-orb ${speaking ? "listening" : "idle"}`} onClick={!speaking && !score ? handleSpeak : undefined}>
                <div className="speak-orb-inner">{speaking ? "👂" : score ? "✅" : "🎙️"}</div>
              </div>
              <div style={{ fontSize: 14, color: "var(--muted)", marginBottom: 8 }}>
                {speaking ? "Listening... keep speaking!" : score ? "Great job!" : "Tap to speak"}
              </div>

              {score && (
                <div className="score-bar-wrap">
                  <div className="score-row"><span>Pronunciation</span><span className="score-value">{score.pronunciation}%</span></div>
                  <div className="score-row"><span>Fluency</span><span className="score-value">{score.fluency}%</span></div>
                  <div className="score-row"><span>Confidence</span><span className="score-value">{score.confidence}%</span></div>
                  <div style={{ marginTop: 8, height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${score.overall}%`, background: "linear-gradient(90deg, #34d399, #60a5fa)", borderRadius: 99 }} />
                  </div>
                  <div style={{ fontSize: 12, color: "var(--green)", marginTop: 4, fontWeight: 700 }}>Overall: {score.overall}% 🎉</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── VOCAB SCREEN ─────────────────────────────────────────────────────────────
function VocabScreen() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);

  const filtered = VOCAB_WORDS.filter(w =>
    w.word.toLowerCase().includes(search.toLowerCase()) ||
    w.meaning.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="vocab-screen">
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, marginBottom: 6 }}>
        Vocabulary 📖
      </div>
      <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>Build your English word power</p>

      <input
        className="vocab-search"
        placeholder="🔍 Search words..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {["All", "Adjective", "Noun", "Verb", "Important", "Advanced"].map(t => (
          <button key={t} style={{ padding: "6px 14px", borderRadius: 99, background: "var(--card)", border: "1.5px solid var(--card-border)", color: "var(--muted)", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'DM Sans',sans-serif" }}>
            {t}
          </button>
        ))}
      </div>

      {filtered.map((w, i) => (
        <div key={i} className="word-card" onClick={() => setExpanded(expanded === i ? null : i)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div className="word-main">{w.word}</div>
              <div className="word-phonetic">{w.phonetic}</div>
              <div className="word-meaning">{w.meaning}</div>
            </div>
            <button style={{ background: "rgba(124,106,247,0.12)", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 16 }}>
              🔊
            </button>
          </div>
          <div className="word-tags">
            {w.tags.map(t => <span key={t} className="word-tag">{t}</span>)}
          </div>
          {expanded === i && (
            <div className="word-ex">💬 "{w.example}"</div>
          )}
        </div>
      ))}

      <div style={{ textAlign: "center", padding: "20px 0", color: "var(--muted)", fontSize: 13 }}>
        🎯 Daily word goal: 5/5 complete! +25 XP earned
      </div>
    </div>
  );
}

// ─── PROGRESS SCREEN ──────────────────────────────────────────────────────────
function ProgressScreen({ xp, streak }) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const barData = [45, 70, 55, 90, 60, 85, xp % 100];

  const badges = [
    { icon: "🔥", name: "7-Day Streak", earned: true },
    { icon: "🗣️", name: "First Conversation", earned: true },
    { icon: "🎯", name: "Pronunciation Pro", earned: true },
    { icon: "💼", name: "Interview Ready", earned: false },
    { icon: "✈️", name: "Travel Expert", earned: false },
    { icon: "🏆", name: "English Master", earned: false },
  ];

  return (
    <div className="progress-screen">
      <div className="progress-title">Your Progress 📈</div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-label">🔥 Current Streak</div>
          <div className="stat-card-value">{streak}<span className="stat-card-unit">days</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">⭐ Total XP</div>
          <div className="stat-card-value">{xp}<span className="stat-card-unit">xp</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">⏱️ Time Learned</div>
          <div className="stat-card-value">4.2<span className="stat-card-unit">hrs</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">✅ Lessons Done</div>
          <div className="stat-card-value">18<span className="stat-card-unit">lessons</span></div>
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-label">📊 Weekly XP Activity</div>
        <div className="bar-chart">
          {barData.map((val, i) => (
            <div key={i} className="bar-col">
              <div className="bar" style={{ height: `${(val / 100) * 70}px`, background: `linear-gradient(180deg, #7c6af7, #a78bfa)`, minHeight: 4 }} />
              <div className="bar-day">{days[i]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-label">🎯 Pronunciation Scores</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[["Clarity", 78], ["Fluency", 65], ["Accent", 72], ["Grammar", 85]].map(([label, val]) => (
            <div key={label}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                <span>{label}</span><span style={{ fontWeight: 600 }}>{val}%</span>
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${val}%`, background: val > 80 ? "#34d399" : val > 65 ? "#fbbf24" : "#f97066", borderRadius: 99, transition: "width 1s" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-label">🏅 Badges & Achievements</div>
        <div className="badge-grid">
          {badges.map((b, i) => (
            <div key={i} className={`badge ${b.earned ? "earned" : "locked"}`}>
              {b.icon} {b.name}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px 20px", background: "rgba(124,106,247,0.08)", border: "1px solid rgba(124,106,247,0.2)", borderRadius: "var(--radius)" }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>🤖 AI Recommendation</div>
        <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
          Your pronunciation is improving! Focus more on <strong style={{ color: "var(--text)" }}>Fluency exercises</strong> this week. Try the Shadowing lessons for best results.
        </div>
      </div>
    </div>
  );
}

// ─── BOTTOM NAV ───────────────────────────────────────────────────────────────
function BottomNav({ active, onChange }) {
  const tabs = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "tutor", icon: "🤖", label: "AI Tutor" },
    { id: "vocab", icon: "📖", label: "Vocab" },
    { id: "progress", icon: "📈", label: "Progress" },
  ];
  return (
    <div className="bottom-nav">
      {tabs.map(t => (
        <button key={t.id} className={`nav-item ${active === t.id ? "active" : ""}`} onClick={() => onChange(t.id)}>
          <span className="nav-icon">{t.icon}</span>
          <span className="nav-label">{t.label}</span>
        </button>
      ))}
    </div>
  );
}
