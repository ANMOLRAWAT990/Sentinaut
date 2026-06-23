import React, { useState } from 'react';
import { Modal } from '../ui/Modal';

export function Footer() {
  const [activeModal, setActiveModal] = useState(null);
  return (
    <footer className="w-full border-t border-slate-200 dark:border-[#30363d] bg-slate-50 dark:bg-[#0d1117] py-8 px-6 mt-auto">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-slate-500 dark:text-[#8b949e]">
          © {new Date().getFullYear()} SentiNaut. All rights reserved.
        </p>
        <div className="flex gap-4 text-sm text-slate-500 dark:text-[#8b949e]">
          <button onClick={() => setActiveModal('privacy')} className="hover:text-slate-900 dark:hover:text-[#e6edf3] bg-transparent border-0 cursor-pointer">Privacy Policy</button>
          <button onClick={() => setActiveModal('terms')} className="hover:text-slate-900 dark:hover:text-[#e6edf3] bg-transparent border-0 cursor-pointer">Terms of Service</button>
        </div>
      </div>

      <Modal isOpen={activeModal === 'privacy'} onClose={() => setActiveModal(null)} title="Privacy Policy">
        <div className="space-y-4 text-sm text-slate-600 dark:text-[#8b949e]">
          <p><strong>1. Data Collection:</strong> We collect review text, metadata, and user information strictly for the purpose of analyzing sentiment and improving operations.</p>
          <p><strong>2. AI Processing:</strong> Your data is securely processed via Google Gemini APIs. No guest data is used to train public models.</p>
          <p><strong>3. Security:</strong> We implement industry-standard security measures to protect your property's reputation data.</p>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'terms'} onClose={() => setActiveModal(null)} title="Terms of Service">
        <div className="space-y-4 text-sm text-slate-600 dark:text-[#8b949e]">
          <p><strong>1. Usage:</strong> SentiNaut is provided "as is". We are not responsible for automated decisions or AI hallucinations that may impact your business.</p>
          <p><strong>2. Intellectual Property:</strong> All dashboards, analysis structures, and code logic are the intellectual property of SentiNaut.</p>
          <p><strong>3. Termination:</strong> We reserve the right to suspend accounts that abuse our API rate limits or violate these terms.</p>
        </div>
      </Modal>
    </footer>
  );
}
