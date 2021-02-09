// @ts-check
import { getIntlData } from "../../core/utils.js";
import { html } from "../../core/import-maps.js";

const localizationStrings = {
  en: {
    sotd: "Status of This Document",
  },
  it: {
    sotd: "Stato di questo documento",
  },
  nl: {
    sotd: "Status van dit document",
  },
  es: {
    sotd: "Estado de este Document",
  },
  de: {
    sotd: "Status dieses Dokuments",
  },
};

export const l10n = getIntlData(localizationStrings);

export default (conf, opts) => {
  return html`
    <h2>${l10n.sotd}</h2>
    ${conf.isPreview ? renderPreview(conf) : ""}
    ${conf.isUnofficial
      ? renderIsUnofficial(opts)
      : conf.isTagFinding
      ? opts.additionalContent
      : conf.isNoTrack
      ? renderIsNoTrack(conf, opts)
      : html`
          <p><em>${conf.l10n.status_at_publication}</em></p>
          ${conf.isSubmission
            ? noteForSubmission(conf, opts)
            : html`
                ${!conf.sotdAfterWGinfo ? opts.additionalContent : ""}
                ${!conf.overrideStatus
                  ? html`
                      ${linkToWorkingGroup(conf)} ${linkToCommunity(conf, opts)}
                    `
                  : ""}
                ${conf.sotdAfterWGinfo ? opts.additionalContent : ""}
                ${conf.isRec ? renderIsRec(conf) : renderNotRec(conf)}
                ${renderDeliverer(conf)}
                <p>
                  L’adozione e la pubblicazione di questo documento come Linea Guida sono regolate dall’<a
                    id="w3c_process_revision"
                    href="https://docs.italia.it/italia/piano-triennale-ict/codice-amministrazione-digitale-docs/it/v2017-12-13/_rst/capo7_art71.html"
                    >art. 71 del CAD</a
                  > e dal <a href="https://trasparenza.agid.gov.it/archivio19_regolamenti_0_5376.html"><i>Regolamento per l’adozione di Linee Guida per l’attuazione del Codice dell’Amministrazione Digitale</i></a>.
                </p>
                ${conf.addPatentNote
                  ? html`<p>${[conf.addPatentNote]}</p>`
                  : ""}
              `}
        `}
    ${opts.additionalSections}
  `;
};

export function renderPreview(conf) {
  const { prUrl, prNumber, edDraftURI } = conf;
  return html`<details class="annoying-warning" open="">
    <summary>
      This is a
      preview${prUrl && prNumber
        ? html`
            of pull request
            <a href="${prUrl}">#${prNumber}</a>
          `
        : ""}
    </summary>
    <p>
      Do not attempt to implement this version of the specification. Do not
      reference this version as authoritative in any way.
      ${edDraftURI
        ? html`
            Instead, see
            <a href="${edDraftURI}">${edDraftURI}</a> for the Editor's draft.
          `
        : ""}
    </p>
  </details>`;
}

function renderIsUnofficial(opts) {
  const { additionalContent } = opts;
  return html`
    <p>
      This document is a draft of a potential specification. It has no official
      standing of any kind and does not represent the support or consensus of
      any standards organisation.
    </p>
    ${additionalContent}
  `;
}

function renderIsNoTrack(conf, opts) {
  const { isMO } = conf;
  const { additionalContent } = opts;
  return html`
    <p>
      This document is merely a W3C-internal
      ${isMO ? "member-confidential" : ""} document. It has no official standing
      of any kind and does not represent consensus of the W3C Membership.
    </p>
    ${additionalContent}
  `;
}

