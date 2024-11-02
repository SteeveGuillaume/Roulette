/**
 * Crée un objet représentant un numéro gagnant avec ses différents types de gains.
 * @param {number} number - Le numéro gagnant.
 * @returns {object} Un objet représentant un numéro gagnant avec ses gains.
 */
function createWinningNumber(number) {
  return {
    number,
    plein: 0,
    cheval: 0,
    carre: 0,
    transversale: 0,
    sixain: 0,
    getTotalPlein() {
      return this.plein * 35;
    },
    getTotalCheval() {
      return this.cheval * 17;
    },
    getTotalCarre() {
      return this.carre * 8;
    },
    getTotalTransversale() {
      return this.transversale * 11;
    },
    getTotalSixain() {
      return this.sixain * 5;
    },
    getAllTotal() {
      return this.getTotalPlein() + this.getTotalCheval() + this.getTotalCarre() + this.getTotalTransversale() + this.getTotalSixain();
    },
    getText() {
      return `Au numéro ${this.number}, le total est de ${this.getAllTotal()} - Plein: ${this.getTotalPlein()}, Cheval: ${this.getTotalCheval()}, Carré: ${this.getTotalCarre()}, Transversale: ${this.getTotalTransversale()}, Sixain: ${this.getTotalSixain()}`;
    }
  };
}


export function initializeNumberList() { 
  // Liste des numéros gagnants pour différents joueurs
  return Array.from({ length: 3 }, () =>
    Array.from({ length: 37 }, (_, index) => createWinningNumber(index))
  );
}

export const NUMBER_LIST = {
  0: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
  1: [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
  2: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36]
};
