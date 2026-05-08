let currentPage = "homePage";
let paletteSize = 10;
let currentPalette = [];
let lockedColors = [];
let savedPalettes = JSON.parse(localStorage.getItem("paintboxedPalettes")) || [];
let selectedPaletteIndex = null;

const colorBanks = {
  earthy: {
    lights: ["#F8F0E3", "#F5EBDD", "#EFE2CE", "#F2E8D9", "#FAF4EA", "#EADCC7"],
    neutrals: ["#D8C7B0", "#C7B59D", "#B8A58C", "#A9947C", "#D0C0AA", "#927E66"],
    supports: ["#A7A88A", "#8F9B73", "#7E8B64", "#9B9272", "#B09C75", "#8A7A5C"],
    accents: ["#C77750", "#B96745", "#D08A61", "#A95E3E", "#C49A4E", "#B8843D"],
    darks: ["#3E4738", "#4E3B2F", "#5B3A2E", "#2F352B", "#4A4A35", "#332B24"]
  },

  soft: {
    lights: ["#FFF7F2", "#F8EEE8", "#F7F1E9", "#F1E9DF", "#F9F3EC", "#EFE6DD"],
    neutrals: ["#E0D2C8", "#D8C8BE", "#CDBBB0", "#BFAEA4", "#D9CDC0", "#B9ADA3"],
    supports: ["#C9D6C5", "#B9CAD6", "#D9CFE2", "#D8BDB7", "#CFC8B8", "#C6D2CB"],
    accents: ["#E5A99F", "#D99991", "#E8B79D", "#C88D92", "#D6A7BE", "#BFA7CF"],
    darks: ["#776C62", "#6E6259", "#5D5851", "#4D4945", "#63575B", "#3B3630"]
  },

  moody: {
    lights: ["#F3EEE7", "#E8E0D4", "#DED4C8", "#DAD2C6", "#ECE7DF", "#D1C7BC"],
    neutrals: ["#B5A99B", "#9C9186", "#847B72", "#706A63", "#A89B8C", "#8D8175"],
    supports: ["#6F7C73", "#6B7480", "#7A6C72", "#7E715E", "#6D7057", "#6B5F55"],
    accents: ["#9C6A54", "#884F47", "#7C4E47", "#A27A3E", "#8C5D68", "#735C8A"],
    darks: ["#243038", "#2E3A40", "#2F332B", "#3B2E2C", "#1F1E1C", "#312A32"]
  },

  bright: {
    lights: ["#FFF8E7", "#FFF4D9", "#FCEDE5", "#F4FAF2", "#EEF7FF", "#FFF3F7"],
    neutrals: ["#EADCC7", "#DCC9B8", "#C9B8A3", "#F0E3D3", "#BDB7A8", "#D6D0C4"],
    supports: ["#A8DCC4", "#83B6D9", "#B7D96F", "#D9C4F2", "#F5C85B", "#9ED0E6"],
    accents: ["#F06A45", "#E889B9", "#E04D3F", "#F5A43B", "#55A96B", "#4C8AC9"],
    darks: ["#2F2D2A", "#243A4A", "#314433", "#4E2C2B", "#3B2F52", "#51422D"]
  },

  vintage: {
    lights: ["#F7F0E3", "#EFE3CF", "#F3E8D8", "#EADBC5", "#F8F3E9", "#E7D8C2"],
    neutrals: ["#D8C7A8", "#C9B899", "#BDA98C", "#AA957A", "#C2B6A3", "#9E8B76"],
    supports: ["#7B805B", "#6E7652", "#7E8B7A", "#6E7E88", "#A58F73", "#8E7B92"],
    accents: ["#B58A5A", "#B46E57", "#A65E4F", "#C08A3E", "#B07874", "#9A7042"],
    darks: ["#4B573F", "#4C3A31", "#5B4038", "#2F2A25", "#3D4650", "#463A4D"]
  },

  playful: {
    lights: ["#FFF7E8", "#FFF2F0", "#FFF5CF", "#F2FBF7", "#EEF7FF", "#FAF1FF"],
    neutrals: ["#E8D8C5", "#D7C6B6", "#CDBCAA", "#F0DFCD", "#BEB5A8", "#E1D6CA"],
    supports: ["#A9D7C2", "#90BCE0", "#CDB8E8", "#F6D36E", "#9ECF8A", "#B7D8E8"],
    accents: ["#EA6B4D", "#E58AB5", "#F2A23C", "#E45A6A", "#7CAFE0", "#74B66C"],
    darks: ["#2D2B28", "#31505D", "#3C4732", "#5B3434", "#4A3A5C", "#60412D"]
  },

  warm: {
    lights: ["#FFF4E4", "#FAE6D0", "#F6DDC2", "#FFEEDB", "#F8E8D6", "#F2D9BE"],
    neutrals: ["#E9C8A4", "#D7B58F", "#C6A17B", "#B8906C", "#8C7455", "#D4C0A6"],
    supports: ["#B9A26B", "#A88F5C", "#A87052", "#C18757", "#A79077", "#9C8068"],
    accents: ["#C99263", "#A86A47", "#D6A23F", "#C76F3D", "#B5523C", "#D4874E"],
    darks: ["#7A4734", "#5D4636", "#4A352A", "#2C2520", "#60412D", "#563A2E"]
  },

  cool: {
    lights: ["#F5F7F4", "#EEF5F5", "#E8F0EE", "#EDF4FA", "#F3F1F8", "#E3ECEA"],
    neutrals: ["#D7E0D9", "#C6D1CA", "#B8C7BF", "#AAB6B0", "#AEB8BC", "#929FA0"],
    supports: ["#91A99F", "#6F8B84", "#A5B7D1", "#7B9CB0", "#9AA4BE", "#8BA698"],
    accents: ["#526F74", "#5A7E95", "#6C83B2", "#4F927A", "#7D78AA", "#37758A"],
    darks: ["#385760", "#2A3A42", "#303E50", "#243731", "#282D33", "#33394A"]
  },

  whimsical: {
    lights: ["#FFF9EF", "#FFF2E8", "#FFF7D8", "#F1FAEF", "#EDF6FF", "#FAF0FF"],
    neutrals: ["#E8D7C8", "#D8C8B8", "#CBB9A8", "#E9DEC9", "#BFB3A5", "#D6C9BE"],
    supports: ["#BFE3C3", "#A6CDE8", "#DCC8F0", "#F5C3B4", "#C9D89E", "#B8D6D1"],
    accents: ["#D98263", "#F0A6C8", "#F6D36F", "#9AA6E8", "#76B98F", "#E96E79"],
    darks: ["#302C2A", "#38505A", "#4B4730", "#613A38", "#51405F", "#3F5542"]
  },

  minimal: {
    lights: ["#FFFFFF", "#FBFAF7", "#F7F2EA", "#F2EFE8", "#EFEAE2", "#E9E3DA"],
    neutrals: ["#E0D8CC", "#D6CFC4", "#C8BCAE", "#B8AEA2", "#AFA194", "#9D948C"],
    supports: ["#B08A3C", "#A89E8B", "#918C80", "#B7B2A7", "#8C877D", "#C2B8A5"],
    accents: ["#B08A3C", "#8E7345", "#A56D4E", "#6F7A6A", "#6A7480", "#7C6C76"],
    darks: ["#83796F", "#5E5750", "#3B3834", "#262421", "#4A453E", "#2F2D2A"]
  },

  romantic: {
    lights: ["#FFF7F2", "#FAEDE9", "#F6E2DF", "#F8F0E9", "#FFF2F4", "#EFE3DD"],
    neutrals: ["#EFD5CF", "#D8C4BB", "#CBB2AA", "#A88D83", "#BFAAA0", "#D6C3BD"],
    supports: ["#DFAEA7", "#D6A7BE", "#C98784", "#B99AA3", "#BFA0C8", "#D8B9A6"],
    accents: ["#C98784", "#A7605C", "#B25C76", "#C0799A", "#B67855", "#9E586E"],
    darks: ["#7A3E3F", "#6D5650", "#563F43", "#2E2927", "#4F333D", "#5A3836"]
  },

  seasonal: {
    lights: ["#FFF8E9", "#F6EBD5", "#FFF2DB", "#F0F4E4", "#E7F0F2", "#FAEEE6"],
    neutrals: ["#D9C2A5", "#C9B08E", "#B9A483", "#D7CBB9", "#AFA596", "#C8B89F"],
    supports: ["#A7A47A", "#6E7A58", "#7D9AAA", "#9E8C68", "#B6A15A", "#A68792"],
    accents: ["#F1C46D", "#D9824B", "#A6533D", "#C95D4A", "#C69A3E", "#7E9A55"],
    darks: ["#7C3E32", "#302B26", "#4A5638", "#344957", "#5A3A42", "#60422B"]
  }
};

