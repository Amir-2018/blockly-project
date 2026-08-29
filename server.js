/* =========================================================================
   Amir Academy — Node.js + Express + EJS server
   - Renders pages with EJS
   - Session-based auth (admin + student key)
   - Uses db.json as the real database (read/written on the server)
   ========================================================================= */
const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3002;
const DB_FILE = path.join(__dirname, 'db.json');
const TEACHER_KEYS = new Set(['KEY-TEACHER', 'KEY-ADMIN']);

/* ---------- db.json helpers ---------- */
function readDB() {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}
function writeDB(db) {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}
function genKey() {
    return 'KEY-' + crypto.randomBytes(4).toString('hex').toUpperCase();
}
function genStudentKey(level) {
    const levelIndex = String(level.id || level.nom || 'NIVEAU')
        .trim()
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .toUpperCase();
    return `KEY-${levelIndex}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}
function findStudent(db, key) {
    for (const c of db.classes) {
        const s = c.eleves.find((e) => e.key === key);
        if (s) return { classe: c, eleve: s };
    }
    return null;
}

/* ---------- middleware ---------- */
function requireAdmin(req, res, next) {
    if (req.session.admin) return next();
    return res.redirect('/login');
}
function requireStudent(req, res, next) {
    if (req.session.student) return next();
    return res.redirect('/eleve');
}

/* ---------- setup ---------- */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'amir-academy-secret',
    resave: false,
    saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, 'public')));

/* ---------- public / landing ---------- */
app.get('/', (req, res) => res.render('index'));
app.get('/choose', (req, res) => res.render('choose'));

/* ---------- admin auth ---------- */
app.get('/login', (req, res) => res.render('login', { error: false }));
app.post('/login', (req, res) => {
    const user = (req.body.user || '').trim();
    const pass = (req.body.pass || '').trim();

    if (user === 'admin' && pass === 'admin') {
        req.session.admin = true;
        return res.redirect('/admin');
    }
    return res.render('login', { error: true });
});

app.get('/teacher', (req, res) => res.render('teacher', { error: false }));
app.get('/enseignant', (req, res) => res.redirect('/teacher'));
app.post('/teacher', (req, res) => {
    const user = (req.body.user || '').trim();
    const pass = (req.body.pass || '').trim();
    const db = readDB();
    const teacher = Array.isArray(db.teachers)
        ? db.teachers.find((item) => item.username === user && item.key === pass)
        : null;

    if (teacher || ((user === 'enseignant' || user === 'teacher') && TEACHER_KEYS.has(pass))) {
        req.session.teacher = true;
        return res.redirect('/admin');
    }

    return res.render('teacher', { error: true });
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'));
});

/* ---------- admin dashboard ---------- */
app.get('/admin', requireAdmin, (req, res) => {
    const db = readDB();
    if (!Array.isArray(db.teachers)) db.teachers = [];
    const notice = req.session.adminNotice || null;
    delete req.session.adminNotice;
    if (req.query.view === 'students') {
        const students = db.classes.flatMap((classe) => classe.eleves.map((eleve) => ({
            ...eleve,
            classId: classe.id,
            className: classe.nom
        })));
        return res.render('students', { students, classes: db.classes, notice });
    }
    if (req.query.view === 'levels') {
        const blockLabels = {
            controls_if: 'If',
            controls_repeat_ext: 'Répéter',
            controls_repeat: 'Répéter',
            controls_whileUntil: 'Tant que',
            controls_for: 'Pour',
            math_number: 'Nombre',
            math_arithmetic: 'Opération mathématique',
            text: 'Texte',
            text_print: 'Afficher',
            procedures_defreturn: 'Function avec retour',
            procedures_defnoreturn: 'Function',
            procedures_callreturn: 'Appeler une fonction',
            procedures_callnoreturn: 'Appeler une fonction',
            procedures_ifreturn: 'Retour conditionnel',
            robot_forward: 'Avancer',
            robot_backward: 'Reculer',
            robot_turn_left: 'Pivoter à gauche',
            robot_turn_right: 'Pivoter à droite',
            robot_pen: 'Couleur du chemin',
            robot_repeat_square: 'Dessiner un carré'
        };
        const levels = db.classes.map(({ id, nom, savedBlocks }) => ({
            id,
            nom,
            blocks: (Array.isArray(savedBlocks) ? savedBlocks : []).map((type) => ({ type, label: blockLabels[type] || type.replace(/_/g, ' ') }))
        }));
        return res.render('levels', { levels, notice });
    }
    if (req.query.view === 'saved') {
        const blockLabels = {
            controls_if: 'If',
            controls_repeat_ext: 'Répéter',
            controls_repeat: 'Répéter',
            controls_whileUntil: 'Tant que',
            controls_for: 'Pour',
            math_number: 'Nombre',
            math_arithmetic: 'Opération mathématique',
            text: 'Texte',
            text_print: 'Afficher',
            lists_create_with: 'Créer une liste',
            robot_forward: 'Avancer',
            robot_backward: 'Reculer',
            robot_turn_left: 'Pivoter à gauche',
            robot_turn_right: 'Pivoter à droite',
            robot_pen: 'Couleur du chemin',
            robot_repeat_square: 'Dessiner un carré'
        };
        const savedLevels = db.classes.map((level) => ({
            id: level.id,
            nom: level.nom,
            blocks: (Array.isArray(level.savedBlocks) ? level.savedBlocks : []).map((type) => ({
                type,
                label: blockLabels[type] || type.replace(/_/g, ' ')
            }))
        }));
        return res.render('saved', { levels: savedLevels, notice });
    }
    res.render('admin', { teachers: db.teachers, notice });
});

app.post('/admin/teacher', requireAdmin, (req, res) => {
    const { action, id, nom, prenom, username } = req.body;
    const db = readDB();
    if (!Array.isArray(db.teachers)) db.teachers = [];

    if (action === 'add') {
        db.teachers.push({
            id: 't' + Date.now().toString(36),
            nom: (nom || '').trim(),
            prenom: (prenom || '').trim(),
            username: (username || '').trim(),
            key: genKey()
        });
    } else if (action === 'update') {
        const t = db.teachers.find((e) => e.id === id);
        if (t) {
            t.nom = (nom || '').trim();
            t.prenom = (prenom || '').trim();
            t.username = (username || '').trim();
        }
    } else if (action === 'delete') {
        db.teachers = db.teachers.filter((e) => e.id !== id);
    } else if (action === 'rekey') {
        const t = db.teachers.find((e) => e.id === id);
        if (t) t.key = genKey();
    }

    writeDB(db);
    const messages = {
        add: { type: 'success', text: 'Enseignant ajouté avec succès.' },
        update: { type: 'success', text: 'Enseignant modifié avec succès.' },
        delete: { type: 'danger', text: 'Enseignant supprimé avec succès.' },
        rekey: { type: 'warning', text: 'Clé régénérée avec succès.' }
    };
    if (messages[action]) req.session.adminNotice = messages[action];
    if (req.get('X-Requested-With') === 'XMLHttpRequest') return res.sendStatus(204);
    res.redirect('/admin');
});

app.post('/admin/student', requireAdmin, (req, res) => {
    const { action, classId, id, nom, prenom } = req.body;
    const db = readDB();
    const classe = db.classes.find((item) => item.id === classId);
    const student = classe && classe.eleves.find((item) => item.id === id);

    if (action === 'add' && classe) {
        classe.eleves.push({
            id: 's' + Date.now().toString(36),
            nom: (nom || '').trim(),
            prenom: (prenom || '').trim(),
            key: genStudentKey(classe)
        });
    } else if (action === 'update' && student) {
        student.nom = (nom || '').trim();
        student.prenom = (prenom || '').trim();
    } else if (action === 'delete' && student) {
        classe.eleves = classe.eleves.filter((item) => item.id !== id);
    } else if (action === 'rekey' && student) {
        student.key = genStudentKey(classe);
    }

    writeDB(db);
    const messages = {
        add: { type: 'success', text: 'Élève ajouté avec succès.' },
        update: { type: 'success', text: 'Élève modifié avec succès.' },
        delete: { type: 'danger', text: 'Élève supprimé avec succès.' },
        rekey: { type: 'warning', text: 'Clé de l’élève régénérée avec succès.' }
    };
    if (messages[action]) req.session.adminNotice = messages[action];
    if (req.get('X-Requested-With') === 'XMLHttpRequest') return res.sendStatus(204);
    res.redirect('/admin?view=students');
});

app.post('/admin/level', requireAdmin, (req, res) => {
    const { action, id, nom } = req.body;
    const db = readDB();
    const name = (nom || '').trim();

    if (action === 'add' && name) {
        db.classes.push({ id: 'lvl-' + Date.now().toString(36), nom: name, eleves: [] });
    } else if (action === 'update' && name) {
        const level = db.classes.find((item) => item.id === id);
        if (level) level.nom = name;
    } else if (action === 'delete') {
        const level = db.classes.find((item) => item.id === id);
        if (level && level.eleves.length === 0) {
            db.classes = db.classes.filter((item) => item.id !== id);
        } else {
            req.session.adminNotice = { type: 'warning', text: 'Impossible de supprimer un niveau qui contient des élèves.' };
            if (req.get('X-Requested-With') === 'XMLHttpRequest') return res.sendStatus(204);
            return res.redirect('/admin?view=levels');
        }
    }

    writeDB(db);
    const messages = {
        add: { type: 'success', text: 'Niveau ajouté avec succès.' },
        update: { type: 'success', text: 'Niveau modifié avec succès.' },
        delete: { type: 'danger', text: 'Niveau supprimé avec succès.' }
    };
    if (messages[action]) req.session.adminNotice = messages[action];
    if (req.get('X-Requested-With') === 'XMLHttpRequest') return res.sendStatus(204);
    res.redirect('/admin?view=levels');
});
app.get('/admin/level/:id/preview', requireAdmin, (req, res) => {
    const db = readDB();
    const level = db.classes.find((item) => item.id === req.params.id);
    if (!level) return res.status(404).send('Niveau introuvable');
    res.render('level-preview', {
        level,
        savedOnly: req.query.saved === '1'
    });
});
app.post('/admin/level/:id/blocks', requireAdmin, (req, res) => {
    const db = readDB();
    const level = db.classes.find((item) => item.id === req.params.id);
    if (!level) return res.sendStatus(404);
    level.blocks = req.body && typeof req.body === 'object' ? req.body : null;
    writeDB(db);
    res.sendStatus(204);
});
app.post('/admin/level/:id/saved-blocks', requireAdmin, (req, res) => {
    const db = readDB();
    const level = db.classes.find((item) => item.id === req.params.id);
    if (!level) return res.sendStatus(404);
    level.savedBlocks = Array.isArray(req.body && req.body.types)
        ? [...new Set(req.body.types.filter((type) => typeof type === 'string'))]
        : [];
    writeDB(db);
    res.sendStatus(204);
});
app.get('/eleve', (req, res) => res.render('eleve', { error: false }));
app.post('/eleve', (req, res) => {
    const key = (req.body.key || '').trim();
    const nom = (req.body.nom || '').trim().toLowerCase();
    const db = readDB();
    const found = findStudent(db, key);

    if (found && found.eleve.nom.trim().toLowerCase() === nom) {
        req.session.student = {
            id: found.eleve.id,
            nom: found.eleve.nom,
            prenom: found.eleve.prenom,
            key: found.eleve.key,
            classe: found.classe.nom,
            niveauId: found.classe.id
        };
        return res.redirect('/editor');
    }

    return res.render('eleve', { error: true });
});

/* ---------- editor (protected) ---------- */
app.get('/editor', requireStudent, (req, res) => {
    const db = readDB();
    const level = db.classes.find((item) => item.id === req.session.student.niveauId);
    res.render('editor', {
        student: req.session.student,
        allowedBlockTypes: level && Array.isArray(level.savedBlocks) ? level.savedBlocks : []
    });
});

app.listen(PORT, () => {
    console.log(`Amir Academy running on http://localhost:${PORT}`);
});
