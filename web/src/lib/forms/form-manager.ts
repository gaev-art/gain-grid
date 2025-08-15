import { useCallback, useRef, useState } from 'react';
import { ZodError, ZodSchema } from 'zod';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface FormState<T> {
  data: T;
  errors: Record<string, string>;
  isDirty: boolean;
  isSubmitting: boolean;
  isValid: boolean;
}

export interface FormManagerOptions<T> {
  schema: ZodSchema<T>;
  initialData: T;
  onSubmit?: (data: T) => Promise<void> | void;
  onValidationError?: (errors: Record<string, string>) => void;
}

export class FormManager<T> {
  private schema: ZodSchema<T>;
  private initialData: T;

  constructor(schema: ZodSchema<T>, initialData: T) {
    this.schema = schema;
    this.initialData = initialData;
  }

  validate(data: Partial<T>): ValidationResult {
    try {
      this.schema.parse(data);
      return { isValid: true, errors: {} };
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string> = {};
        error.issues.forEach(err => {
          const field = err.path.join('.');
          errors[field] = err.message;
        });
        return { isValid: false, errors };
      }
      return { isValid: false, errors: { general: 'Validation failed' } };
    }
  }

  validateField(field: keyof T, value: any): string | null {
    try {
      const partialData = { ...this.initialData, [field]: value };
      this.schema.parse(partialData);
      return null;
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldError = error.issues.find(err => err.path[0] === field);
        return fieldError?.message || null;
      }
      return 'Invalid value';
    }
  }

  getInitialData(): T {
    return this.initialData;
  }

  reset(): T {
    return this.initialData;
  }
}

export function useFormManager<T>(options: FormManagerOptions<T>) {
  const { schema, initialData, onSubmit, onValidationError } = options;
  const formManager = useRef(new FormManager(schema, initialData));
  const [state, setState] = useState<FormState<T>>({
    data: initialData,
    errors: {},
    isDirty: false,
    isSubmitting: false,
    isValid: false,
  });

  const updateField = useCallback(
    (field: keyof T, value: any) => {
      setState(prev => {
        const newData = { ...prev.data, [field]: value };
        const validation = formManager.current.validate(newData);
        const isDirty = JSON.stringify(newData) !== JSON.stringify(initialData);

        return {
          ...prev,
          data: newData,
          errors: validation.errors,
          isDirty,
          isValid: validation.isValid,
        };
      });
    },
    [initialData]
  );

  const validateField = useCallback((field: keyof T, value: any) => {
    const error = formManager.current.validateField(field, value);
    setState(prev => ({
      ...prev,
      errors: { ...prev.errors, [field]: error || '' },
    }));
    return error;
  }, []);

  const setErrors = useCallback(
    (errors: Record<string, string>) => {
      setState(prev => ({ ...prev, errors }));
      onValidationError?.(errors);
    },
    [onValidationError]
  );

  const reset = useCallback(() => {
    const resetData = formManager.current.reset();
    setState({
      data: resetData,
      errors: {},
      isDirty: false,
      isSubmitting: false,
      isValid: true,
    });
  }, []);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      const validation = formManager.current.validate(state.data);
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }

      if (onSubmit) {
        setState(prev => ({ ...prev, isSubmitting: true }));
        try {
          await onSubmit(state.data);
        } catch (error) {
          console.error('Form submission error:', error);
        } finally {
          setState(prev => ({ ...prev, isSubmitting: false }));
        }
      }
    },
    [state.data, onSubmit, setErrors]
  );

  return {
    ...state,
    updateField,
    validateField,
    setErrors,
    reset,
    handleSubmit,
  };
}
