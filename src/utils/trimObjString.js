// 去掉前后空格
function Trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}
//入口
export default function trimObj(obj) {
  if (Object.prototype.toString.call(obj) === "[object Object]") {
    //   如果为对象
    for (const key in obj) {
      if (typeof obj[key] === "string") {
        obj[key] = Trim(obj[key]);
      } else {
        trimObj(obj[key]);
      }
    }
  } else if (Array.isArray(obj)) {
    //如果为数组
    obj.forEach((item, index) => {
      if (typeof item === "string") {
        obj[index] = Trim(obj[index]);
      } else {
        trimObj(item);
      }
    });
  }
}
