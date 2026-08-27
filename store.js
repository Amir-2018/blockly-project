/* =========================================================================
   store.js — tiny client-side "database" + auth helpers.
   Seed comes from db.json when served over HTTP; otherwise from SEED below.
   All mutations are persisted in localStorage (GitHub Pages is static).
   ========================================================================= */

const SEED = {
    classes: [
        { id: '6A', nom: '6ème A', eleves: [
            { id: 'e1', nom: 'Dupont', prenom: 'Jean', key: 'KEY-6A-JEAN' },
            { id: 'e2', nom: 'Martin', prenom: 'Léa', key: 'KEY-6A-LEA' }
        ] },
        { id: '5B', nom: '5ème B', eleves: [
            { id: 'e3', nom: 'Bernard', prenom: 'Hugo', key: 'KEY-5B-HUGO' }
        ] },
        { id: '4C', nom: '4ème C', eleves: [] }
    ]
};

const DB_KEY = 'amir_academy_db';
const ADMIN_KEY = 'amir_academy_admin';
const STUDENT_KEY = 'amir_academy_student';

const DB = {
    /* Ensure localStorage is seeded (from db.json over HTTP, else from SEED). */
    async bootstrap() {
        if (localStorage.getItem(DB_KEY)) return DB.get();
        try {
            const res = await fetch('db.json', { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                localStorage.setItem(DB_KEY, JSON.stringify(data));
                return data;
            }
        } catch (e) { /* file:// or offline: fall back to SEED */ }
        const seed = JSON.parse(JSON.stringify(SEED));
        localStorage.setItem(DB_KEY, JSON.stringify(seed));
        return seed;
    },

    get() {
        const raw = localStorage.getItem(DB_KEY);
        return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(SEED));
    },

    save(db) { localStorage.setItem(DB_KEY, JSON.stringify(db)); },

    genId() {
        return 's' + Math.random().toString(36).slice(2, 9);
    },

    genKey() {
        const bytes = new Uint8Array(4);
        (window.crypto || window.msCrypto).getRandomValues(bytes);
        return 'KEY-' + Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    },

    findStudentByKey(key) {
        const db = DB.get();
        for (const c of db.classes) {
            const s = c.eleves.find(e => e.key === key);
            if (s) return { classe: c, eleve: s };
        }
        return null;
    },

    addStudent(classId, nom, prenom) {
        const db = DB.get();
        const cls = db.classes.find(c => c.id === classId);
        if (!cls) return null;
        const eleve = { id: DB.genId(), nom, prenom, key: DB.genKey() };
        cls.eleves.push(eleve);
        DB.save(db);
        return eleve;
    },

    updateStudent(classId, studentId, fields) {
        const db = DB.get();
        const cls = db.classes.find(c => c.id === classId);
        if (!cls) return false;
        const s = cls.eleves.find(e => e.id === studentId);
        if (!s) return false;
        Object.assign(s, fields);
        DB.save(db);
        return true;
    },

    deleteStudent(classId, studentId) {
        const db = DB.get();
        const cls = db.classes.find(c => c.id === classId);
        if (!cls) return false;
        cls.eleves = cls.eleves.filter(e => e.id !== studentId);
        DB.save(db);
        return true;
    },

    regenerateKey(classId, studentId) {
        const db = DB.get();
        const cls = db.classes.find(c => c.id === classId);
        if (!cls) return null;
        const s = cls.eleves.find(e => e.id === studentId);
        if (!s) return null;
        s.key = DB.genKey();
        DB.save(db);
        return s.key;
    }
};

const Auth = {
    isAdmin() { return localStorage.getItem(ADMIN_KEY) === 'true'; },
    loginAdmin(user, pass) {
        if (user === 'admin' && pass === 'admin') {
            localStorage.setItem(ADMIN_KEY, 'true');
            return true;
        }
        return false;
    },
    logoutAdmin() { localStorage.removeItem(ADMIN_KEY); },

    setStudentSession(eleve, classeNom) {
        localStorage.setItem(STUDENT_KEY, JSON.stringify({ id: eleve.id, nom: eleve.nom, prenom: eleve.prenom, key: eleve.key, classe: classeNom }));
    },
    getStudentSession() {
        const raw = localStorage.getItem(STUDENT_KEY);
        return raw ? JSON.parse(raw) : null;
    },
    isStudentValid() {
        const s = Auth.getStudentSession();
        if (!s || !s.key) return false;
        return !!DB.findStudentByKey(s.key);
    },
    logoutStudent() { localStorage.removeItem(STUDENT_KEY); }
};
