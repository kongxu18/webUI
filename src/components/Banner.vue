<template>

    <div id="banner">

        <el-carousel height="400px" type="card" :interval="400000000">
            <el-carousel-item v-for="(item,index) in banner_list" :key="index">
                <!--<img src="../assets/img/banner1.png" alt="">-->
                <router-link :to="item.link">

                  <img :src="item.img" :alt="item.name">

                </router-link>

            </el-carousel-item>
        </el-carousel>
    </div>

</template>

<script>
    export default {
        name: "Banner",
        // data:function(){},
        data() {
            return {
                banner_list: []
            }
        },
        created() {
            //当banner组件一创建，就向后台发请求，拿回轮播图数据
            this.$axios.get(this.$settings.base_url + '/home/banner/').then(response => {
                console.log(response.data)
                this.banner_list=response.data
            }).catch(error => {
              console.log('banner',error);
            })
        },

    }
</script>

<style scoped>
    .el-carousel__item {
        height: 400px;
        /*min-width: 1200px;*/
        /*margin-left: calc(50% - 1920px / 2);*/
    }
    .el-carousel__item img {
        height: 400px;
        margin: 0;
        /*margin-left: 20px;*/

    }
</style>