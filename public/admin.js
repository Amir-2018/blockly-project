/* public/admin.js — client wiring for the admin dashboard (uses server API) */
if (window.jQuery && $.fn.DataTable) {
    const table = document.body.classList.contains('student-admin-page') ? '#studentTable' : '#teacherTable';
    const entity = document.body.classList.contains('student-admin-page') ? 'élèves' : 'enseignants';
    $(table).DataTable({
        pageLength: 8,
        lengthMenu: [5, 8, 10, 20],
        searching: true,
        ordering: true,
        paging: true,
        info: true,
        language: {
            search: 'Rechercher :',
            lengthMenu: 'Afficher _MENU_ par page',
            info: '_START_ à _END_ sur _TOTAL_ ' + entity,
            emptyTable: 'Aucun ' + (entity === 'élèves' ? 'élève' : 'enseignant') + ' enregistré.',
            zeroRecords: 'Aucun résultat trouvé.',
            paginate: {
                first: 'Premier',
                previous: 'Précédent',
                next: 'Suivant',
                last: 'Dernier'
            }
        }
    });
}

const studentPage = document.body.classList.contains('student-admin-page');
const levelPage = document.body.classList.contains('levels-admin-page');
const savedPage = document.body.classList.contains('saved-admin-page');
const rowSelector = studentPage ? '.student-row' : '.teacher-row';
const entityLabel = studentPage ? 'élève' : 'enseignant';
const endpoint = studentPage ? '/admin/student' : '/admin/teacher';

document.querySelectorAll(rowSelector).forEach((row) => {
    const id = row.dataset.id;
    const keyEl = row.querySelector('.stu-key code');

    row.querySelector('[data-act="copy"]').addEventListener('click', (e) => {
        const btn = e.currentTarget;
        navigator.clipboard?.writeText(keyEl.textContent.trim());
        btn.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i>';
        setTimeout(() => {
            btn.innerHTML = '<i class="fa-regular fa-copy" aria-hidden="true"></i>';
        }, 1000);
    });

    row.querySelector('[data-act="edit"]').addEventListener('click', () => {
        const nom = row.querySelector(studentPage ? '.student-name strong' : '.teacher-name strong').textContent.trim();
        const prenom = row.querySelector(studentPage ? '.student-prenom' : '.teacher-prenom').textContent.trim();
        const usernameElement = row.querySelector('.teacher-username');
        const username = usernameElement ? usernameElement.textContent.trim() : '';
        openEditModal({ id, classId: row.dataset.classId, nom, prenom, username });
    });

    row.querySelector('[data-act="key"]').addEventListener('click', () => {
        openConfirmModal(id, row.dataset.classId, 'Régénérer la clé ?', 'La clé actuelle sera remplacée.', 'Régénérer', 'rekey');
    });

    row.querySelector('[data-act="del"]').addEventListener('click', () => {
        openConfirmModal(id, row.dataset.classId, 'Supprimer cet ' + entityLabel + ' ?', 'Cette action est définitive.', 'Supprimer', 'delete');
    });
});

const modal = document.getElementById('adminModal');
const editForm = document.getElementById('editTeacherForm');
const confirmActions = document.getElementById('confirmActions');
const confirmButton = document.getElementById('confirmAction');
let modalAction = null;

function openEditModal(teacher) {
    modalAction = { id: teacher.id, classId: teacher.classId, action: 'update' };
    document.getElementById('modalTitle').textContent = 'Modifier l\'' + entityLabel;
    document.getElementById('modalMessage').textContent = 'Mets à jour les informations de connexion.';
    document.getElementById('modalNom').value = teacher.nom;
    document.getElementById('modalPrenom').value = teacher.prenom;
    const usernameInput = document.getElementById('modalUsername');
    if (usernameInput) usernameInput.value = teacher.username;
    if (usernameInput) usernameInput.closest('label').hidden = studentPage;
    editForm.hidden = false;
    confirmActions.hidden = true;
    showModal();
}

function openConfirmModal(id, classId, title, message, label, action) {
    modalAction = { id, classId, action };
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalMessage').textContent = message;
    confirmButton.textContent = label;
    confirmButton.className = action === 'delete' ? 'mini action-delete' : 'mini action-key';
    editForm.hidden = true;
    confirmActions.hidden = false;
    showModal();
}