const defaultTags = ["earthy", "soft", "vintage"];

const paletteRecipes = {
  5: { lights: 1, neutrals: 1, supports: 1, accents: 1, darks: 1 },
  10: { lights: 2, neutrals: 2, supports: 2, accents: 2, darks: 2 },
  20: { lights: 4, neutrals: 4, supports: 4, accents: 4, darks: 4 }
};

document.addEventListener("DOMContentLoaded", () => {
  currentPalette = createIntentionalPalette(defaultTags, paletteSize);
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
  document.querySelectorAll(".page").forEach(page => page.classList.remove("active-page"));

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
    slider.addEventListener("input", () => applyAdjustments());
  });
}

function setupBackgroundSelector() {
  const backgroundSelect = document.getElementById("backgroundSelect");

  if (backgroundSelect) {
    backgroundSelect.addEventListener("change", () => renderPattern());
  }

  const scaleSlider = document.getElementById("scaleSlider");

  if (scaleSlider) {
    scaleSlider.addEventListener("input", () => renderPattern());
  }
}

function setPaletteSize(size) {
  paletteSize = size;
  lockedColors = new Array(size).fill(false);
}

function getSelectedTags() {
  const selected = Array.from(document.querySelectorAll(".tag-grid button.active"))
    .map(button => button.textContent.trim().toLowerCase());

  return selected.length ? selected : defaultTags;
}

