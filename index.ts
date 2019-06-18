function randomEnglishLetterMaker() {
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
  // Via
  // https://en.wikipedia.org/w/index.php?title=Letter_frequency&oldid=895486144#Relative_frequencies_of_letters_in_other_languages
  const frequencies = [
    8.167, 1.492, 2.782, 4.253, 12.702, 2.228, 2.015, 6.094, 6.966, 0.153, 0.772, 4.025, 2.406,
    6.749, 7.507, 1.929, 0.095, 5.987,  6.327, 9.056, 2.758, 0.978, 2.360, 0.150, 1.974, 0.075
  ];
  const sum = frequencies.reduce((m, c) => m + c);
  let freqCumSum = frequencies.reduce((memo, curr) => memo.concat((last(memo) || 0) + curr / sum), [] as number[]);
  freqCumSum[freqCumSum.length - 1] = 1;
  return () => {
    const r = Math.random();
    const idx = freqCumSum.findIndex(p => r <= p);
    return letters[idx];
  }
}
const randEnglishLetter = randomEnglishLetterMaker();

type Direction = 'e'|'w'|'n'|'s'|'nw'|'ne'|'sw'|'se';
type Placement = {
  start: [number, number]; length: number; direction: Direction;
};
type Grid = string[][];

function placementEnd({length, direction, start: [x, y]}: Placement): number[] {
  switch (direction) {
  case 'e': return [x + length, y];
  case 'w': return [x - length, y];
  case 'n': return [x, y - length];
  case 's': return [x, y + length];
  case 'nw': return [x - length, y - length];
  case 'ne': return [x + length, y - length];
  case 'sw': return [x - length, y + length];
  case 'se': return [x - length, y + length];
  }
}
function randInt(max: number) { return Math.round(Math.random() * max); }
function range(len: number) { return Array.from(Array(len), (_, n) => n); }
function copyGrid<T>(grid: T[][]): T[][] { return Array.from(grid, row => Array.from(row, elt => elt)); }
function last<T>(arr: T[]) { return arr[arr.length - 1]; }
export function makeGrid(words: string[], size: number, directions: Direction[]): {grid: Grid, key: Grid} {
  if (words.some(word => word.length > size)) { throw new Error('grid too small'); }
  directions = Array.from(new Set(directions));
  let grid = Array.from(Array(size), _ => Array.from(Array(size), _ => ''));

  let tries = 0;
  let wordsPlaced = 0;
  while (wordsPlaced < words.length) {
    if (++tries > 1000 * words.length) { throw new Error('giving up'); }
    const word = words[wordsPlaced];
    const length = word.length - 1; // for a 4 letter word, move just 3 spaces from start
    let candidate: Placement = {
      start: [randInt(size - 1), randInt(size - 1)],
      length,
      direction: directions[randInt(directions.length - 1)]
    };
    let end = placementEnd(candidate);
    // check boundary condition
    if (end.some(e => e < 0 || e > size - 1)) { continue; }
    // check overlap condition
    if (!range(length + 1).every(n => {
          const [x, y] = placementEnd({...candidate, length: n});
          return grid[y][x] === '' || grid[y][x] === word[n];
        })) {
      continue;
    }
    // candidate passes! Update grid
    wordsPlaced++;
    for (const n of range(length + 1)) {
      const [x, y] = placementEnd({...candidate, length: n});
      grid[y][x] = word[n];
    }
  }
  const key = copyGrid(grid);
  for (let row of grid) { row.forEach((c, i) => row[i] = c || randEnglishLetter()); }
  return {grid, key};
}
