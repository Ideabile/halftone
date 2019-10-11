<template>
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" :viewBox="getViewBox()" :width="this.img.width*3" :height="this.img.height*3" preserveAspectRatio="xMinYMid slice">
        <g stroke="none" fill="#000">
            <g v-for="(item, lum) in items" :key="lum">
                <circle v-for="circle in item" :cx="circle.x * 3" :cy="circle.y * 3" :r="lum * 1.2" :key="circle.x+circle.y" />
            </g>
        </g>
    </svg>
</template>
<script>
 export default {

     props: [ 'img' ],

     data(){
         return {
             width: 0,
             height: 0,
             items: this.getBrightnessData(this.img)
         }
     },

     methods: {

         getViewBox(){
             let width = this.img.width
             let height = this.img.height
             return `-0.5 -0.5 ${width*3} ${height*3}`
         },

         getPathData(item){
             let path = [];

             for(let k in item){
                 path.push(`M${item[k].x} ${item[k].y}z`)
             }
             return path.join('')
         },

         getRgba(data, i){
             return { r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3] }
         },

         getLuminosity(rgba){
             return (( rgba.a - (rgba.r + rgba.g + rgba.b) / 3) / 200).toFixed(2)
         },

         isInvisible(rgba){ // Or white
             return (!rgba.a > 0 || (rgba.r === 255 && rgba.g === 255 && rgba.b === 255))
         },

         getBrightnessData(img) {
             let lums = {};
             let data = img.data

             for(let i = 0; i<data.length; i+=4){

                 let rgba = this.getRgba(data, i)

                 if ( this.isInvisible(rgba) ) continue

                 let lum = this.getLuminosity(rgba);
                 if (lum <= 0) continue
                 let x = (i / 4) % img.width
                 let y = Math.floor((i / 4) / img.width)

                 lums[lum] = lums[lum] || []
                 lums[lum].push({ x, y })

             }

             return lums
         }
     }
 }
</script>
