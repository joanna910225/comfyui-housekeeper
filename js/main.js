import { app as Lt } from "../../../scripts/app.js";
import { ComponentWidgetImpl as Ft, addWidget as Xt } from "../../../scripts/domWidget.js";
import { defineComponent as vt, ref as $, resolveDirective as Ht, createElementBlock as gt, openBlock as ot, Fragment as _t, createElementVNode as et, withDirectives as Vt, createVNode as mt, createBlock as Ct, unref as L, normalizeClass as At, withCtx as dt, createTextVNode as Et, toDisplayString as ht, renderList as Yt, normalizeStyle as Rt, onMounted as Nt, nextTick as $t } from "vue";
import bt from "primevue/button";
import { useI18n as kt } from "vue-i18n";
const Wt = { class: "toolbar" }, Gt = { class: "color-picker" }, jt = { class: "size-slider" }, Ut = ["value"], Kt = /* @__PURE__ */ vt({
  __name: "ToolBar",
  props: {
    colors: {},
    initialColor: {},
    initialBrushSize: {},
    initialTool: {}
  },
  emits: ["tool-change", "color-change", "canvas-clear", "brush-size-change"],
  setup(y, { emit: M }) {
    const { t: m } = kt(), E = y, V = M, J = E.colors || ["#000000", "#ff0000", "#0000ff", "#69a869", "#ffff00", "#ff00ff", "#00ffff"], F = $(E.initialColor || "#000000"), X = $(E.initialBrushSize || 5), D = $(E.initialTool || "pen");
    function N(O) {
      D.value = O, V("tool-change", O);
    }
    function B(O) {
      F.value = O, V("color-change", O);
    }
    function W() {
      V("canvas-clear");
    }
    function d(O) {
      const Y = O.target;
      X.value = Number(Y.value), V("brush-size-change", X.value);
    }
    return (O, Y) => {
      const Z = Ht("tooltip");
      return ot(), gt(_t, null, [
        et("div", Wt, [
          Vt((ot(), Ct(L(bt), {
            class: At({ active: D.value === "pen" }),
            onClick: Y[0] || (Y[0] = (k) => N("pen"))
          }, {
            default: dt(() => [
              Et(ht(L(m)("vue-basic.pen")), 1)
            ]),
            _: 1
          }, 8, ["class"])), [
            [Z, { value: L(m)("vue-basic.pen-tooltip"), showDelay: 300 }]
          ]),
          mt(L(bt), { onClick: W }, {
            default: dt(() => [
              Et(ht(L(m)("vue-basic.clear-canvas")), 1)
            ]),
            _: 1
          })
        ]),
        et("div", Gt, [
          (ot(!0), gt(_t, null, Yt(L(J), (k, R) => (ot(), Ct(L(bt), {
            key: R,
            class: At({ "color-button": !0, active: F.value === k }),
            onClick: (nt) => B(k),
            type: "button",
            title: k
          }, {
            default: dt(() => [
              et("i", {
                class: "pi pi-circle-fill",
                style: Rt({ color: k })
              }, null, 4)
            ]),
            _: 2
          }, 1032, ["class", "onClick", "title"]))), 128))
        ]),
        et("div", jt, [
          et("label", null, ht(L(m)("vue-basic.brush-size")) + ": " + ht(X.value) + "px", 1),
          et("input", {
            type: "range",
            min: "1",
            max: "50",
            value: X.value,
            onChange: Y[1] || (Y[1] = (k) => d(k))
          }, null, 40, Ut)
        ])
      ], 64);
    };
  }
}), zt = (y, M) => {
  const m = y.__vccOpts || y;
  for (const [E, V] of M)
    m[E] = V;
  return m;
}, qt = /* @__PURE__ */ zt(Kt, [["__scopeId", "data-v-cae98791"]]), Jt = { class: "drawing-board" }, Qt = { class: "canvas-container" }, Zt = ["width", "height"], te = /* @__PURE__ */ vt({
  __name: "DrawingBoard",
  props: {
    width: {},
    height: {},
    initialColor: {},
    initialBrushSize: {}
  },
  emits: ["mounted", "drawing-start", "drawing", "drawing-end", "state-save", "canvas-clear"],
  setup(y, { expose: M, emit: m }) {
    const E = y, V = E.width || 800, J = E.height || 500, F = E.initialColor || "#000000", X = E.initialBrushSize || 5, D = m, N = $(!1), B = $(0), W = $(0), d = $(null), O = $(!1), Y = $(X), Z = $(F), k = $(null), R = $(null);
    Nt(() => {
      R.value && (d.value = R.value.getContext("2d"), nt(), $t(() => {
        R.value && D("mounted", R.value);
      }));
    });
    function nt() {
      d.value && (d.value.fillStyle = "#ffffff", d.value.fillRect(0, 0, V, J), it(), u());
    }
    function it() {
      d.value && (O.value ? (d.value.globalCompositeOperation = "destination-out", d.value.strokeStyle = "rgba(0,0,0,1)") : (d.value.globalCompositeOperation = "source-over", d.value.strokeStyle = Z.value), d.value.lineWidth = Y.value, d.value.lineJoin = "round", d.value.lineCap = "round");
    }
    function tt(g) {
      N.value = !0;
      const { offsetX: c, offsetY: a } = n(g);
      B.value = c, W.value = a, d.value && (d.value.beginPath(), d.value.moveTo(B.value, W.value), d.value.arc(B.value, W.value, Y.value / 2, 0, Math.PI * 2), d.value.fill(), D("drawing-start", {
        x: c,
        y: a,
        tool: O.value ? "eraser" : "pen"
      }));
    }
    function rt(g) {
      if (!N.value || !d.value) return;
      const { offsetX: c, offsetY: a } = n(g);
      d.value.beginPath(), d.value.moveTo(B.value, W.value), d.value.lineTo(c, a), d.value.stroke(), B.value = c, W.value = a, D("drawing", {
        x: c,
        y: a,
        tool: O.value ? "eraser" : "pen"
      });
    }
    function S() {
      N.value && (N.value = !1, u(), D("drawing-end"));
    }
    function n(g) {
      let c = 0, a = 0;
      if ("touches" in g) {
        if (g.preventDefault(), R.value) {
          const _ = R.value.getBoundingClientRect();
          c = g.touches[0].clientX - _.left, a = g.touches[0].clientY - _.top;
        }
      } else
        c = g.offsetX, a = g.offsetY;
      return { offsetX: c, offsetY: a };
    }
    function s(g) {
      g.preventDefault();
      const a = {
        touches: [g.touches[0]]
      };
      tt(a);
    }
    function r(g) {
      if (g.preventDefault(), !N.value) return;
      const a = {
        touches: [g.touches[0]]
      };
      rt(a);
    }
    function h(g) {
      O.value = g === "eraser", it();
    }
    function v(g) {
      Z.value = g, it();
    }
    function l(g) {
      Y.value = g, it();
    }
    function b() {
      d.value && (d.value.fillStyle = "#ffffff", d.value.fillRect(0, 0, V, J), it(), u(), D("canvas-clear"));
    }
    function u() {
      R.value && (k.value = R.value.toDataURL("image/png"), k.value && D("state-save", k.value));
    }
    async function f() {
      if (!R.value)
        throw new Error("Canvas is unable to get current data");
      return k.value ? k.value : R.value.toDataURL("image/png");
    }
    return M({
      setTool: h,
      setColor: v,
      setBrushSize: l,
      clearCanvas: b,
      getCurrentCanvasData: f
    }), (g, c) => (ot(), gt("div", Jt, [
      et("div", Qt, [
        et("canvas", {
          ref_key: "canvas",
          ref: R,
          width: L(V),
          height: L(J),
          onMousedown: tt,
          onMousemove: rt,
          onMouseup: S,
          onMouseleave: S,
          onTouchstart: s,
          onTouchmove: r,
          onTouchend: S
        }, null, 40, Zt)
      ])
    ]));
  }
}), ee = /* @__PURE__ */ zt(te, [["__scopeId", "data-v-ca1239fc"]]), ie = { class: "drawing-app" }, re = /* @__PURE__ */ vt({
  __name: "DrawingApp",
  props: {
    width: {},
    height: {},
    initialColor: {},
    initialBrushSize: {},
    availableColors: {}
  },
  emits: ["tool-change", "color-change", "brush-size-change", "drawing-start", "drawing", "drawing-end", "state-save", "mounted"],
  setup(y, { expose: M, emit: m }) {
    const E = y, V = E.width || 800, J = E.height || 500, F = E.initialColor || "#000000", X = E.initialBrushSize || 5, D = E.availableColors || ["#000000", "#ff0000", "#0000ff", "#00ff00", "#ffff00", "#ff00ff", "#00ffff"], N = m, B = $(null), W = $(null);
    function d(S) {
      var n;
      (n = B.value) == null || n.setTool(S), N("tool-change", S);
    }
    function O(S) {
      var n;
      (n = B.value) == null || n.setColor(S), N("color-change", S);
    }
    function Y(S) {
      var n;
      (n = B.value) == null || n.setBrushSize(S), N("brush-size-change", S);
    }
    function Z() {
      var S;
      (S = B.value) == null || S.clearCanvas();
    }
    function k(S) {
      N("drawing-start", S);
    }
    function R(S) {
      N("drawing", S);
    }
    function nt() {
      N("drawing-end");
    }
    function it(S) {
      W.value = S, N("state-save", S);
    }
    function tt(S) {
      N("mounted", S);
    }
    async function rt() {
      if (W.value)
        return W.value;
      if (B.value)
        try {
          return await B.value.getCurrentCanvasData();
        } catch (S) {
          throw console.error("unable to get canvas data:", S), new Error("unable to get canvas data");
        }
      throw new Error("get canvas data failed");
    }
    return M({
      getCanvasData: rt
    }), (S, n) => (ot(), gt("div", ie, [
      mt(qt, {
        colors: L(D),
        initialColor: L(F),
        initialBrushSize: L(X),
        onToolChange: d,
        onColorChange: O,
        onBrushSizeChange: Y,
        onCanvasClear: Z
      }, null, 8, ["colors", "initialColor", "initialBrushSize"]),
      mt(ee, {
        ref_key: "drawingBoard",
        ref: B,
        width: L(V),
        height: L(J),
        initialColor: L(F),
        initialBrushSize: L(X),
        onDrawingStart: k,
        onDrawing: R,
        onDrawingEnd: nt,
        onStateSave: it,
        onMounted: tt
      }, null, 8, ["width", "height", "initialColor", "initialBrushSize"])
    ]));
  }
}), se = /* @__PURE__ */ zt(re, [["__scopeId", "data-v-39bbf58b"]]), ae = /* @__PURE__ */ vt({
  __name: "VueExampleComponent",
  props: {
    widget: {}
  },
  setup(y) {
    const { t: M } = kt(), m = $(null), E = $(null);
    y.widget.node;
    function V(F) {
      E.value = F, console.log("canvas state saved:", F.substring(0, 50) + "...");
    }
    async function J(F, X) {
      var D;
      try {
        if (!((D = window.app) != null && D.api))
          throw new Error("ComfyUI API not available");
        const N = await fetch(F).then((Y) => Y.blob()), B = `${X}_${Date.now()}.png`, W = new File([N], B), d = new FormData();
        return d.append("image", W), d.append("subfolder", "threed"), d.append("type", "temp"), console.log("Vue Component: Using window.app.api.fetchApi"), (await window.app.api.fetchApi("/upload/image", {
          method: "POST",
          body: d
        })).json();
      } catch (N) {
        throw console.error("Vue Component: Error uploading image:", N), N;
      }
    }
    return Nt(() => {
      y.widget.serializeValue = async (F, X) => {
        try {
          console.log("Vue Component: inside vue serializeValue"), console.log("node", F), console.log("index", X);
          const D = E.value;
          return D ? {
            image: `threed/${(await J(D, "test_vue_basic")).name} [temp]`
          } : (console.warn("Vue Component: No canvas data available"), { image: null });
        } catch (D) {
          return console.error("Vue Component: Error in serializeValue:", D), { image: null };
        }
      };
    }), (F, X) => (ot(), gt("div", null, [
      et("h1", null, ht(L(M)("vue-basic.title")), 1),
      et("div", null, [
        mt(se, {
          ref_key: "drawingAppRef",
          ref: m,
          width: 300,
          height: 300,
          onStateSave: V
        }, null, 512)
      ])
    ]));
  }
}), Dt = Lt;
Dt.registerExtension({
  name: "vue-basic",
  getCustomWidgets(y) {
    return {
      CUSTOM_VUE_COMPONENT_BASIC(M) {
        const m = {
          name: "custom_vue_component_basic",
          type: "vue-basic"
        }, E = new Ft({
          node: M,
          name: m.name,
          component: ae,
          inputSpec: m,
          options: {}
        });
        return Xt(M, E), { widget: E };
      }
    };
  },
  nodeCreated(y) {
    if (y.constructor.comfyClass !== "vue-basic") return;
    const [M, m] = y.size;
    y.setSize([Math.max(M, 300), Math.max(m, 520)]);
  }
});
Dt.registerExtension({
  name: "housekeeper-alignment",
  async setup() {
    try {
      oe();
    } catch (y) {
      console.error("Housekeeper: Error setting up alignment panel:", y);
    }
  },
  nodeCreated(y) {
    y.constructor.comfyClass === "housekeeper-alignment" && (y.setSize([200, 100]), y.title && (y.title = "🎯 Alignment Panel Active"));
  }
});
function oe() {
  let y = null, M = !1, m = [], E = [];
  function V(n) {
    var h;
    if (m.length < 2) return;
    J();
    const s = (h = window.app) == null ? void 0 : h.canvas;
    if (!s) return;
    console.log("📍 ORIGINAL NODE POSITIONS BEFORE PREVIEW:", m.map((v, l) => ({
      index: l,
      nodeId: v.id,
      currentPos: { x: v.pos[0], y: v.pos[1] }
    }))), console.log("🎛️ Canvas state:", {
      canvasOffset: s.ds.offset,
      canvasScale: s.ds.scale
    });
    const r = F(n, m);
    console.log("📍 Preview positions:", r.map((v, l) => ({
      index: l,
      nodeId: m[l].id,
      previewPos: { x: v.x, y: v.y }
    }))), r.forEach((v, l) => {
      if (v && m[l]) {
        const b = document.createElement("div");
        b.style.cssText = `
                    position: fixed;
                    background: rgba(74, 144, 226, 0.3);
                    border: 2px dashed rgba(74, 144, 226, 0.7);
                    border-radius: 4px;
                    z-index: 999;
                    pointer-events: none;
                    transition: all 0.2s ease;
                `;
        const u = (v.x + s.ds.offset[0]) * s.ds.scale, f = (v.y + s.ds.offset[1]) * s.ds.scale, g = s.canvas.parentElement, c = s.canvas.getBoundingClientRect(), a = g ? g.getBoundingClientRect() : null;
        a && c.top - a.top, c.top;
        const _ = document.querySelector("nav");
        let G = 31;
        _ && (G = _.getBoundingClientRect().height);
        const U = G * s.ds.scale, Q = c.left + u, T = c.top + f - U;
        console.log("🔧 Nav-based offset method:", {
          navHeight: _ ? _.getBoundingClientRect().height : "not found",
          baseOffset: G,
          canvasScale: s.ds.scale,
          scaledOffset: U,
          calculation: `${c.top} + ${f} - ${U} = ${T}`,
          result: { x: Q, y: T }
        });
        const e = v.width * s.ds.scale, z = v.height * s.ds.scale;
        b.style.left = Q + "px", b.style.top = T + "px", b.style.width = e + "px", b.style.height = z + "px", document.body.appendChild(b), E.push(b);
      }
    });
  }
  function J() {
    E.forEach((n) => {
      n.parentNode && n.parentNode.removeChild(n);
    }), E = [];
  }
  function F(n, s) {
    if (s.length < 2) return [];
    const r = [], h = Math.min(...s.map((u) => u.pos[0])), v = Math.max(...s.map((u) => {
      let f = 150;
      return u.size && Array.isArray(u.size) && u.size[0] ? f = u.size[0] : typeof u.width == "number" ? f = u.width : u.properties && typeof u.properties.width == "number" && (f = u.properties.width), u.pos[0] + f;
    })), l = Math.min(...s.map((u) => u.pos[1])), b = Math.max(...s.map((u) => {
      let f = 100;
      return u.size && Array.isArray(u.size) && u.size[1] ? f = u.size[1] : typeof u.height == "number" ? f = u.height : u.properties && typeof u.properties.height == "number" && (f = u.properties.height), u.pos[1] + f;
    }));
    switch (n) {
      case "left":
        const u = [...s].sort((t, p) => t.pos[1] - p.pos[1]);
        let f = u[0].pos[1];
        const g = /* @__PURE__ */ new Map();
        u.forEach((t) => {
          let p = 100, w = 150;
          t.size && Array.isArray(t.size) ? (t.size[1] && (p = t.size[1]), t.size[0] && (w = t.size[0])) : (typeof t.height == "number" && (p = t.height), typeof t.width == "number" && (w = t.width), t.properties && (typeof t.properties.height == "number" && (p = t.properties.height), typeof t.properties.width == "number" && (w = t.properties.width))), g.set(t.id, {
            x: h,
            y: f,
            width: w,
            height: p
          }), f += p + 30;
        }), s.forEach((t) => {
          r.push(g.get(t.id));
        });
        break;
      case "right":
        const c = [...s].sort((t, p) => t.pos[1] - p.pos[1]);
        let a = c[0].pos[1];
        const _ = /* @__PURE__ */ new Map();
        c.forEach((t) => {
          let p = 100, w = 150;
          t.size && Array.isArray(t.size) ? (t.size[1] && (p = t.size[1]), t.size[0] && (w = t.size[0])) : (typeof t.height == "number" && (p = t.height), typeof t.width == "number" && (w = t.width), t.properties && (typeof t.properties.height == "number" && (p = t.properties.height), typeof t.properties.width == "number" && (w = t.properties.width))), _.set(t.id, {
            x: v - w,
            y: a,
            width: w,
            height: p
          }), a += p + 30;
        }), s.forEach((t) => {
          r.push(_.get(t.id));
        });
        break;
      case "top":
        const G = [...s].sort((t, p) => t.pos[0] - p.pos[0]);
        let U = G[0].pos[0];
        const Q = /* @__PURE__ */ new Map();
        G.forEach((t) => {
          let p = 100, w = 150;
          t.size && Array.isArray(t.size) ? (t.size[1] && (p = t.size[1]), t.size[0] && (w = t.size[0])) : (typeof t.height == "number" && (p = t.height), typeof t.width == "number" && (w = t.width), t.properties && (typeof t.properties.height == "number" && (p = t.properties.height), typeof t.properties.width == "number" && (w = t.properties.width))), Q.set(t.id, {
            x: U,
            y: l,
            width: w,
            height: p
          }), U += w + 30;
        }), s.forEach((t) => {
          r.push(Q.get(t.id));
        });
        break;
      case "bottom":
        const T = [...s].sort((t, p) => t.pos[0] - p.pos[0]);
        let e = h;
        const z = /* @__PURE__ */ new Map();
        T.forEach((t) => {
          let p = 100, w = 150;
          t.size && Array.isArray(t.size) ? (t.size[1] && (p = t.size[1]), t.size[0] && (w = t.size[0])) : (typeof t.height == "number" && (p = t.height), typeof t.width == "number" && (w = t.width), t.properties && (typeof t.properties.height == "number" && (p = t.properties.height), typeof t.properties.width == "number" && (w = t.properties.width))), z.set(t.id, {
            x: e,
            y: b - p,
            width: w,
            height: p
          }), e += w + 30;
        }), s.forEach((t) => {
          r.push(z.get(t.id));
        });
        break;
      case "horizontal-flow":
        const i = s.filter((t) => {
          if (!t) return !1;
          const p = t.pos || t.position || typeof t.x == "number" && typeof t.y == "number", w = t.size || t.width || t.height || typeof t.width == "number" && typeof t.height == "number";
          return !!p && !!w;
        });
        if (i.length < 2) break;
        const I = Math.min(...i.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[0] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[0] : typeof t.x == "number" ? t.x : 0)), st = Math.min(...i.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[1] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[1] : typeof t.y == "number" ? t.y : 0)), C = i.map((t) => ({
          ...t,
          pos: t.pos ? [...t.pos] : [t.x || 0, t.y || 0],
          _calculatedSize: t.size && Array.isArray(t.size) ? [t.size[0], t.size[1]] : [t.width || 150, t.height || 100]
        })), H = d(C), o = Z(C, H), A = 40, j = 15, P = 5, lt = {};
        C.forEach((t) => {
          var p;
          if (t && t.id) {
            const w = ((p = o[t.id]) == null ? void 0 : p.level) ?? 0;
            lt[w] || (lt[w] = []), lt[w].push(t);
          }
        });
        const xt = /* @__PURE__ */ new Map();
        Object.entries(lt).forEach(([t, p]) => {
          const w = parseInt(t);
          if (p && p.length > 0) {
            p.sort((x, K) => {
              const at = x && x.id && o[x.id] ? o[x.id].order : 0, q = K && K.id && o[K.id] ? o[K.id].order : 0;
              return at - q;
            });
            let ut = I;
            if (w > 0)
              for (let x = 0; x < w; x++) {
                const K = lt[x] || [], at = Math.max(...K.map(
                  (q) => q && q._calculatedSize && q._calculatedSize[0] ? q._calculatedSize[0] : 150
                ));
                ut += at + A + P;
              }
            let ft = st;
            p.forEach((x) => {
              x && x._calculatedSize && (xt.set(x.id, {
                x: ut,
                y: ft,
                width: x._calculatedSize[0],
                height: x._calculatedSize[1]
              }), ft += x._calculatedSize[1] + j);
            });
          }
        }), s.forEach((t) => {
          const p = xt.get(t.id);
          p && r.push(p);
        });
        break;
      case "vertical-flow":
        const yt = s.filter((t) => {
          if (!t) return !1;
          const p = t.pos || t.position || typeof t.x == "number" && typeof t.y == "number", w = t.size || t.width || t.height || typeof t.width == "number" && typeof t.height == "number";
          return !!p && !!w;
        });
        if (yt.length < 2) break;
        const Pt = Math.min(...yt.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[0] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[0] : typeof t.x == "number" ? t.x : 0)), Tt = Math.min(...yt.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[1] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[1] : typeof t.y == "number" ? t.y : 0)), wt = yt.map((t) => ({
          ...t,
          pos: t.pos ? [...t.pos] : [t.x || 0, t.y || 0],
          _calculatedSize: t.size && Array.isArray(t.size) ? [t.size[0], t.size[1]] : [t.width || 150, t.height || 100]
        })), Mt = d(wt), ct = Z(wt, Mt), Bt = 50, Ot = 30, It = 15, pt = {};
        wt.forEach((t) => {
          var p;
          if (t && t.id) {
            const w = ((p = ct[t.id]) == null ? void 0 : p.level) ?? 0;
            pt[w] || (pt[w] = []), pt[w].push(t);
          }
        });
        const St = /* @__PURE__ */ new Map();
        Object.entries(pt).forEach(([t, p]) => {
          const w = parseInt(t);
          if (p && p.length > 0) {
            p.sort((x, K) => {
              const at = x && x.id && ct[x.id] ? ct[x.id].order : 0, q = K && K.id && ct[K.id] ? ct[K.id].order : 0;
              return at - q;
            });
            let ut = Tt;
            if (w > 0)
              for (let x = 0; x < w; x++) {
                const K = pt[x] || [], at = Math.max(...K.map(
                  (q) => q && q._calculatedSize && q._calculatedSize[1] ? q._calculatedSize[1] : 100
                ));
                ut += at + Bt + It;
              }
            let ft = Pt;
            p.forEach((x) => {
              x && x._calculatedSize && (St.set(x.id, {
                x: ft,
                y: ut,
                width: x._calculatedSize[0],
                height: x._calculatedSize[1]
              }), ft += x._calculatedSize[0] + Ot);
            });
          }
        }), s.forEach((t) => {
          const p = St.get(t.id);
          p && r.push(p);
        });
        break;
    }
    return r;
  }
  function X(n, s = !1) {
    const r = document.createElement("button");
    r.innerHTML = `
            <span style="font-size: 16px; display: block;">${n.icon}</span>
            <span style="font-size: 11px;">${n.label}</span>
        `;
    const h = s ? "#4a5568" : "#505050", v = s ? "#5a6578" : "#606060";
    return r.style.cssText = `
            background: linear-gradient(145deg, ${h}, #404040);
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
        `, r.addEventListener("mouseenter", () => {
      r.style.background = `linear-gradient(145deg, ${v}, #505050)`, r.style.transform = "translateY(-1px)", r.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)", V(n.type);
    }), r.addEventListener("mouseleave", () => {
      r.style.background = `linear-gradient(145deg, ${h}, #404040)`, r.style.transform = "translateY(0)", r.style.boxShadow = "none", J();
    }), r.addEventListener("click", () => k(n.type)), r;
  }
  function D() {
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
    const n = document.createElement("div");
    n.innerHTML = "🎯 Node Alignment", n.style.cssText = `
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 12px;
            text-align: center;
            border-bottom: 1px solid #555;
            padding-bottom: 8px;
        `, y.appendChild(n);
    const s = document.createElement("div");
    s.style.cssText = `
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
    const h = [
      { type: "left", icon: "⇤", label: "Left" },
      { type: "right", icon: "⇥", label: "Right" },
      { type: "top", icon: "⇡", label: "Top" },
      { type: "bottom", icon: "⇣", label: "Bottom" },
      { type: "horizontal-flow", icon: "→", label: "H-Flow" },
      { type: "vertical-flow", icon: "↓", label: "V-Flow" }
    ], v = h.slice(0, 4), l = h.slice(4);
    v.forEach((u) => {
      const f = X(u);
      s.appendChild(f);
    }), l.forEach((u) => {
      const f = X(u, !0);
      r.appendChild(f);
    }), y.appendChild(s), y.appendChild(r);
    const b = document.createElement("div");
    b.id = "alignment-info", b.style.cssText = `
            background: rgba(60, 60, 60, 0.8);
            border-radius: 6px;
            padding: 10px;
            font-size: 12px;
            text-align: center;
        `, b.innerHTML = `
            Select multiple nodes to enable alignment<br>
            <small style="opacity: 0.8;">
                Basic: Ctrl+Shift+Arrows<br>
                Flow: Ctrl+Alt+→/↓
            </small>
        `, y.appendChild(b), document.body.appendChild(y);
  }
  function N() {
    var v;
    if (!((v = window.app) != null && v.graph)) return;
    m = Object.values(window.app.graph._nodes || {}).filter((l) => l && l.is_selected);
    const s = m.length > 1;
    s && !M ? B() : !s && M && W();
    const r = document.getElementById("alignment-info");
    r && (m.length === 0 ? r.innerHTML = `
                    Select multiple nodes to enable alignment<br>
                    <small style="opacity: 0.8;">
                        Basic: Ctrl+Shift+Arrows<br>
                        Flow: Ctrl+Alt+→/↓
                    </small>
                ` : m.length === 1 ? r.textContent = "Select additional nodes to align" : r.innerHTML = `
                    ${m.length} nodes selected - ready to align<br>
                    <small style="opacity: 0.8;">Try H-Flow/V-Flow for smart layout</small>
                `);
    const h = y == null ? void 0 : y.querySelectorAll("button");
    h == null || h.forEach((l) => {
      s ? (l.style.opacity = "1", l.style.pointerEvents = "auto") : (l.style.opacity = "0.5", l.style.pointerEvents = "none");
    });
  }
  function B() {
    y && (M = !0, y.style.display = "block", setTimeout(() => {
      y && (y.style.opacity = "1", y.style.transform = "translateX(0)");
    }, 10));
  }
  function W() {
    y && (M = !1, y.style.opacity = "0", y.style.transform = "translateX(20px)", setTimeout(() => {
      y && (y.style.display = "none");
    }, 300));
  }
  function d(n) {
    const s = {}, r = n.filter((h) => h && (h.id !== void 0 || h.id !== null));
    return r.forEach((h) => {
      const v = h.id || `node_${r.indexOf(h)}`;
      h.id = v, s[v] = { inputs: [], outputs: [] }, h.inputs && Array.isArray(h.inputs) && h.inputs.forEach((l, b) => {
        l && l.link !== null && l.link !== void 0 && s[v].inputs.push({
          index: b,
          link: l.link,
          sourceNode: O(l.link, r)
        });
      }), h.outputs && Array.isArray(h.outputs) && h.outputs.forEach((l, b) => {
        l && l.links && Array.isArray(l.links) && l.links.length > 0 && l.links.forEach((u) => {
          const f = Y(u, r);
          f && s[v].outputs.push({
            index: b,
            link: u,
            targetNode: f
          });
        });
      });
    }), s;
  }
  function O(n, s) {
    for (const r of s)
      if (r && r.outputs && Array.isArray(r.outputs)) {
        for (const h of r.outputs)
          if (h && h.links && Array.isArray(h.links) && h.links.includes(n))
            return r;
      }
    return null;
  }
  function Y(n, s) {
    for (const r of s)
      if (r && r.inputs && Array.isArray(r.inputs)) {
        for (const h of r.inputs)
          if (h && h.link === n)
            return r;
      }
    return null;
  }
  function Z(n, s) {
    const r = {}, h = /* @__PURE__ */ new Set(), v = n.filter((f) => f && f.id), l = v.filter((f) => {
      const g = f.id;
      return !s[g] || !s[g].inputs.length || s[g].inputs.every((c) => !c.sourceNode);
    });
    l.length === 0 && v.length > 0 && l.push(v[0]);
    const b = l.map((f) => ({ node: f, level: 0 }));
    for (; b.length > 0; ) {
      const { node: f, level: g } = b.shift();
      !f || !f.id || h.has(f.id) || (h.add(f.id), r[f.id] = { level: g, order: 0 }, s[f.id] && s[f.id].outputs && s[f.id].outputs.forEach((c) => {
        c && c.targetNode && c.targetNode.id && !h.has(c.targetNode.id) && b.push({ node: c.targetNode, level: g + 1 });
      }));
    }
    v.forEach((f) => {
      f && f.id && !r[f.id] && (r[f.id] = { level: 0, order: 0 });
    });
    const u = {};
    return Object.entries(r).forEach(([f, g]) => {
      u[g.level] || (u[g.level] = []);
      const c = v.find((a) => a && a.id === f);
      c && u[g.level].push(c);
    }), Object.entries(u).forEach(([f, g]) => {
      g && g.length > 0 && (g.sort((c, a) => {
        const _ = c && c.pos && c.pos[1] ? c.pos[1] : 0, G = a && a.pos && a.pos[1] ? a.pos[1] : 0;
        return _ - G;
      }), g.forEach((c, a) => {
        c && c.id && r[c.id] && (r[c.id].order = a);
      }));
    }), r;
  }
  function k(n) {
    var s, r, h, v, l;
    if (m.length < 2) {
      tt("Please select at least 2 nodes to align", "warning");
      return;
    }
    console.log("📍 ORIGINAL NODE POSITIONS BEFORE CLICKED ALIGNMENT:", m.map((b, u) => ({
      index: u,
      nodeId: b.id,
      currentPos: { x: b.pos[0], y: b.pos[1] }
    })));
    try {
      const b = Math.min(...m.map((a) => a.pos[0])), u = Math.max(...m.map((a) => {
        let _ = 150;
        return a.size && Array.isArray(a.size) && a.size[0] ? _ = a.size[0] : typeof a.width == "number" ? _ = a.width : a.properties && typeof a.properties.width == "number" && (_ = a.properties.width), a.pos[0] + _;
      })), f = Math.min(...m.map((a) => a.pos[1])), g = Math.max(...m.map((a) => {
        let _ = 100;
        return a.size && Array.isArray(a.size) && a.size[1] ? _ = a.size[1] : typeof a.height == "number" ? _ = a.height : a.properties && typeof a.properties.height == "number" && (_ = a.properties.height), a.pos[1] + _;
      }));
      let c;
      switch (n) {
        case "left":
          c = b;
          const a = [...m].sort((i, I) => i.pos[1] - I.pos[1]);
          let _ = a[0].pos[1];
          a.forEach((i, I) => {
            let C = 100;
            i.size && Array.isArray(i.size) && i.size[1] ? C = i.size[1] : typeof i.height == "number" ? C = i.height : i.properties && typeof i.properties.height == "number" && (C = i.properties.height), i.pos[0] = c, i.pos[1] = _, typeof i.x == "number" && (i.x = i.pos[0]), typeof i.y == "number" && (i.y = i.pos[1]), _ += C + 30;
          });
          break;
        case "right":
          c = u;
          const G = [...m].sort((i, I) => i.pos[1] - I.pos[1]);
          let U = G[0].pos[1];
          G.forEach((i, I) => {
            let C = 100, H = 150;
            i.size && Array.isArray(i.size) ? (i.size[1] && (C = i.size[1]), i.size[0] && (H = i.size[0])) : (typeof i.height == "number" && (C = i.height), typeof i.width == "number" && (H = i.width), i.properties && (typeof i.properties.height == "number" && (C = i.properties.height), typeof i.properties.width == "number" && (H = i.properties.width))), i.pos[0] = c - H, i.pos[1] = U, typeof i.x == "number" && (i.x = i.pos[0]), typeof i.y == "number" && (i.y = i.pos[1]), U += C + 30;
          });
          break;
        case "top":
          c = f;
          const Q = [...m].sort((i, I) => i.pos[0] - I.pos[0]);
          let T = Q[0].pos[0];
          Q.forEach((i, I) => {
            let C = 150;
            i.size && Array.isArray(i.size) && i.size[0] ? C = i.size[0] : typeof i.width == "number" ? C = i.width : i.properties && typeof i.properties.width == "number" && (C = i.properties.width), i.pos[1] = c, i.pos[0] = T, typeof i.x == "number" && (i.x = i.pos[0]), typeof i.y == "number" && (i.y = i.pos[1]), T += C + 30;
          });
          break;
        case "bottom":
          c = g;
          const e = [...m].sort((i, I) => i.pos[0] - I.pos[0]);
          let z = b;
          e.forEach((i, I) => {
            let C = 150, H = 100;
            i.size && Array.isArray(i.size) ? (i.size[0] && (C = i.size[0]), i.size[1] && (H = i.size[1])) : (typeof i.width == "number" && (C = i.width), typeof i.height == "number" && (H = i.height), i.properties && (typeof i.properties.width == "number" && (C = i.properties.width), typeof i.properties.height == "number" && (H = i.properties.height)));
            const o = c - H, A = z;
            i.pos[1] = o, i.pos[0] = A, typeof i.x == "number" && (i.x = i.pos[0]), typeof i.y == "number" && (i.y = i.pos[1]), z += C + 30;
          });
          break;
        case "horizontal-flow":
          nt();
          return;
        // Don't continue to the success message at the bottom
        case "vertical-flow":
          it();
          return;
      }
      try {
        (r = (s = window.app) == null ? void 0 : s.canvas) != null && r.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (v = (h = window.app) == null ? void 0 : h.graph) != null && v.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (l = window.app) != null && l.canvas && window.app.canvas.draw(!0, !0);
      } catch (a) {
        console.warn("Could not trigger canvas redraw:", a);
      }
    } catch (b) {
      console.error("Alignment error:", b), tt("Error during alignment", "error");
    }
  }
  function R(n) {
  }
  function nt() {
    var n, s, r, h, v;
    try {
      const l = m.filter((e) => {
        if (!e) return !1;
        const z = e.pos || e.position || typeof e.x == "number" && typeof e.y == "number", i = e.size || e.width || e.height || typeof e.width == "number" && typeof e.height == "number", I = !!z && !!i;
        return I;
      });
      if (l.length < 2) {
        tt(`Not enough valid nodes: ${l.length}/${m.length} nodes are valid`, "warning");
        return;
      }
      const b = Math.min(...l.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[0] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[0] : typeof e.x == "number" ? e.x : 0)), u = Math.min(...l.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[1] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[1] : typeof e.y == "number" ? e.y : 0)), f = b, g = u;
      l.forEach((e) => {
        e.pos || (e.position && Array.isArray(e.position) ? e.pos = e.position : typeof e.x == "number" && typeof e.y == "number" ? e.pos = [e.x, e.y] : e.pos = [0, 0]), e._calculatedSize || (e.size && Array.isArray(e.size) ? e._calculatedSize = [e.size[0], e.size[1]] : typeof e.width == "number" && typeof e.height == "number" ? e._calculatedSize = [e.width, e.height] : e._calculatedSize = [150, 100]), Array.isArray(e.pos) || (e.pos = [0, 0]);
      });
      const c = d(l), a = Z(l, c), _ = 40, G = 20, U = 15, Q = 5, T = {};
      l.forEach((e) => {
        var z;
        if (e && e.id) {
          const i = ((z = a[e.id]) == null ? void 0 : z.level) ?? 0;
          T[i] || (T[i] = []), T[i].push(e);
        }
      }), Object.entries(T).forEach(([e, z]) => {
        const i = parseInt(e);
        if (z && z.length > 0) {
          z.sort((o, A) => {
            const j = o && o.id && a[o.id] ? a[o.id].order : 0, P = A && A.id && a[A.id] ? a[A.id].order : 0;
            return j - P;
          });
          const I = z.reduce((o, A, j) => {
            const P = A && A._calculatedSize && A._calculatedSize[1] ? A._calculatedSize[1] : 100;
            return o + P + (j < z.length - 1 ? U : 0);
          }, 0), st = Math.max(...z.map(
            (o) => o && o._calculatedSize && o._calculatedSize[0] ? o._calculatedSize[0] : 150
          ));
          let C = f;
          if (i > 0)
            for (let o = 0; o < i; o++) {
              const A = T[o] || [], j = Math.max(...A.map(
                (P) => P && P._calculatedSize && P._calculatedSize[0] ? P._calculatedSize[0] : 150
              ));
              C += j + _ + Q;
            }
          let H = g;
          z.forEach((o, A) => {
            if (o && o.pos && o._calculatedSize) {
              const j = [o.pos[0], o.pos[1]], P = [o._calculatedSize[0], o._calculatedSize[1]];
              o.pos[0] = C, o.pos[1] = H, H += o._calculatedSize[1] + U, typeof o.x == "number" && (o.x = o.pos[0]), typeof o.y == "number" && (o.y = o.pos[1]);
            }
          });
        }
      });
      try {
        (s = (n = window.app) == null ? void 0 : n.canvas) != null && s.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (h = (r = window.app) == null ? void 0 : r.graph) != null && h.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (v = window.app) != null && v.canvas && window.app.canvas.draw(!0, !0);
      } catch (e) {
        console.warn("Could not trigger canvas redraw:", e);
      }
    } catch (l) {
      console.error("Horizontal flow alignment error:", l), tt("Error in horizontal flow alignment", "error");
    }
  }
  function it() {
    var n, s, r, h, v;
    try {
      const l = m.filter((e) => {
        if (!e) return !1;
        const z = e.pos || e.position || typeof e.x == "number" && typeof e.y == "number", i = e.size || e.width || e.height || typeof e.width == "number" && typeof e.height == "number";
        return !!z && !!i;
      });
      if (l.length < 2) {
        tt(`Not enough valid nodes: ${l.length}/${m.length} nodes are valid`, "warning");
        return;
      }
      const b = Math.min(...l.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[0] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[0] : typeof e.x == "number" ? e.x : 0)), u = Math.min(...l.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[1] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[1] : typeof e.y == "number" ? e.y : 0)), f = b, g = u;
      l.forEach((e) => {
        e.pos || (e.position && Array.isArray(e.position) ? e.pos = e.position : typeof e.x == "number" && typeof e.y == "number" ? e.pos = [e.x, e.y] : e.pos = [0, 0]), e._calculatedSize || (e.size && Array.isArray(e.size) ? e._calculatedSize = [e.size[0], e.size[1]] : typeof e.width == "number" && typeof e.height == "number" ? e._calculatedSize = [e.width, e.height] : e._calculatedSize = [150, 100]), Array.isArray(e.pos) || (e.pos = [0, 0]);
      });
      const c = d(l), a = Z(l, c), _ = 50, G = 30, U = 25, Q = 15, T = {};
      l.forEach((e) => {
        var z;
        if (e && e.id) {
          const i = ((z = a[e.id]) == null ? void 0 : z.level) ?? 0;
          T[i] || (T[i] = []), T[i].push(e);
        }
      }), Object.entries(T).forEach(([e, z]) => {
        const i = parseInt(e);
        if (z && z.length > 0) {
          z.sort((o, A) => {
            const j = o && o.id && a[o.id] ? a[o.id].order : 0, P = A && A.id && a[A.id] ? a[A.id].order : 0;
            return j - P;
          });
          const I = z.reduce((o, A, j) => {
            const P = A && A._calculatedSize && A._calculatedSize[0] ? A._calculatedSize[0] : 150;
            return o + P + G;
          }, 0), st = Math.max(...z.map(
            (o) => o && o._calculatedSize && o._calculatedSize[1] ? o._calculatedSize[1] : 100
          ));
          let C = g;
          if (i > 0)
            for (let o = 0; o < i; o++) {
              const A = T[o] || [], j = Math.max(...A.map(
                (P) => P && P._calculatedSize && P._calculatedSize[1] ? P._calculatedSize[1] : 100
              ));
              C += j + _ + Q;
            }
          let H = f;
          z.forEach((o, A) => {
            if (o && o.pos && o._calculatedSize) {
              const j = [o.pos[0], o.pos[1]], P = [o._calculatedSize[0], o._calculatedSize[1]];
              o.pos[0] = H, o.pos[1] = C, H += o._calculatedSize[0] + G, typeof o.x == "number" && (o.x = o.pos[0]), typeof o.y == "number" && (o.y = o.pos[1]);
            }
          });
        }
      });
      try {
        (s = (n = window.app) == null ? void 0 : n.canvas) != null && s.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (h = (r = window.app) == null ? void 0 : r.graph) != null && h.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (v = window.app) != null && v.canvas && window.app.canvas.draw(!0, !0);
      } catch (e) {
        console.warn("Could not trigger canvas redraw:", e);
      }
    } catch (l) {
      console.error("Vertical flow alignment error:", l), tt("Error in vertical flow alignment", "error");
    }
  }
  function tt(n, s = "info") {
    const r = document.createElement("div");
    r.textContent = n, r.style.cssText = `
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
        `, document.body.appendChild(r), setTimeout(() => {
      r.style.opacity = "1", r.style.transform = "translateX(0)";
    }, 10), setTimeout(() => {
      r.style.opacity = "0", r.style.transform = "translateX(20px)", setTimeout(() => {
        r.parentNode && r.parentNode.removeChild(r);
      }, 300);
    }, 3e3);
  }
  function rt() {
    var n;
    if (!((n = window.app) != null && n.canvas)) {
      setTimeout(rt, 100);
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
  function S(n) {
    if (n.ctrlKey || n.metaKey) {
      if (n.shiftKey)
        switch (n.key) {
          case "ArrowLeft":
            n.preventDefault(), k("left");
            break;
          case "ArrowRight":
            n.preventDefault(), k("right");
            break;
          case "ArrowUp":
            n.preventDefault(), k("top");
            break;
          case "ArrowDown":
            n.preventDefault(), k("bottom");
            break;
        }
      else if (n.altKey)
        switch (n.key) {
          case "ArrowRight":
            n.preventDefault(), k("horizontal-flow");
            break;
          case "ArrowDown":
            n.preventDefault(), k("vertical-flow");
            break;
        }
    }
  }
  D(), rt(), document.addEventListener("keydown", S);
}
