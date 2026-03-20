fnReincarnation = {
  save(myId,data) {
	api.setMoonstoneChestItemSlot(myId, 0, "Gold Trophy", 1, {"customAttributes": {"enchantments": data}})
  },
  load(myId) {
	const tmp = api.getMoonstoneChestItemSlot(myId, 0)
	let data;

	if (tmp == null) {
	  data = {}
	} else {
	  data = tmp.attributes.customAttributes.enchantments
	}

	return data;
  },
  reset(myId) {
	let myData = this.load(myId)
	for (const [key, value] of Object.entries(skillNametoId)) {
	  if (myData[key] !== undefined) {
		delete myData[key]
	  }
	}
	for (const ctgr of ["mine","adv","farm","now"]) {
	  myData[ctgr+"Level"] = 1
	  myData[ctgr+"XP"] = 0
	}
	myData.nowId = 0
	myData.reincarnation = (myData.reincarnation ?? 0) + 1
	this.save(myId,myData)
  },
  displayTrigger() {
	api.createShopItem("転生", "trigger", {
	  image: "Light Blue Directional Arrow",
	  customTitle: "転生",
	  sortPriority: 10000,
	  buyButtonText: "実行"}
	)
  },
  displayDescription(myId) {
	const myData = this.load(myId)
	const reinAmt = myData.reincarnation ?? 0
	const rankId = Math.max(1,Math.min((reinAmt+2)*10,rankList.length))-1;
	let desc = [`ランクと各種レベル,スキルツリーがリセットされます。\n売却額が${reinAmt+2}倍になり、より高いランクに到達可能になります。\nランクの横にローマ数字が付き、転生数を表します。\n[`]
	desc.push(...rankList[rankId])
	desc.push(`]まで到達可能になります。\n採掘,開拓,生産レベルがそれぞれ${(reinAmt+1)*10}を超えている必要があります。`)
	api.createShopItemForPlayer(myId, "転生", "description", {
	  image: "",
	  customTitle: "転生について",
	  description: desc,
	  sortPriority: 10010,
	  canBuy: false}
	)	
  },
  displayRankList(startIdx, range = 8) {
	let desc = []
	for (let i = 0; i < range; i++) {
	  if (startIdx+i >= rankList.length) break;
	  desc.push(`\nLv.${startIdx+i+1}: `)
	  desc.push(...rankList[startIdx+i])
	}
	api.createShopItem("転生", "rankList", {
	  image: "",
	  customTitle: "ランク表",
	  description: desc,
	  sortPriority: 0,
	  canBuy: false}
	)
  }
}

//fnReincarnation.displayRankList(46,6)
//fnReincarnation.displayTrigger()
//fnReincarnation.displayDescription(myId)

if (1 === 2) {}