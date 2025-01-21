/**
 * @class Store
 * @description A class to save in local storage the inputs on a <p> element.
 */
export class Store {
  constructor() {}

  /**
   * @method save
   * @description Saves the input in local storage.
   * @param {string} value The input value.
   */
  save(value) {
    let inputs = this.get();
    inputs.push(value);
    localStorage.setItem("inputs", JSON.stringify(inputs));
  }

  /**
   * @method get
   * @description Gets the inputs from local storage.
   * @returns {Array<string>} The inputs.
   */
  get() {
    return JSON.parse(localStorage.getItem("inputs")) || [];
  }

  /**
   * @method clear
   * @description Clears the inputs from local storage.
   */
  clear() {
    localStorage.removeItem("inputs");
  }
}
