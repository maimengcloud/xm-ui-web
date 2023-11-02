
import $mdp from "@/api/mdp_pub/mdp_config"
export const modulesOfRouter = [
    {
        id: 'mall',
        path:  '/dashboard',
        context:'mallm', 
    },
    {
        id: 'mall-marketing',
        path: '/dashboard', 
        context:'mallm', 
    },  
    {
        id: 'mdp-arc',
        path: '/dashboard',
        context: $mdp.getArcContext()
    },  
    {
        id: 'mdp-sys',
        path: '/mdp/sys/branch/set',
        context: $mdp.getSysContext()
    },  
    {
        id: 'oa-asset',
        path: '/oa/erp/ass/assetDetail/AssetDetailMng',
        context: 'oa'
    },  
    {
        id: 'oa-attendance',
        path: '/oa/kq/attendance/AttendanceMonth',
        context: 'oa'
    },  
    {
        id: 'oa-car',
        path: '/oa/car/components/watch',
        context: 'oa'
    },  
    {
        id: 'oa-contract',
        path: '/oa/ht/contractCard/ContractCardMng',
        context: 'oa'
    },  
    {
        id: 'oa-customer',
        path: '/oa/crm/customer/CustomerIndex',
        context: 'oa'
    },  
    {
        id: 'oa-file',
        path: '/oa/hr/user/employeeInfo',
        context: 'oa'
    },  
    {
        id: 'oa-finance',
        path: '/dashboard',
        context: 'ac'
    },  
    {
        id: 'oa-meeting',
        path: '/oa/meet/meetMeeting/MeetMeetingMng',
        context: 'oa'
    },  
    {
        id: 'oa-office',
        path: '/oa/om/omAppliance/OmApplianceMng',
        context: 'oa'
    },  
    {
        id: 'oa-performance',
        path: '/oa/jx/AssesssSatistical',
        context: 'oa'
    },  
    {
        id: 'oa-schedule',
        path: '/oa/rc/rcSchedule/RcScheduleMng',
        context: 'oa'
    },  
    {
        id: 'oa-seal',
        path: '/oa/sig/sigSignet/SigSignetMng',
        context: 'oa'
    },  
    {
        id: 'oa-supervision',
        path: '/oa/duban/dubanItem/DutyDubanItem',
        context: 'oa'
    },  
    {
        id: 'xm-analysis',
        path: '/xm/rpt/report/index',
        context: 'xm'
    },  
    {
        id: 'xm-development',
        path: '',
        context: 'xm'
    },
    {
        id: 'xm-pipeline',
        path: '',
        context: 'xm'
    },
    {
        id: 'xm-product',
        path: '/xm/core/product/mng',
        context: 'xm'
    },
    {
        id: 'xm-project',
        path: '/xm/core/project/mng',
        context: 'xm'
    },
    {
        id: 'xm-test',
        path: '/xm/core/casedb/mng',
        context: 'xm'
    },
    {
        id: 'xm-workload',
        path: '/xm/core/workload/mng',
        context: 'xm'
    },
    {
        id: 'xm-crowd',
        path: '/xm/core/crowd/mng',
        context: 'xm'
    }
]