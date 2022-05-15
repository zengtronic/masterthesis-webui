<template>
  <v-app>
    <v-app-bar
          app
          color="primary"
          dark
        >
          <v-toolbar-title>BalancingPi</v-toolbar-title>

          <v-spacer></v-spacer>
          <router-link style="text-decoration: none; color: inherit;" to="/">
            <v-btn icon>
              <v-icon>mdi-google-controller</v-icon>
            </v-btn>
          </router-link>
          <router-link style="text-decoration: none; color: inherit;" to="/parameters">
            <v-btn icon>
              <v-icon>mdi-cog</v-icon>
            </v-btn>
          </router-link>

          <router-link style="text-decoration: none; color: inherit;" to="/about">
          <v-btn icon>
            <v-icon>mdi-help</v-icon>
          </v-btn>
          </router-link>
        </v-app-bar>

        <v-main>
          <router-view/>
        </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',
    data: () => ({
      drawer: false,
      group: null,
    }),

    watch: {
      group () {
        this.drawer = false
      },
    },
};
</script>

<style>
    .text{
    text-decoration: none;}
</style>