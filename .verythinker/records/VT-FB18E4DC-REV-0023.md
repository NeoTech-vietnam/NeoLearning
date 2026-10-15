---
schema_version: 1
id: VT-FB18E4DC-REV-0023
type: review
title: "Review: DSP bootstrap: exact Python imports, immutable PDF
  identities/counts and full PDF skill read"
owner: reviewer
status: reviewed
revision: 1
created_at: 2026-10-12T15:56:45.835Z
updated_at: 2026-10-12T15:56:45.835Z
links:
  - type: reviews
    target: VT-FB18E4DC-CHK-0012
data:
  decision: fail
  findings:
    - "[severity=high; location=data.source_baseline.VT-FB18E4DC-REQ-0010;
      affected=BOOT-01..BOOT-07; owner=verifier; disposition=open] CHK-0012
      freezes REQ-0010 revision 1 fingerprint
      055dc37dcf186a01793591294de58b7b8be33bf33037f422c259bb60d1caab7c, while
      current REQ-0010 is revision 2 fingerprint
      89a0bdc57a1165e60aeb24500c39084b7ee945dadc446d6f575bf7fb68506d5f. Refresh
      the source baseline against the current requirement, then obtain a new
      independent review."
    - "[severity=high; location=CHK-0012 command[3], source hash after-read
      block; affected=BOOT-06; owner=verifier; disposition=open] The procedure
      records after_sha256 but does not calculate or emit an after-read byte
      count or compare it with the before-read size. BOOT-06 requires both PDF
      sizes and hashes to be unchanged. Add after_bytes and compare it to the
      observed before size and expected size."
    - "[severity=medium; location=CHK-0012 result.timestamp / pdf_skill object;
      affected=BOOT-04; owner=verifier; disposition=open] result.timestamp is
      created before imports and PDF parsing; pdf_skill has no retrieval
      timestamp. This does not establish when the exact skill bytes were read.
      Record a retrieval timestamp at the read and include it with the text,
      size, and hash."
    - "[severity=medium; location=CHK-0012 loaded_dependency_versions;
      affected=BOOT-02; owner=verifier; disposition=open] The fixed five-module
      lookup silently omits other third-party modules that may actually be
      loaded while importing/using the required PDF libraries. Enumerate the
      actually loaded relevant distributions or freeze and justify a complete
      dependency inventory, and fail if a required version cannot be recorded."
  target_fingerprint: 21b3af21cba522d205ebbf488b31958c7484c533e493e8b930ac236e2c9cd8c1
  baseline_hash: 754dec61bb39b2ad429e48caf5d6f3ead24f063cfc79c6e61df07ab38ddb16b7
  invocation_id: 790ca8f5-5bf7-4e6f-b30e-e57c2615a736
  generalization_review: false
  routing_required: true
---
# Scope
VT-FB18E4DC-CHK-0012

# Decision
fail

# Findings
[severity=high; location=data.source_baseline.VT-FB18E4DC-REQ-0010; affected=BOOT-01..BOOT-07; owner=verifier; disposition=open] CHK-0012 freezes REQ-0010 revision 1 fingerprint 055dc37dcf186a01793591294de58b7b8be33bf33037f422c259bb60d1caab7c, while current REQ-0010 is revision 2 fingerprint 89a0bdc57a1165e60aeb24500c39084b7ee945dadc446d6f575bf7fb68506d5f. Refresh the source baseline against the current requirement, then obtain a new independent review.
[severity=high; location=CHK-0012 command[3], source hash after-read block; affected=BOOT-06; owner=verifier; disposition=open] The procedure records after_sha256 but does not calculate or emit an after-read byte count or compare it with the before-read size. BOOT-06 requires both PDF sizes and hashes to be unchanged. Add after_bytes and compare it to the observed before size and expected size.
[severity=medium; location=CHK-0012 result.timestamp / pdf_skill object; affected=BOOT-04; owner=verifier; disposition=open] result.timestamp is created before imports and PDF parsing; pdf_skill has no retrieval timestamp. This does not establish when the exact skill bytes were read. Record a retrieval timestamp at the read and include it with the text, size, and hash.
[severity=medium; location=CHK-0012 loaded_dependency_versions; affected=BOOT-02; owner=verifier; disposition=open] The fixed five-module lookup silently omits other third-party modules that may actually be loaded while importing/using the required PDF libraries. Enumerate the actually loaded relevant distributions or freeze and justify a complete dependency inventory, and fail if a required version cannot be recorded.
