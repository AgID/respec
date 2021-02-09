// @ts-check
// Module agid/abstract
// Handle the abstract section properly.
import { getIntlData } from "../core/utils.js";
import { pub } from "../core/pubsubhub.js";
export const name = "agid/abstract";

const localizationStrings = {
  en: {
    abstract: "Foreword",
  },
  it: {
    abstract: "Prefazione",
  },
  es: {
    abstract: "Prefacio",
  },
  fr: {
    abstract: "Préface",
  },
  de: {
    abstract: "Vorwort",
  },
};
const l10n = getIntlData(localizationStrings);

export async function run() {
  const abs = document.getElementById("abstract");
  if (!abs) {
    pub("error", `Document must have one element with \`id="abstract"`);
    return;
  }
  abs.classList.add("introductory");
  let abstractHeading = document.querySelector("#abstract>h2");
  if (abstractHeading) {
    return;
  }
  abstractHeading = document.createElement("h2");
  abstractHeading.textContent = l10n.abstract;
  abs.prepend(abstractHeading);
}
