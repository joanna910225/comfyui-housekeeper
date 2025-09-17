import { app as mt } from "../../../scripts/app.js";
import { ComponentWidgetImpl as yt, addWidget as vt } from "../../../scripts/domWidget.js";
import { defineComponent as st, ref as H, resolveDirective as dt, createElementBlock as it, openBlock as Z, Fragment as lt, createElementVNode as j, withDirectives as wt, createVNode as rt, createBlock as ct, unref as M, normalizeClass as pt, withCtx as at, createTextVNode as ut, toDisplayString as et, renderList as bt, normalizeStyle as zt, onMounted as ft, nextTick as xt } from "vue";
import ot from "primevue/button";
import { useI18n as ht } from "vue-i18n";
const Ct = { class: "toolbar" }, St = { class: "color-picker" }, _t = { class: "size-slider" }, At = ["value"], Et = /* @__PURE__ */ st({
  __name: "ToolBar",
  props: {
    colors: {},
    initialColor: {},
    initialBrushSize: {},
    initialTool: {}
  },
  emits: ["tool-change", "color-change", "canvas-clear", "brush-size-change"],
  setup(g, { emit: N }) {
    const { t: m } = ht(), C = g, L = N, F = C.colors || ["#000000", "#ff0000", "#0000ff", "#69a869", "#ffff00", "#ff00ff", "#00ffff"], I = H(C.initialColor || "#000000"), O = H(C.initialBrushSize || 5), k = H(C.initialTool || "pen");
    function S(B) {
      k.value = B, L("tool-change", B);
    }
    function T(B) {
      I.value = B, L("color-change", B);
    }
    function X() {
      L("canvas-clear");
    }
    function v(B) {
      const $ = B.target;
      O.value = Number($.value), L("brush-size-change", O.value);
    }
    return (B, $) => {
      const q = dt("tooltip");
      return Z(), it(lt, null, [
        j("div", Ct, [
          wt((Z(), ct(M(ot), {
            class: pt({ active: k.value === "pen" }),
            onClick: $[0] || ($[0] = (E) => S("pen"))
          }, {
            default: at(() => [
              ut(et(M(m)("vue-basic.pen")), 1)
            ]),
            _: 1
          }, 8, ["class"])), [
            [q, { value: M(m)("vue-basic.pen-tooltip"), showDelay: 300 }]
          ]),
          rt(M(ot), { onClick: X }, {
            default: at(() => [
              ut(et(M(m)("vue-basic.clear-canvas")), 1)
            ]),
            _: 1
          })
        ]),
        j("div", St, [
          (Z(!0), it(lt, null, bt(M(F), (E, R) => (Z(), ct(M(ot), {
            key: R,
            class: pt({ "color-button": !0, active: I.value === E }),
            onClick: (tt) => T(E),
            type: "button",
            title: E
          }, {
            default: at(() => [
              j("i", {
                class: "pi pi-circle-fill",
                style: zt({ color: E })
              }, null, 4)
            ]),
            _: 2
          }, 1032, ["class", "onClick", "title"]))), 128))
        ]),
        j("div", _t, [
          j("label", null, et(M(m)("vue-basic.brush-size")) + ": " + et(O.value) + "px", 1),
          j("input", {
            type: "range",
            min: "1",
            max: "50",
            value: O.value,
            onChange: $[1] || ($[1] = (E) => v(E))
          }, null, 40, At)
        ])
      ], 64);
    };
  }
}), nt = (g, N) => {
  const m = g.__vccOpts || g;
  for (const [C, L] of N)
    m[C] = L;
  return m;
}, kt = /* @__PURE__ */ nt(Et, [["__scopeId", "data-v-cae98791"]]), Dt = { class: "drawing-board" }, Nt = { class: "canvas-container" }, Tt = ["width", "height"], Pt = /* @__PURE__ */ st({
  __name: "DrawingBoard",
  props: {
    width: {},
    height: {},
    initialColor: {},
    initialBrushSize: {}
  },
  emits: ["mounted", "drawing-start", "drawing", "drawing-end", "state-save", "canvas-clear"],
  setup(g, { expose: N, emit: m }) {
    const C = g, L = C.width || 800, F = C.height || 500, I = C.initialColor || "#000000", O = C.initialBrushSize || 5, k = m, S = H(!1), T = H(0), X = H(0), v = H(null), B = H(!1), $ = H(O), q = H(I), E = H(null), R = H(null);
    ft(() => {
      R.value && (v.value = R.value.getContext("2d"), tt(), xt(() => {
        R.value && k("mounted", R.value);
      }));
    });
    function tt() {
      v.value && (v.value.fillStyle = "#ffffff", v.value.fillRect(0, 0, L, F), J(), c());
    }
    function J() {
      v.value && (B.value ? (v.value.globalCompositeOperation = "destination-out", v.value.strokeStyle = "rgba(0,0,0,1)") : (v.value.globalCompositeOperation = "source-over", v.value.strokeStyle = q.value), v.value.lineWidth = $.value, v.value.lineJoin = "round", v.value.lineCap = "round");
    }
    function U(h) {
      S.value = !0;
      const { offsetX: l, offsetY: s } = o(h);
      T.value = l, X.value = s, v.value && (v.value.beginPath(), v.value.moveTo(T.value, X.value), v.value.arc(T.value, X.value, $.value / 2, 0, Math.PI * 2), v.value.fill(), k("drawing-start", {
        x: l,
        y: s,
        tool: B.value ? "eraser" : "pen"
      }));
    }
    function Q(h) {
      if (!S.value || !v.value) return;
      const { offsetX: l, offsetY: s } = o(h);
      v.value.beginPath(), v.value.moveTo(T.value, X.value), v.value.lineTo(l, s), v.value.stroke(), T.value = l, X.value = s, k("drawing", {
        x: l,
        y: s,
        tool: B.value ? "eraser" : "pen"
      });
    }
    function z() {
      S.value && (S.value = !1, c(), k("drawing-end"));
    }
    function o(h) {
      let l = 0, s = 0;
      if ("touches" in h) {
        if (h.preventDefault(), R.value) {
          const x = R.value.getBoundingClientRect();
          l = h.touches[0].clientX - x.left, s = h.touches[0].clientY - x.top;
        }
      } else
        l = h.offsetX, s = h.offsetY;
      return { offsetX: l, offsetY: s };
    }
    function r(h) {
      h.preventDefault();
      const s = {
        touches: [h.touches[0]]
      };
      U(s);
    }
    function i(h) {
      if (h.preventDefault(), !S.value) return;
      const s = {
        touches: [h.touches[0]]
      };
      Q(s);
    }
    function u(h) {
      B.value = h === "eraser", J();
    }
    function y(h) {
      q.value = h, J();
    }
    function n(h) {
      $.value = h, J();
    }
    function d() {
      v.value && (v.value.fillStyle = "#ffffff", v.value.fillRect(0, 0, L, F), J(), c(), k("canvas-clear"));
    }
    function c() {
      R.value && (E.value = R.value.toDataURL("image/png"), E.value && k("state-save", E.value));
    }
    async function p() {
      if (!R.value)
        throw new Error("Canvas is unable to get current data");
      return E.value ? E.value : R.value.toDataURL("image/png");
    }
    return N({
      setTool: u,
      setColor: y,
      setBrushSize: n,
      clearCanvas: d,
      getCurrentCanvasData: p
    }), (h, l) => (Z(), it("div", Dt, [
      j("div", Nt, [
        j("canvas", {
          ref_key: "canvas",
          ref: R,
          width: M(L),
          height: M(F),
          onMousedown: U,
          onMousemove: Q,
          onMouseup: z,
          onMouseleave: z,
          onTouchstart: r,
          onTouchmove: i,
          onTouchend: z
        }, null, 40, Tt)
      ])
    ]));
  }
}), Bt = /* @__PURE__ */ nt(Pt, [["__scopeId", "data-v-ca1239fc"]]), Mt = { class: "drawing-app" }, It = /* @__PURE__ */ st({
  __name: "DrawingApp",
  props: {
    width: {},
    height: {},
    initialColor: {},
    initialBrushSize: {},
    availableColors: {}
  },
  emits: ["tool-change", "color-change", "brush-size-change", "drawing-start", "drawing", "drawing-end", "state-save", "mounted"],
  setup(g, { expose: N, emit: m }) {
    const C = g, L = C.width || 800, F = C.height || 500, I = C.initialColor || "#000000", O = C.initialBrushSize || 5, k = C.availableColors || ["#000000", "#ff0000", "#0000ff", "#00ff00", "#ffff00", "#ff00ff", "#00ffff"], S = m, T = H(null), X = H(null);
    function v(z) {
      var o;
      (o = T.value) == null || o.setTool(z), S("tool-change", z);
    }
    function B(z) {
      var o;
      (o = T.value) == null || o.setColor(z), S("color-change", z);
    }
    function $(z) {
      var o;
      (o = T.value) == null || o.setBrushSize(z), S("brush-size-change", z);
    }
    function q() {
      var z;
      (z = T.value) == null || z.clearCanvas();
    }
    function E(z) {
      S("drawing-start", z);
    }
    function R(z) {
      S("drawing", z);
    }
    function tt() {
      S("drawing-end");
    }
    function J(z) {
      X.value = z, S("state-save", z);
    }
    function U(z) {
      S("mounted", z);
    }
    async function Q() {
      if (X.value)
        return X.value;
      if (T.value)
        try {
          return await T.value.getCurrentCanvasData();
        } catch (z) {
          throw console.error("unable to get canvas data:", z), new Error("unable to get canvas data");
        }
      throw new Error("get canvas data failed");
    }
    return N({
      getCanvasData: Q
    }), (z, o) => (Z(), it("div", Mt, [
      rt(kt, {
        colors: M(k),
        initialColor: M(I),
        initialBrushSize: M(O),
        onToolChange: v,
        onColorChange: B,
        onBrushSizeChange: $,
        onCanvasClear: q
      }, null, 8, ["colors", "initialColor", "initialBrushSize"]),
      rt(Bt, {
        ref_key: "drawingBoard",
        ref: T,
        width: M(L),
        height: M(F),
        initialColor: M(I),
        initialBrushSize: M(O),
        onDrawingStart: E,
        onDrawing: R,
        onDrawingEnd: tt,
        onStateSave: J,
        onMounted: U
      }, null, 8, ["width", "height", "initialColor", "initialBrushSize"])
    ]));
  }
}), Ot = /* @__PURE__ */ nt(It, [["__scopeId", "data-v-39bbf58b"]]), Lt = /* @__PURE__ */ st({
  __name: "VueExampleComponent",
  props: {
    widget: {}
  },
  setup(g) {
    const { t: N } = ht(), m = H(null), C = H(null);
    g.widget.node;
    function L(I) {
      C.value = I, console.log("canvas state saved:", I.substring(0, 50) + "...");
    }
    async function F(I, O) {
      var k;
      try {
        if (!((k = window.app) != null && k.api))
          throw new Error("ComfyUI API not available");
        const S = await fetch(I).then(($) => $.blob()), T = `${O}_${Date.now()}.png`, X = new File([S], T), v = new FormData();
        return v.append("image", X), v.append("subfolder", "threed"), v.append("type", "temp"), console.log("Vue Component: Using window.app.api.fetchApi"), (await window.app.api.fetchApi("/upload/image", {
          method: "POST",
          body: v
        })).json();
      } catch (S) {
        throw console.error("Vue Component: Error uploading image:", S), S;
      }
    }
    return ft(() => {
      g.widget.serializeValue = async (I, O) => {
        try {
          console.log("Vue Component: inside vue serializeValue"), console.log("node", I), console.log("index", O);
          const k = C.value;
          return k ? {
            image: `threed/${(await F(k, "test_vue_basic")).name} [temp]`
          } : (console.warn("Vue Component: No canvas data available"), { image: null });
        } catch (k) {
          return console.error("Vue Component: Error in serializeValue:", k), { image: null };
        }
      };
    }), (I, O) => (Z(), it("div", null, [
      j("h1", null, et(M(N)("vue-basic.title")), 1),
      j("div", null, [
        rt(Ot, {
          ref_key: "drawingAppRef",
          ref: m,
          width: 300,
          height: 300,
          onStateSave: L
        }, null, 512)
      ])
    ]));
  }
}), gt = mt;
gt.registerExtension({
  name: "vue-basic",
  getCustomWidgets(g) {
    return {
      CUSTOM_VUE_COMPONENT_BASIC(N) {
        const m = {
          name: "custom_vue_component_basic",
          type: "vue-basic"
        }, C = new yt({
          node: N,
          name: m.name,
          component: Lt,
          inputSpec: m,
          options: {}
        });
        return vt(N, C), { widget: C };
      }
    };
  },
  nodeCreated(g) {
    if (g.constructor.comfyClass !== "vue-basic") return;
    const [N, m] = g.size;
    g.setSize([Math.max(N, 300), Math.max(m, 520)]);
  }
});
gt.registerExtension({
  name: "housekeeper-alignment",
  async setup() {
    try {
      $t();
    } catch (g) {
      console.error("Housekeeper: Error setting up alignment panel:", g);
    }
  },
  nodeCreated(g) {
    g.constructor.comfyClass === "housekeeper-alignment" && (g.setSize([200, 100]), g.title && (g.title = "🎯 Alignment Panel Active"));
  }
});
function $t() {
  let g = null, N = !1, m = [], C = [];
  function L(o) {
    var u;
    if (m.length < 2) return;
    F();
    const r = (u = window.app) == null ? void 0 : u.canvas;
    if (!r) return;
    console.log("📍 ORIGINAL NODE POSITIONS BEFORE PREVIEW:", m.map((y, n) => ({
      index: n,
      nodeId: y.id,
      currentPos: { x: y.pos[0], y: y.pos[1] }
    }))), console.log("🎛️ Canvas state:", {
      canvasOffset: r.ds.offset,
      canvasScale: r.ds.scale
    });
    const i = I(o, m);
    console.log("📍 Preview positions:", i.map((y, n) => ({
      index: n,
      nodeId: m[n].id,
      previewPos: { x: y.x, y: y.y }
    }))), i.forEach((y, n) => {
      if (y && m[n]) {
        const d = document.createElement("div");
        d.style.cssText = `
                    position: fixed;
                    background: rgba(74, 144, 226, 0.3);
                    border: 2px dashed rgba(74, 144, 226, 0.7);
                    border-radius: 4px;
                    z-index: 999;
                    pointer-events: none;
                    transition: all 0.2s ease;
                `;
        const c = (y.x + r.ds.offset[0]) * r.ds.scale, p = (y.y + r.ds.offset[1]) * r.ds.scale, h = r.canvas.parentElement, l = r.canvas.getBoundingClientRect(), s = h ? h.getBoundingClientRect() : null;
        s && l.top - s.top, l.top;
        const x = document.querySelector("nav");
        let Y = 31;
        x && (Y = x.getBoundingClientRect().height);
        const W = Y * r.ds.scale, G = l.left + c, D = l.top + p - W;
        console.log("🔧 Nav-based offset method:", {
          navHeight: x ? x.getBoundingClientRect().height : "not found",
          baseOffset: Y,
          canvasScale: r.ds.scale,
          scaledOffset: W,
          calculation: `${l.top} + ${p} - ${W} = ${D}`,
          result: { x: G, y: D }
        });
        const e = y.width * r.ds.scale, b = y.height * r.ds.scale;
        d.style.left = G + "px", d.style.top = D + "px", d.style.width = e + "px", d.style.height = b + "px", document.body.appendChild(d), C.push(d);
      }
    });
  }
  function F() {
    C.forEach((o) => {
      o.parentNode && o.parentNode.removeChild(o);
    }), C = [];
  }
  function I(o, r) {
    if (r.length < 2) return [];
    const i = [], u = Math.min(...r.map((c) => c.pos[0])), y = Math.max(...r.map((c) => {
      let p = 150;
      return c.size && Array.isArray(c.size) && c.size[0] ? p = c.size[0] : typeof c.width == "number" ? p = c.width : c.properties && typeof c.properties.width == "number" && (p = c.properties.width), c.pos[0] + p;
    })), n = Math.min(...r.map((c) => c.pos[1])), d = Math.max(...r.map((c) => {
      let p = 100;
      return c.size && Array.isArray(c.size) && c.size[1] ? p = c.size[1] : typeof c.height == "number" ? p = c.height : c.properties && typeof c.properties.height == "number" && (p = c.properties.height), c.pos[1] + p;
    }));
    switch (o) {
      case "left":
        const c = [...r].sort((t, f) => t.pos[1] - f.pos[1]);
        let p = c[0].pos[1];
        const h = /* @__PURE__ */ new Map();
        c.forEach((t) => {
          let f = 100, w = 150;
          t.size && Array.isArray(t.size) ? (t.size[1] && (f = t.size[1]), t.size[0] && (w = t.size[0])) : (typeof t.height == "number" && (f = t.height), typeof t.width == "number" && (w = t.width), t.properties && (typeof t.properties.height == "number" && (f = t.properties.height), typeof t.properties.width == "number" && (w = t.properties.width))), h.set(t.id, {
            x: u,
            y: p,
            width: w,
            height: f
          }), p += f + 30;
        }), r.forEach((t) => {
          i.push(h.get(t.id));
        });
        break;
      case "right":
        const l = [...r].sort((t, f) => t.pos[1] - f.pos[1]);
        let s = l[0].pos[1];
        const x = /* @__PURE__ */ new Map();
        l.forEach((t) => {
          let f = 100, w = 150;
          t.size && Array.isArray(t.size) ? (t.size[1] && (f = t.size[1]), t.size[0] && (w = t.size[0])) : (typeof t.height == "number" && (f = t.height), typeof t.width == "number" && (w = t.width), t.properties && (typeof t.properties.height == "number" && (f = t.properties.height), typeof t.properties.width == "number" && (w = t.properties.width))), x.set(t.id, {
            x: y - w,
            y: s,
            width: w,
            height: f
          }), s += f + 30;
        }), r.forEach((t) => {
          i.push(x.get(t.id));
        });
        break;
      case "top":
        const Y = [...r].sort((t, f) => t.pos[0] - f.pos[0]);
        let W = Y[0].pos[0];
        const G = /* @__PURE__ */ new Map();
        Y.forEach((t) => {
          let f = 100, w = 150;
          t.size && Array.isArray(t.size) ? (t.size[1] && (f = t.size[1]), t.size[0] && (w = t.size[0])) : (typeof t.height == "number" && (f = t.height), typeof t.width == "number" && (w = t.width), t.properties && (typeof t.properties.height == "number" && (f = t.properties.height), typeof t.properties.width == "number" && (w = t.properties.width))), G.set(t.id, {
            x: W,
            y: n,
            width: w,
            height: f
          }), W += w + 30;
        }), r.forEach((t) => {
          i.push(G.get(t.id));
        });
        break;
      case "bottom":
        const D = [...r].sort((t, f) => t.pos[0] - f.pos[0]);
        let e = u;
        const b = /* @__PURE__ */ new Map();
        D.forEach((t) => {
          let f = 100, w = 150;
          t.size && Array.isArray(t.size) ? (t.size[1] && (f = t.size[1]), t.size[0] && (w = t.size[0])) : (typeof t.height == "number" && (f = t.height), typeof t.width == "number" && (w = t.width), t.properties && (typeof t.properties.height == "number" && (f = t.properties.height), typeof t.properties.width == "number" && (w = t.properties.width))), b.set(t.id, {
            x: e,
            y: d - f,
            width: w,
            height: f
          }), e += w + 30;
        }), r.forEach((t) => {
          i.push(b.get(t.id));
        });
        break;
      case "horizontal-flow":
      case "vertical-flow":
        r.forEach((t) => {
          let f = 100, w = 150;
          t.size && Array.isArray(t.size) ? (t.size[1] && (f = t.size[1]), t.size[0] && (w = t.size[0])) : (typeof t.height == "number" && (f = t.height), typeof t.width == "number" && (w = t.width), t.properties && (typeof t.properties.height == "number" && (f = t.properties.height), typeof t.properties.width == "number" && (w = t.properties.width))), i.push({
            x: t.pos[0],
            y: t.pos[1],
            width: w,
            height: f
          });
        });
        break;
    }
    return i;
  }
  function O(o, r = !1) {
    const i = document.createElement("button");
    i.innerHTML = `
            <span style="font-size: 16px; display: block;">${o.icon}</span>
            <span style="font-size: 11px;">${o.label}</span>
        `;
    const u = r ? "#4a5568" : "#505050", y = r ? "#5a6578" : "#606060";
    return i.style.cssText = `
            background: linear-gradient(145deg, ${u}, #404040);
            border: 1px solid ${r ? "#718096" : "#666"};
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
        `, i.addEventListener("mouseenter", () => {
      i.style.background = `linear-gradient(145deg, ${y}, #505050)`, i.style.transform = "translateY(-1px)", i.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)", L(o.type);
    }), i.addEventListener("mouseleave", () => {
      i.style.background = `linear-gradient(145deg, ${u}, #404040)`, i.style.transform = "translateY(0)", i.style.boxShadow = "none", F();
    }), i.addEventListener("click", () => E(o.type)), i;
  }
  function k() {
    g = document.createElement("div"), g.className = "housekeeper-alignment-panel", g.style.cssText = `
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
    const o = document.createElement("div");
    o.innerHTML = "🎯 Node Alignment", o.style.cssText = `
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 12px;
            text-align: center;
            border-bottom: 1px solid #555;
            padding-bottom: 8px;
        `, g.appendChild(o);
    const r = document.createElement("div");
    r.style.cssText = `
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-bottom: 8px;
        `;
    const i = document.createElement("div");
    i.style.cssText = `
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-bottom: 12px;
            border-top: 1px solid #555;
            padding-top: 8px;
        `;
    const u = [
      { type: "left", icon: "⇤", label: "Left" },
      { type: "right", icon: "⇥", label: "Right" },
      { type: "top", icon: "⇡", label: "Top" },
      { type: "bottom", icon: "⇣", label: "Bottom" },
      { type: "horizontal-flow", icon: "→", label: "H-Flow" },
      { type: "vertical-flow", icon: "↓", label: "V-Flow" }
    ], y = u.slice(0, 4), n = u.slice(4);
    y.forEach((c) => {
      const p = O(c);
      r.appendChild(p);
    }), n.forEach((c) => {
      const p = O(c, !0);
      i.appendChild(p);
    }), g.appendChild(r), g.appendChild(i);
    const d = document.createElement("div");
    d.id = "alignment-info", d.style.cssText = `
            background: rgba(60, 60, 60, 0.8);
            border-radius: 6px;
            padding: 10px;
            font-size: 12px;
            text-align: center;
        `, d.innerHTML = `
            Select multiple nodes to enable alignment<br>
            <small style="opacity: 0.8;">
                Basic: Ctrl+Shift+Arrows<br>
                Flow: Ctrl+Alt+→/↓
            </small>
        `, g.appendChild(d), document.body.appendChild(g);
  }
  function S() {
    var y;
    if (!((y = window.app) != null && y.graph)) return;
    m = Object.values(window.app.graph._nodes || {}).filter((n) => n && n.is_selected);
    const r = m.length > 1;
    r && !N ? T() : !r && N && X();
    const i = document.getElementById("alignment-info");
    i && (m.length === 0 ? i.innerHTML = `
                    Select multiple nodes to enable alignment<br>
                    <small style="opacity: 0.8;">
                        Basic: Ctrl+Shift+Arrows<br>
                        Flow: Ctrl+Alt+→/↓
                    </small>
                ` : m.length === 1 ? i.textContent = "Select additional nodes to align" : i.innerHTML = `
                    ${m.length} nodes selected - ready to align<br>
                    <small style="opacity: 0.8;">Try H-Flow/V-Flow for smart layout</small>
                `);
    const u = g == null ? void 0 : g.querySelectorAll("button");
    u == null || u.forEach((n) => {
      r ? (n.style.opacity = "1", n.style.pointerEvents = "auto") : (n.style.opacity = "0.5", n.style.pointerEvents = "none");
    });
  }
  function T() {
    g && (N = !0, g.style.display = "block", setTimeout(() => {
      g && (g.style.opacity = "1", g.style.transform = "translateX(0)");
    }, 10));
  }
  function X() {
    g && (N = !1, g.style.opacity = "0", g.style.transform = "translateX(20px)", setTimeout(() => {
      g && (g.style.display = "none");
    }, 300));
  }
  function v(o) {
    const r = {}, i = o.filter((u) => u && (u.id !== void 0 || u.id !== null));
    return i.forEach((u) => {
      const y = u.id || `node_${i.indexOf(u)}`;
      u.id = y, r[y] = { inputs: [], outputs: [] }, u.inputs && Array.isArray(u.inputs) && u.inputs.forEach((n, d) => {
        n && n.link !== null && n.link !== void 0 && r[y].inputs.push({
          index: d,
          link: n.link,
          sourceNode: B(n.link, i)
        });
      }), u.outputs && Array.isArray(u.outputs) && u.outputs.forEach((n, d) => {
        n && n.links && Array.isArray(n.links) && n.links.length > 0 && n.links.forEach((c) => {
          const p = $(c, i);
          p && r[y].outputs.push({
            index: d,
            link: c,
            targetNode: p
          });
        });
      });
    }), r;
  }
  function B(o, r) {
    for (const i of r)
      if (i && i.outputs && Array.isArray(i.outputs)) {
        for (const u of i.outputs)
          if (u && u.links && Array.isArray(u.links) && u.links.includes(o))
            return i;
      }
    return null;
  }
  function $(o, r) {
    for (const i of r)
      if (i && i.inputs && Array.isArray(i.inputs)) {
        for (const u of i.inputs)
          if (u && u.link === o)
            return i;
      }
    return null;
  }
  function q(o, r) {
    const i = {}, u = /* @__PURE__ */ new Set(), y = o.filter((p) => p && p.id), n = y.filter((p) => {
      const h = p.id;
      return !r[h] || !r[h].inputs.length || r[h].inputs.every((l) => !l.sourceNode);
    });
    n.length === 0 && y.length > 0 && n.push(y[0]);
    const d = n.map((p) => ({ node: p, level: 0 }));
    for (; d.length > 0; ) {
      const { node: p, level: h } = d.shift();
      !p || !p.id || u.has(p.id) || (u.add(p.id), i[p.id] = { level: h, order: 0 }, r[p.id] && r[p.id].outputs && r[p.id].outputs.forEach((l) => {
        l && l.targetNode && l.targetNode.id && !u.has(l.targetNode.id) && d.push({ node: l.targetNode, level: h + 1 });
      }));
    }
    y.forEach((p) => {
      p && p.id && !i[p.id] && (i[p.id] = { level: 0, order: 0 });
    });
    const c = {};
    return Object.entries(i).forEach(([p, h]) => {
      c[h.level] || (c[h.level] = []);
      const l = y.find((s) => s && s.id === p);
      l && c[h.level].push(l);
    }), Object.entries(c).forEach(([p, h]) => {
      h && h.length > 0 && (h.sort((l, s) => {
        const x = l && l.pos && l.pos[1] ? l.pos[1] : 0, Y = s && s.pos && s.pos[1] ? s.pos[1] : 0;
        return x - Y;
      }), h.forEach((l, s) => {
        l && l.id && i[l.id] && (i[l.id].order = s);
      }));
    }), i;
  }
  function E(o) {
    var r, i, u, y, n;
    if (m.length < 2) {
      U("Please select at least 2 nodes to align", "warning");
      return;
    }
    console.log("📍 ORIGINAL NODE POSITIONS BEFORE CLICKED ALIGNMENT:", m.map((d, c) => ({
      index: c,
      nodeId: d.id,
      currentPos: { x: d.pos[0], y: d.pos[1] }
    })));
    try {
      const d = Math.min(...m.map((s) => s.pos[0])), c = Math.max(...m.map((s) => {
        let x = 150;
        return s.size && Array.isArray(s.size) && s.size[0] ? x = s.size[0] : typeof s.width == "number" ? x = s.width : s.properties && typeof s.properties.width == "number" && (x = s.properties.width), s.pos[0] + x;
      })), p = Math.min(...m.map((s) => s.pos[1])), h = Math.max(...m.map((s) => {
        let x = 100;
        return s.size && Array.isArray(s.size) && s.size[1] ? x = s.size[1] : typeof s.height == "number" ? x = s.height : s.properties && typeof s.properties.height == "number" && (x = s.properties.height), s.pos[1] + x;
      }));
      let l;
      switch (o) {
        case "left":
          l = d;
          const s = [...m].sort((t, f) => t.pos[1] - f.pos[1]);
          let x = s[0].pos[1];
          s.forEach((t, f) => {
            let A = 100;
            t.size && Array.isArray(t.size) && t.size[1] ? A = t.size[1] : typeof t.height == "number" ? A = t.height : t.properties && typeof t.properties.height == "number" && (A = t.properties.height), t.pos[0] = l, t.pos[1] = x, typeof t.x == "number" && (t.x = t.pos[0]), typeof t.y == "number" && (t.y = t.pos[1]), x += A + 30;
          });
          break;
        case "right":
          l = c;
          const Y = [...m].sort((t, f) => t.pos[1] - f.pos[1]);
          let W = Y[0].pos[1];
          Y.forEach((t, f) => {
            let A = 100, V = 150;
            t.size && Array.isArray(t.size) ? (t.size[1] && (A = t.size[1]), t.size[0] && (V = t.size[0])) : (typeof t.height == "number" && (A = t.height), typeof t.width == "number" && (V = t.width), t.properties && (typeof t.properties.height == "number" && (A = t.properties.height), typeof t.properties.width == "number" && (V = t.properties.width))), t.pos[0] = l - V, t.pos[1] = W, typeof t.x == "number" && (t.x = t.pos[0]), typeof t.y == "number" && (t.y = t.pos[1]), W += A + 30;
          });
          break;
        case "top":
          l = p;
          const G = [...m].sort((t, f) => t.pos[0] - f.pos[0]);
          let D = G[0].pos[0];
          G.forEach((t, f) => {
            let A = 150;
            t.size && Array.isArray(t.size) && t.size[0] ? A = t.size[0] : typeof t.width == "number" ? A = t.width : t.properties && typeof t.properties.width == "number" && (A = t.properties.width), t.pos[1] = l, t.pos[0] = D, typeof t.x == "number" && (t.x = t.pos[0]), typeof t.y == "number" && (t.y = t.pos[1]), D += A + 30;
          });
          break;
        case "bottom":
          l = h;
          const e = [...m].sort((t, f) => t.pos[0] - f.pos[0]);
          let b = d;
          e.forEach((t, f) => {
            let A = 150, V = 100;
            t.size && Array.isArray(t.size) ? (t.size[0] && (A = t.size[0]), t.size[1] && (V = t.size[1])) : (typeof t.width == "number" && (A = t.width), typeof t.height == "number" && (V = t.height), t.properties && (typeof t.properties.width == "number" && (A = t.properties.width), typeof t.properties.height == "number" && (V = t.properties.height)));
            const a = l - V, _ = b;
            t.pos[1] = a, t.pos[0] = _, typeof t.x == "number" && (t.x = t.pos[0]), typeof t.y == "number" && (t.y = t.pos[1]), b += A + 30;
          });
          break;
        case "horizontal-flow":
          tt();
          return;
        // Don't continue to the success message at the bottom
        case "vertical-flow":
          J();
          return;
      }
      try {
        (i = (r = window.app) == null ? void 0 : r.canvas) != null && i.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (y = (u = window.app) == null ? void 0 : u.graph) != null && y.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (n = window.app) != null && n.canvas && window.app.canvas.draw(!0, !0);
      } catch (s) {
        console.warn("Could not trigger canvas redraw:", s);
      }
    } catch (d) {
      console.error("Alignment error:", d), U("Error during alignment", "error");
    }
  }
  function R(o) {
  }
  function tt() {
    var o, r, i, u, y;
    try {
      const n = m.filter((e) => {
        if (!e) return !1;
        const b = e.pos || e.position || typeof e.x == "number" && typeof e.y == "number", t = e.size || e.width || e.height || typeof e.width == "number" && typeof e.height == "number", f = !!b && !!t;
        return f;
      });
      if (n.length < 2) {
        U(`Not enough valid nodes: ${n.length}/${m.length} nodes are valid`, "warning");
        return;
      }
      const d = Math.min(...n.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[0] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[0] : typeof e.x == "number" ? e.x : 0)), c = Math.min(...n.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[1] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[1] : typeof e.y == "number" ? e.y : 0)), p = d, h = c;
      n.forEach((e) => {
        e.pos || (e.position && Array.isArray(e.position) ? e.pos = e.position : typeof e.x == "number" && typeof e.y == "number" ? e.pos = [e.x, e.y] : e.pos = [0, 0]), e._calculatedSize || (e.size && Array.isArray(e.size) ? e._calculatedSize = [e.size[0], e.size[1]] : typeof e.width == "number" && typeof e.height == "number" ? e._calculatedSize = [e.width, e.height] : e._calculatedSize = [150, 100]), Array.isArray(e.pos) || (e.pos = [0, 0]);
      });
      const l = v(n), s = q(n, l), x = 40, Y = 20, W = 15, G = 5, D = {};
      n.forEach((e) => {
        var b;
        if (e && e.id) {
          const t = ((b = s[e.id]) == null ? void 0 : b.level) ?? 0;
          D[t] || (D[t] = []), D[t].push(e);
        }
      }), Object.entries(D).forEach(([e, b]) => {
        const t = parseInt(e);
        if (b && b.length > 0) {
          b.sort((a, _) => {
            const K = a && a.id && s[a.id] ? s[a.id].order : 0, P = _ && _.id && s[_.id] ? s[_.id].order : 0;
            return K - P;
          });
          const f = b.reduce((a, _, K) => {
            const P = _ && _._calculatedSize && _._calculatedSize[1] ? _._calculatedSize[1] : 100;
            return a + P + (K < b.length - 1 ? W : 0);
          }, 0), w = Math.max(...b.map(
            (a) => a && a._calculatedSize && a._calculatedSize[0] ? a._calculatedSize[0] : 150
          ));
          let A = p;
          if (t > 0)
            for (let a = 0; a < t; a++) {
              const _ = D[a] || [], K = Math.max(..._.map(
                (P) => P && P._calculatedSize && P._calculatedSize[0] ? P._calculatedSize[0] : 150
              ));
              A += K + x + G;
            }
          let V = h;
          b.forEach((a, _) => {
            if (a && a.pos && a._calculatedSize) {
              const K = [a.pos[0], a.pos[1]], P = [a._calculatedSize[0], a._calculatedSize[1]];
              a.pos[0] = A, a.pos[1] = V, V += a._calculatedSize[1] + W, typeof a.x == "number" && (a.x = a.pos[0]), typeof a.y == "number" && (a.y = a.pos[1]);
            }
          });
        }
      });
      try {
        (r = (o = window.app) == null ? void 0 : o.canvas) != null && r.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (u = (i = window.app) == null ? void 0 : i.graph) != null && u.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (y = window.app) != null && y.canvas && window.app.canvas.draw(!0, !0);
      } catch (e) {
        console.warn("Could not trigger canvas redraw:", e);
      }
    } catch (n) {
      console.error("Horizontal flow alignment error:", n), U("Error in horizontal flow alignment", "error");
    }
  }
  function J() {
    var o, r, i, u, y;
    try {
      const n = m.filter((e) => {
        if (!e) return !1;
        const b = e.pos || e.position || typeof e.x == "number" && typeof e.y == "number", t = e.size || e.width || e.height || typeof e.width == "number" && typeof e.height == "number";
        return !!b && !!t;
      });
      if (n.length < 2) {
        U(`Not enough valid nodes: ${n.length}/${m.length} nodes are valid`, "warning");
        return;
      }
      const d = Math.min(...n.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[0] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[0] : typeof e.x == "number" ? e.x : 0)), c = Math.min(...n.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[1] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[1] : typeof e.y == "number" ? e.y : 0)), p = d, h = c;
      n.forEach((e) => {
        e.pos || (e.position && Array.isArray(e.position) ? e.pos = e.position : typeof e.x == "number" && typeof e.y == "number" ? e.pos = [e.x, e.y] : e.pos = [0, 0]), e._calculatedSize || (e.size && Array.isArray(e.size) ? e._calculatedSize = [e.size[0], e.size[1]] : typeof e.width == "number" && typeof e.height == "number" ? e._calculatedSize = [e.width, e.height] : e._calculatedSize = [150, 100]), Array.isArray(e.pos) || (e.pos = [0, 0]);
      });
      const l = v(n), s = q(n, l), x = 50, Y = 30, W = 25, G = 15, D = {};
      n.forEach((e) => {
        var b;
        if (e && e.id) {
          const t = ((b = s[e.id]) == null ? void 0 : b.level) ?? 0;
          D[t] || (D[t] = []), D[t].push(e);
        }
      }), Object.entries(D).forEach(([e, b]) => {
        const t = parseInt(e);
        if (b && b.length > 0) {
          b.sort((a, _) => {
            const K = a && a.id && s[a.id] ? s[a.id].order : 0, P = _ && _.id && s[_.id] ? s[_.id].order : 0;
            return K - P;
          });
          const f = b.reduce((a, _, K) => {
            const P = _ && _._calculatedSize && _._calculatedSize[0] ? _._calculatedSize[0] : 150;
            return a + P + Y;
          }, 0), w = Math.max(...b.map(
            (a) => a && a._calculatedSize && a._calculatedSize[1] ? a._calculatedSize[1] : 100
          ));
          let A = h;
          if (t > 0)
            for (let a = 0; a < t; a++) {
              const _ = D[a] || [], K = Math.max(..._.map(
                (P) => P && P._calculatedSize && P._calculatedSize[1] ? P._calculatedSize[1] : 100
              ));
              A += K + x + G;
            }
          let V = p;
          b.forEach((a, _) => {
            if (a && a.pos && a._calculatedSize) {
              const K = [a.pos[0], a.pos[1]], P = [a._calculatedSize[0], a._calculatedSize[1]];
              a.pos[0] = V, a.pos[1] = A, V += a._calculatedSize[0] + Y, typeof a.x == "number" && (a.x = a.pos[0]), typeof a.y == "number" && (a.y = a.pos[1]);
            }
          });
        }
      });
      try {
        (r = (o = window.app) == null ? void 0 : o.canvas) != null && r.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (u = (i = window.app) == null ? void 0 : i.graph) != null && u.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (y = window.app) != null && y.canvas && window.app.canvas.draw(!0, !0);
      } catch (e) {
        console.warn("Could not trigger canvas redraw:", e);
      }
    } catch (n) {
      console.error("Vertical flow alignment error:", n), U("Error in vertical flow alignment", "error");
    }
  }
  function U(o, r = "info") {
    const i = document.createElement("div");
    i.textContent = o, i.style.cssText = `
            position: fixed;
            top: 60px;
            right: 10px;
            background: ${r === "success" ? "#4CAF50" : r === "warning" ? "#FF9800" : r === "error" ? "#F44336" : "#2196F3"};
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
        `, document.body.appendChild(i), setTimeout(() => {
      i.style.opacity = "1", i.style.transform = "translateX(0)";
    }, 10), setTimeout(() => {
      i.style.opacity = "0", i.style.transform = "translateX(20px)", setTimeout(() => {
        i.parentNode && i.parentNode.removeChild(i);
      }, 300);
    }, 3e3);
  }
  function Q() {
    var o;
    if (!((o = window.app) != null && o.canvas)) {
      setTimeout(Q, 100);
      return;
    }
    window.app.canvas.canvas && (window.app.canvas.canvas.addEventListener("click", () => {
      setTimeout(S, 10);
    }), window.app.canvas.canvas.addEventListener("mouseup", () => {
      setTimeout(S, 10);
    }), document.addEventListener("keydown", (r) => {
      (r.ctrlKey || r.metaKey) && setTimeout(S, 10);
    })), setInterval(S, 500);
  }
  function z(o) {
    if (o.ctrlKey || o.metaKey) {
      if (o.shiftKey)
        switch (o.key) {
          case "ArrowLeft":
            o.preventDefault(), E("left");
            break;
          case "ArrowRight":
            o.preventDefault(), E("right");
            break;
          case "ArrowUp":
            o.preventDefault(), E("top");
            break;
          case "ArrowDown":
            o.preventDefault(), E("bottom");
            break;
        }
      else if (o.altKey)
        switch (o.key) {
          case "ArrowRight":
            o.preventDefault(), E("horizontal-flow");
            break;
          case "ArrowDown":
            o.preventDefault(), E("vertical-flow");
            break;
        }
    }
  }
  k(), Q(), document.addEventListener("keydown", z);
}
