### **SBNZ - Predlog projekta**

**Naziv projekta: LiveMatch Analyst - Sistem za automatsko generisanje sportskih komentara i analize**

Autori:

- Aleksa Perović SV24/2021
- Vladimir Čornenki SV53/2021

### **Opis problema koji se rešava**

#### **Motivacija**

Sportski događaji su bogati podacima i narativom. Milioni fanova širom sveta prate utakmice, ali kvalitetno praćenje je često ograničeno na najpopularnije lige i timove. Niži rangovi takmičenja, amaterski sportovi ili čak specijalizovane analize za profesionalne timove često ostaju bez detaljnog komentara zbog visokih troškova angažovanja profesionalnih komentatora i analitičara.

Naš cilj je da razvijemo inteligentni sistem, **LiveMatch Analyst**, koji može u realnom vremenu da prima tok podataka sa utakmice (mi ćemo implementirati za košarkašku utakmicu) i automatski generiše smislen, kontekstualno svestan i analitički bogat komentar. Ovakav sistem ne samo da može demokratizovati pristup sportskom komentarisanju, već može služiti i kao moćan alat za trenere, pružajući im instant, objektivnu analizu dešavanja na terenu.

#### **Pregled problema**

Postojeći sistemi se uglavnom svode na puke "stat-trackere" koji prikazuju sirove podatke ili generišu vrlo jednostavne, šablonske rečenice poput _"Igrač X je postigao 2 poena"_. Ono što ovim rešenjima fundamentalno nedostaje je **kontekst i narativ**. Ona ne znaju razliku između koša postignutog u nebitnom delu prve četvrtine i "clutch" pogotka u poslednjim sekundama koji odlučuje pobednika. Ne prepoznaju "momentum", "vruću ruku" igrača (hot streak), taktičke promene ili ključne defanzivne sekvence.

Naše rešenje će se razlikovati upravo po sposobnosti da **razume kontekst utakmice**. Sistem neće samo prevoditi događaje u tekst, već će:

1.  **Identifikovati ključne trenutke:** Prepoznavati prekretnice u meču.
2.  **Pratiti narativne tokove:** Detektovati serije poena, padove u igri, individualne performanse koje odskaču od proseka.
3.  **Generisati analitičke uvide:** Umesto prostog opisa, nudiće zaključke poput _"Ovo je serija od 10-0 za domaći tim, izazvana sa tri uzastopne izgubljene lopte gostiju, što je nateralo njihovog trenera da zatraži tajm-aut."_

Prednost našeg rešenja biće u dubini analize i kvalitetu generisanog komentara, koji će biti dinamičan i prilagođen dešavanjima na terenu, stvarajući iluziju da utakmicu komentariše stvarna osoba.

---

### **Metodologija rada**

#### **Očekivani ulazi u sistem (Input)**

Sistem će obrađivati tok (stream) događaja u realnom vremenu. Svaki događaj će biti predstavljen kao strukturirani podatak (npr. JSON objekat) koji opisuje jednu akciju u igri. Za košarkašku utakmicu, primeri događaja su:

- **GameEvent:** `SHOT_MADE`, `SHOT_MISSED`, `REBOUND`, `ASSIST`, `STEAL`, `BLOCK`, `TURNOVER`, `FOUL`.
- **ControlEvent:** `GAME_START`, `QUARTER_END`, `TIMEOUT`, `SUBSTITUTION`.

Svaki događaj će sadržati detaljne atribute:

- `timestamp`: Vreme dešavanja.
- `playerId`: ID igrača koji je izvršio akciju.
- `teamId`: Tim igrača.
- `eventType`: Tip događaja.
- `details`: Dodatni podaci (npr. za šut: `points: 3`, `shotType: "JUMP_SHOT"`; za faul: `foulType: "PERSONAL"`).

#### **Očekivani izlazi iz sistema (Output)**

Primarni izlaz sistema biće niz generisanih **komentara**, koji mogu biti različitog tipa i važnosti:

- **CommentaryLine:** Objekat koji sadrži:
  - `text`: Generisani tekst komentara.
  - `importance`: Nivo važnosti (npr. `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`) kako bi se ključni momenti mogli istaći.
  - `type`: Vrsta komentara (`PLAY_BY_PLAY`, `ANALYSIS`, `STATISTIC`, `HIGHLIGHT`).

Pored komentara, sistem će u svojoj radnoj memoriji konstantno održavati i ažurirati **agregirane statistike i prepoznate obrasce**:

- `PlayerStats`, `TeamStats`.
- `TeamMomentum`: Činjenica koja opisuje koji tim trenutno ima psihološku prednost.
- `PlayerHotStreak`: Činjenica koja označava da je igrač u seriji dobrih poteza.

