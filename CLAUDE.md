# Istruzioni progetto — openeam_website

## Regola tipografica: niente orfani a fine riga

Nessun blocco di testo (titoli, paragrafi, liste, caption) deve terminare
l'ultima riga con 1-2 parole isolate ("vedova/orfana"). L'ultima parola
va sempre riportata sulla riga precedente.

Esempio:

```
Testo di esempio per
il sito
```
→ atteso:
```
Testo di esempio per il sito
```

**Soluzione applicata globalmente**: `text-wrap: pretty` su
`p, h1-h6, li, blockquote, figcaption` in [src/styles/global.css](src/styles/global.css).
Copre automaticamente la maggior parte dei casi nei browser che lo supportano
(Chrome/Edge 117+, Firefox 121+; Safari non supportato ancora — fallback
normale wrap, nessun danno).

Per titoli hero dove serve controllo preciso anche su Safari, usare
`text-wrap: balance` (già in uso in alcune pagine) oppure un `&nbsp;`
manuale tra le ultime due parole del testo.

Quando scrivi o modifichi testo in `.astro`/`.mdx`, se il layout finale
mostra un'orfana e il CSS non basta (Safari, larghezze strette), inserisci
uno spazio non-breaking (`&nbsp;` in HTML, ` ` in stringhe JS) tra le
ultime due parole del blocco.
