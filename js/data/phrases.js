/* Phrasebuch und Sätze für den Satzbau */
window.RU_DATA = window.RU_DATA || {};

window.RU_DATA.phraseCategories = [
  { id: 'smalltalk', name: 'Kennenlernen', icon: '🤝', phrases: `
Как вас зовут?|Wie heißen Sie?
Как тебя зовут?|Wie heißt du?
Меня зовут Анна.|Ich heiße Anna.
Откуда вы?|Woher kommen Sie?
Я из Германии.|Ich komme aus Deutschland.
Сколько тебе лет?|Wie alt bist du?
Мне двадцать пять лет.|Ich bin fünfundzwanzig Jahre alt.
Вы говорите по-немецки?|Sprechen Sie Deutsch?
Я немного говорю по-русски.|Ich spreche ein bisschen Russisch.
Повторите, пожалуйста.|Wiederholen Sie bitte.
Говорите медленнее, пожалуйста.|Sprechen Sie bitte langsamer.
Что это значит?|Was bedeutet das?
Как сказать по-русски?|Wie sagt man das auf Russisch?
Рад познакомиться!|Freut mich, dich kennenzulernen!` },

  { id: 'restaurant', name: 'Im Restaurant', icon: '🍽️', phrases: `
Меню, пожалуйста.|Die Speisekarte, bitte.
Счёт, пожалуйста.|Die Rechnung, bitte.
Столик на двоих, пожалуйста.|Einen Tisch für zwei, bitte.
Что вы посоветуете?|Was empfehlen Sie?
Я хочу заказать борщ.|Ich möchte Borschtsch bestellen.
Можно воды?|Kann ich Wasser bekommen?
Очень вкусно!|Sehr lecker!
Я не ем мясо.|Ich esse kein Fleisch.
Приятного аппетита!|Guten Appetit!
Можно оплатить картой?|Kann ich mit Karte zahlen?` },

  { id: 'transport', name: 'Unterwegs', icon: '🚇', phrases: `
Где вокзал?|Wo ist der Bahnhof?
Как пройти к метро?|Wie komme ich zur U-Bahn?
Один билет до Москвы, пожалуйста.|Eine Fahrkarte nach Moskau, bitte.
Когда отправляется поезд?|Wann fährt der Zug ab?
Это далеко?|Ist das weit?
Остановите здесь, пожалуйста.|Halten Sie bitte hier.
Я заблудился.|Ich habe mich verlaufen.
Где здесь туалет?|Wo ist hier die Toilette?
Покажите на карте, пожалуйста.|Zeigen Sie es mir bitte auf der Karte.` },

  { id: 'shopping', name: 'Einkaufen', icon: '🛍️', phrases: `
Сколько это стоит?|Wie viel kostet das?
Это слишком дорого.|Das ist zu teuer.
Я просто смотрю.|Ich schaue nur.
У вас есть хлеб?|Haben Sie Brot?
Дайте, пожалуйста, это.|Geben Sie mir bitte das.
Можно примерить?|Kann ich das anprobieren?
Мне нужен пакет.|Ich brauche eine Tüte.
Где касса?|Wo ist die Kasse?` },

  { id: 'emergency', name: 'Notfall', icon: '🚑', phrases: `
Помогите!|Hilfe!
Вызовите врача!|Rufen Sie einen Arzt!
Вызовите полицию!|Rufen Sie die Polizei!
Мне плохо.|Mir geht es schlecht.
Где больница?|Wo ist das Krankenhaus?
У меня болит голова.|Ich habe Kopfschmerzen.
Я потерял паспорт.|Ich habe meinen Pass verloren.
Где аптека?|Wo ist die Apotheke?` },

  { id: 'wishes', name: 'Wünsche & Feiern', icon: '🎉', phrases: `
С днём рождения!|Alles Gute zum Geburtstag!
С Новым годом!|Frohes neues Jahr!
Поздравляю!|Herzlichen Glückwunsch!
Удачи!|Viel Glück!
Будьте здоровы!|Gesundheit!
За здоровье!|Prost! (Auf die Gesundheit!)
Я тебя люблю.|Ich liebe dich.
Спасибо большое!|Vielen Dank!
Не за что.|Keine Ursache.
Всего хорошего!|Alles Gute!` },
];

/* Sätze für das Satzbau-Spiel */
window.RU_DATA.sentences = `
Я люблю чай.|Ich liebe Tee.
Меня зовут Анна.|Ich heiße Anna.
Где находится вокзал?|Wo befindet sich der Bahnhof?
Мы живём в Берлине.|Wir wohnen in Berlin.
Сегодня очень холодно.|Heute ist es sehr kalt.
У меня есть собака.|Ich habe einen Hund.
Я не говорю по-русски.|Ich spreche kein Russisch.
Он читает интересную книгу.|Er liest ein interessantes Buch.
Мы идём в кино.|Wir gehen ins Kino.
Моя сестра работает врачом.|Meine Schwester arbeitet als Ärztin.
Сколько стоит этот билет?|Wie viel kostet diese Fahrkarte?
Завтра будет хорошая погода.|Morgen wird das Wetter gut.
Я учу русский язык.|Ich lerne Russisch.
Кот спит на диване.|Der Kater schläft auf dem Sofa.
Вчера я был в музее.|Gestern war ich im Museum.
Дети играют в парке.|Die Kinder spielen im Park.
Ты любишь музыку?|Magst du Musik?
Мой брат живёт в Москве.|Mein Bruder wohnt in Moskau.
Я пью кофе с молоком.|Ich trinke Kaffee mit Milch.
Она поёт очень красиво.|Sie singt sehr schön.
Это мой новый телефон.|Das ist mein neues Telefon.
Летом мы едем на море.|Im Sommer fahren wir ans Meer.
Я не понимаю этот вопрос.|Ich verstehe diese Frage nicht.
Как тебя зовут?|Wie heißt du?
Папа читает газету.|Papa liest die Zeitung.
Мама готовит ужин.|Mama kocht das Abendessen.
Где моя сумка?|Wo ist meine Tasche?
Это очень вкусный торт.|Das ist eine sehr leckere Torte.
Я хочу пить.|Ich habe Durst.
Магазин закрыт.|Das Geschäft ist geschlossen.`;
