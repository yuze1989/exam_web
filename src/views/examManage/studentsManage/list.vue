<template>
  <section class="form_border">
    <div class="header" style="display: block">
      <el-row style="display: flex;justify-content: flex-end">
        <el-select clearable  v-model="forms.examName"  placeholder="请选择考试名称" @change="examNameChange"    style="width: 200px; margin-right: 20px; margin-bottom: 5px">
          <el-option
              v-for="item in examNameOption"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>
        <el-select clearable  v-model="forms.address"  placeholder="请选择考试地址"     style="width: 200px; margin-right: 20px; margin-bottom: 5px">
          <el-option
              v-for="item in addressList"
              :key="item.examAddress"
              :label="item.examAddress"
              :value="item.examAddress">
          </el-option>
        </el-select>

        <el-select clearable
                   v-model="forms.checkStatus"
                   style="width: 200px; margin-right: 20px;margin-bottom: 5px"
                   placeholder="请选择导入状态"
                   @change="changeCheckStatus"
        >
          <el-option
              v-for="(item, index) in checkStatusList"
              :key="index"
              :label="item.name"
              :value="item.id"
          ></el-option>
        </el-select>


        <el-button type="primary" style="margin-left: 20px;height: 40px;" @click="onSubmit">
          查询
        </el-button>
      </el-row>
    </div>


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
      @selection-change="handleSelectionChange"
      ref="multipleTable"
    >


      <el-table-column
        label="考试编号"
        header-align="center"
        align="center"
        prop="examCode"
      ></el-table-column>

      <el-table-column
        label="考试名称"
        header-align="center"
        align="center"
        prop="examName"
      ></el-table-column>

      <el-table-column
        label="考试地址"
        header-align="center"
        align="center"
        maxlength="18"
        prop="examAddress"
      ></el-table-column>

      <el-table-column
        label="导入日期"
        header-align="center"
        align="center"
        maxlength="11"
        prop="importDate"
      ></el-table-column>

      <el-table-column
        label="导入成功数据"
        header-align="center"
        align="center"
        prop="successNum"
      ></el-table-column>

      <el-table-column
        label="导入失败数量"
        header-align="center"
        align="center"
        prop="failNum"
      ></el-table-column>

      <el-table-column
        label="导入失败数据"
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">
          <a :href="scope.row.failUrl" target="_blank" style="color:#409eff;" v-if="scope.row.failUrl != ''">excel下载地址</a>
        </template>
      </el-table-column>
      <el-table-column
        label="导入状态"
        header-align="center"
        align="center"
        prop="importStatusStr"
      ></el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <myPagination
        :current.sync="forms.current"
        :pages.sync="forms.pages"
        :size.sync="forms.size"
        :total.sync="forms.total"
        @cb="currentChange"
      />
    </el-col>

    <el-dialog
        title="批量审核学生信息"
        :visible.sync="dialogVisible" >
      <p style="color: red;margin-top: 0;padding-top: 0">提示：对查询结果中，未审核状态下的学生信息，将全部被审核，审核之前请确认学生信息的准确性。</p>
      <el-select clearable  style="width: 100%;" v-model="selectCheck2" placeholder="请选择">
        <el-option
            v-for="item in checkOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
        ></el-option>
      </el-select>
      <br/>
      <el-input
          style="width: 100%;margin-top: 10px;"
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          v-model="remark2"
      ></el-input>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="disTrue">确 定</el-button>
  </span>
    </el-dialog>

    <!--选择审核修改-->
    <el-dialog title="审核学生信息" :visible.sync="showCheck" center>
      <el-select clearable  style="width: 350px;" v-model="selectCheck" placeholder="请选择">
        <el-option
          v-for="item in checkOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
      <br/>
      <el-input
        style="width: 350px;margin-top: 10px;"
        type="textarea"
        :rows="5"
        placeholder="请输入内容"
        v-model="remark"
      ></el-input>
      <div slot="footer" style="margin-top: 30px;">
        <el-button @click="showCheck = false">取 消</el-button>
        <el-button type="primary" @click="submitCheck">确 定</el-button>
      </div>
    </el-dialog>

    <addDialog
      :visible.sync="isAdd"
      :isAdd="isAddType"
      :editItem="editItemData"
      @addSuccess="addSuccess"
    />
    <importDialog 
      :visible.sync="showImport"
      :editItem="editItemData"
      @addSuccess="addSuccess" />
  </section>
