var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/color-name/index.cjs
var require_color_name = __commonJS({
  "node_modules/color-name/index.cjs"(exports2, module2) {
    "use strict";
    module2.exports = {
      "aliceblue": [240, 248, 255],
      "antiquewhite": [250, 235, 215],
      "aqua": [0, 255, 255],
      "aquamarine": [127, 255, 212],
      "azure": [240, 255, 255],
      "beige": [245, 245, 220],
      "bisque": [255, 228, 196],
      "black": [0, 0, 0],
      "blanchedalmond": [255, 235, 205],
      "blue": [0, 0, 255],
      "blueviolet": [138, 43, 226],
      "brown": [165, 42, 42],
      "burlywood": [222, 184, 135],
      "cadetblue": [95, 158, 160],
      "chartreuse": [127, 255, 0],
      "chocolate": [210, 105, 30],
      "coral": [255, 127, 80],
      "cornflowerblue": [100, 149, 237],
      "cornsilk": [255, 248, 220],
      "crimson": [220, 20, 60],
      "cyan": [0, 255, 255],
      "darkblue": [0, 0, 139],
      "darkcyan": [0, 139, 139],
      "darkgoldenrod": [184, 134, 11],
      "darkgray": [169, 169, 169],
      "darkgreen": [0, 100, 0],
      "darkgrey": [169, 169, 169],
      "darkkhaki": [189, 183, 107],
      "darkmagenta": [139, 0, 139],
      "darkolivegreen": [85, 107, 47],
      "darkorange": [255, 140, 0],
      "darkorchid": [153, 50, 204],
      "darkred": [139, 0, 0],
      "darksalmon": [233, 150, 122],
      "darkseagreen": [143, 188, 143],
      "darkslateblue": [72, 61, 139],
      "darkslategray": [47, 79, 79],
      "darkslategrey": [47, 79, 79],
      "darkturquoise": [0, 206, 209],
      "darkviolet": [148, 0, 211],
      "deeppink": [255, 20, 147],
      "deepskyblue": [0, 191, 255],
      "dimgray": [105, 105, 105],
      "dimgrey": [105, 105, 105],
      "dodgerblue": [30, 144, 255],
      "firebrick": [178, 34, 34],
      "floralwhite": [255, 250, 240],
      "forestgreen": [34, 139, 34],
      "fuchsia": [255, 0, 255],
      "gainsboro": [220, 220, 220],
      "ghostwhite": [248, 248, 255],
      "gold": [255, 215, 0],
      "goldenrod": [218, 165, 32],
      "gray": [128, 128, 128],
      "green": [0, 128, 0],
      "greenyellow": [173, 255, 47],
      "grey": [128, 128, 128],
      "honeydew": [240, 255, 240],
      "hotpink": [255, 105, 180],
      "indianred": [205, 92, 92],
      "indigo": [75, 0, 130],
      "ivory": [255, 255, 240],
      "khaki": [240, 230, 140],
      "lavender": [230, 230, 250],
      "lavenderblush": [255, 240, 245],
      "lawngreen": [124, 252, 0],
      "lemonchiffon": [255, 250, 205],
      "lightblue": [173, 216, 230],
      "lightcoral": [240, 128, 128],
      "lightcyan": [224, 255, 255],
      "lightgoldenrodyellow": [250, 250, 210],
      "lightgray": [211, 211, 211],
      "lightgreen": [144, 238, 144],
      "lightgrey": [211, 211, 211],
      "lightpink": [255, 182, 193],
      "lightsalmon": [255, 160, 122],
      "lightseagreen": [32, 178, 170],
      "lightskyblue": [135, 206, 250],
      "lightslategray": [119, 136, 153],
      "lightslategrey": [119, 136, 153],
      "lightsteelblue": [176, 196, 222],
      "lightyellow": [255, 255, 224],
      "lime": [0, 255, 0],
      "limegreen": [50, 205, 50],
      "linen": [250, 240, 230],
      "magenta": [255, 0, 255],
      "maroon": [128, 0, 0],
      "mediumaquamarine": [102, 205, 170],
      "mediumblue": [0, 0, 205],
      "mediumorchid": [186, 85, 211],
      "mediumpurple": [147, 112, 219],
      "mediumseagreen": [60, 179, 113],
      "mediumslateblue": [123, 104, 238],
      "mediumspringgreen": [0, 250, 154],
      "mediumturquoise": [72, 209, 204],
      "mediumvioletred": [199, 21, 133],
      "midnightblue": [25, 25, 112],
      "mintcream": [245, 255, 250],
      "mistyrose": [255, 228, 225],
      "moccasin": [255, 228, 181],
      "navajowhite": [255, 222, 173],
      "navy": [0, 0, 128],
      "oldlace": [253, 245, 230],
      "olive": [128, 128, 0],
      "olivedrab": [107, 142, 35],
      "orange": [255, 165, 0],
      "orangered": [255, 69, 0],
      "orchid": [218, 112, 214],
      "palegoldenrod": [238, 232, 170],
      "palegreen": [152, 251, 152],
      "paleturquoise": [175, 238, 238],
      "palevioletred": [219, 112, 147],
      "papayawhip": [255, 239, 213],
      "peachpuff": [255, 218, 185],
      "peru": [205, 133, 63],
      "pink": [255, 192, 203],
      "plum": [221, 160, 221],
      "powderblue": [176, 224, 230],
      "purple": [128, 0, 128],
      "rebeccapurple": [102, 51, 153],
      "red": [255, 0, 0],
      "rosybrown": [188, 143, 143],
      "royalblue": [65, 105, 225],
      "saddlebrown": [139, 69, 19],
      "salmon": [250, 128, 114],
      "sandybrown": [244, 164, 96],
      "seagreen": [46, 139, 87],
      "seashell": [255, 245, 238],
      "sienna": [160, 82, 45],
      "silver": [192, 192, 192],
      "skyblue": [135, 206, 235],
      "slateblue": [106, 90, 205],
      "slategray": [112, 128, 144],
      "slategrey": [112, 128, 144],
      "snow": [255, 250, 250],
      "springgreen": [0, 255, 127],
      "steelblue": [70, 130, 180],
      "tan": [210, 180, 140],
      "teal": [0, 128, 128],
      "thistle": [216, 191, 216],
      "tomato": [255, 99, 71],
      "turquoise": [64, 224, 208],
      "violet": [238, 130, 238],
      "wheat": [245, 222, 179],
      "white": [255, 255, 255],
      "whitesmoke": [245, 245, 245],
      "yellow": [255, 255, 0],
      "yellowgreen": [154, 205, 50]
    };
  }
});

