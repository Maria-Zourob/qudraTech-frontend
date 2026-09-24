'use client';

import {createContext, useCallback, useContext, useState} from 'react';

interface ConfirmOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

type ConfirmContextValue = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function ConfirmProvider({children}: {children: React.ReactNode}) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback((opts: ConfirmOptions) => {
    setOptions(opts);
    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  }, []);

  function handleClose(result: boolean) {
    resolver?.(result);
    setOptions(null);
    setResolver(null);
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      {options && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
          <div
            onClick={() => handleClose(false)}
            className="fixed inset-0 bg-black/50"
          />
          <div
            className="relative w-full max-w-sm bg-white p-6 shadow-xl"
            style={{borderTop: `3px solid ${options.danger ? '#C0392B' : 'var(--color-navy)'}`}}
          >
            <h2 className="font-heading text-lg font-bold mb-2" style={{color: 'var(--color-navy)'}}>
              {options.title}
            </h2>
            {options.description && (
              <p className="text-sm mb-6" style={{color: 'var(--color-ink)', opacity: 0.75}}>
                {options.description}
              </p>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => handleClose(false)}
                className="px-4 py-2 text-sm font-medium border"
                style={{borderColor: 'var(--color-line)', color: 'var(--color-ink)'}}
              >
                {options.cancelLabel ?? 'إلغاء'}
              </button>
              <button
                onClick={() => handleClose(true)}
                className="px-4 py-2 text-sm font-medium text-white"
                style={{background: options.danger ? '#C0392B' : 'var(--color-navy)'}}
              >
                {options.confirmLabel ?? 'تأكيد'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) throw new Error('useConfirm must be used within ConfirmProvider');
  return context;
}