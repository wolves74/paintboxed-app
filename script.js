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
