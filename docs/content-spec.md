# OpenEAM — Content & Design Spec (faithful rebuild of openeam.it)

Source: 10 full-page screenshots + pitch PDF, extracted 2026-07-15. Language: **Italian**.
Legal entity: **Seedma SRL** — Via Barletta 9, 95125 Catania — P.IVA 05728230870.
Brand tagline: *"Il primo software di gestione asset e manutenzione che si adatta ai tuoi processi. E non viceversa."*
Tone: challenger-brand, informal "tu", benefit-led, provocative toward legacy EAM/CMMS.

## Design tokens

| Token | Hex | Use |
|---|---|---|
| `orange` (brand) | `#FF5B04` | CTAs, logo "e", highlighted heading words, icons, arrows |
| `orange-deep` | `#CC500E` | hover / hero ring shade |
| `ink` (navy) | `#233038` | hero bg, dark panels, headings, dark buttons |
| `teal` | `#075056` | logo/trust band bg, teal pills, photo arc overlays, section bg |
| `cyan` | `#0FAFBC` | decorative hero blade/arc shapes |
| `mint` | `#8FCEB5` | small status accents |
| `bg-100` | `#EBEFF0` | page light grey bg |
| `bg-200` | `#F0F3F4` | split-card text half |
| `bg-050` | `#F7F9F9` | split-card media half / near-white |
| `surface` | `#FFFFFF` | cards |
| `slate` | `#3A4B5A` | body text on light |
| `slate-muted` | `#5A6F79` | secondary body |
| `on-dark` | `#DDE7E8` | body text on dark |

Note: hue drifts slightly per page (orange sampled `#F15A22`/`#F26522`/`#E8641C`; teal `#0C4F4F`). **Canonicalize to the logo values** `#FF5B04` orange + `#075056`/`#0FAFBC` teal + `#233038` ink across the whole site.

Type: headings = **Poppins** (700/800, geometric rounded). Body/UI = **Inter** (400/500/600). Self-host via `@fontsource`.

Recurring motifs: rounded white cards + soft shadow; orange pill buttons (primary + "Scopri di più"); teal pill ("Richiedi una demo" on light); teal quarter-circle arc overlay on feature-card photos; faint dotted-grid texture on hero/light bg; concentric orange+teal rings graphic (hero, demo bg).

## Global chrome

**Nav** (sticky, white bar, logo left): Home · Platform ▾ (mega-menu: Asset Management / Maintenance & Operations / Technical Documentation / Asset Analytics) · By Industry ▾ (Manufacturing / Oil & Gas / Large scale facilities — orange → arrows) · Pricing. No nav CTA button. Logo = "open" wordmark, orange "e", subtitle "maintenance & assets".

**Footer** (white): left = logo + "maintenance & assets" + slogan *"L'EAM su misura per i tuoi processi."* Right = 3 columns:
- Sitemap: Home, Pricing
- Platform: Asset Management, Maintenance & Operations, Technical Documentation, Asset Analytics
- By Industry: Manufacturing, Oil & Gas, Large Scale Facilities

Legal bar: *"Open EAM è un prodotto di **Seedma SRL**. Tutti i diritti sono riservati."* · *"Seedma SRL - Via Barletta 9 - 95125 Catania - P.IVA 05728230870"* · Privacy Policy · Cookies Policy (underlined).

---

## Page: Home `/`
1. **Hero** (dark navy, dotted grid, concentric orange+teal rings right):
   - H1 two-tone: "Mantieni i tuoi asset industriali" (white) + "al massimo dell'efficienza." (orange)
   - Sub: "Open EAM è la piattaforma che unisce manutenzione, asset management e controllo operativo in un unico sistema flessibile, che si adatta ai tuoi processi. **E non viceversa.**"
   - CTAs: "Richiedi una demo" (orange pill) · "Video tour della piattaforma" (outline pill)