// node_modules/color-convert/conversions.cjs
var require_conversions = __commonJS({
  "node_modules/color-convert/conversions.cjs"(exports2, module2) {
    var cssKeywords = require_color_name();
    var reverseKeywords = {};
    for (const key of Object.keys(cssKeywords)) {
      reverseKeywords[cssKeywords[key]] = key;
    }
    var convert = {
      rgb: { channels: 3, labels: "rgb" },
      hsl: { channels: 3, labels: "hsl" },
      hsv: { channels: 3, labels: "hsv" },
      hwb: { channels: 3, labels: "hwb" },
      cmyk: { channels: 4, labels: "cmyk" },
      xyz: { channels: 3, labels: "xyz" },
      lab: { channels: 3, labels: "lab" },
      lch: { channels: 3, labels: "lch" },
      hex: { channels: 1, labels: ["hex"] },
      keyword: { channels: 1, labels: ["keyword"] },
      ansi16: { channels: 1, labels: ["ansi16"] },
      ansi256: { channels: 1, labels: ["ansi256"] },
      hcg: { channels: 3, labels: ["h", "c", "g"] },
      apple: { channels: 3, labels: ["r16", "g16", "b16"] },
      gray: { channels: 1, labels: ["gray"] }
    };
    module2.exports = convert;
    for (const model of Object.keys(convert)) {
      if (!("channels" in convert[model])) {
        throw new Error("missing channels property: " + model);
      }
      if (!("labels" in convert[model])) {
        throw new Error("missing channel labels property: " + model);
      }
      if (convert[model].labels.length !== convert[model].channels) {
        throw new Error("channel and label counts mismatch: " + model);
      }
      const { channels, labels } = convert[model];
      delete convert[model].channels;
      delete convert[model].labels;
      Object.defineProperty(convert[model], "channels", { value: channels });
      Object.defineProperty(convert[model], "labels", { value: labels });
    }
    convert.rgb.hsl = function(rgb) {
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const min = Math.min(r, g, b);
      const max = Math.max(r, g, b);
      const delta = max - min;
      let h;
      let s;
      if (max === min) {
        h = 0;
      } else if (r === max) {
        h = (g - b) / delta;
      } else if (g === max) {
        h = 2 + (b - r) / delta;
      } else if (b === max) {
        h = 4 + (r - g) / delta;
      }
      h = Math.min(h * 60, 360);
      if (h < 0) {
        h += 360;
      }
      const l = (min + max) / 2;
      if (max === min) {
        s = 0;
      } else if (l <= 0.5) {
        s = delta / (max + min);
      } else {
        s = delta / (2 - max - min);
      }
      return [h, s * 100, l * 100];
    };
    convert.rgb.hsv = function(rgb) {
      let rdif;
      let gdif;
      let bdif;
      let h;
      let s;
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const v = Math.max(r, g, b);
      const diff = v - Math.min(r, g, b);
      const diffc = function(c) {
        return (v - c) / 6 / diff + 1 / 2;
      };
      if (diff === 0) {
        h = 0;
        s = 0;
      } else {
        s = diff / v;
        rdif = diffc(r);
        gdif = diffc(g);
        bdif = diffc(b);
        if (r === v) {
          h = bdif - gdif;
        } else if (g === v) {
          h = 1 / 3 + rdif - bdif;
        } else if (b === v) {
          h = 2 / 3 + gdif - rdif;
        }
        if (h < 0) {
          h += 1;
        } else if (h > 1) {
          h -= 1;
        }
      }
      return [
        h * 360,
        s * 100,
        v * 100
      ];
    };
    convert.rgb.hwb = function(rgb) {
      const r = rgb[0];
      const g = rgb[1];
      let b = rgb[2];
      const h = convert.rgb.hsl(rgb)[0];
      const w = 1 / 255 * Math.min(r, Math.min(g, b));
      b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));
      return [h, w * 100, b * 100];
    };
    convert.rgb.cmyk = function(rgb) {
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const k = Math.min(1 - r, 1 - g, 1 - b);
      const c = (1 - r - k) / (1 - k) || 0;
      const m = (1 - g - k) / (1 - k) || 0;
      const y = (1 - b - k) / (1 - k) || 0;
      return [c * 100, m * 100, y * 100, k * 100];
    };
    function comparativeDistance(x, y) {
      return (x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2 + (x[2] - y[2]) ** 2;
    }
    convert.rgb.keyword = function(rgb) {
      const reversed = reverseKeywords[rgb];
      if (reversed) {
        return reversed;
      }
      let currentClosestDistance = Infinity;
      let currentClosestKeyword;
      for (const keyword of Object.keys(cssKeywords)) {
        const value = cssKeywords[keyword];
        const distance = comparativeDistance(rgb, value);
        if (distance < currentClosestDistance) {
          currentClosestDistance = distance;
          currentClosestKeyword = keyword;
        }
      }
      return currentClosestKeyword;
    };
    convert.keyword.rgb = function(keyword) {
      return cssKeywords[keyword];
    };
    convert.rgb.xyz = function(rgb) {
      let r = rgb[0] / 255;
      let g = rgb[1] / 255;
      let b = rgb[2] / 255;
      r = r > 0.04045 ? ((r + 0.055) / 1.055) ** 2.4 : r / 12.92;
      g = g > 0.04045 ? ((g + 0.055) / 1.055) ** 2.4 : g / 12.92;
      b = b > 0.04045 ? ((b + 0.055) / 1.055) ** 2.4 : b / 12.92;
      const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
      const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
      const z = r * 0.0193 + g * 0.1192 + b * 0.9505;
      return [x * 100, y * 100, z * 100];
    };
    convert.rgb.lab = function(rgb) {
      const xyz = convert.rgb.xyz(rgb);
      let x = xyz[0];
      let y = xyz[1];
      let z = xyz[2];
      x /= 95.047;
      y /= 100;
      z /= 108.883;
      x = x > 8856e-6 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
      y = y > 8856e-6 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
      z = z > 8856e-6 ? z ** (1 / 3) : 7.787 * z + 16 / 116;
      const l = 116 * y - 16;
      const a = 500 * (x - y);
      const b = 200 * (y - z);
      return [l, a, b];
    };
    convert.hsl.rgb = function(hsl) {
      const h = hsl[0] / 360;
      const s = hsl[1] / 100;
      const l = hsl[2] / 100;
      let t2;
      let t3;
      let val;
      if (s === 0) {
        val = l * 255;
        return [val, val, val];
      }
      if (l < 0.5) {
        t2 = l * (1 + s);
      } else {
        t2 = l + s - l * s;
      }
      const t1 = 2 * l - t2;
      const rgb = [0, 0, 0];
      for (let i = 0; i < 3; i++) {
        t3 = h + 1 / 3 * -(i - 1);
        if (t3 < 0) {
          t3++;
        }
        if (t3 > 1) {
          t3--;
        }
        if (6 * t3 < 1) {
          val = t1 + (t2 - t1) * 6 * t3;
        } else if (2 * t3 < 1) {
          val = t2;
        } else if (3 * t3 < 2) {
          val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
        } else {
          val = t1;
        }
        rgb[i] = val * 255;
      }
      return rgb;
    };
    convert.hsl.hsv = function(hsl) {
      const h = hsl[0];
      let s = hsl[1] / 100;
      let l = hsl[2] / 100;
      let smin = s;
      const lmin = Math.max(l, 0.01);
      l *= 2;
      s *= l <= 1 ? l : 2 - l;
      smin *= lmin <= 1 ? lmin : 2 - lmin;
      const v = (l + s) / 2;
      const sv = l === 0 ? 2 * smin / (lmin + smin) : 2 * s / (l + s);
      return [h, sv * 100, v * 100];
    };
    convert.hsv.rgb = function(hsv) {
      const h = hsv[0] / 60;
      const s = hsv[1] / 100;
      let v = hsv[2] / 100;
      const hi = Math.floor(h) % 6;
      const f = h - Math.floor(h);
      const p = 255 * v * (1 - s);
      const q = 255 * v * (1 - s * f);
      const t = 255 * v * (1 - s * (1 - f));
      v *= 255;
      switch (hi) {
        case 0:
          return [v, t, p];
        case 1:
          return [q, v, p];
        case 2:
          return [p, v, t];
        case 3:
          return [p, q, v];
        case 4:
          return [t, p, v];
        case 5:
          return [v, p, q];
      }
    };
    convert.hsv.hsl = function(hsv) {
      const h = hsv[0];
      const s = hsv[1] / 100;
      const v = hsv[2] / 100;
      const vmin = Math.max(v, 0.01);
      let sl;
      let l;
      l = (2 - s) * v;
      const lmin = (2 - s) * vmin;
      sl = s * vmin;
      sl /= lmin <= 1 ? lmin : 2 - lmin;
      sl = sl || 0;
      l /= 2;
      return [h, sl * 100, l * 100];
    };
    convert.hwb.rgb = function(hwb) {
      const h = hwb[0] / 360;
      let wh = hwb[1] / 100;
      let bl = hwb[2] / 100;
      const ratio = wh + bl;
      let f;
      if (ratio > 1) {
        wh /= ratio;
        bl /= ratio;
      }
      const i = Math.floor(6 * h);
      const v = 1 - bl;
      f = 6 * h - i;
      if ((i & 1) !== 0) {
        f = 1 - f;
      }
      const n = wh + f * (v - wh);
      let r;
      let g;
      let b;
      switch (i) {
        default:
        case 6:
        case 0:
          r = v;
          g = n;
          b = wh;
          break;
        case 1:
          r = n;
          g = v;
          b = wh;
          break;
        case 2:
          r = wh;
          g = v;
          b = n;
          break;
        case 3:
          r = wh;
          g = n;
          b = v;
          break;
        case 4:
          r = n;
          g = wh;
          b = v;
          break;
        case 5:
          r = v;
          g = wh;
          b = n;
          break;
      }
      return [r * 255, g * 255, b * 255];
    };
    convert.cmyk.rgb = function(cmyk) {
      const c = cmyk[0] / 100;
      const m = cmyk[1] / 100;
      const y = cmyk[2] / 100;
      const k = cmyk[3] / 100;
      const r = 1 - Math.min(1, c * (1 - k) + k);
      const g = 1 - Math.min(1, m * (1 - k) + k);
      const b = 1 - Math.min(1, y * (1 - k) + k);
      return [r * 255, g * 255, b * 255];
    };
    convert.xyz.rgb = function(xyz) {
      const x = xyz[0] / 100;
      const y = xyz[1] / 100;
      const z = xyz[2] / 100;
      let r;
      let g;
      let b;
      r = x * 3.2406 + y * -1.5372 + z * -0.4986;
      g = x * -0.9689 + y * 1.8758 + z * 0.0415;
      b = x * 0.0557 + y * -0.204 + z * 1.057;
      r = r > 31308e-7 ? 1.055 * r ** (1 / 2.4) - 0.055 : r * 12.92;
      g = g > 31308e-7 ? 1.055 * g ** (1 / 2.4) - 0.055 : g * 12.92;
      b = b > 31308e-7 ? 1.055 * b ** (1 / 2.4) - 0.055 : b * 12.92;
      r = Math.min(Math.max(0, r), 1);
      g = Math.min(Math.max(0, g), 1);
      b = Math.min(Math.max(0, b), 1);
      return [r * 255, g * 255, b * 255];
    };
    convert.xyz.lab = function(xyz) {
      let x = xyz[0];
      let y = xyz[1];
      let z = xyz[2];
      x /= 95.047;
      y /= 100;
      z /= 108.883;
      x = x > 8856e-6 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
      y = y > 8856e-6 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
      z = z > 8856e-6 ? z ** (1 / 3) : 7.787 * z + 16 / 116;
      const l = 116 * y - 16;
      const a = 500 * (x - y);
      const b = 200 * (y - z);
      return [l, a, b];
    };
    convert.lab.xyz = function(lab) {
      const l = lab[0];
      const a = lab[1];
      const b = lab[2];
      let x;
      let y;
      let z;
      y = (l + 16) / 116;
      x = a / 500 + y;
      z = y - b / 200;
      const y2 = y ** 3;
      const x2 = x ** 3;
      const z2 = z ** 3;
      y = y2 > 8856e-6 ? y2 : (y - 16 / 116) / 7.787;
      x = x2 > 8856e-6 ? x2 : (x - 16 / 116) / 7.787;
      z = z2 > 8856e-6 ? z2 : (z - 16 / 116) / 7.787;
      x *= 95.047;
      y *= 100;
      z *= 108.883;
      return [x, y, z];
    };
    convert.lab.lch = function(lab) {
      const l = lab[0];
      const a = lab[1];
      const b = lab[2];
      let h;
      const hr = Math.atan2(b, a);
      h = hr * 360 / 2 / Math.PI;
      if (h < 0) {
        h += 360;
      }
      const c = Math.sqrt(a * a + b * b);
      return [l, c, h];
    };
    convert.lch.lab = function(lch) {
      const l = lch[0];
      const c = lch[1];
      const h = lch[2];
      const hr = h / 360 * 2 * Math.PI;
      const a = c * Math.cos(hr);
      const b = c * Math.sin(hr);
      return [l, a, b];
    };
    convert.rgb.ansi16 = function(args, saturation = null) {
      const [r, g, b] = args;
      let value = saturation === null ? convert.rgb.hsv(args)[2] : saturation;
      value = Math.round(value / 50);
      if (value === 0) {
        return 30;
      }
      let ansi = 30 + (Math.round(b / 255) << 2 | Math.round(g / 255) << 1 | Math.round(r / 255));
      if (value === 2) {
        ansi += 60;
      }
      return ansi;
    };
    convert.hsv.ansi16 = function(args) {
      return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
    };
    convert.rgb.ansi256 = function(args) {
      const r = args[0];
      const g = args[1];
      const b = args[2];
      if (r === g && g === b) {
        if (r < 8) {
          return 16;
        }
        if (r > 248) {
          return 231;
        }
        return Math.round((r - 8) / 247 * 24) + 232;
      }
      const ansi = 16 + 36 * Math.round(r / 255 * 5) + 6 * Math.round(g / 255 * 5) + Math.round(b / 255 * 5);
      return ansi;
    };
    convert.ansi16.rgb = function(args) {
      let color = args % 10;
      if (color === 0 || color === 7) {
        if (args > 50) {
          color += 3.5;
        }
        color = color / 10.5 * 255;
        return [color, color, color];
      }
      const mult = (~~(args > 50) + 1) * 0.5;
      const r = (color & 1) * mult * 255;
      const g = (color >> 1 & 1) * mult * 255;
      const b = (color >> 2 & 1) * mult * 255;
      return [r, g, b];
    };
    convert.ansi256.rgb = function(args) {
      if (args >= 232) {
        const c = (args - 232) * 10 + 8;
        return [c, c, c];
      }
      args -= 16;
      let rem;
      const r = Math.floor(args / 36) / 5 * 255;
      const g = Math.floor((rem = args % 36) / 6) / 5 * 255;
      const b = rem % 6 / 5 * 255;
      return [r, g, b];
    };
    convert.rgb.hex = function(args) {
      const integer = ((Math.round(args[0]) & 255) << 16) + ((Math.round(args[1]) & 255) << 8) + (Math.round(args[2]) & 255);
      const string = integer.toString(16).toUpperCase();
      return "000000".substring(string.length) + string;
    };
    convert.hex.rgb = function(args) {
      const match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
      if (!match) {
        return [0, 0, 0];
      }
      let colorString = match[0];
      if (match[0].length === 3) {
        colorString = colorString.split("").map((char) => {
          return char + char;
        }).join("");
      }
      const integer = parseInt(colorString, 16);
      const r = integer >> 16 & 255;
      const g = integer >> 8 & 255;
      const b = integer & 255;
      return [r, g, b];
    };
    convert.rgb.hcg = function(rgb) {
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const max = Math.max(Math.max(r, g), b);
      const min = Math.min(Math.min(r, g), b);
      const chroma = max - min;
      let grayscale;
      let hue;
      if (chroma < 1) {
        grayscale = min / (1 - chroma);
      } else {
        grayscale = 0;
      }
      if (chroma <= 0) {
        hue = 0;
      } else if (max === r) {
        hue = (g - b) / chroma % 6;
      } else if (max === g) {
        hue = 2 + (b - r) / chroma;
      } else {
        hue = 4 + (r - g) / chroma;
      }
      hue /= 6;
      hue %= 1;
      return [hue * 360, chroma * 100, grayscale * 100];
    };
    convert.hsl.hcg = function(hsl) {
      const s = hsl[1] / 100;
      const l = hsl[2] / 100;
      const c = l < 0.5 ? 2 * s * l : 2 * s * (1 - l);
      let f = 0;
      if (c < 1) {
        f = (l - 0.5 * c) / (1 - c);
      }
      return [hsl[0], c * 100, f * 100];
    };
    convert.hsv.hcg = function(hsv) {
      const s = hsv[1] / 100;
      const v = hsv[2] / 100;
      const c = s * v;
      let f = 0;
      if (c < 1) {
        f = (v - c) / (1 - c);
      }
      return [hsv[0], c * 100, f * 100];
    };
    convert.hcg.rgb = function(hcg) {
      const h = hcg[0] / 360;
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      if (c === 0) {
        return [g * 255, g * 255, g * 255];
      }
      const pure = [0, 0, 0];
      const hi = h % 1 * 6;
      const v = hi % 1;
      const w = 1 - v;
      let mg = 0;
      switch (Math.floor(hi)) {
        case 0:
          pure[0] = 1;
          pure[1] = v;
          pure[2] = 0;
          break;
        case 1:
          pure[0] = w;
          pure[1] = 1;
          pure[2] = 0;
          break;
        case 2:
          pure[0] = 0;
          pure[1] = 1;
          pure[2] = v;
          break;
        case 3:
          pure[0] = 0;
          pure[1] = w;
          pure[2] = 1;
          break;
        case 4:
          pure[0] = v;
          pure[1] = 0;
          pure[2] = 1;
          break;
        default:
          pure[0] = 1;
          pure[1] = 0;
          pure[2] = w;
      }
      mg = (1 - c) * g;
      return [
        (c * pure[0] + mg) * 255,
        (c * pure[1] + mg) * 255,
        (c * pure[2] + mg) * 255
      ];
    };
    convert.hcg.hsv = function(hcg) {
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      const v = c + g * (1 - c);
      let f = 0;
      if (v > 0) {
        f = c / v;
      }
      return [hcg[0], f * 100, v * 100];
    };
    convert.hcg.hsl = function(hcg) {
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      const l = g * (1 - c) + 0.5 * c;
      let s = 0;
      if (l > 0 && l < 0.5) {
        s = c / (2 * l);
      } else if (l >= 0.5 && l < 1) {
        s = c / (2 * (1 - l));
      }
      return [hcg[0], s * 100, l * 100];
    };
    convert.hcg.hwb = function(hcg) {
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      const v = c + g * (1 - c);
      return [hcg[0], (v - c) * 100, (1 - v) * 100];
    };
    convert.hwb.hcg = function(hwb) {
      const w = hwb[1] / 100;
      const b = hwb[2] / 100;
      const v = 1 - b;
      const c = v - w;
      let g = 0;
      if (c < 1) {
        g = (v - c) / (1 - c);
      }
      return [hwb[0], c * 100, g * 100];
    };
    convert.apple.rgb = function(apple) {
      return [apple[0] / 65535 * 255, apple[1] / 65535 * 255, apple[2] / 65535 * 255];
    };
    convert.rgb.apple = function(rgb) {
      return [rgb[0] / 255 * 65535, rgb[1] / 255 * 65535, rgb[2] / 255 * 65535];
    };
    convert.gray.rgb = function(args) {
      return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
    };
    convert.gray.hsl = function(args) {
      return [0, 0, args[0]];
    };
    convert.gray.hsv = convert.gray.hsl;
    convert.gray.hwb = function(gray) {
      return [0, 100, gray[0]];
    };
    convert.gray.cmyk = function(gray) {
      return [0, 0, 0, gray[0]];
    };
    convert.gray.lab = function(gray) {
      return [gray[0], 0, 0];
    };
    convert.gray.hex = function(gray) {
      const val = Math.round(gray[0] / 100 * 255) & 255;
      const integer = (val << 16) + (val << 8) + val;
      const string = integer.toString(16).toUpperCase();
      return "000000".substring(string.length) + string;
    };
    convert.rgb.gray = function(rgb) {
      const val = (rgb[0] + rgb[1] + rgb[2]) / 3;
      return [val / 255 * 100];
    };
  }
});

