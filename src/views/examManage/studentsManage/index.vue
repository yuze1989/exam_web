<template>
  <section class="form_border">
    <div class="header" style="display: block">
      <!-- checkStatus:'',//审核状态:0未审核；1通过；2未通过 ,
        examName:'',//考试名称 
        examineeName: '',//考生姓名
        payStatus: '',//支付状态:0未支付；1已支付 ,
        provinceCode:'',
        schoolId:'',// 机构id ,
        source:'',//报名来源:1手机；2后台 ,
        studioName:'',//: 机构名称 -->
      <el-row style="display: flex;justify-content: flex-end">
        <el-select clearable  v-model="forms.examName"  placeholder="请选择考试名称" @change="examNameChange"    style="width: 200px; margin-right: 20px; margin-bottom: 5px">
          <el-option
              v-for="item in examNameOption"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>
        <el-input
            style="width: 200px; margin-right: 20px; margin-bottom: 5px"
            v-model="forms.examineeName"
            placeholder="姓名"
        ></el-input>

        <el-input
            style="width: 200px; margin-right: 20px;margin-bottom: 5px"
            v-model="forms.studioName"
            placeholder="机构名称"
        ></el-input>


        <el-select clearable
                   v-model="forms.checkStatus"
                   style="width: 200px; margin-right: 20px;margin-bottom: 5px"
                   placeholder="审核状态"
                   @change="changeCheckStatus"
        >
          <el-option
              v-for="(item, index) in checkStatusList"
              :key="index"
              :label="item.name"
              :value="item.id"
          ></el-option>
        </el-select>

        <el-select clearable
                   v-model="forms.payStatus"
                   style="width: 200px; margin-right: 20px;"
                   placeholder="支付状态"
                   @change="changeStatus"
        >
          <el-option
              v-for="(item, index) in payStatusList"
              :key="index"
              :label="item.name"
              :value="item.id"
          ></el-option>
        </el-select>

        <el-select clearable
                   v-model="forms.source"
                   style="width: 200px; margin-right: 20px;"
                   placeholder="报名来源"
                   @change="changeStatus"
        >
          <el-option
              v-for="(item, index) in sourceList"
              :key="index"
              :label="item.name"
              :value="item.id"
          ></el-option>
        </el-select>
        <el-button type="primary" style="margin-left: 20px;height: 40px;" @click="onSubmit">
          查询
        </el-button>
        <el-button type="primary" style="height: 40px;" @click="oneKey2">导出学生信息</el-button>

      </el-row>
      <el-row style="margin-top: 6px;margin-bottom: 0px;display:block;justify-content: flex-start">
        <!--      <el-button type="warning" @click="reset">重置</el-button>-->
        <el-button type="primary" @click="add">新增学生信息</el-button>
        <el-button type="primary" @click="onImport">批量导入</el-button>
        <el-button type="primary" @click="checkMore">批量审核</el-button>
        <el-button type="primary" @click="oneKey">一键审核</el-button>
      </el-row>
    </div>

    <!-- 导入 导出 -->
    <!-- <div class="export-box">
      <el-upload
        :action="this.API.upload"
        class="upload"
        :limit="1"
        accept=".xls, .xlsx"
        :http-request="onImport"
        :file-list="[]"
      >
        <el-button size="small" type="primary">批量导入报名信息</el-button>
      </el-upload>
    </div> -->

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
        type="selection"
        label="考试编码"
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
        label="姓名"
        header-align="center"
        align="center"
        prop="name"
      ></el-table-column>

      <el-table-column
        label="身份证号"
        header-align="center"
        align="center"
        maxlength="18"
        prop="identification"
      ></el-table-column>

      <el-table-column
        label="手机号码"
        header-align="center"
        align="center"
        maxlength="11"
        prop="mobile"
      ></el-table-column>

      <el-table-column
        label="机构编码"
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
        label="报名费用"
        header-align="center"
        align="center"
        prop="price"
      >
        <template slot-scope="scope">
          <span>{{ (scope.row.price).toFixed(2) }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="支付状态"
        header-align="center"
        align="center"
        prop="payStatusStr"
      ></el-table-column>

      <el-table-column
        label="报名来源"
        header-align="center"
        align="center"
        prop="sourceStr"
      ></el-table-column>

      <!-- <el-table-column label="支付状态" header-align="center" align="center">
        <template slot-scope="scope">
          <span>{{ getStateString(scope.row) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="报名来源" header-align="center" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.source == 2 ? '后台' : '手机' }}</span>
        </template>
      </el-table-column> -->

      <el-table-column label="照片" header-align="center" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.url" style="width: 50px; height: 50px;" />
        </template>
      </el-table-column>

      <el-table-column
        label="审核状态"
        header-align="center"
        align="center"
        prop="checkStatusStr"
      ></el-table-column>

      <!-- <el-table-column label="审核状态" header-align="center" align="center">
        <template slot-scope="scope">
          <span>{{ getcheckStatusString(scope.row) }}</span>
        </template>
      </el-table-column> -->

      <!-- //审核状态  0:待审核,1:通过,2:拒绝 支付状态 1:待支付,2:成功,3:失败,4:处理 -->
      <el-table-column
        label="操作"
        width="180"
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.checkStatus == 0 && scope.row.payStatus == 2"
            type="text"
            size="small"
            @click="toshowCheck(scope.row)"
          >
            审核
          </el-button>
          <el-button
            v-if="scope.row.checkStatus == 0 && scope.row.payStatus == 2"
            type="text"
            size="small"
            @click="toEditItem(scope.row)"
          >
            修改
          </el-button>
          <el-button
            v-if="scope.row.checkStatus == 0 && scope.row.payStatus == 2"
            type="text"
            size="small"
            @click="del(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
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
      <div v-loading="listLoading">
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
            maxlength="50"
            show-word-limit
        ></el-input>
      </div>
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
        maxlength="50"
        show-word-limit
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
      },
      checkStatusList: [
        { name: '全部审核状态', id: "" },
        { name: '待审核', id: 0 },
        { name: '审核通过', id: 1 },
        { name: '审核拒绝', id: 2 },
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
      daochu:{},
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
      this.examId = ""
      this.forms.examName = ""
      this.examNameOption.map(item =>{
        if(item.id == e){
          this.forms.examName = item.name
          this.examId = item.id
        }
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
        ...this.forms,
        checkStatus:
          this.forms.checkStatus == -1 ? null : this.forms.checkStatus,
        payStatus: this.forms.payStatus == -1 ? null : this.forms.payStatus,
        source: this.forms.source == -1 ? null : this.forms.source,
        examId:this.examId
      }
      this.daochu = params;
      this.$axios
        .post(this.API.studentsManage.examineeList, params)
        .then((res) => {
          this.list = res.result.list
          // this.list = []
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
      if(!this.daochu.examId){
        this.$message({
          type: 'warning',
          message: '请先根据考试名称查询'
        });
        return false;
      }
      this.listLoading =true;
      let data = {
        "checkStatus": this.daochu.checkStatus,
        "examId": this.daochu.examId,
        "examName": this.daochu.examName,
        "examineeName": this.daochu.examineeName,
        "payStatus": this.daochu.payStatus,
        "provinceCode": "",
        "remark": this.daochu.remark2,
        "source": this.daochu.source,
        "studioName": this.daochu.studioName,
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
      this.$confirm('请谨慎选择一键审核，一旦点击确定。请不要重复提交，系统后台就会进行处理，并且请稍后查询审核状态！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        let data = {
          "checkStatus": this.daochu.checkStatus,
          "examId": this.daochu.examId,
          "examName": this.daochu.examName,
          "examineeName": this.daochu.examineeName,
          "payStatus": this.daochu.payStatus,
          "remark": this.forms.remark2,
          "source": this.daochu.source,
          "status": this.selectCheck2,
          "studioName": this.daochu.studioName,
          "current": 0,
          "provinceCode": "",
          "schoolId": 0,
          "size": 0,
        }
        this.$axios.post(`/examinee/examineeOneCheck`,data)
            .then((res) => {
              this.listLoading = false;
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });

    },
    oneKey(){
      if(!this.daochu.examId){
        this.$message({
          type: 'warning',
          message: '请先根据考试名称查询'
        });
        return false;
      }
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
