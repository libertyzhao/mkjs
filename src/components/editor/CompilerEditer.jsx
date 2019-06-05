import "./CompilerEditre.css";
import React, { Component } from "react";
import Lexer from "../../compiler/Lexer";
import { TokenType } from "../../compiler/Token";
import rangy from "rangy";

const TokenTypeColor = {
    [TokenType.KEY_WORD]: "green",
    [TokenType.IDENTIFIER]: "red",
    // [TokenType.EQUAL_SIGN]: "origin",
    // [TokenType.OPERATOR_SIGN]: "brown",
    // [TokenType.NUMBER]: "skyblue",
    // [TokenType.SEMICOLON]: "darkgray"
    default: 'black',
};

export default class CompilerEditer extends Component {
    constructor(props) {
        super(props);
        this.input = null;
        this.preEnd = 0;
        this.spElementArray = [];
    }

    eventInputChange = e => {
        if (e.key === "Enter" || e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            return;
        }
        const pos = rangy.getSelection().getBookmark(this.input);
        // this.input.innerText = this.input.innerText;
        this.getSpElementInfo(this.input);
        this.hightLightRender();
        rangy.getSelection().moveToBookmark(pos);
    };

    hightLightRender(){
        for(let i = 0 ; i < this.spElementArray.length ; i++){
            const e = this.spElementArray[i];
            this.hightLightKeyWord(e.token, e.node, e.start, e.end, e.color);
        }
        this.spElementArray = [];
    }

    // 高亮位置中的文字
    hightLightKeyWord(token, node, start, end, color){
        if(this.preEnd !== start){
            this.preEnd = 0;
        }
        const range = document.createRange();
        range.setStart(node, start - this.preEnd);
        range.setEnd(node, end - this.preEnd);
        var selection = document.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        console.log(color);
        document.execCommand("ForeColor",false, color);
        selection.removeAllRanges();
        this.preEnd = end;
    }

    // 获取关键节点的信息
    getSpElementInfo(node){
        const childNodes = node.childNodes;
        for(let child of childNodes){
            this.getSpElementInfo(child);
        }
        // 拿到text node
        if(node.data){
            const lexer = new Lexer(node.data);
            this.preEnd = 0;
            for(let i = 0 ; i < lexer.tokenStack.length ; i++){
                const token = lexer.tokenStack[i];
                const color = TokenTypeColor[token.type] || TokenTypeColor['default'];
                if(color){
                    this.spElementArray.push({node, start: token.start, end: token.end, token, color})
                }
            }
        }
    }

    render() {
        return (
            <div className="ide-container">
                <div
                    className="ide"
                    contentEditable
                    placeholder="Enter your code"
                    onKeyUp={this.eventInputChange}
                    ref={input => {
                        this.input = input;
                    }}
                />
                <button className="run-btn" onClick={this.parse}>
                    run
                </button>
            </div>
        );
    }
}
