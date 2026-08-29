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
            classe: found.classe.nom
        };
        return res.redirect('/editor');
    }

    return res.render('eleve', { error: true });
});

/* ---------- editor (protected) ---------- */
app.get('/editor', requireStudent, (req, res) => {
    res.render('editor', { student: req.session.student });
});

app.listen(PORT, () => {
    console.log(`Amir Academy running on http://localhost:${PORT}`);
});
