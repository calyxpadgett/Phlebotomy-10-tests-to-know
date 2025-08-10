// --- data (no Royal Blue) ---
const tubes = [
    { id:'light-blue', color:'Light Blue', inversions:'3-4' },
    { id:'sst',        color:'Gold/Red Tiger', inversions:'5-7' },
    { id:'plain-red',  color:'Plain Red', inversions:'0' },
    { id:'lavender',   color:'Lavender', inversions:'8-10' }
  ];
  
  const tests = [
    { name:'Reticulocyte Count (Retic)', tubeId:'lavender' },
    { name:'D-Dimer',                    tubeId:'light-blue' },
    { name:'JAK-2',                      tubeId:'lavender' },
    { name:'Lipid Panel',                tubeId:'sst' },
    { name:'PT-INR',                     tubeId:'light-blue' },
    { name:'FSH',                        tubeId:'sst' },
    { name:'Thyroid Panel',              tubeId:'sst' },
    { name:'Homocysteine',               tubeId:'lavender' },
    { name:'CMP',                        tubeId:'sst' },
    { name:'Iron / TIBC',                tubeId:'sst' }
  ];
  
  // --- elements ---
  const landing   = document.getElementById('landing');
  const quiz      = document.getElementById('quiz');
  const startBtn  = document.getElementById('start');
  const restart   = document.getElementById('restart');
  
  const questionEl = document.getElementById('question');
  const tubeSelect = document.getElementById('tube');
  const invSelect  = document.getElementById('inversions');
  const feedbackEl = document.getElementById('feedback');
  const checkBtn   = document.getElementById('check');
  const nextBtn    = document.getElementById('next');
  
  let currentTest;
  
  // --- helpers ---
  const rand = arr => arr[Math.floor(Math.random() * arr.length)];
  
  function show(el){ el.classList.remove('hidden'); }
  function hide(el){ el.classList.add('hidden'); }
  
  // --- session controls ---
  startBtn.addEventListener('click', () => {
    hide(landing);
    show(quiz);
    populateOptions();
    loadQuestion();
    tubeSelect.focus();
  });
  
  restart.addEventListener('click', () => {
    hide(quiz);
    show(landing);
    feedbackEl.textContent = '';
  });
  
  // --- quiz logic ---
  function loadQuestion(){
    currentTest = rand(tests);
    questionEl.textContent = currentTest.name;
    tubeSelect.value = '';
    invSelect.value  = '';
    feedbackEl.textContent = '';
  }
  
  function populateOptions(){
    // tubes
    tubeSelect.innerHTML = '<option value="">-- Select Tube --</option>';
    tubes.forEach(t => {
      tubeSelect.innerHTML += `<option value="${t.id}">${t.color}</option>`;
    });
  
    // inversion choices: keep exact strings as provided
    const opts = [...new Set(tubes.map(t => t.inversions))];
    invSelect.innerHTML = '<option value="">-- Select Inversions --</option>';
    opts.forEach(n => invSelect.innerHTML += `<option value="${n}">${n}</option>`);
  }
  
  checkBtn.addEventListener('click', () => {
    const chosenTube = tubes.find(t => t.id === tubeSelect.value);
    const chosenInv  = invSelect.value;
    const correctTube = tubes.find(t => t.id === currentTest.tubeId);
  
    if (!chosenTube || !chosenInv){
      feedbackEl.textContent = 'Pick both a tube and inversion.';
      return;
    }
    if (chosenTube.id === correctTube.id && chosenInv === correctTube.inversions){
      feedbackEl.textContent = '✅ Correct!';
    } else {
      feedbackEl.textContent = `❌ Correct: ${correctTube.color}, ${correctTube.inversions} inversions.`;
    }
  });
  
  nextBtn.addEventListener('click', loadQuestion);