</template>
<script>
import { apiExamList,apiGetProvinceByExamId,apiGetExamDetails,apiTicketCreate } from '@/api/ticket.js'
import addDialog from './addDialog'
import importDialog from './import.vue'
export default {
  components: {
    addDialog,
    importDialog
  },
  data() {
    return {
      examName:"",
      examId:"",
      examNameOption: [],
      dialogVisible:false,
      //新增
      isAddType: true,//true新增 flase修改
      isAdd: false,
      editItemData:{},
      //导入
      showImport: false,
      //审核
      showCheck: false,
      selectCheck: 1,
      selectCheck2: 1,
      remark: '',
      remark2: '',
      checkId: '',
      checkIds: [],
      isCheckMore: false,
      //列表
      list: [],
      listLoading: false,
      selectRoomIds: [],
      forms: {
        current: 1,
        size: 10,
        checkStatus: '', //审核状态:0未审核；1通过；2未通过 ,
        examName: '', //考试名称
        examineeName: '', //考生姓名
        payStatus: '', //支付状态:0未支付；1已支付 ,
        provinceCode: '',
        schoolId: '', // 机构id ,
        source: '', //报名来源:1手机；2后台 ,
        studioName: '', //: 机构名称
        address:""
      },
      checkStatusList: [
        { name: '全部导入状态', id: "" },
        { name: '正在导入', id: 0 },
        { name: '部分成功', id: 1 },
        { name: '成功', id: 2 },
        { name: '失败', id: 3 },
      ],
      payStatusList: [
        { name: '全部支付状态', id: -1 },
        { name: '待支付', id: 1 },
        { name: '支付成功', id: 2 },
        { name: '支付失败', id: 3 },
        { name: '支付处理中', id: 4 },
      ],
      sourceList: [
        { name: '全部来源', id: -1 },
        { name: '手机', id: 1 },
        { name: '后台', id: 2 },
      ],
      checkOptions: [
        { name: '审核通过', id: 1 },
        { name: '审核拒绝', id: 2 },
      ],
      data: { pages: 0, size: 10, total: 0, records: [] },
      users: [],
      isEnableOrder: false,
      dialogTitle: '',
      enbaleItem: {},
      checkItem: {},
      isEdit: false,
      addressList:[],
    }
  },
  created() {
    this.getOrderList()
    this.getExamList()
  },
  methods: {
    // 查询考试列表
    getExamList(){
      apiExamList().then(res=>{
        this.examNameOption = res.result
      })
    },
    // 考试改变监听
    examNameChange(e){
      this.examNameOption.map(item =>{
        if(item.id == e){
          this.forms.examName = item.name
          this.examId = item.id
          this.addressList = [];
          this.getDz()
        }
      })
    },
    getDz(){
      this.$axios.get("/examinfo/detail?id="+this.examId).then((res)=>{
        this.addressList = res.result.addressList;
      })
    },
    // 上传文件
    onImport(file, fileList) {
      this.showImport = true
    },
    // 新增学生
    add() {
      this.isAddType = true
      this.isAdd = true
    },
    //修改学生
    toEditItem(row){
      this.editItemData = row
      this.isAddType = false
      this.isAdd = true
    },
    //点击单个审核
    toshowCheck(row) {
      this.checkId = row.id
      this.showCheck = true
      this.remark = ''
      this.selectCheck = 1
      this.isCheckMore = false
      this.checkIds = []
      this.$refs.multipleTable.clearSelection()
    },
    handleSelectionChange(val) {
      this.checkIds = val
    },
    checkMore() {
      if(!this.checkIds || (this.checkIds&&this.checkIds.length<1)){
        this.$message.error('请选择要审核的学生')
        return
      }
      this.checkId = ''
      this.showCheck = true
      this.remark = ''
      this.selectCheck = 1
      this.isCheckMore = true
    },
    reset() {
      this.forms = {
        current: 1,
        size: 10,
        checkStatus: '', //审核状态:0未审核；1通过；2未通过 ,
        examName: '', //考试名称
        examineeName: '', //考生姓名
        payStatus: '', //支付状态:0未支付；1已支付 ,
        provinceCode: '',
        schoolId: '', // 机构id ,
        source: '', //报名来源:1手机；2后台 ,
        studioName: '', //: 机构名称
      }
      this.getOrderList()
    },
    changeStatus() {},
    changeCheckStatus() {},
    updateList() {
      this.getOrderList()
    },
    currentChange() {
      this.getOrderList()
    },
    getCheckStatusString(item) {
      //审核状态  0:待审核,1:通过,2:拒绝
      switch (item.checkStatus) {
        case 0:
          return '待审核'
          break
        case 1:
          return '审核通过'
          break
        case 2:
          return '审核拒绝'
          break
      }
    },
    getStateString(item) {
      //支付状态 1:待支付,2:成功,3:失败,4:处理
      switch (item.payStatus) {
        case 1:
          return '待支付'
          break
        case 2:
          return '支付成功'
          break
        case 3:
          return '支付失败'
          break
        case 4:
          return '处理中'
          break
      }
    },

    auditItem(scope) {},
    // 订单列表
    getOrderList() {
      this.listLoading = true
      let params = {
        current:this.forms.current,
        size:this.forms.size,
        schoolId:"",
        importStatus:this.forms.checkStatus,
        examId:this.examId,
        examAddress:this.forms.address
      }
      this.$axios
        .post('/exam/import/list', params)
        .then((res) => {
          this.list = res.result.list
          this.forms.pageNum = res.result.pageNum
          this.forms.pageSize = res.result.pageSize
          this.forms.total = res.result.total
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    colseEnable() {
      this.isEnableOrder = false
    },
    onSubmit() {
      this.forms.current = 1
      this.getOrderList()
    },
    oneKey2(){
      this.listLoading =true;
      let data = {
        "checkStatus": this.forms.checkStatus,
        "examId": this.examId,
        "examName": this.forms.examId,
        "examineeName": this.forms.examineeName,
        "payStatus": this.forms.payStatus,
        "provinceCode": "",
        "remark": this.forms.remark2,
        "source": this.forms.source,
        "status": this.selectCheck2,
        "studioName": this.forms.studioName,
        schoolId:"",
      }
      this.$axios
          .post(`/examinee/examineeExport`,data)
          .then((res) => {
            this.listLoading =false;
            if (res.code == 200) {
              const a = document.createElement('a');
              a.setAttribute("download",'')
              a.setAttribute("href",res.result)
              a.click()
            }
          })
          .catch((err) => {
            this.listLoading = false
          })
    },
    disTrue(){
      let data = {
        "checkStatus": this.forms.checkStatus,
        "examId": this.examId,
        "examName": this.forms.examId,
        "examineeName": this.forms.examineeName,
        "payStatus": this.forms.payStatus,
        "provinceCode": "",
        "remark": this.forms.remark2,
        "source": this.forms.source,
        "status": this.selectCheck2,
        "studioName": this.forms.studioName,
      }
      this.$axios
          .post(`/examinee/examineeOneCheck`,data)
          .then((res) => {
            if (res.code == 200) {
              this.$message.success('操作成功')
              this.dialogVisible = false
              this.getOrderList()
              this.selectCheck2 = "1"
              this.forms.remark2 = ''
            }
          })
          .catch((err) => {
            this.listLoading = false
          })
    },
    oneKey(){
      this.dialogVisible = true;
    },
    //审核
    submitCheck() {
      this.$confirm('审核通过后信息不能修改，是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          checkStatus: this.selectCheck,
          remark: this.remark,
        }
        if (this.isCheckMore) {
          params.ids = [...this.checkIds].map((res) => res.id)
        } else {
          params.id = this.checkId
        }
        let api = this.isCheckMore? this.API.studentsManage.examineeBatchCheck: this.API.studentsManage.examineeCheck
        this.$axios
            .post(`${api}`, params)
            .then((res) => {
              if (res.code == 200) {
                this.$message.success('操作成功')
                this.showCheck = false
                this.getOrderList()
                this.checkIds = []
                this.checkId = ''
              }
            })
            .catch((err) => {
              this.listLoading = false
            })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });


    },
    // 删除
    del(row) {
      let that = this
      this.$confirm('删除后学生信息不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          let params = {
            id: row.id,
          }
          that.$axios
            .post(`${this.API.studentsManage.examineeDelete}?id=${row.id}`, {})
            .then((res) => {
              if (res.code == 200) {
                that.$message.success('操作成功')
                that.showCheck = false
                that.getOrderList()
              }
            })
        })
        .catch((err) => {

        })
    },
    addSuccess() {
      this.isAdd = false
      this.showInvite = false
      this.showDel = false
      this.getOrderList()
    },
  },
}
</script>
<style lang="scss" scoped>
@import './orderAccount.scss';
</style>
