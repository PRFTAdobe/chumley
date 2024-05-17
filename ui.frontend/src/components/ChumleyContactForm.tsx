import React from 'react';
import {
  CoreComponentModel,
  RoutedModel,
} from 'aem-react-core-wcm-components-base';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ChumleyButton from '@/components/ChumleyButton';
import { AuthoringUtils } from '@adobe/aem-spa-page-model-manager';
import './ChumleyContactForm.css';
import classNames from 'classnames';

interface ChumleyContactFormProps extends CoreComponentModel, RoutedModel {
  commentsPlaceholder?: string;
  emailPlaceholder?: string;
  namePlaceholder?: string;
  submitButtonText?: string;
}

const schema = yup.object({
  comments: yup.string(),
  email: yup.string().required('Email is required').email('Email is invalid'),
  name: yup.string().required('Name is required'),
});

const ChumleyContactForm = ({
  baseCssClass = 'chumley-contact-form',
  commentsPlaceholder = 'Comments',
  emailPlaceholder = 'Email',
  id,
  namePlaceholder = 'Name',
  submitButtonText = 'Submit',
}: ChumleyContactFormProps): React.JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<{
    comments?: string;
    email: string;
    name: string;
  }> = (data) => {
    // eslint-disable-next-line no-alert
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div className={baseCssClass} id={id}>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form className="chumley-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="chumley-form__field">
          <input
            className={classNames('chumley-form__control', {
              'chumley-form__control--invalid': errors.name,
            })}
            placeholder={namePlaceholder}
            {...register('name')}
          />
          {errors.name && (
            <span className="chumley-form__feedback" role="alert">
              {errors.name?.message}
            </span>
          )}
        </div>
        <div className="chumley-form__field">
          <input
            className={classNames('chumley-form__control', {
              'chumley-form__control--invalid': errors.email,
            })}
            placeholder={emailPlaceholder}
            {...register('email')}
            type="email"
          />
          {errors.email && (
            <span className="chumley-form__feedback" role="alert">
              {errors.email?.message}
            </span>
          )}
        </div>
        <div className="chumley-form__field">
          <textarea
            className="chumley-form__control"
            cols={20}
            placeholder={commentsPlaceholder}
            rows={10}
            {...register('comments')}
          />
        </div>
        <ChumleyButton
          isInEditor={AuthoringUtils.isInEditor()}
          text={submitButtonText}
          type="submit"
        />
      </form>
    </div>
  );
};

export default ChumleyContactForm;
