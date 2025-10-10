import { app as Ft } from "../../../scripts/app.js";
import { ComponentWidgetImpl as Xt, addWidget as It } from "../../../scripts/domWidget.js";
import { defineComponent as vt, ref as R, resolveDirective as Yt, createElementBlock as gt, openBlock as ot, Fragment as _t, createElementVNode as et, withDirectives as Vt, createVNode as mt, createBlock as Ct, unref as O, normalizeClass as At, withCtx as dt, createTextVNode as Et, toDisplayString as ht, renderList as Ht, normalizeStyle as $t, onMounted as kt, nextTick as Rt } from "vue";
import bt from "primevue/button";
import { useI18n as Nt } from "vue-i18n";
const Wt = { class: "toolbar" }, Gt = { class: "color-picker" }, jt = { class: "size-slider" }, Ut = ["value"], Kt = /* @__PURE__ */ vt({
  __name: "ToolBar",
  props: {
    colors: {},
    initialColor: {},
    initialBrushSize: {},
    initialTool: {}
  },
  emits: ["tool-change", "color-change", "canvas-clear", "brush-size-change"],
  setup(y, { emit: T }) {
    const { t: m } = Nt(), A = y, Y = T, q = A.colors || ["#000000", "#ff0000", "#0000ff", "#69a869", "#ffff00", "#ff00ff", "#00ffff"], F = R(A.initialColor || "#000000"), X = R(A.initialBrushSize || 5), D = R(A.initialTool || "pen");
    function E(B) {
      D.value = B, Y("tool-change", B);
    }
    function P(B) {
      F.value = B, Y("color-change", B);
    }
    function W() {
      Y("canvas-clear");
    }
    function w(B) {
      const V = B.target;
      X.value = Number(V.value), Y("brush-size-change", X.value);
    }
    return (B, V) => {
      const J = Yt("tooltip");
      return ot(), gt(_t, null, [
        et("div", Wt, [
          Vt((ot(), Ct(O(bt), {
            class: At({ active: D.value === "pen" }),
            onClick: V[0] || (V[0] = (N) => E("pen"))
          }, {
            default: dt(() => [
              Et(ht(O(m)("vue-basic.pen")), 1)
            ]),
            _: 1
          }, 8, ["class"])), [
            [J, { value: O(m)("vue-basic.pen-tooltip"), showDelay: 300 }]
          ]),
          mt(O(bt), { onClick: W }, {
            default: dt(() => [
              Et(ht(O(m)("vue-basic.clear-canvas")), 1)
            ]),
            _: 1
          })
        ]),
        et("div", Gt, [
          (ot(!0), gt(_t, null, Ht(O(q), (N, H) => (ot(), Ct(O(bt), {
            key: H,
            class: At({ "color-button": !0, active: F.value === N }),
            onClick: (nt) => P(N),
            type: "button",
            title: N
          }, {
            default: dt(() => [
              et("i", {
                class: "pi pi-circle-fill",
                style: $t({ color: N })
              }, null, 4)
            ]),
            _: 2
          }, 1032, ["class", "onClick", "title"]))), 128))
        ]),
        et("div", jt, [
          et("label", null, ht(O(m)("vue-basic.brush-size")) + ": " + ht(X.value) + "px", 1),
          et("input", {
            type: "range",
            min: "1",
            max: "50",
            value: X.value,
            onChange: V[1] || (V[1] = (N) => w(N))
          }, null, 40, Ut)
        ])
      ], 64);
    };
  }
}), zt = (y, T) => {
  const m = y.__vccOpts || y;
  for (const [A, Y] of T)
    m[A] = Y;
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
  setup(y, { expose: T, emit: m }) {
    const A = y, Y = A.width || 800, q = A.height || 500, F = A.initialColor || "#000000", X = A.initialBrushSize || 5, D = m, E = R(!1), P = R(0), W = R(0), w = R(null), B = R(!1), V = R(X), J = R(F), N = R(null), H = R(null);
    kt(() => {
      H.value && (w.value = H.value.getContext("2d"), nt(), Rt(() => {
        H.value && D("mounted", H.value);
      }));
    });
    function nt() {
      w.value && (w.value.fillStyle = "#ffffff", w.value.fillRect(0, 0, Y, q), it(), h());
    }
    function it() {
      w.value && (B.value ? (w.value.globalCompositeOperation = "destination-out", w.value.strokeStyle = "rgba(0,0,0,1)") : (w.value.globalCompositeOperation = "source-over", w.value.strokeStyle = J.value), w.value.lineWidth = V.value, w.value.lineJoin = "round", w.value.lineCap = "round");
    }
    function Q(g) {
      E.value = !0;
      const { offsetX: c, offsetY: o } = n(g);
      P.value = c, W.value = o, w.value && (w.value.beginPath(), w.value.moveTo(P.value, W.value), w.value.arc(P.value, W.value, V.value / 2, 0, Math.PI * 2), w.value.fill(), D("drawing-start", {
        x: c,
        y: o,
        tool: B.value ? "eraser" : "pen"
      }));
    }
    function rt(g) {
      if (!E.value || !w.value) return;
      const { offsetX: c, offsetY: o } = n(g);
      w.value.beginPath(), w.value.moveTo(P.value, W.value), w.value.lineTo(c, o), w.value.stroke(), P.value = c, W.value = o, D("drawing", {
        x: c,
        y: o,
        tool: B.value ? "eraser" : "pen"
      });
    }
    function S() {
      E.value && (E.value = !1, h(), D("drawing-end"));
    }
    function n(g) {
      let c = 0, o = 0;
      if ("touches" in g) {
        if (g.preventDefault(), H.value) {
          const k = H.value.getBoundingClientRect();
          c = g.touches[0].clientX - k.left, o = g.touches[0].clientY - k.top;
        }
      } else
        c = g.offsetX, o = g.offsetY;
      return { offsetX: c, offsetY: o };
    }
    function s(g) {
      g.preventDefault();
      const o = {
        touches: [g.touches[0]]
      };
      Q(o);
    }
    function r(g) {
      if (g.preventDefault(), !E.value) return;
      const o = {
        touches: [g.touches[0]]
      };
      rt(o);
    }
    function f(g) {
      B.value = g === "eraser", it();
    }
    function d(g) {
      J.value = g, it();
    }
    function p(g) {
      V.value = g, it();
    }
    function b() {
      w.value && (w.value.fillStyle = "#ffffff", w.value.fillRect(0, 0, Y, q), it(), h(), D("canvas-clear"));
    }
    function h() {
      H.value && (N.value = H.value.toDataURL("image/png"), N.value && D("state-save", N.value));
    }
    async function u() {
      if (!H.value)
        throw new Error("Canvas is unable to get current data");
      return N.value ? N.value : H.value.toDataURL("image/png");
    }
    return T({
      setTool: f,
      setColor: d,
      setBrushSize: p,
      clearCanvas: b,
      getCurrentCanvasData: u
    }), (g, c) => (ot(), gt("div", Jt, [
      et("div", Qt, [
        et("canvas", {
          ref_key: "canvas",
          ref: H,
          width: O(Y),
          height: O(q),
          onMousedown: Q,
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
  setup(y, { expose: T, emit: m }) {
    const A = y, Y = A.width || 800, q = A.height || 500, F = A.initialColor || "#000000", X = A.initialBrushSize || 5, D = A.availableColors || ["#000000", "#ff0000", "#0000ff", "#00ff00", "#ffff00", "#ff00ff", "#00ffff"], E = m, P = R(null), W = R(null);
    function w(S) {
      var n;
      (n = P.value) == null || n.setTool(S), E("tool-change", S);
    }
    function B(S) {
      var n;
      (n = P.value) == null || n.setColor(S), E("color-change", S);
    }
    function V(S) {
      var n;
      (n = P.value) == null || n.setBrushSize(S), E("brush-size-change", S);
    }
    function J() {
      var S;
      (S = P.value) == null || S.clearCanvas();
    }
    function N(S) {
      E("drawing-start", S);
    }
    function H(S) {
      E("drawing", S);
    }
    function nt() {
      E("drawing-end");
    }
    function it(S) {
      W.value = S, E("state-save", S);
    }
    function Q(S) {
      E("mounted", S);
    }
    async function rt() {
      if (W.value)
        return W.value;
      if (P.value)
        try {
          return await P.value.getCurrentCanvasData();
        } catch (S) {
          throw console.error("unable to get canvas data:", S), new Error("unable to get canvas data");
        }
      throw new Error("get canvas data failed");
    }
    return T({
      getCanvasData: rt
    }), (S, n) => (ot(), gt("div", ie, [
      mt(qt, {
        colors: O(D),
        initialColor: O(F),
        initialBrushSize: O(X),
        onToolChange: w,
        onColorChange: B,
        onBrushSizeChange: V,
        onCanvasClear: J
      }, null, 8, ["colors", "initialColor", "initialBrushSize"]),
      mt(ee, {
        ref_key: "drawingBoard",
        ref: P,
        width: O(Y),
        height: O(q),
        initialColor: O(F),
        initialBrushSize: O(X),
        onDrawingStart: N,
        onDrawing: H,
        onDrawingEnd: nt,
        onStateSave: it,
        onMounted: Q
      }, null, 8, ["width", "height", "initialColor", "initialBrushSize"])
    ]));
  }
}), se = /* @__PURE__ */ zt(re, [["__scopeId", "data-v-39bbf58b"]]), ae = /* @__PURE__ */ vt({
  __name: "VueExampleComponent",
  props: {
    widget: {}
  },
  setup(y) {
    const { t: T } = Nt(), m = R(null), A = R(null);
    y.widget.node;
    function Y(F) {
      A.value = F, console.log("canvas state saved:", F.substring(0, 50) + "...");
    }
    async function q(F, X) {
      var D;
      try {
        if (!((D = window.app) != null && D.api))
          throw new Error("ComfyUI API not available");
        const E = await fetch(F).then((V) => V.blob()), P = `${X}_${Date.now()}.png`, W = new File([E], P), w = new FormData();
        return w.append("image", W), w.append("subfolder", "threed"), w.append("type", "temp"), console.log("Vue Component: Using window.app.api.fetchApi"), (await window.app.api.fetchApi("/upload/image", {
          method: "POST",
          body: w
        })).json();
      } catch (E) {
        throw console.error("Vue Component: Error uploading image:", E), E;
      }
    }
    return kt(() => {
      y.widget.serializeValue = async (F, X) => {
        try {
          console.log("Vue Component: inside vue serializeValue"), console.log("node", F), console.log("index", X);
          const D = A.value;
          return D ? {
            image: `threed/${(await q(D, "test_vue_basic")).name} [temp]`
          } : (console.warn("Vue Component: No canvas data available"), { image: null });
        } catch (D) {
          return console.error("Vue Component: Error in serializeValue:", D), { image: null };
        }
      };
    }), (F, X) => (ot(), gt("div", null, [
      et("h1", null, ht(O(T)("vue-basic.title")), 1),
      et("div", null, [
        mt(se, {
          ref_key: "drawingAppRef",
          ref: m,
          width: 300,
          height: 300,
          onStateSave: Y
        }, null, 512)
      ])
    ]));
  }
}), Dt = Ft;
Dt.registerExtension({
  name: "vue-basic",
  getCustomWidgets(y) {
    return {
      CUSTOM_VUE_COMPONENT_BASIC(T) {
        const m = {
          name: "custom_vue_component_basic",
          type: "vue-basic"
        }, A = new Xt({
          node: T,
          name: m.name,
          component: ae,
          inputSpec: m,
          options: {}
        });
        return It(T, A), { widget: A };
      }
    };
  },
  nodeCreated(y) {
    if (y.constructor.comfyClass !== "vue-basic") return;
    const [T, m] = y.size;
    y.setSize([Math.max(T, 300), Math.max(m, 520)]);
  }
});
Dt.registerExtension({
  name: "housekeeper-alignment",
  async setup() {
    try {
      oe();
    } catch {
    }
  },
  nodeCreated(y) {
    y.constructor.comfyClass === "housekeeper-alignment" && (y.setSize([200, 100]), y.title && (y.title = "🎯 Alignment Panel Active"));
  }
});
function oe() {
  let y = null, T = !1, m = [], A = [];
  function Y(n) {
    var f;
    if (m.length < 2) return;
    q();
    const s = (f = window.app) == null ? void 0 : f.canvas;
    if (!s) return;
    F(n, m).forEach((d, p) => {
      if (d && m[p]) {
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
        const h = (d.x + s.ds.offset[0]) * s.ds.scale, u = (d.y + s.ds.offset[1]) * s.ds.scale, g = s.canvas.parentElement, c = s.canvas.getBoundingClientRect(), o = g ? g.getBoundingClientRect() : null;
        o && c.top - o.top, c.top;
        const k = document.querySelector("nav");
        let G = 31;
        k && (G = k.getBoundingClientRect().height);
        const Z = G * s.ds.scale, tt = c.left + h, L = c.top + u - Z, e = d.width * s.ds.scale, z = d.height * s.ds.scale;
        b.style.left = tt + "px", b.style.top = L + "px", b.style.width = e + "px", b.style.height = z + "px", document.body.appendChild(b), A.push(b);
      }
    });
  }
  function q() {
    A.forEach((n) => {
      n.parentNode && n.parentNode.removeChild(n);
    }), A = [];
  }
  function F(n, s) {
    if (s.length < 2) return [];
    const r = [], f = Math.min(...s.map((h) => h.pos[0])), d = Math.max(...s.map((h) => {
      let u = 150;
      return h.size && Array.isArray(h.size) && h.size[0] ? u = h.size[0] : typeof h.width == "number" ? u = h.width : h.properties && typeof h.properties.width == "number" && (u = h.properties.width), h.pos[0] + u;
    })), p = Math.min(...s.map((h) => h.pos[1])), b = Math.max(...s.map((h) => {
      let u = 100;
      return h.size && Array.isArray(h.size) && h.size[1] ? u = h.size[1] : typeof h.height == "number" ? u = h.height : h.properties && typeof h.properties.height == "number" && (u = h.properties.height), h.pos[1] + u;
    }));
    switch (n) {
      case "width-max":
      case "width-min":
      case "height-max":
      case "height-min":
      case "size-max":
        s.forEach((t) => {
          let l = 100, v = 150;
          t.size && Array.isArray(t.size) ? (t.size[1] && (l = t.size[1]), t.size[0] && (v = t.size[0])) : (typeof t.height == "number" && (l = t.height), typeof t.width == "number" && (v = t.width), t.properties && (typeof t.properties.height == "number" && (l = t.properties.height), typeof t.properties.width == "number" && (v = t.properties.width)));

          let previewWidth = v, previewHeight = l;
          if (n === "width-max" || n === "size-max") {
            previewWidth = Math.max(...s.map((node) => {
              let w = 150;
              return node.size && Array.isArray(node.size) && node.size[0] ? w = node.size[0] : typeof node.width == "number" ? w = node.width : node.properties && typeof node.properties.width == "number" && (w = node.properties.width), w;
            }));
          } else if (n === "width-min") {
            previewWidth = Math.min(...s.map((node) => {
              let w = 150;
              return node.size && Array.isArray(node.size) && node.size[0] ? w = node.size[0] : typeof node.width == "number" ? w = node.width : node.properties && typeof node.properties.width == "number" && (w = node.properties.width), w;
            }));
          }

          if (n === "height-max" || n === "size-max") {
            previewHeight = Math.max(...s.map((node) => {
              let h = 100;
              return node.size && Array.isArray(node.size) && node.size[1] ? h = node.size[1] : typeof node.height == "number" ? h = node.height : node.properties && typeof node.properties.height == "number" && (h = node.properties.height), h;
            }));
          } else if (n === "height-min") {
            previewHeight = Math.min(...s.map((node) => {
              let h = 100;
              return node.size && Array.isArray(node.size) && node.size[1] ? h = node.size[1] : typeof node.height == "number" ? h = node.height : node.properties && typeof node.properties.height == "number" && (h = node.properties.height), h;
            }));
          }

          r.push({
            x: t.pos[0],
            y: t.pos[1],
            width: previewWidth,
            height: previewHeight
          });
        });
        break;
      case "left":
        const h = [...s].sort((t, l) => t.pos[1] - l.pos[1]);
        let u = h[0].pos[1];
        const g = /* @__PURE__ */ new Map();
        h.forEach((t) => {
          let l = 100, v = 150;
          t.size && Array.isArray(t.size) ? (t.size[1] && (l = t.size[1]), t.size[0] && (v = t.size[0])) : (typeof t.height == "number" && (l = t.height), typeof t.width == "number" && (v = t.width), t.properties && (typeof t.properties.height == "number" && (l = t.properties.height), typeof t.properties.width == "number" && (v = t.properties.width))), g.set(t.id, {
            x: f,
            y: u,
            width: v,
            height: l
          }), u += l + 30;
        }), s.forEach((t) => {
          r.push(g.get(t.id));
        });
        break;
      case "right":
        const c = [...s].sort((t, l) => t.pos[1] - l.pos[1]);
        let o = c[0].pos[1];
        const k = /* @__PURE__ */ new Map();
        c.forEach((t) => {
          let l = 100, v = 150;
          t.size && Array.isArray(t.size) ? (t.size[1] && (l = t.size[1]), t.size[0] && (v = t.size[0])) : (typeof t.height == "number" && (l = t.height), typeof t.width == "number" && (v = t.width), t.properties && (typeof t.properties.height == "number" && (l = t.properties.height), typeof t.properties.width == "number" && (v = t.properties.width))), k.set(t.id, {
            x: d - v,
            y: o,
            width: v,
            height: l
          }), o += l + 30;
        }), s.forEach((t) => {
          r.push(k.get(t.id));
        });
        break;
      case "top":
        const G = [...s].sort((t, l) => t.pos[0] - l.pos[0]);
        let Z = G[0].pos[0];
        const tt = /* @__PURE__ */ new Map();
        G.forEach((t) => {
          let l = 100, v = 150;
          t.size && Array.isArray(t.size) ? (t.size[1] && (l = t.size[1]), t.size[0] && (v = t.size[0])) : (typeof t.height == "number" && (l = t.height), typeof t.width == "number" && (v = t.width), t.properties && (typeof t.properties.height == "number" && (l = t.properties.height), typeof t.properties.width == "number" && (v = t.properties.width))), tt.set(t.id, {
            x: Z,
            y: p,
            width: v,
            height: l
          }), Z += v + 30;
        }), s.forEach((t) => {
          r.push(tt.get(t.id));
        });
        break;
      case "bottom":
        const L = [...s].sort((t, l) => t.pos[0] - l.pos[0]);
        let e = f;
        const z = /* @__PURE__ */ new Map();
        L.forEach((t) => {
          let l = 100, v = 150;
          t.size && Array.isArray(t.size) ? (t.size[1] && (l = t.size[1]), t.size[0] && (v = t.size[0])) : (typeof t.height == "number" && (l = t.height), typeof t.width == "number" && (v = t.width), t.properties && (typeof t.properties.height == "number" && (l = t.properties.height), typeof t.properties.width == "number" && (v = t.properties.width))), z.set(t.id, {
            x: e,
            y: b - l,
            width: v,
            height: l
          }), e += v + 30;
        }), s.forEach((t) => {
          r.push(z.get(t.id));
        });
        break;
      case "horizontal-flow":
        const i = s.filter((t) => {
          if (!t) return !1;
          const l = t.pos || t.position || typeof t.x == "number" && typeof t.y == "number", v = t.size || t.width || t.height || typeof t.width == "number" && typeof t.height == "number";
          return !!l && !!v;
        });
        if (i.length < 2) break;
        const $ = Math.min(...i.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[0] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[0] : typeof t.x == "number" ? t.x : 0)), st = Math.min(...i.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[1] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[1] : typeof t.y == "number" ? t.y : 0)), _ = i.map((t) => ({
          ...t,
          pos: t.pos ? [...t.pos] : [t.x || 0, t.y || 0],
          _calculatedSize: t.size && Array.isArray(t.size) ? [t.size[0], t.size[1]] : [t.width || 150, t.height || 100]
        })), I = w(_), a = J(_, I), C = 30, j = 30, M = 5, lt = {};
        _.forEach((t) => {
          var l;
          if (t && t.id) {
            const v = ((l = a[t.id]) == null ? void 0 : l.level) ?? 0;
            lt[v] || (lt[v] = []), lt[v].push(t);
          }
        });
        const xt = /* @__PURE__ */ new Map();
        Object.entries(lt).forEach(([t, l]) => {
          const v = parseInt(t);
          if (l && l.length > 0) {
            l.sort((x, U) => {
              const at = x && x.id && a[x.id] ? a[x.id].order : 0, K = U && U.id && a[U.id] ? a[U.id].order : 0;
              return at - K;
            });
            let ut = $;
            if (v > 0)
              for (let x = 0; x < v; x++) {
                const U = lt[x] || [], at = Math.max(...U.map(
                  (K) => K && K._calculatedSize && K._calculatedSize[0] ? K._calculatedSize[0] : 150
                ));
                ut += at + C + M;
              }
            let ft = st;
            l.forEach((x) => {
              x && x._calculatedSize && (xt.set(x.id, {
                x: ut,
                y: ft,
                width: x._calculatedSize[0],
                height: x._calculatedSize[1]
              }), ft += x._calculatedSize[1] + j);
            });
          }
        }), s.forEach((t) => {
          const l = xt.get(t.id);
          l && r.push(l);
        });
        break;
      case "vertical-flow":
        const yt = s.filter((t) => {
          if (!t) return !1;
          const l = t.pos || t.position || typeof t.x == "number" && typeof t.y == "number", v = t.size || t.width || t.height || typeof t.width == "number" && typeof t.height == "number";
          return !!l && !!v;
        });
        if (yt.length < 2) break;
        const Mt = Math.min(...yt.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[0] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[0] : typeof t.x == "number" ? t.x : 0)), Tt = Math.min(...yt.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[1] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[1] : typeof t.y == "number" ? t.y : 0)), wt = yt.map((t) => ({
          ...t,
          pos: t.pos ? [...t.pos] : [t.x || 0, t.y || 0],
          _calculatedSize: t.size && Array.isArray(t.size) ? [t.size[0], t.size[1]] : [t.width || 150, t.height || 100]
        })), Pt = w(wt), ct = J(wt, Pt), Bt = 30, Lt = 30, Ot = 5, pt = {};
        wt.forEach((t) => {
          var l;
          if (t && t.id) {
            const v = ((l = ct[t.id]) == null ? void 0 : l.level) ?? 0;
            pt[v] || (pt[v] = []), pt[v].push(t);
          }
        });
        const St = /* @__PURE__ */ new Map();
        Object.entries(pt).forEach(([t, l]) => {
          const v = parseInt(t);
          if (l && l.length > 0) {
            l.sort((x, U) => {
              const at = x && x.id && ct[x.id] ? ct[x.id].order : 0, K = U && U.id && ct[U.id] ? ct[U.id].order : 0;
              return at - K;
            });
            let ut = Tt;
            if (v > 0)
              for (let x = 0; x < v; x++) {
                const U = pt[x] || [], at = Math.max(...U.map(
                  (K) => K && K._calculatedSize && K._calculatedSize[1] ? K._calculatedSize[1] : 100
                ));
                ut += at + Bt + Ot;
              }
            let ft = Mt;
            l.forEach((x) => {
              x && x._calculatedSize && (St.set(x.id, {
                x: ft,
                y: ut,
                width: x._calculatedSize[0],
                height: x._calculatedSize[1]
              }), ft += x._calculatedSize[0] + Lt);
            });
          }
        }), s.forEach((t) => {
          const l = St.get(t.id);
          l && r.push(l);
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
    const f = s ? "#4a5568" : "#505050", d = s ? "#5a6578" : "#606060";
    return r.style.cssText = `
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
        `, r.addEventListener("mouseenter", () => {
      r.style.background = `linear-gradient(145deg, ${d}, #505050)`, r.style.transform = "translateY(-1px)", r.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)", Y(n.type);
    }), r.addEventListener("mouseleave", () => {
      r.style.background = `linear-gradient(145deg, ${f}, #404040)`, r.style.transform = "translateY(0)", r.style.boxShadow = "none", q();
    }), r.addEventListener("click", () => N(n.type)), r;
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
      { type: "size-max", icon: "⇱", label: "Size-Max" }
    ], d = f.slice(0, 4), p = f.slice(4, 6), size = f.slice(6);
    d.forEach((h) => {
      const u = X(h);
      s.appendChild(u);
    }), p.forEach((h) => {
      const u = X(h, !0);
      r.appendChild(u);
    });
    const sizeSection = document.createElement("div");
    sizeSection.style.cssText = `
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-bottom: 12px;
            border-top: 1px solid #555;
            padding-top: 8px;
        `;
    size.forEach((h) => {
      const u = X(h, !1);
      sizeSection.appendChild(u);
    });
    y.appendChild(s), y.appendChild(r), y.appendChild(sizeSection);
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
  function E() {
    var d;
    if (!((d = window.app) != null && d.graph)) return;
    m = Object.values(window.app.graph._nodes || {}).filter((p) => p && p.is_selected);
    const s = m.length > 1;
    s && !T ? P() : !s && T && W();
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
    const f = y == null ? void 0 : y.querySelectorAll("button");
    f == null || f.forEach((p) => {
      s ? (p.style.opacity = "1", p.style.pointerEvents = "auto") : (p.style.opacity = "0.5", p.style.pointerEvents = "none");
    });
  }
  function P() {
    y && (T = !0, y.style.display = "block", setTimeout(() => {
      y && (y.style.opacity = "1", y.style.transform = "translateX(0)");
    }, 10));
  }
  function W() {
    y && (T = !1, y.style.opacity = "0", y.style.transform = "translateX(20px)", setTimeout(() => {
      y && (y.style.display = "none");
    }, 300));
  }
  function w(n) {
    const s = {}, r = n.filter((f) => f && (f.id !== void 0 || f.id !== null));
    return r.forEach((f) => {
      const d = f.id || `node_${r.indexOf(f)}`;
      f.id = d, s[d] = { inputs: [], outputs: [] }, f.inputs && Array.isArray(f.inputs) && f.inputs.forEach((p, b) => {
        p && p.link !== null && p.link !== void 0 && s[d].inputs.push({
          index: b,
          link: p.link,
          sourceNode: B(p.link, r)
        });
      }), f.outputs && Array.isArray(f.outputs) && f.outputs.forEach((p, b) => {
        p && p.links && Array.isArray(p.links) && p.links.length > 0 && p.links.forEach((h) => {
          const u = V(h, r);
          u && s[d].outputs.push({
            index: b,
            link: h,
            targetNode: u
          });
        });
      });
    }), s;
  }
  function B(n, s) {
    for (const r of s)
      if (r && r.outputs && Array.isArray(r.outputs)) {
        for (const f of r.outputs)
          if (f && f.links && Array.isArray(f.links) && f.links.includes(n))
            return r;
      }
    return null;
  }
  function V(n, s) {
    for (const r of s)
      if (r && r.inputs && Array.isArray(r.inputs)) {
        for (const f of r.inputs)
          if (f && f.link === n)
            return r;
      }
    return null;
  }
  function J(n, s) {
    const r = {}, f = /* @__PURE__ */ new Set(), d = n.filter((u) => u && u.id), p = d.filter((u) => {
      const g = u.id;
      return !s[g] || !s[g].inputs.length || s[g].inputs.every((c) => !c.sourceNode);
    });
    p.length === 0 && d.length > 0 && p.push(d[0]);
    const b = p.map((u) => ({ node: u, level: 0 }));
    for (; b.length > 0; ) {
      const { node: u, level: g } = b.shift();
      !u || !u.id || f.has(u.id) || (f.add(u.id), r[u.id] = { level: g, order: 0 }, s[u.id] && s[u.id].outputs && s[u.id].outputs.forEach((c) => {
        c && c.targetNode && c.targetNode.id && !f.has(c.targetNode.id) && b.push({ node: c.targetNode, level: g + 1 });
      }));
    }
    d.forEach((u) => {
      u && u.id && !r[u.id] && (r[u.id] = { level: 0, order: 0 });
    });
    const h = {};
    return Object.entries(r).forEach(([u, g]) => {
      h[g.level] || (h[g.level] = []);
      const c = d.find((o) => o && o.id === u);
      c && h[g.level].push(c);
    }), Object.entries(h).forEach(([u, g]) => {
      g && g.length > 0 && (g.sort((c, o) => {
        const k = c && c.pos && c.pos[1] ? c.pos[1] : 0, G = o && o.pos && o.pos[1] ? o.pos[1] : 0;
        return k - G;
      }), g.forEach((c, o) => {
        c && c.id && r[c.id] && (r[c.id].order = o);
      }));
    }), r;
  }
  function N(n) {
    var s, r, f, d, p;
    if (m.length < 2) {
      Q("Please select at least 2 nodes to align", "warning");
      return;
    }
    try {
      const b = Math.min(...m.map((o) => o.pos[0])), h = Math.max(...m.map((o) => {
        let k = 150;
        return o.size && Array.isArray(o.size) && o.size[0] ? k = o.size[0] : typeof o.width == "number" ? k = o.width : o.properties && typeof o.properties.width == "number" && (k = o.properties.width), o.pos[0] + k;
      })), u = Math.min(...m.map((o) => o.pos[1])), g = Math.max(...m.map((o) => {
        let k = 100;
        return o.size && Array.isArray(o.size) && o.size[1] ? k = o.size[1] : typeof o.height == "number" ? k = o.height : o.properties && typeof o.properties.height == "number" && (k = o.properties.height), o.pos[1] + k;
      }));
      let c;
      switch (n) {
        case "width-max":
          const maxWidth = Math.max(...m.map((o) => {
            let k = 150;
            return o.size && Array.isArray(o.size) && o.size[0] ? k = o.size[0] : typeof o.width == "number" ? k = o.width : o.properties && typeof o.properties.width == "number" && (k = o.properties.width), k;
          }));
          console.log("Width-max - target width:", maxWidth);
          m.forEach((o) => {
            if (o.size) {
              const oldSize = [o.size[0], o.size[1]];
              o.size[0] = maxWidth;
              console.log("Node:", o.title, "Before:", oldSize, "After setting width:", [o.size[0], o.size[1]]);
            }
          });
          break;
        case "width-min":
          const minWidth = Math.min(...m.map((o) => {
            let k = 150;
            return o.size && Array.isArray(o.size) && o.size[0] ? k = o.size[0] : typeof o.width == "number" ? k = o.width : o.properties && typeof o.properties.width == "number" && (k = o.properties.width), k;
          }));
          m.forEach((o) => {
            if (o.size) {
              o.size[0] = minWidth;
            }
          });
          break;
        case "height-max":
          const maxHeight = Math.max(...m.map((o) => {
            let k = 100;
            return o.size && Array.isArray(o.size) && o.size[1] ? k = o.size[1] : typeof o.height == "number" ? k = o.height : o.properties && typeof o.properties.height == "number" && (k = o.properties.height), k;
          }));
          m.forEach((o) => {
            if (o.size && typeof o.setSize === "function") {
              const currentHeight = o.size[1];
              const currentWidth = o.size[0];
              // First, try to set the size and see what ComfyUI adjusts it to
              o.setSize([currentWidth, maxHeight]);
              const adjustedHeight = o.size[1];
              const adjustment = adjustedHeight - maxHeight;
              // If ComfyUI added extra height, compensate by subtracting it
              if (adjustment > 0) {
                o.setSize([currentWidth, maxHeight - adjustment]);
              }
            } else if (o.size) {
              o.size[1] = maxHeight;
            }
          });
          break;
        case "height-min":
          const minHeight = Math.min(...m.map((o) => {
            let k = 100;
            return o.size && Array.isArray(o.size) && o.size[1] ? k = o.size[1] : typeof o.height == "number" ? k = o.height : o.properties && typeof o.properties.height == "number" && (k = o.properties.height), k;
          }));
          m.forEach((o) => {
            if (o.size && typeof o.setSize === "function") {
              const currentHeight = o.size[1];
              const currentWidth = o.size[0];
              // First, try to set the size and see what ComfyUI adjusts it to
              o.setSize([currentWidth, minHeight]);
              const adjustedHeight = o.size[1];
              const adjustment = adjustedHeight - minHeight;
              // If ComfyUI added extra height, compensate by subtracting it
              if (adjustment > 0) {
                o.setSize([currentWidth, minHeight - adjustment]);
              }
            } else if (o.size) {
              o.size[1] = minHeight;
            }
          });
          break;
        case "size-max":
          const maxW = Math.max(...m.map((o) => {
            let k = 150;
            return o.size && Array.isArray(o.size) && o.size[0] ? k = o.size[0] : typeof o.width == "number" ? k = o.width : o.properties && typeof o.properties.width == "number" && (k = o.properties.width), k;
          }));
          const maxH = Math.max(...m.map((o) => {
            let k = 100;
            return o.size && Array.isArray(o.size) && o.size[1] ? k = o.size[1] : typeof o.height == "number" ? k = o.height : o.properties && typeof o.properties.height == "number" && (k = o.properties.height), k;
          }));
          m.forEach((o) => {
            if (o.size && typeof o.setSize === "function") {
              // Try setting the size first to see the adjustment
              o.setSize([maxW, maxH]);
              const adjustedHeight = o.size[1];
              const adjustment = adjustedHeight - maxH;
              // Compensate for height adjustment
              if (adjustment > 0) {
                o.setSize([maxW, maxH - adjustment]);
              }
            } else if (o.size) {
              o.size[0] = maxW;
              o.size[1] = maxH;
            }
          });
          break;
        case "left":
          c = b;
          const o = [...m].sort((i, $) => i.pos[1] - $.pos[1]);
          let k = o[0].pos[1];
          o.forEach((i, $) => {
            let _ = 100;
            i.size && Array.isArray(i.size) && i.size[1] ? _ = i.size[1] : typeof i.height == "number" ? _ = i.height : i.properties && typeof i.properties.height == "number" && (_ = i.properties.height), i.pos[0] = c, i.pos[1] = k, typeof i.x == "number" && (i.x = i.pos[0]), typeof i.y == "number" && (i.y = i.pos[1]), k += _ + 30;
          });
          break;
        case "right":
          c = h;
          const G = [...m].sort((i, $) => i.pos[1] - $.pos[1]);
          let Z = G[0].pos[1];
          G.forEach((i, $) => {
            let _ = 100, I = 150;
            i.size && Array.isArray(i.size) ? (i.size[1] && (_ = i.size[1]), i.size[0] && (I = i.size[0])) : (typeof i.height == "number" && (_ = i.height), typeof i.width == "number" && (I = i.width), i.properties && (typeof i.properties.height == "number" && (_ = i.properties.height), typeof i.properties.width == "number" && (I = i.properties.width))), i.pos[0] = c - I, i.pos[1] = Z, typeof i.x == "number" && (i.x = i.pos[0]), typeof i.y == "number" && (i.y = i.pos[1]), Z += _ + 30;
          });
          break;
        case "top":
          c = u;
          const tt = [...m].sort((i, $) => i.pos[0] - $.pos[0]);
          let L = tt[0].pos[0];
          tt.forEach((i, $) => {
            let _ = 150;
            i.size && Array.isArray(i.size) && i.size[0] ? _ = i.size[0] : typeof i.width == "number" ? _ = i.width : i.properties && typeof i.properties.width == "number" && (_ = i.properties.width), i.pos[1] = c, i.pos[0] = L, typeof i.x == "number" && (i.x = i.pos[0]), typeof i.y == "number" && (i.y = i.pos[1]), L += _ + 30;
          });
          break;
        case "bottom":
          c = g;
          const e = [...m].sort((i, $) => i.pos[0] - $.pos[0]);
          let z = b;
          e.forEach((i, $) => {
            let _ = 150, I = 100;
            i.size && Array.isArray(i.size) ? (i.size[0] && (_ = i.size[0]), i.size[1] && (I = i.size[1])) : (typeof i.width == "number" && (_ = i.width), typeof i.height == "number" && (I = i.height), i.properties && (typeof i.properties.width == "number" && (_ = i.properties.width), typeof i.properties.height == "number" && (I = i.properties.height)));
            const a = c - I, C = z;
            i.pos[1] = a, i.pos[0] = C, typeof i.x == "number" && (i.x = i.pos[0]), typeof i.y == "number" && (i.y = i.pos[1]), z += _ + 30;
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
        if ((s = window.app) != null && s.canvas) {
          if (typeof window.app.canvas.setDirtyCanvas === "function") {
            window.app.canvas.setDirtyCanvas(true, true);
          }
          if (typeof window.app.canvas.draw === "function") {
            window.app.canvas.draw(true, true);
          }
        }
        if ((f = window.app) != null && f.graph && typeof window.app.graph.setDirtyCanvas === "function") {
          window.app.graph.setDirtyCanvas(true, true);
        }
        console.log("After canvas redraw, checking node sizes:");
        m.forEach((o) => {
          console.log("Node:", o.title, "Final size:", [o.size[0], o.size[1]]);
        });
      } catch (canvasErr) {
        console.error("Canvas update error:", canvasErr);
      }
    } catch (err) {
      console.error("Alignment error:", err);
      console.error("Error stack:", err.stack);
      Q("Error during alignment", "error");
    }
  }
  function H(n) {
  }
  function nt() {
    var n, s, r, f, d;
    try {
      const p = m.filter((e) => {
        if (!e) return !1;
        const z = e.pos || e.position || typeof e.x == "number" && typeof e.y == "number", i = e.size || e.width || e.height || typeof e.width == "number" && typeof e.height == "number";
        return !!z && !!i;
      });
      if (p.length < 2) {
        Q(`Not enough valid nodes: ${p.length}/${m.length} nodes are valid`, "warning");
        return;
      }
      const b = Math.min(...p.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[0] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[0] : typeof e.x == "number" ? e.x : 0)), h = Math.min(...p.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[1] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[1] : typeof e.y == "number" ? e.y : 0)), u = b, g = h;
      p.forEach((e) => {
        e.pos || (e.position && Array.isArray(e.position) ? e.pos = e.position : typeof e.x == "number" && typeof e.y == "number" ? e.pos = [e.x, e.y] : e.pos = [0, 0]), e._calculatedSize || (e.size && Array.isArray(e.size) ? e._calculatedSize = [e.size[0], e.size[1]] : typeof e.width == "number" && typeof e.height == "number" ? e._calculatedSize = [e.width, e.height] : e._calculatedSize = [150, 100]), Array.isArray(e.pos) || (e.pos = [0, 0]);
      });
      const c = w(p), o = J(p, c), k = 30, G = 30, Z = 30, tt = 5, L = {};
      p.forEach((e) => {
        var z;
        if (e && e.id) {
          const i = ((z = o[e.id]) == null ? void 0 : z.level) ?? 0;
          L[i] || (L[i] = []), L[i].push(e);
        }
      }), Object.entries(L).forEach(([e, z]) => {
        const i = parseInt(e);
        if (z && z.length > 0) {
          z.sort((a, C) => {
            const j = a && a.id && o[a.id] ? o[a.id].order : 0, M = C && C.id && o[C.id] ? o[C.id].order : 0;
            return j - M;
          });
          const $ = z.reduce((a, C, j) => {
            const M = C && C._calculatedSize && C._calculatedSize[1] ? C._calculatedSize[1] : 100;
            return a + M + (j < z.length - 1 ? Z : 0);
          }, 0), st = Math.max(...z.map(
            (a) => a && a._calculatedSize && a._calculatedSize[0] ? a._calculatedSize[0] : 150
          ));
          let _ = u;
          if (i > 0)
            for (let a = 0; a < i; a++) {
              const C = L[a] || [], j = Math.max(...C.map(
                (M) => M && M._calculatedSize && M._calculatedSize[0] ? M._calculatedSize[0] : 150
              ));
              _ += j + k + tt;
            }
          let I = g;
          z.forEach((a, C) => {
            if (a && a.pos && a._calculatedSize) {
              const j = [a.pos[0], a.pos[1]], M = [a._calculatedSize[0], a._calculatedSize[1]];
              a.pos[0] = _, a.pos[1] = I, I += a._calculatedSize[1] + Z, typeof a.x == "number" && (a.x = a.pos[0]), typeof a.y == "number" && (a.y = a.pos[1]);
            }
          });
        }
      });
      try {
        (s = (n = window.app) == null ? void 0 : n.canvas) != null && s.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (f = (r = window.app) == null ? void 0 : r.graph) != null && f.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (d = window.app) != null && d.canvas && window.app.canvas.draw(!0, !0);
      } catch {
      }
    } catch {
      Q("Error in horizontal flow alignment", "error");
    }
  }
  function it() {
    var n, s, r, f, d;
    try {
      const p = m.filter((e) => {
        if (!e) return !1;
        const z = e.pos || e.position || typeof e.x == "number" && typeof e.y == "number", i = e.size || e.width || e.height || typeof e.width == "number" && typeof e.height == "number";
        return !!z && !!i;
      });
      if (p.length < 2) {
        Q(`Not enough valid nodes: ${p.length}/${m.length} nodes are valid`, "warning");
        return;
      }
      const b = Math.min(...p.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[0] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[0] : typeof e.x == "number" ? e.x : 0)), h = Math.min(...p.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[1] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[1] : typeof e.y == "number" ? e.y : 0)), u = b, g = h;
      p.forEach((e) => {
        e.pos || (e.position && Array.isArray(e.position) ? e.pos = e.position : typeof e.x == "number" && typeof e.y == "number" ? e.pos = [e.x, e.y] : e.pos = [0, 0]), e._calculatedSize || (e.size && Array.isArray(e.size) ? e._calculatedSize = [e.size[0], e.size[1]] : typeof e.width == "number" && typeof e.height == "number" ? e._calculatedSize = [e.width, e.height] : e._calculatedSize = [150, 100]), Array.isArray(e.pos) || (e.pos = [0, 0]);
      });
      const c = w(p), o = J(p, c), k = 30, G = 30, Z = 30, tt = 5, L = {};
      p.forEach((e) => {
        var z;
        if (e && e.id) {
          const i = ((z = o[e.id]) == null ? void 0 : z.level) ?? 0;
          L[i] || (L[i] = []), L[i].push(e);
        }
      }), Object.entries(L).forEach(([e, z]) => {
        const i = parseInt(e);
        if (z && z.length > 0) {
          z.sort((a, C) => {
            const j = a && a.id && o[a.id] ? o[a.id].order : 0, M = C && C.id && o[C.id] ? o[C.id].order : 0;
            return j - M;
          });
          const $ = z.reduce((a, C, j) => {
            const M = C && C._calculatedSize && C._calculatedSize[0] ? C._calculatedSize[0] : 150;
            return a + M + G;
          }, 0), st = Math.max(...z.map(
            (a) => a && a._calculatedSize && a._calculatedSize[1] ? a._calculatedSize[1] : 100
          ));
          let _ = g;
          if (i > 0)
            for (let a = 0; a < i; a++) {
              const C = L[a] || [], j = Math.max(...C.map(
                (M) => M && M._calculatedSize && M._calculatedSize[1] ? M._calculatedSize[1] : 100
              ));
              _ += j + k + tt;
            }
          let I = u;
          z.forEach((a, C) => {
            if (a && a.pos && a._calculatedSize) {
              const j = [a.pos[0], a.pos[1]], M = [a._calculatedSize[0], a._calculatedSize[1]];
              a.pos[0] = I, a.pos[1] = _, I += a._calculatedSize[0] + G, typeof a.x == "number" && (a.x = a.pos[0]), typeof a.y == "number" && (a.y = a.pos[1]);
            }
          });
        }
      });
      try {
        (s = (n = window.app) == null ? void 0 : n.canvas) != null && s.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (f = (r = window.app) == null ? void 0 : r.graph) != null && f.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (d = window.app) != null && d.canvas && window.app.canvas.draw(!0, !0);
      } catch {
      }
    } catch {
      Q("Error in vertical flow alignment", "error");
    }
  }
  function Q(n, s = "info") {
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
      setTimeout(E, 10);
    }), window.app.canvas.canvas.addEventListener("mouseup", () => {
      setTimeout(E, 10);
    }), document.addEventListener("keydown", (s) => {
      (s.ctrlKey || s.metaKey) && setTimeout(E, 10);
    })), setInterval(E, 500);
  }
  function S(n) {
    if (n.ctrlKey || n.metaKey) {
      if (n.shiftKey)
        switch (n.key) {
          case "ArrowLeft":
            n.preventDefault(), N("left");
            break;
          case "ArrowRight":
            n.preventDefault(), N("right");
            break;
          case "ArrowUp":
            n.preventDefault(), N("top");
            break;
          case "ArrowDown":
            n.preventDefault(), N("bottom");
            break;
        }
      else if (n.altKey)
        switch (n.key) {
          case "ArrowRight":
            n.preventDefault(), N("horizontal-flow");
            break;
          case "ArrowDown":
            n.preventDefault(), N("vertical-flow");
            break;
        }
    }
  }
  D(), rt(), document.addEventListener("keydown", S);
}
