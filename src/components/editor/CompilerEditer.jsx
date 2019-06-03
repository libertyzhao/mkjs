import "./CompilerEditre.css";
import React, { Component } from "react";
import Lexer from "../../compiler/Lexer";
import { TokenType } from "../../compiler/Token";
import rangy from "rangy";

const TokenTypeColor = {
    [TokenType.KEY_WORD]: "green"
    // [TokenType.IDENTIFIER]: "red",
    // [TokenType.EQUAL_SIGN]: "origin",
    // [TokenType.OPERATOR_SIGN]: "brown",
    // [TokenType.NUMBER]: "skyblue",
    // [TokenType.SEMICOLON]: "darkgray"
};

export default class CompilerEditer extends Component {
    constructor(props) {
        super(props);
        this.input = null;
        this.preEnd = 0;
        this.keyWordClass = 'asdf'
        this.lineSpanNode = 'LineSpan'
        this.keyWordElementArray = [];
    }

    eventInputChange = e => {
        if (e.key === "Enter" || e.key === " ") {
            return;
        }
        const pos = rangy.getSelection().getBookmark(this.input);
        // const lexer = new Lexer(this.input.innerText);
        // this.renderToken(lexer.tokenStack, this.input.innerText);
        // this.input.normalize();


        const spans = document.getElementsByClassName(this.keyWordClass);
        while (spans.length) {
            const p = spans[0].parentNode;
            const t = document.createTextNode(spans[0].innerText)
            p.insertBefore(t, spans[0])
            p.removeChild(spans[0])
        }

        //把所有相邻的text node 合并成一个
        this.input.normalize();

        const currentLine = this.getCaretLineNode()

        this.changeNode(this.input);
        this.hightLightRender();
        rangy.getSelection().moveToBookmark(pos);
    };

    getCaretLineNode() {
        var sel = document.getSelection()
        //得到光标所在行的node对象
        var nd = sel.anchorNode
        //查看其父节点是否是span,如果不是，
        //我们插入一个span节点用来表示光标所在的行
        var elements = document.getElementsByClassName(this.lineSpanNode)
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i]
            if (element.contains(nd)) {
                while (element.classList.length > 0) {
                    element.classList.remove(element.classList.item(0))
                }
                element.classList.add(this.lineSpanNode)
                element.classList.add(this.lineNodeClass + i)
                return element
            }
        }

        //计算一下当前光标所在节点的前面有多少个div节点，
        //前面的div节点数就是光标所在节点的行数
        var divElements = this.input.childNodes;
        var l = 0;
        for (var i = 0; i < divElements.length; i++) {
            if (divElements[i].contains(nd)) {
                l = i;
                break;
            }
        }

        var spanNode = document.createElement('span')
        spanNode.classList.add(this.lineSpanNode)
        spanNode.classList.add(this.lineNodeClass + l)
        nd.parentNode.replaceChild(spanNode, nd)
        spanNode.appendChild(nd)
        return spanNode
    }

    hightLightRender(){
        for(let i = 0 ; i < this.keyWordElementArray.length ; i++){
            const e = this.keyWordElementArray[i];
            const node = e.node;
            this.hightLightKeyWord(e.token, e.node, e.start, e.end, e.color);

            if (i === this.keyWordElementArray.length - 1) {
                var end = node.data.length
                var lastText = node.data.substr(this.preEnd,
                                end)
                lastText = this.changeSpaceToNBSP(lastText)
                var parent = node.parentNode
                var lastNode = document.createTextNode(lastText)
                parent.insertBefore(lastNode, node)
                parent.removeChild(node)
            }
        }
        this.keyWordElementArray = [];
    }

    hightLightKeyWord(token, node, start, end, color){
        const text = node.data;
        let textBefore = text.slice(this.preEnd, start);
        textBefore = this.changeSpaceToNBSP(textBefore);

        var textNode = document.createTextNode(textBefore)
        var parentNode = node.parentNode
        parentNode.insertBefore(textNode, node)


        var span = document.createElement('span')
        span.style.color = color;
        span.classList.add(this.keyWordClass)
        span.appendChild(document.createTextNode(token.literal))
        parentNode.insertBefore(span, node)

        this.preEnd = end;

        // elementNode.keyWordCount--
        // console.log(this.divInstance.innerHTML)
    }

    renderToken = (tokens, code) => {
        this.changeNode(this.input);
    }

    changeNode(node){
        const childNodes = node.childNodes;
        for(let child of childNodes){
            this.changeNode(child);
        }
        if(node.data){
            const lexer = new Lexer(node.data);
            this.preEnd = 0;
            for(let i = 0 ; i < lexer.tokenStack.length ; i++){
                const token = lexer.tokenStack[i];
                const color = TokenTypeColor[token.type];
                if(TokenTypeColor[token.type]){
                    this.keyWordElementArray.push({node, start: token.start, end: token.end, token, color})
                }
            }
        }
    }

    // renderToken = (tokens, code) => {
    //     // let renderTokenHtml = '';
    //     const container = document.createDocumentFragment();
    //     let preEnd = 0;
    //     for (let i = 0; i < tokens.length; i++) {
    //         const token = tokens[i];
    //         const color = TokenTypeColor[token.type];
    //         let whiteSpace = code.slice(preEnd, token.start);
    //         whiteSpace = this.changeSpaceToNBSP(whiteSpace);
    //         preEnd = token.end;
    //         let text = whiteSpace + token.literal;
    //         // 加上最末尾的空格
    //         if (i === tokens.length - 1) {
    //             let endWhiteSpace = code.slice(token.end, code.length);
    //             endWhiteSpace = this.changeSpaceToNBSP(endWhiteSpace);
    //             text += endWhiteSpace;
    //         }
    //         if (color) {
    //             const span = document.createElement("span");

    //             const textNode = document.createTextNode(text);
    //             span.appendChild(textNode);
    //             span.style.color = color;
    //             container.appendChild(span);
    //         } else {
    //             const textNode = document.createTextNode(text);
    //         }
    //     }
    //     this.input.appendChild(container);
    // };

    // 创建text节点，如果字符串中有空格，那么会被去掉，所以需要转义一下
    changeSpaceToNBSP(str) {
        var s = "";
        for (var i = 0; i < str.length; i++) {
            if (str[i] === " ") {
                s += "\u00a0";
            } else {
                s += str[i];
            }
        }

        return s;
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
