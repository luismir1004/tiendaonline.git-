import { useEffect, useState } from 'react';
import useAnalyticsStore from '../stores/analyticsStore';

/**
 * Custom Hook for A/B Testing
 * @param {string} testId - Unique identifier for the test (e.g., 'buy_button_color')
 * @returns {string} - 'A' or 'B' (or other variant)
 */
const useABTest = (testId) => {
  const { getVariant, trackEvent } = useAnalyticsStore();
  const [variant, setVariant] = useState(null);

  useEffect(() => {
    // Get assigned variant from store (persisted)
    const assignedVariant = getVariant(testId);
    setVariant(assignedVariant);

    // Track exposure event once
    trackEvent('ab_test_exposure', { testId, variant: assignedVariant });
  }, [testId, getVariant, trackEvent]);

  // Return variant (default to 'A' during initial render to avoid hydration mismatch if SSR, though this is SPA)
  return variant || 'A';
};

export default useABTest;
