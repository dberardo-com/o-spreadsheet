import { Model } from "../../src";
import { toScalar } from "../../src/functions/helper_matrices";
import { isEvaluationError, toBoolean, toNumber } from "../../src/functions/helpers";
import { arg, functionRegistry } from "../../src/functions/index";
import { Arg, ArgType, DEFAULT_LOCALE } from "../../src/types";
import { CellErrorType, EvaluationError } from "../../src/types/errors";
import { setCellContent, setCellFormat } from "../test_helpers/commands_helpers";
import { getCellError, getEvaluatedCell } from "../test_helpers/getters_helpers";
import { evaluateCell, restoreDefaultFunctions } from "../test_helpers/helpers";

describe("functions", () => {
  afterAll(() => {
    restoreDefaultFunctions();
  });
  test("can add a function", () => {
    const val = evaluateCell("A1", { A1: "=DOUBLEDOUBLE(3)" });
    expect(val).toBe("#NAME?");
    functionRegistry.add("DOUBLEDOUBLE", {
      description: "Double the first argument",
      compute: function (arg) {
        return 2 * toNumber(toScalar(arg), DEFAULT_LOCALE);
      },
      args: [arg("number (number)", "my number")],
      returns: ["NUMBER"],
    });
    expect(evaluateCell("A1", { A1: "=DOUBLEDOUBLE(3)" })).toBe(6);
  });

  test("can not add a function with invalid name", () => {
    const createBadFunction = () => {
      functionRegistry.add("TEST*FUNCTION", {
        description: "Double the first argument",
        compute: () => 0,
        args: [],
        returns: ["NUMBER"],
      });
    };
    expect(createBadFunction).toThrow(
      "Invalid function name TEST*FUNCTION. Function names can exclusively contain alphanumerical values separated by dots (.)"
    );
  });

  test("can add a function with underscore", () => {
    const createBadFunction = () => {
      functionRegistry.add("TEST_FUNCTION", {
        description: "Double the first argument",
        compute: () => 0,
        args: [],
        returns: ["NUMBER"],
      });
    };
    expect(createBadFunction).not.toThrow();
  });

  test("Function can return value depending on input values", () => {
    const model = new Model();
    functionRegistry.add("RETURN.VALUE.DEPENDING.ON.INPUT.VALUE", {
      description: "return value depending on input value",
      compute: function (arg) {
        return toNumber(toScalar(arg), DEFAULT_LOCALE) * 2;
      },
      args: [arg("number (number)", "blabla")],
      returns: ["NUMBER"],
    });
    setCellContent(model, "A1", "21");
    setCellContent(model, "A2", "42");
    setCellContent(model, "B1", "=RETURN.VALUE.DEPENDING.ON.INPUT.VALUE(A1)");
    setCellContent(model, "B2", "=RETURN.VALUE.DEPENDING.ON.INPUT.VALUE(A2)");
    expect(getEvaluatedCell(model, "B1").value).toBe(42);
    expect(getEvaluatedCell(model, "B2").value).toBe(84);
  });

  test("Function can return value depending on input error", () => {
    const model = new Model();
    functionRegistry.add("RETURN.VALUE.DEPENDING.ON.INPUT.ERROR", {
      description: "return value depending on input error",
      compute: function (arg: Arg) {
        return isEvaluationError(toScalar(arg)?.value) ? true : false;
      },
      args: [arg("arg (any)", "blabla")],
      returns: ["BOOLEAN"],
    });
    setCellContent(model, "A1", "=SQRT(-1)");
    setCellContent(model, "B1", "=RETURN.VALUE.DEPENDING.ON.INPUT.ERROR(A1)");
    setCellContent(model, "B2", "=RETURN.VALUE.DEPENDING.ON.INPUT.ERROR(A2)");
    expect(getEvaluatedCell(model, "B1").value).toBe(true);
    expect(getEvaluatedCell(model, "B2").value).toBe(false);
  });

  test("Function can return error depending on input value", () => {
    const model = new Model();
    functionRegistry.add("RETURN.ERROR.DEPENDING.ON.INPUT.VALUE", {
      description: "return value depending on input error",
      compute: function (arg) {
        const error = new EvaluationError("Les calculs sont pas bons KEVIN !");
        return toBoolean(toScalar(arg)) ? error : "ceci n'est pas une erreur";
      },
      args: [arg("arg (any)", "blabla")],
      returns: ["ANY"],
    });
    setCellContent(model, "B1", "=RETURN.ERROR.DEPENDING.ON.INPUT.VALUE(true)");
    setCellContent(model, "B2", "=RETURN.ERROR.DEPENDING.ON.INPUT.VALUE(false)");
    expect(getEvaluatedCell(model, "B1")?.value).toBe("#ERROR");
    expect(getCellError(model, "B1")).toBe("Les calculs sont pas bons KEVIN !");
    expect(getEvaluatedCell(model, "B2").value).toBe("ceci n'est pas une erreur");
  });

  test("Function can return error depending on input error", () => {
    const model = new Model();
    functionRegistry.add("RETURN.ERROR.DEPENDING.ON.INPUT.ERROR", {
      description: "return value depending on input error",
      compute: function (arg) {
        return toScalar(arg)?.value === CellErrorType.BadExpression
          ? CellErrorType.CircularDependency
          : CellErrorType.InvalidReference;
      },
      args: [arg("arg (any)", "blabla")],
      returns: ["ANY"],
    });
    setCellContent(model, "A1", "=ThatDoesNotMeanAnything");
    setCellContent(model, "B1", "=RETURN.ERROR.DEPENDING.ON.INPUT.ERROR(A1)");
    setCellContent(model, "B2", "=RETURN.ERROR.DEPENDING.ON.INPUT.ERROR(SQRT(-1))");
    expect(getEvaluatedCell(model, "B1").value).toBe("#CYCLE");
    expect(getEvaluatedCell(model, "B2").value).toBe("#REF");
  });

  test("Function can return format depending on input format", () => {
    const model = new Model();
    functionRegistry.add("RETURN.FORMAT.DEPENDING.ON.INPUT.FORMAT", {
      description: "return format depending on input format",
      compute: function (arg) {
        return { value: 42, format: toScalar(arg)?.format };
      },
      args: [arg("number (number)", "blabla")],
      returns: ["NUMBER"],
    });
    setCellContent(model, "A1", "42");
    setCellFormat(model, "A1", "0%");
    setCellContent(model, "A2", "42");
    setCellFormat(model, "A2", "#,##0.00");
    setCellContent(model, "B1", "=RETURN.FORMAT.DEPENDING.ON.INPUT.FORMAT(A1)");
    setCellContent(model, "B2", "=RETURN.FORMAT.DEPENDING.ON.INPUT.FORMAT(A2)");
    expect(getEvaluatedCell(model, "B1").format).toBe("0%");
    expect(getEvaluatedCell(model, "B2").format).toBe("#,##0.00");
  });

  test("Function can return format depending on input value", () => {
    const model = new Model();
    functionRegistry.add("RETURN.FORMAT.DEPENDING.ON.INPUT.VALUE", {
      description: "return format depending on input value",
      compute: function (arg) {
        const value = toNumber(toScalar(arg), DEFAULT_LOCALE);
        return {
          value,
          format: value >= 0 ? "0%" : "#,##0.00",
        };
      },
      args: [arg("number (number)", "blabla")],
      returns: ["NUMBER"],
    });
    setCellContent(model, "A1", "42");
    setCellContent(model, "A2", "-42");
    setCellContent(model, "B1", "=RETURN.FORMAT.DEPENDING.ON.INPUT.VALUE(A1)");
    setCellContent(model, "B2", "=RETURN.FORMAT.DEPENDING.ON.INPUT.VALUE(A2)");
    expect(getEvaluatedCell(model, "B1").format).toBe("0%");
    expect(getEvaluatedCell(model, "B2").format).toBe("#,##0.00");
  });

  test("Can use a custom evaluation context in a function", () => {
    const model = new Model(
      {},
      {
        custom: {
          coucou: "Raoul",
        },
      }
    );
    functionRegistry.add("GETCOUCOU", {
      description: "Get coucou's name",
      compute: function () {
        return (this as any).coucou;
      },
      args: [],
      returns: ["STRING"],
    });
    setCellContent(model, "A1", "=GETCOUCOU()");
    expect(getEvaluatedCell(model, "A1").value).toBe("Raoul");
  });

  test("Can use a getter in a function", () => {
    const model = new Model();
    functionRegistry.add("GETNUMBERCOLS", {
      description: "Get the number of columns",
      compute: function () {
        const sheetId = (this as any).getters.getActiveSheetId();
        return (this as any).getters.getNumberCols(sheetId);
      },
      args: [],
      returns: ["STRING"],
    });
    expect(evaluateCell("A1", { A1: "=GETNUMBERCOLS()" })).toBe(
      model.getters.getNumberCols(model.getters.getActiveSheetId())
    );
  });

  test("undefined fallback to the zero value in a function", () => {
    functionRegistry.add("UNDEFINED", {
      description: "undefined",
      // @ts-expect-error can happen in a vanilla javascript code base
      compute: function () {
        return undefined;
      },
      args: [],
      returns: ["STRING"],
    });
    expect(evaluateCell("A1", { A1: "=UNDEFINED()" })).toBe(0);
  });

  describe("check type of arguments", () => {
    afterAll(() => {
      restoreDefaultFunctions();
    });
    test("reject non-range argument when expecting only range argument", () => {
      functionRegistry.add("RANGEEXPECTED", {
        description: "function expect number in 1st arg",
        compute: (arg) => {
          return true;
        },
        args: [
          {
            name: "arg1",
            description: "",
            type: ["RANGE"],
            acceptMatrix: true,
            acceptMatrixOnly: true,
          },
        ],
        returns: ["ANY"],
      });

      functionRegistry.add("FORMULA_RETURNING_RANGE", {
        description: "function returning range",
        compute: () => {
          return [["cucumber"]];
        },
        args: [],
        returns: ["RANGE"],
      });

      functionRegistry.add("FORMULA_NOT_RETURNING_RANGE", {
        description: "function returning range",
        compute: () => {
          return "cucumber";
        },
        args: [],
        returns: ["STRING"],
      });

      functionRegistry.add("FORMULA_RETURNING_ERROR", {
        description: "function returning ERROR",
        compute: () => {
          return "#ERROR";
        },
        args: [],
        returns: ["STRING"],
      });

      functionRegistry.add("FORMULA_TROWING_ERROR", {
        description: "function trowing error",
        compute: () => {
          if (!false) {
            throw new EvaluationError("NOP");
          }
          return 42;
        },
        args: [],
        returns: ["NUMBER"],
      });

      functionRegistry.add("FORMULA_RETURNING_RANGE_WITH_ERROR", {
        description: "function returning range",
        compute: () => {
          return [["#ERROR"]];
        },
        args: [],
        returns: ["RANGE"],
      });

      functionRegistry.add("FORMULA_RETURNING_RANGE_TROWING_ERROR", {
        description: "function returning range",
        compute: () => {
          if (!false) {
            throw new EvaluationError("NOP");
          }
          return [["cucumber"]];
        },
        args: [],
        returns: ["RANGE"],
      });

      const m = new Model();
      const errorMessage =
        "Function RANGEEXPECTED expects the parameter '1' to be reference to a cell or range.";

      setCellContent(m, "A1", "=RANGEEXPECTED(42)");
      expect(getEvaluatedCell(m, "A1").value).toBe("#BAD_EXPR");
      expect(getCellError(m, "A1")).toBe(errorMessage);

      setCellContent(m, "B1", '=RANGEEXPECTED("test")');
      expect(getEvaluatedCell(m, "B1").value).toBe("#BAD_EXPR");
      expect(getCellError(m, "B1")).toBe(errorMessage);

      setCellContent(m, "C1", "=RANGEEXPECTED(TRUE)");
      expect(getEvaluatedCell(m, "C1").value).toBe("#BAD_EXPR");
      expect(getCellError(m, "C1")).toBe(errorMessage);

      setCellContent(m, "D1", "=RANGEEXPECTED(FORMULA_NOT_RETURNING_RANGE())");
      expect(getEvaluatedCell(m, "D1").value).toBe("#BAD_EXPR");
      expect(getCellError(m, "D1")).toBe(errorMessage);

      setCellContent(m, "E1", "=RANGEEXPECTED(A1)");
      expect(getEvaluatedCell(m, "E1").value).toBe(true);

      setCellContent(m, "F1", "=RANGEEXPECTED(A1:A1)");
      expect(getEvaluatedCell(m, "F1").value).toBe(true);

      setCellContent(m, "G1", "=RANGEEXPECTED(A1:A2)");
      expect(getEvaluatedCell(m, "G1").value).toBe(true);

      setCellContent(m, "H1", "=RANGEEXPECTED(A1:A$2)");
      expect(getEvaluatedCell(m, "H1").value).toBe(true);

      setCellContent(m, "I1", "=RANGEEXPECTED(sheet1!A1:A$2)");
      expect(getEvaluatedCell(m, "I1").value).toBe(true);

      setCellContent(m, "J1", "=RANGEEXPECTED(FORMULA_RETURNING_RANGE())");
      expect(getEvaluatedCell(m, "J1").value).toBe(true);

      setCellContent(m, "K1", "=RANGEEXPECTED(FORMULA_TROWING_ERROR())");
      expect(getEvaluatedCell(m, "K1").value).toBe("#BAD_EXPR");
      expect(getCellError(m, "K1")).toBe(errorMessage);

      setCellContent(m, "L1", "=RANGEEXPECTED(FORMULA_RETURNING_RANGE_WITH_ERROR())");
      expect(getEvaluatedCell(m, "L1").value).toBe(true);

      setCellContent(m, "M1", "=RANGEEXPECTED(FORMULA_RETURNING_RANGE_TROWING_ERROR())");
      expect(getEvaluatedCell(m, "M1").value).toBe("#BAD_EXPR");
      expect(getCellError(m, "M1")).toBe(errorMessage);
    });

    test("simple argument value from a single cell or range reference", () => {
      const m = new Model();

      functionRegistry.add("SIMPLE_VALUE_EXPECTED", {
        description: "does not accept a range",
        compute: (arg) => {
          return true;
        },
        args: [{ name: "arg1", description: "", type: ["NUMBER"] }],
        returns: ["ANY"],
      });

      setCellContent(m, "B1", "=SIMPLE_VALUE_EXPECTED(A1)");
      expect(getEvaluatedCell(m, "B1").value).toBe(true);

      setCellContent(m, "B2", "=SIMPLE_VALUE_EXPECTED(A1:A2)");
      expect(getEvaluatedCell(m, "B2").value).toBe("#ERROR");
      expect(getCellError(m, "B2")).toBe(
        "Function SIMPLE_VALUE_EXPECTED expects the parameter 'arg1' to be a single value or a single cell reference, not a range."
      );
    });

    test("reject range when expecting only non-range argument", () => {
      for (let typeExpected of ["ANY", "BOOLEAN", "DATE", "NUMBER", "STRING"] as ArgType[]) {
        functionRegistry.add(typeExpected + "EXPECTED", {
          description: "function expect number in 1st arg",
          compute: () => {
            return true;
          },
          args: [{ name: "arg1", description: "", type: [typeExpected] }],
          returns: ["ANY"],
        });
      }

      const m = new Model();

      setCellContent(m, "B1", "=?ANYEXPECTED(A1:A2)");
      expect(getEvaluatedCell(m, "B1").value).toBe("#ERROR");
      expect(getCellError(m, "B1")).toBe(
        "Function ANYEXPECTED expects the parameter 'arg1' to be a single value or a single cell reference, not a range."
      );

      setCellContent(m, "B2", "=BOOLEANEXPECTED(A1:A2)");
      expect(getEvaluatedCell(m, "B2").value).toBe("#ERROR");
      expect(getCellError(m, "B2")).toBe(
        "Function BOOLEANEXPECTED expects the parameter 'arg1' to be a single value or a single cell reference, not a range."
      );

      setCellContent(m, "B3", "=DATEEXPECTED(A1:A2)");
      expect(getEvaluatedCell(m, "B3").value).toBe("#ERROR");
      expect(getCellError(m, "B3")).toBe(
        "Function DATEEXPECTED expects the parameter 'arg1' to be a single value or a single cell reference, not a range."
      );

      setCellContent(m, "B4", "=NUMBEREXPECTED(A1:A2)");
      expect(getEvaluatedCell(m, "B4").value).toBe("#ERROR");
      expect(getCellError(m, "B4")).toBe(
        "Function NUMBEREXPECTED expects the parameter 'arg1' to be a single value or a single cell reference, not a range."
      );

      setCellContent(m, "B5", "=STRINGEXPECTED(A1:A2)");
      expect(getEvaluatedCell(m, "B5").value).toBe("#ERROR");
      expect(getCellError(m, "B5")).toBe(
        "Function STRINGEXPECTED expects the parameter 'arg1' to be a single value or a single cell reference, not a range."
      );

      setCellContent(m, "B6", "=ANYEXPECTED(A1:A$2)");
      expect(getEvaluatedCell(m, "B6").value).toBe("#ERROR");
      expect(getCellError(m, "B6")).toBe(
        "Function ANYEXPECTED expects the parameter 'arg1' to be a single value or a single cell reference, not a range."
      );

      setCellContent(m, "B7", "=ANYEXPECTED(sheet1!A1:A$2)");
      expect(getEvaluatedCell(m, "B7").value).toBe("#ERROR");
      expect(getCellError(m, "B7")).toBe(
        "Function ANYEXPECTED expects the parameter 'arg1' to be a single value or a single cell reference, not a range."
      );

      setCellContent(m, "B9", "=+A2:A3");
      expect(getEvaluatedCell(m, "B9").value).toBe("#ERROR");
      expect(getCellError(m, "B9")).toBe(
        "Function UPLUS expects the parameter 'value' to be a single value or a single cell reference, not a range."
      );

      setCellContent(m, "B10", "=A1+A2:A3");
      expect(getEvaluatedCell(m, "B10").value).toBe("#ERROR");
      expect(getCellError(m, "B10")).toBe(
        "Function ADD expects the parameter 'value2' to be a single value or a single cell reference, not a range."
      );

      setCellContent(m, "B11", "=-A2:A3");
      expect(getEvaluatedCell(m, "B11").value).toBe("#ERROR");
      expect(getCellError(m, "B11")).toBe(
        "Function UMINUS expects the parameter 'value' to be a single value or a single cell reference, not a range."
      );

      setCellContent(m, "B12", "=A1-A2:A3");
      expect(getEvaluatedCell(m, "B12").value).toBe("#ERROR");
      expect(getCellError(m, "B12")).toBe(
        "Function MINUS expects the parameter 'value2' to be a single value or a single cell reference, not a range."
      );

      setCellContent(m, "B13", "=A1+A4*A5:A6-A2");
      expect(getEvaluatedCell(m, "B13").value).toBe("#ERROR");
      expect(getCellError(m, "B13")).toBe(
        "Function MULTIPLY expects the parameter 'factor2' to be a single value or a single cell reference, not a range."
      );

      setCellContent(m, "B14", "=ANYEXPECTED(A1:A1)");
      expect(getEvaluatedCell(m, "B14").value).toBe(true);
      expect(getCellError(m, "B14")).toBeUndefined();
    });
  });
});
