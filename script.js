const tubes = [
    { id: 'light-blue', color: 'Light Blue', inversions: 4 },
    { id: 'sst', color: 'Gold/Red Tiger', inversions: 5 },
    { id: 'plain-red', color: 'Plain Red', inversions: 0 },
    { id: 'lavender', color: 'Lavender', inversions: 8 },
    { id: 'royal-blue-edta', color: 'Royal Blue (EDTA)', inversions: 8 },
    { id: 'royal-blue-noadd', color: 'Royal Blue (No Additive)', inversions: 0 }
  ];
  
  const tests = [
    { name: 'Reticulocyte Count (Retic)', tubeId: 'lavender' },
    { name: 'D-Dimer', tubeId: 'light-blue' },
    { name: 'JAK-2', tubeId: 'lavender' },
    { name: 'Lipid Panel', tubeId: 'sst' },
    { name: 'PT-INR', tubeId: 'light-blue' },
    { name: 'FSH', tubeId: 'sst' },
    { name: 'Thyroid Panel', tubeId: 'sst' },
    { name: 'Homocysteine', tubeId: 'lavender' },
    { name: 'CMP', tubeId: 'sst' },
    { name: 'Iron / TIBC', tubeId: 'sst' }
  ];
  
  const questionEl = document.getElementById('question');
  const tubeSelect = document.getElementById('tube');
  const invSelect = document.getElementById('inversions');
  const feedbackEl = document.getElementById('feedback');
  
  let currentTest;
  
  function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  
  function loadQuestion() {
    currentTest = randomItem(tests);
    questionEl.textContent = `Test: ${currentTest.name}`;
    tubeSelect.value = '';
    invSelect.value = '';
    feedbackEl.textContent = '';
  }
  
  function populateOptions() {
    tubeSelect.innerHTML = '<option value="">-- Select Tube --</option>';
    tubes.forEach(t => {
      tubeSelect.innerHTML += `<option value="${t.id}">${t.color}</option>`;
    });
    const inversions = [...new Set(tubes.map(t => t.inversions))].sort((a, b) => a - b);
    invSelect.innerHTML = '<option value="">-- Select Inversions --</option>';
    inversions.forEach(n => {
      invSelect.innerHTML += `<option value="${n}">${n}</option>`;
    });
  }
  
  document.getElementById('check').addEventListener('click', () => {
    const chosenTube = tubes.find(t => t.id === tubeSelect.value);
    const chosenInv = parseInt(invSelect.value, 10);
    const correctTube = tubes.find(t => t.id === currentTest.tubeId);
  
    if (!chosenTube || isNaN(chosenInv)) {
      feedbackEl.textContent = 'Pick both a tube and inversion.';
      return;
    }
  
    if (chosenTube.id === correctTube.id && chosenInv === correctTube.inversions) {
      feedbackEl.textContent = '✅ Correct!';
    } else {
      feedbackEl.textContent = `❌ Correct: ${correctTube.color}, ${correctTube.inversions} inversions.`;
    }
  });
  
  document.getElementById('next').addEventListener('click', loadQuestion);
  
  populateOptions();
  loadQuestion();