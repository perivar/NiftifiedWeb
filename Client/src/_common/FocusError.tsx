import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';
import * as Scroll from 'react-scroll';

const scroll = Scroll.animateScroll;

const FocusError = () => {
  const { errors, isSubmitting, isValidating } = useFormikContext();

  useEffect(() => {
    if (isSubmitting && !isValidating) {
      const keys = Object.keys(errors);
      if (keys.length > 0) {
        const selector = `[name=${keys[0]}]`;
        const errorElement = document.querySelector(selector) as HTMLElement;
        if (errorElement) {
          errorElement.focus();
        } else {
          // failed to find the error element, then scroll to top instead
          scroll.scrollToTop();
        }
      }
    }
  }, [errors, isSubmitting, isValidating]);

  return null;
};

export default FocusError;
