<template>
   <section class="form_border">
    <div class="header">
        准考证模板
    </div>
    <div class="container">
        <!-- 模板信息 -->
        <div class="template">
              <!-- 基本信息 -->
            <div class="basic-info">
                <div class="display-center">
                    <div class="title">考试名称</div>
                     <el-select v-model="form.examNo" style="width:200px;margin-left:50px;" placeholder="请选择考试名称" @change="examNameChange">
                        <el-option
                            v-for="item in examNameOption"
                                :key="item.provinceCode"
                                :label="item.province"
                                :value="item.provinceCode">
                            </el-option>
                    </el-select>
                </div>
               <div class="display-center">
                    <div class="title">考生省份</div>
                      <el-select v-model="form.studentAreaCode" style="width:200px;margin-left:50px;" placeholder="请选择考生省份" @change="studentChange">
                        <el-option
                            v-for="item in studentAreaOption"
                            :key="item.provinceCode"
                            :label="item.province"
                            :value="item.provinceCode">
                        </el-option>
                    </el-select>
               </div>
              <div class="display-center">
                   <div class="title">主办单位</div>
                   <el-input v-model="form.organizer" style="width:200px;margin-left:50px;"  placeholder="请输入主办单位"></el-input>
              </div>
              <div class="display-center">
                   <div class="title">考试标题</div>
                   <el-input v-model="form.examTitle" style="width:200px;margin-left:50px;"  placeholder="请输入考试标题" ></el-input>
              </div>
            </div>
             <!--列表-->
            <el-table
            :data="data.records"
            highlight-current-row
            v-loading="listLoading"
            border
            style="width: 60%;"
            :header-cell-style="{
                background: '#08223c',
                color: '#fff',
                border: 'none',
            }"
            >
            <el-table-column
                label="科目"
                header-align="center"
                align="center"
                prop="no"
            >
            </el-table-column>
            <el-table-column
                label="考试日期"
                header-align="center"
                align="center"
                prop="name"
            >
            </el-table-column>
            <el-table-column
                label="考试开始时间"
                header-align="center"
                align="center"
                prop="studioNum"
            >
            </el-table-column>
             <el-table-column
                label="考试结束时间"
                header-align="center"
                align="center"
                prop="studioNum"
            >
            </el-table-column>
            </el-table>
            <!-- 注意事项 -->
            <div class="careful-matter">
                <textarea name="" id="" cols="30" rows="10"></textarea>
            </div>
        </div>
        <!-- 模板示例 -->
        <div class="template-example">

        </div>

    </div>
   
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <myPagination
        :current.sync="form.pageIndex"
        :pages.sync="data.pages"
        :size.sync="form.pageSize"
        :total.sync="data.total"
        @cb="currentChange"
      />
    </el-col>
  </section>
</template>

<script>

import { examinationList,apiRelationStudio } from '@/api/studioManage.js'
export default {
  name: "AddTicketTemplate",
  data() {
    return {
       listLoading: false,
      sels: [], //列表选中列
      search: {
        name: "",
        mobilePhone: "",
      },
      studentAreaOption: [],
      examNameOption: [],
      form: {
        pageIndex: 1,
        size: 10,
        studentAreaName: "",
        studentAreaCode: "",
        examName: "",
        examNo:""
      },

      data: { pageIndex: 1, pages: 0, pageSize: 10, total: 0, records: [
        {
         
        }
      ] },
      isAdd: false,
      isAddType: 1, //1新增  0编辑
      editItemData: {},
    };
  },
  created() {
     this.getList();
  },

  methods: {
    // 新建模板
    addTemplate(){
        
    },
  // 获取列表
    getList() {
      let params = {
        current : this.form.pageIndex ,
        size : this.form.size ,
        name : this.form.examName,
        no:  this.form.examNo
      };
      examinationList(params).then((res) => {
                 this.data.records = res.result.records;
                this.data.current = res.result.current;
                this.data.total = res.result.total;
                (this.data.size = res.result.pageSize), (this.data.pages = res.result.pages);
            })
            .catch(() => {});
    },
  // 考试改变监听
    studioAreaChange(e){
      this.examNameOption.map(item =>{
        if(item.code == e){
          this.from.examName = item.name
        }
      })
    },
      // 考生省份改变监听
    studentChange(e){
      this.studentAreaOption.map(item =>{
        if(item.provinceCode == e){
          this.from.studentAreaName = item.province
        }
      })
    },
   currentChange() {
      //console.log('index' + index)
      this.getList();
    },
  },
  mounted() {},
  beforeCreate() {},
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
.header{
display: flex;
padding-left:200px;
}
.display-center{
    display: flex;
    align-items: center;
    padding-left: 50px;
    margin-bottom: 20px;

}
.container{
    display: flex;
}
</style>

