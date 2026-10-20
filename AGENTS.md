# AGENTS.md

## Overview

This repository contains a collection of standalone, single-page static HTML tools (under `tools/`) and associated documentation (under `docs/`). These tools are mainly front-end applications built with HTML, CSS, and vanilla JavaScript.

## Architecture & File Structure

The project is structured around distinct directories for each tool:

- `tools/`: The root directory for all the tools.
  - Each subfolder inside `tools/` (e.g., `MG-30/`, `ACEStudio/`, `ChainBuilder/`, `shadow/`, `song-lens/`, etc.) represents a standalone tool.
  - **Standalone nature:** Most tools are self-contained within an `index.html` file that includes inline or linked CSS and JavaScript.
  - Some tools (like `shadow` and `song-lens`) have separated `app.js` and `styles.css` files, but they are still purely client-side static files.
- `docs/`: Contains documentation and notes, such as `mg30-tone-planner-user-test.md`.

Since there is no complex build system, bundler, or back-end framework, the architecture is simply a collection of static assets served to a web browser.

## Commands for Running and Testing

Because the project consists of static files, you only need a basic local web server to run and test it.

### Setup Environment

Run the setup script to verify your environment has the necessary tools to run a local server:

```bash
./setup-env.sh
```

### Running the Project

You can start a local development server from the root of the repository to serve all tools.

**Using Python 3:**
```bash
python3 -m http.server 8000
```
Then navigate to `http://localhost:8000/tools/` in your browser.

**Using Node.js (via npx):**
```bash
npx serve
```
This will start a server and typically output the URL (e.g., `http://localhost:3000`) where you can access the files.

### Testing

Testing is primarily done manually by opening the specific tool's `index.html` file in a browser (served via the local server) and verifying the functionality and UI.

Since these are UI-focused static HTML files, there is no automated test suite (like Jest or Mocha) currently set up. To test a specific tool, simply navigate to its directory via the local server. For example: `http://localhost:8000/tools/MG-30/index.html`.
