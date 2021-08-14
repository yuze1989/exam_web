<template>
  <div>
    <el-select 
        multiple
        v-model="currentProvince"
        :placeholder="placeholder"
        value-key="province" 
        clearable
        filterable
        @clear="handleProvince"
        @change="handleProvince"
    >
        <el-option
            v-for="item in options"
            :key="item.provinceCode"
            :label="item.province"
            :value="item">
        </el-option>
    </el-select>
  </div>
</template>
<script>
// import { getProvinceList } from '@/api/paper'
export default {
    name: 'SelectMultipleProvince',
    props: {
        placeholder: {
            type: String,
            default: '请选择考试'
        },
        province: {
            type: Object,
            default: () => {}
        },
        curProvince: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            currentProvince: null,
            options: [],
        }
    },
    mounted() {
        this.getProvinceList()
        this.currentProvince = this.curProvince
    },
    methods: {
        handleProvince() {
            this.$emit('province', this.currentProvince)
        },
        getProvinceList() {
            this.$axios.get(this.API.studentsManage.examRoomProvince).then(res=>{
                this.options = res.result || []
            }).catch(()=>{})
        }
    }
}
</script>
<style lang="scss" scoped>
    /deep/ .el-scrollbar__wrap{
        margin-bottom: 0 !important;
    }
</style>