import { app as ut } from "../../../scripts/app.js";
import { ComponentWidgetImpl as ft, addWidget as ht } from "../../../scripts/domWidget.js";
import { defineComponent as Z, ref as P, resolveDirective as gt, createElementBlock as J, openBlock as j, Fragment as rt, createElementVNode as W, withDirectives as yt, createVNode as Q, createBlock as at, unref as B, normalizeClass as st, withCtx as tt, createTextVNode as ot, toDisplayString as q, renderList as vt, normalizeStyle as mt, onMounted as lt, nextTick as wt } from "vue";
import et from "primevue/button";
import { useI18n as nt } from "vue-i18n";
const dt = { class: "toolbar" }, bt = { class: "color-picker" }, xt = { class: "size-slider" }, zt = ["value"], St = /* @__PURE__ */ Z({
  __name: "ToolBar",
  props: {
    colors: {},
    initialColor: {},
    initialBrushSize: {},
    initialTool: {}
  },
  emits: ["tool-change", "color-change", "canvas-clear", "brush-size-change"],
  setup(c, { emit: k }) {
    const { t: p } = nt(), x = c, M = k, V = x.colors || ["#000000", "#ff0000", "#0000ff", "#69a869", "#ffff00", "#ff00ff", "#00ffff"], L = P(x.initialColor || "#000000"), O = P(x.initialBrushSize || 5), A = P(x.initialTool || "pen");
    function C(N) {
      A.value = N, M("tool-change", N);
    }
    function D(N) {
      L.value = N, M("color-change", N);
    }
    function X() {
      M("canvas-clear");
    }
    function f(N) {
      const Y = N.target;
      O.value = Number(Y.value), M("brush-size-change", O.value);
    }
    return (N, Y) => {
      const G = gt("tooltip");
      return j(), J(rt, null, [
        W("div", dt, [
          yt((j(), at(B(et), {
            class: st({ active: A.value === "pen" }),
            onClick: Y[0] || (Y[0] = (S) => C("pen"))
          }, {
            default: tt(() => [
              ot(q(B(p)("vue-basic.pen")), 1)
            ]),
            _: 1
          }, 8, ["class"])), [
            [G, { value: B(p)("vue-basic.pen-tooltip"), showDelay: 300 }]
          ]),
          Q(B(et), { onClick: X }, {
            default: tt(() => [
              ot(q(B(p)("vue-basic.clear-canvas")), 1)
            ]),
            _: 1
          })
        ]),
        W("div", bt, [
          (j(!0), J(rt, null, vt(B(V), (S, T) => (j(), at(B(et), {
            key: T,
            class: st({ "color-button": !0, active: L.value === S }),
            onClick: (K) => D(S),
            type: "button",
            title: S
          }, {
            default: tt(() => [
              W("i", {
                class: "pi pi-circle-fill",
                style: mt({ color: S })
              }, null, 4)
            ]),
            _: 2
          }, 1032, ["class", "onClick", "title"]))), 128))
        ]),
        W("div", xt, [
          W("label", null, q(B(p)("vue-basic.brush-size")) + ": " + q(O.value) + "px", 1),
          W("input", {
            type: "range",
            min: "1",
            max: "50",
            value: O.value,
            onChange: Y[1] || (Y[1] = (S) => f(S))
          }, null, 40, zt)
        ])
      ], 64);
    };
  }
}), it = (c, k) => {
  const p = c.__vccOpts || c;
  for (const [x, M] of k)
    p[x] = M;
  return p;
}, Ct = /* @__PURE__ */ it(St, [["__scopeId", "data-v-cae98791"]]), At = { class: "drawing-board" }, _t = { class: "canvas-container" }, $t = ["width", "height"], Et = /* @__PURE__ */ Z({
  __name: "DrawingBoard",
  props: {
    width: {},
    height: {},
    initialColor: {},
    initialBrushSize: {}
  },
  emits: ["mounted", "drawing-start", "drawing", "drawing-end", "state-save", "canvas-clear"],
  setup(c, { expose: k, emit: p }) {
    const x = c, M = x.width || 800, V = x.height || 500, L = x.initialColor || "#000000", O = x.initialBrushSize || 5, A = p, C = P(!1), D = P(0), X = P(0), f = P(null), N = P(!1), Y = P(O), G = P(L), S = P(null), T = P(null);
    lt(() => {
      T.value && (f.value = T.value.getContext("2d"), K(), wt(() => {
        T.value && A("mounted", T.value);
      }));
    });
    function K() {
      f.value && (f.value.fillStyle = "#ffffff", f.value.fillRect(0, 0, M, V), l(), d());
    }
    function l() {
      f.value && (N.value ? (f.value.globalCompositeOperation = "destination-out", f.value.strokeStyle = "rgba(0,0,0,1)") : (f.value.globalCompositeOperation = "source-over", f.value.strokeStyle = G.value), f.value.lineWidth = Y.value, f.value.lineJoin = "round", f.value.lineCap = "round");
    }
    function i(v) {
      C.value = !0;
      const { offsetX: $, offsetY: e } = h(v);
      D.value = $, X.value = e, f.value && (f.value.beginPath(), f.value.moveTo(D.value, X.value), f.value.arc(D.value, X.value, Y.value / 2, 0, Math.PI * 2), f.value.fill(), A("drawing-start", {
        x: $,
        y: e,
        tool: N.value ? "eraser" : "pen"
      }));
    }
    function r(v) {
      if (!C.value || !f.value) return;
      const { offsetX: $, offsetY: e } = h(v);
      f.value.beginPath(), f.value.moveTo(D.value, X.value), f.value.lineTo($, e), f.value.stroke(), D.value = $, X.value = e, A("drawing", {
        x: $,
        y: e,
        tool: N.value ? "eraser" : "pen"
      });
    }
    function a() {
      C.value && (C.value = !1, d(), A("drawing-end"));
    }
    function h(v) {
      let $ = 0, e = 0;
      if ("touches" in v) {
        if (v.preventDefault(), T.value) {
          const y = T.value.getBoundingClientRect();
          $ = v.touches[0].clientX - y.left, e = v.touches[0].clientY - y.top;
        }
      } else
        $ = v.offsetX, e = v.offsetY;
      return { offsetX: $, offsetY: e };
    }
    function o(v) {
      v.preventDefault();
      const e = {
        touches: [v.touches[0]]
      };
      i(e);
    }
    function w(v) {
      if (v.preventDefault(), !C.value) return;
      const e = {
        touches: [v.touches[0]]
      };
      r(e);
    }
    function _(v) {
      N.value = v === "eraser", l();
    }
    function u(v) {
      G.value = v, l();
    }
    function z(v) {
      Y.value = v, l();
    }
    function m() {
      f.value && (f.value.fillStyle = "#ffffff", f.value.fillRect(0, 0, M, V), l(), d(), A("canvas-clear"));
    }
    function d() {
      T.value && (S.value = T.value.toDataURL("image/png"), S.value && A("state-save", S.value));
    }
    async function I() {
      if (!T.value)
        throw new Error("Canvas is unable to get current data");
      return S.value ? S.value : T.value.toDataURL("image/png");
    }
    return k({
      setTool: _,
      setColor: u,
      setBrushSize: z,
      clearCanvas: m,
      getCurrentCanvasData: I
    }), (v, $) => (j(), J("div", At, [
      W("div", _t, [
        W("canvas", {
          ref_key: "canvas",
          ref: T,
          width: B(M),
          height: B(V),
          onMousedown: i,
          onMousemove: r,
          onMouseup: a,
          onMouseleave: a,
          onTouchstart: o,
          onTouchmove: w,
          onTouchend: a
        }, null, 40, $t)
      ])
    ]));
  }
}), kt = /* @__PURE__ */ it(Et, [["__scopeId", "data-v-ca1239fc"]]), Dt = { class: "drawing-app" }, Nt = /* @__PURE__ */ Z({
  __name: "DrawingApp",
  props: {
    width: {},
    height: {},
    initialColor: {},
    initialBrushSize: {},
    availableColors: {}
  },
  emits: ["tool-change", "color-change", "brush-size-change", "drawing-start", "drawing", "drawing-end", "state-save", "mounted"],
  setup(c, { expose: k, emit: p }) {
    const x = c, M = x.width || 800, V = x.height || 500, L = x.initialColor || "#000000", O = x.initialBrushSize || 5, A = x.availableColors || ["#000000", "#ff0000", "#0000ff", "#00ff00", "#ffff00", "#ff00ff", "#00ffff"], C = p, D = P(null), X = P(null);
    function f(a) {
      var h;
      (h = D.value) == null || h.setTool(a), C("tool-change", a);
    }
    function N(a) {
      var h;
      (h = D.value) == null || h.setColor(a), C("color-change", a);
    }
    function Y(a) {
      var h;
      (h = D.value) == null || h.setBrushSize(a), C("brush-size-change", a);
    }
    function G() {
      var a;
      (a = D.value) == null || a.clearCanvas();
    }
    function S(a) {
      C("drawing-start", a);
    }
    function T(a) {
      C("drawing", a);
    }
    function K() {
      C("drawing-end");
    }
    function l(a) {
      X.value = a, C("state-save", a);
    }
    function i(a) {
      C("mounted", a);
    }
    async function r() {
      if (X.value)
        return X.value;
      if (D.value)
        try {
          return await D.value.getCurrentCanvasData();
        } catch (a) {
          throw console.error("unable to get canvas data:", a), new Error("unable to get canvas data");
        }
      throw new Error("get canvas data failed");
    }
    return k({
      getCanvasData: r
    }), (a, h) => (j(), J("div", Dt, [
      Q(Ct, {
        colors: B(A),
        initialColor: B(L),
        initialBrushSize: B(O),
        onToolChange: f,
        onColorChange: N,
        onBrushSizeChange: Y,
        onCanvasClear: G
      }, null, 8, ["colors", "initialColor", "initialBrushSize"]),
      Q(kt, {
        ref_key: "drawingBoard",
        ref: D,
        width: B(M),
        height: B(V),
        initialColor: B(L),
        initialBrushSize: B(O),
        onDrawingStart: S,
        onDrawing: T,
        onDrawingEnd: K,
        onStateSave: l,
        onMounted: i
      }, null, 8, ["width", "height", "initialColor", "initialBrushSize"])
    ]));
  }
}), Tt = /* @__PURE__ */ it(Nt, [["__scopeId", "data-v-39bbf58b"]]), Bt = /* @__PURE__ */ Z({
  __name: "VueExampleComponent",
  props: {
    widget: {}
  },
  setup(c) {
    const { t: k } = nt(), p = P(null), x = P(null);
    c.widget.node;
    function M(L) {
      x.value = L, console.log("canvas state saved:", L.substring(0, 50) + "...");
    }
    async function V(L, O) {
      var A;
      try {
        if (!((A = window.app) != null && A.api))
          throw new Error("ComfyUI API not available");
        const C = await fetch(L).then((Y) => Y.blob()), D = `${O}_${Date.now()}.png`, X = new File([C], D), f = new FormData();
        return f.append("image", X), f.append("subfolder", "threed"), f.append("type", "temp"), console.log("Vue Component: Using window.app.api.fetchApi"), (await window.app.api.fetchApi("/upload/image", {
          method: "POST",
          body: f
        })).json();
      } catch (C) {
        throw console.error("Vue Component: Error uploading image:", C), C;
      }
    }
    return lt(() => {
      c.widget.serializeValue = async (L, O) => {
        try {
          console.log("Vue Component: inside vue serializeValue"), console.log("node", L), console.log("index", O);
          const A = x.value;
          return A ? {
            image: `threed/${(await V(A, "test_vue_basic")).name} [temp]`
          } : (console.warn("Vue Component: No canvas data available"), { image: null });
        } catch (A) {
          return console.error("Vue Component: Error in serializeValue:", A), { image: null };
        }
      };
    }), (L, O) => (j(), J("div", null, [
      W("h1", null, q(B(k)("vue-basic.title")), 1),
      W("div", null, [
        Q(Tt, {
          ref_key: "drawingAppRef",
          ref: p,
          width: 300,
          height: 300,
          onStateSave: M
        }, null, 512)
      ])
    ]));
  }
}), ct = ut;
ct.registerExtension({
  name: "vue-basic",
  getCustomWidgets(c) {
    return {
      CUSTOM_VUE_COMPONENT_BASIC(k) {
        const p = {
          name: "custom_vue_component_basic",
          type: "vue-basic"
        }, x = new ft({
          node: k,
          name: p.name,
          component: Bt,
          inputSpec: p,
          options: {}
        });
        return ht(k, x), { widget: x };
      }
    };
  },
  nodeCreated(c) {
    if (c.constructor.comfyClass !== "vue-basic") return;
    const [k, p] = c.size;
    c.setSize([Math.max(k, 300), Math.max(p, 520)]);
  }
});
ct.registerExtension({
  name: "housekeeper-alignment",
  async setup() {
    console.log("Housekeeper: Setting up node alignment panel");
    try {
      console.log("Housekeeper: Creating alignment panel..."), Lt(), console.log("Housekeeper: Node alignment panel initialized successfully");
    } catch (c) {
      console.error("Housekeeper: Error setting up alignment panel:", c);
    }
  },
  nodeCreated(c) {
    c.constructor.comfyClass === "housekeeper-alignment" && (c.setSize([200, 100]), c.title && (c.title = "🎯 Alignment Panel Active"));
  }
});
function Lt() {
  let c = null, k = !1, p = [];
  function x(l, i = !1) {
    const r = document.createElement("button");
    r.innerHTML = `
            <span style="font-size: 16px; display: block;">${l.icon}</span>
            <span style="font-size: 11px;">${l.label}</span>
        `;
    const a = i ? "#4a5568" : "#505050", h = i ? "#5a6578" : "#606060";
    return r.style.cssText = `
            background: linear-gradient(145deg, ${a}, #404040);
            border: 1px solid ${i ? "#718096" : "#666"};
            border-radius: 6px;
            color: white;
            padding: 12px 8px;
            cursor: pointer;
            font-family: inherit;
            transition: all 0.2s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 4px;
            min-height: 44px;
        `, r.addEventListener("mouseenter", () => {
      r.style.background = `linear-gradient(145deg, ${h}, #505050)`, r.style.transform = "translateY(-1px)", r.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    }), r.addEventListener("mouseleave", () => {
      r.style.background = `linear-gradient(145deg, ${a}, #404040)`, r.style.transform = "translateY(0)", r.style.boxShadow = "none";
    }), r.addEventListener("click", () => f(l.type)), r;
  }
  function M() {
    c = document.createElement("div"), c.className = "housekeeper-alignment-panel", c.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(40, 40, 40, 0.95);
            border: 1px solid #555;
            border-radius: 8px;
            padding: 12px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            min-width: 220px;
            backdrop-filter: blur(10px);
            opacity: 0;
            transform: translateX(20px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: none;
            font-family: Arial, sans-serif;
            color: white;
        `;
    const l = document.createElement("div");
    l.innerHTML = "🎯 Node Alignment", l.style.cssText = `
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 12px;
            text-align: center;
            border-bottom: 1px solid #555;
            padding-bottom: 8px;
        `, c.appendChild(l);
    const i = document.createElement("div");
    i.style.cssText = `
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-bottom: 8px;
        `;
    const r = document.createElement("div");
    r.style.cssText = `
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-bottom: 12px;
            border-top: 1px solid #555;
            padding-top: 8px;
        `;
    const a = [
      { type: "left", icon: "⇤", label: "Left" },
      { type: "right", icon: "⇥", label: "Right" },
      { type: "top", icon: "⇡", label: "Top" },
      { type: "bottom", icon: "⇣", label: "Bottom" },
      { type: "horizontal-flow", icon: "→", label: "H-Flow" },
      { type: "vertical-flow", icon: "↓", label: "V-Flow" }
    ], h = a.slice(0, 4), o = a.slice(4);
    h.forEach((_) => {
      const u = x(_);
      i.appendChild(u);
    }), o.forEach((_) => {
      const u = x(_, !0);
      r.appendChild(u);
    }), c.appendChild(i), c.appendChild(r);
    const w = document.createElement("div");
    w.id = "alignment-info", w.style.cssText = `
            background: rgba(60, 60, 60, 0.8);
            border-radius: 6px;
            padding: 10px;
            font-size: 12px;
            text-align: center;
        `, w.innerHTML = `
            Select multiple nodes to enable alignment<br>
            <small style="opacity: 0.8;">
                Basic: Ctrl+Shift+Arrows<br>
                Flow: Ctrl+Alt+→/↓
            </small>
        `, c.appendChild(w), document.body.appendChild(c);
  }
  function V() {
    var h;
    if (!((h = window.app) != null && h.graph)) return;
    p = Object.values(window.app.graph._nodes || {}).filter((o) => o && o.is_selected);
    const i = p.length > 1;
    i && !k ? L() : !i && k && O();
    const r = document.getElementById("alignment-info");
    r && (p.length === 0 ? r.innerHTML = `
                    Select multiple nodes to enable alignment<br>
                    <small style="opacity: 0.8;">
                        Basic: Ctrl+Shift+Arrows<br>
                        Flow: Ctrl+Alt+→/↓
                    </small>
                ` : p.length === 1 ? r.textContent = "Select additional nodes to align" : r.innerHTML = `
                    ${p.length} nodes selected - ready to align<br>
                    <small style="opacity: 0.8;">Try H-Flow/V-Flow for smart layout</small>
                `);
    const a = c == null ? void 0 : c.querySelectorAll("button");
    a == null || a.forEach((o) => {
      i ? (o.style.opacity = "1", o.style.pointerEvents = "auto") : (o.style.opacity = "0.5", o.style.pointerEvents = "none");
    });
  }
  function L() {
    c && (k = !0, c.style.display = "block", setTimeout(() => {
      c && (c.style.opacity = "1", c.style.transform = "translateX(0)");
    }, 10));
  }
  function O() {
    c && (k = !1, c.style.opacity = "0", c.style.transform = "translateX(20px)", setTimeout(() => {
      c && (c.style.display = "none");
    }, 300));
  }
  function A(l) {
    const i = {}, r = l.filter((a) => a && (a.id !== void 0 || a.id !== null));
    return r.forEach((a) => {
      const h = a.id || `node_${r.indexOf(a)}`;
      a.id = h, i[h] = { inputs: [], outputs: [] }, a.inputs && Array.isArray(a.inputs) && a.inputs.forEach((o, w) => {
        o && o.link !== null && o.link !== void 0 && i[h].inputs.push({
          index: w,
          link: o.link,
          sourceNode: C(o.link, r)
        });
      }), a.outputs && Array.isArray(a.outputs) && a.outputs.forEach((o, w) => {
        o && o.links && Array.isArray(o.links) && o.links.length > 0 && o.links.forEach((_) => {
          const u = D(_, r);
          u && i[h].outputs.push({
            index: w,
            link: _,
            targetNode: u
          });
        });
      });
    }), i;
  }
  function C(l, i) {
    for (const r of i)
      if (r && r.outputs && Array.isArray(r.outputs)) {
        for (const a of r.outputs)
          if (a && a.links && Array.isArray(a.links) && a.links.includes(l))
            return r;
      }
    return null;
  }
  function D(l, i) {
    for (const r of i)
      if (r && r.inputs && Array.isArray(r.inputs)) {
        for (const a of r.inputs)
          if (a && a.link === l)
            return r;
      }
    return null;
  }
  function X(l, i) {
    const r = {}, a = /* @__PURE__ */ new Set(), h = l.filter((u) => u && u.id), o = h.filter((u) => {
      const z = u.id;
      return !i[z] || !i[z].inputs.length || i[z].inputs.every((m) => !m.sourceNode);
    });
    o.length === 0 && h.length > 0 && o.push(h[0]);
    const w = o.map((u) => ({ node: u, level: 0 }));
    for (; w.length > 0; ) {
      const { node: u, level: z } = w.shift();
      !u || !u.id || a.has(u.id) || (a.add(u.id), r[u.id] = { level: z, order: 0 }, i[u.id] && i[u.id].outputs && i[u.id].outputs.forEach((m) => {
        m && m.targetNode && m.targetNode.id && !a.has(m.targetNode.id) && w.push({ node: m.targetNode, level: z + 1 });
      }));
    }
    h.forEach((u) => {
      u && u.id && !r[u.id] && (r[u.id] = { level: 0, order: 0 });
    });
    const _ = {};
    return Object.entries(r).forEach(([u, z]) => {
      _[z.level] || (_[z.level] = []);
      const m = h.find((d) => d && d.id === u);
      m && _[z.level].push(m);
    }), Object.entries(_).forEach(([u, z]) => {
      z && z.length > 0 && (z.sort((m, d) => {
        const I = m && m.pos && m.pos[1] ? m.pos[1] : 0, v = d && d.pos && d.pos[1] ? d.pos[1] : 0;
        return I - v;
      }), z.forEach((m, d) => {
        m && m.id && r[m.id] && (r[m.id].order = d);
      }));
    }), r;
  }
  function f(l) {
    var i, r, a, h, o;
    if (p.length < 2) {
      S("Please select at least 2 nodes to align", "warning");
      return;
    }
    try {
      let w;
      switch (l) {
        case "left":
          w = Math.min(...p.map((e) => e.pos[0]));
          const _ = [...p].sort((e, y) => e.pos[1] - y.pos[1]);
          let u = _[0].pos[1];
          _.forEach((e, y) => {
            let n = 100;
            e.size && Array.isArray(e.size) && e.size[1] ? n = e.size[1] : typeof e.height == "number" ? n = e.height : e.properties && typeof e.properties.height == "number" && (n = e.properties.height), console.log(`Left align - Node ${e.id || y}: height=${n}, currentY=${u}`), e.pos[0] = w, e.pos[1] = u, typeof e.x == "number" && (e.x = e.pos[0]), typeof e.y == "number" && (e.y = e.pos[1]), u += n + 30, console.log(`  Next Y will be: ${u}`);
          });
          break;
        case "right":
          w = Math.max(...p.map((e) => e.pos[0] + e.size[0]));
          const z = [...p].sort((e, y) => e.pos[1] - y.pos[1]);
          let m = z[0].pos[1];
          z.forEach((e, y) => {
            let n = 100, g = 150;
            e.size && Array.isArray(e.size) ? (e.size[1] && (n = e.size[1]), e.size[0] && (g = e.size[0])) : (typeof e.height == "number" && (n = e.height), typeof e.width == "number" && (g = e.width), e.properties && (typeof e.properties.height == "number" && (n = e.properties.height), typeof e.properties.width == "number" && (g = e.properties.width))), console.log(`Right align - Node ${e.id || y}: height=${n}, width=${g}, currentY=${m}`), e.pos[0] = w - g, e.pos[1] = m, typeof e.x == "number" && (e.x = e.pos[0]), typeof e.y == "number" && (e.y = e.pos[1]), m += n + 30, console.log(`  Next Y will be: ${m}`);
          });
          break;
        case "top":
          w = Math.min(...p.map((e) => e.pos[1]));
          const d = [...p].sort((e, y) => e.pos[0] - y.pos[0]);
          let I = d[0].pos[0];
          d.forEach((e, y) => {
            let n = 150;
            e.size && Array.isArray(e.size) && e.size[0] ? n = e.size[0] : typeof e.width == "number" ? n = e.width : e.properties && typeof e.properties.width == "number" && (n = e.properties.width), console.log(`Top align - Node ${e.id || y}: width=${n}, currentX=${I}`), e.pos[1] = w, e.pos[0] = I, typeof e.x == "number" && (e.x = e.pos[0]), typeof e.y == "number" && (e.y = e.pos[1]), I += n + 30, console.log(`  Next X will be: ${I}`);
          });
          break;
        case "bottom":
          w = Math.max(...p.map((e) => e.pos[1] + e.size[1]));
          const v = [...p].sort((e, y) => e.pos[0] - y.pos[0]);
          let $ = v[0].pos[0];
          v.forEach((e, y) => {
            let n = 150, g = 100;
            e.size && Array.isArray(e.size) ? (e.size[0] && (n = e.size[0]), e.size[1] && (g = e.size[1])) : (typeof e.width == "number" && (n = e.width), typeof e.height == "number" && (g = e.height), e.properties && (typeof e.properties.width == "number" && (n = e.properties.width), typeof e.properties.height == "number" && (g = e.properties.height))), console.log(`Bottom align - Node ${e.id || y}: height=${g}, width=${n}, currentX=${$}`), e.pos[1] = w - g, e.pos[0] = $, typeof e.x == "number" && (e.x = e.pos[0]), typeof e.y == "number" && (e.y = e.pos[1]), $ += n + 30, console.log(`  Next X will be: ${$}`);
          });
          break;
        case "horizontal-flow":
          Y();
          return;
        // Don't continue to the success message at the bottom
        case "vertical-flow":
          G();
          return;
      }
      try {
        (r = (i = window.app) == null ? void 0 : i.canvas) != null && r.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (h = (a = window.app) == null ? void 0 : a.graph) != null && h.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (o = window.app) != null && o.canvas && window.app.canvas.draw(!0, !0);
      } catch (_) {
        console.warn("Could not trigger canvas redraw:", _);
      }
      S(`Aligned ${p.length} nodes to ${l}`, "success");
    } catch (w) {
      console.error("Alignment error:", w), S("Error during alignment", "error");
    }
  }
  function N(l) {
    console.log("🔍 Debug: Node structure analysis"), console.log("Total selected nodes:", l.length), l.forEach((i, r) => {
      console.log(`Node ${r}:`, {
        hasNode: !!i,
        id: i == null ? void 0 : i.id,
        hasPos: !!(i != null && i.pos),
        posType: Array.isArray(i == null ? void 0 : i.pos) ? "array" : typeof (i == null ? void 0 : i.pos),
        posValue: i == null ? void 0 : i.pos,
        hasSize: !!(i != null && i.size),
        sizeType: Array.isArray(i == null ? void 0 : i.size) ? "array" : typeof (i == null ? void 0 : i.size),
        sizeValue: i == null ? void 0 : i.size,
        keys: i ? Object.keys(i) : "null"
      });
    });
  }
  function Y() {
    var l, i, r, a, h;
    try {
      console.log("🎯 Starting horizontal flow alignment"), console.log("🔍 Selected nodes positions BEFORE processing:"), p.forEach((t, n) => {
        var g, F;
        console.log(`  Node ${n}: pos=[${(g = t == null ? void 0 : t.pos) == null ? void 0 : g[0]}, ${(F = t == null ? void 0 : t.pos) == null ? void 0 : F[1]}]`);
      }), N(p);
      const o = p.filter((t) => {
        if (!t) return !1;
        const n = t.pos || t.position || typeof t.x == "number" && typeof t.y == "number", g = t.size || t.width || t.height || typeof t.width == "number" && typeof t.height == "number", F = !!n && !!g;
        return F || console.log("❌ Invalid node:", {
          id: t.id,
          hasPos: !!t.pos,
          hasPosition: !!t.position,
          hasXY: typeof t.x == "number" && typeof t.y == "number",
          hasSize: !!t.size,
          hasWH: typeof t.width == "number" && typeof t.height == "number"
        }), F;
      });
      if (console.log(`✅ Valid nodes: ${o.length} out of ${p.length}`), o.length < 2) {
        S(`Not enough valid nodes: ${o.length}/${p.length} nodes are valid`, "warning");
        return;
      }
      const w = Math.min(...o.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[0] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[0] : typeof t.x == "number" ? t.x : 0)), _ = Math.min(...o.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[1] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[1] : typeof t.y == "number" ? t.y : 0)), u = w, z = _;
      console.log("🔍 DEBUG H-FLOW: All selected node X positions:", o.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[0] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[0] : typeof t.x == "number" ? t.x : 0)), console.log("🔍 DEBUG H-FLOW: All selected node Y positions:", o.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[1] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[1] : typeof t.y == "number" ? t.y : 0)), console.log(`📍 H-FLOW Starting position - Top-left corner: X=${u}, Y=${z}`), o.forEach((t) => {
        t.pos || (t.position && Array.isArray(t.position) ? t.pos = t.position : typeof t.x == "number" && typeof t.y == "number" ? t.pos = [t.x, t.y] : t.pos = [0, 0]), t._calculatedSize || (t.size && Array.isArray(t.size) ? t._calculatedSize = [t.size[0], t.size[1]] : typeof t.width == "number" && typeof t.height == "number" ? t._calculatedSize = [t.width, t.height] : t._calculatedSize = [150, 100]), Array.isArray(t.pos) || (t.pos = [0, 0]);
      });
      const m = A(o), d = X(o, m), I = 40, v = 20, $ = 15, e = 5, y = {};
      o.forEach((t) => {
        var n;
        if (t && t.id) {
          const g = ((n = d[t.id]) == null ? void 0 : n.level) ?? 0;
          y[g] || (y[g] = []), y[g].push(t);
        }
      }), console.log("📊 Levels:", Object.keys(y).map((t) => `Level ${t}: ${y[parseInt(t)].length} nodes`)), Object.entries(y).forEach(([t, n]) => {
        const g = parseInt(t);
        if (n && n.length > 0) {
          n.sort((s, b) => {
            const H = s && s.id && d[s.id] ? d[s.id].order : 0, E = b && b.id && d[b.id] ? d[b.id].order : 0;
            return H - E;
          });
          const F = n.reduce((s, b, H) => {
            const E = b && b._calculatedSize && b._calculatedSize[1] ? b._calculatedSize[1] : 100;
            return s + E + (H < n.length - 1 ? $ : 0);
          }, 0), pt = Math.max(...n.map(
            (s) => s && s._calculatedSize && s._calculatedSize[0] ? s._calculatedSize[0] : 150
          ));
          let R = u;
          if (g > 0)
            for (let s = 0; s < g; s++) {
              const b = y[s] || [], H = Math.max(...b.map(
                (E) => E && E._calculatedSize && E._calculatedSize[0] ? E._calculatedSize[0] : 150
              ));
              R += H + I + e;
            }
          let U = z;
          console.log(`📐 Level ${g}: Positioning ${n.length} nodes at X=${R}, starting Y=${U}`), n.forEach((s, b) => {
            if (s && s.pos && s._calculatedSize) {
              const H = [s.pos[0], s.pos[1]], E = [s._calculatedSize[0], s._calculatedSize[1]];
              s.pos[0] = R, s.pos[1] = U, console.log(`  ↻ Node ${s.id || b}: ${H} → [${s.pos[0]}, ${s.pos[1]}] (size: ${E})`), U += s._calculatedSize[1] + $, typeof s.x == "number" && (s.x = s.pos[0]), typeof s.y == "number" && (s.y = s.pos[1]);
            }
          });
        }
      });
      try {
        (i = (l = window.app) == null ? void 0 : l.canvas) != null && i.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (a = (r = window.app) == null ? void 0 : r.graph) != null && a.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (h = window.app) != null && h.canvas && window.app.canvas.draw(!0, !0);
      } catch (t) {
        console.warn("Could not trigger canvas redraw:", t);
      }
      S(`Arranged ${o.length} nodes in horizontal flow`, "success");
    } catch (o) {
      console.error("Horizontal flow alignment error:", o), S("Error in horizontal flow alignment", "error");
    }
  }
  function G() {
    var l, i, r, a, h;
    try {
      console.log("🎯 Starting vertical flow alignment"), console.log("🔍 Selected nodes positions BEFORE processing:"), p.forEach((t, n) => {
        var g, F;
        console.log(`  Node ${n}: pos=[${(g = t == null ? void 0 : t.pos) == null ? void 0 : g[0]}, ${(F = t == null ? void 0 : t.pos) == null ? void 0 : F[1]}]`);
      }), N(p);
      const o = p.filter((t) => {
        if (!t) return !1;
        const n = t.pos || t.position || typeof t.x == "number" && typeof t.y == "number", g = t.size || t.width || t.height || typeof t.width == "number" && typeof t.height == "number";
        return !!n && !!g;
      });
      if (console.log(`✅ Valid nodes: ${o.length} out of ${p.length}`), o.length < 2) {
        S(`Not enough valid nodes: ${o.length}/${p.length} nodes are valid`, "warning");
        return;
      }
      const w = Math.min(...o.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[0] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[0] : typeof t.x == "number" ? t.x : 0)), _ = Math.min(...o.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[1] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[1] : typeof t.y == "number" ? t.y : 0)), u = w, z = _;
      console.log("🔍 DEBUG V-FLOW: All selected node X positions:", o.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[0] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[0] : typeof t.x == "number" ? t.x : 0)), console.log("🔍 DEBUG V-FLOW: All selected node Y positions:", o.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[1] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[1] : typeof t.y == "number" ? t.y : 0)), console.log(`📍 V-FLOW Starting position - Top-left corner: X=${u}, Y=${z}`), o.forEach((t) => {
        t.pos || (t.position && Array.isArray(t.position) ? t.pos = t.position : typeof t.x == "number" && typeof t.y == "number" ? t.pos = [t.x, t.y] : t.pos = [0, 0]), t._calculatedSize || (t.size && Array.isArray(t.size) ? t._calculatedSize = [t.size[0], t.size[1]] : typeof t.width == "number" && typeof t.height == "number" ? t._calculatedSize = [t.width, t.height] : t._calculatedSize = [150, 100]), Array.isArray(t.pos) || (t.pos = [0, 0]);
      });
      const m = A(o), d = X(o, m), I = 50, v = 30, $ = 25, e = 15, y = {};
      o.forEach((t) => {
        var n;
        if (t && t.id) {
          const g = ((n = d[t.id]) == null ? void 0 : n.level) ?? 0;
          y[g] || (y[g] = []), y[g].push(t);
        }
      }), console.log("📊 Levels:", Object.keys(y).map((t) => `Level ${t}: ${y[parseInt(t)].length} nodes`)), Object.entries(y).forEach(([t, n]) => {
        const g = parseInt(t);
        if (n && n.length > 0) {
          n.sort((s, b) => {
            const H = s && s.id && d[s.id] ? d[s.id].order : 0, E = b && b.id && d[b.id] ? d[b.id].order : 0;
            return H - E;
          });
          const F = n.reduce((s, b, H) => {
            const E = b && b._calculatedSize && b._calculatedSize[0] ? b._calculatedSize[0] : 150;
            return s + E + v;
          }, 0), pt = Math.max(...n.map(
            (s) => s && s._calculatedSize && s._calculatedSize[1] ? s._calculatedSize[1] : 100
          ));
          let R = z;
          if (g > 0)
            for (let s = 0; s < g; s++) {
              const b = y[s] || [], H = Math.max(...b.map(
                (E) => E && E._calculatedSize && E._calculatedSize[1] ? E._calculatedSize[1] : 100
              ));
              R += H + I + e;
            }
          let U = u;
          console.log(`📐 Level ${g}: Positioning ${n.length} nodes at Y=${R}, starting X=${U}, total width: ${F}`), n.forEach((s, b) => {
            if (s && s.pos && s._calculatedSize) {
              const H = [s.pos[0], s.pos[1]], E = [s._calculatedSize[0], s._calculatedSize[1]];
              s.pos[0] = U, s.pos[1] = R, console.log(`  ↻ Node ${s.id || b}: ${H} → [${s.pos[0]}, ${s.pos[1]}] (size: ${E})`), U += s._calculatedSize[0] + v, typeof s.x == "number" && (s.x = s.pos[0]), typeof s.y == "number" && (s.y = s.pos[1]);
            }
          });
        }
      });
      try {
        (i = (l = window.app) == null ? void 0 : l.canvas) != null && i.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (a = (r = window.app) == null ? void 0 : r.graph) != null && a.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (h = window.app) != null && h.canvas && window.app.canvas.draw(!0, !0);
      } catch (t) {
        console.warn("Could not trigger canvas redraw:", t);
      }
      S(`Arranged ${o.length} nodes in vertical flow`, "success");
    } catch (o) {
      console.error("Vertical flow alignment error:", o), S("Error in vertical flow alignment", "error");
    }
  }
  function S(l, i = "info") {
    const r = document.createElement("div");
    r.textContent = l, r.style.cssText = `
            position: fixed;
            top: 60px;
            right: 10px;
            background: ${i === "success" ? "#4CAF50" : i === "warning" ? "#FF9800" : i === "error" ? "#F44336" : "#2196F3"};
            color: white;
            padding: 12px 16px;
            border-radius: 6px;
            z-index: 1001;
            font-size: 14px;
            max-width: 300px;
            word-wrap: break-word;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            opacity: 0;
            transform: translateX(20px);
            transition: all 0.3s ease;
        `, document.body.appendChild(r), setTimeout(() => {
      r.style.opacity = "1", r.style.transform = "translateX(0)";
    }, 10), setTimeout(() => {
      r.style.opacity = "0", r.style.transform = "translateX(20px)", setTimeout(() => {
        r.parentNode && r.parentNode.removeChild(r);
      }, 300);
    }, 3e3);
  }
  function T() {
    var l;
    if (!((l = window.app) != null && l.canvas)) {
      setTimeout(T, 100);
      return;
    }
    window.app.canvas.canvas && (window.app.canvas.canvas.addEventListener("click", () => {
      setTimeout(V, 10);
    }), window.app.canvas.canvas.addEventListener("mouseup", () => {
      setTimeout(V, 10);
    }), document.addEventListener("keydown", (i) => {
      (i.ctrlKey || i.metaKey) && setTimeout(V, 10);
    })), setInterval(V, 500);
  }
  function K(l) {
    if (l.ctrlKey || l.metaKey) {
      if (l.shiftKey)
        switch (l.key) {
          case "ArrowLeft":
            l.preventDefault(), f("left");
            break;
          case "ArrowRight":
            l.preventDefault(), f("right");
            break;
          case "ArrowUp":
            l.preventDefault(), f("top");
            break;
          case "ArrowDown":
            l.preventDefault(), f("bottom");
            break;
        }
      else if (l.altKey)
        switch (l.key) {
          case "ArrowRight":
            l.preventDefault(), f("horizontal-flow");
            break;
          case "ArrowDown":
            l.preventDefault(), f("vertical-flow");
            break;
        }
    }
  }
  M(), T(), document.addEventListener("keydown", K), console.log("Housekeeper: Alignment panel initialized");
}
