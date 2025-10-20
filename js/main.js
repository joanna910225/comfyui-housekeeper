import { app as _t } from "../../../scripts/app.js";
import { ComponentWidgetImpl as Mt, addWidget as Lt } from "../../../scripts/domWidget.js";
import { defineComponent as Ie, ref as ie, resolveDirective as Ht, createElementBlock as Me, openBlock as we, Fragment as ot, createElementVNode as he, withDirectives as Nt, createVNode as Oe, createBlock as st, unref as K, normalizeClass as nt, withCtx as Ye, createTextVNode as lt, toDisplayString as _e, renderList as Bt, normalizeStyle as Dt, onMounted as pt, nextTick as Pt } from "vue";
import We from "primevue/button";
import { useI18n as ht } from "vue-i18n";
const Ft = { class: "toolbar" }, Vt = { class: "color-picker" }, Tt = { class: "size-slider" }, Ot = ["value"], It = /* @__PURE__ */ Ie({
  __name: "ToolBar",
  props: {
    colors: {},
    initialColor: {},
    initialBrushSize: {},
    initialTool: {}
  },
  emits: ["tool-change", "color-change", "canvas-clear", "brush-size-change"],
  setup(S, { emit: H }) {
    const { t: M } = ht(), B = S, m = H, re = B.colors || ["#000000", "#ff0000", "#0000ff", "#69a869", "#ffff00", "#ff00ff", "#00ffff"], X = ie(B.initialColor || "#000000"), I = ie(B.initialBrushSize || 5), T = ie(B.initialTool || "pen");
    function D(j) {
      T.value = j, m("tool-change", j);
    }
    function R(j) {
      X.value = j, m("color-change", j);
    }
    function Q() {
      m("canvas-clear");
    }
    function z(j) {
      const q = j.target;
      I.value = Number(q.value), m("brush-size-change", I.value);
    }
    return (j, q) => {
      const de = Ht("tooltip");
      return we(), Me(ot, null, [
        he("div", Ft, [
          Nt((we(), st(K(We), {
            class: nt({ active: T.value === "pen" }),
            onClick: q[0] || (q[0] = (Z) => D("pen"))
          }, {
            default: Ye(() => [
              lt(_e(K(M)("vue-basic.pen")), 1)
            ]),
            _: 1
          }, 8, ["class"])), [
            [de, { value: K(M)("vue-basic.pen-tooltip"), showDelay: 300 }]
          ]),
          Oe(K(We), { onClick: Q }, {
            default: Ye(() => [
              lt(_e(K(M)("vue-basic.clear-canvas")), 1)
            ]),
            _: 1
          })
        ]),
        he("div", Vt, [
          (we(!0), Me(ot, null, Bt(K(re), (Z, U) => (we(), st(K(We), {
            key: U,
            class: nt({ "color-button": !0, active: X.value === Z }),
            onClick: (be) => R(Z),
            type: "button",
            title: Z
          }, {
            default: Ye(() => [
              he("i", {
                class: "pi pi-circle-fill",
                style: Dt({ color: Z })
              }, null, 4)
            ]),
            _: 2
          }, 1032, ["class", "onClick", "title"]))), 128))
        ]),
        he("div", Tt, [
          he("label", null, _e(K(M)("vue-basic.brush-size")) + ": " + _e(I.value) + "px", 1),
          he("input", {
            type: "range",
            min: "1",
            max: "50",
            value: I.value,
            onChange: q[1] || (q[1] = (Z) => z(Z))
          }, null, 40, Ot)
        ])
      ], 64);
    };
  }
}), je = (S, H) => {
  const M = S.__vccOpts || S;
  for (const [B, m] of H)
    M[B] = m;
  return M;
}, Rt = /* @__PURE__ */ je(It, [["__scopeId", "data-v-cae98791"]]), Zt = { class: "drawing-board" }, $t = { class: "canvas-container" }, Gt = ["width", "height"], Xt = /* @__PURE__ */ Ie({
  __name: "DrawingBoard",
  props: {
    width: {},
    height: {},
    initialColor: {},
    initialBrushSize: {}
  },
  emits: ["mounted", "drawing-start", "drawing", "drawing-end", "state-save", "canvas-clear"],
  setup(S, { expose: H, emit: M }) {
    const B = S, m = B.width || 800, re = B.height || 500, X = B.initialColor || "#000000", I = B.initialBrushSize || 5, T = M, D = ie(!1), R = ie(0), Q = ie(0), z = ie(null), j = ie(!1), q = ie(I), de = ie(X), Z = ie(null), U = ie(null);
    pt(() => {
      U.value && (z.value = U.value.getContext("2d"), be(), Pt(() => {
        U.value && T("mounted", U.value);
      }));
    });
    function be() {
      z.value && (z.value.fillStyle = "#ffffff", z.value.fillRect(0, 0, m, re), ue(), ze());
    }
    function ue() {
      z.value && (j.value ? (z.value.globalCompositeOperation = "destination-out", z.value.strokeStyle = "rgba(0,0,0,1)") : (z.value.globalCompositeOperation = "source-over", z.value.strokeStyle = de.value), z.value.lineWidth = q.value, z.value.lineJoin = "round", z.value.lineCap = "round");
    }
    function ye(P) {
      D.value = !0;
      const { offsetX: J, offsetY: G } = ae(P);
      R.value = J, Q.value = G, z.value && (z.value.beginPath(), z.value.moveTo(R.value, Q.value), z.value.arc(R.value, Q.value, q.value / 2, 0, Math.PI * 2), z.value.fill(), T("drawing-start", {
        x: J,
        y: G,
        tool: j.value ? "eraser" : "pen"
      }));
    }
    function le(P) {
      if (!D.value || !z.value) return;
      const { offsetX: J, offsetY: G } = ae(P);
      z.value.beginPath(), z.value.moveTo(R.value, Q.value), z.value.lineTo(J, G), z.value.stroke(), R.value = J, Q.value = G, T("drawing", {
        x: J,
        y: G,
        tool: j.value ? "eraser" : "pen"
      });
    }
    function _() {
      D.value && (D.value = !1, ze(), T("drawing-end"));
    }
    function ae(P) {
      let J = 0, G = 0;
      if ("touches" in P) {
        if (P.preventDefault(), U.value) {
          const Be = U.value.getBoundingClientRect();
          J = P.touches[0].clientX - Be.left, G = P.touches[0].clientY - Be.top;
        }
      } else
        J = P.offsetX, G = P.offsetY;
      return { offsetX: J, offsetY: G };
    }
    function Re(P) {
      P.preventDefault();
      const G = {
        touches: [P.touches[0]]
      };
      ye(G);
    }
    function Le(P) {
      if (P.preventDefault(), !D.value) return;
      const G = {
        touches: [P.touches[0]]
      };
      le(G);
    }
    function ge(P) {
      j.value = P === "eraser", ue();
    }
    function xe(P) {
      de.value = P, ue();
    }
    function Ze(P) {
      q.value = P, ue();
    }
    function He() {
      z.value && (z.value.fillStyle = "#ffffff", z.value.fillRect(0, 0, m, re), ue(), ze(), T("canvas-clear"));
    }
    function ze() {
      U.value && (Z.value = U.value.toDataURL("image/png"), Z.value && T("state-save", Z.value));
    }
    async function Ne() {
      if (!U.value)
        throw new Error("Canvas is unable to get current data");
      return Z.value ? Z.value : U.value.toDataURL("image/png");
    }
    return H({
      setTool: ge,
      setColor: xe,
      setBrushSize: Ze,
      clearCanvas: He,
      getCurrentCanvasData: Ne
    }), (P, J) => (we(), Me("div", Zt, [
      he("div", $t, [
        he("canvas", {
          ref_key: "canvas",
          ref: U,
          width: K(m),
          height: K(re),
          onMousedown: ye,
          onMousemove: le,
          onMouseup: _,
          onMouseleave: _,
          onTouchstart: Re,
          onTouchmove: Le,
          onTouchend: _
        }, null, 40, Gt)
      ])
    ]));
  }
}), Yt = /* @__PURE__ */ je(Xt, [["__scopeId", "data-v-ca1239fc"]]), Wt = { class: "drawing-app" }, jt = /* @__PURE__ */ Ie({
  __name: "DrawingApp",
  props: {
    width: {},
    height: {},
    initialColor: {},
    initialBrushSize: {},
    availableColors: {}
  },
  emits: ["tool-change", "color-change", "brush-size-change", "drawing-start", "drawing", "drawing-end", "state-save", "mounted"],
  setup(S, { expose: H, emit: M }) {
    const B = S, m = B.width || 800, re = B.height || 500, X = B.initialColor || "#000000", I = B.initialBrushSize || 5, T = B.availableColors || ["#000000", "#ff0000", "#0000ff", "#00ff00", "#ffff00", "#ff00ff", "#00ffff"], D = M, R = ie(null), Q = ie(null);
    function z(_) {
      var ae;
      (ae = R.value) == null || ae.setTool(_), D("tool-change", _);
    }
    function j(_) {
      var ae;
      (ae = R.value) == null || ae.setColor(_), D("color-change", _);
    }
    function q(_) {
      var ae;
      (ae = R.value) == null || ae.setBrushSize(_), D("brush-size-change", _);
    }
    function de() {
      var _;
      (_ = R.value) == null || _.clearCanvas();
    }
    function Z(_) {
      D("drawing-start", _);
    }
    function U(_) {
      D("drawing", _);
    }
    function be() {
      D("drawing-end");
    }
    function ue(_) {
      Q.value = _, D("state-save", _);
    }
    function ye(_) {
      D("mounted", _);
    }
    async function le() {
      if (Q.value)
        return Q.value;
      if (R.value)
        try {
          return await R.value.getCurrentCanvasData();
        } catch (_) {
          throw console.error("unable to get canvas data:", _), new Error("unable to get canvas data");
        }
      throw new Error("get canvas data failed");
    }
    return H({
      getCanvasData: le
    }), (_, ae) => (we(), Me("div", Wt, [
      Oe(Rt, {
        colors: K(T),
        initialColor: K(X),
        initialBrushSize: K(I),
        onToolChange: z,
        onColorChange: j,
        onBrushSizeChange: q,
        onCanvasClear: de
      }, null, 8, ["colors", "initialColor", "initialBrushSize"]),
      Oe(Yt, {
        ref_key: "drawingBoard",
        ref: R,
        width: K(m),
        height: K(re),
        initialColor: K(X),
        initialBrushSize: K(I),
        onDrawingStart: Z,
        onDrawing: U,
        onDrawingEnd: be,
        onStateSave: ue,
        onMounted: ye
      }, null, 8, ["width", "height", "initialColor", "initialBrushSize"])
    ]));
  }
}), Ut = /* @__PURE__ */ je(jt, [["__scopeId", "data-v-39bbf58b"]]), Kt = /* @__PURE__ */ Ie({
  __name: "VueExampleComponent",
  props: {
    widget: {}
  },
  setup(S) {
    const { t: H } = ht(), M = ie(null), B = ie(null);
    S.widget.node;
    function m(X) {
      B.value = X, console.log("canvas state saved:", X.substring(0, 50) + "...");
    }
    async function re(X, I) {
      var T;
      try {
        if (!((T = window.app) != null && T.api))
          throw new Error("ComfyUI API not available");
        const D = await fetch(X).then((q) => q.blob()), R = `${I}_${Date.now()}.png`, Q = new File([D], R), z = new FormData();
        return z.append("image", Q), z.append("subfolder", "threed"), z.append("type", "temp"), console.log("Vue Component: Using window.app.api.fetchApi"), (await window.app.api.fetchApi("/upload/image", {
          method: "POST",
          body: z
        })).json();
      } catch (D) {
        throw console.error("Vue Component: Error uploading image:", D), D;
      }
    }
    return pt(() => {
      S.widget.serializeValue = async (X, I) => {
        try {
          console.log("Vue Component: inside vue serializeValue"), console.log("node", X), console.log("index", I);
          const T = B.value;
          return T ? {
            image: `threed/${(await re(T, "test_vue_basic")).name} [temp]`
          } : (console.warn("Vue Component: No canvas data available"), { image: null });
        } catch (T) {
          return console.error("Vue Component: Error in serializeValue:", T), { image: null };
        }
      };
    }), (X, I) => (we(), Me("div", null, [
      he("h1", null, _e(K(H)("vue-basic.title")), 1),
      he("div", null, [
        Oe(Ut, {
          ref_key: "drawingAppRef",
          ref: M,
          width: 300,
          height: 300,
          onStateSave: m
        }, null, 512)
      ])
    ]));
  }
}), ct = "data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M4.88822%2014.1929C2.49999%2014.9929%201.36569%2011.6929%202.36088%2010.5C2.85843%209.83333%204.58971%207.89286%207.37597%204.69286C10.8588%200.692857%2012.849%202.19286%2014.3416%202.69286C15.8343%203.19286%2019.8146%207.19286%2020.8097%208.19286C21.8048%209.19286%2022.3024%2010.5%2021.8048%2011.5C21.4068%2012.3%2019.4431%2012.6667%2018.7797%2012.5C19.7748%2013%2021.3073%2017.1929%2021.8048%2018.6929C22.2028%2019.8929%2021.3073%2021.1667%2020.8097%2021.5C20.3122%2021.6667%2018.919%2022%2017.3269%2022C15.3367%2022%2015.8343%2019.6929%2016.3318%2017.1929C16.8293%2014.6929%2014.3416%2014.6929%2011.8539%2015.6929C9.36615%2016.6929%209.8637%2017.6929%2010.8588%2018.1929C11.8539%2018.6929%2011.8141%2020.1929%2011.3166%2021.1929C10.8191%2022.1929%206.83869%2022.1929%205.84359%2021.1929C5.07774%2020.4232%206.1292%2015.7356%206.80082%2013.4517C6.51367%2013.6054%205.93814%2013.8412%204.88822%2014.1929Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", qt = "data:image/svg+xml,%3csvg%20width='33'%20height='32'%20viewBox='0%200%2033%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M9.73332%2028C9.73332%2028.3536%209.59284%2028.6928%209.34279%2028.9428C9.09274%2029.1929%208.75361%2029.3333%208.39998%2029.3333C8.04636%2029.3333%207.70722%2029.1929%207.45717%2028.9428C7.20713%2028.6928%207.06665%2028.3536%207.06665%2028V4C7.06665%203.64638%207.20713%203.30724%207.45717%203.05719C7.70722%202.80714%208.04636%202.66667%208.39998%202.66667C8.75361%202.66667%209.09274%202.80714%209.34279%203.05719C9.59284%203.30724%209.73332%203.64638%209.73332%204V28ZM15.0667%2012C14.3594%2012%2013.6811%2011.719%2013.181%2011.219C12.6809%2010.7189%2012.4%2010.0406%2012.4%209.33333C12.4%208.62609%2012.6809%207.94781%2013.181%207.44771C13.6811%206.94762%2014.3594%206.66667%2015.0667%206.66667H23.0667C23.7739%206.66667%2024.4522%206.94762%2024.9523%207.44771C25.4524%207.94781%2025.7333%208.62609%2025.7333%209.33333C25.7333%2010.0406%2025.4524%2010.7189%2024.9523%2011.219C24.4522%2011.719%2023.7739%2012%2023.0667%2012H15.0667ZM15.0667%2016H20.4C21.1072%2016%2021.7855%2016.281%2022.2856%2016.781C22.7857%2017.2811%2023.0667%2017.9594%2023.0667%2018.6667C23.0667%2019.3739%2022.7857%2020.0522%2022.2856%2020.5523C21.7855%2021.0524%2021.1072%2021.3333%2020.4%2021.3333H15.0667C14.3594%2021.3333%2013.6811%2021.0524%2013.181%2020.5523C12.6809%2020.0522%2012.4%2019.3739%2012.4%2018.6667C12.4%2017.9594%2012.6809%2017.2811%2013.181%2016.781C13.6811%2016.281%2014.3594%2016%2015.0667%2016Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", Jt = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M22.6667%2028C22.6667%2028.3536%2022.5262%2028.6928%2022.2761%2028.9428C22.0261%2029.1929%2021.687%2029.3333%2021.3333%2029.3333C20.9797%2029.3333%2020.6406%2029.1929%2020.3905%2028.9428C20.1405%2028.6928%2020%2028.3536%2020%2028V4C20%203.64638%2020.1405%203.30724%2020.3905%203.05719C20.6406%202.80714%2020.9797%202.66667%2021.3333%202.66667C21.687%202.66667%2022.0261%202.80714%2022.2761%203.05719C22.5262%203.30724%2022.6667%203.64638%2022.6667%204V28ZM14.6667%206.66667C15.3739%206.66667%2016.0522%206.94762%2016.5523%207.44771C17.0524%207.94781%2017.3333%208.62609%2017.3333%209.33333C17.3333%2010.0406%2017.0524%2010.7189%2016.5523%2011.219C16.0522%2011.719%2015.3739%2012%2014.6667%2012H6.66667C5.95942%2012%205.28115%2011.719%204.78105%2011.219C4.28095%2010.7189%204%2010.0406%204%209.33333C4%208.62609%204.28095%207.94781%204.78105%207.44771C5.28115%206.94762%205.95942%206.66667%206.66667%206.66667H14.6667ZM14.6667%2016C15.3739%2016%2016.0522%2016.281%2016.5523%2016.781C17.0524%2017.2811%2017.3333%2017.9594%2017.3333%2018.6667C17.3333%2019.3739%2017.0524%2020.0522%2016.5523%2020.5523C16.0522%2021.0524%2015.3739%2021.3333%2014.6667%2021.3333H9.33333C8.62609%2021.3333%207.94781%2021.0524%207.44772%2020.5523C6.94762%2020.0522%206.66667%2019.3739%206.66667%2018.6667C6.66667%2017.9594%206.94762%2017.2811%207.44772%2016.781C7.94781%2016.281%208.62609%2016%209.33333%2016H14.6667Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", Qt = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M6.39992%204H25.5999C26.1893%204%2026.6666%204.59733%2026.6666%205.33333C26.6666%206.06933%2026.1893%206.66667%2025.5999%206.66667H6.39992C5.81059%206.66667%205.33325%206.06933%205.33325%205.33333C5.33325%204.59733%205.81059%204%206.39992%204ZM9.33325%2012C9.33325%2011.2928%209.6142%2010.6145%2010.1143%2010.1144C10.6144%209.61428%2011.2927%209.33333%2011.9999%209.33333C12.7072%209.33333%2013.3854%209.61428%2013.8855%2010.1144C14.3856%2010.6145%2014.6666%2011.2928%2014.6666%2012V25.3333C14.6666%2026.0406%2014.3856%2026.7189%2013.8855%2027.219C13.3854%2027.719%2012.7072%2028%2011.9999%2028C11.2927%2028%2010.6144%2027.719%2010.1143%2027.219C9.6142%2026.7189%209.33325%2026.0406%209.33325%2025.3333V12ZM17.3333%2012C17.3333%2011.2928%2017.6142%2010.6145%2018.1143%2010.1144C18.6144%209.61428%2019.2927%209.33333%2019.9999%209.33333C20.7072%209.33333%2021.3854%209.61428%2021.8855%2010.1144C22.3856%2010.6145%2022.6666%2011.2928%2022.6666%2012V20C22.6666%2020.7072%2022.3856%2021.3855%2021.8855%2021.8856C21.3854%2022.3857%2020.7072%2022.6667%2019.9999%2022.6667C19.2927%2022.6667%2018.6144%2022.3857%2018.1143%2021.8856C17.6142%2021.3855%2017.3333%2020.7072%2017.3333%2020V12Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", e2 = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M6.39992%2025.3333H25.5999C26.1893%2025.3333%2026.6666%2025.9307%2026.6666%2026.6667C26.6666%2027.4027%2026.1893%2028%2025.5999%2028H6.39992C5.81059%2028%205.33325%2027.4027%205.33325%2026.6667C5.33325%2025.9307%205.81059%2025.3333%206.39992%2025.3333ZM14.6666%2020C14.6666%2020.7072%2014.3856%2021.3855%2013.8855%2021.8856C13.3854%2022.3857%2012.7072%2022.6667%2011.9999%2022.6667C11.2927%2022.6667%2010.6144%2022.3857%2010.1143%2021.8856C9.6142%2021.3855%209.33325%2020.7072%209.33325%2020V6.66667C9.33325%205.95942%209.6142%205.28115%2010.1143%204.78105C10.6144%204.28095%2011.2927%204%2011.9999%204C12.7072%204%2013.3854%204.28095%2013.8855%204.78105C14.3856%205.28115%2014.6666%205.95942%2014.6666%206.66667V20ZM22.6666%2020C22.6666%2020.7072%2022.3856%2021.3855%2021.8855%2021.8856C21.3854%2022.3857%2020.7072%2022.6667%2019.9999%2022.6667C19.2927%2022.6667%2018.6144%2022.3857%2018.1143%2021.8856C17.6142%2021.3855%2017.3333%2020.7072%2017.3333%2020V12C17.3333%2011.2928%2017.6142%2010.6145%2018.1143%2010.1144C18.6144%209.61428%2019.2927%209.33333%2019.9999%209.33333C20.7072%209.33333%2021.3854%209.61428%2021.8855%2010.1144C22.3856%2010.6145%2022.6666%2011.2928%2022.6666%2012V20Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", t2 = "data:image/svg+xml,%3csvg%20width='33'%20height='32'%20viewBox='0%200%2033%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M3.80005%2024.7791V6.22093C3.80005%205.54663%204.41923%205%205.18303%205C5.94683%205%206.56601%205.54663%206.56601%206.22093V24.7791C6.56601%2025.4534%205.94683%2026%205.18303%2026C4.41923%2026%203.80005%2025.4534%203.80005%2024.7791Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M7.49597%2016.1488L10.3015%2018.9352C10.6394%2019.2708%2011.2681%2019.0598%2011.2681%2018.6107V17.6976H22.332V18.6107C22.332%2019.0598%2022.9607%2019.2708%2023.2986%2018.9352L26.1041%2016.1488C26.4767%2015.7787%2026.4767%2015.221%2026.1041%2014.851L23.2986%2012.0646C22.9607%2011.729%2022.332%2011.94%2022.332%2012.3891V13.3022H11.2681V12.3891C11.2681%2011.94%2010.6394%2011.729%2010.3015%2012.0646L7.49597%2014.851C7.12335%2015.221%207.12335%2015.7787%207.49597%2016.1488Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M27.0341%2024.7791V6.22093C27.0341%205.54663%2027.6533%205%2028.4171%205C29.1809%205%2029.8%205.54663%2029.8%206.22093V24.7791C29.8%2025.4534%2029.1809%2026%2028.4171%2026C27.6533%2026%2027.0341%2025.4534%2027.0341%2024.7791Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", i2 = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M3%2024.7791V6.22093C3%205.54663%203.61918%205%204.38298%205C5.14678%205%205.76596%205.54663%205.76596%206.22093V24.7791C5.76596%2025.4534%205.14678%2026%204.38298%2026C3.61918%2026%203%2025.4534%203%2024.7791Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M26.234%2024.7791V6.22093C26.234%205.54663%2026.8532%205%2027.617%205C28.3808%205%2029%205.54663%2029%206.22093V24.7791C29%2025.4534%2028.3808%2026%2027.617%2026C26.8532%2026%2026.234%2025.4534%2026.234%2024.7791Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M15.0141%2016.2491L12.2086%2019.0355C11.8706%2019.3711%2011.2419%2019.1601%2011.2419%2018.711V17.7979H6.71L6.71%2013.4025H11.2419V12.4894C11.2419%2012.0403%2011.8706%2011.8293%2012.2086%2012.1649L15.0141%2014.9513C15.3867%2015.3213%2015.3867%2015.879%2015.0141%2016.2491Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M16.9895%2016.2491L19.795%2019.0355C20.133%2019.3711%2020.7617%2019.1601%2020.7617%2018.711V17.7979H25.2936L25.2936%2013.4025H20.7617V12.4894C20.7617%2012.0403%2020.133%2011.8293%2019.795%2012.1649L16.9895%2014.9513C16.6169%2015.3213%2016.6169%2015.879%2016.9895%2016.2491Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", r2 = "data:image/svg+xml,%3csvg%20width='33'%20height='32'%20viewBox='0%200%2033%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20x='0.399902'%20width='32'%20height='32'%20rx='4'%20fill='%23283540'/%3e%3cpath%20d='M25.179%2029H6.62083C5.94653%2029%205.3999%2028.3808%205.3999%2027.617C5.3999%2026.8532%205.94653%2026.234%206.62083%2026.234H25.179C25.8533%2026.234%2026.3999%2026.8532%2026.3999%2027.617C26.3999%2028.3808%2025.8533%2029%2025.179%2029Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M16.5487%2025.3041L19.3351%2022.4986C19.6707%2022.1606%2019.4597%2021.5319%2019.0106%2021.5319H18.0975V10.4681H19.0106C19.4597%2010.4681%2019.6707%209.83938%2019.3351%209.50144L16.5487%206.69593C16.1786%206.32331%2015.621%206.32331%2015.2509%206.69593L12.4645%209.50144C12.1289%209.83938%2012.3399%2010.4681%2012.789%2010.4681H13.7021V21.5319H12.789C12.3399%2021.5319%2012.1289%2022.1606%2012.4645%2022.4986L15.2509%2025.3041C15.621%2025.6767%2016.1786%2025.6767%2016.5487%2025.3041Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M25.179%205.76596H6.62083C5.94653%205.76596%205.3999%205.14678%205.3999%204.38298C5.3999%203.61918%205.94653%203%206.62083%203H25.179C25.8533%203%2026.3999%203.61918%2026.3999%204.38298C26.3999%205.14678%2025.8533%205.76596%2025.179%205.76596Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", a2 = "data:image/svg+xml,%3csvg%20width='33'%20height='32'%20viewBox='0%200%2033%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M7.82103%203H26.3792C27.0535%203%2027.6001%203.61918%2027.6001%204.38298C27.6001%205.14678%2027.0535%205.76596%2026.3792%205.76596H7.82103C7.14673%205.76596%206.6001%205.14678%206.6001%204.38298C6.6001%203.61918%207.14673%203%207.82103%203Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M7.82103%2026.234H26.3792C27.0535%2026.234%2027.6001%2026.8532%2027.6001%2027.617C27.6001%2028.3808%2027.0535%2029%2026.3792%2029H7.82103C7.14673%2029%206.6001%2028.3808%206.6001%2027.617C6.6001%2026.8532%207.14673%2026.234%207.82103%2026.234Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M16.351%2015.0141L13.5646%2012.2086C13.229%2011.8706%2013.44%2011.2419%2013.8891%2011.2419H14.8022V6.71L19.1976%206.71V11.2419H20.1107C20.5598%2011.2419%2020.7708%2011.8706%2020.4352%2012.2086L17.6488%2015.0141C17.2787%2015.3867%2016.7211%2015.3867%2016.351%2015.0141Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M16.351%2016.9895L13.5646%2019.795C13.229%2020.133%2013.44%2020.7617%2013.8891%2020.7617H14.8022V25.2936L19.1976%2025.2936V20.7617H20.1107C20.5598%2020.7617%2020.7708%2020.133%2020.4352%2019.795L17.6488%2016.9895C17.2787%2016.6169%2016.7211%2016.6169%2016.351%2016.9895Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", o2 = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M19.5201%206.18689C19.2052%205.87191%2019.4282%205.33334%2019.8737%205.33334H25.6666C26.2189%205.33334%2026.6666%205.78105%2026.6666%206.33334V12.1262C26.6666%2012.5717%2026.128%2012.7948%2025.813%2012.4798L23.9999%2010.6667L18.6666%2016L15.9999%2013.3333L21.3333%208L19.5201%206.18689ZM12.4797%2025.8131C12.7947%2026.1281%2012.5716%2026.6667%2012.1261%2026.6667H6.33325C5.78097%2026.6667%205.33325%2026.219%205.33325%2025.6667V19.8738C5.33325%2019.4283%205.87182%2019.2052%206.18681%2019.5202L7.99992%2021.3333L13.3333%2016L15.9999%2018.6667L10.6666%2024L12.4797%2025.8131Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", s2 = "data:image/svg+xml,%3csvg%20width='33'%20height='32'%20viewBox='0%200%2033%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M14.8666%2016H9.07372C8.62827%2016%208.40519%2016.5386%208.72017%2016.8535L10.5333%2018.6667L5.19995%2024L7.86662%2026.6667L13.2%2021.3333L15.0131%2023.1464C15.328%2023.4614%2015.8666%2023.2383%2015.8666%2022.7929V17C15.8666%2016.4477%2015.4189%2016%2014.8666%2016Z'%20fill='%238BC3F3'/%3e%3cpath%20d='M17.2%2015.6667H22.9929C23.4384%2015.6667%2023.6615%2015.1281%2023.3465%2014.8131L21.5334%2013L26.8667%207.66667L24.2%205L18.8667%2010.3333L17.0536%208.52022C16.7386%208.20524%2016.2%208.42832%2016.2%208.87377V14.6667C16.2%2015.219%2016.6477%2015.6667%2017.2%2015.6667Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", n2 = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M15.9999%2016C15.9999%2016.1427%2015.9692%2016.288%2015.9039%2016.4213C15.8398%2016.5595%2015.7376%2016.6766%2015.6092%2016.7587L6.46256%2022.5587C6.09456%2022.7907%205.6319%2022.6387%205.42923%2022.22C5.36471%2022.089%205.33183%2021.9447%205.33323%2021.7987V10.2013C5.33323%209.72132%205.67323%209.33333%206.09323%209.33333C6.22441%209.33264%206.35289%209.37067%206.46256%209.44266L15.6092%2015.2413C15.7325%2015.3252%2015.8328%2015.4385%2015.901%2015.571C15.9692%2015.7035%2016.0032%2015.851%2015.9999%2016V10.2C15.9999%209.71999%2016.3399%209.33199%2016.7599%209.33199C16.8911%209.33131%2017.0196%209.36934%2017.1292%209.44133L26.2759%2015.24C26.6426%2015.472%2026.7746%2016%2026.5706%2016.42C26.5065%2016.5582%2026.4042%2016.6752%2026.2759%2016.7573L17.1292%2022.5573C16.7612%2022.7893%2016.2986%2022.6373%2016.0959%2022.2187C16.0314%2022.0877%2015.9985%2021.9433%2015.9999%2021.7973V16Z'%20fill='%238BC3F3'/%3e%3c/svg%3e", l2 = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M16%2016H21.8C21.9467%2016%2022.0934%2016.0333%2022.2214%2016.096C22.64%2016.2987%2022.792%2016.7627%2022.5587%2017.1293L16.76%2026.276C16.6814%2026.4%2016.564%2026.5027%2016.4227%2026.5707C16.004%2026.7747%2015.476%2026.6427%2015.2427%2026.276L9.4427%2017.1293C9.37118%2017.0195%209.33361%2016.891%209.33469%2016.76C9.33469%2016.34%209.7227%2016%2010.2027%2016H16ZM16%2016C15.6934%2016%2015.3987%2015.8587%2015.24%2015.6093L9.44003%206.46266C9.36898%206.3527%209.33188%206.22424%209.33336%206.09333C9.33336%205.67333%209.72136%205.33333%2010.2014%205.33333H21.7987C21.9454%205.33333%2022.092%205.36666%2022.22%205.42933C22.6387%205.63199%2022.7907%206.096%2022.5574%206.46266L16.7587%2015.6093C16.68%2015.7333%2016.5627%2015.836%2016.4214%2015.904C16.288%2015.9693%2016.1427%2016%2016.0014%2016'%20fill='%238BC3F3'/%3e%3c/svg%3e", ut = _t;
ut.registerExtension({
  name: "vue-basic",
  getCustomWidgets(S) {
    return {
      CUSTOM_VUE_COMPONENT_BASIC(H) {
        const M = {
          name: "custom_vue_component_basic",
          type: "vue-basic"
        }, B = new Mt({
          node: H,
          name: M.name,
          component: Kt,
          inputSpec: M,
          options: {}
        });
        return Lt(H, B), { widget: B };
      }
    };
  },
  nodeCreated(S) {
    if (S.constructor.comfyClass !== "vue-basic") return;
    const [H, M] = S.size;
    S.setSize([Math.max(H, 300), Math.max(M, 520)]);
  }
});
ut.registerExtension({
  name: "housekeeper-alignment",
  async setup() {
    try {
      c2();
    } catch {
    }
  },
  nodeCreated(S) {
    S.constructor.comfyClass === "housekeeper-alignment" && (S.setSize([200, 100]), S.title && (S.title = "🎯 Alignment Panel Active"));
  }
});
function c2() {
  let S = null, H = null, M = null, B = !1, m = [], re = [], X = [], I = 0;
  const T = /* @__PURE__ */ new WeakMap(), D = /* @__PURE__ */ new WeakMap();
  let R = null, Q = !1;
  const z = 48, j = 24;
  function q() {
    return document.querySelector("#comfy-menu, .comfyui-menu, .litegraph-menu, .comfyui-toolbar");
  }
  function de() {
    const i = q();
    if (!i)
      return z;
    const t = i.getBoundingClientRect();
    return !t || t.width === 0 && t.height === 0 ? z : Math.max(z, Math.ceil(t.bottom + 8));
  }
  function Z() {
    const i = de(), t = window.innerHeight || document.documentElement.clientHeight || 0, a = Math.max(t - i - j, 280);
    document.documentElement.style.setProperty("--hk-top-offset", `${i}px`), document.documentElement.style.setProperty("--hk-panel-max-height", `${a}px`);
  }
  function U() {
    if (Q || (Q = !0, window.addEventListener("resize", Z), window.addEventListener("orientationchange", Z)), typeof ResizeObserver < "u") {
      const i = q();
      i && (R ? R.disconnect() : R = new ResizeObserver(() => Z()), R.observe(i));
    }
  }
  const be = [
    { type: "left", icon: qt, label: "Align left edges", group: "basic" },
    { type: "right", icon: Jt, label: "Align right edges", group: "basic" },
    { type: "top", icon: Qt, label: "Align top edges", group: "basic" },
    { type: "bottom", icon: e2, label: "Align bottom edges", group: "basic" }
  ], ue = [
    { type: "width-max", icon: t2, label: "Match widest width", group: "size" },
    { type: "width-min", icon: i2, label: "Match narrowest width", group: "size" },
    { type: "height-max", icon: r2, label: "Match tallest height", group: "size" },
    { type: "height-min", icon: a2, label: "Match shortest height", group: "size" },
    { type: "size-max", icon: o2, label: "Match largest size", group: "size" },
    { type: "size-min", icon: s2, label: "Match smallest size", group: "size" }
  ], ye = [
    { type: "horizontal-flow", icon: n2, label: "Distribute horizontally", group: "flow" },
    { type: "vertical-flow", icon: l2, label: "Distribute vertically", group: "flow" }
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
  ], _ = 4.5, ae = "#AAAAAA";
  function Re() {
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
  Re(), U(), Z();
  function Le() {
    const i = document.createElement("section");
    return i.className = "housekeeper-section", i;
  }
  function ge(i) {
    const t = document.createElement("p");
    return t.className = "housekeeper-subtitle", t.textContent = i, t;
  }
  function xe(i, t) {
    const a = document.createElement("div");
    return a.className = `housekeeper-button-grid housekeeper-button-grid-${t}`, i.forEach((s) => {
      a.appendChild(Ze(s));
    }), a;
  }
  function Ze(i) {
    const t = document.createElement("button");
    t.type = "button", t.className = "hk-button", t.dataset.alignmentType = i.type, t.title = i.label, t.setAttribute("aria-label", i.label);
    const a = document.createElement("img");
    return a.src = i.icon, a.alt = "", a.draggable = !1, t.appendChild(a), t.addEventListener("mouseenter", () => it(i.type)), t.addEventListener("mouseleave", () => Pe()), t.addEventListener("focus", () => it(i.type)), t.addEventListener("blur", () => Pe()), t.addEventListener("click", () => me(i.type)), t;
  }
  function He(i) {
    const t = i.replace("#", "");
    if (t.length === 3) {
      const a = parseInt(t[0] + t[0], 16), s = parseInt(t[1] + t[1], 16), c = parseInt(t[2] + t[2], 16);
      return { r: a, g: s, b: c };
    }
    return t.length === 6 ? {
      r: parseInt(t.slice(0, 2), 16),
      g: parseInt(t.slice(2, 4), 16),
      b: parseInt(t.slice(4, 6), 16)
    } : null;
  }
  function ze(i, t, a) {
    const s = (c) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, "0");
    return `#${s(i)}${s(t)}${s(a)}`;
  }
  function Ne(i) {
    const t = He(i);
    if (!t) return null;
    const a = t.r / 255, s = t.g / 255, c = t.b / 255, n = Math.max(a, s, c), u = Math.min(a, s, c), f = n - u;
    let p = 0;
    f !== 0 && (n === a ? p = (s - c) / f % 6 : n === s ? p = (c - a) / f + 2 : p = (a - s) / f + 4), p = Math.round(p * 60), p < 0 && (p += 360);
    const v = (n + u) / 2, C = f === 0 ? 0 : f / (1 - Math.abs(2 * v - 1));
    return { h: p, s: C, l: v };
  }
  function P(i, t, a) {
    const s = (1 - Math.abs(2 * a - 1)) * t, c = s * (1 - Math.abs(i / 60 % 2 - 1)), n = a - s / 2;
    let u = 0, f = 0, p = 0;
    return 0 <= i && i < 60 ? (u = s, f = c, p = 0) : 60 <= i && i < 120 ? (u = c, f = s, p = 0) : 120 <= i && i < 180 ? (u = 0, f = s, p = c) : 180 <= i && i < 240 ? (u = 0, f = c, p = s) : 240 <= i && i < 300 ? (u = c, f = 0, p = s) : (u = s, f = 0, p = c), ze((u + n) * 255, (f + n) * 255, (p + n) * 255);
  }
  function J(i, t) {
    const a = Ne(i);
    if (!a) return i;
    const s = Math.max(0, Math.min(1, a.l + t));
    return P(a.h, a.s, s);
  }
  function G(i) {
    const t = He(i);
    return t ? Be(t) : 0;
  }
  function Be(i) {
    const t = (a) => {
      const s = a / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * t(i.r) + 0.7152 * t(i.g) + 0.0722 * t(i.b);
  }
  function Ue(i, t) {
    const a = Math.max(i, t), s = Math.min(i, t);
    return (a + 0.05) / (s + 0.05);
  }
  function ft(i) {
    const t = G(i), a = G(ae);
    let s = Ue(t, a);
    if (s >= _) return i;
    const c = Ne(i);
    if (!c) return i;
    const n = t > a ? -1 : 1;
    let u = c.l, f = n > 0 ? 0.98 : 0.02, p = i, v = s;
    for (let C = 0; C < 12; C++) {
      const b = u + (f - u) * 0.5, O = P(c.h, c.s, Math.max(0.02, Math.min(0.98, b))), $ = G(O), F = Ue($, a);
      F >= _ ? (p = O, v = F, n > 0 ? u = b : f = b) : n > 0 ? f = b : u = b;
    }
    return v >= _ ? p : i;
  }
  function Ke(i, t, a, s = 6) {
    let c = t, n = 0;
    for (; Math.abs(G(i) - G(c)) < 0.08 && n < s; ) {
      const u = J(c, a);
      if (u === c) break;
      c = u, n += 1;
    }
    return c;
  }
  function De(i) {
    const a = i.startsWith("#") ? i : `#${i}`;
    let s = ft(a), c = J(s, -0.16), n = J(s, 0.12);
    return c = Ke(s, c, -0.08), n = Ke(s, n, 0.08), {
      color: c,
      bgcolor: s,
      groupcolor: n
    };
  }
  function dt(i) {
    var n, u, f;
    const t = [...m, ...re];
    if (!t.length) {
      ve("Select nodes or groups to apply color", "warning");
      return;
    }
    const a = De(i), s = /* @__PURE__ */ new Set();
    t.forEach((p) => {
      p != null && p.graph && s.add(p.graph);
    }), s.forEach((p) => {
      var v;
      return (v = p == null ? void 0 : p.beforeChange) == null ? void 0 : v.call(p);
    }), t.forEach((p) => {
      $e(p, a);
    }), s.forEach((p) => {
      var v;
      return (v = p == null ? void 0 : p.afterChange) == null ? void 0 : v.call(p);
    });
    const c = ((n = window.LGraphCanvas) == null ? void 0 : n.active_canvas) ?? ((u = window.app) == null ? void 0 : u.canvas);
    (f = c == null ? void 0 : c.setDirty) == null || f.call(c, !0, !0);
  }
  function $e(i, t) {
    typeof i.setColorOption == "function" ? i.setColorOption(t) : (i.color = t.color, i.bgcolor = t.bgcolor, i.groupcolor = t.groupcolor);
  }
  function qe(i) {
    var t;
    W.active && ((t = W.colorOption) == null ? void 0 : t.bgcolor) === i.bgcolor || (W.active = !0, W.colorOption = i, W.nodes.clear(), W.groups.clear(), m.forEach((a) => {
      W.nodes.set(a, {
        color: a.color,
        bgcolor: a.bgcolor,
        groupcolor: a.groupcolor
      });
    }), re.forEach((a) => {
      W.groups.set(a, {
        color: a.color
      });
    }));
  }
  function Je(i) {
    var a, s, c;
    m.forEach((n) => $e(n, i)), re.forEach((n) => $e(n, i));
    const t = ((a = window.LGraphCanvas) == null ? void 0 : a.active_canvas) ?? ((s = window.app) == null ? void 0 : s.canvas);
    (c = t == null ? void 0 : t.setDirty) == null || c.call(t, !0, !0);
  }
  function Qe() {
    var a, s, c;
    if (!W.active) return;
    let i;
    for (const n of W.nodes.values())
      if (n.bgcolor) {
        i = n.bgcolor;
        break;
      }
    if (!i) {
      for (const n of W.groups.values())
        if (n.color) {
          i = n.color;
          break;
        }
    }
    W.nodes.forEach((n, u) => {
      u && (typeof u.setColorOption == "function" ? u.setColorOption({
        color: n.color ?? u.color,
        bgcolor: n.bgcolor ?? u.bgcolor,
        groupcolor: n.groupcolor ?? u.groupcolor
      }) : (u.color = n.color, u.bgcolor = n.bgcolor, u.groupcolor = n.groupcolor));
    }), W.groups.forEach((n, u) => {
      u && (typeof u.setColorOption == "function" ? u.setColorOption({
        color: n.color ?? u.color,
        bgcolor: n.color ?? u.bgcolor,
        groupcolor: n.color ?? u.groupcolor
      }) : u.color = n.color);
    }), W.active = !1, W.colorOption = null;
    const t = ((a = window.LGraphCanvas) == null ? void 0 : a.active_canvas) ?? ((s = window.app) == null ? void 0 : s.canvas);
    (c = t == null ? void 0 : t.setDirty) == null || c.call(t, !0, !0);
  }
  function gt(i, t) {
    const a = (s) => {
      s == null || s.preventDefault(), dt(t), W.active = !1, W.colorOption = null, W.nodes.clear(), W.groups.clear();
    };
    i.addEventListener("click", a), i.addEventListener("keydown", (s) => {
      (s.key === "Enter" || s.key === " ") && (s.preventDefault(), a());
    }), i.addEventListener("mouseenter", () => {
      const s = De(t);
      qe(s), Je(s);
    }), i.addEventListener("focus", () => {
      const s = De(t);
      qe(s), Je(s);
    }), i.addEventListener("mouseleave", () => Qe()), i.addEventListener("blur", () => Qe());
  }
  function et(i, t = !0) {
    const a = De(i), s = a.bgcolor.toUpperCase(), c = document.createElement(t ? "button" : "div");
    return t && (c.type = "button", c.setAttribute("aria-label", `Apply color ${s}`), c.title = `Apply color ${s}`), c.className = "hk-color-chip", c.style.background = a.bgcolor, c.style.borderColor = a.color, c.dataset.colorHex = a.bgcolor, t && gt(c, i), c;
  }
  function tt(i, t) {
    if (!le.length) return;
    const a = le.length, s = (t % a + a) % a;
    I = s;
    const c = le[s];
    i.replaceChildren(), c.forEach((n) => {
      const u = et(n);
      i.appendChild(u);
    }), i.setAttribute("aria-label", `Color harmony palette ${s + 1} of ${a}`);
  }
  function mt() {
    S && (Z(), B = !0, S.classList.remove("collapsed"), S.classList.add("expanded"), setTimeout(() => {
      H == null || H.focus();
    }, 0));
  }
  function vt() {
    S && (B = !1, S.classList.remove("expanded"), S.classList.add("collapsed"), M == null || M.focus());
  }
  function Ge(i) {
    (typeof i == "boolean" ? i : !B) ? mt() : vt();
  }
  function wt() {
    if (H) return;
    S = document.createElement("div"), S.className = "housekeeper-wrapper collapsed", M = document.createElement("button"), M.type = "button", M.className = "housekeeper-handle", M.title = "Toggle Housekeeper panel (Ctrl+Shift+H)";
    const i = document.createElement("img");
    i.src = ct, i.alt = "", i.draggable = !1, M.appendChild(i);
    const t = document.createElement("span");
    t.textContent = "Housekeeper", M.appendChild(t), M.addEventListener("click", () => Ge()), H = document.createElement("div"), H.className = "housekeeper-panel", H.setAttribute("role", "region"), H.setAttribute("aria-label", "Housekeeper alignment tools"), H.tabIndex = -1;
    const a = document.createElement("div");
    a.className = "housekeeper-content";
    const s = document.createElement("div");
    s.className = "housekeeper-header";
    const c = document.createElement("div");
    c.className = "housekeeper-header-title";
    const n = document.createElement("img");
    n.src = ct, n.alt = "", n.draggable = !1, c.appendChild(n);
    const u = document.createElement("span");
    u.textContent = "Housekeeper", c.appendChild(u);
    const f = document.createElement("button");
    f.type = "button", f.className = "housekeeper-close", f.setAttribute("aria-label", "Hide Housekeeper panel"), f.innerHTML = "&times;", f.addEventListener("click", () => Ge(!1)), s.appendChild(c), s.appendChild(f);
    const p = document.createElement("div");
    p.className = "housekeeper-divider";
    const v = Le();
    v.classList.add("housekeeper-section-primary"), v.appendChild(ge("Basic Alignment")), v.appendChild(xe(be, "basic")), v.appendChild(ge("Size Adjustment")), v.appendChild(xe(ue, "size")), v.appendChild(ge("Flow Alignment")), v.appendChild(xe(ye, "flow"));
    const C = (ee, te, ke = !0) => {
      const Ce = document.createElement("div");
      return Ce.className = te, Ce.setAttribute("role", "group"), ee.forEach((Ee) => {
        const Xe = et(Ee, ke);
        Ce.appendChild(Xe);
      }), Ce;
    }, b = Le();
    b.appendChild(ge("Color"));
    const O = document.createElement("div");
    O.className = "housekeeper-color-carousel";
    const $ = document.createElement("button");
    $.type = "button", $.className = "hk-palette-arrow hk-palette-arrow-prev", $.innerHTML = "&#9664;";
    const F = document.createElement("div");
    F.className = "housekeeper-color-strip", F.setAttribute("role", "group");
    const h = document.createElement("button");
    h.type = "button", h.className = "hk-palette-arrow hk-palette-arrow-next", h.innerHTML = "&#9654;", O.appendChild($), O.appendChild(F), O.appendChild(h), b.appendChild(O);
    const y = () => {
      const ee = le.length, te = (I - 1 + ee) % ee, ke = (I + 1) % ee;
      $.setAttribute("aria-label", `Show color set ${te + 1} of ${ee}`), h.setAttribute("aria-label", `Show color set ${ke + 1} of ${ee}`);
    }, r = (ee) => {
      const te = le.length;
      te && (I = (I + ee + te) % te, tt(F, I), y());
    };
    $.addEventListener("click", () => r(-1)), h.addEventListener("click", () => r(1)), tt(F, I), y();
    const E = document.createElement("div");
    E.className = "housekeeper-color-custom-row";
    const N = document.createElement("span");
    N.textContent = "Custom";
    const ce = document.createElement("div");
    ce.className = "hk-toggle-placeholder", E.appendChild(N), E.appendChild(ce), b.appendChild(E);
    const fe = document.createElement("div");
    fe.className = "housekeeper-color-picker-placeholder";
    const Y = document.createElement("div");
    Y.className = "housekeeper-color-picker-toolbar";
    const o = document.createElement("div");
    o.className = "hk-swatch", o.style.background = "#000000";
    const l = document.createElement("div");
    l.className = "hk-swatch", l.style.background = "#ff4238";
    const x = document.createElement("div");
    x.className = "hk-slider-placeholder";
    const k = document.createElement("div");
    k.className = "hk-rgb-placeholder", ["R", "G", "B"].forEach((ee) => {
      const te = document.createElement("div");
      te.className = "hk-rgb-pill", te.textContent = ee, k.appendChild(te);
    }), Y.appendChild(o), Y.appendChild(l), Y.appendChild(x), Y.appendChild(k), fe.appendChild(Y), b.appendChild(fe), b.appendChild(ge("On this page"));
    const A = C(
      ["#C9CCD1", "#5A7A9F", "#2E3136", "#6F7B89", "#4B6076", "#2B3F2F", "#2C3D4E", "#4C3C5A", "#3F2725", "#1E1E1F"],
      "housekeeper-color-footer"
    );
    b.appendChild(A), a.appendChild(s), a.appendChild(p), a.appendChild(v);
    const pe = document.createElement("div");
    pe.className = "housekeeper-divider housekeeper-divider-spaced", a.appendChild(pe), a.appendChild(b), H.appendChild(a), S.appendChild(M), S.appendChild(H), document.body.appendChild(S), U(), Z();
  }
  function it(i) {
    var s;
    if (m.length < 2) return;
    Pe();
    const t = (s = window.app) == null ? void 0 : s.canvas;
    if (!t) return;
    bt(i, m).forEach((c, n) => {
      if (c && m[n]) {
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
        const f = (c.x + t.ds.offset[0]) * t.ds.scale, p = (c.y + t.ds.offset[1]) * t.ds.scale, v = t.canvas.parentElement, C = t.canvas.getBoundingClientRect(), b = v ? v.getBoundingClientRect() : null;
        b && C.top - b.top, C.top;
        const O = document.querySelector("nav");
        let $ = 31;
        O && ($ = O.getBoundingClientRect().height);
        const F = $ * t.ds.scale, h = C.left + f, y = C.top + p - F, r = c.width * t.ds.scale, E = c.height * t.ds.scale;
        u.style.left = h + "px", u.style.top = y + "px", u.style.width = r + "px", u.style.height = E + "px", document.body.appendChild(u), X.push(u);
      }
    });
  }
  function Pe() {
    X.forEach((i) => {
      i.parentNode && i.parentNode.removeChild(i);
    }), X = [];
  }
  function bt(i, t) {
    if (t.length < 2) return [];
    const a = [], s = Math.min(...t.map((f) => f.pos[0])), c = Math.max(...t.map((f) => {
      let p = 150;
      return f.size && Array.isArray(f.size) && f.size[0] ? p = f.size[0] : typeof f.width == "number" ? p = f.width : f.properties && typeof f.properties.width == "number" && (p = f.properties.width), f.pos[0] + p;
    })), n = Math.min(...t.map((f) => f.pos[1])), u = Math.max(...t.map((f) => {
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
        const C = [...t].sort((e, g) => e.pos[1] - g.pos[1]);
        let b = C[0].pos[1];
        const O = /* @__PURE__ */ new Map();
        C.forEach((e) => {
          let g = 100, w = 150;
          e.size && Array.isArray(e.size) ? (e.size[1] && (g = e.size[1]), e.size[0] && (w = e.size[0])) : (typeof e.height == "number" && (g = e.height), typeof e.width == "number" && (w = e.width), e.properties && (typeof e.properties.height == "number" && (g = e.properties.height), typeof e.properties.width == "number" && (w = e.properties.width))), O.set(e.id, {
            x: c - w,
            y: b,
            width: w,
            height: g
          }), b += g + 30;
        }), t.forEach((e) => {
          a.push(O.get(e.id));
        });
        break;
      case "top":
        const $ = [...t].sort((e, g) => e.pos[0] - g.pos[0]);
        let F = $[0].pos[0];
        const h = /* @__PURE__ */ new Map();
        $.forEach((e) => {
          let g = 100, w = 150;
          e.size && Array.isArray(e.size) ? (e.size[1] && (g = e.size[1]), e.size[0] && (w = e.size[0])) : (typeof e.height == "number" && (g = e.height), typeof e.width == "number" && (w = e.width), e.properties && (typeof e.properties.height == "number" && (g = e.properties.height), typeof e.properties.width == "number" && (w = e.properties.width))), h.set(e.id, {
            x: F,
            y: n,
            width: w,
            height: g
          }), F += w + 30;
        }), t.forEach((e) => {
          a.push(h.get(e.id));
        });
        break;
      case "bottom":
        const y = [...t].sort((e, g) => e.pos[0] - g.pos[0]);
        let r = s;
        const E = /* @__PURE__ */ new Map();
        y.forEach((e) => {
          let g = 100, w = 150;
          e.size && Array.isArray(e.size) ? (e.size[1] && (g = e.size[1]), e.size[0] && (w = e.size[0])) : (typeof e.height == "number" && (g = e.height), typeof e.width == "number" && (w = e.width), e.properties && (typeof e.properties.height == "number" && (g = e.properties.height), typeof e.properties.width == "number" && (w = e.properties.width))), E.set(e.id, {
            x: r,
            y: u - g,
            width: w,
            height: g
          }), r += w + 30;
        }), t.forEach((e) => {
          a.push(E.get(e.id));
        });
        break;
      case "horizontal-flow":
        const N = t.filter((e) => {
          if (!e) return !1;
          const g = e.pos || e.position || typeof e.x == "number" && typeof e.y == "number", w = e.size || e.width || e.height || typeof e.width == "number" && typeof e.height == "number";
          return !!g && !!w;
        });
        if (N.length < 2) break;
        const ce = Math.min(...N.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[0] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[0] : typeof e.x == "number" ? e.x : 0)), fe = Math.min(...N.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[1] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[1] : typeof e.y == "number" ? e.y : 0)), Y = N.map((e) => ({
          ...e,
          pos: e.pos ? [...e.pos] : [e.x || 0, e.y || 0],
          _calculatedSize: e.size && Array.isArray(e.size) ? [e.size[0], e.size[1]] : [e.width || 150, e.height || 100]
        })), o = Ve(Y), l = Te(Y, o), x = 30, k = 30, A = 5, pe = {};
        Y.forEach((e) => {
          var g;
          if (e && e.id) {
            const w = ((g = l[e.id]) == null ? void 0 : g.level) ?? 0;
            pe[w] || (pe[w] = []), pe[w].push(e);
          }
        });
        const ee = /* @__PURE__ */ new Map();
        Object.entries(pe).forEach(([e, g]) => {
          const w = parseInt(e);
          if (g && g.length > 0) {
            g.sort((d, V) => {
              const ne = d && d.id && l[d.id] ? l[d.id].order : 0, L = V && V.id && l[V.id] ? l[V.id].order : 0;
              return ne - L;
            });
            let oe = ce;
            if (w > 0)
              for (let d = 0; d < w; d++) {
                const V = pe[d] || [], ne = Math.max(...V.map(
                  (L) => L && L._calculatedSize && L._calculatedSize[0] ? L._calculatedSize[0] : 150
                ));
                oe += ne + x + A;
              }
            let se = fe;
            g.forEach((d) => {
              d && d._calculatedSize && (ee.set(d.id, {
                x: oe,
                y: se,
                width: d._calculatedSize[0],
                height: d._calculatedSize[1]
              }), se += d._calculatedSize[1] + k);
            });
          }
        }), t.forEach((e) => {
          const g = ee.get(e.id);
          g && a.push(g);
        });
        break;
      case "vertical-flow":
        const te = t.filter((e) => {
          if (!e) return !1;
          const g = e.pos || e.position || typeof e.x == "number" && typeof e.y == "number", w = e.size || e.width || e.height || typeof e.width == "number" && typeof e.height == "number";
          return !!g && !!w;
        });
        if (te.length < 2) break;
        const ke = Math.min(...te.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[0] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[0] : typeof e.x == "number" ? e.x : 0)), Ce = Math.min(...te.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[1] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[1] : typeof e.y == "number" ? e.y : 0)), Ee = te.map((e) => ({
          ...e,
          pos: e.pos ? [...e.pos] : [e.x || 0, e.y || 0],
          _calculatedSize: e.size && Array.isArray(e.size) ? [e.size[0], e.size[1]] : [e.width || 150, e.height || 100]
        })), Xe = Ve(Ee), Se = Te(Ee, Xe), Et = 30, St = 30, At = 5, Ae = {};
        Ee.forEach((e) => {
          var g;
          if (e && e.id) {
            const w = ((g = Se[e.id]) == null ? void 0 : g.level) ?? 0;
            Ae[w] || (Ae[w] = []), Ae[w].push(e);
          }
        });
        const at = /* @__PURE__ */ new Map();
        Object.entries(Ae).forEach(([e, g]) => {
          const w = parseInt(e);
          if (g && g.length > 0) {
            g.sort((d, V) => {
              const ne = d && d.id && Se[d.id] ? Se[d.id].order : 0, L = V && V.id && Se[V.id] ? Se[V.id].order : 0;
              return ne - L;
            });
            let oe = Ce;
            if (w > 0)
              for (let d = 0; d < w; d++) {
                const V = Ae[d] || [], ne = Math.max(...V.map(
                  (L) => L && L._calculatedSize && L._calculatedSize[1] ? L._calculatedSize[1] : 100
                ));
                oe += ne + Et + At;
              }
            let se = ke;
            g.forEach((d) => {
              d && d._calculatedSize && (at.set(d.id, {
                x: se,
                y: oe,
                width: d._calculatedSize[0],
                height: d._calculatedSize[1]
              }), se += d._calculatedSize[0] + St);
            });
          }
        }), t.forEach((e) => {
          const g = at.get(e.id);
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
          let oe = g, se = w;
          if (i === "width-max" || i === "size-max")
            oe = Math.max(...t.map((d) => d.size && Array.isArray(d.size) && d.size[0] ? d.size[0] : typeof d.width == "number" ? d.width : d.properties && typeof d.properties.width == "number" ? d.properties.width : 150));
          else if (i === "width-min")
            oe = Math.min(...t.map((d) => d.size && Array.isArray(d.size) && d.size[0] ? d.size[0] : typeof d.width == "number" ? d.width : d.properties && typeof d.properties.width == "number" ? d.properties.width : 150));
          else if (i === "size-min") {
            const d = D.get(e) || e.computeSize;
            if (d)
              try {
                const V = d.call(e);
                V && V.length >= 2 && V[0] !== void 0 && V[1] !== void 0 ? (oe = V[0], se = V[1] + 30) : typeof V == "number" ? (oe = g, se = V + 30) : (oe = g, se = w);
              } catch {
                oe = g, se = w;
              }
          }
          if (i === "height-max" || i === "size-max")
            se = Math.max(...t.map((d) => d.size && Array.isArray(d.size) && d.size[1] ? d.size[1] : typeof d.height == "number" ? d.height : d.properties && typeof d.properties.height == "number" ? d.properties.height : 100));
          else if (i === "height-min") {
            const d = Math.min(...t.map((L) => L.size && L.size[1] !== void 0 ? L.size[1] : typeof L.height == "number" ? L.height : L.properties && typeof L.properties.height == "number" ? L.properties.height : 100)), V = D.get(e) || e.computeSize;
            let ne = null;
            if (V)
              try {
                const L = V.call(e);
                L && L.length >= 2 && L[1] !== void 0 ? ne = L[1] + 30 : typeof L == "number" && (ne = L + 30);
              } catch {
              }
            se = ne && ne > d ? ne : d;
          }
          a.push({
            x: e.pos[0],
            y: e.pos[1],
            width: oe,
            height: se
          });
        });
        break;
    }
    return a;
  }
  function Fe() {
    var n;
    if (!((n = window.app) != null && n.graph)) return;
    const i = window.app.graph;
    m = Object.values(i._nodes || {}).filter((u) => u && u.is_selected), re = (Array.isArray(i._groups) ? i._groups : []).filter((u) => u && u.selected);
    const s = m.length > 1;
    m.length + re.length, s || Pe(), S && S.classList.toggle("hk-has-selection", s);
    const c = H == null ? void 0 : H.querySelectorAll(".hk-button");
    c == null || c.forEach((u) => {
      u.disabled = !s;
    });
  }
  function Ve(i) {
    const t = {}, a = i.filter((s) => s && (s.id !== void 0 || s.id !== null));
    return a.forEach((s) => {
      const c = s.id || `node_${a.indexOf(s)}`;
      s.id = c, t[c] = { inputs: [], outputs: [] }, s.inputs && Array.isArray(s.inputs) && s.inputs.forEach((n, u) => {
        n && n.link !== null && n.link !== void 0 && t[c].inputs.push({
          index: u,
          link: n.link,
          sourceNode: yt(n.link, a)
        });
      }), s.outputs && Array.isArray(s.outputs) && s.outputs.forEach((n, u) => {
        n && n.links && Array.isArray(n.links) && n.links.length > 0 && n.links.forEach((f) => {
          const p = Ct(f, a);
          p && t[c].outputs.push({
            index: u,
            link: f,
            targetNode: p
          });
        });
      });
    }), t;
  }
  function yt(i, t) {
    for (const a of t)
      if (a && a.outputs && Array.isArray(a.outputs)) {
        for (const s of a.outputs)
          if (s && s.links && Array.isArray(s.links) && s.links.includes(i))
            return a;
      }
    return null;
  }
  function Ct(i, t) {
    for (const a of t)
      if (a && a.inputs && Array.isArray(a.inputs)) {
        for (const s of a.inputs)
          if (s && s.link === i)
            return a;
      }
    return null;
  }
  function Te(i, t) {
    const a = {}, s = /* @__PURE__ */ new Set(), c = i.filter((p) => p && p.id), n = c.filter((p) => {
      const v = p.id;
      return !t[v] || !t[v].inputs.length || t[v].inputs.every((C) => !C.sourceNode);
    });
    n.length === 0 && c.length > 0 && n.push(c[0]);
    const u = n.map((p) => ({ node: p, level: 0 }));
    for (; u.length > 0; ) {
      const { node: p, level: v } = u.shift();
      !p || !p.id || s.has(p.id) || (s.add(p.id), a[p.id] = { level: v, order: 0 }, t[p.id] && t[p.id].outputs && t[p.id].outputs.forEach((C) => {
        C && C.targetNode && C.targetNode.id && !s.has(C.targetNode.id) && u.push({ node: C.targetNode, level: v + 1 });
      }));
    }
    c.forEach((p) => {
      p && p.id && !a[p.id] && (a[p.id] = { level: 0, order: 0 });
    });
    const f = {};
    return Object.entries(a).forEach(([p, v]) => {
      f[v.level] || (f[v.level] = []);
      const C = c.find((b) => b && b.id === p);
      C && f[v.level].push(C);
    }), Object.entries(f).forEach(([p, v]) => {
      v && v.length > 0 && (v.sort((C, b) => {
        const O = C && C.pos && C.pos[1] ? C.pos[1] : 0, $ = b && b.pos && b.pos[1] ? b.pos[1] : 0;
        return O - $;
      }), v.forEach((C, b) => {
        C && C.id && a[C.id] && (a[C.id].order = b);
      }));
    }), a;
  }
  function me(i) {
    var t, a, s, c, n;
    if (m.length < 2) {
      ve("Please select at least 2 nodes to align", "warning");
      return;
    }
    try {
      const u = Math.min(...m.map((h) => h.pos[0])), f = Math.max(...m.map((h) => {
        let y = 150;
        return h.size && Array.isArray(h.size) && h.size[0] ? y = h.size[0] : typeof h.width == "number" ? y = h.width : h.properties && typeof h.properties.width == "number" && (y = h.properties.width), h.pos[0] + y;
      })), p = Math.min(...m.map((h) => h.pos[1])), v = Math.max(...m.map((h) => {
        let y = 100;
        return h.size && Array.isArray(h.size) && h.size[1] ? y = h.size[1] : typeof h.height == "number" ? y = h.height : h.properties && typeof h.properties.height == "number" && (y = h.properties.height), h.pos[1] + y;
      })), C = Math.max(...m.map((h) => {
        const y = T.get(h);
        if (y && y.width !== void 0) return y.width;
        let r = 150;
        return h.size && Array.isArray(h.size) && h.size[0] ? r = h.size[0] : typeof h.width == "number" ? r = h.width : h.properties && typeof h.properties.width == "number" && (r = h.properties.width), r;
      })), b = Math.min(...m.map((h) => {
        const y = T.get(h);
        if (y && y.width !== void 0) return y.width;
        let r = 150;
        return h.size && Array.isArray(h.size) && h.size[0] ? r = h.size[0] : typeof h.width == "number" ? r = h.width : h.properties && typeof h.properties.width == "number" && (r = h.properties.width), r;
      })), O = Math.max(...m.map((h) => {
        const y = T.get(h);
        return y && y.height !== void 0 ? y.height : h.size && h.size[1] !== void 0 ? h.size[1] : typeof h.height == "number" ? h.height : h.properties && typeof h.properties.height == "number" ? h.properties.height : 100;
      })), $ = Math.min(...m.map((h) => h.size && h.size[1] !== void 0 ? h.size[1] : typeof h.height == "number" ? h.height : h.properties && typeof h.properties.height == "number" ? h.properties.height : 100));
      let F;
      switch (i) {
        case "left":
          F = u;
          const h = [...m].sort((o, l) => o.pos[1] - l.pos[1]);
          let y = h[0].pos[1];
          h.forEach((o, l) => {
            let k = 100;
            o.size && Array.isArray(o.size) && o.size[1] ? k = o.size[1] : typeof o.height == "number" ? k = o.height : o.properties && typeof o.properties.height == "number" && (k = o.properties.height), o.pos[0] = F, o.pos[1] = y, typeof o.x == "number" && (o.x = o.pos[0]), typeof o.y == "number" && (o.y = o.pos[1]), y += k + 30;
          });
          break;
        case "right":
          F = f;
          const r = [...m].sort((o, l) => o.pos[1] - l.pos[1]);
          let E = r[0].pos[1];
          r.forEach((o, l) => {
            let k = 100, A = 150;
            o.size && Array.isArray(o.size) ? (o.size[1] && (k = o.size[1]), o.size[0] && (A = o.size[0])) : (typeof o.height == "number" && (k = o.height), typeof o.width == "number" && (A = o.width), o.properties && (typeof o.properties.height == "number" && (k = o.properties.height), typeof o.properties.width == "number" && (A = o.properties.width))), o.pos[0] = F - A, o.pos[1] = E, typeof o.x == "number" && (o.x = o.pos[0]), typeof o.y == "number" && (o.y = o.pos[1]), E += k + 30;
          });
          break;
        case "top":
          F = p;
          const N = [...m].sort((o, l) => o.pos[0] - l.pos[0]);
          let ce = N[0].pos[0];
          N.forEach((o, l) => {
            let k = 150;
            o.size && Array.isArray(o.size) && o.size[0] ? k = o.size[0] : typeof o.width == "number" ? k = o.width : o.properties && typeof o.properties.width == "number" && (k = o.properties.width), o.pos[1] = F, o.pos[0] = ce, typeof o.x == "number" && (o.x = o.pos[0]), typeof o.y == "number" && (o.y = o.pos[1]), ce += k + 30;
          });
          break;
        case "bottom":
          F = v;
          const fe = [...m].sort((o, l) => o.pos[0] - l.pos[0]);
          let Y = u;
          fe.forEach((o, l) => {
            let k = 150, A = 100;
            o.size && Array.isArray(o.size) ? (o.size[0] && (k = o.size[0]), o.size[1] && (A = o.size[1])) : (typeof o.width == "number" && (k = o.width), typeof o.height == "number" && (A = o.height), o.properties && (typeof o.properties.width == "number" && (k = o.properties.width), typeof o.properties.height == "number" && (A = o.properties.height)));
            const pe = F - A, ee = Y;
            o.pos[1] = pe, o.pos[0] = ee, typeof o.x == "number" && (o.x = o.pos[0]), typeof o.y == "number" && (o.y = o.pos[1]), Y += k + 30;
          });
          break;
        case "width-max":
          m.forEach((o) => {
            o.size && (o.size[0] = C);
          });
          break;
        case "width-min":
          m.forEach((o) => {
            o.size && (o.size[0] = b);
          });
          break;
        case "height-max":
          m.forEach((o) => {
            o.size && (o.size[1] = O);
          });
          break;
        case "height-min":
          m.forEach((o) => {
            if (o.size) {
              const l = D.get(o) || o.computeSize;
              if (l) {
                const x = l.call(o);
                o.size[1] = Math.max($, x[1]);
              }
            }
          });
          break;
        case "size-max":
          m.forEach((o) => {
            o.size && (o.size[0] = C, o.size[1] = O);
          });
          break;
        case "size-min":
          m.forEach((o) => {
            if (o.size) {
              const l = D.get(o) || o.computeSize;
              if (l) {
                const x = l.call(o);
                o.size[0] = x[0], o.size[1] = x[1];
              }
            }
          });
          break;
        case "horizontal-flow":
          xt();
          return;
        // Don't continue to the success message at the bottom
        case "vertical-flow":
          zt();
          return;
      }
      try {
        (a = (t = window.app) == null ? void 0 : t.canvas) != null && a.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (c = (s = window.app) == null ? void 0 : s.graph) != null && c.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (n = window.app) != null && n.canvas && window.app.canvas.draw(!0, !0);
      } catch {
      }
    } catch {
      ve("Error during alignment", "error");
    }
  }
  function p2(i) {
  }
  function xt() {
    var i, t, a, s, c;
    try {
      const n = m.filter((r) => {
        if (!r) return !1;
        const E = r.pos || r.position || typeof r.x == "number" && typeof r.y == "number", N = r.size || r.width || r.height || typeof r.width == "number" && typeof r.height == "number";
        return !!E && !!N;
      });
      if (n.length < 2) {
        ve(`Not enough valid nodes: ${n.length}/${m.length} nodes are valid`, "warning");
        return;
      }
      const u = Math.min(...n.map((r) => r.pos && (Array.isArray(r.pos) || r.pos.length !== void 0) ? r.pos[0] : r.position && (Array.isArray(r.position) || r.position.length !== void 0) ? r.position[0] : typeof r.x == "number" ? r.x : 0)), f = Math.min(...n.map((r) => r.pos && (Array.isArray(r.pos) || r.pos.length !== void 0) ? r.pos[1] : r.position && (Array.isArray(r.position) || r.position.length !== void 0) ? r.position[1] : typeof r.y == "number" ? r.y : 0)), p = u, v = f;
      n.forEach((r) => {
        r.pos || (r.position && Array.isArray(r.position) ? r.pos = r.position : typeof r.x == "number" && typeof r.y == "number" ? r.pos = [r.x, r.y] : r.pos = [0, 0]), r._calculatedSize || (r.size && Array.isArray(r.size) ? r._calculatedSize = [r.size[0], r.size[1]] : typeof r.width == "number" && typeof r.height == "number" ? r._calculatedSize = [r.width, r.height] : r._calculatedSize = [150, 100]), Array.isArray(r.pos) || (r.pos = [0, 0]);
      });
      const C = Ve(n), b = Te(n, C), O = 30, $ = 30, F = 30, h = 5, y = {};
      n.forEach((r) => {
        var E;
        if (r && r.id) {
          const N = ((E = b[r.id]) == null ? void 0 : E.level) ?? 0;
          y[N] || (y[N] = []), y[N].push(r);
        }
      }), Object.entries(y).forEach(([r, E]) => {
        const N = parseInt(r);
        if (E && E.length > 0) {
          E.sort((l, x) => {
            const k = l && l.id && b[l.id] ? b[l.id].order : 0, A = x && x.id && b[x.id] ? b[x.id].order : 0;
            return k - A;
          });
          const ce = E.reduce((l, x, k) => {
            const A = x && x._calculatedSize && x._calculatedSize[1] ? x._calculatedSize[1] : 100;
            return l + A + (k < E.length - 1 ? F : 0);
          }, 0), fe = Math.max(...E.map(
            (l) => l && l._calculatedSize && l._calculatedSize[0] ? l._calculatedSize[0] : 150
          ));
          let Y = p;
          if (N > 0)
            for (let l = 0; l < N; l++) {
              const x = y[l] || [], k = Math.max(...x.map(
                (A) => A && A._calculatedSize && A._calculatedSize[0] ? A._calculatedSize[0] : 150
              ));
              Y += k + O + h;
            }
          let o = v;
          E.forEach((l, x) => {
            if (l && l.pos && l._calculatedSize) {
              const k = [l.pos[0], l.pos[1]], A = [l._calculatedSize[0], l._calculatedSize[1]];
              l.pos[0] = Y, l.pos[1] = o, o += l._calculatedSize[1] + F, typeof l.x == "number" && (l.x = l.pos[0]), typeof l.y == "number" && (l.y = l.pos[1]);
            }
          });
        }
      });
      try {
        (t = (i = window.app) == null ? void 0 : i.canvas) != null && t.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (s = (a = window.app) == null ? void 0 : a.graph) != null && s.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (c = window.app) != null && c.canvas && window.app.canvas.draw(!0, !0);
      } catch {
      }
    } catch {
      ve("Error in horizontal flow alignment", "error");
    }
  }
  function zt() {
    var i, t, a, s, c;
    try {
      const n = m.filter((r) => {
        if (!r) return !1;
        const E = r.pos || r.position || typeof r.x == "number" && typeof r.y == "number", N = r.size || r.width || r.height || typeof r.width == "number" && typeof r.height == "number";
        return !!E && !!N;
      });
      if (n.length < 2) {
        ve(`Not enough valid nodes: ${n.length}/${m.length} nodes are valid`, "warning");
        return;
      }
      const u = Math.min(...n.map((r) => r.pos && (Array.isArray(r.pos) || r.pos.length !== void 0) ? r.pos[0] : r.position && (Array.isArray(r.position) || r.position.length !== void 0) ? r.position[0] : typeof r.x == "number" ? r.x : 0)), f = Math.min(...n.map((r) => r.pos && (Array.isArray(r.pos) || r.pos.length !== void 0) ? r.pos[1] : r.position && (Array.isArray(r.position) || r.position.length !== void 0) ? r.position[1] : typeof r.y == "number" ? r.y : 0)), p = u, v = f;
      n.forEach((r) => {
        r.pos || (r.position && Array.isArray(r.position) ? r.pos = r.position : typeof r.x == "number" && typeof r.y == "number" ? r.pos = [r.x, r.y] : r.pos = [0, 0]), r._calculatedSize || (r.size && Array.isArray(r.size) ? r._calculatedSize = [r.size[0], r.size[1]] : typeof r.width == "number" && typeof r.height == "number" ? r._calculatedSize = [r.width, r.height] : r._calculatedSize = [150, 100]), Array.isArray(r.pos) || (r.pos = [0, 0]);
      });
      const C = Ve(n), b = Te(n, C), O = 30, $ = 30, F = 30, h = 5, y = {};
      n.forEach((r) => {
        var E;
        if (r && r.id) {
          const N = ((E = b[r.id]) == null ? void 0 : E.level) ?? 0;
          y[N] || (y[N] = []), y[N].push(r);
        }
      }), Object.entries(y).forEach(([r, E]) => {
        const N = parseInt(r);
        if (E && E.length > 0) {
          E.sort((l, x) => {
            const k = l && l.id && b[l.id] ? b[l.id].order : 0, A = x && x.id && b[x.id] ? b[x.id].order : 0;
            return k - A;
          });
          const ce = E.reduce((l, x, k) => {
            const A = x && x._calculatedSize && x._calculatedSize[0] ? x._calculatedSize[0] : 150;
            return l + A + $;
          }, 0), fe = Math.max(...E.map(
            (l) => l && l._calculatedSize && l._calculatedSize[1] ? l._calculatedSize[1] : 100
          ));
          let Y = v;
          if (N > 0)
            for (let l = 0; l < N; l++) {
              const x = y[l] || [], k = Math.max(...x.map(
                (A) => A && A._calculatedSize && A._calculatedSize[1] ? A._calculatedSize[1] : 100
              ));
              Y += k + O + h;
            }
          let o = p;
          E.forEach((l, x) => {
            if (l && l.pos && l._calculatedSize) {
              const k = [l.pos[0], l.pos[1]], A = [l._calculatedSize[0], l._calculatedSize[1]];
              l.pos[0] = o, l.pos[1] = Y, o += l._calculatedSize[0] + $, typeof l.x == "number" && (l.x = l.pos[0]), typeof l.y == "number" && (l.y = l.pos[1]);
            }
          });
        }
      });
      try {
        (t = (i = window.app) == null ? void 0 : i.canvas) != null && t.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (s = (a = window.app) == null ? void 0 : a.graph) != null && s.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (c = window.app) != null && c.canvas && window.app.canvas.draw(!0, !0);
      } catch {
      }
    } catch {
      ve("Error in vertical flow alignment", "error");
    }
  }
  function ve(i, t = "info") {
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
  function rt() {
    var i;
    if (!((i = window.app) != null && i.canvas)) {
      setTimeout(rt, 100);
      return;
    }
    window.app.canvas.canvas && (window.app.canvas.canvas.addEventListener("click", () => {
      setTimeout(Fe, 10);
    }), window.app.canvas.canvas.addEventListener("mouseup", () => {
      setTimeout(Fe, 10);
    }), document.addEventListener("keydown", (t) => {
      (t.ctrlKey || t.metaKey) && setTimeout(Fe, 10);
    })), setInterval(Fe, 500);
  }
  function kt(i) {
    if (i.ctrlKey || i.metaKey) {
      if (i.shiftKey && !i.altKey && (i.key === "H" || i.key === "h")) {
        i.preventDefault(), Ge();
        return;
      }
      if (i.shiftKey)
        switch (i.key) {
          case "ArrowLeft":
            i.preventDefault(), me("left");
            break;
          case "ArrowRight":
            i.preventDefault(), me("right");
            break;
          case "ArrowUp":
            i.preventDefault(), me("top");
            break;
          case "ArrowDown":
            i.preventDefault(), me("bottom");
            break;
        }
      else if (i.altKey)
        switch (i.key) {
          case "ArrowRight":
            i.preventDefault(), me("horizontal-flow");
            break;
          case "ArrowDown":
            i.preventDefault(), me("vertical-flow");
            break;
        }
    }
  }
  wt(), rt(), document.addEventListener("keydown", kt);
}
const W = {
  active: !1,
  colorOption: null,
  nodes: /* @__PURE__ */ new Map(),
  groups: /* @__PURE__ */ new Map()
};