// node_modules/color-convert/route.cjs
var require_route = __commonJS({
  "node_modules/color-convert/route.cjs"(exports2, module2) {
    var conversions = require_conversions();
    function buildGraph() {
      const graph = {};
      const models = Object.keys(conversions);
      for (let len = models.length, i = 0; i < len; i++) {
        graph[models[i]] = {
          // http://jsperf.com/1-vs-infinity
          // micro-opt, but this is simple.
          distance: -1,
          parent: null
        };
      }
      return graph;
    }
    function deriveBFS(fromModel) {
      const graph = buildGraph();
      const queue = [fromModel];
      graph[fromModel].distance = 0;
      while (queue.length) {
        const current = queue.pop();
        const adjacents = Object.keys(conversions[current]);
        for (let len = adjacents.length, i = 0; i < len; i++) {
          const adjacent = adjacents[i];
          const node = graph[adjacent];
          if (node.distance === -1) {
            node.distance = graph[current].distance + 1;
            node.parent = current;
            queue.unshift(adjacent);
          }
        }
      }
      return graph;
    }
    function link(from, to) {
      return function(args) {
        return to(from(args));
      };
    }
    function wrapConversion(toModel, graph) {
      const path = [graph[toModel].parent, toModel];
      let fn = conversions[graph[toModel].parent][toModel];
      let cur = graph[toModel].parent;
      while (graph[cur].parent) {
        path.unshift(graph[cur].parent);
        fn = link(conversions[graph[cur].parent][cur], fn);
        cur = graph[cur].parent;
      }
      fn.conversion = path;
      return fn;
    }
    module2.exports = function(fromModel) {
      const graph = deriveBFS(fromModel);
      const conversion = {};
      const models = Object.keys(graph);
      for (let len = models.length, i = 0; i < len; i++) {
        const toModel = models[i];
        const node = graph[toModel];
        if (node.parent === null) {
          continue;
        }
        conversion[toModel] = wrapConversion(toModel, graph);
      }
      return conversion;
    };
  }
});

// node_modules/color-convert/index.cjs
var require_color_convert = __commonJS({
  "node_modules/color-convert/index.cjs"(exports2, module2) {
    var conversions = require_conversions();
    var route = require_route();
    var convert = {};
    var models = Object.keys(conversions);
    function wrapRaw(fn) {
      const wrappedFn = function(...args) {
        const arg0 = args[0];
        if (arg0 === void 0 || arg0 === null) {
          return arg0;
        }
        if (arg0.length > 1) {
          args = arg0;
        }
        return fn(args);
      };
      if ("conversion" in fn) {
        wrappedFn.conversion = fn.conversion;
      }
      return wrappedFn;
    }
    function wrapRounded(fn) {
      const wrappedFn = function(...args) {
        const arg0 = args[0];
        if (arg0 === void 0 || arg0 === null) {
          return arg0;
        }
        if (arg0.length > 1) {
          args = arg0;
        }
        const result = fn(args);
        if (typeof result === "object") {
          for (let len = result.length, i = 0; i < len; i++) {
            result[i] = Math.round(result[i]);
          }
        }
        return result;
      };
      if ("conversion" in fn) {
        wrappedFn.conversion = fn.conversion;
      }
      return wrappedFn;
    }
    models.forEach((fromModel) => {
      convert[fromModel] = {};
      Object.defineProperty(convert[fromModel], "channels", { value: conversions[fromModel].channels });
      Object.defineProperty(convert[fromModel], "labels", { value: conversions[fromModel].labels });
      const routes = route(fromModel);
      const routeModels = Object.keys(routes);
      routeModels.forEach((toModel) => {
        const fn = routes[toModel];
        convert[fromModel][toModel] = wrapRounded(fn);
        convert[fromModel][toModel].raw = wrapRaw(fn);
      });
    });
    module2.exports = convert;
  }
});

