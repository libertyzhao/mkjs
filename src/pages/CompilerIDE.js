import React, { Component } from "react";

export default class CompilerIDE extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="CompilerIDE">
                <div class="title">
                    <span>Compiler</span>
                </div>
                <div>
                    <textarea placeholder="Enter your code"></textarea>
                    <button>Lexing</button>
                </div>
            </div>
        );
    }
}
