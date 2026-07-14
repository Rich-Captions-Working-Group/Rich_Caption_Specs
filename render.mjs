import specUp from 'spec-up';
import fs from 'fs';

// Workaround for a bug in spec-up where it expects a fonts directory 
// that is missing from the NPM package installation.
const fontsDir = './node_modules/spec-up/assets/compiled/fonts';
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

try {
  // nowatch: true builds the HTML once instead of starting a dev server
  await specUp({ nowatch: true });
  console.log("Spec rendered successfully to ./build");
} catch (error) {
  console.error("Error rendering spec:", error);
  process.exit(1);
}