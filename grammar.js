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

  conflicts: ($) => [],

  rules: {
    source_file: ($) =>
      seq($.program_title, optional($.dictionary), $.main_algorithm),

    program_title: ($) =>
      seq(choice("PROGRAM", "Program"), $.program_name, $._newline),

    program_name: ($) => /[^\r\n]+/,

    dictionary: ($) =>
      seq(
        choice("DICTIONARY", "Dictionary"),
        $._newline,
        optional($._indent),
        repeat($._dictionary_item),
        optional($._dedent),
      ),

    _dictionary_item: ($) =>
      choice(
        $.variable_declaration,
        $.constant_declaration,
        $.type_definition,
        $.function_definition,
        $.procedure_definition,
      ),

    // Standard standalone declarations demand a newline at the end
    variable_declaration: ($) => seq($._field_definition, $._newline),

    // Reusable inline core definitions without trailing newlines
    _field_definition: ($) => seq(commaSep1($.identifier), ":", $._type),

    // Fixed to match: constant MAX_CAPACITY = 100
    constant_declaration: ($) =>
      seq(
        "constant",
        $.identifier,
        "=",
        choice($.number, $.identifier),
        $._newline,
      ),

    type_definition: ($) =>
      seq(
        "type",
        $.identifier,
        ":",
        choice(seq("<", commaSep1($._field_definition), ">"), $._type),
        $._newline,
      ),

    function_definition: ($) =>
      seq(
        "function",
        $.identifier,
        $.parameter_list,
        "->",
        $._type,
        $._newline,
        $._indent,
        optional($.local_dictionary),
        $.algorithm_block,
        $._dedent,
      ),

    procedure_definition: ($) =>
      seq(
        "procedure",
        $.identifier,
        $.parameter_list_io,
        $._newline,
        $._indent,
        optional($.local_dictionary),
        $.algorithm_block,
        $._dedent,
      ),

    // FIX: Changed from variable_declaration to _field_definition
    parameter_list: ($) => seq("(", commaSep($._field_definition), ")"),

    // FIX: Changed from variable_declaration to _field_definition
    parameter_list_io: ($) =>
      seq(
        "(",
        commaSep(seq(choice("input", "output"), $._field_definition)),
        ")",
      ),

    local_dictionary: ($) =>
      seq(
        choice("LOCAL DICTIONARY", "Local Dictionary"),
        $._newline,
        $._indent,
        repeat1($.variable_declaration),
        $._dedent,
      ),

    algorithm_block: ($) =>
      seq(
        choice("ALGORITHM", "Algorithm"),
        $._newline,
        $._indent,
        repeat1($._statement),
        $._dedent,
      ),

    main_algorithm: ($) =>
      seq(
        choice("MAIN ALGORITHM", "Main Algorithm", "Algorithm", "ALGORITHM"),
        $._newline,
        optional($._indent),
        repeat1($._statement),
        optional($._dedent),
      ),

    _statement: ($) =>
      seq(
        choice($.assignment_statement, $.call_statement, $.return_statement),
        $._newline,
      ),

    assignment_statement: ($) => seq($.variable_access, "<-", $.expression),

    call_statement: ($) => seq($.identifier, "(", commaSep($.expression), ")"),

    return_statement: ($) => seq("->", $.expression),

    expression: ($) =>
      choice(
        $.variable_access,
        $.number,
        $.call_statement,
        $.binary_expression,
      ),

    binary_expression: ($) =>
      choice(
        prec.left(2, seq($.expression, "*", $.expression)),
        prec.left(2, seq($.expression, "/", $.expression)),
        prec.left(1, seq($.expression, "+", $.expression)),
        prec.left(1, seq($.expression, "-", $.expression)),
      ),

    _type: ($) =>
      choice(
        "boolean",
        "integer",
        "real",
        "character",
        "string",
        $.identifier,
        $.array_type,
      ),

    variable_access: ($) =>
      choice(
        $.identifier,
        prec.left(3, seq($.variable_access, ".", $.identifier)),
        prec.left(3, seq($.variable_access, "[", $.expression, "]")),
      ),

    array_type: ($) =>
      seq("array", "[", $.expression, "..", $.expression, "]", "of", $._type),

    _newline: ($) => /[\r\n]+/,
    identifier: ($) => /[a-zA-Z_][a-zA-Z0-9_]*/,
    number: ($) => /\d+/,
    comment: ($) => /\{[^\}]*\}/,
  },
});

function commaSep(rule) {
  return optional(commaSep1(rule));
}

function commaSep1(rule) {
  return seq(rule, repeat(seq(",", rule)));
}
