<template>
  <section>
    <el-row class="toolbar" style="padding-bottom: 0px;height: 66px;padding-top: 15px" type="flex">
      <el-col :span="6">
        <el-button
          type="primary"
          style="margin-left: 10px;"
          class="meiyuan_btn"
          @click="roomassgin"
        >
          考场分配
        </el-button>
      </el-col>
      <el-col :span="18" style="float: right;">
        <el-form :inline="true" :model="selections" style="float: right;">

          <el-form-item>
            <el-input
              v-model="selections.examName"
              style="width: 140px;"
              placeholder="请输入考试名称"
              onKeyUp="value=value.replace(/\s|[\r\n]/ig,'')"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-input
                v-model="selections.admissionTicketCode"
                style="width: 140px;"
                placeholder="请输入准考证号"
                onKeyUp="value=value.replace(/\s|[\r\n]/ig,'')"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-input
              v-model="selections.examineeName"
              style="width: 140px;"
              placeholder="请输入学生姓名"
              onKeyUp="value=value.replace(/\s|[\r\n]/ig,'')"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-input
                v-model="selections.studioName"
                style="width: 140px;"
                placeholder="请输入所属机构"
                onKeyUp="value=value.replace(/\s|[\r\n]/ig,'')"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-select
              v-model="selections.provinceCode"
              placeholder="生源省份"
              value-key="province"
              clearable
              filterable
            >
              <el-option
                v-for="item in options"
                :key="item.provinceCode"
                :label="item.province"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              class="meiyuan_btn"
              v-on:click="getExamRoomList('select')"
            >
              查询
            </el-button>
            <!-- <el-button class="meiyuan_btn" v-on:click="reset('select')">
              重置
            </el-button> -->
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!--列表-->
    <div class="form_border">
      <el-table
        :data="examRoomList"
        highlight-current-row
        v-loading="listLoading"
        @selection-change="selsChange"
        border
        :header-cell-style="{
          background: '#08223c',
          color: '#fff',
          border: 'none',
        }"
        style="width: 100%;"
      >
        <el-table-column
          prop="examinationRoomCode"
          label="考场编号"
          width="120"
          header-align="center"
          align="center"
        ></el-table-column>

        <el-table-column
          prop="examName"
          label="考试名称"

          header-align="center"
          align="center"
        ></el-table-column>

        <el-table-column
          prop="admissionTicketCode"
          label="准考证号"

          header-align="center"
          align="center"
        ></el-table-column>

        <el-table-column
          prop="name"
          label="姓名"

          header-align="center"
          align="center"
        ></el-table-column>

        <el-table-column
          prop="identification"
          label="身份证号"

          header-align="center"
          align="center"
        ></el-table-column>

        <el-table-column
          prop="studioName"
          label="所属机构"
          header-align="center"

          align="center"
        ></el-table-column>

        <el-table-column
          prop="province"
          label="所属省份"

          header-align="center"
          align="center"
        ></el-table-column>

<!--         //审核状态  0:待审核,1:通过,2:拒绝 支付状态 1:待支付,2:成功,3:失败,4:处理-->
<!--        <el-table-column label="操作" header-align="center" align="center">-->
<!--          <template slot-scope="scope">-->
<!--            <el-button-->
<!--              type="text"-->
<!--              size="small"-->
<!--              @click="exchangeExamRoom(scope.row)"-->
<!--            >-->
<!--              换考场-->
<!--            </el-button>-->
<!--          </template>-->
<!--        </el-table-column>-->
      </el-table>
    </div>

    <el-col :span="24" class="toolbar">
      <myPagination
        :current.sync="selections.current"
        :pages.sync="data.pages"
        :size.sync="selections.size"
        :total.sync="data.total"
        @cb="handleCurrentChange"
      />
    </el-col>
    <!--编辑界面-->
    <el-dialog
      :close-on-click-modal="false"
      title="考场分配"
      :visible.sync="roomAssginVisible"
      :destroy-on-close="true"
      :append-to-body="true"
      width="800px"
    >
      <examRoomAssgin v-if="roomassgin" @closeRoom="closeRoom"></examRoomAssgin>
    </el-dialog>
    <!-- :before-close="handleClose" -->
    <el-dialog
      :visible.sync="visible"
      :show-close="true"
      :close-on-click-modal="false"
      width="40%"
      center
    >
      <div class="header-title" slot="title">更换考场</div>
      <el-form
        label-width="100px"
        :model="from"
        label-position="right"
        class="demo-ruleForm"
        center
        ref="ruleForm"
      >
        <el-form-item label="更换到：">
          <el-input
            v-model="ruleForm.roomCode"
            placeholder="考场编号"
            size="medium"
            style="width: 200px;"
          ></el-input>
          <!-- <el-select
            v-model="ruleForm.id"
            placeholder="请选择考场"
            style="width: 100%;"
          >
            <el-option
              v-for="item in selectExamRoomList"
              :key="item.id"
              :label="item.examName"
              :value="item.id"
            ></el-option>
          </el-select> -->
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="confirm">更换</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import provinceCodeList from '@/utils/provinceCode'
import myPagination from '@/components/pagination'
import SelectProvince from '@/components/SelectProvince'