function generatePalette() {
  const selectedTags = getSelectedTags();
  const newPalette = createIntentionalPalette(selectedTags, paletteSize);

  const finalPalette = [];

  for (let i = 0; i < paletteSize; i++) {
    if (lockedColors[i] && currentPalette[i]) {
      finalPalette.push(currentPalette[i]);
    } else {
      finalPalette.push(newPalette[i]);
    }
  }

  currentPalette = finalPalette;
  lockedColors = new Array(currentPalette.length).fill(false).map((_, index) => lockedColors[index] || false);

  renderPalette();
  renderPreviewPalette();
  renderPattern();
}

function createIntentionalPalette(tags, size) {
  const recipe = paletteRecipes[size] || paletteRecipes[10];
  const roles = ["lights", "neutrals", "supports", "accents", "darks"];
  const palette = [];

  roles.forEach(role => {
    const count = recipe[role];

    for (let i = 0; i < count; i++) {
      const color = getDistinctRoleColor(tags, role, palette, i);
      palette.push(color);
    }
  });

  return arrangePalette(palette, size);
}

function getDistinctRoleColor(tags, role, existingColors, index) {
  const bank = collectRoleBank(tags, role);

  for (let attempt = 0; attempt < 90; attempt++) {
    const base = bank[Math.floor(Math.random() * bank.length)];
    const candidate = varyWithinRole(base, role, attempt, index);

    if (isDistinctEnough(candidate, existingColors) && fitsRole(candidate, role)) {
      return candidate;
    }
  }

  for (let attempt = 0; attempt < 90; attempt++) {
    const fallbackBank = collectRoleBank(defaultTags, role);
    const base = fallbackBank[Math.floor(Math.random() * fallbackBank.length)];
    const candidate = varyWithinRole(base, role, attempt + 10, index);

    if (isDistinctEnough(candidate, existingColors) && fitsRole(candidate, role)) {
      return candidate;
    }
  }

  return makeEmergencyRoleColor(role, existingColors.length);
}

function collectRoleBank(tags, role) {
  let colors = [];

  tags.forEach(tag => {
    const cleanTag = tag.toLowerCase();
    if (colorBanks[cleanTag] && colorBanks[cleanTag][role]) {
      colors = colors.concat(colorBanks[cleanTag][role]);
    }
  });

  if (!colors.length) {
    defaultTags.forEach(tag => {
      colors = colors.concat(colorBanks[tag][role]);
    });
  }

  return colors;
}

function varyWithinRole(hex, role, attempt, index) {
  const hsl = hexToHsl(hex);

  const roleSettings = {
    lights: {
      hue: 8,
      satMin: 8,
      satMax: 34,
      lightMin: 82,
      lightMax: 96
    },
    neutrals: {
      hue: 10,
      satMin: 8,
      satMax: 30,
      lightMin: 48,
      lightMax: 78
    },
    supports: {
      hue: 16,
      satMin: 20,
      satMax: 48,
      lightMin: 42,
      lightMax: 72
    },
    accents: {
      hue: 22,
      satMin: 42,
      satMax: 78,
      lightMin: 42,
      lightMax: 70
    },
    darks: {
      hue: 12,
      satMin: 18,
      satMax: 52,
      lightMin: 16,
      lightMax: 36
    }
  };

  const settings = roleSettings[role];

  const hueShift = ((attempt * 7) + (index * 13)) % (settings.hue * 2) - settings.hue;
  const saturationShift = ((attempt % 7) - 3) * 3;
  const lightShift = ((attempt % 5) - 2) * 3;

  const newHue = clampHue(hsl.h + hueShift);
  const newSat = clamp(hsl.s + saturationShift, settings.satMin, settings.satMax);
  const newLight = clamp(hsl.l + lightShift, settings.lightMin, settings.lightMax);

  return hslToHex(newHue, newSat, newLight);
}

