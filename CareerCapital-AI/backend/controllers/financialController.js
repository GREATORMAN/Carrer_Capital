import { calculateEMI as calcEMI, calculateEarlyPaymentBenefit as calcBenefit } from '../utils/financial.js'

export const calculateEMI = (principal, rate, tenure) => {
  return calcEMI(principal, rate, tenure)
}

export const calculateEarlyPaymentBenefit = (principal, rate, tenure, extraPayment) => {
  return calcBenefit(principal, rate, tenure, extraPayment)
}
