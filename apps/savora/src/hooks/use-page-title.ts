import { useEffect } from 'react';

const SITE_NAME = 'Savora';

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Manila, Philippines`;
  }, [title]);
}
