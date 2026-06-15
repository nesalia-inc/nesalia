#!/usr/bin/env node

import { Command } from "commander";
import { login, status, logout, list, get, create, setActive, deleteAction, listMembers, remote, docsList, docsGet, docsCreate, docsUpdate, deleteDoc, archive, restore, docsSearch } from "./commands/index.js";

// Commander v13 uses -V for --version; intercept -v before parse
const args = process.argv.includes("-v")
  ? process.argv.map((a) => (a === "-v" ? "-V" : a))
  : process.argv;

const program = new Command();

program
  .name("nesalia")
  .version("1.0.5")
  .description("@nesalia/cli — Manage your account and organizations");

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

program
  .command("config", { isDefault: false })
  .description("Configuration commands")
  .addCommand(
    new Command("remote")
      .description("Show the auth server URL")
      .action(remote),
  );

program
  .command("orgs", { isDefault: false })
  .description("Organization management commands")
  .addCommand(
    new Command("list")
      .description("List your organizations")
      .action(list),
  )
  .addCommand(
    new Command("get")
      .argument("<slug>", "Organization slug")
      .description("Get organization details")
      .action(get),
  )
  .addCommand(
    new Command("create")
      .argument("<name>", "Organization name")
      .description("Create a new organization")
      .action(create),
  )
  .addCommand(
    new Command("set-active")
      .argument("<slug>", "Organization slug")
      .description("Set the active organization")
      .action(setActive),
  )
  .addCommand(
    new Command("delete")
      .argument("<slug>", "Organization slug")
      .option("-y, --yes", "Skip confirmation")
      .description("Delete an organization")
      .action(deleteAction),
  )
  .addCommand(
    new Command("members")
      .description("Member management commands")
      .addCommand(
        new Command("list")
          .argument("[slug]", "Organization slug (defaults to active org)")
          .description("List organization members")
          .action(listMembers),
      ),
  )
  .addCommand(
    new Command("docs")
      .description("Document management commands")
      .addCommand(
        new Command("list")
          .argument("<orgSlug>", "Organization slug")
          .option("--type <type>", "Filter by type (handbook, policy, template, note, knowledge)")
          .option("--archived", "Include archived documents")
          .description("List documents in an organization")
          .action(docsList),
      )
      .addCommand(
        new Command("get")
          .argument("<id>", "Document ID")
          .description("Get document details and content")
          .action(docsGet),
      )
      .addCommand(
        new Command("create")
          .argument("<orgSlug>", "Organization slug")
          .argument("<name>", "Document name")
          .option("--type <type>", "Document type (handbook, policy, template, note, knowledge)", "note")
          .option("--content <content>", "Document content (markdown)")
          .option("--tags <tags>", "Comma-separated tags")
          .option("--visibility <visibility>", "Visibility (all, admins_only)", "all")
          .description("Create a new document")
          .action(docsCreate),
      )
      .addCommand(
        new Command("update")
          .argument("<id>", "Document ID")
          .option("--name <name>", "Document name")
          .option("--content <content>", "Document content (markdown)")
          .option("--tags <tags>", "Comma-separated tags")
          .description("Update a document")
          .action(docsUpdate),
      )
      .addCommand(
        new Command("delete")
          .argument("<id>", "Document ID")
          .description("Delete a document (soft delete)")
          .action(deleteDoc),
      )
      .addCommand(
        new Command("archive")
          .argument("<id>", "Document ID")
          .description("Archive a document")
          .action(archive),
      )
      .addCommand(
        new Command("restore")
          .argument("<id>", "Document ID")
          .description("Restore an archived document")
          .action(restore),
      )
      .addCommand(
        new Command("search")
          .argument("<orgSlug>", "Organization slug")
          .argument("<query>", "Search query")
          .option("--type <type>", "Filter by type")
          .option("--tags <tags>", "Comma-separated tags")
          .description("Search documents by name or content")
          .action(docsSearch),
      ),
  );

program.parse(args);