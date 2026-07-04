import React, { useState } from 'react';
import { Landmark, Menu, X, Sun, Moon, LogOut, User, LayoutDashboard, ShieldCheck, ChevronDown } from 'lucide-react';
import { FirebaseUser } from '../lib/firebase';
import { useLanguage, LANGUAGE_OPTIONS } from '../lib/translations';
import { useCurrency, CURRENCY_OPTIONS } from '../lib/currencies';

interface NavbarProps {
  user: FirebaseUser | null;
  userRole: 'admin' | 'user';
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
  onLogout: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export default function Navbar({
  user,
  userRole,
  currentTab,
  setCurrentTab,
  darkMode,
  setDarkMode,
  onLogout,
  onOpenAuth,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  
  const { language, setLanguage, t } = useLanguage();
  const { currency, setCurrency } = useCurrency();

  const navItems = [
    { id: 'home', label: t.home },
    { id: 'features', label: t.features },
    { id: 'about', label: t.about },
  ];

  if (user) {
    navItems.push({ id: 'predictor', label: t.loanPrediction });
    navItems.push({ id: 'dashboard', label: t.userDashboard });
    if (userRole === 'admin') {
      navItems.push({ id: 'admin', label: t.adminPanel });
    }
  }

  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md transition-colors duration-200 dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div 
            className="flex cursor-pointer items-center space-x-2" 
            onClick={() => handleTabClick('home')}
            id="nav-logo"
          >
            <div className="rounded-lg bg-emerald-500 p-2 text-white dark:bg-emerald-600">
              <Landmark className="h-6 w-6" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Smart<span className="text-emerald-500">Lender</span> <span className="text-xs font-semibold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded ml-1">AI</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1 lg:space-x-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  currentTab === item.id
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-slate-900 dark:text-emerald-400'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white'
                }`}
                id={`tab-link-${item.id}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Action buttons */}
          <div className="hidden md:flex md:items-center md:space-x-3">
            {/* Language Dropdown Selector */}
            <div className="relative inline-block text-left mr-1" id="language-selector-desktop">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center space-x-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="Select Language"
              >
                <span className="text-sm">{LANGUAGE_OPTIONS.find(o => o.code === language)?.flag}</span>
                <span className="hidden lg:inline">{LANGUAGE_OPTIONS.find(o => o.code === language)?.name}</span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setLangDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-40 origin-top-right rounded-lg border border-slate-200 bg-white p-1 shadow-lg ring-1 ring-black/5 z-50 dark:border-slate-800 dark:bg-slate-900">
                    {LANGUAGE_OPTIONS.map((option) => (
                      <button
                        key={option.code}
                        onClick={() => {
                          setLanguage(option.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`flex w-full items-center space-x-3 rounded-md px-3 py-1.5 text-left text-xs transition-colors ${
                          language === option.code
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-slate-800 dark:text-emerald-400 font-semibold'
                            : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>{option.flag}</span>
                        <span>{option.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Currency Dropdown Selector */}
            <div className="relative inline-block text-left mr-1" id="currency-selector-desktop">
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center space-x-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="Select Currency"
              >
                <span className="text-sm">{CURRENCY_OPTIONS.find(o => o.code === currency)?.flag}</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{CURRENCY_OPTIONS.find(o => o.code === currency)?.symbol}</span>
                <span className="hidden lg:inline">{currency}</span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {currencyDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setCurrencyDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-40 origin-top-right rounded-lg border border-slate-200 bg-white p-1 shadow-lg ring-1 ring-black/5 z-50 dark:border-slate-800 dark:bg-slate-900">
                    {CURRENCY_OPTIONS.map((option) => (
                      <button
                        key={option.code}
                        onClick={() => {
                          setCurrency(option.code);
                          setCurrencyDropdownOpen(false);
                        }}
                        className={`flex w-full items-center space-x-3 rounded-md px-3 py-1.5 text-left text-xs transition-colors ${
                          currency === option.code
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-slate-800 dark:text-emerald-400 font-semibold'
                            : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>{option.flag}</span>
                        <span className="font-mono font-bold text-slate-600 dark:text-slate-400 w-4 text-center">{option.symbol}</span>
                        <span>{option.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-2 pr-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                  id="user-menu-button"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                  </div>
                  <span className="max-w-[120px] truncate">{user.displayName || user.email}</span>
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg border border-slate-200 bg-white p-1 shadow-lg ring-1 ring-black/5 focus:outline-none dark:border-slate-800 dark:bg-slate-900">
                    <div className="px-3 py-2 text-xs border-b border-slate-100 dark:border-slate-800">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {user.displayName || 'Lender Client'}
                      </p>
                      <p className="text-slate-500 truncate mt-0.5">{user.email}</p>
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium mt-1.5 ${
                        userRole === 'admin' 
                          ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300' 
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      }`}>
                        {userRole === 'admin' ? <ShieldCheck className="h-3 w-3 mr-1" /> : <LayoutDashboard className="h-3 w-3 mr-1" />}
                        {userRole === 'admin' ? 'Administrator' : 'Standard Account'}
                      </span>
                    </div>
                    <button
                      onClick={() => { handleTabClick('dashboard'); setDropdownOpen(false); }}
                      className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <User className="mr-2 h-4 w-4 text-slate-500" />
                      My Profile
                    </button>
                    <button
                      onClick={() => { onLogout(); setDropdownOpen(false); }}
                      className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                      id="logout-button"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                  id="navbar-login-btn"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 focus:outline-none dark:bg-emerald-600 dark:hover:bg-emerald-700"
                  id="navbar-register-btn"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 px-2 pt-2 pb-3 shadow-lg dark:border-slate-800 dark:bg-slate-950/95">
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`block w-full rounded-md px-3 py-2 text-left text-base font-medium ${
                  currentTab === item.id
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-slate-900 dark:text-emerald-400'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800">
            {/* Mobile Language Selector */}
            <div className="px-3 mb-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Language / भाषा / Idioma</p>
              <div className="grid grid-cols-5 gap-2">
                {LANGUAGE_OPTIONS.map((option) => (
                  <button
                    key={option.code}
                    onClick={() => setLanguage(option.code)}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                      language === option.code
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-slate-900 dark:border-emerald-500 dark:text-emerald-400 font-bold shadow-sm'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:hover:bg-slate-900 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-lg">{option.flag}</span>
                    <span className="text-[10px] mt-1">{option.code.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Currency Selector */}
            <div className="px-3 mb-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Currency / కరెన్సీ</p>
              <div className="grid grid-cols-4 gap-2">
                {CURRENCY_OPTIONS.map((option) => (
                  <button
                    key={option.code}
                    onClick={() => setCurrency(option.code)}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                      currency === option.code
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-slate-900 dark:border-emerald-500 dark:text-emerald-400 font-bold shadow-sm'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:hover:bg-slate-900 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">{option.symbol}</span>
                    <span className="text-[10px] mt-0.5">{option.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {user ? (
              <div className="px-3">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white text-base font-bold">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {user.displayName || 'Lender Client'}
                    </p>
                    <p className="text-xs text-slate-500 truncate max-w-[200px]">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                  className="flex w-full items-center justify-center rounded-md border border-slate-200 bg-white py-2 px-4 text-sm font-medium text-red-600 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 px-3">
                <button
                  onClick={() => { onOpenAuth('login'); setMobileMenuOpen(false); }}
                  className="flex w-full items-center justify-center rounded-md border border-slate-200 bg-white py-2 px-4 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { onOpenAuth('register'); setMobileMenuOpen(false); }}
                  className="flex w-full items-center justify-center rounded-md bg-emerald-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-emerald-600 focus:outline-none dark:bg-emerald-600 dark:hover:bg-emerald-700"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
