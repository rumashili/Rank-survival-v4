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
	maxLen = Math.floor(divLen*0.5) //UTF-8では1972,UTF-16では986が限界らしい?
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


//使用例。
const obj = "これはほぼ全ての形式を保存できるセーブロードシステムです。\nただし、JSON stringify/parseを使用しているため、どうしても重くなってしまいました。\n最初にloadを行い、最後にsaveを行うことをお勧めします。\n最大保存可能な文字長は1972文字です。"

myData = dataStorage(myId,"UTF-8")
myData.save(obj)
const msg = myData.load()
api.sendMessage(myId,msg)
