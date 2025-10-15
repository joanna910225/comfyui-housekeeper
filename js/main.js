import { app as Xt } from "../../../scripts/app.js";
import { ComponentWidgetImpl as It, addWidget as Wt } from "../../../scripts/domWidget.js";
import { defineComponent as zt, ref as R, resolveDirective as Yt, createElementBlock as mt, openBlock as nt, Fragment as Ct, createElementVNode as rt, withDirectives as Vt, createVNode as wt, createBlock as Et, unref as I, normalizeClass as kt, withCtx as xt, createTextVNode as Mt, toDisplayString as gt, renderList as $t, normalizeStyle as Rt, onMounted as Nt, nextTick as Gt } from "vue";
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
  setup(y, { emit: B }) {
    const { t: g } = Dt(), M = y, L = B, U = M.colors || ["#000000", "#ff0000", "#0000ff", "#69a869", "#ffff00", "#ff00ff", "#00ffff"], W = R(M.initialColor || "#000000"), Y = R(M.initialBrushSize || 5), P = R(M.initialTool || "pen");
    function N(X) {
      P.value = X, L("tool-change", X);
    }
    function H(X) {
      W.value = X, L("color-change", X);
    }
    function F() {
      L("canvas-clear");
    }
    function d(X) {
      const O = X.target;
      Y.value = Number(O.value), L("brush-size-change", Y.value);
    }
    return (X, O) => {
      const st = Yt("tooltip");
      return nt(), mt(Ct, null, [
        rt("div", jt, [
          Vt((nt(), Et(I(St), {
            class: kt({ active: P.value === "pen" }),
            onClick: O[0] || (O[0] = (V) => N("pen"))
          }, {
            default: xt(() => [
              Mt(gt(I(g)("vue-basic.pen")), 1)
            ]),
            _: 1
          }, 8, ["class"])), [
            [st, { value: I(g)("vue-basic.pen-tooltip"), showDelay: 300 }]
          ]),
          wt(I(St), { onClick: F }, {
            default: xt(() => [
              Mt(gt(I(g)("vue-basic.clear-canvas")), 1)
            ]),
            _: 1
          })
        ]),
        rt("div", Ut, [
          (nt(!0), mt(Ct, null, $t(I(U), (V, T) => (nt(), Et(I(St), {
            key: T,
            class: kt({ "color-button": !0, active: W.value === V }),
            onClick: (Q) => H(V),
            type: "button",
            title: V
          }, {
            default: xt(() => [
              rt("i", {
                class: "pi pi-circle-fill",
                style: Rt({ color: V })
              }, null, 4)
            ]),
            _: 2
          }, 1032, ["class", "onClick", "title"]))), 128))
        ]),
        rt("div", Kt, [
          rt("label", null, gt(I(g)("vue-basic.brush-size")) + ": " + gt(Y.value) + "px", 1),
          rt("input", {
            type: "range",
            min: "1",
            max: "50",
            value: Y.value,
            onChange: O[1] || (O[1] = (V) => d(V))
          }, null, 40, qt)
        ])
      ], 64);
    };
  }
}), At = (y, B) => {
  const g = y.__vccOpts || y;
  for (const [M, L] of B)
    g[M] = L;
  return g;
}, Qt = /* @__PURE__ */ At(Jt, [["__scopeId", "data-v-cae98791"]]), Zt = { class: "drawing-board" }, te = { class: "canvas-container" }, ee = ["width", "height"], ie = /* @__PURE__ */ zt({
  __name: "DrawingBoard",
  props: {
    width: {},
    height: {},
    initialColor: {},
    initialBrushSize: {}
  },
  emits: ["mounted", "drawing-start", "drawing", "drawing-end", "state-save", "canvas-clear"],
  setup(y, { expose: B, emit: g }) {
    const M = y, L = M.width || 800, U = M.height || 500, W = M.initialColor || "#000000", Y = M.initialBrushSize || 5, P = g, N = R(!1), H = R(0), F = R(0), d = R(null), X = R(!1), O = R(Y), st = R(W), V = R(null), T = R(null);
    Nt(() => {
      T.value && (d.value = T.value.getContext("2d"), Q(), Gt(() => {
        T.value && P("mounted", T.value);
      }));
    });
    function Q() {
      d.value && (d.value.fillStyle = "#ffffff", d.value.fillRect(0, 0, L, U), at(), h());
    }
    function at() {
      d.value && (X.value ? (d.value.globalCompositeOperation = "destination-out", d.value.strokeStyle = "rgba(0,0,0,1)") : (d.value.globalCompositeOperation = "source-over", d.value.strokeStyle = st.value), d.value.lineWidth = O.value, d.value.lineJoin = "round", d.value.lineCap = "round");
    }
    function ct(n) {
      N.value = !0;
      const { offsetX: c, offsetY: m } = G(n);
      H.value = c, F.value = m, d.value && (d.value.beginPath(), d.value.moveTo(H.value, F.value), d.value.arc(H.value, F.value, O.value / 2, 0, Math.PI * 2), d.value.fill(), P("drawing-start", {
        x: c,
        y: m,
        tool: X.value ? "eraser" : "pen"
      }));
    }
    function pt(n) {
      if (!N.value || !d.value) return;
      const { offsetX: c, offsetY: m } = G(n);
      d.value.beginPath(), d.value.moveTo(H.value, F.value), d.value.lineTo(c, m), d.value.stroke(), H.value = c, F.value = m, P("drawing", {
        x: c,
        y: m,
        tool: X.value ? "eraser" : "pen"
      });
    }
    function A() {
      N.value && (N.value = !1, h(), P("drawing-end"));
    }
    function G(n) {
      let c = 0, m = 0;
      if ("touches" in n) {
        if (n.preventDefault(), T.value) {
          const v = T.value.getBoundingClientRect();
          c = n.touches[0].clientX - v.left, m = n.touches[0].clientY - v.top;
        }
      } else
        c = n.offsetX, m = n.offsetY;
      return { offsetX: c, offsetY: m };
    }
    function bt(n) {
      n.preventDefault();
      const m = {
        touches: [n.touches[0]]
      };
      ct(m);
    }
    function p(n) {
      if (n.preventDefault(), !N.value) return;
      const m = {
        touches: [n.touches[0]]
      };
      pt(m);
    }
    function s(n) {
      X.value = n === "eraser", at();
    }
    function o(n) {
      st.value = n, at();
    }
    function f(n) {
      O.value = n, at();
    }
    function x() {
      d.value && (d.value.fillStyle = "#ffffff", d.value.fillRect(0, 0, L, U), at(), h(), P("canvas-clear"));
    }
    function h() {
      T.value && (V.value = T.value.toDataURL("image/png"), V.value && P("state-save", V.value));
    }
    async function E() {
      if (!T.value)
        throw new Error("Canvas is unable to get current data");
      return V.value ? V.value : T.value.toDataURL("image/png");
    }
    return B({
      setTool: s,
      setColor: o,
      setBrushSize: f,
      clearCanvas: x,
      getCurrentCanvasData: E
    }), (n, c) => (nt(), mt("div", Zt, [
      rt("div", te, [
        rt("canvas", {
          ref_key: "canvas",
          ref: T,
          width: I(L),
          height: I(U),
          onMousedown: ct,
          onMousemove: pt,
          onMouseup: A,
          onMouseleave: A,
          onTouchstart: bt,
          onTouchmove: p,
          onTouchend: A
        }, null, 40, ee)
      ])
    ]));
  }
}), re = /* @__PURE__ */ At(ie, [["__scopeId", "data-v-ca1239fc"]]), se = { class: "drawing-app" }, ae = /* @__PURE__ */ zt({
  __name: "DrawingApp",
  props: {
    width: {},
    height: {},
    initialColor: {},
    initialBrushSize: {},
    availableColors: {}
  },
  emits: ["tool-change", "color-change", "brush-size-change", "drawing-start", "drawing", "drawing-end", "state-save", "mounted"],
  setup(y, { expose: B, emit: g }) {
    const M = y, L = M.width || 800, U = M.height || 500, W = M.initialColor || "#000000", Y = M.initialBrushSize || 5, P = M.availableColors || ["#000000", "#ff0000", "#0000ff", "#00ff00", "#ffff00", "#ff00ff", "#00ffff"], N = g, H = R(null), F = R(null);
    function d(A) {
      var G;
      (G = H.value) == null || G.setTool(A), N("tool-change", A);
    }
    function X(A) {
      var G;
      (G = H.value) == null || G.setColor(A), N("color-change", A);
    }
    function O(A) {
      var G;
      (G = H.value) == null || G.setBrushSize(A), N("brush-size-change", A);
    }
    function st() {
      var A;
      (A = H.value) == null || A.clearCanvas();
    }
    function V(A) {
      N("drawing-start", A);
    }
    function T(A) {
      N("drawing", A);
    }
    function Q() {
      N("drawing-end");
    }
    function at(A) {
      F.value = A, N("state-save", A);
    }
    function ct(A) {
      N("mounted", A);
    }
    async function pt() {
      if (F.value)
        return F.value;
      if (H.value)
        try {
          return await H.value.getCurrentCanvasData();
        } catch (A) {
          throw console.error("unable to get canvas data:", A), new Error("unable to get canvas data");
        }
      throw new Error("get canvas data failed");
    }
    return B({
      getCanvasData: pt
    }), (A, G) => (nt(), mt("div", se, [
      wt(Qt, {
        colors: I(P),
        initialColor: I(W),
        initialBrushSize: I(Y),
        onToolChange: d,
        onColorChange: X,
        onBrushSizeChange: O,
        onCanvasClear: st
      }, null, 8, ["colors", "initialColor", "initialBrushSize"]),
      wt(re, {
        ref_key: "drawingBoard",
        ref: H,
        width: I(L),
        height: I(U),
        initialColor: I(W),
        initialBrushSize: I(Y),
        onDrawingStart: V,
        onDrawing: T,
        onDrawingEnd: Q,
        onStateSave: at,
        onMounted: ct
      }, null, 8, ["width", "height", "initialColor", "initialBrushSize"])
    ]));
  }
}), oe = /* @__PURE__ */ At(ae, [["__scopeId", "data-v-39bbf58b"]]), le = /* @__PURE__ */ zt({
  __name: "VueExampleComponent",
  props: {
    widget: {}
  },
  setup(y) {
    const { t: B } = Dt(), g = R(null), M = R(null);
    y.widget.node;
    function L(W) {
      M.value = W, console.log("canvas state saved:", W.substring(0, 50) + "...");
    }
    async function U(W, Y) {
      var P;
      try {
        if (!((P = window.app) != null && P.api))
          throw new Error("ComfyUI API not available");
        const N = await fetch(W).then((O) => O.blob()), H = `${Y}_${Date.now()}.png`, F = new File([N], H), d = new FormData();
        return d.append("image", F), d.append("subfolder", "threed"), d.append("type", "temp"), console.log("Vue Component: Using window.app.api.fetchApi"), (await window.app.api.fetchApi("/upload/image", {
          method: "POST",
          body: d
        })).json();
      } catch (N) {
        throw console.error("Vue Component: Error uploading image:", N), N;
      }
    }
    return Nt(() => {
      y.widget.serializeValue = async (W, Y) => {
        try {
          console.log("Vue Component: inside vue serializeValue"), console.log("node", W), console.log("index", Y);
          const P = M.value;
          return P ? {
            image: `threed/${(await U(P, "test_vue_basic")).name} [temp]`
          } : (console.warn("Vue Component: No canvas data available"), { image: null });
        } catch (P) {
          return console.error("Vue Component: Error in serializeValue:", P), { image: null };
        }
      };
    }), (W, Y) => (nt(), mt("div", null, [
      rt("h1", null, gt(I(B)("vue-basic.title")), 1),
      rt("div", null, [
        wt(oe, {
          ref_key: "drawingAppRef",
          ref: g,
          width: 300,
          height: 300,
          onStateSave: L
        }, null, 512)
      ])
    ]));
  }
}), Pt = Xt;
Pt.registerExtension({
  name: "vue-basic",
  getCustomWidgets(y) {
    return {
      CUSTOM_VUE_COMPONENT_BASIC(B) {
        const g = {
          name: "custom_vue_component_basic",
          type: "vue-basic"
        }, M = new It({
          node: B,
          name: g.name,
          component: le,
          inputSpec: g,
          options: {}
        });
        return Wt(B, M), { widget: M };
      }
    };
  },
  nodeCreated(y) {
    if (y.constructor.comfyClass !== "vue-basic") return;
    const [B, g] = y.size;
    y.setSize([Math.max(B, 300), Math.max(g, 520)]);
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
  nodeCreated(y) {
    y.constructor.comfyClass === "housekeeper-alignment" && (y.setSize([200, 100]), y.title && (y.title = "🎯 Alignment Panel Active"));
  }
});
function ne() {
  let y = null, B = !1, g = [], M = [];
  const L = /* @__PURE__ */ new WeakMap(), U = /* @__PURE__ */ new WeakMap();
  function W(p) {
    var f;
    if (g.length < 2) return;
    Y();
    const s = (f = window.app) == null ? void 0 : f.canvas;
    if (!s) return;
    P(p, g).forEach((x, h) => {
      if (x && g[h]) {
        const E = document.createElement("div");
        E.style.cssText = `
                    position: fixed;
                    background: rgba(74, 144, 226, 0.3);
                    border: 2px dashed rgba(74, 144, 226, 0.7);
                    border-radius: 4px;
                    z-index: 999;
                    pointer-events: none;
                    transition: all 0.2s ease;
                `;
        const n = (x.x + s.ds.offset[0]) * s.ds.scale, c = (x.y + s.ds.offset[1]) * s.ds.scale, m = s.canvas.parentElement, v = s.canvas.getBoundingClientRect(), k = m ? m.getBoundingClientRect() : null;
        k && v.top - k.top, v.top;
        const j = document.querySelector("nav");
        let K = 31;
        j && (K = j.getBoundingClientRect().height);
        const $ = K * s.ds.scale, a = v.left + n, z = v.top + c - $, e = x.width * s.ds.scale, C = x.height * s.ds.scale;
        E.style.left = a + "px", E.style.top = z + "px", E.style.width = e + "px", E.style.height = C + "px", document.body.appendChild(E), M.push(E);
      }
    });
  }
  function Y() {
    M.forEach((p) => {
      p.parentNode && p.parentNode.removeChild(p);
    }), M = [];
  }
  function P(p, s) {
    if (s.length < 2) return [];
    const o = [], f = Math.min(...s.map((n) => n.pos[0])), x = Math.max(...s.map((n) => {
      let c = 150;
      return n.size && Array.isArray(n.size) && n.size[0] ? c = n.size[0] : typeof n.width == "number" ? c = n.width : n.properties && typeof n.properties.width == "number" && (c = n.properties.width), n.pos[0] + c;
    })), h = Math.min(...s.map((n) => n.pos[1])), E = Math.max(...s.map((n) => {
      let c = 100;
      return n.size && Array.isArray(n.size) && n.size[1] ? c = n.size[1] : typeof n.height == "number" ? c = n.height : n.properties && typeof n.properties.height == "number" && (c = n.properties.height), n.pos[1] + c;
    }));
    switch (p) {
      case "left":
        const n = [...s].sort((t, u) => t.pos[1] - u.pos[1]);
        let c = n[0].pos[1];
        const m = /* @__PURE__ */ new Map();
        n.forEach((t) => {
          let u = 100, w = 150;
          t.size && Array.isArray(t.size) ? (t.size[1] && (u = t.size[1]), t.size[0] && (w = t.size[0])) : (typeof t.height == "number" && (u = t.height), typeof t.width == "number" && (w = t.width), t.properties && (typeof t.properties.height == "number" && (u = t.properties.height), typeof t.properties.width == "number" && (w = t.properties.width))), m.set(t.id, {
            x: f,
            y: c,
            width: w,
            height: u
          }), c += u + 30;
        }), s.forEach((t) => {
          o.push(m.get(t.id));
        });
        break;
      case "right":
        const v = [...s].sort((t, u) => t.pos[1] - u.pos[1]);
        let k = v[0].pos[1];
        const j = /* @__PURE__ */ new Map();
        v.forEach((t) => {
          let u = 100, w = 150;
          t.size && Array.isArray(t.size) ? (t.size[1] && (u = t.size[1]), t.size[0] && (w = t.size[0])) : (typeof t.height == "number" && (u = t.height), typeof t.width == "number" && (w = t.width), t.properties && (typeof t.properties.height == "number" && (u = t.properties.height), typeof t.properties.width == "number" && (w = t.properties.width))), j.set(t.id, {
            x: x - w,
            y: k,
            width: w,
            height: u
          }), k += u + 30;
        }), s.forEach((t) => {
          o.push(j.get(t.id));
        });
        break;
      case "top":
        const K = [...s].sort((t, u) => t.pos[0] - u.pos[0]);
        let $ = K[0].pos[0];
        const a = /* @__PURE__ */ new Map();
        K.forEach((t) => {
          let u = 100, w = 150;
          t.size && Array.isArray(t.size) ? (t.size[1] && (u = t.size[1]), t.size[0] && (w = t.size[0])) : (typeof t.height == "number" && (u = t.height), typeof t.width == "number" && (w = t.width), t.properties && (typeof t.properties.height == "number" && (u = t.properties.height), typeof t.properties.width == "number" && (w = t.properties.width))), a.set(t.id, {
            x: $,
            y: h,
            width: w,
            height: u
          }), $ += w + 30;
        }), s.forEach((t) => {
          o.push(a.get(t.id));
        });
        break;
      case "bottom":
        const z = [...s].sort((t, u) => t.pos[0] - u.pos[0]);
        let e = f;
        const C = /* @__PURE__ */ new Map();
        z.forEach((t) => {
          let u = 100, w = 150;
          t.size && Array.isArray(t.size) ? (t.size[1] && (u = t.size[1]), t.size[0] && (w = t.size[0])) : (typeof t.height == "number" && (u = t.height), typeof t.width == "number" && (w = t.width), t.properties && (typeof t.properties.height == "number" && (u = t.properties.height), typeof t.properties.width == "number" && (w = t.properties.width))), C.set(t.id, {
            x: e,
            y: E - u,
            width: w,
            height: u
          }), e += w + 30;
        }), s.forEach((t) => {
          o.push(C.get(t.id));
        });
        break;
      case "horizontal-flow":
        const D = s.filter((t) => {
          if (!t) return !1;
          const u = t.pos || t.position || typeof t.x == "number" && typeof t.y == "number", w = t.size || t.width || t.height || typeof t.width == "number" && typeof t.height == "number";
          return !!u && !!w;
        });
        if (D.length < 2) break;
        const ot = Math.min(...D.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[0] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[0] : typeof t.x == "number" ? t.x : 0)), ut = Math.min(...D.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[1] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[1] : typeof t.y == "number" ? t.y : 0)), Z = D.map((t) => ({
          ...t,
          pos: t.pos ? [...t.pos] : [t.x || 0, t.y || 0],
          _calculatedSize: t.size && Array.isArray(t.size) ? [t.size[0], t.size[1]] : [t.width || 150, t.height || 100]
        })), i = O(Z), r = T(Z, i), b = 30, S = 30, _ = 5, tt = {};
        Z.forEach((t) => {
          var u;
          if (t && t.id) {
            const w = ((u = r[t.id]) == null ? void 0 : u.level) ?? 0;
            tt[w] || (tt[w] = []), tt[w].push(t);
          }
        });
        const yt = /* @__PURE__ */ new Map();
        Object.entries(tt).forEach(([t, u]) => {
          const w = parseInt(t);
          if (u && u.length > 0) {
            u.sort((l, q) => {
              const lt = l && l.id && r[l.id] ? r[l.id].order : 0, J = q && q.id && r[q.id] ? r[q.id].order : 0;
              return lt - J;
            });
            let et = ot;
            if (w > 0)
              for (let l = 0; l < w; l++) {
                const q = tt[l] || [], lt = Math.max(...q.map(
                  (J) => J && J._calculatedSize && J._calculatedSize[0] ? J._calculatedSize[0] : 150
                ));
                et += lt + b + _;
              }
            let it = ut;
            u.forEach((l) => {
              l && l._calculatedSize && (yt.set(l.id, {
                x: et,
                y: it,
                width: l._calculatedSize[0],
                height: l._calculatedSize[1]
              }), it += l._calculatedSize[1] + S);
            });
          }
        }), s.forEach((t) => {
          const u = yt.get(t.id);
          u && o.push(u);
        });
        break;
      case "vertical-flow":
        const vt = s.filter((t) => {
          if (!t) return !1;
          const u = t.pos || t.position || typeof t.x == "number" && typeof t.y == "number", w = t.size || t.width || t.height || typeof t.width == "number" && typeof t.height == "number";
          return !!u && !!w;
        });
        if (vt.length < 2) break;
        const Tt = Math.min(...vt.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[0] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[0] : typeof t.x == "number" ? t.x : 0)), Bt = Math.min(...vt.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[1] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[1] : typeof t.y == "number" ? t.y : 0)), dt = vt.map((t) => ({
          ...t,
          pos: t.pos ? [...t.pos] : [t.x || 0, t.y || 0],
          _calculatedSize: t.size && Array.isArray(t.size) ? [t.size[0], t.size[1]] : [t.width || 150, t.height || 100]
        })), Lt = O(dt), ht = T(dt, Lt), Ht = 30, Ot = 30, Ft = 5, ft = {};
        dt.forEach((t) => {
          var u;
          if (t && t.id) {
            const w = ((u = ht[t.id]) == null ? void 0 : u.level) ?? 0;
            ft[w] || (ft[w] = []), ft[w].push(t);
          }
        });
        const _t = /* @__PURE__ */ new Map();
        Object.entries(ft).forEach(([t, u]) => {
          const w = parseInt(t);
          if (u && u.length > 0) {
            u.sort((l, q) => {
              const lt = l && l.id && ht[l.id] ? ht[l.id].order : 0, J = q && q.id && ht[q.id] ? ht[q.id].order : 0;
              return lt - J;
            });
            let et = Bt;
            if (w > 0)
              for (let l = 0; l < w; l++) {
                const q = ft[l] || [], lt = Math.max(...q.map(
                  (J) => J && J._calculatedSize && J._calculatedSize[1] ? J._calculatedSize[1] : 100
                ));
                et += lt + Ht + Ft;
              }
            let it = Tt;
            u.forEach((l) => {
              l && l._calculatedSize && (_t.set(l.id, {
                x: it,
                y: et,
                width: l._calculatedSize[0],
                height: l._calculatedSize[1]
              }), it += l._calculatedSize[0] + Ot);
            });
          }
        }), s.forEach((t) => {
          const u = _t.get(t.id);
          u && o.push(u);
        });
        break;
      case "width-max":
      case "width-min":
      case "height-max":
      case "height-min":
      case "size-max":
      case "size-min":
        s.forEach((t) => {
          let u = 150, w = 100;
          t.size && Array.isArray(t.size) ? (t.size[0] && (u = t.size[0]), t.size[1] && (w = t.size[1])) : (typeof t.width == "number" && (u = t.width), typeof t.height == "number" && (w = t.height), t.properties && (typeof t.properties.width == "number" && (u = t.properties.width), typeof t.properties.height == "number" && (w = t.properties.height)));
          let et = u, it = w;
          if (p === "width-max" || p === "size-max")
            et = Math.max(...s.map((l) => l.size && Array.isArray(l.size) && l.size[0] ? l.size[0] : typeof l.width == "number" ? l.width : l.properties && typeof l.properties.width == "number" ? l.properties.width : 150));
          else if (p === "width-min")
            et = Math.min(...s.map((l) => l.size && Array.isArray(l.size) && l.size[0] ? l.size[0] : typeof l.width == "number" ? l.width : l.properties && typeof l.properties.width == "number" ? l.properties.width : 150));
          else if (p === "size-min")
            if (t.computeSize) {
              const l = t.computeSize.call(t);
              et = l[0], it = l[1];
            } else
              et = 150, it = 100;
          p === "height-max" || p === "size-max" ? it = Math.max(...s.map((l) => l.size && Array.isArray(l.size) && l.size[1] ? l.size[1] : typeof l.height == "number" ? l.height : l.properties && typeof l.properties.height == "number" ? l.properties.height : 100)) : p === "height-min" && p !== "size-min" && (it = Math.min(...s.map((l) => l.size && Array.isArray(l.size) && l.size[1] ? l.size[1] : typeof l.height == "number" ? l.height : l.properties && typeof l.properties.height == "number" ? l.properties.height : 100))), o.push({
            x: t.pos[0],
            y: t.pos[1],
            width: et,
            height: it
          });
        });
        break;
    }
    return o;
  }
  function N(p, s = !1) {
    const o = document.createElement("button");
    o.innerHTML = `
            <span style="font-size: 16px; display: block;">${p.icon}</span>
            <span style="font-size: 11px;">${p.label}</span>
        `;
    const f = s ? "#4a5568" : "#505050", x = s ? "#5a6578" : "#606060";
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
      o.style.background = `linear-gradient(145deg, ${x}, #505050)`, o.style.transform = "translateY(-1px)", o.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)", W(p.type);
    }), o.addEventListener("mouseleave", () => {
      o.style.background = `linear-gradient(145deg, ${f}, #404040)`, o.style.transform = "translateY(0)", o.style.boxShadow = "none", Y();
    }), o.addEventListener("click", () => Q(p.type)), o;
  }
  function H() {
    y = document.createElement("div"), y.className = "housekeeper-alignment-panel", y.style.cssText = `
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
    const p = document.createElement("div");
    p.innerHTML = "🎯 Node Alignment", p.style.cssText = `
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 12px;
            text-align: center;
            border-bottom: 1px solid #555;
            padding-bottom: 8px;
        `, y.appendChild(p);
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
    ], x = f.slice(0, 4), h = f.slice(4, 6), E = f.slice(6);
    x.forEach((m) => {
      const v = N(m);
      s.appendChild(v);
    }), h.forEach((m) => {
      const v = N(m, !0);
      o.appendChild(v);
    });
    const n = document.createElement("div");
    n.style.cssText = `
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-bottom: 12px;
            border-top: 1px solid #555;
            padding-top: 8px;
        `, E.forEach((m) => {
      const v = N(m, !0);
      n.appendChild(v);
    }), y.appendChild(s), y.appendChild(o), y.appendChild(n);
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
        `, y.appendChild(c), document.body.appendChild(y);
  }
  function F() {
    var x;
    if (!((x = window.app) != null && x.graph)) return;
    g = Object.values(window.app.graph._nodes || {}).filter((h) => h && h.is_selected);
    const s = g.length > 1;
    s && !B ? d() : !s && B && X();
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
    const f = y == null ? void 0 : y.querySelectorAll("button");
    f == null || f.forEach((h) => {
      s ? (h.style.opacity = "1", h.style.pointerEvents = "auto") : (h.style.opacity = "0.5", h.style.pointerEvents = "none");
    });
  }
  function d() {
    y && (B = !0, y.style.display = "block", setTimeout(() => {
      y && (y.style.opacity = "1", y.style.transform = "translateX(0)");
    }, 10));
  }
  function X() {
    y && (B = !1, y.style.opacity = "0", y.style.transform = "translateX(20px)", setTimeout(() => {
      y && (y.style.display = "none");
    }, 300));
  }
  function O(p) {
    const s = {}, o = p.filter((f) => f && (f.id !== void 0 || f.id !== null));
    return o.forEach((f) => {
      const x = f.id || `node_${o.indexOf(f)}`;
      f.id = x, s[x] = { inputs: [], outputs: [] }, f.inputs && Array.isArray(f.inputs) && f.inputs.forEach((h, E) => {
        h && h.link !== null && h.link !== void 0 && s[x].inputs.push({
          index: E,
          link: h.link,
          sourceNode: st(h.link, o)
        });
      }), f.outputs && Array.isArray(f.outputs) && f.outputs.forEach((h, E) => {
        h && h.links && Array.isArray(h.links) && h.links.length > 0 && h.links.forEach((n) => {
          const c = V(n, o);
          c && s[x].outputs.push({
            index: E,
            link: n,
            targetNode: c
          });
        });
      });
    }), s;
  }
  function st(p, s) {
    for (const o of s)
      if (o && o.outputs && Array.isArray(o.outputs)) {
        for (const f of o.outputs)
          if (f && f.links && Array.isArray(f.links) && f.links.includes(p))
            return o;
      }
    return null;
  }
  function V(p, s) {
    for (const o of s)
      if (o && o.inputs && Array.isArray(o.inputs)) {
        for (const f of o.inputs)
          if (f && f.link === p)
            return o;
      }
    return null;
  }
  function T(p, s) {
    const o = {}, f = /* @__PURE__ */ new Set(), x = p.filter((c) => c && c.id), h = x.filter((c) => {
      const m = c.id;
      return !s[m] || !s[m].inputs.length || s[m].inputs.every((v) => !v.sourceNode);
    });
    h.length === 0 && x.length > 0 && h.push(x[0]);
    const E = h.map((c) => ({ node: c, level: 0 }));
    for (; E.length > 0; ) {
      const { node: c, level: m } = E.shift();
      !c || !c.id || f.has(c.id) || (f.add(c.id), o[c.id] = { level: m, order: 0 }, s[c.id] && s[c.id].outputs && s[c.id].outputs.forEach((v) => {
        v && v.targetNode && v.targetNode.id && !f.has(v.targetNode.id) && E.push({ node: v.targetNode, level: m + 1 });
      }));
    }
    x.forEach((c) => {
      c && c.id && !o[c.id] && (o[c.id] = { level: 0, order: 0 });
    });
    const n = {};
    return Object.entries(o).forEach(([c, m]) => {
      n[m.level] || (n[m.level] = []);
      const v = x.find((k) => k && k.id === c);
      v && n[m.level].push(v);
    }), Object.entries(n).forEach(([c, m]) => {
      m && m.length > 0 && (m.sort((v, k) => {
        const j = v && v.pos && v.pos[1] ? v.pos[1] : 0, K = k && k.pos && k.pos[1] ? k.pos[1] : 0;
        return j - K;
      }), m.forEach((v, k) => {
        v && v.id && o[v.id] && (o[v.id].order = k);
      }));
    }), o;
  }
  function Q(p) {
    var s, o, f, x, h;
    if (g.length < 2) {
      A("Please select at least 2 nodes to align", "warning");
      return;
    }
    try {
      const E = Math.min(...g.map((a) => a.pos[0])), n = Math.max(...g.map((a) => {
        let z = 150;
        return a.size && Array.isArray(a.size) && a.size[0] ? z = a.size[0] : typeof a.width == "number" ? z = a.width : a.properties && typeof a.properties.width == "number" && (z = a.properties.width), a.pos[0] + z;
      })), c = Math.min(...g.map((a) => a.pos[1])), m = Math.max(...g.map((a) => {
        let z = 100;
        return a.size && Array.isArray(a.size) && a.size[1] ? z = a.size[1] : typeof a.height == "number" ? z = a.height : a.properties && typeof a.properties.height == "number" && (z = a.properties.height), a.pos[1] + z;
      })), v = Math.max(...g.map((a) => {
        const z = L.get(a);
        if (z && z.width !== void 0) return z.width;
        let e = 150;
        return a.size && Array.isArray(a.size) && a.size[0] ? e = a.size[0] : typeof a.width == "number" ? e = a.width : a.properties && typeof a.properties.width == "number" && (e = a.properties.width), e;
      })), k = Math.min(...g.map((a) => {
        const z = L.get(a);
        if (z && z.width !== void 0) return z.width;
        let e = 150;
        return a.size && Array.isArray(a.size) && a.size[0] ? e = a.size[0] : typeof a.width == "number" ? e = a.width : a.properties && typeof a.properties.width == "number" && (e = a.properties.width), e;
      })), j = Math.max(...g.map((a) => {
        const z = L.get(a);
        return z && z.height !== void 0 ? z.height : a.size && a.size[1] !== void 0 ? a.size[1] : typeof a.height == "number" ? a.height : a.properties && typeof a.properties.height == "number" ? a.properties.height : 100;
      })), K = Math.min(...g.map((a) => a.size && a.size[1] !== void 0 ? a.size[1] : typeof a.height == "number" ? a.height : a.properties && typeof a.properties.height == "number" ? a.properties.height : 100));
      let $;
      switch (p) {
        case "left":
          $ = E;
          const a = [...g].sort((i, r) => i.pos[1] - r.pos[1]);
          let z = a[0].pos[1];
          a.forEach((i, r) => {
            let S = 100;
            i.size && Array.isArray(i.size) && i.size[1] ? S = i.size[1] : typeof i.height == "number" ? S = i.height : i.properties && typeof i.properties.height == "number" && (S = i.properties.height), i.pos[0] = $, i.pos[1] = z, typeof i.x == "number" && (i.x = i.pos[0]), typeof i.y == "number" && (i.y = i.pos[1]), z += S + 30;
          });
          break;
        case "right":
          $ = n;
          const e = [...g].sort((i, r) => i.pos[1] - r.pos[1]);
          let C = e[0].pos[1];
          e.forEach((i, r) => {
            let S = 100, _ = 150;
            i.size && Array.isArray(i.size) ? (i.size[1] && (S = i.size[1]), i.size[0] && (_ = i.size[0])) : (typeof i.height == "number" && (S = i.height), typeof i.width == "number" && (_ = i.width), i.properties && (typeof i.properties.height == "number" && (S = i.properties.height), typeof i.properties.width == "number" && (_ = i.properties.width))), i.pos[0] = $ - _, i.pos[1] = C, typeof i.x == "number" && (i.x = i.pos[0]), typeof i.y == "number" && (i.y = i.pos[1]), C += S + 30;
          });
          break;
        case "top":
          $ = c;
          const D = [...g].sort((i, r) => i.pos[0] - r.pos[0]);
          let ot = D[0].pos[0];
          D.forEach((i, r) => {
            let S = 150;
            i.size && Array.isArray(i.size) && i.size[0] ? S = i.size[0] : typeof i.width == "number" ? S = i.width : i.properties && typeof i.properties.width == "number" && (S = i.properties.width), i.pos[1] = $, i.pos[0] = ot, typeof i.x == "number" && (i.x = i.pos[0]), typeof i.y == "number" && (i.y = i.pos[1]), ot += S + 30;
          });
          break;
        case "bottom":
          $ = m;
          const ut = [...g].sort((i, r) => i.pos[0] - r.pos[0]);
          let Z = E;
          ut.forEach((i, r) => {
            let S = 150, _ = 100;
            i.size && Array.isArray(i.size) ? (i.size[0] && (S = i.size[0]), i.size[1] && (_ = i.size[1])) : (typeof i.width == "number" && (S = i.width), typeof i.height == "number" && (_ = i.height), i.properties && (typeof i.properties.width == "number" && (S = i.properties.width), typeof i.properties.height == "number" && (_ = i.properties.height)));
            const tt = $ - _, yt = Z;
            i.pos[1] = tt, i.pos[0] = yt, typeof i.x == "number" && (i.x = i.pos[0]), typeof i.y == "number" && (i.y = i.pos[1]), Z += S + 30;
          });
          break;
        case "width-max":
          g.forEach((i) => {
            i.size && (i.size[0] = v);
          });
          break;
        case "width-min":
          g.forEach((i) => {
            i.size && (i.size[0] = k);
          });
          break;
        case "height-max":
          g.forEach((i) => {
            i.size && (i.size[1] = j);
          });
          break;
        case "height-min":
          g.forEach((i) => {
            if (i.size) {
              const r = i.computeSize ? i.computeSize.call(i)[1] : null, b = r && r > K ? r : K;
              i.size[1] = b;
            }
          });
          break;
        case "size-max":
          g.forEach((i) => {
            if (i.size) {
              if (i.computeSize && !U.has(i) && U.set(i, i.computeSize), i.computeSize) {
                const r = v, b = j;
                i.computeSize = function(S) {
                  const _ = U.get(this);
                  if (_) {
                    const tt = _.call(this, S);
                    return Math.abs(this.size[0] - r) < 1 && (tt[0] = r), Math.abs(this.size[1] - b) < 1 && (tt[1] = b), tt;
                  }
                  return [this.size[0], this.size[1]];
                };
              }
              i.size[0] = v, i.size[1] = j, L.set(i, { width: i.size[0], height: i.size[1] });
            }
          });
          break;
        case "size-min":
          g.forEach((i) => {
            if (i.size) {
              const r = U.get(i) || i.computeSize;
              if (r) {
                const b = r.call(i);
                i.size[0] = b[0], i.size[1] = b[1];
              } else
                i.size[0] = 150, i.size[1] = 100;
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
        (o = (s = window.app) == null ? void 0 : s.canvas) != null && o.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (x = (f = window.app) == null ? void 0 : f.graph) != null && x.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (h = window.app) != null && h.canvas && window.app.canvas.draw(!0, !0);
      } catch {
      }
    } catch {
      A("Error during alignment", "error");
    }
  }
  function at(p) {
  }
  function ct() {
    var p, s, o, f, x;
    try {
      const h = g.filter((e) => {
        if (!e) return !1;
        const C = e.pos || e.position || typeof e.x == "number" && typeof e.y == "number", D = e.size || e.width || e.height || typeof e.width == "number" && typeof e.height == "number";
        return !!C && !!D;
      });
      if (h.length < 2) {
        A(`Not enough valid nodes: ${h.length}/${g.length} nodes are valid`, "warning");
        return;
      }
      const E = Math.min(...h.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[0] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[0] : typeof e.x == "number" ? e.x : 0)), n = Math.min(...h.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[1] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[1] : typeof e.y == "number" ? e.y : 0)), c = E, m = n;
      h.forEach((e) => {
        e.pos || (e.position && Array.isArray(e.position) ? e.pos = e.position : typeof e.x == "number" && typeof e.y == "number" ? e.pos = [e.x, e.y] : e.pos = [0, 0]), e._calculatedSize || (e.size && Array.isArray(e.size) ? e._calculatedSize = [e.size[0], e.size[1]] : typeof e.width == "number" && typeof e.height == "number" ? e._calculatedSize = [e.width, e.height] : e._calculatedSize = [150, 100]), Array.isArray(e.pos) || (e.pos = [0, 0]);
      });
      const v = O(h), k = T(h, v), j = 30, K = 30, $ = 30, a = 5, z = {};
      h.forEach((e) => {
        var C;
        if (e && e.id) {
          const D = ((C = k[e.id]) == null ? void 0 : C.level) ?? 0;
          z[D] || (z[D] = []), z[D].push(e);
        }
      }), Object.entries(z).forEach(([e, C]) => {
        const D = parseInt(e);
        if (C && C.length > 0) {
          C.sort((r, b) => {
            const S = r && r.id && k[r.id] ? k[r.id].order : 0, _ = b && b.id && k[b.id] ? k[b.id].order : 0;
            return S - _;
          });
          const ot = C.reduce((r, b, S) => {
            const _ = b && b._calculatedSize && b._calculatedSize[1] ? b._calculatedSize[1] : 100;
            return r + _ + (S < C.length - 1 ? $ : 0);
          }, 0), ut = Math.max(...C.map(
            (r) => r && r._calculatedSize && r._calculatedSize[0] ? r._calculatedSize[0] : 150
          ));
          let Z = c;
          if (D > 0)
            for (let r = 0; r < D; r++) {
              const b = z[r] || [], S = Math.max(...b.map(
                (_) => _ && _._calculatedSize && _._calculatedSize[0] ? _._calculatedSize[0] : 150
              ));
              Z += S + j + a;
            }
          let i = m;
          C.forEach((r, b) => {
            if (r && r.pos && r._calculatedSize) {
              const S = [r.pos[0], r.pos[1]], _ = [r._calculatedSize[0], r._calculatedSize[1]];
              r.pos[0] = Z, r.pos[1] = i, i += r._calculatedSize[1] + $, typeof r.x == "number" && (r.x = r.pos[0]), typeof r.y == "number" && (r.y = r.pos[1]);
            }
          });
        }
      });
      try {
        (s = (p = window.app) == null ? void 0 : p.canvas) != null && s.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (f = (o = window.app) == null ? void 0 : o.graph) != null && f.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (x = window.app) != null && x.canvas && window.app.canvas.draw(!0, !0);
      } catch {
      }
    } catch {
      A("Error in horizontal flow alignment", "error");
    }
  }
  function pt() {
    var p, s, o, f, x;
    try {
      const h = g.filter((e) => {
        if (!e) return !1;
        const C = e.pos || e.position || typeof e.x == "number" && typeof e.y == "number", D = e.size || e.width || e.height || typeof e.width == "number" && typeof e.height == "number";
        return !!C && !!D;
      });
      if (h.length < 2) {
        A(`Not enough valid nodes: ${h.length}/${g.length} nodes are valid`, "warning");
        return;
      }
      const E = Math.min(...h.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[0] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[0] : typeof e.x == "number" ? e.x : 0)), n = Math.min(...h.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[1] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[1] : typeof e.y == "number" ? e.y : 0)), c = E, m = n;
      h.forEach((e) => {
        e.pos || (e.position && Array.isArray(e.position) ? e.pos = e.position : typeof e.x == "number" && typeof e.y == "number" ? e.pos = [e.x, e.y] : e.pos = [0, 0]), e._calculatedSize || (e.size && Array.isArray(e.size) ? e._calculatedSize = [e.size[0], e.size[1]] : typeof e.width == "number" && typeof e.height == "number" ? e._calculatedSize = [e.width, e.height] : e._calculatedSize = [150, 100]), Array.isArray(e.pos) || (e.pos = [0, 0]);
      });
      const v = O(h), k = T(h, v), j = 30, K = 30, $ = 30, a = 5, z = {};
      h.forEach((e) => {
        var C;
        if (e && e.id) {
          const D = ((C = k[e.id]) == null ? void 0 : C.level) ?? 0;
          z[D] || (z[D] = []), z[D].push(e);
        }
      }), Object.entries(z).forEach(([e, C]) => {
        const D = parseInt(e);
        if (C && C.length > 0) {
          C.sort((r, b) => {
            const S = r && r.id && k[r.id] ? k[r.id].order : 0, _ = b && b.id && k[b.id] ? k[b.id].order : 0;
            return S - _;
          });
          const ot = C.reduce((r, b, S) => {
            const _ = b && b._calculatedSize && b._calculatedSize[0] ? b._calculatedSize[0] : 150;
            return r + _ + K;
          }, 0), ut = Math.max(...C.map(
            (r) => r && r._calculatedSize && r._calculatedSize[1] ? r._calculatedSize[1] : 100
          ));
          let Z = m;
          if (D > 0)
            for (let r = 0; r < D; r++) {
              const b = z[r] || [], S = Math.max(...b.map(
                (_) => _ && _._calculatedSize && _._calculatedSize[1] ? _._calculatedSize[1] : 100
              ));
              Z += S + j + a;
            }
          let i = c;
          C.forEach((r, b) => {
            if (r && r.pos && r._calculatedSize) {
              const S = [r.pos[0], r.pos[1]], _ = [r._calculatedSize[0], r._calculatedSize[1]];
              r.pos[0] = i, r.pos[1] = Z, i += r._calculatedSize[0] + K, typeof r.x == "number" && (r.x = r.pos[0]), typeof r.y == "number" && (r.y = r.pos[1]);
            }
          });
        }
      });
      try {
        (s = (p = window.app) == null ? void 0 : p.canvas) != null && s.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (f = (o = window.app) == null ? void 0 : o.graph) != null && f.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (x = window.app) != null && x.canvas && window.app.canvas.draw(!0, !0);
      } catch {
      }
    } catch {
      A("Error in vertical flow alignment", "error");
    }
  }
  function A(p, s = "info") {
    const o = document.createElement("div");
    o.textContent = p, o.style.cssText = `
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
  function G() {
    var p;
    if (!((p = window.app) != null && p.canvas)) {
      setTimeout(G, 100);
      return;
    }
    window.app.canvas.canvas && (window.app.canvas.canvas.addEventListener("click", () => {
      setTimeout(F, 10);
    }), window.app.canvas.canvas.addEventListener("mouseup", () => {
      setTimeout(F, 10);
    }), document.addEventListener("keydown", (s) => {
      (s.ctrlKey || s.metaKey) && setTimeout(F, 10);
    })), setInterval(F, 500);
  }
  function bt(p) {
    if (p.ctrlKey || p.metaKey) {
      if (p.shiftKey)
        switch (p.key) {
          case "ArrowLeft":
            p.preventDefault(), Q("left");
            break;
          case "ArrowRight":
            p.preventDefault(), Q("right");
            break;
          case "ArrowUp":
            p.preventDefault(), Q("top");
            break;
          case "ArrowDown":
            p.preventDefault(), Q("bottom");
            break;
        }
      else if (p.altKey)
        switch (p.key) {
          case "ArrowRight":
            p.preventDefault(), Q("horizontal-flow");
            break;
          case "ArrowDown":
            p.preventDefault(), Q("vertical-flow");
            break;
        }
    }
  }
  H(), G(), document.addEventListener("keydown", bt);
}
