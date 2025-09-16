import { app as pt } from "../../../scripts/app.js";
import { ComponentWidgetImpl as ft, addWidget as ht } from "../../../scripts/domWidget.js";
import { defineComponent as tt, ref as H, resolveDirective as gt, createElementBlock as Q, openBlock as j, Fragment as at, createElementVNode as G, withDirectives as vt, createVNode as Z, createBlock as st, unref as M, normalizeClass as ot, withCtx as et, createTextVNode as nt, toDisplayString as J, renderList as dt, normalizeStyle as mt, onMounted as lt, nextTick as yt } from "vue";
import it from "primevue/button";
import { useI18n as ct } from "vue-i18n";
const wt = { class: "toolbar" }, bt = { class: "color-picker" }, xt = { class: "size-slider" }, zt = ["value"], Ct = /* @__PURE__ */ tt({
  __name: "ToolBar",
  props: {
    colors: {},
    initialColor: {},
    initialBrushSize: {},
    initialTool: {}
  },
  emits: ["tool-change", "color-change", "canvas-clear", "brush-size-change"],
  setup(c, { emit: k }) {
    const { t: p } = ct(), y = c, I = k, W = y.colors || ["#000000", "#ff0000", "#0000ff", "#69a869", "#ffff00", "#ff00ff", "#00ffff"], L = H(y.initialColor || "#000000"), O = H(y.initialBrushSize || 5), S = H(y.initialTool || "pen");
    function x(P) {
      S.value = P, I("tool-change", P);
    }
    function D(P) {
      L.value = P, I("color-change", P);
    }
    function X() {
      I("canvas-clear");
    }
    function u(P) {
      const V = P.target;
      O.value = Number(V.value), I("brush-size-change", O.value);
    }
    return (P, V) => {
      const U = gt("tooltip");
      return j(), Q(at, null, [
        G("div", wt, [
          vt((j(), st(M(it), {
            class: ot({ active: S.value === "pen" }),
            onClick: V[0] || (V[0] = (w) => x("pen"))
          }, {
            default: et(() => [
              nt(J(M(p)("vue-basic.pen")), 1)
            ]),
            _: 1
          }, 8, ["class"])), [
            [U, { value: M(p)("vue-basic.pen-tooltip"), showDelay: 300 }]
          ]),
          Z(M(it), { onClick: X }, {
            default: et(() => [
              nt(J(M(p)("vue-basic.clear-canvas")), 1)
            ]),
            _: 1
          })
        ]),
        G("div", bt, [
          (j(!0), Q(at, null, dt(M(W), (w, B) => (j(), st(M(it), {
            key: B,
            class: ot({ "color-button": !0, active: L.value === w }),
            onClick: (K) => D(w),
            type: "button",
            title: w
          }, {
            default: et(() => [
              G("i", {
                class: "pi pi-circle-fill",
                style: mt({ color: w })
              }, null, 4)
            ]),
            _: 2
          }, 1032, ["class", "onClick", "title"]))), 128))
        ]),
        G("div", xt, [
          G("label", null, J(M(p)("vue-basic.brush-size")) + ": " + J(O.value) + "px", 1),
          G("input", {
            type: "range",
            min: "1",
            max: "50",
            value: O.value,
            onChange: V[1] || (V[1] = (w) => u(w))
          }, null, 40, zt)
        ])
      ], 64);
    };
  }
}), rt = (c, k) => {
  const p = c.__vccOpts || c;
  for (const [y, I] of k)
    p[y] = I;
  return p;
}, St = /* @__PURE__ */ rt(Ct, [["__scopeId", "data-v-cae98791"]]), _t = { class: "drawing-board" }, At = { class: "canvas-container" }, Et = ["width", "height"], kt = /* @__PURE__ */ tt({
  __name: "DrawingBoard",
  props: {
    width: {},
    height: {},
    initialColor: {},
    initialBrushSize: {}
  },
  emits: ["mounted", "drawing-start", "drawing", "drawing-end", "state-save", "canvas-clear"],
  setup(c, { expose: k, emit: p }) {
    const y = c, I = y.width || 800, W = y.height || 500, L = y.initialColor || "#000000", O = y.initialBrushSize || 5, S = p, x = H(!1), D = H(0), X = H(0), u = H(null), P = H(!1), V = H(O), U = H(L), w = H(null), B = H(null);
    lt(() => {
      B.value && (u.value = B.value.getContext("2d"), K(), yt(() => {
        B.value && S("mounted", B.value);
      }));
    });
    function K() {
      u.value && (u.value.fillStyle = "#ffffff", u.value.fillRect(0, 0, I, W), n(), s());
    }
    function n() {
      u.value && (P.value ? (u.value.globalCompositeOperation = "destination-out", u.value.strokeStyle = "rgba(0,0,0,1)") : (u.value.globalCompositeOperation = "source-over", u.value.strokeStyle = U.value), u.value.lineWidth = V.value, u.value.lineJoin = "round", u.value.lineCap = "round");
    }
    function l(v) {
      x.value = !0;
      const { offsetX: E, offsetY: _ } = f(v);
      D.value = E, X.value = _, u.value && (u.value.beginPath(), u.value.moveTo(D.value, X.value), u.value.arc(D.value, X.value, V.value / 2, 0, Math.PI * 2), u.value.fill(), S("drawing-start", {
        x: E,
        y: _,
        tool: P.value ? "eraser" : "pen"
      }));
    }
    function r(v) {
      if (!x.value || !u.value) return;
      const { offsetX: E, offsetY: _ } = f(v);
      u.value.beginPath(), u.value.moveTo(D.value, X.value), u.value.lineTo(E, _), u.value.stroke(), D.value = E, X.value = _, S("drawing", {
        x: E,
        y: _,
        tool: P.value ? "eraser" : "pen"
      });
    }
    function i() {
      x.value && (x.value = !1, s(), S("drawing-end"));
    }
    function f(v) {
      let E = 0, _ = 0;
      if ("touches" in v) {
        if (v.preventDefault(), B.value) {
          const $ = B.value.getBoundingClientRect();
          E = v.touches[0].clientX - $.left, _ = v.touches[0].clientY - $.top;
        }
      } else
        E = v.offsetX, _ = v.offsetY;
      return { offsetX: E, offsetY: _ };
    }
    function o(v) {
      v.preventDefault();
      const _ = {
        touches: [v.touches[0]]
      };
      l(_);
    }
    function z(v) {
      if (v.preventDefault(), !x.value) return;
      const _ = {
        touches: [v.touches[0]]
      };
      r(_);
    }
    function T(v) {
      P.value = v === "eraser", n();
    }
    function h(v) {
      U.value = v, n();
    }
    function C(v) {
      V.value = v, n();
    }
    function g() {
      u.value && (u.value.fillStyle = "#ffffff", u.value.fillRect(0, 0, I, W), n(), s(), S("canvas-clear"));
    }
    function s() {
      B.value && (w.value = B.value.toDataURL("image/png"), w.value && S("state-save", w.value));
    }
    async function A() {
      if (!B.value)
        throw new Error("Canvas is unable to get current data");
      return w.value ? w.value : B.value.toDataURL("image/png");
    }
    return k({
      setTool: T,
      setColor: h,
      setBrushSize: C,
      clearCanvas: g,
      getCurrentCanvasData: A
    }), (v, E) => (j(), Q("div", _t, [
      G("div", At, [
        G("canvas", {
          ref_key: "canvas",
          ref: B,
          width: M(I),
          height: M(W),
          onMousedown: l,
          onMousemove: r,
          onMouseup: i,
          onMouseleave: i,
          onTouchstart: o,
          onTouchmove: z,
          onTouchend: i
        }, null, 40, Et)
      ])
    ]));
  }
}), Dt = /* @__PURE__ */ rt(kt, [["__scopeId", "data-v-ca1239fc"]]), Tt = { class: "drawing-app" }, Nt = /* @__PURE__ */ tt({
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
    const y = c, I = y.width || 800, W = y.height || 500, L = y.initialColor || "#000000", O = y.initialBrushSize || 5, S = y.availableColors || ["#000000", "#ff0000", "#0000ff", "#00ff00", "#ffff00", "#ff00ff", "#00ffff"], x = p, D = H(null), X = H(null);
    function u(i) {
      var f;
      (f = D.value) == null || f.setTool(i), x("tool-change", i);
    }
    function P(i) {
      var f;
      (f = D.value) == null || f.setColor(i), x("color-change", i);
    }
    function V(i) {
      var f;
      (f = D.value) == null || f.setBrushSize(i), x("brush-size-change", i);
    }
    function U() {
      var i;
      (i = D.value) == null || i.clearCanvas();
    }
    function w(i) {
      x("drawing-start", i);
    }
    function B(i) {
      x("drawing", i);
    }
    function K() {
      x("drawing-end");
    }
    function n(i) {
      X.value = i, x("state-save", i);
    }
    function l(i) {
      x("mounted", i);
    }
    async function r() {
      if (X.value)
        return X.value;
      if (D.value)
        try {
          return await D.value.getCurrentCanvasData();
        } catch (i) {
          throw console.error("unable to get canvas data:", i), new Error("unable to get canvas data");
        }
      throw new Error("get canvas data failed");
    }
    return k({
      getCanvasData: r
    }), (i, f) => (j(), Q("div", Tt, [
      Z(St, {
        colors: M(S),
        initialColor: M(L),
        initialBrushSize: M(O),
        onToolChange: u,
        onColorChange: P,
        onBrushSizeChange: V,
        onCanvasClear: U
      }, null, 8, ["colors", "initialColor", "initialBrushSize"]),
      Z(Dt, {
        ref_key: "drawingBoard",
        ref: D,
        width: M(I),
        height: M(W),
        initialColor: M(L),
        initialBrushSize: M(O),
        onDrawingStart: w,
        onDrawing: B,
        onDrawingEnd: K,
        onStateSave: n,
        onMounted: l
      }, null, 8, ["width", "height", "initialColor", "initialBrushSize"])
    ]));
  }
}), Bt = /* @__PURE__ */ rt(Nt, [["__scopeId", "data-v-39bbf58b"]]), Mt = /* @__PURE__ */ tt({
  __name: "VueExampleComponent",
  props: {
    widget: {}
  },
  setup(c) {
    const { t: k } = ct(), p = H(null), y = H(null);
    c.widget.node;
    function I(L) {
      y.value = L, console.log("canvas state saved:", L.substring(0, 50) + "...");
    }
    async function W(L, O) {
      var S;
      try {
        if (!((S = window.app) != null && S.api))
          throw new Error("ComfyUI API not available");
        const x = await fetch(L).then((V) => V.blob()), D = `${O}_${Date.now()}.png`, X = new File([x], D), u = new FormData();
        return u.append("image", X), u.append("subfolder", "threed"), u.append("type", "temp"), console.log("Vue Component: Using window.app.api.fetchApi"), (await window.app.api.fetchApi("/upload/image", {
          method: "POST",
          body: u
        })).json();
      } catch (x) {
        throw console.error("Vue Component: Error uploading image:", x), x;
      }
    }
    return lt(() => {
      c.widget.serializeValue = async (L, O) => {
        try {
          console.log("Vue Component: inside vue serializeValue"), console.log("node", L), console.log("index", O);
          const S = y.value;
          return S ? {
            image: `threed/${(await W(S, "test_vue_basic")).name} [temp]`
          } : (console.warn("Vue Component: No canvas data available"), { image: null });
        } catch (S) {
          return console.error("Vue Component: Error in serializeValue:", S), { image: null };
        }
      };
    }), (L, O) => (j(), Q("div", null, [
      G("h1", null, J(M(k)("vue-basic.title")), 1),
      G("div", null, [
        Z(Bt, {
          ref_key: "drawingAppRef",
          ref: p,
          width: 300,
          height: 300,
          onStateSave: I
        }, null, 512)
      ])
    ]));
  }
}), ut = pt;
ut.registerExtension({
  name: "vue-basic",
  getCustomWidgets(c) {
    return {
      CUSTOM_VUE_COMPONENT_BASIC(k) {
        const p = {
          name: "custom_vue_component_basic",
          type: "vue-basic"
        }, y = new ft({
          node: k,
          name: p.name,
          component: Mt,
          inputSpec: p,
          options: {}
        });
        return ht(k, y), { widget: y };
      }
    };
  },
  nodeCreated(c) {
    if (c.constructor.comfyClass !== "vue-basic") return;
    const [k, p] = c.size;
    c.setSize([Math.max(k, 300), Math.max(p, 520)]);
  }
});
ut.registerExtension({
  name: "housekeeper-alignment",
  async setup() {
    try {
      Lt();
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
  function y(n, l = !1) {
    const r = document.createElement("button");
    r.innerHTML = `
            <span style="font-size: 16px; display: block;">${n.icon}</span>
            <span style="font-size: 11px;">${n.label}</span>
        `;
    const i = l ? "#4a5568" : "#505050", f = l ? "#5a6578" : "#606060";
    return r.style.cssText = `
            background: linear-gradient(145deg, ${i}, #404040);
            border: 1px solid ${l ? "#718096" : "#666"};
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
      r.style.background = `linear-gradient(145deg, ${f}, #505050)`, r.style.transform = "translateY(-1px)", r.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    }), r.addEventListener("mouseleave", () => {
      r.style.background = `linear-gradient(145deg, ${i}, #404040)`, r.style.transform = "translateY(0)", r.style.boxShadow = "none";
    }), r.addEventListener("click", () => u(n.type)), r;
  }
  function I() {
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
    const n = document.createElement("div");
    n.innerHTML = "🎯 Node Alignment", n.style.cssText = `
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 12px;
            text-align: center;
            border-bottom: 1px solid #555;
            padding-bottom: 8px;
        `, c.appendChild(n);
    const l = document.createElement("div");
    l.style.cssText = `
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
    const i = [
      { type: "left", icon: "⇤", label: "Left" },
      { type: "right", icon: "⇥", label: "Right" },
      { type: "top", icon: "⇡", label: "Top" },
      { type: "bottom", icon: "⇣", label: "Bottom" },
      { type: "horizontal-flow", icon: "→", label: "H-Flow" },
      { type: "vertical-flow", icon: "↓", label: "V-Flow" }
    ], f = i.slice(0, 4), o = i.slice(4);
    f.forEach((T) => {
      const h = y(T);
      l.appendChild(h);
    }), o.forEach((T) => {
      const h = y(T, !0);
      r.appendChild(h);
    }), c.appendChild(l), c.appendChild(r);
    const z = document.createElement("div");
    z.id = "alignment-info", z.style.cssText = `
            background: rgba(60, 60, 60, 0.8);
            border-radius: 6px;
            padding: 10px;
            font-size: 12px;
            text-align: center;
        `, z.innerHTML = `
            Select multiple nodes to enable alignment<br>
            <small style="opacity: 0.8;">
                Basic: Ctrl+Shift+Arrows<br>
                Flow: Ctrl+Alt+→/↓
            </small>
        `, c.appendChild(z), document.body.appendChild(c);
  }
  function W() {
    var f;
    if (!((f = window.app) != null && f.graph)) return;
    p = Object.values(window.app.graph._nodes || {}).filter((o) => o && o.is_selected);
    const l = p.length > 1;
    l && !k ? L() : !l && k && O();
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
    const i = c == null ? void 0 : c.querySelectorAll("button");
    i == null || i.forEach((o) => {
      l ? (o.style.opacity = "1", o.style.pointerEvents = "auto") : (o.style.opacity = "0.5", o.style.pointerEvents = "none");
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
  function S(n) {
    const l = {}, r = n.filter((i) => i && (i.id !== void 0 || i.id !== null));
    return r.forEach((i) => {
      const f = i.id || `node_${r.indexOf(i)}`;
      i.id = f, l[f] = { inputs: [], outputs: [] }, i.inputs && Array.isArray(i.inputs) && i.inputs.forEach((o, z) => {
        o && o.link !== null && o.link !== void 0 && l[f].inputs.push({
          index: z,
          link: o.link,
          sourceNode: x(o.link, r)
        });
      }), i.outputs && Array.isArray(i.outputs) && i.outputs.forEach((o, z) => {
        o && o.links && Array.isArray(o.links) && o.links.length > 0 && o.links.forEach((T) => {
          const h = D(T, r);
          h && l[f].outputs.push({
            index: z,
            link: T,
            targetNode: h
          });
        });
      });
    }), l;
  }
  function x(n, l) {
    for (const r of l)
      if (r && r.outputs && Array.isArray(r.outputs)) {
        for (const i of r.outputs)
          if (i && i.links && Array.isArray(i.links) && i.links.includes(n))
            return r;
      }
    return null;
  }
  function D(n, l) {
    for (const r of l)
      if (r && r.inputs && Array.isArray(r.inputs)) {
        for (const i of r.inputs)
          if (i && i.link === n)
            return r;
      }
    return null;
  }
  function X(n, l) {
    const r = {}, i = /* @__PURE__ */ new Set(), f = n.filter((h) => h && h.id), o = f.filter((h) => {
      const C = h.id;
      return !l[C] || !l[C].inputs.length || l[C].inputs.every((g) => !g.sourceNode);
    });
    o.length === 0 && f.length > 0 && o.push(f[0]);
    const z = o.map((h) => ({ node: h, level: 0 }));
    for (; z.length > 0; ) {
      const { node: h, level: C } = z.shift();
      !h || !h.id || i.has(h.id) || (i.add(h.id), r[h.id] = { level: C, order: 0 }, l[h.id] && l[h.id].outputs && l[h.id].outputs.forEach((g) => {
        g && g.targetNode && g.targetNode.id && !i.has(g.targetNode.id) && z.push({ node: g.targetNode, level: C + 1 });
      }));
    }
    f.forEach((h) => {
      h && h.id && !r[h.id] && (r[h.id] = { level: 0, order: 0 });
    });
    const T = {};
    return Object.entries(r).forEach(([h, C]) => {
      T[C.level] || (T[C.level] = []);
      const g = f.find((s) => s && s.id === h);
      g && T[C.level].push(g);
    }), Object.entries(T).forEach(([h, C]) => {
      C && C.length > 0 && (C.sort((g, s) => {
        const A = g && g.pos && g.pos[1] ? g.pos[1] : 0, v = s && s.pos && s.pos[1] ? s.pos[1] : 0;
        return A - v;
      }), C.forEach((g, s) => {
        g && g.id && r[g.id] && (r[g.id].order = s);
      }));
    }), r;
  }
  function u(n) {
    var l, r, i, f, o;
    if (p.length < 2) {
      w("Please select at least 2 nodes to align", "warning");
      return;
    }
    try {
      const z = Math.min(...p.map((s) => s.pos[0])), T = Math.max(...p.map((s) => {
        let A = 150;
        return s.size && Array.isArray(s.size) && s.size[0] ? A = s.size[0] : typeof s.width == "number" ? A = s.width : s.properties && typeof s.properties.width == "number" && (A = s.properties.width), s.pos[0] + A;
      })), h = Math.min(...p.map((s) => s.pos[1])), C = Math.max(...p.map((s) => {
        let A = 100;
        return s.size && Array.isArray(s.size) && s.size[1] ? A = s.size[1] : typeof s.height == "number" ? A = s.height : s.properties && typeof s.properties.height == "number" && (A = s.properties.height), s.pos[1] + A;
      }));
      let g;
      switch (n) {
        case "left":
          g = z;
          const s = [...p].sort((e, Y) => e.pos[1] - Y.pos[1]);
          let A = s[0].pos[1];
          s.forEach((e, Y) => {
            let b = 100;
            e.size && Array.isArray(e.size) && e.size[1] ? b = e.size[1] : typeof e.height == "number" ? b = e.height : e.properties && typeof e.properties.height == "number" && (b = e.properties.height), e.pos[0] = g, e.pos[1] = A, typeof e.x == "number" && (e.x = e.pos[0]), typeof e.y == "number" && (e.y = e.pos[1]), A += b + 30;
          });
          break;
        case "right":
          g = T;
          const v = [...p].sort((e, Y) => e.pos[1] - Y.pos[1]);
          let E = v[0].pos[1];
          v.forEach((e, Y) => {
            let b = 100, F = 150;
            e.size && Array.isArray(e.size) ? (e.size[1] && (b = e.size[1]), e.size[0] && (F = e.size[0])) : (typeof e.height == "number" && (b = e.height), typeof e.width == "number" && (F = e.width), e.properties && (typeof e.properties.height == "number" && (b = e.properties.height), typeof e.properties.width == "number" && (F = e.properties.width))), e.pos[0] = g - F, e.pos[1] = E, typeof e.x == "number" && (e.x = e.pos[0]), typeof e.y == "number" && (e.y = e.pos[1]), E += b + 30;
          });
          break;
        case "top":
          g = h;
          const _ = [...p].sort((e, Y) => e.pos[0] - Y.pos[0]);
          let $ = _[0].pos[0];
          _.forEach((e, Y) => {
            let b = 150;
            e.size && Array.isArray(e.size) && e.size[0] ? b = e.size[0] : typeof e.width == "number" ? b = e.width : e.properties && typeof e.properties.width == "number" && (b = e.properties.width), e.pos[1] = g, e.pos[0] = $, typeof e.x == "number" && (e.x = e.pos[0]), typeof e.y == "number" && (e.y = e.pos[1]), $ += b + 30;
          });
          break;
        case "bottom":
          g = C;
          const t = [...p].sort((e, Y) => e.pos[0] - Y.pos[0]);
          let d = z;
          t.forEach((e, Y) => {
            let b = 150, F = 100;
            e.size && Array.isArray(e.size) ? (e.size[0] && (b = e.size[0]), e.size[1] && (F = e.size[1])) : (typeof e.width == "number" && (b = e.width), typeof e.height == "number" && (F = e.height), e.properties && (typeof e.properties.width == "number" && (b = e.properties.width), typeof e.properties.height == "number" && (F = e.properties.height)));
            const a = g - F, m = d;
            e.pos[1] = a, e.pos[0] = m, typeof e.x == "number" && (e.x = e.pos[0]), typeof e.y == "number" && (e.y = e.pos[1]), d += b + 30;
          });
          break;
        case "horizontal-flow":
          V();
          return;
        // Don't continue to the success message at the bottom
        case "vertical-flow":
          U();
          return;
      }
      try {
        (r = (l = window.app) == null ? void 0 : l.canvas) != null && r.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (f = (i = window.app) == null ? void 0 : i.graph) != null && f.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (o = window.app) != null && o.canvas && window.app.canvas.draw(!0, !0);
      } catch (s) {
        console.warn("Could not trigger canvas redraw:", s);
      }
      w(`Aligned ${p.length} nodes to ${n}`, "success");
    } catch (z) {
      console.error("Alignment error:", z), w("Error during alignment", "error");
    }
  }
  function P(n) {
  }
  function V() {
    var n, l, r, i, f;
    try {
      const o = p.filter((t) => {
        if (!t) return !1;
        const d = t.pos || t.position || typeof t.x == "number" && typeof t.y == "number", e = t.size || t.width || t.height || typeof t.width == "number" && typeof t.height == "number", Y = !!d && !!e;
        return Y;
      });
      if (o.length < 2) {
        w(`Not enough valid nodes: ${o.length}/${p.length} nodes are valid`, "warning");
        return;
      }
      const z = Math.min(...o.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[0] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[0] : typeof t.x == "number" ? t.x : 0)), T = Math.min(...o.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[1] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[1] : typeof t.y == "number" ? t.y : 0)), h = z, C = T;
      o.forEach((t) => {
        t.pos || (t.position && Array.isArray(t.position) ? t.pos = t.position : typeof t.x == "number" && typeof t.y == "number" ? t.pos = [t.x, t.y] : t.pos = [0, 0]), t._calculatedSize || (t.size && Array.isArray(t.size) ? t._calculatedSize = [t.size[0], t.size[1]] : typeof t.width == "number" && typeof t.height == "number" ? t._calculatedSize = [t.width, t.height] : t._calculatedSize = [150, 100]), Array.isArray(t.pos) || (t.pos = [0, 0]);
      });
      const g = S(o), s = X(o, g), A = 40, v = 20, E = 15, _ = 5, $ = {};
      o.forEach((t) => {
        var d;
        if (t && t.id) {
          const e = ((d = s[t.id]) == null ? void 0 : d.level) ?? 0;
          $[e] || ($[e] = []), $[e].push(t);
        }
      }), Object.entries($).forEach(([t, d]) => {
        const e = parseInt(t);
        if (d && d.length > 0) {
          d.sort((a, m) => {
            const R = a && a.id && s[a.id] ? s[a.id].order : 0, N = m && m.id && s[m.id] ? s[m.id].order : 0;
            return R - N;
          });
          const Y = d.reduce((a, m, R) => {
            const N = m && m._calculatedSize && m._calculatedSize[1] ? m._calculatedSize[1] : 100;
            return a + N + (R < d.length - 1 ? E : 0);
          }, 0), q = Math.max(...d.map(
            (a) => a && a._calculatedSize && a._calculatedSize[0] ? a._calculatedSize[0] : 150
          ));
          let b = h;
          if (e > 0)
            for (let a = 0; a < e; a++) {
              const m = $[a] || [], R = Math.max(...m.map(
                (N) => N && N._calculatedSize && N._calculatedSize[0] ? N._calculatedSize[0] : 150
              ));
              b += R + A + _;
            }
          let F = C;
          d.forEach((a, m) => {
            if (a && a.pos && a._calculatedSize) {
              const R = [a.pos[0], a.pos[1]], N = [a._calculatedSize[0], a._calculatedSize[1]];
              a.pos[0] = b, a.pos[1] = F, F += a._calculatedSize[1] + E, typeof a.x == "number" && (a.x = a.pos[0]), typeof a.y == "number" && (a.y = a.pos[1]);
            }
          });
        }
      });
      try {
        (l = (n = window.app) == null ? void 0 : n.canvas) != null && l.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (i = (r = window.app) == null ? void 0 : r.graph) != null && i.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (f = window.app) != null && f.canvas && window.app.canvas.draw(!0, !0);
      } catch (t) {
        console.warn("Could not trigger canvas redraw:", t);
      }
      w(`Arranged ${o.length} nodes in horizontal flow`, "success");
    } catch (o) {
      console.error("Horizontal flow alignment error:", o), w("Error in horizontal flow alignment", "error");
    }
  }
  function U() {
    var n, l, r, i, f;
    try {
      const o = p.filter((t) => {
        if (!t) return !1;
        const d = t.pos || t.position || typeof t.x == "number" && typeof t.y == "number", e = t.size || t.width || t.height || typeof t.width == "number" && typeof t.height == "number";
        return !!d && !!e;
      });
      if (o.length < 2) {
        w(`Not enough valid nodes: ${o.length}/${p.length} nodes are valid`, "warning");
        return;
      }
      const z = Math.min(...o.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[0] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[0] : typeof t.x == "number" ? t.x : 0)), T = Math.min(...o.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[1] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[1] : typeof t.y == "number" ? t.y : 0)), h = z, C = T;
      o.forEach((t) => {
        t.pos || (t.position && Array.isArray(t.position) ? t.pos = t.position : typeof t.x == "number" && typeof t.y == "number" ? t.pos = [t.x, t.y] : t.pos = [0, 0]), t._calculatedSize || (t.size && Array.isArray(t.size) ? t._calculatedSize = [t.size[0], t.size[1]] : typeof t.width == "number" && typeof t.height == "number" ? t._calculatedSize = [t.width, t.height] : t._calculatedSize = [150, 100]), Array.isArray(t.pos) || (t.pos = [0, 0]);
      });
      const g = S(o), s = X(o, g), A = 50, v = 30, E = 25, _ = 15, $ = {};
      o.forEach((t) => {
        var d;
        if (t && t.id) {
          const e = ((d = s[t.id]) == null ? void 0 : d.level) ?? 0;
          $[e] || ($[e] = []), $[e].push(t);
        }
      }), Object.entries($).forEach(([t, d]) => {
        const e = parseInt(t);
        if (d && d.length > 0) {
          d.sort((a, m) => {
            const R = a && a.id && s[a.id] ? s[a.id].order : 0, N = m && m.id && s[m.id] ? s[m.id].order : 0;
            return R - N;
          });
          const Y = d.reduce((a, m, R) => {
            const N = m && m._calculatedSize && m._calculatedSize[0] ? m._calculatedSize[0] : 150;
            return a + N + v;
          }, 0), q = Math.max(...d.map(
            (a) => a && a._calculatedSize && a._calculatedSize[1] ? a._calculatedSize[1] : 100
          ));
          let b = C;
          if (e > 0)
            for (let a = 0; a < e; a++) {
              const m = $[a] || [], R = Math.max(...m.map(
                (N) => N && N._calculatedSize && N._calculatedSize[1] ? N._calculatedSize[1] : 100
              ));
              b += R + A + _;
            }
          let F = h;
          d.forEach((a, m) => {
            if (a && a.pos && a._calculatedSize) {
              const R = [a.pos[0], a.pos[1]], N = [a._calculatedSize[0], a._calculatedSize[1]];
              a.pos[0] = F, a.pos[1] = b, F += a._calculatedSize[0] + v, typeof a.x == "number" && (a.x = a.pos[0]), typeof a.y == "number" && (a.y = a.pos[1]);
            }
          });
        }
      });
      try {
        (l = (n = window.app) == null ? void 0 : n.canvas) != null && l.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (i = (r = window.app) == null ? void 0 : r.graph) != null && i.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (f = window.app) != null && f.canvas && window.app.canvas.draw(!0, !0);
      } catch (t) {
        console.warn("Could not trigger canvas redraw:", t);
      }
      w(`Arranged ${o.length} nodes in vertical flow`, "success");
    } catch (o) {
      console.error("Vertical flow alignment error:", o), w("Error in vertical flow alignment", "error");
    }
  }
  function w(n, l = "info") {
    const r = document.createElement("div");
    r.textContent = n, r.style.cssText = `
            position: fixed;
            top: 60px;
            right: 10px;
            background: ${l === "success" ? "#4CAF50" : l === "warning" ? "#FF9800" : l === "error" ? "#F44336" : "#2196F3"};
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
  function B() {
    var n;
    if (!((n = window.app) != null && n.canvas)) {
      setTimeout(B, 100);
      return;
    }
    window.app.canvas.canvas && (window.app.canvas.canvas.addEventListener("click", () => {
      setTimeout(W, 10);
    }), window.app.canvas.canvas.addEventListener("mouseup", () => {
      setTimeout(W, 10);
    }), document.addEventListener("keydown", (l) => {
      (l.ctrlKey || l.metaKey) && setTimeout(W, 10);
    })), setInterval(W, 500);
  }
  function K(n) {
    if (n.ctrlKey || n.metaKey) {
      if (n.shiftKey)
        switch (n.key) {
          case "ArrowLeft":
            n.preventDefault(), u("left");
            break;
          case "ArrowRight":
            n.preventDefault(), u("right");
            break;
          case "ArrowUp":
            n.preventDefault(), u("top");
            break;
          case "ArrowDown":
            n.preventDefault(), u("bottom");
            break;
        }
      else if (n.altKey)
        switch (n.key) {
          case "ArrowRight":
            n.preventDefault(), u("horizontal-flow");
            break;
          case "ArrowDown":
            n.preventDefault(), u("vertical-flow");
            break;
        }
    }
  }
  I(), B(), document.addEventListener("keydown", K);
}
