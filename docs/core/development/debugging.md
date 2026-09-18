# Debugging Guide

This document describes available logs and debugging resources.

## Contents

- [SST Logs Available to Agents](#sst-logs-available-to-agents)
- [Reading Logs](#reading-logs)
- [Important: SST Dev Server](#important-sst-dev-server)
- [Related Documentation](#related-documentation)

---

## SST Logs Available to Agents

| Log Type | Location | Can I Read? | Shows |
|-----------|-----------|--------------|-------|
| **Deployment logs** | `.sst/log/pulumi.log` | ✅ Yes | Resources created/updated, deployment errors, stack outputs, duration |
| **Orchestration logs** | `.sst/log/sst.log` | ✅ Yes | File watcher events, service starts, infrastructure changes |
| **Runtime logs (dev)** | Terminal only | ❌ No | Vite/TanStack Start logs, server-side `console.log()`, HMR events |

---

## Reading Logs

To check deployment logs:
```bash
cat .sst/log/pulumi.log | tail -50
```

To check SST orchestration logs:
```bash
cat .sst/log/sst.log | tail -100
```

---

## Important: SST Dev Server

- **Do NOT run** `npx sst dev` yourself – it will **always** be running when you work on this project
- The dev server logs (Vite, HMR, runtime console output) are **not captured** in log files
- For runtime debugging issues, ask the user to paste terminal output or set up log redirection

---

## Related Documentation

| Topic | Document |
|-------|----------|
| Testing (debugging tests) | [testing.md](./testing.md) |
| Deployment issues | [../workflow/deployment.md](../workflow/deployment.md) |
