import React from 'react'
import ForgotPassword from '@components/Auth/ForgotPassword';
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ekşicode - Şifremi Unuttum',
  description: 'Ekşicode - Yazılımcı Geliştirme Platformu'
}

function passwordReminder() {
  
  return (
    <div className="flex flex-col items-center justify-center">
    <ForgotPassword />
  </div>
  )
}

export default passwordReminder;
