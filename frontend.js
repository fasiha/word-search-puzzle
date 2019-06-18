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
    console.log('whee!');
    const button = document.getElementById('makePuzzle');
    const table = document.getElementById('outputTable');
    const textarea = document.getElementById('wordsInput');
    const sizearea = document.getElementById('sizeInput');
    if (button && textarea && sizearea && table) {
        button.addEventListener('click', () => {
            const wordsRaw = textarea.value || '';
            const words = wordsRaw.trim().split(/\s+/);
            const size = parseInt(sizearea.value) || (2 + Math.max(...words.map(x => x.length)));
            const directions = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
                .map(e => e.id.replace('Direction', ''));
            const p = puzzle.makeGrid(words, size, directions);
            console.log(p.key.map(v => v.map(x => x || '_').join('')).join('\n'));
            console.log(p);
            let tableHtml = `<table>` + p.grid.map(row => '<tr>' + row.map(c => `<td>${c}</td>`).join('') + '</tr>').join('') + `</table>`;
            table.innerHTML = tableHtml;
        });
    }
});
