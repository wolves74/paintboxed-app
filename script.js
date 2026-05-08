let currentPage = "homePage";
let paletteSize = 10;
let currentPalette = [];
let lockedColors = [];
let savedPalettes = JSON.parse(localStorage.getItem("paintboxedPalettes")) || [];
let selectedPaletteIndex = null;

const starterPalettes = {
  earthy: ["#F7F2EA", "#DCCBB7", "#B8A58C", "#8F7B62", "#5B4A3C", "#A7A88A", "#6F785F", "#3E4738", "#C77750", "#2E2A25"],
  moody: ["#F6F1E8", "#D0C7BA", "#8A8380", "#5A6268", "#2E3A40", "#243038", "#4B4038", "#7C4E47", "#9C6F5B", "#1F1E1C"],
  bright: ["#FFF8E7", "#FAD6C4", "#F7A6A1", "#F5C85B", "#A8DCC4", "#83B6D9", "#D9C4F2", "#E889B9", "#F06A45", "#2F2D2A"],
  soft: ["#FFFAF4", "#EBDDD0", "#D9C6BA", "#E7B8B2", "#C9D6C5", "#B9CAD6", "#D9CFE2", "#A79D92", "#776C62", "#3B3630"],
  vintage: ["#F7F0E3", "#D8C7A8", "#B58A5A", "#8A6B4C", "#B46E57", "#7D4941", "#7B805B", "#4B573F", "#C2B6A3", "#2F2A25"],
  playful: ["#FFF7E8", "#F9B7A7", "#F7D36E", "#A9D7C2", "#90BCE0", "#CDB8E8", "#E58AB5", "#EA6B4D", "#637B5F", "#2D2B28"],
  warm: ["#FFF4E4", "#E9C8A4", "#C99263", "#A86A47", "#7A4734", "#D6A23F", "#B9A26B", "#8C7455", "#5D4636", "#2C2520"],
  cool: ["#F5F7F4", "#D7E0D9", "#B8C7BF", "#91A99F", "#6F8B84", "#526F74", "#385760", "#2A3A42", "#A5B7D1", "#282D33"],
  whimsical: ["#FFF9EF", "#F5C3B4", "#F6D36F", "#BFE3C3", "#A6CDE8", "#DCC8F0", "#F0A6C8", "#D98263", "#7E8B68", "#302C2A"],
  minimal: ["#FFFFFF", "#F2EFE8", "#E0D8CC", "#C8BCAE", "#AFA194", "#83796F", "#5E5750", "#3B3834", "#262421", "#B08A3C"],
  romantic: ["#FFF7F2", "#EFD5CF", "#DFAEA7", "#C98784", "#A7605C", "#7A3E3F", "#D8C4BB", "#A88D83", "#6D5650", "#2E2927"],
  seasonal: ["#FFF8E9", "#F1C46D", "#D9824B", "#A6533D", "#7C3E32", "#A7A47A", "#6E7A58", "#C8D7DA", "#7D9AAA", "#302B26"]
};

const defaultPalette = [
  "#F7F2EA",
  "#DCCBB7",
  "#B8A58C",
  "#8F7B62",
  "#5B4A3C",
  "#A7A88A",
  "#6F785F",
  "#3E4738",
  "#C77750",
  "#2E2A25"
];

document.addEventListener("DOMContentLoaded", () => {
  currentPalette = [...defaultPalette];
  lockedColors = new Array(currentPalette.length).fill(false);

  setupTagButtons();
  setupPaletteSizeButtons();
  setupRangeSliders();
  setupBackgroundSelector();

  renderPalette();
  renderPreviewPalette();
  renderLibrary();
  renderPattern();
});

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active-page");
  });

  const nextPage = document.getElementById(pageId);
  if (nextPage) {
    nextPage.classList.add("active-page");
    currentPage = pageId;
  }

  if (pageId === "patternPage") {
    renderPreviewPalette();
    renderPattern();
  }

  if (pageId === "libraryPage") {
    renderLibrary();
  }

  window.scrollTo(0, 0);
}

function setupTagButtons() {
  const tagButtons = document.querySelectorAll(".tag-grid button");

  tagButtons.forEach(button => {
    button.addEventListener("click", () => {
      const activeTags = document.querySelectorAll(".tag-grid button.active");

      if (button.classList.contains("active")) {
        button.classList.remove("active");
        return;
      }

      if (activeTags.length >= 3) {
        alert("Choose up to 3 inspiration words.");
        return;
      }

      button.classList.add("active");
    });
  });
}

