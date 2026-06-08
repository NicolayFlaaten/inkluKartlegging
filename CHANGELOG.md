# Endringslogg — AccessNorway Kartleggingsverktøy

Alle vesentlige endringer dokumenteres her.  
Format: `MAJOR.MINOR.PATCH` — prototype-fase bruker `0.x.x`.

## [v0.4.12] — 2026-06-08

### Endret
- **Rediger-knapper i guide** — to forekomster i `lagSoneHTML()` bruker nå `T('sone_rediger')` og `T('sone_rediger_tekst')`
- **Stigning krevende — utvidet anbefaling** — `stigning_krevende` oppdatert på alle tre språk: anbefaler nå elektrisk rullestol eller scooter ved krevende stigning, med henvisning til leverandør

---

## [v0.4.11] — 2026-06-08

### Lagt til
- **`Q_UTSAGN`-oversettelseskart** — alle 25 utsagn-tekster (tilleggstjenester i guide) oversatt til engelsk og spansk; `buildGuide()` bruker nå oversatt tekst basert på `state.lang`
- **Gruppe-badge oversatt** — "B — Naturbasert aktivitetsbedrift" o.l. bruker nå `T('gruppe_b')` osv.

### Endret
- **Chat-velkomstmelding** — "Hei! Jeg kan svare på spørsmål..." bruker nå `T('chat_hei')` og `T('chat_hva_lurer')`
- **Guide-seksjoner** — "Fasiliteter og tilgjengelighet", "Tilleggstjenester", "Under oppholdet", "Spør om tilgjengelighet" bruker nå `T()`-nøkler
- **Ja/Nei-knapper** — bruker nå `T('ja')` / `T('nei')`; vises som "Sí"/"No" på spansk
- **"Last ned JSON"** — navigasjonsknapp på steg 4 bruker nå `T('last_ned_json_btn')`
- **guide-hero-type** — enhetens typenavnet bruker nå `TL(config.label)` for oversettelse
- **Godkjenn-seksjon** — alle tekster (instruksjon, navn-placeholder, knapp, nedlastingsknapper, footer) bruker nå `T()`

---

## [v0.4.10] — 2026-06-08

### Endret
- Versjonsnummer justert tilbake fra v0.5.1 til v0.4.10 — flerspråklig er minor/patch, ikke major
- Løst kritisk feil: `chat_hei_generell: T('chat_hei_generell')` inne i `TEKST.no`-objektet krasjet hele scriptet ved oppstart (selvreference ved initialisering)

---

## [v0.4.9] — 2026-06-08

### Lagt til
- **Spørsmålstekster oversatt** — `Q_TEXT` og `Q_CTX`-kart med oversettelser for alle ~25 spørsmål på engelsk og spansk; `buildQuestions()` bruker nå oversatt tekst
- **`EF_LABEL`-kart og `TEF()`-funksjon** — oversetter EXTRA_FIELDS målefelt-labels (Dørbredde, Stigningsgrad o.l.) på engelsk og spansk
- **`Q_UTSAGN`-grunnstruktur** — forberedt for tilleggstjeneste-oversettelser

### Endret
- **pageDesc i TYPE_CONFIG** — alle 17 unike beskrivelsestekster lagt til i `LABEL_MAP` for engelsk og spansk; `TL()` oversetter automatisk
- **GPX-statistikk** — "Distanse", "Maks stigning", "Snitt stigning", "Stigning opp", "GPX-ANALYSE" bruker nå `T()`-nøkler
- **Slope-legend** — refaktorert til `getLegendHtml()`-funksjon som kalles dynamisk; legend oppdateres ved språkbytte
- **JSON-eksport** — `charset=utf-8` lagt til i Blob-type; løser encoding-feil (Ã¸/Ã˜) i nedlastet JSON

---

## [v0.4.8] — 2026-06-08

### Endret
- **Systematisk språkgjennomgang** — alle JS-genererte UI-strenger med norske tegn (ø/å/æ) utenfor oversettelsesblokker erstattet med `T()`-kall
- **GPX-vurderingstekster** — alle `gpxVurdering()`-returstrenger bruker nå `T()`-nøkler på alle tre språk
- **GPS-feilmeldinger** — bruker nå `T('gps_ikke_tilgjengelig')`, `T('gps_avslatt')`, `T('gps_oppdater')`
- **Chat-feilmelding, godkjenning, guide-titler** — bruker nå `T()`

