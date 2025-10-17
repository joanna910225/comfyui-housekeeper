import { app as Xt } from "../../../scripts/app.js";
import { ComponentWidgetImpl as It, addWidget as Wt } from "../../../scripts/domWidget.js";
import { defineComponent as zt, ref as j, resolveDirective as Yt, createElementBlock as mt, openBlock as nt, Fragment as Ct, createElementVNode as rt, withDirectives as Vt, createVNode as wt, createBlock as Et, unref as Y, normalizeClass as kt, withCtx as xt, createTextVNode as Mt, toDisplayString as gt, renderList as $t, normalizeStyle as Rt, onMounted as Nt, nextTick as Gt } from "vue";
import St from "primevue/button";
import { useI18n as Dt } from "vue-i18n";
const jt = { class: "toolbar" }, Ut = { class: "color-picker" }, Kt = { class: "size-slider" }, qt = ["value"], Jt = /* @__PURE__ */ zt({
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
    function b(W) {
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
            onChange: F[1] || (F[1] = (R) => b(R))
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
}, Qt = /* @__PURE__ */ _t(Jt, [["__scopeId", "data-v-cae98791"]]), Zt = { class: "drawing-board" }, te = { class: "canvas-container" }, ee = ["width", "height"], ie = /* @__PURE__ */ zt({
  __name: "DrawingBoard",
  props: {
    width: {},
    height: {},
    initialColor: {},
    initialBrushSize: {}
  },
  emits: ["mounted", "drawing-start", "drawing", "drawing-end", "state-save", "canvas-clear"],
  setup(v, { expose: H, emit: g }) {
    const N = v, X = N.width || 800, K = N.height || 500, V = N.initialColor || "#000000", $ = N.initialBrushSize || 5, B = g, D = j(!1), O = j(0), I = j(0), b = j(null), W = j(!1), F = j($), st = j(V), R = j(null), L = j(null);
    Nt(() => {
      L.value && (b.value = L.value.getContext("2d"), et(), Gt(() => {
        L.value && B("mounted", L.value);
      }));
    });
    function et() {
      b.value && (b.value.fillStyle = "#ffffff", b.value.fillRect(0, 0, X, K), at(), h());
    }
    function at() {
      b.value && (W.value ? (b.value.globalCompositeOperation = "destination-out", b.value.strokeStyle = "rgba(0,0,0,1)") : (b.value.globalCompositeOperation = "source-over", b.value.strokeStyle = st.value), b.value.lineWidth = F.value, b.value.lineJoin = "round", b.value.lineCap = "round");
    }
    function ct(l) {
      D.value = !0;
      const { offsetX: c, offsetY: m } = U(l);
      O.value = c, I.value = m, b.value && (b.value.beginPath(), b.value.moveTo(O.value, I.value), b.value.arc(O.value, I.value, F.value / 2, 0, Math.PI * 2), b.value.fill(), B("drawing-start", {
        x: c,
        y: m,
        tool: W.value ? "eraser" : "pen"
      }));
    }
    function pt(l) {
      if (!D.value || !b.value) return;
      const { offsetX: c, offsetY: m } = U(l);
      b.value.beginPath(), b.value.moveTo(O.value, I.value), b.value.lineTo(c, m), b.value.stroke(), O.value = c, I.value = m, B("drawing", {
        x: c,
        y: m,
        tool: W.value ? "eraser" : "pen"
      });
    }
    function S() {
      D.value && (D.value = !1, h(), B("drawing-end"));
    }
    function U(l) {
      let c = 0, m = 0;
      if ("touches" in l) {
        if (l.preventDefault(), L.value) {
          const w = L.value.getBoundingClientRect();
          c = l.touches[0].clientX - w.left, m = l.touches[0].clientY - w.top;
        }
      } else
        c = l.offsetX, m = l.offsetY;
      return { offsetX: c, offsetY: m };
    }
    function bt(l) {
      l.preventDefault();
      const m = {
        touches: [l.touches[0]]
      };
      ct(m);
    }
    function u(l) {
      if (l.preventDefault(), !D.value) return;
      const m = {
        touches: [l.touches[0]]
      };
      pt(m);
    }
    function s(l) {
      W.value = l === "eraser", at();
    }
    function o(l) {
      st.value = l, at();
    }
    function f(l) {
      F.value = l, at();
    }
    function d() {
      b.value && (b.value.fillStyle = "#ffffff", b.value.fillRect(0, 0, X, K), at(), h(), B("canvas-clear"));
    }
    function h() {
      L.value && (R.value = L.value.toDataURL("image/png"), R.value && B("state-save", R.value));
    }
    async function k() {
      if (!L.value)
        throw new Error("Canvas is unable to get current data");
      return R.value ? R.value : L.value.toDataURL("image/png");
    }
    return H({
      setTool: s,
      setColor: o,
      setBrushSize: f,
      clearCanvas: d,
      getCurrentCanvasData: k
    }), (l, c) => (nt(), mt("div", Zt, [
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
          onTouchstart: bt,
          onTouchmove: u,
          onTouchend: S
        }, null, 40, ee)
      ])
    ]));
  }
}), re = /* @__PURE__ */ _t(ie, [["__scopeId", "data-v-ca1239fc"]]), se = { class: "drawing-app" }, ae = /* @__PURE__ */ zt({
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
    function b(S) {
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
        onToolChange: b,
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
}), oe = /* @__PURE__ */ _t(ae, [["__scopeId", "data-v-39bbf58b"]]), le = /* @__PURE__ */ zt({
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
        const D = await fetch(V).then((F) => F.blob()), O = `${$}_${Date.now()}.png`, I = new File([D], O), b = new FormData();
        return b.append("image", I), b.append("subfolder", "threed"), b.append("type", "temp"), console.log("Vue Component: Using window.app.api.fetchApi"), (await window.app.api.fetchApi("/upload/image", {
          method: "POST",
          body: b
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
  function V(u) {
    var f;
    if (g.length < 2) return;
    $();
    const s = (f = window.app) == null ? void 0 : f.canvas;
    if (!s) return;
    B(u, g).forEach((d, h) => {
      if (d && g[h]) {
        const k = document.createElement("div");
        k.style.cssText = `
                    position: fixed;
                    background: rgba(74, 144, 226, 0.3);
                    border: 2px dashed rgba(74, 144, 226, 0.7);
                    border-radius: 4px;
                    z-index: 999;
                    pointer-events: none;
                    transition: all 0.2s ease;
                `;
        const l = (d.x + s.ds.offset[0]) * s.ds.scale, c = (d.y + s.ds.offset[1]) * s.ds.scale, m = s.canvas.parentElement, w = s.canvas.getBoundingClientRect(), M = m ? m.getBoundingClientRect() : null;
        M && w.top - M.top, w.top;
        const q = document.querySelector("nav");
        let J = 31;
        q && (J = q.getBoundingClientRect().height);
        const G = J * s.ds.scale, a = w.left + l, z = w.top + c - G, e = d.width * s.ds.scale, A = d.height * s.ds.scale;
        k.style.left = a + "px", k.style.top = z + "px", k.style.width = e + "px", k.style.height = A + "px", document.body.appendChild(k), N.push(k);
      }
    });
  }
  function $() {
    N.forEach((u) => {
      u.parentNode && u.parentNode.removeChild(u);
    }), N = [];
  }
  function B(u, s) {
    if (s.length < 2) return [];
    const o = [], f = Math.min(...s.map((l) => l.pos[0])), d = Math.max(...s.map((l) => {
      let c = 150;
      return l.size && Array.isArray(l.size) && l.size[0] ? c = l.size[0] : typeof l.width == "number" ? c = l.width : l.properties && typeof l.properties.width == "number" && (c = l.properties.width), l.pos[0] + c;
    })), h = Math.min(...s.map((l) => l.pos[1])), k = Math.max(...s.map((l) => {
      let c = 100;
      return l.size && Array.isArray(l.size) && l.size[1] ? c = l.size[1] : typeof l.height == "number" ? c = l.height : l.properties && typeof l.properties.height == "number" && (c = l.properties.height), l.pos[1] + c;
    }));
    switch (u) {
      case "left":
        const l = [...s].sort((t, p) => t.pos[1] - p.pos[1]);
        let c = l[0].pos[1];
        const m = /* @__PURE__ */ new Map();
        l.forEach((t) => {
          let p = 100, y = 150;
          t.size && Array.isArray(t.size) ? (t.size[1] && (p = t.size[1]), t.size[0] && (y = t.size[0])) : (typeof t.height == "number" && (p = t.height), typeof t.width == "number" && (y = t.width), t.properties && (typeof t.properties.height == "number" && (p = t.properties.height), typeof t.properties.width == "number" && (y = t.properties.width))), m.set(t.id, {
            x: f,
            y: c,
            width: y,
            height: p
          }), c += p + 30;
        }), s.forEach((t) => {
          o.push(m.get(t.id));
        });
        break;
      case "right":
        const w = [...s].sort((t, p) => t.pos[1] - p.pos[1]);
        let M = w[0].pos[1];
        const q = /* @__PURE__ */ new Map();
        w.forEach((t) => {
          let p = 100, y = 150;
          t.size && Array.isArray(t.size) ? (t.size[1] && (p = t.size[1]), t.size[0] && (y = t.size[0])) : (typeof t.height == "number" && (p = t.height), typeof t.width == "number" && (y = t.width), t.properties && (typeof t.properties.height == "number" && (p = t.properties.height), typeof t.properties.width == "number" && (y = t.properties.width))), q.set(t.id, {
            x: d - y,
            y: M,
            width: y,
            height: p
          }), M += p + 30;
        }), s.forEach((t) => {
          o.push(q.get(t.id));
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
            y: h,
            width: y,
            height: p
          }), G += y + 30;
        }), s.forEach((t) => {
          o.push(a.get(t.id));
        });
        break;
      case "bottom":
        const z = [...s].sort((t, p) => t.pos[0] - p.pos[0]);
        let e = f;
        const A = /* @__PURE__ */ new Map();
        z.forEach((t) => {
          let p = 100, y = 150;
          t.size && Array.isArray(t.size) ? (t.size[1] && (p = t.size[1]), t.size[0] && (y = t.size[0])) : (typeof t.height == "number" && (p = t.height), typeof t.width == "number" && (y = t.width), t.properties && (typeof t.properties.height == "number" && (p = t.properties.height), typeof t.properties.width == "number" && (y = t.properties.width))), A.set(t.id, {
            x: e,
            y: k - p,
            width: y,
            height: p
          }), e += y + 30;
        }), s.forEach((t) => {
          o.push(A.get(t.id));
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
        })), i = F(it), r = L(it, i), x = 30, _ = 30, C = 5, lt = {};
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
              const tt = n && n.id && r[n.id] ? r[n.id].order : 0, E = T && T.id && r[T.id] ? r[T.id].order : 0;
              return tt - E;
            });
            let Q = ot;
            if (y > 0)
              for (let n = 0; n < y; n++) {
                const T = lt[n] || [], tt = Math.max(...T.map(
                  (E) => E && E._calculatedSize && E._calculatedSize[0] ? E._calculatedSize[0] : 150
                ));
                Q += tt + x + C;
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
          p && o.push(p);
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
              const tt = n && n.id && ht[n.id] ? ht[n.id].order : 0, E = T && T.id && ht[T.id] ? ht[T.id].order : 0;
              return tt - E;
            });
            let Q = Bt;
            if (y > 0)
              for (let n = 0; n < y; n++) {
                const T = ft[n] || [], tt = Math.max(...T.map(
                  (E) => E && E._calculatedSize && E._calculatedSize[1] ? E._calculatedSize[1] : 100
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
          p && o.push(p);
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
          if (u === "width-max" || u === "size-max")
            Q = Math.max(...s.map((n) => n.size && Array.isArray(n.size) && n.size[0] ? n.size[0] : typeof n.width == "number" ? n.width : n.properties && typeof n.properties.width == "number" ? n.properties.width : 150));
          else if (u === "width-min")
            Q = Math.min(...s.map((n) => n.size && Array.isArray(n.size) && n.size[0] ? n.size[0] : typeof n.width == "number" ? n.width : n.properties && typeof n.properties.width == "number" ? n.properties.width : 150));
          else if (u === "size-min") {
            const n = K.get(t) || t.computeSize;
            if (n)
              try {
                const T = n.call(t);
                T && T.length >= 2 && T[0] !== void 0 && T[1] !== void 0 ? (Q = T[0], Z = T[1] + 30) : typeof T == "number" ? (Q = p, Z = T + 30) : (Q = p, Z = y);
              } catch {
                Q = p, Z = y;
              }
          }
          if (u === "height-max" || u === "size-max")
            Z = Math.max(...s.map((n) => n.size && Array.isArray(n.size) && n.size[1] ? n.size[1] : typeof n.height == "number" ? n.height : n.properties && typeof n.properties.height == "number" ? n.properties.height : 100));
          else if (u === "height-min") {
            const n = Math.min(...s.map((E) => E.size && E.size[1] !== void 0 ? E.size[1] : typeof E.height == "number" ? E.height : E.properties && typeof E.properties.height == "number" ? E.properties.height : 100)), T = K.get(t) || t.computeSize;
            let tt = null;
            if (T)
              try {
                const E = T.call(t);
                E && E.length >= 2 && E[1] !== void 0 ? tt = E[1] + 30 : typeof E == "number" && (tt = E + 30);
              } catch {
              }
            Z = tt && tt > n ? tt : n;
          }
          o.push({
            x: t.pos[0],
            y: t.pos[1],
            width: Q,
            height: Z
          });
        });
        break;
    }
    return o;
  }
  function D(u, s = !1) {
    const o = document.createElement("button");
    o.innerHTML = `
            <span style="font-size: 16px; display: block;">${u.icon}</span>
            <span style="font-size: 11px;">${u.label}</span>
        `;
    const f = s ? "#4a5568" : "#505050", d = s ? "#5a6578" : "#606060";
    return o.style.cssText = `
            background: linear-gradient(145deg, ${f}, #404040);
            border: 1px solid ${s ? "#718096" : "#666"};
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
        `, o.addEventListener("mouseenter", () => {
      o.style.background = `linear-gradient(145deg, ${d}, #505050)`, o.style.transform = "translateY(-1px)", o.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)", V(u.type);
    }), o.addEventListener("mouseleave", () => {
      o.style.background = `linear-gradient(145deg, ${f}, #404040)`, o.style.transform = "translateY(0)", o.style.boxShadow = "none", $();
    }), o.addEventListener("click", () => et(u.type)), o;
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
    const u = document.createElement("div");
    u.innerHTML = "🎯 Node Alignment", u.style.cssText = `
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 12px;
            text-align: center;
            border-bottom: 1px solid #555;
            padding-bottom: 8px;
        `, v.appendChild(u);
    const s = document.createElement("div");
    s.style.cssText = `
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-bottom: 8px;
        `;
    const o = document.createElement("div");
    o.style.cssText = `
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-bottom: 12px;
            border-top: 1px solid #555;
            padding-top: 8px;
        `;
    const f = [
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
    ], d = f.slice(0, 4), h = f.slice(4, 6), k = f.slice(6);
    d.forEach((m) => {
      const w = D(m);
      s.appendChild(w);
    }), h.forEach((m) => {
      const w = D(m, !0);
      o.appendChild(w);
    });
    const l = document.createElement("div");
    l.style.cssText = `
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-bottom: 12px;
            border-top: 1px solid #555;
            padding-top: 8px;
        `, k.forEach((m) => {
      const w = D(m, !0);
      l.appendChild(w);
    }), v.appendChild(s), v.appendChild(o), v.appendChild(l);
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
    var d;
    if (!((d = window.app) != null && d.graph)) return;
    g = Object.values(window.app.graph._nodes || {}).filter((h) => h && h.is_selected);
    const s = g.length > 1;
    s && !H ? b() : !s && H && W();
    const o = document.getElementById("alignment-info");
    o && (g.length === 0 ? o.innerHTML = `
                    Select multiple nodes to enable alignment<br>
                    <small style="opacity: 0.8;">
                        Basic: Ctrl+Shift+Arrows<br>
                        Flow: Ctrl+Alt+→/↓
                    </small>
                ` : g.length === 1 ? o.textContent = "Select additional nodes to align" : o.innerHTML = `
                    ${g.length} nodes selected - ready to align<br>
                    <small style="opacity: 0.8;">Try H-Flow/V-Flow for smart layout</small>
                `);
    const f = v == null ? void 0 : v.querySelectorAll("button");
    f == null || f.forEach((h) => {
      s ? (h.style.opacity = "1", h.style.pointerEvents = "auto") : (h.style.opacity = "0.5", h.style.pointerEvents = "none");
    });
  }
  function b() {
    v && (H = !0, v.style.display = "block", setTimeout(() => {
      v && (v.style.opacity = "1", v.style.transform = "translateX(0)");
    }, 10));
  }
  function W() {
    v && (H = !1, v.style.opacity = "0", v.style.transform = "translateX(20px)", setTimeout(() => {
      v && (v.style.display = "none");
    }, 300));
  }
  function F(u) {
    const s = {}, o = u.filter((f) => f && (f.id !== void 0 || f.id !== null));
    return o.forEach((f) => {
      const d = f.id || `node_${o.indexOf(f)}`;
      f.id = d, s[d] = { inputs: [], outputs: [] }, f.inputs && Array.isArray(f.inputs) && f.inputs.forEach((h, k) => {
        h && h.link !== null && h.link !== void 0 && s[d].inputs.push({
          index: k,
          link: h.link,
          sourceNode: st(h.link, o)
        });
      }), f.outputs && Array.isArray(f.outputs) && f.outputs.forEach((h, k) => {
        h && h.links && Array.isArray(h.links) && h.links.length > 0 && h.links.forEach((l) => {
          const c = R(l, o);
          c && s[d].outputs.push({
            index: k,
            link: l,
            targetNode: c
          });
        });
      });
    }), s;
  }
  function st(u, s) {
    for (const o of s)
      if (o && o.outputs && Array.isArray(o.outputs)) {
        for (const f of o.outputs)
          if (f && f.links && Array.isArray(f.links) && f.links.includes(u))
            return o;
      }
    return null;
  }
  function R(u, s) {
    for (const o of s)
      if (o && o.inputs && Array.isArray(o.inputs)) {
        for (const f of o.inputs)
          if (f && f.link === u)
            return o;
      }
    return null;
  }
  function L(u, s) {
    const o = {}, f = /* @__PURE__ */ new Set(), d = u.filter((c) => c && c.id), h = d.filter((c) => {
      const m = c.id;
      return !s[m] || !s[m].inputs.length || s[m].inputs.every((w) => !w.sourceNode);
    });
    h.length === 0 && d.length > 0 && h.push(d[0]);
    const k = h.map((c) => ({ node: c, level: 0 }));
    for (; k.length > 0; ) {
      const { node: c, level: m } = k.shift();
      !c || !c.id || f.has(c.id) || (f.add(c.id), o[c.id] = { level: m, order: 0 }, s[c.id] && s[c.id].outputs && s[c.id].outputs.forEach((w) => {
        w && w.targetNode && w.targetNode.id && !f.has(w.targetNode.id) && k.push({ node: w.targetNode, level: m + 1 });
      }));
    }
    d.forEach((c) => {
      c && c.id && !o[c.id] && (o[c.id] = { level: 0, order: 0 });
    });
    const l = {};
    return Object.entries(o).forEach(([c, m]) => {
      l[m.level] || (l[m.level] = []);
      const w = d.find((M) => M && M.id === c);
      w && l[m.level].push(w);
    }), Object.entries(l).forEach(([c, m]) => {
      m && m.length > 0 && (m.sort((w, M) => {
        const q = w && w.pos && w.pos[1] ? w.pos[1] : 0, J = M && M.pos && M.pos[1] ? M.pos[1] : 0;
        return q - J;
      }), m.forEach((w, M) => {
        w && w.id && o[w.id] && (o[w.id].order = M);
      }));
    }), o;
  }
  function et(u) {
    var s, o, f, d, h;
    if (g.length < 2) {
      S("Please select at least 2 nodes to align", "warning");
      return;
    }
    try {
      const k = Math.min(...g.map((a) => a.pos[0])), l = Math.max(...g.map((a) => {
        let z = 150;
        return a.size && Array.isArray(a.size) && a.size[0] ? z = a.size[0] : typeof a.width == "number" ? z = a.width : a.properties && typeof a.properties.width == "number" && (z = a.properties.width), a.pos[0] + z;
      })), c = Math.min(...g.map((a) => a.pos[1])), m = Math.max(...g.map((a) => {
        let z = 100;
        return a.size && Array.isArray(a.size) && a.size[1] ? z = a.size[1] : typeof a.height == "number" ? z = a.height : a.properties && typeof a.properties.height == "number" && (z = a.properties.height), a.pos[1] + z;
      })), w = Math.max(...g.map((a) => {
        const z = X.get(a);
        if (z && z.width !== void 0) return z.width;
        let e = 150;
        return a.size && Array.isArray(a.size) && a.size[0] ? e = a.size[0] : typeof a.width == "number" ? e = a.width : a.properties && typeof a.properties.width == "number" && (e = a.properties.width), e;
      })), M = Math.min(...g.map((a) => {
        const z = X.get(a);
        if (z && z.width !== void 0) return z.width;
        let e = 150;
        return a.size && Array.isArray(a.size) && a.size[0] ? e = a.size[0] : typeof a.width == "number" ? e = a.width : a.properties && typeof a.properties.width == "number" && (e = a.properties.width), e;
      })), q = Math.max(...g.map((a) => {
        const z = X.get(a);
        return z && z.height !== void 0 ? z.height : a.size && a.size[1] !== void 0 ? a.size[1] : typeof a.height == "number" ? a.height : a.properties && typeof a.properties.height == "number" ? a.properties.height : 100;
      })), J = Math.min(...g.map((a) => a.size && a.size[1] !== void 0 ? a.size[1] : typeof a.height == "number" ? a.height : a.properties && typeof a.properties.height == "number" ? a.properties.height : 100));
      let G;
      switch (u) {
        case "left":
          G = k;
          const a = [...g].sort((i, r) => i.pos[1] - r.pos[1]);
          let z = a[0].pos[1];
          a.forEach((i, r) => {
            let _ = 100;
            i.size && Array.isArray(i.size) && i.size[1] ? _ = i.size[1] : typeof i.height == "number" ? _ = i.height : i.properties && typeof i.properties.height == "number" && (_ = i.properties.height), i.pos[0] = G, i.pos[1] = z, typeof i.x == "number" && (i.x = i.pos[0]), typeof i.y == "number" && (i.y = i.pos[1]), z += _ + 30;
          });
          break;
        case "right":
          G = l;
          const e = [...g].sort((i, r) => i.pos[1] - r.pos[1]);
          let A = e[0].pos[1];
          e.forEach((i, r) => {
            let _ = 100, C = 150;
            i.size && Array.isArray(i.size) ? (i.size[1] && (_ = i.size[1]), i.size[0] && (C = i.size[0])) : (typeof i.height == "number" && (_ = i.height), typeof i.width == "number" && (C = i.width), i.properties && (typeof i.properties.height == "number" && (_ = i.properties.height), typeof i.properties.width == "number" && (C = i.properties.width))), i.pos[0] = G - C, i.pos[1] = A, typeof i.x == "number" && (i.x = i.pos[0]), typeof i.y == "number" && (i.y = i.pos[1]), A += _ + 30;
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
          let it = k;
          ut.forEach((i, r) => {
            let _ = 150, C = 100;
            i.size && Array.isArray(i.size) ? (i.size[0] && (_ = i.size[0]), i.size[1] && (C = i.size[1])) : (typeof i.width == "number" && (_ = i.width), typeof i.height == "number" && (C = i.height), i.properties && (typeof i.properties.width == "number" && (_ = i.properties.width), typeof i.properties.height == "number" && (C = i.properties.height)));
            const lt = G - C, yt = it;
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
        (o = (s = window.app) == null ? void 0 : s.canvas) != null && o.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (d = (f = window.app) == null ? void 0 : f.graph) != null && d.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (h = window.app) != null && h.canvas && window.app.canvas.draw(!0, !0);
      } catch {
      }
    } catch {
      S("Error during alignment", "error");
    }
  }
  function at(u) {
  }
  function ct() {
    var u, s, o, f, d;
    try {
      const h = g.filter((e) => {
        if (!e) return !1;
        const A = e.pos || e.position || typeof e.x == "number" && typeof e.y == "number", P = e.size || e.width || e.height || typeof e.width == "number" && typeof e.height == "number";
        return !!A && !!P;
      });
      if (h.length < 2) {
        S(`Not enough valid nodes: ${h.length}/${g.length} nodes are valid`, "warning");
        return;
      }
      const k = Math.min(...h.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[0] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[0] : typeof e.x == "number" ? e.x : 0)), l = Math.min(...h.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[1] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[1] : typeof e.y == "number" ? e.y : 0)), c = k, m = l;
      h.forEach((e) => {
        e.pos || (e.position && Array.isArray(e.position) ? e.pos = e.position : typeof e.x == "number" && typeof e.y == "number" ? e.pos = [e.x, e.y] : e.pos = [0, 0]), e._calculatedSize || (e.size && Array.isArray(e.size) ? e._calculatedSize = [e.size[0], e.size[1]] : typeof e.width == "number" && typeof e.height == "number" ? e._calculatedSize = [e.width, e.height] : e._calculatedSize = [150, 100]), Array.isArray(e.pos) || (e.pos = [0, 0]);
      });
      const w = F(h), M = L(h, w), q = 30, J = 30, G = 30, a = 5, z = {};
      h.forEach((e) => {
        var A;
        if (e && e.id) {
          const P = ((A = M[e.id]) == null ? void 0 : A.level) ?? 0;
          z[P] || (z[P] = []), z[P].push(e);
        }
      }), Object.entries(z).forEach(([e, A]) => {
        const P = parseInt(e);
        if (A && A.length > 0) {
          A.sort((r, x) => {
            const _ = r && r.id && M[r.id] ? M[r.id].order : 0, C = x && x.id && M[x.id] ? M[x.id].order : 0;
            return _ - C;
          });
          const ot = A.reduce((r, x, _) => {
            const C = x && x._calculatedSize && x._calculatedSize[1] ? x._calculatedSize[1] : 100;
            return r + C + (_ < A.length - 1 ? G : 0);
          }, 0), ut = Math.max(...A.map(
            (r) => r && r._calculatedSize && r._calculatedSize[0] ? r._calculatedSize[0] : 150
          ));
          let it = c;
          if (P > 0)
            for (let r = 0; r < P; r++) {
              const x = z[r] || [], _ = Math.max(...x.map(
                (C) => C && C._calculatedSize && C._calculatedSize[0] ? C._calculatedSize[0] : 150
              ));
              it += _ + q + a;
            }
          let i = m;
          A.forEach((r, x) => {
            if (r && r.pos && r._calculatedSize) {
              const _ = [r.pos[0], r.pos[1]], C = [r._calculatedSize[0], r._calculatedSize[1]];
              r.pos[0] = it, r.pos[1] = i, i += r._calculatedSize[1] + G, typeof r.x == "number" && (r.x = r.pos[0]), typeof r.y == "number" && (r.y = r.pos[1]);
            }
          });
        }
      });
      try {
        (s = (u = window.app) == null ? void 0 : u.canvas) != null && s.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (f = (o = window.app) == null ? void 0 : o.graph) != null && f.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (d = window.app) != null && d.canvas && window.app.canvas.draw(!0, !0);
      } catch {
      }
    } catch {
      S("Error in horizontal flow alignment", "error");
    }
  }
  function pt() {
    var u, s, o, f, d;
    try {
      const h = g.filter((e) => {
        if (!e) return !1;
        const A = e.pos || e.position || typeof e.x == "number" && typeof e.y == "number", P = e.size || e.width || e.height || typeof e.width == "number" && typeof e.height == "number";
        return !!A && !!P;
      });
      if (h.length < 2) {
        S(`Not enough valid nodes: ${h.length}/${g.length} nodes are valid`, "warning");
        return;
      }
      const k = Math.min(...h.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[0] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[0] : typeof e.x == "number" ? e.x : 0)), l = Math.min(...h.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[1] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[1] : typeof e.y == "number" ? e.y : 0)), c = k, m = l;
      h.forEach((e) => {
        e.pos || (e.position && Array.isArray(e.position) ? e.pos = e.position : typeof e.x == "number" && typeof e.y == "number" ? e.pos = [e.x, e.y] : e.pos = [0, 0]), e._calculatedSize || (e.size && Array.isArray(e.size) ? e._calculatedSize = [e.size[0], e.size[1]] : typeof e.width == "number" && typeof e.height == "number" ? e._calculatedSize = [e.width, e.height] : e._calculatedSize = [150, 100]), Array.isArray(e.pos) || (e.pos = [0, 0]);
      });
      const w = F(h), M = L(h, w), q = 30, J = 30, G = 30, a = 5, z = {};
      h.forEach((e) => {
        var A;
        if (e && e.id) {
          const P = ((A = M[e.id]) == null ? void 0 : A.level) ?? 0;
          z[P] || (z[P] = []), z[P].push(e);
        }
      }), Object.entries(z).forEach(([e, A]) => {
        const P = parseInt(e);
        if (A && A.length > 0) {
          A.sort((r, x) => {
            const _ = r && r.id && M[r.id] ? M[r.id].order : 0, C = x && x.id && M[x.id] ? M[x.id].order : 0;
            return _ - C;
          });
          const ot = A.reduce((r, x, _) => {
            const C = x && x._calculatedSize && x._calculatedSize[0] ? x._calculatedSize[0] : 150;
            return r + C + J;
          }, 0), ut = Math.max(...A.map(
            (r) => r && r._calculatedSize && r._calculatedSize[1] ? r._calculatedSize[1] : 100
          ));
          let it = m;
          if (P > 0)
            for (let r = 0; r < P; r++) {
              const x = z[r] || [], _ = Math.max(...x.map(
                (C) => C && C._calculatedSize && C._calculatedSize[1] ? C._calculatedSize[1] : 100
              ));
              it += _ + q + a;
            }
          let i = c;
          A.forEach((r, x) => {
            if (r && r.pos && r._calculatedSize) {
              const _ = [r.pos[0], r.pos[1]], C = [r._calculatedSize[0], r._calculatedSize[1]];
              r.pos[0] = i, r.pos[1] = it, i += r._calculatedSize[0] + J, typeof r.x == "number" && (r.x = r.pos[0]), typeof r.y == "number" && (r.y = r.pos[1]);
            }
          });
        }
      });
      try {
        (s = (u = window.app) == null ? void 0 : u.canvas) != null && s.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (f = (o = window.app) == null ? void 0 : o.graph) != null && f.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (d = window.app) != null && d.canvas && window.app.canvas.draw(!0, !0);
      } catch {
      }
    } catch {
      S("Error in vertical flow alignment", "error");
    }
  }
  function S(u, s = "info") {
    const o = document.createElement("div");
    o.textContent = u, o.style.cssText = `
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
        `, document.body.appendChild(o), setTimeout(() => {
      o.style.opacity = "1", o.style.transform = "translateX(0)";
    }, 10), setTimeout(() => {
      o.style.opacity = "0", o.style.transform = "translateX(20px)", setTimeout(() => {
        o.parentNode && o.parentNode.removeChild(o);
      }, 300);
    }, 3e3);
  }
  function U() {
    var u;
    if (!((u = window.app) != null && u.canvas)) {
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
  function bt(u) {
    if (u.ctrlKey || u.metaKey) {
      if (u.shiftKey)
        switch (u.key) {
          case "ArrowLeft":
            u.preventDefault(), et("left");
            break;
          case "ArrowRight":
            u.preventDefault(), et("right");
            break;
          case "ArrowUp":
            u.preventDefault(), et("top");
            break;
          case "ArrowDown":
            u.preventDefault(), et("bottom");
            break;
        }
      else if (u.altKey)
        switch (u.key) {
          case "ArrowRight":
            u.preventDefault(), et("horizontal-flow");
            break;
          case "ArrowDown":
            u.preventDefault(), et("vertical-flow");
            break;
        }
    }
  }
  O(), U(), document.addEventListener("keydown", bt);
}
