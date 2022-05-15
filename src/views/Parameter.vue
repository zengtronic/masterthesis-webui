<template>
  <v-container fluid>
      <v-row v-if="feedback_data != null">
        <v-col cols="12" sm="12">
          <v-btn
            block
            color="secondary"
            elevation="2"
            class="mb-2"
            @click="refetchBtnClick"
          >             
            <v-icon>
              mdi-refresh
            </v-icon>
            Refetch parameters
          </v-btn>
          <v-card>
              <v-card-title>
                Angle Offset
              </v-card-title>
              <v-card-text>
                <v-slider
                  v-model="angle_offset"
                  label="Offset"
                  thumb-label="always"
                  color="secondary"
                  step="0.001"
                  min="-5"
                  max="5"
                ></v-slider>
                <v-switch
                  v-model="auto_angle_offset"
                  color="secondary"
                  inset
                  label="Activate auto angle offset"
                ></v-switch>
                <v-expansion-panels>
                  <v-expansion-panel>
                    <v-expansion-panel-header>
                      MANUAL INPUT
                      <template v-slot:actions>
                        <v-icon color="secondary">
                          $expand
                        </v-icon>
                      </template>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-row>
                        <v-col cols="12" sm="12">
                          <v-text-field
                            label="Offset"
                            v-model="angle_offset"
                            type="number"
                            step="0.001"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
                <br/>
                <v-btn
                  elevation="2"
                  large
                  block
                  @click="updateAngleOffset"
                >Save Angle offset</v-btn>
              </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="12"  >
          <v-card>
              <v-card-title>
                Drive Mode
              </v-card-title>
              <v-card-text class="d-flex justify-center">
                <v-row>
                  <v-col cols="12" sm="4" @click="updateMode(0)">
                    <v-btn block color="primary">
                      OFF / MANUAL
                    </v-btn>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-btn block color="primary"  @click="updateMode(1)">
                      PID-Controlled
                    </v-btn>
                  </v-col>
                  <v-col cols="12" sm="4" >
                    <v-btn block color="primary"  @click="updateMode(2)">
                      Linear-Controlled
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="12"  >
          <v-card>
              <v-card-title>
                Balancing PID Parameters
              </v-card-title>
              <v-card-text>
                <br/>
                <v-slider
                  v-model="bal_kp"
                  label="KP"
                  thumb-label="always"
                  color="secondary"
                  step="0.001"
                  min="0"
                  :max="bal_kpmax"
                >
                  <template v-slot:append>
                    <v-text-field
                      label="Max:"
                      v-model="bal_kpmax"
                      class="mt-0 pt-0"
                      type="number"
                      style="width: 60px"
                    ></v-text-field>
                  </template>
                </v-slider>
                <br/>
                <v-slider
                  v-model="bal_ki"
                  label="KI"
                  thumb-label="always"
                  color="secondary"
                  step="0.001"
                  min="0"
                  :max="bal_kimax"
                >
                  <template v-slot:append>
                    <v-text-field
                      label="Max:"
                      v-model="bal_kimax"
                      class="mt-0 pt-0"
                      type="number"
                      style="width: 60px"
                    ></v-text-field>
                  </template>
                </v-slider>
                <br/>
                <v-slider
                  v-model="bal_kd"
                  label="KD"
                  thumb-label="always"
                  color="secondary"
                  step="0.001"
                  min="0"
                  :max="bal_kdmax"
                >
                  <template v-slot:append>
                    <v-text-field
                      label="Max:"
                      v-model="bal_kdmax"
                      class="mt-0 pt-0"
                      type="number"
                      style="width: 60px"
                    ></v-text-field>
                  </template>
                </v-slider>
                <v-switch
                  v-model="bal_mirror"
                  color="secondary"
                  inset
                  label="Mirror PID?"
                ></v-switch>
                <v-expansion-panels>
                  <v-expansion-panel>
                    <v-expansion-panel-header>
                      MANUAL INPUT
                      <template v-slot:actions>
                        <v-icon color="secondary">
                          $expand
                        </v-icon>
                      </template>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-row>
                        <v-col cols="12" sm="4">
                          <v-text-field
                            label="KP"
                            v-model="bal_kp"
                            type="number"
                            step="0.001"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4">
                          <v-text-field
                            label="KI"
                            v-model="bal_ki"
                            type="number"
                            step="0.001"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4">
                          <v-text-field
                            label="KD"
                            v-model="bal_kd"
                            type="number"
                            step="0.001"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
                <br/>
                <v-btn
                  elevation="2"
                  large
                  block
                  @click="updatePID"
                >Save all PID parameters</v-btn>
              </v-card-text>
          </v-card>
        </v-col>
          
        <v-col cols="12" sm="12"  >
          <v-card>
              <v-card-title>
                Speed PID Parameters
              </v-card-title>
              <v-card-text>
                <br/>
                <v-slider
                  v-model="speed_kp"
                  label="KP"
                  thumb-label="always"
                  color="secondary"
                  step="0.001"
                  min="0"
                  :max="speed_kpmax"
                >
                  <template v-slot:append>
                    <v-text-field
                      label="Max:"
                      v-model="speed_kpmax"
                      class="mt-0 pt-0"
                      type="number"
                      style="width: 60px"
                    ></v-text-field>
                  </template>
                </v-slider>
                <br/>
                <v-slider
                  v-model="speed_ki"
                  label="KI"
                  thumb-label="always"
                  color="secondary"
                  step="0.001"
                  min="0"
                  :max="speed_kimax"
                >
                  <template v-slot:append>
                    <v-text-field
                      label="Max:"
                      v-model="speed_kimax"
                      class="mt-0 pt-0"
                      type="number"
                      style="width: 60px"
                    ></v-text-field>
                  </template>
                </v-slider>
                <br/>
                <v-slider
                  v-model="speed_kd"
                  label="KD"
                  thumb-label="always"
                  color="secondary"
                  step="0.001"
                  min="0"
                  :max="speed_kdmax"
                >
                  <template v-slot:append>
                    <v-text-field
                      label="Max:"
                      v-model="speed_kdmax"
                      class="mt-0 pt-0"
                      type="number"
                      style="width: 60px"
                    ></v-text-field>
                  </template>
                </v-slider>
                
                <v-switch
                  v-model="speed_mirror"
                  inset
                  color="secondary"
                  label="Mirror PID?"
                ></v-switch>
                <v-expansion-panels>
                  <v-expansion-panel>
                    <v-expansion-panel-header>
                      MANUAL INPUT
                      <template v-slot:actions>
                        <v-icon color="secondary">
                          $expand
                        </v-icon>
                      </template>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-row>
                        <v-col cols="12" sm="4">
                          <v-text-field
                            label="KP"
                            v-model="speed_kp"
                            type="number"
                            step="0.001"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4">
                          <v-text-field
                            label="KD"
                            v-model="speed_ki"
                            type="number"
                            step="0.001"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4">
                          <v-text-field
                            label="KD"
                            v-model="speed_kd"
                            type="number"
                            step="0.001"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
                <br/>
                <v-btn
                  elevation="2"
                  large
                  block
                  @click="updatePID"
                >Save all PID parameters</v-btn>
              </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="12"  >
          <v-card>
              <v-card-title>
                Speed Linear Parameters
              </v-card-title>
              <v-card-text>
                <br/>
                <v-slider
                  v-model="linear_step"
                  label="Step size"
                  thumb-label="always"
                  color="secondary"
                  step="0.001"
                  min="0.001"
                  max="0.1"
                >
                </v-slider>
                <br/>
                <v-slider
                  v-model="linear_back_multiplicator"
                  label="Back Mult"
                  thumb-label="always"
                  color="secondary"
                  step="0.1"
                  min="1"
                  max="10"
                >
                </v-slider>
                <v-expansion-panels>
                  <v-expansion-panel>
                    <v-expansion-panel-header>
                      MANUAL INPUT
                      <template v-slot:actions>
                        <v-icon color="secondary">
                          $expand
                        </v-icon>
                      </template>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-row>
                        <v-col cols="12" sm="6">
                          <v-text-field
                            label="Step Size"
                            v-model="linear_step"
                            type="number"
                            step="0.001"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field
                            label="Back Multiplicator"
                            v-model="linear_back_multiplicator"
                            type="number"
                            step="0.1"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
                <br/>
                <v-btn
                  elevation="2"
                  large
                  block
                  @click="updateLinear"
                >Save linear parameters</v-btn>
              </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-else>
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
                    Loading Parameters from MCU - {{order_count}}
                  </div>
                </v-flex>
              </v-card-text>
          </v-card>
        </v-col>
      </v-row>
  </v-container>
