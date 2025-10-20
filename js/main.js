import { app as Xt } from "../../../scripts/app.js";
import { ComponentWidgetImpl as jt, addWidget as Ut } from "../../../scripts/domWidget.js";
import { defineComponent as je, ref as oe, resolveDirective as Kt, createElementBlock as Fe, openBlock as Se, Fragment as yt, createElementVNode as ge, withDirectives as qt, createVNode as Xe, createBlock as Ct, unref as Q, normalizeClass as kt, withCtx as st, createTextVNode as zt, toDisplayString as De, renderList as Jt, normalizeStyle as Qt, onMounted as At, nextTick as ei } from "vue";
import nt from "primevue/button";
import { useI18n as St } from "vue-i18n";
const ti = { class: "toolbar" }, ii = { class: "color-picker" }, ri = { class: "size-slider" }, oi = ["value"], ai = /* @__PURE__ */ je({
  __name: "ToolBar",
  props: {
    colors: {},
    initialColor: {},
    initialBrushSize: {},
    initialTool: {}
  },
  emits: ["tool-change", "color-change", "canvas-clear", "brush-size-change"],
  setup(L, { emit: H }) {
    const { t: N } = St(), F = L, m = H, te = F.colors || ["#000000", "#ff0000", "#0000ff", "#69a869", "#ffff00", "#ff00ff", "#00ffff"], X = oe(F.initialColor || "#000000"), R = oe(F.initialBrushSize || 5), $ = oe(F.initialTool || "pen");
    function P(z) {
      $.value = z, m("tool-change", z);
    }
    function W(z) {
      X.value = z, m("color-change", z);
    }
    function Z() {
      m("canvas-clear");
    }
    function C(z) {
      const E = z.target;
      R.value = Number(E.value), m("brush-size-change", R.value);
    }
    return (z, E) => {
      const fe = Kt("tooltip");
      return Se(), Fe(yt, null, [
        ge("div", ti, [
          qt((Se(), Ct(Q(nt), {
            class: kt({ active: $.value === "pen" }),
            onClick: E[0] || (E[0] = (j) => P("pen"))
          }, {
            default: st(() => [
              zt(De(Q(N)("vue-basic.pen")), 1)
            ]),
            _: 1
          }, 8, ["class"])), [
            [fe, { value: Q(N)("vue-basic.pen-tooltip"), showDelay: 300 }]
          ]),
          Xe(Q(nt), { onClick: Z }, {
            default: st(() => [
              zt(De(Q(N)("vue-basic.clear-canvas")), 1)
            ]),
            _: 1
          })
        ]),
        ge("div", ii, [
          (Se(!0), Fe(yt, null, Jt(Q(te), (j, U) => (Se(), Ct(Q(nt), {
            key: U,
            class: kt({ "color-button": !0, active: X.value === j }),
            onClick: (ve) => W(j),
            type: "button",
            title: j
          }, {
            default: st(() => [
              ge("i", {
                class: "pi pi-circle-fill",
                style: Qt({ color: j })
              }, null, 4)
            ]),
            _: 2
          }, 1032, ["class", "onClick", "title"]))), 128))
        ]),
        ge("div", ri, [
          ge("label", null, De(Q(N)("vue-basic.brush-size")) + ": " + De(R.value) + "px", 1),
          ge("input", {
            type: "range",
            min: "1",
            max: "50",
            value: R.value,
            onChange: E[1] || (E[1] = (j) => C(j))
          }, null, 40, oi)
        ])
      ], 64);
    };
  }
}), lt = (L, H) => {
  const N = L.__vccOpts || L;
  for (const [F, m] of H)
    N[F] = m;
  return N;
}, si = /* @__PURE__ */ lt(ai, [["__scopeId", "data-v-cae98791"]]), ni = { class: "drawing-board" }, li = { class: "canvas-container" }, ci = ["width", "height"], pi = /* @__PURE__ */ je({
  __name: "DrawingBoard",
  props: {
    width: {},
    height: {},
    initialColor: {},
    initialBrushSize: {}
  },
  emits: ["mounted", "drawing-start", "drawing", "drawing-end", "state-save", "canvas-clear"],
  setup(L, { expose: H, emit: N }) {
    const F = L, m = F.width || 800, te = F.height || 500, X = F.initialColor || "#000000", R = F.initialBrushSize || 5, $ = N, P = oe(!1), W = oe(0), Z = oe(0), C = oe(null), z = oe(!1), E = oe(R), fe = oe(X), j = oe(null), U = oe(null);
    At(() => {
      U.value && (C.value = U.value.getContext("2d"), ve(), ei(() => {
        U.value && $("mounted", U.value);
      }));
    });
    function ve() {
      C.value && (C.value.fillStyle = "#ffffff", C.value.fillRect(0, 0, m, te), he(), Be());
    }
    function he() {
      C.value && (z.value ? (C.value.globalCompositeOperation = "destination-out", C.value.strokeStyle = "rgba(0,0,0,1)") : (C.value.globalCompositeOperation = "source-over", C.value.strokeStyle = fe.value), C.value.lineWidth = E.value, C.value.lineJoin = "round", C.value.lineCap = "round");
    }
    function me(O) {
      P.value = !0;
      const { offsetX: ae, offsetY: ie } = se(O);
      W.value = ae, Z.value = ie, C.value && (C.value.beginPath(), C.value.moveTo(W.value, Z.value), C.value.arc(W.value, Z.value, E.value / 2, 0, Math.PI * 2), C.value.fill(), $("drawing-start", {
        x: ae,
        y: ie,
        tool: z.value ? "eraser" : "pen"
      }));
    }
    function ye(O) {
      if (!P.value || !C.value) return;
      const { offsetX: ae, offsetY: ie } = se(O);
      C.value.beginPath(), C.value.moveTo(W.value, Z.value), C.value.lineTo(ae, ie), C.value.stroke(), W.value = ae, Z.value = ie, $("drawing", {
        x: ae,
        y: ie,
        tool: z.value ? "eraser" : "pen"
      });
    }
    function M() {
      P.value && (P.value = !1, Be(), $("drawing-end"));
    }
    function se(O) {
      let ae = 0, ie = 0;
      if ("touches" in O) {
        if (O.preventDefault(), U.value) {
          const He = U.value.getBoundingClientRect();
          ae = O.touches[0].clientX - He.left, ie = O.touches[0].clientY - He.top;
        }
      } else
        ae = O.offsetX, ie = O.offsetY;
      return { offsetX: ae, offsetY: ie };
    }
    function Oe(O) {
      O.preventDefault();
      const ie = {
        touches: [O.touches[0]]
      };
      me(ie);
    }
    function Ue(O) {
      if (O.preventDefault(), !P.value) return;
      const ie = {
        touches: [O.touches[0]]
      };
      ye(ie);
    }
    function be(O) {
      z.value = O === "eraser", he();
    }
    function Te(O) {
      fe.value = O, he();
    }
    function Ke(O) {
      E.value = O, he();
    }
    function qe() {
      C.value && (C.value.fillStyle = "#ffffff", C.value.fillRect(0, 0, m, te), he(), Be(), $("canvas-clear"));
    }
    function Be() {
      U.value && (j.value = U.value.toDataURL("image/png"), j.value && $("state-save", j.value));
    }
    async function Ce() {
      if (!U.value)
        throw new Error("Canvas is unable to get current data");
      return j.value ? j.value : U.value.toDataURL("image/png");
    }
    return H({
      setTool: be,
      setColor: Te,
      setBrushSize: Ke,
      clearCanvas: qe,
      getCurrentCanvasData: Ce
    }), (O, ae) => (Se(), Fe("div", ni, [
      ge("div", li, [
        ge("canvas", {
          ref_key: "canvas",
          ref: U,
          width: Q(m),
          height: Q(te),
          onMousedown: me,
          onMousemove: ye,
          onMouseup: M,
          onMouseleave: M,
          onTouchstart: Oe,
          onTouchmove: Ue,
          onTouchend: M
        }, null, 40, ci)
      ])
    ]));
  }
}), ui = /* @__PURE__ */ lt(pi, [["__scopeId", "data-v-ca1239fc"]]), hi = { class: "drawing-app" }, fi = /* @__PURE__ */ je({
  __name: "DrawingApp",
  props: {
    width: {},
    height: {},
    initialColor: {},
    initialBrushSize: {},
    availableColors: {}
  },
  emits: ["tool-change", "color-change", "brush-size-change", "drawing-start", "drawing", "drawing-end", "state-save", "mounted"],
  setup(L, { expose: H, emit: N }) {
    const F = L, m = F.width || 800, te = F.height || 500, X = F.initialColor || "#000000", R = F.initialBrushSize || 5, $ = F.availableColors || ["#000000", "#ff0000", "#0000ff", "#00ff00", "#ffff00", "#ff00ff", "#00ffff"], P = N, W = oe(null), Z = oe(null);
    function C(M) {
      var se;
      (se = W.value) == null || se.setTool(M), P("tool-change", M);
    }
    function z(M) {
      var se;
      (se = W.value) == null || se.setColor(M), P("color-change", M);
    }
    function E(M) {
      var se;
      (se = W.value) == null || se.setBrushSize(M), P("brush-size-change", M);
    }
    function fe() {
      var M;
      (M = W.value) == null || M.clearCanvas();
    }
    function j(M) {
      P("drawing-start", M);
    }
    function U(M) {
      P("drawing", M);
    }
    function ve() {
      P("drawing-end");
    }
    function he(M) {
      Z.value = M, P("state-save", M);
    }
    function me(M) {
      P("mounted", M);
    }
    async function ye() {
      if (Z.value)
        return Z.value;
      if (W.value)
        try {
          return await W.value.getCurrentCanvasData();
        } catch (M) {
          throw console.error("unable to get canvas data:", M), new Error("unable to get canvas data");
        }
      throw new Error("get canvas data failed");
    }
    return H({
      getCanvasData: ye
    }), (M, se) => (Se(), Fe("div", hi, [
      Xe(si, {
        colors: Q($),
        initialColor: Q(X),
        initialBrushSize: Q(R),
        onToolChange: C,
        onColorChange: z,
        onBrushSizeChange: E,
        onCanvasClear: fe
      }, null, 8, ["colors", "initialColor", "initialBrushSize"]),
      Xe(ui, {
        ref_key: "drawingBoard",
        ref: W,
        width: Q(m),
        height: Q(te),
        initialColor: Q(X),
        initialBrushSize: Q(R),
        onDrawingStart: j,
        onDrawing: U,
        onDrawingEnd: ve,
        onStateSave: he,
        onMounted: me
      }, null, 8, ["width", "height", "initialColor", "initialBrushSize"])
    ]));
  }
}), di = /* @__PURE__ */ lt(fi, [["__scopeId", "data-v-39bbf58b"]]), gi = /* @__PURE__ */ je({
  __name: "VueExampleComponent",
  props: {
    widget: {}
  },
  setup(L) {
    const { t: H } = St(), N = oe(null), F = oe(null);
    L.widget.node;
    function m(X) {
      F.value = X, console.log("canvas state saved:", X.substring(0, 50) + "...");
    }
    async function te(X, R) {
      var $;
      try {
        if (!(($ = window.app) != null && $.api))
          throw new Error("ComfyUI API not available");
        const P = await fetch(X).then((E) => E.blob()), W = `${R}_${Date.now()}.png`, Z = new File([P], W), C = new FormData();
        return C.append("image", Z), C.append("subfolder", "threed"), C.append("type", "temp"), console.log("Vue Component: Using window.app.api.fetchApi"), (await window.app.api.fetchApi("/upload/image", {
          method: "POST",
          body: C
        })).json();
      } catch (P) {
        throw console.error("Vue Component: Error uploading image:", P), P;
      }
    }
    return At(() => {
      L.widget.serializeValue = async (X, R) => {
        try {
          console.log("Vue Component: inside vue serializeValue"), console.log("node", X), console.log("index", R);
          const $ = F.value;
          return $ ? {
            image: `threed/${(await te($, "test_vue_basic")).name} [temp]`
          } : (console.warn("Vue Component: No canvas data available"), { image: null });
        } catch ($) {
          return console.error("Vue Component: Error in serializeValue:", $), { image: null };
        }
      };
    }), (X, R) => (Se(), Fe("div", null, [
      ge("h1", null, De(Q(H)("vue-basic.title")), 1),
      ge("div", null, [
        Xe(di, {
          ref_key: "drawingAppRef",
          ref: N,
          width: 300,
          height: 300,
          onStateSave: m
        }, null, 512)
      ])
    ]));
  }
}), Et = "data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M4.88822%2014.1929C2.49999%2014.9929%201.36569%2011.6929%202.36088%2010.5C2.85843%209.83333%204.58971%207.89286%207.37597%204.69286C10.8588%200.692857%2012.849%202.19286%2014.3416%202.69286C15.8343%203.19286%2019.8146%207.19286%2020.8097%208.19286C21.8048%209.19286%2022.3024%2010.5%2021.8048%2011.5C21.4068%2012.3%2019.4431%2012.6667%2018.7797%2012.5C19.7748%2013%2021.3073%2017.1929%2021.8048%2018.6929C22.2028%2019.8929%2021.3073%2021.1667%2020.8097%2021.5C20.3122%2021.6667%2018.919%2022%2017.3269%2022C15.3367%2022%2015.8343%2019.6929%2016.3318%2017.1929C16.8293%2014.6929%2014.3416%2014.6929%2011.8539%2015.6929C9.36615%2016.6929%209.8637%2017.6929%2010.8588%2018.1929C11.8539%2018.6929%2011.8141%2020.1929%2011.3166%2021.1929C10.8191%2022.1929%206.83869%2022.1929%205.84359%2021.1929C5.07774%2020.4232%206.1292%2015.7356%206.80082%2013.4517C6.51367%2013.6054%205.93814%2013.8412%204.88822%2014.1929Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", mi = "data:image/svg+xml,%3csvg%20width='33'%20height='32'%20viewBox='0%200%2033%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M9.73332%2028C9.73332%2028.3536%209.59284%2028.6928%209.34279%2028.9428C9.09274%2029.1929%208.75361%2029.3333%208.39998%2029.3333C8.04636%2029.3333%207.70722%2029.1929%207.45717%2028.9428C7.20713%2028.6928%207.06665%2028.3536%207.06665%2028V4C7.06665%203.64638%207.20713%203.30724%207.45717%203.05719C7.70722%202.80714%208.04636%202.66667%208.39998%202.66667C8.75361%202.66667%209.09274%202.80714%209.34279%203.05719C9.59284%203.30724%209.73332%203.64638%209.73332%204V28ZM15.0667%2012C14.3594%2012%2013.6811%2011.719%2013.181%2011.219C12.6809%2010.7189%2012.4%2010.0406%2012.4%209.33333C12.4%208.62609%2012.6809%207.94781%2013.181%207.44771C13.6811%206.94762%2014.3594%206.66667%2015.0667%206.66667H23.0667C23.7739%206.66667%2024.4522%206.94762%2024.9523%207.44771C25.4524%207.94781%2025.7333%208.62609%2025.7333%209.33333C25.7333%2010.0406%2025.4524%2010.7189%2024.9523%2011.219C24.4522%2011.719%2023.7739%2012%2023.0667%2012H15.0667ZM15.0667%2016H20.4C21.1072%2016%2021.7855%2016.281%2022.2856%2016.781C22.7857%2017.2811%2023.0667%2017.9594%2023.0667%2018.6667C23.0667%2019.3739%2022.7857%2020.0522%2022.2856%2020.5523C21.7855%2021.0524%2021.1072%2021.3333%2020.4%2021.3333H15.0667C14.3594%2021.3333%2013.6811%2021.0524%2013.181%2020.5523C12.6809%2020.0522%2012.4%2019.3739%2012.4%2018.6667C12.4%2017.9594%2012.6809%2017.2811%2013.181%2016.781C13.6811%2016.281%2014.3594%2016%2015.0667%2016Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", vi = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M22.6667%2028C22.6667%2028.3536%2022.5262%2028.6928%2022.2761%2028.9428C22.0261%2029.1929%2021.687%2029.3333%2021.3333%2029.3333C20.9797%2029.3333%2020.6406%2029.1929%2020.3905%2028.9428C20.1405%2028.6928%2020%2028.3536%2020%2028V4C20%203.64638%2020.1405%203.30724%2020.3905%203.05719C20.6406%202.80714%2020.9797%202.66667%2021.3333%202.66667C21.687%202.66667%2022.0261%202.80714%2022.2761%203.05719C22.5262%203.30724%2022.6667%203.64638%2022.6667%204V28ZM14.6667%206.66667C15.3739%206.66667%2016.0522%206.94762%2016.5523%207.44771C17.0524%207.94781%2017.3333%208.62609%2017.3333%209.33333C17.3333%2010.0406%2017.0524%2010.7189%2016.5523%2011.219C16.0522%2011.719%2015.3739%2012%2014.6667%2012H6.66667C5.95942%2012%205.28115%2011.719%204.78105%2011.219C4.28095%2010.7189%204%2010.0406%204%209.33333C4%208.62609%204.28095%207.94781%204.78105%207.44771C5.28115%206.94762%205.95942%206.66667%206.66667%206.66667H14.6667ZM14.6667%2016C15.3739%2016%2016.0522%2016.281%2016.5523%2016.781C17.0524%2017.2811%2017.3333%2017.9594%2017.3333%2018.6667C17.3333%2019.3739%2017.0524%2020.0522%2016.5523%2020.5523C16.0522%2021.0524%2015.3739%2021.3333%2014.6667%2021.3333H9.33333C8.62609%2021.3333%207.94781%2021.0524%207.44772%2020.5523C6.94762%2020.0522%206.66667%2019.3739%206.66667%2018.6667C6.66667%2017.9594%206.94762%2017.2811%207.44772%2016.781C7.94781%2016.281%208.62609%2016%209.33333%2016H14.6667Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", bi = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M6.39992%204H25.5999C26.1893%204%2026.6666%204.59733%2026.6666%205.33333C26.6666%206.06933%2026.1893%206.66667%2025.5999%206.66667H6.39992C5.81059%206.66667%205.33325%206.06933%205.33325%205.33333C5.33325%204.59733%205.81059%204%206.39992%204ZM9.33325%2012C9.33325%2011.2928%209.6142%2010.6145%2010.1143%2010.1144C10.6144%209.61428%2011.2927%209.33333%2011.9999%209.33333C12.7072%209.33333%2013.3854%209.61428%2013.8855%2010.1144C14.3856%2010.6145%2014.6666%2011.2928%2014.6666%2012V25.3333C14.6666%2026.0406%2014.3856%2026.7189%2013.8855%2027.219C13.3854%2027.719%2012.7072%2028%2011.9999%2028C11.2927%2028%2010.6144%2027.719%2010.1143%2027.219C9.6142%2026.7189%209.33325%2026.0406%209.33325%2025.3333V12ZM17.3333%2012C17.3333%2011.2928%2017.6142%2010.6145%2018.1143%2010.1144C18.6144%209.61428%2019.2927%209.33333%2019.9999%209.33333C20.7072%209.33333%2021.3854%209.61428%2021.8855%2010.1144C22.3856%2010.6145%2022.6666%2011.2928%2022.6666%2012V20C22.6666%2020.7072%2022.3856%2021.3855%2021.8855%2021.8856C21.3854%2022.3857%2020.7072%2022.6667%2019.9999%2022.6667C19.2927%2022.6667%2018.6144%2022.3857%2018.1143%2021.8856C17.6142%2021.3855%2017.3333%2020.7072%2017.3333%2020V12Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", wi = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M6.39992%2025.3333H25.5999C26.1893%2025.3333%2026.6666%2025.9307%2026.6666%2026.6667C26.6666%2027.4027%2026.1893%2028%2025.5999%2028H6.39992C5.81059%2028%205.33325%2027.4027%205.33325%2026.6667C5.33325%2025.9307%205.81059%2025.3333%206.39992%2025.3333ZM14.6666%2020C14.6666%2020.7072%2014.3856%2021.3855%2013.8855%2021.8856C13.3854%2022.3857%2012.7072%2022.6667%2011.9999%2022.6667C11.2927%2022.6667%2010.6144%2022.3857%2010.1143%2021.8856C9.6142%2021.3855%209.33325%2020.7072%209.33325%2020V6.66667C9.33325%205.95942%209.6142%205.28115%2010.1143%204.78105C10.6144%204.28095%2011.2927%204%2011.9999%204C12.7072%204%2013.3854%204.28095%2013.8855%204.78105C14.3856%205.28115%2014.6666%205.95942%2014.6666%206.66667V20ZM22.6666%2020C22.6666%2020.7072%2022.3856%2021.3855%2021.8855%2021.8856C21.3854%2022.3857%2020.7072%2022.6667%2019.9999%2022.6667C19.2927%2022.6667%2018.6144%2022.3857%2018.1143%2021.8856C17.6142%2021.3855%2017.3333%2020.7072%2017.3333%2020V12C17.3333%2011.2928%2017.6142%2010.6145%2018.1143%2010.1144C18.6144%209.61428%2019.2927%209.33333%2019.9999%209.33333C20.7072%209.33333%2021.3854%209.61428%2021.8855%2010.1144C22.3856%2010.6145%2022.6666%2011.2928%2022.6666%2012V20Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", xi = "data:image/svg+xml,%3csvg%20width='33'%20height='32'%20viewBox='0%200%2033%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M3.80005%2024.7791V6.22093C3.80005%205.54663%204.41923%205%205.18303%205C5.94683%205%206.56601%205.54663%206.56601%206.22093V24.7791C6.56601%2025.4534%205.94683%2026%205.18303%2026C4.41923%2026%203.80005%2025.4534%203.80005%2024.7791Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M7.49597%2016.1488L10.3015%2018.9352C10.6394%2019.2708%2011.2681%2019.0598%2011.2681%2018.6107V17.6976H22.332V18.6107C22.332%2019.0598%2022.9607%2019.2708%2023.2986%2018.9352L26.1041%2016.1488C26.4767%2015.7787%2026.4767%2015.221%2026.1041%2014.851L23.2986%2012.0646C22.9607%2011.729%2022.332%2011.94%2022.332%2012.3891V13.3022H11.2681V12.3891C11.2681%2011.94%2010.6394%2011.729%2010.3015%2012.0646L7.49597%2014.851C7.12335%2015.221%207.12335%2015.7787%207.49597%2016.1488Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M27.0341%2024.7791V6.22093C27.0341%205.54663%2027.6533%205%2028.4171%205C29.1809%205%2029.8%205.54663%2029.8%206.22093V24.7791C29.8%2025.4534%2029.1809%2026%2028.4171%2026C27.6533%2026%2027.0341%2025.4534%2027.0341%2024.7791Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", yi = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M3%2024.7791V6.22093C3%205.54663%203.61918%205%204.38298%205C5.14678%205%205.76596%205.54663%205.76596%206.22093V24.7791C5.76596%2025.4534%205.14678%2026%204.38298%2026C3.61918%2026%203%2025.4534%203%2024.7791Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M26.234%2024.7791V6.22093C26.234%205.54663%2026.8532%205%2027.617%205C28.3808%205%2029%205.54663%2029%206.22093V24.7791C29%2025.4534%2028.3808%2026%2027.617%2026C26.8532%2026%2026.234%2025.4534%2026.234%2024.7791Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M15.0141%2016.2491L12.2086%2019.0355C11.8706%2019.3711%2011.2419%2019.1601%2011.2419%2018.711V17.7979H6.71L6.71%2013.4025H11.2419V12.4894C11.2419%2012.0403%2011.8706%2011.8293%2012.2086%2012.1649L15.0141%2014.9513C15.3867%2015.3213%2015.3867%2015.879%2015.0141%2016.2491Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M16.9895%2016.2491L19.795%2019.0355C20.133%2019.3711%2020.7617%2019.1601%2020.7617%2018.711V17.7979H25.2936L25.2936%2013.4025H20.7617V12.4894C20.7617%2012.0403%2020.133%2011.8293%2019.795%2012.1649L16.9895%2014.9513C16.6169%2015.3213%2016.6169%2015.879%2016.9895%2016.2491Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", Ci = "data:image/svg+xml,%3csvg%20width='33'%20height='32'%20viewBox='0%200%2033%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20x='0.399902'%20width='32'%20height='32'%20rx='4'%20fill='%23283540'/%3e%3cpath%20d='M25.179%2029H6.62083C5.94653%2029%205.3999%2028.3808%205.3999%2027.617C5.3999%2026.8532%205.94653%2026.234%206.62083%2026.234H25.179C25.8533%2026.234%2026.3999%2026.8532%2026.3999%2027.617C26.3999%2028.3808%2025.8533%2029%2025.179%2029Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M16.5487%2025.3041L19.3351%2022.4986C19.6707%2022.1606%2019.4597%2021.5319%2019.0106%2021.5319H18.0975V10.4681H19.0106C19.4597%2010.4681%2019.6707%209.83938%2019.3351%209.50144L16.5487%206.69593C16.1786%206.32331%2015.621%206.32331%2015.2509%206.69593L12.4645%209.50144C12.1289%209.83938%2012.3399%2010.4681%2012.789%2010.4681H13.7021V21.5319H12.789C12.3399%2021.5319%2012.1289%2022.1606%2012.4645%2022.4986L15.2509%2025.3041C15.621%2025.6767%2016.1786%2025.6767%2016.5487%2025.3041Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M25.179%205.76596H6.62083C5.94653%205.76596%205.3999%205.14678%205.3999%204.38298C5.3999%203.61918%205.94653%203%206.62083%203H25.179C25.8533%203%2026.3999%203.61918%2026.3999%204.38298C26.3999%205.14678%2025.8533%205.76596%2025.179%205.76596Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", ki = "data:image/svg+xml,%3csvg%20width='33'%20height='32'%20viewBox='0%200%2033%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M7.82103%203H26.3792C27.0535%203%2027.6001%203.61918%2027.6001%204.38298C27.6001%205.14678%2027.0535%205.76596%2026.3792%205.76596H7.82103C7.14673%205.76596%206.6001%205.14678%206.6001%204.38298C6.6001%203.61918%207.14673%203%207.82103%203Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M7.82103%2026.234H26.3792C27.0535%2026.234%2027.6001%2026.8532%2027.6001%2027.617C27.6001%2028.3808%2027.0535%2029%2026.3792%2029H7.82103C7.14673%2029%206.6001%2028.3808%206.6001%2027.617C6.6001%2026.8532%207.14673%2026.234%207.82103%2026.234Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M16.351%2015.0141L13.5646%2012.2086C13.229%2011.8706%2013.44%2011.2419%2013.8891%2011.2419H14.8022V6.71L19.1976%206.71V11.2419H20.1107C20.5598%2011.2419%2020.7708%2011.8706%2020.4352%2012.2086L17.6488%2015.0141C17.2787%2015.3867%2016.7211%2015.3867%2016.351%2015.0141Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M16.351%2016.9895L13.5646%2019.795C13.229%2020.133%2013.44%2020.7617%2013.8891%2020.7617H14.8022V25.2936L19.1976%2025.2936V20.7617H20.1107C20.5598%2020.7617%2020.7708%2020.133%2020.4352%2019.795L17.6488%2016.9895C17.2787%2016.6169%2016.7211%2016.6169%2016.351%2016.9895Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", zi = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M19.5201%206.18689C19.2052%205.87191%2019.4282%205.33334%2019.8737%205.33334H25.6666C26.2189%205.33334%2026.6666%205.78105%2026.6666%206.33334V12.1262C26.6666%2012.5717%2026.128%2012.7948%2025.813%2012.4798L23.9999%2010.6667L18.6666%2016L15.9999%2013.3333L21.3333%208L19.5201%206.18689ZM12.4797%2025.8131C12.7947%2026.1281%2012.5716%2026.6667%2012.1261%2026.6667H6.33325C5.78097%2026.6667%205.33325%2026.219%205.33325%2025.6667V19.8738C5.33325%2019.4283%205.87182%2019.2052%206.18681%2019.5202L7.99992%2021.3333L13.3333%2016L15.9999%2018.6667L10.6666%2024L12.4797%2025.8131Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", Ei = "data:image/svg+xml,%3csvg%20width='33'%20height='32'%20viewBox='0%200%2033%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M14.8666%2016H9.07372C8.62827%2016%208.40519%2016.5386%208.72017%2016.8535L10.5333%2018.6667L5.19995%2024L7.86662%2026.6667L13.2%2021.3333L15.0131%2023.1464C15.328%2023.4614%2015.8666%2023.2383%2015.8666%2022.7929V17C15.8666%2016.4477%2015.4189%2016%2014.8666%2016Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M17.2%2015.6667H22.9929C23.4384%2015.6667%2023.6615%2015.1281%2023.3465%2014.8131L21.5334%2013L26.8667%207.66667L24.2%205L18.8667%2010.3333L17.0536%208.52022C16.7386%208.20524%2016.2%208.42832%2016.2%208.87377V14.6667C16.2%2015.219%2016.6477%2015.6667%2017.2%2015.6667Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", Ai = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M15.9999%2016C15.9999%2016.1427%2015.9692%2016.288%2015.9039%2016.4213C15.8398%2016.5595%2015.7376%2016.6766%2015.6092%2016.7587L6.46256%2022.5587C6.09456%2022.7907%205.6319%2022.6387%205.42923%2022.22C5.36471%2022.089%205.33183%2021.9447%205.33323%2021.7987V10.2013C5.33323%209.72132%205.67323%209.33333%206.09323%209.33333C6.22441%209.33264%206.35289%209.37067%206.46256%209.44266L15.6092%2015.2413C15.7325%2015.3252%2015.8328%2015.4385%2015.901%2015.571C15.9692%2015.7035%2016.0032%2015.851%2015.9999%2016V10.2C15.9999%209.71999%2016.3399%209.33199%2016.7599%209.33199C16.8911%209.33131%2017.0196%209.36934%2017.1292%209.44133L26.2759%2015.24C26.6426%2015.472%2026.7746%2016%2026.5706%2016.42C26.5065%2016.5582%2026.4042%2016.6752%2026.2759%2016.7573L17.1292%2022.5573C16.7612%2022.7893%2016.2986%2022.6373%2016.0959%2022.2187C16.0314%2022.0877%2015.9985%2021.9433%2015.9999%2021.7973V16Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", Si = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M16%2016H21.8C21.9467%2016%2022.0934%2016.0333%2022.2214%2016.096C22.64%2016.2987%2022.792%2016.7627%2022.5587%2017.1293L16.76%2026.276C16.6814%2026.4%2016.564%2026.5027%2016.4227%2026.5707C16.004%2026.7747%2015.476%2026.6427%2015.2427%2026.276L9.4427%2017.1293C9.37118%2017.0195%209.33361%2016.891%209.33469%2016.76C9.33469%2016.34%209.7227%2016%2010.2027%2016H16ZM16%2016C15.6934%2016%2015.3987%2015.8587%2015.24%2015.6093L9.44003%206.46266C9.36898%206.3527%209.33188%206.22424%209.33336%206.09333C9.33336%205.67333%209.72136%205.33333%2010.2014%205.33333H21.7987C21.9454%205.33333%2022.092%205.36666%2022.22%205.42933C22.6387%205.63199%2022.7907%206.096%2022.5574%206.46266L16.7587%2015.6093C16.68%2015.7333%2016.5627%2015.836%2016.4214%2015.904C16.288%2015.9693%2016.1427%2016%2016.0014%2016'%20fill='%238BC3F3'/%3e%3c/svg%3e", _t = Xt;
_t.registerExtension({
  name: "vue-basic",
  getCustomWidgets(L) {
    return {
      CUSTOM_VUE_COMPONENT_BASIC(H) {
        const N = {
          name: "custom_vue_component_basic",
          type: "vue-basic"
        }, F = new jt({
          node: H,
          name: N.name,
          component: gi,
          inputSpec: N,
          options: {}
        });
        return Ut(H, F), { widget: F };
      }
    };
  },
  nodeCreated(L) {
    if (L.constructor.comfyClass !== "vue-basic") return;
    const [H, N] = L.size;
    L.setSize([Math.max(H, 300), Math.max(N, 520)]);
  }
});
_t.registerExtension({
  name: "housekeeper-alignment",
  async setup() {
    try {
      _i();
    } catch {
    }
  },
  nodeCreated(L) {
    L.constructor.comfyClass === "housekeeper-alignment" && (L.setSize([200, 100]), L.title && (L.title = "🎯 Alignment Panel Active"));
  }
});
function _i() {
  let L = null, H = null, N = null, F = !1, m = [], te = [], X = [], R = 0;
  const $ = "housekeeper-recent-colors", P = 9, W = ["#353535", "#3f5159", "#593930", "#335533", "#333355", "#335555", "#553355", "#665533", "#000000"];
  let Z = Ht(), C = null, z = null, E = null, fe = null, j = null, U = null;
  const ve = /* @__PURE__ */ new WeakMap(), he = /* @__PURE__ */ new WeakMap();
  let me = null, ye = !1;
  const M = 48, se = 24;
  function Oe() {
    return document.querySelector("#comfy-menu, .comfyui-menu, .litegraph-menu, .comfyui-toolbar");
  }
  function Ue() {
    const i = Oe();
    if (!i)
      return M;
    const e = i.getBoundingClientRect();
    return !e || e.width === 0 && e.height === 0 ? M : Math.max(M, Math.ceil(e.bottom + 8));
  }
  function be() {
    const i = Ue(), e = window.innerHeight || document.documentElement.clientHeight || 0, o = Math.max(e - i - se, 280);
    document.documentElement.style.setProperty("--hk-top-offset", `${i}px`), document.documentElement.style.setProperty("--hk-panel-max-height", `${o}px`);
  }
  function Te() {
    if (ye || (ye = !0, window.addEventListener("resize", be), window.addEventListener("orientationchange", be)), typeof ResizeObserver < "u") {
      const i = Oe();
      i && (me ? me.disconnect() : me = new ResizeObserver(() => be()), me.observe(i));
    }
  }
  const Ke = [
    { type: "left", icon: mi, label: "Align left edges", group: "basic" },
    { type: "right", icon: vi, label: "Align right edges", group: "basic" },
    { type: "top", icon: bi, label: "Align top edges", group: "basic" },
    { type: "bottom", icon: wi, label: "Align bottom edges", group: "basic" }
  ], qe = [
    { type: "width-max", icon: xi, label: "Match widest width", group: "size" },
    { type: "width-min", icon: yi, label: "Match narrowest width", group: "size" },
    { type: "height-max", icon: Ci, label: "Match tallest height", group: "size" },
    { type: "height-min", icon: ki, label: "Match shortest height", group: "size" },
    { type: "size-max", icon: zi, label: "Match largest size", group: "size" },
    { type: "size-min", icon: Ei, label: "Match smallest size", group: "size" }
  ], Be = [
    { type: "horizontal-flow", icon: Ai, label: "Distribute horizontally", group: "flow" },
    { type: "vertical-flow", icon: Si, label: "Distribute vertically", group: "flow" }
  ], Ce = [
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
  ], O = 4.5, ae = "#AAAAAA";
  function ie() {
    const i = "housekeeper-alignment-styles";
    if (document.getElementById(i)) return;
    const e = document.createElement("style");
    e.id = i, e.textContent = `
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

.housekeeper-custom-picker {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.25s ease, opacity 0.2s ease;
    opacity: 0;
}

.housekeeper-custom-picker.expanded {
    max-height: 220px;
    opacity: 1;
    margin-top: 8px;
}

.housekeeper-custom-picker-content {
    display: flex;
    gap: 16px;
    padding: 10px 12px 12px;
    border: 1px solid rgba(139, 195, 243, 0.35);
    border-radius: 10px;
    background: rgba(22, 24, 29, 0.78);
}

.hk-custom-inputs {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.hk-custom-label {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 12px;
    color: var(--hk-text-muted);
}

.hk-custom-label input[type="color"] {
    width: 48px;
    height: 32px;
    padding: 0;
    border: 1px solid rgba(139, 195, 243, 0.35);
    border-radius: 6px;
    background: transparent;
    cursor: pointer;
}

.hk-custom-label input[type="text"] {
    background: rgba(34, 37, 45, 0.9);
    border: 1px solid rgba(139, 195, 243, 0.35);
    border-radius: 6px;
    padding: 6px 8px;
    color: var(--hk-text-strong);
    font-family: 'Gloria Hallelujah', cursive;
    letter-spacing: 0.04em;
}

.hk-custom-label input[type="text"]::placeholder {
    color: rgba(232, 243, 255, 0.45);
}

.hk-custom-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    justify-content: center;
}

.hk-custom-apply {
    border: 1px solid rgba(139, 195, 243, 0.35);
    background: rgba(139, 195, 243, 0.16);
    color: var(--hk-accent);
    border-radius: 8px;
    padding: 6px 14px;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.2s ease;
    font-size: 13px;
}

.hk-custom-apply:hover {
    background: rgba(139, 195, 243, 0.26);
    transform: translateY(-1px);
}

.hk-custom-preview {
    display: flex;
    gap: 12px;
    align-items: flex-start;
}

.hk-custom-preview-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--hk-text-muted);
}

.hk-custom-preview-swatch {
    width: 32px;
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
`, document.head.appendChild(e);
  }
  ie(), Te(), be();
  function He() {
    const i = document.createElement("section");
    return i.className = "housekeeper-section", i;
  }
  function _e(i) {
    const e = document.createElement("p");
    return e.className = "housekeeper-subtitle", e.textContent = i, e;
  }
  function Je(i, e) {
    const o = document.createElement("div");
    return o.className = `housekeeper-button-grid housekeeper-button-grid-${e}`, i.forEach((s) => {
      o.appendChild(Lt(s));
    }), o;
  }
  function Lt(i) {
    const e = document.createElement("button");
    e.type = "button", e.className = "hk-button", e.dataset.alignmentType = i.type, e.title = i.label, e.setAttribute("aria-label", i.label);
    const o = document.createElement("img");
    return o.src = i.icon, o.alt = "", o.draggable = !1, e.appendChild(o), e.addEventListener("mouseenter", () => wt(i.type)), e.addEventListener("mouseleave", () => Ve()), e.addEventListener("focus", () => wt(i.type)), e.addEventListener("blur", () => Ve()), e.addEventListener("click", () => ke(i.type)), e;
  }
  function ct(i) {
    const e = i.replace("#", "");
    if (e.length === 3) {
      const o = parseInt(e[0] + e[0], 16), s = parseInt(e[1] + e[1], 16), n = parseInt(e[2] + e[2], 16);
      return { r: o, g: s, b: n };
    }
    return e.length === 6 ? {
      r: parseInt(e.slice(0, 2), 16),
      g: parseInt(e.slice(2, 4), 16),
      b: parseInt(e.slice(4, 6), 16)
    } : null;
  }
  function Mt(i, e, o) {
    const s = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
    return `#${s(i)}${s(e)}${s(o)}`;
  }
  function pt(i) {
    const e = ct(i);
    if (!e) return null;
    const o = e.r / 255, s = e.g / 255, n = e.b / 255, l = Math.max(o, s, n), h = Math.min(o, s, n), f = l - h;
    let p = 0;
    f !== 0 && (l === o ? p = (s - n) / f % 6 : l === s ? p = (n - o) / f + 2 : p = (o - s) / f + 4), p = Math.round(p * 60), p < 0 && (p += 360);
    const v = (l + h) / 2, y = f === 0 ? 0 : f / (1 - Math.abs(2 * v - 1));
    return { h: p, s: y, l: v };
  }
  function ut(i, e, o) {
    const s = (1 - Math.abs(2 * o - 1)) * e, n = s * (1 - Math.abs(i / 60 % 2 - 1)), l = o - s / 2;
    let h = 0, f = 0, p = 0;
    return 0 <= i && i < 60 ? (h = s, f = n, p = 0) : 60 <= i && i < 120 ? (h = n, f = s, p = 0) : 120 <= i && i < 180 ? (h = 0, f = s, p = n) : 180 <= i && i < 240 ? (h = 0, f = n, p = s) : 240 <= i && i < 300 ? (h = n, f = 0, p = s) : (h = s, f = 0, p = n), Mt((h + l) * 255, (f + l) * 255, (p + l) * 255);
  }
  function Qe(i, e) {
    const o = pt(i);
    if (!o) return i;
    const s = Math.max(0, Math.min(1, o.l + e));
    return ut(o.h, o.s, s);
  }
  function Pe(i) {
    const e = ct(i);
    return e ? Nt(e) : 0;
  }
  function Nt(i) {
    const e = (o) => {
      const s = o / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * e(i.r) + 0.7152 * e(i.g) + 0.0722 * e(i.b);
  }
  function ht(i, e) {
    const o = Math.max(i, e), s = Math.min(i, e);
    return (o + 0.05) / (s + 0.05);
  }
  function we(i) {
    if (typeof i != "string") return null;
    let e = i.trim();
    return e ? (e.startsWith("#") || (e = `#${e}`), /^#([0-9a-fA-F]{3})$/.test(e) && (e = `#${e[1]}${e[1]}${e[2]}${e[2]}${e[3]}${e[3]}`), /^#([0-9a-fA-F]{6})$/.test(e) ? e.toLowerCase() : null) : null;
  }
  function Bt() {
    var o;
    const i = [], e = (o = window.LGraphCanvas) == null ? void 0 : o.node_colors;
    if (e)
      for (const s of Object.keys(e)) {
        const n = e[s], l = (n == null ? void 0 : n.bgcolor) || (n == null ? void 0 : n.color) || (n == null ? void 0 : n.groupcolor), h = we(l);
        if (h && !i.includes(h) && i.push(h), i.length >= P) break;
      }
    return i.length || W.forEach((s) => {
      const n = we(s);
      n && !i.includes(n) && i.length < P && i.push(n);
    }), i.slice(0, P);
  }
  function Ht() {
    var i;
    try {
      const e = (i = window.localStorage) == null ? void 0 : i.getItem($);
      if (e) {
        const o = JSON.parse(e);
        if (Array.isArray(o)) {
          const s = o.map((n) => we(n)).filter((n) => !!n);
          if (s.length)
            return s.slice(0, P);
        }
      }
    } catch {
    }
    return Bt();
  }
  function Pt(i) {
    var e;
    try {
      (e = window.localStorage) == null || e.setItem($, JSON.stringify(i));
    } catch {
    }
  }
  function ft() {
    C && (C.replaceChildren(), Z.forEach((i) => {
      const e = ot(i);
      C.appendChild(e);
    }));
  }
  function dt(i) {
    const e = we(i);
    if (!e) return;
    const o = Le(e);
    fe && (fe.style.background = o.bgcolor), j && (j.style.background = o.color), U && (U.style.background = o.groupcolor);
  }
  function gt(i) {
    const e = we(i);
    e && (z && (z.value = e), E && (E.value = e.toUpperCase()), dt(e));
  }
  function Dt(i) {
    const e = we(i);
    e && (Z = [e, ...Z.filter((o) => o !== e)], Z.length > P && (Z.length = P), Pt(Z), ft(), gt(e));
  }
  function et(i) {
    const e = we(i);
    e && (vt(e), Me());
  }
  function Ft(i) {
    const e = Pe(i), o = Pe(ae);
    let s = ht(e, o);
    if (s >= O) return i;
    const n = pt(i);
    if (!n) return i;
    const l = e > o ? -1 : 1;
    let h = n.l, f = l > 0 ? 0.98 : 0.02, p = i, v = s;
    for (let y = 0; y < 12; y++) {
      const w = h + (f - h) * 0.5, I = ut(n.h, n.s, Math.max(0.02, Math.min(0.98, w))), G = Pe(I), T = ht(G, o);
      T >= O ? (p = I, v = T, l > 0 ? h = w : f = w) : l > 0 ? f = w : h = w;
    }
    return v >= O ? p : i;
  }
  function mt(i, e, o, s = 6) {
    let n = e, l = 0;
    for (; Math.abs(Pe(i) - Pe(n)) < 0.08 && l < s; ) {
      const h = Qe(n, o);
      if (h === n) break;
      n = h, l += 1;
    }
    return n;
  }
  function Le(i) {
    const o = i.startsWith("#") ? i : `#${i}`;
    let s = Ft(o), n = Qe(s, -0.16), l = Qe(s, 0.12);
    return n = mt(s, n, -0.08), l = mt(s, l, 0.08), {
      color: n,
      bgcolor: s,
      groupcolor: l
    };
  }
  function vt(i) {
    var l, h, f;
    const e = [...m, ...te];
    if (!e.length) {
      ze("Select nodes or groups to apply color", "warning");
      return;
    }
    const o = Le(i), s = /* @__PURE__ */ new Set();
    e.forEach((p) => {
      p != null && p.graph && s.add(p.graph);
    }), s.forEach((p) => {
      var v;
      return (v = p == null ? void 0 : p.beforeChange) == null ? void 0 : v.call(p);
    }), e.forEach((p) => {
      tt(p, o);
    }), s.forEach((p) => {
      var v;
      return (v = p == null ? void 0 : p.afterChange) == null ? void 0 : v.call(p);
    }), Dt(o.bgcolor);
    const n = ((l = window.LGraphCanvas) == null ? void 0 : l.active_canvas) ?? ((h = window.app) == null ? void 0 : h.canvas);
    (f = n == null ? void 0 : n.setDirty) == null || f.call(n, !0, !0);
  }
  function tt(i, e) {
    typeof i.setColorOption == "function" ? i.setColorOption(e) : (i.color = e.color, i.bgcolor = e.bgcolor, i.groupcolor = e.groupcolor);
  }
  function it(i) {
    var e;
    q.active && ((e = q.colorOption) == null ? void 0 : e.bgcolor) === i.bgcolor || (q.active = !0, q.colorOption = i, q.nodes.clear(), q.groups.clear(), m.forEach((o) => {
      q.nodes.set(o, {
        color: o.color,
        bgcolor: o.bgcolor,
        groupcolor: o.groupcolor
      });
    }), te.forEach((o) => {
      q.groups.set(o, {
        color: o.color
      });
    }));
  }
  function rt(i) {
    var o, s, n;
    m.forEach((l) => tt(l, i)), te.forEach((l) => tt(l, i));
    const e = ((o = window.LGraphCanvas) == null ? void 0 : o.active_canvas) ?? ((s = window.app) == null ? void 0 : s.canvas);
    (n = e == null ? void 0 : e.setDirty) == null || n.call(e, !0, !0);
  }
  function Me() {
    var o, s, n;
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
    q.nodes.forEach((l, h) => {
      h && (typeof h.setColorOption == "function" ? h.setColorOption({
        color: l.color ?? h.color,
        bgcolor: l.bgcolor ?? h.bgcolor,
        groupcolor: l.groupcolor ?? h.groupcolor
      }) : (h.color = l.color, h.bgcolor = l.bgcolor, h.groupcolor = l.groupcolor));
    }), q.groups.forEach((l, h) => {
      h && (typeof h.setColorOption == "function" ? h.setColorOption({
        color: l.color ?? h.color,
        bgcolor: l.color ?? h.bgcolor,
        groupcolor: l.color ?? h.groupcolor
      }) : h.color = l.color);
    }), q.active = !1, q.colorOption = null;
    const e = ((o = window.LGraphCanvas) == null ? void 0 : o.active_canvas) ?? ((s = window.app) == null ? void 0 : s.canvas);
    (n = e == null ? void 0 : e.setDirty) == null || n.call(e, !0, !0);
  }
  function Ot(i, e) {
    const o = (s) => {
      s == null || s.preventDefault(), vt(e), q.active = !1, q.colorOption = null, q.nodes.clear(), q.groups.clear();
    };
    i.addEventListener("click", o), i.addEventListener("keydown", (s) => {
      (s.key === "Enter" || s.key === " ") && (s.preventDefault(), o());
    }), i.addEventListener("mouseenter", () => {
      const s = Le(e);
      it(s), rt(s);
    }), i.addEventListener("focus", () => {
      const s = Le(e);
      it(s), rt(s);
    }), i.addEventListener("mouseleave", () => Me()), i.addEventListener("blur", () => Me());
  }
  function ot(i, e = !0) {
    const o = Le(i), s = o.bgcolor.toUpperCase(), n = document.createElement(e ? "button" : "div");
    return e && (n.type = "button", n.setAttribute("aria-label", `Apply color ${s}`), n.title = `Apply color ${s}`), n.className = "hk-color-chip", n.style.background = o.bgcolor, n.style.borderColor = o.color, n.dataset.colorHex = o.bgcolor, e && Ot(n, i), n;
  }
  function bt(i, e) {
    if (!Ce.length) return;
    const o = Ce.length, s = (e % o + o) % o;
    R = s;
    const n = Ce[s];
    i.replaceChildren(), n.forEach((l) => {
      const h = ot(l);
      i.appendChild(h);
    }), i.setAttribute("aria-label", `Color harmony palette ${s + 1} of ${o}`);
  }
  function Tt() {
    L && (be(), F = !0, L.classList.remove("collapsed"), L.classList.add("expanded"), setTimeout(() => {
      H == null || H.focus();
    }, 0));
  }
  function Vt() {
    L && (F = !1, L.classList.remove("expanded"), L.classList.add("collapsed"), N == null || N.focus());
  }
  function at(i) {
    (typeof i == "boolean" ? i : !F) ? Tt() : Vt();
  }
  function It() {
    if (H) return;
    L = document.createElement("div"), L.className = "housekeeper-wrapper collapsed", N = document.createElement("button"), N.type = "button", N.className = "housekeeper-handle", N.title = "Toggle Housekeeper panel (Ctrl+Shift+H)";
    const i = document.createElement("img");
    i.src = Et, i.alt = "", i.draggable = !1, N.appendChild(i);
    const e = document.createElement("span");
    e.textContent = "Housekeeper", N.appendChild(e), N.addEventListener("click", () => at()), H = document.createElement("div"), H.className = "housekeeper-panel", H.setAttribute("role", "region"), H.setAttribute("aria-label", "Housekeeper alignment tools"), H.tabIndex = -1;
    const o = document.createElement("div");
    o.className = "housekeeper-content";
    const s = document.createElement("div");
    s.className = "housekeeper-header";
    const n = document.createElement("div");
    n.className = "housekeeper-header-title";
    const l = document.createElement("img");
    l.src = Et, l.alt = "", l.draggable = !1, n.appendChild(l);
    const h = document.createElement("span");
    h.textContent = "Housekeeper", n.appendChild(h);
    const f = document.createElement("button");
    f.type = "button", f.className = "housekeeper-close", f.setAttribute("aria-label", "Hide Housekeeper panel"), f.innerHTML = "&times;", f.addEventListener("click", () => at(!1)), s.appendChild(n), s.appendChild(f);
    const p = document.createElement("div");
    p.className = "housekeeper-divider";
    const v = He();
    v.classList.add("housekeeper-section-primary"), v.appendChild(_e("Basic Alignment")), v.appendChild(Je(Ke, "basic")), v.appendChild(_e("Size Adjustment")), v.appendChild(Je(qe, "size")), v.appendChild(_e("Flow Alignment")), v.appendChild(Je(Be, "flow"));
    const y = (Y, ee, K = !0) => {
      const le = document.createElement("div");
      return le.className = ee, le.setAttribute("role", "group"), Y.forEach((t) => {
        const g = ot(t, K);
        le.appendChild(g);
      }), le;
    }, w = He();
    w.appendChild(_e("Recent colors")), C = document.createElement("div"), C.className = "housekeeper-color-recent", ft(), w.appendChild(C), w.appendChild(_e("Preset palettes"));
    const I = document.createElement("div");
    I.className = "housekeeper-color-carousel";
    const G = document.createElement("button");
    G.type = "button", G.className = "hk-palette-arrow hk-palette-arrow-prev", G.innerHTML = "&#9664;";
    const T = document.createElement("div");
    T.className = "housekeeper-color-strip", T.setAttribute("role", "group");
    const u = document.createElement("button");
    u.type = "button", u.className = "hk-palette-arrow hk-palette-arrow-next", u.innerHTML = "&#9654;", I.appendChild(G), I.appendChild(T), I.appendChild(u), w.appendChild(I);
    const x = () => {
      const Y = Ce.length, ee = (R - 1 + Y) % Y, K = (R + 1) % Y;
      G.setAttribute("aria-label", `Show color set ${ee + 1} of ${Y}`), u.setAttribute("aria-label", `Show color set ${K + 1} of ${Y}`);
    }, r = (Y) => {
      const ee = Ce.length;
      ee && (R = (R + Y + ee) % ee, bt(T, R), x());
    };
    G.addEventListener("click", () => r(-1)), u.addEventListener("click", () => r(1)), bt(T, R), x();
    const S = document.createElement("div");
    S.className = "housekeeper-custom-row";
    const D = document.createElement("span");
    D.textContent = "Custom", S.appendChild(D);
    const re = document.createElement("button");
    re.type = "button", re.className = "hk-custom-toggle", re.textContent = "Show", re.setAttribute("aria-expanded", "false"), S.appendChild(re), w.appendChild(S);
    const de = document.createElement("div");
    de.className = "housekeeper-custom-picker";
    const J = document.createElement("div");
    J.className = "housekeeper-custom-picker-content", de.appendChild(J), w.appendChild(de);
    const a = document.createElement("div");
    a.className = "hk-custom-inputs";
    const c = document.createElement("label");
    c.className = "hk-custom-label", c.textContent = "Pick", z = document.createElement("input"), z.type = "color", c.appendChild(z), a.appendChild(c);
    const k = document.createElement("label");
    k.className = "hk-custom-label", k.textContent = "Hex", E = document.createElement("input"), E.type = "text", E.placeholder = "#RRGGBB", E.maxLength = 7, k.appendChild(E), a.appendChild(k);
    const A = document.createElement("div");
    A.className = "hk-custom-actions";
    const _ = document.createElement("button");
    _.type = "button", _.className = "hk-custom-apply", _.textContent = "Apply", A.appendChild(_);
    const ne = document.createElement("div");
    ne.className = "hk-custom-preview";
    const xe = (Y) => {
      const ee = document.createElement("div");
      ee.className = "hk-custom-preview-item";
      const K = document.createElement("div");
      K.className = "hk-custom-preview-swatch";
      const le = document.createElement("span");
      return le.textContent = Y, ee.appendChild(K), ee.appendChild(le), { item: ee, swatch: K };
    }, Ee = xe("Body"), Ge = xe("Title"), Ye = xe("Group");
    fe = Ee.swatch, j = Ge.swatch, U = Ye.swatch, ne.appendChild(Ee.item), ne.appendChild(Ge.item), ne.appendChild(Ye.item), J.appendChild(a), J.appendChild(A), J.appendChild(ne);
    const Ne = Z[0] || W[0];
    gt(Ne), re.addEventListener("click", () => {
      const Y = de.classList.toggle("expanded");
      re.textContent = Y ? "Hide" : "Show", re.setAttribute("aria-expanded", Y ? "true" : "false"), Y || Me();
    });
    const Ze = (Y, ee) => {
      const K = we(Y);
      if (!K || (ee === "color" && E && (E.value = K.toUpperCase()), ee === "text" && z && (z.value = K), dt(K), !m.length && !te.length)) return;
      const le = Le(K);
      it(le), rt(le);
    };
    z == null || z.addEventListener("input", () => Ze(z.value, "color")), z == null || z.addEventListener("change", () => et(z.value)), z == null || z.addEventListener("blur", () => Me()), E == null || E.addEventListener("input", () => Ze(E.value, "text")), E == null || E.addEventListener("keydown", (Y) => {
      Y.key === "Enter" && (Y.preventDefault(), et(E.value));
    }), E == null || E.addEventListener("blur", () => Me()), _.addEventListener("click", () => et((E == null ? void 0 : E.value) || (z == null ? void 0 : z.value) || Ne)), w.appendChild(_e("On this page"));
    const Ae = y(
      ["#C9CCD1", "#5A7A9F", "#2E3136", "#6F7B89", "#4B6076", "#2B3F2F", "#2C3D4E", "#4C3C5A", "#3F2725", "#1E1E1F"],
      "housekeeper-color-footer"
    );
    w.appendChild(Ae), o.appendChild(s), o.appendChild(p), o.appendChild(v);
    const We = document.createElement("div");
    We.className = "housekeeper-divider housekeeper-divider-spaced", o.appendChild(We), o.appendChild(w), H.appendChild(o), L.appendChild(N), L.appendChild(H), document.body.appendChild(L), Te(), be();
  }
  function wt(i) {
    var s;
    if (m.length < 2) return;
    Ve();
    const e = (s = window.app) == null ? void 0 : s.canvas;
    if (!e) return;
    Rt(i, m).forEach((n, l) => {
      if (n && m[l]) {
        const h = document.createElement("div");
        h.style.cssText = `
                    position: fixed;
                    background: rgba(74, 144, 226, 0.3);
                    border: 2px dashed rgba(74, 144, 226, 0.7);
                    border-radius: 4px;
                    z-index: 999;
                    pointer-events: none;
                    transition: all 0.2s ease;
                `;
        const f = (n.x + e.ds.offset[0]) * e.ds.scale, p = (n.y + e.ds.offset[1]) * e.ds.scale, v = e.canvas.parentElement, y = e.canvas.getBoundingClientRect(), w = v ? v.getBoundingClientRect() : null;
        w && y.top - w.top, y.top;
        const I = document.querySelector("nav");
        let G = 31;
        I && (G = I.getBoundingClientRect().height);
        const T = G * e.ds.scale, u = y.left + f, x = y.top + p - T, r = n.width * e.ds.scale, S = n.height * e.ds.scale;
        h.style.left = u + "px", h.style.top = x + "px", h.style.width = r + "px", h.style.height = S + "px", document.body.appendChild(h), X.push(h);
      }
    });
  }
  function Ve() {
    X.forEach((i) => {
      i.parentNode && i.parentNode.removeChild(i);
    }), X = [];
  }
  function Rt(i, e) {
    if (e.length < 2) return [];
    const o = [], s = Math.min(...e.map((f) => f.pos[0])), n = Math.max(...e.map((f) => {
      let p = 150;
      return f.size && Array.isArray(f.size) && f.size[0] ? p = f.size[0] : typeof f.width == "number" ? p = f.width : f.properties && typeof f.properties.width == "number" && (p = f.properties.width), f.pos[0] + p;
    })), l = Math.min(...e.map((f) => f.pos[1])), h = Math.max(...e.map((f) => {
      let p = 100;
      return f.size && Array.isArray(f.size) && f.size[1] ? p = f.size[1] : typeof f.height == "number" ? p = f.height : f.properties && typeof f.properties.height == "number" && (p = f.properties.height), f.pos[1] + p;
    }));
    switch (i) {
      case "left":
        const f = [...e].sort((t, g) => t.pos[1] - g.pos[1]);
        let p = f[0].pos[1];
        const v = /* @__PURE__ */ new Map();
        f.forEach((t) => {
          let g = 100, b = 150;
          t.size && Array.isArray(t.size) ? (t.size[1] && (g = t.size[1]), t.size[0] && (b = t.size[0])) : (typeof t.height == "number" && (g = t.height), typeof t.width == "number" && (b = t.width), t.properties && (typeof t.properties.height == "number" && (g = t.properties.height), typeof t.properties.width == "number" && (b = t.properties.width))), v.set(t.id, {
            x: s,
            y: p,
            width: b,
            height: g
          }), p += g + 30;
        }), e.forEach((t) => {
          o.push(v.get(t.id));
        });
        break;
      case "right":
        const y = [...e].sort((t, g) => t.pos[1] - g.pos[1]);
        let w = y[0].pos[1];
        const I = /* @__PURE__ */ new Map();
        y.forEach((t) => {
          let g = 100, b = 150;
          t.size && Array.isArray(t.size) ? (t.size[1] && (g = t.size[1]), t.size[0] && (b = t.size[0])) : (typeof t.height == "number" && (g = t.height), typeof t.width == "number" && (b = t.width), t.properties && (typeof t.properties.height == "number" && (g = t.properties.height), typeof t.properties.width == "number" && (b = t.properties.width))), I.set(t.id, {
            x: n - b,
            y: w,
            width: b,
            height: g
          }), w += g + 30;
        }), e.forEach((t) => {
          o.push(I.get(t.id));
        });
        break;
      case "top":
        const G = [...e].sort((t, g) => t.pos[0] - g.pos[0]);
        let T = G[0].pos[0];
        const u = /* @__PURE__ */ new Map();
        G.forEach((t) => {
          let g = 100, b = 150;
          t.size && Array.isArray(t.size) ? (t.size[1] && (g = t.size[1]), t.size[0] && (b = t.size[0])) : (typeof t.height == "number" && (g = t.height), typeof t.width == "number" && (b = t.width), t.properties && (typeof t.properties.height == "number" && (g = t.properties.height), typeof t.properties.width == "number" && (b = t.properties.width))), u.set(t.id, {
            x: T,
            y: l,
            width: b,
            height: g
          }), T += b + 30;
        }), e.forEach((t) => {
          o.push(u.get(t.id));
        });
        break;
      case "bottom":
        const x = [...e].sort((t, g) => t.pos[0] - g.pos[0]);
        let r = s;
        const S = /* @__PURE__ */ new Map();
        x.forEach((t) => {
          let g = 100, b = 150;
          t.size && Array.isArray(t.size) ? (t.size[1] && (g = t.size[1]), t.size[0] && (b = t.size[0])) : (typeof t.height == "number" && (g = t.height), typeof t.width == "number" && (b = t.width), t.properties && (typeof t.properties.height == "number" && (g = t.properties.height), typeof t.properties.width == "number" && (b = t.properties.width))), S.set(t.id, {
            x: r,
            y: h - g,
            width: b,
            height: g
          }), r += b + 30;
        }), e.forEach((t) => {
          o.push(S.get(t.id));
        });
        break;
      case "horizontal-flow":
        const D = e.filter((t) => {
          if (!t) return !1;
          const g = t.pos || t.position || typeof t.x == "number" && typeof t.y == "number", b = t.size || t.width || t.height || typeof t.width == "number" && typeof t.height == "number";
          return !!g && !!b;
        });
        if (D.length < 2) break;
        const re = Math.min(...D.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[0] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[0] : typeof t.x == "number" ? t.x : 0)), de = Math.min(...D.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[1] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[1] : typeof t.y == "number" ? t.y : 0)), J = D.map((t) => ({
          ...t,
          pos: t.pos ? [...t.pos] : [t.x || 0, t.y || 0],
          _calculatedSize: t.size && Array.isArray(t.size) ? [t.size[0], t.size[1]] : [t.width || 150, t.height || 100]
        })), a = Re(J), c = $e(J, a), k = 30, A = 30, _ = 5, ne = {};
        J.forEach((t) => {
          var g;
          if (t && t.id) {
            const b = ((g = c[t.id]) == null ? void 0 : g.level) ?? 0;
            ne[b] || (ne[b] = []), ne[b].push(t);
          }
        });
        const xe = /* @__PURE__ */ new Map();
        Object.entries(ne).forEach(([t, g]) => {
          const b = parseInt(t);
          if (g && g.length > 0) {
            g.sort((d, V) => {
              const ue = d && d.id && c[d.id] ? c[d.id].order : 0, B = V && V.id && c[V.id] ? c[V.id].order : 0;
              return ue - B;
            });
            let ce = re;
            if (b > 0)
              for (let d = 0; d < b; d++) {
                const V = ne[d] || [], ue = Math.max(...V.map(
                  (B) => B && B._calculatedSize && B._calculatedSize[0] ? B._calculatedSize[0] : 150
                ));
                ce += ue + k + _;
              }
            let pe = de;
            g.forEach((d) => {
              d && d._calculatedSize && (xe.set(d.id, {
                x: ce,
                y: pe,
                width: d._calculatedSize[0],
                height: d._calculatedSize[1]
              }), pe += d._calculatedSize[1] + A);
            });
          }
        }), e.forEach((t) => {
          const g = xe.get(t.id);
          g && o.push(g);
        });
        break;
      case "vertical-flow":
        const Ee = e.filter((t) => {
          if (!t) return !1;
          const g = t.pos || t.position || typeof t.x == "number" && typeof t.y == "number", b = t.size || t.width || t.height || typeof t.width == "number" && typeof t.height == "number";
          return !!g && !!b;
        });
        if (Ee.length < 2) break;
        const Ge = Math.min(...Ee.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[0] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[0] : typeof t.x == "number" ? t.x : 0)), Ye = Math.min(...Ee.map((t) => t.pos && (Array.isArray(t.pos) || t.pos.length !== void 0) ? t.pos[1] : t.position && (Array.isArray(t.position) || t.position.length !== void 0) ? t.position[1] : typeof t.y == "number" ? t.y : 0)), Ne = Ee.map((t) => ({
          ...t,
          pos: t.pos ? [...t.pos] : [t.x || 0, t.y || 0],
          _calculatedSize: t.size && Array.isArray(t.size) ? [t.size[0], t.size[1]] : [t.width || 150, t.height || 100]
        })), Ze = Re(Ne), Ae = $e(Ne, Ze), We = 30, Y = 30, ee = 5, K = {};
        Ne.forEach((t) => {
          var g;
          if (t && t.id) {
            const b = ((g = Ae[t.id]) == null ? void 0 : g.level) ?? 0;
            K[b] || (K[b] = []), K[b].push(t);
          }
        });
        const le = /* @__PURE__ */ new Map();
        Object.entries(K).forEach(([t, g]) => {
          const b = parseInt(t);
          if (g && g.length > 0) {
            g.sort((d, V) => {
              const ue = d && d.id && Ae[d.id] ? Ae[d.id].order : 0, B = V && V.id && Ae[V.id] ? Ae[V.id].order : 0;
              return ue - B;
            });
            let ce = Ye;
            if (b > 0)
              for (let d = 0; d < b; d++) {
                const V = K[d] || [], ue = Math.max(...V.map(
                  (B) => B && B._calculatedSize && B._calculatedSize[1] ? B._calculatedSize[1] : 100
                ));
                ce += ue + We + ee;
              }
            let pe = Ge;
            g.forEach((d) => {
              d && d._calculatedSize && (le.set(d.id, {
                x: pe,
                y: ce,
                width: d._calculatedSize[0],
                height: d._calculatedSize[1]
              }), pe += d._calculatedSize[0] + Y);
            });
          }
        }), e.forEach((t) => {
          const g = le.get(t.id);
          g && o.push(g);
        });
        break;
      case "width-max":
      case "width-min":
      case "height-max":
      case "height-min":
      case "size-max":
      case "size-min":
        e.forEach((t) => {
          let g = 150, b = 100;
          t.size && Array.isArray(t.size) ? (t.size[0] && (g = t.size[0]), t.size[1] && (b = t.size[1])) : (typeof t.width == "number" && (g = t.width), typeof t.height == "number" && (b = t.height), t.properties && (typeof t.properties.width == "number" && (g = t.properties.width), typeof t.properties.height == "number" && (b = t.properties.height)));
          let ce = g, pe = b;
          if (i === "width-max" || i === "size-max")
            ce = Math.max(...e.map((d) => d.size && Array.isArray(d.size) && d.size[0] ? d.size[0] : typeof d.width == "number" ? d.width : d.properties && typeof d.properties.width == "number" ? d.properties.width : 150));
          else if (i === "width-min")
            ce = Math.min(...e.map((d) => d.size && Array.isArray(d.size) && d.size[0] ? d.size[0] : typeof d.width == "number" ? d.width : d.properties && typeof d.properties.width == "number" ? d.properties.width : 150));
          else if (i === "size-min") {
            const d = he.get(t) || t.computeSize;
            if (d)
              try {
                const V = d.call(t);
                V && V.length >= 2 && V[0] !== void 0 && V[1] !== void 0 ? (ce = V[0], pe = V[1] + 30) : typeof V == "number" ? (ce = g, pe = V + 30) : (ce = g, pe = b);
              } catch {
                ce = g, pe = b;
              }
          }
          if (i === "height-max" || i === "size-max")
            pe = Math.max(...e.map((d) => d.size && Array.isArray(d.size) && d.size[1] ? d.size[1] : typeof d.height == "number" ? d.height : d.properties && typeof d.properties.height == "number" ? d.properties.height : 100));
          else if (i === "height-min") {
            const d = Math.min(...e.map((B) => B.size && B.size[1] !== void 0 ? B.size[1] : typeof B.height == "number" ? B.height : B.properties && typeof B.properties.height == "number" ? B.properties.height : 100)), V = he.get(t) || t.computeSize;
            let ue = null;
            if (V)
              try {
                const B = V.call(t);
                B && B.length >= 2 && B[1] !== void 0 ? ue = B[1] + 30 : typeof B == "number" && (ue = B + 30);
              } catch {
              }
            pe = ue && ue > d ? ue : d;
          }
          o.push({
            x: t.pos[0],
            y: t.pos[1],
            width: ce,
            height: pe
          });
        });
        break;
    }
    return o;
  }
  function Ie() {
    var l;
    if (!((l = window.app) != null && l.graph)) return;
    const i = window.app.graph;
    m = Object.values(i._nodes || {}).filter((h) => h && h.is_selected), te = (Array.isArray(i._groups) ? i._groups : []).filter((h) => h && h.selected);
    const s = m.length > 1;
    m.length + te.length, s || Ve(), L && L.classList.toggle("hk-has-selection", s);
    const n = H == null ? void 0 : H.querySelectorAll(".hk-button");
    n == null || n.forEach((h) => {
      h.disabled = !s;
    });
  }
  function Re(i) {
    const e = {}, o = i.filter((s) => s && (s.id !== void 0 || s.id !== null));
    return o.forEach((s) => {
      const n = s.id || `node_${o.indexOf(s)}`;
      s.id = n, e[n] = { inputs: [], outputs: [] }, s.inputs && Array.isArray(s.inputs) && s.inputs.forEach((l, h) => {
        l && l.link !== null && l.link !== void 0 && e[n].inputs.push({
          index: h,
          link: l.link,
          sourceNode: $t(l.link, o)
        });
      }), s.outputs && Array.isArray(s.outputs) && s.outputs.forEach((l, h) => {
        l && l.links && Array.isArray(l.links) && l.links.length > 0 && l.links.forEach((f) => {
          const p = Gt(f, o);
          p && e[n].outputs.push({
            index: h,
            link: f,
            targetNode: p
          });
        });
      });
    }), e;
  }
  function $t(i, e) {
    for (const o of e)
      if (o && o.outputs && Array.isArray(o.outputs)) {
        for (const s of o.outputs)
          if (s && s.links && Array.isArray(s.links) && s.links.includes(i))
            return o;
      }
    return null;
  }
  function Gt(i, e) {
    for (const o of e)
      if (o && o.inputs && Array.isArray(o.inputs)) {
        for (const s of o.inputs)
          if (s && s.link === i)
            return o;
      }
    return null;
  }
  function $e(i, e) {
    const o = {}, s = /* @__PURE__ */ new Set(), n = i.filter((p) => p && p.id), l = n.filter((p) => {
      const v = p.id;
      return !e[v] || !e[v].inputs.length || e[v].inputs.every((y) => !y.sourceNode);
    });
    l.length === 0 && n.length > 0 && l.push(n[0]);
    const h = l.map((p) => ({ node: p, level: 0 }));
    for (; h.length > 0; ) {
      const { node: p, level: v } = h.shift();
      !p || !p.id || s.has(p.id) || (s.add(p.id), o[p.id] = { level: v, order: 0 }, e[p.id] && e[p.id].outputs && e[p.id].outputs.forEach((y) => {
        y && y.targetNode && y.targetNode.id && !s.has(y.targetNode.id) && h.push({ node: y.targetNode, level: v + 1 });
      }));
    }
    n.forEach((p) => {
      p && p.id && !o[p.id] && (o[p.id] = { level: 0, order: 0 });
    });
    const f = {};
    return Object.entries(o).forEach(([p, v]) => {
      f[v.level] || (f[v.level] = []);
      const y = n.find((w) => w && w.id === p);
      y && f[v.level].push(y);
    }), Object.entries(f).forEach(([p, v]) => {
      v && v.length > 0 && (v.sort((y, w) => {
        const I = y && y.pos && y.pos[1] ? y.pos[1] : 0, G = w && w.pos && w.pos[1] ? w.pos[1] : 0;
        return I - G;
      }), v.forEach((y, w) => {
        y && y.id && o[y.id] && (o[y.id].order = w);
      }));
    }), o;
  }
  function ke(i) {
    var e, o, s, n, l;
    if (m.length < 2) {
      ze("Please select at least 2 nodes to align", "warning");
      return;
    }
    try {
      const h = Math.min(...m.map((u) => u.pos[0])), f = Math.max(...m.map((u) => {
        let x = 150;
        return u.size && Array.isArray(u.size) && u.size[0] ? x = u.size[0] : typeof u.width == "number" ? x = u.width : u.properties && typeof u.properties.width == "number" && (x = u.properties.width), u.pos[0] + x;
      })), p = Math.min(...m.map((u) => u.pos[1])), v = Math.max(...m.map((u) => {
        let x = 100;
        return u.size && Array.isArray(u.size) && u.size[1] ? x = u.size[1] : typeof u.height == "number" ? x = u.height : u.properties && typeof u.properties.height == "number" && (x = u.properties.height), u.pos[1] + x;
      })), y = Math.max(...m.map((u) => {
        const x = ve.get(u);
        if (x && x.width !== void 0) return x.width;
        let r = 150;
        return u.size && Array.isArray(u.size) && u.size[0] ? r = u.size[0] : typeof u.width == "number" ? r = u.width : u.properties && typeof u.properties.width == "number" && (r = u.properties.width), r;
      })), w = Math.min(...m.map((u) => {
        const x = ve.get(u);
        if (x && x.width !== void 0) return x.width;
        let r = 150;
        return u.size && Array.isArray(u.size) && u.size[0] ? r = u.size[0] : typeof u.width == "number" ? r = u.width : u.properties && typeof u.properties.width == "number" && (r = u.properties.width), r;
      })), I = Math.max(...m.map((u) => {
        const x = ve.get(u);
        return x && x.height !== void 0 ? x.height : u.size && u.size[1] !== void 0 ? u.size[1] : typeof u.height == "number" ? u.height : u.properties && typeof u.properties.height == "number" ? u.properties.height : 100;
      })), G = Math.min(...m.map((u) => u.size && u.size[1] !== void 0 ? u.size[1] : typeof u.height == "number" ? u.height : u.properties && typeof u.properties.height == "number" ? u.properties.height : 100));
      let T;
      switch (i) {
        case "left":
          T = h;
          const u = [...m].sort((a, c) => a.pos[1] - c.pos[1]);
          let x = u[0].pos[1];
          u.forEach((a, c) => {
            let A = 100;
            a.size && Array.isArray(a.size) && a.size[1] ? A = a.size[1] : typeof a.height == "number" ? A = a.height : a.properties && typeof a.properties.height == "number" && (A = a.properties.height), a.pos[0] = T, a.pos[1] = x, typeof a.x == "number" && (a.x = a.pos[0]), typeof a.y == "number" && (a.y = a.pos[1]), x += A + 30;
          });
          break;
        case "right":
          T = f;
          const r = [...m].sort((a, c) => a.pos[1] - c.pos[1]);
          let S = r[0].pos[1];
          r.forEach((a, c) => {
            let A = 100, _ = 150;
            a.size && Array.isArray(a.size) ? (a.size[1] && (A = a.size[1]), a.size[0] && (_ = a.size[0])) : (typeof a.height == "number" && (A = a.height), typeof a.width == "number" && (_ = a.width), a.properties && (typeof a.properties.height == "number" && (A = a.properties.height), typeof a.properties.width == "number" && (_ = a.properties.width))), a.pos[0] = T - _, a.pos[1] = S, typeof a.x == "number" && (a.x = a.pos[0]), typeof a.y == "number" && (a.y = a.pos[1]), S += A + 30;
          });
          break;
        case "top":
          T = p;
          const D = [...m].sort((a, c) => a.pos[0] - c.pos[0]);
          let re = D[0].pos[0];
          D.forEach((a, c) => {
            let A = 150;
            a.size && Array.isArray(a.size) && a.size[0] ? A = a.size[0] : typeof a.width == "number" ? A = a.width : a.properties && typeof a.properties.width == "number" && (A = a.properties.width), a.pos[1] = T, a.pos[0] = re, typeof a.x == "number" && (a.x = a.pos[0]), typeof a.y == "number" && (a.y = a.pos[1]), re += A + 30;
          });
          break;
        case "bottom":
          T = v;
          const de = [...m].sort((a, c) => a.pos[0] - c.pos[0]);
          let J = h;
          de.forEach((a, c) => {
            let A = 150, _ = 100;
            a.size && Array.isArray(a.size) ? (a.size[0] && (A = a.size[0]), a.size[1] && (_ = a.size[1])) : (typeof a.width == "number" && (A = a.width), typeof a.height == "number" && (_ = a.height), a.properties && (typeof a.properties.width == "number" && (A = a.properties.width), typeof a.properties.height == "number" && (_ = a.properties.height)));
            const ne = T - _, xe = J;
            a.pos[1] = ne, a.pos[0] = xe, typeof a.x == "number" && (a.x = a.pos[0]), typeof a.y == "number" && (a.y = a.pos[1]), J += A + 30;
          });
          break;
        case "width-max":
          m.forEach((a) => {
            a.size && (a.size[0] = y);
          });
          break;
        case "width-min":
          m.forEach((a) => {
            a.size && (a.size[0] = w);
          });
          break;
        case "height-max":
          m.forEach((a) => {
            a.size && (a.size[1] = I);
          });
          break;
        case "height-min":
          m.forEach((a) => {
            if (a.size) {
              const c = he.get(a) || a.computeSize;
              if (c) {
                const k = c.call(a);
                a.size[1] = Math.max(G, k[1]);
              }
            }
          });
          break;
        case "size-max":
          m.forEach((a) => {
            a.size && (a.size[0] = y, a.size[1] = I);
          });
          break;
        case "size-min":
          m.forEach((a) => {
            if (a.size) {
              const c = he.get(a) || a.computeSize;
              if (c) {
                const k = c.call(a);
                a.size[0] = k[0], a.size[1] = k[1];
              }
            }
          });
          break;
        case "horizontal-flow":
          Yt();
          return;
        // Don't continue to the success message at the bottom
        case "vertical-flow":
          Zt();
          return;
      }
      try {
        (o = (e = window.app) == null ? void 0 : e.canvas) != null && o.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (n = (s = window.app) == null ? void 0 : s.graph) != null && n.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (l = window.app) != null && l.canvas && window.app.canvas.draw(!0, !0);
      } catch {
      }
    } catch {
      ze("Error during alignment", "error");
    }
  }
  function Li(i) {
  }
  function Yt() {
    var i, e, o, s, n;
    try {
      const l = m.filter((r) => {
        if (!r) return !1;
        const S = r.pos || r.position || typeof r.x == "number" && typeof r.y == "number", D = r.size || r.width || r.height || typeof r.width == "number" && typeof r.height == "number";
        return !!S && !!D;
      });
      if (l.length < 2) {
        ze(`Not enough valid nodes: ${l.length}/${m.length} nodes are valid`, "warning");
        return;
      }
      const h = Math.min(...l.map((r) => r.pos && (Array.isArray(r.pos) || r.pos.length !== void 0) ? r.pos[0] : r.position && (Array.isArray(r.position) || r.position.length !== void 0) ? r.position[0] : typeof r.x == "number" ? r.x : 0)), f = Math.min(...l.map((r) => r.pos && (Array.isArray(r.pos) || r.pos.length !== void 0) ? r.pos[1] : r.position && (Array.isArray(r.position) || r.position.length !== void 0) ? r.position[1] : typeof r.y == "number" ? r.y : 0)), p = h, v = f;
      l.forEach((r) => {
        r.pos || (r.position && Array.isArray(r.position) ? r.pos = r.position : typeof r.x == "number" && typeof r.y == "number" ? r.pos = [r.x, r.y] : r.pos = [0, 0]), r._calculatedSize || (r.size && Array.isArray(r.size) ? r._calculatedSize = [r.size[0], r.size[1]] : typeof r.width == "number" && typeof r.height == "number" ? r._calculatedSize = [r.width, r.height] : r._calculatedSize = [150, 100]), Array.isArray(r.pos) || (r.pos = [0, 0]);
      });
      const y = Re(l), w = $e(l, y), I = 30, G = 30, T = 30, u = 5, x = {};
      l.forEach((r) => {
        var S;
        if (r && r.id) {
          const D = ((S = w[r.id]) == null ? void 0 : S.level) ?? 0;
          x[D] || (x[D] = []), x[D].push(r);
        }
      }), Object.entries(x).forEach(([r, S]) => {
        const D = parseInt(r);
        if (S && S.length > 0) {
          S.sort((c, k) => {
            const A = c && c.id && w[c.id] ? w[c.id].order : 0, _ = k && k.id && w[k.id] ? w[k.id].order : 0;
            return A - _;
          });
          const re = S.reduce((c, k, A) => {
            const _ = k && k._calculatedSize && k._calculatedSize[1] ? k._calculatedSize[1] : 100;
            return c + _ + (A < S.length - 1 ? T : 0);
          }, 0), de = Math.max(...S.map(
            (c) => c && c._calculatedSize && c._calculatedSize[0] ? c._calculatedSize[0] : 150
          ));
          let J = p;
          if (D > 0)
            for (let c = 0; c < D; c++) {
              const k = x[c] || [], A = Math.max(...k.map(
                (_) => _ && _._calculatedSize && _._calculatedSize[0] ? _._calculatedSize[0] : 150
              ));
              J += A + I + u;
            }
          let a = v;
          S.forEach((c, k) => {
            if (c && c.pos && c._calculatedSize) {
              const A = [c.pos[0], c.pos[1]], _ = [c._calculatedSize[0], c._calculatedSize[1]];
              c.pos[0] = J, c.pos[1] = a, a += c._calculatedSize[1] + T, typeof c.x == "number" && (c.x = c.pos[0]), typeof c.y == "number" && (c.y = c.pos[1]);
            }
          });
        }
      });
      try {
        (e = (i = window.app) == null ? void 0 : i.canvas) != null && e.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (s = (o = window.app) == null ? void 0 : o.graph) != null && s.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (n = window.app) != null && n.canvas && window.app.canvas.draw(!0, !0);
      } catch {
      }
    } catch {
      ze("Error in horizontal flow alignment", "error");
    }
  }
  function Zt() {
    var i, e, o, s, n;
    try {
      const l = m.filter((r) => {
        if (!r) return !1;
        const S = r.pos || r.position || typeof r.x == "number" && typeof r.y == "number", D = r.size || r.width || r.height || typeof r.width == "number" && typeof r.height == "number";
        return !!S && !!D;
      });
      if (l.length < 2) {
        ze(`Not enough valid nodes: ${l.length}/${m.length} nodes are valid`, "warning");
        return;
      }
      const h = Math.min(...l.map((r) => r.pos && (Array.isArray(r.pos) || r.pos.length !== void 0) ? r.pos[0] : r.position && (Array.isArray(r.position) || r.position.length !== void 0) ? r.position[0] : typeof r.x == "number" ? r.x : 0)), f = Math.min(...l.map((r) => r.pos && (Array.isArray(r.pos) || r.pos.length !== void 0) ? r.pos[1] : r.position && (Array.isArray(r.position) || r.position.length !== void 0) ? r.position[1] : typeof r.y == "number" ? r.y : 0)), p = h, v = f;
      l.forEach((r) => {
        r.pos || (r.position && Array.isArray(r.position) ? r.pos = r.position : typeof r.x == "number" && typeof r.y == "number" ? r.pos = [r.x, r.y] : r.pos = [0, 0]), r._calculatedSize || (r.size && Array.isArray(r.size) ? r._calculatedSize = [r.size[0], r.size[1]] : typeof r.width == "number" && typeof r.height == "number" ? r._calculatedSize = [r.width, r.height] : r._calculatedSize = [150, 100]), Array.isArray(r.pos) || (r.pos = [0, 0]);
      });
      const y = Re(l), w = $e(l, y), I = 30, G = 30, T = 30, u = 5, x = {};
      l.forEach((r) => {
        var S;
        if (r && r.id) {
          const D = ((S = w[r.id]) == null ? void 0 : S.level) ?? 0;
          x[D] || (x[D] = []), x[D].push(r);
        }
      }), Object.entries(x).forEach(([r, S]) => {
        const D = parseInt(r);
        if (S && S.length > 0) {
          S.sort((c, k) => {
            const A = c && c.id && w[c.id] ? w[c.id].order : 0, _ = k && k.id && w[k.id] ? w[k.id].order : 0;
            return A - _;
          });
          const re = S.reduce((c, k, A) => {
            const _ = k && k._calculatedSize && k._calculatedSize[0] ? k._calculatedSize[0] : 150;
            return c + _ + G;
          }, 0), de = Math.max(...S.map(
            (c) => c && c._calculatedSize && c._calculatedSize[1] ? c._calculatedSize[1] : 100
          ));
          let J = v;
          if (D > 0)
            for (let c = 0; c < D; c++) {
              const k = x[c] || [], A = Math.max(...k.map(
                (_) => _ && _._calculatedSize && _._calculatedSize[1] ? _._calculatedSize[1] : 100
              ));
              J += A + I + u;
            }
          let a = p;
          S.forEach((c, k) => {
            if (c && c.pos && c._calculatedSize) {
              const A = [c.pos[0], c.pos[1]], _ = [c._calculatedSize[0], c._calculatedSize[1]];
              c.pos[0] = a, c.pos[1] = J, a += c._calculatedSize[0] + G, typeof c.x == "number" && (c.x = c.pos[0]), typeof c.y == "number" && (c.y = c.pos[1]);
            }
          });
        }
      });
      try {
        (e = (i = window.app) == null ? void 0 : i.canvas) != null && e.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (s = (o = window.app) == null ? void 0 : o.graph) != null && s.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (n = window.app) != null && n.canvas && window.app.canvas.draw(!0, !0);
      } catch {
      }
    } catch {
      ze("Error in vertical flow alignment", "error");
    }
  }
  function ze(i, e = "info") {
    const o = document.createElement("div");
    o.textContent = i, o.style.cssText = `
            position: fixed;
            top: 60px;
            right: 10px;
            background: ${e === "success" ? "#4CAF50" : e === "warning" ? "#FF9800" : e === "error" ? "#F44336" : "#2196F3"};
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
  function xt() {
    var i;
    if (!((i = window.app) != null && i.canvas)) {
      setTimeout(xt, 100);
      return;
    }
    window.app.canvas.canvas && (window.app.canvas.canvas.addEventListener("click", () => {
      setTimeout(Ie, 10);
    }), window.app.canvas.canvas.addEventListener("mouseup", () => {
      setTimeout(Ie, 10);
    }), document.addEventListener("keydown", (e) => {
      (e.ctrlKey || e.metaKey) && setTimeout(Ie, 10);
    })), setInterval(Ie, 500);
  }
  function Wt(i) {
    if (i.ctrlKey || i.metaKey) {
      if (i.shiftKey && !i.altKey && (i.key === "H" || i.key === "h")) {
        i.preventDefault(), at();
        return;
      }
      if (i.shiftKey)
        switch (i.key) {
          case "ArrowLeft":
            i.preventDefault(), ke("left");
            break;
          case "ArrowRight":
            i.preventDefault(), ke("right");
            break;
          case "ArrowUp":
            i.preventDefault(), ke("top");
            break;
          case "ArrowDown":
            i.preventDefault(), ke("bottom");
            break;
        }
      else if (i.altKey)
        switch (i.key) {
          case "ArrowRight":
            i.preventDefault(), ke("horizontal-flow");
            break;
          case "ArrowDown":
            i.preventDefault(), ke("vertical-flow");
            break;
        }
    }
  }
  It(), xt(), document.addEventListener("keydown", Wt);
}
const q = {
  active: !1,
  colorOption: null,
  nodes: /* @__PURE__ */ new Map(),
  groups: /* @__PURE__ */ new Map()
};
