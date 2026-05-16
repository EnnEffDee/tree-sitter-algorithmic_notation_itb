/**
 * @file This is an implementation of the algorithmic notation grammar taught in ITB's Algorithms and Programming class.
 * @author EnnEffDee
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "algorithmic_notation_itb",

  extras: ($) => [/[ \t]/, $.comment, $._newline],

  externals: ($) => [$._indent, $._dedent],

  rules: {
    source_file: ($) =>
      seq(
        $.program_title,
        optional($.dictionary),
        repeat(choice($.procedure_definition, $.function_definition)),
        $.main_algorithm,
      ),

    program_title: ($) =>
      seq(choice("PROGRAM", "Program"), $.program_name, $._newline),

    program_name: () => /[^\r\n]+/,

    dictionary: ($) =>
      seq(
        choice("KAMUS", "Kamus", "DICTIONARY", "Dictionary"),
        $._newline,
        choice(repeat1($._dictionary_item), seq("-", $._newline)),
      ),

    _dictionary_item: ($) =>
      choice($.variable_declaration, $.constant_declaration, $.type_definition),

    variable_declaration: ($) => seq($._field_definition, $._newline),

    _field_definition: ($) => seq(commaSep1($.identifier), ":", $._type),

    constant_declaration: ($) =>
      seq(
        "constant",
        $.identifier,
        ":",
        $._type,
        "=",
        $.expression,
        $._newline,
      ),

    type_definition: ($) =>
      seq(
        "type",
        $.identifier,
        ":",
        choice(seq("<", $.record_field_list, ">"), $._type),
        $._newline,
      ),

    record_field_list: ($) =>
      seq(
        $._field_definition,
        repeat(
          seq(choice(";", ","), optional($._newline), $._field_definition),
        ),
        optional(choice(";", ",")),
        optional($._newline),
      ),

    function_definition: ($) =>
      seq(
        "function",
        $.identifier,
        $.parameter_list,
        "->",
        $._type,
        $._newline,
        optional($.local_dictionary),
        $.algorithm_block,
      ),

    procedure_definition: ($) =>
      seq(
        "procedure",
        $.identifier,
        $.parameter_list_io,
        $._newline,
        optional($.local_dictionary),
        $.algorithm_block,
      ),

    parameter_list: ($) => seq("(", commaSep($._field_definition), ")"),

    parameter_list_io: ($) =>
      seq(
        "(",
        optional(
          commaSep1(
            seq(
              optional(
                choice("input/output", "input / output", "input", "output"),
              ),
              $._field_definition,
            ),
          ),
        ),
        ")",
      ),

    local_dictionary: ($) =>
      seq(
        choice(
          "KAMUS LOKAL",
          "Kamus Lokal",
          "LOCAL DICTIONARY",
          "Local Dictionary",
        ),
        $._newline,
        optional($._indent),
        choice(repeat1($.variable_declaration), seq("-", $._newline)),
        optional($._dedent),
      ),

    algorithm_block: ($) =>
      seq(
        choice("ALGORITMA", "Algoritma", "ALGORITHM", "Algoritma"),
        $._newline,
        $._indent,
        optional(repeat1($._statement)),
        $._dedent,
      ),

    main_algorithm: ($) =>
      seq(
        choice(
          "ALGORITMA UTAMA",
          "Algoritma Utama",
          "ALGORITMA",
          "Algoritma",
          "MAIN ALGORITHM",
          "Main Algorithm",
          "ALGORITHM",
          "Algorithm",
        ),
        optional($._newline),
        optional($._indent),
        optional(repeat1($._statement)),
        optional($._dedent),
      ),

    _statement: ($) =>
      seq(
        choice(
          $.assignment_statement,
          $.if_statement,
          $.repeat_n_times_statement,
          $.repeat_until_statement,
          $.while_statement,
          $.iterate_stop_statement,
          $.traversal_statement,
          $.call_statement,
          $.return_statement,
        ),
      ),

    assignment_statement: ($) => seq($.variable_access, "<-", $.expression),

    if_statement: ($) =>
      prec.right(
        seq(
          "if",
          $.expression,
          "then",
          $._newline,
          $._indent,
          repeat1($._statement),
          $._dedent,
          optional($._else_clause),
        ),
      ),

    _else_clause: ($) =>
      prec.right(
        choice(
          seq("else", $._newline, $._indent, repeat1($._statement), $._dedent),
          seq(
            "else",
            "if",
            $.expression,
            "then",
            $._newline,
            $._indent,
            repeat1($._statement),
            $._dedent,
            optional($._else_clause),
          ),
        ),
      ),

    while_statement: ($) =>
      seq(
        "while",
        $.expression,
        "do",
        $._newline,
        $._indent,
        repeat1($._statement),
        $._dedent,
      ),

    repeat_n_times_statement: ($) =>
      seq(
        "repeat",
        $.expression,
        "times",
        $._newline,
        $._indent,
        repeat1($._statement),
        $._dedent,
      ),

    repeat_until_statement: ($) =>
      seq(
        "repeat",
        $._newline,
        $._indent,
        repeat1($._statement),
        $._dedent,
        "until",
        $.expression,
        $._newline,
      ),

    iterate_stop_statement: ($) =>
      seq(
        "iterate",
        $._newline,
        $._indent,
        repeat($._statement),
        "stop",
        $._newline,
        $._indent,
        repeat($._statement),
        $._dedent,
      ),

    traversal_statement: ($) =>
      seq(
        $.identifier,
        "traversal",
        "[",
        $.expression,
        "..",
        $.expression,
        "]",
        $._newline,
        $._indent,
        repeat1($._statement),
        $._dedent,
      ),

    call_statement: ($) =>
      prec(4, seq($.identifier, "(", commaSep($.expression), ")")),

    return_statement: ($) => seq("->", $.expression),

    expression: ($) =>
      choice(
        $.binary_expression,
        $.unary_expression,
        $.variable_access,
        $.number,
        $.boolean,
        $.character,
        $.string,
        $.nil,
        seq("(", $.expression, ")"),
        seq($.identifier, "(", optional(commaSep1($.expression)), ")"),
      ),

    binary_expression: ($) =>
      choice(
        ...["*", "/", "div", "mod"].map((op) =>
          prec.left(5, seq($.expression, op, $.expression)),
        ),
        ...["+", "-"].map((op) =>
          prec.left(4, seq($.expression, op, $.expression)),
        ),
        ...["<", ">", "<=", ">=", "=", "!="].map((op) =>
          prec.left(3, seq($.expression, op, $.expression)),
        ),
        prec.left(2, seq($.expression, "and", $.expression)),
        ...["or", "xor"].map((op) =>
          prec.left(1, seq($.expression, op, $.expression)),
        ),
      ),

    unary_expression: ($) =>
      choice(
        prec(6, seq(choice("NOT", "Not", "not"), $.expression)),
        prec(6, seq("-", $.expression)),
      ),

    _type: ($) =>
      choice($.primitive_type, $.identifier, $.array_type, $.pointer_type),

    primitive_type: () =>
      choice(
        "integer",
        "Integer",
        "real",
        "Real",
        "boolean",
        "Boolean",
        "character",
        "Character",
        "string",
        "String",
      ),

    nil: () => choice("NIL", "nil", "Nil"),

    array_type: ($) =>
      seq(
        "array",
        optional(seq("[", $.expression, "..", $.expression, "]")),
        "of",
        $._type,
      ),

    pointer_type: ($) => seq("pointer", "to", $._type),

    variable_access: ($) =>
      choice(
        $.identifier,
        prec.left(5, seq($.variable_access, ".", $.identifier)),
        prec.left(5, seq($.variable_access, "[", $.expression, "]")),
      ),

    _newline: () => /[\r\n]+/,
    identifier: () => /[a-zA-Z_][a-zA-Z0-9_]*/,
    number: () => /-?\d+(?:\.\d+)?/,
    boolean: () => choice("TRUE", "True", "true", "FALSE", "False", "false"),
    string: () => /"[^"\\]*(?:\\.[^"\\]*)*"/,
    character: () => /'[^'\\]*(?:\\.[^'\\]*)*'/,
    comment: () => /\{[^\}]*\}/,
  },
});
/**
 * @param {any} rule
 */
function commaSep(rule) {
  return optional(commaSep1(rule));
}
/**
 * @param {any} rule
 */
function commaSep1(rule) {
  return seq(rule, repeat(seq(",", rule)));
}
