import { DispatchResult } from "../..";

import { _t } from "../../translation";
import { ClipboardPasteOptions, SpreadsheetChildEnv, Zone } from "../../types";

export const enum CommandResult {
  Success = "Success",
  CancelledForUnknownReason = "CancelledForUnknownReason",
  WillRemoveExistingMerge = "WillRemoveExistingMerge",
  MergeIsDestructive = "MergeIsDestructive",
  CellIsMerged = "CellIsMerged",
  InvalidTarget = "InvalidTarget",
  EmptyUndoStack = "EmptyUndoStack",
  EmptyRedoStack = "EmptyRedoStack",
  NotEnoughElements = "NotEnoughElements",
  NotEnoughSheets = "NotEnoughSheets",
  MissingSheetName = "MissingSheetName",
  UnchangedSheetName = "UnchangedSheetName",
  DuplicatedSheetName = "DuplicatedSheetName",
  DuplicatedSheetId = "DuplicatedSheetId",
  ForbiddenCharactersInSheetName = "ForbiddenCharactersInSheetName",
  WrongSheetMove = "WrongSheetMove",
  WrongSheetPosition = "WrongSheetPosition",
  InvalidAnchorZone = "InvalidAnchorZone",
  SelectionOutOfBound = "SelectionOutOfBound",
  TargetOutOfSheet = "TargetOutOfSheet",
  WrongCutSelection = "WrongCutSelection",
  WrongPasteSelection = "WrongPasteSelection",
  WrongPasteOption = "WrongPasteOption",
  WrongFigurePasteOption = "WrongFigurePasteOption",
  EmptyClipboard = "EmptyClipboard",
  EmptyRange = "EmptyRange",
  InvalidRange = "InvalidRange",
  InvalidZones = "InvalidZones",
  InvalidSheetId = "InvalidSheetId",
  InvalidFigureId = "InvalidFigureId",
  InputAlreadyFocused = "InputAlreadyFocused",
  MaximumRangesReached = "MaximumRangesReached",
  MinimumRangesReached = "MinimumRangesReached",
  InvalidChartDefinition = "InvalidChartDefinition",
  InvalidDataSet = "InvalidDataSet",
  InvalidLabelRange = "InvalidLabelRange",
  InvalidScorecardKeyValue = "InvalidScorecardKeyValue",
  InvalidScorecardBaseline = "InvalidScorecardBaseline",
  InvalidGaugeDataRange = "InvalidGaugeDataRange",
  EmptyGaugeRangeMin = "EmptyGaugeRangeMin",
  GaugeRangeMinNaN = "GaugeRangeMinNaN",
  EmptyGaugeRangeMax = "EmptyGaugeRangeMax",
  GaugeRangeMaxNaN = "GaugeRangeMaxNaN",
  GaugeRangeMinBiggerThanRangeMax = "GaugeRangeMinBiggerThanRangeMax",
  GaugeLowerInflectionPointNaN = "GaugeLowerInflectionPointNaN",
  GaugeUpperInflectionPointNaN = "GaugeUpperInflectionPointNaN",
  GaugeLowerBiggerThanUpper = "GaugeLowerBiggerThanUpper",
  InvalidAutofillSelection = "InvalidAutofillSelection",
  WrongComposerSelection = "WrongComposerSelection",
  MinBiggerThanMax = "MinBiggerThanMax",
  LowerBiggerThanUpper = "LowerBiggerThanUpper",
  MidBiggerThanMax = "MidBiggerThanMax",
  MinBiggerThanMid = "MinBiggerThanMid",
  FirstArgMissing = "FirstArgMissing",
  SecondArgMissing = "SecondArgMissing",
  MinNaN = "MinNaN",
  MidNaN = "MidNaN",
  MaxNaN = "MaxNaN",
  ValueUpperInflectionNaN = "ValueUpperInflectionNaN",
  ValueLowerInflectionNaN = "ValueLowerInflectionNaN",
  MinInvalidFormula = "MinInvalidFormula",
  MidInvalidFormula = "MidInvalidFormula",
  MaxInvalidFormula = "MaxInvalidFormula",
  ValueUpperInvalidFormula = "ValueUpperInvalidFormula",
  ValueLowerInvalidFormula = "ValueLowerInvalidFormula",
  InvalidSortZone = "InvalidSortZone",
  WaitingSessionConfirmation = "WaitingSessionConfirmation",
  MergeOverlap = "MergeOverlap",
  TooManyHiddenElements = "TooManyHiddenElements",
  Readonly = "Readonly",
  InvalidViewportSize = "InvalidViewportSize",
  InvalidScrollingDirection = "InvalidScrollingDirection",
  FigureDoesNotExist = "FigureDoesNotExist",
  InvalidConditionalFormatId = "InvalidConditionalFormatId",
  InvalidCellPopover = "InvalidCellPopover",
  EmptyTarget = "EmptyTarget",
  InvalidFreezeQuantity = "InvalidFreezeQuantity",
  FrozenPaneOverlap = "FrozenPaneOverlap",
  ValuesNotChanged = "ValuesNotChanged",
  InvalidFilterZone = "InvalidFilterZone",
  FilterOverlap = "FilterOverlap",
  FilterNotFound = "FilterNotFound",
  MergeInFilter = "MergeInFilter",
  NonContinuousTargets = "NonContinuousTargets",
  DuplicatedFigureId = "DuplicatedFigureId",
  InvalidSelectionStep = "InvalidSelectionStep",
  DuplicatedChartId = "DuplicatedChartId",
  ChartDoesNotExist = "ChartDoesNotExist",
  InvalidHeaderIndex = "InvalidHeaderIndex",
  InvalidQuantity = "InvalidQuantity",
  MoreThanOneColumnSelected = "MoreThanOneColumnSelected",
  EmptySplitSeparator = "EmptySplitSeparator",
  SplitWillOverwriteContent = "SplitWillOverwriteContent",
  NoSplitSeparatorInSelection = "NoSplitSeparatorInSelection",
  NoActiveSheet = "NoActiveSheet",
  InvalidLocale = "InvalidLocale",
  AlreadyInPaintingFormatMode = "AlreadyInPaintingFormatMode",
  MoreThanOneRangeSelected = "MoreThanOneRangeSelected",
  NoColumnsProvided = "NoColumnsProvided",
  ColumnsNotIncludedInZone = "ColumnsNotIncludedInZone",
  DuplicatesColumnsSelected = "DuplicatesColumnsSelected",
  InvalidHeaderGroupStartEnd = "InvalidHeaderGroupStartEnd",
  HeaderGroupAlreadyExists = "HeaderGroupAlreadyExists",
  UnknownHeaderGroup = "UnknownHeaderGroup",
  UnknownDataValidationRule = "UnknownDataValidationRule",
  UnknownDataValidationCriterionType = "UnknownDataValidationCriterionType",
  InvalidDataValidationCriterionValue = "InvalidDataValidationCriterionValue",
  InvalidNumberOfCriterionValues = "InvalidNumberOfCriterionValues",
  BlockingValidationRule = "BlockingValidationRule",
  InvalidCopyPasteSelection = "InvalidCopyPasteSelection",
}
export const PasteInteractiveContent = {
  wrongPasteSelection: _t("This operation is not allowed with multiple selections."),
  willRemoveExistingMerge: _t(
    "This operation is not possible due to a merge. Please remove the merges first than try again."
  ),
  wrongFigurePasteOption: _t("Cannot do a special paste of a figure."),
  frozenPaneOverlap: _t("This operation is not allowed due to an overlapping frozen pane."),
};

