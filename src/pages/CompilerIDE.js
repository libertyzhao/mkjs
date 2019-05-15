import React, { Component } from "react";
import './CompilerIDE.css'

export default class CompilerIDE extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="CompilerIDE">
                <div className="title">
                    <span>Compiler</span>
                </div>
                <div className="ide-container">
                    <textarea className="ide" placeholder="Enter your code"></textarea>
                    <button class="run-btn">Lexing</button>
                </div>
            </div>
        );
    }
}
