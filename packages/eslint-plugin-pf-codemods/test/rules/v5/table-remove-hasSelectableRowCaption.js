const ruleTester = require("../../ruletester");
const rule = require("../../../lib/rules/v5/table-remove-hasSelectableRowCaption");

ruleTester.run("table-remove-hasSelectableRowCaption", rule, {
  valid: [
    ...["Table", "TableComposable"]
      .map((component) => [
        {
          code: `import { ${component} } from '@patternfly/react-table'; <${component} />`,
        },
        {
          code: `import { ${component} } from '@patternfly/react-table/dist/esm/components/${component}/index.js'; <${component} />`,
        },
        {
          // No @patternfly/react-core import
          code: `<${component} hasSelectableRowCaption />`,
        },
      ])
      .flat(),
  ],
  invalid: [
    ...["Table", "TableComposable"]
      .map((component) => [
        {
          code: `import { ${component} } from '@patternfly/react-table'; <${component} hasSelectableRowCaption />`,
          output: `import { ${component} } from '@patternfly/react-table'; <${component}  />`,
          errors: [
            {
              message: `hasSelectableRowCaption prop for ${component} has been removed`,
              type: "JSXOpeningElement",
            },
          ],
        },
        {
          code: `import { ${component} } from '@patternfly/react-table/dist/esm/components/${component}/index.js'; <${component} hasSelectableRowCaption />`,
          output: `import { ${component} } from '@patternfly/react-table/dist/esm/components/${component}/index.js'; <${component}  />`,
          errors: [
            {
              message: `hasSelectableRowCaption prop for ${component} has been removed`,
              type: "JSXOpeningElement",
            },
          ],
        },
      ])
      .flat(),
  ],
});
