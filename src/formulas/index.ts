// import { Token } from "./tokenizer";
type TokenType =
  | "OPERATOR"
  | "NUMBER"
  | "STRING"
  | "SYMBOL"
  | "SPACE"
  | "DEBUGGER"
  | "ARG_SEPARATOR"
  | "LEFT_PAREN"
  | "RIGHT_PAREN"
  | "REFERENCE"
  | "INVALID_REFERENCE"
  | "UNKNOWN";

export interface Token {
  type: TokenType;
  value: string;
}

/**
 * The formulas module provides all functionality related to manipulating
 * formulas:
 *
 * - tokenization (transforming a string into a list of tokens)
 * - parsing (same, but into an AST (Abstract Syntax Tree))
 * - compiler (getting an executable function representing a formula)
 */
interface FunctionContext {
  parent: string;
  argPosition: number;
}
export interface EnrichedToken extends Token {
  start: number;
  end: number;
  length: number;
  parenIndex?: number;
  functionContext?: FunctionContext;
}

export { compile } from "./compiler";
export * from "./helpers";
export { parse } from "./parser";
export { rangeTokenize } from "./range_tokenizer";

export { tokenize } from "./tokenizer";
