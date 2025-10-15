import { app as Ft } from "../../../scripts/app.js";
import { ComponentWidgetImpl as Ht, addWidget as Xt } from "../../../scripts/domWidget.js";
import { defineComponent as wt, ref as R, resolveDirective as It, createElementBlock as gt, openBlock as nt, Fragment as At, createElementVNode as it, withDirectives as Yt, createVNode as vt, createBlock as _t, unref as H, normalizeClass as Ct, withCtx as bt, createTextVNode as Et, toDisplayString as ht, renderList as Vt, normalizeStyle as Wt, onMounted as kt, nextTick as $t } from "vue";
import dt from "primevue/button";
import { useI18n as Mt } from "vue-i18n";
const Rt = { class: "toolbar" }, Gt = { class: "color-picker" }, jt = { class: "size-slider" }, Ut = ["value"], Kt = /* @__PURE__ */ wt({
  __name: "ToolBar",
  props: {
    colors: {},
    initialColor: {},
    initialBrushSize: {},
    initialTool: {}
  },
  emits: ["tool-change", "color-change", "canvas-clear", "brush-size-change"],
  setup(v, { emit: B }) {
    const { t: y } = Mt(), M = v, V = B, q = M.colors || ["#000000", "#ff0000", "#0000ff", "#69a869", "#ffff00", "#ff00ff", "#00ffff"], X = R(M.initialColor || "#000000"), O = R(M.initialBrushSize || 5), T = R(M.initialTool || "pen");
    function N(F) {
      T.value = F, V("tool-change", F);
    }
    function L(F) {
      X.value = F, V("color-change", F);
    }
    function G() {
      V("canvas-clear");
    }
    function b(F) {
      const W = F.target;
      O.value = Number(W.value), V("brush-size-change", O.value);
    }
    return (F, W) => {
      const Q = It("tooltip");
      return nt(), gt(At, null, [
        it("div", Rt, [
          Yt((nt(), _t(H(dt), {
            class: Ct({ active: T.value === "pen" }),
            onClick: W[0] || (W[0] = (P) => N("pen"))
          }, {
            default: bt(() => [
              Et(ht(H(y)("vue-basic.pen")), 1)
            ]),
            _: 1
          }, 8, ["class"])), [
            [Q, { value: H(y)("vue-basic.pen-tooltip"), showDelay: 300 }]
          ]),
          vt(H(dt), { onClick: G }, {
            default: bt(() => [
              Et(ht(H(y)("vue-basic.clear-canvas")), 1)
            ]),
            _: 1
          })
        ]),
        it("div", Gt, [
          (nt(!0), gt(At, null, Vt(H(q), (P, $) => (nt(), _t(H(dt), {
            key: $,
            class: Ct({ "color-button": !0, active: X.value === P }),
            onClick: (ct) => L(P),
            type: "button",
            title: P
          }, {
            default: bt(() => [
              it("i", {
                class: "pi pi-circle-fill",
                style: Wt({ color: P })
              }, null, 4)
            ]),
            _: 2
          }, 1032, ["class", "onClick", "title"]))), 128))
        ]),
        it("div", jt, [
          it("label", null, ht(H(y)("vue-basic.brush-size")) + ": " + ht(O.value) + "px", 1),
          it("input", {
            type: "range",
            min: "1",
            max: "50",
            value: O.value,
            onChange: W[1] || (W[1] = (P) => b(P))
          }, null, 40, Ut)
        ])
      ], 64);
    };
  }
}), xt = (v, B) => {
  const y = v.__vccOpts || v;
  for (const [M, V] of B)
    y[M] = V;
  return y;
}, qt = /* @__PURE__ */ xt(Kt, [["__scopeId", "data-v-cae98791"]]), Jt = { class: "drawing-board" }, Qt = { class: "canvas-container" }, Zt = ["width", "height"], te = /* @__PURE__ */ wt({
  __name: "DrawingBoard",
  props: {
    width: {},
    height: {},
    initialColor: {},
    initialBrushSize: {}
  },
  emits: ["mounted", "drawing-start", "drawing", "drawing-end", "state-save", "canvas-clear"],
  setup(v, { expose: B, emit: y }) {
    const M = v, V = M.width || 800, q = M.height || 500, X = M.initialColor || "#000000", O = M.initialBrushSize || 5, T = y, N = R(!1), L = R(0), G = R(0), b = R(null), F = R(!1), W = R(O), Q = R(X), P = R(null), $ = R(null);
    kt(() => {
      $.value && (b.value = $.value.getContext("2d"), ct(), $t(() => {
        $.value && T("mounted", $.value);
      }));
    });
    function ct() {
      b.value && (b.value.fillStyle = "#ffffff", b.value.fillRect(0, 0, V, q), rt(), m());
    }
    function rt() {
      b.value && (F.value ? (b.value.globalCompositeOperation = "destination-out", b.value.strokeStyle = "rgba(0,0,0,1)") : (b.value.globalCompositeOperation = "source-over", b.value.strokeStyle = Q.value), b.value.lineWidth = W.value, b.value.lineJoin = "round", b.value.lineCap = "round");
    }
    function Z(p) {
      N.value = !0;
      const { offsetX: u, offsetY: z } = n(p);
      L.value = u, G.value = z, b.value && (b.value.beginPath(), b.value.moveTo(L.value, G.value), b.value.arc(L.value, G.value, W.value / 2, 0, Math.PI * 2), b.value.fill(), T("drawing-start", {
        x: u,
        y: z,
        tool: F.value ? "eraser" : "pen"
      }));
    }
    function st(p) {
      if (!N.value || !b.value) return;
      const { offsetX: u, offsetY: z } = n(p);
      b.value.beginPath(), b.value.moveTo(L.value, G.value), b.value.lineTo(u, z), b.value.stroke(), L.value = u, G.value = z, T("drawing", {
        x: u,
        y: z,
        tool: F.value ? "eraser" : "pen"
      });
    }
    function E() {
      N.value && (N.value = !1, m(), T("drawing-end"));
    }
    function n(p) {
      let u = 0, z = 0;
      if ("touches" in p) {
        if (p.preventDefault(), $.value) {
          const I = $.value.getBoundingClientRect();
          u = p.touches[0].clientX - I.left, z = p.touches[0].clientY - I.top;
        }
      } else
        u = p.offsetX, z = p.offsetY;
      return { offsetX: u, offsetY: z };
    }
    function s(p) {
      p.preventDefault();
      const z = {
        touches: [p.touches[0]]
      };
      Z(z);
    }
    function a(p) {
      if (p.preventDefault(), !N.value) return;
      const z = {
        touches: [p.touches[0]]
      };
      st(z);
    }
    function g(p) {
      F.value = p === "eraser", rt();
    }
    function x(p) {
      Q.value = p, rt();
    }
    function f(p) {
      W.value = p, rt();
    }
    function k() {
      b.value && (b.value.fillStyle = "#ffffff", b.value.fillRect(0, 0, V, q), rt(), m(), T("canvas-clear"));
    }
    function m() {
      $.value && (P.value = $.value.toDataURL("image/png"), P.value && T("state-save", P.value));
    }
    async function h() {
      if (!$.value)
        throw new Error("Canvas is unable to get current data");
      return P.value ? P.value : $.value.toDataURL("image/png");
    }
    return B({
      setTool: g,
      setColor: x,
      setBrushSize: f,
      clearCanvas: k,
      getCurrentCanvasData: h
    }), (p, u) => (nt(), gt("div", Jt, [
      it("div", Qt, [
        it("canvas", {
          ref_key: "canvas",
          ref: $,
          width: H(V),
          height: H(q),
          onMousedown: Z,
          onMousemove: st,
          onMouseup: E,
          onMouseleave: E,
          onTouchstart: s,
          onTouchmove: a,
          onTouchend: E
        }, null, 40, Zt)
      ])
    ]));
  }
}), ee = /* @__PURE__ */ xt(te, [["__scopeId", "data-v-ca1239fc"]]), ie = { class: "drawing-app" }, re = /* @__PURE__ */ wt({
  __name: "DrawingApp",
  props: {
    width: {},
    height: {},
    initialColor: {},
    initialBrushSize: {},
    availableColors: {}
  },
  emits: ["tool-change", "color-change", "brush-size-change", "drawing-start", "drawing", "drawing-end", "state-save", "mounted"],
  setup(v, { expose: B, emit: y }) {
    const M = v, V = M.width || 800, q = M.height || 500, X = M.initialColor || "#000000", O = M.initialBrushSize || 5, T = M.availableColors || ["#000000", "#ff0000", "#0000ff", "#00ff00", "#ffff00", "#ff00ff", "#00ffff"], N = y, L = R(null), G = R(null);
    function b(E) {
      var n;
      (n = L.value) == null || n.setTool(E), N("tool-change", E);
    }
    function F(E) {
      var n;
      (n = L.value) == null || n.setColor(E), N("color-change", E);
    }
    function W(E) {
      var n;
      (n = L.value) == null || n.setBrushSize(E), N("brush-size-change", E);
    }
    function Q() {
      var E;
      (E = L.value) == null || E.clearCanvas();
    }
    function P(E) {
      N("drawing-start", E);
    }
    function $(E) {
      N("drawing", E);
    }
    function ct() {
      N("drawing-end");
    }
    function rt(E) {
      G.value = E, N("state-save", E);
    }
    function Z(E) {
      N("mounted", E);
    }
    async function st() {
      if (G.value)
        return G.value;
      if (L.value)
        try {
          return await L.value.getCurrentCanvasData();
        } catch (E) {
          throw console.error("unable to get canvas data:", E), new Error("unable to get canvas data");
        }
      throw new Error("get canvas data failed");
    }
    return B({
      getCanvasData: st
    }), (E, n) => (nt(), gt("div", ie, [
      vt(qt, {
        colors: H(T),
        initialColor: H(X),
        initialBrushSize: H(O),
        onToolChange: b,
        onColorChange: F,
        onBrushSizeChange: W,
        onCanvasClear: Q
      }, null, 8, ["colors", "initialColor", "initialBrushSize"]),
      vt(ee, {
        ref_key: "drawingBoard",
        ref: L,
        width: H(V),
        height: H(q),
        initialColor: H(X),
        initialBrushSize: H(O),
        onDrawingStart: P,
        onDrawing: $,
        onDrawingEnd: ct,
        onStateSave: rt,
        onMounted: Z
      }, null, 8, ["width", "height", "initialColor", "initialBrushSize"])
    ]));
  }
}), se = /* @__PURE__ */ xt(re, [["__scopeId", "data-v-39bbf58b"]]), ae = /* @__PURE__ */ wt({
  __name: "VueExampleComponent",
  props: {
    widget: {}
  },
  setup(v) {
    const { t: B } = Mt(), y = R(null), M = R(null);
    v.widget.node;
    function V(X) {
      M.value = X, console.log("canvas state saved:", X.substring(0, 50) + "...");
    }
    async function q(X, O) {
      var T;
      try {
        if (!((T = window.app) != null && T.api))
          throw new Error("ComfyUI API not available");
        const N = await fetch(X).then((W) => W.blob()), L = `${O}_${Date.now()}.png`, G = new File([N], L), b = new FormData();
        return b.append("image", G), b.append("subfolder", "threed"), b.append("type", "temp"), console.log("Vue Component: Using window.app.api.fetchApi"), (await window.app.api.fetchApi("/upload/image", {
          method: "POST",
          body: b
        })).json();
      } catch (N) {
        throw console.error("Vue Component: Error uploading image:", N), N;
      }
    }
    return kt(() => {
      v.widget.serializeValue = async (X, O) => {
        try {
          console.log("Vue Component: inside vue serializeValue"), console.log("node", X), console.log("index", O);
          const T = M.value;
          return T ? {
            image: `threed/${(await q(T, "test_vue_basic")).name} [temp]`
          } : (console.warn("Vue Component: No canvas data available"), { image: null });
        } catch (T) {
          return console.error("Vue Component: Error in serializeValue:", T), { image: null };
        }
      };
    }), (X, O) => (nt(), gt("div", null, [
      it("h1", null, ht(H(B)("vue-basic.title")), 1),
      it("div", null, [
        vt(se, {
          ref_key: "drawingAppRef",
          ref: y,
          width: 300,
          height: 300,
          onStateSave: V
        }, null, 512)
      ])
    ]));
  }
}), Nt = Ft;
Nt.registerExtension({
  name: "vue-basic",
  getCustomWidgets(v) {
    return {
      CUSTOM_VUE_COMPONENT_BASIC(B) {
        const y = {
          name: "custom_vue_component_basic",
          type: "vue-basic"
        }, M = new Ht({
          node: B,
          name: y.name,
          component: ae,
          inputSpec: y,
          options: {}
        });
        return Xt(B, M), { widget: M };
      }
    };
  },
  nodeCreated(v) {
    if (v.constructor.comfyClass !== "vue-basic") return;
    const [B, y] = v.size;
    v.setSize([Math.max(B, 300), Math.max(y, 520)]);
  }
});
Nt.registerExtension({
  name: "housekeeper-alignment",
  async setup() {
    try {
      oe();
    } catch {
    }
  },
  nodeCreated(v) {
    v.constructor.comfyClass === "housekeeper-alignment" && (v.setSize([200, 100]), v.title && (v.title = "🎯 Alignment Panel Active"));
  }
});
function oe() {
  let v = null, B = !1, y = [], M = [];
  function V(n) {
    var g;
    if (y.length < 2) return;
    q();
    const s = (g = window.app) == null ? void 0 : g.canvas;
    if (!s) return;
    X(n, y).forEach((x, f) => {
      if (x && y[f]) {
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
        const m = (x.x + s.ds.offset[0]) * s.ds.scale, h = (x.y + s.ds.offset[1]) * s.ds.scale, p = s.canvas.parentElement, u = s.canvas.getBoundingClientRect(), z = p ? p.getBoundingClientRect() : null;
        z && u.top - z.top, u.top;
        const I = document.querySelector("nav");
        let j = 31;
        I && (j = I.getBoundingClientRect().height);
        const Y = j * s.ds.scale, o = u.left + m, d = u.top + h - Y, e = x.width * s.ds.scale, _ = x.height * s.ds.scale;
        k.style.left = o + "px", k.style.top = d + "px", k.style.width = e + "px", k.style.height = _ + "px", document.body.appendChild(k), M.push(k);
      }
    });
  }
  function q() {
    M.forEach((n) => {
      n.parentNode && n.parentNode.removeChild(n);
    }), M = [];
  }
  function X(n, s) {
    if (s.length < 2) return [];
    const a = [], g = Math.min(...s.map((m) => m.pos[0])), x = Math.max(...s.map((m) => {
      let h = 150;
      return m.size && Array.isArray(m.size) && m.size[0] ? h = m.size[0] : typeof m.width == "number" ? h = m.width : m.properties && typeof m.properties.width == "number" && (h = m.properties.width), m.pos[0] + h;
    })), f = Math.min(...s.map((m) => m.pos[1])), k = Math.max(...s.map((m) => {
      let h = 100;
      return m.size && Array.isArray(m.size) && m.size[1] ? h = m.size[1] : typeof m.height == "number" ? h = m.height : m.properties && typeof m.properties.height == "number" && (h = m.properties.height), m.pos[1] + h;
    }));
    switch (n) {
      case "left":
        const m = [...s].sort((t, c) => t.pos[1] - c.pos[1]);
        let h = m[0].pos[1];
        const p = /* @__PURE__ */ new Map();
        m.forEach((t) => {
          let c = 100, w = 150;
          t.size && Array.isArray(t.size) ? (t.size[1] && (c = t.size[1]), t.size[0] && (w = t.size[0])) : (typeof t.height == "number" && (c = t.height), typeof t.width == "number" && (w = t.width), t.properties && (typeof t.properties.height == "number" && (c = t.properties.height), typeof t.properties.width == "number" && (w = t.properties.width))), p.set(t.id, {
            x: g,
            y: h,
            width: w,
            height: c
          }), h += c + 30;
        }), s.forEach((t) => {
          a.push(p.get(t.id));
        });
        break;
      case "right":
        const u = [...s].sort((t, c) => t.pos[1] - c.pos[1]);
        let z = u[0].pos[1];
        const I = /* @__PURE__ */ new Map();
        u.forEach((t) => {
          let c = 100, w = 150;
          t.size && Array.isArray(t.size) ? (t.size[1] && (c = t.size[1]), t.size[0] && (w = t.size[0])) : (typeof t.height == "number" && (c = t.height), typeof t.width == "number" && (w = t.width), t.properties && (typeof t.properties.height == "number" && (c = t.properties.height), typeof t.properties.width == "number" && (w = t.properties.width))), I.set(t.id, {
            x: x - w,
            y: z,
            width: w,
            height: c
          }), z += c + 30;
        }), s.forEach((t) => {
          a.push(I.get(t.id));
        });
        break;
      case "top":
        const j = [...s].sort((t, c) => t.pos[0] - c.pos[0]);
        let Y = j[0].pos[0];
        const o = /* @__PURE__ */ new Map();
        j.forEach((t) => {
          let c = 100, w = 150;
          t.size && Array.isArray(t.size) ? (t.size[1] && (c = t.size[1]), t.size[0] && (w = t.size[0])) : (typeof t.height == "number" && (c = t.height), typeof t.width == "number" && (w = t.width), t.properties && (typeof t.properties.height == "number" && (c = t.properties.height), typeof t.properties.width == "number" && (w = t.properties.width))), o.set(t.id, {
            x: Y,
            y: f,
            width: w,
            height: c
          }), Y += w + 30;
        }), s.forEach((t) => {
          a.push(o.get(t.id));
        });
        break;
      case "bottom":
        const d = [...s].sort((t, c) => t.pos[0] - c.pos[0]);
        let e = g;
        const _ = /* @__PURE__ */ new Map();
        d.forEach((t) => {
          let c = 100, w = 150;
          t.size && Array.isArray(t.size) ? (t.size[1] && (c = t.size[1]), t.size[0] && (w = t.size[0])) : (typeof t.height == "number" && (c = t.height), typeof t.width == "number" && (w = t.width), t.properties && (typeof t.properties.height == "number" && (c = t.properties.height), typeof t.properties.width == "number" && (w = t.properties.width))), _.set(t.id, {
            x: e,
            y: k - c,
            width: w,
            height: c
          }), e += w + 30;
        }), s.forEach((t) => {
          a.push(_.get(t.id));
        });
        break;
      case "horizontal-flow":
        const D = s.filter((t) => {
          if (!t) return !1;
          const c = t.pos || t.position || typeof t.x == "number" && typeof t.y == "number", w = t.size || t.width || t.height || typeof t.width == "number" && typeof t.height == "number";
          return !!c && !!w;
        });
        if (D.length < 2) break;
        const at = Math.min(...D.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[0] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[0] : typeof t.x == "number" ? t.x : 0)), pt = Math.min(...D.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[1] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[1] : typeof t.y == "number" ? t.y : 0)), J = D.map((t) => ({
          ...t,
          pos: t.pos ? [...t.pos] : [t.x || 0, t.y || 0],
          _calculatedSize: t.size && Array.isArray(t.size) ? [t.size[0], t.size[1]] : [t.width || 150, t.height || 100]
        })), i = b(J), r = Q(J, i), A = 30, S = 30, C = 5, ot = {};
        J.forEach((t) => {
          var c;
          if (t && t.id) {
            const w = ((c = r[t.id]) == null ? void 0 : c.level) ?? 0;
            ot[w] || (ot[w] = []), ot[w].push(t);
          }
        });
        const mt = /* @__PURE__ */ new Map();
        Object.entries(ot).forEach(([t, c]) => {
          const w = parseInt(t);
          if (c && c.length > 0) {
            c.sort((l, U) => {
              const lt = l && l.id && r[l.id] ? r[l.id].order : 0, K = U && U.id && r[U.id] ? r[U.id].order : 0;
              return lt - K;
            });
            let tt = at;
            if (w > 0)
              for (let l = 0; l < w; l++) {
                const U = ot[l] || [], lt = Math.max(...U.map(
                  (K) => K && K._calculatedSize && K._calculatedSize[0] ? K._calculatedSize[0] : 150
                ));
                tt += lt + A + C;
              }
            let et = pt;
            c.forEach((l) => {
              l && l._calculatedSize && (mt.set(l.id, {
                x: tt,
                y: et,
                width: l._calculatedSize[0],
                height: l._calculatedSize[1]
              }), et += l._calculatedSize[1] + S);
            });
          }
        }), s.forEach((t) => {
          const c = mt.get(t.id);
          c && a.push(c);
        });
        break;
      case "vertical-flow":
        const yt = s.filter((t) => {
          if (!t) return !1;
          const c = t.pos || t.position || typeof t.x == "number" && typeof t.y == "number", w = t.size || t.width || t.height || typeof t.width == "number" && typeof t.height == "number";
          return !!c && !!w;
        });
        if (yt.length < 2) break;
        const Dt = Math.min(...yt.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[0] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[0] : typeof t.x == "number" ? t.x : 0)), Pt = Math.min(...yt.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[1] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[1] : typeof t.y == "number" ? t.y : 0)), zt = yt.map((t) => ({
          ...t,
          pos: t.pos ? [...t.pos] : [t.x || 0, t.y || 0],
          _calculatedSize: t.size && Array.isArray(t.size) ? [t.size[0], t.size[1]] : [t.width || 150, t.height || 100]
        })), Tt = b(zt), ut = Q(zt, Tt), Bt = 30, Lt = 30, Ot = 5, ft = {};
        zt.forEach((t) => {
          var c;
          if (t && t.id) {
            const w = ((c = ut[t.id]) == null ? void 0 : c.level) ?? 0;
            ft[w] || (ft[w] = []), ft[w].push(t);
          }
        });
        const St = /* @__PURE__ */ new Map();
        Object.entries(ft).forEach(([t, c]) => {
          const w = parseInt(t);
          if (c && c.length > 0) {
            c.sort((l, U) => {
              const lt = l && l.id && ut[l.id] ? ut[l.id].order : 0, K = U && U.id && ut[U.id] ? ut[U.id].order : 0;
              return lt - K;
            });
            let tt = Pt;
            if (w > 0)
              for (let l = 0; l < w; l++) {
                const U = ft[l] || [], lt = Math.max(...U.map(
                  (K) => K && K._calculatedSize && K._calculatedSize[1] ? K._calculatedSize[1] : 100
                ));
                tt += lt + Bt + Ot;
              }
            let et = Dt;
            c.forEach((l) => {
              l && l._calculatedSize && (St.set(l.id, {
                x: et,
                y: tt,
                width: l._calculatedSize[0],
                height: l._calculatedSize[1]
              }), et += l._calculatedSize[0] + Lt);
            });
          }
        }), s.forEach((t) => {
          const c = St.get(t.id);
          c && a.push(c);
        });
        break;
      case "width-max":
      case "width-min":
      case "height-max":
      case "height-min":
      case "size-max":
      case "size-min":
        s.forEach((t) => {
          let c = 150, w = 100;
          t.size && Array.isArray(t.size) ? (t.size[0] && (c = t.size[0]), t.size[1] && (w = t.size[1])) : (typeof t.width == "number" && (c = t.width), typeof t.height == "number" && (w = t.height), t.properties && (typeof t.properties.width == "number" && (c = t.properties.width), typeof t.properties.height == "number" && (w = t.properties.height)));
          let tt = c, et = w;
          if (n === "width-max" || n === "size-max")
            tt = Math.max(...s.map((l) => l.size && Array.isArray(l.size) && l.size[0] ? l.size[0] : typeof l.width == "number" ? l.width : l.properties && typeof l.properties.width == "number" ? l.properties.width : 150));
          else if (n === "width-min")
            tt = Math.min(...s.map((l) => l.size && Array.isArray(l.size) && l.size[0] ? l.size[0] : typeof l.width == "number" ? l.width : l.properties && typeof l.properties.width == "number" ? l.properties.width : 150));
          else if (n === "size-min")
            if (t.computeSize) {
              const l = t.computeSize.call(t);
              tt = l[0], et = l[1];
            } else
              tt = 150, et = 100;
          n === "height-max" || n === "size-max" ? et = Math.max(...s.map((l) => l.size && Array.isArray(l.size) && l.size[1] ? l.size[1] : typeof l.height == "number" ? l.height : l.properties && typeof l.properties.height == "number" ? l.properties.height : 100)) : n === "height-min" && n !== "size-min" && (et = Math.min(...s.map((l) => l.size && Array.isArray(l.size) && l.size[1] ? l.size[1] : typeof l.height == "number" ? l.height : l.properties && typeof l.properties.height == "number" ? l.properties.height : 100))), a.push({
            x: t.pos[0],
            y: t.pos[1],
            width: tt,
            height: et
          });
        });
        break;
    }
    return a;
  }
  function O(n, s = !1) {
    const a = document.createElement("button");
    a.innerHTML = `
            <span style="font-size: 16px; display: block;">${n.icon}</span>
            <span style="font-size: 11px;">${n.label}</span>
        `;
    const g = s ? "#4a5568" : "#505050", x = s ? "#5a6578" : "#606060";
    return a.style.cssText = `
            background: linear-gradient(145deg, ${g}, #404040);
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
        `, a.addEventListener("mouseenter", () => {
      a.style.background = `linear-gradient(145deg, ${x}, #505050)`, a.style.transform = "translateY(-1px)", a.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)", V(n.type);
    }), a.addEventListener("mouseleave", () => {
      a.style.background = `linear-gradient(145deg, ${g}, #404040)`, a.style.transform = "translateY(0)", a.style.boxShadow = "none", q();
    }), a.addEventListener("click", () => P(n.type)), a;
  }
  function T() {
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
    const n = document.createElement("div");
    n.innerHTML = "🎯 Node Alignment", n.style.cssText = `
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 12px;
            text-align: center;
            border-bottom: 1px solid #555;
            padding-bottom: 8px;
        `, v.appendChild(n);
    const s = document.createElement("div");
    s.style.cssText = `
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-bottom: 8px;
        `;
    const a = document.createElement("div");
    a.style.cssText = `
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-bottom: 12px;
            border-top: 1px solid #555;
            padding-top: 8px;
        `;
    const g = [
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
    ], x = g.slice(0, 4), f = g.slice(4, 6), k = g.slice(6);
    x.forEach((p) => {
      const u = O(p);
      s.appendChild(u);
    }), f.forEach((p) => {
      const u = O(p, !0);
      a.appendChild(u);
    });
    const m = document.createElement("div");
    m.style.cssText = `
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-bottom: 12px;
            border-top: 1px solid #555;
            padding-top: 8px;
        `, k.forEach((p) => {
      const u = O(p, !0);
      m.appendChild(u);
    }), v.appendChild(s), v.appendChild(a), v.appendChild(m);
    const h = document.createElement("div");
    h.id = "alignment-info", h.style.cssText = `
            background: rgba(60, 60, 60, 0.8);
            border-radius: 6px;
            padding: 10px;
            font-size: 12px;
            text-align: center;
        `, h.innerHTML = `
            Select multiple nodes to enable alignment<br>
            <small style="opacity: 0.8;">
                Basic: Ctrl+Shift+Arrows<br>
                Flow: Ctrl+Alt+→/↓
            </small>
        `, v.appendChild(h), document.body.appendChild(v);
  }
  function N() {
    var x;
    if (!((x = window.app) != null && x.graph)) return;
    y = Object.values(window.app.graph._nodes || {}).filter((f) => f && f.is_selected);
    const s = y.length > 1;
    s && !B ? L() : !s && B && G();
    const a = document.getElementById("alignment-info");
    a && (y.length === 0 ? a.innerHTML = `
                    Select multiple nodes to enable alignment<br>
                    <small style="opacity: 0.8;">
                        Basic: Ctrl+Shift+Arrows<br>
                        Flow: Ctrl+Alt+→/↓
                    </small>
                ` : y.length === 1 ? a.textContent = "Select additional nodes to align" : a.innerHTML = `
                    ${y.length} nodes selected - ready to align<br>
                    <small style="opacity: 0.8;">Try H-Flow/V-Flow for smart layout</small>
                `);
    const g = v == null ? void 0 : v.querySelectorAll("button");
    g == null || g.forEach((f) => {
      s ? (f.style.opacity = "1", f.style.pointerEvents = "auto") : (f.style.opacity = "0.5", f.style.pointerEvents = "none");
    });
  }
  function L() {
    v && (B = !0, v.style.display = "block", setTimeout(() => {
      v && (v.style.opacity = "1", v.style.transform = "translateX(0)");
    }, 10));
  }
  function G() {
    v && (B = !1, v.style.opacity = "0", v.style.transform = "translateX(20px)", setTimeout(() => {
      v && (v.style.display = "none");
    }, 300));
  }
  function b(n) {
    const s = {}, a = n.filter((g) => g && (g.id !== void 0 || g.id !== null));
    return a.forEach((g) => {
      const x = g.id || `node_${a.indexOf(g)}`;
      g.id = x, s[x] = { inputs: [], outputs: [] }, g.inputs && Array.isArray(g.inputs) && g.inputs.forEach((f, k) => {
        f && f.link !== null && f.link !== void 0 && s[x].inputs.push({
          index: k,
          link: f.link,
          sourceNode: F(f.link, a)
        });
      }), g.outputs && Array.isArray(g.outputs) && g.outputs.forEach((f, k) => {
        f && f.links && Array.isArray(f.links) && f.links.length > 0 && f.links.forEach((m) => {
          const h = W(m, a);
          h && s[x].outputs.push({
            index: k,
            link: m,
            targetNode: h
          });
        });
      });
    }), s;
  }
  function F(n, s) {
    for (const a of s)
      if (a && a.outputs && Array.isArray(a.outputs)) {
        for (const g of a.outputs)
          if (g && g.links && Array.isArray(g.links) && g.links.includes(n))
            return a;
      }
    return null;
  }
  function W(n, s) {
    for (const a of s)
      if (a && a.inputs && Array.isArray(a.inputs)) {
        for (const g of a.inputs)
          if (g && g.link === n)
            return a;
      }
    return null;
  }
  function Q(n, s) {
    const a = {}, g = /* @__PURE__ */ new Set(), x = n.filter((h) => h && h.id), f = x.filter((h) => {
      const p = h.id;
      return !s[p] || !s[p].inputs.length || s[p].inputs.every((u) => !u.sourceNode);
    });
    f.length === 0 && x.length > 0 && f.push(x[0]);
    const k = f.map((h) => ({ node: h, level: 0 }));
    for (; k.length > 0; ) {
      const { node: h, level: p } = k.shift();
      !h || !h.id || g.has(h.id) || (g.add(h.id), a[h.id] = { level: p, order: 0 }, s[h.id] && s[h.id].outputs && s[h.id].outputs.forEach((u) => {
        u && u.targetNode && u.targetNode.id && !g.has(u.targetNode.id) && k.push({ node: u.targetNode, level: p + 1 });
      }));
    }
    x.forEach((h) => {
      h && h.id && !a[h.id] && (a[h.id] = { level: 0, order: 0 });
    });
    const m = {};
    return Object.entries(a).forEach(([h, p]) => {
      m[p.level] || (m[p.level] = []);
      const u = x.find((z) => z && z.id === h);
      u && m[p.level].push(u);
    }), Object.entries(m).forEach(([h, p]) => {
      p && p.length > 0 && (p.sort((u, z) => {
        const I = u && u.pos && u.pos[1] ? u.pos[1] : 0, j = z && z.pos && z.pos[1] ? z.pos[1] : 0;
        return I - j;
      }), p.forEach((u, z) => {
        u && u.id && a[u.id] && (a[u.id].order = z);
      }));
    }), a;
  }
  function P(n) {
    var s, a, g, x, f;
    if (y.length < 2) {
      Z("Please select at least 2 nodes to align", "warning");
      return;
    }
    try {
      const k = Math.min(...y.map((o) => o.pos[0])), m = Math.max(...y.map((o) => {
        let d = 150;
        return o.size && Array.isArray(o.size) && o.size[0] ? d = o.size[0] : typeof o.width == "number" ? d = o.width : o.properties && typeof o.properties.width == "number" && (d = o.properties.width), o.pos[0] + d;
      })), h = Math.min(...y.map((o) => o.pos[1])), p = Math.max(...y.map((o) => {
        let d = 100;
        return o.size && Array.isArray(o.size) && o.size[1] ? d = o.size[1] : typeof o.height == "number" ? d = o.height : o.properties && typeof o.properties.height == "number" && (d = o.properties.height), o.pos[1] + d;
      })), u = Math.max(...y.map((o) => {
        let d = 150;
        return o.size && Array.isArray(o.size) && o.size[0] ? d = o.size[0] : typeof o.width == "number" ? d = o.width : o.properties && typeof o.properties.width == "number" && (d = o.properties.width), d;
      })), z = Math.min(...y.map((o) => {
        let d = 150;
        return o.size && Array.isArray(o.size) && o.size[0] ? d = o.size[0] : typeof o.width == "number" ? d = o.width : o.properties && typeof o.properties.width == "number" && (d = o.properties.width), d;
      })), I = Math.max(...y.map((o) => o.size && o.size[1] !== void 0 ? o.size[1] : typeof o.height == "number" ? o.height : o.properties && typeof o.properties.height == "number" ? o.properties.height : 100)), j = Math.min(...y.map((o) => o.size && o.size[1] !== void 0 ? o.size[1] : typeof o.height == "number" ? o.height : o.properties && typeof o.properties.height == "number" ? o.properties.height : 100));
      let Y;
      switch (n) {
        case "left":
          Y = k;
          const o = [...y].sort((i, r) => i.pos[1] - r.pos[1]);
          let d = o[0].pos[1];
          o.forEach((i, r) => {
            let S = 100;
            i.size && Array.isArray(i.size) && i.size[1] ? S = i.size[1] : typeof i.height == "number" ? S = i.height : i.properties && typeof i.properties.height == "number" && (S = i.properties.height), i.pos[0] = Y, i.pos[1] = d, typeof i.x == "number" && (i.x = i.pos[0]), typeof i.y == "number" && (i.y = i.pos[1]), d += S + 30;
          });
          break;
        case "right":
          Y = m;
          const e = [...y].sort((i, r) => i.pos[1] - r.pos[1]);
          let _ = e[0].pos[1];
          e.forEach((i, r) => {
            let S = 100, C = 150;
            i.size && Array.isArray(i.size) ? (i.size[1] && (S = i.size[1]), i.size[0] && (C = i.size[0])) : (typeof i.height == "number" && (S = i.height), typeof i.width == "number" && (C = i.width), i.properties && (typeof i.properties.height == "number" && (S = i.properties.height), typeof i.properties.width == "number" && (C = i.properties.width))), i.pos[0] = Y - C, i.pos[1] = _, typeof i.x == "number" && (i.x = i.pos[0]), typeof i.y == "number" && (i.y = i.pos[1]), _ += S + 30;
          });
          break;
        case "top":
          Y = h;
          const D = [...y].sort((i, r) => i.pos[0] - r.pos[0]);
          let at = D[0].pos[0];
          D.forEach((i, r) => {
            let S = 150;
            i.size && Array.isArray(i.size) && i.size[0] ? S = i.size[0] : typeof i.width == "number" ? S = i.width : i.properties && typeof i.properties.width == "number" && (S = i.properties.width), i.pos[1] = Y, i.pos[0] = at, typeof i.x == "number" && (i.x = i.pos[0]), typeof i.y == "number" && (i.y = i.pos[1]), at += S + 30;
          });
          break;
        case "bottom":
          Y = p;
          const pt = [...y].sort((i, r) => i.pos[0] - r.pos[0]);
          let J = k;
          pt.forEach((i, r) => {
            let S = 150, C = 100;
            i.size && Array.isArray(i.size) ? (i.size[0] && (S = i.size[0]), i.size[1] && (C = i.size[1])) : (typeof i.width == "number" && (S = i.width), typeof i.height == "number" && (C = i.height), i.properties && (typeof i.properties.width == "number" && (S = i.properties.width), typeof i.properties.height == "number" && (C = i.properties.height)));
            const ot = Y - C, mt = J;
            i.pos[1] = ot, i.pos[0] = mt, typeof i.x == "number" && (i.x = i.pos[0]), typeof i.y == "number" && (i.y = i.pos[1]), J += S + 30;
          });
          break;
        case "width-max":
          y.forEach((i) => {
            i.size && (i.size[0] = u);
          });
          break;
        case "width-min":
          y.forEach((i) => {
            i.size && (i.size[0] = z);
          });
          break;
        case "height-max":
          y.forEach((i) => {
            i.size && (i.size[1] = I);
          });
          break;
        case "height-min":
          y.forEach((i) => {
            if (i.size) {
              const r = i.computeSize ? i.computeSize.call(i)[1] : null, A = r && r > j ? r : j;
              i.size[1] = A;
            }
          });
          break;
        case "size-max":
          y.forEach((i) => {
            i.size && (i.size[0] = u, i.size[1] = I);
          });
          break;
        case "size-min":
          y.forEach((i) => {
            if (i.size)
              if (i.computeSize) {
                const r = i.computeSize.call(i);
                i.size[0] = r[0], i.size[1] = r[1];
              } else
                i.size[0] = 150, i.size[1] = 100;
          });
          break;
        case "horizontal-flow":
          ct();
          return;
        // Don't continue to the success message at the bottom
        case "vertical-flow":
          rt();
          return;
      }
      try {
        (a = (s = window.app) == null ? void 0 : s.canvas) != null && a.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (x = (g = window.app) == null ? void 0 : g.graph) != null && x.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (f = window.app) != null && f.canvas && window.app.canvas.draw(!0, !0);
      } catch {
      }
    } catch {
      Z("Error during alignment", "error");
    }
  }
  function $(n) {
  }
  function ct() {
    var n, s, a, g, x;
    try {
      const f = y.filter((e) => {
        if (!e) return !1;
        const _ = e.pos || e.position || typeof e.x == "number" && typeof e.y == "number", D = e.size || e.width || e.height || typeof e.width == "number" && typeof e.height == "number";
        return !!_ && !!D;
      });
      if (f.length < 2) {
        Z(`Not enough valid nodes: ${f.length}/${y.length} nodes are valid`, "warning");
        return;
      }
      const k = Math.min(...f.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[0] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[0] : typeof e.x == "number" ? e.x : 0)), m = Math.min(...f.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[1] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[1] : typeof e.y == "number" ? e.y : 0)), h = k, p = m;
      f.forEach((e) => {
        e.pos || (e.position && Array.isArray(e.position) ? e.pos = e.position : typeof e.x == "number" && typeof e.y == "number" ? e.pos = [e.x, e.y] : e.pos = [0, 0]), e._calculatedSize || (e.size && Array.isArray(e.size) ? e._calculatedSize = [e.size[0], e.size[1]] : typeof e.width == "number" && typeof e.height == "number" ? e._calculatedSize = [e.width, e.height] : e._calculatedSize = [150, 100]), Array.isArray(e.pos) || (e.pos = [0, 0]);
      });
      const u = b(f), z = Q(f, u), I = 30, j = 30, Y = 30, o = 5, d = {};
      f.forEach((e) => {
        var _;
        if (e && e.id) {
          const D = ((_ = z[e.id]) == null ? void 0 : _.level) ?? 0;
          d[D] || (d[D] = []), d[D].push(e);
        }
      }), Object.entries(d).forEach(([e, _]) => {
        const D = parseInt(e);
        if (_ && _.length > 0) {
          _.sort((r, A) => {
            const S = r && r.id && z[r.id] ? z[r.id].order : 0, C = A && A.id && z[A.id] ? z[A.id].order : 0;
            return S - C;
          });
          const at = _.reduce((r, A, S) => {
            const C = A && A._calculatedSize && A._calculatedSize[1] ? A._calculatedSize[1] : 100;
            return r + C + (S < _.length - 1 ? Y : 0);
          }, 0), pt = Math.max(..._.map(
            (r) => r && r._calculatedSize && r._calculatedSize[0] ? r._calculatedSize[0] : 150
          ));
          let J = h;
          if (D > 0)
            for (let r = 0; r < D; r++) {
              const A = d[r] || [], S = Math.max(...A.map(
                (C) => C && C._calculatedSize && C._calculatedSize[0] ? C._calculatedSize[0] : 150
              ));
              J += S + I + o;
            }
          let i = p;
          _.forEach((r, A) => {
            if (r && r.pos && r._calculatedSize) {
              const S = [r.pos[0], r.pos[1]], C = [r._calculatedSize[0], r._calculatedSize[1]];
              r.pos[0] = J, r.pos[1] = i, i += r._calculatedSize[1] + Y, typeof r.x == "number" && (r.x = r.pos[0]), typeof r.y == "number" && (r.y = r.pos[1]);
            }
          });
        }
      });
      try {
        (s = (n = window.app) == null ? void 0 : n.canvas) != null && s.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (g = (a = window.app) == null ? void 0 : a.graph) != null && g.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (x = window.app) != null && x.canvas && window.app.canvas.draw(!0, !0);
      } catch {
      }
    } catch {
      Z("Error in horizontal flow alignment", "error");
    }
  }
  function rt() {
    var n, s, a, g, x;
    try {
      const f = y.filter((e) => {
        if (!e) return !1;
        const _ = e.pos || e.position || typeof e.x == "number" && typeof e.y == "number", D = e.size || e.width || e.height || typeof e.width == "number" && typeof e.height == "number";
        return !!_ && !!D;
      });
      if (f.length < 2) {
        Z(`Not enough valid nodes: ${f.length}/${y.length} nodes are valid`, "warning");
        return;
      }
      const k = Math.min(...f.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[0] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[0] : typeof e.x == "number" ? e.x : 0)), m = Math.min(...f.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[1] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[1] : typeof e.y == "number" ? e.y : 0)), h = k, p = m;
      f.forEach((e) => {
        e.pos || (e.position && Array.isArray(e.position) ? e.pos = e.position : typeof e.x == "number" && typeof e.y == "number" ? e.pos = [e.x, e.y] : e.pos = [0, 0]), e._calculatedSize || (e.size && Array.isArray(e.size) ? e._calculatedSize = [e.size[0], e.size[1]] : typeof e.width == "number" && typeof e.height == "number" ? e._calculatedSize = [e.width, e.height] : e._calculatedSize = [150, 100]), Array.isArray(e.pos) || (e.pos = [0, 0]);
      });
      const u = b(f), z = Q(f, u), I = 30, j = 30, Y = 30, o = 5, d = {};
      f.forEach((e) => {
        var _;
        if (e && e.id) {
          const D = ((_ = z[e.id]) == null ? void 0 : _.level) ?? 0;
          d[D] || (d[D] = []), d[D].push(e);
        }
      }), Object.entries(d).forEach(([e, _]) => {
        const D = parseInt(e);
        if (_ && _.length > 0) {
          _.sort((r, A) => {
            const S = r && r.id && z[r.id] ? z[r.id].order : 0, C = A && A.id && z[A.id] ? z[A.id].order : 0;
            return S - C;
          });
          const at = _.reduce((r, A, S) => {
            const C = A && A._calculatedSize && A._calculatedSize[0] ? A._calculatedSize[0] : 150;
            return r + C + j;
          }, 0), pt = Math.max(..._.map(
            (r) => r && r._calculatedSize && r._calculatedSize[1] ? r._calculatedSize[1] : 100
          ));
          let J = p;
          if (D > 0)
            for (let r = 0; r < D; r++) {
              const A = d[r] || [], S = Math.max(...A.map(
                (C) => C && C._calculatedSize && C._calculatedSize[1] ? C._calculatedSize[1] : 100
              ));
              J += S + I + o;
            }
          let i = h;
          _.forEach((r, A) => {
            if (r && r.pos && r._calculatedSize) {
              const S = [r.pos[0], r.pos[1]], C = [r._calculatedSize[0], r._calculatedSize[1]];
              r.pos[0] = i, r.pos[1] = J, i += r._calculatedSize[0] + j, typeof r.x == "number" && (r.x = r.pos[0]), typeof r.y == "number" && (r.y = r.pos[1]);
            }
          });
        }
      });
      try {
        (s = (n = window.app) == null ? void 0 : n.canvas) != null && s.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (g = (a = window.app) == null ? void 0 : a.graph) != null && g.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (x = window.app) != null && x.canvas && window.app.canvas.draw(!0, !0);
      } catch {
      }
    } catch {
      Z("Error in vertical flow alignment", "error");
    }
  }
  function Z(n, s = "info") {
    const a = document.createElement("div");
    a.textContent = n, a.style.cssText = `
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
        `, document.body.appendChild(a), setTimeout(() => {
      a.style.opacity = "1", a.style.transform = "translateX(0)";
    }, 10), setTimeout(() => {
      a.style.opacity = "0", a.style.transform = "translateX(20px)", setTimeout(() => {
        a.parentNode && a.parentNode.removeChild(a);
      }, 300);
    }, 3e3);
  }
  function st() {
    var n;
    if (!((n = window.app) != null && n.canvas)) {
      setTimeout(st, 100);
      return;
    }
    window.app.canvas.canvas && (window.app.canvas.canvas.addEventListener("click", () => {
      setTimeout(N, 10);
    }), window.app.canvas.canvas.addEventListener("mouseup", () => {
      setTimeout(N, 10);
    }), document.addEventListener("keydown", (s) => {
      (s.ctrlKey || s.metaKey) && setTimeout(N, 10);
    })), setInterval(N, 500);
  }
  function E(n) {
    if (n.ctrlKey || n.metaKey) {
      if (n.shiftKey)
        switch (n.key) {
          case "ArrowLeft":
            n.preventDefault(), P("left");
            break;
          case "ArrowRight":
            n.preventDefault(), P("right");
            break;
          case "ArrowUp":
            n.preventDefault(), P("top");
            break;
          case "ArrowDown":
            n.preventDefault(), P("bottom");
            break;
        }
      else if (n.altKey)
        switch (n.key) {
          case "ArrowRight":
            n.preventDefault(), P("horizontal-flow");
            break;
          case "ArrowDown":
            n.preventDefault(), P("vertical-flow");
            break;
        }
    }
  }
  T(), st(), document.addEventListener("keydown", E);
}
