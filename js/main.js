import { app as Xt } from "../../../scripts/app.js";
import { ComponentWidgetImpl as It, addWidget as Wt } from "../../../scripts/domWidget.js";
import { defineComponent as bt, ref as j, resolveDirective as Yt, createElementBlock as mt, openBlock as nt, Fragment as Ct, createElementVNode as rt, withDirectives as Vt, createVNode as wt, createBlock as Et, unref as Y, normalizeClass as kt, withCtx as xt, createTextVNode as Mt, toDisplayString as gt, renderList as $t, normalizeStyle as Rt, onMounted as Nt, nextTick as Gt } from "vue";
import St from "primevue/button";
import { useI18n as Dt } from "vue-i18n";
const jt = { class: "toolbar" }, Ut = { class: "color-picker" }, Kt = { class: "size-slider" }, qt = ["value"], Jt = /* @__PURE__ */ bt({
  __name: "ToolBar",
  props: {
    colors: {},
    initialColor: {},
    initialBrushSize: {},
    initialTool: {}
  },
  emits: ["tool-change", "color-change", "canvas-clear", "brush-size-change"],
  setup(v, { emit: H }) {
    const { t: g } = Dt(), N = v, X = H, K = N.colors || ["#000000", "#ff0000", "#0000ff", "#69a869", "#ffff00", "#ff00ff", "#00ffff"], V = j(N.initialColor || "#000000"), $ = j(N.initialBrushSize || 5), B = j(N.initialTool || "pen");
    function D(W) {
      B.value = W, X("tool-change", W);
    }
    function O(W) {
      V.value = W, X("color-change", W);
    }
    function I() {
      X("canvas-clear");
    }
    function d(W) {
      const F = W.target;
      $.value = Number(F.value), X("brush-size-change", $.value);
    }
    return (W, F) => {
      const st = Yt("tooltip");
      return nt(), mt(Ct, null, [
        rt("div", jt, [
          Vt((nt(), Et(Y(St), {
            class: kt({ active: B.value === "pen" }),
            onClick: F[0] || (F[0] = (R) => D("pen"))
          }, {
            default: xt(() => [
              Mt(gt(Y(g)("vue-basic.pen")), 1)
            ]),
            _: 1
          }, 8, ["class"])), [
            [st, { value: Y(g)("vue-basic.pen-tooltip"), showDelay: 300 }]
          ]),
          wt(Y(St), { onClick: I }, {
            default: xt(() => [
              Mt(gt(Y(g)("vue-basic.clear-canvas")), 1)
            ]),
            _: 1
          })
        ]),
        rt("div", Ut, [
          (nt(!0), mt(Ct, null, $t(Y(K), (R, L) => (nt(), Et(Y(St), {
            key: L,
            class: kt({ "color-button": !0, active: V.value === R }),
            onClick: (et) => O(R),
            type: "button",
            title: R
          }, {
            default: xt(() => [
              rt("i", {
                class: "pi pi-circle-fill",
                style: Rt({ color: R })
              }, null, 4)
            ]),
            _: 2
          }, 1032, ["class", "onClick", "title"]))), 128))
        ]),
        rt("div", Kt, [
          rt("label", null, gt(Y(g)("vue-basic.brush-size")) + ": " + gt($.value) + "px", 1),
          rt("input", {
            type: "range",
            min: "1",
            max: "50",
            value: $.value,
            onChange: F[1] || (F[1] = (R) => d(R))
          }, null, 40, qt)
        ])
      ], 64);
    };
  }
}), _t = (v, H) => {
  const g = v.__vccOpts || v;
  for (const [N, X] of H)
    g[N] = X;
  return g;
}, Qt = /* @__PURE__ */ _t(Jt, [["__scopeId", "data-v-cae98791"]]), Zt = { class: "drawing-board" }, te = { class: "canvas-container" }, ee = ["width", "height"], ie = /* @__PURE__ */ bt({
  __name: "DrawingBoard",
  props: {
    width: {},
    height: {},
    initialColor: {},
    initialBrushSize: {}
  },
  emits: ["mounted", "drawing-start", "drawing", "drawing-end", "state-save", "canvas-clear"],
  setup(v, { expose: H, emit: g }) {
    const N = v, X = N.width || 800, K = N.height || 500, V = N.initialColor || "#000000", $ = N.initialBrushSize || 5, B = g, D = j(!1), O = j(0), I = j(0), d = j(null), W = j(!1), F = j($), st = j(V), R = j(null), L = j(null);
    Nt(() => {
      L.value && (d.value = L.value.getContext("2d"), et(), Gt(() => {
        L.value && B("mounted", L.value);
      }));
    });
    function et() {
      d.value && (d.value.fillStyle = "#ffffff", d.value.fillRect(0, 0, X, K), at(), f());
    }
    function at() {
      d.value && (W.value ? (d.value.globalCompositeOperation = "destination-out", d.value.strokeStyle = "rgba(0,0,0,1)") : (d.value.globalCompositeOperation = "source-over", d.value.strokeStyle = st.value), d.value.lineWidth = F.value, d.value.lineJoin = "round", d.value.lineCap = "round");
    }
    function ct(o) {
      D.value = !0;
      const { offsetX: c, offsetY: m } = U(o);
      O.value = c, I.value = m, d.value && (d.value.beginPath(), d.value.moveTo(O.value, I.value), d.value.arc(O.value, I.value, F.value / 2, 0, Math.PI * 2), d.value.fill(), B("drawing-start", {
        x: c,
        y: m,
        tool: W.value ? "eraser" : "pen"
      }));
    }
    function pt(o) {
      if (!D.value || !d.value) return;
      const { offsetX: c, offsetY: m } = U(o);
      d.value.beginPath(), d.value.moveTo(O.value, I.value), d.value.lineTo(c, m), d.value.stroke(), O.value = c, I.value = m, B("drawing", {
        x: c,
        y: m,
        tool: W.value ? "eraser" : "pen"
      });
    }
    function S() {
      D.value && (D.value = !1, f(), B("drawing-end"));
    }
    function U(o) {
      let c = 0, m = 0;
      if ("touches" in o) {
        if (o.preventDefault(), L.value) {
          const w = L.value.getBoundingClientRect();
          c = o.touches[0].clientX - w.left, m = o.touches[0].clientY - w.top;
        }
      } else
        c = o.offsetX, m = o.offsetY;
      return { offsetX: c, offsetY: m };
    }
    function zt(o) {
      o.preventDefault();
      const m = {
        touches: [o.touches[0]]
      };
      ct(m);
    }
    function h(o) {
      if (o.preventDefault(), !D.value) return;
      const m = {
        touches: [o.touches[0]]
      };
      pt(m);
    }
    function s(o) {
      W.value = o === "eraser", at();
    }
    function l(o) {
      st.value = o, at();
    }
    function u(o) {
      F.value = o, at();
    }
    function z() {
      d.value && (d.value.fillStyle = "#ffffff", d.value.fillRect(0, 0, X, K), at(), f(), B("canvas-clear"));
    }
    function f() {
      L.value && (R.value = L.value.toDataURL("image/png"), R.value && B("state-save", R.value));
    }
    async function C() {
      if (!L.value)
        throw new Error("Canvas is unable to get current data");
      return R.value ? R.value : L.value.toDataURL("image/png");
    }
    return H({
      setTool: s,
      setColor: l,
      setBrushSize: u,
      clearCanvas: z,
      getCurrentCanvasData: C
    }), (o, c) => (nt(), mt("div", Zt, [
      rt("div", te, [
        rt("canvas", {
          ref_key: "canvas",
          ref: L,
          width: Y(X),
          height: Y(K),
          onMousedown: ct,
          onMousemove: pt,
          onMouseup: S,
          onMouseleave: S,
          onTouchstart: zt,
          onTouchmove: h,
          onTouchend: S
        }, null, 40, ee)
      ])
    ]));
  }
}), re = /* @__PURE__ */ _t(ie, [["__scopeId", "data-v-ca1239fc"]]), se = { class: "drawing-app" }, ae = /* @__PURE__ */ bt({
  __name: "DrawingApp",
  props: {
    width: {},
    height: {},
    initialColor: {},
    initialBrushSize: {},
    availableColors: {}
  },
  emits: ["tool-change", "color-change", "brush-size-change", "drawing-start", "drawing", "drawing-end", "state-save", "mounted"],
  setup(v, { expose: H, emit: g }) {
    const N = v, X = N.width || 800, K = N.height || 500, V = N.initialColor || "#000000", $ = N.initialBrushSize || 5, B = N.availableColors || ["#000000", "#ff0000", "#0000ff", "#00ff00", "#ffff00", "#ff00ff", "#00ffff"], D = g, O = j(null), I = j(null);
    function d(S) {
      var U;
      (U = O.value) == null || U.setTool(S), D("tool-change", S);
    }
    function W(S) {
      var U;
      (U = O.value) == null || U.setColor(S), D("color-change", S);
    }
    function F(S) {
      var U;
      (U = O.value) == null || U.setBrushSize(S), D("brush-size-change", S);
    }
    function st() {
      var S;
      (S = O.value) == null || S.clearCanvas();
    }
    function R(S) {
      D("drawing-start", S);
    }
    function L(S) {
      D("drawing", S);
    }
    function et() {
      D("drawing-end");
    }
    function at(S) {
      I.value = S, D("state-save", S);
    }
    function ct(S) {
      D("mounted", S);
    }
    async function pt() {
      if (I.value)
        return I.value;
      if (O.value)
        try {
          return await O.value.getCurrentCanvasData();
        } catch (S) {
          throw console.error("unable to get canvas data:", S), new Error("unable to get canvas data");
        }
      throw new Error("get canvas data failed");
    }
    return H({
      getCanvasData: pt
    }), (S, U) => (nt(), mt("div", se, [
      wt(Qt, {
        colors: Y(B),
        initialColor: Y(V),
        initialBrushSize: Y($),
        onToolChange: d,
        onColorChange: W,
        onBrushSizeChange: F,
        onCanvasClear: st
      }, null, 8, ["colors", "initialColor", "initialBrushSize"]),
      wt(re, {
        ref_key: "drawingBoard",
        ref: O,
        width: Y(X),
        height: Y(K),
        initialColor: Y(V),
        initialBrushSize: Y($),
        onDrawingStart: R,
        onDrawing: L,
        onDrawingEnd: et,
        onStateSave: at,
        onMounted: ct
      }, null, 8, ["width", "height", "initialColor", "initialBrushSize"])
    ]));
  }
}), oe = /* @__PURE__ */ _t(ae, [["__scopeId", "data-v-39bbf58b"]]), le = /* @__PURE__ */ bt({
  __name: "VueExampleComponent",
  props: {
    widget: {}
  },
  setup(v) {
    const { t: H } = Dt(), g = j(null), N = j(null);
    v.widget.node;
    function X(V) {
      N.value = V, console.log("canvas state saved:", V.substring(0, 50) + "...");
    }
    async function K(V, $) {
      var B;
      try {
        if (!((B = window.app) != null && B.api))
          throw new Error("ComfyUI API not available");
        const D = await fetch(V).then((F) => F.blob()), O = `${$}_${Date.now()}.png`, I = new File([D], O), d = new FormData();
        return d.append("image", I), d.append("subfolder", "threed"), d.append("type", "temp"), console.log("Vue Component: Using window.app.api.fetchApi"), (await window.app.api.fetchApi("/upload/image", {
          method: "POST",
          body: d
        })).json();
      } catch (D) {
        throw console.error("Vue Component: Error uploading image:", D), D;
      }
    }
    return Nt(() => {
      v.widget.serializeValue = async (V, $) => {
        try {
          console.log("Vue Component: inside vue serializeValue"), console.log("node", V), console.log("index", $);
          const B = N.value;
          return B ? {
            image: `threed/${(await K(B, "test_vue_basic")).name} [temp]`
          } : (console.warn("Vue Component: No canvas data available"), { image: null });
        } catch (B) {
          return console.error("Vue Component: Error in serializeValue:", B), { image: null };
        }
      };
    }), (V, $) => (nt(), mt("div", null, [
      rt("h1", null, gt(Y(H)("vue-basic.title")), 1),
      rt("div", null, [
        wt(oe, {
          ref_key: "drawingAppRef",
          ref: g,
          width: 300,
          height: 300,
          onStateSave: X
        }, null, 512)
      ])
    ]));
  }
}), Pt = Xt;
Pt.registerExtension({
  name: "vue-basic",
  getCustomWidgets(v) {
    return {
      CUSTOM_VUE_COMPONENT_BASIC(H) {
        const g = {
          name: "custom_vue_component_basic",
          type: "vue-basic"
        }, N = new It({
          node: H,
          name: g.name,
          component: le,
          inputSpec: g,
          options: {}
        });
        return Wt(H, N), { widget: N };
      }
    };
  },
  nodeCreated(v) {
    if (v.constructor.comfyClass !== "vue-basic") return;
    const [H, g] = v.size;
    v.setSize([Math.max(H, 300), Math.max(g, 520)]);
  }
});
Pt.registerExtension({
  name: "housekeeper-alignment",
  async setup() {
    try {
      ne();
    } catch {
    }
  },
  nodeCreated(v) {
    v.constructor.comfyClass === "housekeeper-alignment" && (v.setSize([200, 100]), v.title && (v.title = "🎯 Alignment Panel Active"));
  }
});
function ne() {
  let v = null, H = !1, g = [], N = [];
  const X = /* @__PURE__ */ new WeakMap(), K = /* @__PURE__ */ new WeakMap();
  function V(h) {
    var u;
    if (g.length < 2) return;
    $();
    const s = (u = window.app) == null ? void 0 : u.canvas;
    if (!s) return;
    B(h, g).forEach((z, f) => {
      if (z && g[f]) {
        const C = document.createElement("div");
        C.style.cssText = `
                    position: fixed;
                    background: rgba(74, 144, 226, 0.3);
                    border: 2px dashed rgba(74, 144, 226, 0.7);
                    border-radius: 4px;
                    z-index: 999;
                    pointer-events: none;
                    transition: all 0.2s ease;
                `;
        const o = (z.x + s.ds.offset[0]) * s.ds.scale, c = (z.y + s.ds.offset[1]) * s.ds.scale, m = s.canvas.parentElement, w = s.canvas.getBoundingClientRect(), M = m ? m.getBoundingClientRect() : null;
        M && w.top - M.top, w.top;
        const q = document.querySelector("nav");
        let J = 31;
        q && (J = q.getBoundingClientRect().height);
        const G = J * s.ds.scale, a = w.left + o, b = w.top + c - G, e = z.width * s.ds.scale, A = z.height * s.ds.scale;
        C.style.left = a + "px", C.style.top = b + "px", C.style.width = e + "px", C.style.height = A + "px", document.body.appendChild(C), N.push(C);
      }
    });
  }
  function $() {
    N.forEach((h) => {
      h.parentNode && h.parentNode.removeChild(h);
    }), N = [];
  }
  function B(h, s) {
    if (s.length < 2) return [];
    const l = [], u = Math.min(...s.map((o) => o.pos[0])), z = Math.max(...s.map((o) => {
      let c = 150;
      return o.size && Array.isArray(o.size) && o.size[0] ? c = o.size[0] : typeof o.width == "number" ? c = o.width : o.properties && typeof o.properties.width == "number" && (c = o.properties.width), o.pos[0] + c;
    })), f = Math.min(...s.map((o) => o.pos[1])), C = Math.max(...s.map((o) => {
      let c = 100;
      return o.size && Array.isArray(o.size) && o.size[1] ? c = o.size[1] : typeof o.height == "number" ? c = o.height : o.properties && typeof o.properties.height == "number" && (c = o.properties.height), o.pos[1] + c;
    }));
    switch (h) {
      case "left":
        const o = [...s].sort((t, p) => t.pos[1] - p.pos[1]);
        let c = o[0].pos[1];
        const m = /* @__PURE__ */ new Map();
        o.forEach((t) => {
          let p = 100, y = 150;
          t.size && Array.isArray(t.size) ? (t.size[1] && (p = t.size[1]), t.size[0] && (y = t.size[0])) : (typeof t.height == "number" && (p = t.height), typeof t.width == "number" && (y = t.width), t.properties && (typeof t.properties.height == "number" && (p = t.properties.height), typeof t.properties.width == "number" && (y = t.properties.width))), m.set(t.id, {
            x: u,
            y: c,
            width: y,
            height: p
          }), c += p + 30;
        }), s.forEach((t) => {
          l.push(m.get(t.id));
        });
        break;
      case "right":
        const w = [...s].sort((t, p) => t.pos[1] - p.pos[1]);
        let M = w[0].pos[1];
        const q = /* @__PURE__ */ new Map();
        w.forEach((t) => {
          let p = 100, y = 150;
          t.size && Array.isArray(t.size) ? (t.size[1] && (p = t.size[1]), t.size[0] && (y = t.size[0])) : (typeof t.height == "number" && (p = t.height), typeof t.width == "number" && (y = t.width), t.properties && (typeof t.properties.height == "number" && (p = t.properties.height), typeof t.properties.width == "number" && (y = t.properties.width))), q.set(t.id, {
            x: z - y,
            y: M,
            width: y,
            height: p
          }), M += p + 30;
        }), s.forEach((t) => {
          l.push(q.get(t.id));
        });
        break;
      case "top":
        const J = [...s].sort((t, p) => t.pos[0] - p.pos[0]);
        let G = J[0].pos[0];
        const a = /* @__PURE__ */ new Map();
        J.forEach((t) => {
          let p = 100, y = 150;
          t.size && Array.isArray(t.size) ? (t.size[1] && (p = t.size[1]), t.size[0] && (y = t.size[0])) : (typeof t.height == "number" && (p = t.height), typeof t.width == "number" && (y = t.width), t.properties && (typeof t.properties.height == "number" && (p = t.properties.height), typeof t.properties.width == "number" && (y = t.properties.width))), a.set(t.id, {
            x: G,
            y: f,
            width: y,
            height: p
          }), G += y + 30;
        }), s.forEach((t) => {
          l.push(a.get(t.id));
        });
        break;
      case "bottom":
        const b = [...s].sort((t, p) => t.pos[0] - p.pos[0]);
        let e = u;
        const A = /* @__PURE__ */ new Map();
        b.forEach((t) => {
          let p = 100, y = 150;
          t.size && Array.isArray(t.size) ? (t.size[1] && (p = t.size[1]), t.size[0] && (y = t.size[0])) : (typeof t.height == "number" && (p = t.height), typeof t.width == "number" && (y = t.width), t.properties && (typeof t.properties.height == "number" && (p = t.properties.height), typeof t.properties.width == "number" && (y = t.properties.width))), A.set(t.id, {
            x: e,
            y: C - p,
            width: y,
            height: p
          }), e += y + 30;
        }), s.forEach((t) => {
          l.push(A.get(t.id));
        });
        break;
      case "horizontal-flow":
        const P = s.filter((t) => {
          if (!t) return !1;
          const p = t.pos || t.position || typeof t.x == "number" && typeof t.y == "number", y = t.size || t.width || t.height || typeof t.width == "number" && typeof t.height == "number";
          return !!p && !!y;
        });
        if (P.length < 2) break;
        const ot = Math.min(...P.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[0] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[0] : typeof t.x == "number" ? t.x : 0)), ut = Math.min(...P.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[1] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[1] : typeof t.y == "number" ? t.y : 0)), it = P.map((t) => ({
          ...t,
          pos: t.pos ? [...t.pos] : [t.x || 0, t.y || 0],
          _calculatedSize: t.size && Array.isArray(t.size) ? [t.size[0], t.size[1]] : [t.width || 150, t.height || 100]
        })), i = F(it), r = L(it, i), x = 30, _ = 30, E = 5, lt = {};
        it.forEach((t) => {
          var p;
          if (t && t.id) {
            const y = ((p = r[t.id]) == null ? void 0 : p.level) ?? 0;
            lt[y] || (lt[y] = []), lt[y].push(t);
          }
        });
        const yt = /* @__PURE__ */ new Map();
        Object.entries(lt).forEach(([t, p]) => {
          const y = parseInt(t);
          if (p && p.length > 0) {
            p.sort((n, T) => {
              const tt = n && n.id && r[n.id] ? r[n.id].order : 0, k = T && T.id && r[T.id] ? r[T.id].order : 0;
              return tt - k;
            });
            let Q = ot;
            if (y > 0)
              for (let n = 0; n < y; n++) {
                const T = lt[n] || [], tt = Math.max(...T.map(
                  (k) => k && k._calculatedSize && k._calculatedSize[0] ? k._calculatedSize[0] : 150
                ));
                Q += tt + x + E;
              }
            let Z = ut;
            p.forEach((n) => {
              n && n._calculatedSize && (yt.set(n.id, {
                x: Q,
                y: Z,
                width: n._calculatedSize[0],
                height: n._calculatedSize[1]
              }), Z += n._calculatedSize[1] + _);
            });
          }
        }), s.forEach((t) => {
          const p = yt.get(t.id);
          p && l.push(p);
        });
        break;
      case "vertical-flow":
        const vt = s.filter((t) => {
          if (!t) return !1;
          const p = t.pos || t.position || typeof t.x == "number" && typeof t.y == "number", y = t.size || t.width || t.height || typeof t.width == "number" && typeof t.height == "number";
          return !!p && !!y;
        });
        if (vt.length < 2) break;
        const Tt = Math.min(...vt.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[0] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[0] : typeof t.x == "number" ? t.x : 0)), Bt = Math.min(...vt.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[1] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[1] : typeof t.y == "number" ? t.y : 0)), dt = vt.map((t) => ({
          ...t,
          pos: t.pos ? [...t.pos] : [t.x || 0, t.y || 0],
          _calculatedSize: t.size && Array.isArray(t.size) ? [t.size[0], t.size[1]] : [t.width || 150, t.height || 100]
        })), Lt = F(dt), ht = L(dt, Lt), Ht = 30, Ot = 30, Ft = 5, ft = {};
        dt.forEach((t) => {
          var p;
          if (t && t.id) {
            const y = ((p = ht[t.id]) == null ? void 0 : p.level) ?? 0;
            ft[y] || (ft[y] = []), ft[y].push(t);
          }
        });
        const At = /* @__PURE__ */ new Map();
        Object.entries(ft).forEach(([t, p]) => {
          const y = parseInt(t);
          if (p && p.length > 0) {
            p.sort((n, T) => {
              const tt = n && n.id && ht[n.id] ? ht[n.id].order : 0, k = T && T.id && ht[T.id] ? ht[T.id].order : 0;
              return tt - k;
            });
            let Q = Bt;
            if (y > 0)
              for (let n = 0; n < y; n++) {
                const T = ft[n] || [], tt = Math.max(...T.map(
                  (k) => k && k._calculatedSize && k._calculatedSize[1] ? k._calculatedSize[1] : 100
                ));
                Q += tt + Ht + Ft;
              }
            let Z = Tt;
            p.forEach((n) => {
              n && n._calculatedSize && (At.set(n.id, {
                x: Z,
                y: Q,
                width: n._calculatedSize[0],
                height: n._calculatedSize[1]
              }), Z += n._calculatedSize[0] + Ot);
            });
          }
        }), s.forEach((t) => {
          const p = At.get(t.id);
          p && l.push(p);
        });
        break;
      case "width-max":
      case "width-min":
      case "height-max":
      case "height-min":
      case "size-max":
      case "size-min":
        s.forEach((t) => {
          let p = 150, y = 100;
          t.size && Array.isArray(t.size) ? (t.size[0] && (p = t.size[0]), t.size[1] && (y = t.size[1])) : (typeof t.width == "number" && (p = t.width), typeof t.height == "number" && (y = t.height), t.properties && (typeof t.properties.width == "number" && (p = t.properties.width), typeof t.properties.height == "number" && (y = t.properties.height)));
          let Q = p, Z = y;
          if (h === "width-max" || h === "size-max")
            Q = Math.max(...s.map((n) => n.size && Array.isArray(n.size) && n.size[0] ? n.size[0] : typeof n.width == "number" ? n.width : n.properties && typeof n.properties.width == "number" ? n.properties.width : 150));
          else if (h === "width-min")
            Q = Math.min(...s.map((n) => n.size && Array.isArray(n.size) && n.size[0] ? n.size[0] : typeof n.width == "number" ? n.width : n.properties && typeof n.properties.width == "number" ? n.properties.width : 150));
          else if (h === "size-min") {
            const n = K.get(t) || t.computeSize;
            if (n)
              try {
                const T = n.call(t);
                T && T.length >= 2 && T[0] !== void 0 && T[1] !== void 0 ? (Q = T[0], Z = T[1] + 30) : typeof T == "number" ? (Q = p, Z = T + 30) : (Q = p, Z = y);
              } catch {
                Q = p, Z = y;
              }
          }
          if (h === "height-max" || h === "size-max")
            Z = Math.max(...s.map((n) => n.size && Array.isArray(n.size) && n.size[1] ? n.size[1] : typeof n.height == "number" ? n.height : n.properties && typeof n.properties.height == "number" ? n.properties.height : 100));
          else if (h === "height-min") {
            const n = Math.min(...s.map((k) => k.size && k.size[1] !== void 0 ? k.size[1] : typeof k.height == "number" ? k.height : k.properties && typeof k.properties.height == "number" ? k.properties.height : 100)), T = K.get(t) || t.computeSize;
            let tt = null;
            if (T)
              try {
                const k = T.call(t);
                k && k.length >= 2 && k[1] !== void 0 ? tt = k[1] + 30 : typeof k == "number" && (tt = k + 30);
              } catch {
              }
            Z = tt && tt > n ? tt : n;
          }
          l.push({
            x: t.pos[0],
            y: t.pos[1],
            width: Q,
            height: Z
          });
        });
        break;
    }
    return l;
  }
  function D(h, s = !1, l = !1) {
    const u = document.createElement("button");
    u.innerHTML = `
            <span style="font-size: 16px; display: block;">${h.icon}</span>
            <span style="font-size: 11px;">${h.label}</span>
        `;
    const z = l ? "#5b4a7e" : s ? "#4a5568" : "#505050", f = l ? "#6b5a8e" : s ? "#5a6578" : "#606060", C = l ? "#8b7ab8" : s ? "#718096" : "#666";
    return u.style.cssText = `
            background: linear-gradient(145deg, ${z}, #404040);
            border: 1px solid ${C};
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
        `, u.addEventListener("mouseenter", () => {
      u.style.background = `linear-gradient(145deg, ${f}, #505050)`, u.style.transform = "translateY(-1px)", u.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)", V(h.type);
    }), u.addEventListener("mouseleave", () => {
      u.style.background = `linear-gradient(145deg, ${z}, #404040)`, u.style.transform = "translateY(0)", u.style.boxShadow = "none", $();
    }), u.addEventListener("click", () => et(h.type)), u;
  }
  function O() {
    v = document.createElement("div"), v.className = "housekeeper-alignment-panel", v.style.cssText = `
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
    const h = document.createElement("div");
    h.innerHTML = "🎯 Node Alignment", h.style.cssText = `
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 12px;
            text-align: center;
            border-bottom: 1px solid #555;
            padding-bottom: 8px;
        `, v.appendChild(h);
    const s = document.createElement("div");
    s.style.cssText = `
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-bottom: 8px;
        `;
    const l = document.createElement("div");
    l.style.cssText = `
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
      { type: "vertical-flow", icon: "↓", label: "V-Flow" },
      { type: "width-max", icon: "⟷", label: "W-Max" },
      { type: "width-min", icon: "⟷", label: "W-Min" },
      { type: "height-max", icon: "⟺", label: "H-Max" },
      { type: "height-min", icon: "⟺", label: "H-Min" },
      { type: "size-max", icon: "⇱", label: "Size-Max" },
      { type: "size-min", icon: "↙", label: "Size-Min" }
    ], z = u.slice(0, 4), f = u.slice(4, 6), C = u.slice(6);
    z.forEach((m) => {
      const w = D(m);
      s.appendChild(w);
    }), f.forEach((m) => {
      const w = D(m, !0);
      l.appendChild(w);
    });
    const o = document.createElement("div");
    o.style.cssText = `
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-bottom: 12px;
            border-top: 1px solid #555;
            padding-top: 8px;
        `, C.forEach((m) => {
      const w = D(m, !1, !0);
      o.appendChild(w);
    }), v.appendChild(s), v.appendChild(l), v.appendChild(o);
    const c = document.createElement("div");
    c.id = "alignment-info", c.style.cssText = `
            background: rgba(60, 60, 60, 0.8);
            border-radius: 6px;
            padding: 10px;
            font-size: 12px;
            text-align: center;
        `, c.innerHTML = `
            Select multiple nodes to enable alignment<br>
            <small style="opacity: 0.8;">
                Basic: Ctrl+Shift+Arrows<br>
                Flow: Ctrl+Alt+→/↓
            </small>
        `, v.appendChild(c), document.body.appendChild(v);
  }
  function I() {
    var z;
    if (!((z = window.app) != null && z.graph)) return;
    g = Object.values(window.app.graph._nodes || {}).filter((f) => f && f.is_selected);
    const s = g.length > 1;
    s && !H ? d() : !s && H && W();
    const l = document.getElementById("alignment-info");
    l && (g.length === 0 ? l.innerHTML = `
                    Select multiple nodes to enable alignment<br>
                    <small style="opacity: 0.8;">
                        Basic: Ctrl+Shift+Arrows<br>
                        Flow: Ctrl+Alt+→/↓
                    </small>
                ` : g.length === 1 ? l.textContent = "Select additional nodes to align" : l.innerHTML = `
                    ${g.length} nodes selected - ready to align<br>
                    <small style="opacity: 0.8;">Try H-Flow/V-Flow for smart layout</small>
                `);
    const u = v == null ? void 0 : v.querySelectorAll("button");
    u == null || u.forEach((f) => {
      s ? (f.style.opacity = "1", f.style.pointerEvents = "auto") : (f.style.opacity = "0.5", f.style.pointerEvents = "none");
    });
  }
  function d() {
    v && (H = !0, v.style.display = "block", setTimeout(() => {
      v && (v.style.opacity = "1", v.style.transform = "translateX(0)");
    }, 10));
  }
  function W() {
    v && (H = !1, v.style.opacity = "0", v.style.transform = "translateX(20px)", setTimeout(() => {
      v && (v.style.display = "none");
    }, 300));
  }
  function F(h) {
    const s = {}, l = h.filter((u) => u && (u.id !== void 0 || u.id !== null));
    return l.forEach((u) => {
      const z = u.id || `node_${l.indexOf(u)}`;
      u.id = z, s[z] = { inputs: [], outputs: [] }, u.inputs && Array.isArray(u.inputs) && u.inputs.forEach((f, C) => {
        f && f.link !== null && f.link !== void 0 && s[z].inputs.push({
          index: C,
          link: f.link,
          sourceNode: st(f.link, l)
        });
      }), u.outputs && Array.isArray(u.outputs) && u.outputs.forEach((f, C) => {
        f && f.links && Array.isArray(f.links) && f.links.length > 0 && f.links.forEach((o) => {
          const c = R(o, l);
          c && s[z].outputs.push({
            index: C,
            link: o,
            targetNode: c
          });
        });
      });
    }), s;
  }
  function st(h, s) {
    for (const l of s)
      if (l && l.outputs && Array.isArray(l.outputs)) {
        for (const u of l.outputs)
          if (u && u.links && Array.isArray(u.links) && u.links.includes(h))
            return l;
      }
    return null;
  }
  function R(h, s) {
    for (const l of s)
      if (l && l.inputs && Array.isArray(l.inputs)) {
        for (const u of l.inputs)
          if (u && u.link === h)
            return l;
      }
    return null;
  }
  function L(h, s) {
    const l = {}, u = /* @__PURE__ */ new Set(), z = h.filter((c) => c && c.id), f = z.filter((c) => {
      const m = c.id;
      return !s[m] || !s[m].inputs.length || s[m].inputs.every((w) => !w.sourceNode);
    });
    f.length === 0 && z.length > 0 && f.push(z[0]);
    const C = f.map((c) => ({ node: c, level: 0 }));
    for (; C.length > 0; ) {
      const { node: c, level: m } = C.shift();
      !c || !c.id || u.has(c.id) || (u.add(c.id), l[c.id] = { level: m, order: 0 }, s[c.id] && s[c.id].outputs && s[c.id].outputs.forEach((w) => {
        w && w.targetNode && w.targetNode.id && !u.has(w.targetNode.id) && C.push({ node: w.targetNode, level: m + 1 });
      }));
    }
    z.forEach((c) => {
      c && c.id && !l[c.id] && (l[c.id] = { level: 0, order: 0 });
    });
    const o = {};
    return Object.entries(l).forEach(([c, m]) => {
      o[m.level] || (o[m.level] = []);
      const w = z.find((M) => M && M.id === c);
      w && o[m.level].push(w);
    }), Object.entries(o).forEach(([c, m]) => {
      m && m.length > 0 && (m.sort((w, M) => {
        const q = w && w.pos && w.pos[1] ? w.pos[1] : 0, J = M && M.pos && M.pos[1] ? M.pos[1] : 0;
        return q - J;
      }), m.forEach((w, M) => {
        w && w.id && l[w.id] && (l[w.id].order = M);
      }));
    }), l;
  }
  function et(h) {
    var s, l, u, z, f;
    if (g.length < 2) {
      S("Please select at least 2 nodes to align", "warning");
      return;
    }
    try {
      const C = Math.min(...g.map((a) => a.pos[0])), o = Math.max(...g.map((a) => {
        let b = 150;
        return a.size && Array.isArray(a.size) && a.size[0] ? b = a.size[0] : typeof a.width == "number" ? b = a.width : a.properties && typeof a.properties.width == "number" && (b = a.properties.width), a.pos[0] + b;
      })), c = Math.min(...g.map((a) => a.pos[1])), m = Math.max(...g.map((a) => {
        let b = 100;
        return a.size && Array.isArray(a.size) && a.size[1] ? b = a.size[1] : typeof a.height == "number" ? b = a.height : a.properties && typeof a.properties.height == "number" && (b = a.properties.height), a.pos[1] + b;
      })), w = Math.max(...g.map((a) => {
        const b = X.get(a);
        if (b && b.width !== void 0) return b.width;
        let e = 150;
        return a.size && Array.isArray(a.size) && a.size[0] ? e = a.size[0] : typeof a.width == "number" ? e = a.width : a.properties && typeof a.properties.width == "number" && (e = a.properties.width), e;
      })), M = Math.min(...g.map((a) => {
        const b = X.get(a);
        if (b && b.width !== void 0) return b.width;
        let e = 150;
        return a.size && Array.isArray(a.size) && a.size[0] ? e = a.size[0] : typeof a.width == "number" ? e = a.width : a.properties && typeof a.properties.width == "number" && (e = a.properties.width), e;
      })), q = Math.max(...g.map((a) => {
        const b = X.get(a);
        return b && b.height !== void 0 ? b.height : a.size && a.size[1] !== void 0 ? a.size[1] : typeof a.height == "number" ? a.height : a.properties && typeof a.properties.height == "number" ? a.properties.height : 100;
      })), J = Math.min(...g.map((a) => a.size && a.size[1] !== void 0 ? a.size[1] : typeof a.height == "number" ? a.height : a.properties && typeof a.properties.height == "number" ? a.properties.height : 100));
      let G;
      switch (h) {
        case "left":
          G = C;
          const a = [...g].sort((i, r) => i.pos[1] - r.pos[1]);
          let b = a[0].pos[1];
          a.forEach((i, r) => {
            let _ = 100;
            i.size && Array.isArray(i.size) && i.size[1] ? _ = i.size[1] : typeof i.height == "number" ? _ = i.height : i.properties && typeof i.properties.height == "number" && (_ = i.properties.height), i.pos[0] = G, i.pos[1] = b, typeof i.x == "number" && (i.x = i.pos[0]), typeof i.y == "number" && (i.y = i.pos[1]), b += _ + 30;
          });
          break;
        case "right":
          G = o;
          const e = [...g].sort((i, r) => i.pos[1] - r.pos[1]);
          let A = e[0].pos[1];
          e.forEach((i, r) => {
            let _ = 100, E = 150;
            i.size && Array.isArray(i.size) ? (i.size[1] && (_ = i.size[1]), i.size[0] && (E = i.size[0])) : (typeof i.height == "number" && (_ = i.height), typeof i.width == "number" && (E = i.width), i.properties && (typeof i.properties.height == "number" && (_ = i.properties.height), typeof i.properties.width == "number" && (E = i.properties.width))), i.pos[0] = G - E, i.pos[1] = A, typeof i.x == "number" && (i.x = i.pos[0]), typeof i.y == "number" && (i.y = i.pos[1]), A += _ + 30;
          });
          break;
        case "top":
          G = c;
          const P = [...g].sort((i, r) => i.pos[0] - r.pos[0]);
          let ot = P[0].pos[0];
          P.forEach((i, r) => {
            let _ = 150;
            i.size && Array.isArray(i.size) && i.size[0] ? _ = i.size[0] : typeof i.width == "number" ? _ = i.width : i.properties && typeof i.properties.width == "number" && (_ = i.properties.width), i.pos[1] = G, i.pos[0] = ot, typeof i.x == "number" && (i.x = i.pos[0]), typeof i.y == "number" && (i.y = i.pos[1]), ot += _ + 30;
          });
          break;
        case "bottom":
          G = m;
          const ut = [...g].sort((i, r) => i.pos[0] - r.pos[0]);
          let it = C;
          ut.forEach((i, r) => {
            let _ = 150, E = 100;
            i.size && Array.isArray(i.size) ? (i.size[0] && (_ = i.size[0]), i.size[1] && (E = i.size[1])) : (typeof i.width == "number" && (_ = i.width), typeof i.height == "number" && (E = i.height), i.properties && (typeof i.properties.width == "number" && (_ = i.properties.width), typeof i.properties.height == "number" && (E = i.properties.height)));
            const lt = G - E, yt = it;
            i.pos[1] = lt, i.pos[0] = yt, typeof i.x == "number" && (i.x = i.pos[0]), typeof i.y == "number" && (i.y = i.pos[1]), it += _ + 30;
          });
          break;
        case "width-max":
          g.forEach((i) => {
            i.size && (i.size[0] = w);
          });
          break;
        case "width-min":
          g.forEach((i) => {
            i.size && (i.size[0] = M);
          });
          break;
        case "height-max":
          g.forEach((i) => {
            i.size && (i.size[1] = q);
          });
          break;
        case "height-min":
          g.forEach((i) => {
            if (i.size) {
              const r = K.get(i) || i.computeSize;
              if (r) {
                const x = r.call(i);
                i.size[1] = Math.max(J, x[1]);
              }
            }
          });
          break;
        case "size-max":
          g.forEach((i) => {
            i.size && (i.size[0] = w, i.size[1] = q);
          });
          break;
        case "size-min":
          g.forEach((i) => {
            if (i.size) {
              const r = K.get(i) || i.computeSize;
              if (r) {
                const x = r.call(i);
                i.size[0] = x[0], i.size[1] = x[1];
              }
            }
          });
          break;
        case "horizontal-flow":
          ct();
          return;
        // Don't continue to the success message at the bottom
        case "vertical-flow":
          pt();
          return;
      }
      try {
        (l = (s = window.app) == null ? void 0 : s.canvas) != null && l.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (z = (u = window.app) == null ? void 0 : u.graph) != null && z.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (f = window.app) != null && f.canvas && window.app.canvas.draw(!0, !0);
      } catch {
      }
    } catch {
      S("Error during alignment", "error");
    }
  }
  function at(h) {
  }
  function ct() {
    var h, s, l, u, z;
    try {
      const f = g.filter((e) => {
        if (!e) return !1;
        const A = e.pos || e.position || typeof e.x == "number" && typeof e.y == "number", P = e.size || e.width || e.height || typeof e.width == "number" && typeof e.height == "number";
        return !!A && !!P;
      });
      if (f.length < 2) {
        S(`Not enough valid nodes: ${f.length}/${g.length} nodes are valid`, "warning");
        return;
      }
      const C = Math.min(...f.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[0] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[0] : typeof e.x == "number" ? e.x : 0)), o = Math.min(...f.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[1] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[1] : typeof e.y == "number" ? e.y : 0)), c = C, m = o;
      f.forEach((e) => {
        e.pos || (e.position && Array.isArray(e.position) ? e.pos = e.position : typeof e.x == "number" && typeof e.y == "number" ? e.pos = [e.x, e.y] : e.pos = [0, 0]), e._calculatedSize || (e.size && Array.isArray(e.size) ? e._calculatedSize = [e.size[0], e.size[1]] : typeof e.width == "number" && typeof e.height == "number" ? e._calculatedSize = [e.width, e.height] : e._calculatedSize = [150, 100]), Array.isArray(e.pos) || (e.pos = [0, 0]);
      });
      const w = F(f), M = L(f, w), q = 30, J = 30, G = 30, a = 5, b = {};
      f.forEach((e) => {
        var A;
        if (e && e.id) {
          const P = ((A = M[e.id]) == null ? void 0 : A.level) ?? 0;
          b[P] || (b[P] = []), b[P].push(e);
        }
      }), Object.entries(b).forEach(([e, A]) => {
        const P = parseInt(e);
        if (A && A.length > 0) {
          A.sort((r, x) => {
            const _ = r && r.id && M[r.id] ? M[r.id].order : 0, E = x && x.id && M[x.id] ? M[x.id].order : 0;
            return _ - E;
          });
          const ot = A.reduce((r, x, _) => {
            const E = x && x._calculatedSize && x._calculatedSize[1] ? x._calculatedSize[1] : 100;
            return r + E + (_ < A.length - 1 ? G : 0);
          }, 0), ut = Math.max(...A.map(
            (r) => r && r._calculatedSize && r._calculatedSize[0] ? r._calculatedSize[0] : 150
          ));
          let it = c;
          if (P > 0)
            for (let r = 0; r < P; r++) {
              const x = b[r] || [], _ = Math.max(...x.map(
                (E) => E && E._calculatedSize && E._calculatedSize[0] ? E._calculatedSize[0] : 150
              ));
              it += _ + q + a;
            }
          let i = m;
          A.forEach((r, x) => {
            if (r && r.pos && r._calculatedSize) {
              const _ = [r.pos[0], r.pos[1]], E = [r._calculatedSize[0], r._calculatedSize[1]];
              r.pos[0] = it, r.pos[1] = i, i += r._calculatedSize[1] + G, typeof r.x == "number" && (r.x = r.pos[0]), typeof r.y == "number" && (r.y = r.pos[1]);
            }
          });
        }
      });
      try {
        (s = (h = window.app) == null ? void 0 : h.canvas) != null && s.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (u = (l = window.app) == null ? void 0 : l.graph) != null && u.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (z = window.app) != null && z.canvas && window.app.canvas.draw(!0, !0);
      } catch {
      }
    } catch {
      S("Error in horizontal flow alignment", "error");
    }
  }
  function pt() {
    var h, s, l, u, z;
    try {
      const f = g.filter((e) => {
        if (!e) return !1;
        const A = e.pos || e.position || typeof e.x == "number" && typeof e.y == "number", P = e.size || e.width || e.height || typeof e.width == "number" && typeof e.height == "number";
        return !!A && !!P;
      });
      if (f.length < 2) {
        S(`Not enough valid nodes: ${f.length}/${g.length} nodes are valid`, "warning");
        return;
      }
      const C = Math.min(...f.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[0] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[0] : typeof e.x == "number" ? e.x : 0)), o = Math.min(...f.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[1] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[1] : typeof e.y == "number" ? e.y : 0)), c = C, m = o;
      f.forEach((e) => {
        e.pos || (e.position && Array.isArray(e.position) ? e.pos = e.position : typeof e.x == "number" && typeof e.y == "number" ? e.pos = [e.x, e.y] : e.pos = [0, 0]), e._calculatedSize || (e.size && Array.isArray(e.size) ? e._calculatedSize = [e.size[0], e.size[1]] : typeof e.width == "number" && typeof e.height == "number" ? e._calculatedSize = [e.width, e.height] : e._calculatedSize = [150, 100]), Array.isArray(e.pos) || (e.pos = [0, 0]);
      });
      const w = F(f), M = L(f, w), q = 30, J = 30, G = 30, a = 5, b = {};
      f.forEach((e) => {
        var A;
        if (e && e.id) {
          const P = ((A = M[e.id]) == null ? void 0 : A.level) ?? 0;
          b[P] || (b[P] = []), b[P].push(e);
        }
      }), Object.entries(b).forEach(([e, A]) => {
        const P = parseInt(e);
        if (A && A.length > 0) {
          A.sort((r, x) => {
            const _ = r && r.id && M[r.id] ? M[r.id].order : 0, E = x && x.id && M[x.id] ? M[x.id].order : 0;
            return _ - E;
          });
          const ot = A.reduce((r, x, _) => {
            const E = x && x._calculatedSize && x._calculatedSize[0] ? x._calculatedSize[0] : 150;
            return r + E + J;
          }, 0), ut = Math.max(...A.map(
            (r) => r && r._calculatedSize && r._calculatedSize[1] ? r._calculatedSize[1] : 100
          ));
          let it = m;
          if (P > 0)
            for (let r = 0; r < P; r++) {
              const x = b[r] || [], _ = Math.max(...x.map(
                (E) => E && E._calculatedSize && E._calculatedSize[1] ? E._calculatedSize[1] : 100
              ));
              it += _ + q + a;
            }
          let i = c;
          A.forEach((r, x) => {
            if (r && r.pos && r._calculatedSize) {
              const _ = [r.pos[0], r.pos[1]], E = [r._calculatedSize[0], r._calculatedSize[1]];
              r.pos[0] = i, r.pos[1] = it, i += r._calculatedSize[0] + J, typeof r.x == "number" && (r.x = r.pos[0]), typeof r.y == "number" && (r.y = r.pos[1]);
            }
          });
        }
      });
      try {
        (s = (h = window.app) == null ? void 0 : h.canvas) != null && s.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (u = (l = window.app) == null ? void 0 : l.graph) != null && u.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (z = window.app) != null && z.canvas && window.app.canvas.draw(!0, !0);
      } catch {
      }
    } catch {
      S("Error in vertical flow alignment", "error");
    }
  }
  function S(h, s = "info") {
    const l = document.createElement("div");
    l.textContent = h, l.style.cssText = `
            position: fixed;
            top: 60px;
            right: 10px;
            background: ${s === "success" ? "#4CAF50" : s === "warning" ? "#FF9800" : s === "error" ? "#F44336" : "#2196F3"};
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
        `, document.body.appendChild(l), setTimeout(() => {
      l.style.opacity = "1", l.style.transform = "translateX(0)";
    }, 10), setTimeout(() => {
      l.style.opacity = "0", l.style.transform = "translateX(20px)", setTimeout(() => {
        l.parentNode && l.parentNode.removeChild(l);
      }, 300);
    }, 3e3);
  }
  function U() {
    var h;
    if (!((h = window.app) != null && h.canvas)) {
      setTimeout(U, 100);
      return;
    }
    window.app.canvas.canvas && (window.app.canvas.canvas.addEventListener("click", () => {
      setTimeout(I, 10);
    }), window.app.canvas.canvas.addEventListener("mouseup", () => {
      setTimeout(I, 10);
    }), document.addEventListener("keydown", (s) => {
      (s.ctrlKey || s.metaKey) && setTimeout(I, 10);
    })), setInterval(I, 500);
  }
  function zt(h) {
    if (h.ctrlKey || h.metaKey) {
      if (h.shiftKey)
        switch (h.key) {
          case "ArrowLeft":
            h.preventDefault(), et("left");
            break;
          case "ArrowRight":
            h.preventDefault(), et("right");
            break;
          case "ArrowUp":
            h.preventDefault(), et("top");
            break;
          case "ArrowDown":
            h.preventDefault(), et("bottom");
            break;
        }
      else if (h.altKey)
        switch (h.key) {
          case "ArrowRight":
            h.preventDefault(), et("horizontal-flow");
            break;
          case "ArrowDown":
            h.preventDefault(), et("vertical-flow");
            break;
        }
    }
  }
  O(), U(), document.addEventListener("keydown", zt);
}
