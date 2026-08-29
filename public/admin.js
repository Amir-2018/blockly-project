/* public/admin.js — client wiring for the admin dashboard (uses server API) */
if (window.jQuery && $.fn.DataTable) {
    $('#teacherTable').DataTable({
        pageLength: 8,
        lengthMenu: [5, 8, 10, 20],
        searching: true,
        ordering: true,
        paging: true,
        info: true,
        language: {
            search: 'Rechercher :',
            lengthMenu: 'Afficher _MENU_ par page',
            info: '_START_ à _END_ sur _TOTAL_ enseignants',
            emptyTable: 'Aucun enseignant enregistré.',
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

document.querySelectorAll('.teacher-row').forEach((row) => {
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
        const nom = row.querySelector('.teacher-name strong').textContent.trim();
        const prenom = row.querySelector('.teacher-prenom').textContent.trim();
        const username = row.querySelector('.teacher-username').textContent.trim();
        openEditModal({ id, nom, prenom, username });
    });

    row.querySelector('[data-act="key"]').addEventListener('click', () => {
        openConfirmModal(id, 'Régénérer la clé ?', 'La clé actuelle sera remplacée.', 'Régénérer', 'rekey');
    });

    row.querySelector('[data-act="del"]').addEventListener('click', () => {
        openConfirmModal(id, 'Supprimer cet enseignant ?', 'Cette action est définitive.', 'Supprimer', 'delete');
    });
});

const modal = document.getElementById('adminModal');
const editForm = document.getElementById('editTeacherForm');
const confirmActions = document.getElementById('confirmActions');
const confirmButton = document.getElementById('confirmAction');
let modalAction = null;

function openEditModal(teacher) {
    modalAction = { id: teacher.id, action: 'update' };
    document.getElementById('modalTitle').textContent = 'Modifier l\'enseignant';
    document.getElementById('modalMessage').textContent = 'Mets à jour les informations de connexion.';
    document.getElementById('modalNom').value = teacher.nom;
    document.getElementById('modalPrenom').value = teacher.prenom;
    document.getElementById('modalUsername').value = teacher.username;
    editForm.hidden = false;
    confirmActions.hidden = true;
    showModal();
}

function openConfirmModal(id, title, message, label, action) {
    modalAction = { id, action };
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

editForm.addEventListener('submit', (event) => {
    event.preventDefault();
    api('/admin/teacher', 'update', {
        id: modalAction.id,
        nom: document.getElementById('modalNom').value.trim(),
        prenom: document.getElementById('modalPrenom').value.trim(),
        username: document.getElementById('modalUsername').value.trim()
    });
});

confirmButton.addEventListener('click', () => {
    api('/admin/teacher', modalAction.action, { id: modalAction.id });
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) closeModal();
});

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
