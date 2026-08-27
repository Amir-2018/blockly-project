/* =========================================================================
   Learn Python with Me — Blockly + Python app
   - Rich toolbox: Logic, Loops, Math, Text, Data Structures, Variables, Functions
   - Live Python code generation
   - In-browser execution via Skulpt
   ========================================================================= */

/* ----------------------------- Toolbox ---------------------------------- */
const TOOLBOX_XML = `
<xml>
  <category name="Logic" colour="%{BKY_LOGIC_HUE}">
    <block type="controls_if"></block>
    <block type="logic_compare"></block>
    <block type="logic_operation"></block>
    <block type="logic_negate"></block>
    <block type="logic_boolean"></block>
    <block type="logic_null"></block>
    <block type="logic_ternary"></block>
  </category>

  <category name="Loops" colour="%{BKY_LOOPS_HUE}">
    <block type="controls_repeat_ext">
      <value name="TIMES"><shadow type="math_number"><field name="NUM">5</field></shadow></value>
    </block>
    <block type="controls_repeat"></block>
    <block type="controls_whileUntil"></block>
    <block type="controls_for">
      <value name="FROM"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
      <value name="TO"><shadow type="math_number"><field name="NUM">10</field></shadow></value>
      <value name="BY"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
    </block>
    <block type="controls_forEach"></block>
    <block type="controls_flow_statements"></block>
  </category>

  <category name="Math" colour="%{BKY_MATH_HUE}">
    <block type="math_number"></block>
    <block type="math_arithmetic"></block>
    <block type="math_single"></block>
    <block type="math_number_property"></block>
    <block type="math_round"></block>
    <block type="math_modulo"></block>
    <block type="math_constrain">
      <value name="LOW"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
      <value name="HIGH"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
    </block>
    <block type="math_random_int">
      <value name="FROM"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
      <value name="TO"><shadow type="math_number"><field name="NUM">6</field></shadow></value>
    </block>
    <block type="math_random_float"></block>
  </category>

  <category name="Text" colour="%{BKY_TEXTS_HUE}">
    <block type="text"></block>
    <block type="text_join"></block>
    <block type="text_append"></block>
    <block type="text_length"></block>
    <block type="text_isEmpty"></block>
    <block type="text_indexOf">
      <value name="VALUE"><block type="variables_get"><field name="VAR">text</field></block></value>
    </block>
    <block type="text_charAt">
      <value name="VALUE"><block type="variables_get"><field name="VAR">text</field></block></value>
    </block>
    <block type="text_getSubstring">
      <value name="STRING"><block type="variables_get"><field name="VAR">text</field></block></value>
    </block>
    <block type="text_changeCase"></block>
    <block type="text_trim"></block>
    <block type="text_print"></block>
    <block type="text_prompt_ext">
      <value name="TEXT"><shadow type="text"><field name="TEXT">Enter a value</field></shadow></value>
    </block>
  </category>

  <category name="Data Structures" colour="210">
    <block type="lists_create_with"></block>
    <block type="lists_repeat">
      <value name="NUM"><shadow type="math_number"><field name="NUM">3</field></shadow></value>
    </block>
    <block type="lists_length"></block>
    <block type="lists_isEmpty"></block>
    <block type="lists_indexOf"></block>
    <block type="lists_getIndex"></block>
    <block type="lists_setIndex"></block>
    <block type="lists_getSublist"></block>
    <block type="lists_split"></block>
    <block type="lists_sort"></block>
    <block type="lists_reverse"></block>
    <label text="Dictionaries"></label>
    <block type="dict_create_empty"></block>
    <block type="dict_create_pairs"></block>
    <block type="dict_get"></block>
    <block type="dict_set"></block>
    <label text="Sets"></label>
    <block type="set_create"></block>
    <block type="set_add"></block>
    <block type="tuple_create"></block>
  </category>

  <category name="Robot" colour="160">
    <block type="robot_forward">
      <value name="STEPS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
    </block>
    <block type="robot_backward">
      <value name="STEPS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
    </block>
    <block type="robot_turn_left"></block>
    <block type="robot_turn_right"></block>
    <block type="robot_pen"></block>
    <block type="robot_repeat_square"></block>
  </category>

  <category name="Variables" colour="%{BKY_VARIABLES_HUE}" custom="VARIABLE"></category>
  <category name="Functions" colour="%{BKY_PROCEDURES_HUE}" custom="PROCEDURE"></category>
</xml>`;