2. **Trust band** (teal): "Il software di manutenzione e asset management scelto da" + logos: STMicroelectronics, Sonatrach, SARAS, SAC, SASOL, siam.
3. **Modules intro + 4 alternating feature cards** (light bg): heading "Manutenzione, asset management, documenti e analytics in una piattaforma che prende la forma dei tuoi processi". Sub: "Open EAM racchiude in un unico sistema **modulare** e **personalizzabile** tutte le funzioni necessarie a mantenere impianti produttivi organizzati e performanti, a ridurre i fermi impianto e a migliorare l'efficienza."
   - Cards (icon + copy + photo w/ teal arc + "Scopri di più"): **Asset Management** ("Ottimizza il ciclo di vita degli asset con gestione centralizzata, visibilità completa e integrazione dei dati, anche in organizzazioni multisito con strutture complesse."), **Maintenance & Operations** ("Pianifica, traccia e ottimizza attività manutentive programmate, predittive e correttive con flussi personalizzati sulle tue procedure e sui tuoi impianti, riducendo downtime e sprechi di risorse."), **Technical Documentation** ("Centralizza e collega la documentazione tecnica agli asset, integrandola nei flussi operativi per un accesso immediato e sicuro, ovunque ti trovi."), **Asset Analytics** ("Trasforma dati IoT, geospaziali e digital twin in insight immediatamente azionabili, con KPI e dashboard sempre disponibili per essere utilizzati nei processi decisionali.")
   - Centered teal pill: "Richiedi una demo"
4. **Testimonial** (centered): "Open EAM ha reso semplice ciò che prima era frammentato: oggi gestiamo manutenzione, ispezioni e asset su un'unica piattaforma, che sembra cucita addosso a noi." — **Francesco Vassallo**, Sonatrach.
5. **Architettura modulare band** (photo left + dark panel right): "Un'architettura modulare, costruita attorno ai tuoi processi" / "Non piegare i tuoi processi alle regole di un software preconfezionato. Scopri l'EAM modulare costruito a misura della tua azienda." CTA "Vai al video tour della piattaforma".
6. **Casi studio** (2x2 grid + "Esplora tutti i case studies" outline pill): ST Microelectronics, Sonatrach, Sasol, SAC (blurbs below). Sub: "Scopri come altre aziende utilizzano Open EAM per migliorare l'efficienza e le performance della manutenzione nei loro impianti produttivi."

## Platform pages (shared template: dark hero w/ icon + two-tone H1 + sub + orange "Richiedi una demo" → alternating split cards w/ Lottie/illustration → dark/orange CTA band → footer)

### `/platform/asset-management` — hero bg dark navy, gear icon
Sub: "OpenEAM centralizza e organizza ogni asset in una struttura solida, scalabile e flessibile. A differenza degli EAM tradizionali, non sei tu ad adattarti al software: la piattaforma si modella sui tuoi processi, permettendoti di operare in contesti multi-sito, complessi e in continua evoluzione." (3 split-card sections re: multi-site model / data ETL unification / relations — build faithful feature blocks; ETL diagram nodes ERP/SCADA/IoT/External → dati unificati.)

