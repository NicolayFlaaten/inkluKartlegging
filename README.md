# AccessNorway — Kartleggingsverktøy

Nasjonalt digitalt kartleggingsverktøy for tilgjengelighet i norsk reiseliv.  
Forankret i **Norwegian Travel Cluster (NTC)** · Faglig ledet av **INKLU Valdres**  
Finansiert av **Bufdir 2026**

**Live:** [nicolayflaaten.github.io/inkluKartlegging](https://nicolayflaaten.github.io/inkluKartlegging)

---

## Filosofi

> "Fortell meg hva du har, så kan jeg vurdere om det passer mine behov."

Ingen kategorisering av brukere. Presis og ærlig informasjon. Mennesker med funksjonsnedsettelse er med som meddesignere — ikke bare testere.

---

## Filer

| Fil | Beskrivelse | Status |
|---|---|---|
| `index.html` | Kartleggingsverktøyet (bedriften kartlegger) | ✅ Live |
| `guide.html` | Offentlig tilgjengelighetsguide per enhet | 🔵 Mockup — kobles til DB |
| `erfaring.html` | Brukererfaringsskjema for gjester | 🔵 Mockup — kobles til DB |
| `dashboard.html` | Bedriftens interne oversikt | 🔵 Mockup — kobles til DB |
| `CHANGELOG.md` | Alle endringer versjon for versjon | ✅ Oppdateres ved hver release |
| `README.md` | Denne filen | ✅ |

---

## Teknisk stack

| Komponent | Teknologi |
|---|---|
| Frontend | HTML / CSS / JS — single-file prototype |
| Hosting | GitHub Pages |
| AI-proxy | Cloudflare Worker (`green-block-aa07accessnorway.rzt4p6sh68.workers.dev`) |
| AI-modell | Claude claude-haiku-4-5 (via Anthropic API) |
| Kart / GPX | Leaflet.js + Nominatim/OpenStreetMap |
| Geografi | SSB KLASS 527 (2021) — 67 reiselivsregioner |
| Database (planlagt) | Supabase / PostgreSQL |

---

## Versjonering

Prosjektet bruker `MAJOR.MINOR.PATCH`:

- **MAJOR** — stor arkitekturendring eller nasjonal lansering
- **MINOR** — ny funksjonalitet (ny side, ny flyt, ny integrasjon)
- **PATCH** — bugfikser, justeringer, prompt-endringer

Prototype-fasen bruker `0.x.x`. Versjon `1.0.0` = nasjonal løsning klar.

### Hvordan oppdatere versjon

1. Gjør endringene i relevante filer
2. Oppdater `APP_VERSION` i `index.html`:
   ```js
   const APP_VERSION = 'v0.4.1'; // én linje, øverst i script-blokken
   ```
3. Legg til ny seksjon øverst i `CHANGELOG.md`:
   ```markdown
   ## [v0.4.1] — YYYY-MM-DD
   ### Endret
   - Beskrivelse av hva som ble gjort
   ```
4. Last opp til GitHub med beskrivende commitmelding:
   ```
   v0.4.1 — justerte AI-prompts til nøytral tone
   ```

**Versjonsnummeret vises i topbaren i appen** — enkelt å bekrefte at riktig versjon er lastet opp.

---

## Opplasting til GitHub

> ⚠️ Filen er ~80–90 KB. Bruk alltid **"Upload files"** (drag and drop) — aldri lim inn i GitHub-editoren, den trunkerer store filer.

1. Gå til [github.com/NicolayFlaaten/inkluKartlegging](https://github.com/NicolayFlaaten/inkluKartlegging)
2. Klikk **"Add file" → "Upload files"**
3. Dra filene inn
4. Skriv commitmelding: `v0.4.1 — [kort beskrivelse]`
5. Klikk **"Commit changes"**

GitHub Pages oppdateres automatisk innen ~30 sekunder.

---

## Enhetssystem

| Gruppe | Type | Kartlegges av |
|---|---|---|
| **A** | Bygningsbaserte bedrifter (hotell, restaurant, aktivitet, idrett, camping) | Bedriften selv |
| **B1** | Guidede turer / friluftsliv | Bedriften selv |
| **B2** | Vannsport / padling | Bedriften selv |
| **B3** | Kjøretøy og dyr (sykkel, ridning, hundespann, slede) | Bedriften selv |
| **B4** | Tilpassede naturopplevelser | Bedriften selv |
| **C** | Fellesgoder (stier, løyper, badeplasser, HC-parkering, utsiktspunkt) | Kommune / fjellstyre / DNT |

---

## API-endepunkter (planlagt — implementeres av Ole)

### Innkommende
| Metode | Endepunkt | Beskrivelse |
|---|---|---|
| `POST` | `/api/kartlegging` | Lagre fullført kartlegging |
| `POST` | `/api/bilde/analyser` | KI-analyse av enkeltbilde |
| `POST` | `/api/enhet` | Opprett ny enhet |
| `PUT` | `/api/enhet/:id/bekreft` | Årlig bekreftelse av info |
| `POST` | `/api/enhet/:id/erfaring` | Send brukererfaring |

### Utgående
| Metode | Endepunkt | Beskrivelse |
|---|---|---|
| `GET` | `/api/enhet/:id/guide` | Offentlig tilgjengelighetsguide |
| `GET` | `/api/enhet/:id/erfaringer` | Brukererfaringer |
| `GET` | `/api/sok` | Søk med filter (region, gruppe, type, tagger) |
| `GET` | `/api/org/:id/dashboard` | Bedriftsdashboard |
| `GET` | `/api/region/:ssb_kode/sammendrag` | Reisemål-rapport |

### Payload fra `index.html` → `POST /api/kartlegging`

```json
{
  "enhet": {
    "navn": "...", "gruppe": "A", "type": "hotell",
    "adresse": "...", "kommune": "...", "fylke": "...",
    "ssb_region": "...", "lat": 61.02, "lng": 8.90
  },
  "kartlegging": {
    "dato": "ISO8601", "godkjent_av": "Navn", "status": "bekreftet"
  },
  "soner": [{
    "id": "inngang", "label": "Inngang og adkomst",
    "status": "gronn",
    "gjeste_tekst": "...",
    "datapunkter": [{ "felt": "dorbredde_cm", "verdi": "90", "kilde": "mal" }],
    "bilder": [{ "kategori": "inngang", "ai_analyse": "...", "url": null }]
  }],
  "svar": { "q_ledsager": "ja", "q_teleslynge": "nei" },
  "gpx": { "lengde_km": 1.33, "stigning_opp_m": 17, "maks_stigning_pst": 16.2 },
  "tagger": ["vinter", "ledsagerbevis"]
}
```

---

## Kontakt og samarbeid

| Rolle | Person | Ansvar |
|---|---|---|
| Prosjektleder / frontend | Nicolay Flaaten | Kartleggingsverktøy, rapporter, UX |
| Database / backend | Ole | PostgreSQL, REST API, auth |
| Faglig forankring | INKLU Valdres (BHSS, Beitostølen Utvikling, Øystre Slidre Kommune) | Innhold, kartleggingsmanual |
| Nasjonal koordinering | NTC (Norwegian Travel Cluster) | 50 reisemål, 5000 bedrifter |

---

*Sist oppdatert: 2026-06-07 · Versjon v0.4.1*
