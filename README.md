# 🚀 PrepOS — AI-Powered Interview Preparation OS

> A guided, AI-first system that takes college students from *confused → interview-ready*.

---

## 🧠 What is PrepOS?

PrepOS is a full-stack, AI-powered interview preparation platform designed **exclusively for college students**.

Instead of juggling:

* Notes in Notion
* Trackers in Excel
* Practice on LeetCode
* Resources on YouTube

👉 PrepOS combines everything into **one intelligent system** that:

* Guides your preparation
* Tracks your progress
* Conducts mock interviews
* Tells you *exactly what to do next*

---

## ⚠️ The Problem

Students preparing for internships face:

* ❌ Scattered tools
* ❌ No structured workflow
* ❌ No personalized guidance
* ❌ Last-minute panic before interviews

> There is no single system that actively *coaches* them.

---

## 💡 The Solution

PrepOS is not a productivity tool.

It is a **guided Interview Operating System**.

* 🧭 Tells you what to do next
* 🤖 Interviews you
* 📊 Tracks your progress
* ⏰ Reminds you when to prepare
* 🧠 Adapts to your weaknesses

---

## 🆚 Why Not Notion / Excel?

| Tool   | Limitation                    |
| ------ | ----------------------------- |
| Notion | Blank — requires manual setup |
| Excel  | Data only — no intelligence   |
| PrepOS | Guided, proactive, AI-driven  |

> The difference = *Notebook vs Personal Interview Coach*

---

## 🎯 Target Users

| Persona              | Description                 | Pain Point                  |
| -------------------- | --------------------------- | --------------------------- |
| Anxious Fresher      | First internship prep       | Doesn't know where to start |
| Organised Tracker    | Managing multiple companies | Spreadsheet chaos           |
| Ideator              | Has many project ideas      | No execution                |
| Last-Minute Preparer | Prepares late               | No reminders                |

---

## 🧩 Core Product Pillars

* 🏗️ **Centralisation** — Everything in one place
* 🧠 **Intelligence** — AI-driven guidance
* ⚡ **Simplicity** — Built for students
* 🎯 **Action-Oriented** — Always pushes next step

---

## 🚀 Key Features

### 🤖 AI Mock Interview Engine (FLAGSHIP)

* Role-based interview simulation
* Dynamic AI-generated questions
* Real-time answer evaluation
* Instant feedback:

  * Score (0–100)
  * Status (Correct / Partial / Incorrect)
  * Improvement hints

#### 📊 Performance Report

* Overall score + breakdown
* Per-question analysis
* Weak areas detection
* Topics to revise
* Next-step recommendations

---

### 📊 Interview Tracker (Smart Excel)

* Track all applications in one place
* Manage:

  * Company
  * Role
  * Interview dates
  * Status pipeline

#### 🔔 AI Reminder System

* 7 days before interview:

  * Sends notification
  * Generates prep plan
  * Suggests topics based on company patterns

---

### 🧠 Brainstorm Board (Idea Lab)

* Store project / hackathon ideas
* AI expansion generates:

  * Structured proposal
  * Tech stack
  * Timeline
  * Resume impact score

---

### 🗺️ Prep Roadmap Generator

* Input:

  * Target role
  * Timeline
* Output:

  * Week-by-week prep roadmap
  * Topics + practice plan
  * Readiness score

---

### 📚 Resource Hub + Progress Tracker

* Topic-wise learning system:

  * DSA
  * CS Fundamentals
  * System Design
  * HR Questions

* Track:

  * Completion
  * Bookmarks
  * Readiness

---

## 🏗️ Tech Stack

### Frontend

* Next.js (App Router)
* React
* Tailwind CSS
* Framer Motion

### Backend

* Next.js API Routes
* Supabase (DB + Auth)

### AI Layer

* OpenRouter / Gemini API
* Custom prompt engineering

### Infrastructure

* Vercel (Deployment)
* Supabase Storage
* pg_cron (Scheduled jobs)
* Resend (Emails)

---

## 🧾 Database Schema (Core)

### `mock_interviews`

* `id`
* `user_id`
* `role`
* `difficulty`
* `interview_type`
* `score`
* `transcript`
* `weak_areas`
* `revise_topics`

### `interview_tracker`

* `company`
* `role`
* `status`
* `interview_date`
* `prep_plan`

### `brainstorm_cards`

* `title`
* `description`
* `tag`
* `ai_expansion`

---

## ⚙️ How It Works

1. User configures interview
2. AI generates questions
3. User answers
4. AI evaluates in real-time
5. Next question generated
6. Final report created
7. Data stored for tracking

---
## 📸 Screenshots

### 🎯 Interview Setup
![Brainstorm](./public/Screenshot%202026-04-19%20175245.png)

### 💬 Mock Interview
![Interview setup](./public/Screenshot%202026-04-19%20175310.png)

### 📊 Performance Report
![Roadmap](./public/Screenshot%202026-04-19%20175326.png)

### 📈 Dashboard
![Tracker](./public/Screenshot%202026-04-19%20175223.png)

## 🛣️ Development Roadmap

### Phase 1 (MVP)

* Mock Interview Engine
* Interview Tracker
* Performance Reports
* Reminder System

### Phase 2

* Brainstorm Board
* Roadmap Generator
* Dashboard
* Resource Hub

### Phase 3

* Voice interviews
* Resume analyzer
* Leaderboards
* Mobile app

---

## ⚠️ Risks

* API limits → fallback models
* Low adoption → college launch
* AI inaccuracies → prompt tuning

---

## 🧠 Vision

> Every student walks into an interview prepared — regardless of background.

---

## 👩‍💻 Built By

**Amna Sehgal**
BTech CSE (AI) — IGDTUW

---

## ⭐ Final Note

PrepOS is not just a project.

It is a **system designed to replace how students prepare for interviews.**
