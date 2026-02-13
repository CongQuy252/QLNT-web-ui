import { useEffect } from 'react';
import {
  type DefaultValues,
  type FieldValues,
  type Path,
  type Resolver,
  type SubmitHandler,
  useForm,
} from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodObject, z } from 'zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export type FieldType = 'text' | 'number' | 'textarea' | 'select' | 'custom';

export interface FormField<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  disabled?: boolean;
  render?: (form: ReturnType<typeof useForm<T>>) => React.ReactNode;
}

interface CommonFormDialogProps<S extends ZodObject> {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isEditMode: boolean;

  schema: S;
  defaultValues: DefaultValues<z.input<S>>;
  fields: FormField<z.input<S>>[];

  titleCreate: string;
  titleEdit: string;

  onCreate: (data: z.output<S>) => void;
  onUpdate: (data: z.output<S>) => void;
}

export function CommonFormDialog<S extends ZodObject>({
  isOpen,
  setIsOpen,
  isEditMode,
  schema,
  defaultValues,
  fields,
  titleCreate,
  titleEdit,
  onCreate,
  onUpdate,
}: CommonFormDialogProps<S>) {
  type FormInput = z.input<S>;
  type FormOutput = z.output<S>;

  const form = useForm<FormInput>({
    resolver: zodResolver(schema) as unknown as Resolver<FormInput>,
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (isOpen) reset(defaultValues);
  }, [isOpen, defaultValues, reset]);

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    const parsed = schema.parse(data) as FormOutput;
    if (isEditMode) {
      onUpdate(parsed);
    } else {
      onCreate(parsed);
    }

    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditMode ? titleEdit : titleCreate}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <Label isRequired={field.required}>{field.label}</Label>

              {field.type === 'textarea' && <Textarea {...register(field.name)} />}

              {field.type === 'number' && <Input type="number" {...register(field.name)} />}

              {field.type === 'text' && <Input {...register(field.name)} />}

              {errors[field.name] && (
                <p className="text-xs text-red-500">{errors[field.name]?.message as string}</p>
              )}
            </div>
          ))}

          <Button type="submit" className="w-full">
            {isEditMode ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