#### **Baza znanja projekta**

Baza znanja će se sastojati od činjenica koje opisuju trenutno stanje utakmice i pravila koja na osnovu tih činjenica i novih događaja donose zaključke.

**Činjenice u radnoj memoriji:**

- `GameClock`: Trenutno vreme i preostalo vreme u četvrtini.
- `Score`: Trenutni rezultat.
- `Player`, `Team`: Osnovni podaci o učesnicima.
- `PlayerStats`: Ažurirana statistika za svakog igrača.
- Svi dolazni `GameEvent` i `ControlEvent` objekti.
- Izvedene činjenice kao što su `TeamMomentum`, `PlayerHotStreak`, `CloseGameSituation`.

**Primeri pravila (od jednostavnih ka složenim):**

- **Osnovno pravilo:** `WHEN ShotMade(points=3) THEN generate("Trojka!")`
- **Kontekstualno pravilo:** `WHEN ShotMade(points=3, player=X) AND PlayerStats(player=X, threePointersMade > 5) THEN generate("Neverovatni X nastavlja svoju seriju sa distance, ovo mu je već šesta trojka!")`
- **Analitičko pravilo:** `WHEN Turnover(team=A) THEN insert(new FastbreakOpportunity(team=B))`

---

### **Primeri primene naprednih koncepata**

#### **1. Primer Forward-Chaininga (ulančavanje na 3+ nivoa)**

Cilj je prepoznati ključnu sekvencu koja menja tok utakmice.

- **Pravilo 1 (Nivo 1):** Kada igrač postigne treći koš zaredom bez promašaja, sistem kreira novu činjenicu.
  ```drl
  when
      $p: Player()
      $s1: ShotMade(playerId == $p.id)
      $s2: ShotMade(playerId == $p.id, this after $s1, this != $s1)
      $s3: ShotMade(playerId == $p.id, this after $s2, this != $s2)
      not (ShotMissed(playerId == $p.id) over window:time(1m)) // Nije promašio u poslednjem minutu
  then
      insert(new PlayerOnHotStreak($p.id));
      // Komentar: "Igrač X je u seriji! To mu je treći vezani pogodak!"
  ```
- **Pravilo 2 (Nivo 2):** Ako igrač u "vrućoj seriji" postigne još poena i tim povede, to stvara momentum za ceo tim.
  ```drl
  when
      PlayerOnHotStreak(playerId == $p_id)
      ShotMade(playerId == $p_id, $teamId: teamId)
      Score(leadingTeam != $teamId) // Tim je gubio pre ovog koša
  then
      insert(new MomentumShift($teamId, "Player-driven comeback"));
      // Komentar: "Potpuni preokret u režiji igrača X! Njegov tim sada vodi!"
  ```
- **Pravilo 3 (Nivo 3):** Ako protivnički tim odmah nakon promene momentuma zatraži tajm-aut, sistem generiše dublji analitički komentar.
  ```drl
  when
      MomentumShift($teamId: teamId)
      Timeout(teamId != $teamId) over window:time(10s) // Tajm-aut u roku od 10s
  then
      // Generiši analizu
      insert(new CommentaryLine("Trener gostiju je primoran da reaguje. Serija tima " + $teamId + " je potpuno poremetila ritam utakmice i ovaj tajm-aut je bio neophodan da se zaustavi nalet protivnika.", Importance.HIGH, Type.ANALYSIS));
  ```

#### **2. Primer CEP-a (Complex Event Processing)**

CEP je ključan za prepoznavanje obrazaca u toku događaja.

- **Detekcija serije poena (Scoring Run):** Sistem treba da detektuje kada jedan tim postigne npr. 8 ili više poena zaredom, bez poena protivnika.

  ```drl
  when
      accumulate (
          GameEvent(
              type == EventType.SHOT_MADE,
              $team: teamId,
              $points: details['points']
          ) over window:time(2m),
          $run: sum($points)
      )
      // I u istom prozoru nema poena drugog tima
      not (GameEvent(type == EventType.SHOT_MADE, teamId != $team) over window:time(2m))
      ($run >= 8)
  then
      insert(new CommentaryLine("Kakva serija tima " + $team + "! Rezultat je " + $run + "-0 u poslednja dva minuta!", Importance.HIGH));
  ```

