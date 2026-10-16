const INK = "#2b1b4a";

export const SKIN_COLORS = ["#ffe0bd", "#f1c27d", "#c68642", "#8d5524", "#5c3a21"];
export const CLOTH_COLORS = ["#3b2a8f", "#7a1f2b", "#1f6f6f", "#2f8f5f", "#8f1f4f", "#2f5fa8", "#e0a030", "#2b2b3a"];
export const HAIR_COLORS = ["#2b1b1b", "#7a4a1a", "#c47a2c", "#e0c050", "#aaaaaa", "#d04a8a", "#4a8fd0"];
export const JEWEL_COLORS = ["#ffd166", "#ff5fa2", "#5fd0ff", "#7dff8a", "#e8e8f0"];

// Child proportions: a big head on a small body.
const HEAD = {
  round: { rx: 40, ry: 40, cy: 114 },
  oval: { rx: 34, ry: 46, cy: 116 },
  wide: { rx: 46, ry: 36, cy: 112 },
};

const head = (c) => {
  const { rx, ry, cy } = HEAD[c.head];
  return `<ellipse cx="100" cy="${cy}" rx="${rx}" ry="${ry}" fill="${c.skin}" stroke="${INK}" stroke-width="2"/>`;
};

const legsAndShoes = (c) => `
  <rect x="82" y="214" width="12" height="30" fill="${c.skin}" stroke="${INK}" stroke-width="1.5"/>
  <rect x="106" y="214" width="12" height="30" fill="${c.skin}" stroke="${INK}" stroke-width="1.5"/>
  <ellipse cx="86" cy="246" rx="15" ry="7" fill="#4a2a6a" stroke="${INK}" stroke-width="1.5"/>
  <ellipse cx="114" cy="246" rx="15" ry="7" fill="#4a2a6a" stroke="${INK}" stroke-width="1.5"/>`;

const hairBack = {
  none: () => "",
  bob: (c, hr) => `<path d="M${98 - hr} 120 Q${96 - hr} 64 100 64 Q${104 + hr} 64 ${102 + hr} 120 L${102 + hr} 152 L${98 - hr} 152Z" fill="${c}"/>`,
  long: (c, hr) => `<path d="M${97 - hr} 120 Q${95 - hr} 62 100 62 Q${105 + hr} 62 ${103 + hr} 120 L${108 + hr} 205 L${92 - hr} 205Z" fill="${c}"/>`,
  braid: (c, hr) => `<path d="M${98 - hr} 120 Q${96 - hr} 64 100 64 Q${104 + hr} 64 ${102 + hr} 120Z" fill="${c}"/>
    <path d="M${hr + 96} 120 Q${hr + 122} 160 ${hr + 108} 220" stroke="${c}" stroke-width="15" fill="none" stroke-linecap="round"/>
    <path d="M${hr + 106} 140 l10 8 M${hr + 110} 160 l10 8 M${hr + 112} 180 l-10 8 M${hr + 110} 200 l-10 8" stroke="${INK}" stroke-width="2" opacity=".5"/>`,
  ponytail: (c, hr) => `<path d="M${98 - hr} 116 Q${96 - hr} 64 100 64 Q${104 + hr} 64 ${102 + hr} 116Z" fill="${c}"/>
    <path d="M${hr + 90} 90 Q${hr + 135} 100 ${hr + 115} 185" stroke="${c}" stroke-width="18" fill="none" stroke-linecap="round"/>`,
  short: (c, hr) => `<path d="M${98 - hr} 114 Q${96 - hr} 64 100 64 Q${104 + hr} 64 ${102 + hr} 114Z" fill="${c}"/>`,
};

const hairFront = {
  short: (c, hr, cy) => `<path d="M${100 - hr} ${cy - 6} Q${100 - hr} ${cy - 46} 100 ${cy - 46} Q${100 + hr} ${cy - 46} ${100 + hr} ${cy - 6} L${100 + hr - 12} ${cy - 24} Q100 ${cy - 14} ${100 - hr + 12} ${cy - 24}Z" fill="${c}"/>`,
  bob: (c, hr, cy) => `<path d="M${100 - hr} ${cy - 10} Q${100 - hr + 4} ${cy - 46} 100 ${cy - 46} Q${100 + hr - 4} ${cy - 46} ${100 + hr} ${cy - 10} Q${100 + hr / 2} ${cy - 30} ${100 - hr} ${cy - 10}Z" fill="${c}"/>`,
};
hairFront.long = hairFront.bob;
hairFront.braid = hairFront.bob;
hairFront.ponytail = hairFront.bob;

