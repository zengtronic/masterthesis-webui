<template>
  <canvas 
  id="joystick" 
  :width="sizeX" npm
  :height="sizeY" 
  @mousedown="startTouch" 
  @touchstart="startTouch"
  @touchmove="moveTouch" 
  @touchend="stopTouch">
  </canvas>
</template>

<script>
export default {
  name: "ControlStick",
  props:  {
    autoReset: {
      default: true,
      type: Boolean
    },
    valueOverlay: {
      default: false,
      type: Boolean
    },
    rangeX: {
      default: 1,
      type: Number
    },
    rangeY: {
      default: 1,
      type: Number
    },
    sizeX: {
      default: 300,
      type: Number
    },
    sizeY: {
      default: 300,
      type: Number
    },
    theme:{
      default: "rwu_dark",
      type: String
    }
  },
  data: () => ({
    width: 0,
    height: 0,
    xPos: 0,
    yPos: 0,
    xVal: 0,
    yVal: 0,
    colors:{
      frame: null,
      dot: null,
      cross: null
    }
  }),
  mounted: function () {
      var c = document.getElementById("joystick");
      this.width = c.width;
      this.height = c.height;
      this.xPos = this.width/2;
      this.yPos = this.height/2;
      this.xValOld = 0;
      this.yValOld = 0;
      this.offsetLeft = 0;
      this.offsetTop = 0;
      this.pressed = false;
      var ctx = c.getContext("2d");    
      this.canvasElement = c;
      this.canvas = ctx;
      this.loadTheme();
      
      // calc value per pixel
      this.valuePerPixelX = (this.width/2) / this.rangeX;
      this.valuePerPixelY = (this.height/2) / this.rangeY;

      window.addEventListener("resize", this.calcOffsets);

      document.addEventListener("mousemove", this.moveTouch, false);
      document.addEventListener("mouseup", this.stopTouch, false);
      this.calcOffsets();
      this.draw();
  },
  
  methods: {
    loadTheme(){
        if(this.theme == "rwu_dark"){
          this.colors.frame = "#00a9ce";
          this.colors.dot = "#99ddfd";
          this.colors.cross = "#05c3de";
        }else{
          this.colors.frame = "#196105";
          this.colors.dot = "#236611";
          this.colors.cross = "#96f97b";
        }
      
    },
    draw(){
      this.canvas.clearRect(0, 0, this.width, this.height);
      // Draw frame
      this.canvas.beginPath();
      this.canvas.setLineDash([]);
      this.canvas.strokeStyle = this.colors.frame;
      this.canvas.lineWidth = 1;
      this.canvas.moveTo(0, 0);
      this.canvas.lineTo(this.width, 0);
      this.canvas.lineTo(this.width, this.height);
      this.canvas.lineTo(0, this.height);
      this.canvas.lineTo(0, 0);
      this.canvas.stroke();
      this.canvas.closePath();

      this.canvas.beginPath();
      this.canvas.setLineDash([5,3]);
      this.canvas.strokeStyle = this.colors.cross;
      this.canvas.lineWidth = 1;

      // Vertical Line
      this.canvas.moveTo(this.width/2, 0);
      this.canvas.lineTo(this.width/2, this.height);

      //Horizontal Line
      this.canvas.moveTo(0, this.height / 2);
      this.canvas.lineTo(this.width, this.height/2);
    
      this.canvas.stroke();
      this.canvas.closePath();

      //draw dot
      this.canvas.beginPath();
      this.canvas.setLineDash([]);
      this.canvas.strokeStyle = this.colors.cross;
      this.canvas.fillStyle = this.colors.dot;
      this.canvas.arc(this.xPos, this.yPos, 25, 0, Math.PI * 2, true);
      this.canvas.stroke();
      this.canvas.fill();
      this.canvas.closePath();
      if(this.valueOverlay){
        this.canvas.fillStyle = this.colors.frame;
        this.canvas.font = "12px serif";
        this.canvas.fillText("X: " + this.xVal.toFixed(2), 2, 12);
        this.canvas.fillText("Y: " + this.yVal.toFixed(2), 2, 24);
      }
    },
    moveTouch(e){
      if(this.pressed){
        if(typeof e.touches !== 'undefined'){
            this.xPos = this.constrain(e.touches[0].pageX - this.offsetLeft, 0, this.width);
            this.yPos = this.constrain(e.touches[0].pageY - this.offsetTop, 0, this.height);
          }else{
            this.xPos = this.constrain(e.pageX - this.offsetLeft, 0, this.width);
            this.yPos = this.constrain(e.pageY - this.offsetTop, 0, this.height);
        }
      }
      this.calcValues();
      this.draw();
      //console.log(this.pressed, e);
    },
    startTouch(e){
      navigator.vibrate(25);
      this.pressed = true;
      this.moveTouch(e);
    },
    stopTouch(){
      navigator.vibrate(25);
      this.pressed = false;      
      if(this.autoReset){
        this.xPos = this.width/2;
        this.yPos = this.height/2;
        this.calcValues();
        this.draw();
      }
    },
    calcValues(){
      var xPosCorrected = this.xPos - (this.width/2);
      this.xVal = xPosCorrected / this.valuePerPixelX;
      var yPosCorrected = this.yPos - (this.height/2);
      this.yVal = -1 * (yPosCorrected / this.valuePerPixelY);
      
      //Emit the event if values changed:
      if(this.xVal != this.xValOld || this.yVal != this.yValOld){
        this.$emit('joystickMoved', {
          "x": this.xVal,
          "y": this.yVal
        })
      }
      this.xValOld = this.xVal;
      this.yValOld = this.yVal;
    },
    calcOffsets(){     
      this.width = this.canvasElement.width;
      this.height = this.canvasElement.height;
      this.xPos = this.width/2;
      this.yPos = this.height/2;
      // calc the offset for correct touch function
      this.offsetLeft = 0;
      this.offsetTop = 0;
      var offsetObj = this.canvasElement;
      var topmost = false;
      while(!topmost){
        this.offsetLeft += offsetObj.offsetLeft;
        this.offsetTop += offsetObj.offsetTop;
        if(typeof offsetObj.offsetParent !== 'undefined' && offsetObj.offsetParent !== null){
          offsetObj = offsetObj.offsetParent;
        }else{
          topmost = true;
        }
      }

    },
    constrain(variable, min, max){
      if(variable < min){
        return min;
      }else if(variable > max){
        return max;
      }else{
        return variable;
      }
    }

  }
};
</script>

<style scoped>
#joystick {
  touch-action: none;
}
</style>
