import React, { type ReactNode } from "react";

import { Button } from "@/components/ui/button";

export type ModalShowcase = {
  id: string;
  group: string;
  title: string;
  path: string;
  description?: string;
  render: () => ReactNode;
};

export const modalShowcases: ModalShowcase[] = [
  {
    id: "billing-modal",
    group: "Account & Billing",
    title: "Billing Modal",
    path: "src/components/modals/billing-modal.tsx",
    description: "Plan snapshot with trial controls and Stripe links.",
    render: () => (
      <>
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <div className="text-sm font-semibold">Account</div>
            <div className="text-xs text-muted-foreground">Manage your plan and trial status.</div>
          </div>
          <button className="text-lg text-muted-foreground" aria-label="Close">
            &times;
          </button>
        </div>
        <div className="space-y-3 p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Current plan</span>
            <span className="font-medium capitalize">free</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Effective plan</span>
            <span className="font-medium capitalize">trial</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Subscription</span>
            <span className="font-medium">Trial</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Trial days remaining</span>
            <span className="font-medium">9 days</span>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t bg-muted/40 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <Button variant="ghost" className="sm:w-auto">
            Cancel
          </Button>
          <div className="flex flex-1 flex-col gap-2 sm:flex-none sm:flex-row sm:items-center sm:justify-end">
            <Button className="bg-[#6580E1] hover:bg-[#546bd1]">Start 14-day trial</Button>
            <Button variant="outline">Upgrade to Pro</Button>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "upgrade-to-pro-modal",
    group: "Account & Billing",
    title: "Upgrade to Pro Modal",
    path: "src/components/modals/upgrade-to-pro-modal.tsx",
    description: "Feature comparison with upgrade CTA.",
    render: () => (
      <>
        <div className="border-b px-4 py-3">
          <div className="font-semibold">BiblioKit Pro</div>
          <div className="text-sm text-muted-foreground">
            Unlock AI snapshots and advanced exports.
          </div>
        </div>
        <div className="space-y-3 p-4 text-sm">
          <div className="grid gap-2">
            <div className="flex items-start gap-3 rounded-md border border-[#6580E1]/40 bg-[#6580E1]/10 p-3">
              <span className="text-lg">✨</span>
              <div>
                <div className="font-medium">Unlimited analyses</div>
                <div className="text-muted-foreground">
                  Upload bigger studies and get faster reports.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-md border bg-muted/40 p-3">
              <span className="text-lg">🤝</span>
              <div>
                <div className="font-medium">Team collaboration</div>
                <div className="text-muted-foreground">
                  Invite peers and share insights securely.
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-md border border-dashed bg-background/60 p-3 text-center text-xs text-muted-foreground">
            $29/month • Cancel anytime • Stripe powered checkout
          </div>
        </div>
        <div className="flex flex-col gap-2 border-t bg-muted/40 px-4 py-3 sm:flex-row sm:justify-end">
          <Button variant="outline" className="sm:w-auto">
            Not now
          </Button>
          <Button className="bg-[#6580E1] hover:bg-[#546bd1]">Upgrade</Button>
        </div>
      </>
    ),
  },
  {
    id: "trial-welcome-modal",
    group: "Account & Billing",
    title: "Trial Welcome Modal",
    path: "src/components/modals/trial-welcome-modal.tsx",
    description: "First-run checklist for new trial users.",
    render: () => (
      <>
        <div className="border-b px-4 py-3">
          <div className="text-sm font-semibold">Welcome to your BiblioKit trial</div>
          <div className="text-xs text-muted-foreground">Here’s how to get the most out of 14 days.</div>
        </div>
        <div className="space-y-4 p-4 text-sm">
          <div className="flex items-start gap-3">
            <span className="mt-1 text-lg">🗂️</span>
            <div>
              <div className="font-medium">Create a collection</div>
              <div className="text-muted-foreground">Organize analyses for your stakeholders.</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="mt-1 text-lg">🤖</span>
            <div>
              <div className="font-medium">Run an AI snapshot</div>
              <div className="text-muted-foreground">
                Drop a URL or PDF to see narrative reporting.
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="mt-1 text-lg">📤</span>
            <div>
              <div className="font-medium">Share findings</div>
              <div className="text-muted-foreground">Invite teammates or export a polished deck.</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 border-t bg-muted/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="ghost" className="sm:w-auto">
            Remind me later
          </Button>
          <Button className="sm:w-auto">Let’s go</Button>
        </div>
      </>
    ),
  },
  {
    id: "extension-sign-in-modal",
    group: "Account & Billing",
    title: "Extension Sign-In Modal",
    path: "src/components/modals/extension-sign-in-modal.tsx",
    description: "Guides users to connect the Chrome extension.",
    render: () => (
      <>
        <div className="border-b px-4 py-3">
          <div className="text-sm font-semibold">Pair the Chrome extension</div>
          <div className="text-xs text-muted-foreground">
            Authenticate once to send captures straight to BiblioKit.
          </div>
        </div>
        <div className="space-y-3 p-4 text-sm">
          <ol className="list-decimal space-y-2 pl-5">
            <li>Open the BiblioKit extension from your browser toolbar.</li>
            <li>Enter the device code shown below to link your account.</li>
          </ol>
          <div className="rounded-md border bg-muted/40 p-3 text-center font-mono text-lg">AX9Q-4B1M</div>
          <div className="rounded-md border border-dashed bg-background/60 p-3 text-xs text-muted-foreground">
            Device codes expire in 5 minutes. Generate a new one if you need more time.
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t bg-muted/40 px-4 py-3">
          <Button variant="outline">Done</Button>
          <Button>Generate new code</Button>
        </div>
      </>
    ),
  },
  {
    id: "collection-form-modal",
    group: "Collections & Settings",
    title: "Collection Form Modal",
    path: "src/components/modals/collection-form-modal.tsx",
    description: "Create or edit a content collection with token-aware fields.",
    render: () => (
      <>
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="text-sm font-semibold">Create collection</div>
          <Button variant="ghost" size="sm">
            Preview
          </Button>
        </div>
        <div className="space-y-4 p-4 text-sm">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Name</span>
            <input className="h-9 rounded-md border bg-background px-3" placeholder="Research Ops" readOnly />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Description</span>
            <textarea
              className="h-20 rounded-md border bg-background px-3 py-2"
              placeholder="Internal playbooks and templates"
              readOnly
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Color</span>
              <input className="h-9 rounded-md border bg-background px-3" value="#6366F1" readOnly />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Icon</span>
              <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2">
                <span className="text-lg">🗂️</span>
                <span className="text-xs text-muted-foreground">ri-folder-line</span>
              </div>
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t bg-muted/40 px-4 py-3">
          <Button variant="ghost">Cancel</Button>
          <Button>Save collection</Button>
        </div>
      </>
    ),
  },
  {
    id: "tag-management-modal",
    group: "Collections & Settings",
    title: "Tag Management Modal",
    path: "src/components/modals/tag-management-modal.tsx",
    description: "Rename, merge, and archive tags from one place.",
    render: () => (
      <>
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="text-sm font-semibold">Manage tags</div>
          <span className="text-xs text-muted-foreground">12 active</span>
        </div>
        <div className="space-y-3 p-4 text-sm">
          <input className="h-9 w-full rounded-md border bg-background px-3" placeholder="Search or create a tag" readOnly />
          <div className="space-y-2">
            {["Heuristic audit", "UX debt", "Key flow", "Accessibility"].map((tag) => (
              <div key={tag} className="flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2">
                <span>{tag}</span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <button className="rounded border px-2 py-1">Rename</button>
                  <button className="rounded border px-2 py-1">Archive</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t bg-muted/40 px-4 py-3">
          <Button variant="outline">Close</Button>
          <Button>Save changes</Button>
        </div>
      </>
    ),
  },
  {
    id: "settings-modal",
    group: "Collections & Settings",
    title: "Settings Modal",
    path: "src/components/modals/settings-modal.tsx",
    description: "Profile preferences with feature toggles.",
    render: () => (
      <>
        <div className="border-b px-4 py-3">
          <div className="text-sm font-semibold">Workspace settings</div>
          <div className="text-xs text-muted-foreground">Feature flags and data retention.</div>
        </div>
        <div className="space-y-4 p-4 text-sm">
          <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2">
            <div>
              <div className="font-medium">Dark mode</div>
              <div className="text-xs text-muted-foreground">Match browser preference.</div>
            </div>
            <button className="rounded-full border bg-background px-3 py-1 text-xs">Auto</button>
          </div>
          <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2">
            <div>
              <div className="font-medium">Include beta features</div>
              <div className="text-xs text-muted-foreground">Great for power users and QA teams.</div>
            </div>
            <button className="rounded-full border bg-background px-3 py-1 text-xs">Enabled</button>
          </div>
          <div className="rounded-md border border-dashed bg-background/50 p-3 text-xs text-muted-foreground">
            Need to export your data? Email compliance@bibliokit.test for a GDPR bundle.
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t bg-muted/40 px-4 py-3">
          <Button variant="ghost">Cancel</Button>
          <Button>Save preferences</Button>
        </div>
      </>
    ),
  },
  {
    id: "reminder-dialog",
    group: "Reminders",
    title: "Reminder Dialog",
    path: "src/components/modals/reminder-dialog.tsx",
    description: "Lightweight date picker for follow-ups.",
    render: () => (
      <>
        <div className="border-b px-4 py-3">
          <div className="text-sm font-semibold">Set a reminder</div>
          <div className="text-xs text-muted-foreground">
            Ping yourself when the analysis needs another look.
          </div>
        </div>
        <div className="space-y-3 p-4 text-sm">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Date</span>
            <input className="h-9 rounded-md border bg-background px-3" value="2025-05-01" readOnly />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Notes</span>
            <textarea
              className="h-20 rounded-md border bg-background px-3 py-2"
              placeholder="Follow up with design review."
              readOnly
            />
          </label>
        </div>
        <div className="flex justify-end gap-2 border-t bg-muted/40 px-4 py-3">
          <Button variant="ghost">Cancel</Button>
          <Button>Save reminder</Button>
        </div>
      </>
    ),
  },
  {
    id: "reminder-edit-dialog",
    group: "Reminders",
    title: "Reminder Edit Dialog",
    path: "src/components/modals/reminder-edit-dialog.tsx",
    description: "Update cadence and status from the same sheet.",
    render: () => (
      <>
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="text-sm font-semibold">Update reminder</div>
          <span className="text-xs text-muted-foreground">Weekly cadence</span>
        </div>
        <div className="space-y-3 p-4 text-sm">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Next ping</span>
            <input className="h-9 rounded-md border bg-background px-3" value="May 8" readOnly />
          </label>
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Deliver via</div>
            <div className="flex items-center gap-2">
              <button className="rounded-md border bg-background px-3 py-2 text-sm">Email</button>
              <button className="rounded-md border bg-muted/50 px-3 py-2 text-sm">Slack</button>
            </div>
          </div>
        </div>
        <div className="flex justify-between gap-2 border-t bg-muted/40 px-4 py-3">
          <Button variant="outline">Mark complete</Button>
          <div className="flex gap-2">
            <Button variant="ghost">Cancel</Button>
            <Button>Save</Button>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "reminder-completion-dialog",
    group: "Reminders",
    title: "Reminder Completion Dialog",
    path: "src/components/modals/reminder-completion-dialog.tsx",
    description: "Celebrate done work and capture quick notes.",
    render: () => (
      <>
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="text-sm font-semibold">Check in complete?</div>
          <span className="text-lg">🎉</span>
        </div>
        <div className="space-y-3 p-4 text-sm">
          <p className="text-muted-foreground">
            Add a quick note before we close out the reminder thread.
          </p>
          <textarea
            className="h-20 rounded-md border bg-background px-3 py-2"
            placeholder="Outcome, decisions, next steps…"
            readOnly
          />
        </div>
        <div className="flex justify-between gap-2 border-t bg-muted/40 px-4 py-3">
          <Button variant="ghost">Keep open</Button>
          <Button>Complete reminder</Button>
        </div>
      </>
    ),
  },
  {
    id: "portal-reminder-dialog",
    group: "Reminders",
    title: "Portal Reminder Dialog",
    path: "src/components/modals/portal-reminder-dialog.tsx",
    description: "Slack-style reminder for external collaborators.",
    render: () => (
      <>
        <div className="border-b px-4 py-3">
          <div className="text-sm font-semibold">Send a portal reminder</div>
          <div className="text-xs text-muted-foreground">We’ll notify reviewers that insights are ready.</div>
        </div>
        <div className="space-y-3 p-4 text-sm">
          <div className="rounded-md border bg-muted/30 px-3 py-2">
            <div className="text-xs text-muted-foreground">Recipients</div>
            <div className="mt-1 flex flex-wrap gap-2">
              {["sarah@acme.co", "dave@acme.co"].map((email) => (
                <span key={email} className="rounded-full bg-background px-2 py-1 text-xs">
                  {email}
                </span>
              ))}
            </div>
          </div>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Message</span>
            <textarea
              className="h-20 rounded-md border bg-background px-3 py-2"
              defaultValue="Hey team — new findings are ready for review. Add comments before Thursday."
              readOnly
            />
          </label>
        </div>
        <div className="flex justify-end gap-2 border-t bg-muted/40 px-4 py-3">
          <Button variant="ghost">Cancel</Button>
          <Button>Send reminder</Button>
        </div>
      </>
    ),
  },
  {
    id: "feedback-modal",
    group: "Feedback & Safety",
    title: "Feedback Modal",
    path: "src/components/modals/feedback-modal.tsx",
    description: "Capture quick sentiment and qualitative notes.",
    render: () => (
      <>
        <div className="border-b px-4 py-3">
          <div className="text-sm font-semibold">Leave feedback</div>
          <div className="text-xs text-muted-foreground">Help us improve BiblioKit.</div>
        </div>
        <div className="space-y-3 p-4 text-sm">
          <div className="flex gap-2">
            <button className="rounded-md border bg-background px-3 py-2 text-lg">👍</button>
            <button className="rounded-md border bg-background px-3 py-2 text-lg">👎</button>
          </div>
          <textarea
            className="h-20 rounded-md border bg-background px-3 py-2"
            placeholder="This stopped working or I want this feature..."
            readOnly
          />
        </div>
        <div className="flex justify-end gap-2 border-t bg-muted/40 px-4 py-3">
          <Button variant="ghost">Close</Button>
          <Button>Submit</Button>
        </div>
      </>
    ),
  },
  {
    id: "unsaved-changes-modal",
    group: "Feedback & Safety",
    title: "Unsaved Changes Modal",
    path: "src/components/modals/unsaved-changes-modal.tsx",
    description: "Warns about drafts before navigating away.",
    render: () => (
      <>
        <div className="flex items-center gap-3 border-b bg-amber-50 px-4 py-3">
          <span className="text-lg">⚠️</span>
          <div>
            <div className="text-sm font-semibold">Unsaved changes</div>
            <div className="text-xs text-muted-foreground">
              You have edits that will be lost if you continue.
            </div>
          </div>
        </div>
        <div className="space-y-2 p-4 text-sm">
          <div className="rounded-md border border-amber-200 bg-amber-50/80 p-3 text-xs text-amber-900">
            Snapshot draft “Checkout audit” has pending notes and annotations.
          </div>
        </div>
        <div className="flex justify-between gap-2 border-t bg-muted/40 px-4 py-3">
          <Button variant="outline">Discard changes</Button>
          <div className="flex gap-2">
            <Button variant="ghost">Cancel</Button>
            <Button>Save and exit</Button>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "delete-confirmation-dialog",
    group: "Feedback & Safety",
    title: "Delete Confirmation Dialog",
    path: "src/components/modals/delete-confirmation-dialog.tsx",
    description: "Destructive confirmation with contextual copy.",
    render: () => (
      <>
        <div className="border-b px-4 py-3">
          <div className="text-sm font-semibold text-rose-600">Delete analysis?</div>
        </div>
        <div className="space-y-3 p-4 text-sm">
          <p className="text-muted-foreground">
            This operation removes the analysis and attachments from your workspace. We keep backups
            for 7 days in case of mistakes.
          </p>
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input type="checkbox" defaultChecked readOnly /> Permanently remove from shared portal
          </label>
        </div>
        <div className="flex justify-end gap-2 border-t bg-muted/40 px-4 py-3">
          <Button variant="ghost">Cancel</Button>
          <Button variant="destructive">Delete</Button>
        </div>
      </>
    ),
  },
  {
    id: "confirmation-modal",
    group: "Feedback & Safety",
    title: "Confirmation Modal",
    path: "src/components/modals/confirmation-modal.tsx",
    description: "Reusable yes/no dialog with optional helper text.",
    render: () => (
      <>
        <div className="border-b px-4 py-3">
          <div className="text-sm font-semibold">Publish snapshot?</div>
          <div className="text-xs text-muted-foreground">
            Teammates will receive a notification with the summary.
          </div>
        </div>
        <div className="space-y-2 p-4 text-sm">
          <div className="rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground">
            Ensure private comments are resolved before publishing to everyone.
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t bg-muted/40 px-4 py-3">
          <Button variant="outline">Review first</Button>
          <Button>Publish</Button>
        </div>
      </>
    ),
  },
  {
    id: "command-search-dialog",
    group: "Power Tools & Uploads",
    title: "Command Search Dialog",
    path: "src/components/modals/command-search-dialog.tsx",
    description: "Command palette with quick keyboard hints.",
    render: () => (
      <>
        <div className="border-b px-4 py-3">
          <div className="text-sm font-semibold">Command palette</div>
          <div className="text-xs text-muted-foreground">Type to jump anywhere.</div>
        </div>
        <div className="space-y-3 p-4 text-sm">
          <input
            className="h-10 w-full rounded-md border bg-background px-3 font-mono text-sm"
            placeholder="Search collections, commands, people…"
            readOnly
          />
          <div className="rounded-md border bg-muted/40">
            {[
              { label: "Create collection", shortcut: "C" },
              { label: "Upload artifact", shortcut: "U" },
              { label: "Open billing", shortcut: "B" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between border-b px-3 py-2 last:border-b-0"
              >
                <span>{item.label}</span>
                <span className="rounded bg-background px-2 py-1 text-xs text-muted-foreground">
                  ⌘{item.shortcut}
                </span>
              </div>
            ))}
          </div>
        </div>
      </>
    ),
  },
  {
    id: "duplicate-files-alert-dialog",
    group: "Power Tools & Uploads",
    title: "Duplicate Files Alert Dialog",
    path: "src/components/modals/duplicate-files-alert-dialog.tsx",
    description: "Surface conflicting uploads before they land in storage.",
    render: () => (
      <>
        <div className="border-b px-4 py-3">
          <div className="text-sm font-semibold">Duplicates detected</div>
        </div>
        <div className="space-y-3 p-4 text-sm">
          <p className="text-muted-foreground">
            The following files already exist in your workspace. Choose what to do with each one.
          </p>
          <div className="space-y-2 rounded-md border bg-muted/30 p-3">
            {["checkout-flow.mp4", "dashboard-copy.md"].map((file) => (
              <div key={file} className="flex items-center justify-between text-sm">
                <span>{file}</span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <button className="rounded border px-2 py-1">Keep both</button>
                  <button className="rounded border px-2 py-1">Skip</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t bg-muted/40 px-4 py-3">
          <Button variant="ghost">Cancel upload</Button>
          <Button>Continue</Button>
        </div>
      </>
    ),
  },
  {
    id: "enhanced-duplicate-files-dialog",
    group: "Power Tools & Uploads",
    title: "Enhanced Duplicate Files Dialog",
    path: "src/components/modals/enhanced-duplicate-files-dialog.tsx",
    description: "Side-by-side metadata for smarter conflict resolution.",
    render: () => (
      <>
        <div className="border-b px-4 py-3">
          <div className="text-sm font-semibold">Resolve duplicates</div>
          <div className="text-xs text-muted-foreground">
            Compare timestamps to decide which upload to keep.
          </div>
        </div>
        <div className="space-y-3 p-4 text-sm">
          <div className="grid gap-3 rounded-md border bg-muted/30 p-3">
            <div className="text-xs text-muted-foreground">checkout-flow.mp4</div>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>
                <div className="font-medium text-foreground">Existing</div>
                <div>Uploaded Feb 12 • 45 MB</div>
              </div>
              <div>
                <div className="font-medium text-foreground">New</div>
                <div>Uploaded Apr 03 • 47 MB</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded border px-2 py-1 text-xs">Replace existing</button>
              <button className="rounded border px-2 py-1 text-xs">Keep both</button>
            </div>
          </div>
        </div>
        <div className="flex justify-between gap-2 border-t bg-muted/40 px-4 py-3">
          <Button variant="ghost">Close</Button>
          <Button>Apply decisions</Button>
        </div>
      </>
    ),
  },
  {
    id: "upload-progress-centered-modal",
    group: "Power Tools & Uploads",
    title: "Upload Progress Modal",
    path: "src/components/modals/upload-progress-centered-modal.tsx",
    description: "Centered status view for batch uploads.",
    render: () => (
      <>
        <div className="border-b px-4 py-3">
          <div className="text-sm font-semibold">Uploading 3 files</div>
          <div className="text-xs text-muted-foreground">Stay on the page — we’ll be quick.</div>
        </div>
        <div className="space-y-3 p-4 text-sm">
          <div className="space-y-2">
            {[
              { name: "flow-recording.mov", progress: 72 },
              { name: "heuristic-audit.pdf", progress: 41 },
              { name: "checkout-notes.txt", progress: 18 },
            ].map((file) => (
              <div key={file.name}>
                <div className="flex items-center justify-between text-xs">
                  <span className="truncate font-medium text-foreground">{file.name}</span>
                  <span className="text-muted-foreground">{file.progress}%</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-muted">
                  <div className="h-full rounded-full bg-[#6580E1]" style={{ width: `${file.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 border-t bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
          <div>Uploads run in the background. Safe to navigate away.</div>
          <Button size="sm" variant="outline">
            Hide
          </Button>
        </div>
      </>
    ),
  },
];

export const modalGroups = [
  "Account & Billing",
  "Collections & Settings",
  "Reminders",
  "Feedback & Safety",
  "Power Tools & Uploads",
] as const;