// node_modules/ansi-styles/index.cjs
var require_ansi_styles = __commonJS({
  "node_modules/ansi-styles/index.cjs"(exports2, module2) {
    "use strict";
    var wrapAnsi16 = (fn, offset) => (...args) => {
      const code = fn(...args);
      return `\x1B[${code + offset}m`;
    };
    var wrapAnsi256 = (fn, offset) => (...args) => {
      const code = fn(...args);
      return `\x1B[${38 + offset};5;${code}m`;
    };
    var wrapAnsi16m = (fn, offset) => (...args) => {
      const rgb = fn(...args);
      return `\x1B[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
    };
    var ansi2ansi = (n) => n;
    var rgb2rgb = (r, g, b) => [r, g, b];
    var setLazyProperty = (object, property, get) => {
      Object.defineProperty(object, property, {
        get: () => {
          const value = get();
          Object.defineProperty(object, property, {
            value,
            enumerable: true,
            configurable: true
          });
          return value;
        },
        enumerable: true,
        configurable: true
      });
    };
    var colorConvert;
    var makeDynamicStyles = (wrap, targetSpace, identity, isBackground) => {
      if (colorConvert === void 0) {
        colorConvert = require_color_convert();
      }
      const offset = isBackground ? 10 : 0;
      const styles = {};
      for (const [sourceSpace, suite] of Object.entries(colorConvert)) {
        const name = sourceSpace === "ansi16" ? "ansi" : sourceSpace;
        if (sourceSpace === targetSpace) {
          styles[name] = wrap(identity, offset);
        } else if (typeof suite === "object") {
          styles[name] = wrap(suite[targetSpace], offset);
        }
      }
      return styles;
    };
    function assembleStyles() {
      const codes = /* @__PURE__ */ new Map();
      const styles = {
        modifier: {
          reset: [0, 0],
          // 21 isn't widely supported and 22 does the same thing
          bold: [1, 22],
          dim: [2, 22],
          italic: [3, 23],
          underline: [4, 24],
          inverse: [7, 27],
          hidden: [8, 28],
          strikethrough: [9, 29]
        },
        color: {
          black: [30, 39],
          red: [31, 39],
          green: [32, 39],
          yellow: [33, 39],
          blue: [34, 39],
          magenta: [35, 39],
          cyan: [36, 39],
          white: [37, 39],
          // Bright color
          blackBright: [90, 39],
          redBright: [91, 39],
          greenBright: [92, 39],
          yellowBright: [93, 39],
          blueBright: [94, 39],
          magentaBright: [95, 39],
          cyanBright: [96, 39],
          whiteBright: [97, 39]
        },
        bgColor: {
          bgBlack: [40, 49],
          bgRed: [41, 49],
          bgGreen: [42, 49],
          bgYellow: [43, 49],
          bgBlue: [44, 49],
          bgMagenta: [45, 49],
          bgCyan: [46, 49],
          bgWhite: [47, 49],
          // Bright color
          bgBlackBright: [100, 49],
          bgRedBright: [101, 49],
          bgGreenBright: [102, 49],
          bgYellowBright: [103, 49],
          bgBlueBright: [104, 49],
          bgMagentaBright: [105, 49],
          bgCyanBright: [106, 49],
          bgWhiteBright: [107, 49]
        }
      };
      styles.color.gray = styles.color.blackBright;
      styles.bgColor.bgGray = styles.bgColor.bgBlackBright;
      styles.color.grey = styles.color.blackBright;
      styles.bgColor.bgGrey = styles.bgColor.bgBlackBright;
      for (const [groupName, group] of Object.entries(styles)) {
        for (const [styleName, style] of Object.entries(group)) {
          styles[styleName] = {
            open: `\x1B[${style[0]}m`,
            close: `\x1B[${style[1]}m`
          };
          group[styleName] = styles[styleName];
          codes.set(style[0], style[1]);
        }
        Object.defineProperty(styles, groupName, {
          value: group,
          enumerable: false
        });
      }
      Object.defineProperty(styles, "codes", {
        value: codes,
        enumerable: false
      });
      styles.color.close = "\x1B[39m";
      styles.bgColor.close = "\x1B[49m";
      setLazyProperty(styles.color, "ansi", () => makeDynamicStyles(wrapAnsi16, "ansi16", ansi2ansi, false));
      setLazyProperty(styles.color, "ansi256", () => makeDynamicStyles(wrapAnsi256, "ansi256", ansi2ansi, false));
      setLazyProperty(styles.color, "ansi16m", () => makeDynamicStyles(wrapAnsi16m, "rgb", rgb2rgb, false));
      setLazyProperty(styles.bgColor, "ansi", () => makeDynamicStyles(wrapAnsi16, "ansi16", ansi2ansi, true));
      setLazyProperty(styles.bgColor, "ansi256", () => makeDynamicStyles(wrapAnsi256, "ansi256", ansi2ansi, true));
      setLazyProperty(styles.bgColor, "ansi16m", () => makeDynamicStyles(wrapAnsi16m, "rgb", rgb2rgb, true));
      return styles;
    }
    Object.defineProperty(module2, "exports", {
      enumerable: true,
      get: assembleStyles
    });
  }
});

// node_modules/has-flag/index.cjs
var require_has_flag = __commonJS({
  "node_modules/has-flag/index.cjs"(exports2, module2) {
    "use strict";
    module2.exports = (flag, argv = process.argv) => {
      const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
      const position = argv.indexOf(prefix + flag);
      const terminatorPosition = argv.indexOf("--");
      return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
    };
  }
});

// node_modules/supports-color/index.cjs
var require_supports_color = __commonJS({
  "node_modules/supports-color/index.cjs"(exports2, module2) {
    "use strict";
    var os = require("os");
    var tty = require("tty");
    var hasFlag = require_has_flag();
    var { env } = process;
    var forceColor;
    if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
      forceColor = 0;
    } else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
      forceColor = 1;
    }
    if ("FORCE_COLOR" in env) {
      if (env.FORCE_COLOR === "true") {
        forceColor = 1;
      } else if (env.FORCE_COLOR === "false") {
        forceColor = 0;
      } else {
        forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
      }
    }
    function translateLevel(level) {
      if (level === 0) {
        return false;
      }
      return {
        level,
        hasBasic: true,
        has256: level >= 2,
        has16m: level >= 3
      };
    }
    function supportsColor(haveStream, streamIsTTY) {
      if (forceColor === 0) {
        return 0;
      }
      if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
        return 3;
      }
      if (hasFlag("color=256")) {
        return 2;
      }
      if (haveStream && !streamIsTTY && forceColor === void 0) {
        return 0;
      }
      const min = forceColor || 0;
      if (env.TERM === "dumb") {
        return min;
      }
      if (process.platform === "win32") {
        const osRelease = os.release().split(".");
        if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
          return Number(osRelease[2]) >= 14931 ? 3 : 2;
        }
        return 1;
      }
      if ("CI" in env) {
        if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((sign) => sign in env) || env.CI_NAME === "codeship") {
          return 1;
        }
        return min;
      }
      if ("TEAMCITY_VERSION" in env) {
        return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
      }
      if (env.COLORTERM === "truecolor") {
        return 3;
      }
      if ("TERM_PROGRAM" in env) {
        const version = parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
        switch (env.TERM_PROGRAM) {
          case "iTerm.app":
            return version >= 3 ? 3 : 2;
          case "Apple_Terminal":
            return 2;
        }
      }
      if (/-256(color)?$/i.test(env.TERM)) {
        return 2;
      }
      if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
        return 1;
      }
      if ("COLORTERM" in env) {
        return 1;
      }
      return min;
    }
    function getSupportLevel(stream) {
      const level = supportsColor(stream, stream && stream.isTTY);
      return translateLevel(level);
    }
    module2.exports = {
      supportsColor: getSupportLevel,
      stdout: translateLevel(supportsColor(true, tty.isatty(1))),
      stderr: translateLevel(supportsColor(true, tty.isatty(2)))
    };
  }
});

// node_modules/chalk/source/util.cjs
var require_util = __commonJS({
  "node_modules/chalk/source/util.cjs"(exports2, module2) {
    "use strict";
    var stringReplaceAll = (string, substring, replacer) => {
      let index = string.indexOf(substring);
      if (index === -1) {
        return string;
      }
      const substringLength = substring.length;
      let endIndex = 0;
      let returnValue = "";
      do {
        returnValue += string.substr(endIndex, index - endIndex) + substring + replacer;
        endIndex = index + substringLength;
        index = string.indexOf(substring, endIndex);
      } while (index !== -1);
      returnValue += string.substr(endIndex);
      return returnValue;
    };
    var stringEncaseCRLFWithFirstIndex = (string, prefix, postfix, index) => {
      let endIndex = 0;
      let returnValue = "";
      do {
        const gotCR = string[index - 1] === "\r";
        returnValue += string.substr(endIndex, (gotCR ? index - 1 : index) - endIndex) + prefix + (gotCR ? "\r\n" : "\n") + postfix;
        endIndex = index + 1;
        index = string.indexOf("\n", endIndex);
      } while (index !== -1);
      returnValue += string.substr(endIndex);
      return returnValue;
    };
    module2.exports = {
      stringReplaceAll,
      stringEncaseCRLFWithFirstIndex
    };
  }
});

// node_modules/chalk/source/templates.cjs
var require_templates = __commonJS({
  "node_modules/chalk/source/templates.cjs"(exports2, module2) {
    "use strict";
    var TEMPLATE_REGEX = /(?:\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi;
    var STYLE_REGEX = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g;
    var STRING_REGEX = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/;
    var ESCAPE_REGEX = /\\(u(?:[a-f\d]{4}|{[a-f\d]{1,6}})|x[a-f\d]{2}|.)|([^\\])/gi;
    var ESCAPES = /* @__PURE__ */ new Map([
      ["n", "\n"],
      ["r", "\r"],
      ["t", "	"],
      ["b", "\b"],
      ["f", "\f"],
      ["v", "\v"],
      ["0", "\0"],
      ["\\", "\\"],
      ["e", "\x1B"],
      ["a", "\x07"]
    ]);
    function unescape(c) {
      const u = c[0] === "u";
      const bracket = c[1] === "{";
      if (u && !bracket && c.length === 5 || c[0] === "x" && c.length === 3) {
        return String.fromCharCode(parseInt(c.slice(1), 16));
      }
      if (u && bracket) {
        return String.fromCodePoint(parseInt(c.slice(2, -1), 16));
      }
      return ESCAPES.get(c) || c;
    }
    function parseArguments(name, arguments_) {
      const results = [];
      const chunks = arguments_.trim().split(/\s*,\s*/g);
      let matches;
      for (const chunk of chunks) {
        const number = Number(chunk);
        if (!Number.isNaN(number)) {
          results.push(number);
        } else if (matches = chunk.match(STRING_REGEX)) {
          results.push(matches[2].replace(ESCAPE_REGEX, (m, escape, character) => escape ? unescape(escape) : character));
        } else {
          throw new Error(`Invalid Chalk template style argument: ${chunk} (in style '${name}')`);
        }
      }
      return results;
    }
    function parseStyle(style) {
      STYLE_REGEX.lastIndex = 0;
      const results = [];
      let matches;
      while ((matches = STYLE_REGEX.exec(style)) !== null) {
        const name = matches[1];
        if (matches[2]) {
          const args = parseArguments(name, matches[2]);
          results.push([name].concat(args));
        } else {
          results.push([name]);
        }
      }
      return results;
    }
    function buildStyle(chalk3, styles) {
      const enabled = {};
      for (const layer of styles) {
        for (const style of layer.styles) {
          enabled[style[0]] = layer.inverse ? null : style.slice(1);
        }
      }
      let current = chalk3;
      for (const [styleName, styles2] of Object.entries(enabled)) {
        if (!Array.isArray(styles2)) {
          continue;
        }
        if (!(styleName in current)) {
          throw new Error(`Unknown Chalk style: ${styleName}`);
        }
        current = styles2.length > 0 ? current[styleName](...styles2) : current[styleName];
      }
      return current;
    }
    module2.exports = (chalk3, temporary) => {
      const styles = [];
      const chunks = [];
      let chunk = [];
      temporary.replace(TEMPLATE_REGEX, (m, escapeCharacter, inverse, style, close, character) => {
        if (escapeCharacter) {
          chunk.push(unescape(escapeCharacter));
        } else if (style) {
          const string = chunk.join("");
          chunk = [];
          chunks.push(styles.length === 0 ? string : buildStyle(chalk3, styles)(string));
          styles.push({ inverse, styles: parseStyle(style) });
        } else if (close) {
          if (styles.length === 0) {
            throw new Error("Found extraneous } in Chalk template literal");
          }
          chunks.push(buildStyle(chalk3, styles)(chunk.join("")));
          chunk = [];
          styles.pop();
        } else {
          chunk.push(character);
        }
      });
      chunks.push(chunk.join(""));
      if (styles.length > 0) {
        const errMessage = `Chalk template literal is missing ${styles.length} closing bracket${styles.length === 1 ? "" : "s"} (\`}\`)`;
        throw new Error(errMessage);
      }
      return chunks.join("");
    };
  }
});

// node_modules/chalk/source/index.cjs
var require_source = __commonJS({
  "node_modules/chalk/source/index.cjs"(exports2, module2) {
    "use strict";
    var ansiStyles = require_ansi_styles();
    var { stdout: stdoutColor, stderr: stderrColor } = require_supports_color();
    var {
      stringReplaceAll,
      stringEncaseCRLFWithFirstIndex
    } = require_util();
    var { isArray } = Array;
    var levelMapping = [
      "ansi",
      "ansi",
      "ansi256",
      "ansi16m"
    ];
    var styles = /* @__PURE__ */ Object.create(null);
    var applyOptions = (object, options = {}) => {
      if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
        throw new Error("The `level` option should be an integer from 0 to 3");
      }
      const colorLevel = stdoutColor ? stdoutColor.level : 0;
      object.level = options.level === void 0 ? colorLevel : options.level;
    };
    var ChalkClass = class {
      constructor(options) {
        return chalkFactory(options);
      }
    };
    var chalkFactory = (options) => {
      const chalk4 = {};
      applyOptions(chalk4, options);
      chalk4.template = (...arguments_) => chalkTag(chalk4.template, ...arguments_);
      Object.setPrototypeOf(chalk4, Chalk.prototype);
      Object.setPrototypeOf(chalk4.template, chalk4);
      chalk4.template.constructor = () => {
        throw new Error("`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead.");
      };
      chalk4.template.Instance = ChalkClass;
      return chalk4.template;
    };
    function Chalk(options) {
      return chalkFactory(options);
    }
    for (const [styleName, style] of Object.entries(ansiStyles)) {
      styles[styleName] = {
        get() {
          const builder = createBuilder(this, createStyler(style.open, style.close, this._styler), this._isEmpty);
          Object.defineProperty(this, styleName, { value: builder });
          return builder;
        }
      };
    }
    styles.visible = {
      get() {
        const builder = createBuilder(this, this._styler, true);
        Object.defineProperty(this, "visible", { value: builder });
        return builder;
      }
    };
    var usedModels = ["rgb", "hex", "keyword", "hsl", "hsv", "hwb", "ansi", "ansi256"];
    for (const model of usedModels) {
      styles[model] = {
        get() {
          const { level } = this;
          return function(...arguments_) {
            const styler = createStyler(ansiStyles.color[levelMapping[level]][model](...arguments_), ansiStyles.color.close, this._styler);
            return createBuilder(this, styler, this._isEmpty);
          };
        }
      };
    }
    for (const model of usedModels) {
      const bgModel = "bg" + model[0].toUpperCase() + model.slice(1);
      styles[bgModel] = {
        get() {
          const { level } = this;
          return function(...arguments_) {
            const styler = createStyler(ansiStyles.bgColor[levelMapping[level]][model](...arguments_), ansiStyles.bgColor.close, this._styler);
            return createBuilder(this, styler, this._isEmpty);
          };
        }
      };
    }
    var proto = Object.defineProperties(() => {
    }, {
      ...styles,
      level: {
        enumerable: true,
        get() {
          return this._generator.level;
        },
        set(level) {
          this._generator.level = level;
        }
      }
    });
    var createStyler = (open, close, parent) => {
      let openAll;
      let closeAll;
      if (parent === void 0) {
        openAll = open;
        closeAll = close;
      } else {
        openAll = parent.openAll + open;
        closeAll = close + parent.closeAll;
      }
      return {
        open,
        close,
        openAll,
        closeAll,
        parent
      };
    };
    var createBuilder = (self, _styler, _isEmpty) => {
      const builder = (...arguments_) => {
        if (isArray(arguments_[0]) && isArray(arguments_[0].raw)) {
          return applyStyle(builder, chalkTag(builder, ...arguments_));
        }
        return applyStyle(builder, arguments_.length === 1 ? "" + arguments_[0] : arguments_.join(" "));
      };
      Object.setPrototypeOf(builder, proto);
      builder._generator = self;
      builder._styler = _styler;
      builder._isEmpty = _isEmpty;
      return builder;
    };
    var applyStyle = (self, string) => {
      if (self.level <= 0 || !string) {
        return self._isEmpty ? "" : string;
      }
      let styler = self._styler;
      if (styler === void 0) {
        return string;
      }
      const { openAll, closeAll } = styler;
      if (string.indexOf("\x1B") !== -1) {
        while (styler !== void 0) {
          string = stringReplaceAll(string, styler.close, styler.open);
          styler = styler.parent;
        }
      }
      const lfIndex = string.indexOf("\n");
      if (lfIndex !== -1) {
        string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
      }
      return openAll + string + closeAll;
    };
    var template;
    var chalkTag = (chalk4, ...strings) => {
      const [firstString] = strings;
      if (!isArray(firstString) || !isArray(firstString.raw)) {
        return strings.join(" ");
      }
      const arguments_ = strings.slice(1);
      const parts = [firstString.raw[0]];
      for (let i = 1; i < firstString.length; i++) {
        parts.push(
          String(arguments_[i - 1]).replace(/[{}\\]/g, "\\$&"),
          String(firstString.raw[i])
        );
      }
      if (template === void 0) {
        template = require_templates();
      }
      return template(chalk4, parts.join(""));
    };
    Object.defineProperties(Chalk.prototype, styles);
    var chalk3 = Chalk();
    chalk3.supportsColor = stdoutColor;
    chalk3.stderr = Chalk({ level: stderrColor ? stderrColor.level : 0 });
    chalk3.stderr.supportsColor = stderrColor;
    module2.exports = chalk3;
  }
});

// src/modules/handlers/mutation-handler.ts
var mutation_handler_exports = {};
__export(mutation_handler_exports, {
  mutationsHandler: () => mutationsHandler
});
module.exports = __toCommonJS(mutation_handler_exports);

// node_modules/change-case/dist/index.cjs
var SPLIT_LOWER_UPPER_RE = new RegExp("([\\p{Ll}\\d])(\\p{Lu})", "gu");
var SPLIT_UPPER_UPPER_RE = new RegExp("(\\p{Lu})([\\p{Lu}][\\p{Ll}])", "gu");
var SPLIT_SEPARATE_NUMBER_RE = new RegExp("(\\d)\\p{Ll}|(\\p{L})\\d", "u");
var DEFAULT_STRIP_REGEXP = /[^\p{L}\d]+/giu;
var SPLIT_REPLACE_VALUE = "$1\0$2";
var DEFAULT_PREFIX_SUFFIX_CHARACTERS = "";
function split(value) {
  let result = value.trim();
  result = result.replace(SPLIT_LOWER_UPPER_RE, SPLIT_REPLACE_VALUE).replace(SPLIT_UPPER_UPPER_RE, SPLIT_REPLACE_VALUE);
  result = result.replace(DEFAULT_STRIP_REGEXP, "\0");
  let start = 0;
  let end = result.length;
  while (result.charAt(start) === "\0")
    start++;
  if (start === end)
    return [];
  while (result.charAt(end - 1) === "\0")
    end--;
  return result.slice(start, end).split(/\0/g);
}
function splitSeparateNumbers(value) {
  const words = split(value);
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const match = SPLIT_SEPARATE_NUMBER_RE.exec(word);
    if (match) {
      const offset = match.index + (match[1] ?? match[2]).length;
      words.splice(i, 1, word.slice(0, offset), word.slice(offset));
    }
  }
  return words;
}
function camelCase(input, options) {
  const [prefix, words, suffix] = splitPrefixSuffix(input, options);
  const lower = lowerFactory(options?.locale);
  const upper = upperFactory(options?.locale);
  const transform = options?.mergeAmbiguousCharacters ? capitalCaseTransformFactory(lower, upper) : pascalCaseTransformFactory(lower, upper);
  return prefix + words.map((word, index) => {
    if (index === 0)
      return lower(word);
    return transform(word, index);
  }).join(options?.delimiter ?? "") + suffix;
}
function pascalCase(input, options) {
  const [prefix, words, suffix] = splitPrefixSuffix(input, options);
  const lower = lowerFactory(options?.locale);
  const upper = upperFactory(options?.locale);
  const transform = options?.mergeAmbiguousCharacters ? capitalCaseTransformFactory(lower, upper) : pascalCaseTransformFactory(lower, upper);
  return prefix + words.map(transform).join(options?.delimiter ?? "") + suffix;
}
function constantCase(input, options) {
  const [prefix, words, suffix] = splitPrefixSuffix(input, options);
  return prefix + words.map(upperFactory(options?.locale)).join(options?.delimiter ?? "_") + suffix;
}
function lowerFactory(locale) {
  return locale === false ? (input) => input.toLowerCase() : (input) => input.toLocaleLowerCase(locale);
}
function upperFactory(locale) {
  return locale === false ? (input) => input.toUpperCase() : (input) => input.toLocaleUpperCase(locale);
}
function capitalCaseTransformFactory(lower, upper) {
  return (word) => `${upper(word[0])}${lower(word.slice(1))}`;
}
function pascalCaseTransformFactory(lower, upper) {
  return (word, index) => {
    const char0 = word[0];
    const initial = index > 0 && char0 >= "0" && char0 <= "9" ? "_" + char0 : upper(char0);
    return initial + lower(word.slice(1));
  };
}
function splitPrefixSuffix(input, options = {}) {
  const splitFn = options.split ?? (options.separateNumbers ? splitSeparateNumbers : split);
  const prefixCharacters = options.prefixCharacters ?? DEFAULT_PREFIX_SUFFIX_CHARACTERS;
  const suffixCharacters = options.suffixCharacters ?? DEFAULT_PREFIX_SUFFIX_CHARACTERS;
  let prefixIndex = 0;
  let suffixIndex = input.length;
  while (prefixIndex < input.length) {
    const char = input.charAt(prefixIndex);
    if (!prefixCharacters.includes(char))
      break;
    prefixIndex++;
  }
  while (suffixIndex > prefixIndex) {
    const index = suffixIndex - 1;
    const char = input.charAt(index);
    if (!suffixCharacters.includes(char))
      break;
    suffixIndex = index;
  }
  return [
    input.slice(0, prefixIndex),
    splitFn(input.slice(prefixIndex, suffixIndex)),
    input.slice(suffixIndex)
  ];
}

