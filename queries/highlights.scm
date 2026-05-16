; Headers/Sections
(program_title "PROGRAM" @keyword)
(program_title "Program" @keyword)

(dictionary "KAMUS" @keyword)
(dictionary "Kamus" @keyword)

(main_algorithm "ALGORITMA UTAMA" @keyword)
(main_algorithm "Algoritma Utama" @keyword)
(main_algorithm "ALGORITMA" @keyword)
(main_algorithm "Algoritma" @keyword)

(algorithm_block "ALGORITMA" @keyword)
(algorithm_block "Algoritma" @keyword)

; Statement keywords
"function" @keyword
"procedure" @keyword
"constant" @keyword
"type" @keyword
"input" @keyword
"output" @keyword
"array" @keyword
"of" @keyword

; Built-in Types
"boolean" @type
"integer" @type
"real" @type
"character" @type
"string" @type

; Operators and Delimiters
"<-" @operator
"->" @operator
"+" @operator
"-" @operator
"*" @operator
"/" @operator
".." @operator
":" @punctuation.delimiter
"," @punctuation.delimiter
"." @punctuation.delimiter
"[" @punctuation.bracket
"]" @punctuation.bracket

; Literals
(number) @number
(boolean) @boolean
(string) @string
(character) @character
(comment) @comment

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
