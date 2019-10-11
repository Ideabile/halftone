<template>
  <div class="container">
    <div v-for="newsDay in archive" :key="newsDay.day">
      <news-page :news="newsDay.news" :day="newsDay.day" class="day_archive" :data-day="newsDay.day" />
    </div>
    <div>
      <div v-if="ops">
        <img alt="" src="ops.svg" />
        I guess we're finished here.
      </div>
      <a v-else :href="yesterday()">Yesterday</a>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import newsPage from '~/components/newsPage'
  import { getDateFormat, getDateObj } from '~/utils/date'
  import Bus from '~/utils/message-bus'

  const isMobile = () => {
    if (
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/Windows Phone/i)
    ) {
      return true
    }

    return false
  }

  const today = getDateFormat(new Date())

  export default {

    components: {
      newsPage
    },

    async asyncData() {
      let archive = []
      try {
        const { data: news } = await axios.get(
          `http://api.halftone.localhost/article`
        )

        archive = [
          { day: today, news }
        ]
      } catch (e) {
        archive = []
      }

      return {
        loadingContent: false,
        day: today,
        ops: false,
        archive,
        observer: null
      }
    },

    mounted() {
      this.scrollListener()
      this.intersectionObserver()
    },

    methods: {

      scrollListener() {
        const START_LOADING_OFFSET = window ? (window.innerHeight / (isMobile() ? 1 : 3)) * 2 : 500

        window.addEventListener('scroll', () => {
          if (this.loadingContent) return

          window.requestAnimationFrame(() => {
            const scrollTriggerLimit = document.body.offsetHeight - START_LOADING_OFFSET
            const isBottom = (window.pageYOffset + window.innerHeight + START_LOADING_OFFSET) >= scrollTriggerLimit

            if (isBottom) {
              this.loadingContent = true
              this.loadContent()
            }
          })
        })
      },

      intersectionObserver() {
        if (this.observer) this.observer.disconnect()

        const $news = this.$el.querySelectorAll('.news')

        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              $news.forEach($el => $el.classList.remove('is-visible'))
              entry.target.classList.add('is-visible')
              const obj = entry.target.querySelector('object')
              if (obj.hasAttribute('v-data')) {
                const svg = obj.getAttribute('v-data')
                obj.removeAttribute('v-data')
                obj.setAttribute('data', svg)
              }
              Bus.dispatchEvent(new CustomEvent('day', { detail: entry.target.dataset.day }))
            }
          })
        }, {
          root: null,
          margin: '0px',
          threshold: 0.3
        })

        $news.forEach($el => observer.observe($el))

        this.observer = observer
      },

      yesterday() {
        const d = getDateObj(this.day)
        return getDateFormat(new Date(d.setDate(d.getDate() - 1)))
      },

      async loadContent() {
        const yesterday = this.yesterday()

        try {
          const { data: news } = await axios.get(
            `http://api.halftone.localhost/${yesterday}/index.json`
          )

          this.archive.push({ day: yesterday, news })
          this.day = yesterday
          this.intersectionObserver()
          this.loadingContent = false
        } catch (e) {
          this.ops = true
        }
      }

    }

  }
</script>
