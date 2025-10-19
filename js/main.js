import { app as rt } from "../../../scripts/app.js";
import { ComponentWidgetImpl as at, addWidget as st } from "../../../scripts/domWidget.js";
import { defineComponent as Le, ref as K, resolveDirective as ot, createElementBlock as Se, openBlock as de, Fragment as Oe, createElementVNode as ne, withDirectives as lt, createVNode as Me, createBlock as Ze, unref as W, normalizeClass as Xe, withCtx as De, createTextVNode as Re, toDisplayString as ke, renderList as nt, normalizeStyle as ct, onMounted as We, nextTick as pt } from "vue";
import Ve from "primevue/button";
import { useI18n as Ge } from "vue-i18n";
const ht = { class: "toolbar" }, ut = { class: "color-picker" }, ft = { class: "size-slider" }, gt = ["value"], dt = /* @__PURE__ */ Le({
  __name: "ToolBar",
  props: {
    colors: {},
    initialColor: {},
    initialBrushSize: {},
    initialTool: {}
  },
  emits: ["tool-change", "color-change", "canvas-clear", "brush-size-change"],
  setup(z, { emit: B }) {
    const { t: _ } = Ge(), F = z, d = B, te = F.colors || ["#000000", "#ff0000", "#0000ff", "#69a869", "#ffff00", "#ff00ff", "#00ffff"], Z = K(F.initialColor || "#000000"), X = K(F.initialBrushSize || 5), P = K(F.initialTool || "pen");
    function V(R) {
      P.value = R, d("tool-change", R);
    }
    function I(R) {
      Z.value = R, d("color-change", R);
    }
    function q() {
      d("canvas-clear");
    }
    function C(R) {
      const T = R.target;
      X.value = Number(T.value), d("brush-size-change", X.value);
    }
    return (R, T) => {
      const ce = ot("tooltip");
      return de(), Se(Oe, null, [
        ne("div", ht, [
          lt((de(), Ze(W(Ve), {
            class: Xe({ active: P.value === "pen" }),
            onClick: T[0] || (T[0] = (G) => V("pen"))
          }, {
            default: De(() => [
              Re(ke(W(_)("vue-basic.pen")), 1)
            ]),
            _: 1
          }, 8, ["class"])), [
            [ce, { value: W(_)("vue-basic.pen-tooltip"), showDelay: 300 }]
          ]),
          Me(W(Ve), { onClick: q }, {
            default: De(() => [
              Re(ke(W(_)("vue-basic.clear-canvas")), 1)
            ]),
            _: 1
          })
        ]),
        ne("div", ut, [
          (de(!0), Se(Oe, null, nt(W(te), (G, U) => (de(), Ze(W(Ve), {
            key: U,
            class: Xe({ "color-button": !0, active: Z.value === G }),
            onClick: (me) => I(G),
            type: "button",
            title: G
          }, {
            default: De(() => [
              ne("i", {
                class: "pi pi-circle-fill",
                style: ct({ color: G })
              }, null, 4)
            ]),
            _: 2
          }, 1032, ["class", "onClick", "title"]))), 128))
        ]),
        ne("div", ft, [
          ne("label", null, ke(W(_)("vue-basic.brush-size")) + ": " + ke(X.value) + "px", 1),
          ne("input", {
            type: "range",
            min: "1",
            max: "50",
            value: X.value,
            onChange: T[1] || (T[1] = (G) => C(G))
          }, null, 40, gt)
        ])
      ], 64);
    };
  }
}), Pe = (z, B) => {
  const _ = z.__vccOpts || z;
  for (const [F, d] of B)
    _[F] = d;
  return _;
}, mt = /* @__PURE__ */ Pe(dt, [["__scopeId", "data-v-cae98791"]]), vt = { class: "drawing-board" }, wt = { class: "canvas-container" }, yt = ["width", "height"], Ct = /* @__PURE__ */ Le({
  __name: "DrawingBoard",
  props: {
    width: {},
    height: {},
    initialColor: {},
    initialBrushSize: {}
  },
  emits: ["mounted", "drawing-start", "drawing", "drawing-end", "state-save", "canvas-clear"],
  setup(z, { expose: B, emit: _ }) {
    const F = z, d = F.width || 800, te = F.height || 500, Z = F.initialColor || "#000000", X = F.initialBrushSize || 5, P = _, V = K(!1), I = K(0), q = K(0), C = K(null), R = K(!1), T = K(X), ce = K(Z), G = K(null), U = K(null);
    We(() => {
      U.value && (C.value = U.value.getContext("2d"), me(), pt(() => {
        U.value && P("mounted", U.value);
      }));
    });
    function me() {
      C.value && (C.value.fillStyle = "#ffffff", C.value.fillRect(0, 0, d, te), pe(), be());
    }
    function pe() {
      C.value && (R.value ? (C.value.globalCompositeOperation = "destination-out", C.value.strokeStyle = "rgba(0,0,0,1)") : (C.value.globalCompositeOperation = "source-over", C.value.strokeStyle = ce.value), C.value.lineWidth = T.value, C.value.lineJoin = "round", C.value.lineCap = "round");
    }
    function ue(N) {
      V.value = !0;
      const { offsetX: J, offsetY: $ } = Q(N);
      I.value = J, q.value = $, C.value && (C.value.beginPath(), C.value.moveTo(I.value, q.value), C.value.arc(I.value, q.value, T.value / 2, 0, Math.PI * 2), C.value.fill(), P("drawing-start", {
        x: J,
        y: $,
        tool: R.value ? "eraser" : "pen"
      }));
    }
    function oe(N) {
      if (!V.value || !C.value) return;
      const { offsetX: J, offsetY: $ } = Q(N);
      C.value.beginPath(), C.value.moveTo(I.value, q.value), C.value.lineTo(J, $), C.value.stroke(), I.value = J, q.value = $, P("drawing", {
        x: J,
        y: $,
        tool: R.value ? "eraser" : "pen"
      });
    }
    function E() {
      V.value && (V.value = !1, be(), P("drawing-end"));
    }
    function Q(N) {
      let J = 0, $ = 0;
      if ("touches" in N) {
        if (N.preventDefault(), U.value) {
          const fe = U.value.getBoundingClientRect();
          J = N.touches[0].clientX - fe.left, $ = N.touches[0].clientY - fe.top;
        }
      } else
        J = N.offsetX, $ = N.offsetY;
      return { offsetX: J, offsetY: $ };
    }
    function Be(N) {
      N.preventDefault();
      const $ = {
        touches: [N.touches[0]]
      };
      ue($);
    }
    function Ne(N) {
      if (N.preventDefault(), !V.value) return;
      const $ = {
        touches: [N.touches[0]]
      };
      oe($);
    }
    function Ce(N) {
      R.value = N === "eraser", pe();
    }
    function He(N) {
      ce.value = N, pe();
    }
    function Ae(N) {
      T.value = N, pe();
    }
    function ve() {
      C.value && (C.value.fillStyle = "#ffffff", C.value.fillRect(0, 0, d, te), pe(), be(), P("canvas-clear"));
    }
    function be() {
      U.value && (G.value = U.value.toDataURL("image/png"), G.value && P("state-save", G.value));
    }
    async function we() {
      if (!U.value)
        throw new Error("Canvas is unable to get current data");
      return G.value ? G.value : U.value.toDataURL("image/png");
    }
    return B({
      setTool: Ce,
      setColor: He,
      setBrushSize: Ae,
      clearCanvas: ve,
      getCurrentCanvasData: we
    }), (N, J) => (de(), Se("div", vt, [
      ne("div", wt, [
        ne("canvas", {
          ref_key: "canvas",
          ref: U,
          width: W(d),
          height: W(te),
          onMousedown: ue,
          onMousemove: oe,
          onMouseup: E,
          onMouseleave: E,
          onTouchstart: Be,
          onTouchmove: Ne,
          onTouchend: E
        }, null, 40, yt)
      ])
    ]));
  }
}), bt = /* @__PURE__ */ Pe(Ct, [["__scopeId", "data-v-ca1239fc"]]), xt = { class: "drawing-app" }, zt = /* @__PURE__ */ Le({
  __name: "DrawingApp",
  props: {
    width: {},
    height: {},
    initialColor: {},
    initialBrushSize: {},
    availableColors: {}
  },
  emits: ["tool-change", "color-change", "brush-size-change", "drawing-start", "drawing", "drawing-end", "state-save", "mounted"],
  setup(z, { expose: B, emit: _ }) {
    const F = z, d = F.width || 800, te = F.height || 500, Z = F.initialColor || "#000000", X = F.initialBrushSize || 5, P = F.availableColors || ["#000000", "#ff0000", "#0000ff", "#00ff00", "#ffff00", "#ff00ff", "#00ffff"], V = _, I = K(null), q = K(null);
    function C(E) {
      var Q;
      (Q = I.value) == null || Q.setTool(E), V("tool-change", E);
    }
    function R(E) {
      var Q;
      (Q = I.value) == null || Q.setColor(E), V("color-change", E);
    }
    function T(E) {
      var Q;
      (Q = I.value) == null || Q.setBrushSize(E), V("brush-size-change", E);
    }
    function ce() {
      var E;
      (E = I.value) == null || E.clearCanvas();
    }
    function G(E) {
      V("drawing-start", E);
    }
    function U(E) {
      V("drawing", E);
    }
    function me() {
      V("drawing-end");
    }
    function pe(E) {
      q.value = E, V("state-save", E);
    }
    function ue(E) {
      V("mounted", E);
    }
    async function oe() {
      if (q.value)
        return q.value;
      if (I.value)
        try {
          return await I.value.getCurrentCanvasData();
        } catch (E) {
          throw console.error("unable to get canvas data:", E), new Error("unable to get canvas data");
        }
      throw new Error("get canvas data failed");
    }
    return B({
      getCanvasData: oe
    }), (E, Q) => (de(), Se("div", xt, [
      Me(mt, {
        colors: W(P),
        initialColor: W(Z),
        initialBrushSize: W(X),
        onToolChange: C,
        onColorChange: R,
        onBrushSizeChange: T,
        onCanvasClear: ce
      }, null, 8, ["colors", "initialColor", "initialBrushSize"]),
      Me(bt, {
        ref_key: "drawingBoard",
        ref: I,
        width: W(d),
        height: W(te),
        initialColor: W(Z),
        initialBrushSize: W(X),
        onDrawingStart: G,
        onDrawing: U,
        onDrawingEnd: me,
        onStateSave: pe,
        onMounted: ue
      }, null, 8, ["width", "height", "initialColor", "initialBrushSize"])
    ]));
  }
}), kt = /* @__PURE__ */ Pe(zt, [["__scopeId", "data-v-39bbf58b"]]), St = /* @__PURE__ */ Le({
  __name: "VueExampleComponent",
  props: {
    widget: {}
  },
  setup(z) {
    const { t: B } = Ge(), _ = K(null), F = K(null);
    z.widget.node;
    function d(Z) {
      F.value = Z, console.log("canvas state saved:", Z.substring(0, 50) + "...");
    }
    async function te(Z, X) {
      var P;
      try {
        if (!((P = window.app) != null && P.api))
          throw new Error("ComfyUI API not available");
        const V = await fetch(Z).then((T) => T.blob()), I = `${X}_${Date.now()}.png`, q = new File([V], I), C = new FormData();
        return C.append("image", q), C.append("subfolder", "threed"), C.append("type", "temp"), console.log("Vue Component: Using window.app.api.fetchApi"), (await window.app.api.fetchApi("/upload/image", {
          method: "POST",
          body: C
        })).json();
      } catch (V) {
        throw console.error("Vue Component: Error uploading image:", V), V;
      }
    }
    return We(() => {
      z.widget.serializeValue = async (Z, X) => {
        try {
          console.log("Vue Component: inside vue serializeValue"), console.log("node", Z), console.log("index", X);
          const P = F.value;
          return P ? {
            image: `threed/${(await te(P, "test_vue_basic")).name} [temp]`
          } : (console.warn("Vue Component: No canvas data available"), { image: null });
        } catch (P) {
          return console.error("Vue Component: Error in serializeValue:", P), { image: null };
        }
      };
    }), (Z, X) => (de(), Se("div", null, [
      ne("h1", null, ke(W(B)("vue-basic.title")), 1),
      ne("div", null, [
        Me(kt, {
          ref_key: "drawingAppRef",
          ref: _,
          width: 300,
          height: 300,
          onStateSave: d
        }, null, 512)
      ])
    ]));
  }
}), Ye = "data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M4.88822%2014.1929C2.49999%2014.9929%201.36569%2011.6929%202.36088%2010.5C2.85843%209.83333%204.58971%207.89286%207.37597%204.69286C10.8588%200.692857%2012.849%202.19286%2014.3416%202.69286C15.8343%203.19286%2019.8146%207.19286%2020.8097%208.19286C21.8048%209.19286%2022.3024%2010.5%2021.8048%2011.5C21.4068%2012.3%2019.4431%2012.6667%2018.7797%2012.5C19.7748%2013%2021.3073%2017.1929%2021.8048%2018.6929C22.2028%2019.8929%2021.3073%2021.1667%2020.8097%2021.5C20.3122%2021.6667%2018.919%2022%2017.3269%2022C15.3367%2022%2015.8343%2019.6929%2016.3318%2017.1929C16.8293%2014.6929%2014.3416%2014.6929%2011.8539%2015.6929C9.36615%2016.6929%209.8637%2017.6929%2010.8588%2018.1929C11.8539%2018.6929%2011.8141%2020.1929%2011.3166%2021.1929C10.8191%2022.1929%206.83869%2022.1929%205.84359%2021.1929C5.07774%2020.4232%206.1292%2015.7356%206.80082%2013.4517C6.51367%2013.6054%205.93814%2013.8412%204.88822%2014.1929Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", At = "data:image/svg+xml,%3csvg%20width='33'%20height='32'%20viewBox='0%200%2033%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M9.73332%2028C9.73332%2028.3536%209.59284%2028.6928%209.34279%2028.9428C9.09274%2029.1929%208.75361%2029.3333%208.39998%2029.3333C8.04636%2029.3333%207.70722%2029.1929%207.45717%2028.9428C7.20713%2028.6928%207.06665%2028.3536%207.06665%2028V4C7.06665%203.64638%207.20713%203.30724%207.45717%203.05719C7.70722%202.80714%208.04636%202.66667%208.39998%202.66667C8.75361%202.66667%209.09274%202.80714%209.34279%203.05719C9.59284%203.30724%209.73332%203.64638%209.73332%204V28ZM15.0667%2012C14.3594%2012%2013.6811%2011.719%2013.181%2011.219C12.6809%2010.7189%2012.4%2010.0406%2012.4%209.33333C12.4%208.62609%2012.6809%207.94781%2013.181%207.44771C13.6811%206.94762%2014.3594%206.66667%2015.0667%206.66667H23.0667C23.7739%206.66667%2024.4522%206.94762%2024.9523%207.44771C25.4524%207.94781%2025.7333%208.62609%2025.7333%209.33333C25.7333%2010.0406%2025.4524%2010.7189%2024.9523%2011.219C24.4522%2011.719%2023.7739%2012%2023.0667%2012H15.0667ZM15.0667%2016H20.4C21.1072%2016%2021.7855%2016.281%2022.2856%2016.781C22.7857%2017.2811%2023.0667%2017.9594%2023.0667%2018.6667C23.0667%2019.3739%2022.7857%2020.0522%2022.2856%2020.5523C21.7855%2021.0524%2021.1072%2021.3333%2020.4%2021.3333H15.0667C14.3594%2021.3333%2013.6811%2021.0524%2013.181%2020.5523C12.6809%2020.0522%2012.4%2019.3739%2012.4%2018.6667C12.4%2017.9594%2012.6809%2017.2811%2013.181%2016.781C13.6811%2016.281%2014.3594%2016%2015.0667%2016Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", Et = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M22.6667%2028C22.6667%2028.3536%2022.5262%2028.6928%2022.2761%2028.9428C22.0261%2029.1929%2021.687%2029.3333%2021.3333%2029.3333C20.9797%2029.3333%2020.6406%2029.1929%2020.3905%2028.9428C20.1405%2028.6928%2020%2028.3536%2020%2028V4C20%203.64638%2020.1405%203.30724%2020.3905%203.05719C20.6406%202.80714%2020.9797%202.66667%2021.3333%202.66667C21.687%202.66667%2022.0261%202.80714%2022.2761%203.05719C22.5262%203.30724%2022.6667%203.64638%2022.6667%204V28ZM14.6667%206.66667C15.3739%206.66667%2016.0522%206.94762%2016.5523%207.44771C17.0524%207.94781%2017.3333%208.62609%2017.3333%209.33333C17.3333%2010.0406%2017.0524%2010.7189%2016.5523%2011.219C16.0522%2011.719%2015.3739%2012%2014.6667%2012H6.66667C5.95942%2012%205.28115%2011.719%204.78105%2011.219C4.28095%2010.7189%204%2010.0406%204%209.33333C4%208.62609%204.28095%207.94781%204.78105%207.44771C5.28115%206.94762%205.95942%206.66667%206.66667%206.66667H14.6667ZM14.6667%2016C15.3739%2016%2016.0522%2016.281%2016.5523%2016.781C17.0524%2017.2811%2017.3333%2017.9594%2017.3333%2018.6667C17.3333%2019.3739%2017.0524%2020.0522%2016.5523%2020.5523C16.0522%2021.0524%2015.3739%2021.3333%2014.6667%2021.3333H9.33333C8.62609%2021.3333%207.94781%2021.0524%207.44772%2020.5523C6.94762%2020.0522%206.66667%2019.3739%206.66667%2018.6667C6.66667%2017.9594%206.94762%2017.2811%207.44772%2016.781C7.94781%2016.281%208.62609%2016%209.33333%2016H14.6667Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", _t = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M6.39992%204H25.5999C26.1893%204%2026.6666%204.59733%2026.6666%205.33333C26.6666%206.06933%2026.1893%206.66667%2025.5999%206.66667H6.39992C5.81059%206.66667%205.33325%206.06933%205.33325%205.33333C5.33325%204.59733%205.81059%204%206.39992%204ZM9.33325%2012C9.33325%2011.2928%209.6142%2010.6145%2010.1143%2010.1144C10.6144%209.61428%2011.2927%209.33333%2011.9999%209.33333C12.7072%209.33333%2013.3854%209.61428%2013.8855%2010.1144C14.3856%2010.6145%2014.6666%2011.2928%2014.6666%2012V25.3333C14.6666%2026.0406%2014.3856%2026.7189%2013.8855%2027.219C13.3854%2027.719%2012.7072%2028%2011.9999%2028C11.2927%2028%2010.6144%2027.719%2010.1143%2027.219C9.6142%2026.7189%209.33325%2026.0406%209.33325%2025.3333V12ZM17.3333%2012C17.3333%2011.2928%2017.6142%2010.6145%2018.1143%2010.1144C18.6144%209.61428%2019.2927%209.33333%2019.9999%209.33333C20.7072%209.33333%2021.3854%209.61428%2021.8855%2010.1144C22.3856%2010.6145%2022.6666%2011.2928%2022.6666%2012V20C22.6666%2020.7072%2022.3856%2021.3855%2021.8855%2021.8856C21.3854%2022.3857%2020.7072%2022.6667%2019.9999%2022.6667C19.2927%2022.6667%2018.6144%2022.3857%2018.1143%2021.8856C17.6142%2021.3855%2017.3333%2020.7072%2017.3333%2020V12Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", Mt = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M6.39992%2025.3333H25.5999C26.1893%2025.3333%2026.6666%2025.9307%2026.6666%2026.6667C26.6666%2027.4027%2026.1893%2028%2025.5999%2028H6.39992C5.81059%2028%205.33325%2027.4027%205.33325%2026.6667C5.33325%2025.9307%205.81059%2025.3333%206.39992%2025.3333ZM14.6666%2020C14.6666%2020.7072%2014.3856%2021.3855%2013.8855%2021.8856C13.3854%2022.3857%2012.7072%2022.6667%2011.9999%2022.6667C11.2927%2022.6667%2010.6144%2022.3857%2010.1143%2021.8856C9.6142%2021.3855%209.33325%2020.7072%209.33325%2020V6.66667C9.33325%205.95942%209.6142%205.28115%2010.1143%204.78105C10.6144%204.28095%2011.2927%204%2011.9999%204C12.7072%204%2013.3854%204.28095%2013.8855%204.78105C14.3856%205.28115%2014.6666%205.95942%2014.6666%206.66667V20ZM22.6666%2020C22.6666%2020.7072%2022.3856%2021.3855%2021.8855%2021.8856C21.3854%2022.3857%2020.7072%2022.6667%2019.9999%2022.6667C19.2927%2022.6667%2018.6144%2022.3857%2018.1143%2021.8856C17.6142%2021.3855%2017.3333%2020.7072%2017.3333%2020V12C17.3333%2011.2928%2017.6142%2010.6145%2018.1143%2010.1144C18.6144%209.61428%2019.2927%209.33333%2019.9999%209.33333C20.7072%209.33333%2021.3854%209.61428%2021.8855%2010.1144C22.3856%2010.6145%2022.6666%2011.2928%2022.6666%2012V20Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", Lt = "data:image/svg+xml,%3csvg%20width='33'%20height='32'%20viewBox='0%200%2033%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M3.80005%2024.7791V6.22093C3.80005%205.54663%204.41923%205%205.18303%205C5.94683%205%206.56601%205.54663%206.56601%206.22093V24.7791C6.56601%2025.4534%205.94683%2026%205.18303%2026C4.41923%2026%203.80005%2025.4534%203.80005%2024.7791Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M7.49597%2016.1488L10.3015%2018.9352C10.6394%2019.2708%2011.2681%2019.0598%2011.2681%2018.6107V17.6976H22.332V18.6107C22.332%2019.0598%2022.9607%2019.2708%2023.2986%2018.9352L26.1041%2016.1488C26.4767%2015.7787%2026.4767%2015.221%2026.1041%2014.851L23.2986%2012.0646C22.9607%2011.729%2022.332%2011.94%2022.332%2012.3891V13.3022H11.2681V12.3891C11.2681%2011.94%2010.6394%2011.729%2010.3015%2012.0646L7.49597%2014.851C7.12335%2015.221%207.12335%2015.7787%207.49597%2016.1488Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M27.0341%2024.7791V6.22093C27.0341%205.54663%2027.6533%205%2028.4171%205C29.1809%205%2029.8%205.54663%2029.8%206.22093V24.7791C29.8%2025.4534%2029.1809%2026%2028.4171%2026C27.6533%2026%2027.0341%2025.4534%2027.0341%2024.7791Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", Bt = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M3%2024.7791V6.22093C3%205.54663%203.61918%205%204.38298%205C5.14678%205%205.76596%205.54663%205.76596%206.22093V24.7791C5.76596%2025.4534%205.14678%2026%204.38298%2026C3.61918%2026%203%2025.4534%203%2024.7791Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M26.234%2024.7791V6.22093C26.234%205.54663%2026.8532%205%2027.617%205C28.3808%205%2029%205.54663%2029%206.22093V24.7791C29%2025.4534%2028.3808%2026%2027.617%2026C26.8532%2026%2026.234%2025.4534%2026.234%2024.7791Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M15.0141%2016.2491L12.2086%2019.0355C11.8706%2019.3711%2011.2419%2019.1601%2011.2419%2018.711V17.7979H6.71L6.71%2013.4025H11.2419V12.4894C11.2419%2012.0403%2011.8706%2011.8293%2012.2086%2012.1649L15.0141%2014.9513C15.3867%2015.3213%2015.3867%2015.879%2015.0141%2016.2491Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M16.9895%2016.2491L19.795%2019.0355C20.133%2019.3711%2020.7617%2019.1601%2020.7617%2018.711V17.7979H25.2936L25.2936%2013.4025H20.7617V12.4894C20.7617%2012.0403%2020.133%2011.8293%2019.795%2012.1649L16.9895%2014.9513C16.6169%2015.3213%2016.6169%2015.879%2016.9895%2016.2491Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", Nt = "data:image/svg+xml,%3csvg%20width='33'%20height='32'%20viewBox='0%200%2033%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20x='0.399902'%20width='32'%20height='32'%20rx='4'%20fill='%23283540'/%3e%3cpath%20d='M25.179%2029H6.62083C5.94653%2029%205.3999%2028.3808%205.3999%2027.617C5.3999%2026.8532%205.94653%2026.234%206.62083%2026.234H25.179C25.8533%2026.234%2026.3999%2026.8532%2026.3999%2027.617C26.3999%2028.3808%2025.8533%2029%2025.179%2029Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M16.5487%2025.3041L19.3351%2022.4986C19.6707%2022.1606%2019.4597%2021.5319%2019.0106%2021.5319H18.0975V10.4681H19.0106C19.4597%2010.4681%2019.6707%209.83938%2019.3351%209.50144L16.5487%206.69593C16.1786%206.32331%2015.621%206.32331%2015.2509%206.69593L12.4645%209.50144C12.1289%209.83938%2012.3399%2010.4681%2012.789%2010.4681H13.7021V21.5319H12.789C12.3399%2021.5319%2012.1289%2022.1606%2012.4645%2022.4986L15.2509%2025.3041C15.621%2025.6767%2016.1786%2025.6767%2016.5487%2025.3041Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M25.179%205.76596H6.62083C5.94653%205.76596%205.3999%205.14678%205.3999%204.38298C5.3999%203.61918%205.94653%203%206.62083%203H25.179C25.8533%203%2026.3999%203.61918%2026.3999%204.38298C26.3999%205.14678%2025.8533%205.76596%2025.179%205.76596Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", Ht = "data:image/svg+xml,%3csvg%20width='33'%20height='32'%20viewBox='0%200%2033%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M7.82103%203H26.3792C27.0535%203%2027.6001%203.61918%2027.6001%204.38298C27.6001%205.14678%2027.0535%205.76596%2026.3792%205.76596H7.82103C7.14673%205.76596%206.6001%205.14678%206.6001%204.38298C6.6001%203.61918%207.14673%203%207.82103%203Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M7.82103%2026.234H26.3792C27.0535%2026.234%2027.6001%2026.8532%2027.6001%2027.617C27.6001%2028.3808%2027.0535%2029%2026.3792%2029H7.82103C7.14673%2029%206.6001%2028.3808%206.6001%2027.617C6.6001%2026.8532%207.14673%2026.234%207.82103%2026.234Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M16.351%2015.0141L13.5646%2012.2086C13.229%2011.8706%2013.44%2011.2419%2013.8891%2011.2419H14.8022V6.71L19.1976%206.71V11.2419H20.1107C20.5598%2011.2419%2020.7708%2011.8706%2020.4352%2012.2086L17.6488%2015.0141C17.2787%2015.3867%2016.7211%2015.3867%2016.351%2015.0141Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M16.351%2016.9895L13.5646%2019.795C13.229%2020.133%2013.44%2020.7617%2013.8891%2020.7617H14.8022V25.2936L19.1976%2025.2936V20.7617H20.1107C20.5598%2020.7617%2020.7708%2020.133%2020.4352%2019.795L17.6488%2016.9895C17.2787%2016.6169%2016.7211%2016.6169%2016.351%2016.9895Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", Ft = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M19.5201%206.18689C19.2052%205.87191%2019.4282%205.33334%2019.8737%205.33334H25.6666C26.2189%205.33334%2026.6666%205.78105%2026.6666%206.33334V12.1262C26.6666%2012.5717%2026.128%2012.7948%2025.813%2012.4798L23.9999%2010.6667L18.6666%2016L15.9999%2013.3333L21.3333%208L19.5201%206.18689ZM12.4797%2025.8131C12.7947%2026.1281%2012.5716%2026.6667%2012.1261%2026.6667H6.33325C5.78097%2026.6667%205.33325%2026.219%205.33325%2025.6667V19.8738C5.33325%2019.4283%205.87182%2019.2052%206.18681%2019.5202L7.99992%2021.3333L13.3333%2016L15.9999%2018.6667L10.6666%2024L12.4797%2025.8131Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", Dt = "data:image/svg+xml,%3csvg%20width='33'%20height='32'%20viewBox='0%200%2033%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M14.8666%2016H9.07372C8.62827%2016%208.40519%2016.5386%208.72017%2016.8535L10.5333%2018.6667L5.19995%2024L7.86662%2026.6667L13.2%2021.3333L15.0131%2023.1464C15.328%2023.4614%2015.8666%2023.2383%2015.8666%2022.7929V17C15.8666%2016.4477%2015.4189%2016%2014.8666%2016Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M17.2%2015.6667H22.9929C23.4384%2015.6667%2023.6615%2015.1281%2023.3465%2014.8131L21.5334%2013L26.8667%207.66667L24.2%205L18.8667%2010.3333L17.0536%208.52022C16.7386%208.20524%2016.2%208.42832%2016.2%208.87377V14.6667C16.2%2015.219%2016.6477%2015.6667%2017.2%2015.6667Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", Vt = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M15.9999%2016C15.9999%2016.1427%2015.9692%2016.288%2015.9039%2016.4213C15.8398%2016.5595%2015.7376%2016.6766%2015.6092%2016.7587L6.46256%2022.5587C6.09456%2022.7907%205.6319%2022.6387%205.42923%2022.22C5.36471%2022.089%205.33183%2021.9447%205.33323%2021.7987V10.2013C5.33323%209.72132%205.67323%209.33333%206.09323%209.33333C6.22441%209.33264%206.35289%209.37067%206.46256%209.44266L15.6092%2015.2413C15.7325%2015.3252%2015.8328%2015.4385%2015.901%2015.571C15.9692%2015.7035%2016.0032%2015.851%2015.9999%2016V10.2C15.9999%209.71999%2016.3399%209.33199%2016.7599%209.33199C16.8911%209.33131%2017.0196%209.36934%2017.1292%209.44133L26.2759%2015.24C26.6426%2015.472%2026.7746%2016%2026.5706%2016.42C26.5065%2016.5582%2026.4042%2016.6752%2026.2759%2016.7573L17.1292%2022.5573C16.7612%2022.7893%2016.2986%2022.6373%2016.0959%2022.2187C16.0314%2022.0877%2015.9985%2021.9433%2015.9999%2021.7973V16Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", Pt = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M16%2016H21.8C21.9467%2016%2022.0934%2016.0333%2022.2214%2016.096C22.64%2016.2987%2022.792%2016.7627%2022.5587%2017.1293L16.76%2026.276C16.6814%2026.4%2016.564%2026.5027%2016.4227%2026.5707C16.004%2026.7747%2015.476%2026.6427%2015.2427%2026.276L9.4427%2017.1293C9.37118%2017.0195%209.33361%2016.891%209.33469%2016.76C9.33469%2016.34%209.7227%2016%2010.2027%2016H16ZM16%2016C15.6934%2016%2015.3987%2015.8587%2015.24%2015.6093L9.44003%206.46266C9.36898%206.3527%209.33188%206.22424%209.33336%206.09333C9.33336%205.67333%209.72136%205.33333%2010.2014%205.33333H21.7987C21.9454%205.33333%2022.092%205.36666%2022.22%205.42933C22.6387%205.63199%2022.7907%206.096%2022.5574%206.46266L16.7587%2015.6093C16.68%2015.7333%2016.5627%2015.836%2016.4214%2015.904C16.288%2015.9693%2016.1427%2016%2016.0014%2016'%20fill='%238BC3F3'/%3e%3c/svg%3e", Ue = rt;
Ue.registerExtension({
  name: "vue-basic",
  getCustomWidgets(z) {
    return {
      CUSTOM_VUE_COMPONENT_BASIC(B) {
        const _ = {
          name: "custom_vue_component_basic",
          type: "vue-basic"
        }, F = new at({
          node: B,
          name: _.name,
          component: St,
          inputSpec: _,
          options: {}
        });
        return st(B, F), { widget: F };
      }
    };
  },
  nodeCreated(z) {
    if (z.constructor.comfyClass !== "vue-basic") return;
    const [B, _] = z.size;
    z.setSize([Math.max(B, 300), Math.max(_, 520)]);
  }
});
Ue.registerExtension({
  name: "housekeeper-alignment",
  async setup() {
    try {
      It();
    } catch {
    }
  },
  nodeCreated(z) {
    z.constructor.comfyClass === "housekeeper-alignment" && (z.setSize([200, 100]), z.title && (z.title = "🎯 Alignment Panel Active"));
  }
});
function It() {
  let z = null, B = null, _ = null, F = !1, d = [], te = [];
  const Z = /* @__PURE__ */ new WeakMap(), X = /* @__PURE__ */ new WeakMap();
  let P = null, V = !1;
  const I = 48, q = 24;
  function C() {
    return document.querySelector("#comfy-menu, .comfyui-menu, .litegraph-menu, .comfyui-toolbar");
  }
  function R() {
    const s = C();
    if (!s)
      return I;
    const r = s.getBoundingClientRect();
    return !r || r.width === 0 && r.height === 0 ? I : Math.max(I, Math.ceil(r.bottom + 8));
  }
  function T() {
    const s = R(), r = window.innerHeight || document.documentElement.clientHeight || 0, l = Math.max(r - s - q, 280);
    document.documentElement.style.setProperty("--hk-top-offset", `${s}px`), document.documentElement.style.setProperty("--hk-panel-max-height", `${l}px`);
  }
  function ce() {
    if (V || (V = !0, window.addEventListener("resize", T), window.addEventListener("orientationchange", T)), typeof ResizeObserver < "u") {
      const s = C();
      s && (P ? P.disconnect() : P = new ResizeObserver(() => T()), P.observe(s));
    }
  }
  const G = [
    { type: "left", icon: At, label: "Align left edges", group: "basic" },
    { type: "right", icon: Et, label: "Align right edges", group: "basic" },
    { type: "top", icon: _t, label: "Align top edges", group: "basic" },
    { type: "bottom", icon: Mt, label: "Align bottom edges", group: "basic" }
  ], U = [
    { type: "width-max", icon: Lt, label: "Match widest width", group: "size" },
    { type: "width-min", icon: Bt, label: "Match narrowest width", group: "size" },
    { type: "height-max", icon: Nt, label: "Match tallest height", group: "size" },
    { type: "height-min", icon: Ht, label: "Match shortest height", group: "size" },
    { type: "size-max", icon: Ft, label: "Match largest size", group: "size" },
    { type: "size-min", icon: Dt, label: "Match smallest size", group: "size" }
  ], me = [
    { type: "horizontal-flow", icon: Vt, label: "Distribute horizontally", group: "flow" },
    { type: "vertical-flow", icon: Pt, label: "Distribute vertically", group: "flow" }
  ];
  function pe() {
    const s = "housekeeper-alignment-styles";
    if (document.getElementById(s)) return;
    const r = document.createElement("style");
    r.id = s, r.textContent = `
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
    gap: 8px;
    padding: clamp(6px, 1vw, 10px) 12px;
    border: 1px solid rgba(139, 195, 243, 0.35);
    border-radius: 12px;
    background: rgba(22, 24, 29, 0.6);
    flex-wrap: wrap;
}

.hk-color-chip {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 1px solid rgba(139, 195, 243, 0.4);
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
`, document.head.appendChild(r);
  }
  pe(), ce(), T();
  function ue() {
    const s = document.createElement("section");
    return s.className = "housekeeper-section", s;
  }
  function oe(s) {
    const r = document.createElement("p");
    return r.className = "housekeeper-subtitle", r.textContent = s, r;
  }
  function E(s, r) {
    const l = document.createElement("div");
    return l.className = `housekeeper-button-grid housekeeper-button-grid-${r}`, s.forEach((h) => {
      l.appendChild(Q(h));
    }), l;
  }
  function Q(s) {
    const r = document.createElement("button");
    r.type = "button", r.className = "hk-button", r.dataset.alignmentType = s.type, r.title = s.label, r.setAttribute("aria-label", s.label);
    const l = document.createElement("img");
    return l.src = s.icon, l.alt = "", l.draggable = !1, r.appendChild(l), r.addEventListener("mouseenter", () => Ae(s.type)), r.addEventListener("mouseleave", () => ve()), r.addEventListener("focus", () => Ae(s.type)), r.addEventListener("blur", () => ve()), r.addEventListener("click", () => ge(s.type)), r;
  }
  function Be() {
    z && (T(), F = !0, z.classList.remove("collapsed"), z.classList.add("expanded"), setTimeout(() => {
      B == null || B.focus();
    }, 0));
  }
  function Ne() {
    z && (F = !1, z.classList.remove("expanded"), z.classList.add("collapsed"), _ == null || _.focus());
  }
  function Ce(s) {
    (typeof s == "boolean" ? s : !F) ? Be() : Ne();
  }
  function He() {
    if (B) return;
    z = document.createElement("div"), z.className = "housekeeper-wrapper collapsed", _ = document.createElement("button"), _.type = "button", _.className = "housekeeper-handle", _.title = "Toggle Housekeeper panel (Ctrl+Shift+H)";
    const s = document.createElement("img");
    s.src = Ye, s.alt = "", s.draggable = !1, _.appendChild(s);
    const r = document.createElement("span");
    r.textContent = "Housekeeper", _.appendChild(r), _.addEventListener("click", () => Ce()), B = document.createElement("div"), B.className = "housekeeper-panel", B.setAttribute("role", "region"), B.setAttribute("aria-label", "Housekeeper alignment tools"), B.tabIndex = -1;
    const l = document.createElement("div");
    l.className = "housekeeper-content";
    const h = document.createElement("div");
    h.className = "housekeeper-header";
    const b = document.createElement("div");
    b.className = "housekeeper-header-title";
    const f = document.createElement("img");
    f.src = Ye, f.alt = "", f.draggable = !1, b.appendChild(f);
    const H = document.createElement("span");
    H.textContent = "Housekeeper", b.appendChild(H);
    const p = document.createElement("button");
    p.type = "button", p.className = "housekeeper-close", p.setAttribute("aria-label", "Hide Housekeeper panel"), p.innerHTML = "&times;", p.addEventListener("click", () => Ce(!1)), h.appendChild(b), h.appendChild(p);
    const u = document.createElement("div");
    u.className = "housekeeper-divider";
    const k = ue();
    k.classList.add("housekeeper-section-primary"), k.appendChild(oe("Basic Alignment")), k.appendChild(E(G, "basic")), k.appendChild(oe("Size Adjustment")), k.appendChild(E(U, "size")), k.appendChild(oe("Flow Alignment")), k.appendChild(E(me, "flow"));
    const w = (a, v) => {
      const y = document.createElement("div");
      return y.className = v, a.forEach((A) => {
        const se = document.createElement("div");
        se.className = "hk-color-chip", se.style.background = A, y.appendChild(se);
      }), y;
    }, x = ue();
    x.appendChild(oe("Color"));
    const j = w(
      ["#3D3F44", "#5C3A30", "#6A402C", "#3A5936", "#2F3E56", "#2E5561", "#3B395C", "#4A2740", "#1F1F21"],
      "housekeeper-color-strip"
    );
    x.appendChild(j);
    const Y = document.createElement("div");
    Y.className = "housekeeper-color-custom-row";
    const O = document.createElement("span");
    O.textContent = "Custom";
    const o = document.createElement("div");
    o.className = "hk-toggle-placeholder", Y.appendChild(O), Y.appendChild(o), x.appendChild(Y);
    const m = document.createElement("div");
    m.className = "housekeeper-color-picker-placeholder";
    const t = document.createElement("div");
    t.className = "housekeeper-color-picker-toolbar";
    const S = document.createElement("div");
    S.className = "hk-swatch", S.style.background = "#000000";
    const M = document.createElement("div");
    M.className = "hk-swatch", M.style.background = "#ff4238";
    const le = document.createElement("div");
    le.className = "hk-slider-placeholder";
    const he = document.createElement("div");
    he.className = "hk-rgb-placeholder", ["R", "G", "B"].forEach((a) => {
      const v = document.createElement("div");
      v.className = "hk-rgb-pill", v.textContent = a, he.appendChild(v);
    }), t.appendChild(S), t.appendChild(M), t.appendChild(le), t.appendChild(he), m.appendChild(t), x.appendChild(m), x.appendChild(oe("On this page"));
    const ee = w(
      ["#C9CCD1", "#5A7A9F", "#2E3136", "#6F7B89", "#4B6076", "#2B3F2F", "#2C3D4E", "#4C3C5A", "#3F2725", "#1E1E1F"],
      "housekeeper-color-footer"
    );
    x.appendChild(ee), l.appendChild(h), l.appendChild(u), l.appendChild(k);
    const i = document.createElement("div");
    i.className = "housekeeper-divider housekeeper-divider-spaced", l.appendChild(i), l.appendChild(x), B.appendChild(l), z.appendChild(_), z.appendChild(B), document.body.appendChild(z), ce(), T();
  }
  function Ae(s) {
    var h;
    if (d.length < 2) return;
    ve();
    const r = (h = window.app) == null ? void 0 : h.canvas;
    if (!r) return;
    be(s, d).forEach((b, f) => {
      if (b && d[f]) {
        const H = document.createElement("div");
        H.style.cssText = `
                    position: fixed;
                    background: rgba(74, 144, 226, 0.3);
                    border: 2px dashed rgba(74, 144, 226, 0.7);
                    border-radius: 4px;
                    z-index: 999;
                    pointer-events: none;
                    transition: all 0.2s ease;
                `;
        const p = (b.x + r.ds.offset[0]) * r.ds.scale, u = (b.y + r.ds.offset[1]) * r.ds.scale, k = r.canvas.parentElement, w = r.canvas.getBoundingClientRect(), x = k ? k.getBoundingClientRect() : null;
        x && w.top - x.top, w.top;
        const j = document.querySelector("nav");
        let Y = 31;
        j && (Y = j.getBoundingClientRect().height);
        const O = Y * r.ds.scale, o = w.left + p, m = w.top + u - O, t = b.width * r.ds.scale, S = b.height * r.ds.scale;
        H.style.left = o + "px", H.style.top = m + "px", H.style.width = t + "px", H.style.height = S + "px", document.body.appendChild(H), te.push(H);
      }
    });
  }
  function ve() {
    te.forEach((s) => {
      s.parentNode && s.parentNode.removeChild(s);
    }), te = [];
  }
  function be(s, r) {
    if (r.length < 2) return [];
    const l = [], h = Math.min(...r.map((p) => p.pos[0])), b = Math.max(...r.map((p) => {
      let u = 150;
      return p.size && Array.isArray(p.size) && p.size[0] ? u = p.size[0] : typeof p.width == "number" ? u = p.width : p.properties && typeof p.properties.width == "number" && (u = p.properties.width), p.pos[0] + u;
    })), f = Math.min(...r.map((p) => p.pos[1])), H = Math.max(...r.map((p) => {
      let u = 100;
      return p.size && Array.isArray(p.size) && p.size[1] ? u = p.size[1] : typeof p.height == "number" ? u = p.height : p.properties && typeof p.properties.height == "number" && (u = p.properties.height), p.pos[1] + u;
    }));
    switch (s) {
      case "left":
        const p = [...r].sort((e, c) => e.pos[1] - c.pos[1]);
        let u = p[0].pos[1];
        const k = /* @__PURE__ */ new Map();
        p.forEach((e) => {
          let c = 100, g = 150;
          e.size && Array.isArray(e.size) ? (e.size[1] && (c = e.size[1]), e.size[0] && (g = e.size[0])) : (typeof e.height == "number" && (c = e.height), typeof e.width == "number" && (g = e.width), e.properties && (typeof e.properties.height == "number" && (c = e.properties.height), typeof e.properties.width == "number" && (g = e.properties.width))), k.set(e.id, {
            x: h,
            y: u,
            width: g,
            height: c
          }), u += c + 30;
        }), r.forEach((e) => {
          l.push(k.get(e.id));
        });
        break;
      case "right":
        const w = [...r].sort((e, c) => e.pos[1] - c.pos[1]);
        let x = w[0].pos[1];
        const j = /* @__PURE__ */ new Map();
        w.forEach((e) => {
          let c = 100, g = 150;
          e.size && Array.isArray(e.size) ? (e.size[1] && (c = e.size[1]), e.size[0] && (g = e.size[0])) : (typeof e.height == "number" && (c = e.height), typeof e.width == "number" && (g = e.width), e.properties && (typeof e.properties.height == "number" && (c = e.properties.height), typeof e.properties.width == "number" && (g = e.properties.width))), j.set(e.id, {
            x: b - g,
            y: x,
            width: g,
            height: c
          }), x += c + 30;
        }), r.forEach((e) => {
          l.push(j.get(e.id));
        });
        break;
      case "top":
        const Y = [...r].sort((e, c) => e.pos[0] - c.pos[0]);
        let O = Y[0].pos[0];
        const o = /* @__PURE__ */ new Map();
        Y.forEach((e) => {
          let c = 100, g = 150;
          e.size && Array.isArray(e.size) ? (e.size[1] && (c = e.size[1]), e.size[0] && (g = e.size[0])) : (typeof e.height == "number" && (c = e.height), typeof e.width == "number" && (g = e.width), e.properties && (typeof e.properties.height == "number" && (c = e.properties.height), typeof e.properties.width == "number" && (g = e.properties.width))), o.set(e.id, {
            x: O,
            y: f,
            width: g,
            height: c
          }), O += g + 30;
        }), r.forEach((e) => {
          l.push(o.get(e.id));
        });
        break;
      case "bottom":
        const m = [...r].sort((e, c) => e.pos[0] - c.pos[0]);
        let t = h;
        const S = /* @__PURE__ */ new Map();
        m.forEach((e) => {
          let c = 100, g = 150;
          e.size && Array.isArray(e.size) ? (e.size[1] && (c = e.size[1]), e.size[0] && (g = e.size[0])) : (typeof e.height == "number" && (c = e.height), typeof e.width == "number" && (g = e.width), e.properties && (typeof e.properties.height == "number" && (c = e.properties.height), typeof e.properties.width == "number" && (g = e.properties.width))), S.set(e.id, {
            x: t,
            y: H - c,
            width: g,
            height: c
          }), t += g + 30;
        }), r.forEach((e) => {
          l.push(S.get(e.id));
        });
        break;
      case "horizontal-flow":
        const M = r.filter((e) => {
          if (!e) return !1;
          const c = e.pos || e.position || typeof e.x == "number" && typeof e.y == "number", g = e.size || e.width || e.height || typeof e.width == "number" && typeof e.height == "number";
          return !!c && !!g;
        });
        if (M.length < 2) break;
        const le = Math.min(...M.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[0] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[0] : typeof e.x == "number" ? e.x : 0)), he = Math.min(...M.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[1] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[1] : typeof e.y == "number" ? e.y : 0)), ee = M.map((e) => ({
          ...e,
          pos: e.pos ? [...e.pos] : [e.x || 0, e.y || 0],
          _calculatedSize: e.size && Array.isArray(e.size) ? [e.size[0], e.size[1]] : [e.width || 150, e.height || 100]
        })), i = N(ee), a = fe(ee, i), v = 30, y = 30, A = 5, se = {};
        ee.forEach((e) => {
          var c;
          if (e && e.id) {
            const g = ((c = a[e.id]) == null ? void 0 : c.level) ?? 0;
            se[g] || (se[g] = []), se[g].push(e);
          }
        });
        const Ee = /* @__PURE__ */ new Map();
        Object.entries(se).forEach(([e, c]) => {
          const g = parseInt(e);
          if (c && c.length > 0) {
            c.sort((n, D) => {
              const ae = n && n.id && a[n.id] ? a[n.id].order : 0, L = D && D.id && a[D.id] ? a[D.id].order : 0;
              return ae - L;
            });
            let ie = le;
            if (g > 0)
              for (let n = 0; n < g; n++) {
                const D = se[n] || [], ae = Math.max(...D.map(
                  (L) => L && L._calculatedSize && L._calculatedSize[0] ? L._calculatedSize[0] : 150
                ));
                ie += ae + v + A;
              }
            let re = he;
            c.forEach((n) => {
              n && n._calculatedSize && (Ee.set(n.id, {
                x: ie,
                y: re,
                width: n._calculatedSize[0],
                height: n._calculatedSize[1]
              }), re += n._calculatedSize[1] + y);
            });
          }
        }), r.forEach((e) => {
          const c = Ee.get(e.id);
          c && l.push(c);
        });
        break;
      case "vertical-flow":
        const _e = r.filter((e) => {
          if (!e) return !1;
          const c = e.pos || e.position || typeof e.x == "number" && typeof e.y == "number", g = e.size || e.width || e.height || typeof e.width == "number" && typeof e.height == "number";
          return !!c && !!g;
        });
        if (_e.length < 2) break;
        const qe = Math.min(..._e.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[0] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[0] : typeof e.x == "number" ? e.x : 0)), Je = Math.min(..._e.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[1] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[1] : typeof e.y == "number" ? e.y : 0)), Fe = _e.map((e) => ({
          ...e,
          pos: e.pos ? [...e.pos] : [e.x || 0, e.y || 0],
          _calculatedSize: e.size && Array.isArray(e.size) ? [e.size[0], e.size[1]] : [e.width || 150, e.height || 100]
        })), Qe = N(Fe), xe = fe(Fe, Qe), et = 30, tt = 30, it = 5, ze = {};
        Fe.forEach((e) => {
          var c;
          if (e && e.id) {
            const g = ((c = xe[e.id]) == null ? void 0 : c.level) ?? 0;
            ze[g] || (ze[g] = []), ze[g].push(e);
          }
        });
        const Te = /* @__PURE__ */ new Map();
        Object.entries(ze).forEach(([e, c]) => {
          const g = parseInt(e);
          if (c && c.length > 0) {
            c.sort((n, D) => {
              const ae = n && n.id && xe[n.id] ? xe[n.id].order : 0, L = D && D.id && xe[D.id] ? xe[D.id].order : 0;
              return ae - L;
            });
            let ie = Je;
            if (g > 0)
              for (let n = 0; n < g; n++) {
                const D = ze[n] || [], ae = Math.max(...D.map(
                  (L) => L && L._calculatedSize && L._calculatedSize[1] ? L._calculatedSize[1] : 100
                ));
                ie += ae + et + it;
              }
            let re = qe;
            c.forEach((n) => {
              n && n._calculatedSize && (Te.set(n.id, {
                x: re,
                y: ie,
                width: n._calculatedSize[0],
                height: n._calculatedSize[1]
              }), re += n._calculatedSize[0] + tt);
            });
          }
        }), r.forEach((e) => {
          const c = Te.get(e.id);
          c && l.push(c);
        });
        break;
      case "width-max":
      case "width-min":
      case "height-max":
      case "height-min":
      case "size-max":
      case "size-min":
        r.forEach((e) => {
          let c = 150, g = 100;
          e.size && Array.isArray(e.size) ? (e.size[0] && (c = e.size[0]), e.size[1] && (g = e.size[1])) : (typeof e.width == "number" && (c = e.width), typeof e.height == "number" && (g = e.height), e.properties && (typeof e.properties.width == "number" && (c = e.properties.width), typeof e.properties.height == "number" && (g = e.properties.height)));
          let ie = c, re = g;
          if (s === "width-max" || s === "size-max")
            ie = Math.max(...r.map((n) => n.size && Array.isArray(n.size) && n.size[0] ? n.size[0] : typeof n.width == "number" ? n.width : n.properties && typeof n.properties.width == "number" ? n.properties.width : 150));
          else if (s === "width-min")
            ie = Math.min(...r.map((n) => n.size && Array.isArray(n.size) && n.size[0] ? n.size[0] : typeof n.width == "number" ? n.width : n.properties && typeof n.properties.width == "number" ? n.properties.width : 150));
          else if (s === "size-min") {
            const n = X.get(e) || e.computeSize;
            if (n)
              try {
                const D = n.call(e);
                D && D.length >= 2 && D[0] !== void 0 && D[1] !== void 0 ? (ie = D[0], re = D[1] + 30) : typeof D == "number" ? (ie = c, re = D + 30) : (ie = c, re = g);
              } catch {
                ie = c, re = g;
              }
          }
          if (s === "height-max" || s === "size-max")
            re = Math.max(...r.map((n) => n.size && Array.isArray(n.size) && n.size[1] ? n.size[1] : typeof n.height == "number" ? n.height : n.properties && typeof n.properties.height == "number" ? n.properties.height : 100));
          else if (s === "height-min") {
            const n = Math.min(...r.map((L) => L.size && L.size[1] !== void 0 ? L.size[1] : typeof L.height == "number" ? L.height : L.properties && typeof L.properties.height == "number" ? L.properties.height : 100)), D = X.get(e) || e.computeSize;
            let ae = null;
            if (D)
              try {
                const L = D.call(e);
                L && L.length >= 2 && L[1] !== void 0 ? ae = L[1] + 30 : typeof L == "number" && (ae = L + 30);
              } catch {
              }
            re = ae && ae > n ? ae : n;
          }
          l.push({
            x: e.pos[0],
            y: e.pos[1],
            width: ie,
            height: re
          });
        });
        break;
    }
    return l;
  }
  function we() {
    var h;
    if (!((h = window.app) != null && h.graph)) return;
    d = Object.values(window.app.graph._nodes || {}).filter((b) => b && b.is_selected);
    const r = d.length > 1;
    r || ve(), z && z.classList.toggle("hk-has-selection", r);
    const l = B == null ? void 0 : B.querySelectorAll(".hk-button");
    l == null || l.forEach((b) => {
      b.disabled = !r;
    });
  }
  function N(s) {
    const r = {}, l = s.filter((h) => h && (h.id !== void 0 || h.id !== null));
    return l.forEach((h) => {
      const b = h.id || `node_${l.indexOf(h)}`;
      h.id = b, r[b] = { inputs: [], outputs: [] }, h.inputs && Array.isArray(h.inputs) && h.inputs.forEach((f, H) => {
        f && f.link !== null && f.link !== void 0 && r[b].inputs.push({
          index: H,
          link: f.link,
          sourceNode: J(f.link, l)
        });
      }), h.outputs && Array.isArray(h.outputs) && h.outputs.forEach((f, H) => {
        f && f.links && Array.isArray(f.links) && f.links.length > 0 && f.links.forEach((p) => {
          const u = $(p, l);
          u && r[b].outputs.push({
            index: H,
            link: p,
            targetNode: u
          });
        });
      });
    }), r;
  }
  function J(s, r) {
    for (const l of r)
      if (l && l.outputs && Array.isArray(l.outputs)) {
        for (const h of l.outputs)
          if (h && h.links && Array.isArray(h.links) && h.links.includes(s))
            return l;
      }
    return null;
  }
  function $(s, r) {
    for (const l of r)
      if (l && l.inputs && Array.isArray(l.inputs)) {
        for (const h of l.inputs)
          if (h && h.link === s)
            return l;
      }
    return null;
  }
  function fe(s, r) {
    const l = {}, h = /* @__PURE__ */ new Set(), b = s.filter((u) => u && u.id), f = b.filter((u) => {
      const k = u.id;
      return !r[k] || !r[k].inputs.length || r[k].inputs.every((w) => !w.sourceNode);
    });
    f.length === 0 && b.length > 0 && f.push(b[0]);
    const H = f.map((u) => ({ node: u, level: 0 }));
    for (; H.length > 0; ) {
      const { node: u, level: k } = H.shift();
      !u || !u.id || h.has(u.id) || (h.add(u.id), l[u.id] = { level: k, order: 0 }, r[u.id] && r[u.id].outputs && r[u.id].outputs.forEach((w) => {
        w && w.targetNode && w.targetNode.id && !h.has(w.targetNode.id) && H.push({ node: w.targetNode, level: k + 1 });
      }));
    }
    b.forEach((u) => {
      u && u.id && !l[u.id] && (l[u.id] = { level: 0, order: 0 });
    });
    const p = {};
    return Object.entries(l).forEach(([u, k]) => {
      p[k.level] || (p[k.level] = []);
      const w = b.find((x) => x && x.id === u);
      w && p[k.level].push(w);
    }), Object.entries(p).forEach(([u, k]) => {
      k && k.length > 0 && (k.sort((w, x) => {
        const j = w && w.pos && w.pos[1] ? w.pos[1] : 0, Y = x && x.pos && x.pos[1] ? x.pos[1] : 0;
        return j - Y;
      }), k.forEach((w, x) => {
        w && w.id && l[w.id] && (l[w.id].order = x);
      }));
    }), l;
  }
  function ge(s) {
    var r, l, h, b, f;
    if (d.length < 2) {
      ye("Please select at least 2 nodes to align", "warning");
      return;
    }
    try {
      const H = Math.min(...d.map((o) => o.pos[0])), p = Math.max(...d.map((o) => {
        let m = 150;
        return o.size && Array.isArray(o.size) && o.size[0] ? m = o.size[0] : typeof o.width == "number" ? m = o.width : o.properties && typeof o.properties.width == "number" && (m = o.properties.width), o.pos[0] + m;
      })), u = Math.min(...d.map((o) => o.pos[1])), k = Math.max(...d.map((o) => {
        let m = 100;
        return o.size && Array.isArray(o.size) && o.size[1] ? m = o.size[1] : typeof o.height == "number" ? m = o.height : o.properties && typeof o.properties.height == "number" && (m = o.properties.height), o.pos[1] + m;
      })), w = Math.max(...d.map((o) => {
        const m = Z.get(o);
        if (m && m.width !== void 0) return m.width;
        let t = 150;
        return o.size && Array.isArray(o.size) && o.size[0] ? t = o.size[0] : typeof o.width == "number" ? t = o.width : o.properties && typeof o.properties.width == "number" && (t = o.properties.width), t;
      })), x = Math.min(...d.map((o) => {
        const m = Z.get(o);
        if (m && m.width !== void 0) return m.width;
        let t = 150;
        return o.size && Array.isArray(o.size) && o.size[0] ? t = o.size[0] : typeof o.width == "number" ? t = o.width : o.properties && typeof o.properties.width == "number" && (t = o.properties.width), t;
      })), j = Math.max(...d.map((o) => {
        const m = Z.get(o);
        return m && m.height !== void 0 ? m.height : o.size && o.size[1] !== void 0 ? o.size[1] : typeof o.height == "number" ? o.height : o.properties && typeof o.properties.height == "number" ? o.properties.height : 100;
      })), Y = Math.min(...d.map((o) => o.size && o.size[1] !== void 0 ? o.size[1] : typeof o.height == "number" ? o.height : o.properties && typeof o.properties.height == "number" ? o.properties.height : 100));
      let O;
      switch (s) {
        case "left":
          O = H;
          const o = [...d].sort((i, a) => i.pos[1] - a.pos[1]);
          let m = o[0].pos[1];
          o.forEach((i, a) => {
            let y = 100;
            i.size && Array.isArray(i.size) && i.size[1] ? y = i.size[1] : typeof i.height == "number" ? y = i.height : i.properties && typeof i.properties.height == "number" && (y = i.properties.height), i.pos[0] = O, i.pos[1] = m, typeof i.x == "number" && (i.x = i.pos[0]), typeof i.y == "number" && (i.y = i.pos[1]), m += y + 30;
          });
          break;
        case "right":
          O = p;
          const t = [...d].sort((i, a) => i.pos[1] - a.pos[1]);
          let S = t[0].pos[1];
          t.forEach((i, a) => {
            let y = 100, A = 150;
            i.size && Array.isArray(i.size) ? (i.size[1] && (y = i.size[1]), i.size[0] && (A = i.size[0])) : (typeof i.height == "number" && (y = i.height), typeof i.width == "number" && (A = i.width), i.properties && (typeof i.properties.height == "number" && (y = i.properties.height), typeof i.properties.width == "number" && (A = i.properties.width))), i.pos[0] = O - A, i.pos[1] = S, typeof i.x == "number" && (i.x = i.pos[0]), typeof i.y == "number" && (i.y = i.pos[1]), S += y + 30;
          });
          break;
        case "top":
          O = u;
          const M = [...d].sort((i, a) => i.pos[0] - a.pos[0]);
          let le = M[0].pos[0];
          M.forEach((i, a) => {
            let y = 150;
            i.size && Array.isArray(i.size) && i.size[0] ? y = i.size[0] : typeof i.width == "number" ? y = i.width : i.properties && typeof i.properties.width == "number" && (y = i.properties.width), i.pos[1] = O, i.pos[0] = le, typeof i.x == "number" && (i.x = i.pos[0]), typeof i.y == "number" && (i.y = i.pos[1]), le += y + 30;
          });
          break;
        case "bottom":
          O = k;
          const he = [...d].sort((i, a) => i.pos[0] - a.pos[0]);
          let ee = H;
          he.forEach((i, a) => {
            let y = 150, A = 100;
            i.size && Array.isArray(i.size) ? (i.size[0] && (y = i.size[0]), i.size[1] && (A = i.size[1])) : (typeof i.width == "number" && (y = i.width), typeof i.height == "number" && (A = i.height), i.properties && (typeof i.properties.width == "number" && (y = i.properties.width), typeof i.properties.height == "number" && (A = i.properties.height)));
            const se = O - A, Ee = ee;
            i.pos[1] = se, i.pos[0] = Ee, typeof i.x == "number" && (i.x = i.pos[0]), typeof i.y == "number" && (i.y = i.pos[1]), ee += y + 30;
          });
          break;
        case "width-max":
          d.forEach((i) => {
            i.size && (i.size[0] = w);
          });
          break;
        case "width-min":
          d.forEach((i) => {
            i.size && (i.size[0] = x);
          });
          break;
        case "height-max":
          d.forEach((i) => {
            i.size && (i.size[1] = j);
          });
          break;
        case "height-min":
          d.forEach((i) => {
            if (i.size) {
              const a = X.get(i) || i.computeSize;
              if (a) {
                const v = a.call(i);
                i.size[1] = Math.max(Y, v[1]);
              }
            }
          });
          break;
        case "size-max":
          d.forEach((i) => {
            i.size && (i.size[0] = w, i.size[1] = j);
          });
          break;
        case "size-min":
          d.forEach((i) => {
            if (i.size) {
              const a = X.get(i) || i.computeSize;
              if (a) {
                const v = a.call(i);
                i.size[0] = v[0], i.size[1] = v[1];
              }
            }
          });
          break;
        case "horizontal-flow":
          $e();
          return;
        // Don't continue to the success message at the bottom
        case "vertical-flow":
          je();
          return;
      }
      try {
        (l = (r = window.app) == null ? void 0 : r.canvas) != null && l.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (b = (h = window.app) == null ? void 0 : h.graph) != null && b.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (f = window.app) != null && f.canvas && window.app.canvas.draw(!0, !0);
      } catch {
      }
    } catch {
      ye("Error during alignment", "error");
    }
  }
  function Tt(s) {
  }
  function $e() {
    var s, r, l, h, b;
    try {
      const f = d.filter((t) => {
        if (!t) return !1;
        const S = t.pos || t.position || typeof t.x == "number" && typeof t.y == "number", M = t.size || t.width || t.height || typeof t.width == "number" && typeof t.height == "number";
        return !!S && !!M;
      });
      if (f.length < 2) {
        ye(`Not enough valid nodes: ${f.length}/${d.length} nodes are valid`, "warning");
        return;
      }
      const H = Math.min(...f.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[0] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[0] : typeof t.x == "number" ? t.x : 0)), p = Math.min(...f.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[1] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[1] : typeof t.y == "number" ? t.y : 0)), u = H, k = p;
      f.forEach((t) => {
        t.pos || (t.position && Array.isArray(t.position) ? t.pos = t.position : typeof t.x == "number" && typeof t.y == "number" ? t.pos = [t.x, t.y] : t.pos = [0, 0]), t._calculatedSize || (t.size && Array.isArray(t.size) ? t._calculatedSize = [t.size[0], t.size[1]] : typeof t.width == "number" && typeof t.height == "number" ? t._calculatedSize = [t.width, t.height] : t._calculatedSize = [150, 100]), Array.isArray(t.pos) || (t.pos = [0, 0]);
      });
      const w = N(f), x = fe(f, w), j = 30, Y = 30, O = 30, o = 5, m = {};
      f.forEach((t) => {
        var S;
        if (t && t.id) {
          const M = ((S = x[t.id]) == null ? void 0 : S.level) ?? 0;
          m[M] || (m[M] = []), m[M].push(t);
        }
      }), Object.entries(m).forEach(([t, S]) => {
        const M = parseInt(t);
        if (S && S.length > 0) {
          S.sort((a, v) => {
            const y = a && a.id && x[a.id] ? x[a.id].order : 0, A = v && v.id && x[v.id] ? x[v.id].order : 0;
            return y - A;
          });
          const le = S.reduce((a, v, y) => {
            const A = v && v._calculatedSize && v._calculatedSize[1] ? v._calculatedSize[1] : 100;
            return a + A + (y < S.length - 1 ? O : 0);
          }, 0), he = Math.max(...S.map(
            (a) => a && a._calculatedSize && a._calculatedSize[0] ? a._calculatedSize[0] : 150
          ));
          let ee = u;
          if (M > 0)
            for (let a = 0; a < M; a++) {
              const v = m[a] || [], y = Math.max(...v.map(
                (A) => A && A._calculatedSize && A._calculatedSize[0] ? A._calculatedSize[0] : 150
              ));
              ee += y + j + o;
            }
          let i = k;
          S.forEach((a, v) => {
            if (a && a.pos && a._calculatedSize) {
              const y = [a.pos[0], a.pos[1]], A = [a._calculatedSize[0], a._calculatedSize[1]];
              a.pos[0] = ee, a.pos[1] = i, i += a._calculatedSize[1] + O, typeof a.x == "number" && (a.x = a.pos[0]), typeof a.y == "number" && (a.y = a.pos[1]);
            }
          });
        }
      });
      try {
        (r = (s = window.app) == null ? void 0 : s.canvas) != null && r.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (h = (l = window.app) == null ? void 0 : l.graph) != null && h.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (b = window.app) != null && b.canvas && window.app.canvas.draw(!0, !0);
      } catch {
      }
    } catch {
      ye("Error in horizontal flow alignment", "error");
    }
  }
  function je() {
    var s, r, l, h, b;
    try {
      const f = d.filter((t) => {
        if (!t) return !1;
        const S = t.pos || t.position || typeof t.x == "number" && typeof t.y == "number", M = t.size || t.width || t.height || typeof t.width == "number" && typeof t.height == "number";
        return !!S && !!M;
      });
      if (f.length < 2) {
        ye(`Not enough valid nodes: ${f.length}/${d.length} nodes are valid`, "warning");
        return;
      }
      const H = Math.min(...f.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[0] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[0] : typeof t.x == "number" ? t.x : 0)), p = Math.min(...f.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[1] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[1] : typeof t.y == "number" ? t.y : 0)), u = H, k = p;
      f.forEach((t) => {
        t.pos || (t.position && Array.isArray(t.position) ? t.pos = t.position : typeof t.x == "number" && typeof t.y == "number" ? t.pos = [t.x, t.y] : t.pos = [0, 0]), t._calculatedSize || (t.size && Array.isArray(t.size) ? t._calculatedSize = [t.size[0], t.size[1]] : typeof t.width == "number" && typeof t.height == "number" ? t._calculatedSize = [t.width, t.height] : t._calculatedSize = [150, 100]), Array.isArray(t.pos) || (t.pos = [0, 0]);
      });
      const w = N(f), x = fe(f, w), j = 30, Y = 30, O = 30, o = 5, m = {};
      f.forEach((t) => {
        var S;
        if (t && t.id) {
          const M = ((S = x[t.id]) == null ? void 0 : S.level) ?? 0;
          m[M] || (m[M] = []), m[M].push(t);
        }
      }), Object.entries(m).forEach(([t, S]) => {
        const M = parseInt(t);
        if (S && S.length > 0) {
          S.sort((a, v) => {
            const y = a && a.id && x[a.id] ? x[a.id].order : 0, A = v && v.id && x[v.id] ? x[v.id].order : 0;
            return y - A;
          });
          const le = S.reduce((a, v, y) => {
            const A = v && v._calculatedSize && v._calculatedSize[0] ? v._calculatedSize[0] : 150;
            return a + A + Y;
          }, 0), he = Math.max(...S.map(
            (a) => a && a._calculatedSize && a._calculatedSize[1] ? a._calculatedSize[1] : 100
          ));
          let ee = k;
          if (M > 0)
            for (let a = 0; a < M; a++) {
              const v = m[a] || [], y = Math.max(...v.map(
                (A) => A && A._calculatedSize && A._calculatedSize[1] ? A._calculatedSize[1] : 100
              ));
              ee += y + j + o;
            }
          let i = u;
          S.forEach((a, v) => {
            if (a && a.pos && a._calculatedSize) {
              const y = [a.pos[0], a.pos[1]], A = [a._calculatedSize[0], a._calculatedSize[1]];
              a.pos[0] = i, a.pos[1] = ee, i += a._calculatedSize[0] + Y, typeof a.x == "number" && (a.x = a.pos[0]), typeof a.y == "number" && (a.y = a.pos[1]);
            }
          });
        }
      });
      try {
        (r = (s = window.app) == null ? void 0 : s.canvas) != null && r.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (h = (l = window.app) == null ? void 0 : l.graph) != null && h.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (b = window.app) != null && b.canvas && window.app.canvas.draw(!0, !0);
      } catch {
      }
    } catch {
      ye("Error in vertical flow alignment", "error");
    }
  }
  function ye(s, r = "info") {
    const l = document.createElement("div");
    l.textContent = s, l.style.cssText = `
            position: fixed;
            top: 60px;
            right: 10px;
            background: ${r === "success" ? "#4CAF50" : r === "warning" ? "#FF9800" : r === "error" ? "#F44336" : "#2196F3"};
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
  function Ie() {
    var s;
    if (!((s = window.app) != null && s.canvas)) {
      setTimeout(Ie, 100);
      return;
    }
    window.app.canvas.canvas && (window.app.canvas.canvas.addEventListener("click", () => {
      setTimeout(we, 10);
    }), window.app.canvas.canvas.addEventListener("mouseup", () => {
      setTimeout(we, 10);
    }), document.addEventListener("keydown", (r) => {
      (r.ctrlKey || r.metaKey) && setTimeout(we, 10);
    })), setInterval(we, 500);
  }
  function Ke(s) {
    if (s.ctrlKey || s.metaKey) {
      if (s.shiftKey && !s.altKey && (s.key === "H" || s.key === "h")) {
        s.preventDefault(), Ce();
        return;
      }
      if (s.shiftKey)
        switch (s.key) {
          case "ArrowLeft":
            s.preventDefault(), ge("left");
            break;
          case "ArrowRight":
            s.preventDefault(), ge("right");
            break;
          case "ArrowUp":
            s.preventDefault(), ge("top");
            break;
          case "ArrowDown":
            s.preventDefault(), ge("bottom");
            break;
        }
      else if (s.altKey)
        switch (s.key) {
          case "ArrowRight":
            s.preventDefault(), ge("horizontal-flow");
            break;
          case "ArrowDown":
            s.preventDefault(), ge("vertical-flow");
            break;
        }
    }
  }
  He(), Ie(), document.addEventListener("keydown", Ke);
}