/* --------------------- Custom Data-Structure Blocks --------------------- */
function registerCustomBlocks() {
    // Empty dictionary
    Blockly.Blocks['dict_create_empty'] = {
        init() {
            this.appendDummyInput().appendField('create empty dictionary');
            this.setOutput(true, 'Dictionary');
            this.setColour(210);
            this.setTooltip('Returns an empty dictionary {}');
        }
    };
    Blockly.Python['dict_create_empty'] = () => ['{}', Blockly.Python.ORDER_ATOMIC];

    // Dictionary from key/value pairs (two entries, extendable)
    Blockly.Blocks['dict_create_pairs'] = {
        init() {
            this.appendValueInput('KEY0').setCheck(null).appendField('dictionary with key');
            this.appendValueInput('VAL0').setCheck(null).appendField('value');
            this.appendValueInput('KEY1').setCheck(null).appendField('key');
            this.appendValueInput('VAL1').setCheck(null).appendField('value');
            this.setInputsInline(false);
            this.setOutput(true, 'Dictionary');
            this.setColour(210);
            this.setTooltip('Create a dictionary from key/value pairs');
        }
    };
    Blockly.Python['dict_create_pairs'] = (block) => {
        const k0 = Blockly.Python.valueToCode(block, 'KEY0', Blockly.Python.ORDER_NONE) || '0';
        const v0 = Blockly.Python.valueToCode(block, 'VAL0', Blockly.Python.ORDER_NONE) || '0';
        const k1 = Blockly.Python.valueToCode(block, 'KEY1', Blockly.Python.ORDER_NONE) || '0';
        const v1 = Blockly.Python.valueToCode(block, 'VAL1', Blockly.Python.ORDER_NONE) || '0';
        return [`{${k0}: ${v0}, ${k1}: ${v1}}`, Blockly.Python.ORDER_ATOMIC];
    };

    // dict[key]
    Blockly.Blocks['dict_get'] = {
        init() {
            this.appendValueInput('DICT').setCheck('Dictionary').appendField('in dictionary');
            this.appendValueInput('KEY').setCheck(null).appendField('get key');
            this.setInputsInline(true);
            this.setOutput(true, null);
            this.setColour(210);
            this.setTooltip('Get the value for a key');
        }
    };
    Blockly.Python['dict_get'] = (block) => {
        const d = Blockly.Python.valueToCode(block, 'DICT', Blockly.Python.ORDER_MEMBER) || '{}';
        const k = Blockly.Python.valueToCode(block, 'KEY', Blockly.Python.ORDER_NONE) || '0';
        return [`${d}[${k}]`, Blockly.Python.ORDER_MEMBER];
    };

    // dict[key] = value
    Blockly.Blocks['dict_set'] = {
        init() {
            this.appendValueInput('DICT').setCheck('Dictionary').appendField('set in dictionary');
            this.appendValueInput('KEY').setCheck(null).appendField('key');
            this.appendValueInput('VALUE').setCheck(null).appendField('to');
            this.setInputsInline(true);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(210);
            this.setTooltip('Set the value for a key');
        }
    };
    Blockly.Python['dict_set'] = (block) => {
        const d = Blockly.Python.valueToCode(block, 'DICT', Blockly.Python.ORDER_MEMBER) || '{}';
        const k = Blockly.Python.valueToCode(block, 'KEY', Blockly.Python.ORDER_NONE) || '0';
        const v = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) || '0';
        return `${d}[${k}] = ${v}\n`;
    };

    // set()
    Blockly.Blocks['set_create'] = {
        init() {
            this.appendDummyInput().appendField('create empty set');
            this.setOutput(true, 'Set');
            this.setColour(200);
            this.setTooltip('Returns an empty set()');
        }
    };
    Blockly.Python['set_create'] = () => ['set()', Blockly.Python.ORDER_ATOMIC];

    // set.add(value)
    Blockly.Blocks['set_add'] = {
        init() {
            this.appendValueInput('SET').setCheck('Set').appendField('add to set');
            this.appendValueInput('ITEM').setCheck(null).appendField('item');
            this.setInputsInline(true);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(200);
        }
    };
    Blockly.Python['set_add'] = (block) => {
        const s = Blockly.Python.valueToCode(block, 'SET', Blockly.Python.ORDER_MEMBER) || 'set()';
        const i = Blockly.Python.valueToCode(block, 'ITEM', Blockly.Python.ORDER_NONE) || '0';
        return `${s}.add(${i})\n`;
    };

    // tuple (a, b, c)
    Blockly.Blocks['tuple_create'] = {
        init() {
            this.appendValueInput('A').setCheck(null).appendField('tuple with');
            this.appendValueInput('B').setCheck(null).appendField('and');
            this.appendValueInput('C').setCheck(null).appendField('and');
            this.setInputsInline(false);
            this.setOutput(true, 'Tuple');
            this.setColour(190);
            this.setTooltip('Create a tuple of up to 3 items');
        }
    };
    Blockly.Python['tuple_create'] = (block) => {
        const a = Blockly.Python.valueToCode(block, 'A', Blockly.Python.ORDER_NONE) || '0';
        const b = Blockly.Python.valueToCode(block, 'B', Blockly.Python.ORDER_NONE) || '0';
        const c = Blockly.Python.valueToCode(block, 'C', Blockly.Python.ORDER_NONE) || '0';
        return [`(${a}, ${b}, ${c})`, Blockly.Python.ORDER_ATOMIC];
    };

    /* ----------------------- Robot movement blocks ----------------------- */
    // avancer de N pas
    Blockly.Blocks['robot_forward'] = {
        init() {
            this.appendValueInput('STEPS').setCheck('Number').appendField('avancer de');
            this.appendDummyInput().appendField('pas');
            this.setInputsInline(true);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(160);
            this.setTooltip('Move the robot forward N cells');
        }
    };
    Blockly.Python['robot_forward'] = (block) => {
        const n = Blockly.Python.valueToCode(block, 'STEPS', Blockly.Python.ORDER_NONE) || '1';
        return `move_forward(${n})\n`;
    };

    // reculer de N pas
    Blockly.Blocks['robot_backward'] = {
        init() {
            this.appendValueInput('STEPS').setCheck('Number').appendField('reculer de');
            this.appendDummyInput().appendField('pas');
            this.setInputsInline(true);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(160);
            this.setTooltip('Move the robot backward N cells');
        }
    };
    Blockly.Python['robot_backward'] = (block) => {
        const n = Blockly.Python.valueToCode(block, 'STEPS', Blockly.Python.ORDER_NONE) || '1';
        return `move_backward(${n})\n`;
    };

    // pivoter à gauche 90°
    Blockly.Blocks['robot_turn_left'] = {
        init() {
            this.appendDummyInput().appendField('pivoter à gauche 90°');
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(160);
            this.setTooltip('Turn the robot 90° to the left');
        }
    };
    Blockly.Python['robot_turn_left'] = () => 'turn_left()\n';

    // pivoter à droite 90°
    Blockly.Blocks['robot_turn_right'] = {
        init() {
            this.appendDummyInput().appendField('pivoter à droite 90°');
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(160);
            this.setTooltip('Turn the robot 90° to the right');
        }
    };
    Blockly.Python['robot_turn_right'] = () => 'turn_right()\n';

    // couleur du chemin
    Blockly.Blocks['robot_pen'] = {
        init() {
            this.appendDummyInput()
                .appendField('couleur du chemin')
                .appendField(new Blockly.FieldColour('#6ee7ff'), 'COLOR');
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(160);
            this.setTooltip('Change the path colour');
        }
    };
    Blockly.Python['robot_pen'] = (block) => {
        const c = block.getFieldValue('COLOR');
        return `set_pen_color('${c}')\n`;
    };

    // draw a square (helper)
    Blockly.Blocks['robot_repeat_square'] = {
        init() {
            this.appendValueInput('SIDE').setCheck('Number').appendField('carré de côté');
            this.appendDummyInput().appendField('pas');
            this.setInputsInline(true);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(160);
            this.setTooltip('Draw a square of the given side length');
        }
    };
    Blockly.Python['robot_repeat_square'] = (block) => {
        const s = Blockly.Python.valueToCode(block, 'SIDE', Blockly.Python.ORDER_NONE) || '1';
        return `draw_square(${s})\n`;
    };
}

