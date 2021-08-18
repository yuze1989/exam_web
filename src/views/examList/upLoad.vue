<template>
  <section class="form_border">
    <div class="header">
      <el-row style="padding:15px 0 0 10px">
        各科目试卷上传进度
      </el-row>
      <el-row style="padding: 10px">
        <el-col v-for="(item,index) in gradeList" :key="index" :span="24/gradeList.length" style="padding: 0 5px">
          <div class="grade" style="position: relative">
            <div class="label" style="position:absolute;
    z-index: 99;
    font-size: 14px;
    left: 10px;">{{ item.course }}</div>
<!--            {{item.count}}-->
            <el-progress :text-inside="true" :stroke-width="26" :percentage="70"></el-progress>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" style="padding: 10px;margin-top: 5px;">
          <el-button type="primary" class="meiyuan_btn" @click="saveRule" style="float: left">停止阅卷</el-button>
        </el-col>
        <el-col :span="20">
          <el-form :inline="true" class="demo-form-inline" style="    padding-top: 15px;
    padding-bottom: 10px;
    display: flex;
    justify-content: flex-end;">
            <!--        <el-form-item>-->
            <!--          <el-select-->
            <!--              v-model="forms.model.provinceCode"-->
            <!--              placeholder="生源省份"-->
            <!--              value-key="province"-->
            <!--              clearable-->
            <!--              filterable-->
            <!--          >-->
            <!--            <el-option-->
            <!--                v-for="item in options"-->
            <!--                :key="item.provinceCode"-->
            <!--                :label="item.province"-->
            <!--                :value="item"-->
            <!--            ></el-option>-->
            <!--          </el-select>-->
            <!--        </el-form-item>-->
            <!--        <el-form-item>-->
            <!--          <el-input v-model.trim="forms.model.userName" placeholder="机构名称"/>-->
            <!--        </el-form-item>-->
            <el-form-item>
              <el-input
                  v-model="forms.model.name"
                  placeholder="考试名称"
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

  </section>
</template>

<script>
export default {
  data() {
    return {
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
    }
  },
  created() {
    this.getOrderList()
    this.getGrade()
  },
  methods: {
    //查询进度
    getGrade(){
      this.$axios
          .post('/exampaper/uploadProgress', {
            current:"",
            size:""
          })
          .then((res) => {
            this.gradeList = res.result.list
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
        operStatus : 0,
        examCode:this.$route.params.id
      }
      this.$axios
        .post('/exampaper/exampaperList', params)
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
.el-form-item{
  margin-bottom: 0;
}
//@import './orderAccount.scss';
</style>