function fitsRole(hex, role) {
  const hsl = hexToHsl(hex);

  if (role === "lights") return hsl.l >= 80 && hsl.s <= 38;
  if (role === "neutrals") return hsl.l >= 45 && hsl.l <= 80 && hsl.s <= 34;
  if (role === "supports") return hsl.l >= 38 && hsl.l <= 75 && hsl.s >= 16 && hsl.s <= 55;
  if (role === "accents") return hsl.l >= 35 && hsl.l <= 75 && hsl.s >= 38;
  if (role === "darks") return hsl.l <= 38;

  return true;
}

function isDistinctEnough(candidate, existingColors) {
  if (!existingColors.length) return true;

  const c = hexToHsl(candidate);

  return !existingColors.some(existing => {
    const e = hexToHsl(existing);

    let hueDistance = Math.abs(c.h - e.h);
    hueDistance = Math.min(hueDistance, 360 - hueDistance);

    const lightDistance = Math.abs(c.l - e.l);
    const satDistance = Math.abs(c.s - e.s);

    const verySimilar = hueDistance < 20 && lightDistance < 16 && satDistance < 20;
    const sameValueCluster = lightDistance < 8 && satDistance < 12;
    const sameHueCluster = hueDistance < 12 && lightDistance < 24;

    return verySimilar || sameValueCluster || sameHueCluster;
  });
}

function arrangePalette(palette, size) {
  const cleaned = removeNearDuplicates(palette);

  while (cleaned.length < size) {
    const roles = ["lights", "neutrals", "supports", "accents", "darks"];
    const role = roles[cleaned.length % roles.length];
    cleaned.push(getDistinctRoleColor(defaultTags, role, cleaned, cleaned.length));
  }

  const sorted = cleaned.slice(0, size).sort((a, b) => {
    const ah = hexToHsl(a);
    const bh = hexToHsl(b);

    if (Math.abs(bh.l - ah.l) > 12) {
      return bh.l - ah.l;
    }

    return ah.h - bh.h;
  });

  return sorted;
}

function removeNearDuplicates(colors) {
  const finalColors = [];

  colors.forEach(color => {
    if (isDistinctEnough(color, finalColors)) {
      finalColors.push(color);
    }
  });

  return finalColors;
}

function makeEmergencyRoleColor(role, index) {
  const emergency = {
    lights: ["#FAF4EA", "#F5EEE3", "#EEF4F0", "#F7ECE8"],
    neutrals: ["#D0C0AA", "#B8A58C", "#AFA194", "#C8BCAE"],
    supports: ["#A7A88A", "#91A99F", "#B9CAD6", "#D8BDB7"],
    accents: ["#C77750", "#D98263", "#B08A3C", "#A7605C"],
    darks: ["#3E4738", "#2F2D2A", "#4E3B2F", "#243038"]
  };

  return emergency[role][index % emergency[role].length];
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
  const background = backgroundSelect ? backgroundSelect.value : "#fbfaf7";

  const scaleSlider = document.getElementById("scaleSlider");
  const scale = scaleSlider ? scaleSlider.value : 100;

  pattern.style.setProperty("--hero-color", hero);
  pattern.style.setProperty("--support-color", support);
  pattern.style.setProperty("--center-color", dark);
  pattern.style.setProperty("--twig-color", neutral);
  pattern.style.setProperty("--dot-color", dot);
  pattern.style.backgroundColor = background;
  pattern.style.backgroundSize = `${scale * 2.6}px ${scale * 2.6}px`;
}

function shufflePattern() {
  currentPalette = [...currentPalette].sort(() => Math.random() - 0.5);
  renderPalette();
  renderPreviewPalette();
  renderPattern();
}

function savePalette() {
  const defaultName = selectedPaletteIndex !== null && savedPalettes[selectedPaletteIndex]
    ? savedPalettes[selectedPaletteIndex].name
    : "Untitled Palette";

  const paletteName = prompt("Name your palette:", defaultName);
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

  if (selectedPaletteIndex !== null && savedPalettes[selectedPaletteIndex]) {
    const choice = prompt(
      "Save changes as:\n\nType update to replace the existing palette.\nType new to save as a new palette.",
      "new"
    );

    if (!choice) return;

    if (choice.toLowerCase().trim() === "update") {
      paletteObject.id = savedPalettes[selectedPaletteIndex].id;
      paletteObject.favorite = savedPalettes[selectedPaletteIndex].favorite;
      savedPalettes[selectedPaletteIndex] = paletteObject;
    } else {
      savedPalettes.unshift(paletteObject);
      selectedPaletteIndex = 0;
    }
  } else {
    savedPalettes.unshift(paletteObject);
    selectedPaletteIndex = 0;
  }

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

  let h = 0;
  let s = 0;
  let l = (max + min) / 2;

  if (max !== min) {
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
    h,
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
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return "#" + [r, g, b].map(value => {
    const hex = value.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("").toUpperCase();
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function clampHue(value) {
  while (value < 0) value += 360;
  while (value >= 360) value -= 360;
  return value;
}