function setupPaletteSizeButtons() {
  const buttons = document.querySelectorAll(".segmented button");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      buttons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
    });
  });
}

function setupRangeSliders() {
  const sliders = document.querySelectorAll('input[type="range"]');

  sliders.forEach(slider => {
    slider.addEventListener("input", () => {
      applyAdjustments();
    });
  });
}

function setupBackgroundSelector() {
  const backgroundSelect = document.getElementById("backgroundSelect");

  if (backgroundSelect) {
    backgroundSelect.addEventListener("change", () => {
      renderPattern();
    });
  }
}

function setPaletteSize(size) {
  paletteSize = size;
}

function getSelectedTags() {
  return Array.from(document.querySelectorAll(".tag-grid button.active"))
    .map(button => button.textContent.trim().toLowerCase());
}

function generatePalette() {
  const selectedTags = getSelectedTags();

  let sourceColors = [];

  if (selectedTags.length === 0) {
    sourceColors = [...defaultPalette];
  } else {
    selectedTags.forEach(tag => {
      if (starterPalettes[tag]) {
        sourceColors = sourceColors.concat(starterPalettes[tag]);
      }
    });
  }

  if (sourceColors.length === 0) {
    sourceColors = [...defaultPalette];
  }

  const newPalette = [];

  for (let i = 0; i < paletteSize; i++) {
    if (lockedColors[i] && currentPalette[i]) {
      newPalette.push(currentPalette[i]);
    } else {
      const base = sourceColors[Math.floor(Math.random() * sourceColors.length)];
      newPalette.push(varyColor(base, i));
    }
  }

  currentPalette = balancePaletteRoles(newPalette, paletteSize);
  lockedColors = currentPalette.map((_, index) => lockedColors[index] || false);

  renderPalette();
  renderPreviewPalette();
  renderPattern();
}

function varyColor(hex, index) {
  const hsl = hexToHsl(hex);

  const hueShift = (Math.random() * 24 - 12) + index * 1.5;
  const satShift = Math.random() * 14 - 7;
  const lightShift = Math.random() * 16 - 8;

  hsl.h = clampHue(hsl.h + hueShift);
  hsl.s = clamp(hsl.s + satShift, 8, 85);
  hsl.l = clamp(hsl.l + lightShift, 10, 94);

  return hslToHex(hsl.h, hsl.s, hsl.l);
}

function balancePaletteRoles(colors, size) {
  const sorted = [...colors].sort((a, b) => hexToHsl(b).l - hexToHsl(a).l);

  let lightCount = 1;
  let darkCount = 1;
  let accentCount = 1;
  let neutralCount = 2;

  if (size === 10) {
    lightCount = 3;
    darkCount = 3;
    accentCount = 2;
    neutralCount = 2;
  }

  if (size === 20) {
    lightCount = 5;
    darkCount = 5;
    accentCount = 4;
    neutralCount = 6;
  }

  const lights = sorted.slice(0, lightCount).map(c => adjustLightness(c, 82));
  const darks = sorted.slice(-darkCount).map(c => adjustLightness(c, 24));
  const accents = colors
    .sort((a, b) => hexToHsl(b).s - hexToHsl(a).s)
    .slice(0, accentCount)
    .map(c => adjustSaturation(c, 58));

  const neutrals = colors
    .sort((a, b) => hexToHsl(a).s - hexToHsl(b).s)
    .slice(0, neutralCount)
    .map(c => adjustSaturation(c, 18));

  let balanced = [...lights, ...neutrals, ...accents, ...darks];

  while (balanced.length < size) {
    balanced.push(varyColor(colors[Math.floor(Math.random() * colors.length)], balanced.length));
  }

  return balanced.slice(0, size);
}

function renderPalette() {
  const container = document.getElementById("paletteSwatches");
  if (!container) return;

  container.innerHTML = "";

  currentPalette.forEach((color, index) => {
    const swatch = document.createElement("div");
    swatch.className = `swatch ${lockedColors[index] ? "locked" : ""}`;
    swatch.innerHTML = `
      <div class="swatch-square" style="background:${color}"></div>
      <div class="swatch-code">${color}</div>
      <div class="swatch-lock">${lockedColors[index] ? "🔒" : "♡"}</div>
    `;

    swatch.addEventListener("click", () => {
      lockedColors[index] = !lockedColors[index];
      renderPalette();
    });

    container.appendChild(swatch);
  });
}

