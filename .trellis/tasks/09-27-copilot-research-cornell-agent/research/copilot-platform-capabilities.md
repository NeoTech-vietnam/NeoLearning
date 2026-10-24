# Research: Copilot research-agent platform choices

- **Query**: Implement a VS Code Copilot research and Cornell-note agent with skills, scripts, local RAG, Tree-sitter, and public MCP access.
- **Scope**: Mixed repository and external.
- **Date**: 2026-09-27

## Findings

### Repository conventions

- `.github/agents/*.agent.md` contains repository custom-agent profiles.
- `.github/skills/<skill>/SKILL.md` is the established Copilot skill layout; skills can include scripts and references.
- `.github/skills/generate-esp-idf-peripheral-notes/assets/cornell-note.md` supplies the short topic-neutral Cornell headings.
- Existing `.vscode/mcp.json` contains `mcp_boilerplate`; add any server without replacing it.
- `Examples` contains C/C++ source and is a submodule with a pre-existing dirty state. Do not index it by default or modify it.

### External references

- [Copilot custom agents configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration) documents `target: vscode`, tool allowlists, and MCP tool naming.
- [Copilot agent skills](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/add-skills) documents `.github/skills` and supporting scripts/resources.
- [MCP in VS Code](https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp-in-your-ide/extend-copilot-chat-with-mcp) documents repository `.vscode/mcp.json` and remote MCP/OAuth setup.
- [GitHub MCP in IDEs](https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp-in-your-ide/use-the-github-mcp-server) describes GitHub's official MCP integration.
- [GitHub MCP server configuration](https://github.com/github/github-mcp-server/blob/main/docs/server-configuration.md) describes read-only remote configuration and toolset selection.
- [STORM](https://github.com/stanford-oval/storm/blob/main/README.md) uses perspective-guided question asking and outline-first report generation.
- [GPT Researcher](https://github.com/assafelovic/gpt-researcher/blob/main/docs/docs/gpt-researcher/getting-started/introduction.md) decomposes research into queries, collects and summarizes sources, and aggregates a report.
- [PaperQA2](https://github.com/Future-House/paper-qa/blob/main/README.md) provides retrieval-augmented question answering over PDFs, text, office documents, and source code.
- [Python Tree-sitter bindings](https://github.com/tree-sitter/py-tree-sitter) use separate grammar packages and expose concrete syntax trees.

## Caveats

- The agent is scoped to VS Code; GitHub.com cloud-agent MCP/tool behavior is not part of v1.
- GitHub MCP authentication is performed by VS Code. Never save a token in `.vscode/mcp.json`.
- Tree-sitter can provide syntax boundaries, not semantic correctness; retain source paths and lines and verify extracted claims against source text.
- `pypdf` text extraction cannot recover scanned/image-only content; preserve those units as coverage gaps.

