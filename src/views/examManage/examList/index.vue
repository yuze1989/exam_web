<template>
  <section class="form_border">
    <div class="header">
      <el-form :inline="true" class="demo-form-inline">
        <el-col :span="4">
          <el-button
              type="primary"
              @click="add"
          >
            新增考试
          </el-button>
        </el-col>
        <el-col :span="20" style="display: flex;justify-content: flex-end;">
          <el-col :span="4">
            <el-form-item>
              <el-input
                  v-model="forms.model.name"
                  placeholder="考试名称"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item>
              <el-select
                  v-model="forms.model.examStatus"
                  placeholder="考试状态"
                  @change="changeStatus"
              >
                <el-option
                    v-for="(item, index) in examStatus"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="2">
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
<!--              <el-button type="warning" @click="reset">重置</el-button>-->
            </el-form-item>
          </el-col>
        </el-col>

      </el-form>
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
        prop="no"
      ></el-table-column>

      <el-table-column
        label="考试名称"
        header-align="center"
        align="center"
        prop="name"
      ></el-table-column>

      <el-table-column
        label="考试类型"
        header-align="center"
        align="center"
        prop="examTypeStr"
      ></el-table-column>

      <el-table-column
        label="考试状态"
        header-align="center"
        align="center"
        prop="examStatusStr"
      ></el-table-column>

      <el-table-column
        label="考试开始时间"
        header-align="center"
        align="center"
        prop="examStartTime"
      ></el-table-column>

      <el-table-column
        label="考试开始结束"
        header-align="center"
        align="center"
        prop="examEndTime"
      ></el-table-column>

      <el-table-column
        label="联合考试状态"
        header-align="center"
        align="center"
        prop="status"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            v-if="scope.row.examType == 1"
            size="small"
            @click="toUnion(scope.row)"
          >
            <span>联合考试状态</span>
          </el-button>
        </template>
      </el-table-column>

      <el-table-column
        label="创建时间"
        header-align="center"
        align="center"
        prop="createTime"
      ></el-table-column>
              <!-- v-if="scope.row.examType != 1" -->
      <el-table-column label="操作" header-align="center">
        <template slot-scope="scope">
          <div>
            <el-button
              v-if="scope.row.status == -1"
              type="text"
              size="small"
              @click="editItemAction(scope.row)"
            >
              <span>修改</span>
            </el-button>

            <el-button
              v-if="scope.row.status == -1"
              type="text"
              size="small"
              @click="del(scope.row)"
            >
              <span>删除</span>
            </el-button>

            <!-- POST /examinfo/union 联合考试操作(状态:1、同意;2、拒绝;3、禁用) -->
            <!-- <el-button
              type="text"
              v-if="scope.row.status == 0 && scope.row.examType == 1"
              size="small"
              @click="enbaleItemAction(scope.row, 1)"
            >
              <span>确认联合考试</span>
            </el-button>

            <el-button
              type="text"
              v-if="scope.row.status == 0 && scope.row.examType == 1"
              size="small"
              @click="enbaleItemAction(scope.row, 2)"
            >
              <span>拒绝联合考试</span>
            </el-button> -->

            <el-button
              type="text"
              v-if="scope.row.status == -1 && scope.row.examType == 1"
              size="small"
              @click="toShowInvite(scope.row)"
            >
              <span>邀请机构</span>
            </el-button>

            <!-- <el-button
              type="text"
              v-if="scope.row.status == -1 && scope.row.examType == 1"
              size="small"
              @click="toUnion(scope.row)"
            >
              <span>联合考试状态</span>
            </el-button> -->
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

     <unionDialog 
      :visible.sync="showUnion"
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
import unionDialog from './unionDialog'
import deleteDialog from "./deleteDialog"
export default {
  components: {
    addDialog,
    inviteDialog,
    deleteDialog,
    unionDialog
  },
  data() {
    return {
      list: [],
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
      showUnion: false,//展示弹窗
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
    //去查询联合考试状态
    toUnion(item){
      this.showUnion = true,
      this.editItemData = item;
    },
    // 新增
    add() {
      this.isAddType = 1
      this.isAdd = true
    },
    editItemAction(item) {
      this.editItemData = item;
      this.isAddType = 0;
      this.isAdd = true;
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
    currentChange(e) {
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
        examStatus:
          this.forms.model.examStatus == -1
            ? null
            : this.forms.model.examStatus,
      }
      this.$axios
        .post(this.API.examinfo.list, params)
        .then((res) => {
          this.list = res.result.records
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
@import './orderAccount.scss';
</style>
