/* Wortschatz nach Themen. Format pro Zeile: russisch|deutsch */
window.RU_DATA = window.RU_DATA || {};

window.RU_DATA.topics = [
  { id: 'basics', name: 'Begrüßung & Basics', icon: '👋', color: '#e5383b', level: 'A1', words: `
привет|hallo (informell)
здравствуйте|guten Tag (formell)
пока|tschüss
до свидания|auf Wiedersehen
спасибо|danke
пожалуйста|bitte
да|ja
нет|nein
извините|entschuldigen Sie
доброе утро|guten Morgen
добрый день|guten Tag
добрый вечер|guten Abend
спокойной ночи|gute Nacht
как дела?|wie geht's?
хорошо|gut
плохо|schlecht
меня зовут|ich heiße
очень приятно|sehr angenehm
я не понимаю|ich verstehe nicht
всё в порядке|alles in Ordnung` },

  { id: 'family', name: 'Familie', icon: '👨‍👩‍👧', color: '#f2a516', level: 'A1', words: `
семья|Familie
мама|Mama
папа|Papa
мать|Mutter
отец|Vater
сын|Sohn
дочь|Tochter
брат|Bruder
сестра|Schwester
бабушка|Großmutter
дедушка|Großvater
муж|Ehemann
жена|Ehefrau
ребёнок|Kind
дети|Kinder
дядя|Onkel
тётя|Tante
друг|Freund
подруга|Freundin
родители|Eltern` },

  { id: 'numbers', name: 'Zahlen', icon: '🔢', color: '#2f5bea', level: 'A1', words: `
ноль|null
один|eins
два|zwei
три|drei
четыре|vier
пять|fünf
шесть|sechs
семь|sieben
восемь|acht
девять|neun
десять|zehn
одиннадцать|elf
двенадцать|zwölf
двадцать|zwanzig
тридцать|dreißig
сорок|vierzig
пятьдесят|fünfzig
сто|hundert
тысяча|tausend
миллион|Million` },

  { id: 'colors', name: 'Farben', icon: '🎨', color: '#7b4dff', level: 'A1', words: `
красный|rot
синий|blau
голубой|hellblau
зелёный|grün
жёлтый|gelb
оранжевый|orange
фиолетовый|lila
розовый|rosa
белый|weiß
чёрный|schwarz
серый|grau
коричневый|braun
золотой|golden
серебряный|silbern
цвет|Farbe
светлый|hell
тёмный|dunkel
яркий|leuchtend` },

  { id: 'food', name: 'Essen & Trinken', icon: '🥟', color: '#14a37f', level: 'A1', words: `
еда|Essen
хлеб|Brot
вода|Wasser
молоко|Milch
чай|Tee
кофе|Kaffee
сок|Saft
сыр|Käse
мясо|Fleisch
рыба|Fisch
яблоко|Apfel
груша|Birne
банан|Banane
картошка|Kartoffel
суп|Suppe
яйцо|Ei
сахар|Zucker
соль|Salz
масло|Butter / Öl
торт|Torte
пиво|Bier
вино|Wein
овощи|Gemüse
фрукты|Obst
завтрак|Frühstück
обед|Mittagessen
ужин|Abendessen` },

  { id: 'animals', name: 'Tiere', icon: '🐻', color: '#b5651d', level: 'A1', words: `
собака|Hund
кошка|Katze
кот|Kater
медведь|Bär
волк|Wolf
лиса|Fuchs
заяц|Hase
птица|Vogel
лошадь|Pferd
корова|Kuh
свинья|Schwein
мышь|Maus
курица|Huhn
лев|Löwe
тигр|Tiger
слон|Elefant
обезьяна|Affe
змея|Schlange
белка|Eichhörnchen
ёж|Igel` },

  { id: 'body', name: 'Körper', icon: '💪', color: '#e5383b', level: 'A1', words: `
голова|Kopf
лицо|Gesicht
глаз|Auge
ухо|Ohr
нос|Nase
рот|Mund
зуб|Zahn
волосы|Haare
рука|Hand / Arm
нога|Fuß / Bein
палец|Finger
сердце|Herz
живот|Bauch
спина|Rücken
плечо|Schulter
шея|Hals
колено|Knie
язык|Zunge / Sprache` },

  { id: 'clothes', name: 'Kleidung', icon: '👕', color: '#2f5bea', level: 'A1', words: `
одежда|Kleidung
рубашка|Hemd
футболка|T-Shirt
брюки|Hose
джинсы|Jeans
платье|Kleid
юбка|Rock
куртка|Jacke
пальто|Mantel
шапка|Mütze
шарф|Schal
обувь|Schuhe
ботинки|Stiefel
носки|Socken
перчатки|Handschuhe
свитер|Pullover
очки|Brille
сумка|Tasche` },

  { id: 'home', name: 'Haus & Wohnung', icon: '🏠', color: '#f2a516', level: 'A1', words: `
дом|Haus
квартира|Wohnung
комната|Zimmer
кухня|Küche
ванная|Badezimmer
спальня|Schlafzimmer
окно|Fenster
дверь|Tür
стол|Tisch
стул|Stuhl
кровать|Bett
диван|Sofa
шкаф|Schrank
лампа|Lampe
холодильник|Kühlschrank
ключ|Schlüssel
стена|Wand
пол|Fußboden
лестница|Treppe
сад|Garten` },

  { id: 'city', name: 'Stadt & Verkehr', icon: '🏙️', color: '#7b4dff', level: 'A1', words: `
город|Stadt
улица|Straße
площадь|Platz
магазин|Geschäft
рынок|Markt
банк|Bank
аптека|Apotheke
больница|Krankenhaus
школа|Schule
ресторан|Restaurant
гостиница|Hotel
вокзал|Bahnhof
аэропорт|Flughafen
метро|U-Bahn
автобус|Bus
трамвай|Straßenbahn
машина|Auto
поезд|Zug
мост|Brücke
парк|Park
музей|Museum
церковь|Kirche` },

  { id: 'time', name: 'Zeit', icon: '⏰', color: '#14a37f', level: 'A1', words: `
время|Zeit
день|Tag
ночь|Nacht
утро|Morgen (Tageszeit)
вечер|Abend
неделя|Woche
месяц|Monat
год|Jahr
сегодня|heute
завтра|morgen
вчера|gestern
сейчас|jetzt
час|Stunde
минута|Minute
рано|früh
поздно|spät
скоро|bald
потом|danach` },

  { id: 'calendar', name: 'Wochentage & Monate', icon: '📅', color: '#2f5bea', level: 'A1', words: `
понедельник|Montag
вторник|Dienstag
среда|Mittwoch
четверг|Donnerstag
пятница|Freitag
суббота|Samstag
воскресенье|Sonntag
январь|Januar
февраль|Februar
март|März
апрель|April
май|Mai
июнь|Juni
июль|Juli
август|August
сентябрь|September
октябрь|Oktober
ноябрь|November
декабрь|Dezember` },

  { id: 'nature', name: 'Wetter & Natur', icon: '🌦️', color: '#14a37f', level: 'A1', words: `
погода|Wetter
солнце|Sonne
дождь|Regen
снег|Schnee
ветер|Wind
облако|Wolke
небо|Himmel
жарко|heiß (es ist heiß)
холодно|kalt (es ist kalt)
тепло|warm (es ist warm)
зима|Winter
весна|Frühling
лето|Sommer
осень|Herbst
море|Meer
река|Fluss
лес|Wald
гора|Berg
дерево|Baum
цветок|Blume` },

  { id: 'jobs', name: 'Berufe', icon: '👩‍⚕️', color: '#f2a516', level: 'A2', words: `
работа|Arbeit
врач|Arzt
учитель|Lehrer
учительница|Lehrerin
студент|Student
инженер|Ingenieur
повар|Koch
водитель|Fahrer
продавец|Verkäufer
полицейский|Polizist
программист|Programmierer
журналист|Journalist
музыкант|Musiker
художник|Maler
писатель|Schriftsteller
медсестра|Krankenschwester
юрист|Jurist
официант|Kellner` },

  { id: 'verbs', name: 'Wichtige Verben', icon: '🏃', color: '#e5383b', level: 'A1', words: `
быть|sein
делать|machen
говорить|sprechen
знать|wissen / kennen
понимать|verstehen
хотеть|wollen
мочь|können
идти|gehen
ехать|fahren
жить|leben / wohnen
работать|arbeiten
читать|lesen
писать|schreiben
слушать|zuhören
смотреть|schauen
есть|essen
пить|trinken
спать|schlafen
любить|lieben
играть|spielen
учить|lernen
думать|denken
видеть|sehen
покупать|kaufen
помогать|helfen` },

  { id: 'adjectives', name: 'Adjektive', icon: '✨', color: '#7b4dff', level: 'A1', words: `
большой|groß
маленький|klein
новый|neu
старый|alt
хороший|gut
плохой|schlecht
красивый|schön
быстрый|schnell
медленный|langsam
горячий|heiß
холодный|kalt
длинный|lang
короткий|kurz
дорогой|teuer
дешёвый|billig
лёгкий|leicht
трудный|schwierig
весёлый|fröhlich
умный|klug
интересный|interessant` },

  { id: 'feelings', name: 'Gefühle', icon: '😊', color: '#f2a516', level: 'A2', words: `
радость|Freude
счастливый|glücklich
грустный|traurig
злой|wütend
усталый|müde
голодный|hungrig
страх|Angst
любовь|Liebe
надежда|Hoffnung
скучно|langweilig
спокойный|ruhig
удивлённый|überrascht
нервный|nervös
довольный|zufrieden
одинокий|einsam` },

  { id: 'hobbies', name: 'Freizeit & Hobbys', icon: '⚽', color: '#14a37f', level: 'A1', words: `
музыка|Musik
книга|Buch
фильм|Film
спорт|Sport
футбол|Fußball
танцевать|tanzen
петь|singen
рисовать|zeichnen
плавать|schwimmen
гулять|spazieren gehen
игра|Spiel
путешествие|Reise
фотография|Foto
гитара|Gitarre
шахматы|Schach
кино|Kino
театр|Theater
компьютер|Computer` },

  { id: 'school', name: 'Schule & Lernen', icon: '🎒', color: '#2f5bea', level: 'A1', words: `
урок|Unterrichtsstunde
учебник|Lehrbuch
тетрадь|Heft
ручка|Kugelschreiber
карандаш|Bleistift
слово|Wort
вопрос|Frage
ответ|Antwort
русский язык|russische Sprache
экзамен|Prüfung
домашнее задание|Hausaufgabe
класс|Klasse
университет|Universität
доска|Tafel
бумага|Papier
ошибка|Fehler
правило|Regel` },

  { id: 'questions', name: 'Fragewörter & Kleine Wörter', icon: '❓', color: '#7b4dff', level: 'A1', words: `
кто|wer
что|was
где|wo
куда|wohin
откуда|woher
когда|wann
почему|warum
как|wie
сколько|wie viel
какой|welcher
и|und
или|oder
но|aber
тоже|auch
очень|sehr
здесь|hier
там|dort
всегда|immer
никогда|nie` },

  { id: 'travel', name: 'Reisen', icon: '✈️', color: '#e5383b', level: 'A2', words: `
билет|Fahrkarte / Ticket
паспорт|Reisepass
чемодан|Koffer
карта|Karte
деньги|Geld
граница|Grenze
отпуск|Urlaub
турист|Tourist
самолёт|Flugzeug
такси|Taxi
остановка|Haltestelle
налево|nach links
направо|nach rechts
прямо|geradeaus
далеко|weit
близко|nah
сколько стоит?|was kostet das?` },
];
