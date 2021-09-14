<template>
  <section class="form_border">
    <div class="header">
      <el-row style="padding:15px 0 0 10px">
        各科目试卷上传进度
      </el-row>
      <el-row style="padding: 10px">
        <el-col v-for="(item,index) in gradeList" :key="index" :span="4" style="padding: 0 5px;margin-bottom:10px;padding-top: 20px">
          <div class="grade" style="position: relative">
            <div class="label" style="position:absolute;z-index: 99;font-size: 14px;left: 0px;top: -26px;">{{item.course}} <span style="font-size: 12px;color:#82848a;">(已上传：{{item.countNum}})</span></div>
            <el-progress   :percentage="Math.ceil((item.countNum/(item.countAllNum==0?1:item.countAllNum))*100)"></el-progress>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" style="padding: 10px;margin-top: 5px;">
          <el-button type="primary" class="meiyuan_btn" @click="stop" style="float: left">停止阅卷</el-button>
        </el-col>
        <el-col :span="20">
          <el-form :inline="true" class="demo-form-inline" style="    padding-top: 15px;
    padding-bottom: 10px;
    display: flex;
    justify-content: flex-end;">
<!--                    <el-form-item>-->
<!--                      <el-select clearable -->
<!--                          v-model="forms.model.provinceCode"-->
<!--                          placeholder="生源省份"-->
<!--                          value-key="province"-->
<!--                          clearable-->
<!--                          filterable-->
<!--                      >-->
<!--                        <el-option-->
<!--                            v-for="item in options"-->
<!--                            :key="item.provinceCode"-->
<!--                            :label="item.province"-->
<!--                            :value="item"-->
<!--                        ></el-option>-->
<!--                      </el-select>-->
<!--                    </el-form-item>-->
<!--                    <el-form-item>-->
<!--                      <el-input v-model.trim="forms.model.userName" placeholder="机构名称"/>-->
<!--                    </el-form-item>-->
            <el-form-item>
              <el-input
                  v-model="admissionTicketCode"
                  placeholder="请输入准考证"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>

          </el-form>
        </el-col>

      </el-row>

    </div>
    <!-- 导入 导出 -->
    <!--列表-->
    <el-table
      :data="list"
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
        label="考试编码"
        header-align="center"
        align="center"
        prop="examCode"
      ></el-table-column>

      <el-table-column
        label="考试名称"
        header-align="center"
        align="center"
        prop="name"
      ></el-table-column>

      <el-table-column
          label="机构编号"
          header-align="center"
          align="center"
          prop="studioCode"
      ></el-table-column>

      <el-table-column
          label="机构名称"
          header-align="center"
          align="center"
          prop="studioName"
      ></el-table-column>

      <el-table-column
          label="准考证"
          header-align="center"
          align="center"
          prop="admissionTicketCode"
      ></el-table-column>

      <el-table-column
          label="考场"
          header-align="center"
          align="center"
          prop="examinationRoomCode"
      ></el-table-column>
      <el-table-column
          label="省份"
          header-align="center"
          align="center"
          prop="province"
      ></el-table-column>


      <div v-if="courseName.length>0">
        <el-table-column v-for="(item, index) in courseName" :label="item.course" header-align="center" align="center">
          <template slot-scope="scope">
            <el-image
                v-if="scope.row.subjectMap[item.course]"
                style="width: 100px; height: 100px"
                :src="scope.row.subjectMap[item.course]"
                :preview-src-list="[scope.row.imgSubjectMap[item.course]]">
            </el-image>
          </template>
        </el-table-column>
      </div>

    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <myPagination
        :current.sync="forms.current"
        :pages.sync="data.pages"
        :size.sync="forms.pageSize"
        :total.sync="data.total"
        @cb="currentChange"
      />
    </el-col>

    <el-dialog
        :visible.sync="dialogFormVisible"
        width="50%"
        center

    >
      <div slot="title">管理员验证</div>
      <el-form
          label-width="120px"
          label-position="right"
          class="demo-ruleForm"
          center
          ref="delForm"
      >
        <p style="    text-align: center;
    color: red;
    font-size: 20px;
    padding: 0;
    margin: 0;
    margin-bottom: 15px;">停止阅卷之前，请确认试卷上传已完成！</p>
        <el-form-item label="管理员账号" prop="username" style="margin-bottom: 15px">
          <el-input v-model="admin_username" placeholder="请输入管理员账号"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="admin_password" placeholder="请输入密码"></el-input>
        </el-form-item>


      </el-form>

      <div slot="footer">
        <el-button type="primary"   v-loading="loading" @click="confirm1">确认</el-button>
      </div>
    </el-dialog>

  </section>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      checkIds: [],
      listLoading: false,
      dialogFormVisible:false,
      admissionTicketCode:"",
      admin_username:"",
      admin_password:"",
      forms: {
        current: 1,
        pageSize: 10,
        model: {
          name: '',
          examStatus: -1, //0、未开始;1、正在进行;2、结束考试
        },
      },
      gradeList:[],
      status: [
        { name: '同意', id: 1 },
        { name: '拒绝', id: 2 },
        { name: '禁用 ', id: 3 },
      ],
      examStatus: [
        { name: '全部考试状态', id: -1 },
        { name: '未开始', id: 0 },
        { name: '正在进行', id: 1 },
        { name: '结束考试', id: 2 },
      ],
      data: { pages: 0, pageSize: 10, total: 0, records: [] },
      dialogTitle: '',
      isAdd: false, //展示弹窗
      isAddType: 1, //1新增  0编辑
      showInvite: false, //邀请弹窗
      showDel: false,//删除弹窗
      editItemData: {
        name: '',
        id: 0,
      },
      courseName:[],
      loading:false,
    }
  },
  created() {
    this.getOrderList()
    this.getGrade()
  },
  methods: {
    saveRule(){},
    confirm1(){
      if(this.admin_username == "" || this.admin_password == ""){
        this.$message.error('请先确认管理员账号与密码！');
        return false;
      }
      let data = {
        examId:this.$route.query.examId,
        loginUser:this.admin_username,
        password:this.admin_password

      }

      if(!this.loading){
        this.loading = true;
        this.$axios.post('/exampaper/stopMarking',data)
            .then((res)=>{
              this.dialogFormVisible = false;
              this.admin_username = "";
              this.admin_password = "";
              if(res.code == 200){
                this.$message({
                  type: "success",
                  message: "成功",
                });
              }

              this.loading = false;
            })
      }


    },
    stop(){
      this.dialogFormVisible = true;
    },
    //查询进度
    getGrade(){
      this.$axios
          .post('/exampaper/uploadProgress', {
            examId: this.$route.query.examId,
          })
          .then((res) => {
            this.gradeList = res.result
          })
          .catch(() => {
            // this.listLoading = false
          })
    },
    // 新增
    add() {
      this.isAddType = 1
      this.isAdd = true
    },
    editItemAction(item) {
      this.$router.push({ name: 'TeacherExamList', params: {
        examId: item.id
      }})
      this.$router.push("/teacherExamList")
    },
    toShowInvite(item) {
      this.editItemData = item
      this.showInvite = true
    },
    addSuccess() {
      this.isAdd = false
      this.showInvite = false
      this.showDel = false
      this.getOrderList()
    },
    reset() {
      ;(this.forms.model = {
        name: '',
        examStatus: -1,
      }),
        (this.forms.current = 1)
      this.getOrderList()
    },
    changeStatus() {},
    changeCheckStatus() {},
    getStateString(item) {
      // examType (integer, optional): 考试类型:0、机构考试;1、联合考试;2、线下考试 ,
      // examTypeStr 联合考试状态:-1,表示自己建的联合考试;0、未确认;1、同意;2、拒绝;3、禁用
      if(item.examType == 1){
        switch (item.status) {
          case 0:
            return '未确认'
            break
          case 1:
            return '同意'
            break
          case 2:
            return '拒绝'
            break
          case 3:
            return '禁用'
            break
        }
      }else{
        return ''
      }
    },
    updateList() {
      this.getOrderList()
    },
    currentChange() {
      this.getOrderList()
    },
    auditItem(scope) {},
    // 订单列表
    getOrderList() {
      this.listLoading = true
      let params = {
        current: this.forms.current,
        size: this.forms.pageSize,
        operStatus : 0,
        examId: this.$route.query.examId,
        examCode:this.$route.query.id,
        admissionTicketCode:this.admissionTicketCode
      }
      this.$axios
        .post('/exampaper/exampaperList', params)
        .then((res) => {
          this.list = res.result.list[0].examPaperVoList
          this.data = res.result;
          this.courseName = res.result.list[0].courseName
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    onSubmit() {
      this.forms.current = 1
      this.getOrderList()
    },
    // 1:通过,2:拒绝
    enbaleItemAction(item, status) {
      this.$axios
        .post(`${this.API.examinfo.union}`, {
          status,
          id: item.id,
        })
        .then((res) => {
          if(res.code == 200){
            this.$message.success('操作成功')
          }
          this.forms.current = 1
          this.getOrderList()
        })
        .catch((err) => {
          this.listLoading = false
        })
    },
    //删除
    del(item){

      this.editItemData = item
      this.showDel = true
    }
  },
}
</script>
<style lang="scss" scoped>
.el-form-item{
  margin-bottom: 0;
}
//@import './orderAccount.scss';
</style>
