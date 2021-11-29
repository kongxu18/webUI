<template>
  <div class="home">
    <Head><title>随身猿</title></Head>
    <Banner></Banner>
    <div>

    </div>
    <Footer></Footer>
  </div>
</template>

<script>
// 导入组件
import Head from '../components/Head'
import Footer from "@/components/Footer";
import Banner from "@/components/Banner";

export default {
  name: 'Home',
  components: {
    Banner,
    Footer,
    Head,
  },
  created() {
    //  vue 生命期钩子
    //  当vue 创建时候，调用这个方法
    //  this 就是vue对象
    this.$axios.get(this.$settings.base_url+'/home/').then(function (response) {
      console.log(response)
    }).catch(error => {
      console.log(error)
      console.log('123')
    })
  },

}
</script>
