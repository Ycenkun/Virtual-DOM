/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {
const patch = snabbdom.patch;
const h = snabbdom.h;

//总体实现顺序：查找、增加、删除、修改

// const container = document.querySelector('.container')
const inp = document.querySelector('.input')
const find = document.querySelector('.find')
let data={
  originArr:[1,2,3,4],
  flag:false,
  f:'true',
  modifyVal:'',
  currentIndex:'',

  findVal:'',
  tempArr:'',
}


//1、渲染出来需要输入待办事项的输入框
function renderPage(arr){
  //创建虚拟dom
  return h(
    "ul",
    {
    props:{
      className:'container'
    }
  },
  arr.map((item,index)=>
     h(
      "li",
      {
      props:{
        key:index,
      },
      style:{
        listStyle:'none',
        width:'200px',
        height:'70px',
        // border:'1px solid #555',
        borderRadius:'5px',
        background:'#ccc'
      }
    },
    h("p",{},item),
    h("button",{    
      props:{
        onclick:()=>{openMask(data.currentIndex=index)}
      }
    },'修改'),
    h("button",{     
      props:{
        onclick:()=>{
          del(index)
        }
      }
    },'删除'),)))
    
};
//创建一个input的虚拟dom
function vdomInput(e){
  return h('input',{
    props:{
      display:data.f?'block':'none',
      className:'inp',
      type:'text',
      placeholder:'输入待办事项，回车添加',
      onkeydown:(e)=>{getVal(e);}
    }
  })
}
//创建一个修改遮罩
function vdomMask(){
  return h('div',{
    style:{
      display:data.flag?'block':'none'
    },
    props:{
      className:'mask'
    }
  },[
    h('input',{
      props:{
        placeholder:"请输入更改内容",
        onchange:(e)=>{data.modifyVal=e.target.value}//onchange数据改变后失去焦点触发
      }
    }),
    h('button',{
      props:{
        onclick:()=>{closeMask()}
      }
    },"取消"),
    h('button',{
      props:{
        onclick:()=>{addModify()}
      }
    },"确认"),
  ])
}
//创建一个查找dom
function vdomFind(){
  return h(
    'div',
    {
      props:{
        className:'find'
      }
    },
    [
      h('input',{
        props:{
          placeholder:'请输入要查找的内容哦',
          onchange:(e)=>{data.findVal = e.target.value}
        }
      }),
      h('button',{
        props:{
          onclick:()=>{search()}
        }
      },'查找')
    ]
  )
}
//查找方法实现
patch(getContainer(),renderPage(data.originArr))
patch(inp,vdomInput())
patch(find,vdomFind())
//下面是功能函数
//获取container
function getContainer(){
  return document.querySelector('.container')
}
//获取mask
function getMask(){
  return document.querySelector('.mask')
}
//打开修改的遮罩
function openMask(){
  // console.log(1);
  data.flag = true;

  patch(getMask(),vdomMask())

}
//关闭修改遮罩
function closeMask(){
  data.flag = false;
  patch(getMask(),vdomMask())
}
//添加修改
function addModify(){
  // modifyVal:'',
  // currentIndex:'',
  data.originArr[data.currentIndex] = data.modifyVal
  closeMask()
  patch(getContainer(),renderPage(data.originArr))

}
//增加方法
function getVal(e){
  if(e.keyCode==13){
    // console.log(1);
    if(typeof(Number(e.target.value))=='number'){
    data.originArr.push(Number(e.target.value))

    }else{

      data.originArr.push(e.target.value)
    }
    e.target.value = ''
    patch(getContainer(),renderPage(data.originArr))
  }
}
//删除方法
function del(index){
  data.originArr.splice(index,1)
  const container = getContainer()
  // console.log(getContainer());
  //渲染的时候 ,必须重新获取当前状态下的container，如果不重新获取 
  // 那么container还是上次已经覆盖掉的container
  patch(container,renderPage(data.originArr))
  closeMask()

}
//查找方法
function search(){
   data.tempArr=data.originArr.filter((item)=>{
     return item==data.findVal  //如果想要获取返回值，要么不加花括号，加了花括号就要加return
    //  console.log(data.tempArr);
  })
  console.log(data.tempArr);

  patch(getContainer(),renderPage(data.tempArr))
}




/***/ })
/******/ ]);