<template>
  <canvas 
  id="laserscan" 
  :width="sizeX"
  :height="sizeY"
  > 
  </canvas>
</template>

<script>
export default {
  name: "LaserScan",
  props:  {
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
    },
    data:{
      type: Array
    }
  },
  data: () => ({
    width: 0,
    height: 0,
    colors:{
      frame: null,
      dot: null,
      cross: null
    }
  }),
  mounted: function () {
      var c = document.getElementById("laserscan");
      this.width = c.width;
      this.height = c.height;
      this.xPos = this.width/2;
      this.yPos = this.height/2;
      var ctx = c.getContext("2d");    
      this.canvasElement = c;
      this.canvas = ctx;
      this.loadTheme();

      window.addEventListener("resize", this.calcOffsets);

      document.addEventListener("mousemove", this.moveTouch, false);
      document.addEventListener("mouseup", this.stopTouch, false);
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
      //this.canvas.moveTo(0, 0);
      //this.canvas.lineTo(this.width, 0);
      //this.canvas.lineTo(this.width, this.height);
      //this.canvas.lineTo(0, this.height);
      //this.canvas.lineTo(0, 0);
      this.canvas.arc(this.width/2, this.width/2, this.width/2 -1, 0, Math.PI * 2, true);
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
      this.canvas.arc(this.xPos, this.yPos, 5, 0, Math.PI * 2, true);
      this.canvas.stroke();
      this.canvas.fill();
      this.canvas.closePath();
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
