const protoInstall: Function = function (name: string, installObj: any): object {
    return {
        install: (Vue: any, options: any) => {
            Vue.prototype[name] = installObj;
        }
    }
}

export default protoInstall;