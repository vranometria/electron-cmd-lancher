import fs from "fs";

/**
 * ファイルにデータを書き込む
 * @param {String} filepath 書き込み先ファイルパス
 * @param {Object} data 書き込むデータ
 * @returns 
 */
export const saveFile = (filepath, data) => {
  const s = JSON.stringify(data, null, 2);
    try {
      fs.writeFileSync(filepath, s);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
}