### Fikset
- Kritisk feil: `T()`-kall inne i `TEKST.no`-blokken for `gps_*` og `chat_feil` krasjet scriptet — erstattet med direkte strenger
- `guide-gpx-stat-label`-elementer hadde ugyldige `"'>` i generert HTML — rettet

---

## [v0.4.7] — 2026-06-08

### Lagt til
- **Sone-upload-tekster** — "Ta bilde eller velg fra bibliotek", "Alle bilder kan analyseres individuelt", "Egne notater (valgfritt)" bruker nå `T()`
- **Stigning-vurderingstekster** — alle seks `gpxVurdering()`-strenger lagt til i `TEKST` for no/en/es

---

## [v0.4.6] — 2026-06-08

### Endret
- Lastet inn oppdatert fil fra bruker (v0.4.5) som base
- **Sone-kort** — "Ta bilde eller velg fra bibliotek", "Alle bilder kan analyseres individuelt", "EGNE NOTATER (VALGFRITT)" og "Analyserer..." bruker nå `T()`

---

## [v0.4.5] — 2026-06-08

### Lagt til
- **Spansk (ES)** — tredje språk fullt implementert; NO/EN/ES-knapper i topbar
- **`LABEL_MAP`** — refaktorert fra `LABEL_EN` til flernivå-kart (`LABEL_MAP.en`, `LABEL_MAP.es`) med ~80 zone- og type-labels per språk
- **`oppdaterI18n()`** — traverserer DOM og oppdaterer `data-i18n`, `data-i18n-ph`, `data-i18n-label` og `data-i18n-label-val`-attributter
- **`spraakNavn`** — dynamisk variabel brukt i alle AI-prompts; støtter nå 'norsk' / 'English' / 'español'

### Endret
- Alle statiske HTML-elementer på side 0–3 har fått `data-i18n`-attributter
- Alle `f.eks.`-placeholders oversettes til `e.g.` (EN) eller `p.ej.` (ES) via `oppdaterI18n()`

---

## [v0.4.4] — 2026-06-07

### Lagt til
- **Spansk grunnstruktur** — `TEKST.es`-blokk med ~50 nøkler; ES-knapp i topbar

### Fikset
- `T('gps_juster_fylke')` inne i `TEKST.no`-objektet krasjet scriptet — erstattet med direkte streng
- `state` deklarert før `TEKST`-objektet (var etter — `const` er ikke hoistet)

---

## [v0.4.3] — 2026-06-07

### Lagt til
- **Engelsk (EN)** — andre språk implementert; NO/EN-knapper i topbar
- **`TEKST`-objekt med `no`/`en`-blokker** — alle UI-tekster samlet
- **`T('nokkel')`-funksjon** — henter riktig tekst; faller tilbake til norsk
- **`byttSpraak(lang)`** — bytter språk og kaller `oppdaterI18n()` + `goTo(state.step)`
- **Steg-piller, navigasjonsknapper, GPX-labels, sone-titler** — alle oversatt

### Fikset
- `Don't know` hadde apostrof i enkeltfnutt-streng — krasjet JS; byttet til doble anførselstegn

---

## [v0.4.2] — 2026-06-07

### Lagt til
- **Flerspråklig støtte** — norsk og engelsk implementert; arkitektur støtter flere språk i fremtiden
- **`TEKST`-objekt** — alle UI-tekster samlet i ett objekt med `no` og `en` blokker; nye språk legges til ved å kopiere en blokk og oversette
- **`T('nokkel')`-funksjon** — henter riktig tekst basert på `state.lang`; faller tilbake til norsk om oversettelse mangler
- **`byttSpraak(lang)`-funksjon** — bytter språk og re-rendrer gjeldende steg
- **Språkvelger i topbaren** — `NO` / `EN`-knapper med visuell markering av aktivt språk
- **AI-output på valgt språk** — bildeanalyser, sone-tekster, chat og profilbilde-analyse instrueres til å svare på valgt språk via `spraakNavn`-variabel i alle prompts
- **`spraak`-felt i payload** — `kartlegging.spraak: 'no'/'en'` sendes til API så Ole vet hvilket språk teksten er på

### Endret
- Alle hardkodede "på norsk" i AI-prompts erstattet med dynamisk `spraakNavn`-variabel
- Versjonsnummer i topbar og `APP_VERSION` oppdatert til `v0.4.2`

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
