wcSellData = {"dictionary":{},"採掘":{},"開拓":{},"生産":{}}
selectionBlock = {}

fnShop = {
  addValue(myData) { //スキルによる上昇効果を取得します。 //markar
	let addition = {}
	for (const [key, value] of Object.entries(skillTree)) {
	  if (myData[key] !== undefined) {
		const tmp = addition[value.upgradeName] ?? 0
		addition[value.upgradeName] = tmp + value.upgradeK * myData[key]
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
  displayList(myId,category,myData) { //各商品の売却額を表示させます。
	const extra = this.addValue(myData) ?? {}
	const rein = (myData.reincarnation ?? 0) + 1 //markar
	let desc = [`白い文字は実際の売却価格です。\n`,{str:"黄色い文字",style:{color:"Gold"}},`はスキルによる上昇効果です。\n転生によって `,{str:`x${rein}`,style:{color:"#00ffff"}},`の上昇を得ています。\n`]
	for (const name of (wcSellData[category].list ?? [])) {
	  const item = wcSellData.dictionary[name]
	  const value = wcSellData[category][item].value
	  let price = extra[item] ?? 0
	  desc.push(`\n`)
	  desc.push({icon:item})
	  desc.push(`${name}: ${(value+price)*rein} G | XP`)
	  if (price !== 0) {
		desc.push(`(`)
		desc.push({str:`+${price*rein}`,style:{color:"Gold"}})
		desc.push(`)`)
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

	this.add("開拓","Dirt","土",3)
	this.add("開拓","Sand","砂",3)
	this.add("開拓","Clay","粘土",5)
	this.add("開拓","Chalk","チョーク",5)
	this.add("開拓","Snow","雪",4)
	this.add("開拓","Maple Log","メープルの原木",30)
	this.add("開拓","Maple Leaves","メープルの葉",3)
	this.add("開拓","Cotton","綿",3)
	this.add("開拓","Brown Mushroom","茶色のきのこ",6)
	this.add("開拓","Red Mushroom","赤のきのこ",6)
	this.add("開拓","Rotten Flesh","腐肉",16)
	this.add("開拓","Bone","骨",16)

	this.add("生産","Apple","りんご",20)
	this.add("生産","Plum","すもも",20)
	this.add("生産","Pear","なし",20)
	this.add("生産","Cherry","さくらんぼ",20)
	this.add("生産","Mango","マンゴー",20)
	this.add("生産","Coconut","ココナッツ",20)
	this.add("生産","Banana","バナナ",6)
	this.add("生産","Wheat","小麦",8)
	this.add("生産","Rice","米",8)
	this.add("生産","Raw Potato","じゃがいも",15)
	this.add("生産","Carrot","にんじん",15)
	this.add("生産","Beetroot","ビートルート",15)
	this.add("生産","Watermelon Slice","スイカの薄切り",6)
	this.add("生産","Melon Slice","メロンの薄切り",6)
	this.add("生産","Pumpkin","かぼちゃ",10)
  },
  displayAllList(myId,myData) { //リストのみを表示させます。更新に使います。
	this.displayList(myId,"採掘",myData)
	this.displayList(myId,"開拓",myData)
	this.displayList(myId,"生産",myData)
  },
  displayAllSelector(myId,myData) { //リストのみを表示させます。更新に使います。
	this.displaySelector(myId,"採掘",myData)
	this.displaySelector(myId,"開拓",myData)
	this.displaySelector(myId,"生産",myData)
  },
  displayAll(myId,myData) { //全てを表示させます。
	this.displaySelector(myId,"採掘")
	this.displaySeller(myId,"採掘")
	this.displayList(myId,"採掘",myData)
	this.displaySelector(myId,"開拓")
	this.displaySeller(myId,"開拓")
	this.displayList(myId,"開拓",myData)
	this.displaySelector(myId,"生産")
	this.displaySeller(myId,"生産")
	this.displayList(myId,"生産",myData)
  },
}

fnShop.reset()

if (2 === 1) {}