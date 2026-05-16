#include "tree_sitter/parser.h"
#include <stdlib.h>
#include <string.h>

#define MAX_INDENT_STACK 512

enum TokenType { INDENT, DEDENT };

typedef struct {
    uint16_t indents[MAX_INDENT_STACK];
    uint16_t length;
} IndentStack;

void *tree_sitter_algorithmic_notation_itb_external_scanner_create() {
    IndentStack *stack = malloc(sizeof(IndentStack));
    if (stack != NULL) {
        stack->indents[0] = 0;
        stack->length = 1;
    }
    return stack;
}

void tree_sitter_algorithmic_notation_itb_external_scanner_destroy(
    void *payload) {
    free(payload);
}

unsigned
tree_sitter_algorithmic_notation_itb_external_scanner_serialize(void *payload,
                                                                char *buffer) {
    IndentStack *stack = (IndentStack *)payload;
    unsigned size = stack->length * sizeof(uint16_t);
    if (size <= TREE_SITTER_SERIALIZATION_BUFFER_SIZE) {
        memcpy(buffer, stack->indents, size);
        return size;
    }
    return 0;
}

void tree_sitter_algorithmic_notation_itb_external_scanner_deserialize(
    void *payload, const char *buffer, unsigned length) {
    IndentStack *stack = (IndentStack *)payload;
    if (length > 0) {
        stack->length = length / sizeof(uint16_t);
        memcpy(stack->indents, buffer, length);
    } else {
        stack->indents[0] = 0;
        stack->length = 1;
    }
}

bool tree_sitter_algorithmic_notation_itb_external_scanner_scan(
    void *payload, TSLexer *lexer, const bool *valid_symbols) {
    IndentStack *stack = (IndentStack *)payload;

    // Skip horizontal inline spacing
    while (lexer->lookahead == ' ' || lexer->lookahead == '\t') {
        lexer->advance(lexer, true);
    }

    // Skip over comments completely
    if (lexer->lookahead == '{') {
        lexer->advance(lexer, false);
        while (lexer->lookahead != '}' && lexer->lookahead != 0) {
            lexer->advance(lexer, false);
        }
        if (lexer->lookahead == '}') {
            lexer->advance(lexer, false);
        }
        while (lexer->lookahead == ' ' || lexer->lookahead == '\t') {
            lexer->advance(lexer, true);
        }
    }

    // If we are staring directly at a line-break sequence, skip evaluating
    // block modifications
    if (lexer->lookahead == '\n' || lexer->lookahead == '\r') {
        return false;
    }

    uint16_t current_indent = lexer->get_column(lexer);

    // Evaluate Indent Scope
    if (valid_symbols[INDENT] &&
        current_indent > stack->indents[stack->length - 1]) {
        if (stack->length < MAX_INDENT_STACK) {
            stack->indents[stack->length++] = current_indent;
            lexer->result_symbol = INDENT;
            return true;
        }
    }

    // Evaluate Dedent Scope
    if (valid_symbols[DEDENT] &&
        current_indent < stack->indents[stack->length - 1]) {
        stack->length--;
        lexer->result_symbol = DEDENT;
        return true;
    }

    return false;
}
