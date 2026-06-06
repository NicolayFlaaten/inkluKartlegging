# Endringslogg — AccessNorway Kartleggingsverktøy

Alle vesentlige endringer dokumenteres her.  
Format: `MAJOR.MINOR.PATCH` — prototype-fase bruker `0.x.x`.

---

## [v0.4.1] — 2026-06-07

### Endret
- **AI-prompts revidert — nøytral beskrivende tone** — alle 24 sone-prompts, DEFAULT_PROMPT, profilbilde-prompt og guide-generering er omskrevet. Fjernet "Du er ekspert på universell utforming" som rolle, og eksplisitt "Unngå karakterer og dommer — la gjesten vurdere om det passer for dem". Natursti-kontekst skilles nå fra bygg-standarder.
- **Guide-generering** — lagt til instruksjon om å unngå ord som "dessverre", "mangelfull", "ikke egnet". STATUS-forklaringene presisert: GRONN = fungerer for de fleste, GUL = avhenger av behov, RØD = begrenset — beskriv hva.
- **Versjonsnummer i appen** — `v0.4.1` vises i topbaren og som `APP_VERSION`-konstant i JS

### Lagt til
- `README.md` — prosjektdokumentasjon for GitHub-repoet; dekker filstruktur, teknisk stack, versjoneringsflyt, opplastingsinstruks, API-endepunkter og payload-format; tilpasset både Nicolay og Ole
- `CHANGELOG.md` oppdateres nå automatisk ved hver versjon — ikke manuelt

### Fjernet
- Terrengmodell-integrasjon (Open Topo Data / Open-Elevation) — CORS-problemer og ustabile resultater (0-verdier for Norge). GPX-analyse kjører nå utelukkende på GPS-høyder med smoothing og justerte grenseverdier.

---

## [v0.4.0] — 2026-06-06

### Ny funksjonalitet
- **Payload-struktur for database** — `byggKartleggingPayload()` pakker hele kartleggingen til strukturert JSON klar for API
- **API-integrasjon** — `sendTilAPI()` POSTer til `/api/kartlegging` ved godkjenning; feil logges til konsoll uten å påvirke brukerflyt
- **GPS-koordinater i state** — `state.lat` og `state.lng` lagres ved automatisk GPS-oppslag og inkluderes i payload

### Nye filer
- `guide.html` — offentlig tilgjengelighetsguide per enhet; leser fra `GET /api/enhet/:id/guide`; demo-modus uten `?enhet_id=`
- `erfaring.html` — brukererfaringsskjema; POSTer til `/api/enhet/:id/erfaring`; URL-parametere for kontekst
- `dashboard.html` — bedriftens interne oversikt; viser enheter, fremgang og brukererfaringer; demo-modus uten `?org_id=`

### GPX-analyse forbedret
- Medianfilter (vindu 5 punkter) på høydedata fjerner GPS-støy
- Maks stigning beregnes over minimum 20 meter — ikke punkt-til-punkt
- Korrekt `avgSlope`-formel (var feil — delte på halv distanse)
- Grenseverdier i `gpxVurdering()` hevet ~4% for å kompensere GPS-unøyaktighet:
  - Rullestol OK: ≤5% → ≤9%
  - Krevende rullestol: ≤8% → ≤13%
  - Bare gående: ≤12% → ≤18%
- Merknad i UI: "Stigningsdata er beregnet fra GPS-høyder. Grenseverdiene er justert for å ta høyde for GPS-unøyaktighet."

### Ryddet opp
- Fjernet terrengmodell-integrasjon (Open Topo Data / Open-Elevation) — CORS-problemer og ustabile API-er
- Enklere og mer robust GPX-flyt uten eksterne avhengigheter

---

## [v0.3.0] — 2026-05-XX

### Datamodell
- Alle 12 tabeller definert: `ORGANISASJON`, `BRUKER`, `SSB_REGION`, `ENHET`, `KARTLEGGING`, `BILDE`, `DATAPUNKT`, `NATURENHET`, `BRUKERERFARING`, `TAGG`, `ENHET_TAGG`, `SAMLING`, `SAMLING_ENHET`
- `SSB_REGION` skilt ut som egen tabell (var hardkodet streng)
- `NATURENHET.gpx_vurdering_type` lagt til (standard vs. kjøretøy for B3)
- `BRUKERERFARING` uten `funksjonsevne`-felt (filosofi: ingen brukerkategorisering)