</template>

<script>
import roscore from '../plugins/roscore';
import roslib from 'roslib';
  export default {
    name: 'Parameter',
    data: () => ({
      feedback_data: null,
      bal_kpmax: 10,
      bal_kimax: 2,
      bal_kdmax: 2,
      bal_kp: 6,
      bal_ki: 0,
      bal_kd: 0.1,
      bal_mirror: false,
      speed_kpmax: 0.5,
      speed_kimax: 0.1,
      speed_kdmax: 0.1,
      speed_kp: 0,
      speed_ki: 0,
      speed_kd: 0,
      speed_mirror: false,
      angle_offset: 0,
      order_instance: null,
      order_count: 0,
      auto_angle_offset: false,
      linear_step: 0.001,
      linear_back_multiplicator: 1 
    }),
    components: {
    },
    computed:{
    
    },
    created(){
      this.parameterTopic = new roslib.Topic({
        ros : roscore,
        name : '/robot/parameters',
        messageType : 'project_messages/ParameterUpdate'
      });

      this.kp = this.$store.state.parameters.kp;
      this.ki = this.$store.state.parameters.kd;
      this.kd = this.$store.state.parameters.ki;
      this.angleOffset = this.$store.state.parameters.angleOffset;

      this.feedbackTopic = new roslib.Topic({
        ros : roscore,
        name : '/robot/parameters/feedback',
        messageType : 'project_messages/ParameterFeedback'
      });

      this.fetchParameters();
    },
    methods:{
      refetchBtnClick(){
        this.feedback_data = null;
        this.fetchParameters();
      },
      orderFeedback(){
        this.order_count += 1;
        console.log("Order Parameter Message");
        let msg = {
          name: "Fetch Parameters",
          setting: 3
        };
        this.parameterTopic.publish(msg);
      },
      fetchParameters(){
        this.feedbackTopic.subscribe(this.feedbackReceived);
        this.order_instance = setInterval(this.orderFeedback, 1000);
      },
      feedbackReceived(message){
        this.feedback_data = message;
        this.feedbackTopic.unsubscribe(this.feedbackReceived);

        this.bal_kp = message.balancing_kp;
        this.bal_ki = message.balancing_ki;
        this.bal_kd = message.balancing_kd;
        this.speed_kp = message.speed_kp;
        this.speed_ki = message.speed_ki;
        this.speed_kd = message.speed_kd;
        this.angle_offset = message.angle_offset;
        this.auto_angle_offset = message.auto_offset_active == true ? 1 : 0;
        this.bal_mirror = message.balancing_mirror == true ? 1 : 0;
        this.speed_mirror = message.speed_mirror == true ? 1 : 0;
        this.linear_step = message.linear_step;
        this.linear_back_multiplicator = message.linear_back_multiplicator;
        clearInterval(this.order_instance);
        this.order_count = 0;
        console.log(message);
        console.log(message.balancing_mirror);
        console.log(typeof message.balancing_mirror);
        console.log(Number(message.balancing_mirror));
        console.log(message.balancing_mirror == true ? 1 : 0);
        console.log(message.balancing_mirror === true ? 1 : 0);
      },
      updateMode(mode){
        
          console.log(mode);
        let msg = {
          name: "Update Mode",
          setting: 4,
          int1: mode,
        };
        console.log(msg);
        this.parameterTopic.publish(msg);
      },
      updatePID(){
        let msg = {
          name: "Update PID",
          setting: 1,
          float1: this.bal_kp,
          float2: this.bal_ki,
          float3: this.bal_kd,
          float4: this.speed_kp,
          float5: this.speed_ki,
          float6: this.speed_kd,
          bool1: this.bal_mirror == 1 ? true : false,
          bool2: this.speed_mirror == 1 ? true : false
        };
        console.log(msg);
        this.parameterTopic.publish(msg);
      },
      updateLinear(){
        let msg = {
          name: "Update Linear",
          setting: 5,
          float1: this.linear_step,
          float2: this.linear_back_multiplicator,
        };
        console.log(msg);
        this.parameterTopic.publish(msg);
      },
      updateAngleOffset(){
        let msg = {
          name: "Update angle offset",
          setting: 2,
          float1: this.angle_offset,
          bool1: this.auto_angle_offset
        };
        console.log(msg);
        this.parameterTopic.publish(msg);
      },
    }
  }
</script>