# Install NeoWeb Markdown validation

## Goal

Install the reviewed standalone Markdown validator and trusted GitHub-hosted validation/dispatch workflow for NeoWeb publication.

## Requirements

- Check changed curated Markdown and internal links on GitHub-hosted runners.
- Run the reviewed validator from the PR base/default branch, never candidate executable code or configuration.
- Preserve existing style violations as a nonblocking baseline; fail introduced violations with file-and-line annotations.
- Dispatch only the protected NeoWeb main workflow after a valid dev push, using a separately configured narrow token.
- Never use the persistent self-hosted runner for untrusted pull requests.

## Acceptance Criteria

- [ ] The standalone validator can check immutable source commits without installing dependencies.
- [ ] Workflow actions are pinned to full SHAs and token permissions are minimal.
- [ ] Source docs remain unchanged; the install consists of the reviewed workflow and validator bundle.
- [ ] Missing deployment credentials produce actionable setup messages.

## Notes

- The user reviewed the complete NeoWeb plan, requested implementation, and explicitly approved this installation and Trellis task on 2026-09-05.
- This is a bounded installation task. Compiler source, tests, deployment design, and authoring guides live in NeoWeb.