function renderPreviewPalette() {
  const container = document.getElementById("previewSwatches");
  if (!container) return;

  container.innerHTML = "";

  currentPalette.forEach(color => {
    const swatch = document.createElement("div");
    swatch.className = "swatch";
    swatch.innerHTML = `
      <div class="swatch-square" style="background:${color}"></div>
      <div class="swatch-code">${color}</div>
    `;
    container.appendChild(swatch);
  });
}

function classifyPalette(colors) {
  const sortedByLightness = [...colors].sort((a, b) => hexToHsl(a).l - hexToHsl(b).l);
  const sortedBySaturation = [...colors].sort((a, b) => hexToHsl(b).s - hexToHsl(a).s);

  const darkAnchors = sortedByLightness.slice(0, Math.max(1, Math.ceil(colors.length * 0.18)));
  const lights = sortedByLightness.slice(-Math.max(1, Math.ceil(colors.length * 0.2)));
  const heroAccents = sortedBySaturation.slice(0, Math.max(1, Math.ceil(colors.length * 0.25)));
  const neutrals = [...colors]
    .sort((a, b) => hexToHsl(a).s - hexToHsl(b).s)
    .slice(0, Math.max(1, Math.ceil(colors.length * 0.3)));

  const supportingAccents = sortedBySaturation
    .filter(color => !heroAccents.includes(color))
    .slice(0, Math.max(1, Math.ceil(colors.length * 0.25)));

  return {
    hero: heroAccents,
    supporting: supportingAccents.length ? supportingAccents : heroAccents,
    dark: darkAnchors,
    neutral: neutrals,
    light: lights
  };
}

function renderPattern() {
  const pattern = document.getElementById("floralPattern");
  if (!pattern) return;

  const roles = classifyPalette(currentPalette);

  const hero = roles.hero[0] || currentPalette[0] || "#C77750";
  const support = roles.supporting[0] || currentPalette[1] || "#A7A88A";
  const dark = roles.dark[0] || "#2E2A25";
  const neutral = roles.neutral[0] || "#B8A58C";
  const dot = roles.light[0] || "#F7F2EA";

  const backgroundSelect = document.getElementById("backgroundSelect");
  const background = backgroundSelect ? backgroundSelect.value : "#ffffff";

  const scaleSlider = document.getElementById("scaleSlider");
  const scale = scaleSlider ? scaleSlider.value : 100;

  pattern.style.setProperty("--hero-color", hero);
  pattern.style.setProperty("--support-color", support);
  pattern.style.setProperty("--center-color", dark);
  pattern.style.setProperty("--twig-color", neutral);
  pattern.style.setProperty("--dot-color", dot);
  pattern.style.backgroundColor = background;
  pattern.style.backgroundSize = `${scale}px ${scale}px`;
}

function shufflePattern() {
  currentPalette = [...currentPalette].sort(() => Math.random() - 0.5);
  renderPalette();
  renderPreviewPalette();
  renderPattern();
}

function savePalette() {
  const paletteName = prompt("Name your palette:", "Untitled Palette");

  if (!paletteName) return;

  const paletteObject = {
    id: Date.now(),
    name: paletteName,
    colors: [...currentPalette],
    size: currentPalette.length,
    date: new Date().toLocaleDateString(),
    favorite: false,
    notes: "A thoughtful Paintboxed palette.",
    tags: getSelectedTags()
  };

  savedPalettes.unshift(paletteObject);
  localStorage.setItem("paintboxedPalettes", JSON.stringify(savedPalettes));

  alert("Palette saved to your library.");
  renderLibrary();
}

