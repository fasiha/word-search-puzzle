const test = require('tape');
const puzzle = require('./index');
test('basic', t => {
  const p = puzzle.makeGrid(['HELO', 'PARO'], 4, ['nw', 'sw']);
  t.ok(p);
  t.ok(p.grid);
  t.ok(p.key);
  t.equal(p.grid.length, p.key.length);
  t.end();
});

function reverseWord(s) { return s.split('').reverse().join(''); }
test('using wordsearch', t => {
  const words = ['HELO', 'PARO'];
  const p = puzzle.makeGrid(words, 6, ['e', 'w']);
  let rows = p.key.map(v => v.join(''));
  for (const word of words) { t.ok(rows.some(row => row.indexOf(word) >= 0 || row.indexOf(reverseWord(word)) >= 0)); }

  t.end();
});