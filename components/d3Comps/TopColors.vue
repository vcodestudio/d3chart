<template>
    <div class="chips">
        <div v-for="(item,i) in data" :key="`color-${i}`" class="item">
            <div class="color" :style="`background-color:${item.color}`"></div>
            <div class="text">{{item.name}}</div>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        data:{
            default:[]
        }
    }
}
</script>

<style lang="less" scoped>
    .chips {
        display: flex;
        gap:2rem;
        justify-content: center;
        align-items: center;
        & > .item {
            display:flex;
            gap: .5rem;
            align-items:center;
            & > div {
                height:1em;
                line-height:1em;
            }
            .color {
                width:1em;
            }
            .text {

            }   
        }
    }
</style>