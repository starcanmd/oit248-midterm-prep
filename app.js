/* OIT 248 midterm practice: app logic (vanilla JS, no build step) */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const h = (s) => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // ---------- storage ----------
  const KEY = "oit248-prep-v1";
  let store = { answers: {}, recall: {}, theme: null };
  try { const raw = localStorage.getItem(KEY); if (raw) store = Object.assign(store, JSON.parse(raw)); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {} };

  // ---------- state ----------
  const state = { mode: "practice", topic: "all", qtype: "all", idx: 0, order: [], exam: null };
  const conceptById = Object.fromEntries(CONCEPTS.map(c => [c.id, c]));
  const topicById = Object.fromEntries(TOPICS.map(t => [t.id, t]));

  const TYPE_LABEL = { mc: "Multiple choice", bug: "Find and fix the bug", output: "What does it print?", write: "Write the model", tf: "True or false", short: "Short answer" };

  // ---------- helpers ----------
  function codeBlock(code) {
    if (!code) return "";
    const lines = code.replace(/\n$/, "").split("\n");
    return `<pre class="code">${lines.map((l, i) => `<span class="ln">${i + 1}</span>${h(l)}`).join("\n")}</pre>`;
  }
  function areaTag(area) {
    const name = { sim: "Simulation", opt: "Optimization", py: "Python" }[area] || area;
    return `<span class="tag ${area}">${name}</span>`;
  }
  function filtered() {
    return QUESTIONS.filter(q => (state.topic === "all" || q.topic === state.topic) && (state.qtype === "all" || q.type === state.qtype));
  }
  function shuffle(a) { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }
  function updateScore() {
    const done = Object.keys(store.answers).length;
    const ok = Object.values(store.answers).filter(v => v === "ok").length;
    $("#score").textContent = `${done} done, ${ok} right`;
  }

  // ---------- sidebar ----------
  function renderSide() {
    const counts = {};
    QUESTIONS.forEach(q => { counts[q.topic] = (counts[q.topic] || 0) + 1; });
    const doneBy = {};
    QUESTIONS.forEach(q => { if (store.answers[q.id]) doneBy[q.topic] = (doneBy[q.topic] || 0) + 1; });
    const items = [{ id: "all", name: "All topics", area: "" }].concat(TOPICS);
    $("#topicList").innerHTML = items.map(t => {
      const n = t.id === "all" ? QUESTIONS.length : (counts[t.id] || 0);
      const d = t.id === "all" ? Object.keys(store.answers).length : (doneBy[t.id] || 0);
      const dot = t.area ? `<span class="dot" style="background:var(--${t.area})"></span>` : `<span class="dot" style="background:var(--ink-3)"></span>`;
      return `<button class="topic ${state.topic === t.id ? "is-on" : ""}" data-topic="${t.id}">${dot}<span>${h(t.name)}</span><span class="n">${d}/${n}</span></button>`;
    }).join("");
    const types = [["all", "All types"]].concat(Object.entries(TYPE_LABEL).filter(([k]) => QUESTIONS.some(q => q.type === k)));
    $("#typeList").innerHTML = types.map(([k, v]) => `<button class="topic ${state.qtype === k ? "is-on" : ""}" data-type="${k}"><span>${v}</span></button>`).join("");
    $("#topicList").querySelectorAll("[data-topic]").forEach(b => b.onclick = () => { state.topic = b.dataset.topic; state.idx = 0; state.order = []; render(); });
    $("#typeList").querySelectorAll("[data-type]").forEach(b => b.onclick = () => { state.qtype = b.dataset.type; state.idx = 0; state.order = []; render(); });
  }

  // ---------- question cell ----------
  function renderQuestion(q, opts = {}) {
    const topic = topicById[q.topic];
    const concept = conceptById[q.concept];
    let input = "";
    if (q.type === "mc" || q.type === "tf") {
      input = `<div class="choices">${q.choices.map((c, i) => `<button class="choice" data-i="${i}"><span class="k">${String.fromCharCode(97 + i)})</span><span>${c}</span></button>`).join("")}</div>`;
    } else {
      input = `<textarea class="answer" placeholder="${q.type === "write" ? "Write decisions, objective and constraints here (math, words or pseudocode)..." : q.type === "bug" ? "Which line is wrong, and what is the fix?" : "Your answer..."}"></textarea>`;
    }
    const prev = store.answers[q.id];
    return `
    <div class="cell" data-qid="${q.id}">
      <div class="gutter in">In [${q.n}]:</div>
      <div class="body">
        <div class="tags">${areaTag(q.area)}<span class="tag">${h(topic ? topic.name : q.topic)}</span><span class="tag">${TYPE_LABEL[q.type] || q.type}</span>${q.source ? `<span class="tag">${h(q.source)}</span>` : ""}${prev ? `<span class="tag" style="color:var(--${prev === "ok" ? "ok" : "bad"})">${prev === "ok" ? "got it before" : "missed before"}</span>` : ""}</div>
        <div class="prompt">${q.prompt}</div>
        ${codeBlock(q.code)}
        ${input}
        <div class="actions">
          ${(q.type === "mc" || q.type === "tf") ? `<button class="btn check" disabled>Check</button>` : `<button class="btn reveal">Show solution</button>`}
          ${concept ? `<button class="btn secondary concept" data-c="${concept.id}">Concept: ${h(concept.title)}</button>` : ""}
        </div>
        <div class="out" hidden></div>
      </div>
    </div>`;
  }

  function wireQuestion(cellEl, q, onDone) {
    const out = $(".out", cellEl);
    const concept = conceptById[q.concept];
    const conceptBtn = $(".concept", cellEl);
    if (conceptBtn) conceptBtn.onclick = () => openConcept(concept.id);

    function finish(verdict, extraHtml = "") {
      store.answers[q.id] = verdict; save(); updateScore(); renderSide();
      out.hidden = false;
      out.innerHTML = `
        <div class="cell" style="margin:12px 0 0;border-color:var(--line)">
          <div class="gutter out">Out [${q.n}]:</div>
          <div class="body">
            <div class="verdict ${verdict}">${verdict === "ok" ? "Correct." : "Not quite."}</div>
            <div class="explain">${extraHtml}${q.explanation}</div>
            ${concept ? `<button class="concept-link" data-c="${concept.id}">Review the concept: <b>${h(concept.title)}</b></button>` : ""}
          </div>
        </div>`;
      const link = $(".concept-link", out); if (link) link.onclick = () => openConcept(concept.id);
      if (onDone) onDone(verdict);
    }

    if (q.type === "mc" || q.type === "tf") {
      let picked = null;
      const choices = cellEl.querySelectorAll(".choice");
      const check = $(".check", cellEl);
      choices.forEach(c => c.onclick = () => { choices.forEach(x => x.classList.remove("is-picked")); c.classList.add("is-picked"); picked = +c.dataset.i; check.disabled = false; });
      check.onclick = () => {
        if (picked === null) return;
        choices.forEach(c => { c.disabled = true; if (+c.dataset.i === q.answer) c.classList.add("is-right"); else if (+c.dataset.i === picked) c.classList.add("is-wrong"); });
        check.disabled = true;
        finish(picked === q.answer ? "ok" : "bad");
      };
    } else {
      const reveal = $(".reveal", cellEl);
      reveal.onclick = () => {
        reveal.disabled = true;
        out.hidden = false;
        out.innerHTML = `
        <div class="cell" style="margin:12px 0 0">
          <div class="gutter out">Out [${q.n}]:</div>
          <div class="body">
            <div class="verdict">Solution</div>
            <div class="explain">${q.explanation}</div>
            <p class="hint" style="margin-top:10px">Compare with what you wrote, then grade yourself.</p>
            <div class="actions"><button class="btn ok self" data-v="ok">I got it</button><button class="btn bad self" data-v="bad">I missed it</button>
            ${concept ? `<button class="concept-link" data-c="${concept.id}">Review the concept: <b>${h(concept.title)}</b></button>` : ""}</div>
          </div>
        </div>`;
        out.querySelectorAll(".self").forEach(b => b.onclick = () => {
          out.querySelectorAll(".self").forEach(x => x.disabled = true);
          store.answers[q.id] = b.dataset.v; save(); updateScore(); renderSide();
          b.textContent = b.dataset.v === "ok" ? "Marked: got it" : "Marked: missed";
          if (onDone) onDone(b.dataset.v);
        });
        const link = $(".concept-link", out); if (link) link.onclick = () => openConcept(concept.id);
      };
    }
  }

  // ---------- practice mode ----------
  function renderPractice() {
    const list = filtered();
    const stage = $("#stage");
    if (!list.length) { stage.innerHTML = `<div class="empty">No questions match this filter. Pick another topic or type.</div>`; return; }
    if (!state.order.length || state.order.length !== list.length) state.order = list.map((_, i) => i);
    if (state.idx >= list.length) state.idx = 0;
    const q = list[state.order[state.idx]];
    stage.innerHTML = `
      <div class="nav-row">
        <span class="pos">${state.idx + 1} / ${list.length}</span>
        <span>
          <button class="ghost" id="shuf">Shuffle</button>
          <button class="ghost" id="prev">Previous</button>
          <button class="ghost" id="next">Next</button>
        </span>
      </div>
      ${renderQuestion(q)}
      <p class="hint">Keyboard: ← → to move, 1–4 to pick a choice, Enter to check.</p>`;
    wireQuestion($(".cell", stage), q);
    $("#prev").onclick = () => { state.idx = (state.idx - 1 + list.length) % list.length; render(); };
    $("#next").onclick = () => { state.idx = (state.idx + 1) % list.length; render(); };
    $("#shuf").onclick = () => { state.order = shuffle(state.order); state.idx = 0; render(); };
  }

  // ---------- recall mode ----------
  function dueScore(c) { const r = store.recall[c.id]; return r ? r.due : 0; }
  function renderRecall() {
    const stage = $("#stage");
    const cards = CONCEPTS.slice().sort((a, b) => dueScore(a) - dueScore(b) || Math.random() - 0.5);
    const c = cards[0];
    const seen = Object.keys(store.recall).length;
    const strong = Object.values(store.recall).filter(r => r.streak >= 2).length;
    stage.innerHTML = `
      <div class="stat-row"><span><b>${CONCEPTS.length}</b> concepts</span><span><b>${seen}</b> reviewed</span><span><b>${strong}</b> solid (2+ in a row)</span></div>
      <div class="card">
        <div class="tags">${areaTag(c.area)}</div>
        <h3>${h(c.title)}</h3>
        <div class="q">${c.recall || "Explain this concept in your own words, then reveal."}</div>
        <div class="actions"><button class="btn" id="flip">Reveal</button></div>
        <div class="a" id="ans" hidden>
          <div class="c-body">${c.body}</div>
          <div class="pill-row">
            <button class="btn bad" data-g="again">Again</button>
            <button class="btn secondary" data-g="hard">Hard</button>
            <button class="btn ok" data-g="good">Got it</button>
          </div>
        </div>
      </div>
      <p class="hint">Cards you mark "Again" come back first. Cards you know well sink to the bottom.</p>`;
    $("#flip").onclick = () => { $("#ans").hidden = false; $("#flip").disabled = true; };
    stage.querySelectorAll("[data-g]").forEach(b => b.onclick = () => {
      const r = store.recall[c.id] || { streak: 0, due: 0 };
      const now = Date.now();
      if (b.dataset.g === "again") { r.streak = 0; r.due = now + 1; }
      else if (b.dataset.g === "hard") { r.streak = Math.max(0, r.streak); r.due = now + 5 * 60 * 1000; }
      else { r.streak += 1; r.due = now + (r.streak >= 3 ? 24 : r.streak * 6) * 60 * 60 * 1000; }
      store.recall[c.id] = r; save(); render();
    });
  }

  // ---------- exam mode ----------
  function renderExam() {
    const stage = $("#stage");
    if (!state.exam) {
      stage.innerHTML = `
        <div class="card">
          <h3>Mock exam</h3>
          <p>12 questions drawn at random: four on reading and fixing Python, four on simulation ideas, four on writing optimization models. You get 40 minutes, roughly the pace of the real exam. Free-response questions are self-graded.</p>
          <div class="actions"><button class="btn" id="startExam">Start</button></div>
        </div>`;
      $("#startExam").onclick = () => {
        const pick = (area, n) => shuffle(QUESTIONS.filter(q => q.area === area)).slice(0, n);
        state.exam = { qs: shuffle(pick("py", 4).concat(pick("sim", 4), pick("opt", 4))), i: 0, results: [], end: Date.now() + 40 * 60 * 1000, timer: null };
        render();
      };
      return;
    }
    const ex = state.exam;
    if (ex.i >= ex.qs.length || Date.now() > ex.end) {
      clearInterval(ex.timer);
      const ok = ex.results.filter(r => r.v === "ok").length;
      const byArea = {};
      ex.results.forEach(r => { byArea[r.area] = byArea[r.area] || { ok: 0, n: 0 }; byArea[r.area].n++; if (r.v === "ok") byArea[r.area].ok++; });
      stage.innerHTML = `
        <div class="exam-summary">
          <h3>Result: ${ok} / ${ex.results.length}</h3>
          <ul>${Object.entries(byArea).map(([a, s]) => `<li>${{ sim: "Simulation", opt: "Optimization", py: "Python" }[a]}: ${s.ok} / ${s.n}</li>`).join("")}</ul>
          ${ex.results.filter(r => r.v !== "ok").length ? `<p>Concepts to revisit:</p><ul>${[...new Set(ex.results.filter(r => r.v !== "ok").map(r => r.concept))].filter(Boolean).map(cid => `<li><button class="concept-link" data-c="${cid}">${h(conceptById[cid].title)}</button></li>`).join("")}</ul>` : `<p>Clean sheet. Try another set.</p>`}
          <div class="actions"><button class="btn" id="again">New mock exam</button></div>
        </div>`;
      stage.querySelectorAll(".concept-link").forEach(b => b.onclick = () => openConcept(b.dataset.c));
      $("#again").onclick = () => { state.exam = null; render(); };
      return;
    }
    const q = ex.qs[ex.i];
    stage.innerHTML = `
      <div class="nav-row"><span class="pos">Question ${ex.i + 1} of ${ex.qs.length}</span><span class="timer" id="timer"></span></div>
      ${renderQuestion(q)}
      <div class="actions" style="margin-top:4px"><button class="btn secondary" id="skip">Skip (counts as missed)</button><button class="btn" id="nextQ" disabled>Next question</button></div>`;
    const tick = () => { const left = Math.max(0, ex.end - Date.now()); const m = Math.floor(left / 60000), s = Math.floor((left % 60000) / 1000); const t = $("#timer"); if (!t) return; t.textContent = `${m}:${String(s).padStart(2, "0")} left`; t.classList.toggle("low", left < 5 * 60 * 1000); if (left === 0) render(); };
    clearInterval(ex.timer); ex.timer = setInterval(tick, 1000); tick();
    wireQuestion($(".cell", stage), q, (v) => { ex.results.push({ v, area: q.area, concept: q.concept }); $("#nextQ").disabled = false; });
    $("#nextQ").onclick = () => { ex.i++; render(); };
    $("#skip").onclick = () => { ex.results.push({ v: "bad", area: q.area, concept: q.concept }); ex.i++; render(); };
  }

  // ---------- concepts page ----------
  function conceptHtml(c) {
    const related = QUESTIONS.filter(q => q.concept === c.id).length;
    return `<details class="concept" id="c-${c.id}"><summary>${areaTag(c.area)} ${h(c.title)} <span class="hint" style="margin-left:auto">${related} question${related === 1 ? "" : "s"}</span></summary><div class="c-body">${c.body}</div></details>`;
  }
  function renderConcepts() {
    const groups = [["py", "Python you must be able to read"], ["sim", "Monte Carlo simulation"], ["opt", "Linear optimization"]];
    $("#stage").innerHTML = groups.map(([a, title]) => `<div class="group-title">${title}</div>` + CONCEPTS.filter(c => c.area === a).map(conceptHtml).join("")).join("");
  }

  // ---------- exam code playbook ----------
  function renderPlaybook() {
    const stage = $("#stage");
    stage.innerHTML = `<div class="box-expect"><h3 style="margin:0 0 6px">What to expect</h3>${EXPECT}</div>` +
      PLAYBOOK.map(pb => {
        const c = conceptById[pb.concept];
        return `<div class="cell" style="grid-template-columns:76px 1fr">
          <div class="gutter in">In [&nbsp;]:</div>
          <div class="body">
            <div class="tags">${areaTag(pb.area)}</div>
            <h3 style="margin:0 0 4px;font-size:18px">${h(pb.title)}</h3>
            <p class="hint" style="margin:0 0 8px;font-size:14px;color:var(--ink-2)">${h(pb.when)}</p>
            ${codeBlock(pb.code)}
            <p style="margin:6px 0 8px">${h(pb.notes)}</p>
            <div class="actions"><button class="btn secondary copy">Copy code</button>${c ? `<button class="btn secondary concept" data-c="${c.id}">Concept: ${h(c.title)}</button>` : ""}</div>
          </div></div>`;
      }).join("");
    stage.querySelectorAll(".cell").forEach((cell, i) => {
      $(".copy", cell).onclick = () => { navigator.clipboard.writeText(PLAYBOOK[i].code).then(() => { $(".copy", cell).textContent = "Copied"; }); };
      const b = $(".concept", cell); if (b) b.onclick = () => openConcept(b.dataset.c);
    });
  }

  // ---------- drawer ----------
  function openConcept(id) {
    const c = conceptById[id]; if (!c) return;
    $("#drawerBody").innerHTML = `<div class="tags">${areaTag(c.area)}</div><h2>${h(c.title)}</h2><div class="c-body">${c.body}</div>`;
    $("#drawer").classList.add("is-open"); $("#drawer").setAttribute("aria-hidden", "false"); $("#scrim").classList.add("is-on");
  }
  function closeDrawer() { $("#drawer").classList.remove("is-open"); $("#drawer").setAttribute("aria-hidden", "true"); $("#scrim").classList.remove("is-on"); }
  $("#drawerClose").onclick = closeDrawer; $("#scrim").onclick = closeDrawer;

  // ---------- render ----------
  function render() {
    renderSide(); updateScore();
    document.querySelectorAll(".mode").forEach(b => b.classList.toggle("is-on", b.dataset.mode === state.mode));
    $("#side").style.display = (state.mode === "practice") ? "" : "none";
    document.querySelector(".layout").classList.toggle("no-side", state.mode !== "practice");
    ({ practice: renderPractice, recall: renderRecall, exam: renderExam, concepts: renderConcepts, playbook: renderPlaybook })[state.mode]();
    window.scrollTo({ top: 0 });
  }
  document.querySelectorAll(".mode").forEach(b => b.onclick = () => { state.mode = b.dataset.mode; render(); });
  $("#reset").onclick = () => { if (confirm("Clear all saved progress in this browser?")) { store = { answers: {}, recall: {} }; save(); render(); } };

  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") return;
    if (e.key === "Escape") closeDrawer();
    if (state.mode !== "practice") return;
    if (e.key === "ArrowRight") { const n = $("#next"); if (n) n.click(); }
    if (e.key === "ArrowLeft") { const p = $("#prev"); if (p) p.click(); }
    if (/^[1-4]$/.test(e.key)) { const c = document.querySelectorAll(".choice")[+e.key - 1]; if (c && !c.disabled) c.click(); }
    if (e.key === "Enter") { const c = $(".check"); if (c && !c.disabled) c.click(); }
  });

  // numbering
  QUESTIONS.forEach((q, i) => { q.n = i + 1; });
  render();
})();
