# Tech Villain 😈

**Tech Villain** is an AI-powered Debate Arena where you face off against a cynical, high-level tech persona (like a grumpy CTO). Test your logic, technical depth, and attitude in a turn-based debate. Can you win against the villain?

## 🚀 Key Features

- **AI Debate Arena:** Engage in intense technical debates with an AI that doesn't hold back.
- **Turn-Based System:** Strategic 10-turn limit with a surrender ("GG") option.
- **Evaluation System:** Get scored on **Logic**, **Depth**, and **Attitude**.
- **Persona Selection:** Choose your opponent (e.g., "The Cynical CTO", "The Over-Engineered Senior").
- **Tech Stack Profiling:** Debates are tailored to your specific technology stack.

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **State Management:** [Jotai](https://jotai.org/)
- **AI Integration:** Google Generative AI (Gemini)
- **Architecture:** [Feature-Sliced Design (FSD)](https://feature-sliced.design/)
- **Package Manager:** pnpm

## 📂 Architecture (FSD)

This project follows the **Feature-Sliced Design** methodology to ensure scalability and maintainability.

```
src/
├── app/                 # Entry points (Routing, Layouts, Providers)
├── widgets/             # Composition layer (Complex independent UI blocks)
├── features/            # User interactions (Debate logic, Selectors)
├── entities/            # Business domain (Data models, Types)
├── shared/              # Reusable infrastructure (API, UI Kit, Utils)
└── lib/                 # Global configuration & utilities
```

**Rule:** Dependencies flow strictly downwards: `app` -> `widgets` -> `features` -> `entities` -> `shared`.

## 🏁 Getting Started

### Prerequisites
- Node.js 20+
- pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/tech-villain.git
   cd tech-villain
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up Environment Variables:**
   Copy `.env.example` to `.env.local` and add your API keys.
   ```bash
   cp .env.example .env.local
   ```
   *Required variables:*
   - `GEMINI_API_KEY`: Google Generative AI API Key

4. **Run the development server:**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🧪 Quality Control

We use strict linting and formatting rules.

- **Lint:** `pnpm lint` (ESLint 9)
- **Format:** Prettier is configured to run on commit via Husky & Lint-staged.

## 🗺️ Roadmap

- [x] Phase 1: Infrastructure & Scaffolding
- [ ] Phase 2: Core AI Logic Integration
- [ ] Phase 3: Onboarding Flow (Stack/Persona selection)
- [ ] Phase 4: Debate Arena Implementation
- [ ] Phase 5: Evaluation & Scoring System
- [ ] Phase 6: Polish & Deployment

## 📄 License

This project is licensed under the MIT License.