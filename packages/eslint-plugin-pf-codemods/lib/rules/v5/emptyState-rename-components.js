const { ensureImports, getPackageImports } = require("../../helpers");

// https://github.com/patternfly/patternfly-react/pull/8737
module.exports = {
  meta: { fixable: "code" },
  create: function (context) {
    const pfPackage = "@patternfly/react-core";
    const oldNames = ["EmptyStatePrimary", "EmptyStateSecondaryActions"];

    const imports = getPackageImports(context, pfPackage).filter((specifier) =>
      oldNames.includes(specifier.imported.name)
    );

    const importNames = Object.fromEntries(
      imports.map((imp) => [imp.local.name, imp.imported.name])
    );

    const newName = "EmptyStateActions";

    return imports.length == 0
      ? {}
      : {
          ImportDeclaration(node) {
            if (node.source.value != pfPackage) {
              return;
            }

            const allTokens = context
              .getSourceCode()
              .ast.body.filter((node) => node.type !== "ImportDeclaration")
              .map((node) =>
                context
                  .getSourceCode()
                  .getTokens(node)
                  .map((token) => token.value)
              )
              .reduce((acc, val) => acc.concat(val), []);

            const unusedImports = imports.filter(
              (spec) => !allTokens.includes(spec.local.name)
            );

            if (unusedImports.length != oldNames.length) {
              ensureImports(context, node, pfPackage, [newName]);
            }

            if (unusedImports.length == 0) {
              return;
            }

            context.report({
              node,
              message: `unused patternfly import${
                unusedImports.length > 1 ? "s" : ""
              } ${unusedImports.map((spec) => spec.local.name).join(", ")}`,
              fix(fixer) {
                const getEndRange = (spec) => {
                  const nextComma = context.getSourceCode().getTokenAfter(spec);

                  return context.getSourceCode().getText(nextComma) === ","
                    ? context.getSourceCode().getTokenAfter(nextComma).range[0]
                    : spec.range[1];
                };

                return [
                  ...unusedImports.map((spec) =>
                    fixer.removeRange([spec.range[0], getEndRange(spec)])
                  ),
                ];
              },
            });
          },
          JSXElement(node) {
            const openingIdentifier = node.openingElement.name;

            if (openingIdentifier?.name in importNames) {
              context.report({
                node,
                message: `${
                  importNames[openingIdentifier?.name]
                } has been replaced with ${newName}`,
                fix(fixer) {
                  return [
                    fixer.replaceText(openingIdentifier, newName),
                    ...(node.closingElement
                      ? [fixer.replaceText(node.closingElement.name, newName)]
                      : []),
                  ];
                },
              });
            }
          },
        };
  },
};