function renderLibrary() {
  const list = document.getElementById("libraryList");
  if (!list) return;

  list.innerHTML = "";

  if (savedPalettes.length === 0) {
    list.innerHTML = `
      <div class="empty-library">
        <p>No palettes saved yet.</p>
        <button class="primary-btn" onclick="showPage('creatorPage')">Create Your First Palette</button>
      </div>
    `;
    return;
  }

  savedPalettes.forEach((palette, index) => {
    const card = document.createElement("div");
    card.className = "library-card";

    const swatches = palette.colors.map(color => {
      return `<span class="mini-swatch" style="background:${color}"></span>`;
    }).join("");

    card.innerHTML = `
      <div class="library-card-left">
        <div class="mini-swatch-row">${swatches}</div>
        <h3>${palette.name} <button class="heart-btn" onclick="toggleFavorite(${index})">${palette.favorite ? "♥" : "♡"}</button></h3>
        <p>${palette.size} colors • Created ${palette.date}</p>
      </div>

      <div class="library-card-actions">
        <button onclick="openPalette(${index})">Open / Edit</button>
        <button onclick="sharePalette(${index})">Share</button>
        <button onclick="showMoreOptions(${index})">More</button>
      </div>
    `;

    list.appendChild(card);
  });
}

function openPalette(index) {
  const palette = savedPalettes[index];
  selectedPaletteIndex = index;

  currentPalette = [...palette.colors];
  paletteSize = palette.colors.length;
  lockedColors = new Array(currentPalette.length).fill(false);

  renderPalette();
  renderPreviewPalette();
  renderPattern();
  showPage("creatorPage");
}

function toggleFavorite(index) {
  savedPalettes[index].favorite = !savedPalettes[index].favorite;
  localStorage.setItem("paintboxedPalettes", JSON.stringify(savedPalettes));
  renderLibrary();
}

function showMoreOptions(index) {
  const palette = savedPalettes[index];

  const choice = prompt(
    `More options for "${palette.name}":\n\nType one option:\nrename\nhex\nexport\ndelete`,
    "hex"
  );

  if (!choice) return;

  const cleanChoice = choice.toLowerCase().trim();

  if (cleanChoice === "rename") {
    const newName = prompt("Rename palette:", palette.name);
    if (newName) {
      savedPalettes[index].name = newName;
      localStorage.setItem("paintboxedPalettes", JSON.stringify(savedPalettes));
      renderLibrary();
    }
  }

  if (cleanChoice === "hex") {
    alert(`${palette.name}\n\n${palette.colors.join("\n")}`);
  }

  if (cleanChoice === "export") {
    alert("PNG export will be added in the next build step. Hex codes are available now.");
  }

  if (cleanChoice === "delete") {
    const confirmDelete = confirm(`Delete "${palette.name}"?`);
    if (confirmDelete) {
      savedPalettes.splice(index, 1);
      localStorage.setItem("paintboxedPalettes", JSON.stringify(savedPalettes));
      renderLibrary();
    }
  }
}

function sharePalette(index) {
  const palette = savedPalettes[index];
  const text = `${palette.name}\n${palette.colors.join(", ")}`;

  if (navigator.share) {
    navigator.share({
      title: palette.name,
      text: text
    });
  } else {
    alert(text);
  }
}

function applyAdjustments() {
  const sliders = document.querySelectorAll('input[type="range"]');
  if (sliders.length < 3) return;

  const hue = Number(sliders[0].value);
  const tone = Number(sliders[1].value);
  const saturation = Number(sliders[2].value);

  currentPalette = currentPalette.map(color => {
    const hsl = hexToHsl(color);
    hsl.h = clampHue(hsl.h + hue * 0.04);
    hsl.l = clamp(hsl.l + tone * 0.025, 5, 95);
    hsl.s = clamp(hsl.s + saturation * 0.025, 5, 95);
    return hslToHex(hsl.h, hsl.s, hsl.l);
  });

  renderPalette();
  renderPreviewPalette();
  renderPattern();
}

function hexToHsl(hex) {
  hex = hex.replace("#", "");

  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h;
  let s;
  let l = (max + min) / 2;

  if (max === min) {
    h = 0;
    s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0));
        break;
      case g:
        h = ((b - r) / d + 2);
        break;
      case b:
        h = ((r - g) / d + 4);
        break;
    }

    h *= 60;
  }

  return {
    h: h || 0,
    s: s * 100,
    l: l * 100
  };
}

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return "#" + [r, g, b].map(value => {
    const hex = value.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("").toUpperCase();
}

function adjustLightness(hex, targetLightness) {
  const hsl = hexToHsl(hex);
  return hslToHex(hsl.h, hsl.s, targetLightness);
}

function adjustSaturation(hex, targetSaturation) {
  const hsl = hexToHsl(hex);
  return hslToHex(hsl.h, targetSaturation, hsl.l);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function clampHue(value) {
  while (value < 0) value += 360;
  while (value >= 360) value -= 360;
  return value;
}
