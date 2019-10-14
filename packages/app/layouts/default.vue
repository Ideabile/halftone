<template>
  <div class="container">
    <div class="header">
      <div class="logo">
        <nuxt-link to="/">
          <h1 class="title">
            <img alt="" src="halftone.svg" /> Halftone
          </h1>
          <h2 class="subtitle">
            News, black and white
          </h2>
        </nuxt-link>
      </div>
      <div>
        <span v-if="day">
          <p>{{ day.getDate() }} / {{ day.getMonth() }} / {{ day.getFullYear() }}</p>
        </span>
      </div>
      <menu>
        <menuitem><nuxt-link to="/about">About</nuxt-link></menuitem>
      </menu>
    </div>
    <nuxt />
  </div>
</template>

<script>
  import Bus from '~/utils/message-bus'
  import { getDateObj } from '~/utils/date'

  export default {

    data() {
      return {
        day: null
      }
    },

    mounted() {
      Bus.addEventListener('day', ({ detail }) => {
        this.day = getDateObj(detail)
      })
    }

  }
</script>

<style>
  html {
    font-size: 16px;
    word-spacing: 1px;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    box-sizing: border-box;
  }

  *,
  *:before,
  *:after {
    box-sizing: border-box;
    margin: 0;
  }

  body {
    background-size: cover;
    font-family: 'Times New Roman', serif;
    font-size: 16px;
  }

  .container {
    margin: 0 auto;
    text-align: center;
  }

  .header {
    padding: .2em .8em;
    display: flex;
    justify-content: space-between;
    font-family: Helvetica, san-serif;
    align-items: center;
    position: fixed;
    background: #fff;
    box-shadow: 0 0 10px rgba(0,0,0,0.2);
    z-index: 10;
    top: 0;
    left: 0;
    right: 0;
  }

  .header a {
    color: #333;
    font-weight: bold;
    text-decoration: none;
  }

  .header span {
    font-weight: bold;
  }

  .logo {
    text-align: left;
    font-size: 0.5em;
  }

  .logo a {
    text-decoration: none;
  }

  .logo h1,
  .logo h2 {
    font-size: 1rem;
    display: inline-block;
  }

  .title, .subtitle {
  }

  .title img {
    height: 1em;
    margin-bottom: -0.14em;
  }

  h1,
  h2 {
    background: #FFF;
    color: #333;
  }
</style>
