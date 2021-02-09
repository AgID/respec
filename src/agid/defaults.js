// @ts-check
/**
 * Sets the defaults for AGID specs
 */
export const name = "agid/defaults";
import { coreDefaults } from "../core/defaults.js";
import linter from "../core/linter.js";
import { rule as privsecSectionRule } from "../core/linter-rules/privsec-section.js";
import { rule as wptTestsExist } from "../core/linter-rules/wpt-tests-exist.js";

linter.register(privsecSectionRule, wptTestsExist);

const agidLogo = {
  src: "https://agid.github.io/respec-style/logos/agid.png",
  alt: "AgID",
  height: 96,
  width: 207,
  url: "https://www.agid.gov.it/",
};

const agidDefaults = {
  lint: {
    "privsec-section": true,
    "wpt-tests-exist": false,
  },
  doJsonLd: false,
  license: "cc-by",
  logos: [],
  xref: true,
};

export function run(conf) {
  // assign the defaults
  const lint =
    conf.lint === false
      ? false
      : {
          ...coreDefaults.lint,
          ...agidDefaults.lint,
          ...conf.lint,
        };

  if (conf.specStatus && conf.specStatus.toLowerCase() !== "unofficial") {
    agidDefaults.logos.push(agidLogo);
  }
  Object.assign(conf, {
    ...coreDefaults,
    ...agidDefaults,
    ...conf,
    lint,
  });
}
