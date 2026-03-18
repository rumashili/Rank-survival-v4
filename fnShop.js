wcSellData = {"dictionary":{},"採掘":{},"開拓":{},"生産":{}}
selectionBlock = {}


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

fnShop = {
  addValue(myId) { //スキルによる上昇効果を取得します。
	const data = loadData(myId)
	let addition = {}
	for (const [key, value] of Object.entries(skillTree)) {
	  if (data[key] !== undefined) {
		const tmp = addition[value.upgradeName] ?? 0
		addition[value.upgradeName] = tmp + value.upgradeK * data[key]
	  }
	}
	return addition;
  },

  displaySelector(myId,category) { //売却するブロックを選択するitemです。
	const selectedBlock = selectionBlock[myId][category] ?? wcSellData[category].list[0] ?? "";
	api.createShopItemForPlayer(myId, "売却:"+category, "selector", {
	  image: "",
	  customTitle: "ブロックを選択",
	  description: `売却するブロックを選択。\n現在選択されているブロック: ${selectedBlock}`,
	  userInput: {
		type: "dropdown",
		dropdownOptions: (wcSellData[category].list ?? []),
	  },
	  sortPriority: 20,
	  buyButtonText: "選択"}
	)
  },
  displaySeller(myId,category) { //売却するitemです。
	api.createShopItemForPlayer(myId, "売却:"+category, "seller", {
	  image: "",
	  customTitle: "売却",
	  description: `売却数を選択。`,
	  userInput: {
		type: "dropdown",
		dropdownOptions: ["1","10","100","999","all"],
	  },
	  sortPriority: 10,
	  buyButtonText: "売却"}
	)
  },
  displayList(myId,category) { //各商品の売却額を表示させます。
	const extra = this.addValue(myId) ?? {}
	let desc = [{str:"黄色い文字",style:{color:"Gold"}},{str:"はスキルによる上昇効果です。\n"}]
	for (const name of (wcSellData[category].list ?? [])) {
	  const item = wcSellData.dictionary[name]
	  const value = wcSellData[category][item].value
	  let price = extra[item]
	  desc.push({icon:item})
	  if (price === undefined) {
		desc.push({str:`${name}: ${value} G | XP\n`})
	  } else {
		desc.push({str:`${name}: ${value + price} (`})
		desc.push({str:`+${price}`,style:{color:"Gold"}})
		desc.push({str:`) G | XP\n`})
	  }
	}
	api.createShopItemForPlayer(myId, "売却:"+category, "list", {
	  image: "",
	  customTitle: "価格表",
	  description: desc,
	  sortPriority: 0,
	  canBuy: false}
	)
  },

  base(category) { //addを実行する前に読んでください。初期化用関数です。
	wcSellData[category] = {list:[]}
  },
  add(category, item, name, value) { //売却可能商品を追加します。
	wcSellData[category].list.push(name)
	wcSellData.dictionary[item] = name	
	wcSellData.dictionary[name] = item
	wcSellData[category][item] = {name:name, value:value}
  },
  reset() { //データを用意する関数です。
	wcSellData.dictionary = {}

	this.base("採掘")
	this.base("開拓")
	this.base("生産")

	this.add("採掘","Stone","石",1)
	this.add("採掘","Messy Stone","丸石",1)
	this.add("採掘","Andesite","安山岩",2)
	this.add("採掘","Granite","花崗岩",2)
	this.add("採掘","Diorite","閃緑岩",2)
	this.add("採掘","Coal","石炭",15)
	this.add("採掘","Raw Iron","鉄",30)
	this.add("採掘","Raw Gold","金",80)
	this.add("採掘","Diamond","ダイヤモンド",150)
	this.add("採掘","Moonstone","ムーンストーン",250)
	this.add("採掘","Magma","マグマブロック",6)

	this.add("開拓","Dirt","土",1)
	this.add("開拓","Sand","砂",1)
	this.add("開拓","Clay","粘土",2)
	this.add("開拓","Chalk","チョーク",2)
	this.add("開拓","Snow","雪",1)
	this.add("開拓","Maple Log","メープルの原木",10)
	this.add("開拓","Maple Leaves","メープルの葉",2)
	this.add("開拓","Cotton","綿",1)
	this.add("開拓","Brown Mushroom","茶色のきのこ",4)
	this.add("開拓","Red Mushroom","赤のきのこ",4)
	this.add("開拓","Rotten Flesh","腐肉",5)
	this.add("開拓","Bone","骨",5)

	this.add("生産","Apple","りんご",4)
	this.add("生産","Plum","すもも",4)
	this.add("生産","Pear","なし",4)
	this.add("生産","Cherry","さくらんぼ",4)
	this.add("生産","Mango","マンゴー",4)
	this.add("生産","Coconut","ココナッツ",4)
	this.add("生産","Banana","バナナ",3)
	this.add("生産","Wheat","小麦",6)
	this.add("生産","Rice","米",6)
	this.add("生産","Raw Potato","じゃがいも",6)
	this.add("生産","Carrot","にんじん",6)
	this.add("生産","Beetroot","ビートルート",6)
	this.add("生産","Watermelon Slice","スイカの薄切り",3)
	this.add("生産","Melon Slice","メロンの薄切り",3)
	this.add("生産","Pumpkin","かぼちゃ",3)
  },
  displayAll(myId) { //全てを表示させます。
	this.displaySelector(myId,"採掘")
	this.displaySeller(myId,"採掘")
	this.displayList(myId,"採掘")
	this.displaySelector(myId,"開拓")
	this.displaySeller(myId,"開拓")
	this.displayList(myId,"開拓")
	this.displaySelector(myId,"生産")
	this.displaySeller(myId,"生産")
	this.displayList(myId,"生産")
  },
  displayAllList(myId) { //リストのみを表示させます。更新に使います。
	this.displayList(myId,"採掘")
	this.displayList(myId,"開拓")
	this.displayList(myId,"生産")
  }
}


fnShop.reset()
fnShop.displayAll(myId)