### `/platform/maintenance-operations` — hero bg teal, wrench icon
Sub: "Con Open EAM pianifichi, esegui e tracci ogni attività manutentiva e operativa in un'unica piattaforma. La differenza è che non devi adattare le tue procedure al software: la piattaforma si plasma sui tuoi processi esistenti, potenziandoli."
- "Gestione completa delle attività manutentive e ispettive" — checklist Lottie (`list_controllo_pressione_e_filtri`). Body: "Dalla manutenzione preventiva, a quella predittiva, alle ispezioni: ogni attività è pianificata e monitorata in base alle logiche e priorità del tuo flusso di lavoro. Check-list, schede tecniche e autorizzazioni vengono integrate nel sistema senza snaturare le procedure che già funzionano in azienda."
- "Visualizza e gestisci reti di asset" — node-graph Lottie (`albero_P01_S08_A15_L30`). Body: "Mappe interattive e viste gerarchiche ti permettono di monitorare asset collegati fra loro, come impianti, linee di produzione o infrastrutture di servizio. Il sistema rispecchia le relazioni operative esistenti, così la gestione in rete avviene secondo la tua logica e non secondo uno schema rigido."
- "Ricambi e listini sempre sotto controllo" — spare-parts Lottie (`list_with_pz_150pz_110_pz_80pz`). Body: "Monitora disponibilità, movimenti e costi di magazzino. Associa ricambi e materiali agli asset e agli interventi, garantendo approvvigionamenti puntuali e una gestione economica ottimizzata."
- "Passaggi di consegna efficaci" — handover Lottie (`Turno_Docs_arrows`). Body: "OpenEAM gestisce il passaggio di informazioni tra turni e squadre secondo le procedure interne, garantendo tracciabilità completa e riducendo il rischio di errori. La trasmissione delle conoscenze operative avviene direttamente nella piattaforma, integrandosi nei tuoi flussi standard."
- CTA band (teal): "Operazioni fluide, manutenzione intelligente" / "Con Open EAM hai il pieno controllo di processi, asset e risorse, in un'unica piattaforma che si adatta ai tuoi flussi di lavoro e migliora le performance operative."

### `/platform/technical-documentation` — hero bg orange, document icon (H1 line2 "management" dark; CTA dark pill)
Sub: "Open EAM collega disegni, manuali e procedure agli asset, rendendoli accessibili ovunque in modo sicuro e immediato, riducendo tempi e rischi."
- "Organizza e struttura tutta la documentazione tecnica" — doc-tree Lottie (`three_manuale_Schema_certificazioni`). Body: "Classificazione, versioning, ricerca avanzata e controllo delle revisioni: Open EAM assicura che ogni documento sia aggiornato, tracciato e conforme alle normative, evitando errori e duplicazioni."
- "Integrazione con AutoCAD e BIM" — CAD/BIM hub Lottie (`file_cad_open_EAM_modello_BIM`). Body: "Visualizza e gestisci file CAD e modelli BIM direttamente dalla piattaforma, mantenendo la coerenza tra progettazione, documentazione e operatività. I dati tecnici sono sempre sincronizzati con le modifiche di progetto."
- CTA band (orange): "Documentazione connessa, operatività continua" / "Con Open EAM la documentazione tecnica diventa parte attiva dei tuoi processi, integrata con asset e operazioni per garantire precisione, rapidità e conformità." (dark pill CTA)

### `/platform/asset-analytics` — hero bg light grey (photo + teal shapes), chart icon
Sub: "Open EAM trasforma flussi di dati IoT, sensori e sistemi esterni in analisi chiare e centralizzate. Con dashboard e KPI sempre aggiornati, puoi monitorare asset, anticipare problemi e ottimizzare performance in tempo reale."
- "Dati in tempo reale connessi via IoT" — Lottie `dashboar_with_sensore_allarme`. Body: "Integra Open EAM con sensori, PLC e sistemi SCADA per avere una visione costante e aggiornata delle condizioni operative degli asset. I dati arrivano in tempo reale e vengono automaticamente associati a ciascun asset."
- "Business Intelligence integrata" — Lottie `dashboard_insight_immediati`. Body: "Con gli strumenti di Business Intelligence nativi, Open EAM trasforma dati complessi in visualizzazioni intuitive e report personalizzati. Puoi analizzare prestazioni, costi, frequenza degli interventi e trend di utilizzo, identificando aree di inefficienza o di miglioramento."
- "Analisi geospaziale e digital twin" — Lottie `house_with_dots` (+ `Verono_Roma_Catania` for multi-site). Body: "La piattaforma integra funzionalità GIS e digital twin per dare un contesto visivo e operativo ai tuoi asset. Puoi visualizzare la distribuzione geografica, simulare scenari di utilizzo e pianificare interventi considerando vincoli e opportunità legati alla posizione fisica."
- "KPI sempre sotto controllo" — Lottie `dashboard_MTBF_tempi_intervento_costi_fermo`. Body: "Definisci i KPI più rilevanti per il tuo business e monitora le performance con aggiornamenti automatici e costanti. Che si tratti di MTBF (Mean Time Between Failures), tempi di intervento o costi di fermo macchina, Open EAM ti fornisce un quadro chiaro e confrontabile nel tempo, così puoi misurare l'efficacia delle azioni intraprese e adattare rapidamente le strategie operative."
- CTA band (sage panel): "Dai dati al valore, in tempo reale" / "Con Open EAM, ogni informazione è connessa, analizzata e tradotta in insight operativi e strategici. Non solo vedi cosa sta accadendo: capisci perché e sai come agire."

