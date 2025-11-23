import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const waitlistPath = path.resolve(__dirname, "../../components/Waitlist.tsx");

const waitlistSource = fs.readFileSync(waitlistPath, "utf8");

const expectScopedAlertClass = (matchLabel, regex) => {
  assert.match(
    waitlistSource,
    regex,
    `waitlist ${matchLabel} should keep the scoped alert class for feedback surfaces`,
  );
};

test("waitlist feedback surfaces use scoped alert styling instead of the generic card chrome", () => {
  expectScopedAlertClass(
    "success block",
    /landing-waitlist-success[^\\n]*landing-waitlist-feedback/,
  );
  expectScopedAlertClass(
    "error block",
    /landing-waitlist-error[^\\n]*landing-waitlist-feedback/,
  );

  assert.doesNotMatch(
    waitlistSource,
    /landing-waitlist-success[^\\n]*\\bcard\\b/,
    "success state should not inherit the marketing card layout",
  );
  assert.doesNotMatch(
    waitlistSource,
    /landing-waitlist-error[^\\n]*\\bcard\\b/,
    "error state should not inherit the marketing card layout",
  );
});
