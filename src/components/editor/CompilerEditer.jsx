import "./CompilerEditre.css";
import React, { Component } from "react";
import Lexer from "../../compiler/Lexer";
import { TokenType } from "../../compiler/Token";
import rangy from "rangy";

const TokenTypeColor = {
    [TokenType.KEY_WORD]: "green",
    [TokenType.IDENTIFIER]: "red",
    [TokenType.EQUAL_SIGN]: "origin",
    [TokenType.OPERATOR_SIGN]: "brown",
    [TokenType.NUMBER]: "skyblue",
    [TokenType.SEMICOLON]: "darkgray"
};

export default class CompilerEditer extends Component {
    constructor(props) {
        super(props);
        this.input = null;
    }

    eventInputChange = e => {
        const pos = rangy.getSelection().getBookmark(this.input)
        const lexer = new Lexer(this.input.innerText);
        this.renderToken(lexer.tokenStack, this.input.innerText);
        rangy.getSelection().moveToBookmark(pos)
    };

    renderToken = (tokens, code) => {
        // let renderTokenHtml = '';
        const container = document.createDocumentFragment();
        let preEnd = 0;
        for(let i = 0 ; i < tokens.length ; i++){
            const token = tokens[i];
            const color = TokenTypeColor[token.type] || "blue";
            let whiteSpace = code.slice(preEnd, token.start);
            whiteSpace = this.changeSpaceToNBSP(whiteSpace);
            preEnd = token.end;
            const span = document.createElement('span');
            let text = whiteSpace + token.literal;
            // 加上最末尾的空格
            if(i === tokens.length - 1) {
                let endWhiteSpace = code.slice(token.end, code.length);
                endWhiteSpace = this.changeSpaceToNBSP(endWhiteSpace);
                text += endWhiteSpace;
            }
            const textNode = document.createTextNode(text);
            span.appendChild(textNode);
            span.style.color = color;
            container.appendChild(span);
        }
        this.input.innerText = '';
        console.log(container.children);
        console.log(tokens);
        this.input.appendChild(container);
    };

    // 创建text节点，如果字符串中有空格，那么会被去掉，所以需要转义一下
    changeSpaceToNBSP(str) {
        var s = ""
        for (var i = 0; i < str.length; i++) {
            if (str[i] === ' ') {
                s += '\u00a0'
            }
            else {
                s += str[i]
            }
        }

        return s;
    }

    parse = () => {
        // const lexer = new Lexer(this.value)
        // console.log(lexer.tokenStack);
    };

    render() {
        return (
            <div className="ide-container">
                <div
                    className="ide"
                    contentEditable
                    placeholder="Enter your code"
                    onInput={this.eventInputChange}
                    ref={input => {
                        this.input = input;
                    }}
                ></div>
                <button className="run-btn" onClick={this.parse}>
                    run
                </button>
            </div>
        );
    }
}
