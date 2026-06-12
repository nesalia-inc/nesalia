#!/usr/bin/env node

import { Command } from "commander";
import { login, status, logout } from "./commands/index.js";

const program = new Command();

program
  .name("nesalia")
  .version("1.0.0")
  .description("@nesalia/cli — Manage your account authentication");

program
  .command("auth", { isDefault: false })
  .description("Authentication commands")
  .addCommand(
    new Command("login")
      .description("Login via device authorization")
      .action(login),
  )
  .addCommand(
    new Command("status")
      .description("Check authentication status")
      .action(status),
  )
  .addCommand(
    new Command("logout")
      .description("Logout and clear credentials")
      .action(logout),
  );

program.parse(process.argv);