//ランクサバイバル v4
//コードが長くなる気がしたのでデータ関連は別で保存しています。(ここになくてごめんね。)
//メインコードは残しておきます。
//world code + 10個のfunctionLoaderで構成されています。(3/20現在)
//総文字数は33000程度です。

wcSellData = null
functionLoaded = false

skillTree = {}
skillIdtoName = {}
skillNametoId = {}
skillRequiers = {}

const ownerList = ["knkt_kabosu","rewr3"]

function saveData(myId, data) {
  api.setMoonstoneChestItemSlot(myId, 0, "Gold Trophy", 1, {"customAttributes": {"enchantments": data}})
}

function loadData(myId) {
  const tmp = api.getMoonstoneChestItemSlot(myId, 0)
  let data;
  if (tmp == null) {
    data = {}
  } else {
    data = tmp.attributes.customAttributes.enchantments
  }
  return data;
}

function addValue(data, type) {
  let addition = 0
  for (const [key, value] of Object.entries(skillTree)) {
    if (data[key] !== undefined) {
      if (value.upgradeName === type) {
        addition += value.upgradeK * data[key]
      }
    }
  }
  return addition;
}

function addXP(myId, category, xp, JP) {
  let myData = loadData(myId)
  let nowLevel = myData[category + "Level"] ?? 1
  let maxXP = 500 * nowLevel**2
  let nowXP = (myData[category + "XP"] ?? 0) + xp

  api.sendMessage(myId, [{str: `${xp}の${JP}XPを得ました!`, style: {color: "Lime"}}])

  if (nowXP >= maxXP) {
    while (nowXP >= maxXP) {
      nowXP -= maxXP
      nowLevel++
      maxXP = 500 * nowLevel**2
    }
    api.sendMessage(myId, [{str: `${JP}のレベルが上がりました!`, style: {color: "Lime"}}])
  }

  myData[category + "Level"] = nowLevel
  myData[category + "XP"] = nowXP
  saveData(myId, myData)
}

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



