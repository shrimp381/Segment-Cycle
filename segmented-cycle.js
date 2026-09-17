const MODULE_ID = "segmented-cycle";

const DEFAULT_STATE = {
  day: { segments: 5, filled: 5, color: "#E2A93C" },
  night: { segments: 5, filled: 5, color: "#4A5AA8" },
};

function registerSettings() {
  game.settings.register(MODULE_ID, "state", {
    scope: "world",
    config: false,
    type: Object,
    default: DEFAULT_STATE,
  });

  game.settings.register(MODULE_ID, "dayPos", {
    scope: "client",
    config: false,
    type: Object,
    default: { x: 40, y: 90 },
  });

  game.settings.register(MODULE_ID, "nightPos", {
    scope: "client",
    config: false,
    type: Object,
    default: { x: 40, y: 190 },
  });

  game.settings.register(MODULE_ID, "visible", {
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
    name: "SEGCYCLE.ShowHUD",
    hint: "SEGCYCLE.ShowHUDHint",
    onChange: () => hud?.render(),
  });
}

class SegmentedCycleHUD {
  constructor() {
    this.root = null;
    this.dragKey = null;
    this.dragOffset = { x: 0, y: 0 };
    this._pendingPos = null;
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerUp = this._onPointerUp.bind(this);
  }

  get state() {
    return foundry.utils.duplicate(game.settings.get(MODULE_ID, "state"));
  }

  async setState(next) {
    await game.settings.set(MODULE_ID, "state", next);
  }

  getPos(key) {
    return game.settings.get(MODULE_ID, key === "day" ? "dayPos" : "nightPos");
  }

  async setPos(key, pos) {
    await game.settings.set(MODULE_ID, key === "day" ? "dayPos" : "nightPos", pos);
  }

  render() {
    const show = game.settings.get(MODULE_ID, "visible");
    if (!game.user.isGM || !show) {
      this.destroy();
      return;
    }
    if (!this.root) {
      this.root = document.createElement("div");
      this.root.id = "segmented-cycle-hud";
      document.body.appendChild(this.root);
    }
    this.root.innerHTML = "";
    const state = this.state;
    this.root.appendChild(this._buildBar("day", state.day, this.getPos("day"), "sun"));
    this.root.appendChild(this._buildBar("night", state.night, this.getPos("night"), "moon"));
  }

  destroy() {
    if (this.root) {
      this.root.remove();
      this.root = null;
    }
  }

  _buildBar(key, barState, pos, iconType) {
    const bar = document.createElement("div");
    bar.className = "scy-bar";
    bar.dataset.key = key;
    bar.style.left = `${pos.x}px`;
    bar.style.top = `${pos.y}px`;

    const grip = document.createElement("div");
    grip.className = "scy-grip";
    grip.innerHTML = "<span></span><span></span><span></span>";
    grip.addEventListener("pointerdown", (e) => this._startDrag(key, e));
    bar.appendChild(grip);

    const icon = document.createElement("div");
    icon.className = "scy-icon";
    icon.innerHTML = iconType === "sun" ? this._sunSVG(barState.color) : this._moonSVG(barState.color);
    bar.appendChild(icon);

    const labelCol = document.createElement("div");
    labelCol.className = "scy-label-col";

    const labelText = document.createElement("span");
    labelText.className = "scy-label";
    labelText.textContent = key === "day" ? "DAY" : "NIGHT";
    labelCol.appendChild(labelText);

    const track = document.createElement("div");
    track.className = "scy-track";
    const trackWidth = 220;
    const gap = 4;
    const pipW = Math.max(6, Math.min(16, Math.floor((trackWidth - (barState.segments - 1) * gap) / barState.segments)));
    for (let i = 0; i < barState.segments; i++) {
      const pip = document.createElement("div");
      pip.className = "scy-pip";
      pip.style.width = `${pipW}px`;
      pip.style.borderColor = barState.color;
      pip.style.background = i < barState.filled ? barState.color : "transparent";
      pip.addEventListener("click", () => this._pipClick(key, i));
      track.appendChild(pip);
    }
    labelCol.appendChild(track);
    bar.appendChild(labelCol);

    const count = document.createElement("span");
    count.className = "scy-count";
    count.textContent = `${barState.filled} / ${barState.segments}`;
    bar.appendChild(count);

    const controls = document.createElement("div");
    controls.className = "scy-controls";

    const dec = document.createElement("button");
    dec.type = "button";
    dec.className = "scy-btn";
    dec.textContent = "−";
    dec.title = `Fewer ${key === "day" ? "Day" : "Night"} segments`;
    dec.addEventListener("click", () => this._changeSegments(key, -1));
    controls.appendChild(dec);

    const inc = document.createElement("button");
    inc.type = "button";
    inc.className = "scy-btn";
    inc.textContent = "+";
    inc.title = `More ${key === "day" ? "Day" : "Night"} segments`;
    inc.addEventListener("click", () => this._changeSegments(key, 1));
    controls.appendChild(inc);

    const color = document.createElement("input");
    color.type = "color";
    color.className = "scy-color";
    color.value = barState.color;
    color.title = `${key === "day" ? "Day" : "Night"} bar colour`;
    color.addEventListener("input", (e) => this._setColor(key, e.target.value));
    controls.appendChild(color);

    bar.appendChild(controls);
    return bar;
  }

