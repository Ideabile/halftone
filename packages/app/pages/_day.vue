<template>
  <div v-if="!!news">
    <news-page :news="news" :day="day" />
    <div>
      <a :href="olderLink">Older</a>
      <a v-if="hasNewer" :href="newerLink">Newer</a>
    </div>
  </div>
  <div v-else>
    <div>
      <h1>Ops! This is not found. :-(</h1>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import newsPage from '~/components/newsPage'

  const getDateObj = (dateString) => {
    const year = dateString.substring(0, 4)
    const month = dateString.substring(4, 6)
    const day = dateString.substring(6, 8)

    return new Date(`${year}-${month}-${day}`)
  }

  const getDateFormat = date => date.toISOString()
                                   .split('T')[0]
                                   .replace(/-/g, '')

  export default {

    components: {
      newsPage
    },

    computed: {

      hasNewer() {
        const d = getDateObj(getDateFormat(new Date()))
        return this.dateObject < d
      },

      olderLink() {
        const d = new Date(this.dateObject)
        return getDateFormat(new Date(d.setDate(d.getDate() - 1)))
      },

      newerLink() {
        const d = new Date(this.dateObject)
        return getDateFormat(new Date(d.setDate(d.getDate() + 1)))
      }

    },

    async asyncData({ params, error }) {
      const { day } = params

      try {
        const { data: news } = await axios.get(
          `http://www.halftone.localhost/${day}/index.json`
        )

        return {
          day,
          dateObject: getDateObj(day),
          news
        }
      } catch (e) {
        error({ statusCode: 400, message: 'Not Found' })
      }
    }

  }
</script>
