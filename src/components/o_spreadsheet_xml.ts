import { xml } from "@odoo/owl";

export const templates = `
<odoo>
  <t t-name="o-spreadsheet-ActionButton">
    <span
      t-if="isVisible"
      class="o-menu-item-button"
      t-att-title="title"
      t-att-class="{'o-disabled': !isEnabled, active: isActive}"
      t-attf-class="{{props.class}}"
      t-on-click="onClick">
      <span t-if="iconTitle" t-att-style="buttonStyle">
        <t t-call="{{iconTitle}}"/>
      </span>
      <t t-if="props.hasTriangleDownIcon">
        <t t-call="o-spreadsheet-Icon.TRIANGLE_DOWN"/>
      </t>
    </span>
  </t>

  <t t-name="o-spreadsheet-Ripple">
    <div
      class="o-ripple-container position-relative"
      t-att-class="props.class"
      t-on-click="onClick">
      <div class="position-absolute w-100 h-100">
        <t t-foreach="state.ripples" t-as="ripple" t-key="ripple.id">
          <RippleEffect t-props="getRippleEffectProps(ripple.id)"/>
        </t>
      </div>
      <div class="position-relative" t-ref="childContainer">
        <t t-slot="default"/>
      </div>
    </div>
  </t>

  <t t-name="o-spreadsheet-RippleEffect">
    <div
      class="position-absolute"
      t-att-class="{ 'overflow-hidden': !props.allowOverflow }"
      t-att-style="props.style">
      <div class="o-ripple position-relative pe-none" t-ref="ripple" t-att-style="rippleStyle"/>
    </div>
  </t>

  <t t-name="o-spreadsheet-Autofill">
    <div class="o-autofill" t-att-style="style"/>
    <div
      class="o-autofill-handler"
      t-att-style="handlerStyle"
      t-on-mousedown="onMouseDown"
      t-on-dblclick="onDblClick"
    />
    <t t-set="tooltip" t-value="getTooltip()"/>
    <div t-if="tooltip" class="o-autofill-nextvalue" t-att-style="styleNextValue">
      <t t-component="tooltip.component" t-props="tooltip.props"/>
    </div>
  </t>

  <t t-name="o-spreadsheet-BorderEditor">
    <t t-set="border_color">Border Color</t>
    <Popover t-props="popoverProps">
      <div
        class="d-flex o-border-selector"
        t-on-click.stop=""
        t-att-class="props.class ? props.class : ''">
        <div class="o-border-selector-section">
          <div
            t-foreach="BORDER_POSITIONS"
            t-as="borderPositionsRow"
            t-key="borderPositionsRow"
            class="d-flex o-dropdown-button o-dropdown-line">
            <span
              t-foreach="borderPositionsRow"
              t-as="borderPosition"
              t-key="borderPosition"
              class="o-line-item o-hoverable-button"
              t-att-class="{active:props.currentBorderPosition === borderPosition[0]}"
              t-att-name="borderPosition[0]"
              t-on-click.stop="() => this.setBorderPosition(borderPosition[0])">
              <t t-call="{{borderPosition[1]}}"/>
            </span>
          </div>
        </div>
        <div class="o-divider"/>
        <div class="o-border-selector-section">
          <div
            class="m-0 p-0 d-flex align-items-center justify-content-center o-with-color o-hoverable-button"
            title="Border color"
            t-on-click.stop="(ev) => this.toggleDropdownTool('borderColorTool')">
            <ColorPickerWidget
              currentColor="props.currentBorderColor"
              toggleColorPicker="(ev) => this.toggleDropdownTool('borderColorTool')"
              showColorPicker="state.activeTool === 'borderColorTool'"
              onColorPicked="(color) => this.setBorderColor(color)"
              title="border_color"
              icon="props.currentBorderColor === '' ? 'o-spreadsheet-Icon.BORDER_NO_COLOR' : 'o-spreadsheet-Icon.BORDER_COLOR'"
              dropdownMaxHeight="this.props.dropdownMaxHeight"
              class="'o-dropdown-button o-border-picker-button'"
            />
            <t t-call="o-spreadsheet-Icon.TRIANGLE_DOWN"/>
          </div>
          <div
            class="o-border-style-tool d-flex align-items-center justify-content-center o-hoverable-button"
            title="Line style"
            t-ref="lineStyleButton"
            t-on-click.stop="(ev) => this.toggleDropdownTool('borderTypeTool')">
            <t t-call="o-spreadsheet-Icon.BORDER_TYPE"/>
            <t t-call="o-spreadsheet-Icon.TRIANGLE_DOWN"/>
            <Popover
              t-props="lineStylePickerPopoverProps"
              t-if="state.activeTool === 'borderTypeTool'">
              <div class="o-border-style-dropdown">
                <t t-foreach="borderStyles" t-as="borderStyle" t-key="borderStyle">
                  <div
                    t-att-title="borderStyle"
                    t-on-click.stop="() => this.setBorderStyle(borderStyle)">
                    <div class="d-flex o-dropdown-border-type">
                      <div class="o-dropdown-border-check">
                        <t
                          t-if="props.currentBorderStyle === borderStyle"
                          t-call="o-spreadsheet-Icon.CHECK"
                        />
                      </div>
                      <div t-attf-class="o-style-preview o-style-{{borderStyle}}"/>
                    </div>
                  </div>
                </t>
              </div>
            </Popover>
          </div>
        </div>
      </div>
    </Popover>
  </t>

  <t t-name="o-spreadsheet-BorderEditorWidget">
    <div class="d-flex position-relative" title="Borders">
      <span
        t-ref="borderEditorButton"
        t-on-click.stop="props.toggleBorderEditor"
        t-att-class="props.class ? props.class : ''"
        t-att-disabled="props.disabled">
        <span t-att-style="iconStyle">
          <t t-call="o-spreadsheet-Icon.BORDERS"/>
        </span>
      </span>
      <BorderEditor
        t-if="props.showBorderEditor"
        onBorderColorPicked.bind="onBorderColorPicked"
        onBorderStylePicked.bind="onBorderStylePicked"
        onBorderPositionPicked.bind="onBorderPositionPicked"
        currentBorderColor="state.currentColor"
        currentBorderStyle="state.currentStyle"
        currentBorderPosition="state.currentPosition"
        maxHeight="props.dropdownMaxHeight"
        anchorRect="borderEditorAnchorRect"
      />
    </div>
  </t>

  <t t-name="o-spreadsheet-BottomBar">
    <div
      class="o-spreadsheet-bottom-bar o-two-columns d-flex align-items-center overflow-hidden"
      t-on-click="props.onClick"
      t-ref="bottomBar"
      t-on-contextmenu.prevent="">
      <Ripple>
        <div
          class="o-sheet-item o-add-sheet me-2 p-1"
          t-if="!env.model.getters.isReadonly()"
          t-on-click="clickAddSheet">
          <t t-call="o-spreadsheet-Icon.PLUS"/>
        </div>
      </Ripple>
      <Ripple>
        <div class="o-sheet-item o-list-sheets me-2 p-1" t-on-click="clickListSheets">
          <t t-call="o-spreadsheet-Icon.LIST"/>
        </div>
      </Ripple>
      <div class="o-all-sheets position-relative flex-shrink-0 d-flex h-100 me-3">
        <div
          class="o-bottom-bar-fade-in position-absolute h-100 w-100 pe-none"
          t-if="state.isSheetListScrollableLeft"
        />
        <div
          class="o-sheet-list d-flex w-100 overflow-hidden px-1"
          t-ref="sheetList"
          t-on-wheel="onWheel"
          t-on-scroll="onScroll">
          <t t-foreach="getVisibleSheets()" t-as="sheet" t-key="sheet.id">
            <BottomBarSheet
              style="getSheetStyle(sheet.id)"
              sheetId="sheet.id"
              openContextMenu="(registry, ev) => this.onSheetContextMenu(sheet.id, registry, ev)"
              onMouseDown="(ev) => this.onSheetMouseDown(sheet.id, ev)"
            />
          </t>
        </div>
        <div
          class="o-bottom-bar-fade-out position-absolute h-100 w-100 pe-none"
          t-if="state.isSheetListScrollableRight"
        />
      </div>
      <div
        class="o-bottom-bar-arrows d-flex h-100 me-5 align-items-center"
        t-if="state.isSheetListScrollableLeft || state.isSheetListScrollableRight">
        <Ripple
          ignoreClickPosition="true"
          width="20"
          height="20"
          offsetX="1"
          allowOverflow="true"
          enabled="state.isSheetListScrollableLeft">
          <div
            class="o-bottom-bar-arrow o-bottom-bar-arrow-left d-flex align-items-center me-2"
            t-att-class="{'o-disabled': !state.isSheetListScrollableLeft}"
            t-on-click="onArrowLeft">
            <t t-call="o-spreadsheet-Icon.CARET_LEFT"/>
          </div>
        </Ripple>
        <Ripple
          ignoreClickPosition="true"
          width="20"
          height="20"
          offsetX="-1"
          allowOverflow="true"
          enabled="state.isSheetListScrollableRight">
          <div
            class="o-bottom-bar-arrow o-bottom-bar-arrow-right d-flex align-items-center me-4"
            t-att-class="{'o-disabled': !state.isSheetListScrollableRight}"
            t-on-click="onArrowRight">
            <t t-call="o-spreadsheet-Icon.CARET_RIGHT"/>
          </div>
        </Ripple>
      </div>

      <BottomBarStatistic
        openContextMenu="(x, y, registry) => this.openContextMenu(x, y, 'listSelectionStatistics', registry)"
        closeContextMenu="() => this.closeContextMenuWithId('listSelectionStatistics')"
      />

      <Menu
        t-if="menuState.isOpen"
        position="menuState.position"
        menuItems="menuState.menuItems"
        maxHeight="menuMaxHeight"
        onClose="() => this.closeMenu()"
        menuId="menuState.menuId"
      />
    </div>
  </t>

  <t t-name="o-spreadsheet-BottomBarSheet">
    <Ripple>
      <div
        class="o-sheet d-flex align-items-center user-select-none text-nowrap "
        t-on-mousedown="(ev) => this.onMouseDown(ev)"
        t-on-contextmenu.prevent="(ev) => this.onContextMenu(ev)"
        t-ref="sheetDiv"
        t-att-style="props.style"
        t-att-title="sheetName"
        t-att-data-id="props.sheetId"
        t-att-class="{active: isSheetActive}">
        <span
          class="o-sheet-name"
          t-att-class="{'o-sheet-name-editable': state.isEditing }"
          t-ref="sheetNameSpan"
          t-esc="sheetName"
          t-on-click="(ev) => this.onClickSheetName(ev)"
          t-on-dblclick="() => this.onDblClick()"
          t-on-focusout="() => this.onFocusOut()"
          t-on-keydown="(ev) => this.onKeyDown(ev)"
          t-att-contenteditable="state.isEditing.toString()"
        />
        <span class="o-sheet-icon ms-1" t-on-click.stop="(ev) => this.onIconClick(ev)">
          <t t-call="o-spreadsheet-Icon.TRIANGLE_DOWN"/>
        </span>
      </div>
    </Ripple>
  </t>

  <t t-name="o-spreadsheet-BottomBarStatisic">
    <t t-set="selectedStatistic" t-value="getSelectedStatistic()"/>
    <Ripple class="'ms-auto'" t-if="selectedStatistic !== undefined">
      <div
        class="o-selection-statistic text-truncate user-select-none me-4 bg-white rounded shadow"
        t-on-click="listSelectionStatistics">
        <t t-esc="selectedStatistic"/>
        <span class="ms-2">
          <t t-call="o-spreadsheet-Icon.TRIANGLE_DOWN"/>
        </span>
      </div>
    </Ripple>
  </t>

  <t t-name="o-spreadsheet-ClientTag">
    <div t-if="props.active" class="o-client-tag" t-att-style="tagStyle" t-esc="props.name"/>
  </t>

  <t t-name="o-spreadsheet-ColorPicker">
    <Popover t-props="popoverProps">
      <div class="o-color-picker" t-on-click.stop="" t-att-style="colorPickerStyle">
        <div class="o-color-picker-section-name">Standard</div>
        <div class="colors-grid">
          <div
            t-foreach="COLORS"
            t-as="color"
            t-key="color"
            class="o-color-picker-line-item"
            t-att-data-color="color"
            t-on-click="() => this.onColorClick(color)"
            t-attf-style="background-color:{{color}};">
            <div
              t-if="isSameColor(props.currentColor, color)"
              align="center"
              t-attf-style="color:{{checkmarkColor}}">
              ✓
            </div>
          </div>
        </div>
        <div class="o-separator"/>
        <div
          class="o-color-picker-section-name o-color-picker-toggler"
          t-on-click="toggleColorPicker">
          <span>Custom</span>
        </div>
        <div class="colors-grid o-color-picker-toggler" t-on-click.stop="toggleColorPicker">
          <div class="o-color-picker-line-item o-color-picker-toggler-button">
            <div class="o-color-picker-toggler-sign">
              <t t-call="o-spreadsheet-Icon.PLUS"/>
            </div>
          </div>
          <div
            t-foreach="env.model.getters.getCustomColors()"
            t-as="color"
            t-key="color"
            class="o-color-picker-line-item"
            t-att-data-color="color"
            t-attf-style="background-color:{{color}};"
            t-on-click="() => this.onColorClick(color)">
            <div
              t-if="isSameColor(props.currentColor, color)"
              align="center"
              t-attf-style="color:{{checkmarkColor}}">
              ✓
            </div>
          </div>
        </div>
        <div t-if="state.showGradient" class="o-custom-selector">
          <div
            class="o-gradient"
            t-on-click.stop=""
            t-on-mousedown="dragGradientPointer"
            t-att-style="gradientHueStyle">
            <div class="saturation w-100 h-100 position-absolute pe-none"/>
            <div class="lightness w-100 h-100 position-absolute pe-none"/>
            <div class="magnifier pe-none" t-att-style="pointerStyle"/>
          </div>
          <div class="o-hue-container" t-on-mousedown="dragHuePointer">
            <div class="o-hue-picker" t-on-click.stop=""/>
            <div class="o-hue-slider pe-none" t-att-style="sliderStyle">
              <t t-call="o-spreadsheet-Icon.TRIANGLE_UP"/>
            </div>
          </div>
          <div class="o-custom-input-preview">
            <input
              type="text"
              t-att-class="{'o-wrong-color': !isHexColorInputValid }"
              t-on-click.stop=""
              t-att-value="state.customHexColor"
              t-on-input="setHexColor"
              maxlength="7"
            />
            <div class="o-color-preview" t-att-style="colorPreviewStyle"/>
          </div>
          <div class="o-custom-input-buttons">
            <button
              class="o-add-button"
              t-att-class="{'o-disabled': !state.customHexColor or !isHexColorInputValid}"
              t-on-click.stop="addCustomColor">
              Add
            </button>
          </div>
        </div>
        <div class="o-separator"/>
        <div class="o-buttons">
          <button t-on-click="resetColor" class="o-cancel">No Color</button>
        </div>
      </div>
    </Popover>
  </t>

  <t t-name="o-spreadsheet-ColorPickerWidget">
    <div class="o-color-picker-widget">
      <span
        class="o-color-picker-button"
        t-ref="colorPickerButton"
        t-on-click.stop="props.toggleColorPicker"
        t-att-title="props.title"
        t-att-class="props.class ? props.class : 'o-color-picker-button-style'"
        t-att-disabled="props.disabled">
        <span t-att-style="iconStyle">
          <t t-call="{{props.icon}}"/>
        </span>
      </span>
      <ColorPicker
        t-if="props.showColorPicker"
        anchorRect="colorPickerAnchorRect"
        onColorPicked="props.onColorPicked"
        currentColor="props.currentColor"
        maxHeight="props.dropdownMaxHeight"
      />
    </div>
  </t>

  <t t-name="o-spreadsheet-TextValueProvider">
    <div
      t-att-class="{
          'o-autocomplete-dropdown':props.values.length,
          'shadow':props.values.length}">
      <t t-foreach="props.values" t-as="v" t-key="v.text">
        <div
          class="d-flex flex-column text-start"
          t-att-class="{'o-autocomplete-value-focus': props.selectedIndex === v_index}"
          t-on-click="() => this.props.onValueSelected(v.text)"
          t-on-mousemove="() => this.props.onValueHovered(v_index)">
          <div class="o-autocomplete-value text-truncate">
            <t t-set="htmlContent" t-value="props.getHtmlContent(v.text)"/>
            <span
              t-foreach="htmlContent"
              t-as="content"
              t-key="content_index"
              t-att-class="content.class"
              t-attf-style="color: {{content.color || 'inherit'}};"
              t-esc="content.value"
            />
          </div>
          <div
            class="o-autocomplete-description text-truncate"
            t-esc="v.description"
            t-if="props.selectedIndex === v_index"
          />
        </div>
      </t>
    </div>
  </t>

  <t t-name="o-spreadsheet-Composer">
    <div class="o-composer-container w-100 h-100">
      <div
        class="o-composer w-100 text-start"
        t-att-class="{ 'text-muted': env.model.getters.isReadonly(), 'active': props.focus !== 'inactive' }"
        t-att-style="props.inputStyle"
        t-ref="o_composer"
        tabindex="1"
        t-att-contenteditable="env.model.getters.isReadonly() ? 'false' : 'true'"
        spellcheck="false"
        t-on-keydown="onKeydown"
        t-on-mousewheel.stop=""
        t-on-input="onInput"
        t-on-mousedown="onMousedown"
        t-on-click="onClick"
        t-on-keyup="onKeyup"
        t-on-paste.stop=""
        t-on-compositionstart="onCompositionStart"
        t-on-compositionend="onCompositionEnd"
        t-on-dblclick="onDblClick"
      />

      <div
        t-if="props.focus !== 'inactive' and (autoCompleteState.showProvider or functionDescriptionState.showDescription)"
        class="o-composer-assistant"
        t-att-style="assistantStyle"
        t-on-mousedown.prevent.stop=""
        t-on-click.prevent.stop=""
        t-on-mouseup.prevent.stop="">
        <TextValueProvider
          t-if="autoCompleteState.showProvider"
          values="autoCompleteState.values"
          selectedIndex="autoCompleteState.selectedIndex"
          onValueSelected.bind="this.autoComplete"
          onValueHovered.bind="this.updateAutoCompleteIndex"
          getHtmlContent="autoCompleteState.getHtmlContent"
        />
        <FunctionDescriptionProvider
          t-if="functionDescriptionState.showDescription"
          functionName="functionDescriptionState.functionName"
          functionDescription="functionDescriptionState.functionDescription"
          argToFocus="functionDescriptionState.argToFocus"
        />
      </div>
    </div>
  </t>

  <t t-name="o-spreadsheet-FunctionDescriptionProvider">
    <div
      class="o-formula-assistant-container user-select-none shadow"
      t-att-class="{
          'pe-none': assistantState.allowCellSelectionBehind,
          'pe-auto': !assistantState.allowCellSelectionBehind
          }">
      <t t-set="context" t-value="getContext()"/>
      <div
        class="o-formula-assistant bg-white"
        t-if="context.functionName"
        t-on-mousemove="onMouseMove"
        t-att-class="{'opacity-25': assistantState.allowCellSelectionBehind}">
        <div class="o-formula-assistant-head">
          <span t-esc="context.functionName"/>
          (
          <t t-foreach="context.functionDescription.args" t-as="arg" t-key="arg.name">
            <span t-if="arg_index > '0'">,&#xA0;</span>
            <span t-att-class="{ 'o-formula-assistant-focus': context.argToFocus === arg_index }">
              <span>
                <span t-if="arg.optional || arg.repeating || arg.default">[</span>
                <span t-esc="arg.name"/>
                <span t-if="arg.repeating">, ...</span>
                <span t-if="arg.optional || arg.repeating || arg.default">]</span>
              </span>
            </span>
          </t>
          )
        </div>

        <div class="o-formula-assistant-core pb-3 m-3">
          <div class="o-formula-assistant-gray">ABOUT</div>
          <div t-esc="context.functionDescription.description"/>
        </div>

        <t t-foreach="context.functionDescription.args" t-as="arg" t-key="arg.name">
          <div
            class="o-formula-assistant-arg p-3 pt-0 display-flex flex-column"
            t-att-class="{
                'o-formula-assistant-gray': context.argToFocus >= '0',
                'o-formula-assistant-focus': context.argToFocus === arg_index,
              }">
            <div>
              <span t-esc="arg.name"/>
              <span
                t-if="arg.optional || arg.repeating || arg.default ">&#xA0;- [optional]&#xA0;</span>
              <span t-if="arg.default">
                <span>default:&#xA0;</span>
                <t t-esc="arg.defaultValue"/>
              </span>
              <span t-if="arg.repeating">repeatable</span>
            </div>
            <div class="o-formula-assistant-arg-description" t-esc="arg.description"/>
          </div>
        </t>
      </div>
    </div>
  </t>

  <t t-name="o-spreadsheet-GridComposer">
    <div
      class="o-cell-reference"
      t-if="shouldDisplayCellReference"
      t-att-style="cellReferenceStyle"
      t-esc="cellReference"
    />
    <div class="o-grid-composer" t-att-style="containerStyle" t-ref="gridComposer">
      <Composer
        focus="props.focus"
        inputStyle="composerStyle"
        rect="composerState.rect"
        delimitation="composerState.delimitation"
        onComposerUnmounted="props.onComposerUnmounted"
        onComposerContentFocused="props.onComposerContentFocused"
      />
    </div>
  </t>

  <t t-name="o-spreadsheet-TopBarComposer">
    <div
      class="o-topbar-composer bg-white user-select-text"
      t-on-click.stop=""
      t-att-style="containerStyle">
      <Composer
        focus="props.focus"
        inputStyle="composerStyle"
        onComposerContentFocused="props.onComposerContentFocused"
      />
    </div>
  </t>

  <t t-name="o-spreadsheet-SpreadsheetDashboard">
    <div
      class="o-grid o-two-columns"
      tabindex="-1"
      t-on-wheel="onMouseWheel"
      t-on-click="onClosePopover">
      <div class="mx-auto h-100 position-relative" t-ref="grid" t-att-style="gridContainer">
        <GridOverlay
          onCellHovered.bind="onCellHovered"
          onGridResized.bind="onGridResized"
          onGridMoved.bind="moveCanvas"
          gridOverlayDimensions="gridOverlayDimensions"
        />
        <canvas t-ref="canvas"/>
        <GridPopover
          hoveredCell="hoveredCell"
          gridRect="getGridRect()"
          onMouseWheel.bind="onMouseWheel"
          onClosePopover.bind="onClosePopover"
        />
        <div
          t-foreach="getClickableCells()"
          t-as="clickableCell"
          t-key="clickableCell.tKey"
          class="o-dashboard-clickable-cell"
          t-on-click="() => this.selectClickableCell(clickableCell)"
          t-on-contextmenu.prevent=""
          t-att-style="getCellClickableStyle(clickableCell.coordinates)"
        />
        <FilterIconsOverlay/>
      </div>
      <VerticalScrollBar/>
      <HorizontalScrollBar/>
      <div class="o-scrollbar corner"/>
    </div>
  </t>

  <t t-name="o-spreadsheet-DataValidationOverlay">
    <t t-foreach="checkBoxCellPositions" t-as="position" t-key="'checkbox'+position_index">
      <GridCellIcon cellPosition="position">
        <DataValidationCheckbox cellPosition="position"/>
      </GridCellIcon>
    </t>

    <t t-foreach="listIconsCellPositions" t-as="position" t-key="'list'+position_index">
      <GridCellIcon cellPosition="position" horizontalAlign="'right'">
        <DataValidationListIcon cellPosition="position"/>
      </GridCellIcon>
    </t>
  </t>

  <t t-name="o-spreadsheet-DataValidationCheckbox">
    <input
      type="checkbox"
      class="o-dv-checkbox"
      t-att-class="{'pe-none': isDisabled}"
      t-on-change="onCheckboxChange"
      t-att-checked="checkBoxValue"
    />
  </t>

  <t t-name="o-spreadsheet-DataValidationListIcon">
    <div
      class="o-dv-list-icon d-flex align-items-center justify-content-center"
      t-on-click="onClick">
      <t t-call="o-spreadsheet-Icon.CARET_DOWN"/>
    </div>
  </t>

  <t t-name="o-spreadsheet-ErrorToolTip">
    <div class="o-error-tooltip">
      <t t-foreach="props.errors" t-as="error" t-key="error_index">
        <div class="o-error-tooltip-title fw-bold text-danger">
          <t t-esc="error.title"/>
        </div>
        <div class="o-error-tooltip-message">
          <t t-esc="error.message"/>
        </div>
      </t>
    </div>
  </t>

  <t t-name="o-spreadsheet-ChartJsComponent">
    <canvas class="o-figure-canvas w-100 h-100" t-att-style="canvasStyle" t-ref="graphContainer"/>
  </t>

  <t t-name="o-spreadsheet-ScorecardChart">
    <canvas class="o-figure-canvas w-100 h-100" t-ref="chartContainer"/>
  </t>

  <t t-name="o-spreadsheet-FigureComponent">
    <div class="o-figure-wrapper pe-auto" t-att-style="wrapperStyle">
      <div
        class="o-figure w-100 h-100"
        t-on-mousedown.stop="(ev) => this.onMouseDown(ev)"
        t-on-contextmenu.prevent.stop="(ev) => !env.model.getters.isReadonly() and this.onContextMenu(ev)"
        t-ref="figure"
        t-att-style="props.style"
        t-att-data-id="props.figure.id"
        tabindex="0"
        t-on-keydown="(ev) => this.onKeyDown(ev)"
        t-on-keyup.stop="">
        <t
          t-component="figureRegistry.get(props.figure.tag).Component"
          t-key="props.figure.id"
          onFigureDeleted="props.onFigureDeleted"
          figure="props.figure"
        />
        <div class="o-figure-menu position-absolute m-2" t-if="!env.isDashboard()">
          <div
            class="o-figure-menu-item"
            t-if="!env.model.getters.isReadonly()"
            t-on-click="showMenu"
            t-ref="menuButton"
            t-on-contextmenu.prevent.stop="showMenu">
            <t t-call="o-spreadsheet-Icon.LIST"/>
          </div>
          <Menu
            t-if="menuState.isOpen"
            position="menuState.position"
            menuItems="menuState.menuItems"
            onClose="() => this.menuState.isOpen=false"
          />
        </div>
      </div>
      <div class="o-figure-border w-100 h-100 position-absolute pe-none" t-att-style="borderStyle"/>
      <t t-if="isSelected">
        <div
          class="o-fig-anchor o-top"
          t-att-style="this.getResizerPosition('top')"
          t-on-mousedown="(ev) => this.clickAnchor(0,-1, ev)"
        />
        <div
          class="o-fig-anchor o-topRight"
          t-att-style="this.getResizerPosition('top right')"
          t-on-mousedown="(ev) => this.clickAnchor(1,-1, ev)"
        />
        <div
          class="o-fig-anchor o-right"
          t-att-style="this.getResizerPosition('right')"
          t-on-mousedown="(ev) => this.clickAnchor(1,0, ev)"
        />
        <div
          class="o-fig-anchor o-bottomRight"
          t-att-style="this.getResizerPosition('bottom right')"
          t-on-mousedown="(ev) => this.clickAnchor(1,1, ev)"
        />
        <div
          class="o-fig-anchor o-bottom"
          t-att-style="this.getResizerPosition('bottom')"
          t-on-mousedown="(ev) => this.clickAnchor(0,1, ev)"
        />
        <div
          class="o-fig-anchor o-bottomLeft"
          t-att-style="this.getResizerPosition('bottom left')"
          t-on-mousedown="(ev) => this.clickAnchor(-1,1, ev)"
        />
        <div
          class="o-fig-anchor o-left"
          t-att-style="this.getResizerPosition('left')"
          t-on-mousedown="(ev) => this.clickAnchor(-1,0, ev)"
        />
        <div
          class="o-fig-anchor o-topLeft"
          t-att-style="this.getResizerPosition('top left')"
          t-on-mousedown="(ev) => this.clickAnchor(-1,-1, ev)"
        />
      </t>
    </div>
  </t>

  <t t-name="o-spreadsheet-ChartFigure">
    <div class="o-chart-container w-100 h-100" t-on-dblclick="onDoubleClick">
      <t
        t-component="chartComponent"
        figure="this.props.figure"
        t-key="this.props.figure.id + '-' + chartType"
      />
    </div>
  </t>

  <t t-name="o-spreadsheet-FiguresContainer">
    <div>
      <t t-foreach="containers" t-as="container" t-key="container.type">
        <div
          class="o-figure-container position-absolute pe-none overflow-hidden"
          t-att-style="container.style"
          t-att-data-id="container.type + 'Container'">
          <div
            class="o-figure-viewport-inverse w-0 h-0 overflow-visible position-absolute"
            t-att-style="container.inverseViewportStyle">
            <t t-foreach="container.figures" t-as="figure" t-key="figure.id">
              <FigureComponent
                onFigureDeleted="this.props.onFigureDeleted"
                figure="figure"
                style="getFigureStyle(figure)"
                onMouseDown="(ev) => this.startDraggingFigure(figure, ev)"
                onClickAnchor="(dirX, dirY, ev) => this.startResize(figure, dirX, dirY, ev)"
              />
            </t>
          </div>
        </div>
      </t>
    </div>
    <div
      class="o-figure-container position-absolute pe-none overflow-hidden"
      t-if="dnd.horizontalSnap"
      t-att-style="dnd.horizontalSnap.containerStyle"
      t-att-data-id="'HorizontalSnapContainer'">
      <div class="o-figure-snap-line horizontal" t-att-style="dnd.horizontalSnap.lineStyle"/>
    </div>
    <div
      class="o-figure-container position-absolute pe-none overflow-hidden"
      t-if="dnd.verticalSnap"
      t-att-style="dnd.verticalSnap.containerStyle"
      t-att-data-id="'VerticalSnapContainer'">
      <div class="o-figure-snap-line vertical" t-att-style="dnd.verticalSnap.lineStyle"/>
    </div>
  </t>

  <t t-name="o-spreadsheet-ImageFigure">
    <img t-att-src="getImagePath" class="w-100 h-100"/>
  </t>

  <t t-name="o-spreadsheet-FilterIcon">
    <div class="o-filter-icon" t-on-click.stop="onClick">
      <t t-if="isFilterActive" t-call="o-spreadsheet-Icon.FILTER_ICON_ACTIVE"/>
      <t t-else="" t-call="o-spreadsheet-Icon.FILTER_ICON"/>
    </div>
  </t>

  <t t-name="o-spreadsheet-FilterIconsOverlay">
    <t
      t-foreach="getFilterHeadersPositions()"
      t-as="position"
      t-key="'filter'+position.col + '_' + position.row">
      <GridCellIcon cellPosition="position" offset="props.gridPosition" horizontalAlign="'right'">
        <FilterIcon cellPosition="position"/>
      </GridCellIcon>
    </t>
  </t>

  <t t-name="o-spreadsheet-FilterMenu">
    <div class="o-filter-menu d-flex flex-column bg-white" t-on-wheel.stop="">
      <div t-if="!isReadonly">
        <div class="o-filter-menu-item" t-on-click="() => this.sortFilterZone('ascending')">
          Sort ascending (A ⟶ Z)
        </div>
        <div class="o-filter-menu-item" t-on-click="() => this.sortFilterZone('descending')">
          Sort descending (Z ⟶ A)
        </div>
      </div>
      <div class="o-separator" t-if="!isReadonly"/>
      <div class="o-filter-menu-actions">
        <div class="o-filter-menu-action-text" t-on-click="selectAll">Select all</div>
        <div class="o-filter-menu-action-text" t-on-click="clearAll">Clear</div>
      </div>
      <div class="position-relative">
        <input
          class="w-100"
          t-ref="filterMenuSearchBar"
          type="text"
          t-model="state.textFilter"
          placeholder="Search..."
          t-on-keydown="onKeyDown"
        />
        <i class="o-search-icon position-absolute">
          <t t-call="o-spreadsheet-Icon.SEARCH"/>
        </i>
      </div>
      <div
        class="o-filter-menu-list d-flex flex-column rounded"
        t-ref="filterValueList"
        t-on-click="this.clearScrolledToValue"
        t-on-scroll="this.clearScrolledToValue">
        <t t-foreach="displayedValues" t-as="value" t-key="value.string">
          <FilterMenuValueItem
            onClick="() => this.checkValue(value)"
            onMouseMove="() => this.onMouseMove(value)"
            value="value.string"
            isChecked="value.checked"
            isSelected="value.string === state.selectedValue"
            scrolledTo="value.scrolledTo"
          />
        </t>
        <div
          t-if="displayedValues.length === 0"
          class="o-filter-menu-no-values d-flex align-items-center justify-content-center w-100 h-100 ">
          No results
        </div>
      </div>
      <div class="o-filter-menu-buttons d-flex justify-content-end">
        <div class="o-filter-menu-button o-filter-menu-button-cancel" t-on-click="cancel">
          Cancel
        </div>
        <div class="o-filter-menu-button o-filter-menu-button-primary" t-on-click="confirm">
          Confirm
        </div>
      </div>
    </div>
  </t>

  <t t-name="o-spreadsheet-FilterMenuValueItem">
    <div
      t-on-click="this.props.onClick"
      t-on-mousemove="this.props.onMouseMove"
      class="o-filter-menu-item o-filter-menu-value"
      t-ref="menuValueItem"
      t-att-class="{'selected': this.props.isSelected}">
      <div>
        <div class="o-filter-menu-value-checked">
          <span t-if="this.props.isChecked">✓</span>
        </div>
      </div>
      <div class="o-filter-menu-value-text text-truncate">
        <t t-if="this.props.value === ''">(Blanks)</t>
        <t t-else="" t-esc="this.props.value"/>
      </div>
    </div>
  </t>

  <t t-name="o-spreadsheet-FontSizeEditor">
    <div class="o-dropdown" t-ref="FontSizeEditor">
      <div
        class=" o-font-size-editor d-flex align-items-center"
        t-att-class="props.class"
        title="Font Size"
        t-on-click="this.toggleFontList">
        <input
          type="number"
          min="1"
          max="400"
          class="o-font-size bg-transparent border-0"
          t-on-keydown="onInputKeydown"
          t-on-click.stop=""
          t-on-focus.stop="onInputFocused"
          t-att-value="currentFontSize"
          t-on-change="setSizeFromInput"
          t-ref="inputFontSize"
        />
        <span>
          <t t-call="o-spreadsheet-Icon.TRIANGLE_DOWN"/>
        </span>
      </div>
      <div
        class="o-dropdown-content o-text-options"
        t-if="dropdown.isOpen"
        t-on-click.stop=""
        t-att-style="props.dropdownStyle">
        <t t-foreach="fontSizes" t-as="fontSize" t-key="fontSize">
          <div
            t-esc="fontSize"
            t-att-data-size="fontSize"
            t-on-click="() => this.setSizeFromList(fontSize)"
          />
        </t>
      </div>
    </div>
  </t>

  <t t-name="o-spreadsheet-Grid">
    <div
      class="o-grid w-100 h-100"
      tabindex="-1"
      t-on-click="focus"
      t-on-keydown="onKeydown"
      t-on-wheel="onMouseWheel"
      t-ref="grid">
      <GridOverlay
        onCellClicked.bind="onCellClicked"
        onCellDoubleClicked.bind="onCellDoubleClicked"
        onCellRightClicked.bind="onCellRightClicked"
        onCellHovered.bind="onCellHovered"
        onGridResized.bind="onGridResized"
        onGridMoved.bind="moveCanvas"
        gridOverlayDimensions="gridOverlayDimensions"
        onFigureDeleted.bind="focus"
      />
      <HeadersOverlay onOpenContextMenu="(type, x, y) => this.toggleContextMenu(type, x, y)"/>

      <t t-if="env.model.getters.getEditionMode() !== 'inactive'">
        <GridComposer
          onComposerUnmounted="() => this.focus()"
          onComposerContentFocused="props.onComposerContentFocused"
          focus="props.focusComposer"
          gridDims="env.model.getters.getSheetViewDimensionWithHeaders()"
        />
      </t>
      <t else="1">
        <input
          class="position-absolute"
          style="z-index:-1000;"
          t-on-input="onInput"
          t-on-contextmenu="onInputContextMenu"
          t-ref="hiddenInput"
        />
      </t>
      <canvas t-ref="canvas"/>
      <t
        t-foreach="env.model.getters.getClientsToDisplay()"
        t-as="client"
        t-key="getClientPositionKey(client)">
        <ClientTag
          name="client.name"
          color="client.color"
          col="client.position.col"
          row="client.position.row"
          active="isCellHovered(client.position.col, client.position.row)"
        />
      </t>
      <GridPopover
        t-if="!menuState.isOpen"
        hoveredCell="hoveredCell"
        gridRect="getGridRect()"
        onMouseWheel.bind="onMouseWheel"
        onClosePopover.bind="onClosePopover"
      />
      <t t-if="env.model.getters.getEditionMode() === 'inactive'">
        <Autofill position="getAutofillPosition()" isVisible="isAutofillVisible"/>
      </t>
      <t t-foreach="env.model.getters.getHighlights()" t-as="highlight" t-key="highlight_index">
        <t t-if="highlight.sheetId === env.model.getters.getActiveSheetId()">
          <Highlight zone="highlight.zone" color="highlight.color"/>
        </t>
      </t>
      <Menu
        t-if="menuState.isOpen"
        menuItems="menuState.menuItems"
        position="menuState.position"
        onClose="() => this.closeMenu()"
      />
      <FilterIconsOverlay gridPosition="{ x: HEADER_WIDTH, y : HEADER_HEIGHT }"/>
      <VerticalScrollBar topOffset="HEADER_HEIGHT"/>
      <HorizontalScrollBar leftOffset="HEADER_WIDTH"/>
      <div class="o-scrollbar corner"/>
    </div>
  </t>

  <t t-name="o-spreadsheet-GridAddRowsFooter">
    <div
      class="o-grid-add-rows mt-2 ms-2 w-100 d-flex position-relative align-items-center"
      t-att-style="addRowsPosition"
      t-on-mousedown.stop.prevent="">
      <button t-on-click="onConfirm" t-att-disabled="state.errorFlag" class="o-button">Add</button>
      <input
        type="text"
        class="o-grid-add-rows-input o-input mt-0 me-2"
        t-ref="inputRef"
        value="100"
        t-on-click.stop=""
        t-on-keydown.stop="onKeydown"
        t-on-mousedown.stop=""
        t-on-input.stop="onInput"
      />
      <span>more rows at the bottom</span>
      <ValidationMessages t-if="state.errorFlag" messages="errorMessages" msgType="'error'"/>
    </div>
  </t>

  <t t-name="o-spreadsheet-GridCellIcon">
    <div
      class="o-grid-cell-icon position-absolute overflow-hidden"
      t-if="isPositionVisible(this.props.cellPosition)"
      t-att-style="iconStyle">
      <t t-slot="default"/>
    </div>
  </t>

  <t t-name="o-spreadsheet-GridOverlay">
    <div
      t-ref="gridOverlay"
      class="o-grid-overlay overflow-hidden"
      t-att-class="{'o-paint-format-cursor': isPaintingFormat}"
      t-att-style="style"
      t-on-mousedown="onMouseDown"
      t-on-dblclick.self="onDoubleClick"
      t-on-contextmenu="onContextMenu">
      <FiguresContainer onFigureDeleted="props.onFigureDeleted"/>
      <DataValidationOverlay/>
      <GridAddRowsFooter
        t-if="!env.model.getters.isReadonly()"
        t-key="env.model.getters.getActiveSheetId()"
        focusGrid="props.onFigureDeleted"
      />
    </div>
  </t>

  <t t-name="o-spreadsheet-GridPopover">
    <Popover
      t-if="cellPopover.isOpen"
      positioning="cellPopover.cellCorner"
      maxHeight="cellPopover.Component.size and cellPopover.Component.size.maxHeight"
      maxWidth="cellPopover.Component.size and cellPopover.Component.size.maxHidth"
      anchorRect="cellPopover.anchorRect"
      containerRect="env.getPopoverContainerRect()"
      onMouseWheel="props.onMouseWheel"
      zIndex="zIndex">
      <t
        t-component="cellPopover.Component"
        t-props="{...cellPopover.props, onClosed : () => props.onClosePopover()}"
      />
    </Popover>
  </t>

  <t t-name="o-spreadsheet-HeadersOverlay">
    <div class="o-overlay">
      <ColResizer onOpenContextMenu="props.onOpenContextMenu"/>
      <RowResizer onOpenContextMenu="props.onOpenContextMenu"/>
      <div class="all" t-on-mousedown.self="selectAll"/>
    </div>
  </t>

  <t t-name="o-spreadsheet-RowResizer">
    <div
      class="o-row-resizer"
      t-on-mousemove.self="onMouseMove"
      t-on-mouseleave="onMouseLeave"
      t-on-mousedown.self.prevent="select"
      t-ref="rowResizer"
      t-on-mouseup.self="onMouseUp"
      t-on-contextmenu.self="onContextMenu"
      t-att-class="{'o-grab': state.waitingForMove, 'o-dragging': state.isMoving}">
      <div
        t-if="state.isMoving"
        class="dragging-row-line"
        t-attf-style="top:{{state.draggerLinePosition}}px;"
      />
      <div
        t-if="state.isMoving"
        class="dragging-row-shadow"
        t-attf-style="top:{{state.draggerShadowPosition}}px; height:{{state.draggerShadowThickness}}px;"
      />
      <t t-if="state.resizerIsActive">
        <div
          class="o-handle"
          t-on-mousedown="onMouseDown"
          t-on-dblclick="onDblClick"
          t-on-contextmenu.prevent=""
          t-attf-style="top:{{state.draggerLinePosition - 2}}px;">
          <div class="dragging-resizer" t-if="state.isResizing"/>
        </div>
      </t>
      <t
        t-foreach="env.model.getters.getHiddenRowsGroups(env.model.getters.getActiveSheetId())"
        t-as="hiddenItem"
        t-key="hiddenItem_index">
        <t t-if="!hiddenItem.includes(0)">
          <div
            class="o-unhide"
            t-att-data-index="hiddenItem_index"
            t-attf-style="top:{{unhideStyleValue(hiddenItem[0]) - 17}}px;"
            t-on-click="() => this.unhide(hiddenItem)">
            <t t-call="o-spreadsheet-Icon.TRIANGLE_UP"/>
          </div>
        </t>
        <t
          t-if="!hiddenItem.includes(env.model.getters.getNumberRows(env.model.getters.getActiveSheetId())-1)">
          <div
            class="o-unhide"
            t-att-data-index="hiddenItem_index"
            t-attf-style="top:{{unhideStyleValue(hiddenItem[0]) + 3}}px;"
            t-on-click="() => this.unhide(hiddenItem)">
            <t t-call="o-spreadsheet-Icon.TRIANGLE_DOWN"/>
          </div>
        </t>
      </t>
    </div>
  </t>

  <t t-name="o-spreadsheet-ColResizer">
    <div
      class="o-col-resizer"
      t-on-mousemove.self="onMouseMove"
      t-on-mouseleave="onMouseLeave"
      t-on-mousedown.self.prevent="select"
      t-ref="colResizer"
      t-on-mouseup.self="onMouseUp"
      t-on-contextmenu.self="onContextMenu"
      t-att-class="{'o-grab': state.waitingForMove, 'o-dragging': state.isMoving, }">
      <div
        t-if="state.isMoving"
        class="dragging-col-line"
        t-attf-style="left:{{state.draggerLinePosition}}px;"
      />
      <div
        t-if="state.isMoving"
        class="dragging-col-shadow"
        t-attf-style="left:{{state.draggerShadowPosition}}px; width:{{state.draggerShadowThickness}}px"
      />
      <t t-if="state.resizerIsActive">
        <div
          class="o-handle"
          t-on-mousedown="onMouseDown"
          t-on-dblclick="onDblClick"
          t-on-contextmenu.prevent=""
          t-attf-style="left:{{state.draggerLinePosition - 2}}px;">
          <div class="dragging-resizer" t-if="state.isResizing"/>
        </div>
      </t>
      <t
        t-foreach="env.model.getters.getHiddenColsGroups(env.model.getters.getActiveSheetId())"
        t-as="hiddenItem"
        t-key="hiddenItem_index">
        <t t-if="!hiddenItem.includes(0)">
          <div
            class="o-unhide"
            t-att-data-index="hiddenItem_index"
            t-attf-style="left:{{unhideStyleValue(hiddenItem[0]) - 17}}px; margin-right:6px;"
            t-on-click="() => this.unhide(hiddenItem)">
            <t t-call="o-spreadsheet-Icon.TRIANGLE_LEFT"/>
          </div>
        </t>
        <t
          t-if="!hiddenItem.includes(env.model.getters.getNumberCols(env.model.getters.getActiveSheetId())-1)">
          <div
            class="o-unhide"
            t-att-data-index="hiddenItem_index"
            t-attf-style="left:{{unhideStyleValue(hiddenItem[0]) + 3}}px;"
            t-on-click="() => this.unhide(hiddenItem)">
            <t t-call="o-spreadsheet-Icon.TRIANGLE_RIGHT"/>
          </div>
        </t>
      </t>
    </div>
  </t>

  <t t-name="o-spreadsheet-HeaderGroup">
    <div
      class="o-header-group position-absolute"
      t-att-style="groupBoxStyle"
      t-att-data-id="props.group.start + '-' + props.group.end"
      t-on-click="toggleGroup"
      t-on-contextmenu.stop.prevent="onContextMenu">
      <div
        class="o-header-group-header position-absolute d-flex align-items-center justify-content-center overflow-hidden"
        t-att-style="groupHeaderStyle">
        <div
          class="o-group-fold-button user-select-none rounded d-flex align-items-center justify-content-center"
          t-att-style="groupButtonStyle">
          <t t-call="{{groupButtonIcon}}"/>
        </div>
      </div>
      <div
        class="o-group-border position-absolute"
        t-if="!isGroupFolded"
        t-att-style="groupBorderStyle"
      />
    </div>
  </t>

  <t t-name="o-spreadsheet-HeaderGroupContainer">
    <div
      class="o-header-group-container d-flex w-100 h-100 overflow-hidden"
      t-att-class="{
        'flex-column': props.dimension === 'ROW',
        'flex-row': props.dimension === 'COL',
      }"
      t-if="props.layers.length"
      t-on-contextmenu.prevent="onContextMenu">
      <div
        class="o-header-group-frozen-pane flex-shrink-0 overflow-hidden position-relative"
        t-att-class="{
          'o-group-rows': props.dimension === 'ROW',
          'o-group-columns': props.dimension === 'COL',
        }"
        t-if="hasFrozenPane"
        t-att-style="frozenPaneContainerStyle">
        <t t-foreach="props.layers" t-as="layer" t-key="layer_index">
          <t t-foreach="layer" t-as="group" t-key="group.start + '-' + group.end">
            <t
              t-component="groupComponent"
              group=" group"
              layerOffset="getLayerOffset(layer_index)"
              openContextMenu.bind="openContextMenu"
            />
          </t>
        </t>
      </div>
      <div
        class="o-header-group-frozen-pane-border"
        t-att-class="{
          'o-group-rows': props.dimension === 'ROW',
          'o-group-columns': props.dimension === 'COL',
        }"
        t-if="hasFrozenPane"
      />

      <div
        class="o-header-group-main-pane flex-shrink-0 position-relative h-100 w-100 overflow-hidden"
        t-att-class="{
          'o-group-rows': hasFrozenPane and props.dimension === 'ROW',
          'o-group-columns': hasFrozenPane and props.dimension === 'COL',
        }">
        <div
          class="o-header-group-scroll-container position-relative"
          t-att-style="scrollContainerStyle">
          <t t-foreach="props.layers" t-as="layer" t-key="layer_index">
            <t t-foreach="layer" t-as="group" t-key="group.start + '-' + group.end">
              <t
                t-component="groupComponent"
                group="group"
                layerOffset="getLayerOffset(layer_index)"
                openContextMenu.bind="openContextMenu"
              />
            </t>
          </t>
        </div>
      </div>

      <Menu
        t-if="menu.isOpen"
        menuItems="menu.menuItems"
        position="menu.position"
        onClose.bind="this.closeMenu"
      />
    </div>
  </t>

  <t t-name="o-spreadsheet-Border">
    <div
      class="o-border"
      t-on-mousedown.prevent="onMouseDown"
      t-att-style="style"
      t-att-class="{
          'o-moving': props.isMoving,
          'o-border-n': props.orientation === 'n',
          'o-border-s': props.orientation === 's',
          'o-border-w': props.orientation === 'w',
          'o-border-e': props.orientation === 'e',
        }"
    />
  </t>

  <t t-name="o-spreadsheet-Corner">
    <div
      class="o-corner"
      t-on-mousedown.prevent="onMouseDown"
      t-att-style="style"
      t-att-class="{
          'o-resizing': props.isResizing,
          'o-corner-nw': props.orientation === 'nw',
          'o-corner-ne': props.orientation === 'ne',
          'o-corner-sw': props.orientation === 'sw',
          'o-corner-se': props.orientation === 'se',
        }"
    />
  </t>

  <t t-name="o-spreadsheet-Highlight">
    <div class="o-highlight" t-ref="highlight">
      <t t-foreach="['n', 's', 'w', 'e']" t-as="orientation" t-key="orientation">
        <Border
          onMoveHighlight="(x, y) => this.onMoveHighlight(x,y)"
          isMoving='highlightState.shiftingMode === "isMoving"'
          orientation="orientation"
          zone="props.zone"
        />
      </t>
      <t t-foreach="['nw', 'ne', 'sw', 'se']" t-as="orientation" t-key="orientation">
        <Corner
          onResizeHighlight="(isLeft, isTop) => this.onResizeHighlight(isLeft, isTop)"
          isResizing='highlightState.shiftingMode === "isResizing"'
          orientation="orientation"
          zone="props.zone"
          color="props.color"
        />
      </t>
    </div>
  </t>

  <t t-name="o-spreadsheet-Icon.CLEAR_AND_RELOAD">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M14 15H4V3h6v3h4M4 1.5A1.5 1.5 0 0 0 2.5 3v12a1.5 1.5 0 0 0 1.4 1.5h10a1.5 1.5 0 0 0 1.5-1.5V5l-3.5-3.5
        "
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.EXPORT_XLSX">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M0 1a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1m4-4V1H1v3m7 0V1H5v3M4 8V5H1v3m7 0V5H5v3m-3.5 2h2v4h3v-1.5l3 2.5-3 2.5V16h-5m9.5-6h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1m1.7 7 1.3-2 1.3 2h2l-2-3 2-3h-2L14 13l-1.3-2h-2l2 3-2 3"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.OPEN_READ_ONLY">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M13 7V5c0-2.5-2-4-4-4S5 2.5 5 5v2h-.5C3.5 7 3 7.5 3 8.5v7c0 1 .5 1.5 1.5 1.5h9c1 0 1.5-.5 1.5-1.5v-7c0-1-.5-1.5-1.5-1.5m-7-2c0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5v2h-5V5m1 7a1.5 1.5 0 0 1 3 0 1.5 1.5 0 0 1-3 0"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.OPEN_DASHBOARD">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M13 2.07A8 8 0 1 0 15.93 5L14.2 6A6 6 0 1 1 12 3.8m-2 3.47a2 2 0 1 0 .73.73l5.5-5.5-.6-.6M9.3 3.8a.6.6 0 1 1-.01-.01m1.81.51a.6.6 0 1 1-.01-.01M7.5 4.3a.6.6 0 1 1-.01-.01M5.9 5.4a.6.6 0 1 1-.01-.01M4.8 6.9a.6.6 0 1 1-.01-.01m8.71.61a.6.6 0 1 0-.01 0"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.OPEN_READ_WRITE">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M13 7V5a4 4 0 0 0-8 0v2h-.5C3.5 7 3 7.5 3 8.5v7c0 1 .5 1.5 1.5 1.5h9c1 0 1.5-.5 1.5-1.5v-7c0-1-.5-1.5-1.5-1.5m-7-2a2 2 0 0 1 5 0v2h-5m1 5a1.5 1.5 0 0 1 3 0 1.5 1.5 0 0 1-3 0m6 3.5h-9v-7h9"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.IMPORT_XLSX">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M9 10a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1m4-4v-3h-3v3m7 0v-3h-3v3m-1 4v-3h-3v3m7 0v-3h-3v3M.5 9h2v4h3v-1.5l3 2.5-3 2.5V15h-5M1 0h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1m1.7 7L4 5l1.3 2h2l-2-3 2-3h-2L4 3 2.7 1h-2l2 3-2 3"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.UNDO">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M5.43 9.43 8 12H1V5l2.96 2.958A8.29 8.29 0 0 1 9.32 6c3.46 0 6.42 2.11 7.68 5l-2 1c-.94-2.39-3.13-3.92-5.68-4a6.57 6.57 0 0 0-3.89 1.43"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.REDO">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M12.57 9.43 10 12h7V5l-2.96 2.96A8.29 8.29 0 0 0 8.68 6C5.22 6 2.26 8.11 1 11l2 1c.94-2.39 3.13-3.92 5.68-4a6.58 6.58 0 0 1 3.89 1.43"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.COPY">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M14.5 15.23v1.5H3a1 1 0 0 1-1-1V3.23h1.5v11a1 1 0 0 0 1 1h10m0-3.5a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h6.5a1 1 0 0 1 1 1m-9-2.5a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1H15a1 1 0 0 0 1-1v-11a1 1 0 0 0-1-1"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.CUT">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M3 2v2l4.5 5-1.2 1.3c-.4-.2-.8-.3-1.3-.3-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3c0-.5-.1-.9-.3-1.3L9 10.4l1.3 1.3c-.2.4-.3.8-.3 1.3 0 1.7 1.3 3 3 3s3-1.3 3-3-1.3-3-3-3c-.5 0-.9.1-1.3.3L10.4 9 15 4.4V2h-.4L9 7.6 3.4 2H3Zm2 12.5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5Zm9.5-1.5c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5.7-1.5 1.5-1.5 1.5.7 1.5 1.5ZM9 8.5c.3 0 .5.2.5.5s-.2.5-.5.5-.5-.2-.5-.5.2-.5.5-.5"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.PASTE">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M14.5 2.5H11C10.7 1.6 10 1 9 1s-1.5.5-2 1.5H3.5C2.5 2.5 2 3 2 4v11c0 1 .5 1.5 1.5 1.5h11c1 0 1.5-.5 1.5-1.5V4c0-1-.5-1.5-1.5-1.5Zm-4.75.75c0 .5-.34.75-.75.75s-.75-.34-.75-.75.34-.75.75-.75.75.34.75.75ZM14.5 15h-11V4H5v2.5h8V4h1.5v11"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.FIND_AND_REPLACE">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M10.75 11.25c-1 .75-2.25 1.25-3.5 1.25-3 0-5.5-2.5-5.5-5.5s2.5-5.5 5.5-5.5 5.5 2.5 5.5 5.5c0 1.25-.5 2.5-1.25 3.5l.25.25h.75l4 4-1.5 1.5-4-4v-.75l-.25-.25ZM7.25 11c2.25 0 4-1.75 4-4s-1.75-4-4-4-4 1.75-4 4 1.75 4 4 4"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.DELETE">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M12 1.75v-1H6v1H1.5v2h1v12a1.5 1.5 0 0 0 1.5 1.5h10a1.5 1.5 0 0 0 1.5-1.5v-12h1v-2M4 15.75v-12h10v12Zm2-10.5h2v9H6Zm4 0h2v9h-2"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.CLEAR">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M1.5 15a.75.75 0 0 0 0 1.5h15a.75.75 0 0 0 0-1.5M5.3 12.75c.1.1.3.2.5.2h4c.2 0 .4-.1.5-.2l5.5-5.5c.2-.3.2-.6 0-.8l-4.4-4.4c-.3-.2-.6-.2-.8 0l-4.8 4.8c-2.7 2.9-3.1 2.8-2.4 4M7 7.25l3.6 3.6-1 1-3.6.1-1.8-1.9"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.FREEZE">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M.5 17.5h16a1 1 0 0 0 1-1v-15a1 1 0 0 0-1-1h-15a1 1 0 0 0-1 1v15a1 1 0 0 0 1 1m9-10.5v4.5H6V7m0 9v-3.5h4.5V16M5 16H3.5L5 14.5M5 13l-3 3v-1.5l3-3M2 13v-2l3-3v2m-3-.5v-2l3-3v2M2 6V4l2-2h1v1m11 13h-4.5v-3.5H16m0-1h-4.5V7H16m0-5v4h-4.5V2m-1 4H6V2h4.5"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.UNFREEZE">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M.5 17.5h16a1 1 0 0 0 1-1v-15a1 1 0 0 0-1-1h-15a1 1 0 0 0-1 1v15a1 1 0 0 0 1 1M5 6H2V2h3m0 9.5H2V7h3m0 9H2v-3.5h3M10.5 7v4.5H6V7m0 9v-3.5h4.5V16m5.5 0h-4.5v-3.5H16m0-1h-4.5V7H16m0-5v4h-4.5V2m-1 4H6V2h4.5"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.SHOW_HIDE_GRID">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M.5 2A1.5 1.5 0 0 1 2 .5h14A1.5 1.5 0 0 1 17.5 2v7H11V7H7v4s-.5 0-1.5 1h-1v5h-3a1.5 1.5 0 0 1-1-1M6 6V2H2v4m9 0V2H7v4m9 0V2h-4v4m-6 5V7H2v4m14-2V7h-4v2m-7.5 6.5V12H2v3.5 M14 10.5c1 0 1 .5 1 1-1.5 2.5-3.5 4.5-5 6.5-.5 0-1-.5-1-1-1-.5-1.5-1-2.5-2 0 0-.5-.5 0-1 1.5-2 4-3 7-3m-1 1.5C13.5 12 4 14 10 16c0 0-1.5-2 2.5-3.5m5 1.5c.5.5.5 1 .5 1-1.5 2-3.5 3-6 2.5.5-.5.5-1 1-1s5.5-1 2-3.5l1-1"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.SHOW_HIDE_FORMULA">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M7 14.25q-.25.75-.75 1.25T5 16q-.75 0-1.5-.5Q3 15 3 14.25q0-.5.25-.75t.75-.25q.25 0 .25.75v.5H5q.5 0 .5-.5l1.25-6.5H5V6h2l.5-2.25q.25-.75.75-1.25T9.5 2q1 0 1.5.5t.5 1q0 .5-.25.75t-.5.25q-.5 0-.75-.25t-.25-.5V3H9.5q-.25 0-.5.5L8.5 6H10v1.5H8.25m1.25 1H15v1h-4l2 2-2 2h4v1H9V14l2.5-2.5L9 9"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.HIDE_ROW">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M.5 2A1.5 1.5 0 0 1 2 .5h14A1.5 1.5 0 0 1 17.5 2v14a1.5 1.5 0 0 1-1.5 1.5H2A1.5 1.5 0 0 1 .5 16V2H2v3.5h14V2H2v9h14V7H2v9h14v-3.5H2M1 12l4-5h2l-4 5m2 0 4-5h2l-4 5m2 0 4-5h2l-4 5m2 0 4-5v4"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.HIDE_COL">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M16 .5A1.5 1.5 0 0 1 17.5 2v14a1.5 1.5 0 0 1-1.5 1.5H2A1.5 1.5 0 0 1 .5 16V2A1.5 1.5 0 0 1 2 .5h14V2h-3.5v14H16V2H7v14h4V2H2v14h3.5V2M6 1l5 4v2L6 3m0 2 5 4v2L6 7m0 2 5 4v2l-5-4m0 2 5 4H"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.INSERT_ROW">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M.5 2A1.5 1.5 0 0 1 2 .5h14A1.5 1.5 0 0 1 17.5 2v14a1.5 1.5 0 0 1-1.5 1.5H2A1.5 1.5 0 0 1 .5 16V2H2v3.5h14V2H2v9h14V7H2v9h14v-3.5H2"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.INSERT_ROW_BEFORE">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M3.5 14.5A1.5 1.5 0 0 0 5 16h10a1.5 1.5 0 0 0 1.5-1.5v-7h-3V5h3V1.5A1.5 1.5 0 0 0 15 0H5a1.5 1.5 0 0 0-1.5 1.5v2h-3V9h3M15 12.5v2H5v-2M15 9v2H5V9m10-7.5v2H5v-2M12 5v2.5H2V5"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.INSERT_ROW_AFTER">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M3.5 1.5A1.5 1.5 0 0 1 5 0h10a1.5 1.5 0 0 1 1.5 1.5v7h-3V11h3v3.5A1.5 1.5 0 0 1 15 16H5a1.5 1.5 0 0 1-1.5-1.5v-2h-3V7h3M15 3.5v-2H5v2M15 7V5H5v2m10 7.5v-2H5v2m7-3.5V8.5H2V11"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.INSERT_COL">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M.5 2A1.5 1.5 0 0 1 2 .5h14A1.5 1.5 0 0 1 17.5 2v14a1.5 1.5 0 0 1-1.5 1.5H2A1.5 1.5 0 0 1 .5 16V2H2v14h3.5V2H2h5v14h4V2H2h10.5v14H16V2H2"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.INSERT_COL_AFTER">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M2.5 3A1.5 1.5 0 0 0 1 4.5v10A1.5 1.5 0 0 0 2.5 16h7v-3H12v3h3.5a1.5 1.5 0 0 0 1.5-1.5v-10A1.5 1.5 0 0 0 15.5 3h-2V0H8v3M4.5 14.5h-2v-10h2m3.5 10H6v-10h2m7.5 10h-2v-10h2m-3.5 7H9.5v-10H12"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.INSERT_COL_BEFORE">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M15.5 3A1.5 1.5 0 0 1 17 4.5v10a1.5 1.5 0 0 1-1.5 1.5h-7v-3H6v3H2.5A1.5 1.5 0 0 1 1 14.5v-10A1.5 1.5 0 0 1 2.5 3h2V0H10v3m3.5 11.5h2v-10h-2m-3.5 10h2v-10h-2m-7.5 10h2v-10h-2m3.5 7h2.5v-10H6"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.INSERT_CELL">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M.5 2A1.5 1.5 0 0 1 2 .5h14A1.5 1.5 0 0 1 17.5 2v14a1.5 1.5 0 0 1-1.5 1.5H2A1.5 1.5 0 0 1 .5 16V2H2v14h14V2H2"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.INSERT_CELL_SHIFT_DOWN">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M5 2.5A1.5 1.5 0 0 1 6.5 1h10A1.5 1.5 0 0 1 18 2.5v13a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 5 15.5v-5h5.25v-3H5m11.5-2v-3h-4.75v3m-1.5 0v-3H6.5v3m10 5v-3h-4.75v3m-1.5 5v-3H6.5v3m10 0v-3h-4.75v3M0 12.5l2.5 4 2.5-4H3.25v-6h-1.5v6"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.INSERT_CELL_SHIFT_RIGHT">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M2.5 5A1.5 1.5 0 0 0 1 6.5v10A1.5 1.5 0 0 0 2.5 18h13a1.5 1.5 0 0 0 1.5-1.5v-10A1.5 1.5 0 0 0 15.5 5h-5v5.25h-3V5m-2 11.5h-3v-4.75h3m0-1.5h-3V6.5h3m5 10h-3v-4.75h3m5-1.5h-3V6.5h3m0 10h-3v-4.75h3M12.5 0l4 2.5-4 2.5V3.25h-6v-1.5h6"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.DELETE_CELL_SHIFT_UP">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M5 2.5A1.5 1.5 0 0 1 6.5 1h10A1.5 1.5 0 0 1 18 2.5v13a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 5 15.5v-5h5.25v-3H5m11.5-2v-3h-4.75v3m-1.5 0v-3H6.5v3m10 5v-3h-4.75v3m-1.5 5v-3H6.5v3m10 0v-3h-4.75v3M0 10l2.5-4L5 10H3.25v6h-1.5v-6"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.DELETE_CELL_SHIFT_LEFT">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M2.5 5A1.5 1.5 0 0 0 1 6.5v10A1.5 1.5 0 0 0 2.5 18h13a1.5 1.5 0 0 0 1.5-1.5v-10A1.5 1.5 0 0 0 15.5 5h-5v5.25h-3V5m-2 11.5h-3v-4.75h3m0-1.5h-3V6.5h3m5 10h-3v-4.75h3m5-1.5h-3V6.5h3m0 10h-3v-4.75h3M10 0 6 2.5 10 5V3.25h6v-1.5h-6"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.INSERT_CHART">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M.5 2A1.5 1.5 0 0 1 2 .5h14A1.5 1.5 0 0 1 17.5 2v14a1.5 1.5 0 0 1-1.5 1.5H2A1.5 1.5 0 0 1 .5 16V2H2v14h14V2H2m1.5 12.5h2v-7h-2m3 7h2v-10h-2m3 10h2v-5h-2m3 5h2v-11h-2M2 14.5h14v1H2"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.INSERT_IMAGE">
    <svg class="o-icon" fill="currentColor">
      <path
        d="M.5 2A1.5 1.5 0 0 1 2 .5h14A1.5 1.5 0 0 1 17.5 2v14a1.5 1.5 0 0 1-1.5 1.5H2A1.5 1.5 0 0 1 .5 16V2H2v14h14V2H2m10 4.5L10 11 8.5 9.5l-2 2.5L5 10.5l-2 3h12M3.5,5a1.5,1.5,0,0,1,3,0a1.5,1.5,0,0,1,-3,0"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.INSERT_LINK">
    <svg class="o-icon" fill="currentColor">
      <path
        d="M6.88 13.69c.19-.19.41-.28.68-.28.27 0 .51.09.72.28.43.45.43.92 0 1.4l-.84.8c-.75.75-1.63 1.12-2.64 1.12-1.04 0-1.93-.37-2.68-1.12C1.37 15.14 1 14.26 1 13.25c0-1.04.37-1.93 1.12-2.68l2.96-2.96c.93-.9 1.89-1.42 2.88-1.54.98-.12 1.84.17 2.56.86.21.21.32.45.32.72 0 .26-.1.51-.32.72-.48.43-.95.43-1.4 0-.67-.64-1.55-.41-2.67.68l-2.93 2.92c-.35.35-.52.77-.52 1.28s.17.92.52 1.24c.35.35.76.52 1.26.52.49 0 .91-.17 1.26-.52l.84-.8m9-11.48c.75.75 1.12 1.63 1.12 2.64 0 1.04-.37 1.94-1.12 2.68l-3.16 3.16c-.99.96-1.99 1.44-3 1.44-.83 0-1.57-.33-2.24-1a.913.913 0 0 1-.28-.68c0-.27.09-.5.27-.72.19-.19.43-.28.71-.28.28 0 .51.09.7.28.66.64 1.48.48 2.44-.48l3.16-3.12c.37-.37.56-.8.56-1.28 0-.51-.19-.92-.56-1.24-.32-.35-.7-.56-1.12-.62-.43-.07-.83.07-1.2.42l-1 1c-.22.19-.45.28-.72.28-.26 0-.5-.09-.68-.28-.46-.45-.46-.92 0-1.4l1-1c.72-.72 1.56-1.06 2.54-1.02.97.04 1.83.45 2.58 1.22"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.INSERT_SHEET">
    <svg class="o-icon" fill="currentColor">
      <path
        d="M17.5 5.5V16a1.5 1.5 0 0 1-1.5 1.5H2A1.5 1.5 0 0 1 .5 16V2A1.5 1.5 0 0 1 2 .5h10.5M2 5.5h3.5V2H2m5.25 3.5h3.5V2h-3.5M2 10.75h3.5v-3.5H2m5.25 3.5h3.5v-3.5h-3.5m5.25 3.5H16v-3.5h-3.5M2 16h3.5v-3.5H2M7.25 16h3.5v-3.5h-3.5M12.5 16H16v-3.5h-3.5"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.PAINT_FORMAT">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M9,0 L1,0 C0.45,0 0,0.45 0,1 L0,4 C0,4.55 0.45,5 1,5 L9,5 C9.55,5 10,4.55 10,4 L10,3 L11,3 L11,6 L4,6 L4,14 L6,14 L6,8 L13,8 L13,2 L10,2 L10,1 C10,0.45 9.55,0 9,0 Z"
        transform="translate(3 2)"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.CONDITIONAL_FORMAT">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M12.25.5c2 0 3.5 1.5 3.5 3.5v6.5c0 .5 0 2-2 2h-2.5v4c0 .5-.5 1-1 1h-2.5c-.5 0-1-.5-1-1v-4h-2.5c-1 0-2-1-2-2V.5m12 3a1.5 1.5 0 0 0-1.5-1.5h-3v2h-1.5V2h-1v4h-2V2h-1.5v8.5h10.5m-12-3h12.5V9H2.25"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.CLEAR_FORMAT">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M2.12 4.05 7.28 9.2l-2.43 5.3h2.5l1.64-3.58 4.59 4.58 1.27-1.27L3.4 2.77 2.12 4.05ZM5.67 2.5l2 2h1.76l-.55 1.21 1.71 1.71 1.34-2.92h3.92v-2H5.67"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.TRIANGLE_DOWN">
    <svg class="o-icon">
      <polygon fill="currentColor" points="0 0 4 4 8 0" transform="translate(5 7)"/>
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.TRIANGLE_UP">
    <svg class="o-icon">
      <polygon fill="currentColor" points="4 0 0 4 8 4" transform="translate(5 7)"/>
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.TRIANGLE_RIGHT">
    <svg class="o-icon">
      <polygon fill="currentColor" points="0 0 4 4 0 8" transform="translate(5 5)"/>
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.TRIANGLE_LEFT">
    <svg class="o-icon">
      <polygon fill="currentColor" points="4 0 0 4 4 8" transform="translate(5 5)"/>
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.BOLD">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M13.5 6.5C13.5 4.57 11.93 3 10 3H4.5v12h6.25c1.79 0 3.25-1.46 3.25-3.25 0-1.3-.77-2.41-1.87-2.93.83-.58 1.37-1.44 1.37-2.32M9.5 5c.83 0 1.5.67 1.5 1.5S10.33 8 9.5 8h-2V5h2m-2 8v-3H10c.83 0 1.5.67 1.5 1.5S10.83 13 10 13H7.5"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.ITALIC">
    <svg class="o-icon">
      <path fill="currentColor" d="M7 3v2h2.58l-3.66 8H3v2h8v-2H8.42l3.66-8H15V3"/>
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.UNDERLINE">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M9 15c2.76 0 5-2.24 5-5V3h-2v7c0 1.75-1.5 3-3 3s-3-1.242-3-3V3H4v7c0 2.76 2.24 5 5 5Zm-6 1v2h12v-2H3"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.STRIKE">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M4.89 6.06c0-.46.1-.87.3-1.25.2-.38.46-.7.84-.97s.78-.47 1.28-.62A5.71 5.71 0 0 1 8.93 3c.61 0 1.16.08 1.65.25.5.17.92.4 1.27.7.35.3.62.66.81 1.07.19.41.28.87.28 1.36h-2.26a1.85 1.85 0 0 0-.11-.64 1.26 1.26 0 0 0-.33-.51 1.53 1.53 0 0 0-.56-.33A2.42 2.42 0 0 0 8.89 4.8c-.3 0-.55.03-.77.1a1.52 1.52 0 0 0-.54.27 1.14 1.14 0 0 0-.43.9c0 .36.18.66.55.91l.06.04C8.02 7.19 8.5 7.5 9 8H6s-.79-.62-.82-.69c-.19-.36-.29-.77-.29-1.25M16 9H2v2h7.22c.14.05.3.1.41.15.28.12.5.26.65.38.16.13.26.27.32.42.06.15.08.33.08.51 0 .18-.03.34-.1.49a1.02 1.02 0 0 1-.31.39 1.6 1.6 0 0 1-.53.26 2.71 2.71 0 0 1-.76.09c-.33 0-.62-.03-.89-.1a1.8 1.8 0 0 1-.68-.31 1.45 1.45 0 0 1-.44-.56c-.11-.23-.19-.57-.19-.74H4.55c0 .25.06.69.18 1.02a3.15 3.15 0 0 0 1.22 1.6c.28.2.58.36.92.49.33.13.67.23 1.04.29.36.06.72.09 1.08.09.6 0 1.15-.07 1.64-.21a3.88 3.88 0 0 0 1.25-.59 2.69 2.69 0 0 0 .8-.95c.19-.38.28-.81.28-1.29 0-.45-.08-.86-.23-1.211a2.26 2.26 0 0 0-.13-.25L16 11V9"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.TEXT_COLOR">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M10 1H8L3.5 13h2l1.12-3h4.75l1.12 3h2L10 1ZM7.38 8 9 3.67 10.62 8H7.38"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.FILL_COLOR">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M14.5 8.87S13 10.49 13 11.49c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5c0-.99-1.5-2.62-1.5-2.62m-1.79-2.08L5.91 0 4.85 1.06l1.59 1.59-4.15 4.14a.996.996 0 0 0 0 1.41l4.5 4.5c.2.2.45.3.71.3.26 0 .51-.1.71-.29l4.5-4.5c.39-.39.39-1.03 0-1.42M4.21 7 7.5 3.71 10.79 7H4.21"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.MERGE_CELL">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M3 6H1V2h7v2H3v2m7-2V2h7v4h-2V4h-5m0 10h5v-2h2v4h-7v-2m-9-2h2v2h5v2H1v-4m0-4h4V6l3 3-3 3v-2H1V8m9 1 3-3v2h4v2h-4v2l-3-3"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.ALIGN_LEFT">
    <svg class="o-icon align-left">
      <path fill="currentColor" d="M2 16h10v-2H2v2M12 6H2v2h10V6M2 2v2h14V2H2m0 10h14v-2H2v2"/>
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.ALIGN_CENTER">
    <svg class="o-icon align-center">
      <path fill="currentColor" d="M4 14v2h10v-2H4m0-8v2h10V6H4m-2 6h14v-2H2v2M2 2v2h14V2H2"/>
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.ALIGN_RIGHT">
    <svg class="o-icon align-right">
      <path fill="currentColor" d="M6 16h10v-2H6v2m-4-4h14v-2H2v2M2 2v2h14V2H2m4 6h10V6H6v2"/>
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.ALIGN_TOP">
    <svg class="o-icon align-top">
      <path d="M3 2h12v2H3m2.5 5H8v7h2V9h2.5L9 5.5" fill="currentColor"/>
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.ALIGN_MIDDLE">
    <svg class="o-icon align-middle">
      <path
        d="M12.5 3H10V0H8v3H5.5L9 6.5M5.5 15H8v3h2v-3h2.5L9 11.5M3 8v2h12V8"
        fill="currentColor"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.ALIGN_BOTTOM">
    <svg class="o-icon align-bottom">
      <path d="M5.5 9H8V2h2v7h2.5L9 12.5M3 14v2h12v-2" fill="currentColor"/>
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.WRAPPING_OVERFLOW">
    <svg class="o-icon wrapping-overflow">
      <path d="M13 8H6v2h7v2l3-3-3-3M2 2h2v14H2M9 2h2v4H9m0 6h2v4H9" fill="currentColor"/>
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.WRAPPING_WRAP">
    <svg class="o-icon wrapping-wrap">
      <path
        fill="currentColor"
        d="M6 5v2h3.75c.75 0 1.5.67 1.5 1.5 0 .75-.75 1.5-1.5 1.5H8V8l-3 3 3 3v-2h1.5c2 0 3.5-1.5 3.5-3.5S11.5 5 9.5 5M2 2h2v14H2M14 2M14,2,h2v14h-2"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.WRAPPING_CLIP">
    <svg class="o-icon wrapping-clip">
      <path fill="currentColor" d="M2 2h2v14H2M14 2h2v14h-2v-6H6V8h8"/>
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.BORDERS">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M2 2v14h14V2H2m6 12H4v-4h4v4m0-6H4V4h4v4m6 6h-4v-4h4v4m0-6h-4V4h4v4"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.BORDER_HV">
    <svg class="o-icon" fill="currentColor">
      <path
        d="M2 16h2v-2H2v2M4 5H2v2h2V5m1 11h2v-2H5v2m8-14h-2v2h2V2M4 2H2v2h2V2m3 0H5v2h2V2M2 13h2v-2H2v2m9 3h2v-2h-2v2m3-14v2h2V2h-2m0 5h2V5h-2v2m0 9h2v-2h-2v2m0-3h2v-2h-2v2"
        opacity=".54"
      />
      <path d="M10 2H8v6H2v2h6v6h2v-6h6V8h-6"/>
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.BORDER_H">
    <svg class="o-icon" fill="currentColor">
      <path
        d="M8 16h2v-2H8v2M5 4h2V2H5v2m3 9h2v-2H8v2m-3 3h2v-2H5v2M2 7h2V5H2v2m0 9h2v-2H2v2M2 4h2V2H2v2m0 9h2v-2H2v2m12 0h2v-2h-2v2m0 3h2v-2h-2v2m0-9h2V5h-2v2m0-5v2h2V2h-2M8 4h2V2H8v2m3 0h2V2h-2v2M8 7h2V5H8v2m3 9h2v-2h-2v2"
        opacity=".54"
      />
      <path d="M2 10h14V8H2"/>
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.BORDER_V">
    <svg class="o-icon" fill="currentColor">
      <path
        d="M5 16h2v-2H5v2M2 7h2V5H2v2m0-3h2V2H2v2m3 6h2V8H5v2m0-6h2V2H5v2M2 16h2v-2H2v2m0-6h2V8H2v2m0 3h2v-2H2v2M14 2v2h2V2h-2m0 8h2V8h-2v2m0 6h2v-2h-2v2m0-9h2V5h-2v2m0 6h2v-2h-2v2m-3 3h2v-2h-2v2m0-6h2V8h-2v2m0-6h2V2h-2v2"
        opacity=".54"
      />
      <path d="M8 16h2V2H8"/>
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.BORDER_EXTERNAL">
    <svg class="o-icon" fill="currentColor">
      <path d="M10 5H8v2h2V5m3 3h-2v2h2V8m-3 0H8v2h2V8m0 3H8v2h2v-2M7 8H5v2h2V8" opacity=".54"/>
      <path d="M2 2h14v14H2V2m12 12V4H4v10h10"/>
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.BORDER_LEFT">
    <svg class="o-icon" fill="currentColor">
      <path
        d="M8 10h2V8H8v2m0-3h2V5H8v2m0 6h2v-2H8v2m0 3h2v-2H8v2m-3 0h2v-2H5v2M5 4h2V2H5v2m0 6h2V8H5v2m9 6h2v-2h-2v2m0-6h2V8h-2v2m0 3h2v-2h-2v2m0-6h2V5h-2v2M8 4h2V2H8v2m6-2v2h2V2h-2m-3 14h2v-2h-2v2m0-6h2V8h-2v2m0-6h2V2h-2v2"
        opacity=".54"
      />
      <path d="M2 16h2V2H2"/>
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.BORDER_TOP">
    <svg class="o-icon" fill="currentColor">
      <path
        d="M5 10h2V8H5v2m-3 6h2v-2H2v2m6 0h2v-2H8v2m0-3h2v-2H8v2m-3 3h2v-2H5v2m-3-3h2v-2H2v2m6-3h2V8H8v2M2 7h2V5H2v2m0 3h2V8H2v2m12 0h2V8h-2v2m0 3h2v-2h-2v2m0-6h2V5h-2v2M8 7h2V5H8v2m3 9h2v-2h-2v2m0-6h2V8h-2v2m3 6h2v-2h-2v2"
        opacity=".54"
      />
      <path d="M2 2v2h14V2"/>
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.BORDER_RIGHT">
    <svg class="o-icon" fill="currentColor">
      <path
        d="M2 4h2V2H2v2m3 0h2V2H5v2m0 6h2V8H5v2m0 6h2v-2H5v2M2 7h2V5H2v2m0 3h2V8H2v2m0 6h2v-2H2v2m0-3h2v-2H2v2m9-3h2V8h-2v2m-3 6h2v-2H8v2m3 0h2v-2h-2v2M8 4h2V2H8v2m3 0h2V2h-2v2m-3 9h2v-2H8v2m0-6h2V5H8v2m0 3h2V8H8v2"
        opacity=".54"
      />
      <path d="M14 2v14h2V2"/>
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.BORDER_BOTTOM">
    <svg class="o-icon" fill="currentColor">
      <path
        d="M7 2H5v2h2V2m3 6H8v2h2V8m0 3H8v2h2v-2m3-3h-2v2h2V8M7 8H5v2h2V8m6-6h-2v2h2V2m-3 3H8v2h2V5m0-3H8v2h2V2m-6 9H2v2h2v-2m10 2h2v-2h-2v2m0-6h2V5h-2v2m0 3h2V8h-2v2m0-8v2h2V2h-2M4 2H2v2h2V2m0 3H2v2h2V5m0 3H2v2h2V8"
        opacity=".54"
      />
      <path d="M2 16h14v-2H2"/>
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.BORDER_CLEAR">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M8 16h2v-2H8v2m-3-6h2V8H5v2m0-6h2V2H5v2m3 9h2v-2H8v2m-3 3h2v-2H5v2M2 7h2V5H2v2m0 9h2v-2H2v2M2 4h2V2H2v2m0 6h2V8H2v2m6 0h2V8H8v2m-6 3h2v-2H2v2m12 0h2v-2h-2v2m0 3h2v-2h-2v2m0-6h2V8h-2v2m0-3h2V5h-2v2m0-5v2h2V2h-2M8 4h2V2H8v2m3 0h2V2h-2v2M8 7h2V5H8v2m3 9h2v-2h-2v2m0-6h2V8h-2v2"
        opacity=".54"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.BORDER_TYPE">
    <svg class="o-icon">
      <g fill="currentColor" transform="translate(2 2)">
        <polygon points="0 0 0 2 14 2 14 0"/>
        <polygon points="0 6 0 8 5 8 5 6"/>
        <polygon points="9 6 9 8 14 8 14 6"/>
        <polygon points="0 12 0 14 2 14 2 12"/>
        <polygon points="4 12 4 14 6 14 6 12"/>
        <polygon points="8 12 8 14 10 14 10 12"/>
        <polygon points="12 12 12 14 14 14 14 12"/>
      </g>
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.BORDER_COLOR">
    <svg class="o-icon">
      <g fill="currentColor" transform="translate(4 2)">
        <polygon points="0 12 0 9 7 2 10 5 3 12"/>
        <polygon points="8 1 9 0 12 3 11 4"/>
      </g>
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.BORDER_NO_COLOR">
    <svg class="o-icon">
      <g fill="currentColor">
        <polygon points="4 12 4 9 11 2 14 5 7 12"/>
        <polygon points="12 1 13 0 16 3 15 4"/>
      </g>
      <g>
        <rect x="0" y="14" width="18" height="4" stroke="black" fill="none"/>
      </g>
    </svg>
  </t>

  <t t-name="o-spreadsheet-Icon.PLUS">
    <svg class="o-icon plus" viewBox="0 0 18 18">
      <path fill="currentColor" d="M8 0h2v8h8v2h-8v8H8v-8H0V8h8"/>
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.MINUS">
    <svg class="o-icon minus" viewBox="0 0 18 18">
      <path fill="currentColor" d="M0 8h18v2H0z"/>
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.LIST">
    <svg class="o-icon" viewBox="0 0 384 384">
      <rect x="0" y="277.333" width="384" height="42.667" fill="currentColor"/>
      <rect x="0" y="170.667" width="384" height="42.667" fill="currentColor"/>
      <rect x="0" y="64" width="384" height="42.667" fill="currentColor"/>
    </svg>
  </t>

  <t t-name="o-spreadsheet-Icon.EDIT">
    <svg class="o-icon" viewBox="0 0 576 512">
      <path
        fill="currentColor"
        d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.UNLINK">
    <svg class="o-icon" viewBox="0 0 512 512">
      <path
        fill="currentColor"
        d="M304.083 405.907c4.686 4.686 4.686 12.284 0 16.971l-44.674 44.674c-59.263 59.262-155.693 59.266-214.961 0-59.264-59.265-59.264-155.696 0-214.96l44.675-44.675c4.686-4.686 12.284-4.686 16.971 0l39.598 39.598c4.686 4.686 4.686 12.284 0 16.971l-44.675 44.674c-28.072 28.073-28.072 73.75 0 101.823 28.072 28.072 73.75 28.073 101.824 0l44.674-44.674c4.686-4.686 12.284-4.686 16.971 0l39.597 39.598zm-56.568-260.216c4.686 4.686 12.284 4.686 16.971 0l44.674-44.674c28.072-28.075 73.75-28.073 101.824 0 28.072 28.073 28.072 73.75 0 101.823l-44.675 44.674c-4.686 4.686-4.686 12.284 0 16.971l39.598 39.598c4.686 4.686 12.284 4.686 16.971 0l44.675-44.675c59.265-59.265 59.265-155.695 0-214.96-59.266-59.264-155.695-59.264-214.961 0l-44.674 44.674c-4.686 4.686-4.686 12.284 0 16.971l39.597 39.598zm234.828 359.28l22.627-22.627c9.373-9.373 9.373-24.569 0-33.941L63.598 7.029c-9.373-9.373-24.569-9.373-33.941 0L7.029 29.657c-9.373 9.373-9.373 24.569 0 33.941l441.373 441.373c9.373 9.372 24.569 9.372 33.941 0z"
      />
    </svg>
  </t>
  /** Font Awesome by Dave Gandy
 *  http://fontawesome.io/
 *  https://fontawesome.com/license
 */
  <t t-name="o-spreadsheet-Icon.CARET_UP">
    <svg class="caret-up" viewBox="0 0 320 512">
      <path
        fill="currentColor"
        d="M288.662 352H31.338c-17.818 0-26.741-21.543-14.142-34.142l128.662-128.662c7.81-7.81 20.474-7.81 28.284 0l128.662 128.662c12.6 12.599 3.676 34.142-14.142 34.142z"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.CARET_DOWN">
    <svg class="caret-down" viewBox="0 0 320 512">
      <path
        fill="currentColor"
        d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.CARET_RIGHT">
    <svg class="o-icon caret-right" viewBox="0 0 192 512">
      <path
        d="M0 384.662V127.338c0-17.818 21.543-26.741 34.142-14.142l128.662 128.662c7.81 7.81 7.81 20.474 0 28.284L34.142 398.804C21.543 411.404 0 402.48 0 384.662z"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.CARET_LEFT">
    <svg class="o-icon caret-left" viewBox="0 0 192 512">
      <path
        d="M192 127.338v257.324c0 17.818-21.543 26.741-34.142 14.142L29.196 270.142c-7.81-7.81-7.81-20.474 0-28.284l128.662-128.662c12.599-12.6 34.142-3.676 34.142 14.142z"
      />
    </svg>
  </t>

  <t t-name="o-spreadsheet-Icon.TRASH">
    <svg class="o-cf-icon trash" viewBox="0 0 448 512">
      <path
        fill="currentColor"
        d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.REFRESH">
    <svg class="o-cf-icon refresh" viewBox="0 0 512 512">
      <path
        fill="currentColor"
        d="M440.65 12.57l4 82.77A247.16 247.16 0 0 0 255.83 8C134.73 8 33.91 94.92 12.29 209.82A12 12 0 0 0 24.09 224h49.05a12 12 0 0 0 11.67-9.26 175.91 175.91 0 0 1 317-56.94l-101.46-4.86a12 12 0 0 0-12.57 12v47.41a12 12 0 0 0 12 12H500a12 12 0 0 0 12-12V12a12 12 0 0 0-12-12h-47.37a12 12 0 0 0-11.98 12.57zM255.83 432a175.61 175.61 0 0 1-146-77.8l101.8 4.87a12 12 0 0 0 12.57-12v-47.4a12 12 0 0 0-12-12H12a12 12 0 0 0-12 12V500a12 12 0 0 0 12 12h47.35a12 12 0 0 0 12-12.6l-4.15-82.57A247.17 247.17 0 0 0 255.83 504c121.11 0 221.93-86.92 243.55-201.82a12 12 0 0 0-11.8-14.18h-49.05a12 12 0 0 0-11.67 9.26A175.86 175.86 0 0 1 255.83 432z"
      />
    </svg>
  </t>

  <t t-name="o-spreadsheet-Icon.ARROW_DOWN">
    <svg
      class="o-cf-icon arrow-down"
      width="10"
      height="10"
      focusable="false"
      viewBox="0 0 448 512">
      <path
        fill="#DC6965"
        t-att-style="color"
        d="M413.1 222.5l22.2 22.2c9.4 9.4 9.4 24.6 0 33.9L241 473c-9.4 9.4-24.6 9.4-33.9 0L12.7 278.6c-9.4-9.4-9.4-24.6 0-33.9l22.2-22.2c9.5-9.5 25-9.3 34.3.4L184 343.4V56c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24v287.4l114.8-120.5c9.3-9.8 24.8-10 34.3-.4z"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.ARROW_UP">
    <svg class="o-cf-icon arrow-up" width="10" height="10" focusable="false" viewBox="0 0 448 512">
      <path
        fill="#00A04A"
        t-att-style="color"
        d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.ARROW_RIGHT">
    <svg
      class="o-cf-icon arrow-right"
      width="10"
      height="10"
      focusable="false"
      viewBox="0 0 448 512">
      <path
        fill="#F0AD4E"
        d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"
      />
    </svg>
  </t>

  <t t-name="o-spreadsheet-Icon.SMILE">
    <svg class="o-cf-icon smile" width="10" height="10" focusable="false" viewBox="0 0 496 512">
      <path
        fill="#00A04A"
        d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm4 72.6c-20.8 25-51.5 39.4-84 39.4s-63.2-14.3-84-39.4c-8.5-10.2-23.7-11.5-33.8-3.1-10.2 8.5-11.5 23.6-3.1 33.8 30 36 74.1 56.6 120.9 56.6s90.9-20.6 120.9-56.6c8.5-10.2 7.1-25.3-3.1-33.8-10.1-8.4-25.3-7.1-33.8 3.1z"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.MEH">
    <svg class="o-cf-icon meh" width="10" height="10" focusable="false" viewBox="0 0 496 512">
      <path
        fill="#F0AD4E"
        d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160-64c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm8 144H160c-13.2 0-24 10.8-24 24s10.8 24 24 24h176c13.2 0 24-10.8 24-24s-10.8-24-24-24z"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.FROWN">
    <svg class="o-cf-icon frown" width="10" height="10" focusable="false" viewBox="0 0 496 512">
      <path
        fill="#DC6965"
        d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160-64c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm-80 128c-40.2 0-78 17.7-103.8 48.6-8.5 10.2-7.1 25.3 3.1 33.8 10.2 8.4 25.3 7.1 33.8-3.1 16.6-19.9 41-31.4 66.9-31.4s50.3 11.4 66.9 31.4c8.1 9.7 23.1 11.9 33.8 3.1 10.2-8.5 11.5-23.6 3.1-33.8C326 321.7 288.2 304 248 304z"
      />
    </svg>
  </t>

  <t t-name="o-spreadsheet-Icon.GREEN_DOT">
    <svg class="o-cf-icon green-dot" width="10" height="10" focusable="false" viewBox="0 0 512 512">
      <path
        fill="#00A04A"
        d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.YELLOW_DOT">
    <svg
      class="o-cf-icon yellow-dot"
      width="10"
      height="10"
      focusable="false"
      viewBox="0 0 512 512">
      <path
        fill="#F0AD4E"
        d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.RED_DOT">
    <svg class="o-cf-icon red-dot" width="10" height="10" focusable="false" viewBox="0 0 512 512">
      <path
        fill="#DC6965"
        d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.SORT_RANGE">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M9 3.5h8v2H9M9 8h6v2H9m0 2.5h3v2H9M6 6l1-1-3-3-3 3 1 1 1-1v8l-1-1-1 1 3 3 3-3-1-1-1 1V5"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.SORT_ASCENDING">
    <svg class="o-icon" fill="currentColor">
      <path d="m3 13-1-1-1 1 3 3 3-3-1-1-1 1V0H3"/>
      <text x="9" y="7" class="small-text">A</text>
      <text x="9.3" y="15" class="small-text">Z</text>
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.SORT_DESCENDING">
    <svg class="o-icon" fill="currentColor">
      <path d="m3 13.9-1-1-1 1 3 3 3-3-1-1-1 1V.9H3"/>
      <text x="9.3" y="7.9" class="small-text">Z</text>
      <text x="9" y="15.9" class="small-text">A</text>
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.DATA_CLEANUP">
    <svg class="o-icon" fill="currentColor">
      <path
        d="m13.6 6.4-2.1-2.1c-.4-.4-1-.4-1.4 0l-8.8 8.9c-.4.4-.4 1 0 1.4l2.1 2.1c.4.4 1 .4 1.4 0l8.8-8.9c.4-.4.4-1 0-1.4M8 8.5 10.5 6l1.4 1.4-2.5 2.5m3-7 1.8.8.8 1.8.8-1.8 1.8-.8-1.8-.8L14.9.4l-.8 1.8M3.5 4l1.7.7.8 1.8.8-1.8 1.8-.8-1.8-.8-.8-1.8-.8 1.8zm13.5 7.7-1.8-.8-.8-1.8-.8 1.8-1.8.8 1.8.8.8 1.8.7-1.8"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.FILTER_ICON">
    <svg
      class="o-cf-icon filter-icon"
      width="10"
      height="10"
      focusable="false"
      viewBox="0 0 850 850">
      <path
        fill="currentColor"
        d="M 339.667 681 L 510.333 681 L 510.333 595.667 L 339.667 595.667 L 339.667 681 Z M 41 169 L 41 254.333 L 809 254.333 L 809 169 L 41 169 Z M 169 467.667 L 681 467.667 L 681 382.333 L 169 382.333 L 169 467.667 Z"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.FILTER_ICON_ACTIVE">
    <svg
      class="o-cf-icon filter-icon-active"
      width="10"
      height="10"
      focusable="false"
      viewBox="0 0 512 512">
      <path
        fill="currentColor"
        d="M487.976 0H24.028C2.71 0-8.047 25.866 7.058 40.971L192 225.941V432c0 7.831 3.821 15.17 10.237 19.662l80 55.98C298.02 518.69 320 507.493 320 487.98V225.941l184.947-184.97C520.021 25.896 509.338 0 487.976 0z"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.FILTER_ICON_INACTIVE">
    <svg
      class="o-cf-icon filter-icon-inactive"
      width="10"
      height="10"
      focusable="false"
      viewBox="0 0 512 512">
      <path
        fill="currentColor"
        d="M487.976 0H24.028C2.71 0-8.047 25.866 7.058 40.971L192 225.941V432c0 7.831 3.821 15.17 10.237 19.662l80 55.98C298.02 518.69 320 507.493 320 487.98V225.941l184.947-184.97C520.021 25.896 509.338 0 487.976 0z"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.MENU_FILTER_ICON">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M16.6.5H1.29C.59.5.23 1.35.73 1.85l6.1 6.1v6.8c0 .26.13.5.34.65l2.64 1.85a.79.79 0 0 0 1.25-.65V7.96l6.1-6.1A.79.79 0 0 0 16.6.51"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.SEARCH">
    <svg class="search-icon" width="10" height="10" focusable="false" viewBox="0 0 512 512">
      <path
        fill="currentColor"
        d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.CHECK">
    <svg class="o-icon" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M18.707 7.293a1 1 0 0 1 0 1.414L11.414 16a2 2 0 0 1-2.828 0l-3.293-3.293a1 1 0 1 1 1.414-1.414L10 14.586l7.293-7.293a1 1 0 0 1 1.414 0z"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.PERCENT">
    <span class="o-text-icon">%</span>
  </t>
  <t t-name="o-spreadsheet-Icon.DECRASE_DECIMAL">
    <span class="o-text-icon">.0</span>
  </t>
  <t t-name="o-spreadsheet-Icon.INCREASE_DECIMAL">
    <span class="o-text-icon">.00</span>
  </t>
  <t t-name="o-spreadsheet-Icon.NUMBER_FORMATS">
    <svg class="o-icon" fill="currentColor">
      <path
        d="M0 6h2v8h2V4H0m9 0H5v2h4v2H6.5A1.5 1.5 0 0 0 5 9.5V14h6v-2H7v-2h2.5A1.5 1.5 0 0 0 11 8.5v-3A1.5 1.5 0 0 0 9.5 4M12 4v2h4v2h-2v2h2v2h-4v2h4.5a1.5 1.5 0 0 0 1.5-1.5v-2A1.5 1.5 0 0 0 16.5 9 1.5 1.5 0 0 0 18 7.5v-2A1.5 1.5 0 0 0 16.5 4"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.FONT_SIZE">
    <svg class="o-icon" fill="currentColor">
      <text x="2" y="15" class="small-text">A</text>
      <text x="6" y="15" class="heavy-text">A</text>
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.TRIANGLE_EXCLAMATION">
    <svg class="o-icon" viewBox="0 0 512 512">
      <path
        fill="currentColor"
        d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.SPLIT_TEXT">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M14 6v2h-4v2h4v2l3-3m-9 1V8H4V6L1 9l3 3v-2m3.5-6.5h3V7H12V3.5h3V2H3v1.5h3V7h1.5m3 7.5h-3V11H6v3.5H3V16h12v-1.5h-3V11h-1.5"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.ERROR">
    <svg class="error-icon" width="14" height="14" viewBox="0 0 512 512">
      <path
        fill="currentColor"
        d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.DISPLAY_HEADER">
    <svg class="o-icon" width="18" height="18">
      <path
        fill="currentColor"
        d="M.75.5h16.5v17H.75m1.5-12H.75V7h1.5v1.5H.75V10h1.5v1.5H.75V13h1.5v1.5H.75V16h1.5v1.5h1.5V16h1.5v1.5h1.5V16h1.5v1.5h1.5V16h1.5v1.5h1.5V16h1.5v1.5h1.5V16h1.5v-1.5h-1.5V13h1.5v-1.5h-1.5V10h1.5V8.5h-1.5V7h1.5V5.5M2.75 2.25v1.5h2v-1.5m2.5 0v1.5h7v-1.5"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.COG">
    <svg fill="currentColor" viewBox="0 0 16 16">
      <path
        d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"
      />
      <path
        d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.PLUS_IN_BOX">
    <svg
      class="o-icon"
      width="18"
      height="18"
      style="fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5">
      <path stroke="currentColor" d="M1.5,1.5h15v15h-15v-15M9,5v8M5,9h8"/>
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.GROUP_ROWS">
    <svg class="o-icon" width="18" height="18">
      <path
        fill="currentColor"
        d="M6 2.5A1.5 1.5 0 0 1 7.5 1H16a1.5 1.5 0 0 1 1.5 1.5V15a1.5 1.5 0 0 1-1.5 1.5H7.5A1.5 1.5 0 0 1 6 15M7.5 2.5v2H16v-2M7.5 6v2H16V6M7.5 9.5v2H16v-2M7.5 13v2H16v-2M2 5.75V13h3v-1.5H3.5V5.75h1.25V3l-1 1v.75H3M.25 1.25v4.5h4.5v-4.5m-3.5 1h2.5v2.5h-2.5"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.UNGROUP_ROWS">
    <svg class="o-icon" width="18" height="18">
      <path
        fill="currentColor"
        d="M6 2.5A1.5 1.5 0 0 1 7.5 1H16a1.5 1.5 0 0 1 1.5 1.5V15a1.5 1.5 0 0 1-1.5 1.5H7.5A1.5 1.5 0 0 1 6 15M7.5 2.5v2H16v-2M7.5 6v2H16V6M7.5 9.5v2H16v-2M7.5 13v2H16v-2M2 5.75V13h3v-1.5H3.5V5.75M0 5.25.75 6l2-2 2 2 .75-.75-2-2 2-2L4.75.5l-2 2-2-2-.75.75 2 2"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.GROUP_COLUMNS">
    <svg class="o-icon" width="18" height="18">
      <path
        fill="currentColor"
        d="M2.75 6a1.5 1.5 0 0 0-1.5 1.5V16a1.5 1.5 0 0 0 1.5 1.5h12.5a1.5 1.5 0 0 0 1.5-1.5V7.5a1.5 1.5 0 0 0-1.5-1.5M2.75 7.5h2V16h-2m3.5-8.5h2V16h-2m3.5-8.5h2V16h-2m3.5-8.5h2V16h-2M6 2h7.25v3h-1.5V3.5H6v1.25H3.25l1-1H5V3M1.5.25H6v4.5H1.5m1-3.5v2.5H5v-2.5"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.UNGROUP_COLUMNS">
    <svg class="o-icon" width="18" height="18">
      <path
        fill="currentColor"
        d="M2.75 6a1.5 1.5 0 0 0-1.5 1.5V16a1.5 1.5 0 0 0 1.5 1.5h12.5a1.5 1.5 0 0 0 1.5-1.5V7.5a1.5 1.5 0 0 0-1.5-1.5M2.75 7.5h2V16h-2m3.5-8.5h2V16h-2m3.5-8.5h2V16h-2m3.5-8.5h2V16h-2M6 2h7.25v3h-1.5V3.5H6M5.5 0l.75.75-2 2 2 2-.75.75-2-2-2 2-.75-.75 2-2-2-2L1.5 0l2 2"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.DATA_VALIDATION">
    <svg class="o-icon">
      <path
        fill="currentColor"
        d="M.5 2A1.5 1.5 0 0 1 2 .5h14A1.5 1.5 0 0 1 17.5 2v7H11V7H7v4s-.5 0-1.5 1h-1v5h-3a1.5 1.5 0 0 1-1-1M6 6V2H2v4m9 0V2H7v4m9 0V2h-4v4m-6 5V7H2v4m14-2V7h-4v2m-7.5 6.5V12H2v3.5"
      />
      <path
        stroke="currentColor"
        style="fill:none; stroke-linecap:round; stroke-width:1.5"
        d="M8,13 l3 3 l6 -5"
      />
    </svg>
  </t>
  <t t-name="o-spreadsheet-Icon.THIN_DRAG_HANDLE">
    <svg class="o-icon" viewBox="0 0 4 16" fill="currentColor">
      <circle cx="2" cy="3.5" r="1"/>
      <circle cx="2" cy="6.5" r="1"/>
      <circle cx="2" cy="9.5" r="1"/>
      <circle cx="2" cy="12.5" r="1"/>
    </svg>
  </t>

  <t t-name="o-spreadsheet-IconPicker">
    <div class="o-icon-picker">
      <t t-foreach="iconSets" t-as="iconSet" t-key="iconSet">
        <div class="o-cf-icon-line">
          <div
            class="o-icon-picker-item"
            t-on-click="() => this.onIconClick(iconSets[iconSet].good)">
            <t t-call="o-spreadsheet-Icon.{{icons[iconSets[iconSet].good].template}}"/>
          </div>
          <div
            class="o-icon-picker-item"
            t-on-click="() => this.onIconClick(iconSets[iconSet].neutral)">
            <t t-call="o-spreadsheet-Icon.{{icons[iconSets[iconSet].neutral].template}}"/>
          </div>
          <div
            class="o-icon-picker-item"
            t-on-click="() => this.onIconClick(iconSets[iconSet].bad)">
            <t t-call="o-spreadsheet-Icon.{{icons[iconSets[iconSet].bad].template}}"/>
          </div>
        </div>
      </t>
    </div>
  </t>

  <t t-name="o-spreadsheet-LinkDisplay">
    <div class="o-link-tool d-flex align-items-center">
      <!-- t-key to prevent owl from re-using the previous img element when the link changes.
    The wrong/previous image would be displayed while the new one loads -->
      <img
        t-if="link.isExternal"
        t-key="link.url"
        t-attf-src="https://www.google.com/s2/favicons?sz=16&amp;domain={{link.url}}"
      />
      <a
        t-if="link.isExternal"
        class="o-link"
        t-att-href="link.url"
        target="_blank"
        t-on-click.prevent="openLink"
        t-att-title="link.url">
        <t t-esc="getUrlRepresentation(link)"/>
      </a>
      <a
        t-else=""
        class="o-link"
        t-on-click.prevent="openLink"
        t-att-title="getUrlRepresentation(link)">
        <t t-esc="getUrlRepresentation(link)"/>
      </a>
      <span
        t-if="!env.model.getters.isReadonly()"
        class="o-link-icon o-unlink"
        t-on-click="unlink"
        title="Remove link">
        <t t-call="o-spreadsheet-Icon.UNLINK"/>
      </span>
      <span
        t-if="!env.model.getters.isReadonly()"
        class="o-link-icon o-edit-link"
        t-on-click="edit"
        title="Edit link">
        <t t-call="o-spreadsheet-Icon.EDIT"/>
      </span>
    </div>
  </t>

  <t t-name="o-spreadsheet-LinkEditor">
    <div
      class="o-link-editor"
      t-on-click.stop="() => this.menu.isOpen=false"
      t-on-keydown="onKeyDown"
      t-ref="linkEditor">
      <div class="o-section">
        <div class="o-section-title">Text</div>
        <div class="d-flex">
          <input type="text" title="Link label" class="o-input flex-grow-1" t-model="link.label"/>
        </div>

        <div class="o-section-title mt-3">Link</div>
        <div class="o-link-url">
          <t t-if="link.isUrlEditable">
            <input type="text" title="Link URL" t-ref="urlInput" t-model="link.url"/>
          </t>
          <t t-else="">
            <input
              type="text"
              title="Link URL"
              t-att-value="getUrlRepresentation(link)"
              disabled="1"
            />
          </t>
          <button t-if="link.url" t-on-click="removeLink" class="o-remove-url">✖</button>
          <button t-if="!link.url" t-on-click.stop="openMenu" class="o-special-link">
            <t t-call="o-spreadsheet-Icon.LIST"/>
          </button>
        </div>
      </div>
      <Menu
        t-if="menu.isOpen"
        position="menuPosition"
        menuItems="menuItems"
        onMenuClicked="(ev) => this.onSpecialLink(ev)"
        onClose="() => this.menu.isOpen=false"
      />
      <div class="o-buttons">
        <button t-on-click="cancel" class="o-button o-cancel">Cancel</button>
        <button t-on-click="save" class="o-button o-save" t-att-disabled="!link.url">
          Confirm
        </button>
      </div>
    </div>
  </t>

  <t t-name="o-spreadsheet-Menu">
    <Popover t-if="menuItemsAndSeparators.length" t-props="popoverProps">
      <div
        t-ref="menu"
        class="o-menu"
        t-on-scroll="onScroll"
        t-on-wheel.stop=""
        t-on-click.stop=""
        t-on-contextmenu.prevent="">
        <t t-foreach="menuItemsAndSeparators" t-as="menuItem" t-key="menuItem_index">
          <div t-if="menuItem === 'separator'" class="o-separator"/>
          <t t-else="">
            <t t-set="isMenuRoot" t-value="isRoot(menuItem)"/>
            <t t-set="isMenuEnabled" t-value="isEnabled(menuItem)"/>
            <div
              t-att-title="getName(menuItem)"
              t-att-data-name="menuItem.id"
              t-on-click="(ev) => this.onClickMenu(menuItem, menuItem_index, ev)"
              t-on-mouseover="(ev) => this.onMouseOver(menuItem, menuItem_index, ev)"
              class="o-menu-item"
              t-att-class="{ 'o-menu-root': isMenuRoot, 'disabled': !isMenuEnabled, 'o-menu-item-active': isParentMenu(subMenu, menuItem)}"
              t-att-style="getColor(menuItem)">
              <div class="d-flex w-100">
                <div t-if="childrenHaveIcon" class="o-menu-item-icon align-middle">
                  <t t-if="getIconName(menuItem)" t-call="{{getIconName(menuItem)}}"/>
                </div>
                <div class="o-menu-item-name align-middle text-truncate" t-esc="getName(menuItem)"/>
                <t t-set="description" t-value="menuItem.description(env)"/>
                <div
                  t-if="description"
                  class="o-menu-item-description ms-auto text-truncate"
                  t-esc="description"
                />
                <div
                  t-if="isMenuRoot"
                  class="o-menu-item-root align-middle ms-auto"
                  t-call="o-spreadsheet-Icon.TRIANGLE_RIGHT"
                />
              </div>
            </div>
          </t>
        </t>
      </div>
      <Menu
        t-if="subMenu.isOpen"
        position="subMenuPosition"
        menuItems="subMenu.menuItems"
        depth="props.depth + 1"
        maxHeight="props.maxHeight"
        onMenuClicked="props.onMenuClicked"
        onClose="() => this.close()"
        menuId="props.menuId"
      />
    </Popover>
  </t>

  <t t-name="o-spreadsheet-PaintFormatButton">
    <span
      class="o-menu-item-button"
      title="Paint Format"
      t-att-class="{active: isActive}"
      t-attf-class="{{props.class}}"
      t-on-click="togglePaintFormat"
      t-on-dblclick="onDblClick">
      <span>
        <t t-call="o-spreadsheet-Icon.PAINT_FORMAT"/>
      </span>
    </span>
  </t>

  <t t-name="o-spreadsheet-Popover">
    <t t-portal="'.o-spreadsheet'">
      <div
        class="o-popover"
        t-ref="popover"
        t-on-wheel="props.onMouseWheel"
        t-att-style="popoverStyle"
        t-on-click.stop="">
        <t t-slot="default"/>
      </div>
    </t>
  </t>

  <t t-name="o-spreadsheet-ScrollBar">
    <div class="o-scrollbar" t-on-scroll="onScroll" t-ref="scrollbar" t-att-style="positionCss">
      <div t-att-style="sizeCss"/>
    </div>
  </t>

  <t t-name="o-spreadsheet-SelectionInput">
    <div class="o-selection">
      <div
        t-foreach="ranges"
        t-as="range"
        t-key="range.id"
        class="o-selection-input d-flex flex-row"
        t-att-class="props.class">
        <div class="position-relative w-100">
          <input
            type="text"
            spellcheck="false"
            t-on-input="(ev) => this.onInputChanged(range.id, ev)"
            t-on-focus="() => this.focus(range.id)"
            t-on-keydown="onKeydown"
            t-att-value="range.xc"
            t-att-style="getColor(range)"
            class="w-100"
            t-att-class="{
              'o-focused' : range.isFocused,
              'o-required': props.required,
              'o-optional': !props.required,
              'o-invalid border-danger position-relative': isInvalid || !range.isValidRange,
              'text-decoration-underline': range.isFocused and state.mode === 'select-range'
            }"
            t-ref="{{range.isFocused ? 'focusedInput' : 'unfocusedInput' + range_index}}"
          />
          <span
            t-if="isInvalid || !range.isValidRange"
            class="error-icon text-danger position-absolute d-flex align-items-center"
            title="This range is invalid">
            <t t-call="o-spreadsheet-Icon.ERROR"/>
          </span>
        </div>
        <button
          class="o-btn border-0 bg-transparent fw-bold o-remove-selection"
          t-if="ranges.length > 1"
          t-on-click="() => this.removeInput(range.id)">
          ✕
        </button>
      </div>

      <div class="o-selection-input d-flex flex-row">
        <button
          class="o-btn-action bg-transparent fw-bold o-add-selection"
          t-if="canAddRange"
          t-on-click="addEmptyInput">
          Add range
        </button>
        <button
          class="o-btn-action bg-transparent fw-bold o-selection-ko"
          t-if="isResettable"
          t-on-click="reset">
          Reset
        </button>
        <button
          class="o-btn-action bg-transparent fw-bold o-selection-ok"
          t-if="isConfirmable"
          t-on-click="confirm">
          Confirm
        </button>
      </div>
    </div>
  </t>

  <t t-name="o-spreadsheet-BarConfigPanel">
    <div>
      <div class="o-section pt-0">
        <label class="o-checkbox">
          <input
            type="checkbox"
            name="stacked"
            t-att-checked="props.definition.stacked"
            t-on-change="onUpdateStacked"
            class="align-middle"
          />
          Stacked barchart
        </label>
      </div>
      <div class="o-section o-data-series">
        <div class="o-section-title">Data Series</div>
        <SelectionInput
          ranges="() => this.getDataSeriesRanges()"
          required="true"
          onSelectionChanged="(ranges) => this.onDataSeriesRangesChanged(ranges)"
          onSelectionConfirmed="() => this.onDataSeriesConfirmed()"
        />
      </div>
      <div class="o-section o-data-labels">
        <div class="o-section-title">Categories / Labels</div>
        <SelectionInput
          ranges="() => [this.getLabelRange()]"
          isInvalid="isLabelInvalid"
          hasSingleRange="true"
          onSelectionChanged="(ranges) => this.onLabelRangeChanged(ranges)"
          onSelectionConfirmed="() => this.onLabelRangeConfirmed()"
        />
        <label class="o-checkbox">
          <input
            type="checkbox"
            name="aggregated"
            t-att-checked="props.definition.aggregated"
            t-on-change="onUpdateAggregated"
            class="align-middle"
          />
          Aggregate
        </label>
      </div>
      <div class="o-section o-use-row-as-headers" t-if="calculateHeaderPosition()">
        <label class="o-checkbox">
          <input
            type="checkbox"
            t-att-checked="props.definition.dataSetsHaveTitle"
            t-on-change="onUpdateDataSetsHaveTitle"
            class="align-middle"
          />
          <span>
            Use row
            <t t-esc="calculateHeaderPosition()"/>
            as headers
          </span>
        </label>
      </div>

      <div class="o-section" t-if="errorMessages.length">
        <ValidationMessages messages="errorMessages" msgType="'error'"/>
      </div>
    </div>
  </t>

  <t t-name="o-spreadsheet-BarChartDesignPanel">
    <t t-set="background_color">Background Color</t>
    <div>
      <div class="o-section o-chart-background-color">
        <div class="o-section-title">Background color</div>
        <div class="d-flex align-items-center">
          <span class="pe-1">Select a color...</span>
          <ColorPickerWidget
            currentColor="props.definition.background"
            toggleColorPicker="() => this.toggleColorPicker()"
            showColorPicker="state.fillColorTool"
            onColorPicked="(color) => this.updateBackgroundColor(color)"
            title="background_color"
            icon="'o-spreadsheet-Icon.FILL_COLOR'"
          />
        </div>
      </div>
      <div class="o-section o-chart-title">
        <div class="o-section-title">Title</div>
        <input
          type="text"
          t-model="state.title"
          t-on-change="updateTitle"
          class="o-input o-optional"
          placeholder="New Chart"
        />
      </div>
      <div class="o-section">
        <div class="o-section-title">Vertical axis position</div>
        <select
          t-att-value="props.definition.verticalAxisPosition"
          class="o-input o-type-selector"
          t-on-change="(ev) => this.updateSelect('verticalAxisPosition', ev)">
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
      </div>
      <div class="o-section">
        <div class="o-section-title">Legend position</div>
        <select
          t-att-value="props.definition.legendPosition"
          class="o-input o-type-selector"
          t-on-change="(ev) => this.updateSelect('legendPosition', ev)">
          <option value="none">None</option>
          <option value="top">Top</option>
          <option value="bottom">Bottom</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
      </div>
    </div>
  </t>

  <t t-name="o-spreadsheet-GaugeChartConfigPanel">
    <div>
      <div class="o-section o-data-series">
        <div class="o-section-title">Data range</div>
        <SelectionInput
          ranges="() => [this.getDataRange()]"
          isInvalid="isDataRangeInvalid"
          hasSingleRange="true"
          required="true"
          onSelectionChanged="(ranges) => this.onDataRangeChanged(ranges)"
          onSelectionConfirmed="() => this.updateDataRange()"
        />
      </div>

      <div class="o-section" t-if="configurationErrorMessages.length">
        <ValidationMessages messages="configurationErrorMessages" msgType="'error'"/>
      </div>
    </div>
  </t>

  <t t-name="o-spreadsheet-GaugeChartDesignPanel">
    <t t-set="background_color">Background Color</t>
    <div>
      <div class="o-section o-chart-background-color">
        <div class="o-section-title">Background color</div>
        <div class="d-flex align-items-center">
          <span class="pe-1">Select a color...</span>
          <ColorPickerWidget
            currentColor="props.definition.background"
            toggleColorPicker="() => this.toggleMenu('backgroundColor', ev)"
            showColorPicker="state.openedMenu === 'backgroundColor'"
            onColorPicked="(color) => this.updateBackgroundColor(color)"
            title="background_color"
            icon="'o-spreadsheet-Icon.FILL_COLOR'"
          />
        </div>
      </div>

      <div class="o-section o-chart-title">
        <div class="o-section-title">Title</div>
        <input
          type="text"
          t-model="state.title"
          t-on-change="updateTitle"
          class="o-input o-optional"
          placeholder="New Chart"
        />
      </div>

      <div class="o-section">
        <div class="o-section-title">Range</div>
        <div class="o-subsection-left">
          <input
            type="text"
            t-model="state.sectionRule.rangeMin"
            t-on-change="() => this.updateSectionRule(state.sectionRule)"
            t-on-input="() => this.canUpdateSectionRule(state.sectionRule)"
            class="o-input o-data-range-min"
            t-att-class="{ 'o-invalid': isRangeMinInvalid() }"
          />
        </div>
        <div class="o-subsection-right">
          <input
            type="text"
            t-model="state.sectionRule.rangeMax"
            t-on-change="() => this.updateSectionRule(state.sectionRule)"
            t-on-input="() => this.canUpdateSectionRule(state.sectionRule)"
            class="o-input o-data-range-max"
            t-att-class="{ 'o-invalid': isRangeMaxInvalid() }"
          />
        </div>
      </div>

      <div class="o-section">
        <div class="o-section-title">Thresholds</div>
        <t t-call="o-spreadsheet-GaugeChartColorSectionTemplate">
          <t t-set="sectionRule" t-value="state.sectionRule"/>
        </t>
      </div>

      <div class="o-section" t-if="designErrorMessages.length">
        <ValidationMessages messages="designErrorMessages" msgType="'error'"/>
      </div>
    </div>
  </t>

  <t t-name="o-spreadsheet-GaugeChartColorSectionTemplate">
    <div class="o-gauge-color-set">
      <table>
        <tr>
          <th class="o-gauge-color-set-colorPicker"/>
          <th class="o-gauge-color-set-text"/>
          <th class="o-gauge-color-set-value">Value</th>
          <th class="o-gauge-color-set-type">Type</th>
        </tr>

        <t t-call="o-spreadsheet-GaugeChartColorSectionTemplateRow">
          <t t-set="sectionColor" t-value="sectionRule.colors.lowerColor"/>
          <t t-set="sectionType" t-value="'lowerColor'"/>
          <t t-set="inflectionPoint" t-value="sectionRule.lowerInflectionPoint"/>
          <t t-set="isInvalid" t-value="isLowerInflectionPointInvalid"/>
          <t t-set="inflectionPointName" t-value="'lowerInflectionPoint'"/>
        </t>

        <t t-call="o-spreadsheet-GaugeChartColorSectionTemplateRow">
          <t t-set="sectionColor" t-value="sectionRule.colors.middleColor"/>
          <t t-set="sectionType" t-value="'middleColor'"/>
          <t t-set="inflectionPoint" t-value="sectionRule.upperInflectionPoint"/>
          <t t-set="isInvalid" t-value="isUpperInflectionPointInvalid"/>
          <t t-set="inflectionPointName" t-value="'upperInflectionPoint'"/>
        </t>

        <tr>
          <td>
            <ColorPickerWidget
              currentColor="sectionRule.colors.upperColor"
              toggleColorPicker="(ev) => this.toggleMenu('sectionColor-upperColor', ev)"
              showColorPicker="state.openedMenu === 'sectionColor-upperColor'"
              onColorPicked="(color) => this.updateSectionColor('upperColor', color)"
              icon="'o-spreadsheet-Icon.FILL_COLOR'"
            />
          </td>
          <td>Else</td>
          <td/>
          <td/>
          <td/>
        </tr>
      </table>
    </div>
  </t>

  <t t-name="o-spreadsheet-GaugeChartColorSectionTemplateRow">
    <tr>
      <td>
        <ColorPickerWidget
          currentColor="sectionColor"
          toggleColorPicker="(ev) => this.toggleMenu('sectionColor-'+sectionType, ev)"
          showColorPicker="state.openedMenu === 'sectionColor-'+sectionType"
          onColorPicked="(color) => this.updateSectionColor(sectionType, color)"
          icon="'o-spreadsheet-Icon.FILL_COLOR'"
        />
      </td>
      <td>When value is below</td>
      <td>
        <input
          type="text"
          class="o-input"
          t-model="inflectionPoint.value"
          t-on-input="() => this.canUpdateSectionRule(state.sectionRule)"
          t-on-change="() => this.updateSectionRule(state.sectionRule)"
          t-attf-class="o-input-{{inflectionPointName}}"
          t-att-class="{ 'o-invalid': isInvalid }"
        />
      </td>
      <td>
        <select
          class="o-input"
          name="valueType"
          t-model="inflectionPoint.type"
          t-on-change="(ev) => this.updateSectionRule(state.sectionRule)">
          <option value="number">Number</option>
          <option value="percentage">Percentage</option>
        </select>
      </td>
    </tr>
  </t>

  <t t-name="o-spreadsheet-LineBarPieConfigPanel">
    <div>
      <div class="o-section o-data-series">
        <div class="o-section-title">Data Series</div>
        <SelectionInput
          ranges="() => this.getDataSeriesRanges()"
          required="true"
          onSelectionChanged="(ranges) => this.onDataSeriesRangesChanged(ranges)"
          onSelectionConfirmed="() => this.onDataSeriesConfirmed()"
        />
      </div>
      <div class="o-section o-data-labels">
        <div class="o-section-title">Categories / Labels</div>
        <SelectionInput
          ranges="() => [this.getLabelRange()]"
          isInvalid="isLabelInvalid"
          hasSingleRange="true"
          onSelectionChanged="(ranges) => this.onLabelRangeChanged(ranges)"
          onSelectionConfirmed="() => this.onLabelRangeConfirmed()"
        />
        <label class="o-checkbox">
          <input
            type="checkbox"
            name="aggregated"
            t-att-checked="props.definition.aggregated"
            t-on-change="onUpdateAggregated"
            class="align-middle"
          />
          Aggregate
        </label>
      </div>
      <div class="o-section o-use-row-as-headers" t-if="calculateHeaderPosition()">
        <label class="o-checkbox">
          <input
            type="checkbox"
            t-att-checked="props.definition.dataSetsHaveTitle"
            t-on-change="onUpdateDataSetsHaveTitle"
            class="align-middle"
          />
          <span>
            Use row
            <t t-esc="calculateHeaderPosition()"/>
            as headers
          </span>
        </label>
      </div>

      <div class="o-section" t-if="errorMessages.length">
        <ValidationMessages messages="errorMessages" msgType="'error'"/>
      </div>
    </div>
  </t>

  <t t-name="o-spreadsheet-LineBarPieDesignPanel">
    <t t-set="background_color">Background Color</t>
    <div>
      <div class="o-section o-chart-background-color">
        <div class="o-section-title">Background color</div>
        <div class="d-flex align-items-center">
          <span class="pe-1">Select a color...</span>
          <ColorPickerWidget
            currentColor="props.definition.background"
            toggleColorPicker="() => this.toggleColorPicker()"
            showColorPicker="state.fillColorTool"
            onColorPicked="(color) => this.updateBackgroundColor(color)"
            title="background_color"
            icon="'o-spreadsheet-Icon.FILL_COLOR'"
          />
        </div>
      </div>
      <div class="o-section o-chart-title">
        <div class="o-section-title">Title</div>
        <input
          type="text"
          t-model="state.title"
          t-on-change="updateTitle"
          class="o-input o-optional"
          placeholder="New Chart"
        />
      </div>
      <div class="o-section">
        <div class="o-section-title">Legend position</div>
        <select
          t-att-value="props.definition.legendPosition"
          class="o-input o-type-selector"
          t-on-change="(ev) => this.updateSelect('legendPosition', ev)">
          <option value="none">None</option>
          <option value="top">Top</option>
          <option value="bottom">Bottom</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
      </div>
    </div>
  </t>

  <t t-name="o-spreadsheet-LineConfigPanel">
    <div>
      <div class="o-section pt-0">
        <label class="o-checkbox">
          <input
            type="checkbox"
            name="stacked"
            t-att-checked="props.definition.stacked"
            t-on-change="onUpdateStacked"
            class="align-middle"
          />
          Stacked linechart
        </label>
        <label class="o-checkbox">
          <input
            type="checkbox"
            name="cumulative"
            t-att-checked="props.definition.cumulative"
            t-on-change="onUpdateCumulative"
            class="align-middle"
          />
          Cumulative data
        </label>
      </div>
      <div class="o-section o-data-series">
        <div class="o-section-title">Data Series</div>
        <SelectionInput
          ranges="() => this.getDataSeriesRanges()"
          required="true"
          onSelectionChanged="(ranges) => this.onDataSeriesRangesChanged(ranges)"
          onSelectionConfirmed="() => this.onDataSeriesConfirmed()"
        />
      </div>
      <div class="o-section o-data-labels">
        <div class="o-section-title">Categories / Labels</div>
        <SelectionInput
          ranges="() => [this.getLabelRange()]"
          isInvalid="isLabelInvalid"
          hasSingleRange="true"
          onSelectionChanged="(ranges) => this.onLabelRangeChanged(ranges)"
          onSelectionConfirmed="() => this.onLabelRangeConfirmed()"
        />
        <label class="o-checkbox">
          <input
            type="checkbox"
            name="aggregated"
            t-att-checked="props.definition.aggregated"
            t-on-change="onUpdateAggregated"
            class="align-middle"
          />
          Aggregate
        </label>
        <label t-if="canTreatLabelsAsText" class="o-checkbox">
          <input
            type="checkbox"
            name="labelsAsText"
            t-att-checked="props.definition.labelsAsText"
            t-on-change="onUpdateLabelsAsText"
          />
          Treat labels as text
        </label>
      </div>
      <div class="o-section o-use-row-as-headers" t-if="calculateHeaderPosition()">
        <label>
          <input
            type="checkbox"
            t-att-checked="props.definition.dataSetsHaveTitle"
            t-on-change="onUpdateDataSetsHaveTitle"
            class="align-middle"
          />
          <span>
            Use row
            <t t-esc="calculateHeaderPosition()"/>
            as headers
          </span>
        </label>
      </div>

      <div class="o-section" t-if="errorMessages.length">
        <ValidationMessages messages="errorMessages" msgType="'error'"/>
      </div>
    </div>
  </t>

  <t t-name="o-spreadsheet-LineChartDesignPanel">
    <t t-set="background_color">Background Color</t>
    <div>
      <div class="o-section o-chart-background-color">
        <div class="o-section-title">Background color</div>
        <div class="d-flex align-items-center">
          <span class="pe-1">Select a color...</span>
          <ColorPickerWidget
            currentColor="props.definition.background"
            toggleColorPicker="() => this.toggleColorPicker()"
            showColorPicker="state.fillColorTool"
            onColorPicked="(color) => this.updateBackgroundColor(color)"
            title="background_color"
            icon="'o-spreadsheet-Icon.FILL_COLOR'"
          />
        </div>
      </div>
      <div class="o-section o-chart-title">
        <div class="o-section-title">Title</div>
        <input
          type="text"
          t-model="state.title"
          t-on-change="updateTitle"
          class="o-input o-optional"
          placeholder="New Chart"
        />
      </div>
      <div class="o-section">
        <div class="o-section-title">Vertical axis position</div>
        <select
          t-att-value="props.definition.verticalAxisPosition"
          class="o-input o-type-selector"
          t-on-change="(ev) => this.updateSelect('verticalAxisPosition', ev)">
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
      </div>
      <div class="o-section">
        <div class="o-section-title">Legend position</div>
        <select
          t-att-value="props.definition.legendPosition"
          class="o-input o-type-selector"
          t-on-change="(ev) => this.updateSelect('legendPosition', ev)">
          <option value="none">None</option>
          <option value="top">Top</option>
          <option value="bottom">Bottom</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
      </div>
    </div>
  </t>

  <t t-name="o-spreadsheet-ChartPanel">
    <div class="o-chart">
      <div class="o-panel">
        <div
          class="o-panel-element o-panel-configuration"
          t-att-class="state.panel !== 'configuration' ? 'inactive' : ''"
          t-on-click="() => this.activatePanel('configuration')">
          <i class="fa fa-sliders"/>
          Configuration
        </div>
        <div
          class="o-panel-element o-panel-design"
          t-att-class="state.panel !== 'design' ? 'inactive' : ''"
          t-on-click="() => this.activatePanel('design')">
          <i class="fa fa-paint-brush"/>
          Design
        </div>
      </div>

      <t t-set="definition" t-value="getChartDefinition()"/>
      <t t-if="state.panel === 'configuration'">
        <div class="o-section">
          <div class="o-section-title">Chart type</div>
          <t t-set="types" t-value="chartTypes"/>
          <select
            class="o-input o-type-selector"
            t-on-change="(ev) => this.onTypeChange(ev.target.value)">
            <option
              t-foreach="chartTypes"
              t-as="type"
              t-key="type"
              t-att-value="type"
              t-esc="types[type]"
              t-att-selected="definition.type === type"
            />
          </select>
        </div>
        <t
          t-component="chartPanel.configuration"
          definition="definition"
          figureId="figureId"
          updateChart.bind="updateChart"
          canUpdateChart.bind="canUpdateChart"
          t-key="figureId + definition.type"
        />
      </t>
      <t t-else="">
        <t
          t-component="chartPanel.design"
          definition="definition"
          figureId="figureId"
          updateChart.bind="updateChart"
          canUpdateChart.bind="canUpdateChart"
          t-key="figureId + definition.type"
        />
      </t>
    </div>
  </t>

  <t t-name="o-spreadsheet-ScorecardChartConfigPanel">
    <div>
      <div class="o-section o-data-series">
        <div class="o-section-title">Key value</div>
        <SelectionInput
          ranges="() => [this.getKeyValueRange()]"
          isInvalid="isKeyValueInvalid"
          hasSingleRange="true"
          required="true"
          onSelectionChanged="(ranges) => this.onKeyValueRangeChanged(ranges)"
          onSelectionConfirmed="() => this.updateKeyValueRange()"
        />
      </div>
      <div class="o-section o-data-labels">
        <div class="o-section-title">Baseline configuration</div>
        <div class="o-section-subtitle">Baseline value</div>
        <SelectionInput
          ranges="() => [this.getBaselineRange()]"
          isInvalid="isBaselineInvalid"
          hasSingleRange="true"
          onSelectionChanged="(ranges) => this.onBaselineRangeChanged(ranges)"
          onSelectionConfirmed="() => this.updateBaselineRange()"
        />
        <div class="o-section-subtitle">Baseline format</div>
        <select
          t-att-value="props.definition.baselineMode"
          class="o-input o-type-selector o-optional"
          t-on-change="(ev) => this.updateBaselineMode(ev)">
          <option value="text">Absolute value</option>
          <option value="difference">Value change from key value</option>
          <option value="percentage">Percentage change from key value</option>
        </select>
      </div>

      <div class="o-section" t-if="errorMessages.length">
        <ValidationMessages messages="errorMessages" msgType="'error'"/>
      </div>
    </div>
  </t>

  <t t-name="o-spreadsheet-ScorecardChartDesignPanel">
    <t t-set="background_color">Background Color</t>
    <t t-set="color_up">Color Up</t>
    <t t-set="color_down">Color Down</t>
    <div>
      <div class="o-section o-chart-background-color">
        <div class="o-section-title">Background color</div>
        <div class="d-flex align-items-center">
          <span class="pe-1">Select a color...</span>
          <ColorPickerWidget
            currentColor="props.definition.background"
            toggleColorPicker="() => this.toggleColorPicker('backgroundColor')"
            showColorPicker="state.openedColorPicker === 'backgroundColor'"
            onColorPicked="(color) => this.setColor(color, 'backgroundColor')"
            title="background_color"
            icon="'o-spreadsheet-Icon.FILL_COLOR'"
          />
        </div>
      </div>

      <div class="o-section o-chart-title">
        <div class="o-section-title">Title</div>
        <input
          type="text"
          t-model="state.title"
          t-on-change="updateTitle"
          class="o-input o-optional"
          placeholder="New Chart"
        />
      </div>
      <div class="o-section">
        <div class="o-section-title">Baseline description</div>
        <input
          type="text"
          t-att-value="translate(props.definition.baselineDescr)"
          t-on-change="updateBaselineDescr"
          class="o-input o-optional"
        />
      </div>
    </div>
    <div class="o-section o-chart-baseline-color">
      <div class="o-section-title">Baseline color</div>
      <div class="d-flex align-items-center">
        <span class="pe-1">Color on value increase</span>
        <ColorPickerWidget
          currentColor="props.definition.baselineColorUp"
          toggleColorPicker="() => this.toggleColorPicker('baselineColorUp')"
          showColorPicker="state.openedColorPicker === 'baselineColorUp'"
          onColorPicked="(color) => this.setColor(color, 'baselineColorUp')"
          title="color_up"
          icon="'o-spreadsheet-Icon.FILL_COLOR'"
        />
      </div>
      <div class="d-flex align-items-center">
        <span class="pe-1">Color on value decrease</span>
        <ColorPickerWidget
          currentColor="props.definition.baselineColorDown"
          toggleColorPicker="() => this.toggleColorPicker('baselineColorDown')"
          showColorPicker="state.openedColorPicker === 'baselineColorDown'"
          onColorPicked="(color) => this.setColor(color, 'baselineColorDown')"
          title="color_down"
          icon="'o-spreadsheet-Icon.FILL_COLOR'"
        />
      </div>
    </div>
  </t>

  <t t-name="o-spreadsheet-CellIsRuleEditorPreview">
    <div
      class="o-cf-preview-line"
      t-attf-style="font-weight:{{currentStyle.bold ?'bold':'normal'}};
                       text-decoration:{{getTextDecoration(currentStyle)}};
                       font-style:{{currentStyle.italic?'italic':'normal'}};
                       color:{{currentStyle.textColor || '#000'}};
                       border-radius: 4px;
                       background-color:{{currentStyle.fillColor}};">
      <t t-if="previewText" t-esc="previewText"/>
      <t t-else="">Preview text</t>
    </div>
  </t>

  <t t-name="o-spreadsheet-CellIsRuleEditor">
    <t t-set="fill_color">Fill Color</t>
    <t t-set="text_color">Text Color</t>
    <div class="o-cf-cell-is-rule">
      <div class="o-section-subtitle">Format cells if...</div>
      <select t-model="rule.operator" class="o-input o-cell-is-operator">
        <t t-foreach="Object.keys(cellIsOperators)" t-as="op" t-key="op_index">
          <option t-att-value="op" t-esc="cellIsOperators[op]"/>
        </t>
      </select>
      <t t-if="rule.operator !== 'IsEmpty' and rule.operator !== 'IsNotEmpty'">
        <input
          type="text"
          placeholder="Value or formula"
          t-model="rule.values[0]"
          t-att-class="{ 'o-invalid': isValue1Invalid }"
          class="o-input o-cell-is-value o-required"
          t-on-keydown="(ev) => this.onKeydown(ev)"
        />
        <t t-if="rule.operator === 'Between' || rule.operator === 'NotBetween'">
          <input
            type="text"
            placeholder="and value or formula"
            t-model="rule.values[1]"
            t-att-class="{ 'o-invalid': isValue2Invalid }"
            class="o-input o-cell-is-value o-required"
            t-on-keydown="(ev) => this.onKeydown(ev)"
          />
        </t>
      </t>
      <div class="o-section-subtitle">Formatting style</div>

      <t t-call="o-spreadsheet-CellIsRuleEditorPreview">
        <t t-set="currentStyle" t-value="rule.style"/>
      </t>
      <div class="o-sidePanel-tools">
        <div
          class="o-tool"
          title="Bold"
          t-att-class="{active:rule.style.bold}"
          t-on-click="() => this.toggleStyle('bold')">
          <t t-call="o-spreadsheet-Icon.BOLD"/>
        </div>
        <div
          class="o-tool"
          title="Italic"
          t-att-class="{active:rule.style.italic}"
          t-on-click="() => this.toggleStyle('italic')">
          <t t-call="o-spreadsheet-Icon.ITALIC"/>
        </div>
        <div
          class="o-tool"
          title="Underline"
          t-att-class="{active:rule.style.underline}"
          t-on-click="(ev) => this.toggleStyle('underline', ev)">
          <t t-call="o-spreadsheet-Icon.UNDERLINE"/>
        </div>
        <div
          class="o-tool"
          title="Strikethrough"
          t-att-class="{active:rule.style.strikethrough}"
          t-on-click="(ev) => this.toggleStyle('strikethrough', ev)">
          <t t-call="o-spreadsheet-Icon.STRIKE"/>
        </div>
        <ColorPickerWidget
          currentColor="rule.style.textColor || '#000000'"
          toggleColorPicker="(ev) => this.toggleMenu('cellIsRule-textColor', ev)"
          showColorPicker="state.openedMenu === 'cellIsRule-textColor'"
          onColorPicked="(color) => this.setColor('textColor', color)"
          title="text_color"
          icon="'o-spreadsheet-Icon.TEXT_COLOR'"
          class="'o-tool'"
        />
        <div class="o-divider"/>
        <ColorPickerWidget
          currentColor="rule.style.fillColor"
          toggleColorPicker="(ev) => this.toggleMenu('cellIsRule-fillColor', ev)"
          showColorPicker="state.openedMenu === 'cellIsRule-fillColor'"
          onColorPicked="(color) => this.setColor('fillColor', color)"
          title="fill_color"
          icon="'o-spreadsheet-Icon.FILL_COLOR'"
          class="'o-tool'"
        />
      </div>
    </div>
  </t>

  <t t-name="o-spreadsheet-ConditionalFormattingEditor">
    <div class="o-cf-ruleEditor">
      <div class="o-section o-cf-range">
        <div class="o-section-title">Apply to range</div>
        <div class="o-selection-cf">
          <SelectionInput
            ranges="() => state.currentCF.ranges"
            class="'o-range'"
            isInvalid="isRangeValid"
            onSelectionChanged="(ranges) => this.onRangesChanged(ranges)"
            required="true"
          />
        </div>
        <div class="o-section-title">Format rules</div>
        <div class="o_field_radio o_horizontal o_field_widget o-cf-type-selector">
          <div
            class="custom-control form-check o_cf_radio_item"
            t-on-click="() => this.changeRuleType('CellIsRule')">
            <input
              class="form-check-input o_radio_input"
              t-att-checked="state.currentCFType === 'CellIsRule'"
              type="radio"
              id="cellIsRule"
              name="ruleType"
              value="CellIsRule"
            />
            <label for="cellIsRule" class="form-check-label o_form_label">Single color</label>
          </div>
          <div
            class="custom-control form-check o_cf_radio_item"
            t-on-click="() => this.changeRuleType('ColorScaleRule')">
            <input
              class="form-check-input o_radio_input"
              t-att-checked="state.currentCFType === 'ColorScaleRule'"
              type="radio"
              id="colorScaleRule"
              name="ruleType"
              value="ColorScaleRule"
            />
            <label for="colorScaleRule" class="form-check-label o_form_label">Color scale</label>
          </div>

          <div
            class="custom-control form-check o_cf_radio_item"
            t-on-click="() => this.changeRuleType('IconSetRule')">
            <input
              class="form-check-input o_radio_input"
              t-att-checked="state.currentCFType === 'IconSetRule'"
              type="radio"
              id="iconSetRule"
              name="ruleType"
              value="IconSetRule"
            />
            <label for="iconSetRule" class="form-check-label o_form_label">Icon set</label>
          </div>
        </div>
      </div>
      <div class="o-section o-cf-editor">
        <t t-if="state.currentCFType === 'CellIsRule'" t-call="o-spreadsheet-CellIsRuleEditor">
          <t t-set="rule" t-value="state.rules.cellIs"/>
        </t>
        <t
          t-if="state.currentCFType === 'ColorScaleRule'"
          t-call="o-spreadsheet-ColorScaleRuleEditor">
          <t t-set="rule" t-value="state.rules.colorScale"/>
        </t>
        <t t-if="state.currentCFType === 'IconSetRule'" t-call="o-spreadsheet-IconSetEditor">
          <t t-set="rule" t-value="state.rules.iconSet"/>
        </t>
        <div class="o-sidePanelButtons">
          <button t-on-click="props.onExitEdition" class="o-button o-cf-cancel">Cancel</button>
          <button t-on-click="saveConditionalFormat" class="o-button primary o-cf-save">
            Save
          </button>
        </div>
      </div>
      <div class="o-section">
        <div class="o-cf-error" t-foreach="state.errors || []" t-as="error" t-key="error_index">
          <t t-esc="errorMessage(error)"/>
        </div>
      </div>
    </div>
  </t>

  <t t-name="o-spreadsheet-ColorScaleRuleEditorPreview">
    <div class="o-cf-preview-gradient" t-attf-style="{{getPreviewGradient()}}">Preview text</div>
  </t>

  <t t-name="o-spreadsheet-ColorScaleRuleEditorThreshold">
    <t t-set="fill_color">Fill Color</t>
    <div t-attf-class="o-threshold o-threshold-{{thresholdType}}">
      <t t-if="thresholdType === 'midpoint'">
        <t t-set="type" t-value="threshold and threshold.type"/>
        <select
          class="o-input"
          name="valueType"
          t-on-change="onMidpointChange"
          t-on-click="closeMenus">
          <option value="none" t-att-selected="threshold === undefined">None</option>
          <option value="number" t-att-selected="type === 'number'">FixedNumber</option>
          <option value="percentage" t-att-selected="type === 'percentage'">Percentage</option>
          <option value="percentile" t-att-selected="type === 'percentile'">Percentile</option>
          <option value="formula" t-att-selected="type === 'formula'">Formula</option>
        </select>
      </t>
      <t t-else="">
        <select class="o-input" name="valueType" t-model="threshold.type" t-on-click="closeMenus">
          <option value="value">Cell values</option>
          <option value="number">Number</option>
          <option value="percentage">Percentage</option>
          <option value="percentile">Percentile</option>
          <option value="formula">Formula</option>
        </select>
      </t>
      <input
        type="text"
        class="o-input o-threshold-value o-required"
        t-model="rule[thresholdType].value"
        t-att-class="{ 'o-invalid': isValueInvalid(thresholdType) }"
        t-if="threshold !== undefined and threshold.type !== 'value'"
      />
      <input type="text" class="o-input o-threshold-value" t-else="" disabled="1"/>
      <ColorPickerWidget
        currentColor="getThresholdColor(threshold)"
        toggleColorPicker="(ev) => this.toggleMenu('colorScale-'+thresholdType+'Color', ev)"
        showColorPicker="state.openedMenu === 'colorScale-'+thresholdType+'Color'"
        onColorPicked="(color) => this.setColorScaleColor(thresholdType, color)"
        title="fill_color"
        icon="'o-spreadsheet-Icon.FILL_COLOR'"
        disabled="threshold === undefined"
      />
    </div>
  </t>

  <t t-name="o-spreadsheet-ColorScaleRuleEditor">
    <div class="o-cf-color-scale-editor">
      <div class="o-section-subtitle">Preview</div>
      <t t-call="o-spreadsheet-ColorScaleRuleEditorPreview"/>
      <div class="o-section-subtitle">Minpoint</div>
      <t t-call="o-spreadsheet-ColorScaleRuleEditorThreshold">
        <t t-set="threshold" t-value="rule.minimum"/>
        <t t-set="thresholdType" t-value="'minimum'"/>
      </t>
      <div class="o-section-subtitle">MidPoint</div>
      <t t-call="o-spreadsheet-ColorScaleRuleEditorThreshold">
        <t t-set="threshold" t-value="rule.midpoint"/>
        <t t-set="thresholdType" t-value="'midpoint'"/>
      </t>
      <div class="o-section-subtitle">MaxPoint</div>
      <t t-call="o-spreadsheet-ColorScaleRuleEditorThreshold">
        <t t-set="threshold" t-value="rule.maximum"/>
        <t t-set="thresholdType" t-value="'maximum'"/>
      </t>
    </div>
  </t>

  <t t-name="o-spreadsheet-IconSets">
    <div>
      <div class="o-section-subtitle">Icons</div>
      <div class="o-cf-iconsets">
        <div
          class="o-cf-iconset"
          t-foreach="['arrows', 'smiley', 'dots']"
          t-as="iconSet"
          t-key="iconSet"
          t-on-click="(ev) => this.setIconSet(iconSet, ev)">
          <div class="o-cf-icon">
            <t t-call="o-spreadsheet-Icon.{{icons[iconSets[iconSet].good].template}}"/>
          </div>
          <div class="o-cf-icon">
            <t t-call="o-spreadsheet-Icon.{{icons[iconSets[iconSet].neutral].template}}"/>
          </div>
          <div class="o-cf-icon">
            <t t-call="o-spreadsheet-Icon.{{icons[iconSets[iconSet].bad].template}}"/>
          </div>
        </div>
      </div>
    </div>
  </t>

  <t t-name="o-spreadsheet-IconSetInflexionPointRow">
    <tr>
      <td>
        <div t-on-click.stop="(ev) => this.toggleMenu('iconSet-'+icon+'Icon', ev)">
          <div class="o-cf-icon-button">
            <t t-call="o-spreadsheet-Icon.{{icons[iconValue].template}}"/>
          </div>
        </div>
        <IconPicker
          t-if="state.openedMenu === 'iconSet-'+icon+'Icon'"
          onIconPicked="(i) => this.setIcon(icon, i)"
        />
      </td>
      <td>When value is</td>
      <td>
        <select class="o-input" name="valueType" t-model="inflectionPointValue.operator">
          <option value="gt">
            <span>&#62;</span>
          </option>
          <option value="ge">
            <span>&#8805;</span>
          </option>
        </select>
      </td>
      <td>
        <input
          type="text"
          class="o-input"
          t-att-class="{ 'o-invalid': isInflectionPointInvalid(inflectionPoint) }"
          t-model="rule[inflectionPoint].value"
        />
      </td>
      <td>
        <select class="o-input" name="valueType" t-model="inflectionPointValue.type">
          <option value="number">Number</option>
          <option value="percentage">Percentage</option>
          <option value="percentile">Percentile</option>
          <option value="formula">Formula</option>
        </select>
      </td>
    </tr>
  </t>

  <t t-name="o-spreadsheet-IconSetInflexionPoints">
    <div class="o-inflection">
      <table>
        <tr>
          <th class="o-cf-iconset-icons"/>
          <th class="o-cf-iconset-text"/>
          <th class="o-cf-iconset-operator"/>
          <th class="o-cf-iconset-value">Value</th>
          <th class="o-cf-iconset-type">Type</th>
        </tr>
        <t t-call="o-spreadsheet-IconSetInflexionPointRow">
          <t t-set="iconValue" t-value="rule.icons.upper"/>
          <t t-set="icon" t-value="'upper'"/>
          <t t-set="inflectionPointValue" t-value="rule.upperInflectionPoint"/>
          <t t-set="inflectionPoint" t-value="'upperInflectionPoint'"/>
        </t>
        <t t-call="o-spreadsheet-IconSetInflexionPointRow">
          <t t-set="iconValue" t-value="rule.icons.middle"/>
          <t t-set="icon" t-value="'middle'"/>
          <t t-set="inflectionPointValue" t-value="rule.lowerInflectionPoint"/>
          <t t-set="inflectionPoint" t-value="'lowerInflectionPoint'"/>
        </t>
        <tr>
          <td>
            <div t-on-click.stop="(ev) => this.toggleMenu('iconSet-lowerIcon', ev)">
              <div class="o-cf-icon-button">
                <t t-call="o-spreadsheet-Icon.{{icons[rule.icons.lower].template}}"/>
              </div>
            </div>
            <IconPicker
              t-if="state.openedMenu === 'iconSet-lowerIcon'"
              onIconPicked="(icon) => this.setIcon('lower', icon)"
            />
          </td>
          <td>Else</td>
          <td/>
          <td/>
          <td/>
        </tr>
      </table>
    </div>
  </t>
  <t t-name="o-spreadsheet-IconSetEditor">
    <div class="o-cf-iconset-rule">
      <t t-call="o-spreadsheet-IconSets"/>
      <t t-call="o-spreadsheet-IconSetInflexionPoints"/>
      <div class="btn btn-link o_refresh_measures o-cf-iconset-reverse" t-on-click="reverseIcons">
        <div class="me-1 d-inline-block">
          <t t-call="o-spreadsheet-Icon.REFRESH"/>
        </div>
        Reverse icons
      </div>
    </div>
  </t>

  <t t-name="o-spreadsheet-ConditionalFormatPreviewList">
    <div class="o-cf-preview-list h-100 overflow-auto" t-ref="cfList">
      <t t-foreach="props.conditionalFormats" t-as="cf" t-key="cf.id">
        <t t-call="o-spreadsheet-ConditionalFormattingPanelPreview"/>
      </t>
      <div
        class="btn btn-link o-sidePanel-btn-link o-cf-add float-end"
        t-on-click.prevent.stop="props.onAddConditionalFormat">
        + Add another rule
      </div>
    </div>
  </t>

  <t t-name="o-spreadsheet-ConditionalFormattingPanelPreview">
    <div
      class="o-cf-preview d-flex position-relative"
      t-att-class="{ 'o-cf-dragging': dragAndDrop.draggedItemId === cf.id }"
      t-att-style="getPreviewDivStyle(cf)"
      t-att-data-id="cf.id"
      t-on-click="(ev) => props.onPreviewClick(cf)"
      t-on-mousedown="(ev) => this.onMouseDown(cf, ev)">
      <div class="position-relative h-100 w-100 d-flex align-items-center">
        <div class="o-cf-drag-handle h-100 position-absolute d-flex align-items-center text-muted">
          <t t-call="o-spreadsheet-Icon.THIN_DRAG_HANDLE"/>
        </div>
        <t t-if="cf.rule.type==='IconSetRule'">
          <div class="o-cf-preview-icon d-flex justify-content-around align-items-center me-2">
            <t t-call="o-spreadsheet-Icon.{{icons[cf.rule.icons.upper].template}}"/>
            <t t-call="o-spreadsheet-Icon.{{icons[cf.rule.icons.middle].template}}"/>
            <t t-call="o-spreadsheet-Icon.{{icons[cf.rule.icons.lower].template}}"/>
          </div>
        </t>
        <t t-else="">
          <div
            t-att-style="getPreviewImageStyle(cf.rule)"
            class="o-cf-preview-icon d-flex justify-content-around align-items-center me-2">
            123
          </div>
        </t>
        <div class="o-cf-preview-description">
          <div class="o-cf-preview-ruletype">
            <div class="o-cf-preview-description-rule text-truncate">
              <t t-esc="getDescription(cf)"/>
            </div>
          </div>
          <div class="o-cf-preview-range text-truncate" t-esc="cf.ranges"/>
        </div>
        <div class="o-cf-delete">
          <div
            class="o-cf-delete-button text-muted"
            t-on-click.stop="(ev) => this.deleteConditionalFormat(cf, ev)"
            title="Remove rule">
            <t t-call="o-spreadsheet-Icon.TRASH"/>
          </div>
        </div>
      </div>
    </div>
  </t>

  <t t-name="o-spreadsheet-ConditionalFormattingPanel">
    <div class="o-cf h-100">
      <t t-if="state.mode === 'list'">
        <ConditionalFormatPreviewList
          conditionalFormats="conditionalFormats"
          onPreviewClick.bind="editConditionalFormat"
          onAddConditionalFormat.bind="addConditionalFormat"
        />
      </t>
      <t t-if="state.mode === 'edit'">
        <ConditionalFormattingEditor editedCf="state.editedCf" onExitEdition.bind="switchToList"/>
      </t>
    </div>
  </t>

  <t t-name="o-spreadsheet-CustomCurrencyPanel">
    <div class="o-custom-currency">
      <div class="o-section" t-if="availableCurrencies.length > 1">
        <div class="o-section-title">Currency</div>
        <select
          class="o-input o-available-currencies"
          t-on-change="(ev) => this.updateSelectCurrency(ev)">
          <t t-foreach="availableCurrencies" t-as="currency" t-key="currency_index">
            <option
              t-att-value="currency_index"
              t-esc="currencyDisplayName(currency)"
              t-att-selected="currency_index === state.selectedCurrencyIndex"
            />
          </t>
        </select>
      </div>
      <div class="o-section">
        <div class="o-subsection-left">
          <div class="o-section-title">Code</div>
          <input
            type="text"
            class="o-input"
            t-model="state.currencyCode"
            t-on-input="(ev) => this.updateCode(ev)"
          />
        </div>
        <div class="o-subsection-right">
          <div class="o-section-title">Symbol</div>
          <input
            type="text"
            class="o-input"
            t-model="state.currencySymbol"
            t-on-input="(ev) => this.updateSymbol(ev)"
          />
        </div>
      </div>
      <div class="o-section">
        <div class="o-section-title">Format</div>
        <select
          class="o-input o-format-proposals"
          t-on-change="(ev) => this.updateSelectFormat(ev)"
          t-att-disabled="!formatProposals.length">
          <t t-foreach="formatProposals" t-as="proposal" t-key="proposal_index">
            <option
              t-att-value="proposal_index"
              t-esc="proposal.example"
              t-att-selected="proposal_index === state.selectedFormatIndex"
            />
          </t>
        </select>
      </div>
      <div class="o-sidePanelButtons">
        <button
          class="o-button"
          t-on-click="() => this.apply()"
          t-att-disabled="!formatProposals.length || isSameFormat">
          Apply
        </button>
      </div>
    </div>
  </t>

  <t t-name="o-spreadsheet-DataValidationPanel">
    <div class="o-data-validation">
      <t t-if="state.mode === 'list'">
        <div class="o-dv-preview-list">
          <t t-foreach="validationRules" t-as="rule" t-key="rule.id">
            <DataValidationPreview
              rule="localizeDVRule(rule)"
              onClick="() => this.onPreviewClick(rule.id)"
            />
          </t>
        </div>
        <div
          class="o-dv-add btn btn-link o-sidePanel-btn-link float-end"
          t-on-click="addDataValidationRule">
          + Add another rule
        </div>
      </t>
      <t t-else="">
        <DataValidationEditor rule="localizeDVRule(state.activeRule)" onExit.bind="onExitEditMode"/>
      </t>
    </div>
  </t>

  <t t-name="o-spreadsheet-DataValidationDateCriterion">
    <select class="o-dv-date-value o-input mb-4" t-on-change="onDateValueChanged">
      <option
        t-foreach="dateValues"
        t-as="dateValue"
        t-key="dateValue.value"
        t-att-value="dateValue.value"
        t-esc="dateValue.title"
        t-att-selected="dateValue.value === props.criterion.dateValue"
      />
    </select>

    <DataValidationInput
      t-if="props.criterion.dateValue === 'exactDate'"
      value="props.criterion.values[0]"
      onValueChanged.bind="onValueChanged"
      criterionType="props.criterion.type"
    />
  </t>

  <t t-name="o-spreadsheet-DataValidationDoubleInput">
    <DataValidationInput
      value="props.criterion.values[0]"
      onValueChanged.bind="onFirstValueChanged"
      criterionType="props.criterion.type"
    />

    <div class="o-section-subtitle ms-1 my-2">and</div>
    <DataValidationInput
      value="props.criterion.values[1]"
      onValueChanged.bind="onSecondValueChanged"
      criterionType="props.criterion.type"
    />
  </t>

  <t t-name="o-spreadsheet-DataValidationInput">
    <div class="o-dv-input position-relative w-100">
      <input
        type="text"
        t-ref="input"
        t-on-input="onValueChanged"
        t-att-value="props.value"
        class="o-input"
        t-att-class="{
            'o-invalid border-danger position-relative': errorMessage,
          }"
        t-att-title="errorMessage"
        t-att-placeholder="placeholder"
        t-on-keydown="props.onKeyDown"
        t-on-blur="props.onBlur"
      />
      <span
        t-if="errorMessage"
        class="error-icon text-danger position-absolute d-flex align-items-center"
        t-att-title="errorMessage">
        <t t-call="o-spreadsheet-Icon.ERROR"/>
      </span>
    </div>
  </t>

  <t t-name="o-spreadsheet-DataValidationSingleInput">
    <DataValidationInput
      value="props.criterion.values[0]"
      onValueChanged.bind="onValueChanged"
      criterionType="props.criterion.type"
    />
  </t>

  <t t-name="o-spreadsheet-DataValidationListCriterionForm">
    <t t-foreach="displayedValues" t-as="value" t-key="value_index">
      <div class="o-dv-list-values d-flex align-items-center">
        <DataValidationInput
          value="props.criterion.values[value_index]"
          onValueChanged="(v) => this.onValueChanged(v, value_index)"
          criterionType="props.criterion.type"
          onKeyDown="(ev) => this.onKeyDown(ev, value_index)"
          focused="value_index === state.focusedValueIndex"
          onBlur.bind="onBlurInput"
        />
        <div
          class="o-dv-list-item-delete ms-2 me-1"
          t-on-click="() => this.removeItem(value_index)">
          <t t-call="o-spreadsheet-Icon.TRASH"/>
        </div>
      </div>
      <div class="mb-2"/>
    </t>
    <button class="o-dv-list-add-value o-button mb-3" t-on-click="onAddAnotherValue">
      Add another item
    </button>

    <div class="o-section-subtitle">Display style</div>
    <select class="o-dv-display-style o-input" t-on-change="onChangedDisplayStyle">
      <option t-att-selected="props.criterion.displayStyle === 'arrow'" value="arrow">Arrow</option>
      <option t-att-selected="props.criterion.displayStyle === 'plainText'" value="plainText">
        Plain text
      </option>
    </select>
  </t>

  <t t-name="o-spreadsheet-DataValidationValueInRangeCriterionForm">
    <SelectionInput
      ranges="() => [props.criterion.values[0] || '']"
      onSelectionChanged="(ranges) => this.onRangeChanged(ranges[0])"
      required="true"
      hasSingleRange="true"
    />

    <div class="o-section-subtitle">Display style</div>
    <select class="o-dv-display-style o-input" t-on-change="onChangedDisplayStyle">
      <option t-att-selected="props.criterion.displayStyle === 'arrow'" value="arrow">Arrow</option>
      <option t-att-selected="props.criterion.displayStyle === 'plainText'" value="plainText">
        Plain text
      </option>
    </select>
  </t>

  <t t-name="o-spreadsheet-DataValidationEditor">
    <div class="o-dv-form w-100 h-100">
      <div class="o-section o-dv-range">
        <div class="o-section-title">Apply to range</div>
        <SelectionInput
          ranges="() => state.rule.ranges"
          onSelectionChanged="(ranges) => this.onRangesChanged(ranges)"
          required="true"
        />

        <div class="o-subsection o-dv-settings">
          <div class="o-section-title">Criteria</div>
          <SelectMenu
            class="'o-dv-type o-input mb-4'"
            menuItems="dvCriterionMenuItems"
            selectedValue="selectedCriterionName"
          />

          <t
            t-if="criterionComponent"
            t-component="criterionComponent"
            t-key="state.rule.criterion.type"
            criterion="state.rule.criterion"
            onCriterionChanged.bind="onCriterionChanged"
          />
        </div>
      </div>

      <div class="o-section o-dv-invalid-option">
        <div class="o-section-title">If the data is invalid</div>
        <select class="o-dv-reject-input o-input" t-on-change="changeRuleIsBlocking">
          <option t-att-selected="!state.rule.isBlocking" value="false">Show a warning</option>
          <option t-att-selected="state.rule.isBlocking" value="true">Reject the input</option>
        </select>
      </div>

      <div class="o-sidePanelButtons">
        <button t-on-click="props.onExit" class="o-dv-cancel o-button">Cancel</button>
        <button
          t-on-click="onSave"
          class="o-dv-save o-button primary"
          t-att-class="{'o-disabled': !canSave }">
          Save
        </button>
      </div>
    </div>
  </t>

  <t t-name="o-spreadsheet-DataValidationPreview">
    <div class="o-dv-preview p-3" t-on-click="props.onClick">
      <div class="d-flex justify-content-between">
        <div class="o-dv-container d-flex flex-column">
          <div class="o-dv-preview-description fw-bold text-truncate" t-esc="descriptionString"/>
          <div class="o-dv-preview-ranges text-truncate" t-esc="rangesString"/>
        </div>
        <div
          class="o-dv-preview-delete d-flex align-items-center text-muted px-3"
          t-on-click.stop="deleteDataValidation">
          <t t-call="o-spreadsheet-Icon.TRASH"/>
        </div>
      </div>
    </div>
  </t>

  <t t-name="o-spreadsheet-FindAndReplacePanel">
    <div class="o-find-and-replace">
      <div class="o-section">
        <div class="o-section-title">Search</div>
        <div class="o-input-search-container">
          <input
            type="text"
            t-ref="searchInput"
            class="o-input o-input-with-count"
            t-on-input="onInput"
            t-on-keydown="onKeydownSearch"
          />
          <div class="o-input-count" t-if="hasSearchResult">
            <t t-esc="env.model.getters.getCurrentSelectedMatchIndex()+1"/>
            /
            <t t-esc="env.model.getters.getSearchMatches().length"/>
          </div>
          <div t-elif="!pendingSearch and state.toSearch !== ''" class="o-input-count">0 / 0</div>
        </div>
        <div>
          <!-- TODO: go through this css, the group misses a padding and could profit from BootStrap -->
          <label class="o-checkbox mt-1">
            <input
              t-model="state.searchOptions.matchCase"
              t-on-change="updateSearch"
              type="checkbox"
            />
            <span>Match case</span>
          </label>
          <label class="o-checkbox">
            <input
              t-model="state.searchOptions.exactMatch"
              t-on-change="updateSearch"
              type="checkbox"
            />
            <span>Match entire cell content</span>
          </label>
          <label class="o-checkbox">
            <input
              t-model="state.searchOptions.searchFormulas"
              t-on-change="searchFormulas"
              type="checkbox"
            />
            <span>Search in formulas</span>
          </label>
        </div>
      </div>
      <div class="o-sidePanelButtons">
        <button
          t-att-disabled="!hasSearchResult"
          t-on-click="onSelectPreviousCell"
          class="o-button">
          Previous
        </button>
        <button t-att-disabled="!hasSearchResult" t-on-click="onSelectNextCell" class="o-button">
          Next
        </button>
      </div>
      <div class="o-section" t-if="!env.model.getters.isReadonly()">
        <div class="o-section-title">Replace</div>
        <div class="o-input-search-container">
          <input
            type="text"
            class="o-input o-input-without-count"
            t-model="state.replaceWith"
            t-on-keydown="onKeydownReplace"
          />
        </div>
      </div>

      <div class="o-sidePanelButtons" t-if="!env.model.getters.isReadonly()">
        <button
          t-att-disabled="env.model.getters.getCurrentSelectedMatchIndex() === null"
          t-on-click="replace"
          class="o-button">
          Replace
        </button>
        <button
          t-att-disabled="env.model.getters.getCurrentSelectedMatchIndex() === null"
          t-on-click="replaceAll"
          class="o-button">
          Replace all
        </button>
      </div>
    </div>
  </t>

  <t t-name="o-spreadsheet-MoreFormatsPanel">
    <div class="o-more-formats-panel">
      <div
        t-foreach="dateFormatsActions"
        t-as="action"
        t-key="action.name(env)"
        t-att-data-name="action.name(env)"
        t-on-click="() => action.execute(env)"
        class="w-100 d-flex align-items-center border-bottom format-preview">
        <span class="ms-3 check-icon">
          <t t-if="action.isActive(env)" t-call="o-spreadsheet-Icon.CHECK"/>
        </span>
        <span t-out="action.description(env)"/>
      </div>
    </div>
  </t>

  <t t-name="o-spreadsheet-RemoveDuplicatesPanel">
    <div class="o-remove-duplicates">
      <div class="o-section">
        <div class="o-section-subtitle" t-esc="selectionStatisticalInformation"/>
        <label class="o-checkbox">
          <input type="checkbox" t-att-checked="state.hasHeader" t-on-change="toggleHasHeader"/>
          Data has header row
        </label>
      </div>

      <div class="o-section">
        <div class="o-section-title">Columns to analyze</div>
        <div class="o-checkbox-selection overflow-auto p-3 vh-50 border rounded">
          <label class="o-checkbox">
            <input
              t-att-checked="isEveryColumnSelected"
              t-on-change="toggleAllColumns"
              type="checkbox"
            />
            Select all
          </label>

          <t t-foreach="Object.keys(state.columns)" t-as="colIndex" t-key="colIndex">
            <label class="o-checkbox">
              <input
                type="checkbox"
                t-att-checked="state.columns[colIndex]"
                t-on-change="() => this.toggleColumn(colIndex)"
              />
              <t t-esc="getColLabel(colIndex)"/>
            </label>
          </t>
        </div>
      </div>

      <div class="o-sidePanelButtons">
        <button
          class="o-button"
          t-att-class="{'o-disabled': !canConfirm}"
          t-on-click="onRemoveDuplicates">
          Remove duplicates
        </button>
      </div>

      <div class="o-section" t-if="errorMessages.length">
        <ValidationMessages messages="errorMessages" msgType="'error'"/>
      </div>
    </div>
  </t>

  <t t-name="o-spreadsheet-SelectMenu">
    <select
      t-att-class="props.class"
      t-ref="select"
      t-on-mousedown.stop.prevent=""
      t-on-click="onClick">
      <option selected="true" t-esc="props.selectedValue"/>
    </select>
    <Menu
      t-if="state.isMenuOpen"
      menuItems="props.menuItems"
      position="menuPosition"
      onClose.bind="onMenuClosed"
    />
  </t>

  <t t-name="o-spreadsheet-SettingsPanel">
    <div class="o-settings-panel">
      <div class="o-section">
        <div class="o-section-title">Locale</div>
        <select
          class="o-input o-type-selector"
          t-on-change="(ev) => this.onLocaleChange(ev.target.value)">
          <option
            t-foreach="supportedLocales"
            t-as="locale"
            t-key="locale.code"
            t-att-value="locale.code"
            t-esc="locale.name"
            t-att-selected="currentLocale.code === locale.code"
          />
        </select>
        <div class="o-locale-preview mt-2 ms-3">
          <div>
            <span class="fw-bold me-1">Number:</span>
            <span t-esc="numberFormatPreview"/>
          </div>
          <div>
            <span class="fw-bold me-1">Date:</span>
            <span t-esc="dateFormatPreview"/>
          </div>
          <div>
            <span class="fw-bold me-1">Date time:</span>
            <span t-esc="dateTimeFormatPreview"/>
          </div>
        </div>
      </div>
    </div>
  </t>

  <t t-name="o-spreadsheet-SidePanel">
    <div class="o-sidePanel">
      <div class="o-sidePanelHeader">
        <div class="o-sidePanelTitle" t-esc="getTitle()"/>
        <div class="o-sidePanelClose" t-on-click="() => this.props.onCloseSidePanel()">✕</div>
      </div>
      <div class="o-sidePanelBody">
        <t
          t-component="state.panel.Body"
          t-props="props.panelProps"
          onCloseSidePanel="props.onCloseSidePanel"
          t-key="'Body_' + props.component"
        />
      </div>
      <div class="o-sidePanelFooter" t-if="state.panel.Footer">
        <t
          t-component="state.panel.Footer"
          t-props="props.panelProps"
          t-key="'Footer_' + props.component"
        />
      </div>
    </div>
  </t>

  <t t-name="o-spreadsheet-SplitIntoColumnsPanel">
    <div class="o-split-to-cols-panel">
      <div class="o-section">
        <div class="o-section-title">Separator</div>
        <select
          class="o-input o-type-selector"
          t-on-change="(ev) => this.onSeparatorChange(ev.target.value)">
          <option
            t-foreach="separators"
            t-as="separator"
            t-key="separator.value"
            t-att-value="separator.value"
            t-esc="separator.name"
            t-att-selected="state.separatorValue === separator.value"
          />
        </select>

        <input
          class="o-input o-required mt-3"
          type="text"
          t-if="state.separatorValue === 'custom'"
          t-att-value="state.customSeparator"
          t-on-input="updateCustomSeparator"
          placeholder="Add any characters or symbol"
        />

        <label class="o-checkbox">
          <input
            type="checkbox"
            name="add columns"
            t-att-checked="state.addNewColumns"
            t-on-change="updateAddNewColumnsCheckbox"
          />
          Add new columns to avoid overwriting cells
        </label>

        <div class="o-sidePanelButtons">
          <button
            class="o-button"
            t-att-class="{'o-disabled': isConfirmDisabled}"
            t-on-click="confirm">
            Confirm
          </button>
        </div>

        <ValidationMessages messages="errorMessages" msgType="'error'"/>
        <ValidationMessages messages="warningMessages" msgType="'warning'"/>
      </div>
    </div>
  </t>

  <t t-name="o-spreadsheet-Spreadsheet">
    <div
      class="o-spreadsheet"
      t-on-keydown="(ev) => !env.isDashboard() and this.onKeydown(ev)"
      t-att-style="getStyle()">
      <t t-if="env.isDashboard()">
        <SpreadsheetDashboard/>
      </t>
      <t t-else="">
        <TopBar
          onClick="() => this.focusGrid()"
          onComposerContentFocused="(selection) => this.onTopBarComposerFocused(selection)"
          focusComposer="focusTopBarComposer"
          dropdownMaxHeight="gridHeight"
        />
        <div
          class="o-grid-container"
          t-att-class="{'o-two-columns': !sidePanel.isOpen}"
          t-att-style="gridContainerStyle"
          t-on-click="this.focusGrid">
          <div class="o-top-left"/>
          <div class="o-column-groups">
            <HeaderGroupContainer layers="colLayers" dimension="'COL'"/>
          </div>
          <div class="o-row-groups">
            <HeaderGroupContainer layers="rowLayers" dimension="'ROW'"/>
          </div>
          <div class="o-group-grid overflow-hidden">
            <Grid
              sidePanelIsOpen="sidePanel.isOpen"
              focusComposer="focusGridComposer"
              exposeFocus="(focus) => this._focusGrid = focus"
              onComposerContentFocused="() => this.onGridComposerContentFocused()"
              onGridComposerCellFocused="(content, selection) => this.onGridComposerCellFocused(content, selection)"
            />
          </div>
        </div>
        <SidePanel
          t-if="sidePanel.isOpen"
          onCloseSidePanel="() => this.closeSidePanel()"
          component="sidePanel.component"
          panelProps="sidePanel.panelProps"
        />
        <BottomBar onClick="() => this.focusGrid()"/>
      </t>
    </div>
  </t>

  <t t-name="o-spreadsheet-TopBar">
    <t t-set="text_color">Text Color</t>
    <t t-set="fill_color">Fill Color</t>
    <div
      class="o-spreadsheet-topbar o-two-columns d-flex flex-column user-select-none"
      t-on-click="props.onClick">
      <div class="o-topbar-top d-flex justify-content-between">
        <!-- Menus -->
        <div class="o-topbar-topleft d-flex">
          <t t-foreach="menus" t-as="menu" t-key="menu_index">
            <div
              t-if="menu.children.length !== 0"
              class="o-topbar-menu o-hoverable-button rounded"
              t-att-class="{'active': state.menuState.parentMenu and state.menuState.parentMenu.id === menu.id}"
              t-on-click="(ev) => this.toggleContextMenu(menu, ev)"
              t-on-mouseover="(ev) => this.onMenuMouseOver(menu, ev)"
              t-att-data-id="menu.id">
              <t t-esc="getMenuName(menu)"/>
            </div>
          </t>
        </div>
        <div class="o-topbar-topright d-flex justify-content-end">
          <div t-foreach="topbarComponents" t-as="comp" t-key="comp.id">
            <t t-component="comp.component"/>
          </div>
        </div>
      </div>
      <!-- Toolbar and Cell Content -->
      <div class="d-flex">
        <div class="o-topbar-toolbar d-flex flex-shrink-0">
          <!-- Toolbar -->
          <div
            t-if="env.model.getters.isReadonly()"
            class="o-readonly-toolbar d-flex align-items-center text-muted">
            <span>
              <i class="fa fa-eye"/>
              Readonly Access
            </span>
          </div>
          <div t-else="" class="o-toolbar-tools d-flex flex-shrink-0 ms-4">
            <ActionButton action="EDIT.undo" class="'o-hoverable-button'"/>
            <ActionButton action="EDIT.redo" class="'o-hoverable-button'"/>
            <PaintFormatButton class="'o-hoverable-button'"/>
            <ActionButton action="FORMAT.clearFormat" class="'o-hoverable-button'"/>

            <div class="o-divider"/>

            <ActionButton action="FORMAT.formatPercent" class="'o-hoverable-button'"/>
            <ActionButton action="FORMAT.decraseDecimalPlaces" class="'o-hoverable-button'"/>
            <ActionButton action="FORMAT.incraseDecimalPlaces" class="'o-hoverable-button'"/>
            <ActionButton
              action="formatNumberMenuItemSpec"
              onClick="(ev) => this.toggleToolbarContextMenu(formatNumberMenuItemSpec, ev)"
              hasTriangleDownIcon="true"
              class="'o-hoverable-button'"
            />

            <div class="o-divider"/>
            <FontSizeEditor
              class="'o-hoverable-button'"
              onToggle.bind="this.onClick"
              dropdownStyle="this.dropdownStyle"
            />
            <div class="o-divider"/>

            <ActionButton action="FORMAT.formatBold" class="'o-hoverable-button'"/>
            <ActionButton action="FORMAT.formatItalic" class="'o-hoverable-button'"/>
            <ActionButton action="FORMAT.formatStrikethrough" class="'o-hoverable-button'"/>

            <ColorPickerWidget
              currentColor="state.textColor"
              toggleColorPicker="(ev) => this.toggleDropdownTool('textColorTool', ev)"
              showColorPicker="state.activeTool === 'textColorTool'"
              onColorPicked="(color) => this.setColor('textColor', color)"
              title="text_color"
              icon="'o-spreadsheet-Icon.TEXT_COLOR'"
              dropdownMaxHeight="this.props.dropdownMaxHeight"
              class="'o-hoverable-button o-menu-item-button'"
            />

            <div class="o-divider"/>

            <ColorPickerWidget
              currentColor="state.fillColor"
              toggleColorPicker="(ev) => this.toggleDropdownTool('fillColorTool', ev)"
              showColorPicker="state.activeTool === 'fillColorTool'"
              onColorPicked="(color) => this.setColor('fillColor', color)"
              title="fill_color"
              icon="'o-spreadsheet-Icon.FILL_COLOR'"
              dropdownMaxHeight="this.props.dropdownMaxHeight"
              class="'o-hoverable-button o-menu-item-button'"
            />

            <BorderEditorWidget
              class="'o-hoverable-button o-menu-item-button'"
              toggleBorderEditor="(ev) => this.toggleDropdownTool('borderTool', ev)"
              showBorderEditor="state.activeTool === 'borderTool'"
              dropdownMaxHeight="this.props.dropdownMaxHeight"
            />
            <ActionButton action="EDIT.mergeCells" class="'o-hoverable-button'"/>
            <div class="o-divider"/>

            <div class="o-dropdown">
              <ActionButton
                action="FORMAT.formatAlignmentHorizontal"
                hasTriangleDownIcon="true"
                t-on-click="(ev) => this.toggleDropdownTool('horizontalAlignTool', ev)"
                class="'o-hoverable-button'"
              />
              <div
                class="o-dropdown-content"
                t-if="state.activeTool === 'horizontalAlignTool'"
                t-att-style="dropdownStyle"
                t-on-click.stop="">
                <div class="o-dropdown-line">
                  <ActionButton action="FORMAT.formatAlignmentLeft" class="'o-hoverable-button'"/>
                  <ActionButton action="FORMAT.formatAlignmentCenter" class="'o-hoverable-button'"/>
                  <ActionButton action="FORMAT.formatAlignmentRight" class="'o-hoverable-button'"/>
                </div>
              </div>
            </div>
            <div class="o-dropdown">
              <ActionButton
                action="FORMAT.formatAlignmentVertical"
                hasTriangleDownIcon="true"
                t-on-click="(ev) => this.toggleDropdownTool('verticalAlignTool', ev)"
                class="'o-hoverable-button'"
              />
              <div
                class="o-dropdown-content"
                t-att-style="dropdownStyle"
                t-if="state.activeTool === 'verticalAlignTool'"
                t-on-click.stop="">
                <div class="o-dropdown-line">
                  <ActionButton action="FORMAT.formatAlignmentTop" class="'o-hoverable-button'"/>
                  <ActionButton action="FORMAT.formatAlignmentMiddle" class="'o-hoverable-button'"/>
                  <ActionButton action="FORMAT.formatAlignmentBottom" class="'o-hoverable-button'"/>
                </div>
              </div>
            </div>
            <div class="o-dropdown">
              <ActionButton
                action="FORMAT.formatWrapping"
                hasTriangleDownIcon="true"
                t-on-click="(ev) => this.toggleDropdownTool('textWrappingTool', ev)"
                class="'o-hoverable-button'"
              />
              <div
                class="o-dropdown-content"
                t-att-style="dropdownStyle"
                t-if="state.activeTool === 'textWrappingTool'"
                t-on-click.stop="">
                <div class="o-dropdown-line">
                  <ActionButton
                    action="FORMAT.formatWrappingOverflow"
                    class="'o-hoverable-button'"
                  />
                  <ActionButton action="FORMAT.formatWrappingWrap" class="'o-hoverable-button'"/>
                  <ActionButton action="FORMAT.formatWrappingClip" class="'o-hoverable-button'"/>
                </div>
              </div>
            </div>

            <div class="o-divider"/>

            <ActionButton action="VIEW.createRemoveFilter" class="'o-hoverable-button'"/>
          </div>
        </div>
        <TopBarComposer
          focus="props.focusComposer"
          onComposerContentFocused="props.onComposerContentFocused"
        />
      </div>
    </div>
    <Menu
      t-if="state.menuState.isOpen"
      position="state.menuState.position"
      menuItems="state.menuState.menuItems"
      onClose="() => this.closeMenus()"
      onMenuClicked="() => this.props.onClick()"
    />
  </t>

  <t t-name="o-spreadsheet-ValidationMessages">
    <t t-foreach="props.messages" t-as="msg" t-key="msg">
      <div class="d-flex align-items-center o-side-panel-error" t-att-class="divClasses">
        <t t-call="o-spreadsheet-Icon.TRIANGLE_EXCLAMATION"/>
        <span t-esc="msg"/>
      </div>
    </t>
  </t>
</odoo>
`