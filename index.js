const bcd = require("@mdn/browser-compat-data");
const lite = require("caniuse-lite");

const BROWSERS = [
  "chrome",
  "chrome_android",
  "edge",
  "firefox",
  "firefox_android",
  "ie",
  "opera",
  "safari",
  "safari_ios",
  "samsunginternet_android",
];

const CANIUSE_BROWSERS = {
  chrome: "chrome",
  chrome_android: "and_chr",
  edge: "edge",
  firefox: "firefox",
  firefox_android: "and_ff",
  ie: "ie",
  opera: "opera",
  safari: "safari",
  safari_ios: "ios_saf",
  samsunginternet_android: "samsung",
};

const BROWSER_LABELS = {
  chrome: "Chrome",
  chrome_android: "Chrome Android",
  edge: "Edge",
  firefox: "Firefox",
  firefox_android: "Firefox for Android",
  ie: "Internet Explorer",
  opera: "Opera",
  safari: "Safari",
  safari_ios: "Safari on iOS",
  samsunginternet_android: "Samsung Internet",
};

const cssBrowserSupport = (request) => {
  const report = {};
  let list = Array.isArray(request) ? request : [request];

  list = list.map((i) => i.trim());

  if (list.includes("gap")) {
    list.splice(list.indexOf("gap"), 1);
    list.push("gap - flexbox");
    list.push("gap - grid");
  }

  for (let item of list) {
    item = item.trim().replace(/@|:|\(|\)*/g, "");

    let itemType;
    if (item.includes("gap")) itemType = bcd.css.properties.gap;
    else if (item in bcd.css.properties) itemType = bcd.css.properties;
    else if (item in bcd.css.properties["grid-template-columns"])
      itemType = bcd.css.properties["grid-template-columns"];
    else if (item in bcd.css.selectors) itemType = bcd.css.selectors;
    else if (item in bcd.css.types) itemType = bcd.css.types;
    else if (item in bcd.css.types.color) itemType = bcd.css.types.color;
    else if (item in bcd.css["at-rules"]) itemType = bcd.css["at-rules"];

    if (itemType) {
      let itemGlobalSupportAll = 0;
      let gapItem = false;

      if (item.includes("gap")) {
        gapItem = item;
        item = item.includes("flexbox") ? "flex_context" : "grid_context";
      }

      const reportKey = gapItem ? gapItem : item;
      report[reportKey] = {};

      BROWSERS.map((browser) => {
        let versionAddedProp;
        let flagged = false;

        const supportBrowser = itemType[item].__compat.support[browser];

        if (Array.isArray(supportBrowser)) {
          // E.g. CSS property with prefixes
          if (supportBrowser[1].flags) {
            flagged = true;
          }
          versionAddedProp = supportBrowser[0].version_added;
        } else if (supportBrowser) {
          versionAddedProp = supportBrowser.version_added;

          if (supportBrowser.flags) {
            flagged = true;
          }
        }

        // Global usage
        let globalUsage = 0;
        if (versionAddedProp) {
          const caniuseBrowser = CANIUSE_BROWSERS[browser];
          const browserVersions = lite.agents[caniuseBrowser].usage_global;

          for (let v in browserVersions) {
            if (
              parseInt(v) >= versionAddedProp ||
              v.includes(versionAddedProp)
            ) {
              globalUsage += browserVersions[v];
            }
          }
        }

        itemGlobalSupportAll += globalUsage;

        report[reportKey][browser] = {
          sinceVersion: versionAddedProp,
          flagged,
          globalSupport: parseFloat(globalUsage.toFixed(2)),
          browserTitle: BROWSER_LABELS[browser],
        };
      });

      report[reportKey].globalSupport = parseFloat(
        itemGlobalSupportAll.toFixed(2)
      );
    }
  }

  // Return false for empty report
  return Object.keys(report).length === 0 ? false : report;
};

module.exports = { cssBrowserSupport, BROWSERS };