/* ----------------------------- Init Blockly ----------------------------- */
let workspace;

function initBlockly() {
    registerCustomBlocks();

    workspace = Blockly.inject('blocklyDiv', {
        toolbox: TOOLBOX_XML,
        grid: { spacing: 22, length: 3, colour: 'rgba(255,255,255,0.08)', snap: true },
        zoom: { controls: true, wheel: true, startScale: 0.95, maxScale: 2, minScale: 0.4 },
        trashcan: true,
        renderer: 'zelos',
        sounds: false,
        theme: blocklyTheme()
    });

    workspace.addChangeListener(onWorkspaceChange);
    generateCode();
}

/* Modern Blockly theme */
function blocklyTheme() {
    return Blockly.Theme.defineTheme('modernDark', {
        name: 'modernDark',
        base: Blockly.Themes.Classic,
        blockStyles: {
            logic_blocks: { colourPrimary: '#7c83ff' },
            loop_blocks: { colourPrimary: '#26c6da' },
            math_blocks: { colourPrimary: '#ffb74d' },
            text_blocks: { colourPrimary: '#ff8a65' },
            list_blocks: { colourPrimary: '#4db6ac' },
            variable_blocks: { colourPrimary: '#ba68c8' },
            procedure_blocks: { colourPrimary: '#9575cd' }
        },
        componentStyles: {
            workspaceBackgroundColour: '#0e1530',
            toolboxBackgroundColour: '#0c1230',
            toolboxForegroundColour: '#cdd6f4',
            flyoutBackgroundColour: '#0c1230',
            flyoutForegroundColour: '#cdd6f4',
            scrollbarColour: '#33406b',
            insertionMarkerColour: '#6ee7ff',
            cursorColour: '#a78bfa'
        }
    });
}

