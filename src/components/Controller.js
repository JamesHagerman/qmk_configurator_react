import React, { Component } from 'react'

import Api from '../Api';
import Picker from './Picker';

export default class Controller extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentKeyboard: '',
      currentLayout: '',
      currentKeymap: '',
      keyboard: null,
      keyboards: [],
      layouts: [],
      keymaps: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    Api.getKeyboards()
      .then(this.onKeyboardsLoaded.bind(this))
      .catch(this.onKeyboardsLoadError.bind(this));
  }

  render() {
    const { currentKeyboard, currentLayout, currentKeymap } = this.state;
    return (
      <div id="controller">
        <div id="controller-top">
          <Picker
            id="keyboard"
            label="Keyboard"
            values={this.state.keyboards}
            value={this.state.currentKeyboard}
            onChange={kb => this.onKeyboardChange(kb)} />
          <Picker
            id="layout"
            label="Layout"
            values={this.state.layouts}
            value={this.state.currentLayout}
            onChange={kb => this.onLayoutChange(kb)} />
          <Picker
            id="keymap"
            label="Keymap"
            values={this.state.keymaps}
            value={this.state.currentKeymap}
            onChange={kb => this.onKeymapChange(kb)} />
          <button id="compile">Compile</button>
          <button id="load-default">Load Default</button>
        </div>
        <textarea id="status" readOnly defaultValue={""} />
        <div id="controller-bottom">
          <button id="hex" disabled>Download .hex</button>
          <button id="toolbox" disabled>Open in QMK Toolbox</button>
          <button id="source" disabled>Download Source</button>
          <button id="export">Export Keymap</button>
          <button id="import">Import Keymap</button>
          <input id="fileImport" type="file" />
        </div>
      </div>
    )
  }

  onKeyboardChange(currentKeyboard) {
    this.setState({ currentKeyboard });
    Api.getKeyboard(currentKeyboard)
      .then(this.onKeyboardLoaded.bind(this))
      .catch(this.onKeyboardLoadError.bind(this));
  }

  onLayoutChange(currentLayout) {
    this.setState({ currentLayout });
  }

  onKeymapChange(currentKeymap) {
    this.setState({ currentKeymap });
  }

  onKeyboardsLoaded(keyboards) {
    const currentKeyboard = keyboards[0];
    this.setState({ keyboards, currentKeyboard, loading: false });
    this.onKeyboardChange(currentKeyboard);
  }

  onKeyboardsLoadError(error) {
    this.setState({ error, loading: false });
  }

  onKeyboardLoaded(res) {
    const { keyboards } = res;
    const keyboard = keyboards[this.state.currentKeyboard];
    const layouts = Object.keys(keyboard.layouts);
    const currentLayout = layouts[0];
    const keymaps = Object.values(keyboard.keymaps);
    const currentKeymap = keymaps[0];
    this.setState({
      keyboard,
      layouts,
      currentLayout,
      keymaps,
      currentKeymap,
      loading: false,
    });
  }

  onKeyboardLoadError(error) {
    console.error('Error loading keyboard', error);
    this.setState({ error, loading: false });
  }
}