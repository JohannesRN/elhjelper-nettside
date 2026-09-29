const modal = document.getElementById('calcModal');
const content = document.getElementById('calculatorContent');
const closeButton = document.getElementById('modalClose');
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

menuToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});

document.querySelectorAll('.main-nav a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const calculators = {
  ohm: {
    title: 'Ohms lov',
    description: 'Finn spenning, motstand eller straum.',
    html: `
      <div class="calc-form">
        <div class="field"><label for="ohmMode">Eg vil finne</label><select id="ohmMode"><option value="U">Spenning (U)</option><option value="R">Motstand (R)</option><option value="I">Straum (I)</option></select></div>
        <div class="field"><label for="ohmU">Spenning (U) – V</label><input id="ohmU" type="number" step="any" placeholder="230" disabled></div>
        <div class="field"><label for="ohmR">Motstand (R) – Ω</label><input id="ohmR" type="number" step="any" placeholder="23"></div>
        <div class="field"><label for="ohmI">Straum (I) – A</label><input id="ohmI" type="number" step="any" placeholder="10"></div>
      </div>
      <div class="result-box"><div class="result-label">Resultat</div><div class="result-value" id="ohmResult">–</div></div>
      <div class="formula" id="ohmFormula">U = R × I</div>
    `,
    init() {
      const mode = document.getElementById('ohmMode');
      const u = document.getElementById('ohmU');
      const r = document.getElementById('ohmR');
      const i = document.getElementById('ohmI');
      const result = document.getElementById('ohmResult');
      const formula = document.getElementById('ohmFormula');
      const calc = () => {
        const U = Number(u.value), R = Number(r.value), I = Number(i.value);
        let value = NaN, unit = '';
        if (mode.value === 'U' && R > 0 && I >= 0) { value = R * I; unit = 'V'; formula.textContent = 'U = R × I'; }
        if (mode.value === 'R' && U > 0 && I > 0) { value = U / I; unit = 'Ω'; formula.textContent = 'R = U / I'; }
        if (mode.value === 'I' && U > 0 && R > 0) { value = U / R; unit = 'A'; formula.textContent = 'I = U / R'; }
        result.textContent = Number.isFinite(value) ? `${format(value)} ${unit}` : '–';
      };
      const updateFields = () => {
        u.disabled = mode.value === 'U';
        r.disabled = mode.value === 'R';
        i.disabled = mode.value === 'I';
        if (u.disabled) u.value = '';
        if (r.disabled) r.value = '';
        if (i.disabled) i.value = '';
      };
      mode.addEventListener('change', () => { updateFields(); calc(); });
      [u,r,i].forEach(el => el.addEventListener('input', calc));
      updateFields();
      calc();
    }
  },
  effekt: {
    title: 'Effekt', description: 'Berekn effekt ut frå spenning og straum.',
    html: `<div class="calc-form"><div class="field"><label for="pU">Spenning (U) – V</label><input id="pU" type="number" step="any" placeholder="230"></div><div class="field"><label for="pI">Straum (I) – A</label><input id="pI" type="number" step="any" placeholder="10"></div></div><div class="result-box"><div class="result-label">Effekt</div><div class="result-value" id="pResult">–</div></div><div class="formula">P = U × I</div>`,
    init() { bindSimple(['pU','pI'], ['pResult'], () => { const v=Number(pU.value)*Number(pI.value); return Number.isFinite(v)&&v>=0 ? `${format(v)} W` : '–'; }); }
  },
  energi: {
    title: 'Energiforbruk', description: 'Berekn energiforbruk i kWh.',
    html: `<div class="calc-form"><div class="field"><label for="eP">Effekt (P) – W</label><input id="eP" type="number" step="any" placeholder="2000"></div><div class="field"><label for="eT">Tid – timar</label><input id="eT" type="number" step="any" placeholder="5"></div></div><div class="result-box"><div class="result-label">Energiforbruk</div><div class="result-value" id="eResult">–</div></div><div class="formula">kWh = (W × timar) / 1000</div>`,
    init() { bindSimple(['eP','eT'], ['eResult'], () => { const v=Number(eP.value)*Number(eT.value)/1000; return Number.isFinite(v)&&v>=0 ? `${format(v)} kWh` : '–'; }); }
  },
  trefase: {
    title: 'Trefase', description: 'Berekn effekt eller straum i trefase.',
    html: `<div class="calc-form"><div class="field"><label for="tMode">Eg vil finne</label><select id="tMode"><option value="P">Effekt (P)</option><option value="I">Straum (I)</option></select></div><div class="field"><label for="tU">Spenning U<sub>LL</sub> – V</label><input id="tU" type="number" step="any" placeholder="400"></div><div class="field"><label for="tI">Straum (I) – A</label><input id="tI" type="number" step="any" placeholder="10" disabled></div><div class="field"><label for="tP">Effekt (P) – kW</label><input id="tP" type="number" step="any" placeholder="5.89"></div><div class="field"><label for="tCos">cos φ</label><input id="tCos" type="number" step="any" value="0.85"></div></div><div class="result-box"><div class="result-label">Resultat</div><div class="result-value" id="tResult">–</div></div><div class="formula" id="tFormula">P = √3 × U × I × cos φ</div>`,
    init() { const mode=tMode,u=tU,i=tI,p=tP,c=tCos,res=tResult,form=tFormula; const updateFields=()=>{ i.disabled=mode.value==='I'; p.disabled=mode.value==='P'; if(i.disabled)i.value=''; if(p.disabled)p.value=''; }; const calc=()=>{const U=Number(u.value),I=Number(i.value),P=Number(p.value),cos=Number(c.value); let v=NaN,unit=''; if(mode.value==='P'&&U>0&&I>=0&&cos>0){v=Math.sqrt(3)*U*I*cos/1000;unit='kW';form.textContent='P = √3 × U × I × cos φ';} if(mode.value==='I'&&P>=0&&U>0&&cos>0){v=P*1000/(Math.sqrt(3)*U*cos);unit='A';form.textContent='I = (P × 1000) / (√3 × U × cos φ)';} res.textContent=Number.isFinite(v)?`${format(v)} ${unit}`:'–';}; mode.addEventListener('change',()=>{updateFields();calc();}); [u,i,p,c].forEach(x=>x.addEventListener('input',calc)); updateFields(); calc(); }
  },
  spenningsfall: {
    title: 'Spenningsfall', description: 'Forenkla berekning for 1-fase og 3-fase.',
    html: `<div class="calc-form"><div class="field"><label for="sPhase">Anlegg</label><select id="sPhase"><option value="1">1-fase</option><option value="3">3-fase</option></select></div><div class="field"><label for="sMaterial">Leiar</label><select id="sMaterial"><option value="cu">Kobber (Cu)</option><option value="al">Aluminium (Al)</option></select></div><div class="field"><label for="sA">Tverrsnitt – mm²</label><select id="sA"><option>1.5</option><option>2.5</option><option>4</option><option>6</option><option>10</option><option>16</option><option>25</option></select></div><div class="field"><label for="sU">Spenning – V</label><input id="sU" type="number" step="any" value="230"></div><div class="field"><label for="sL">Lengde éin veg – m</label><input id="sL" type="number" step="any" placeholder="30"></div><div class="field"><label for="sI">Straum – A</label><input id="sI" type="number" step="any" placeholder="10"></div></div><div class="result-box"><div class="result-label">Spenningsfall</div><div class="result-value" id="sResult">–</div></div><div class="formula" id="sFormula">ΔU = I × ρ × (2 × L / A)</div><div class="note">Lengda er éin veg. For 1-fase er returleiar tatt med i formelen.</div>`,
    init() { const phase=sPhase,mat=sMaterial,a=sA,u=sU,l=sL,i=sI,res=sResult,form=sFormula; const calc=()=>{const rho=mat.value==='cu'?0.0175:0.0282,A=Number(a.value),U=Number(u.value),L=Number(l.value),I=Number(i.value); if(!(A>0&&U>0&&L>=0&&I>=0)){res.textContent='–';return;} const du=phase.value==='1'?I*rho*(2*L/A):Math.sqrt(3)*I*rho*(L/A); const pct=du/U*100; form.textContent=phase.value==='1'?'ΔU = I × ρ × (2 × L / A)':'ΔU = √3 × I × ρ × (L / A)'; res.textContent=`${format(du)} V (${format(pct)} %)`;}; [phase,mat,a,u,l,i].forEach(x=>x.addEventListener('input',calc)); calc(); }
  },
  cc: {
    title: 'CC-avstand varmekabel', description: 'Finn CC-avstand eller nødvendig kabellengde.',
    html: `<div class="calc-form"><div class="field"><label for="cMode">Eg vil finne</label><select id="cMode"><option value="cc">CC-avstand</option><option value="length">Kabellengde</option></select></div><div class="field"><label for="cArea">Areal – m²</label><input id="cArea" type="number" step="any" placeholder="10"></div><div class="field"><label for="cLength">Kabellengde – m</label><input id="cLength" type="number" step="any" placeholder="100"></div><div class="field"><label for="cCc">Ønska CC – cm</label><input id="cCc" type="number" step="any" placeholder="10" disabled></div></div><div class="result-box"><div class="result-label">Resultat</div><div class="result-value" id="cResult">–</div></div><div class="formula" id="cFormula">CC = (Areal × 100) / kabellengde</div><div class="note">Bruk faktisk oppvarma areal.</div>`,
    init() { const mode=cMode,area=cArea,len=cLength,cc=cCc,res=cResult,form=cFormula; const updateFields=()=>{ len.disabled=mode.value==='length'; cc.disabled=mode.value==='cc'; if(len.disabled)len.value=''; if(cc.disabled)cc.value=''; }; const calc=()=>{const A=Number(area.value),L=Number(len.value),C=Number(cc.value);let v=NaN,unit='';if(mode.value==='cc'&&A>0&&L>0){v=A*100/L;unit='cm';form.textContent='CC = (Areal × 100) / kabellengde';}if(mode.value==='length'&&A>0&&C>0){v=A*100/C;unit='m';form.textContent='Kabellengde = (Areal × 100) / CC';}res.textContent=Number.isFinite(v)?`${format(v)} ${unit}`:'–';}; mode.addEventListener('change',()=>{updateFields();calc();}); [area,len,cc].forEach(x=>x.addEventListener('input',calc)); updateFields(); calc();}
  },
  kortslutning: {
    title: 'Kortslutningsstraum', description: 'Forenkla berekning basert på spenning og impedans.',
    html: `<div class="calc-form"><div class="field"><label for="kPhase">Anlegg</label><select id="kPhase"><option value="1">1-fase</option><option value="3">3-fase</option></select></div><div class="field"><label for="kU">Spenning – V</label><input id="kU" type="number" step="any" value="230"></div><div class="field"><label for="kZ">Impedans Z – Ω</label><input id="kZ" type="number" step="any" placeholder="0.5"></div></div><div class="result-box"><div class="result-label">Kortslutningsstraum</div><div class="result-value" id="kResult">–</div></div><div class="formula" id="kFormula">Ik = U₀ / Z</div><div class="note">Forenkla berekning. Kontroller alltid anlegget og gjeldande krav før praktisk bruk.</div>`,
    init() { const phase=kPhase,u=kU,z=kZ,res=kResult,form=kFormula; const calc=()=>{const U=Number(u.value),Z=Number(z.value);if(!(U>0&&Z>0)){res.textContent='–';return;}const v=phase.value==='1'?U/Z:U/(Math.sqrt(3)*Z);form.textContent=phase.value==='1'?'Ik = U₀ / Z':'Ik₃ = ULL / (√3 × Z)';res.textContent=v>=1000?`${format(v/1000)} kA`:`${format(v)} A`;};[phase,u,z].forEach(x=>x.addEventListener('input',calc));calc();}
  }
};

