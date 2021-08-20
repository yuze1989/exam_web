<template>
  <section class="form_border" id="users">
    <!--工具条-->
    <el-row>
      <div class="title_style">权限设置</div>
    </el-row>
    <el-row class="toolbar" style="padding-bottom: 0px;" type="flex" size='medium'>
      <el-col :span="6">
        <el-button type="primary" @click="handleAdd" size='medium' class="meiyuan_btn">新增用户</el-button>
      </el-col>
      <el-col :span="18" size='medium'>
        <el-form :inline="true" :model="selections" style="float:right">
          <el-form-item>
            <el-input v-model="selections.name" style="width:140px;" placeholder="输入姓名" size='medium'>
            </el-input>
          </el-form-item>
          <el-form-item v-if="false">
            <el-select clearable  v-model="selections.provinceCode" clearable style="width:140px;" placeholder="选择省份" size='medium' @change="selProvice">
              <el-option v-for="province in provinceList" :key="province.province" :value="province.id" :label="province.province">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <selectProvince style="width: 120px" @province="setProvince"></selectProvince>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="handleCurrentChange(1)" size='medium' class="meiyuan_btn">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>

    </el-row>

    <!--列表-->
    <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" border :header-cell-style="{background:'#204BD6',color:'#fff'}" style="width: 100%;">
      <el-table-column prop="id" label="序号" width="100" header-align='center' align="center">
      </el-table-column>
      <el-table-column prop="account" label="账号" header-align='center' align="center">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="100" header-align='center' align="center">
      </el-table-column>
      <el-table-column prop="province" label="省份" header-align='center' align="center">
      </el-table-column>
      <el-table-column prop="role" label="角色" header-align='center' align="center">
      </el-table-column>
      <el-table-column label="操作" width="100" header-align='center' align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="handleStates(scope.$index, scope.row)">{{scope.row.enable===true?'禁用':'启用'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="selections.current"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="size"
      layout="total, sizes, prev, pager, next"
      :total="total">
    </el-pagination>
      <!-- <myPagination :current.sync="selections.current" :pages.sync="data.pages" :size.sync="selections.size" :total.sync="data.total" @cb="getUsers" /> -->
    </el-col>
    <!--新增界面-->
    <el-dialog title="新增用户" :visible.sync="userAddVisible" :close-on-click-modal="false" width="400px">
      <userAdd @closeUserAdd="closeUserAdd" v-if="userAddVisible" class="u1"></userAdd>
    </el-dialog>
    <!--修改界面-->
    <el-dialog title="用户修改" :visible.sync="userModifyVisible" :close-on-click-modal="false" width="400px">
      <userModify :forms='transRow' @closeUserModify="closeUserModify" v-if="userModifyVisible" class="u1"></userModify>
    </el-dialog>
  </section>
</template>

<script>
import axios from 'axios'
import provinceList from "../../utils/provinceCode";
// import { user_info_page} from '../../api/api';
import userAdd from './userAdd';
import userModify from './userModify';
import myPagination from "@/components/pagination";
import selectProvince from '@/components/SelectProvince'

export default {
  components: { userAdd, userModify, myPagination, selectProvince },
  data() {
    return {
      provinceList: [],
      userModifyVisible: false,
      userAddVisible: false,//编辑界面是否显示
      selections: {
        size: 20,
        current: 1,
        name: '',
        courses: '',//科目
        provinces: '',//选择省份
        provinceCode: ''
      },
      transRow: {},
      exampaper: [],
      users: [],
      total: 0,
      page: 1,
      size: 20,
      listLoading: false,
      sels: [],//列表选中列
      editLoading: false,
      editFormRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ]
      },
      data: {
        pages: 10,
        total: 0
      }
    }
  },
  methods: {
    format: function (paper) {
      return (percentage) => {
        return `已上传${paper.total}张`
      }
    },
    //性别显示转换
    formatSex: function (row, column) {
      return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
    },
    //获取用户列表
    getUsers(val) {
      
      axios.defaults.headers.common["Art-Token"] = sessionStorage.getItem('Art-Token');
      let para = {
        name: this.selections.name,
        province: this.selections.province,
        provinceCode: this.selections.provinceCode,
        current: this.selections.current,
        size: this.size
      };
      this.listLoading = true;
      // user_info_page(para).then((res) => {
      //   this.data = res.result || [];
      //   this.total = res.result.total || 0;
      //   this.users = res.result.records;
      //   // this.users.sort((a, b) => { return (a.id < b.id) ? 1 : -1 })
      //   this.listLoading = false;
      // });
    },
    handleCurrentChange(current) {
      this.selections.current = current
      this.getUsers()
    },
    handleSizeChange(size) {
      this.size = size
      this.getUsers()
    },
    //删除
    handleQuery: function (index, row) {
      this.$store.state.studio.name = row.studioname
      this.$store.state.studio.studentsCount = row.studentsCount
      this.$router.push({ path: '/studioDetail' })
    },
    //显示编辑
    handleAdd: function () {
      this.userAddVisible = true;
    },
    //显示编辑
    handleEdit: function (idx, row) {
      console.log(row)
      this.transRow = { ...row }
      this.transRow['provinces'] = row.province.split(',')
      console.log(row.province.split(','))
      this.userModifyVisible = true;
    },
    handleStates: function (idx, row) {
      this.transRow = row;
      this.transRow['provinces'] = row.province.split(',');
      this.transRow.enable = this.transRow.enable ? 0 : 1;
      this.axios.post(this.stateUrl.userInfoUpdate,this.transRow).then((res)=>{
        if(res){
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.getUsers()
        }
        
      }).catch(()=>{})
    },
    selsChange: function (sels) {
      this.sels = sels;
    },
    //批量删除
    batchRemove: function () {
      var ids = this.sels.map(item => item.id).toString();
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        let para = { ids: ids };
        batchRemoveUser(para).then((res) => {
          this.listLoading = false;
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.getUsers();
        });
      }).catch(() => {

      });
    },
    closeUserModify() {
      this.getUsers()
      this.userModifyVisible = false
    },
    closeUserAdd() {
      this.getUsers()
      this.userAddVisible = false
    },
    selProvice(code) {
      if (code) {
        const list = this.provinceList.filter(item => {
          if (item.id == code) {
            this.selections.province = item.province
          }
        })
      } else {
        this.selections.province = ''
      }

    },
    setProvince(obj) {
      if (obj) {
        Object.assign(this.selections, obj)
      } else {
        Object.assign(this.selections, { province: '', provinceCode: '' })
      }

    }
  },
  mounted() {
    this.provinceList = provinceList
    axios.defaults.headers.common["Art-Token"] = sessionStorage.getItem('Art-Token');
    this.exampaper = this.$store.state.exampaper
    this.getUsers()
  }
}

</script>

<style>
.el-button--small {
  padding: 1px 1px;
}
.el-dialog__header {
  text-align: center;
}
.el-dialog__title {
  font-size: 32px;
}
#users .u1 .el-select {
  width: 300px !important;
}
</style>