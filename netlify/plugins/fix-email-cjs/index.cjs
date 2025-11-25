const fs = require("fs");
const path = require("path");

const emailsDir = path.join(process.cwd(), ".netlify/functions-internal/emails");
const jsPath = path.join(emailsDir, "index.js");
const cjsPath = path.join(emailsDir, "index.cjs");

module.exports = {
  onBuild() {
    if (!fs.existsSync(jsPath)) return;

    const jsContents = fs.readFileSync(jsPath, "utf8");
    const alreadyShimmed = jsContents.includes("import { handler, getEmailFromPath } from './index.cjs';");
    if (alreadyShimmed) return;

    fs.mkdirSync(emailsDir, { recursive: true });
    fs.renameSync(jsPath, cjsPath);

    const shim = [
      "// Shim to keep Netlify Emails function ESM-safe inside a type: module repo.",
      "import { handler, getEmailFromPath } from './index.cjs';",
      "export { handler, getEmailFromPath };",
    ].join("\n");

    fs.writeFileSync(jsPath, shim, "utf8");
    console.log("[fix-email-cjs] Converted Netlify Emails handler to .cjs with ESM shim.");
  },
};