## Industry pages (shared template: full-bleed photo hero w/ dark overlay + centered H1 + sub + orange CTA → centered intro → feature-card grid → "Case studies" orange-gradient band → footer)

### `/industries/manufacturing` — hero photo: auto welding robots line. Sub "Efficienza produttiva, dal primo all'ultimo asset"
Intro: "OpenEAM ottimizza la gestione degli asset e dei processi produttivi partendo dalla realtà del tuo impianto. La piattaforma si adatta al layout, alle logiche e ai flussi della tua produzione, così puoi ridurre downtime, garantire la qualità e migliorare le performance senza ristrutturare i processi che già funzionano."
4 cards: "Si adatta ai tuoi processi, non il contrario" / "Produzione più fluida, meno fermi macchina" / "Dati integrati, decisioni immediate" / "Tutta la documentazione tecnica in ordine" (full body in extract — see source). Case study: ST microelectronics.

### `/industries/oil-and-gas` — hero photo: orange pipelines. Sub "Efficienza e sicurezza in ogni fase operativa". Intro bg teal.
Intro: "Open EAM offre alle aziende del settore Oil & Gas una piattaforma modulare capace di adattarsi a contesti estremamente complessi, dove sicurezza, tracciabilità e rapidità d'intervento sono priorità assolute. Che si tratti di raffinerie, impianti offshore o reti di distribuzione, la piattaforma integra dati, documentazione e processi operativi in un unico ecosistema, garantendo un controllo completo e una gestione in linea con i più alti standard di settore."
5 cards on teal: "Manutenzione sicura e sempre sotto controllo" / "Piattaforma che si adatta a ogni sito e processo" / "Gestione strutturata dei manuali operativi d'impianto" / "Asset distribuiti, visione centralizzata" / "Gestione handover" (full body in source). Case studies: SONATRACH, SASOL.

### `/industries/large-scale-facilities` — hero photo: aerial logistics yard. Sub "Gestione integrata di strutture complesse e multi-sito". Intro bg dark navy.
Intro: "Dagli aeroporti alle reti idriche, dai grandi parchi commerciali ai campus, Open EAM offre a gestori e operatori uno strumento unico per coordinare asset, manutenzioni, documentazione e dati operativi. In contesti dove ogni minuto di fermo comporta impatti significativi, la piattaforma garantisce visibilità totale, interventi rapidi e conformità alle normative, anche su più siti e con team distribuiti."
5 cards on navy: "Interventi sempre pianificati e tracciati" / "Gestione efficace di strutture complesse" / "Documentazione tecnica e normativa a portata di clic" / "Supervisione completa, anche su più siti" / "Gestione efficiente degli asset in rete" (full body in source). Case studies: SAC, SIAM.

