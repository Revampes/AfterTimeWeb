// JS for edit_question page: render topics grid, modal behavior, form handling, previews

document.addEventListener('DOMContentLoaded', () => {
    // Topics setup using the provided topic labels
    const topics = [
        'Planet Earth',
        'Microscopic World I',
        'Metals',
        'Acids and Bases',
        'Fossil fuels and Carbon Compounds',
        'Microscopic World II',
        'Redox reactions, Chemical Cells and Electrolysis',
        'Chemical Reactions and Energy',
        'Rate of Reaction',
        'Chemical Equilibrium',
        'Chemistry of Carbon Compounds',
        'Patterns in the Chemical World',
        'Elective 1: Industrial Chemistry',
        'Elective 3: Analytical Chemistry'
    ];
    const topicsGrid = document.getElementById('topics-grid');

    // in-memory store of questions per topic
    const questionsByTopic = {};
    topics.forEach(t => questionsByTopic[t] = []);

    let activeTopic = null;

    function renderTopics() {
        topicsGrid.innerHTML = '';
        topics.forEach(t => {
            const card = document.createElement('button');
            card.className = 'topic-card';
            card.type = 'button';
            card.setAttribute('role','listitem');
            card.setAttribute('aria-pressed','false');
            card.tabIndex = 0;
            card.dataset.topic = t;
            card.innerHTML = `<span class="topic-label">${t}</span>`;
            // plain click sets active topic (single open at a time)
            card.addEventListener('click', () => setActiveTopic(card));
            card.addEventListener('keydown', (ev) => {
                if (ev.key === 'Enter' || ev.key === ' ') {
                    ev.preventDefault();
                    setActiveTopic(card);
                }
            });
            topicsGrid.appendChild(card);
        });

        // also populate the single-topic dropdown in the form
        const topicSelect = document.getElementById('q-topic-select');
        if (topicSelect) {
            // clear existing non-placeholder options
            const preserve = topicSelect.querySelector('option[value=""]');
            topicSelect.innerHTML = '';
            if (preserve) topicSelect.appendChild(preserve);
            topics.forEach(t => {
                const opt = document.createElement('option');
                opt.value = t;
                opt.textContent = t;
                topicSelect.appendChild(opt);
            });
        }
    }

    function setActiveTopic(card) {
        const t = card.dataset.topic;
        // remove previous active
        const prev = topicsGrid.querySelector('.topic-card.active');
        if (prev) prev.classList.remove('active');
        // add active
        card.classList.add('active');
        activeTopic = t;
        // if the modal's topic select exists, reflect active topic as default
        const topicSelect = document.getElementById('q-topic-select');
        if (topicSelect) topicSelect.value = activeTopic;
        // reflect in questions panel
        renderQuestionsList();
    }

    renderTopics();

    // Questions list rendering
    const questionsListEl = document.getElementById('questions-list');
    const questionsTitle = document.getElementById('questions-title');

    function renderQuestionsList() {
        questionsListEl.innerHTML = '';
        if (!activeTopic) {
            questionsTitle.textContent = 'Questions';
            questionsListEl.innerHTML = '<p class="muted">Select a topic to view its questions. Click a topic to open it for viewing.</p>';
            return;
        }
        questionsTitle.textContent = `Questions — ${activeTopic}`;
        const list = questionsByTopic[activeTopic] || [];
        if (list.length === 0) {
            questionsListEl.innerHTML = '<p class="muted">No questions for this topic yet. Add one using the "+ Add New Question" button.</p>';
            return;
        }
        list.forEach(q => {
            const item = document.createElement('div');
            item.className = 'question-item';
            item.tabIndex = 0;
            item.dataset.qid = q.id;
            const title = `${q.source || ''} ${q.year || ''} — Q${q.number || ''} ${q.sub ? q.sub : ''}`.trim();
            item.innerHTML = `<div class="q-title">${escapeHtml(title)}</div><div class="q-summary">${escapeHtml((q.text || '').slice(0,140))}</div>`;
            item.addEventListener('click', () => openQuestionForEdit(q));
            item.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') openQuestionForEdit(q); });
            questionsListEl.appendChild(item);
        });
    }

    function escapeHtml(s){ return (s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }

    // Modal handling
    const openBtn = document.getElementById('open-add-btn');
    const modal = document.getElementById('add-modal');
    const closeTargets = modal.querySelectorAll('[data-close]');
    const modalCloseBtn = modal.querySelector('.modal-close');

    function openModal(prefill) {
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden','false');
        document.body.style.overflow = 'hidden';
        // focus first field
        setTimeout(()=> document.getElementById('q-source').focus(), 50);
        // if prefill provided, populate form
        if (prefill) populateForm(prefill);
        else {
            // default topic in dropdown to activeTopic if present
            const topicSelect = document.getElementById('q-topic-select');
            if (topicSelect && activeTopic) topicSelect.value = activeTopic;
            // ensure select is ready and focus it so the user can change it immediately
            if (topicSelect) {
                topicSelect.disabled = false;
                setTimeout(() => { try { topicSelect.focus(); } catch (e){} }, 120);
            }
        }
    }
    function closeModal() {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden','true');
        document.body.style.overflow = '';
        clearEditingState();
    }

    openBtn.addEventListener('click', () => openModal());
    closeTargets.forEach(el => el.addEventListener('click', closeModal));
    modalCloseBtn.addEventListener('click', closeModal);

    // clicking backdrop should close
    modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
    document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') closeModal(); });

    // Show / hide MC options based on type
    const qType = document.getElementById('q-type');
    const mcOptions = document.getElementById('mc-options');
    function updateMcVisibility() {
        if (!qType || !mcOptions) return;
        if (qType.value === 'mc') mcOptions.style.display = '';
        else mcOptions.style.display = 'none';
    }
    qType.addEventListener('change', updateMcVisibility);
    updateMcVisibility();

    // Image previews for question and answer
    const qImage = document.getElementById('q-image');
    const qPreview = document.getElementById('q-image-preview');
    const aImage = document.getElementById('answer-image');
    const aPreview = document.getElementById('answer-image-preview');

    function imagePreview(inputEl, imgEl) {
        if (!inputEl || !imgEl) return;
        inputEl.addEventListener('change', () => {
            const f = inputEl.files && inputEl.files[0];
            if (f) {
                imgEl.src = URL.createObjectURL(f);
                imgEl.classList.remove('hidden');
            } else {
                imgEl.src = '';
                imgEl.classList.add('hidden');
            }
        });
    }
    imagePreview(qImage, qPreview);
    imagePreview(aImage, aPreview);

    // MC small previews for each mc-file input
    const mcFileInputs = Array.from(document.querySelectorAll('.mc-file'));
    mcFileInputs.forEach(inp => {
        // create small preview image after the file input
        const small = document.createElement('img');
        small.className = 'small-preview hidden';
        inp.parentNode.appendChild(small);
        inp.addEventListener('change', () => {
            const f = inp.files && inp.files[0];
            if (f) {
                small.src = URL.createObjectURL(f);
                small.classList.remove('hidden');
            } else {
                small.src = '';
                small.classList.add('hidden');
            }
        });
    });

    // Make radio correct selection clearer (visual) - highlight row when selected
    const mcRadioButtons = Array.from(document.querySelectorAll('input[name="correct"]'));
    mcRadioButtons.forEach(r => {
        r.addEventListener('change', () => {
            mcRadioButtons.forEach(rb => rb.closest('.mc-row')?.classList.remove('selected'));
            const row = r.closest('.mc-row');
            if (row) row.classList.add('selected');
        });
    });

    // Form submit - collect and save question into questionsByTopic
    const form = document.getElementById('question-form');
    // track editing id if present
    let editingId = null;

    function clearEditingState(){
        editingId = null;
        // clear preview imgs
        if (qPreview) { qPreview.src=''; qPreview.classList.add('hidden'); }
        if (aPreview) { aPreview.src=''; aPreview.classList.add('hidden'); }
        // clear form fields
        form.reset();
        updateMcVisibility();
    }

    function populateForm(q){
        // q is the question object
        editingId = q.id;
        const el = (name) => form.elements ? form.elements[name] : form[name];
        if (el('source')) el('source').value = q.source || '';
        if (el('year')) el('year').value = q.year || '';
        if (el('number')) el('number').value = q.number || '';
        if (el('sub')) el('sub').value = q.sub || '';
        if (el('type')) el('type').value = q.type || 'mc';
        if (el('text')) el('text').value = q.text || '';
        if (el('answer')) el('answer').value = q.answer || '';
        updateMcVisibility();
        // set MC options if present
        if (el('optA')) el('optA').value = q.optA || '';
        if (el('optB')) el('optB').value = q.optB || '';
        if (el('optC')) el('optC').value = q.optC || '';
        if (el('optD')) el('optD').value = q.optD || '';
        if (q.correct) {
            const rb = form.querySelector(`input[name="correct"][value="${q.correct}"]`);
            if (rb) rb.checked = true;
        }
        if (el('valA')) el('valA').value = (q.valA !== undefined) ? q.valA : el('valA').value;
        if (el('valB')) el('valB').value = (q.valB !== undefined) ? q.valB : el('valB').value;
        if (el('valC')) el('valC').value = (q.valC !== undefined) ? q.valC : el('valC').value;
        if (el('valD')) el('valD').value = (q.valD !== undefined) ? q.valD : el('valD').value;
        // select the topic in dropdown (use first topic assigned)
        const topicSelect = document.getElementById('q-topic-select');
        if (topicSelect) topicSelect.value = (q.topics && q.topics[0]) || '';
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const obj = {};
        fd.forEach((v,k) => {
            if (v instanceof File) {
                obj[k] = v.name || null;
            } else obj[k] = v;
        });
        // collect MC values
        obj.optA = form.optA?.value || '';
        obj.optB = form.optB?.value || '';
        obj.optC = form.optC?.value || '';
        obj.optD = form.optD?.value || '';
        obj.correct = (form.querySelector('input[name="correct"]:checked') || {}).value || null;
        obj.valA = form.valA?.value || 0;
        obj.valB = form.valB?.value || 0;
        obj.valC = form.valC?.value || 0;
        obj.valD = form.valD?.value || 0;

        // topic assignment: single topic selected in dropdown
        const topic = form.topic?.value || form['topic']?.value || '';
        if (!topic) {
            alert('Please choose a topic for this question.');
            return;
        }
        obj.topics = [topic];

        // basic validation
        if (!obj.text && !obj.image) {
            alert('Please provide question text or an image.');
            return;
        }

        // create or update
        if (editingId) {
            // update existing: remove from all topics then re-add
            Object.keys(questionsByTopic).forEach(t => {
                questionsByTopic[t] = questionsByTopic[t].filter q => q.id !== editingId);
            });
            const updated = Object.assign({ id: editingId }, obj);
            obj.id = editingId;
            questionsByTopic[topic].push(updated);
            console.log('Updated question', updated);
        } else {
            const id = 'q_' + Date.now();
            obj.id = editingId;
            const stored = Object.assign({}, obj);
            questionsByTopic[topic].push(stored);
            console.log('Saved new question', stored);
        }

        alert('Question saved.');
        closeModal();
        // refresh list if activeTopic affected
        if (activeTopic && obj.topics.includes(activeTopic)) renderQuestionsList();
    });

    // open question for editing
    function openQuestionForEdit(q) {
        openModal(q);
    }

    // initial rendering of questions (empty)
    renderQuestionsList();

});
