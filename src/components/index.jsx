import React, { Component } from "react";
import './index.css'
import CompilerEditer from './editor/CompilerEditer';

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
                <CompilerEditer />
            </div>
        );
    }
}
