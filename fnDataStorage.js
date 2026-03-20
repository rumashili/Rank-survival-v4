function dataStorage (Id, type = "UTF-8",maxLength = 1972) {
  let targetType
  if (typeof Id === "string") {
	if (api.playerIsInGame(Id)) {
	  targetType = "player"
	} else {
	  throw new Error("プレイヤーが存在しません。")
	}
  } else if (Array.isArray(Id)) {
	if (Id.length !== 3) throw new Error("3次元座標を指定してください。")
	targetType = "world"
  } else {
	throw new Error("Idが不明な形式です。")
  }

  let maxLen = Math.min(1968,Math.max(1,Math.floor(maxLength)));
  if (type === "UTF-16") {
	maxLen = Math.floor(maxLen*0.5) //UTF-8では1972,UTF-16では986が限界らしい?
  }

  function save(data, slot = 0) {
	let str = JSON.stringify(data)
	if (str.length > maxLen) throw new Error("データが長すぎるようです。\nデータを分割して別スロットに保存することをお勧めします。")
	const enc = {customDisplayName:str}
	if (targetType === "player") {
	  api.setMoonstoneChestItemSlot(Id, slot, "Gold Trophy", 1, enc)
	} else {
	  api.setStandardChestItemSlot(Id, slot, "Gold Trophy", 1, undefined, enc)
	}
  }

  function load(slot = 0) {
	let tmp
	if (targetType === "player") {
	  tmp = api.getMoonstoneChestItemSlot(Id, slot)
	} else {
	  tmp = api.getStandardChestItemSlot(Id, slot)
	}
	
	if (!tmp?.attributes?.customDisplayName) return null;
	const str = tmp.attributes.customDisplayName;
	return JSON.parse(str)
  }

  return { save, load }
}



//引き継ぎのコード
let obj = loadData(myId)
obj.money = String(obj.money)
obj.lastX -= 400000
obj.lastY -= 400000
obj.lastZ -= 400000

let myDataStorage = dataStorage(myId)
myDataStorage.save(obj,1)

//お金の加算(このloadにしてからめっちゃコードが短くなった。)
const myData = myDataStorage.load(1)
myData.money = BigNum(myData.money).add(BigNum(10000000000000000)).toString()