fnTradeStorage = {
  getData(idx) { //チェストの位置を取得します。
    const tmp = Math.floor(idx/36)
    return {pos:[33+tmp, 15, 631], slot: idx%36};
  },
  getPos(idx) { //コードブロックの位置を取得します。
	const x = Math.floor(idx/36)
	const y = Math.floor(idx/18)%2
	return [33+x, 17-y, 631];
  },

  find() { //コードブロックから空きスロットを取得します。
	for (let i = 0; i < 5; i++) {
	  const state = this.getState(i*18)
	  for (let j = 0; j < 18; j++) {
		if (state[j] === null) return i * 18 + j;
	  }
	}
	return "noSpace";
  },

  getState(idx) { //特定スロットの状態を取得します。ただし、返されるのはスロットの情報を含む長さ18の配列です。
	const pos = this.getPos(idx)
	let data = api.getBlockData(...pos);
	if (data === undefined) {
	  data = ""
	} else {
	  data = data.persisted.shared.text
	}
	if (data === "") {
	  data = new Array(18).fill(null)
	} else {
	  data = JSON.parse(data)
	  while (data.length < 18) {
		data.push(null)
	  }
	}

	return data;
  },
  setState(idx,data) { //コードブロックに情報を書き込みます。getStateとセットで使うことが大半です。
	const pos = this.getPos(idx)
	api.setBlockData(...pos, {persisted:{shared:{text:JSON.stringify(data)}}})
  },

  load(idx) { //チェストのアイテムを取得します。
    const data = this.getData(idx)
    return api.getStandardChestItemSlot(data.pos, data.slot)
  },
  save(idx, item) { //チェストにアイテムを格納します。
    const data = this.getData(idx)
    api.setStandardChestItemSlot(data.pos, data.slot, item.name, item.amount, undefined, item.attributes)
  },

  import(myId,price) { //手に持っているアイテムを格納します。
	const item = api.getHeldItem(myId)
	if (item === null) {
	  return "noItem";
	}

	const idx = this.find()
	if (idx === "noSpace") {
	  return "noSpace"
	}

	this.save(idx, item)

	let data = this.getState(idx)
	const playerDbId = api.getPlayerDbId(myId)
	const playerName = api.getEntityName(myId)
	data[idx%18] = {type:"listing", name: playerName, dbId:playerDbId, price:Math.max(0,Math.min(1000000,Math.floor(price)))}
	this.setState(idx,data)

	const nowSlot = api.getSelectedInventorySlotI(myId)
	api.setItemSlot(myId, nowSlot, "Air")
	return idx;
  },
  export(myId,idx,hasMoney) { //
	if (api.inventoryIsFull(myId)) {
	  return {type:"full"};
	}

	let state = this.getState(idx)
	const price = state[idx%18].price

	if (state[idx%18] === null) {
	  return {type:"noItem"}
	}
	if (state[idx%18].type === "soldOut") {
	  return {type:"noItem"}
	}
	if (price > hasMoney) {
	  return {type:"notEnough"}
	}

	const playerId = api.getPlayerIdFromDbId(state[idx%18].dbId);
	const myName = api.getEntityName(myId)
	const item = this.load(idx)
	let resultType = "success"

	if (playerId === null) { //オフライン状態
	  state[idx%18].type = "soldOut"
	  state[idx%18].name = api.getEntityName(myId) //購入者(自分)
	  resultType = "offline"
	} else {
	  api.sendMessage(playerId,[{str:`${myName}さんが${item.name}を買いました。\n${price} Gを得ました。`, style:{color:"Cyan"}}])
	  state[idx%18] = null
	}

	this.setState(idx, state)
	this.save(idx, {name:"Air", amount:1, attributes:{}})
	api.giveItem(myId, item.name, item.amount, item.attributes)
	return {type:resultType, price:price, playerId: playerId}
  }
}

if (2 === 1) {}