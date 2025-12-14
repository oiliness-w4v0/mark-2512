export const departments = [
  {
    id: 1,
    name: "创作部",
    leaveRequests: [
      {
        id: 1,
        employee: "张三",
        reason: "病假",
        startDate: "2023-10-01",
        endDate: "2023-10-03",
        status: "待审批"
      },
      {
        id: 2,
        employee: "李四",
        reason: "事假",
        startDate: "2023-10-05",
        endDate: "2023-10-06",
        status: "已批准"
      },
      {
        id: 3,
        employee: "王五",
        reason: "年假",
        startDate: "2023-10-10",
        endDate: "2023-10-15",
        status: "已拒绝"
      }
    ]
  },
  {
    id: 2,
    name: "技术开发管理部",
    leaveRequests: [
      {
        id: 4,
        employee: "赵六",
        reason: "病假",
        startDate: "2023-10-02",
        endDate: "2023-10-04",
        status: "待审批"
      },
      {
        id: 5,
        employee: "孙七",
        reason: "事假",
        startDate: "2023-10-07",
        endDate: "2023-10-08",
        status: "已批准"
      }
    ]
  },
  {
    id: 3,
    name: "后勤保障部",
    leaveRequests: [
      {
        id: 6,
        employee: "周八",
        reason: "年假",
        startDate: "2023-10-12",
        endDate: "2023-10-20",
        status: "待审批"
      }
    ]
  },
  {
    id: 4,
    name: "财务部",
    leaveRequests: [
      {
        id: 7,
        employee: "吴九",
        reason: "事假",
        startDate: "2023-10-09",
        endDate: "2023-10-10",
        status: "已批准"
      },
      {
        id: 8,
        employee: "郑十",
        reason: "病假",
        startDate: "2023-10-14",
        endDate: "2023-10-16",
        status: "已拒绝"
      }
    ]
  }
];