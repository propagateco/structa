# TanStack AI - AI Clerk Orchestration

## Overview

TanStack AI provides a comprehensive framework for building agentic AI applications, with robust streaming and tool calling capabilities. It serves as the foundation for "The Clerk" - our contextual Q&A assistant.

## Core Concepts

- **Agent Loop**: Continuous autonomous execution of agent actions with LLM calls
- **Streaming**: Real-time streaming of LLM responses with chunk-based state management
- **Tool System**: Extensible tool registry with approval workflow
- **Parallel Execution**: Agent tools can run in parallel without blocking agent loop
- **Durable State**: Chat transcripts persist across page refreshes and reconnections
- **Tool Approval**: User confirms or rejects potentially destructive actions
- **Multi-Tab Safety**: Two agents running on same document don't interfere
- **Per-Session Workers**: Each session gets its own SharedWorker with isolated OCCT kernel

## Key Components

### 1. Agent Loop

The Agent Loop is the core execution engine:

- **Agent State**: Stores current LLM call, agent state, message history
- **Message Queue**: Queues user actions for sequential LLM processing
- **Run Coordinator**: Orchestrates when to call LLM and when to execute tools
- **Tool Manager**: Manages tool registration and execution

### 2. Streaming Infrastructure

- **Durable Stream Adapter**: Custom TanStack AI stream adapter
- **Chunk Management**: Efficiently merges LLM response chunks into messages
- **Message Assembly**: Combines deltas into complete assistant responses
- **State Synchronization**: Keeps UI state synchronized with streaming

### 3. Tool System

- **Tool Registry**: All available tools are registered with schemas
- **Execution Modes**: Server (direct LLM calls) vs Local (CAD operations in worker)
- **Approval Workflow**: Destructive tools require explicit user confirmation

### 4. Worker Architecture

- **Session-Based Workers**: Each chat session gets its own SharedWorker
- **Kernel Isolation**: OCCT kernels prevent interference between sessions
- **SharedWorker Bridge**: Coordinates communication across tabs

## Configuration

### Model Provider

- OpenAI (gpt-4o, gpt-4.1-mini) - Primary for fast responses
- Anthropic (claude-3.5-sonnet, claude-3-opus) - Alternative
- Google Gemini (gemini-pro, gemini-1.5-pro) - Fast, cost-effective

### Streaming

- Enabled: Chunk-based streaming for all LLM calls
- Message chunk size: ~100 tokens per chunk
- Stream resilience: Survives browser/worker closure

## Tool System

For tool categories and implementations, see [architecture/tool-system.md](tool-system.md).

## Data Flows

- User Action → Agent Loop → LLM Call → Assistant Response → Tool Execution → Result
- Server Tool Execution → Tool Result → Bridge → Result Streaming → Worker Execution → Tool Result
- Local Tool Execution → Yjs Document Update → Bridge → Result Streaming

