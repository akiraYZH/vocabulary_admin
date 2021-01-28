<template>
  <div>
    <el-upload
      class="avatar-uploader"
      :action="uploadApi"
      :show-file-list="false"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
      :headers="header"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
import pressImg from "../utils/compressImg.js";

export default {
  name: "ImgUpload",
  props: ["size", "urlTemp"],
  data() {
    return {
      imageUrl: this.urlTemp,
      uploadApi:
        process.env.NODE_ENV == "development"
          ? "http://127.0.0.1:7001/api/words/upload-img"
          : "https://francais-api.akirayu.space/api/words/upload-img",
      //  uploadApi: "http://localhost:8000/api/img/uploadImg",
      header: {
        authentication: "bearer " + localStorage.getItem("authentication"),
      },
    };
  },

  watch: {
    urlTemp: function(val) {
      this.imageUrl = val;
    },
  },
  methods: {
    handleSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      //   console.log(res);
      //   console.log(file);
      if (res.status == 1) {
        this.$emit("uploaded", res);
      } else {
        this.$emit("uploadFail", res);
      }
    },
    async beforeUpload(file) {
      const isFormat = file.type === "image/jpeg" || file.type === "image/png";
      const isLt = file.size / 1024 < this.size;

      if (!isFormat) {
        this.$message.error("上传头像图片只能是 JPG 或 png 格式!");
      }

      const compressedFile = await pressImg({
        file: file,
        fileName: file.name,
        targetSize: 50 * 1024,
        quality: 0.5,
        width: 600,
      });
      if (isFormat) {
        return new Promise((resolve, reject) => {
          if (compressedFile) {
            resolve(compressedFile);
          } else {
            reject();
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" sccoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover;
}
</style>