  _startDrag(key, e) {
    e.preventDefault();
    this.dragKey = key;
    const pos = this.getPos(key);
    this.dragOffset = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    window.addEventListener("pointermove", this._onPointerMove);
    window.addEventListener("pointerup", this._onPointerUp);
  }

  _onPointerMove(e) {
    if (!this.dragKey || !this.root) return;
    const x = Math.max(0, e.clientX - this.dragOffset.x);
    const y = Math.max(0, e.clientY - this.dragOffset.y);
    const bar = this.root.querySelector(`.scy-bar[data-key="${this.dragKey}"]`);
    if (bar) {
      bar.style.left = `${x}px`;
      bar.style.top = `${y}px`;
    }
    this._pendingPos = { x, y };
  }

  async _onPointerUp() {
    window.removeEventListener("pointermove", this._onPointerMove);
    window.removeEventListener("pointerup", this._onPointerUp);
    if (this.dragKey && this._pendingPos) {
      await this.setPos(this.dragKey, this._pendingPos);
    }
    this.dragKey = null;
    this._pendingPos = null;
  }

  async _changeSegments(key, delta) {
    const state = this.state;
    const bar = state[key];
    bar.segments = Math.min(20, Math.max(1, bar.segments + delta));
    bar.filled = Math.min(bar.filled, bar.segments);
    await this.setState(state);
  }

  async _setColor(key, color) {
    const state = this.state;
    state[key].color = color;
    await this.setState(state);
  }

  async _pipClick(key, i) {
    const state = this.state;
    const bar = state[key];
    bar.filled = bar.filled === i + 1 ? i : i + 1;
    await this.setState(state);
  }

  _sunSVG(color) {
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"></circle><line x1="12" y1="1.5" x2="12" y2="4.5"></line><line x1="12" y1="19.5" x2="12" y2="22.5"></line><line x1="1.5" y1="12" x2="4.5" y2="12"></line><line x1="19.5" y1="12" x2="22.5" y2="12"></line><line x1="4.6" y1="4.6" x2="6.7" y2="6.7"></line><line x1="17.3" y1="17.3" x2="19.4" y2="19.4"></line><line x1="4.6" y1="19.4" x2="6.7" y2="17.3"></line><line x1="17.3" y1="6.7" x2="19.4" y2="4.6"></line></svg>`;
  }

  _moonSVG(color) {
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="${color}" stroke="none"><path d="M20 12.7c-1.3 4.6-5.7 7.8-10.6 7.1C4.4 19.1 1 14.9 1.5 10.1 2 5.5 5.6 1.9 10.1 1.4c-1.9 2-2.8 4.9-2.2 7.8.7 3.4 3.6 5.9 7.1 6.2 1.9.2 3.7-.3 5-1.2z"></path></svg>`;
  }
}

let hud;

Hooks.once("init", () => {
  registerSettings();
});

Hooks.once("ready", () => {
  hud = new SegmentedCycleHUD();
  hud.render();
});

Hooks.on("updateSetting", (setting) => {
  if (setting.key === `${MODULE_ID}.state`) hud?.render();
});