// Wizards: a small, child-friendly beard.
const beard = {
  none: () => "",
  tuft: (c) => `<path d="M88 148 Q100 172 112 148 Q100 154 88 148Z" fill="${c}" stroke="${INK}" stroke-width="1.5"/>`,
  moustache: (c) => `<path d="M84 131 Q100 122 116 131 Q100 137 84 131Z" fill="${c}"/>`,
  full: (c) => `<path d="M64 130 Q80 168 100 168 Q120 168 136 130 Q120 150 100 150 Q80 150 64 130Z" fill="${c}" stroke="${INK}" stroke-width="1.5"/>`,
};

// Witches: earrings on both ears.
const earrings = {
  none: () => "",
  studs: (c, hr, cy) => [-1, 1].map((s) => `<circle cx="${100 + s * (hr + 1)}" cy="${cy + 8}" r="4" fill="${c}" stroke="${INK}" stroke-width="1"/>`).join(""),
  hoops: (c, hr, cy) => [-1, 1].map((s) => `<circle cx="${100 + s * (hr + 1)}" cy="${cy + 16}" r="8" fill="none" stroke="${c}" stroke-width="3"/>`).join(""),
  stars: (c, hr, cy) => [-1, 1].map((s) => `<text x="${100 + s * (hr + 1)}" y="${cy + 22}" font-size="18" text-anchor="middle" fill="${c}" stroke="${INK}" stroke-width=".6">★</text>`).join(""),
};

const hat = {
  none: () => "",
  stars: (c) => `<polygon points="100,2 60,76 140,76" fill="${c}" stroke="${INK}" stroke-width="2"/>
    <rect x="46" y="72" width="108" height="13" rx="6" fill="${c}" stroke="${INK}" stroke-width="2"/>
    <g fill="#ffd166"><circle cx="97" cy="32" r="3"/><circle cx="108" cy="52" r="3"/><circle cx="85" cy="60" r="3"/></g>`,
  dark: (c) => `<polygon points="96,6 62,78 138,78" fill="${c}"/>
    <path d="M70 72 l40 -42 M80 76 l30 -34 M92 78 l20 -24 M66 60 l22 -26" stroke="#fff" stroke-opacity=".25" stroke-width="2"/>
    <ellipse cx="100" cy="80" rx="50" ry="8" fill="${c}"/>`,
  floppy: (c) => `<path d="M60 80 Q66 24 110 20 Q122 10 142 26 Q120 34 134 80Z" fill="${c}" stroke="${INK}" stroke-width="2"/>
    <rect x="48" y="74" width="104" height="13" rx="6" fill="${c}" stroke="${INK}" stroke-width="2"/>
    <circle cx="142" cy="26" r="6" fill="#ffd166"/>`,
};

const outfit = {
  dress: (c) => `<path d="M100 152 Q66 156 56 224 L144 224 Q134 156 100 152Z" fill="${c}" stroke="${INK}" stroke-width="2"/>
    <circle cx="100" cy="160" r="5" fill="#ffd166"/>`,
  cape: (c) => `<path d="M100 152 Q50 152 44 222 Q76 232 92 210 L100 196 L108 210 Q124 232 156 222 Q150 152 100 152Z" fill="${c}" stroke="${INK}" stroke-width="2"/>
    <circle cx="100" cy="158" r="6" fill="#ffd166" stroke="${INK}"/>`,
  sidecape: (c) => `<path d="M82 154 Q64 160 66 226 L142 226 Q136 166 112 154Z" fill="${c}" stroke="${INK}" stroke-width="2"/>
    <path d="M100 160 L98 220" stroke="${INK}" stroke-width="2"/>
    <polygon points="88,158 96,158 92,166" fill="#ffd166"/>`,
  tunic: (c) => `<path d="M78 158 L60 196 M122 158 L140 196" stroke="${c}" stroke-width="12" stroke-linecap="round"/>
    <path d="M76 152 L124 152 L130 206 L70 206Z" fill="${c}" stroke="${INK}" stroke-width="2"/>
    <path d="M72 206 L128 206 L130 222 L104 222 L100 212 L96 222 L70 222Z" fill="#4a3a7a" stroke="${INK}" stroke-width="2"/>`,
};

