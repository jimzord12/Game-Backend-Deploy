const cardsReqConfigCreation = [
  "templateId", // we use this to find the card's template, thus the card's data
  "state", // Is it Active or it is just stored to player's inventory?
  "rarity",
  "ownerId", // whom does this card belong to?
  "creator", // in which town is currently active? Can be null if it sits in the inventory
  "creationTime",
];

module.exports = cardsReqConfigCreation;