/* --------------------------- Code generation ---------------------------- */
const pythonEl = document.getElementById('pythonCode');

function generateCode() {
    let code = Blockly.Python.workspaceToCode(workspace);
    pythonEl.innerHTML = code.trim() ? highlightPython(code) : '<code># Your Python code will appear here...</code>';
    return code;
}

function onWorkspaceChange(event) {
    if (event.isUiEvent) return;
    generateCode();
}

/* ----------------------------- Syntax highlight ------------------------- */
function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlightPython(code) {
    const keywords = ['def','return','if','elif','else','for','while','in','not','and','or','import','from','as','class','try','except','finally','with','lambda','yield','pass','break','continue','global','nonlocal','raise','assert','del','is','None','True','False','async','await'];
    const builtins = ['print','len','range','int','float','str','list','dict','set','tuple','input','sum','min','max','sorted','open','type','abs','round','enumerate','zip','map','filter','bool'];
    let out = '';
    const re = /(#.*$)|("""[\s\S]*?"""|'''[\s\S]*?'''|"[^"\n]*"|'[^'\n]*')|(\b\d+\.?\d*\b)|([A-Za-z_]\w*)|(\s+)|(\W)/gm;
    let m;
    while ((m = re.exec(code)) !== null) {
        if (m[1]) out += `<span class="tok-com">${escapeHtml(m[1])}</span>`;
        else if (m[2]) out += `<span class="tok-str">${escapeHtml(m[2])}</span>`;
        else if (m[3]) out += `<span class="tok-num">${escapeHtml(m[3])}</span>`;
        else if (m[4]) {
            const w = m[4];
            if (keywords.includes(w)) out += `<span class="tok-kw">${w}</span>`;
            else if (builtins.includes(w)) out += `<span class="tok-builtin">${w}</span>`;
            else {
                const after = code[re.lastIndex];
                out += (after === '(') ? `<span class="tok-fn">${w}</span>` : escapeHtml(w);
            }
        }
        else out += escapeHtml(m[0]);
    }
    return out;
}

/* ----------------------------- Run with Skulpt -------------------------- */
const consoleEl = document.getElementById('consoleOut');
const statusDot = document.getElementById('statusDot');
const runBtn = document.getElementById('runBtn');

function outf(text) {
    consoleEl.innerHTML += escapeHtml(text).replace(/\n/g, '<br>');
}

function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles['files'][x] === undefined)
        throw new Error("File not found: '" + x + "'");
    return Sk.builtinFiles['files'][x];
}

