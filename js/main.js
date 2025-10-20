import { app as Yt } from "../../../scripts/app.js";
import { ComponentWidgetImpl as Zt, addWidget as Xt } from "../../../scripts/domWidget.js";
import { defineComponent as Ve, ref as te, resolveDirective as Wt, createElementBlock as _e, openBlock as be, Fragment as ft, createElementVNode as ce, withDirectives as jt, createVNode as Fe, createBlock as dt, unref as Q, normalizeClass as gt, withCtx as Ke, createTextVNode as mt, toDisplayString as Ae, renderList as Ut, normalizeStyle as Kt, onMounted as bt, nextTick as qt } from "vue";
import qe from "primevue/button";
import { useI18n as wt } from "vue-i18n";
const Jt = { class: "toolbar" }, Qt = { class: "color-picker" }, e2 = { class: "size-slider" }, t2 = ["value"], i2 = /* @__PURE__ */ Ve({
  __name: "ToolBar",
  props: {
    colors: {},
    initialColor: {},
    initialBrushSize: {},
    initialTool: {}
  },
  emits: ["tool-change", "color-change", "canvas-clear", "brush-size-change"],
  setup(A, { emit: B }) {
    const { t: L } = wt(), P = A, m = B, ee = P.colors || ["#000000", "#ff0000", "#0000ff", "#69a869", "#ffff00", "#ff00ff", "#00ffff"], j = te(P.initialColor || "#000000"), I = te(P.initialBrushSize || 5), $ = te(P.initialTool || "pen");
    function H(x) {
      $.value = x, m("tool-change", x);
    }
    function Z(x) {
      j.value = x, m("color-change", x);
    }
    function G() {
      m("canvas-clear");
    }
    function k(x) {
      const E = x.target;
      I.value = Number(E.value), m("brush-size-change", I.value);
    }
    return (x, E) => {
      const ne = Wt("tooltip");
      return be(), _e(ft, null, [
        ce("div", Jt, [
          jt((be(), dt(Q(qe), {
            class: gt({ active: $.value === "pen" }),
            onClick: E[0] || (E[0] = (X) => H("pen"))
          }, {
            default: Ke(() => [
              mt(Ae(Q(L)("vue-basic.pen")), 1)
            ]),
            _: 1
          }, 8, ["class"])), [
            [ne, { value: Q(L)("vue-basic.pen-tooltip"), showDelay: 300 }]
          ]),
          Fe(Q(qe), { onClick: G }, {
            default: Ke(() => [
              mt(Ae(Q(L)("vue-basic.clear-canvas")), 1)
            ]),
            _: 1
          })
        ]),
        ce("div", Qt, [
          (be(!0), _e(ft, null, Ut(Q(ee), (X, W) => (be(), dt(Q(qe), {
            key: W,
            class: gt({ "color-button": !0, active: j.value === X }),
            onClick: (he) => Z(X),
            type: "button",
            title: X
          }, {
            default: Ke(() => [
              ce("i", {
                class: "pi pi-circle-fill",
                style: Kt({ color: X })
              }, null, 4)
            ]),
            _: 2
          }, 1032, ["class", "onClick", "title"]))), 128))
        ]),
        ce("div", e2, [
          ce("label", null, Ae(Q(L)("vue-basic.brush-size")) + ": " + Ae(I.value) + "px", 1),
          ce("input", {
            type: "range",
            min: "1",
            max: "50",
            value: I.value,
            onChange: E[1] || (E[1] = (X) => k(X))
          }, null, 40, t2)
        ])
      ], 64);
    };
  }
}), Je = (A, B) => {
  const L = A.__vccOpts || A;
  for (const [P, m] of B)
    L[P] = m;
  return L;
}, r2 = /* @__PURE__ */ Je(i2, [["__scopeId", "data-v-cae98791"]]), a2 = { class: "drawing-board" }, o2 = { class: "canvas-container" }, s2 = ["width", "height"], n2 = /* @__PURE__ */ Ve({
  __name: "DrawingBoard",
  props: {
    width: {},
    height: {},
    initialColor: {},
    initialBrushSize: {}
  },
  emits: ["mounted", "drawing-start", "drawing", "drawing-end", "state-save", "canvas-clear"],
  setup(A, { expose: B, emit: L }) {
    const P = A, m = P.width || 800, ee = P.height || 500, j = P.initialColor || "#000000", I = P.initialBrushSize || 5, $ = L, H = te(!1), Z = te(0), G = te(0), k = te(null), x = te(!1), E = te(I), ne = te(j), X = te(null), W = te(null);
    bt(() => {
      W.value && (k.value = W.value.getContext("2d"), he(), qt(() => {
        W.value && $("mounted", W.value);
      }));
    });
    function he() {
      k.value && (k.value.fillStyle = "#ffffff", k.value.fillRect(0, 0, m, ee), se(), Ce());
    }
    function se() {
      k.value && (x.value ? (k.value.globalCompositeOperation = "destination-out", k.value.strokeStyle = "rgba(0,0,0,1)") : (k.value.globalCompositeOperation = "source-over", k.value.strokeStyle = ne.value), k.value.lineWidth = E.value, k.value.lineJoin = "round", k.value.lineCap = "round");
    }
    function we(F) {
      H.value = !0;
      const { offsetX: K, offsetY: J } = U(F);
      Z.value = K, G.value = J, k.value && (k.value.beginPath(), k.value.moveTo(Z.value, G.value), k.value.arc(Z.value, G.value, E.value / 2, 0, Math.PI * 2), k.value.fill(), $("drawing-start", {
        x: K,
        y: J,
        tool: x.value ? "eraser" : "pen"
      }));
    }
    function fe(F) {
      if (!H.value || !k.value) return;
      const { offsetX: K, offsetY: J } = U(F);
      k.value.beginPath(), k.value.moveTo(Z.value, G.value), k.value.lineTo(K, J), k.value.stroke(), Z.value = K, G.value = J, $("drawing", {
        x: K,
        y: J,
        tool: x.value ? "eraser" : "pen"
      });
    }
    function D() {
      H.value && (H.value = !1, Ce(), $("drawing-end"));
    }
    function U(F) {
      let K = 0, J = 0;
      if ("touches" in F) {
        if (F.preventDefault(), W.value) {
          const Le = W.value.getBoundingClientRect();
          K = F.touches[0].clientX - Le.left, J = F.touches[0].clientY - Le.top;
        }
      } else
        K = F.offsetX, J = F.offsetY;
      return { offsetX: K, offsetY: J };
    }
    function Me(F) {
      F.preventDefault();
      const J = {
        touches: [F.touches[0]]
      };
      we(J);
    }
    function Re(F) {
      if (F.preventDefault(), !H.value) return;
      const J = {
        touches: [F.touches[0]]
      };
      fe(J);
    }
    function Ie(F) {
      x.value = F === "eraser", se();
    }
    function $e(F) {
      ne.value = F, se();
    }
    function de(F) {
      E.value = F, se();
    }
    function xe() {
      k.value && (k.value.fillStyle = "#ffffff", k.value.fillRect(0, 0, m, ee), se(), Ce(), $("canvas-clear"));
    }
    function Ce() {
      W.value && (X.value = W.value.toDataURL("image/png"), X.value && $("state-save", X.value));
    }
    async function Ge() {
      if (!W.value)
        throw new Error("Canvas is unable to get current data");
      return X.value ? X.value : W.value.toDataURL("image/png");
    }
    return B({
      setTool: Ie,
      setColor: $e,
      setBrushSize: de,
      clearCanvas: xe,
      getCurrentCanvasData: Ge
    }), (F, K) => (be(), _e("div", a2, [
      ce("div", o2, [
        ce("canvas", {
          ref_key: "canvas",
          ref: W,
          width: Q(m),
          height: Q(ee),
          onMousedown: we,
          onMousemove: fe,
          onMouseup: D,
          onMouseleave: D,
          onTouchstart: Me,
          onTouchmove: Re,
          onTouchend: D
        }, null, 40, s2)
      ])
    ]));
  }
}), l2 = /* @__PURE__ */ Je(n2, [["__scopeId", "data-v-ca1239fc"]]), c2 = { class: "drawing-app" }, p2 = /* @__PURE__ */ Ve({
  __name: "DrawingApp",
  props: {
    width: {},
    height: {},
    initialColor: {},
    initialBrushSize: {},
    availableColors: {}
  },
  emits: ["tool-change", "color-change", "brush-size-change", "drawing-start", "drawing", "drawing-end", "state-save", "mounted"],
  setup(A, { expose: B, emit: L }) {
    const P = A, m = P.width || 800, ee = P.height || 500, j = P.initialColor || "#000000", I = P.initialBrushSize || 5, $ = P.availableColors || ["#000000", "#ff0000", "#0000ff", "#00ff00", "#ffff00", "#ff00ff", "#00ffff"], H = L, Z = te(null), G = te(null);
    function k(D) {
      var U;
      (U = Z.value) == null || U.setTool(D), H("tool-change", D);
    }
    function x(D) {
      var U;
      (U = Z.value) == null || U.setColor(D), H("color-change", D);
    }
    function E(D) {
      var U;
      (U = Z.value) == null || U.setBrushSize(D), H("brush-size-change", D);
    }
    function ne() {
      var D;
      (D = Z.value) == null || D.clearCanvas();
    }
    function X(D) {
      H("drawing-start", D);
    }
    function W(D) {
      H("drawing", D);
    }
    function he() {
      H("drawing-end");
    }
    function se(D) {
      G.value = D, H("state-save", D);
    }
    function we(D) {
      H("mounted", D);
    }
    async function fe() {
      if (G.value)
        return G.value;
      if (Z.value)
        try {
          return await Z.value.getCurrentCanvasData();
        } catch (D) {
          throw console.error("unable to get canvas data:", D), new Error("unable to get canvas data");
        }
      throw new Error("get canvas data failed");
    }
    return B({
      getCanvasData: fe
    }), (D, U) => (be(), _e("div", c2, [
      Fe(r2, {
        colors: Q($),
        initialColor: Q(j),
        initialBrushSize: Q(I),
        onToolChange: k,
        onColorChange: x,
        onBrushSizeChange: E,
        onCanvasClear: ne
      }, null, 8, ["colors", "initialColor", "initialBrushSize"]),
      Fe(l2, {
        ref_key: "drawingBoard",
        ref: Z,
        width: Q(m),
        height: Q(ee),
        initialColor: Q(j),
        initialBrushSize: Q(I),
        onDrawingStart: X,
        onDrawing: W,
        onDrawingEnd: he,
        onStateSave: se,
        onMounted: we
      }, null, 8, ["width", "height", "initialColor", "initialBrushSize"])
    ]));
  }
}), u2 = /* @__PURE__ */ Je(p2, [["__scopeId", "data-v-39bbf58b"]]), h2 = /* @__PURE__ */ Ve({
  __name: "VueExampleComponent",
  props: {
    widget: {}
  },
  setup(A) {
    const { t: B } = wt(), L = te(null), P = te(null);
    A.widget.node;
    function m(j) {
      P.value = j, console.log("canvas state saved:", j.substring(0, 50) + "...");
    }
    async function ee(j, I) {
      var $;
      try {
        if (!(($ = window.app) != null && $.api))
          throw new Error("ComfyUI API not available");
        const H = await fetch(j).then((E) => E.blob()), Z = `${I}_${Date.now()}.png`, G = new File([H], Z), k = new FormData();
        return k.append("image", G), k.append("subfolder", "threed"), k.append("type", "temp"), console.log("Vue Component: Using window.app.api.fetchApi"), (await window.app.api.fetchApi("/upload/image", {
          method: "POST",
          body: k
        })).json();
      } catch (H) {
        throw console.error("Vue Component: Error uploading image:", H), H;
      }
    }
    return bt(() => {
      A.widget.serializeValue = async (j, I) => {
        try {
          console.log("Vue Component: inside vue serializeValue"), console.log("node", j), console.log("index", I);
          const $ = P.value;
          return $ ? {
            image: `threed/${(await ee($, "test_vue_basic")).name} [temp]`
          } : (console.warn("Vue Component: No canvas data available"), { image: null });
        } catch ($) {
          return console.error("Vue Component: Error in serializeValue:", $), { image: null };
        }
      };
    }), (j, I) => (be(), _e("div", null, [
      ce("h1", null, Ae(Q(B)("vue-basic.title")), 1),
      ce("div", null, [
        Fe(u2, {
          ref_key: "drawingAppRef",
          ref: L,
          width: 300,
          height: 300,
          onStateSave: m
        }, null, 512)
      ])
    ]));
  }
}), vt = "data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M4.88822%2014.1929C2.49999%2014.9929%201.36569%2011.6929%202.36088%2010.5C2.85843%209.83333%204.58971%207.89286%207.37597%204.69286C10.8588%200.692857%2012.849%202.19286%2014.3416%202.69286C15.8343%203.19286%2019.8146%207.19286%2020.8097%208.19286C21.8048%209.19286%2022.3024%2010.5%2021.8048%2011.5C21.4068%2012.3%2019.4431%2012.6667%2018.7797%2012.5C19.7748%2013%2021.3073%2017.1929%2021.8048%2018.6929C22.2028%2019.8929%2021.3073%2021.1667%2020.8097%2021.5C20.3122%2021.6667%2018.919%2022%2017.3269%2022C15.3367%2022%2015.8343%2019.6929%2016.3318%2017.1929C16.8293%2014.6929%2014.3416%2014.6929%2011.8539%2015.6929C9.36615%2016.6929%209.8637%2017.6929%2010.8588%2018.1929C11.8539%2018.6929%2011.8141%2020.1929%2011.3166%2021.1929C10.8191%2022.1929%206.83869%2022.1929%205.84359%2021.1929C5.07774%2020.4232%206.1292%2015.7356%206.80082%2013.4517C6.51367%2013.6054%205.93814%2013.8412%204.88822%2014.1929Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", f2 = "data:image/svg+xml,%3csvg%20width='33'%20height='32'%20viewBox='0%200%2033%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M9.73332%2028C9.73332%2028.3536%209.59284%2028.6928%209.34279%2028.9428C9.09274%2029.1929%208.75361%2029.3333%208.39998%2029.3333C8.04636%2029.3333%207.70722%2029.1929%207.45717%2028.9428C7.20713%2028.6928%207.06665%2028.3536%207.06665%2028V4C7.06665%203.64638%207.20713%203.30724%207.45717%203.05719C7.70722%202.80714%208.04636%202.66667%208.39998%202.66667C8.75361%202.66667%209.09274%202.80714%209.34279%203.05719C9.59284%203.30724%209.73332%203.64638%209.73332%204V28ZM15.0667%2012C14.3594%2012%2013.6811%2011.719%2013.181%2011.219C12.6809%2010.7189%2012.4%2010.0406%2012.4%209.33333C12.4%208.62609%2012.6809%207.94781%2013.181%207.44771C13.6811%206.94762%2014.3594%206.66667%2015.0667%206.66667H23.0667C23.7739%206.66667%2024.4522%206.94762%2024.9523%207.44771C25.4524%207.94781%2025.7333%208.62609%2025.7333%209.33333C25.7333%2010.0406%2025.4524%2010.7189%2024.9523%2011.219C24.4522%2011.719%2023.7739%2012%2023.0667%2012H15.0667ZM15.0667%2016H20.4C21.1072%2016%2021.7855%2016.281%2022.2856%2016.781C22.7857%2017.2811%2023.0667%2017.9594%2023.0667%2018.6667C23.0667%2019.3739%2022.7857%2020.0522%2022.2856%2020.5523C21.7855%2021.0524%2021.1072%2021.3333%2020.4%2021.3333H15.0667C14.3594%2021.3333%2013.6811%2021.0524%2013.181%2020.5523C12.6809%2020.0522%2012.4%2019.3739%2012.4%2018.6667C12.4%2017.9594%2012.6809%2017.2811%2013.181%2016.781C13.6811%2016.281%2014.3594%2016%2015.0667%2016Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", d2 = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M22.6667%2028C22.6667%2028.3536%2022.5262%2028.6928%2022.2761%2028.9428C22.0261%2029.1929%2021.687%2029.3333%2021.3333%2029.3333C20.9797%2029.3333%2020.6406%2029.1929%2020.3905%2028.9428C20.1405%2028.6928%2020%2028.3536%2020%2028V4C20%203.64638%2020.1405%203.30724%2020.3905%203.05719C20.6406%202.80714%2020.9797%202.66667%2021.3333%202.66667C21.687%202.66667%2022.0261%202.80714%2022.2761%203.05719C22.5262%203.30724%2022.6667%203.64638%2022.6667%204V28ZM14.6667%206.66667C15.3739%206.66667%2016.0522%206.94762%2016.5523%207.44771C17.0524%207.94781%2017.3333%208.62609%2017.3333%209.33333C17.3333%2010.0406%2017.0524%2010.7189%2016.5523%2011.219C16.0522%2011.719%2015.3739%2012%2014.6667%2012H6.66667C5.95942%2012%205.28115%2011.719%204.78105%2011.219C4.28095%2010.7189%204%2010.0406%204%209.33333C4%208.62609%204.28095%207.94781%204.78105%207.44771C5.28115%206.94762%205.95942%206.66667%206.66667%206.66667H14.6667ZM14.6667%2016C15.3739%2016%2016.0522%2016.281%2016.5523%2016.781C17.0524%2017.2811%2017.3333%2017.9594%2017.3333%2018.6667C17.3333%2019.3739%2017.0524%2020.0522%2016.5523%2020.5523C16.0522%2021.0524%2015.3739%2021.3333%2014.6667%2021.3333H9.33333C8.62609%2021.3333%207.94781%2021.0524%207.44772%2020.5523C6.94762%2020.0522%206.66667%2019.3739%206.66667%2018.6667C6.66667%2017.9594%206.94762%2017.2811%207.44772%2016.781C7.94781%2016.281%208.62609%2016%209.33333%2016H14.6667Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", g2 = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M6.39992%204H25.5999C26.1893%204%2026.6666%204.59733%2026.6666%205.33333C26.6666%206.06933%2026.1893%206.66667%2025.5999%206.66667H6.39992C5.81059%206.66667%205.33325%206.06933%205.33325%205.33333C5.33325%204.59733%205.81059%204%206.39992%204ZM9.33325%2012C9.33325%2011.2928%209.6142%2010.6145%2010.1143%2010.1144C10.6144%209.61428%2011.2927%209.33333%2011.9999%209.33333C12.7072%209.33333%2013.3854%209.61428%2013.8855%2010.1144C14.3856%2010.6145%2014.6666%2011.2928%2014.6666%2012V25.3333C14.6666%2026.0406%2014.3856%2026.7189%2013.8855%2027.219C13.3854%2027.719%2012.7072%2028%2011.9999%2028C11.2927%2028%2010.6144%2027.719%2010.1143%2027.219C9.6142%2026.7189%209.33325%2026.0406%209.33325%2025.3333V12ZM17.3333%2012C17.3333%2011.2928%2017.6142%2010.6145%2018.1143%2010.1144C18.6144%209.61428%2019.2927%209.33333%2019.9999%209.33333C20.7072%209.33333%2021.3854%209.61428%2021.8855%2010.1144C22.3856%2010.6145%2022.6666%2011.2928%2022.6666%2012V20C22.6666%2020.7072%2022.3856%2021.3855%2021.8855%2021.8856C21.3854%2022.3857%2020.7072%2022.6667%2019.9999%2022.6667C19.2927%2022.6667%2018.6144%2022.3857%2018.1143%2021.8856C17.6142%2021.3855%2017.3333%2020.7072%2017.3333%2020V12Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", m2 = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M6.39992%2025.3333H25.5999C26.1893%2025.3333%2026.6666%2025.9307%2026.6666%2026.6667C26.6666%2027.4027%2026.1893%2028%2025.5999%2028H6.39992C5.81059%2028%205.33325%2027.4027%205.33325%2026.6667C5.33325%2025.9307%205.81059%2025.3333%206.39992%2025.3333ZM14.6666%2020C14.6666%2020.7072%2014.3856%2021.3855%2013.8855%2021.8856C13.3854%2022.3857%2012.7072%2022.6667%2011.9999%2022.6667C11.2927%2022.6667%2010.6144%2022.3857%2010.1143%2021.8856C9.6142%2021.3855%209.33325%2020.7072%209.33325%2020V6.66667C9.33325%205.95942%209.6142%205.28115%2010.1143%204.78105C10.6144%204.28095%2011.2927%204%2011.9999%204C12.7072%204%2013.3854%204.28095%2013.8855%204.78105C14.3856%205.28115%2014.6666%205.95942%2014.6666%206.66667V20ZM22.6666%2020C22.6666%2020.7072%2022.3856%2021.3855%2021.8855%2021.8856C21.3854%2022.3857%2020.7072%2022.6667%2019.9999%2022.6667C19.2927%2022.6667%2018.6144%2022.3857%2018.1143%2021.8856C17.6142%2021.3855%2017.3333%2020.7072%2017.3333%2020V12C17.3333%2011.2928%2017.6142%2010.6145%2018.1143%2010.1144C18.6144%209.61428%2019.2927%209.33333%2019.9999%209.33333C20.7072%209.33333%2021.3854%209.61428%2021.8855%2010.1144C22.3856%2010.6145%2022.6666%2011.2928%2022.6666%2012V20Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", v2 = "data:image/svg+xml,%3csvg%20width='33'%20height='32'%20viewBox='0%200%2033%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M3.80005%2024.7791V6.22093C3.80005%205.54663%204.41923%205%205.18303%205C5.94683%205%206.56601%205.54663%206.56601%206.22093V24.7791C6.56601%2025.4534%205.94683%2026%205.18303%2026C4.41923%2026%203.80005%2025.4534%203.80005%2024.7791Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M7.49597%2016.1488L10.3015%2018.9352C10.6394%2019.2708%2011.2681%2019.0598%2011.2681%2018.6107V17.6976H22.332V18.6107C22.332%2019.0598%2022.9607%2019.2708%2023.2986%2018.9352L26.1041%2016.1488C26.4767%2015.7787%2026.4767%2015.221%2026.1041%2014.851L23.2986%2012.0646C22.9607%2011.729%2022.332%2011.94%2022.332%2012.3891V13.3022H11.2681V12.3891C11.2681%2011.94%2010.6394%2011.729%2010.3015%2012.0646L7.49597%2014.851C7.12335%2015.221%207.12335%2015.7787%207.49597%2016.1488Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M27.0341%2024.7791V6.22093C27.0341%205.54663%2027.6533%205%2028.4171%205C29.1809%205%2029.8%205.54663%2029.8%206.22093V24.7791C29.8%2025.4534%2029.1809%2026%2028.4171%2026C27.6533%2026%2027.0341%2025.4534%2027.0341%2024.7791Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", b2 = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M3%2024.7791V6.22093C3%205.54663%203.61918%205%204.38298%205C5.14678%205%205.76596%205.54663%205.76596%206.22093V24.7791C5.76596%2025.4534%205.14678%2026%204.38298%2026C3.61918%2026%203%2025.4534%203%2024.7791Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M26.234%2024.7791V6.22093C26.234%205.54663%2026.8532%205%2027.617%205C28.3808%205%2029%205.54663%2029%206.22093V24.7791C29%2025.4534%2028.3808%2026%2027.617%2026C26.8532%2026%2026.234%2025.4534%2026.234%2024.7791Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M15.0141%2016.2491L12.2086%2019.0355C11.8706%2019.3711%2011.2419%2019.1601%2011.2419%2018.711V17.7979H6.71L6.71%2013.4025H11.2419V12.4894C11.2419%2012.0403%2011.8706%2011.8293%2012.2086%2012.1649L15.0141%2014.9513C15.3867%2015.3213%2015.3867%2015.879%2015.0141%2016.2491Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M16.9895%2016.2491L19.795%2019.0355C20.133%2019.3711%2020.7617%2019.1601%2020.7617%2018.711V17.7979H25.2936L25.2936%2013.4025H20.7617V12.4894C20.7617%2012.0403%2020.133%2011.8293%2019.795%2012.1649L16.9895%2014.9513C16.6169%2015.3213%2016.6169%2015.879%2016.9895%2016.2491Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", w2 = "data:image/svg+xml,%3csvg%20width='33'%20height='32'%20viewBox='0%200%2033%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20x='0.399902'%20width='32'%20height='32'%20rx='4'%20fill='%23283540'/%3e%3cpath%20d='M25.179%2029H6.62083C5.94653%2029%205.3999%2028.3808%205.3999%2027.617C5.3999%2026.8532%205.94653%2026.234%206.62083%2026.234H25.179C25.8533%2026.234%2026.3999%2026.8532%2026.3999%2027.617C26.3999%2028.3808%2025.8533%2029%2025.179%2029Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M16.5487%2025.3041L19.3351%2022.4986C19.6707%2022.1606%2019.4597%2021.5319%2019.0106%2021.5319H18.0975V10.4681H19.0106C19.4597%2010.4681%2019.6707%209.83938%2019.3351%209.50144L16.5487%206.69593C16.1786%206.32331%2015.621%206.32331%2015.2509%206.69593L12.4645%209.50144C12.1289%209.83938%2012.3399%2010.4681%2012.789%2010.4681H13.7021V21.5319H12.789C12.3399%2021.5319%2012.1289%2022.1606%2012.4645%2022.4986L15.2509%2025.3041C15.621%2025.6767%2016.1786%2025.6767%2016.5487%2025.3041Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M25.179%205.76596H6.62083C5.94653%205.76596%205.3999%205.14678%205.3999%204.38298C5.3999%203.61918%205.94653%203%206.62083%203H25.179C25.8533%203%2026.3999%203.61918%2026.3999%204.38298C26.3999%205.14678%2025.8533%205.76596%2025.179%205.76596Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", y2 = "data:image/svg+xml,%3csvg%20width='33'%20height='32'%20viewBox='0%200%2033%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M7.82103%203H26.3792C27.0535%203%2027.6001%203.61918%2027.6001%204.38298C27.6001%205.14678%2027.0535%205.76596%2026.3792%205.76596H7.82103C7.14673%205.76596%206.6001%205.14678%206.6001%204.38298C6.6001%203.61918%207.14673%203%207.82103%203Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M7.82103%2026.234H26.3792C27.0535%2026.234%2027.6001%2026.8532%2027.6001%2027.617C27.6001%2028.3808%2027.0535%2029%2026.3792%2029H7.82103C7.14673%2029%206.6001%2028.3808%206.6001%2027.617C6.6001%2026.8532%207.14673%2026.234%207.82103%2026.234Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M16.351%2015.0141L13.5646%2012.2086C13.229%2011.8706%2013.44%2011.2419%2013.8891%2011.2419H14.8022V6.71L19.1976%206.71V11.2419H20.1107C20.5598%2011.2419%2020.7708%2011.8706%2020.4352%2012.2086L17.6488%2015.0141C17.2787%2015.3867%2016.7211%2015.3867%2016.351%2015.0141Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M16.351%2016.9895L13.5646%2019.795C13.229%2020.133%2013.44%2020.7617%2013.8891%2020.7617H14.8022V25.2936L19.1976%2025.2936V20.7617H20.1107C20.5598%2020.7617%2020.7708%2020.133%2020.4352%2019.795L17.6488%2016.9895C17.2787%2016.6169%2016.7211%2016.6169%2016.351%2016.9895Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", x2 = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M19.5201%206.18689C19.2052%205.87191%2019.4282%205.33334%2019.8737%205.33334H25.6666C26.2189%205.33334%2026.6666%205.78105%2026.6666%206.33334V12.1262C26.6666%2012.5717%2026.128%2012.7948%2025.813%2012.4798L23.9999%2010.6667L18.6666%2016L15.9999%2013.3333L21.3333%208L19.5201%206.18689ZM12.4797%2025.8131C12.7947%2026.1281%2012.5716%2026.6667%2012.1261%2026.6667H6.33325C5.78097%2026.6667%205.33325%2026.219%205.33325%2025.6667V19.8738C5.33325%2019.4283%205.87182%2019.2052%206.18681%2019.5202L7.99992%2021.3333L13.3333%2016L15.9999%2018.6667L10.6666%2024L12.4797%2025.8131Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", C2 = "data:image/svg+xml,%3csvg%20width='33'%20height='32'%20viewBox='0%200%2033%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M14.8666%2016H9.07372C8.62827%2016%208.40519%2016.5386%208.72017%2016.8535L10.5333%2018.6667L5.19995%2024L7.86662%2026.6667L13.2%2021.3333L15.0131%2023.1464C15.328%2023.4614%2015.8666%2023.2383%2015.8666%2022.7929V17C15.8666%2016.4477%2015.4189%2016%2014.8666%2016Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M17.2%2015.6667H22.9929C23.4384%2015.6667%2023.6615%2015.1281%2023.3465%2014.8131L21.5334%2013L26.8667%207.66667L24.2%205L18.8667%2010.3333L17.0536%208.52022C16.7386%208.20524%2016.2%208.42832%2016.2%208.87377V14.6667C16.2%2015.219%2016.6477%2015.6667%2017.2%2015.6667Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", k2 = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M15.9999%2016C15.9999%2016.1427%2015.9692%2016.288%2015.9039%2016.4213C15.8398%2016.5595%2015.7376%2016.6766%2015.6092%2016.7587L6.46256%2022.5587C6.09456%2022.7907%205.6319%2022.6387%205.42923%2022.22C5.36471%2022.089%205.33183%2021.9447%205.33323%2021.7987V10.2013C5.33323%209.72132%205.67323%209.33333%206.09323%209.33333C6.22441%209.33264%206.35289%209.37067%206.46256%209.44266L15.6092%2015.2413C15.7325%2015.3252%2015.8328%2015.4385%2015.901%2015.571C15.9692%2015.7035%2016.0032%2015.851%2015.9999%2016V10.2C15.9999%209.71999%2016.3399%209.33199%2016.7599%209.33199C16.8911%209.33131%2017.0196%209.36934%2017.1292%209.44133L26.2759%2015.24C26.6426%2015.472%2026.7746%2016%2026.5706%2016.42C26.5065%2016.5582%2026.4042%2016.6752%2026.2759%2016.7573L17.1292%2022.5573C16.7612%2022.7893%2016.2986%2022.6373%2016.0959%2022.2187C16.0314%2022.0877%2015.9985%2021.9433%2015.9999%2021.7973V16Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", z2 = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M16%2016H21.8C21.9467%2016%2022.0934%2016.0333%2022.2214%2016.096C22.64%2016.2987%2022.792%2016.7627%2022.5587%2017.1293L16.76%2026.276C16.6814%2026.4%2016.564%2026.5027%2016.4227%2026.5707C16.004%2026.7747%2015.476%2026.6427%2015.2427%2026.276L9.4427%2017.1293C9.37118%2017.0195%209.33361%2016.891%209.33469%2016.76C9.33469%2016.34%209.7227%2016%2010.2027%2016H16ZM16%2016C15.6934%2016%2015.3987%2015.8587%2015.24%2015.6093L9.44003%206.46266C9.36898%206.3527%209.33188%206.22424%209.33336%206.09333C9.33336%205.67333%209.72136%205.33333%2010.2014%205.33333H21.7987C21.9454%205.33333%2022.092%205.36666%2022.22%205.42933C22.6387%205.63199%2022.7907%206.096%2022.5574%206.46266L16.7587%2015.6093C16.68%2015.7333%2016.5627%2015.836%2016.4214%2015.904C16.288%2015.9693%2016.1427%2016%2016.0014%2016'%20fill='%238BC3F3'/%3e%3c/svg%3e", yt = Yt;
yt.registerExtension({
  name: "vue-basic",
  getCustomWidgets(A) {
    return {
      CUSTOM_VUE_COMPONENT_BASIC(B) {
        const L = {
          name: "custom_vue_component_basic",
          type: "vue-basic"
        }, P = new Zt({
          node: B,
          name: L.name,
          component: h2,
          inputSpec: L,
          options: {}
        });
        return Xt(B, P), { widget: P };
      }
    };
  },
  nodeCreated(A) {
    if (A.constructor.comfyClass !== "vue-basic") return;
    const [B, L] = A.size;
    A.setSize([Math.max(B, 300), Math.max(L, 520)]);
  }
});
yt.registerExtension({
  name: "housekeeper-alignment",
  async setup() {
    try {
      E2();
    } catch {
    }
  },
  nodeCreated(A) {
    A.constructor.comfyClass === "housekeeper-alignment" && (A.setSize([200, 100]), A.title && (A.title = "🎯 Alignment Panel Active"));
  }
});
function E2() {
  let A = null, B = null, L = null, P = !1, m = [], ee = [], j = [], I = 0;
  const $ = "housekeeper-recent-colors", H = 9, Z = ["#353535", "#3f5159", "#593930", "#335533", "#333355", "#335555", "#553355", "#665533", "#000000"];
  let G = zt(), k = null, x = null, E = null;
  const ne = /* @__PURE__ */ new WeakMap(), X = /* @__PURE__ */ new WeakMap();
  let W = null, he = !1;
  const se = 48, we = 24;
  function fe() {
    return document.querySelector("#comfy-menu, .comfyui-menu, .litegraph-menu, .comfyui-toolbar");
  }
  function D() {
    const i = fe();
    if (!i)
      return se;
    const t = i.getBoundingClientRect();
    return !t || t.width === 0 && t.height === 0 ? se : Math.max(se, Math.ceil(t.bottom + 8));
  }
  function U() {
    const i = D(), t = window.innerHeight || document.documentElement.clientHeight || 0, a = Math.max(t - i - we, 280);
    document.documentElement.style.setProperty("--hk-top-offset", `${i}px`), document.documentElement.style.setProperty("--hk-panel-max-height", `${a}px`);
  }
  function Me() {
    if (he || (he = !0, window.addEventListener("resize", U), window.addEventListener("orientationchange", U)), typeof ResizeObserver < "u") {
      const i = fe();
      i && (W ? W.disconnect() : W = new ResizeObserver(() => U()), W.observe(i));
    }
  }
  const Re = [
    { type: "left", icon: f2, label: "Align left edges", group: "basic" },
    { type: "right", icon: d2, label: "Align right edges", group: "basic" },
    { type: "top", icon: g2, label: "Align top edges", group: "basic" },
    { type: "bottom", icon: m2, label: "Align bottom edges", group: "basic" }
  ], Ie = [
    { type: "width-max", icon: v2, label: "Match widest width", group: "size" },
    { type: "width-min", icon: b2, label: "Match narrowest width", group: "size" },
    { type: "height-max", icon: w2, label: "Match tallest height", group: "size" },
    { type: "height-min", icon: y2, label: "Match shortest height", group: "size" },
    { type: "size-max", icon: x2, label: "Match largest size", group: "size" },
    { type: "size-min", icon: C2, label: "Match smallest size", group: "size" }
  ], $e = [
    { type: "horizontal-flow", icon: k2, label: "Distribute horizontally", group: "flow" },
    { type: "vertical-flow", icon: z2, label: "Distribute vertically", group: "flow" }
  ], de = [
    ["#ff6f61", "#ff9a76", "#ffc36a", "#ffe29a", "#ffd6d1", "#ffa69e", "#ff7b89", "#ef5d60", "#c03a53"],
    ["#003f5c", "#2f4b7c", "#376996", "#3f7cac", "#49a3c7", "#56cfe1", "#72efdd", "#80ffdb", "#c0fdfb"],
    ["#2a6041", "#3b7d4f", "#4f945c", "#66ad71", "#81c784", "#a5d6a7", "#dcedc8", "#93b48b", "#6d8b74"],
    ["#150050", "#3f0071", "#610094", "#7b2cbf", "#c77dff", "#ff61d2", "#ff97c1", "#ffcbf2", "#ffe5f1"],
    ["#f6d1c1", "#f5b5c4", "#e9a6c1", "#d4a5e3", "#b4a0e5", "#9fc9eb", "#a7d7c5", "#d5e2b8", "#f1e3a0"],
    ["#3d0c02", "#7f2b0a", "#b3541e", "#d89a54", "#f2d0a9", "#c2956b", "#8c5a45", "#5a3d2b", "#2f1b10"],
    ["#0f0f3d", "#1b1b7d", "#3a0ca3", "#7209b7", "#f72585", "#ff0677", "#ff6d00", "#ff9f1c", "#ffbf69"],
    ["#051937", "#004d7a", "#008793", "#00bf72", "#a8eb12", "#dce35b", "#ffd23f", "#ff9b71", "#ef476f"],
    ["#0d1b2a", "#1b263b", "#274060", "#335c81", "#406e8e", "#4f83a1", "#5f9bbf", "#6faad1", "#8fc0e6"],
    ["#2b193d", "#412271", "#6a4c93", "#9b5de5", "#f15bb5", "#f9a1bc", "#feeafa", "#ffd6e0", "#ffe5f1"]
  ], xe = 4.5, Ce = "#AAAAAA";
  function Ge() {
    const i = "housekeeper-alignment-styles";
    if (document.getElementById(i)) return;
    const t = document.createElement("style");
    t.id = i, t.textContent = `
@import url('https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&display=swap');

:root {
    --hk-accent: #8BC3F3;
    --hk-panel-bg: rgba(24, 26, 32, 0.95);
    --hk-panel-border: rgba(139, 195, 243, 0.35);
    --hk-handle-bg: rgba(32, 35, 42, 0.92);
    --hk-text-strong: #E8F3FF;
    --hk-text-muted: rgba(232, 243, 255, 0.74);
    --hk-top-offset: 48px;
    --hk-panel-max-height: calc(100vh - 96px);
    --hk-panel-width: min(360px, calc(100vw - 24px));
    --hk-button-size: clamp(34px, 7vw, 40px);
    --hk-icon-size: clamp(16px, 4vw, 20px);
    --hk-button-gap: clamp(4px, 1vw, 8px);
    --hk-header-font-size: clamp(18px, 2vw, 22px);
    --hk-body-font-size: clamp(12px, 1.4vw, 14px);
    --hk-subtitle-font-size: clamp(11px, 1.3vw, 13px);
}

.housekeeper-wrapper {
    position: fixed;
    top: var(--hk-top-offset);
    right: clamp(8px, 2vw, 16px);
    display: flex;
    flex-direction: row-reverse;
    align-items: flex-start;
    gap: 12px;
    z-index: 1000;
    pointer-events: none;
}

.housekeeper-handle,
.housekeeper-panel {
    pointer-events: auto;
}

.housekeeper-handle {
    border: 1px solid var(--hk-panel-border);
    background: var(--hk-handle-bg);
    color: var(--hk-accent);
    border-radius: 14px 0 0 14px;
    padding: clamp(12px, 2vh, 16px) clamp(8px, 1.8vw, 10px);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(10px, 2vh, 12px);
    cursor: pointer;
    width: clamp(44px, 7vw, 48px);
    min-height: clamp(140px, 32vh, 200px);
    transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;
    font-family: 'Gloria Hallelujah', cursive;
    font-size: clamp(12px, 2vw, 13px);
    letter-spacing: 0.08em;
    background-image: linear-gradient(160deg, rgba(139, 195, 243, 0.12), rgba(139, 195, 243, 0.05));
}

.housekeeper-handle img {
    width: 26px;
    height: 26px;
}

.housekeeper-handle span {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    transition: transform 0.3s ease;
}

.housekeeper-wrapper.collapsed .housekeeper-handle span {
    transform: rotate(0deg);
}

.housekeeper-handle:focus-visible {
    outline: 2px solid var(--hk-accent);
    outline-offset: 2px;
}

.housekeeper-wrapper.hk-has-selection .housekeeper-handle {
    box-shadow: 0 0 14px rgba(139, 195, 243, 0.35);
}

.housekeeper-panel {
    width: var(--hk-panel-width);
    background: var(--hk-panel-bg);
    border: 1px solid var(--hk-panel-border);
    border-radius: 18px;
    padding: clamp(10px, 1.2vw, 14px) clamp(10px, 1.2vw, 14px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
    color: var(--hk-text-strong);
    font-family: 'Gloria Hallelujah', cursive;
    transform: translateX(110%);
    opacity: 0;
    max-height: var(--hk-panel-max-height);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
}

.housekeeper-wrapper.expanded .housekeeper-panel {
    transform: translateX(0);
    opacity: 1;
}

.housekeeper-wrapper.collapsed .housekeeper-panel {
    pointer-events: none;
}

.housekeeper-content {
    display: flex;
    flex-direction: column;
    gap: 0;
    flex: 1;
    overflow-y: auto;
    padding: 0;
    scrollbar-gutter: stable;
}

.housekeeper-content > * + * {
    margin-top: clamp(6px, 1vw, 12px);
}

.housekeeper-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--hk-accent);
}

.housekeeper-header-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: var(--hk-header-font-size);
    margin: 0;
}

.housekeeper-header-title img {
    width: 24px;
    height: 24px;
}

.housekeeper-close {
    background: transparent;
    border: none;
    color: var(--hk-accent);
    font-size: 24px;
    cursor: pointer;
    line-height: 1;
    transition: transform 0.2s ease;
}

.housekeeper-close:hover {
    transform: scale(1.1);
}

.housekeeper-divider {
    height: 1px;
    background: rgba(139, 195, 243, 0.25);
    width: 100%;
    margin: 2px 0 4px;
}

.housekeeper-divider.housekeeper-divider-spaced {
    margin: clamp(10px, 1.5vw, 16px) 0 clamp(6px, 1vw, 12px);
}

.housekeeper-section {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
}

.housekeeper-section-primary {
    margin-top: 0 !important;
}

.housekeeper-divider + .housekeeper-section-primary {
    margin-top: 0 !important;
}

.housekeeper-subtitle {
    font-size: var(--hk-subtitle-font-size);
    margin: 0;
    color: var(--hk-text-muted);
}

.housekeeper-button-grid {
    display: flex;
    flex-wrap: wrap;
    gap: var(--hk-button-gap);
    padding: clamp(4px, 0.8vw, 6px);
    border-radius: 12px;
    border: 1px solid rgba(139, 195, 243, 0.35);
    background: rgba(22, 24, 29, 0.6);
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    --hk-button-unit: min(var(--hk-button-size), calc((100% - 5 * var(--hk-button-gap)) / 6));
}

.hk-button {
    background: transparent;
    border: none;
    border-radius: 10px;
    flex: 0 0 var(--hk-button-unit);
    aspect-ratio: 1 / 1;
    max-width: var(--hk-button-unit);
    padding: clamp(2px, 0.6vw, 4px);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
    cursor: pointer;
}

.hk-button img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.hk-button:hover:not(:disabled),
.hk-button:focus-visible {
    transform: translateY(-1px);
    background: rgba(139, 195, 243, 0.18);
    outline: none;
}

.hk-button:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
}

.housekeeper-info {
    background: rgba(34, 37, 45, 0.9);
    border-radius: 12px;
    padding: 12px 16px;
    font-size: var(--hk-body-font-size);
    color: var(--hk-text-muted);
    text-align: left;
    line-height: 1.4;
}

.housekeeper-info small {
    display: block;
    margin-top: 6px;
    font-size: 12px;
    opacity: 0.7;
}

.housekeeper-wrapper.expanded .housekeeper-handle {
    display: none;
}

.housekeeper-wrapper.collapsed .housekeeper-handle {
    opacity: 0.85;
}

.housekeeper-color-strip,
.housekeeper-color-footer {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    border: 1px solid rgba(139, 195, 243, 0.35);
    border-radius: 10px;
    background: rgba(22, 24, 29, 0.6);
    width: 100%;
}

.housekeeper-color-recent {
    display: grid;
    grid-template-columns: repeat(9, minmax(0, 1fr));
    gap: 6px;
    padding: 6px 10px;
    border: 1px solid rgba(139, 195, 243, 0.35);
    border-radius: 10px;
    background: rgba(22, 24, 29, 0.6);
}

.housekeeper-color-recent .hk-color-chip {
    width: 100%;
    height: 26px;
}

.housekeeper-custom-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
    color: var(--hk-text-muted);
}

.hk-custom-toggle {
    border: 1px solid rgba(139, 195, 243, 0.35);
    background: rgba(139, 195, 243, 0.12);
    color: var(--hk-accent);
    border-radius: 8px;
    padding: 4px 12px;
    cursor: pointer;
    font-size: 13px;
    transition: background 0.2s ease, transform 0.2s ease;
}

.hk-custom-toggle:hover {
    background: rgba(139, 195, 243, 0.22);
    transform: translateY(-1px);
}

.hk-custom-toggle:focus-visible {
    outline: 2px solid var(--hk-accent);
    outline-offset: 2px;
}

.housekeeper-custom-inline {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 12px;
}

.housekeeper-custom-inline span {
    color: var(--hk-text-muted);
}

.hk-custom-inline-picker {
    width: 48px;
    height: 32px;
    padding: 0;
    border: 1px solid rgba(139, 195, 243, 0.35);
    border-radius: 6px;
    background: transparent;
    cursor: pointer;
}

.hk-custom-hex-inline {
    background: rgba(34, 37, 45, 0.9);
    border: 1px solid rgba(139, 195, 243, 0.35);
    border-radius: 6px;
    padding: 6px 8px;
    color: var(--hk-text-strong);
    font-family: 'Gloria Hallelujah', cursive;
    letter-spacing: 0.04em;
    width: 90px;
}

.hk-custom-hex-inline::placeholder {
    color: rgba(232, 243, 255, 0.45);
}

.hk-custom-preview-inline {
    width: 42px;
    height: 32px;
    border-radius: 8px;
    border: 1px solid rgba(139, 195, 243, 0.35);
}

.housekeeper-color-strip {
    flex: 1;
    flex-wrap: nowrap;
    justify-content: space-between;
}

.housekeeper-color-footer {
    flex-wrap: wrap;
    justify-content: flex-start;
}

.housekeeper-color-carousel {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
}

.hk-palette-arrow {
    width: 24px;
    height: 24px;
    border-radius: 8px;
    border: 1px solid rgba(139, 195, 243, 0.25);
    background: rgba(139, 195, 243, 0.12);
    color: var(--hk-accent);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.2s ease;
    font-size: 14px;
    flex-shrink: 0;
    padding: 0;
}

.hk-palette-arrow:hover {
    background: rgba(139, 195, 243, 0.25);
    transform: translateY(-1px);
}

.hk-palette-arrow:focus-visible {
    outline: 2px solid var(--hk-accent);
    outline-offset: 2px;
}

.hk-color-chip {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 1px solid rgba(139, 195, 243, 0.4);
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    background: transparent;
}

.hk-color-chip:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
}

.hk-color-chip:focus-visible {
    outline: 2px solid var(--hk-accent);
    outline-offset: 2px;
}

.housekeeper-color-strip .hk-color-chip {
    flex: 1;
    min-width: 0;
    max-width: calc((100% - 8 * 4px) / 9);
}

.housekeeper-color-custom-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: var(--hk-body-font-size);
    color: var(--hk-text-muted);
    margin-top: 14px;
}

.hk-toggle-placeholder {
    width: 38px;
    height: 20px;
    border-radius: 12px;
    border: 1px solid rgba(139, 195, 243, 0.35);
    background: rgba(139, 195, 243, 0.08);
    position: relative;
}

.hk-toggle-placeholder::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: rgba(139, 195, 243, 0.85);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.housekeeper-color-picker-placeholder {
    margin-top: 16px;
    border: 1px solid rgba(139, 195, 243, 0.25);
    border-radius: 14px;
    background: linear-gradient(135deg, #ffffff 0%, #ff0000 50%, #000000 100%);
    height: clamp(160px, 32vh, 220px);
    position: relative;
    overflow: hidden;
}

.housekeeper-color-picker-toolbar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 54px;
    background: rgba(16, 17, 21, 0.92);
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 16px;
    color: var(--hk-text-muted);
    font-size: var(--hk-body-font-size);
}

.housekeeper-color-picker-toolbar .hk-swatch {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.65);
}

.housekeeper-color-picker-toolbar .hk-slider-placeholder {
    flex: 1;
    height: 12px;
    border-radius: 8px;
    background: linear-gradient(90deg, red, yellow, lime, cyan, blue, magenta, red);
    box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.35);
}

.hk-rgb-placeholder {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: var(--hk-subtitle-font-size);
}

.hk-rgb-placeholder .hk-rgb-pill {
    width: 36px;
    height: 22px;
    border-radius: 6px;
    border: 1px solid rgba(139, 195, 243, 0.35);
    background: rgba(139, 195, 243, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--hk-text-muted);
    font-family: 'Gloria Hallelujah', cursive;
    letter-spacing: 0.04em;
}
`, document.head.appendChild(t);
  }
  Ge(), Me(), U();
  function F() {
    const i = document.createElement("section");
    return i.className = "housekeeper-section", i;
  }
  function K(i) {
    const t = document.createElement("p");
    return t.className = "housekeeper-subtitle", t.textContent = i, t;
  }
  function J(i, t) {
    const a = document.createElement("div");
    return a.className = `housekeeper-button-grid housekeeper-button-grid-${t}`, i.forEach((s) => {
      a.appendChild(Le(s));
    }), a;
  }
  function Le(i) {
    const t = document.createElement("button");
    t.type = "button", t.className = "hk-button", t.dataset.alignmentType = i.type, t.title = i.label, t.setAttribute("aria-label", i.label);
    const a = document.createElement("img");
    return a.src = i.icon, a.alt = "", a.draggable = !1, t.appendChild(a), t.addEventListener("mouseenter", () => pt(i.type)), t.addEventListener("mouseleave", () => Be()), t.addEventListener("focus", () => pt(i.type)), t.addEventListener("blur", () => Be()), t.addEventListener("click", () => ge(i.type)), t;
  }
  function Qe(i) {
    const t = i.replace("#", "");
    if (t.length === 3) {
      const a = parseInt(t[0] + t[0], 16), s = parseInt(t[1] + t[1], 16), n = parseInt(t[2] + t[2], 16);
      return { r: a, g: s, b: n };
    }
    return t.length === 6 ? {
      r: parseInt(t.slice(0, 2), 16),
      g: parseInt(t.slice(2, 4), 16),
      b: parseInt(t.slice(4, 6), 16)
    } : null;
  }
  function xt(i, t, a) {
    const s = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
    return `#${s(i)}${s(t)}${s(a)}`;
  }
  function et(i) {
    const t = Qe(i);
    if (!t) return null;
    const a = t.r / 255, s = t.g / 255, n = t.b / 255, l = Math.max(a, s, n), u = Math.min(a, s, n), f = l - u;
    let p = 0;
    f !== 0 && (l === a ? p = (s - n) / f % 6 : l === s ? p = (n - a) / f + 2 : p = (a - s) / f + 4), p = Math.round(p * 60), p < 0 && (p += 360);
    const v = (l + u) / 2, b = f === 0 ? 0 : f / (1 - Math.abs(2 * v - 1));
    return { h: p, s: b, l: v };
  }
  function tt(i, t, a) {
    const s = (1 - Math.abs(2 * a - 1)) * t, n = s * (1 - Math.abs(i / 60 % 2 - 1)), l = a - s / 2;
    let u = 0, f = 0, p = 0;
    return 0 <= i && i < 60 ? (u = s, f = n, p = 0) : 60 <= i && i < 120 ? (u = n, f = s, p = 0) : 120 <= i && i < 180 ? (u = 0, f = s, p = n) : 180 <= i && i < 240 ? (u = 0, f = n, p = s) : 240 <= i && i < 300 ? (u = n, f = 0, p = s) : (u = s, f = 0, p = n), xt((u + l) * 255, (f + l) * 255, (p + l) * 255);
  }
  function Ye(i, t) {
    const a = et(i);
    if (!a) return i;
    const s = Math.max(0, Math.min(1, a.l + t));
    return tt(a.h, a.s, s);
  }
  function ke(i) {
    const t = Qe(i);
    return t ? Ct(t) : 0;
  }
  function Ct(i) {
    const t = (a) => {
      const s = a / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * t(i.r) + 0.7152 * t(i.g) + 0.0722 * t(i.b);
  }
  function it(i, t) {
    const a = Math.max(i, t), s = Math.min(i, t);
    return (a + 0.05) / (s + 0.05);
  }
  function pe(i) {
    if (typeof i != "string") return null;
    let t = i.trim();
    return t ? (t.startsWith("#") || (t = `#${t}`), /^#([0-9a-fA-F]{3})$/.test(t) && (t = `#${t[1]}${t[1]}${t[2]}${t[2]}${t[3]}${t[3]}`), /^#([0-9a-fA-F]{6})$/.test(t) ? t.toLowerCase() : null) : null;
  }
  function kt() {
    var a;
    const i = [], t = (a = window.LGraphCanvas) == null ? void 0 : a.node_colors;
    if (t)
      for (const s of Object.keys(t)) {
        const n = t[s], l = (n == null ? void 0 : n.bgcolor) || (n == null ? void 0 : n.color) || (n == null ? void 0 : n.groupcolor), u = pe(l);
        if (u && !i.includes(u) && i.push(u), i.length >= H) break;
      }
    return i.length || Z.forEach((s) => {
      const n = pe(s);
      n && !i.includes(n) && i.length < H && i.push(n);
    }), i.slice(0, H);
  }
  function zt() {
    var i;
    try {
      const t = (i = window.localStorage) == null ? void 0 : i.getItem($);
      if (t) {
        const a = JSON.parse(t);
        if (Array.isArray(a)) {
          const s = a.map((n) => pe(n)).filter((n) => !!n);
          if (s.length)
            return s.slice(0, H);
        }
      }
    } catch {
    }
    return kt();
  }
  function Et(i) {
    var t;
    try {
      (t = window.localStorage) == null || t.setItem($, JSON.stringify(i));
    } catch {
    }
  }
  function rt() {
    k && (k.replaceChildren(), G.forEach((i) => {
      const t = lt(i);
      k.appendChild(t);
    }));
  }
  function at(i) {
    pe(i);
  }
  function ot(i) {
    const t = pe(i);
    t && (x && (x.value = t), E && (E.value = t.toUpperCase()), at(t));
  }
  function St(i) {
    const t = pe(i);
    t && (G = [t, ...G.filter((a) => a !== t)], G.length > H && (G.length = H), Et(G), rt(), ot(t));
  }
  function Ze(i) {
    const t = pe(i);
    t && (nt(t), ze());
  }
  function At(i) {
    const t = ke(i), a = ke(Ce);
    let s = it(t, a);
    if (s >= xe) return i;
    const n = et(i);
    if (!n) return i;
    const l = t > a ? -1 : 1;
    let u = n.l, f = l > 0 ? 0.98 : 0.02, p = i, v = s;
    for (let b = 0; b < 12; b++) {
      const z = u + (f - u) * 0.5, R = tt(n.h, n.s, Math.max(0.02, Math.min(0.98, z))), Y = ke(R), T = it(Y, a);
      T >= xe ? (p = R, v = T, l > 0 ? u = z : f = z) : l > 0 ? f = z : u = z;
    }
    return v >= xe ? p : i;
  }
  function st(i, t, a, s = 6) {
    let n = t, l = 0;
    for (; Math.abs(ke(i) - ke(n)) < 0.08 && l < s; ) {
      const u = Ye(n, a);
      if (u === n) break;
      n = u, l += 1;
    }
    return n;
  }
  function ye(i) {
    const a = i.startsWith("#") ? i : `#${i}`;
    let s = At(a), n = Ye(s, -0.16), l = Ye(s, 0.12);
    return n = st(s, n, -0.08), l = st(s, l, 0.08), {
      color: n,
      bgcolor: s,
      groupcolor: l
    };
  }
  function nt(i) {
    var l, u, f;
    const t = [...m, ...ee];
    if (!t.length) {
      me("Select nodes or groups to apply color", "warning");
      return;
    }
    const a = ye(i), s = /* @__PURE__ */ new Set();
    t.forEach((p) => {
      p != null && p.graph && s.add(p.graph);
    }), s.forEach((p) => {
      var v;
      return (v = p == null ? void 0 : p.beforeChange) == null ? void 0 : v.call(p);
    }), t.forEach((p) => {
      Xe(p, a);
    }), s.forEach((p) => {
      var v;
      return (v = p == null ? void 0 : p.afterChange) == null ? void 0 : v.call(p);
    }), St(a.bgcolor);
    const n = ((l = window.LGraphCanvas) == null ? void 0 : l.active_canvas) ?? ((u = window.app) == null ? void 0 : u.canvas);
    (f = n == null ? void 0 : n.setDirty) == null || f.call(n, !0, !0);
  }
  function Xe(i, t) {
    typeof i.setColorOption == "function" ? i.setColorOption(t) : (i.color = t.color, i.bgcolor = t.bgcolor, i.groupcolor = t.groupcolor);
  }
  function Ne(i) {
    var t;
    q.active && ((t = q.colorOption) == null ? void 0 : t.bgcolor) === i.bgcolor || (q.active = !0, q.colorOption = i, q.nodes.clear(), q.groups.clear(), m.forEach((a) => {
      q.nodes.set(a, {
        color: a.color,
        bgcolor: a.bgcolor,
        groupcolor: a.groupcolor
      });
    }), ee.forEach((a) => {
      q.groups.set(a, {
        color: a.color
      });
    }));
  }
  function We(i) {
    var a, s, n;
    m.forEach((l) => Xe(l, i)), ee.forEach((l) => Xe(l, i));
    const t = ((a = window.LGraphCanvas) == null ? void 0 : a.active_canvas) ?? ((s = window.app) == null ? void 0 : s.canvas);
    (n = t == null ? void 0 : t.setDirty) == null || n.call(t, !0, !0);
  }
  function ze() {
    var a, s, n;
    if (!q.active) return;
    let i;
    for (const l of q.nodes.values())
      if (l.bgcolor) {
        i = l.bgcolor;
        break;
      }
    if (!i) {
      for (const l of q.groups.values())
        if (l.color) {
          i = l.color;
          break;
        }
    }
    q.nodes.forEach((l, u) => {
      u && (typeof u.setColorOption == "function" ? u.setColorOption({
        color: l.color ?? u.color,
        bgcolor: l.bgcolor ?? u.bgcolor,
        groupcolor: l.groupcolor ?? u.groupcolor
      }) : (u.color = l.color, u.bgcolor = l.bgcolor, u.groupcolor = l.groupcolor));
    }), q.groups.forEach((l, u) => {
      u && (typeof u.setColorOption == "function" ? u.setColorOption({
        color: l.color ?? u.color,
        bgcolor: l.color ?? u.bgcolor,
        groupcolor: l.color ?? u.groupcolor
      }) : u.color = l.color);
    }), q.active = !1, q.colorOption = null;
    const t = ((a = window.LGraphCanvas) == null ? void 0 : a.active_canvas) ?? ((s = window.app) == null ? void 0 : s.canvas);
    (n = t == null ? void 0 : t.setDirty) == null || n.call(t, !0, !0);
  }
  function _t(i, t) {
    const a = (s) => {
      s == null || s.preventDefault(), nt(t), q.active = !1, q.colorOption = null, q.nodes.clear(), q.groups.clear();
    };
    i.addEventListener("click", a), i.addEventListener("keydown", (s) => {
      (s.key === "Enter" || s.key === " ") && (s.preventDefault(), a());
    }), i.addEventListener("mouseenter", () => {
      const s = ye(t);
      Ne(s), We(s);
    }), i.addEventListener("focus", () => {
      const s = ye(t);
      Ne(s), We(s);
    }), i.addEventListener("mouseleave", () => ze()), i.addEventListener("blur", () => ze());
  }
  function lt(i, t = !0) {
    const a = ye(i), s = a.bgcolor.toUpperCase(), n = document.createElement(t ? "button" : "div");
    return t && (n.type = "button", n.setAttribute("aria-label", `Apply color ${s}`), n.title = `Apply color ${s}`), n.className = "hk-color-chip", n.style.background = a.bgcolor, n.style.borderColor = a.color, n.dataset.colorHex = a.bgcolor, t && _t(n, i), n;
  }
  function ct(i, t) {
    if (!de.length) return;
    const a = de.length, s = (t % a + a) % a;
    I = s;
    const n = de[s];
    i.replaceChildren(), n.forEach((l) => {
      const u = lt(l);
      i.appendChild(u);
    }), i.setAttribute("aria-label", `Color harmony palette ${s + 1} of ${a}`);
  }
  function Mt() {
    A && (U(), P = !0, A.classList.remove("collapsed"), A.classList.add("expanded"), setTimeout(() => {
      B == null || B.focus();
    }, 0));
  }
  function Lt() {
    A && (P = !1, A.classList.remove("expanded"), A.classList.add("collapsed"), L == null || L.focus());
  }
  function je(i) {
    (typeof i == "boolean" ? i : !P) ? Mt() : Lt();
  }
  function Nt() {
    if (B) return;
    A = document.createElement("div"), A.className = "housekeeper-wrapper collapsed", L = document.createElement("button"), L.type = "button", L.className = "housekeeper-handle", L.title = "Toggle Housekeeper panel (Ctrl+Shift+H)";
    const i = document.createElement("img");
    i.src = vt, i.alt = "", i.draggable = !1, L.appendChild(i);
    const t = document.createElement("span");
    t.textContent = "Housekeeper", L.appendChild(t), L.addEventListener("click", () => je()), B = document.createElement("div"), B.className = "housekeeper-panel", B.setAttribute("role", "region"), B.setAttribute("aria-label", "Housekeeper alignment tools"), B.tabIndex = -1;
    const a = document.createElement("div");
    a.className = "housekeeper-content";
    const s = document.createElement("div");
    s.className = "housekeeper-header";
    const n = document.createElement("div");
    n.className = "housekeeper-header-title";
    const l = document.createElement("img");
    l.src = vt, l.alt = "", l.draggable = !1, n.appendChild(l);
    const u = document.createElement("span");
    u.textContent = "Housekeeper", n.appendChild(u);
    const f = document.createElement("button");
    f.type = "button", f.className = "housekeeper-close", f.setAttribute("aria-label", "Hide Housekeeper panel"), f.innerHTML = "&times;", f.addEventListener("click", () => je(!1)), s.appendChild(n), s.appendChild(f);
    const p = document.createElement("div");
    p.className = "housekeeper-divider";
    const v = F();
    v.classList.add("housekeeper-section-primary"), v.appendChild(K("Basic Alignment")), v.appendChild(J(Re, "basic")), v.appendChild(K("Size Adjustment")), v.appendChild(J(Ie, "size")), v.appendChild(K("Flow Alignment")), v.appendChild(J($e, "flow"));
    const b = F();
    b.appendChild(K("Preset palettes"));
    const z = document.createElement("div");
    z.className = "housekeeper-color-carousel";
    const R = document.createElement("button");
    R.type = "button", R.className = "hk-palette-arrow hk-palette-arrow-prev", R.innerHTML = "&#9664;";
    const Y = document.createElement("div");
    Y.className = "housekeeper-color-strip", Y.setAttribute("role", "group");
    const T = document.createElement("button");
    T.type = "button", T.className = "hk-palette-arrow hk-palette-arrow-next", T.innerHTML = "&#9654;", z.appendChild(R), z.appendChild(Y), z.appendChild(T), b.appendChild(z);
    const h = () => {
      const o = de.length, c = (I - 1 + o) % o, y = (I + 1) % o;
      R.setAttribute("aria-label", `Show color set ${c + 1} of ${o}`), T.setAttribute("aria-label", `Show color set ${y + 1} of ${o}`);
    }, C = (o) => {
      const c = de.length;
      c && (I = (I + o + c) % c, ct(Y, I), h());
    };
    R.addEventListener("click", () => C(-1)), T.addEventListener("click", () => C(1)), ct(Y, I), h();
    const r = document.createElement("div");
    r.className = "housekeeper-custom-inline";
    const _ = document.createElement("span");
    _.textContent = "Custom", r.appendChild(_), x = document.createElement("input"), x.type = "color", x.className = "hk-custom-inline-picker", r.appendChild(x), E = document.createElement("input"), E.type = "text", E.placeholder = "#RRGGBB", E.maxLength = 7, E.className = "hk-custom-hex-inline", r.appendChild(E), b.appendChild(r), b.appendChild(K("Recent colors")), k = document.createElement("div"), k.className = "housekeeper-color-recent", rt(), b.appendChild(k);
    const O = G[0] || Z[0];
    ot(O);
    const le = (o, c) => {
      const y = pe(o);
      if (!y || (c === "color" && E && (E.value = y.toUpperCase()), c === "text" && x && (x.value = y), at(y), !m.length && !ee.length)) return;
      const S = ye(y);
      Ne(S), We(S);
    };
    x == null || x.addEventListener("input", () => le(x.value, "color")), x == null || x.addEventListener("change", () => Ze(x.value)), x == null || x.addEventListener("click", () => Ne(ye(x.value))), x == null || x.addEventListener("blur", () => ze()), E == null || E.addEventListener("input", () => le(E.value, "text")), E == null || E.addEventListener("keydown", (o) => {
      o.key === "Enter" && (o.preventDefault(), Ze(E.value));
    }), E == null || E.addEventListener("blur", () => ze());
    const ue = () => Ze((E == null ? void 0 : E.value) || (x == null ? void 0 : x.value) || O);
    r.addEventListener("keydown", (o) => {
      (o.metaKey || o.ctrlKey) && o.key.toLowerCase() === "enter" && (o.preventDefault(), ue());
    }), r.addEventListener("dblclick", () => ue()), a.appendChild(s), a.appendChild(p), a.appendChild(v);
    const ie = document.createElement("div");
    ie.className = "housekeeper-divider housekeeper-divider-spaced", a.appendChild(ie), a.appendChild(b), B.appendChild(a), A.appendChild(L), A.appendChild(B), document.body.appendChild(A), Me(), U();
  }
  function pt(i) {
    var s;
    if (m.length < 2) return;
    Be();
    const t = (s = window.app) == null ? void 0 : s.canvas;
    if (!t) return;
    Bt(i, m).forEach((n, l) => {
      if (n && m[l]) {
        const u = document.createElement("div");
        u.style.cssText = `
                    position: fixed;
                    background: rgba(74, 144, 226, 0.3);
                    border: 2px dashed rgba(74, 144, 226, 0.7);
                    border-radius: 4px;
                    z-index: 999;
                    pointer-events: none;
                    transition: all 0.2s ease;
                `;
        const f = (n.x + t.ds.offset[0]) * t.ds.scale, p = (n.y + t.ds.offset[1]) * t.ds.scale, v = t.canvas.parentElement, b = t.canvas.getBoundingClientRect(), z = v ? v.getBoundingClientRect() : null;
        z && b.top - z.top, b.top;
        const R = document.querySelector("nav");
        let Y = 31;
        R && (Y = R.getBoundingClientRect().height);
        const T = Y * t.ds.scale, h = b.left + f, C = b.top + p - T, r = n.width * t.ds.scale, _ = n.height * t.ds.scale;
        u.style.left = h + "px", u.style.top = C + "px", u.style.width = r + "px", u.style.height = _ + "px", document.body.appendChild(u), j.push(u);
      }
    });
  }
  function Be() {
    j.forEach((i) => {
      i.parentNode && i.parentNode.removeChild(i);
    }), j = [];
  }
  function Bt(i, t) {
    if (t.length < 2) return [];
    const a = [], s = Math.min(...t.map((f) => f.pos[0])), n = Math.max(...t.map((f) => {
      let p = 150;
      return f.size && Array.isArray(f.size) && f.size[0] ? p = f.size[0] : typeof f.width == "number" ? p = f.width : f.properties && typeof f.properties.width == "number" && (p = f.properties.width), f.pos[0] + p;
    })), l = Math.min(...t.map((f) => f.pos[1])), u = Math.max(...t.map((f) => {
      let p = 100;
      return f.size && Array.isArray(f.size) && f.size[1] ? p = f.size[1] : typeof f.height == "number" ? p = f.height : f.properties && typeof f.properties.height == "number" && (p = f.properties.height), f.pos[1] + p;
    }));
    switch (i) {
      case "left":
        const f = [...t].sort((e, g) => e.pos[1] - g.pos[1]);
        let p = f[0].pos[1];
        const v = /* @__PURE__ */ new Map();
        f.forEach((e) => {
          let g = 100, w = 150;
          e.size && Array.isArray(e.size) ? (e.size[1] && (g = e.size[1]), e.size[0] && (w = e.size[0])) : (typeof e.height == "number" && (g = e.height), typeof e.width == "number" && (w = e.width), e.properties && (typeof e.properties.height == "number" && (g = e.properties.height), typeof e.properties.width == "number" && (w = e.properties.width))), v.set(e.id, {
            x: s,
            y: p,
            width: w,
            height: g
          }), p += g + 30;
        }), t.forEach((e) => {
          a.push(v.get(e.id));
        });
        break;
      case "right":
        const b = [...t].sort((e, g) => e.pos[1] - g.pos[1]);
        let z = b[0].pos[1];
        const R = /* @__PURE__ */ new Map();
        b.forEach((e) => {
          let g = 100, w = 150;
          e.size && Array.isArray(e.size) ? (e.size[1] && (g = e.size[1]), e.size[0] && (w = e.size[0])) : (typeof e.height == "number" && (g = e.height), typeof e.width == "number" && (w = e.width), e.properties && (typeof e.properties.height == "number" && (g = e.properties.height), typeof e.properties.width == "number" && (w = e.properties.width))), R.set(e.id, {
            x: n - w,
            y: z,
            width: w,
            height: g
          }), z += g + 30;
        }), t.forEach((e) => {
          a.push(R.get(e.id));
        });
        break;
      case "top":
        const Y = [...t].sort((e, g) => e.pos[0] - g.pos[0]);
        let T = Y[0].pos[0];
        const h = /* @__PURE__ */ new Map();
        Y.forEach((e) => {
          let g = 100, w = 150;
          e.size && Array.isArray(e.size) ? (e.size[1] && (g = e.size[1]), e.size[0] && (w = e.size[0])) : (typeof e.height == "number" && (g = e.height), typeof e.width == "number" && (w = e.width), e.properties && (typeof e.properties.height == "number" && (g = e.properties.height), typeof e.properties.width == "number" && (w = e.properties.width))), h.set(e.id, {
            x: T,
            y: l,
            width: w,
            height: g
          }), T += w + 30;
        }), t.forEach((e) => {
          a.push(h.get(e.id));
        });
        break;
      case "bottom":
        const C = [...t].sort((e, g) => e.pos[0] - g.pos[0]);
        let r = s;
        const _ = /* @__PURE__ */ new Map();
        C.forEach((e) => {
          let g = 100, w = 150;
          e.size && Array.isArray(e.size) ? (e.size[1] && (g = e.size[1]), e.size[0] && (w = e.size[0])) : (typeof e.height == "number" && (g = e.height), typeof e.width == "number" && (w = e.width), e.properties && (typeof e.properties.height == "number" && (g = e.properties.height), typeof e.properties.width == "number" && (w = e.properties.width))), _.set(e.id, {
            x: r,
            y: u - g,
            width: w,
            height: g
          }), r += w + 30;
        }), t.forEach((e) => {
          a.push(_.get(e.id));
        });
        break;
      case "horizontal-flow":
        const O = t.filter((e) => {
          if (!e) return !1;
          const g = e.pos || e.position || typeof e.x == "number" && typeof e.y == "number", w = e.size || e.width || e.height || typeof e.width == "number" && typeof e.height == "number";
          return !!g && !!w;
        });
        if (O.length < 2) break;
        const le = Math.min(...O.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[0] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[0] : typeof e.x == "number" ? e.x : 0)), ue = Math.min(...O.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[1] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[1] : typeof e.y == "number" ? e.y : 0)), ie = O.map((e) => ({
          ...e,
          pos: e.pos ? [...e.pos] : [e.x || 0, e.y || 0],
          _calculatedSize: e.size && Array.isArray(e.size) ? [e.size[0], e.size[1]] : [e.width || 150, e.height || 100]
        })), o = De(ie), c = Oe(ie, o), y = 30, S = 30, M = 5, ve = {};
        ie.forEach((e) => {
          var g;
          if (e && e.id) {
            const w = ((g = c[e.id]) == null ? void 0 : g.level) ?? 0;
            ve[w] || (ve[w] = []), ve[w].push(e);
          }
        });
        const Pe = /* @__PURE__ */ new Map();
        Object.entries(ve).forEach(([e, g]) => {
          const w = parseInt(e);
          if (g && g.length > 0) {
            g.sort((d, V) => {
              const oe = d && d.id && c[d.id] ? c[d.id].order : 0, N = V && V.id && c[V.id] ? c[V.id].order : 0;
              return oe - N;
            });
            let re = le;
            if (w > 0)
              for (let d = 0; d < w; d++) {
                const V = ve[d] || [], oe = Math.max(...V.map(
                  (N) => N && N._calculatedSize && N._calculatedSize[0] ? N._calculatedSize[0] : 150
                ));
                re += oe + y + M;
              }
            let ae = ue;
            g.forEach((d) => {
              d && d._calculatedSize && (Pe.set(d.id, {
                x: re,
                y: ae,
                width: d._calculatedSize[0],
                height: d._calculatedSize[1]
              }), ae += d._calculatedSize[1] + S);
            });
          }
        }), t.forEach((e) => {
          const g = Pe.get(e.id);
          g && a.push(g);
        });
        break;
      case "vertical-flow":
        const Te = t.filter((e) => {
          if (!e) return !1;
          const g = e.pos || e.position || typeof e.x == "number" && typeof e.y == "number", w = e.size || e.width || e.height || typeof e.width == "number" && typeof e.height == "number";
          return !!g && !!w;
        });
        if (Te.length < 2) break;
        const Ft = Math.min(...Te.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[0] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[0] : typeof e.x == "number" ? e.x : 0)), Vt = Math.min(...Te.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[1] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[1] : typeof e.y == "number" ? e.y : 0)), Ue = Te.map((e) => ({
          ...e,
          pos: e.pos ? [...e.pos] : [e.x || 0, e.y || 0],
          _calculatedSize: e.size && Array.isArray(e.size) ? [e.size[0], e.size[1]] : [e.width || 150, e.height || 100]
        })), Rt = De(Ue), Ee = Oe(Ue, Rt), It = 30, $t = 30, Gt = 5, Se = {};
        Ue.forEach((e) => {
          var g;
          if (e && e.id) {
            const w = ((g = Ee[e.id]) == null ? void 0 : g.level) ?? 0;
            Se[w] || (Se[w] = []), Se[w].push(e);
          }
        });
        const ht = /* @__PURE__ */ new Map();
        Object.entries(Se).forEach(([e, g]) => {
          const w = parseInt(e);
          if (g && g.length > 0) {
            g.sort((d, V) => {
              const oe = d && d.id && Ee[d.id] ? Ee[d.id].order : 0, N = V && V.id && Ee[V.id] ? Ee[V.id].order : 0;
              return oe - N;
            });
            let re = Vt;
            if (w > 0)
              for (let d = 0; d < w; d++) {
                const V = Se[d] || [], oe = Math.max(...V.map(
                  (N) => N && N._calculatedSize && N._calculatedSize[1] ? N._calculatedSize[1] : 100
                ));
                re += oe + It + Gt;
              }
            let ae = Ft;
            g.forEach((d) => {
              d && d._calculatedSize && (ht.set(d.id, {
                x: ae,
                y: re,
                width: d._calculatedSize[0],
                height: d._calculatedSize[1]
              }), ae += d._calculatedSize[0] + $t);
            });
          }
        }), t.forEach((e) => {
          const g = ht.get(e.id);
          g && a.push(g);
        });
        break;
      case "width-max":
      case "width-min":
      case "height-max":
      case "height-min":
      case "size-max":
      case "size-min":
        t.forEach((e) => {
          let g = 150, w = 100;
          e.size && Array.isArray(e.size) ? (e.size[0] && (g = e.size[0]), e.size[1] && (w = e.size[1])) : (typeof e.width == "number" && (g = e.width), typeof e.height == "number" && (w = e.height), e.properties && (typeof e.properties.width == "number" && (g = e.properties.width), typeof e.properties.height == "number" && (w = e.properties.height)));
          let re = g, ae = w;
          if (i === "width-max" || i === "size-max")
            re = Math.max(...t.map((d) => d.size && Array.isArray(d.size) && d.size[0] ? d.size[0] : typeof d.width == "number" ? d.width : d.properties && typeof d.properties.width == "number" ? d.properties.width : 150));
          else if (i === "width-min")
            re = Math.min(...t.map((d) => d.size && Array.isArray(d.size) && d.size[0] ? d.size[0] : typeof d.width == "number" ? d.width : d.properties && typeof d.properties.width == "number" ? d.properties.width : 150));
          else if (i === "size-min") {
            const d = X.get(e) || e.computeSize;
            if (d)
              try {
                const V = d.call(e);
                V && V.length >= 2 && V[0] !== void 0 && V[1] !== void 0 ? (re = V[0], ae = V[1] + 30) : typeof V == "number" ? (re = g, ae = V + 30) : (re = g, ae = w);
              } catch {
                re = g, ae = w;
              }
          }
          if (i === "height-max" || i === "size-max")
            ae = Math.max(...t.map((d) => d.size && Array.isArray(d.size) && d.size[1] ? d.size[1] : typeof d.height == "number" ? d.height : d.properties && typeof d.properties.height == "number" ? d.properties.height : 100));
          else if (i === "height-min") {
            const d = Math.min(...t.map((N) => N.size && N.size[1] !== void 0 ? N.size[1] : typeof N.height == "number" ? N.height : N.properties && typeof N.properties.height == "number" ? N.properties.height : 100)), V = X.get(e) || e.computeSize;
            let oe = null;
            if (V)
              try {
                const N = V.call(e);
                N && N.length >= 2 && N[1] !== void 0 ? oe = N[1] + 30 : typeof N == "number" && (oe = N + 30);
              } catch {
              }
            ae = oe && oe > d ? oe : d;
          }
          a.push({
            x: e.pos[0],
            y: e.pos[1],
            width: re,
            height: ae
          });
        });
        break;
    }
    return a;
  }
  function He() {
    var l;
    if (!((l = window.app) != null && l.graph)) return;
    const i = window.app.graph;
    m = Object.values(i._nodes || {}).filter((u) => u && u.is_selected), ee = (Array.isArray(i._groups) ? i._groups : []).filter((u) => u && u.selected);
    const s = m.length > 1;
    m.length + ee.length, s || Be(), A && A.classList.toggle("hk-has-selection", s);
    const n = B == null ? void 0 : B.querySelectorAll(".hk-button");
    n == null || n.forEach((u) => {
      u.disabled = !s;
    });
  }
  function De(i) {
    const t = {}, a = i.filter((s) => s && (s.id !== void 0 || s.id !== null));
    return a.forEach((s) => {
      const n = s.id || `node_${a.indexOf(s)}`;
      s.id = n, t[n] = { inputs: [], outputs: [] }, s.inputs && Array.isArray(s.inputs) && s.inputs.forEach((l, u) => {
        l && l.link !== null && l.link !== void 0 && t[n].inputs.push({
          index: u,
          link: l.link,
          sourceNode: Ht(l.link, a)
        });
      }), s.outputs && Array.isArray(s.outputs) && s.outputs.forEach((l, u) => {
        l && l.links && Array.isArray(l.links) && l.links.length > 0 && l.links.forEach((f) => {
          const p = Dt(f, a);
          p && t[n].outputs.push({
            index: u,
            link: f,
            targetNode: p
          });
        });
      });
    }), t;
  }
  function Ht(i, t) {
    for (const a of t)
      if (a && a.outputs && Array.isArray(a.outputs)) {
        for (const s of a.outputs)
          if (s && s.links && Array.isArray(s.links) && s.links.includes(i))
            return a;
      }
    return null;
  }
  function Dt(i, t) {
    for (const a of t)
      if (a && a.inputs && Array.isArray(a.inputs)) {
        for (const s of a.inputs)
          if (s && s.link === i)
            return a;
      }
    return null;
  }
  function Oe(i, t) {
    const a = {}, s = /* @__PURE__ */ new Set(), n = i.filter((p) => p && p.id), l = n.filter((p) => {
      const v = p.id;
      return !t[v] || !t[v].inputs.length || t[v].inputs.every((b) => !b.sourceNode);
    });
    l.length === 0 && n.length > 0 && l.push(n[0]);
    const u = l.map((p) => ({ node: p, level: 0 }));
    for (; u.length > 0; ) {
      const { node: p, level: v } = u.shift();
      !p || !p.id || s.has(p.id) || (s.add(p.id), a[p.id] = { level: v, order: 0 }, t[p.id] && t[p.id].outputs && t[p.id].outputs.forEach((b) => {
        b && b.targetNode && b.targetNode.id && !s.has(b.targetNode.id) && u.push({ node: b.targetNode, level: v + 1 });
      }));
    }
    n.forEach((p) => {
      p && p.id && !a[p.id] && (a[p.id] = { level: 0, order: 0 });
    });
    const f = {};
    return Object.entries(a).forEach(([p, v]) => {
      f[v.level] || (f[v.level] = []);
      const b = n.find((z) => z && z.id === p);
      b && f[v.level].push(b);
    }), Object.entries(f).forEach(([p, v]) => {
      v && v.length > 0 && (v.sort((b, z) => {
        const R = b && b.pos && b.pos[1] ? b.pos[1] : 0, Y = z && z.pos && z.pos[1] ? z.pos[1] : 0;
        return R - Y;
      }), v.forEach((b, z) => {
        b && b.id && a[b.id] && (a[b.id].order = z);
      }));
    }), a;
  }
  function ge(i) {
    var t, a, s, n, l;
    if (m.length < 2) {
      me("Please select at least 2 nodes to align", "warning");
      return;
    }
    try {
      const u = Math.min(...m.map((h) => h.pos[0])), f = Math.max(...m.map((h) => {
        let C = 150;
        return h.size && Array.isArray(h.size) && h.size[0] ? C = h.size[0] : typeof h.width == "number" ? C = h.width : h.properties && typeof h.properties.width == "number" && (C = h.properties.width), h.pos[0] + C;
      })), p = Math.min(...m.map((h) => h.pos[1])), v = Math.max(...m.map((h) => {
        let C = 100;
        return h.size && Array.isArray(h.size) && h.size[1] ? C = h.size[1] : typeof h.height == "number" ? C = h.height : h.properties && typeof h.properties.height == "number" && (C = h.properties.height), h.pos[1] + C;
      })), b = Math.max(...m.map((h) => {
        const C = ne.get(h);
        if (C && C.width !== void 0) return C.width;
        let r = 150;
        return h.size && Array.isArray(h.size) && h.size[0] ? r = h.size[0] : typeof h.width == "number" ? r = h.width : h.properties && typeof h.properties.width == "number" && (r = h.properties.width), r;
      })), z = Math.min(...m.map((h) => {
        const C = ne.get(h);
        if (C && C.width !== void 0) return C.width;
        let r = 150;
        return h.size && Array.isArray(h.size) && h.size[0] ? r = h.size[0] : typeof h.width == "number" ? r = h.width : h.properties && typeof h.properties.width == "number" && (r = h.properties.width), r;
      })), R = Math.max(...m.map((h) => {
        const C = ne.get(h);
        return C && C.height !== void 0 ? C.height : h.size && h.size[1] !== void 0 ? h.size[1] : typeof h.height == "number" ? h.height : h.properties && typeof h.properties.height == "number" ? h.properties.height : 100;
      })), Y = Math.min(...m.map((h) => h.size && h.size[1] !== void 0 ? h.size[1] : typeof h.height == "number" ? h.height : h.properties && typeof h.properties.height == "number" ? h.properties.height : 100));
      let T;
      switch (i) {
        case "left":
          T = u;
          const h = [...m].sort((o, c) => o.pos[1] - c.pos[1]);
          let C = h[0].pos[1];
          h.forEach((o, c) => {
            let S = 100;
            o.size && Array.isArray(o.size) && o.size[1] ? S = o.size[1] : typeof o.height == "number" ? S = o.height : o.properties && typeof o.properties.height == "number" && (S = o.properties.height), o.pos[0] = T, o.pos[1] = C, typeof o.x == "number" && (o.x = o.pos[0]), typeof o.y == "number" && (o.y = o.pos[1]), C += S + 30;
          });
          break;
        case "right":
          T = f;
          const r = [...m].sort((o, c) => o.pos[1] - c.pos[1]);
          let _ = r[0].pos[1];
          r.forEach((o, c) => {
            let S = 100, M = 150;
            o.size && Array.isArray(o.size) ? (o.size[1] && (S = o.size[1]), o.size[0] && (M = o.size[0])) : (typeof o.height == "number" && (S = o.height), typeof o.width == "number" && (M = o.width), o.properties && (typeof o.properties.height == "number" && (S = o.properties.height), typeof o.properties.width == "number" && (M = o.properties.width))), o.pos[0] = T - M, o.pos[1] = _, typeof o.x == "number" && (o.x = o.pos[0]), typeof o.y == "number" && (o.y = o.pos[1]), _ += S + 30;
          });
          break;
        case "top":
          T = p;
          const O = [...m].sort((o, c) => o.pos[0] - c.pos[0]);
          let le = O[0].pos[0];
          O.forEach((o, c) => {
            let S = 150;
            o.size && Array.isArray(o.size) && o.size[0] ? S = o.size[0] : typeof o.width == "number" ? S = o.width : o.properties && typeof o.properties.width == "number" && (S = o.properties.width), o.pos[1] = T, o.pos[0] = le, typeof o.x == "number" && (o.x = o.pos[0]), typeof o.y == "number" && (o.y = o.pos[1]), le += S + 30;
          });
          break;
        case "bottom":
          T = v;
          const ue = [...m].sort((o, c) => o.pos[0] - c.pos[0]);
          let ie = u;
          ue.forEach((o, c) => {
            let S = 150, M = 100;
            o.size && Array.isArray(o.size) ? (o.size[0] && (S = o.size[0]), o.size[1] && (M = o.size[1])) : (typeof o.width == "number" && (S = o.width), typeof o.height == "number" && (M = o.height), o.properties && (typeof o.properties.width == "number" && (S = o.properties.width), typeof o.properties.height == "number" && (M = o.properties.height)));
            const ve = T - M, Pe = ie;
            o.pos[1] = ve, o.pos[0] = Pe, typeof o.x == "number" && (o.x = o.pos[0]), typeof o.y == "number" && (o.y = o.pos[1]), ie += S + 30;
          });
          break;
        case "width-max":
          m.forEach((o) => {
            o.size && (o.size[0] = b);
          });
          break;
        case "width-min":
          m.forEach((o) => {
            o.size && (o.size[0] = z);
          });
          break;
        case "height-max":
          m.forEach((o) => {
            o.size && (o.size[1] = R);
          });
          break;
        case "height-min":
          m.forEach((o) => {
            if (o.size) {
              const c = X.get(o) || o.computeSize;
              if (c) {
                const y = c.call(o);
                o.size[1] = Math.max(Y, y[1]);
              }
            }
          });
          break;
        case "size-max":
          m.forEach((o) => {
            o.size && (o.size[0] = b, o.size[1] = R);
          });
          break;
        case "size-min":
          m.forEach((o) => {
            if (o.size) {
              const c = X.get(o) || o.computeSize;
              if (c) {
                const y = c.call(o);
                o.size[0] = y[0], o.size[1] = y[1];
              }
            }
          });
          break;
        case "horizontal-flow":
          Ot();
          return;
        // Don't continue to the success message at the bottom
        case "vertical-flow":
          Pt();
          return;
      }
      try {
        (a = (t = window.app) == null ? void 0 : t.canvas) != null && a.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (n = (s = window.app) == null ? void 0 : s.graph) != null && n.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (l = window.app) != null && l.canvas && window.app.canvas.draw(!0, !0);
      } catch {
      }
    } catch {
      me("Error during alignment", "error");
    }
  }
  function S2(i) {
  }
  function Ot() {
    var i, t, a, s, n;
    try {
      const l = m.filter((r) => {
        if (!r) return !1;
        const _ = r.pos || r.position || typeof r.x == "number" && typeof r.y == "number", O = r.size || r.width || r.height || typeof r.width == "number" && typeof r.height == "number";
        return !!_ && !!O;
      });
      if (l.length < 2) {
        me(`Not enough valid nodes: ${l.length}/${m.length} nodes are valid`, "warning");
        return;
      }
      const u = Math.min(...l.map((r) => r.pos && (Array.isArray(r.pos) || r.pos.length !== void 0) ? r.pos[0] : r.position && (Array.isArray(r.position) || r.position.length !== void 0) ? r.position[0] : typeof r.x == "number" ? r.x : 0)), f = Math.min(...l.map((r) => r.pos && (Array.isArray(r.pos) || r.pos.length !== void 0) ? r.pos[1] : r.position && (Array.isArray(r.position) || r.position.length !== void 0) ? r.position[1] : typeof r.y == "number" ? r.y : 0)), p = u, v = f;
      l.forEach((r) => {
        r.pos || (r.position && Array.isArray(r.position) ? r.pos = r.position : typeof r.x == "number" && typeof r.y == "number" ? r.pos = [r.x, r.y] : r.pos = [0, 0]), r._calculatedSize || (r.size && Array.isArray(r.size) ? r._calculatedSize = [r.size[0], r.size[1]] : typeof r.width == "number" && typeof r.height == "number" ? r._calculatedSize = [r.width, r.height] : r._calculatedSize = [150, 100]), Array.isArray(r.pos) || (r.pos = [0, 0]);
      });
      const b = De(l), z = Oe(l, b), R = 30, Y = 30, T = 30, h = 5, C = {};
      l.forEach((r) => {
        var _;
        if (r && r.id) {
          const O = ((_ = z[r.id]) == null ? void 0 : _.level) ?? 0;
          C[O] || (C[O] = []), C[O].push(r);
        }
      }), Object.entries(C).forEach(([r, _]) => {
        const O = parseInt(r);
        if (_ && _.length > 0) {
          _.sort((c, y) => {
            const S = c && c.id && z[c.id] ? z[c.id].order : 0, M = y && y.id && z[y.id] ? z[y.id].order : 0;
            return S - M;
          });
          const le = _.reduce((c, y, S) => {
            const M = y && y._calculatedSize && y._calculatedSize[1] ? y._calculatedSize[1] : 100;
            return c + M + (S < _.length - 1 ? T : 0);
          }, 0), ue = Math.max(..._.map(
            (c) => c && c._calculatedSize && c._calculatedSize[0] ? c._calculatedSize[0] : 150
          ));
          let ie = p;
          if (O > 0)
            for (let c = 0; c < O; c++) {
              const y = C[c] || [], S = Math.max(...y.map(
                (M) => M && M._calculatedSize && M._calculatedSize[0] ? M._calculatedSize[0] : 150
              ));
              ie += S + R + h;
            }
          let o = v;
          _.forEach((c, y) => {
            if (c && c.pos && c._calculatedSize) {
              const S = [c.pos[0], c.pos[1]], M = [c._calculatedSize[0], c._calculatedSize[1]];
              c.pos[0] = ie, c.pos[1] = o, o += c._calculatedSize[1] + T, typeof c.x == "number" && (c.x = c.pos[0]), typeof c.y == "number" && (c.y = c.pos[1]);
            }
          });
        }
      });
      try {
        (t = (i = window.app) == null ? void 0 : i.canvas) != null && t.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (s = (a = window.app) == null ? void 0 : a.graph) != null && s.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (n = window.app) != null && n.canvas && window.app.canvas.draw(!0, !0);
      } catch {
      }
    } catch {
      me("Error in horizontal flow alignment", "error");
    }
  }
  function Pt() {
    var i, t, a, s, n;
    try {
      const l = m.filter((r) => {
        if (!r) return !1;
        const _ = r.pos || r.position || typeof r.x == "number" && typeof r.y == "number", O = r.size || r.width || r.height || typeof r.width == "number" && typeof r.height == "number";
        return !!_ && !!O;
      });
      if (l.length < 2) {
        me(`Not enough valid nodes: ${l.length}/${m.length} nodes are valid`, "warning");
        return;
      }
      const u = Math.min(...l.map((r) => r.pos && (Array.isArray(r.pos) || r.pos.length !== void 0) ? r.pos[0] : r.position && (Array.isArray(r.position) || r.position.length !== void 0) ? r.position[0] : typeof r.x == "number" ? r.x : 0)), f = Math.min(...l.map((r) => r.pos && (Array.isArray(r.pos) || r.pos.length !== void 0) ? r.pos[1] : r.position && (Array.isArray(r.position) || r.position.length !== void 0) ? r.position[1] : typeof r.y == "number" ? r.y : 0)), p = u, v = f;
      l.forEach((r) => {
        r.pos || (r.position && Array.isArray(r.position) ? r.pos = r.position : typeof r.x == "number" && typeof r.y == "number" ? r.pos = [r.x, r.y] : r.pos = [0, 0]), r._calculatedSize || (r.size && Array.isArray(r.size) ? r._calculatedSize = [r.size[0], r.size[1]] : typeof r.width == "number" && typeof r.height == "number" ? r._calculatedSize = [r.width, r.height] : r._calculatedSize = [150, 100]), Array.isArray(r.pos) || (r.pos = [0, 0]);
      });
      const b = De(l), z = Oe(l, b), R = 30, Y = 30, T = 30, h = 5, C = {};
      l.forEach((r) => {
        var _;
        if (r && r.id) {
          const O = ((_ = z[r.id]) == null ? void 0 : _.level) ?? 0;
          C[O] || (C[O] = []), C[O].push(r);
        }
      }), Object.entries(C).forEach(([r, _]) => {
        const O = parseInt(r);
        if (_ && _.length > 0) {
          _.sort((c, y) => {
            const S = c && c.id && z[c.id] ? z[c.id].order : 0, M = y && y.id && z[y.id] ? z[y.id].order : 0;
            return S - M;
          });
          const le = _.reduce((c, y, S) => {
            const M = y && y._calculatedSize && y._calculatedSize[0] ? y._calculatedSize[0] : 150;
            return c + M + Y;
          }, 0), ue = Math.max(..._.map(
            (c) => c && c._calculatedSize && c._calculatedSize[1] ? c._calculatedSize[1] : 100
          ));
          let ie = v;
          if (O > 0)
            for (let c = 0; c < O; c++) {
              const y = C[c] || [], S = Math.max(...y.map(
                (M) => M && M._calculatedSize && M._calculatedSize[1] ? M._calculatedSize[1] : 100
              ));
              ie += S + R + h;
            }
          let o = p;
          _.forEach((c, y) => {
            if (c && c.pos && c._calculatedSize) {
              const S = [c.pos[0], c.pos[1]], M = [c._calculatedSize[0], c._calculatedSize[1]];
              c.pos[0] = o, c.pos[1] = ie, o += c._calculatedSize[0] + Y, typeof c.x == "number" && (c.x = c.pos[0]), typeof c.y == "number" && (c.y = c.pos[1]);
            }
          });
        }
      });
      try {
        (t = (i = window.app) == null ? void 0 : i.canvas) != null && t.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (s = (a = window.app) == null ? void 0 : a.graph) != null && s.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (n = window.app) != null && n.canvas && window.app.canvas.draw(!0, !0);
      } catch {
      }
    } catch {
      me("Error in vertical flow alignment", "error");
    }
  }
  function me(i, t = "info") {
    const a = document.createElement("div");
    a.textContent = i, a.style.cssText = `
            position: fixed;
            top: 60px;
            right: 10px;
            background: ${t === "success" ? "#4CAF50" : t === "warning" ? "#FF9800" : t === "error" ? "#F44336" : "#2196F3"};
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
  function ut() {
    var i;
    if (!((i = window.app) != null && i.canvas)) {
      setTimeout(ut, 100);
      return;
    }
    window.app.canvas.canvas && (window.app.canvas.canvas.addEventListener("click", () => {
      setTimeout(He, 10);
    }), window.app.canvas.canvas.addEventListener("mouseup", () => {
      setTimeout(He, 10);
    }), document.addEventListener("keydown", (t) => {
      (t.ctrlKey || t.metaKey) && setTimeout(He, 10);
    })), setInterval(He, 500);
  }
  function Tt(i) {
    if (i.ctrlKey || i.metaKey) {
      if (i.shiftKey && !i.altKey && (i.key === "H" || i.key === "h")) {
        i.preventDefault(), je();
        return;
      }
      if (i.shiftKey)
        switch (i.key) {
          case "ArrowLeft":
            i.preventDefault(), ge("left");
            break;
          case "ArrowRight":
            i.preventDefault(), ge("right");
            break;
          case "ArrowUp":
            i.preventDefault(), ge("top");
            break;
          case "ArrowDown":
            i.preventDefault(), ge("bottom");
            break;
        }
      else if (i.altKey)
        switch (i.key) {
          case "ArrowRight":
            i.preventDefault(), ge("horizontal-flow");
            break;
          case "ArrowDown":
            i.preventDefault(), ge("vertical-flow");
            break;
        }
    }
  }
  Nt(), ut(), document.addEventListener("keydown", Tt);
}
const q = {
  active: !1,
  colorOption: null,
  nodes: /* @__PURE__ */ new Map(),
  groups: /* @__PURE__ */ new Map()
};
