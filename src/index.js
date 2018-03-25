import { Observable } from "rxjs";

const previewContainer = document.querySelector("#preview");
const blueprintContainer = document.querySelector("#blueprint");

const previewUrl = "/une";

const blocksToKeep = [
  "bloc_menu_nav_top",
  "evenement_tete",
  "demie_page_1_3",
  "demie_page_2_3",
  "en_continu",
  "focus_1_4_6"
];

// Emits the content document of the preview iframe each time it changes
const pages = Observable.create(observer => {
  const iframeElement = document.createElement("iframe");
  iframeElement.title = "previewFrame";
  iframeElement.addEventListener("load", () =>
    observer.next(iframeElement.contentDocument)
  );
  previewContainer.appendChild(iframeElement);
  iframeElement.src = previewUrl;
});

// Transforms a document into a list of elements that can contain blocks
const extractElements = doc => [...doc.querySelectorAll("div[id]")];

const getBlockInfo = elem => ({
  name: elem.id,
  x: elem.getBoundingClientRect().left,
  y: elem.getBoundingClientRect().top,
  width: elem.scrollWidth,
  height: elem.scrollHeight
});
const scale = ({ x, y, width, height, ...block }) => ({
  ...block,
  x: x / 2,
  y: y / 2,
  width: width / 2,
  height: height / 2
});

// Builds a blueprint based on a list of elements
const buildBlueprint = elements =>
  elements
    .map(getBlockInfo)
    .filter(b => blocksToKeep.indexOf(b.name) !== -1)
    .map(scale);

// Draw BlockInfo in the viewPort
function draw(blocks) {
  const viewport = document.querySelector("#viewport");
  while (viewport.firstChild) {
    viewport.removeChild(viewport.firstChild);
  }

  console.log(blocks);

  blocks.forEach(({ name, x, y, width, height }) => {
    const elem = document.createElement("div");
    elem.className = "previewElement";
    elem.dataset.blockName = name;
    elem.style.backgroundColor = "tomato";
    elem.style.border = "1px dotted black";
    elem.style.position = "absolute";
    elem.style.left = `${x}px`;
    elem.style.top = `${y}px`;
    elem.style.width = `${width}px`;
    elem.style.height = `${height}px`;
    viewport.appendChild(elem);
  });
}

pages
  .map(extractElements)
  .map(buildBlueprint)
  .subscribe(draw);