const face = {
  happy: (rx, cy) => `<circle cx="${100 - rx}" cy="${cy}" r="4.2" fill="${INK}"/><circle cx="${100 + rx}" cy="${cy}" r="4.2" fill="${INK}"/>
    <circle cx="${100 - rx - 1}" cy="${cy - 1.5}" r="1.3" fill="#fff"/><circle cx="${100 + rx - 1}" cy="${cy - 1.5}" r="1.3" fill="#fff"/>
    <circle cx="${100 - rx - 6}" cy="${cy + 12}" r="6" fill="#ff8aa8" opacity=".45"/><circle cx="${100 + rx + 6}" cy="${cy + 12}" r="6" fill="#ff8aa8" opacity=".45"/>
    <path d="M90 ${cy + 14} Q100 ${cy + 25} 110 ${cy + 14}" stroke="#c0392b" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  wink: (rx, cy) => `<circle cx="${100 - rx}" cy="${cy}" r="4.2" fill="${INK}"/><path d="M${rx + 94} ${cy} h12" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
    <circle cx="${100 - rx - 6}" cy="${cy + 12}" r="6" fill="#ff8aa8" opacity=".45"/><circle cx="${100 + rx + 6}" cy="${cy + 12}" r="6" fill="#ff8aa8" opacity=".45"/>
    <path d="M88 ${cy + 13} Q100 ${cy + 28} 112 ${cy + 13}Z" fill="#c0392b"/>`,
  calm: (rx, cy) => `<path d="M${94 - rx} ${cy} q6 -6 12 0 M${88 + rx} ${cy} q6 -6 12 0" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="${100 - rx - 6}" cy="${cy + 12}" r="6" fill="#ff8aa8" opacity=".45"/><circle cx="${100 + rx + 6}" cy="${cy + 12}" r="6" fill="#ff8aa8" opacity=".45"/>
    <path d="M93 ${cy + 17} Q100 ${cy + 21} 107 ${cy + 17}" stroke="#c0392b" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  surprised: (rx, cy) => `<circle cx="${100 - rx}" cy="${cy}" r="5.5" fill="#fff" stroke="${INK}" stroke-width="2"/><circle cx="${100 + rx}" cy="${cy}" r="5.5" fill="#fff" stroke="${INK}" stroke-width="2"/>
    <circle cx="${100 - rx}" cy="${cy}" r="2.2" fill="${INK}"/><circle cx="${100 + rx}" cy="${cy}" r="2.2" fill="${INK}"/>
    <ellipse cx="100" cy="${cy + 20}" rx="5" ry="6.5" fill="#c0392b"/>`,
};

