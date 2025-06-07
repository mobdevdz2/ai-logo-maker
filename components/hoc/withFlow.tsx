import React, { useState, useCallback } from "react";
import z, { AnyZodObject, ZodEffects, ZodError, ZodIssue, ZodType } from "zod";

type FormsSequence<T> = {
  [key in keyof T]: ZodEffects<ZodType<T[key]>>;
};

type FormHandlers<T> = {
  [key in keyof T]: {
    onSuccess?: (data: T[key]) => void;
    onError?: (error?: ZodError<T[key]> | ZodIssue) => void;
  };
};

interface Props<T> {
  formsSequence: FormsSequence<T>;
  formHandlers: FormHandlers<T>;
  onFinish?: (data: T) => void;
  onCancel?: () => void;
  renderForm?: (
    stepKey: keyof T,
    schema: ZodEffects<ZodType<T[keyof T]>>,
    onSubmit: (data: any) => void,
    onBack: () => void,
    isFirst: boolean,
    isLast: boolean
  ) => React.ReactNode;
}

const withFlow = <T extends Record<string, any>>({
  formsSequence,
  formHandlers,
  onFinish,
  onCancel,
  renderForm
}: Props<T>): React.ReactElement => {
  const steps = Object.keys(formsSequence) as (keyof T)[];
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<Partial<T>>({});
  const [errors, setErrors] = useState<Partial<Record<keyof T, ZodError<T[keyof T]>>>>({});

  const currentStep = steps[currentStepIndex];
  const currentSchema = formsSequence[currentStep];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === steps.length - 1;

  const handleStepSubmit = useCallback((stepData: any) => {
    try {
      // Validate the current step data
      const validatedData = currentSchema.parse(stepData);
      
      // Clear any previous errors for this step
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[currentStep];
        return newErrors;
      });

      // Update form data
      const updatedFormData = {
        ...formData,
        [currentStep]: validatedData
      };
      setFormData(updatedFormData);

      // Call step success handler
      const handler = formHandlers[currentStep];
      handler?.onSuccess?.(validatedData);

      if (isLast) {
        // All steps completed
        onFinish?.(updatedFormData as T);
      } else {
        // Move to next step
        setCurrentStepIndex(prev => prev + 1);
      }
    } catch (error) {
      if (error instanceof ZodError) {
        setErrors(prev => ({
          ...prev,
          [currentStep]: error
        }));
        
        // Call step error handler
        const handler = formHandlers[currentStep];
        handler?.onError?.(error);
      }
    }
  }, [currentStep, currentSchema, formData, formHandlers, isLast, onFinish]);

  const handleBack = useCallback(() => {
    if (!isFirst) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [isFirst]);

  const handleCancel = useCallback(() => {
    setCurrentStepIndex(0);
    setFormData({});
    setErrors({});
    onCancel?.();
  }, [onCancel]);

  // Default form renderer if none provided
  const defaultRenderForm = (
    stepKey: keyof T,
    schema: ZodEffects<ZodType<T[keyof T]>>,
    onSubmit: (data: any) => void,
    onBack: () => void,
    isFirst: boolean,
    isLast: boolean
  ) => (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Step: {String(stepKey)}</h3>
      <p>Please implement your form UI here</p>
      
      {errors[stepKey] && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          <h4>Validation Errors:</h4>
          <ul>
            {errors[stepKey]?.issues.map((issue, index) => (
              <li key={index}>
                {issue.path.join('.')}: {issue.message}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div style={{ marginTop: '20px' }}>
        {!isFirst && (
          <button onClick={onBack} style={{ marginRight: '10px' }}>
            Back
          </button>
        )}
        <button onClick={() => onSubmit({})}>
          {isLast ? 'Finish' : 'Next'}
        </button>
        <button onClick={handleCancel} style={{ marginLeft: '10px' }}>
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          {steps.map((step, index) => (
            <div
              key={String(step)}
              style={{
                padding: '8px 16px',
                backgroundColor: index === currentStepIndex ? '#007bff' : '#f8f9fa',
                color: index === currentStepIndex ? 'white' : 'black',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              {String(step)} {index < currentStepIndex ? '✓' : ''}
            </div>
          ))}
        </div>
        <div style={{ fontSize: '14px', color: '#666' }}>
          Step {currentStepIndex + 1} of {steps.length}
        </div>
      </div>

      {(renderForm || defaultRenderForm)(
        currentStep,
        currentSchema,
        handleStepSubmit,
        handleBack,
        isFirst,
        isLast
      )}
    </div>
  );
};

export default withFlow;