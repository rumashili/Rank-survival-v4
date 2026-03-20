function hexToRgb(hex) {
  hex = hex.replace("#", "")

  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16)
  }
}

function rgbToHex(r, g, b) {
  return "#" +
    r.toString(16).padStart(2, "0") +
    g.toString(16).padStart(2, "0") +
    b.toString(16).padStart(2, "0")
}

function rgbToHsv(r, g, b) {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min

  let h
  if (d === 0) h = 0
  else if (max === r) h = ((g - b) / d) % 6
  else if (max === g) h = (b - r) / d + 2
  else h = (r - g) / d + 4

  h *= 60
  if (h < 0) h += 360

  const s = max === 0 ? 0 : d / max
  const v = max

  return {h, s, v}
}

function hsvToRgb(h, s, v) {
  const c = v * s
  const x = c * (1 - Math.abs((h / 60) % 2 - 1))
  const m = v - c

  let r, g, b

  if (h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  }
}

function gradientHSV(color1, color2, steps) {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)

  const hsv1 = rgbToHsv(rgb1.r, rgb1.g, rgb1.b)
  const hsv2 = rgbToHsv(rgb2.r, rgb2.g, rgb2.b)

  const result = []

  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1)

    let dh = hsv2.h - hsv1.h
    if (dh > 180) dh -= 360
    if (dh < -180) dh += 360

    const h = (hsv1.h + dh * t + 360) % 360
    const s = hsv1.s + (hsv2.s - hsv1.s) * t
    const v = hsv1.v + (hsv2.v - hsv1.v) * t

    const rgb = hsvToRgb(h, s, v)
    result.push(rgbToHex(rgb.r, rgb.g, rgb.b))
  }

  return result
}

function addRank(rankName, color, color2 = null) {
  if (color2 === null) {
    return [{str: rankName, style: {color: color}}]
  } else {
    let txt = []
    const colorList = gradientHSV(color, color2, rankName.length)

    for (let i = 0; i < rankName.length; i++) {
      txt.push({str: rankName[i], style: {color: colorList[i]}})
    }

    return txt;
  }
}

rankList = [
  addRank("ノーランク", "#bbbbbb"),
  addRank("初心者", "#00ffff"),
  addRank("駆け出し", "#00ff00"),
  addRank("ウッド", "#ba6a0f"),
  addRank("ストーン", "#aaaaaa"),
  addRank("初級", "#ffff00"),
  addRank("見習い", "#5555ff"),
  addRank("アイロン", "#cccccc"),
  addRank("中級", "#ff8800"),
  addRank("ゴールド", "#ffd700"),
  addRank("プラチナ", "#e5e4e2"),
  addRank("上級", "#ff0000"),
  addRank("ダイヤモンド", "#88ffff"),
  addRank("ムーンストーン", "#fffced"),
  addRank("マスター", "#ff44ff"),

  addRank("エメラルド", "#50c878"),
  addRank("ペリドット", "#9cff3a"),
  addRank("ヒスイ", "#00a86b"),
  addRank("ターコイズ", "#40e0d0"),
  addRank("アクアマリン", "#7fffd4"),
  addRank("トパーズ", "#ffc87c"),
  addRank("トルマリン", "#ff66cc"),
  addRank("サファイア", "#2f7fff"),
  addRank("ラピスラズリ", "#26619c"),
  addRank("ルビー", "#e0115f"),
  addRank("アメジスト", "#9966cc"),
  addRank("ガーネット", "#c93a3a"),

  addRank("グランドマスター", "#ff00aa", "#8800ff"),
  addRank("レジェンド", "#ff5500", "#ffaa00"),

  addRank("✦アルビレオ", "#ffe066"),
  addRank("✦カペラ", "#ffd700"),
  addRank("✦プロキオン", "#fff176"),
  addRank("✦ベガ", "#66ccff"),
  addRank("✦アルタイル", "#33aaff"),
  addRank("✦デネブ", "#88ffff"),
  addRank("✦スピカ", "#66ffcc"),
  addRank("✦フォーマルハウト", "#00ffaa"),
  addRank("✦レグルス", "#ffaa44"),
  addRank("✦アルデバラン", "#ff8844"),
  addRank("✦アンタレス", "#ff4444"),
  addRank("✦ベテルギウス", "#ff6666"),
  addRank("✦リゲル", "#66aaff"),
  addRank("✦アークトゥルス", "#ff9933"),
  addRank("✦カノープス", "#aaffff"),
  addRank("✦ポラリス", "#ffffff"),
  addRank("✦シリウス", "#ccf2ff"),

  addRank("✦アンドロメダ", "#ff99ff", "#66ccff"),
  addRank("✦コズミック", "#3300ff", "#00ffff"),
  addRank("✦ノヴァ", "#ffcc00", "#ff3300"),
  addRank("✦スーパーノヴァ", "#ffffff", "#ff5500"),
  addRank("✦ガンマバースト", "#00ffff", "#ff00ff"),
  addRank("✦ビッグバン", "#ffffff", "#000000"),
  addRank("アセンション", "#ff5555", "#5555ff"),

  addRank("⬢ヘスティア", "#ffddaa"),
  addRank("⬢デメテル", "#99cc66"),
  addRank("⬢ヘルメス", "#66ccff"),
  addRank("⬢アポロン", "#ffcc66"),
  addRank("⬢アルテミス", "#99ffcc"),
  addRank("⬢アフロディーテ", "#ff99cc"),
  addRank("⬢アレス", "#ff4444"),
  addRank("⬢ヘラ", "#ffccff"),
  addRank("⬢アテナ", "#ccccff"),
  addRank("⬢ポセイドン", "#3399ff"),
  addRank("⬢ハデス", "#663399"),
  addRank("⬢ゼウス", "#ffff00", "#ffffff"),

  addRank("⬢スサノオ", "#3366ff", "#00ffff"),
  addRank("⬢ツクヨミ", "#ccccff", "#6666ff"),
  addRank("⬢アマテラス", "#ffffcc", "#ffffff"),

  addRank("⬢クロノス", "#bbbbbb", "#444444"),
  addRank("⬢ガイア", "#66cc66", "#228833"),
  addRank("⬢ウラノス", "#66aaff", "#0033aa"),
  addRank("⬢カオス", "#000000", "#5500aa"),
]

if (2 === 3) {}