class Helper{
    constructor(){
        this.baseWidth = 1024;
        this.baseHeight = 768;
        this.deathCounts = 0;
    }

    scaleWidth(value, scaleW){
        return value / this.baseWidth * scaleW;
    }

    scaleHeight(value, scaleH){
        return value / this.baseHeight * scaleH;
    }
}

export default new Helper();