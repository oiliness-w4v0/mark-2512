import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/leave-approval')({
  component: RouteComponent,
})

// 测试数据：审批人列表
const approvers = [
  { id: '1', name: '张经理' },
  { id: '2', name: '李总监' },
  { id: '3', name: '王主管' },
]

function RouteComponent() {
  const [formData, setFormData] = useState({
    name: '',
    reason: '',
    approverId: '',
    startDate: '',
    endDate: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'submitted' | 'approved' | 'rejected'>('idle')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = '姓名不能为空'
    if (!formData.reason.trim()) newErrors.reason = '事由不能为空'
    if (!formData.approverId) newErrors.approverId = '请选择审批人'
    if (!formData.startDate) newErrors.startDate = '请选择开始日期'
    if (!formData.endDate) newErrors.endDate = '请选择结束日期'
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = '结束日期不能早于开始日期'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setSubmissionStatus('submitting')
    // 模拟提交延迟
    setTimeout(() => {
      setSubmissionStatus('submitted')
      // 模拟审批过程
      setTimeout(() => {
        setSubmissionStatus(Math.random() > 0.5 ? 'approved' : 'rejected')
      }, 2000)
    }, 1000)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      reason: '',
      approverId: '',
      startDate: '',
      endDate: '',
    })
    setErrors({})
    setSubmissionStatus('idle')
  }

  if (submissionStatus === 'submitted' || submissionStatus === 'approved' || submissionStatus === 'rejected') {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">请假申请进度</h2>
        <div className="mb-4">
          <p><strong>姓名:</strong> {formData.name}</p>
          <p><strong>事由:</strong> {formData.reason}</p>
          <p><strong>审批人:</strong> {approvers.find(a => a.id === formData.approverId)?.name}</p>
          <p><strong>请假时间:</strong> {formData.startDate} 至 {formData.endDate}</p>
        </div>
        <div className="mb-4">
          {submissionStatus === 'submitted' && <p className="text-blue-500">已提交，等待审批...</p>}
          {submissionStatus === 'approved' && <p className="text-green-500">已批准！</p>}
          {submissionStatus === 'rejected' && <p className="text-red-500">已拒绝。</p>}
        </div>
        <button onClick={resetForm} className="px-4 py-2 bg-blue-500 text-white rounded">提交新申请</button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">请假申请</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">姓名 *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">事由 *</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            rows={3}
          />
          {errors.reason && <p className="text-red-500 text-sm">{errors.reason}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">提交至审批人 *</label>
          <select
            name="approverId"
            value={formData.approverId}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">请选择</option>
            {approvers.map(approver => (
              <option key={approver.id} value={approver.id}>{approver.name}</option>
            ))}
          </select>
          {errors.approverId && <p className="text-red-500 text-sm">{errors.approverId}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">请假开始日期 *</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">请假结束日期 *</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate}</p>}
        </div>
        <button
          type="submit"
          disabled={submissionStatus === 'submitting'}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {submissionStatus === 'submitting' ? '提交中...' : '提交申请'}
        </button>
      </form>
    </div>
  )
}
