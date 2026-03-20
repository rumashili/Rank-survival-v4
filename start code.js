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

selectionBlock[myId] = {
  "採掘":wcSellData["採掘"].list[0],
  "開拓":wcSellData["開拓"].list[0],
  "生産":wcSellData["生産"].list[0]
}

fnTradeDisplay.display()
fnReincarnation.displayTrigger()

let myData = loadData(myId)
const offlineIncome = fnTradeOffline(myId)
myData.money = Math.min(9999999999, (myData.money ?? 0) + offlineIncome)
saveData(myId,myData)
fnDisplaySkillTree(myId, (skillIdtoName[myData.nowId ?? 0]))
fnShop.displayAll(myId)
fnReincarnation.displayDescription(myId)
fnMainUI(myId)