// src/modules/handler-registries/handler-registry.ts
var handlerResponse = (dsl) => {
  return {
    error: (error) => {
      return { dsl, error };
    },
    result: (result) => {
      return {
        dsl,
        result
      };
    }
  };
};
var PrismaQlHandlerRegistry = class {
  handlers = {};
  constructor(initialHandlers) {
    if (initialHandlers) {
      this.handlers = { ...initialHandlers };
    }
  }
  register(action, command, handler) {
    this.handlers[action + "_" + command] = handler;
  }
  execute(action, command, prismaState, dsl) {
    const handler = this.handlers[action + "_" + command];
    if (!handler) {
      throw new Error(`Handler for command "${command}" not found.`);
    }
    return handler(prismaState, dsl);
  }
};

// src/modules/prehandlers/mutation-handlers/add-enum.ts
var addEnum = (prismaState, data) => {
  const { args } = data;
  const response = handlerResponse(data);
  const enumName = (args?.enums || [])[0];
  if (!enumName.length) {
    return response.error("No enum name provided. Example: 'ADD ENUM ->[EnumName] ({A|B|C});'");
  }
  if (!data.prismaBlock) {
    return response.error("No enum block provided. Example: 'ADD ENUM EnumName ->[({A|B|C})];'");
  }
  let keys = [];
  if (data.prismaBlock) {
    keys = data.prismaBlock.split(/\s+/).map((key) => constantCase(key));
  }
  if (!keys.length) {
    return response.error("No enum options provided. Example: 'ADD ENUM EnumName ({ ->[A|B|C] });'");
  }
  try {
    const builder = prismaState.builder;
    const prevEnum = builder.findByType("enum", { name: enumName });
    if (prevEnum) {
      return response.error(`Enum ${enumName} already exists`);
    }
    builder.enum(enumName, keys);
    return response.result(`Enum ${enumName} added successfully!`);
  } catch (error) {
    return response.error(`Error adding enum: ${error.message}`);
  }
};

// src/modules/prehandlers/mutation-handlers/add-field.ts
var import_prisma_ast = require("@mrleebo/prisma-ast");

// src/modules/utils/schema-helper.ts
function parseFieldForBuilder(prop) {
  if (prop.type !== "field") return null;
  const { name, fieldType, array, optional, attributes } = prop;
  if (typeof name !== "string" || typeof fieldType !== "string") return null;
  if (attributes?.some((attr) => attr.name === "relation")) return null;
  let prismaFieldType = fieldType;
  if (optional) prismaFieldType += "?";
  if (array) prismaFieldType += "[]";
  const parsedAttributes = [];
  for (const attr of attributes || []) {
    let attrArgs = attr.args?.map((arg) => arg.value) || [];
    parsedAttributes.push({ name: attr.name, args: attrArgs });
  }
  return {
    name,
    fieldType: prismaFieldType,
    attributes: parsedAttributes,
    sourceType: fieldType
  };
}
var PrismaQlSchemaHelper = class {
  parsedSchema;
  constructor(parsedSchema) {
    this.parsedSchema = parsedSchema;
  }
  getModels(names) {
    const models = this.parsedSchema.list.filter((item) => item.type === "model");
    if (names?.length) {
      return models.filter((model) => names.includes(model.name));
    }
    return models;
  }
  getModelByName(name) {
    return this.getModels().find((model) => model.name === name);
  }
  getFieldByName(modelName, fieldName) {
    const model = this.getModelByName(modelName);
    if (!model) return void 0;
    return model.properties.find((prop) => prop.type === "field" && prop.name === fieldName);
  }
  getFields(modelName) {
    const model = this.getModelByName(modelName);
    if (!model) return [];
    return model.properties.filter((prop) => prop.type === "field");
  }
  getIdFieldTypeModel(modelName) {
    const model = this.getModelByName(modelName);
    if (!model) return void 0;
    const idField = model.properties.find((prop) => prop.type === "field" && prop?.attributes?.some((attr) => attr.name === "id"));
    return idField?.fieldType;
  }
  getEnums() {
    return this.parsedSchema.list.filter((item) => item.type === "enum");
  }
  getEnumByName(name) {
    return this.getEnums().find((enumItem) => enumItem.name === name);
  }
  getEnumRelations(enumName) {
    const models = this.getModels();
    return models.filter((model) => {
      return model.properties.some((prop) => {
        return prop.type === "field" && prop.fieldType === enumName;
      });
    }).map((model) => {
      const field = model.properties.find((prop) => {
        return prop.type === "field" && prop.fieldType === enumName;
      });
      return {
        model,
        field
      };
    });
  }
  getRelations() {
    return this.getModels().flatMap((model) => model.properties).filter((prop) => prop.type === "field" && prop.fieldType === "relation");
  }
  getGenerators() {
    return this.parsedSchema.list.filter((item) => item.type === "generator");
  }
  getModelRelations(modelName) {
    const model = this.getModelByName(modelName);
    if (!model) return [];
    return model.properties.filter(
      (prop) => prop.type === "field" && prop.fieldType === "relation"
    );
  }
};
var useHelper = (schema) => {
  return new PrismaQlSchemaHelper("type" in schema ? schema : schema.ast);
};

