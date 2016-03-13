<template id="com_keyboard">
    <div class="kb-box"  style="display: none;" tabindex="-1">
        {{a}}
        <div class="kb-cover" v-on:tap="hide()"></div>
        <div class="kb-main">
            <div class="kb-pbox">
                <div class="kb-left">
                <span class="kb-item"
                      v-for="item in kbNumber"
                      v-on:tap="itemTap(item,'base')"
                        >{{item}}</span>
                </div>
                <div class="kb-right">
                    <span class="kb-item kb-delete"
                          v-on:tap="itemTap(item,'delete')"></span>
                    <span class="kb-item active"
                          v-on:tap="itemTap(item,'sure')">确定</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    Vue.component('com-keyboard',{
        template: '#com_keyboard',
        props: ['value','status'],
        data: function(){
            return{
                a: 'xxxx',
                kbNumber: [1,2,3,4,5,6,7,8,9,'.',0,'-']
            }
        },
        methods: {
            hide:function(){
                this.status = false;
            },
            show:function(){
                this.status = true;
            },
            itemTap: function(item,type){
                var len = this.value.length;
                switch (type){
                    case 'base':
                        this.value += '' + item;
                        this.$dispatch('child-msg');
                        break;
                    case 'delete':
                        this.value = this.value.substring(0,len-1);
                        this.$dispatch('child-msg');
                        break;
                    case 'sure':
                        this.status = false;
                        break;
                }
            }
        }
    });
</script>
<style>
    .kb-box,
    .kb-cover{
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 100;
    }
    .kb-main{
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 12.625rem;
        background:#CCD1D5;
        z-index: 101;
    }
    .kb-pbox{
        padding: 0.375rem 0.125rem;
    }
    .kb-left{
        float: left;
        width: 75%;
    }    
    .kb-right{
        float: left;
        width: 25%;
    }
    .kb-item{
        float: left;
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
        background:#FFF;
        border: 0.125rem solid #CCD1D5;
        border-radius: 0.35rem;
        text-align: center;
        font-size: 1rem;
        color: #3F3F3F;
    }
    .kb-item:active{
        background-color: #3b98e0;
        color: #FFF;
    }
    .kb-item.active{
        background-color: #3b98e0;
        color: #FFF;
    }
    .kb-left > .kb-item{
        width: 33.333%;
        height: 3rem;
        line-height: 3rem;
    }
    .kb-right > .kb-item{
        width: 100%;
        height: 6rem;
        line-height: 6rem;
    }
    .kb-delete{
        -webkit-background-size: 1.9375rem 1rem;
        background: #FFF url(../img/kb-delete.png) no-repeat center center/1.9375rem 1rem;
    }
</style>