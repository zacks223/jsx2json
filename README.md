# jsx2json
A tool for transforming jsx to json or reverse, easy to analyse jsx with json form.

## Usage
```
const { jsxToJson } = require('jsx2json');
const result = jsonToJson(`
    <Layout>
        <Row style={{ padding: 10, backgroundColor: "#EFEFEF" }}>
            <CustomDiv
                style={{ fontSize: "80%" }}
                options= {[
                    { name: "选项1", value: 1 },
                    { name: "选项2", value: 2 },
                ]}
            />
            <Custom.Button>
                <div>buttontext</div>
            </Custom.Button>
        </Row>
    </Layout>
`);

// Result
{
  "type": "Layout",
  "children": [
    {
      "type": "Row",
      "props": {
        "style": {
          "padding": 10,
          "backgroundColor": "#EFEFEF"
        }
      },
      "children": [
        {
          "type": "CustomDiv",
          "props": {
            "style": {
              "fontSize": "80%"
            },
            "options": [
              {
                "name": "选项1",
                "value": 1
              },
              {
                "name": "选项2",
                "value": 2
              }
            ]
          }
        },
        {
          "type": "Button",
          "parentType": "Custom",
          "children": [
            {
              "type": "div",
              "children": [
                {
                  "type": "text",
                  "text": "buttontext"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```