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
              <el-select clearable  v-model="examName"  placeholder="请选择考试名称" @change="examNameChange">
                <el-option
                    v-for="item in examNameOption"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
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
          label="阅卷老师姓名"
          header-align="center"
          align="center"
          prop="teacherName"
      ></el-table-column>

      <el-table-column
          label="试卷数量"
          header-align="center"
          align="center"
          prop="paperNum"
      ></el-table-column>

      <el-table-column label="操作" header-align="center"    align="center">
        <template slot-scope="scope">
          <div>
            <el-button
              type="text"
              size="small"
              @click="editItemAction(scope.row)"
            >
              <span>查看</span>
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
          <el-select clearable  v-model="examId" placeholder="请选择考试" size="medium" @change="examNameChange">
            <el-option v-for="item in examIdList" :key="item.id" :value="item.id" :label="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考试科目" :label-width="formLabelWidth">
          <el-select clearable  v-model="course" style="width:200px;" placeholder="请选择科目" @change="seletChage">
            <el-option
                v-for="item in courseList"
                :key="item.subjectName"
                :label="item.subjectName"
                :value="item.subjectName">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <el-form v-show="fpjd==2" v-loading="loading">
        <el-form-item label="分配方式" :label-width="formLabelWidth">
          <el-cascader
              v-model="type"
              :options="options"
              :props="{ expandTrigger: 'hover' }"
              @change="modeChange"></el-cascader>
        </el-form-item>
        <el-row   v-if="type[0]==0">
          <el-col :span="6">
            总共考场数：{{examinationRoomNum}}
          </el-col>
          <el-col :span="6">
            已分配考场数：{{ assignedExaminationNum  }}
          </el-col>
          <el-col :span="6">
            待分配考场数：{{ noAssignedExaminationNum  }}
          </el-col>
        </el-row>
        <el-row   v-if="type[0]==1">
          <el-col :span="6">
            总共试卷数：{{dataA.result.examinationPaperNum}}
          </el-col>
          <el-col :span="6">
            未分配试卷数：{{ all_no  }}
          </el-col>
        </el-row>
        <el-table
            v-if="type[0]==0"
            :data="tableData"
            style="width: 100%">
          <el-table-column
              prop="teacherName"
              label="老师"
              width="180"
          >
          </el-table-column>
          <el-table-column
              label="考场"
              width="280">
            <template slot-scope="scope">
              第<el-select clearable  style="width:70px;"  v-model="scope.row.start"  placeholder="" clearable @change="selkc(scope.row, 'start')">
              <el-option
                  v-for="item in roomList"
                  :key="item.examinationRoomCode"
                  :label="item.examinationRoomCode"
                  :value="item.examinationRoomCode">
              </el-option>
            </el-select>
              至
              <el-select clearable  style="width:70px;"  v-model="scope.row.end"  placeholder="" clearable @change="selkc(scope.row, 'end')">
                <el-option
                    v-for="item in roomList"
                    :key="item.examinationRoomCode"
                    :label="item.examinationRoomCode"
                    :value="item.examinationRoomCode">
                </el-option>
              </el-select>
              考场
            </template>
          </el-table-column>
          <el-table-column
              label="人数">
            <template slot-scope="scope">
                <span> {{scope.row.people}}人</span>
            </template>
          </el-table-column>
          <el-table-column
              label="未分配试卷数量  ">
            <template slot-scope="scope">
              <span> {{scope.row.paper}}张</span>
            </template>
          </el-table-column>
        </el-table>
        <el-table
            v-if="type[0]==1"
            :data="tableData"
            style="width: 100%">
          <el-table-column
              prop="teacherName"
              label="老师"
              width="180"
          >
          </el-table-column>
          <el-table-column
              label="数量">
            <template slot-scope="scope">
              <span v-if="type[1]==0">考卷数量 {{dataA.result.noExamPaperNumCount}}</span>
              <span v-if="type[1]==1">考卷数量 <el-input type="number" min="0" v-model="scope.row.num" style="width: 150px"></el-input></span>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <div v-show="fpjd==1">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="get_ms">下一步</el-button>
        </div>
        <div v-show="fpjd==2">
          <el-button @click="fpjd=1">上一步</el-button>
          <el-button type="primary" @click="tijiao">确定</el-button>
        </div>
      </div>
    </el-dialog>

