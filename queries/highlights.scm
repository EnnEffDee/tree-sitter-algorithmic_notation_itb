; Headers/Sections
; (program_title "PROGRAM" @keyword)
; (program_title "Program" @keyword)
;
; (dictionary "KAMUS" @keyword)
; (dictionary "Kamus" @keyword)
; (dictionary "KAMUS LOKAL" @keyword)
; (dictionary "Kamus Lokal" @keyword)
; (dictionary "DICTIONARY" @keyword)
; (dictionary "Dictionary" @keyword)
; (dictionary "LOCAL DICTIONARY" @keyword)
; (dictionary "Local Dictionary" @keyword)
;
; (main_algorithm "ALGORITMA UTAMA" @keyword)
; (main_algorithm "Algoritma Utama" @keyword)
; (main_algorithm "ALGORITMA" @keyword)
; (main_algorithm "Algoritma" @keyword)
; (main_algorithm "MAIN ALGORITHM" @keyword)
; (main_algorithm "Main Algorithm" @keyword)
; (main_algorithm "ALGORITHM" @keyword)
; (main_algorithm "Algorithm" @keyword)
;
; (algorithm_block "ALGORITMA" @keyword)
; (algorithm_block "Algoritma" @keyword)
; (algorithm_block "ALGORITHM" @keyword)
; (algorithm_block "Algorithm" @keyword)
[
  "PROGRAM" "Program"
  "KAMUS" "Kamus" "DICTIONARY" "Dictionary"
  "KAMUS LOKAL" "Kamus Lokal" "LOCAL DICTIONARY" "Local Dictionary"
  "ALGORITMA UTAMA" "Algoritma Utama" "MAIN ALGORITHM" "Main Algorithm"
  "ALGORITMA" "Algoritma" "ALGORITHM" "Algorithm"
] @keyword

; Subprogram Definitions
"function" @keyword
"procedure" @keyword

; Conditionals & Loops
[
  "if" "then" "else"
  "repeat" "times" "until"
  "while" "do"
  "iterate" "stop"
  "traversal"
] @keyword

; Logical Operators
[
  "not" "and" "or"
] @keyword.operator

; Declaration Keywords
[
  "constant"
  "type"
] @keyword

[
  "input" "output"
  "array" "of"
  "pointer" "to"
] @keyword.modifier

; Built-in Types
[
  "boolean"
  "integer" "real"
  "character" "string"
] @type

; Operators and Delimiters
[
  "<-" @operator
  "->" @operator
  "->." @operator
  "+" @operator
  "-" @operator
  "*" @operator
  "/" @operator
  ">" @operator
  "<" @operator
  "=" @operator
  ".." @operator
]
[
  ":"
  ","
  "."
] @punctuation.delimiter

[
  "[" "]"
  "(" ")"
] @punctuation.bracket

; Literals
(number) @number
(boolean) @boolean
(string) @string
(character) @character
(comment) @comment
"NIL" @constant.builtin

; Identifiers and Node captures
(program_name) @markup.heading

(type_definition
  (identifier) @type)

(function_definition
  (identifier) @function)

(procedure_definition
  (identifier) @function)

(call_statement
  (identifier) @keyword.function
  (#any-of? @keyword.function "input" "output"))

(call_statement
  (identifier) @function.call)

(variable_access
  (variable_access)
  "."
  (identifier) @property)

(identifier) @variable
