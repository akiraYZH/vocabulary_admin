/**
 * @param {二进制文件流} file
 */
function changeFileToBaseURL(file) {
  // Create file
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    //file is not defined, return null
    if (file == undefined) {
      reject();
    }
    // read file, convert to format base64
    fileReader.readAsDataURL(file);

    fileReader.onload = function() {
      // return loaded base64
      const imgBase64Data = this.result;
      resolve(imgBase64Data);
    };
  });
}

/**
 * convert base64 to file format
 * @param {baseURL} dataurl
 * @param {file name} filename
 * @return {Binary stream}
 */
function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

/**
 * canvas compress img
 * @param {params obj} param
 * @param {file binary stream} param.file required
 * @param {target size} param.targetSize default -1
 * @param {image width} param.width default -1，auto set height by ratio
 * @param {output name} param.fileName default "image"
 * @param {compress quality} param.quality default 0.92.range 0~1
 */
async function pressImg(param) {
  return new Promise((resolve, reject) => {
    //if there is no cb then return
    if (param) {
      //if file is not defined, reject
      if (param.file == undefined) {
        reject();
      }
      //assign default values
      param.targetSize = param.hasOwnProperty["targetSize"]
        ? param.targetSize
        : -1;
      param.width = param["width"] ? param.width : -1;
      param.fileName = param["fileName"] ? param.fileName : "image";
      param.quality = param["quality"] ? param.quality : 0.92;
      // get file type
      const fileType = param.file.type;
      if (fileType.indexOf("image") == -1) {
        console.log("Please select image file^_^");
        reject();
      }
      //If current size is smaller than target size，return it directly
      const size = param.file.size;
      if (param.targetSize > size) {
        return param.file;
      }
      // read file, base64
      changeFileToBaseURL(param.file).then((base64) => {
        if (base64) {
          const image = new Image();
          image.src = base64;
          image.onload = function() {
            // get width/height ratio
            const scale = this.width / this.height;
            //create a canvas tag
            const canvas = document.createElement("canvas");
            //get context
            const context = canvas.getContext("2d");
            //get target width, if width is -1, width is original width
            canvas.width = param.width == -1 ? this.width : param.width;
            //get target height, if width is -1, height is original height
            canvas.height =
              param.width == -1 ? this.height : parseInt(param.width / scale);
            //render image $(selector).toggle(); canvas
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            //compress img, get new base64Url
            const newImageData = canvas.toDataURL(fileType, param.quality);
            // convert base64 to file data
            const resultFile = dataURLtoFile(newImageData, param.fileName);
            //if targetSize is set and is smaller than the actual result size, reject
            if (param.targetSize != -1 && param.targetSize < resultFile.size) {
              console.log("Image file too large, please select another file^_^");
              reject();
            } else {
              resolve(resultFile);
            }
          };
        }
      });
    }
  });
}

export default pressImg;
