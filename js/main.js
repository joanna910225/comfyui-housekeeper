import { app as bt } from "../../../scripts/app.js";
import { ComponentWidgetImpl as yt, addWidget as Ct } from "../../../scripts/domWidget.js";
import { defineComponent as Ve, ref as ee, resolveDirective as xt, createElementBlock as Le, openBlock as ve, Fragment as qe, createElementVNode as pe, withDirectives as zt, createVNode as Fe, createBlock as Je, unref as j, normalizeClass as Qe, withCtx as Re, createTextVNode as et, toDisplayString as Me, renderList as kt, normalizeStyle as St, onMounted as it, nextTick as Et } from "vue";
import Xe from "primevue/button";
import { useI18n as rt } from "vue-i18n";
const At = { class: "toolbar" }, _t = { class: "color-picker" }, Mt = { class: "size-slider" }, Lt = ["value"], Ht = /* @__PURE__ */ Ve({
  __name: "ToolBar",
  props: {
    colors: {},
    initialColor: {},
    initialBrushSize: {},
    initialTool: {}
  },
  emits: ["tool-change", "color-change", "canvas-clear", "brush-size-change"],
  setup(E, { emit: L }) {
    const { t: _ } = rt(), B = E, v = L, re = B.colors || ["#000000", "#ff0000", "#0000ff", "#69a869", "#ffff00", "#ff00ff", "#00ffff"], X = ee(B.initialColor || "#000000"), T = ee(B.initialBrushSize || 5), V = ee(B.initialTool || "pen");
    function D(G) {
      V.value = G, v("tool-change", G);
    }
    function O(G) {
      X.value = G, v("color-change", G);
    }
    function q() {
      v("canvas-clear");
    }
    function x(G) {
      const U = G.target;
      T.value = Number(U.value), v("brush-size-change", T.value);
    }
    return (G, U) => {
      const fe = xt("tooltip");
      return ve(), Le(qe, null, [
        pe("div", At, [
          zt((ve(), Je(j(Xe), {
            class: Qe({ active: V.value === "pen" }),
            onClick: U[0] || (U[0] = (Z) => D("pen"))
          }, {
            default: Re(() => [
              et(Me(j(_)("vue-basic.pen")), 1)
            ]),
            _: 1
          }, 8, ["class"])), [
            [fe, { value: j(_)("vue-basic.pen-tooltip"), showDelay: 300 }]
          ]),
          Fe(j(Xe), { onClick: q }, {
            default: Re(() => [
              et(Me(j(_)("vue-basic.clear-canvas")), 1)
            ]),
            _: 1
          })
        ]),
        pe("div", _t, [
          (ve(!0), Le(qe, null, kt(j(re), (Z, W) => (ve(), Je(j(Xe), {
            key: W,
            class: Qe({ "color-button": !0, active: X.value === Z }),
            onClick: (we) => O(Z),
            type: "button",
            title: Z
          }, {
            default: Re(() => [
              pe("i", {
                class: "pi pi-circle-fill",
                style: St({ color: Z })
              }, null, 4)
            ]),
            _: 2
          }, 1032, ["class", "onClick", "title"]))), 128))
        ]),
        pe("div", Mt, [
          pe("label", null, Me(j(_)("vue-basic.brush-size")) + ": " + Me(T.value) + "px", 1),
          pe("input", {
            type: "range",
            min: "1",
            max: "50",
            value: T.value,
            onChange: U[1] || (U[1] = (Z) => x(Z))
          }, null, 40, Lt)
        ])
      ], 64);
    };
  }
}), Ye = (E, L) => {
  const _ = E.__vccOpts || E;
  for (const [B, v] of L)
    _[B] = v;
  return _;
}, Nt = /* @__PURE__ */ Ye(Ht, [["__scopeId", "data-v-cae98791"]]), Bt = { class: "drawing-board" }, Dt = { class: "canvas-container" }, Pt = ["width", "height"], Ft = /* @__PURE__ */ Ve({
  __name: "DrawingBoard",
  props: {
    width: {},
    height: {},
    initialColor: {},
    initialBrushSize: {}
  },
  emits: ["mounted", "drawing-start", "drawing", "drawing-end", "state-save", "canvas-clear"],
  setup(E, { expose: L, emit: _ }) {
    const B = E, v = B.width || 800, re = B.height || 500, X = B.initialColor || "#000000", T = B.initialBrushSize || 5, V = _, D = ee(!1), O = ee(0), q = ee(0), x = ee(null), G = ee(!1), U = ee(T), fe = ee(X), Z = ee(null), W = ee(null);
    it(() => {
      W.value && (x.value = W.value.getContext("2d"), we(), Et(() => {
        W.value && V("mounted", W.value);
      }));
    });
    function we() {
      x.value && (x.value.fillStyle = "#ffffff", x.value.fillRect(0, 0, v, re), he(), xe());
    }
    function he() {
      x.value && (G.value ? (x.value.globalCompositeOperation = "destination-out", x.value.strokeStyle = "rgba(0,0,0,1)") : (x.value.globalCompositeOperation = "source-over", x.value.strokeStyle = fe.value), x.value.lineWidth = U.value, x.value.lineJoin = "round", x.value.lineCap = "round");
    }
    function be(P) {
      D.value = !0;
      const { offsetX: ie, offsetY: K } = te(P);
      O.value = ie, q.value = K, x.value && (x.value.beginPath(), x.value.moveTo(O.value, q.value), x.value.arc(O.value, q.value, U.value / 2, 0, Math.PI * 2), x.value.fill(), V("drawing-start", {
        x: ie,
        y: K,
        tool: G.value ? "eraser" : "pen"
      }));
    }
    function ne(P) {
      if (!D.value || !x.value) return;
      const { offsetX: ie, offsetY: K } = te(P);
      x.value.beginPath(), x.value.moveTo(O.value, q.value), x.value.lineTo(ie, K), x.value.stroke(), O.value = ie, q.value = K, V("drawing", {
        x: ie,
        y: K,
        tool: G.value ? "eraser" : "pen"
      });
    }
    function H() {
      D.value && (D.value = !1, xe(), V("drawing-end"));
    }
    function te(P) {
      let ie = 0, K = 0;
      if ("touches" in P) {
        if (P.preventDefault(), W.value) {
          const ke = W.value.getBoundingClientRect();
          ie = P.touches[0].clientX - ke.left, K = P.touches[0].clientY - ke.top;
        }
      } else
        ie = P.offsetX, K = P.offsetY;
      return { offsetX: ie, offsetY: K };
    }
    function de(P) {
      P.preventDefault();
      const K = {
        touches: [P.touches[0]]
      };
      be(K);
    }
    function Ce(P) {
      if (P.preventDefault(), !D.value) return;
      const K = {
        touches: [P.touches[0]]
      };
      ne(K);
    }
    function Ie(P) {
      G.value = P === "eraser", he();
    }
    function He(P) {
      fe.value = P, he();
    }
    function Te(P) {
      U.value = P, he();
    }
    function Oe() {
      x.value && (x.value.fillStyle = "#ffffff", x.value.fillRect(0, 0, v, re), he(), xe(), V("canvas-clear"));
    }
    function xe() {
      W.value && (Z.value = W.value.toDataURL("image/png"), Z.value && V("state-save", Z.value));
    }
    async function ze() {
      if (!W.value)
        throw new Error("Canvas is unable to get current data");
      return Z.value ? Z.value : W.value.toDataURL("image/png");
    }
    return L({
      setTool: Ie,
      setColor: He,
      setBrushSize: Te,
      clearCanvas: Oe,
      getCurrentCanvasData: ze
    }), (P, ie) => (ve(), Le("div", Bt, [
      pe("div", Dt, [
        pe("canvas", {
          ref_key: "canvas",
          ref: W,
          width: j(v),
          height: j(re),
          onMousedown: be,
          onMousemove: ne,
          onMouseup: H,
          onMouseleave: H,
          onTouchstart: de,
          onTouchmove: Ce,
          onTouchend: H
        }, null, 40, Pt)
      ])
    ]));
  }
}), Vt = /* @__PURE__ */ Ye(Ft, [["__scopeId", "data-v-ca1239fc"]]), It = { class: "drawing-app" }, Tt = /* @__PURE__ */ Ve({
  __name: "DrawingApp",
  props: {
    width: {},
    height: {},
    initialColor: {},
    initialBrushSize: {},
    availableColors: {}
  },
  emits: ["tool-change", "color-change", "brush-size-change", "drawing-start", "drawing", "drawing-end", "state-save", "mounted"],
  setup(E, { expose: L, emit: _ }) {
    const B = E, v = B.width || 800, re = B.height || 500, X = B.initialColor || "#000000", T = B.initialBrushSize || 5, V = B.availableColors || ["#000000", "#ff0000", "#0000ff", "#00ff00", "#ffff00", "#ff00ff", "#00ffff"], D = _, O = ee(null), q = ee(null);
    function x(H) {
      var te;
      (te = O.value) == null || te.setTool(H), D("tool-change", H);
    }
    function G(H) {
      var te;
      (te = O.value) == null || te.setColor(H), D("color-change", H);
    }
    function U(H) {
      var te;
      (te = O.value) == null || te.setBrushSize(H), D("brush-size-change", H);
    }
    function fe() {
      var H;
      (H = O.value) == null || H.clearCanvas();
    }
    function Z(H) {
      D("drawing-start", H);
    }
    function W(H) {
      D("drawing", H);
    }
    function we() {
      D("drawing-end");
    }
    function he(H) {
      q.value = H, D("state-save", H);
    }
    function be(H) {
      D("mounted", H);
    }
    async function ne() {
      if (q.value)
        return q.value;
      if (O.value)
        try {
          return await O.value.getCurrentCanvasData();
        } catch (H) {
          throw console.error("unable to get canvas data:", H), new Error("unable to get canvas data");
        }
      throw new Error("get canvas data failed");
    }
    return L({
      getCanvasData: ne
    }), (H, te) => (ve(), Le("div", It, [
      Fe(Nt, {
        colors: j(V),
        initialColor: j(X),
        initialBrushSize: j(T),
        onToolChange: x,
        onColorChange: G,
        onBrushSizeChange: U,
        onCanvasClear: fe
      }, null, 8, ["colors", "initialColor", "initialBrushSize"]),
      Fe(Vt, {
        ref_key: "drawingBoard",
        ref: O,
        width: j(v),
        height: j(re),
        initialColor: j(X),
        initialBrushSize: j(T),
        onDrawingStart: Z,
        onDrawing: W,
        onDrawingEnd: we,
        onStateSave: he,
        onMounted: be
      }, null, 8, ["width", "height", "initialColor", "initialBrushSize"])
    ]));
  }
}), Ot = /* @__PURE__ */ Ye(Tt, [["__scopeId", "data-v-39bbf58b"]]), Zt = /* @__PURE__ */ Ve({
  __name: "VueExampleComponent",
  props: {
    widget: {}
  },
  setup(E) {
    const { t: L } = rt(), _ = ee(null), B = ee(null);
    E.widget.node;
    function v(X) {
      B.value = X, console.log("canvas state saved:", X.substring(0, 50) + "...");
    }
    async function re(X, T) {
      var V;
      try {
        if (!((V = window.app) != null && V.api))
          throw new Error("ComfyUI API not available");
        const D = await fetch(X).then((U) => U.blob()), O = `${T}_${Date.now()}.png`, q = new File([D], O), x = new FormData();
        return x.append("image", q), x.append("subfolder", "threed"), x.append("type", "temp"), console.log("Vue Component: Using window.app.api.fetchApi"), (await window.app.api.fetchApi("/upload/image", {
          method: "POST",
          body: x
        })).json();
      } catch (D) {
        throw console.error("Vue Component: Error uploading image:", D), D;
      }
    }
    return it(() => {
      E.widget.serializeValue = async (X, T) => {
        try {
          console.log("Vue Component: inside vue serializeValue"), console.log("node", X), console.log("index", T);
          const V = B.value;
          return V ? {
            image: `threed/${(await re(V, "test_vue_basic")).name} [temp]`
          } : (console.warn("Vue Component: No canvas data available"), { image: null });
        } catch (V) {
          return console.error("Vue Component: Error in serializeValue:", V), { image: null };
        }
      };
    }), (X, T) => (ve(), Le("div", null, [
      pe("h1", null, Me(j(L)("vue-basic.title")), 1),
      pe("div", null, [
        Fe(Ot, {
          ref_key: "drawingAppRef",
          ref: _,
          width: 300,
          height: 300,
          onStateSave: v
        }, null, 512)
      ])
    ]));
  }
}), tt = "data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M4.88822%2014.1929C2.49999%2014.9929%201.36569%2011.6929%202.36088%2010.5C2.85843%209.83333%204.58971%207.89286%207.37597%204.69286C10.8588%200.692857%2012.849%202.19286%2014.3416%202.69286C15.8343%203.19286%2019.8146%207.19286%2020.8097%208.19286C21.8048%209.19286%2022.3024%2010.5%2021.8048%2011.5C21.4068%2012.3%2019.4431%2012.6667%2018.7797%2012.5C19.7748%2013%2021.3073%2017.1929%2021.8048%2018.6929C22.2028%2019.8929%2021.3073%2021.1667%2020.8097%2021.5C20.3122%2021.6667%2018.919%2022%2017.3269%2022C15.3367%2022%2015.8343%2019.6929%2016.3318%2017.1929C16.8293%2014.6929%2014.3416%2014.6929%2011.8539%2015.6929C9.36615%2016.6929%209.8637%2017.6929%2010.8588%2018.1929C11.8539%2018.6929%2011.8141%2020.1929%2011.3166%2021.1929C10.8191%2022.1929%206.83869%2022.1929%205.84359%2021.1929C5.07774%2020.4232%206.1292%2015.7356%206.80082%2013.4517C6.51367%2013.6054%205.93814%2013.8412%204.88822%2014.1929Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", $t = "data:image/svg+xml,%3csvg%20width='33'%20height='32'%20viewBox='0%200%2033%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M9.73332%2028C9.73332%2028.3536%209.59284%2028.6928%209.34279%2028.9428C9.09274%2029.1929%208.75361%2029.3333%208.39998%2029.3333C8.04636%2029.3333%207.70722%2029.1929%207.45717%2028.9428C7.20713%2028.6928%207.06665%2028.3536%207.06665%2028V4C7.06665%203.64638%207.20713%203.30724%207.45717%203.05719C7.70722%202.80714%208.04636%202.66667%208.39998%202.66667C8.75361%202.66667%209.09274%202.80714%209.34279%203.05719C9.59284%203.30724%209.73332%203.64638%209.73332%204V28ZM15.0667%2012C14.3594%2012%2013.6811%2011.719%2013.181%2011.219C12.6809%2010.7189%2012.4%2010.0406%2012.4%209.33333C12.4%208.62609%2012.6809%207.94781%2013.181%207.44771C13.6811%206.94762%2014.3594%206.66667%2015.0667%206.66667H23.0667C23.7739%206.66667%2024.4522%206.94762%2024.9523%207.44771C25.4524%207.94781%2025.7333%208.62609%2025.7333%209.33333C25.7333%2010.0406%2025.4524%2010.7189%2024.9523%2011.219C24.4522%2011.719%2023.7739%2012%2023.0667%2012H15.0667ZM15.0667%2016H20.4C21.1072%2016%2021.7855%2016.281%2022.2856%2016.781C22.7857%2017.2811%2023.0667%2017.9594%2023.0667%2018.6667C23.0667%2019.3739%2022.7857%2020.0522%2022.2856%2020.5523C21.7855%2021.0524%2021.1072%2021.3333%2020.4%2021.3333H15.0667C14.3594%2021.3333%2013.6811%2021.0524%2013.181%2020.5523C12.6809%2020.0522%2012.4%2019.3739%2012.4%2018.6667C12.4%2017.9594%2012.6809%2017.2811%2013.181%2016.781C13.6811%2016.281%2014.3594%2016%2015.0667%2016Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", Rt = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M22.6667%2028C22.6667%2028.3536%2022.5262%2028.6928%2022.2761%2028.9428C22.0261%2029.1929%2021.687%2029.3333%2021.3333%2029.3333C20.9797%2029.3333%2020.6406%2029.1929%2020.3905%2028.9428C20.1405%2028.6928%2020%2028.3536%2020%2028V4C20%203.64638%2020.1405%203.30724%2020.3905%203.05719C20.6406%202.80714%2020.9797%202.66667%2021.3333%202.66667C21.687%202.66667%2022.0261%202.80714%2022.2761%203.05719C22.5262%203.30724%2022.6667%203.64638%2022.6667%204V28ZM14.6667%206.66667C15.3739%206.66667%2016.0522%206.94762%2016.5523%207.44771C17.0524%207.94781%2017.3333%208.62609%2017.3333%209.33333C17.3333%2010.0406%2017.0524%2010.7189%2016.5523%2011.219C16.0522%2011.719%2015.3739%2012%2014.6667%2012H6.66667C5.95942%2012%205.28115%2011.719%204.78105%2011.219C4.28095%2010.7189%204%2010.0406%204%209.33333C4%208.62609%204.28095%207.94781%204.78105%207.44771C5.28115%206.94762%205.95942%206.66667%206.66667%206.66667H14.6667ZM14.6667%2016C15.3739%2016%2016.0522%2016.281%2016.5523%2016.781C17.0524%2017.2811%2017.3333%2017.9594%2017.3333%2018.6667C17.3333%2019.3739%2017.0524%2020.0522%2016.5523%2020.5523C16.0522%2021.0524%2015.3739%2021.3333%2014.6667%2021.3333H9.33333C8.62609%2021.3333%207.94781%2021.0524%207.44772%2020.5523C6.94762%2020.0522%206.66667%2019.3739%206.66667%2018.6667C6.66667%2017.9594%206.94762%2017.2811%207.44772%2016.781C7.94781%2016.281%208.62609%2016%209.33333%2016H14.6667Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", Xt = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M6.39992%204H25.5999C26.1893%204%2026.6666%204.59733%2026.6666%205.33333C26.6666%206.06933%2026.1893%206.66667%2025.5999%206.66667H6.39992C5.81059%206.66667%205.33325%206.06933%205.33325%205.33333C5.33325%204.59733%205.81059%204%206.39992%204ZM9.33325%2012C9.33325%2011.2928%209.6142%2010.6145%2010.1143%2010.1144C10.6144%209.61428%2011.2927%209.33333%2011.9999%209.33333C12.7072%209.33333%2013.3854%209.61428%2013.8855%2010.1144C14.3856%2010.6145%2014.6666%2011.2928%2014.6666%2012V25.3333C14.6666%2026.0406%2014.3856%2026.7189%2013.8855%2027.219C13.3854%2027.719%2012.7072%2028%2011.9999%2028C11.2927%2028%2010.6144%2027.719%2010.1143%2027.219C9.6142%2026.7189%209.33325%2026.0406%209.33325%2025.3333V12ZM17.3333%2012C17.3333%2011.2928%2017.6142%2010.6145%2018.1143%2010.1144C18.6144%209.61428%2019.2927%209.33333%2019.9999%209.33333C20.7072%209.33333%2021.3854%209.61428%2021.8855%2010.1144C22.3856%2010.6145%2022.6666%2011.2928%2022.6666%2012V20C22.6666%2020.7072%2022.3856%2021.3855%2021.8855%2021.8856C21.3854%2022.3857%2020.7072%2022.6667%2019.9999%2022.6667C19.2927%2022.6667%2018.6144%2022.3857%2018.1143%2021.8856C17.6142%2021.3855%2017.3333%2020.7072%2017.3333%2020V12Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", Yt = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M6.39992%2025.3333H25.5999C26.1893%2025.3333%2026.6666%2025.9307%2026.6666%2026.6667C26.6666%2027.4027%2026.1893%2028%2025.5999%2028H6.39992C5.81059%2028%205.33325%2027.4027%205.33325%2026.6667C5.33325%2025.9307%205.81059%2025.3333%206.39992%2025.3333ZM14.6666%2020C14.6666%2020.7072%2014.3856%2021.3855%2013.8855%2021.8856C13.3854%2022.3857%2012.7072%2022.6667%2011.9999%2022.6667C11.2927%2022.6667%2010.6144%2022.3857%2010.1143%2021.8856C9.6142%2021.3855%209.33325%2020.7072%209.33325%2020V6.66667C9.33325%205.95942%209.6142%205.28115%2010.1143%204.78105C10.6144%204.28095%2011.2927%204%2011.9999%204C12.7072%204%2013.3854%204.28095%2013.8855%204.78105C14.3856%205.28115%2014.6666%205.95942%2014.6666%206.66667V20ZM22.6666%2020C22.6666%2020.7072%2022.3856%2021.3855%2021.8855%2021.8856C21.3854%2022.3857%2020.7072%2022.6667%2019.9999%2022.6667C19.2927%2022.6667%2018.6144%2022.3857%2018.1143%2021.8856C17.6142%2021.3855%2017.3333%2020.7072%2017.3333%2020V12C17.3333%2011.2928%2017.6142%2010.6145%2018.1143%2010.1144C18.6144%209.61428%2019.2927%209.33333%2019.9999%209.33333C20.7072%209.33333%2021.3854%209.61428%2021.8855%2010.1144C22.3856%2010.6145%2022.6666%2011.2928%2022.6666%2012V20Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", Gt = "data:image/svg+xml,%3csvg%20width='33'%20height='32'%20viewBox='0%200%2033%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M3.80005%2024.7791V6.22093C3.80005%205.54663%204.41923%205%205.18303%205C5.94683%205%206.56601%205.54663%206.56601%206.22093V24.7791C6.56601%2025.4534%205.94683%2026%205.18303%2026C4.41923%2026%203.80005%2025.4534%203.80005%2024.7791Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M7.49597%2016.1488L10.3015%2018.9352C10.6394%2019.2708%2011.2681%2019.0598%2011.2681%2018.6107V17.6976H22.332V18.6107C22.332%2019.0598%2022.9607%2019.2708%2023.2986%2018.9352L26.1041%2016.1488C26.4767%2015.7787%2026.4767%2015.221%2026.1041%2014.851L23.2986%2012.0646C22.9607%2011.729%2022.332%2011.94%2022.332%2012.3891V13.3022H11.2681V12.3891C11.2681%2011.94%2010.6394%2011.729%2010.3015%2012.0646L7.49597%2014.851C7.12335%2015.221%207.12335%2015.7787%207.49597%2016.1488Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M27.0341%2024.7791V6.22093C27.0341%205.54663%2027.6533%205%2028.4171%205C29.1809%205%2029.8%205.54663%2029.8%206.22093V24.7791C29.8%2025.4534%2029.1809%2026%2028.4171%2026C27.6533%2026%2027.0341%2025.4534%2027.0341%2024.7791Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", Wt = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M3%2024.7791V6.22093C3%205.54663%203.61918%205%204.38298%205C5.14678%205%205.76596%205.54663%205.76596%206.22093V24.7791C5.76596%2025.4534%205.14678%2026%204.38298%2026C3.61918%2026%203%2025.4534%203%2024.7791Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M26.234%2024.7791V6.22093C26.234%205.54663%2026.8532%205%2027.617%205C28.3808%205%2029%205.54663%2029%206.22093V24.7791C29%2025.4534%2028.3808%2026%2027.617%2026C26.8532%2026%2026.234%2025.4534%2026.234%2024.7791Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M15.0141%2016.2491L12.2086%2019.0355C11.8706%2019.3711%2011.2419%2019.1601%2011.2419%2018.711V17.7979H6.71L6.71%2013.4025H11.2419V12.4894C11.2419%2012.0403%2011.8706%2011.8293%2012.2086%2012.1649L15.0141%2014.9513C15.3867%2015.3213%2015.3867%2015.879%2015.0141%2016.2491Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M16.9895%2016.2491L19.795%2019.0355C20.133%2019.3711%2020.7617%2019.1601%2020.7617%2018.711V17.7979H25.2936L25.2936%2013.4025H20.7617V12.4894C20.7617%2012.0403%2020.133%2011.8293%2019.795%2012.1649L16.9895%2014.9513C16.6169%2015.3213%2016.6169%2015.879%2016.9895%2016.2491Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", jt = "data:image/svg+xml,%3csvg%20width='33'%20height='32'%20viewBox='0%200%2033%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20x='0.399902'%20width='32'%20height='32'%20rx='4'%20fill='%23283540'/%3e%3cpath%20d='M25.179%2029H6.62083C5.94653%2029%205.3999%2028.3808%205.3999%2027.617C5.3999%2026.8532%205.94653%2026.234%206.62083%2026.234H25.179C25.8533%2026.234%2026.3999%2026.8532%2026.3999%2027.617C26.3999%2028.3808%2025.8533%2029%2025.179%2029Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M16.5487%2025.3041L19.3351%2022.4986C19.6707%2022.1606%2019.4597%2021.5319%2019.0106%2021.5319H18.0975V10.4681H19.0106C19.4597%2010.4681%2019.6707%209.83938%2019.3351%209.50144L16.5487%206.69593C16.1786%206.32331%2015.621%206.32331%2015.2509%206.69593L12.4645%209.50144C12.1289%209.83938%2012.3399%2010.4681%2012.789%2010.4681H13.7021V21.5319H12.789C12.3399%2021.5319%2012.1289%2022.1606%2012.4645%2022.4986L15.2509%2025.3041C15.621%2025.6767%2016.1786%2025.6767%2016.5487%2025.3041Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M25.179%205.76596H6.62083C5.94653%205.76596%205.3999%205.14678%205.3999%204.38298C5.3999%203.61918%205.94653%203%206.62083%203H25.179C25.8533%203%2026.3999%203.61918%2026.3999%204.38298C26.3999%205.14678%2025.8533%205.76596%2025.179%205.76596Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", Ut = "data:image/svg+xml,%3csvg%20width='33'%20height='32'%20viewBox='0%200%2033%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M7.82103%203H26.3792C27.0535%203%2027.6001%203.61918%2027.6001%204.38298C27.6001%205.14678%2027.0535%205.76596%2026.3792%205.76596H7.82103C7.14673%205.76596%206.6001%205.14678%206.6001%204.38298C6.6001%203.61918%207.14673%203%207.82103%203Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M7.82103%2026.234H26.3792C27.0535%2026.234%2027.6001%2026.8532%2027.6001%2027.617C27.6001%2028.3808%2027.0535%2029%2026.3792%2029H7.82103C7.14673%2029%206.6001%2028.3808%206.6001%2027.617C6.6001%2026.8532%207.14673%2026.234%207.82103%2026.234Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M16.351%2015.0141L13.5646%2012.2086C13.229%2011.8706%2013.44%2011.2419%2013.8891%2011.2419H14.8022V6.71L19.1976%206.71V11.2419H20.1107C20.5598%2011.2419%2020.7708%2011.8706%2020.4352%2012.2086L17.6488%2015.0141C17.2787%2015.3867%2016.7211%2015.3867%2016.351%2015.0141Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M16.351%2016.9895L13.5646%2019.795C13.229%2020.133%2013.44%2020.7617%2013.8891%2020.7617H14.8022V25.2936L19.1976%2025.2936V20.7617H20.1107C20.5598%2020.7617%2020.7708%2020.133%2020.4352%2019.795L17.6488%2016.9895C17.2787%2016.6169%2016.7211%2016.6169%2016.351%2016.9895Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", Kt = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M19.5201%206.18689C19.2052%205.87191%2019.4282%205.33334%2019.8737%205.33334H25.6666C26.2189%205.33334%2026.6666%205.78105%2026.6666%206.33334V12.1262C26.6666%2012.5717%2026.128%2012.7948%2025.813%2012.4798L23.9999%2010.6667L18.6666%2016L15.9999%2013.3333L21.3333%208L19.5201%206.18689ZM12.4797%2025.8131C12.7947%2026.1281%2012.5716%2026.6667%2012.1261%2026.6667H6.33325C5.78097%2026.6667%205.33325%2026.219%205.33325%2025.6667V19.8738C5.33325%2019.4283%205.87182%2019.2052%206.18681%2019.5202L7.99992%2021.3333L13.3333%2016L15.9999%2018.6667L10.6666%2024L12.4797%2025.8131Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", qt = "data:image/svg+xml,%3csvg%20width='33'%20height='32'%20viewBox='0%200%2033%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M14.8666%2016H9.07372C8.62827%2016%208.40519%2016.5386%208.72017%2016.8535L10.5333%2018.6667L5.19995%2024L7.86662%2026.6667L13.2%2021.3333L15.0131%2023.1464C15.328%2023.4614%2015.8666%2023.2383%2015.8666%2022.7929V17C15.8666%2016.4477%2015.4189%2016%2014.8666%2016Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M17.2%2015.6667H22.9929C23.4384%2015.6667%2023.6615%2015.1281%2023.3465%2014.8131L21.5334%2013L26.8667%207.66667L24.2%205L18.8667%2010.3333L17.0536%208.52022C16.7386%208.20524%2016.2%208.42832%2016.2%208.87377V14.6667C16.2%2015.219%2016.6477%2015.6667%2017.2%2015.6667Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", Jt = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M15.9999%2016C15.9999%2016.1427%2015.9692%2016.288%2015.9039%2016.4213C15.8398%2016.5595%2015.7376%2016.6766%2015.6092%2016.7587L6.46256%2022.5587C6.09456%2022.7907%205.6319%2022.6387%205.42923%2022.22C5.36471%2022.089%205.33183%2021.9447%205.33323%2021.7987V10.2013C5.33323%209.72132%205.67323%209.33333%206.09323%209.33333C6.22441%209.33264%206.35289%209.37067%206.46256%209.44266L15.6092%2015.2413C15.7325%2015.3252%2015.8328%2015.4385%2015.901%2015.571C15.9692%2015.7035%2016.0032%2015.851%2015.9999%2016V10.2C15.9999%209.71999%2016.3399%209.33199%2016.7599%209.33199C16.8911%209.33131%2017.0196%209.36934%2017.1292%209.44133L26.2759%2015.24C26.6426%2015.472%2026.7746%2016%2026.5706%2016.42C26.5065%2016.5582%2026.4042%2016.6752%2026.2759%2016.7573L17.1292%2022.5573C16.7612%2022.7893%2016.2986%2022.6373%2016.0959%2022.2187C16.0314%2022.0877%2015.9985%2021.9433%2015.9999%2021.7973V16Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", Qt = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M16%2016H21.8C21.9467%2016%2022.0934%2016.0333%2022.2214%2016.096C22.64%2016.2987%2022.792%2016.7627%2022.5587%2017.1293L16.76%2026.276C16.6814%2026.4%2016.564%2026.5027%2016.4227%2026.5707C16.004%2026.7747%2015.476%2026.6427%2015.2427%2026.276L9.4427%2017.1293C9.37118%2017.0195%209.33361%2016.891%209.33469%2016.76C9.33469%2016.34%209.7227%2016%2010.2027%2016H16ZM16%2016C15.6934%2016%2015.3987%2015.8587%2015.24%2015.6093L9.44003%206.46266C9.36898%206.3527%209.33188%206.22424%209.33336%206.09333C9.33336%205.67333%209.72136%205.33333%2010.2014%205.33333H21.7987C21.9454%205.33333%2022.092%205.36666%2022.22%205.42933C22.6387%205.63199%2022.7907%206.096%2022.5574%206.46266L16.7587%2015.6093C16.68%2015.7333%2016.5627%2015.836%2016.4214%2015.904C16.288%2015.9693%2016.1427%2016%2016.0014%2016'%20fill='%238BC3F3'/%3e%3c/svg%3e", at = bt;
at.registerExtension({
  name: "vue-basic",
  getCustomWidgets(E) {
    return {
      CUSTOM_VUE_COMPONENT_BASIC(L) {
        const _ = {
          name: "custom_vue_component_basic",
          type: "vue-basic"
        }, B = new yt({
          node: L,
          name: _.name,
          component: Zt,
          inputSpec: _,
          options: {}
        });
        return Ct(L, B), { widget: B };
      }
    };
  },
  nodeCreated(E) {
    if (E.constructor.comfyClass !== "vue-basic") return;
    const [L, _] = E.size;
    E.setSize([Math.max(L, 300), Math.max(_, 520)]);
  }
});
at.registerExtension({
  name: "housekeeper-alignment",
  async setup() {
    try {
      e2();
    } catch {
    }
  },
  nodeCreated(E) {
    E.constructor.comfyClass === "housekeeper-alignment" && (E.setSize([200, 100]), E.title && (E.title = "🎯 Alignment Panel Active"));
  }
});
function e2() {
  let E = null, L = null, _ = null, B = !1, v = [], re = [], X = [], T = 0;
  const V = /* @__PURE__ */ new WeakMap(), D = /* @__PURE__ */ new WeakMap();
  let O = null, q = !1;
  const x = 48, G = 24;
  function U() {
    return document.querySelector("#comfy-menu, .comfyui-menu, .litegraph-menu, .comfyui-toolbar");
  }
  function fe() {
    const r = U();
    if (!r)
      return x;
    const i = r.getBoundingClientRect();
    return !i || i.width === 0 && i.height === 0 ? x : Math.max(x, Math.ceil(i.bottom + 8));
  }
  function Z() {
    const r = fe(), i = window.innerHeight || document.documentElement.clientHeight || 0, s = Math.max(i - r - G, 280);
    document.documentElement.style.setProperty("--hk-top-offset", `${r}px`), document.documentElement.style.setProperty("--hk-panel-max-height", `${s}px`);
  }
  function W() {
    if (q || (q = !0, window.addEventListener("resize", Z), window.addEventListener("orientationchange", Z)), typeof ResizeObserver < "u") {
      const r = U();
      r && (O ? O.disconnect() : O = new ResizeObserver(() => Z()), O.observe(r));
    }
  }
  const we = [
    { type: "left", icon: $t, label: "Align left edges", group: "basic" },
    { type: "right", icon: Rt, label: "Align right edges", group: "basic" },
    { type: "top", icon: Xt, label: "Align top edges", group: "basic" },
    { type: "bottom", icon: Yt, label: "Align bottom edges", group: "basic" }
  ], he = [
    { type: "width-max", icon: Gt, label: "Match widest width", group: "size" },
    { type: "width-min", icon: Wt, label: "Match narrowest width", group: "size" },
    { type: "height-max", icon: jt, label: "Match tallest height", group: "size" },
    { type: "height-min", icon: Ut, label: "Match shortest height", group: "size" },
    { type: "size-max", icon: Kt, label: "Match largest size", group: "size" },
    { type: "size-min", icon: qt, label: "Match smallest size", group: "size" }
  ], be = [
    { type: "horizontal-flow", icon: Jt, label: "Distribute horizontally", group: "flow" },
    { type: "vertical-flow", icon: Qt, label: "Distribute vertically", group: "flow" }
  ], ne = [
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
  function H() {
    const r = "housekeeper-alignment-styles";
    if (document.getElementById(r)) return;
    const i = document.createElement("style");
    i.id = r, i.textContent = `
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
  H(), W(), Z();
  function te() {
    const r = document.createElement("section");
    return r.className = "housekeeper-section", r;
  }
  function de(r) {
    const i = document.createElement("p");
    return i.className = "housekeeper-subtitle", i.textContent = r, i;
  }
  function Ce(r, i) {
    const s = document.createElement("div");
    return s.className = `housekeeper-button-grid housekeeper-button-grid-${i}`, r.forEach((o) => {
      s.appendChild(Ie(o));
    }), s;
  }
  function Ie(r) {
    const i = document.createElement("button");
    i.type = "button", i.className = "hk-button", i.dataset.alignmentType = r.type, i.title = r.label, i.setAttribute("aria-label", r.label);
    const s = document.createElement("img");
    return s.src = r.icon, s.alt = "", s.draggable = !1, i.appendChild(s), i.addEventListener("mouseenter", () => je(r.type)), i.addEventListener("mouseleave", () => Ne()), i.addEventListener("focus", () => je(r.type)), i.addEventListener("blur", () => Ne()), i.addEventListener("click", () => ge(r.type)), i;
  }
  function He(r) {
    const i = r.replace("#", "");
    if (i.length === 3) {
      const s = parseInt(i[0] + i[0], 16), o = parseInt(i[1] + i[1], 16), p = parseInt(i[2] + i[2], 16);
      return { r: s, g: o, b: p };
    }
    return i.length === 6 ? {
      r: parseInt(i.slice(0, 2), 16),
      g: parseInt(i.slice(2, 4), 16),
      b: parseInt(i.slice(4, 6), 16)
    } : null;
  }
  function Te(r, i, s) {
    const o = (p) => Math.max(0, Math.min(255, Math.round(p))).toString(16).padStart(2, "0");
    return `#${o(r)}${o(i)}${o(s)}`;
  }
  function Oe(r) {
    const i = He(r);
    if (!i) return null;
    const s = i.r / 255, o = i.g / 255, p = i.b / 255, h = Math.max(s, o, p), g = Math.min(s, o, p), u = h - g;
    let l = 0;
    u !== 0 && (h === s ? l = (o - p) / u % 6 : h === o ? l = (p - s) / u + 2 : l = (s - o) / u + 4), l = Math.round(l * 60), l < 0 && (l += 360);
    const w = (h + g) / 2, y = u === 0 ? 0 : u / (1 - Math.abs(2 * w - 1));
    return { h: l, s: y, l: w };
  }
  function xe(r, i, s) {
    const o = (1 - Math.abs(2 * s - 1)) * i, p = o * (1 - Math.abs(r / 60 % 2 - 1)), h = s - o / 2;
    let g = 0, u = 0, l = 0;
    return 0 <= r && r < 60 ? (g = o, u = p, l = 0) : 60 <= r && r < 120 ? (g = p, u = o, l = 0) : 120 <= r && r < 180 ? (g = 0, u = o, l = p) : 180 <= r && r < 240 ? (g = 0, u = p, l = o) : 240 <= r && r < 300 ? (g = p, u = 0, l = o) : (g = o, u = 0, l = p), Te((g + h) * 255, (u + h) * 255, (l + h) * 255);
  }
  function ze(r, i) {
    const s = Oe(r);
    if (!s) return r;
    const o = Math.max(0, Math.min(1, s.l + i));
    return xe(s.h, s.s, o);
  }
  function P(r) {
    const i = He(r);
    return i ? ie(i) : 0;
  }
  function ie(r) {
    const i = (s) => {
      const o = s / 255;
      return o <= 0.03928 ? o / 12.92 : Math.pow((o + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * i(r.r) + 0.7152 * i(r.g) + 0.0722 * i(r.b);
  }
  function K(r, i, s, o = 6) {
    let p = i, h = 0;
    for (; Math.abs(P(r) - P(p)) < 0.08 && h < o; ) {
      const g = ze(p, s);
      if (g === p) break;
      p = g, h += 1;
    }
    return p;
  }
  function ke(r) {
    const s = r.startsWith("#") ? r : `#${r}`;
    let o = s, p = ze(s, -0.18), h = ze(s, 0.16);
    return p = K(o, p, -0.08), h = K(o, h, 0.08), {
      color: p,
      bgcolor: o,
      groupcolor: h
    };
  }
  function st(r) {
    var h, g, u;
    const i = [...v, ...re];
    if (!i.length) {
      me("Select nodes or groups to apply color", "warning");
      return;
    }
    const s = ke(r), o = /* @__PURE__ */ new Set();
    i.forEach((l) => {
      l != null && l.graph && o.add(l.graph);
    }), o.forEach((l) => {
      var w;
      return (w = l == null ? void 0 : l.beforeChange) == null ? void 0 : w.call(l);
    }), i.forEach((l) => {
      typeof l.setColorOption == "function" ? l.setColorOption(s) : (l.color = s.color, l.bgcolor = s.bgcolor, l.groupcolor = s.groupcolor);
    }), o.forEach((l) => {
      var w;
      return (w = l == null ? void 0 : l.afterChange) == null ? void 0 : w.call(l);
    });
    const p = ((h = window.LGraphCanvas) == null ? void 0 : h.active_canvas) ?? ((g = window.app) == null ? void 0 : g.canvas);
    (u = p == null ? void 0 : p.setDirty) == null || u.call(p, !0, !0);
  }
  function ot(r, i) {
    const s = (o) => {
      o == null || o.preventDefault(), st(i);
    };
    r.addEventListener("click", s), r.addEventListener("keydown", (o) => {
      (o.key === "Enter" || o.key === " ") && (o.preventDefault(), s());
    });
  }
  function Ge(r, i = !0) {
    const s = ke(r), o = s.bgcolor.toUpperCase(), p = document.createElement(i ? "button" : "div");
    return i && (p.type = "button", p.setAttribute("aria-label", `Apply color ${o}`), p.title = `Apply color ${o}`), p.className = "hk-color-chip", p.style.background = s.bgcolor, p.style.borderColor = s.color, p.dataset.colorHex = s.bgcolor, i && ot(p, r), p;
  }
  function We(r, i) {
    if (!ne.length) return;
    const s = ne.length, o = (i % s + s) % s;
    T = o;
    const p = ne[o];
    r.replaceChildren(), p.forEach((h) => {
      const g = Ge(h);
      r.appendChild(g);
    }), r.setAttribute("aria-label", `Color harmony palette ${o + 1} of ${s}`);
  }
  function nt() {
    E && (Z(), B = !0, E.classList.remove("collapsed"), E.classList.add("expanded"), setTimeout(() => {
      L == null || L.focus();
    }, 0));
  }
  function lt() {
    E && (B = !1, E.classList.remove("expanded"), E.classList.add("collapsed"), _ == null || _.focus());
  }
  function Ze(r) {
    (typeof r == "boolean" ? r : !B) ? nt() : lt();
  }
  function ct() {
    if (L) return;
    E = document.createElement("div"), E.className = "housekeeper-wrapper collapsed", _ = document.createElement("button"), _.type = "button", _.className = "housekeeper-handle", _.title = "Toggle Housekeeper panel (Ctrl+Shift+H)";
    const r = document.createElement("img");
    r.src = tt, r.alt = "", r.draggable = !1, _.appendChild(r);
    const i = document.createElement("span");
    i.textContent = "Housekeeper", _.appendChild(i), _.addEventListener("click", () => Ze()), L = document.createElement("div"), L.className = "housekeeper-panel", L.setAttribute("role", "region"), L.setAttribute("aria-label", "Housekeeper alignment tools"), L.tabIndex = -1;
    const s = document.createElement("div");
    s.className = "housekeeper-content";
    const o = document.createElement("div");
    o.className = "housekeeper-header";
    const p = document.createElement("div");
    p.className = "housekeeper-header-title";
    const h = document.createElement("img");
    h.src = tt, h.alt = "", h.draggable = !1, p.appendChild(h);
    const g = document.createElement("span");
    g.textContent = "Housekeeper", p.appendChild(g);
    const u = document.createElement("button");
    u.type = "button", u.className = "housekeeper-close", u.setAttribute("aria-label", "Hide Housekeeper panel"), u.innerHTML = "&times;", u.addEventListener("click", () => Ze(!1)), o.appendChild(p), o.appendChild(u);
    const l = document.createElement("div");
    l.className = "housekeeper-divider";
    const w = te();
    w.classList.add("housekeeper-section-primary"), w.appendChild(de("Basic Alignment")), w.appendChild(Ce(we, "basic")), w.appendChild(de("Size Adjustment")), w.appendChild(Ce(he, "size")), w.appendChild(de("Flow Alignment")), w.appendChild(Ce(be, "flow"));
    const y = (J, Q, Se = !0) => {
      const ye = document.createElement("div");
      return ye.className = Q, ye.setAttribute("role", "group"), J.forEach((Ee) => {
        const $e = Ge(Ee, Se);
        ye.appendChild($e);
      }), ye;
    }, k = te();
    k.appendChild(de("Color"));
    const $ = document.createElement("div");
    $.className = "housekeeper-color-carousel";
    const R = document.createElement("button");
    R.type = "button", R.className = "hk-palette-arrow hk-palette-arrow-prev", R.innerHTML = "&#9664;";
    const I = document.createElement("div");
    I.className = "housekeeper-color-strip", I.setAttribute("role", "group");
    const c = document.createElement("button");
    c.type = "button", c.className = "hk-palette-arrow hk-palette-arrow-next", c.innerHTML = "&#9654;", $.appendChild(R), $.appendChild(I), $.appendChild(c), k.appendChild($);
    const b = () => {
      const J = ne.length, Q = (T - 1 + J) % J, Se = (T + 1) % J;
      R.setAttribute("aria-label", `Show color set ${Q + 1} of ${J}`), c.setAttribute("aria-label", `Show color set ${Se + 1} of ${J}`);
    }, t = (J) => {
      const Q = ne.length;
      Q && (T = (T + J + Q) % Q, We(I, T), b());
    };
    R.addEventListener("click", () => t(-1)), c.addEventListener("click", () => t(1)), We(I, T), b();
    const S = document.createElement("div");
    S.className = "housekeeper-color-custom-row";
    const N = document.createElement("span");
    N.textContent = "Custom";
    const le = document.createElement("div");
    le.className = "hk-toggle-placeholder", S.appendChild(N), S.appendChild(le), k.appendChild(S);
    const ue = document.createElement("div");
    ue.className = "housekeeper-color-picker-placeholder";
    const Y = document.createElement("div");
    Y.className = "housekeeper-color-picker-toolbar";
    const a = document.createElement("div");
    a.className = "hk-swatch", a.style.background = "#000000";
    const n = document.createElement("div");
    n.className = "hk-swatch", n.style.background = "#ff4238";
    const C = document.createElement("div");
    C.className = "hk-slider-placeholder";
    const z = document.createElement("div");
    z.className = "hk-rgb-placeholder", ["R", "G", "B"].forEach((J) => {
      const Q = document.createElement("div");
      Q.className = "hk-rgb-pill", Q.textContent = J, z.appendChild(Q);
    }), Y.appendChild(a), Y.appendChild(n), Y.appendChild(C), Y.appendChild(z), ue.appendChild(Y), k.appendChild(ue), k.appendChild(de("On this page"));
    const A = y(
      ["#C9CCD1", "#5A7A9F", "#2E3136", "#6F7B89", "#4B6076", "#2B3F2F", "#2C3D4E", "#4C3C5A", "#3F2725", "#1E1E1F"],
      "housekeeper-color-footer"
    );
    k.appendChild(A), s.appendChild(o), s.appendChild(l), s.appendChild(w);
    const ce = document.createElement("div");
    ce.className = "housekeeper-divider housekeeper-divider-spaced", s.appendChild(ce), s.appendChild(k), L.appendChild(s), E.appendChild(_), E.appendChild(L), document.body.appendChild(E), W(), Z();
  }
  function je(r) {
    var o;
    if (v.length < 2) return;
    Ne();
    const i = (o = window.app) == null ? void 0 : o.canvas;
    if (!i) return;
    pt(r, v).forEach((p, h) => {
      if (p && v[h]) {
        const g = document.createElement("div");
        g.style.cssText = `
                    position: fixed;
                    background: rgba(74, 144, 226, 0.3);
                    border: 2px dashed rgba(74, 144, 226, 0.7);
                    border-radius: 4px;
                    z-index: 999;
                    pointer-events: none;
                    transition: all 0.2s ease;
                `;
        const u = (p.x + i.ds.offset[0]) * i.ds.scale, l = (p.y + i.ds.offset[1]) * i.ds.scale, w = i.canvas.parentElement, y = i.canvas.getBoundingClientRect(), k = w ? w.getBoundingClientRect() : null;
        k && y.top - k.top, y.top;
        const $ = document.querySelector("nav");
        let R = 31;
        $ && (R = $.getBoundingClientRect().height);
        const I = R * i.ds.scale, c = y.left + u, b = y.top + l - I, t = p.width * i.ds.scale, S = p.height * i.ds.scale;
        g.style.left = c + "px", g.style.top = b + "px", g.style.width = t + "px", g.style.height = S + "px", document.body.appendChild(g), X.push(g);
      }
    });
  }
  function Ne() {
    X.forEach((r) => {
      r.parentNode && r.parentNode.removeChild(r);
    }), X = [];
  }
  function pt(r, i) {
    if (i.length < 2) return [];
    const s = [], o = Math.min(...i.map((u) => u.pos[0])), p = Math.max(...i.map((u) => {
      let l = 150;
      return u.size && Array.isArray(u.size) && u.size[0] ? l = u.size[0] : typeof u.width == "number" ? l = u.width : u.properties && typeof u.properties.width == "number" && (l = u.properties.width), u.pos[0] + l;
    })), h = Math.min(...i.map((u) => u.pos[1])), g = Math.max(...i.map((u) => {
      let l = 100;
      return u.size && Array.isArray(u.size) && u.size[1] ? l = u.size[1] : typeof u.height == "number" ? l = u.height : u.properties && typeof u.properties.height == "number" && (l = u.properties.height), u.pos[1] + l;
    }));
    switch (r) {
      case "left":
        const u = [...i].sort((e, d) => e.pos[1] - d.pos[1]);
        let l = u[0].pos[1];
        const w = /* @__PURE__ */ new Map();
        u.forEach((e) => {
          let d = 100, m = 150;
          e.size && Array.isArray(e.size) ? (e.size[1] && (d = e.size[1]), e.size[0] && (m = e.size[0])) : (typeof e.height == "number" && (d = e.height), typeof e.width == "number" && (m = e.width), e.properties && (typeof e.properties.height == "number" && (d = e.properties.height), typeof e.properties.width == "number" && (m = e.properties.width))), w.set(e.id, {
            x: o,
            y: l,
            width: m,
            height: d
          }), l += d + 30;
        }), i.forEach((e) => {
          s.push(w.get(e.id));
        });
        break;
      case "right":
        const y = [...i].sort((e, d) => e.pos[1] - d.pos[1]);
        let k = y[0].pos[1];
        const $ = /* @__PURE__ */ new Map();
        y.forEach((e) => {
          let d = 100, m = 150;
          e.size && Array.isArray(e.size) ? (e.size[1] && (d = e.size[1]), e.size[0] && (m = e.size[0])) : (typeof e.height == "number" && (d = e.height), typeof e.width == "number" && (m = e.width), e.properties && (typeof e.properties.height == "number" && (d = e.properties.height), typeof e.properties.width == "number" && (m = e.properties.width))), $.set(e.id, {
            x: p - m,
            y: k,
            width: m,
            height: d
          }), k += d + 30;
        }), i.forEach((e) => {
          s.push($.get(e.id));
        });
        break;
      case "top":
        const R = [...i].sort((e, d) => e.pos[0] - d.pos[0]);
        let I = R[0].pos[0];
        const c = /* @__PURE__ */ new Map();
        R.forEach((e) => {
          let d = 100, m = 150;
          e.size && Array.isArray(e.size) ? (e.size[1] && (d = e.size[1]), e.size[0] && (m = e.size[0])) : (typeof e.height == "number" && (d = e.height), typeof e.width == "number" && (m = e.width), e.properties && (typeof e.properties.height == "number" && (d = e.properties.height), typeof e.properties.width == "number" && (m = e.properties.width))), c.set(e.id, {
            x: I,
            y: h,
            width: m,
            height: d
          }), I += m + 30;
        }), i.forEach((e) => {
          s.push(c.get(e.id));
        });
        break;
      case "bottom":
        const b = [...i].sort((e, d) => e.pos[0] - d.pos[0]);
        let t = o;
        const S = /* @__PURE__ */ new Map();
        b.forEach((e) => {
          let d = 100, m = 150;
          e.size && Array.isArray(e.size) ? (e.size[1] && (d = e.size[1]), e.size[0] && (m = e.size[0])) : (typeof e.height == "number" && (d = e.height), typeof e.width == "number" && (m = e.width), e.properties && (typeof e.properties.height == "number" && (d = e.properties.height), typeof e.properties.width == "number" && (m = e.properties.width))), S.set(e.id, {
            x: t,
            y: g - d,
            width: m,
            height: d
          }), t += m + 30;
        }), i.forEach((e) => {
          s.push(S.get(e.id));
        });
        break;
      case "horizontal-flow":
        const N = i.filter((e) => {
          if (!e) return !1;
          const d = e.pos || e.position || typeof e.x == "number" && typeof e.y == "number", m = e.size || e.width || e.height || typeof e.width == "number" && typeof e.height == "number";
          return !!d && !!m;
        });
        if (N.length < 2) break;
        const le = Math.min(...N.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[0] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[0] : typeof e.x == "number" ? e.x : 0)), ue = Math.min(...N.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[1] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[1] : typeof e.y == "number" ? e.y : 0)), Y = N.map((e) => ({
          ...e,
          pos: e.pos ? [...e.pos] : [e.x || 0, e.y || 0],
          _calculatedSize: e.size && Array.isArray(e.size) ? [e.size[0], e.size[1]] : [e.width || 150, e.height || 100]
        })), a = De(Y), n = Pe(Y, a), C = 30, z = 30, A = 5, ce = {};
        Y.forEach((e) => {
          var d;
          if (e && e.id) {
            const m = ((d = n[e.id]) == null ? void 0 : d.level) ?? 0;
            ce[m] || (ce[m] = []), ce[m].push(e);
          }
        });
        const J = /* @__PURE__ */ new Map();
        Object.entries(ce).forEach(([e, d]) => {
          const m = parseInt(e);
          if (d && d.length > 0) {
            d.sort((f, F) => {
              const oe = f && f.id && n[f.id] ? n[f.id].order : 0, M = F && F.id && n[F.id] ? n[F.id].order : 0;
              return oe - M;
            });
            let ae = le;
            if (m > 0)
              for (let f = 0; f < m; f++) {
                const F = ce[f] || [], oe = Math.max(...F.map(
                  (M) => M && M._calculatedSize && M._calculatedSize[0] ? M._calculatedSize[0] : 150
                ));
                ae += oe + C + A;
              }
            let se = ue;
            d.forEach((f) => {
              f && f._calculatedSize && (J.set(f.id, {
                x: ae,
                y: se,
                width: f._calculatedSize[0],
                height: f._calculatedSize[1]
              }), se += f._calculatedSize[1] + z);
            });
          }
        }), i.forEach((e) => {
          const d = J.get(e.id);
          d && s.push(d);
        });
        break;
      case "vertical-flow":
        const Q = i.filter((e) => {
          if (!e) return !1;
          const d = e.pos || e.position || typeof e.x == "number" && typeof e.y == "number", m = e.size || e.width || e.height || typeof e.width == "number" && typeof e.height == "number";
          return !!d && !!m;
        });
        if (Q.length < 2) break;
        const Se = Math.min(...Q.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[0] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[0] : typeof e.x == "number" ? e.x : 0)), ye = Math.min(...Q.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[1] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[1] : typeof e.y == "number" ? e.y : 0)), Ee = Q.map((e) => ({
          ...e,
          pos: e.pos ? [...e.pos] : [e.x || 0, e.y || 0],
          _calculatedSize: e.size && Array.isArray(e.size) ? [e.size[0], e.size[1]] : [e.width || 150, e.height || 100]
        })), $e = De(Ee), Ae = Pe(Ee, $e), mt = 30, vt = 30, wt = 5, _e = {};
        Ee.forEach((e) => {
          var d;
          if (e && e.id) {
            const m = ((d = Ae[e.id]) == null ? void 0 : d.level) ?? 0;
            _e[m] || (_e[m] = []), _e[m].push(e);
          }
        });
        const Ke = /* @__PURE__ */ new Map();
        Object.entries(_e).forEach(([e, d]) => {
          const m = parseInt(e);
          if (d && d.length > 0) {
            d.sort((f, F) => {
              const oe = f && f.id && Ae[f.id] ? Ae[f.id].order : 0, M = F && F.id && Ae[F.id] ? Ae[F.id].order : 0;
              return oe - M;
            });
            let ae = ye;
            if (m > 0)
              for (let f = 0; f < m; f++) {
                const F = _e[f] || [], oe = Math.max(...F.map(
                  (M) => M && M._calculatedSize && M._calculatedSize[1] ? M._calculatedSize[1] : 100
                ));
                ae += oe + mt + wt;
              }
            let se = Se;
            d.forEach((f) => {
              f && f._calculatedSize && (Ke.set(f.id, {
                x: se,
                y: ae,
                width: f._calculatedSize[0],
                height: f._calculatedSize[1]
              }), se += f._calculatedSize[0] + vt);
            });
          }
        }), i.forEach((e) => {
          const d = Ke.get(e.id);
          d && s.push(d);
        });
        break;
      case "width-max":
      case "width-min":
      case "height-max":
      case "height-min":
      case "size-max":
      case "size-min":
        i.forEach((e) => {
          let d = 150, m = 100;
          e.size && Array.isArray(e.size) ? (e.size[0] && (d = e.size[0]), e.size[1] && (m = e.size[1])) : (typeof e.width == "number" && (d = e.width), typeof e.height == "number" && (m = e.height), e.properties && (typeof e.properties.width == "number" && (d = e.properties.width), typeof e.properties.height == "number" && (m = e.properties.height)));
          let ae = d, se = m;
          if (r === "width-max" || r === "size-max")
            ae = Math.max(...i.map((f) => f.size && Array.isArray(f.size) && f.size[0] ? f.size[0] : typeof f.width == "number" ? f.width : f.properties && typeof f.properties.width == "number" ? f.properties.width : 150));
          else if (r === "width-min")
            ae = Math.min(...i.map((f) => f.size && Array.isArray(f.size) && f.size[0] ? f.size[0] : typeof f.width == "number" ? f.width : f.properties && typeof f.properties.width == "number" ? f.properties.width : 150));
          else if (r === "size-min") {
            const f = D.get(e) || e.computeSize;
            if (f)
              try {
                const F = f.call(e);
                F && F.length >= 2 && F[0] !== void 0 && F[1] !== void 0 ? (ae = F[0], se = F[1] + 30) : typeof F == "number" ? (ae = d, se = F + 30) : (ae = d, se = m);
              } catch {
                ae = d, se = m;
              }
          }
          if (r === "height-max" || r === "size-max")
            se = Math.max(...i.map((f) => f.size && Array.isArray(f.size) && f.size[1] ? f.size[1] : typeof f.height == "number" ? f.height : f.properties && typeof f.properties.height == "number" ? f.properties.height : 100));
          else if (r === "height-min") {
            const f = Math.min(...i.map((M) => M.size && M.size[1] !== void 0 ? M.size[1] : typeof M.height == "number" ? M.height : M.properties && typeof M.properties.height == "number" ? M.properties.height : 100)), F = D.get(e) || e.computeSize;
            let oe = null;
            if (F)
              try {
                const M = F.call(e);
                M && M.length >= 2 && M[1] !== void 0 ? oe = M[1] + 30 : typeof M == "number" && (oe = M + 30);
              } catch {
              }
            se = oe && oe > f ? oe : f;
          }
          s.push({
            x: e.pos[0],
            y: e.pos[1],
            width: ae,
            height: se
          });
        });
        break;
    }
    return s;
  }
  function Be() {
    var h;
    if (!((h = window.app) != null && h.graph)) return;
    const r = window.app.graph;
    v = Object.values(r._nodes || {}).filter((g) => g && g.is_selected), re = (Array.isArray(r._groups) ? r._groups : []).filter((g) => g && g.selected);
    const o = v.length > 1;
    v.length + re.length, o || Ne(), E && E.classList.toggle("hk-has-selection", o);
    const p = L == null ? void 0 : L.querySelectorAll(".hk-button");
    p == null || p.forEach((g) => {
      g.disabled = !o;
    });
  }
  function De(r) {
    const i = {}, s = r.filter((o) => o && (o.id !== void 0 || o.id !== null));
    return s.forEach((o) => {
      const p = o.id || `node_${s.indexOf(o)}`;
      o.id = p, i[p] = { inputs: [], outputs: [] }, o.inputs && Array.isArray(o.inputs) && o.inputs.forEach((h, g) => {
        h && h.link !== null && h.link !== void 0 && i[p].inputs.push({
          index: g,
          link: h.link,
          sourceNode: ht(h.link, s)
        });
      }), o.outputs && Array.isArray(o.outputs) && o.outputs.forEach((h, g) => {
        h && h.links && Array.isArray(h.links) && h.links.length > 0 && h.links.forEach((u) => {
          const l = ut(u, s);
          l && i[p].outputs.push({
            index: g,
            link: u,
            targetNode: l
          });
        });
      });
    }), i;
  }
  function ht(r, i) {
    for (const s of i)
      if (s && s.outputs && Array.isArray(s.outputs)) {
        for (const o of s.outputs)
          if (o && o.links && Array.isArray(o.links) && o.links.includes(r))
            return s;
      }
    return null;
  }
  function ut(r, i) {
    for (const s of i)
      if (s && s.inputs && Array.isArray(s.inputs)) {
        for (const o of s.inputs)
          if (o && o.link === r)
            return s;
      }
    return null;
  }
  function Pe(r, i) {
    const s = {}, o = /* @__PURE__ */ new Set(), p = r.filter((l) => l && l.id), h = p.filter((l) => {
      const w = l.id;
      return !i[w] || !i[w].inputs.length || i[w].inputs.every((y) => !y.sourceNode);
    });
    h.length === 0 && p.length > 0 && h.push(p[0]);
    const g = h.map((l) => ({ node: l, level: 0 }));
    for (; g.length > 0; ) {
      const { node: l, level: w } = g.shift();
      !l || !l.id || o.has(l.id) || (o.add(l.id), s[l.id] = { level: w, order: 0 }, i[l.id] && i[l.id].outputs && i[l.id].outputs.forEach((y) => {
        y && y.targetNode && y.targetNode.id && !o.has(y.targetNode.id) && g.push({ node: y.targetNode, level: w + 1 });
      }));
    }
    p.forEach((l) => {
      l && l.id && !s[l.id] && (s[l.id] = { level: 0, order: 0 });
    });
    const u = {};
    return Object.entries(s).forEach(([l, w]) => {
      u[w.level] || (u[w.level] = []);
      const y = p.find((k) => k && k.id === l);
      y && u[w.level].push(y);
    }), Object.entries(u).forEach(([l, w]) => {
      w && w.length > 0 && (w.sort((y, k) => {
        const $ = y && y.pos && y.pos[1] ? y.pos[1] : 0, R = k && k.pos && k.pos[1] ? k.pos[1] : 0;
        return $ - R;
      }), w.forEach((y, k) => {
        y && y.id && s[y.id] && (s[y.id].order = k);
      }));
    }), s;
  }
  function ge(r) {
    var i, s, o, p, h;
    if (v.length < 2) {
      me("Please select at least 2 nodes to align", "warning");
      return;
    }
    try {
      const g = Math.min(...v.map((c) => c.pos[0])), u = Math.max(...v.map((c) => {
        let b = 150;
        return c.size && Array.isArray(c.size) && c.size[0] ? b = c.size[0] : typeof c.width == "number" ? b = c.width : c.properties && typeof c.properties.width == "number" && (b = c.properties.width), c.pos[0] + b;
      })), l = Math.min(...v.map((c) => c.pos[1])), w = Math.max(...v.map((c) => {
        let b = 100;
        return c.size && Array.isArray(c.size) && c.size[1] ? b = c.size[1] : typeof c.height == "number" ? b = c.height : c.properties && typeof c.properties.height == "number" && (b = c.properties.height), c.pos[1] + b;
      })), y = Math.max(...v.map((c) => {
        const b = V.get(c);
        if (b && b.width !== void 0) return b.width;
        let t = 150;
        return c.size && Array.isArray(c.size) && c.size[0] ? t = c.size[0] : typeof c.width == "number" ? t = c.width : c.properties && typeof c.properties.width == "number" && (t = c.properties.width), t;
      })), k = Math.min(...v.map((c) => {
        const b = V.get(c);
        if (b && b.width !== void 0) return b.width;
        let t = 150;
        return c.size && Array.isArray(c.size) && c.size[0] ? t = c.size[0] : typeof c.width == "number" ? t = c.width : c.properties && typeof c.properties.width == "number" && (t = c.properties.width), t;
      })), $ = Math.max(...v.map((c) => {
        const b = V.get(c);
        return b && b.height !== void 0 ? b.height : c.size && c.size[1] !== void 0 ? c.size[1] : typeof c.height == "number" ? c.height : c.properties && typeof c.properties.height == "number" ? c.properties.height : 100;
      })), R = Math.min(...v.map((c) => c.size && c.size[1] !== void 0 ? c.size[1] : typeof c.height == "number" ? c.height : c.properties && typeof c.properties.height == "number" ? c.properties.height : 100));
      let I;
      switch (r) {
        case "left":
          I = g;
          const c = [...v].sort((a, n) => a.pos[1] - n.pos[1]);
          let b = c[0].pos[1];
          c.forEach((a, n) => {
            let z = 100;
            a.size && Array.isArray(a.size) && a.size[1] ? z = a.size[1] : typeof a.height == "number" ? z = a.height : a.properties && typeof a.properties.height == "number" && (z = a.properties.height), a.pos[0] = I, a.pos[1] = b, typeof a.x == "number" && (a.x = a.pos[0]), typeof a.y == "number" && (a.y = a.pos[1]), b += z + 30;
          });
          break;
        case "right":
          I = u;
          const t = [...v].sort((a, n) => a.pos[1] - n.pos[1]);
          let S = t[0].pos[1];
          t.forEach((a, n) => {
            let z = 100, A = 150;
            a.size && Array.isArray(a.size) ? (a.size[1] && (z = a.size[1]), a.size[0] && (A = a.size[0])) : (typeof a.height == "number" && (z = a.height), typeof a.width == "number" && (A = a.width), a.properties && (typeof a.properties.height == "number" && (z = a.properties.height), typeof a.properties.width == "number" && (A = a.properties.width))), a.pos[0] = I - A, a.pos[1] = S, typeof a.x == "number" && (a.x = a.pos[0]), typeof a.y == "number" && (a.y = a.pos[1]), S += z + 30;
          });
          break;
        case "top":
          I = l;
          const N = [...v].sort((a, n) => a.pos[0] - n.pos[0]);
          let le = N[0].pos[0];
          N.forEach((a, n) => {
            let z = 150;
            a.size && Array.isArray(a.size) && a.size[0] ? z = a.size[0] : typeof a.width == "number" ? z = a.width : a.properties && typeof a.properties.width == "number" && (z = a.properties.width), a.pos[1] = I, a.pos[0] = le, typeof a.x == "number" && (a.x = a.pos[0]), typeof a.y == "number" && (a.y = a.pos[1]), le += z + 30;
          });
          break;
        case "bottom":
          I = w;
          const ue = [...v].sort((a, n) => a.pos[0] - n.pos[0]);
          let Y = g;
          ue.forEach((a, n) => {
            let z = 150, A = 100;
            a.size && Array.isArray(a.size) ? (a.size[0] && (z = a.size[0]), a.size[1] && (A = a.size[1])) : (typeof a.width == "number" && (z = a.width), typeof a.height == "number" && (A = a.height), a.properties && (typeof a.properties.width == "number" && (z = a.properties.width), typeof a.properties.height == "number" && (A = a.properties.height)));
            const ce = I - A, J = Y;
            a.pos[1] = ce, a.pos[0] = J, typeof a.x == "number" && (a.x = a.pos[0]), typeof a.y == "number" && (a.y = a.pos[1]), Y += z + 30;
          });
          break;
        case "width-max":
          v.forEach((a) => {
            a.size && (a.size[0] = y);
          });
          break;
        case "width-min":
          v.forEach((a) => {
            a.size && (a.size[0] = k);
          });
          break;
        case "height-max":
          v.forEach((a) => {
            a.size && (a.size[1] = $);
          });
          break;
        case "height-min":
          v.forEach((a) => {
            if (a.size) {
              const n = D.get(a) || a.computeSize;
              if (n) {
                const C = n.call(a);
                a.size[1] = Math.max(R, C[1]);
              }
            }
          });
          break;
        case "size-max":
          v.forEach((a) => {
            a.size && (a.size[0] = y, a.size[1] = $);
          });
          break;
        case "size-min":
          v.forEach((a) => {
            if (a.size) {
              const n = D.get(a) || a.computeSize;
              if (n) {
                const C = n.call(a);
                a.size[0] = C[0], a.size[1] = C[1];
              }
            }
          });
          break;
        case "horizontal-flow":
          ft();
          return;
        // Don't continue to the success message at the bottom
        case "vertical-flow":
          dt();
          return;
      }
      try {
        (s = (i = window.app) == null ? void 0 : i.canvas) != null && s.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (p = (o = window.app) == null ? void 0 : o.graph) != null && p.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (h = window.app) != null && h.canvas && window.app.canvas.draw(!0, !0);
      } catch {
      }
    } catch {
      me("Error during alignment", "error");
    }
  }
  function t2(r) {
  }
  function ft() {
    var r, i, s, o, p;
    try {
      const h = v.filter((t) => {
        if (!t) return !1;
        const S = t.pos || t.position || typeof t.x == "number" && typeof t.y == "number", N = t.size || t.width || t.height || typeof t.width == "number" && typeof t.height == "number";
        return !!S && !!N;
      });
      if (h.length < 2) {
        me(`Not enough valid nodes: ${h.length}/${v.length} nodes are valid`, "warning");
        return;
      }
      const g = Math.min(...h.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[0] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[0] : typeof t.x == "number" ? t.x : 0)), u = Math.min(...h.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[1] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[1] : typeof t.y == "number" ? t.y : 0)), l = g, w = u;
      h.forEach((t) => {
        t.pos || (t.position && Array.isArray(t.position) ? t.pos = t.position : typeof t.x == "number" && typeof t.y == "number" ? t.pos = [t.x, t.y] : t.pos = [0, 0]), t._calculatedSize || (t.size && Array.isArray(t.size) ? t._calculatedSize = [t.size[0], t.size[1]] : typeof t.width == "number" && typeof t.height == "number" ? t._calculatedSize = [t.width, t.height] : t._calculatedSize = [150, 100]), Array.isArray(t.pos) || (t.pos = [0, 0]);
      });
      const y = De(h), k = Pe(h, y), $ = 30, R = 30, I = 30, c = 5, b = {};
      h.forEach((t) => {
        var S;
        if (t && t.id) {
          const N = ((S = k[t.id]) == null ? void 0 : S.level) ?? 0;
          b[N] || (b[N] = []), b[N].push(t);
        }
      }), Object.entries(b).forEach(([t, S]) => {
        const N = parseInt(t);
        if (S && S.length > 0) {
          S.sort((n, C) => {
            const z = n && n.id && k[n.id] ? k[n.id].order : 0, A = C && C.id && k[C.id] ? k[C.id].order : 0;
            return z - A;
          });
          const le = S.reduce((n, C, z) => {
            const A = C && C._calculatedSize && C._calculatedSize[1] ? C._calculatedSize[1] : 100;
            return n + A + (z < S.length - 1 ? I : 0);
          }, 0), ue = Math.max(...S.map(
            (n) => n && n._calculatedSize && n._calculatedSize[0] ? n._calculatedSize[0] : 150
          ));
          let Y = l;
          if (N > 0)
            for (let n = 0; n < N; n++) {
              const C = b[n] || [], z = Math.max(...C.map(
                (A) => A && A._calculatedSize && A._calculatedSize[0] ? A._calculatedSize[0] : 150
              ));
              Y += z + $ + c;
            }
          let a = w;
          S.forEach((n, C) => {
            if (n && n.pos && n._calculatedSize) {
              const z = [n.pos[0], n.pos[1]], A = [n._calculatedSize[0], n._calculatedSize[1]];
              n.pos[0] = Y, n.pos[1] = a, a += n._calculatedSize[1] + I, typeof n.x == "number" && (n.x = n.pos[0]), typeof n.y == "number" && (n.y = n.pos[1]);
            }
          });
        }
      });
      try {
        (i = (r = window.app) == null ? void 0 : r.canvas) != null && i.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (o = (s = window.app) == null ? void 0 : s.graph) != null && o.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (p = window.app) != null && p.canvas && window.app.canvas.draw(!0, !0);
      } catch {
      }
    } catch {
      me("Error in horizontal flow alignment", "error");
    }
  }
  function dt() {
    var r, i, s, o, p;
    try {
      const h = v.filter((t) => {
        if (!t) return !1;
        const S = t.pos || t.position || typeof t.x == "number" && typeof t.y == "number", N = t.size || t.width || t.height || typeof t.width == "number" && typeof t.height == "number";
        return !!S && !!N;
      });
      if (h.length < 2) {
        me(`Not enough valid nodes: ${h.length}/${v.length} nodes are valid`, "warning");
        return;
      }
      const g = Math.min(...h.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[0] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[0] : typeof t.x == "number" ? t.x : 0)), u = Math.min(...h.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[1] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[1] : typeof t.y == "number" ? t.y : 0)), l = g, w = u;
      h.forEach((t) => {
        t.pos || (t.position && Array.isArray(t.position) ? t.pos = t.position : typeof t.x == "number" && typeof t.y == "number" ? t.pos = [t.x, t.y] : t.pos = [0, 0]), t._calculatedSize || (t.size && Array.isArray(t.size) ? t._calculatedSize = [t.size[0], t.size[1]] : typeof t.width == "number" && typeof t.height == "number" ? t._calculatedSize = [t.width, t.height] : t._calculatedSize = [150, 100]), Array.isArray(t.pos) || (t.pos = [0, 0]);
      });
      const y = De(h), k = Pe(h, y), $ = 30, R = 30, I = 30, c = 5, b = {};
      h.forEach((t) => {
        var S;
        if (t && t.id) {
          const N = ((S = k[t.id]) == null ? void 0 : S.level) ?? 0;
          b[N] || (b[N] = []), b[N].push(t);
        }
      }), Object.entries(b).forEach(([t, S]) => {
        const N = parseInt(t);
        if (S && S.length > 0) {
          S.sort((n, C) => {
            const z = n && n.id && k[n.id] ? k[n.id].order : 0, A = C && C.id && k[C.id] ? k[C.id].order : 0;
            return z - A;
          });
          const le = S.reduce((n, C, z) => {
            const A = C && C._calculatedSize && C._calculatedSize[0] ? C._calculatedSize[0] : 150;
            return n + A + R;
          }, 0), ue = Math.max(...S.map(
            (n) => n && n._calculatedSize && n._calculatedSize[1] ? n._calculatedSize[1] : 100
          ));
          let Y = w;
          if (N > 0)
            for (let n = 0; n < N; n++) {
              const C = b[n] || [], z = Math.max(...C.map(
                (A) => A && A._calculatedSize && A._calculatedSize[1] ? A._calculatedSize[1] : 100
              ));
              Y += z + $ + c;
            }
          let a = l;
          S.forEach((n, C) => {
            if (n && n.pos && n._calculatedSize) {
              const z = [n.pos[0], n.pos[1]], A = [n._calculatedSize[0], n._calculatedSize[1]];
              n.pos[0] = a, n.pos[1] = Y, a += n._calculatedSize[0] + R, typeof n.x == "number" && (n.x = n.pos[0]), typeof n.y == "number" && (n.y = n.pos[1]);
            }
          });
        }
      });
      try {
        (i = (r = window.app) == null ? void 0 : r.canvas) != null && i.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (o = (s = window.app) == null ? void 0 : s.graph) != null && o.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (p = window.app) != null && p.canvas && window.app.canvas.draw(!0, !0);
      } catch {
      }
    } catch {
      me("Error in vertical flow alignment", "error");
    }
  }
  function me(r, i = "info") {
    const s = document.createElement("div");
    s.textContent = r, s.style.cssText = `
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
  function Ue() {
    var r;
    if (!((r = window.app) != null && r.canvas)) {
      setTimeout(Ue, 100);
      return;
    }
    window.app.canvas.canvas && (window.app.canvas.canvas.addEventListener("click", () => {
      setTimeout(Be, 10);
    }), window.app.canvas.canvas.addEventListener("mouseup", () => {
      setTimeout(Be, 10);
    }), document.addEventListener("keydown", (i) => {
      (i.ctrlKey || i.metaKey) && setTimeout(Be, 10);
    })), setInterval(Be, 500);
  }
  function gt(r) {
    if (r.ctrlKey || r.metaKey) {
      if (r.shiftKey && !r.altKey && (r.key === "H" || r.key === "h")) {
        r.preventDefault(), Ze();
        return;
      }
      if (r.shiftKey)
        switch (r.key) {
          case "ArrowLeft":
            r.preventDefault(), ge("left");
            break;
          case "ArrowRight":
            r.preventDefault(), ge("right");
            break;
          case "ArrowUp":
            r.preventDefault(), ge("top");
            break;
          case "ArrowDown":
            r.preventDefault(), ge("bottom");
            break;
        }
      else if (r.altKey)
        switch (r.key) {
          case "ArrowRight":
            r.preventDefault(), ge("horizontal-flow");
            break;
          case "ArrowDown":
            r.preventDefault(), ge("vertical-flow");
            break;
        }
    }
  }
  ct(), Ue(), document.addEventListener("keydown", gt);
}
