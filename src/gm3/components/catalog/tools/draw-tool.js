/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2016-2017 Dan "Ducky" Little
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { changeTool } from '../../../actions/map';
import { Tool } from '../tools';

const DRAW_TYPES = {
    'remove': 'Remove',
    'modify': 'Modify',
    'point': 'Point',
    'line': 'LineString',
    'polygon': 'Polygon',
};

export class DrawTool extends React.Component {
    render() {
        const src = this.props.layer.src[0];
        const path = src.mapSourceName + '/' + src.layerName;

        let tip = `Add a ${this.props.drawType} to the layer`;
        if(this.props.drawType === 'modify') {
            tip = 'Modify a drawn feature';
        } else if (this.props.drawType === 'remove') {
            tip = 'Remove a feature from the layer';
        }

        return (
            <Tool
                iconClass={this.props.drawType}
                tip={tip}
                onClick={() => {
                    this.props.changeTool(DRAW_TYPES[this.props.drawType], path);
                }}
            />
        );
    }
}

DrawTool.propTypes = {
    changeTool: PropTypes.func,
    drawType: PropTypes.string,
    tip: PropTypes.string,
    layer: PropTypes.object.isRequired,
};

DrawTool.defaultProps = {
    changeTool: () => {
    },
    drawType: 'point',
    tip: 'Add a point to the layer.',
};

function mapDispatch(dispatch) {
    return {
        changeTool: (drawType, path) => {
            dispatch(changeTool(drawType, path));
        },
    };
}

export default connect(undefined, mapDispatch)(DrawTool);
