var xmHomePage=[
  {
    element: '#XmProductAllMng',
    popover: {
      title: ' ',
      description: '这里可以创建新产品，支持手工、复制现有项目、复制模板三种模式快速一键创建项目',
      position: 'left'
    }
    },
    {
    element: '#XmMenuMng',
    popover: {
      title: ' ',
      description: '这里可以进行需求管理，包括需求设计、需求迭代、需求细化、需求变更等。',
      position: 'left'
    },
    padding: 5,
    },
    {
    element: '#XmProjectAllMng',
    popover: {
      title: ' ',
      description: '这里可以进行项目管理、计划管理、任务管理，可以通过复制项目模板、复制现有项目快速创建项目。',
      position: 'left',
    },
    padding: 5,
    },
    {
    element: '#XmMyTaskCenter',
    popover: {
      title: ' ',
      description: '这里可以进行任务管理，包括填报任务进度、分配任务执行人、工作量填报等',
      position: 'left',
    },
    padding: 5,
    },
    {
    element: '#XmProjectGroupAllMng',
    popover: {
      title: ' ',
      description: '这里可以快速创建项目、产品团队、快速管理团队成员。',
      position: 'left',
    },
    padding: 5,
    } ,
    {
    element: '#XmQuestionMng',
    popover: {
      title: ' ',
      description: '这里可以进行测试管理、测试设计、测试执行等。',
      position: 'left',
    },
    padding: 5,
    } ,
    {
    element: '#TaskListAssigneeToMe',
    popover: {
      title: ' ',
      description: '关于审批的所有事项，都可以从这里一站式管理。',
      position: 'left',
    },
    padding: 5,
    } 
];

var xmProductMng=[
    {
    element: '#guider-one',
    popover: {
      title: ' ',
      description: '这里可以创建新产品，支持手工、复制现有产品、复制模板三种模式快速一键创建产品',
      position: 'bottom'
    }
    },
    {
    element: '#guider-two',
    popover: {
      title: ' ',
      description: '这里可以选择更多的查询条件，或者更多的操作。',
      position: 'bottom'
    },
    padding: 5,
    },
    {
    element: '#guider-three',
    popover: {
      title: ' ',
      description: '这里可以跳转到产品视图，查看更多信息、做产品相关的各种操作。',
      position: 'top',
    },
    padding: 5,
    },
    {
    element: '#guider-four',
    popover: {
      title: ' ',
      description: '这里可以统计产品的总体进度、工作量等所有统计数据。',
      position: 'left',
    },
    padding: 5,
    },
    {
    element: '#guider-five',
    popover: {
      title: ' ',
      description: '这里可以将产品快速复制为新的共享模板、新的产品，达到快速创建产品的效果。',
      position: 'left',
    },
    padding: 5,
    }
  ];

  
var xmProjectMng=[
  {
  element: '#prj-plus-btn',
  popover: {
    title: ' ',
    description: '这里可以创建新项目，支持手工、复制现有项目、复制模板三种模式快速一键创建项目',
    position: 'bottom'
  }
  },
  {
  element: '#prj-more-btn',
  popover: {
    title: ' ',
    description: '这里可以选择更多的查询条件，或者更多的操作。',
    position: 'bottom'
  },
  padding: 5,
  },
  {
  element: '#prj-copy-btn',
  popover: {
    title: ' ',
    description: '这里可以通过复制快速创建项目(同步复制项目计划、项目任务、项目团队及成员)',
    position: 'right',
  },
  padding: 5,
  },
  {
  element: '#prj-del-btn',
  popover: {
    title: ' ',
    description: '这里可以把项目放入回收站(支持从回收站恢复)',
    position: 'right',
  },
  padding: 5,
  },
  {
  element: '#prj-calc-btn',
  popover: {
    title: ' ',
    description: '这里可以把项目的所有统计数据更新为最新的汇总数据(包括进度、任务数、需求数、工作量等)',
    position: 'right',
  },
  padding: 5,
  },
  {
  element: '#prj-view-box',
  popover: {
    title: ' ',
    description: '点击这个区域可以跳转到项目视图（可以管理项目计划、项目任务、项目变更、项目迭代、项目缺陷等）',
    position: 'right',
  },
  padding: 5,
  }
];
  export default { 
    //请在下面添加数据
    steps:{
      xmHomePage,
      xmProductMng, 
      xmProjectMng,
    },

    getSteps:function(guiderName){
      if(this.steps[guiderName]){
        return this.steps[guiderName]
      }else{
        return []
      } 
    }
  
  }

 
