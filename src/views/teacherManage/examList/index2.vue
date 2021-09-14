<template>
  <section class="form_border">
    <div class="header">
      <el-col :span="4">
        <el-button type="primary" @click="dialogFormVisible=true">关联阅卷老师</el-button>
      </el-col>
      <el-col :span="20"  style="padding-bottom: 10px">
        <el-form :inline="true" class="demo-form-inline" style="display: flex;justify-content: flex-end">
          <el-form-item style="margin-bottom: 0">
            <el-input
                v-model="teacherName"
                placeholder="教师姓名"
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-bottom: 0">
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <!--            <el-button type="warning" @click="reset">重置</el-button>-->
          </el-form-item>
        </el-form>
      </el-col>
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
        label="教师账号"
        header-align="center"
        align="center"
        prop="loginCode"
      ></el-table-column>

      <el-table-column
        label="教师姓名"
        header-align="center"
        align="center"
        prop="userName"
      ></el-table-column>

      <el-table-column
        label="角色"
        header-align="center"
        align="center"
        prop="role"
      >
      </el-table-column>
      <el-table-column
          label="关联考试名称"
          header-align="center"
          align="center"
          prop="examName"
      ></el-table-column>
      <el-table-column
          label="考试科目"
          header-align="center"
          align="center"
          prop="subjectName"
      ></el-table-column>
      <el-table-column
          fixed="right"
          align="center"
          label="操作"
          width="200">
        <template slot-scope="scope">
          <el-button @click="bindEidt(scope.row)" type="text" size="small" >删除</el-button>
        </template>
      </el-table-column>
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

<!--    教师关联-->
    <el-dialog title="阅卷教师关联" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="选择教师">
          <el-select clearable  v-model="examNameNo" filterable collapse-tags style="display: flex;margin-left:50px;" placeholder="请选择教师" multiple>
            <el-option
                v-for="item in teacherList"
                :key="item.id"
                :label="item.userName"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择科目">
          <el-checkbox-group v-model="checkList">
            <el-checkbox v-for="item in courseList" :label="item.subjectName"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </div>
    </el-dialog>

    <addDialog
      :visible.sync="isAdd"
      :isAdd="isAddType"
      :editItem="editItemData"
      @addSuccess="addSuccess"
    />

    <deleteDialog
      :visible.sync="showDel"
      :editItem="editItemData"
      @addSuccess="addSuccess"
    />

    <inviteDialog 
      :visible.sync="showInvite"
      :editItem="editItemData"
      @addSuccess="addSuccess" />
  </section>
</template>
<!-- 
    id (integer, optional): id ,
    no (string, optional): 考试编码 ,
    name (string, optional): 考试名称 ,
    examType (integer, optional): 考试类型:0、机构考试;1、联合考试;2、线下考试 ,
    examTypeStr (string, optional): 考试类型:0、机构考试;1、联合考试;2、线下考试 ,
    examStatus (integer, optional): 考试状态:0、未开始;1、正在进行;2、结束考试 ,
    examStatusStr (string, optional): 考试状态:0、未开始;1、正在进行;2、结束考试 ,
    examStartTime (string, optional): 考试开始时间 ,
    examEndTime (string, optional): 考试结束时间 ,
    status (integer, optional): 联合考试状态:-1,表示自己建的联合考试;0、未确认;1、同意;2、拒绝;3、禁用
    archiveStatus (integer, optional): 归档状态:0、未归档;1、已归档 ,
    buyNum (integer, optional): 实际购买人数 ,
    createTime (string, optional): 创建时间 ,
    enterNum (integer, optional): 报名人数 ,
    -->
<!--
    ? 1.要显示操作联合考试,怎么判断是否需要操作 showDel
    ? 2.设计稿只有一个列表, POST /examinfo/list /examinfo/unionExamList查询本机构下联合考试 是不是还有一个页面 
    -->
<script>
import addDialog from './addDialog'
import inviteDialog from './inviteDialog'
import deleteDialog from "./deleteDialog"
export default {
  components: {
    addDialog,
    inviteDialog,
    deleteDialog
  },
  data() {
    return {
      list: [],
      checkIds: [],
      listLoading: false,
      dialogFormVisible:false,
      examNameNo:"",
      teacherName:"",
      forms: {
        current: 1,
        pageSize: 10,
        model: {
          name: '',
          examStatus: -1, //0、未开始;1、正在进行;2、结束考试
        },
      },
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
      courseList:[],
      checkList:[],
      teacherList:[]
    }
  },

  created() {
    this.getOrderList()
    this.getExamDetails()
    this.getTeacher()
  },
  methods: {
    bindEidt(row){
      this.$axios.post('/teacher/examTeacherDelete?examId='+this.$route.query.examId+"&id="+row.id)
          .then((res) => {
            this.$message.success('操作成功')
            this.getOrderList()
          })
          .catch(() => {

          })
    },
    edit(){
      let data={
        "examId": this.$route.query.examId,
        "subjectList": this.checkList,
        "teacherIds": this.examNameNo
      }
      if(data.subjectList.length == 0){
        this.$message.error('请先选择关联的科目！')
        return false;
      }
      this.$axios.post('/teacher/relationTeacher',data)
          .then((res) => {
            this.$message.success('操作成功')
            this.checkList = [];
            this.examNameNo = [];
            this.getOrderList()
            this.dialogFormVisible = false
          })
          .catch(() => {
            this.dialogFormVisible = false
          })

    },
    //去查询联合考试状态
    // 查询考试下的科目
    getExamDetails(){
      this.$axios.get(
          '/examsubject/listByExamId?examId='+this.$route.query.examId
      ).then(res=>{
        this.courseList = res.result;

      })
    },
    //获取教师列表
    getTeacher(){
      let data = {
        "current": 1,
        "examId": "",
        "provinceCode": "",
        "roleId": "",
        "schoolId": "",
        "size": 100,
        "teacherName": "",
        roleTypeList :[1,3]
      }
      this.$axios.post(
          '/teacher/list',data
      ).then(res=>{
        this.teacherList = res.result.list;

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
      // this.$router.push("/teacherExamList")
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
        pageSize: this.forms.pageSize,
        examId:this.$route.query.examId,
        teacherName:this.teacherName
      }
      this.$axios
        .post('/teacher/examTeacherList', params)
        .then((res) => {
          this.list = res.result.list
          this.data = res.result
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
          this.$message.success('操作成功')
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
@import './orderAccount.scss';
</style>
