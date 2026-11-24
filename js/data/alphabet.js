/* Das russische Alphabet – 33 Buchstaben */
window.RU_DATA = window.RU_DATA || {};

// type: same = sieht aus & klingt wie im Deutschen, false = falscher Freund, new = neues Zeichen, sign = Zeichen ohne eigenen Laut
window.RU_DATA.alphabet = [
  { up: 'А', lo: 'а', tr: 'a', type: 'same', sound: 'wie „a“ in „Vater“', word: 'арбуз', wordDe: 'Wassermelone', emoji: '🍉' },
  { up: 'Б', lo: 'б', tr: 'b', type: 'new', sound: 'wie „b“ in „Ball“', word: 'банан', wordDe: 'Banane', emoji: '🍌' },
  { up: 'В', lo: 'в', tr: 'w', type: 'false', sound: 'wie „w“ in „Wasser“ – nicht „b“!', word: 'вода', wordDe: 'Wasser', emoji: '💧' },
  { up: 'Г', lo: 'г', tr: 'g', type: 'new', sound: 'wie „g“ in „Garten“', word: 'город', wordDe: 'Stadt', emoji: '🏙️' },
  { up: 'Д', lo: 'д', tr: 'd', type: 'new', sound: 'wie „d“ in „Dach“', word: 'дом', wordDe: 'Haus', emoji: '🏠' },
  { up: 'Е', lo: 'е', tr: 'je', type: 'false', sound: 'wie „je“ in „jetzt“ (nach Konsonanten weich „e“)', word: 'еда', wordDe: 'Essen', emoji: '🍲' },
  { up: 'Ё', lo: 'ё', tr: 'jo', type: 'new', sound: 'wie „jo“ in „Joghurt“ – immer betont', word: 'ёж', wordDe: 'Igel', emoji: '🦔' },
  { up: 'Ж', lo: 'ж', tr: 'ž (sch, stimmhaft)', type: 'new', sound: 'stimmhaftes „sch“ wie „J“ in „Journal“', word: 'жук', wordDe: 'Käfer', emoji: '🪲' },
  { up: 'З', lo: 'з', tr: 's (stimmhaft)', type: 'new', sound: 'stimmhaftes „s“ wie in „Sonne“', word: 'зима', wordDe: 'Winter', emoji: '❄️' },
  { up: 'И', lo: 'и', tr: 'i', type: 'new', sound: 'wie „i“ in „Igel“', word: 'игра', wordDe: 'Spiel', emoji: '🎲' },
  { up: 'Й', lo: 'й', tr: 'j (kurzes i)', type: 'new', sound: 'kurzes „j“ wie in „Mai“', word: 'йогурт', wordDe: 'Joghurt', emoji: '🥛' },
  { up: 'К', lo: 'к', tr: 'k', type: 'same', sound: 'wie „k“ in „Kino“ (ohne Hauch)', word: 'кот', wordDe: 'Kater', emoji: '🐈' },
  { up: 'Л', lo: 'л', tr: 'l', type: 'new', sound: 'dunkles „l“ wie im Englischen „ball“', word: 'лампа', wordDe: 'Lampe', emoji: '💡' },
  { up: 'М', lo: 'м', tr: 'm', type: 'same', sound: 'wie „m“ in „Mama“', word: 'мама', wordDe: 'Mama', emoji: '👩' },
  { up: 'Н', lo: 'н', tr: 'n', type: 'false', sound: 'wie „n“ in „Nase“ – nicht „h“!', word: 'нос', wordDe: 'Nase', emoji: '👃' },
  { up: 'О', lo: 'о', tr: 'o', type: 'same', sound: 'betont „o“, unbetont fast wie „a“', word: 'окно', wordDe: 'Fenster', emoji: '🪟' },
  { up: 'П', lo: 'п', tr: 'p', type: 'new', sound: 'wie „p“ in „Papa“', word: 'папа', wordDe: 'Papa', emoji: '👨' },
  { up: 'Р', lo: 'р', tr: 'r (gerollt)', type: 'false', sound: 'gerolltes Zungenspitzen-„r“ – nicht „p“!', word: 'рыба', wordDe: 'Fisch', emoji: '🐟' },
  { up: 'С', lo: 'с', tr: 'ss (stimmlos)', type: 'false', sound: 'stimmloses „s“ wie in „Bus“ – nicht „k“!', word: 'сок', wordDe: 'Saft', emoji: '🧃' },
  { up: 'Т', lo: 'т', tr: 't', type: 'same', sound: 'wie „t“ in „Tee“', word: 'торт', wordDe: 'Torte', emoji: '🎂' },
  { up: 'У', lo: 'у', tr: 'u', type: 'false', sound: 'wie „u“ in „Uhr“ – nicht „y“!', word: 'утка', wordDe: 'Ente', emoji: '🦆' },
  { up: 'Ф', lo: 'ф', tr: 'f', type: 'new', sound: 'wie „f“ in „Fisch“', word: 'флаг', wordDe: 'Flagge', emoji: '🚩' },
  { up: 'Х', lo: 'х', tr: 'ch (wie in Bach)', type: 'false', sound: 'wie „ch“ in „Bach“ – nicht „x“!', word: 'хлеб', wordDe: 'Brot', emoji: '🍞' },
  { up: 'Ц', lo: 'ц', tr: 'z (ts)', type: 'new', sound: 'wie „z“ in „Zeit“', word: 'цирк', wordDe: 'Zirkus', emoji: '🎪' },
  { up: 'Ч', lo: 'ч', tr: 'tsch', type: 'new', sound: 'weiches „tsch“ wie in „Tschüss“', word: 'чай', wordDe: 'Tee', emoji: '🍵' },
  { up: 'Ш', lo: 'ш', tr: 'sch', type: 'new', sound: 'hartes „sch“ wie in „Schule“', word: 'шапка', wordDe: 'Mütze', emoji: '🧢' },
  { up: 'Щ', lo: 'щ', tr: 'schtsch', type: 'new', sound: 'langes, weiches „sch“ (ähnlich „sch-tsch“)', word: 'щука', wordDe: 'Hecht', emoji: '🎣' },
  { up: 'Ъ', lo: 'ъ', tr: 'Härtezeichen', type: 'sign', sound: 'kein Laut – trennt Silben hörbar (kurze Pause)', word: 'подъезд', wordDe: 'Hauseingang', emoji: '🚪' },
  { up: 'Ы', lo: 'ы', tr: 'y (dumpfes i)', type: 'new', sound: 'dumpfes „i“ – sprich „i“ mit zurückgezogener Zunge', word: 'сыр', wordDe: 'Käse', emoji: '🧀' },
  { up: 'Ь', lo: 'ь', tr: 'Weichheitszeichen', type: 'sign', sound: 'kein Laut – macht den Konsonanten davor weich', word: 'соль', wordDe: 'Salz', emoji: '🧂' },
  { up: 'Э', lo: 'э', tr: 'e (offen)', type: 'new', sound: 'offenes „e“ wie in „Ende“', word: 'это', wordDe: 'das (ist)', emoji: '👉' },
  { up: 'Ю', lo: 'ю', tr: 'ju', type: 'new', sound: 'wie „ju“ in „Jubel“', word: 'юбка', wordDe: 'Rock', emoji: '👗' },
  { up: 'Я', lo: 'я', tr: 'ja', type: 'new', sound: 'wie „ja“ – und bedeutet auch „ich“', word: 'яблоко', wordDe: 'Apfel', emoji: '🍎' },
];

window.RU_DATA.letterTypes = {
  same: { label: 'Wie im Deutschen', color: 'green', desc: 'Sehen aus und klingen fast wie bei uns.' },
  false: { label: 'Falsche Freunde', color: 'red', desc: 'Sehen bekannt aus – klingen aber anders!' },
  new: { label: 'Neue Zeichen', color: 'blue', desc: 'Komplett neue Buchstaben zum Entdecken.' },
  sign: { label: 'Zeichen', color: 'violet', desc: 'Haben keinen eigenen Laut.' },
};
