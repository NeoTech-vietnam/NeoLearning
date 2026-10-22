import { jsx as S, jsxs as O } from "react/jsx-runtime";
import { useState as P, useRef as T, useCallback as L, useEffect as k } from "react";
function X(e, t) {
  const [r, n] = P(!0), [i, a] = P(null), [y, b] = P(!1), [C, p] = P(e.theme), [g, h] = P(null), [v, m] = P(e.isSourceModeActive?.() ?? !1), s = T(t);
  s.current = t;
  const f = T(""), E = T(!1), R = L(
    (o) => {
      const { parse: c } = s.current;
      return c ? c(o) : o;
    },
    []
    // stable -- reads from ref
  ), w = L(
    (o) => {
      const { serialize: c } = s.current;
      return c ? c(o) : String(o);
    },
    []
    // stable -- reads from ref
  ), l = L(() => {
    s.current.getCurrentContent && (E.current || (E.current = !0, b(!0), e.setDirty(!0)));
  }, [e]), d = L(() => {
    E.current && (E.current = !1, b(!1), e.setDirty(!1));
  }, [e]);
  k(() => {
    let o = !0;
    return (async () => {
      try {
        const u = s.current;
        if (u.binary) {
          const I = await e.loadBinaryContent();
          if (!o)
            return;
          u.applyContent(I);
        } else {
          const I = await e.loadContent();
          if (!o)
            return;
          const D = R(I);
          f.current = I, u.applyContent(D);
        }
        if (!o)
          return;
        a(null), n(!1), s.current.onLoaded?.();
      } catch (u) {
        if (!o)
          return;
        const I = u instanceof Error ? u : new Error(String(u));
        a(I), n(!1);
      }
    })(), () => {
      o = !1;
    };
  }, [e, R]), k(() => e.onSaveRequested(async () => {
    const o = s.current;
    try {
      if (o.onSave)
        await o.onSave();
      else {
        if (!o.getCurrentContent)
          return;
        const c = o.getCurrentContent();
        if (o.binary)
          await e.saveContent(c);
        else {
          const u = w(c);
          f.current = u, await e.saveContent(u);
        }
      }
      d();
    } catch {
    }
  }), [e, w, d]), k(() => e.onFileChanged((o) => {
    if (o === f.current)
      return;
    const c = s.current;
    try {
      const u = R(o);
      f.current = o, c.applyContent(u), a(null), d(), c.onExternalChange?.(u);
    } catch {
    }
  }), [e, R, d]), k(() => e.onThemeChanged((o) => {
    p(o);
  }), [e]), k(() => e.onDiffRequested ? e.onDiffRequested((c) => {
    const u = s.current;
    if (u.onDiffRequested) {
      u.onDiffRequested(c);
      return;
    }
    let I, D;
    try {
      I = u.binary ? c.originalContent : R(c.originalContent), D = u.binary ? c.modifiedContent : R(c.modifiedContent);
    } catch {
      return;
    }
    h({
      original: I,
      modified: D,
      tagId: c.tagId,
      sessionId: c.sessionId,
      accept: () => {
        s.current.applyContent(D), u.binary || (f.current = w(D)), e.reportDiffResult?.({
          content: u.binary ? "" : w(D),
          action: "accept"
        }), d(), h(null);
      },
      reject: () => {
        s.current.applyContent(I), u.binary || (f.current = w(I)), e.reportDiffResult?.({
          content: u.binary ? "" : w(I),
          action: "reject"
        }), d(), h(null);
      }
    });
  }) : void 0, [e, R, w, d]), k(() => {
    if (e.onDiffCleared)
      return e.onDiffCleared(async () => {
        const o = s.current;
        if (o.onDiffCleared) {
          await o.onDiffCleared();
          return;
        }
        h(null), o.binary || e.loadContent().then((c) => {
          const u = R(c);
          f.current = c, s.current.applyContent(u), d();
        });
      });
  }, [e, R, d]), k(() => {
    if (e.onSourceModeChanged)
      return e.onSourceModeChanged((o) => {
        m(o);
      });
  }, [e]);
  const B = e.toggleSourceMode ? L(() => e.toggleSourceMode?.(), [e]) : void 0;
  return {
    markDirty: l,
    isLoading: r,
    error: i,
    theme: C,
    isDirty: y,
    diffState: g,
    toggleSourceMode: B,
    isSourceMode: v
  };
}
const Y = "virtual://com.nimbalyst.browser/";
function se(e) {
  const t = e.slice(Y.length), r = t.indexOf("?"), n = r >= 0 ? t.slice(0, r) : t, i = new URLSearchParams(r >= 0 ? t.slice(r + 1) : "");
  return {
    tabId: n,
    // Stable session id derived from the tab id so restore reuses one session.
    sessionId: `browser-virtual:${n}`,
    url: i.get("url") || "about:blank",
    title: i.get("title") || "New Tab"
  };
}
function z() {
  const e = window.electronAPI;
  if (!e)
    throw new Error("Browser extension requires electronAPI");
  return e;
}
const G = /* @__PURE__ */ new WeakMap();
function oe(e) {
  const t = typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `browser:${e}:${t}`;
}
async function x(e, t) {
  return await z().invoke(e, t);
}
async function q(e, t, r) {
  const n = await x("browser-session:create", {
    sessionId: e,
    url: t,
    partition: r?.partition,
    headless: r?.headless,
    viewport: r?.viewport
  });
  if (!n.success || !n.state)
    throw new Error(n.error || "Failed to create browser session");
  return n.state;
}
async function ie() {
  return (await x("browser-session:list-sessions", {})).sessionIds ?? [];
}
async function ae(e, t) {
  const r = await x("browser-session:evaluate", { sessionId: e, script: t });
  if (!r.success) throw new Error(r.error || "evaluate failed");
  return r.result;
}
async function ce(e) {
  const t = await x("browser-session:get-page-info", { sessionId: e });
  if (!t.success) throw new Error(t.error || "get-page-info failed");
  return t.info;
}
async function le(e, t) {
  const r = await x("browser-session:click", { sessionId: e, ...t });
  if (!r.success) throw new Error(r.error || "click failed");
}
async function ue(e, t) {
  const r = await x("browser-session:type", { sessionId: e, ...t });
  if (!r.success) throw new Error(r.error || "type failed");
}
async function de(e, t) {
  const r = await x("browser-session:scroll", { sessionId: e, ...t });
  if (!r.success) throw new Error(r.error || "scroll failed");
}
async function fe(e, t, r) {
  const n = await x("browser-session:screenshot-to-file", { sessionId: e, workspacePath: t, label: r });
  if (!n.success || !n.path)
    throw new Error(n.error || "screenshot-to-file failed");
  return n.path;
}
async function H(e) {
  await x("browser-session:destroy", { sessionId: e });
}
async function pe(e, t) {
  const r = await x("browser-session:attach", { sessionId: e, bounds: t });
  if (!r.success) throw new Error(r.error || "attach failed");
}
async function J(e) {
  await x("browser-session:detach", { sessionId: e });
}
async function we(e, t) {
  await x("browser-session:set-bounds", { sessionId: e, bounds: t });
}
async function A(e, t) {
  const r = await x("browser-session:navigate", { sessionId: e, url: t });
  if (!r.success) throw new Error(r.error || "navigate failed");
}
async function _(e) {
  await x("browser-session:reload", { sessionId: e });
}
async function W(e) {
  await x("browser-session:go-back", { sessionId: e });
}
async function V(e) {
  await x("browser-session:go-forward", { sessionId: e });
}
async function Q(e, t) {
  const r = await x("browser-session:build-preview-url", { filePath: e, workspacePath: t });
  if (!r.success || !r.url)
    throw new Error(r.error || "build-preview-url failed");
  return r.url;
}
function Z(e, t) {
  const r = (n) => {
    const i = n;
    i && i.sessionId === e && t(i);
  };
  return z().on("browser-session:state-changed", r);
}
function ee(e, t) {
  const r = (n) => {
    const i = n;
    i && i.sessionId === e && t(i.url);
  };
  return z().on("browser-session:external-nav", r);
}
function re(e, t) {
  const r = G.get(e);
  if (r)
    return r;
  const n = oe(t);
  return G.set(e, n), n;
}
function te({ sessionId: e, visible: t }) {
  const r = T(null);
  return k(() => {
    const n = r.current;
    if (!n || !t) return;
    let i = !1, a = !1, y = null, b = 0;
    const C = (l, d) => !(l.right <= d.left || l.left >= d.right || l.bottom <= d.top || l.top >= d.bottom), p = (l) => {
      const d = document.body;
      if (!d) return !1;
      for (let B = 0; B < d.children.length; B++) {
        const o = d.children[B];
        if (o === n || o.contains(n)) continue;
        const c = o.tagName;
        if (c === "SCRIPT" || c === "STYLE" || c === "LINK" || c === "TEMPLATE") continue;
        const u = o.getBoundingClientRect();
        if (u.width > 0 && u.height > 0 && C(u, l)) return !0;
        const I = o.querySelectorAll("*");
        for (let D = 0; D < I.length; D++) {
          const j = I[D].getBoundingClientRect();
          if (j.width > 0 && j.height > 0 && C(j, l)) return !0;
        }
      }
      return !1;
    }, g = () => {
      if (n.offsetParent === null) return null;
      const l = n.getBoundingClientRect(), d = Math.round(l.left), B = Math.round(l.top), o = Math.max(0, Math.round(l.width)), c = Math.max(0, Math.round(l.height));
      return o === 0 || c === 0 || p({ left: d, top: B, right: d + o, bottom: B + c }) ? null : { x: d, y: B, width: o, height: c };
    }, h = async () => {
      if (i) return;
      const l = g();
      if (!l) {
        a && (b++, J(e), a = !1, y = null);
        return;
      }
      const d = y;
      if (d && d.x === l.x && d.y === l.y && d.w === l.width && d.h === l.height)
        return;
      y = { x: l.x, y: l.y, w: l.width, h: l.height };
      const B = a ? b : ++b;
      try {
        a ? await we(e, l) : (a = !0, await pe(e, l));
      } catch (o) {
        !i && b === B && (a = !1, y = null), console.warn("[BrowserSurface] attach/setBounds failed:", o);
      }
    }, v = new ResizeObserver(() => {
      h();
    });
    v.observe(n);
    const m = new IntersectionObserver(() => {
      h();
    });
    m.observe(n);
    let s = 0;
    const f = new MutationObserver(() => {
      s || (s = requestAnimationFrame(() => {
        s = 0, h();
      }));
    });
    f.observe(document.body, { childList: !0, subtree: !0 });
    const E = () => {
      h();
    };
    window.addEventListener("resize", E);
    const R = performance.now();
    let w = requestAnimationFrame(function l() {
      h(), performance.now() - R < 1e3 && !i && (w = requestAnimationFrame(l));
    });
    return () => {
      i = !0, v.disconnect(), m.disconnect(), f.disconnect(), s && cancelAnimationFrame(s), window.removeEventListener("resize", E), cancelAnimationFrame(w), a && J(e);
    };
  }, [e, t]), /* @__PURE__ */ S(
    "div",
    {
      ref: r,
      className: "nim-browser-surface",
      "data-session-id": e,
      style: {
        flex: "1 1 auto",
        minHeight: 0,
        backgroundColor: "transparent"
      }
    }
  );
}
const K = (e) => e && e !== "about:blank" ? e : "";
function ne({
  state: e,
  onNavigate: t,
  onBack: r,
  onForward: n,
  onReload: i,
  onToggleSourceMode: a,
  pinnedUrlLabel: y,
  autoFocusUrl: b
}) {
  const [C, p] = P(K(e?.url)), [g, h] = P(!1), v = T(null);
  k(() => {
    g || p(K(e?.url));
  }, [e?.url, g]), k(() => {
    if (!b || y !== void 0) return;
    let s = 0;
    const f = setInterval(() => {
      const E = v.current;
      s += 1, E && E.offsetParent !== null ? (E.focus(), clearInterval(f)) : s > 20 && clearInterval(f);
    }, 50);
    return () => clearInterval(f);
  }, []);
  const m = () => {
    const s = C.trim();
    if (!s) return;
    let f = s;
    /^[a-z]+:/i.test(f) || (f = `https://${f}`), t(f);
  };
  return /* @__PURE__ */ O(
    "div",
    {
      className: "nim-browser-toolbar",
      style: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 8px",
        borderBottom: "1px solid var(--nim-border)",
        background: "var(--nim-bg-secondary)"
      },
      children: [
        /* @__PURE__ */ S(
          "button",
          {
            type: "button",
            onClick: r,
            disabled: !e?.canGoBack,
            className: "nim-browser-toolbar-btn",
            "aria-label": "Back",
            title: "Back",
            style: { padding: "4px 8px" },
            children: "←"
          }
        ),
        /* @__PURE__ */ S(
          "button",
          {
            type: "button",
            onClick: n,
            disabled: !e?.canGoForward,
            className: "nim-browser-toolbar-btn",
            "aria-label": "Forward",
            title: "Forward",
            style: { padding: "4px 8px" },
            children: "→"
          }
        ),
        /* @__PURE__ */ S(
          "button",
          {
            type: "button",
            onClick: i,
            className: "nim-browser-toolbar-btn",
            "aria-label": "Reload",
            title: "Reload",
            style: { padding: "4px 8px" },
            children: "↻"
          }
        ),
        y !== void 0 ? /* @__PURE__ */ S(
          "span",
          {
            className: "nim-browser-url-label",
            title: y,
            style: {
              flex: 1,
              minWidth: 0,
              padding: "4px 8px",
              border: "1px solid var(--nim-border)",
              borderRadius: 4,
              color: "var(--nim-text-muted)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontFamily: "inherit"
            },
            children: y
          }
        ) : /* @__PURE__ */ S(
          "input",
          {
            ref: v,
            className: "nim-browser-url-input",
            type: "text",
            value: C,
            onChange: (s) => p(s.target.value),
            onFocus: () => h(!0),
            onBlur: () => h(!1),
            onKeyDown: (s) => {
              s.key === "Enter" && (s.preventDefault(), m());
            },
            spellCheck: !1,
            "aria-label": "URL",
            style: {
              flex: 1,
              minWidth: 0,
              padding: "4px 8px",
              border: "1px solid var(--nim-border)",
              borderRadius: 4,
              background: "var(--nim-bg)",
              color: "var(--nim-text)",
              outline: "none"
            },
            placeholder: "Enter URL"
          }
        ),
        e?.isLoading ? /* @__PURE__ */ S(
          "span",
          {
            className: "nim-browser-loading",
            "aria-hidden": "true",
            style: { fontSize: 11, color: "var(--nim-text-muted)" },
            children: "Loading…"
          }
        ) : null,
        a ? /* @__PURE__ */ S(
          "button",
          {
            type: "button",
            onClick: a,
            className: "nim-browser-toolbar-btn",
            title: "Toggle source view",
            style: { padding: "4px 8px" },
            children: "Source"
          }
        ) : null
      ]
    }
  );
}
function be({ host: e }) {
  const [t, r] = P(null), [n, i] = P(null), [a, y] = P(null), b = T(re(e, e.filePath)), C = T(!1);
  return k(() => (e.registerEditorAPI?.({ getSessionId: () => b.current }), () => e.registerEditorAPI?.(null)), [e]), X(e, {
    applyContent: () => {
      C.current && _(b.current);
    },
    parse: (p) => p,
    serialize: (p) => p
  }), k(() => {
    let p = !1;
    return y(null), r(null), Q(e.filePath, e.workspaceId).then((g) => {
      p || r(g);
    }).catch((g) => {
      p || y(g.message || "Failed to build preview URL");
    }), () => {
      p = !0;
    };
  }, [e.filePath, e.workspaceId]), k(() => {
    if (!t) return;
    const p = b.current;
    let g = !1;
    q(p, t).then((m) => {
      g || (C.current = !0, i(m));
    }).catch((m) => {
      g || y(m.message || "Failed to create browser session");
    });
    const h = Z(p, (m) => {
      i(m);
    }), v = ee(p, (m) => {
      const s = window.electronAPI;
      m.startsWith("nim-preview://") ? A(p, m) : s?.invoke && s.invoke("open-external", m).catch(() => {
      });
    });
    return () => {
      g = !0, h(), v(), C.current = !1, H(p);
    };
  }, [t]), a ? /* @__PURE__ */ S(
    "div",
    {
      className: "nim-browser-editor nim-browser-editor-error",
      style: { display: "flex", flexDirection: "column", height: "100%", padding: 16 },
      children: /* @__PURE__ */ O(
        "div",
        {
          style: {
            padding: 12,
            border: "1px solid var(--nim-error)",
            background: "color-mix(in srgb, var(--nim-error) 8%, var(--nim-bg))",
            color: "var(--nim-text)",
            borderRadius: 4
          },
          children: [
            /* @__PURE__ */ S("strong", { children: "Cannot preview this file." }),
            /* @__PURE__ */ S("div", { style: { marginTop: 8, fontSize: 13 }, children: a })
          ]
        }
      )
    }
  ) : /* @__PURE__ */ O(
    "div",
    {
      className: "nim-browser-editor",
      style: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        position: "relative"
      },
      children: [
        /* @__PURE__ */ S(
          ne,
          {
            state: n,
            onNavigate: (p) => {
              A(b.current, p).catch((g) => {
                y(String(g?.message ?? g));
              });
            },
            onBack: () => {
              W(b.current);
            },
            onForward: () => {
              V(b.current);
            },
            onReload: () => {
              _(b.current);
            },
            onToggleSourceMode: e.supportsSourceMode && e.toggleSourceMode ? () => e.toggleSourceMode?.() : void 0,
            pinnedUrlLabel: t ?? void 0
          }
        ),
        /* @__PURE__ */ S(te, { sessionId: b.current, visible: !!t })
      ]
    }
  );
}
function ge(e) {
  if (!e.trim())
    return { version: 1, url: "about:blank" };
  const t = JSON.parse(e);
  if (typeof t != "object" || t === null)
    throw new Error("Browser session document must be a JSON object");
  const r = typeof t.url == "string" ? t.url : "about:blank";
  return {
    version: typeof t.version == "number" ? t.version : 1,
    mode: t.mode === "localPreview" ? "localPreview" : "url",
    title: typeof t.title == "string" ? t.title : void 0,
    url: r,
    viewportPreset: t.viewportPreset === "tablet" || t.viewportPreset === "mobile" ? t.viewportPreset : "desktop",
    autoReloadOnSave: !!t.autoReloadOnSave
  };
}
function ye(e) {
  return `${JSON.stringify(e, null, 2)}
`;
}
function he({ host: e }) {
  const t = e.filePath.startsWith(Y), r = T(t ? se(e.filePath) : null), n = r.current ? `vbrowser-url:${r.current.tabId}` : "", i = (() => {
    if (!r.current) return "about:blank";
    const s = e.storage?.get?.(n);
    return typeof s == "string" && s || r.current.url;
  })(), a = T({ version: 1, url: i }), [y, b] = P(null), [C, p] = P(null), [g, h] = P(t), v = T(
    r.current ? r.current.sessionId : re(e, e.filePath)
  );
  k(() => (e.registerEditorAPI?.({ getSessionId: () => v.current }), () => e.registerEditorAPI?.(null)), [e]);
  const { markDirty: m } = X(e, {
    applyContent: (s) => {
      if (t) {
        h(!0);
        return;
      }
      a.current = s, h(!0);
    },
    getCurrentContent: () => a.current,
    parse: ge,
    serialize: ye
  });
  return k(() => {
    if (!g) return;
    const s = v.current;
    let f = !1;
    q(s, a.current.url || "about:blank").then((w) => {
      f || b(w);
    }).catch((w) => {
      f || p(w.message || "Failed to create browser session");
    });
    const E = Z(s, (w) => {
      b(w), r.current && w.url && w.url !== "about:blank" && e.storage?.set?.(n, w.url);
    }), R = ee(s, (w) => {
      const l = window.electronAPI;
      w.startsWith("nim-preview://") ? A(s, w) : l?.invoke && l.invoke("open-external", w).catch(() => {
      });
    });
    return () => {
      f = !0, E(), R(), H(s);
    };
  }, [g]), C ? /* @__PURE__ */ O("div", { className: "nim-browser-editor nim-browser-editor-error", style: { padding: 16 }, children: [
    /* @__PURE__ */ S("strong", { children: "Browser session error." }),
    /* @__PURE__ */ S("div", { style: { marginTop: 8, fontSize: 13 }, children: C })
  ] }) : /* @__PURE__ */ O(
    "div",
    {
      className: "nim-browser-editor",
      style: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        position: "relative"
      },
      children: [
        /* @__PURE__ */ S(
          ne,
          {
            state: y,
            onNavigate: (s) => {
              a.current = { ...a.current, url: s }, t || m(), A(v.current, s).catch((f) => {
                p(String(f?.message ?? f));
              });
            },
            onBack: () => {
              W(v.current);
            },
            onForward: () => {
              V(v.current);
            },
            onReload: () => {
              _(v.current);
            },
            onToggleSourceMode: e.supportsSourceMode && e.toggleSourceMode ? () => e.toggleSourceMode?.() : void 0,
            autoFocusUrl: t && i === "about:blank"
          }
        ),
        /* @__PURE__ */ S(te, { sessionId: v.current, visible: g })
      ]
    }
  );
}
const F = ["*.browser.json", "*.html", "*.htm"];
function N(e, t) {
  const r = typeof e.sessionId == "string" ? e.sessionId.trim() : "";
  if (r) return r;
  const i = t.editorAPI?.getSessionId?.();
  if (i) return i;
  throw new Error(
    "No target browser session. Open a .browser.json/.html editor, or pass an explicit sessionId (e.g. from browser.open_session)."
  );
}
function U(e) {
  const t = {};
  return typeof e.selector == "string" && (t.selector = e.selector), typeof e.index == "number" && (t.index = e.index), t;
}
const M = {
  sessionId: {
    type: "string",
    description: "Optional explicit browser session id (e.g. from browser.open_session). Omit to target the browser editor the user currently has open."
  }
}, $ = {
  selector: { type: "string", description: "CSS selector of the target element." },
  index: {
    type: "number",
    description: "Index of an element from a prior browser.get_page_info `interactive` list."
  }
}, Se = [
  // ---------- Global session management ----------
  {
    name: "browser.open_session",
    scope: "global",
    access: { kind: "filesystem" },
    description: "Open a new browser session and load a URL. By default the session is headless (agent-owned, rendered off-screen) so you can drive it without a visible tab. Returns the sessionId to use with the other browser tools.",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "http(s):// or nim-preview:// URL to load." },
        headless: {
          type: "boolean",
          description: "Default true. Set false to require an attached editor tab instead."
        },
        sessionId: {
          type: "string",
          description: "Optional stable id to reuse; auto-generated if omitted."
        },
        width: { type: "number", description: "Viewport width in CSS px (headless only)." },
        height: { type: "number", description: "Viewport height in CSS px (headless only)." }
      },
      required: ["url"]
    },
    handler: async (e) => {
      const t = String(e.url ?? "");
      if (!t) return { success: !1, error: "url is required" };
      const r = e.headless !== !1, n = typeof e.sessionId == "string" && e.sessionId || `agent-browser:${Date.now()}-${Math.random().toString(16).slice(2)}`, i = typeof e.width == "number" && typeof e.height == "number" ? { width: e.width, height: e.height } : void 0;
      try {
        const a = await q(n, t, { headless: r, viewport: i });
        return {
          success: !0,
          message: `Opened browser session ${n}`,
          data: { sessionId: n, state: a }
        };
      } catch (a) {
        return { success: !1, error: a instanceof Error ? a.message : String(a) };
      }
    }
  },
  {
    name: "browser.open_local_preview",
    scope: "global",
    access: { kind: "filesystem" },
    description: "Open a workspace-relative or absolute local HTML file as a live preview in a browser session (served over nim-preview:// so relative assets resolve). Headless by default. Returns the sessionId.",
    inputSchema: {
      type: "object",
      properties: {
        filePath: { type: "string", description: "Absolute path to an .html/.htm file in the workspace." },
        headless: { type: "boolean", description: "Default true." }
      },
      required: ["filePath"]
    },
    handler: async (e, t) => {
      const r = String(e.filePath ?? "");
      if (!r) return { success: !1, error: "filePath is required" };
      const n = e.headless !== !1;
      try {
        const i = await Q(r, t.workspacePath), a = `agent-preview:${Date.now()}-${Math.random().toString(16).slice(2)}`, y = await q(a, i, { headless: n });
        return { success: !0, message: `Preview opened for ${r}`, data: { sessionId: a, url: i, state: y } };
      } catch (i) {
        return { success: !1, error: i instanceof Error ? i.message : String(i) };
      }
    }
  },
  {
    name: "browser.list_sessions",
    scope: "global",
    access: { kind: "filesystem" },
    description: "List the ids of all open browser sessions (both editor-backed and agent-owned).",
    inputSchema: { type: "object", properties: {} },
    handler: async () => {
      try {
        return { success: !0, data: { sessionIds: await ie() } };
      } catch (e) {
        return { success: !1, error: e instanceof Error ? e.message : String(e) };
      }
    }
  },
  {
    name: "browser.close_session",
    scope: "global",
    access: { kind: "filesystem" },
    description: "Close an agent-owned browser session and free its resources.",
    inputSchema: {
      type: "object",
      properties: { sessionId: { type: "string", description: "Session id to close." } },
      required: ["sessionId"]
    },
    handler: async (e) => {
      const t = String(e.sessionId ?? "");
      if (!t) return { success: !1, error: "sessionId is required" };
      try {
        return await H(t), { success: !0, message: `Closed ${t}` };
      } catch (r) {
        return { success: !1, error: r instanceof Error ? r.message : String(r) };
      }
    }
  },
  // ---------- Editor-scoped interaction ----------
  {
    name: "browser.navigate",
    scope: "editor",
    access: { kind: "editor-read" },
    editorFilePatterns: F,
    description: "Navigate the target browser session to a URL.",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "http(s):// or nim-preview:// URL." },
        ...M
      },
      required: ["url"]
    },
    handler: async (e, t) => {
      try {
        const r = N(e, t);
        return await A(r, String(e.url ?? "")), { success: !0, message: `Navigating to ${e.url}` };
      } catch (r) {
        return { success: !1, error: r instanceof Error ? r.message : String(r) };
      }
    }
  },
  {
    name: "browser.reload",
    scope: "editor",
    access: { kind: "editor-read" },
    editorFilePatterns: F,
    description: "Reload the current page in the target browser session.",
    inputSchema: { type: "object", properties: { ...M } },
    handler: async (e, t) => {
      try {
        return await _(N(e, t)), { success: !0 };
      } catch (r) {
        return { success: !1, error: r instanceof Error ? r.message : String(r) };
      }
    }
  },
  {
    name: "browser.go_back",
    scope: "editor",
    access: { kind: "editor-read" },
    editorFilePatterns: F,
    description: "Go back one entry in the session navigation history.",
    inputSchema: { type: "object", properties: { ...M } },
    handler: async (e, t) => {
      try {
        return await W(N(e, t)), { success: !0 };
      } catch (r) {
        return { success: !1, error: r instanceof Error ? r.message : String(r) };
      }
    }
  },
  {
    name: "browser.go_forward",
    scope: "editor",
    access: { kind: "editor-read" },
    editorFilePatterns: F,
    description: "Go forward one entry in the session navigation history.",
    inputSchema: { type: "object", properties: { ...M } },
    handler: async (e, t) => {
      try {
        return await V(N(e, t)), { success: !0 };
      } catch (r) {
        return { success: !1, error: r instanceof Error ? r.message : String(r) };
      }
    }
  },
  {
    name: "browser.get_page_info",
    scope: "editor",
    access: { kind: "editor-read" },
    editorFilePatterns: F,
    description: "Read the current page: url, title, visible text (truncated), and an indexed list of interactive elements (links, buttons, inputs). Use the returned `index` values with browser.click / browser.type. Form-field contents are never returned; each field reports `filled` (or `checked`) so you can confirm your input landed.",
    inputSchema: { type: "object", properties: { ...M } },
    handler: async (e, t) => {
      try {
        return { success: !0, data: await ce(N(e, t)) };
      } catch (r) {
        return { success: !1, error: r instanceof Error ? r.message : String(r) };
      }
    }
  },
  {
    name: "browser.click",
    scope: "editor",
    access: { kind: "editor-read" },
    editorFilePatterns: F,
    description: "Click an element via a real input event. Target by CSS selector, by an index from browser.get_page_info, or by explicit x/y CSS-pixel coordinates.",
    inputSchema: {
      type: "object",
      properties: {
        ...$,
        x: { type: "number", description: "X coordinate in CSS px (alternative to selector/index)." },
        y: { type: "number", description: "Y coordinate in CSS px (alternative to selector/index)." },
        ...M
      }
    },
    handler: async (e, t) => {
      try {
        const r = N(e, t), n = U(e), i = typeof e.x == "number" ? e.x : void 0, a = typeof e.y == "number" ? e.y : void 0;
        return await le(r, { ...n, x: i, y: a }), { success: !0 };
      } catch (r) {
        return { success: !1, error: r instanceof Error ? r.message : String(r) };
      }
    }
  },
  {
    name: "browser.type",
    scope: "editor",
    access: { kind: "editor-read" },
    editorFilePatterns: F,
    description: "Type text into an element (real character events, safe for controlled inputs). Target by selector or index; omit both to type into the focused element. Set clear=true to empty the field first.",
    inputSchema: {
      type: "object",
      properties: {
        text: { type: "string", description: "Text to type." },
        clear: { type: "boolean", description: "Clear the field before typing." },
        ...$,
        ...M
      },
      required: ["text"]
    },
    handler: async (e, t) => {
      try {
        const r = N(e, t);
        return await ue(r, {
          ...U(e),
          text: String(e.text ?? ""),
          clear: e.clear === !0
        }), { success: !0 };
      } catch (r) {
        return { success: !1, error: r instanceof Error ? r.message : String(r) };
      }
    }
  },
  {
    name: "browser.scroll",
    scope: "editor",
    access: { kind: "editor-read" },
    editorFilePatterns: F,
    description: "Scroll the page by a delta (dx/dy) or scroll a selector/index element into view.",
    inputSchema: {
      type: "object",
      properties: {
        dx: { type: "number", description: "Horizontal scroll delta in px." },
        dy: { type: "number", description: "Vertical scroll delta in px." },
        ...$,
        ...M
      }
    },
    handler: async (e, t) => {
      try {
        const r = N(e, t);
        return await de(r, {
          ...U(e),
          dx: typeof e.dx == "number" ? e.dx : void 0,
          dy: typeof e.dy == "number" ? e.dy : void 0
        }), { success: !0 };
      } catch (r) {
        return { success: !1, error: r instanceof Error ? r.message : String(r) };
      }
    }
  },
  {
    name: "browser.evaluate",
    scope: "editor",
    access: { kind: "editor-read" },
    editorFilePatterns: F,
    description: "Run JavaScript in the page and return its (serializable) result. The expression is awaited, so you can return a Promise. Use for reading DOM state or driving interactions selectors can’t express.",
    inputSchema: {
      type: "object",
      properties: {
        script: { type: "string", description: "JavaScript expression to evaluate in the page." },
        ...M
      },
      required: ["script"]
    },
    handler: async (e, t) => {
      try {
        const r = N(e, t);
        return { success: !0, data: { result: await ae(r, String(e.script ?? "")) } };
      } catch (r) {
        return { success: !1, error: r instanceof Error ? r.message : String(r) };
      }
    }
  },
  {
    name: "browser.screenshot",
    scope: "editor",
    access: { kind: "editor-read" },
    editorFilePatterns: F,
    description: "Capture a screenshot of the target browser session and save it as a PNG under the workspace. Returns the file path so you can view it.",
    inputSchema: {
      type: "object",
      properties: {
        label: { type: "string", description: "Optional label used in the filename." },
        ...M
      }
    },
    handler: async (e, t) => {
      if (!t.workspacePath)
        return { success: !1, error: "No workspace open; cannot save screenshot." };
      try {
        const r = N(e, t), n = await fe(
          r,
          t.workspacePath,
          typeof e.label == "string" ? e.label : void 0
        );
        return { success: !0, message: `Screenshot saved to ${n}`, data: { path: n } };
      } catch (r) {
        return { success: !1, error: r instanceof Error ? r.message : String(r) };
      }
    }
  }
], xe = {
  BrowserEditor: be,
  BrowserSessionEditor: he
};
async function Ie() {
}
async function ke() {
}
export {
  Ie as activate,
  Se as aiTools,
  xe as components,
  ke as deactivate
};
