/* Grammatik-Lektionen. In jeder Quizfrage ist die ERSTE Option die richtige (wird beim Abspielen gemischt). */
window.RU_DATA = window.RU_DATA || {};

window.RU_DATA.grammar = [
  {
    id: 'gender', title: 'Das Geschlecht der Nomen', icon: '⚧', level: 'A1',
    summary: 'Maskulin, feminin oder neutrum? Die Endung verrät es dir.',
    content: `
<p>Russische Nomen haben – wie im Deutschen – drei Geschlechter. Die gute Nachricht: Es gibt <b>keine Artikel</b>, und das Geschlecht erkennst du fast immer an der <b>Endung</b>.</p>
<table>
<thead><tr><th>Geschlecht</th><th>Endung</th><th>Beispiele</th></tr></thead>
<tbody>
<tr><td><span class="tag blue">maskulin</span></td><td>Konsonant, -й</td><td><span class="ru">стол</span> (Tisch), <span class="ru">музей</span> (Museum)</td></tr>
<tr><td><span class="tag red">feminin</span></td><td>-а, -я</td><td><span class="ru">мама</span> (Mama), <span class="ru">неделя</span> (Woche)</td></tr>
<tr><td><span class="tag green">neutrum</span></td><td>-о, -е</td><td><span class="ru">окно</span> (Fenster), <span class="ru">море</span> (Meer)</td></tr>
</tbody></table>
<div class="tip"><b>Achtung bei -ь:</b> Wörter auf das Weichheitszeichen können maskulin <i>oder</i> feminin sein: <span class="ru">день</span> (Tag) ist maskulin, <span class="ru">ночь</span> (Nacht) ist feminin. Diese lernst du am besten mit.</div>
<div class="tip"><b>Logik vor Endung:</b> <span class="ru">папа</span> und <span class="ru">дедушка</span> enden auf -а, sind aber natürlich maskulin.</div>`,
    quiz: [
      { q: 'Welches Geschlecht hat <span class="ru">книга</span> (Buch)?', o: ['feminin', 'maskulin', 'neutrum'], e: 'Endung -а → feminin.' },
      { q: 'Welches Geschlecht hat <span class="ru">дом</span> (Haus)?', o: ['maskulin', 'feminin', 'neutrum'], e: 'Endet auf Konsonant → maskulin.' },
      { q: 'Welches Geschlecht hat <span class="ru">окно</span> (Fenster)?', o: ['neutrum', 'maskulin', 'feminin'], e: 'Endung -о → neutrum.' },
      { q: 'Welches Geschlecht hat <span class="ru">музей</span> (Museum)?', o: ['maskulin', 'feminin', 'neutrum'], e: 'Endung -й → maskulin.' },
      { q: 'Welches Geschlecht hat <span class="ru">море</span> (Meer)?', o: ['neutrum', 'feminin', 'maskulin'], e: 'Endung -е → neutrum.' },
      { q: 'Welches Geschlecht hat <span class="ru">папа</span> (Papa)?', o: ['maskulin', 'feminin', 'neutrum'], e: 'Ausnahme: endet auf -а, ist aber eine männliche Person.' },
      { q: 'Welches Geschlecht hat <span class="ru">неделя</span> (Woche)?', o: ['feminin', 'neutrum', 'maskulin'], e: 'Endung -я → feminin.' },
      { q: 'Welches Geschlecht hat <span class="ru">слово</span> (Wort)?', o: ['neutrum', 'maskulin', 'feminin'], e: 'Endung -о → neutrum.' },
    ],
  },
  {
    id: 'pronouns', title: 'Personalpronomen', icon: '🙋', level: 'A1',
    summary: 'Ich, du, er, sie, es – und warum „sein“ oft fehlt.',
    content: `
<table>
<thead><tr><th>Russisch</th><th>Deutsch</th><th>Russisch</th><th>Deutsch</th></tr></thead>
<tbody>
<tr><td class="ru">я</td><td>ich</td><td class="ru">мы</td><td>wir</td></tr>
<tr><td class="ru">ты</td><td>du</td><td class="ru">вы</td><td>ihr / Sie</td></tr>
<tr><td class="ru">он</td><td>er</td><td class="ru">они</td><td>sie (Plural)</td></tr>
<tr><td class="ru">она</td><td>sie</td><td></td><td></td></tr>
<tr><td class="ru">оно</td><td>es</td><td></td><td></td></tr>
</tbody></table>
<div class="tip"><b>Höflichkeitsform:</b> <span class="ru">Вы</span> ist gleichzeitig „ihr“ und das höfliche „Sie“.</div>
<div class="tip"><b>Kein „sein“ im Präsens:</b> Im Russischen fällt das Verb „sein“ in der Gegenwart weg. <span class="ru">Я студент.</span> = Ich (bin) Student. <span class="ru">Она врач.</span> = Sie (ist) Ärztin.</div>`,
    quiz: [
      { q: 'Wie sagt man „wir“?', o: ['мы', 'вы', 'они', 'я'] },
      { q: 'Wie sagt man „du“?', o: ['ты', 'вы', 'он', 'я'] },
      { q: 'Was bedeutet <span class="ru">она</span>?', o: ['sie (Singular)', 'sie (Plural)', 'es', 'er'] },
      { q: 'Wie sprichst du eine fremde Person höflich an?', o: ['вы', 'ты', 'они', 'оно'], e: 'Вы ist die Höflichkeitsform.' },
      { q: 'Was bedeutet <span class="ru">они</span>?', o: ['sie (Plural)', 'ihr', 'wir', 'sie (Singular)'] },
      { q: '<span class="ru">Я студент.</span> – Welches Wort aus „Ich bin Student“ fehlt?', o: ['bin', 'ich', 'Student', 'keins'], e: 'Im Präsens fällt „sein“ weg – und Artikel gibt es sowieso nicht.' },
    ],
  },
  {
    id: 'present', title: 'Verben im Präsens', icon: '🔁', level: 'A1',
    summary: 'Die zwei Konjugationen: e-Konjugation und i-Konjugation.',
    content: `
<p>Russische Verben werden im Präsens nach zwei Mustern konjugiert. Merke dir jeweils ein Beispiel – die meisten Verben folgen diesen Mustern.</p>
<div class="two-col">
<table>
<thead><tr><th colspan="2">e-Konjugation · <span class="ru">читать</span> (lesen)</th></tr></thead>
<tbody>
<tr><td class="ru">я</td><td class="ru">чита<b>ю</b></td></tr>
<tr><td class="ru">ты</td><td class="ru">чита<b>ешь</b></td></tr>
<tr><td class="ru">он/она</td><td class="ru">чита<b>ет</b></td></tr>
<tr><td class="ru">мы</td><td class="ru">чита<b>ем</b></td></tr>
<tr><td class="ru">вы</td><td class="ru">чита<b>ете</b></td></tr>
<tr><td class="ru">они</td><td class="ru">чита<b>ют</b></td></tr>
</tbody></table>
<table>
<thead><tr><th colspan="2">i-Konjugation · <span class="ru">говорить</span> (sprechen)</th></tr></thead>
<tbody>
<tr><td class="ru">я</td><td class="ru">говор<b>ю</b></td></tr>
<tr><td class="ru">ты</td><td class="ru">говор<b>ишь</b></td></tr>
<tr><td class="ru">он/она</td><td class="ru">говор<b>ит</b></td></tr>
<tr><td class="ru">мы</td><td class="ru">говор<b>им</b></td></tr>
<tr><td class="ru">вы</td><td class="ru">говор<b>ите</b></td></tr>
<tr><td class="ru">они</td><td class="ru">говор<b>ят</b></td></tr>
</tbody></table>
</div>
<div class="tip"><b>Faustregel:</b> Verben auf <b>-ать / -ять</b> gehören meist zur e-Konjugation, Verben auf <b>-ить</b> meist zur i-Konjugation.</div>`,
    quiz: [
      { q: '<span class="ru">я ___</span> (читать)', o: ['читаю', 'читаешь', 'читает', 'читают'] },
      { q: '<span class="ru">они ___</span> (говорить)', o: ['говорят', 'говорют', 'говорит', 'говорим'], e: 'i-Konjugation: они говорят.' },
      { q: '<span class="ru">ты ___</span> (работать)', o: ['работаешь', 'работает', 'работаю', 'работаете'] },
      { q: '<span class="ru">мы ___</span> (говорить)', o: ['говорим', 'говорем', 'говорят', 'говорите'] },
      { q: '<span class="ru">вы ___</span> (знать)', o: ['знаете', 'знаешь', 'знают', 'знаем'] },
      { q: '<span class="ru">она ___</span> (думать)', o: ['думает', 'думаю', 'думают', 'думаешь'] },
      { q: '<span class="ru">я ___</span> (говорить)', o: ['говорю', 'говорит', 'говорил', 'говорят'] },
      { q: '<span class="ru">они ___</span> (играть)', o: ['играют', 'играет', 'играят', 'играем'] },
    ],
  },
  {
    id: 'plural', title: 'Der Plural', icon: '👯', level: 'A1',
    summary: 'Aus eins mach viele: -ы, -и, -а, -я.',
    content: `
<table>
<thead><tr><th>Singular</th><th>Plural-Endung</th><th>Beispiel</th></tr></thead>
<tbody>
<tr><td>maskulin (harter Konsonant), feminin -а</td><td><b>-ы</b></td><td><span class="ru">стол → столы</span>, <span class="ru">мама → мамы</span></td></tr>
<tr><td>-й, -ь, -я</td><td><b>-и</b></td><td><span class="ru">музей → музеи</span>, <span class="ru">ночь → ночи</span>, <span class="ru">неделя → недели</span></td></tr>
<tr><td>neutrum -о</td><td><b>-а</b></td><td><span class="ru">окно → окна</span></td></tr>
<tr><td>neutrum -е</td><td><b>-я</b></td><td><span class="ru">море → моря</span></td></tr>
</tbody></table>
<div class="tip"><b>7-Buchstaben-Regel:</b> Nach <span class="ru">г, к, х, ж, ш, щ, ч</span> steht nie <span class="ru">ы</span>, sondern <span class="ru">и</span>: <span class="ru">книга → книги</span>, <span class="ru">кошка → кошки</span>.</div>
<div class="tip"><b>Unregelmäßig:</b> <span class="ru">ребёнок → дети</span> (Kinder), <span class="ru">человек → люди</span> (Menschen), <span class="ru">брат → братья</span>, <span class="ru">город → города</span>, <span class="ru">дом → дома</span>.</div>`,
    quiz: [
      { q: 'Plural von <span class="ru">стол</span>?', o: ['столы', 'столи', 'стола', 'столя'] },
      { q: 'Plural von <span class="ru">книга</span>?', o: ['книги', 'книгы', 'книга', 'книгя'], e: '7-Buchstaben-Regel: nach г steht и.' },
      { q: 'Plural von <span class="ru">окно</span>?', o: ['окна', 'окны', 'окни', 'окно'] },
      { q: 'Plural von <span class="ru">море</span>?', o: ['моря', 'мори', 'моры', 'мора'] },
      { q: 'Plural von <span class="ru">ребёнок</span> (Kind)?', o: ['дети', 'ребёнки', 'ребёнкы', 'ребята'], e: 'Unregelmäßig: дети.' },
      { q: 'Plural von <span class="ru">неделя</span>?', o: ['недели', 'неделы', 'неделя', 'неделе'] },
      { q: 'Plural von <span class="ru">кошка</span>?', o: ['кошки', 'кошкы', 'кошка', 'кошкя'] },
      { q: 'Plural von <span class="ru">город</span>?', o: ['города', 'городы', 'городи', 'городя'], e: 'Unregelmäßig mit betontem -а.' },
    ],
  },
  {
    id: 'possessive', title: 'Possessivpronomen', icon: '🎁', level: 'A1',
    summary: 'Mein, dein, unser – angepasst an das Nomen.',
    content: `
<p>Possessivpronomen richten sich nach Geschlecht und Zahl des <b>Nomens</b>, nicht des Besitzers.</p>
<table>
<thead><tr><th></th><th>mask.</th><th>fem.</th><th>neutr.</th><th>Plural</th></tr></thead>
<tbody>
<tr><td>mein</td><td class="ru">мой</td><td class="ru">моя</td><td class="ru">моё</td><td class="ru">мои</td></tr>
<tr><td>dein</td><td class="ru">твой</td><td class="ru">твоя</td><td class="ru">твоё</td><td class="ru">твои</td></tr>
<tr><td>unser</td><td class="ru">наш</td><td class="ru">наша</td><td class="ru">наше</td><td class="ru">наши</td></tr>
<tr><td>euer / Ihr</td><td class="ru">ваш</td><td class="ru">ваша</td><td class="ru">ваше</td><td class="ru">ваши</td></tr>
</tbody></table>
<div class="tip"><b>Unveränderlich:</b> <span class="ru">его</span> (sein), <span class="ru">её</span> (ihr), <span class="ru">их</span> (ihr, Plural) bleiben immer gleich: <span class="ru">его мама, его дом, его книги</span>.</div>`,
    quiz: [
      { q: '<span class="ru">___ мама</span> (meine)', o: ['моя', 'мой', 'моё', 'мои'] },
      { q: '<span class="ru">___ дом</span> (mein)', o: ['мой', 'моя', 'моё', 'мои'] },
      { q: '<span class="ru">___ окно</span> (unser)', o: ['наше', 'наш', 'наша', 'наши'] },
      { q: '<span class="ru">___ книги</span> (deine)', o: ['твои', 'твоя', 'твой', 'твоё'] },
      { q: '<span class="ru">___ брат</span> (ihr Bruder – von ihr)', o: ['её', 'его', 'их', 'ваш'] },
      { q: '<span class="ru">___ машина</span> (euer Auto)', o: ['ваша', 'ваш', 'ваше', 'ваши'] },
      { q: '<span class="ru">___ дети</span> (seine Kinder)', o: ['его', 'её', 'мои', 'их'] },
    ],
  },
  {
    id: 'adjectives', title: 'Adjektive', icon: '🎨', level: 'A1',
    summary: 'Neu, groß, schön – die Endung passt sich an.',
    content: `
<p>Adjektive passen ihre Endung an das Nomen an.</p>
<table>
<thead><tr><th></th><th>mask.</th><th>fem.</th><th>neutr.</th><th>Plural</th></tr></thead>
<tbody>
<tr><td>neu</td><td class="ru">нов<b>ый</b></td><td class="ru">нов<b>ая</b></td><td class="ru">нов<b>ое</b></td><td class="ru">нов<b>ые</b></td></tr>
<tr><td>groß</td><td class="ru">больш<b>ой</b></td><td class="ru">больш<b>ая</b></td><td class="ru">больш<b>ое</b></td><td class="ru">больш<b>ие</b></td></tr>
<tr><td>gut</td><td class="ru">хорош<b>ий</b></td><td class="ru">хорош<b>ая</b></td><td class="ru">хорош<b>ее</b></td><td class="ru">хорош<b>ие</b></td></tr>
</tbody></table>
<p>Beispiele: <span class="ru">новый дом</span>, <span class="ru">новая машина</span>, <span class="ru">новое окно</span>, <span class="ru">новые книги</span>.</p>
<div class="tip"><b>Betonte Endung:</b> Ist die Endung betont, heißt sie im Maskulinum <span class="ru">-ой</span>: <span class="ru">большой</span>, <span class="ru">молодой</span>.</div>`,
    quiz: [
      { q: '<span class="ru">___ машина</span> (neu)', o: ['новая', 'новый', 'новое', 'новые'] },
      { q: '<span class="ru">___ окно</span> (groß)', o: ['большое', 'большой', 'большая', 'большие'] },
      { q: '<span class="ru">___ дети</span> (klein)', o: ['маленькие', 'маленький', 'маленькая', 'маленькое'] },
      { q: '<span class="ru">___ день</span> (gut)', o: ['хороший', 'хорошая', 'хорошее', 'хорошие'] },
      { q: '<span class="ru">___ погода</span> (schlecht)', o: ['плохая', 'плохой', 'плохое', 'плохие'] },
      { q: '<span class="ru">___ книга</span> (interessant)', o: ['интересная', 'интересный', 'интересное', 'интересные'] },
    ],
  },
  {
    id: 'cases', title: 'Die sechs Fälle', icon: '🧩', level: 'A2',
    summary: 'Nominativ bis Präpositiv – ein Überblick mit Beispielen.',
    content: `
<p>Russisch hat <b>sechs Fälle</b> – zwei mehr als das Deutsche. Hier am Beispiel von <span class="ru">книга</span> (Buch):</p>
<table>
<thead><tr><th>Fall</th><th>Frage</th><th>Form</th><th>Wofür?</th></tr></thead>
<tbody>
<tr><td>Nominativ</td><td class="ru">кто? что?</td><td class="ru">книг<b>а</b></td><td>Subjekt</td></tr>
<tr><td>Genitiv</td><td class="ru">кого? чего?</td><td class="ru">книг<b>и</b></td><td>Besitz, „von“, nach <span class="ru">нет</span>, Mengen</td></tr>
<tr><td>Dativ</td><td class="ru">кому? чему?</td><td class="ru">книг<b>е</b></td><td>Empfänger („wem?“)</td></tr>
<tr><td>Akkusativ</td><td class="ru">кого? что?</td><td class="ru">книг<b>у</b></td><td>direktes Objekt, Richtung (<span class="ru">в/на</span> wohin?)</td></tr>
<tr><td>Instrumental</td><td class="ru">кем? чем?</td><td class="ru">книг<b>ой</b></td><td>Mittel, „mit“ (<span class="ru">с</span>)</td></tr>
<tr><td>Präpositiv</td><td class="ru">о ком? о чём?</td><td class="ru">о книг<b>е</b></td><td>„über“ (<span class="ru">о</span>), Ort (<span class="ru">в/на</span> wo?)</td></tr>
</tbody></table>
<ul class="examples">
<li><span class="ru">Я читаю книгу.</span> – Ich lese ein Buch. <small>(Akk.)</small></li>
<li><span class="ru">У меня нет книги.</span> – Ich habe kein Buch. <small>(Gen.)</small></li>
<li><span class="ru">Я пишу ручкой.</span> – Ich schreibe mit einem Kuli. <small>(Instr.)</small></li>
<li><span class="ru">Мы говорим о книге.</span> – Wir sprechen über das Buch. <small>(Präp.)</small></li>
<li><span class="ru">Я живу в Москве.</span> – Ich wohne in Moskau. <small>(Präp.)</small></li>
</ul>
<div class="tip"><b>Trick:</b> Bei unbelebten maskulinen Nomen ist der Akkusativ gleich dem Nominativ: <span class="ru">Я вижу стол.</span></div>`,
    quiz: [
      { q: '<span class="ru">Я читаю ___.</span> (книга)', o: ['книгу', 'книга', 'книге', 'книгой'], e: 'Direktes Objekt → Akkusativ.' },
      { q: '<span class="ru">Я живу в ___.</span> (Москва)', o: ['Москве', 'Москву', 'Москва', 'Москвой'], e: 'Ort (wo?) → Präpositiv.' },
      { q: '<span class="ru">Кофе с ___.</span> (молоко)', o: ['молоком', 'молока', 'молоку', 'молоке'], e: '„mit“ → Instrumental.' },
      { q: '<span class="ru">У меня нет ___.</span> (машина)', o: ['машины', 'машину', 'машина', 'машиной'], e: 'Nach нет → Genitiv.' },
      { q: 'Welcher Fall steht nach <span class="ru">о</span> (über)?', o: ['Präpositiv', 'Dativ', 'Akkusativ', 'Genitiv'] },
      { q: 'Welcher Fall antwortet auf <span class="ru">кому?</span>', o: ['Dativ', 'Genitiv', 'Instrumental', 'Nominativ'] },
      { q: '<span class="ru">Я пишу ___.</span> (ручка)', o: ['ручкой', 'ручку', 'ручки', 'ручке'], e: 'Mittel/Werkzeug → Instrumental.' },
    ],
  },
  {
    id: 'past', title: 'Die Vergangenheit', icon: '⏪', level: 'A2',
    summary: 'Ganz einfach: -л, -ла, -ло, -ли.',
    content: `
<p>Die Vergangenheit ist überraschend einfach: Nimm den Infinitiv, streiche <b>-ть</b> und hänge eine Endung an. Die Endung richtet sich nach dem <b>Geschlecht</b> des Subjekts – nicht nach der Person!</p>
<table>
<thead><tr><th>Subjekt</th><th>Endung</th><th><span class="ru">читать</span></th><th><span class="ru">быть</span></th></tr></thead>
<tbody>
<tr><td>maskulin (я, ты, он)</td><td><b>-л</b></td><td class="ru">читал</td><td class="ru">был</td></tr>
<tr><td>feminin (я, ты, она)</td><td><b>-ла</b></td><td class="ru">читала</td><td class="ru">была</td></tr>
<tr><td>neutrum (оно)</td><td><b>-ло</b></td><td class="ru">читало</td><td class="ru">было</td></tr>
<tr><td>Plural (мы, вы, они)</td><td><b>-ли</b></td><td class="ru">читали</td><td class="ru">были</td></tr>
</tbody></table>
<div class="tip"><b>Ich als Frau / Mann:</b> Ein Mann sagt <span class="ru">я читал</span>, eine Frau <span class="ru">я читала</span>.</div>
<div class="tip"><b>Unregelmäßig:</b> <span class="ru">идти → шёл, шла, шли</span> · <span class="ru">есть → ел, ела, ели</span> · <span class="ru">мочь → мог, могла, могли</span></div>`,
    quiz: [
      { q: '<span class="ru">Она ___ книгу.</span> (читать)', o: ['читала', 'читал', 'читали', 'читало'] },
      { q: '<span class="ru">Мы ___ фильм.</span> (смотреть)', o: ['смотрели', 'смотрел', 'смотрела', 'смотрело'] },
      { q: '<span class="ru">Он ___ дома.</span> (быть)', o: ['был', 'была', 'были', 'было'] },
      { q: '<span class="ru">Анна ___ вчера.</span> (работать)', o: ['работала', 'работал', 'работали', 'работало'] },
      { q: '<span class="ru">Вчера они ___ в футбол.</span> (играть)', o: ['играли', 'играл', 'играла', 'играло'] },
      { q: 'Peter sagt: <span class="ru">Я ___ по-русски.</span> (говорить)', o: ['говорил', 'говорила', 'говорили', 'говорило'] },
    ],
  },
  {
    id: 'negation', title: 'Verneinung & „haben“', icon: '🚫', level: 'A1',
    summary: 'не, нет und die Konstruktion у меня есть.',
    content: `
<p><b>Verneinung:</b> Setze einfach <span class="ru">не</span> vor das Wort, das verneint wird: <span class="ru">Я не знаю.</span> – Ich weiß nicht.</p>
<p><b>„Haben“</b> sagt man im Russischen meist mit <span class="ru">у</span> + Genitiv + <span class="ru">есть</span> (wörtlich: „bei mir ist“):</p>
<table>
<thead><tr><th>Russisch</th><th>Deutsch</th></tr></thead>
<tbody>
<tr><td class="ru">у меня есть</td><td>ich habe</td></tr>
<tr><td class="ru">у тебя есть</td><td>du hast</td></tr>
<tr><td class="ru">у него / у неё есть</td><td>er / sie hat</td></tr>
<tr><td class="ru">у нас есть</td><td>wir haben</td></tr>
<tr><td class="ru">у вас есть</td><td>ihr habt / Sie haben</td></tr>
<tr><td class="ru">у них есть</td><td>sie haben</td></tr>
</tbody></table>
<div class="tip"><b>Nicht haben:</b> <span class="ru">у меня нет</span> + Genitiv: <span class="ru">У меня нет времени.</span> – Ich habe keine Zeit.</div>`,
    quiz: [
      { q: '„Ich habe einen Hund.“', o: ['У меня есть собака.', 'Я есть собака.', 'Меня есть собака.', 'У я есть собака.'] },
      { q: 'Wie verneint man <span class="ru">Я знаю</span>?', o: ['Я не знаю.', 'Я нет знаю.', 'Не я знаю.', 'Я знаю нет.'] },
      { q: '<span class="ru">У ___ есть машина.</span> (er hat ein Auto)', o: ['него', 'он', 'его', 'ним'] },
      { q: '„Ich habe keine Zeit.“', o: ['У меня нет времени.', 'У меня не время.', 'Я не есть время.', 'У меня нет время.'], e: 'Nach нет steht der Genitiv: времени.' },
      { q: 'Was bedeutet <span class="ru">У нас есть дом.</span>?', o: ['Wir haben ein Haus.', 'Ihr habt ein Haus.', 'Bei uns ist es zu Hause.', 'Sie haben ein Haus.'] },
    ],
  },
  {
    id: 'numbers', title: 'Zahlen & Nomen', icon: '🔢', level: 'A2',
    summary: 'один год, два года, пять лет – die Zahlenregel.',
    content: `
<p>Nach Zahlen ändert sich die Form des Nomens:</p>
<table>
<thead><tr><th>Zahl</th><th>Form</th><th>Beispiel</th></tr></thead>
<tbody>
<tr><td>1, 21, 31 …</td><td>Nominativ Singular</td><td><span class="ru">один год, одна книга</span></td></tr>
<tr><td>2–4, 22–24 …</td><td>Genitiv Singular</td><td><span class="ru">два года, три книги</span></td></tr>
<tr><td>5–20, 25–30 …, 0</td><td>Genitiv Plural</td><td><span class="ru">пять лет, десять книг</span></td></tr>
</tbody></table>
<div class="tip"><b>Eins und zwei haben Geschlecht:</b> <span class="ru">один</span> (m) / <span class="ru">одна</span> (f) / <span class="ru">одно</span> (n) und <span class="ru">два</span> (m, n) / <span class="ru">две</span> (f): <span class="ru">две книги</span>.</div>
<div class="tip"><b>Alter:</b> <span class="ru">Мне двадцать один год. Ему три года. Ей пять лет.</span> – Das Wort <span class="ru">год</span> wird im Genitiv Plural zu <span class="ru">лет</span>.</div>`,
    quiz: [
      { q: '<span class="ru">пять ___</span> (год)', o: ['лет', 'года', 'год', 'годов'] },
      { q: '<span class="ru">два ___</span> (год)', o: ['года', 'лет', 'год', 'годы'] },
      { q: '<span class="ru">один ___</span> (год)', o: ['год', 'года', 'лет', 'годы'] },
      { q: '<span class="ru">три ___</span> (книга)', o: ['книги', 'книг', 'книга', 'книгу'] },
      { q: 'Wie heißt „zwei“ vor einem femininen Nomen?', o: ['две', 'два', 'двое', 'двух'] },
      { q: '<span class="ru">двадцать один ___</span> (год)', o: ['год', 'года', 'лет', 'годы'], e: 'Endet auf 1 → Nominativ Singular.' },
      { q: '<span class="ru">Мне двадцать пять ___.</span>', o: ['лет', 'года', 'год', 'годов'] },
    ],
  },
  {
    id: 'motion', title: 'Gehen & Fahren', icon: '🚶', level: 'A2',
    summary: 'идти und ехать – und die Frage „wo?“ vs. „wohin?“.',
    content: `
<p>Russisch unterscheidet genau, <b>wie</b> man sich fortbewegt: <span class="ru">идти</span> = zu Fuß gehen, <span class="ru">ехать</span> = mit einem Fahrzeug fahren.</p>
<div class="two-col">
<table>
<thead><tr><th colspan="2"><span class="ru">идти</span> (gehen)</th></tr></thead>
<tbody>
<tr><td class="ru">я</td><td class="ru">иду</td></tr><tr><td class="ru">ты</td><td class="ru">идёшь</td></tr><tr><td class="ru">он/она</td><td class="ru">идёт</td></tr>
<tr><td class="ru">мы</td><td class="ru">идём</td></tr><tr><td class="ru">вы</td><td class="ru">идёте</td></tr><tr><td class="ru">они</td><td class="ru">идут</td></tr>
</tbody></table>
<table>
<thead><tr><th colspan="2"><span class="ru">ехать</span> (fahren)</th></tr></thead>
<tbody>
<tr><td class="ru">я</td><td class="ru">еду</td></tr><tr><td class="ru">ты</td><td class="ru">едешь</td></tr><tr><td class="ru">он/она</td><td class="ru">едет</td></tr>
<tr><td class="ru">мы</td><td class="ru">едем</td></tr><tr><td class="ru">вы</td><td class="ru">едете</td></tr><tr><td class="ru">они</td><td class="ru">едут</td></tr>
</tbody></table>
</div>
<div class="tip"><b>Wohin?</b> → <span class="ru">в/на</span> + Akkusativ: <span class="ru">Я иду в школу.</span><br><b>Wo?</b> → <span class="ru">в/на</span> + Präpositiv: <span class="ru">Я в школе.</span></div>`,
    quiz: [
      { q: '„Ich fahre nach Moskau.“ (mit dem Zug)', o: ['Я еду в Москву.', 'Я иду в Москву.', 'Я еду в Москве.', 'Я идёт в Москву.'] },
      { q: '„Wir gehen ins Kino.“ (zu Fuß)', o: ['Мы идём в кино.', 'Мы едем в кино.', 'Мы идут в кино.', 'Мы идём в кине.'] },
      { q: '<span class="ru">они ___</span> (идти)', o: ['идут', 'идят', 'идёт', 'идём'] },
      { q: '<span class="ru">ты ___</span> (ехать)', o: ['едешь', 'едет', 'ехаешь', 'едёшь'] },
      { q: 'Wohin? <span class="ru">Я иду в ___.</span> (школа)', o: ['школу', 'школе', 'школа', 'школы'] },
      { q: 'Wo? <span class="ru">Я сейчас в ___.</span> (школа)', o: ['школе', 'школу', 'школа', 'школой'] },
    ],
  },
];
