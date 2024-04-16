function sortBasedOnRank(players) {
  if (players.length === 0) {
    return "empty array";
  }
  if (Array.isArray(players) === false) {
    return "not an array";
  }

  return players.sort((a, b) => {
    if (a.rank === null && b.rank === null) {
      return 0; // No sorting needed if both are null
    }
    if (a.rank === null) {
      return 1;
    }
    if (b.rank === null) {
      return -1;
    }
    return b.rank - a.rank;
  });
}

module.exports = sortBasedOnRank;
