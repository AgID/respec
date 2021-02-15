// @ts-check
// Module agid/conformance
// Handle the conformance section properly.
import { getIntlData, htmlJoinAnd } from "../core/utils.js";
import { html } from "../core/import-maps.js";
import { pub } from "../core/pubsubhub.js";
import { renderInlineCitation } from "../core/render-biblio.js";
import { rfc2119Usage } from "../core/inlines.js";
export const name = "agid/conformance";

const localizationStrings = {
  en: {
    conformance: "Conformance",
    normativity:
      "As well as sections marked as non-normative, all authoring guidelines, " +
      "diagrams, examples, and notes in this specification are non-normative. " +
      "Everything else in this specification is normative.",
    keywordInterpretation(keywords, plural) {
      return html`<p>
        The key word${plural ? "s" : ""} ${keywords} in this document
        ${plural ? "are" : "is"} to be interpreted as described in
        <a href="https://tools.ietf.org/html/bcp14">BCP 14</a>
        ${renderInlineCitation("RFC2119")} ${renderInlineCitation("RFC8174")}
        when, and only when, they appear in all capitals, as shown here.
      </p>`;
    },
  },
  it: {
    conformance: "Conformità",
    normativity:
      "Oltre alle sezioni contrassegnate come non-normative, " +
      "diagrammi, esempi e note in questa specifica sono non-normativi. " +
      "Tutto il resto in questa specifica è normativo.",
    keywordInterpretation(keywords, plural) {
      return html`<p>
        The key word${plural ? "s" : ""} ${keywords} in this document
        ${plural ? "are" : "is"} to be interpreted as described in
        <a href="https://tools.ietf.org/html/bcp14">BCP 14</a>
        ${renderInlineCitation("RFC2119")} ${renderInlineCitation("RFC8174")}
        when, and only when, they appear in all capitals, as shown here.
      </p>`;
    },
  },
  de: {
    conformance: "Anforderungen",
    normativity:
      "Neben den explizit als nicht-normativ gekennzeichneten Abschnitten " +
      "sind auch alle Diagramme, Beispiele und Hinweise in diesem Dokument " +
      "nicht normativ. Alle anderen Angaben sind normativ.",
    keywordInterpretation(keywords, plural) {
      return html`<p>
        ${plural ? "Die Schlüsselwörter" : "Das Schlüsselwort"} ${keywords} in
        diesem Dokument ${plural ? "sind" : "ist"} gemäß
        <a href="https://tools.ietf.org/html/bcp14">BCP 14</a>
        ${renderInlineCitation("RFC2119")} ${renderInlineCitation("RFC8174")}
        und unter Berücksichtigung von
        <a href="https://github.com/adfinis-sygroup/2119/blob/master/2119de.rst"
          >2119de</a
        >
        zu interpretieren, wenn und nur wenn ${plural ? "sie" : "es"} wie hier
        gezeigt durchgehend groß geschrieben wurde${plural ? "n" : ""}.
      </p>`;
    },
  },
};
const l10n = getIntlData(localizationStrings);

/**
 * @param {Element} conformance
 * @param {*} conf
 */
function processConformance(conformance, conf) {
  const terms = [...Object.keys(rfc2119Usage)];
  // Add RFC2119 to bibliography
  if (terms.length) {
    conf.normativeReferences.add("RFC2119");
    conf.normativeReferences.add("RFC8174");
  }
  // Put in the 2119 clause and reference
  const keywords = htmlJoinAnd(
    terms.sort(),
    item => html`<em class="rfc2119">${item}</em>`
  );
  const plural = terms.length > 1;
  const content = html`
    <h2>${l10n.conformance}</h2>
    <p>${l10n.normativity}</p>
    ${terms.length ? l10n.keywordInterpretation(keywords, plural) : null}
  `;
  conformance.prepend(...content.childNodes);
}

export function run(conf) {
  const conformance = document.querySelector("section#conformance");
  if (conformance && !conformance.classList.contains("override")) {
    processConformance(conformance, conf);
  }
  // Warn when there are RFC2119/RFC8174 keywords, but not conformance section
  if (!conformance && Object.keys(rfc2119Usage).length) {
    pub(
      "warn",
      "Document uses RFC2119 keywords but lacks a conformance section. " +
        'Please add a `<section id="conformance">`.'
    );
  }
}