## Case Studies (collection) `/case-studies` index + detail pages
- **ST Microelectronics** (Manufacturing/semiconductors): 2 Catania plants; >30–40k interventions/yr; 10% saving at contract renewal; 80% planned ratio.
- **SASOL** (Petrochemical, Augusta SR): 60,000 technical documents via Archivio Tecnico; external firms access revisions remotely; fire inspections.
- **SONATRACH** (Refinery/depots Augusta, Napoli, Palermo): 3 legacy systems consolidated into one Ispezioni module; Terminale Marittimo ship checks.
- **SAC** (Catania Airport): third-party inspections + planned + on-call; Segnalazioni ticketing for non-technical users; Archivio Tecnico.
- **SIAM** (water utility, Siracusa/Ragusa aqueducts): digitalized reporting + maintenance of aqueducts. *(short blurb only — not in deck)*
- **SARAS** (refinery): *(logo/trust only — no deck content; minimal page or omit detail)*

## Pricing `/pricing`
Hero statement (centered, "testare la tecnologia" orange): "L'investimento iniziale è calibrato per permettere di testare la tecnologia senza pesare sul budget in corso, garantendo la sostenibilità finanziaria nel tempo."
1. 3-card grid (isometric monoline illos — pricing tier imgs `start/mid/pro.png`): "Una soluzione che cresce con l'azienda" / "Un investimento proporzionale" / "Da 0 a regime in sei mesi" (bullets in source).
2. Two wide pills: **SaaS** ("Un canone mensile proporzionato ai moduli attivi, al numero di stabilimenti e di utenti.") / **On premise** ("Se hai esigenze di sicurezza o compliance specifiche, puoi installare Open EAM sui tuoi server.")
3. **Un ROI tangibile** (narrative + 5×2 chip grid). Sub: "Non puoi gestire ciò che non misuri. Con Open EAM, ogni centesimo è tracciato." Chips: Riduzione Costi Diretti→Risparmio 15-20% / Tracciamento costi→Per singolo intervento e ricambio / Ottimizzazione gestione Ricambi→Niente emergenze né giacenze / Controllo su contratti e listini fornitori→Maggior potere contrattuale / Da know-how frammentato→Ad archivio tecnico strutturato.
4. Orange "Contattaci" CTA button.
5. Trust logo band (teal).
6. **Domande frequenti** — 8-item accordion (full Q&A in source; fix OCR typos: "la massima", "contratti e", "costi diretti", "la vostra").

## Demo `/demo`
Dark navy bg + concentric orange/teal arcs bottom-right. White card center. H1 "Scopri Open EAM". Sub: "Prenota un tour della piattaforma gratuito e senza impegno con un consulente specializzato. Scopri gli strumenti, le funzioni e come potrebbe funzionare per la tua azienda."
Form fields: Nome, Cognome, Azienda, Ruolo (select "Seleziona..."), Email aziendale. Submit "Richiedi la demo" (orange pill). Consent checkbox: "Acconsento al trattamento dei miei dati personali in conformità con l'Informativa sulla Privacy." → EmailJS.

## Lottie → section mapping
| Animation file | Page / section |
|---|---|
| `list_controllo_pressione_e_filtri` | Maintenance › Gestione completa attività |
| `albero_P01_S08_A15_L30` | Maintenance › Reti di asset |
| `list_with_pz_150pz_110_pz_80pz` | Maintenance › Ricambi e listini |
| `Turno_Docs_arrows` | Maintenance › Passaggi di consegna |
| `three_manuale_Schema_certificazioni` | Tech Doc › Organizza documentazione |
| `file_cad_open_EAM_modello_BIM` | Tech Doc › AutoCAD & BIM |
| `dashboar_with_sensore_allarme` | Analytics › Dati IoT real-time |
| `dashboard_insight_immediati` | Analytics › Business Intelligence |
| `house_with_dots` | Analytics › Geospaziale & digital twin |
| `dashboard_MTBF_tempi_intervento_costi_fermo` | Analytics › KPI |
| `Verono_Roma_Catania` | Analytics geo / LSF multi-site (secondary) |
| `Verniciatura_Essicazione_Movimentazione` | Manufacturing / Asset Mgmt (secondary) |
