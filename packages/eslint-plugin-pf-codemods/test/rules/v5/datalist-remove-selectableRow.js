const ruleTester = require("../../ruletester");
const rule = require("../../../lib/rules/v5/datalist-remove-selectableRow");

ruleTester.run("datalist-remove-selectableRow", rule, {
  valid: [
    {
      code: `
      import { DataList } from "@patternfly/react-core";

      const onChange = (event, id) => {};
      function onChangeFunc(event, id) {};
      
      let selectableRowObject = function (event, id) {};
      selectableRowObject = onChangeFunc;
      selectableRowObject = onChange;
      
      let selectableRowObject2 = onChangeFunc;
      selectableRowObject2 = selectableRowObject;
      
      <>
        <DataList onSelectableRowChange={(event, id) => {}} />
        <DataList onSelectableRowChange={onChangeFunc} />
        <DataList onSelectableRowChange={onChange} />
        
        <DataList onSelectableRowChange={selectableRowObject} />
        <DataList onSelectableRowChange={selectableRowObject2} />
      </>;
      `,
    },
    {
      code: `
      import { DataList } from '@patternfly/react-core/dist/esm/components/DataList/index.js'; 

      const onChange = (event, id) => {};
      function onChangeFunc(event, id) {};
      
      let selectableRowObject = function (event, id) {};
      selectableRowObject = onChangeFunc;
      selectableRowObject = onChange;
      
      let selectableRowObject2 = onChangeFunc;
      selectableRowObject2 = selectableRowObject;
      
      <>
        <DataList onSelectableRowChange={(event, id) => {}} />
        <DataList onSelectableRowChange={onChangeFunc} />
        <DataList onSelectableRowChange={onChange} />
        
        <DataList onSelectableRowChange={selectableRowObject} />
        <DataList onSelectableRowChange={selectableRowObject2} />
      </>;
      `,
    },
    {
      // No @patternfly/react-core import
      code: `
      const onChange = (id) => {};
      function onChangeFunc(id, event) {};
      
      const selectableRowObject = { onChange: function (id, event) {} };
      selectableRowObject.onChange = onChangeFunc;
      selectableRowObject["onChange"] = onChange;
      
      let selectableRowObject2 = { onChange: onChangeFunc };
      selectableRowObject2 = selectableRowObject;
      
      <>
        <DataList selectableRow={{ onChange: (id, event) => {} }} />
        <DataList selectableRow={{ onChange: onChangeFunc }} />
        <DataList selectableRow={{ onChange }} />
        
        <DataList selectableRow={selectableRowObject} />
        <DataList selectableRow={selectableRowObject2} />
      </>;
      `,
    },
  ],
  invalid: [
    {
      code: `
      import { DataList } from "@patternfly/react-core";

      const onChange = (id) => {};
      function onChangeFunc(id, event) {};
      
      const selectableRowObject = { onChange: function (id, event) {} };
      selectableRowObject.onChange = onChangeFunc;
      selectableRowObject["onChange"] = onChange;
      
      let selectableRowObject2 = { onChange: onChangeFunc };
      selectableRowObject2 = selectableRowObject;
      
      <>
        <DataList selectableRow={{ onChange: (id, event) => {} }} />
        <DataList selectableRow={{ onChange: onChangeFunc }} />
        <DataList selectableRow={{ onChange }} />
        
        <DataList selectableRow={selectableRowObject} />
        <DataList selectableRow={selectableRowObject2} />
      </>;
      `,
      output: `
      import { DataList } from "@patternfly/react-core";

      const onChange = (event, id) => {};
      function onChangeFunc(event, id) {};
      
      let selectableRowObject = function (event, id) {};
      selectableRowObject = onChangeFunc;
      selectableRowObject = onChange;
      
      let selectableRowObject2 = onChangeFunc;
      selectableRowObject2 = selectableRowObject;
      
      <>
        <DataList onSelectableRowChange={(event, id) => {}} />
        <DataList onSelectableRowChange={onChangeFunc} />
        <DataList onSelectableRowChange={onChange} />
        
        <DataList onSelectableRowChange={selectableRowObject} />
        <DataList onSelectableRowChange={selectableRowObject2} />
      </>;
      `,
      errors: [
        {
          message: `DataList's selectableRow property has been replaced with onSelectableRowChange. The order of the params in the callback has also been updated so that the event param is first.`,
          type: "Program",
        },
        ...Array(5).fill({
          message: `DataList's selectableRow property has been replaced with onSelectableRowChange. The order of the params in the callback has also been updated so that the event param is first.`,
          type: "JSXOpeningElement",
        }),
      ],
    },
  ],
});
