---
title: Unsafe preview fixture
---

# Safe rendered heading

<script>window.__unsafePreview = true</script>

<img src="/not-a-real-image" onerror="window.__unsafePreview = true">

This Markdown fixture must never execute or render its raw HTML.
