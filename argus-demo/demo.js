/* SUPER A.R.G.U.S. — MODALITÀ DEMO (per cybernetlab.it/argus-demo/)
 * Nessun collegamento a dati veri: un'azienda di esempio inventata («Officina Digitale Verdi»)
 * e risposte simulate. Intercetta le chiamate al server e risponde da qui. */
(function () {
  var URL_DEMO = 'https://demo.argus.invalid/api';
  try { localStorage.setItem('jarvis_cfg', JSON.stringify({ url: URL_DEMO, codice: 'demo' })); localStorage.setItem('argus_volto', localStorage.getItem('argus_volto') || 'robot');
    if (!localStorage.getItem('argus_widget')) localStorage.setItem('argus_widget', JSON.stringify({ visibili: true, pos: {}, compatti: {}, nascosti: { sistemi: true, registro: true } })); } catch (e) { }

  var oggi = new Date(), gg = function (n) { var d = new Date(oggi.getTime() + n * 864e5); return d.getDate() + '/' + (d.getMonth() + 1); };
  var mesi = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
  var mese = function (i) { var d = new Date(oggi.getFullYear(), oggi.getMonth() + i, 1); return mesi[d.getMonth()] + ' ' + d.getFullYear(); };

  var CRUSCOTTO = {
    cruscotto: {
      interventi: { oggi: 1, prossimo: { quando: 'oggi 14:30', comune: 'Savona', cliente: 'Bar Aurora', tipo: 'manutenzione', maps: '#', telefono: '' } },
      appuntamenti: [{ ora: '09:00', titolo: 'Call con il commercialista', passato: true }, { ora: '11:30', titolo: 'Demo gestionale – Ristorante Il Faro', passato: false }, { ora: '17:00', titolo: 'Revisione sito Hotel Miramare', passato: false }],
      soldi: { da_incassare: 4850, n_aperti: 5, n_scaduti: 1, scaduti: 620, scaduti_chi: ['Panificio Dolce Forno'], preventivi_attesa: 3, preventivi_valore: 7400 },
      sistemi: { siti: 12, siti_giu: [], n_scadenze: 2, scadenze: ['Dominio Hotel Miramare · ' + gg(18), 'Hosting Bar Aurora · ' + gg(26)], bozze: 2, lavori: 0 },
      servizi: {}, social: { bozze: 1, approvati: 4, giorno: 'giovedì', stile: 'wow', ultimo: { titolo: 'Il nuovo sito di Hotel Miramare', data: gg(-3), stato: 'pubblicato' } },
      settimana: [0, 1, 2, 3, 4, 5, 6].map(function (i) { var d = new Date(oggi.getTime() + i * 864e5); return { g: ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'][d.getDay()], d: d.getDate(), interventi: [1, 2, 0, 3, 1, 0, 0][i], appuntamenti: [3, 1, 2, 2, 4, 1, 0][i] }; }),
      incassi: [-5, -4, -3, -2, -1, 0].map(function (i) { var d = new Date(oggi.getFullYear(), oggi.getMonth() + i, 1); return { m: mesi[d.getMonth()].slice(0, 3), pagato: [3200, 4100, 2800, 5200, 4600, 2100][i + 5], aperto: [0, 0, 300, 0, 900, 4850][i + 5] }; }),
      domani: {}
    },
    squadra: null,
    clienti: { fasi: [{ nome: 'Trovati', icona: '🆕', n: 24 }, { nome: 'Contattati', icona: '📤', n: 15 }, { nome: 'Interessati', icona: '🔥', n: 4 }, { nome: 'Demo', icona: '📅', n: 2 }, { nome: 'Trattativa', icona: '🤝', n: 2 }, { nome: 'Clienti', icona: '✅', n: 9 }],
      demo_oggi: [{ ora: '11:30', attivita: 'Ristorante Il Faro', prodotto: 'Gestionale prenotazioni', meet: '#' }], prossime: [{ quando: 'domani alle 16:00', attivita: 'Palestra Energia' }],
      caldi: [{ id: 'P-012', nome: 'Palestra Energia', stato: 'ha risposto' }, { id: 'P-019', nome: 'Studio Dentistico Sorriso', stato: 'trattativa' }], preventivi: { quanti: 3, totale: '7.400,00 €' }, link: '#' },
    salute: { livello: 'verde', guasti: [], attenzione: [], ok: 9, ora: ('0' + oggi.getHours()).slice(-2) + ':' + ('0' + oggi.getMinutes()).slice(-2) },
    cassa: { mesi: [0, 1, 2].map(function (i) { return { mese: mese(i), certo: [4850, 2600, 1800][i], probabile: [900, 2100, 2400][i], uscite: [1450, 1300, 1350][i], possibile: [0, 7400, 0][i], saldo: [4300, 3400, 2850][i], voci: [] }; }),
      avvisi: ['Panificio Dolce Forno è in ritardo di 620 €: conviene sollecitarlo.'], scaduti: 620 }
  };

  var RISPOSTE = [
    [/chi sei|cosa sai fare|cosa fai|presentati|come funzioni/, 'Sono SUPER A.R.G.U.S., l\'assistente di Officina Digitale Verdi. Ricordo tutto, trovo nuovi clienti, preparo preventivi ed email, seguo pagamenti e scadenze, e ogni mattina le dico cosa conta. Nessun messaggio parte senza il suo ok.'],
    [/programma|oggi|agenda|appuntament/, 'Oggi ha tre impegni: alle 9 la call con il commercialista, già fatta; alle 11:30 la demo del gestionale con il Ristorante Il Faro; alle 17 la revisione del sito dell\'Hotel Miramare. Nel pomeriggio c\'è anche un intervento da Bar Aurora alle 14:30.'],
    [/pagar|incass|soldi|deve|credit/, 'Deve ancora incassare 4.850 euro da 5 pagamenti. Uno è scaduto: Panificio Dolce Forno, 620 euro, da 12 giorni. Vuole che le prepari un sollecito gentile?'],
    [/preventiv/, 'Ci sono 3 preventivi in attesa, per 7.400 euro in tutto. Il più caldo è quello dello Studio Dentistico Sorriso: ci hanno già chiesto due chiarimenti. Le preparo un messaggio per chiudere?'],
    [/client|pipeline|trattativ|caccia|nuovi/, 'Questa settimana ho trovato 24 attività in zona, ne abbiamo contattate 15 e 4 hanno risposto. Palestra Energia vuole una demo domani alle 16, e lo Studio Dentistico Sorriso è in trattativa.'],
    [/ricorda|annota|segna|memorizza/, 'Fatto, l\'ho salvato nel secondo cervello e l\'ho già collegato ai ricordi simili. Nella demo non salvo davvero nulla, ma nella versione vera lo ritroverebbe nella mappa neurale.'],
    [/sollecit/, 'Ecco la bozza: «Buongiorno, le scrivo per ricordarle la fattura di 620 euro scaduta il mese scorso. Se l\'ha già saldata, ignori pure questo messaggio. Grazie!». Nella versione vera partirebbe solo dopo il suo ok.'],
    [/scadenz|rinnov|dominio|hosting/, 'Nei prossimi 30 giorni scadono il dominio dell\'Hotel Miramare e l\'hosting del Bar Aurora. Ho già pronte le email di rinnovo: aspettano solo il suo ok.'],
    [/previsio|cassa|prossimi mesi/, 'Nei prossimi tre mesi prevedo circa 14.650 euro in entrata e 4.100 in uscita. Il mese più debole è il terzo: conviene spingere ora i 3 preventivi in attesa.'],
    [/sito|siti/, 'I 12 siti dei suoi clienti sono tutti online e con il certificato valido. Quello dell\'Hotel Miramare da telefono è un po\' lento: potrebbe essere l\'occasione per proporre un aggiornamento.'],
    [/grazie|perfetto|ottimo/, 'Sempre a disposizione, signore.'],
    [/prezz|cost|quanto/, 'Questa è una demo con dati di esempio. Per sapere quanto costa un ARGUS su misura per la sua azienda, prenoti una chiacchierata con CybernetLab: trova il pulsante in alto.']
  ];
  var RISPOSTA_BASE = 'In questa demo rispondo con i dati di un\'azienda di esempio. Provi a chiedermi il programma di oggi, chi deve ancora pagare, come vanno i nuovi clienti, o tenga premuto il nucleo per vedere il mio secondo cervello.';

  function rispostaChat(t) {
    t = String(t || '').toLowerCase();
    for (var i = 0; i < RISPOSTE.length; i++) if (RISPOSTE[i][0].test(t)) return RISPOSTE[i][1];
    return RISPOSTA_BASE;
  }

  /* --- cervello di esempio --- */
  var MAPPA = null;
  function mappa() {
    if (MAPPA) return MAPPA;
    var clienti = ['Hotel Miramare', 'Bar Aurora', 'Ristorante Il Faro', 'Palestra Energia', 'Studio Dentistico Sorriso', 'Panificio Dolce Forno', 'Agriturismo Le Vigne', 'Ferramenta Bruni'];
    var temi = [['nota', 'vuole le prenotazioni online dal telefono'], ['nota', 'chiede il menu digitale con QR code'], ['idea', 'app fedeltà con punti per i clienti abituali'], ['documento', 'preventivo sito e prenotazioni'],
      ['da fare', 'mandare la bozza della home'], ['lavoro', 'sito pubblicato e controllato'], ['nota', 'si lamenta dei clienti che non si presentano'], ['idea', 'promemoria automatici su WhatsApp'],
      ['documento', 'contratto di manutenzione annuale'], ['nota', 'vuole vedere i dati delle visite al sito'], ['da fare', 'richiamare per il rinnovo'], ['lavoro', 'foto e testi aggiornati']];
    var N = [], S = [], seme = 7, rnd = function () { seme = (seme * 9301 + 49297) % 233280; return seme / 233280; };
    clienti.forEach(function (c, i) { N.push({ id: 'c' + i, t: 'cliente', n: c, s: 'Savona', d: '', l: '', f: 0 }); });
    N.push({ id: 'p0', t: 'prodotto', n: 'Gestionale prenotazioni', s: 'ristoranti, bar, hotel', d: '', l: '', f: 0 });
    N.push({ id: 'p1', t: 'prodotto', n: 'App fedeltà', s: 'negozi e locali', d: '', l: '', f: 0 });
    N.push({ id: 'g0', t: 'garage', n: 'Assistente WhatsApp per prenotare', s: 'idea in valutazione', d: '', l: '', f: 0 });
    var k = 0;
    clienti.forEach(function (c, ci) {
      for (var j = 0; j < 5; j++) {
        var tm = temi[Math.floor(rnd() * temi.length)], id = 'n' + (k++);
        N.push({ id: id, t: tm[0], n: c.split(' ').slice(-1)[0] + ': ' + tm[1], s: c, d: gg(-Math.floor(rnd() * 60)), l: '', f: 0 });
        S.push([id, 'c' + ci, 1, 'cliente']);
        if (/prenotaz|menu|presentano/.test(tm[1])) S.push([id, 'p0', .8, 'simile']);
        if (/fedeltà|punti|whatsapp/i.test(tm[1])) S.push([id, 'p1', .78, 'simile'], [id, 'g0', .74, 'simile']);
      }
    });
    for (var i = 0; i < 70; i++) { var a = N[11 + Math.floor(rnd() * (N.length - 11))], b = N[11 + Math.floor(rnd() * (N.length - 11))]; if (a !== b && a.n.split(': ')[1] === b.n.split(': ')[1]) S.push([a.id, b.id, .85, 'simile']); }
    MAPPA = { creata: 'demo', neuroni: N, sinapsi: S, intuizioni: { creata: 'demo', intuizioni: [
      { tipo: 'ricorrente', titolo: 'Le prenotazioni online sono un prodotto', perche: 'Tre locali diversi hanno chiesto la stessa cosa nelle ultime settimane.', azione: 'Proponi il Gestionale prenotazioni a tutti e tre con una demo unica.', neuroni: N.filter(function (x) { return /prenotaz/.test(x.n); }).map(function (x) { return x.id; }).concat(['p0']) },
      { tipo: 'garage', titolo: 'L\'idea del Garage serve davvero', perche: 'L\'assistente WhatsApp risolve il problema dei clienti che non si presentano.', azione: 'Promuovi l\'idea dal Garage a progetto e fai un prototipo.', neuroni: ['g0'].concat(N.filter(function (x) { return /presentano|whatsapp/i.test(x.n); }).map(function (x) { return x.id; })) },
      { tipo: 'trascurato', titolo: 'Ferramenta Bruni è sparita', perche: 'Nessuna novità da 52 giorni.', azione: 'Chiamala questa settimana per sapere come va il sito.', neuroni: ['c7'] }] } };
    return MAPPA;
  }

  var BRIEFING = { saluto: 'Buongiorno, signore.', punti: [
    { widget: 'clienti', frase: 'Alle 11 e 30 ha la demo del gestionale con il Ristorante Il Faro: le ho già preparato il link della videochiamata.' },
    { widget: 'soldi', frase: 'Il Panificio Dolce Forno è in ritardo di 620 euro da 12 giorni.' },
    { widget: 'cassa', frase: 'Questo mese entrano circa 5.700 euro; il terzo mese è più leggero, conviene chiudere i preventivi in attesa.' },
    { widget: 'oggi', frase: 'Alle 17 c\'è la revisione del sito dell\'Hotel Miramare.' }],
    domanda: 'Vuole che prepari il sollecito per il Panificio?' };

  function rispondi(d) {
    switch (d.azione) {
      case 'info': case 'novita': return { ok: true, info: { oggi: 1, richieste: 7, prossimo: 'Demo Ristorante Il Faro 11:30', nome: 'signore' }, avvisi: [], adesso: Date.now() };
      case 'cruscotto': return Object.assign({ ok: true }, CRUSCOTTO);
      case 'chiedi': return { ok: true, risposta: rispostaChat(d.testo), tempi: { ai: 400 } };
      case 'briefing': return { ok: true, briefing: BRIEFING };
      case 'vedi': return { ok: true, risposta: 'Nella versione vera guardo la fotocamera o lo schermo e le dico cosa vedo. In questa demo la vista è spenta.' };
      case 'carica': return { ok: false, errore: 'Nella demo non si caricano file.' };
      case 'voce': return { ok: false, errore: 'demo' };
      case 'cervello': return { ok: true, mappa: mappa() };
      case 'cervello_voce': var n = mappa().neuroni.filter(function (x) { return x.id === d.id; })[0] || {}; return { ok: true, voce: { campi: [{ k: 'Ricordo', v: n.n || '' }, { k: 'Cliente', v: n.s || '' }, { k: 'Nota', v: 'Dato di esempio della demo: nella versione vera qui c\'è il testo completo salvato da ARGUS.' }] } };
      case 'cervello_cerca': var q = String(d.q || '').toLowerCase(); return { ok: true, trovati: mappa().neuroni.filter(function (x) { return (x.n + ' ' + x.s).toLowerCase().indexOf(q.split(' ')[0]) >= 0; }).map(function (x) { return x.id; }).slice(0, 14) };
      case 'cervello_pensa': return { ok: true, intuizioni: mappa().intuizioni };
      default: return { ok: false, errore: 'Non disponibile nella demo.' };
    }
  }

  var fetchVero = window.fetch.bind(window);
  window.fetch = function (url, opz) {
    if (String(url).indexOf(URL_DEMO) !== 0) return fetchVero(url, opz);
    var d = {}; try { d = JSON.parse((opz && opz.body) || '{}'); } catch (e) { }
    var ritardo = d.azione === 'chiedi' ? 700 : d.azione === 'cervello' ? 900 : 150;
    return new Promise(function (ok) { setTimeout(function () { var t = JSON.stringify(rispondi(d)); ok(new Response(t, { status: 200, headers: { 'Content-Type': 'application/json' } })); }, ritardo); });
  };

  /* fascia «DEMO» e invito */
  document.addEventListener('DOMContentLoaded', function () {
    if (window.parent !== window) return;                       // dentro il cervello (iframe): niente fascia
    var b = document.createElement('div');
    b.setAttribute('role', 'note');
    b.style.cssText = 'position:fixed;z-index:70;left:50%;bottom:max(10px,env(safe-area-inset-bottom));transform:translateX(-50%);display:flex;gap:10px;align-items:center;flex-wrap:wrap;justify-content:center;' +
      'padding:8px 10px 8px 14px;border-radius:999px;background:rgba(3,7,17,.88);border:1px solid rgba(255,201,77,.55);color:#ffe3a1;font:13px "Segoe UI",system-ui,sans-serif;box-shadow:0 8px 30px rgba(0,0,0,.5);max-width:calc(100vw - 20px)';
    var stretto = innerWidth < 620;
    if (stretto) { b.style.bottom = '84px'; b.style.padding = '4px 5px 4px 12px'; b.style.fontSize = '12px'; b.style.flexWrap = 'nowrap'; b.style.whiteSpace = 'nowrap'; }
    b.innerHTML = '<span><b>DEMO</b> · ' + (stretto ? 'dati di esempio' : 'azienda e dati di esempio, risposte simulate') + '</span><a href="../#argus" style="color:#03101a;background:linear-gradient(90deg,#20d9ff,#a16cff);padding:6px 12px;border-radius:999px;text-decoration:none;font-weight:600">' + (stretto ? 'Il tuo ARGUS →' : 'Vuoi il tuo ARGUS? →') + '</a>';
    document.body.appendChild(b);
    var cfg = document.getElementById('cfgBtn'); if (cfg) cfg.style.display = 'none';
  });
})();
