# The World in One Day — Sunday 22 November 2026

[![Competition](https://make.fun/badge/news-image-20261122.svg)](https://make.fun/competitions/news-image-20261122?utm_source=github&utm_medium=badge&utm_campaign=news-image-20261122&utm_content=competition)
[![Rank](https://make.fun/badge/news-image-20261122/Mansyur0523/makefun-news-image-20261122-r1/rank.svg)](https://make.fun/competitions/news-image-20261122?utm_source=github&utm_medium=badge&utm_campaign=news-image-20261122&utm_content=rank)
[![Reward](https://make.fun/badge/news-image-20261122/Mansyur0523/makefun-news-image-20261122-r1/reward.svg)](https://make.fun/competitions/news-image-20261122?utm_source=github&utm_medium=badge&utm_campaign=news-image-20261122&utm_content=reward)

One-page newspaper poster summing up Sunday 22 November 2026 in a single
1024x1024 image: 38 dated stories, 7 regions, 13 pinned locations, a date
check and a stat strip. Every story is dated to that Sunday and sourced from
Reuters, AP, BBC, CNN, WSJ, Cricinfo, Al Jazeera and ANTARA. Claims that
could not be verified independently are labelled [CLAIM].

The poster is drawn entirely in code — no photos, no vector fonts. All type
is a hand-built 5x7 bitmap font. `main.ts` (Node stdlib only) validates the
PNG and copies it byte-identically to `$MAKEFUN_OUTPUT_DIR`.

## The 38 stories

**Top stories**
1. COP31 collapses in Antalya — no deal, first breakdown since Copenhagen 2009 (Reuters/AP/BBC)
2. Iran strikes Bahrain, targets US bases at Al-Riffa and Awali (Reuters)
3. Russian drone levels a Kyiv flat in Dymer — 2 dead, 14 missing (AP)

**Features**
4. Russian cargo ship Sparta II hit by Ukrainian drones in the Gulf of Finland (Finnish Border Guard)
5. Verstappen wins a wild Las Vegas GP — 75th career win (Formula 1/AP)
6. India 720/9 declared in Wellington, top Test total in New Zealand (Cricinfo)
7. Anthropic slides 8.5% on Friday after its IPO pop (Reuters/WSJ)
8. China eases margin trading rules to 80% from 30 Nov (Reuters)
9. Trump meme coin gala: 185 wallets in, top 29 at VIP dinner (Reuters)
10. Schumer faces his first Senate leadership fight from Van Hollen (Reuters)
11. Eisenkot condemns settler arson in the West Bank (Reuters)
12. Alcaraz into the Turin final after beating Shelton (Reuters)
13. Man City 1-1 Fulham, Arsenal 2-2 Newcastle (AP)

**Briefs 14–38**
14. Hong Kong Election Committee poll draws record 98.79% turnout (Gov.HK)
15. Sudan drones kill 4 near Khartoum (Al Jazeera)
16. Saudi coalition intercepts a Houthi drone headed for Riyadh (Reuters)
17. Two tankers hit in the Strait of Hormuz (Reuters)
18. Nepal PM Balendra Shah arrives in Delhi for a 22–23 Nov state visit (MEA)
19. Cricketer Yuzvendra Chahal joins the BJP (Jagran)
20. Baduy fire: 19 homes burn in Banten, 19 Nov (ANTARA)
21. US stayed away from COP31 (CNN)
22. FC Goa beat NorthEast United 1-0 (ISL)
23. 90+ nations sign a COP31 electrification pledge (CNN)
24. Nasdaq fell 5.3% on Friday; S&P 500 and Dow entered correction (NY Post)
25. Zelenskyy: Russia fired about 2,700 drones and 165 missiles this week (Zelenskyy)
26. Russia says it downed 170 Ukrainian drones overnight (AP)
27. Anthropic IPO raised $81bn, priced $83, opened $111.50 (WSJ)
28. Anthropic's green-shoe option exercised on Friday (WSJ)
29. China's margin easing also cuts fees, adds ChiNext market-making (Reuters)
30. Trump posts handshake photo with Putin [CLAIM]
31. Israel and the US reported to draw up a joint contingency plan vs Iran [CLAIM]
32. October 2026 ran 1.8C warmer than the mid-1800s (Berkeley Earth)
33. ATP final Sunday: Alcaraz vs world No. 1 Zverev (Reuters)
34. Arsenal stay six points clear at the top (AP)
35. UK energy chief: failed COP31 draft "moves us backwards on the science" (The Times)
36. COP31 is now the longest climate summit on record (edie)
37. US official: Bahrain attack caused no damage to US personnel or facilities (CBS)
38. UN chief Guterres "deeply disappointed" COP31 ended without consensus (edie)

## Regions (38 stories)

Europe 6 · Mid East 6 · Asia 8 · Africa 1 · N America 8 · Sport 5 · Climate 4

## Build

The poster is generated from scratch by `gen.py` (kept outside this repo).
Run it to reproduce `entry.png` byte-identically, then:

```sh
MAKEFUN_OUTPUT_DIR=/output node main.ts
```

`main.ts` validates the PNG (magic bytes, size, dimensions, IHDR first,
IDAT present, IEND last, CRC-32 of every chunk, RGB 8-bit), refuses to
write inside the repo, copies the file and re-verifies the sha256.