// src/modules/prehandlers/mutation-handlers/add-field.ts
var addField = (prismaState, data) => {
  const response = handlerResponse(data);
  const { args } = data;
  if (!args?.fields || !args.fields.length) {
    return response.error("No fields provided. Example: 'ADD FIELD -> [FieldName] TO [ModelName] ({String @default('123')})'");
  }
  if (!args?.models || !args.models.length) {
    return response.error("No model name provided. Example: 'ADD FIELD [FieldName] TO -> [ModelName] ({String @default('123')})'");
  }
  const modelName = args.models[0];
  const model = prismaState.builder.findByType("model", { name: modelName });
  if (!model) {
    return response.error(`Model ${modelName} not found. Please ensure the model name is correct.`);
  }
  const fieldName = args.fields[0];
  if (!data.prismaBlock) {
    return response.error("No field type provided. Example: 'ADD FIELD [FieldName] TO [ModelName] -> ({String @default('123')})'");
  }
  const prevField = model.properties.find((prop) => prop.type === "field" && prop.name === fieldName);
  if (prevField) {
    return response.error(`Field ${fieldName} already exists in model ${modelName}`);
  }
  const sourceField = `model Test {
        ${fieldName}  ${data.prismaBlock}
    }`;
  let parsed;
  try {
    parsed = (0, import_prisma_ast.getSchema)(sourceField);
  } catch (error) {
    return response.error(`Error parsing field: ${error.message}`);
  }
  if (!parsed.list.length) {
    return response.error("No models found in the schema. Ensure the field block is correct and includes Prisma field attributes, including the type, but without the field name. Example: 'ADD FIELD [FieldName] TO [ModelName] -> ({String @default('123')})'");
  }
  const testModel = parsed.list[0];
  const field = testModel.properties.find((prop) => prop.type === "field" && prop.name === fieldName);
  if (!field) {
    return response.error("Invalid field. Please refer to the documentation and ensure the field block is correct. Example: 'ADD FIELD [FieldName] TO [ModelName] -> ({String?});'");
  }
  const fieldData = parseFieldForBuilder(field);
  if (!fieldData) {
    return response.error("Invalid field. Please refer to the documentation and ensure the field block is correct. Example: 'ADD FIELD [FieldName] TO [ModelName] -> ({String?});'");
  }
  const modelBuilder = prismaState.builder.model(model.name);
  if (fieldData) {
    const fieldBuilder = modelBuilder.field(fieldData.name, fieldData.fieldType);
    for (const attr of fieldData.attributes) {
      fieldBuilder.attribute(attr.name, attr.args);
    }
  }
  return response.result(`Field ${fieldName} added to model ${modelName}`);
};

// src/modules/prehandlers/mutation-handlers/add-model.ts
var import_prisma_ast2 = require("@mrleebo/prisma-ast");
var addModel = (prismaState, data) => {
  const { args, prismaBlock, options } = data;
  const response = handlerResponse(data);
  const modelName = (args?.models || [])[0];
  if (!modelName) {
    return response.error("Model name is required. Example: ADD MODEL -> [ModelName] ({id String @id})");
  }
  try {
    let fixUniqueKeyValues = function(keyValues, prop) {
      if (!keyValues) return null;
      if (!keyValues.fields) return keyValues;
      const fields = filterFields(keyValues.fields?.args || [], prop);
      if (fields.length) {
        return {
          ...keyValues,
          fields: { type: "array", args: fields }
        };
      } else {
        return null;
      }
    };
    const builder = prismaState.builder;
    const prevModel = builder.findByType("model", { name: modelName });
    if (prevModel) {
      return response.error(`Model ${modelName} already exists`);
    }
    if (!prismaBlock) {
      return response.error("No fields provided. Please provide a valid block in ({...}) containing a valid Prisma field description.");
    }
    let parsed;
    const defaultFields = options?.empty ? "" : "createdAt DateTime @default(now())\nupdatedAt DateTime @updatedAt()\n deletedAt DateTime?";
    const sourceModel = `model ${modelName} {
        ${defaultFields}
        ${prismaBlock || "id Int @id"}
        }`;
    try {
      parsed = (0, import_prisma_ast2.getSchema)(sourceModel);
    } catch (error) {
      return response.error(`Invalid block provided. Error parsing model: ${error.message}`);
    }
    const model = useHelper(parsed).getModelByName(modelName);
    if (!model) {
      return response.error(`Model ${modelName} already exists`);
    }
    const modelBuilder = builder.model(modelName);
    const idField = model.properties.find((prop) => prop.type === "field" && prop?.attributes?.some((attr) => attr.name === "id"));
    if (!idField) {
      modelBuilder.field("id", "Int").attribute("id");
    }
    const addedFieldNames = /* @__PURE__ */ new Set();
    for (const prop of model.properties) {
      if (prop.type !== "field") {
        continue;
      }
      const field = prop;
      const fieldData = parseFieldForBuilder(prop);
      if (!fieldData) {
        continue;
      }
      if (fieldData) {
        let fieldBuilder = modelBuilder.field(field.name, fieldData.fieldType);
        addedFieldNames.add(field.name);
        for (const attr of fieldData.attributes) {
          fieldBuilder = fieldBuilder.attribute(attr.name, attr.args);
        }
      }
    }
    const filterFieldsFor = ["unique", "index", "id"];
    const filterFields = (fields, prop) => {
      if (!filterFieldsFor.includes(prop)) {
        return fields;
      }
      return fields.filter((field) => {
        return addedFieldNames.has(field);
      });
    };
    const blockAttributesMap = /* @__PURE__ */ new Map();
    for (const prop of model.properties) {
      if (prop.type === "attribute" && prop.args) {
        let arrayArgs = [];
        let keyValueArgs = {};
        for (const arg of prop.args) {
          const { value, type } = arg;
          if (type == "attributeArgument") {
            if ("string" == typeof value) {
              modelBuilder.blockAttribute(prop.name, value);
            } else if ("object" == typeof value) {
              const val = value;
              if (val.type === "array") {
                const result = filterFields(val.args, prop.name);
                if (result.length) {
                  modelBuilder.blockAttribute(prop.name, result);
                }
              } else if (val.type === "keyValue") {
                keyValueArgs[val.key] = val.value;
              }
            }
          }
        }
        if (arrayArgs.length || Object.keys(keyValueArgs).length) {
          if (blockAttributesMap.has(prop.name)) {
            const existing = blockAttributesMap.get(prop.name);
            existing.args = [.../* @__PURE__ */ new Set([...existing.args || [], ...arrayArgs])];
            existing.keyValues = { ...existing.keyValues, ...keyValueArgs };
          } else {
            blockAttributesMap.set(prop.name, { args: arrayArgs, keyValues: keyValueArgs });
          }
        }
      }
    }
    for (const [name, { keyValues, args: args2 }] of blockAttributesMap.entries()) {
      if (keyValues && args2?.length && Object.keys(keyValues).length) {
        const fields = filterFields(args2, name);
        if (fields.length) {
          modelBuilder.blockAttribute(name, {
            ...keyValues,
            fields: { type: "array", args: args2 }
          });
        } else {
          modelBuilder.blockAttribute(name, keyValues);
        }
      } else if (args2?.length) {
        modelBuilder.blockAttribute(name, args2);
      } else if (keyValues && Object.keys(keyValues).length) {
        const output = fixUniqueKeyValues(keyValues, name);
        if (output) {
          modelBuilder.blockAttribute(name, output);
        }
      }
    }
    return response.result(`Model ${modelName} added successfully`);
  } catch (error) {
    return response.error(`Error adding model: ${error.message}`);
  }
};

// src/modules/field-relation-collector.ts
var import_internals = __toESM(require("@prisma/internals"), 1);
var import_pluralize = __toESM(require("pluralize"), 1);
var { getDMMF } = import_internals.default;
var getManyToManyTableName = (modelA, modelB, relationName) => {
  if (relationName) return relationName;
  const [first, second] = [modelA, modelB].sort();
  return `_${pascalCase(first)}To${pascalCase(second)}`;
};
var getManyToManyModelName = (modelA, modelB, relationName) => {
  if (relationName) return relationName;
  const [first, second] = [modelA, modelB].sort();
  return `${pascalCase(first)}To${pascalCase(second)}`;
};

