import React from 'react';
import { Plus, Trash2, Calendar, Building } from 'lucide-react';
import { ARTICLESHIP_TYPES, CA_FIRMS, ALL_CITIES, MONTHS, YEARS, NATURE_OF_WORK, PARTNER_OPTIONS, ARTICLESHIP_CITIES } from '../../utils/constants';

export const Step3Articleship = ({ caPortfolio, setCaPortfolio, isOptional = false }: any) => {
  const addFirm = () => {
    setCaPortfolio({
      ...caPortfolio,
      articleships: [...caPortfolio.articleships, { type: 'Articleship', firmName: '', city: '', noOfPartners: '1 to 10', noOfMonths: '0' }]
    });
  };

  const removeFirm = (index: number) => {
    const newArticleships = [...caPortfolio.articleships];
    newArticleships.splice(index, 1);
    setCaPortfolio({ ...caPortfolio, articleships: newArticleships });
  };

  const updateFirm = (index: number, field: string, value: any) => {
    const newArticleships = [...caPortfolio.articleships];
    newArticleships[index][field] = value;
    setCaPortfolio({ ...caPortfolio, articleships: newArticleships });
  };

  const totalMonths = caPortfolio.articleships.reduce((acc: number, curr: any) => acc + (parseInt(curr.noOfMonths) || 0), 0);

  const toggleNatureOfWork = (work: string) => {
    let currentWorks = caPortfolio.natureOfWork ? caPortfolio.natureOfWork.split(',').map((w: string) => w.trim()).filter(Boolean) : [];
    if (currentWorks.includes(work)) {
      currentWorks = currentWorks.filter((w: string) => w !== work);
    } else {
      currentWorks.push(work);
    }
    setCaPortfolio({ ...caPortfolio, natureOfWork: currentWorks.join(', ') });
  };

  const isWorkSelected = (work: string) => {
    const currentWorks = caPortfolio.natureOfWork ? caPortfolio.natureOfWork.split(',').map((w: string) => w.trim()).filter(Boolean) : [];
    return currentWorks.includes(work);
  };

  const groupedWork = {
    'Audit & Assurance': ['Statutory Audit', 'Internal Audit', 'Tax Audit', 'Forensic Audit & Investigation', 'Bank Audit (Concurrent / Statutory)', 'Information Systems (IS) Audit'],
    'Taxation': ['Transfer Pricing', 'International Taxation', 'GST Compliance & Advisory', 'Income Tax Return Filing & Assessment'],
    'Finance & Advisory': ['Corporate Finance', 'Mergers and Acquisitions (M&A)', 'Due Diligence', 'Valuation Services', 'Risk Advisory Services', 'Financial Reporting & Ind AS Advisory', 'Insolvency & Bankruptcy (IBC)'],
    'Compliance & Accounting': ['ROC / Secretarial Compliances', 'Bookkeeping and Accounting', 'FEMA & RBI Compliances', 'Other']
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {isOptional && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2 text-amber-900 text-xs sm:text-sm font-semibold">
            <span>⭐ <strong>Notice:</strong> Articleship & Training details are <strong>OPTIONAL</strong> for experienced candidates. You may complete or skip this step.</span>
          </div>
          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full border border-amber-200 shrink-0">
            Optional Step
          </span>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Articleship & Training {isOptional && <span className="text-sm font-normal text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 ml-2">(Optional)</span>}</h2>
        <p className="text-gray-500 text-sm mt-1">Detail your articleship experience, firm details, and nature of work.</p>
      </div>

      <div className="space-y-4">
        {caPortfolio.articleships.map((firm, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative group transition-all hover:shadow-md hover:border-gray-200">
            {index > 0 && (
              <button onClick={() => removeFirm(index)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors">
                <Trash2 size={18} />
              </button>
            )}
            
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-5 flex items-center gap-2">
              <Building size={16} /> Firm #{index + 1}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
                <select value={firm.type} onChange={(e) => updateFirm(index, 'type', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 text-sm">
                  {ARTICLESHIP_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
                {firm.type === 'Other' && (
                  <input
                    type="text"
                    placeholder="Specify type"
                    value={firm.customType || ''}
                    onChange={(e) => updateFirm(index, 'customType', e.target.value)}
                    className="mt-2 w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs"
                  />
                )}
              </div>
              <div className="lg:col-span-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">Firm Name</label>
                <input type="text" list="firmsList" value={firm.firmName} onChange={(e) => updateFirm(index, 'firmName', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 text-sm" placeholder="Enter or select" />
                <datalist id="firmsList">
                  {CA_FIRMS.map(f => <option key={f} value={f} />)}
                </datalist>
                {firm.firmName === 'Other' && (
                  <input
                    type="text"
                    placeholder="Enter firm name"
                    value={firm.customFirmName || ''}
                    onChange={(e) => updateFirm(index, 'customFirmName', e.target.value)}
                    className="mt-2 w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs"
                  />
                )}
              </div>
              <div className="lg:col-span-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">City</label>
                <input type="text" list="citiesList" value={firm.city} onChange={(e) => updateFirm(index, 'city', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 text-sm" placeholder="Search city" />
                <datalist id="citiesList">
                  {ARTICLESHIP_CITIES.map(c => <option key={c} value={c} />)}
                </datalist>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {['Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Ahmedabad', 'Kolkata', 'Hyderabad', 'Jaipur'].map(topCity => (
                    <button
                      key={topCity}
                      type="button"
                      onClick={() => updateFirm(index, 'city', topCity)}
                      className={`px-1.5 py-0.5 text-[10px] rounded transition-colors ${
                        firm.city === topCity
                          ? 'bg-primary text-white font-medium shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {topCity}
                    </button>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">Partners</label>
                <select value={firm.noOfPartners || '1 to 10'} onChange={(e) => updateFirm(index, 'noOfPartners', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 text-sm">
                  {PARTNER_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt} Partners</option>
                  ))}
                  {firm.noOfPartners && !PARTNER_OPTIONS.includes(firm.noOfPartners) && (
                    <option value={firm.noOfPartners}>{firm.noOfPartners} Partners</option>
                  )}
                </select>
              </div>
              <div className="lg:col-span-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">Duration (Months)</label>
                <input type="number" min="0" max="36" value={firm.noOfMonths} onChange={(e) => updateFirm(index, 'noOfMonths', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 text-sm" />
              </div>
            </div>
          </div>
        ))}

        <button onClick={addFirm} className="flex items-center gap-2 text-primary font-semibold text-sm bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-xl transition-colors border border-blue-100 border-dashed w-full justify-center cursor-pointer">
          <Plus size={18} /> Add another articleship / training
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 gap-4">
          <h3 className="text-lg font-semibold text-gray-900">Articleship Summary</h3>
          <div className="bg-blue-50 text-blue-900 px-4 py-2 rounded-xl font-bold flex items-center gap-2 border border-blue-100">
            <Calendar size={18} className="text-primary" />
            Total Experience: {totalMonths} Months
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Completion Date / Due Date</label>
            <div className="flex gap-2">
              <select value={caPortfolio.articleshipCompletionDateMonth} onChange={(e) => setCaPortfolio({...caPortfolio, articleshipCompletionDateMonth: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm">
                <option value="">Month</option>
                {MONTHS.map(m => <option key={m}>{m}</option>)}
              </select>
              <select value={caPortfolio.articleshipCompletionDateYear} onChange={(e) => setCaPortfolio({...caPortfolio, articleshipCompletionDateYear: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm">
                <option value="">Year</option>
                {YEARS.map(y => <option key={y}>{y}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">GMCS Program Completed?</label>
            <div className="flex bg-gray-50 rounded-xl p-1 border border-gray-200">
              <button 
                type="button" 
                onClick={() => setCaPortfolio({...caPortfolio, gmcsCompleted: 'Yes'})} 
                className={`flex-1 text-sm py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  caPortfolio.gmcsCompleted === 'Yes' 
                    ? 'bg-blue-600 text-white shadow-sm font-semibold' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Yes
              </button>
              <button 
                type="button" 
                onClick={() => setCaPortfolio({...caPortfolio, gmcsCompleted: 'No'})} 
                className={`flex-1 text-sm py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  caPortfolio.gmcsCompleted === 'No' 
                    ? 'bg-blue-600 text-white shadow-sm font-semibold' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                No
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Industrial Trainee (last 12m)?</label>
            <div className="flex bg-gray-50 rounded-xl p-1 border border-gray-200">
              <button 
                type="button" 
                onClick={() => setCaPortfolio({...caPortfolio, industrialTrainee: 'Yes'})} 
                className={`flex-1 text-sm py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  caPortfolio.industrialTrainee === 'Yes' 
                    ? 'bg-blue-600 text-white shadow-sm font-semibold' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Yes
              </button>
              <button 
                type="button" 
                onClick={() => setCaPortfolio({...caPortfolio, industrialTrainee: 'No'})} 
                className={`flex-1 text-sm py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  caPortfolio.industrialTrainee === 'No' 
                    ? 'bg-blue-600 text-white shadow-sm font-semibold' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                No
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Done Listed Company Work?</label>
            <div className="flex bg-gray-50 rounded-xl p-1 border border-gray-200">
              <button 
                type="button" 
                onClick={() => setCaPortfolio({...caPortfolio, listedCompanyWork: 'Yes'})} 
                className={`flex-1 text-sm py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  caPortfolio.listedCompanyWork === 'Yes' 
                    ? 'bg-blue-600 text-white shadow-sm font-semibold' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Yes
              </button>
              <button 
                type="button" 
                onClick={() => setCaPortfolio({...caPortfolio, listedCompanyWork: 'No'})} 
                className={`flex-1 text-sm py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  caPortfolio.listedCompanyWork === 'No' 
                    ? 'bg-blue-600 text-white shadow-sm font-semibold' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                No
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-4 mb-6">
          Nature of Work <span className="text-sm font-normal text-gray-500">(You may select multiple)</span>
        </h3>
        <div className="space-y-6">
          {Object.entries(groupedWork).map(([category, works]) => (
            <div key={category}>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{category}</h4>
              <div className="flex flex-wrap gap-2">
                {works.map((work) => {
                  const selected = isWorkSelected(work);
                  return (
                    <button
                      key={work}
                      type="button"
                      onClick={() => toggleNatureOfWork(work)}
                      className={`px-4 py-2 text-sm rounded-xl border font-medium transition-all duration-200 ${
                        selected 
                          ? 'bg-blue-50 border-primary text-primary shadow-sm' 
                          : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {work}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        {isWorkSelected('Other') && (
          <div className="mt-5 pt-4 border-t border-gray-100 animate-in fade-in">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Specify Other Nature of Work</label>
            <input
              type="text"
              value={caPortfolio.otherNatureOfWork || ''}
              onChange={(e) => setCaPortfolio({ ...caPortfolio, otherNatureOfWork: e.target.value })}
              placeholder="e.g. ERP Implementation, SAP FICO, Transaction Advisory"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm"
            />
          </div>
        )}
      </div>
    </div>
  );
};