function showModal() {
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
}

function closeModal() {
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    modalAction = null;
}

document.querySelectorAll('[data-modal-close]').forEach((element) => {
    element.addEventListener('click', closeModal);
});

if (editForm && confirmButton) {
    editForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const fields = {
            id: modalAction.id,
            nom: document.getElementById('modalNom').value.trim(),
            prenom: document.getElementById('modalPrenom').value.trim()
        };
        if (modalAction.classId) fields.classId = modalAction.classId;
        const usernameInput = document.getElementById('modalUsername');
        if (usernameInput && !studentPage) fields.username = usernameInput.value.trim();
        api(endpoint, 'update', fields);
    });

    confirmButton.addEventListener('click', () => {
        const fields = { id: modalAction.id };
        if (modalAction.classId) fields.classId = modalAction.classId;
        api(endpoint, modalAction.action, fields);
    });
}

document.addEventListener('keydown', (event) => {
    if (modal && event.key === 'Escape' && !modal.hidden) closeModal();
});

if (levelPage || savedPage) {
    const levelEndpoint = '/admin/level';
    document.querySelectorAll('.level-card, .saved-level-card').forEach((card) => {
        const id = card.dataset.id;
        const previewLink = card.querySelector('[data-level-act="preview"], .action-preview');
        if (previewLink) {
            previewLink.addEventListener('click', (event) => {
                if (savedPage) event.preventDefault();
                openPreview(id, card.querySelector('.level-name, .saved-level-heading h2').textContent.trim());
            });
        }
        if (levelPage && card.querySelector('[data-level-act="edit"]')) {
        card.querySelector('[data-level-act="edit"]').addEventListener('click', () => {
            modalAction = { id, action: 'update' };
            document.getElementById('modalTitle').textContent = 'Modifier le niveau';
            document.getElementById('modalMessage').textContent = 'Mets à jour le nom du niveau.';
            document.getElementById('modalLevelName').value = card.querySelector('.level-name').textContent.trim();
            document.getElementById('editLevelForm').hidden = false;
            confirmActions.hidden = true;
            showModal();
        });
        }
        if (!levelPage) return;
        card.querySelector('[data-level-act="del"]').addEventListener('click', () => {
            modalAction = { id, action: 'delete' };
            document.getElementById('modalTitle').textContent = 'Supprimer le niveau ?';
            document.getElementById('modalMessage').textContent = 'Un niveau contenant des élèves ne peut pas être supprimé.';
            confirmButton.textContent = 'Supprimer';
            confirmButton.className = 'mini action-delete';
            document.getElementById('editLevelForm').hidden = true;
            confirmActions.hidden = false;
            showModal();
        });
    });

    if (levelPage) {
        document.getElementById('editLevelForm').addEventListener('submit', (event) => {
            event.preventDefault();
            api(levelEndpoint, 'update', { id: modalAction.id, nom: document.getElementById('modalLevelName').value.trim() });
        });
        confirmButton.addEventListener('click', () => api(levelEndpoint, modalAction.action, { id: modalAction.id }));
    }

    const previewModal = document.getElementById('previewModal');
    const previewFrame = document.getElementById('previewFrame');
    function openPreview(id, name) {
        document.getElementById('previewTitle').textContent = 'Blocs Blockly';
        previewFrame.src = '/admin/level/' + encodeURIComponent(id) + '/preview?saved=1';
        previewModal.hidden = false;
        previewModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
    }
    function closePreview() {
        previewModal.hidden = true;
        previewModal.setAttribute('aria-hidden', 'true');
        previewFrame.src = 'about:blank';
        document.body.classList.remove('modal-open');
    }
    document.querySelectorAll('[data-preview-close]').forEach((element) => element.addEventListener('click', closePreview));
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !previewModal.hidden) closePreview();
    });
}

const notification = document.querySelector('.admin-notification');
if (notification) {
    notification.querySelector('.notification-close').addEventListener('click', () => notification.remove());
    setTimeout(() => notification.remove(), 5000);
}

function api(url, action, fields) {
    const body = new URLSearchParams({ action, ...fields });
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body
    }).then(() => location.reload());
}