<!--    查看-->
    <el-dialog title="查看" :visible.sync="dialogTableVisible2">
      <el-table :data="sj_list"
                v-infinite-scroll="load"
                infinite-scroll-disabled="disabled">
        <el-table-column prop="admissionTicketCode" label="准考证" width="250"></el-table-column>
        <el-table-column prop="province" label="省份" width="200"></el-table-column>
        <el-table-column prop="examinationRoomCode" label="考场"></el-table-column>
        <el-table-column label="操作" header-align="center"    align="center">
          <template slot-scope="scope">

            <div>
              <el-button
                  type="text"
                  size="small"
                  @click="ddd(scope.row.img)"
              >
                <span>查看试卷</span>
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <p v-if="loading">加载中...</p>
      <p v-if="noMore">没有更多了</p>
      <el-dialog
          width="50%"
          title="试卷图"
          :visible.sync="innerVisible"
          append-to-body>
        <img :src="fd_img" alt="" style="width: 100%">
      </el-dialog>
    </el-dialog>

  </section>
</template>

<script>
import { apiExamList,apiGetProvinceByExamId,apiGetExamDetails,apiTicketCreate } from '@/api/ticket.js'
export default {

  data() {
    return {
      fd_img:"",
      count: 10,
      examNameOption: [],
      dialogFormVisible:false,
      formLabelWidth: '120px',
      outerVisible: false,
      innerVisible: false,
      all_no:0,
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
            children: [{value: '0',label: '一张试卷被一位老师阅卷'}, {value: '1',label: '一张试卷被选中老师阅卷' }]
          },
        {value: '1',label: '按随机分配',
          children: [{value: '0',label: '一张试卷被一位老师阅卷'}, {value: '1',label: '一张试卷被选中老师阅卷' }]
        }
      ],
      fpjd:1,
      type:"",
      mode:"",
      course:"",
      examNameNo:"",
      examName:"",
      dialogTableVisible2:false,
      sj_list:[],
      examId:"",
      examIdList:[],
      courseList:[],
      roomList:[],
      paperList:[],
      list: [],
      loading:false,
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
      aaDate:[],
      tableData:[],
      dataA:"",
      noAssignedExaminationNum:0,
      assignedExaminationNum:0,
      examinationRoomNum:0,
      total:0,
      current:1,
      a:"",
      b:"",
      c:true,
    }
  },
  computed: {
    noMore () {
      return this.count >= this.total;
    },
    disabled () {
      return this.loading || this.noMore
    }
  },
  created() {
    this.getOrderList()
    this.getExamList()
  },
  methods: {
    load() {
      // this.loading = true
      // if(this.c){
      //   this.c = false;
      //   this.current++;
      //   let data = {
      //     "current": this.current,
      //     "examId": this.a,
      //     "teacherId": this.b,
      //     "schoolId": "",
      //     "size": 20
      //   }
      //   this.$axios.post('/exampaper/examDistributionPaperQuer',data).then((res)=>{
      //     this.sj_list += res.result.list;
      //     this.loading = false;
      //     this.c = true;
      //   })
      // }

    },
    ddd(img){
      this.fd_img = img;
      this.innerVisible = true;
    },
    // 查询考试列表
    getExamList(){
      apiExamList().then(res=>{
        this.examNameOption = res.result
      })
    },
    // 考试改变监听
    examNameChange(e){
      if(e == ""){
        this.forms.model.name = ""
        this.examId = ""
      }else{
        this.examNameOption.map(item =>{
          if(item.id == e){
            this.forms.model.name = item.name
            this.examId = item.id
            this.examNameNo = item.no
            this.course = ""
            this.getExamDetails()
          }
        })

      }

    },
    get_ms(){

      if(this.course && this.examNameNo){
        this.getListByKs()
        this.loading = true;
        this.fpjd=2;
      }else{
        this.$message({
          message: '请先选择考试与科目！',
          type: 'warning'
        })
      }

    },
    selkc(row, type) {
      // 如果考场的号码为随机数, 那么可以根据考场的号码 从考场列表中获取index
      let n = 0
      let n1 = 0
      // let num = +this.aaDate[0].examCode // examCode
      let num = 1 // examCode
      num = num - 1
      if (row.start && row.end && +row.end < +row.start) {
        this.$message({
          message: '考场号码大的应该放在后面',
          type: 'warning'
        })
        row[type] = ''
        return false
      } else if (row.start && row.end && +row.end == +row.start) {
        n = this.roomList[+row.start - 1 - num].examinationRoomNum
        n1 = this.paperList[this.roomList[+row.start - 1 - num].examinationRoomCode]
      } else if(row.start && row.end && +row.end > +row.start){
        for (let i = (+row.start - 1 - num); i < (+row.end - num); i++) {
          n += this.roomList[i].examinationRoomNum
          n1 += this.paperList[this.roomList[i].examinationRoomCode]
        }

      }
      row.people = n
      row.paper = n1;

    },
    tijiao(){
      let data=[]



      let url = ""
      if(this.type[0] == 0){
        url="/exampaper/examDistributionPatternOne"
        let ddtype = "";
        let max = "";
        let isF = true;
        if(this.type[1] == 0){
          ddtype = 1;
          this.tableData.forEach((item,index)=>{
            if(item.start && item.end){
              if(index > 0){
                if(item.start <= max){
                  this.$message.error('考场不能重复！')
                  isF = false;
                  return false
                }
              }
              max = item.end;
            }

          })
          if(!isF){
            return false;
          }
        }else if(this.type[1] == 1){
          ddtype = 2;
        }
        this.tableData.forEach((item,index)=>{
          if(item.start && item.end){
            data.push({
              examCode:this.examNameNo,
              examId: this.examId,
              subject:this.course,
              erMin:item.start,
              erMax:item.end,
              teacherId:item.teacherId,
              modeType:ddtype,
            })
          }

        })
      }else if(this.type[0] == 1){
        url="/exampaper/examDistributionRandomOne"
        if(this.type[1] ==0){
          this.tableData.forEach((item,index)=>{
            data.push({
              examCode:this.examNameNo,
              examId: this.examId,
              subject:this.course,
              erNum:this.dataA.result.examinationPaperNum,
              teacherId:item.teacherId,
              modeType:1
            })
          })
        }else if(this.type[1] == 1){
          this.tableData.forEach((item,index)=>{
            data.push({
              examCode:this.examNameNo,
              examId: this.examId,
              subject:this.course,
              erNum:item.num,
              teacherId:item.teacherId,
              modeType:2
            })
          })
        }

      }
      if(data.length > 0){
        this.$axios.post(url,data).then((res)=>{
          if(res.code == 200){
            this.$message.success('操作成功')
            this.dialogFormVisible = false;
            this.fpjd = 1;
            this.examId = "";
            this.course = "";
          }
        })
      }

    },
    seletChage(){
      this.$forceUpdate()
    },
    //修改模式
    modeChange(){
      if(this.type[0] == 0){
        let res = this.dataA;
        //考场
        this.tableData = res.result.teacherName;
        this.aaDate = [];
        this.tableData.forEach((item,index)=>{
          this.aaDate.push({
            teacherId:"",
            start:"",
            end:"",
            peopleCount:0
          })
        })
        this.roomList = res.result.examinationRoomCode;
        this.paperList = res.result.noExamPaperNum;
      }else if(this.type[0] == 1){
        //随机
      }
    },
    //获取考试列表
    getKsList(){
      let data ={

      }
      this.$axios
          .post('/ticket/examlist?archiveStatus=0')
          .then((res) => {
            this.examIdList = res.result;
          })
          .catch(() => {});
    },

    //分配查询
    getListByKs(){
      let data = {
        "course": this.course,
        "current": 1,
        "examId": this.examId,
        "provinceCode": "",
        "schoolId": "",
        "size": 10
      }
      this.$axios.post(
          '/exampaper/examDistributionPaper',data
      ).then(res=>{
        this.dataA = res;
        this.loading = false;
        this.assignedExaminationNum = res.result.assignedExaminationNum;
        this.examinationRoomNum = res.result.examinationRoomNum;
        this.noAssignedExaminationNum = res.result.noAssignedExaminationNum;
        this.type = ""
        console.log(this.type);
        let all = 0 ;
        for(let key in res.result.noExamPaperNum){
          all += res.result.noExamPaperNum[key]
        }
        // this.all_no = all;
        this.all_no = res.result.noExamPaperNumCount;

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
      this.fpjd=1;
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
      // this.$router.push({name:'eaxmUpLoad',params:{'id':item.examCode}})
      this.a =item.examId;
      this.b = item.teacherId;
      let data = {
        "current": 1,
        "examId": item.examId,
        "teacherId": item.teacherId,
        "schoolId": "",
        "size": 1000,
      }
      this.$axios.post('/exampaper/examDistributionPaperQuer',data).then((res)=>{
        this.sj_list = res.result.list;
        this.dialogTableVisible2 = true;
        this.total =res.result.total;
      })
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
        name: this.forms.model.name,
        examId:this.examId,
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
