import { app as ft } from "../../../scripts/app.js";
import { ComponentWidgetImpl as dt, addWidget as gt } from "../../../scripts/domWidget.js";
import { defineComponent as De, ref as ie, resolveDirective as mt, createElementBlock as Ae, openBlock as me, Fragment as je, createElementVNode as he, withDirectives as vt, createVNode as He, createBlock as Ke, unref as U, normalizeClass as qe, withCtx as Xe, createTextVNode as Je, toDisplayString as Ee, renderList as wt, normalizeStyle as bt, onMounted as et, nextTick as yt } from "vue";
import Ye from "primevue/button";
import { useI18n as tt } from "vue-i18n";
const Ct = { class: "toolbar" }, xt = { class: "color-picker" }, zt = { class: "size-slider" }, kt = ["value"], St = /* @__PURE__ */ De({
  __name: "ToolBar",
  props: {
    colors: {},
    initialColor: {},
    initialBrushSize: {},
    initialTool: {}
  },
  emits: ["tool-change", "color-change", "canvas-clear", "brush-size-change"],
  setup(z, { emit: N }) {
    const { t: _ } = tt(), H = z, d = N, re = H.colors || ["#000000", "#ff0000", "#0000ff", "#69a869", "#ffff00", "#ff00ff", "#00ffff"], I = ie(H.initialColor || "#000000"), $ = ie(H.initialBrushSize || 5), V = ie(H.initialTool || "pen");
    function D(X) {
      V.value = X, d("tool-change", X);
    }
    function O(X) {
      I.value = X, d("color-change", X);
    }
    function j() {
      d("canvas-clear");
    }
    function k(X) {
      const q = X.target;
      $.value = Number(q.value), d("brush-size-change", $.value);
    }
    return (X, q) => {
      const ae = mt("tooltip");
      return me(), Ae(je, null, [
        he("div", Ct, [
          vt((me(), Ke(U(Ye), {
            class: qe({ active: V.value === "pen" }),
            onClick: q[0] || (q[0] = (W) => D("pen"))
          }, {
            default: Xe(() => [
              Je(Ee(U(_)("vue-basic.pen")), 1)
            ]),
            _: 1
          }, 8, ["class"])), [
            [ae, { value: U(_)("vue-basic.pen-tooltip"), showDelay: 300 }]
          ]),
          He(U(Ye), { onClick: j }, {
            default: Xe(() => [
              Je(Ee(U(_)("vue-basic.clear-canvas")), 1)
            ]),
            _: 1
          })
        ]),
        he("div", xt, [
          (me(!0), Ae(je, null, wt(U(re), (W, K) => (me(), Ke(U(Ye), {
            key: K,
            class: qe({ "color-button": !0, active: I.value === W }),
            onClick: (ve) => O(W),
            type: "button",
            title: W
          }, {
            default: Xe(() => [
              he("i", {
                class: "pi pi-circle-fill",
                style: bt({ color: W })
              }, null, 4)
            ]),
            _: 2
          }, 1032, ["class", "onClick", "title"]))), 128))
        ]),
        he("div", zt, [
          he("label", null, Ee(U(_)("vue-basic.brush-size")) + ": " + Ee($.value) + "px", 1),
          he("input", {
            type: "range",
            min: "1",
            max: "50",
            value: $.value,
            onChange: q[1] || (q[1] = (W) => k(W))
          }, null, 40, kt)
        ])
      ], 64);
    };
  }
}), $e = (z, N) => {
  const _ = z.__vccOpts || z;
  for (const [H, d] of N)
    _[H] = d;
  return _;
}, Et = /* @__PURE__ */ $e(St, [["__scopeId", "data-v-cae98791"]]), At = { class: "drawing-board" }, _t = { class: "canvas-container" }, Mt = ["width", "height"], Lt = /* @__PURE__ */ De({
  __name: "DrawingBoard",
  props: {
    width: {},
    height: {},
    initialColor: {},
    initialBrushSize: {}
  },
  emits: ["mounted", "drawing-start", "drawing", "drawing-end", "state-save", "canvas-clear"],
  setup(z, { expose: N, emit: _ }) {
    const H = z, d = H.width || 800, re = H.height || 500, I = H.initialColor || "#000000", $ = H.initialBrushSize || 5, V = _, D = ie(!1), O = ie(0), j = ie(0), k = ie(null), X = ie(!1), q = ie($), ae = ie(I), W = ie(null), K = ie(null);
    et(() => {
      K.value && (k.value = K.value.getContext("2d"), ve(), yt(() => {
        K.value && V("mounted", K.value);
      }));
    });
    function ve() {
      k.value && (k.value.fillStyle = "#ffffff", k.value.fillRect(0, 0, d, re), ue(), Ce());
    }
    function ue() {
      k.value && (X.value ? (k.value.globalCompositeOperation = "destination-out", k.value.strokeStyle = "rgba(0,0,0,1)") : (k.value.globalCompositeOperation = "source-over", k.value.strokeStyle = ae.value), k.value.lineWidth = q.value, k.value.lineJoin = "round", k.value.lineCap = "round");
    }
    function le(P) {
      D.value = !0;
      const { offsetX: J, offsetY: Q } = G(P);
      O.value = J, j.value = Q, k.value && (k.value.beginPath(), k.value.moveTo(O.value, j.value), k.value.arc(O.value, j.value, q.value / 2, 0, Math.PI * 2), k.value.fill(), V("drawing-start", {
        x: J,
        y: Q,
        tool: X.value ? "eraser" : "pen"
      }));
    }
    function we(P) {
      if (!D.value || !k.value) return;
      const { offsetX: J, offsetY: Q } = G(P);
      k.value.beginPath(), k.value.moveTo(O.value, j.value), k.value.lineTo(J, Q), k.value.stroke(), O.value = J, j.value = Q, V("drawing", {
        x: J,
        y: Q,
        tool: X.value ? "eraser" : "pen"
      });
    }
    function M() {
      D.value && (D.value = !1, Ce(), V("drawing-end"));
    }
    function G(P) {
      let J = 0, Q = 0;
      if ("touches" in P) {
        if (P.preventDefault(), K.value) {
          const _e = K.value.getBoundingClientRect();
          J = P.touches[0].clientX - _e.left, Q = P.touches[0].clientY - _e.top;
        }
      } else
        J = P.offsetX, Q = P.offsetY;
      return { offsetX: J, offsetY: Q };
    }
    function ye(P) {
      P.preventDefault();
      const Q = {
        touches: [P.touches[0]]
      };
      le(Q);
    }
    function Pe(P) {
      if (P.preventDefault(), !D.value) return;
      const Q = {
        touches: [P.touches[0]]
      };
      we(Q);
    }
    function Fe(P) {
      X.value = P === "eraser", ue();
    }
    function Ve(P) {
      ae.value = P, ue();
    }
    function Ie(P) {
      q.value = P, ue();
    }
    function Te() {
      k.value && (k.value.fillStyle = "#ffffff", k.value.fillRect(0, 0, d, re), ue(), Ce(), V("canvas-clear"));
    }
    function Ce() {
      K.value && (W.value = K.value.toDataURL("image/png"), W.value && V("state-save", W.value));
    }
    async function Oe() {
      if (!K.value)
        throw new Error("Canvas is unable to get current data");
      return W.value ? W.value : K.value.toDataURL("image/png");
    }
    return N({
      setTool: Fe,
      setColor: Ve,
      setBrushSize: Ie,
      clearCanvas: Te,
      getCurrentCanvasData: Oe
    }), (P, J) => (me(), Ae("div", At, [
      he("div", _t, [
        he("canvas", {
          ref_key: "canvas",
          ref: K,
          width: U(d),
          height: U(re),
          onMousedown: le,
          onMousemove: we,
          onMouseup: M,
          onMouseleave: M,
          onTouchstart: ye,
          onTouchmove: Pe,
          onTouchend: M
        }, null, 40, Mt)
      ])
    ]));
  }
}), Nt = /* @__PURE__ */ $e(Lt, [["__scopeId", "data-v-ca1239fc"]]), Bt = { class: "drawing-app" }, Ht = /* @__PURE__ */ De({
  __name: "DrawingApp",
  props: {
    width: {},
    height: {},
    initialColor: {},
    initialBrushSize: {},
    availableColors: {}
  },
  emits: ["tool-change", "color-change", "brush-size-change", "drawing-start", "drawing", "drawing-end", "state-save", "mounted"],
  setup(z, { expose: N, emit: _ }) {
    const H = z, d = H.width || 800, re = H.height || 500, I = H.initialColor || "#000000", $ = H.initialBrushSize || 5, V = H.availableColors || ["#000000", "#ff0000", "#0000ff", "#00ff00", "#ffff00", "#ff00ff", "#00ffff"], D = _, O = ie(null), j = ie(null);
    function k(M) {
      var G;
      (G = O.value) == null || G.setTool(M), D("tool-change", M);
    }
    function X(M) {
      var G;
      (G = O.value) == null || G.setColor(M), D("color-change", M);
    }
    function q(M) {
      var G;
      (G = O.value) == null || G.setBrushSize(M), D("brush-size-change", M);
    }
    function ae() {
      var M;
      (M = O.value) == null || M.clearCanvas();
    }
    function W(M) {
      D("drawing-start", M);
    }
    function K(M) {
      D("drawing", M);
    }
    function ve() {
      D("drawing-end");
    }
    function ue(M) {
      j.value = M, D("state-save", M);
    }
    function le(M) {
      D("mounted", M);
    }
    async function we() {
      if (j.value)
        return j.value;
      if (O.value)
        try {
          return await O.value.getCurrentCanvasData();
        } catch (M) {
          throw console.error("unable to get canvas data:", M), new Error("unable to get canvas data");
        }
      throw new Error("get canvas data failed");
    }
    return N({
      getCanvasData: we
    }), (M, G) => (me(), Ae("div", Bt, [
      He(Et, {
        colors: U(V),
        initialColor: U(I),
        initialBrushSize: U($),
        onToolChange: k,
        onColorChange: X,
        onBrushSizeChange: q,
        onCanvasClear: ae
      }, null, 8, ["colors", "initialColor", "initialBrushSize"]),
      He(Nt, {
        ref_key: "drawingBoard",
        ref: O,
        width: U(d),
        height: U(re),
        initialColor: U(I),
        initialBrushSize: U($),
        onDrawingStart: W,
        onDrawing: K,
        onDrawingEnd: ve,
        onStateSave: ue,
        onMounted: le
      }, null, 8, ["width", "height", "initialColor", "initialBrushSize"])
    ]));
  }
}), Dt = /* @__PURE__ */ $e(Ht, [["__scopeId", "data-v-39bbf58b"]]), Pt = /* @__PURE__ */ De({
  __name: "VueExampleComponent",
  props: {
    widget: {}
  },
  setup(z) {
    const { t: N } = tt(), _ = ie(null), H = ie(null);
    z.widget.node;
    function d(I) {
      H.value = I, console.log("canvas state saved:", I.substring(0, 50) + "...");
    }
    async function re(I, $) {
      var V;
      try {
        if (!((V = window.app) != null && V.api))
          throw new Error("ComfyUI API not available");
        const D = await fetch(I).then((q) => q.blob()), O = `${$}_${Date.now()}.png`, j = new File([D], O), k = new FormData();
        return k.append("image", j), k.append("subfolder", "threed"), k.append("type", "temp"), console.log("Vue Component: Using window.app.api.fetchApi"), (await window.app.api.fetchApi("/upload/image", {
          method: "POST",
          body: k
        })).json();
      } catch (D) {
        throw console.error("Vue Component: Error uploading image:", D), D;
      }
    }
    return et(() => {
      z.widget.serializeValue = async (I, $) => {
        try {
          console.log("Vue Component: inside vue serializeValue"), console.log("node", I), console.log("index", $);
          const V = H.value;
          return V ? {
            image: `threed/${(await re(V, "test_vue_basic")).name} [temp]`
          } : (console.warn("Vue Component: No canvas data available"), { image: null });
        } catch (V) {
          return console.error("Vue Component: Error in serializeValue:", V), { image: null };
        }
      };
    }), (I, $) => (me(), Ae("div", null, [
      he("h1", null, Ee(U(N)("vue-basic.title")), 1),
      he("div", null, [
        He(Dt, {
          ref_key: "drawingAppRef",
          ref: _,
          width: 300,
          height: 300,
          onStateSave: d
        }, null, 512)
      ])
    ]));
  }
}), Qe = "data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M4.88822%2014.1929C2.49999%2014.9929%201.36569%2011.6929%202.36088%2010.5C2.85843%209.83333%204.58971%207.89286%207.37597%204.69286C10.8588%200.692857%2012.849%202.19286%2014.3416%202.69286C15.8343%203.19286%2019.8146%207.19286%2020.8097%208.19286C21.8048%209.19286%2022.3024%2010.5%2021.8048%2011.5C21.4068%2012.3%2019.4431%2012.6667%2018.7797%2012.5C19.7748%2013%2021.3073%2017.1929%2021.8048%2018.6929C22.2028%2019.8929%2021.3073%2021.1667%2020.8097%2021.5C20.3122%2021.6667%2018.919%2022%2017.3269%2022C15.3367%2022%2015.8343%2019.6929%2016.3318%2017.1929C16.8293%2014.6929%2014.3416%2014.6929%2011.8539%2015.6929C9.36615%2016.6929%209.8637%2017.6929%2010.8588%2018.1929C11.8539%2018.6929%2011.8141%2020.1929%2011.3166%2021.1929C10.8191%2022.1929%206.83869%2022.1929%205.84359%2021.1929C5.07774%2020.4232%206.1292%2015.7356%206.80082%2013.4517C6.51367%2013.6054%205.93814%2013.8412%204.88822%2014.1929Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", Ft = "data:image/svg+xml,%3csvg%20width='33'%20height='32'%20viewBox='0%200%2033%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M9.73332%2028C9.73332%2028.3536%209.59284%2028.6928%209.34279%2028.9428C9.09274%2029.1929%208.75361%2029.3333%208.39998%2029.3333C8.04636%2029.3333%207.70722%2029.1929%207.45717%2028.9428C7.20713%2028.6928%207.06665%2028.3536%207.06665%2028V4C7.06665%203.64638%207.20713%203.30724%207.45717%203.05719C7.70722%202.80714%208.04636%202.66667%208.39998%202.66667C8.75361%202.66667%209.09274%202.80714%209.34279%203.05719C9.59284%203.30724%209.73332%203.64638%209.73332%204V28ZM15.0667%2012C14.3594%2012%2013.6811%2011.719%2013.181%2011.219C12.6809%2010.7189%2012.4%2010.0406%2012.4%209.33333C12.4%208.62609%2012.6809%207.94781%2013.181%207.44771C13.6811%206.94762%2014.3594%206.66667%2015.0667%206.66667H23.0667C23.7739%206.66667%2024.4522%206.94762%2024.9523%207.44771C25.4524%207.94781%2025.7333%208.62609%2025.7333%209.33333C25.7333%2010.0406%2025.4524%2010.7189%2024.9523%2011.219C24.4522%2011.719%2023.7739%2012%2023.0667%2012H15.0667ZM15.0667%2016H20.4C21.1072%2016%2021.7855%2016.281%2022.2856%2016.781C22.7857%2017.2811%2023.0667%2017.9594%2023.0667%2018.6667C23.0667%2019.3739%2022.7857%2020.0522%2022.2856%2020.5523C21.7855%2021.0524%2021.1072%2021.3333%2020.4%2021.3333H15.0667C14.3594%2021.3333%2013.6811%2021.0524%2013.181%2020.5523C12.6809%2020.0522%2012.4%2019.3739%2012.4%2018.6667C12.4%2017.9594%2012.6809%2017.2811%2013.181%2016.781C13.6811%2016.281%2014.3594%2016%2015.0667%2016Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", Vt = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M22.6667%2028C22.6667%2028.3536%2022.5262%2028.6928%2022.2761%2028.9428C22.0261%2029.1929%2021.687%2029.3333%2021.3333%2029.3333C20.9797%2029.3333%2020.6406%2029.1929%2020.3905%2028.9428C20.1405%2028.6928%2020%2028.3536%2020%2028V4C20%203.64638%2020.1405%203.30724%2020.3905%203.05719C20.6406%202.80714%2020.9797%202.66667%2021.3333%202.66667C21.687%202.66667%2022.0261%202.80714%2022.2761%203.05719C22.5262%203.30724%2022.6667%203.64638%2022.6667%204V28ZM14.6667%206.66667C15.3739%206.66667%2016.0522%206.94762%2016.5523%207.44771C17.0524%207.94781%2017.3333%208.62609%2017.3333%209.33333C17.3333%2010.0406%2017.0524%2010.7189%2016.5523%2011.219C16.0522%2011.719%2015.3739%2012%2014.6667%2012H6.66667C5.95942%2012%205.28115%2011.719%204.78105%2011.219C4.28095%2010.7189%204%2010.0406%204%209.33333C4%208.62609%204.28095%207.94781%204.78105%207.44771C5.28115%206.94762%205.95942%206.66667%206.66667%206.66667H14.6667ZM14.6667%2016C15.3739%2016%2016.0522%2016.281%2016.5523%2016.781C17.0524%2017.2811%2017.3333%2017.9594%2017.3333%2018.6667C17.3333%2019.3739%2017.0524%2020.0522%2016.5523%2020.5523C16.0522%2021.0524%2015.3739%2021.3333%2014.6667%2021.3333H9.33333C8.62609%2021.3333%207.94781%2021.0524%207.44772%2020.5523C6.94762%2020.0522%206.66667%2019.3739%206.66667%2018.6667C6.66667%2017.9594%206.94762%2017.2811%207.44772%2016.781C7.94781%2016.281%208.62609%2016%209.33333%2016H14.6667Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", It = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M6.39992%204H25.5999C26.1893%204%2026.6666%204.59733%2026.6666%205.33333C26.6666%206.06933%2026.1893%206.66667%2025.5999%206.66667H6.39992C5.81059%206.66667%205.33325%206.06933%205.33325%205.33333C5.33325%204.59733%205.81059%204%206.39992%204ZM9.33325%2012C9.33325%2011.2928%209.6142%2010.6145%2010.1143%2010.1144C10.6144%209.61428%2011.2927%209.33333%2011.9999%209.33333C12.7072%209.33333%2013.3854%209.61428%2013.8855%2010.1144C14.3856%2010.6145%2014.6666%2011.2928%2014.6666%2012V25.3333C14.6666%2026.0406%2014.3856%2026.7189%2013.8855%2027.219C13.3854%2027.719%2012.7072%2028%2011.9999%2028C11.2927%2028%2010.6144%2027.719%2010.1143%2027.219C9.6142%2026.7189%209.33325%2026.0406%209.33325%2025.3333V12ZM17.3333%2012C17.3333%2011.2928%2017.6142%2010.6145%2018.1143%2010.1144C18.6144%209.61428%2019.2927%209.33333%2019.9999%209.33333C20.7072%209.33333%2021.3854%209.61428%2021.8855%2010.1144C22.3856%2010.6145%2022.6666%2011.2928%2022.6666%2012V20C22.6666%2020.7072%2022.3856%2021.3855%2021.8855%2021.8856C21.3854%2022.3857%2020.7072%2022.6667%2019.9999%2022.6667C19.2927%2022.6667%2018.6144%2022.3857%2018.1143%2021.8856C17.6142%2021.3855%2017.3333%2020.7072%2017.3333%2020V12Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", Tt = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M6.39992%2025.3333H25.5999C26.1893%2025.3333%2026.6666%2025.9307%2026.6666%2026.6667C26.6666%2027.4027%2026.1893%2028%2025.5999%2028H6.39992C5.81059%2028%205.33325%2027.4027%205.33325%2026.6667C5.33325%2025.9307%205.81059%2025.3333%206.39992%2025.3333ZM14.6666%2020C14.6666%2020.7072%2014.3856%2021.3855%2013.8855%2021.8856C13.3854%2022.3857%2012.7072%2022.6667%2011.9999%2022.6667C11.2927%2022.6667%2010.6144%2022.3857%2010.1143%2021.8856C9.6142%2021.3855%209.33325%2020.7072%209.33325%2020V6.66667C9.33325%205.95942%209.6142%205.28115%2010.1143%204.78105C10.6144%204.28095%2011.2927%204%2011.9999%204C12.7072%204%2013.3854%204.28095%2013.8855%204.78105C14.3856%205.28115%2014.6666%205.95942%2014.6666%206.66667V20ZM22.6666%2020C22.6666%2020.7072%2022.3856%2021.3855%2021.8855%2021.8856C21.3854%2022.3857%2020.7072%2022.6667%2019.9999%2022.6667C19.2927%2022.6667%2018.6144%2022.3857%2018.1143%2021.8856C17.6142%2021.3855%2017.3333%2020.7072%2017.3333%2020V12C17.3333%2011.2928%2017.6142%2010.6145%2018.1143%2010.1144C18.6144%209.61428%2019.2927%209.33333%2019.9999%209.33333C20.7072%209.33333%2021.3854%209.61428%2021.8855%2010.1144C22.3856%2010.6145%2022.6666%2011.2928%2022.6666%2012V20Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", Ot = "data:image/svg+xml,%3csvg%20width='33'%20height='32'%20viewBox='0%200%2033%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M3.80005%2024.7791V6.22093C3.80005%205.54663%204.41923%205%205.18303%205C5.94683%205%206.56601%205.54663%206.56601%206.22093V24.7791C6.56601%2025.4534%205.94683%2026%205.18303%2026C4.41923%2026%203.80005%2025.4534%203.80005%2024.7791Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M7.49597%2016.1488L10.3015%2018.9352C10.6394%2019.2708%2011.2681%2019.0598%2011.2681%2018.6107V17.6976H22.332V18.6107C22.332%2019.0598%2022.9607%2019.2708%2023.2986%2018.9352L26.1041%2016.1488C26.4767%2015.7787%2026.4767%2015.221%2026.1041%2014.851L23.2986%2012.0646C22.9607%2011.729%2022.332%2011.94%2022.332%2012.3891V13.3022H11.2681V12.3891C11.2681%2011.94%2010.6394%2011.729%2010.3015%2012.0646L7.49597%2014.851C7.12335%2015.221%207.12335%2015.7787%207.49597%2016.1488Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M27.0341%2024.7791V6.22093C27.0341%205.54663%2027.6533%205%2028.4171%205C29.1809%205%2029.8%205.54663%2029.8%206.22093V24.7791C29.8%2025.4534%2029.1809%2026%2028.4171%2026C27.6533%2026%2027.0341%2025.4534%2027.0341%2024.7791Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", Zt = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M3%2024.7791V6.22093C3%205.54663%203.61918%205%204.38298%205C5.14678%205%205.76596%205.54663%205.76596%206.22093V24.7791C5.76596%2025.4534%205.14678%2026%204.38298%2026C3.61918%2026%203%2025.4534%203%2024.7791Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M26.234%2024.7791V6.22093C26.234%205.54663%2026.8532%205%2027.617%205C28.3808%205%2029%205.54663%2029%206.22093V24.7791C29%2025.4534%2028.3808%2026%2027.617%2026C26.8532%2026%2026.234%2025.4534%2026.234%2024.7791Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M15.0141%2016.2491L12.2086%2019.0355C11.8706%2019.3711%2011.2419%2019.1601%2011.2419%2018.711V17.7979H6.71L6.71%2013.4025H11.2419V12.4894C11.2419%2012.0403%2011.8706%2011.8293%2012.2086%2012.1649L15.0141%2014.9513C15.3867%2015.3213%2015.3867%2015.879%2015.0141%2016.2491Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M16.9895%2016.2491L19.795%2019.0355C20.133%2019.3711%2020.7617%2019.1601%2020.7617%2018.711V17.7979H25.2936L25.2936%2013.4025H20.7617V12.4894C20.7617%2012.0403%2020.133%2011.8293%2019.795%2012.1649L16.9895%2014.9513C16.6169%2015.3213%2016.6169%2015.879%2016.9895%2016.2491Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", Rt = "data:image/svg+xml,%3csvg%20width='33'%20height='32'%20viewBox='0%200%2033%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20x='0.399902'%20width='32'%20height='32'%20rx='4'%20fill='%23283540'/%3e%3cpath%20d='M25.179%2029H6.62083C5.94653%2029%205.3999%2028.3808%205.3999%2027.617C5.3999%2026.8532%205.94653%2026.234%206.62083%2026.234H25.179C25.8533%2026.234%2026.3999%2026.8532%2026.3999%2027.617C26.3999%2028.3808%2025.8533%2029%2025.179%2029Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M16.5487%2025.3041L19.3351%2022.4986C19.6707%2022.1606%2019.4597%2021.5319%2019.0106%2021.5319H18.0975V10.4681H19.0106C19.4597%2010.4681%2019.6707%209.83938%2019.3351%209.50144L16.5487%206.69593C16.1786%206.32331%2015.621%206.32331%2015.2509%206.69593L12.4645%209.50144C12.1289%209.83938%2012.3399%2010.4681%2012.789%2010.4681H13.7021V21.5319H12.789C12.3399%2021.5319%2012.1289%2022.1606%2012.4645%2022.4986L15.2509%2025.3041C15.621%2025.6767%2016.1786%2025.6767%2016.5487%2025.3041Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M25.179%205.76596H6.62083C5.94653%205.76596%205.3999%205.14678%205.3999%204.38298C5.3999%203.61918%205.94653%203%206.62083%203H25.179C25.8533%203%2026.3999%203.61918%2026.3999%204.38298C26.3999%205.14678%2025.8533%205.76596%2025.179%205.76596Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", Xt = "data:image/svg+xml,%3csvg%20width='33'%20height='32'%20viewBox='0%200%2033%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M7.82103%203H26.3792C27.0535%203%2027.6001%203.61918%2027.6001%204.38298C27.6001%205.14678%2027.0535%205.76596%2026.3792%205.76596H7.82103C7.14673%205.76596%206.6001%205.14678%206.6001%204.38298C6.6001%203.61918%207.14673%203%207.82103%203Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M7.82103%2026.234H26.3792C27.0535%2026.234%2027.6001%2026.8532%2027.6001%2027.617C27.6001%2028.3808%2027.0535%2029%2026.3792%2029H7.82103C7.14673%2029%206.6001%2028.3808%206.6001%2027.617C6.6001%2026.8532%207.14673%2026.234%207.82103%2026.234Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M16.351%2015.0141L13.5646%2012.2086C13.229%2011.8706%2013.44%2011.2419%2013.8891%2011.2419H14.8022V6.71L19.1976%206.71V11.2419H20.1107C20.5598%2011.2419%2020.7708%2011.8706%2020.4352%2012.2086L17.6488%2015.0141C17.2787%2015.3867%2016.7211%2015.3867%2016.351%2015.0141Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M16.351%2016.9895L13.5646%2019.795C13.229%2020.133%2013.44%2020.7617%2013.8891%2020.7617H14.8022V25.2936L19.1976%2025.2936V20.7617H20.1107C20.5598%2020.7617%2020.7708%2020.133%2020.4352%2019.795L17.6488%2016.9895C17.2787%2016.6169%2016.7211%2016.6169%2016.351%2016.9895Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", Yt = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M19.5201%206.18689C19.2052%205.87191%2019.4282%205.33334%2019.8737%205.33334H25.6666C26.2189%205.33334%2026.6666%205.78105%2026.6666%206.33334V12.1262C26.6666%2012.5717%2026.128%2012.7948%2025.813%2012.4798L23.9999%2010.6667L18.6666%2016L15.9999%2013.3333L21.3333%208L19.5201%206.18689ZM12.4797%2025.8131C12.7947%2026.1281%2012.5716%2026.6667%2012.1261%2026.6667H6.33325C5.78097%2026.6667%205.33325%2026.219%205.33325%2025.6667V19.8738C5.33325%2019.4283%205.87182%2019.2052%206.18681%2019.5202L7.99992%2021.3333L13.3333%2016L15.9999%2018.6667L10.6666%2024L12.4797%2025.8131Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", $t = "data:image/svg+xml,%3csvg%20width='33'%20height='32'%20viewBox='0%200%2033%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M14.8666%2016H9.07372C8.62827%2016%208.40519%2016.5386%208.72017%2016.8535L10.5333%2018.6667L5.19995%2024L7.86662%2026.6667L13.2%2021.3333L15.0131%2023.1464C15.328%2023.4614%2015.8666%2023.2383%2015.8666%2022.7929V17C15.8666%2016.4477%2015.4189%2016%2014.8666%2016Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M17.2%2015.6667H22.9929C23.4384%2015.6667%2023.6615%2015.1281%2023.3465%2014.8131L21.5334%2013L26.8667%207.66667L24.2%205L18.8667%2010.3333L17.0536%208.52022C16.7386%208.20524%2016.2%208.42832%2016.2%208.87377V14.6667C16.2%2015.219%2016.6477%2015.6667%2017.2%2015.6667Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", Wt = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M15.9999%2016C15.9999%2016.1427%2015.9692%2016.288%2015.9039%2016.4213C15.8398%2016.5595%2015.7376%2016.6766%2015.6092%2016.7587L6.46256%2022.5587C6.09456%2022.7907%205.6319%2022.6387%205.42923%2022.22C5.36471%2022.089%205.33183%2021.9447%205.33323%2021.7987V10.2013C5.33323%209.72132%205.67323%209.33333%206.09323%209.33333C6.22441%209.33264%206.35289%209.37067%206.46256%209.44266L15.6092%2015.2413C15.7325%2015.3252%2015.8328%2015.4385%2015.901%2015.571C15.9692%2015.7035%2016.0032%2015.851%2015.9999%2016V10.2C15.9999%209.71999%2016.3399%209.33199%2016.7599%209.33199C16.8911%209.33131%2017.0196%209.36934%2017.1292%209.44133L26.2759%2015.24C26.6426%2015.472%2026.7746%2016%2026.5706%2016.42C26.5065%2016.5582%2026.4042%2016.6752%2026.2759%2016.7573L17.1292%2022.5573C16.7612%2022.7893%2016.2986%2022.6373%2016.0959%2022.2187C16.0314%2022.0877%2015.9985%2021.9433%2015.9999%2021.7973V16Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", Gt = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M16%2016H21.8C21.9467%2016%2022.0934%2016.0333%2022.2214%2016.096C22.64%2016.2987%2022.792%2016.7627%2022.5587%2017.1293L16.76%2026.276C16.6814%2026.4%2016.564%2026.5027%2016.4227%2026.5707C16.004%2026.7747%2015.476%2026.6427%2015.2427%2026.276L9.4427%2017.1293C9.37118%2017.0195%209.33361%2016.891%209.33469%2016.76C9.33469%2016.34%209.7227%2016%2010.2027%2016H16ZM16%2016C15.6934%2016%2015.3987%2015.8587%2015.24%2015.6093L9.44003%206.46266C9.36898%206.3527%209.33188%206.22424%209.33336%206.09333C9.33336%205.67333%209.72136%205.33333%2010.2014%205.33333H21.7987C21.9454%205.33333%2022.092%205.36666%2022.22%205.42933C22.6387%205.63199%2022.7907%206.096%2022.5574%206.46266L16.7587%2015.6093C16.68%2015.7333%2016.5627%2015.836%2016.4214%2015.904C16.288%2015.9693%2016.1427%2016%2016.0014%2016'%20fill='%238BC3F3'/%3e%3c/svg%3e", it = ft;
it.registerExtension({
  name: "vue-basic",
  getCustomWidgets(z) {
    return {
      CUSTOM_VUE_COMPONENT_BASIC(N) {
        const _ = {
          name: "custom_vue_component_basic",
          type: "vue-basic"
        }, H = new dt({
          node: N,
          name: _.name,
          component: Pt,
          inputSpec: _,
          options: {}
        });
        return gt(N, H), { widget: H };
      }
    };
  },
  nodeCreated(z) {
    if (z.constructor.comfyClass !== "vue-basic") return;
    const [N, _] = z.size;
    z.setSize([Math.max(N, 300), Math.max(_, 520)]);
  }
});
it.registerExtension({
  name: "housekeeper-alignment",
  async setup() {
    try {
      Ut();
    } catch {
    }
  },
  nodeCreated(z) {
    z.constructor.comfyClass === "housekeeper-alignment" && (z.setSize([200, 100]), z.title && (z.title = "🎯 Alignment Panel Active"));
  }
});
function Ut() {
  let z = null, N = null, _ = null, H = !1, d = [], re = [], I = 0;
  const $ = /* @__PURE__ */ new WeakMap(), V = /* @__PURE__ */ new WeakMap();
  let D = null, O = !1;
  const j = 48, k = 24;
  function X() {
    return document.querySelector("#comfy-menu, .comfyui-menu, .litegraph-menu, .comfyui-toolbar");
  }
  function q() {
    const a = X();
    if (!a)
      return j;
    const i = a.getBoundingClientRect();
    return !i || i.width === 0 && i.height === 0 ? j : Math.max(j, Math.ceil(i.bottom + 8));
  }
  function ae() {
    const a = q(), i = window.innerHeight || document.documentElement.clientHeight || 0, s = Math.max(i - a - k, 280);
    document.documentElement.style.setProperty("--hk-top-offset", `${a}px`), document.documentElement.style.setProperty("--hk-panel-max-height", `${s}px`);
  }
  function W() {
    if (O || (O = !0, window.addEventListener("resize", ae), window.addEventListener("orientationchange", ae)), typeof ResizeObserver < "u") {
      const a = X();
      a && (D ? D.disconnect() : D = new ResizeObserver(() => ae()), D.observe(a));
    }
  }
  const K = [
    { type: "left", icon: Ft, label: "Align left edges", group: "basic" },
    { type: "right", icon: Vt, label: "Align right edges", group: "basic" },
    { type: "top", icon: It, label: "Align top edges", group: "basic" },
    { type: "bottom", icon: Tt, label: "Align bottom edges", group: "basic" }
  ], ve = [
    { type: "width-max", icon: Ot, label: "Match widest width", group: "size" },
    { type: "width-min", icon: Zt, label: "Match narrowest width", group: "size" },
    { type: "height-max", icon: Rt, label: "Match tallest height", group: "size" },
    { type: "height-min", icon: Xt, label: "Match shortest height", group: "size" },
    { type: "size-max", icon: Yt, label: "Match largest size", group: "size" },
    { type: "size-min", icon: $t, label: "Match smallest size", group: "size" }
  ], ue = [
    { type: "horizontal-flow", icon: Wt, label: "Distribute horizontally", group: "flow" },
    { type: "vertical-flow", icon: Gt, label: "Distribute vertically", group: "flow" }
  ], le = [
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
  ];
  function we() {
    const a = "housekeeper-alignment-styles";
    if (document.getElementById(a)) return;
    const i = document.createElement("style");
    i.id = a, i.textContent = `
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
`, document.head.appendChild(i);
  }
  we(), W(), ae();
  function M() {
    const a = document.createElement("section");
    return a.className = "housekeeper-section", a;
  }
  function G(a) {
    const i = document.createElement("p");
    return i.className = "housekeeper-subtitle", i.textContent = a, i;
  }
  function ye(a, i) {
    const s = document.createElement("div");
    return s.className = `housekeeper-button-grid housekeeper-button-grid-${i}`, a.forEach((l) => {
      s.appendChild(Pe(l));
    }), s;
  }
  function Pe(a) {
    const i = document.createElement("button");
    i.type = "button", i.className = "hk-button", i.dataset.alignmentType = a.type, i.title = a.label, i.setAttribute("aria-label", a.label);
    const s = document.createElement("img");
    return s.src = a.icon, s.alt = "", s.draggable = !1, i.appendChild(s), i.addEventListener("mouseenter", () => We(a.type)), i.addEventListener("mouseleave", () => Me()), i.addEventListener("focus", () => We(a.type)), i.addEventListener("blur", () => Me()), i.addEventListener("click", () => de(a.type)), i;
  }
  function Fe(a) {
    const i = a.replace("#", "");
    if (i.length === 3) {
      const s = parseInt(i[0] + i[0], 16), l = parseInt(i[1] + i[1], 16), m = parseInt(i[2] + i[2], 16);
      return { r: s, g: l, b: m };
    }
    return i.length === 6 ? {
      r: parseInt(i.slice(0, 2), 16),
      g: parseInt(i.slice(2, 4), 16),
      b: parseInt(i.slice(4, 6), 16)
    } : null;
  }
  function Ve(a) {
    const i = (s) => {
      const l = s / 255;
      return l <= 0.03928 ? l / 12.92 : Math.pow((l + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * i(a.r) + 0.7152 * i(a.g) + 0.0722 * i(a.b);
  }
  function Ie(a) {
    const i = Fe(a);
    return i ? Ve(i) > 0.5 ? "#1a1a1a" : "#f5f5f5" : "#1a1a1a";
  }
  function Te(a) {
    const i = a.startsWith("#") ? a : `#${a}`;
    return {
      color: Ie(i),
      bgcolor: i,
      groupcolor: i
    };
  }
  function Ce(a) {
    var m, f, E;
    if (!d.length) {
      ge("Select nodes to apply color", "warning");
      return;
    }
    const i = Te(a), s = /* @__PURE__ */ new Set();
    d.forEach((c) => {
      c != null && c.graph && s.add(c.graph);
    }), s.forEach((c) => {
      var u;
      return (u = c == null ? void 0 : c.beforeChange) == null ? void 0 : u.call(c);
    }), d.forEach((c) => {
      typeof c.setColorOption == "function" ? c.setColorOption(i) : (c.color = i.color, c.bgcolor = i.bgcolor, c.groupcolor = i.groupcolor);
    }), s.forEach((c) => {
      var u;
      return (u = c == null ? void 0 : c.afterChange) == null ? void 0 : u.call(c);
    });
    const l = ((m = window.LGraphCanvas) == null ? void 0 : m.active_canvas) ?? ((f = window.app) == null ? void 0 : f.canvas);
    (E = l == null ? void 0 : l.setDirty) == null || E.call(l, !0, !0);
  }
  function Oe(a, i) {
    const s = (l) => {
      l == null || l.preventDefault(), Ce(i);
    };
    a.addEventListener("click", s), a.addEventListener("keydown", (l) => {
      (l.key === "Enter" || l.key === " ") && (l.preventDefault(), s());
    });
  }
  function P(a, i = !0) {
    const s = document.createElement(i ? "button" : "div");
    return i && (s.type = "button", s.setAttribute("aria-label", `Apply color ${a.toUpperCase()}`), s.title = `Apply color ${a.toUpperCase()}`), s.className = "hk-color-chip", s.style.background = a, s.dataset.colorHex = a, i && Oe(s, a), s;
  }
  function J(a, i) {
    if (!le.length) return;
    const s = le.length, l = (i % s + s) % s;
    I = l;
    const m = le[l];
    a.replaceChildren(), m.forEach((f) => {
      const E = P(f);
      a.appendChild(E);
    }), a.setAttribute("aria-label", `Color harmony palette ${l + 1} of ${s}`);
  }
  function Q() {
    z && (ae(), H = !0, z.classList.remove("collapsed"), z.classList.add("expanded"), setTimeout(() => {
      N == null || N.focus();
    }, 0));
  }
  function _e() {
    z && (H = !1, z.classList.remove("expanded"), z.classList.add("collapsed"), _ == null || _.focus());
  }
  function Ze(a) {
    (typeof a == "boolean" ? a : !H) ? Q() : _e();
  }
  function rt() {
    if (N) return;
    z = document.createElement("div"), z.className = "housekeeper-wrapper collapsed", _ = document.createElement("button"), _.type = "button", _.className = "housekeeper-handle", _.title = "Toggle Housekeeper panel (Ctrl+Shift+H)";
    const a = document.createElement("img");
    a.src = Qe, a.alt = "", a.draggable = !1, _.appendChild(a);
    const i = document.createElement("span");
    i.textContent = "Housekeeper", _.appendChild(i), _.addEventListener("click", () => Ze()), N = document.createElement("div"), N.className = "housekeeper-panel", N.setAttribute("role", "region"), N.setAttribute("aria-label", "Housekeeper alignment tools"), N.tabIndex = -1;
    const s = document.createElement("div");
    s.className = "housekeeper-content";
    const l = document.createElement("div");
    l.className = "housekeeper-header";
    const m = document.createElement("div");
    m.className = "housekeeper-header-title";
    const f = document.createElement("img");
    f.src = Qe, f.alt = "", f.draggable = !1, m.appendChild(f);
    const E = document.createElement("span");
    E.textContent = "Housekeeper", m.appendChild(E);
    const c = document.createElement("button");
    c.type = "button", c.className = "housekeeper-close", c.setAttribute("aria-label", "Hide Housekeeper panel"), c.innerHTML = "&times;", c.addEventListener("click", () => Ze(!1)), l.appendChild(m), l.appendChild(c);
    const u = document.createElement("div");
    u.className = "housekeeper-divider";
    const S = M();
    S.classList.add("housekeeper-section-primary"), S.appendChild(G("Basic Alignment")), S.appendChild(ye(K, "basic")), S.appendChild(G("Size Adjustment")), S.appendChild(ye(ve, "size")), S.appendChild(G("Flow Alignment")), S.appendChild(ye(ue, "flow"));
    const y = (ee, te, xe = !0) => {
      const be = document.createElement("div");
      return be.className = te, be.setAttribute("role", "group"), ee.forEach((ze) => {
        const Re = P(ze, xe);
        be.appendChild(Re);
      }), be;
    }, C = M();
    C.appendChild(G("Color"));
    const Z = document.createElement("div");
    Z.className = "housekeeper-color-carousel";
    const R = document.createElement("button");
    R.type = "button", R.className = "hk-palette-arrow hk-palette-arrow-prev", R.innerHTML = "&#9664;";
    const T = document.createElement("div");
    T.className = "housekeeper-color-strip", T.setAttribute("role", "group");
    const n = document.createElement("button");
    n.type = "button", n.className = "hk-palette-arrow hk-palette-arrow-next", n.innerHTML = "&#9654;", Z.appendChild(R), Z.appendChild(T), Z.appendChild(n), C.appendChild(Z);
    const v = () => {
      const ee = le.length, te = (I - 1 + ee) % ee, xe = (I + 1) % ee;
      R.setAttribute("aria-label", `Show color set ${te + 1} of ${ee}`), n.setAttribute("aria-label", `Show color set ${xe + 1} of ${ee}`);
    }, t = (ee) => {
      const te = le.length;
      te && (I = (I + ee + te) % te, J(T, I), v());
    };
    R.addEventListener("click", () => t(-1)), n.addEventListener("click", () => t(1)), J(T, I), v();
    const x = document.createElement("div");
    x.className = "housekeeper-color-custom-row";
    const B = document.createElement("span");
    B.textContent = "Custom";
    const ce = document.createElement("div");
    ce.className = "hk-toggle-placeholder", x.appendChild(B), x.appendChild(ce), C.appendChild(x);
    const fe = document.createElement("div");
    fe.className = "housekeeper-color-picker-placeholder";
    const Y = document.createElement("div");
    Y.className = "housekeeper-color-picker-toolbar";
    const r = document.createElement("div");
    r.className = "hk-swatch", r.style.background = "#000000";
    const o = document.createElement("div");
    o.className = "hk-swatch", o.style.background = "#ff4238";
    const w = document.createElement("div");
    w.className = "hk-slider-placeholder";
    const b = document.createElement("div");
    b.className = "hk-rgb-placeholder", ["R", "G", "B"].forEach((ee) => {
      const te = document.createElement("div");
      te.className = "hk-rgb-pill", te.textContent = ee, b.appendChild(te);
    }), Y.appendChild(r), Y.appendChild(o), Y.appendChild(w), Y.appendChild(b), fe.appendChild(Y), C.appendChild(fe), C.appendChild(G("On this page"));
    const A = y(
      ["#C9CCD1", "#5A7A9F", "#2E3136", "#6F7B89", "#4B6076", "#2B3F2F", "#2C3D4E", "#4C3C5A", "#3F2725", "#1E1E1F"],
      "housekeeper-color-footer"
    );
    C.appendChild(A), s.appendChild(l), s.appendChild(u), s.appendChild(S);
    const pe = document.createElement("div");
    pe.className = "housekeeper-divider housekeeper-divider-spaced", s.appendChild(pe), s.appendChild(C), N.appendChild(s), z.appendChild(_), z.appendChild(N), document.body.appendChild(z), W(), ae();
  }
  function We(a) {
    var l;
    if (d.length < 2) return;
    Me();
    const i = (l = window.app) == null ? void 0 : l.canvas;
    if (!i) return;
    at(a, d).forEach((m, f) => {
      if (m && d[f]) {
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
        const c = (m.x + i.ds.offset[0]) * i.ds.scale, u = (m.y + i.ds.offset[1]) * i.ds.scale, S = i.canvas.parentElement, y = i.canvas.getBoundingClientRect(), C = S ? S.getBoundingClientRect() : null;
        C && y.top - C.top, y.top;
        const Z = document.querySelector("nav");
        let R = 31;
        Z && (R = Z.getBoundingClientRect().height);
        const T = R * i.ds.scale, n = y.left + c, v = y.top + u - T, t = m.width * i.ds.scale, x = m.height * i.ds.scale;
        E.style.left = n + "px", E.style.top = v + "px", E.style.width = t + "px", E.style.height = x + "px", document.body.appendChild(E), re.push(E);
      }
    });
  }
  function Me() {
    re.forEach((a) => {
      a.parentNode && a.parentNode.removeChild(a);
    }), re = [];
  }
  function at(a, i) {
    if (i.length < 2) return [];
    const s = [], l = Math.min(...i.map((c) => c.pos[0])), m = Math.max(...i.map((c) => {
      let u = 150;
      return c.size && Array.isArray(c.size) && c.size[0] ? u = c.size[0] : typeof c.width == "number" ? u = c.width : c.properties && typeof c.properties.width == "number" && (u = c.properties.width), c.pos[0] + u;
    })), f = Math.min(...i.map((c) => c.pos[1])), E = Math.max(...i.map((c) => {
      let u = 100;
      return c.size && Array.isArray(c.size) && c.size[1] ? u = c.size[1] : typeof c.height == "number" ? u = c.height : c.properties && typeof c.properties.height == "number" && (u = c.properties.height), c.pos[1] + u;
    }));
    switch (a) {
      case "left":
        const c = [...i].sort((e, h) => e.pos[1] - h.pos[1]);
        let u = c[0].pos[1];
        const S = /* @__PURE__ */ new Map();
        c.forEach((e) => {
          let h = 100, g = 150;
          e.size && Array.isArray(e.size) ? (e.size[1] && (h = e.size[1]), e.size[0] && (g = e.size[0])) : (typeof e.height == "number" && (h = e.height), typeof e.width == "number" && (g = e.width), e.properties && (typeof e.properties.height == "number" && (h = e.properties.height), typeof e.properties.width == "number" && (g = e.properties.width))), S.set(e.id, {
            x: l,
            y: u,
            width: g,
            height: h
          }), u += h + 30;
        }), i.forEach((e) => {
          s.push(S.get(e.id));
        });
        break;
      case "right":
        const y = [...i].sort((e, h) => e.pos[1] - h.pos[1]);
        let C = y[0].pos[1];
        const Z = /* @__PURE__ */ new Map();
        y.forEach((e) => {
          let h = 100, g = 150;
          e.size && Array.isArray(e.size) ? (e.size[1] && (h = e.size[1]), e.size[0] && (g = e.size[0])) : (typeof e.height == "number" && (h = e.height), typeof e.width == "number" && (g = e.width), e.properties && (typeof e.properties.height == "number" && (h = e.properties.height), typeof e.properties.width == "number" && (g = e.properties.width))), Z.set(e.id, {
            x: m - g,
            y: C,
            width: g,
            height: h
          }), C += h + 30;
        }), i.forEach((e) => {
          s.push(Z.get(e.id));
        });
        break;
      case "top":
        const R = [...i].sort((e, h) => e.pos[0] - h.pos[0]);
        let T = R[0].pos[0];
        const n = /* @__PURE__ */ new Map();
        R.forEach((e) => {
          let h = 100, g = 150;
          e.size && Array.isArray(e.size) ? (e.size[1] && (h = e.size[1]), e.size[0] && (g = e.size[0])) : (typeof e.height == "number" && (h = e.height), typeof e.width == "number" && (g = e.width), e.properties && (typeof e.properties.height == "number" && (h = e.properties.height), typeof e.properties.width == "number" && (g = e.properties.width))), n.set(e.id, {
            x: T,
            y: f,
            width: g,
            height: h
          }), T += g + 30;
        }), i.forEach((e) => {
          s.push(n.get(e.id));
        });
        break;
      case "bottom":
        const v = [...i].sort((e, h) => e.pos[0] - h.pos[0]);
        let t = l;
        const x = /* @__PURE__ */ new Map();
        v.forEach((e) => {
          let h = 100, g = 150;
          e.size && Array.isArray(e.size) ? (e.size[1] && (h = e.size[1]), e.size[0] && (g = e.size[0])) : (typeof e.height == "number" && (h = e.height), typeof e.width == "number" && (g = e.width), e.properties && (typeof e.properties.height == "number" && (h = e.properties.height), typeof e.properties.width == "number" && (g = e.properties.width))), x.set(e.id, {
            x: t,
            y: E - h,
            width: g,
            height: h
          }), t += g + 30;
        }), i.forEach((e) => {
          s.push(x.get(e.id));
        });
        break;
      case "horizontal-flow":
        const B = i.filter((e) => {
          if (!e) return !1;
          const h = e.pos || e.position || typeof e.x == "number" && typeof e.y == "number", g = e.size || e.width || e.height || typeof e.width == "number" && typeof e.height == "number";
          return !!h && !!g;
        });
        if (B.length < 2) break;
        const ce = Math.min(...B.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[0] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[0] : typeof e.x == "number" ? e.x : 0)), fe = Math.min(...B.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[1] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[1] : typeof e.y == "number" ? e.y : 0)), Y = B.map((e) => ({
          ...e,
          pos: e.pos ? [...e.pos] : [e.x || 0, e.y || 0],
          _calculatedSize: e.size && Array.isArray(e.size) ? [e.size[0], e.size[1]] : [e.width || 150, e.height || 100]
        })), r = Ne(Y), o = Be(Y, r), w = 30, b = 30, A = 5, pe = {};
        Y.forEach((e) => {
          var h;
          if (e && e.id) {
            const g = ((h = o[e.id]) == null ? void 0 : h.level) ?? 0;
            pe[g] || (pe[g] = []), pe[g].push(e);
          }
        });
        const ee = /* @__PURE__ */ new Map();
        Object.entries(pe).forEach(([e, h]) => {
          const g = parseInt(e);
          if (h && h.length > 0) {
            h.sort((p, F) => {
              const ne = p && p.id && o[p.id] ? o[p.id].order : 0, L = F && F.id && o[F.id] ? o[F.id].order : 0;
              return ne - L;
            });
            let se = ce;
            if (g > 0)
              for (let p = 0; p < g; p++) {
                const F = pe[p] || [], ne = Math.max(...F.map(
                  (L) => L && L._calculatedSize && L._calculatedSize[0] ? L._calculatedSize[0] : 150
                ));
                se += ne + w + A;
              }
            let oe = fe;
            h.forEach((p) => {
              p && p._calculatedSize && (ee.set(p.id, {
                x: se,
                y: oe,
                width: p._calculatedSize[0],
                height: p._calculatedSize[1]
              }), oe += p._calculatedSize[1] + b);
            });
          }
        }), i.forEach((e) => {
          const h = ee.get(e.id);
          h && s.push(h);
        });
        break;
      case "vertical-flow":
        const te = i.filter((e) => {
          if (!e) return !1;
          const h = e.pos || e.position || typeof e.x == "number" && typeof e.y == "number", g = e.size || e.width || e.height || typeof e.width == "number" && typeof e.height == "number";
          return !!h && !!g;
        });
        if (te.length < 2) break;
        const xe = Math.min(...te.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[0] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[0] : typeof e.x == "number" ? e.x : 0)), be = Math.min(...te.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[1] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[1] : typeof e.y == "number" ? e.y : 0)), ze = te.map((e) => ({
          ...e,
          pos: e.pos ? [...e.pos] : [e.x || 0, e.y || 0],
          _calculatedSize: e.size && Array.isArray(e.size) ? [e.size[0], e.size[1]] : [e.width || 150, e.height || 100]
        })), Re = Ne(ze), ke = Be(ze, Re), pt = 30, ht = 30, ut = 5, Se = {};
        ze.forEach((e) => {
          var h;
          if (e && e.id) {
            const g = ((h = ke[e.id]) == null ? void 0 : h.level) ?? 0;
            Se[g] || (Se[g] = []), Se[g].push(e);
          }
        });
        const Ue = /* @__PURE__ */ new Map();
        Object.entries(Se).forEach(([e, h]) => {
          const g = parseInt(e);
          if (h && h.length > 0) {
            h.sort((p, F) => {
              const ne = p && p.id && ke[p.id] ? ke[p.id].order : 0, L = F && F.id && ke[F.id] ? ke[F.id].order : 0;
              return ne - L;
            });
            let se = be;
            if (g > 0)
              for (let p = 0; p < g; p++) {
                const F = Se[p] || [], ne = Math.max(...F.map(
                  (L) => L && L._calculatedSize && L._calculatedSize[1] ? L._calculatedSize[1] : 100
                ));
                se += ne + pt + ut;
              }
            let oe = xe;
            h.forEach((p) => {
              p && p._calculatedSize && (Ue.set(p.id, {
                x: oe,
                y: se,
                width: p._calculatedSize[0],
                height: p._calculatedSize[1]
              }), oe += p._calculatedSize[0] + ht);
            });
          }
        }), i.forEach((e) => {
          const h = Ue.get(e.id);
          h && s.push(h);
        });
        break;
      case "width-max":
      case "width-min":
      case "height-max":
      case "height-min":
      case "size-max":
      case "size-min":
        i.forEach((e) => {
          let h = 150, g = 100;
          e.size && Array.isArray(e.size) ? (e.size[0] && (h = e.size[0]), e.size[1] && (g = e.size[1])) : (typeof e.width == "number" && (h = e.width), typeof e.height == "number" && (g = e.height), e.properties && (typeof e.properties.width == "number" && (h = e.properties.width), typeof e.properties.height == "number" && (g = e.properties.height)));
          let se = h, oe = g;
          if (a === "width-max" || a === "size-max")
            se = Math.max(...i.map((p) => p.size && Array.isArray(p.size) && p.size[0] ? p.size[0] : typeof p.width == "number" ? p.width : p.properties && typeof p.properties.width == "number" ? p.properties.width : 150));
          else if (a === "width-min")
            se = Math.min(...i.map((p) => p.size && Array.isArray(p.size) && p.size[0] ? p.size[0] : typeof p.width == "number" ? p.width : p.properties && typeof p.properties.width == "number" ? p.properties.width : 150));
          else if (a === "size-min") {
            const p = V.get(e) || e.computeSize;
            if (p)
              try {
                const F = p.call(e);
                F && F.length >= 2 && F[0] !== void 0 && F[1] !== void 0 ? (se = F[0], oe = F[1] + 30) : typeof F == "number" ? (se = h, oe = F + 30) : (se = h, oe = g);
              } catch {
                se = h, oe = g;
              }
          }
          if (a === "height-max" || a === "size-max")
            oe = Math.max(...i.map((p) => p.size && Array.isArray(p.size) && p.size[1] ? p.size[1] : typeof p.height == "number" ? p.height : p.properties && typeof p.properties.height == "number" ? p.properties.height : 100));
          else if (a === "height-min") {
            const p = Math.min(...i.map((L) => L.size && L.size[1] !== void 0 ? L.size[1] : typeof L.height == "number" ? L.height : L.properties && typeof L.properties.height == "number" ? L.properties.height : 100)), F = V.get(e) || e.computeSize;
            let ne = null;
            if (F)
              try {
                const L = F.call(e);
                L && L.length >= 2 && L[1] !== void 0 ? ne = L[1] + 30 : typeof L == "number" && (ne = L + 30);
              } catch {
              }
            oe = ne && ne > p ? ne : p;
          }
          s.push({
            x: e.pos[0],
            y: e.pos[1],
            width: se,
            height: oe
          });
        });
        break;
    }
    return s;
  }
  function Le() {
    var l;
    if (!((l = window.app) != null && l.graph)) return;
    d = Object.values(window.app.graph._nodes || {}).filter((m) => m && m.is_selected);
    const i = d.length > 1;
    i || Me(), z && z.classList.toggle("hk-has-selection", i);
    const s = N == null ? void 0 : N.querySelectorAll(".hk-button");
    s == null || s.forEach((m) => {
      m.disabled = !i;
    });
  }
  function Ne(a) {
    const i = {}, s = a.filter((l) => l && (l.id !== void 0 || l.id !== null));
    return s.forEach((l) => {
      const m = l.id || `node_${s.indexOf(l)}`;
      l.id = m, i[m] = { inputs: [], outputs: [] }, l.inputs && Array.isArray(l.inputs) && l.inputs.forEach((f, E) => {
        f && f.link !== null && f.link !== void 0 && i[m].inputs.push({
          index: E,
          link: f.link,
          sourceNode: st(f.link, s)
        });
      }), l.outputs && Array.isArray(l.outputs) && l.outputs.forEach((f, E) => {
        f && f.links && Array.isArray(f.links) && f.links.length > 0 && f.links.forEach((c) => {
          const u = ot(c, s);
          u && i[m].outputs.push({
            index: E,
            link: c,
            targetNode: u
          });
        });
      });
    }), i;
  }
  function st(a, i) {
    for (const s of i)
      if (s && s.outputs && Array.isArray(s.outputs)) {
        for (const l of s.outputs)
          if (l && l.links && Array.isArray(l.links) && l.links.includes(a))
            return s;
      }
    return null;
  }
  function ot(a, i) {
    for (const s of i)
      if (s && s.inputs && Array.isArray(s.inputs)) {
        for (const l of s.inputs)
          if (l && l.link === a)
            return s;
      }
    return null;
  }
  function Be(a, i) {
    const s = {}, l = /* @__PURE__ */ new Set(), m = a.filter((u) => u && u.id), f = m.filter((u) => {
      const S = u.id;
      return !i[S] || !i[S].inputs.length || i[S].inputs.every((y) => !y.sourceNode);
    });
    f.length === 0 && m.length > 0 && f.push(m[0]);
    const E = f.map((u) => ({ node: u, level: 0 }));
    for (; E.length > 0; ) {
      const { node: u, level: S } = E.shift();
      !u || !u.id || l.has(u.id) || (l.add(u.id), s[u.id] = { level: S, order: 0 }, i[u.id] && i[u.id].outputs && i[u.id].outputs.forEach((y) => {
        y && y.targetNode && y.targetNode.id && !l.has(y.targetNode.id) && E.push({ node: y.targetNode, level: S + 1 });
      }));
    }
    m.forEach((u) => {
      u && u.id && !s[u.id] && (s[u.id] = { level: 0, order: 0 });
    });
    const c = {};
    return Object.entries(s).forEach(([u, S]) => {
      c[S.level] || (c[S.level] = []);
      const y = m.find((C) => C && C.id === u);
      y && c[S.level].push(y);
    }), Object.entries(c).forEach(([u, S]) => {
      S && S.length > 0 && (S.sort((y, C) => {
        const Z = y && y.pos && y.pos[1] ? y.pos[1] : 0, R = C && C.pos && C.pos[1] ? C.pos[1] : 0;
        return Z - R;
      }), S.forEach((y, C) => {
        y && y.id && s[y.id] && (s[y.id].order = C);
      }));
    }), s;
  }
  function de(a) {
    var i, s, l, m, f;
    if (d.length < 2) {
      ge("Please select at least 2 nodes to align", "warning");
      return;
    }
    try {
      const E = Math.min(...d.map((n) => n.pos[0])), c = Math.max(...d.map((n) => {
        let v = 150;
        return n.size && Array.isArray(n.size) && n.size[0] ? v = n.size[0] : typeof n.width == "number" ? v = n.width : n.properties && typeof n.properties.width == "number" && (v = n.properties.width), n.pos[0] + v;
      })), u = Math.min(...d.map((n) => n.pos[1])), S = Math.max(...d.map((n) => {
        let v = 100;
        return n.size && Array.isArray(n.size) && n.size[1] ? v = n.size[1] : typeof n.height == "number" ? v = n.height : n.properties && typeof n.properties.height == "number" && (v = n.properties.height), n.pos[1] + v;
      })), y = Math.max(...d.map((n) => {
        const v = $.get(n);
        if (v && v.width !== void 0) return v.width;
        let t = 150;
        return n.size && Array.isArray(n.size) && n.size[0] ? t = n.size[0] : typeof n.width == "number" ? t = n.width : n.properties && typeof n.properties.width == "number" && (t = n.properties.width), t;
      })), C = Math.min(...d.map((n) => {
        const v = $.get(n);
        if (v && v.width !== void 0) return v.width;
        let t = 150;
        return n.size && Array.isArray(n.size) && n.size[0] ? t = n.size[0] : typeof n.width == "number" ? t = n.width : n.properties && typeof n.properties.width == "number" && (t = n.properties.width), t;
      })), Z = Math.max(...d.map((n) => {
        const v = $.get(n);
        return v && v.height !== void 0 ? v.height : n.size && n.size[1] !== void 0 ? n.size[1] : typeof n.height == "number" ? n.height : n.properties && typeof n.properties.height == "number" ? n.properties.height : 100;
      })), R = Math.min(...d.map((n) => n.size && n.size[1] !== void 0 ? n.size[1] : typeof n.height == "number" ? n.height : n.properties && typeof n.properties.height == "number" ? n.properties.height : 100));
      let T;
      switch (a) {
        case "left":
          T = E;
          const n = [...d].sort((r, o) => r.pos[1] - o.pos[1]);
          let v = n[0].pos[1];
          n.forEach((r, o) => {
            let b = 100;
            r.size && Array.isArray(r.size) && r.size[1] ? b = r.size[1] : typeof r.height == "number" ? b = r.height : r.properties && typeof r.properties.height == "number" && (b = r.properties.height), r.pos[0] = T, r.pos[1] = v, typeof r.x == "number" && (r.x = r.pos[0]), typeof r.y == "number" && (r.y = r.pos[1]), v += b + 30;
          });
          break;
        case "right":
          T = c;
          const t = [...d].sort((r, o) => r.pos[1] - o.pos[1]);
          let x = t[0].pos[1];
          t.forEach((r, o) => {
            let b = 100, A = 150;
            r.size && Array.isArray(r.size) ? (r.size[1] && (b = r.size[1]), r.size[0] && (A = r.size[0])) : (typeof r.height == "number" && (b = r.height), typeof r.width == "number" && (A = r.width), r.properties && (typeof r.properties.height == "number" && (b = r.properties.height), typeof r.properties.width == "number" && (A = r.properties.width))), r.pos[0] = T - A, r.pos[1] = x, typeof r.x == "number" && (r.x = r.pos[0]), typeof r.y == "number" && (r.y = r.pos[1]), x += b + 30;
          });
          break;
        case "top":
          T = u;
          const B = [...d].sort((r, o) => r.pos[0] - o.pos[0]);
          let ce = B[0].pos[0];
          B.forEach((r, o) => {
            let b = 150;
            r.size && Array.isArray(r.size) && r.size[0] ? b = r.size[0] : typeof r.width == "number" ? b = r.width : r.properties && typeof r.properties.width == "number" && (b = r.properties.width), r.pos[1] = T, r.pos[0] = ce, typeof r.x == "number" && (r.x = r.pos[0]), typeof r.y == "number" && (r.y = r.pos[1]), ce += b + 30;
          });
          break;
        case "bottom":
          T = S;
          const fe = [...d].sort((r, o) => r.pos[0] - o.pos[0]);
          let Y = E;
          fe.forEach((r, o) => {
            let b = 150, A = 100;
            r.size && Array.isArray(r.size) ? (r.size[0] && (b = r.size[0]), r.size[1] && (A = r.size[1])) : (typeof r.width == "number" && (b = r.width), typeof r.height == "number" && (A = r.height), r.properties && (typeof r.properties.width == "number" && (b = r.properties.width), typeof r.properties.height == "number" && (A = r.properties.height)));
            const pe = T - A, ee = Y;
            r.pos[1] = pe, r.pos[0] = ee, typeof r.x == "number" && (r.x = r.pos[0]), typeof r.y == "number" && (r.y = r.pos[1]), Y += b + 30;
          });
          break;
        case "width-max":
          d.forEach((r) => {
            r.size && (r.size[0] = y);
          });
          break;
        case "width-min":
          d.forEach((r) => {
            r.size && (r.size[0] = C);
          });
          break;
        case "height-max":
          d.forEach((r) => {
            r.size && (r.size[1] = Z);
          });
          break;
        case "height-min":
          d.forEach((r) => {
            if (r.size) {
              const o = V.get(r) || r.computeSize;
              if (o) {
                const w = o.call(r);
                r.size[1] = Math.max(R, w[1]);
              }
            }
          });
          break;
        case "size-max":
          d.forEach((r) => {
            r.size && (r.size[0] = y, r.size[1] = Z);
          });
          break;
        case "size-min":
          d.forEach((r) => {
            if (r.size) {
              const o = V.get(r) || r.computeSize;
              if (o) {
                const w = o.call(r);
                r.size[0] = w[0], r.size[1] = w[1];
              }
            }
          });
          break;
        case "horizontal-flow":
          nt();
          return;
        // Don't continue to the success message at the bottom
        case "vertical-flow":
          lt();
          return;
      }
      try {
        (s = (i = window.app) == null ? void 0 : i.canvas) != null && s.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (m = (l = window.app) == null ? void 0 : l.graph) != null && m.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (f = window.app) != null && f.canvas && window.app.canvas.draw(!0, !0);
      } catch {
      }
    } catch {
      ge("Error during alignment", "error");
    }
  }
  function jt(a) {
  }
  function nt() {
    var a, i, s, l, m;
    try {
      const f = d.filter((t) => {
        if (!t) return !1;
        const x = t.pos || t.position || typeof t.x == "number" && typeof t.y == "number", B = t.size || t.width || t.height || typeof t.width == "number" && typeof t.height == "number";
        return !!x && !!B;
      });
      if (f.length < 2) {
        ge(`Not enough valid nodes: ${f.length}/${d.length} nodes are valid`, "warning");
        return;
      }
      const E = Math.min(...f.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[0] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[0] : typeof t.x == "number" ? t.x : 0)), c = Math.min(...f.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[1] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[1] : typeof t.y == "number" ? t.y : 0)), u = E, S = c;
      f.forEach((t) => {
        t.pos || (t.position && Array.isArray(t.position) ? t.pos = t.position : typeof t.x == "number" && typeof t.y == "number" ? t.pos = [t.x, t.y] : t.pos = [0, 0]), t._calculatedSize || (t.size && Array.isArray(t.size) ? t._calculatedSize = [t.size[0], t.size[1]] : typeof t.width == "number" && typeof t.height == "number" ? t._calculatedSize = [t.width, t.height] : t._calculatedSize = [150, 100]), Array.isArray(t.pos) || (t.pos = [0, 0]);
      });
      const y = Ne(f), C = Be(f, y), Z = 30, R = 30, T = 30, n = 5, v = {};
      f.forEach((t) => {
        var x;
        if (t && t.id) {
          const B = ((x = C[t.id]) == null ? void 0 : x.level) ?? 0;
          v[B] || (v[B] = []), v[B].push(t);
        }
      }), Object.entries(v).forEach(([t, x]) => {
        const B = parseInt(t);
        if (x && x.length > 0) {
          x.sort((o, w) => {
            const b = o && o.id && C[o.id] ? C[o.id].order : 0, A = w && w.id && C[w.id] ? C[w.id].order : 0;
            return b - A;
          });
          const ce = x.reduce((o, w, b) => {
            const A = w && w._calculatedSize && w._calculatedSize[1] ? w._calculatedSize[1] : 100;
            return o + A + (b < x.length - 1 ? T : 0);
          }, 0), fe = Math.max(...x.map(
            (o) => o && o._calculatedSize && o._calculatedSize[0] ? o._calculatedSize[0] : 150
          ));
          let Y = u;
          if (B > 0)
            for (let o = 0; o < B; o++) {
              const w = v[o] || [], b = Math.max(...w.map(
                (A) => A && A._calculatedSize && A._calculatedSize[0] ? A._calculatedSize[0] : 150
              ));
              Y += b + Z + n;
            }
          let r = S;
          x.forEach((o, w) => {
            if (o && o.pos && o._calculatedSize) {
              const b = [o.pos[0], o.pos[1]], A = [o._calculatedSize[0], o._calculatedSize[1]];
              o.pos[0] = Y, o.pos[1] = r, r += o._calculatedSize[1] + T, typeof o.x == "number" && (o.x = o.pos[0]), typeof o.y == "number" && (o.y = o.pos[1]);
            }
          });
        }
      });
      try {
        (i = (a = window.app) == null ? void 0 : a.canvas) != null && i.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (l = (s = window.app) == null ? void 0 : s.graph) != null && l.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (m = window.app) != null && m.canvas && window.app.canvas.draw(!0, !0);
      } catch {
      }
    } catch {
      ge("Error in horizontal flow alignment", "error");
    }
  }
  function lt() {
    var a, i, s, l, m;
    try {
      const f = d.filter((t) => {
        if (!t) return !1;
        const x = t.pos || t.position || typeof t.x == "number" && typeof t.y == "number", B = t.size || t.width || t.height || typeof t.width == "number" && typeof t.height == "number";
        return !!x && !!B;
      });
      if (f.length < 2) {
        ge(`Not enough valid nodes: ${f.length}/${d.length} nodes are valid`, "warning");
        return;
      }
      const E = Math.min(...f.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[0] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[0] : typeof t.x == "number" ? t.x : 0)), c = Math.min(...f.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[1] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[1] : typeof t.y == "number" ? t.y : 0)), u = E, S = c;
      f.forEach((t) => {
        t.pos || (t.position && Array.isArray(t.position) ? t.pos = t.position : typeof t.x == "number" && typeof t.y == "number" ? t.pos = [t.x, t.y] : t.pos = [0, 0]), t._calculatedSize || (t.size && Array.isArray(t.size) ? t._calculatedSize = [t.size[0], t.size[1]] : typeof t.width == "number" && typeof t.height == "number" ? t._calculatedSize = [t.width, t.height] : t._calculatedSize = [150, 100]), Array.isArray(t.pos) || (t.pos = [0, 0]);
      });
      const y = Ne(f), C = Be(f, y), Z = 30, R = 30, T = 30, n = 5, v = {};
      f.forEach((t) => {
        var x;
        if (t && t.id) {
          const B = ((x = C[t.id]) == null ? void 0 : x.level) ?? 0;
          v[B] || (v[B] = []), v[B].push(t);
        }
      }), Object.entries(v).forEach(([t, x]) => {
        const B = parseInt(t);
        if (x && x.length > 0) {
          x.sort((o, w) => {
            const b = o && o.id && C[o.id] ? C[o.id].order : 0, A = w && w.id && C[w.id] ? C[w.id].order : 0;
            return b - A;
          });
          const ce = x.reduce((o, w, b) => {
            const A = w && w._calculatedSize && w._calculatedSize[0] ? w._calculatedSize[0] : 150;
            return o + A + R;
          }, 0), fe = Math.max(...x.map(
            (o) => o && o._calculatedSize && o._calculatedSize[1] ? o._calculatedSize[1] : 100
          ));
          let Y = S;
          if (B > 0)
            for (let o = 0; o < B; o++) {
              const w = v[o] || [], b = Math.max(...w.map(
                (A) => A && A._calculatedSize && A._calculatedSize[1] ? A._calculatedSize[1] : 100
              ));
              Y += b + Z + n;
            }
          let r = u;
          x.forEach((o, w) => {
            if (o && o.pos && o._calculatedSize) {
              const b = [o.pos[0], o.pos[1]], A = [o._calculatedSize[0], o._calculatedSize[1]];
              o.pos[0] = r, o.pos[1] = Y, r += o._calculatedSize[0] + R, typeof o.x == "number" && (o.x = o.pos[0]), typeof o.y == "number" && (o.y = o.pos[1]);
            }
          });
        }
      });
      try {
        (i = (a = window.app) == null ? void 0 : a.canvas) != null && i.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (l = (s = window.app) == null ? void 0 : s.graph) != null && l.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (m = window.app) != null && m.canvas && window.app.canvas.draw(!0, !0);
      } catch {
      }
    } catch {
      ge("Error in vertical flow alignment", "error");
    }
  }
  function ge(a, i = "info") {
    const s = document.createElement("div");
    s.textContent = a, s.style.cssText = `
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
        `, document.body.appendChild(s), setTimeout(() => {
      s.style.opacity = "1", s.style.transform = "translateX(0)";
    }, 10), setTimeout(() => {
      s.style.opacity = "0", s.style.transform = "translateX(20px)", setTimeout(() => {
        s.parentNode && s.parentNode.removeChild(s);
      }, 300);
    }, 3e3);
  }
  function Ge() {
    var a;
    if (!((a = window.app) != null && a.canvas)) {
      setTimeout(Ge, 100);
      return;
    }
    window.app.canvas.canvas && (window.app.canvas.canvas.addEventListener("click", () => {
      setTimeout(Le, 10);
    }), window.app.canvas.canvas.addEventListener("mouseup", () => {
      setTimeout(Le, 10);
    }), document.addEventListener("keydown", (i) => {
      (i.ctrlKey || i.metaKey) && setTimeout(Le, 10);
    })), setInterval(Le, 500);
  }
  function ct(a) {
    if (a.ctrlKey || a.metaKey) {
      if (a.shiftKey && !a.altKey && (a.key === "H" || a.key === "h")) {
        a.preventDefault(), Ze();
        return;
      }
      if (a.shiftKey)
        switch (a.key) {
          case "ArrowLeft":
            a.preventDefault(), de("left");
            break;
          case "ArrowRight":
            a.preventDefault(), de("right");
            break;
          case "ArrowUp":
            a.preventDefault(), de("top");
            break;
          case "ArrowDown":
            a.preventDefault(), de("bottom");
            break;
        }
      else if (a.altKey)
        switch (a.key) {
          case "ArrowRight":
            a.preventDefault(), de("horizontal-flow");
            break;
          case "ArrowDown":
            a.preventDefault(), de("vertical-flow");
            break;
        }
    }
  }
  rt(), Ge(), document.addEventListener("keydown", ct);
}
