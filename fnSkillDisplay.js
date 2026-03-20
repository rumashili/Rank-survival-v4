fnAddSkillTreeItem = function add(myId, key, item, sort, canBuy = true) {
  let obj = {
    customTitle: item.name,
    image: item.icon,
    description: item.desc,
    sortPriority: sort,
    canBuy: canBuy,
  }

  if (canBuy === true) {
    obj.buyButtonText = [{icon: item.costCrc}, {str: ` x${item.costAmt}`}]
  }
  if (item.name === "プレステージ") {
    obj.buyButtonText = "実行"	
  }

  api.createShopItemForPlayer(
    myId,
    "スキルツリー",
    key,
    obj
  )
}

fnDisplaySkillTree = function display(myId, now) {
  fnAddSkillTreeItem(myId, "description", skillTree.title, 40, false)

  let priority = 30
  let key = 0
  const next = skillTree[now].nex

  for (let i = 0; i < 3; i++) {
    key++

    if (next[i] === undefined) {
      fnAddSkillTreeItem(myId, String(key), skillTree.none, priority, false)
    } else {
      fnAddSkillTreeItem(myId, String(key), skillTree[next[i]], priority)
    }

    priority -= 10
  }
}

if (2 === 1) {}