// src/modules/prehandlers/mutation-handlers/add-relation.ts
var import_pluralize2 = __toESM(require("pluralize"), 1);
var addRelation = (prismaState, data) => {
  const { args, options } = data;
  const response = handlerResponse(data);
  const type = options?.type;
  const models = args?.models;
  if (!models || models.length !== 2) {
    return response.error("Two models are required for relation. Example: ADD RELATION ->[ModelA] AND ->[ModelB] (type=1:1)");
  }
  if (!type) {
    return response.error("Relation type is required. Valid types are: '1:1', '1:M', 'M:N'. Example: ADD RELATION ModelA AND ModelB (type=1:1)");
  }
  const [modelA, modelB] = models;
  const { builder } = prismaState;
  const modelARef = builder.findByType("model", { name: modelA });
  const modelBRef = builder.findByType("model", { name: modelB });
  if (!modelARef) {
    return response.error(`Model ${modelA} not found, please add it first`);
  }
  if (!modelBRef) {
    return response.error(`Model ${modelB} not found, please add it first`);
  }
  const optional = options?.required === false || options?.required === void 0;
  const pivotTable = options?.pivotTable && options?.pivotTable === true ? getManyToManyModelName(modelA, modelB) : options?.pivotTable || null;
  const sourceRelationName = options?.relationName || getManyToManyTableName(modelA, modelB);
  const relationName = `"${sourceRelationName}"`;
  const pivotModelName = pivotTable ? pascalCase(pivotTable) : null;
  const isSelfRelation = modelA === modelB;
  const fk = (modelName) => {
    return camelCase(`${modelName}Id`);
  };
  const selfPrefix = (modelName, asFk = false) => {
    return isSelfRelation ? camelCase(modelName + "By" + (asFk ? "Id" : "")) : camelCase(modelName + (asFk ? "Id" : ""));
  };
  if (options?.fkHolder && options?.fkHolder !== modelA && options?.fkHolder !== modelB) {
    return response.error(`Model ${options.fkHolder} not found, please add it first`);
  }
  const makeOptional = (str) => {
    return str + "?";
  };
  const isOptional = (str) => {
    return str + (optional ? "?" : "");
  };
  const helper = useHelper(prismaState);
  if (type == "1:1") {
    if (!pivotTable) {
      const aModelName = options?.fkHolder || modelBRef.name;
      const bModelName = aModelName === modelA ? modelB : modelA;
      const idFieldModelB = helper.getIdFieldTypeModel(bModelName) || "String";
      const fkKey = fk(bModelName);
      const refModelKey = selfPrefix(bModelName);
      builder.model(aModelName).field(fkKey, isOptional(idFieldModelB)).attribute("unique").field(refModelKey, isOptional(bModelName)).attribute("relation", [relationName, `fields: [${fkKey}]`, `references: [id]`]);
      builder.model(bModelName).field(camelCase(aModelName), makeOptional(aModelName)).attribute("relation", [relationName]);
      return response.result(`One-to-One relation added between ${modelA} and ${modelB}`);
    } else {
      const fkA = selfPrefix(modelA, true);
      const fkB = fk(modelB);
      const pivotOnly = options?.pivotOnly;
      const idFieldModelA = helper.getIdFieldTypeModel(modelA) || "String";
      const idFieldModelB = helper.getIdFieldTypeModel(modelB) || "String";
      if (!pivotOnly) {
        builder.model(pivotModelName).field("createdAt", "DateTime").attribute("default", ["now()"]).field(fkA, idFieldModelA).attribute("unique").field(fkB, idFieldModelB).blockAttribute("id", [fkA, fkB]).field(modelA.toLowerCase(), modelA).attribute("relation", [
          relationName,
          `fields: [${fkA}]`,
          `references: [id]`
        ]);
        builder.model(modelA).field(camelCase(modelB), `${pivotModelName}?`).attribute("relation", [relationName]);
      } else {
        builder.model(pivotModelName).field(fkA, idFieldModelA).attribute("unique").field(fkB, idFieldModelB).field("createdAt", "DateTime").attribute("default", ["now()"]).blockAttribute("id", [fkA, fkB]);
      }
      return response.result(`One-to-One relation (with pivot table) added between ${modelA} and ${modelB}`);
    }
  } else if (type == "1:M") {
    if (!pivotTable) {
      const required = options?.required;
      const aModelName = options?.fkHolder || modelA;
      const bModelName = aModelName === modelA ? modelB : modelA;
      const idFieldModelB = helper.getIdFieldTypeModel(bModelName) || "String";
      const fkKey = fk(bModelName);
      const refModelKey = selfPrefix(bModelName);
      const fkFieldName = options?.fkName || fkKey;
      const pluralName = options?.pluralName || import_pluralize2.default.plural(camelCase(aModelName));
      const refFieldName = options?.refName || refModelKey;
      builder.model(aModelName).field(fkFieldName, !required ? isOptional(idFieldModelB) : idFieldModelB).field(refFieldName, !required ? isOptional(bModelName) : bModelName).attribute("relation", [relationName, `fields: [${fkFieldName}]`, `references: [id]`]);
      builder.model(bModelName).field(pluralName, aModelName + "[]").attribute("relation", [relationName]);
      return response.result(`One-to-Many relation added between ${modelA} and ${modelB}`);
    } else {
      const fkA = selfPrefix(modelA, true);
      const fkB = selfPrefix(modelB, true);
      const idFieldModelA = helper.getIdFieldTypeModel(modelA) || "String";
      const idFieldModelB = helper.getIdFieldTypeModel(modelB) || "String";
      builder.model(pivotModelName).field("createdAt", "DateTime").attribute("default", ["now()"]).field(fkA, idFieldModelA).attribute("unique").field(fkB, idFieldModelB).attribute("unique").blockAttribute("id", [fkA, fkB]).field(modelA.toLowerCase(), modelA).attribute("relation", [
        relationName,
        `fields: [${fkA}]`,
        `references: [id]`
      ]);
      builder.model(modelA).field(import_pluralize2.default.plural(camelCase(modelB)), `${pivotModelName}[]`).attribute("relation", [relationName]);
      return response.result(`One-to-Many relation (with pivot table) added between ${modelA} and ${modelB}`);
    }
  }
  if (type == "M:N") {
    if (!pivotTable) {
      const toKey = import_pluralize2.default.plural(camelCase(modelB));
      const fromKey = import_pluralize2.default.plural(selfPrefix(modelA));
      builder.model(modelA).field(toKey, `${modelB}[]`).attribute("relation", [relationName]);
      builder.model(modelB).field(fromKey, `${modelA}[]`).attribute("relation", [relationName]);
      return response.result(`Many-to-Many relation (without pivot table) added between ${modelA} and ${modelB}`);
    } else {
      const customSelfPrefix = (str) => {
        return isSelfRelation ? str + "By" : str;
      };
      const toPluralKey = import_pluralize2.default.plural(camelCase(modelB));
      const fromPluralKey = import_pluralize2.default.plural(selfPrefix(modelA));
      const aModelBuilder = builder.model(modelA).field(toPluralKey, `${pivotModelName}[]`).attribute("relation", [relationName]);
      const bModelBuilder = isSelfRelation ? aModelBuilder : builder.model(modelB);
      bModelBuilder.field(fromPluralKey, `${pivotModelName}[]`).attribute("relation", [`"${customSelfPrefix(sourceRelationName)}"`]);
      const fkA = selfPrefix(modelA, true);
      const fkB = fk(modelB);
      const toKey = camelCase(modelB);
      const fromKey = selfPrefix(modelA);
      const idFieldModelA = helper.getIdFieldTypeModel(modelA) || "String";
      const idFieldModelB = helper.getIdFieldTypeModel(modelB) || "String";
      builder.model(pivotModelName).field(fkA, idFieldModelA).field(fkB, idFieldModelB).field("createdAt", "DateTime").attribute("default", ["now()"]).field(fromKey, modelA).attribute("relation", [
        `"${customSelfPrefix(sourceRelationName)}"`,
        `fields: [${fkA}]`,
        `references: [id]`,
        `onDelete: Cascade`
      ]).field(toKey, modelB).attribute("relation", [
        relationName,
        `fields: [${fkB}]`,
        `references: [id]`,
        `onDelete: Cascade`
      ]).blockAttribute("id", [fkA, fkB]);
    }
    return response.result(`Many-to-Many relation (with pivot table) added for ${modelA} and ${modelB}`);
  }
  return response.error("Not implemented");
};

// src/modules/prehandlers/mutation-handlers/delete-enum.ts
var deleteEnum = (prismaState, data) => {
  const { args } = data;
  const response = handlerResponse(data);
  const enumName = args?.enums?.[0];
  if (!enumName) {
    return response.error("No enum name provided. Usage: DELETE ENUM ->[EnumName];");
  }
  try {
    const builder = prismaState.builder;
    const prevEnum = builder.findByType("enum", { name: enumName });
    if (!prevEnum) {
      return response.error(`Enum ${enumName} does not exist`);
    }
    builder.drop(enumName);
    return response.result(`Enum ${enumName} deleted successfully`);
  } catch (error) {
    return response.error(`Error deleting enum: ${error.message}`);
  }
};

// src/modules/prehandlers/mutation-handlers/delete-field.ts
var deleteField = (prismaState, data) => {
  const { args } = data;
  const response = handlerResponse(data);
  if (!args?.fields || !args.fields.length) {
    return response.error("No field name provided. Example: DELETE FIELD ->[FieldName] IN ->[ModelName]");
  }
  const modelName = args?.models?.[0];
  if (!modelName) {
    return response.error("No model name provided. Example: DELETE FIELD FieldName IN ->[ModelName]");
  }
  const fieldName = args.fields[0];
  try {
    const builder = prismaState.builder;
    const prevModel = builder.findByType("model", { name: modelName });
    if (!prevModel) {
      return response.error(`Model ${modelName} does not exist`);
    }
    if (!prevModel.properties.find((prop) => prop.type === "field" && prop.name === fieldName)) {
      return response.error(`Field ${fieldName} does not exist in model ${modelName}`);
    }
    const model = builder.model(modelName);
    model.removeField(fieldName);
    return response.result(`Field ${modelName} deleted successfully`);
  } catch (error) {
    return response.error(`Error deleting field: ${error.message}`);
  }
};

// src/modules/prehandlers/mutation-handlers/delete-model.ts
var deleteModel = (prismaState, data) => {
  const { args } = data;
  const response = handlerResponse(data);
  const modelName = args?.models?.[0];
  if (!modelName) {
    return response.error("No model name provided. Usage: DELETE MODEL ->[ModelName];");
  }
  try {
    const builder = prismaState.builder;
    const prevModel = builder.findByType("model", { name: modelName });
    if (!prevModel) {
      return response.error(`Model ${modelName} does not exist`);
    }
    builder.drop(modelName);
    return response.result(`Model ${modelName} deleted successfully`);
  } catch (error) {
    return response.error(`Error deleting model: ${error.message}`);
  }
};

// src/modules/prehandlers/mutation-handlers/delete-relations.ts
var import_chalk = __toESM(require_source(), 1);
var deleteRelation = (prismaState, data) => {
  const { args, options } = data;
  const response = handlerResponse(data);
  const models = args?.models;
  if (!models || models.length !== 2) {
    return response.error("Two models are required to remove a relation. Example: DELETE RELATION -> [ModelA], [ModelB]");
  }
  const [modelA, modelB] = models;
  const { builder } = prismaState;
  const modelARef = builder.findByType("model", { name: modelA });
  const modelBRef = builder.findByType("model", { name: modelB });
  if (!modelARef) {
    return response.error(`Model ${modelA} not found`);
  }
  if (!modelBRef) {
    return response.error(`Model ${modelB} not found`);
  }
  const fieldA = options?.fieldA;
  const fieldB = options?.fieldB;
  if (fieldA && !fieldB) {
    return response.error(`Field ${fieldA} specified for ${modelA} but no field specified for ${modelB}`);
  }
  if (options?.relationName) {
    console.log(import_chalk.default.yellow(`Relation name is specified. Attempting to remove relation by name`));
    const fieldsA = modelARef.properties.filter(
      (prop) => prop.type === "field" && (prop.fieldType === modelB || prop.fieldType === modelA)
    );
    const fieldsAByRelation = fieldsA.filter(
      (field) => field?.attributes?.find(
        (attr) => attr.type === "attribute" && attr.name === "relation" && attr.args?.some(
          (arg) => arg.type === "attributeArgument" && arg.value === `"${options.relationName}"`
        )
      )
    );
    if (fieldsAByRelation.length === 0) {
      return response.error(`Relation ${options.relationName} not found between ${modelA} and ${modelB}`);
    }
    for (const field of fieldsAByRelation) {
      builder.model(modelA).removeField(field.name);
    }
    const fieldsB = modelBRef.properties.filter(
      (prop) => prop.type === "field" && (prop.fieldType === modelB || prop.fieldType === modelA)
    );
    const fieldsBByRelation = fieldsB.filter(
      (field) => field?.attributes?.find(
        (attr) => attr.type === "attribute" && attr.name === "relation" && attr.args?.some(
          (arg) => arg.type === "attributeArgument" && arg.value === `"${options.relationName}"`
        )
      )
    );
    for (const field of fieldsBByRelation) {
      builder.model(modelB).removeField(field.name);
    }
    if (fieldsAByRelation.length === 0 && fieldsBByRelation.length === 0) {
      return response.error(`Relation ${options.relationName} not found between ${modelA} and ${modelB}`);
    }
    return response.result(`Relation ${options.relationName} removed between ${modelA} and ${modelB}`);
  }
  if (!fieldA && !fieldB) {
    console.log(import_chalk.default.yellow(`No fields specified. Attempting to remove all relations between ${modelA} and ${modelB}`));
    const fieldsToRemoveA = modelARef.properties.filter(
      (prop) => prop.type === "field" && prop.fieldType === modelB
    );
    const fieldsToRemoveB = modelBRef.properties.filter(
      (prop) => prop.type === "field" && prop.fieldType === modelA
    );
    for (const field of fieldsToRemoveA) {
      builder.model(modelA).removeField(field.name);
    }
    for (const field of fieldsToRemoveB) {
      builder.model(modelB).removeField(field.name);
    }
    if (fieldsToRemoveA.length === 0 && fieldsToRemoveB.length === 0) {
      return response.error(`Relations not found between ${modelA} and ${modelB}`);
    }
    return response.result(`All relations between ${modelA} and ${modelB} removed`);
  }
  const modelABuilder = builder.model(modelA);
  const fieldInA = modelARef.properties.find(
    (prop) => prop.type === "field" && prop.name == fieldA && (prop.fieldType === modelB || prop.fieldType === modelA)
  );
  if (fieldInA) {
    modelABuilder.removeField(fieldInA.name);
  }
  const modelBBuilder = builder.model(modelB);
  const fieldInB = modelBRef.properties.find(
    (prop) => prop.type === "field" && prop.name == fieldB && (prop.fieldType === modelB || prop.fieldType === modelA)
  );
  if (fieldInB) {
    modelBBuilder.removeField(fieldInB.name);
  }
  if (fieldInA || fieldInB) {
    return response.result(`Relation ${fieldInA?.name || fieldInB?.name} removed between ${modelA} and ${modelB}`);
  }
  return response.error(`Relation not found between ${modelA} and ${modelB}`);
};

