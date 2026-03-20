selectionBlock[myId] = {
  "採掘":wcSellData["採掘"].list[0],
  "開拓":wcSellData["開拓"].list[0],
  "生産":wcSellData["生産"].list[0]
}

fnTradeDisplay.display()
fnReincarnation.displayTrigger()

let myDataStorage = dataStorage(myId)
let myData = myDataStorage.load(1) //markar
const offlineIncome = fnTradeOffline(myId)
myData.money = Math.min(9999999999, (myData.money ?? 0) + offlineIncome)
myDataStorage.save(myData,1)
fnDisplaySkillTree(myId, (skillIdtoName[myData.nowId ?? 0]))
fnShop.displayAll(myId,myData)
fnReincarnation.displayDescription(myId)
fnMainUI(myData)
