/* admin.js — dashboard for managing students per class */
(async function () {
    if (!Auth.isAdmin()) { window.location.href = 'login.html'; return; }
    await DB.bootstrap();

    const classSelect = document.getElementById('classSelect');
    const studentList = document.getElementById('studentList');
    const addForm = document.getElementById('addForm');

    function classes() { return DB.get().classes; }
    function currentClass() { return classes().find(c => c.id === classSelect.value); }

    let selectedClass = null;
    function renderSelect() {
        classSelect.innerHTML = '';
        const list = classes();
        list.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = `${c.nom} (${c.eleves.length})`;
            classSelect.appendChild(opt);
        });
        // Preserve the previously selected class after rebuilding the list.
        if (selectedClass && list.some(c => c.id === selectedClass)) {
            classSelect.value = selectedClass;
        }
        selectedClass = classSelect.value;
    }

    function refresh() {
        selectedClass = classSelect.value;
        renderSelect();
        renderList();
    }

    function renderList() {
        const cls = currentClass();
        studentList.innerHTML = '';
        if (!cls) return;
        if (cls.eleves.length === 0) {
            studentList.innerHTML = `<p class="empty">Aucun élève dans « ${cls.nom} ». Ajoute le premier ci-dessus.</p>`;
            return;
        }
        cls.eleves.forEach(s => {
            const row = document.createElement('div');
            row.className = 'student-row';
            row.innerHTML = `
                <div class="stu-name"><strong>${escapeHtml(s.prenom)} ${escapeHtml(s.nom)}</strong></div>
                <div class="stu-key"><code>${escapeHtml(s.key)}</code>
                    <button class="mini" data-act="copy" title="Copier">⧉</button>
                </div>
                <div class="stu-actions">
                    <button class="mini" data-act="edit">Modifier</button>
                    <button class="mini" data-act="key">Régénérer clé</button>
                    <button class="mini danger" data-act="del">Supprimer</button>
                </div>`;
            row.querySelector('[data-act="edit"]').onclick = () => {
                const nom = prompt('Nom de l\'élève :', s.nom);
                if (nom === null) return;
                const prenom = prompt('Prénom de l\'élève :', s.prenom);
                if (prenom === null) return;
                DB.updateStudent(cls.id, s.id, { nom: nom.trim(), prenom: prenom.trim() });
                refresh();
            };
            row.querySelector('[data-act="key"]').onclick = () => {
                if (confirm(`Régénérer la clé de ${s.prenom} ${s.nom} ?`)) {
                    DB.regenerateKey(cls.id, s.id);
                    refresh();
                }
            };
            row.querySelector('[data-act="del"]').onclick = () => {
                if (confirm(`Supprimer ${s.prenom} ${s.nom} ?`)) {
                    DB.deleteStudent(cls.id, s.id);
                    refresh();
                }
            };
            row.querySelector('[data-act="copy"]').onclick = () => {
                navigator.clipboard?.writeText(s.key);
                row.querySelector('[data-act="copy"]').textContent = '✓';
                setTimeout(() => (row.querySelector('[data-act="copy"]').textContent = '⧉'), 1000);
            };
            studentList.appendChild(row);
        });
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    }

    classSelect.addEventListener('change', refresh);
    addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nom = document.getElementById('nom').value.trim();
        const prenom = document.getElementById('prenom').value.trim();
        if (!nom || !prenom) return;
        DB.addStudent(classSelect.value, nom, prenom);
        addForm.reset();
        refresh();
    });
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        Auth.logoutAdmin();
        window.location.href = 'login.html';
    });

    refresh();
})();
