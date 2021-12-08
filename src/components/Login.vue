<template>
    <div class="login">
        <div class="box">
            <i class="el-icon-close" @click="close_login"></i>
            <div class="content">
                <div class="nav">
                    <span :class="{active: login_method === 'is_pwd'}"
                          @click="change_login_method('is_pwd')">密码登录</span>
                    <span :class="{active: login_method === 'is_sms'}"
                          @click="change_login_method('is_sms')">短信登录</span>
                </div>
                <el-form v-if="login_method === 'is_pwd'">
                    <el-input
                        placeholder="用户名/手机号/邮箱"
                        prefix-icon="el-icon-user"
                        v-model="username"
                        clearable>
                    </el-input>
                    <el-input
                        placeholder="密码"
                        prefix-icon="el-icon-key"
                        v-model="password"
                        clearable
                        show-password>
                    </el-input>
                    <el-button type="primary" @click="login_password">登录</el-button>
                </el-form>
                <el-form v-if="login_method === 'is_sms'">
                    <el-input
                        placeholder="手机号"
                        prefix-icon="el-icon-phone-outline"
                        v-model="mobile"
                        clearable
                        @blur="check_mobile">
                    </el-input>
                    <el-input
                        placeholder="验证码"
                        prefix-icon="el-icon-chat-line-round"
                        v-model="sms"
                        clearable>
                        <template slot="append">
                            <span class="sms" @click="send_sms">{{ sms_interval }}</span>
                        </template>
                    </el-input>
                    <el-button type="primary" @click="code_login">登录</el-button>
                </el-form>
                <div class="foot">
                    <span @click="go_register">立即注册</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Login",
    data() {
        return {
            username: '',
            password: '',
            mobile: '',
            sms: '',
            login_method: 'is_pwd',
            sms_interval: '获取验证码',
            is_send: false,
        }
    },
    methods: {
        close_login() {
            this.$emit('close')
        },
        go_register() {
            this.$emit('go')
        },
        change_login_method(method) {
            this.login_method = method;
        },
        check_mobile() {
            if (!this.mobile) return;
            if (!this.mobile.match(/^1[3-9][0-9]{9}$/)) {
                this.$message({
                    message: '手机号有误',
                    type: 'warning',
                    duration: 1000,
                    onClose: () => {
                        this.mobile = '';
                    }
                });
                return false;
            }
            //发送axios请求 ，验证手机号
            this.$axios.get(this.$settings.base_url + '/user/check_telephone/',
                {params: {telephone: this.mobile}}).then(response => {
                if (response.data.code) {
                    //手机号存在 允许发送验证码
                    console.log('手机号码存在，可以发送验证码')
                    this.is_send = true;
                } else {
                    this.$message({
                        message: '手机号不存在',
                        type: 'warning',
                        duration: 1000,
                        onClose: () => {
                            this.mobile = '';
                        }
                    });
                }
            }).catch(error => {
                console.log(error, '手机号验证错误');
            })

        },
        send_sms() {

            if (!this.is_send) return;
            this.is_send = false;
            let sms_interval_time = 60;
            this.sms_interval = "发送中...";
            //开始发送验证码
            this.$axios.get(this.$settings.base_url + '/user/send/',
                {params: {'telephone': this.mobile}}).then(response => {
                if (response.data.code) {
                    this.$message({
                        message: '发送验证码成功',
                        type: 'success',
                        duration: 1000,
                    });
                } else {
                    this.$message({
                        message: '验证码发送失败',
                        type: 'warning',
                        duration: 1000,
                    });
                }
            })
            let timer = setInterval(() => {
                if (sms_interval_time <= 1) {
                    //如果小于=1 定时器清除
                    clearInterval(timer);
                    this.sms_interval = "获取验证码";
                    this.is_send = true; // 重新回复点击发送功能的条件
                } else {
                    sms_interval_time -= 1;
                    this.sms_interval = `${sms_interval_time}秒后再发`;
                }
            }, 1000);
        },

        login_password() {
            if (this.username && this.password) {
                //发送请求
                this.$axios.post(this.$settings.base_url + '/user/login/', {
                    username: this.username,
                    password: this.password


                }).then(response => {
                    console.log(response.data)
                    //把用户信息保存到cookie中
                    // this.$cookies.set('key','value','过期时间,按s计')
                    this.$cookies.set('token', response.data.token, '7d')
                    this.$cookies.set('username', response.data.username, '7d')
                    //关闭登录窗口(子传父)
                    this.$emit('close')
                    //给父组件，Head传递一个事件，让它从cookie中取出token和username
                    this.$emit('loginsuccess')
                }).catch(errors => {
                })
            } else {
                this.$message({
                    message: '用户名或密码必须填哦',
                    type: 'warning',
                });
            }
        },

        code_login() {

            if (this.mobile && this.sms) {
                //  发送请求
                this.$axios.post(this.$settings.base_url + '/user/code_login/',
                    {
                        telephone: this.mobile,
                        code: this.sms
                    }).then(response => {
                    console.log('获取到的token数据', response.data);
                    this.$cookies.set('token', response.data.token, '7d');
                    this.$cookies.set('username', response.data.username, '7d');
                    //        关闭登录窗口 子事件传给父容器去做
                    this.$emit('close');
                    //        通知父组件可以去获取cookie 和 username
                    this.$emit('loginsuccess');

                }).catch(errors =>{
                    console.log('验证码登录出现的错误',errors)
                });
            }else {
                this.$message({
                    message:'手机或者验证码缺失',
                    type:'warning'
                });
            }
        }
    }
}
</script>

<style scoped>
.login {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    background-color: rgba(0, 0, 0, 0.3);
}

.box {
    width: 400px;
    height: 420px;
    background-color: white;
    border-radius: 10px;
    position: relative;
    top: calc(50vh - 210px);
    left: calc(50vw - 200px);
}

.el-icon-close {
    position: absolute;
    font-weight: bold;
    font-size: 20px;
    top: 10px;
    right: 10px;
    cursor: pointer;
}

.el-icon-close:hover {
    color: darkred;
}

.content {
    position: absolute;
    top: 40px;
    width: 280px;
    left: 60px;
}

.nav {
    font-size: 20px;
    height: 38px;
    border-bottom: 2px solid darkgrey;
}

.nav > span {
    margin: 0 20px 0 35px;
    color: darkgrey;
    user-select: none;
    cursor: pointer;
    padding-bottom: 10px;
    border-bottom: 2px solid darkgrey;
}

.nav > span.active {
    color: black;
    border-bottom: 3px solid black;
    padding-bottom: 9px;
}

.el-input, .el-button {
    margin-top: 40px;
}

.el-button {
    width: 100%;
    font-size: 18px;
}

.foot > span {
    float: right;
    margin-top: 20px;
    color: orange;
    cursor: pointer;
}

.sms {
    color: orange;
    cursor: pointer;
    display: inline-block;
    width: 70px;
    text-align: center;
    user-select: none;
}
</style>