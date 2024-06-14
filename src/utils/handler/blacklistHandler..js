let globalState = {
  blackList: [],
};

module.exports = {
  getBlackList: () => globalState.blackList,
  addToBlackList (phoneNumber) {
    if (!globalState.blackList.includes(phoneNumber)) {
      globalState.blackList.push(phoneNumber);
    }
  },
  removeFromBlackList (phoneNumber) {
    const index = globalState.blackList.indexOf(phoneNumber);
    if (index !== -1) {
      globalState.blackList.splice(index, 1);
    }
  },
  isInBlackList (phoneNumber) {
    return globalState.blackList.includes(phoneNumber);
  },
};
