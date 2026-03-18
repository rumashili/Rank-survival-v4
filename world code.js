//ランクサバイバル v4
//コードが長くなる気がしたのでデータ関連は別で保存しています。(ここになくてごめんね。)
//メインコードは残しておきます。

wcSellData = null

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
  if (wcSellData === null) {
    api.setPosition(myId, [33.5, 15, 619.5])
  } else {
    api.setPosition(myId, [37.5, 15, 619.5])
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

  let rankId = (myData.nowLevel ?? 1) - 1
  if (rankId >= rankList.length) rankId = rankList.length - 1;

  let txt = [...rankList[rankId]]
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