function runCode() {
    const code = generateCode();
    consoleEl.hidden = false;
    consoleEl.innerHTML = '';
    document.querySelector('.tab[data-tab="console"]').click();
    statusDot.className = 'tab-status running';

    if (typeof Sk === 'undefined') {
        consoleEl.innerHTML = '<span class="err">Skulpt failed to load (no internet?). Showing code only.</span>';
        statusDot.className = 'tab-status err';
        return;
    }

    Sk.configure({ output: outf, read: builtinRead, __future__: Sk.python3 });
    const hasRobot = workspace.getAllBlocks().some((b) => b.type.startsWith('robot_'));
    const preamble = hasRobot ? ROBOT_PYTHON_HELPERS : '';
    Sk.misceval.asyncToPromise(() => Sk.importMainWithBody('<stdin>', false, preamble + code, true))
        .then(() => { statusDot.className = 'tab-status ok'; })
        .catch((err) => {
            consoleEl.innerHTML += `<span class="err">\n${escapeHtml(String(err))}</span>`;
            statusDot.className = 'tab-status err';
        });
}

const ROBOT_PYTHON_HELPERS = `
def move_forward(steps):
    print('robot: move forward', steps)
def move_backward(steps):
    print('robot: move backward', steps)
def turn_left():
    print('robot: turn left 90')
def turn_right():
    print('robot: turn right 90')
def set_pen_color(c):
    print('robot: pen', c)
def draw_square(side):
    for _ in range(4):
        move_forward(side)
        turn_right()
`;

/* ------------------------------ UI wiring ------------------------------- */
function wireUI() {
    runBtn.addEventListener('click', runCode);
    document.getElementById('genBtn').addEventListener('click', generateCode);
    document.getElementById('clearBtn').addEventListener('click', () => {
        workspace.clear();
        generateCode();
        consoleEl.innerHTML = '&gt; Workspace cleared.';
    });
    document.getElementById('sampleBtn').addEventListener('click', loadSample);

    // Tabs
    const panelMap = { python: pythonEl, console: consoleEl, robot: document.getElementById('robotPane') };
    document.querySelectorAll('.tab').forEach((tab) => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
            tab.classList.add('active');
            Object.values(panelMap).forEach((el) => { el.hidden = true; });
            panelMap[tab.dataset.tab].hidden = false;
            if (tab.dataset.tab === 'robot') { initRobotCanvas(); Robot.draw(); }
        });
    });

    // Robot controls
    document.getElementById('robotRun').addEventListener('click', runRobot);
    document.getElementById('robotReset').addEventListener('click', () => {
        initRobotCanvas();
        Robot.reset();
        Robot.draw();
    });

    // Resizer
    const resizer = document.getElementById('resizer');
    const pane = document.getElementById('blocklyPane');
    const codePane = document.querySelector('.code-pane');
    let dragging = false;
    resizer.addEventListener('mousedown', () => { dragging = true; document.body.style.cursor = 'col-resize'; });
    window.addEventListener('mouseup', () => { dragging = false; document.body.style.cursor = ''; });
    window.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        const area = document.querySelector('.workspace-area');
        const rect = area.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const pct = Math.min(80, Math.max(25, (x / rect.width) * 100));
        pane.style.flex = `0 0 ${pct}%`;
        codePane.style.flex = `1 1 ${100 - pct}%`;
        Blockly.svgResize(workspace);
    });

    // Resize handling
    function onResize() {
        Blockly.svgResize(workspace);
        if (!document.getElementById('robotPane').hidden && Robot.canvas) {
            Robot.size();
            Robot.reset();
            Robot.draw();
        }
    }
    window.addEventListener('resize', onResize);
    new ResizeObserver(onResize).observe(document.querySelector('.workspace-area'));
}

