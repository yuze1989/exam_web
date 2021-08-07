<template>
  <section class="form_border">
    <div class="header">
      <!-- checkStatus:'',//审核状态:0未审核；1通过；2未通过 ,
        examName:'',//考试名称 
        examineeName: '',//考生姓名
        payStatus: '',//支付状态:0未支付；1已支付 ,
        provinceCode:'',
        schoolId:'',// 机构id ,
        source:'',//报名来源:1手机；2后台 ,
        studioName:'',//: 画室名称 -->
      <el-input
        style="width: 200px;"
        v-model="forms.examineeName"
        placeholder="姓名"
      ></el-input>

      <el-input
        style="width: 200px; margin-left: 20px;"
        v-model="forms.studioName"
        placeholder="画室名称"
      ></el-input>

      <el-input
        style="width: 200px; margin-left: 20px;"
        v-model="forms.examName"
        placeholder="考试名称"
      ></el-input>

      <el-select
        v-model="forms.checkStatus"
        style="width: 200px; margin-left: 20px;"
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

      <el-select
        v-model="forms.payStatus"
        style="width: 200px; margin-left: 20px;"
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

      <el-select
        v-model="forms.source"
        style="width: 200px; margin-left: 20px;"
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

      <el-button type="primary" style="margin-left: 20px;" @click="onSubmit">
        查询
      </el-button>
      <el-button type="warning" @click="reset">重置</el-button>
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
        prop="identification"
      ></el-table-column>

      <el-table-column
        label="手机号码"
        header-align="center"
        align="center"
        prop="mobile"
      ></el-table-column>

      <el-table-column
        label="画室编码"
        header-align="center"
        align="center"
        prop="studioCode"
      ></el-table-column>

      <el-table-column
        label="画室名称"
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
          <span>{{ (scope.row.price / 100).toFixed(2) }}</span>
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
          <img :src="scope.row.url" style="width: 100px; height: 100px;" />
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
          <!-- <el-button
            v-if="scope.row.checkStatus == 0 && scope.row.payStatus == 2"
            type="text"
            size="small"
            @click="enbaleItemAction(scope.row, 1)"
          >
            通过
          </el-button>
          <el-button
            v-if="scope.row.checkStatus == 0 && scope.row.payStatus == 2"
            type="text"
            size="small"
            @click="enbaleItemAction(scope.row, 2)"
          >
            拒绝
          </el-button> -->
          <el-button
            v-if="scope.row.checkStatus == 0 && scope.row.payStatus == 2"
            type="text"
            size="small"
            @click="enbaleItemAction(scope.row, 2)"
          >
            审核
          </el-button>
          <el-button
            v-if="scope.row.checkStatus == 0 && scope.row.payStatus == 2"
            type="text"
            size="small"
            @click="enbaleItemAction(scope.row, 2)"
          >
            修改
          </el-button>
          <el-button
            v-if="scope.row.checkStatus == 0 && scope.row.payStatus == 2"
            type="text"
            size="small"
            @click="enbaleItemAction(scope.row, 2)"
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

    <!--选择审核修改-->
    <!-- <el-dialog title="审核学生信息" :visible.sync="dialogTableVisible" center>
      <el-select v-model="selectRoomIds" multiple placeholder="请选择">
        <el-option
          v-for="item in checkOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
      <div style="margin-top: 30px;">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitCheck">确 定</el-button>
      </div>
    </el-dialog> -->
  </section>
</template>
<script>
export default {
  components: {},
  data() {
    return {
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
        studioName: '', //: 画室名称
      },
      checkStatusList: [
        { name: '全部审核状态', id: -1 },
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
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    reset() {
      ;(this.forms = {
        examineeName: '',
        payStatus: '',
        checkStatus: -1, //审核状态  0:待审核,1:通过,2:拒绝
        payStatus: -1, //支付状态 1:待支付,2:成功,3:失败,4:处理
      }),
        (this.forms.current = 1)
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
      }
      this.$axios
        .post(this.API.studentsManage.examineeList, params)
        .then((res) => {
          this.list = res.result.list
          // this.list = []
          this.forms.pageNum = res.result.pageNum
          this.forms.pageSize = res.result.pageSize
          this.forms.total = res.result.total
          console.log(this.result.list, 'this.list')
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

    submitCheck() {
      // let params = {
      //   studioIds: this.selectRoomIds,
      //   examId: this.sels.id,
      // }
      // this.$axios
      //   .post(`${this.API.studentsManage.examineeCheck}`, params)
      //   .then((res) => {
      //     this.$message.success('操作成功')
      //     console.log(res,'res')
      //     // this.forms.current = 1
      //     // this.getOrderList()
      //     // this.fileList = []
      //   })
      //   .catch((err) => {
      //     this.listLoading = false
      //   })
    },
    // 上传文件
    onImport(file, fileList) {
      var formFile = new FormData()
      formFile.append('file', file.file)
      this.fileList = []
      this.$axios
        .post(this.API.studentsManage.examineeBatchImport, formFile)
        .then((res) => {
          this.$message.success('导入成功')
          this.forms.current = 1
          this.getOrderList()
          this.fileList = []
        })
        .catch((err) => {
          this.listLoading = false
        })
    },
  },
}
</script>
<style lang="scss" scoped>
@import './orderAccount.scss';
</style>
