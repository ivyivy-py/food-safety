import React from 'react';
import { AdditiveDossier } from '../types';

interface PesticideMrlSectionProps {
  dossier: AdditiveDossier;
}

export const PesticideMrlSection: React.FC<PesticideMrlSectionProps> = ({ dossier }) => {
  const { pesticideResidues, pesticideGauge } = dossier;

  return (
    <section className="bg-white rounded-xl shadow-xs border border-[#e2e8f0] p-5 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006c49] text-[22px]">
              pest_control
            </span>
            <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-lg sm:text-xl text-[#001318]">
              Pesticide Residue &amp; MRL Harmonization Screen
            </h3>
          </div>
          <p className="font-['Inter'] text-xs sm:text-sm text-[#42484a]">
            Cross-commodity maximum residue limits (MRL) assessed across agricultural matrices and processing adjuncts.
          </p>
        </div>
        <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-xs shrink-0 flex-wrap">
          <span className="px-2.5 py-1 rounded bg-[#6cf8bb] text-[#00714d] font-semibold border border-[#00714d]/20">
            EU Ban Enforced (2020/18)
          </span>
          <span className="px-2.5 py-1 rounded bg-[#e5eeff] text-[#0b1c30] font-medium border border-[#c2c7c9]/40">
            EPA Title 40 CFR
          </span>
        </div>
      </div>

      {/* MRL Matrix Table */}
      <div className="overflow-x-auto rounded-lg border border-[#e2e8f0]">
        <table className="w-full text-left font-['Inter'] text-xs sm:text-sm">
          <thead className="bg-[#eff4ff] text-[#42484a] font-bold uppercase tracking-wider text-[11px] border-b border-[#e2e8f0]">
            <tr>
              <th className="py-3 px-3 sm:px-4">Pesticide Active Compound</th>
              <th className="py-3 px-3 sm:px-4">Chemical Group</th>
              <th className="py-3 px-3 sm:px-4">Detected Assay Residue</th>
              <th className="py-3 px-3 sm:px-4">EU MRL Limit</th>
              <th className="py-3 px-3 sm:px-4">US EPA Tolerance</th>
              <th className="py-3 px-3 sm:px-4">Israel MRL (MoH)</th>
              <th className="py-3 px-3 sm:px-4">Safety Verdict</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e8f0] text-[#0b1c30]">
            {pesticideResidues.map((row, idx) => (
              <tr
                key={idx}
                className={`transition-colors ${
                  row.isViolation ? 'bg-[#ffdad6]/20 hover:bg-[#ffdad6]/30' : 'bg-white hover:bg-slate-50'
                }`}
              >
                <td className="py-3.5 px-3 sm:px-4 font-semibold text-[#001318]">
                  {row.compound}
                  <span className="block font-['JetBrains_Mono'] text-[11px] text-[#ba1a1a]">
                    CAS {row.cas}
                  </span>
                </td>
                <td className="py-3.5 px-3 sm:px-4 font-['JetBrains_Mono'] text-xs text-[#42484a]">
                  {row.group}
                </td>
                <td className={`py-3.5 px-3 sm:px-4 font-['JetBrains_Mono'] text-xs font-bold ${
                  row.isViolation ? 'text-[#ba1a1a]' : 'text-[#006c49]'
                }`}>
                  {row.detected}
                </td>
                <td className="py-3.5 px-3 sm:px-4 font-['JetBrains_Mono'] text-xs">
                  {row.euMrl}
                </td>
                <td className="py-3.5 px-3 sm:px-4 font-['JetBrains_Mono'] text-xs text-[#42484a]">
                  {row.usEpa}
                </td>
                <td className="py-3.5 px-3 sm:px-4 font-['JetBrains_Mono'] text-xs text-[#42484a]">
                  {row.israelMrl}
                </td>
                <td className="py-3.5 px-3 sm:px-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded font-['JetBrains_Mono'] text-xs font-bold ${
                    row.isViolation
                      ? 'bg-[#ba1a1a] text-white shadow-2xs'
                      : 'bg-[#6cf8bb] text-[#00714d]'
                  }`}>
                    <span className="material-symbols-outlined text-[14px]">
                      {row.isViolation ? 'close' : 'check'}
                    </span>
                    {row.verdict}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MRL Interactive Visual Spectrum / Comparator Gauge */}
      <div className="bg-[#eff4ff] rounded-xl p-4 sm:p-5 border border-[#e5eeff] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <span className="font-['Plus_Jakarta_Sans'] font-semibold text-sm sm:text-base text-[#001318] block">
              Harmonized Residue Exposure Gauge: {pesticideGauge.compound}
            </span>
            <span className="font-['Inter'] text-xs text-[#42484a] block">
              Comparison of detected matrix residue ({pesticideGauge.detected} mg/kg) against conflicting multi-state limits
            </span>
          </div>
          <span className="font-['JetBrains_Mono'] text-xs text-[#ba1a1a] bg-white px-3 py-1 rounded border border-[#ffdad6] font-semibold self-start sm:self-auto">
            {pesticideGauge.alert}
          </span>
        </div>

        {/* Gauge Bar Strip */}
        <div className="space-y-2">
          <div className="relative w-full h-8 bg-[#e5eeff] rounded-lg overflow-hidden flex items-center border border-[#c2c7c9]/40">
            {/* Safe zone up to EU Limit (18%) */}
            <div className="absolute left-0 top-0 bottom-0 bg-[#006c49]/20 w-[18%]"></div>
            {/* Measured level bar (42%) */}
            <div className="absolute left-0 top-0 bottom-0 bg-[#ba1a1a]/30 w-[42%]"></div>
            {/* Pin Line for Sample */}
            <div
              className="absolute left-[42%] top-0 bottom-0 w-1 bg-[#ba1a1a] z-20 shadow-md"
              title={`Detected Sample: ${pesticideGauge.detected} mg/kg`}
            ></div>
            {/* Pin Line for EU MRL */}
            <div
              className="absolute left-[18%] top-0 bottom-0 w-0.5 bg-[#001318] z-10"
              title={`EU Limit: ${pesticideGauge.euLimit} mg/kg`}
            ></div>
            {/* Pin Line for US EPA */}
            <div
              className="absolute left-[70%] top-0 bottom-0 w-0.5 bg-[#72787a] z-10"
              title={`US EPA Limit: ${pesticideGauge.usLimit} mg/kg`}
            ></div>
          </div>

          <div className="flex justify-between font-['JetBrains_Mono'] text-[11px] sm:text-xs text-[#42484a] pt-1 flex-wrap gap-1">
            <span>0.00 mg/kg</span>
            <span className="text-[#0b1c30] font-semibold">EU Limit ({pesticideGauge.euLimit} mg/kg)</span>
            <span className="text-[#ba1a1a] font-bold">Detected Sample ({pesticideGauge.detected} mg/kg)</span>
            <span>US EPA ({pesticideGauge.usLimit} mg/kg)</span>
            <span>{pesticideGauge.maxScale} mg/kg</span>
          </div>
        </div>

        <div className="p-3 bg-white rounded-lg border border-[#e2e8f0] font-['Inter'] text-xs text-[#42484a] flex items-start gap-2.5">
          <span className="material-symbols-outlined text-[#72787a] text-[18px] shrink-0 mt-0.5">
            balance
          </span>
          <span className="leading-relaxed">
            <strong>Regulatory Divergence Notice:</strong> {pesticideGauge.notice}
          </span>
        </div>
      </div>
    </section>
  );
};
