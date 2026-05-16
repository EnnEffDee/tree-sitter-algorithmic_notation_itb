/**
 * @file This is an implementation of the algorithmic notation grammar taught in ITB's Algorithms and Programming class.
 * @author EnnEffDee
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "algorithmic_notation",

  extras: ($) => [/[ \t\r]/, $.comment, $._newline],

  externals: ($) => [$._indent, $._dedent, $._newline],

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

    variable_declaration: ($) =>
      seq(commaSep1($.identifier), ":", $._type, $._newline),

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
        "<",
        commaSep1($.variable_declaration),
        ">",
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

    parameter_list: ($) => seq("(", commaSep($.variable_declaration), ")"),

    parameter_list_io: ($) =>
      seq(
        "(",
        commaSep(seq(choice("input", "output"), $.variable_declaration)),
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

    assignment_statement: ($) => seq($.identifier, "<-", $.expression),

    call_statement: ($) => seq($.identifier, "(", commaSep($.expression), ")"),

    return_statement: ($) => seq("->", $.expression),

    expression: ($) =>
      choice($.identifier, $.number, $.call_statement, $.binary_expression),

    binary_expression: ($) =>
      choice(
        prec.left(1, seq($.expression, "+", $.expression)),
        prec.left(1, seq($.expression, "-", $.expression)),
        prec.left(1, seq($.expression, "*", $.expression)),
        prec.left(1, seq($.expression, "/", $.expression)),
      ),

    function_call: ($) => seq($.identifier, "(", commaSep($.expression), ")"),
    _type: ($) => choice("boolean", "integer", "real", "character", "string"),
    identifier: ($) => /[a-zA-Z_][a-zA-Z0-9_]*/,
    number: ($) => /\d+/,
    comment: ($) => /\{[^*]*\}/,
  },
});

function commaSep(rule) {
  return optional(commaSep1(rule));
}
function commaSep1(rule) {
  return seq(rule, repeat(seq(",", rule)));
}
