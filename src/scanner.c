#include "tree_sitter/parser.h"
#include <stdbool.h>
#include <stdlib.h>
#include <string.h>
#include <wctype.h>

#define MAX_INDENT_STACK 1024

enum TokenType { INDENT, DEDENT, NEWLINE };

typedef struct {
    uint16_t indents[MAX_INDENT_STACK];
    uint16_t length;
} IndentStack;

void *tree_sitter_algorithmic_notation_external_scanner_create() {
    IndentStack *stack = malloc(sizeof(IndentStack));
    if (stack) {
        stack->indents[0] = 0;
        stack->length = 1;
    }
    return stack;
}

void tree_sitter_algorithmic_notation_external_scanner_destroy(void *payload) {
    free(payload);
}

unsigned
tree_sitter_algorithmic_notation_external_scanner_serialize(void *payload,
                                                            char *buffer) {
    IndentStack *stack = (IndentStack *)payload;
    uint16_t bytes = stack->length * sizeof(uint16_t);
    if (bytes < TREE_SITTER_SERIALIZATION_BUFFER_SIZE) {
        memcpy(buffer, stack->indents, bytes);
        return bytes;
    }
    return 0;
}

void tree_sitter_algorithmic_notation_external_scanner_deserialize(
    void *payload, const char *buffer, unsigned length) {
    IndentStack *stack = (IndentStack *)payload;
    if (length > 0) {
        memcpy(stack->indents, buffer, length);
        stack->length = length / sizeof(uint16_t);
    } else {
        stack->indents[0] = 0;
        stack->length = 1;
    }
}

bool tree_sitter_algorithmic_notation_external_scanner_scan(
    void *payload, TSLexer *lexer, const bool *valid_symbols) {
    IndentStack *stack = (IndentStack *)payload;

    // 1. Consume a structural newline if the parser expects one
    if (valid_symbols[NEWLINE] && lexer->lookahead == '\n') {
        lexer->advance(lexer, false);

        while (lexer->lookahead == '\n' || lexer->lookahead == '\r') {
            lexer->advance(lexer, false);
        }

        lexer->result_symbol = NEWLINE;
        return true;
    }

    // 2. Skip inline horizontal spaces and tabs to find content
    while (lexer->lookahead == ' ' || lexer->lookahead == '\t') {
        lexer->advance(lexer, true);
    }

    // 3. Ignore empty lines, pure carriage returns, or starting comments
    // so they don't break our depth metrics
    if (lexer->lookahead == '\n' || lexer->lookahead == '\r' ||
        lexer->lookahead == '{') {
        return false;
    }

    // 4. Calculate current line prefix column offset
    uint16_t current_indent = lexer->get_column(lexer);

    // 5. Evaluate Indents
    if (valid_symbols[INDENT] &&
        current_indent > stack->indents[stack->length - 1]) {
        if (stack->length < MAX_INDENT_STACK) {
            stack->indents[stack->length++] = current_indent;
            lexer->result_symbol = INDENT;
            return true;
        }
    }

    // 6. Evaluate Dedents
    if (valid_symbols[DEDENT] &&
        current_indent < stack->indents[stack->length - 1]) {
        stack->length--;
        lexer->result_symbol = DEDENT;
        return true;
    }

    return false;
}
