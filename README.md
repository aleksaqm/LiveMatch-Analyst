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

Sistem će obrađivati tok (stream) događaja u realnom vremenu. Svaki događaj će biti predstavljen kao strukturirani podatak (npr. JSON objekat) koji opisuje jednu akciju u igri. Za košarkašku utakmicu, primer događaja je:

- **GameEvent:** `SHOT_MADE`, `SHOT_MISSED`, `REBOUND`, `ASSIST`, `STEAL`, `BLOCK`, `TURNOVER`, `FOUL`.

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

- `Score`: Trenutni rezultat.
- `Player`, `Team`: Osnovni podaci o učesnicima.
- `PlayerStats`: Ažurirana statistika za svakog igrača.
- Svi dolazni `GameEvent` objekti.
- Izvedene činjenice kao što su `TeamMomentum`, `PlayerHotStreak`.

**Primeri pravila :**

- **Osnovno pravilo:** `WHEN ShotMade(points=3) THEN generate("Trojka!")`
- **Kontekstualno pravilo (primer):** `WHEN ShotMade(points=3, player=X) AND PlayerStats(player=X, threePointersMade > 5) THEN generate("Neverovatni X nastavlja svoju seriju sa distance, ovo mu je već šesta trojka!")`
- **Analitičko pravilo:** `WHEN Turnover(team=A) THEN insert(new FastBreakAfterDefense(team=B))`

---

### **Primeri primene naprednih koncepata**

### **1. Primer Forward-Chaininga (ulančavanje na 3+ nivoa)**  
1.1 Defanzivni Momentum
**Cilj:** Detektovanje defensivne dominacije kroz seriju povezanih akcija i reakcija timova.

#### Level 1 - Defanzivna Serija
Detektuje 2 uzastopne defanzivne akcije (steal/block) istog tima u roku od 1 minuta. Kreira `DefensiveStreak` fact i generiše komentar o odbrambenom pressingu.

#### Level 2 - Brza Tranzicija  
Proverava da li tim konvertuje odbranu u brze poene (shot_made unutar 10s). Kreira `FastBreakAfterDefense` fact i hvali efikasnu tranziciju.

#### Level 3 - Haos Protivnika
Prati da li protivnik pravi turnover unutar 30s nakon fast breaka. Kreira `DefensiveDominance` fact i naglašava dezorijentaciju protivnika.

#### Level 4 - Faul iz Nemoći  
Detektuje faul protivnika unutar 45s od uspostavljene dominacije. Generiše kritičan komentar o potpunoj kontroli i nemoći protivnika.  

---

1.2 Timeout Reakcija
#### Level 1 - Preuzimanje Vođstva
Detektuje kada tim preuzima vođstvo nakon koša (razlika 1-3 poena). Kreira `LeadTaken` fact sa podacima o vodećem i gubitničkom timu i generiše komentar o promeni vođstva.

#### Level 2 - Timeout Reakcija
Prati da li gubinički tim zove timeout nakon što je izgubio vođstvo. Meri vreme reakcije trenera, retraktuje `LeadTaken` fact i hvali brzu trenersku reakciju.

#### Level 3 - Odgovor Posle Timeout-a
Proverava da li tim koji je zvao timeout postiže koš ili preuzima vođstvo u naredne 2 minute. Kreira `TimeoutProcessed` fact da spreči duplo okidanje i generiše komentar o efikasnosti timeout-a.

---

### **2. Primer CEP-a (Complex Event Processing)**

CEP je ključan za prepoznavanje obrazaca u toku događaja.

#### 1. Defanzivna Serija Zaustavljanja

**Cilj:** Detektovanje dominantne defanzive kroz kontinuirane zaustavljene napade protivnika u vremenskom prozoru.

**Pravilo:** Prati promaše i izgubljene lopte protivničkog tima u poslednja 2 minuta. Kada protivnik napravi 6+ neuspešnih napada bez postignutog koša u poslednji minut, generiše se komentar o odličnoj defanzivi.

---

#### 2. Scoring Run (Serija Poena)

**Cilj:** Identifikovanje ofanzivne dominacije kada tim postiže seriju poena bez odgovora protivnika.

**Pravilo:** Akumulira poene iz postignutih koševa u poslednja 2 minuta. Kada tim postigne 8+ poena bez ijednog koša protivnika u istom periodu, detektuje se scoring run.

---

### **3. Primer Backward-Chaininga**

**Cilj:** Rekonstrukcija kompletnog lanca dodavanja unazad od postignutog koša do igrača koji je inicirao napad (steal ili rebound).

#### Rekurzivni Query: getBasketInitiator
Rekurzivno prati lanac PASS evenata unazad od poslednjeg dodavača ka inicijalnom igraču. Osnovni slučaj: pronađen je igrač koji je inicirao napad i nema dalje dodavanje ka njemu. Rekurzivni slučaj: postoji dodavanje ka trenutnom igraču, nastavlja se lanac unazad sa novim dodavačem.

#### Rule 1: Steal kao Inicijator
Kada se dogodi SHOT_MADE, traži se finalno dodavanje ka strelcu, zatim se identifikuju kandidati koji su ukrali loptu u prethodnih 24 sekunde. Rekurzivni query povezuje lanac od strelca do igrača sa steal eventom i generiše komentar o sjajnoj tranziciji i obrani.

#### Rule 2: Rebound kao Inicijator  
Identično prvom pravilu, ali traži igrača koji je uzeo skok umesto ukradene lopte. Rekurzivni query proverava da li postoji kontinuiran lanac dodavanja od skoka do koša i hvali timski napad i kvalitet skoka.

---

### **4. Primer korišćenja Templejta i DSL-a**

Da bi sistem bio proširiv, omogućićemo korisnicima (npr. sportskim analitičarima) da definišu sopstvene obrasce za praćenje putem jednostavnog interfejsa, bez potrebe za programiranjem.

4.1. ***Scoring Streak Template (Serija Pogodaka)***
**Cilj:** Omogućiti dinamičko kreiranje pravila za praćenje serija **uzastopnih pogodaka** pojedinih igrača. Sistem može da reaguje na različite pragove i generiše prilagođene komentare za specifične igrače bez izmene koda.
**Parametri:**
- `playerId`: ID igrača koji se prati.
- `shotCount`: Minimalan broj uzastopnih pogodaka koji aktivira pravilo.
- `timeWindowMinutes`: Vremenski prozor (u minutama) unutar kojeg se prati serija.
- `commentText`: Proizvoljan dodatak komentaru koji se generiše.
- `importance`: Nivo važnosti komentara (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
    
**Upotreba:** Idealno za praćenje poena konkretnog igrača.

 
4.2. ***Assist Streak Template (Serija Asistencija)***
**Cilj:** Kreiranje dinamičkih pravila za praćenje konstantnog razigravanja ekipe od strane nekog igrača, mereno brojem asistencija u kratkom vremenskom roku.
**Parametri:**
- `playerId`: ID igrača (plejmejkera) koji se prati.
- `assistCount`: Minimalan broj asistencija koji aktivira pravilo.
- `timeWindowMinutes`: Vremenski prozor (u minutama) za praćenje.
- `commentText`: Osnovni, prilagođeni tekst komentara.
- `importance`: Nivo važnosti komentara.

**Upotreba:** Idealno za praćenje broja asistencija konkretnog igrača, odnosno razigravanje tima.
