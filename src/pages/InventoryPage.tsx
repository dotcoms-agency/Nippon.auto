import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useTrucks, useBrands, formatPrice } from '@/lib/hooks';
import TruckCard from '@/components/TruckCard';
import { SkeletonGrid } from '@/components/Skeletons';

type SortKey = 'newest' | 'lowestPrice' | 'highestPrice' | 'year';

export default function InventoryPage() {
  const { t, lang } = useI18n();
  const { trucks, loading } = useTrucks();
  const { brands } = useBrands();
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState('');
  const [brandFilter, setBrandFilter] = useState<string>(searchParams.get('brand') || '');
  const [yearMin, setYearMin] = useState<string>('');
  const [priceMin, setPriceMin] = useState<string>('');
  const [priceMax, setPriceMax] = useState<string>('');
  const [mileageMax, setMileageMax] = useState<string>('');
  const [transmissionFilter, setTransmissionFilter] = useState<string>('');
  const [fuelFilter, setFuelFilter] = useState<string>('');
  const [bodyTypeFilter, setBodyTypeFilter] = useState<string>('');
  const [sort, setSort] = useState<SortKey>('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const brand = searchParams.get('brand');
    if (brand) setBrandFilter(brand);
  }, [searchParams]);

  const transmissions = useMemo(() => {
    const set = new Set(trucks.map(tr => tr.transmission).filter(Boolean) as string[]);
    return Array.from(set);
  }, [trucks]);

  const fuels = useMemo(() => {
    const set = new Set(trucks.map(tr => tr.fuel).filter(Boolean) as string[]);
    return Array.from(set);
  }, [trucks]);

  const bodyTypes = useMemo(() => {
    const set = new Set(trucks.map(tr => tr.body_type).filter(Boolean) as string[]);
    return Array.from(set);
  }, [trucks]);

  const filtered = useMemo(() => {
    let result = [...trucks];

    if (keyword.trim()) {
      const kw = keyword.toLowerCase().trim();
      result = result.filter(tr =>
        tr.model.toLowerCase().includes(kw) ||
        (tr.brand?.name || '').toLowerCase().includes(kw) ||
        (tr.description || '').toLowerCase().includes(kw)
      );
    }

    if (brandFilter) result = result.filter(tr => tr.brand_id === brandFilter);
    if (yearMin) result = result.filter(tr => (tr.year || 0) >= parseInt(yearMin));
    if (priceMin) result = result.filter(tr => (tr.price || 0) >= parseInt(priceMin));
    if (priceMax) result = result.filter(tr => (tr.price || 0) <= parseInt(priceMax));
    if (mileageMax) result = result.filter(tr => (tr.mileage || 0) <= parseInt(mileageMax));
    if (transmissionFilter) result = result.filter(tr => tr.transmission === transmissionFilter);
    if (fuelFilter) result = result.filter(tr => tr.fuel === fuelFilter);
    if (bodyTypeFilter) result = result.filter(tr => tr.body_type === bodyTypeFilter);

    switch (sort) {
      case 'lowestPrice':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'highestPrice':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'year':
        result.sort((a, b) => (b.year || 0) - (a.year || 0));
        break;
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [trucks, keyword, brandFilter, yearMin, priceMin, priceMax, mileageMax, transmissionFilter, fuelFilter, bodyTypeFilter, sort]);

  const clearAll = () => {
    setKeyword('');
    setBrandFilter('');
    setYearMin('');
    setPriceMin('');
    setPriceMax('');
    setMileageMax('');
    setTransmissionFilter('');
    setFuelFilter('');
    setBodyTypeFilter('');
    setSort('newest');
    setSearchParams({});
  };

  const hasFilters = keyword || brandFilter || yearMin || priceMin || priceMax || mileageMax || transmissionFilter || fuelFilter || bodyTypeFilter;

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <div className="relative py-12 lg:py-16 bg-navy-900/30 border-b border-navy-700/50">
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-electric-400/5 rounded-full blur-[100px]" />
        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl lg:text-5xl font-bold text-white"
          >
            {t('inventory')}
          </motion.h1>
          <p className="mt-2 text-slate-400 text-sm">
            {filtered.length} {t('results')}
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Search + sort bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-4 py-3 glass rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-electric-400/50 transition-smooth"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`lg:hidden flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-smooth ${
              showFilters ? 'bg-electric-400 text-navy-950' : 'glass text-white'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {t('filters')}
            {hasFilters && <span className="w-2 h-2 rounded-full bg-electric-400" />}
          </button>

          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="appearance-none pl-4 pr-10 py-3 glass rounded-xl text-sm text-white focus:outline-none focus:border-electric-400/50 cursor-pointer transition-smooth"
            >
              <option value="newest" className="bg-navy-900">{t('newest')}</option>
              <option value="lowestPrice" className="bg-navy-900">{t('lowestPrice')}</option>
              <option value="highestPrice" className="bg-navy-900">{t('highestPrice')}</option>
              <option value="year" className="bg-navy-900">{t('yearDesc')}</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters sidebar */}
          <AnimatePresence>
            {(showFilters || true) && (
              <motion.aside
                initial={false}
                className={`${
                  showFilters ? 'block' : 'hidden'
                } lg:block fixed lg:static inset-0 z-40 lg:z-auto lg:w-64 flex-shrink-0 overflow-y-auto lg:overflow-visible`}
              >
                <div className="lg:glass lg:rounded-2xl lg:p-5 min-h-screen lg:min-h-0 space-y-5 bg-navy-950 lg:bg-transparent p-4 lg:p-5">
                  <div className="flex items-center justify-between lg:hidden">
                    <h3 className="text-lg font-bold text-white">{t('filters')}</h3>
                    <button onClick={() => setShowFilters(false)}>
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>

                  {/* Brand */}
                  <FilterGroup label={t('brand')}>
                    <select
                      value={brandFilter}
                      onChange={(e) => setBrandFilter(e.target.value)}
                      className="w-full px-3 py-2 bg-navy-800 rounded-lg text-sm text-white border border-navy-700 focus:border-electric-400/50 focus:outline-none"
                    >
                      <option value="">{t('allBrands')}</option>
                      {brands.map(b => (
                        <option key={b.id} value={b.id} className="bg-navy-900">
                          {lang === 'ja' && b.name_ja ? b.name_ja : b.name}
                        </option>
                      ))}
                    </select>
                  </FilterGroup>

                  {/* Year */}
                  <FilterGroup label={t('year')}>
                    <input
                      type="number"
                      value={yearMin}
                      onChange={(e) => setYearMin(e.target.value)}
                      placeholder="2015"
                      className="w-full px-3 py-2 bg-navy-800 rounded-lg text-sm text-white border border-navy-700 focus:border-electric-400/50 focus:outline-none"
                    />
                  </FilterGroup>

                  {/* Price */}
                  <FilterGroup label={t('price')}>
                    <div className="space-y-2">
                      <input
                        type="number"
                        value={priceMin}
                        onChange={(e) => setPriceMin(e.target.value)}
                        placeholder={lang === 'ja' ? '最低' : 'Min'}
                        className="w-full px-3 py-2 bg-navy-800 rounded-lg text-sm text-white border border-navy-700 focus:border-electric-400/50 focus:outline-none"
                      />
                      <input
                        type="number"
                        value={priceMax}
                        onChange={(e) => setPriceMax(e.target.value)}
                        placeholder={lang === 'ja' ? '最高' : 'Max'}
                        className="w-full px-3 py-2 bg-navy-800 rounded-lg text-sm text-white border border-navy-700 focus:border-electric-400/50 focus:outline-none"
                      />
                    </div>
                  </FilterGroup>

                  {/* Mileage */}
                  <FilterGroup label={t('mileage')}>
                    <input
                      type="number"
                      value={mileageMax}
                      onChange={(e) => setMileageMax(e.target.value)}
                      placeholder={lang === 'ja' ? '最大km' : 'Max km'}
                      className="w-full px-3 py-2 bg-navy-800 rounded-lg text-sm text-white border border-navy-700 focus:border-electric-400/50 focus:outline-none"
                    />
                  </FilterGroup>

                  {/* Transmission */}
                  <FilterGroup label={t('transmission')}>
                    <select
                      value={transmissionFilter}
                      onChange={(e) => setTransmissionFilter(e.target.value)}
                      className="w-full px-3 py-2 bg-navy-800 rounded-lg text-sm text-white border border-navy-700 focus:border-electric-400/50 focus:outline-none"
                    >
                      <option value="">{t('all')}</option>
                      {transmissions.map(tr => (
                        <option key={tr} value={tr} className="bg-navy-900">{tr}</option>
                      ))}
                    </select>
                  </FilterGroup>

                  {/* Fuel */}
                  <FilterGroup label={t('fuel')}>
                    <select
                      value={fuelFilter}
                      onChange={(e) => setFuelFilter(e.target.value)}
                      className="w-full px-3 py-2 bg-navy-800 rounded-lg text-sm text-white border border-navy-700 focus:border-electric-400/50 focus:outline-none"
                    >
                      <option value="">{t('all')}</option>
                      {fuels.map(f => (
                        <option key={f} value={f} className="bg-navy-900">{f}</option>
                      ))}
                    </select>
                  </FilterGroup>

                  {/* Body Type */}
                  <FilterGroup label={t('bodyType')}>
                    <select
                      value={bodyTypeFilter}
                      onChange={(e) => setBodyTypeFilter(e.target.value)}
                      className="w-full px-3 py-2 bg-navy-800 rounded-lg text-sm text-white border border-navy-700 focus:border-electric-400/50 focus:outline-none"
                    >
                      <option value="">{t('allTypes')}</option>
                      {bodyTypes.map(bt => (
                        <option key={bt} value={bt} className="bg-navy-900">{bt}</option>
                      ))}
                    </select>
                  </FilterGroup>

                  {hasFilters && (
                    <button
                      onClick={clearAll}
                      className="w-full py-2 rounded-lg text-sm text-electric-400 border border-electric-400/30 hover:bg-electric-400/10 transition-smooth"
                    >
                      {t('clearFilters')}
                    </button>
                  )}
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Truck grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <SkeletonGrid count={8} />
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-slate-400 mb-4">{t('noResults')}</p>
                {hasFilters && (
                  <button
                    onClick={clearAll}
                    className="text-sm text-electric-400 hover:underline"
                  >
                    {t('clearFilters')}
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {filtered.map((truck, i) => (
                  <TruckCard key={truck.id} truck={truck} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}
