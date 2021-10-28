<template>
  <section class="form_border">
    <div class="header">
      <el-col :span="10">
        <el-button class="meiyuan_btn" type="primary" size="medium" @click="addStudio"
        >新增机构信息</el-button
        >
        <el-button class="meiyuan_btn" type="primary" size="medium" @click="addStudio2"
        >批量导入机构</el-button
        >
      </el-col>

     <el-col :span="14" style="display: flex;justify-content: flex-end">
       <el-input v-model="form.studentName" style="width:200px;margin-left:15px;"  placeholder="机构名称"
       ></el-input>
       <el-button class="association_btn" style="margin-left:50px; margin-bottom: 10px" type="primary" size="medium" @click="getList"
       >查询</el-button>
     </el-col>
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
        label="机构编号"
        header-align="center"
        align="center"
        prop="studioCode"
      >
      </el-table-column>
      <el-table-column
        label="机构名称"
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
        label="机构所属省份"
        header-align="center"
        align="center"
        prop="studioAreaName"
      >
      </el-table-column>
      <el-table-column
          label="机构所属市区"
          header-align="center"
          align="center"
          prop="studioCityName"
      >
      </el-table-column>
       <el-table-column
      fixed="right"
      label="操作"
      width="200">
      <template slot-scope="scope">
        <el-button @click="editItemAction(scope.row)" type="text" size="small" >编辑</el-button>
        <el-button  size="small" @click="oneDel(scope.row)" type="text"  >删除</el-button>
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
    <!--批量导入-->
    <el-dialog title="批量导入机构信息" :visible.sync="showCheck">
      <el-row style="padding: 20px 0">
        <el-col :span="12" style="padding-left: 20px;color: #409eff"><a href="https://topconfig.oss-cn-hangzhou.aliyuncs.com/topexam-studio1.xlsx">导入机构信息模板下载</a></el-col>
      </el-row>
      <el-form
          label-width="120px"
          :model="from"
          label-position="right"
          class="demo-ruleForm"
          center
          :rules="rules"
          ref="inviteForm"
      >
        <el-form-item label="考试名称"  prop="examId" style="width: 400px;">
          <el-select clearable
                     style="width: 250px;"
                     v-model="from.examId"
                     placeholder="考试名称"
                     @change="examChange"
          >
            <el-option
                v-for="item in examList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="文件上传" style="width: 400px;">
          <el-upload
              class="upload-demo"
              ref="upload"
              action="https://jsonplaceholder.typicode.com/posts/"
              :file-list="fileList"
              :limit="1"
              accept=".xlsx,.xls,"
              :on-change="handle"
              :auto-upload="false"
          >
            <el-button slot="trigger" size="small" type="primary">
              上传文件
            </el-button>

            <div slot="tip" class="el-upload__tip">上传机构信息excel文件</div>
          </el-upload>
        </el-form-item>
      </el-form>


      <div slot="footer">
        <el-button @click="showCheck = false">取 消</el-button>
        <el-button type="primary" @click="submitCheck">确 定</el-button>
      </div>
    </el-dialog>
    <!--    删除-->
    <el-dialog
        :visible.sync="delDialog"
        width="50%"

    >
      <div slot="title">管理员验证</div>
      <el-form
          label-width="120px"
          label-position="right"
          class="demo-ruleForm"
          center
          ref="delForm"
          v-loading="loading"
      >
        <p style="color: red;padding-left: 40px">此次操作将删除该机构，并删除该机构下所有学生数据，请谨慎操作!</p>
        <el-form-item label="管理员账号" prop="username" style="margin-bottom: 15px">
          <el-input v-model="admin_username" placeholder="请输入管理员账号"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="admin_password" placeholder="请输入密码"></el-input>
        </el-form-item>


      </el-form>

      <div slot="footer">
        <el-button type="primary"   @click="confirm1">确认</el-button>
      </div>

    </el-dialog>
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
import { apiExamList,apiGetProvinceByExamId,apiGetExamDetails,apiTicketCreate } from '@/api/ticket.js'
export default {
  components: {
    addRoomDialog,
  },
  data() {
    return {
      delDialog:false,
      admin_username:"",
      admin_password:"",
      selectCheck:"",
      showCheck:false,
      listLoading: false,
      checkOptions:[],
      sels: [], //列表选中列
      search: {
        name: "",
        mobilePhone: "",
      },
      gridData:[],
      file: '',
      fileList:[],
      addressList:[],
      from: {
        examId: '', //考试id
        address:'',
      },
      rules: {
        examId: [{ required: true, message: '请输入', trigger: 'blur' }], //考试id
        address: [{ required: true, message: '请输入', trigger: 'blur' }],
      },
      examList: [],
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
      examId:"",
      jg_id:"",
    };
  },
  created() {
     this.getList();
     this.getExamList()
  },

  methods: {
    //一键删除
    oneDel(item){
      this.admin_username="";
      this.admin_password="";
      this.delDialog = true;
      this.jg_id = item.id;
    },
    confirm1(){
      this.loading = true;
      this.$axios.post('/studio/delete?id='+this.jg_id+'&username='+this.admin_username+"&password="+this.admin_password).then(res=>{
        this.loading = false;
        if(res.code == 200){
          this.delDialog = false;
          this.$message.success('删除成功！');
          this.getList();
        }
      })
    },
    handle(file) {
      this.file = file
    },
    addStudio2(){
      this.showCheck = true;
    },
    submitCheck(){
      if(!this.examId){
        this.$message({
          type: 'warning',
          message: '请选择考试!'
        });
        return false;
      }
      this.commit()
    },
    commit(){
      if (!this.file) {
        this.$message({
          message: '请选择上传的文件',
          type: 'error',
        })
        return
      }
      this.$refs.inviteForm.validate((valid) => {
        if (valid) {
          let param = new FormData()
          param.append('file', this.file.raw)
          this.$axios
              .post(
                  `/studio/batchImport?examId=${this.from.examId}`,
                  param,
              )
              .then((res) => {
                if(res.code == 200){
                  this.$message({
                    message: res.result?res.result:"导入成功",
                    type: 'success',
                  })
                  this.from = {
                    examId: '', //考试id
                    address:'',
                  }
                  this.getList()
                }else if(res.code == 500){
                  this.gridData = res.result;
                  this.dialogTableVisible = true;
                }
                this.showCheck = false;


              })
              .catch((error) => {

              })
        } else {
        }
      })
    },
    examChange(value) {
      this.examId = value;
    },
    // 查询考试列表
    getExamList(){
      apiExamList().then(res=>{
        this.examList = res.result
      })
    },
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
              if(res.code == 200){
                that.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              }

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
        size : this.form.pageSize ,
        studioName:this.form.studentName
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
          if (res.code==200) {
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

