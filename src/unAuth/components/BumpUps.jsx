import "./BumpUps.css";

const features = [
  {
    label: "Local Videos",
    href: "https://bumpups.com",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
  },
  {
    label: "Video Chat",
    href: "https://bumpups.com",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    label: "AI YouTube",
    href: "https://bumpups.com/youtube-feature",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 3l-4 4-4-4" />
        <polygon points="10,11 16,14 10,17" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "API",
    href: "https://docs.bumpups.com",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
];

const ArrowIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4e8fff" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8l4 4-4 4" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const BumpUps = () => {
  return (
    <section className="domore">
      <div className="domore__top">
        <h2>
          Do more with <span className="domore__brand">bumpups</span>.com
        </h2>
        <p>
          Process your videos to deliver insights across all industries. Ask questions,
          request summaries, analyses, and more with Bump-1.0.
        </p>
      </div>

      <div className="domore__grid">
        {features.map((f) => (
          <div className="domore__card" key={f.label}>
            <div className="domore__card-left">
              <span className="domore__badge">{f.label}</span>
              <a className="domore__learn" href={f.href} target="_blank" rel="noreferrer">
                <ArrowIcon />
                Learn more
              </a>
            </div>
            <div className="domore__icon">{f.icon}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BumpUps;