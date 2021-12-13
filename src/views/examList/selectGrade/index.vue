<template>
    <el-select v-model="currentGrade" @change="handleChangeGrade(currentGrade)" value-key="name" size="mini" style="width:60px" filterable placeholder="请选择等级">
        <el-option
            v-for="item in option"
            :key="item.name"
            :label="item.name"
            :value="item.name"
        >
        </el-option>
  </el-select>
</template>
<script>
export default {
    name: 'SelecteGrade',
    props: {
        option: {
            type:Array,
            default: []
        },
        grade: {
            type: String,
            default: '请选择'
        }
    },

    data() {
        return {
            currentGrade: '',
        }
    },
    methods: {
        handleChangeGrade(val) {
            this.$emit('grade', val)
        },
    }
}
</script>