import examRoomAssgin from './examRoomAssgin'
export default {
  components: { examRoomAssgin, myPagination, SelectProvince },
  data() {
    return {
      options:[],
      from: {},
      listLoading: false,
      dialogVisible: true,
      visible: false,
      provinceList: provinceCodeList,
      examRoomList: [],
      selectExamRoomList: [],
      total: 0,
      page: 1,
      sels: [], //列表选中列
      selections: {
        size: 10,
        current: 1,
        proviceName: '', //选择省份
        examineeName: '', //学生姓名
        examName: '',
        provinceCode: '',
        roomCode: '',
        schoolId: '',
        admissionTicketCode:"",//准考证号
        studioName:"",//机构名称
      },
      ruleForm: {
        id: '',
        roomCode: '',
      },
      roomAssginVisible: false, //编辑界面是否显示
      editLoading: false,
      data: { pageIndex: 1, pages: 0, pageSize: 10, total: 0, records: [] },
    }
  },
  methods: {
    // selectedProvince(payload) {
    //   this.selections.provinceCode = payload.provinceCode
    //   this.selections.provinceName = payload.province
    // },
    roomassgin() {
      this.roomAssginVisible = true
    },
    handleCurrentChange() {
      this.getExamRoomList()
    },
    exchangeExamRoom(val) {
      this.ruleForm.id = val.id
      this.visible = true
      var selections = {
        current: this.selections.current,
        size: this.selections.size,
        provinceCode: val.provinceCode,
        examName: val.examName,
      }
      this.$axios
        .post(this.API.studentsManage.examRoomList, selections)
        .then((res) => {
          if (res.code == 200) {
            this.selectExamRoomList = res.result.list
            this.listLoading = false
          }
        })
        .catch((e) => {
          this.listLoading = false
        })
    },
    confirm() {
      if (!this.ruleForm.roomCode) {
        this.$message.error('调换的考场不能为空')
        return
      }
      this.$axios
        .get(
          `${this.API.studentsManage.examRoomChange}?id=${this.ruleForm.id}&roomCode=${this.ruleForm.roomCode}`,
        )
        .then((res) => {
          if (res.code == 200) {
            this.visible = false
            this.$message.success('更换考场成功')
            this.listLoading = false
            this.getExamRoomList()
          }
        })
        .catch((e) => {
          this.listLoading = false
        })
    },
    reset() {
      this.selections.provinceCode = ''
      this.selections.proviceName = ''
      this.selections.examineeName = ''
      this.selections.examName = ''
      this.getExamRoomList('select')
    },
    getExamRoomList(type) {
      this.listLoading = true
      if (type == 'select') {
        this.selections.current = 1
      }
      this.selections.examineeName = this.selections.examineeName.replace(
        /\s|[\r\n]/gi,
        '',
      )
      console.log('1111222')
      this.$axios
        .post(this.API.studentsManage.examRoomList, {
          current: this.selections.current,
          size: this.selections.size,
          provinceCode: this.selections.provinceCode?this.selections.provinceCode.provinceCode:'',
          examineeName: this.selections.examineeName,
          examName: this.selections.examName,
          studioName:this.selections.studioName,
          admissionTicketCode:this.selections.admissionTicketCode
        })
        .then((res) => {
          if (res.code == 200) {
            this.data = res.result
            this.total = res.result.total
            this.examRoomList = res.result.list
            this.listLoading = false
          }
        })
        .catch((e) => {
          this.listLoading = false
        })
    },
      getProvinceList() {
    this.$axios
      .get(this.API.studentsManage.examRoomProvince)
      .then((res) => {
        this.options = res.result || []
      })
      .catch(() => {})
  },
    selsChange: function (sels) {
      this.sels = sels
    },
    closeRoom() {
      this.roomAssginVisible = false
    },
  },
  mounted() {
    this.getExamRoomList()
    this.getProvinceList()
  },
}
</script>

<style scoped>
.el-button--small {
  padding: 1px 1px;
}
.el-dialog__header {
  text-align: center;
}
.el-dialog__title {
  font-size: 32px;
}
</style>
