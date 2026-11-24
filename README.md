# Привет! – Russisch spielerisch lernen

Eine moderne Lern-Web-App für Russisch mit deutscher Oberfläche. Sie besteht nur aus HTML, CSS und JavaScript: keine Installation, kein Server, kein Konto nötig.

## Starten

- **Lokal:** `index.html` im Browser öffnen (Doppelklick genügt).
- **Online:** Das Repository über GitHub Pages veröffentlichen (Settings → Pages → Branch wählen). Danach ist die App unter `https://<benutzer>.github.io/russian/` erreichbar.

Für Sprachausgabe und Spracherkennung funktionieren Chrome und Edge am besten. Safari unterstützt die Sprachausgabe.

## Funktionen

### Lernen
- **Alphabet:** alle 33 Buchstaben mit Laut, Beispielwort und Aussprache. Sie sind gruppiert nach „Wie im Deutschen“, „Falsche Freunde“ und „Neue Zeichen“. Dazu gibt es ein Buchstaben-Quiz, ein Lesetraining und ein Tipptraining für die russische Tastatur.
- **Vokabeln:** über 400 Wörter in 21 Themen mit Suche, Umschrift, „Alle anhören“ und einem Modus zum Verbergen der deutschen Übersetzung.
- **Grammatik:** 11 Lektionen, von Geschlecht und Konjugation bis zu den sechs Fällen. Jede Lektion hat Tabellen, Tipps, anklickbare Beispiele und eine Übung.
- **Zahlen:** ein Konverter von Ziffern in russische Zahlwörter (bis 999.999.999) und ein Trainer zum Hören, Lesen und Schreiben.
- **Phrasebuch:** 59 Alltagssätze in 6 Kategorien, mit Favoriten, Suche und langsamer Wiedergabe.

### Üben
- **Karteikarten** mit Leitner-Wiederholungssystem: Was du gut kannst, kommt seltener dran.
- **Quiz** (Multiple Choice) mit Combo-Bonus
- **Schreiben** mit kyrillischer Bildschirmtastatur und Lautschrift-Eingabe (`privet` → `привет`)
- **Hören:** Bedeutung wählen, Wort erkennen oder Diktat schreiben
- **Sprechen:** Aussprache-Prüfung per Mikrofon

### Spielen
- **Memory:** Wortpaare finden
- **Zeitrennen:** 60 Sekunden richtig/falsch
- **Wortregen:** fallende Wörter übersetzen
- **Luftballons:** ein Wort Buchstabe für Buchstabe erraten
- **Buchstabensalat:** Anagramme lösen
- **Satzbau:** Sätze aus Wortbausteinen bilden

### Motivation
- XP, Level mit russischen Titeln (Новичок → Легенда), Tagesserie und einstellbares Tagesziel
- 30 Erfolge bzw. Abzeichen, Aktivitäts-Heatmap und eine Statistik nach Lernstufe
- Wort und Satz des Tages

### Weiteres
- Werkzeuge: Transliteration in beide Richtungen und ein freies Kyrillisch-Schreibfeld mit Vorlesefunktion
- Heller und dunkler Modus, optimiert für Handy und Desktop
- Tastaturkürzel: Tasten `1`–`4` für Antworten, `Leertaste` zum Umdrehen von Karten, `Enter` für „Weiter“, Pfeiltasten im Zeitrennen
- Der Fortschritt wird lokal im Browser gespeichert und lässt sich exportieren und importieren.

## Aufbau

```
index.html
css/styles.css
js/data/      Lerninhalte: Alphabet, Vokabeln, Phrasen, Grammatik
js/core.js    Zustand, XP, Wiederholungssystem, Sprache, Sounds, Erfolge
js/ui.js      gemeinsame Bausteine: Quiz-Runde, Ergebnis, Tastatur, Modal
js/views/     die einzelnen Seiten
js/app.js     Router und Navigation
```

Neue Vokabeln trägst du in `js/data/vocab.js` ein, eine Zeile pro Wort im Format `russisch|deutsch`.
