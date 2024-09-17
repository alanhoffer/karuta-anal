class CooldownManager {
    constructor() {
      this.lastCardTimestamp = 0;
      this.MIN_TIME_BETWEEN_CARDS = 600000; // 10 minutos en milisegundos
    }
  
    canTryAgain() {
      const currentTime = Date.now();
      if (currentTime - this.lastCardTimestamp >= this.MIN_TIME_BETWEEN_CARDS) {
        this.lastCardTimestamp = currentTime;
        return true;
      }
      return false;
    }
  }
  
  module.exports = new CooldownManager();
  