/* ------------------------------ Robot simulator ------------------------- */
const Robot = {
    cell: 30,
    cols: 20,
    rows: 20,
    x: 10,
    y: 10,
    dir: 0,            // 0=up, 1=right, 2=down, 3=left
    pen: '#6ee7ff',
    trail: [],         // {x1,y1,x2,y2,color}
    canvas: null,
    ctx: null,
    timer: null,

    size() {
        const c = this.canvas;
        const w = c.parentElement.clientWidth;
        const h = c.parentElement.clientHeight - c.previousElementSibling.offsetHeight;
        this.cols = Math.max(8, Math.floor(w / this.cell));
        this.rows = Math.max(8, Math.floor(h / this.cell));
        c.width = this.cols * this.cell;
        c.height = this.rows * this.cell;
    },

    reset() {
        this.x = Math.floor(this.cols / 2);
        this.y = Math.floor(this.rows / 2);
        this.dir = 0;
        this.pen = '#6ee7ff';
        this.trail = [];
    },

    step(dx, dy, n) {
        for (let i = 0; i < n; i++) {
            const nx = this.x + dx;
            const ny = this.y + dy;
            if (nx < 0 || ny < 0 || nx >= this.cols || ny >= this.rows) break;
            this.trail.push({ x1: this.x, y1: this.y, x2: nx, y2: ny, color: this.pen });
            this.x = nx;
            this.y = ny;
        }
    },

    forward(n) { this.step(0, -1, n); },
    backward(n) { this.step(0, 1, n); },
    left() { this.dir = (this.dir + 3) % 4; },
    right() { this.dir = (this.dir + 1) % 4; },
    setColor(c) { this.pen = c; },

    draw() {
        const ctx = this.ctx;
        if (!ctx) return;
        const cell = this.cell;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // grid
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= this.cols; i++) {
            ctx.beginPath(); ctx.moveTo(i * cell, 0); ctx.lineTo(i * cell, this.rows * cell); ctx.stroke();
        }
        for (let j = 0; j <= this.rows; j++) {
            ctx.beginPath(); ctx.moveTo(0, j * cell); ctx.lineTo(this.cols * cell, j * cell); ctx.stroke();
        }

        // trail
        ctx.lineWidth = Math.max(3, cell * 0.28);
        ctx.lineCap = 'round';
        for (const s of this.trail) {
            ctx.strokeStyle = s.color;
            ctx.beginPath();
            ctx.moveTo(s.x1 * cell + cell / 2, s.y1 * cell + cell / 2);
            ctx.lineTo(s.x2 * cell + cell / 2, s.y2 * cell + cell / 2);
            ctx.stroke();
        }

        // robot
        const cx = this.x * cell + cell / 2;
        const cy = this.y * cell + cell / 2;
        const r = cell * 0.34;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(this.dir * Math.PI / 2);
        ctx.fillStyle = '#0e1530';
        ctx.strokeStyle = '#a78bfa';
        ctx.lineWidth = 2;
        roundRect(ctx, -r, -r, r * 2, r * 2, 6);
        ctx.fill();
        ctx.stroke();
        // eyes
        ctx.fillStyle = '#6ee7ff';
        ctx.beginPath(); ctx.arc(-r * 0.4, -r * 0.25, r * 0.16, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(r * 0.4, -r * 0.25, r * 0.16, 0, Math.PI * 2); ctx.fill();
        // direction triangle (pointing up)
        ctx.fillStyle = '#f472b6';
        ctx.beginPath();
        ctx.moveTo(0, -r * 1.05);
        ctx.lineTo(-r * 0.35, -r * 0.55);
        ctx.lineTo(r * 0.35, -r * 0.55);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
};

function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}

function initRobotCanvas() {
    Robot.canvas = document.getElementById('robotCanvas');
    Robot.ctx = Robot.canvas.getContext('2d');
    Robot.size();
    Robot.reset();
}

function evalNum(b, def) {
    if (!b) return def || 0;
    switch (b.type) {
        case 'math_number': return parseFloat(b.getFieldValue('NUM')) || 0;
        case 'math_arithmetic': {
            const a = evalNum(b.getInputTargetBlock('A')); const c = evalNum(b.getInputTargetBlock('B')); const op = b.getFieldValue('OP');
            return { ADD: a + c, MINUS: a - c, MULTIPLY: a * c, DIVIDE: c ? a / c : 0, POWER: Math.pow(a, c) }[op] || 0;
        }
        case 'math_single': {
            const a = evalNum(b.getInputTargetBlock('NUM')); const op = b.getFieldValue('OP');
            return { ROOT: Math.sqrt(a), ABS: Math.abs(a), NEG: -a, LN: Math.log(a), LOG10: Math.log10(a), EXP: Math.exp(a), POW10: Math.pow(10, a), SIN: Math.sin(a), COS: Math.cos(a), TAN: Math.tan(a) }[op] || 0;
        }
        case 'math_round': {
            const a = evalNum(b.getInputTargetBlock('NUM')); const op = b.getFieldValue('OP');
            return { ROUND: Math.round(a), ROUNDUP: Math.ceil(a), ROUNDDOWN: Math.floor(a) }[op] || 0;
        }
        case 'math_const': return { PI: Math.PI, E: Math.E, GOLDEN_RATIO: 1.618 }[b.getFieldValue('CONST')] || 0;
        default: return parseFloat(b.getFieldValue && b.getFieldValue('NUM')) || 0;
    }
}

