export class ScoreHelper {
  static calculateWinner(sets: number[][]): 'A' | 'B' {
    const sideASets = sets.reduce((acc, set) => {
      if (set[0] > set[1]) return acc + 1;
      else return acc;
    }, 0);

    const sideBSets = sets.length - sideASets;
    return sideASets > sideBSets ? 'A' : 'B';
  }
}