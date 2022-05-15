<template>
  <v-container fluid>
    <div v-if="telemetry != null">
      <v-row>
        <v-col cols="12" sm="6" md="4" >
          <v-card style="height: 100%; ">
              <v-card-title>
                Control Stick
              </v-card-title>
              <v-card-text class="d-flex justify-center">
                <control-stick valueOverlay autoReset  @joystickMoved="update"  />
              </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="4" style="display:none" >
          <v-card style="height: 100%; ">
              <v-card-title>
                Laserscan
              </v-card-title>
              <v-card-text class="d-flex justify-center">
                <laser-scan/>
              </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="4" >
          <v-card style="height: 100%; ">
              <v-card-title>
                Camera
              </v-card-title>
              <v-card-text class="d-flex justify-center">
                <img id="livecam" src="http://192.168.178.142:8080/stream?topic=/robocam/image&image_transport=compressed"/>

              </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="4" >
          <v-card style="height: 100%; ">
              <v-card-title>
                Tilt
              </v-card-title>
              <v-card-text class="d-flex justify-center">
                <v-icon class="my-auto" :style="getTiltCSS" :color="telemetry.fallen ? 'error':'success'">
                  mdi-navigation
                </v-icon>
              </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="4"   style="display:none">
          <v-card style="height: 100%; ">
              <v-card-title>
                Rotation
              </v-card-title>
              <v-card-text class="d-flex justify-center">
                <v-icon class="my-auto" :style="getRotationCSS">
                  mdi-navigation
                </v-icon>
              </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="12"  >
          <v-card>
              <v-card-title>
                Telemetry
              </v-card-title>
              <v-card-text class="d-flex justify-center">
                <v-row>
                  <v-col cols="12" sm="6">
                    <strong>Tilt:</strong> {{telemetry.angle_actual}}°<br/>
                    <strong>Rotation:</strong> {{telemetry.yaw}}°<br/>
                    <div v-if="!telemetry.small">
                      <strong>Acc.: </strong> {{telemetry.acc_x}} / {{telemetry.acc_y}} / {{telemetry.acc_z}} <br/>
                      <strong>Gyr.: </strong> {{telemetry.gyro_x}} / {{telemetry.gyro_y}} / {{telemetry.gyro_z}} <br/>
                   </div>
                   
                      <strong>Throttle: </strong> {{telemetry.throttle}}<br/>
                      <strong>Steering: </strong> {{telemetry.steering}}<br/>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <strong>State:</strong> {{telemetry.fallen ? "fallen":"balancing"}}<br/>
                    <strong>Motor Left:</strong> {{telemetry.motor_left}} RPS<br/>
                    <strong>Motor Right:</strong> {{telemetry.motor_right}} RPS<br/>
                    <strong>Speed:</strong> {{telemetry.speed_actual}} RPS<br/>
                  </v-col>
                </v-row>
              </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="12" v-if="!telemetry.small">
          <v-card>
              <v-card-title>
                PID Data
              </v-card-title>
              <v-card-text class="d-flex justify-center">
                <v-row>
                  <v-col cols="12" sm="6">
                    <h3>Speed Controller</h3>
                    <strong>In:</strong> {{telemetry.speed_in}}<br/>
                    <strong>Out:</strong> {{telemetry.speed_out}}<br/>
                    <strong>Set:</strong> {{telemetry.speed_set}}<br/>

                  </v-col>
                  <v-col cols="12" sm="6">
                    <h3>Balancing Controller</h3>
                    <strong>In:</strong> {{telemetry.balancing_in}}<br/>
                    <strong>Out:</strong> {{telemetry.balancing_out}}<br/>
                    <strong>Set:</strong> {{telemetry.balancing_set}}<br/>
                  </v-col>
                </v-row>
              </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <div v-else>
      <v-row>
        <v-col cols="12" sm="12"  >
          <v-card>
              <v-card-text>
                <v-flex class="d-flex justify-center my-6">
                  <div>
                      <v-progress-circular
                      :size="200"
                      :width="7"
                      color="secondary"
                      indeterminate
                    ></v-progress-circular>
                    <br/>
                    <br/>
                    Waiting for robot telemetry
                  </div>
                </v-flex>
              </v-card-text>
          </v-card>
        </v-col>
        <!--
        <v-col cols="12" sm="12"  >
          <v-card>
            <v-card-text>
                <v-text-field
                  label="Label"
                  color="primary"
                  v-model="input"
                  @keypress.enter="show">
              
                  <template v-slot:append>
              
                      <v-btn
                        depressed 
                        tile
                        color="primary"
                        class="ma-0"
                        @click="show">
                      
                        show
                        
                      </v-btn>
                    
                  </template>
                    
                </v-text-field>
              </v-card-text>
          </v-card>
        </v-col>
        -->
      </v-row>
    </div>

  </v-container>
</template>

<script>
import ControlStick from '../components/ControlStick.vue';
import LaserScan from '../components/LaserScan.vue';
import roscore from '../plugins/roscore';
import roslib from 'roslib';
  export default {
    name: 'Control',
    data: () => ({
      xVal: 0,
      yVal: 0,
      telemetry: null,
      telemetryDump: null
    }),
    components: {
        ControlStick,
        LaserScan
    },
    computed:{
      getTiltCSS:function(){
          if(this.telemetry != null){
          let angle = this.telemetry.angle_actual;
          //angle = - angle
          let css =  "font-size: 15em; transform: rotate(" + angle + "deg);";
          return css;
        }else{
          return "font-size: 1em; transform: rotate(0deg);";
        }
      },     
      getRotationCSS:function(){
          if(this.telemetry != null){
          let angle = this.telemetry.yaw;
          //angle = - angle
          return "font-size: 15em; transform: rotate(" + angle + "deg);";
        }else{
          return "font-size: 1em; transform: rotate(0deg);";
        }
      },
    },
    created(){
      this.driveTopic = new roslib.Topic({
      ros : roscore,
      name : '/robot/drive',
      messageType : 'project_messages/DriveControl'
    });
    
    this.telemetryTopic = new roslib.Topic({
      ros : roscore,
      name : '/robot/telemetry',
      messageType : 'project_messages/Telemetry'
    });

      this.telemetryTopic.subscribe(this.telemetryReceived);

    },
    beforeDestroy(){
      this.telemetryTopic.unsubscribe(this.telemetryReceived);
      console.log("Unsubscribed telemetrytopic");
    },
    methods:{
      update(e){
        this.xVal = e.x;
        this.yVal = e.y;
        let ret = this.driveTopic.publish({
          throttle: e.y,
          steering: e.x
        });

        // send 0 speed a second time
        if(e.y == 0.0 && e.x == 0.0){
          this.driveTopic.publish({
            throttle: e.y,
            steering: e.x
          });
        }
        
        console.log(ret, e);
      },
      telemetryReceived(message){
        this.tilt = message.tilt;
        this.rotation = message.rotation;        
        //console.log(message);
        this.telemetry = message;
        this.telemetryDump = JSON.stringify(message, null, 2);
        this.$store.state.parameters.kp = message.pid_kp;
        this.$store.state.parameters.kd = message.pid_ki;
        this.$store.state.parameters.ki = message.pid_kd;
        this.$store.state.parameters.angleOffset = message.angle_offset;
      }
    }
  }
</script>

<style scoped>
#livecam{
  max-height: 300px;
  max-width: 100%;
}
</style>