<template>
  <div>
    <div class="news__container">
      <div class="news__images">
        <div class="news__image" v-for="image in news" :key="image.provider" :id="`image-${image.image}`">
          <object type="image/svg+xml" crossorigin="anonymous">
          </object>
        </div>
      </div>
      <div class="news__titles">
        <div class="news" v-for="image in news" :key="image.provider" :data-image="`image-${image.image}`">
          <div class="news__content">
            <h2><span v-for="l in image.title" :key="l">{{ l }}</span></h2>
            <ul>
              <li>
                <a :href="image.link">
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    role="img"
                    viewBox="0 0 1792 1792"
                  >
                    <path
                      fill="currentColor"
                      d="M1520 1216q0-40-28-68l-208-208q-28-28-68-28-42 0-72 32 3 3 19 18.5t21.5 21.5 15 19 13 25.5 3.5 27.5q0 40-28 68t-68 28q-15 0-27.5-3.5t-25.5-13-19-15-21.5-21.5-18.5-19q-33 31-33 73 0 40 28 68l206 207q27 27 68 27 40 0 68-26l147-146q28-28 28-67zm-703-705q0-40-28-68l-206-207q-28-28-68-28-39 0-68 27l-147 146q-28 28-28 67 0 40 28 68l208 208q27 27 68 27 42 0 72-31-3-3-19-18.5t-21.5-21.5-15-19-13-25.5-3.5-27.5q0-40 28-68t68-28q15 0 27.5 3.5t25.5 13 19 15 21.5 21.5 18.5 19q33-31 33-73zm895 705q0 120-85 203l-147 146q-83 83-203 83-121 0-204-85l-206-207q-83-83-83-203 0-123 88-209l-88-88q-86 88-208 88-120 0-204-84l-208-208q-84-84-84-204t85-203l147-146q83-83 203-83 121 0 204 85l206 207q83 83 83 203 0 123-88 209l88 88q86-88 208-88 120 0 204 84l208 208q84 84 84 204z"
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a href="#t-shirt" class="halftone">
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import { getDateObj } from '~/utils/date'

  export default {

    data: () => ({ images: [] }),

    props: [ 'day', 'news' ],

    components: {
    },

    async mounted() {
      const { data: css } = await axios.get(`${window.location.origin}/svg.css`)
      const style = document.createElementNS('http://www.w3.org/1999/xhtml', 'style')
      style.textContent = css

      this.news.forEach(async (news, index) => {
        let { data: svg } = await axios.get(`http://s3.halftone.localhost/halftone-images/${news.image}`)
        const host = document.createElement('div')
        host.innerHTML = svg
        svg = host.firstChild
        svg.prepend(style)
        svg.setAttribute('preserveAspectRatio', 'xMinYMin slice')
        const source = window.btoa(new XMLSerializer().serializeToString(svg))
        this.$el.querySelector(`#image-${news.image} object`).setAttribute(index === 0 ? 'data' : 'v-data', 'data:image/svg+xml;base64,'.concat(source))
      })
    },

    computed: {

      dayObject() {
        return getDateObj(this.day)
      }

    }

  }
</script>

<style>
  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }

  .news__content h2 span{
    position: relative;
    opacity: 0;
  }

  .news.is-visible h2 span {
    animation: fadeIn 2s ease-in-out forwards;
  }

  .news.is-visible .news__content h2 span:nth-child(4n) {
    animation-delay: 0s;
  }

  .news.is-visible .news__content h2 span:nth-child(4n+1) {
    animation-delay: 0.4s;
  }

  .news.is-visible .news__content h2 span:nth-child(4n+3) {
    animation-delay: 0.8s;
  }

  .news.is-visible .news__content h2 span:nth-child(4n+2) {
    animation-delay: 1.2s;
  }

  .news__images {
    position: absolute;
  }

  .news__titles {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .news__image {
    opacity: 0;
    position: relative;
    width: 100vw;
    min-height: 100vh;
  }

  .news__image.is-visible {
    animation: fadeIn 2s ease-in-out forwards;
  }

  .news__container {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }

  .news {
    width: 100vw;
    height: 100vh;
    display: none;
    justify-content: center;
    align-items: end;
    align-items: flex-end;
    padding: 5% 5% 10% 5%;
    position: relative;
    margin-top: 2em;
  }

  .news.is-visible {
    display: flex;
  }

  .news__image object {
    width: 100%;
    position: absolute;
    transform: scale(.55);
    transform-origin: center center;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
  }

  @media(min-width: 40em) {
    .news {
      padding-bottom: 5%;
      align-items: center;
    }
  }

  .news__content {
    z-index: 5;
  }

  h2 {
    font-size: 1.2rem;
    padding: .678em;
    display: inline-block;
  }

  @media(min-width: 40em) {
    h2  {
      font-size: 2rem;
      padding: .872em;
    }
  }

  .halftone {
    background: currentColor;
    mask-image: url('/halftone.svg');
    width: 20px;
    height: 20px;
    display: inline-block;
    mask-size: cover;
    transition: .12s;
  }

  .background__wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  /* .news__container::before,
     .news__container::after {
     content: '';
     display: block;
     position: fixed;
     top: 0;
     left: 0;
     bottom: 0;
     right: 0;
     }

     .background__wrapper--black{
     }

     .background__wrapper--white{
     }

     .news__container::before{
     background: #fff;
     clip-path: polygon(0 0, 0 100vh, 100vw 0);
     }
     .news__container::after{
     background: #000;
     clip-path: polygon(100vw 0, 0% 100vh, 100vw 100vh);
     }
   */
  .background {
    background: currentColor;
    width: 100vw;
    height: 100vh;
    mask-size: 100vh, 100vw, cover;
    mask-position: center center;
    mask-repeat: no-repeat;
    transition: .12s;
    z-index: 1;
  }

  .background__white {
    background: white;
  }

  .background__black {
    background: black;
  }

  ul {
    list-style: none;
    display: block;
    justify-content: center;
    align-content: center;
    background: #fff;
    margin: 10px;
    padding: 0;
  }

  li {
    display: inline;
    width: 20px;
    margin: 20px;
  }

  li a {
    color: #ccc;
  }

  li svg {
    max-width: 32px;
  }
</style>
