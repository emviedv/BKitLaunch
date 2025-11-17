import React from "react";

const scoreMetrics = [
  { label: "Accessibility", value: "8.9" },
  { label: "Usability", value: "8.3" },
  { label: "Visual", value: "9.0" },
] as const;

const quickWins = [
  "⚡ Increase button contrast for primary CTA",
  "⚡ Add alt text to hero image",
  "⚡ Reduce form fields on signup",
] as const;

export const SnapshotsSection: React.FC = () => (
  <section className="mb-12">
    <h2 className="mb-4 text-2xl font-semibold">Snapshots</h2>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div className="card">
        <h3 className="mb-3 font-medium">Snapshot — Score Card</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-base font-semibold">Overall UX Score</div>
            <div className="relative size-20">
              <svg className="absolute inset-0" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" className="fill-none stroke-muted" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  className="fill-none stroke-green-500"
                  strokeWidth="8"
                  strokeDasharray="282.743"
                  strokeDashoffset="80"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center leading-none">
                  <div className="text-xl font-bold">8.6</div>
                  <div className="text-xs text-muted-foreground">/ 10</div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            {scoreMetrics.map((metric) => (
              <div key={metric.label} className="flex items-center justify-between rounded-md border p-2">
                <span className="text-muted-foreground">{metric.label}</span>
                <span className="font-medium">{metric.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="mb-3 font-medium">Snapshot — Quick Wins</h3>
        <ul className="space-y-2">
          {quickWins.map((item) => (
            <li key={item} className="rounded-md border p-2">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h3 className="mb-3 font-medium">Snapshot — Accessibility</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Contrast</span>
            <span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700">AA</span>
          </div>
          <div className="text-sm">
            <div className="font-medium">Great contrast!</div>
            <div className="text-muted-foreground">
              Body text meets WCAG AA. Keep headings at 4.5:1 or higher.
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

