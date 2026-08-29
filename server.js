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

    if ((user === 'enseignant' || user === 'teacher') && TEACHER_KEYS.has(pass)) {
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
    const current = req.query.c || (db.classes[0] && db.classes[0].id);
    res.render('admin', { classes: db.classes, current });
});

app.post('/admin/student', requireAdmin, (req, res) => {
    const { action, classId, id, nom, prenom } = req.body;
    const db = readDB();
    const cls = db.classes.find((c) => c.id === classId);
    if (!cls) return res.redirect('/admin');

    if (action === 'add') {
        cls.eleves.push({
            id: 's' + Date.now().toString(36),
            nom: (nom || '').trim(),
            prenom: (prenom || '').trim(),
            key: genKey()
        });
    } else if (action === 'update') {
        const s = cls.eleves.find((e) => e.id === id);
        if (s) { s.nom = (nom || '').trim(); s.prenom = (prenom || '').trim(); }
    } else if (action === 'delete') {
        cls.eleves = cls.eleves.filter((e) => e.id !== id);
    } else if (action === 'rekey') {
        const s = cls.eleves.find((e) => e.id === id);
        if (s) s.key = genKey();
    }
    writeDB(db);
    res.redirect('/admin');
});

/* ---------- class management (admin) ---------- */
app.post('/admin/class', requireAdmin, (req, res) => {
    const { action, classId, nom } = req.body;
    const db = readDB();
    if (action === 'add') {
        const id = 'cls-' + Date.now().toString(36);
        db.classes.push({ id, nom: (nom || '').trim(), eleves: [] });
    } else if (action === 'update') {
        const c = db.classes.find((x) => x.id === classId);
        if (c) c.nom = (nom || '').trim();
    } else if (action === 'delete') {
        db.classes = db.classes.filter((x) => x.id !== classId);
    }
    writeDB(db);
    const keep = db.classes[0] ? db.classes[0].id : '';
    res.redirect('/admin?c=' + keep);
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