// src/modules/prehandlers/mutation-handlers/update-enum.ts
var updateEnum = (prismaState, data) => {
  const { args, options } = data;
  const response = handlerResponse(data);
  const enumName = args?.enums?.[0];
  if (!enumName) {
    return response.error("No enum name provided. Example: UPDATE ENUM ->[EnumName] ({A|B|C})");
  }
  if (!data.prismaBlock) {
    return response.error("No enum block provided. Example: 'UPDATE ENUM EnumName ->[({A|B|C})];'");
  }
  let keys = [];
  if (data.prismaBlock) {
    keys = data.prismaBlock.split(/\s+/);
  }
  if (!keys.length) {
    return response.error("No enum options provided. Example: 'UPDATE ENUM EnumName ({ ->[A|B|C] });'");
  }
  try {
    const enumOptions = keys?.map((key) => constantCase(key));
    const builder = prismaState.builder;
    const prevEnum = builder.findByType("enum", { name: enumName });
    if (!prevEnum) {
      builder.enum(enumName, enumOptions);
      return response.result(`Enum ${enumName} added successfully`);
    }
    const oldValues = prevEnum.enumerators.filter((el) => el.type == "enumerator").map((e) => e.name);
    const doExtend = !options?.replace;
    let finalValues;
    if (doExtend) {
      finalValues = Array.from(/* @__PURE__ */ new Set([...oldValues, ...enumOptions]));
    } else {
      finalValues = enumOptions;
    }
    builder.drop(enumName);
    builder.enum(enumName, finalValues);
    return response.result(`Enum ${enumName} added successfully`);
  } catch (error) {
    return response.error(`Error adding enum: ${error.message}`);
  }
};

// src/modules/prehandlers/mutation-handlers/update-field.ts
var import_prisma_ast3 = require("@mrleebo/prisma-ast");
var updateField = (prismaState, data) => {
  const response = handlerResponse(data);
  const { args } = data;
  const fieldName = args?.fields?.[0];
  if (!fieldName) {
    return response.error("No field name provided. Usage: UPDATE FIELD ->[FieldName] IN [ModelName] ({String @default('test')})");
  }
  const modelName = args?.models?.[0];
  if (!modelName) {
    return response.error("No model name provided. Usage: UPDATE FIELD [FieldName] IN -> [ModelName] ({String @default('test')})");
  }
  const model = prismaState.builder.findByType("model", { name: modelName });
  if (!model) {
    return response.error(`Model ${modelName} not found`);
  }
  if (!data.prismaBlock) {
    return response.error("No field block provided. Example: 'UPDATE FIELD FieldName IN ModelName ->[({String @default('test')})];'");
  }
  const prevField = model.properties.find((prop) => prop.type === "field" && prop.name === fieldName);
  if (!prevField) {
    return response.error(`Field ${fieldName} does not exist in model ${modelName}`);
  }
  let parsed;
  const sourceField = `model Test {
        ${fieldName} ${data.prismaBlock}
    }`;
  try {
    parsed = (0, import_prisma_ast3.getSchema)(sourceField);
  } catch (error) {
    return response.error("There is likely an issue with the block. The block should contain Prisma field attributes including the type, but without the field name. Example: 'String @default('test')'");
  }
  const testModel = parsed.list[0];
  const newField = testModel.properties.find((prop) => prop.type === "field" && prop.name === fieldName);
  if (!newField) {
    return response.error("Invalid field. Please refer to the documentation and ensure the field block is correct. Example: 'UPDATE FIELD [FieldName] IN [ModelName] -> ({String?});'");
  }
  const fieldData = parseFieldForBuilder(newField);
  if (!fieldData) {
    return response.error("Invalid field. Please refer to the documentation and ensure the field block is correct. Example: 'UPDATE FIELD [FieldName] IN [ModelName] -> ({String?});'");
  }
  const modelBuilder = prismaState.builder.model(model.name);
  if (fieldData) {
    modelBuilder.removeField(fieldName);
    const fieldBuilder = modelBuilder.field(fieldData.name, fieldData.fieldType);
    for (const attr of fieldData.attributes) {
      fieldBuilder.attribute(attr.name, attr.args);
    }
  }
  return response.result(`Field ${fieldName} added to model ${modelName}`);
};

// src/modules/handler-registries/mutation-handler-registry.ts
var PrismaQlMutationHandlerRegistry = class extends PrismaQlHandlerRegistry {
  constructor(initialHandlers) {
    super(initialHandlers);
  }
};

// src/modules/prehandlers/mutation-handlers/add-generator.ts
var import_prisma_ast4 = require("@mrleebo/prisma-ast");
var addGenerator = (prismaState, data) => {
  const { args } = data;
  const response = handlerResponse(data);
  const builder = prismaState.builder;
  const generatorName = args?.generators?.[0];
  if (!generatorName) {
    return response.error("No generator name provided. Example: 'ADD GENERATOR ->[GeneratorName] ({key: value});'");
  }
  const prismaBlock = data.prismaBlock;
  if (!prismaBlock) {
    return response.error("No generator block provided. Example: 'ADD GENERATOR GeneratorName ->[({key: value})];'");
  }
  const prevGenerator = builder.findByType("generator", { name: generatorName });
  if (prevGenerator) {
    return response.error(`Generator ${generatorName} already exists`);
  }
  let parsed;
  const sourceModel = `generator ${generatorName} {
        ${prismaBlock}
    }`;
  try {
    parsed = (0, import_prisma_ast4.getSchema)(sourceModel);
  } catch (error) {
    return response.error(`Invalid block provided. Error parsing model: ${error.message}`);
  }
  const schema = prismaState.builder.getSchema();
  const newGenerator = parsed.list[0];
  schema.list.push(newGenerator);
  return response.result(`Generator ${generatorName} added successfully!`);
};

// src/modules/prehandlers/mutation-handlers/update-generator.ts
var import_chalk2 = __toESM(require_source(), 1);
var import_prisma_ast5 = require("@mrleebo/prisma-ast");
function normalizeQuotes(input) {
  return input.replace(/^[\'"]+/, "").replace(/[\'"]+$/, "");
}
var updateGenerator = (prismaState, data) => {
  const { args, options } = data;
  const response = handlerResponse(data);
  const builder = prismaState.builder;
  const generatorName = args?.generators?.[0];
  if (!generatorName) {
    return response.error("No generator name provided. Example: 'ADD GENERATOR ->[GeneratorName] ({key: value});'");
  }
  const prevGenerator = builder.findByType("generator", { name: generatorName });
  if (!prevGenerator) {
    return response.error(`Generator ${generatorName} does not exist`);
  }
  let parsed;
  const prismaBlock = data.prismaBlock;
  if (prismaBlock) {
    if (!prismaBlock) {
      return response.error("No generator block provided. Example: 'ADD GENERATOR GeneratorName ->[({key: value})];'");
    }
    console.log(import_chalk2.default.yellow(`Warning: generator block provided. Generator ${generatorName} will be replaced`));
    builder.drop(prevGenerator.name);
    const sourceModel = `generator ${generatorName} {
        ${prismaBlock}
    }`;
    try {
      parsed = (0, import_prisma_ast5.getSchema)(sourceModel);
    } catch (error) {
      return response.error(`Invalid block provided. Error parsing model: ${error.message}`);
    }
    const schema = prismaState.builder.getSchema();
    const newGenerator = parsed.list[0];
    schema.list.push(newGenerator);
  } else if (options && Object.keys(options).length) {
    const generator = builder.generator(generatorName);
    const otherOptions = Object.keys(options).filter((key) => key !== "output" && key !== "provider" && key !== "binaryTargets");
    if (otherOptions.length) {
      console.log(import_chalk2.default.yellow(`Warning: unknown options ${otherOptions.join(", ")} will be skipped`));
      const validOptions = ["output", "provider", "binaryTargets"];
      console.log(import_chalk2.default.yellow(`Valid options are: ${validOptions.join(", ")}`));
    }
    if (options?.output) {
      generator.assignment("output", normalizeQuotes(options.output));
    }
    if (options?.provider) {
      generator.assignment("provider", normalizeQuotes(options.provider));
    }
    if (options?.binaryTargets) {
      const binaryTargets = Array.isArray(options.binaryTargets) ? JSON.stringify(options.binaryTargets) : options.binaryTargets;
      generator.assignment("binaryTargets", binaryTargets);
    }
  }
  return response.result(`Generator ${generatorName} added successfully!`);
};

// src/modules/prehandlers/mutation-handlers/update-db.ts
function normalizeQuotes2(input) {
  return input.replace(/^[\'"]+/, "").replace(/[\'"]+$/, "");
}
var updateDB = (prismaState, data) => {
  const { options } = data;
  const response = handlerResponse(data);
  if (!options?.provider && !options?.url) {
    return response.error("No provider or url provided. Example: 'UPDATE DB (->[url='sqlite://prisma.db' provider='sqlite']);'");
  }
  const builder = prismaState.builder;
  const prev = builder.findByType("datasource", {
    name: "db"
  });
  if (!prev) {
    return response.error("No datasource found");
  }
  const provider = (options.provider ? `"${options.provider}"` : null) || prev?.assignments?.find((a) => a.key == "provider")?.value;
  let prevUrl = options.url?.toString() || prev?.assignments?.find((a) => a.key == "url")?.value;
  if (typeof prevUrl == "object" && prevUrl.name == "env") {
    prevUrl = {
      env: normalizeQuotes2(prevUrl.params[0])
    };
  }
  builder.datasource(provider, prevUrl || {
    env: "DATABASE_URL"
  });
  return response.result(`DB updated successfully`);
};

// src/modules/handlers/mutation-handler.ts
var mutationsHandler = new PrismaQlMutationHandlerRegistry();
mutationsHandler.register("ADD", "MODEL", addModel);
mutationsHandler.register("ADD", "FIELD", addField);
mutationsHandler.register("ADD", "ENUM", addEnum);
mutationsHandler.register("ADD", "RELATION", addRelation);
mutationsHandler.register("ADD", "GENERATOR", addGenerator);
mutationsHandler.register("DELETE", "ENUM", deleteEnum);
mutationsHandler.register("DELETE", "MODEL", deleteModel);
mutationsHandler.register("DELETE", "FIELD", deleteField);
mutationsHandler.register("DELETE", "RELATION", deleteRelation);
mutationsHandler.register("DELETE", "GENERATOR", deleteRelation);
mutationsHandler.register("UPDATE", "FIELD", updateField);
mutationsHandler.register("UPDATE", "ENUM", updateEnum);
mutationsHandler.register("UPDATE", "GENERATOR", updateGenerator);
mutationsHandler.register("UPDATE", "DB", updateDB);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  mutationsHandler
});
