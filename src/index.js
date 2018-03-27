import { Observable } from "rxjs";

const previewContainer = document.querySelector("#preview");
const blueprintContainer = document.querySelector("#blueprint");

const previewUrl = "/une";

const blocksToKeep = [
  "bloc_menu_nav_top",
  "bloc_sous_menu_1_1",
  "bloc_sous_menu_1_2",
  "bloc_sous_menu_1_3",
  "bloc_sous_menu_2_1",
  "bloc_sous_menu_3_1",
  "bloc_sous_menu_5_1",
  "bloc_sous_menu_5_2",
  "bloc_sous_menu_6_1",
  "bloc_burger_1",
  "bloc_burger_2",
  "bloc_burger_3",
  "alerte_redac",
  "pub_habillage",
  "pub_megabanner",
  "en_ce_moment",
  "barre_monetisation",
  "evenement_tete",
  "evenement_tete_epinglee",
  "focus_1_4_6",
  "redac",
  "pub_pave",
  "en_continu",
  "pub_ventre",
  "evenement_ventre",
  "demie_page_1_3",
  "demie_page_2_3",
  "bloc_1tiers_1",
  "bloc_1tiers_2",
  "bloc_1tiers_3",
  "bloc_1tiers_insc_nl",
  "bloc_2tiers",
  "bloc_pleine_page_1",
  "journal_abo_1",
  "journal_abo_2",
  "journal_abo_3",
  "taboola",
  "demie_page_1_1",
  "demie_page_1_2",
  "demie_page_2_1",
  "demie_page_2_2",
  "pub_ventre_2",
  "video",
  "bloc_3quarts_1",
  "bloc_3quarts_2",
  "pub_1quart",
  "pleine_page",
  "bloc_1tiers_insolite",
  "bloc_2tiers_plus_popu",
  "pleine_page_2",
  "bloc_1tiers_bis_1",
  "bloc_1tiers_facebook",
  "bloc_1tiers_bis_2_1",
  "bloc_1tiers_bis_2_2",
  "bloc_2tiers_pub",
  "bloc_voyage",
  "bloc_1tiers_ter_1",
  "bloc_1tiers_ter_2",
  "bloc_1tiers_dimoitou",
  "bloc_1tiers_widget",
  "bloc_1tiers_quat_1",
  "bloc_1tiers_quat_2",
  "bloc_annonces_immo",
  "bloc_acommeassur",
  "bloc_1tiers_quiz",
  "bloc_1tiers_cinq_1",
  "bloc_1tiers_cinq_2",
  "bloc_3quarts_redac",
  "bloc_3quarts_1p5",
  "bloc_1quart_pub",
  "bloc_1quart_albumphoto",
  "dma_seo",
  "pub_footer",
  "iframe_widget",
  "bloc_liens_footer"
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
