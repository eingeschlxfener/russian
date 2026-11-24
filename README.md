# Klang – Musik ohne Werbung

Ein werbefreier Musikplayer als Web-App (PWA), den du wie eine echte App auf den Home-Bildschirm legen kannst.

## Was die App kann

- **Eigene Songs importieren** (MP3, M4A, AAC, FLAC, WAV, OGG …). Titel, Interpret, Album und Cover werden automatisch aus den Dateien gelesen. Die Songs werden auf dem Gerät gespeichert und laufen **offline**.
- **Freie Musik entdecken**: Suche im Internet Archive (Netlabels, Live-Konzerte, gemeinfreie Aufnahmen). Das ist legal und kostenlos, Songs lassen sich auch offline speichern.
- **Wiedergabe im Hintergrund und bei gesperrtem Bildschirm**, mit Steuerung auf dem Sperrbildschirm, in der Benachrichtigung und über Kopfhörer-Tasten (Media Session API).
- Lieblingssongs, Playlists, Warteschlange, Zufallswiedergabe, Wiederholen (alle/einen), Sleep-Timer.
- Merkt sich den letzten Song und die Position, auch nach einem Neustart.
- Keine Werbung, kein Konto, kein Tracking. Alles bleibt auf deinem Gerät.

## Online stellen (GitHub Pages, kostenlos)

1. Auf GitHub im Repository: **Settings → Pages**
2. Bei *Source*: **Deploy from a branch** wählen
3. Branch auswählen (z. B. `main` oder diesen Branch), Ordner **/ (root)**, **Save**
4. Nach 1–2 Minuten ist die App unter `https://<dein-name>.github.io/<repo>/` erreichbar

## Zum Home-Bildschirm hinzufügen

- **iPhone (Safari):** Seite öffnen → Teilen-Symbol → **„Zum Home-Bildschirm“**
- **Android (Chrome):** Seite öffnen → Menü ⋮ → **„App installieren“** bzw. „Zum Startbildschirm hinzufügen“

Danach startet Klang im Vollbild wie eine normale App.

## Lokal testen

```bash
python3 -m http.server 8000
# dann http://localhost:8000 öffnen
```

## Hinweise

- Songs aus dem Spotify-Katalog kann die App nicht abspielen, denn das ginge nur, indem man Spotify umgeht. Lade stattdessen Musik hoch, die dir gehört (z. B. gekaufte MP3s), oder nutze die freie Musik.
- iPhone: Wiedergabe im Hintergrund funktioniert am zuverlässigsten ab iOS 16.4. Wenn iOS den Speicher knapp findet, kann es Daten von Web-Apps löschen, die lange nicht geöffnet wurden. Behalte deine Originaldateien also als Backup.
