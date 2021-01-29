const $ci = require("../rules/ci");
const $dependencies = require("../rules/dependencies");
const $files = require("../rules/files");
const $node = require("../rules/node");
const $python = require("../rules/python");

module.exports = {
  async meta(files = []) {
    // An array of "rules" classes to loop over.
    const RULE_CLASSES = [$ci, $dependencies, $files, $node, $python];
    const rules = {};
    rules.fetched_at = new Date();
    for (const RuleClass of RULE_CLASSES) {
      // Create a new instance of each rule class and pass the `files[]` array to it's constructor.
      const ruleClass = new RuleClass(files);
      // Flatten each rule name/function into a single object.
      for (const [name, fn] of Object.entries(ruleClass)) {
        rules[name] = await fn;
      }
    }
    return rules;
  },
};
