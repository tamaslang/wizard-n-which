const INK = "#2b1b4a";

export const SKIN_COLORS = ["#ffe0bd", "#f1c27d", "#c68642", "#8d5524", "#5c3a21"];
export const CLOTH_COLORS = ["#3b2a8f", "#7a1f2b", "#1f6f6f", "#2f8f5f", "#8f1f4f", "#2f5fa8", "#e0a030", "#2b2b3a"];
export const HAIR_COLORS = ["#2b1b1b", "#7a4a1a", "#c47a2c", "#e0c050", "#aaaaaa", "#d04a8a", "#4a8fd0"];

const head = {
  round: (c) => `<circle cx="100" cy="105" r="34" fill="${c.skin}" stroke="${INK}" stroke-width="2"/>`,
  oval: (c) => `<ellipse cx="100" cy="108" rx="29" ry="39" fill="${c.skin}" stroke="${INK}" stroke-width="2"/>`,
  wide: (c) => `<ellipse cx="100" cy="106" rx="40" ry="32" fill="${c.skin}" stroke="${INK}" stroke-width="2"/>`,
};

const hairBack = {
  none: () => "",
  bob: (c) => `<path d="M62 112 Q60 60 100 62 Q140 60 138 112 L138 135 L62 135Z" fill="${c}"/>`,
  long: (c) => `<path d="M60 112 Q58 58 100 60 Q142 58 140 112 L146 200 L54 200Z" fill="${c}"/>`,
  braid: (c) => `<path d="M62 112 Q60 60 100 62 Q140 60 138 112Z" fill="${c}"/>
    <path d="M136 110 Q160 150 150 215" stroke="${c}" stroke-width="14" fill="none" stroke-linecap="round"/>
    <path d="M140 130 l10 8 M144 150 l10 8 M146 170 l-10 8 M148 190 l-10 8" stroke="${INK}" stroke-width="2" opacity=".5"/>`,
  ponytail: (c) => `<path d="M64 108 Q62 62 100 62 Q138 62 136 108Z" fill="${c}"/>
    <path d="M134 90 Q175 100 160 190" stroke="${c}" stroke-width="16" fill="none" stroke-linecap="round"/>`,
  short: (c) => `<path d="M64 108 Q60 60 100 62 Q140 60 136 108Z" fill="${c}"/>`,
};

const hairFront = {
  short: (c) => `<path d="M64 108 Q60 60 100 62 Q140 60 136 108 L125 88 Q100 98 75 88Z" fill="${c}"/>`,
  bob: (c) => `<path d="M66 100 Q70 66 100 66 Q130 66 134 100 Q110 84 66 100Z" fill="${c}"/>`,
  long: (c) => `<path d="M66 100 Q70 66 100 66 Q130 66 134 100 Q110 84 66 100Z" fill="${c}"/>`,
};

const beard = {
  none: () => "",
  long: (c) => `<path d="M72 118 Q100 150 128 118 Q132 175 100 215 Q68 175 72 118Z" fill="${c}" stroke="${INK}" stroke-width="2"/>`,
  moustache: (c) => `<path d="M82 124 Q100 114 118 124 Q100 130 82 124Z" fill="${c}"/>`,
};

const hat = {
  none: () => "",
  stars: (c) => `<polygon points="100,6 64,70 136,70" fill="${c}" stroke="${INK}" stroke-width="2"/>
    <rect x="50" y="68" width="100" height="12" rx="6" fill="${c}" stroke="${INK}" stroke-width="2"/>
    <g fill="#ffd166"><circle cx="97" cy="34" r="3"/><circle cx="106" cy="52" r="3"/><circle cx="86" cy="58" r="3"/></g>`,
  dark: (c) => `<polygon points="96,10 66,72 134,72" fill="${c}"/>
    <path d="M74 66 l40 -40 M84 70 l30 -32 M94 72 l20 -22 M70 56 l20 -24" stroke="#fff" stroke-opacity=".25" stroke-width="2"/>
    <ellipse cx="100" cy="74" rx="46" ry="8" fill="${c}"/>`,
  floppy: (c) => `<path d="M64 74 Q70 20 112 18 Q122 10 140 24 Q120 30 130 74Z" fill="${c}" stroke="${INK}" stroke-width="2"/>
    <rect x="52" y="68" width="96" height="12" rx="6" fill="${c}" stroke="${INK}" stroke-width="2"/>
    <circle cx="140" cy="24" r="6" fill="#ffd166"/>`,
};

