<template>
  <section class="form_border">
    <div class="header">
      <el-row>
        <el-col :span="4" style="padding: 10px;padding-top: 15px;">
          <el-button type="primary" @click="fenpei">分配试卷</el-button>
        </el-col>
        <el-col :span="20">
          <el-form :inline="true" class="demo-form-inline" style="padding-top: 15px;
    padding-bottom: 10px;
    display: flex;
    justify-content: flex-end;">

            <el-form-item style="margin-bottom: 0">
              <el-input
                  v-model="forms.model.name"
                  placeholder="考试名称"
              ></el-input>
            </el-form-item>
            <el-form-item style="margin-bottom: 0">
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
        label="id"
        header-align="center"
        align="center"
        prop="id"
      ></el-table-column>

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
        label="阅卷状态"
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">{{scope.row.operStatus==0?'未停止':'停止'}}</template>
      </el-table-column>

      <el-table-column label="操作" header-align="center"    align="center">
        <template slot-scope="scope">
          <div>
            <el-button
              type="text"
              size="small"
              @click="editItemAction(scope.row)"
            >
              <span>上传进度详情</span>
            </el-button>
          </div>
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
    <!-- 分配试卷 -->
    <el-dialog title="分配试卷" :visible.sync="dialogFormVisible" >
      <el-form v-show="fpjd==1">
        <el-form-item label="考试名称" :label-width="formLabelWidth">
          <el-select v-model="examId" placeholder="请选择考试" size="medium" @change="examNameChange">
            <el-option v-for="item in examIdList" :key="item.id" :value="item.id" :label="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考试科目" :label-width="formLabelWidth">
          <el-select v-model="course" style="width:200px;" placeholder="请选择科目" @change="seletChage">
            <el-option
                v-for="item in courseList"
                :key="item.subjectName"
                :label="item.subjectName"
                :value="item.subjectName">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <el-form v-show="fpjd==2">
        <el-form-item label="分配方式" :label-width="formLabelWidth">
          <el-cascader
              v-model="type"
              :options="options"
              :props="{ expandTrigger: 'hover' }"
              @change="modeChange"></el-cascader>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <div v-show="fpjd==1">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="fpjd=2">下一步</el-button>
        </div>
        <div v-show="fpjd==2">
          <el-button @click="fpjd=1">上一步</el-button>
          <el-button type="primary">下一步</el-button>
        </div>
      </div>
    </el-dialog>

  </section>
</template>

<script>
export default {

  data() {
    return {
      dialogFormVisible:false,
      formLabelWidth: '120px',
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      options:[
          {value: '0',label: '按考场分配',
            children: [{value: '0',label: '模式1'}, {value: '1',label: '模式2' }]
          },
        {value: '1',label: '按随机分配',
          children: [{value: '0',label: '模式1'}, {value: '1',label: '模式2' }]
        }
      ],
      fpjd:1,
      type:"",
      mode:"",
      course:"",
      examNameNo:"",
      examName:"",
      examId:"",
      examIdList:[],
      courseList:[],
      list: [],
      checkIds: [],
      listLoading: false,
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
    }
  },

  created() {
    this.getOrderList()
  },
  methods: {
    seletChage(){
      this.$forceUpdate()
    },
    //修改模式
    modeChange(){
      this.getListByKs()
    },
    //获取考试列表
    getKsList(){
      this.$axios
          .post('/ticket/examlist')
          .then((res) => {
            this.examIdList = res.result;
          })
          .catch(() => {});
    },
    // 考试改变监听
    examNameChange(e){
      this.examIdList.map(item =>{
        if(item.id == e){
          this.examNameNo = item.no;
          this.examId = item.id;
          this.examName = item.name;
          this.courseList = [];
          this.course = ""
          this.getExamDetails()

        }
      })
    },
    //分配查询
    getListByKs(){
      let data = {
        "course": this.course,
        "current": 1,
        "examCode": this.examNameNo,
        "provinceCode": "",
        "schoolId": "",
        "size": 10
      }
      this.$axios.post(
          '/exampaper/examDistributionPaper',data
      ).then(res=>{
        this.courseList = res.result;
      })
    },
    // 查询考试下的科目
    getExamDetails(){
      this.$axios.get(
          '/examsubject/listByExamId?examId='+this.examId
      ).then(res=>{
        this.courseList = res.result;
      })
    },
    //分配试卷
    fenpei(){
      this.getKsList()
      this.dialogFormVisible = true;
    },
    //去查询联合考试状态
    // 新增
    add() {
      this.isAddType = 1
      this.isAdd = true
    },
    editItemAction(item) {
      this.$router.push({name:'eaxmUpLoad',params:{'id':item.examCode}})
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
      // examType (integer, optional): 考试类型:0、画室考试;1、联合考试;2、线下考试 ,
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
        name: this.forms.model.name,
        "course": "",
        "provinceCode": "",
        "schoolId": "",
        "teacherName": ""
      }
      this.$axios
        .post('/exampaper/examDistributionPaperList', params)
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
      console.log(item)
      this.editItemData = item
      this.showDel = true
    }
  },
}
</script>
<style lang="scss" scoped>
//@import './orderAccount.scss';
</style>
