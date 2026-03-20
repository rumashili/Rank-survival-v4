fnMainUI = function (myId, myData, displayId = myId) { //markar
  function toRoman(num) {
	const map = [[1000, "M"],[900, "CM"],[500, "D"],[400, "CD"],[100, "C"],[90, "XC"],[50, "L"],[40, "XL"],[10, "X"],[9, "IX"],[5, "V"],[4, "IV"],[1, "I"]];

	let result = "";

	for (const [value, symbol] of map) {
	  while (num >= value) {
    	result += symbol;
    	num -= value;
	  }
	}

	return result;
  }

  function progress(level, nowXP, dence = 20) {
    const maxXP = 500 * level**2;
    const per = Math.min(dence, Math.max(0, Math.floor(nowXP / maxXP * dence)));
    return "[" + "|".repeat(per) + " ".repeat(dence - per) + "]"
  }

  const hasMoney = myData.money ?? 0
  const rein = myData.reincarnation ?? 0

  let rankId = (myData.nowLevel ?? 1) - 1
  if (rankId >= rankList.length) rankId = rankList.length - 1;
  if (rankId >= (rein+1)*10) rankId = (rein+1)*10 - 1;

  const nowLevel = myData.nowLevel ?? 1
  const nowXP = myData.nowXP ?? 0

  const mineLevel = myData.mineLevel ?? 1
  const mineXP = myData.mineXP ?? 0

  const advLevel = myData.advLevel ?? 1
  const advXP = myData.advXP ?? 0

  const farmLevel = myData.farmLevel ?? 1
  const farmXP = myData.farmXP ?? 0

  const skillName = skillIdtoName[myData.nowId ?? 0]
  const myName = api.getEntityName(myId)

  let txt = []

  txt.push({str: "=== ランクサバイバル-v4 ===\n\n", style: {color: "Gold"}})
  txt.push({str: `プレイヤー名: ${myName}\n`})
  txt.push({str: `所持金: ${hasMoney} G\nランク: [ `})
  const rankArr = rankList[rankId]
  txt.push(...rankArr)
  if (rein > 0) {
	const roma = toRoman(rein+1)
	txt.push({str:roma, style:{color:rankArr[rankArr.length-1].style.color}})
  }
  txt.push({str: ` ]\nレベル: Lv.${nowLevel}\n`})

  txt.push({str: `${nowXP} ${progress(nowLevel, nowXP)} ${500 * nowLevel**2}\n\n`})

  txt.push({str: `採掘: Lv.${mineLevel}\n${mineXP} ${progress(mineLevel, mineXP)} ${500 * mineLevel**2}\n`})
  txt.push({str: `開拓: Lv.${advLevel}\n${advXP} ${progress(advLevel, advXP)} ${500 * advLevel**2}\n`})
  txt.push({str: `農業: Lv.${farmLevel}\n${farmXP} ${progress(farmLevel, farmXP)} ${500 * farmLevel**2}\n`})

  api.setClientOption(displayId, "RightInfoText", txt)
}

if (2 === 1) {}