export enum TokenType {
    KEY_WORD = "KEY_WORD",
    IDENTIFIER = "IDENTIFIER",
    EQUAL_SIGN = "EQUAL_SIGN",
    OPERATOR_SIGN = "OPERATOR_SIGN",
    NUMBER = "NUMBER",
    SEMICOLON = "SEMICOLON"
}

class Token {
    type: TokenType;
    literal: string;
    line: number;
    start: number;
    end: number;
    constructor(type: TokenType, literal: string, line: number, start: number, end: number) {
        this.type = type;
        this.literal = literal;
        this.line = line;
        this.start = start;
        this.end = end;
    }
}

export default Token;
