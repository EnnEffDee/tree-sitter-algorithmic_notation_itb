; Keywords matched safely using standard query alternations
(program_title "PROGRAM" @keyword)
(program_title "Program" @keyword)

(dictionary "DICTIONARY" @keyword)
(dictionary "Dictionary" @keyword)

(main_algorithm "MAIN ALGORITHM" @keyword)
(main_algorithm "Main Algorithm" @keyword)
(main_algorithm "ALGORITHM" @keyword)
(main_algorithm "Algorithm" @keyword)

(algorithm_block "ALGORITHM" @keyword)
(algorithm_block "Algorithm" @keyword)

; Individual statement keywords
"function" @keyword
"procedure" @keyword
"constant" @keyword
"type" @keyword
"input" @keyword
"output" @keyword

; Built-in Types (if your grammar handles types as anonymous tokens)
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
":" @punctuation.delimiter
"," @punctuation.delimiter

; Literals
(number) @number
(comment) @comment

; Identifiers and Node captures
(program_name) @title

(function_definition
  (identifier) @function)

(procedure_definition
  (identifier) @function)

(call_statement
  (identifier) @keyword.function
  (#any-of? @keyword.function "input" "output" "print" "read"))

(call_statement
  (identifier) @function.call)

; Catch-all rule for basic variable text
(identifier) @variable
