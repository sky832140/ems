import { useState } from 'react'
import PayrollCalculator from '../../components/payroll/PayrollCalculator'
import PayrollHistory from '../../components/payroll/PayrollHistory'

export default function GeneratePayroll() {
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold text-white-800">Payroll Management</h2>
      
      <PayrollCalculator onEmployeeSelect={setSelectedEmployee} />
      
      {selectedEmployee && (
        <PayrollHistory employeeId={selectedEmployee} />
      )}
    </div>
  )
}