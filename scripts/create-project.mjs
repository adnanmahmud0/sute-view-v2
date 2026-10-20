#!/usr/bin/env node

/**
 * Fullstack Turborepo Starter Kit - Interactive Project Generator
 * Clones template variants into fresh standalone projects with clean git history.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

const REPO_URL = "https://github.com/adnanmahmud0/fullstack-turborepo-starter-kit-v2.git";

const TEMPLATES = [
  {
    name: "All-in-One Fullstack Suite (Everything)",
    branch: "main",
    description:
      "Web (Next.js 16) + Admin (Next.js 16) + React Native (Expo) + Flutter + Express 5 API"
  },
  {
    name: "Expo Mobile + Admin Web + API (expo-web-api)",
    branch: "expo-web-api",
    description: "React Native (Expo) + Next.js 16 Super Admin (:3001) + Express 5 API (:5000)"
  },
  {
    name: "Flutter Mobile + Admin Web + API (flutter-web-api)",
    branch: "flutter-web-api",
    description: "Flutter 3.47+ Client + Next.js 16 Super Admin (:3001) + Express 5 API (:5000)"
  },
  {
    name: "Web + Admin Web + API (web-admin-api)",
    branch: "web-admin-api",
    description: "Next.js 16 Web (:3000) + Next.js 16 Super Admin (:3001) + Express 5 API (:5000)"
  },
  {
    name: "Web + Backend API Baseline (web-api)",
    branch: "web-api",
    description: "Next.js 16 Web (:3000) + Express 5 & Prisma API (:5000)"
  },
  {
    name: "Expo Mobile + Web + Admin + API (expo-web-admin-api)",
    branch: "expo-web-admin-api",
    description:
      "React Native (Expo) + Next.js 16 Web (:3000) + Admin (:3001) + Express 5 API (:5000)"
  },
  {
    name: "Flutter + Web + Admin + API (flutter-web-admin-api)",
    branch: "flutter-web-admin-api",
    description: "Flutter Client + Next.js 16 Web (:3000) + Admin (:3001) + Express 5 API (:5000)"
  }
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.clear?.();
  console.log(
    "\x1b[36m%s\x1b[0m",
    "╭─────────────────────────────────────────────────────────────╮"
  );
  console.log(
    "\x1b[36m%s\x1b[0m",
    "│       🚀 FULLSTACK TURBOREPO STARTER KIT GENERATOR          │"
  );
  console.log(
    "\x1b[36m%s\x1b[0m",
    "╰─────────────────────────────────────────────────────────────╯"
  );
  console.log();

  // 1. Parse arguments or prompt
  const args = process.argv.slice(2);
  let projectName = "";
  let branchArg = "";
  let remoteArg = "";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--branch" || args[i] === "-b") {
      branchArg = args[++i];
    } else if (args[i] === "--remote" || args[i] === "-r") {
      remoteArg = args[++i];
    } else if (!args[i].startsWith("-") && !projectName) {
      projectName = args[i];
    }
  }

  if (!projectName) {
    projectName = await ask("\x1b[1m\x1b[37m? Project directory name: \x1b[0m");
  }
  projectName = projectName.trim() || "my-fullstack-app";

  const targetPath = path.resolve(process.cwd(), projectName);
  if (fs.existsSync(targetPath)) {
    console.error(`\x1b[31mError: Directory '${projectName}' already exists.\x1b[0m`);
    rl.close();
    process.exit(1);
  }

  // 2. Select Template Variant
  let selectedTemplate = null;
  if (branchArg) {
    selectedTemplate = TEMPLATES.find((t) => t.branch === branchArg);
    if (!selectedTemplate) {
      console.warn(`\x1b[33mWarning: Unknown branch '${branchArg}'. Defaulting to main.\x1b[0m`);
      selectedTemplate = TEMPLATES[0];
    }
  } else {
    console.log("\n\x1b[1m\x1b[33mSelect a template variant:\x1b[0m");
    TEMPLATES.forEach((tpl, idx) => {
      console.log(`  \x1b[32m[${idx + 1}]\x1b[0m \x1b[1m${tpl.name}\x1b[0m`);
      console.log(`      \x1b[90m${tpl.description}\x1b[0m`);
    });

    const choice = await ask("\n\x1b[1m\x1b[37mChoose variant (1-7) [default: 1]: \x1b[0m");
    const selectedIndex = parseInt(choice.trim() || "1", 10) - 1;
    selectedTemplate = TEMPLATES[selectedIndex] || TEMPLATES[0];
  }

  console.log(`\n\x1b[35m⏳ Cloning '${selectedTemplate.branch}' into '${projectName}'...\x1b[0m`);

  try {
    execSync(
      `git clone --depth 1 --branch ${selectedTemplate.branch} ${REPO_URL} "${projectName}"`,
      { stdio: "inherit" }
    );

    // Remove origin .git history
    const gitDir = path.join(targetPath, ".git");
    if (fs.existsSync(gitDir)) {
      fs.rmSync(gitDir, { recursive: true, force: true });
    }

    // Auto-create .env from .env.example
    const envExamplePath = path.join(targetPath, ".env.example");
    const envPath = path.join(targetPath, ".env");
    if (fs.existsSync(envExamplePath) && !fs.existsSync(envPath)) {
      fs.copyFileSync(envExamplePath, envPath);
      console.log(`\x1b[32m✔ Initialized root .env from .env.example\x1b[0m`);
    }

    // Update package.json name if present
    const pkgPath = path.join(targetPath, "package.json");
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
        pkg.name = projectName;
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
        console.log(`\x1b[32m✔ Updated package.json name to '${projectName}'\x1b[0m`);
      } catch {
        // non-fatal
      }
    }

    // Git initialization
    let initGit = true;
    if (!args.includes("--no-git")) {
      const gitAns = await ask(
        `\n\x1b[1m\x1b[37m? Initialize a fresh Git repository on 'main'? (Y/n): \x1b[0m`
      );
      if (gitAns.trim().toLowerCase() === "n") {
        initGit = false;
      }
    } else {
      initGit = false;
    }

    let remoteUrl = remoteArg;
    if (initGit) {
      execSync(`git init -b main`, { cwd: targetPath, stdio: "ignore" });
      execSync(`git add .`, { cwd: targetPath, stdio: "ignore" });
      execSync(`git commit -m "feat: initial commit from ${selectedTemplate.branch} starter kit"`, {
        cwd: targetPath,
        stdio: "ignore"
      });
      console.log(
        `\x1b[32m✔ Initialized fresh git repository on 'main' with initial commit\x1b[0m`
      );

      if (!remoteUrl) {
        const ans = await ask(
          `\x1b[1m\x1b[37m? Connect to new GitHub remote URL? (leave blank to skip): \x1b[0m`
        );
        remoteUrl = ans.trim();
      }

      if (remoteUrl) {
        execSync(`git remote add origin ${remoteUrl}`, { cwd: targetPath, stdio: "inherit" });
        console.log(`\x1b[32m✔ Added remote origin: ${remoteUrl}\x1b[0m`);

        const pushAns = await ask(
          `\x1b[1m\x1b[37m? Push initial commit to origin main now? (y/N): \x1b[0m`
        );
        if (pushAns.trim().toLowerCase() === "y") {
          try {
            execSync(`git push -u origin main`, { cwd: targetPath, stdio: "inherit" });
            console.log(`\x1b[32m✔ Pushed main branch to ${remoteUrl}\x1b[0m`);
          } catch (pushErr) {
            console.warn(
              `\x1b[33mWarning: Failed to push to remote. Run 'git push -u origin main' manually.\x1b[0m`
            );
          }
        }
      }
    }

    console.log();
    console.log(
      "\x1b[32m%s\x1b[0m",
      "╭─────────────────────────────────────────────────────────────╮"
    );
    console.log(
      "\x1b[32m%s\x1b[0m",
      "│               🎉 PROJECT CREATED SUCCESSFULLY!              │"
    );
    console.log(
      "\x1b[32m%s\x1b[0m",
      "╰─────────────────────────────────────────────────────────────╯"
    );
    console.log();
    console.log("\x1b[1mNext steps:\x1b[0m");
    console.log(`  \x1b[36mcd ${projectName}\x1b[0m`);
    console.log(`  \x1b[36mnpm install\x1b[0m`);
    console.log(`  \x1b[36mnpm run dev\x1b[0m`);
    if (initGit && !remoteUrl) {
      console.log();
      console.log("\x1b[90mTo connect your new project to a GitHub repository:\x1b[0m");
      console.log(
        `  \x1b[36mgit remote add origin https://github.com/YOUR_USERNAME/${projectName}.git\x1b[0m`
      );
      console.log(`  \x1b[36mgit push -u origin main\x1b[0m`);
    }
    console.log();
    console.log("\x1b[90mHappy building with Fullstack Turborepo!\x1b[0m\n");
  } catch (error) {
    console.error(`\x1b[31mFailed to clone template: ${error.message}\x1b[0m`);
  } finally {
    rl.close();
  }
}

main();
