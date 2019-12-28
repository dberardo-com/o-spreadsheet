const { Component } = owl;
const { xml, css } = owl.tags;

const TEMPLATE = xml/* xml */ `
    <input class="o-composer" t-att-style="style"
      t-on-input="onInput"
      t-on-keydown="onKeydown" />
  `;

const CSS = css/* scss */ `
  .o-composer {
    position: absolute;
    border: none;
    font-family: arial;
  }
  .o-composer:focus {
    outline: none;
  }
`;

export class Composer extends Component {
  static template = TEMPLATE;
  static style = CSS;

  mounted() {
    this.el.value = this.props.state.currentContent;
    this.el.focus();
  }

  get style() {
    const state = this.props.state;
    const { cols, selectedCol, rows, selectedRow, offsetX, offsetY } = state;
    const col = cols[selectedCol];
    const row = rows[selectedRow];
    const left = col.left - offsetX + 2;
    const width = col.size - 4;
    const top = row.top - offsetY + 2;
    const height = row.size - 4;
    return `left:${left}px;top:${top}px;width:${width};height:${height}`;
  }

  onInput() {
    const state = this.props.state;
    // write in place? or go through a method probably
    state.currentContent = this.el.value;
  }

  onKeydown(ev) {
    if (ev.key === "Enter") {
      this.props.state.moveSelection(0, 1);
    }
    if (ev.key === "Tab") {
        ev.preventDefault();
        const deltaX = ev.shiftKey ? -1 : 1;
        this.props.state.moveSelection(deltaX, 0);
    }
  }
}
