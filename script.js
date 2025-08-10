// --- data (no Royal Blue) ---
const tubes = [
    { id:'light-blue', color:'Light Blue', inversions:'3-4' },
    { id:'plain-red',  color:'Plain Red', inversions:'5-7' },
    { id:'lavender',   color:'Lavender', inversions:'8-10' }
  ];
  
  const tests = [
    { name:'Reticulocyte Count (Retic)', tubeId:'lavender' },
    { name:'D-Dimer',                    tubeId:'light-blue' },
    { name:'JAK-2',                      tubeId:'lavender' },
    { name:'Lipid Panel',                tubeId:'plain-red' },
    { name:'PT-INR',                     tubeId:'light-blue' },
    { name:'FSH',                        tubeId:'plain-red' },
    { name:'Thyroid Panel',              tubeId:'plain-red' },
    { name:'Homocysteine',               tubeId:'lavender' },
    { name:'CMP',                        tubeId:'plain-red' },
    { name:'Iron / TIBC',                tubeId:'plain-red' }
  ];
  
  // --- elements ---
  const landing   = document.getElementById('landing');
  const quiz      = document.getElementById('quiz');
  const gradePage = document.getElementById('gradePage');
  const studyPage = document.getElementById('studyPage');
  const startBtn  = document.getElementById('start');
  const studyBtn  = document.getElementById('study');
  const newSessionBtn = document.getElementById('newSession');
  const backToLandingBtn = document.getElementById('backToLanding');
  const backToLandingStudyBtn = document.getElementById('backToLandingStudy');
  
  const questionEl = document.getElementById('question');
  const tubeButtons = document.getElementById('tubeButtons');
  const inversionButtons = document.getElementById('inversionButtons');
  const feedbackEl = document.getElementById('feedback');
  const checkBtn   = document.getElementById('check');
  const nextBtn    = document.getElementById('next');
  const endSessionBtn = document.getElementById('endSession');
  
  let currentTest;
  let sessionAnswers = [];
  let currentQuestionIndex = 0;
  let selectedTube = null;
  let selectedInversion = null;
  
  // --- helpers ---
  const rand = arr => arr[Math.floor(Math.random() * arr.length)];
  
  function show(el){ el.classList.remove('hidden'); }
  function hide(el){ el.classList.add('hidden'); }
  
  // --- session controls ---
  startBtn.addEventListener('click', () => {
    hide(landing);
    show(quiz);
    startNewSession();
  });
  
  studyBtn.addEventListener('click', () => {
    hide(landing);
    show(studyPage);
  });
  
  endSessionBtn.addEventListener('click', () => {
    showGradePage();
  });
  
  newSessionBtn.addEventListener('click', () => {
    hide(gradePage);
    show(quiz);
    startNewSession();
  });
  
  backToLandingBtn.addEventListener('click', () => {
    hide(gradePage);
    hide(studyPage);
    show(landing);
  });
  
  backToLandingStudyBtn.addEventListener('click', () => {
    hide(studyPage);
    show(landing);
  });
  
  function startNewSession() {
    sessionAnswers = [];
    currentQuestionIndex = 0;
    populateOptions();
    loadQuestion();
    updateProgress();
    hide(nextBtn);
  }
  
  function updateProgress() {
    const progressEl = document.getElementById('progress');
    progressEl.textContent = `Question ${currentQuestionIndex + 1}`;
  }
  
  function showGradePage() {
    hide(quiz);
    show(gradePage);
    
    const totalQuestions = sessionAnswers.length;
    const correctAnswers = sessionAnswers.filter(answer => answer.correct).length;
    const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    
    // Update grade display
    document.getElementById('gradePercent').textContent = `${percentage}%`;
    document.getElementById('gradeLetter').textContent = getGradeLetter(percentage);
    document.getElementById('correctCount').textContent = correctAnswers;
    document.getElementById('totalCount').textContent = totalQuestions;
    
    // Show missed questions
    const missedQuestions = sessionAnswers.filter(answer => !answer.correct);
    const missedList = document.getElementById('missedList');
    
    if (missedQuestions.length === 0) {
      missedList.innerHTML = '<p style="color: var(--accent); font-weight: 600;">Perfect! No questions missed.</p>';
    } else {
      missedList.innerHTML = missedQuestions.map(answer => `
        <div class="missed-item">
          <div class="missed-question">${answer.testName}</div>
          <div class="missed-answer">Your answer: ${answer.userTube} tube, ${answer.userInversions} inversions</div>
          <div class="missed-correct">Correct: ${answer.correctTube} tube, ${answer.correctInversions} inversions</div>
        </div>
      `).join('');
    }
  }
  
  function getGradeLetter(percentage) {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  }
  
  // --- quiz logic ---
  function loadQuestion(){
    currentTest = rand(tests);
    questionEl.textContent = currentTest.name;
    selectedTube = null;
    selectedInversion = null;
    feedbackEl.textContent = '';
    
    // Reset button states for new question
    updateButtonStates();
    updateCheckButtonState();
    // Hide the Next button when loading a new question
    hide(nextBtn);
  }
  
  function populateOptions(){
    // Clear previous selections
    selectedTube = null;
    selectedInversion = null;
    
    // Update button states
    updateButtonStates();
    
    // Add click handlers for tube buttons
    tubeButtons.querySelectorAll('.btn-option').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        
        // Remove selection from other tube buttons
        tubeButtons.querySelectorAll('.btn-option').forEach(b => b.classList.remove('selected'));
        
        // Select this button
        btn.classList.add('selected');
        selectedTube = btn.dataset.value;
        
        // Enable check button if both selections are made
        updateCheckButtonState();
      });
    });
    
    // Add click handlers for inversion buttons
    inversionButtons.querySelectorAll('.btn-option').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        
        // Remove selection from other inversion buttons
        inversionButtons.querySelectorAll('.btn-option').forEach(b => b.classList.remove('selected'));
        
        // Select this button
        btn.classList.add('selected');
        selectedInversion = btn.dataset.value;
        
        // Enable check button if both selections are made
        updateCheckButtonState();
      });
    });
  }
  
  function updateButtonStates() {
    // Reset all buttons to unselected state
    tubeButtons.querySelectorAll('.btn-option').forEach(btn => {
      btn.classList.remove('selected');
      btn.disabled = false;
    });
    
    inversionButtons.querySelectorAll('.btn-option').forEach(btn => {
      btn.classList.remove('selected');
      btn.disabled = false;
    });
  }
  
  function updateCheckButtonState() {
    checkBtn.disabled = !(selectedTube && selectedInversion);
  }
  
  checkBtn.addEventListener('click', () => {
    const chosenTube = tubes.find(t => t.id === selectedTube);
    const chosenInv  = selectedInversion;
    const correctTube = tubes.find(t => t.id === currentTest.tubeId);
  
    if (!chosenTube || !chosenInv){
      feedbackEl.textContent = 'Pick both a tube and inversion.';
      return;
    }
    
    const isCorrect = chosenTube.id === correctTube.id && chosenInv === correctTube.inversions;
    
    if (isCorrect){
      feedbackEl.textContent = '✅ Correct! Click Next to continue.';
    } else {
      feedbackEl.textContent = `❌ Correct: ${correctTube.color}, ${correctTube.inversions} inversions. Click Next to continue.`;
    }
    
    // Record the answer
    sessionAnswers.push({
      testName: currentTest.name,
      userTube: chosenTube.color,
      userInversions: chosenInv,
      correctTube: correctTube.color,
      correctInversions: correctTube.inversions,
      correct: isCorrect
    });
    
    // Disable the form fields after answering
    tubeButtons.querySelectorAll('.btn-option').forEach(btn => btn.disabled = true);
    inversionButtons.querySelectorAll('.btn-option').forEach(btn => btn.disabled = true);
    checkBtn.disabled = true;
    
    // Show the Next button
    show(nextBtn);
    
    currentQuestionIndex++;
    updateProgress();
  });
  
  nextBtn.addEventListener('click', loadQuestion);