const outfit = {
  dress: (c) => `<path d="M100 140 Q62 148 48 250 L152 250 Q138 148 100 140Z" fill="${c}" stroke="${INK}" stroke-width="2"/>
    <circle cx="100" cy="148" r="5" fill="#ffd166"/>`,
  cape: (c) => `<path d="M100 140 Q40 140 32 235 Q70 250 90 215 L100 190 L110 215 Q130 250 168 235 Q160 140 100 140Z" fill="${c}" stroke="${INK}" stroke-width="2"/>
    <circle cx="100" cy="146" r="6" fill="#ffd166" stroke="${INK}"/>`,
  sidecape: (c) => `<path d="M80 142 Q60 150 62 245 L150 250 Q142 160 112 142Z" fill="${c}" stroke="${INK}" stroke-width="2"/>
    <path d="M100 150 L98 230" stroke="${INK}" stroke-width="2"/>
    <polygon points="86,146 94,146 90,154" fill="#ffd166"/>`,
  tunic: (c) => `<path d="M72 146 L52 190 M128 146 L148 190" stroke="${c}" stroke-width="12" stroke-linecap="round"/>
    <path d="M72 142 L128 142 L136 200 L64 200Z" fill="${c}" stroke="${INK}" stroke-width="2"/>
    <path d="M72 200 L82 250 L98 250 L100 205 L102 250 L118 250 L128 200Z" fill="#4a3a7a" stroke="${INK}" stroke-width="2"/>`,
};

const face = {
  happy: (rx) => `<circle cx="${100 - rx}" cy="104" r="3.2" fill="${INK}"/><circle cx="${100 + rx}" cy="104" r="3.2" fill="${INK}"/>
    <path d="M90 122 Q100 132 110 122" stroke="#c0392b" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  wink: (rx) => `<circle cx="${100 - rx}" cy="104" r="3.2" fill="${INK}"/><path d="M${95 + rx} 104 h10" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
    <path d="M88 121 Q100 134 112 121Z" fill="#c0392b"/>`,
  calm: (rx) => `<path d="M${95 - rx} 104 q5 -5 10 0 M${95 + rx} 104 q5 -5 10 0" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M92 124 h16" stroke="#c0392b" stroke-width="3" stroke-linecap="round"/>`,
  surprised: (rx) => `<circle cx="${100 - rx}" cy="103" r="4.5" fill="#fff" stroke="${INK}" stroke-width="2"/><circle cx="${100 + rx}" cy="103" r="4.5" fill="#fff" stroke="${INK}" stroke-width="2"/>
    <circle cx="${100 - rx}" cy="103" r="1.8" fill="${INK}"/><circle cx="${100 + rx}" cy="103" r="1.8" fill="${INK}"/>
    <ellipse cx="100" cy="125" rx="5" ry="6" fill="#c0392b"/>`,
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

export const CATEGORIES = [
  { key: "head", label: "Head", icon: "🙂", options: Object.keys(head), colorKey: "skin", colors: SKIN_COLORS },
  { key: "hair", label: "Hair", icon: "💇", options: Object.keys(hairBack), colorKey: "hairColor", colors: HAIR_COLORS },
  { key: "beard", label: "Beard", icon: "🧔", options: Object.keys(beard), colorKey: "beardColor", colors: HAIR_COLORS },
  { key: "hat", label: "Hat", icon: "🎩", options: Object.keys(hat), colorKey: "hatColor", colors: CLOTH_COLORS },
  { key: "outfit", label: "Clothes", icon: "👗", options: Object.keys(outfit), colorKey: "outfitColor", colors: CLOTH_COLORS },
  { key: "face", label: "Face", icon: "😜", options: Object.keys(face) },
  { key: "helper", label: "Helper", icon: "🦉", options: Object.keys(helpers) },
];

export function characterSvgBody(c) {
  const rx = c.head === "oval" ? 11 : c.head === "wide" ? 16 : 13;
  return `${hairBack[c.hair](c.hairColor)}
    ${outfit[c.outfit](c.outfitColor)}
    ${head[c.head](c)}
    ${beard[c.beard] && c.beard === "long" ? beard.long(c.beardColor) : ""}
    ${hairFront[c.hair] ? hairFront[c.hair](c.hairColor) : ""}
    ${face[c.face](rx)}
    ${c.beard === "moustache" ? beard.moustache(c.beardColor) : ""}
    ${hat[c.hat](c.hatColor)}`;
}
