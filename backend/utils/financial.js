export const calculateEMI = (principal, annualRate, months) => {
  const monthlyRate = annualRate / 12 / 100
  if (monthlyRate === 0) return principal / months
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
              (Math.pow(1 + monthlyRate, months) - 1)
  return Math.round(emi)
}

export const generateAmortizationSchedule = (principal, annualRate, months) => {
  const monthlyRate = annualRate / 12 / 100
  const emi = calculateEMI(principal, annualRate, months)
  const schedule = []
  let balance = principal

  for (let month = 1; month <= months; month++) {
    const interest = balance * monthlyRate
    const principalPayment = emi - interest
    balance -= principalPayment

    schedule.push({
      month,
      emi,
      principal: Math.round(principalPayment),
      interest: Math.round(interest),
      balance: Math.max(0, Math.round(balance)),
    })
  }

  return schedule
}

export const calculateEarlyPaymentBenefit = (principal, annualRate, months, extraPayment) => {
  const monthlyRate = annualRate / 12 / 100
  const emi = calculateEMI(principal, annualRate, months)
  
  let balance = principal
  let totalInterest = 0
  let monthCount = 0

  while (balance > 0 && monthCount < months * 2) {
    const interest = balance * monthlyRate
    const payment = Math.min(emi + extraPayment, balance + interest)
    balance = balance + interest - payment
    totalInterest += interest
    monthCount++
  }

  const originalInterest = (emi * months) - principal
  const interestSaved = originalInterest - totalInterest

  return {
    newTenure: monthCount,
    interestSaved: Math.round(interestSaved),
    tenureSaved: months - monthCount,
    newTotal: principal + Math.round(totalInterest),
  }
}
