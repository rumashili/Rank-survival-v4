fnTradeDisplay = {
  unit(idx) {
	const item = fnTradeStorage.load(idx)
	if (item !== null) {
	  const state = fnTradeStorage.getState(idx)[idx%18]
	  const playerName = state.name
	  const price = state.price
	  const name = item.name
	  const customName = item.attributes.customDisplayName ?? name
	  const amt = item.amount
	  const atr = item.attributes.customAttributes ?? {}
	  const enc = atr.enchantments ?? {}
	  const tier = (atr.enchantmentTier ?? "Tier 0").slice(-1)
	  const color = ["white","#aaaaaa","lime","#55ffff","#ff55ff","#ffff55"][Number(tier)]

	  let desc = []
	  for (const [eName,eLv] of Object.entries(enc)) {
		desc.push(`${eName} - ${eLv}\n`)
	  }
	  desc.push(`出品者: ${playerName}`)

	  const obj = {
		customTitle: [{str:customName,style:{color:color}}],
		image: name,
		description: desc,
		sortPriority: idx,
		canBuy: true,
		buyButtonText: `${price} G`,
		amount: amt
	  }

	  api.createShopItem("トレード",String(idx),obj)
    }
  },
  base () {
	api.createShopItem("トレード","description",{
	  image: "Gold Coin",
	  customTitle: "トレード",
	  description: [{str:`ユーザー間でアイテムの取引を行うことができます。\n右の出品ボタンではあなたが手に持っているアイテムを指定の金額で出品します。\n出品したアイテムが購入された時、あなたにお金が入ります。`}],
	  sortPriority: 100002,
	  canBuy: false}
	)
	api.createShopItem("トレード","export",{
	  image: "Crate",
	  customTitle: "出品",
	  description: "金額を指定してください。",
	  sortPriority: 100001,
	  canBuy: true,
	  userInput: {type:"number"},
	  buyButtonText: "出品"
	  }
	)
  },
  display () {
	for (let i = 0; i < 90; i++) {
	  this.unit(i)
	}
	this.base()
  }
}

fnTradeDisplay.display()