import { jsxs as u, Fragment as ee, jsx as n } from "react/jsx-runtime";
import { useState as v, useRef as W, useEffect as w } from "react";
const D = { cliPath: "", mode: "accept-edits", effort: "default", mcp: !0, turbo: !0, timeoutSeconds: 600 };
function M(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e) ? e : {};
}
function b(e) {
  return typeof e == "string" ? e : "";
}
function te(e) {
  return typeof e == "number" && Number.isFinite(e) && e >= 0 ? e : 0;
}
function B(e) {
  const t = M(e), r = ["default", "low", "medium", "high", "xhigh", "max"].includes(b(t.effort)) ? b(t.effort) : D.effort;
  return { cliPath: b(t.cliPath), mode: t.mode === "plan" ? "plan" : "accept-edits", effort: r, mcp: t.mcp !== !1, turbo: t.turbo === void 0 ? D.turbo : t.turbo === !0, timeoutSeconds: Math.min(3600, Math.max(30, te(t.timeoutSeconds) || 600)) };
}
function ne() {
  if (typeof document > "u") return () => {
  };
  const e = "antigravity-cli-provider-icon", t = document.createElement("style"), r = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2c.9 5.4 4.6 9.1 10 10-5.4.9-9.1 4.6-10 10-.9-5.4-4.6-9.1-10-10 5.4-.9 9.1-4.6 10-10z"/></svg>')}`;
  t.textContent = `.${e} { font-size: 0 !important; }
    .${e}::before {
      content: ''; display: inline-block; vertical-align: middle;
      width: var(--agy-icon-size, 20px); height: var(--agy-icon-size, 20px);
      background-color: #4285f4;
      mask: url("${r}") center / contain no-repeat;
    }`, document.head.append(t);
  const d = (a) => {
    const o = a instanceof Element ? a : a.parentElement;
    if (!o) return;
    const c = o.matches(".material-symbols-outlined") ? [o] : o.querySelectorAll(".material-symbols-outlined");
    for (const i of c) {
      if (!(i instanceof HTMLElement)) continue;
      const l = i.textContent?.trim() === "antigravity-cli", f = i.style.fontSize || "20px";
      l && i.style.getPropertyValue("--agy-icon-size") !== f && i.style.setProperty("--agy-icon-size", f), i.classList.contains(e) !== l && i.classList.toggle(e, l), !l && i.style.getPropertyValue("--agy-icon-size") && i.style.removeProperty("--agy-icon-size");
    }
  };
  d(document.body);
  const m = new MutationObserver((a) => {
    for (const o of a) {
      if (o.type === "attributes") {
        o.target instanceof Element && o.target.matches(".material-symbols-outlined") && d(o.target);
        continue;
      }
      d(o.target);
      for (const c of o.addedNodes) d(c);
    }
  });
  return m.observe(document.body, { subtree: !0, childList: !0, characterData: !0, attributes: !0, attributeFilter: ["class", "style"] }), () => {
    m.disconnect(), t.remove(), document.querySelectorAll(`.${e}`).forEach((a) => {
      a.classList.remove(e), a.style.removeProperty("--agy-icon-size");
    });
  };
}
function j(e) {
  return /argon/i.test(e.name) ? "argon" : /gemini/i.test(e.name) ? "gemini" : "other";
}
function ie(e, t) {
  return e.find((r) => j(r) === t) ?? e[0];
}
function re(e) {
  const t = e instanceof Error ? e.message : typeof e == "string" ? e : b(M(e).message);
  return /paused while a CLI turn/i.test(t) ? { waiting: !0, message: "Usage will refresh automatically when the current Gemini turn finishes.", retry: !0 } : /Start an Antigravity CLI session before/i.test(t) ? { waiting: !0, message: "Send a message in an Antigravity CLI session to enable account usage.", retry: !1 } : /unknown|not found|not registered|not running|not available|unavailable/i.test(t) ? { waiting: !1, message: "If the extension was just updated, reopen Nimbalyst once. Send a message in an Antigravity CLI session to start its backend, then refresh here.", retry: !1 } : { waiting: !1, message: t.split("Error: ").at(-1) || "Could not read account usage.", retry: !1 };
}
function F(e) {
  return e >= 90 ? "#ef4444" : e >= 75 ? "#eab308" : "#22c55e";
}
function ae(e, t = Date.now()) {
  if (!e) return "Reset time unavailable";
  const r = Date.parse(e) - t;
  if (r <= 0) return "Reset due; refresh to update";
  const d = Math.ceil(r / 6e4), m = Math.floor(d / 1440), a = Math.floor(d % 1440 / 60), o = d % 60;
  return `Resets in ${m ? `${m}d ` : ""}${a ? `${a}h ` : ""}${!m && o ? `${o}m` : ""}`.trim();
}
let C = { loading: !1, waiting: !1, notice: "", error: "", enabled: !0, group: "gemini" }, R, I, x = 0, $;
const H = /* @__PURE__ */ new Set();
function h(e) {
  C = { ...C, ...e };
  for (const t of H) t(C);
}
function _() {
  const [e, t] = v(C);
  return w(() => (H.add(t), t(C), () => {
    H.delete(t);
  }), []), e;
}
function oe(e) {
  R = e;
  const t = ++x;
  h({ enabled: e.services.configuration?.get("usageIndicatorEnabled", !0) ?? !0, group: e.services.configuration?.get("usageGroup", "gemini") ?? "gemini" }), C.enabled && A();
  const r = setInterval(() => {
    C.enabled && document.visibilityState === "visible" && A();
  }, 5 * 6e4);
  return () => {
    clearInterval(r), clearTimeout($), x === t && (x++, R = void 0, I = void 0, h({ loading: !1 }));
  };
}
async function A(e = !1) {
  if (I) return I;
  const t = R, r = x;
  if (!t?.services.ai) {
    h({ error: "Nimbalyst backend bridge is unavailable." });
    return;
  }
  return h({ loading: !0 }), I = (async () => {
    try {
      const d = await t.services.ai.callBackendTool("antigravity-cli.quota_v2", { refresh: e });
      if (!Array.isArray(d.groups) || !d.groups.length || !Number.isFinite(d.fetchedAt)) throw new Error("No quota data was returned.");
      r === x && (h({ data: d, error: "", waiting: !!d.deferred, notice: d.deferred ? "Usage will refresh automatically when the current Gemini turn finishes." : "" }), d.deferred ? K(r) : clearTimeout($));
    } catch (d) {
      const m = re(d);
      r === x && (h({ waiting: m.waiting, notice: m.waiting ? m.message : "", error: m.waiting ? "" : m.message }), m.retry && K(r));
    } finally {
      r === x && (I = void 0, h({ loading: !1 }));
    }
  })(), I;
}
function K(e) {
  clearTimeout($), $ = setTimeout(() => {
    e === x && C.enabled && document.visibilityState === "visible" && A();
  }, 15e3);
}
async function J(e) {
  try {
    await R?.services.configuration?.update("usageIndicatorEnabled", e, "user"), h({ enabled: e }), e ? A() : clearTimeout($);
  } catch (t) {
    h({ error: t.message });
  }
}
async function se(e) {
  try {
    await R?.services.configuration?.update("usageGroup", e, "user"), h({ group: e });
  } catch (t) {
    h({ error: t.message });
  }
}
function Q(e) {
  return ie(e.data?.groups ?? [], e.group);
}
function V(e) {
  return e === "argon" ? "Argon" : e === "gemini" ? "Gemini" : "Claude / GPT";
}
function le() {
  return /* @__PURE__ */ n("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true", children: /* @__PURE__ */ n("path", { d: "M12 2c.9 5.4 4.6 9.1 10 10-5.4.9-9.1 4.6-10 10-.9-5.4-4.6-9.1-10-10 5.4-.9 9.1-4.6 10-10z" }) });
}
const U = { border: 0, background: "none", color: "var(--nim-text-muted)", cursor: "pointer", padding: 4, fontSize: 16 };
function Y({ onClose: e }) {
  const t = _(), r = Q(t), [d, m] = v(Date.now()), a = r ? j(r) : t.group, o = t.data ? t.data.groups.map(j) : ["gemini", "other"];
  w(() => {
    const i = setInterval(() => m(Date.now()), 3e4);
    return () => clearInterval(i);
  }, []);
  const c = t.data ? Math.max(0, Math.floor((d - t.data.fetchedAt) / 6e4)) : void 0;
  return /* @__PURE__ */ u("div", { className: "agy-usage-card", style: { color: "var(--nim-text)", fontSize: 13, fontFamily: "var(--nim-font-family, system-ui)", width: "100%" }, children: [
    /* @__PURE__ */ u("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "16px 18px", borderBottom: "1px solid var(--nim-border)" }, children: [
      /* @__PURE__ */ n(le, {}),
      /* @__PURE__ */ u("strong", { style: { flex: 1, fontSize: 15 }, children: [
        V(a),
        " Usage"
      ] }),
      /* @__PURE__ */ n("button", { style: U, title: "Refresh usage", "aria-label": "Refresh usage", disabled: t.loading, onClick: () => {
        A(!0);
      }, children: "↻" }),
      e && /* @__PURE__ */ n("button", { style: U, title: "Close", "aria-label": "Close usage", onClick: e, children: "×" })
    ] }),
    /* @__PURE__ */ n("div", { style: { padding: "14px 18px 0", display: "flex", gap: 8 }, children: o.map((i) => /* @__PURE__ */ n("button", { onClick: () => {
      se(i);
    }, style: { ...U, fontSize: 12, borderRadius: 5, padding: "5px 9px", background: a === i ? "var(--nim-bg-hover)" : "none", color: a === i ? "var(--nim-text)" : "var(--nim-text-muted)" }, children: V(i) }, i)) }),
    /* @__PURE__ */ u("div", { style: { padding: "12px 18px" }, children: [
      /* @__PURE__ */ n("div", { style: { fontSize: 11, color: "var(--nim-text-muted)", marginBottom: 18 }, children: "Antigravity account limits" }),
      r?.buckets.slice().sort((i, l) => (i.window === "5h" ? 0 : 1) - (l.window === "5h" ? 0 : 1)).map((i) => /* @__PURE__ */ u("div", { style: { marginBottom: 22 }, children: [
        /* @__PURE__ */ u("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }, children: [
          /* @__PURE__ */ u("div", { children: [
            /* @__PURE__ */ n("strong", { children: i.window === "5h" ? "Session" : i.window === "weekly" ? "Weekly" : i.window }),
            /* @__PURE__ */ n("div", { style: { fontSize: 11, color: "var(--nim-text-muted)", marginTop: 4 }, children: i.window === "5h" ? "5-hour window" : i.window === "weekly" ? "7-day window" : i.window })
          ] }),
          /* @__PURE__ */ u("div", { style: { textAlign: "right", color: F(i.usedPercent) }, children: [
            /* @__PURE__ */ u("strong", { style: { fontSize: 17 }, children: [
              Math.round(i.usedPercent),
              "%"
            ] }),
            /* @__PURE__ */ n("div", { style: { fontSize: 10, marginTop: 2 }, children: "used" })
          ] })
        ] }),
        /* @__PURE__ */ n("div", { role: "progressbar", "aria-label": `${i.window} quota used`, "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": Math.round(i.usedPercent), style: { height: 6, background: "var(--nim-bg-tertiary, #303033)", borderRadius: 4, overflow: "hidden", margin: "9px 0 7px" }, children: /* @__PURE__ */ n("div", { style: { width: `${i.usedPercent}%`, height: "100%", background: F(i.usedPercent), borderRadius: 4 } }) }),
        /* @__PURE__ */ u("div", { style: { fontSize: 11, color: "var(--nim-text-muted)" }, title: i.resetAt ? new Date(i.resetAt).toLocaleString() : void 0, children: [
          "◷ ",
          ae(i.resetAt, d)
        ] })
      ] }, i.id)),
      !r && /* @__PURE__ */ n("p", { style: { color: "var(--nim-text-muted)" }, children: t.loading ? "Reading account quota…" : t.waiting ? "Waiting for Gemini to finish…" : "Usage unavailable" }),
      t.notice && /* @__PURE__ */ n("p", { role: "status", style: { color: "var(--nim-text-muted)", fontSize: 12, lineHeight: 1.5 }, children: t.notice }),
      t.error && /* @__PURE__ */ n("p", { role: "alert", style: { color: "var(--nim-warning, #eab308)", fontSize: 12, lineHeight: 1.5 }, children: t.error })
    ] }),
    /* @__PURE__ */ u("div", { style: { padding: "12px 18px", borderTop: "1px solid var(--nim-border)", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, color: "var(--nim-text-muted)" }, children: [
      /* @__PURE__ */ n("span", { children: t.loading ? "Updating…" : t.waiting ? c === void 0 ? "Refresh queued" : `Updated ${c}m ago · refresh queued` : c === void 0 ? "No reading yet" : c === 0 ? "Updated just now" : `Updated ${c}m ago${c >= 10 ? " · stale" : ""}` }),
      /* @__PURE__ */ n("button", { style: { ...U, fontSize: 11 }, onClick: () => {
        J(!1);
      }, children: "Disable" })
    ] })
  ] });
}
function de() {
  const e = _(), [t, r] = v(!1), [d, m] = v({ left: 60, bottom: 12 }), a = W(null), o = W(null), c = Q(e), i = c ? Math.max(...c.buckets.map((l) => l.usedPercent)) : void 0;
  return w(() => {
    e.enabled || r(!1);
  }, [e.enabled]), w(() => {
    const l = () => document.querySelector('button[data-panel-id="com.local.antigravity-cli.account-usage"]'), f = (y) => {
      y.preventDefault(), y.stopPropagation();
      const k = o.current?.getBoundingClientRect();
      k && m({ left: Math.max(8, Math.min(k.right + 12, window.innerWidth - 300)), bottom: Math.max(12, window.innerHeight - k.bottom) }), r((T) => !T), A();
    }, g = () => {
      const y = l();
      y !== o.current && (o.current?.removeEventListener("click", f, !0), o.current = y, y?.addEventListener("click", f, !0));
    };
    g();
    const S = new MutationObserver(g);
    return S.observe(document.body, { subtree: !0, childList: !0 }), () => {
      S.disconnect(), o.current?.removeEventListener("click", f, !0), o.current = null;
    };
  }, []), w(() => {
    const l = () => {
      const g = o.current;
      g && (g.classList.contains("agy-native-usage") || g.classList.add("agy-native-usage"), g.classList.contains("agy-usage-disabled") === e.enabled && g.classList.toggle("agy-usage-disabled", !e.enabled), g.style.setProperty("--agy-used", String(i ?? 0)), g.style.setProperty("--agy-color", i === void 0 ? "var(--nim-border)" : F(i)), g.setAttribute("data-usage-label", i === void 0 ? e.loading || e.waiting ? "…" : "?" : `${Math.round(i)}%`), g.setAttribute("aria-haspopup", "dialog"), g.setAttribute("aria-expanded", String(t)), g.title = c ? `${c.name}: ${c.buckets.map((S) => `${S.window} ${Math.round(S.usedPercent)}% used`).join(", ")}${e.waiting ? " · refresh queued" : e.error ? " · update failed" : ""}` : e.waiting ? e.notice : "Antigravity account usage");
    };
    l();
    const f = new MutationObserver(l);
    return f.observe(document.body, { subtree: !0, childList: !0, attributes: !0, attributeFilter: ["class"] }), () => f.disconnect();
  }, [e, i, c, t]), w(() => () => {
    const l = document.querySelector(".agy-native-usage");
    l && (l.classList.remove("agy-native-usage", "agy-usage-disabled"), l.style.removeProperty("--agy-used"), l.style.removeProperty("--agy-color"), l.removeAttribute("data-usage-label"), l.removeAttribute("aria-haspopup"), l.removeAttribute("aria-expanded"), l.title = "Gemini Usage");
  }, []), w(() => {
    if (!t) return;
    const l = (g) => {
      !a.current?.contains(g.target) && !o.current?.contains(g.target) && r(!1);
    }, f = (g) => {
      g.key === "Escape" && r(!1);
    };
    return document.addEventListener("pointerdown", l), document.addEventListener("keydown", f), () => {
      document.removeEventListener("pointerdown", l), document.removeEventListener("keydown", f);
    };
  }, [t]), /* @__PURE__ */ u(ee, { children: [
    /* @__PURE__ */ n("style", { children: ".agy-native-usage {position:relative!important}.agy-native-usage > * {visibility:hidden}.agy-native-usage::before {content:'';position:absolute;width:30px;height:30px;left:50%;top:50%;transform:translate(-50%,-50%);border-radius:50%;background:conic-gradient(var(--agy-color) calc(var(--agy-used)*1%),var(--nim-border,#45454b) 0);mask:radial-gradient(farthest-side,transparent calc(100% - 2.5px),#000 0)}.agy-native-usage::after {content:attr(data-usage-label);position:absolute;inset:0;display:grid;place-items:center;font-size:10px;font-weight:600;color:var(--nim-text)}.agy-usage-disabled {display:none!important}" }),
    t && e.enabled && /* @__PURE__ */ n("div", { ref: a, role: "dialog", "aria-label": "Antigravity account usage", style: { position: "fixed", ...d, width: 288, maxHeight: `calc(100vh - ${d.bottom + 12}px)`, overflowY: "auto", zIndex: 1e4, border: "1px solid var(--nim-border)", borderRadius: 12, background: "var(--nim-bg-secondary, #242424)", boxShadow: "0 10px 35px #0006" }, children: /* @__PURE__ */ n(Y, { onClose: () => r(!1) }) })
  ] });
}
function ce(e) {
  return /* @__PURE__ */ n(Y, {});
}
function ue() {
  const e = _();
  return /* @__PURE__ */ u("label", { children: [
    /* @__PURE__ */ n("input", { type: "checkbox", checked: e.enabled, onChange: (t) => {
      J(t.target.checked);
    } }),
    " Show account usage indicator (refreshes every 5 minutes)"
  ] });
}
let N, q, G;
function pe(e) {
  N = e, q?.(), q = ne(), G?.(), G = oe(e), e.services.ui?.showInfo("Antigravity CLI extension loaded. Use the Antigravity CLI model group to start a session.");
}
function he() {
  N = void 0, G?.(), G = void 0, q?.(), q = void 0;
}
function ge({ storage: e, callBackendTool: t, config: r, availableModels: d, onEnableBackendModule: m }) {
  const [a, o] = v(() => B(e?.get("settings") ?? D)), [c, i] = v(!1), [l, f] = v("The CLI uses your existing agy login. Default mode is Normal (Accept Edits)."), [g, S] = v(() => d ?? []), [y, k] = v(""), T = t ?? ((s, E) => N?.services.ai?.callBackendTool(s, E)), z = (s, E) => o((p) => ({ ...p, [s]: E })), L = async (s, E = {}) => {
    i(!0);
    try {
      if (!T) throw new Error("Backend tool bridge is unavailable in this Nimbalyst version.");
      const p = M(await T(`antigravity-cli.${s}`, E));
      if (p.ok === !1) throw new Error(b(p.error) || "CLI connection failed.");
      return p.settings && o(B(p.settings)), p.permissions && k(JSON.stringify(p.permissions, null, 2)), Array.isArray(p.models) && S(p.models.map(M).map((O) => ({ id: b(O.id), name: b(O.name) }))), f(b(p.message) || (s === "status" ? `Connected to agy ${b(p.version)}.` : "Settings saved.")), p;
    } catch (p) {
      return f(p.message + " If the backend is not active, start one Antigravity CLI session and approve Nimbalyst’s native-code consent first."), null;
    } finally {
      i(!1);
    }
  }, X = async () => {
    await L("configure", { ...a }) && await e?.set("settings", a);
  };
  w(() => {
    (!e || t || N?.services.ai) && L("status");
  }, []);
  const Z = { display: "flex", flexDirection: "column", gap: 14, maxWidth: 680, color: "var(--nim-text)", padding: 16 }, P = { padding: 8, color: "var(--nim-text)", background: "var(--nim-bg-secondary)", border: "1px solid var(--nim-border)", borderRadius: 5 };
  return /* @__PURE__ */ u("div", { style: Z, children: [
    /* @__PURE__ */ n("h3", { style: { margin: 0 }, children: "Antigravity CLI" }),
    r?.backendModuleEnabled === !1 && m && /* @__PURE__ */ u("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--nim-bg-secondary)", border: "1px solid var(--nim-border)", borderRadius: 5, padding: 10 }, children: [
      /* @__PURE__ */ n("span", { children: "Backend module is not enabled. Grant permission to run Antigravity CLI." }),
      /* @__PURE__ */ n("button", { onClick: () => {
        m();
      }, children: "Enable Backend Module" })
    ] }),
    /* @__PURE__ */ n(ue, {}),
    /* @__PURE__ */ n("p", { style: { margin: 0 }, children: "Run your signed-in CLI with its own tools and skills." }),
    /* @__PURE__ */ u("label", { children: [
      "CLI executable (blank uses the standard installation)",
      /* @__PURE__ */ n("input", { style: { ...P, display: "block", width: "100%", boxSizing: "border-box" }, value: a.cliPath, onChange: (s) => z("cliPath", s.target.value), placeholder: "agy" })
    ] }),
    /* @__PURE__ */ u("label", { children: [
      "Execution mode ",
      /* @__PURE__ */ u("select", { style: P, value: a.mode, onChange: (s) => z("mode", s.target.value === "plan" ? "plan" : "accept-edits"), children: [
        /* @__PURE__ */ n("option", { value: "accept-edits", children: "Normal (Accept Edits)" }),
        /* @__PURE__ */ n("option", { value: "plan", children: "Plan" })
      ] })
    ] }),
    /* @__PURE__ */ u("label", { children: [
      /* @__PURE__ */ n("input", { type: "checkbox", checked: a.turbo, onChange: (s) => z("turbo", s.target.checked) }),
      " Turbo mode — automatically approve all CLI tools"
    ] }),
    /* @__PURE__ */ u("label", { children: [
      "Reasoning effort ",
      /* @__PURE__ */ n("select", { style: P, value: a.effort, onChange: (s) => o(B({ ...a, effort: s.target.value })), children: ["default", "low", "medium", "high", "xhigh", "max"].map((s) => /* @__PURE__ */ n("option", { children: s }, s)) })
    ] }),
    /* @__PURE__ */ u("label", { children: [
      /* @__PURE__ */ n("input", { type: "checkbox", checked: a.mcp, onChange: (s) => z("mcp", s.target.checked) }),
      " Connect Nimbalyst tools through workspace MCP"
    ] }),
    /* @__PURE__ */ u("label", { children: [
      "Turn timeout (seconds) ",
      /* @__PURE__ */ n("input", { type: "number", min: 30, max: 3600, style: P, value: a.timeoutSeconds, onChange: (s) => z("timeoutSeconds", Number(s.target.value)) })
    ] }),
    /* @__PURE__ */ u("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" }, children: [
      /* @__PURE__ */ n("button", { disabled: c, onClick: () => {
        X();
      }, children: "Save" }),
      /* @__PURE__ */ n("button", { disabled: c, onClick: () => {
        L("status");
      }, children: "Check connection" }),
      /* @__PURE__ */ n("button", { disabled: c, onClick: () => {
        L("refresh_models");
      }, children: "Refresh models" })
    ] }),
    /* @__PURE__ */ n("p", { style: { margin: 0 }, role: "status", children: c ? "Checking…" : l }),
    g.length > 0 && /* @__PURE__ */ n("ul", { children: g.map((s) => /* @__PURE__ */ n("li", { children: s.name }, s.id)) }),
    /* @__PURE__ */ u("details", { children: [
      /* @__PURE__ */ n("summary", { children: "CLI permission rules (global)" }),
      /* @__PURE__ */ n("p", { children: "Read existing rules before editing. Changes affect all Antigravity CLI projects; a backup is saved. Deny and Ask rules take precedence over Allow." }),
      /* @__PURE__ */ n("button", { disabled: c, onClick: () => {
        L("permissions");
      }, children: "Read rules" }),
      /* @__PURE__ */ n("textarea", { style: { ...P, display: "block", width: "100%", minHeight: 160, boxSizing: "border-box", fontFamily: "monospace" }, value: y, onChange: (s) => k(s.target.value), placeholder: '{"allow":[],"deny":[],"ask":[]}' }),
      /* @__PURE__ */ n("button", { disabled: c || !y, onClick: () => {
        try {
          L("configure_permissions", M(JSON.parse(y)));
        } catch (s) {
          f(s.message);
        }
      }, children: "Save global CLI rules" }),
      /* @__PURE__ */ n("p", { children: "Examples: read_url(antigravity.google), command(git status), mcp(nimbalyst-antigravity-cli/get_session_summary)." })
    ] }),
    /* @__PURE__ */ n("small", { children: a.turbo ? "Turbo is on: CLI tool permission checks are skipped, including commands and file changes. Turn off Turbo and Save to use CLI permission rules." : "Turbo is off: CLI permission rules apply. Tools requiring interactive approval are denied in headless mode." })
  ] });
}
const ye = { AntigravitySettings: ge }, ve = {}, be = { "account-usage": { component: ce } }, we = { UsageHost: de };
export {
  ge as AntigravitySettings,
  pe as activate,
  ve as components,
  he as deactivate,
  we as hostComponents,
  be as panels,
  ye as settingsPanel
};
//# sourceMappingURL=index.js.map
