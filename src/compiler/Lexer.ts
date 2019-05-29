import Token, { TokenType } from "./Token";

class Lexer {
    code: string;
    lineCount: number;
    tokenStack: Array<Token>;
    prePosition: number;
    position: number;
    keyWordMap: { [key: string]: string };

    constructor(code: string) {
        this.code = code;
        this.lineCount = 0;
        this.prePosition = 0;
        this.position = 0;
        this.tokenStack = [];
        this.keyWordMap = {
            let: "let",
            if: "if",
            else: "else"
        };
        this.parseToken();
    }

    parseToken() {
        const length = this.code.length;
        let value = "";
        while (this.position < length) {
            const char = this.code[this.position];
            if (char === "=") {
                if (value !== "") {
                    this.parseVariable(value);
                    value = "";
                }
                this.prePosition = this.position;
                const token = new Token(
                    TokenType.EQUAL_SIGN,
                    "=",
                    this.lineCount,
                    this.prePosition,
                    this.position + 1
                );
                this.tokenStack.push(token);
            } else if (char === ";") {
                if (value !== "") {
                    this.parseVariable(value);
                    value = "";
                }
                this.prePosition = this.position;
                const token = new Token(
                    TokenType.SEMICOLON,
                    ";",
                    this.lineCount,
                    this.prePosition,
                    this.position + 1
                );
                this.tokenStack.push(token);
            } else if (char === "+") {
                if (value !== "") {
                    this.parseVariable(value);
                    value = "";
                }
                this.prePosition = this.position;
                const token = new Token(
                    TokenType.OPERATOR_SIGN,
                    "+",
                    this.lineCount,
                    this.prePosition,
                    this.position + 1
                );
                this.tokenStack.push(token);
            } else if (this.isEmpty(char)) {
                // 为空格或者换行的时候
                if (value !== "") {
                    this.parseVariable(value);
                    value = "";
                }
                if (char === "\t" || char === "\n") {
                    this.lineCount++;
                }
                this.skipWhiteSpaceAndNewLine();
                continue;
            } else {
                value += char;
            }
            this.position++;
        }
        if (value !== "") {
            this.parseVariable(value);
            value = "";
        }
    }

    parseVariable(value: string) {
        for (let i = 0; i < value.length; i++) {
            const char = value[i];
            if (!this.isDigit(char)) {
                let tokenType;
                // 如果含有非数字的，那么要么是关键字，要么是IDENTIFIER
                if (this.keyWordMap[value]) {
                    tokenType = TokenType.KEY_WORD;
                } else {
                    tokenType = TokenType.IDENTIFIER;
                }
                const token = new Token(tokenType, value, this.lineCount, this.prePosition,
                    this.position);

                this.tokenStack.push(token);
                return;
            }
        }
        const token = new Token(TokenType.NUMBER, value, this.lineCount, this.prePosition,
            this.position);
        this.tokenStack.push(token);
    }

    skipWhiteSpaceAndNewLine() {
        let char = this.code[this.position];
        while (this.isEmpty(char)) {
            this.position++;
            char = this.code[this.position];
        }
        this.prePosition = this.position;
    }

    isEmpty(char){
        return char === " " || char === "\u00a0" || char === "\t" || char === "\n"
    }

    isDigit(char) {
        return "0" <= char && char <= "9";
    }
}

export default Lexer;
