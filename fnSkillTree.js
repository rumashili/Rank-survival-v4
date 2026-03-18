function addSkill(tree,name,ugName,ugk,icon,crc,amt,next,utility = false, key = name) {
  let desc
  if (ugk === 0) {
	desc = ugName
  } else {
	try {
	  desc = `${wcSellData.dictionary[ugName]}の獲得XP +${ugk}`
	} catch(e) {
	  api.log(ugName)
	}
  }

  tree[key] = {
	name: name,
	upgradeName: ugName,
	upgradeK: ugk,
	desc: desc,
	icon: icon,
	costCrc: crc,
	costAmt: amt,
	nex: next,
	util: utility //スキルツリーには直接関係しない場合、util=true
  }
}

function generateSkillTree() {
  let skillTree = {}

  addSkill(skillTree,"スキルツリー","取得するスキルを選択してください。",0,"Maple Sapling","",0,[],true,"title")
  addSkill(skillTree,"-","",0,"","",0,[],true,"none")
  addSkill(skillTree,"","",0,"","",0,["採掘者","開拓者","生産者"],false,"root")
  addSkill(skillTree,"プレステージ","スキルで得た上昇効果を残したままスキルツリーをリセットします。",0,"Diamond","",0,[],false,"prestage")

  addSkill(skillTree,"採掘者","Messy Stone",1,"Wood Pickaxe","Messy Stone",100,["鉱夫","宝石収集家","石好き"])
  addSkill(skillTree,"開拓者","Dirt",1,"Wood Axe","Dirt",50,["探索者","木こり","砂掘り"])
  addSkill(skillTree,"生産者","Wheat",1,"Wood Hoe","Wheat Seeds",5,["農家","果樹農家"])

  addSkill(skillTree,"鉱夫","Coal",2,"Coal","Coal",100,["炭鉱夫","鉄鉱夫"])
  addSkill(skillTree,"宝石収集家","Diamond",2,"Diamond","Diamond",10,["招き猫","鑑定家","月へ"])
  addSkill(skillTree,"石好き","Messy Stone",2,"Pebble","Messy Stone",500,["地質学者","火山学者","石マニア"])
  addSkill(skillTree,"探索者","",0,"Maple Leaves","Maple Leaves",300,["採集家","冒険家"])
  addSkill(skillTree,"木こり","Maple Log",1,"Maple Log","Maple Log",150,["伐採業者"])
  addSkill(skillTree,"砂掘り","Sand",1,"Wood Spade","Sand",500,["整地師"])
  addSkill(skillTree,"農家","",0,"Wheat","Wheat",50,["小麦農家","米農家","野菜農家"])
  addSkill(skillTree,"果樹農家","",0,"Apple","Apple",50,["りんご農家","なし農家","ココナッツ農家"])

  addSkill(skillTree,"炭鉱夫","Coal",5,"Coal","Coal",800,["炭屋"])
  addSkill(skillTree,"鉄鉱夫","Raw Iron",5,"Iron Ore","Raw Iron",550,["深層鉱夫"])
  addSkill(skillTree,"招き猫","Raw Gold",5,"Gold Fragment","Gold Bar",400,["富豪"])
  addSkill(skillTree,"鑑定家","Diamond",6,"Diamond","Diamond",250,["宝石職人"])
  addSkill(skillTree,"月へ","Moonstone",8,"Moonstone","Moonstone",100,["宇宙飛行士"])
  addSkill(skillTree,"地質学者","",0,"Rocky Dirt","Granite",1000,["閃緑岩採掘者","花崗岩採掘者"])
  addSkill(skillTree,"火山学者","",0,"Magma","Magma",250,["安山岩採掘者","燃ゆる炎"])
  addSkill(skillTree,"石マニア","Messy Stone",3,"Reinforced Pebble","Messy Stone",2500,["石を愛す者"])
  addSkill(skillTree,"採集家","",0,"Fallen Pine Cone","Fallen Pine Cone",150,["綿職人","きのこ農家"])
  addSkill(skillTree,"冒険家","",0,"Wood Sword","Rotten Flesh",100,["ゾンビスレイヤー","スケルトンスレイヤー"])
  addSkill(skillTree,"伐採業者","Maple Log",2,"Stone Axe","Maple Log",1250,["ビッグモーター"])
  addSkill(skillTree,"整地師","Dirt",2,"Stone Spade","Dirt",2000,["ベテラン整地師"])
  addSkill(skillTree,"小麦農家","Wheat",3,"Wheat","Wheat",250,["prestage"])
  addSkill(skillTree,"米農家","Rice",3,"Bowl of Rice","Rice",250,["prestage"])
  addSkill(skillTree,"野菜農家","",0,"Corn","Corn",250,["にんじん農家","スイカ農家","コーン農家"])
  addSkill(skillTree,"りんご農家","Apple",3,"Apple","Apple",200,["さくらんぼ農家"])
  addSkill(skillTree,"なし農家","Pear",3,"Pear","Pear",200,["すもも農家"])
  addSkill(skillTree,"ココナッツ農家","Coconut",3,"Coconut","Coconut",200,["マンゴー農家"])

  addSkill(skillTree,"炭屋","Coal",5,"Block of Coal","Coal",5000,["prestage"])
  addSkill(skillTree,"深層鉱夫","Raw Iron",7,"Block of Iron","Raw Iron",3000,["prestage"])
  addSkill(skillTree,"富豪","Raw Iron",10,"Block of Iron","Raw Gold",2000,["prestage"])
  addSkill(skillTree,"宝石職人","Diamond",15,"Block of Diamond","Diamond",800,["prestage"])
  addSkill(skillTree,"宇宙飛行士","Moonstone",25,"Yellowstone","Moonstone",250,["prestage"])
  addSkill(skillTree,"閃緑岩採掘者","Granite",3,"Diorite","Granite",3000,["prestage"])
  addSkill(skillTree,"花崗岩採掘者","Granite",3,"Granite","Granite",3000,["prestage"])
  addSkill(skillTree,"安山岩採掘者","Andesite",3,"Andesite","Andesite",3000,["prestage"])
  addSkill(skillTree,"燃ゆる炎","Magma",5,"Fire ball","Magma",1250,["prestage"])
  addSkill(skillTree,"石を愛す者","Messy Stone",4,"Complessed Messy Stone","Messy Stone",8000,["石に愛された者"])
  addSkill(skillTree,"綿職人","Cotton",3,"Cotton","Cotton",2000,["prestage"])
  addSkill(skillTree,"きのこ農家","Brown Mushroom",3,"Brown Mushroom","Brown Mushroom",1500,["毒きのこがお好き?"])
  addSkill(skillTree,"ゾンビスレイヤー","Rotten Flesh",5,"Rotten Flesh","Rotten Flesh",1000,["prestage"])
  addSkill(skillTree,"スケルトンスレイヤー","Bone",5,"Bone","Bone",1000,["prestage"])
  addSkill(skillTree,"ビッグモーター","Maple Log",5,"Stick","Maple Log",3500,["prestage"])
  addSkill(skillTree,"ベテラン整地師","Dirt",3,"Iron Spade","Dirt",7500,["ロードローラー"])
  addSkill(skillTree,"にんじん農家","Carrot",3,"Carrot","Carrot",3000,["じゃがいも農家"])
  addSkill(skillTree,"スイカ農家","Watermelon Slice",2,"Watermelon","Watermelon Slice",3000,["メロン農家"])
  addSkill(skillTree,"コーン農家","Maple Log",3,"Corn","Corn",3000,["ビートルート農家"])
  addSkill(skillTree,"さくらんぼ農家","Cherry",3,"Cherry","Cherry",3000,["prestage"])
  addSkill(skillTree,"すもも農家","Plum",3,"Plum","Plum",3000,["prestage"])
  addSkill(skillTree,"マンゴー農家","Mango",3,"Mango","Mango",3000,["バナナ農家"])

  addSkill(skillTree,"石に愛された者","Messy Stone",5,"Mega Complessed Messy Stone","Messy Stone",15000,["prestage"])
  addSkill(skillTree,"毒きのこがお好き?","Red Mushroom",3,"Red Mushroom","Red Mushroom",3000,["prestage"])
  addSkill(skillTree,"ロードローラー","Dirt",5,"Diamond Spade","Dirt",12000,["prestage"])
  addSkill(skillTree,"じゃがいも農家","Raw Potato",3,"Raw Potato","Raw Potato",3000,["prestage"])
  addSkill(skillTree,"メロン農家","Melon Slice",3,"Melon","Melon Slice",3000,["かぼちゃ農家"])
  addSkill(skillTree,"ビートルート農家","Beetroot",3,"Beetroot","Beetroot",3000,["prestage"])
  addSkill(skillTree,"バナナ農家","Banana",3,"Banana","Banana",3000,["prestage"])

  addSkill(skillTree,"かぼちゃ農家","Pumpkin",5,"Pumpkin","Pumpkin",3000,["prestage"])

  let IdtoName = {}
  let NametoId = {}
  let requiers = {}
  let length = 0
  for (const [key,value] of Object.entries(skillTree)) {
	if (value.util === false) {
	  IdtoName[length] = key
	  NametoId[key] = length
	  for (const next of value.nex) {
		requiers[next] = key;
	  }
	  length++
	}
  }
  return {skillTree:skillTree, IdtoName:IdtoName, NametoId:NametoId, requiers:requiers}
}

const generatedData = generateSkillTree()
skillTree = generatedData.skillTree;
skillIdtoName = generatedData.IdtoName;
skillNametoId = generatedData.NametoId;
skillRequiers = generatedData.requiers;