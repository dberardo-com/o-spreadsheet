import { Spreadsheet } from "./spreadsheet/spreadsheet.js";

const { whenReady } = owl.utils;
const { Component } = owl;
const { xml, css } = owl.tags;

class App extends Component {
    static template = xml`<Spreadsheet data="data"/>`;
    static style = css`
        html {
            height: 100%;
            body {
                height: 100%;
                margin: 0px;
            }
            .o-spreadsheet {
                width: 100%;
                height: 100%;
            }
        }`;
    static components = { Spreadsheet };

    data = {
        colNumber: 26,
        rowNumber: 100,
        cols: { 3: { size: 200 }, 5: { size: 130 } },
        rows: { 6: { size: 60 } },
        cells: {
            B3: { content: "43" },
            D4: { content: "=2*B3" }
        },
    };
}

// Setup code
function setup() {
    const app = new App();
    app.mount(document.body);
}
whenReady(setup);