function renderNotRec(conf) {
  let statusExplanation = "";
  let updatePolicy = html`Questo documento è la bozza finale delle Linee Guida e
  potrà essere aggiornato e revisionato a seguito dei commenti pervenuti. Non è
  appropriato citare questo documento se non come lavoro in corso.
  ${conf.updateableRec
    ? html`Future updates to this specification may incorporate
        <a href="https://joinup.ec.europa.eu/solution/dcat-application-profile-data-portals-europe/document/change-and-release-management-policy-dcat-ap"
          >new features</a
        >.`
    : ""}`;
  let reviewPolicy = "";
  if (conf.specStatus === "CRD") {
    statusExplanation =
      "A Candidate Recommendation Draft integrates changes from the previous Candidate Recommendation that the Working Group intends to include in a subsequent Candidate Recommendation Snapshot.";
    if (conf.pubMode === "LS") {
      updatePolicy =
        "This document is maintained and updated at any time. Some parts of this document are work in progress. ";
    }
  } else if (conf.specStatus === "CR") {
    statusExplanation = html`A Candidate Recommendation Snapshot has received
      <a href="https://joinup.ec.europa.eu/solution/dcat-application-profile-data-portals-europe/document/change-and-release-management-policy-dcat-ap"
        >wide review</a
      >
      and is intended to gather
      <a href="${conf.implementationReportURI}">implementation experience</a>.`;
    updatePolicy = html`${conf.updateableRec
      ? html`Future updates to this specification may incorporate
          <a
            href="https://joinup.ec.europa.eu/solution/dcat-application-profile-data-portals-europe/document/change-and-release-management-policy-dcat-ap"
            >new features</a
          >.`
      : ""}`;
    if (conf.pubMode === "LS") {
      reviewPolicy = `Comments are welcome at any time but most especially before ${conf.humanCREnd}.`;
    } else {
      reviewPolicy = `This Candidate Recommendation is not expected to advance to Proposed Recommendation any earlier than ${conf.humanCREnd}.`;
    }
  } else if (conf.specStatus === "LC") {
    reviewPolicy = html` Interested parties are
      invited to review the document and send comments through
      ${conf.humanPREnd}.`;
  } else if (conf.isPR) {
    reviewPolicy = html``;

    reviewPolicy = html` Tutti gli interessati sono invitati
      a inviare commenti e proposte di modifica del presente documento attraverso gli
      strumenti ed entro la data indicati innanzi. `;

  } else if (conf.isPER) {
    reviewPolicy = html``;
  }
  return html``;
}

function renderIsRec({
  updateableRec,
  revisionTypes = [],
  humanRevisedRecEnd,
}) {
  let reviewTarget = "";
  if (revisionTypes.includes("addition")) {
    reviewTarget = "additions";
  }
  if (revisionTypes.includes("correction") && !reviewTarget) {
    reviewTarget = "corrections";
  }
  return html`<p>
      Le Linee Guida sono un documento di specifica che, dopo aver seguito l’iter di cui
      all’art. 71 del CAD, è adottato con determinazione del DG di AgID, diventando
      efficace il giorno successivo a quello dopo la loro pubblicazione sul sito di AgID.
      Di tale pubblicazione ne è data notizia nella Gazzetta Ufficiale della Repubblica italiana.
      ${updateableRec
        ? html`Le presenti linee guida possono essere aggiornate periodicamente
        secondo le modalità di cui al
            <a
              href="https://trasparenza.agid.gov.it/archivio19_regolamenti_0_5376.html"
              >Regolamento per l’adozione di Linee Guida</a
            >.`
        : ""}
    </p>
    ${revisionTypes.includes("addition")
      ? html`<p class="addition">
          Proposed additions are marked in the document.
        </p>`
      : ""}
    ${revisionTypes.includes("correction")
      ? html`<p class="correction">
          Proposed corrections are marked in the document.
        </p>`
      : ""}
    ${reviewTarget
      ? html`<p>
          Interested parties are invited to review
          the proposed ${reviewTarget} and send comments through
          ${humanRevisedRecEnd}.
        </p>`
      : ""} `;
}

