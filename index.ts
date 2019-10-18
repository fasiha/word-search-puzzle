function randomKatakanaMaker() {
  const KANA_FREQS: [string, number][] = [
    ["ア", 23726], ["イ", 52402], ["ウ", 34038], ["エ", 12452], ["オ", 18736], ["カ", 31690], ["ガ", 13541],
    ["キ", 17148], ["ギ", 1798],  ["ク", 16785], ["グ", 1346],  ["ケ", 7932],  ["ゲ", 2116],  ["コ", 19331],
    ["ゴ", 3549],  ["サ", 11445], ["ザ", 1053],  ["シ", 30727], ["ジ", 11185], ["ス", 14111], ["ズ", 2700],
    ["セ", 8480],  ["ゼ", 1827],  ["ソ", 8968],  ["ゾ", 1349],  ["タ", 29396], ["ダ", 17683], ["チ", 14509],
    ["ヂ", 15],    ["ッ", 29355], ["ツ", 10934], ["ヅ", 768],   ["テ", 22922], ["デ", 13472], ["ト", 21831],
    ["ド", 7644],  ["ナ", 30974], ["ニ", 18439], ["ヌ", 1047],  ["ネ", 7476],  ["ノ", 24091], ["ハ", 19575],
    ["バ", 5062],  ["パ", 2064],  ["ヒ", 4349],  ["ビ", 1828],  ["ピ", 660],   ["フ", 5451],  ["ブ", 4173],
    ["プ", 555],   ["ヘ", 1869],  ["ベ", 1836],  ["ペ", 257],   ["ホ", 3795],  ["ボ", 2142],  ["ポ", 1048],
    ["マ", 16712], ["ミ", 9289],  ["ム", 2998],  ["メ", 5785],  ["モ", 14416], ["ャ", 7942],  ["ヤ", 7538],
    ["ュ", 3316],  ["ユ", 2036],  ["ョ", 9192],  ["ヨ", 11105], ["ラ", 15479], ["リ", 12427], ["ル", 15715],
    ["レ", 13173], ["ロ", 6605],  ["ワ", 10637], ["ヲ", 6019],  ["ン", 47164], ["ヴ", 76],    ["ヶ", 21],
    ["ー", 6947]
  ];
  const freqCumSum = frequenciesToCumSum(KANA_FREQS.map(v => v[1]));
  const chars = KANA_FREQS.map(([c]) => c);
  return () => {
    const r = Math.random();
    const idx = freqCumSum.findIndex(p => r <= p);
    return chars[idx];
  }
}
function frequenciesToCumSum(frequencies: number[]): number[] {
  const sum = frequencies.reduce((m, c) => m + c);
  const freqCumSum = frequencies.reduce((memo, curr) => memo.concat((last(memo) || 0) + curr / sum), [] as number[]);
  freqCumSum[freqCumSum.length - 1] = 1;
  return freqCumSum;
}

function randomEnglishLetterMaker() {
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
  // Via
  // https://en.wikipedia.org/w/index.php?title=Letter_frequency&oldid=895486144#Relative_frequencies_of_letters_in_other_languages
  const frequencies = [
    8.167, 1.492, 2.782, 4.253, 12.702, 2.228, 2.015, 6.094, 6.966, 0.153, 0.772, 4.025, 2.406,
    6.749, 7.507, 1.929, 0.095, 5.987,  6.327, 9.056, 2.758, 0.978, 2.360, 0.150, 1.974, 0.075
  ];
  const freqCumSum = frequenciesToCumSum(frequencies);
  return () => {
    const r = Math.random();
    const idx = freqCumSum.findIndex(p => r <= p);
    return letters[idx];
  }
}

type RandStringMaker = () => string;
const randEnglishLetter: RandStringMaker = randomEnglishLetterMaker();
const randKata: RandStringMaker = randomKatakanaMaker();
const randHira: RandStringMaker = () => kana.kata2hira(randKata());

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
  case 'se': return [x + length, y + length];
  }
}
function directionOk(str: string) {
  switch (str) {
  case 'e': return 1;
  case 'w': return 1;
  case 'n': return 1;
  case 's': return 1;
  case 'nw': return 1;
  case 'ne': return 1;
  case 'sw': return 1;
  case 'se': return 1;
  default: return 0;
  }
}
function randInt(max: number) { return Math.round(Math.random() * max); }
function range(len: number) { return Array.from(Array(len), (_, n) => n); }
function copyGrid<T>(grid: T[][]): T[][] { return Array.from(grid, row => Array.from(row, elt => elt)); }
function last<T>(arr: T[]) { return arr[arr.length - 1]; }
import * as kana from './kana';
export function makeGrid(words: string[], size: number, directions: Direction[]) {
  const sizes = [/[a-zA-Z]/, /[ぁ-ん]/, /[ァ-ン]/].map(re => words.filter(word => re.test(word)).length);
  const randomMakers: RandStringMaker[] = [randEnglishLetter, randHira, randKata];

  const mostLikely = Math.max(...sizes);
  const bestCandidate = sizes.findIndex(x => x === mostLikely)
  const maker: RandStringMaker = randomMakers[bestCandidate];

  if (words.some(word => word.length > size)) { throw new Error('grid too small'); }
  directions = Array.from(new Set(directions));
  if (!directions.every(directionOk)) { throw new Error('some directions flawed'); }
  const grid: Grid = Array.from(Array(size), _ => Array.from(Array(size), _ => ''));

  let tries = 0;
  let wordsPlaced = 0;
  const placements: Placement[] = [];
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
    placements.push(candidate);
    for (const n of range(length + 1)) {
      const [x, y] = placementEnd({...candidate, length: n});
      grid[y][x] = word[n];
    }
  }
  const key = copyGrid(grid);
  for (let row of grid) { row.forEach((c, i) => row[i] = c || maker()); }
  return {grid, key, placements};
}