### API-endepunkter definert
- `POST /api/kartlegging` — lagre fullført kartlegging
- `POST /api/bilde/analyser` — KI-analyse av enkeltbilde
- `POST /api/enhet` — opprett enhet
- `PUT /api/enhet/:id/bekreft` — årlig bekreftelse
- `GET /api/enhet/:id/guide` — offentlig tilgjengelighetsguide
- `GET /api/sok` — søk og filtrering
- `GET /api/region/:ssb_kode/sammendrag` — reisemål-rapport
- `POST /api/enhet/:id/erfaring` — send brukererfaring
- `GET /api/enhet/:id/erfaringer` — hent erfaringer

---

## [v0.2.0] — 2026-04-XX

### Kartleggingsflyt
- Steg-basert flyt: Sted → Fasiliteter → Spørsmål → Rapport
- AI-analyse av bilder via Cloudflare Worker proxy (CORS-løsning for Safari/iPhone)
- iPhone Måleverktøy-veiledning for fysiske mål
- GPX-opplasting med Leaflet.js-kart og SVG-høydeprofil
- Fargekoding av GPX-rute: grønn ≤5%, gul 5–8%, rød >8%
- Kontekst-sensitiv stigningsvurdering: B3 (kjøretøy/dyr) skiller seg fra standard

### Entitetstyper
- **Gruppe A** — bygningsbaserte bedrifter (16 typer: hotell, hytte, restaurant, aktivitet, idrett, camping m.fl.)
- **Gruppe B** — naturbaserte aktivitetsbedrifter (B1 guidede turer, B2 vannsport, B3 kjøretøy/dyr, B4 tilpasset natur)
- **Gruppe C** — naturbaserte fellesgoder (tursti, sykkelsti, skiløype, badeplass, utsiktspunkt, HC-parkering)

### Tilgjengelighetsguide
- AI-genererte sone-tekster (redigerbare)
- Grønn/gul/rød status per sone
- Godkjenningsflyt med kartlegger-navn og tidsstempel
- Nedlastbar HTML-guide (statisk, ingen interaktive elementer)

---

## [v0.1.0] — 2026-03-XX

### Prototype etablert
- Enkel HTML/CSS/JS single-file prototype
- GitHub Pages hosting (`nicolayflaaten.github.io/inkluKartlegging`)
- Cloudflare Worker som API-proxy for Anthropic Claude
- GPS-basert automatisk stedsdeteksjon via Nominatim/OpenStreetMap
- Alle 67 SSB KLASS 527 reiselivsregioner integrert
- `claude-haiku-4-5` som AI-modell
- Ja/Nei/Vet-ikke tap-knapper med event delegation (`data-*` attributter)
- Profilbilde med automatisk AI-analyse

---

## Planlagt

### v0.5.0 — Database-tilkobling (Ole)
- PostgreSQL via Supabase
- REST API med alle definerte endepunkter
- JWT-basert autentisering for bedriftsdashboard
- Bildehåndtering via ekstern lagring (S3 eller tilsvarende)
- Koble `guide.html`, `erfaring.html` og `dashboard.html` til live API

### v0.6.0 — Brukererfaringer live
- Moderering av brukererfaringer i dashboard
- Aggregert visning på offentlig guide
- Automatisk varsling til bedrift ved nye erfaringer

### v1.0.0 — Nasjonal løsning
- Innlogging og organisasjonshierarki
- Chatbot-integrasjon for destinasjoner
- Visit Norway / ENAT API-kobling
- Inklu-opplæringspakke integrert

---

*Prosjekt: AccessNorway — nasjonal tilgjengelighetsplattform for norsk reiseliv*  
*Forankret i Norwegian Travel Cluster (NTC) · Faglig ledet av INKLU Valdres*  
*Finansiert av Bufdir 2026*
