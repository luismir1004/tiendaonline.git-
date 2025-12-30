import React from 'react';
import { CreditCard, Info } from 'lucide-react';
import useCurrency from '../hooks/useCurrency';

const InstallmentWidget = ({ price }) => {
  const { convertPrice, getCurrencySymbol } = useCurrency();
  const convertedPrice = convertPrice(price);
  
  // Example calculation: 3 installments without interest or 12 with interest
  const installment3 = convertedPrice / 3;
  
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 my-4 flex items-start gap-3">
      <div className="p-2 bg-white rounded-full text-indigo-600 shadow-sm mt-0.5">
        <CreditCard size={18} />
      </div>
      <div className="flex-1">
        <p className="text-sm text-slate-900 font-medium">
          Paga en 3 cuotas de <span className="font-bold">{getCurrencySymbol()}{installment3.toFixed(2)}</span> sin interés.
        </p>
        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 cursor-pointer hover:text-indigo-600 transition-colors">
          Ver más opciones de financiación <Info size={12} />
        </p>
      </div>
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/2560px-PayPal.svg.png" alt="Paypal" className="h-4 object-contain mt-1 opacity-60" />
    </div>
  );
};

export default InstallmentWidget;