function repeatCount(block) {
    if (block.type === 'controls_repeat') return Math.floor(parseFloat(block.getFieldValue('TIMES')) || 0);
    return Math.floor(evalNum(block.getInputTargetBlock('TIMES')) || 0);
}

function forCount(block) {
    const from = evalNum(block.getInputTargetBlock('FROM')) || 0;
    const to = evalNum(block.getInputTargetBlock('TO')) || 0;
    const by = evalNum(block.getInputTargetBlock('BY')) || 1;
    return Math.max(0, Math.floor((to - from) / (by || 1)) + 1);
}

function expand(block, out, env) {
    const t = block.type;
    if (t === 'robot_forward') { out.push({ op: 'forward', n: Math.max(1, Math.round(evalNum(block.getInputTargetBlock('STEPS'), 1))) }); }
    else if (t === 'robot_backward') { out.push({ op: 'backward', n: Math.max(1, Math.round(evalNum(block.getInputTargetBlock('STEPS'), 1))) }); }
    else if (t === 'robot_turn_left') { out.push({ op: 'left' }); }
    else if (t === 'robot_turn_right') { out.push({ op: 'right' }); }
    else if (t === 'robot_pen') { out.push({ op: 'pen', color: block.getFieldValue('COLOR') }); }
    else if (t === 'robot_repeat_square') {
        const s = Math.max(1, Math.round(evalNum(block.getInputTargetBlock('SIDE'), 1)));
        const seq = [
            { op: 'forward', n: s }, { op: 'right' },
            { op: 'forward', n: s }, { op: 'right' },
            { op: 'forward', n: s }, { op: 'right' },
            { op: 'forward', n: s }, { op: 'right' }
        ];
        seq.forEach((a) => out.push(a));
    }
    else if (t === 'controls_repeat' || t === 'controls_repeat_ext') {
        const cnt = repeatCount(block);
        const inner = block.getInputTargetBlock('DO');
        for (let k = 0; k < cnt; k++) walkChain(inner, out, env);
    }
    else if (t === 'controls_for') {
        const cnt = forCount(block);
        const inner = block.getInputTargetBlock('DO');
        for (let k = 0; k < cnt; k++) walkChain(inner, out, env);
    }
    else if (t === 'controls_whileUntil') {
        const inner = block.getInputTargetBlock('DO');
        for (let k = 0; k < 60; k++) walkChain(inner, out, env);
    }
    else if (t === 'controls_if') {
        walkChain(block.getInputTargetBlock('DO0'), out, env);
        walkChain(block.getInputTargetBlock('DO1'), out, env);
    }
    // other blocks (text_print, variables_set, etc.) are ignored for the robot
}

function walkChain(block, out, env) {
    let b = block;
    while (b) { expand(b, out, env); b = b.getNextBlock(); }
}

function applyAction(a) {
    if (a.op === 'forward') Robot.forward(a.n);
    else if (a.op === 'backward') Robot.backward(a.n);
    else if (a.op === 'left') Robot.left();
    else if (a.op === 'right') Robot.right();
    else if (a.op === 'pen') Robot.setColor(a.color);
}

function runRobot() {
    const robotTab = document.querySelector('.tab[data-tab="robot"]');
    if (robotTab) robotTab.click();
    initRobotCanvas();
    Robot.reset();
    Robot.draw();
    const actions = [];
    workspace.getTopBlocks(true).forEach((top) => walkChain(top, actions, {}));
    let i = 0;
    if (Robot.timer) clearInterval(Robot.timer);
    Robot.timer = setInterval(() => {
        if (i >= actions.length) { clearInterval(Robot.timer); Robot.draw(); return; }
        applyAction(actions[i++]);
        Robot.draw();
    }, 320);
}

