/* public/admin.js — client wiring for the admin dashboard (uses server API) */
document.querySelectorAll('.student-row').forEach((row) => {
    const id = row.dataset.id;
    const classId = row.dataset.class;
    const keyEl = row.querySelector('.stu-key code');

    row.querySelector('[data-act="copy"]').addEventListener('click', (e) => {
        const btn = e.currentTarget;
        navigator.clipboard?.writeText(keyEl.textContent.trim());
        btn.textContent = '✓';
        setTimeout(() => (btn.textContent = '⧉'), 1000);
    });

    row.querySelector('[data-act="edit"]').addEventListener('click', () => {
        const nameParts = row.querySelector('.stu-name strong').textContent.trim().split(' ');
        const prenom = nameParts.shift() || '';
        const nom = nameParts.join(' ') || '';
        const newNom = prompt('Nom de l\'élève :', nom);
        if (newNom === null) return;
        const newPrenom = prompt('Prénom de l\'élève :', prenom);
        if (newPrenom === null) return;
        api('/admin/student', 'update', { classId, id, nom: newNom.trim(), prenom: newPrenom.trim() });
    });

    row.querySelector('[data-act="key"]').addEventListener('click', () => {
        if (confirm('Régénérer la clé de cet élève ?')) api('/admin/student', 'rekey', { classId, id });
    });

    row.querySelector('[data-act="del"]').addEventListener('click', () => {
        if (confirm('Supprimer cet élève ?')) api('/admin/student', 'delete', { classId, id });
    });
});

/* ----- class management ----- */
const classSelect = document.querySelector('select[name="c"]');
if (classSelect) {
    document.getElementById('renameClass').addEventListener('click', () => {
        const current = classSelect.selectedOptions[0].textContent.replace(/\s*\(\d+\)$/, '');
        const name = prompt('Nouveau nom de la classe :', current);
        if (name === null) return;
        api('/admin/class', 'update', { classId: classSelect.value, nom: name.trim() });
    });
    document.getElementById('delClass').addEventListener('click', () => {
        if (confirm('Supprimer cette classe et tous ses élèves ?')) {
            api('/admin/class', 'delete', { classId: classSelect.value });
        }
    });
}

function api(url, action, fields) {
    const body = new URLSearchParams({ action, ...fields });
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
    }).then(() => location.reload());
}
