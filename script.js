// --- data (exact inversion strings kept) ---
const tubes = [
    { id:'light-blue', color:'Light Blue', inversions:'3-4' },
    // If your class uses 0 for Plain Red, change '5-7' to '0'
    { id:'plain-red',  color:'Plain Red',  inversions:'5-7' },
    { id:'lavender',   color:'Lavender',   inversions:'8-10' }
  ];
  
  const tests = [
    { id:'retic',   name:'Reticulocyte Count (Retic)', tubeId:'lavender' },
    { id:'ddimer',  name:'D-Dimer',                    tubeId:'light-blue' },
    { id:'jak2',    name:'JAK-2',                      tubeId:'lavender' },
    { id:'lipid',   name:'Lipid Panel',                tubeId:'plain-red' },
    { id:'ptinr',   name:'PT-INR',                     tubeId:'light-blue' },
    { id:'fsh',     name:'FSH',                        tubeId:'plain-red' },
    { id:'thyroid', name:'Thyroid Panel',              tubeId:'plain-red' },
    { id:'homocys', name:'Homocysteine',               tubeId:'lavender' },
    { id:'cmp',     name:'CMP',                        tubeId:'plain-red' },
    { id:'iron',    name:'Iron / TIBC',                tubeId:'plain-red' }
  ];
  
  // --- elements ---
  const landing = document.getElementById('landing');
  const practice = document.getElementById('practice');
  const studyPage = document.getElementById('studyPage');
  const gradePage = document.getElementById('gradePage');
  
  const startPractice = document.getElementById('startPractice');
  const openRef = document.getElementById('openRef');
  const backToLandingStudy = document.getElementById('backToLandingStudy');
  const newSessionBtn = document.getElementById('newSession');
  const backToLandingBtn = document.getElementById('backToLanding');
  
  const pairCard = document.getElementById('pairCard');
  const swapBtn = document.getElementById('swapBtn');
  const qCounter = document.getElementById('qCounter');
  const feedback = document.getElementById('feedback');
  const checkRound = document.getElementById('checkRound');
  const nextRound = document.getElementById('nextRound');
  const endSession = document.getElementById('endSession');
  
  // results
  const gradePercentEl = document.getElementById('gradePercent');
  const gradeLetterEl  = document.getElementById('gradeLetter');
  const correctCountEl = document.getElementById('correctCount');
  const totalCountEl   = document.getElementById('totalCount');
  const missedListEl   = document.getElementById('missedList');
  
  // state
  let roundIndex = 0;
  let sessionAnswers = [];
  let pair = []; // two tests
  // selections per testId: { tubeId?: string, inversions?: string }
  let selections = {};
  
  const rand = arr => arr[Math.floor(Math.random() * arr.length)];
  const tubeById = id => tubes.find(t => t.id === id);
  
  function show(el){ el.classList.remove('hidden'); }
  function hide(el){ el.classList.add('hidden'); }
  function showPage(p){ [landing, practice, studyPage, gradePage].forEach(hide); show(p); }
  
  // nav
  startPractice.addEventListener('click', () => { startSession(); showPage(practice); });
  openRef.addEventListener('click', () => showPage(studyPage));
  backToLandingStudy.addEventListener('click', () => showPage(landing));
  newSessionBtn.addEventListener('click', () => { startSession(); showPage(practice); });
  backToLandingBtn.addEventListener('click', () => showPage(landing));
  endSession.addEventListener('click', () => { renderResults(); showPage(gradePage); });
  
  // session
  function startSession(){
    sessionAnswers = [];
    roundIndex = 0;
    loadRound();
  }
  
  function loadRound(){
    // pick two distinct tests
    const shuffled = [...tests].sort(() => Math.random()-0.5);
    pair = shuffled.slice(0,2);
    selections = {}; // reset
    renderPairCards();
  
    qCounter.textContent = String(roundIndex + 1);
    feedback.textContent = '';
    checkRound.disabled = false;
    nextRound.classList.add('hidden');
    swapBtn.disabled = false;
  }
  
  function renderPairCards(){
    pairCard.innerHTML = '';
    pair.forEach((t, idx) => {
      const card = document.createElement('div');
      card.className = 'test-card';
      card.dataset.testId = t.id;
  
      // NOTE: No tube color/inversion answers shown here anymore (neutral bar only).
      card.innerHTML = `
        <div class="test-head">
          <div class="order-num">${idx+1}</div>
          <div class="test-name">${t.name}</div>
        </div>
        <div class="neutral-bar" aria-hidden="true"></div>
  
        <div class="quiz-grid">
          <!-- tube buttons -->
          <button class="btn btn-option" data-kind="tube" data-value="light-blue">Light Blue</button>
          <button class="btn btn-option" data-kind="tube" data-value="plain-red">Plain Red</button>
          <button class="btn btn-option" data-kind="tube" data-value="lavender">Lavender</button>
  
          <!-- inversion buttons -->
          <button class="btn btn-option" data-kind="inv" data-value="3-4">3-4</button>
          <button class="btn btn-option" data-kind="inv" data-value="5-7">5-7</button>
          <button class="btn btn-option" data-kind="inv" data-value="8-10">8-10</button>
        </div>
      `;
  
      // handlers for this card's buttons
      card.querySelectorAll('.btn-option').forEach(btn => {
        btn.addEventListener('click', () => {
          const kind = btn.dataset.kind; // 'tube' or 'inv'
          const val  = btn.dataset.value;
          // deselect within this card + kind
          card.querySelectorAll(`.btn-option[data-kind="${kind}"]`).forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          // record selection
          const tid = card.dataset.testId;
          selections[tid] = selections[tid] || {};
          if (kind === 'tube') selections[tid].tubeId = val;
          else selections[tid].inversions = val;
        });
      });
  
      pairCard.appendChild(card);
    });
  }
  
  swapBtn.addEventListener('click', () => {
    if (pair.length !== 2) return;
    // swap array order and re-render
    [pair[0], pair[1]] = [pair[1], pair[0]];
    renderPairCards();
  });
  
  // grading
  checkRound.addEventListener('click', () => {
    // ensure both test selections are made (tube + inversions)
    for (const t of pair){
      const sel = selections[t.id];
      if (!sel || !sel.tubeId || !sel.inversions){
        feedback.textContent = 'Choose a tube and inversions for each test.';
        return;
      }
    }
  
    // 1) grade quick checks (two tests)
    const resultsQuick = pair.map(t => {
      const correctTube = tubeById(t.tubeId);
      const sel = selections[t.id];
      const ok = (sel.tubeId === correctTube.id) && (sel.inversions === correctTube.inversions);
      return {
        kind: 'quick',
        testName: t.name,
        yourTube: tubeById(sel.tubeId).color,
        yourInv: sel.inversions,
        correctTube: correctTube.color,
        correctInv: correctTube.inversions,
        correct: ok
      };
    });
  
    // 2) grade order-of-draw between them
    const correctOrderIds = getCorrectOrderIds(pair);
    const currentOrderIds = pair.map(t => t.id); // pair order reflects UI
    const orderOK = JSON.stringify(currentOrderIds) === JSON.stringify(correctOrderIds);
    const resultOrder = {
      kind: 'order',
      testNames: pair.map(t => t.name),
      yourOrder: currentOrderIds.map(id => tests.find(tt => tt.id === id).name),
      correctOrder: correctOrderIds.map(id => tests.find(tt => tt.id === id).name),
      correct: orderOK
    };
  
    // record
    sessionAnswers.push(...resultsQuick, resultOrder);
  
    // feedback message
    const msgQuick = resultsQuick.map(r => `${shortName(r.testName)}: ${r.correct ? '✅' : '❌'}`).join('   •   ');
    const rightOrder = resultOrder.correct ? '✅' : `❌ (Correct: ${resultOrder.correctOrder.join(' → ')})`;
    feedback.textContent = `${msgQuick}   •   Order: ${rightOrder}`;
  
    // lock round
    checkRound.disabled = true;
    nextRound.classList.remove('hidden');
    swapBtn.disabled = true;
    pairCard.querySelectorAll('.btn-option').forEach(b => b.disabled = true);
  
    roundIndex++;
  });
  
  nextRound.addEventListener('click', loadRound);
  
  function shortName(name){
    if (name.startsWith('Reticulocyte')) return 'Retic';
    if (name === 'Iron / TIBC') return 'Iron/TIBC';
    return name.split(' ')[0];
  }
  
  function getCorrectOrderIds(twoTests){
    // Light Blue (1) → Plain Red (2) → Lavender (3)
    const prio = { 'light-blue':1, 'plain-red':2, 'lavender':3 };
    return [...twoTests].sort((a,b)=> prio[a.tubeId]-prio[b.tubeId]).map(t=>t.id);
  }
  
  // results
  endSession.addEventListener('click', () => { renderResults(); showPage(gradePage); });
  
  function renderResults(){
    const total = sessionAnswers.length; // 3 entries per round
    const correct = sessionAnswers.filter(a=>a.correct).length;
    const pct = total ? Math.round((correct/total)*100) : 0;
  
    gradePercentEl.textContent = `${pct}%`;
    gradeLetterEl.textContent  = pct>=90?'A':pct>=80?'B':pct>=70?'C':pct>=60?'D':'F';
    correctCountEl.textContent = correct;
    totalCountEl.textContent   = total;
  
    const misses = sessionAnswers.filter(a=>!a.correct);
    if (!misses.length){
      missedListEl.innerHTML = '<p style="color: var(--accent); font-weight: 600;">Perfect! No questions missed.</p>';
      return;
    }
    missedListEl.innerHTML = misses.map(m => (
      m.kind === 'quick'
        ? `<div class="missed-item">
             <div class="missed-question">${m.testName}</div>
             <div class="missed-answer">Your answer: ${m.yourTube}, ${m.yourInv}</div>
             <div class="missed-correct">Correct: ${m.correctTube}, ${m.correctInv}</div>
           </div>`
        : `<div class="missed-item">
             <div class="missed-question">${m.testNames.join(' & ')}</div>
             <div class="missed-answer">Your order: ${m.yourOrder.join(' → ')}</div>
             <div class="missed-correct">Correct: ${m.correctOrder.join(' → ')}</div>
           </div>`
    )).join('');
  }