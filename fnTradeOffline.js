fnTradeOffline = function (myId) {
  const myDbId = api.getPlayerDbId(myId)
  let money = "0"
  for (let i = 0; i < 5; i++) {
	let state = fnTradeStorage.getState(i*18)
	for (let j = 0; j < 18; j++) {
	  if (state[j] === null) continue;
	  if (state[j].type === "soldOut" && state[j].dbId === myDbId) {
		money += state[j].price;
		state[j] = null
	  }
	}
	fnTradeStorage.setState(i*18, state)
  }
  return money;
}

if (2 === 1) {}