function format(value) {
  if (!Number.isFinite(value)) return '–';
  return new Intl.NumberFormat('nb-NO', { maximumFractionDigits: 2 }).format(value);
}

function bindSimple(ids, resultIds, fn) {
  const elements = ids.map(id => document.getElementById(id));
  const result = document.getElementById(resultIds[0]);
  const calc = () => { result.textContent = fn(); };
  elements.forEach(el => el.addEventListener('input', calc));
  calc();
}

function openCalculator(key) {
  const calc = calculators[key];
  if (!calc) return;
  content.innerHTML = `<h2 class="calc-title" id="modalTitle">${calc.title}</h2><p class="calc-description">${calc.description}</p>${calc.html}`;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  calc.init();
}

function closeCalculator() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}


const learningContent = {
  grunnleggjande: {
    title: 'Grunnleggjande elektro',
    description: 'Repeter dei viktigaste grunnomgrepa i elektrofaget.',
    html: `<div class="learning-content">
      <h3>Volt (V)</h3><p>Spenning er den elektriske "drivkrafta" som får straumen til å gå i ein krets.</p>
      <h3>Ampere (A)</h3><p>Straum fortel kor mykje elektrisk ladning som flyt gjennom kretsen per tid.</p>
      <h3>Ohm (Ω)</h3><p>Motstand seier kor mykje ein komponent eller last motset seg straumen.</p>
      <h3>Watt (W)</h3><p>Effekt fortel kor raskt elektrisk energi blir brukt eller omsett.</p>
      <h3>kWh</h3><p>Kilowattime er ei eining for energiforbruk over tid.</p>
      <h3>AC og DC</h3><ul><li><strong>AC:</strong> Vekselstraum – straumen skifter retning periodisk.</li><li><strong>DC:</strong> Likestraum – straumen går i same retning.</li></ul>
      <h3>Serie- og parallellkobling</h3><ul><li><strong>Serie:</strong> Komponentane står etter kvarandre i same straumveg.</li><li><strong>Parallell:</strong> Komponentane er kopla i separate greiner.</li></ul>
    </div>`
  },
  formlar: {
    title: 'Formlar',
    description: 'Nokre av dei viktigaste formlane du brukar i elektrofaget.',
    html: `<div class="learning-content">
      <h3>Ohms lov</h3><ul><li>U = R × I</li><li>R = U / I</li><li>I = U / R</li></ul>
      <h3>Effekt</h3><ul><li>P = U × I</li><li>I = P / U</li><li>U = P / I</li></ul>
      <h3>Trefase</h3><ul><li>P = √3 × U × I × cos φ</li><li>I = (P × 1000) / (√3 × U × cos φ)</li></ul>
      <h3>Energiforbruk</h3><ul><li>kWh = (W × timar) / 1000</li></ul>
      <h3>Spenningsfall</h3><ul><li>1-fase: ΔU = I × ρ × (2 × L / A)</li><li>3-fase: ΔU = √3 × I × ρ × (L / A)</li></ul>
    </div>`
  },
  praksis: {
    title: 'Elektro i praksis',
    description: 'Praktiske tema du møter på skule og ute på anlegg.',
    html: `<div class="learning-content">
      <h3>Ledere og kabeltverrsnitt</h3><p>Leiarar må veljast ut frå mellom anna belastning, installasjonsmåte, lengde og spenningsfall. Tverrsnittet blir oppgitt i mm².</p>
      <h3>Vern</h3><p>Vern skal beskytte leidningar og utstyr mot mellom anna overbelastning og kortslutning.</p>
      <h3>Jordfeilvern</h3><p>Jordfeilvernet overvaker straumen i kretsen og kan koble ut ved jordfeil.</p>
      <h3>Nettsystem</h3><ul><li>TN-system</li><li>IT-system</li><li>TT-system</li></ul>
      <h3>IP-grad</h3><p>IP-graden seier noko om kor godt kapslinga vernar mot inntrenging av faste partiklar og vatn.</p>
    </div>`
  },
  oppgaver: {
    title: 'Oppgåver',
    description: 'Test deg sjølv med praktiske elektrooppgåver.',
    html: `<div class="learning-content">
      <h3>1. Effekt og straum</h3><p>Ein last brukar 2300 W ved 230 V. Kor stor straum går?</p><div class="learning-answer">Svar: I = P / U = 2300 / 230 = 10 A</div>
      <h3>2. Ohms lov</h3><p>Ein motstand er 20 Ω og spenninga er 230 V. Finn straumen.</p><div class="learning-answer">Svar: I = U / R = 230 / 20 = 11,5 A</div>
      <h3>3. Effekt</h3><p>Ein last trekker 8 A ved 230 V. Finn effekten.</p><div class="learning-answer">Svar: P = U × I = 230 × 8 = 1840 W</div>
      <h3>4. Energiforbruk</h3><p>Ein last på 2000 W står på i 5 timar. Kor mykje energi brukar han?</p><div class="learning-answer">Svar: 10 kWh</div>
      <h3>5. Motstand</h3><p>230 V og 10 A. Finn motstanden.</p><div class="learning-answer">Svar: R = U / I = 23 Ω</div>
      <h3>6. Trefase</h3><p>400 V, 10 A og cos φ = 0,85. Finn effekten.</p><div class="learning-answer">Svar: ≈ 5,89 kW</div>
      <h3>7. Kortslutningsstraum</h3><p>230 V og impedans 0,5 Ω. Finn kortslutningsstraumen.</p><div class="learning-answer">Svar: Ik = U / Z = 460 A</div>
    </div>`
  }
};

function openLearning(key) {
  const item = learningContent[key];
  if (!item) return;
  content.innerHTML = `<h2 class="calc-title">${item.title}</h2><p class="calc-description">${item.description}</p>${item.html}`;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

document.querySelectorAll('.learning-card').forEach(card => {
  card.addEventListener('click', () => openLearning(card.dataset.learning));
});

document.querySelectorAll('.calc-card').forEach(card => {
  card.addEventListener('click', () => openCalculator(card.dataset.calc));
});
closeButton.addEventListener('click', closeCalculator);
document.querySelector('[data-close]').addEventListener('click', closeCalculator);
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeCalculator(); });
