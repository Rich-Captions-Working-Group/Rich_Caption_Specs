import specUp from 'spec-up';

try {
  // nowatch: true builds the HTML once instead of starting a dev server
  await specUp({ nowatch: true });
  console.log("Spec rendered successfully to ./build");
} catch (error) {
  console.error("Error rendering spec:", error);
  process.exit(1);
}