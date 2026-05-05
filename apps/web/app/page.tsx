const pillars = [
  {
    title: "Topic-first practice",
    copy: "Learners start with structured subject maps instead of random question banks.",
  },
  {
    title: "Feedback-rich sessions",
    copy: "Each question flow is meant to end with explanation, hinting, and clarity.",
  },
  {
    title: "Professional analytics",
    copy: "Progress will evolve into weak-area review, revision queues, and confidence signals.",
  },
];

const releaseSteps = [
  "Foundation and secure auth",
  "Subject and topic browse",
  "Playable quiz sessions",
  "Attempts, review, and analytics",
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Learner Web Platform</p>
          <h1>Exam prep for data science, AI, and CS with actual product discipline.</h1>
          <p className="hero-text">
            This web surface is being shaped as the premium learner companion to the mobile app:
            structured topics, guided practice, and eventually full revision intelligence.
          </p>

          <div className="hero-actions">
            <a className="primary-action" href="#roadmap">
              View build roadmap
            </a>
            <a className="secondary-action" href="#pillars">
              See product pillars
            </a>
          </div>
        </div>

        <div className="hero-panel">
          <div className="signal-card signal-card-primary">
            <span className="signal-label">Current build</span>
            <strong>Core learner foundation</strong>
            <p>Auth, catalog browse, and the first professional UI pass are in motion.</p>
          </div>

          <div className="signal-grid">
            <div className="signal-card">
              <span className="signal-label">Phase next</span>
              <strong>Quiz sessions</strong>
              <p>Question answering, correctness, and explanation-driven feedback loops.</p>
            </div>
            <div className="signal-card">
              <span className="signal-label">Longer term</span>
              <strong>Revision engine</strong>
              <p>Weak-area prioritization, spaced review, and exam-readiness tracking.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-band" aria-label="platform signals">
        <div>
          <span>Experience</span>
          <strong>Mobile + Web</strong>
        </div>
        <div>
          <span>Architecture</span>
          <strong>Expo, Next.js, FastAPI</strong>
        </div>
        <div>
          <span>Build strategy</span>
          <strong>Core-first, feature-by-feature</strong>
        </div>
      </section>

      <section className="section-block" id="pillars">
        <div className="section-heading">
          <p className="eyebrow">Why this app should feel premium</p>
          <h2>The product should teach clearly, guide efficiently, and look intentional.</h2>
        </div>

        <div className="pillar-grid">
          {pillars.map((pillar) => (
            <article className="pillar-card" key={pillar.title}>
              <h3>{pillar.title}</h3>
              <p>{pillar.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block section-block-accent" id="roadmap">
        <div className="section-heading">
          <p className="eyebrow">Execution path</p>
          <h2>We are building this the right way: first the core loop, then intelligence on top.</h2>
        </div>

        <ol className="roadmap-list">
          {releaseSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
    </main>
  );
}