function renderDeliverer(conf) {
  const {
    isNote,
    wgId,
    isIGNote,
    multipleWGs,
    recNotExpected,
    wgPatentHTML,
    wgPatentURI,
    charterDisclosureURI,
    wgPatentPolicy,
  } = conf;

  const patentPolicyURL =
    wgPatentPolicy === "PP2017"
      ? "https://www.w3.org/Consortium/Patent-Policy-20170801/"
      : "https://www.w3.org/Consortium/Patent-Policy/";

  const producers = !isIGNote
    ? html`
        This document was produced by ${multipleWGs ? "groups" : "a group"}.
      `
    : "";
  const wontBeRec = recNotExpected
    ? "The group does not expect this document to become a Recommendation."
    : "";
  return html``;
}

function noteForSubmission(conf, opts) {
  return html`
    ${opts.additionalContent}
    ${conf.isMemberSubmission
      ? noteForMemberSubmission(conf)
      : conf.isTeamSubmission
      ? noteForTeamSubmission(conf, opts)
      : ""}
  `;
}

function noteForMemberSubmission(conf) {
  const teamComment = `https://www.w3.org/Submission/${conf.publishDate.getUTCFullYear()}/${
    conf.submissionCommentNumber
  }/Comment/`;

  const patentPolicyURL =
    conf.wgPatentPolicy === "PP2017"
      ? "https://www.w3.org/Consortium/Patent-Policy-20170801/"
      : "https://www.w3.org/Consortium/Patent-Policy/";

  return html``;
}

function noteForTeamSubmission(conf, opts) {
  return html`
    ${renderPublicList(conf, opts)}
    <p>
      Please consult the complete
      <a href="https://www.w3.org/TeamSubmission/">list of Team Submissions</a>.
    </p>
  `;
}

export function renderPublicList(conf, opts) {
  const {
    mailToWGPublicListWithSubject,
    mailToWGPublicListSubscription,
  } = opts;
  const { wgPublicList, subjectPrefix } = conf;
  const archivesURL = `https://lists.w3.org/Archives/Public/${wgPublicList}/`;
  return html`<p>
    If you wish to make comments regarding this document, please send them to
    <a href="${mailToWGPublicListWithSubject}">${wgPublicList}@w3.org</a>
    (<a href="${mailToWGPublicListSubscription}">subscribe</a>,
    <a href="${archivesURL}">archives</a>)${subjectPrefix
      ? html` with <code>${subjectPrefix}</code> at the start of your email's
          subject`
      : ""}.
  </p>`;
}

function linkToWorkingGroup(conf) {
  if (!conf.wg) {
    return;
  }
  let proposedChanges = null;
  if (conf.isRec && conf.revisionTypes && conf.revisionTypes.length) {
    if (conf.revisionTypes.includes("addition")) {
      if (conf.revisionTypes.includes("correction")) {
        proposedChanges = html`It includes
          <a href="https://joinup.ec.europa.eu/solution/dcat-application-profile-data-portals-europe/document/change-and-release-management-policy-dcat-ap"
            >proposed changes</a
          >, introducing substantive changes and new features since the previous
          Recommentation.`;
      } else {
        proposedChanges = html`It includes
          <a href="https://joinup.ec.europa.eu/solution/dcat-application-profile-data-portals-europe/document/change-and-release-management-policy-dcat-ap"
            >proposed additions</a
          >, introducing new features since the previous Recommentation.`;
      }
    } else if (conf.revisionTypes.includes("correction")) {
      proposedChanges = html`It includes
        <a href="https://joinup.ec.europa.eu/solution/dcat-application-profile-data-portals-europe/document/change-and-release-management-policy-dcat-ap"
          >proposed corrections</a
        >.`;
    }
  }
  return html`<p>
    Questo documento è pubblicato da ${conf.wgHTML} come ${conf.anOrA}
    ${conf.longStatus}. ${proposedChanges}
    ${conf.notYetRec
      ? "Questo documento diventerà una Linea Guida secondo l'art. 71 del CAD."
      : ""}
  </p>`;
}

function linkToCommunity(conf, opts) {
  if (!conf.github && !conf.wgPublicList) {
    return;
  }
  return html`<p>
    ${conf.github
      ? html``
      : ""}
    ${conf.wgPublicList
      ? html``
      : ""}
  </p>`;
}