export function handlePasteResult(env: SpreadsheetChildEnv, result: DispatchResult) {
  if (!result.isSuccessful) {
    if (result.reasons.includes(CommandResult.WrongPasteSelection)) {
      env.raiseError(PasteInteractiveContent.wrongPasteSelection);
    } else if (result.reasons.includes(CommandResult.WillRemoveExistingMerge)) {
      env.raiseError(PasteInteractiveContent.willRemoveExistingMerge);
    } else if (result.reasons.includes(CommandResult.WrongFigurePasteOption)) {
      env.raiseError(PasteInteractiveContent.wrongFigurePasteOption);
    } else if (result.reasons.includes(CommandResult.FrozenPaneOverlap)) {
      env.raiseError(PasteInteractiveContent.frozenPaneOverlap);
    }
  }
}

export function interactivePaste(
  env: SpreadsheetChildEnv,
  target: Zone[],
  pasteOption?: ClipboardPasteOptions
) {
  const result = env.model.dispatch("PASTE", { target, pasteOption });
  handlePasteResult(env, result);
}

export function interactivePasteFromOS(
  env: SpreadsheetChildEnv,
  target: Zone[],
  text: string,
  pasteOption?: ClipboardPasteOptions
) {
  const result = env.model.dispatch("PASTE_FROM_OS_CLIPBOARD", { target, text, pasteOption });
  handlePasteResult(env, result);
}
