<template>
  <section>
    <el-dialog
        :close-on-click-modal="false"
        title="考场分配"
        :visible.sync="roomAssginVisible"
        :destroy-on-close="true"
        :append-to-body="true"
        width="800px"
    >
      <input type="file" id="xx" @change="xx">
      <examRoomAssgin v-if="roomassgin" @closeRoom="closeRoom"></examRoomAssgin>
    </el-dialog>
  </section>
</template>
<script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js"></script>
<script src="https://cdn.bootcdn.net/ajax/libs/xlsx/0.17.0/xlsx.core.min.js"></script>
<script>
// 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
function sheet2blob(sheet, sheetName) {
  sheetName = sheetName || 'sheet1';
  var workbook = {
    SheetNames: [sheetName],
    Sheets: {}
  };
  workbook.Sheets[sheetName] = sheet; // 生成excel的配置项

  var wopts = {
    bookType: 'xlsx', // 要生成的文件类型
    bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
    type: 'binary'
  };
  var wbout = XLSX.write(workbook, wopts);
  var blob = new Blob([s2ab(wbout)], {
    type: "application/octet-stream"
  }); // 字符串转ArrayBuffer
  function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }
  return blob;
}

function openDownloadDialog(url, saveName) {
  if (typeof url == 'object' && url instanceof Blob) {
    url = URL.createObjectURL(url); // 创建blob地址
  }
  var aLink = document.createElement('a');
  aLink.href = url;
  aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
  var event;
  if (window.MouseEvent) event = new MouseEvent('click');
  else {
    event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  }
  aLink.dispatchEvent(event);
}

</script>
<script>
import { apiExamList,apiGetProvinceByExamId,apiGetExamDetails,apiTicketCreate } from '@/api/ticket.js'
import provinceCodeList from '@/utils/provinceCode'
import myPagination from '@/components/pagination'
import SelectProvince from '@/components/SelectProvince'
import examRoomAssgin from './examRoomAssgin'
export default {
  components: {examRoomAssgin,myPagination, SelectProvince },
  data() {
    return {
      examName:"",
      examId:"",
      examNameOption: [],
      options:[],
      from: {},
      listLoading: false,
      dialogVisible: true,
      visible: true,
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
        address:""
      },
      addressList:[],
      ruleForm: {
        id: '',
        roomCode: '',
      },
      roomAssginVisible: true, //编辑界面是否显示
      editLoading: false,
      daochu:{},
      data: { pageIndex: 1, pages: 0, pageSize: 10, total: 0, records: [] },
    }
  },
  created() {
    this.getExamList()
  },
  methods: {
    xx(value){

      var files = value.target.files;
      console.log(files);
      var fileReader = new FileReader();
      fileReader.onload = function(ev) {
        try {
          var data = ev.target.result,
              workbook = XLSX.read(data, {
                type: 'binary'
              }), // 以二进制流方式读取得到整份excel表格对象
              persons = []; // 存储获取到的数据
        } catch (e) {
          console.log('文件类型不正确');
          return;
        }

        // 表格的表格范围，可用于判断表头是否数量是否正确
        var fromTo = '';
        // 遍历每张表读取
        for (var sheet in workbook.Sheets) {
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            fromTo = workbook.Sheets[sheet]['!ref'];
            console.log(fromTo);
            persons = persons.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
            // break; // 如果只取第一张表，就取消注释这行
          }
        }

        for(let i = 1 ;i <=59;i++){

        }
        var list = {};
        for(let x = 0; x <persons.length;x++){
          let p  = persons[x];
          let name = p['考场'];
          if(list[name]){
            list[name].push(p);
          }else{
            list[name] = [];
          }
        }
        console.log(list);

        // for(let i = 1; i<= 45;i++){
        //   let name = "第"+i+"考场";
        //   delete list[name];
        // }
        //
        // for(let k in list){
        //   btn_export(list[k],k)
        // }


      };

    },
    // 查询考试列表
    getExamList(){
      apiExamList().then(res=>{
        this.examNameOption = res.result
      })
    },
    // 考试改变监听
    examNameChange(e){
      this.examId = ""
      this.selections.address = ""
      this.addressList =[];
      this.selections.examName = ""
      this.examNameOption.map(item =>{
        if(item.id == e){
          this.selections.examName = item.name
          this.examId = item.id
          this.getDz()
        }
      })
    },
    getDz(){
      this.$axios.get("/examinfo/detail?id="+this.examId).then((res)=>{
        this.addressList = res.result.addressList;
      })
    },
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
    exportKc(){
      if(!this.daochu.examId){
        this.$message.warning('请先根据考试名称查询！')
        return false;
      }
      this.listLoading = true

      let data = {
        address:this.daochu.address,
        roomCode:this.daochu.roomCode,
        current: this.daochu.current,
        size: this.daochu.size,
        provinceCode: this.daochu.provinceCode?this.daochu.provinceCode.provinceCode:'',
        examineeName: this.daochu.examineeName,
        examName: this.daochu.examName,
        studioName:this.daochu.studioName,
        admissionTicketCode:this.daochu.admissionTicketCode,
        examId:this.daochu.examId
      }
      this.$axios.post('/examinee/examRoomExport',data).then((res)=>{
        if(res.code == 200){
          const a = document.createElement('a');
          a.setAttribute("download",'')
          a.setAttribute("href",res.result)
          a.click()
        }
        this.listLoading = false

      }).catch((err) => {
        this.listLoading = false
      })
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
      let data = {
        address:this.selections.address,
        roomCode:this.selections.roomCode,
        current: this.selections.current,
        size: this.selections.size,
        provinceCode: this.selections.provinceCode?this.selections.provinceCode.provinceCode:'',
        examineeName: this.selections.examineeName,
        examName: this.selections.examName,
        studioName:this.selections.studioName,
        admissionTicketCode:this.selections.admissionTicketCode,
        examId:this.examId
      }
      this.daochu = data;
      this.$axios
          .post(this.API.studentsManage.examRoomList, data)
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
.el-form-item{
  margin-bottom: 10px;
}
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
