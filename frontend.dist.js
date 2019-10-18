(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const puzzle = __importStar(require("./index"));
addEventListener("load", () => {
    const button = document.getElementById('makePuzzle');
    const table = document.getElementById('outputTable');
    const textarea = document.getElementById('wordsInput');
    const sizearea = document.getElementById('sizeInput');
    const wordsList = document.getElementById('wordsList');
    if (button && textarea && sizearea && table && wordsList) {
        button.addEventListener('click', () => {
            const wordsRaw = textarea.value || '';
            const words = wordsRaw.trim().split(/\s+/);
            const size = parseInt(sizearea.value) || (2 + Math.max(...words.map(x => x.length)));
            const directions = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
                .map(e => e.id.replace('Direction', ''));
            const p = puzzle.makeGrid(words, size, directions);
            let tableHtml = p.grid
                .map(row => '<tr>' +
                row.map(c => `<td style="font-size: ${Math.floor(100 / size)}vmax">${c}</td>`).join('') +
                '</tr>')
                .join('');
            table.innerHTML = tableHtml;
            wordsList.innerHTML = words.join(', ');
        });
    }
});

},{"./index":2}],2:[function(require,module,exports){
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
function randomKatakanaMaker() {
    const KANA_FREQS = [
        ["ア", 23726], ["イ", 52402], ["ウ", 34038], ["エ", 12452], ["オ", 18736], ["カ", 31690], ["ガ", 13541],
        ["キ", 17148], ["ギ", 1798], ["ク", 16785], ["グ", 1346], ["ケ", 7932], ["ゲ", 2116], ["コ", 19331],
        ["ゴ", 3549], ["サ", 11445], ["ザ", 1053], ["シ", 30727], ["ジ", 11185], ["ス", 14111], ["ズ", 2700],
        ["セ", 8480], ["ゼ", 1827], ["ソ", 8968], ["ゾ", 1349], ["タ", 29396], ["ダ", 17683], ["チ", 14509],
        ["ヂ", 15], ["ッ", 29355], ["ツ", 10934], ["ヅ", 768], ["テ", 22922], ["デ", 13472], ["ト", 21831],
        ["ド", 7644], ["ナ", 30974], ["ニ", 18439], ["ヌ", 1047], ["ネ", 7476], ["ノ", 24091], ["ハ", 19575],
        ["バ", 5062], ["パ", 2064], ["ヒ", 4349], ["ビ", 1828], ["ピ", 660], ["フ", 5451], ["ブ", 4173],
        ["プ", 555], ["ヘ", 1869], ["ベ", 1836], ["ペ", 257], ["ホ", 3795], ["ボ", 2142], ["ポ", 1048],
        ["マ", 16712], ["ミ", 9289], ["ム", 2998], ["メ", 5785], ["モ", 14416], ["ャ", 7942], ["ヤ", 7538],
        ["ュ", 3316], ["ユ", 2036], ["ョ", 9192], ["ヨ", 11105], ["ラ", 15479], ["リ", 12427], ["ル", 15715],
        ["レ", 13173], ["ロ", 6605], ["ワ", 10637], ["ヲ", 6019], ["ン", 47164], ["ヴ", 76], ["ヶ", 21],
        ["ー", 6947]
    ];
    const freqCumSum = frequenciesToCumSum(KANA_FREQS.map(v => v[1]));
    const chars = KANA_FREQS.map(([c]) => c);
    return () => {
        const r = Math.random();
        const idx = freqCumSum.findIndex(p => r <= p);
        return chars[idx];
    };
}
function frequenciesToCumSum(frequencies) {
    const sum = frequencies.reduce((m, c) => m + c);
    const freqCumSum = frequencies.reduce((memo, curr) => memo.concat((last(memo) || 0) + curr / sum), []);
    freqCumSum[freqCumSum.length - 1] = 1;
    return freqCumSum;
}
function randomEnglishLetterMaker() {
    const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
    // Via
    // https://en.wikipedia.org/w/index.php?title=Letter_frequency&oldid=895486144#Relative_frequencies_of_letters_in_other_languages
    const frequencies = [
        8.167, 1.492, 2.782, 4.253, 12.702, 2.228, 2.015, 6.094, 6.966, 0.153, 0.772, 4.025, 2.406,
        6.749, 7.507, 1.929, 0.095, 5.987, 6.327, 9.056, 2.758, 0.978, 2.360, 0.150, 1.974, 0.075
    ];
    const freqCumSum = frequenciesToCumSum(frequencies);
    return () => {
        const r = Math.random();
        const idx = freqCumSum.findIndex(p => r <= p);
        return letters[idx];
    };
}
const randEnglishLetter = randomEnglishLetterMaker();
const randKata = randomKatakanaMaker();
const randHira = () => kana.kata2hira(randKata());
function placementEnd({ length, direction, start: [x, y] }) {
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
function directionOk(str) {
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
function randInt(max) { return Math.round(Math.random() * max); }
function range(len) { return Array.from(Array(len), (_, n) => n); }
function copyGrid(grid) { return Array.from(grid, row => Array.from(row, elt => elt)); }
function last(arr) { return arr[arr.length - 1]; }
const kana = __importStar(require("./kana"));
function makeGrid(words, size, directions) {
    const sizes = [/[a-zA-Z]/, /[ぁ-ん]/, /[ァ-ン]/].map(re => words.filter(word => re.test(word)).length);
    const randomMakers = [randEnglishLetter, randHira, randKata];
    const mostLikely = Math.max(...sizes);
    const bestCandidate = sizes.findIndex(x => x === mostLikely);
    const maker = randomMakers[bestCandidate];
    if (words.some(word => word.length > size)) {
        throw new Error('grid too small');
    }
    directions = Array.from(new Set(directions));
    if (!directions.every(directionOk)) {
        throw new Error('some directions flawed');
    }
    const grid = Array.from(Array(size), _ => Array.from(Array(size), _ => ''));
    let tries = 0;
    let wordsPlaced = 0;
    const placements = [];
    while (wordsPlaced < words.length) {
        if (++tries > 1000 * words.length) {
            throw new Error('giving up');
        }
        const word = words[wordsPlaced];
        const length = word.length - 1; // for a 4 letter word, move just 3 spaces from start
        let candidate = {
            start: [randInt(size - 1), randInt(size - 1)],
            length,
            direction: directions[randInt(directions.length - 1)]
        };
        let end = placementEnd(candidate);
        // check boundary condition
        if (end.some(e => e < 0 || e > size - 1)) {
            continue;
        }
        // check overlap condition
        if (!range(length + 1).every(n => {
            const [x, y] = placementEnd(Object.assign({}, candidate, { length: n }));
            return grid[y][x] === '' || grid[y][x] === word[n];
        })) {
            continue;
        }
        // candidate passes! Update grid
        wordsPlaced++;
        placements.push(candidate);
        for (const n of range(length + 1)) {
            const [x, y] = placementEnd(Object.assign({}, candidate, { length: n }));
            grid[y][x] = word[n];
        }
    }
    const key = copyGrid(grid);
    for (let row of grid) {
        row.forEach((c, i) => row[i] = c || maker());
    }
    return { grid, key, placements };
}
exports.makeGrid = makeGrid;

},{"./kana":3}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let hiragana = "ぁあぃいぅうぇえぉおかがきぎくぐけげこごさざしじすずせぜそぞただちぢっつづてでとどなに" +
    "ぬねのはばぱひびぴふぶぷへべぺほぼまみむめもゃやゅゆょよらりるれろゎわゐゑをんゔゕゖ";
let katakana = "ァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニ" +
    "ヌネノハバパヒビピフブプヘベペホボマミムメモャヤュユョヨラリルレロヮワヰヱヲンヴヵヶ";
if (hiragana.length !== katakana.length) {
    throw new Error('Kana strings not same length?');
}
exports.kata2hiraMap = new Map([]);
exports.hira2kataMap = new Map([]);
hiragana.split('').forEach((h, i) => {
    exports.kata2hiraMap.set(katakana[i], h);
    exports.hira2kataMap.set(h, katakana[i]);
});
function kata2hira(s) { return s.split('').map(c => exports.kata2hiraMap.get(c) || c).join(''); }
exports.kata2hira = kata2hira;
function hira2kata(s) { return s.split('').map(c => exports.hira2kataMap.get(c) || c).join(''); }
exports.hira2kata = hira2kata;
/*
There are other ways of doing this. In Unicode, katakana is 96 codepoints above hiragana. So
`String.fromCharCode(hiragana.charCodeAt(0) + 96)` will produce katakana. In speed tests though, the above Map-based
approach had the least variability in runtime (200 to 800 microseconds), while arithmetic-based approaches used 100 to
1500 microseconds.
*/

},{}]},{},[1]);
