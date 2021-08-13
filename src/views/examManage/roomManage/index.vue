<template>
  <section class="form_border">
    <div class="header">
      <el-button class="meiyuan_btn" type="primary" size="medium" @click="addStudio"
        >新增画室信息</el-button
      >
<!--       <el-button class="association_btn" type="primary" size="medium" @click="associationExam"-->
<!--        >关联考试</el-button-->
<!--      >-->
    </div>
    <!--列表-->
    <el-table
      :data="data.records"
      highlight-current-row
      v-loading="listLoading"
      border
      :header-cell-style="{
        background: '#08223c',
        color: '#fff',
        border: 'none',
      }"
    >
      <el-table-column
        label="画室编号"
        header-align="center"
        align="center"
        prop="studioCode"
      >
      </el-table-column>
      <el-table-column
        label="画室名称"
        header-align="center"
        align="center"
        prop="studioName"
      >
      </el-table-column>
       <el-table-column
        label="联系人姓名"
        header-align="center"
        align="center"
        prop="contactName"
      >
      </el-table-column>
       <el-table-column
        label="联系人手机号"
        header-align="center"
        align="center"
        prop="contactMobile"
      >
      </el-table-column>
       <el-table-column
        label="画室地区"
        header-align="center"
        align="center"
        prop="studioAreaName"
      >
      </el-table-column>
       <el-table-column
      fixed="right"
      label="操作"
      width="200">
      <template slot-scope="scope">
        <el-button @click="editItemAction(scope.row)" type="text" size="small" >编辑</el-button>
        <el-button  size="small" @click="handleDetele(scope.row)" type="text"  >删除</el-button>
      </template>
    </el-table-column>
    </el-table>
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
    <addRoomDialog
      :visible.sync="isAdd"
      :isAdd="isAddType"
      :editItem="editItemData"
      @addSuccess="addSuccess"
    >
    </addRoomDialog>
  </section>
</template>

<script>
import addRoomDialog from "./addRoomDialog";
import { deteleStudio } from '@/api/studioManage.js'
export default {
  components: {
    addRoomDialog,
  },
  data() {
    return {
      listLoading: false,
      sels: [], //列表选中列
      search: {
        name: "",
        mobilePhone: "",
      },

      form: {
        pageIndex: 1,
        pageSize: 10,
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
    // 关联考试
    associationExam(){
      this.$router.push({ name: 'AssociationExam'})
    },
  // 删除
    handleDetele(item){
        let that = this
       this.$confirm('此操将删除该条数据, 是否继续?', '提示', {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          deteleStudio({
            id: item.id
          }).then(res=>{
            if(res){
              that.$message({
                type: 'success',
                message: '删除成功!'
               });
               that.getList();
            }else{
             that.$message({
                type: 'error',
                message: '删除失败!'
               });
            }
            
          })
         
        }).catch(() => {
          that.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
  // 编辑
    handleClick(){},
    // 新增
    addStudio() {
      this.isAddType = 1;
      this.isAdd = true;
    },
    addSuccess() {
      this.isAdd = false;
      this.getList();
    },
    editItemAction(item) {
      this.editItemData = item;
      this.isAddType = 0;
      this.isAdd = true;
    },
    currentChange() {
      //console.log('index' + index)
      setTimeout(() => {
         this.getList();
      }, 200);
     
    },
    // api
    getList() {
      let params = {
        current : this.form.pageIndex ,
        pageSize : this.form.size ,
       
      };
      this.$axios
        .post(this.API.roomManage.list, params)
        .then((res) => {
          this.data.records = res.result.records;
          this.data.current = res.result.current;
          this.data.total = res.result.total;
          (this.data.pageSize = res.result.pageSize), (this.data.pages = res.result.pages);
        })
        .catch(() => {});
    },

    update(params) {
      this.$axios
        .post(this.API.roomManage.update, params)
        .then((res) => {
          if (res) {
            this.$message({
              type: "success",
              message: "操作成功!",
            });
            this.getList();
          }
        })
        .catch(() => {});
    },
  },
  mounted() {},
  beforeCreate() {},
};
</script>

<style lang="scss" scoped>
@import "./schoolManage.scss";
</style>

