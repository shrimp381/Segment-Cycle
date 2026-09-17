const MODULE_ID = "segmented-cycle";

const POS_SETTING = {
  day: "dayPos",
  night: "nightPos",
  combined: "combinedPos",
  transition: "transitionPos",
  custom: "customPos",
};

function registerSettings() {
  game.settings.register(MODULE_ID, "enabled", {
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
    name: "SEGCYCLE.Enabled",
    hint: "SEGCYCLE.EnabledHint",
  });

  game.settings.register(MODULE_ID, "layout", {
    scope: "world",
    config: true,
    type: String,
    default: "split",
    choices: {
      split: "Split (two bars)",
      combined: "Combined (both visible)",
      transition: "Transition (single bar)",
    },
    name: "SEGCYCLE.Layout",
    hint: "SEGCYCLE.LayoutHint",
  });

  game.settings.register(MODULE_ID, "bgTransparent", {
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
    name: "SEGCYCLE.BgTransparent",
    hint: "SEGCYCLE.BgTransparentHint",
  });

  game.settings.register(MODULE_ID, "bgOpacity", {
    scope: "world",
    config: true,
    type: Number,
    default: 70,
    range: { min: 0, max: 100, step: 5 },
    name: "SEGCYCLE.BgOpacity",
    hint: "SEGCYCLE.BgOpacityHint",
  });

  game.settings.register(MODULE_ID, "dayColor", {
    scope: "world",
    config: true,
    type: String,
    default: "#E2A93C",
    name: "SEGCYCLE.DayColor",
  });

  game.settings.register(MODULE_ID, "daySegments", {
    scope: "world",
    config: true,
    type: Number,
    default: 5,
    range: { min: 1, max: 20, step: 1 },
    name: "SEGCYCLE.DaySegments",
  });

  game.settings.register(MODULE_ID, "dayFilled", {
    scope: "world",
    config: false,
    type: Number,
    default: 0,
  });

  game.settings.register(MODULE_ID, "nightColor", {
    scope: "world",
    config: true,
    type: String,
    default: "#4A5AA8",
    name: "SEGCYCLE.NightColor",
  });

  game.settings.register(MODULE_ID, "nightSegments", {
    scope: "world",
    config: true,
    type: Number,
    default: 5,
    range: { min: 1, max: 20, step: 1 },
    name: "SEGCYCLE.NightSegments",
  });

  game.settings.register(MODULE_ID, "nightFilled", {
    scope: "world",
    config: false,
    type: Number,
    default: 0,
  });

  // Which half of the day/night track the Transition layout is currently showing.
  game.settings.register(MODULE_ID, "phase", {
    scope: "world",
    config: false,
    type: String,
    default: "day",
  });

  game.settings.register(MODULE_ID, "customEnabled", {
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
    name: "SEGCYCLE.CustomEnabled",
  });

  game.settings.register(MODULE_ID, "customLabel", {
    scope: "world",
    config: true,
    type: String,
    default: "Alert Tracking",
    name: "SEGCYCLE.CustomLabel",
  });

  game.settings.register(MODULE_ID, "customColor", {
    scope: "world",
    config: true,
    type: String,
    default: "#B34DE0",
    name: "SEGCYCLE.CustomColor",
  });

  game.settings.register(MODULE_ID, "customSegments", {
    scope: "world",
    config: true,
    type: Number,
    default: 5,
    range: { min: 1, max: 20, step: 1 },
    name: "SEGCYCLE.CustomSegments",
  });

  game.settings.register(MODULE_ID, "customFilled", {
    scope: "world",
    config: false,
    type: Number,
    default: 0,
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

  game.settings.register(MODULE_ID, "combinedPos", {
    scope: "client",
    config: false,
    type: Object,
    default: { x: 40, y: 90 },
  });

  game.settings.register(MODULE_ID, "transitionPos", {
    scope: "client",
    config: false,
    type: Object,
    default: { x: 40, y: 90 },
  });

  game.settings.register(MODULE_ID, "customPos", {
    scope: "client",
    config: false,
    type: Object,
    default: { x: 460, y: 90 },
  });
}

class SegmentedCycleConfig extends FormApplication {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "segmented-cycle-config",
      title: game.i18n?.localize("SEGCYCLE.ConfigTitle") ?? "Segmented Cycle Settings",
      template: `modules/${MODULE_ID}/templates/segmented-cycle-config.hbs`,
      width: 420,
      height: "auto",
      closeOnSubmit: true,
      submitOnChange: false,
    });
  }

  getData() {
    return {
      enabled: game.settings.get(MODULE_ID, "enabled"),
      layout: game.settings.get(MODULE_ID, "layout"),
      layouts: {
        split: "Split (two bars)",
        combined: "Combined (both visible)",
        transition: "Transition (single bar)",
      },
      bgTransparent: game.settings.get(MODULE_ID, "bgTransparent"),
      bgOpacity: game.settings.get(MODULE_ID, "bgOpacity"),
      dayColor: game.settings.get(MODULE_ID, "dayColor"),
      daySegments: game.settings.get(MODULE_ID, "daySegments"),
      nightColor: game.settings.get(MODULE_ID, "nightColor"),
      nightSegments: game.settings.get(MODULE_ID, "nightSegments"),
      customEnabled: game.settings.get(MODULE_ID, "customEnabled"),
      customLabel: game.settings.get(MODULE_ID, "customLabel"),
      customColor: game.settings.get(MODULE_ID, "customColor"),
      customSegments: game.settings.get(MODULE_ID, "customSegments"),
    };
  }

  async _updateObject(event, formData) {
    const daySegments = Math.min(20, Math.max(1, Number(formData.daySegments)));
    const nightSegments = Math.min(20, Math.max(1, Number(formData.nightSegments)));
    const customSegments = Math.min(20, Math.max(1, Number(formData.customSegments)));

    await Promise.all([
      game.settings.set(MODULE_ID, "enabled", !!formData.enabled),
      game.settings.set(MODULE_ID, "layout", formData.layout),
      game.settings.set(MODULE_ID, "bgTransparent", !!formData.bgTransparent),
      game.settings.set(MODULE_ID, "bgOpacity", Number(formData.bgOpacity)),
      game.settings.set(MODULE_ID, "dayColor", formData.dayColor),
      game.settings.set(MODULE_ID, "daySegments", daySegments),
      game.settings.set(MODULE_ID, "nightColor", formData.nightColor),
      game.settings.set(MODULE_ID, "nightSegments", nightSegments),
      game.settings.set(MODULE_ID, "customEnabled", !!formData.customEnabled),
      game.settings.set(MODULE_ID, "customLabel", formData.customLabel),
      game.settings.set(MODULE_ID, "customColor", formData.customColor),
      game.settings.set(MODULE_ID, "customSegments", customSegments),
    ]);

    const dayFilled = Math.min(game.settings.get(MODULE_ID, "dayFilled"), daySegments);
    const nightFilled = Math.min(game.settings.get(MODULE_ID, "nightFilled"), nightSegments);
    const customFilled = Math.min(game.settings.get(MODULE_ID, "customFilled"), customSegments);
    await Promise.all([
      game.settings.set(MODULE_ID, "dayFilled", dayFilled),
      game.settings.set(MODULE_ID, "nightFilled", nightFilled),
      game.settings.set(MODULE_ID, "customFilled", customFilled),
    ]);
  }
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

  getBarState(key) {
    return {
      segments: game.settings.get(MODULE_ID, `${key}Segments`),
      filled: game.settings.get(MODULE_ID, `${key}Filled`),
      color: game.settings.get(MODULE_ID, `${key}Color`),
    };
  }

  async setFilled(key, filled) {
    await game.settings.set(MODULE_ID, `${key}Filled`, filled);
  }

  getPos(key) {
    return game.settings.get(MODULE_ID, POS_SETTING[key]);
  }

  async setPos(key, pos) {
    await game.settings.set(MODULE_ID, POS_SETTING[key], pos);
  }

  backgroundStyle() {
    const transparent = game.settings.get(MODULE_ID, "bgTransparent");
    const opacity = game.settings.get(MODULE_ID, "bgOpacity");
    const alpha = transparent ? Math.max(0, Math.min(100, opacity)) / 100 : 0.86;
    return `rgba(18, 18, 15, ${alpha})`;
  }

  render() {
    const enabled = game.settings.get(MODULE_ID, "enabled");
    if (!game.user.isGM || !enabled) {
      this.destroy();
      return;
    }
    if (!this.root) {
      this.root = document.createElement("div");
      this.root.id = "segmented-cycle-hud";
      document.body.appendChild(this.root);
    }
    this.root.innerHTML = "";
    const bg = this.backgroundStyle();
    const layout = game.settings.get(MODULE_ID, "layout");

    if (layout === "combined") {
      this.root.appendChild(this._buildCombined(bg));
    } else if (layout === "transition") {
      this.root.appendChild(this._buildTransition(bg));
    } else {
      this.root.appendChild(this._buildBar("day", "sun", bg));
      this.root.appendChild(this._buildBar("night", "moon", bg));
    }

    if (game.settings.get(MODULE_ID, "customEnabled")) {
      this.root.appendChild(this._buildCustom(bg));
    }
  }

  destroy() {
    if (this.root) {
      this.root.remove();
      this.root = null;
    }
  }

  _pipWidth(segments, trackWidth) {
    const gap = 4;
    return Math.max(6, Math.min(16, Math.floor((trackWidth - (segments - 1) * gap) / segments)));
  }

  _buildTrack(barState, trackWidth, onClickFn) {
    const track = document.createElement("div");
    track.className = "scy-track";
    const pipW = this._pipWidth(barState.segments, trackWidth);
    for (let i = 0; i < barState.segments; i++) {
      const pip = document.createElement("div");
      pip.className = "scy-pip";
      pip.style.width = `${pipW}px`;
      pip.style.borderColor = barState.color;
      pip.style.background = i < barState.filled ? barState.color : "transparent";
      pip.addEventListener("click", () => onClickFn(i));
      track.appendChild(pip);
    }
    return track;
  }

  _buildResetButton(onClickFn) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "scy-reset";
    btn.title = "Reset";
    btn.setAttribute("aria-label", "Reset this cycle");
    btn.innerHTML = '<i class="fas fa-rotate-left"></i>';
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      onClickFn();
    });
    return btn;
  }

  _buildBar(key, iconType, bg) {
    const barState = this.getBarState(key);
    const pos = this.getPos(key);

    const bar = document.createElement("div");
    bar.className = "scy-bar";
    bar.dataset.key = key;
    bar.style.left = `${pos.x}px`;
    bar.style.top = `${pos.y}px`;
    bar.style.background = bg;

    bar.appendChild(this._buildGrip(key));

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
    labelCol.appendChild(this._buildTrack(barState, 220, (i) => this._pipClick(key, i)));
    bar.appendChild(labelCol);

    const count = document.createElement("span");
    count.className = "scy-count";
    count.textContent = `${barState.filled} / ${barState.segments}`;
    bar.appendChild(count);

    bar.appendChild(this._buildResetButton(() => this.resetDayNight()));

    return bar;
  }

  _buildCombined(bg) {
    const day = this.getBarState("day");
    const night = this.getBarState("night");
    const pos = this.getPos("combined");

    const bar = document.createElement("div");
    bar.className = "scy-bar scy-combined";
    bar.dataset.key = "combined";
    bar.style.left = `${pos.x}px`;
    bar.style.top = `${pos.y}px`;
    bar.style.background = bg;

    bar.appendChild(this._buildGrip("combined"));

    const sunIcon = document.createElement("div");
    sunIcon.className = "scy-icon";
    sunIcon.innerHTML = this._sunSVG(day.color);
    bar.appendChild(sunIcon);

    const dayCol = document.createElement("div");
    dayCol.className = "scy-label-col";
    const dayLabel = document.createElement("span");
    dayLabel.className = "scy-label";
    dayLabel.textContent = "DAY";
    dayCol.appendChild(dayLabel);
    dayCol.appendChild(this._buildTrack(day, 140, (i) => this._pipClick("day", i)));
    bar.appendChild(dayCol);

    const dayCount = document.createElement("span");
    dayCount.className = "scy-count";
    dayCount.textContent = `${day.filled} / ${day.segments}`;
    bar.appendChild(dayCount);

    const divider = document.createElement("div");
    divider.className = "scy-divider";
    bar.appendChild(divider);

    const moonIcon = document.createElement("div");
    moonIcon.className = "scy-icon";
    moonIcon.innerHTML = this._moonSVG(night.color);
    bar.appendChild(moonIcon);

    const nightCol = document.createElement("div");
    nightCol.className = "scy-label-col";
    const nightLabel = document.createElement("span");
    nightLabel.className = "scy-label";
    nightLabel.textContent = "NIGHT";
    nightCol.appendChild(nightLabel);
    nightCol.appendChild(this._buildTrack(night, 140, (i) => this._pipClick("night", i)));
    bar.appendChild(nightCol);

    const nightCount = document.createElement("span");
    nightCount.className = "scy-count";
    nightCount.textContent = `${night.filled} / ${night.segments}`;
    bar.appendChild(nightCount);

    bar.appendChild(this._buildResetButton(() => this.resetDayNight()));

    return bar;
  }

  _buildTransition(bg) {
    const phase = game.settings.get(MODULE_ID, "phase");
    const barState = this.getBarState(phase);
    const pos = this.getPos("transition");

    const bar = document.createElement("div");
    bar.className = "scy-bar";
    bar.dataset.key = "transition";
    bar.style.left = `${pos.x}px`;
    bar.style.top = `${pos.y}px`;
    bar.style.background = bg;

    bar.appendChild(this._buildGrip("transition"));

    const icon = document.createElement("div");
    icon.className = "scy-icon";
    icon.innerHTML = phase === "day" ? this._sunSVG(barState.color) : this._moonSVG(barState.color);
    bar.appendChild(icon);

    const labelCol = document.createElement("div");
    labelCol.className = "scy-label-col";
    const labelText = document.createElement("span");
    labelText.className = "scy-label";
    labelText.textContent = phase === "day" ? "DAY" : "NIGHT";
    labelCol.appendChild(labelText);
    labelCol.appendChild(this._buildTrack(barState, 220, (i) => this._pipClickTransition(i)));
    bar.appendChild(labelCol);

    const count = document.createElement("span");
    count.className = "scy-count";
    count.textContent = `${barState.filled} / ${barState.segments}`;
    bar.appendChild(count);

    bar.appendChild(this._buildResetButton(() => this.resetDayNight()));

    return bar;
  }

  _buildCustom(bg) {
    const barState = this.getBarState("custom");
    const label = game.settings.get(MODULE_ID, "customLabel");
    const pos = this.getPos("custom");

    const bar = document.createElement("div");
    bar.className = "scy-bar";
    bar.dataset.key = "custom";
    bar.style.left = `${pos.x}px`;
    bar.style.top = `${pos.y}px`;
    bar.style.background = bg;

    bar.appendChild(this._buildGrip("custom"));

    const icon = document.createElement("div");
    icon.className = "scy-icon-dot";
    icon.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="${barState.color}"></circle></svg>`;
    bar.appendChild(icon);

    const labelCol = document.createElement("div");
    labelCol.className = "scy-label-col";
    const labelText = document.createElement("span");
    labelText.className = "scy-label";
    labelText.style.maxWidth = "160px";
    labelText.style.whiteSpace = "nowrap";
    labelText.style.overflow = "hidden";
    labelText.style.textOverflow = "ellipsis";
    labelText.textContent = label;
    labelCol.appendChild(labelText);
    labelCol.appendChild(this._buildTrack(barState, 220, (i) => this._pipClick("custom", i)));
    bar.appendChild(labelCol);

    const count = document.createElement("span");
    count.className = "scy-count";
    count.textContent = `${barState.filled} / ${barState.segments}`;
    bar.appendChild(count);

    bar.appendChild(this._buildResetButton(() => this.resetCustom()));

    return bar;
  }

  _buildGrip(key) {
    const grip = document.createElement("div");
    grip.className = "scy-grip";
    grip.innerHTML = "<span></span><span></span><span></span>";
    grip.addEventListener("pointerdown", (e) => this._startDrag(key, e));
    return grip;
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

  async _pipClick(key, i) {
    const barState = this.getBarState(key);
    const filled = barState.filled === i + 1 ? i : i + 1;
    await this.setFilled(key, filled);
  }

  async _pipClickTransition(i) {
    const phase = game.settings.get(MODULE_ID, "phase");
    const barState = this.getBarState(phase);
    const filled = barState.filled === i + 1 ? i : i + 1;

    if (filled === barState.segments && phase === "day") {
      // Day fully filled: flip the bar over into Night.
      await Promise.all([
        game.settings.set(MODULE_ID, "dayFilled", barState.segments),
        game.settings.set(MODULE_ID, "nightFilled", 0),
        game.settings.set(MODULE_ID, "phase", "night"),
      ]);
      return;
    }
    // Night filling up does not roll the cycle back to Day on its own.
    // Use the reset button on the bar to start a fresh cycle.
    await this.setFilled(phase, filled);
  }

  async resetDayNight() {
    await Promise.all([
      game.settings.set(MODULE_ID, "dayFilled", 0),
      game.settings.set(MODULE_ID, "nightFilled", 0),
      game.settings.set(MODULE_ID, "phase", "day"),
    ]);
  }

  async resetCustom() {
    await game.settings.set(MODULE_ID, "customFilled", 0);
  }

  _sunSVG(color) {
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"></circle><line x1="12" y1="1.5" x2="12" y2="4.5"></line><line x1="12" y1="19.5" x2="12" y2="22.5"></line><line x1="1.5" y1="12" x2="4.5" y2="12"></line><line x1="19.5" y1="12" x2="22.5" y2="12"></line><line x1="4.6" y1="4.6" x2="6.7" y2="6.7"></line><line x1="17.3" y1="17.3" x2="19.4" y2="19.4"></line><line x1="4.6" y1="19.4" x2="6.7" y2="17.3"></line><line x1="17.3" y1="6.7" x2="19.4" y2="4.6"></line></svg>`;
  }

  _moonSVG(color) {
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="${color}" stroke="none"><path d="M20 12.7c-1.3 4.6-5.7 7.8-10.6 7.1C4.4 19.1 1 14.9 1.5 10.1 2 5.5 5.6 1.9 10.1 1.4c-1.9 2-2.8 4.9-2.2 7.8.7 3.4 3.6 5.9 7.1 6.2 1.9.2 3.7-.3 5-1.2z"></path></svg>`;
  }
}

let hud;

function injectSidebarButton(app, html) {
  if (!game.user.isGM) return;
  const root = html && html.jquery ? html[0] : html;
  if (!root || root.querySelector(".segmented-cycle-config-button")) return;
  const footer = root.querySelector(".directory-footer");
  if (!footer) return;
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "segmented-cycle-config-button";
  btn.innerHTML = '<i class="fas fa-circle-half-stroke"></i> Segmented Cycle';
  btn.addEventListener("click", () => new SegmentedCycleConfig().render(true));
  footer.appendChild(btn);
}

Hooks.once("init", () => {
  registerSettings();
});

Hooks.once("ready", () => {
  hud = new SegmentedCycleHUD();
  hud.render();
});

Hooks.on("updateSetting", (setting) => {
  if (setting.key?.startsWith(`${MODULE_ID}.`)) hud?.render();
});

Hooks.on("renderJournalDirectory", (app, html) => {
  injectSidebarButton(app, html);
});
