const ruleTester = require("../../ruletester");
const rule = require("../../../lib/rules/v5/emptyState-rename-components");

// This rule first renames the EmptyStatePrimary and EmptyStateSecondaryActions elements to EmptyStateActions.
// After renaming, it removes the unused EmptyStatePrimary and EmptyStateSecondaryActions imports.
// Removing imports does not occur until these imports are unused - they become unused once all elements are renamed.
//
// According to the documentation: https://eslint.org/docs/latest/extend/custom-rules#applying-fixes ...
// "After applying fixes, ESLint will run all of the enabled rules again on the fixed code, potentially applying more fixes. 
//  This process will repeat up to 10 times, or until no more fixable problems are found. "
//
// ... that is why in the tests, the imports are not removed immediately, but will be removed on the next run of rules
// from the consumers point of view, he does not see that rules are applied up to 10 times, but tests cover always 1 rule run

ruleTester.run("emptyState-rename-components", rule, {
  valid: [
    {
      code: `import { EmptyStateActions } from '@patternfly/react-core';
      <>
        <EmptyStateActions>Primary action</EmptyStateActions>
        <EmptyStateActions>Other actions</EmptyStateActions>
      </>`,
    },
    {
      // No @patternfly/react-core import
      code: `<>
        <EmptyStatePrimary>Primary action</EmptyStatePrimary>
        <EmptyStateSecondaryActions>Other actions</EmptyStateSecondaryActions>
      </>`,
    },
  ],
  invalid: [
    {
      code: `import { EmptyStateSecondaryActions } from '@patternfly/react-core'; <EmptyStateSecondaryActions>Other actions</EmptyStateSecondaryActions>`,
      output: `import { EmptyStateSecondaryActions, EmptyStateActions } from '@patternfly/react-core'; <EmptyStateActions>Other actions</EmptyStateActions>`,
      errors: [
        {
          message:
            "add missing imports EmptyStateActions from @patternfly/react-core",
          type: "ImportDeclaration",
        },
        {
          message:
            "EmptyStateSecondaryActions has been replaced with EmptyStateActions",
          type: "JSXElement",
        },
      ],
    },
    { // after second run of the rule
      code: `import { EmptyStateSecondaryActions, EmptyStateActions } from '@patternfly/react-core'; <EmptyStateActions>Other actions</EmptyStateActions>`,
      output: `import { EmptyStateActions } from '@patternfly/react-core'; <EmptyStateActions>Other actions</EmptyStateActions>`,
      errors: [
        {
          message: "unused patternfly import EmptyStateSecondaryActions",
          type: "ImportDeclaration",
        },
      ],
    },
    {
      code: `import { EmptyStatePrimary } from '@patternfly/react-core'; <EmptyStatePrimary>Primary action</EmptyStatePrimary>`,
      output: `import { EmptyStatePrimary, EmptyStateActions } from '@patternfly/react-core'; <EmptyStateActions>Primary action</EmptyStateActions>`,
      errors: [
        {
          message:
            "add missing imports EmptyStateActions from @patternfly/react-core",
          type: "ImportDeclaration",
        },
        {
          message: "EmptyStatePrimary has been replaced with EmptyStateActions",
          type: "JSXElement",
        },
      ],
    },
    { // after second run of the rule
      code: `import { EmptyStatePrimary, EmptyStateActions } from '@patternfly/react-core'; <EmptyStateActions>Primary action</EmptyStateActions>`,
      output: `import { EmptyStateActions } from '@patternfly/react-core'; <EmptyStateActions>Primary action</EmptyStateActions>`,
      errors: [
        {
          message: "unused patternfly import EmptyStatePrimary",
          type: "ImportDeclaration",
        },
      ],
    },
    {
      code: `import { EmptyStatePrimary as Primary } from '@patternfly/react-core'; <Primary>Primary action</Primary>`,
      output: `import { EmptyStatePrimary as Primary, EmptyStateActions } from '@patternfly/react-core'; <EmptyStateActions>Primary action</EmptyStateActions>`,
      errors: [
        {
          message:
            "add missing imports EmptyStateActions from @patternfly/react-core",
          type: "ImportDeclaration",
        },
        {
          message: "EmptyStatePrimary has been replaced with EmptyStateActions",
          type: "JSXElement",
        },
      ],
    },
    { // after second run of the rule
      code: `import { EmptyStatePrimary as Primary, EmptyStateActions } from '@patternfly/react-core'; <EmptyStateActions>Primary action</EmptyStateActions>`,
      output: `import { EmptyStateActions } from '@patternfly/react-core'; <EmptyStateActions>Primary action</EmptyStateActions>`,
      errors: [
        {
          message:
            "unused patternfly import Primary",
          type: "ImportDeclaration",
        },
      ],
    },
    {
      code: `import { EmptyStatePrimary, EmptyStateSecondaryActions } from '@patternfly/react-core';
      <>
        <EmptyStatePrimary>Primary action</EmptyStatePrimary>
        <EmptyStateSecondaryActions>Secondary</EmptyStateSecondaryActions>
      </>`,
      output: `import { EmptyStatePrimary, EmptyStateSecondaryActions, EmptyStateActions } from '@patternfly/react-core';
      <>
        <EmptyStateActions>Primary action</EmptyStateActions>
        <EmptyStateActions>Secondary</EmptyStateActions>
      </>`,
      errors: [
        {
          message: "add missing imports EmptyStateActions from @patternfly/react-core",
          type: "ImportDeclaration",
        },
        {
          message: "EmptyStatePrimary has been replaced with EmptyStateActions",
          type: "JSXElement",
        },
        {
          message:
            "EmptyStateSecondaryActions has been replaced with EmptyStateActions",
          type: "JSXElement",
        },
      ],
    },
    { // after second run of the rule
      code: `import { EmptyStatePrimary, EmptyStateSecondaryActions, EmptyStateActions } from '@patternfly/react-core';
      <>
        <EmptyStateActions>Primary action</EmptyStateActions>
        <EmptyStateActions>Secondary</EmptyStateActions>
      </>`,
      output: `import { EmptyStateActions } from '@patternfly/react-core';
      <>
        <EmptyStateActions>Primary action</EmptyStateActions>
        <EmptyStateActions>Secondary</EmptyStateActions>
      </>`,
      errors: [
        {
          message: "unused patternfly imports EmptyStatePrimary, EmptyStateSecondaryActions",
          type: "ImportDeclaration",
        },
      ],
    },
  ],
});
