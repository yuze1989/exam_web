/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path);
  }
  
  /**
   * @param {string} url
   * @returns {Boolean}
   */
  export function validURL(url) {
    const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return reg.test(url);
  }
  
  /**
   * @param {string} str
   * @returns {Boolean}
   */
  export function validLowerCase(str) {
    const reg = /^[a-z]+$/;
    return reg.test(str);
  }
  
  /**
   * @param {string} str
   * @returns {Boolean}
   */
  export function validUpperCase(str) {
    const reg = /^[A-Z]+$/;
    return reg.test(str);
  }
  
  /**
   * @param {string} str
   * @returns {Boolean}
   */
  export function validAlphabets(str) {
    const reg = /^[A-Za-z]+$/;
    return reg.test(str);
  }
  
  /**
   * @param {string} email
   * @returns {Boolean}
   */
  export function validEmail(email) {
    const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(email);
  }
  
  /**
   * @param {string} str
   * @returns {Boolean}
   */
  export function isString(str) {
    if (typeof str === "string" || str instanceof String) {
      return true;
    }
    return false;
  }
  
  /**
   * @param {Array} arg
   * @returns {Boolean}
   */
  export function isArray(arg) {
    if (typeof Array.isArray === "undefined") {
      return Object.prototype.toString.call(arg) === "[object Array]";
    }
    return Array.isArray(arg);
  }
  
  /**
   * 是否为空
   * @param value
   * @returns {boolean}
   */
  export function isEmpty(value) {
    return value === undefined || value === null || value === "";
  }
  
  export function beautifyHtml(html) {
    const regexH1 = /<h1 id="-?\w*">(.*)<\/h1>/gm;
    const regexH2 = /<h2 id="-?\w*">(.*)<\/h2>/gm;
    const regexH3 = /<h3 id="-?\w*">(.*)<\/h3>/gm;
    let matchH2Index = 0;
    let m1, m2, m3;
  
    while ((m1 = regexH1.exec(html)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m1.index === regexH1.lastIndex) {
        regexH1.lastIndex++;
      }
      if (m1.length < 2) {
        continue;
      }
      html = html.replace(
        m1[0],
        '<section style="box-sizing: border-box;font-family: Optima-Regular, Optima, PingFangSC-light, PingFangTC-light,,serif &quot;PingFang SC&quot;, Cambria, Cochin, Georgia, Times, &quot;Times New Roman&quot;, serif;font-size: 15px;letter-spacing: 1px;text-align: left;white-space: normal;"><section style="box-sizing: border-box;padding-top: 20px;padding-bottom: 20px;text-align: center;display: flex;justify-content: left;color: rgb(63, 62, 63);letter-spacing: 1.5px;align-items: center;"><section style="box-sizing: border-box;margin-top: 6px;margin-right: -20px;"><section data-bgless="spin" data-bglessp="90" style="box-sizing: border-box;width: 20px;text-align: right;height: 14px;background: rgb(255, 235, 20);color: rgb(63, 63, 63);"></section></section><section data-brushtype="text" style="box-sizing: border-box;font-size: 16px;padding-left: 4px;line-height: 20px;transform: rotate(0deg);"><span style="font-size: 25px;"><strong>' +
          m1[1] +
          '</strong></span></section><section style="box-sizing: border-box;margin-bottom: -15px;margin-left: -30px;"><section data-bgless="spin" data-bglessp="90" style="box-sizing: border-box;width: 1.8em;height: 6px;background: rgb(255, 235, 20);"><br></section></section></section></section>'
      );
    }
  
    while ((m2 = regexH2.exec(html)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m2.index === regexH2.lastIndex) {
        regexH2.lastIndex++;
      }
      if (m2.length < 2) {
        continue;
      }
      matchH2Index++;
      html = html.replace(
        m2[0],
        '<section style="box-sizing: border-box;font-family: Optima-Regular, Optima, PingFangSC-light, PingFangTC-light,,serif &quot;PingFang SC&quot;, Cambria, Cochin, Georgia, Times, &quot;Times New Roman&quot;, serif;font-size: 15px;letter-spacing: 1px;text-align: left;white-space: normal;"><section style="box-sizing: border-box;padding-top: 20px;padding-bottom: 20px;text-align: center;display: flex;justify-content: left;color: rgb(63, 62, 63);letter-spacing: 1.5px;align-items: center;"><section style="box-sizing: border-box;margin-top: 6px;margin-right: -20px;"><section data-bgless="spin" data-bglessp="90" style="box-sizing: border-box;width: 20px;text-align: right;height: 14px;background: rgb(255, 235, 20);color: rgb(63, 63, 63);"></section></section><section style="box-sizing: border-box;font-size: 24px;color: rgb(63, 63, 63);margin-top: -10px;"><span style="box-sizing: border-box;">' +
          matchH2Index +
          '</span>.</section><section data-brushtype="text" style="box-sizing: border-box;font-size: 16px;padding-left: 4px;line-height: 20px;transform: rotate(0deg);"><span style="font-size: 20px;"><strong>' +
          m2[1] +
          '</strong></span></section><section style="box-sizing: border-box;margin-bottom: -15px;margin-left: -30px;"><section data-bgless="spin" data-bglessp="90" style="box-sizing: border-box;width: 1.8em;height: 6px;background: rgb(255, 235, 20);"><br></section></section></section></section>'
      );
    }
  
    while ((m3 = regexH3.exec(html)) !== null) {
      if (m3.index === regexH3.lastIndex) {
        regexH3.lastIndex++;
      }
      if (m3.length < 2) {
        continue;
      }
      html = html.replace(
        m3[0],
        '<div style="margin-bottom: 6px"><span style="background-color: rgb(110, 96, 240);color: rgb(255, 255, 255);max-width: 100%;caret-color: rgb(63, 63, 63);font-size: 15px;padding: 2px 5px;box-sizing: border-box;overflow-wrap: break-word;">' +
          m3[1] +
          "</span></div>"
      );
    }
  
    return html;
  }
  