onPlayerBoughtShopItem = (myId, category, key, item, input) => {
  if (category === "スキルツリー") {
    const sk = item.customTitle
    if (sk === "プレステージ") {
        api.sendMessage(myId, [{str: `プレステージを実行しました。`, style: {color: "Lime"}}])

        let data = loadData(myId)
        data.nowId = 0
        saveData(myId, data)

        fnDisplaySkillTree(myId, "root")
    } else {
      const crc = skillTree[sk].costCrc
      const haveAmt = api.getInventoryItemAmount(myId, crc)
      const needAmt = skillTree[sk].costAmt

      if (haveAmt >= needAmt) {
        api.sendMessage(myId, [{str: `スキル [${sk}] を取得しました。`, style: {color: "Lime"}}])
        api.removeItemName(myId, crc, needAmt)

        let data = loadData(myId)
        data.nowId = skillNametoId[sk]
        data[sk] = (data[sk] ?? 0) + 1
        saveData(myId, data)
        fnDisplaySkillTree(myId, sk)
        fnShop.displayAllList(myId)
      } else {
        api.sendMessage(myId, [{str: `${crc}があと${needAmt - haveAmt}個足りません。`, style: {color: "Orange"}}])
      }
    }
  }

  if (category.includes("売却")) {
    const ctgr = category.replace("売却:","")
    if (key === "selector") {
	  if (selectionBlock[myId] === undefined) {
		selectionBlock[myId] = {
		  "採掘":wcSellData["採掘"].list[0],
		  "開拓":wcSellData["開拓"].list[0],
		  "生産":wcSellData["生産"].list[0]
		}
        api.sendMessage(myId, [{str: `実行に失敗しました。再び試してください。`, style: {color: "Orange"}}])
		return;
	  }
      selectionBlock[myId][ctgr] = input;
      api.sendMessage(myId, [{str: `売却アイテムを${input}に設定しました。`, style: {color: "Lime"}}])
	  fnShop.displayAllSelector(myId)
    } else if (key === "seller") {
	  if (selectionBlock[myId] === undefined) {
		selectionBlock[myId] = {
		  "採掘":wcSellData["採掘"].list[0],
		  "開拓":wcSellData["開拓"].list[0],
		  "生産":wcSellData["生産"].list[0]
		}
        api.sendMessage(myId, [{str: `実行に失敗しました。再び試してください。`, style: {color: "Orange"}}])
		return;
	  }

      const sellBlock = selectionBlock[myId][ctgr] ?? wcSellData[ctgr].name ?? null;
      if (sellBlock === null) {
        api.sendMessage(myId, [{str: `ブロックを選択してください。`, style: {color: "Orange"}}])
        return;
      }
      const sellItem = wcSellData.dictionary[sellBlock]

      const hasAmt = api.getInventoryItemAmount(myId, sellItem)
      if (hasAmt === 0) {
        api.sendMessage(myId, [{str: `${sellBlock}を持っていません。`, style: {color: "Orange"}}])
        return;
      }

      let sellAmt = input
	  if (sellAmt === "all") {
		sellAmt = hasAmt
	  } else {
		sellAmt = Number(sellAmt)
	  }
      const data = loadData(myId)
      const extraG = addValue(data, sellItem) ?? 0

      let removeAmt;
      if (sellAmt > hasAmt) {
        removeAmt = hasAmt;
      } else {
        removeAmt = sellAmt;
      }

      api.removeItemName(myId, sellItem, removeAmt)

	  const rein = data.reincarnation ?? 1
      const unitPrice = (wcSellData[ctgr][sellItem].value + extraG) * rein
      const gainMoney = removeAmt * unitPrice

      data.money = Math.min(9999999999, (data.money ?? 0) + gainMoney)

      saveData(myId, data)
      api.sendMessage(myId, [
        {str: `${sellBlock}を売って${gainMoney}Gを得ました。( ${unitPrice}G/個 )`, style: {color: "Lime"}}
      ])


      if (ctgr.includes("採掘")) {
        addXP(myId, "mine", gainMoney, "採掘")
      } else if (ctgr.includes("開拓")) {
        addXP(myId, "adv", gainMoney, "開拓")
      } else {
        addXP(myId, "farm", gainMoney, "農業")
      }

      addXP(myId, "now", Math.max(1,Math.floor(gainMoney / 2)), "トータル")

      fnMainUI(myId)
    }
  }

  if (category === "転生") {
	if (key === "trigger") {
	  const myData = loadData(myId)
	  const mineLv = myData.mineLevel ?? 1
	  const advLv = myData.advLevel ?? 1
	  const farmLv = myData.farmLevel ?? 1
	  const rein = myData.reincarnation ?? 0
	  const rqLv = (rein+1)*10

	  if (mineLv >= rqLv && advLv >= rqLv && farmLv >= rqLv) {
		fnReincarnation.reset(myId)
		fnDisplaySkillTree(myId, (skillIdtoName[myData.nowId ?? 0]))
		fnShop.displayAllList(myId)
		fnReincarnation.displayDescription(myId)
		fnMainUI(myId)		
        api.sendMessage(myId, [{str: `転生を実行しました。`, style: {color: "Lime"}}])
	  } else {
        api.sendMessage(myId, [{str: `条件を満たしていません。\n採掘,開拓,生産レベルが全て${rqLv}以上であることが求められます。`, style: {color: "Orange"}}])		
	  }
	}
  }

  if (category === "トレード") {
    let myData = loadData(myId)

    if (key === "export") {
      if (input === "") {
        api.sendMessage(myId, [{str: "半角数字のみで金額を指定してください。", style: {color: "Orange"}}])
        return;
      }

      const tradingAmt = myData.tradingAmt ?? 1
      if (tradingAmt >= 4) {
        api.sendMessage(myId, [{str: "同時に出品できるアイテムは3個までです。", style: {color: "Orange"}}])
        return;
      }

      const idx = fnTradeStorage.import(myId, Number(input))
      if (idx === "noItem") {
        api.sendMessage(myId, [{str: "出品するアイテムを手に持ってください。", style: {color: "Orange"}}])
        return;
      }
      if (idx === "noSpace") {
        api.sendMessage(myId, [{str: "トレードストレージに十分な空きがありません。", style: {color: "Orange"}}])
        return;
      }

      myData.tradingAmt = tradingAmt + 1
      saveData(myId, myData)

      fnTradeDisplay.unit(idx)
      return;
    }

    const hasMoney = myData.money ?? 0
    const reqMoney = fnTradeStorage.export(myId, Number(key), hasMoney)

    if (reqMoney.type === "full") {
      api.sendMessage(myId, [{str: "インベントリが満杯です", style: {color: "Orange"}}])
      return;
    }
    if (reqMoney.type === "noItem") {
      api.sendMessage(myId, [{str: "すでに購入されています", style: {color: "Orange"}}])
      return;
    }
    if (reqMoney.type === "notEnough") {
      api.sendMessage(myId, [{str: "お金が足りません", style: {color: "Orange"}}])
      return;
    }

    if (reqMoney.type === "success") {
      const playerId = reqMoney.playerId
      let playerData = loadData(playerId)
      playerData.money = (playerData.money ?? 0) + reqMoney.price
      playerData.tradingAmt = Math.max(1, ((playerData.tradingAmt ?? 1) - 1))
      saveData(playerId, playerData)
    }

    myData.money = hasMoney - reqMoney.price
    saveData(myId, myData)

    api.deleteShopItem(category, key)
    fnMainUI(myId)
  }
}