/* ------------------------------ Sample program -------------------------- */
function loadSample() {
    workspace.clear();
    const xml = `
    <xml xmlns="https://developers.google.com/blockly/xml">
      <variables>
        <variable id="scores" type="">scores</variable>
        <variable id="name" type="">name</variable>
      </variables>
      <block type="variables_set" id="1" x="40" y="40">
        <field name="VAR" id="scores">scores</field>
        <value name="VALUE"><block type="lists_create_with">
          <mutation items="3"></mutation>
          <value name="ADD0"><block type="math_number"><field name="NUM">90</field></block></value>
          <value name="ADD1"><block type="math_number"><field name="NUM">85</field></block></value>
          <value name="ADD2"><block type="math_number"><field name="NUM">77</field></block></value>
        </block></value>
      </block>
      <block type="variables_set" id="2" x="40" y="180">
        <field name="VAR" id="name">name</field>
        <value name="VALUE"><block type="text"><field name="TEXT">Ada</field></block></value>
      </block>
      <block type="text_print" id="3" x="40" y="300">
        <value name="TEXT"><block type="text_join">
          <mutation items="3"></mutation>
          <value name="ADD0"><block type="variables_get"><field name="VAR" id="name">name</field></block></value>
          <value name="ADD1"><block type="text"><field name="TEXT"> scored </field></block></value>
          <value name="ADD2"><block type="lists_indexOf">
            <field name="END">FIRST</field>
            <value name="VALUE"><block type="variables_get"><field name="VAR" id="scores">scores</field></block></value>
            <value name="FIND"><block type="math_number"><field name="NUM">90</field></block></value>
          </block></value>
        </block></value>
      </block>
      <block type="controls_for" id="4" x="40" y="440">
        <field name="VAR" id="i">i</field>
        <value name="FROM"><block type="math_number"><field name="NUM">1</field></block></value>
        <value name="TO"><block type="lists_length">
          <value name="VALUE"><block type="variables_get"><field name="VAR" id="scores">scores</field></block></value>
        </block></value>
        <value name="BY"><block type="math_number"><field name="NUM">1</field></block></value>
        <statement name="DO"><block type="text_print" id="5">
          <value name="TEXT"><block type="lists_getIndex">
            <mutation statement="false" at="true"></mutation>
            <field name="MODE">GET</field><field name="WHERE">FROM_START</field>
            <value name="VALUE"><block type="variables_get"><field name="VAR" id="scores">scores</field></block></value>
            <value name="AT"><block type="variables_get"><field name="VAR" id="i">i</field></block></value>
          </block></value>
        </block></statement>
      </block>
      <block type="robot_pen" id="r0" x="420" y="40">
        <field name="COLOR">#f472b6</field>
      </block>
      <block type="robot_repeat_square" id="r1" x="420" y="120">
        <value name="SIDE"><shadow type="math_number"><field name="NUM">3</field></shadow></value>
      </block>
    </xml>`;
    try {
        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), workspace);
    } catch (e) {
        console.warn('Sample load error', e);
    }
    generateCode();
}

/* --------------------------- Animated title ----------------------------- */
function animateTitle() {
    const el = document.getElementById('title');
    const text = 'Lire Python avec Amir Academy';
    el.innerHTML = '';
    [...text].forEach((ch, i) => {
        const span = document.createElement('span');
        if (ch === ' ') {
            span.className = 'space';
            span.innerHTML = '&nbsp;';
        } else {
            span.className = 'char';
            span.textContent = ch;
            span.style.animationDelay = `${0.25 + i * 0.05}s, ${i * 0.05}s`;
        }
        el.appendChild(span);
    });
}

/* -------------------------------- Boot ---------------------------------- */
window.addEventListener('DOMContentLoaded', () => {
    animateTitle();
    if (typeof Blockly === 'undefined') {
        document.getElementById('blocklyDiv').innerHTML =
            '<p style="padding:24px;color:#fb7185">Blockly failed to load. Check your internet connection.</p>';
        return;
    }
    initBlockly();
    wireUI();
});
