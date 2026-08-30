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
    <block type="robot_jump">
      <value name="STEPS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
    </block>
    <block type="robot_turn_left"></block>
    <block type="robot_turn_right"></block>
    <block type="robot_zoom_in"></block>
    <block type="robot_zoom_out"></block>
    <block type="robot_sound_forward"></block>
    <block type="robot_sound_backward"></block>
    <block type="robot_sound_turn_left"></block>
    <block type="robot_sound_turn_right"></block>
    <block type="robot_sound_jump"></block>
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
            this.setColour("#4B8BBE");
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
            this.setColour("#4B8BBE");
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
            this.setColour("#4B8BBE");
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
            this.setColour("#4B8BBE");
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
            this.setColour("#306998");
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
            this.setColour("#306998");
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
            this.setColour("#5B9BD5");
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
            this.setColour("#3776AB");
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
            this.setColour("#3776AB");
            this.setTooltip('Move the robot backward N cells');
        }
    };
    Blockly.Python['robot_backward'] = (block) => {
        const n = Blockly.Python.valueToCode(block, 'STEPS', Blockly.Python.ORDER_NONE) || '1';
        return `move_backward(${n})\n`;
    };

    // sauter par-dessus les cases / obstacles
    Blockly.Blocks['robot_jump'] = {
        init() {
            this.appendValueInput('STEPS').setCheck('Number').appendField('sauter de');
            this.appendDummyInput().appendField('cases');
            this.setInputsInline(true);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour("#3776AB");
            this.setTooltip('Jump over blocks and move forward without stopping on obstacles');
        }
    };
    Blockly.Python['robot_jump'] = (block) => {
        const n = Blockly.Python.valueToCode(block, 'STEPS', Blockly.Python.ORDER_NONE) || '1';
        return `jump(${n})\n`;
    };

    // pivoter à gauche 90°
    Blockly.Blocks['robot_turn_left'] = {
        init() {
            this.appendDummyInput().appendField('pivoter à gauche 90°');
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour("#3776AB");
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
            this.setColour("#3776AB");
            this.setTooltip('Turn the robot 90° to the right');
        }
    };
    Blockly.Python['robot_turn_right'] = () => 'turn_right()\n';

    // zoomer / dézoomer le chat
    Blockly.Blocks['robot_zoom_in'] = {
        init() {
            this.appendDummyInput().appendField('zoomer le chat');
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour('#8B5CF6');
            this.setTooltip('Zoom in the cat');
        }
    };
    Blockly.Python['robot_zoom_in'] = () => 'zoom_in()\n';

    Blockly.Blocks['robot_zoom_out'] = {
        init() {
            this.appendDummyInput().appendField('dézoomer le chat');
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour('#8B5CF6');
            this.setTooltip('Zoom out the cat');
        }
    };
    Blockly.Python['robot_zoom_out'] = () => 'zoom_out()\n';

    // son d'avancer / reculer / tourner / sauter
    const createMoveSoundBlock = (typeName, label) => {
        Blockly.Blocks[typeName] = {
            init() {
                this.appendDummyInput().appendField(label);
                this.setPreviousStatement(true);
                this.setNextStatement(true);
                this.setColour('#FFB703');
                this.setTooltip('Play a movement sound');
            }
        };
        Blockly.Python[typeName] = () => `${typeName}()\n`;
    };
    createMoveSoundBlock('robot_sound_forward', 'son avancer');
    createMoveSoundBlock('robot_sound_backward', 'son reculer');
    createMoveSoundBlock('robot_sound_turn_left', 'son tourner gauche');
    createMoveSoundBlock('robot_sound_turn_right', 'son tourner droite');
    createMoveSoundBlock('robot_sound_jump', 'son saut');

    // couleur du chemin
    Blockly.Blocks['robot_pen'] = {
        init() {
            this.appendDummyInput()
                .appendField('couleur du chemin')
                .appendField(new Blockly.FieldColour('#FFD43B'), 'COLOR');
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour("#3776AB");
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
            this.setColour("#3776AB");
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

    const isSmallScreen = window.matchMedia('(max-width: 860px)').matches;

    workspace = Blockly.inject('blocklyDiv', {
        toolbox: typeof window.allowedBlockTypes !== 'undefined' && window.allowedBlockTypes !== null
            ? savedToolbox(window.allowedBlockTypes, false)
            : TOOLBOX_XML,
        grid: { spacing: 22, length: 3, colour: 'rgba(255,255,255,0.08)', snap: true },
        zoom: {
            controls: true,
            wheel: true,
            startScale: isSmallScreen ? 0.16 : 0.95,
            maxScale: isSmallScreen ? 1.0 : 2,
            minScale: isSmallScreen ? 0.12 : 0.4,
            pinch: true
        },
        trashcan: true,
        renderer: 'zelos',
        sounds: false,
        theme: blocklyTheme()
    });

    if (isSmallScreen) {
        workspace.zoomToFit();
    }

    workspace.addChangeListener(onWorkspaceChange);
    generateCode();
}

function savedToolbox(allowedTypes, includeAllBlocks = false) {
    const source = new DOMParser().parseFromString(TOOLBOX_XML, 'text/xml');
    const saved = document.implementation.createDocument('', 'xml');
    const isPreviewPopup = document.body.dataset.preview === 'true';

    const buildCustomBlockNodes = (sourceCategory, doc) => {
        const customTypes = sourceCategory.getAttribute('custom') === 'PROCEDURE'
            ? ['procedures_defreturn', 'procedures_defnoreturn', 'procedures_callreturn', 'procedures_callnoreturn', 'procedures_ifreturn']
            : sourceCategory.getAttribute('custom') === 'VARIABLE'
                ? ['variables_get', 'variables_set']
                : [];

        return customTypes.map((type) => {
            const block = doc.createElement('block');
            block.setAttribute('type', type);
            return block;
        });
    };

    if (document.body.dataset.savedOnly === 'true' || document.body.classList.contains('editor-page')) {
        const categoryColours = {
            Logic: '#4B8BBE', Loops: '#3776AB', Math: '#2E6CA4', Text: '#5B9BD5',
            'Data Structures': '#FFD43B', Robot: '#3776AB', Variables: '#306998', Functions: '#3E7CB1'
        };
        Array.from(source.documentElement.children).forEach((sourceCategory) => {
            if (sourceCategory.tagName !== 'category') return;
            const blocks = [...sourceCategory.children].filter((block) =>
                block.tagName === 'block' && allowedTypes.includes(block.getAttribute('type'))
            );
            const matchingCustom = buildCustomBlockNodes(sourceCategory, saved).filter((block) =>
                allowedTypes.includes(block.getAttribute('type'))
            );
            if (!blocks.length && !matchingCustom.length) return;
            const category = saved.createElement('category');
            category.setAttribute('name', sourceCategory.getAttribute('name'));
            category.setAttribute('colour', categoryColours[sourceCategory.getAttribute('name')] || '#3776AB');
            [...blocks, ...matchingCustom].forEach((block) => category.appendChild(saved.importNode(block, true)));
            saved.documentElement.appendChild(category);
        });

        return saved.documentElement.outerHTML;
    }

    const category = saved.createElement('category');
    category.setAttribute('name', 'Saved');
    category.setAttribute('colour', '#3776AB');
    source.querySelectorAll('block').forEach((block) => {
        if (allowedTypes.includes(block.getAttribute('type'))) category.appendChild(saved.importNode(block, true));
    });
    saved.documentElement.appendChild(category);
    return saved.documentElement.outerHTML;
}

/* Modern Blockly theme — Python colours */
function blocklyTheme() {
    const lightEditor = document.body.classList.contains('editor-page');
    return Blockly.Theme.defineTheme(lightEditor ? 'modernLight' : 'modernDark', {
        name: lightEditor ? 'modernLight' : 'modernDark',
        base: Blockly.Themes.Classic,
        blockStyles: {
            logic_blocks: { colourPrimary: '#4B8BBE' },
            loop_blocks: { colourPrimary: '#3776AB' },
            math_blocks: { colourPrimary: '#2E6CA4' },
            text_blocks: { colourPrimary: '#5B9BD5' },
            list_blocks: { colourPrimary: '#FFD43B', textColour: '#15202b' },
            variable_blocks: { colourPrimary: '#306998' },
            procedure_blocks: { colourPrimary: '#3E7CB1' }
        },
        componentStyles: {
            workspaceBackgroundColour: lightEditor ? '#FFFFFF' : '#0b1326',
            toolboxBackgroundColour: lightEditor ? '#F8FAFC' : '#0a1124',
            toolboxForegroundColour: lightEditor ? '#111827' : '#dbe6f5',
            flyoutBackgroundColour: lightEditor ? '#FFFFFF' : '#0a1124',
            flyoutForegroundColour: lightEditor ? '#111827' : '#dbe6f5',
            scrollbarColour: lightEditor ? '#CBD5E1' : '#2a3f5f',
            insertionMarkerColour: '#FFD43B',
            cursorColour: '#4B8BBE'
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

/* --------------------------- Export code (PDF / .py) --------------------- */
function currentPython() {
    return Blockly.Python.workspaceToCode(workspace) || '# (espace de travail vide)';
}

function downloadPy() {
    const code = currentPython();
    const blob = new Blob([code], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'python-code.py';
    a.click();
    URL.revokeObjectURL(url);
}

function downloadPDF() {
    if (typeof window.jspdf === 'undefined') {
        consoleEl.hidden = false;
        document.querySelector('.tab[data-tab="console"]').click();
        consoleEl.innerHTML = '<span class="err">jsPDF n\'est pas chargé (pas de connexion internet ?).</span>';
        return;
    }
    const code = currentPython();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const margin = 40;
    const lineH = 15;
    const maxW = doc.internal.pageSize.getWidth() - margin * 2;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(48, 106, 171);
    doc.text('Lire Python avec Amir Academy', margin, margin);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(new Date().toLocaleString(), margin, margin + 16);

    doc.setDrawColor(220);
    doc.line(margin, margin + 26, doc.internal.pageSize.getWidth() - margin, margin + 26);

    doc.setFont('courier', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(20);

    const lines = doc.splitTextToSize(code, maxW);
    let y = margin + 26 + lineH + 4;
    const pageH = doc.internal.pageSize.getHeight();
    for (const ln of lines) {
        if (y > pageH - margin) { doc.addPage(); y = margin; }
        doc.text(ln, margin, y);
        y += lineH;
    }
    doc.save('python-code.pdf');
}

/* ------------------------------ UI wiring ------------------------------- */
function hasRobotCategoryInToolbox() {
    const source = new DOMParser().parseFromString(
        (window.allowedBlockTypes && Array.isArray(window.allowedBlockTypes) ? savedToolbox(window.allowedBlockTypes, false) : TOOLBOX_XML),
        'text/xml'
    );
    return Array.from(source.documentElement.children).some((category) => category.tagName === 'category' && category.getAttribute('name') === 'Robot');
}

function syncRobotTabVisibility() {
    const robotTab = document.querySelector('.tab[data-tab="robot"]');
    if (!robotTab) return;

    const isVisible = hasRobotCategoryInToolbox();
    robotTab.hidden = !isVisible;

    if (!isVisible && robotTab.classList.contains('active')) {
        const pythonTab = document.querySelector('.tab[data-tab="python"]');
        if (pythonTab) {
            pythonTab.click();
        }
    }
}

function wireUI() {
    const accountMenuBtn = document.getElementById('accountMenuBtn');
    const accountMenu = document.getElementById('accountMenu');
    const toolboxToggleBtn = document.getElementById('toolboxToggleBtn');
    const toolbox = document.querySelector('.blocklyToolboxDiv');
    const isSmallScreen = window.matchMedia('(max-width: 860px)').matches;
    const debugBtn = document.getElementById('debugBtn');
    const debugModal = document.getElementById('debugModal');
    const debugCodeLines = document.getElementById('debugCodeLines');
    const debugState = document.getElementById('debugState');
    const debugNextBtn = document.getElementById('debugNextBtn');
    const debugPrevBtn = document.getElementById('debugPrevBtn');

    function escapeHtml(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function normalizeValue(value) {
        if (Array.isArray(value)) return value.map(normalizeValue);
        if (typeof value === 'string') {
            const trimmed = value.trim();
            if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) return trimmed.slice(1, -1);
            return trimmed;
        }
        return value;
    }

    function parseSimpleValue(raw, state) {
        const expr = (raw || '').trim();
        if (!expr) return '';
        if (expr.startsWith('[') && expr.endsWith(']')) {
            const inner = expr.slice(1, -1).trim();
            if (!inner) return [];
            const items = inner.split(',').map((part) => parseSimpleValue(part, state));
            return items;
        }
        if ((expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'"))) return expr.slice(1, -1);
        if (/^-?\d+(\.\d+)?$/.test(expr)) return Number(expr);
        if (expr === 'True') return true;
        if (expr === 'False') return false;
        if (expr === 'None') return null;
        if (Object.prototype.hasOwnProperty.call(state, expr)) return state[expr];
        return expr;
    }

    function formatValue(value) {
        if (Array.isArray(value)) return '[' + value.map((item) => formatValue(item)).join(', ') + ']';
        if (typeof value === 'string') return '"' + value + '"';
        if (value === null) return 'None';
        if (typeof value === 'boolean') return value ? 'True' : 'False';
        return String(value);
    }

    function prettyDisplayValue(value) {
        if (Array.isArray(value)) return value.map((item) => prettyDisplayValue(item)).join(', ');
        if (typeof value === 'string') return value;
        if (value === null) return 'None';
        if (typeof value === 'boolean') return value ? 'True' : 'False';
        return String(value);
    }

    function renderStatePanel(state, message) {
        const entries = Object.entries(state || {});
        const defaultMessage = message || 'Le programme est prêt à être observé ligne par ligne.';
        if (!entries.length) {
            debugState.innerHTML = '<div class="debug-state-box"><div class="debug-message">' + escapeHtml(defaultMessage) + '</div></div>';
            return;
        }

        const cards = entries.map(([key, value]) => {
            if (Array.isArray(value)) {
                const chips = value.map((item) => '<span>' + escapeHtml(prettyDisplayValue(item)) + '</span>').join('');
                return '<div class="debug-state-box"><h4>' + escapeHtml(key) + '</h4><div class="debug-list">' + chips + '</div></div>';
            }
            return '<div class="debug-state-box"><h4>' + escapeHtml(key) + '</h4><div class="debug-var-list"><span class="debug-var-node"><strong>' + escapeHtml(prettyDisplayValue(value)) + '</strong></span></div></div>';
        }).join('');

        debugState.innerHTML = cards + '<div class="debug-state-box"><div class="debug-message">' + escapeHtml(defaultMessage) + '</div></div>';
    }

    function buildDebugPreview(code) {
        const lines = code.split('\n');
        const state = {};
        const trace = [];

        lines.forEach((rawLine, index) => {
            const line = rawLine.trim();
            if (!line || line.startsWith('#')) return;

            if (/^print\s*\(.+\)$/.test(line)) {
                const inner = line.match(/^print\s*\((.*)\)$/)[1].trim();
                const value = parseSimpleValue(inner, state);
                const snapshot = JSON.parse(JSON.stringify(state));
                trace.push({
                    lineIndex: index,
                    line,
                    message: 'Affiche la valeur ' + formatValue(value) + '.',
                    state: snapshot,
                    output: value
                });
                return;
            }

            const assignment = line.match(/^([A-Za-z_]\w*)\s*=\s*(.+)$/);
            if (assignment) {
                const variableName = assignment[1];
                const value = parseSimpleValue(assignment[2], state);
                state[variableName] = value;
                trace.push({
                    lineIndex: index,
                    line,
                    message: 'La variable ' + variableName + ' reçoit ' + formatValue(value) + '.',
                    state: JSON.parse(JSON.stringify(state))
                });
                return;
            }

            if (/^for\s+[A-Za-z_][A-Za-z0-9_]*\s+in\s+.+:$/.test(line)) {
                const match = line.match(/^for\s+([A-Za-z_][A-Za-z0-9_]*)\s+in\s+(.+):$/);
                const iterVar = match[1];
                const source = parseSimpleValue(match[2], state);
                trace.push({
                    lineIndex: index,
                    line,
                    message: 'La boucle itère sur ' + formatValue(Array.isArray(source) ? source : [source]) + ' avec ' + iterVar + '.',
                    state: JSON.parse(JSON.stringify(state))
                });
                return;
            }

            trace.push({
                lineIndex: index,
                line,
                message: 'Exécution de la ligne : ' + line,
                state: JSON.parse(JSON.stringify(state))
            });
        });

        return { lines, trace, finalState: JSON.parse(JSON.stringify(state)) };
    }

    function openDebugModal() {
        const code = currentPython();
        const preview = buildDebugPreview(code || '# Le programme est vide.');
        let index = 0;

        const render = () => {
            const step = preview.trace[index] || preview.trace[preview.trace.length - 1] || {
                lineIndex: 0,
                line: '',
                message: 'Le programme est terminé.',
                state: preview.finalState
            };

            debugCodeLines.innerHTML = preview.lines.map((line, lineIndex) => {
                const active = lineIndex === step.lineIndex ? 'active' : '';
                const display = escapeHtml(line || '');
                return '<div class="debug-code-line ' + active + '"><span class="debug-line-no">' + (lineIndex + 1) + '</span><span>' + display + '</span></div>';
            }).join('');

            renderStatePanel(step.state || preview.finalState, step.message || 'Le programme est prêt.');
            debugPrevBtn.disabled = index === 0;
            debugNextBtn.textContent = index >= preview.trace.length - 1 ? 'Fin du programme' : 'Étape suivante';
        };

        debugNextBtn.onclick = () => {
            if (index < preview.trace.length - 1) {
                index += 1;
                render();
            } else {
                index = preview.trace.length - 1;
                render();
            }
        };

        debugPrevBtn.onclick = () => {
            if (index > 0) {
                index -= 1;
                render();
            }
        };

        debugModal.hidden = false;
        render();
    }

    if (debugBtn) {
        debugBtn.addEventListener('click', openDebugModal);
    }

    document.querySelectorAll('[data-debug-close]').forEach((btn) => {
        btn.addEventListener('click', () => {
            debugModal.hidden = true;
        });
    });

    function toggleToolboxMenu() {
        if (!toolbox) return;
        const shouldHide = !toolbox.classList.contains('is-hidden');
        toolbox.classList.toggle('is-hidden', shouldHide);
        toolbox.style.display = shouldHide ? 'none' : 'block';
        toolboxToggleBtn?.setAttribute('aria-pressed', String(!shouldHide));
        if (workspace) {
            workspace.resize();
            setTimeout(() => workspace.resize(), 50);
        }
    }

    if (toolboxToggleBtn) {
        toolboxToggleBtn.style.display = isSmallScreen ? 'inline-flex' : 'none';
        toolboxToggleBtn.addEventListener('click', toggleToolboxMenu);
    }

    accountMenuBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        accountMenu.hidden = !accountMenu.hidden;
        accountMenuBtn.setAttribute('aria-expanded', String(!accountMenu.hidden));
    });
    document.addEventListener('click', () => {
        accountMenu.hidden = true;
        accountMenuBtn.setAttribute('aria-expanded', 'false');
    });

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
    syncRobotTabVisibility();
    document.querySelectorAll('.tab').forEach((tab) => {
        tab.addEventListener('click', () => {
            if (tab.dataset.tab === 'robot' && tab.hidden) return;
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

    const challengeInput = document.getElementById('challengeTimeInput');
    const applyChallengeBtn = document.getElementById('applyChallengeBtn');
    const pokemonChallengeInput = document.getElementById('pokemonChallengeTimeInput');
    const applyPokemonChallengeBtn = document.getElementById('applyPokemonChallengeBtn');
    const classicModeBtn = document.getElementById('classicModeBtn');
    const pokemonModeBtn = document.getElementById('pokemonModeBtn');
    const pokemonGamePanel = document.getElementById('pokemonGamePanel');
    const pokemonStartBtn = document.getElementById('pokemonStartBtn');
    if (challengeInput && applyChallengeBtn) {
        applyChallengeBtn.addEventListener('click', () => {
            const value = Number(challengeInput.value);
            Robot.challengeSeconds = Number.isFinite(value) ? Math.min(120, Math.max(5, Math.round(value))) : 20;
            challengeInput.value = String(Robot.challengeSeconds);
            Robot.updateHud();
        });
    }
    if (pokemonChallengeInput && applyPokemonChallengeBtn) {
        applyPokemonChallengeBtn.addEventListener('click', () => {
            const value = Number(pokemonChallengeInput.value);
            Robot.pokemonDurationMs = Number.isFinite(value) ? Math.min(180, Math.max(5, Math.round(value))) * 1000 : 30000;
            pokemonChallengeInput.value = String(Math.round(Robot.pokemonDurationMs / 1000));
            if (Robot.mode === 'pokemon') {
                Robot.resetPokemonGame();
                Robot.startPokemonGame();
            }
        });
    }

    function setRobotMode(mode) {
        Robot.mode = mode;
        const isPokemon = mode === 'pokemon';
        if (classicModeBtn) classicModeBtn.classList.toggle('active', !isPokemon);
        if (pokemonModeBtn) pokemonModeBtn.classList.toggle('active', isPokemon);
        if (pokemonGamePanel) pokemonGamePanel.hidden = !isPokemon;
        if (isPokemon) {
            Robot.resetPokemonGame();
        } else {
            Robot.hidePokemonPopup();
            Robot.reset();
        }
        Robot.draw();
    }

    if (classicModeBtn) classicModeBtn.addEventListener('click', () => setRobotMode('classic'));
    if (pokemonModeBtn) pokemonModeBtn.addEventListener('click', () => setRobotMode('pokemon'));
    if (pokemonStartBtn) {
        pokemonStartBtn.addEventListener('click', () => {
            Robot.mode = 'pokemon';
            Robot.startPokemonGame();
            Robot.draw();
        });
    }

    // Download menu (PDF / .py)
    const menuBtn = document.getElementById('menuBtn');
    const menuList = document.getElementById('menuList');
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = menuList.hidden;
        menuList.hidden = !open;
        menuBtn.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', (e) => {
        if (!menuList.hidden && !menuList.contains(e.target) && e.target !== menuBtn) {
            menuList.hidden = true;
            menuBtn.setAttribute('aria-expanded', 'false');
        }
    });
    document.getElementById('dlPdf').addEventListener('click', () => { menuList.hidden = true; downloadPDF(); });
    document.getElementById('dlPy').addEventListener('click', () => { menuList.hidden = true; downloadPy(); });

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
    pen: '#FFD43B',
    trail: [],         // {x1,y1,x2,y2,color}
    visited: [],       // {x,y,color}
    obstacles: [],     // {x,y}
    flag: { x: 16, y: 3 },
    canvas: null,
    ctx: null,
    timer: null,
    elapsedMs: 0,
    startedAt: null,
    reachedFlag: false,
    blocked: false,
    losePopup: null,
    winPopup: null,
    challengeSeconds: 20,
    recordBroken: false,
    challengeCompleted: false,
    zoom: 1,
    mode: 'classic',
    pokemonTimer: null,
    pokemonStartedAt: null,
    pokemonDurationMs: 30000,
    pokemonBalls: [],
    pokemonCollected: 0,
    pokemonGoal: 6,
    pokemonPopup: null,

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
        this.x = 2;
        this.y = 2;
        this.dir = 0;
        this.renderX = 2;
        this.renderY = 2;
        this.renderDir = 0;
        this.pen = '#60A5FA';
        this.trail = [];
        this.visited = [{ x: this.x, y: this.y, color: 'rgba(59, 130, 246, 0.18)' }];
        this.mode = 'classic';
        this.obstacles = [
            { x: 5, y: 2 }, { x: 6, y: 2 }, { x: 7, y: 2 }, { x: 8, y: 2 },
            { x: 5, y: 4 }, { x: 5, y: 5 }, { x: 5, y: 6 },
            { x: 9, y: 6 }, { x: 10, y: 6 }, { x: 11, y: 6 },
            { x: 12, y: 9 }, { x: 12, y: 10 }, { x: 12, y: 11 },
            { x: 8, y: 12 }, { x: 9, y: 12 }, { x: 10, y: 12 },
            { x: 14, y: 6 }, { x: 14, y: 7 }, { x: 14, y: 8 }
        ];
        this.flag = { x: this.cols - 2, y: 2 };
        this.elapsedMs = 0;
        this.startedAt = null;
        this.reachedFlag = false;
        this.blocked = false;
        this.recordBroken = false;
        this.challengeCompleted = false;
        this.zoom = 1;
        this.hideLosePopup();
        this.hideWinPopup();
        this.updateHud();
    },

    showLosePopup(message = 'Le chat a touché un obstacle.') {
        if (!this.losePopup) {
            const popup = document.createElement('div');
            popup.className = 'robot-lose-popup';
            popup.innerHTML = `
                <div class="robot-lose-card">
                    <h3>Vous avez perdu</h3>
                    <p id="robotLoseMessage">Le chat a touché un obstacle.</p>
                    <button type="button" id="robotTryAgainBtn">Réessayer</button>
                </div>
            `;
            document.body.appendChild(popup);
            this.losePopup = popup;
            const retryBtn = document.getElementById('robotTryAgainBtn');
            retryBtn?.addEventListener('click', () => {
                this.hideLosePopup();
                initRobotCanvas();
                this.reset();
                this.draw();
            });
        }
        const loseMessage = this.losePopup.querySelector('#robotLoseMessage');
        if (loseMessage) loseMessage.textContent = message;
        this.losePopup.hidden = false;
    },

    hideLosePopup() {
        if (this.losePopup) this.losePopup.hidden = true;
    },

    showWinPopup(message = null) {
        if (!this.winPopup) {
            const popup = document.createElement('div');
            popup.className = 'robot-win-popup';
            popup.innerHTML = `
                <div class="robot-win-card">
                    <h3>Bravo !</h3>
                    <p id="robotWinMessage">Tu as réussi !</p>
                    <button type="button" id="robotWinBtn">OK</button>
                </div>
            `;
            document.body.appendChild(popup);
            this.winPopup = popup;
            const winBtn = document.getElementById('robotWinBtn');
            winBtn?.addEventListener('click', () => {
                this.hideWinPopup();
            });
        }
        const winMessage = this.winPopup.querySelector('#robotWinMessage');
        if (winMessage) {
            if (message) {
                winMessage.textContent = message;
            } else {
                const seconds = (this.elapsedMs / 1000).toFixed(1);
                const parts = [`Tu as réussi en ${seconds} s !`];
                if (this.recordBroken) parts.push('Nouveau top score !');
                if (this.challengeCompleted) parts.push(`Défi réussi : objectif ${this.challengeSeconds} s atteint !`);
                else parts.push(`Objectif : ${this.challengeSeconds} s.`);
                winMessage.textContent = parts.join(' ');
            }
        }
        this.winPopup.hidden = false;
    },

    hideWinPopup() {
        if (this.winPopup) this.winPopup.hidden = true;
    },

    hidePokemonPopup() {
        if (this.pokemonPopup) this.pokemonPopup.hidden = true;
    },

    updateHud() {
        const statusEl = document.getElementById('robotStatus');
        const timeEl = document.getElementById('robotTime');
        const bestEl = document.getElementById('robotBest');
        const goalEl = document.getElementById('robotGoal');
        if (!statusEl || !timeEl || !bestEl || !goalEl) return;

        const elapsed = this.startedAt ? (this.elapsedMs || (Date.now() - this.startedAt)) / 1000 : 0;
        const elapsedText = elapsed > 0 ? `${elapsed.toFixed(1)} s` : '0.0 s';
        const best = Number(localStorage.getItem('amir-best-time') || 0);
        const bestText = best > 0 ? `${best.toFixed(1)} s` : '—';

        statusEl.textContent = this.reachedFlag ? 'Mission réussie !' : this.blocked ? 'Obstacle bloqué !' : 'Parcours en cours';
        timeEl.textContent = `Temps: ${elapsedText}`;
        bestEl.textContent = `Top score: ${bestText}`;
        goalEl.textContent = `Objectif: ${this.challengeSeconds} s pour aller au drapeau`;
    },

    playMoveSound(kind) {
        const AudioCtor = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtor) return;
        const ctx = this.audioCtx || new AudioCtor();
        this.audioCtx = ctx;
        const freq = { forward: 220, backward: 180, left: 260, right: 320, jump: 440 }[kind] || 220;
        const t0 = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, t0);
        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.exponentialRampToValueAtTime(0.08, t0 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t0);
        osc.stop(t0 + 0.18);
    },

    animateTo(x, y, dir) {
        this.renderX = this.renderX ?? this.x;
        this.renderY = this.renderY ?? this.y;
        this.renderDir = this.renderDir ?? this.dir;
        const fromX = this.renderX;
        const fromY = this.renderY;
        const fromDir = this.renderDir;
        const start = performance.now();
        const duration = 420;
        const animate = (now) => {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 2.6);
            this.renderX = fromX + (x - fromX) * eased;
            this.renderY = fromY + (y - fromY) * eased;
            this.renderDir = fromDir + ((dir ?? this.dir) - fromDir) * eased;
            this.draw();
            if (p < 1) {
                requestAnimationFrame(animate);
            } else {
                this.renderX = x;
                this.renderY = y;
                this.renderDir = dir ?? this.dir;
            }
        };
        requestAnimationFrame(animate);
    },

    step(dx, dy, n, { ignoreObstacles = false } = {}) {
        for (let i = 0; i < n; i++) {
            const nx = this.x + dx;
            const ny = this.y + dy;
            const hitEdge = nx < 0 || ny < 0 || nx >= this.cols || ny >= this.rows;
            const hitObstacle = this.obstacles.some((cell) => cell.x === nx && cell.y === ny);
            if (hitEdge || (hitObstacle && !ignoreObstacles)) {
                this.blocked = true;
                this.showLosePopup(hitEdge ? 'Vous avez perdu : le chat a dépassé les bordures.' : 'Vous avez perdu');
                if (hitObstacle) {
                    this.obstacles = this.obstacles.map((cell) => {
                        if (cell.x === nx && cell.y === ny) {
                            return { ...cell, touched: true };
                        }
                        return cell;
                    });
                }
                break;
            }
            this.trail.push({ x1: this.x, y1: this.y, x2: nx, y2: ny, color: this.pen });
            this.visited.push({ x: nx, y: ny, color: this.pen });
            this.x = nx;
            this.y = ny;
            if (this.mode === 'pokemon') {
                const caughtBall = (this.pokemonBalls || []).find((ball) => !ball.collected && ball.x === this.x && ball.y === this.y);
                if (caughtBall) {
                    caughtBall.collected = true;
                    this.pokemonCollected += 1;
                    this.updatePokemonCollection();
                }
            }
            this.animateTo(nx, ny, this.dir);
            if (this.x === this.flag.x && this.y === this.flag.y) {
                this.reachedFlag = true;
                const current = this.elapsedMs / 1000;
                const best = Number(localStorage.getItem('amir-best-time') || 0);
                this.recordBroken = !best || current < best;
                if (this.recordBroken) {
                    localStorage.setItem('amir-best-time', String(current));
                }
                this.challengeCompleted = current <= this.challengeSeconds;
                this.showWinPopup();
                break;
            }
        }
    },

    directionVector() {
        const vectors = [
            { dx: 0, dy: -1 },
            { dx: 1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: -1, dy: 0 }
        ];
        return vectors[this.dir % 4];
    },

    moveRelative(sign, n, { ignoreObstacles = false } = {}) {
        const { dx, dy } = this.directionVector();
        this.step(dx * sign, dy * sign, n, { ignoreObstacles });
    },

    forward(n) { this.moveRelative(1, n); },
    backward(n) { this.moveRelative(-1, n); },
    jump(n) { this.moveRelative(1, n, { ignoreObstacles: true }); },
    zoomIn() { this.zoom = Math.min(1.8, Number((this.zoom || 1).toFixed(2)) + 0.15); },
    zoomOut() { this.zoom = Math.max(0.7, Number((this.zoom || 1).toFixed(2)) - 0.15); },
    left() { this.dir = (this.dir + 3) % 4; this.renderDir = this.dir; },
    right() { this.dir = (this.dir + 1) % 4; this.renderDir = this.dir; },
    setColor(c) { this.pen = c; },

    resetPokemonGame() {
        if (this.pokemonTimer) clearInterval(this.pokemonTimer);
        this.pokemonStartedAt = null;
        this.pokemonCollected = 0;
        this.pokemonGoal = 6;
        this.pokemonBalls = [];
        const positions = [
            { x: 3, y: 3 }, { x: 7, y: 5 }, { x: 10, y: 8 }, { x: 13, y: 5 }, { x: 15, y: 10 }, { x: 9, y: 14 },
            { x: 4, y: 12 }, { x: 17, y: 3 }, { x: 12, y: 17 }, { x: 18, y: 13 }
        ];
        for (const pos of positions) {
            if (!this.obstacles.some((obs) => obs.x === pos.x && obs.y === pos.y) && !(this.x === pos.x && this.y === pos.y)) {
                this.pokemonBalls.push({ ...pos, collected: false });
            }
            if (this.pokemonBalls.length >= this.pokemonGoal) break;
        }
        const scoreEl = document.getElementById('pokemonScore');
        const timerEl = document.getElementById('pokemonTimer');
        if (scoreEl) scoreEl.textContent = `Pokéballs: 0 / ${this.pokemonBalls.length}`;
        if (timerEl) timerEl.textContent = `Temps: ${(this.pokemonDurationMs / 1000).toFixed(0)} s`;
    },

    startPokemonGame() {
        this.mode = 'pokemon';
        this.resetPokemonGame();
        this.pokemonStartedAt = Date.now();
        this.pokemonTimer = setInterval(() => {
            const elapsed = Date.now() - this.pokemonStartedAt;
            const remainingMs = Math.max(0, this.pokemonDurationMs - elapsed);
            const timerEl = document.getElementById('pokemonTimer');
            if (timerEl) timerEl.textContent = `Temps: ${(remainingMs / 1000).toFixed(1)} s`;
            if (remainingMs <= 0) {
                clearInterval(this.pokemonTimer);
                this.pokemonTimer = null;
                if (this.pokemonCollected < this.pokemonBalls.length) {
                    this.showLosePopup('Temps écoulé ! Tu n\'as pas ramassé toutes les Pokéballs.');
                }
                return;
            }
            this.updatePokemonCollection();
        }, 100);
    },

    updatePokemonCollection() {
        const scoreEl = document.getElementById('pokemonScore');
        const balls = this.pokemonBalls || [];
        const collectedCount = balls.filter((ball) => ball.collected).length;
        if (scoreEl) scoreEl.textContent = `Pokéballs: ${collectedCount} / ${balls.length}`;
        if (collectedCount >= balls.length) {
            this.hideLosePopup();
            this.showWinPopup('Tu as ramassé toutes les Pokéballs avant le temps !');
            if (this.pokemonTimer) clearInterval(this.pokemonTimer);
            this.pokemonTimer = null;
        }
    },

    draw() {
        const ctx = this.ctx;
        if (!ctx) return;
        const cell = this.cell;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // clean grid canvas for step visibility
        ctx.fillStyle = '#F8FAFC';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i <= this.cols; i++) {
            const x = i * cell;
            ctx.strokeStyle = i % 5 === 0 ? 'rgba(59, 130, 246, 0.18)' : 'rgba(148, 163, 184, 0.22)';
            ctx.lineWidth = i % 5 === 0 ? 1.2 : 1;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.rows * cell);
            ctx.stroke();
        }
        for (let j = 0; j <= this.rows; j++) {
            const y = j * cell;
            ctx.strokeStyle = j % 5 === 0 ? 'rgba(59, 130, 246, 0.18)' : 'rgba(148, 163, 184, 0.22)';
            ctx.lineWidth = j % 5 === 0 ? 1.2 : 1;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.cols * cell, y);
            ctx.stroke();
        }

        // draw obstacle blocks
        for (const obstacle of this.obstacles) {
            const x = obstacle.x * cell;
            const y = obstacle.y * cell;
            ctx.fillStyle = obstacle.touched ? '#111827' : '#F87171';
            ctx.fillRect(x + 4, y + 4, cell - 8, cell - 8);
            ctx.strokeStyle = obstacle.touched ? '#000000' : '#B91C1C';
            ctx.lineWidth = obstacle.touched ? 3 : 1.5;
            ctx.strokeRect(x + 4, y + 4, cell - 8, cell - 8);
        }

        // draw flag goal
        const flagX = this.flag.x * cell + cell / 2;
        const flagY = this.flag.y * cell + cell / 2;
        ctx.fillStyle = '#111827';
        ctx.fillRect(flagX - cell * 0.16, flagY - cell * 0.7, 4, cell * 0.9);
        ctx.fillStyle = '#22C55E';
        ctx.beginPath();
        ctx.moveTo(flagX - cell * 0.15, flagY - cell * 0.42);
        ctx.lineTo(flagX + cell * 0.48, flagY - cell * 0.2);
        ctx.lineTo(flagX - cell * 0.15, flagY + cell * 0.05);
        ctx.closePath();
        ctx.fill();

        // visited squares = steps already taken
        for (const stepCell of this.visited) {
            const x = stepCell.x * cell;
            const y = stepCell.y * cell;
            ctx.fillStyle = stepCell.color || 'rgba(96, 165, 250, 0.22)';
            ctx.fillRect(x + 4, y + 4, cell - 8, cell - 8);
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.45)';
            ctx.strokeRect(x + 4, y + 4, cell - 8, cell - 8);
        }

        if (this.mode === 'pokemon') {
            for (const ball of this.pokemonBalls || []) {
                if (ball.collected) continue;
                const bx = ball.x * cell + cell / 2;
                const by = ball.y * cell + cell / 2;
                const radius = cell * 0.18;
                ctx.fillStyle = '#F59E0B';
                ctx.beginPath();
                ctx.arc(bx, by, radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(bx, by, radius * 0.6, 0, Math.PI * 2);
                ctx.fillStyle = '#FDE68A';
                ctx.fill();
                ctx.fillStyle = '#DC2626';
                ctx.fillRect(bx - radius * 0.8, by - radius * 0.15, radius * 1.6, radius * 0.3);
                ctx.strokeStyle = '#7C2D12';
                ctx.lineWidth = 2;
                ctx.strokeRect(bx - radius * 0.8, by - radius * 0.15, radius * 1.6, radius * 0.3);
            }
        }

        // current cell glow
        ctx.fillStyle = 'rgba(34, 197, 94, 0.2)';
        ctx.fillRect(this.x * cell + 3, this.y * cell + 3, cell - 6, cell - 6);

        // trail
        ctx.lineWidth = Math.max(3, cell * 0.24);
        ctx.lineCap = 'round';
        for (const s of this.trail) {
            ctx.strokeStyle = s.color || '#60A5FA';
            ctx.beginPath();
            ctx.moveTo(s.x1 * cell + cell / 2, s.y1 * cell + cell / 2);
            ctx.lineTo(s.x2 * cell + cell / 2, s.y2 * cell + cell / 2);
            ctx.stroke();
        }

        // modern 3D cat
        const cx = this.renderX * cell + cell / 2;
        const cy = this.renderY * cell + cell / 2;
        const size = cell * 0.72 * (this.zoom || 1);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(this.renderDir * Math.PI / 2);
        ctx.scale(this.zoom || 1, this.zoom || 1);

        // shadow
        ctx.fillStyle = 'rgba(15, 23, 42, 0.18)';
        ctx.beginPath();
        ctx.ellipse(0, size * 0.7, size * 0.56, size * 0.26, 0, 0, Math.PI * 2);
        ctx.fill();

        // body
        const furGradient = ctx.createLinearGradient(-size * 0.7, -size * 0.7, size * 0.7, size * 0.7);
        furGradient.addColorStop(0, '#F9A8D4');
        furGradient.addColorStop(0.5, '#FB7185');
        furGradient.addColorStop(1, '#F472B6');
        ctx.fillStyle = furGradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 0.58, size * 0.42, 0, 0, Math.PI * 2);
        ctx.fill();

        // head
        ctx.fillStyle = '#FBCFE8';
        ctx.beginPath();
        ctx.ellipse(0, -size * 0.45, size * 0.42, size * 0.32, 0, 0, Math.PI * 2);
        ctx.fill();

        // ears
        ctx.fillStyle = '#F9A8D4';
        ctx.beginPath();
        ctx.moveTo(-size * 0.20, -size * 0.75);
        ctx.lineTo(-size * 0.06, -size * 1.05);
        ctx.lineTo(size * 0.04, -size * 0.75);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(size * 0.20, -size * 0.75);
        ctx.lineTo(size * 0.06, -size * 1.05);
        ctx.lineTo(-size * 0.04, -size * 0.75);
        ctx.closePath();
        ctx.fill();

        // inner ears
        ctx.fillStyle = '#FDE68A';
        ctx.beginPath();
        ctx.moveTo(-size * 0.15, -size * 0.77);
        ctx.lineTo(-size * 0.08, -size * 0.96);
        ctx.lineTo(-size * 0.01, -size * 0.77);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(size * 0.15, -size * 0.77);
        ctx.lineTo(size * 0.08, -size * 0.96);
        ctx.lineTo(size * 0.01, -size * 0.77);
        ctx.closePath();
        ctx.fill();

        // face
        ctx.fillStyle = '#1F2937';
        ctx.beginPath();
        ctx.arc(-size * 0.12, -size * 0.44, size * 0.06, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(size * 0.12, -size * 0.44, size * 0.06, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#1F2937';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, -size * 0.28, size * 0.12, 0.2, Math.PI - 0.2);
        ctx.stroke();

        // nose
        ctx.fillStyle = '#FB7185';
        ctx.beginPath();
        ctx.moveTo(0, -size * 0.32);
        ctx.lineTo(size * 0.08, -size * 0.23);
        ctx.lineTo(-size * 0.08, -size * 0.23);
        ctx.closePath();
        ctx.fill();

        // paws
        ctx.fillStyle = '#F9A8D4';
        ctx.beginPath();
        ctx.ellipse(-size * 0.22, size * 0.42, size * 0.12, size * 0.18, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(size * 0.22, size * 0.42, size * 0.12, size * 0.18, 0, 0, Math.PI * 2);
        ctx.fill();

        // tail
        ctx.strokeStyle = '#F472B6';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(size * 0.58, 0);
        ctx.quadraticCurveTo(size * 0.9, -size * 0.2, size * 0.9, size * 0.2);
        ctx.stroke();

        // little 3D whiskers
        ctx.strokeStyle = '#F9A8D4';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-size * 0.24, -size * 0.32);
        ctx.lineTo(-size * 0.55, -size * 0.38);
        ctx.moveTo(-size * 0.24, -size * 0.24);
        ctx.lineTo(-size * 0.55, -size * 0.18);
        ctx.moveTo(size * 0.24, -size * 0.32);
        ctx.lineTo(size * 0.55, -size * 0.38);
        ctx.moveTo(size * 0.24, -size * 0.24);
        ctx.lineTo(size * 0.55, -size * 0.18);
        ctx.stroke();

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
    else if (t === 'robot_jump') { out.push({ op: 'jump', n: Math.max(1, Math.round(evalNum(block.getInputTargetBlock('STEPS'), 1))) }); }
    else if (t === 'robot_turn_left') { out.push({ op: 'left' }); }
    else if (t === 'robot_turn_right') { out.push({ op: 'right' }); }
    else if (t === 'robot_zoom_in') { out.push({ op: 'zoomIn' }); }
    else if (t === 'robot_zoom_out') { out.push({ op: 'zoomOut' }); }
    else if (t === 'robot_sound_forward') { out.push({ op: 'sound', kind: 'forward' }); }
    else if (t === 'robot_sound_backward') { out.push({ op: 'sound', kind: 'backward' }); }
    else if (t === 'robot_sound_turn_left') { out.push({ op: 'sound', kind: 'left' }); }
    else if (t === 'robot_sound_turn_right') { out.push({ op: 'sound', kind: 'right' }); }
    else if (t === 'robot_sound_jump') { out.push({ op: 'sound', kind: 'jump' }); }
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
    else if (a.op === 'jump') Robot.jump(a.n);
    else if (a.op === 'left') Robot.left();
    else if (a.op === 'right') Robot.right();
    else if (a.op === 'zoomIn') Robot.zoomIn();
    else if (a.op === 'zoomOut') Robot.zoomOut();
    else if (a.op === 'sound') Robot.playMoveSound(a.kind);
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

    Robot.startedAt = Date.now();
    Robot.elapsedMs = 0;
    Robot.reachedFlag = false;
    Robot.blocked = false;
    Robot.updateHud();

    let i = 0;
    if (Robot.timer) clearInterval(Robot.timer);
    Robot.timer = setInterval(() => {
        const now = Date.now();
        Robot.elapsedMs = now - Robot.startedAt;
        Robot.updateHud();

        if (i >= actions.length) {
            clearInterval(Robot.timer);
            Robot.draw();
            if (!Robot.reachedFlag && !Robot.blocked) {
                Robot.updateHud();
            }
            return;
        }

        applyAction(actions[i++]);
        Robot.draw();

        if (Robot.reachedFlag) {
            clearInterval(Robot.timer);
            const best = Number(localStorage.getItem('amir-best-time') || 0);
            const current = Robot.elapsedMs / 1000;
            Robot.recordBroken = !best || current < best;
            if (Robot.recordBroken) {
                localStorage.setItem('amir-best-time', String(current));
            }
            Robot.challengeCompleted = current <= Robot.challengeSeconds;
            Robot.showWinPopup();
            Robot.updateHud();
            return;
        }

        if (Robot.blocked) {
            clearInterval(Robot.timer);
            Robot.updateHud();
        }
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
    const text = 'Amir Academy';
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
    if (document.body.dataset.preview === 'true') {
        window.levelWorkspace = workspace;
    } else {
        wireUI();
    }
});
