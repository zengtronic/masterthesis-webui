import roslib from 'roslib';
import Vue from 'vue';

Vue.use(roslib);

export default new roslib.Ros({
    url : 'ws://192.168.178.142:9090',
    
});