export const helpers = {
  none: () => "",
  owl: () => `<ellipse cx="100" cy="115" rx="52" ry="62" fill="#9b7a4a" stroke="${INK}" stroke-width="2"/>
    <polygon points="62,62 72,30 90,58" fill="#9b7a4a"/><polygon points="138,62 128,30 110,58" fill="#9b7a4a"/>
    <circle cx="80" cy="85" r="18" fill="#fff"/><circle cx="120" cy="85" r="18" fill="#fff"/>
    <circle cx="80" cy="85" r="8" fill="${INK}"/><circle cx="120" cy="85" r="8" fill="${INK}"/>
    <polygon points="94,98 106,98 100,112" fill="#ffb703"/>
    <ellipse cx="100" cy="140" rx="30" ry="30" fill="#e6d3a8"/>
    <path d="M80 175 l-6 10 M90 177 l-4 10 M120 177 l4 10 M110 177 l6 10" stroke="#ffb703" stroke-width="4" stroke-linecap="round"/>`,
  bat: () => `<path d="M100 90 Q60 40 10 70 Q30 80 38 100 Q55 85 70 108 Q85 92 100 118 Q115 92 130 108 Q145 85 162 100 Q170 80 190 70 Q140 40 100 90Z" fill="#2b2b3a" stroke="#6a5a9a" stroke-width="2"/>
    <ellipse cx="100" cy="105" rx="18" ry="24" fill="#3a3a4d" stroke="#6a5a9a" stroke-width="2"/>
    <polygon points="88,84 90,64 98,82" fill="#3a3a4d"/><polygon points="112,84 110,64 102,82" fill="#3a3a4d"/>
    <circle cx="94" cy="100" r="3" fill="#ffd166"/><circle cx="106" cy="100" r="3" fill="#ffd166"/>`,
  cat: () => `<path d="M50 190 Q40 120 70 100 Q60 80 70 60 L78 40 L92 58 Q100 56 108 58 L122 40 L130 60 Q140 80 130 100 Q160 120 150 190Z" fill="#23232e" stroke="#6a5a9a" stroke-width="2"/>
    <path d="M150 180 Q190 170 180 120" stroke="#23232e" stroke-width="12" fill="none" stroke-linecap="round"/>
    <circle cx="90" cy="80" r="5" fill="#7dff8a"/><circle cx="112" cy="80" r="5" fill="#7dff8a"/>
    <polygon points="98,92 104,92 101,98" fill="#ff5fa2"/>`,
  spider: () => `<g stroke="#b9a6e6" stroke-width="4" fill="none" stroke-linecap="round">
      <path d="M85 95 L40 60 L20 80 M85 105 L30 105 L15 130 M88 115 L45 150 L35 180 M90 85 L60 45 L50 30"/>
      <path d="M115 95 L160 60 L180 80 M115 105 L170 105 L185 130 M112 115 L155 150 L165 180 M110 85 L140 45 L150 30"/></g>
    <circle cx="100" cy="105" r="30" fill="#3a2a5a" stroke="#b9a6e6" stroke-width="3"/>
    <circle cx="90" cy="98" r="5" fill="#ff5fa2"/><circle cx="110" cy="98" r="5" fill="#ff5fa2"/>`,
};

// `only` limits a category to one character type.
export const CATEGORIES = [
  { key: "head", label: "Head", icon: "🙂", options: Object.keys(HEAD), colorKey: "skin", colors: SKIN_COLORS },
  { key: "hair", label: "Hair", icon: "💇", options: Object.keys(hairBack), colorKey: "hairColor", colors: HAIR_COLORS },
  { key: "earrings", label: "Earrings", icon: "💎", options: Object.keys(earrings), colorKey: "earringColor", colors: JEWEL_COLORS, only: "witch" },
  { key: "beard", label: "Beard", icon: "🧔", options: Object.keys(beard), colorKey: "beardColor", colors: HAIR_COLORS, only: "wizard" },
  { key: "hat", label: "Hat", icon: "🎩", options: Object.keys(hat), colorKey: "hatColor", colors: CLOTH_COLORS },
  { key: "outfit", label: "Clothes", icon: "👗", options: Object.keys(outfit), colorKey: "outfitColor", colors: CLOTH_COLORS },
  { key: "face", label: "Face", icon: "😜", options: Object.keys(face) },
  { key: "helper", label: "Helper", icon: "🦉", options: Object.keys(helpers) },
];

export function characterSvgBody(c) {
  const { rx: hr, cy } = HEAD[c.head];
  const eyeX = Math.round(hr * 0.37);
  const witch = c.type === "witch";
  return `${hairBack[c.hair](c.hairColor, hr)}
    ${legsAndShoes(c)}
    ${outfit[c.outfit](c.outfitColor)}
    ${head(c)}
    ${witch || c.beard === "moustache" ? "" : beard[c.beard](c.beardColor)}
    ${hairFront[c.hair] ? hairFront[c.hair](c.hairColor, hr, cy) : ""}
    ${face[c.face](eyeX, cy)}
    ${!witch && c.beard === "moustache" ? beard.moustache(c.beardColor) : ""}
    ${witch ? earrings[c.earrings](c.earringColor, hr, cy) : ""}
    ${hat[c.hat](c.hatColor)}`;
}