- **Detekcija defanzivne dominacije (Defensive Stop Streak):** Sistem treba da detektuje situaciju kada jedan tim u kratkom vremenskom periodu (npr. 2 minuta) natera protivnika na minimum 6 uzastopnih neuspešnih napada (promašaj ili izgubljena lopta). Ovo je indikator jake defanzivne serije.

  ```drl
  when
      // Akumuliramo neuspešne napade protivnika u okviru prozora od 1 minuta
      accumulate (
          GameEvent(
              (type == EventType.SHOT_MISSED || type == EventType.TURNOVER),
              $team: teamId
          ) over window:time(2m),
          $stops: count(1)
      )
      // Proveravamo da u istom prozoru nema pogodaka tog tima
      not (GameEvent(type == EventType.SHOT_MADE, teamId == $team) over window:time(1m))
      ($stops >= 6)
  then
      insert(new CommentaryLine(
          "Odlična defanziva! Tim " + $team + " je zaustavljen u šest uzastopnih napada u poslednja 2 minuta.",
          Importance.HIGH,
          Type.ANALYSIS
      ));
  end
  ```

#### **3. Primer Backward-Chaininga (Queries)**

Na kraju utakmice, ili na zahtev korisnika, sistem može da pruži analizu ishoda. Backward-chaining je idealan za odgovaranje na pitanje "Zašto je tim A pobedio?".

```drl
query "findKeyWinningFactors"(String winningTeam, List factors)
    ?hasReboundDominance(winningTeam, factors) or
    ?hasStarPerformance(winningTeam, factors) or
    ?hasClutchExecution(winningTeam, factors)
end

// Pod-query za dominaciju u skoku
query "hasReboundDominance"(String team, List factors)
    ?hasOffensiveReboundEdge(team) and
    ?hasDefensiveReboundControl(team) and
    eval(factors.add("Dominacija u skoku - kombinacija ofanzivne i defanzivne kontrole."))
end

// Pod-query za igru zvezdu tima
query "hasStarPerformance"(String team, List factors)
    ?hasHighScoringPlayer(team, factors) and
    ?hasEfficientShooting(team)
end

// Pod-query za "clutch" završnicu
query "hasClutchExecution"(String team, List factors)
    ?hasScoringRunInFourth(team, factors) and
    ?hasDefensiveStopStreak(team)
end

// Konkretne provere za skok
query "hasOffensiveReboundEdge"(String team)
    TeamStats(teamId == team, offensiveRebounds > 15)
end

query "hasDefensiveReboundControl"(String team)
    TeamStats(teamId == team, defensiveRebounds > 25)
end

// Konkretne provere za igru zvezde tima
query "hasHighScoringPlayer"(String team, List factors)
    $pStats: PlayerStats(teamId == team, points > 35)
    eval(factors.add($pStats.getPlayerName() + " je imao fenomenalno poentersko veče (" + $pStats.getPoints() + " poena)."))
end

query "hasEfficientShooting"(String team)
    TeamStats(teamId == team, fieldGoalPercentage > 0.50)
end

// Konkretne provere za "clutch" završnicu
query "hasScoringRunInFourth"(String team, List factors)
    $run: ScoringRun(teamId == team, quarter == 4, runSize > 10)
    eval(factors.add("Ključna je bila serija od " + $run.getRunSize() + "-0 u poslednjoj četvrtini."))
end

query "hasDefensiveStopStreak"(String team)
    DefensiveSequence(teamId == team, consecutiveStops > 3, quarter == 4)
end
```

Pozivanjem ovog upita, sistem bi sakupio sve zadovoljene uslove i formulisao odgovor, npr. _"Tim A je pobedio zahvaljujući sledećim faktorima: Dominacija u ofanzivnom skoku (16), Ključna je bila serija od 12-0 u poslednjoj četvrtini."_

#### **4. Primer korišćenja Templejta i DSL-a**

Da bi sistem bio proširiv, omogućićemo korisnicima (npr. sportskim analitičarima) da definišu sopstvene obrasce za praćenje putem jednostavnog interfejsa, bez potrebe za programiranjem.

**DSL (Domain Specific Language) primer:**
`Kada igrač [Ime Igrača] napravi [Broj] asistencija u [Vreme] minuta, generiši komentar [Tekst Komentara] sa važnošću [Važnost]`

**Templejt (DRL Template) koji stoji iza toga:**

```drl
template "player_assist_streak_rule"

rule "Assist_Streak_@{row.key}"
when
    accumulate (
        GameEvent(type == EventType.ASSIST, playerName == "@{Ime Igrača}") over window:time(@{Vreme}m),
        $count: count(1)
    )
    ($count >= @{Broj})
then
    insert(new CommentaryLine("@{Tekst Komentara}", Importance.valueOf("@{Važnost}")));
end
```

Korisnik bi kroz UI popunio formu, a sistem bi dinamički generisao i ubacio novo pravilo u Drools engine bez restartovanja aplikacije, čineći sistem izuzetno fleksibilnim.