onPlayerJoin = (myId) => {
  if (!functionLoaded) {
    api.setPosition(myId, [33.5, 4, 619.5])
  } else {
    api.setPosition(myId, [37.5, 4, 619.5])
  }
  api.removeItemCraftingRecipes(myId, "Moonstone Chest")
}

onPlayerLeave = (myId) => {
  const pos = api.getPosition(myId).map(x => Math.floor(x) + 400000)
  let data = loadData(myId)
  data.lastX = pos[0]
  data.lastY = pos[1]
  data.lastZ = pos[2]
  saveData(myId, data)
}

onPlayerAttemptOpenChest = (myId, x, y, z, moon) => {
  if (ownerList.includes(api.getEntityName(myId))) return;
  if (moon) {
    api.sendMessage(myId, [{str: "このサーバーではムーンストーンチェストは使用できません", style: {color: "Orange"}}])
    return "preventOpen";
  }
}

onPlayerChat = (myId, msg) => {
  const myData = loadData(myId)
  const myName = api.getEntityName(myId)
  const rein = myData.reincarnation ?? 0

  let rankId = (myData.nowLevel ?? 1) - 1
  if (rankId >= rankList.length) rankId = rankList.length - 1;
  if (rankId >= (rein+1)*10) rankId = (rein+1)*10 - 1;

  const rankArr = rankList[rankId]
  let txt = [...rankArr]
  if (rein > 0) {
	const roma = toRoman(rein+1)
	txt.push({str:roma, style:{color:rankArr[rankArr.length-1].style.color}})
  }
  txt.push({str: " " + myName + ": " + msg})

  api.broadcastMessage(txt)
  return false;
}

/*
onPlayerChangeBlock = (myId, x, y, z, from, to) => {
  if (!ownerList.includes(api.getEntityName(myId))) return

  if (to === "Andesite") {
    if (Math.random() > 0.7) {
      api.setBlock(x, y, z, "Stone")
    } else if (Math.random() > 0.4) {
      api.setBlock(x, y, z, "Messy Stone")
    }
  }
}
*/
